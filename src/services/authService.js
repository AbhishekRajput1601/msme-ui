/**
 * authService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Authentication service interacting with Spring Security session-based auth.
 *
 * Backend Specifications:
 *  • Login processing URL : /mpmsme/j_spring_security_check
 *  • Username parameter   : j_username
 *  • Password parameter   : j_password
 *  • Logout endpoint      : /mpmsme/logout
 *  • Current user session : /mpmsme/api/session/current-user
 *  • Captcha endpoint     : /mpmsme/website/captcha
 *
 * SECURITY RULE:
 *  • Never store session/user secrets or tokens in localStorage / sessionStorage.
 *  • Rely entirely on the backend HttpOnly JSESSIONID cookie sent automatically
 *    via credentials: 'include' (withCredentials: true in httpClient.js).
 */

import { get, postForm } from '../api/httpClient'
import { AUTH } from '../api/endpoints'

/**
 * Default unauthenticated session object.
 */
export const UNAUTHENTICATED_SESSION = Object.freeze({
  authenticated: false,
  username: null,
  displayName: null,
  roles: [],
  locale: 'en_US',
  firstPasswordChangeRequired: false,
})

/**
 * Computes SHA-256 hash in hex format for password submission.
 * Legacy Spring Security backend expects sha256(password) from jsSHA.
 */
async function sha256Hex(message) {
  try {
    const msgBuffer = new TextEncoder().encode(message)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    throw new Error('Secure password processing is unavailable. Open the site using HTTPS or localhost.')
  }
}

/**
 * Generates a fresh captcha image URL with a cache-busting timestamp.
 *
 * @returns {string} Captcha image URL
 */
export function getCaptchaUrl() {
  return `${AUTH.CAPTCHA}?_t=${Date.now()}`
}

/**
 * Maps a Spring Security redirect path to the equivalent ROLE_ string.
 * Covers every role in MPIndustryAuthenticationSuccessHandler.
 */
const REDIRECT_PATH_TO_ROLE = {
  '/applicant':          'ROLE_APPLICANT',
  '/adminSection':       'ROLE_ADMIN',
  '/dtic':               'ROLE_DTIC',
  '/dtfc':               'ROLE_DTFC',
  '/bank':               'ROLE_BANK',
  '/zonal':              'ROLE_ZONAL',
  '/section':            'ROLE_SECTION',
  '/legalSection':       'ROLE_LEGAL',
  '/legalOIC':           'ROLE_LEGAL_OIC',
  '/budgetPlanning':     'ROLE_BUDGET_PLANNING',
  '/cmcsHo':             'ROLE_CM_CS_HO',
  '/cmcs':               'ROLE_CM_CS',
  '/employee':           'ROLE_EMPLOYEE',
  '/msefc':              'ROLE_MSEFC',
  '/textile':            'ROLE_TEXTILE',
  '/idSection':          'ROLE_ID',
  '/mbfc':               'ROLE_MBFC',
  '/msme':               'ROLE_MSME',
  '/grievanceApplicant': 'ROLE_GRIEVANCE_APPLICANT',
  '/committeMember':     'ROLE_MSME_AWARD_COMMITEE_MEMBER',
  '/zonaloperator':      'ROLE_ZONAL_OPERATOR',
  '/startupCenter':      'ROLE_STARTUP_CENTER',
  '/fa':                 'ROLE_FA',
  '/collector':          'ROLE_COLLECTOR',
  '/ldm':                'ROLE_LDM',
  '/secretary':          'ROLE_SECRETARY',
  '/coordinationSection':  'ROLE_COORDINATION',
  '/coordinationOfficer':  'ROLE_COORDINATION_OFFICER',
  '/coordinationDD':       'ROLE_COORDINATION_DD',
  '/coordinationJD':       'ROLE_COORDINATION_JD',
  '/icOffice':             'ROLE_IC_OFFICE',
  '/account':              'ROLE_ACCOUNT',
  '/auditSection':         'ROLE_AUDIT',
  '/auditOfficer':         'ROLE_AUDIT_OFFICER',
}

/**
 * Infers Spring Security roles from the Axios response to the login POST.
 *
 * Axios follows the Spring Security redirect automatically. The final URL
 * (available in response.request.responseURL) is the legacy role-specific
 * home page — e.g. /idSection/home, /dtic/home, /applicant/home — from
 * which we can derive the user's role.
 *
 * Falls back to loginType ('APPLICANT' → ROLE_APPLICANT) if the URL is
 * not available or doesn't match a known path.
 *
 * @param {Object|null} response - Axios response from postForm(AUTH.LOGIN_PROCESSING)
 * @param {string} loginType     - 'APPLICANT' | 'DEPARTMENT'
 * @returns {string[]} Array with a single ROLE_ string
 */
