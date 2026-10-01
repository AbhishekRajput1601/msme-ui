import { useEffect, useState } from 'react'
import { fetchDashboardCounts } from '../../services/shellService'
import DashboardPanel from '../../components/ui/DashboardPanel'

export default function BackendDashboard({ title }) {
  const [state, setState] = useState({ loading: true })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setState({ loading: true })
    fetchDashboardCounts()
      .then(data => { if (active) setState({ data }) })
      .catch(error => { if (active) setState({ error: error.message || 'Dashboard information is unavailable.' }) })
    return () => { active = false }
  }, [attempt])
  const metrics = Object.entries(state.data || {}).filter(([, value]) => typeof value === 'number' && Number.isFinite(value))
  return <div className="legacy-dashboard">
    <h1 className="page-header">{title}</h1>
    {state.loading ? <p role="status">Loading dashboard…</p> : state.error ? <div role="alert"><p>{state.error}</p><button onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : metrics.length ? <div className="dashboard-panels">
      {metrics.map(([key, value]) => <DashboardPanel key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, character => character.toUpperCase())} value={value.toLocaleString('en-IN')} />)}
    </div> : <p>No dashboard statistics were returned.</p>}
  </div>
}
