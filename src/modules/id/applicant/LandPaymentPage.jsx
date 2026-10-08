import { useParams } from 'react-router-dom'
import ResolvedLandPage from './reference/ResolvedLandPage'

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
  const path = `id/${retry ? 'retryOnlinePayment' : 'onlinePayment'}/${encodeURIComponent(applicantId)}/${encodeURIComponent(parcelToken)}`
  return <ResolvedLandPage key={path} path={path} identity={['applicantId', applicantId]} amountField="totalAmount" />
}
