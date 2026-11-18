import { backendUrl } from './publicRoutes'

// Share concurrent reads (including StrictMode mounts), but never cache failures
// or retain data after a request completes. Consumers ignore stale results.
const pending = new Map()
export function readPublic(path, format = 'json') {
  const key = `${format}:${path}`
  if (!pending.has(key)) {
    const request = fetch(backendUrl(path), {
      credentials: 'include', signal: AbortSignal.timeout(20000),
      headers: { Accept: format === 'json' ? 'application/json' : 'text/html' },
    }).then(async response => {
      if (!response.ok) throw new Error(`Unable to load content (${response.status}).`)
      if (format === 'json' && /\/website\/login(?:[?#]|$)/.test(response.url)) {
        throw new Error('The server requires sign-in to access these records.')
      }
      if (format === 'json' && !response.headers.get('content-type')?.includes('json')) {
        throw new Error('The server did not return data. Please retry.')
      }
      return format === 'json' ? response.json() : response.text()
    }).finally(() => pending.delete(key))
    pending.set(key, request)
  }
  return pending.get(key)
}

export function readRows(data, envelope) {
  const rows = data?.[envelope]
  if (!Array.isArray(rows) || rows.some(row => !row || typeof row !== 'object' || Array.isArray(row))) {
    throw new Error('The server returned an unexpected data format.')
  }
  return rows
}

// Document URLs are supplied by the CMS, not constructed from guessed IDs.
export function documentUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return ''
  const input = value.trim()
  if (/^https?:\/\//i.test(input)) return input
  if (/^[a-z][a-z\d+.-]*:|^\/\/|\\/i.test(input)) return ''
  return backendUrl(input.replace(/^\/(mpmsme|backend)(?=\/)/, ''))
}
