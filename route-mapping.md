# MPIndustry & MPMSME Route Mapping Document
## Legacy AngularJS Hash Routes to Modern React Browser Routes

> **Context**: This document provides a comprehensive inventory and transition mapping from the legacy AngularJS 1.x hash-based routing system (`/mpmsme/<role>/home#/<route>`) to the modern React Router v6 browser routing architecture (`/mpmsme/<route>`).

---

## 1. Executive Architecture Summary

| Property | Legacy AngularJS Architecture | Modern React Router Architecture |
|---|---|---|
| **Routing Mode** | Hash-based (`window.location.hash`) | HTML5 History Browser Routing (`pushState`/`replaceState`) |
| **Backend Redirect Entry** | Spring Security `MPIndustryAuthenticationSuccessHandler` sends 302 to `/<role>/home#/dashboard` | Direct browser navigation or seamless transition via `LegacyHashRedirect` |
| **State Guarding** | AngularJS `$routeChangeStart` + `sessionStorage` | React `ProtectedRoute` with memory-only `useAuth()` |
| **Session Tracking** | AngularJS `IdleProvider.idle(1800)` with popup alerts | React `useSessionTimeout()` with live countdown modal dialog |
| **Transitional Support** | Requires browser refresh | Automatic catch & forward via `LegacyHashRedirect.jsx` |

---

## 2. Global Role-to-Dashboard Mapping

Mapped in `src/routes/roleRoutes.js`:

| Role Key | Spring Security Landing URL | New React Browser Route | Layout Shell |
|---|---|---|---|
| **ROLE_APPLICANT** | `/applicant/home#/dashboard` | `/applicant/dashboard` | `ApplicantLayout` |
| **ROLE_ADMIN** | `/adminSection/home#/dashboard` | `/admin/dashboard` | `AdminLayout` |
| **ROLE_DTIC** | `/dtic/home#/dashboard` | `/department/dtic/dashboard` | `DepartmentLayout` |
| **ROLE_DTFC** | `/dtfc/home#/dashboard` | `/department/dtfc/dashboard` | `DepartmentLayout` |
| **ROLE_BANK** | `/bank/home#/dashboard` | `/department/bank/dashboard` | `DepartmentLayout` |
| **ROLE_ZONAL** | `/zonal/home#/dashboard` | `/department/zonal/dashboard` | `DepartmentLayout` |
| **ROLE_SECTION** | `/section/home#/dashboard` | `/department/section/dashboard` | `DepartmentLayout` |
| **ROLE_LEGAL** | `/legalSection/home#/dashboard` | `/department/legal/dashboard` | `DepartmentLayout` |
| **ROLE_LEGAL_OIC** | `/legalOIC/home#/dashboard` | `/department/legal-oic/dashboard` | `DepartmentLayout` |
| **ROLE_BUDGET_PLANNING** | `/budgetPlanning/home#/dashboard` | `/department/budget-planning/dashboard` | `DepartmentLayout` |
| **ROLE_CM_CS** | `/cmcs/cmcshome#/dashboard` | `/department/cmcs/dashboard` | `DepartmentLayout` |
| **ROLE_CM_CS_HO** | `/cmcsHo/cmcshome2#/dashboard` | `/department/cmcs-ho/dashboard` | `DepartmentLayout` |
| **ROLE_EMPLOYEE** | `/employee/home#/dashboard` | `/department/employee/dashboard` | `DepartmentLayout` |
| **ROLE_MSEFC** | `/msefc/home#/dashboard` | `/department/msefc/dashboard` | `DepartmentLayout` |
| **ROLE_TEXTILE** | `/textile/home#/dashboard` | `/department/textile/dashboard` | `DepartmentLayout` |
| **ROLE_COORDINATION** | `/coordinationSection/home#/dashboard` | `/department/coordination/dashboard` | `DepartmentLayout` |
| **ROLE_COORDINATION_OFFICER** | `/coordinationOfficer/home#/dashboard` | `/department/coordination-officer/dashboard` | `DepartmentLayout` |
| **ROLE_COORDINATION_DD** | `/coordinationDD/home#/dashboard` | `/department/coordination-dd/dashboard` | `DepartmentLayout` |
| **ROLE_COORDINATION_JD** | `/coordinationJD/home#/dashboard` | `/department/coordination-jd/dashboard` | `DepartmentLayout` |
| **ROLE_IC_OFFICE** | `/icOffice/home#/dashboard` | `/department/ic-office/dashboard` | `DepartmentLayout` |
| **ROLE_ACCOUNT** | `/account/home#/dashboard` | `/department/account/dashboard` | `DepartmentLayout` |
| **ROLE_AUDIT** | `/auditSection/home#/dashboard` | `/department/audit/dashboard` | `DepartmentLayout` |
| **ROLE_AUDIT_OFFICER** | `/auditOfficer/home#/dashboard` | `/department/audit-officer/dashboard` | `DepartmentLayout` |
| **ROLE_ID** | `/idSection/home#/dashboard` | `/department/id/dashboard` | `DepartmentLayout` |
| **ROLE_MBFC** | `/mbfc/home#/dashboard` | `/department/mbfc/dashboard` | `DepartmentLayout` |
| **ROLE_MSME** | `/msme/home#/dashboard` | `/department/msme/dashboard` | `DepartmentLayout` |
| **ROLE_GRIEVANCE_APPLICANT** | `/grievanceApplicant/home#/dashboard` | `/applicant/grievances` | `ApplicantLayout` |
| **ROLE_MSME_AWARD_COMMITEE_MEMBER** | `/committeMember/home#/dashboard` | `/department/msme-awards/dashboard` | `DepartmentLayout` |
| **ROLE_ZONAL_OPERATOR** | `/zonaloperator/home#/dashboard` | `/department/zonal-operator/dashboard` | `DepartmentLayout` |
| **ROLE_STARTUP_CENTER** | `/startupCenter/home#/dashboard` | `/department/startup-center/dashboard` | `DepartmentLayout` |
| **ROLE_FA** | `/fa/home#/dashboard` | `/department/fa/dashboard` | `DepartmentLayout` |
| **ROLE_COLLECTOR** | `/collector/home` | `/department/collector/dashboard` | `DepartmentLayout` |
| **ROLE_LDM** | `/ldm/home` | `/department/ldm/dashboard` | `DepartmentLayout` |
| **ROLE_SECRETARY** | `/secretary/home` | `/department/secretary/dashboard` | `DepartmentLayout` |

---

## 3. Detailed Route Inventory per Module

### Accounts Section & Payments
- **Angular File**: `mpindustry-web/src/main/webapp/angular/account/accountRouting.js`
- **Authorized Role**: `ROLE_ACCOUNT`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/account/profile` | Account Security & Settings |
| `#/changepassword` | `/department/account/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/account/first-password-change` | Account Security & Settings |
| `#/success` | `/department/account/success` | Dashboard / Overview |
| `#/dashboard` | `/department/account/dashboard` | Dashboard / Overview |
| `#/subsidyclaimlist` | `/department/account/subsidyclaimlist` | Subsidy / Incentive Processing |
| `#/viewprintsubsidyclaim/:id` | `/department/account/viewprintsubsidyclaim/:id` | Subsidy / Incentive Processing |
| `#/uploadpaymentorder/:id` | `/department/account/uploadpaymentorder/:id` | Challan & Fee Verification |
| `#/letterList` | `/department/account/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/account/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/account/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/account/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### System Administration
- **Angular File**: `mpindustry-web/src/main/webapp/angular/admuser/AdminRouting.js`
- **Authorized Role**: `ROLE_ADMIN`
- **Target Layout**: `AdminLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/changepassword` | `/admin/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/admin/first-password-change` | Account Security & Settings |
| `#/success` | `/admin/success` | Dashboard / Overview |
| `#/dashboard` | `/admin/dashboard` | Dashboard / Overview |
| `#/dashboardFacilityWise` | `/admin/dashboardFacilityWise` | Dashboard / Overview |
| `#/dashboardDistrictWise` | `/admin/dashboardDistrictWise` | Dashboard / Overview |
| `#/dashboardDistrictOxgSource` | `/admin/dashboardDistrictOxgSource` | Dashboard / Overview |
| `#/dashboardDistrictFacilityType` | `/admin/dashboardDistrictFacilityType` | Dashboard / Overview |
| `#/addOfficer` | `/admin/addOfficer` | Dashboard / Overview |
| `#/hoList` | `/admin/hoList` | Dashboard / Overview |
| `#/officerList` | `/admin/officerList` | Dashboard / Overview |
| `#/zonalList` | `/admin/zonalList` | Dashboard / Overview |
| `#/dticList` | `/admin/dticList` | Dashboard / Overview |
| `#/applicantList` | `/admin/applicantList` | Dashboard / Overview |
| `#/viewHo/:userId` | `/admin/viewHo/:userId` | Dashboard / Overview |
| `#/viewOfficer/:userId` | `/admin/viewOfficer/:userId` | Dashboard / Overview |
| `#/viewZonal/:userId` | `/admin/viewZonal/:userId` | Dashboard / Overview |
| `#/viewDtic/:userId` | `/admin/viewDtic/:userId` | Dashboard / Overview |
| `#/viewApplicant/:userId` | `/admin/viewApplicant/:userId` | Application Scrutiny & Details |
| `#/resetPassword/:userType/:userId` | `/admin/resetPassword/:userType/:userId` | Account Security & Settings |
| `#/officeList` | `/admin/officeList` | Dashboard / Overview |
| `#/viewOffice/:officeId` | `/admin/viewOffice/:officeId` | Dashboard / Overview |
| `#/addOffice` | `/admin/addOffice` | Dashboard / Overview |
| `#/externalOfficerList` | `/admin/externalOfficerList` | Dashboard / Overview |
| `#/supplyNameList` | `/admin/supplyNameList` | Dashboard / Overview |
| `#/viewSupplyNameAdmin/:id` | `/admin/viewSupplyNameAdmin/:id` | Dashboard / Overview |
| `#/editSupplyNameAdmin/:id` | `/admin/editSupplyNameAdmin/:id` | Dashboard / Overview |
| `#/viewSupplierNameAdmin/:id` | `/admin/viewSupplierNameAdmin/:id` | Dashboard / Overview |
| `#/supplierNameListAdmin` | `/admin/supplierNameListAdmin` | Dashboard / Overview |
| `#/ox1FormAdmin` | `/admin/ox1FormAdmin` | Dashboard / Overview |
| `#/ox2FormAdmin` | `/admin/ox2FormAdmin` | Dashboard / Overview |
| `#/ox3FormAdmin` | `/admin/ox3FormAdmin` | Dashboard / Overview |
| `#/ox4FormAdmin` | `/admin/ox4FormAdmin` | Dashboard / Overview |
| `#/editOx1FormAdmin` | `/admin/editOx1FormAdmin` | Dashboard / Overview |
| `#/editOx2FormAdmin` | `/admin/editOx2FormAdmin` | Dashboard / Overview |
| `#/editOx3FormAdmin` | `/admin/editOx3FormAdmin` | Dashboard / Overview |
| `#/editOx4FormAdmin` | `/admin/editOx4FormAdmin` | Dashboard / Overview |
| `#/editSupplierNameAdmin/:id` | `/admin/editSupplierNameAdmin/:id` | Dashboard / Overview |
| `#/report1` | `/admin/report1` | Dashboard / Overview |
| `#/report2` | `/admin/report2` | Dashboard / Overview |
| `#/tankerList` | `/admin/tankerList` | Dashboard / Overview |
| `#/addTankerForm` | `/admin/addTankerForm` | Dashboard / Overview |
| `#/editTankerForm/:id` | `/admin/editTankerForm/:id` | Dashboard / Overview |
| `#/tankerDetailsEntryFormAdmin` | `/admin/tankerDetailsEntryFormAdmin` | Dashboard / Overview |
| `#/supplySourceList` | `/admin/supplySourceList` | Dashboard / Overview |
| `#/tankerSupplierList` | `/admin/tankerSupplierList` | Dashboard / Overview |
| `#/addSupplySourceForm` | `/admin/addSupplySourceForm` | Dashboard / Overview |
| `#/editSupplySourceForm/:id` | `/admin/editSupplySourceForm/:id` | Dashboard / Overview |
| `#/addTankerSupplierForm` | `/admin/addTankerSupplierForm` | Dashboard / Overview |

---

