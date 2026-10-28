import { dticTableParams } from './dticTableParams.js'

export const applicationStatusKey = row => row.currentStatusId != null
  ? `id:${row.currentStatusId}`
  : `label:${String(row.status || 'Status unavailable').trim()}`

export function groupApplicationsByStatus(rows) {
  const groups = new Map()
  for (const row of rows) {
    const key = applicationStatusKey(row)
    if (!groups.has(key)) groups.set(key, { key, label: String(row.status || 'Status unavailable'), count: 0 })
    groups.get(key).count += 1
  }
  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export const applicationDistrictKey = row => row.districtId != null
  ? `id:${row.districtId}`
  : `label:${String(row.districtName || 'District unavailable').trim()}`

export function groupApplicationsByDistrict(rows) {
  const groups = new Map()
  for (const row of rows) {
    const key = applicationDistrictKey(row)
    if (!groups.has(key)) groups.set(key, { key, label: String(row.districtName || (row.districtId != null ? `District ${row.districtId}` : 'District unavailable')), count: 0 })
    groups.get(key).count += 1
  }
  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export async function loadFaStatusApplications(request, config, signal, { idField = 'applicationId', params = {} } = {}) {
  const rows = new Map()
  const pageSize = 100
  let start = 0
  let expectedTotal = 0
  let pageLength = 0
  do {
    const data = await request('get', config.endpoint, { ...dticTableParams(config, { start, length: pageSize }), ...params }, signal)
    if (signal.aborted) throw new Error('Request cancelled.')
    const total = Number(data.iTotalDisplayRecords)
    if (!Array.isArray(data.aaData) || data.iTotalDisplayRecords == null || !Number.isSafeInteger(total) || total < 0) {
      throw new Error('Unable to load application status totals.')
    }
    expectedTotal = Math.max(expectedTotal, total)
    pageLength = data.aaData.length
    for (const row of data.aaData) {
      if (!row || row[idField] == null) throw new Error('The server returned an invalid record.')
      rows.set(String(row[idField]), row)
    }
    // The backend applies block permissions after SQL pagination, while its
    // count query includes additional records. Short/empty pages are valid.
    // Advance the SQL offset, not the number of visible applications.
    start += pageSize
  } while (start < expectedTotal || pageLength >= pageSize)
  return [...rows.values()]
}

export function filterFaApplications(rows, status, search = '') {
  const query = search.trim().toLowerCase()
  return rows.filter(row => (status === 'all' || applicationStatusKey(row) === status)
    && (!query || [row.applicationId, row.applicationDate, row.unitOrInstName, row.id, row.createdDate, row.applicantName, row.status, row.plotNumber, row.industrialAreaName, row.districtName, row.tehsilName, row.plotShed, row.purposeName, row.category]
      .some(value => String(value ?? '').toLowerCase().includes(query))))
}
