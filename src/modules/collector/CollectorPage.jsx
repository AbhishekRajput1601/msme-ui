import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import IndustrialView from '../industrial-unit/IndustrialView'
import ChangePasswordPage from '../profile/ChangePasswordPage'
import Modal from '../../components/modals/Modal'
import Spinner from '../../components/loaders/Spinner'
import { useTranslation } from '../../hooks/useTranslation'
import CollectorDashboard from './CollectorDashboard'
import { createCollectorState } from './collectorModel'
import routes from './generated/routes.json'
import views from './generated/views.json'
import translations from './generated/translations.json'
import { expressions } from './generated/expressions'
import '../industrial-unit/industrial-unit.css'
import './generated/reference.css'
import './collector.css'

const BatchContext = createContext(null)
export function CollectorWorkflowProvider({ children }) {
  const cache = useRef(null)
  return <BatchContext.Provider value={cache}>{children}</BatchContext.Provider>
}

export function matchCollectorRoute(pathname) {
  const parts = pathname.replace(/^\/department\/collector\/?/, '').split('/').filter(Boolean)
  for (const route of routes) {
    const pattern = route.path.split('/')
    if (pattern.length === parts.length && pattern.every((part, index) => part.startsWith(':') || part === parts[index]))
      return { route, params: Object.fromEntries(pattern.flatMap((part, index) => part.startsWith(':') ? [[part.slice(1), decodeURIComponent(parts[index])]] : [])) }
  }
  return null
}

export default function CollectorPage() {
  const { pathname } = useLocation(), { locale } = useTranslation()
  if (/\/(?:change-password|changepassword)$/.test(pathname)) return <ChangePasswordPage />
  const match = matchCollectorRoute(pathname)
  if (!match) return <Navigate to="/department/collector/dashboard" replace />
  if (match.route.path === 'dashboard') return <CollectorDashboard />
  return <Content key={pathname + locale} match={match} locale={locale} />
}

function Content({ match, locale }) {
  const navigate = useNavigate(), batchCache = useContext(BatchContext), [, render] = useReducer(n => n + 1, 0), [state, setState] = useState(null)
  useEffect(() => {
    const controller = new AbortController()
    const next = createCollectorState({
      params: match.params,
      navigate,
      locale,
      batchCache,
      signal: controller.signal,
      view: match.route.path.startsWith('fa/'),
      notify: () => { if (!controller.signal.aborted) render() }
    })
    Object.assign(next, { viewBundle: views, expressionBundle: expressions, translations })

    // Ensure back to batch list returns to batches view
    next.renderNode = node => {
      if (match.route.path.startsWith('detail/') && node.tag === 'span' && node.attrs?.class?.includes('pull-right')) return null
      if (node.click != null && /closeBatch/.test(String(expressions[node.click])))
        return <button type="button" className="btn btn-default btn-xs pull-right" onClick={() => { next.closeBatch(); next.notify() }}>← Back to batch list</button>
      return undefined
    }
    setState(next)
    return () => controller.abort()
  }, [navigate, locale, batchCache])

  if (!state) return <Spinner />
  const close = () => { state.remarkApp = null; state.historyModal = null; state.notify() }
  const isDetail = match.route.path.startsWith('detail/') || match.route.path.startsWith('fa/viewfaapplicantdetailunitnew/')

  return (
    <div className={`industrial-unit-page collector-page${isDetail ? ' collector-detail-page' : ''}`}>
      {state.busy && <Spinner />}
      {state.error && <div role="alert" className="alert alert-danger">{state.error}</div>}
      <IndustrialView name={match.route.views[0]} state={state} />
      <Modal isOpen={!!state.remarkApp} onClose={close} title={`Remarks - ${state.remarkApp?.applicationId}`} showCloseButton={false}
        footer={<><button className="btn btn-success" onClick={close}>Save</button> <button className="btn btn-default" onClick={close}>Close</button></>}>
        <textarea aria-label="Enter remark" className="form-control" rows={4} maxLength={2000} placeholder="Enter remark" value={state.remarkApp?.remark || ''} onChange={e => { state.remarkApp.remark = e.target.value; state.notify() }} />
      </Modal>
      <Modal isOpen={!!state.historyModal} onClose={close} title={`Remark History - ${state.historyModal?.applicationNo}`} size="4xl" showCloseButton={false} footer={<button className="btn btn-default" onClick={close}>Close</button>}>
        <div style={{ maxHeight: 400, overflowY: 'auto' }}><table className="table table-bordered table-striped"><thead><tr>{['Role', 'Action', 'Remark', 'By', 'Date'].map(label => <th key={label}>{label}</th>)}</tr></thead>
          <tbody>{state.historyModal?.rows.map((row, index) => <tr key={index}>{['roleName', 'actionStatus', 'remarks', 'verifiedBy', 'verifiedDate'].map(key => <td key={key}>{row[key]}</td>)}</tr>)}
            {!state.historyModal?.rows.length && <tr><td colSpan={5} className="text-center">No history yet.</td></tr>}</tbody></table></div>
      </Modal>
    </div>
  )
}

