import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Spinner from '../../components/loaders/Spinner'
import { fetchProcessed } from './collectorService'
import { filterFaApplications, groupApplicationsByStatus } from '../dtic/faStatusModel'
import '../dtic/fa-status-applications.css'
import '../dtic/dtic-refresh.css'

const statuses = [
  { key: 'id:6', label: 'Approved' },
  { key: 'id:7', label: 'Rejected' },
  { key: 'id:5', label: 'Queried' },
  { key: 'id:8', label: 'Pending' },
]

export default function CollectorProcessedApplications({ state }) {
  const [params, setParams] = useSearchParams()
  const selected = params.get('status')
  const [attempt, setAttempt] = useState(0)
  const [search, setSearch] = useState('')
  const [result, setResult] = useState({ loading: true, rows: [] })

  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true, rows: [] })
    fetchProcessed('', controller.signal)
      .then(rows => {
        if (!controller.signal.aborted) setResult({ rows })
      })
      .catch(error => {
        if (!controller.signal.aborted) setResult({ rows: [], error: error.message || 'Unable to load processed applications.' })
      })
    return () => controller.abort()
  }, [attempt])

  const actual = groupApplicationsByStatus(result.rows)
  const groups = [
    { key: 'all', label: 'All applications', count: result.rows.length },
    ...statuses.map(status => ({ ...status, count: actual.find(group => group.key === status.key)?.count || 0 })),
    ...actual.filter(group => !statuses.some(status => status.key === group.key)),
  ]
  const rows = filterFaApplications(result.rows, selected, search)
  const active = groups.find(group => group.key === selected)

  function select(key) {
    const next = new URLSearchParams(params)
    next.set('status', key)
    setParams(next)
    setSearch('')
  }

  return <section className="fa-status-applications" aria-label="Collector processed applications by status">
    <Link to="/department/collector/dashboard">← Back to dashboard</Link>
    <div className="fa-status-heading">
      <div><h2>Processed applications by status</h2><p>Select a status to view applications in your mapped districts.</p></div>
      <button type="button" className="dtic-refresh" disabled={result.loading} onClick={() => setAttempt(value => value + 1)}>Refresh</button>
    </div>
    {result.loading ? <Spinner /> : result.error ? <div className="alert alert-danger" role="alert">
      {result.error} <button type="button" className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button>
    </div> : <>
      <div className="fa-status-grid">{groups.map(group => <button type="button" key={group.key} className="fa-status-card" aria-pressed={selected === group.key} onClick={() => select(group.key)}>
        <span>{group.label}</span><strong>{group.count.toLocaleString('en-IN')}</strong><small>View applications →</small>
      </button>)}</div>
      {result.rows.length >= 500 && <p role="status">Counts reflect the latest 500 records returned by the server.</p>}
      {!result.rows.length && <p role="status">No processed applications available.</p>}
      {selected && <>
        <h3>{active?.label || 'Status unavailable'}</h3>
        <label htmlFor="collector-processed-search">Search applications</label>
        <input id="collector-processed-search" className="form-control" type="search" placeholder="Application number or unit name" value={search} onChange={event => setSearch(event.target.value)} />
        <p role="status">{rows.length.toLocaleString('en-IN')} matching applications</p>
        <div className="table-responsive"><table className="table table-striped table-bordered table-hover">
          <thead><tr>{['S.No.', 'Application No.', 'Unit / Institution', 'Application Date', 'Status', 'Action'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead>
          <tbody>{rows.map((app, index) => <tr key={app.applicationId}>
            <td>{index + 1}</td><td>{app.applicationId}</td><td>{app.unitOrInstName || '—'}</td><td>{app.applicationDate || '—'}</td><td>{app.status || active?.label || 'Status unavailable'}</td>
            <td>
              <Link to={`/department/collector/fa/viewfaapplicantdetailunitnew/${encodeURIComponent(app.applicationId)}`}>View/Print</Link>{' | '}
              <button type="button" className="btn btn-link btn-xs" onClick={() => state.viewProgress(app)}>Progress Details</button>{' | '}
              <button type="button" className="btn btn-link btn-xs" onClick={() => state.downloadCollectorSignedDoc(app.applicationId)}>Download Collector Signed Doc</button>
            </td>
          </tr>)}{!rows.length && <tr><td colSpan={6} className="text-center">No applications match this status or search.</td></tr>}</tbody>
        </table></div>
      </>}
    </>}
  </section>
}
