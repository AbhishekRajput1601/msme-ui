/**
 * DepartmentLayout.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Specialised portal layout for departmental officers (DTIC, ID Section, FA, Zonal, Secretary).
 */

import React, { useMemo } from 'react'
import AuthenticatedLayout from './AuthenticatedLayout'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../hooks/useTranslation'

export default function DepartmentLayout() {
  const { roles } = useAuth()
  const { t } = useTranslation()

  // Format primary officer role for display
  const officerRoleName = useMemo(() => {
    const raw = roles[0] || 'DEPARTMENT'
    if (raw.includes('ID')) return 'ID Section Officer'
    if (raw.includes('DTIC')) return 'DTIC General Manager'
    if (raw.includes('FA')) return 'Financial Assistance Officer'
    if (raw.includes('ZONAL')) return 'Zonal Officer'
    if (raw.includes('SECRETARY')) return 'Secretary (MSME)'
    if (raw.includes('COLLECTOR')) return 'District Collector'
    if (raw.includes('LDM')) return 'Lead District Manager'
    return raw.replace('ROLE_', '').replace(/_/g, ' ')
  }, [roles])

  const sidebarItems = useMemo(
    () => [
      {
        label: t('nav.dashboard', 'Officer Dashboard'),
        href: '/department/dashboard',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        label: t('nav.pendingScrutiny', 'Land Scrutiny & Allotment'),
        href: '/department/land-scrutiny',
        badge: 'New',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
      {
        label: t('nav.siteInspections', 'Site Inspections'),
        href: '/department/inspections',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
      },
      {
        label: t('nav.approvals', 'Financial Subsidy Approvals'),
        href: '/department/fa-approvals',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        label: t('nav.allApplications', 'All Applications Repository'),
        href: '/department/applications',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        ),
      },
      {
        label: t('nav.misReports', 'MIS & Analytics Reports'),
        href: '/department/mis-reports',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
    [t],
  )

  return (
    <AuthenticatedLayout
      sidebarItems={sidebarItems}
      portalTitle="Department Portal"
      portalSubtitle="Government of Madhya Pradesh"
      headerBadge={
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/20">
          {officerRoleName}
        </span>
      }
    />
  )
}
