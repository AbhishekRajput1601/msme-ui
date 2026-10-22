import { dticTableParams } from '../dtic/dticTableParams.js'

export const financialDashboardItems = [
  { label: 'Industrial Unit', path: 'dticfapendingapplicantsunit', endpoint: 'fetchpendingapplicants/Unit', columns: [null, 'applicationId', 'applicationDate', 'unitOrInstName', 'status', null], unit: 'Applications' },
  { label: 'Disbursement Calculator', path: 'faDisbursementUnit_new', endpoint: 'fetchDisbursementListNew/Unit/null/null/null', kind: 'list', unit: 'Records' },
  { label: 'Application for Infrastructure Development Permission', path: 'infradevelopmetList', endpoint: 'fetchInfrastructureList', columns: ['id', 'createdDate', 'applicantName', 'districtName', null], unit: 'Applications' },
  { label: 'District Wise Financial Assistance Report', path: 'districtWiseReport', endpoint: 'fetchDistrictWiseReportData', kind: 'report', unit: 'Report rows' },
  { label: 'Scheme Wise Financial Assistance Report', path: 'schemeWiseReport', endpoint: 'fetchSchemeWiseReportData', kind: 'report', unit: 'Report rows' },
  { label: 'Sanctioned Vs Disbursement Report', path: 'SanctionedVsDisbursement', endpoint: 'fetchSanctionedVsDisbursementReportData', kind: 'report', unit: 'Report rows' },
  { label: 'District Wise MSME Detail Report', path: 'districtWiseMsmeDetailsReport', endpoint: 'fetchDistrictWiseReportData', kind: 'report', reportType: 'MSME_DETAIL_REPORT', unit: 'Report rows' },
]

export function readFinancialCount(value) {
  if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') throw new Error('Count unavailable')
  const count = Number(value)
  if (!Number.isSafeInteger(count) || count < 0) throw new Error('Count unavailable')
  return count
}

export async function loadFinancialCount(item, request, signal) {
  if (item.columns) {
    const data = await request('get', item.endpoint, dticTableParams(item, { length: 1 }), signal)
    if (!Array.isArray(data?.aaData)) throw new Error('Invalid application list')
    return readFinancialCount(data.iTotalDisplayRecords)
  }
  if (item.kind === 'list') {
    const data = await request('post', item.endpoint, undefined, signal)
    if (!Array.isArray(data)) throw new Error('Invalid disbursement list')
    return data.length
  }
  const params = new URLSearchParams({ noOfRows: 10, startRecord: 0, maxRows: 10, searchField: '', fromDate: '', toDate: '', districtId: '', appType: '', reportType: item.reportType || '', status: '', schemeName: '' })
  const data = await request('post', item.endpoint, params, signal)
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('Invalid report')
  return readFinancialCount(data[1])
}
