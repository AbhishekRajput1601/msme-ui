/**
 * ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Role-based client-side route guard component for React Router v6+.
 *
 * ⚠️ CRITICAL SECURITY NOTE:
 * This client-side route guard is purely for UX and navigation convenience
 * (preventing blank screens or flashing protected views before an API call fails).
 * The Java Spring Boot backend (Spring Security SecurityFilterChain and
 * method-level security @PreAuthorize) remains the sole, authoritative source
 * of truth for authorization and access control.
 *
 * Props:
 *  • allowedRoles   : Array<string> | string - Optional list of required roles.
 *                     If omitted, any authenticated user can access the route.
 *  • redirectPath   : string - Path to redirect unauthenticated users (default: /login).
 *  • unauthorizedPath: string - Path to redirect users lacking required roles (default: /unauthorized).
 *  • children       : ReactNode - Protected component(s) or renders <Outlet /> if nested.
 */

import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({
  allowedRoles = [],
  redirectPath = '/login',
  unauthorizedPath = '/unauthorized',
  children,
}) {
  const { authenticated, roles, loading, hasAnyRole } = useAuth()
  const location = useLocation()

  // Normalize allowedRoles to array
  const requiredRoles = Array.isArray(allowedRoles)
    ? allowedRoles
    : allowedRoles
    ? [allowedRoles]
    : []

  // 1. While session verification is in progress, display a loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-gray-600">Verifying session...</p>
        </div>
      </div>
    )
  }

  // 2. Unauthenticated: redirect to login page and preserve requested URL in state
  if (!authenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  // 3. Authenticated but lacks required role: block access
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    if (unauthorizedPath) {
      return <Navigate to={unauthorizedPath} state={{ from: location }} replace />
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-lg border border-red-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied (403)</h2>
          <p className="text-sm text-gray-600 mb-6">
            Your account does not possess the permissions required to access this resource.
          </p>
          <div className="text-xs text-gray-400 font-mono mb-6">
            Required: {requiredRoles.join(', ')}<br />
            Assigned: {roles.join(', ') || 'None'}
          </div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // 4. Authorized: render children or nested Outlet
  return children ? children : <Outlet />
}