### Citizen / Applicant Portal
- **Angular File**: `mpindustry-web/src/main/webapp/angular/applicant/routing.js`
- **Authorized Role**: `ROLE_APPLICANT`
- **Target Layout**: `ApplicantLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofileapplicant` | `/applicant/profile` | Account Security & Settings |
| `#/updateindustryprofileapplicant` | `/applicant/updateindustryprofileapplicant` | Account Security & Settings |
| `#/changepassword` | `/applicant/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/applicant/first-password-change` | Account Security & Settings |
| `#/success` | `/applicant/success` | Dashboard / Overview |
| `#/bank/addBankDetails` | `/applicant/bank/addBankDetails` | Dashboard / Overview |
| `#/bank/banksList` | `/applicant/bank/banksList` | Dashboard / Overview |
| `#/dashboard` | `/applicant/dashboard` | Dashboard / Overview |
| `#/mpidcServices` | `/applicant/mpidcServices` | Dashboard / Overview |
| `#/yuvaudyami` | `/applicant/yuvaudyami` | Dashboard / Overview |
| `#/newYuvaUdyamiForm` | `/applicant/newYuvaUdyamiForm` | Dashboard / Overview |
| `#/viewYuvaUdyamiDetail/:applicantId` | `/applicant/viewYuvaUdyamiDetail/:applicantId` | Dashboard / Overview |
| `#/viewYuvaDocumentDetail/:applicantId` | `/applicant/viewYuvaDocumentDetail/:applicantId` | Dashboard / Overview |
| `#/mpselfemployment` | `/applicant/mpselfemployment` | Dashboard / Overview |
| `#/newapplicantform` | `/applicant/newapplicantform` | Dashboard / Overview |
| `#/viewapplicantdetail/:applicantId` | `/applicant/viewapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/viewapplicantdetailedit/:applicantId` | `/applicant/viewapplicantdetailedit/:applicantId` | Dashboard / Overview |
| `#/viewyuapplicantdetailedit/:applicantId` | `/applicant/viewyuapplicantdetailedit/:applicantId` | Dashboard / Overview |
| `#/vieweditdocumentdetail/:applicantId` | `/applicant/vieweditdocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewEditYuvaDocumentDetail/:applicantId` | `/applicant/viewEditYuvaDocumentDetail/:applicantId` | Dashboard / Overview |
| `#/viewdocumentdetail/:applicantId` | `/applicant/viewdocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewschemedetailform/:applicantId` | `/applicant/viewschemedetailform/:applicantId` | Dashboard / Overview |
| `#/vieweditschemedetailform/:applicantId` | `/applicant/vieweditschemedetailform/:applicantId` | Dashboard / Overview |
| `#/viewprojectreportform/:applicantId` | `/applicant/viewprojectreportform/:applicantId` | Dashboard / Overview |
| `#/viewedityuvaprojectreportform/:applicantId` | `/applicant/viewedityuvaprojectreportform/:applicantId` | Dashboard / Overview |
| `#/viewyuvaprojectreportform/:applicantId` | `/applicant/viewyuvaprojectreportform/:applicantId` | Dashboard / Overview |
| `#/vieweditprojectreportform/:applicantId` | `/applicant/vieweditprojectreportform/:applicantId` | Dashboard / Overview |
| `#/viewmsmeform` | `/applicant/viewmsmeform` | Dashboard / Overview |
| `#/viewlargescaleform` | `/applicant/viewlargescaleform` | Dashboard / Overview |
| `#/fa/newapplicantform` | `/applicant/fa/newapplicantform` | Subsidy / Incentive Processing |
| `#/fa/infradevelopmetform` | `/applicant/fa/infradevelopmetform` | Subsidy / Incentive Processing |
| `#/fa/addUnitDetailsform` | `/applicant/fa/addUnitDetailsform` | Subsidy / Incentive Processing |
| `#/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | `/applicant/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/fa/newapplicantformapparel` | `/applicant/fa/newapplicantformapparel` | Subsidy / Incentive Processing |
| `#/fa/viewfaschemesdetailsunit/:applicationId` | `/applicant/fa/viewfaschemesdetailsunit/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaschemesdetailsapparel/:applicationId` | `/applicant/fa/viewfaschemesdetailsapparel/:applicationId` | Application Scrutiny & Details |
| `#/fa/fetchfaschemes/:applicationId` | `/applicant/fa/fetchfaschemes/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfadocumentsuploadunit/:applicationId` | `/applicant/fa/viewfadocumentsuploadunit/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfadocumentsuploadapparel/:applicationId` | `/applicant/fa/viewfadocumentsuploadapparel/:applicationId` | Application Scrutiny & Details |
| `#/fa/newapplicantsingleform/:establishmentType` | `/applicant/fa/newapplicantsingleform/:establishmentType` | Subsidy / Incentive Processing |
| `#/fa/viewfaapplicantdetailunit/:applicationId` | `/applicant/fa/viewfaapplicantdetailunit/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaDisbursementUnit/:applicationId/:establishmentType` | `/applicant/fa/viewfaDisbursementUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/fa/viewfaacceptanceamountdetailunit/:applicationId/:establishmentType` | `/applicant/fa/viewfaacceptanceamountdetailunit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantdetailunitnew/:applicationId` | `/applicant/fa/viewfaapplicantdetailunitnew/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantdetailapparel/:applicationId` | `/applicant/fa/viewfaapplicantdetailapparel/:applicationId` | Application Scrutiny & Details |
| `#/fa/newstartupfundAssistanceform` | `/applicant/fa/newstartupfundAssistanceform` | Subsidy / Incentive Processing |
| `#/fa/reApplyStartupfundAssistanceform` | `/applicant/fa/reApplyStartupfundAssistanceform` | Subsidy / Incentive Processing |
| `#/fa/editFaNewStartupFundAssistance/:id` | `/applicant/fa/editFaNewStartupFundAssistance/:id` | Subsidy / Incentive Processing |
| `#/fa/editIncubatorAssistanceApplication/:id` | `/applicant/fa/editIncubatorAssistanceApplication/:id` | Subsidy / Incentive Processing |
| `#/fa/printFAIncubatorFundingAssistance/:id` | `/applicant/fa/printFAIncubatorFundingAssistance/:id` | Subsidy / Incentive Processing |
| `#/fa/printFAStartupFundingAssistance/:id` | `/applicant/fa/printFAStartupFundingAssistance/:id` | Subsidy / Incentive Processing |
| `#/fa/incubatorAssistanceApplicationForm` | `/applicant/fa/incubatorAssistanceApplicationForm` | Subsidy / Incentive Processing |
| `#/fa/managestartupfundAssistanceform` | `/applicant/fa/managestartupfundAssistanceform` | Subsidy / Incentive Processing |
| `#/fa/manageIncubatorDetailList` | `/applicant/fa/manageIncubatorDetailList` | Subsidy / Incentive Processing |
| `#/fa/viewfaapplicantdetailapparelnew/:applicationId` | `/applicant/fa/viewfaapplicantdetailapparelnew/:applicationId` | Application Scrutiny & Details |
| `#/printMMSYPage/:applicantId` | `/applicant/printMMSYPage/:applicantId` | Dashboard / Overview |
| `#/printYUPage/:applicantId` | `/applicant/printYUPage/:applicantId` | Dashboard / Overview |
| `#/id/landAllotment` | `/applicant/id/landAllotment` | Land Inventory & Allotment |
| `#/id/landAllotmentUN` | `/applicant/id/landAllotmentUN` | Land Inventory & Allotment |
| `#/id/onlinePaymentCheckStatusAll` | `/applicant/id/onlinePaymentCheckStatusAll` | Challan & Fee Verification |
| `#/printVacantLandApplicationPage/:vacantLandId` | `/applicant/printVacantLandApplicationPage/:vacantLandId` | Land Inventory & Allotment |
| `#/printVacantLandApplicationPage/:applicantId/:vacantLandId` | `/applicant/printVacantLandApplicationPage/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/landApplications` | `/applicant/id/landApplications` | Dashboard / Overview |
| `#/id/viewIdHistory/:applicantId` | `/applicant/id/viewIdHistory/:applicantId` | Dashboard / Overview |
| `#/id/landAcquisition` | `/applicant/id/landAcquisition` | Dashboard / Overview |
| `#/id/idInstruction/:applicantId/:vacantLandId` | `/applicant/id/idInstruction/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/idInstructionUL/:applicantId/:vacantLandId` | `/applicant/id/idInstructionUL/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/viewApplyForLandForm/:applicantId/:vacantLandId` | `/applicant/id/viewApplyForLandForm/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/editApplyForLandForm/:applicantId/:vacantLandId` | `/applicant/id/editApplyForLandForm/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/viewDocumentsUpload/:applicantId/:vacantLandId` | `/applicant/id/viewDocumentsUpload/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/editDocumentsUpload/:applicantId/:vacantLandId` | `/applicant/id/editDocumentsUpload/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/viewApplicationDetail/:applicantId/:vacantLandId` | `/applicant/id/viewApplicationDetail/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/tenderDetails/:vacantLandId` | `/applicant/id/tenderDetails/:vacantLandId` | Land Inventory & Allotment |
| `#/id/viewESignApplicationDetail/:applicantId/:vacantLandId` | `/applicant/id/viewESignApplicationDetail/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/queryReplyByApplicant/:applicantId/:vacantLandId` | `/applicant/id/queryReplyByApplicant/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/fetchquerybydtic/:applicantId` | `/applicant/id/fetchquerybydtic/:applicantId` | Dashboard / Overview |
| `#/id/annualPayments` | `/applicant/id/annualPayments` | Challan & Fee Verification |
| `#/id/applicantAnnualPayment/:applicantId/:vacantLandId` | `/applicant/id/applicantAnnualPayment/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/reviewAnnualPayment/:paymentId` | `/applicant/id/reviewAnnualPayment/:paymentId` | Challan & Fee Verification |
| `#/id/noticeAppealList` | `/applicant/id/noticeAppealList` | Appeals & Quasi-Judicial Hearings |
| `#/id/enterCompliance/:noticeId` | `/applicant/id/enterCompliance/:noticeId` | Dashboard / Overview |
| `#/id/viewCompliance/:noticeId` | `/applicant/id/viewCompliance/:noticeId` | Dashboard / Overview |
| `#/id/newAppeal/:noticeId` | `/applicant/id/newAppeal/:noticeId` | Appeals & Quasi-Judicial Hearings |
| `#/id/reviewAppealPayment/:appealId` | `/applicant/id/reviewAppealPayment/:appealId` | Challan & Fee Verification |
| `#/id/newAppealForIC/:noticeId` | `/applicant/id/newAppealForIC/:noticeId` | Appeals & Quasi-Judicial Hearings |
| `#/id/viewAppeal/:appealId` | `/applicant/id/viewAppeal/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/id/viewAppealForIC/:appealId` | `/applicant/id/viewAppealForIC/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/id/viewAppealHearing/:appealHearingId` | `/applicant/id/viewAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/fa/queryReplyByApplicant/:applicationId/:establishmentType` | `/applicant/fa/queryReplyByApplicant/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/fa/fetchquerybydtic/:applicationId` | `/applicant/fa/fetchquerybydtic/:applicationId` | Application Scrutiny & Details |
| `#/uploadLOC/:applicantId` | `/applicant/uploadLOC/:applicantId` | Dashboard / Overview |
| `#/reviewLocPayment/:locChallanId` | `/applicant/reviewLocPayment/:locChallanId` | Challan & Fee Verification |
| `#/viewLOCDetails/:applicantId` | `/applicant/viewLOCDetails/:applicantId` | Dashboard / Overview |
| `#/locPaymentDetails/:locChallanId` | `/applicant/locPaymentDetails/:locChallanId` | Challan & Fee Verification |
| `#/fetchuamdetails/:uamNumber/:aadhaarNumber` | `/applicant/fetchuamdetails/:uamNumber/:aadhaarNumber` | Dashboard / Overview |
| `#/vacantLandListLanding` | `/applicant/vacantLandListLanding` | Land Inventory & Allotment |
| `#/vacantLandListLandingUL` | `/applicant/vacantLandListLandingUL` | Land Inventory & Allotment |
| `#/advanceSearchLanding` | `/applicant/advanceSearchLanding` | Dashboard / Overview |
| `#/vacantLandListLanding1/:vacantLandId` | `/applicant/vacantLandListLanding1/:vacantLandId` | Land Inventory & Allotment |
| `#/id/onlinePayment/:applicantId/:vacantLandId` | `/applicant/id/onlinePayment/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/paymentReceipt/:crn` | `/applicant/id/paymentReceipt/:crn` | Challan & Fee Verification |
| `#/id/locPaymentReceipt/:locChallanId/:crn` | `/applicant/id/locPaymentReceipt/:locChallanId/:crn` | Challan & Fee Verification |
| `#/id/retryOnlinePayment/:applicantId/:vacantLandId` | `/applicant/id/retryOnlinePayment/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/id/retryLOCPayment/:locChallanId` | `/applicant/id/retryLOCPayment/:locChallanId` | Challan & Fee Verification |
| `#/id/viewAnnualPaymentHistory/:applicantId` | `/applicant/id/viewAnnualPaymentHistory/:applicantId` | Challan & Fee Verification |
| `#/id/enterConditionalComplianceZO/:hearingId` | `/applicant/id/enterConditionalComplianceZO/:hearingId` | Dashboard / Overview |
| `#/id/viewConditionalDecisionZO/:hearingId/:decisionId` | `/applicant/id/viewConditionalDecisionZO/:hearingId/:decisionId` | Dashboard / Overview |
| `#/id/enterConditionalComplianceIC/:hearingId` | `/applicant/id/enterConditionalComplianceIC/:hearingId` | Dashboard / Overview |
| `#/id/viewConditionalDecisionIC/:hearingId/:decisionId` | `/applicant/id/viewConditionalDecisionIC/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewAnnualPaymentDetails/:paymentId` | `/applicant/viewAnnualPaymentDetails/:paymentId` | Challan & Fee Verification |
| `#/incubationRegistration` | `/applicant/incubationRegistration` | Dashboard / Overview |
| `#/incubationRegistrationForm` | `/applicant/incubationRegistrationForm` | Dashboard / Overview |
| `#/incubationViewPrintForm/:incubationRegistrationId` | `/applicant/incubationViewPrintForm/:incubationRegistrationId` | Dashboard / Overview |
| `#/startupRegistration` | `/applicant/startupRegistration` | Dashboard / Overview |
| `#/startupBenefitsForm` | `/applicant/startupBenefitsForm` | Dashboard / Overview |
| `#/grievanceRedressalForm` | `/applicant/grievanceRedressalForm` | Dashboard / Overview |
| `#/grievanceViewPrintForm/:grievanceId` | `/applicant/grievanceViewPrintForm/:grievanceId` | Dashboard / Overview |
| `#/startupRegistrationForm` | `/applicant/startupRegistrationForm` | Dashboard / Overview |
| `#/startupViewPrintForm/:startupId` | `/applicant/startupViewPrintForm/:startupId` | Dashboard / Overview |
| `#/startupBenefitsViewPrintForm/:startupId` | `/applicant/startupBenefitsViewPrintForm/:startupId` | Dashboard / Overview |
| `#/helpSupport` | `/applicant/helpSupport` | Dashboard / Overview |
| `#/msmeAwardList` | `/applicant/msmeAwardList` | Dashboard / Overview |
| `#/msmeStartupAwardList` | `/applicant/msmeStartupAwardList` | Dashboard / Overview |
| `#/uploadMsmeSAwardDocs` | `/applicant/uploadMsmeSAwardDocs` | Dashboard / Overview |
| `#/applyMsmeAward/:id` | `/applicant/applyMsmeAward/:id` | Dashboard / Overview |
| `#/editMsmeAward/:id/:applicationId` | `/applicant/editMsmeAward/:id/:applicationId` | Application Scrutiny & Details |
| `#/viewMsmeAwardForm/:id/:applicationId` | `/applicant/viewMsmeAwardForm/:id/:applicationId` | Application Scrutiny & Details |
| `#/viewStartupAwardForm/:id` | `/applicant/viewStartupAwardForm/:id` | Dashboard / Overview |
| `#/uploadMsmeAwardDocs/:id/:applicationId` | `/applicant/uploadMsmeAwardDocs/:id/:applicationId` | Application Scrutiny & Details |
| `#/evalutionCommittteform/:id` | `/applicant/evalutionCommittteform/:id` | Dashboard / Overview |
| `#/id/updatePossessionLetter/:applicantId/:vacantLandId` | `/applicant/id/updatePossessionLetter/:applicantId/:vacantLandId` | Land Inventory & Allotment |

