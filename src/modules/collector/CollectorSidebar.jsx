import React from 'react'
import { NavLink } from 'react-router-dom'
import './collector.css'

export default function CollectorSidebar({ onNavigate }) {
  const menuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: 'processed', label: 'Processed Applications (mapped district)', icon: 'list-alt' },
    { path: 'batches', label: 'Batches', icon: 'folder' },
    { path: 'approved', label: 'Approved / Signed Docs', icon: 'download' },
  ]

  return (
    <nav className="collector-navigation" aria-label="District Collector navigation">
      <ul className="nav" id="side-menu">
        {menuItems.map(({ path, label, icon }) => (
          <li key={path}>
            <NavLink
              className="portal-menu-item"
              to={'/department/collector/' + path}
              onClick={onNavigate}
            >
              <i className={'fa fa-' + icon + ' fa-fw'} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

