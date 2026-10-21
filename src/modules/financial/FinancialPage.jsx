import {useEffect,useReducer,useState} from 'react'
import {useLocation,useNavigate} from 'react-router-dom'
import {useTranslation} from '../../hooks/useTranslation'
import IndustrialView from '../industrial-unit/IndustrialView'
import DticTable from '../dtic/DticTable'
import FinancialDashboard from './FinancialDashboard'
import ReferenceDateInput from '../applicant-services/ReferenceDateInput'
import DepartmentProfilePage from '../profile/department/DepartmentProfilePage'
import FinancialReportTable,{exportReport} from './FinancialReportTable'
import {createFinancialState} from './financialModel'
import {financialRequest} from './financialService'
import routes from './generated/routes.json'
import views from './generated/views.json'
import translations from './generated/translations.json'
import tables from './generated/tables.json'
import reports from './generated/reports.json'
import {rowRules} from './generated/rows'
import {expressions} from './generated/expressions'
import toast from '../../utils/toast'
import Spinner from '../../components/loaders/Spinner'
import '../industrial-unit/industrial-unit.css'
import '../dtic/dtic-page.css'
import './generated/reference.css'
import './financial.css'
export function matchFinancialRoute(pathname){
 const segments=pathname.replace(/^\/department\/fa\/?/,'').split('/').filter(Boolean)
 for(const route of routes){const parts=route.path.split('/');if(parts.length!==segments.length||parts.some((p,i)=>!p.startsWith(':')&&p.toLowerCase()!==segments[i].toLowerCase()))continue
 return{route,params:Object.fromEntries(parts.flatMap((p,i)=>p.startsWith(':')?[[p.slice(1),decodeURIComponent(segments[i])]]:[]))}}
 return null
}
export default function FinancialPage(){
 const {pathname,search}=useLocation(),{locale}=useTranslation()
 if(/\/(?:updateprofile|profile)$/.test(pathname))return <DepartmentProfilePage request={financialRequest} dashboard="/department/fa/dashboard"/>
 if(/\/(?:changepassword|change-password|firstPasswordChange|first-password-change)$/.test(pathname))return <DepartmentProfilePage password request={financialRequest} dashboard="/department/fa/dashboard"/>
 if(/\/success$/.test(pathname))return <div className="alert alert-success">Success</div>
 if(/\/fa\/?$|\/fa\/dashboard$/i.test(pathname))return <FinancialDashboard/>
 return <Content key={pathname+search+locale} query={search} match={matchFinancialRoute(pathname)} locale={locale}/>
}
function Content({match,locale,query}){
 const navigate=useNavigate(),[,render]=useReducer(n=>n+1,0),[content,setContent]=useState(null),[error,setError]=useState('')
 useEffect(()=>{
  if(!match)return
  const abort=new AbortController(),{route}=match
  const params={...Object.fromEntries(new URLSearchParams(query)),...match.params}
  const state=createFinancialState({params,navigate,locale,signal:abort.signal,notify:()=>{if(!abort.signal.aborted)render()}})
  state.renderDate=attrs=><ReferenceDateInput attrs={attrs} options={{scrollInput:false,...(state.reportName?{maxDate:new Date()}: {})}} onError={error=>{state.error=error.message;toast.warning(error.message);state.notify()}}/>
  Object.assign(state,{viewBundle:views,expressionBundle:expressions,translations,tableBundle:tables,rowRules})
  async function load(){
   let name=route.views.at(-1)
   if(route.views.length>1){const data=await financialRequest('get','fetchFAMSMEDetailUnitForSanction',{applicationId:params.applicationId},abort.signal);if(/institution/i.test(params.establishmentType||'') ? !!data?.applicationId : data?.meetingDate!=null)name=route.views[0]}
   if(reports[name]){state.reportName=name;state.reportConfig=reports[route.path==='detailList'?'detailList':name];state.renderTable=node=><FinancialReportTable name={name} node={node} state={state}/>}
   else if(tables[name])state.renderTable=node=><DticTable name={name} node={node} state={state}/>
   state.renderNode=node=>{
    const id=node.attrs?.id?.[0]
    if(reports[name]&&['paggingPanel','dataTables-example_paginate'].includes(id))return null
    if(reports[name]&&id==='exportRecordInExcel')return <button type="button" className="btn btn-success" onClick={()=>exportReport(state)}>Export to Excel</button>
    return undefined
   }
   if(!abort.signal.aborted)setContent({state,name})
  }
  load().catch(e=>{
    if(!abort.signal.aborted) {
      setError(e.message)
      toast.error(e.message || 'Failed to load financial page.')
    }
  })
  return()=>abort.abort()
 },[navigate,locale])
 if(!match)return <div className="alert alert-warning">The legacy template for this Financial page is unavailable in the source checkout.</div>
 if(error)return <div className="alert alert-danger" role="alert">{error}</div>
 if(!content)return <Spinner />
 const {state,name}=content
 return <div className="industrial-unit-page dtic-page financial-page">{(state.busy||state.saving)&&<Spinner />}<IndustrialView name={name} state={state}/></div>
}
