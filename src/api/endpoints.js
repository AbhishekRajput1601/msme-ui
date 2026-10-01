/**
 * endpoints.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralised registry of all backend endpoint URL strings.
 *
 * Rules
 * ──────
 *  • Every URL is RELATIVE (no leading base URL) – httpClient.js prepends /mpmsme.
 *  • Path parameters use {placeholder} notation; callers must replace them,
 *    e.g.  ID.FETCH_VACANT_LAND_DETAIL.replace('{vacantLandId}', id)
 *  • Keep one object per backend module.  Add new entries here as modules
 *    are migrated; do not scatter raw URL strings through component code.
 *
 * Classification key (matches route-api-mapping.md):
 *   A  = JSON @ResponseBody
 *   B  = HTML-only ModelAndView (page load via templateUrl)
 *   C  = Mixed HTML + data
 *   D  = File upload / download
 *   E  = External redirect (Cyber Treasury, eSign, Aadhaar)
 */

// ─── Common / Shared ──────────────────────────────────────────────────────────

export const COMMON = {
  /** [A] Fetch i18n message by key  →  { value: "..." } */
  GET_MESSAGE: '/getMessage/{key}',

  /** [B] Update user profile page */
  UPDATE_PROFILE: '/updateprofile',

  /** [B] Change password page */
  CHANGE_PASSWORD: '/changepassword',

  /** [B] First-login forced password change page */
  FIRST_PASSWORD_CHANGE: '/firstPasswordChange',
}

// ─── Auth / Session ───────────────────────────────────────────────────────────

export const AUTH = {
  /**
   * [E] Spring Security formLogin processing URL.
   * POST application/x-www-form-urlencoded
   * Fields: j_username, j_password, captchaText, loginType, language, csrfPreventionSalt
   * Use httpClient.postForm() to call this.
   */
  LOGIN_PROCESSING: '/j_spring_security_check',

  /** [B] Legacy/Thymeleaf login page */
  LOGIN_PAGE: '/website/login',

  /** [E] Spring Security logout endpoint (POST or GET) */
  LOGOUT: '/logout',

  /**
   * [A] Current user session profile endpoint
   * GET  →  { authenticated: boolean, username: string, roles: string[], displayName: string, locale: string }
   */
  CURRENT_USER: '/api/session/current-user',

  /** [D] Captcha image generator (returns JPEG/PNG) */
  CAPTCHA: '/website/captcha',

  /** [C] Mobile login OTP generation */
  LOGIN_MOBILE_OTP: '/website/login-through-mobile',

  /** [C] Mobile login OTP authentication */
  LOGIN_MOBILE_AUTH: '/website/login-through-mobileauth',
}

// ─── Shell Supporting APIs (Task 4) ──────────────────────────────────────────

export const SHELL = {
  /** [A] Dynamic navigation menu items based on active roles */
  MENU: '/api/shell/menu',

  /** [A] Current user granted authorities and permission flags */
  PERMISSIONS: '/api/shell/permissions',

  /** [A] Live dashboard queue metrics and summary counts */
  DASHBOARD_COUNTS: '/api/shell/dashboard-counts',

  /** [A] Localization bundle messages */
  LOCALIZATION: '/api/shell/localization/{locale}',
}

// ─── Modern REST APIs for Category C Replacements (Task 3) ───────────────────

export const REST_ID = {
  /** [A] Clean JSON application details with typed DTO */
  APPLICATION_DETAIL: '/api/applicant/id/application-detail/{applicantId}/{vacantLandId}',

  /** [A] Clean JSON documents upload status */
  DOCUMENTS_STATUS: '/api/applicant/id/documents-status/{applicantId}/{vacantLandId}',

  /** [A] Clean JSON LOC payment review details */
  LOC_PAYMENT_REVIEW: '/api/applicant/id/loc-payment-review/{locChallanId}',

  /** [A] Clean JSON annual lease payment details */
  ANNUAL_PAYMENT_DETAIL: '/api/applicant/id/annual-payment-detail/{paymentId}',
}

// ─── ID Module — IDSectionController  (/idSection/*) ─────────────────────────

