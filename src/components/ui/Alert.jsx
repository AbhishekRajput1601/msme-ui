/**
 * Alert.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible alert banner for error, warning, success, and informational feedback.
 */

import React from 'react'

const VARIANTS = {
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    iconColor: 'text-blue-500',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    iconColor: 'text-emerald-500',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-900',
    iconColor: 'text-amber-500',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-900',
    iconColor: 'text-red-500',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
}

export default function Alert({
  variant = 'info',
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) {
  const current = VARIANTS[variant] || VARIANTS.info

  return (
    <div
      role="alert"
      className={`relative flex items-start gap-3 rounded-xl border p-4 shadow-2xs text-sm transition-all ${current.container} ${className}`}
    >
      <div className={`shrink-0 ${current.iconColor}`}>
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {current.icon}
        </svg>
      </div>

      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5 leading-snug">{title}</h4>}
        {message && <p className="opacity-90 leading-relaxed">{message}</p>}
        {children}
      </div>

      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 -mr-1 -mt-1 p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current transition-opacity"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}
