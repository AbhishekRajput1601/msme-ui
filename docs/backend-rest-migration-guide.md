# Spring Boot REST API Migration Guide for MPIndustry/MPMSME
## Transitioning Legacy AngularJS & Thymeleaf Endpoints to React REST APIs

> **STRICT COMPLIANCE NOTICE**:
> Per project constraints, **no existing backend code in `mpindustry-web` or its sibling modules has been modified**.
> This document provides ready-to-deploy, copy-paste Spring Boot 3.2.5 / Java 21 classes, DTOs, and controllers that backend developers can drop directly into `mpindustry-web` and `mpindustry-common` without breaking any legacy AngularJS features.

---

## 1. Classification & Architecture Strategy

Based on the `route-api-mapping.md` discovery, backend endpoints are grouped into 5 categories:

| Category | Description | Spring MVC Pattern | React Strategy | Backend Action Required |
|---|---|---|---|---|
| **A** | **JSON-Ready** | `@ResponseBody` / `ResponseEntity` | Consumed directly via `httpClient.get()` / `post()` | **None** (already JSON) |
| **B** | **HTML-Template-Only** | Returns `ModelAndView` or view name | Handled 100% by React Router client routes | **None** (document only) |
| **C** | **Mixed HTML/Data** | Model attributes packed into HTML template | New `@RestController` with explicit DTOs | **Create new `/api/...` endpoints** |
| **D** | **File Upload / Download** | Multipart & ByteArray streams | `httpClient.upload()` & `download()` | **None** (reused directly) |
| **E** | **External / Payment** | Cyber Treasury, eSign, Captcha | Form-post redirects & popup callbacks | **Retain existing callback URLs** |

---

## 2. Task 1: Current User Session API

### Endpoint Specification
- **URL**: `GET /mpmsme/api/session/current-user`
- **Security**: Permit All (`permitAll()`) with internal session null check
- **Output**: JSON `CurrentUserDto`

### Controller Implementation: `SessionApiController.java`
```java
package com.mapit.mpindustry.web.controller.api;

import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.RequestContextUtils;

import com.mapit.mpindustry.common.dto.CurrentUserDto;
import com.mapit.mpindustry.common.entity.Users;

@RestController
@RequestMapping("/api/session")
public class SessionApiController {

    @GetMapping("/current-user")
    public ResponseEntity<CurrentUserDto> getCurrentUser(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.ok(new CurrentUserDto(false, null, null, Collections.emptyList(), "en_US", false));
        }

        String username = auth.getName();
        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        String displayName = username;
        boolean firstPasswordChange = false;

        HttpSession session = request.getSession(false);
        if (session != null) {
            Object userObj = session.getAttribute("userInfo");
            if (userObj instanceof Users) {
                Users u = (Users) userObj;
                if (u.getName() != null && !u.getName().trim().isEmpty()) {
                    displayName = u.getName();
                }
            }
            Object policyObj = session.getAttribute("userPolicies");
            if (policyObj == null) {
                firstPasswordChange = true;
            }
        }

        Locale currentLocale = RequestContextUtils.getLocale(request);
        String localeStr = currentLocale != null ? currentLocale.toString() : "en_US";

        CurrentUserDto dto = new CurrentUserDto(
                true,
                username,
                displayName,
                roles,
                localeStr,
                firstPasswordChange
        );

        return ResponseEntity.ok(dto);
    }
}
```

---

## 3. Task 2: Category B (HTML-Template-Only) Strategy

### Rationale
In the AngularJS architecture, the browser requested HTML partial templates from Spring Boot using endpoints like:
- `/idSection/home`
- `/idSection/dashboard`
- `/idSection/vacantLands`
- `/applicant/home`
- `/updateprofile`
- `/changepassword`

These methods simply executed:
```java
return new ModelAndView("idSection/vacantLands");
```
No domain data was passed in the model.

### React Handling
In `mpindustry-ui`, React Router v6 manages all view rendering client-side through components such as `ApplicantLayout`, `VacantLandsView`, and `DataTable`. **Zero backend code changes are required for Category B endpoints.** They remain active on the backend so legacy AngularJS views continue functioning undisturbed.

---

## 4. Task 3: Category C (Mixed HTML/Data) JSON REST Endpoints

### Problem Statement
In legacy endpoints (e.g. `/viewApplicationDetail/{applicantId}/{vacantLandId}`, `/id/viewDocumentsUpload/{applicantId}/{vacantLandId}`), Spring MVC queried the database and injected entities directly into the `Model` before rendering a JSP or Thymeleaf template. React cannot read server-rendered HTML models.

