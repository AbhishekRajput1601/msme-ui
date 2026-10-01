import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { annualCharges, annualPaymentPayload, fetchAnnualDetail, fetchAnnualHistory, loadAnnualPayment, saveAnnualPayment } from './services/landAnnualPaymentService'
import { fetchApplicationPaymentList } from './services/idApplicantService'

const base = '/applicant/land-allotment'

function AnnualForm({ application }) {
  const navigate = useNavigate()
  const [data, setData] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  let total = '—'
  try { total = annualPaymentPayload(application.applicantId, data).totalCharges } catch { /* Incomplete form. */ }
  const field = (key, label, type = 'number') => <div className="form-group" key={key}><label htmlFor={`annual-${key}`}>{label}</label><input id={`annual-${key}`} name={key} type={type} className="form-control" min={key.startsWith('fy') ? '1900' : '0'} max={key.startsWith('fy') ? '9999' : undefined} step={key.startsWith('fy') ? '1' : '0.01'} required={key !== 'otherCharges'} disabled={busy} value={data[key] ?? ''} onChange={event => setData(current => ({ ...current, [key]: event.target.value }))} /></div>
  const submit = async event => {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    try { const id = await saveAnnualPayment(application.applicantId, data); navigate(`${base}/annual-review/${id}`) }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <form onSubmit={submit} aria-busy={busy}>
    <p>{application.applicationId} — {application.vacantLandBean.industrialAreaName}, plot {application.vacantLandBean.plotNumber}</p>
    {error && <p className="alert alert-danger" role="alert">{error}</p>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{field('fyFrom', 'Financial year: from')}{field('fyTo', 'Financial year: to')}{annualCharges.map(([key, label]) => field(key, `${label} per year (rupees)`))}</div>
    <p><strong>Total for this period: {total} rupees</strong></p>
    <label htmlFor="annual-remarks">Payment remarks</label><textarea id="annual-remarks" className="form-control" maxLength={3000} value={data.paymentRemarks || ''} disabled={busy} onChange={event => setData(current => ({ ...current, paymentRemarks: event.target.value }))} />
    <button className="btn btn-primary my-3" disabled={busy}>{busy ? 'Saving…' : 'Save and review payment'}</button>
  </form>
}

export default function LandAnnualPaymentPage({ mode = 'list' }) {
  const { applicantId, landId, paymentId } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true })
    const request = mode === 'form' ? loadAnnualPayment(applicantId, landId, controller.signal) : mode === 'history' ? fetchAnnualHistory(applicantId, controller.signal) : mode === 'detail' ? fetchAnnualDetail(paymentId, controller.signal) : fetchApplicationPaymentList({ page, pageSize: 10, searchQuery: search })
    request.then(data => { if (!controller.signal.aborted) setResult({ data }) }).catch(error => { if (!controller.signal.aborted) setResult({ error: error.message }) })
    return () => controller.abort()
  }, [mode, applicantId, landId, paymentId, page, search, attempt])
  const detail = result.data
  return <section className="panel panel-info"><div className="panel-heading">Annual land payments</div><div className="panel-body">
    <Link to={base}>Back to applications</Link>{' | '}<Link to={`${base}/annual`}>Annual payments</Link>
    {mode === 'list' && <div className="form-group"><label htmlFor="annual-search">Search applications</label><input id="annual-search" className="form-control" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} /></div>}
    {result.loading ? <p role="status">Loading annual payment details…</p> : result.error ? <div role="alert" className="alert alert-danger"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : mode === 'form' ? <AnnualForm key={`${applicantId}-${landId}`} application={detail} /> : mode === 'detail' ? <>
      <h2>Payment {detail.paymentId}</h2><p>Financial years: {detail.fyFrom} – {detail.fyTo}</p><dl>{[...annualCharges, ['totalCharges', 'Total amount'], ['paymentRemarks', 'Remarks'], ['challanNumber', 'Challan number'], ['paymentDate', 'Payment date']].map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{detail[key] ?? '—'}</dd></div>)}</dl>
      {['Pending', 'Failure'].includes(detail.ctPaymentBean?.status) && <p><Link to={`${base}/annual-review/${detail.paymentId}`}>Review and retry payment</Link></p>}
      {detail.ctPaymentBean?.crn && <p><Link to={`${base}/receipt/${encodeURIComponent(detail.ctPaymentBean.crn)}`}>View treasury receipt and status</Link></p>}
      <button className="btn btn-default" onClick={() => window.print()}>Print payment details</button>
      {['Pending', 'Failure'].includes(detail.ctPaymentBean?.status) && <p><Link to={`${base}/annual-review/${detail.paymentId}`}>Review and retry payment</Link></p>}
      {detail.ctPaymentBean?.crn && <p><Link to={`${base}/receipt/${encodeURIComponent(detail.ctPaymentBean.crn)}`}>View treasury receipt and status</Link></p>}
      <button className="btn btn-default" onClick={() => window.print()}>Print payment details</button>
      <h3>Treasury response</h3>{detail.ctPaymentBean ? <dl>{[['status', 'Status'], ['statusDesc', 'Description'], ['crn', 'CRN'], ['cin', 'CIN'], ['amount', 'Amount'], ['challanDate', 'Challan date']].map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{detail.ctPaymentBean[key] ?? '—'}</dd></div>)}</dl> : <p>No treasury confirmation has been returned.</p>}
    </> : mode === 'history' ? <table className="table table-bordered"><thead><tr><th>Period</th><th>Amount</th><th>Payment status</th><th>Action</th></tr></thead><tbody>{detail.map(row => <tr key={row.paymentId}><td>{row.fyFrom} – {row.fyTo}</td><td>{row.totalCharges}</td><td>{row.ctPaymentBean?.statusDesc || row.ctPaymentBean?.status || 'No treasury confirmation'}</td><td><Link to={`${base}/annual-detail/${row.paymentId}`}>View details</Link></td></tr>)}{!detail.length && <tr><td colSpan={4}>No annual payments found.</td></tr>}</tbody></table> : <>
      <table className="table table-bordered"><thead><tr><th>Application</th><th>Industrial area / plot</th><th>Status</th><th>Action</th></tr></thead><tbody>{detail.data.map(row => <tr key={row.applicantId}><td>{row.applicationId}</td><td>{row.vacantLandBean?.industrialAreaName} / {row.vacantLandBean?.plotNumber}</td><td>{row.status}</td><td><Link to={`${base}/annual-history/${row.applicantId}`}>Payment history</Link>{' | '}<Link to={`${base}/annual/${row.applicantId}/${row.vacantLandId ?? row.vacantLandBean?.vacantLandId}`}>Make payment</Link></td></tr>)}{!detail.data.length && <tr><td colSpan={4}>No applications eligible for annual payment were returned.</td></tr>}</tbody></table>
      <button className="btn btn-default" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button>{' '}<span>Page {page}</span>{' '}<button className="btn btn-default" disabled={page * 10 >= detail.totalCount} onClick={() => setPage(value => value + 1)}>Next</button>
    </>}
  </div></section>
}
