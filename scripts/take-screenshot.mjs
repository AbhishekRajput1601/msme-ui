import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

const browserPath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const url = 'http://localhost:5173/'
const outputPath = path.resolve('artifacts/current-homepage.png')
fs.mkdirSync(path.dirname(outputPath), { recursive: true })

const profile = path.resolve('node_modules/.cache/screenshot-profile')
const browser = spawn(browserPath, [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  'about:blank'
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })

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

  const socket = new WebSocket(websocket)
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }))

  let sequence = 0
  const pending = new Map()
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
    }
  })

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  const cdp = (method, params) => send(method, params, sessionId)

  await cdp('Page.enable')
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1536, height: 900, deviceScaleFactor: 1, mobile: false })
  await cdp('Page.navigate', { url })

  // Wait for loading to finish and page to render
  await cdp('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const about = document.querySelector('.hp-about');
        if (about) {
          clearInterval(interval);
          setTimeout(resolve, 1500); // Wait 1.5s more for images
        } else if (Date.now() - startTime > 25000) {
          clearInterval(interval);
          resolve();
        }
      }, 500);
    })`,
    awaitPromise: true
  })
  const curUrl = await cdp('Runtime.evaluate', { expression: 'window.location.href' })
  console.log('CURRENT_PAGE_URL:', curUrl.result.value)

  const debug = await cdp('Runtime.evaluate', {
    expression: `(() => {
      const s = document.querySelector('.public-search');
      const b = document.querySelector('.public-search button');
      const a = document.querySelector('.a_search');
      const l = document.querySelector('.btn_login');
      const g = document.querySelector('.toolbar-right-group');
      const t = document.querySelector('.public-toolbar');
      return JSON.stringify({
        toolbar_w: t?.offsetWidth,
        search_rect: s?.getBoundingClientRect(),
        search_btn_rect: b?.getBoundingClientRect(),
        search_btn_style: b ? { pos: getComputedStyle(b).position, top: getComputedStyle(b).top, right: getComputedStyle(b).right } : null,
        a_search_rect: a?.getBoundingClientRect(),
        login_rect: l?.getBoundingClientRect(),
        group_rect: g?.getBoundingClientRect(),
        group_gap: g ? getComputedStyle(g).gap : null
      });
    })()`,
    returnByValue: true
  })
  console.log('TOOLBAR_MEASUREMENTS:', debug.result.value)

  const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  fs.writeFileSync(outputPath, Buffer.from(data, 'base64'))
  console.log('SCREENSHOT_CAPTURED_SUCCESSFULLY:', outputPath)

  browser.kill()
} catch (err) {
  console.error('Screenshot error:', err)
  browser.kill()
  process.exit(1)
}