---

### Internal & External Audit Section
- **Angular File**: `mpindustry-web/src/main/webapp/angular/audit/AuditRouting.js`
- **Authorized Role**: `ROLE_AUDIT`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/audit/profile` | Account Security & Settings |
| `#/changepassword` | `/department/audit/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/audit/first-password-change` | Account Security & Settings |
| `#/success` | `/department/audit/success` | Dashboard / Overview |
| `#/dashboard` | `/department/audit/dashboard` | Dashboard / Overview |
| `#/officerDetails` | `/department/audit/officerDetails` | Dashboard / Overview |
| `#/addNewOfficer` | `/department/audit/addNewOfficer` | Dashboard / Overview |
| `#/printOfficerList` | `/department/audit/printOfficerList` | Dashboard / Overview |
| `#/viewOfficerDetails/:userId` | `/department/audit/viewOfficerDetails/:userId` | Dashboard / Overview |
| `#/printOfficerDetails/:userId` | `/department/audit/printOfficerDetails/:userId` | Dashboard / Overview |
| `#/auditrosterlist` | `/department/audit/auditrosterlist` | Dashboard / Overview |
| `#/viewAuditRoster/:financialYearId` | `/department/audit/viewAuditRoster/:financialYearId` | Roster & Audit Compliance |
| `#/generateAuditRoster/:financialYearId` | `/department/audit/generateAuditRoster/:financialYearId` | Roster & Audit Compliance |
| `#/addauditrosterform` | `/department/audit/addauditrosterform` | Dashboard / Overview |
| `#/editauditrosterform/:financialYearId` | `/department/audit/editauditrosterform/:financialYearId` | Dashboard / Overview |
| `#/auditRosterListForOfficer` | `/department/audit/auditRosterListForOfficer` | Dashboard / Overview |
| `#/internalAuditForm/:auditRosterId` | `/department/audit/internalAuditForm/:auditRosterId` | Roster & Audit Compliance |
| `#/externalAuditForm` | `/department/audit/externalAuditForm` | Roster & Audit Compliance |
| `#/internalAuditList` | `/department/audit/internalAuditList` | Roster & Audit Compliance |
| `#/externalauditlist` | `/department/audit/externalauditlist` | Dashboard / Overview |
| `#/internalAuditOpinion/:auditRosterId/` | `/department/audit/internalAuditOpinion/:auditRosterId/` | Roster & Audit Compliance |
| `#/agExternalAuditEnterOpinion/:rosterId` | `/department/audit/agExternalAuditEnterOpinion/:rosterId` | Roster & Audit Compliance |
| `#/viewExternalAudit/:rosterId` | `/department/audit/viewExternalAudit/:rosterId` | Roster & Audit Compliance |
| `#/factualdetaillist` | `/department/audit/factualdetaillist` | Subsidy / Incentive Processing |
| `#/factualDetailForm/:auditExternalId/:districtId` | `/department/audit/factualDetailForm/:auditExternalId/:districtId` | Subsidy / Incentive Processing |
| `#/agFactualDetailEnterOpinion/:factualDetailId` | `/department/audit/agFactualDetailEnterOpinion/:factualDetailId` | Subsidy / Incentive Processing |
| `#/viewFactualDetail/:factualDetailId` | `/department/audit/viewFactualDetail/:factualDetailId` | Subsidy / Incentive Processing |
| `#/proformaclauselist` | `/department/audit/proformaclauselist` | Dashboard / Overview |
| `#/proformaClauseForm/:factualDetailId/:districtId` | `/department/audit/proformaClauseForm/:factualDetailId/:districtId` | Subsidy / Incentive Processing |
| `#/agProformaClauseEnterOpinion/:proformaId` | `/department/audit/agProformaClauseEnterOpinion/:proformaId` | Dashboard / Overview |
| `#/viewProformaClause/:proformaId` | `/department/audit/viewProformaClause/:proformaId` | Dashboard / Overview |
| `#/viewInternalAudit/:rosterId` | `/department/audit/viewInternalAudit/:rosterId` | Roster & Audit Compliance |
| `#/cagIndiaReportList` | `/department/audit/cagIndiaReportList` | Dashboard / Overview |
| `#/cagReportAuditEnterOpinion/:proformaId` | `/department/audit/cagReportAuditEnterOpinion/:proformaId` | Roster & Audit Compliance |
| `#/viewCagReport/:cagReportId` | `/department/audit/viewCagReport/:cagReportId` | Dashboard / Overview |
| `#/pacReportList` | `/department/audit/pacReportList` | Dashboard / Overview |
| `#/pacReportAuditEnterOpinion/:cagReportId` | `/department/audit/pacReportAuditEnterOpinion/:cagReportId` | Roster & Audit Compliance |
| `#/viewPacReport/:pacReportId` | `/department/audit/viewPacReport/:pacReportId` | Dashboard / Overview |
| `#/enterCagAssemblySecyOpinion/:cagReportId` | `/department/audit/enterCagAssemblySecyOpinion/:cagReportId` | Dashboard / Overview |
| `#/pacReportLaEnterOpinion/:pacReportId` | `/department/audit/pacReportLaEnterOpinion/:pacReportId` | Dashboard / Overview |
| `#/letterList` | `/department/audit/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/audit/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/audit/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/audit/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### Banking & Financial Institutions
- **Angular File**: `mpindustry-web/src/main/webapp/angular/bank/routing.js`
- **Authorized Role**: `ROLE_BANK`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/bank/profile` | Account Security & Settings |
| `#/changepassword` | `/department/bank/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/bank/first-password-change` | Account Security & Settings |
| `#/success` | `/department/bank/success` | Dashboard / Overview |
| `#/dashboard` | `/department/bank/dashboard` | Dashboard / Overview |
| `#/dticpendingapplicants` | `/department/bank/dticpendingapplicants` | Dashboard / Overview |
| `#/viewdocumentdetail/:applicantId` | `/department/bank/viewdocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewyudocumentdetail/:applicantId` | `/department/bank/viewyudocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewapplicantdetail/:applicantId` | `/department/bank/viewapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/viewacceptrejectform/:applicantId` | `/department/bank/viewacceptrejectform/:applicantId` | Dashboard / Overview |
| `#/viewschemedetailform/:applicantId` | `/department/bank/viewschemedetailform/:applicantId` | Dashboard / Overview |
| `#/viewprojectreportform/:applicantId` | `/department/bank/viewprojectreportform/:applicantId` | Dashboard / Overview |
| `#/dticpendingyuvaudhami` | `/department/bank/dticpendingyuvaudhami` | Dashboard / Overview |
| `#/bankacceptedapplicants` | `/department/bank/bankacceptedapplicants` | Dashboard / Overview |
| `#/bankacceptedyuvaudhami` | `/department/bank/bankacceptedyuvaudhami` | Dashboard / Overview |
| `#/viewmarginmoneycommentlist/:applicantId` | `/department/bank/viewmarginmoneycommentlist/:applicantId` | Dashboard / Overview |
| `#/viewmarginmoneycommentform/:applicantId` | `/department/bank/viewmarginmoneycommentform/:applicantId` | Dashboard / Overview |

---

### Budget & Financial Planning
- **Angular File**: `mpindustry-web/src/main/webapp/angular/budgetPlanning/BudgetPlanningRouting.js`
- **Authorized Role**: `ROLE_BUDGET_PLANNING`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/budget-planning/profile` | Account Security & Settings |
| `#/changepassword` | `/department/budget-planning/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/budget-planning/first-password-change` | Account Security & Settings |
| `#/success` | `/department/budget-planning/success` | Dashboard / Overview |
| `#/dashboard` | `/department/budget-planning/dashboard` | Dashboard / Overview |
| `#/hoBudgetDetails` | `/department/budget-planning/hoBudgetDetails` | Dashboard / Overview |
| `#/hoBudgetDetails/:financialYearId` | `/department/budget-planning/hoBudgetDetails/:financialYearId` | Dashboard / Overview |
| `#/hoBudgetAllocation/:financialYearId` | `/department/budget-planning/hoBudgetAllocation/:financialYearId` | Dashboard / Overview |
| `#/viewHOBudget/:hoBudgetId` | `/department/budget-planning/viewHOBudget/:hoBudgetId` | Dashboard / Overview |
| `#/hoHeadsBudgetDetails` | `/department/budget-planning/hoHeadsBudgetDetails` | Dashboard / Overview |
| `#/printHOHeadsBudgetDetails` | `/department/budget-planning/printHOHeadsBudgetDetails` | Dashboard / Overview |
| `#/newHoHeadsBudgetAllocation/:financialYearId` | `/department/budget-planning/newHoHeadsBudgetAllocation/:financialYearId` | Dashboard / Overview |
| `#/viewHoHeadsBudgetAllocation/:financialYearId` | `/department/budget-planning/viewHoHeadsBudgetAllocation/:financialYearId` | Dashboard / Overview |
| `#/printHoHeadsBudgetAllocation/:financialYearId` | `/department/budget-planning/printHoHeadsBudgetAllocation/:financialYearId` | Dashboard / Overview |
| `#/dticBudgetDetails` | `/department/budget-planning/dticBudgetDetails` | Dashboard / Overview |
| `#/dticBudgetDetails/:financialYearId` | `/department/budget-planning/dticBudgetDetails/:financialYearId` | Dashboard / Overview |
| `#/dticBudgetAllocation/:financialYearId` | `/department/budget-planning/dticBudgetAllocation/:financialYearId` | Dashboard / Overview |
| `#/dticBudgetAllocation/:userId/:financialYearId` | `/department/budget-planning/dticBudgetAllocation/:userId/:financialYearId` | Dashboard / Overview |
| `#/viewDTICBudget/:dticBudgetId` | `/department/budget-planning/viewDTICBudget/:dticBudgetId` | Dashboard / Overview |
| `#/dticHeadsBudgetDetails` | `/department/budget-planning/dticHeadsBudgetDetails` | Dashboard / Overview |
| `#/printDTICHeadsBudgetDetails` | `/department/budget-planning/printDTICHeadsBudgetDetails` | Dashboard / Overview |
| `#/dticHeadsBudgetDetails/:financialYearId` | `/department/budget-planning/dticHeadsBudgetDetails/:financialYearId` | Dashboard / Overview |
| `#/printDTICHeadsBudgetDetailsFY/:financialYearId` | `/department/budget-planning/printDTICHeadsBudgetDetailsFY/:financialYearId` | Dashboard / Overview |
| `#/printDTICHeadsBudgetDetailsFY/:userId/:financialYearId` | `/department/budget-planning/printDTICHeadsBudgetDetailsFY/:userId/:financialYearId` | Dashboard / Overview |
| `#/newDTICHeadsBudgetAllocation/:userId/:financialYearId/:quarterId` | `/department/budget-planning/newDTICHeadsBudgetAllocation/:userId/:financialYearId/:quarterId` | Dashboard / Overview |
| `#/viewDTICHeadsBudgetAllocation/:userId/:financialYearId/:quarterId` | `/department/budget-planning/viewDTICHeadsBudgetAllocation/:userId/:financialYearId/:quarterId` | Dashboard / Overview |
| `#/printDTICHeadsBudgetAllocation/:userId/:financialYearId/:quarterId` | `/department/budget-planning/printDTICHeadsBudgetAllocation/:userId/:financialYearId/:quarterId` | Dashboard / Overview |
| `#/dticDemandDetails` | `/department/budget-planning/dticDemandDetails` | Dashboard / Overview |
| `#/dticDemandDetails/:financialYearId` | `/department/budget-planning/dticDemandDetails/:financialYearId` | Dashboard / Overview |
| `#/viewDTICDemand/:dticDemandId` | `/department/budget-planning/viewDTICDemand/:dticDemandId` | Dashboard / Overview |
| `#/printDTICDemand/:dticDemandId` | `/department/budget-planning/printDTICDemand/:dticDemandId` | Dashboard / Overview |
| `#/dticUsesSurrenderDetails` | `/department/budget-planning/dticUsesSurrenderDetails` | Dashboard / Overview |
| `#/dticUsesSurrenderDetails/:financialYearId` | `/department/budget-planning/dticUsesSurrenderDetails/:financialYearId` | Dashboard / Overview |
| `#/viewDTICUsesSurrenderDetails/:userId/:financialYearId/:quarterId` | `/department/budget-planning/viewDTICUsesSurrenderDetails/:userId/:financialYearId/:quarterId` | Dashboard / Overview |
| `#/letterList` | `/department/budget-planning/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/budget-planning/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/budget-planning/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/budget-planning/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### Chief Minister / Chief Secretary (CMCS) Cell
- **Angular File**: `mpindustry-web/src/main/webapp/angular/cmcs/CmcsRouting.js`
- **Authorized Role**: `ROLE_CM_CS`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/cmcs/profile` | Account Security & Settings |
| `#/changepassword` | `/department/cmcs/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/cmcs/first-password-change` | Account Security & Settings |
| `#/success` | `/department/cmcs/success` | Dashboard / Overview |
| `#/dashboard` | `/department/cmcs/dashboard` | Dashboard / Overview |
| `#/createLetter` | `/department/cmcs/createLetter` | Official Orders & LOI Letters |
| `#/cmcsLetterList` | `/department/cmcs/cmcsLetterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/cmcs/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/cmcs/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/cmcs/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### District Collector Approval Workflow
- **Angular File**: `mpindustry-web/src/main/webapp/angular/collector/CollectorRouting.js`
- **Authorized Role**: `ROLE_COLLECTOR`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/dashboard` | `/department/collector/dashboard` | Dashboard / Overview |
| `#/detail/:applicationNo` | `/department/collector/detail/:applicationNo` | Application Scrutiny & Details |
| `#/esignApproval` | `/department/collector/esignApproval` | Dashboard / Overview |
| `#/approved` | `/department/collector/approved` | Dashboard / Overview |
| `#/batches` | `/department/collector/batches` | Dashboard / Overview |
| `#/batchSign/:batchId` | `/department/collector/batchSign/:batchId` | Dashboard / Overview |
| `#/fa/viewfaapplicantdetailunitnew/:applicationId` | `/department/collector/fa/viewfaapplicantdetailunitnew/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | `/department/collector/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | Application Scrutiny & Details |

