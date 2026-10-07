import http from '../../api/httpClient'
import { businessError } from './viewHelpers'

export async function getUnitData(endpoint, params, signal) {
  const response = await http.get(`/applicant/${endpoint.replace(/^\//, '')}`, { params, signal })
  if (typeof response.data === 'string' && /^\s*</.test(response.data)) throw new Error('The server did not return Industrial Unit data. Please sign in again.')
  return businessError(response.data)
}

export async function saveUnitData(endpoint, data, signal) {
  const response = await http.post(`/applicant/${endpoint}`, data, { signal })
  if (!response.data || typeof response.data !== 'object') throw new Error('The server did not confirm that the data was saved.')
  return businessError(response.data)
}

// Data-loading actions share a small request boundary, without Angular services.
export function createRequests(state, notify, signal) {
  function task(promise) {
    promise.catch(error => { if (!signal.aborted) { state.error = error.message; state.busy = false; notify() } })
    const next = fn => task(promise.then(async result => { if (signal.aborted) return result; const output = await fn(result); notify(); return output }))
    return {
      success: fn => next(result => { fn(result.data); return result }),
      error: fn => task(promise.catch(error => { fn(error); throw error })),
      then: (fn, fail) => fail ? task(promise.then(result => { const value = fn(result); notify(); return value }, error => { fail(error); throw error })) : next(fn),
      catch: fn => task(promise.catch(error => { const value = fn(error); notify(); return value })),
      finally: fn => task(promise.finally(() => { fn(); notify() })),
    }
  }
  const request = config => request[config.method.toLowerCase()](config.url, config.method === 'POST' ? config.data : config)
  request.get = (url, config = {}) => task(getUnitData(url, config.params, signal).then(data => ({ data })))
  request.post = (url, data) => task(saveUnitData(url, data, signal).then(data => ({ data })))
  return request
}
