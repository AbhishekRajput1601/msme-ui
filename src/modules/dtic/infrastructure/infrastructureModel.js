import axios from 'axios'
import http from '../../../api/httpClient'
import { filter, writePath } from '../../industrial-unit/viewHelpers'
import { dticDocument, dticLink } from '../dticService'
import { installInfrastructureActions } from './generated/actions'

export function validateInfrastructureFile(path, file) {
  if (!file) return ''
  const extension = file.name.split('.').pop().toLowerCase()
  if (path === 'vacantLandData.wdtKmlFile') return extension !== 'kml' ? 'Only .kml files are allowed.' : file.size >= 1048576 ? 'File size should not exceed 1 MB.' : ''
  if (path === 'formData.document' && (extension !== 'pdf' || file.type !== 'application/pdf')) return 'Only PDF files are allowed.'
  if (!['pdf','jpg','png','gif'].includes(extension)) return 'Only .jpg /.png /.gif /.pdf files are allowed.'
  const limit = path === 'leaseFile' ? 5 : 2
  return file.size > limit * 1024 * 1024 ? `File size should not exceed ${limit} MB.` : ''
}

// Preserve both legacy callback signatures and promise chaining, including HTTP
// status, multipart bodies, binary responses, and the local DSC signing service.
export function createInfrastructureRequests(state, signal, transport = http) {
  const report = error => {
    if (!signal.aborted) { state.error = error.response?.data?.errorMessage || error.message; state.busy = false; state.notify() }
  }
  function wrap(promise) {
    promise.catch(report)
    const next = (fn, fail) => wrap(promise.then(value => {
      if (signal.aborted) return value
      const result = fn ? fn(value) : value
      state.notify()
      return result
    }, fail))
    return {
      then: next,
      catch: fn => wrap(promise.catch(fn)),
      finally: fn => wrap(promise.finally(fn)),
      success: fn => next(response => { fn(response.data, response.status, response.headers, response.config); return response }),
      error: fn => wrap(promise.catch(error => { if (!signal.aborted) fn(error.response?.data, error.response?.status, error.response?.headers, error.config); throw error })),
    }
  }
  let writes = 0
  const request = config => {
    const localSigner = config.url === 'http://localhost:8060/jsonsigner/Sign'
    const method = (config.method || 'get').toLowerCase()
    const write = method !== 'get'
    if (write) { writes++; state.saving = true; state.error = ''; state.notify() }
    const headers = Object.fromEntries(Object.entries(config.headers || {}).filter(([,v]) => v != null))
    const options = { ...config, method, signal, headers, url: localSigner ? config.url : '/dtic/' + config.url.replace(/^\/?(?:dtic\/)?/, '') }
    delete options.transformRequest
    const client = localSigner && transport === http ? axios : transport
    return wrap(client(options).then(response => {
      if (typeof response.data === 'string' && !config.responseType) throw new Error('The server did not return infrastructure data. Please sign in again.')
      if (response.data?.errorMessage) throw new Error(response.data.errorMessage)
      return response
    }).finally(() => {
      if (write) { writes--; state.saving = writes > 0 }
      if (!signal.aborted) state.notify()
    }))
  }
  request.get = (url, config = {}) => request({ ...config, method: 'get', url })
  request.post = (url, data, config = {}) => request({ ...config, method: 'post', url, data })
  return request
}