---

### Common Shared Utilities
- **Angular File**: `mpindustry-web/src/main/webapp/angular/common/CommonRouting.js`
- **Authorized Role**: `ALL_AUTHENTICATED`
- **Target Layout**: `AuthenticatedLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/letterList` | `/common/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/common/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/common/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/common/loadHistory/:letterId` | Official Orders & LOI Letters |
| `#/success` | `/common/success` | Dashboard / Overview |

---

### Coordination Directorate
- **Angular File**: `mpindustry-web/src/main/webapp/angular/coordination/CoordinationRouting.js`
- **Authorized Role**: `ROLE_COORDINATION`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/coordination/profile` | Account Security & Settings |
| `#/changepassword` | `/department/coordination/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/coordination/first-password-change` | Account Security & Settings |
| `#/success` | `/department/coordination/success` | Dashboard / Overview |
| `#/dashboard` | `/department/coordination/dashboard` | Dashboard / Overview |
| `#/officerDetails` | `/department/coordination/officerDetails` | Dashboard / Overview |
| `#/printOfficerList` | `/department/coordination/printOfficerList` | Dashboard / Overview |
| `#/addNewOfficer` | `/department/coordination/addNewOfficer` | Dashboard / Overview |
| `#/viewOfficerDetails/:userId` | `/department/coordination/viewOfficerDetails/:userId` | Dashboard / Overview |
| `#/printOfficerDetails/:userId` | `/department/coordination/printOfficerDetails/:userId` | Dashboard / Overview |
| `#/inspectionOfficeDetails` | `/department/coordination/inspectionOfficeDetails` | Dashboard / Overview |
| `#/inspectionOfficeDetails/:financialYearId` | `/department/coordination/inspectionOfficeDetails/:financialYearId` | Dashboard / Overview |
| `#/addNewInspectionOffice/:financialYearId` | `/department/coordination/addNewInspectionOffice/:financialYearId` | Dashboard / Overview |
| `#/viewInspectionOffice/:inspectionOfficeId` | `/department/coordination/viewInspectionOffice/:inspectionOfficeId` | Dashboard / Overview |
| `#/printInspectionOffice/:inspectionOfficeId` | `/department/coordination/printInspectionOffice/:inspectionOfficeId` | Dashboard / Overview |
| `#/printInspectionOfficesList/:financialYearId` | `/department/coordination/printInspectionOfficesList/:financialYearId` | Dashboard / Overview |
| `#/inspectionDetails` | `/department/coordination/inspectionDetails` | Dashboard / Overview |
| `#/inspectionDetails/:financialYearId` | `/department/coordination/inspectionDetails/:financialYearId` | Dashboard / Overview |
| `#/viewInspectionDetails/:inspectionOfficeId` | `/department/coordination/viewInspectionDetails/:inspectionOfficeId` | Dashboard / Overview |
| `#/printInspectionDetails/:inspectionOfficeId` | `/department/coordination/printInspectionDetails/:inspectionOfficeId` | Dashboard / Overview |
| `#/printInspectionsList/:financialYearId` | `/department/coordination/printInspectionsList/:financialYearId` | Dashboard / Overview |
| `#/printInspectionRoster/:inspectionOfficeId` | `/department/coordination/printInspectionRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/officerInspectionDetails` | `/department/coordination/officerInspectionDetails` | Dashboard / Overview |
| `#/officerInspectionDetails/:financialYearId` | `/department/coordination/officerInspectionDetails/:financialYearId` | Dashboard / Overview |
| `#/viewOfficerInspectionDetails/:inspectionOfficeId` | `/department/coordination/viewOfficerInspectionDetails/:inspectionOfficeId` | Dashboard / Overview |
| `#/viewInspectionRoster/:inspectionOfficeId` | `/department/coordination/viewInspectionRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/printInspectionRoster/:inspectionOfficeId` | `/department/coordination/printInspectionRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/officerUploadRoster/:inspectionOfficeId` | `/department/coordination/officerUploadRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/ddInspectionDetails` | `/department/coordination/ddInspectionDetails` | Dashboard / Overview |
| `#/ddInspectionDetails/:financialYearId` | `/department/coordination/ddInspectionDetails/:financialYearId` | Dashboard / Overview |
| `#/ddViewInspectionDetails/:inspectionOfficeId` | `/department/coordination/ddViewInspectionDetails/:inspectionOfficeId` | Dashboard / Overview |
| `#/ddPrintInspectionRoster/:inspectionOfficeId` | `/department/coordination/ddPrintInspectionRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/jdInspectionDetails` | `/department/coordination/jdInspectionDetails` | Dashboard / Overview |
| `#/jdInspectionDetails/:financialYearId` | `/department/coordination/jdInspectionDetails/:financialYearId` | Dashboard / Overview |
| `#/jdViewInspectionDetails/:inspectionOfficeId` | `/department/coordination/jdViewInspectionDetails/:inspectionOfficeId` | Dashboard / Overview |
| `#/jdPrintInspectionRoster/:inspectionOfficeId` | `/department/coordination/jdPrintInspectionRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/letterList` | `/department/coordination/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/coordination/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/coordination/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/coordination/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### District Task Force Committee (DTFC)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/dtfc/routing.js`
- **Authorized Role**: `ROLE_DTFC`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/dtfc/profile` | Account Security & Settings |
| `#/changepassword` | `/department/dtfc/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/dtfc/first-password-change` | Account Security & Settings |
| `#/success` | `/department/dtfc/success` | Dashboard / Overview |
| `#/dashboard` | `/department/dtfc/dashboard` | Dashboard / Overview |
| `#/dtfcpendingapplicants` | `/department/dtfc/dtfcpendingapplicants` | Dashboard / Overview |
| `#/viewapplicantdetail/:applicantId` | `/department/dtfc/viewapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/viewdocumentdetail/:applicantId` | `/department/dtfc/viewdocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewschemedetailform/:applicantId` | `/department/dtfc/viewschemedetailform/:applicantId` | Dashboard / Overview |
| `#/viewprojectreportform/:applicantId` | `/department/dtfc/viewprojectreportform/:applicantId` | Dashboard / Overview |
| `#/dtfcpendingyuvaudhami` | `/department/dtfc/dtfcpendingyuvaudhami` | Dashboard / Overview |
| `#/dtfcinprocessapplicants` | `/department/dtfc/dtfcinprocessapplicants` | Dashboard / Overview |
| `#/dtfcinprocessyuvaudhami` | `/department/dtfc/dtfcinprocessyuvaudhami` | Dashboard / Overview |
| `#/bankacceptedapplicants` | `/department/dtfc/bankacceptedapplicants` | Dashboard / Overview |
| `#/viewmarginmoneycommentlist/:applicantId` | `/department/dtfc/viewmarginmoneycommentlist/:applicantId` | Dashboard / Overview |
| `#/viewmarginmoneycommentform/:applicantId` | `/department/dtfc/viewmarginmoneycommentform/:applicantId` | Dashboard / Overview |
| `#/bankacceptedyuvaudhami` | `/department/dtfc/bankacceptedyuvaudhami` | Dashboard / Overview |
| `#/letterList` | `/department/dtfc/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/dtfc/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/dtfc/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/dtfc/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### District Trade & Industry Centre (DTIC)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/dtic/routing.js`
- **Authorized Role**: `ROLE_DTIC`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/dtic/profile` | Account Security & Settings |
| `#/changepassword` | `/department/dtic/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/dtic/first-password-change` | Account Security & Settings |
| `#/success` | `/department/dtic/success` | Dashboard / Overview |
| `#/dashboard` | `/department/dtic/dashboard` | Dashboard / Overview |
| `#/viewtotalapplications` | `/department/dtic/viewtotalapplications` | Application Scrutiny & Details |
| `#/viewnewapplications` | `/department/dtic/viewnewapplications` | Application Scrutiny & Details |
| `#/supplierInfo` | `/department/dtic/supplierInfo` | Dashboard / Overview |
| `#/viewsendbackapplications` | `/department/dtic/viewsendbackapplications` | Application Scrutiny & Details |
| `#/viewresubmittedapplications` | `/department/dtic/viewresubmittedapplications` | Application Scrutiny & Details |
| `#/viewapplicationsacceptedbydtic` | `/department/dtic/viewapplicationsacceptedbydtic` | Application Scrutiny & Details |
| `#/viewapplicationsrejectedbydtic` | `/department/dtic/viewapplicationsrejectedbydtic` | Application Scrutiny & Details |
| `#/viewapplicationsacceptedbydtfc` | `/department/dtic/viewapplicationsacceptedbydtfc` | Application Scrutiny & Details |
| `#/viewapplicationsrejectedbydtfc` | `/department/dtic/viewapplicationsrejectedbydtfc` | Application Scrutiny & Details |
| `#/viewapplicationsacceptedbybank` | `/department/dtic/viewapplicationsacceptedbybank` | Application Scrutiny & Details |
| `#/viewapplicationsrejectedbybank` | `/department/dtic/viewapplicationsrejectedbybank` | Application Scrutiny & Details |
| `#/dticpendingapplicants` | `/department/dtic/dticpendingapplicants` | Dashboard / Overview |
| `#/viewapplicantdetail/:applicantId` | `/department/dtic/viewapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/viewyuapplicantdetail/:applicantId` | `/department/dtic/viewyuapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/viewdocumentdetail/:applicantId` | `/department/dtic/viewdocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewyudocumentdetail/:applicantId` | `/department/dtic/viewyudocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewschemedetailform/:applicantId` | `/department/dtic/viewschemedetailform/:applicantId` | Dashboard / Overview |
| `#/viewprojectreportform/:applicantId` | `/department/dtic/viewprojectreportform/:applicantId` | Dashboard / Overview |
| `#/viewyuprojectreportform/:applicantId` | `/department/dtic/viewyuprojectreportform/:applicantId` | Dashboard / Overview |
| `#/dticpendingyuvaudhami` | `/department/dtic/dticpendingyuvaudhami` | Dashboard / Overview |
| `#/dticinprocessapplicants` | `/department/dtic/dticinprocessapplicants` | Dashboard / Overview |
| `#/dticinprocessyuvaudhami` | `/department/dtic/dticinprocessyuvaudhami` | Dashboard / Overview |
| `#/dticresubmittedapplicants` | `/department/dtic/dticresubmittedapplicants` | Dashboard / Overview |
| `#/dticresubmittedyuvaudhami` | `/department/dtic/dticresubmittedyuvaudhami` | Dashboard / Overview |
| `#/viewtfcletterform/:schemeType` | `/department/dtic/viewtfcletterform/:schemeType` | Official Orders & LOI Letters |
| `#/viewapplicationlist` | `/department/dtic/viewapplicationlist` | Application Scrutiny & Details |
| `#/viewmsmedetail/:msmeDetailId` | `/department/dtic/viewmsmedetail/:msmeDetailId` | Dashboard / Overview |
| `#/viewmsmeform` | `/department/dtic/viewmsmeform` | Dashboard / Overview |
| `#/serviceenterprisereportform` | `/department/dtic/serviceenterprisereportform` | Dashboard / Overview |
| `#/manufacturingenterprisereportform` | `/department/dtic/manufacturingenterprisereportform` | Subsidy / Incentive Processing |
| `#/microlevelreportform` | `/department/dtic/microlevelreportform` | Dashboard / Overview |
| `#/smalllevelreportform` | `/department/dtic/smalllevelreportform` | Dashboard / Overview |
| `#/mediumlevelreportform` | `/department/dtic/mediumlevelreportform` | Dashboard / Overview |
| `#/viewmsmeeditform/:msmeDetailId` | `/department/dtic/viewmsmeeditform/:msmeDetailId` | Dashboard / Overview |
| `#/dticfapendingapplicantsunit` | `/department/dtic/dticfapendingapplicantsunit` | Subsidy / Incentive Processing |
| `#/powerBiDashbord` | `/department/dtic/powerBiDashbord` | Dashboard / Overview |
| `#/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | `/department/dtic/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/dticfapendingapplicantsapparel` | `/department/dtic/dticfapendingapplicantsapparel` | Subsidy / Incentive Processing |
| `#/dticfapendingapplicants` | `/department/dtic/dticfapendingapplicants` | Subsidy / Incentive Processing |
| `#/faacceptanceamountdetailapparel/:applicationId` | `/department/dtic/faacceptanceamountdetailapparel/:applicationId` | Application Scrutiny & Details |
| `#/faacceptanceamountdetailunit/:applicationId/:establishmentType` | `/department/dtic/faacceptanceamountdetailunit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/viewfaacceptanceamountdetailunit/:applicationId/:establishmentType` | `/department/dtic/viewfaacceptanceamountdetailunit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/fazonalacceptanceamountdetail/:applicationId` | `/department/dtic/fazonalacceptanceamountdetail/:applicationId` | Application Scrutiny & Details |
| `#/faInspectionStatusUnit/:applicationId/:establishmentType` | `/department/dtic/faInspectionStatusUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/querybydtic/:applicationId/:establishmentType` | `/department/dtic/querybydtic/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/faCommitteeStatusUnit/:applicationId/:establishmentType` | `/department/dtic/faCommitteeStatusUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/viewfaCommitteeStatusUnit/:applicationId/:establishmentType` | `/department/dtic/viewfaCommitteeStatusUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/faCommitteesStatusUnit/:applicationIds/:establishmentType` | `/department/dtic/faCommitteesStatusUnit/:applicationIds/:establishmentType` | Application Scrutiny & Details |
| `#/faDisbursementUnit/:applicationId/:establishmentType` | `/department/dtic/faDisbursementUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/faOtherUploadDocuments/:applicationId/:establishmentType` | `/department/dtic/faOtherUploadDocuments/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/viewfaDisbursementUnit/:applicationId/:establishmentType` | `/department/dtic/viewfaDisbursementUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/viewdownloadfaacceptanceform/:applicationId/:establishmentType` | `/department/dtic/viewdownloadfaacceptanceform/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/viewdownloadfazonalacceptanceform/:applicationId` | `/department/dtic/viewdownloadfazonalacceptanceform/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaschemesdetailsunit/:applicationId` | `/department/dtic/fa/viewfaschemesdetailsunit/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaschemesdetailsapparel/:applicationId` | `/department/dtic/fa/viewfaschemesdetailsapparel/:applicationId` | Application Scrutiny & Details |
| `#/fa/fetchfaschemes/:applicationId` | `/department/dtic/fa/fetchfaschemes/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfadocumentsuploadunit/:applicationId` | `/department/dtic/fa/viewfadocumentsuploadunit/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfadocumentsuploadapparel/:applicationId` | `/department/dtic/fa/viewfadocumentsuploadapparel/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantdetailunit/:applicationId` | `/department/dtic/fa/viewfaapplicantdetailunit/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantdetailunitnew/:applicationId` | `/department/dtic/fa/viewfaapplicantdetailunitnew/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantdetailapparel/:applicationId` | `/department/dtic/fa/viewfaapplicantdetailapparel/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantdetailapparelnew/:applicationId` | `/department/dtic/fa/viewfaapplicantdetailapparelnew/:applicationId` | Application Scrutiny & Details |
| `#/fa/newapplicantform` | `/department/dtic/fa/newapplicantform` | Subsidy / Incentive Processing |
| `#/fa/newapplicantformapparel` | `/department/dtic/fa/newapplicantformapparel` | Subsidy / Incentive Processing |
| `#/dticLandAllotmentForm` | `/department/dtic/dticLandAllotmentForm` | Dashboard / Overview |
| `#/id/viewDocumentsUpload/:applicantId/:vacantLandId` | `/department/dtic/id/viewDocumentsUpload/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/dticLandAllotment` | `/department/dtic/dticLandAllotment` | Dashboard / Overview |
| `#/eSingAOLetter` | `/department/dtic/eSingAOLetter` | Official Orders & LOI Letters |
| `#/legacyData` | `/department/dtic/legacyData` | Dashboard / Overview |
| `#/entervacantland` | `/department/dtic/entervacantland` | Dashboard / Overview |
| `#/id/viewAppliedApplicants/:vacantLandId` | `/department/dtic/id/viewAppliedApplicants/:vacantLandId` | Land Inventory & Allotment |
| `#/eSingAOLetter/:applicantId` | `/department/dtic/eSingAOLetter/:applicantId` | Official Orders & LOI Letters |
| `#/tenderDetails/:vacantLandId` | `/department/dtic/tenderDetails/:vacantLandId` | Land Inventory & Allotment |
| `#/openGroupLOI/:applicantId` | `/department/dtic/openGroupLOI/:applicantId` | Dashboard / Overview |
| `#/id/editVacantLandDetail/:vacantLandId` | `/department/dtic/id/editVacantLandDetail/:vacantLandId` | Land Inventory & Allotment |
| `#/id/editViewLegacyData/:id` | `/department/dtic/id/editViewLegacyData/:id` | Dashboard / Overview |
| `#/id/viewIdApplicantHistory/:applicantId/:vacantLandId` | `/department/dtic/id/viewIdApplicantHistory/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/idInspectionStatus/:applicantId/:vacantLandId` | `/department/dtic/idInspectionStatus/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/updateLOI/:applicantId/:vacantLandId` | `/department/dtic/updateLOI/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/viewUploadDownloadLOI/:applicantId` | `/department/dtic/viewUploadDownloadLOI/:applicantId` | Dashboard / Overview |
| `#/viewLOCDetails/:applicantId` | `/department/dtic/viewLOCDetails/:applicantId` | Dashboard / Overview |
| `#/locPaymentDetails/:locChallanId` | `/department/dtic/locPaymentDetails/:locChallanId` | Challan & Fee Verification |
| `#/uploadBankCoveringLetter/:applicantId/:schemeCategory` | `/department/dtic/uploadBankCoveringLetter/:applicantId/:schemeCategory` | Official Orders & LOI Letters |
| `#/updateLeaseDeed/:applicantId/:vacantLandId` | `/department/dtic/updateLeaseDeed/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/updatePossessionLetter/:applicantId/:vacantLandId` | `/department/dtic/updatePossessionLetter/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/dticLandAcquisition` | `/department/dtic/dticLandAcquisition` | Dashboard / Overview |
| `#/faapplicants` | `/department/dtic/faapplicants` | Subsidy / Incentive Processing |
| `#/viewfaapplicantdetail/:applicationId` | `/department/dtic/viewfaapplicantdetail/:applicationId` | Application Scrutiny & Details |
| `#/viewfaschemesdetails/:applicationId` | `/department/dtic/viewfaschemesdetails/:applicationId` | Application Scrutiny & Details |
| `#/downloadForm/:name` | `/department/dtic/downloadForm/:name` | Dashboard / Overview |
| `#/faZonalStatusUnit/:applicationId/:establishmentType` | `/department/dtic/faZonalStatusUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/id/viewApplicationDetail/:applicantId/:vacantLandId` | `/department/dtic/id/viewApplicationDetail/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/viewAllotmentLetter/:applicantId/:vacantLandId` | `/department/dtic/viewAllotmentLetter/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/allocatedBudgetDetails` | `/department/dtic/allocatedBudgetDetails` | Dashboard / Overview |
| `#/allocatedBudgetDetails/:financialYearId` | `/department/dtic/allocatedBudgetDetails/:financialYearId` | Dashboard / Overview |
| `#/allocatedBudgetDetails/:financialYearId/:quarterId` | `/department/dtic/allocatedBudgetDetails/:financialYearId/:quarterId` | Dashboard / Overview |
| `#/headsBudgetDetails/:financialYearId/:quarterId` | `/department/dtic/headsBudgetDetails/:financialYearId/:quarterId` | Dashboard / Overview |
| `#/demandBudgetDetails` | `/department/dtic/demandBudgetDetails` | Dashboard / Overview |
| `#/demandBudgetDetails/:financialYearId` | `/department/dtic/demandBudgetDetails/:financialYearId` | Dashboard / Overview |
| `#/generateBudgetDemand/:financialYearId` | `/department/dtic/generateBudgetDemand/:financialYearId` | Dashboard / Overview |
| `#/viewBudgetDemand/:dticDemandId` | `/department/dtic/viewBudgetDemand/:dticDemandId` | Dashboard / Overview |
| `#/printBudgetDemand/:dticDemandId` | `/department/dtic/printBudgetDemand/:dticDemandId` | Dashboard / Overview |
| `#/viewAllocatedBudgetDemand/:dticDemandId` | `/department/dtic/viewAllocatedBudgetDemand/:dticDemandId` | Dashboard / Overview |
| `#/usesSurrenderDetails` | `/department/dtic/usesSurrenderDetails` | Dashboard / Overview |
| `#/usesSurrenderDetails/:financialYearId` | `/department/dtic/usesSurrenderDetails/:financialYearId` | Dashboard / Overview |
| `#/viewUsesSurrender/:financialYearId/:quarterId` | `/department/dtic/viewUsesSurrender/:financialYearId/:quarterId` | Dashboard / Overview |
| `#/printUsesSurrender/:financialYearId/:quarterId` | `/department/dtic/printUsesSurrender/:financialYearId/:quarterId` | Dashboard / Overview |
| `#/inspectionDetails` | `/department/dtic/inspectionDetails` | Dashboard / Overview |
| `#/viewRoster/:inspectionOfficeId` | `/department/dtic/viewRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/viewEditRoster/:inspectionOfficeId` | `/department/dtic/viewEditRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/printRoster/:inspectionOfficeId` | `/department/dtic/printRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/letterList` | `/department/dtic/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/dtic/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/dtic/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/dtic/loadHistory/:letterId` | Official Orders & LOI Letters |
| `#/dticCreateIndustrialArea` | `/department/dtic/dticCreateIndustrialArea` | Dashboard / Overview |
| `#/dticCreateCollectorRate` | `/department/dtic/dticCreateCollectorRate` | Dashboard / Overview |
| `#/viewCollectorRate/:collectorRateId` | `/department/dtic/viewCollectorRate/:collectorRateId` | Dashboard / Overview |
| `#/editIndustrialArea/:locationId` | `/department/dtic/editIndustrialArea/:locationId` | Dashboard / Overview |
| `#/dticCreateIndustrialAreaRate` | `/department/dtic/dticCreateIndustrialAreaRate` | Dashboard / Overview |
| `#/dticViewIndustrialAreaRate/:industrialAreaRateId` | `/department/dtic/dticViewIndustrialAreaRate/:industrialAreaRateId` | Dashboard / Overview |
| `#/internalAuditList` | `/department/dtic/internalAuditList` | Roster & Audit Compliance |
| `#/viewInternalAudit/:rosterId` | `/department/dtic/viewInternalAudit/:rosterId` | Roster & Audit Compliance |
| `#/externalauditlist` | `/department/dtic/externalauditlist` | Dashboard / Overview |
| `#/viewExternalAudit/:rosterId` | `/department/dtic/viewExternalAudit/:rosterId` | Roster & Audit Compliance |
| `#/dticExternalAuditEnterOpinion/:rosterId` | `/department/dtic/dticExternalAuditEnterOpinion/:rosterId` | Roster & Audit Compliance |
| `#/dticInternalAuditEnterOpinion/:rosterId` | `/department/dtic/dticInternalAuditEnterOpinion/:rosterId` | Roster & Audit Compliance |
| `#/factualdetaillist` | `/department/dtic/factualdetaillist` | Subsidy / Incentive Processing |
| `#/viewFactualDetail/:factualDetailId` | `/department/dtic/viewFactualDetail/:factualDetailId` | Subsidy / Incentive Processing |
| `#/dticFactualDetailEnterOpinion/:factualDetailId` | `/department/dtic/dticFactualDetailEnterOpinion/:factualDetailId` | Subsidy / Incentive Processing |
| `#/proformaclauselist` | `/department/dtic/proformaclauselist` | Dashboard / Overview |
| `#/dticProformaClauseEnterOpinion/:proformaId` | `/department/dtic/dticProformaClauseEnterOpinion/:proformaId` | Dashboard / Overview |
| `#/viewProformaClause/:proformaId` | `/department/dtic/viewProformaClause/:proformaId` | Dashboard / Overview |
| `#/noticeList` | `/department/dtic/noticeList` | Dashboard / Overview |
| `#/backlogLandAllotment` | `/department/dtic/backlogLandAllotment` | Dashboard / Overview |
| `#/viewIssueNotice/:applicantId` | `/department/dtic/viewIssueNotice/:applicantId` | Dashboard / Overview |
| `#/reviewCompliance/:noticeId` | `/department/dtic/reviewCompliance/:noticeId` | Dashboard / Overview |
| `#/viewNoticeHistory/:noticeId` | `/department/dtic/viewNoticeHistory/:noticeId` | Dashboard / Overview |
| `#/viewAnnualPaymentHistory/:applicantId` | `/department/dtic/viewAnnualPaymentHistory/:applicantId` | Challan & Fee Verification |
| `#/reviewConditionalComplianceZO/:hearingId` | `/department/dtic/reviewConditionalComplianceZO/:hearingId` | Dashboard / Overview |
| `#/reviewConditionalComplianceZO/:hearingId/:decisionId` | `/department/dtic/reviewConditionalComplianceZO/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewConditionalDecisionZO/:hearingId/:decisionId` | `/department/dtic/viewConditionalDecisionZO/:hearingId/:decisionId` | Dashboard / Overview |
| `#/reviewConditionalComplianceIC/:hearingId` | `/department/dtic/reviewConditionalComplianceIC/:hearingId` | Dashboard / Overview |
| `#/reviewConditionalComplianceIC/:hearingId/:decisionId` | `/department/dtic/reviewConditionalComplianceIC/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewConditionalDecisionIC/:hearingId/:decisionId` | `/department/dtic/viewConditionalDecisionIC/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewZOAppeal/:appealId` | `/department/dtic/viewZOAppeal/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/viewZOAppealHearing/:appealHearingId` | `/department/dtic/viewZOAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewICAppeal/:appealId` | `/department/dtic/viewICAppeal/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/viewICAppealHearing/:appealHearingId` | `/department/dtic/viewICAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewAnnualPaymentDetails/:paymentId` | `/department/dtic/viewAnnualPaymentDetails/:paymentId` | Challan & Fee Verification |
| `#/updateprofile` | `/department/dtic/profile` | Account Security & Settings |
| `#/addSupplyNameForm` | `/department/dtic/addSupplyNameForm` | Dashboard / Overview |
| `#/viewEditSupplyName/:id` | `/department/dtic/viewEditSupplyName/:id` | Dashboard / Overview |
| `#/viewEditSupplierName/:id` | `/department/dtic/viewEditSupplierName/:id` | Dashboard / Overview |
| `#/supplyNameList` | `/department/dtic/supplyNameList` | Dashboard / Overview |
| `#/supplierNameList` | `/department/dtic/supplierNameList` | Dashboard / Overview |
| `#/supplierList` | `/department/dtic/supplierList` | Dashboard / Overview |
| `#/supplierForm` | `/department/dtic/supplierForm` | Dashboard / Overview |
| `#/supplyList` | `/department/dtic/supplyList` | Dashboard / Overview |
| `#/supplyForm` | `/department/dtic/supplyForm` | Dashboard / Overview |
| `#/ox1List` | `/department/dtic/ox1List` | Dashboard / Overview |
| `#/ox1Form` | `/department/dtic/ox1Form` | Dashboard / Overview |
| `#/ox2List` | `/department/dtic/ox2List` | Dashboard / Overview |
| `#/ox2Form` | `/department/dtic/ox2Form` | Dashboard / Overview |
| `#/ox3List` | `/department/dtic/ox3List` | Dashboard / Overview |
| `#/ox3Form` | `/department/dtic/ox3Form` | Dashboard / Overview |
| `#/ox4List` | `/department/dtic/ox4List` | Dashboard / Overview |
| `#/ox4Form` | `/department/dtic/ox4Form` | Dashboard / Overview |
| `#/report1` | `/department/dtic/report1` | Dashboard / Overview |
| `#/report2` | `/department/dtic/report2` | Dashboard / Overview |
| `#/enrolmentList` | `/department/dtic/enrolmentList` | Dashboard / Overview |
| `#/enrolmentform` | `/department/dtic/enrolmentform` | Dashboard / Overview |
| `#/viewenrolmentform/:userId` | `/department/dtic/viewenrolmentform/:userId` | Dashboard / Overview |
| `#/completeDataOfLandApplicant` | `/department/dtic/completeDataOfLandApplicant` | Application Scrutiny & Details |
| `#/esignPaymentPendencyReport` | `/department/dtic/esignPaymentPendencyReport` | Challan & Fee Verification |
| `#/fa/financialAssistanceTracking/:applicationId` | `/department/dtic/fa/financialAssistanceTracking/:applicationId` | Application Scrutiny & Details |

