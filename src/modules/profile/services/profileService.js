import { get, post, upload } from '../../../api/httpClient'
import { jsonData } from '../../../api/responseData'

/**
 * Service to manage User Profile, Industrial Profile, and Password changes.
 */

// ── User Profile ─────────────────────────────────────────────────────────────

export async function fetchUserProfile(signal) {
  try {
    const res = await get('/fetchUserDetails', { userId: '' }, { signal })
    return jsonData(res)
  } catch (err) {
    // If the endpoint is unauthenticated or mock, fallback to session info
    try {
      const session = jsonData(await get('/api/session/current-user', {}, { signal }))
      return {
        userId: session.username || 'APPLICANT',
        roleName: session.roles?.[0] || 'ROLE_APPLICANT',
        firstName: session.displayName?.split(' ')[0] || '',
        lastName: session.displayName?.split(' ').slice(1).join(' ') || '',
        emailId: session.email || '',
        mobileNumber: session.mobileNumber || '',
        stateId: '20',
        genderId: '1',
        categoryId: '1',
      }
    } catch {
      throw err
    }
  }
}

export async function updateUserProfile(formData) {
  // If formData is plain object, convert to FormData
  let body = formData
  if (!(formData instanceof FormData)) {
    body = new FormData()
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        body.append(key, val)
      }
    })
  }
  const res = await post('/updateUser', body)
  const data = jsonData(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

// ── Industrial Profile ───────────────────────────────────────────────────────

export async function fetchIndustrialProfile(signal) {
  try {
    const res = await get('/applicant/fetchUserIndustrialDetails1', { userId: '' }, { signal })
    return jsonData(res)
  } catch {
    try {
      const res = await get('/fetchUserIndustrialDetails', { userId: '' }, { signal })
      return jsonData(res)
    } catch (err) {
      throw err
    }
  }
}

export async function updateIndustrialProfile(formData) {
  let body = formData
  if (!(formData instanceof FormData)) {
    body = new FormData()
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        body.append(key, val)
      }
    })
  }
  const res = await post('/updateUserIndustrialProfile', body)
  const data = jsonData(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

export async function updateIndustrialPartners(userId, partnersList) {
  const payload = {
    userId,
    industrialPartnerslist: partnersList,
  }
  const res = await post('/updateUserIndustrialProfilePartners', payload)
  const data = jsonData(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}

export async function updateIndustrialRegNocs(userId, regNocList) {
  const payload = {
    userId,
    regNocList,
  }
  const res = await post('/updateUserIndustrialRegNocList', payload)
  const data = jsonData(res)
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
  const res = await post('/dochangepasswordgenerateotp', payload)
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
  const res = await post('/dochangepassword', payload)
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
  const res = await post('/dofirstpasswordchange', payload)
  const data = jsonData(res)
  if (data?.errorMessage) {
    throw new Error(data.errorMessage)
  }
  return data
}
