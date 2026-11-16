import BackButton from '../../components/ui/BackButton'
import { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import IndustrialView from './IndustrialView'
import IndustrialUnitList from './IndustrialUnitList'
import InfrastructurePages from './InfrastructurePages'
import { createIndustrialState } from './industrialUnitModel'
import { getUnitData } from './industrialUnitService'
import { filter } from './viewHelpers'
import translations from './generated/translations.json'
import Spinner from '../../components/loaders/Spinner'
import toast from '../../utils/toast'
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
    model.toastStatusMessages = true
    setState(model)

    if (normalizedRoute === 'newapplicantsingleform') {
      try {
        model.loadUserIndustrialDetails?.()
      } catch (err) {
        console.warn('loadUserIndustrialDetails error:', err)
      }
    }

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

  const errorMessage = state?.error || state?.responseObject?.errorMessage || state?.responseObject1?.errorMessage
  const successMessage = state?.responseObject?.successMessage || state?.responseObject1?.successMessage
  useEffect(() => {
    if (state?.saving) return
    if (errorMessage) toast.error(errorMessage)
    else if (successMessage) toast.success(successMessage)
  }, [state?.saving, errorMessage, successMessage])

  if (!state) {
    return (
      <div>
        <Spinner />
      </div>
    )
  }

  return (
    <>
      {state.saving && <Spinner />}
      {state.step === 3 && state.assistanceLoading && <p role="status">Loading available assistance schemes…</p>}
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
                <BackButton />
              </div>
            </form>
          </div>
        </div>
      ) : view ? (
        <>
          {view === 'infraDevelopmetForm' && (
            <h1 className="infrastructure-application-heading">
              Infrastructure Development Permission &gt;&gt; {translations[locale]?.['application.selfemployment.applicationform'] || 'Application Form'}
            </h1>
          )}
          {view === 'faNewMsmeFundAssistance' && !state.formOpen ? (
            <div className="commercial-date-box-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '55vh', padding: '30px 15px' }}>
              <div className="panel panel-info" style={{ width: '100%', maxWidth: '580px', boxShadow: '0 4px 15px rgba(0,0,0,0.12)', borderRadius: '6px', border: '1px solid #bce8f1', overflow: 'hidden' }}>
                <div className="panel-heading text-center" style={{ backgroundColor: '#2b509a', color: '#ffffff', padding: '15px 20px', textAlign: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>Commercial Production Date</h4>
                  <div style={{ fontSize: '12px', marginTop: '5px', color: '#eef5fb' }}>Please select the commercial production date of the industrial unit</div>
                </div>
                <div className="panel-body" style={{ padding: '25px 30px' }}>
                  <div className="form-group text-center" style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <label htmlFor="unitStartDate" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '10px', color: '#333333' }}>
                      Commercial Production Date <span className="aestrick" style={{ color: '#d9534f' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <input
                        type="date"
                        id="unitStartDate"
                        name="unitStartDate"
                        className="form-control"
                        style={{ maxWidth: '280px', height: '40px', fontSize: '14px', textAlign: 'center', borderRadius: '4px', border: '1px solid #ccc' }}
                        value={state.faData?.faIndustrialUnitBean?.unitStartDate ? filter('date', state.faData.faIndustrialUnitBean.unitStartDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => {
                          const val = e.target.value ? filter('date', e.target.value, 'dd/MM/yyyy') : ''
                          if (!state.faData) state.faData = {}
                          if (!state.faData.faIndustrialUnitBean) state.faData.faIndustrialUnitBean = {}
                          state.faData.faIndustrialUnitBean.unitStartDate = val
                          state.checkProductionDate()
                          state.notify()
                        }}
                        required
                      />
                    </div>
                  </div>

                  {state.showPolicy && (
                    <div className="alert alert-info" style={{ marginTop: '20px', borderRadius: '4px', borderLeft: '4px solid #31708f', backgroundColor: '#d9edf7', color: '#31708f', padding: '15px' }}>
                      <div style={{ fontSize: '13px', lineHeight: 1.5, fontWeight: 500 }}>
                        <i className="fa fa-info-circle fa-fw" style={{ marginRight: '6px' }} />
                        <strong>Policy Details: </strong>{state.policyMessage}
                      </div>
                      <hr style={{ margin: '12px 0', borderColor: '#bce8f1' }} />
                      <label style={{ cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: '#31708f' }}>
                        <input
                          type="checkbox"
                          style={{ width: '18px', height: '18px', cursor: 'pointer', margin: 0 }}
                          checked={!!state.declarationAccepted}
                          onChange={(e) => {
                            state.declarationAccepted = e.target.checked
                            if (e.target.checked) {
                              state.openForm()
                            } else {
                              state.formOpen = false
                            }
                            state.notify()
                          }}
                        />
                        <span>I accept the policy terms and conditions</span>
                      </label>
                    </div>
                  )}

                  {state.showPolicy && state.declarationAccepted && (
                    <div className="text-center" style={{ marginTop: '25px', textAlign: 'center' }}>
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{ padding: '8px 26px', fontSize: '14px', fontWeight: 600, borderRadius: '4px' }}
                        onClick={() => {
                          state.formOpen = true
                          state.notify()
                        }}
                      >
                        Continue to Application Form <i className="fa fa-arrow-right" style={{ marginLeft: '6px' }} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <IndustrialView name={view} state={state} />
          )}
        </>
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