---

### Financial Assistance (FA)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/fa/FARouting.js`
- **Authorized Role**: `ROLE_FA`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/fa/profile` | Account Security & Settings |
| `#/changepassword` | `/department/fa/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/fa/first-password-change` | Account Security & Settings |
| `#/success` | `/department/fa/success` | Dashboard / Overview |
| `#/dashboard` | `/department/fa/dashboard` | Dashboard / Overview |
| `#/powerBiDashbord` | `/department/fa/powerBiDashbord` | Dashboard / Overview |
| `#/report` | `/department/fa/report` | Dashboard / Overview |
| `#/districtWiseReport` | `/department/fa/districtWiseReport` | Dashboard / Overview |
| `#/schemeWiseReport` | `/department/fa/schemeWiseReport` | Dashboard / Overview |
| `#/districtWiseMsmeDetailsReport` | `/department/fa/districtWiseMsmeDetailsReport` | Dashboard / Overview |
| `#/msmeDetailReportList/:districtId` | `/department/fa/msmeDetailReportList/:districtId` | Dashboard / Overview |
| `#/report/:districtId` | `/department/fa/report/:districtId` | Dashboard / Overview |
| `#/reportStatus/:districtId/:status` | `/department/fa/reportStatus/:districtId/:status` | Dashboard / Overview |
| `#/report/:districtId/:scheme` | `/department/fa/report/:districtId/:scheme` | Dashboard / Overview |
| `#/SanctionedVsDisbursement` | `/department/fa/SanctionedVsDisbursement` | Dashboard / Overview |
| `#/detailList` | `/department/fa/detailList` | Dashboard / Overview |
| `#/viewfaapplicantdetailunitnew/:applicationId` | `/department/fa/viewfaapplicantdetailunitnew/:applicationId` | Application Scrutiny & Details |
| `#/querybydtic/:applicationId/:establishmentType` | `/department/fa/querybydtic/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/dticfapendingapplicantsunit` | `/department/fa/dticfapendingapplicantsunit` | Subsidy / Incentive Processing |
| `#/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | `/department/fa/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/faCommitteesStatusUnit/:applicationIds/:establishmentType` | `/department/fa/faCommitteesStatusUnit/:applicationIds/:establishmentType` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantdetailunitnew/:applicationId` | `/department/fa/fa/viewfaapplicantdetailunitnew/:applicationId` | Application Scrutiny & Details |
| `#/faOtherUploadDocuments/:applicationId/:establishmentType` | `/department/fa/faOtherUploadDocuments/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/faacceptanceamountdetailunit/:applicationId/:establishmentType` | `/department/fa/faacceptanceamountdetailunit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/viewdownloadfaacceptanceform/:applicationId/:establishmentType` | `/department/fa/viewdownloadfaacceptanceform/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/faDisbursementUnit/:applicationId/:establishmentType` | `/department/fa/faDisbursementUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/faDisbursementUnit_new` | `/department/fa/faDisbursementUnit_new` | Subsidy / Incentive Processing |
| `#/faDisbursementUnit_new2/:encodedList` | `/department/fa/faDisbursementUnit_new2/:encodedList` | Subsidy / Incentive Processing |
| `#/faDisbursementUnit1` | `/department/fa/faDisbursementUnit1` | Subsidy / Incentive Processing |
| `#/infradevelopmetList` | `/department/fa/infradevelopmetList` | Dashboard / Overview |
| `#/viewfaInfrastructure/:id` | `/department/fa/viewfaInfrastructure/:id` | Subsidy / Incentive Processing |
| `#/viewfaDisbursementUnit/:applicationId/:establishmentType` | `/department/fa/viewfaDisbursementUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/fa/newapplicantformapparel` | `/department/fa/fa/newapplicantformapparel` | Subsidy / Incentive Processing |
| `#/faCommitteeStatusUnit/:applicationId/:establishmentType` | `/department/fa/faCommitteeStatusUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/viewfaCommitteeStatusUnit/:applicationId/:establishmentType` | `/department/fa/viewfaCommitteeStatusUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/fa/viewfaDisbursementUnit/:applicationId/:establishmentType` | `/department/fa/fa/viewfaDisbursementUnit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/fa/viewfaacceptanceamountdetailunit/:applicationId/:establishmentType` | `/department/fa/fa/viewfaacceptanceamountdetailunit/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/faCommitteesStatusUnit/:applicationIds/:establishmentType` | `/department/fa/faCommitteesStatusUnit/:applicationIds/:establishmentType` | Application Scrutiny & Details |

