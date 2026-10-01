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
const profile = path.resolve('node_modules/.cache/land-check-browser')
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
  const draft = {
    vacantLandId: 42, statusId: 1, applicantFirstName: 'Test', applicantLastName: 'Applicant',
    constitution: 'Proprietorship', ventureType: 'New', categoryId: '4',
    waterReq:'1',presentConnectedLoad:'1',presentMaxDemand:'1',expConnectedLoad:'1',expMaxDemand:'1',
    isAlreadyLandAlloted: false, mobileNo: '9000000000',
    vacantLandBean: { vacantLandId:42, industrialAreaName:'Test Industrial Area', plotNumber:'P42', purposeId:'1', totalPlotArea:'100', totalAmount:1000 },
    idEmploymentBeans:[{empName:'Skilled Workers',empNumber:'1'},{empName:'Unskilled Workers',empNumber:'2'}],
    investmentBeans:[{empName:'Sheds and Building Development',empNumber:'100'},{empName:'Plant and machinery',empNumber:'200'}],
    financeBeans:[{empName:'Own Fund',empNumber:'300'}],
    itemsManufactured:[{itemName:'Test items',presentAnnualCapacity:'100',presentProposedYOI:'2027',subsequentAnnualCapacity:'200',subsequentProposedYOI:'2028'}],
    landDetails:[{phase:'Present/First Phase',type:'Covered',purpose:'Manufacturing',dimensionsL:'10',dimensionsW:'10',area:'100',cost:'10'}]
  }
  let rejectSave = true
  let rejectDocuments = true
  let eligibilityDenied = false
  let applicationExists = false
  let rejectQueryDocument = true
  let signingReady = false
  const formHtml = '<form name="selfEmploymentForm"><input id="vId" value="42"></form>'
  const docsHtml = '<form data-ng-submit="uploadIDDocuments()"><div><span>I declare that the information is correct.</span><span>I accept the applicable conditions.</span><input name="checkDeclaration"></div></form>'
  const paymentHtml = '<form action="/applicant/id/submitOnlinePayment"><div class="form-group"><label>Application</label><input name="applicantId" value="17" readonly></div><input type="hidden" name="vacantLandBean.vacantLandId" value="42"><input type="hidden" name="_csrf" value="fixture-token"><div class="form-group"><label>Total amount</label><input name="totalAmount" value="1000" readonly></div><textarea name="comments"></textarea></form>'
  events.set('Fetch.requestPaused', async event => {
    const url = new URL(event.request.url)
    requests.push({path:url.pathname,method:event.request.method,body:event.request.postData || ''})
    let status = 200, type = 'application/json', body = '{}'
    if (url.pathname.endsWith('/api/session/current-user')) body=JSON.stringify({authenticated:true,username:'fixture-applicant',displayName:'Test Applicant',roles:['ROLE_APPLICANT']})
    else if (url.pathname.endsWith('/api/shell/menu')) body='[]'
    else if (url.pathname.endsWith('/api/shell/permissions')) body='{"permissions":["ROLE_APPLICANT"]}'
    else if (url.pathname.includes('/viewApplyForLandForm/')) {type='text/html';body=eligibilityDenied?'<p class="alert">Plot reservation does not match your profile.</p>':formHtml}
    else if (url.pathname.includes('/viewESignApplicationDetail/')) {type='text/html';body='<div class="esignHtml"></div>'}
    else if (url.pathname.endsWith('/id/fetchIndustrialProfileDocumentsList')) body='[]'
    else if (url.pathname.endsWith('/eSignature')) body=JSON.stringify(signingReady?{successMessage:'Ready',aspUrl:'https://sign.example.test/start',eHastaksharHiddenInputTAG:'fixture-signing-request'}:{errorMessage:'Signing request rejected'})
    else if (url.pathname.includes('/id/fetchVacantLandDetail/')) body=JSON.stringify({...draft,applicantId:applicationExists?17:null})
    else if (url.pathname.includes('/id/getVacantLandDetail/')) body=JSON.stringify(draft.vacantLandBean)
    else if (url.pathname.endsWith('/fetchRatesByCollectorRateIdAndAreaLeaseRent')) body=JSON.stringify({premiumCharges:100,developmentCharges:100,maintenanceCharges:100,leaseRent:100,securityDeposit:100,advanceRent:100,totalAmount:600})
    else if (url.pathname.endsWith('/fetchUserIndustrialDetails1')) body='{"firmConstitution":"Proprietorship","indOrgName":"Test industry","firmCategory":"Micro"}'
    else if (url.pathname.endsWith('/addIdApplicantDetail') || url.pathname.endsWith('/updateIdApplicantDetail')) body=JSON.stringify(rejectSave?{errorMessage:'Server validation rejected this application'}:{id:'17',successMessage:'Draft saved'})
    else if (url.pathname.includes('/id/viewDocumentsUpload/')) {type='text/html';body=docsHtml}
    else if (url.pathname.includes('/fetchApplicationDetail/')) body=JSON.stringify({...draft,applicantId:17,applicationId:'TEST-17'})
    else if (url.pathname.endsWith('/id/fetchDocumentsList')) body='[]'
    else if (url.pathname.endsWith('/addIDApplicantDocuments')) body=JSON.stringify(rejectDocuments?{errorMessage:'Document rejected by server'}:{successMessage:'Documents saved',value:'opaque-token'})
    else if (url.pathname.includes('/id/onlinePayment/')) {type='text/html';body=paymentHtml}
    else if (url.pathname.endsWith('/id/fetchHistory')) body=JSON.stringify([{status:'Draft',assigner:'Applicant',assignee:'Applicant',comments:'Saved in test',createdDate:'30/09/2026'}])
    else if (url.pathname.includes('/id/queryReplyByApplicant/')) {type='text/html';body='<form data-ng-submit="submitQueryReply()"></form>'}
    else if (url.pathname.endsWith('/id/fetchquerybydtic')) body=JSON.stringify({id:9,comments:'Explain the construction layout'})
    else if (url.pathname.endsWith('/id/submitQueryReply')) body=JSON.stringify({successMessage:'Reply saved'})
    else if (url.pathname.endsWith('/uploadQueryDoc')) body=JSON.stringify(rejectQueryDocument?{errorMessage:'Query document rejected'}:{successMessage:'Document saved'})
    else if (url.pathname.includes('/id/applicantAnnualPayment/')) {type='text/html';body='<form data-ng-submit="applicantAnnualPayment()"></form>'}
    else if (url.pathname.endsWith('/applicantAnnualPayment')) body='81'
    else if (url.pathname.includes('/id/reviewAnnualPayment/')) {type='text/html';body='<form action="/applicant/id/submitAnnualPayment"><table><tbody><tr><td>Financial years</td><td>2026–2028</td></tr></tbody></table><input type="hidden" name="paymentId" value="81"><input type="hidden" name="totalCharges" value="600"><input type="hidden" name="_csrf" value="annual-token"></form>'}
    else if (url.pathname.includes('/id/onlinePaymentResponse_csfms/')) {type='text/html';body='<div class="panel-body"><form action="/applicant/id/checkOnlinePaymentStatus"><table><tbody><tr><td>Payment status</td><td>Pending</td></tr></tbody></table><input type="hidden" name="urn" value="TEST-URN"><input type="hidden" name="_csrf" value="receipt-token"><a href="#id/retryOnlinePayment/17/opaque-token">Retry payment</a><script>window.receiptInjected=true</script></form></div>'}
    else if (url.pathname.includes('/id/enterCompliance/')) {type='text/html';body='<form data-ng-submit="enterCompliance(noticeForm.$valid)"></form>'}
    else if (url.pathname.includes('/id/newAppealForIC/')) {type='text/html';body='<form data-ng-submit="addAppealForIC(appealForm.$valid)"></form>'}
    else if (url.pathname.includes('/id/loadNoticeDetails/')) body=JSON.stringify({noticeId:4,noticeDate:'01/10/2026',reason:'Provide compliance evidence',appealFees:1000})
    else if (url.pathname.endsWith('/enterCompliance')) body=JSON.stringify({successMessage:'Compliance saved'})
    else if (url.pathname.endsWith('/addAppeal')) body='93'
    else if (url.pathname.includes('/id/viewAppealForIC/')) {type='text/html';body='<div class="panel-body"></div>'}
    else if (url.pathname.includes('/id/loadAppealDetails/')) body=JSON.stringify({appealId:93,appealGround:'Review requested',appealDate:'01/10/2026'})
    else if (url.pathname.includes('/id/loadAppealHearings/')) body='[]'
    else if (url.pathname.includes('/idInstruction/')) {type='text/html';body='<div class="panel-body"><p>Test instruction content</p><script>window.injected=true</script></div>'}
    else if (url.pathname.endsWith('/fetchApplicationList')) body=JSON.stringify({aaData:[{...draft,applicantId:17,applicationId:'TEST-17',vacantLandIDEncrypt:'opaque-token'}],iTotalRecords:1,iTotalDisplayRecords:1})
    else if (url.pathname.endsWith('/fetchAllLandAllotmentList')) body=JSON.stringify({aaData:[{...draft.vacantLandBean,vcId:'opaque-token',active:true}],iTotalRecords:1,iTotalDisplayRecords:1})
    else { status=404; body='{}' }
    try {await cdp('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:status,responseHeaders:[{name:'Content-Type',value:type}],body:Buffer.from(body).toString('base64')})}
    catch(error){if(!/Invalid InterceptionId|closed|session/i.test(error.message))errors.push(error.message)}
  })
  await cdp('Fetch.enable',{patterns:[{urlPattern:'*/backend/*'},{urlPattern:'*/mpmsme/*'}]})
  const navigate = async route => {
    await cdp('Page.navigate',{url:base+route})
    await waitFor('document.readyState === "complete" && !!document.querySelector(".legacy-portal")')
  }
  const fill = async (name,value) => evaluate(`(() => {const el=document.getElementsByName(${JSON.stringify(name)})[0];Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));})()`)
  const saveCount = () => requests.filter(r=>r.path.endsWith('IdApplicantDetail') && r.method==='POST').length
  await navigate('/applicant/land-allotment/explore')
  await waitFor('document.body.textContent.includes("P42")')
  await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent.includes("View Details")).click()')
  await waitFor('!!document.querySelector("a[href*=instructions]")')
  await click('a[href*=instructions]')
  await waitFor('document.body.textContent.includes("Test instruction content")')
  assert.equal(await evaluate('window.injected'),undefined)
  await click('input[type=checkbox]')
  await click('a[href*=apply]')
  await waitFor('!!document.querySelector(".land-application-form")')
  assert.equal(await evaluate('document.querySelector("[name=applicantFirstName]").disabled'),true)
  await fill('captchaText','TEST')
  assert.deepEqual(await evaluate('[...document.querySelectorAll(".land-application-form :invalid")].filter(el=>el.name).map(el=>({name:el.name,message:el.validationMessage}))'),[])
  await evaluate('document.querySelector(".land-application-form").requestSubmit()')
  await waitFor('document.body.textContent.includes("Server validation rejected")')
  assert.equal(saveCount(),1)
  assert.equal(await evaluate('location.pathname'),'/applicant/land-allotment/apply/opaque-token')
  await fill('financeBeans.0.empNumber','301')
  await fill('captchaText','TEST')
  await evaluate('document.querySelector(".land-application-form").requestSubmit()')
  await waitFor('document.body.textContent.includes("totals must be equal")')
  assert.equal(saveCount(),1)
  await fill('financeBeans.0.empNumber','300')
  await fill('captchaText','TEST')
  rejectSave=false
  await evaluate('document.querySelector(".land-application-form").requestSubmit()')
  await waitFor('!!document.querySelector("input[name=doc2]")')
  const created=JSON.parse(requests.findLast(r=>r.path.endsWith('/addIdApplicantDetail')).body)
  assert.equal(created.vacantLandId,42)
  assert.equal(created.vacantLandIDEncrypt,'opaque-token')
  assert.equal(created.constitution,'Proprietorship')
  assert.equal(created.totalPresentAndSubsequentArea,100)
  assert.equal(created.captchaText,'TEST')
  await evaluate(`['doc2','doc3','doc9','profileImage'].forEach(name=>{
    const transfer=new DataTransfer();transfer.items.add(new File(['test'],name==='profileImage'?'photo.jpg':'test.pdf',{type:name==='profileImage'?'image/jpeg':'application/pdf'}));
    const input=document.getElementsByName(name)[0];input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));
  })`)
  await click('input[name=checkDeclaration]')
  await evaluate('document.querySelector("main form").requestSubmit()')
  await waitFor('document.body.textContent.includes("Document rejected by server")')
  assert.equal(await evaluate('document.querySelectorAll("a[href*=payment]").length'),0)
  rejectDocuments=false
  await evaluate('document.querySelector("main form").requestSubmit()')
  await waitFor('!!document.querySelector("a[href*=payment]")')
  assert.equal(requests.filter(r=>r.path.endsWith('/addIDApplicantDocuments')).length,2)
  await click('a[href*=payment]')
  await waitFor('!!document.querySelector("input[name=totalAmount]")')
  assert.equal(await evaluate('document.querySelector("input[name=totalAmount]").readOnly'),true)
  assert.equal(await evaluate('document.querySelector("input[name=_csrf]").value'),'fixture-token')
  assert.equal(await evaluate('document.querySelector("main button[type=submit]").disabled'),true)
  assert.equal(requests.filter(r=>r.path.endsWith('/submitOnlinePayment')).length,0)
  applicationExists=true
  await navigate('/applicant/land-allotment/edit/17/opaque-token')
  await waitFor('!!document.querySelector(".land-application-form")')
  await evaluate('document.querySelector(".land-application-form").requestSubmit()')
  await waitFor('!!document.querySelector("input[name=doc2]")')
  const updated=JSON.parse(requests.findLast(r=>r.path.endsWith('/updateIdApplicantDetail')).body)
  assert.equal(updated.applicantId,17)
  assert.equal(updated.vacantLandIDEncrypt,'opaque-token')
  await navigate('/applicant/home#/id/viewIdHistory/17')
  await waitFor('document.body.textContent.includes("Saved in test")')
  assert.equal(await evaluate('location.pathname'),'/applicant/land-allotment/history/17')
  await navigate('/applicant/home#/id/queryReplyByApplicant/17/opaque-token')
  await waitFor('!!document.querySelector("#query-reply")')
  await evaluate(`(() => {const el=document.querySelector('#query-reply');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,'Here is the updated layout');el.dispatchEvent(new Event('input',{bubbles:true}));const transfer=new DataTransfer();transfer.items.add(new File(['test'],'layout.pdf',{type:'application/pdf'}));const input=document.querySelector('#query-document');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));})()`)
  await click('main input[type=checkbox]')
  await evaluate('document.querySelector("main form").requestSubmit()')
  await waitFor('document.body.textContent.includes("Query document rejected")')
  assert.equal(await evaluate('document.querySelector("#query-reply").disabled'),true)
  rejectQueryDocument=false
  await evaluate('document.querySelector("main form").requestSubmit()')
  await waitFor('document.body.textContent.includes("Your reply and document have been saved")')
  assert.equal(requests.filter(r=>r.path.endsWith('/id/submitQueryReply')).length,1)
  assert.equal(requests.filter(r=>r.path.endsWith('/uploadQueryDoc')).length,2)
  await navigate('/applicant/home#/id/applicantAnnualPayment/17/42')
  await waitFor('!!document.querySelector("#annual-fyFrom")')
  for (const [name,value] of Object.entries({fyFrom:'2026',fyTo:'2028',leaseRent:'100',maintenanceFee:'200',shedRent:'0',transferCharge:'0'})) await fill(name,value)
  await waitFor('document.body.textContent.includes("600.00 rupees")')
  await evaluate('document.querySelector("main form").requestSubmit()')
  await waitFor('!!document.querySelector("input[name=paymentId]")')
  assert.equal(await evaluate('location.pathname'),'/applicant/land-allotment/annual-review/81')
  assert.equal(await evaluate('document.querySelector("input[name=_csrf]").value'),'annual-token')
  assert.equal(await evaluate('document.querySelector("main form button").disabled'),true)
  assert.equal(requests.filter(r=>r.path.endsWith('/submitAnnualPayment')).length,0)
  await navigate('/applicant/home#/id/paymentReceipt/TEST-CRN')
  await waitFor('!!document.querySelector("input[name=urn]")')
  assert.equal(await evaluate('document.querySelector("input[name=urn]").value'),'TEST-URN')
  assert.equal(await evaluate('document.querySelector("input[name=_csrf]").value'),'receipt-token')
  assert.equal(await evaluate('window.receiptInjected'),undefined)
  assert.equal(await evaluate('document.querySelector("a[href*=payment-retry]").getAttribute("href")'),'/applicant/land-allotment/payment-retry/17/opaque-token')
  assert.equal(requests.filter(r=>r.path.endsWith('/id/checkOnlinePaymentStatus')).length,0)
  applicationExists=false
  draft.vacantLandBean={...draft.vacantLandBean,industrialAreaName:'Undeveloped Land',totalPlotAreaun:30000,collectorRateId:7,districtId:2,plotShed:'Plot',newArea:'Old'}
  draft.investmentBeans[1].empNumber='250000000'
  draft.financeBeans[0].empNumber='250000100'
  await navigate('/applicant/land-allotment/apply/opaque-token')
  await waitFor('!!document.querySelector("#requested-area")')
  await evaluate(`(() => {const el=document.querySelector('#requested-area');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'20001');el.dispatchEvent(new Event('input',{bubbles:true}));})()`)
  await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent==="Calculate charges").click()')
  await waitFor('document.body.textContent.includes("50000")')
  await fill('captchaText','TEST')
  await evaluate('document.querySelector(".land-application-form").requestSubmit()')
  await waitFor('!!document.querySelector("input[name=doc1]")')
  assert.equal(await evaluate('document.querySelector("input[name=doc10]").required'),true)
  assert.equal(await evaluate('document.querySelector("input[name=doc11]").required'),true)
  assert.equal(await evaluate('document.querySelector("input[name=doc12]").required'),false)
  const undevelopedSave=JSON.parse(requests.findLast(r=>r.path.endsWith('/addIdApplicantDetail')).body)
  assert.equal(undevelopedSave.applicationFee,50000)
  assert.equal(undevelopedSave.totalPlotArea,'20001.00')
  assert.equal(undevelopedSave.quotedArea,undefined)
  await navigate('/applicant/home#/id/enterCompliance/4')
  await waitFor('!!document.querySelector("#notice-response")')
  await evaluate(`(() => {const el=document.querySelector('#notice-response');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,'The conditions have been met');el.dispatchEvent(new Event('input',{bubbles:true}));})()`)
  await click('main input[type=checkbox]')
  await evaluate('document.querySelector("main form").requestSubmit()')
  await waitFor('document.body.textContent.includes("Your compliance details have been saved")')
  assert.equal(requests.filter(r=>r.path.endsWith('/enterCompliance')).length,1)
  await navigate('/applicant/home#/id/newAppealForIC/4')
  await waitFor('!!document.querySelector("#appeal-date")')
  await evaluate(`(() => {const date=document.querySelector('#appeal-date');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(date,'2026-10-01');date.dispatchEvent(new Event('input',{bubbles:true}));const el=document.querySelector('#notice-response');Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set.call(el,'Review requested');el.dispatchEvent(new Event('input',{bubbles:true}));})()`)
  await click('main input[type=checkbox]')
  await evaluate('document.querySelector("main form").requestSubmit()')
  await waitFor('document.body.textContent.includes("No hearings scheduled")')
  assert.equal(await evaluate('location.pathname'),'/applicant/land-allotment/notices/view-ic/93')
  draft.statusId=2
  draft.ctPaymentBean={status:'Success',amount:'600',crn:'TEST-CRN'}
  await navigate('/applicant/home#/id/viewESignApplicationDetail/17/opaque-token')
  await waitFor('!!document.querySelector("#sign-aadhaar")')
  assert.equal(await evaluate('document.querySelector(".esignHtml").textContent.includes("TEST-17")'),true)
  assert.equal(await evaluate('document.querySelector(".esignHtml").textContent.includes("{{")'),false)
  assert.equal(await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent==="Sign with Aadhaar").disabled'),true)
  await click('main input[type=checkbox]')
  await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent==="Sign with Aadhaar").click()')
  await waitFor('document.body.textContent.includes("last four Aadhaar digits.")')
  assert.equal(requests.filter(r=>r.path.endsWith('/eSignature')).length,0)
  await fill('aadhaarLast4Digits','1234')
  await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent==="Sign with Aadhaar").click()')
  await waitFor('document.body.textContent.includes("Signing request rejected")')
  signingReady=true
  await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent==="Sign with Aadhaar").click()')
  await waitFor(`!!document.querySelector('form[action="https://sign.example.test/start"]')`)
  const signRequest=JSON.parse(requests.findLast(r=>r.path.endsWith('/eSignature')).body)
  assert.equal(signRequest.type,'APPLICATIONFORM')
  assert.ok(signRequest.unsignedBase64.includes('TEST-17'))
  assert.equal(await evaluate('location.pathname'),'/applicant/land-allotment/sign/17/opaque-token')
  eligibilityDenied=true
  await navigate('/applicant/land-allotment/apply/opaque-token')
  await waitFor('document.body.textContent.includes("Plot reservation does not match")')
  assert.equal(await evaluate('document.querySelectorAll(".land-application-form").length'),0)
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify({passed:true,mode:'Controlled browser fixtures; no live writes or payments',checks:['plot selection and instructions','backend eligibility rejection','readonly profile fields','rejected saves stay on form','investment totals block POST','create payload and document route','failed upload cannot proceed','document save and payment review','payment amount and hidden token preservation','draft update endpoint','legacy history bookmark','query reply partial upload failure and retry without duplicate reply'],runtimeErrors:errors},null,2))
  console.log('Land allotment browser checks passed.')
} finally {
  try { socket?.close() } catch {}
  browser.kill()
  await server.close()
}
