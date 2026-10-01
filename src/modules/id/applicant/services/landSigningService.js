import { get, post } from '../../../../api/httpClient'
import { jsonData } from '../../../../api/responseData'
import { requireSaveSuccess } from '../landApplicationModel'
import { fetchLandPage } from './landApplicationService'
import { fetchApplicationDetail, fetchDocumentsList } from './idApplicantService'

export async function loadSigningApplication(applicantId, parcelToken, signal) {
  const page = await fetchLandPage(`viewESignApplicationDetail/${encodeURIComponent(applicantId)}/${encodeURIComponent(parcelToken)}`, signal)
  if (!page.querySelector('.esignHtml')) throw new Error('The server did not authorize this application signing page.')
  const [applicationData, applicantDocumentsList, profile] = await Promise.all([
    fetchApplicationDetail(applicantId), fetchDocumentsList(applicantId),
    get('/applicant/id/fetchIndustrialProfileDocumentsList', { applicantId }, { signal }),
  ])
  const industrialProfileDocumentsList = jsonData(profile)
  if (!Array.isArray(industrialProfileDocumentsList) || String(applicationData.applicantId) !== String(applicantId)) throw new Error('The signing details do not match this application.')
  return { applicationData, applicantDocumentsList, industrialProfileDocumentsList }
}

function signingPayload(application, html, details) {
  if (!application.applicantId || !application.applicationId || !html?.trim() || html.includes('{{')) throw new Error('The complete application document is required before signing.')
  if (String(application.isApplicationFormEsigned) === 'true' || application.signedApplicationFormUploadDocId) throw new Error('This application has already been signed. Reload its details.')
  if (Number(application.statusId) < 2 || !application.ctPaymentBean) throw new Error('Complete the application and payment steps before signing.')
  if ((details.remark || '').length > 800) throw new Error('Remarks cannot exceed 800 characters.')
  return { primaryId: application.applicantId, applicantNumber: application.applicationId, unsignedBase64: html,
    type: 'APPLICATIONFORM', title: 'Applicant Digital Signature', aadhaarLast4Digits: details.aadhaarLast4Digits || '', remark: details.remark || '' }
}

export async function requestApplicationEsign(application, html, details) {
  if (!/^\d{4}$/.test(details.aadhaarLast4Digits || '')) throw new Error('Enter the last four Aadhaar digits.')
  const response = requireSaveSuccess(jsonData(await post('/applicant/eSignature', signingPayload(application, html, details))))
  let gateway
  try { gateway = new URL(response.aspUrl) } catch { throw new Error('The server did not return a valid signing gateway.') }
  if (gateway.protocol !== 'https:' || gateway.username || gateway.password || typeof response.eHastaksharHiddenInputTAG !== 'string' || !response.eHastaksharHiddenInputTAG.trim()) throw new Error('The signing gateway response is incomplete or invalid.')
  return { action: gateway.href, message: response.eHastaksharHiddenInputTAG }
}

export async function signApplicationWithDsc(application, html, details, signerFetch = fetch) {
  const generated = requireSaveSuccess(jsonData(await post('/applicant/generateLOIPDF', signingPayload(application, html, details))))
  if (!generated.transactionId || !generated.eHastaksharHiddenInputTAG || !generated.serverDateTime) throw new Error('The server did not return a complete signing transaction.')
  let signed
  try {
    const response = await signerFetch('http://localhost:8060/jsonsigner/Sign', {
      method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(120000),
      body: JSON.stringify({ ServerDateTime: generated.serverDateTime, DocumentType: 'PDF', Data: generated.eHastaksharHiddenInputTAG,
        SignatureName: generated.signatureName, Reason: generated.reason, Location: generated.location }),
    })
    if (!response.ok) throw new Error('Signer rejected the request.')
    signed = jsonData(await response.json())
  } catch { throw new Error('The local DSC signer did not complete the request. Check the signer at port 8060 and your certificate, then try again.') }
  if (typeof signed.SignedData !== 'string' || !signed.SignedData.trim()) throw new Error('The local signer returned no signed PDF. Nothing was submitted as signed.')
  const result = jsonData(await post('/applicant/signPDFAPPLICATIONFORM', {
    id: application.applicantId, billId: String(application.applicantId), value: signed.SignedData, signedBase64PDF: signed.SignedData,
    reason: 'VACANTLAND APPLICATIONFORM', serverDateTime: generated.serverDateTime,
    signatureName: generated.signatureName || 'Authorized Signatory', type: 'APPLICATIONFORM', transactionId: generated.transactionId,
  }))
  if (!result.vcId) throw new Error('The server did not confirm that the signed application was stored.')
  return result
}