---

### Citizen Grievance Redressal
- **Angular File**: `mpindustry-web/src/main/webapp/angular/grievanceApplicant/GrievanceApplicantRouting.js`
- **Authorized Role**: `ROLE_GRIEVANCE_APPLICANT`
- **Target Layout**: `ApplicantLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofileapplicant` | `/applicant/grievances/profile` | Account Security & Settings |
| `#/changepassword` | `/applicant/grievances/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/applicant/grievances/first-password-change` | Account Security & Settings |
| `#/success` | `/applicant/grievances/success` | Dashboard / Overview |
| `#/dashboard` | `/applicant/grievances/dashboard` | Dashboard / Overview |
| `#/userLodgedGrievances` | `/applicant/grievances/userLodgedGrievances` | Dashboard / Overview |
| `#/viewUserGrievanceRedressal/:grievanceId` | `/applicant/grievances/viewUserGrievanceRedressal/:grievanceId` | Dashboard / Overview |
| `#/grievanceReplyForm/:grievanceId` | `/applicant/grievances/grievanceReplyForm/:grievanceId` | Dashboard / Overview |
| `#/grievanceRedressalForm` | `/applicant/grievances/grievanceRedressalForm` | Dashboard / Overview |

---

### Industries Commissioner Office
- **Angular File**: `mpindustry-web/src/main/webapp/angular/icOffice/ICOfficeRouting.js`
- **Authorized Role**: `ROLE_IC_OFFICE`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/ic-office/profile` | Account Security & Settings |
| `#/changepassword` | `/department/ic-office/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/ic-office/first-password-change` | Account Security & Settings |
| `#/success` | `/department/ic-office/success` | Dashboard / Overview |
| `#/dashboard` | `/department/ic-office/dashboard` | Dashboard / Overview |
| `#/appealList` | `/department/ic-office/appealList` | Appeals & Quasi-Judicial Hearings |
| `#/appealHearingDate/:appealId` | `/department/ic-office/appealHearingDate/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/appealHearings/:appealId` | `/department/ic-office/appealHearings/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/zoAppealHearings/:appealId` | `/department/ic-office/zoAppealHearings/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/icAppealHearings/:appealId` | `/department/ic-office/icAppealHearings/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/updateAppealHearing/:appealHearingId` | `/department/ic-office/updateAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewAppealHearing/:appealHearingId` | `/department/ic-office/viewAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewApplicantForm/:applicantId` | `/department/ic-office/viewApplicantForm/:applicantId` | Application Scrutiny & Details |
| `#/viewNoticeHistory/:noticeId` | `/department/ic-office/viewNoticeHistory/:noticeId` | Dashboard / Overview |
| `#/inspectionDetails` | `/department/ic-office/inspectionDetails` | Dashboard / Overview |
| `#/inspectionDetails/:financialYearId` | `/department/ic-office/inspectionDetails/:financialYearId` | Dashboard / Overview |
| `#/viewInspectionOffice/:inspectionOfficeId` | `/department/ic-office/viewInspectionOffice/:inspectionOfficeId` | Dashboard / Overview |
| `#/printInspectionRoster/:inspectionOfficeId` | `/department/ic-office/printInspectionRoster/:inspectionOfficeId` | Dashboard / Overview |
| `#/externalauditlist` | `/department/ic-office/externalauditlist` | Dashboard / Overview |
| `#/viewExternalAudit/:rosterId` | `/department/ic-office/viewExternalAudit/:rosterId` | Roster & Audit Compliance |
| `#/icExternalAuditEnterOpinion/:rosterId` | `/department/ic-office/icExternalAuditEnterOpinion/:rosterId` | Roster & Audit Compliance |
| `#/internalAuditList` | `/department/ic-office/internalAuditList` | Roster & Audit Compliance |
| `#/viewInternalAudit/:rosterId` | `/department/ic-office/viewInternalAudit/:rosterId` | Roster & Audit Compliance |
| `#/icInternalAuditEnterOpinion/:rosterId` | `/department/ic-office/icInternalAuditEnterOpinion/:rosterId` | Roster & Audit Compliance |
| `#/cagIndiaReportListForIC` | `/department/ic-office/cagIndiaReportListForIC` | Dashboard / Overview |
| `#/cagReportAuditEnterICOpinion/:cagReportId` | `/department/ic-office/cagReportAuditEnterICOpinion/:cagReportId` | Roster & Audit Compliance |
| `#/viewIcOpinionCagReport/:cagReportId` | `/department/ic-office/viewIcOpinionCagReport/:cagReportId` | Dashboard / Overview |
| `#/pacReportList` | `/department/ic-office/pacReportList` | Dashboard / Overview |
| `#/pacAuditEnterICOpinion/:pacReportId` | `/department/ic-office/pacAuditEnterICOpinion/:pacReportId` | Roster & Audit Compliance |
| `#/viewPacReport/:pacReportId` | `/department/ic-office/viewPacReport/:pacReportId` | Dashboard / Overview |
| `#/viewConditionalDecisionZO/:hearingId/:decisionId` | `/department/ic-office/viewConditionalDecisionZO/:hearingId/:decisionId` | Dashboard / Overview |
| `#/reviewConditionalComplianceIC/:hearingId/:decisionId` | `/department/ic-office/reviewConditionalComplianceIC/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewConditionalDecisionIC/:hearingId/:decisionId` | `/department/ic-office/viewConditionalDecisionIC/:hearingId/:decisionId` | Dashboard / Overview |
| `#/msmeAwardList` | `/department/ic-office/msmeAwardList` | Dashboard / Overview |
| `#/viewMsmeAward/:id` | `/department/ic-office/viewMsmeAward/:id` | Dashboard / Overview |
| `#/editMsmeAward/:id` | `/department/ic-office/editMsmeAward/:id` | Dashboard / Overview |
| `#/viewMsmeAwardForm/:id/:applicationId` | `/department/ic-office/viewMsmeAwardForm/:id/:applicationId` | Application Scrutiny & Details |
| `#/msmeAwardApplicantsList` | `/department/ic-office/msmeAwardApplicantsList` | Application Scrutiny & Details |

---

