import assert from 'node:assert/strict'
import { installCollectorActions, installViewActions } from '../src/modules/collector/generated/actions.js'

const alerts = [], requests = []
globalThis.alert = message => alerts.push(message)
globalThis.confirm = () => true
let response = { successMessage: 'Saved' }
const chain = data => ({
  success(fn) { fn(data); return this },
  error() { return this },
  then(fn) { fn({ data }); return this }
})
const request = {
  get(url) {
    requests.push({ method: 'get', url })
    if (url === 'fetchBatches') return chain([])
    if (url.startsWith('batchDetail/')) {
      return chain({
        batchId: 5,
        applications: [{
          applicationNo: 'APP-1',
          eligibleAmount: 5000,
          assistanceList: [{ id: 1, assistanceId: 10, assistanceType: 'Capital subsidy', eligibleAmount: 5000 }]
        }]
      })
    }
    if (url.startsWith('batchViewData/')) {
      return chain({
        batchId: 5,
        batchCode: 'BATCH-5',
        totalApplications: 1,
        applications: [{
          applicationNo: 'APP-1',
          assistanceList: [{ id: 1, assistanceType: 'Capital subsidy', eligibleAmount: 5000, sanctionedAmount: 5000 }]
        }]
      })
    }
    if (url.startsWith('batchApprovalSheetHtml/')) return chain('<div>Approval Sheet</div>')
    if (url === 'fetchProcessed') return chain([])
    if (url === 'fetchApproved') return chain([])
    return chain({})
  },
  post(url, data) {
    requests.push({ method: 'post', url, data })
    return chain(response)
  }
}

const state = { applications: [], searchText: '', responseObject: {}, remarkOptions: ['Approved', 'Rejected', 'Queried'] }
const adapters = {
  request,
  params: { applicationId: 'APP-1', batchId: '5' },
  navigation: { location: {}, open() { } },
  loading: { start() { }, finish() { } },
  later() { }
}

installCollectorActions(state, adapters)

// 1. Status 22 is Collector pending status
state.applications = [
  { applicationId: 'APP-1', currentStatusId: 22, selected: true, remark: 'Approved' },
  { applicationId: 'APP-2', currentStatusId: 6, selected: true }
]
assert.equal(state.isProcessed(state.applications[0]), false)
assert.equal(state.isProcessed(state.applications[1]), true)
assert.deepEqual(state.getSelected(), [{ applicationNo: 'APP-1', remark: 'Approved' }])

// 2. Open Batch & onRemarkChange
state.openBatch({ batchId: 5 })
const app = state.activeBatch.applications[0]
assert.equal(app.remark, 'Approved')
assert.equal(app.sanctionedAmount, 5000)

// Rejected sets amounts to 0
app.remark = 'Rejected'
state.onRemarkChange(app)
assert.equal(app.sanctionedAmount, 0)
assert.equal(app.amountAssist[0].sanctionedAmount, 0)

// Approved restores eligible amount
app.remark = 'Approved'
state.onRemarkChange(app)
assert.equal(app.sanctionedAmount, 5000)
assert.equal(app.amountAssist[0].sanctionedAmount, 5000)

// 3. Subtotals
assert.equal(state.subtotalProposed(app), 5000)
assert.equal(state.subtotalApproved(app), 5000)

// 4. Validation: Sanctioned cannot exceed Eligible
app.amountAssist[0].sanctionedAmount = 6000
state.approveBatch()
assert.match(alerts.at(-1), /cannot be more than the Eligible Amount/)

// 5. Validation: Mandatory remark note if sanctioned != eligible
app.amountAssist[0].sanctionedAmount = 4000
app.remarkText = ''
state.approveBatch()
assert.match(alerts.at(-1), /Remark Note is mandatory when a Sanctioned Amount differs/)

// 6. Successful approveBatch flow
app.remarkText = 'Reduced per committee recommendation'
state.approveBatch()
assert(requests.some(r => r.url === 'saveSanctionedAmounts'))
assert(requests.some(r => r.url === 'saveBatchAmounts/5'))
assert(requests.some(r => r.url === 'applyCollectorDecisions/5'))

// 7. Batch Sign view & approval without digital signature
state.initBatchSign()
assert.equal(state.currentBatchId, '5')
assert.equal(state.esignReady, true)
assert.equal(state.approveConfirmed, false)

// Confirmation checkbox mandatory
state.approveBatchWithoutSign()
assert.match(alerts.at(-1), /Please confirm that you have reviewed/)

state.approveConfirmed = true
response = { successMessage: 'Batch approved successfully.' }
state.approveBatchWithoutSign()
assert.equal(state.signedDone, true)

// 8. Documents & null guards
state.detail = { panUploadId: 10, faIndustrialUnitBean: { schemeDocUploadId: 20 } }
assert.deepEqual(state.documentList(), [{ label: 'PAN Card', id: 10 }, { label: 'Scheme Document', id: 20 }])

// 9. View actions
installViewActions(state, adapters)
assert.equal(state.disabled, true)
assert.equal(state.isVerificationView, true)
assert.equal(state.calcTotal([{ amount: 100 }, { amount: 250 }]), '350.00')

console.log('PASS: Collector status locking, batch decision changes, sanction amount validation, remark note requirement, approval sheet loading, confirmation checks, documents list, and view calculations.')

