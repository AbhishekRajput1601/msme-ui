// Missing or malformed counts must never be presented as zero.
export function dashboardCount(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null
  if (typeof value === 'string' && !/^\d+$/.test(value.trim())) return null
  const count = Number(value)
  return Number.isSafeInteger(count) && count >= 0 ? count : null
}

export const workQueues = [
  { key: 'newApplicationsReceived', label: 'New applications', detail: 'Awaiting DTIC review', path: 'viewnewapplications', tone: 'blue' },
  { key: 'applicationsSubmittedAfterCorrection', label: 'Resubmitted applications', detail: 'Returned after clarification', path: 'viewresubmittedapplications', tone: 'teal' },
  { key: 'applicationsForCorrection', label: 'Sent for correction', detail: 'Awaiting applicant response', path: 'viewsendbackapplications', tone: 'amber' },
]

export const decisions = ['DTIC', 'DTFC', 'Bank'].map(authority => ({
  authority,
  accepted: `applicationsAcceptedBy${authority}`,
  rejected: `applicationsRejectedBy${authority}`,
  acceptedPath: `viewapplicationsacceptedby${authority.toLowerCase()}`,
  rejectedPath: `viewapplicationsrejectedby${authority.toLowerCase()}`,
}))
