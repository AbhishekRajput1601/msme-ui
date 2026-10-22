import { dashboardCount } from '../dtic/dashboardModel.js'

export function applicantDashboardData(data) {
  const rows = data?.aaData ?? data?.data
  if (!Array.isArray(rows)) throw new Error('Invalid application list')
  // A single page is not the total. Missing totals stay unavailable.
  const total = dashboardCount(data.iTotalDisplayRecords ?? data.recordsFiltered ?? data.iTotalRecords ?? data.recordsTotal)
  return { rows: rows.filter(row => row && typeof row === 'object' && !Array.isArray(row)), total }
}
