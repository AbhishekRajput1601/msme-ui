import test from 'node:test'
import assert from 'node:assert/strict'
import { applicationDistrictKey, groupApplicationsByDistrict, filterFaApplications, loadFaStatusApplications } from '../dtic/faStatusModel.js'

test('groups infrastructure applications by district identity and handles missing districts', () => {
  const rows = [
    { districtId: 1, districtName: 'Bhopal' },
    { districtId: '1', districtName: 'Bhopal' },
    { districtId: 2, districtName: 'Indore' },
    {},
  ]
  const groups = groupApplicationsByDistrict(rows)
  assert.equal(groups.find(group => group.key === 'id:1').count, 2)
  assert.equal(groups.find(group => group.label === 'District unavailable').count, 1)
  assert.equal(rows.filter(row => applicationDistrictKey(row) === 'id:2').length, 1)
})

test('loads all infrastructure pages using their id and searches applicant fields', async () => {
  const rows = Array.from({ length: 101 }, (_, id) => ({ id, applicantName: `Enterprise ${id}`, districtName: 'Bhopal' }))
  const loaded = await loadFaStatusApplications(async (_method, _endpoint, params) => ({
    aaData: rows.slice(params.iDisplayStart, params.iDisplayStart + params.iDisplayLength),
    iTotalDisplayRecords: rows.length,
  }), { endpoint: 'fetchInfrastructureList', columns: ['id', 'applicantName'] }, new AbortController().signal, { idField: 'id' })
  assert.equal(loaded.length, 101)
  assert.equal(filterFaApplications(loaded, 'all', 'Enterprise 100')[0].id, 100)
})
