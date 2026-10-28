/**
 * AdminLayout.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Specialized portal layout for system administrators (ROLE_ADMIN).
 * Renders the exact legacy navigation sidebar and header bar from adminHome.html.
 */

import React from 'react'
import AuthenticatedLayout from './AuthenticatedLayout'
import AdminSidebar from '../modules/admin/AdminSidebar'

export default function AdminLayout() {
  return (
    <AuthenticatedLayout
      portalTitle="System Administration"
      portalSubtitle="Control Center"
      renderSidebar={(onNavigate) => <AdminSidebar onNavigate={onNavigate} />}
      headerBadge={
        <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-purple-600/20">
          Administrator
        </span>
      }
    />
  )
}
