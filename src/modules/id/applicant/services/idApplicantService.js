/**
 * idApplicantService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service for the Citizen / Applicant Land Allotment (ID Module).
 *
 * Implements the Legacy DataTables Translation Adapter (Task 3) that bridges
 * modern React table state with the Spring Boot legacy jQuery DataTables format:
 *   React Table State  ──▶  Translation Adapter  ──▶  Legacy DataTables Query
 *   Legacy JSON (Gson) ◀──  Transform Response   ◀──  Spring Controller (aaData)
 */

import { get } from '../../../../api/httpClient'
import { jsonData, dataTable } from '../../../../api/responseData'
export { DOCUMENT_TYPES } from '../types'

// ─── Default Column Mappings for Legacy DataTables ─────────────────────────────

const APPLICATION_COLUMNS = [
  'applicantId',
  'applicationId',
  'submittedOn',
  'vacantLandBean.industrialAreaName',
  'vacantLandBean.plotNumber',
  'decisionDate',
  'status',
]

const VACANT_LAND_COLUMNS = [
  'vacantLandId',
  'districtName',
  'industrialAreaName',
  'plotNumber',
  'totalPlotArea',
  'totalAmount',
  'category',
]

// ─── Legacy DataTables Translation Adapter (Task 3) ───────────────────────────

/**
 * Converts modern React table pagination/sort/filter state into legacy
 * jQuery DataTables 1.9 query parameters expected by IDApplicantController.java.
 *
 * @param {Object} params
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=10]
 * @param {string} [params.sortColumn]
 * @param {string} [params.sortDirection='asc']
 * @param {string} [params.searchQuery='']
 * @param {string[]} [params.columnList]
 * @returns {Record<string, string|number>}
 */
export function toLegacyDataTablesParams({
  page = 1,
  pageSize = 10,
  sortColumn,
  sortDirection = 'asc',
  searchQuery = '',
  columnList = APPLICATION_COLUMNS,
}) {
  const iDisplayStart = Math.max(0, (page - 1) * pageSize)
  const iDisplayLength = pageSize

  let iSortCol_0 = 0
  if (sortColumn) {
    const foundIdx = columnList.indexOf(sortColumn)
    if (foundIdx !== -1) {
      iSortCol_0 = foundIdx
    }
  }

  const legacyParams = {
    iDisplayStart,
    iDisplayLength,
    sSearch: searchQuery ? searchQuery.trim() : '',
    iSortCol_0,
    sSortDir_0: sortDirection.toLowerCase() === 'desc' ? 'desc' : 'asc',
    iSortingCols: 1,
    bSortable_0: true,
  }

  // Populate mDataProp_0, mDataProp_1, ...
  columnList.forEach((colKey, idx) => {
    legacyParams[`mDataProp_${idx}`] = colKey
    legacyParams[`bSortable_${idx}`] = true
  })

  return legacyParams
}

/**
 * Normalizes legacy Gson response ({ iTotalRecords, iTotalDisplayRecords, aaData })
 * into modern React { data: [], totalCount: number }.
 *
 * @param {any} rawResponse
 * @returns {{ data: any[], totalCount: number }}
 */
export const fromLegacyDataTablesResponse = dataTable

export async function fetchApplicationList(tableState = {}) {
  return dataTable(await get('/applicant/fetchApplicationList', toLegacyDataTablesParams({ ...tableState, columnList: APPLICATION_COLUMNS })))
}

export async function fetchApplicationPaymentList(tableState = {}) {
  return dataTable(await get('/applicant/fetchApplicationPaymentList', toLegacyDataTablesParams({ ...tableState, columnList: APPLICATION_COLUMNS })))
}

export async function fetchApplicationDetail(applicantId) {
  const data = jsonData(await get('/applicant/fetchApplicationDetail/' + encodeURIComponent(applicantId)))
  if (Array.isArray(data) || !data.applicantId) throw new Error('Application details were not returned by the server.')
  return data
}

export async function fetchDocumentsList(applicantId) {
  const data = jsonData(await get('/applicant/id/fetchDocumentsList', { applicantId }))
  if (!Array.isArray(data)) throw new Error('The server returned an invalid document list.')
  return data
}

export async function fetchAllLandAllotmentList(tableState = {}) {
  return dataTable(await get('/applicant/fetchAllLandAllotmentList', toLegacyDataTablesParams({ ...tableState, columnList: VACANT_LAND_COLUMNS })))
}

export function getDownloadDocumentUrl(documentType, applicantId) {
  return `/mpmsme/applicant/id/downloaddocument/${encodeURIComponent(documentType)}/${encodeURIComponent(applicantId)}`
}

export function getDownloadLOILetterUrl(applicantId) {
  return `/mpmsme/applicant/downloadIdDocument/ID_LETTER_OF_INTENT_RELEASED/${encodeURIComponent(applicantId)}`
}

export function getDownloadLeaseLetterUrl(applicantId) {
  return `/mpmsme/applicant/downloadIdDocument/ID_LETTER_OF_LEASE_DEED/${encodeURIComponent(applicantId)}`
}

export function getDownloadAllotmentLetterUrl(applicantId) {
  return `/mpmsme/applicant/downloadIdDocument/ID_LETTER_OF_ALLOTMENT_RELEASED/${encodeURIComponent(applicantId)}`
}

export function getDownloadPossessionLetterUrl(applicantId) {
  return `/mpmsme/applicant/downloadIdDocument/ID_LETTER_OF_POSSESSION_RELEASED/${encodeURIComponent(applicantId)}`
}

export function getDownloadEsignedDocumentUrl(docId) {
  return `/mpmsme/applicant/downloadEsignDocument/${encodeURIComponent(docId)}`
}
