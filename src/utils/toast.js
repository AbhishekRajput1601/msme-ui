import { toast as reactToastify } from 'react-toastify'

/**
 * Creates deduplicated toast options.
 * Using message as toastId prevents duplicate notifications when triggered repeatedly.
 */
function getOptions(message, options = {}) {
  const toastId = options.toastId || (typeof message === 'string' ? message.trim() : undefined)
  return {
    toastId,
    ...options,
  }
}

/**
 * Enhanced toast helper with automatic deduplication.
 */
export const toast = {
  success(message, options) {
    if (!message) return null
    return reactToastify.success(message, getOptions(message, options))
  },
  error(message, options) {
    if (!message) return null
    return reactToastify.error(message, getOptions(message, options))
  },
  warning(message, options) {
    if (!message) return null
    return reactToastify.warning(message, getOptions(message, options))
  },
  info(message, options) {
    if (!message) return null
    return reactToastify.info(message, getOptions(message, options))
  },
  dismiss(id) {
    return reactToastify.dismiss(id)
  },
  isActive(id) {
    return reactToastify.isActive(id)
  },
}

/**
 * Utility to display user-friendly errors from Axios or native Fetch/Network errors.
 */
export function handleApiError(error, defaultMessage = 'An unexpected error occurred. Please try again.') {
  if (!error) {
    toast.error(defaultMessage)
    return
  }

  // Network offline / connection failed
  if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !navigator.onLine) {
    toast.error('Network connection issue. Please check your internet connection and try again.')
    return
  }

  // Timeout
  if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
    toast.error('The request timed out. Please try again.')
    return
  }

  // HTTP status responses
  const status = error.response?.status
  const serverMsg = error.response?.data?.message || error.response?.data?.error || error.response?.data?.value
  if (status === 401) {
    toast.warning(serverMsg || 'Your session has expired. Please log in again.')
    return
  }
  if (status === 403) {
    toast.error(serverMsg || 'Access denied. You do not have permission to perform this action.')
    return
  }
  if (status === 404) {
    toast.error(serverMsg || 'The requested resource was not found.')
    return
  }
  if (status >= 500) {
    toast.error(serverMsg || 'Server error occurred. Please try again later.')
    return
  }

  const message = serverMsg || error.message || defaultMessage
  toast.error(message)
}

/**
 * Global alert bridge: replaces blocking window.alert with React Toastify notifications.
 * Analyzes message sentiment/intent to choose success, warning, error, or info.
 */
export function setupGlobalAlertBridge() {
  if (typeof window === 'undefined') return

  window.alert = function (message) {
    if (message == null || message === '') return
    const msg = String(message).trim()

    // Categorize message
    const lower = msg.toLowerCase()
    if (
      lower.includes('successfully') ||
      lower.includes('successfylly') ||
      lower.includes('saved successfully') ||
      lower.includes('reseted') ||
      lower.includes('updated successfully')
    ) {
      toast.success(msg)
    } else if (
      lower.includes('should not exceed') ||
      lower.includes('must be') ||
      lower.includes('please upload') ||
      lower.includes('please select') ||
      lower.includes('please enter') ||
      lower.includes('please provide') ||
      lower.includes('is mandatory') ||
      lower.includes('cannot be') ||
      lower.includes('exceeds') ||
      lower.includes('only pdf') ||
      lower.includes('not allowed')
    ) {
      toast.warning(msg)
    } else if (
      lower.includes('error') ||
      lower.includes('failed') ||
      lower.includes('unable to') ||
      lower.includes('invalid') ||
      lower.includes('could not') ||
      lower.includes('mismatch') ||
      lower.includes('not available') ||
      lower.includes('expired')
    ) {
      toast.error(msg)
    } else {
      toast.info(msg)
    }
  }
}

export default toast

