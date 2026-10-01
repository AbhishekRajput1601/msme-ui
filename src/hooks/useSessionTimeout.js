/**
 * useSessionTimeout.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Recreates the AngularJS IdleProvider behavior for React.
 *
 * Angular legacy behavior:
 *  • IdleProvider.idle(1800)       → 30-minute idle timeout
 *  • IdleProvider.timeout(2) / Keepalive
 *  • On IdleTimeout                → alerts user & redirects to login
 *
 * Modern enhancements:
 *  • Event-driven activity tracking with throttled listeners (mousemove, keydown, click, scroll, touch)
 *  • Configurable warning window before forced logout (default 2 minutes)
 *  • Live countdown seconds for modal display
 *  • Immediate sync with backend 401/403/session-timeout responses via httpClient's onSessionExpired
 *  • Automatic keep-alive / reset when user confirms "Stay Logged In"
 *  • Redirects to /login?timeout=true on expiry
 *
 * Options:
 *  • timeoutSeconds : Total idle time in seconds (default: 1800 = 30 minutes)
 *  • warningSeconds : Warning window before logout in seconds (default: 120 = 2 minutes)
 *  • enabled        : Whether tracking is active (e.g. only when authenticated, default: true)
 *  • onTimeout      : Optional custom callback before redirect
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { onSessionExpired } from '../api/httpClient'
import { get } from '../api/httpClient'
import { COMMON } from '../api/endpoints'

const DEFAULT_TIMEOUT_SECONDS = 1800 // 30 minutes
const DEFAULT_WARNING_SECONDS = 120  // 2 minutes warning dialog

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
]

export function useSessionTimeout({
  timeoutSeconds = DEFAULT_TIMEOUT_SECONDS,
  warningSeconds = DEFAULT_WARNING_SECONDS,
  enabled = true,
  onTimeout,
} = {}) {
  const [isWarning, setIsWarning] = useState(false)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [countdown, setCountdown] = useState(warningSeconds)

  const lastActivityRef = useRef(Date.now())
  const warningTimerRef = useRef(null)
  const countdownIntervalRef = useRef(null)
  const throttleRef = useRef(0)

  // Redirect to login on session expiry
  const handleTimeout = useCallback(() => {
    setIsTimedOut(true)
    setIsWarning(false)

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    if (typeof onTimeout === 'function') {
      onTimeout()
    }

    // Redirect to login page with timeout indicator
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      window.location.replace('/login?timeout=true')
    }
  }, [onTimeout])

  // Reset timers back to fresh 30-minute idle period
  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    setIsWarning(false)
    setCountdown(warningSeconds)

    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
      countdownIntervalRef.current = null
    }

    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
    }

    if (!enabled) return

    // Time until warning dialog should appear
    const timeUntilWarningMs = Math.max(0, (timeoutSeconds - warningSeconds) * 1000)

    warningTimerRef.current = setTimeout(() => {
      setIsWarning(true)
      setCountdown(warningSeconds)

      const start = Date.now()
      countdownIntervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000)
        const remaining = Math.max(0, warningSeconds - elapsed)
        setCountdown(remaining)

        if (remaining <= 0) {
          clearInterval(countdownIntervalRef.current)
          countdownIntervalRef.current = null
          handleTimeout()
        }
      }, 1000)
    }, timeUntilWarningMs)
  }, [enabled, timeoutSeconds, warningSeconds, handleTimeout])

  // Stay logged in action: resets timer and pings backend to keep Spring Security session active
  const stayLoggedIn = useCallback(async () => {
    resetTimer()
    try {
      // Optional lightweight ping to backend (keepalive)
      await get(COMMON.GET_MESSAGE.replace('{key}', 'app.ping'), {}, { timeout: 5000 })
    } catch {
      // Non-critical ping failure, timer already reset
    }
  }, [resetTimer])

  // Immediately log out and redirect
  const logoutNow = useCallback(() => {
    handleTimeout()
  }, [handleTimeout])

  // Set up event listeners for user activity
  useEffect(() => {
    if (!enabled) {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      setIsWarning(false)
      return
    }

    resetTimer()

    const handleUserActivity = () => {
      // If warning dialog is currently visible, require deliberate click on "Stay Logged In"
      if (isWarning) return

      // Throttle activity resets to at most once every 2 seconds to reduce CPU overhead
      const now = Date.now()
      if (now - throttleRef.current > 2000) {
        throttleRef.current = now
        resetTimer()
      }
    }

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true })
    })

    // Listen to 401 / session-expired notifications from httpClient interceptor
    const unsubscribeHttp = onSessionExpired((detail) => {
      console.warn('httpClient reported expired session:', detail?.reason)
      handleTimeout()
    })

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleUserActivity)
      })
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      unsubscribeHttp()
    }
  }, [enabled, isWarning, resetTimer, handleTimeout])

  return {
    isWarning,
    isTimedOut,
    countdown,
    resetTimer,
    stayLoggedIn,
    logoutNow,
  }
}

export default useSessionTimeout
