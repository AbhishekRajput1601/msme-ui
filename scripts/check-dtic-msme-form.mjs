import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { createDticState } = await server.ssrLoadModule('/src/modules/dtic/dticModel.js')
  const { expressions } = await server.ssrLoadModule('/src/modules/dtic/generated/expressions.js')
  const { default: views } = await server.ssrLoadModule('/src/modules/dtic/generated/views.json')
  const create = () => createDticState({ params: {}, navigate() {}, notify() {}, signal: new AbortController().signal, locale: 'en', controller: 'DTICMSMEController' })
  const state = create()
  assert.deepEqual(state.msmeDetailData.activityDetailsList, [{}])
  // Execute the actual nested template initializer that previously crashed on opening the form.
  let initialized = false
  function visit(nodes) {
    for (const node of nodes || []) {
      if (node.init != null && String(expressions[node.init]).includes('activityDetailsList')) {
        expressions[node.init](state)
        initialized = true
      }
      visit(node.children)
    }
  }
  visit(views['dtic/viewmsmeform'])
  assert(initialized, 'Must exercise the form activity initializer')
  state.addNewUamDetailsChoice()
  assert.equal(state.msmeDetailData.activityDetailsList.length, 2)
  state.removeUamDetailsChoice()
  assert.equal(state.msmeDetailData.activityDetailsList.length, 1)
  state.msmeDetailData.uamNumber = 'UDYAM-TEST'
  state.resetUAMAvailDetailsIfNo()
  assert.equal(state.msmeDetailData.uamNumber, null)
  assert.equal(state.msmeDetailData.udyogAadhaar, 'no')
  assert.deepEqual(state.msmeDetailData.activityDetailsList, [{}])
  state.resetUAMAvailDetailsIfYes()
  assert.deepEqual(state.msmeDetailData.activityDetailsList, [{}])
  state.msmeDetailData.activityDetailsList[0].activityType = 'test'
  assert.deepEqual(create().msmeDetailData.activityDetailsList, [{}], 'New forms must not share state')
  assert.equal(state.error, '')
  console.log('PASS: MSME template initialization, add/remove activities, registration resets, and fresh form state.')
} finally {
  await server.close()
}