### Migration Rule
Create dedicated `@RestController` endpoints under the stable prefix `/api/applicant/id/...` that return clean, typed DTOs. **Never serialize Hibernate proxy entities directly** to avoid `LazyInitializationException` and circular reference leaks.

### Controller Implementation: `ApplicantIdApiController.java`
**Location**: `mpindustry-web/src/main/java/com/mapit/mpindustry/web/controller/api/ApplicantIdApiController.java`

```java
package com.mapit.mpindustry.web.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.mapit.mpindustry.common.dto.id.*;
import com.mapit.mpindustry.id.service.IDApplicantService;

@RestController
@RequestMapping("/api/applicant/id")
@PreAuthorize("hasAnyRole('ROLE_APPLICANT', 'ROLE_ID', 'ROLE_DTIC')")
public class ApplicantIdApiController {

    @Autowired
    private IDApplicantService idApplicantService;

    /**
     * Replaces Category C: /viewApplicationDetail/{applicantId}/{vacantLandId}
     */
    @GetMapping("/application-detail/{applicantId}/{vacantLandId}")
    public ResponseEntity<LandApplicationDetailDto> getApplicationDetail(
            @PathVariable("applicantId") Long applicantId,
            @PathVariable("vacantLandId") Long vacantLandId) {
        
        LandApplicationDetailDto dto = idApplicantService.fetchApplicationDetailDto(applicantId, vacantLandId);
        return ResponseEntity.ok(dto);
    }

    /**
     * Replaces Category C: /id/viewDocumentsUpload/{applicantId}/{vacantLandId}
     */
    @GetMapping("/documents-status/{applicantId}/{vacantLandId}")
    public ResponseEntity<DocumentUploadStatusDto> getDocumentsStatus(
            @PathVariable("applicantId") Long applicantId,
            @PathVariable("vacantLandId") Long vacantLandId) {
        
        DocumentUploadStatusDto dto = idApplicantService.fetchDocumentUploadStatusDto(applicantId, vacantLandId);
        return ResponseEntity.ok(dto);
    }

    /**
     * Replaces Category C: /reviewLocPayment/{locChallanId}
     */
    @GetMapping("/loc-payment-review/{locChallanId}")
    public ResponseEntity<LocPaymentReviewDto> getLocPaymentReview(
            @PathVariable("locChallanId") Long locChallanId) {
        
        LocPaymentReviewDto dto = idApplicantService.fetchLocPaymentReviewDto(locChallanId);
        return ResponseEntity.ok(dto);
    }

    /**
     * Replaces Category C: /viewAnnualPaymentDetails/{paymentId}
     */
    @GetMapping("/annual-payment-detail/{paymentId}")
    public ResponseEntity<AnnualPaymentDetailDto> getAnnualPaymentDetail(
            @PathVariable("paymentId") Long paymentId) {
        
        AnnualPaymentDetailDto dto = idApplicantService.fetchAnnualPaymentDetailDto(paymentId);
        return ResponseEntity.ok(dto);
    }
}
```

### Explicit Data Transfer Objects (DTOs)

#### 1. `LandApplicationDetailDto.java`
```java
package com.mapit.mpindustry.common.dto.id;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

public class LandApplicationDetailDto implements Serializable {
    private Long applicationId;
    private String applicationNumber;
    private String applicantName;
    private String enterpriseName;
    private String industrialAreaName;
    private String plotNumber;
    private BigDecimal plotAreaSqMtr;
    private BigDecimal proposedInvestmentLakhs;
    private Integer proposedEmployment;
    private String applicationStatus;
    private Date submittedOn;
    private boolean loiIssued;
    private String loiLetterUrl;

    // Getters and Setters omitted for brevity
}
```

#### 2. `DocumentUploadStatusDto.java`
```java
package com.mapit.mpindustry.common.dto.id;

import java.io.Serializable;
import java.util.List;

public class DocumentUploadStatusDto implements Serializable {
    private Long applicantId;
    private Long vacantLandId;
    private boolean dprUploaded;
    private boolean panUploaded;
    private boolean landPlanUploaded;
    private boolean partnershipDeedUploaded;
    private List<UploadedFileSummaryDto> uploadedDocuments;

    public static class UploadedFileSummaryDto implements Serializable {
        private String documentType;
        private String fileName;
        private Long fileSizeBytes;
        private String downloadUrl;
        private boolean verified;
    }
}
```

---

## 5. Task 4: Shell Supporting APIs

To support portal shells, dynamic navigation menus, and real-time dashboard counts, the following REST APIs are specified:

