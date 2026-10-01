/**
 * httpClient.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single centralized Axios instance for the MPIndustry React UI.
 *
 * Features
 * ──────────
 *  • Base URL  : /mpmsme  (proxied to http://localhost:8080 in dev)
 *  • Credentials always included (session cookies, withCredentials: true)
 *  • Request interceptors  : attach JSON Accept header automatically
 *  • Response interceptors : handle 401/403, expired-session HTML detection,
 *                            redirect to /login
 *  • get()      – JSON GET with optional query params
 *  • post()     – JSON POST
 *  • upload()   – multipart/form-data with upload progress callback
 *  • download() – blob response; preserves filename from Content-Disposition
 *  • postForm() – application/x-www-form-urlencoded (legacy login endpoint)
 */

import axios from 'axios'

// ─── Constants ────────────────────────────────────────────────────────────────

const BASE_URL = '/mpmsme'

/**
 * Markers that indicate the backend returned an HTML login page
 * instead of JSON (happens when the session expires and Spring Security
 * redirects internally before sending the response to Axios).
 */
const LOGIN_HTML_MARKERS = [
  'id="loginForm"',
  'name="loginForm"',
  'id="username"',
  'name="j_username"',
  'name="j_password"',
  'j_spring_security_check',
  'action="/mpmsme/login"',
  'action="/mpmsme/j_spring_security_check"',
  'btn-login-applicant',
  '<title>Login</title>',
  '/website/login',
]

/**
 * Markers present in the HTML response when Spring Security rejects credentials.
 * These appear in the login error page returned after a failed j_spring_security_check POST.
 */
const LOGIN_ERROR_MARKERS = [
  'error=error',
  '?error',
  'login?error',
  'Invalid username or password',
  'Bad credentials',
  'Invalid captcha',
  'Captcha mismatch',
  'SPRING_SECURITY_LAST_EXCEPTION',
  'loginError',
  'login-error',
  'alert-danger',
  'alert-error',
]

// ─── Session Expiry Listeners ──────────────────────────────────────────────────

const sessionExpiredListeners = new Set()

/**
 * Register a listener to be called when a session timeout or 401 is detected.
 * Returns an unregister function.
 *
 * @param {(detail: { reason: string, status?: number }) => void} callback
 * @returns {() => void}
 */
export function onSessionExpired(callback) {
  if (typeof callback === 'function') {
    sessionExpiredListeners.add(callback)
  }
  return () => {
    sessionExpiredListeners.delete(callback)
  }
}

/**
 * Notify all registered session-expired listeners and dispatch a DOM event.
 *
 * @param {string} reason
 * @param {number} [status]
 */
function notifySessionExpired(reason = 'Session expired', status = 401) {
  const detail = { reason, status, timestamp: Date.now() }

  // Notify JS subscribers
  sessionExpiredListeners.forEach((fn) => {
    try {
      fn(detail)
    } catch (err) {
      console.error('Error in onSessionExpired listener:', err)
    }
  })

  // Dispatch custom window event for decoupled listeners
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('mpmsme:session-expired', { detail }))
  }
}

// ─── Axios Instance ───────────────────────────────────────────────────────────

const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,           // always send session cookies
  timeout: 60_000,                 // 60-second global timeout
  headers: {
    Accept: 'application/json, text/plain, */*',
  },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true when the response body looks like the Spring Security
 * login HTML page (session expired / not authenticated).
 * Axios may resolve with 200 for a redirected login page, so we must
 * inspect the body content.
 */
function isLoginHtmlResponse(response) {
  const contentType = response?.headers?.['content-type'] ?? ''
  if (!contentType.includes('text/html')) return false

  const body = typeof response.data === 'string' ? response.data : ''
  return LOGIN_HTML_MARKERS.some((marker) => body.includes(marker))
}

/**
 * Returns true when the response to j_spring_security_check looks like
 * a Spring Security login-failure redirect page (bad credentials / captcha).
 * Spring Security follows up a failed POST with a redirect to /website/login?error=...
 * which Axios resolves as 200 with HTML content.
 */
function isLoginErrorResponse(response) {
  // Check final URL (after redirect) for ?error query param
  const finalUrl = response?.request?.responseURL || response?.config?.url || ''
  if (finalUrl.includes('error=') || finalUrl.includes('?error')) return true

  const contentType = response?.headers?.['content-type'] ?? ''
  if (!contentType.includes('text/html')) return false

  const body = typeof response.data === 'string' ? response.data : ''
  return LOGIN_ERROR_MARKERS.some((marker) => body.includes(marker))
}

/**
 * Parses the filename from a Content-Disposition header.
 * Handles both  filename="foo.pdf"  and  filename*=UTF-8''foo.pdf  forms.
 *
 * @param {string} header - raw Content-Disposition header value
 * @param {string} [fallback='download'] - name to use when header is absent
 * @returns {string}
 */
