import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createServer } from 'vite'
import { fixture } from './dtic-infrastructure-fixtures.mjs'

const server = await createServer({ server:{middlewareMode:true},appType:'custom' })
const abort = new AbortController()
const alerts = [], navigation = [], calls = []
globalThis.alert = message => alerts.push(message)
globalThis.confirm = () => true
const settle = () => new Promise(resolve=>setTimeout(resolve,30))
try {
  const {createInfrastructureState,validateInfrastructureFile,createInfrastructureRequests} = await server.ssrLoadModule('/src/modules/dtic/infrastructure/infrastructureModel.js')
  globalThis.window = { alert:globalThis.alert,confirm:globalThis.confirm,open:url=>navigation.push(url) }
  globalThis.document = { querySelector:()=>({value:'',style:{},setAttribute(){}}), getElementById:()=>({value:'1'}) }
  const {default:routes} = await server.ssrLoadModule('/src/modules/dtic/infrastructure/generated/routes.json')
  const {default:menu} = await server.ssrLoadModule('/src/modules/dtic/dticMenu.json')
  const {default:views} = await server.ssrLoadModule('/src/modules/dtic/infrastructure/generated/views.json')
  const {expressions} = await server.ssrLoadModule('/src/modules/dtic/infrastructure/generated/expressions.js')
  const {dticCells} = await server.ssrLoadModule('/src/modules/dtic/DticTable.jsx')
  const {rowRules} = await server.ssrLoadModule('/src/modules/dtic/infrastructure/generated/rows.js')
  const {default:tables} = await server.ssrLoadModule('/src/modules/dtic/infrastructure/generated/tables.json')
  const transport = async config => {
    calls.push({...config,data:config.data instanceof FormData ? Object.fromEntries(config.data) : structuredClone(config.data)})
    return {data:fixture(new URL('/mpmsme'+config.url,'http://fixture'),config.method.toUpperCase()),status:201,headers:{},config}
  }
  const state = createInfrastructureState({params:{applicantId:'1',vacantLandId:'1'},navigate:url=>navigation.push(url),notify(){},signal:abort.signal,locale:'en',transport})
  const form = {$valid:true,$setPristine(){},$setUntouched(){}}
  const posts = () => calls.filter(c=>c.method==='post')
  const fresh = createInfrastructureState({params:{},navigate(){},notify(){},signal:abort.signal,locale:'en',transport})
  fresh.loadVacantLandFormDetail(); await settle()
  const nextMonth=new Date(new Date().getFullYear(),new Date().getMonth()+1,1)
  const suffix=`${String(nextMonth.getMonth()+1).padStart(2,'0')}/${nextMonth.getFullYear()}`
  assert.equal(fresh.vacantLandData.bookingStartDate,`01/${suffix} 11:00`)
  assert.equal(fresh.vacantLandData.bookingEndDate,`15/${suffix} 17:00`)
  const dateInput={type:'datetime-local',value:''}
  fresh.prepareElement(dateInput,{})
  assert(dateInput.min.endsWith('-01T11:00'),'Empty booking date retains its minimum')
  const noticeRow={applicantId:1,statusId:15,vacantLandBean:{},idNoticeBean:null}
  assert.match(dticCells('dtic/id/applicantListForNotice',noticeRow,0,rowRules,tables)[7],/viewIssueNotice\/1/)
  noticeRow.idNoticeBean={noticeId:2,complianceStatus:false}
  assert.match(dticCells('dtic/id/applicantListForNotice',noticeRow,0,rowRules,tables)[7],/reviewCompliance\/2/)
  noticeRow.idNoticeBean.complianceStatus=true
  assert.match(dticCells('dtic/id/applicantListForNotice',noticeRow,0,rowRules,tables)[7],/viewNoticeHistory\/2/)
  for (const item of menu.find(i=>i.key==='dtic-6').children) assert(routes.some(r=>r.path===item.legacyHref.slice(1)),item.label.en)
  const sourceInventory=JSON.parse(fs.readFileSync('artifacts/dtic-infrastructure/inventory.json','utf8'))
  for (const [name,source] of Object.entries(sourceInventory)) {
    let fields=0
    const walk = nodes => { for (const n of nodes||[]) {
      if (['input','select','textarea'].includes(n.tag)) fields++
      for (const key of ['init','submit','click','change','blur']) if (n[key]!=null) {
        const functions=String(expressions[n[key]]).matchAll(/s\.(\w+)\s*\(/g)
        for (const match of functions) assert.equal(typeof state[match[1]],'function',`${name}: ${match[1]}`)
      }
      walk(n.children)
    }}
    walk(views[name])
    assert.equal(fields,source.fields.length,`${name}: field inventory`)
  }
  state.loadCreateIndustrialArea(); await settle()
  assert.equal(state.industrialAreaData.districtId,'1')
  assert.equal(state.industrialAreaData.dticId,'1')
  assert(calls.some(c=>c.url.includes('fetchtehsilmapbydistrict')&&c.params.districtId===1))
  for (const [name,args] of [
    ['createIndustrialArea',[{$valid:false},null]],['createCollectorRate',[{$valid:false}]],
    ['createIndustrialAreaRate',[{$valid:false}]],['addVacantLandDetailFunction',[false]],
    ['addBacklogLandAllotment',[{$valid:false},null]],['issueNotice',[false]],
    ['saveComplianceStatus',[false]],['saveConditionalComplianceStatusZO',[false]],['saveConditionalComplianceStatusIC',[false]],
  ]) { const count=posts().length; state[name](...args); await settle(); assert.equal(posts().length,count,name+' must reject invalid form') }
  const pdf = new File(['%PDF-1.4'],'map.pdf',{type:'application/pdf'})
  state.industrialAreaData={districtId:1,dticId:1,tehsilId:2,areaId:3,location:'Test location',totalArea:4}
  state.createIndustrialArea(form,pdf); await settle()
  const saved=posts().find(p=>p.url==='/dtic/addIndustrialArea')
  assert.deepEqual(Object.keys(saved.data),['mapImage','districtId','tehsilId','dticId','areaId','location','totalArea'])
  assert.equal(saved.data.location,'Test location')
  assert.equal(state.error,'')
  // Preserve all ten legacy reservation/rate bands, lease percentage, and deposit multiplier.
  for (const [index,premium] of [5,10,20,50,75,100,10,25,50,100].entries()) {
    state.industrialAreaRateData={industrialAreaId:'1',collectorRateId:'1',rateTypeId:String(index+1)}
    state.fetchMasterRates(); await settle()
    assert.equal(Number(state.industrialAreaRateData.premiumCharges),premium)
    assert.equal(Number(state.industrialAreaRateData.leaseRent),Number((premium*0.02).toFixed(2)))
    assert.equal(Number(state.industrialAreaRateData.securityDeposit),Number((premium*0.06).toFixed(2)))
    assert.equal(state.industrialAreaRateData.developmentCharges,index>=6?'150.00':'100.00')
  }
  state.industrialAreaRateData={industrialAreaId:1,collectorRateId:1,rateTypeId:1,premiumCharges:5,developmentCharges:100,maintenanceCharges:10,leaseRent:0.1,securityDeposit:0.3}
  const beforeOldRate=posts().length
  state.createIndustrialAreaRate(form); await settle()
  assert.equal(posts().length,beforeOldRate,'Legacy approved-rate categories cannot be saved')
  state.industrialAreaRateData.rateTypeId=7
  state.createIndustrialAreaRate(form); await settle()
  assert(Math.abs(posts().find(p=>p.url==='/dtic/addIndustrialAreaRate').data.totalAmount-115.4)<0.00001)
  state.idPendingApplicantList=[{status:'Submitted',statusId:1},{status:'Approved',statusId:2},{status:'Tender',statusId:40}]
  state.toggleApplicationListChecks(true)
  assert.deepEqual(state.idPendingApplicantList.map(x=>!!x.checkId),[true,false,true])
  assert.equal(state.checkCount,2)
  state.writeField(state,'formData.h1BidAmount',1000)
  state.writeField(state,'formData.advancePremiumH1',100)
  assert.equal(state.formData.totalAmount,'900.00')
  state.formData={publicationDate:new Date(2026,9,20),bidStartDate:new Date(2026,9,19),bidEndDate:new Date(2026,9,21)}
  const before=posts().length
  state.submitTenderForm(form); await settle()
  assert.equal(state.bidStartBeforePublication,true)
  assert.equal(posts().length,before)
  state.formData.bidStartDate=new Date(2026,9,20)
  state.formData.bidEndDate=new Date(2026,9,20)
  state.submitTenderForm(form); await settle()
  assert.equal(state.bidEndBeforeStart,true)
  assert.equal(posts().length,before)
  for (const [path,limit] of [['mapImage',2],['leaseFile',5]]) {
    assert.equal(validateInfrastructureFile(path,{name:'file.pdf',size:limit*1024*1024}), '')
    assert.match(validateInfrastructureFile(path,{name:'file.pdf',size:limit*1024*1024+1}),/size/)
  }
  assert.match(validateInfrastructureFile('mapImage',{name:'bad.exe',size:1}),/allowed/)
  assert.match(validateInfrastructureFile('vacantLandData.wdtKmlFile',{name:'map.kml',size:1048576}),/1 MB/)
  assert.equal(validateInfrastructureFile('vacantLandData.wdtKmlFile',{name:'map.kml',size:1048575}),'')
  state.writeField(state,'mapImage',new File(['bad'],'bad.exe'))
  assert.equal(state.mapImage,null)
  assert.equal(state.fileExtentionError,true)
  // Verify the adapter retains response status and all chaining methods used by signing.
  let status
  const adapter=createInfrastructureRequests(state,abort.signal,transport)
  await adapter.get('fetchIndustrialAreaList').success((data,code)=>{status=code}).finally(()=>{})
  assert.equal(status,201)
  assert.equal(state.error,'')
  console.log(`PASS: eight menu routes, ${Object.keys(sourceInventory).length} template field inventories, bound actions, dropdowns, required validation, multipart payload, ten rate bands, selection rules, tender dates, file boundaries and HTTP adapter.`)
} finally { abort.abort(); await server.close() }
