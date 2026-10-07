import { installReferenceActions } from './generated/referenceActions'
import { createRequests, getUnitData, saveUnitData } from './industrialUnitService'
import { backendPath, faPath, filter, parseDate } from './viewHelpers'

export function productionPolicy(value) {
  const date = parseDate(value)
  if (!date) return null
  if (date < new Date(2021, 7, 13)) return { year: '2021', flag: 'f1', message: 'Production Date is before 13-Aug-2021. Only 7 Assistances are applicable. Expansion / Technical Upgradation / Diversification cases only.' }
  if (date < new Date(2025, 1, 24)) return { year: '2025', flag: 'f2', message: 'Production Date falls between 13-Aug-2021 and 23-Feb-2025. Full 2021 assistance list and 7 assistances from 2025 policy are applicable.' }
  return { year: '2025', flag: 'f3', message: 'Production Date is on or after 24-Feb-2025. MP MSME Development Policy 2025 is applicable.' }
}

export function eligibility(investment, turnover) {
  if (investment === '' || turnover === '') throw new Error('Please enter both Investment Amount and Turnover Amount.')
  if (!Number.isFinite(Number(investment)) || !Number.isFinite(Number(turnover))) throw new Error('Please enter valid numeric values.')
  if (Number(investment) < 100000) throw new Error('Investment Amount must be at least ₹1,00,000.')
  if (Number(turnover) < 100000) throw new Error('Annual Turnover must be at least ₹1,00,000.')
  return Number(investment) > 1250000000 || Number(turnover) > 5000000000 ? 'mpidc' : 'unit'
}

export function amountWords(input) {
  let n = Math.floor(Number(input))
  if (!Number.isFinite(n) || n < 0) return ''
  if (n === 0) return 'Zero'
  const ones = ['', 'One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen']
  const tens = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety']
  const parts = []
  for (const [size, label] of [[1e9,'Arab'],[1e7,'Crore'],[1e5,'Lakh'],[1000,'Thousand'],[100,'Hundred']]) {
    if (n >= size) { parts.push(amountWords(Math.floor(n / size)) + ' ' + label); n %= size }
  }
  if (n >= 20) { parts.push(tens[Math.floor(n / 10)]); n %= 10 }
  if (n) parts.push(ones[n])
  return parts.join(' ')
}