function parseFilename(header, fallback = 'download') {
  if (!header) return fallback

  // RFC 5987 encoded form:  filename*=UTF-8''encoded-name
  const rfc5987Match = header.match(/filename\*\s*=\s*[^']*''([^;]+)/i)
  if (rfc5987Match) {
    try {
      return decodeURIComponent(rfc5987Match[1].trim())
    } catch {
      // fall through to plain match
    }
  }

  // Plain form:  filename="some name.pdf"  or  filename=somename.pdf
  const plainMatch = header.match(/filename\s*=\s*["']?([^"';\r\n]+)["']?/i)
  if (plainMatch) return plainMatch[1].trim()

  return fallback
}

/**
 * Triggers a browser file-save dialog for a blob response.
 *
 * @param {Blob}   blob
 * @param {string} filename
 */
function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  // Slight delay before revocation so the browser has time to start the download
  setTimeout(() => {
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }, 200)
}

/**
 * Redirects the user to the login page.
 * Uses window.location.replace so the broken page is not kept in history.
 * Never redirects when the user is already on a public route.
 */
function redirectToLogin(queryParam = '') {
  if (typeof window === 'undefined') return
  const pathname = window.location.pathname
  const isPublic = !pathname || pathname === '/' || [
    '/login',
    '/signup',
    '/forgot-password',
    '/forgot-username',
    '/website',
    '/about',
    '/guidelines',
    '/unauthorized',
    '/not-found',
  ].some((p) => pathname.startsWith(p))

  if (isPublic) return

  const target = `/login${queryParam ? `?${queryParam}` : ''}`
  window.location.replace(target)
}

// ─── Request Interceptor ──────────────────────────────────────────────────────

httpClient.interceptors.request.use(
  (config) => {
    // Ensure multipart requests let the browser set the boundary automatically
    // (do not override Content-Type for FormData payloads)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response Interceptor ─────────────────────────────────────────────────────

httpClient.interceptors.response.use(
  (response) => {
    const requestUrl = response.config?.url || ''
    const isLoginEndpoint = requestUrl.includes('j_spring_security_check')

    if (isLoginEndpoint) {
      // For the login processing URL, detect a Spring Security failure redirect:
      // bad credentials cause a redirect to /website/login?error=... (200 HTML).
      if (isLoginErrorResponse(response)) {
        return Promise.reject(
          new Error('Invalid username, password, or captcha. Please try again.'),
        )
      }
      // Successful login: Spring Security sets JSESSIONID and redirects to dashboard.
      return response
    }

    // A 200 OK can still carry an HTML login page when the session has expired
    // and Spring Security performs an internal forward instead of a 302.
    if (isLoginHtmlResponse(response)) {
      notifySessionExpired('Session expired (HTML login detected)', 401)
      redirectToLogin('timeout=true')
      return Promise.reject(
        new Error('Session expired – redirecting to login'),
      )
    }
    return response
  },
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      // 401 = not authenticated / session expired
      notifySessionExpired('Unauthorised / session expired', 401)
      redirectToLogin('timeout=true')
      return Promise.reject(
        new Error('Unauthorised – please log in again'),
      )
    }

    if (status === 403) {
      // 403 = authenticated but not authorised
      notifySessionExpired('Forbidden – insufficient permissions', 403)
      return Promise.reject(
        new Error('Forbidden – you do not have permission to access this resource'),
      )
    }

    return Promise.reject(error)
  },
)

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * JSON GET request.
 *
 * @param {string} url
 * @param {Record<string, any>} [params={}] - query string parameters
 * @param {import('axios').AxiosRequestConfig} [config={}]
 * @returns {Promise<any>} response.data
 */
export async function get(url, params = {}, config = {}) {
  const response = await httpClient.get(url, { params, ...config })
  return response.data
}

/**
 * JSON POST request.
 *
 * @param {string} url
 * @param {any}    [data={}] - request body (will be JSON-serialised)
 * @param {import('axios').AxiosRequestConfig} [config={}]
 * @returns {Promise<any>} response.data
 */
export async function post(url, data = {}, config = {}) {
  const response = await httpClient.post(url, data, {
    headers: { 'Content-Type': 'application/json' },
    ...config,
  })
  return response.data
}

/**
 * Multipart/form-data upload with optional progress reporting.
 *
 * @param {string}    url
 * @param {FormData}  formData
 * @param {(percent: number) => void} [onProgress] - called with 0-100
 * @param {import('axios').AxiosRequestConfig} [config={}]
 * @returns {Promise<any>} response.data
 */
export async function upload(url, formData, onProgress, config = {}) {
  const response = await httpClient.post(url, formData, {
    // Content-Type is deliberately omitted here; the request interceptor
    // removes it too, allowing the browser to set the correct boundary.
    onUploadProgress(progressEvent) {
      if (typeof onProgress === 'function' && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        )
        onProgress(percent)
      }
    },
    ...config,
  })
  return response.data
}

/**
 * Blob download. Fetches the resource, reads the filename from the
 * Content-Disposition response header, and triggers a browser save dialog.
 *
 * @param {string} url
 * @param {Record<string, any>} [params={}] - query string parameters
 * @param {string} [fallbackFilename='download'] - used when header is missing
 * @param {import('axios').AxiosRequestConfig} [config={}]
 * @returns {Promise<void>}
 */
export async function download(
  url,
  params = {},
  fallbackFilename = 'download',
  config = {},
) {
  const response = await httpClient.get(url, {
    params,
    responseType: 'blob',
    ...config,
  })

  const disposition = response.headers?.['content-disposition'] ?? ''
  const filename = parseFilename(disposition, fallbackFilename)
  triggerBlobDownload(response.data, filename)
}

/**
 * application/x-www-form-urlencoded POST.
 * Required for the legacy Spring Security login form endpoint and any
 * other backend route that expects URL-encoded form data.
 *
 * @param {string}                    url
 * @param {Record<string, string>}    fields  - key/value pairs to encode
 * @param {import('axios').AxiosRequestConfig} [config={}]
 * @returns {Promise<any>} response.data
 */
export async function postForm(url, fields = {}, config = {}) {
  const body = new URLSearchParams(fields).toString()
  const response = await httpClient.post(url, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    ...config,
  })
  return response.data
}

// Export the raw Axios instance for advanced use-cases (e.g. cancellation tokens)
export default httpClient
