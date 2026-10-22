import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import http from '../../../api/httpClient'
import IndustrialView from '../../industrial-unit/IndustrialView'
import DticTable from '../DticTable'
import { dticDocument, dticLink } from '../dticService'
import { createInfrastructureState } from './infrastructureModel'
import InfrastructureMap from './InfrastructureMap'
import { configureLandRecords, isLandRecord } from './landRecords'
import sourceViews from './generated/views.json'
import { formatApplicationActions } from './applicationListView'
import { expressions } from './generated/expressions'
import tables from './generated/tables.json'
import { rowRules } from './generated/rows'
import translations from '../generated/translations.json'
import toast from '../../../utils/toast'
import Spinner from '../../../components/loaders/Spinner'
import './generated/reference.css'
import './infrastructure.css'

const views = { ...sourceViews, 'dtic/idPendingApplicantList': formatApplicationActions(sourceViews['dtic/idPendingApplicantList']) }
const serverViews = new Set(['dtic/tenderDetails', 'dtic/id/viewLOCDetails', 'dtic/id/locPaymentDetails'])
function walk(nodes, fn) { for (const node of nodes || []) { fn(node); walk(node.children, fn) } }
function templateScore(name, doc) {
  let score = 0
  walk(views[name], node => {
    if (node.tag === 'form' && node.attrs?.name?.[0] && doc.querySelector(`form[name="${node.attrs.name[0]}"]`)) score += 10
    if (node.init != null) {
      const names = String(expressions[node.init]).match(/s\.(\w+)\(/g) || []
      for (const call of names) if (doc.documentElement.textContent.includes(call.slice(2)) || [...doc.querySelectorAll('[data-ng-init],[ng-init]')].some(el => (el.getAttribute('data-ng-init') || el.getAttribute('ng-init')).includes(call.slice(2)))) score++
    }
  })
  return score
}

// Three old endpoints expose only server-rendered receipts/details, not JSON.
// Convert their inert DOM into React nodes; no scripts or inline handlers execute.
function ServerDetails({ doc, state }) {
  const allowed = new Set('div section span p strong b i em h1 h2 h3 h4 h5 table thead tbody tr th td form label input button a img br hr ul li'.split(' '))
  const render = (node, key) => {
    if (node.nodeType === 3) return node.textContent
    const tag = node.tagName === 'BODY' ? 'div' : node.tagName?.toLowerCase()
    if (!allowed.has(tag)) return null
    const attrs = { key }
    for (const name of ['id','title','name','type','value','colspan','rowspan','alt','method']) if (node.hasAttribute(name)) attrs[{colspan:'colSpan',rowspan:'rowSpan'}[name] || name] = node.getAttribute(name)
    if (node.className) attrs.className = node.className
    if (node.style?.length) attrs.style = Object.fromEntries([...node.style].filter(name=>!/^behavior|^content/.test(name) && !/url\(|expression\(/i.test(node.style.getPropertyValue(name))).map(name=>[name.replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase()),node.style.getPropertyValue(name)]))
    if (attrs.id === 'page-wrapper') attrs.id = 'dtic-page-content'
    if (tag === 'img') { const src = node.getAttribute('src') || ''; if (/^(\/|https:)/.test(src)) attrs.src = src }
    if (tag === 'a') {
      const href = node.getAttribute('href') || ''
      if (href.startsWith('#')) attrs.href = dticLink(href)
      else if (/^(\/|https:)/.test(href)) attrs.href = href
      if (node.hasAttribute('data-document-type')) attrs.onClick = e => { e.preventDefault(); window.open(dticDocument('downloadIdDocument/' + encodeURIComponent(node.getAttribute('data-document-type')) + '/' + encodeURIComponent(node.getAttribute('data-applicant-id') || state.params.applicantId)), '_blank', 'noopener') }
    }
    if (node.hasAttribute('onclick') || node.hasAttribute('data-ng-click')) {
      const action = node.getAttribute('onclick') || node.getAttribute('data-ng-click')
      if (/print/.test(action)) attrs.onClick = () => window.print()
      else if (/doTheBack|history.back/.test(action)) attrs.onClick = state.doTheBack
    }
    if (tag === 'form') { attrs.onSubmit = e => e.preventDefault() }
    if (tag === 'input') { attrs.readOnly = true; if (node.hasAttribute('checked')) attrs.checked = true }
    if (['input','img','br','hr'].includes(tag)) return React.createElement(tag, attrs)
    return React.createElement(tag, attrs, [...node.childNodes].map(render))
  }
  return render(doc.querySelector('#page-wrapper') || doc.body, 'server-detail')
}

export default function InfrastructurePage({ match, locale }) {
  const navigate = useNavigate(), [, render] = useReducer(n => n + 1, 0)
  const [content, setContent] = useState(null), [error,setError] = useState('')
  const { route,params } = match
  useEffect(() => {
    const abort = new AbortController()
    const notify = () => { if (!abort.signal.aborted) render() }
    const state = createInfrastructureState({ params, navigate, notify, locale, signal: abort.signal })
    Object.assign(state, { viewBundle: views, expressionBundle: expressions, translations, tableBundle: tables, rowRules })
    async function initialize() {
      let name = route.views[0], doc = null
      if (isLandRecord(name)) configureLandRecords(state)
      if (route.views.length > 1 || serverViews.has(name) || ['dtic/idPendingApplicantList','dtic/editVacantLandForm'].includes(name)) {
        const endpoint = route.endpoint + Object.values(params).map(value => '/' + encodeURIComponent(value)).join('')
        const response = await http.get('/dtic' + endpoint, { signal: abort.signal, responseType: 'text', headers: { Accept: 'text/html', 'X-Requested-With': 'XMLHttpRequest' } })
        if (typeof response.data !== 'string' || !response.data.includes('<')) throw new Error('The server did not return this infrastructure page.')
        doc = new DOMParser().parseFromString(response.data, 'text/html')
        if (!doc.querySelector('#page-wrapper, .panel, table')) throw new Error(doc.querySelector('.alert-danger')?.textContent || 'This infrastructure page is not available for the current session.')
        if (route.views.length > 1) name = [...route.views].sort((a,b) => templateScore(b, doc) - templateScore(a, doc))[0]
        state.serverValues = Object.fromEntries([...doc.querySelectorAll('input[id]')].map(el => [el.id, el.value]))
      }
      // ng-model creates object parents in Angular; initialize them before the
      // first React effect, without initializing row-local repeat variables.
      walk(views[name], node => {
        const root = node.model?.match(/^(\w+)\./)?.[1]
        if (root && /Data$|Bean$/.test(root)) state[root] ||= {}
      })
      const prepare = state.prepareElement
      state.prepareElement = (attrs,node,scope) => {
        prepare(attrs,node,scope)
        if (state.serverValues?.[attrs.id] != null) { attrs.value = state.serverValues[attrs.id]; attrs.readOnly = true }
      }
      state.renderTable = tables[name] ? node => <DticTable name={name} node={node} state={state} /> : undefined
      state.renderNode = node => {
        const id = node.attrs?.id?.[0]
        if (id === 'map') return <InfrastructureMap state={state} />
        if (id === 'currentDate') return <span id={id}>{new Date().toLocaleDateString('en-GB')}</span>
        return undefined
      }
      if (!abort.signal.aborted) setContent({ name, state, doc })
    }
    initialize().catch(e => {
      if (!abort.signal.aborted) {
        setError(e.message)
        toast.error(e.message || 'Failed to initialize page.')
      }
    })
    return () => abort.abort()
  }, [route, locale, navigate])
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>
  if (!content) return <Spinner />
  const { name,state,doc } = content
  return <div className={isLandRecord(name) ? 'dtic-page dtic-land-records' : 'dtic-page dtic-infrastructure'} data-dtic-view={name}>
    {(state.busy || state.saving) && <Spinner />}
    {serverViews.has(name) ? <ServerDetails doc={doc} state={state} /> : <IndustrialView name={name} state={state} />}
  </div>
}
