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
const output = path.resolve('artifacts/land-allotment')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/land-detail-browser-' + process.pid)
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
  events.set('Runtime.consoleAPICalled', event => { if (event.type === 'error') errors.push(event.args.map(arg => arg.value || arg.description).join(' ')) })
  await cdp('Runtime.enable')
  await cdp('Page.enable')


  const requests = []
  const application = {
    applicantId: 17, applicationId: 'ID_BHOP_2026-27_12279', constitution: 'Proprietorship', category: 'General',
    industrialProfileBean: { indOrgName: 'Fixture Manufacturing Unit', firmCategory: 'Micro', firmConstitution: 'Proprietorship', panNo: 'ABCDE1234F', industrialPartnerslist: [] },
    vacantLandBean: { districtName: 'Bhopal', dticName: 'DTIC Bhopal', tehsilName: 'Huzur', industrialAreaName: 'Test Industrial Area', plotNumber: 'P42', industrialCategoryName: 'Manufacturing' },
    ctPaymentBean: { crn: 'CRN-TEST-42', amount: 1000, status: 'Success' },
    idEmploymentBeans: [{empName:'Skilled Workers',empNumber:3}], investmentBeans: [], financeBeans: [], itemsManufactured: [], landDetails: [],
  }
  events.set('Fetch.requestPaused', async event => {
    const url = new URL(event.request.url)
    let data = {}
    if (url.pathname.endsWith('/api/session/current-user')) data = {authenticated:true,username:'fixture-applicant',displayName:'Test Applicant',roles:['ROLE_APPLICANT']}
    else if (url.pathname.includes('/fetchApplicationDetail/')) data = application
    else if (url.pathname.endsWith('/id/fetchDocumentsList')) data = [{documentType:'Project report',documentTypeShort:'PROJECT_REPORT'}]
    else if (url.pathname.endsWith('/id/fetchIndustrialProfileDocumentsList')) data = [{id:42,type:'PAN certificate'}]
    else if (url.pathname.endsWith('/api/shell/menu')) data = []
    await cdp('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify(data)).toString('base64')})
  })
  await cdp('Fetch.enable',{patterns:[{urlPattern:'*/mpmsme/*'},{urlPattern:'*/backend/*'}]})
  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false})
  await cdp('Page.navigate',{url:base+'/applicant/land-allotment/detail/17'})
  await waitFor('document.querySelector("#applicationForm")?.textContent.includes("Fixture Manufacturing Unit")')
  assert.equal(await evaluate('document.querySelectorAll("#applicationForm input, #applicationForm select, #applicationForm textarea").length'),0)
  assert.ok(await evaluate('document.querySelector("#applicationForm").textContent.includes("CRN-TEST-42")'))
  assert.ok(await evaluate('document.querySelector("#applicationForm").textContent.includes("Skilled Workers")'))
  assert.ok(await evaluate('document.querySelector("#applicationForm").textContent.includes("Declaration")'))
  assert.equal(await evaluate('document.querySelector("#applicationForm a[href*=downloadDocumentById]").getAttribute("href")'),'/mpmsme/applicant/downloadDocumentById/42')
  await evaluate('window.open=(url)=>{window.lastDownload=url};window.print=()=>{window.printCalled=true}')
  await evaluate('[...document.querySelectorAll("#applicationForm a")].find(a=>a.closest("tr").textContent.includes("Project report")).click()')
  assert.equal(await evaluate('window.lastDownload'),'/mpmsme/applicant/id/downloaddocument/PROJECT_REPORT/17')
  await click('.land-application-actions button')
  assert.equal(await evaluate('window.printCalled'),true)
  await waitFor('[...document.querySelectorAll("#applicationForm img")].every(img=>img.complete && img.naturalWidth > 0)')
  fs.writeFileSync(path.join(output,'application-detail-desktop.png'),Buffer.from((await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data,'base64'))
  await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true})
  assert.ok(await evaluate('document.documentElement.scrollWidth <= 390'))
  fs.writeFileSync(path.join(output,'application-detail-mobile.png'),Buffer.from((await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data,'base64'))
  await cdp('Emulation.setDeviceMetricsOverride',{width:794,height:1123,deviceScaleFactor:1,mobile:false})
  await cdp('Emulation.setEmulatedMedia',{media:'print'})
  assert.equal(await evaluate('document.querySelector(".postLoginHeader").getClientRects().length'),0)
  assert.equal(await evaluate('document.querySelector(".land-application-toolbar").getClientRects().length'),0)
  assert.ok(await evaluate('document.querySelector("#applicationForm").getClientRects().length > 0'))
  fs.writeFileSync(path.join(output,'application-detail-print.png'),Buffer.from((await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data,'base64'))
  fs.writeFileSync(path.join(output,'application-detail.pdf'),Buffer.from((await cdp('Page.printToPDF',{preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false})).data,'base64'))
  assert.deepEqual(errors,[])
  console.log('Land application detail checks passed: original tables, populated fields, document downloads, mobile layout and form-only PDF.')
} finally {
  try { socket?.close() } catch {}
  browser.kill()
  await server.close()
}
