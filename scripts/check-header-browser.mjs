import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5174'
const output = path.resolve('artifacts/header-pages')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/header-pages')
const browser = spawn(browserPath, ['--headless=new', '--disable-features=BackForwardCache', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
let socket
try {
  const websocket = await new Promise((resolve, reject) => {
    let stderr = ''
    const timeout = setTimeout(() => reject(new Error('Browser did not start')), 15000)
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
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timed out: ${method}`)) }, 15000)
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
    for (let attempt = 0; attempt < 450; attempt++) {
      try { if (await evaluate(`Boolean(${expression})`)) return }
      catch (error) { if (!/navigated|context|closed/i.test(error.message)) throw error }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error(`Condition failed: ${expression}; page=${await evaluate("JSON.stringify({url:location.href,title:document.title,body:document.body.innerText.slice(0,400)})")}`)
  }
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
  const exists = selector => `!!document.querySelector(${JSON.stringify(selector)})`
  const errors = []
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text))
  await cdp('Runtime.enable')
  await cdp('Page.enable')

  const { HEADER_NAVIGATION } = await import('../src/modules/public/menuData.js')
  const pages = HEADER_NAVIGATION.flatMap(item => item.children || (item.href !== '/' ? [item] : []))
  const findings = { pages: [], errors, responses: [], consoleErrors: [] }
  events.set('Runtime.consoleAPICalled', event => { if (event.type === 'error') findings.consoleErrors.push(event.args.map(arg => arg.value || arg.description).join(' ')) })
  await cdp('Network.enable')
  events.set('Network.responseReceived', event => {
    if (event.response.url.includes('/backend/')) findings.responses.push({ url: event.response.url, status: event.response.status, type: event.response.mimeType })
  })
  for (const item of pages) {
    if (!findings.pages.length) await cdp('Page.navigate', { url: base + item.href })
    else await evaluate('document.querySelector('+JSON.stringify('.mainmenu-list a[href='+JSON.stringify(item.href)+']')+').click()')
    await waitFor('location.pathname === '+JSON.stringify(item.href))
    await waitFor("document.querySelector('.public-portal-page')")
    if (findings.pages.length) {
      const previousTitle = findings.pages.at(-1).title
      await waitFor("document.querySelector('.public-portal-page h1')?.textContent !== " + JSON.stringify(previousTitle))
    }
    await waitFor("!document.querySelector('.public-portal-page [aria-busy=true]')")
    const result = await evaluate(`({path:location.pathname, title:document.querySelector('.public-portal-page h1')?.textContent, alerts:[...document.querySelectorAll('.public-portal-page [role=alert]')].map(e=>e.textContent), text:document.querySelector('.public-portal-page').innerText, links:[...document.querySelectorAll('.public-portal-page a')].map(a=>({label:a.textContent,href:a.getAttribute('href')}))})`)
    findings.pages.push(result)
    fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(findings,null,2))
    console.log(item.href, result.title, result.alerts.length ? 'ERROR STATE' : 'rendered')
    for (const width of [375, 768, 1440]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height:1000, deviceScaleFactor:1, mobile:false })
      assert(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), `${item.href}: overflow at ${width}`)
    }
  }
  // Client-side CMS/dedicated transitions exercise the former hook-order crash.
  await cdp('Page.navigate', { url: base + '/website/contact' })
  await waitFor("document.querySelector('.public-content-page')")
  await click('.mainmenu-list a[href="/website/acts-rules"]')
  await waitFor("document.querySelector('.public-portal-page')")
  await evaluate("history.back()")
  await waitFor("document.querySelector('.public-content-page')")
  // Keyboard dropdown behavior.
  await evaluate("document.querySelector('.public-dropdown').open=true")
  await evaluate("document.querySelector('.public-dropdown summary').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))")
  assert(await evaluate("!document.querySelector('.public-dropdown').open"))
  for (const width of [375,1440]) {
    await cdp('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:false})
    await cdp('Page.navigate',{url:base+'/website/vacant-land-developed'})
    await waitFor("document.querySelector('.public-portal-page')")
    await waitFor("!document.querySelector('.public-portal-page [aria-busy=true]')")
    const screenshot=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})
    fs.writeFileSync(path.join(output,`land-${width}.png`),Buffer.from(screenshot.data,'base64'))
  }
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(findings,null,2))
  assert.deepEqual(errors, [])
  assert.deepEqual(findings.consoleErrors, [])
  console.log(`PASS: ${pages.length} pages, three viewport widths, CMS navigation, keyboard dropdown; no runtime exceptions.`)
} finally { socket?.close(); browser.kill() }
