import { installCollectorActions, installViewActions } from './generated/actions'
import { createCollectorRequests, collectorLink, collectorDocument, downloadCollectorDocument } from './collectorService'

export function createCollectorState({ params, navigate, notify, signal, locale, batchCache, view }) {
  const state = {
    params, locale, notify, initialized: new Set(), preserveHeading: true,
    applications: [], searchText: '', responseObject: {}, batches: [], activeBatch: null,
    detail: null, detailHistory: [], dticInfo: {}, assistanceList: [], applicationNo: '',
    batchHeading: 'Collector Approval', remarkOptions: ['Approved', 'Rejected', 'Queried'],
    forwardLabel: 'Approve Batch (Digital Signature)', isCollector: true,
    resolveLink: collectorLink, documentPath: collectorDocument,
    navigate: path => path.startsWith('/mpmsme/') ? window.open(path, '_blank', 'noopener') : navigate(path),
    // Collector specific state
    approvedList: [],
    batchView: null,
    currentBatchId: null,
    signedDone: false,
    esignReady: false,
    esignLetterHtml: '',
    approveConfirmed: false,
    batchPdfHtml: '',
    esignApps: [],
    aadhaarLast4Digits: '',
    signOption: 'eSign',
  }
  Object.defineProperty(state, 'faActiveBatch', { get: () => batchCache.current, set: value => { batchCache.current = value } })
  const navigation = {
    open: path => window.open(collectorDocument(path), '_blank', 'noopener'),
    print: () => window.print(),
    location: {
      set href(value) { navigate(collectorLink(value)) },
      set hash(value) { navigate(collectorLink(value)) },
      get href() { return window.location.href }
    },
  }
  const request = createCollectorRequests(state, signal)
  const adapters = {
    request, navigation, params,
    loading: { start() { state.busy = true; notify() }, finish() { state.busy = false; notify() } },
    later: (fn, delay) => setTimeout(() => { if (!signal.aborted) { fn(); notify() } }, delay)
  }
  installCollectorActions(state, adapters)
  if (view) installViewActions(state, adapters)

  // Document resolvers & downloads
  state.downloadChequeDocuments = id => {
    if (id) navigation.open('downloadDoc/' + encodeURIComponent(id) + '/' + encodeURIComponent(params.applicationId))
  }
  state.goBack = () => window.history.state?.idx > 0 ? navigate(-1) : navigate(collectorLink('batches'), { replace: true })
  state.goBackToBatch = state.goBack
  state.prepareElement = (attrs, node) => {
    if (node.attrs?.href?.some(part => typeof part === 'string' && part.includes('javascript:history.back()'))) {
      attrs.onClick = event => { event.preventDefault(); state.goBack() }
    }
  }
  state.openRemarks = app => { state.remarkApp = app; notify() }
  state.viewHistory = app => request.get('history/' + encodeURIComponent(app.applicationId)).success(data => {
    state.historyModal = { applicationNo: app.applicationId, rows: data || [] }
  })
  state.downloadCoveringLetter = async batch => {
    if (!batch?.batchId) return
    try {
      await downloadCollectorDocument('downloadCoveringLetter/' + encodeURIComponent(batch.batchId), 'CoveringLetter-' + (batch.batchCode || batch.batchId), signal)
    } catch {
      if (!signal.aborted) {
        state.responseObject = { errorMessage: 'Covering letter is not available for this batch.' }
        notify()
      }
    }
  }
  state.downloadSigned = appId => {
    if (appId) downloadCollectorDocument('downloadSignedDocument/' + encodeURIComponent(appId), 'SignedDocument-' + appId, signal)
  }
  state.downloadBatchSigned = () => {
    if (state.currentBatchId) downloadCollectorDocument('downloadBatchSignedDocument/' + encodeURIComponent(state.currentBatchId), 'BatchSigned-' + state.currentBatchId, signal)
  }
  state.downloadCollectorSignedDoc = appId => {
    if (appId) downloadCollectorDocument('downloadCollectorSignedDoc/' + encodeURIComponent(appId), 'CollectorSigned-' + appId, signal)
  }
  state.printBatchPdf = () => {
    const html = state.batchPdfHtml
    if (!html) {
      alert('The Batch PDF is still being prepared. Please wait a moment and try again.')
      return
    }
    const w = window.open('', '_blank', 'width=1100,height=800')
    if (!w) {
      alert('Please allow pop-ups for this site to print the Batch PDF.')
      return
    }
    w.document.open()
    w.document.write(html)
    w.document.close()
    w.focus()
    setTimeout(() => { try { w.print() } catch (e) { } }, 400)
  }

  // Prevent multiple double submissions while busy
  for (const name of ['submitBatch', 'approveBatch', 'approveBatchWithoutSign', 'reject', 'markPending', 'raiseQuery']) {
    const action = state[name]
    if (typeof action === 'function') {
      state[name] = (...args) => { if (!state.busy) return action(...args) }
    }
  }

  return state
}

