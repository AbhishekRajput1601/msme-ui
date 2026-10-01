/**
 * AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * React Context providing centralized authentication state.
 *
 * Security:
 *  • Session secrets and credentials are NEVER stored in localStorage or sessionStorage.
 *  • Relies strictly on the HttpOnly JSESSIONID session cookie sent by the browser.
 *  • Auth state in memory only.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import authService, { UNAUTHENTICATED_SESSION } from '../services/authService'
import { onSessionExpired } from '../api/httpClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Verify active session on initial mount
  const checkAuth = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const session = await authService.fetchCurrentUser()
      if (session && session.authenticated) {
        setCurrentUser(session)
        setAuthenticated(true)
        setRoles(session.roles || [])
      } else {
        setCurrentUser(null)
        setAuthenticated(false)
        setRoles([])
      }
      return session
    } catch (err) {
      setCurrentUser(null)
      setAuthenticated(false)
      setRoles([])
      return UNAUTHENTICATED_SESSION
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()

    // Listen to session expiry events dispatched by httpClient interceptors
    const unsubscribe = onSessionExpired((detail) => {
      console.warn('Session expired event received in AuthProvider:', detail?.reason)
      setCurrentUser(null)
      setAuthenticated(false)
      setRoles([])
    })

    return () => {
      unsubscribe()
    }
  }, [checkAuth])

  // Login handler
  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const user = await authService.login(credentials)
      if (user && user.authenticated) {
        setCurrentUser(user)
        setAuthenticated(true)
        setRoles(user.roles || [])
        return user
      } else {
        throw new Error('Authentication succeeded but session could not be established.')
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Login failed. Please verify credentials.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout handler
  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await authService.logout()
    } finally {
      setCurrentUser(null)
      setAuthenticated(false)
      setRoles([])
      setError(null)
      setLoading(false)
    }
  }, [])

  /**
   * Checks if user has a specific role (case-insensitive, optional ROLE_ prefix).
   */
  const hasRole = useCallback((requiredRole) => {
    if (!requiredRole || !roles.length) return false
    const norm = requiredRole.toUpperCase()
    const withPrefix = norm.startsWith('ROLE_') ? norm : `ROLE_${norm}`
    return roles.some((r) => {
      const u = r.toUpperCase()
      return u === norm || u === withPrefix
    })
  }, [roles])

  /**
   * Checks if user has any of the listed roles.
   */
  const hasAnyRole = useCallback((requiredRoles = []) => {
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return true
    return requiredRoles.some((role) => hasRole(role))
  }, [hasRole])

  const value = useMemo(() => ({
    currentUser,
    authenticated,
    roles,
    loading,
    error,
    login,
    logout,
    checkAuth,
    hasRole,
    hasAnyRole,
  }), [currentUser, authenticated, roles, loading, error, login, logout, checkAuth, hasRole, hasAnyRole])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to consume the AuthContext.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
