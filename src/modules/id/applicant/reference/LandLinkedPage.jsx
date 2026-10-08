import { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from '../../../../hooks/useTranslation'
import { get, post } from '../../../../api/httpClient'
import { jsonData } from '../../../../api/responseData'
import { requireSaveSuccess } from '../landApplicationModel'
import IndustrialView from '../../../industrial-unit/IndustrialView'
import { landReferenceLink } from './landReferenceLinks'
import views from './generated/views'
import { expressions } from './generated/expressions'
import './land-reference.css'
import ResolvedLandPage from './ResolvedLandPage'

export default function LandLinkedPage() {
  const location=useLocation()
  const route=useParams()['*']
  if (!route.startsWith('uploadLOC/') && !route.startsWith('id/updatePossessionLetter/')) return <ResolvedLandPage key={location.pathname} path={route} />
  return <LinkedContent key={location.pathname} />
}
function LinkedContent() {
  const route=useParams()['*'], navigate=useNavigate(), { locale }=useTranslation()
  const signing=route.startsWith('uploadLOC/') || route.startsWith('id/updatePossessionLetter/')
  const possession=route.startsWith('id/updatePossessionLetter/')
  const id=route.split('/')[possession ? 2 : 1]
  const [,render]=useReducer(n=>n+1,0)
  const [result,setResult]=useState({loading:true})
  const [gateway,setGateway]=useState(null)
  const [state]=useState(()=>({expressionBundle:expressions,viewBundle:views,initialized:new Set(),notify:render,preserveHeading:true,locale,
    applicationData:{applicantId:id},idApplicantBean:{},generateLOCLetter(){},goBackToBatch:()=>navigate(-1),doTheBack:()=>navigate(-1),resolveLink:landReferenceLink,
  }))
  state.locale=locale
  useEffect(()=>{
    const abort=new AbortController()
    if(signing) {
      get('/applicant/generateLOCLetter1/'+encodeURIComponent(id),{}, {signal:abort.signal}).then(jsonData).then(data=>{
        if(!data.applicantId || String(data.applicantId)!==String(id)) throw new Error('The letter does not match the selected application.')
        state.idApplicantBean=data
        if(!abort.signal.aborted)setResult({})
      }).catch(error=>{if(!abort.signal.aborted)setResult({error:error.message})})
    }
    return()=>abort.abort()
  },[route,id,signing,state])
  async function sign(dsc,valid=true) {
    if(!valid || state.saving || gateway)return
    if(!dsc && !/^\d{4}$/.test(state.aadhaarLast4Digits || '')) {state.error='Enter the last four Aadhaar digits.';render();return}
    if(!window.confirm(dsc ? 'Are you sure you want to digitally sign the Application Form?' : 'Are you sure you want to eSign the Application Form?'))return
    state.saving=true;state.error='';render()
    try {
      const html=document.querySelector('.land-reference-page .esignHtml')?.innerHTML
      if(!html || !state.idApplicantBean.applicationId)throw new Error('The complete letter is required before signing.')
      const type=possession?'APPLICATION_POSSESSION':'APPLICATION_LOC'
      const payload={aadhaarLast4Digits:state.aadhaarLast4Digits || '',remark:state.remark || '',type,primaryId:id,unsignedBase64:html,applicantNumber:state.idApplicantBean.applicationId,title:possession?'Possession Recipient':'Digital Signature'}
      const data=requireSaveSuccess(jsonData(await post('/applicant/'+(dsc?'generateLOIPDF':possession?'eSignApplicantDetailFormPossession':'eSignature'),payload)))
      if(!dsc) {
        const url=new URL(data.aspUrl)
        if(url.protocol!=='https:' || url.username || url.password || !data.eHastaksharHiddenInputTAG)throw new Error('The signing gateway response is incomplete.')
        setGateway({action:url.href,message:data.eHastaksharHiddenInputTAG})
      } else {
        if(!data.transactionId || !data.eHastaksharHiddenInputTAG)throw new Error('The server did not generate a signing transaction.')
        const response=await fetch('http://localhost:8060/jsonsigner/Sign',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(120000),body:JSON.stringify({ServerDateTime:data.serverDateTime,DocumentType:'PDF',Data:data.eHastaksharHiddenInputTAG,SignatureName:data.signatureName,Reason:data.reason,Location:data.location})})
        if(!response.ok)throw new Error('The DSC signer rejected the request.')
        const signed=await response.json()
        if(!signed.SignedData)throw new Error('Invalid response from DSC Signer. Please check your DSC setup.')
        const saved=jsonData(await post('/applicant/'+(possession?'signPDFPossession':'signPDFLoc'),{id,billId:String(id),value:signed.SignedData,signedBase64PDF:signed.SignedData,type,reason:possession?'POSSESSION Signing':'APPLICATION_LOC Signing',serverDateTime:data.serverDateTime,signatureName:data.signatureName || 'Authorized Signatory',transactionId:data.transactionId}))
        if(!saved.vcId)throw new Error('The server did not confirm the signed letter was saved.')
        navigate('/applicant/land-allotment')
      }
    }catch(error){state.error=error.message}finally{state.saving=false;render()}
  }
  state.eSignAppDetailLOCForm=valid=>sign(false,valid)
  state.eSignApplicantDetailFormPossession=valid=>sign(false,valid)
  state.digitalSignLoc=()=>sign(true)
  state.digitalSignPoss=()=>sign(true)
  return <div className="land-reference-page" data-view={possession?'uploadPossessionLetter':'uploadLOCLetter'}>
    {result.loading?<p role="status">Loading....</p>:result.error?<p className="alert alert-danger" role="alert">{result.error}</p>:<>
      {state.error && <p className="alert alert-danger" role="alert">{state.error}</p>}
      {gateway?<form action={gateway.action} method="post"><input type="hidden" name="msg" value={gateway.message}/><button className="btn btn-primary">Continue to eSign</button></form>:<IndustrialView name={possession?'uploadPossessionLetter':'uploadLOCLetter'} state={state}/>}
    </>}
  </div>
}
