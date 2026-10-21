import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dticLink, dticRequest } from './dticService'
import { dashboardCount, decisions, workQueues } from './dashboardModel'
import './dtic-dashboard.css'

const format = value => value === null ? 'Unavailable' : value.toLocaleString('en-IN')

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
  const value = (number, pending) => pending ? 'Loading…' : format(number)

  return <div className="dtic-dashboard">
    <header className="dtic-dash-heading">
      <div><p className="dtic-dash-eyebrow">DISTRICT TRADE & INDUSTRIES CENTRE</p><h1>DTIC dashboard</h1><p>Your district’s applications, review queues and decisions.</p></div>
      <button type="button" className="dtic-dash-refresh" disabled={loading} onClick={() => setAttempt(n => n + 1)}>{loading ? 'Refreshing…' : '↻ Refresh counts'}</button>
    </header>

    <div className="dtic-dash-status" role="status">
      <span className={`dtic-dash-dot${summary.error || msme.error ? ' is-error' : ''}`} />
      {loading ? 'Loading current counts…' : summary.error || msme.error ? 'Some counts could not be loaded. Refresh to try again.' : missing || msmeCount === null ? 'Some counts were not supplied by the server.' : 'Counts loaded from your district records.'}
      {summary.updated && !loading && <time dateTime={summary.updated.toISOString()}>Fetched at {summary.updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>}
    </div>

    <section className="dtic-dash-overview" aria-label="Application overview">
      <div className="dtic-dash-total"><p className="dtic-dash-eyebrow">SELF EMPLOYMENT</p><h2>Every application.<br />A clearer overview.</h2><p>Track incoming requests and follow decisions across DTIC, DTFC and banks.</p><Link to={dticLink('viewtotalapplications')}>View all applications <span aria-hidden="true">↗</span></Link></div>
      <div className="dtic-dash-stat"><span>Total applications received</span><strong>{value(total, summary.loading)}</strong><small>Self employment applications</small></div>
      <div className="dtic-dash-stat dtic-dash-msme"><span>MSME applications</span><strong>{value(msmeCount, msme.loading)}</strong><Link to={dticLink('viewapplicationlist')}>Open MSME register <span aria-hidden="true">→</span></Link></div>
    </section>

    <div className="dtic-dash-columns">
      <section className="dtic-dash-work" aria-labelledby="dtic-work-title">
        <div className="dtic-dash-section-heading"><p className="dtic-dash-eyebrow">WORK QUEUES</p><h2 id="dtic-work-title">Where attention is needed</h2><p>Open a queue to review its applications.</p></div>
        <div className="dtic-dash-queues">{workQueues.map(queue => {
          const number = count(queue.key)
          return <Link key={queue.key} to={dticLink(queue.path)} className={`dtic-dash-queue tone-${queue.tone}`}>
            <span className="dtic-dash-queue-icon" aria-hidden="true">{queue.tone === 'blue' ? '↓' : queue.tone === 'teal' ? '↻' : '↗'}</span>
            <span className="dtic-dash-queue-body"><span className="dtic-dash-queue-label">{queue.label}</span><small>{queue.detail}</small><span className="dtic-dash-track" aria-hidden="true"><span style={{ width: `${number !== null && largestQueue ? number / largestQueue * 100 : 0}%` }} /></span></span>
            <strong>{value(number, summary.loading)}</strong><span aria-hidden="true">→</span>
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
