import { createContext, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import './back-button.css'

const PageBackContext = createContext(false)

function isDashboardPath(pathname) {
  const path = pathname.replace(/\/+$/, '')
  return /\/dashboard[^/]*$/i.test(path) || [
    '/applicant/grievances',
    '/department/land-scrutiny', '/department/inspections',
    '/department/fa-approvals', '/department/applications', '/department/mis-reports',
  ].includes(path)
}

export default function BackButton({ pageControl = false }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { locale } = useTranslation()
  const hasPageBackControl = useContext(PageBackContext)
  if (isDashboardPath(pathname) || (hasPageBackControl && !pageControl)) return null
  const canGoBack = window.navigation?.canGoBack ?? (window.history.length > 1)
  return <button type="button" className="portal-back-button"
    disabled={!canGoBack} onClick={() => navigate(-1)}
    aria-label={locale === 'hi' ? 'पिछले पृष्ठ पर वापस जाएं' : 'Back to previous page'}>
    <span aria-hidden="true">←</span> {locale === 'hi' ? 'वापस' : 'Back'}
  </button>
}

export function PageBackBar() {
  const { pathname } = useLocation()
  if (isDashboardPath(pathname)) return null
  return <div className="portal-back-bar"><BackButton pageControl /></div>
}

// Layouts own the bottom control; suppress older inline/header duplicates.
export function PageBackNavigation({ children, hidden = false }) {
  return <PageBackContext.Provider value={true}>
    <div className="portal-page-navigation">
      <div className="portal-page-body">{children}</div>
      {!hidden && <PageBackBar />}
    </div>
  </PageBackContext.Provider>
}
