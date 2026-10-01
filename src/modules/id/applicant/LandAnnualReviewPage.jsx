import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchLandPage } from './services/landApplicationService'
import { contentNodes } from '../../public/legacyWebsite'
import { WebsiteContent } from '../../public/WebsiteContent'

export default function LandAnnualReviewPage({ appeal = false }) {
  const { paymentId, appealId } = useParams()
  const recordId = appeal ? appealId : paymentId
  const submitAction = appeal ? 'submitAppealPayment' : 'submitAnnualPayment'
  const [result, setResult] = useState({ loading: true })
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true }); setConfirmed(false); setSubmitting(false)
    const path = `id/${appeal ? 'reviewAppealPayment' : 'reviewAnnualPayment'}/${encodeURIComponent(recordId)}`
    fetchLandPage(path, controller.signal).then(doc => {
      const form = [...doc.forms].find(node => new RegExp(`(?:^|/)id/${submitAction}$`).test(node.getAttribute('action') || ''))
      if (!form) throw new Error('The server did not return an annual payment review form.')
      const fields = [...form.querySelectorAll('input[name]')].filter(node => !['submit', 'button'].includes(node.type)).map(node => ({ name: node.name, value: node.value }))
      if (fields.find(field => field.name === (appeal ? 'appealId' : 'paymentId'))?.value !== String(recordId)) throw new Error('The payment review does not match the selected record.')
      const amount = fields.find(field => field.name === (appeal ? 'appealFees' : 'totalCharges'))?.value
      if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) throw new Error('The server did not return a valid annual payment amount.')
      const content = doc.createElement('div')
      content.innerHTML = form.innerHTML
      content.querySelectorAll('input, button, script, a, textarea, select').forEach(node => node.remove())
      if (content.textContent.includes('{{')) throw new Error('The annual payment review contains unresolved details.')
      const nodes = contentNodes(content, `${window.location.origin}/backend/applicant/${path}`)
      if (!controller.signal.aborted) setResult({ fields, amount, nodes })
    }).catch(error => { if (!controller.signal.aborted) setResult({ error: error.message }) })
    return () => controller.abort()
  }, [recordId, appeal, submitAction, attempt])
  return <section className="panel panel-info"><div className="panel-heading">Review {appeal ? 'appeal' : 'annual'} payment</div><div className="panel-body"><Link to={`/applicant/land-allotment/${appeal ? 'notices' : 'annual'}`}>Back to {appeal ? 'notices' : 'annual payments'}</Link>
    {result.loading ? <p role="status">Loading payment review…</p> : result.error ? <div className="alert alert-danger" role="alert"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : <form action={`/backend/applicant/id/${submitAction}`} method="post" onSubmit={event => { if (!confirmed || submitting) event.preventDefault(); else setSubmitting(true) }}>
      <WebsiteContent nodes={result.nodes} /><p><strong>Total amount: {result.amount} rupees</strong></p>
      {result.fields.map((field, index) => <input key={index} type="hidden" name={field.name} value={field.value} />)}
      <label className="block my-3"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} disabled={submitting} /> I have reviewed the details and want to proceed to treasury payment.</label>
      <button className="btn btn-primary" disabled={!confirmed || submitting}>{submitting ? 'Opening treasury…' : 'Proceed to payment'}</button>
    </form>}
  </div></section>
}
