import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5174'
const output = path.resolve('artifacts/header-pages')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/header-contract')
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
    for (let attempt = 0; attempt < 200; attempt++) {
      try { if (await evaluate(`Boolean(${expression})`)) return }
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

  let mode = 'populated'
  const requests = []
  events.set('Fetch.requestPaused', async event => {
    const url = new URL(event.request.url)
    requests.push(url.pathname + url.search)
    let body
    if (mode === 'invalid') body = { unexpected: [] }
    else if (url.pathname.includes('fetchAllLandAllotmentList')) body = { aaData: mode === 'empty' ? [] : [{plotNumber: 'CONTRACT-PLOT', industrialAreaName:'Contract area', districtName:'Contract district', totalPlotArea:0, premiumCharges:0}], iTotalDisplayRecords:mode === 'empty' ? 0 : 26 }
    else if (url.pathname.includes('fetchAllAdvanceSearchList')) body = {aaData:[{Subject:'CONTRACT-DOCUMENT', DateofIssue:'2026-01-01', DocURL:'https://example.invalid/test-only.pdf'}], iTotalDisplayRecords:1}
    else if (url.pathname.includes('applicationStatus')) body = {data:{applicationNo:'CONTRACT-APPLICATION',firstName:'Contract',lastName:'Test',status:'Pending',plotId:'TEST'}}
    else { await cdp('Fetch.continueRequest',{requestId:event.requestId}); return }
    await new Promise(resolve=>setTimeout(resolve,200))
    await cdp('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:mode==='error'?503:200,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify(body)).toString('base64')})
  })
  await cdp('Fetch.enable',{patterns:[{urlPattern:'*/backend/idLanding/*'},{urlPattern:'*/backend/advanceSearch/*'}]})
  const go = async route => { await cdp('Page.navigate',{url:base+route}); await waitFor("document.querySelector('.public-portal-page')"); await waitFor("!document.querySelector('.public-portal-page [aria-busy=true]')") }
  await go('/website/vacant-land-developed')
  await waitFor("document.querySelector('tbody')?.textContent.includes('CONTRACT-PLOT')")
  assert.equal(requests.filter(url=>url.includes('fetchAllLandAllotmentList')).length,1,'One initial request, including StrictMode')
  assert(requests[0].includes('industrialArea=Industrial+Area'))
  assert(await evaluate("[...document.querySelectorAll('tbody td')].some(e=>e.textContent==='0')"),'Preserve zero values')
  await click('nav[aria-label="Record pages"] button:last-child')
  await waitFor("document.querySelector('.public-portal-page [role=status]')?.textContent.includes('Page 2')")
  assert(requests.some(url=>url.includes('iDisplayStart=25')))
  mode='error'; await go('/website/vacant-land-undeveloped')
  assert(await evaluate("!!document.querySelector('.public-portal-page [role=alert]')"))
  assert(requests.some(url=>url.includes('industrialArea=Undeveloped+Land')))
  mode='empty'; await click('.public-portal-page [role=alert] button')
  await waitFor("document.querySelector('.public-portal-page')?.textContent.includes('No records match')")
  mode='invalid'; await go('/website/vacant-land-developed')
  assert(await evaluate("document.querySelector('[role=alert]')?.textContent.includes('unexpected data format')"))
  mode='populated'; await go('/website/advanceSearch')
  assert(await evaluate("document.querySelector('tbody')?.textContent.includes('CONTRACT-DOCUMENT')"))
  await evaluate("document.querySelector('[name=docIssueDateFrom]').value='2026-01-01';document.querySelector('[name=docIssueDateTo]').value='2026-01-31';document.querySelector('.public-portal-page form').requestSubmit()")
  await waitFor("!document.querySelector('.public-portal-page [aria-busy=true]')")
  assert(requests.some(url=>url.includes('docIssueDateFrom=2026-01-01')&&url.includes('docIssueDateTo=2026-01-31')))
  await go('/website/application-status')
  await evaluate("const input=document.querySelector('.public-portal-page input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'CONTRACT-APPLICATION');input.dispatchEvent(new Event('input',{bubbles:true}))")
  await click('.public-portal-page button[type=submit], .public-portal-page form button')
  await waitFor("document.querySelector('dl')?.textContent.includes('Pending')")
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(output,'contract-results.json'),JSON.stringify({passed:true,requests,errors},null,2))
  console.log('PASS: controlled contract checks — mapping, zero values, pagination, empty/error/invalid responses, retry, date search, application status, duplicate requests.')
} finally { socket?.close(); browser.kill() }
