/**
 * roleRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Complete role-to-dashboard mappings and legacy URL resolution for MPIndustry.
 *
 * Covers all roles defined in Spring Security's MPIndustryAuthenticationSuccessHandler:
 * APPLICANT, DTIC, DTFC, BANK, ZONAL, SECTION, LEGAL, LEGAL_OIC, BUDGET_PLANNING,
 * CM_CS, MSEFC, TEXTILE, COORDINATION, COORDINATION_OFFICER, COORDINATION_DD,
 * COORDINATION_JD, IC_OFFICE, ACCOUNT, AUDIT, ADMIN, FA, COLLECTOR, LDM, SECRETARY.
 */

export const ROLE_DASHBOARDS = Object.freeze({
  // Citizen Applicant
  ROLE_APPLICANT: '/applicant/dashboard',
  APPLICANT: '/applicant/dashboard',

  // Administration
  ROLE_ADMIN: '/admin/dashboard',
  ADMIN: '/admin/dashboard',

  // Department Workflows
  ROLE_DTIC: '/department/dtic/dashboard',
  DTIC: '/department/dtic/dashboard',

  ROLE_DTFC: '/department/dtfc/dashboard',
  DTFC: '/department/dtfc/dashboard',

  ROLE_BANK: '/department/bank/dashboard',
  BANK: '/department/bank/dashboard',

  ROLE_ZONAL: '/department/zonal/dashboard',
  ZONAL: '/department/zonal/dashboard',

  ROLE_SECTION: '/department/section/dashboard',
  SECTION: '/department/section/dashboard',

  ROLE_LEGAL: '/department/legal/dashboard',
  LEGAL: '/department/legal/dashboard',
  ROLE_LEGAL_SECTION: '/department/legal/dashboard',
  LEGAL_SECTION: '/department/legal/dashboard',

  ROLE_LEGAL_OIC: '/department/legal-oic/dashboard',
  LEGAL_OIC: '/department/legal-oic/dashboard',

  ROLE_BUDGET_PLANNING: '/department/budget-planning/dashboard',
  BUDGET_PLANNING: '/department/budget-planning/dashboard',

  ROLE_CM_CS: '/department/cmcs/dashboard',
  CM_CS: '/department/cmcs/dashboard',

  ROLE_CM_CS_HO: '/department/cmcs-ho/dashboard',
  CM_CS_HO: '/department/cmcs-ho/dashboard',

  ROLE_EMPLOYEE: '/department/employee/dashboard',
  EMPLOYEE: '/department/employee/dashboard',

  ROLE_MSEFC: '/department/msefc/dashboard',
  MSEFC: '/department/msefc/dashboard',

  ROLE_TEXTILE: '/department/textile/dashboard',
  TEXTILE: '/department/textile/dashboard',

  ROLE_COORDINATION: '/department/coordination/dashboard',
  COORDINATION: '/department/coordination/dashboard',
  ROLE_COORDINATION_SECTION: '/department/coordination/dashboard',
  COORDINATION_SECTION: '/department/coordination/dashboard',

  ROLE_COORDINATION_OFFICER: '/department/coordination-officer/dashboard',
  COORDINATION_OFFICER: '/department/coordination-officer/dashboard',

  ROLE_COORDINATION_DD: '/department/coordination-dd/dashboard',
  COORDINATION_DD: '/department/coordination-dd/dashboard',

  ROLE_COORDINATION_JD: '/department/coordination-jd/dashboard',
  COORDINATION_JD: '/department/coordination-jd/dashboard',

  ROLE_IC_OFFICE: '/department/ic-office/dashboard',
  IC_OFFICE: '/department/ic-office/dashboard',

  ROLE_ACCOUNT: '/department/account/dashboard',
  ACCOUNT: '/department/account/dashboard',

  ROLE_AUDIT: '/department/audit/dashboard',
  AUDIT: '/department/audit/dashboard',
  ROLE_AUDIT_SECTION: '/department/audit/dashboard',
  AUDIT_SECTION: '/department/audit/dashboard',

  ROLE_AUDIT_OFFICER: '/department/audit-officer/dashboard',
  AUDIT_OFFICER: '/department/audit-officer/dashboard',

  ROLE_ID: '/department/id/dashboard',
  ID: '/department/id/dashboard',
  ROLE_ID_SECTION: '/department/id/dashboard',
  ID_SECTION: '/department/id/dashboard',

  ROLE_MBFC: '/department/mbfc/dashboard',
  MBFC: '/department/mbfc/dashboard',

  ROLE_MSME: '/department/msme/dashboard',
  MSME: '/department/msme/dashboard',

  ROLE_GRIEVANCE_APPLICANT: '/applicant/grievances',
  GRIEVANCE_APPLICANT: '/applicant/grievances',

  ROLE_MSME_AWARD_COMMITEE_MEMBER: '/department/msme-awards/dashboard',
  MSME_AWARD_COMMITEE_MEMBER: '/department/msme-awards/dashboard',

  ROLE_ZONAL_OPERATOR: '/department/zonal-operator/dashboard',
  ZONAL_OPERATOR: '/department/zonal-operator/dashboard',

  ROLE_STARTUP_CENTER: '/department/startup-center/dashboard',
  STARTUP_CENTER: '/department/startup-center/dashboard',

  ROLE_FA: '/department/fa/dashboard',
  FA: '/department/fa/dashboard',

  // FA Batch Workflow Roles
  ROLE_COLLECTOR: '/department/collector/dashboard',
  COLLECTOR: '/department/collector/dashboard',

  ROLE_LDM: '/department/ldm/dashboard',
  LDM: '/department/ldm/dashboard',

  ROLE_SECRETARY: '/department/secretary/dashboard',
  SECRETARY: '/department/secretary/dashboard',
})

