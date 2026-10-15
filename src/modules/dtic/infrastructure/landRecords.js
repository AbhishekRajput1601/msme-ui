let spreadsheet
async function exportReport(filename) {
  spreadsheet ||= new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/legacy/vendor/dtic/xlsx.full.min.js'
    script.onload = () => resolve(window.XLSX)
    script.onerror = () => { spreadsheet = null; reject(new Error('Unable to load Excel export.')) }
    document.head.appendChild(script)
  })
  const XLSX = await spreadsheet
  const book = XLSX.utils.table_to_book(document.getElementById('dataTable'), { sheet: 'Sheet1' })
  XLSX.writeFile(book, filename)
}

export function configureLandRecords(state) {
  state.getYear()
  state.trackTouched = true
  const save = state.saveLegacyData
  state.saveLegacyData = () => { if (!state.saving && !state.viewLegacyForm?.$invalid) return save() }
  state.legacyDataList = () => { state.listVersion++; state.busy = false; state.notify() }
  state.tableParams = () => {
    const { industrialAreaId, ...filters } = state.legacyData
    return { industrialArea: industrialAreaId || '', ...filters }
  }
  for (const [action, endpoint, field] of [
    ['fetchDticWiseCompleteDataOfLandApplicant', 'fetchDticWiseCompleteDataOfLandApplicant', 'dticResponseObject'],
    ['esignPaymentPendencyReportBean', 'fetchEsignPaymentPendencyReport', 'esignResponseObject'],
  ]) state[action] = () => {
    state.errorMessage = ''; state[field] = []
    if (!state.month || !state.year) { state.errorMessage = 'Please select month and year'; state.notify(); return }
    state.busy = true; state.notify()
    return state.request.get(endpoint, { params: { month: state.month, year: state.year } }).then(response => { state[field] = response.data }).finally(() => { state.busy = false; state.notify() })
  }
  state.esignListExportToExcel = () => exportReport('esign_and_payment_pendency_report.xlsx')
  state.landApplicantListExportToExcel = () => exportReport('applicant_wise_complete_land_details.xlsx')
}

export const isLandRecord = name => /dticlegacyData|editViewLegacyData|dticViewEditLegacyData|completeDataOfLandApplicant|EsignPaymentPendencyReport/i.test(name)
