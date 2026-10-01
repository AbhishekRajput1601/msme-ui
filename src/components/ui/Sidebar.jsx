/**
 * Sidebar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsive, accessible navigation sidebar for portal dashboards.
 * Works as a fixed sidebar on desktop and an off-canvas drawer on mobile.
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar({
  items = [],
  isOpen = false,
  onClose,
  portalTitle = 'MP Industry Portal',
  portalSubtitle = 'Govt. of Madhya Pradesh',
  className = '',
}) {
  const location = useLocation()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Sidebar Navigation"
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 text-slate-200 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col shadow-xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${className}`}
      >
        {/* Header / Brand */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-base shadow-sm">
              MP
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate leading-tight">
                {portalTitle}
              </h2>
              <p className="text-[11px] text-slate-400 truncate">{portalSubtitle}</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {items.map((item, idx) => {
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href))

            return (
              <Link
                key={idx}
                to={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all select-none
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400
                  ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                {item.icon && (
                  <span
                    className={`shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                  </span>
                )}
                <span className="truncate flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive
                        ? 'bg-indigo-800 text-white'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-slate-800 p-4 text-[11px] text-slate-500">
          <p>© MP Department of MSME</p>
          <p className="mt-0.5 text-slate-600">v2.0 (React Migration)</p>
        </div>
      </aside>
    </>
  )
}
