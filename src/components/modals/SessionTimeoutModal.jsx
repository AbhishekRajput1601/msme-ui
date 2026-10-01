/**
 * SessionTimeoutModal.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal component displayed when the user's session is nearing the 30-minute idle limit.
 * Replaces the old alert() from the AngularJS IdleProvider with a modern dialog.
 */

import React from 'react'

export default function SessionTimeoutModal({
  show,
  countdown = 120,
  onStayLoggedIn,
  onLogout,
}) {
  if (!show) return null

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all border border-amber-200">
        <div className="flex items-center space-x-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Session Expiring Soon</h3>
            <p className="text-sm text-gray-500">
              You have been inactive. For your security, you will be automatically logged out in:
            </p>
          </div>
        </div>

        <div className="my-6 text-center">
          <span className="inline-block rounded-xl bg-amber-50 px-6 py-3 font-mono text-3xl font-bold tracking-wider text-amber-700 border border-amber-200 shadow-inner">
            {formattedTime}
          </span>
          <p className="mt-2 text-xs text-gray-400">
            Click &quot;Stay Logged In&quot; to continue your work without losing unsaved changes.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-2">
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Log Out Now
          </button>
          <button
            type="button"
            onClick={onStayLoggedIn}
            className="inline-flex justify-center rounded-lg border border-transparent bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  )
}
