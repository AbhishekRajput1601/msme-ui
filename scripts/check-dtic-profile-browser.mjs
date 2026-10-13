import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { createServer } from 'vite'
const server = await createServer({ server: { port: 0, host: '127.0.0.1' } })
await server.listen()

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const base = `http://127.0.0.1:${server.httpServer.address().port}`
const output = path.resolve('artifacts/dtic-profile/browser')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/dtic-profile-browser')
const browser = spawn(browserPath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
let socket
try {
  const websocket = await new Promise((resolve, reject) => {
    let stderr = ''
    const timeout = setTimeout(() => reject(new Error('Browser did not start')), 45000)
    browser.once('error', reject)
    browser.stderr.on('data', chunk => {
      stderr += chunk
      const match = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/)
      if (match) { clearTimeout(timeout); resolve(match[1]) }
    })
  })
  socket = new WebSocket(websocket)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))
  let sequence = 0
  const pending = new Map()
  const events = new Map()
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)) }, 45000)
    pending.set(id, { resolve, reject, timer })
    socket.send(JSON.stringify({ id, method, params, sessionId }))
  })
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const request = pending.get(message.id)
      if (!request) return
      clearTimeout(request.timer)
      pending.delete(message.id)
      if (message.error) request.reject(new Error(message.error.message))
      else request.resolve(message.result)
    } else events.get(message.method)?.(message.params, message.sessionId)
  })
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  const cdp = (method, params) => send(method, params, sessionId)
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text)
    return result.result.value
  }
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 80; attempt++) {
      try { if (await evaluate(expression)) return }
      catch (error) { if (!/navigated|context|closed/i.test(error.message)) throw error }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error(`Condition failed: ${expression}\n${await evaluate('document.body.innerText.slice(-2500)')}\n${JSON.stringify(errors)}`)
  }
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
  const exists = selector => `!!document.querySelector(${JSON.stringify(selector)})`
  const errors = []
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text))
  await cdp('Runtime.enable')
  await cdp('Page.enable')
  let role = null
  let profileError = false, otpError = false
  const user = { userId: 'DTIC-TEST', roleName: 'DTIC', userGroupDescription: 'District Office', firstName: 'Test', lastName: 'Officer', mobileNumber: '9876543210', emailId: 'test@example.org', genderId: 1, designationCode: '1', officeLocation: 'Bhopal', officeLocationId: 1, address1: 'Present address', stateId: 20, districtId: 1, tehsilId: 1, pinCode: '462001', permanentStateId: 20, permanentDistrictId: 1, permanentTehsilId: 1 }
  const fixture = (url, method) => {
    const endpoint = url.pathname.split('/').at(-1)
    if (endpoint === 'fetchUserDetails') return user
    if (endpoint === 'fetchofficeaddresssbyofficeid') return { officeAddress1: 'Office address', officeAddState: 'Madhya Pradesh', officeDistrict: 'Bhopal' }
    if (endpoint === 'fetchallstates') return [{ key: '20', value: 'Madhya Pradesh' }, { key: '21', value: 'Other State' }]
    if (endpoint === 'fetchGender') return [{ key: '1', value: 'Male' }, { key: '2', value: 'Female' }]
    if (endpoint === 'fetchdesignationmap') return [{ key: '1', value: 'General Manager' }]
    if (/fetchdistrict|fetchtehsil/.test(endpoint)) return [{ key: '1', value: 'Bhopal' }, { key: '2', value: 'Indore' }]
    if (endpoint === 'verifyUserPasswordExpiry') return { successMessage: 'Your password is still valid' }
    if (endpoint === 'updateDepartmentUser') return profileError ? { errorMessage: 'Profile update rejected' } : { successMessage: 'Updated' }
    if (endpoint === 'dochangepasswordgenerateotp') return { successMessage: 'OTP sent' }
    if (endpoint === 'dochangepassword') return otpError ? { errorMessage: 'Incorrect OTP. Please try again.' } : { successMessage: 'Password changed' }
    return []
  }
  const requests = []
  // Fixtures cover authenticated styling without sending credentials or writes.
  events.set('Fetch.requestPaused', async event => {
    const url = new URL(event.request.url)
    requests.push({ url:url.pathname, method:event.request.method, body:event.request.postData })
    let body = '{}'
    let status = 200
    if (url.pathname.endsWith('/api/session/current-user')) {
      body = JSON.stringify({ authenticated: !!role, username: 'ui-review', displayName: 'UI Review', roles: role ? [role] : [], locale: 'en_US' })
    } else if (url.pathname.endsWith('/website/home')) { status = 503 }
    else if (url.pathname.endsWith('/website/captcha')) { status = 503 }
    else if (!url.pathname.startsWith('/mpmsme/dtic/')) { status = 404; body = JSON.stringify({ errorMessage: 'Missing DTIC controller namespace' }) }
    else { const data = fixture(url,event.request.method); body = typeof data==='string' ? data : JSON.stringify(data) }
    try {
      await cdp('Fetch.fulfillRequest', { requestId: event.requestId, responseCode: status, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(body).toString('base64') })
    } catch (error) {
      // StrictMode unmounts abort the first public-content request.
      if (!/Invalid InterceptionId|closed|session/i.test(error.message)) errors.push(error.message)
    }
  })
  await cdp('Fetch.enable', { patterns: [{ urlPattern: '*/*mpmsme/*' }] })
  const viewport = (width, height = 900) => cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
  const navigate = async (route, selector) => {
    console.log(`Checking ${route}`)
    await cdp('Page.navigate', { url: base + route })
    await waitFor(`location.pathname === ${JSON.stringify(route)} && document.readyState === 'complete' && document.querySelector(${JSON.stringify(selector)}) !== null`)
    await evaluate('document.fonts.ready.then(() => true)')
    await waitFor(`Array.from(document.images).every(img => img.complete)`)
  }
  const screenshot = async name => {
    const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    fs.writeFileSync(path.join(output, `${name}.png`), Buffer.from(data, 'base64'))
  }
  const noOverflow = async label => {
    const sizes = await evaluate('({ width: innerWidth, scroll: document.documentElement.scrollWidth })')
    assert(sizes.scroll <= sizes.width + 1, `${label}: horizontal overflow ${JSON.stringify(sizes)}`)
  }
  role = 'ROLE_DTIC'
  await cdp('Page.addScriptToEvaluateOnNewDocument', { source: 'window.confirm=()=>true;window.alert=()=>{}' })
  const field = (name, value) => evaluate(`(() => { const el = document.querySelector('[name="${name}"]'); const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); })()`)
  const action = label => evaluate(`[...document.querySelectorAll('.department-profile-page button')].find(el=>el.textContent.trim()===${JSON.stringify(label)}).click()`)
  await viewport(1366)
  await navigate('/department/dtic/profile', '.department-profile-page')
  await waitFor('document.querySelector("[name=firstName]")?.value === "Test" && !document.querySelector("form").getAttribute("aria-busy").includes("true")')
  assert(await evaluate('document.querySelector("[name=firstName]").disabled'))
  await click('.portal-user-toggle-btn')
  assert.equal(await evaluate('document.querySelectorAll(".portal-dropdown a").length'), 2)
  await click('.portal-user-toggle-btn')
  await action('Edit')
  assert.equal(await evaluate('document.querySelector("[name=firstName]").disabled'), false)
  assert(await evaluate('document.querySelector("[name=userId]").disabled'))
  await field('firstName', '')
  await action('Update')
  assert(!requests.some(r=>r.url.endsWith('/updateDepartmentUser')))
  await field('firstName', 'Updated')
  await field('mobileNumber', '98abc76543210')
  assert.equal(await evaluate('document.querySelector("[name=mobileNumber]").value'), '9876543210')
  await click('[name=sameAsAbovecheck]')
  await waitFor('document.querySelector("[name=permanentAddress1]").value === "Present address"')
  await screenshot('profile-edit')
  profileError = true
  await action('Update')
  await waitFor('document.body.innerText.includes("Profile update rejected")')
  assert.equal(await evaluate('document.querySelector("[name=firstName]").disabled'), false)
  profileError = false
  await action('Update')
  await waitFor('document.querySelector("[name=firstName]").disabled')
  const update = requests.find(r=>r.url.endsWith('/updateDepartmentUser'))
  assert(update.body.includes('name="firstName"') && update.body.includes('Updated'))
  await action('Edit')
  await field('permanentAddState', '21')
  await viewport(390)
  await noOverflow('Mobile profile')
  await screenshot('profile-mobile')
  await viewport(1366)
  await navigate('/department/dtic/change-password', '.department-profile-page')
  assert.equal(await evaluate('document.querySelector("[name=otp]").getClientRects().length'), 0)
  await field('currentPassword', 'OldPass1!')
  await field('password', 'NewPass1!')
  await field('confirmPassword', 'NewPass1!')
  await click('[aria-label="Show or hide new password"]')
  assert.equal(await evaluate('document.querySelector("[name=password]").type'), 'text')
  await evaluate('document.querySelector("[name=password]").dispatchEvent(new FocusEvent("focusout", { bubbles: true }))')
  await action('Generate OTP')
  await waitFor('document.querySelector("[name=otp]").getClientRects().length > 0')
  assert(!requests.some(r=>r.url.endsWith('/dochangepassword')))
  await action('Submit')
  assert(!requests.some(r=>r.url.endsWith('/dochangepassword')))
  await field('otp', '123456')
  otpError = true
  await action('Submit')
  await waitFor('document.body.innerText.includes("Incorrect OTP")')
  await screenshot('password-otp')
  otpError = false
  await action('Submit')
  await waitFor('location.pathname === "/department/dtic/dashboard"')
  await cdp('Page.navigate', { url: base + '/dtic/home#updateprofile' })
  await waitFor('location.pathname === "/department/dtic/updateprofile" || location.pathname === "/department/dtic/profile"')
  assert.deepEqual(errors, [])
  fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify({ passed: true, mode: 'Controlled fixtures; no live writes', errors, requests: requests.map(({url,method})=>({url,method})) }, null, 2))
  console.log('DTIC profile browser checks passed.')
} finally {
  try { socket?.close() } catch {}
  browser.kill()
  await server.close()
}
