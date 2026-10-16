import assert from 'node:assert/strict'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true } })
try {
  const { default: http } = await server.ssrLoadModule('/src/api/httpClient.js')
  const { createIndustrialState } = await server.ssrLoadModule('/src/modules/industrial-unit/industrialUnitModel.js')
  const requests = []
  const tehsils = [{ key: 42, value: 'Test Tehsil' }]
  http.defaults.adapter = async config => {
    requests.push(config)
    return { data: tehsils, status: 200, statusText: 'OK', headers: {}, config }
  }
  const state = createIndustrialState({ params: {}, navigate() {}, notify() {}, signal: new AbortController().signal, locale: 'en' })
  state.UnitAddressDetailsBean = { districtId: '12', blockId: '1027', tehsilId: 'old' }
  await state.getTehsils('1027')
  assert.equal(requests[0].url, '/applicant/fetchdistricttehsilmapbydistrictid')
  assert.deepEqual(requests[0].params, { districtId: '12' })
  assert.deepEqual(state.tehsils, tehsils)
  assert.equal(state.UnitAddressDetailsBean.tehsilId, '')

  state.UnitAddressDetailsBean.districtId = ''
  await state.getTehsils('1027')
  assert.equal(requests.length, 1, 'Do not fetch without a selected district')
  assert.deepEqual(state.tehsils, [])

  let complete
  http.defaults.adapter = config => new Promise(resolve => { complete = () => resolve({ data: tehsils, status: 200, statusText: 'OK', headers: {}, config }) })
  state.UnitAddressDetailsBean.districtId = '12'
  const pending = state.getTehsils('1027')
  await new Promise(resolve => setImmediate(resolve))
  state.UnitAddressDetailsBean.districtId = '13'
  complete()
  await pending
  assert.deepEqual(state.tehsils, [], 'Ignore results for a previously selected district')
  console.log('Unit Address tehsil checks passed.')
} finally {
  await server.close()
}
