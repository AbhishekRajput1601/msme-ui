import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { fixture, routes } from './dtic-ox-fixtures.mjs'

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5173'
const output = path.resolve('artifacts/dtic-ox/browser')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/dtic-ox-browser')
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
  const errors = []
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text))
  await cdp('Runtime.enable')
  await cdp('Page.enable')
  let role = null
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
  await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'window.confirm=()=>true;window.alert=()=>{}'})
  await viewport(1366)

  const downloads = new Map(), completedDownloads = new Set()
  events.set('Browser.downloadWillBegin', event => downloads.set(event.suggestedFilename,event.guid))
  events.set('Browser.downloadProgress', event => { if (event.state==='completed') completedDownloads.add(event.guid) })
  await send('Browser.setDownloadBehavior', {behavior:'allow', downloadPath:path.join(output,'downloads'), eventsEnabled:true})
  const waitDownload = async name => {
    for (let attempt=0; attempt<50; attempt++) {
      if (completedDownloads.has(downloads.get(name))) return
      await new Promise(resolve=>setTimeout(resolve,100))
    }
    throw new Error('Missing download: '+name)
  }
  const problems = []
  const fill = (selector,value) => evaluate(`(() => {
    const el=document.querySelector(${JSON.stringify(selector)});
    const proto=el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto,'value').set.call(el,${JSON.stringify(value)});
    el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));
  })()`)
  for (const route of routes) {
    await navigate('/department/dtic/'+route.path,'.dtic-ox')
    await waitFor('!!document.querySelector("[name=supplyType_0_0]")')
    await new Promise(resolve=>setTimeout(resolve,300))
    const alerts=await evaluate('Array.from(document.querySelectorAll(".dtic-ox > [role=alert]")).map(n=>n.textContent)')
    problems.push(...alerts)
    assert(await evaluate('!!document.querySelector("#submitBtn")'), 'SAVE button must render')
    await screenshot(route.path)
    assert.equal(await evaluate('document.querySelector("[name=supplyType_0_0]").value'),'1')
    assert.equal(await evaluate('document.querySelector("[name=supplyName_0_0]").value'),'2')
    await click('.dtic-ox input[value="+"]')
    await waitFor('!!document.querySelector("[name$=_0_1]")')
    assert.equal(await evaluate('document.querySelector("[name=supplyType_0_0]").value'),'1')
  }
  await navigate('/department/dtic/ox1Form','.dtic-ox')
  await waitFor('!!document.querySelector("[name=openingStock_0]")')
  await fill('[name=openingStock_0]','20')
  await waitFor('document.querySelector("[name=totalAvailable_0]").value === "25.000"')
  assert.equal(await evaluate('document.querySelector("[name=closingStock_0]").value'),'22.000')
  await click('[name=supplyName_0_0]')
  await waitFor('document.querySelector("[name=supplyName_0_0]").options.length === 3')
  await fill('[name=supplyName_0_0]','3')
  await click('#submitBtn')
  await waitFor('document.querySelector("[name=supplyQty_0_0]").required')
  assert.equal(requests.filter(r=>r.method==='POST').length,0,'Missing conditional quantity blocks save')
  await fill('[name=supplyQty_0_0]','2')
  await click('#submitBtn')
  await waitFor('document.body.innerText.includes("Saved successfully")')
  assert.equal(requests.filter(r=>r.url.endsWith('/saveOX1Form')).length,1)
  const body=JSON.parse(requests.find(r=>r.url.endsWith('/saveOX1Form')).body)
  assert.equal(body.ox1BeanList[0].openingStock,'20')
  assert.equal(body.ox1BeanList[0].ox1DetailsBeans[0].supplyNameId,'3')
  await click('.dtic-ox input[value="Export to Excel"]')
  await waitDownload('OX1_Data_'+new Date().toLocaleDateString('en-GB').replaceAll('/','_')+'.xls')
  await fill('#entryDate','01/01/2000')
  await waitFor('document.querySelector("#submitBtn").parentElement.style.display === "none"')
  assert(await evaluate('document.querySelector("[name=openingStock_0]").disabled'))
  await waitFor('document.querySelector("[name=totalAvailable_0]").value === "15.000"')
  await viewport(390,844)
  await noOverflow('OX table scrolls inside its container')
  await screenshot('ox1-mobile')
  await viewport(1366)
  for (const route of ['legacyData','id/editViewLegacyData/1','completeDataOfLandApplicant','esignPaymentPendencyReport']) {
    await navigate('/department/dtic/'+route,'[data-dtic-view]')
    await new Promise(resolve=>setTimeout(resolve,400))
    const alerts=await evaluate('Array.from(document.querySelectorAll("[data-dtic-view] > [role=alert]")).map(n=>n.textContent)')
    problems.push(...alerts)
    await screenshot(route.replaceAll('/','-'))
    if (route.includes('Report') || route.includes('completeData')) {
      assert(await evaluate('document.querySelector("#year").options.length > 10'))
      await evaluate('document.querySelector("form").requestSubmit()')
      await waitFor('document.body.innerText.includes("Please select month and year")')
      await fill('#year',String(new Date().getFullYear()))
      await fill('#month','01')
      await evaluate('document.querySelector("form").requestSubmit()')
      await waitFor('document.querySelectorAll("#dataTable tbody tr").length > 0')
      await click('.dtic-land-records a.btn-success')
      await waitDownload(route.includes('esign') ? 'esign_and_payment_pendency_report.xlsx' : 'applicant_wise_complete_land_details.xlsx')
    }
  }
  console.log(JSON.stringify({problems,errors},null,2))
  assert.deepEqual(problems,[])
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify({passed:true,mode:'Fixture-backed; no live writes',pages:8,errors,problems,downloads:[...downloads.keys()]},null,2))
  console.log('PASS: eight pages, nested rows, calculations, dependent validation, save payload, historical locks, mobile table, report results and completed Excel downloads.')
} finally { socket?.close(); browser.kill() }
