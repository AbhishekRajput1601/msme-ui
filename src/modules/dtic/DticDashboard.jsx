import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dticLink, dticRequest } from './dticService'
import { dashboardCount, decisions, workQueues } from './dashboardModel'
import Spinner from '../../components/loaders/Spinner'
import './dtic-dashboard.css'

const format = value => value === null ? 'Unavailable' : value.toLocaleString('en-IN')

function DashboardIcon({ kind = 'document' }) {
  const paths = {
    document: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M14 2v6h6M8 13h8M8 17h5',
    refresh: 'M20 7v5h-5M4 17v-5h5M6 7a7 7 0 0 1 11-2l3 3M4 16l3 3a7 7 0 0 0 11-2',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    building: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4',
  }
  return <svg className="dtic-dash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[kind]} /></svg>
}

export default function DticDashboard() {
  const [attempt, setAttempt] = useState(0)
  const [summary, setSummary] = useState({ loading: true })
  const [msme, setMsme] = useState({ loading: true })
  useEffect(() => {
    const controller = new AbortController()
    const load = async (endpoint, setter) => {
      setter({ loading: true })
      try {
        const data = await dticRequest('get', endpoint, {}, controller.signal)
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid dashboard response.')
        if (!controller.signal.aborted) setter({ data, updated: new Date() })
      } catch {
        if (!controller.signal.aborted) setter({ error: true })
      }
    }
    load('fetchdticdashboarddata', setSummary)
    load('fetchdticmsmedashboarddata', setMsme)
    return () => controller.abort()
  }, [attempt])

  const count = key => dashboardCount(summary.data?.[key])
  const total = count('totalApplicationsReceived')
  const msmeCount = dashboardCount(msme.data?.totalMSMEApplications)
  const largestQueue = Math.max(0, ...workQueues.map(queue => count(queue.key) ?? 0))
  const loading = summary.loading || msme.loading
  const missing = summary.data && ['totalApplicationsReceived', ...workQueues.map(q => q.key), ...decisions.flatMap(d => [d.accepted, d.rejected])].some(key => count(key) === null)
  const value = (number, pending) => pending ? <Spinner size="xs" inline /> : format(number)

  return <div className="dtic-dashboard">
    <header className="dtic-dash-heading">
      <div><p className="dtic-dash-eyebrow">DISTRICT TRADE & INDUSTRIES CENTRE</p><h1>DTIC dashboard</h1><p>Your district’s applications, review queues and decisions.</p></div>
      <button type="button" className="dtic-dash-refresh" disabled={loading} onClick={() => setAttempt(n => n + 1)}>{loading ? 'Refreshing…' : '↻ Refresh counts'}</button>
    </header>

    <div className="dtic-dash-status" role="status">
      <span className={`dtic-dash-dot${summary.error || msme.error ? ' is-error' : ''}`} />
      {loading ? <Spinner size="xs" inline /> : summary.error || msme.error ? 'Some counts could not be loaded. Refresh to try again.' : missing || msmeCount === null ? 'Some counts were not supplied by the server.' : 'Counts loaded from your district records.'}
      {summary.updated && !loading && <time dateTime={summary.updated.toISOString()}>Fetched at {summary.updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>}
    </div>

    <section className="dtic-dash-overview" aria-label="Application overview">
      <div className="dtic-dash-total"><span className="dtic-dash-overview-icon"><DashboardIcon kind="building" /></span><p className="dtic-dash-eyebrow">DISTRICT OVERVIEW</p><h2>Applications at a glance</h2><p>Self employment and MSME records for your district.</p><a href="#dtic-work-title">Explore work queues <DashboardIcon kind="arrow" /></a></div>
      <div className="dtic-dash-stat"><span>Total applications received</span><strong>{value(total, summary.loading)}</strong><small>Self employment</small><Link to={dticLink('viewtotalapplications')}>View applications <DashboardIcon kind="arrow" /></Link></div>
      <div className="dtic-dash-stat dtic-dash-msme"><span>MSME applications</span><strong>{value(msmeCount, msme.loading)}</strong><small>District MSME register</small><Link to={dticLink('viewapplicationlist')}>Open register <DashboardIcon kind="arrow" /></Link></div>
    </section>

    <div className="dtic-dash-columns">
      <section className="dtic-dash-work" aria-labelledby="dtic-work-title">
        <div className="dtic-dash-section-heading"><p className="dtic-dash-eyebrow">WORK QUEUES</p><h2 id="dtic-work-title">Where attention is needed</h2><p>Open a queue to review its applications.</p></div>
        <div className="dtic-dash-queues">{workQueues.map(queue => {
          const number = count(queue.key)
          return <Link key={queue.key} to={dticLink(queue.path)} className={`dtic-dash-queue tone-${queue.tone}`}>
            <span className="dtic-dash-queue-icon"><DashboardIcon kind={queue.tone === 'teal' ? 'refresh' : 'document'} /></span>
            <span className="dtic-dash-queue-body"><span className="dtic-dash-queue-label">{queue.label}</span><small>{queue.detail}</small><span className="dtic-dash-track" aria-hidden="true"><span style={{ width: `${number !== null && largestQueue ? number / largestQueue * 100 : 0}%` }} /></span></span>
            <strong>{value(number, summary.loading)}</strong><DashboardIcon kind="arrow" />
          </Link>
        })}</div>
        <p className="dtic-dash-note">Bar lengths compare queue sizes; they do not represent completion rates.</p>
      </section>

      <section className="dtic-dash-decisions" aria-labelledby="dtic-decisions-title">
        <div className="dtic-dash-section-heading"><p className="dtic-dash-eyebrow">DECISION OVERVIEW</p><h2 id="dtic-decisions-title">Across the approval process</h2><p>Accepted and rejected applications by authority.</p></div>
        <div className="dtic-dash-table-wrap"><table><thead><tr><th scope="col">Authority</th><th scope="col">Accepted</th><th scope="col">Rejected</th></tr></thead><tbody>{decisions.map(decision => <tr key={decision.authority}><th scope="row">{decision.authority}</th><td><Link className="dtic-dash-accepted" aria-label={`Accepted by ${decision.authority}: ${value(count(decision.accepted), summary.loading)}`} to={dticLink(decision.acceptedPath)}>{value(count(decision.accepted), summary.loading)}</Link></td><td><Link className="dtic-dash-rejected" aria-label={`Rejected by ${decision.authority}: ${value(count(decision.rejected), summary.loading)}`} to={dticLink(decision.rejectedPath)}>{value(count(decision.rejected), summary.loading)}</Link></td></tr>)}</tbody></table></div>
        <p className="dtic-dash-note">Select a count to view the corresponding records.</p>
      </section>
    </div>
  </div>
}
