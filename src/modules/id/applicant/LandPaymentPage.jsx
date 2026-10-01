import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchLandPage } from './services/landApplicationService'

export function parseLandPayment(doc, applicantId) {
  const form = [...doc.forms].find(node => /(?:^|\/)id\/submitOnlinePayment$/.test(node.getAttribute('action') || ''))
  if (!form) throw new Error('A new payment form is not available. Check the application payment status before retrying.')
  const fields = [...form.querySelectorAll('input[name], textarea[name]')].filter(node => !['button', 'submit'].includes(node.type)).map(node => ({
    name: node.name, value: node.value, hidden: node.hidden || node.type === 'hidden',
    label: node.closest('.form-group')?.querySelector('label')?.textContent.trim() || node.name,
    editable: node.name === 'comments',
  }))
  if (fields.find(field => field.name === 'applicantId')?.value !== String(applicantId)) throw new Error('The payment form does not match this application.')
  const amount = fields.find(field => field.name === 'totalAmount')?.value
  if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) throw new Error('The server did not return a valid payment amount.')
  return fields
}

export default function LandPaymentPage({ retry = false }) {
  const { applicantId, parcelToken } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true }); setConfirmed(false); setSubmitting(false)
    fetchLandPage(`id/${retry ? 'retryOnlinePayment' : 'onlinePayment'}/${encodeURIComponent(applicantId)}/${encodeURIComponent(parcelToken)}`, controller.signal)
      .then(doc => parseLandPayment(doc, applicantId))
      .then(fields => { if (!controller.signal.aborted) setResult({ fields }) })
      .catch(error => { if (!controller.signal.aborted) setResult({ error: error.message }) })
    return () => controller.abort()
  }, [applicantId, parcelToken, attempt, retry])
  return <section className="panel panel-info"><div className="panel-heading">Review land application payment</div><div className="panel-body">
    <Link to={`/applicant/land-allotment/detail/${encodeURIComponent(applicantId)}`}>Back to application</Link>
    {' | '}<Link to={`/applicant/land-allotment/payment-status/${encodeURIComponent(applicantId)}/${encodeURIComponent(parcelToken)}`}>View existing payment status</Link>
    {result.loading ? <p role="status">Loading the current payment amount…</p> : result.error ? <div className="alert alert-danger" role="alert"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Reload payment status</button></div> :
      <form action="/backend/applicant/id/submitOnlinePayment" method="post" onSubmit={event => { if (!confirmed || submitting) event.preventDefault(); else setSubmitting(true) }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{result.fields.map((field, index) => field.hidden ? <input key={index} type="hidden" name={field.name} value={field.value} /> : <div className="form-group" key={index}>
          <label htmlFor={`payment-${index}`}>{field.label}</label>
          {field.editable ? <textarea id={`payment-${index}`} className="form-control" name={field.name} defaultValue={field.value} /> : <input id={`payment-${index}`} className="form-control" name={field.name} value={field.value} readOnly />}
        </div>)}</div>
        <label className="block my-4"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} /> I have reviewed the amount and want to proceed to payment.</label>
        <p>You will continue through the existing treasury payment service. Payment is confirmed only after the server receives the result.</p>
        <button type="submit" className="btn btn-primary" disabled={!confirmed || submitting}>{submitting ? 'Opening payment service…' : 'Proceed to payment'}</button>
      </form>}
  </div></section>
}
