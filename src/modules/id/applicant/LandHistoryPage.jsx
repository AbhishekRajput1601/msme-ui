import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { get } from '../../../api/httpClient'
import { jsonData } from '../../../api/responseData'

export default function LandHistoryPage() {
  const { applicantId } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true })
    get('/applicant/id/fetchHistory', { applicantId }, { signal: controller.signal }).then(jsonData).then(rows => {
      if (!Array.isArray(rows)) throw new Error('The server returned an invalid progress history.')
      if (!controller.signal.aborted) setResult({ rows })
    }).catch(error => { if (!controller.signal.aborted) setResult({ error: error.message }) })
    return () => controller.abort()
  }, [applicantId, attempt])
  return <section className="panel panel-info"><div className="panel-heading">Application progress history</div><div className="panel-body">
    <Link to={`/applicant/land-allotment/detail/${encodeURIComponent(applicantId)}`}>Back to application</Link>
    {result.loading ? <p role="status">Loading history…</p> : result.error ? <div role="alert" className="alert alert-danger"><p>{result.error}</p><button onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : <div className="overflow-x-auto"><table className="table table-bordered"><thead><tr>{['Status', 'Assigned by', 'Assigned to', 'Comments', 'Decision date', 'Created date'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>
      {result.rows.length ? result.rows.map((row, index) => <tr key={index}>{['status', 'assigner', 'assignee', 'comments', 'decisionDate', 'createdDate'].map(key => <td key={key}>{row[key] || '—'}</td>)}</tr>) : <tr><td colSpan={6}>No progress history is available.</td></tr>}
    </tbody></table></div>}
  </div></section>
}
