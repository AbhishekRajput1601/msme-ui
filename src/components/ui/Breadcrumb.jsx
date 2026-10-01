/**
 * Breadcrumb.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Accessible navigation breadcrumb component with chevron separators.
 */

import React from 'react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ items = [], className = '' }) {
  if (!items || items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-xs ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}

              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="hover:text-indigo-600 focus-visible:outline-none focus-visible:underline rounded-xs"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={`font-semibold ${isLast ? 'text-gray-900' : 'text-gray-600'}`}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
