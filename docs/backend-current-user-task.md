# Backend Task Specification: Current User Session API

## Objective
Provide a lightweight, JSON-ready REST endpoint so the React frontend (`mpindustry-ui`) can query the authenticated user's profile and roles using the existing `JSESSIONID` session cookie without relying on HTML template rendering.

> **CRITICAL ARCHITECTURAL NOTE**: Do not modify existing legacy controllers. Add a new `@RestController` under `mpindustry-web` or `mpindustry-common`.

---

## 1. Endpoint Specification

- **Path**: `GET /mpmsme/api/session/current-user`
- **Authentication**: Required (`authenticated()` or `permitAll()` with null check)
- **Content-Type**: `application/json`

### Success Response (200 OK — Authenticated User)
```json
{
  "authenticated": true,
  "username": "user123",
  "displayName": "Ramesh Sharma",
  "roles": [
    "ROLE_APPLICANT"
  ],
  "locale": "en_US",
  "firstPasswordChangeRequired": false
}
```

### Unauthenticated Response (200 OK or 401 Unauthorized)
```json
{
  "authenticated": false,
  "username": null,
  "displayName": null,
  "roles": [],
  "locale": "en_US",
  "firstPasswordChangeRequired": false
}
```

---

## 2. Spring Boot Implementation Code

### Java DTO: `CurrentUserDto.java`
**Location**: `mpindustry-common/src/main/java/com/mapit/mpindustry/common/dto/CurrentUserDto.java`
```java
package com.mapit.mpindustry.common.dto;

import java.io.Serializable;
import java.util.List;

public class CurrentUserDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean authenticated;
    private String username;
    private String displayName;
    private List<String> roles;
    private String locale;
    private boolean firstPasswordChangeRequired;

    public CurrentUserDto() {}

    public CurrentUserDto(boolean authenticated, String username, String displayName, 
                          List<String> roles, String locale, boolean firstPasswordChangeRequired) {
        this.authenticated = authenticated;
        this.username = username;
        this.displayName = displayName;
        this.roles = roles;
        this.locale = locale;
        this.firstPasswordChangeRequired = firstPasswordChangeRequired;
    }

    public boolean isAuthenticated() { return authenticated; }
    public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }

    public String getLocale() { return locale; }
    public void setLocale(String locale) { this.locale = locale; }

    public boolean isFirstPasswordChangeRequired() { return firstPasswordChangeRequired; }
    public void setFirstPasswordChangeRequired(boolean firstPasswordChangeRequired) { 
        this.firstPasswordChangeRequired = firstPasswordChangeRequired; 
    }
}
```

### Spring REST Controller: `SessionApiController.java`
**Location**: `mpindustry-web/src/main/java/com/mapit/mpindustry/web/controller/SessionApiController.java`
```java
package com.mapit.mpindustry.web.controller;

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

        // Extract user details if available in session
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

## 3. Spring Security Configuration (`WebSecurityConfig.java`)
Ensure `/api/session/current-user` is permitted for all requests (so unauthenticated checks return JSON instead of redirecting to login):

```java
.requestMatchers("/api/session/current-user").permitAll()
```
