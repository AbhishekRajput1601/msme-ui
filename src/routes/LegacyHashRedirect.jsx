/**
 * LegacyHashRedirect.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Compatibility redirect component for the transitional migration phase.
 *
 * Catches legacy AngularJS URLs emitted by Spring Security's
 * MPIndustryAuthenticationSuccessHandler (e.g. /applicant/home#/dashboard,
 * /adminSection/home#/dashboard, /dtic/home#/dashboard) and forwards the user
 * seamlessly to the corresponding modern React browser route (/applicant/dashboard).
 */

import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { resolveLegacyHashRoute } from './roleRoutes'

export default function LegacyHashRedirect() {
  const navigate = useNavigate()
  const location = useLocation()
  const [targetPath, setTargetPath] = useState('')

  useEffect(() => {
    // Read raw window.location to catch # hash fragments passed from Spring Security redirect
    const rawPathname = window.location.pathname
    const rawHash = window.location.hash
    const rawSearch = window.location.search

    const destination = resolveLegacyHashRoute(rawPathname, rawHash)
    const fullDestination = rawSearch ? `${destination}${rawSearch}` : destination

    setTargetPath(fullDestination)

    // Smooth redirect using React Router
    const timer = setTimeout(() => {
      navigate(fullDestination, { replace: true })
    }, 150)

    return () => clearTimeout(timer)
  }, [navigate, location])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-lg border border-gray-100 animate-fade-in">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4">
          <svg className="animate-spin h-7 w-7" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        <h2 className="text-base font-bold text-gray-900 mb-1">
          Redirecting to Modern Portal
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          आधुनिक पोर्टल पर पुनर्निर्देशित किया जा रहा है...
        </p>

        {targetPath && (
          <p className="text-[11px] font-mono text-gray-400 truncate bg-gray-50 py-1.5 px-3 rounded-md mb-4">
            {targetPath}
          </p>
        )}

        <button
          type="button"
          onClick={() => targetPath && navigate(targetPath, { replace: true })}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline focus-visible:outline-none"
        >
          Click here if not redirected automatically
        </button>
      </div>
    </div>
  )
}
