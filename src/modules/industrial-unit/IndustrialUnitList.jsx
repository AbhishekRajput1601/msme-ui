import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUnitData } from './industrialUnitService'
import { amountWords, eligibility } from './industrialUnitModel'
import { backendPath, faPath } from './viewHelpers'

export function applicationActions(row) {
  const id = encodeURIComponent(row.applicationId)
  const status = Number(row.currentStatusId)
  const view = { label: 'View/Print', to: faPath(`fa/viewfaapplicantdetailunitnew/${id}`) }
  const history = { label: 'Progress Details', to: faPath(`fa/viewfaapplicantHistory/${id}/Unit`) }
  const document = (label, code) => ({ label, href: backendPath(`downloadfadocument/${code}/${id}`) })
  if (status === 1) return [{ label: 'Retrieve Partially Saved Form', to: faPath(`fa/viewfaapplicantdetailunit/${id}`) }]
  if (status === 2) return [view]
  if (status === 5) return [{ label: 'Edit', to: faPath(`fa/viewfaapplicantdetailunit/${id}`) }, history]
  if (status === 9) return [view, history, document('Download Sanction Order', 'FA_ACCEPTANCE_LETTER_RELEASED')]
  if (status === 10) return [view, history, document('Download Sanction Order', 'FA_ACCEPTANCE_LETTER_RELEASED'), { label: 'View Disbursement Order', to: faPath(`fa/viewfaDisbursementUnit/${id}/unit`) }]
  if (status === 15 && row.commiteeRequired) return [view, history, document('Download Acceptance', 'FA_ACCEPTANCE_LETTER_RELEASED'), document('Download Zonal Decision Letter', 'FA_ACCEPTANCE_LETTER_RELEASED')]
  return [view, history]
}

