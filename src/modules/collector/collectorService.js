import http, { get, post, download } from '../../api/httpClient'
import { COLLECTOR, fillPath } from '../../api/endpoints'
import axios from 'axios'
import { jsonData } from '../../api/responseData'
import { workflowList, workflowSuccess } from '../department/workflowResponses'

export const collectorLink = value => '/department/collector/' + String(value).replace(/^#\/?/, '')
export const collectorDocument = value => '/mpmsme/collector/' + String(value).replace(/^\//, '')

/**
 * Fetch applications processed by Collector.
 */
export async function fetchProcessed(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(COLLECTOR.FETCH_PROCESSED, params, { signal })
  return workflowList(data)
}

/**
 * Fetch applications pending Collector action.
 */
export async function fetchApplications(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(COLLECTOR.FETCH_APPLICATIONS, params, { signal })
  return workflowList(data)
}

/**
 * Fetch approved applications for Collector.
 */
export async function fetchApproved(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(COLLECTOR.FETCH_APPROVED, params, { signal })
  return workflowList(data)
}

/**
 * Fetch batches for Collector.
 */
export async function fetchBatches(search = '', signal) {
  const params = search ? { search } : {}
  const data = await get(COLLECTOR.FETCH_BATCHES, params, { signal })
  return workflowList(data)
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
      finally: fn => chain(promise.finally(() => { if (!signal.aborted) { fn(); state.notify() } })),
      then: (ok, fail) => {
        optionalFailure = typeof fail === 'function'
        return chain(promise.then(response => { if (!signal.aborted) { ok(response); state.notify() } return response }, fail))
      },
    }
  }
  return Object.fromEntries(['get', 'post'].map(method => [method, (endpoint, value) => {
    state.error = ''
    // The local DSC utility must not receive the portal session or CSRF headers.
    if (endpoint === 'http://localhost:8060/jsonsigner/Sign') {
      return chain(axios.post(endpoint, value, { signal, withCredentials: false, timeout: 60000 }).then(response => {
        response.data = jsonData(response.data)
        return response
      }))
    }
    return chain(http({ method, url: '/collector/' + endpoint, signal, ...(method === 'get' ? value : { data: value }) }).then(response => {
      if (method === 'get' && /^(batchApprovalSheetHtml|approvalSheetHtml|acceptanceLetterHtml)\//.test(endpoint)) {
        if (typeof response.data !== 'string' || !response.data.trim() || /loginForm|j_username|<title>Login/i.test(response.data)) throw new Error('The approval document is unavailable. Please reload before approving.')
        return response
      }
      if (typeof response.data === 'string' && /<html|<!doctype/i.test(response.data)) throw new Error('The server did not return Collector data. Please sign in again.')
      if (method === 'get') {
        const isEmpty = response.data == null || (typeof response.data === 'string' && !response.data.trim())
        if (isEmpty) {
          response.data = /^(fetchApplications|fetchBatches|fetchProcessed|fetchApproved|history|applicantAssistances)(\/|\?|$)/.test(endpoint) ? [] : {}
          return response
        }
      }
      response.data = method === 'post' && /^(submitBatch|saveSanctionedAmounts|saveBatchAmounts|applyCollectorDecisions|approveBatchWithoutSign|reject|pending|query|signApprovalPDF)(\/|\?|$)/.test(endpoint)
        ? workflowSuccess(response.data) : jsonData(response.data)
      if (method === 'get' && /^(fetchApplications|fetchBatches|fetchProcessed|fetchApproved|history|applicantAssistances)(\/|\?|$)/.test(endpoint)) response.data = workflowList(response.data)
      return response
    }).catch(error => {
      if (method === 'get' && /^(dticEligible|history|applicantAssistances)(\/|\?|$)/.test(endpoint)) {
        return { data: endpoint.startsWith('dticEligible') ? {} : [] }
      }
      throw error
    }))
  }]))
}

export const downloadCollectorDocument = (endpoint, filename, signal) => download('/collector/' + endpoint, {}, filename, { signal })

