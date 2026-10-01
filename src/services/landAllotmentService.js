/**
 * landAllotmentService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service for the Pilot Module (Industrial Land Allotment / ID Section).
 *
 * Interfaces with the new clean JSON REST endpoints replacing legacy Category C
 * mixed HTML/data views:
 *  • getApplicationDetail  →  /api/applicant/id/application-detail/...
 *  • getDocumentsStatus    →  /api/applicant/id/documents-status/...
 *  • getLocPaymentReview   →  /api/applicant/id/loc-payment-review/...
 *  • getAnnualPaymentDetail→  /api/applicant/id/annual-payment-detail/...
 */

import { get } from '../api/httpClient'
import { REST_ID } from '../api/endpoints'

/**
 * Fetches structured land application details (replaces Category C viewApplicationDetail).
 *
 * @param {string|number} applicantId
 * @param {string|number} vacantLandId
 * @returns {Promise<Object>}
 */
export async function fetchApplicationDetail(applicantId, vacantLandId) {
  const url = REST_ID.APPLICATION_DETAIL
    .replace('{applicantId}', applicantId)
    .replace('{vacantLandId}', vacantLandId)

  return await get(url)
}

/**
 * Fetches verification and upload status of applicant documents (replaces Category C viewDocumentsUpload).
 *
 * @param {string|number} applicantId
 * @param {string|number} vacantLandId
 * @returns {Promise<Object>}
 */
export async function fetchDocumentsStatus(applicantId, vacantLandId) {
  const url = REST_ID.DOCUMENTS_STATUS
    .replace('{applicantId}', applicantId)
    .replace('{vacantLandId}', vacantLandId)

  return await get(url)
}

/**
 * Fetches LOC payment verification details (replaces Category C reviewLocPayment).
 *
 * @param {string|number} locChallanId
 * @returns {Promise<Object>}
 */
export async function fetchLocPaymentReview(locChallanId) {
  const url = REST_ID.LOC_PAYMENT_REVIEW.replace('{locChallanId}', locChallanId)
  return await get(url)
}

/**
 * Fetches annual lease payment breakdown (replaces Category C viewAnnualPaymentDetails).
 *
 * @param {string|number} paymentId
 * @returns {Promise<Object>}
 */
export async function fetchAnnualPaymentDetail(paymentId) {
  const url = REST_ID.ANNUAL_PAYMENT_DETAIL.replace('{paymentId}', paymentId)
  return await get(url)
}

export default {
  fetchApplicationDetail,
  fetchDocumentsStatus,
  fetchLocPaymentReview,
  fetchAnnualPaymentDetail,
}
