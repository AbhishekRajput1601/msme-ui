import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DticTable from './DticTable'
import { dticRequest } from './dticService'
import tables from './generated/tables.json'
import { applicationDistrictKey, filterFaApplications, groupApplicationsByDistrict, groupApplicationsByStatus, loadFaStatusApplications } from './faStatusModel'
import Spinner from '../../components/loaders/Spinner'
import './fa-status-applications.css'
import './dtic-refresh.css'

export default function FaStatusApplications({ name, node, state, request = dticRequest, groupBy = 'status' }) {
  const land = name === 'dtic/dticVacantLandList'
  const district = groupBy === 'district'
  const recordLabel = land ? 'plots / sheds' : 'applications'
  const [params, setParams] = useSearchParams()
  const selected = params.get(groupBy)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ loading: true, rows: [] })
  useEffect(() => {
    const abort = new AbortController()
    setResult({ loading: true, rows: [] })
    loadFaStatusApplications(request, (state.tableBundle || tables)[name], abort.signal, {
      idField: land ? 'vacantLandId' : district ? 'id' : 'applicationId', params: state.tableParams?.() || {},
    })
      .then(rows => { if (!abort.signal.aborted) setResult({ rows: land ? rows.map(row => ({ ...row, currentStatusId: undefined, status: row.hoStatus || 'Status unavailable' })) : rows }) })
      .catch(error => { if (!abort.signal.aborted) setResult({ rows: [], error: error.message }) })
    return () => abort.abort()
  }, [name, attempt, state.listVersion, request, district])

  const statusGroups = (district ? groupApplicationsByDistrict(result.rows) : groupApplicationsByStatus(result.rows))
    .filter(group => group.label !== 'Status unavailable' && group.label !== 'District unavailable')
  const groups = [{ key: 'all', label: `All ${recordLabel}`, count: result.rows.length }, ...statusGroups]
  const effectiveSelected = groups.some(group => group.key === selected) ? selected : (selected === 'label:Status unavailable' || selected === 'Status unavailable' ? 'all' : selected)
  const active = groups.find(group => group.key === effectiveSelected)
  function select(key) {
    const next = new URLSearchParams(params)
    next.set(groupBy, key)
    setParams(next)
    for (const id of [...(state.IdList || [])]) state.selectApplication?.(id, false)
  }
  return <section className="fa-status-applications" aria-label={district ? 'Infrastructure applications by district' : land ? 'Plots and sheds by status' : 'MSME applications by status'}>
    <div className="fa-status-heading"><div><h2>{district ? 'Applications by district' : land ? 'Plots / Sheds by status' : 'Applications by status'}</h2><p>Select a {groupBy} to view its {recordLabel}.</p></div><button type="button" className="dtic-refresh" disabled={result.loading} onClick={() => setAttempt(value => value + 1)}>Refresh</button></div>
    {result.loading ? <Spinner /> : result.error ? <div className="alert alert-danger" role="alert">{result.error} <button type="button" className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : <>
      <div className="fa-status-grid">{groups.map(group => <button type="button" key={group.key} className="fa-status-card" aria-pressed={effectiveSelected === group.key} onClick={() => select(group.key)}><span>{group.label}</span><strong>{group.count.toLocaleString('en-IN')}</strong><small>View {recordLabel} →</small></button>)}</div>
      {!result.rows.length && <p role="status">No {recordLabel} available.</p>}
      {effectiveSelected && <><h3>{active?.label || (district ? 'District unavailable' : 'Status unavailable')}</h3><DticTable key={`${effectiveSelected}-${attempt}`} name={name} node={node} state={state} records={district ? result.rows.filter(row => effectiveSelected === 'all' || applicationDistrictKey(row) === effectiveSelected) : filterFaApplications(result.rows, effectiveSelected)} /></>}
    </>}
  </section>
}
