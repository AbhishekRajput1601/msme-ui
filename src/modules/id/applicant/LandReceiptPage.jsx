import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchLandPage } from './services/landApplicationService'
import { contentNodes } from '../../public/legacyWebsite'
import { WebsiteContent } from '../../public/WebsiteContent'
import { resolveLegacyHashRoute } from '../../../routes/roleRoutes'

export default function LandReceiptPage({ statusLookup = false, application = false }) {
  const { crn, locChallanId, applicantId, parcelToken } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [attempt, setAttempt] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true }); setSubmitting(false)
    const part = encodeURIComponent
    const path = statusLookup ? 'onlinePaymentCheckStatusAll' : application ? `id/onlinePayment/${part(applicantId)}/${part(parcelToken)}` : `id/onlinePaymentResponse_csfms/${locChallanId ? `${part(locChallanId)}/` : ''}${part(crn)}`
    fetchLandPage(path, controller.signal).then(doc => {
      const panel = doc.querySelector('.panel-body')
      if (!panel) throw new Error('The server did not return payment details.')
      if ([...doc.forms].some(form => /id\/submitOnlinePayment$/.test(form.getAttribute('action') || ''))) throw new Error('This application has no payment receipt yet. Open payment review to proceed.')
      const statusForm = [...doc.forms].find(form => /(?:^|\/)id\/checkOnlinePaymentStatus$/.test(form.getAttribute('action') || ''))
      const fields = statusForm ? [...statusForm.querySelectorAll('input[name], textarea[name]')].filter(node => !['button', 'submit'].includes(node.type)).map(node => ({ name: node.name, value: node.value, hidden: node.hidden || node.type === 'hidden', label: node.closest('.form-group')?.querySelector('label')?.textContent.trim() || node.name })) : []
      if (statusLookup && !fields.some(field => field.name === 'urn')) throw new Error('The server did not return the payment status enquiry form.')
      const links = [...panel.querySelectorAll('a[href]')].filter(node => !node.hasAttribute('disabled') && node.getAttribute('aria-disabled') !== 'true').map(node => ({ label: node.textContent.trim(), href: resolveLegacyHashRoute('/applicant/home', node.getAttribute('href')) })).filter(link => link.href?.startsWith('/applicant/land-allotment/'))
      // Convert values to text before removing the legacy form controls.
      panel.querySelectorAll('input, textarea').forEach(node => {
        if (!node.hidden && !['hidden', 'button', 'submit', 'checkbox'].includes(node.type)) {
          const text = doc.createElement('span'); text.textContent = node.value; node.replaceWith(text)
        } else node.remove()
      })
      panel.querySelectorAll('script, button, a, select').forEach(node => node.remove())
      panel.querySelectorAll('form').forEach(form => form.replaceWith(...form.childNodes))
      if (panel.textContent.includes('{{')) throw new Error('The server returned incomplete receipt details.')
      const nodes = contentNodes(panel, `${window.location.origin}/backend/applicant/${path}`)
      if (!controller.signal.aborted) setResult({ fields, links, nodes })
    }).catch(error => { if (!controller.signal.aborted) setResult({ error: error.message }) })
    return () => controller.abort()
  }, [crn, locChallanId, applicantId, parcelToken, application, statusLookup, attempt])
  return <section className="panel panel-info"><div className="panel-heading">{statusLookup ? 'Check treasury payment status' : 'Land payment receipt and status'}</div><div className="panel-body">
    <Link to="/applicant/land-allotment">Back to applications</Link>
    {result.loading ? <p role="status">Loading payment details…</p> : result.error ? <div className="alert alert-danger" role="alert"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Reload</button></div> : <>
      {!statusLookup && <WebsiteContent nodes={result.nodes} />}
      {result.fields.length > 0 && <form action="/backend/applicant/id/checkOnlinePaymentStatus" method="post" onSubmit={event => { if (submitting) event.preventDefault(); else setSubmitting(true) }}>
        {result.fields.map((field, index) => field.hidden || !statusLookup ? <input key={index} type="hidden" name={field.name} value={field.value} /> : <div className="form-group" key={index}><label htmlFor={`enquiry-${index}`}>{field.label}</label><input id={`enquiry-${index}`} className="form-control" name={field.name} defaultValue={field.value} required={field.name === 'urn'} readOnly={field.name !== 'urn'} /></div>)}
        <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Opening treasury enquiry…' : 'Check current treasury status'}</button>
      </form>}
      {!statusLookup && <button className="btn btn-default my-3" onClick={() => window.print()}>Print receipt</button>}
      <p>{result.links.map((link, index) => <Link key={index} className="btn btn-default mr-2" to={link.href}>{link.label}</Link>)}</p>
    </>}
  </div></section>
}
