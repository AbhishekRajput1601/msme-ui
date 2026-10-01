import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { contentNodes } from '../../public/legacyWebsite'
import { WebsiteContent } from '../../public/WebsiteContent'
import { fetchLandPage } from './services/landApplicationService'

export default function LandInstructionsPage({ undeveloped = false }) {
  const { parcelToken } = useParams()
  const [result, setResult] = useState({ loading: true })
  const [accepted, setAccepted] = useState(false)
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    const controller = new AbortController()
    setResult({ loading: true }); setAccepted(false)
    const path = `idInstruction${undeveloped ? 'UL' : ''}/0/${encodeURIComponent(parcelToken)}`
    fetchLandPage(path, controller.signal).then(doc => {
      const panel = doc.querySelector('.panel-body')
      if (!panel) throw new Error('The server did not return the land application instructions.')
      panel.querySelectorAll('script, form, input, button, a, [data-ng-if], [ng-if]').forEach(node => node.remove())
      if (panel.textContent.includes('{{')) throw new Error('The server returned incomplete instructions.')
      const nodes = contentNodes(panel, `${window.location.origin}/backend/applicant/${path}`)
      if (!controller.signal.aborted) setResult({ nodes })
    }).catch(error => { if (!controller.signal.aborted) setResult({ error: error.message }) })
    return () => controller.abort()
  }, [parcelToken, attempt, undeveloped])
  return <section className="panel panel-info"><div className="panel-heading">Instructions for land allotment</div><div className="panel-body">
    <Link to="/applicant/land-allotment/explore">Back to vacant plots</Link>
    {result.loading ? <p role="status">Loading instructions…</p> : result.error ? <div className="alert alert-danger" role="alert"><p>{result.error}</p><button className="btn btn-default" onClick={() => setAttempt(value => value + 1)}>Retry</button></div> : <>
      <WebsiteContent nodes={result.nodes} />
      <label className="block my-4"><input type="checkbox" checked={accepted} onChange={event => setAccepted(event.target.checked)} /> I have read the application instructions.</label>
      {accepted && <Link className="btn btn-primary" to={`/applicant/land-allotment/apply/${encodeURIComponent(parcelToken)}`}>Continue to application</Link>}
    </>}
  </div></section>
}
