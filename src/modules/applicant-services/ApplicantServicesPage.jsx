import { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import IndustrialView from '../industrial-unit/IndustrialView'
import { createServiceState, referenceKeyDown } from './serviceModel'
import AwardTable from './AwardTable'
import ReferenceDateInput from './ReferenceDateInput'
import views from './generated/views'
import { expressions } from './generated/expressions'
import './generated/reference.css'
import './applicant-services.css'

export default function ApplicantServicesPage({ name }) {
  const location=useLocation()
  return <PageContent key={location.pathname} name={name} />
}

function PageContent({ name }) {
  const params=useParams(), navigate=useNavigate(), { locale }=useTranslation()
  const [,render]=useReducer(n => n+1,0)
  const [state,setState]=useState(null)
  useEffect(() => {
    const abort=new AbortController()
    const model=createServiceState({ params,navigate,notify:() => { if (!abort.signal.aborted) render() },signal:abort.signal,locale })
    Object.assign(model,{ expressionBundle:expressions,viewBundle:views })
    setState(model)
    return () => abort.abort()
  },[params.id,params.applicationId,navigate])
  if (!state) return <div role="status">Loading....</div>
  state.locale=locale
  state.renderTable=node => <AwardTable node={node} state={state} />
  state.renderDate=attrs => <ReferenceDateInput attrs={attrs} onError={error => { state.error=error.message; render() }} />
  return <div className="applicant-services-page" data-view={name} onKeyDownCapture={referenceKeyDown}>
    {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
    {state.busy && <div role="status" className="services-loading">Loading....</div>}
    <IndustrialView name={name} state={state} />
  </div>
}
