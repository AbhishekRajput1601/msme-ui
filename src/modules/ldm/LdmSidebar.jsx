import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './ldm.css'

export default function LdmSidebar({ onNavigate }) {
  const { pathname } = useLocation()

  const menuItems = [
    {
      path: 'dashboard',
      to: '/department/ldm/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      isActive: pathname === '/department/ldm' || pathname === '/department/ldm/dashboard',
    },
    {
      path: 'verification',
      to: '/department/ldm/verification',
      label: 'Verification',
      icon: 'check-square-o',
      isActive: pathname.startsWith('/department/ldm/verification') || pathname.startsWith('/department/ldm/detail'),
    },
    {
      path: 'batches',
      to: '/department/ldm/batches',
      label: 'Batches',
      icon: 'folder',
      isActive: pathname.startsWith('/department/ldm/batche') || pathname.startsWith('/department/ldm/batch'),
    },
  ]

  const handleLinkClick = () => {
    if (typeof onNavigate === 'function') {
      onNavigate()
    }
  }

  return (
    <nav className="ldm-navigation" aria-label="Lead District Manager navigation">
      <ul className="nav" id="side-menu">
        {menuItems.map(({ path, to, label, icon, isActive }) => (
          <li key={path} className={isActive ? 'active' : undefined}>
            <Link
              to={to}
              className={`ldm-menu-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={handleLinkClick}
            >
              <i className={`fa fa-${icon} fa-fw`} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
