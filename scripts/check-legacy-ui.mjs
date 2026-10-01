import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5173'
const output = path.resolve('artifacts/ui-check')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/ui-check-browser')
const browser = spawn(browserPath, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
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
    else body = JSON.stringify({ data: [], totalCount: 0 })
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
  await viewport(1366)
  await navigate('/', '.legacy-slideshow')
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".topbar")).backgroundColor'), 'rgb(218, 76, 66)')
  assert.match(await evaluate('getComputedStyle(document.querySelector(".legacy-public")).fontFamily'), /Poppins/)
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#public-menu")).visibility'), 'visible')
  assert.equal(await evaluate('document.querySelector("#public-menu a").getBoundingClientRect().height > 0'), true)
  assert.deepEqual(await evaluate('Array.from(document.images).filter(img => img.src.includes("/legacy/") && !img.naturalWidth).map(img => img.src)'), [])
  await click('[aria-label="Pause slideshow"]')
  await waitFor(exists('[aria-label="Play slideshow"]'))
  await click('[aria-label="Next slide"]')
  await waitFor('document.querySelector(".legacy-slideshow > img").src.includes("banner2")')
  await noOverflow('Desktop home')
  await screenshot('home-desktop')
  await viewport(390, 844)
  await noOverflow('Mobile home')
  await click('[aria-label="Toggle navigation"]')
  await waitFor('document.querySelector("#public-menu").classList.contains("show")')
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#public-menu")).visibility'), 'visible')
  await screenshot('home-mobile')
  await viewport(1366)
  await navigate('/login', '#j_username')
  assert.equal(await evaluate('document.querySelector("#j_password").type'), 'password')
  await evaluate('document.querySelectorAll(".nav-tabs button")[1].click()')
  await waitFor(exists('form[aria-label="Department login"]'))
  assert.equal(await evaluate('document.querySelectorAll(".legacy-login-actions a").length'), 0)
  await evaluate('document.querySelectorAll(".nav-tabs button")[0].click()')
  await waitFor(exists('form[aria-label="User login"]'))
  await screenshot('login-desktop')
  await viewport(390, 844)
  await noOverflow('Mobile login')
  await screenshot('login-mobile')
  role = 'ROLE_APPLICANT'
  await viewport(1366)
  await navigate('/applicant/land-allotment', '#sideNav')
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#sideNav")).backgroundColor'), 'rgb(49, 77, 171)')
  assert.equal(await evaluate('document.querySelectorAll("#sideNav .nav-second-level .active").length'), 1)
  await noOverflow('Desktop applicant')
  await screenshot('applicant-desktop')
  await evaluate('document.querySelector("#sidebarToggle").click()')
  await waitFor('document.querySelector(".legacy-portal").classList.contains("sidebar-hidden")')
  await evaluate('document.querySelector("#sidebarToggle").click()')
  await viewport(390, 844)
  await evaluate('document.querySelector(".portal-mobile-toggle").click()')
  await waitFor('getComputedStyle(document.querySelector("#sideNav")).display !== "none"')
  await noOverflow('Mobile applicant')
  await screenshot('applicant-mobile')
  role = 'ROLE_ADMIN'
  await viewport(1366)
  await navigate('/admin/dashboard', '#sideNav')
  assert.equal(await evaluate(exists('#sideNav a[href="/admin/users"]')), true)
  assert.equal(await evaluate(exists('#sideNav a[href="/applicant/dashboard"]')), false)
  await screenshot('admin-desktop')
  role = 'ROLE_DTIC'
  await navigate('/department/dtic/dashboard', '.legacy-dashboard')
  assert.equal(await evaluate(exists('#sideNav a[href="/department/land-scrutiny"]')), true)
  await noOverflow('Department dashboard')
  await screenshot('department-desktop')
  role = null
  await navigate('/', '.legacy-slideshow')
  const parsed = await evaluate(`import('/src/modules/public/legacyWebsite.js').then(({ parseLegacyWebsite }) => {
    const markup = '<div class="header-new-section"><div class="logo-title"><h1>CMS department</h1></div></div>' +
      '<div id="slider"><a href="/mpmsme/website/login"><img src="/mpmsme/banner.png" alt="CMS banner"></a></div>' +
      '<div class="footer-widget"><a href="javascript:alert(1)">Unsafe</a><a href="/mpmsme/website/home">Home</a></div>' +
      '<div class="about"><div class="content_text_body"><p style="text-align:center" onclick="alert(1)">CMS introduction <strong>formatted</strong></p><script>alert(1)</script></div></div>' +
      '<nav class="mainmenu"><ul class="navbar-nav"><li><a>Services</a><ul><li><a>Land</a><ul><li><a href="/mpmsme/website/login">Apply</a></li></ul></li></ul></li></ul></nav>';
    const result = parseLegacyWebsite(markup, location.origin + '/mpmsme/website/home');
    return { title: result.departmentName, slides: result.slides, footer: result.footerLinks, content: result.aboutContent, menu: result.menu };
  })`)
  assert.equal(parsed.title, 'CMS department')
  assert.equal(parsed.slides[0].href, '/login')
  assert.deepEqual(parsed.footer, [{ label: 'Home', href: '/' }])
  assert.equal(parsed.content[0].tag, 'p')
  assert.equal(parsed.content[0].props.style.textAlign, 'center')
  assert.equal(parsed.content[0].children[1].tag, 'strong')
  assert.equal(parsed.content[0].props.onclick, undefined)
  assert.equal(parsed.content.length, 1)
  assert.equal(parsed.menu[0].children[0].children[0].href, '/login')
  assert.deepEqual(errors, [])
  console.log('PASS: original theme colours/fonts/assets, visible public menu, home carousel, login tabs, responsive layouts, applicant sidebar, admin/department navigation, public CMS extraction; no browser runtime exceptions. Backend responses were isolated fixtures.')
} finally {
  socket?.close()
  browser.kill()
}