export const ID_SECTION = {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  /** [B] Section officer home / dashboard page */
  HOME: '/idSection/home',
  /** [B] Dashboard page template */
  DASHBOARD: '/idSection/dashboard',
  /** [A] Status-wise applicant counts  →  List<ApplicantsCountBean> */
  FETCH_APPLICANTS_COUNT_STATUS_WISE: '/idSection/fetchApplicantsCountStatusWise',

  // ── Vacant Lands ───────────────────────────────────────────────────────────
  /** [B] Vacant land list page */
  VACANT_LANDS: '/idSection/vacantLands',
  /** [A] Paginated/filtered vacant land list JSON */
  FETCH_VACANT_LAND_LIST: '/idSection/fetchVacantLandList',
  /** [C] View/edit single vacant land parcel */
  VIEW_VACANT_LAND: '/idSection/viewVancatLand/{vacantLandId}',
  /** [A] Single vacant land detail  →  VacantLandBean */
  FETCH_VACANT_LAND_DETAIL: '/idSection/fetchvacantlanddetail/{vacantLandId}',
  /** [A] Collector rate list for a financial year / industrial area */
  LOAD_FY_COLLECTOR_RATES: '/idSection/loadFYCollectorRates/{industrialAreaId}',
  /** [D] Download vacant land map image/PDF */
  DOWNLOAD_VACANT_LAND_MAP: '/idSection/downloadVacantLandMap/{vacantLandId}',
  /** [D] Download industrial area map */
  DOWNLOAD_INDUSTRIAL_AREA_MAP: '/idSection/downloadIndustrialAreaMap/{locationId}',
  /** [A] Delete (soft) a vacant land record */
  DELETE_VACANT_LAND_DETAIL: '/idSection/deleteVacantLandDetail/{vacantLandId}',
  /** [D] Export vacant land list to Excel */
  VACANT_LAND_LIST_EXPORT_EXCEL: '/idSection/vacantLandListExportToExcel',

  // ── Applicants for a Land ─────────────────────────────────────────────────
  /** [B] Applicants applied for a specific land parcel */
  VIEW_APPLIED_APPLICANTS: '/idSection/viewAppliedApplicants/{vacantLandId}',
  /** [A] Pending applicants JSON for a land parcel */
  LOAD_PENDING_APPLICANTS: '/idSection/loadIdPendingApplicants/{vacantLandId}',

  // ── Land Applications ─────────────────────────────────────────────────────
  /** [B] Land application list page */
  LAND_APPLICATIONS: '/idSection/landApplications',
  /** [A] Application list JSON */
  FETCH_APPLICATION_LIST: '/idSection/fetchApplicationList',
  /** [A] Full applicant detail bean */
  FETCH_APPLICATION_DETAIL: '/idSection/fetchApplicationDetail/{applicantId}',
  /** [D] Export application list to Excel */
  APPLICATION_LIST_EXPORT_EXCEL: '/idSection/applicationListExportToExcel/{filterStatusId}',
  /** [A] Update applicant status (approve/reject) */
  UPDATE_APPLICANT_BY_STATUS: '/idSection/id/updateApplicantByStatus',

  // ── Annual Payment History ────────────────────────────────────────────────
  /** [C] Annual payment history page */
  VIEW_ANNUAL_PAYMENT_HISTORY: '/idSection/viewAnnualPaymentHistory/{applicantId}',
  /** [A] Annual payment history list  →  List<IDAnnualPaymentBean> */
  FETCH_ANNUAL_PAYMENT_HISTORY: '/idSection/fetchAnnualPaymentHistory/{applicantId}',
  /** [C] Single payment detail page */
  VIEW_ANNUAL_PAYMENT_DETAILS: '/idSection/viewAnnualPaymentDetails/{paymentId}',
  /** [A] Single payment detail bean  →  IDAnnualPaymentBean */
  FETCH_ANNUAL_PAYMENT_DETAILS: '/idSection/fetchAnnualPaymentDetails/{paymentId}',

  // ── Applicant History ─────────────────────────────────────────────────────
  /** [C] Full applicant history for a specific land */
  VIEW_ID_HISTORY: '/idSection/viewIdHistory/{applicantId}/{vacantLandId}',
  /** [A] Applicant history JSON */
  FETCH_HISTORY: '/idSection/id/fetchHistory',

  // ── Notices & Appeals ─────────────────────────────────────────────────────
  /** [B] Notice and appeal list page */
  NOTICE_AND_APPEAL_DETAILS: '/idSection/noticeAndAppealDetails',
  /** [A] Notice & appeal list JSON */
  FETCH_NOTICE_AND_APPEAL_DETAILS: '/idSection/fetchNoticeAndAppealDetails',
  /** [C] Notice history detail page */
  VIEW_NOTICE_HISTORY: '/idSection/viewNoticeHistory/{noticeId}',
  /** [A] Notice detail bean */
  LOAD_NOTICE_DETAILS: '/idSection/loadNoticeDetails/{noticeId}',
  /** [D] Download notice attachment */
  DOWNLOAD_NOTICE_DOCUMENT: '/idSection/downloadNoticeDocument/{documentId}',

  // ── ZO Appeals (Section view) ─────────────────────────────────────────────
  /** [C] ZO appeal detail */
  VIEW_ZO_APPEAL: '/idSection/viewZOAppeal/{appealId}',
  /** [A] ZO appeal detail bean  →  IdAppealBean */
  LOAD_APPEAL_DETAILS: '/idSection/loadAppealDetails/{appealId}',
  /** [C] ZO appeal hearing detail */
  VIEW_ZO_APPEAL_HEARING: '/idSection/viewZOAppealHearing/{appealHearingId}',
  /** [A] ZO hearing detail bean */
  LOAD_APPEAL_HEARING_DETAILS: '/idSection/loadAppealHearingDetails/{appealHearingId}',
  /** [A] Hearing details JSON */
  FETCH_HEARING_DETAILS: '/idSection/fetchHearingDetails/{hearingId}',

  // ── IC Appeals (Section view) ─────────────────────────────────────────────
  /** [C] IC appeal detail */
  VIEW_IC_APPEAL: '/idSection/viewICAppeal/{appealId}',
  /** [C] IC appeal hearing detail */
  VIEW_IC_APPEAL_HEARING: '/idSection/viewICAppealHearing/{appealHearingId}',

  // ── Conditional Decisions ─────────────────────────────────────────────────
  /** [C] ZO conditional decision page */
  VIEW_CONDITIONAL_DECISION_ZO: '/idSection/viewConditionalDecisionZO/{hearingId}/{decisionId}',
  /** [C] IC conditional decision page */
  VIEW_CONDITIONAL_DECISION_IC: '/idSection/viewConditionalDecisionIC/{hearingId}/{decisionId}',

  // ── Application Detail ────────────────────────────────────────────────────
  /** [C] Full application detail page (section view) */
  VIEW_APPLICATION_DETAIL: '/idSection/viewApplicationDetail/{applicantId}/{vacantLandId}',
  /** [D] Download applicant document by type code */
  DOWNLOAD_ID_DOCUMENT: '/idSection/downloadIdDocument/{documentTypeCode}/{applicantId}',

  // ── Hold / Release ────────────────────────────────────────────────────────
  /** [B] Hold applications list */
  HOLD_APPLICATIONS: '/idSection/holdApplications',
  /** [C] Hold land form for a specific parcel */
  HOLD_LAND: '/idSection/holdLand/{vacantLandId}',
  /** [A] DTIC district map JSON */
  FETCH_DTIC_DISTRICTS_MAP: '/idSection/fetchdticdistrictsmap',
  /** [A] Industrial area list for a district */
  FETCH_INDUSTRIAL_AREA_LIST_BY_DISTRICT: '/idSection/fetchIndustrialAreaList/{districtId}',
  /** [A] Vacant lands eligible for hold */
  FETCH_VACANT_LAND_LIST_FOR_HOLD: '/idSection/fetchVacantLandListForHold/{districtId}/{locationId}/{bookingStartDate}',
  /** [A] Save hold/release action  →  ResponseObject */
  SAVE_HOLD_RELEASE: '/idSection/saveHoldRelease',
  /** [B] Release applications list */
  RELEASE_APPLICATIONS: '/idSection/releaseApplications',
  /** [A] Vacant lands eligible for release */
  FETCH_VACANT_LAND_LIST_FOR_RELEASE: '/idSection/fetchVacantLandListForRelease/{districtId}/{locationId}',
  /** [A] Save release action  →  ResponseObject */
  SAVE_RELEASE: '/idSection/saveRelease',

  // ── Reports ───────────────────────────────────────────────────────────────
  /** [B] Power BI dashboard iframe page */
  POWER_BI_DASHBOARD: '/idSection/powerBiDashbord',
  /** [B] Legacy data entry page */
  LEGACY_DATA: '/idSection/legacyData',
  /** [C] All users list */
  VIEW_ALL_USERS: '/idSection/viewAllUsers',
  /** [A] User list JSON */
  FETCH_USER_DATA_LIST: '/idSection/fetchUserDataList',
  /** [D] Export user list to Excel */
  USER_LIST_EXPORT_EXCEL: '/idSection/userListExportToExcel',
  /** [D] Export historic data to Excel */
  HISTORIC_LIST_EXPORT_EXCEL: '/idSection/historicListExportToExcel',
  /** [A] Historic data list JSON */
  FETCH_HISTORIC_DATA_LIST: '/idSection/fetchHistoricDataList',
  /** [B] Complete land applicant report page */
  COMPLETE_DATA_OF_LAND_APPLICANT: '/idSection/completeDataOfLandApplicant',
  /** [A] Complete land applicant data  params: month, year */
  FETCH_COMPLETE_DATA_OF_LAND_APPLICANT: '/idSection/fetchCompleteDataOfLandApplicant',
  /** [B] eSign/payment pendency report page */
  ESIGN_PAYMENT_PENDENCY_REPORT: '/idSection/esignPaymentPendencyReport',
  /** [A] eSign/payment pendency data  params: month, year */
  FETCH_ESIGN_PAYMENT_PENDENCY_REPORT: '/idSection/fetchEsignPaymentPendencyReport',

  // ── Master Data ───────────────────────────────────────────────────────────
  /** [A] All industrial areas */
  FETCH_INDUSTRIAL_AREA_LIST: '/idSection/fetchIndustrialAreaList',
  /** [A] Industrial areas for legacy entry (by district) */
  FETCH_INDUSTRIAL_AREA_LIST_LEGACY: '/idSection/fetchIndustrialAreaListforLegacy/{districtId}',
  /** [A] Purpose area master list */
  FETCH_PURPOSE_AREA_LIST: '/idSection/fetchPurposeAreaList',
  /** [A] Industry category master list */
  FETCH_CATEGORY_OF_INDUSTRY: '/idSection/fatchCategoryOfIndustry',
  /** [A] Industrial profile document checklist */
  FETCH_INDUSTRIAL_PROFILE_DOCS: '/idSection/fetchIndustrialProfileDocumentsList',
  /** [A] Document type master */
  FETCH_DOCUMENTS_LIST: '/idSection/fetchDocumentsList',
}

