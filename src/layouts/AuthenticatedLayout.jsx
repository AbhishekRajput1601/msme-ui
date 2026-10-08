import { useState, useRef, useEffect, useMemo } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../hooks/useTranslation'
import { useSessionTimeout } from '../hooks/useSessionTimeout'
import { getDefaultRouteForRoles } from '../routes/roleRoutes'
import SessionTimeoutModal from '../components/modals/SessionTimeoutModal'
import ConfirmDialog from '../components/modals/ConfirmDialog'

const applicantMenu = [
  { key: 'dashboard', label: 'Dashboard', href: '/applicant/dashboard', iconName: 'dashboard' },
  { key: 'fa', label: 'For Established Units (Financial Assistance)', iconName: 'bar-chart-o', children: [
    { label: 'Industrial Unit', href: '/applicant/financial-assistance' },
    { label: 'Application for Infrastructure Development Permission', href: '/applicant/financial-assistance/infrastructure' },
    { label: 'Add Unit Details', href: '/applicant/financial-assistance/add-unit' },
  ] },
  { key: 'land', label: 'Infrastructure Development', iconName: 'bar-chart-o', children: [
    { label: 'Developed Land Allotment', href: '/applicant/land-allotment/new' },
    { label: 'Undeveloped Land Allotment', href: '/applicant/land-allotment/explore' },
    { label: 'Applications List', href: '/applicant/land-allotment' },
    { label: 'Annual Payments', href: '/applicant/land-allotment/annual' },
    { label: 'Notice and Appeal', href: '/applicant/land-allotment/notices' },
  ] },
  { key: 'noc', label: 'Online NOCs on MPIDC', href: '/applicant/online-nocs', iconName: 'dashboard' },
  { key: 'award', label: 'MSME Award', href: '/applicant/msme-award', iconName: 'trophy' },
  { key: 'bank', label: 'Bank Details', iconName: 'bank', children: [
    { label: 'Add Bank Details', href: '/applicant/bank-details/new' },
    { label: 'Banks List', href: '/applicant/bank-details' },
  ] },
]

