import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchNoticeList, loadNoticeWorkflow, noticeActions, noticeModes, saveNoticeWorkflow } from './services/landNoticeService'

const base = '/applicant/land-allotment/notices'
const detailFields = [
  ['applicantName', 'Applicant'], ['industrialAreaName', 'Industrial area'], ['plotNumber', 'Plot'], ['proposedVenture', 'Venture category'],
  ['noticeDate', 'Notice date'], ['reason', 'Reason'], ['remark', 'Remarks'], ['documentDesc', 'Document description'],
  ['userCompliance', 'Applicant compliance'], ['userComplianceDate', 'Compliance date'], ['complianceDocumentDesc', 'Compliance document description'],
  ['complianceStatus', 'Compliance status'], ['agreeDisagreeRemark', 'Department remarks'], ['agreeDisagreeDocumentDesc', 'Department document description'],
  ['cancellationDate', 'Cancellation date'], ['cancellationReason', 'Cancellation reason'],
  ['appealDate', 'Appeal date'], ['appealGround', 'Appeal grounds'], ['appealFees', 'Appeal fees (rupees)'], ['challanMode', 'Challan mode'], ['challanNumber', 'Challan number'], ['paymentDate', 'Payment date'],
  ['hearingDate', 'Hearing date'], ['hearingStatus', 'Hearing status'], ['otherHearingStatus', 'Other hearing status'], ['nextHearingDate', 'Next hearing date'],
  ['caseDecision', 'Case decision'], ['decisionDate', 'Decision date'], ['timeframeDate', 'Compliance deadline'], ['comments', 'Comments'],
  ...['user', 'dtic', 'zonal', 'ic'].flatMap(role => [['Compliance', 'compliance'], ['ComplianceDate', 'compliance date'], ['ComplianceStatus', 'compliance status'], ['Comments', 'comments'], ['CommentsDate', 'comments date'], ['ComplianceDocumentDesc', 'document description']].map(([key, label]) => [`${role}${key}`, `${role === 'user' ? 'Applicant' : role.toUpperCase()} ${label}`])),
].filter(([key], index, all) => all.findIndex(([other]) => other === key) === index)

function NoticeDetails({ data }) {
  const documents = [['documentId', 'documentName', 'Notice / appeal document'], ['complianceDocumentId', 'complianceDocumentName', 'Compliance document'], ['agreeDisagreeDocumentId', 'agreeDisagreeDocumentName', 'Department document'], ...['user', 'dtic', 'zonal', 'ic'].map(role => [`${role}ComplianceDocumentId`, `${role}ComplianceDocumentName`, `${role.toUpperCase()} compliance document`])]
  return <><dl className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">{detailFields.filter(([key]) => data[key] != null && typeof data[key] !== 'object').map(([key, label]) => <div key={key}><dt>{label}</dt><dd className="whitespace-pre-wrap">{String(data[key]) || '—'}</dd></div>)}</dl><ul>{documents.filter(([key]) => data[key]).map(([key, name, label]) => <li key={key}><a href={`/mpmsme/applicant/downloadNoticeDocument/${encodeURIComponent(data[key])}`} target="_blank" rel="noreferrer">{data[name] || label}</a></li>)}</ul></>
}

