import { dashboardCount } from '../dtic/dashboardModel.js'

const routePart = value => (typeof value === 'string' || typeof value === 'number') && String(value).trim() ? encodeURIComponent(value) : null

export function applicantDashboardAction(kind, row) {
  const id = routePart(kind === 'land' ? row.applicantId : row.applicationId)
  if (!id) return null
  if (kind === 'assistance') {
    const resume = [1, 5].includes(Number(row.currentStatusId))
    return { resume, to: `/applicant/financial-assistance/${resume ? 'viewfaapplicantdetailunit' : 'viewfaapplicantdetailunitnew'}/${id}` }
  }
  const base = '/applicant/land-allotment'
  const status = Number(row.statusId)
  const token = routePart(row.vacantLandIDEncrypt)
  // Match the workflow actions available in the full land application list.
  if (token) {
    const step = status === 1 ? 'edit' : status === 5 ? 'query' : status >= 2 && row.ctPaymentBean != null && row.signedApplicationFormUploadDocId == null ? 'sign' : null
    if (step) return { resume: true, to: `${base}/${step}/${id}/${token}` }
  }
  return { resume: false, to: `${base}/detail/${id}` }
}

export function applicantDashboardData(data) {
  const rows = data?.aaData ?? data?.data
  if (!Array.isArray(rows)) throw new Error('Invalid application list')
  // A single page is not the total. Missing totals stay unavailable.
  const total = dashboardCount(data.iTotalDisplayRecords ?? data.recordsFiltered ?? data.iTotalRecords ?? data.recordsTotal)
  return { rows: rows.filter(row => row && typeof row === 'object' && !Array.isArray(row)), total }
}
