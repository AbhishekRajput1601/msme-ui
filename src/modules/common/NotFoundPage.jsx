/**
 * NotFoundPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible 404 Not Found page.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
        <p className="text-5xl font-black text-indigo-600 mb-2">404</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-gray-500 mb-6">
          The requested page does not exist or may have been relocated during the portal migration.
        </p>
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
