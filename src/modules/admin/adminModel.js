import { installAdminActions } from './generated/actions'
import { createAdminRequests, adminLink, adminDocument, exportTableToExcel } from './adminService'
import { filter } from '../industrial-unit/viewHelpers'

export function createAdminState({ params = {}, navigate, notify = () => {}, signal, locale = 'en' }) {
  const state = {
    params,
    locale,
    notify,
    initialized: new Set(),
    initializePerInstance: true,
    listVersion: 0,
    changePasswordData: {},
    preserveHeading: true,
    busy: false,
    error: '',
    responseObject: {},
    disabled: true,

    // Navigation and Link resolvers
    resolveLink: adminLink,
    documentPath: adminDocument,
    navigate: path => (path.startsWith('/mpmsme/') ? window.open(path, '_blank', 'noopener') : navigate(path)),

    // Counters
    hoCount: 0,
    zonalCount: 0,
    officerCount: 0,
    dticCount: 0,

    // Lists & Masters
    hoList: [],
    officerList: [],
    zonalList: [],
    dticList: [],
    applicantList: [],
    officeList: [],
    externalOfficerList: [],
    userList: [],
    supplierList: [],
    supplyNameList: [],
    supplySourceList: [],
    tankerList: [],
    tankerSupplierList: [],
    dticDistricts: [],
    districts: [],
    tehsils: [],
    permanentDistricts: [],
    permanentTehsils: [],
    statusList: [],
    genderList: [],
    designationList: [],
    groupList: [],
    officeTypes: [],
    respondentStates: [],

    // Form Data
    signupData: {},
    officeData: {},
    supplierData: {},
    supplyData: {},
    tankerData: {},
    ox1Data: { ox1BeanList: [] },
    ox2Data: { ox2BeanList: [] },
    ox3Data: { ox3BeanList: [] },
    ox4Data: { ox4BeanList: [] },
    tankerMgmtFormBean: {},
    entryDate: new Date().toISOString().split('T')[0],
    searchText: '',
  }

  const navigation = {
    open: path => window.open(adminDocument(path), '_blank', 'noopener'),
    print: () => window.print(),
    location: {
      set href(value) {
        navigate(adminLink(value))
      },
      set hash(value) {
        navigate(adminLink(value))
      },
      get href() {
        return window.location.href
      },
      reload() {
        window.location.reload()
      },
    },
  }

  const request = createAdminRequests(state, signal)

  const adapters = {
    request,
    navigation,
    params,
    loading: {
      start() {
        state.busy = true
        notify()
      },
      finish() {
        state.busy = false
        notify()
      },
    },
    later: (fn, delay = 0) => setTimeout(() => {
      if (!signal?.aborted) {
        fn()
        notify()
      }
    }, delay),
    format: name => (value, pattern) => filter(name, value, pattern),
    animateCounter: (id, target) => {
      state[id] = target
      notify()
    },
  }

  // Install statically compiled controller actions
  installAdminActions(state, adapters)
  for (const [name, action] of Object.entries(state)) {
    if (typeof action !== 'function' || !/^(update|insert|save|delete|add|changePassword)/.test(name) || !/request\s*\.\s*(post|get)/.test(String(action))) continue
    // Some legacy loaders replace their save handler after loading a record.
    // Keep the submission guard when that handler is reassigned.
    const guarded = fn => (...args) => {
      if (state.saving || state.busy) return
      return fn(...args)
    }
    let handler = guarded(action)
    Object.defineProperty(state, name, {
      enumerable: true,
      configurable: true,
      get: () => handler,
      set: fn => { handler = guarded(fn) },
    })
  }

  // These legacy actions invoked page-local jQuery DataTables functions.
  // React owns fetching, filtering and pagination through DticTable instead.
  for (const name of ['loadHoList', 'loadofficerList', 'loadzonalList', 'loaddticList', 'loadapplicantList', 'loadofficeList', 'loadExternalOfficerList', 'loadSupplierNameListAdmin', 'loadSupplierListAdmin', 'loadSupplyNameListAdmin', 'loadTankerList', 'loadSupplySourceList', 'loadTankerSupplierNameList', 'loadUserList']) {
    state[name] = () => { state.listVersion++; state.busy = false; notify() }
  }
  state.inlineAction = action => {
    if (/history.back|goBack/.test(action)) state.goBack()
    else if (/print\(/.test(action)) window.print()
    else throw new Error('Unsupported admin action: ' + action)
  }

  // Excel export adapter
  state.exportToExcel = (tableId) => {
    exportTableToExcel(tableId, 'Export-' + Date.now() + '.xls')
  }
  state.exportToExcel1 = (fileName, tableId) => {
    exportTableToExcel(tableId, (fileName || 'Export') + '.xls')
  }

  // Back button navigation
  state.goBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/admin/dashboard', { replace: true })
    }
  }

  state.prepareElement = (attrs, node) => {
    if (attrs.id === 'submitBtn') attrs.disabled = Boolean(attrs.disabled || state.busy || state.saving)
    if (
      node.attrs?.href?.some?.(
        part => typeof part === 'string' && part.includes('javascript:history.back()')
      )
    ) {
      attrs.onClick = event => {
        event.preventDefault()
        state.goBack()
      }
    }
  }

  // Form toggling
  const originalToggle = state.toggleCaseForm
  state.toggleCaseForm = () => {
    if (typeof originalToggle === 'function') {
      originalToggle()
    } else state.disabled = !state.disabled
    notify()
  }

  return state
}

