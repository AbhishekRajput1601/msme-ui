import { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from '../../../../hooks/useTranslation'
import { get } from '../../../../api/httpClient'
import { jsonData } from '../../../../api/responseData'
import IndustrialView from '../../../industrial-unit/IndustrialView'
import { filter } from '../../../industrial-unit/viewHelpers'
import { loadAnnualPayment, fetchAnnualHistory, fetchAnnualDetail, saveAnnualPayment, annualCharges } from '../services/landAnnualPaymentService'
import { loadNoticeWorkflow, saveNoticeWorkflow } from '../services/landNoticeService'
import LandReferenceTable from './LandReferenceTable'
import { landReferenceLink } from './landReferenceLinks'
import views from './generated/views'
import { expressions } from './generated/expressions'
import tables from './generated/tables.json'
import './generated/reference.css'
import './land-reference.css'

export const noticeViews = { compliance:'enterCompliance', notice:'viewCompliance', 'appeal-zo':'newAppeal', 'appeal-ic':'newAppealForIC', 'view-zo':'viewAppeal', 'view-ic':'viewAppealForIC', hearing:'viewAppealHearing', 'conditional-zo':'enterConditionalComplianceZO', 'conditional-ic':'enterConditionalComplianceIC', 'decision-zo':'viewZOConditionalDecision', 'decision-ic':'viewICConditionalDecision' }

export default function LandReferencePage({ name }) {
  const location = useLocation()
  return <ReferenceContent key={location.pathname} name={name} />
}

function ReferenceContent({ name }) {
  const params = useParams(), navigate = useNavigate(), { locale } = useTranslation()
  const [, render] = useReducer(n => n+1,0)
  const [state] = useState(() => {
    const model = {
      expressionBundle:expressions, viewBundle:views, initialized:new Set(), preserveHeading:true,
      notify:render, locale, busy:!tables[name], legacyData:{}, responseObject:{}, responseObject1:{},
      applicantId:'0', vacantLandId:params.parcelToken, accept:false, loadInstructionPage() {}, validateUrl() {},
      paymentData:{}, applicantData:{ vacantLandBean:{} }, noticeData:{}, hearingData:{}, conditionalData:{},
      appealData:{}, appealHearingData:{}, historyList:[], hearingList:[],
      loadLandAllotmentDetailList() {}, loadApplicationList() {}, searchByLegecyDataFilters() {},
      loadVacantLandDetail() {}, loadNoticeDetails() {}, loadAppealDetails() {}, loadAppealHearingDetails() {}, loadHearingDetails() {}, loadAnnualPaymentHistory() {}, loadAnnualPaymentDetails() {},
      doTheBack:() => navigate(-1), goBackToBatch:() => navigate(-1),
      resolveLink:landReferenceLink,
      downloadNoticeDocument:id => window.open('/mpmsme/applicant/downloadNoticeDocument/'+encodeURIComponent(id),'_blank','noopener'),
      prepareField(attrs) {
        if (['fyFrom','fyTo'].includes(attrs.name)) { attrs.type='number'; attrs.min=1900; attrs.max=9999; attrs.step=1 }
        if (attrs.name === 'appealDate') attrs.type='date'
      },
      calculateAPTotal() {
        const years = Math.max(0,Number(model.paymentData.fyTo || 0)-Number(model.paymentData.fyFrom || 0))
        model.paymentData.totalCharges = (annualCharges.reduce((total,[key]) => total+Number(model.paymentData[key] || 0),0)*years).toFixed(2)
      },
      validateYear() { model.calculateAPTotal() },
    }
    async function submit(valid, action, confirmation='common.confirmToSave') {
      if (!valid || model.saving) return
      model.saving=true; model.error=''; render()
      try {
        const message = jsonData(await get('/applicant/getMessage/'+confirmation))
        if (!window.confirm(message.value || 'Are you sure to submit the form?')) return
        await action()
      } catch (error) { model.error=error.message }
      finally { model.saving=false; render() }
    }
    model.applicantAnnualPayment = valid => submit(valid,async () => {
      const id = await saveAnnualPayment(params.applicantId,model.paymentData)
      navigate('/applicant/land-allotment/annual-review/'+id)
    },'id.applicant.onlinePayment')
    const saveNotice = valid => submit(valid,async () => {
      const values = { userCompliance:model.userCompliance, appealGround:model.appealGround, remark:model.remark, document:model.document, documentDesc:model.documentDesc, appealDate:filter('date',model.appealDate,'yyyy-MM-dd') }
      const response = await saveNoticeWorkflow(params.mode,params.id,values,model.noticeData)
      if (params.mode === 'appeal-zo') navigate('/applicant/land-allotment/appeal-review/'+response.id)
      else navigate('/applicant/land-allotment/notices')
    })
    for (const action of ['enterCompliance','addAppeal','addAppealForIC','enterConditionalComplianceZO','enterConditionalComplianceIC']) model[action]=saveNotice
    return model
  })
  state.locale=locale
  state.renderTable = node => <LandReferenceTable name={name} node={node} state={state} />
  useEffect(() => {
    if (tables[name]) return
    const abort = new AbortController()
    async function load() {
      state.busy=true; render()
      try {
        if (name === 'applicantAnnualPayment') state.applicantData = await loadAnnualPayment(params.applicantId,params.landId,abort.signal)
        else if (name === 'viewAnnualPaymentHistory') state.historyList = await fetchAnnualHistory(params.applicantId,abort.signal)
        else if (name === 'viewAnnualPaymentDetails') state.paymentData = await fetchAnnualDetail(params.paymentId,abort.signal)
        else if (params.mode) {
          const result = await loadNoticeWorkflow(params.mode,params.id,params.decisionId,abort.signal)
          if (params.mode.startsWith('conditional-') || params.mode.startsWith('decision-')) {
            state.hearingData=result.data
            state.conditionalData=result.data['appealConditionalDecision'+(params.mode.endsWith('zo')?'ZO':'IC')+'Bean'] || {}
          } else if (params.mode === 'hearing') state.appealHearingData={...result.data,caseDecisionDate:result.data.decisionDate}
          else if (params.mode.startsWith('view-')) { state.appealData=result.data; state.hearingList=result.hearings }
          else {
            state.noticeData=result.data
            state.noticeData.appealFees=({ Micro:2000,Small:2000,Medium:5000,Large:10000 }[result.data.proposedVenture] || 0).toFixed(2)
            state.appealDate=filter('date',new Date(),'dd/MM/yyyy')
          }
        }
      } catch (error) { if (!abort.signal.aborted) state.error=error.message }
      finally { if (!abort.signal.aborted) { state.busy=false; render() } }
    }
    load()
    return () => abort.abort()
  },[name,params.applicantId,params.landId,params.paymentId,params.mode,params.id,params.decisionId,state])
  return <div className="land-reference-page" data-view={name}>
    {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
    {(state.busy || state.saving) && <div role="status">Loading....</div>}
    <IndustrialView name={name} state={state} />
  </div>
}
