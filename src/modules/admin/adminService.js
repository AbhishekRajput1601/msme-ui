import http, { download } from '../../api/httpClient'

export const adminLink = value => {
  const raw = String(value || '')
  const clean = (raw.includes('#') ? raw.slice(raw.indexOf('#') + 1) : raw).replace(/^\/?admin\/?/, '').replace(/^\//, '')
  return clean ? `/admin/${clean}` : '/admin/dashboard'
}

export const adminDocument = value => {
  const clean = String(value || '').replace(/^\//, '')
  if (clean.startsWith('mpmsme/')) return `/${clean}`
  return `/mpmsme/adminSection/${clean}`
}

// Axios already supplies /mpmsme as baseURL. Keep API paths relative to it.
export function adminApiPath(endpoint) {
  const path = String(endpoint || '').trim()
  if (/^https?:\/\//.test(path)) return path
  if (path.startsWith('/mpmsme/')) return path.slice('/mpmsme'.length)
  if (path.startsWith('/')) return path
  return '/adminSection/' + path
}

export async function adminRequest(method, endpoint, data, signal) {
  const response = await http({ method, url: adminApiPath(endpoint), ...(method === 'get' ? { params: data } : { data }), signal })
  if (typeof response.data === 'string' && /<html|<!doctype/i.test(response.data)) throw new Error('The server did not return admin data. Please sign in again.')
  return response.data
}

export function createAdminRequests(state, signal) {
  function chain(promise) {
    let optionalFailure = false
    promise.catch(error => {
      if (!signal?.aborted && !optionalFailure) {
        state.error = error.message
        state.busy = false
        state.notify()
      }
    })
    return {
      success: fn =>
        chain(
          promise.then(response => {
            if (!signal?.aborted) {
              fn(response?.data, response?.status, response?.headers)
              state.notify()
            }
            return response
          })
        ),
      error: fn =>
        chain(
          promise.catch(error => {
            if (!signal?.aborted) {
              fn(error)
              state.notify()
            }
            throw error
          })
        ),
      then: (ok, fail) => {
        optionalFailure = typeof fail === 'function'
        return chain(
          promise.then(
            response => {
              if (!signal?.aborted && typeof ok === 'function') {
                ok(response)
                state.notify()
              }
              return response
            },
            err => {
              if (typeof fail === 'function') {
                fail(err)
                state.notify()
              }
              throw err
            }
          )
        )
      },
    }
  }

  function resolveUrl(endpoint) {
    return adminApiPath(endpoint)
  }

  return {
    get: (endpoint, config = {}) => {
      state.error = ''
      const url = resolveUrl(endpoint)
      return chain(
        http({ method: 'get', url, signal, ...config }).then(response => {
          if (typeof response.data === 'string' && /<html|<!doctype/i.test(response.data) && !url.includes('Html')) {
            throw new Error('The server did not return valid admin data. Please sign in again.')
          }
          return response
        })
      )
    },
    post: (endpoint, data, config = {}) => {
      state.error = ''
      const url = resolveUrl(endpoint)
      const headers = config?.headers || {}
      if (data instanceof FormData) {
        // Axios handles multipart boundaries automatically
        delete headers['Content-Type']
      }
      return chain(
        http({ method: 'post', url, data, signal, ...config, headers }).then(response => {
          if (typeof response.data === 'string' && /<html|<!doctype/i.test(response.data) && !url.includes('Html')) {
            throw new Error('The server did not return valid admin data. Please sign in again.')
          }
          return response
        })
      )
    },
  }
}

export function exportTableToExcel(tableId, fileName = 'Report.xls', worksheetName = 'Report') {
  const el = typeof tableId === 'string' ? document.getElementById(tableId) || document.querySelector(tableId) : tableId
  if (!el) return
  const clone = el.cloneNode(true)
  const links = clone.querySelectorAll('a')
  links.forEach(a => {
    const span = document.createElement('span')
    span.textContent = a.textContent
    a.parentNode?.replaceChild(span, a)
  })
  const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body><table>${clone.innerHTML}</table></body></html>`
  const blob = new Blob([template], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName.endsWith('.xls') || fileName.endsWith('.xlsx') ? fileName : `${fileName}.xls`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const downloadAdminDocument = (endpoint, filename, signal) =>
  download(`/adminSection/${endpoint.replace(/^\/?adminSection\//, '')}`, {}, filename, { signal })

