import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from '../../../hooks/useTranslation'

export default function ProfileNavTabs({ activeTab, pageTitle }) {
  const { locale } = useTranslation()
  const hindi = locale === 'hi'
  const location = useLocation()

  const isSecretary = location.pathname.startsWith('/department/secretary')
  const isDepartment = location.pathname.startsWith('/department')

  const dashboardPath = isSecretary
    ? '/department/secretary/dashboard'
    : isDepartment
    ? '/department/dashboard'
    : '/applicant/dashboard'

  const portalLabel = isSecretary
    ? (hindi ? 'सचिव पोर्टल' : 'Secretary Portal')
    : isDepartment
    ? (hindi ? 'विभाग पोर्टल' : 'Department Portal')
    : (hindi ? 'आवेदक डैशबोर्ड' : 'Applicant Portal')

  const tabs = [
    {
      id: 'user',
      label: hindi ? 'उपयोगकर्ता प्रोफ़ाइल' : 'User Profile',
      path: '/applicant/profile',
      icon: 'fa-user',
    },
    {
      id: 'industry',
      label: hindi ? 'औद्योगिक प्रोफ़ाइल' : 'Industrial Profile',
      path: '/applicant/industry-profile',
      icon: 'fa-industry',
    },
    {
      id: 'password',
      label: hindi ? 'पासवर्ड बदलें' : 'Change Password',
      path: isSecretary ? '/department/secretary/change-password' : '/applicant/change-password',
      icon: 'fa-key',
    },
  ]

  const currentTab = tabs.find((t) => t.id === activeTab)

  return (
    <div>
      {/* Breadcrumb matching legacy government portal */}
      <div className="profile-breadcrumb-bar">
        <div>
          <Link to={dashboardPath}>
            <i className="fa fa-home" /> {hindi ? 'मुख्य पृष्ठ' : 'Home'}
          </Link>
          <span className="profile-breadcrumb-separator">&gt;&gt;</span>
          <Link to={dashboardPath}>{portalLabel}</Link>
          <span className="profile-breadcrumb-separator">&gt;&gt;</span>
          <strong>{pageTitle || currentTab?.label}</strong>
        </div>

        <div>
          <Link to={dashboardPath} className="btn btn-default btn-sm">
            <i className="fa fa-arrow-left" /> {hindi ? 'डैशबोर्ड पर वापस' : 'Back to Dashboard'}
          </Link>
        </div>
      </div>

      {/* Legacy Navigation Tabs - only for applicant */}
      {!isDepartment && (
        <div className="profile-nav-tabs-wrapper">
          <ul className="profile-nav-tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <li key={tab.id}>
                  <NavLink to={tab.path} className={isActive ? 'active' : ''}>
                    <i className={`fa ${tab.icon}`} />
                    <span>{tab.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
