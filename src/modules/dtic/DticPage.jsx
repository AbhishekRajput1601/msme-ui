import { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import IndustrialView from '../industrial-unit/IndustrialView'
import { createDticState } from './dticModel'
import { dticRequest } from './dticService'
import routes from './dticRoutes'
import InfrastructurePage from './infrastructure/InfrastructurePage'
import OxPage from './ox/OxPage'
import ReportsPage from './reports/ReportsPage'
import views from './generated/views.json'
import translations from './generated/translations.json'
import { expressions } from './generated/expressions'
import tables from './generated/tables.json'
import DticTable from './DticTable'
import DticAgenda from './DticAgenda'
import DticDashboard from './DticDashboard'
import FaStatusApplications from './FaStatusApplications'
import LandApplicantsPage from './LandApplicantsPage'
import toast from '../../utils/toast'
import Spinner from '../../components/loaders/Spinner'
import './generated/reference.css'
import './dtic-page.css'
import './dtic-msme-form.css'

export function matchDticRoute(pathname) {
  const segments = pathname.replace(/^\/department\/dtic(?:\/|$)/i, '').replace(/\/+$/, '').split('/').filter(Boolean)
  for (const route of routes) {
    const pattern = route.path.split('/')
    if (segments.length !== pattern.length || pattern.some((part,i) => !part.startsWith(':') && part.toLowerCase() !== segments[i].toLowerCase())) continue
    const params = Object.fromEntries(pattern.flatMap((part,i) => part.startsWith(':') ? [[part.slice(1),decodeURIComponent(segments[i])]] : []))
    return { route, params }
  }
  return null
}

export default function DticPage() {
  const location = useLocation(), { locale } = useTranslation()
  const statusOverview = new URLSearchParams(location.search).get('view') === 'statuses'
  const match = matchDticRoute(location.pathname)
  if (match?.route.path === 'dashboard') return <DticDashboard />
  if (match?.route.path === 'dticLandAllotment' && new URLSearchParams(location.search).get('view') === 'applicants') return <LandApplicantsPage />
  if (match?.route.controller === 'DTICMSMEReports') return <ReportsPage key={location.pathname+locale} match={match} locale={locale} />
  if (match?.route.controller === 'OXController') return <OxPage key={location.pathname+locale} match={match} locale={locale} />
  if (match?.route.controller === 'DTICIDController') return <InfrastructurePage key={location.pathname+locale+statusOverview} match={match} locale={locale} statusOverview={statusOverview} />
  return <DticContent key={location.pathname+locale+statusOverview} match={matchDticRoute(location.pathname)} locale={locale} statusOverview={statusOverview} />
}

function DticContent({ match, locale, statusOverview }) {
  const location = useLocation()
  const navigate = useNavigate(), [,render] = useReducer(n => n+1,0)
  const [content,setContent] = useState(null), [error,setError] = useState('')
  useEffect(() => {
    if (!match) return
    const abort = new AbortController()
    const { route,params } = match
    const state = createDticState({ params,navigate,locale,controller:route.controller,signal:abort.signal,notify:() => { if (!abort.signal.aborted) render() } })
    Object.assign(state,{ expressionBundle:expressions,viewBundle:views,translations })
    async function initialize() {
      let name = route.views.at(-1)
      if (route.views.length > 1) {
        try {
          const data = await dticRequest('get','fetchFAMSMEDetailUnitForSanction',{ applicationId:params.applicationId || params.applicationIds },abort.signal)
          const hasDecision = route.path.startsWith('fazonal') ? data?.zonalMeetingDate != null : params.establishmentType?.toLowerCase() === 'institute' ? !!data?.applicationId : data?.meetingDate != null
          if (hasDecision) name = route.views[0]
        } catch {
          // If fetch fails or no sanction data exists yet, remain on the primary view
        }
      }
      state.renderTable = tables[name] ? node => statusOverview && name === 'dtic/fapendingapplicantsunit'
        ? <FaStatusApplications name={name} node={node} state={state} />
        : <DticTable name={name} node={node} state={state} /> : undefined
      state.renderNode = node => {
        const id = node.attrs?.id?.[0]
        if (['historyModal','assistRemarkModal','eligibleModal'].includes(id)) return null
        return undefined
      }
      if (!abort.signal.aborted) setContent({ state,name })
    }
    initialize().catch(error => {
      if (!abort.signal.aborted) {
        setError(error.message)
        toast.error(error.message || 'Failed to load DTIC page.')
      }
    })
    return () => abort.abort()
  }, [navigate,locale,match,statusOverview])
  if (!match) return <div className="alert alert-danger">This DTIC page has not yet been migrated.</div>
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>
  if (!content) return <Spinner />
  const { state,name } = content
  return <div className={`dtic-page${name === 'dtic/msmeapplicationlist' ? ' dtic-msme-list' : ''}${name === 'dtic/viewmsmeform' ? ' dtic-msme-form' : ''}`}>
    {name === 'dtic/msmeapplicationlist' && location.state?.msmeSavedMessage && <div className="alert alert-success" role="status">{location.state.msmeSavedMessage}</div>}
    {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
    {((state.busy && !state.error) || state.saving) && <Spinner />}
    <IndustrialView name={name} state={state} />
    {state.agendaOpen && <DticAgenda state={state} />}
  </div>
}
