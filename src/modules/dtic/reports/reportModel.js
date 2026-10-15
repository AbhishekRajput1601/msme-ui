import { dticRequest, dticDocument } from '../dticService'

// Same actions, parameters, visibility conditions and downloads as DTICMSMEController.
export function createReportState({ locale, notify, signal, request = dticRequest, open = url => window.open(url, '_blank', 'noopener') }) {
  const state = { locale, notify, initialized: new Set(), initializePerInstance: true, preserveHeading: true, responseObject: {}, listVersion: 0 }
  let revision = 0
  async function search(endpoint, property) {
    const current = ++revision
    state.errorMessage = ''; state[property] = ''; state.busy = false
    if (!state.fromDateInput || !state.toDateInput) { state.errorMessage = 'Please enter date'; notify(); return }
    state.busy = true; notify()
    try {
      const data = await request('get', endpoint, { fromDate: state.fromDateInput, toDate: state.toDateInput }, signal)
      if (!signal.aborted && current === revision) { state[property] = data; state.listVersion++ }
    } catch (error) {
      if (!signal.aborted && current === revision) state.errorMessage = error.message
    } finally {
      if (!signal.aborted && current === revision) { state.busy = false; notify() }
    }
  }
  state.searchServiceReport = () => search('fetchserviceenterprisereport', 'reportData')
  state.searchProductionReport = () => search('fetchmanufacturingenterprisereport', 'reportData')
  state.validateReportForm = () => search('validatemicrolevelreportform', 'responseObject')
  for (const kind of ['ServiceEnterprise', 'ManufacturingEnterprise', 'MicroLevel', 'SmallLevel', 'MediumLevel']) {
    state['download'+kind+'Report'] = () => {
      state.errorMessage = ''
      if (!state.fromDateInput || !state.toDateInput) { state.errorMessage = 'Please enter date'; notify(); return }
      const dates = [state.fromDateInput, state.toDateInput].map(value => encodeURIComponent(value.replaceAll('/', '-'))).join('/')
      open(dticDocument('download'+kind.toLowerCase()+'report/'+dates))
    }
    // The mounted React table owns paging and loading, replacing the jQuery initializer.
    state['fetch'+kind+'ApplicantList'] = () => {}
  }
  return state
}
