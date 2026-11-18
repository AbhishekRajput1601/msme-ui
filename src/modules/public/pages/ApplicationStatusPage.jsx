import { useEffect, useRef, useState } from 'react'
import PublicPageLayout from '../components/PublicPageLayout'
import { readPublic } from '../publicData'
export default function ApplicationStatusPage() {
  const [number, setNumber] = useState('')
  const [result, setResult] = useState({})
  const sequence = useRef(0)
  useEffect(() => () => { sequence.current++ }, [])
  async function search(event) {
    event.preventDefault()
    if (!number.trim() || result.loading) return
    const request = ++sequence.current
    setResult({ loading: true })
    try {
      const data = await readPublic(`/idLanding/unifiedPortal/applicationStatus?applicationNo=${encodeURIComponent(number.trim())}`)
      const record = data?.data
      if (typeof record !== 'string' && (!record || Array.isArray(record) || typeof record !== 'object' || !record.applicationNo)) throw new Error('The server returned an unexpected application response.')
      if (request === sequence.current) setResult(typeof record === 'string' ? { message: record } : { record })
    } catch (error) { if (request === sequence.current) setResult({ error: error.message }) }
  }
  return <PublicPageLayout title="Land Application Status">
    <section className="bg-white border rounded p-4 sm:p-6 space-y-4" aria-busy={!!result.loading}>
      <form onSubmit={search} className="flex flex-wrap gap-3 items-end">
        <label>Application number<input className="block border rounded p-2" value={number} required onChange={event => {
          sequence.current++; setNumber(event.target.value); setResult({})
        }} /></label>
        <button className="btn btn-primary" disabled={result.loading || !number.trim()}>Check status</button>
      </form>
      {result.loading && <p role="status">Checking application…</p>}
      {result.error && <p role="alert">{result.error} Submit again to retry.</p>}
      {result.message && <p role="status">{result.message}</p>}
      {result.record && <dl className="grid sm:grid-cols-2 gap-3">
        {[['Application number', result.record.applicationNo], ['Status', result.record.status]].map(([label, value]) => <div key={label}><dt className="font-bold">{label}</dt><dd>{value || '—'}</dd></div>)}
      </dl>}
    </section>
  </PublicPageLayout>
}
