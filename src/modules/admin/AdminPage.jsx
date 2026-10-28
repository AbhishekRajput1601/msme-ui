import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import IndustrialView from '../industrial-unit/IndustrialView'
import Spinner from '../../components/loaders/Spinner'
import { useTranslation } from '../../hooks/useTranslation'
import { createAdminState } from './adminModel'
import routes from './generated/routes.json'
import views from './generated/views.json'
import translations from './generated/translations.json'
import { expressions } from './generated/expressions'
import tables from './generated/tables.json'
import { rowRules } from './generated/rows'
import DticTable from '../dtic/DticTable'
import DepartmentProfilePage from '../profile/department/DepartmentProfilePage'
import { adminRequest, exportTableToExcel } from './adminService'
import '../dtic/dtic-page.css'
import './generated/reference.css'
import './admin.css'

export function matchAdminRoute(pathname) {
  const clean = pathname.replace(/^\/admin\/?/, '').replace(/\/+$/, '')
  const parts = clean.split('/').filter(Boolean)
  if (parts.length === 0) {
    const dashboardRoute = routes.find(r => r.path === 'dashboard')
    return { route: dashboardRoute || { path: 'dashboard', views: ['admuser/dashboard'] }, params: {} }
  }
  for (const route of routes) {
    const pattern = route.path.split('/')
    if (
      pattern.length === parts.length &&
      pattern.every((part, index) => part.startsWith(':') || part === parts[index])
    ) {
      return {
        route,
        params: Object.fromEntries(
          pattern.flatMap((part, index) =>
            part.startsWith(':') ? [[part.slice(1), decodeURIComponent(parts[index])]] : []
          )
        ),
      }
    }
  }
  return null
}

export default function AdminPage() {
  const { pathname } = useLocation()
  const { locale } = useTranslation()
  if (/\/(?:changepassword|change-password|firstPasswordChange|first-password-change)$/.test(pathname)) {
    return <DepartmentProfilePage password request={adminRequest} dashboard="/admin/dashboard" />
  }
  const aliases = { users: 'userList', masters: 'officeList', reports: 'report1', settings: 'changepassword' }
  const alias = aliases[pathname.replace(/^\/admin\//, '')]
  if (alias) return <Navigate to={'/admin/' + alias} replace />
  const match = matchAdminRoute(pathname)

  if (!match) {
    return <div className="alert alert-warning" role="alert">This admin page is unavailable.</div>
  }

  return <AdminContent key={pathname + locale} match={match} locale={locale} />
}

function AdminContent({ match, locale }) {
  const navigate = useNavigate()
  const [, forceRender] = useReducer(n => n + 1, 0)
  const [state, setState] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const next = createAdminState({
      params: match.params,
      navigate,
      locale,
      signal: controller.signal,
      notify: () => {
        if (!controller.signal.aborted) forceRender()
      },
    })

    Object.assign(next, {
      viewBundle: views,
      expressionBundle: expressions,
      translations,
      tableBundle: tables,
      rowRules,
      tableRequest: adminRequest,
    })

    const name = match.route.views[0]
    next.renderTable = tables[name] ? node => <><button type="button" className="btn btn-default" onClick={() => exportTableToExcel('dynamic-table', 'Admin-list.xls')}>Export displayed records</button><DticTable name={name} node={node} state={next} /></> : undefined

    setState(next)
    return () => controller.abort()
  }, [navigate, locale, match.params])

  if (!state) return <Spinner fullScreen />

  const viewName = match.route.views[0]

  return (
    <div className="admin-page dtic-page">
      {state.busy && <Spinner />}
      {state.error && (
        <div role="alert" className="alert alert-danger" style={{ margin: '15px 0' }}>
          <strong>Error: </strong>
          <span>{state.error}</span>
        </div>
      )}
      {state.responseObject?.successMessage && (
        <div role="alert" className="alert alert-success" style={{ margin: '15px 0' }}>
          <strong>Success! </strong>
          <span>{state.responseObject.successMessage}</span>
        </div>
      )}
      {state.responseObject?.errorMessage && (
        <div role="alert" className="alert alert-danger" style={{ margin: '15px 0' }}>
          <strong>Error! </strong>
          <span>{state.responseObject.errorMessage}</span>
        </div>
      )}
      <div id="admin-page-content">
        <IndustrialView name={viewName} state={state} />
      </div>
    </div>
  )
}