/**
 * Priority order for resolving multiple assigned roles.
 */
const ROLE_PRIORITY = [
  'ROLE_ADMIN',
  'ROLE_SECRETARY',
  'ROLE_COLLECTOR',
  'ROLE_ID',
  'ROLE_FA',
  'ROLE_DTIC',
  'ROLE_DTFC',
  'ROLE_ZONAL',
  'ROLE_LDM',
  'ROLE_COORDINATION_JD',
  'ROLE_COORDINATION_DD',
  'ROLE_COORDINATION_OFFICER',
  'ROLE_COORDINATION',
  'ROLE_AUDIT',
  'ROLE_ACCOUNT',
  'ROLE_MSEFC',
  'ROLE_TEXTILE',
  'ROLE_LEGAL',
  'ROLE_LEGAL_OIC',
  'ROLE_BUDGET_PLANNING',
  'ROLE_CM_CS',
  'ROLE_IC_OFFICE',
  'ROLE_APPLICANT',
]

/**
 * Returns the default dashboard path for a given role string.
 *
 * @param {string} role
 * @returns {string} Target dashboard URL
 */
export function getDashboardForRole(role) {
  if (!role) return '/applicant/dashboard'
  const norm = role.toUpperCase()
  const withPrefix = norm.startsWith('ROLE_') ? norm : `ROLE_${norm}`
  return ROLE_DASHBOARDS[withPrefix] || ROLE_DASHBOARDS[norm] || '/applicant/dashboard'
}

/**
 * Returns the highest priority dashboard for a user with multiple roles.
 *
 * @param {string[]} roles
 * @returns {string} Target dashboard URL
 */
export function getDefaultRouteForRoles(roles = []) {
  if (!Array.isArray(roles) || roles.length === 0) {
    return '/applicant/dashboard'
  }

  // Find highest priority role present
  for (const pRole of ROLE_PRIORITY) {
    const withoutPrefix = pRole.replace('ROLE_', '')
    if (
      roles.some(
        (r) =>
          r.toUpperCase() === pRole ||
          r.toUpperCase() === withoutPrefix,
      )
    ) {
      return getDashboardForRole(pRole)
    }
  }

  // Fallback to first role
  return getDashboardForRole(roles[0])
}

/**
 * Derives a default role identifier from a legacy Spring Security redirect path.
 * E.g. '/applicant/home' -> 'ROLE_APPLICANT', '/dtic/home' -> 'ROLE_DTIC'
 */
