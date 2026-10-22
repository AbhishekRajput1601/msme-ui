import { installFaActions } from './generated/faActions'
import { createDticRequests, dticDocument, dticLink, dticRequest } from './dticService'
import { filter } from '../industrial-unit/viewHelpers'
import extraActions from './generated/extraActions'
import toast from '../../utils/toast'

export function createDticState({ params, navigate, notify, signal, locale, controller = 'DTICFAController' }) {
  const isApparel = params.establishmentType ? /apparel|institute/i.test(params.establishmentType) : (typeof window !== 'undefined' && /apparel/i.test(window.location.pathname))
  const establishmentType = params.establishmentType || (isApparel ? 'Institution' : 'Unit')
  const applicationId = params.applicationId || params.applicationIds || params.applicantId
  const applicantId = params.applicantId || applicationId
  const state = {
    params, locale, notify, initialized: new Set(), initializePerInstance: true, preserveHeading: true,
    faData: { faIndustrialUnitBean: {}, faRequiredAssistanceBean: { selectedOptions: {} } },
    faData2: {}, responseObject: {}, applicationId, applicantId, establishmentType,
    listVersion: 0, error: '', busy: false, saving: false,
    resolveLink: dticLink, documentPath: dticDocument,
  }
  const request = createDticRequests(state, signal)
  // Angular created the model through ng-model; React needs it before field initializers run.
  if (controller === 'DTICMSMEController') {
    state.msmeDetailData = { activityDetailsList: [{}], udyogAadhaar: 'no' }
    // The legacy handler lives in the audit controller, but the MSME form uses it.
    state.previousRegistrationValueRequired = false
    state.onPreviousRegistrationNameChange = () => {
      const name = state.msmeDetailData.previousRegistrationName
      state.previousRegistrationValueRequired = Boolean(name && name !== 'NONE')
    }
  } else if (controller === 'DTICBudgetPlanningController') {
    state.budgetData = { planningSchemeAmountBeans: [{}] }
    state.budgetList = []
    state.tableArray = []
    state.document = {}
    state.documentDesc = []
    state.fyList = []
    state.quarterList = []
    state.financialYearId = params.financialYearId || '0'
    state.quarterId = params.quarterId || '0'
  } else if (controller === 'CommonController') {
    state.letterData = {}
    state.requestProcessBean = {}
    state.statusList = []
    state.assignedToSectionList = []
    state.hearingList = []
    state.assigneeList = []
    state.letterId = params.letterId || ''
    state.responseObject = {}
  } else if (controller === 'DTICController') {
    state.supplierInfoData = { status: 'INACTIVE', external: 'N' }
    state.supplyNameBean = { status: 'INACTIVE' }
    state.opData = {}
    state.districts = []
    state.supplierTypes = []
    state.supplyTypes = []
    state.respondentStates = []
    state.states = []
    state.tehsils = []
    state.permanentDistricts = []
    state.permanentTehsils = []
    state.officeTypeList = []
    state.officesList = []
    state.categories = []
    state.designationList = []
    state.genderList = []
    state.responseObject = {}
    state.previewFile = file => {
      if (file && file instanceof Blob) {
        const reader = new FileReader()
        reader.onload = e => {
          state.profileImageStr = e.target.result
          const img = document.querySelector('#imgProfile, #profile_pic, #userProfilePic, .profile-img, img[alt*="profile" i]')
          if (img) img.src = e.target.result
          notify()
        }
        reader.readAsDataURL(file)
      }
    }
  }
  const navigation = {
    open: url => window.open(dticDocument(url), '_blank', 'noopener'),
    confirm: message => window.confirm(message),
    alert: message => toast.info(message),
    location: { set href(value) { navigate(dticLink(value)) } },
  }
  const install = extraActions[controller] || installFaActions
  install(state, {
    request, navigation, params,
    loading: { start() { state.busy = true; notify() }, finish() { state.busy = false; notify() } },
    format: name => (value, pattern) => name === 'IND' ? Number(value || 0).toFixed(2) : filter(name, value, pattern),
    later: (fn, delay) => setTimeout(() => { if (!signal.aborted) { fn(); notify() } }, delay),
    dom: selector => Object.assign([...document.querySelectorAll(selector)], { modal() { state.eligibleModal = false; notify() } }),
  })
  async function perform(action) {
    if (state.saving) return
    state.saving = true; state.error = ''; notify()
    try { return await action() }
    catch (error) {
      if (!signal.aborted) {
        state.error = error.message
        toast.error(error.message || 'Operation failed.')
      }
    }
    finally { state.saving = false; if (!signal.aborted) notify() }
  }
  if (controller === 'DTICMSMEController') {
    state.addMSMEDetailFunction = (form, valid, files) => {
      if (!valid) {
        state.error = 'The MSME record has not been saved. Complete all required fields and correct the highlighted values.'
        notify()
        return
      }
      return perform(async () => {
        const message = await dticRequest('get', 'getMessage/common.confirmToSave', undefined, signal)
        if (!navigation.confirm(message?.value || 'Save MSME details?')) return
        const data = state.msmeDetailData
        const reservedEmployment = ['msmeMpScEmptGen', 'msmeMpStEmptGen', 'msmeMpObcEmptGen']
          .reduce((sum, key) => sum + Number(data[key] || 0), 0)
        if (reservedEmployment > Number(data.totalEmployments)) {
          throw new Error('Employment given to MP SC, ST and OBC candidates cannot exceed total employment. The record has not been saved.')
        }
        const saved = await dticRequest('post', 'addmsmedetail', data, signal)
        if (!saved?.successMessage || !/^[1-9]\d*$/.test(String(saved.id))) {
          throw new Error('The server did not confirm a saved MSME record. Check the applications list before submitting again.')
        }
        state.responseObject = saved
        // Preserve the saved identity if an upload fails and the form stays open.
        state.msmeDetailData.msmeDetailId = saved.id
        const persisted = await dticRequest('get', 'fetchmsmedetailbyid', { msmeDetailId: saved.id }, signal)
        if (String(persisted?.msmeDetailId) !== String(saved.id)) {
          throw new Error(`The server reported MSME record ${saved.id} saved, but it could not be verified. Check the applications list before submitting again.`)
        }
        if (files?.employmentGivenUpload) {
          const body = new FormData()
          body.append('employmentGivenUpload', files.employmentGivenUpload)
          body.append('msmeDetailId', saved.id)
          try {
            const uploaded = await dticRequest('post', 'uploadMsmeDetailDocument', body, signal)
            if (!uploaded?.successMessage) throw new Error('The server did not confirm the document upload.')
          } catch (error) {
            throw new Error(`MSME record ${saved.id} was saved, but its document upload failed: ${error.message} Open the existing record to retry the upload; do not add it again.`)
          }
        }
        toast.success(`MSME record ${saved.id} saved successfully. Search by registration number if it is not on the first page.`)
        navigate(dticLink('viewapplicationlist'), { state: { msmeSavedMessage: `MSME record ${saved.id} saved successfully.` } })
      })
    }
  }
  state.IdList ||= []
  state.downloadDocument = id => navigation.open(`downloaddocument/${encodeURIComponent(id)}`)
  state.generateExcel ||= type => navigation.open(`generateExcelNewMeetingAgenda/${type || state.establishmentType || 'Unit'}/${(state.IdList || []).join(',')}`)
  Object.assign(state, {
    goBackToBatch: () => navigate('/department/dtic/dticfapendingapplicantsunit'),
    doTheBack: () => navigate(-1),
    loadPendingApplicantList: () => { state.listVersion++; notify() },
    closeAgenda: () => { state.agendaOpen = false; notify() },
    onCheckBoxSelected() {
      const data = state.faData.faRequiredAssistanceBean
      data.anySelected = Object.values(data.selectedOptions || {}).some(Boolean)
    },
    inlineAction(action) {
      if (/history.back/.test(action)) navigate(-1)
      else if (/print/.test(action)) window.print()
      else if (/cancelPopup/.test(action)) state.closeAgenda()
      else if (/createBatchForward|generateMeetingAgenda/.test(action)) { /* handled by modal */ }
      else throw new Error('Unrecognized DTIC action: ' + action)
    },
    async selectApplication(id, selected) {
      if (!selected) { state.IdList = state.IdList.filter(value => value !== id); notify(); return }
      if (!state.IdList.includes(id)) state.IdList.push(id)
      await perform(async () => {
        const previous = await dticRequest('get', 'getPreviousApplicationData', { applicationId: id }, signal)
        if (!Array.isArray(previous)) throw new Error('The server returned invalid application history.')
        if (previous.length) state.IdList = previous.map(row => row.applicationId)
        state.agendaRows = previous.length ? await dticRequest('get', 'agendaRows', { applicationIds: state.IdList.join(',') }, signal) : []
        state.agendaOpen = true
      })
    },
    acceptApplication: id => perform(async () => {
      const response = await dticRequest('post', 'updateStatus', new URLSearchParams({ applicationId: id, status: 'accepted' }), signal)
      if (!response.successMessage) throw new Error('The server did not confirm application acceptance.')
      state.responseObject = response; state.listVersion++
    }),
    forwardBatch: ({ appData, letterNo, date, file }) => perform(async () => {
      const body = new FormData()
      for (const [key, value] of Object.entries({ applicationIds: state.IdList.join(','), establishmentType: 'Unit', coveringLetterNo: letterNo, coveringLetterDate: date, coveringLetter: file, appData: JSON.stringify(appData) })) body.append(key, value)
      const response = await dticRequest('post', 'forwardBatch', body, signal)
      if (!response.successMessage) throw new Error('Could not create batch.')
      state.responseObject = { successMessage: `Batch ${response.successMessage} created and forwarded to Secretary.` }
      state.agendaOpen = false; state.IdList = []; state.listVersion++
    }),
    downloadAction(action, id) {
      const types = { downloadDLCLetter: 'FA_UNIT_COMMITTEE_NOTESHEET', downloadRejectionLetter: 'FA_UNIT_ZONAL_NOTESHEET', downloadSanctionDocuments: 'FA_ACCEPTANCE_LETTER_RELEASED', downloadZonalDecisionLetter: 'FA_ACCEPTANCE_LETTER_RELEASED', downloadDisbursementLetter: 'FA_DISBURSEMENT_LETTER_RELEASED' }
      if (types[action]) navigation.open(`downloadfadocument/${types[action]}/${encodeURIComponent(id)}`)
      else if (action === 'downloadCollectorSignedDoc') navigation.open(`downloadCollectorSignedDoc/${encodeURIComponent(id)}`)
      else if (action === 'downloadAcceptanceLetter') navigation.open(`downloadacceptanceletter/${encodeURIComponent(id)}`)
      else if (action === 'downloadPrapatra') navigation.open(`downloadprapatra/${encodeURIComponent(id)}`)
      else throw new Error('Unrecognized download: ' + action)
    },
  })
  // Prevent invalid or duplicate submissions before calling the original rules.
  for (const name of ['raiseQueryByDtic', 'addInspectionStatus', 'addCommitteeStatus', 'addCommitteesStatus', 'addZonalStatus', 'uploadDisbursementOrder', 'uploadOtherDocument', 'addFAMSMEDetailUnitFunction', 'addFAMSMEDetailUnitForSanction', 'addFAMSMEDetailApparelFunction', 'addDTICHeadsDemandBudget', 'updateDTICHeadsDemandBudget', 'updateDTICHeadsUsesSurrenderBudget']) {
    const action = state[name]
    if (action) state[name] = (valid, ...args) => { if (valid && !state.saving) return action(valid, ...args) }
  }
  return state
}
