import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTranslation } from '../hooks/useTranslation'
import { getDefaultRouteForRoles } from '../routes/roleRoutes'
import { ASSETS, backendLink, useLegacyWebsite } from '../modules/public/legacyWebsite'

export default function PublicLayout() {
  const { authenticated, roles } = useAuth()
  const { locale, toggleLocale } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [fontSize, setFontSize] = useState(1)
  const [contrast, setContrast] = useState(false)
  const website = useLegacyWebsite(locale)
  const hindi = locale === 'hi'
  const pathname = useLocation().pathname
  const isAuthPage = ['/login', '/forgot-password', '/forgot-username', '/website/viewforgotpassword', '/website/viewforgotusername'].includes(pathname)

  return (
    <div className={`legacy-public${isAuthPage ? ' login-layout' : ''}${contrast ? ' high-contrast' : ''}`} style={{ '--font-scale': fontSize }}>
      {/* ── Fixed Side Diary / Calendar 2026 Tab ── */}
      <a
        href="https://diary.mp.gov.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="side-diary-tab"
        title="Diary/Calendar 2026"
        aria-label="Open Diary/Calendar 2026 in a new tab"
      >
        <span className="side-diary-tab__label">
          <i className="fa fa-book" aria-hidden="true" />
          DIARY/CALENDAR 2026
        </span>
        <span className="side-diary-tab__card">
          <img src="/img/mp-diary-calendar-2026.png" alt="Diary/Calendar 2026" />
        </span>
      </a>

      <header className="header-new-section">
        {/* ── 1. Top Accessibility & Search Bar ── */}
        <div className="topbar">
          <div className="public-toolbar">
            <div className="toolbar-left-group">
              <div className="font-selection" aria-label="Text size">
                <button onClick={() => setFontSize(0.9)} aria-label="Decrease font size">A-</button>
                <button onClick={() => setFontSize(1)} aria-label="Reset font size">A</button>
                <button onClick={() => setFontSize(1.15)} aria-label="Increase font size">A+</button>
              </div>
              <div className="theme">
                <button className="theme-black" onClick={() => setContrast(true)} aria-label="High contrast theme">A</button>
                <button className="theme-regular" onClick={() => setContrast(false)} aria-label="Default theme">A</button>
              </div>
            </div>

            <div className="toolbar-right-group">
              <div className="toolbar-links">
                <Link to="/website/screen-reader">{hindi ? 'स्क्रीन रीडर' : 'SCREEN READER'}</Link>
                <a href="#main-content">{hindi ? 'मुख्य विषयवस्तु पर जाएं' : 'SKIP TO MAIN CONTENT'}</a>
                <a href="#skip_navigation">{hindi ? 'नेविगेशन पर जाएं' : 'SKIP TO NAVIGATION'}</a>
                <button onClick={toggleLocale} style={{ textTransform: 'none' }}>
                  <i className="fa fa-globe" aria-hidden="true" /> {hindi ? 'English' : 'हिंदी'}
                </button>
              </div>

              <form className="public-search" action={backendLink('/website/search')} method="get" role="search">
                <input
                  name="searchparam"
                  type="search"
                  className="form-control"
                  placeholder={hindi ? 'खोजें...' : 'Search ...'}
                  aria-label="Search website"
                  required
                />
                <button className="btn" aria-label="Search">
                  <i className="fa fa-search" aria-hidden="true" />
                </button>
              </form>

              <a href={backendLink('/advanceSearch/home#advanceSearchLanding')} className="a_search btn">
                {hindi ? 'उन्नत खोज' : 'ADVANCE SEARCH'}
              </a>
              <Link className="btn_login btn" to={authenticated ? getDefaultRouteForRoles(roles) : '/login'}>
                {authenticated ? 'DASHBOARD' : hindi ? 'लॉगिन' : 'LOGIN'}
              </Link>
            </div>
          </div>
        </div>

        {/* ── 2. Middle Header (Logo & Department Title) ── */}
        <div className="middle-header">
          <div className="public-brand-row">
            <Link className="logo-brand-wrap" to="/">
              <img
                src="/img/emblem-india.png"
                alt="State Emblem of India"
                className="mp-emblem-img"
              />
              <div className="logo-title">
                <h5>{website.governmentName || (hindi ? 'मध्यप्रदेश शासन' : 'Government of Madhya Pradesh')}</h5>
                <h1>{website.departmentName || (hindi ? 'सूक्ष्म, लघु और मध्यम उद्यम विभाग' : 'Department of Micro, Small & Medium Enterprises')}</h1>
                <p>{hindi ? '(उद्योग संचालनालय, मध्यप्रदेश)' : '(Directorate of Industries, M.P.)'}</p>
              </div>
            </Link>
            <div className="header-right-actions">
              <button
                className="header-print-btn"
                onClick={() => window.print()}
                title="Print this page"
                aria-label="Print"
              >
                <i className="fa fa-print" aria-hidden="true" />
              </button>
              <div className="header-msme-badge">
                <img
                  src="/img/msme-tree-logo.png"
                  alt="MSME Logo"
                  className="header-msme-img"
                  onError={(e) => {
                    e.currentTarget.src = `${ASSETS}/assets_img/MSME_logo.png`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Main Navigation Bar ── */}
        {!isAuthPage && (
          <div className="bottom-header" id="skip_navigation" tabIndex={-1}>
            <div className="main-nav-inner">
              <nav aria-label="Main navigation" style={{ width: '100%' }}>
                <ul className="mainmenu-list">
                  <li className="nav-home nav-active">
                    <NavLink to="/" end onClick={() => setMenuOpen(false)}>
                      {hindi ? 'होम' : 'HOME'}
                    </NavLink>
                  </li>
                  <li>
                    <a href="/#about">
                      {hindi ? 'हमारे बारे में' : 'ABOUT US'} <i className="fa fa-caret-down" />
                    </a>
                  </li>
                  <li>
                    <a href={backendLink('/website/policies')}>
                      {hindi ? 'नीतियां' : 'POLICIES'}
                    </a>
                  </li>
                  <li>
                    <a href={backendLink('/website/schemes')}>
                      {hindi ? 'योजनाएं' : 'SCHEMES'} <i className="fa fa-caret-down" />
                    </a>
                  </li>
                  <li>
                    <a href="#services">
                      {hindi ? 'ऑनलाइन सेवाएं' : 'ONLINE SERVICES'} <i className="fa fa-caret-down" />
                    </a>
                  </li>
                  <li>
                    <a href={backendLink('/website/startup')}>
                      STARTUP <i className="fa fa-caret-down" />
                    </a>
                  </li>
                  <li>
                    <a href={backendLink('/website/infra')}>
                      INFRA & LAND <i className="fa fa-caret-down" />
                    </a>
                  </li>
                  <li>
                    <a href={backendLink('/website/acts')}>
                      ACTS & RULES
                    </a>
                  </li>
                  <li>
                    <a href={backendLink('/website/more')}>
                      MORE <i className="fa fa-caret-down" />
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Page Content ── */}
      <main id="main-content" tabIndex={-1}>
        <Outlet context={website} />
      </main>

      {/* ── 4. Footer Section ── */}
      <footer className="footer-section">
        <div className="footer-top-row">
          <ul className="footer-links-list">
            <li><a href="/">{hindi ? 'संपर्क' : 'Contact'}</a></li>
            <li><a href="/terms">{hindi ? 'नियम और शर्तें' : 'Terms & Conditions'}</a></li>
            <li><a href="/copyright">{hindi ? 'कॉपीराइट नीति' : 'Copyright Policy'}</a></li>
            <li><a href="/privacy">{hindi ? 'गोपनीयता नीति' : 'Privacy Policy'}</a></li>
            <li><a href="/hyperlink">{hindi ? 'हाइपरलिंक नीति' : 'Hyperlink Policy'}</a></li>
            <li><a href="/employee">{hindi ? 'कर्मचारी कॉर्नर' : "Employee's Corner"}</a></li>
          </ul>
          <div className="footer-working-hours">
            <span>{hindi ? 'कार्य समय : 10:00 AM से 06:00 PM' : 'Working Hours : 10:00 AM to 06:00 PM'}</span>
            <span className="cms-badge">CMS</span>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div className="footer-copy">
            <span>{website.updated ? `Last Updated On: ${website.updated}` : 'Last Updated On: 02 September, 2026'}</span>
            <span>{hindi ? 'सामग्री एमपीएमएसएमई द्वारा प्रदान एवं अनुरक्षित' : 'Content Provided and Maintained by MPMSME'}</span>
          </div>
          <div className="footer-right-col">
            <div className="footer-social-icons">
              <a href="https://www.facebook.com/msmedeptmp" className="social-fb" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="fa fa-facebook" />
              </a>
              <a href="https://twitter.com/minmpmsme" className="social-tw" target="_blank" rel="noreferrer" aria-label="Twitter">
                <i className="fa fa-twitter" />
              </a>
              <a href="https://youtube.com" className="social-yt" target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="fa fa-youtube-play" />
              </a>
            </div>
            <div className="footer-dev-text">
              Designed &amp; Developed by <a href="https://mapit.gov.in/" target="_blank" rel="noreferrer">CoE_MAP_IT</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