const unitFiles = new Set(['gstSellDocUpload','employmentGivenUpload','permissionDocUpload','schemeDocUpload'])
export function createIndustrialState({ params, navigate, notify, signal, locale }) {
  const state = {
    faData: { faIndustrialUnitBean: { activityDetailsList: [{}], capitalInvestmentBeans: [], unitProductDetailsBeans: [{}], unitExpansionDetailsBeans: [] }, faRequiredAssistanceBean: { selectedOptions: {}, caExpInvDetailsBean: [{}], pharmaExpInvDetailsBeans: [{}] } },
    fileData: {}, cerfdata: { CertificationDetails: {} }, UnitAddressDetailsBean: {}, bankList1: [], unitList: [], sectorofinductryList: {},
    applicationId: params.applicationId, establishmentType: 'Unit', step: 1, maxStep: 1,
    disabled: true, finalSubmit: false, saveAsDraft: true, saveAndNext: false, formOpen: false, declarationAccepted: false,
    initialized: new Set(), locale, notify, busy: false, saving: false, error: '',
  }
  const navigation = {
    location: { set href(value) { navigate(faPath(value)) }, reload() { navigate(0) } },
    open(value, target) { window.open(backendPath(value), target, 'noopener') },
  }
  const dom = selector => {
    const nodes = [...document.querySelectorAll(selector)]
    // Removed conditional controls have no selected files.
    if (!nodes.length) nodes.push({ files: [] })
    return nodes
  }
  const loading = { start() { state.busy = true; notify() }, finish() { state.busy = false; normalize(); notify() } }
  function normalize() {
    const data = state.faData
    if (data?.faRequiredAssistanceBean) data.faRequiredAssistanceBean.selectedOptions ??= {}
    if (data?.schemeYear) state.schemeYear = data.schemeYear
    if (params.applicationId && data?.applicationId) {
      state.formOpen = true; state.declarationAccepted = true; state.maxStep = 3
      const policy = productionPolicy(data.faIndustrialUnitBean?.unitStartDate)
      if (policy) { state.f1 = false; state.f2 = false; state.f3 = false; state[policy.flag] = true }
    }
  }
  const refresh = () => { normalize(); notify() }
  const request = createRequests(state, refresh, signal)
  installReferenceActions(state, {
    request, loading, navigation, params, format: name => (value, pattern) => filter(name, value, pattern),
    later: (fn, delay) => setTimeout(() => { if (!signal.aborted) { fn(); refresh() } }, delay),
    commit: fn => { fn(); refresh() }, dom,
  })
  const get = (endpoint, query) => getUnitData(endpoint, query, signal)
  const post = (endpoint, data) => saveUnitData(endpoint, data, signal)
  async function save(operation) {
    if (state.saving) return
    state.saving = true; state.error = ''; notify()
    try { await operation() } catch (error) { if (!signal.aborted) state.error = error.message }
    finally { state.saving = false; state.busy = false; refresh() }
  }
  async function upload(endpoint, entries, extra = {}) {
    const files = Object.entries(entries).filter(([, value]) => value instanceof File)
    if (!files.length) return
    const body = new FormData()
    body.append('applicationId', state.faData.applicationId || params.applicationId || '')
    for (const [key,value] of Object.entries(extra)) if (value != null) body.append(key,value)
    for (const [key,value] of files) body.append(key,value)
    await post(endpoint, body)
  }
  Object.assign(state, {
    goBackToBatch: () => navigate('/applicant/financial-assistance'),
    fetchPanDetailsFromUserProfile: async () => { const profile = await get('fetchUserIndustrialDetails', { userId: '' }); state.faData.panNo = profile.panNo; refresh() },
    checkProductionDate() {
      const policy = productionPolicy(state.faData.faIndustrialUnitBean.unitStartDate)
      state.f1 = false; state.f2 = false; state.f3 = false; state.showPolicy = !!policy
      if (policy) { state[policy.flag] = true; state.policyMessage = policy.message; state.schemeYear = policy.year; state.faData.schemeYear = policy.year }
    },
    openForm() { state.formOpen = state.declarationAccepted },
    isNewUnitDisabled: () => { const date = parseDate(state.faData.faIndustrialUnitBean?.unitStartDate); return !!date && date < new Date(2021, 7, 13) },
    setSaveAndNext() { state.saveAsDraft = true; state.saveAndNext = true; state.finalSubmit = false },
    setFinalSubmit() { state.saveAsDraft = false; state.saveAndNext = false; state.finalSubmit = true },
    goToPreviousTab(_from, to) { state.step = Number(to.replace('#step','')); state.maxStep = state.step },
    reload() { state.UnitAddressDetailsBean = {}; state.faUnitAddressDetails = {}; refresh() },
    resetForm() { for (let i = 1; i <= 10; i++) state['doc'+i] = null; document.querySelectorAll('.industrial-unit-page input[type=file]').forEach(el => { el.value = '' }); state.isDisabled = false },
    getTehsils: async blockId => { state.tehsils = await get('fetchtehsilmapbyblock', { blockId }); refresh() },
    async setUnitDetails(id) {
      const unit = state.unitList.find(item => String(item.unitAddressId) === String(id))
      if (!unit) return
      for (const key of ['unitName','industrialArea','industrialAreaName','plotNos','areaInSqm','address1','address2','address3','pinCode','stateId','districtId','tehsilId','blockId']) state.faData[key] = unit[key] == null ? '' : String(unit[key])
      state.faData.presentAddMobileNo = unit.mobileNo
      if (unit.sectorOfInductry) state.faData.firmSector = unit.sectorOfInductry
      ;[state.districts, state.tehsils, state.blocks] = await Promise.all([get('fetchdistrictmapbystate',{stateId:unit.stateId}),get('fetchdistricttehsilmapbydistrictid',{districtId:unit.districtId}),get('fetchdistrictblockmapbydistrictid',{districtId:unit.districtId})])
      refresh()
    },
    async fetchAppliedAssistanceList(unitName, unitType) {
      const response = await get('fetchAppliedAssistance', { unitname: unitName, unitType })
      state.assistanceList = typeof response.value === 'string' ? JSON.parse(response.value) : response
      const tables = ['capital_assistance','quality_assistance','reimbursement_patents','infra_dev_exp_compensation','waste_mgmt_estb_exp_comp','energy_audit_assistance','powerloom_upgradation','pharma_lab_assistance',null,null,'freight_assistance_for_export','global_competitiveness','food_processing_unit','apparel_sector','textile_unit','footwear_furniture_toys_value_chain_product','boosting_circular_economy','motor_vehicle_scrapping_centre','logistics_warehousing_project','research_development_project','revival_sick_unit']
      for (let i = 1; i <= 21; i++) state['fs'+i] = !state.assistanceList.some(item => item.tables?.includes('fa_' + tables[i-1]))
      refresh()
    },
    async fetchZEDCertificationDetails(number) {
      if (!number) return window.alert('Please Enter Certificate Number')
      state.cerfdata = await get(`getcertifcateDetail/${encodeURIComponent(number)}/${encodeURIComponent(state.faData.udyamRegNo)}`)
      state.cerfdata.cerfnumber = number; state.isDisabled = true
      state.cerfdata.error = ['Invalid Details.', 'Something went worng'].includes(state.cerfdata.StatusMessage)
      refresh()
    },
    downloadFaDocuments: id => window.open(backendPath(`downloadFaDocumentByDocumentId/${encodeURIComponent(id)}`), '_blank', 'noopener'),
    downloadFaDocumentsByApplicant: id => window.open(backendPath(`downloadFaDocumentByDocumentId/${encodeURIComponent(id)}/${encodeURIComponent(params.applicationId)}`), '_blank', 'noopener'),
    downloadFADocument: code => window.open(backendPath(`downloadfadocument/${encodeURIComponent(code)}/${encodeURIComponent(params.applicationId)}`), '_blank', 'noopener'),
    previewFile(file, id) {
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => { state[id+'Preview'] = reader.result; refresh() }
      reader.readAsDataURL(file)
    },
    addFaIndustrialProfileDetails(valid) {
      if (!valid || !window.confirm('Are you sure you want to save the data?')) return
      return save(async () => {
        state.faData.schemeYear = state.schemeYear
        const response = await post('fa/addFaIndustrialProfileDetails', state.faData)
        if (!response.id) throw new Error('The server did not return an application ID.')
        state.faData.applicationId = response.id; state.responseObject = response
        state.step = 2; state.maxStep = Math.max(2, state.maxStep)
      })
    },
    addFaIndustrialUnitDetails(valid) {
      if (!state.validateUnit(valid) || !window.confirm('Are you sure you want to save the data?')) return
      return save(async () => {
        const unit = state.faData.faIndustrialUnitBean
        unit.applicationId = state.faData.applicationId; unit.schemeYear = state.schemeYear
        state.responseObject = await post('fa/addFaIndustrialUnitDetails', unit)
        await upload('uploadFaIndustrialUnitDocument', Object.fromEntries(Object.entries(state.fileData).filter(([key]) => unitFiles.has(key) && (key !== 'employmentGivenUpload' || state.schemeYear === '2021') && (key !== 'schemeDocUpload' || state.schemeYear === '2025'))))
        await state.fetchAppliedAssistanceList(state.faData.unitName, unit.unitType)
        if (state.saveAndNext) { state.step = 3; state.maxStep = Math.max(3,state.maxStep) }
      })
    },
    addFaIndustrialSchemeDetails: valid => saveScheme(valid, false),
    addFaTenCRIndustrialSchemeDetails: valid => saveScheme(valid, true),
    saveInfrastructure() {
      const mapping = ['applicationFileDoc','projectReportFileDoc','ownershipDoc','khasaraDoc','electricalInstallationFileDoc','approachRoadFileDoc','approachRoadNocDoc','waterEstimateDoc','landMapDoc','electricalInstallationMapDoc']
      const body = new FormData()
      for (let i = 1; i <= 10; i++) {
        const file = state['doc'+i]
        if (!file && [1,2,3,4,9].includes(i)) { window.alert('Please upload ' + mapping[i-1]); return }
        if (file?.size > 5242880) { window.alert('File size should not exceed 5 MB'); return }
        if (file) body.append(mapping[i-1], file)
      }
      return save(async () => { const response = await post('saveInfrstructureDevelopment', {}); if (!response.id) throw new Error('The server did not return an application ID.'); body.append('id',response.id); const result = await post('uploadInfrastructureDocument',body); state.responseObject = result; state.isDisabled = true; window.alert('Your application number is '+result.id) })
    },
    uploadFADocuments() {
      return save(async () => {
        const body = new FormData()
        body.append('applicationId', params.applicationId)
        for (const [name,file] of Object.entries(state.faData)) if (file instanceof File) body.append(name,file)
        state.responseObject1 = await post('addfaapplicantdocuments', body)
        if (state.responseObject1.successMessage) navigate('/applicant/financial-assistance')
      })
    },
  })
  function saveScheme(valid, tenCrore) {
    if (!(tenCrore ? state.validateTenCrore(valid) : state.validateScheme(valid)) || !window.confirm('Are you sure you want to save the data?')) return
    return save(async () => {
      const scheme = state.faData.faRequiredAssistanceBean
      scheme.applicationId = state.faData.applicationId
      const finalStatus = Number(state.faData.statusId) === 5 ? 11 : 2
      // Save attachments before final submission; an upload failure must not submit.
      const payload = { ...scheme }
      if (state.finalSubmit) delete payload.statusId
      state.responseObject = await post('fa/addFaIndustrialSchemeDetails', payload)
      const files = Object.fromEntries(Object.entries(state.fileData).filter(([key]) => !unitFiles.has(key)))
      await upload('uploadFaIndustrialSchemeDocument', files, scheme.selectedOptions)
      if (state.finalSubmit) {
        state.responseObject = await post('fa/addFaIndustrialSchemeDetails', { ...scheme, statusId: finalStatus })
        navigate('/applicant/financial-assistance')
      }
    })
  }
  return state
}
