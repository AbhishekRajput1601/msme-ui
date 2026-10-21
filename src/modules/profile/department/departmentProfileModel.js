import { dticRequest } from '../../dtic/dticService'
import { jsonData } from '../../../api/responseData'
import { toast } from '../../../utils/toast'

const special = /[@$-/:-?{-~!"^_`\[\]]/
export function passwordStrength(password = '') {
  const matches = [/[a-z]/, /[A-Z]/, /[0-9]/, special].filter(pattern => pattern.test(password)).length
  let score = password ? 2 * password.length + (password.length >= 10 ? 1 : 0) + matches * 10 : 0
  if (password.length <= 6 || matches === 1) score = Math.min(score, 10)
  if (matches === 2) score = Math.min(score, 20)
  if (matches === 3) score = Math.min(score, 40)
  const index = score <= 10 ? 0 : score <= 20 ? 1 : score <= 30 ? 2 : score <= 40 ? 3 : 4
  return { weak: !!password && !(matches === 4 && password.length >= 6 && !/\s/.test(password)), count: password ? index + 1 : 0, color: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'][index] }
}

// CommonController.updateDepartmentUserProfile's multipart contract.
const updateFields = 'userId firstName middleName lastName fatherOrHusbandFirstName fatherOrHusbandMiddleName fatherOrHusbandLastName emailId mobileNumber mobileNumberPrev aadhaarNumber telephoneNumber genderId address1 address2 address3 districtId tehsilId blockId pinCode permanentAddress1 permanentAddress2 permanentAddress3 permanentCity permanentDistrictId permanentTehsilId permanentBlockId permanentPinCode'.split(' ')
export function createDepartmentProfileState({ notify, navigate, locale, signal, request, dashboard = '/department/dtic/dashboard', alert = window.alert, confirm = window.confirm, onExpiry = () => {} }) {
  // CommonController is mounted under /dtic/*, not the context root. The
  // DTIC client also lets Axios set the multipart boundary for profile updates.
  const transport = request || ((method, endpoint, data) => dticRequest(method, endpoint, data, signal))
  const state = { notify, locale, initialized: new Set(), disabled: true, loaded: false, saving: false, signupData: { userGroupDescription: null, designationCode: null, officeLocation: null }, respondentOffices: {}, responseObject: {}, changePasswordData: {}, signupForm: {}, changePasswordForm: {}, otpGenerated: false, isOtpButtonDisabled: false }
  Object.defineProperty(state, 'weakPassword', { get: () => passwordStrength(state.changePasswordData.password).weak })
  const call = async (method, endpoint, data) => {
    try { return jsonData(await transport(method, endpoint, data)) }
    catch (error) { if (!signal?.aborted) { state.responseObject = { errorMessage: error.message }; notify() }; throw error }
  }
  const list = async (key, endpoint, params, isCurrent = () => true) => {
    const data = await call('get', endpoint, params)
    if (!signal?.aborted && isCurrent()) { state[key] = data; notify() }
  }
  const addresses = async (permanent = false) => {
    const data = state.signupData, prefix = permanent ? 'permanent' : ''
    const stateId = data[permanent ? 'permanentStateId' : 'stateId'], districtId = data[permanent ? 'permanentDistrictId' : 'districtId']
    await Promise.all([
      stateId && list(permanent ? 'permanentDistricts' : 'districts', 'fetchdistrictmapbystate', { stateId }),
      districtId && list(prefix ? 'permanentTehsils' : 'tehsils', 'fetchdistricttehsilmapbydistrictid', { districtId }),
      districtId && list(prefix ? 'permanentBlocks' : 'blocks', 'fetchdistrictblockmapbydistrictid', { districtId }),
    ])
  }
  state.loadUserDetails = async () => {
    state.loading = true; state.loaded = false; state.error = ''; state.responseObject = {}; notify()
    try {
      const data = await call('get', 'fetchUserDetails', { userId: '' })
      if (signal?.aborted) return
      state.signupData = { userGroupDescription: null, designationCode: null, officeLocation: null, ...data, stateId: '20' }
      for (const key of ['genderId','designationCode','districtId','tehsilId','blockId','permanentStateId','permanentDistrictId','permanentTehsilId','permanentBlockId']) if (data[key] != null) state.signupData[key] = String(data[key])
      await Promise.all([
        list('respondentStates', 'fetchallstates'), addresses(), addresses(true),
        data.officeLocationId && list('respondentOffices', 'fetchofficeaddresssbyofficeid', { officeId: data.officeLocationId }),
      ])
      state.loaded = true
    } finally { state.loading = false; notify() }
  }
  state.loadGender = () => list('genderList', 'fetchGender')
  state.loadDesignation = () => list('designationList', 'fetchdesignationmap')
  for (const permanent of [false, true]) {
    const stateKey = permanent ? 'permanentStateId' : 'stateId', districtKey = permanent ? 'permanentDistrictId' : 'districtId', tehsilKey = permanent ? 'permanentTehsilId' : 'tehsilId'
    const districts = permanent ? 'permanentDistricts' : 'districts', tehsils = permanent ? 'permanentTehsils' : 'tehsils'
    state[permanent ? 'fetchPermanentAddDistrictByState' : 'fetchPresentAddDistrictByState'] = async stateId => {
      state.signupData[districtKey] = ''; state.signupData[tehsilKey] = ''; state[districts] = []; state[tehsils] = []
      if (stateId) await list(districts, 'fetchdistrictmapbystate', { stateId }, () => state.signupData[stateKey] === stateId)
    }
    state[permanent ? 'fetchPermanentTehsilByDistrict' : 'fetchTehsilByDistrict'] = async districtId => {
      state.signupData[tehsilKey] = ''; state[tehsils] = []
      if (districtId) await list(tehsils, 'fetchtehsilmapbydistrict', { districtId }, () => state.signupData[districtKey] === districtId)
    }
  }
  state.setSameAddress = async () => {
    for (const key of ['Address1','Address2','Address3','PinCode','StateId','DistrictId','TehsilId','BlockId','City']) state.signupData['permanent' + key] = state.sameAsAbovecheck ? state.signupData[key.charAt(0).toLowerCase() + key.slice(1)] || '' : ''
    state.signupData.permTelephoneNumber = state.sameAsAbovecheck ? state.signupData.telephoneNumber : ''
    state.permanentDistricts = []; state.permanentTehsils = []; state.permanentBlocks = []
    if (state.sameAsAbovecheck) await addresses(true)
  }
  state.toggleCaseForm = () => { if (state.loaded && !state.saving) state.disabled = !state.disabled }
  const save = async (endpoint, payload, success, failure) => {
    if (state.saving) return
    state.saving = true; state.error = ''; state.responseObject = {}; notify()
    try {
      const result = await call('post', endpoint, payload)
      if (signal?.aborted) return
      if (!result.successMessage) throw new Error('The server did not confirm the operation. Please try again.')
      state.responseObject = result; success(result)
    } catch (error) {
      if (!signal?.aborted) { state.responseObject = { errorMessage: error.message }; failure?.(error) }
    }
    finally { state.saving = false; notify() }
  }
  state.updateDepartmentUserProfile = valid => {
    if (!valid || state.disabled || !state.loaded) return
    const body = new FormData()
    for (const key of updateFields) if (state.signupData[key] != null && state.signupData[key] !== '') body.append(key, state.signupData[key])
    return save('updateDepartmentUser', body, () => {
      state.disabled = true
      toast.success(locale === 'hi' ? 'उपयोगकर्ता का प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया।' : "User's Profile Updated successfully.")
    })
  }
  state.changePasswordFunction1 = () => {
    if (state.isOtpButtonDisabled) return
    return save('dochangepasswordgenerateotp', { ...state.changePasswordData }, result => {
      state.otpGenerated = true
      state.isOtpButtonDisabled = true
      toast.info(result.successMessage || 'OTP generated successfully.')
    })
  }
  state.changePasswordFunction = valid => {
    if (!valid || passwordStrength(state.changePasswordData.password).weak || !state.changePasswordData.otp || !state.otpGenerated) return
    return save('dochangepassword', { ...state.changePasswordData }, () => {
      state.changePasswordData = {}
      toast.success('Your password changed successfully')
      onExpiry(false)
      navigate(dashboard)
    }, error => toast.error(error.response || error.request ? 'An error occurred. Please try again.' : 'Incorrect OTP. Please try again.'))
  }
  state.hidePassword = () => { state.showCurrentPassword = state.showNewPassword = state.showConfirmPassword = false }
  for (const name of ['Current','New','Confirm']) state['toggle' + name + 'Password'] = () => { state['show' + name + 'Password'] = !state['show' + name + 'Password'] }
  state.verifyUserPasswordExpiry = async () => {
    const result = await call('get', 'verifyUserPasswordExpiry')
    const message = result.successMessage || ''
    if (message.includes('Your password has expired')) {
      onExpiry(true)
      toast.warning('Your password has expired. Please Update your Password')
    }
    else if (message.includes('Your password will expire')) { if (!confirm(message)) navigate(dashboard) }
    else if (message.includes('Your password is still valid')) onExpiry(false)
    else if (message) toast.info(message)
  }
  state.convertFieldValue = (value, attrs) => /\bdigits-only\b/.test(attrs.className || '') ? String(value).replace(/\D/g, '') : value
  return state
}
