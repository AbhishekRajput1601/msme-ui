import fs from 'node:fs'
import assert from 'node:assert/strict'
const endpoints = [
  '/idLanding/fetchAllLandAllotmentList?iDisplayStart=0&iDisplayLength=25&industrialArea=Industrial%20Area',
  '/idLanding/fetchAllLandAllotmentList?iDisplayStart=0&iDisplayLength=25&industrialArea=Undeveloped%20Land',
  '/idLanding/fetchIndustrialAreas', '/idLanding/fetchCollectorRateList',
  '/msefcLanding/fetchAllMSEFCCaseList?iDisplayStart=0&iDisplayLength=25',
  '/advanceSearch/fetchAllAdvanceSearchList?iDisplayStart=0&iDisplayLength=25',
  '/idLanding/unifiedPortal/applicationStatus?applicationNo=',
  '/website/acts-%26-rules', '/website/policies', '/website/financial-assistance',
  '/website/startup-policy,-guidelines-%26-order', '/website/e-tender-and-auction', '/website/orderCirculars',
]
const report = []
for (const path of endpoints) {
  try {
    const response = await fetch(`http://127.0.0.1:8080/mpmsme${path}`, { signal: AbortSignal.timeout(20000) })
    const text = await response.text()
    let data
    try { data = JSON.parse(text) } catch { /* HTML CMS page */ }
    const rows = data?.aaData || (Array.isArray(data?.data) ? data.data : null)
    const result = { path, redirected: response.redirected, finalUrl: response.url, status: response.status, type: response.headers.get('content-type'), count: rows?.length, total: data?.iTotalDisplayRecords, fields: rows?.[0] ? Object.keys(rows[0]) : undefined, contentContainer: !data ? text.includes('inner-content') : undefined }
    report.push(result)
    console.log(JSON.stringify(result))
  } catch (error) { report.push({ path, error: error.message }); console.log(path, error.message) }
}
fs.writeFileSync('artifacts/header-api-report.json', JSON.stringify(report, null, 2))
for (const result of report) {
  assert.equal(result.status, 200, result.path)
  assert.equal(result.redirected, false, `Unexpected login redirect: ${result.path}`)
  if (!result.path.startsWith('/website/')) assert(result.type?.includes('json'), result.path)
}
const restricted = []
for (const [method, path] of [
  ['GET', '/msefcLanding/fetchCaseDetail/0'],
  ['GET', '/idLanding/fetchvacantlanddetail/0'],
  ['GET', '/mbfc/startupRegistrationsList'],
  ['POST', '/idLanding/fetchAllLandAllotmentList'],
  ['POST', '/advanceSearch/fetchAllAdvanceSearchList'],
]) {
  const response = await fetch(`http://127.0.0.1:8080/mpmsme${path}`, { method, redirect: 'manual', signal: AbortSignal.timeout(15000) })
  restricted.push({ method, path, status: response.status })
  assert([302, 401, 403].includes(response.status), `Access unexpectedly allowed: ${method} ${path}`)
}
fs.writeFileSync('artifacts/header-security-report.json', JSON.stringify(restricted, null, 2))
console.log('PASS: public reads return JSON; private details and POST requests remain protected.')