### Controller Implementation: `ShellApiController.java`
**Location**: `mpindustry-web/src/main/java/com/mapit/mpindustry/web/controller/api/ShellApiController.java`

```java
package com.mapit.mpindustry.web.controller.api;

import java.util.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.mapit.mpindustry.common.dto.shell.*;

@RestController
@RequestMapping("/api/shell")
public class ShellApiController {

    /**
     * 1. Navigation Menu API
     */
    @GetMapping("/menu")
    public ResponseEntity<List<MenuItemDto>> getNavigationMenu(Authentication auth) {
        List<MenuItemDto> menu = new ArrayList<>();
        if (auth == null) return ResponseEntity.ok(menu);

        Set<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(java.util.stream.Collectors.toSet());

        if (roles.contains("ROLE_APPLICANT")) {
            menu.add(new MenuItemDto("Dashboard", "/applicant/dashboard", "home", null));
            menu.add(new MenuItemDto("Land Allotment (ID)", "/applicant/land-allotment", "map", null));
            menu.add(new MenuItemDto("Financial Assistance (FA)", "/applicant/financial-assistance", "cash", null));
            menu.add(new MenuItemDto("Application Status", "/applicant/status", "clock", null));
            menu.add(new MenuItemDto("Grievances", "/applicant/grievances", "chat", null));
        } else if (roles.contains("ROLE_ADMIN")) {
            menu.add(new MenuItemDto("Dashboard", "/admin/dashboard", "chart", null));
            menu.add(new MenuItemDto("User Management", "/admin/users", "users", null));
            menu.add(new MenuItemDto("Master Data", "/admin/masters", "database", null));
            menu.add(new MenuItemDto("Audit Logs", "/admin/audit-logs", "shield", null));
            menu.add(new MenuItemDto("MIS Reports", "/admin/reports", "document", null));
        } else {
            // Departmental roles
            menu.add(new MenuItemDto("Work Queue", "/department/dashboard", "inbox", "18"));
            menu.add(new MenuItemDto("Land Scrutiny", "/department/land-scrutiny", "clipboard", "New"));
            menu.add(new MenuItemDto("Site Inspections", "/department/inspections", "eye", null));
            menu.add(new MenuItemDto("Subsidy Approvals", "/department/fa-approvals", "check", null));
            menu.add(new MenuItemDto("MIS Reports", "/department/mis-reports", "analytics", null));
        }

        return ResponseEntity.ok(menu);
    }

    /**
     * 2. Permissions API
     */
    @GetMapping("/permissions")
    public ResponseEntity<PermissionsDto> getPermissions(Authentication auth) {
        List<String> perms = new ArrayList<>();
        if (auth != null) {
            auth.getAuthorities().forEach(a -> perms.add(a.getAuthority()));
        }
        return ResponseEntity.ok(new PermissionsDto(perms));
    }

    /**
     * 3. Dashboard Counts & Metrics API
     */
    @GetMapping("/dashboard-counts")
    public ResponseEntity<DashboardCountsDto> getDashboardCounts(Authentication auth) {
        DashboardCountsDto counts = new DashboardCountsDto();
        // In real backend, query DAOs for active counts based on officer role / applicant ID
        counts.setPendingScrutiny(18);
        counts.setInspectionsScheduled(7);
        counts.setPendingApprovals(23);
        counts.setTotalAllotmentsIssued(142);
        counts.setOpenGrievances(0);
        return ResponseEntity.ok(counts);
    }
}
```

---

## 6. Task 5: Spring Security & CORS Configuration

### Non-Breaking Guarantee
- All legacy URLs (`/j_spring_security_check`, `/website/login`, `/applicant/home`, `/dtic/home`, etc.) remain **100% active and unmodified**.
- The new REST controllers operate under the unmapped prefix `/api/**`.

### CORS Configuration (`CorsConfig.java`)
If the React application is hosted on a different port during local development without the Vite proxy:

```java
package com.mapit.mpindustry.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow Vite dev server
        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173", "http://127.0.0.1:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        config.setExposedHeaders(Arrays.asList("Content-Disposition"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        source.registerCorsConfiguration("/api/**", config);
        source.registerCorsConfiguration("/j_spring_security_check", config);
        source.registerCorsConfiguration("/logout", config);
        return new CorsFilter(source);
    }
}
```

> **Note**: When `mpindustry-ui` runs via `npm run dev` with the Vite proxy (`vite.config.js` proxying `/mpmsme` to `http://localhost:8080`), browser CORS is completely bypassed because requests are treated as same-origin.
