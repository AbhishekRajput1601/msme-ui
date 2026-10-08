import { resolveLegacyHashRoute } from '../../../../routes/roleRoutes'

export function landReferenceLink(value) {
  const route = value.replace(/^#\/?/, '')
  const lists = { 'id/landAllotment': 'new', 'id/landAllotmentUN': 'explore', 'id/landApplications': '', 'id/annualPayments': 'annual', 'id/noticeAppealList': 'notices' }
  if (route in lists) return '/applicant/land-allotment/' + lists[route]
  if (/^(uploadLOC|viewLOCDetails|locPaymentDetails|reviewLocPayment|id\/retryLOCPayment|id\/updatePossessionLetter|id\/tenderDetails)\//.test(route)) return '/applicant/land-allotment/reference/' + route
  return resolveLegacyHashRoute('/applicant/home', '#/' + route)
}

const downloads = {
  downloadHoldReleaseDoc: 'downloadHoldReleaseDocument/', downloadVacantLandMap: 'downloadVacantLandMap/',
  downloadIndustrialAreaMap: 'downloadIndustrialAreaMap/', downloadVacantPostponedDoc: 'downloadPostponedDoc',
  downloadLOILetter: 'downloadIdDocument/ID_LETTER_OF_INTENT_RELEASED/',
  downloadLeaseLetter: 'downloadIdDocument/ID_LETTER_OF_LEASE_DEED/',
  downloadAllotmentLetter: 'downloadIdDocument/ID_LETTER_OF_ALLOTMENT_RELEASED/',
  downloadCommitteeLetter: 'downloadIdDocument/ID_LETTER_OF_COMMITTEE_DECISION/',
  downloadPossessionLetter: 'downloadIdDocument/ID_LETTER_OF_POSSESSION_RELEASED/',
  downloadEsignedApplicationForm: 'downloadEsignDocument/',
}
export function landDownloadLink(value) {
  const match = value.match(/^javascript:(\w+)\(['"]?([^'"()]*)['"]?\);?$/)
  if (!match || !downloads[match[1]]) return undefined
  return '/mpmsme/applicant/' + downloads[match[1]] + (match[1] === 'downloadVacantPostponedDoc' ? '' : encodeURIComponent(match[2]))
}
