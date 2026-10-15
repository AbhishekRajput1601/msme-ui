import { useEffect, useState, useReducer } from 'react'
import IndustrialView from '../../industrial-unit/IndustrialView'
import ReferenceDateInput from '../../applicant-services/ReferenceDateInput'
import { createOxState } from './oxModel'
import views from './generated/views.json'
import { expressions } from './generated/expressions'
import './generated/reference.css'
import './ox.css'

export default function OxPage({ match, locale }) {
  const [, render] = useReducer(n => n + 1, 0)
  const [state, setState] = useState(null)
  const name = match.route.views[0]
  useEffect(() => {
    const abort = new AbortController()
    const state = createOxState({ number: Number(name.match(/ox(\d)/)[1]), locale, signal: abort.signal, notify: () => { if (!abort.signal.aborted) render() } })
    Object.assign(state, { viewBundle: views, expressionBundle: expressions })
    state.renderDate = attrs => <ReferenceDateInput attrs={attrs} options={{ maxDate: new Date(), scrollInput: false }} onError={error => { state.error = error.message; state.notify() }} />
    setState(state)
    return () => abort.abort()
  }, [name, locale])
  if (!state) return null
  return <div className="dtic-ox" data-view={name}>
    {state.error && <div className="alert alert-danger" role="alert">{state.error}</div>}
    <IndustrialView name={name} state={state} />
  </div>
}