export function getRoleFromRedirectPath(path = '') {
  if (!path) return 'ROLE_APPLICANT'
  const clean = path.replace(/^\/mpmsme/, '').replace(/\/+$/, '')
  for (const [legacyPath, targetRoute] of Object.entries(LEGACY_PATH_MAP)) {
    if (clean.startsWith(legacyPath)) {
      if (targetRoute.startsWith('/applicant')) return 'ROLE_APPLICANT'
      if (targetRoute.startsWith('/admin')) return 'ROLE_ADMIN'
      if (targetRoute.includes('/dtic')) return 'ROLE_DTIC'
      if (targetRoute.includes('/dtfc')) return 'ROLE_DTFC'
      if (targetRoute.includes('/bank')) return 'ROLE_BANK'
      if (targetRoute.includes('/zonal')) return 'ROLE_ZONAL'
      if (targetRoute.includes('/section')) return 'ROLE_SECTION'
      if (targetRoute.includes('/legal-oic')) return 'ROLE_LEGAL_OIC'
      if (targetRoute.includes('/legal')) return 'ROLE_LEGAL'
      if (targetRoute.includes('/budget-planning')) return 'ROLE_BUDGET_PLANNING'
      if (targetRoute.includes('/cmcs-ho')) return 'ROLE_CM_CS_HO'
      if (targetRoute.includes('/cmcs')) return 'ROLE_CM_CS'
      if (targetRoute.includes('/employee')) return 'ROLE_EMPLOYEE'
      if (targetRoute.includes('/msefc')) return 'ROLE_MSEFC'
      if (targetRoute.includes('/textile')) return 'ROLE_TEXTILE'
      if (targetRoute.includes('/id')) return 'ROLE_ID'
      if (targetRoute.includes('/fa')) return 'ROLE_FA'
      if (targetRoute.includes('/collector')) return 'ROLE_COLLECTOR'
      if (targetRoute.includes('/ldm')) return 'ROLE_LDM'
      if (targetRoute.includes('/secretary')) return 'ROLE_SECRETARY'
      return 'ROLE_DTIC'
    }
  }
  return 'ROLE_APPLICANT'
}

/**
 * Maps legacy Spring Security redirect base URLs to new React routes.
 */
export const LEGACY_PATH_MAP = Object.freeze({
  '/applicant/home': '/applicant',
  '/applicant/home2': '/applicant',
  '/adminSection/home': '/admin',
  '/adminSection/home2': '/admin',
  '/dtic/home': '/department/dtic',
  '/dtic/home2': '/department/dtic',
  '/dtfc/home': '/department/dtfc',
  '/dtfc/home2': '/department/dtfc',
  '/bank/home': '/department/bank',
  '/bank/home2': '/department/bank',
  '/zonal/home': '/department/zonal',
  '/zonal/home2': '/department/zonal',
  '/section/home': '/department/section',
  '/section/home2': '/department/section',
  '/legalSection/home': '/department/legal',
  '/legalSection/home2': '/department/legal',
  '/legalOIC/home': '/department/legal-oic',
  '/legalOIC/home2': '/department/legal-oic',
  '/budgetPlanning/home': '/department/budget-planning',
  '/budgetPlanning/home2': '/department/budget-planning',
  '/cmcs/cmcshome': '/department/cmcs',
  '/cmcs/cmcshome2': '/department/cmcs',
  '/cmcsHo/cmcshome2': '/department/cmcs-ho',
  '/employee/home': '/department/employee',
  '/employee/home2': '/department/employee',
  '/msefc/home': '/department/msefc',
  '/msefc/home2': '/department/msefc',
  '/textile/home': '/department/textile',
  '/textile/home2': '/department/textile',
  '/coordinationSection/home': '/department/coordination',
  '/coordinationSection/home2': '/department/coordination',
  '/icOffice/home': '/department/ic-office',
  '/icOffice/home2': '/department/ic-office',
  '/coordinationOfficer/home': '/department/coordination-officer',
  '/coordinationOfficer/home2': '/department/coordination-officer',
  '/coordinationDD/home': '/department/coordination-dd',
  '/coordinationDD/home2': '/department/coordination-dd',
  '/coordinationJD/home': '/department/coordination-jd',
  '/coordinationJD/home2': '/department/coordination-jd',
  '/auditOfficer/home': '/department/audit-officer',
  '/auditOfficer/home2': '/department/audit-officer',
  '/account/home': '/department/account',
  '/account/home2': '/department/account',
  '/auditSection/home': '/department/audit',
  '/auditSection/home2': '/department/audit',
  '/idSection/home': '/department/id',
  '/idSection/home2': '/department/id',
  '/mbfc/home': '/department/mbfc',
  '/mbfc/home2': '/department/mbfc',
  '/msme/home': '/department/msme',
  '/grievanceApplicant/home': '/applicant/grievances',
  '/grievanceApplicant/home2': '/applicant/grievances',
  '/committeMember/home': '/department/msme-awards',
  '/committeMember/home2': '/department/msme-awards',
  '/zonaloperator/home': '/department/zonal-operator',
  '/startupCenter/home': '/department/startup-center',
  '/fa/home': '/department/fa',
  '/fa/home2': '/department/fa',
  '/collector/home': '/department/collector',
  '/ldm/home': '/department/ldm',
  '/secretary/home': '/department/secretary',
})