function inferRolesFromLoginResponse(response, loginType) {
  // Try to read the final redirected URL from the Axios response
  const finalUrl =
    response?.request?.responseURL ||   // XMLHttpRequest (browser)
    response?.config?.url ||            // fallback
    ''

  if (finalUrl) {
    // Extract just the pathname from the full URL
    let pathname = finalUrl
    try {
      pathname = new URL(finalUrl).pathname
    } catch { /* finalUrl might already be a path */ }

    // Strip /mpmsme context prefix if present
    if (pathname.startsWith('/mpmsme')) {
      pathname = pathname.substring('/mpmsme'.length)
    }

    // Match against known role-prefixed paths (longest prefix first)
    const sortedPaths = Object.keys(REDIRECT_PATH_TO_ROLE).sort(
      (a, b) => b.length - a.length,
    )
    for (const prefix of sortedPaths) {
      if (pathname.startsWith(prefix)) {
        return [REDIRECT_PATH_TO_ROLE[prefix]]
      }
    }
  }

  // Fallback: derive from the loginType parameter the user chose on the form
  if (loginType === 'DEPARTMENT') {
    // Cannot determine exact department role without the backend endpoint;
    // return a safe generic department role — the user can still navigate
    // and the backend enforces real authorization on every API call.
    return ['ROLE_DTIC']
  }

  return ['ROLE_APPLICANT']
}

/**
 * Authenticates against the Spring Security login endpoint.
 *
 * Spring Security's UsernamePasswordAuthenticationFilter expects
 * application/x-www-form-urlencoded POST data.
 *
 * @param {Object} credentials
 * @param {string} credentials.username - User ID / Email
 * @param {string} credentials.password - Plain password
 * @param {string} [credentials.captchaText=''] - Captcha answer
 * @param {string} [credentials.loginType='APPLICANT'] - 'APPLICANT' | 'DEPARTMENT'
 * @param {string} [credentials.language='en_US'] - 'en_US' | 'hi_IN'
 * @param {string} [credentials.csrfPreventionSalt=''] - Optional CSRF prevention salt
 * @returns {Promise<Object>} The authenticated user profile or throws error
 */
export async function login({
  username,
  password,
  captchaText = '',
  loginType = 'APPLICANT',
  language = 'en_US',
  csrfPreventionSalt = '',
}) {
  if (!username || !password) {
    throw new Error('Username and password are required.')
  }

  // Legacy Spring Security / Angular hashes password with SHA-256 HEX before submission
  const hashedPassword = await sha256Hex(password)

  const formData = {
    j_username: username.trim(),
    j_password: hashedPassword,
    loginType,
    language,
  }

  if (captchaText) {
    formData.captchaText = captchaText.trim()
  }

  if (csrfPreventionSalt) {
    formData.csrfPreventionSalt = csrfPreventionSalt
  }

  // Submit credentials to Spring Security login processing URL.
  // Spring Security will redirect to /{role}/home on success, or to
  // /website/login?error on failure (the interceptor converts the latter to a throw).
  const loginResponse = await postForm(AUTH.LOGIN_PROCESSING, formData)

  // Fetch verified user session if GET /api/session/current-user is available.
  // If the endpoint returns 404 or is not yet deployed, fetchCurrentUser()
  // gracefully returns UNAUTHENTICATED_SESSION instead of throwing.
  const user = await fetchCurrentUser()
  if (user && user.authenticated) {
    return user
  }

  // ── Synthesized session fallback ──────────────────────────────────────────
  // The Spring Security POST above succeeded (no throw / no redirect-to-error),
  // meaning credentials were accepted. Derive a role so ProtectedRoute can grant
  // access to the correct area of the app.
  console.warn(
    '[authService] /api/session/current-user is unavailable. ' +
    'Synthesizing session from accepted Spring Security login.',
  )

  // Infer role from the final URL Axios followed after the Spring Security redirect
  // (e.g. /idSection/home → ROLE_ID, /dtic/home → ROLE_DTIC, /applicant/home → ROLE_APPLICANT).
  const inferredRoles = inferRolesFromLoginResponse(loginResponse, loginType)

  return {
    authenticated: true,
    username: username.trim(),
    displayName: username.trim(),
    roles: inferredRoles,
    locale: language,
    firstPasswordChangeRequired: false,
  }
}

/**
 * Logs out the current session on the Spring Boot backend.
 * Invalidates the HTTP session and clears JSESSIONID cookie.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await get(AUTH.LOGOUT)
  } catch (err) {
    // Spring Security might redirect on logout or respond with 302/200;
    // failure to reach endpoint still means client should clear local state.
    console.warn('Logout request completed with non-2xx status:', err.message)
  }
}

/**
 * Fetches the authenticated user profile and roles from the backend session.
 *
 * Calls GET /mpmsme/api/session/current-user.
 * If unauthenticated or if the endpoint returns 401/404, gracefully returns
 * the UNAUTHENTICATED_SESSION object.
 *
 * @returns {Promise<{
 *   authenticated: boolean,
 *   username: string|null,
 *   displayName: string|null,
 *   roles: string[],
 *   locale: string,
 *   firstPasswordChangeRequired: boolean
 * }>}
 */
export async function fetchCurrentUser() {
  try {
    const data = await get(AUTH.CURRENT_USER)

    if (data && typeof data === 'object') {
      return {
        authenticated: data.authenticated === true,
        username: data.username || null,
        displayName: data.displayName || data.username || null,
        roles: Array.isArray(data.roles) ? data.roles : [],
        locale: data.locale || 'en_US',
        firstPasswordChangeRequired: Boolean(data.firstPasswordChangeRequired),
      }
    }

    return UNAUTHENTICATED_SESSION
  } catch (error) {
    // 401, 404 (endpoint not yet deployed), or network error: return clean unauthenticated state
    return UNAUTHENTICATED_SESSION
  }
}

export default {
  login,
  logout,
  fetchCurrentUser,
  getCaptchaUrl,
  UNAUTHENTICATED_SESSION,
}
