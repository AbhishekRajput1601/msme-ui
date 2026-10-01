/**
 * PageHeader.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible page title section with integrated breadcrumb, status badge, and action bar.
 */

import React from 'react'
import Breadcrumb from './Breadcrumb'

export default function PageHeader({
  title,
  subtitle,
  badge,
  breadcrumbs,
  actions,
  className = '',
}) {
  return (
    <div className={`portal-page-header mb-6 pb-4 border-b border-gray-200/80 ${className}`}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-3" />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 truncate">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {actions && (
          <div className="flex shrink-0 items-center flex-wrap gap-2.5">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