/**
 * Specific hash fragment translation for common Angular routes.
 */
export const LEGACY_HASH_TRANSLATIONS = Object.freeze({
  '#/dashboard': '/dashboard',
  '#/firstPasswordChange': '/first-password-change',
  '#/changepassword': '/change-password',
  '#/updateprofile': '/profile',
  '#/updateprofileapplicant': '/profile',
  '#/updateindustryprofileapplicant': '/industry-profile',
  '#/id/landAllotment': '/land-allotment/explore',
  '#/id/landAllotmentUN': '/land-allotment/explore',
  '#/id/landApplications': '/land-allotment',
  '#/id/vacantLands': '/land-allotment/explore',
  '#/id/annualPayments': '/land-allotment/annual',
  '#/id/noticeAppealList': '/land-allotment/notices',
  '#/fa/newapplicantform': '/financial-assistance/new',
  '#/fa/infradevelopmetform': '/financial-assistance/infra-development',
  '#/fa/newstartupfundAssistanceform': '/financial-assistance/startup-fund',
  '#/fa/incubatorAssistanceApplicationForm': '/financial-assistance/incubator',
})

/**
 * Resolves a legacy Spring Security redirected URL with hash fragment into
 * the corresponding React Router browser URL.
 *
 * Examples:
 *   resolveLegacyHashRoute('/applicant/home', '#/dashboard')
 *     → '/applicant/dashboard'
 *   resolveLegacyHashRoute('/idSection/home', '#/vacantLands')
 *     → '/department/id/vacant-lands'
 *   resolveLegacyHashRoute('/applicant/home2', '#/firstPasswordChange')
 *     → '/applicant/first-password-change'
 *
 * @param {string} pathname - e.g. window.location.pathname
 * @param {string} [hash] - e.g. window.location.hash
 * @returns {string} The modern React Router destination path
 */
