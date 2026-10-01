import { get, post, upload } from '../../../../api/httpClient'
import { jsonData } from '../../../../api/responseData'
import { isUndeveloped, normalizeApplication, requireSaveSuccess, undevelopedApplicationFee, validateApplication } from '../landApplicationModel'

const part = value => encodeURIComponent(String(value))

export async function fetchLandPage(path, signal) {
  const response = await fetch(`/backend/applicant/${path}`, { credentials: 'include', signal })
  if (!response.ok) throw new Error(`The page could not be loaded (${response.status}).`)
  const doc = new DOMParser().parseFromString(await response.text(), 'text/html')
  if (doc.querySelector('[name="j_password"]')) throw new Error('Your session has expired. Please log in again.')
  return doc
}

export async function loadLandApplication(applicantId, parcelToken, signal, correction = false) {
  // This existing page performs ownership, reservation and industry eligibility checks
  // and resolves the encrypted parcel token. Do not bypass it with an arbitrary ID.
  const doc = await fetchLandPage(`${correction ? 'editApplyForLandForm' : 'viewApplyForLandForm'}/${part(applicantId)}/${part(parcelToken)}`, signal)
  const rawId = doc.querySelector('#vId')?.value?.trim()
  if (!rawId || !/^\d+$/.test(rawId) || !doc.querySelector('form[name="selfEmploymentForm"]')) {
    const message = doc.querySelector('.alert, #errorMessage, .error-message, .text-danger')?.textContent?.trim()
    throw new Error(message && !message.includes('{{') ? message : 'The server did not authorize this application form. Check plot eligibility and your applicant/industry profile.')
  }
  const data = jsonData(await get(`/applicant/id/fetchVacantLandDetail/${part(rawId)}`, {}, { signal }))
  if (!data.vacantLandBean) throw new Error('The server did not return the selected plot details.')
  if (isUndeveloped(data)) data.vacantLandBean = jsonData(await get(`/applicant/id/getVacantLandDetail/${part(rawId)}`, {}, { signal }))
  if (Number(applicantId) && String(data.applicantId) !== String(applicantId)) throw new Error('The returned application does not match the requested application.')
  if (data.applicantId && Number(data.statusId) !== (correction ? 5 : 1)) throw new Error(correction ? 'This application is not awaiting a query reply.' : 'This application is no longer a draft. Open its details to check the current status.')
  const profile = jsonData(await get('/applicant/fetchUserIndustrialDetails1', { userId: '' }, { signal }))
  const parcelFields = Object.fromEntries(['totalPlotArea', 'premiumCharges', 'developmentCharges', 'maintenanceCharges', 'leaseRent', 'securityDeposit', 'advanceRent', 'applicationFee', 'totalAmount']
    .filter(key => data.vacantLandBean[key] != null).map(key => [key, data.vacantLandBean[key]]))
  return {
    ...normalizeApplication(data), ...parcelFields, vacantLandId: Number(rawId), vacantLandIDEncrypt: parcelToken,
    ...(isUndeveloped(data) ? { totalPlotArea: data.applicantId ? data.totalPlotArea : '', quotedArea: null } : {}),
    constitution: data.constitution || profile.firmConstitution,
    proposedActivity: data.proposedActivity || data.vacantLandBean.purposeId,
  }
}

export async function saveLandApplication(data, correction = false) {
  const payload = validateApplication(data)
  delete payload.quotedArea
  const existing = Number(payload.applicantId) > 0
  if (correction && (!existing || Number(payload.statusId) !== 5)) throw new Error('Only applications awaiting a query reply can be corrected.')
  const result = requireSaveSuccess(jsonData(await post(`/applicant/id/${correction ? 'edit' : existing ? 'update' : 'add'}IdApplicantDetail`, payload)), !existing)
  return { ...result, applicantId: existing ? payload.applicantId : result.id }
}

export async function saveLandDocuments({ applicantId, files, declaration, update = false, undeveloped = false, correction = false }) {
  if (!declaration && !correction) throw new Error('Accept the declaration before saving documents.')
  if (correction) update = true
  if (!update && (!files.doc2 || !files.doc3 || !files.doc9 || !files.profileImage)) throw new Error('Upload the project report, construction layout, project schedule and applicant photograph.')
  if (undeveloped && !update && (!files.doc1 || !files.doc10 || !files.doc11)) throw new Error('Upload the financial closure report, two years of audited balance sheets and certified previous-year turnover.')
  const body = new FormData()
  body.append('applicantId', applicantId)
  if (!correction) body.append('checkDeclaration', 'true')
  for (const [key, file] of Object.entries(files)) {
    if (!/^doc(?:[1-9]|10|11|12)$/.test(key) && key !== 'profileImage') throw new Error('Unknown document category.')
    if (key === 'profileImage' ? !/\.jpe?g$/i.test(file.name) || file.type !== 'image/jpeg' : !/\.(pdf|jpe?g)$/i.test(file.name) || !['application/pdf', 'image/jpeg'].includes(file.type)) throw new Error('Choose PDF or JPEG documents and a JPEG photograph.')
    const maxSize = undeveloped && key !== 'profileImage' ? 10485760 : 2097152
    if (file.size >= maxSize) throw new Error(`Each ${key === 'profileImage' ? 'photograph' : 'document'} must be smaller than ${maxSize / 1048576} MB.`)
    body.append(key, file)
  }
  return requireSaveSuccess(jsonData(await upload(`/applicant/${correction ? 'edit' : update ? 'update' : 'add'}IDApplicantDocuments${undeveloped && !correction ? '1' : ''}`, body)))
}

export async function quoteUndevelopedLand(parcel, area) {
  const applicationFee = undevelopedApplicationFee(area, parcel.totalPlotAreaun)
  if (!parcel.collectorRateId || !parcel.districtId || !parcel.plotShed || !parcel.newArea || (parcel.newArea === 'New' && !parcel.category)) throw new Error('The plot is missing rate information. Reload its details.')
  const rates = jsonData(await get('/applicant/fetchRatesByCollectorRateIdAndAreaLeaseRent', {
    collectorRateId: parcel.collectorRateId, totalArea: Number(area), districtId: parcel.districtId,
    plotShed: parcel.plotShed, category: parcel.newArea === 'Old' ? 'OpenForAll' : parcel.category,
  }))
  const values = {}
  for (const key of ['premiumCharges', 'developmentCharges', 'maintenanceCharges', 'leaseRent', 'securityDeposit', 'advanceRent', 'totalAmount']) {
    if (rates[key] == null || rates[key] === '' || !Number.isFinite(Number(rates[key])) || Number(rates[key]) < 0) throw new Error('The server returned incomplete plot charges.')
    values[key] = Number(rates[key]).toFixed(2)
  }
  if (Number(values.totalAmount) <= 0) throw new Error('No valid rate is available for this plot area.')
  // Preserve the existing applicant controller's plot premium adjustment.
  if (parcel.plotShed === 'plot') values.premiumCharges = (Number(values.premiumCharges) / 2).toFixed(2)
  return { ...values, totalPlotArea: Number(area).toFixed(2), quotedArea: Number(area), applicationFee }
}
