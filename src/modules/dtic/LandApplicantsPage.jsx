import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dticRequest } from './dticService'
import { loadFaStatusApplications } from './faStatusModel'
import { landWithApplicants, landApplicantsPath } from './landApplicantsModel'
import tables from './infrastructure/generated/tables.json'
import Spinner from '../../components/loaders/Spinner'
import './land-applicants.css'
import './dtic-refresh.css'

export default function LandApplicantsPage() {
  const [result, setResult] = useState({ loading: true, rows: [] })
  const [attempt, setAttempt] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  useEffect(() => {
    const abort = new AbortController()
    setResult({ loading: true, rows: [] })
    loadFaStatusApplications(dticRequest, tables['dtic/dticVacantLandList'], abort.signal, { idField: 'vacantLandId', params: { industrialArea: '' } })
      .then(rows => { if (!abort.signal.aborted) setResult({ rows: landWithApplicants(rows) }) })
      .catch(error => { if (!abort.signal.aborted) setResult({ rows: [], error: error.message }) })
    return () => abort.abort()
  }, [attempt])
  const query = search.trim().toLowerCase()
  const rows = result.rows.filter(row => [row.plotNumber, row.industrialAreaName, row.districtName, row.tehsilName, row.plotShed].some(value => String(value ?? '').toLowerCase().includes(query)))
  const start = page * 10
  function refresh() { setPage(0); setAttempt(value => value + 1) }
  return <section className="dtic-land-applicants">
    <Link to="/department/dtic/dashboard">← Back to dashboard</Link>
    <header><div><h1>Land with applicants</h1><p>Plots and sheds with at least one application.</p></div><button type="button" className="dtic-refresh" disabled={result.loading} onClick={refresh}>Refresh</button></header>
    <label>Search land <input type="search" value={search} placeholder="Plot, industrial area or district" onChange={event => { setSearch(event.target.value); setPage(0) }} /></label>
    {result.loading ? <Spinner /> : result.error ? <p className="alert alert-danger" role="alert">{result.error} <button type="button" className="btn btn-default" onClick={refresh}>Retry</button></p> : <>
      <div className="dtic-land-applicants__scroll"><table className="table table-striped table-bordered"><thead><tr>{['Plot / Shed number', 'Industrial area', 'District', 'Type', 'Applicants', 'Action'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>
        {rows.slice(start, start + 10).map(row => { const path = landApplicantsPath(row); return <tr key={row.vacantLandId}><td>{row.plotNumber || '—'}</td><td>{row.industrialAreaName || '—'}</td><td>{row.districtName || '—'}</td><td>{row.plotShed || '—'}</td><td>{Number(row.totalApplicationReceived).toLocaleString('en-IN')}</td><td>{path ? <Link className="dtic-land-applicants__button" to={path} aria-label={`View applicants for ${row.plotNumber || 'land ' + row.vacantLandId}`}>View applicants</Link> : 'Applicant link unavailable'}</td></tr> })}
        {!rows.length && <tr><td colSpan={6}>{query ? 'No matching land found.' : 'No land with applicants found.'}</td></tr>}
      </tbody></table></div>
      <footer><span>Showing {rows.length ? start + 1 : 0}–{Math.min(start + 10, rows.length)} of {rows.length} land records</span><div><button type="button" className="dtic-pagination-button" disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</button> <button type="button" className="dtic-pagination-button" disabled={start + 10 >= rows.length} onClick={() => setPage(value => value + 1)}>Next</button></div></footer>
    </>}
  </section>
}