// ─── ID Module — IDApplicantController  (/applicant/*) ───────────────────────

export const ID_APPLICANT = {
  // ── Application Form ──────────────────────────────────────────────────────
  /** [B] Applicant home page */
  HOME: '/applicant/home',
  /** [C] View application form (read-only) */
  VIEW_APPLY_FOR_LAND_FORM: '/viewApplyForLandForm/{applicantId}/{vacantLandId}',
  /** [C] Edit application form */
  EDIT_APPLY_FOR_LAND_FORM: '/editApplyForLandForm/{applicantId}/{vacantLandId}',
  /** [C] View application detail (applicant) */
  VIEW_APPLICATION_DETAIL: '/viewApplicationDetail/{applicantId}/{vacantLandId}',
  /** [C] View eSign application detail */
  VIEW_ESIGN_APPLICATION_DETAIL: '/viewESignApplicationDetail/{applicantId}/{vacantLandId}',
  /** [A] Submit new land application  →  ResponseObject */
  ADD_ID_APPLICANT_DETAIL: '/id/addIdApplicantDetail',
  /** [A] Update application  →  ResponseObject */
  UPDATE_ID_APPLICANT_DETAIL: '/id/updateIdApplicantDetail',
  /** [A] Edit application  →  ResponseObject */
  EDIT_ID_APPLICANT_DETAIL: '/id/editIdApplicantDetail',
  /** [A] Fetch vacant land detail for applicant */
  FETCH_VACANT_LAND_DETAIL: '/id/fetchVacantLandDetail/{vacantLandId}',
  /** [A] Fetch full applicant bean */
  FETCH_APPLICATION_DETAIL: '/fetchApplicationDetail/{applicantId}',
  /** [A] Update status (applicant submits) */
  UPDATE_ID_APPLICANT_STATUS: '/updateIdApplicantStatus/{applicantId}',

  // ── Documents ─────────────────────────────────────────────────────────────
  /** [C] View documents upload page */
  VIEW_DOCUMENTS_UPLOAD: '/id/viewDocumentsUpload/{applicantId}/{vacantLandId}',
  /** [C] Edit documents upload page */
  EDIT_DOCUMENTS_UPLOAD: '/id/editDocumentsUpload/{applicantId}/{vacantLandId}',
  /** [D] Upload applicant documents (multipart) */
  ADD_ID_APPLICANT_DOCUMENTS: '/addIDApplicantDocuments',
  /** [D] Update applicant documents (multipart) */
  UPDATE_ID_APPLICANT_DOCUMENTS: '/updateIDApplicantDocuments',
  /** [D] Download eSigned document */
  DOWNLOAD_ESIGN_DOCUMENT: '/downloadEsignDocument/{documentId}',
  /** [D] Download document by type */
  DOWNLOAD_DOCUMENT: '/id/downloaddocument/{documentType}/{applicantId}',
  /** [D] Download ID document by type code */
  DOWNLOAD_ID_DOCUMENT: '/downloadIdDocument/{documentTypeCode}/{applicantId}',
  /** [A] Document type master */
  FETCH_DOCUMENTS_LIST: '/id/fetchDocumentsList',

  // ── LOC (Letter of Comfort) ───────────────────────────────────────────────
  /** [C] LOC upload page */
  UPLOAD_LOC: '/uploadLOC/{applicantId}',
  /** [D] Upload LOC letter (multipart) */
  UPLOAD_LOC_LETTER: '/uploadLOCLetter',
  /** [D] Generate and download LOC PDF */
  GENERATE_LOC_LETTER: '/generateLOCLetter1/{applicantId}',
  /** [C] LOC payment review page */
  REVIEW_LOC_PAYMENT: '/reviewLocPayment/{locChallanId}',
  /** [C] LOC details view */
  VIEW_LOC_DETAILS: '/viewLOCDetails/{applicantId}',
  /** [C] LOC payment details */
  LOC_PAYMENT_DETAILS: '/locPaymentDetails/{locChallanId}',

  // ── Online Payment (Cyber Treasury) ──────────────────────────────────────
  /** [C] Pre-payment review page */
  ONLINE_PAYMENT: '/id/onlinePayment/{applicantId}/{vacantLandId}',
  /** [C] Retry failed payment */
  RETRY_ONLINE_PAYMENT: '/id/retryOnlinePayment/{applicantId}/{vacantLandId}',
  /** [C] Retry LOC payment */
  RETRY_LOC_PAYMENT: '/id/retryLOCPayment/{locChallanId}',
  /** [E] Submit online payment to Cyber Treasury */
  SUBMIT_ONLINE_PAYMENT: '/id/submitOnlinePayment',
  /** [E] Submit LOC payment */
  SUBMIT_LOC_PAYMENT: '/id/submitLOCPayment',
  /** [E] Submit appeal payment */
  SUBMIT_APPEAL_PAYMENT: '/id/submitAppealPayment',
  /** [E] Cyber Treasury POST-back handler */
  PAYMENT_RESPONSE: '/id/paymentResponse',
  /** [E] Double-verification callback */
  PAYMENT_RESPONSE_DOUBLE_VERIFICATION: '/id/paymentResponseDoubleVerification',
  /** [C] Payment receipt page (CSFMS) */
  ONLINE_PAYMENT_RESPONSE_CSFMS: '/id/onlinePaymentResponse_csfms/{crn}',
  /** [E] Check online payment status (double verification enquiry) */
  CHECK_ONLINE_PAYMENT_STATUS: '/id/checkOnlinePaymentStatus',

  // ── Annual Payment ────────────────────────────────────────────────────────
  /** [C] Annual payment history page (applicant) */
  VIEW_ANNUAL_PAYMENT_HISTORY: '/id/viewAnnualPaymentHistory/{applicantId}',
  /** [A] Annual payment history list */
  FETCH_ANNUAL_PAYMENT_HISTORY: '/id/fetchAnnualPaymentHistory/{applicantId}',
  /** [C] Single payment detail page */
  VIEW_ANNUAL_PAYMENT_DETAILS: '/viewAnnualPaymentDetails/{paymentId}',
  /** [A] Single payment detail bean */
  FETCH_ANNUAL_PAYMENT_DETAILS: '/fetchAnnualPaymentDetails/{paymentId}',
  /** [C] Review annual payment before submit */
  REVIEW_ANNUAL_PAYMENT: '/id/reviewAnnualPayment/{paymentId}',
  /** [E] Submit annual payment to Cyber Treasury */
  SUBMIT_ANNUAL_PAYMENT: '/applicantAnnualPayment',
  /** [C] Review appeal payment */
  REVIEW_APPEAL_PAYMENT: '/id/reviewAppealPayment/{appealId}',

  // ── eSign ─────────────────────────────────────────────────────────────────
  /** [C] eSign pre-signature page */
  ESIGN_APPLICATION_DETAIL: '/eSignApplicationDetail/{applicantId}/{vacantLandId}',
  /** [E] Generate LOI PDF and initiate NeSL eSign transaction */
  GENERATE_LOI_PDF: '/generateLOIPDF',
  /** [E] Receive eSign response for Possession Letter */
  SIGN_PDF_POSSESSION: '/signPDFPossession',
  /** [E] Receive eSign response for LOC */
  SIGN_PDF_LOC: '/signPDFLoc',
  /** [E] Receive eSign response for Application Form */
  SIGN_PDF_APPLICATION_FORM: '/signPDFAPPLICATIONFORM',
  /** [C] View/apply signed possession letter */
  UPDATE_POSSESSION_LETTER: '/updatePossessionLetter/{applicantId}/{vacantLandId}',

  // ── Conditional Compliance (ZO) ───────────────────────────────────────────
  /** [C] Enter ZO conditional compliance form */
  ENTER_CONDITIONAL_COMPLIANCE_ZO: '/id/viewEnterConditionalComplianceZO/{hearingId}',
  /** [A] Submit ZO compliance */
  SUBMIT_CONDITIONAL_COMPLIANCE_ZO: '/enterConditionalComplianceZO',
  /** [C] View ZO conditional decision */
  VIEW_CONDITIONAL_DECISION_ZO: '/viewConditionalDecisionZO/{hearingId}/{decisionId}',

  // ── Conditional Compliance (IC) ───────────────────────────────────────────
  /** [C] Enter IC conditional compliance form */
  ENTER_CONDITIONAL_COMPLIANCE_IC: '/id/viewEnterConditionalComplianceIC/{hearingId}',
  /** [A] Submit IC compliance */
  SUBMIT_CONDITIONAL_COMPLIANCE_IC: '/enterConditionalComplianceIC',
  /** [C] View IC conditional decision */
  VIEW_CONDITIONAL_DECISION_IC: '/viewConditionalDecisionIC/{hearingId}/{decisionId}',

  // ── Appeal & Notice ───────────────────────────────────────────────────────
  /** [A] Notice list JSON */
  FETCH_APPLICATION_NOTICE_LIST: '/fetchApplicationNoticeList',
  /** [A] Notice detail */
  LOAD_NOTICE_DETAILS: '/id/loadNoticeDetails/{noticeId}',
  /** [A] Appeal detail bean */
  LOAD_APPEAL_DETAILS: '/id/loadAppealDetails/{appealId}',
  /** [A] Hearing list for an appeal */
  LOAD_APPEAL_HEARINGS: '/id/loadAppealHearings/{appealId}',
  /** [A] Single hearing detail */
  LOAD_APPEAL_HEARING_DETAILS: '/loadAppealHearingDetails/{appealHearingId}',
  /** [D] Download notice attachment */
  DOWNLOAD_NOTICE_DOCUMENT: '/downloadNoticeDocument/{documentId}',
  /** [A] Enter compliance reply */
  ENTER_COMPLIANCE: '/enterCompliance',
  /** [A] File a new appeal */
  ADD_APPEAL: '/addAppeal',
  /** [D] Download hold/release order document */
  DOWNLOAD_HOLD_RELEASE_DOC: '/downloadHoldReleaseDoc/{vacantLandId}',

  // ── Misc ──────────────────────────────────────────────────────────────────
  /** [A] Hearing details JSON */
  FETCH_HEARING_DETAILS: '/id/fetchHearingDetails/{hearingId}',
  /** [A] UAM/Aadhaar verification */
  FETCH_UAM_DETAILS: '/fetchuamdetails/{uamNumber}/{aadhaarNumber}',
  /** [A] User industrial area detail */
  FETCH_USER_INDUSTRIAL_DETAIL: '/fetchUserIndustrialDetail/{username}',
  /** [A] Purpose list master */
  FETCH_PURPOSE_LIST: '/fetchPurposeList',
  /** [A] Rates by collector rate + area */
  FETCH_RATES_BY_COLLECTOR_RATE_ID: '/fetchRatesByCollectorRateIdAndAreaLeaseRent',
  /** [A] Application history JSON */
  FETCH_HISTORY: '/id/fetchHistory',
  /** [A] Query from DTIC */
  FETCH_QUERY_BY_DTIC: '/id/fetchquerybydtic',
  /** [D] Upload query response document */
  UPLOAD_QUERY_DOC: '/uploadQueryDoc',
  /** [A] Submit query reply text */
  SUBMIT_QUERY_REPLY: '/id/submitQueryReply',
}

