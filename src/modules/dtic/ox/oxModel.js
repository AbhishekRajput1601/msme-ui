import { installActions } from '../generated/DTICController'
import { createInfrastructureRequests } from '../infrastructure/infrastructureModel'
import { filter } from '../../industrial-unit/viewHelpers'
import toast from '../../../utils/toast'

export function exportOxTable(fileName, tableId) {
  const table = document.querySelector(tableId)
  if (!table) throw new Error('The export table is not available.')
  const blob = new Blob(['\ufeff<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table>', table.innerHTML, '</table></body></html>'], { type: 'application/vnd.ms-excel;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = fileName + '.xls'; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function createOxState({ number, locale, signal, notify, transport }) {
  const state = { locale, notify, initialized: new Set(), initializePerInstance: true, stableRepeatScopes: true, preserveHeading: true, responseObject: {}, error: '', saving: false, busy: false }
  const request = createInfrastructureRequests(state, signal, transport)
  const loading = { start() { state.busy = true; notify() }, finish() { state.busy = false; notify() } }
  installActions(state, { request, loading, params: {}, navigation: {}, format: name => (value, pattern) => filter(name, value, pattern), later: (fn, delay) => setTimeout(() => { if (!signal.aborted) { fn(); notify() } }, delay) })
  state[`ox${number}Data`] = {}
  state.exportToExcel1 = exportOxTable
  state.prepareField = attrs => {
    if (attrs.id === 'entryDate') attrs.max = filter('date', new Date(), 'yyyy-MM-dd')
  }
  state.prepareElement = attrs => {
    if (attrs.id === 'submitBtn') attrs.disabled ||= state.saved
    const classes = attrs.className || ''
    if (/number-OnlyThreeDecimal|digits-only/.test(classes)) {
      const decimal = classes.includes('number-OnlyThreeDecimal')
      attrs.inputMode = decimal ? 'decimal' : 'numeric'
      attrs.onKeyPress = event => {
        const el = event.currentTarget
        const next = el.value.slice(0, el.selectionStart) + event.key + el.value.slice(el.selectionEnd)
        if (!(decimal ? /^\d*(?:\.\d{0,3})?$/ : /^\d*$/).test(next)) event.preventDefault()
      }
      if (!decimal) for (const event of ['onCut', 'onCopy', 'onPaste']) attrs[event] = e => e.preventDefault()
    }
  }
  // React owns button/request lifecycles; the original stock rules stay intact.
  let version = 0
  state[`fetchOx${number}FormDetails`] = () => {
    const current = ++version
    state.saved = false; loading.start()
    return request.get(`fetchOx${number}FormDetails`, { params: { entryDate: state[`ox${number}Data`].entryDate } }).then(response => {
      if (current !== version) return
      state[`ox${number}Data`] = response.data || {}
      loading.finish()
    })
  }
  state[`saveOX${number}Form`] = valid => {
    if (!valid || state.saving || state.saved || state.isNotCurrent) return
    if (!window.confirm('Are you sure you want to save the data?')) return
    loading.start()
    return request.post(`saveOX${number}Form`, state[`ox${number}Data`]).then(response => {
      state.responseObject = response.data
      state.saved = number !== 1 && !!response.data?.successMessage
      loading.finish()
      if (response.data?.successMessage) {
        toast.success(response.data.successMessage)
        setTimeout(() => { if (!signal.aborted) { state.responseObject.successMessage = null; notify() } }, 10000)
      }
    })
  }
  // Blur normalizes quantities to numbers; validation accepts numbers and text.
  for (const [action, key, label] of [['checkSupplyQty', 'supplyQty', 'Supply'], ['checkReceivedQty', 'receivedQty', 'Received']]) {
    state[action] = row => {
      if (row[key] != null && Number(String(row[key]).split('.')[0]) > 99) {
        toast.warning(`${label} Qty (KL) should be less than 100`)
        row[key] = null
      }
    }
  }
  return state
}
