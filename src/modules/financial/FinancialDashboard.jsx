import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { financialLink, financialRequest } from './financialService'
import { financialDashboardItems, loadFinancialCount } from './financialDashboardModel'
import Spinner from '../../components/loaders/Spinner'
import '../dtic/dtic-dashboard.css'
import '../dtic/dtic-refresh.css'
import './financial-dashboard.css'

const dashboardItems = financialDashboardItems.filter(item => item.kind !== 'report')
const cardDetails = {
  dticfapendingapplicantsunit: { label: 'Financial Assistance — MSME Units', detail: 'Applications in the Industrial Unit list', action: 'Review MSME Units' },
  faDisbursementUnit_new: { label: 'Disbursement Calculator', detail: 'Records available for disbursement processing', action: 'Open disbursement calculator' },
  infradevelopmetList: { label: 'Infrastructure Development Permission', detail: 'Applications for infrastructure development', action: 'Review applications' },
}

function ArrowIcon() {
  return <svg className="dtic-dash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
}

export default function FinancialDashboard() {
  const [result, setResult] = useState({ loading: true, counts: {} })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const abort = new AbortController()
    async function load() {
      const outcomes = await Promise.allSettled(dashboardItems.map(async item => [
        item.path, await loadFinancialCount(item, financialRequest, abort.signal),
      ]))
      if (!abort.signal.aborted) setResult({
        loading: false,
        counts: Object.fromEntries(outcomes.filter(outcome => outcome.status === 'fulfilled').map(outcome => outcome.value)),
        error: outcomes.some(outcome => outcome.status === 'rejected'),
        updated: outcomes.some(outcome => outcome.status === 'fulfilled') ? new Date() : null,
      })
    }
    load()
    return () => abort.abort()
  }, [attempt])

  function refresh() {
    setResult({ loading: true, counts: {} })
    setAttempt(value => value + 1)
  }

  return <div className="dtic-dashboard financial-role-dashboard">
    <header className="dtic-dash-heading">
      <div>
        <p className="dtic-dash-eyebrow">DEPARTMENT OF MSME · FINANCIAL ASSISTANCE</p>
        <h1>Financial Assistance dashboard</h1>
        <p>Review industrial applications, process disbursements, and track infrastructure permissions.</p>
      </div>
      <button type="button" className="dtic-dash-refresh" disabled={result.loading} onClick={refresh}>{result.loading ? 'Refreshing…' : '↻ Refresh counts'}</button>
    </header>
    <div className="dtic-dash-status" role="status">
      <span className={`dtic-dash-dot${result.error ? ' is-error' : ''}`} />
      {result.loading ? <><Spinner size="xs" inline /> Loading application counts…</> : result.error ? 'Some counts could not be loaded. Refresh to try again.' : 'Counts loaded from the linked application lists.'}
      {result.updated && !result.loading && <time dateTime={result.updated.toISOString()}>Fetched at {result.updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>}
    </div>
    <section className="dtic-dash-overview" aria-label="Financial Assistance application overview">
      {dashboardItems.map((item, index) => {
        const card = cardDetails[item.path]
        const count = result.counts[item.path]
        const target = financialLink(item.path) + (item.path === 'dticfapendingapplicantsunit' ? '?view=statuses' : '')
        return <Link className={`dtic-dash-stat dtic-dash-card-link${index === 0 ? ' dtic-dash-msme' : ''}`} to={target} key={item.path}>
          <span>{card.label}</span>
          <strong>{result.loading ? <Spinner size="xs" inline /> : count == null ? 'Unavailable' : count.toLocaleString('en-IN')}</strong>
          <small>{card.detail}</small>
          <span className="dtic-dash-card-action">{card.action}<ArrowIcon /></span>
        </Link>
      })}
    </section>
  </div>
}
