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
const output = path.resolve('artifacts/applicant-services')
fs.mkdirSync(output, { recursive: true })
const profile = path.resolve('node_modules/.cache/applicant-services-browser')
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
  events.set('Runtime.exceptionThrown', event => errors.push(event.exceptionDetails.exception?.description || event.exceptionDetails.text))
  await cdp('Runtime.enable')
  await cdp('Page.enable')
  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1200,deviceScaleFactor:1,mobile:false})

  const requests=[],dialogs=[]
  events.set('Page.javascriptDialogOpening',async event => { dialogs.push(event.message); await cdp('Page.handleJavaScriptDialog',{accept:true}) })
  const award={id:7,financialYearId:1,financialYearString:'2025-2026',awardDescription:'Manufacturing Award'}
  const application={id:17,awardId:7,unitName:'Fixture Unit',bookingEndDate:'31/12/2026',anyQualityCertificate:true,anySpecialProgram:false,anyStateOfTheArt:true,areStartupCategory:false,isUnitInvolvedCsr:false,authPersonName:'Applicant',anyOtherInfoList:[{anyOtherInfoDesc:'First'},{anyOtherInfoDesc:'Second'}],infoTaxRepaymentList:[],fixedAssetsList:[{details:'Land',amount:100}],employmentList:[{details:'Permanent employees - Female',amount:2}]}
  let rejectBank=false,rejectDocs=false,emptyBanks=false
  events.set('Fetch.requestPaused',async event => {
    const url=new URL(event.request.url), endpoint=url.pathname.split('/').at(-1)
    requests.push({path:url.pathname,query:url.search,method:event.request.method,body:event.request.postData || ''})
    let data={}
    if (url.pathname.endsWith('/api/session/current-user')) data={authenticated:true,username:'fixture',displayName:'Test Applicant',roles:['ROLE_APPLICANT']}
    else if (url.pathname.endsWith('/api/shell/menu')) data=[]
    else if (endpoint==='fetchBanksMap') data=[{key:1,value:'State Bank of India'}]
    else if (endpoint==='fetchBankDetails') data=emptyBanks ? {successMessage:'BankList not found'} : {value:JSON.stringify([{id:1,bankName:'State Bank of India',accountHolderName:'Test Applicant',accountNumber:'123456789',ifscCode:'sbin0001234'}])}
    else if (endpoint==='saveBankDetails') data={successMessage:rejectBank ? 'UserBankDetails Allready exixts' : 'Data Saved Successfylly'}
    else if (endpoint==='fetchawards') data={aaData:[{...award,active:true},{...award,id:8,alreadyApplied:true,applicantApplicationStatus:3,applicantId:17},{...award,id:9,alreadyApplied:true,applicantApplicationStatus:2,applicantId:17},{...award,id:10,commingSoon:true},{...award,id:11,bookingClosed:true}],iTotalRecords:15,iTotalDisplayRecords:15}
    else if (url.pathname.includes('/loadMsmeAwardDetailsById/')) data=award
    else if (url.pathname.includes('/loadMsmeAwardApplicantDetailsById/')) data=application
    else if (endpoint==='fetchMsmeAwardDocumentsList') data=[{documentType:'Registration certificate',documentTypeCode:'MSME_AWARD_UAM_EM1_REGISTRATION'}]
    else if (/fetch(categoriesmap|FinancialYear|MasterYears|MasterCountries)/.test(endpoint)) data=[{key:'1',value:'Fixture option'}]
    else if (url.pathname.includes('/getMessage/')) data={value:'Confirm save?'}
    else if (endpoint==='addMsmeApplicationAwardDetails') data={id:17,successMessage:'Saved'}
    else if (endpoint==='addMsmeAwardApplicantDocuments') data=rejectDocs ? {errorMsgList:['Registration certificate is required']} : {successMessage:'Submitted'}
    try { await cdp('Fetch.fulfillRequest',{requestId:event.requestId,responseCode:200,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify(data)).toString('base64')}) } catch {}
  })
  await cdp('Fetch.enable',{patterns:[{urlPattern:'*/mpmsme/*'},{urlPattern:'*/backend/*'}]})
  const navigate=async route => { await cdp('Page.navigate',{url:base+route}); try { await waitFor('!!document.querySelector(".applicant-services-page")') } catch(error) { console.log({route,errors,body:await evaluate('document.body.textContent.slice(0,1000)')}); throw error } }
  const fill=(selector,value) => evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});Object.getOwnPropertyDescriptor(el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(el,${JSON.stringify(value)});el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));})()`)
  const attach=(selector,size=30,type='application/pdf') => evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});const files=new DataTransfer();files.items.add(new File([new Uint8Array(${size})],'test.pdf',{type:${JSON.stringify(type)}}));el.files=files.files;el.dispatchEvent(new Event('change',{bubbles:true}));})()`)
  const screenshot=async name => fs.writeFileSync(path.join(output,name+'.png'),Buffer.from((await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data,'base64'))
  await navigate('/applicant/bank-details/new')
  await waitFor('document.querySelector("select").options.length === 2')
  await click('.applicant-services-page button[type=submit]')
  await waitFor('document.querySelector(".applicant-services-page [role=alert]")?.textContent.includes("bank name")')
  assert.equal(requests.filter(r=>r.method==='POST').length,0)
  await fill('.applicant-services-page select','1')
  await fill('[name=accountHolderName]','Test Applicant')
  await fill('[name=accountNumber]','123456789')
  await fill('[name=ifscCode]','sbin0001234')
  assert.equal(await evaluate('document.querySelector("[name=ifscCode]").value'),'SBIN0001234')
  await attach('#chequefile',512001)
  await click('.applicant-services-page button[type=submit]')
  await waitFor('document.querySelector(".applicant-services-page [role=alert]")?.textContent.includes("500KB")')
  await attach('#chequefile')
  rejectBank=true
  await click('.applicant-services-page button[type=submit]')
  await waitFor('document.querySelector(".applicant-services-page [role=alert]")?.textContent.includes("Allready")')
  await screenshot('add-bank')
  rejectBank=false
  await click('.applicant-services-page button[type=submit]')
  await waitFor('location.pathname === "/applicant/bank-details" && document.body.textContent.includes("SBIN0001234")')
  assert.equal(await evaluate('document.querySelectorAll(".applicant-services-page thead th").length'),5)
  await screenshot('banks-list')
  emptyBanks=true
  await navigate('/applicant/bank-details')
  await waitFor('document.body.textContent.includes("No bank records found")')
  await navigate('/applicant/msme-award')
  await waitFor('document.body.textContent.includes("Coming Soon")')
  assert.ok(await evaluate('document.body.textContent.includes("View/Edit") && document.body.textContent.includes("Application Closed")'))
  await screenshot('award-list')
  await evaluate('[...document.querySelectorAll(".pagination button")].find(el=>el.textContent==="Next").click()')
  await waitFor('document.body.textContent.includes("Showing 11")')
  assert.ok(requests.some(r=>r.path.endsWith('fetchawards') && r.query.includes('iDisplayStart=10')))
  await navigate('/applicant/msme-award/applyMsmeAward/7')
  await waitFor('document.querySelectorAll("[name^=indvPartnerName_]").length === 1')
  await waitFor('!!window.jQuery?.fn.datetimepicker && !!window.jQuery(document.querySelector("[name=uamRegDate]")).data("xdsoft_datetimepicker")')
  await evaluate('document.querySelector("[name=uamRegDate]").focus()')
  await waitFor('[...document.querySelectorAll(".xdsoft_datetimepicker")].some(el=>el.getClientRects().length > 0)')
  await evaluate('[...document.querySelectorAll(".xdsoft_datetimepicker")].find(el=>el.getClientRects().length > 0).querySelector(".xdsoft_calendar td:not(.xdsoft_disabled) div").click()')
  await waitFor('/^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(document.querySelector("[name=uamRegDate]").value)')
  await click('.applicant-services-page .addfields')
  await waitFor('document.querySelectorAll("[name^=indvPartnerName_]").length === 2')
  await fill('[name=indvPartnerName_1]','Second Partner')
  await click('.applicant-services-page .remove')
  await waitFor('document.querySelectorAll("[name^=indvPartnerName_]").length === 1')
  await click('[name=anyQualityCertificate][value=true]')
  await waitFor('document.querySelector("[name=qualityCertificationDesc]").required && document.querySelector("[name=qualityCertificationDesc]").getClientRects().length > 0')
  await click('[name=anyQualityCertificate][value=false]')
  await waitFor('!document.querySelector("[name=qualityCertificationDesc]").required && document.querySelector("[name=qualityCertificationDesc]").getClientRects().length === 0')
  await fill('.number-OnlyTwoDecimal','123.45')
  assert.equal(await evaluate('(()=>{const el=document.querySelector(".number-OnlyTwoDecimal"); el.focus(); el.setSelectionRange(el.value.length,el.value.length); const event=new KeyboardEvent("keydown",{key:"6",bubbles:true,cancelable:true}); el.dispatchEvent(event); return event.defaultPrevented;})()'),true)
  assert.ok(await evaluate('[...document.querySelectorAll("input[readonly]")].some(el=>el.value === "123.45")'))
  await screenshot('award-apply')
  const fields=await evaluate('document.querySelectorAll(".applicant-services-page input,.applicant-services-page select,.applicant-services-page textarea").length')
  assert.ok(fields>100,`Expected complete award form, got ${fields} fields`)
  const before=requests.filter(r=>r.path.endsWith('/addMsmeApplicationAwardDetails')).length
  await evaluate('document.querySelector("form[name=awardForm]").requestSubmit()')
  await new Promise(resolve=>setTimeout(resolve,150))
  assert.equal(requests.filter(r=>r.path.endsWith('/addMsmeApplicationAwardDetails')).length,before)
  await evaluate('[...document.querySelectorAll(".applicant-services-page a")].find(el=>/Save.*Draft/i.test(el.textContent)).click()')
  await waitFor('location.pathname.includes("editMsmeAward/7/17")')
  await waitFor('document.querySelector("[name=unitName]")?.value === "Fixture Unit"')
  await screenshot('award-edit')
  await navigate('/applicant/msme-award/viewMsmeAwardForm/7/17')
  await waitFor('document.body.textContent.includes("Registration certificate")')
  await evaluate('window.printCalled=false; window.print=()=>{window.printCalled=true}; document.querySelector("[data-translation=\\"application.page.print\\"]").closest("a,button").click()')
  assert.equal(await evaluate('window.printCalled'),true)
  await screenshot('award-view')
  await navigate('/applicant/msme-award/uploadMsmeAwardDocs/7/17')
  await waitFor('document.querySelectorAll(".applicant-services-page input[type=file]").length === 12')
  const visible=await evaluate('[...document.querySelectorAll(".applicant-services-page input[type=file]")].filter(el=>el.getClientRects().length).length')
  assert.equal(visible,8)
  await screenshot('award-documents')
  await attach('.applicant-services-page tbody tr:last-child input')
  rejectDocs=true
  await evaluate('document.querySelector(".applicant-services-page form").requestSubmit()')
  await waitFor('document.body.textContent.includes("Registration certificate is required")')
  assert.ok(requests.findLast(r=>r.path.endsWith('addMsmeAwardApplicantDocuments')).body.includes('anyOtherInfoListDoc_1'))
  rejectDocs=false
  await evaluate('document.querySelector(".applicant-services-page form").requestSubmit()')
  await waitFor('location.pathname === "/applicant/msme-award"')
  await navigate('/applicant/online-nocs')
  await screenshot('online-nocs')
  await click('.applicant-services-page .btn-success')
  await waitFor('location.pathname === "/mpmsme/sws/initiate"')
  assert.deepEqual(errors,[])
  fs.writeFileSync(path.join(output,'browser-checks.json'),JSON.stringify({passed:true,mode:'Controlled fixtures; no live submissions',requests:requests.length,awardFields:fields,errors},null,2))
  console.log('Applicant services browser checks passed.')
} finally {
  try { socket?.close() } catch {}
  browser.kill()
  await server.close()
}
