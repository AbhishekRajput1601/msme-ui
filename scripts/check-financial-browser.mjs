import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
const routes=JSON.parse(fs.readFileSync('src/modules/financial/generated/routes.json','utf8'))
const fixture=(url)=>{
 if(url.pathname.includes('fetchUserIndustrialDetailsByApplicationId'))return {schemeYear:'2025',faIndustrialUnitBean:{unitType:'New',capitalInvestmentBeans:[],unitProductDetailsBeans:[]},faRequiredAssistanceBean:{selectedOptions:{}}};
 if(url.pathname.includes('fetchpendingapplicants/'))return {aaData:[{applicationId:'TEST-1',currentStatusId:2,commiteeRequired:true,unitOrInstName:'Test Unit',status:'Pending'}],iTotalRecords:1,iTotalDisplayRecords:1};
 if(url.pathname.includes('fetchInfrastructureList'))return {aaData:[],iTotalRecords:0,iTotalDisplayRecords:0};
 if(/fetch.*ReportData|dashboardReportData/.test(url.pathname))return [[],0];
 if(/fetch.*(?:List|list)|fetchDisbursementsUpload/.test(url.pathname))return [];
 return {};
}

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5173'
const output = path.resolve('artifacts/financial/browser')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/financial-browser')
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
  role = 'ROLE_FA'
  await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'window.confirm=()=>true;window.alert=()=>{}'})
  await viewport(1366)
  const problems=[]
  for(const route of routes.filter(r=>!process.argv.includes('--interactions-only') && (!process.argv.includes('--tables-only') || r.views.some(v=>/viewFADetailUnitNew2|faacceptanceamountdetailunit|faDisbursementUnit|viewfaDisbursementUnit/.test(v))) && (!process.env.UI_CHECK_PATH || r.path===process.env.UI_CHECK_PATH))){
    const suffix=route.path.replace(/:encodedList/g,encodeURIComponent(JSON.stringify([{applicationId:'TEST-1',sanctionedAmount:1000,disbursedAmount:0,check:true}]))).replace(/:[A-Za-z]+/g,'1')
    const url='/department/fa/'+suffix
    await navigate(url,'.financial-page')
    await new Promise(resolve=>setTimeout(resolve,300))
    const alerts=await evaluate('Array.from(document.querySelectorAll(".financial-page > [role=alert]")).map(n=>n.textContent)')
    if(alerts.length)problems.push({url,alerts})
    assert(await evaluate('document.querySelector(".financial-page").innerText.trim().length > 10'),url)
    if(['dticfapendingapplicantsunit','districtWiseReport','faDisbursementUnit_new','powerBiDashbord'].includes(route.path))await screenshot(route.path)
  }
  await navigate('/department/fa/dashboard','.financial-dashboard')
  await navigate('/department/fa/profile','.department-profile-page')
  await navigate('/department/fa/change-password','.department-password-page')
  await navigate('/department/fa/districtWiseReport','.financial-page')
  assert.equal(await evaluate('document.querySelectorAll(".financial-page input.date").length'),2,'Both legacy date controls render')
  await click('#searchField2')
  await evaluate('Array.from(document.querySelectorAll(".financial-page button")).find(b=>b.textContent.includes("Search")).click()')
  await waitFor('!document.querySelector(".financial-report-table [role=status]")')
  assert(requests.some(r=>r.url.endsWith('/fetchDistrictWiseReportData') && r.body?.includes('searchField=2')),'Report date-selection filter reaches Financial API')
  await navigate('/department/fa/faDisbursementUnit_new','.financial-page')
  await viewport(390,844)
  await screenshot('calculator-mobile')
  await noOverflow('Financial calculator mobile')
  console.log(JSON.stringify({problems,errors},null,2))
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({problems,errors},null,2))
  assert.deepEqual(problems,[])
  assert.deepEqual(errors,[])
  console.log('PASS: Financial routes render using isolated API fixtures.')
} finally { socket?.close(); browser.kill() }
