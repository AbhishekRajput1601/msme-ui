import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchDashboardCounts } from '../../services/shellService'
import { financialLink } from './financialService'
import { dashboardCount } from '../dtic/dashboardModel'
import Spinner from '../../components/loaders/Spinner'
import '../dtic/dtic-dashboard.css'
import './financial-dashboard.css'

const stages = [
  { key: 'totalSubmitDTIC', label: 'Applications submitted', description: 'Submitted to DTIC', status: '2', tone: 'blue' },
  { key: 'totalDALC', label: 'Sanction orders released', description: 'Applications with a released sanction order', status: '9', tone: 'teal' },
  { key: 'totalDisbursLetter', label: 'Disbursement letters released', description: 'Applications with a released disbursement letter', status: '10', tone: 'amber' },
]
const reports = [
  ['District wise assistance', 'Compare financial assistance across districts.', 'districtWiseReport'],
  ['Scheme wise assistance', 'Review applications across assistance schemes.', 'schemeWiseReport'],
  ['Sanctioned vs disbursement', 'Review sanctioned and disbursed assistance.', 'SanctionedVsDisbursement'],
  ['District wise MSME details', 'Explore district MSME records.', 'districtWiseMsmeDetailsReport'],
]
const details = status => financialLink('detailList' + (status ? '?status=' + status : ''))
const format = count => count === null ? 'Unavailable' : count.toLocaleString('en-IN')

export default function FinancialDashboard() {
  const [result, setResult] = useState({ loading: true })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setResult({ loading: true })
    fetchDashboardCounts().then(data => {
      if (active) setResult({ data, updated: new Date() })
    }).catch(() => {
      if (active) setResult({ error: 'Financial assistance counts could not be loaded. Please refresh to try again.' })
    })
    return () => { active = false }
  }, [attempt])
  const count = key => dashboardCount(result.data?.[key])
  const total = count('totalApp')
  const largest = Math.max(0, ...stages.map(stage => count(stage.key) ?? 0))
  const missing = !result.loading && !result.error && ['totalApp', ...stages.map(stage => stage.key)].some(key => count(key) === null)
  const display = number => result.loading ? <Spinner size="xs" inline /> : format(number)

  return <div className="dtic-dashboard fa-dashboard">
    <header className="dtic-dash-heading">
      <div><p className="dtic-dash-eyebrow">FINANCIAL ASSISTANCE / OFFICER WORKSPACE</p><h1>Financial assistance dashboard</h1><p>Review applications, sanction orders and disbursement letters.</p></div>
      <button type="button" className="dtic-dash-refresh" disabled={result.loading} onClick={() => setAttempt(n => n + 1)}>{result.loading ? 'Refreshing...' : 'Refresh counts'}</button>
    </header>
    <div className="dtic-dash-status" role="status"><span className={`dtic-dash-dot${result.error || missing ? ' is-error' : ''}`} />
      {result.loading ? 'Loading financial assistance records...' : result.error || (missing ? 'Some counts are unavailable from the server.' : 'Counts loaded from financial assistance records.')}
      {result.updated && <time dateTime={result.updated.toISOString()}>Fetched at {result.updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>}
    </div>

    <section className="fa-dash-summary" aria-label="Application summary">
      <div className="fa-dash-total"><p className="dtic-dash-eyebrow">APPLICATION OVERVIEW</p><span>Total applications</span><strong>{display(total)}</strong><p>Industrial units and institutions</p><Link to={details()}>View all applications <span aria-hidden="true">&rarr;</span></Link></div>
      <div className="fa-dash-milestones">{stages.map(stage => <Link key={stage.key} className={`fa-dash-milestone tone-${stage.tone}`} to={details(stage.status)}><span className="fa-dash-marker" aria-hidden="true" /><span>{stage.label}</span><strong>{display(count(stage.key))}</strong><small>View records <span aria-hidden="true">&rarr;</span></small></Link>)}</div>
    </section>

    <div className="dtic-dash-columns">
      <section className="dtic-dash-work" aria-labelledby="fa-status-title"><div className="dtic-dash-section-heading"><p className="dtic-dash-eyebrow">APPLICATION STATUS</p><h2 id="fa-status-title">From submission to release</h2><p>Explore the records in each reported status.</p></div>
        <div className="dtic-dash-queues">{stages.map(stage => <Link key={stage.key} to={details(stage.status)} className={`dtic-dash-queue tone-${stage.tone}`}><span className="dtic-dash-queue-body"><span className="dtic-dash-queue-label">{stage.label}</span><small>{stage.description}</small><span className="dtic-dash-track" aria-hidden="true"><span style={{ width: `${largest && count(stage.key) !== null ? count(stage.key) / largest * 100 : 0}%` }} /></span></span><strong>{display(count(stage.key))}</strong><span aria-hidden="true">&rarr;</span></Link>)}</div>
        <p className="dtic-dash-note">Bars compare the reported status counts. They are not completion rates and may not add up to all applications.</p>
      </section>
      <section className="dtic-dash-decisions" aria-labelledby="fa-reports-title"><div className="dtic-dash-section-heading"><p className="dtic-dash-eyebrow">REPORTS & INSIGHTS</p><h2 id="fa-reports-title">See the wider picture</h2><p>Open a report to filter and explore financial assistance.</p></div>
        <div className="fa-dash-reports">{reports.map(([label, description, path]) => <Link key={path} to={financialLink(path)}><span><strong>{label}</strong><small>{description}</small></span><span aria-hidden="true">&rarr;</span></Link>)}</div>
      </section>
    </div>
    <section className="fa-dash-tools" aria-labelledby="fa-tools-title"><div><p className="dtic-dash-eyebrow">QUICK ACCESS</p><h2 id="fa-tools-title">Continue your work</h2></div><nav aria-label="Financial assistance tools"><Link to={financialLink('dticfapendingapplicantsunit')}>Industrial unit applications <span aria-hidden="true">&rarr;</span></Link><Link to={financialLink('faDisbursementUnit_new')}>Disbursement calculator <span aria-hidden="true">&rarr;</span></Link><Link to={financialLink('infradevelopmetList')}>Infrastructure permissions <span aria-hidden="true">&rarr;</span></Link></nav></section>
  </div>
}