export default function AuthenticatedLayout({ sidebarItems = [], portalTitle = 'MSME Portal' }) {
  const { currentUser, logout, roles } = useAuth()
  const { locale, toggleLocale } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const isApplicant = location.pathname.startsWith('/applicant')
  const dashboard = getDefaultRouteForRoles(roles)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copyrightYear] = useState(() => new Date().getFullYear())
  const [openSubmenus, setOpenSubmenus] = useState({ bank: location.pathname.includes('bank-details'), land: location.pathname.includes('land-allotment'), fa: location.pathname.includes('financial-assistance') || location.pathname.includes('/fa') })
  const { isWarning, countdown, stayLoggedIn, logoutNow } = useSessionTimeout({ timeoutSeconds: 1800, warningSeconds: 120, enabled: true })
  const primaryRole = roles[0]?.replace('ROLE_', '') || 'APPLICANT'
  const formattedRole = useMemo(() => {
    if (!primaryRole) return 'Applicant Role'
    const clean = primaryRole.replace(/^ROLE_/, '')
    const titleCase = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase()
    return titleCase.toLowerCase().includes('role') ? titleCase : `${titleCase} Role`
  }, [primaryRole])
  const userName = currentUser?.displayName || currentUser?.username || 'AMITN'
  const menu = isApplicant ? applicantMenu : sidebarItems

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try { await logout(); navigate('/login?logout=true') }
    finally { setIsLoggingOut(false); setShowLogoutConfirm(false) }
  }

  const userMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return <div className={`legacy-portal${sidebarHidden ? ' sidebar-hidden' : ''}${mobileMenuOpen ? ' mobile-menu-open' : ''}`}>
    <header className="postLoginHeader portal-header-legacy-theme">
      {/* Main Header Bar */}
      <div className="portal-header-main-bar">
        {/* Left: Emblem + Department Branding */}
        <div className="portal-header-brand-group">
          <Link to={dashboard} className="portal-header-emblem-link">
            <img src="/legacy/image/indus_logo.png" alt="Govt of Madhya Pradesh Emblem" className="portal-header-emblem-img" />
          </Link>
          <div className="portal-header-titles">
            <div className="portal-title-gov">Government of Madhya Pradesh</div>
            <div className="portal-title-dept">Department of Micro, Small &amp; Medium Enterprises</div>
            <div className="portal-title-sub">(Directorate of Industries, M.P.)</div>
          </div>
        </div>

        {/* Right Controls & User Tab */}
        <div className="portal-header-right-zone">
          <button
            className="portal-mobile-toggle"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
            aria-controls="sideNav"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fa fa-bars" />
          </button>

          {/* User Tab Hanging Button (Touching top red border, shifted left) */}
          <div className="portal-user-menu" ref={userMenuRef}>
            <button
              className="portal-user-toggle-btn"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title="User Profile Menu"
            >
              <i className="fa fa-user" />
              <i className={`fa fa-caret-${isUserMenuOpen ? 'up' : 'down'}`} />
            </button>

            {isUserMenuOpen && (
              <div
                className="portal-dropdown"
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setIsUserMenuOpen(false)
                }}
              >
                <div className="portal-dropdown-header">
                  <div className="portal-dropdown-user">
                    <i className="fa fa-user-circle fa-fw" /> {userName}
                  </div>
                  <div className="portal-dropdown-sub">{formattedRole}</div>
                </div>
                {isApplicant && (
                  <>
                    <Link to="/applicant/profile" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fa fa-user fa-fw" /> {locale === 'hi' ? 'उपयोगकर्ता प्रोफ़ाइल' : 'Update User Profile'}
                    </Link>
                    <Link to="/applicant/industry-profile" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fa fa-building fa-fw" /> {locale === 'hi' ? 'औद्योगिक प्रोफ़ाइल' : 'Update Industrial Profile'}
                    </Link>
                    <Link to="/applicant/change-password" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fa fa-key fa-fw" /> {locale === 'hi' ? 'पासवर्ड बदलें' : 'Change Password'}
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    setShowLogoutConfirm(true)
                  }}
                >
                  <i className="fa fa-sign-out fa-fw" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Hindi Language Capsule Button */}
          <button className="portal-lang-capsule" onClick={toggleLocale} title="Switch Language">
            <i className="fa fa-globe" />
            <span>{locale === 'hi' ? 'English' : 'हिन्दी'}</span>
            <span className="portal-lang-divider">|</span>
          </button>
        </div>

        {/* Bottom Teal Info Strip */}
        <div className="portal-loginas-strip">
          <span>Logged In User: {userName}</span>
          <span className="portal-loginas-sep">|</span>
          <span>System Role: {formattedRole}</span>
        </div>
      </div>

      {/* Bottom Solid Blue Stripe */}
      <div className="portal-header-bottom-stripe" />
    </header>
    <div className="portal-body">
      <aside id="sideNav" className="sidebar" aria-label={`${portalTitle} navigation`}>
        <nav>
          <ul className="nav" id="side-menu">
            {menu.map((item, index) => (
              <li key={item.key || `${item.href}-${index}`}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className={`portal-menu-item${item.children.some(child => location.pathname === child.href) ? ' active-parent' : ''}`}
                      aria-expanded={!!openSubmenus[item.key]}
                      aria-controls={`submenu-${item.key}`}
                      onClick={() => setOpenSubmenus(previous => ({ ...previous, [item.key]: !previous[item.key] }))}
                    >
                      <i className={`fa fa-${item.iconName} fa-fw`} />
                      <span>{item.label}</span>
                      <i className={`fa fa-angle-${openSubmenus[item.key] ? 'down' : 'left'} portal-chevron`} />
                    </button>
                    {openSubmenus[item.key] && (
                      <ul className="nav nav-second-level" id={`submenu-${item.key}`}>
                        {item.children.map(child => {
                          const isChildActive = location.pathname === child.href
                          return (
                            <li key={child.label}>
                              <Link
                                to={child.href}
                                className={isChildActive ? 'active' : ''}
                                aria-current={isChildActive ? 'page' : undefined}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    className={({ isActive }) => `portal-menu-item${isActive && location.pathname === item.href ? ' active' : ''}`}
                    to={item.href}
                    end
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.iconName ? <i className={`fa fa-${item.iconName} fa-fw`} /> : <span className="portal-menu-icon">{item.icon}</span>}
                    <span>{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <button
        id="sidebarToggle"
        type="button"
        aria-label={sidebarHidden ? 'Show navigation' : 'Hide navigation'}
        aria-expanded={!sidebarHidden}
        title={sidebarHidden ? 'Expand Sidebar' : 'Collapse Sidebar'}
        onClick={() => setSidebarHidden(!sidebarHidden)}
      >
        <i className={`fa fa-angle-double-${sidebarHidden ? 'right' : 'left'}`} />
      </button>
      <main id="page-wrapper" className={location.pathname.includes('land-allotment') || location.pathname.includes('profile') || location.pathname.includes('password') ? 'formstyle1' : 'portal-content'}>
        <Outlet />
        <footer id="footer">
          <p>Copyright &copy; {copyrightYear}. Govt. of Madhya Pradesh. Department of Micro, Small &amp; Medium Enterprises. All Rights Reserved.<br />Design &amp; Developed by <a href="https://mapit.gov.in/" target="_blank" rel="noreferrer">Centre of Excellence (CoE), MAP_IT</a>.</p>
        </footer>
      </main>
    </div>
    <ConfirmDialog isOpen={showLogoutConfirm} title="Confirm Logout" message="Are you sure you want to end your current MPMSME session?" confirmLabel="Logout" cancelLabel="Stay Logged In" isDestructive isLoading={isLoggingOut} onConfirm={handleLogoutConfirm} onCancel={() => setShowLogoutConfirm(false)} />
    <SessionTimeoutModal isOpen={isWarning} countdownSeconds={countdown} onStayLoggedIn={stayLoggedIn} onLogoutNow={logoutNow} />
  </div>
}
