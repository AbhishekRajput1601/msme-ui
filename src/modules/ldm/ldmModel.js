import { installLdmActions, installViewActions } from './generated/actions'
import { createLdmRequests, ldmLink, ldmDocument, downloadLdmDocument } from './ldmService'

export function createLdmState({params, navigate, notify, signal, locale, batchCache, view}) {
  const state = {
    params, locale, notify, initialized:new Set(), preserveHeading:true,
    applications:[], searchText:'', responseObject:{}, batches:[], activeBatch:null,
    detail:null, detailHistory:[], dticInfo:{}, assistanceList:[], applicationNo:'',
    batchHeading:'District LDM Verification', remarkOptions:['Agree','Disagree'],
    forwardLabel:'Forward Batch to Collector', isCollector:false,
    resolveLink:ldmLink, documentPath:ldmDocument,
    navigate:path => path.startsWith('/mpmsme/') ? window.open(path,'_blank','noopener') : navigate(path),
  }
  Object.defineProperty(state,'faActiveBatch',{get:()=>batchCache.current, set:value=>{batchCache.current=value}})
  const navigation = {
    open:path=>window.open(ldmDocument(path),'_blank','noopener'), print:()=>window.print(),
    location:{set href(value){navigate(ldmLink(value))}, set hash(value){navigate(ldmLink(value))}},
  }
  const request=createLdmRequests(state,signal)
  const adapters={request,navigation,params,loading:{start(){state.busy=true;notify()},finish(){state.busy=false;notify()}},
    later:(fn,delay)=>setTimeout(()=>{if(!signal.aborted){fn();notify()}},delay)}
  installLdmActions(state,adapters)
  if(view) installViewActions(state,adapters)
  // The LDM document resolver supports both common and FA uploads.
  state.downloadChequeDocuments=id=>{if(id)navigation.open('downloadDoc/'+encodeURIComponent(id)+'/'+encodeURIComponent(params.applicationId))}
  state.goBack=()=>window.history.state?.idx > 0 ? navigate(-1) : navigate(ldmLink('verification'),{replace:true})
  state.goBackToBatch=state.goBack
  state.prepareElement=(attrs,node)=>{
    if(node.attrs?.href?.some(part=>typeof part==='string'&&part.includes('javascript:history.back()'))){
      attrs.onClick=event=>{event.preventDefault();state.goBack()}
    }
  }
  state.openRemarks=app=>{state.remarkApp=app;notify()}
  state.viewHistory=app=>request.get('history/'+encodeURIComponent(app.applicationId)).success(data=>{state.historyModal={applicationNo:app.applicationId,rows:data||[]}})
  state.downloadCoveringLetter=async batch=>{
    if(!batch?.batchId)return
    try { await downloadLdmDocument('downloadCoveringLetter/'+encodeURIComponent(batch.batchId),'CoveringLetter-'+(batch.batchCode||batch.batchId),signal) }
    catch { if(!signal.aborted){state.responseObject={errorMessage:'Covering letter is not available for this batch.'};notify()} }
  }
  // These buttons can be clicked repeatedly while asynchronous requests are pending.
  for(const name of ['submitBatch','submitVerify','submitQuery']) {
    const action=state[name]
    state[name]=(...args)=>{if(!state.busy) return action(...args)}
  }
  return state
}
