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

import httpClient, { get, postForm } from '../api/httpClient'
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
  // Images do not inherit Axios's baseURL. Use the login request's context
  // so path-scoped session cookies accompany both captcha and login requests.
  return httpClient.getUri({ url: AUTH.CAPTCHA, params: { _t: Date.now() } })
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
  await postForm(AUTH.LOGIN_PROCESSING, formData, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    skipSessionRedirect: true,
  })
  const user = await fetchCurrentUser()
  if (!user.authenticated || !user.roles.length) {
    throw new Error('Login could not be verified. Please reload and try again.')
  }
  return user
}

/**
 * Logs out the current session on the Spring Boot backend.
 * Invalidates the HTTP session and clears JSESSIONID cookie.
 *
 * @returns {Promise<void>}
 */
export async function logout() {
  await httpClient.post(AUTH.LOGOUT, null, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    skipSessionRedirect: true,
  })
}

// A bootstrap request establishes the session before the captcha image loads.
export async function prepareLogin() {
  const data = await get('/website/auth-bootstrap', {}, { skipSessionRedirect: true })
  if (!data?.csrfPreventionSalt) throw new Error('Unable to initialize login. Please retry.')
  return data
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
export async function fetchCurrentUser({ timeout = 60_000 } = {}) {
  try {
    const data = await get(AUTH.CURRENT_USER, {}, { skipSessionRedirect: true, timeout })

    if (data && typeof data === 'object' && typeof data.authenticated === 'boolean') {
      return {
        authenticated: data.authenticated === true,
        username: data.username || null,
        displayName: data.displayName || data.username || null,
        roles: Array.isArray(data.roles) ? data.roles.filter(role => typeof role === 'string') : [],
        locale: data.locale || 'en_US',
        firstPasswordChangeRequired: Boolean(data.firstPasswordChangeRequired),
        passwordChangeRequired: Boolean(data.passwordChangeRequired),
      }
    }

    throw new Error('The backend did not return a valid session response.')
  } catch (error) {
    if (error?.response?.status === 401) return UNAUTHENTICATED_SESSION
    throw error
  }
}

export default {
  login,
  logout,
  fetchCurrentUser,
  getCaptchaUrl,
  UNAUTHENTICATED_SESSION,
}
