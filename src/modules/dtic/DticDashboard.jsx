import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dticLink, dticRequest } from './dticService'
import { dashboardListCount, loadLandDashboardCounts } from './dashboardModel'
import tables from './generated/tables.json'
import routes from './dticRoutes'
import { dticTableParams } from './dticTableParams'
import Spinner from '../../components/loaders/Spinner'
import './dtic-dashboard.css'
import './dtic-refresh.css'

const format = value => (value === null || value === undefined) ? 'Unavailable' : value.toLocaleString('en-IN')

function DashboardIcon({ kind = 'document' }) {
  const paths = {
    document: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M14 2v6h6M8 13h8M8 17h5',
    refresh: 'M20 7v5h-5M4 17v-5h5M6 7a7 7 0 0 1 11-2l3 3M4 16l3 3a7 7 0 0 0 11-2',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    building: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4',
  }
  return (
    <svg className="dtic-dash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[kind]} />
    </svg>
  )
}

export default function DticDashboard() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ loading: true, counts: {} })

  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true, counts: {} })
    const metrics = [
      ['financialAssistanceUnits', 'dticfapendingapplicantsunit'],
    ]
    async function loadCounts() {
      const outcomes = await Promise.allSettled([...metrics.map(async ([key, path]) => {
        const route = routes.find(route => route.path === path)
        const config = tables[route?.views.at(-1)]
        if (!config) throw new Error('Application list is unavailable.')
        const data = await dticRequest('get', config.endpoint, dticTableParams(config, { length: 1 }), controller.signal)
        return [[key, dashboardListCount(data)]]
      }), loadLandDashboardCounts(dticRequest, controller.signal)])
      if (!controller.signal.aborted) setResult({
        loading: false,
        counts: Object.fromEntries(outcomes.filter(outcome => outcome.status === 'fulfilled').flatMap(outcome => outcome.value)),
        error: outcomes.some(outcome => outcome.status === 'rejected'),
        updated: outcomes.some(outcome => outcome.status === 'fulfilled') ? new Date() : null,
      })
    }
    loadCounts()
    return () => controller.abort()
  }, [attempt])

  const resolveCount = key => result.counts[key] ?? null
  const loading = result.loading
  const value = (number, pending) => pending ? <Spinner size="xs" inline /> : format(number)

  return (
    <div className="dtic-dashboard">
      <header className="dtic-dash-heading">
        <div>
          <p className="dtic-dash-eyebrow">DISTRICT TRADE & INDUSTRIES CENTRE</p>
          <h1>DTIC dashboard</h1>
          <p>Your district’s financial assistance and land allotment applications.</p>
        </div>
        <button
          type="button"
          className="dtic-dash-refresh"
          disabled={loading}
          onClick={() => setAttempt(n => n + 1)}
        >
          {loading ? 'Refreshing…' : '↻ Refresh counts'}
        </button>
      </header>

      <div className="dtic-dash-status" role="status">
        <span className={`dtic-dash-dot${result.error ? ' is-error' : ''}`} />
        {loading ? (
          <Spinner size="xs" inline />
        ) : result.error ? (
          'Some counts could not be verified. Refresh to try again.'
        ) : (
          'Counts verified against the linked application lists.'
        )}
        {result.updated && !loading && (
          <time dateTime={result.updated.toISOString()}>
            Fetched at {result.updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </time>
        )}
      </div>

      <section className="dtic-dash-overview" aria-label="Application overview">
        <Link className="dtic-dash-stat dtic-dash-msme dtic-dash-card-link" to={dticLink('dticfapendingapplicantsunit') + '?view=statuses'}>
          <span>Financial Assistance — MSME Units</span>
          <strong>{value(resolveCount('financialAssistanceUnits'), loading)}</strong>
          <small>Applications in the MSME Units list</small>
          <span className="dtic-dash-card-action">
            Review MSME Units <DashboardIcon kind="arrow" />
          </span>
        </Link>
        <Link className="dtic-dash-stat dtic-dash-card-link" to={dticLink('dticLandAllotment') + '?view=statuses'}>
          <span>Land Allotment — Plots / Sheds</span>
          <strong>{value(resolveCount('landPlots'), loading)}</strong>
          <small>Records in the land allotment list</small>
          <span className="dtic-dash-card-action">
            Open land allotment <DashboardIcon kind="arrow" />
          </span>
        </Link>
        <Link className="dtic-dash-stat dtic-dash-card-link" to={dticLink('dticLandAllotment') + '?view=applicants'}>
          <span>Land with applicants</span>
          <strong>{value(resolveCount('landWithApplicants'), loading)}</strong>
          <small>Plots and sheds with at least one application</small>
          <span className="dtic-dash-card-action">View land and applicants <DashboardIcon kind="arrow" /></span>
        </Link>
      </section>

    </div>
  )
}
