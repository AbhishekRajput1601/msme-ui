import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

// Anonymous, read-only checks. Never log cookies, credentials or response bodies.
const origin = process.env.LAND_TEST_BACKEND || 'http://localhost:8080'
const results = []
for (const path of ['/website/login', '/api/session/current-user', '/applicant/fetchApplicationList', '/applicant/fetchAllLandAllotmentList', '/applicant/id/fetchDocumentsList?applicantId=0']) {
  const response = await fetch(new URL(path, origin), { redirect: 'manual', signal: AbortSignal.timeout(10000) })
  const location = response.headers.get('location')
  if (path === '/website/login') {
    assert.equal(response.status, 200, 'Login page must be reachable')
    assert.match(await response.text(), /j_username|loginForm/, 'Expected a login page')
  } else {
    assert.ok([301, 302, 303, 401, 403].includes(response.status), `Anonymous access was not rejected for ${path}`)
    if (location) assert.match(new URL(location, origin).pathname, /\/website\/login$/, 'Expected an authentication redirect')
  }
  results.push({ path, status: response.status, authenticationRequired: path !== '/website/login' })
}
await fs.mkdir('artifacts/land-allotment', { recursive: true })
await fs.writeFile('artifacts/land-allotment/live-checks.json', JSON.stringify({ checkedAt: new Date().toISOString(), mode: 'Live anonymous requests; no application writes', passed: true, checks: results, pending: 'Authenticated create/update/upload verification requires a test applicant account.' }, null, 2))
console.log('Live backend login and anonymous Land Allotment access checks passed. Authenticated writes are not yet verified.')
