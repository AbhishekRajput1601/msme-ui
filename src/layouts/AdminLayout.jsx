/**
 * AdminLayout.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Specialised portal layout for system administrators (ROLE_ADMIN).
 */

import React, { useMemo } from 'react'
import AuthenticatedLayout from './AuthenticatedLayout'
import { useTranslation } from '../hooks/useTranslation'

export default function AdminLayout() {
  const { t } = useTranslation()

  const sidebarItems = useMemo(
    () => [
      {
        label: t('nav.dashboard', 'Dashboard'),
        href: '/admin/dashboard',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
      },
      {
        label: t('nav.userManagement', 'User Management'),
        href: '/admin/users',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
      },
      {
        label: t('nav.masterData', 'Master Data'),
        href: '/admin/masters',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7zm0 5h16M4 12V7c0-2 1.5-3 3.5-3h9c2 0 3.5 1 3.5 3v5" />
          </svg>
        ),
      },
      {
        label: t('nav.auditLogs', 'Audit Logs'),
        href: '/admin/audit-logs',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: t('nav.systemReports', 'System MIS Reports'),
        href: '/admin/reports',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        ),
      },
    ],
    [t],
  )

  return (
    <AuthenticatedLayout
      sidebarItems={sidebarItems}
      portalTitle="Administration"
      portalSubtitle="Control Center"
      headerBadge={
        <span className="inline-flex items-center rounded-md bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 ring-1 ring-purple-600/20">
          Administrator
        </span>
      }
    />
  )
}
