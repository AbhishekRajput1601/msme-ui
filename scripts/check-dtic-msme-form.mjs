import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { createDticState } = await server.ssrLoadModule('/src/modules/dtic/dticModel.js')
  const { expressions } = await server.ssrLoadModule('/src/modules/dtic/generated/expressions.js')
  const { default: views } = await server.ssrLoadModule('/src/modules/dtic/generated/views.json')
  const { isBackControl } = await server.ssrLoadModule('/src/modules/industrial-unit/IndustrialView.jsx')
  let testedSubmit = false, testedBack = false
  function checkNavigation(nodes, ancestors = []) {
    for (const node of nodes || []) {
      if (node.tag === 'button' && node.attrs?.type?.[0] === 'submit') {
        testedSubmit = true
        for (const ancestor of [...ancestors, node]) assert.equal(isBackControl(ancestor), false, `${ancestor.tag} must not cancel Submit by navigating back`)
      }
      if (node.tag === 'a' && node.children?.some(c => c.translation === 'application.page.back')) {
        testedBack = true
        assert.equal(isBackControl(node), true)
      }
      checkNavigation(node.children, [...ancestors, node])
    }
  }
  checkNavigation(views['dtic/viewmsmeform'])
  assert.ok(testedSubmit && testedBack)
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
  let registrationField, registrationValueField
  function findRegistrationFields(nodes) {
    for (const node of nodes || []) {
      if (node.model === 'msmeDetailData.previousRegistrationName') registrationField = node
      if (node.model === 'msmeDetailData.previousRegistrationValue') registrationValueField = node
      findRegistrationFields(node.children)
    }
  }
  findRegistrationFields(views['dtic/viewmsmeform'])
  assert.ok(registrationField?.change != null)
  assert.ok(registrationValueField?.required != null)
  for (const name of ['EM1', 'EM2', 'SSI', 'NONE', '', null]) {
    state.msmeDetailData.previousRegistrationName = name
    expressions[registrationField.change](state)
    assert.equal(Boolean(expressions[registrationValueField.required](state)), Boolean(name && name !== 'NONE'), `Registration number requirement for ${name}`)
  }
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
  const { default: http } = await server.ssrLoadModule('/src/api/httpClient.js')
  const originalAdapter = http.defaults.adapter
  const originalWindow = globalThis.window
  globalThis.window = { confirm: () => true, location: { pathname: '/department/dtic/viewmsmeform' } }
  try {
    let calls = [], destinations = [], saveResponse = { id: 123, successMessage: 'Saved' }, uploadFails = false
    http.defaults.adapter = async config => {
      calls.push(config.url)
      if (config.url.endsWith('uploadMsmeDetailDocument')) {
        assert.deepEqual(destinations, [], 'Must wait for upload before navigating')
        if (uploadFails) throw new Error('Upload failed')
      }
      return { config, status: 200, statusText: 'OK', headers: {}, data: config.url.endsWith('addmsmedetail')
        ? saveResponse : config.url.endsWith('fetchmsmedetailbyid') ? { msmeDetailId: 123 } : config.url.endsWith('uploadMsmeDetailDocument') ? { successMessage: 'Uploaded' } : { value: 'Save?' } }
    }
    const submission = createDticState({ params: {}, navigate: path => destinations.push(path), notify() {}, signal: new AbortController().signal, locale: 'en', controller: 'DTICMSMEController' })
    await submission.addMSMEDetailFunction({}, false)
    assert.equal(calls.length, 0, 'Invalid forms must not send save requests')
    assert.match(submission.error, /has not been saved/)
    await submission.addMSMEDetailFunction({}, true)
    assert.deepEqual(destinations, ['/department/dtic/viewapplicationlist'])
    calls = []; destinations = []; saveResponse = { errorMessage: 'Duplicate registration' }
    await submission.addMSMEDetailFunction({}, true)
    assert.match(submission.error, /Duplicate registration/)
    assert.deepEqual(destinations, [])
    saveResponse = { successMessage: 'Saved' }
    for (const id of [0, '0', -1, '', null]) {
      calls = []
      saveResponse = { id, successMessage: 'Saved' }
      await submission.addMSMEDetailFunction({}, true)
      assert.match(submission.error, /did not confirm/)
      assert.ok(!calls.some(url => url.endsWith('fetchmsmedetailbyid')), 'Invalid saved IDs must never be fetched')
      assert.deepEqual(destinations, [])
    }
    saveResponse = { successMessage: 'Saved' }
    await submission.addMSMEDetailFunction({}, true)
    assert.match(submission.error, /did not confirm/)
    assert.deepEqual(destinations, [])
    saveResponse = { id: 123, successMessage: 'Saved' }
    const files = { employmentGivenUpload: new Blob(['document']) }
    await submission.addMSMEDetailFunction({}, true, files)
    assert.deepEqual(destinations, ['/department/dtic/viewapplicationlist'])
    destinations = []; uploadFails = true
    await submission.addMSMEDetailFunction({}, true, files)
    assert.match(submission.error, /record 123 was saved, but its document upload failed/)
    assert.deepEqual(destinations, [])
    assert.equal(submission.saving, false)
  } finally {
    http.defaults.adapter = originalAdapter
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
  console.log('PASS: MSME form initialization, validation, save confirmation and read-back, server rejection, upload sequencing and failures.')
} finally {
  await server.close()
}