// ─── ID Module — IDZonalController  (/zonal/*) ───────────────────────────────

export const ID_ZONAL = {
  /** [B] ZO appeal list page */
  APPEAL_LIST: '/zonal/appealList',
  /** [A] Appeal list JSON */
  FETCH_APPEAL_LIST: '/zonal/fetchAppealList',
  /** [A] Add new hearing */
  ADD_APPEAL_HEARING: '/zonal/addAppealHearing',
  /** [A] Update existing hearing */
  UPDATE_APPEAL_HEARING_POST: '/zonal/updateAppealHearing',
  /** [A] ZO application list JSON */
  FETCH_APPLICATION_LIST: '/zonal/fetchApplicationList',
  /** [A] Save ZO conditional compliance decision */
  SAVE_CONDITIONAL_COMPLIANCE_ZO: '/zonal/saveConditionalComplianceStatusZO',
  /** [A] Save IC conditional compliance decision */
  SAVE_CONDITIONAL_COMPLIANCE_IC: '/zonal/saveConditionalComplianceStatusIC',
}

// ─── ID Module — IDLandingPageController  (/idLanding/*) — Public ─────────────

export const ID_LANDING = {
  /** [B] Public vacant land listing page */
  VACANT_LAND_LIST_LANDING: '/idLanding/vacantLandListLanding',
  /** [A] All land allotment list JSON (public) */
  FETCH_ALL_LAND_ALLOTMENT_LIST: '/idLanding/fetchAllLandAllotmentList',
  /** [B] Undeveloped land public listing */
  VACANT_LAND_LIST_LANDING_UL: '/idLanding/vacantLandListLandingUL',
  /** [B] Advanced search page (public) */
  ADVANCE_SEARCH_LANDING: '/idLanding/advanceSearchLanding',
  /** [A] Vacant land detail bean (public) */
  FETCH_VACANT_LAND_DETAIL: '/idLanding/fetchvacantlanddetail/{vacantLandId}',
  /** [A] KML map JSON data for a land parcel */
  FETCH_VACANT_LAND_KML_MAP: '/idLanding/fetchvacantlandKmlMap/{vacantLandId}',
  /** [D] Download KML file */
  VACANT_LAND_KML_FILE: '/idLanding/vacantLandKmlFile/{vacantLandId}',
  /** [D] Download vacant land map */
  DOWNLOAD_VACANT_LAND_MAP: '/idLanding/downloadVacantLandMap/{vacantLandId}',
  /** [D] Download IA map */
  DOWNLOAD_INDUSTRIAL_AREA_MAP: '/idLanding/downloadIndustrialAreaMap/{locationId}',
  /** [D] Download UL Google map */
  DOWNLOAD_VACANT_LAND_GOOGLE_MAP_UL: '/idLanding/downloadVacantLandGoogleMapUL/{vacantLandId}',
  /** [D] Download postpone order document */
  DOWNLOAD_POSTPONED_DOC: '/idLanding/downloadPostponedDoc',
  /** [D] Download hold/release document */
  DOWNLOAD_HOLD_RELEASE_DOCUMENT: '/idLanding/downloadHoldReleaseDocument/{vacantLandId}',
  /** [A] Applied applicants count (public) */
  GET_APPLIED_APPLICANTS_COUNT: '/idLanding/getAppliedApplicantsCount',
  /** [A] All industrial areas (public) */
  FETCH_INDUSTRIAL_AREAS: '/idLanding/fetchIndustrialAreas',
  /** [A] Collector rate master (public) */
  FETCH_COLLECTOR_RATE_LIST: '/idLanding/fetchCollectorRateList',
  /** [D] Seeking land allotment report */
  SEEKING_LAND_ALLOTMENT_REPORT: '/idLanding/seekingLandAllotmentReport',
  /** [D] Seeking assistance report */
  SEEKING_ASSISTANCE_REPORT: '/idLanding/seekingAssistanceReport',
  /** [C] Unified portal application status */
  UNIFIED_PORTAL_APPLICATION_STATUS: '/idLanding/unifiedPortal/applicationStatus',
}

