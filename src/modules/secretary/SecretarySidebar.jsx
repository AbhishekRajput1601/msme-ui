/**
 * SecretarySidebar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Sidebar navigation component matching legacy AngularJS implementation
 * and exact layout, icons, and colors from the provided screenshot.
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './secretary.css'

export default function SecretarySidebar({ onNavigate }) {
  const { pathname } = useLocation()

  const isDashboardActive = pathname === '/department/secretary/dashboard' || pathname === '/department/secretary'
  const isVerificationActive = pathname === '/department/secretary/verification' || pathname.startsWith('/department/secretary/detail')
  const isBatchesActive = pathname === '/department/secretary/batches'

  const handleLinkClick = () => {
    if (typeof onNavigate === 'function') {
      onNavigate()
    }
  }

  return (
    <nav className="secretary-navigation" aria-label="Secretary navigation">
      <ul className="nav" id="side-menu">
        <li>
          <Link
            to="/department/secretary/dashboard"
            className={`secretary-menu-link ${isDashboardActive ? 'active' : ''}`}
            aria-current={isDashboardActive ? 'page' : undefined}
            onClick={handleLinkClick}
          >
            <i className="fa fa-dashboard fa-fw" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/department/secretary/verification"
            className={`secretary-menu-link ${isVerificationActive ? 'active' : ''}`}
            aria-current={isVerificationActive ? 'page' : undefined}
            onClick={handleLinkClick}
          >
            <i className="fa fa-check-square-o fa-fw" aria-hidden="true" />
            <span>Verification</span>
          </Link>
        </li>
        <li>
          <Link
            to="/department/secretary/batches"
            className={`secretary-menu-link ${isBatchesActive ? 'active' : ''}`}
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
