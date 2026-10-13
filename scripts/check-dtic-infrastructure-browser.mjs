import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fixture, routes } from './dtic-infrastructure-fixtures.mjs'

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5173'
const output = path.resolve('artifacts/dtic-infrastructure/browser')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/dtic-infrastructure-browser')
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
  let viewOverride
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
    else { const data = fixture(url,event.request.method,viewOverride); body = typeof data==='string' ? data : JSON.stringify(data) }
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
  await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'window.confirm=()=>true;window.alert=()=>{}'})
  await viewport(1366)
  const problems = []
  for (const route of routes.filter(route=>!process.env.UI_CHECK_PATH || route.path===process.env.UI_CHECK_PATH)) {
    const url='/department/dtic/'+route.path.replace(/:[A-Za-z]+/g,'1')
    await navigate(url,'.dtic-infrastructure')
    await new Promise(resolve=>setTimeout(resolve,300))
    const alerts=await evaluate('Array.from(document.querySelectorAll(".dtic-infrastructure > [role=alert]")).map(n=>n.textContent)')
    if (alerts.length) problems.push({url,alerts})
    assert(await evaluate('document.querySelector(".dtic-infrastructure").innerText.trim().length > 20'),`${url}: page must contain its form or details`)
    if (route.path.startsWith('eSingAOLetter')) {
      const fields=await evaluate('Array.from(document.querySelectorAll(".dtic-infrastructure input, .dtic-infrastructure textarea")).map(n=>({tag:n.tagName,name:n.name,type:n.type}))')
      assert(fields.length>=6,'Signing fields must render: '+JSON.stringify(fields))
    }
    if (['dticCreateIndustrialArea','dticCreateCollectorRate','dticCreateIndustrialAreaRate','entervacantland','dticLandAllotment','dticLandAcquisition','noticeList','backlogLandAllotment'].includes(route.path)) {
      await screenshot(route.path)
    }
    if (route.path==='id/viewAppliedApplicants/:vacantLandId') await screenshot('applicant-plot-details')
    if (route.path==='entervacantland') {
      await evaluate('document.querySelector("input[type=file]").scrollIntoView({block:"center"})')
      await screenshot('vacant-land-upload')
    }
  }
  for (const route of routes.filter(route=>!process.env.UI_CHECK_PATH && route.views.length>1)) {
    for (const name of route.views.slice(0,-1)) {
      viewOverride=name
      await navigate('/department/dtic/'+route.path.replace(/:[A-Za-z]+/g,'1'),'.dtic-infrastructure')
      assert.equal(await evaluate('document.querySelector(".dtic-infrastructure").dataset.dticView'),name,'Backend-selected template branch')
    }
  }
  viewOverride=undefined
  await navigate('/department/dtic/dticCreateIndustrialArea','.dtic-infrastructure')
  const writesBefore=requests.filter(r=>r.method==='POST').length
  await evaluate('document.querySelector(".dtic-infrastructure form").requestSubmit()')
  assert.equal(requests.filter(r=>r.method==='POST').length,writesBefore,'Required fields must block submission')
  await viewport(390,844)
  await noOverflow('Industrial area mobile form')
  await screenshot('industrial-area-mobile')
  console.log(JSON.stringify({problems,errors},null,2))
  assert.deepEqual(problems,[])
  assert.deepEqual(errors,[])
  assert.equal(requests.some(r=>r.method==='POST'),false,'Opening a page must not submit an application')
  console.log('PASS: all infrastructure routes initialize with fixtures; no runtime errors or unintended submissions.')
} finally { socket?.close(); browser.kill() }
