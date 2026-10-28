import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AdminPage from './AdminPage'
import { adminLink, adminRequest } from './adminService'
import tables from './generated/tables.json'
import { dticTableParams } from '../dtic/dticTableParams'
import { dashboardListCount } from '../dtic/dashboardModel'
import Spinner from '../../components/loaders/Spinner'
import '../dtic/dtic-dashboard.css'
import '../dtic/dtic-refresh.css'
import './admin-dashboard.css'

const cards = [
  { path: 'officerList', label: "Section's officers", detail: 'Manage department officers', icon: 'users' },
  { path: 'applicantList', label: 'Applicants', detail: 'View registered applicants', icon: 'user' },
  { path: 'dticList', label: 'DTIC users', detail: 'Manage district office users', icon: 'building' },
  { path: 'officeList', label: 'Offices', detail: 'View and manage office records', icon: 'building' },
  { path: 'supplierNameListAdmin', label: 'Suppliers', detail: 'Manage oxygen suppliers', icon: 'truck' },
  { path: 'supplyNameList', view: 'supplyNameListAdm', label: 'Facilities', detail: 'Manage oxygen supply facilities', icon: 'hospital-o' },
]

const supplyViews = [
  ['dashboard?view=oxygen', 'Oxygen supply overview'],
  ['dashboardFacilityWise', 'Supplier / facility wise'],
  ['dashboardDistrictWise', 'Facility wise'],
  ['dashboardDistrictFacilityType', 'District / facility type wise'],
]

export default function AdminDashboard() {
  const [params] = useSearchParams()
  return params.get('view') === 'oxygen' ? <AdminPage /> : <AdminOverview />
}

function AdminOverview() {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ loading: true, counts: {} })
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true, counts: {} })
    async function load() {
      const outcomes = await Promise.allSettled(cards.map(async card => {
        const config = tables['admuser/' + (card.view || card.path)]
        const data = await adminRequest('get', config.endpoint, dticTableParams(config, { length: 1 }), controller.signal)
        return [card.path, dashboardListCount(data)]
      }))
      if (controller.signal.aborted) return
      const successes = outcomes.filter(outcome => outcome.status === 'fulfilled')
      setResult({ loading: false, counts: Object.fromEntries(successes.map(outcome => outcome.value)), updated: successes.length ? new Date() : null })
    }
    load()
    return () => controller.abort()
  }, [attempt])

  return (
    <div className="dtic-dashboard admin-dashboard">
      <header className="dtic-dash-heading">
        <div>
          <p className="dtic-dash-eyebrow">SYSTEM ADMINISTRATION</p>
          <h1>Admin dashboard</h1>
          <p>Manage users, offices, suppliers and facilities.</p>
        </div>
        <button className="dtic-dash-refresh" type="button" disabled={result.loading} onClick={() => setAttempt(value => value + 1)}>
          <i className="fa fa-refresh" aria-hidden="true" /> {result.loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>
      <div className="dtic-dash-status" role="status">
        <span className="dtic-dash-dot" />
        {result.loading ? 'Loading overview…' : 'Administration overview'}
        {result.updated && <time dateTime={result.updated.toISOString()}>Updated at {result.updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</time>}
      </div>
      <section className="dtic-dash-overview" aria-label="Administration overview" aria-busy={result.loading}>
        {cards.map((card, index) => (
          <Link key={card.path} className={`dtic-dash-stat dtic-dash-card-link${index % 2 === 0 ? ' dtic-dash-msme' : ''}`} to={adminLink(card.path)}>
            <span><i className={`fa fa-${card.icon} admin-dashboard-icon`} aria-hidden="true" />{card.label}</span>
            <strong>{result.loading ? <Spinner size="xs" inline /> : result.counts[card.path]?.toLocaleString('en-IN') ?? 'Unavailable'}</strong>
            <small>{card.detail}</small>
            <span className="dtic-dash-card-action">View list <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </section>
      <section className="admin-dashboard-supply" aria-labelledby="admin-supply-title">
        <h2 id="admin-supply-title">Oxygen supply</h2>
        <p>Open supply summaries by supplier, facility or district.</p>
        <div className="admin-dashboard-links">
          {supplyViews.map(([path, label]) => <Link key={path} to={adminLink(path)}>{label}<span aria-hidden="true"> →</span></Link>)}
        </div>
      </section>
    </div>
  )
}
