import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5173'
const output = path.resolve('artifacts/dtic-sidebar')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/dtic-sidebar-browser')
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
    throw new Error(`Condition failed: ${expression}`)
  }
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
  const exists = selector => `!!document.querySelector(${JSON.stringify(selector)})`
  const errors = []
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text))
  await cdp('Runtime.enable')
  await cdp('Page.enable')
  let role = null
  // Fixtures cover authenticated styling without sending credentials or writes.
  events.set('Fetch.requestPaused', async event => {
    const url = new URL(event.request.url)
    let body = '{}'
    let status = 200
    if (url.pathname.endsWith('/api/session/current-user')) {
      body = JSON.stringify({ authenticated: !!role, username: 'ui-review', displayName: 'UI Review', roles: role ? [role] : [], locale: 'en_US' })
    } else if (url.pathname.endsWith('/website/home')) { status = 503 }
    else if (url.pathname.endsWith('/website/captcha')) { status = 503 }
    else body = JSON.stringify({ data: [], totalCount: 0, aaData: [], iTotalRecords: 0, iTotalDisplayRecords: 0 })
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
  await viewport(1366)
  await navigate('/department/dtic/dashboard', '.dtic-navigation')
  assert.equal(await evaluate('document.querySelectorAll("#side-menu > li").length'), 16)
  assert.equal(await evaluate('document.querySelectorAll("#side-menu a").length'), 41)
  assert.equal(await evaluate('document.querySelectorAll("#side-menu button[aria-expanded=true]").length'), 0)
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#sideNav")).width'), '250px')
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#sideNav")).backgroundColor'), 'rgb(49, 77, 171)')
  assert.match(await evaluate('getComputedStyle(document.querySelector(".dtic-navigation")).fontFamily'), /Helvetica/)
  await click('[aria-controls="submenu-dtic-4"]')
  assert.equal(await evaluate('document.querySelector("#submenu-dtic-4").hidden'), false)
  assert.equal(await evaluate('document.querySelector("#submenu-dtic-4 a").getAttribute("href")'), '/department/dtic/dticfapendingapplicantsunit')
  await screenshot('financial-assistance-desktop')
  await click('[aria-controls="submenu-dtic-5"]')
  assert.equal(await evaluate('document.querySelector("#submenu-dtic-4").hidden'), true)
  await click('[aria-controls="submenu-dtic-5-1"]')
  assert.equal(await evaluate('document.querySelector("#submenu-dtic-5-1").hidden'), false)
  assert.equal(await evaluate('document.querySelectorAll("#submenu-dtic-5-1 a").length'), 5)
  await click('[aria-controls="submenu-dtic-9"]')
  await click('[aria-controls="submenu-dtic-9-1"]')
  assert.equal(await evaluate('document.querySelectorAll("#submenu-dtic-9-1 a").length'), 3)
  assert.equal(await evaluate('document.querySelectorAll("#submenu-dtic-1 a[target=_blank]").length'), 2)
  await click('.portal-lang-capsule')
  assert.match(await evaluate('document.querySelector("#side-menu > li span").textContent'), /[\u0900-\u097f]/)
  assert.equal(await evaluate('/[??]/.test(document.querySelector("#side-menu").textContent)'), false)
  await screenshot('hindi-desktop')
  await click('#sidebarToggle')
  await waitFor('getComputedStyle(document.querySelector("#sideNav")).width === "0px"')
  await click('#sidebarToggle')
  await viewport(390, 844)
  await click('.portal-mobile-toggle')
  await waitFor('getComputedStyle(document.querySelector("#sideNav")).display !== "none"')
  await noOverflow('DTIC mobile')
  await screenshot('mobile')
  await viewport(1366)
  await navigate('/department/dtic/viewapplicationlist', '.dtic-msme-list .dtic-add-msme')
  assert.equal(await evaluate('document.querySelector("#submenu-dtic-5").hidden'), false)
  assert.equal(await evaluate('document.querySelector(".dtic-add-msme").getAttribute("href")'), '/department/dtic/viewmsmeform')
  await waitFor(exists('.dtic-msme-list .dataTables_empty'))
  await noOverflow('MSME desktop')
  await screenshot('msme-applications-desktop')
  await viewport(390, 844)
  await noOverflow('MSME mobile')
  await screenshot('msme-applications-mobile')
  await click('.dtic-add-msme')
  await waitFor('location.pathname === "/department/dtic/viewmsmeform" && !!document.querySelector(".dtic-page form")')
  role = 'ROLE_ID'
  await navigate('/department/id/dashboard', '#sideNav')
  assert.equal(await evaluate(exists('.dtic-navigation')), false)
  assert.equal(await evaluate(exists('#sideNav a[href="/department/land-scrutiny"]')), true)
  assert.deepEqual(errors, [])
  console.log('PASS: DTIC role isolation, 16 menu entries, 41 destinations and MSME toolbar action, nested accordion, GIS targets, React Industrial Unit link, Hindi, desktop/mobile and collapse behavior. Backend authentication used fixtures; legacy screens were not executed.')
} finally {
  socket?.close()
  browser.kill()
}
