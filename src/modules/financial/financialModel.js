import { installFinancialActions } from './generated/actions'
import { createFinancialRequests, financialRequest, financialDocument, financialLink } from './financialService'
import { filter } from '../industrial-unit/viewHelpers'
import toast from '../../utils/toast'

export function createFinancialState({ params, navigate, notify, signal, locale }) {
  const state = {params, locale, notify, initialized:new Set(), initializePerInstance:true, preserveHeading:true,
    faData:{faIndustrialUnitBean:{},faRequiredAssistanceBean:{selectedOptions:{}}},faData2:{},responseObject:{},caseData:{},
    reportForm:{},disbursementList:[],disbursList:[], listVersion:0, applicationId:params.applicationId, establishmentType:params.establishmentType || 'Unit',
    resolveLink:financialLink,documentPath:financialDocument,tableRequest:financialRequest}
  const navigation={open:url=>window.open(/^https?:/.test(url)?url:financialDocument(url),'_blank','noopener'),alert:message=>toast.info(message),confirm:message=>window.confirm(message),location:{set href(value){navigate(financialLink(value))}}}
  const dom=selector=>{
    const elements=[...document.querySelectorAll(selector)]
    return Object.assign(elements, {val(value){if(value===undefined)return elements[0]?.value;elements.forEach(e=>{e.value=value});return this},prop(key,value){elements.forEach(e=>{e[key]=value});return this},modal(action){state.modal=action==='hide'?null:selector;notify()},html(){return this}})
  }
  installFinancialActions(state,{request:createFinancialRequests(state,signal),navigation,params,
    loading:{start(){state.busy=true;notify()},finish(){state.busy=false;notify()}},
    format:name=>(value,pattern)=>name==='IND'?Number(value||0).toFixed(2):filter(name,value,pattern),
    later:(fn,delay)=>setTimeout(()=>{if(!signal.aborted){fn();notify()}},delay),dom})
  for(const name of ['loadPendingApplicantList','loadInfrastructureList']) state[name]=()=>{state.listVersion++;notify()}
  state.loadDateTimePicker=()=>{}
  state.goBackToBatch=()=>navigate(financialLink('dticfapendingapplicantsunit'))
  state.doTheBack=()=>navigate(-1)
  state.inlineAction=action=>{
    if(/history.back|refresh\(/.test(action))navigate(-1)
    else if(/searchList|searchRecord/.test(action)){state.reportStart=0;state.listVersion++;notify()}
    else if(/reset\(/.test(action)){state.reportForm={};state.reportStart=0;state.listVersion++;notify()}
    else if(/generateMeetingAgenda|createBatchForward/.test(action))navigate(financialLink(`faCommitteesStatusUnit/${state.IdList.join(',')}/Unit`))
    else if(/cancelPopup/.test(action)){state.modal=null;notify()}
    else throw new Error('Unsupported Financial action: '+action)
  }
  state.selectApplication=(id,selected)=>{state.IdList=selected?[...new Set([...state.IdList,id])]:state.IdList.filter(v=>v!==id);notify()}
  state.acceptApplication=async id=>{
    state.saving=true;notify()
    try{
      state.responseObject=await financialRequest('post','updateStatus',new URLSearchParams({applicationId:id,status:'accepted'}),signal)
      toast.success('Application accepted successfully.')
      state.listVersion++
    }
    catch(e){
      state.error=e.message
      toast.error(e.message || 'Failed to update application status.')
    }finally{state.saving=false;notify()}
  }
  state.downloadAction=(action,id)=>{
    const types={downloadDLCLetter:'FA_UNIT_COMMITTEE_NOTESHEET',downloadRejectionLetter:'FA_UNIT_ZONAL_NOTESHEET',downloadSanctionDocuments:'FA_ACCEPTANCE_LETTER_RELEASED',downloadDisbursementLetter:'FA_DISBURSEMENT_LETTER_RELEASED'}
    if(types[action])navigation.open(`downloadfadocument/${types[action]}/${encodeURIComponent(id)}`)
    else if(state[action])state[action](id)
    else throw new Error('Unknown document action: '+action)
  }
  state.downloadInfrastructuredocument=(code,type,id)=>navigation.open(`downloadInfrastructuredocument/${encodeURIComponent(code)}/${encodeURIComponent(type)}/${encodeURIComponent(id)}`)
  state.process=()=>{
    if(!state.disbursementList.some(row=>row.check)){toast.warning('Please select items before proceeding');return}
    navigate(financialLink('faDisbursementUnit_new2/'+encodeURIComponent(JSON.stringify(state.disbursementList))))
  }
  state.prepareField=(attrs)=>{
    if(/number-OnlyTwoDecimal|number-only/i.test(attrs.className||'')){attrs.inputMode='decimal';attrs.pattern='[0-9]+(?:\\.[0-9]{1,2})?'}
  }
  state.initTodayDate()
  return state
}
