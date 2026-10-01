/**
 * useAuth.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom hook exposing current authenticated user, roles, and session methods.
 *
 * Security:
 *  • Relies strictly on the HttpOnly session cookie managed by Spring Security.
 *  • Session secrets and passwords are never stored in localStorage / sessionStorage.
 *
 * Usage:
 *   const { currentUser, authenticated, roles, login, logout, hasRole, hasAnyRole } = useAuth()
 */

export { useAuth, AuthProvider } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
export default useAuth