// ─── FA Module — Placeholder ──────────────────────────────────────────────────
// TODO: populate during FA module migration

export const FA = {
  // placeholder
}

// ─── MSME Module — Placeholder ────────────────────────────────────────────────
// TODO: populate during MSME module migration

export const MSME = {
  // placeholder
}

// ─── Self-Employment Module — Placeholder ─────────────────────────────────────
// TODO: populate during selfemployment module migration

export const SELF_EMPLOYMENT = {
  // placeholder
}

// ─── Legal Module — Placeholder ───────────────────────────────────────────────
// TODO: populate during legal module migration

export const LEGAL = {
  // placeholder
}

// ─── MSEFC Module — Placeholder ───────────────────────────────────────────────
// TODO: populate during msefc module migration

export const MSEFC = {
  // placeholder
}

// ─── Textile Module — Placeholder ─────────────────────────────────────────────
// TODO: populate during textile module migration

export const TEXTILE = {
  // placeholder
}

// ─── Account / Audit — Placeholder ───────────────────────────────────────────
// TODO: populate during account/audit module migration

export const ACCOUNT = {
  // placeholder
}

export const AUDIT = {
  // placeholder
}

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Replaces {placeholder} tokens in an endpoint URL with actual values.
 *
 * @example
 *   fillPath(ID_SECTION.VIEW_VACANT_LAND, { vacantLandId: 42 })
 *   // → '/idSection/viewVancatLand/42'
 *
 * @param {string} template  - endpoint constant with {key} placeholders
 * @param {Record<string, string|number>} params
 * @returns {string}
 */
export function fillPath(template, params = {}) {
  return Object.entries(params).reduce(
    (url, [key, value]) => url.replace(`{${key}}`, String(value)),
    template,
  )
}
