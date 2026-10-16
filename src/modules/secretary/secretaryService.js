/**
 * secretaryService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * API service for the Secretary role in FA workflow.
 * Encapsulates all backend calls for Dashboard, Verification, Batches, and Details.
 */

import { get, post, download } from '../../api/httpClient'
import { SECRETARY, fillPath } from '../../api/endpoints'

/**
 * Fetch applications pending Secretary verification (status 20, mapped district).
 *
 * @param {string} [search='']
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function fetchApplications(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(SECRETARY.FETCH_APPLICATIONS, params, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Submit selected applications for verification (moves to status 21).
 *
 * @param {Array<{applicationNo: string, remark?: string}>} actions
 * @param {AbortSignal} [signal]
 * @returns {Promise<{successMessage?: string, errorMessage?: string}>}
 */
export async function verifyApplications(actions, signal) {
  return await post(SECRETARY.VERIFY, actions, { signal })
}

/**
 * Raise query on selected applications (moves back to status 5 / DTIC).
 *
 * @param {Array<{applicationNo: string, remark?: string}>} actions
 * @param {AbortSignal} [signal]
 * @returns {Promise<{successMessage?: string, errorMessage?: string}>}
 */
export async function queryApplications(actions, signal) {
  return await post(SECRETARY.QUERY, actions, { signal })
}

/**
 * Fetch role-wise verification remark history for an application.
 *
 * @param {string} applicationNo
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function fetchVerificationHistory(applicationNo, signal) {
  const url = fillPath(SECRETARY.HISTORY, { applicationNo })
  const data = await get(url, {}, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch complete applicant industrial detail (read-only aggregation).
 *
 * @param {string} applicationNo
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export async function fetchApplicationDetail(applicationNo, signal) {
  const url = fillPath(SECRETARY.DETAIL_DATA, { applicationNo })
  return await get(url, {}, { signal })
}

/**
 * Fetch GM-DTIC eligible amount and remark for an application.
 *
 * @param {string} applicationNo
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export async function fetchDticEligible(applicationNo, signal) {
  const url = fillPath(SECRETARY.DTIC_ELIGIBLE, { applicationNo })
  return (await get(url, {}, { signal })) || {}
}

/**
 * Fetch assistance-wise type and eligible amount for an application.
 *
 * @param {string} applicationNo
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function fetchApplicantAssistances(applicationNo, signal) {
  const url = fillPath(SECRETARY.APPLICANT_ASSISTANCES, { applicationNo })
  const data = await get(url, {}, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch all batches pending at Secretary stage.
 *
 * @param {string} [search='']
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function fetchBatches(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(SECRETARY.FETCH_BATCHES, params, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch enriched batch view with applications list.
 *
 * @param {string|number} batchId
 * @param {AbortSignal} [signal]
 * @returns {Promise<Object>}
 */
export async function fetchBatchDetail(batchId, signal) {
  const url = fillPath(SECRETARY.BATCH_DETAIL, { batchId })
  return await get(url, {}, { signal })
}

/**
 * Submit / forward Secretary batch to LDM.
 *
 * @param {string|number} batchId
 * @param {Array<{applicationNo: string, remark: string, remarkText?: string, sanctionedAmount?: any}>} actions
 * @param {AbortSignal} [signal]
 * @returns {Promise<{successMessage?: string, errorMessage?: string}>}
 */
export async function submitSecretaryBatch(batchId, actions, signal) {
  const url = fillPath(SECRETARY.SUBMIT_BATCH, { batchId })
  return await post(url, actions, { signal })
}

/**
 * Download the batch covering letter PDF.
 *
 * @param {string|number} batchId
 * @param {string} [batchCode]
 * @returns {Promise<void>}
 */
export async function downloadCoveringLetter(batchId, batchCode) {
  const url = fillPath(SECRETARY.DOWNLOAD_COVERING_LETTER, { batchId })
  const filename = `CoveringLetter-${batchCode || batchId}.pdf`
  await download(url, {}, filename)
}

/**
 * Download an uploaded FA application document.
 *
 * @param {string|number} documentId
 * @param {string} applicationNo
 * @param {string} [label]
 * @returns {Promise<void>}
 */
export async function downloadUploadedDoc(documentId, applicationNo, label) {
  const url = fillPath(SECRETARY.DOWNLOAD_DOC, { documentId, applicationNo })
  const fallback = `${(label || 'Document').replace(/[^a-zA-Z0-9_-]/g, '_')}-${applicationNo}.pdf`
  await download(url, {}, fallback)
}

/**
 * Fetch FA request process progress history.
 *
 * @param {string} applicationNo
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array>}
 */
export async function fetchProgressHistory(applicationNo, signal) {
  const url = fillPath(SECRETARY.PROGRESS_HISTORY, { applicationNo })
  const data = await get(url, {}, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Helper to extract flattened uploaded document list from detail object.
 *
 * @param {Object} detail
 * @returns {Array<{label: string, id: number|string}>}
 */
export function extractUploadedDocuments(detail) {
  if (!detail) return []
  const u = detail.faIndustrialUnitBean || {}
  const defs = [
    ['Udyam Registration', detail.udyamUploadId],
    ['PAN Card', detail.panUploadId],
    ['TAN', detail.tanUploadId],
    ['Proof of Identity', detail.proofOfIdentityUploadId],
    ['Proof of Address', detail.proofOfAddressUploadId],
    ['Category Certificate', detail.categoryUploadId],
    ['Factory Act Licence', detail.factoryUploadId],
    ['GST Certificate', detail.gstUploadId],
    ['CIN Document', detail.cinUploadId],
    ['PCB (Established)', detail.pcbEstUploadId],
    ['PCB (Operate)', detail.pcbOperateUploadId],
    ['Deed', detail.deedUploadId],
    ['Articles of Association (AOA)', detail.aoaUploadId],
    ['Memorandum of Association (MOA)', detail.moaUploadId],
    ['Cancelled Cheque', detail.cancelledChequeUploadId],
    ['Specimen Signature', detail.specimenSignUploadId],
    ['GST Sale Document', u.gstSellDocUploadId],
    ['Permission Document', u.permissionDocUploadId],
    ['Employment Proof', u.employmentGivenUploadId],
    ['Scheme Document', u.schemeDocUploadId],
  ]
  return defs.filter(([, id]) => Boolean(id)).map(([label, id]) => ({ label, id }))
}
