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
const output = path.resolve('artifacts/industrial-unit')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/industrial-check-browser')
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
  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1200,deviceScaleFactor:1,mobile:false})

  const requests = []
  const dialogs = []
  events.set('Page.javascriptDialogOpening', async event => { dialogs.push(event.message); await cdp('Page.handleJavaScriptDialog',{accept:true}) })
  const profileData = {
    applicationId:'17', indOrgName:'Fixture Manufacturing Unit', firmCategory:'Micro', firmConstitution:'Proprietorship', firmSector:'1', statusOfPremises:'Owned', panNo:'ABCDE1234F', poaFirstName:'Test', poaLastName:'Applicant', poaFatherName:'Parent', poaGender:'1', poaCategory:'4',
    permanentAddress1:'Address', permanentStateId:'20', permanentDistrictId:'1', permanentTehsilId:'1', permanentBlockId:'1', permanentPinCode:'462001',
    udyamRegNo:'UDYAM-MP-01-1234567', udyamRegDate:'01/01/2025', udyamUploadId:1, gstUploadId:2, gstNo:'23ABCDE1234F1Z5',
    bankId:1, unitAddressId:'1', unitName:'Fixture Unit', address1:'Address', stateId:'20',districtId:'1',tehsilId:'1',blockId:'1',pinCode:'462001',plotNos:'P1',areaInSqm:'100',presentAddMobileNo:'9000000000',
    industrialPartnerslist:[], regNocList:[], schemeYear:'2025', statusId:1,
    faIndustrialUnitBean:{unitType:'New',unitStartDate:'01/03/2025',gstSellDocUploadId:10,unitProductDetailsBeans:[{productName:'Widgets',annualCapacity:20,unit:'Nos'}]},
    faRequiredAssistanceBean:{selectedOptions:{},caExpInvDetailsBean:[{}],pharmaExpInvDetailsBeans:[{}]},
  }
  let rejectProfile = true
  let role = 'ROLE_APPLICANT'
  let rejectInfrastructure = false
  const infrastructure = { id: 71, applicantName: 'Infrastructure Applicant', districtName: 'Bhopal', applicationFileDocId: 1, projectReportId: 2, ownershipDocId: 3, khasaraDocId: 4, electricalInstallationFileDocId: 5, approachRoadFileDocId: 6, approachRoadNocDocId: 7, waterEstimateDocId: 8, landMapDocId: 9, electricalInstallationMapDocId: 10 }
  events.set('Fetch.requestPaused', async event => {
    const url=new URL(event.request.url), endpoint=url.pathname.split('/').at(-1)
    requests.push({path:url.pathname,query:url.search,method:event.request.method,body:event.request.postData || ''})
    let data={},status=200
    if (url.pathname.endsWith('/api/session/current-user')) data={authenticated:true,username:'fixture-applicant',displayName:'Test Applicant',roles:[role]}
    else if (url.pathname.endsWith('/api/shell/menu')) data=[]
    else if (url.pathname.includes('fetchfaapplicants/Unit')) data={aaData:[{applicationId:'17',submittedOn:'07/10/2026',establishmentType:'Unit',unitOrInstName:'Fixture Manufacturing Unit',status:'Draft',currentStatusId:1}],iTotalDisplayRecords:1,iTotalRecords:1}
    else if (endpoint==='fetchUserIndustrialDetails' || endpoint==='fetchUserIndustrialDetailsByApplicationId') data=structuredClone(profileData)
    else if (endpoint==='fetchUnitAddressDetails') data={value:JSON.stringify([{unitAddressId:'1',unitName:'Fixture Unit',stateId:'20',districtId:'1',tehsilId:'1',blockId:'1'}])}
    else if (endpoint==='fetchBankDetails') data={value:JSON.stringify([{id:1,bankName:'Fixture Bank'}])}
    else if (endpoint==='fetchAllIndustryCategory') data={'1':'Manufacturing'}
    else if (/fetch(allstates|district.*|categoriesmap|BanksMap)/.test(endpoint)) data=[{key:'1',value:'Fixture Location'},{key:'20',value:'Madhya Pradesh'}]
    else if (endpoint==='fetchFinancialYear' || endpoint==='fetchFinancialYearNew') data=['2025-2026','2026-2027']
    else if (endpoint==='fetchAppliedAssistance') data={value:'[]'}
    else if (endpoint==='addFaIndustrialProfileDetails') data=rejectProfile ? {errorMessage:'Fixture rejected profile save'} : {id:'17',successMessage:'Saved'}
    else if (endpoint==='fetchfaapplicantdocumentslist' || endpoint==='fetchHistory' || endpoint==='fetchDisbursementsUpload') data=[]
    else if (endpoint==='fetchfaapplicantdetail') data=profileData
    else if (endpoint==='fetchfaschemesdetail') data={applicationId:'17',selectedOptions:{}}
    else if (endpoint==='fetchquerybydtic') data={comments:'Supply the missing certificate'}
    else if (endpoint==='saveInfrstructureDevelopment') data={id:71}
    else if (endpoint==='uploadInfrastructureDocument') data=rejectInfrastructure ? {errorMessage:'Upload rejected'} : {id:71}
    else if (endpoint==='fetchInfrastructureById') data=infrastructure
    else if (endpoint==='fetchInfrastructureList') data={aaData:[{...infrastructure,createdDate:'07/10/2026'}],iTotalDisplayRecords:26,iTotalRecords:26}
    else if (url.pathname.includes('/download')) { status=404 }
    try {await cdp('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:status,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify(data)).toString('base64')})} catch {}
  })
  await cdp('Fetch.enable',{patterns:[{urlPattern:'*/backend/*'},{urlPattern:'*/mpmsme/*'}]})
  const navigate=async route=>{await cdp('Page.navigate',{url:base+route});await waitFor('document.readyState === "complete" && !!document.querySelector(".industrial-unit-page, .infrastructure-page")')}
  const fill=async(selector,value)=>evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`)
  await navigate('/applicant/financial-assistance')
  await waitFor('document.body.textContent.includes("Fixture Manufacturing Unit")')
  assert.equal(await evaluate('document.querySelector("#dynamic-table tbody a").textContent'),'Retrieve Partially Saved Form')
  await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent==="Apply for Scheme").click()')
  await waitFor('!!document.querySelector("#investmentAmount")')
  await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent==="Continue").click()')
  assert.ok(dialogs.some(value=>value.includes('Please enter both')))
  await fill('#investmentAmount','100000')
  await fill('#turnoverAmount','100000')
  assert.ok((await evaluate('document.querySelector(".modal-body").textContent')).includes('One Lakh Rupees'))
  await evaluate('[...document.querySelectorAll("button")].find(el=>el.textContent==="Continue").click()')
  await waitFor('!!document.querySelector("#unitStartDate")')
  await new Promise(resolve=>setTimeout(resolve,300))
  await waitFor('!document.querySelector(".industrial-unit-page .alert-danger")')
  await fill('#unitStartDate','2025-03-02')
  try { await waitFor('document.body.textContent.includes("MP MSME Development Policy 2025 is applicable")') }
  catch (error) { console.log(await evaluate('JSON.stringify({text:document.querySelector(".industrial-unit-page").textContent, date:document.querySelector("#unitStartDate").value})')); console.log(errors); throw error }
  await evaluate('[...document.querySelectorAll("input[type=checkbox]")].find(el=>el.parentElement.textContent.includes("I accept the policy")).click()')
  await waitFor('!!document.querySelector("form[name=faIndustrialProfile]")')
  await waitFor('document.querySelector("#industryName").value === "Fixture Manufacturing Unit"')
  const newFormErrors=await evaluate('[...document.querySelectorAll(".industrial-unit-page .alert-danger")].map(el=>el.textContent)')
  assert.deepEqual(newFormErrors,[])
  await navigate('/applicant/financial-assistance/viewfaapplicantdetailunit/17')
  await waitFor('document.querySelector("#industryName")?.value === "Fixture Manufacturing Unit"')
  assert.ok(await evaluate('document.querySelectorAll(".industrial-unit-page input, .industrial-unit-page select, .industrial-unit-page textarea").length > 100'))
  // Exercise a rejected profile save without bypassing model or request handling.
  await evaluate(`(()=>{const form=document.querySelector('form[name=faIndustrialProfile]');for(const el of form.elements){el.required=false;el.removeAttribute('pattern')}form.requestSubmit();})()`)
  await waitFor('document.body.textContent.includes("Fixture rejected profile save")')
  assert.ok(await evaluate('document.querySelector("#step1").classList.contains("active")'))
  rejectProfile=false
  await evaluate("document.querySelector('form[name=faIndustrialProfile]').requestSubmit()")
  await waitFor('document.querySelector("#step2").classList.contains("active")')
  const capture=await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
  fs.writeFileSync(path.join(output,'industrial-unit-step2.png'),Buffer.from(capture.data,'base64'))
  await navigate('/applicant/financial-assistance/viewfaapplicantdetailunitnew/17')
  await waitFor('document.body.textContent.includes("Fixture Manufacturing Unit")')
  await navigate('/applicant/financial-assistance/viewfaapplicantHistory/17/Unit')
  await waitFor('document.body.textContent.includes("Financial Assistance")')
  await navigate('/applicant/financial-assistance/infrastructure')
  await waitFor('!!document.querySelector("#doc10")')
  assert.equal(await evaluate('document.querySelectorAll("input[type=file]").length'),10)
  const submitInfrastructure = () => evaluate('document.querySelector(".infrastructure-page form").requestSubmit()')
  const attach = (n, size=30) => evaluate(`(()=>{const el=document.querySelector('#doc${n}');const files=new DataTransfer();files.items.add(new File([new Uint8Array(${size})],'test.pdf',{type:'application/pdf'}));el.files=files.files;el.dispatchEvent(new Event('change',{bubbles:true}));})()`)
  for (const [n, message] of [[1,'Please upload Application Form!'],[2,'Please upload Project Report!'],[3,'Please upload Land owenership documents!'],[4,'Please upload Land use document(Copy of Khasara)!'],[9,'Please Map of Land']]) {
    await submitInfrastructure()
    await waitFor('!document.querySelector(".industrial-saving")')
    assert.equal(dialogs.at(-1),message)
    await attach(n)
  }
  await attach(10,5242881)
  await submitInfrastructure()
  assert.equal(dialogs.at(-1),'Map showing the distance from nearest power station document file size should not exceed 5 MB')
  for (const n of [5,6,7,8,10]) await attach(n)
  rejectInfrastructure=true
  await submitInfrastructure()
  await waitFor('document.body.textContent.includes("Upload rejected")')
  assert.equal(await evaluate('document.querySelector(".infrastructure-page button[type=submit]").disabled'),false)
  rejectInfrastructure=false
  await submitInfrastructure()
  await waitFor('document.querySelector(".infrastructure-page button[type=submit]").disabled && !document.querySelector(".industrial-saving")')
  assert.equal(dialogs.at(-1),'Your application number is 71')
  await evaluate('[...document.querySelectorAll(".infrastructure-page button")].find(el=>el.textContent==="Cancel").click()')
  assert.equal(await evaluate('[...document.querySelectorAll("input[type=file]")].every(el=>!el.files.length)'),true)
  assert.equal(await evaluate('document.querySelector(".infrastructure-page button[type=submit]").disabled'),true)
  fs.writeFileSync(path.join(output,'infrastructure-form.png'),Buffer.from((await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'))
  await navigate('/applicant/financial-assistance/add-unit')
  await waitFor('!!document.querySelector("form[name=faUnitAddressDetails]")')
  await navigate('/applicant/financial-assistance/queryReplyByApplicant/17/Unit')
  await waitFor('document.body.textContent.includes("Supply the missing certificate")')
  role='ROLE_FA'
  await navigate('/fa/home#/infradevelopmetList')
  await waitFor('document.body.textContent.includes("Infrastructure Applicant")')
  assert.ok(requests.some(r=>r.path==='/mpmsme/fa/fetchInfrastructureList'))
  await evaluate('[...document.querySelectorAll(".pagination button")].find(el=>el.textContent==="Next").click()')
  await waitFor('document.body.textContent.includes("Showing 11 to 20")')
  assert.ok(requests.some(r=>r.query.includes('iDisplayStart=10')))
  await fill('input[type=search]','Bhopal')
  await waitFor('document.body.textContent.includes("Showing 1 to 10")')
  assert.ok(requests.some(r=>r.query.includes('sSearch=Bhopal')))
  await click('#dynamic-table tbody a')
  await waitFor('!!document.querySelector("#ms") && document.body.textContent.includes("Infrastructure Applicant")')
  assert.equal(await evaluate('document.querySelectorAll("#ms a[href*=downloadInfrastructuredocument]").length'),10)
  assert.ok(await evaluate('[...document.querySelectorAll("#ms a")].every(a=>a.getAttribute("href").startsWith("/mpmsme/fa/downloadInfrastructuredocument/"))'))
  await evaluate('window.print=()=>{window.printCalled=true}')
  await click('img[title="Print Filled Form"]')
  assert.equal(await evaluate('window.printCalled'),true)
  fs.writeFileSync(path.join(output,'infrastructure-detail.png'),Buffer.from((await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:true})).data,'base64'))
  await evaluate('[...document.querySelectorAll(".infrastructure-page a")].find(el=>el.textContent==="Back").click()')
  await waitFor('!!document.querySelector("#dynamic-table")')
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(output,'browser-checks.json'),JSON.stringify({passed:true,mode:'Controlled fixtures; no live submissions',requests:requests.length,dialogs,errors},null,2))
  console.log('Industrial Unit browser checks passed.')
} finally {
  try { socket?.close() } catch {}
  browser.kill()
  await server.close()
}


