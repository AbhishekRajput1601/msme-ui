import { get, post } from '../../../../api/httpClient'
import { jsonData } from '../../../../api/responseData'
import { fetchLandPage } from './landApplicationService'
import { fetchApplicationDetail } from './idApplicantService'

export const annualCharges = [['leaseRent', 'Lease rent'], ['maintenanceFee', 'Maintenance fee'], ['shedRent', 'Shed rent'], ['transferCharge', 'Transfer charge'], ['otherCharges', 'Other charges']]

export function annualPaymentPayload(applicantId, data) {
  const from = Number(data.fyFrom), to = Number(data.fyTo)
  if (!/^\d{4}$/.test(String(data.fyFrom)) || !/^\d{4}$/.test(String(data.fyTo)) || from < 1900 || to > 9999 || to <= from) throw new Error('Enter a valid financial-year range with the ending year after the starting year.')
  const result = { applicantId, fyFrom: String(from), fyTo: String(to), paymentRemarks: data.paymentRemarks || '' }
  let cents = 0
  for (const [key, label] of annualCharges) {
    const raw = key === 'otherCharges' && !data[key] ? '0' : String(data[key] ?? '')
    if (!/^\d{1,10}(\.\d{1,2})?$/.test(raw)) throw new Error(`Enter a non-negative amount with up to two decimal places for ${label.toLowerCase()}.`)
    result[key] = Number(raw).toFixed(2)
    cents += Math.round(Number(raw) * 100)
  }
  result.totalCharges = (cents * (to - from) / 100).toFixed(2)
  if (!(Number(result.totalCharges) > 0)) throw new Error('The total annual payment must be greater than zero.')
  if (result.paymentRemarks.length > 3000) throw new Error('Payment remarks cannot exceed 3000 characters.')
  return result
}

export async function loadAnnualPayment(applicantId, landId, signal) {
  const page = await fetchLandPage(`id/applicantAnnualPayment/${encodeURIComponent(applicantId)}/${encodeURIComponent(landId)}`, signal)
  if (![...page.forms].some(form => /applicantAnnualPayment/.test(form.getAttribute('data-ng-submit') || ''))) throw new Error('The server did not authorize annual payments for this application.')
  const application = await fetchApplicationDetail(applicantId)
  if (String(application.applicantId) !== String(applicantId) || String(application.vacantLandBean?.vacantLandId) !== String(landId)) throw new Error('The returned application does not match the selected plot.')
  return application
}

export async function saveAnnualPayment(applicantId, data) {
  const value = await post('/applicant/applicantAnnualPayment', annualPaymentPayload(applicantId, data))
  if (!/^[1-9]\d*$/.test(String(value))) {
    if (value && typeof value === 'object') jsonData(value)
    throw new Error('The server did not confirm the annual payment record.')
  }
  return String(value)
}

export async function fetchAnnualHistory(applicantId, signal) {
  const page = await fetchLandPage(`id/viewAnnualPaymentHistory/${encodeURIComponent(applicantId)}`, signal)
  if (!page.querySelector('.panel-body')) throw new Error('The server did not authorize payment history.')
  const rows = jsonData(await get(`/applicant/id/fetchAnnualPaymentHistory/${encodeURIComponent(applicantId)}`, {}, { signal }))
  if (!Array.isArray(rows)) throw new Error('The server returned invalid payment history.')
  return rows
}

export async function fetchAnnualDetail(paymentId, signal) {
  const page = await fetchLandPage(`viewAnnualPaymentDetails/${encodeURIComponent(paymentId)}`, signal)
  if (!page.querySelector('.panel-body')) throw new Error('The server did not authorize these payment details.')
  const data = jsonData(await get(`/applicant/fetchAnnualPaymentDetails/${encodeURIComponent(paymentId)}`, {}, { signal }))
  if (String(data.paymentId) !== String(paymentId)) throw new Error('The returned payment does not match the requested record.')
  return data
}
