import { get, upload } from '../../../../api/httpClient'
import { dataTable, jsonData } from '../../../../api/responseData'
import { requireSaveSuccess } from '../landApplicationModel'
import { fetchLandPage } from './landApplicationService'
import { toLegacyDataTablesParams } from './idApplicantService'

const part = encodeURIComponent
export const noticeModes = {
  compliance: ['Enter notice compliance', 'id/enterCompliance', 'id/loadNoticeDetails', 'enterCompliance'],
  notice: ['Notice and compliance history', 'id/viewCompliance', 'id/loadNoticeDetails'],
  'appeal-zo': ['Appeal to ZO', 'id/newAppeal', 'id/loadNoticeDetails', 'addAppeal'],
  'appeal-ic': ['Appeal to IC', 'id/newAppealForIC', 'id/loadNoticeDetails', 'addAppealForIC'],
  'view-zo': ['ZO appeal', 'id/viewAppeal', 'id/loadAppealDetails'],
  'view-ic': ['IC appeal', 'id/viewAppealForIC', 'id/loadAppealDetails'],
  hearing: ['Appeal hearing', 'id/viewAppealHearing', 'loadAppealHearingDetails'],
  'conditional-zo': ['ZO conditional compliance', 'id/viewEnterConditionalComplianceZO', 'id/fetchHearingDetails', 'enterConditionalComplianceZO'],
  'conditional-ic': ['IC conditional compliance', 'id/viewEnterConditionalComplianceIC', 'id/fetchHearingDetails', 'enterConditionalComplianceIC'],
  'decision-zo': ['ZO conditional decision', 'viewConditionalDecisionZO', 'id/fetchHearingDetails'],
  'decision-ic': ['IC conditional decision', 'viewConditionalDecisionIC', 'id/fetchHearingDetails'],
}

export function noticeActions(row) {
  const n = row.idNoticeBean
  if (!n?.noticeId) return []
  const status = Number(row.statusId), ns = Number(n.statusId), actions = []
  const add = (mode, id, label, suffix = '') => actions.push({ href: `/applicant/land-allotment/notices/${mode}/${part(id)}${suffix}`, label })
  if (ns === 16 && Number(n.noticeDaysLeft) > 0) add('compliance', n.noticeId, `Enter compliance (${n.noticeDaysLeft} days remaining)`)
  else if ((ns === 17 && status === 17) || [15, 18].includes(status) || ns === 19) add('notice', n.noticeId, 'View notice history')
  for (const [role, requiredStatus, conditionalStatus] of [['zo', 17, 23], ['ic', 22, 32]]) {
    if (status === 15 && ns === requiredStatus) add(`appeal-${role}`, n.noticeId, `Appeal to ${role.toUpperCase()}`)
    else if (n[`${role}AppealId`]) add(`view-${role}`, n[`${role}AppealId`], `View ${role.toUpperCase()} appeal`)
    const appeal = n[`${role}AppealBean`], hearing = appeal?.finalDecisionHearingBean
    if (status === 15 && Number(appeal?.statusId) === conditionalStatus) {
      if (Number(hearing?.timeFrameDaysLeft) > 0) add(`conditional-${role}`, hearing.appealHearingId, `Enter ${role.toUpperCase()} conditional compliance`)
    } else if ([15, 18].includes(status)) {
      const decision = hearing?.[`appealConditionalDecision${role.toUpperCase()}Bean`]
      if (decision?.decisionId) add(`decision-${role}`, decision.appealHearingId, `View ${role.toUpperCase()} decision`, `/${part(decision.decisionId)}`)
    }
  }
  return actions
}

export async function fetchNoticeList(state) {
  return dataTable(await get('/applicant/fetchApplicationNoticeList', toLegacyDataTablesParams({ ...state, columnList: ['applicationId', 'fullName', 'submittedOn', 'vacantLandBean.industrialAreaName', 'vacantLandBean.plotNumber', 'status'] })))
}

export async function loadNoticeWorkflow(mode, id, decisionId, signal) {
  const config = noticeModes[mode]
  if (!config) throw new Error('Unknown notice workflow.')
  const page = await fetchLandPage(`${config[1]}/${part(id)}${decisionId ? `/${part(decisionId)}` : ''}`, signal)
  if (config[3] ? ![...page.forms].some(form => (form.getAttribute('data-ng-submit') || '').includes(`${config[3]}(`)) : !page.querySelector('.panel-body')) throw new Error('The server did not authorize this notice action.')
  const data = jsonData(await get(`/applicant/${config[2]}/${part(id)}`, {}, { signal }))
  if (Array.isArray(data)) throw new Error('Invalid notice details were returned.')
  if (mode.startsWith('decision-')) {
    const decision = data[`appealConditionalDecision${mode.endsWith('zo') ? 'ZO' : 'IC'}Bean`]
    if (!decision || String(decision.decisionId) !== String(decisionId)) throw new Error('The conditional decision does not match the selected record.')
  }
  const hearings = mode.startsWith('view-') ? jsonData(await get(`/applicant/id/loadAppealHearings/${part(id)}`, {}, { signal })) : []
  if (!Array.isArray(hearings)) throw new Error('Invalid hearing list was returned.')
  return { data, hearings }
}

export async function saveNoticeWorkflow(mode, id, values, context) {
  if (!noticeModes[mode]?.[3]) throw new Error('This notice action cannot be submitted.')
  const appeal = mode.startsWith('appeal-'), conditional = mode.startsWith('conditional-')
  const required = appeal ? 'appealGround' : 'userCompliance'
  const maxLength = appeal ? 400 : 3000
  if (!values[required]?.trim() || values[required].length > maxLength) throw new Error(`Enter ${appeal ? 'appeal grounds' : 'compliance details'} within ${maxLength} characters.`)
  if ((values.remark?.length || 0) > 3000 || (values.documentDesc?.length || 0) > 3000) throw new Error('Remarks and document descriptions cannot exceed 3000 characters.')
  const body = new FormData()
  body.append(conditional ? 'appealHearingId' : 'noticeId', id)
  body.append(required, values[required].trim())
  if (appeal) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(values.appealDate || '') || Number.isNaN(Date.parse(values.appealDate)) || new Date(values.appealDate).toISOString().slice(0, 10) !== values.appealDate) throw new Error('Enter a valid appeal date.')
    body.append('appealDate', values.appealDate.split('-').reverse().join('/'))
    body.append('appealType', mode === 'appeal-zo' ? 'ZO_APPEAL' : 'IC_APPEAL')
    if (mode === 'appeal-zo') {
      if (context.appealFees == null || !Number.isFinite(Number(context.appealFees)) || Number(context.appealFees) <= 0) throw new Error('The server did not return the appeal fee.')
      body.append('appealFees', context.appealFees)
    }
    if (values.remark) body.append('remark', values.remark)
  }
  const docKey = appeal ? 'document' : conditional ? 'userComplianceDocument' : 'complianceDocument'
  if (values.document) body.append(docKey, values.document)
  if (values.documentDesc) body.append(appeal ? 'documentDesc' : `${docKey}Desc`, values.documentDesc)
  const response = await upload(`/applicant/${appeal ? 'addAppeal' : noticeModes[mode][3]}`, body)
  if (!appeal) return requireSaveSuccess(jsonData(response))
  if (!/^[1-9]\d*$/.test(String(response))) {
    if (response && typeof response === 'object') jsonData(response)
    throw new Error('The server did not confirm that the appeal was saved.')
  }
  return { id: String(response), successMessage: 'Appeal saved.' }
}
