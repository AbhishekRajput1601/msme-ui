import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createServer } from 'vite'
import { fixture } from './dtic-ox-fixtures.mjs'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
const alerts = [], writes = []
globalThis.alert = text => alerts.push(text)
globalThis.window = { alert: globalThis.alert, confirm: () => true }
try {
  const { createOxState } = await server.ssrLoadModule('/src/modules/dtic/ox/oxModel.js')
  const { default: views } = await server.ssrLoadModule('/src/modules/dtic/ox/generated/views.json')
  const { expressions } = await server.ssrLoadModule('/src/modules/dtic/ox/generated/expressions.js')
  const inventory = JSON.parse(fs.readFileSync('artifacts/dtic-ox/inventory.json'))
  const flatten = nodes => nodes.flatMap(n => [n, ...flatten(n.children || [])])
  const abort = new AbortController()
  for (let n = 1; n <= 4; n++) {
    const state = createOxState({ number:n, locale:'en', notify(){}, signal:abort.signal, transport:async config => {
      if (config.method === 'post') writes.push(structuredClone(config))
      return { data:fixture(new URL(config.url,'http://test'),config.method.toUpperCase()), status:200 }
    } })
    const name = `dtic/ox${n}Form`
    const nodes = flatten(views[name])
    const fields = nodes.filter(node => ['input','textarea','select'].includes(node.tag))
    assert.equal(fields.length,inventory[name].fields.length)
    assert.deepEqual(fields.map(node => node.model), inventory[name].fields.map(attrs => attrs['data-ng-model'] || attrs['ng-model']))
    for (const event of inventory[name].events) for (const [,action] of event.matchAll(/\b(\w+)\(/g)) {
      assert.equal(typeof state[action],'function',`${name}: missing ${action}`)
    }
    for (const node of nodes.filter(node => node.repeat && node.init != null)) {
      const source = String(expressions[node.init])
      for (const alias of node.indexAliases || []) assert(source.includes(alias))
    }
    await state[`fetchOx${n}FormDetails`]()
    const data = state[`ox${n}Data`], row = data[`ox${n}BeanList`][0], detail = row[`ox${n}DetailsBeans`][0]
    if (n === 1) {
      state.calculateTotalAvailable1(row); state.calculateClosingStock1(row); state.calculateTotalQty1(data.ox1BeanList)
      assert.equal(row.totalAvailable,'15.000'); assert.equal(row.closingStock,'12.000'); assert.equal(state.totalQty,'3.000')
      detail.supplyQty = 16; state.checkSupplyQty1(data,row,detail)
      assert.equal(detail.supplyQty,''); assert.equal(row.closingStock,'15.000')
    } else if (n === 2 || n === 3) {
      state[`calculateClosingStockDTypeOx${n}`](row); state[`calculateClosingStockBTypeOx${n}`](row)
      assert.equal(n === 2 ? row.dtypeClosing : row.closingStockDType,13)
      assert.equal(n === 2 ? row.btypeClosing : row.closingStockBType,22)
      detail.dtype = 16; state[`validateSuppliedDTypeOx${n}`](row,detail); assert.equal(detail.dtype,'')
    } else {
      state.calculateClosingStockDType(row); state.calculateClosingStockBType(row)
      assert.equal(row.dtypeClosing,13); assert.equal(row.btypeClosing,22); assert.equal(row.closingStockM3,124)
    }
    const list = row[`ox${n}DetailsBeans`]
    state.addEntry(list); assert.equal(list.length,2)
    state[n === 1 ? 'removeEntry' : `removeEntryOx${n}`](0,1,list); assert.equal(list.length,1)
    state.checkCurrentDate('01/01/2000'); assert.equal(state.isNotCurrent,true)
    const count = writes.length
    state[`saveOX${n}Form`](true); assert.equal(writes.length,count,'Historical entries are locked')
    state.checkCurrentDate(new Date().toLocaleDateString('en-GB')); assert.equal(state.isNotCurrent,false)
    state[`saveOX${n}Form`](false); assert.equal(writes.length,count,'Invalid forms cannot post')
    const save = state[`saveOX${n}Form`](true)
    state[`saveOX${n}Form`](true)
    await save
    assert.equal(writes.length,count+1,'No duplicate submissions')
    assert.equal(writes.at(-1).url,`/dtic/saveOX${n}Form`)
    assert.equal(state.saved,n !== 1)
    state.checkSupplyQty({supplyQty:3})
  }
  const { createInfrastructureState } = await server.ssrLoadModule('/src/modules/dtic/infrastructure/infrastructureModel.js')
  const { configureLandRecords } = await server.ssrLoadModule('/src/modules/dtic/infrastructure/landRecords.js')
  const { resolveLegacyHashRoute } = await server.ssrLoadModule('/src/routes/roleRoutes.js')
  const calls = []
  const land = createInfrastructureState({params:{id:'7'},locale:'en',signal:abort.signal,notify(){},navigate(){},transport:async config => {
    calls.push(config)
    return {data:[{applicationId:'A1'}],status:200}
  }})
  configureLandRecords(land)
  land.fetchDticWiseCompleteDataOfLandApplicant()
  assert.equal(land.errorMessage,'Please select month and year')
  assert.equal(calls.length,0)
  land.month='01'; land.year='2026'
  await land.fetchDticWiseCompleteDataOfLandApplicant()
  assert.equal(land.dticResponseObject[0].applicationId,'A1')
  assert.deepEqual(calls.at(-1).params,{month:'01',year:'2026'})
  await land.esignPaymentPendencyReportBean()
  assert.equal(calls.at(-1).url,'/dtic/fetchEsignPaymentPendencyReport')
  land.legacyData.industrialAreaId='9'; land.legacyData.purpose='Industry'
  assert.equal(Object.keys(land.tableParams()).length,8)
  assert.equal(land.tableParams().industrialArea,'9')
  assert.equal(land.tableParams().purpose,'Industry')
  land.viewLegacyForm={$invalid:true}
  const before=calls.length
  land.saveLegacyData()
  assert.equal(calls.length,before,'Invalid legacy edits cannot post')
  for (const route of ['ox1Form','ox2Form','ox3Form','ox4Form','legacyData','completeDataOfLandApplicant','esignPaymentPendencyReport']) {
    assert.equal(resolveLegacyHashRoute('/mpmsme/dtic/home','#'+route),'/department/dtic/'+route)
  }
  abort.abort()
  assert(alerts.length >= 3)
  console.log('PASS: all 74 fields and bound actions, stock totals, cylinder limits, add/remove, historical locks, invalid and duplicate submissions, exact save endpoints.')
} finally { await server.close() }
