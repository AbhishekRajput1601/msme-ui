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
const profile = path.resolve('node_modules/.cache/land-reference-check-browser')
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


  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false})
  const requests=[],dialogs=[]
  let rejectSave=true
  events.set('Page.javascriptDialogOpening',async event=>{dialogs.push(event.message);await cdp('Page.handleJavaScriptDialog',{accept:true})})
  const plot={vacantLandId:42,vcId:'opaque-token',districtName:'Bhopal',tehsilName:'Huzur',industrialAreaName:'Fixture Industrial Area',location:'Test location',plotNumber:'P42',purposeName:'Manufacturing',totalPlotArea:1000,premiumCharges:100,developmentCharges:10,maintenanceCharges:20,leaseRent:30,securityDeposit:40,advanceRent:5,otherRentCharges:7,totalAmount:212,category:'UR',newArea:'New',industrialCategoryName:'General',totalApplicationReceived:0,bookingStartDate:'01/10/2026',bookingEndDate:'30/10/2026',active:true,mapName:'map.pdf',industrialAreaMap:'area.pdf',locationId:8,mapFileName:'plot.kml',googleMap:'https://maps.example.test/plot'}
  const application={applicantId:17,applicationId:'APP-17',fullName:'Fixture Applicant',vacantLandId:42,vacantLandBean:plot,submittedOn:'01/10/2026',statusId:1,status:'Draft',idNoticeBean:{noticeId:4,statusId:16,noticeDaysLeft:8}}
  const notice={noticeId:4,noticeDate:'01/10/2026',reason:'Construction pending',remark:'Fixture remark',documentDesc:'Notice document',documentId:8,proposedVenture:'Micro'}
  const payment={paymentId:81,fyFrom:'2026',fyTo:'2028',leaseRent:100,maintenanceFee:100,shedRent:100,transferCharge:0,otherCharges:0,totalCharges:600,paymentRemarks:'Fixture annual payment',vacantLandBean:plot,idApplicantBean:application,ctPaymentBean:{status:'Success',crn:'CRN81',cin:'CIN81',amount:600,transactionDateTime:'08/10/2026'}}
  const hearing={appealHearingId:6,hearingDate:'08/10/2026',hearingStatus:'Completed',caseDecision:'Conditional',timeframeDate:'30/10/2026',documentId:9,appealConditionalDecisionZOBean:{decisionId:7,userCompliance:'Complied',userComplianceDocumentId:10},appealConditionalDecisionICBean:{decisionId:7,userCompliance:'Complied',userComplianceDocumentId:10}}
  events.set('Fetch.requestPaused',async event=>{
    const url=new URL(event.request.url),endpoint=url.pathname.split('/').at(-1)
    requests.push({path:url.pathname,query:url.search,body:event.request.postData || '',method:event.request.method})
    let data={},type='application/json'
    if(url.pathname.endsWith('/api/session/current-user'))data={authenticated:true,username:'fixture',displayName:'Fixture Applicant',roles:['ROLE_APPLICANT']}
    else if(endpoint==='menu')data=[]
    else if(endpoint==='fetchAllLandAllotmentList')data={aaData:[plot,{...plot,vacantLandId:43,alreadyApplied:true},{...plot,vacantLandId:44,hoStatus:'Hold'},{...plot,vacantLandId:45,bookingClosed:true},{...plot,vacantLandId:46,commingSoon:true}],iTotalRecords:26,iTotalDisplayRecords:26}
    else if(['fetchApplicationList','fetchApplicationPaymentList','fetchApplicationNoticeList'].includes(endpoint))data={aaData:[application],iTotalRecords:26,iTotalDisplayRecords:26}
    else if(url.pathname.includes('/getMessage/'))data={value:'Are you sure to submit the form?'}
    else if(url.pathname.includes('/fetchApplicationDetail/'))data=application
    else if(url.pathname.includes('/id/applicantAnnualPayment/')){type='text/html';data='<form data-ng-submit="applicantAnnualPayment()"></form>'}
    else if(endpoint==='applicantAnnualPayment')data=rejectSave?{errorMessage:'Fixture save rejected'}:81
    else if(url.pathname.includes('/id/reviewAnnualPayment/')){type='text/html';data='<form action="/applicant/id/submitAnnualPayment"><table><tbody><tr><td>Review annual payment</td></tr></tbody></table><input type="hidden" name="paymentId" value="81"><input type="hidden" name="totalCharges" value="600"><input type="hidden" name="_csrf" value="fixture-token"></form>'}
    else if(url.pathname.includes('/id/viewAnnualPaymentHistory/')){type='text/html';data='<div class="panel-body"></div>'}
    else if(url.pathname.includes('/id/fetchAnnualPaymentHistory/'))data=[payment]
    else if(url.pathname.includes('/viewAnnualPaymentDetails/')){type='text/html';data='<div class="panel-body"></div>'}
    else if(url.pathname.includes('/fetchAnnualPaymentDetails/'))data=payment
    else if(url.pathname.includes('/id/loadNoticeDetails/'))data=notice
    else if(url.pathname.includes('/id/loadAppealDetails/'))data={appealId:5,appealDate:'01/10/2026',appealGround:'Fixture grounds',documentId:8,noticeBean:notice}
    else if(url.pathname.includes('/id/loadAppealHearings/'))data=[hearing]
    else if(url.pathname.includes('/id/fetchHearingDetails/') || url.pathname.includes('/loadAppealHearingDetails/'))data=hearing
    else if(url.pathname.includes('/id/enterCompliance/')){type='text/html';data='<form data-ng-submit="enterCompliance()"></form>'}
    else if(url.pathname.includes('/id/newAppealForIC/')){type='text/html';data='<form data-ng-submit="addAppealForIC()"></form>'}
    else if(url.pathname.includes('/id/newAppeal/')){type='text/html';data='<form data-ng-submit="addAppeal()"></form>'}
    else if(url.pathname.includes('/id/viewEnterConditionalCompliance')){type='text/html';data=`<form data-ng-submit="enterConditionalCompliance${url.pathname.includes('ZO')?'ZO':'IC'}()"></form>`}
    else if(url.pathname.includes('/id/onlinePayment/')){type='text/html';data='<div class="panel"><form method="post" action="/applicant/id/submitOnlinePayment"><input type="hidden" name="applicantId" value="17"><input readonly name="totalAmount" value="100"><textarea name="comments" id="comments"></textarea><small id="commentsError" style="display:none">Please enter Remarks.</small><div id="captcha-container"></div><input id="captcha-input"><button type="button" onclick="validateCaptcha()">Verify</button><button type="button" onclick="displayCaptcha()">Refresh</button><p id="result"></p><button disabled type="submit" id="submitButton">Submit</button></form></div>'}
    else if(url.pathname.includes('/id/view') || url.pathname.includes('/viewConditionalDecision')){type='text/html';data='<div class="panel-body"></div>'}
    else if(endpoint==='enterCompliance' || endpoint.startsWith('enterConditionalCompliance'))data={successMessage:'Saved'}
    else if(endpoint==='addAppeal')data=93
    else if(url.pathname.includes('/generateLOCLetter1/'))data={...application,industrialProfileBean:{indOrgName:'Fixture industry'}}
    else if(endpoint==='eSignature' || endpoint==='eSignApplicantDetailFormPossession')data={successMessage:'Ready',aspUrl:'https://sign.example.test/start',eHastaksharHiddenInputTAG:'fixture-signing-request'}
    try { await cdp('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:type}],body:Buffer.from(type==='text/html'?data:JSON.stringify(data)).toString('base64')}) } catch (error) { if (!/Invalid InterceptionId/.test(error.message)) throw error }
  })
  await cdp('Fetch.enable',{patterns:[{urlPattern:'*/backend/*'},{urlPattern:'*/mpmsme/*'}]})
  const navigate=async route=>{await cdp('Page.navigate',{url:base+route});await waitFor('document.readyState==="complete" && !!document.querySelector("main")')}
  const fill=async(selector,value)=>evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()`)
  for(const [route,name,count] of [['new','vacantLandList',23],['explore','vacantLandListUN',18],['','applicationList',10],['annual','annualPayments',9],['notices','noticeAppealList',8]]) {
    await navigate('/applicant/land-allotment/'+route)
    await waitFor('!!document.querySelector("#dynamic-table tbody tr a")')
    assert.equal(await evaluate('document.querySelectorAll("#dynamic-table thead th").length'),count)
    assert.equal(await evaluate('document.querySelector(".land-reference-page").dataset.view'),name)
    if(route==='new' || route==='explore') {
      const request=requests.findLast(r=>r.path.endsWith('fetchAllLandAllotmentList'))
      assert.equal(new URLSearchParams(request.query).get('industrialArea'),route==='new'?'Industrial Area':'Undeveloped Land')
      const apply=await evaluate('[...document.querySelectorAll("#dynamic-table a")].find(a=>a.textContent==="Apply").getAttribute("href")')
      assert.equal(apply,'/applicant/land-allotment/'+(route==='new'?'instructions':'instructions-undeveloped')+'/opaque-token')
      assert.ok(await evaluate('document.querySelector("#dynamic-table").textContent.includes("Already Applied")'))
      assert.ok(await evaluate('document.querySelector("#dynamic-table").textContent.includes("WITHELD")'))
    }
    await evaluate('[...document.querySelectorAll(".pagination button")].find(b=>b.textContent==="Next").click()')
    await waitFor('document.querySelector(".land-table-controls").parentElement.textContent.includes("Showing 11 to")')
    assert.ok(requests.some(r=>r.query.includes('iDisplayStart=10')))
    fs.writeFileSync(path.join(output,name+'.png'),Buffer.from((await cdp('Page.captureScreenshot',{format:'png'})).data,'base64'))
  }
  await navigate('/applicant/home#id/landAllotment')
  await waitFor('document.querySelector(".land-reference-page")?.dataset.view === "vacantLandList"')
  await navigate('/applicant/home#/id/landAllotmentUN')
  await waitFor('document.querySelector(".land-reference-page")?.dataset.view === "vacantLandListUN"')
  await navigate('/applicant/land-allotment/annual/17/42')
  await waitFor('document.querySelector("input[name=district]")?.value === "Bhopal"')
  for(const [key,value] of Object.entries({fyFrom:'2026',fyTo:'2028',leaseRent:'100',maintenanceFee:'100',shedRent:'100',transferCharge:'0',otherCharges:'0'})) await fill(`input[name=${key}]`,value)
  await evaluate('document.querySelector("form[name=applicantForm]").requestSubmit()')
  await waitFor('document.body.textContent.includes("Fixture save rejected")')
  rejectSave=false
  await evaluate('document.querySelector("form[name=applicantForm]").requestSubmit()')
  await waitFor('location.pathname.endsWith("annual-review/81")')
  await waitFor('!!document.querySelector("input[name=_csrf]")')
  assert.equal(await evaluate('document.querySelector("input[name=_csrf]").value'),'fixture-token')
  assert.equal(JSON.parse(requests.findLast(r=>r.path.endsWith('/applicantAnnualPayment')).body).totalCharges,'600.00')
  for(const route of ['annual-history/17','annual-detail/81']) {
    await navigate('/applicant/land-allotment/'+route)
    await waitFor('document.body.textContent.includes("Fixture annual payment")')
  }
  await navigate('/applicant/land-allotment/notices/compliance/4')
  await waitFor('document.querySelector("textarea[name=reason]")?.value === "Construction pending"')
  await fill('textarea[name=userCompliance]','The conditions have been met')
  await evaluate('document.querySelector("form[name=noticeForm]").requestSubmit()')
  await waitFor('location.pathname.endsWith("/notices")')
  assert.equal(requests.filter(r=>r.path.endsWith('/enterCompliance')).length,1)
  for(const mode of ['appeal-zo','appeal-ic','notice','view-zo','view-ic','hearing','conditional-zo','conditional-ic','decision-zo','decision-ic']) {
    await navigate('/applicant/land-allotment/notices/'+mode+'/6'+(mode.startsWith('decision-')?'/7':''))
    await waitFor('!!document.querySelector(".land-reference-page .panel-body") && !document.querySelector(".land-reference-page [role=status]")')
    assert.equal(await evaluate('document.querySelectorAll(".land-reference-page [role=alert]").length'),0)
    if(mode==='appeal-zo') assert.equal(await evaluate('document.querySelector("input[name=appealFees]").value'),'2000.00')
  }
  for(const route of ['uploadLOC/17','id/updatePossessionLetter/17/opaque-token']) {
    await navigate('/applicant/land-allotment/reference/'+route)
    await waitFor('document.querySelector(".esignHtml")?.textContent.includes("APP-17")')
    await click('input[type=radio][value=eSign]')
    await fill('#aadhaarLast4Digits','1234')
    await evaluate('document.querySelector("#aadhaarLast4Digits").form.requestSubmit()')
    await waitFor('[...document.forms].some(form=>form.action==="https://sign.example.test/start")')
  }
  for(const route of ['instructions','instructions-undeveloped']) {
    await navigate('/applicant/land-allotment/'+route+'/opaque-token')
    await waitFor('!!document.querySelector(".land-reference-page input[type=checkbox]")')
    assert.equal(await evaluate('document.querySelector(".land-reference-page a.btn-success").getAttribute("aria-disabled")'),'true')
    await click('.land-reference-page input[type=checkbox]')
    assert.notEqual(await evaluate('document.querySelector(".land-reference-page a.btn-success").getAttribute("aria-disabled")'),'true')
    assert.ok(await evaluate('document.querySelector(".land-reference-page a.btn-success").getAttribute("href").endsWith("/apply/opaque-token")'))
  }
  await navigate('/applicant/land-allotment/payment/17/opaque-token')
  await waitFor('!!document.querySelector("#captcha-input")')
  assert.equal(await evaluate('document.querySelector("#submitButton").disabled'),true)
  await fill('#captcha-input','incorrect')
  await evaluate('[...document.querySelectorAll(".land-reference-page button")].find(b=>b.textContent==="Verify").click()')
  assert.equal(await evaluate('document.querySelector("#submitButton").disabled'),true)
  await fill('#captcha-input',await evaluate('document.querySelector("#captcha-container").textContent'))
  await evaluate('[...document.querySelectorAll(".land-reference-page button")].find(b=>b.textContent==="Verify").click()')
  assert.equal(await evaluate('document.querySelector("#submitButton").disabled'),false)
  await click('#submitButton')
  assert.equal(await evaluate('getComputedStyle(document.querySelector("#commentsError")).display'),'block')
  await evaluate('[...document.querySelectorAll(".land-reference-page button")].find(b=>b.textContent==="Refresh").click()')
  assert.equal(await evaluate('document.querySelector("#submitButton").disabled'),true)
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(output,'reference-browser-checks.json'),JSON.stringify({passed:true,mode:'Controlled fixtures; no live submissions or payments',requests:requests.length,dialogs,runtimeErrors:errors},null,2))
  console.log('All five infrastructure sections and linked annual, notice and signing screens passed.')
} finally {
  try { socket?.close() } catch {}
  browser.kill()
  await server.close()
}
