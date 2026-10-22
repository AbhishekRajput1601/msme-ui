import assert from 'node:assert/strict'
import {installLdmActions,installViewActions} from '../src/modules/ldm/generated/actions.js'
const alerts=[],requests=[]
globalThis.alert=message=>alerts.push(message)
globalThis.confirm=()=>true
let response={successMessage:'Saved'}
const chain=data=>({success(fn){fn(data);return this},error(){return this},then(fn){fn({data});return this}})
const request={get(url){requests.push({method:'get',url});return chain(url==='fetchBatches'?[]:url.startsWith('batchDetail/')?{batchId:4,applications:[{applicationNo:'A'}]}:url==='fetchApplications'?[]:{})},post(url,data){requests.push({method:'post',url,data});return chain(response)}}
const state={applications:[],searchText:'',responseObject:{}}
const adapters={request,params:{applicationId:'A'},navigation:{location:{},open(){}},loading:{start(){},finish(){}},later(){}}
installLdmActions(state,adapters)
state.applications=[{applicationId:'A',currentStatusId:21,selected:true,remark:'Verified'},{applicationId:'B',currentStatusId:22,selected:true}]
assert.deepEqual(state.getSelected(),[{applicationNo:'A',remark:'Verified'}])
state.submitVerify()
assert.deepEqual(requests.find(r=>r.url==='verify').data,[{applicationNo:'A',remark:'Verified'}])
state.submitQuery()
assert.equal(alerts.at(-1),'Please select at least one application.')
state.applications=[{applicationId:'A',currentStatusId:'21',selected:true,remark:'Document Missing'}]
state.submitQuery()
assert.equal(requests.find(r=>r.url==='query').data[0].remark,'Document Missing')
state.openBatch({batchId:4})
assert.equal(state.activeBatch.applications[0].remark,'Agree')
assert.equal(state.faActiveBatch,state.activeBatch)
state.activeBatch.applications[0].remark='Disagree'
const before=requests.length
state.submitBatch()
assert.equal(requests.length,before)
assert.match(alerts.at(-1),/Remark Note is mandatory/)
state.activeBatch.applications[0].remarkText='   '
state.submitBatch()
assert.equal(requests.length,before)
state.activeBatch.applications[0].remarkText='Clarify'
response={errorMessage:'Not allowed'}
state.submitBatch()
assert(state.activeBatch,'A rejected batch must retain the draft')
response={successMessage:'Saved'}
state.submitBatch()
assert.equal(state.activeBatch,null)
assert.equal(state.faActiveBatch,null)
assert.deepEqual(requests.find(r=>r.url==='submitBatch/4').data,[{applicationNo:'A',remark:'Disagree',remarkText:'Clarify'}])
assert.equal(state.assistanceAmountText({eligibleAmount:0,remark:'Comment'}),'--')
assert.equal(state.assistanceAmountText({eligibleAmount:0}),0)
assert.equal(state.assistanceAmountText({}),'-')
state.detail={panUploadId:1,faIndustrialUnitBean:{schemeDocUploadId:2}}
assert.deepEqual(state.documentList(),[{label:'PAN Card',id:1},{label:'Scheme Document',id:2}])
installViewActions(state,adapters)
state.loadUserIndustrialDetailsByApplicationId()
assert.equal(state.faData.faIndustrialUnitBean.capitalInvestmentBeans.length,2)
assert.equal(state.faData.faRequiredAssistanceBean.pharmaExpInvDetailsBeans.length,1)
assert.equal(state.disabled,true)
assert.equal(state.isVerificationView,true)
assert.equal(state.calcTotal([{amount:20},{amount:30}]),'50.00')
console.log('PASS: LDM status locking, verification/query, batch decisions, blank-note validation, rejected-draft retention, successful clearing, documents, and read-only null guards.')