### Industrial Land Allotment (ID Module - Pilot)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/id/IDRouting.js`
- **Authorized Role**: `ROLE_ID / ROLE_APPLICANT`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/id/profile` | Account Security & Settings |
| `#/changepassword` | `/department/id/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/id/first-password-change` | Account Security & Settings |
| `#/success` | `/department/id/success` | Dashboard / Overview |
| `#/dashboard` | `/department/id/dashboard` | Dashboard / Overview |
| `#/letterList` | `/department/id/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/id/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/id/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/id/loadHistory/:letterId` | Official Orders & LOI Letters |
| `#/vacantLands` | `/department/id/vacantLands` | Land Inventory & Allotment |
| `#/viewVancatLand/:vacantLandId` | `/department/id/viewVancatLand/:vacantLandId` | Land Inventory & Allotment |
| `#/viewAppliedApplicants/:vacantLandId` | `/department/id/viewAppliedApplicants/:vacantLandId` | Land Inventory & Allotment |
| `#/landApplications` | `/department/id/landApplications` | Dashboard / Overview |
| `#/landApplications/:filterStatusId` | `/department/id/landApplications/:filterStatusId` | Dashboard / Overview |
| `#/viewAnnualPaymentHistory/:applicantId` | `/department/id/viewAnnualPaymentHistory/:applicantId` | Challan & Fee Verification |
| `#/viewIdApplicantHistory/:applicantId/:vacantLandId` | `/department/id/viewIdApplicantHistory/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/noticeAndAppealDetails` | `/department/id/noticeAndAppealDetails` | Appeals & Quasi-Judicial Hearings |
| `#/viewNoticeHistory/:noticeId` | `/department/id/viewNoticeHistory/:noticeId` | Dashboard / Overview |
| `#/viewZOAppeal/:appealId` | `/department/id/viewZOAppeal/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/viewZOAppealHearing/:appealHearingId` | `/department/id/viewZOAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewConditionalDecisionZO/:hearingId/:decisionId` | `/department/id/viewConditionalDecisionZO/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewICAppeal/:appealId` | `/department/id/viewICAppeal/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/viewICAppealHearing/:appealHearingId` | `/department/id/viewICAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewConditionalDecisionIC/:hearingId/:decisionId` | `/department/id/viewConditionalDecisionIC/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewApplicationDetail/:applicantId/:vacantLandId` | `/department/id/viewApplicationDetail/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/viewAnnualPaymentDetails/:paymentId` | `/department/id/viewAnnualPaymentDetails/:paymentId` | Challan & Fee Verification |
| `#/holdApplications` | `/department/id/holdApplications` | Dashboard / Overview |
| `#/powerBiDashbord` | `/department/id/powerBiDashbord` | Dashboard / Overview |
| `#/legacyData` | `/department/id/legacyData` | Dashboard / Overview |
| `#/legacyData1` | `/department/id/legacyData1` | Dashboard / Overview |
| `#/viewAllUsers` | `/department/id/viewAllUsers` | Dashboard / Overview |
| `#/completeDataOfLandApplicant` | `/department/id/completeDataOfLandApplicant` | Application Scrutiny & Details |
| `#/esignPaymentPendencyReport` | `/department/id/esignPaymentPendencyReport` | Challan & Fee Verification |
| `#/releaseApplications` | `/department/id/releaseApplications` | Dashboard / Overview |
| `#/holdLand/:vacantLandId` | `/department/id/holdLand/:vacantLandId` | Land Inventory & Allotment |

---

### Lead District Manager (LDM)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/ldm/LdmRouting.js`
- **Authorized Role**: `ROLE_LDM`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/dashboard` | `/department/ldm/dashboard` | Dashboard / Overview |
| `#/verification` | `/department/ldm/verification` | Dashboard / Overview |
| `#/batches` | `/department/ldm/batches` | Dashboard / Overview |
| `#/fa/viewfaapplicantdetailunitnew/:applicationId` | `/department/ldm/fa/viewfaapplicantdetailunitnew/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | `/department/ldm/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/detail/:applicationNo` | `/department/ldm/detail/:applicationNo` | Application Scrutiny & Details |

---

### Officer In Charge (Legal OIC)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/legal/LegalOicRouting.js`
- **Authorized Role**: `ROLE_LEGAL_OIC`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/legal-oic/profile` | Account Security & Settings |
| `#/changepassword` | `/department/legal-oic/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/legal-oic/first-password-change` | Account Security & Settings |
| `#/success` | `/department/legal-oic/success` | Dashboard / Overview |
| `#/dashboard` | `/department/legal-oic/dashboard` | Dashboard / Overview |
| `#/oicCaseList` | `/department/legal-oic/oicCaseList` | Dashboard / Overview |
| `#/oicViewCase/:caseId` | `/department/legal-oic/oicViewCase/:caseId` | Dashboard / Overview |
| `#/viewOICCaseDetails/:caseId` | `/department/legal-oic/viewOICCaseDetails/:caseId` | Dashboard / Overview |
| `#/addOICCaseHearing/:caseId` | `/department/legal-oic/addOICCaseHearing/:caseId` | Appeals & Quasi-Judicial Hearings |
| `#/viewOICCaseHearing/:caseHearingId` | `/department/legal-oic/viewOICCaseHearing/:caseHearingId` | Appeals & Quasi-Judicial Hearings |

---

### Legal Section Cases & Hearings
- **Angular File**: `mpindustry-web/src/main/webapp/angular/legal/LegalRouting.js`
- **Authorized Role**: `ROLE_LEGAL`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/legal/profile` | Account Security & Settings |
| `#/changepassword` | `/department/legal/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/legal/first-password-change` | Account Security & Settings |
| `#/success` | `/department/legal/success` | Dashboard / Overview |
| `#/dashboard` | `/department/legal/dashboard` | Dashboard / Overview |
| `#/addOic` | `/department/legal/addOic` | Dashboard / Overview |
| `#/oicList` | `/department/legal/oicList` | Dashboard / Overview |
| `#/viewOIC/:userId` | `/department/legal/viewOIC/:userId` | Dashboard / Overview |
| `#/createCase` | `/department/legal/createCase` | Dashboard / Overview |
| `#/caseList` | `/department/legal/caseList` | Dashboard / Overview |
| `#/viewCase/:caseId` | `/department/legal/viewCase/:caseId` | Dashboard / Overview |
| `#/viewPrintCase/:caseId` | `/department/legal/viewPrintCase/:caseId` | Dashboard / Overview |
| `#/viewCaseDetails/:caseId` | `/department/legal/viewCaseDetails/:caseId` | Dashboard / Overview |
| `#/addCaseHearing/:caseId` | `/department/legal/addCaseHearing/:caseId` | Appeals & Quasi-Judicial Hearings |
| `#/viewCaseHearing/:caseHearingId` | `/department/legal/viewCaseHearing/:caseHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewPrintCaseHearing/:caseHearingId` | `/department/legal/viewPrintCaseHearing/:caseHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/reopenCase` | `/department/legal/reopenCase` | Dashboard / Overview |
| `#/resetPassword/:userId` | `/department/legal/resetPassword/:userId` | Account Security & Settings |
| `#/letterList` | `/department/legal/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/legal/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/legal/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/legal/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### Madhya Pradesh Financial Corporation (MBFC)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/mbfc/MBFCRouting.js`
- **Authorized Role**: `ROLE_MBFC`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/mbfc/profile` | Account Security & Settings |
| `#/changepassword` | `/department/mbfc/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/mbfc/first-password-change` | Account Security & Settings |
| `#/success` | `/department/mbfc/success` | Dashboard / Overview |
| `#/dashboard` | `/department/mbfc/dashboard` | Dashboard / Overview |
| `#/incubationRegistrations` | `/department/mbfc/incubationRegistrations` | Dashboard / Overview |
| `#/startupRegistrations` | `/department/mbfc/startupRegistrations` | Dashboard / Overview |
| `#/startupBenefitsRegistrations` | `/department/mbfc/startupBenefitsRegistrations` | Dashboard / Overview |
| `#/viewIncubationRegistration/:incubationRegistrationId` | `/department/mbfc/viewIncubationRegistration/:incubationRegistrationId` | Dashboard / Overview |
| `#/viewStartupRegistration/:startupId` | `/department/mbfc/viewStartupRegistration/:startupId` | Dashboard / Overview |
| `#/lodgedGrievances` | `/department/mbfc/lodgedGrievances` | Dashboard / Overview |
| `#/viewGrievanceRedressal/:grievanceId` | `/department/mbfc/viewGrievanceRedressal/:grievanceId` | Dashboard / Overview |
| `#/grievanceSendReminder/:grievanceId` | `/department/mbfc/grievanceSendReminder/:grievanceId` | Dashboard / Overview |
| `#/grievanceReplyForm/:grievanceId` | `/department/mbfc/grievanceReplyForm/:grievanceId` | Dashboard / Overview |
| `#/supportQueries` | `/department/mbfc/supportQueries` | Dashboard / Overview |
| `#/startupBenefitsViewPrintForm/:startupId` | `/department/mbfc/startupBenefitsViewPrintForm/:startupId` | Dashboard / Overview |

---

### Micro & Small Enterprises Facilitation Council (MSEFC)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/msefc/MSEFCRouting.js`
- **Authorized Role**: `ROLE_MSEFC`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/msefc/profile` | Account Security & Settings |
| `#/dashboard` | `/department/msefc/dashboard` | Dashboard / Overview |
| `#/changepassword` | `/department/msefc/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/msefc/first-password-change` | Account Security & Settings |
| `#/success` | `/department/msefc/success` | Dashboard / Overview |
| `#/viewmsefcform` | `/department/msefc/viewmsefcform` | Dashboard / Overview |
| `#/caseList` | `/department/msefc/caseList` | Dashboard / Overview |
| `#/editCase/:caseId` | `/department/msefc/editCase/:caseId` | Dashboard / Overview |
| `#/viewCase/:caseId` | `/department/msefc/viewCase/:caseId` | Dashboard / Overview |
| `#/updateCase/:caseId` | `/department/msefc/updateCase/:caseId` | Dashboard / Overview |
| `#/viewCaseHearing/:caseId` | `/department/msefc/viewCaseHearing/:caseId` | Appeals & Quasi-Judicial Hearings |
| `#/caseListLanding` | `/department/msefc/caseListLanding` | Dashboard / Overview |
| `#/viewCaseLanding/:caseId` | `/department/msefc/viewCaseLanding/:caseId` | Dashboard / Overview |
| `#/letterList` | `/department/msefc/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/msefc/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/msefc/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/msefc/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### State MSME Awards Evaluation
- **Angular File**: `mpindustry-web/src/main/webapp/angular/msme/MsmeRouting.js`
- **Authorized Role**: `ROLE_MSME`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/msme/profile` | Account Security & Settings |
| `#/changepassword` | `/department/msme/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/msme/first-password-change` | Account Security & Settings |
| `#/success` | `/department/msme/success` | Dashboard / Overview |
| `#/dashboard` | `/department/msme/dashboard` | Dashboard / Overview |
| `#/msmeAwardList` | `/department/msme/msmeAwardList` | Dashboard / Overview |
| `#/msmeawardsingleform` | `/department/msme/msmeawardsingleform` | Dashboard / Overview |
| `#/evalutionStageform` | `/department/msme/evalutionStageform` | Dashboard / Overview |
| `#/viewMsmeAward/:id` | `/department/msme/viewMsmeAward/:id` | Dashboard / Overview |
| `#/editMsmeAward/:id` | `/department/msme/editMsmeAward/:id` | Dashboard / Overview |
| `#/viewMsmeAwardForm/:id/:applicationId` | `/department/msme/viewMsmeAwardForm/:id/:applicationId` | Application Scrutiny & Details |
| `#/msmeAwardApplicantsList` | `/department/msme/msmeAwardApplicantsList` | Application Scrutiny & Details |
| `#/msmeStartupAwardList` | `/department/msme/msmeStartupAwardList` | Dashboard / Overview |
| `#/viewStartupAwardForm/:id` | `/department/msme/viewStartupAwardForm/:id` | Dashboard / Overview |
| `#/evalutionCommittteform/:id` | `/department/msme/evalutionCommittteform/:id` | Dashboard / Overview |
| `#/applicantListForm/:id` | `/department/msme/applicantListForm/:id` | Dashboard / Overview |
| `#/evaluation/:id/:awardId/:awardFinancialYear/:applicationNo` | `/department/msme/evaluation/:id/:awardId/:awardFinancialYear/:applicationNo` | Application Scrutiny & Details |
| `#/editEvaluation/:id/:awardId/:awardFinancialYear/:applicationNo` | `/department/msme/editEvaluation/:id/:awardId/:awardFinancialYear/:applicationNo` | Application Scrutiny & Details |
| `#/msmeAwardCommitteeEvalList` | `/department/msme/msmeAwardCommitteeEvalList` | Dashboard / Overview |
| `#/openApplicantForHOEvaluation/:id/:awardStatusId` | `/department/msme/openApplicantForHOEvaluation/:id/:awardStatusId` | Application Scrutiny & Details |
| `#/viewApplicantForHOEvaluation/:id/:awardStatusId` | `/department/msme/viewApplicantForHOEvaluation/:id/:awardStatusId` | Application Scrutiny & Details |
| `#/declareResult/:id` | `/department/msme/declareResult/:id` | Dashboard / Overview |
| `#/viewWinners/:id` | `/department/msme/viewWinners/:id` | Dashboard / Overview |

---

