import http from '../../api/httpClient'
import { businessError } from '../industrial-unit/viewHelpers'

export const financialDocument = path => '/mpmsme/fa/' + String(path).replace(/^\/?(?:fa\/)?/, '')
export const financialLink = hash => {
  const route=String(hash).split('#').at(-1).replace(/^\/?/, '')
  const aliases={dticfapendingapplicantsapparel:'fa/newapplicantformapparel',dticpendingapplicants:'dticfapendingapplicantsunit',dticpendingyuvaudhami:'dticfapendingapplicantsunit'}
  return '/department/fa/' + (aliases[route] || route.replace(/^viewfaacceptanceamountdetailunit\//,'fa/viewfaacceptanceamountdetailunit/'))
}

export async function financialRequest(method, endpoint, data, signal) {
  const config = { method, url: '/fa/' + endpoint.replace(/^\//, ''), signal }
  if (method === 'get') config.params = data
  else config.data = data
  const response = await http(config)
  if (typeof response.data === 'string' && /<html|<!doctype|id="loginForm"|<title>Login/i.test(response.data)) {
    throw new Error('The server did not return Financial data. Please sign in again.')
  }
  if (response.data == null) return null
  // Audit endpoints return newly saved process IDs in the legacy errorMsgList
  // property; these IDs are then sent with the document upload.
  if (/^saveDTICOpinion(?:ExternalAudit|InternalAudit|FactualDetail|ProformaClause)$/.test(endpoint)
    && !response.data.errorMessage && Array.isArray(response.data.errorMsgList)
    && response.data.errorMsgList.every(value => /^\d+$/.test(String(value)))) return response.data
  return businessError(response.data)
}

// Adapts statically ported request callbacks to the shared Axios client.
// Every rejected request reaches the page error state, including legacy error callbacks.
export function createFinancialRequests(state, signal) {
  function task(promise) {
    promise.catch(error => {
      if (!signal.aborted) { state.error = error.message; state.busy = false; state.saving = false; state.notify() }
    })
    const next = fn => task(promise.then(value => {
      if (signal.aborted) return value
      const result = fn(value); state.notify(); return result
    }))
    return {
      success: fn => next(result => { fn(result.data); return result }),
      error: fn => task(promise.catch(error => { if (!signal.aborted) fn(error); throw error })),
      then: (fn, fail) => next(fn).catch(fail || (error => { throw error })),
      finally: fn => task(promise.finally(fn)),
      catch: fn => task(promise.catch(error => { const result = fn(error); state.notify(); return result })),
    }
  }
  const request = config => request[config.method.toLowerCase()](config.url, config.data || config)
  request.get = (url, config = {}) => task(financialRequest('get', url, config.params, signal).then(data => ({ data })))
  request.post = (url, body) => {
    state.saving = true; state.error = ''; state.notify()
    return task(financialRequest('post', url, body, signal).then(data => ({ data })).finally(() => {
      state.saving = false; if (!signal.aborted) state.notify()
    }))
  }
  return request
}
