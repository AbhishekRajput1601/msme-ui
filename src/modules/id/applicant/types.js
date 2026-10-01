/**
 * types.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Constants, status mappings, and validation definitions for the ID Applicant Module.
 */

export const APPLICATION_STATUS = Object.freeze({
  SUBMITTED: {
    label: 'Application Submitted',
    variant: 'info',
    step: 1,
    description: 'Application successfully received by MSME portal.',
  },
  UNDER_SCRUTINY: {
    label: 'Under DTIC Scrutiny',
    variant: 'warning',
    step: 2,
    description: 'District Trade & Industry Centre officer is reviewing the proposal.',
  },
  INSPECTION_SCHEDULED: {
    label: 'Site Inspection Scheduled',
    variant: 'info',
    step: 3,
    description: 'Technical officer assigned to verify industrial area feasibility.',
  },
  APPROVED: {
    label: 'Approved by Committee',
    variant: 'success',
    step: 4,
    description: 'Land allotment committee approved the plot reservation.',
  },
  LOI_ISSUED: {
    label: 'LOI Letter Issued',
    variant: 'success',
    step: 5,
    description: 'Letter of Intent generated. Applicant must accept and deposit lease premium.',
  },
  PAYMENT_PENDING: {
    label: 'Payment Pending',
    variant: 'warning',
    step: 6,
    description: 'Challan generated. Awaiting Cyber Treasury transaction confirmation.',
  },
  ALLOTMENT_ISSUED: {
    label: 'Allotment Letter Issued',
    variant: 'success',
    step: 7,
    description: 'Formal allotment order issued. Proceed to Lease Deed registration.',
  },
  LEASE_DEED_EXECUTED: {
    label: 'Lease Deed Executed',
    variant: 'success',
    step: 8,
    description: 'Tripartite lease deed registered with sub-registrar.',
  },
  POSSESSION_GIVEN: {
    label: 'Possession Handed Over',
    variant: 'success',
    step: 9,
    description: 'Final physical plot possession handed over to enterprise.',
  },
  REJECTED: {
    label: 'Rejected',
    variant: 'danger',
    step: 0,
    description: 'Application rejected. Review DTIC comments for rejection cause.',
  },
  HOLD: {
    label: 'On Hold',
    variant: 'warning',
    step: 0,
    description: 'Application put on hold pending applicant query clarification.',
  },
})

export const DOCUMENT_TYPES = Object.freeze([
  { code: 'DPR', label: 'Detailed Project Report (DPR)', required: true },
  { code: 'PAN', label: 'PAN Card of Enterprise / Applicant', required: true },
  { code: 'LAND_PLAN', label: 'Proposed Factory / Plot Layout Plan', required: true },
  { code: 'CONSTITUTION', label: 'Partnership Deed / MOA & AOA / Registration', required: true },
  { code: 'FINANCE', label: 'Audited Balance Sheet / Net Worth Certificate', required: false },
  { code: 'POLLUTION_NOC', label: 'Pollution Board Consent (if applicable)', required: false },
])

export const LAND_CATEGORY_TYPES = Object.freeze([
  { value: 'DEVELOPED', label: 'Developed Industrial Area' },
  { value: 'UNDEVELOPED', label: 'Undeveloped Industrial Land' },
  { value: 'MULTI_STOREY', label: 'Multi-Storey Industrial Complex' },
])

/**
 * Normalizes backend raw status string into a typed status descriptor.
 *
 * @param {string} rawStatus
 * @returns {{ label: string, variant: string, step: number }}
 */
export function getStatusMeta(rawStatus) {
  if (!rawStatus) return APPLICATION_STATUS.SUBMITTED
  const upper = rawStatus.toUpperCase().replace(/\s+/g, '_')

  if (upper.includes('REJECT')) return APPLICATION_STATUS.REJECTED
  if (upper.includes('LOI')) return APPLICATION_STATUS.LOI_ISSUED
  if (upper.includes('POSSESSION')) return APPLICATION_STATUS.POSSESSION_GIVEN
  if (upper.includes('ALLOT')) return APPLICATION_STATUS.ALLOTMENT_ISSUED
  if (upper.includes('LEASE')) return APPLICATION_STATUS.LEASE_DEED_EXECUTED
  if (upper.includes('SCRUTINY')) return APPLICATION_STATUS.UNDER_SCRUTINY
  if (upper.includes('INSPECT')) return APPLICATION_STATUS.INSPECTION_SCHEDULED
  if (upper.includes('PAYMENT')) return APPLICATION_STATUS.PAYMENT_PENDING
  if (upper.includes('APPROV')) return APPLICATION_STATUS.APPROVED
  if (upper.includes('HOLD')) return APPLICATION_STATUS.HOLD

  return APPLICATION_STATUS[upper] || {
    label: rawStatus,
    variant: 'info',
    step: 1,
    description: rawStatus,
  }
}
