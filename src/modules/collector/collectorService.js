import http, { get, post, download } from '../../api/httpClient'
import { COLLECTOR, fillPath } from '../../api/endpoints'

export const collectorLink = value => '/department/collector/' + String(value).replace(/^#\/?/, '')
export const collectorDocument = value => '/mpmsme/collector/' + String(value).replace(/^\//, '')

/**
 * Fetch applications processed by Collector.
 */
export async function fetchProcessed(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(COLLECTOR.FETCH_PROCESSED, params, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch applications pending Collector action.
 */
export async function fetchApplications(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(COLLECTOR.FETCH_APPLICATIONS, params, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch approved applications for Collector.
 */
export async function fetchApproved(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(COLLECTOR.FETCH_APPROVED, params, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch batches for Collector.
 */
export async function fetchBatches(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(COLLECTOR.FETCH_BATCHES, params, { signal })
  return Array.isArray(data) ? data : []
}

export function createCollectorRequests(state, signal) {
  function chain(promise) {
    let optionalFailure = false
    promise.catch(error => {
      if (!signal.aborted && !optionalFailure) { state.error = error.message; state.busy = false; state.notify() }
    })
    return {
      success: fn => chain(promise.then(response => { if (!signal.aborted) { fn(response.data); state.notify() } return response })),
      error: fn => chain(promise.catch(error => { if (!signal.aborted) { fn(error); state.notify() } throw error })),
      then: (ok, fail) => {
        optionalFailure = typeof fail === 'function'
        return chain(promise.then(response => { if (!signal.aborted) { ok(response); state.notify() } return response }, fail))
      },
    }
  }
  return Object.fromEntries(['get', 'post'].map(method => [method, (endpoint, value) => {
    state.error = ''
    return chain(http({ method, url: '/collector/' + endpoint, signal, ...(method === 'get' ? value : { data: value }) }).then(response => {
      if (typeof response.data === 'string' && /<html|<!doctype/i.test(response.data)) throw new Error('The server did not return Collector data. Please sign in again.')
      return response
    }))
  }]))
}

export const downloadCollectorDocument = (endpoint, filename, signal) => download('/collector/' + endpoint, {}, filename, { signal })