export function resolveLegacyHashRoute(pathname, hash = '') {
  // Strip backend context path if present
  let cleanPath = pathname
  if (cleanPath.startsWith('/mpmsme')) {
    cleanPath = cleanPath.substring('/mpmsme'.length)
  }

  // Remove trailing slashes
  cleanPath = cleanPath.replace(/\/+$/, '')

  const baseReactPath = LEGACY_PATH_MAP[cleanPath] || '/applicant'

  // Preserve applicant IDs and opaque parcel tokens from old land bookmarks.
  if (baseReactPath === '/applicant') {
    const landHash = hash.replace(/^#\/?/, '')
    if (/^fa\/(?:newapplicantform|newapplicantsingleform|viewfaapplicantdetailunit|viewfaapplicantdetailunitnew|viewfaschemesdetailsunit|fetchfaschemes|viewfadocumentsuploadunit|viewfaapplicantHistory|viewfaDisbursementUnit|viewfaacceptanceamountdetailunit|queryReplyByApplicant|fetchquerybydtic|infradevelopmetform|addUnitDetailsform)(?:\/|$)/.test(landHash)) {
      return `/applicant/financial-assistance/${landHash.slice(3)}`
    }
    const patterns = [
        [/^id\/(?:viewESignApplicationDetail|eSignApplicationDetail)\/(\d+)\/(.+)$/, ([, id, token]) => `sign/${id}/${token}`],
        [/^id\/editApplyForLandForm\/(\d+)\/(.+)$/, ([, id, token]) => `correct/${id}/${token}`],
        [/^id\/editDocumentsUpload\/(\d+)\/(.+)$/, ([, id, token]) => `correct-documents/${id}/${token}`],
        [/^id\/enterCompliance\/(\d+)$/, ([, id]) => `notices/compliance/${id}`],
        [/^id\/viewCompliance\/(\d+)$/, ([, id]) => `notices/notice/${id}`],
        [/^id\/newAppeal\/(\d+)$/, ([, id]) => `notices/appeal-zo/${id}`],
        [/^id\/newAppealForIC\/(\d+)$/, ([, id]) => `notices/appeal-ic/${id}`],
        [/^id\/viewAppeal\/(\d+)$/, ([, id]) => `notices/view-zo/${id}`],
        [/^id\/viewAppealForIC\/(\d+)$/, ([, id]) => `notices/view-ic/${id}`],
        [/^id\/viewAppealHearing\/(\d+)$/, ([, id]) => `notices/hearing/${id}`],
        [/^id\/enterConditionalCompliance(ZO|IC)\/(\d+)$/, ([, role, id]) => `notices/conditional-${role.toLowerCase()}/${id}`],
        [/^id\/viewConditionalDecision(ZO|IC)\/(\d+)\/(\d+)$/, ([, role, id, decision]) => `notices/decision-${role.toLowerCase()}/${id}/${decision}`],
        [/^id\/reviewAppealPayment\/(\d+)$/, ([, id]) => `appeal-review/${id}`],
        [/^id\/onlinePaymentCheckStatusAll$/, () => 'payment-enquiry'],
        [/^id\/retryOnlinePayment\/(\d+)\/(.+)$/, ([, id, token]) => `payment-retry/${id}/${token}`],
        [/^id\/paymentReceipt\/([^/]+)$/, ([, crn]) => `receipt/${crn}`],
        [/^id\/locPaymentReceipt\/(\d+)\/([^/]+)$/, ([, id, crn]) => `loc-receipt/${id}/${crn}`],
        [/^id\/applicantAnnualPayment\/(\d+)\/(\d+)$/, ([, id, land]) => `annual/${id}/${land}`],
        [/^id\/viewAnnualPaymentHistory\/(\d+)$/, ([, id]) => `annual-history/${id}`],
        [/^viewAnnualPaymentDetails\/(\d+)$/, ([, id]) => `annual-detail/${id}`],
        [/^id\/reviewAnnualPayment\/(\d+)$/, ([, id]) => `annual-review/${id}`],
        [/^id\/idInstructionUL\/0\/(.+)$/, ([, token]) => `instructions-undeveloped/${token}`],
        [/^id\/queryReplyByApplicant\/(\d+)\/(.+)$/, ([, id, token]) => `query/${id}/${token}`],
      [/^id\/idInstruction\/0\/(.+)$/, ([, token]) => `instructions/${token}`],
      [/^id\/viewApplyForLandForm\/(\d+)\/(.+)$/, ([, id, token]) => id === '0' ? `apply/${token}` : `edit/${id}/${token}`],
      [/^id\/viewDocumentsUpload\/(\d+)\/(.+)$/, ([, id, token]) => `documents/${id}/${token}`],
      [/^id\/viewApplicationDetail\/(\d+)\/[^/]+$/, ([, id]) => `detail/${id}`],
      [/^id\/viewIdHistory\/(\d+)$/, ([, id]) => `history/${id}`],
      [/^id\/onlinePayment\/(\d+)\/(.+)$/, ([, id, token]) => `payment/${id}/${token}`],
    ]
    for (const [pattern, destination] of patterns) {
      const match = landHash.match(pattern)
      if (match) return `/applicant/land-allotment/${destination(match)}`
    }
  }

  if (!hash || hash === '#' || hash === '#/') {
    return `${baseReactPath}/dashboard`
  }

  // Check known direct hash translations
  const exactTranslation = LEGACY_HASH_TRANSLATIONS[hash]
  if (exactTranslation) {
    return `${baseReactPath}${exactTranslation}`
  }

  // Strip leading '#' or '#/'
  const subRoute = hash.replace(/^#\/?/, '/')

  return `${baseReactPath}${subRoute}`
}

export default {
  ROLE_DASHBOARDS,
  getDashboardForRole,
  getDefaultRouteForRoles,
  getRoleFromRedirectPath,
  LEGACY_PATH_MAP,
  LEGACY_HASH_TRANSLATIONS,
  resolveLegacyHashRoute,
}
