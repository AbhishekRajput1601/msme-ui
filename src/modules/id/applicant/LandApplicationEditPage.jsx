import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LandApplicationForm from './components/LandApplicationForm'
import { loadLandApplication, saveLandApplication } from './services/landApplicationService'

export default function LandApplicationEditPage({ correction = false }) {
  const { applicantId = '0', parcelToken } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState({ loading: true })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true })
    loadLandApplication(applicantId, parcelToken, controller.signal, correction)
      .then(data => { if (!controller.signal.aborted) setResult({ data }) })
      .catch(error => { if (!controller.signal.aborted) setResult({ error: error.message }) })
    return () => controller.abort()
  }, [applicantId, parcelToken, attempt, correction])
  const save = async data => {
    const response = await saveLandApplication(data, correction)
    navigate(`/applicant/land-allotment/${correction ? 'correct-documents' : 'documents'}/${response.applicantId}/${encodeURIComponent(parcelToken)}`, { state: { message: response.successMessage } })
  }
  return <section className="panel panel-info">
    <div className="panel-heading">Land allotment application</div>
    <div className="panel-body">
      <Link to="/applicant/land-allotment">Back to applications</Link>
      {result.loading ? <p role="status">Loading the application and checking plot eligibility…</p> : result.error ? <div className="alert alert-danger" role="alert"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : <>
        <h2>{result.data.vacantLandBean.industrialAreaName} — Plot {result.data.vacantLandBean.plotNumber}</h2>
        <LandApplicationForm key={`${applicantId}-${parcelToken}-${attempt}`} initialData={result.data} onSave={save} />
      </>}
    </div>
  </section>
}
