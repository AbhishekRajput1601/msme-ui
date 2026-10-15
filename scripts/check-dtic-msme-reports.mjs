import assert from 'node:assert/strict'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { createReportState } = await server.ssrLoadModule('/src/modules/dtic/reports/reportModel.js')
  const calls = [], downloads = []
  let fail = false
  const state = createReportState({locale:'en',notify(){},signal:new AbortController().signal,
    request:async (...args) => { calls.push(args); if(fail) throw new Error('Invalid date range'); return {successMessage:'Success'} },
    open:url=>downloads.push(url)})
  await state.validateReportForm()
  assert.equal(state.errorMessage,'Please enter date')
  assert.equal(calls.length,0)
  state.fromDateInput='01/04/2026';state.toDateInput='30/04/2026'
  for (const [action,endpoint] of [['validateReportForm','validatemicrolevelreportform'],['searchServiceReport','fetchserviceenterprisereport'],['searchProductionReport','fetchmanufacturingenterprisereport']]) {
    await state[action]()
    assert.equal(calls.at(-1)[1],endpoint)
    assert.deepEqual(calls.at(-1)[2],{fromDate:'01/04/2026',toDate:'30/04/2026'})
  }
  for (const kind of ['ServiceEnterprise','ManufacturingEnterprise','MicroLevel','SmallLevel','MediumLevel']) {
    state['download'+kind+'Report']()
    assert.equal(downloads.at(-1),'/mpmsme/dtic/download'+kind.toLowerCase()+'report/01-04-2026/30-04-2026')
  }
  fail=true
  await state.validateReportForm()
  assert.equal(state.errorMessage,'Invalid date range')
  assert.equal(state.responseObject,'')
  assert.equal(state.busy,false)
  const {default:tables}=await server.ssrLoadModule('/src/modules/dtic/reports/generated/tables.json')
  for(const table of Object.values(tables)) {
    assert.equal(table.columns.length,18)
    assert.deepEqual(table.columns.slice(9,13),['nicCode','productionDate','prodClassification','prodName'])
  }
  console.log('PASS: required dates, three query endpoints, server validation, five downloads and all report columns.')
} finally { await server.close() }
