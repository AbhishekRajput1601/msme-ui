import { get, post } from '../../../api/httpClient'
import { jsonData } from '../../../api/responseData'
import { profileDates, profileMultipart } from '../profileModel'

/**
 * Service to manage User Profile, Industrial Profile, and Password changes.
 */

// ── User Profile ─────────────────────────────────────────────────────────────

export async function fetchUserProfile(signal) {
  return profileData(await get('/applicant/fetchUserDetails', { userId: '' }, { signal }))
}

function profileData(value) {
  const data = jsonData(value)
  if (Array.isArray(data) || !data.userId) throw new Error('The server returned an incomplete profile. Please reload before editing.')
  return profileDates(data)
}

function savedProfile(value) {
  const data = jsonData(value)
  if (typeof data.successMessage !== 'string' || !data.successMessage.trim()) {
    throw new Error('The server did not confirm that the profile was saved. Please reload and check before retrying.')
  }
  return data
}

export async function updateUserProfile(formData) {
  const res = await post('/applicant/updateUser', profileMultipart(formData))
  const data = savedProfile(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

// ── Industrial Profile ───────────────────────────────────────────────────────

export async function fetchIndustrialProfile(signal) {
  return profileData(await get('/applicant/fetchUserIndustrialDetails', { userId: '' }, { signal }))
}

export async function updateIndustrialProfile(formData) {
  const res = await post('/applicant/updateUserIndustrialProfile', profileMultipart(formData))
  const data = savedProfile(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

export async function updateIndustrialPartners(userId, partnersList) {
  const payload = {
    userId,
    industrialPartnerslist: profileDates(partnersList, true),
  }
  const res = await post('/applicant/updateUserIndustrialProfilePartners', payload)
  const data = savedProfile(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

export async function updateIndustrialRegNocs(userId, regNocList) {
  const payload = {
    userId,
    regNocList: profileDates(regNocList, true),
  }
  const res = await post('/applicant/updateUserIndustrialRegNocList', payload)
  const data = savedProfile(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

// ── Password Management ──────────────────────────────────────────────────────

export async function generateChangePasswordOtp({ currentPassword, password, confirmPassword }) {
  const payload = {
    currentPassword,
    password,
    confirmPassword,
  }
  const res = await post('/api/session/password/otp', payload)
  const data = jsonData(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

export async function submitChangePassword({ currentPassword, password, confirmPassword, otp }) {
  const payload = {
    currentPassword,
    password,
    confirmPassword,
    otp,
  }
  const res = await post('/api/session/password/change', payload)
  const data = jsonData(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

export async function submitFirstPasswordChange({ password, confirmPassword }) {
  const payload = {
    password,
    confirmPassword,
  }
  const res = await post('/api/session/password/first', payload)
  const data = jsonData(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}
