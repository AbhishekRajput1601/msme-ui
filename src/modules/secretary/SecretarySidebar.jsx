/**
 * SecretarySidebar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Sidebar navigation component matching the simple legacy layout:
 * clean blue background, edge-to-edge list items, thin dividers, and exact icons.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import './secretary.css'

export default function SecretarySidebar({ onNavigate }) {
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
            className="secretary-menu-link"
            onClick={handleLinkClick}
          >
            <i className="fa fa-dashboard fa-fw" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link
            to="/department/secretary/verification"
            className="secretary-menu-link"
            onClick={handleLinkClick}
          >
            <i className="fa fa-check-square fa-fw" aria-hidden="true" />
            <span>Verification</span>
          </Link>
        </li>
        <li>
          <Link
            to="/department/secretary/batches"
            className="secretary-menu-link"
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


