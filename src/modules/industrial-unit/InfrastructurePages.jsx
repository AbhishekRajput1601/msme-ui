import { useEffect, useMemo, useReducer, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import http from '../../api/httpClient'
import { useTranslation } from '../../hooks/useTranslation'
import IndustrialView from './IndustrialView'
import translations from './generated/translations.json'
import { businessError } from './viewHelpers'
import './infrastructure.css'

const listPath = '/department/fa/infradevelopmetList'
async function fetchInfrastructure(endpoint, params, signal) {
  const { data } = await http.get('/fa/' + endpoint, { params, signal })
  if (!data || typeof data !== 'object') throw new Error('The server did not return Infrastructure Development data.')
  return businessError(data)
}

export default function InfrastructurePages({ id }) {
  const { locale } = useTranslation()
  const navigate = useNavigate()
  const [, render] = useReducer(n => n + 1, 0)
  const state = useMemo(() => ({
    faData: {}, initialized: new Set(), locale, notify: render, preserveHeading: true,
    reportTitle: 'Infrastructure Development Permission',
    loadInfrastructureById() { },
    goBackToBatch: () => navigate(-1),
    resolveLink: () => listPath,
    documentPath: value => '/mpmsme/fa/' + value,
  }), [id, locale, navigate])
  useEffect(() => {
    if (!id) return
    const abort = new AbortController()
    state.busy = true
    fetchInfrastructure('fetchInfrastructureById', { id }, abort.signal)
      .then(data => { if (!abort.signal.aborted) state.faData = data })
      .catch(error => { if (!abort.signal.aborted) state.error = error.message })
      .finally(() => { if (!abort.signal.aborted) { state.busy = false; render() } })
    return () => abort.abort()
  }, [id, state])
  return <div className="infrastructure-page infrastructure-detail">
    {id ? <>
      {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
      {state.busy && <div role="status">Loading....</div>}
      <IndustrialView name="viewfaInfrastructure" state={state} />
    </> : <InfrastructureList locale={locale} />}
  </div>
}

function InfrastructureList({ locale }) {
  const [data, setData] = useState({ aaData: [], iTotalDisplayRecords: 0, iTotalRecords: 0 })
  const [start, setStart] = useState(0)
  const [length, setLength] = useState(10)
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')
  const t = (key, fallback) => translations[locale]?.[key] || translations.en[key] || fallback
  useEffect(() => {
    const abort = new AbortController()
    setBusy(true); setError('')
    const params = { sEcho: 1, iDisplayStart: start, iDisplayLength: length, sSearch: search, iColumns: 5, iSortingCols: 0, iSortCol_0: 0, sSortDir_0: 'asc' }
      ;['id', 'createdDate', 'applicantName', 'districtName', null].forEach((key, i) => {
        params['mDataProp_' + i] = key ?? ''
        params['bSortable_' + i] = false
        params['bSearchable_' + i] = true
        params['sSearch_' + i] = ''
        params['bRegex_' + i] = false
      })
    fetchInfrastructure('fetchInfrastructureList', params, abort.signal)
      .then(result => { if (!abort.signal.aborted) setData(result) })
      .catch(err => { if (!abort.signal.aborted) setError(err.message) })
      .finally(() => { if (!abort.signal.aborted) setBusy(false) })
    return () => abort.abort()
  }, [start, length, search])
  const count = Number(data.iTotalDisplayRecords || 0)
  const pages = Math.ceil(count / length)
  const current = Math.floor(start / length)
  return <div id="industrial-unit-content">
    <div className="row"><div className="col-md-12"><h1 className="page-header" /></div></div>
    <div className="row"><div className="panel panel-info">
      <div className="panel-heading">{t('application.fa.title', 'Financial Assistance')} &gt; <Link style={{ textDecoration: 'underline', color: '#ffffff', fontWeight: 700 }} to="/department/fa/dticfapendingapplicantsunit">{t('application.fa.industrialUnit', 'Industrial Unit')}</Link></div>
      <div className="panel-body"><div className="row">
        {error && <div className="text-error" style={{ color: 'red' }} role="alert"><strong>Error!</strong><p>{error}</p></div>}
        {busy && <div id="processing-message" role="status">Processing...</div>}
        <div className="res_div">
          <div className="infrastructure-table-controls">
            <label>Show <select aria-label="Entries per page" value={length} onChange={e => { setLength(Number(e.target.value)); setStart(0) }}>{[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}</select> entries</label>
            <label>Search: <input type="search" value={search} onChange={e => { setSearch(e.target.value); setStart(0) }} /></label>
          </div>
          <table id="dynamic-table" className="table table-striped table-bordered table-hover" aria-busy={busy}>
            <thead><tr>{['Application No.', t('application.fa.applicationDate', 'Application Date'), 'Applicant Name', 'District', t('application.page.action', 'Action')].map(label => <th key={label}>{label}</th>)}</tr></thead>
            <tbody>{(data.aaData || []).map(row => <tr key={row.id}><td>{row.id}</td><td>{row.createdDate}</td><td>{row.applicantName}</td><td>{row.districtName}</td><td><div className="hidden-sm hidden-xs action-buttons"><Link className="blue" to={'/department/fa/viewfaInfrastructure/' + encodeURIComponent(row.id)}>{t('application.page.viewprint', 'View/Print')}</Link></div></td></tr>)}
              {!data.aaData?.length && <tr><td colSpan={5} style={{ textAlign: 'center' }}>{search ? 'No matching records found' : 'No data available in table'}</td></tr>}
            </tbody>
          </table>
          <div className="infrastructure-table-controls">
            <span>Showing {count ? start + 1 : 0} to {Math.min(start + length, count)} of {count} entries{Number(data.iTotalRecords) > count && ` (filtered from ${data.iTotalRecords} total entries)`}</span>
            <div className="pagination">
              <button disabled={!start || busy} onClick={() => setStart(start - length)}>Previous</button>
              {Array.from({ length: Math.min(pages, 5) }, (_, i) => Math.max(0, Math.min(current - 2, pages - 5)) + i).map(page => <button key={page} aria-current={page === current ? 'page' : undefined} disabled={busy} onClick={() => setStart(page * length)}>{page + 1}</button>)}
              <button disabled={start + length >= count || busy} onClick={() => setStart(start + length)}>Next</button>
            </div>
          </div>
        </div>
      </div></div>
    </div></div>
  </div>
}