### Principal Secretary (MSME)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/secretary/SecretaryRouting.js`
- **Authorized Role**: `ROLE_SECRETARY`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/dashboard` | `/department/secretary/dashboard` | Dashboard / Overview |
| `#/verification` | `/department/secretary/verification` | Dashboard / Overview |
| `#/batches` | `/department/secretary/batches` | Dashboard / Overview |
| `#/fa/viewfaapplicantdetailunitnew/:applicationId` | `/department/secretary/fa/viewfaapplicantdetailunitnew/:applicationId` | Application Scrutiny & Details |
| `#/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | `/department/secretary/fa/viewfaapplicantHistory/:applicationId/:establishmentType` | Application Scrutiny & Details |
| `#/detail/:applicationNo` | `/department/secretary/detail/:applicationNo` | Application Scrutiny & Details |

---

### Self Employment Schemes (Yuva Udyami / MMYUY)
- **Angular File**: `mpindustry-web/src/main/webapp/angular/selfemployment/routing.js`
- **Authorized Role**: `ROLE_APPLICANT`
- **Target Layout**: `ApplicantLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/applicant/self-employment/profile` | Account Security & Settings |
| `#/changepassword` | `/applicant/self-employment/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/applicant/self-employment/first-password-change` | Account Security & Settings |
| `#/success` | `/applicant/self-employment/success` | Dashboard / Overview |
| `#/dashboard` | `/applicant/self-employment/dashboard` | Dashboard / Overview |
| `#/yuvaudyami` | `/applicant/self-employment/yuvaudyami` | Dashboard / Overview |
| `#/newYuvaUdyamiForm` | `/applicant/self-employment/newYuvaUdyamiForm` | Dashboard / Overview |
| `#/viewYuvaUdyamiDetail/:applicantId` | `/applicant/self-employment/viewYuvaUdyamiDetail/:applicantId` | Dashboard / Overview |
| `#/viewYuvaDocumentDetail/:applicantId` | `/applicant/self-employment/viewYuvaDocumentDetail/:applicantId` | Dashboard / Overview |
| `#/mpselfemployment` | `/applicant/self-employment/mpselfemployment` | Dashboard / Overview |
| `#/newapplicantform` | `/applicant/self-employment/newapplicantform` | Dashboard / Overview |
| `#/viewapplicantdetail/:applicantId` | `/applicant/self-employment/viewapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/viewdocumentdetail/:applicantId` | `/applicant/self-employment/viewdocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewschemedetailform/:applicantId` | `/applicant/self-employment/viewschemedetailform/:applicantId` | Dashboard / Overview |
| `#/viewprojectreportform/:applicantId` | `/applicant/self-employment/viewprojectreportform/:applicantId` | Dashboard / Overview |

---

### MP Startup & Incubator Center
- **Angular File**: `mpindustry-web/src/main/webapp/angular/startupCenter/StartupCenterRouting.js`
- **Authorized Role**: `ROLE_STARTUP_CENTER`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/startup-center/profile` | Account Security & Settings |
| `#/changepassword` | `/department/startup-center/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/startup-center/first-password-change` | Account Security & Settings |
| `#/success` | `/department/startup-center/success` | Dashboard / Overview |
| `#/dashboard` | `/department/startup-center/dashboard` | Dashboard / Overview |
| `#/fa/faManageStartupFundAssistance` | `/department/startup-center/fa/faManageStartupFundAssistance` | Subsidy / Incentive Processing |
| `#/fa/faManageIncubatorDetailList` | `/department/startup-center/fa/faManageIncubatorDetailList` | Subsidy / Incentive Processing |
| `#/fa/printFAIncubatorFundingAssistance/:id` | `/department/startup-center/fa/printFAIncubatorFundingAssistance/:id` | Subsidy / Incentive Processing |
| `#/fa/printFAStartupFundingAssistance/:id` | `/department/startup-center/fa/printFAStartupFundingAssistance/:id` | Subsidy / Incentive Processing |
| `#/fa/newapplicantform/:id` | `/department/startup-center/fa/newapplicantform/:id` | Subsidy / Incentive Processing |
| `#/fa/newapplicantform` | `/department/startup-center/fa/newapplicantform` | Subsidy / Incentive Processing |
| `#/fa/faManageStartupFundAssistanceNew` | `/department/startup-center/fa/faManageStartupFundAssistanceNew` | Subsidy / Incentive Processing |

---

### Textile Industry Subsidies
- **Angular File**: `mpindustry-web/src/main/webapp/angular/textile/textileRouting.js`
- **Authorized Role**: `ROLE_TEXTILE`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/textile/profile` | Account Security & Settings |
| `#/changepassword` | `/department/textile/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/textile/first-password-change` | Account Security & Settings |
| `#/success` | `/department/textile/success` | Dashboard / Overview |
| `#/dashboard` | `/department/textile/dashboard` | Dashboard / Overview |
| `#/entersubsidyclaim` | `/department/textile/entersubsidyclaim` | Subsidy / Incentive Processing |
| `#/subsidyclaimlist` | `/department/textile/subsidyclaimlist` | Subsidy / Incentive Processing |
| `#/viewprintsubsidyclaim/:id` | `/department/textile/viewprintsubsidyclaim/:id` | Subsidy / Incentive Processing |
| `#/uploadsanctionorder/:id` | `/department/textile/uploadsanctionorder/:id` | Dashboard / Overview |
| `#/uploadutilitycertificate/:id` | `/department/textile/uploadutilitycertificate/:id` | Dashboard / Overview |
| `#/viewhistory/:id` | `/department/textile/viewhistory/:id` | Dashboard / Overview |
| `#/editsubsidyclaim/:id` | `/department/textile/editsubsidyclaim/:id` | Subsidy / Incentive Processing |
| `#/letterList` | `/department/textile/letterList` | Official Orders & LOI Letters |
| `#/viewLetter/:letterId` | `/department/textile/viewLetter/:letterId` | Official Orders & LOI Letters |
| `#/updateProcess/:letterId` | `/department/textile/updateProcess/:letterId` | Official Orders & LOI Letters |
| `#/loadHistory/:letterId` | `/department/textile/loadHistory/:letterId` | Official Orders & LOI Letters |

---

### Zonal Industry Office
- **Angular File**: `mpindustry-web/src/main/webapp/angular/zonaloffice/routing.js`
- **Authorized Role**: `ROLE_ZONAL`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/zonal/profile` | Account Security & Settings |
| `#/changepassword` | `/department/zonal/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/zonal/first-password-change` | Account Security & Settings |
| `#/success` | `/department/zonal/success` | Dashboard / Overview |
| `#/dashboard` | `/department/zonal/dashboard` | Dashboard / Overview |
| `#/viewapplicationlist` | `/department/zonal/viewapplicationlist` | Application Scrutiny & Details |
| `#/viewmsmedetail/:msmeDetailId` | `/department/zonal/viewmsmedetail/:msmeDetailId` | Dashboard / Overview |
| `#/dtfcpendingapplicants` | `/department/zonal/dtfcpendingapplicants` | Dashboard / Overview |
| `#/viewapplicantdetail/:applicantId` | `/department/zonal/viewapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/serviceenterprisereportform` | `/department/zonal/serviceenterprisereportform` | Dashboard / Overview |
| `#/manufacturingenterprisereportform` | `/department/zonal/manufacturingenterprisereportform` | Subsidy / Incentive Processing |
| `#/microlevelreportform` | `/department/zonal/microlevelreportform` | Dashboard / Overview |
| `#/smalllevelreportform` | `/department/zonal/smalllevelreportform` | Dashboard / Overview |
| `#/mediumlevelreportform` | `/department/zonal/mediumlevelreportform` | Dashboard / Overview |
| `#/faapplicants` | `/department/zonal/faapplicants` | Subsidy / Incentive Processing |
| `#/viewfaapplicantdetail/:applicationId` | `/department/zonal/viewfaapplicantdetail/:applicationId` | Application Scrutiny & Details |
| `#/viewfaschemesdetails/:applicationId` | `/department/zonal/viewfaschemesdetails/:applicationId` | Application Scrutiny & Details |
| `#/dticpendingapplicants` | `/department/zonal/dticpendingapplicants` | Dashboard / Overview |
| `#/viewapplicantdetail/:applicantId` | `/department/zonal/viewapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/viewyuapplicantdetail/:applicantId` | `/department/zonal/viewyuapplicantdetail/:applicantId` | Dashboard / Overview |
| `#/viewdocumentdetail/:applicantId` | `/department/zonal/viewdocumentdetail/:applicantId` | Dashboard / Overview |
| `#/viewschemedetailform/:applicantId` | `/department/zonal/viewschemedetailform/:applicantId` | Dashboard / Overview |
| `#/viewprojectreportform/:applicantId` | `/department/zonal/viewprojectreportform/:applicantId` | Dashboard / Overview |
| `#/viewyuprojectreportform/:applicantId` | `/department/zonal/viewyuprojectreportform/:applicantId` | Dashboard / Overview |
| `#/dticpendingyuvaudhami` | `/department/zonal/dticpendingyuvaudhami` | Dashboard / Overview |
| `#/externalauditlist` | `/department/zonal/externalauditlist` | Dashboard / Overview |
| `#/viewExternalAudit/:rosterId` | `/department/zonal/viewExternalAudit/:rosterId` | Roster & Audit Compliance |
| `#/zonalExternalAuditEnterOpinion/:rosterId` | `/department/zonal/zonalExternalAuditEnterOpinion/:rosterId` | Roster & Audit Compliance |
| `#/internalAuditList` | `/department/zonal/internalAuditList` | Roster & Audit Compliance |
| `#/viewInternalAudit/:rosterId` | `/department/zonal/viewInternalAudit/:rosterId` | Roster & Audit Compliance |
| `#/zonalInternalAuditEnterOpinion/:auditRosterId` | `/department/zonal/zonalInternalAuditEnterOpinion/:auditRosterId` | Roster & Audit Compliance |
| `#/factualdetaillist` | `/department/zonal/factualdetaillist` | Subsidy / Incentive Processing |
| `#/viewFactualDetail/:factualDetailId` | `/department/zonal/viewFactualDetail/:factualDetailId` | Subsidy / Incentive Processing |
| `#/zonalFactualDetailEnterOpinion/:factualDetailId` | `/department/zonal/zonalFactualDetailEnterOpinion/:factualDetailId` | Subsidy / Incentive Processing |
| `#/proformaclauselist` | `/department/zonal/proformaclauselist` | Dashboard / Overview |
| `#/zonalProformaClauseEnterOpinion/:proformaId` | `/department/zonal/zonalProformaClauseEnterOpinion/:proformaId` | Dashboard / Overview |
| `#/viewProformaClause/:proformaId` | `/department/zonal/viewProformaClause/:proformaId` | Dashboard / Overview |
| `#/appealList` | `/department/zonal/appealList` | Appeals & Quasi-Judicial Hearings |
| `#/appealHearingDate/:appealId` | `/department/zonal/appealHearingDate/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/appealHearings/:appealId` | `/department/zonal/appealHearings/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/viewAppealHearings/:appealId` | `/department/zonal/viewAppealHearings/:appealId` | Appeals & Quasi-Judicial Hearings |
| `#/updateAppealHearing/:appealHearingId` | `/department/zonal/updateAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewAppealHearing/:appealHearingId` | `/department/zonal/viewAppealHearing/:appealHearingId` | Appeals & Quasi-Judicial Hearings |
| `#/viewApplicantForm/:applicantId` | `/department/zonal/viewApplicantForm/:applicantId` | Application Scrutiny & Details |
| `#/viewNoticeHistory/:noticeId` | `/department/zonal/viewNoticeHistory/:noticeId` | Dashboard / Overview |
| `#/landApplications` | `/department/zonal/landApplications` | Dashboard / Overview |
| `#/viewAnnualPaymentHistory/:applicantId` | `/department/zonal/viewAnnualPaymentHistory/:applicantId` | Challan & Fee Verification |
| `#/reviewConditionalComplianceZO/:hearingId/:decisionId` | `/department/zonal/reviewConditionalComplianceZO/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewConditionalDecisionZO/:hearingId/:decisionId` | `/department/zonal/viewConditionalDecisionZO/:hearingId/:decisionId` | Dashboard / Overview |
| `#/reviewConditionalComplianceIC/:hearingId/:decisionId` | `/department/zonal/reviewConditionalComplianceIC/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewConditionalDecisionIC/:hearingId/:decisionId` | `/department/zonal/viewConditionalDecisionIC/:hearingId/:decisionId` | Dashboard / Overview |
| `#/viewApplicationDetail/:applicantId/:vacantLandId` | `/department/zonal/viewApplicationDetail/:applicantId/:vacantLandId` | Land Inventory & Allotment |
| `#/viewAnnualPaymentDetails/:paymentId` | `/department/zonal/viewAnnualPaymentDetails/:paymentId` | Challan & Fee Verification |

---

### Zonal Operator Enrolment
- **Angular File**: `mpindustry-web/src/main/webapp/angular/zonaloperator/routing.js`
- **Authorized Role**: `ROLE_ZONAL_OPERATOR`
- **Target Layout**: `DepartmentLayout`

| Old AngularJS Hash Route | New React Router Browser Route | Type / Description |
|---|---|---|
| `#/updateprofile` | `/department/zonal-operator/profile` | Account Security & Settings |
| `#/changepassword` | `/department/zonal-operator/change-password` | Account Security & Settings |
| `#/firstPasswordChange` | `/department/zonal-operator/first-password-change` | Account Security & Settings |
| `#/success` | `/department/zonal-operator/success` | Dashboard / Overview |
| `#/dashboard` | `/department/zonal-operator/dashboard` | Dashboard / Overview |
| `#/enrolmentList` | `/department/zonal-operator/enrolmentList` | Dashboard / Overview |
| `#/enrolmentform` | `/department/zonal-operator/enrolmentform` | Dashboard / Overview |
| `#/enrolmentform` | `/department/zonal-operator/enrolmentform` | Dashboard / Overview |
| `#/viewenrolmentform/:userId` | `/department/zonal-operator/viewenrolmentform/:userId` | Dashboard / Overview |

---

