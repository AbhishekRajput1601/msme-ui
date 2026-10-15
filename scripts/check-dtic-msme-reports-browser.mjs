import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
const fixture = url => {
  if (url.pathname.includes('validatemicrolevel')) return {successMessage:'Success'}
  if (url.pathname.includes('levelapplicants')) return {aaData:[{uamNumber:'TEST-001',unitName:'Reference Unit',nicCode:null}],iTotalRecords:21,iTotalDisplayRecords:21}
  if (url.pathname.includes('enterprisereport')) return [{description:'Test category',microScaleNumber:2,totalUnitNumber:2}]
  return {}
}

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5173'
const output = path.resolve('artifacts/dtic-msme-reports/browser')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/dtic-msme-reports-browser')
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


  await cdp('Page.addScriptToEvaluateOnNewDocument', {source:'window.open=url=>{window.lastDownload=url}'})
  const fill = (selector,value) => evaluate(`(() => {
    const el=document.querySelector(${JSON.stringify(selector)});
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});
    el.dispatchEvent(new Event('input',{bubbles:true}));
  })()`)
  for (const kind of ['serviceenterprise','manufacturingenterprise','microlevel','smalllevel','mediumlevel']) {
    await navigate('/department/dtic/'+kind+'reportform','.dtic-msme-reports')
    await waitFor('!!document.querySelector("#fromDateId")')
    await evaluate('document.querySelector(".dtic-msme-reports form").requestSubmit()')
    await waitFor('document.body.innerText.includes("Please enter date")')
    await fill('#fromDateId','01/04/2026')
    await fill('#toDateId','30/04/2026')
    await evaluate('document.querySelector(".dtic-msme-reports form").requestSubmit()')
    const level=kind.endsWith('level')
    await waitFor(`document.body.innerText.includes('${level?'TEST-001':'Test category'}')`)
    if(level) {
      assert.equal(await evaluate('document.querySelectorAll("#dynamic-table thead th").length'),18)
      await click('[aria-label="Next page"]')
      await waitFor('document.querySelector(".dataTables_info").textContent.includes("11 to 20")')
      await fill('#toDateId','31/05/2026')
      await evaluate('document.querySelector(".dtic-msme-reports form").requestSubmit()')
      await waitFor('document.querySelector(".dataTables_info")?.textContent.includes("1 to 10")')
    }
    await evaluate('Array.from(document.querySelectorAll(".dtic-msme-reports button")).find(b=>b.textContent.trim()==="Download").click()')
    assert.equal(await evaluate('window.lastDownload'),'/mpmsme/dtic/download'+kind+'report/01-04-2026/'+(level?'31-05-2026':'30-04-2026'))
    await screenshot(kind)
  }
  await navigate('/department/dtic/viewapplicationlist','.dtic-msme-list')
  await navigate('/department/dtic/viewmsmeform','.dtic-msme-form')
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify({passed:true,pages:7,errors,mode:'Fixture-backed reports; no live writes'},null,2))
  console.log('PASS: five reports, validation, all 18 columns, paging, resubmission, download URLs, applications list and form.')
} finally { socket?.close(); browser.kill() }
