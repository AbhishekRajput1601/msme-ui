/** Reject HTML, error envelopes and missing data instead of inventing records. */
export function jsonData(value) {
  if (typeof value === 'string') {
    try { value = JSON.parse(value) } catch { throw new Error('The server returned an unexpected response. Please try again.') }
  }
  if (value == null || typeof value !== 'object') throw new Error('The server returned no data.')
  if (value.success === false || value.status === 'error' || value.error || value.errorMessage) {
    throw new Error(typeof value.errorMessage === 'string' ? value.errorMessage : typeof value.message === 'string' ? value.message : 'The server could not complete the request.')
  }
  return value
}

export function dataTable(value) {
  const data = jsonData(value)
  const rows = Array.isArray(data) ? data : data.aaData ?? data.data
  if (!Array.isArray(rows)) throw new Error('The server returned an invalid record list.')
  const count = Number(data.iTotalDisplayRecords ?? data.iTotalRecords ?? data.totalCount ?? rows.length)
  if (!Number.isFinite(count) || count < 0) throw new Error('The server returned an invalid record count.')
  return { data: rows, totalCount: count }
}

export function displayNumber(value) {
  return value == null || value === '' || !Number.isFinite(Number(value)) ? '—' : Number(value).toLocaleString('en-IN')
}
