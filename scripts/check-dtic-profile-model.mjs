import assert from 'node:assert/strict'
import { createServer } from 'vite'
import fs from 'node:fs'
const server = await createServer({ server: { middlewareMode: true } })
try {
  const { createDepartmentProfileState, passwordStrength } = await server.ssrLoadModule('/src/modules/profile/department/departmentProfileModel.js')
  const { resolveLegacyHashRoute } = await server.ssrLoadModule('/src/routes/roleRoutes.js')
  const requests = [], destinations = [], expiry = []
  let failUpdate = false, failOtp = false, expiryMessage = 'Your password is still valid'
  const profile = { userId: 'DTIC-TEST', roleName: 'DTIC', firstName: 'Test', lastName: 'Officer', genderId: 1, mobileNumber: '9876543210', address1: 'Present', stateId: 20, districtId: 1, tehsilId: 2, pinCode: '462001', permanentStateId: 20 }
  const state = createDepartmentProfileState({ notify() {}, navigate: path => destinations.push(path), locale: 'en', alert() {}, confirm: () => false, onExpiry: value => expiry.push(value), request: async (method, endpoint, body) => {
    requests.push({ method, endpoint, body })
    if (endpoint === 'fetchUserDetails') return { ...profile }
    if (endpoint === 'updateDepartmentUser') return failUpdate ? { errorMessage: 'Rejected' } : { successMessage: 'Updated' }
    if (endpoint === 'dochangepasswordgenerateotp') return { successMessage: 'OTP sent' }
    if (endpoint === 'dochangepassword') return failOtp ? { errorMessage: 'Incorrect OTP' } : { successMessage: 'Password changed' }
    if (endpoint === 'verifyUserPasswordExpiry') return { successMessage: expiryMessage }
    return [{ key: '1', value: 'One' }, { key: '2', value: 'Two' }]
  } })
  await state.loadUserDetails()
  assert(state.loaded && state.disabled)
  assert.equal(state.signupData.genderId, '1')
  state.toggleCaseForm(); assert.equal(state.disabled, false)
  const before = requests.length
  await state.updateDepartmentUserProfile(false); assert.equal(requests.length, before)
  state.sameAsAbovecheck = true
  await state.setSameAddress()
  assert.equal(state.signupData.permanentAddress1, 'Present')
  assert.equal(state.signupData.permanentTehsilId, '2')
  state.sameAsAbovecheck = false
  await state.setSameAddress(); assert.equal(state.signupData.permanentAddress1, '')
  state.signupData.permanentStateId = '21'
  await state.fetchPermanentAddDistrictByState('21')
  assert.equal(state.signupData.permanentDistrictId, '')
  assert.equal(state.signupData.permanentTehsilId, '')
  failUpdate = true
  await state.updateDepartmentUserProfile(true)
  assert.equal(state.responseObject.errorMessage, 'Rejected'); assert.equal(state.disabled, false)
  failUpdate = false
  await state.updateDepartmentUserProfile(true); assert(state.disabled)
  const body = requests.find(r => r.endpoint === 'updateDepartmentUser').body
  assert(body instanceof FormData)
  assert.equal(body.get('userId'), 'DTIC-TEST')
  assert.equal(body.get('mobileNumber'), '9876543210')
  assert.equal(body.has('roleName'), false)
  for (const password of ['abc', 'abcdef', 'ABCDEF', 'Abcdef', 'Abc12!', 'StrongPass1!', 'Has Space1!']) assert.equal(passwordStrength(password).weak, !['Abc12!', 'StrongPass1!'].includes(password), password)
  assert.equal(passwordStrength('Abc12!').count, 1)
  state.changePasswordData = { currentPassword: 'OldPass1!', password: 'NewPass1!', confirmPassword: 'NewPass1!' }
  await state.changePasswordFunction(true); assert(!requests.some(r => r.endpoint === 'dochangepassword'))
  await state.changePasswordFunction1(); assert(state.otpGenerated && state.isOtpButtonDisabled)
  const otpRequests = requests.length
  await state.changePasswordFunction1(); assert.equal(requests.length, otpRequests)
  state.changePasswordData.otp = '123456'
  failOtp = true
  await state.changePasswordFunction(true)
  assert.equal(state.responseObject.errorMessage, 'Incorrect OTP'); assert.equal(state.changePasswordData.otp, '123456')
  failOtp = false
  await state.changePasswordFunction(true)
  assert.deepEqual(state.changePasswordData, {}); assert.equal(destinations.at(-1), '/department/dtic/dashboard')
  state.toggleNewPassword(); assert(state.showNewPassword)
  state.hidePassword(); assert(!state.showNewPassword)
  expiryMessage = 'Your password has expired'
  await state.verifyUserPasswordExpiry(); assert.equal(expiry.at(-1), true)
  expiryMessage = 'Your password will expire'
  await state.verifyUserPasswordExpiry(); assert.equal(destinations.at(-1), '/department/dtic/dashboard')
  for (const hash of ['#updateprofile', '#/updateprofile', '#changepassword', '#/changepassword']) assert.match(resolveLegacyHashRoute('/dtic/home', hash), /^\/department\/dtic\/(profile|updateprofile|change-password|changepassword)$/)
  // Exercise the real Axios boundary as well as the injected workflow fixture.
  // Mocking only endpoint names previously concealed the missing /dtic prefix.
  // Also ensure multipart data survives Axios request transformation.
  const { default: http } = await server.ssrLoadModule('/src/api/httpClient.js')
  const originalAdapter = http.defaults.adapter, transportRequests = []
  http.defaults.adapter = async config => {
    transportRequests.push(config)
    assert.equal(config.baseURL, '/mpmsme')
    assert.match(config.url, /^\/dtic\//, 'Every department account request must use the DTIC controller namespace')
    const endpoint = config.url.split('/').at(-1)
    const data = endpoint === 'fetchUserDetails' ? { ...profile, designationCode: '1', officeLocationId: '1' }
      : endpoint === 'verifyUserPasswordExpiry' ? { successMessage: 'Your password is still valid' }
      : config.method === 'post' ? { successMessage: 'Saved' } : [{ key: '1', value: 'One' }]
    return { config, data, status: 200, statusText: 'OK', headers: { 'content-type': 'application/json' } }
  }
  try {
    const real = createDepartmentProfileState({ notify() {}, navigate() {}, alert() {}, confirm: () => true, locale: 'en' })
    await real.loadUserDetails()
    await real.loadGender()
    await real.loadDesignation()
    await real.fetchPresentAddDistrictByState('20')
    await real.fetchTehsilByDistrict('1')
    await real.fetchPermanentAddDistrictByState('20')
    await real.fetchPermanentTehsilByDistrict('1')
    real.toggleCaseForm()
    await real.updateDepartmentUserProfile(true)
    const update = transportRequests.find(config => config.url === '/dtic/updateDepartmentUser')
    assert(update.data instanceof FormData, 'The multipart body must survive Axios request transformation')
    assert.equal(update.data.get('userId'), 'DTIC-TEST')
    assert(!String(update.headers.get('Content-Type')).includes('application/json'))
    real.changePasswordData = { currentPassword: 'OldPass1!', password: 'NewPass1!', confirmPassword: 'NewPass1!' }
    await real.changePasswordFunction1()
    real.changePasswordData.otp = '123456'
    await real.changePasswordFunction(true)
    await real.verifyUserPasswordExpiry()
    const passwordRequest = transportRequests.find(config => config.url === '/dtic/dochangepassword')
    assert.equal(JSON.parse(passwordRequest.data).otp, '123456')
    assert(String(passwordRequest.headers.get('Content-Type')).includes('application/json'))
    assert(transportRequests.some(config => config.url === '/dtic/fetchGender'))
    assert(transportRequests.some(config => config.url === '/dtic/fetchUserDetails' && config.params.userId === ''))
  } finally { http.defaults.adapter = originalAdapter }
  fs.mkdirSync('artifacts/dtic-profile', { recursive: true })
  fs.writeFileSync('artifacts/dtic-profile/model-checks.json', JSON.stringify({ passed: true, checks: ['profile load/edit/validation/error/success', 'address copy/clear/cascades', 'multipart contract', 'password policy and meter', 'OTP generation/update/error/retry', 'password visibility', 'expiry', 'legacy DTIC links', 'real Axios DTIC URLs and multipart/JSON serialization'], liveWrites: false }, null, 2))
  console.log('DTIC profile workflow and real transport checks passed.')
} finally { await server.close() }
