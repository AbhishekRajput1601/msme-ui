import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchApplicationDetail, fetchDocumentsList, getDownloadDocumentUrl } from './services/idApplicantService'
import { fetchLandPage, saveLandDocuments } from './services/landApplicationService'
import { isUndeveloped } from './landApplicationModel'

const categories = [
  ['doc2', 'Project report / scheme', true], ['doc3', 'Proposed construction layout and cost estimate', true],
  ['doc4', 'Constitution / registration certificate'], ['doc5', 'Partnership deed and partner details'],
  ['doc6', 'Company memorandum, articles and board resolution'], ['doc7', 'Co-operative society registration and resolution'],
  ['doc8', 'Authorized signatory letter'], ['doc9', 'Project implementation schedule / PERT chart', true],
  ['doc10', 'Audited balance sheets for the last two years'], ['doc11', 'Previous year audited / CA-certified turnover'],
  ['profileImage', 'Applicant photograph (JPEG, smaller than 2 MB)', true],
]

export default function LandDocumentsPage({ correction = false }) {
  const { applicantId, parcelToken } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [files, setFiles] = useState({})
  const [declaration, setDeclaration] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(null)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    const controller = new AbortController()
    setResult({ loading: true }); setSaved(null); setFiles({}); setDeclaration(false)
    Promise.all([
      fetchLandPage(`id/${correction ? 'editDocumentsUpload' : 'viewDocumentsUpload'}/${encodeURIComponent(applicantId)}/${encodeURIComponent(parcelToken)}`, controller.signal),
      fetchApplicationDetail(applicantId), fetchDocumentsList(applicantId),
    ]).then(([doc, application, documents]) => {
      const form = doc.querySelector('form[data-ng-submit], form[ng-submit]')
      const submission = form?.getAttribute('data-ng-submit') || form?.getAttribute('ng-submit') || ''
      if (!(correction ? /editIDDocuments/ : /uploadIDDocuments|updateIDDocuments/).test(submission)) throw new Error('The server did not authorize document uploads for this application.')
      if (Number(application.statusId) !== (correction ? 5 : 1)) throw new Error('Documents cannot be updated at this application status.')
      const container = form.querySelector('[name="checkDeclaration"]')?.parentElement
      const declarationText = container ? [...container.querySelectorAll(':scope > span')].map(span => span.textContent.trim()).filter(Boolean) : []
      if (!correction && (!declarationText.length || declarationText.some(text => /\{\{|Declaration Detail/.test(text)))) throw new Error('The server did not return the application declaration. Please reload.')
      if (active) setResult({ application, documents, undeveloped: isUndeveloped(application), update: correction || /updateIDDocuments/.test(submission), declarationText })
    }).catch(err => { if (active) setResult({ error: err.message }) })
    return () => { active = false; controller.abort() }
  }, [applicantId, parcelToken, attempt, correction])
  const submit = async event => {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError('')
    try {
      const response = await saveLandDocuments({ applicantId, files, declaration, update: result.update, undeveloped: result.undeveloped, correction })
      setSaved({ message: response.successMessage, parcelToken: response.value || parcelToken })
      setFiles({})
    } catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }
  return <section className="panel panel-info"><div className="panel-heading">Land application documents</div><div className="panel-body">
    <Link to="/applicant/land-allotment">Back to applications</Link>
    {result.loading ? <p role="status">Loading document requirements…</p> : result.error ? <div role="alert" className="alert alert-danger"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : <>
      {result.documents.length > 0 && <ul>{result.documents.map((doc, index) => <li key={index}>{doc.documentTypeShort ? <a href={getDownloadDocumentUrl(doc.documentTypeShort, applicantId)} target="_blank" rel="noreferrer">{doc.documentType}</a> : doc.documentType}</li>)}</ul>}
      {saved ? <div role="status" className="alert alert-success"><p>{saved.message}</p><p>{correction ? 'The corrected documents have been saved. Continue to your query reply.' : 'Documents have been saved. Payment and any required eSign steps remain.'}</p><Link className="btn btn-primary" to={`/applicant/land-allotment/${correction ? 'query' : 'payment'}/${applicantId}/${encodeURIComponent(saved.parcelToken)}`}>{correction ? 'Continue to query reply' : 'Review payment'}</Link></div> : <form key={attempt} onSubmit={submit} aria-busy={busy}>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <p>Documents: PDF or JPEG, each smaller than {result.undeveloped ? '10' : '2'} MB. Photographs must be smaller than 2 MB. Select only the files you want to replace when updating.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{(result.undeveloped ? [['doc1', 'Latest financial closure report', true], ...categories.map(([name, label, required]) => [name, label, required || ['doc10', 'doc11'].includes(name)]), ['doc12', 'Proof of establishment of unit (if applicable)']] : categories).map(([name, label, required]) => <div className="form-group" key={name}>
          <label htmlFor={`land-${name}`}>{label}{required && !result.update ? ' *' : ''}</label>
          <input id={`land-${name}`} name={name} type="file" accept={name === 'profileImage' ? '.jpg,.jpeg' : '.pdf,.jpg,.jpeg'} required={required && !result.update} disabled={busy} onChange={event => setFiles(current => { const next = { ...current }; if (event.target.files[0]) next[name] = event.target.files[0]; else delete next[name]; return next })} />
        </div>)}</div>
        {!correction && <fieldset className="border p-4 my-5"><legend>Declaration</legend>{result.declarationText.map((text, index) => <p key={index}>{text}</p>)}<label><input type="checkbox" name="checkDeclaration" checked={declaration} required disabled={busy} onChange={event => setDeclaration(event.target.checked)} /> I accept this declaration.</label></fieldset>}
        <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? 'Saving documents…' : 'Save documents'}</button>
      </form>}
    </>}
  </div></section>
}
