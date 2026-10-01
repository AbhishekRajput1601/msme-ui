/**
 * ApplicationStatusBadge.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible status badge with color coding and icon for ID module applications.
 */

import React from 'react'
import { getStatusMeta } from '../types'

const VARIANTS = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  info: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
}

export default function ApplicationStatusBadge({ status, className = '' }) {
  const meta = getStatusMeta(status)
  const variantClass = VARIANTS[meta.variant] || VARIANTS.info

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${variantClass} ${className}`}
      title={meta.description}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          meta.variant === 'success'
            ? 'bg-emerald-500'
            : meta.variant === 'warning'
            ? 'bg-amber-500 animate-pulse'
            : meta.variant === 'danger'
            ? 'bg-red-500'
            : 'bg-indigo-500'
        }`}
      />
      <span>{meta.label}</span>
    </span>
  )
}
