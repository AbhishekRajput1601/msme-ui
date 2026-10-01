import { get, post, upload } from '../../../../api/httpClient'
import { jsonData } from '../../../../api/responseData'
import { requireSaveSuccess } from '../landApplicationModel'
import { fetchLandPage } from './landApplicationService'

export async function loadLandQuery(applicantId, parcelToken, signal) {
  const page = await fetchLandPage(`id/queryReplyByApplicant/${encodeURIComponent(applicantId)}/${encodeURIComponent(parcelToken)}`, signal)
  if (![...page.forms].some(form => /submitQueryReply/.test(form.getAttribute('data-ng-submit') || form.getAttribute('ng-submit') || ''))) throw new Error('The server did not authorize a query reply for this application.')
  const query = jsonData(await get('/applicant/id/fetchquerybydtic', { applicantId }, { signal }))
  if (Array.isArray(query) || !query.comments) throw new Error('No pending query was returned for this application.')
  return query
}

export function validateQueryDocument(file) {
  if (file && (!/\.(pdf|jpe?g)$/i.test(file.name) || !['application/pdf', 'image/jpeg'].includes(file.type) || file.size >= 2097152)) throw new Error('Choose a PDF or JPEG document smaller than 2 MB.')
}

export async function submitLandQuery(applicantId, query, reply) {
  if (!reply.trim() || reply.trim().length > 400) throw new Error('Enter a reply of 1 to 400 characters.')
  return requireSaveSuccess(jsonData(await post('/applicant/id/submitQueryReply', { ...query, queryAsked: query.comments, comments: reply.trim(), applicationId: applicantId })))
}

export async function uploadLandQueryDocument(applicantId, file) {
  validateQueryDocument(file)
  if (!file) throw new Error('Select the query document to upload.')
  const body = new FormData()
  body.append('applicantId', applicantId)
  body.append('doc1', file)
  return requireSaveSuccess(jsonData(await upload('/applicant/uploadQueryDoc', body)))
}
