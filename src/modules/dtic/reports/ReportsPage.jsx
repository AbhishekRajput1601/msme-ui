import { useEffect, useReducer, useState } from 'react'
import IndustrialView from '../../industrial-unit/IndustrialView'
import ReferenceDateInput from '../../applicant-services/ReferenceDateInput'
import DticTable from '../DticTable'
import { createReportState } from './reportModel'
import views from './generated/views.json'
import tables from './generated/tables.json'
import { expressions } from './generated/expressions'
import translations from '../generated/translations.json'
import Spinner from '../../../components/loaders/Spinner'
import './generated/reference.css'
import './reports.css'

export default function ReportsPage({ match, locale }) {
  const [, render] = useReducer(n => n + 1, 0)
  const [state, setState] = useState(null)
  const name = match.route.views[0]
  useEffect(() => {
    const abort = new AbortController()
    const notify = () => { if (!abort.signal.aborted) render() }
    const model = createReportState({ locale, notify, signal: abort.signal })
    Object.assign(model, { viewBundle: views, expressionBundle: expressions, translations, tableBundle: tables, rowRules: {} })
    model.renderDate = attrs => <ReferenceDateInput attrs={attrs} onError={error => { model.errorMessage = error.message; notify() }} />
    model.tableEndpoint = () => tables[name].endpoint + '/' + [model.fromDateInput, model.toDateInput].map(value => encodeURIComponent(value.replaceAll('/', '-'))).join('/')
    model.renderTable = node => <DticTable key={model.listVersion} name={name} node={node} state={model} />
    setState(model)
    return () => abort.abort()
  }, [name, locale])
  if (!state) return <Spinner />
  return <div className="dtic-page dtic-msme-reports">
    {state.busy && <Spinner />}
    <IndustrialView name={name} state={state} />
  </div>
}
