import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { financialLink, financialRequest } from './financialService'
import { financialDashboardItems, loadFinancialCount } from './financialDashboardModel'
import Spinner from '../../components/loaders/Spinner'
import './financial-dashboard.css'

const dashboardItems = financialDashboardItems.filter(item => item.kind !== 'report')

export default function FinancialDashboard() {
  const [counts, setCounts] = useState({})
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const abort = new AbortController()
    setCounts({})
    dashboardItems.forEach(item => {
      loadFinancialCount(item, financialRequest, abort.signal).then(count => {
        if (!abort.signal.aborted) setCounts(previous => ({ ...previous, [item.path]: { count } }))
      }).catch(() => {
        if (!abort.signal.aborted) setCounts(previous => ({ ...previous, [item.path]: { error: true } }))
      })
    })
    return () => abort.abort()
  }, [attempt])
  const loading = dashboardItems.some(item => !counts[item.path])
  return <div className="fa-dashboard">
    <header className="fa-dashboard-heading">
      <h1>Financial assistance dashboard</h1>
      <button type="button" disabled={loading} onClick={() => setAttempt(value => value + 1)}>{loading ? 'Loading...' : 'Refresh counts'}</button>
    </header>
    <section className="fa-dashboard-section" aria-labelledby="fa-assistance-title">
      <h2 id="fa-assistance-title">Financial Assistance</h2>
      <div className="fa-dashboard-grid">
        {dashboardItems.map(item => {
          const result = counts[item.path]
          return <Link className="fa-dashboard-count" to={financialLink(item.path)} key={item.path}>
            <h3>{item.label}</h3>
            <strong>{!result ? <Spinner size="xs" inline /> : result.error ? 'Unavailable' : result.count.toLocaleString('en-IN')}</strong>
            <span>{item.unit}<span aria-hidden="true">&rarr;</span></span>
          </Link>
        })}
      </div>
    </section>
  </div>
}
