import assert from 'node:assert/strict'
import { createServer } from 'vite'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { createDticState } = await server.ssrLoadModule('/src/modules/dtic/dticModel.js')
  const { expressions } = await server.ssrLoadModule('/src/modules/dtic/generated/expressions.js')
  const { default: views } = await server.ssrLoadModule('/src/modules/dtic/generated/views.json')
  const { default: routes } = await server.ssrLoadModule('/src/modules/dtic/dticRoutes.js')
  const { workQueues, decisions, dashboardListCount, loadLandDashboardCounts } = await server.ssrLoadModule('/src/modules/dtic/dashboardModel.js')
  const { default: tables } = await server.ssrLoadModule('/src/modules/dtic/generated/tables.json')
  const { dticTableParams } = await server.ssrLoadModule('/src/modules/dtic/dticTableParams.js')
  const faRoute = routes.find(r => r.path === 'dticfapendingapplicantsunit')
  assert.equal(tables[faRoute.views.at(-1)].endpoint, 'fetchpendingapplicants/Unit')
  const landRoute = routes.find(r => r.path === 'dticLandAllotment')
  assert.equal(landRoute.views.at(-1), 'dtic/dticVacantLandList')
  const starts = []
  const landCounts = await loadLandDashboardCounts(async (method, endpoint, params) => {
    assert.equal(method, 'get')
    assert.equal(endpoint, 'fetchLandAllotmentList')
    assert.equal(params.industrialArea, '')
    starts.push(params.iDisplayStart)
    return { iTotalDisplayRecords: 3, aaData: params.iDisplayStart === 0
      ? [{ totalApplicationReceived: '2' }, { totalApplicationReceived: 0 }]
      : [{ totalApplicationReceived: 5 }] }
  })
  assert.deepEqual(starts, [0, 2])
  assert.deepEqual(landCounts, [['landPlots', 3], ['landApplications', 7]])
  assert.deepEqual(await loadLandDashboardCounts(async () => ({ iTotalDisplayRecords: 0, aaData: [] })), [['landPlots', 0], ['landApplications', 0]])
  await assert.rejects(loadLandDashboardCounts(async () => ({ iTotalDisplayRecords: 1, aaData: [{}] })))
  await assert.rejects(loadLandDashboardCounts(async (_method, _endpoint, params) => ({
    iTotalDisplayRecords: params.iDisplayStart === 0 ? 2 : 3, aaData: [{ totalApplicationReceived: 1 }],
  })))
  assert.equal(dashboardListCount({ aaData: [], iTotalDisplayRecords: 0, iTotalRecords: 184 }), 0)
  assert.equal(dashboardListCount({ aaData: [{}], iTotalDisplayRecords: '42', iTotalRecords: 184 }), 42)
  for (const data of [{ aaData: [{}] }, { aaData: [], iTotalDisplayRecords: 42 }, { aaData: [{}], iTotalDisplayRecords: 0 }, { aaData: [], iTotalDisplayRecords: null }]) {
    assert.throws(() => dashboardListCount(data))
  }
  const paths = ['viewtotalapplications', 'viewapplicationlist', ...workQueues.map(q => q.path), ...decisions.flatMap(d => [d.acceptedPath, d.rejectedPath])]
  for (const path of paths) {
    const route = routes.find(r => r.path === path)
    assert.ok(route, path)
    const config = tables[route.views.at(-1)]
    assert.ok(config, `${path}: dashboard uses the linked table configuration`)
    const pageParams = dticTableParams(config)
    const countParams = dticTableParams(config, { length: 1 })
    assert.deepEqual({ ...countParams, iDisplayLength: 10 }, pageParams)
    const state = createDticState({ params: {}, navigate() {}, notify() {}, signal: new AbortController().signal, locale: 'en', controller: route.controller })
    function initialize(nodes) {
      for (const node of nodes || []) {
        if (node.init != null) {
          expressions[node.init](state)
        }
        initialize(node.children)
      }
    }
    initialize(views[route.views.at(-1)])
    assert.equal(state.busy, false, `${path}: page spinner must stop after handing off to the table`)
    assert.ok(state.listVersion > 0, `${path}: table should be initialized`)
  }
  console.log('PASS: dashboard destinations verified; list parameters match; land totals include all pages; zero, missing and inconsistent counts handled correctly')
} finally { await server.close() }
