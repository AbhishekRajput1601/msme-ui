import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { financialLink, financialRequest } from './financialService'
import { financialDashboardItems, loadFinancialCount } from './financialDashboardModel'
import Spinner from '../../components/loaders/Spinner'
import './financial-dashboard.css'

export default function FinancialDashboard() {
  const [counts, setCounts] = useState({})
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const abort = new AbortController()
    setCounts({})
    financialDashboardItems.forEach(item => {
      loadFinancialCount(item, financialRequest, abort.signal).then(count => {
        if (!abort.signal.aborted) setCounts(previous => ({ ...previous, [item.path]: { count } }))
      }).catch(() => {
        if (!abort.signal.aborted) setCounts(previous => ({ ...previous, [item.path]: { error: true } }))
      })
    })
    return () => abort.abort()
  }, [attempt])
  const loading = financialDashboardItems.some(item => !counts[item.path])
  const failed = Object.values(counts).some(result => result.error)
  return <div className="fa-dashboard">
    <header className="fa-dashboard-heading">
      <h1>Financial assistance dashboard</h1>
      <button type="button" disabled={loading} onClick={() => setAttempt(value => value + 1)}>{loading ? 'Loading...' : 'Refresh counts'}</button>
    </header>
    {failed && <p role="status" className="fa-dashboard-error">Some counts could not be loaded. Refresh to try again.</p>}
    {['Financial Assistance', 'Report'].map((group, index) => <section key={group} className="fa-dashboard-section" aria-labelledby={`fa-group-${index}`}>
      <h2 id={`fa-group-${index}`}>{group}</h2>
      <div className="fa-dashboard-grid">
        {financialDashboardItems.slice(index === 0 ? 0 : 3, index === 0 ? 3 : 7).map(item => {
          const result = counts[item.path]
          return <Link className="fa-dashboard-count" to={financialLink(item.path)} key={item.path}>
            <h3>{item.label}</h3>
            <strong>{!result ? <Spinner size="xs" inline /> : result.error ? 'Unavailable' : result.count.toLocaleString('en-IN')}</strong>
            <span>{item.unit}<span aria-hidden="true">&rarr;</span></span>
          </Link>
        })}
      </div>
    </section>)}
  </div>
}
