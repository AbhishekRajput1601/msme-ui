/**
 * UnauthorizedPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible 403 Forbidden page.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'

export default function UnauthorizedPage() {
  const { roles } = useAuth()

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 shadow-sm border border-red-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2">Access Denied (403)</h1>
        <p className="text-sm text-gray-600 mb-4">
          You do not have the required permissions or role assignment to view this page.
        </p>

        {roles && roles.length > 0 && (
          <p className="text-xs text-gray-400 font-mono mb-6">
            Current Roles: {roles.join(', ')}
          </p>
        )}

        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
