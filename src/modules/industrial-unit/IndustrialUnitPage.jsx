import { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import IndustrialView from './IndustrialView'
import IndustrialUnitList from './IndustrialUnitList'
import InfrastructurePages from './InfrastructurePages'
import { createIndustrialState } from './industrialUnitModel'
import { getUnitData } from './industrialUnitService'
import './generated/reference.css'
import './industrial-unit.css'

export const industrialViews = {
  newapplicantsingleform: 'faNewMsmeFundAssistance',
  fanewmsmefundassistance: 'faNewMsmeFundAssistance',
  viewfaapplicantdetailunit: 'editFaNewMsmeFundAssistance',
  editfanewmsmefundassistance: 'editFaNewMsmeFundAssistance',
  viewfaapplicantdetailunitnew: 'viewFADetailUnitNew2',
  viewfadetailunitnew2: 'viewFADetailUnitNew2',
  viewfaschemesdetailsunit: 'viewFASchemesUnit',
  viewfaschemesunit: 'viewFASchemesUnit',
  fetchfaschemes: 'viewFASchemesFormUnit',
  viewfaschemesformunit: 'viewFASchemesFormUnit',
  viewfadocumentsuploadunit: 'viewFADocumentsUploadUnit',
  viewfadocuploadunitform: 'viewFADocUploadUnitForm',
  viewfaapplicanthistory: 'faHistory',
  faHistory: 'faHistory',
  fahistory: 'faHistory',
  viewfadisbursementunit: 'viewfaDisbursementUnit',
  viewfaacceptanceamountdetailunit: 'viewfaacceptanceamountdetailunit',
  infradevelopmetform: 'infraDevelopmetForm',
  infradevelopmentform: 'infraDevelopmetForm',
  infrastructure: 'infraDevelopmetForm',
  'infra-development': 'infraDevelopmetForm',
  addunitdetailsform: 'addUnitDetails',
  addunitdetails: 'addUnitDetails',
  'add-unit': 'addUnitDetails',
}

export function resolveIndustrialView(name) {
  if (!name) return null
  return industrialViews[name] || industrialViews[name.toLowerCase()] || null
}

function UnitContent({ route, id, establishmentType, locale }) {
  const navigate = useNavigate()
  const [, render] = useReducer(value => value + 1, 0)
  const [state, setState] = useState(null)
  const [view, setView] = useState(() => resolveIndustrialView(route))
  const normalizedRoute = (route || '').toLowerCase()
  const isQuery = ['queryreplybyapplicant', 'fetchquerybydtic'].includes(normalizedRoute)

  useEffect(() => {
    const abort = new AbortController()
    const model = createIndustrialState({
      params: { applicationId: id, establishmentType: establishmentType || 'Unit' },
      navigate,
      notify: () => { if (!abort.signal.aborted) render() },
      signal: abort.signal,
      locale,
    })
    if (resolveIndustrialView(route) === 'infraDevelopmetForm') model.preserveHeading = true
    setState(model)

    if (normalizedRoute === 'viewfadocumentsuploadunit') {
      getUnitData('fetchfaapplicantdocumentslist', { applicationId: id }, abort.signal)
        .then(data => {
          if (!abort.signal.aborted) {
            setView(data?.length ? 'viewFADocumentsUploadUnit' : 'viewFADocUploadUnitForm')
          }
        })
        .catch(error => {
          model.error = error.message
          model.notify()
        })
    }

    if (normalizedRoute === 'viewfaschemesdetailsunit') {
      getUnitData('fa/fetchfaschemesdetail', { applicationId: id }, abort.signal)
        .then(data => {
          if (!abort.signal.aborted) {
            setView(data?.applicationId ? 'viewFASchemesUnit' : 'viewFASchemesFormUnit')
          }
        })
        .catch(error => {
          model.error = error.message
          model.notify()
        })
    }

    if (isQuery) {
      model.loadQueryReplyPage()
    }

    return () => abort.abort()
  }, [normalizedRoute, id, establishmentType, locale, navigate, isQuery])

  if (!state) {
    return (
      <div className="text-center" style={{ textAlign: 'center', padding: '30px' }}>
        <p>Loading....</p>
      </div>
    )
  }

  return (
    <>
      {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
      {state.saving && <div className="industrial-saving" role="status">Loading....</div>}
      {isQuery ? (
        <div className="panel panel-info">
          <div className="panel-heading text-center" style={{ textAlign: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>Financial Assistance &gt; Industrial Unit &gt; Query Reply</span>
          </div>
          <div className="panel-body">
            <div className="form-group">
              <label>Query</label>
              <p className="form-control-static" style={{ padding: '6px 0', margin: 0 }}>
                {state.queryReplyData?.queryAsked || state.queryReplyData?.comments}
              </p>
            </div>
            <form onSubmit={e => { e.preventDefault(); state.submitQueryReply(e.currentTarget.checkValidity()) }}>
              <div className="form-group">
                <label htmlFor="queryReply">Reply <span className="aestrick">*</span></label>
                <textarea
                  id="queryReply"
                  className="form-control"
                  rows={4}
                  required
                  value={state.queryReplyData?.comments || ''}
                  onChange={e => { state.queryReplyData.comments = e.target.value; state.notify() }}
                />
              </div>
              <div className="text-center" style={{ textAlign: 'center', marginTop: '15px' }}>
                <button className="btn btn-primary" type="submit">Submit</button>{' '}
                <button className="btn btn-default" type="button" onClick={state.goBackToBatch}>Back</button>
              </div>
            </form>
          </div>
        </div>
      ) : view ? (
        <IndustrialView name={view} state={state} />
      ) : (
        <div className="alert alert-danger text-center" style={{ textAlign: 'center' }}>
          This Industrial Unit page was not found.
        </div>
      )}
    </>
  )
}

export default function IndustrialUnitPage() {
  const location = useLocation()
  const { locale } = useTranslation()

  // Match anything following /financial-assistance/ or /fa/ in path
  const match = location.pathname.match(/(?:financial-assistance|fa)\/?(.*)$/)
  const subpath = match ? match[1] : ''
  let segments = subpath ? subpath.split('/').filter(Boolean) : []
  if (segments[0]?.toLowerCase() === 'fa') {
    segments = segments.slice(1)
  }
  const route = segments[0] || ''

  let id = segments[1]
  let establishmentType = segments[2] || 'Unit'
  if (route.toLowerCase() === 'newapplicantsingleform') {
    establishmentType = segments[1] || 'Unit'
    id = undefined
  }

  const isList = !route || ['new', 'newapplicantform', 'applicantlist', 'list'].includes(route.toLowerCase())
  if (['infradevelopmetlist', 'viewfainfrastructure'].includes(route.toLowerCase())) {
    return <InfrastructurePages id={route.toLowerCase() === 'viewfainfrastructure' ? id : undefined} />
  }
  const isInfrastructure = resolveIndustrialView(route) === 'infraDevelopmetForm'

  return (
    <div className={isInfrastructure ? 'infrastructure-page infrastructure-form' : 'industrial-unit-page'}>
      {isList ? (
        <IndustrialUnitList />
      ) : (
        <UnitContent
          key={location.pathname + locale}
          route={route}
          id={id}
          establishmentType={establishmentType}
          locale={locale}
        />
      )}
    </div>
  )
}
