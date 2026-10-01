import { useState } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../hooks/useTranslation'
import { useSessionTimeout } from '../hooks/useSessionTimeout'
import { getDefaultRouteForRoles } from '../routes/roleRoutes'
import SessionTimeoutModal from '../components/modals/SessionTimeoutModal'
import ConfirmDialog from '../components/modals/ConfirmDialog'

const applicantMenu = [
  { label: 'Dashboard', href: '/applicant/dashboard', iconName: 'dashboard' },
  { key: 'fa', label: 'For Established Units(Financial Assistance)', iconName: 'bar-chart-o', children: [
    { label: 'Industrial Unit', href: '/applicant/financial-assistance' },
    { label: 'Infrastructure Permission', href: '/applicant/financial-assistance' },
    { label: 'Add Unit Details', href: '/applicant/financial-assistance' },
  ] },
  { key: 'land', label: 'Apply for MSME Industrial Land', iconName: 'bar-chart-o', children: [
    { label: 'Developed Land Allotment', href: '/applicant/land-allotment/new' },
    { label: 'Undeveloped Land Allotment', href: '/applicant/land-allotment/explore' },
    { label: 'Applications List', href: '/applicant/land-allotment' },
    { label: 'Annual Payments', href: '/applicant/land-allotment' },
    { label: 'Notice and Appeal', href: '/applicant/land-allotment' },
  ] },
  { label: 'Online NOCs on MPIDC', href: '/applicant/dashboard', iconName: 'dashboard' },
  { label: 'MSME Award', href: '/applicant/dashboard', iconName: 'trophy' },
  { key: 'bank', label: 'Bank Details', iconName: 'bank', children: [
    { label: 'Add Bank Details', href: '/applicant/profile' },
    { label: 'Banks List', href: '/applicant/profile' },
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
  const [openSubmenus, setOpenSubmenus] = useState({ land: location.pathname.includes('land-allotment') })
  const { isWarning, countdown, stayLoggedIn, logoutNow } = useSessionTimeout({ timeoutSeconds: 1800, warningSeconds: 120, enabled: true })
  const primaryRole = roles[0]?.replace('ROLE_', '') || 'APPLICANT'
  const menu = isApplicant ? applicantMenu : sidebarItems

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true)
    try { await logout(); navigate('/login?logout=true') }
    finally { setIsLoggingOut(false); setShowLogoutConfirm(false) }
  }

  return <div className={`legacy-portal${sidebarHidden ? ' sidebar-hidden' : ''}${mobileMenuOpen ? ' mobile-menu-open' : ''}`}>
    <header className="postLoginHeader">
      <div className="portal-brand"><div className="mplogo"><Link to={dashboard}><img src="/legacy/image/indus_logo.png" alt="MP Government Logo" /></Link></div><div className="navbar-brand-text"><div>Govt. of Madhya Pradesh,</div><div>Department of Micro, Small &amp; Medium Enterprises</div><div className="navbar-brand-subtitle">(Directorate of Industries, M.P.)</div></div></div>
      <div className="portal-header-actions"><button className="portal-mobile-toggle" aria-label="Toggle navigation" aria-expanded={mobileMenuOpen} aria-controls="sideNav" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><i className="fa fa-bars" /></button><button className="portal-language" onClick={toggleLocale}>{locale === 'hi' ? 'English' : 'हिन्दी'}</button><div className="portal-user-menu"><button className="portal-user-toggle" aria-label="User menu" aria-expanded={isUserMenuOpen} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}><i className="fa fa-user fa-fw" /> <i className="fa fa-caret-down" /></button>{isUserMenuOpen && <div className="portal-dropdown" onKeyDown={event => { if (event.key === 'Escape') setIsUserMenuOpen(false) }}>
        {isApplicant && <><Link to="/applicant/profile" onClick={() => setIsUserMenuOpen(false)}><i className="fa fa-user fa-fw" /> Update User Profile</Link><Link to="/applicant/profile" onClick={() => setIsUserMenuOpen(false)}><i className="fa fa-user fa-fw" /> Update Ind Profile</Link><Link to="/applicant/change-password" onClick={() => setIsUserMenuOpen(false)}><i className="fa fa-gear fa-fw" /> Change Password</Link></>}
        <button onClick={() => { setIsUserMenuOpen(false); setShowLogoutConfirm(true) }}><i className="fa fa-sign-out fa-fw" /> Logout</button>
      </div>}</div></div>
      <div className="loginas"><strong>Logged In User</strong>: {currentUser?.displayName || currentUser?.username}, <strong>System Role</strong>: {primaryRole}</div>
    </header>
    <div className="portal-body">
      <aside id="sideNav" className="sidebar" aria-label={`${portalTitle} navigation`}>
        <button id="sidebarToggle" aria-label={sidebarHidden ? 'Show navigation' : 'Hide navigation'} aria-expanded={!sidebarHidden} onClick={() => setSidebarHidden(!sidebarHidden)}><i className={`fa fa-angle-double-${sidebarHidden ? 'right' : 'left'}`} /></button>
        <nav><ul className="nav" id="side-menu">{menu.map((item, index) => <li key={item.key || `${item.href}-${index}`}>
          {item.children ? <>
            <button className="portal-menu-item" aria-expanded={!!openSubmenus[item.key]} aria-controls={`submenu-${item.key}`} onClick={() => setOpenSubmenus(previous => ({ ...previous, [item.key]: !previous[item.key] }))}>
              <i className={`fa fa-${item.iconName} fa-fw`} /><span>{item.label}</span><i className={`fa fa-angle-${openSubmenus[item.key] ? 'down' : 'left'} portal-chevron`} />
            </button>
            {openSubmenus[item.key] && <ul className="nav nav-second-level" id={`submenu-${item.key}`}>
              {item.children.map(child => {
                const active = item.children.find(entry => entry.href === location.pathname) === child
                return <li key={child.label}><Link to={child.href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} onClick={() => setMobileMenuOpen(false)}>{child.label}</Link></li>
              })}
            </ul>}
          </> : <NavLink className="portal-menu-item" to={item.href} end onClick={() => setMobileMenuOpen(false)}>{item.iconName ? <i className={`fa fa-${item.iconName} fa-fw`} /> : <span className="portal-menu-icon">{item.icon}</span>}<span>{item.label}</span></NavLink>}
        </li>)}</ul></nav>
      </aside>
      <main id="page-wrapper" className={location.pathname.includes('land-allotment') ? 'formstyle1' : 'portal-content'}><Outlet /></main>
    </div>
    <footer id="footer"><p>Copyright &copy; {copyrightYear}. Govt. of Madhya Pradesh. Department of Micro, Small &amp; Medium Enterprises. All Rights Reserved.<br />Design &amp; Developed by <a href="https://mapit.gov.in/" target="_blank" rel="noreferrer">Centre of Excellence (CoE), MAP_IT</a>.</p></footer>
    <ConfirmDialog isOpen={showLogoutConfirm} title="Confirm Logout" message="Are you sure you want to end your current MPMSME session?" confirmLabel="Logout" cancelLabel="Stay Logged In" isDestructive isLoading={isLoggingOut} onConfirm={handleLogoutConfirm} onCancel={() => setShowLogoutConfirm(false)} />
    <SessionTimeoutModal isOpen={isWarning} countdownSeconds={countdown} onStayLoggedIn={stayLoggedIn} onLogoutNow={logoutNow} />
  </div>
}
