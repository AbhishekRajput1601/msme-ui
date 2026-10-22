import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {spawn} from 'node:child_process'
import {fixture} from './ldm-fixtures.mjs'
// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5173'
const output = path.resolve('artifacts/ldm/browser')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/ldm-browser')
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
  socket = new WebSocket(websocket.replace('localhost','127.0.0.1'))
  await new Promise((resolve,reject) => {
    const timer=setTimeout(()=>reject(new Error('Browser socket connection timed out')),10000)
    socket.addEventListener('open',()=>{clearTimeout(timer);resolve()},{once:true})
    socket.addEventListener('error',()=>{clearTimeout(timer);reject(new Error('Browser socket connection failed'))},{once:true})
  })
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
      try { if (await evaluate(`Boolean(${expression})`)) return }
      catch (error) { if (!/navigated|context|closed/i.test(error.message)) throw error }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error(`Condition failed: ${expression}\n${await evaluate('document.body.innerText.slice(-2500)')}\n${JSON.stringify(errors)}`)
  }
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
  const exists = selector => `!!document.querySelector(${JSON.stringify(selector)})`
  const errors = []
  events.set('Runtime.exceptionThrown', event => (console.error(event.exceptionDetails.exception?.description || event.exceptionDetails.text),errors.push(event.exceptionDetails.exception?.description || event.exceptionDetails.text)))
  events.set('Runtime.consoleAPICalled', event => {
    const message=(event.args||[]).map(arg=>arg.value||arg.description||'').join(' ')
    if(event.type==='error' && /In HTML|cannot contain a nested/.test(message))errors.push(message)
  })
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

  role='ROLE_LDM'
  await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'window.confirm=()=>true;window.alert=m=>(window.lastAlert=m)'})
  await viewport(1366)
  const button=label=>evaluate(`Array.from(document.querySelectorAll('.ldm-page button,.ldm-page a')).find(e=>e.textContent.trim()===${JSON.stringify(label)}).click()`)
  const setValue=(selector,value)=>evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))})()`)
  await navigate('/department/ldm/dashboard','.ldm-page')
  await evaluate('window.alert=m=>(window.lastAlert=m);window.confirm=()=>true')
  await waitFor(`document.querySelector('.huge')?.textContent==='2'`)
  assert(await evaluate(`document.querySelector('.ldm-page h1').getBoundingClientRect().height>0`),'Dashboard heading must remain visible')
  assert(await evaluate(`(()=>{const link=document.querySelector('.ldm-navigation a'),label=link.querySelector('span');return label.getBoundingClientRect().right<=link.getBoundingClientRect().right})()`),'Dashboard menu label must fit inside sidebar')
  await screenshot('dashboard')
  await button('Go to Verification')
  await waitFor(`document.querySelectorAll('.ldm-page input[type=checkbox]').length===2`)
  assert(await evaluate(`(()=>{const buttons=[...document.querySelectorAll('.ldm-page button')];const submit=buttons.find(e=>e.textContent==='Submit (Verify)').getBoundingClientRect();const query=buttons.find(e=>e.textContent==='Query Raised').getBoundingClientRect();return query.left-submit.right>=12})()`),'Submit and Query need a visible gap')
  assert.equal(await evaluate(`document.querySelectorAll('.ldm-page input[type=checkbox]')[1].disabled`),true)
  await button('Submit (Verify)')
  assert.match(await evaluate('window.lastAlert'),/select at least one/)
  await click('.ldm-page input[type=checkbox]')
  await click('.ldm-page button[title="Open remarks popup"]')
  await waitFor(`!!document.querySelector('[role=dialog]')`)
  await setValue('select[aria-label="Preset (optional)"]','Verified')
  await button('Save')
  await button('Submit (Verify)')
  await waitFor(`document.querySelector('.ldm-page .alert-success')`)
  assert(requests.some(r=>r.url==='/mpmsme/ldm/verify' && JSON.parse(r.body)[0].remark==='Verified'))
  await click('.ldm-page input[type=checkbox]')
  await button('Query Raised')
  await waitFor(`!document.querySelector('.ldm-page [role=status]')`)
  await button('Remarks')
  await waitFor(`document.querySelector('[role=dialog]')?.textContent.includes('Secretary')`)
  await screenshot('remarks')
  await button('Close')
  await button('View')
  await waitFor(`document.querySelector('.ldm-page')?.textContent.includes('ABCDE1234F')`)
  assert.equal(await evaluate(`document.querySelectorAll('.ldm-page .panel-heading button,.ldm-page .panel-heading a').length`),0,'Remove top detail actions')
  assert.equal(await evaluate(`getComputedStyle(document.querySelector('.ldm-detail-page th')).backgroundColor`),'rgb(243, 244, 246)','Detail fields use neutral backgrounds')
  assert.equal(await evaluate(`document.querySelector('.ldm-page a[href*="downloadDoc"]')?.getAttribute('href')`),'/mpmsme/ldm/downloadDoc/19/LDM-1')
  await screenshot('detail')
  await button('Progress Details')
  await waitFor(`location.pathname.includes('viewfaapplicantHistory') && document.querySelector('.ldm-page')?.textContent.includes('Secretary Verified')`)
  await button('Back')
  await waitFor(`location.pathname==='/department/ldm/detail/LDM-1' && document.querySelector('.ldm-page')?.textContent.includes('ABCDE1234F')`)
  await button('Back')
  await waitFor(`location.pathname==='/department/ldm/verification' && document.querySelectorAll('.ldm-page input[type=checkbox]').length===2`)
  await navigate('/department/ldm/batches','.ldm-page')
  await evaluate('window.alert=m=>(window.lastAlert=m);window.confirm=()=>true')
  await waitFor(`document.querySelector('.ldm-page')?.textContent.includes('BATCH-4')`)
  await button('Open Batch')
  await waitFor(`!!document.querySelector('.ldm-page select')`)
  assert.equal(await evaluate(`document.querySelector('.ldm-page select').value`),'Agree')
  assert(await evaluate(`document.querySelector('.ldm-page').textContent.includes('--')`))
  await button('Capital subsidy')
  await waitFor(`document.querySelector('.ldm-page').textContent.includes('Document needs verification')`)
  await button('Close')
  await setValue('.ldm-page select','Disagree')
  await button('Forward Batch to Collector')
  assert.match(await evaluate('window.lastAlert'),/Remark Note is mandatory/)
  assert(!requests.some(r=>r.url.endsWith('/submitBatch/4')))
  await setValue('.ldm-page input[maxlength="1000"]','Please clarify the document')
  await screenshot('batch-detail')
  await button('View/Print')
  await waitFor(`location.pathname.includes('viewfaapplicantdetailunitnew') && document.querySelector('.ldm-page')?.textContent.includes('Industrial Unit One')`)
  await screenshot('view-print')
  await evaluate(`Array.from(document.querySelectorAll('.ldm-page a,.ldm-page button,.ldm-page input')).find(e=>/^(Cancel|Back)$/.test(e.textContent.trim()||e.value)).click()`)
  await waitFor(`location.pathname.endsWith('/batches') && !!document.querySelector('.ldm-page select')`)
  assert.equal(await evaluate(`document.querySelector('.ldm-page select').value`),'Disagree')
  assert.equal(await evaluate(`document.querySelector('.ldm-page input[maxlength="1000"]').value`),'Please clarify the document')
  await button('Progress Details')
  await waitFor(`location.pathname.includes('viewfaapplicantHistory') && document.querySelector('.ldm-page')?.textContent.includes('Secretary Verified')`)
  await screenshot('progress')
  await button('Back')
  await waitFor(`location.pathname.endsWith('/batches') && !!document.querySelector('.ldm-page select')`)
  await button('Forward Batch to Collector')
  await waitFor(`!document.querySelector('.ldm-page select')`)
  const submission=requests.find(r=>r.url.endsWith('/submitBatch/4'))
  assert.deepEqual(JSON.parse(submission.body),[{applicationNo:'LDM-1',remark:'Disagree',remarkText:'Please clarify the document'}])
  await button('Additional Document')
  await new Promise(resolve=>setTimeout(resolve,200))
  assert(requests.some(r=>r.url.endsWith('/downloadCoveringLetter/4')))
  await button('Open Batch')
  await waitFor(`!!document.querySelector('.ldm-page select')`)
  await evaluate(`Array.from(document.querySelectorAll('.ldm-page button')).find(e=>e.textContent.includes('Back to batch list')).click()`)
  await waitFor(`!document.querySelector('.ldm-page select')`)
  await viewport(390,844)
  await screenshot('batches-mobile')
  await noOverflow('LDM mobile')
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({errors,requests},null,2))
  assert.deepEqual(errors,[])
  console.log('PASS: All six LDM routes, verification/query, batch validation, modal, downloads, mobile, and draft restoration.')
} finally { socket?.close(); browser.kill() }
