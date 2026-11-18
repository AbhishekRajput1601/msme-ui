import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import indiaEmblem from '../../../assets/branding/emblem-india.png'

/**
 * PublicPageLayout
 * ─────────────────────────────────────────────────────────────────────────────
 * Professional layout wrapper for public department pages.
 * Provides standard government header banner, breadcrumbs, quick stat pills,
 * and responsive content container.
 */
export default function PublicPageLayout({
  title,
  subtitle,
  category,
  categoryHref,
  badgeText,
  breadcrumbs = [],
  stats = [],
  actions,
  children,
}) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title} | MPMSME`
    return () => { document.title = previous }
  }, [title])
  // Compute default breadcrumbs if not explicitly passed
  const navBreadcrumbs = breadcrumbs.length > 0
    ? breadcrumbs
    : [
        { label: 'Home', href: '/' },
        ...(category ? [{ label: category, href: categoryHref || undefined }] : []),
        { label: title },
      ]

  return (
    <div className="public-portal-page w-full min-h-screen bg-slate-50/60 pb-16">
      {/* ── Official Government Banner & Breadcrumb Header ── */}
      <section className="bg-gradient-to-r from-blue-900 via-sky-800 to-blue-950 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {/* Breadcrumb row */}
          <div className="mb-4">
            <nav aria-label="Breadcrumb" className="text-xs">
              <ol className="flex flex-wrap items-center gap-1.5 text-blue-200">
                {navBreadcrumbs.map((crumb, idx) => {
                  const isLast = idx === navBreadcrumbs.length - 1
                  return (
                    <li key={idx} className="flex items-center gap-1.5">
                      {idx > 0 && <span className="text-blue-300/60 text-xs">»</span>}
                      {crumb.href && !isLast ? (
                        <Link
                          to={crumb.href}
                          className="hover:text-white transition-colors underline-offset-2 hover:underline"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className={`font-semibold ${isLast ? 'text-amber-300' : 'text-blue-100'}`}>
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>
            </nav>
          </div>

          {/* Department Identification & Page Title */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={indiaEmblem}
                alt="Government of Madhya Pradesh"
                className="h-14 w-auto object-contain bg-white/10 p-1.5 rounded-lg border border-white/20 shrink-0 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-200">
                    Government of Madhya Pradesh • Department of MSME
                  </span>
                  {badgeText && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-blue-950 uppercase tracking-wider">
                      {badgeText}
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1 text-sm sm:text-base text-blue-100/90 max-w-3xl leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Header Actions (Print, Download, Direct Apply, etc.) */}
            <div className="flex items-center flex-wrap gap-2 shrink-0 self-start md:self-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
                title="Print this page"
              >
                <i className="fa fa-print" aria-hidden="true" />
                <span>Print</span>
              </button>
              {actions}
            </div>
          </div>

          {/* Quick Metrics / Stats Strip */}
          {stats.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-xs rounded-lg p-3 border border-white/15 transition-all"
                >
                  <div className="text-[11px] font-medium text-blue-200 uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="text-lg sm:text-xl font-black text-white mt-0.5">
                    {stat.value}
                  </div>
                  {stat.caption && (
                    <div className="text-[11px] text-blue-100/70 mt-0.5">
                      {stat.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Main Content Area ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        {children}
      </div>
    </div>
  )
}
