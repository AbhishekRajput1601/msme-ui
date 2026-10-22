import landTables from './infrastructure/generated/tables.json'
import { dticTableParams } from './dticTableParams'

// Sum the application totals shown against every plot, including subsequent pages.
export async function loadLandDashboardCounts(request, signal) {
  const config = landTables['dtic/dticVacantLandList']
  let plots = null, applications = 0, start = 0
  do {
    const data = await request('get', config.endpoint, {
      ...dticTableParams(config, { start, length: 100 }), industrialArea: '',
    }, signal)
    const total = dashboardListCount(data)
    if (plots !== null && total !== plots) throw new Error('Land records changed. Refresh counts.')
    plots = total
    for (const row of data.aaData) {
      const count = dashboardCount(row.totalApplicationReceived)
      if (count === null) throw new Error('Land application totals are unavailable.')
      applications += count
    }
    start += data.aaData.length
    if (start > plots || !Number.isSafeInteger(applications)) throw new Error('Invalid land totals.')
  } while (start < plots)
  return [['landPlots', plots], ['landApplications', applications]]
}

// Missing or malformed counts must never be presented as zero.
export function dashboardCount(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null
  if (typeof value === 'string' && !/^\d+$/.test(value.trim())) return null
  const count = Number(value)
  return Number.isSafeInteger(count) && count >= 0 ? count : null
}

export const workQueues = [
  { key: 'newApplicationsReceived', label: 'New applications', detail: 'Awaiting DTIC review', path: 'viewnewapplications', tone: 'blue', status: 'PENDING_FROM_DTIC' },
  { key: 'applicationsSubmittedAfterCorrection', label: 'Resubmitted applications', detail: 'Returned after clarification', path: 'viewresubmittedapplications', tone: 'teal', status: 'SUBMITTED_AFTER_CORRECTION' },
  { key: 'applicationsForCorrection', label: 'Sent for correction', detail: 'Awaiting applicant response', path: 'viewsendbackapplications', tone: 'amber', status: 'RESUBMISSION_FROM_APPLICANT' },
]

export const decisions = [
  { authority: 'DTIC', accepted: 'applicationsAcceptedByDTIC', rejected: 'applicationsRejectedByDTIC', acceptedPath: 'viewapplicationsacceptedbydtic', rejectedPath: 'viewapplicationsrejectedbydtic', acceptedStatus: 'PENDING_FROM_DTFC', rejectedStatus: 'REJECTED_DTIC' },
  { authority: 'DTFC', accepted: 'applicationsAcceptedByDTFC', rejected: 'applicationsRejectedByDTFC', acceptedPath: 'viewapplicationsacceptedbydtfc', rejectedPath: 'viewapplicationsrejectedbydtfc', acceptedStatus: 'PENDING_FROM_BANK', rejectedStatus: 'REJECTED_DTFC' },
  { authority: 'Bank', accepted: 'applicationsAcceptedByBank', rejected: 'applicationsRejectedByBank', acceptedPath: 'viewapplicationsacceptedbybank', rejectedPath: 'viewapplicationsrejectedbybank', acceptedStatus: 'ACCEPTED', rejectedStatus: 'REJECTED_BANK' },
]

// The filtered list total is authoritative; never use a page length as a total.
export function dashboardListCount(data) {
  if (!data || !Array.isArray(data.aaData)) throw new Error('Invalid application list.')
  const count = dashboardCount(data.iTotalDisplayRecords)
  if (count === null) throw new Error('The application list did not return a valid count.')
  if ((count === 0 && data.aaData.length > 0) || (count > 0 && data.aaData.length === 0)) {
    throw new Error('The application count does not match the returned records.')
  }
  return count
}
