import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { loadLandQuery, submitLandQuery, uploadLandQueryDocument, validateQueryDocument } from './services/landQueryService'

export default function LandQueryPage() {
  const { applicantId, parcelToken } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [reply, setReply] = useState('')
  const [file, setFile] = useState(null)
  const [replySaved, setReplySaved] = useState(false)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true }); setReply(''); setFile(null); setReplySaved(false); setSaved(false); setError('')
    loadLandQuery(applicantId, parcelToken, controller.signal)
      .then(query => { if (!controller.signal.aborted) setResult({ query }) })
      .catch(err => { if (!controller.signal.aborted) setResult({ error: err.message }) })
    return () => controller.abort()
  }, [applicantId, parcelToken, attempt])
  const submit = async event => {
    event.preventDefault()
    if (busy || saved) return
    setBusy(true); setError('')
    try {
      validateQueryDocument(file)
      if (!replySaved) {
        await submitLandQuery(applicantId, result.query, reply)
        setReplySaved(true)
      }
      if (file) await uploadLandQueryDocument(applicantId, file)
      setSaved(true)
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <section className="panel panel-info"><div className="panel-heading">Reply to land application query</div><div className="panel-body">
    <Link to="/applicant/land-allotment">Back to applications</Link>
    {result.loading ? <p role="status">Loading the query…</p> : result.error ? <div role="alert" className="alert alert-danger"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : saved ? <p role="status" className="alert alert-success">Your reply{file ? ' and document have' : ' has'} been saved.</p> : <form onSubmit={submit} aria-busy={busy}>
      <h2>Department query</h2><p className="whitespace-pre-wrap">{result.query.comments}</p>
      {!replySaved && <p><Link to={`/applicant/land-allotment/correct/${applicantId}/${encodeURIComponent(parcelToken)}`}>Correct application details or documents before replying</Link></p>}
      {error && <p role="alert" className="alert alert-danger">{error}</p>}
      {replySaved && <p role="status">Your reply was saved. Retry the document upload below; the reply will not be submitted again. Keep this page open until the upload succeeds.</p>}
      <div className="form-group"><label htmlFor="query-reply">Your reply</label><textarea id="query-reply" className="form-control" required maxLength={400} value={reply} disabled={busy || replySaved} onChange={event => setReply(event.target.value)} /></div>
      <div className="form-group"><label htmlFor="query-document">Supporting document (PDF or JPEG, smaller than 2 MB)</label><input id="query-document" type="file" accept=".pdf,.jpg,.jpeg" required={replySaved} disabled={busy} onChange={event => setFile(event.target.files[0] || null)} /></div>
      <label className="block my-3"><input type="checkbox" required disabled={busy || replySaved} /> I have reviewed my reply and want to submit it.</label>
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : replySaved ? 'Retry document upload' : 'Submit reply'}</button>
    </form>}
  </div></section>
}
