import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LandSigningDocument from './components/LandSigningDocument'
import { loadSigningApplication, requestApplicationEsign, signApplicationWithDsc } from './services/landSigningService'
import { getDownloadEsignedDocumentUrl } from './services/idApplicantService'

export default function LandSigningPage() {
  const { applicantId, parcelToken } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [attempt, setAttempt] = useState(0)
  const [details, setDetails] = useState({ aadhaarLast4Digits: '', remark: '' })
  const [confirmed, setConfirmed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [gateway, setGateway] = useState(null)
  const [saved, setSaved] = useState(false)
  const documentRef = useRef(null)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true }); setConfirmed(false); setError(''); setGateway(null); setSaved(false); setDetails({ aadhaarLast4Digits: '', remark: '' })
    loadSigningApplication(applicantId, parcelToken, controller.signal).then(data => {
      if (!controller.signal.aborted) setResult({ data })
    }).catch(err => { if (!controller.signal.aborted) setResult({ error: err.message }) })
    return () => controller.abort()
  }, [applicantId, parcelToken, attempt])
  const sign = async type => {
    if (!confirmed || busy || gateway || saved) return
    setBusy(true); setError('')
    try {
      const html = documentRef.current?.querySelector('.esignHtml')?.innerHTML
      if (type === 'aadhaar') setGateway(await requestApplicationEsign(result.data.applicationData, html, details))
      else { await signApplicationWithDsc(result.data.applicationData, html, details); setSaved(true) }
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  const signedDocumentId = result.data?.applicationData.signedApplicationFormUploadDocId
  const signed = String(result.data?.applicationData.isApplicationFormEsigned) === 'true' || !!signedDocumentId
  return <section className="panel panel-info"><div className="panel-heading">Review and sign land application</div><div className="panel-body">
    <Link to={`/applicant/land-allotment/detail/${applicantId}`}>Back to application</Link>
    {result.loading ? <p role="status">Loading the application document…</p> : result.error ? <div className="alert alert-danger" role="alert"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : <>
      <div ref={documentRef} className="overflow-x-auto"><LandSigningDocument {...result.data} /></div>
      {error && <p role="alert" className="alert alert-danger">{error}</p>}
      {signed || saved ? <div role="status" className="alert alert-success"><p>{saved ? 'The server confirmed that the signed PDF was stored.' : 'This application is already signed.'}</p>{signedDocumentId && <a href={getDownloadEsignedDocumentUrl(signedDocumentId)}>Download signed application</a>}<p><Link to={`/applicant/land-allotment/detail/${applicantId}`}>Check application status</Link></p></div> : gateway ? <form action={gateway.action} method="post"><input type="hidden" name="msg" value={gateway.message} /><p>The signing request is ready. Continue to the signing provider to complete verification. Creating this request does not mean the application is signed.</p><button className="btn btn-primary">Continue to Aadhaar signing</button></form> : <div>
        <div className="form-group"><label htmlFor="sign-aadhaar">Last four Aadhaar digits (for Aadhaar signing)</label><input id="sign-aadhaar" name="aadhaarLast4Digits" className="form-control" inputMode="numeric" maxLength={4} autoComplete="off" value={details.aadhaarLast4Digits} disabled={busy} onChange={event => setDetails(current => ({ ...current, aadhaarLast4Digits: event.target.value }))} /></div>
        <div className="form-group"><label htmlFor="sign-remark">Remarks</label><textarea id="sign-remark" className="form-control" maxLength={800} value={details.remark} disabled={busy} onChange={event => setDetails(current => ({ ...current, remark: event.target.value }))} /></div>
        <label className="block my-3"><input type="checkbox" checked={confirmed} disabled={busy} onChange={event => setConfirmed(event.target.checked)} /> I have reviewed the full document above and authorize signing it.</label>
        <button className="btn btn-primary mr-3" disabled={!confirmed || busy} onClick={() => sign('aadhaar')}>Sign with Aadhaar</button><button className="btn btn-default" disabled={!confirmed || busy} onClick={() => sign('dsc')}>Sign with DSC</button>
        {busy && <p role="status">Signing request in progress…</p>}
      </div>}
    </>}
  </div></section>
}
