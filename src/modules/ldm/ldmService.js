import http, { get, post, download } from '../../api/httpClient'
import { LDM, fillPath } from '../../api/endpoints'

export const ldmLink = value => '/department/ldm/' + String(value).replace(/^#\/?/, '')
export const ldmDocument = value => '/mpmsme/ldm/' + String(value).replace(/^\//, '')

/**
 * Fetch applications pending LDM verification (status 21 / Secretary Verified).
 */
export async function fetchApplications(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(LDM.FETCH_APPLICATIONS, params, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch all batches pending at LDM stage.
 */
export async function fetchBatches(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(LDM.FETCH_BATCHES, params, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch verification history for an application.
 */
export async function fetchVerificationHistory(applicationNo, signal) {
  const url = fillPath(LDM.HISTORY, { applicationNo })
  const data = await get(url, {}, { signal })
  return Array.isArray(data) ? data : []
}

/**
 * Fetch application detail for an application.
 */
export async function fetchApplicationDetail(applicationNo, signal) {
  const url = fillPath(LDM.DETAIL_DATA, { applicationNo })
  return await get(url, {}, { signal })
}

export function createLdmRequests(state, signal) {
  function chain(promise) {
    let optionalFailure=false
    promise.catch(error => {
      if (!signal.aborted && !optionalFailure) { state.error = error.message; state.busy = false; state.notify() }
    })
    return {
      success: fn => chain(promise.then(response => { if (!signal.aborted) { fn(response.data); state.notify() } return response })),
      error: fn => chain(promise.catch(error => { if (!signal.aborted) { fn(error); state.notify() } throw error })),
      then: (ok, fail) => {
        optionalFailure=typeof fail==='function'
        return chain(promise.then(response => { if (!signal.aborted) { ok(response); state.notify() } return response },fail))
      },
    }
  }
  return Object.fromEntries(['get','post'].map(method => [method, (endpoint, value) => {
    state.error = ''
    return chain(http({method, url:'/ldm/'+endpoint, signal, ...(method === 'get' ? value : {data:value})}).then(response => {
      if (typeof response.data === 'string' && /<html|<!doctype/i.test(response.data)) throw new Error('The server did not return LDM data. Please sign in again.')
      return response
    }))
  }]))
}

export const downloadLdmDocument = (endpoint, filename, signal) => download('/ldm/'+endpoint, {}, filename, {signal})
