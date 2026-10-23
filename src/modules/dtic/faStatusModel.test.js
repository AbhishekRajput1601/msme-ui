import { test } from 'node:test'
import assert from 'node:assert/strict'
import { loadFaStatusApplications, groupApplicationsByStatus, filterFaApplications } from './faStatusModel.js'

const config = { endpoint: 'fetchpendingapplicants/Unit', columns: ['applicationId', 'status'] }
const row = id => ({ applicationId: String(id), currentStatusId: id % 2, status: id % 2 ? 'Pending' : 'Returned' })
const signal = () => new AbortController().signal

test('advances by requested page size across short and empty permission-filtered pages', async () => {
  const offsets = []
  const pages = { 0: [row(1), row(2)], 100: [], 200: [row(3)] }
  const rows = await loadFaStatusApplications(async (_method, _url, params) => {
    offsets.push(params.iDisplayStart)
    return { aaData: pages[params.iDisplayStart], iTotalDisplayRecords: 250 }
  }, config, signal())
  assert.deepEqual(offsets, [0, 100, 200])
  assert.equal(rows.length, 3)
  assert.equal(groupApplicationsByStatus(rows).find(group => group.label === 'Pending').count, 2)
  assert.equal(filterFaApplications(rows, 'id:0').length, 1)
})

test('accepts visible records exceeding the reported total and deduplicates IDs', async () => {
  const rows = await loadFaStatusApplications(async () => ({
    aaData: [row(1), row(2), row(2)], iTotalDisplayRecords: 1,
  }), config, signal())
  assert.equal(rows.length, 2)
})

test('loads all pages of an ordinary paginated response', async () => {
  const source = Array.from({ length: 125 }, (_, index) => row(index))
  const rows = await loadFaStatusApplications(async (_method, _url, params) => ({
    aaData: source.slice(params.iDisplayStart, params.iDisplayStart + params.iDisplayLength), iTotalDisplayRecords: 125,
  }), config, signal())
  assert.equal(rows.length, 125)
})

test('rejects malformed responses and propagates failed requests', async () => {
  await assert.rejects(loadFaStatusApplications(async () => ({ aaData: null, iTotalDisplayRecords: 0 }), config, signal()))
  await assert.rejects(loadFaStatusApplications(async () => { throw new Error('Network error') }, config, signal()), /Network error/)
})

test('loads unique plots with area filters and filters by land status and plot search', async () => {
  const plots = [
    { vacantLandId: 1, plotNumber: 'A-1', status: 'Hold' },
    { vacantLandId: 2, plotNumber: 'A-2', status: 'Release' },
  ]
  const rows = await loadFaStatusApplications(async (_method, _url, params) => {
    assert.equal(params.industrialArea, '42')
    return { aaData: [...plots, plots[0]], iTotalDisplayRecords: 2 }
  }, config, signal(), { idField: 'vacantLandId', params: { industrialArea: '42' } })
  assert.equal(rows.length, 2)
  assert.equal(groupApplicationsByStatus(rows).length, 2)
  assert.deepEqual(filterFaApplications(rows, 'label:Hold', 'A-1'), [plots[0]])
  assert.equal(filterFaApplications(rows, 'label:Release', 'A-1').length, 0)
})
