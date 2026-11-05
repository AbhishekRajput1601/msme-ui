/**
 * SecretarySidebar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Sidebar navigation component matching the simple legacy layout:
 * clean blue background, edge-to-edge list items, thin dividers, and exact icons.
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './secretary.css'

export default function SecretarySidebar({ onNavigate }) {
  const { pathname } = useLocation()

  const isDashboardActive = pathname === '/department/secretary' || pathname === '/department/secretary/dashboard'
  const isBatchesActive = pathname.startsWith('/department/secretary/batche') || pathname.startsWith('/department/secretary/batch')
  const isVerificationActive = !isDashboardActive && !isBatchesActive && (
    pathname.startsWith('/department/secretary/verification') ||
    pathname.startsWith('/department/secretary/detail') ||
    pathname.startsWith('/department/secretary/progress') ||
    pathname.startsWith('/department/secretary/fa')
  )

  const handleLinkClick = () => {
    if (typeof onNavigate === 'function') {
      onNavigate()
    }
  }

  return (
    <nav className="secretary-navigation" aria-label="Secretary navigation">
      <ul className="nav" id="side-menu">
        <li className={isDashboardActive ? 'active' : undefined}>
          <Link
            to="/department/secretary/dashboard"
            className={`secretary-menu-link${isDashboardActive ? ' active' : ''}`}
            aria-current={isDashboardActive ? 'page' : undefined}
            onClick={handleLinkClick}
          >
            <i className="fa fa-dashboard fa-fw" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={isVerificationActive ? 'active' : undefined}>
          <Link
            to="/department/secretary/verification"
            className={`secretary-menu-link${isVerificationActive ? ' active' : ''}`}
            aria-current={isVerificationActive ? 'page' : undefined}
            onClick={handleLinkClick}
          >
            <i className="fa fa-check-square fa-fw" aria-hidden="true" />
            <span>Verification</span>
          </Link>
        </li>
        <li className={isBatchesActive ? 'active' : undefined}>
          <Link
            to="/department/secretary/batches"
            className={`secretary-menu-link${isBatchesActive ? ' active' : ''}`}
            aria-current={isBatchesActive ? 'page' : undefined}
            onClick={handleLinkClick}
          >
            <i className="fa fa-folder fa-fw" aria-hidden="true" />
            <span>Batches</span>
          </Link>
        </li>
      </ul>
    </nav>
  )
}


