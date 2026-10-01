import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { createServer } from 'vite'

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const server = await createServer({ server: { port: 0, host: '127.0.0.1' } })
await server.listen()
const base = `http://127.0.0.1:${server.httpServer.address().port}`
const output = path.resolve('artifacts/ui-migration')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/migration-check-browser')
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
  const _exists = selector => `!!document.querySelector(${JSON.stringify(selector)})`
  const errors = []
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.text))
  await cdp('Runtime.enable')
  await cdp('Page.enable')

  const requests = []
  let failContent = false
  // Controlled test responses only. Production modules never import these fixtures.
  const content = label => '<header class="header-new-section"></header><div class="container"><h4 class="heading">' + label + '</h4><div class="inner-content"><div class="panel-group"><div class="panel"><div class="panel-heading">Published documents</div><div class="panel-collapse collapse"><p>Backend content</p><a href="/downloadDocument/7">Download document</a></div></div></div><script>window.injected = true</script><img src="javascript:alert(1)" onerror="alert(1)"></div></div>'
  const registrationForm = '<form name="signupform" action="presignup" method="post"><input name="mobileNumber" placeholder="Mobile number" value=""><input type="hidden" name="csrfPreventionSalt" value="test-token"><input type="submit" value="Continue"></form>'
  events.set('Fetch.requestPaused', async event => {
    const url = new URL(event.request.url)
    if (event.resourceType === 'Document' && !url.pathname.startsWith('/backend/')) {
      await cdp('Fetch.continueRequest', {requestId:event.requestId}); return
    }
    requests.push({path:url.pathname,method:event.request.method,body:event.request.postData})
    let status = 200, type = 'text/html', body = ''
    if (url.pathname.endsWith('/api/session/current-user')) { type='application/json'; body=JSON.stringify({authenticated:false}) }
    else if (url.pathname.endsWith('/website/home')) {status=503; body='Unavailable'}
    else if (url.pathname.endsWith('/website/viewsignup')) body=registrationForm
    else if (url.pathname.endsWith('/website/presignup')) body=registrationForm.replace('<form', '<p class="text-danger">Mobile number rejected by server</p><form')
    else if (url.pathname.includes('/backend/website/')) {status=failContent?503:200;body=content(url.pathname.split('/').pop())}
    else {status=503;body='Unavailable'}
    try { await cdp('Fetch.fulfillRequest', {requestId:event.requestId,responseCode:status,responseHeaders:[{name:'Content-Type',value:type}],body:Buffer.from(body).toString('base64')}) }
    catch(error) {if(!/Invalid InterceptionId|closed|session/i.test(error.message))errors.push(error.message)}
  })
  await cdp('Fetch.enable',{patterns:[{urlPattern:'*/backend/*'},{urlPattern:'*/mpmsme/*'}]})
  const navigate = async route => {
    await cdp('Page.navigate',{url:base+route})
    await waitFor('document.readyState === "complete" && !!document.querySelector(".legacy-public")')
  }
  for(const page of ['downloads','orderCirculars','albums','gallery','usefulLinks','whatsNew','events','search','about-department']) {
    await navigate('/website/'+page+'?searchparam=industry')
    await waitFor('!!document.querySelector(".public-content-page details")')
    assert.equal(await evaluate('document.querySelector(".public-content-page h1").textContent'),page)
    assert.equal(await evaluate('window.injected === undefined'),true)
    assert.equal(await evaluate('document.querySelectorAll(".public-content-page script, .public-content-page [onerror]").length'),0)
    assert.equal(await evaluate('document.querySelector(".public-content-page a[href*=downloadDocument]").getAttribute("href")'),'/mpmsme/downloadDocument/7')
    await click('.public-content-page summary')
    assert.equal(await evaluate('document.querySelector(".public-content-page details").open'),true)
  }
  await navigate('/mpmsme/website/downloads')
  await waitFor('location.pathname === "/website/downloads" && !!document.querySelector(".public-content-page details")')
  failContent = true
  await navigate('/website/downloads')
  await waitFor('!!document.querySelector(".public-content-page [role=alert]")')
  assert.equal(await evaluate('document.querySelectorAll(".public-content-page details").length'),0)
  failContent = false
  await click('.public-content-page button')
  await waitFor('!!document.querySelector(".public-content-page details")')
  await navigate('/')
  await waitFor('!!document.querySelector("main [role=alert]")')
  assert.equal(await evaluate('document.querySelectorAll(".legacy-slideshow").length'),0)
  await navigate('/signup')
  await waitFor('!!document.querySelector(".account-form-page input[name=mobileNumber]")')
  await evaluate('document.querySelector(".account-form-page form").requestSubmit()')
  await waitFor('document.querySelector(".account-form-page").textContent.includes("Mobile number rejected by server")')
  assert.equal(await evaluate('document.querySelectorAll(".account-form-page .alert-success").length'),0)
  assert(requests.some(request => request.path === '/backend/website/presignup' && request.body.includes('csrfPreventionSalt=test-token')))
  const parsed = await evaluate(`import('/src/modules/auth/BackendAccountForm.jsx').then(({parseAccountForm}) => {
    const next = parseAccountForm('<form name="signupform" action="presignupauth"><input name="otp"><input type="hidden" name="mobileNumber" value="test-mobile"></form>', location.origin+'/backend/website/presignup', '/website/presignup');
    return {action:next.action, names:next.fields.map(field=>field.name)}
  })`)
  assert.equal(parsed.action,'/website/presignupauth')
  assert.deepEqual(parsed.names,['otp','mobileNumber'])
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify({passed:true,checks:['9 public content routes','legacy URL redirect','accordion interaction','script/URL sanitization','HTTP failure and retry','homepage failure has no fabricated content','backend form validation and hidden token','registration OTP form transition'],runtimeErrors:errors},null,2))
  console.log('Migration browser checks passed')
} finally {
  socket?.close()
  browser.kill()
  await server.close()
}