export function createInfrastructureState({ params, navigate, notify, signal, locale, transport }) {
  const state = {
    params, locale, notify, initialized: new Set(), initializePerInstance: true, preserveHeading: true,
    responseObject: {}, error: '', busy: false, saving: false, listVersion: 0,
    resolveLink: dticLink, documentPath: dticDocument, modals: new Set(),
  }
  const request = createInfrastructureRequests(state, signal, transport)
  const loading = { start() { state.busy = true; notify() }, finish() { state.busy = false; notify() } }
  const navigation = {
    open: url => window.open(dticDocument(url), '_blank', 'noopener'),
    history: { back: () => navigate(-1) },
    location: { set href(value) { navigate(dticLink(value)) } },
  }
  const dom = selector => {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector
    const api = {
      val(value) { if (arguments.length) { if (el) el.value = value ?? ''; return api } return el?.value || '' },
      html: () => el?.innerHTML || '',
      attr(name, value) { if (el) el.setAttribute(name, value); return api },
      show() { if (el) el.style.display = ''; return api },
      submit() { if (el instanceof HTMLFormElement) HTMLFormElement.prototype.submit.call(el); return api },
    }
    return api
  }
  installInfrastructureActions(state, {
    request, loading, params, navigation, dom,
    format: name => (value, pattern) => name === 'IND' ? Number(value || 0).toFixed(2) : filter(name, value, pattern),
    later: (fn, delay) => setTimeout(() => { if (!signal.aborted) { fn(); notify() } }, delay),
  })
  // Angular ng-model implicitly materialized these objects; React must do so
  // before nested template initializers and the first dropdown change run.
  for (const key of ['industrialAreaData', 'industrialAreaRateData', 'collectorRateData', 'backlogData', 'vacantLandData', 'formData', 'noticeData', 'conditionalData', 'applicationData']) state[key] ||= {}
  const populate = state.populateForm
  state.populateForm = edit => request.get('fetchIndustrialAreaList').then(response => {
    state.industrialAreaList = response.data
    return populate(edit)
  })
  const loadVacantLand = state.loadVacantLandFormDetail
  state.loadVacantLandFormDetail = () => {
    loadVacantLand()
    if (!params.vacantLandId) {
      const next = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      const month = String(next.getMonth() + 1).padStart(2, '0')
      state.vacantLandData.bookingStartDate = `01/${month}/${next.getFullYear()} 11:00`
      state.vacantLandData.bookingEndDate = `15/${month}/${next.getFullYear()} 17:00`
    }
  }
  Object.assign(state, {
    applicantId: params.applicantId,
    vacantLandId: params.vacantLandId,
    request,
    resolveLink: hash => /^#\/?id\/landApplications\/?$/.test(hash) ? dticLink('#dticLandAllotment') : dticLink(hash),
    doTheBack: () => navigate(-1),
    cancel: event => event?.preventDefault?.(),
    setMapPolygon(points) { state.mapPoints = points; notify() },
    openModal(id) { state.modals.add(id); notify() },
    closeModal(id) { state.modals.delete(id); notify() },
    committee() { state.showCommitteeForm = true; notify() },
    openGroupLOI(applicant) { if (applicant?.applicantId) navigate(dticLink('#openGroupLOI/' + applicant.applicantId)) },
    tableParams: () => ({ industrialArea: state.legacyData.industrialAreaId || '' }),
    searchByLegecyDataFilters() { state.listVersion++; notify() },
    searchLandDatabyAreaFilters() { state.listVersion++; notify() },
    downloadAction(action, id) {
      if (!/^download\w+$/.test(action) || typeof state[action] !== 'function') throw new Error('Unknown infrastructure document action: ' + action)
      state[action](id)
    },
    inlineAction(action) {
      if (/history.back/.test(action)) navigate(-1)
      else if (/print/.test(action)) window.print()
      else if (/committee/.test(action)) state.committee()
      else if (/cancelPopup|closeModal/.test(action)) { state.modals.clear(); notify() }
      else throw new Error('Unsupported infrastructure action: ' + action)
    },
    previewFile(file) { state.checkFileSize(file ? [file] : []) },
    $apply: notify,
    writeField(scope, path, value) {
      if (value instanceof File) {
        state.fileError = validateInfrastructureFile(path, value)
        state.noFileError = false
        state.maxSizeError = state.fileError.includes('size')
        state.fileExtentionError = !!state.fileError && !state.maxSizeError
        if (state.fileError) value = null
      }
      writePath(scope, path, value)
      if (/^formData\.(h1BidAmount|advancePremiumH1|annualGroundRent|annualMaintenance|securityDeposite|otherCharges)$/.test(path)) {
        const n = key => Number(state.formData[key]) || 0
        state.formData.totalAmount = (n('h1BidAmount') - n('advancePremiumH1') + n('annualGroundRent') + n('annualMaintenance') + n('securityDeposite') + n('otherCharges')).toFixed(2)
      }
    },
    prepareField(attrs, node) {
      if (/\bdate(?:Start|End)\b/.test(attrs.className || '')) attrs.type = 'datetime-local'
      if (/\bdigits-only\b/.test(attrs.className || '')) { attrs.inputMode = 'numeric'; attrs.pattern ||= '[0-9]*' }
      if (/\bnumber-only\b/.test(attrs.className || '')) { attrs.inputMode = 'decimal'; attrs.pattern ||= '[0-9]+(\\.[0-9]+)?' }
      if (node.model === 'collectorRateData.fyFrom' || node.model === 'collectorRateData.fyTo') { attrs.inputMode = 'numeric'; attrs.pattern = '[0-9]{4}'; attrs.maxLength = 4 }
    },
    convertFieldValue(value, attrs) {
      if (attrs.type === 'datetime-local' && value) { const [date,time] = value.split('T'); return date.split('-').reverse().join('/') + ' ' + time }
      // Angular's native date inputs supplied Date objects to tender/committee actions.
      if (attrs.type === 'date' && !/\bdate\b/.test(attrs.className || '')) {
        const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
        if (match) return new Date(+match[3], +match[2]-1, +match[1])
      }
      return value
    },
    prepareElement(attrs, node) {
      if (attrs.type === 'datetime-local') {
        const m = String(attrs.value).match(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/)
        if (m) attrs.value = `${m[3]}-${m[2]}-${m[1]}T${m[4]}`
        const now = new Date()
        const next = new Date(now.getFullYear(), now.getMonth()+1, 1, 11)
        const pad = n => String(n).padStart(2,'0')
        attrs.min = `${next.getFullYear()}-${pad(next.getMonth()+1)}-01T11:00`
      }
      if (attrs['data-toggle'] === 'modal') {
        const id = (attrs['data-target'] || node.attrs?.href?.[0] || '').replace(/^#/, '')
        const click = attrs.onClick
        attrs.onClick = e => { e.preventDefault(); click?.(e); state.openModal(id) }
      }
      if (attrs['data-dismiss'] === 'modal') {
        attrs.type = 'button'
        attrs.onClick = e => { e.preventDefault(); state.closeModal(e.currentTarget.closest('.modal')?.id) }
      }
      if (attrs.className?.split(' ').includes('modal')) {
        const open = state.modals.has(attrs.id)
        attrs.style = { ...attrs.style, display: open ? 'block' : 'none' }
        attrs.className = attrs.className.replace(/\bfade\b/g, '') + (open ? ' in' : '')
        attrs.role = 'dialog'; attrs['aria-modal'] = open ? true : undefined
        attrs.onKeyDown = e => { if (e.key === 'Escape') state.closeModal(attrs.id) }
      }
      if (attrs.id === 'scrollTopBtn') attrs.onClick = () => window.scrollTo({ top:0,behavior:'smooth' })
      if (attrs.id === 'esginedAppFormDocId') {
        const documentId = state.applicationData.signedApplicationFormUploadDocId
        attrs.href = documentId ? dticDocument('downloadEsignDocument/' + encodeURIComponent(documentId)) : undefined
        attrs.onClick = e => { e.preventDefault(); if (documentId) state.downloadEsignedApplicationForm(documentId) }
      }
      if (node.inline_click === 'changeStyle()') attrs.onClick = () => { state.signatureStyle = true; notify() }
      if (attrs.id === 'myDiv' && state.signatureStyle) attrs.style = { ...attrs.style, marginRight:-320,marginTop:-90,fontWeight:'bold' }
      if (attrs.className?.split(' ').includes('btn-sign')) {
        const click = attrs.onClick
        attrs.onClick = e => { state.signatureStyle = true; click?.(e); notify() }
      }
    },
  })
  return state
}
