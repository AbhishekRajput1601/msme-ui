import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './collector.css'

export default function CollectorSidebar({ onNavigate }) {
  const { pathname } = useLocation()

  const menuItems = [
    {
      path: 'dashboard',
      to: '/department/collector/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      isActive: pathname === '/department/collector' || pathname === '/department/collector/dashboard',
    },
    {
      path: 'processed',
      to: '/department/collector/processed',
      label: 'Processed Applications (mapped district)',
      icon: 'list-alt',
      isActive: pathname.startsWith('/department/collector/processed') || (pathname.startsWith('/department/collector/detail') && !pathname.includes('batch')),
    },
    {
      path: 'batches',
      to: '/department/collector/batches',
      label: 'Batches',
      icon: 'folder',
      isActive: pathname.startsWith('/department/collector/batche') || pathname.startsWith('/department/collector/batch'),
    },
    {
      path: 'approved',
      to: '/department/collector/approved',
      label: 'Approved / Signed Docs',
      icon: 'download',
      isActive: pathname.startsWith('/department/collector/approved'),
    },
  ]

  const handleLinkClick = () => {
    if (typeof onNavigate === 'function') {
      onNavigate()
    }
  }

  return (
    <nav className="collector-navigation" aria-label="District Collector navigation">
      <ul className="nav" id="side-menu">
        {menuItems.map(({ path, to, label, icon, isActive }) => (
          <li key={path} className={isActive ? 'active' : undefined}>
            <Link
              to={to}
              className={`collector-menu-link${isActive ? ' active' : ''}`}
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