function NoticeForm({ mode, id, context }) {
  const navigate = useNavigate()
  const [values, setValues] = useState({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const appeal = mode.startsWith('appeal-')
  const change = (key, value) => setValues(current => ({ ...current, [key]: value }))
  const submit = async event => {
    event.preventDefault()
    if (busy || saved) return
    setBusy(true); setError('')
    try {
      const response = await saveNoticeWorkflow(mode, id, values, context)
      setSaved(true)
      if (mode === 'appeal-zo') navigate(`/applicant/land-allotment/appeal-review/${response.id}`)
      else if (mode === 'appeal-ic') navigate(`${base}/view-ic/${response.id}`)
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  if (saved) return <p role="status" className="alert alert-success">Your compliance details have been saved.</p>
  return <form onSubmit={submit} aria-busy={busy}>
    {error && <p className="alert alert-danger" role="alert">{error}</p>}
    {appeal && <div className="form-group"><label htmlFor="appeal-date">Appeal date</label><input id="appeal-date" className="form-control" type="date" required disabled={busy} value={values.appealDate || ''} onChange={event => change('appealDate', event.target.value)} /></div>}
    <div className="form-group"><label htmlFor="notice-response">{appeal ? 'Appeal grounds' : 'Your compliance'}</label><textarea id="notice-response" className="form-control" required maxLength={appeal ? 400 : 3000} disabled={busy} value={values[appeal ? 'appealGround' : 'userCompliance'] || ''} onChange={event => change(appeal ? 'appealGround' : 'userCompliance', event.target.value)} /></div>
    {appeal && <div className="form-group"><label htmlFor="appeal-remark">Remarks</label><textarea id="appeal-remark" className="form-control" maxLength={3000} disabled={busy} value={values.remark || ''} onChange={event => change('remark', event.target.value)} /></div>}
    <div className="form-group"><label htmlFor="notice-document">Supporting document (optional)</label><input id="notice-document" type="file" disabled={busy} onChange={event => change('document', event.target.files[0] || null)} /></div>
    <div className="form-group"><label htmlFor="notice-document-description">Document description</label><textarea id="notice-document-description" className="form-control" maxLength={3000} disabled={busy} value={values.documentDesc || ''} onChange={event => change('documentDesc', event.target.value)} /></div>
    <label className="block my-3"><input type="checkbox" required disabled={busy} /> I have reviewed these details and want to submit them.</label>
    <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : mode === 'appeal-zo' ? 'Save appeal and review payment' : 'Submit'}</button>
  </form>
}

export default function LandNoticesPage() {
  const { mode, id, decisionId } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true })
    const request = mode ? loadNoticeWorkflow(mode, id, decisionId, controller.signal) : fetchNoticeList({ page, pageSize: 10, searchQuery: search })
    request.then(data => { if (!controller.signal.aborted) setResult({ data }) }).catch(error => { if (!controller.signal.aborted) setResult({ error: error.message }) })
    return () => controller.abort()
  }, [mode, id, decisionId, page, search, attempt])
  const value = result.data
  return <section className="panel panel-info"><div className="panel-heading">{noticeModes[mode]?.[0] || 'Land notices and appeals'}</div><div className="panel-body">
    <Link to="/applicant/land-allotment">Back to applications</Link>{' | '}<Link to={base}>Notices and appeals</Link>
    {!mode && <div className="form-group"><label htmlFor="notice-search">Search applications</label><input id="notice-search" className="form-control" value={search} onChange={event => { setSearch(event.target.value); setPage(1) }} /></div>}
    {result.loading ? <p role="status">Loading notice details…</p> : result.error ? <div className="alert alert-danger" role="alert"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(current => current + 1)}>Retry</button></div> : !mode ? <>
      <table className="table table-bordered"><thead><tr><th>Application</th><th>Industrial area / plot</th><th>Status</th><th>Actions</th></tr></thead><tbody>{value.data.map(row => <tr key={`${row.applicantId}-${row.idNoticeBean?.noticeId}`}><td>{row.applicationId}</td><td>{row.vacantLandBean?.industrialAreaName} / {row.vacantLandBean?.plotNumber}</td><td>{row.status}</td><td>{noticeActions(row).map(action => <p key={action.href}><Link to={action.href}>{action.label}</Link></p>)}{Number(row.idNoticeBean?.statusId) === 16 && Number(row.idNoticeBean.noticeDaysLeft) <= 0 && <span>Notice response period expired</span>}</td></tr>)}{!value.data.length && <tr><td colSpan={4}>No notices found.</td></tr>}</tbody></table>
      <button className="btn btn-default" disabled={page <= 1} onClick={() => setPage(current => current - 1)}>Previous</button>{' '}Page {page}{' '}<button className="btn btn-default" disabled={page * 10 >= value.totalCount} onClick={() => setPage(current => current + 1)}>Next</button>
    </> : <>
      <NoticeDetails data={value.data} />
      {mode.startsWith('decision-') && <NoticeDetails data={value.data[`appealConditionalDecision${mode.endsWith('zo') ? 'ZO' : 'IC'}Bean`]} />}
      {mode.startsWith('view-') && <><h2>Hearings</h2><table className="table table-bordered"><thead><tr><th>Date</th><th>Status</th><th>Decision</th><th>Next date</th><th>Action</th></tr></thead><tbody>{value.hearings.map(hearing => <tr key={hearing.appealHearingId}><td>{hearing.hearingDate}</td><td>{hearing.hearingStatus || '—'}</td><td>{hearing.caseDecision || '—'}</td><td>{hearing.nextHearingDate || '—'}</td><td><Link to={`${base}/hearing/${hearing.appealHearingId}`}>View hearing</Link></td></tr>)}{!value.hearings.length && <tr><td colSpan={5}>No hearings scheduled.</td></tr>}</tbody></table></>}
      {noticeModes[mode]?.[3] ? <NoticeForm key={`${mode}-${id}`} mode={mode} id={id} context={value.data} /> : <button className="btn btn-default" onClick={() => window.print()}>Print details</button>}
    </>}
  </div></section>
}
