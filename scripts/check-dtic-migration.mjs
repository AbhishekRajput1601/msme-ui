import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'

// Uses an isolated headless browser profile; never touches a personal profile.
const browserPath = process.env.UI_CHECK_BROWSER || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const base = process.env.UI_CHECK_URL || 'http://127.0.0.1:5173'
const output = path.resolve('artifacts/dtic-migration/browser')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/dtic-migration-browser')
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
    console.log(errors); await screenshot('failure'); throw new Error(`Condition failed: ${expression}`)
  }
  const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
  const exists = selector => `!!document.querySelector(${JSON.stringify(selector)})`
  const errors = []
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.exception?.description || event.exceptionDetails.text))
  await cdp('Runtime.enable')
  await cdp('Page.enable')
  let role = 'ROLE_DTIC'
  const requests = []
  let accepted = false
  // Fixtures cover authenticated styling without sending credentials or writes.
  events.set('Fetch.requestPaused', async event => {
    const url = new URL(event.request.url)
    requests.push({path:url.pathname,search:url.search,method:event.request.method,body:event.request.postData})
    const unit = { applicationId:'APP-1',schemeYear:'2025',unitName:'Test unit',industrialPartnerslist:[],regNocList:[],faIndustrialUnitBean:{unitStartDate:'01/01/2026'},faRequiredAssistanceBean:{selectedOptions:{selectfa1:true,selectfa13:true}},selectfa1:true,eligibleAmountFA1:0,remarkFA13:'Comment only' }
    let data = {}
    let status = 200
    if (url.pathname.endsWith('/api/session/current-user')) data={authenticated:!!role,username:'review',roles:role?[role]:[],locale:'en_US'}
    else if (url.pathname.includes('fetchpendingapplicants/')) data={aaData:[{applicationId:'APP-1',applicationDate:'08/10/2026',unitOrInstName:'Test unit',currentStatusId:accepted?19:2,status:accepted?'Accepted':'Submitted'},{applicationId:'APP-2',applicationDate:'08/10/2026',unitOrInstName:'Second unit',currentStatusId:19,status:'Accepted'}],iTotalRecords:2,iTotalDisplayRecords:2}
    else if (url.pathname.endsWith('/eligibleCompleteIds')) data=['APP-1']
    else if (url.pathname.endsWith('/getPreviousApplicationData')) data=[{applicationId:'APP-1'}]
    else if (url.pathname.endsWith('/agendaRows')) data=[{applicationNo:'APP-1',unitName:'Test unit',totalEligibleAmount:0,assistanceList:[{assistanceType:'Food Processing',eligibleAmount:0,remark:'Recorded comment'}]}]
    else if (url.pathname.endsWith('/fetchUserIndustrialDetailsByApplicationId')) data=unit
    else if (url.pathname.includes('getMessage/')) data={value:'Confirm save?'}
    else if (url.pathname.endsWith('/fetchFAMSMEDetailUnitForSanction') || url.pathname.endsWith('/fetchMsmeDetailSelectionByApplicationId')) data={...unit,faMsmeDetailData:{}}
    else if (url.pathname.includes('fetchpendingapplicantsByIds')) data=[unit]
    else if (/fetchHistory|fetchDisbursementsUpload|getFaOtherDocuments|fetchfaapplicantdocumentslist|fetchCollectorAssistances|fetchEligibleAmounts/.test(url.pathname)) data=[]
    else if (url.pathname.endsWith('/fa/fetchfaapplicantdetail') || url.pathname.endsWith('/fa/fetchfaschemesdetail') || url.pathname.endsWith('/fa/fetchFASchemesSelection')) data=unit
    else if (/fetchDTICBudgetByFY|fetchDTICDemandByFY|fetchInspectionOffices|fetchInternalAuditListForDTIC|fetchExternalAuditListForDTIC|fetchFactualDetailListForDTIC|fetchProformaClauseListForDTIC/.test(url.pathname)) data={aaData:[],iTotalRecords:0,iTotalDisplayRecords:0}
    else if (/fetchDTICRoster/.test(url.pathname)) data={inspectionOfficeBean:{inspectionOfficeId:1},prevInspectionBeans:[],angSanctionedBeans:[],pensionCasesBeans:[],confidentialInfoBeans:[],computerHardwareBeans:[],schemeGoalsBeans:[],amountInfoBeans:[],msmeInfoBeans:[],campsInfoBeans:[]}
    else if (/fetchDTICHeads|fetchDTICDemand|fetchUsesSurrender|fetchBudgetDemand/.test(url.pathname)) data={planningSchemeAmountBeans:[],planningObjectAmountBeans:[]}
    else if (/fetchFinancialYear|fetchQuarter|fetchSchemeType|fetchSchemeBy|fetchObjectBy/.test(url.pathname)) data=[]
    else if (/fetchInternalAuditById/.test(url.pathname)) data={auditInternalBeanList:[]}
    else if (/fetchExternalAuditById/.test(url.pathname)) data={auditExternalBeanList:[]}
    else if (event.request.method==='POST') {data={successMessage:'Saved'};if(url.pathname.endsWith('/updateStatus'))accepted=true}
    const body=JSON.stringify(data)
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
  await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'window.confirm=()=>true;window.alert=()=>{}'})
  await viewport(1366)
  await navigate('/department/dtic/dticfapendingapplicantsunit','#dynamic-table tbody input')
  assert.equal(await evaluate('document.querySelectorAll("#dynamic-table th").length'),6)
  assert.equal(await evaluate('document.querySelectorAll("#dynamic-table tbody input:disabled").length'),2)
  await click('#dynamic-table .dtic-action-link')
  await waitFor('document.querySelectorAll("#dynamic-table tbody input:disabled").length === 1')
  await click('#dynamic-table tbody input:not(:disabled)')
  await waitFor(exists('#historyModal'))
  await click('#historyModal .dtic-amount button')
  assert.equal(await evaluate('document.querySelectorAll("[role=dialog]").length'),2)
  await evaluate('document.querySelector(".dtic-comment-modal button").click()')
  await evaluate('document.querySelector("#historyModal > .modal-footer button").click()')
  assert.match(await evaluate('document.querySelector("#historyModal [role=alert]").textContent'),/Remark is mandatory/)
  await screenshot('batch-agenda')
  await evaluate('document.querySelector("#historyModal > .modal-footer button:last-child").click()')
  await navigate('/department/dtic/querybydtic/APP-1/Unit','textarea[name=comments]')
  const before=requests.filter(r=>r.method==='POST').length
  await click('button[type=submit]')
  await new Promise(resolve=>setTimeout(resolve,300))
  assert.equal(requests.filter(r=>r.method==='POST').length,before)
  await evaluate(`(()=>{const el=document.querySelector('textarea');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,'Please supply the certificate.');el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))})()`)
  await click('button[type=submit]')
  await waitFor('location.pathname.endsWith("dticfapendingapplicantsunit")')
  assert(requests.some(r=>r.path.endsWith('/raiseQueryByDtic')&&r.body.includes('Please supply the certificate.')))
  await navigate('/department/dtic/fa/financialAssistanceTracking/APP-1','.fa-track')
  await waitFor('document.querySelector(".fa-track").textContent.includes("Selected")')
  await waitFor('document.querySelectorAll(".fa-track input[type=number]").length > 0')
  await screenshot('eligibility')
  await click('.fa-track .btn-success')
  await waitFor('!document.querySelector(".dtic-page > [role=status]")')
  await new Promise(resolve=>setTimeout(resolve,200))
  assert(requests.some(r=>r.path.endsWith('/fa/saveEligibleAmount')&&r.body.includes('"eligibleAmount":0')))
  
  const routes=JSON.parse(fs.readFileSync('src/modules/dtic/generated/routes.json','utf8'))
  for(const route of routes){
    const url='/department/dtic/'+route.path.replace(':applicationIds','APP-1').replace(':applicationId','APP-1').replace(':establishmentType','Unit').replace(/:[A-Za-z]+/g,'1')
    await navigate(url,'.dtic-page')
    await new Promise(resolve=>setTimeout(resolve,100))
    const problems=await evaluate('Array.from(document.querySelectorAll(".dtic-page > [role=alert]")).map(n=>n.textContent)')
    assert.deepEqual(problems,[],url)
  }
  await noOverflow('DTIC desktop')
  assert.deepEqual(errors,[])
  assert.equal(requests.some(r=>r.path.startsWith('/mpmsme/applicant/')),false)
  console.log('PASS: all 31 FA routes render; acceptance, eligibility gating, batch comments, query validation and submission use DTIC endpoints; no Angular runtime or legacy page navigation.')
} finally {socket?.close();browser.kill()}