export default function IndustrialUnitList() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [count, setCount] = useState(0)
  const [start, setStart] = useState(0)
  const [length, setLength] = useState(10)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [modal, setModal] = useState(false)
  const [investment, setInvestment] = useState('')
  const [turnover, setTurnover] = useState('')
  useEffect(() => {
    const abort = new AbortController()
    setLoading(true); setError('')
    const params = { sEcho: retry + 1, iDisplayStart: start, iDisplayLength: length, sSearch: search, iColumns: 6, iSortingCols: 0 }
    getUnitData('fetchfaapplicants/Unit', params, abort.signal)
      .then(data => { if (!abort.signal.aborted) { setRows(data.aaData || data.data || []); setCount(Number(data.iTotalDisplayRecords ?? data.recordsFiltered ?? 0)) } })
      .catch(err => { if (!abort.signal.aborted) setError(err.message) })
      .finally(() => { if (!abort.signal.aborted) setLoading(false) })
    return () => abort.abort()
  }, [start, length, search, retry])
  useEffect(() => {
    if (!modal) return
    const key = event => { if (event.key === 'Escape') setModal(false) }
    document.addEventListener('keydown', key)
    document.getElementById('investmentAmount')?.focus()
    return () => document.removeEventListener('keydown', key)
  }, [modal])
  const proceed = () => {
    try {
      const destination = eligibility(investment, turnover)
      setModal(false)
      if (destination === 'mpidc') window.location.assign('/mpmsme/sws/initiate')
      else navigate(faPath('fa/newapplicantsingleform/Unit'))
    } catch (err) { window.alert(err.message) }
  }
  return <div id="industrial-unit-content">
    <div className="row"><div className="panel panel-info">
      <div className="panel-heading text-center" style={{ textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#ffffff' }}>MP MSME Protsahan Yojana, 2014</h4>
        <div style={{ fontSize: '13px', color: '#ffffff' }}>
          Financial Assistance &gt;{' '}
          <Link to="/applicant/financial-assistance" style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: 700 }}>
            Industrial Unit
          </Link>
        </div>
      </div>
      <div className="panel-body">
        {error && <div className="alert alert-danger" role="alert">{error} <button type="button" className="btn btn-default btn-sm" onClick={() => setRetry(v => v + 1)}>Retry</button></div>}
        <div className="row"><div className="res_div">
          <div className="industrial-table-controls">
            <label>
              Show{' '}
              <select className="form-control input-sm" style={{ display: 'inline-block', width: 'auto', height: '30px', padding: '2px 8px' }} value={length} onChange={e => { setLength(Number(e.target.value)); setStart(0) }}>
                {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
              </select>{' '}
              entries
            </label>
            <label>
              Search:{' '}
              <input className="form-control input-sm" style={{ display: 'inline-block', width: 'auto', height: '30px', padding: '2px 8px' }} value={search} onChange={e => { setSearch(e.target.value); setStart(0) }} />
            </label>
          </div>
          <table id="dynamic-table" className="table table-striped table-bordered table-hover" aria-busy={loading}>
            <thead><tr>{['Application Id', 'Application Date', 'Establishment Type', 'Establishment Name', 'Status', 'Action'].map(label => <th key={label}>{label}</th>)}</tr></thead>
            <tbody>{rows.map(row => <tr key={row.applicationId}><td>{row.applicationId}</td><td>{row.submittedOn || ''}</td><td>{row.establishmentType}</td><td>{row.unitOrInstName}</td><td>{row.status}</td><td><div className="action-buttons">{applicationActions(row).map((action, index) => <span key={action.label}>{index > 0 && ' | '}{action.to ? <Link className="blue" to={action.to}>{action.label}</Link> : <a className="blue" href={action.href} target="_blank" rel="noreferrer">{action.label}</a>}</span>)}</div></td></tr>)}{!rows.length && <tr><td colSpan={6} style={{ textAlign: 'center' }}>{loading ? 'Processing...' : error ? 'Applications could not be loaded.' : 'No data available in table'}</td></tr>}</tbody>
          </table>
          <div className="industrial-table-controls">
            <span>Showing {count ? start + 1 : 0} to {Math.min(start + length, count)} of {count} entries</span>
            <div className="pagination" style={{ margin: 0 }}>
              <button className="btn btn-default btn-sm" disabled={start === 0 || loading} onClick={() => setStart(Math.max(0, start - length))}>Previous</button>
              <span className="btn btn-primary btn-sm" style={{ pointerEvents: 'none' }}>{Math.floor(start / length) + 1}</span>
              <button className="btn btn-default btn-sm" disabled={start + length >= count || loading} onClick={() => setStart(start + length)}>Next</button>
            </div>
          </div>
        </div></div>
        <div className="col-md-12 text-center" style={{ textAlign: 'center', marginTop: '15px' }}>
          <button type="button" className="btn btn-success" onClick={() => setModal(true)}>Apply for Scheme</button>
        </div>
      </div>
    </div></div>
    {modal && <><div className="modal-backdrop fade show" onClick={() => setModal(false)} /><div className="modal fade show industrial-eligibility" role="dialog" aria-modal="true" aria-labelledby="eligibilityTitle" style={{ display: 'block' }}><div className="modal-dialog modal-dialog-centered"><div className="modal-content"><div className="modal-header text-center" style={{ textAlign: 'center', position: 'relative' }}><h4 className="modal-title w-100" id="eligibilityTitle" style={{ fontWeight: 'bold' }}>Eligibility Check</h4><button type="button" className="btn-close" aria-label="Close" onClick={() => setModal(false)} style={{ position: 'absolute', right: '15px', top: '15px' }} /></div><div className="modal-body">{[['Investment Amount', 'investmentAmount', investment, setInvestment], ['Annual Turnover', 'turnoverAmount', turnover, setTurnover]].map(([label, id, value, setValue]) => <div className="form-group" key={id} style={{ marginBottom: '12px' }}><label htmlFor={id} style={{ fontWeight: 600 }}>{label} (₹ In figures)</label><input id={id} type="number" className="form-control" style={{ height: '32px', fontSize: '13px' }} placeholder={id === 'investmentAmount' ? 'Enter investment amount' : 'Enter turnover amount'} min="100000" step="1" value={value} onChange={e => setValue(e.target.value)} /><small style={{ display: 'block', marginTop: 4, color: '#555', fontWeight: 500 }}>{Number(value) >= 100000 ? amountWords(value) + ' Rupees' : ''}</small>{value !== '' && Number(value) < 100000 && <small style={{ color: 'red' }}>{id === 'investmentAmount' ? 'Investment amount' : 'Annual turnover'} must be at least ₹1,00,000.</small>}</div>)}</div><div className="modal-footer text-center" style={{ justifyContent: 'center' }}><button className="btn btn-primary" onClick={proceed}>Continue</button><button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button></div></div></div></div></>}
  </div>
}
