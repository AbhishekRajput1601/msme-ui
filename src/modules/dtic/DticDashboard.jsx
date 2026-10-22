import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dticLink, dticRequest } from './dticService'
import { dashboardListCount, decisions, workQueues, loadLandDashboardCounts } from './dashboardModel'
import tables from './generated/tables.json'
import routes from './dticRoutes'
import { dticTableParams } from './dticTableParams'
import Spinner from '../../components/loaders/Spinner'
import './dtic-dashboard.css'

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
      ['totalApplicationsReceived', 'viewtotalapplications'],
      ['totalMSMEApplications', 'viewapplicationlist'],
      ['financialAssistanceUnits', 'dticfapendingapplicantsunit'],
      ...workQueues.map(queue => [queue.key, queue.path]),
      ...decisions.flatMap(decision => [[decision.accepted, decision.acceptedPath], [decision.rejected, decision.rejectedPath]]),
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
  const total = resolveCount('totalApplicationsReceived')
  const msmeCount = resolveCount('totalMSMEApplications')
  const queueCount = queue => resolveCount(queue.key)
  const largestQueue = Math.max(0, ...workQueues.map(queue => queueCount(queue) ?? 0))
  const loading = result.loading
  const value = (number, pending) => pending ? <Spinner size="xs" inline /> : format(number)

  return (
    <div className="dtic-dashboard">
      <header className="dtic-dash-heading">
        <div>
          <p className="dtic-dash-eyebrow">DISTRICT TRADE & INDUSTRIES CENTRE</p>
          <h1>DTIC dashboard</h1>
          <p>Your district’s applications, review queues and decisions.</p>
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
        <div className="dtic-dash-total">
          <span className="dtic-dash-overview-icon">
            <DashboardIcon kind="building" />
          </span>
          <p className="dtic-dash-eyebrow">DISTRICT OVERVIEW</p>
          <h2>Applications at a glance</h2>
          <p>Self employment, MSME, financial assistance and land allotment records for your district.</p>
        </div>
        <div className="dtic-dash-stat">
          <span>Self employment applications</span>
          <strong>{value(total, loading)}</strong>
          <small>Self employment</small>
          <Link to={dticLink('viewtotalapplications')}>
            View applications <DashboardIcon kind="arrow" />
          </Link>
        </div>
        <div className="dtic-dash-stat dtic-dash-msme">
          <span>MSME register</span>
          <strong>{value(msmeCount, loading)}</strong>
          <small>District MSME register</small>
          <Link to={dticLink('viewapplicationlist')}>
            Open register <DashboardIcon kind="arrow" />
          </Link>
        </div>
        <div className="dtic-dash-stat dtic-dash-msme">
          <span>Financial Assistance — MSME Units</span>
          <strong>{value(resolveCount('financialAssistanceUnits'), loading)}</strong>
          <small>Applications in the MSME Units list</small>
          <Link to={dticLink('dticfapendingapplicantsunit')}>
            Review MSME Units <DashboardIcon kind="arrow" />
          </Link>
        </div>
        <div className="dtic-dash-stat">
          <span>Land Allotment — Plots / Sheds</span>
          <strong>{value(resolveCount('landPlots'), loading)}</strong>
          <small>Records in the land allotment list</small>
          <Link to={dticLink('dticLandAllotment')}>
            Open land allotment <DashboardIcon kind="arrow" />
          </Link>
        </div>
        <div className="dtic-dash-stat">
          <span>Land Allotment — Applications</span>
          <strong>{value(resolveCount('landApplications'), loading)}</strong>
          <small>Applications received across listed plots / sheds. Open a plot's Application List from Land Allotment.</small>
        </div>
      </section>

      <div className="dtic-dash-columns">
        <section className="dtic-dash-work" aria-labelledby="dtic-work-title">
          <div className="dtic-dash-section-heading">
            <p className="dtic-dash-eyebrow">SELF EMPLOYMENT WORK QUEUES</p>
            <h2 id="dtic-work-title">Where attention is needed</h2>
            <p>Open a queue to review its applications.</p>
          </div>
          <div className="dtic-dash-queues">
            {workQueues.map(queue => {
              const number = queueCount(queue)
              return (
                <Link
                  key={queue.key}
                  to={dticLink(queue.path)}
                  className={`dtic-dash-queue tone-${queue.tone}`}
                >
                  <span className="dtic-dash-queue-icon">
                    <DashboardIcon kind={queue.tone === 'teal' ? 'refresh' : 'document'} />
                  </span>
                  <span className="dtic-dash-queue-body">
                    <span className="dtic-dash-queue-label">{queue.label}</span>
                    <small>{queue.detail}</small>
                    <span className="dtic-dash-track" aria-hidden="true">
                      <span
                        style={{
                          width: `${number !== null && largestQueue ? (number / largestQueue) * 100 : 0}%`,
                        }}
                      />
                    </span>
                  </span>
                  <strong>{value(number, loading)}</strong>
                  <DashboardIcon kind="arrow" />
                </Link>
              )
            })}
          </div>
          <p className="dtic-dash-note">Bar lengths compare queue sizes; they do not represent completion rates.</p>
        </section>

        <section className="dtic-dash-decisions" aria-labelledby="dtic-decisions-title">
          <div className="dtic-dash-section-heading">
            <p className="dtic-dash-eyebrow">SELF EMPLOYMENT DECISIONS</p>
            <h2 id="dtic-decisions-title">Across the approval process</h2>
            <p>Accepted and rejected applications by authority.</p>
          </div>
          <div className="dtic-dash-table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Authority</th>
                  <th scope="col">Accepted</th>
                  <th scope="col">Rejected</th>
                </tr>
              </thead>
              <tbody>
                {decisions.map(decision => {
                  const acceptedVal = resolveCount(decision.accepted)
                  const rejectedVal = resolveCount(decision.rejected)
                  return (
                    <tr key={decision.authority}>
                      <th scope="row">{decision.authority}</th>
                      <td>
                        <Link
                          className="dtic-dash-accepted"
                          aria-label={`Accepted by ${decision.authority}: ${loading ? 'Loading' : format(acceptedVal)}`}
                          to={dticLink(decision.acceptedPath)}
                        >
                          {value(acceptedVal, loading)}
                        </Link>
                      </td>
                      <td>
                        <Link
                          className="dtic-dash-rejected"
                          aria-label={`Rejected by ${decision.authority}: ${loading ? 'Loading' : format(rejectedVal)}`}
                          to={dticLink(decision.rejectedPath)}
                        >
                          {value(rejectedVal, loading)}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="dtic-dash-note">Select a count to view the corresponding records.</p>
        </section>
      </div>
    </div>
  )
}
