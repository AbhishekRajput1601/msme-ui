import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicPageLayout from './PublicPageLayout'
import { readPublic, readRows } from '../publicData'

export default function BackendTablePage({ title, endpoint, columns, envelope = 'aaData', params = {}, actions, dateSearch = false }) {
  const [page, setPage] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [dates, setDates] = useState({})
  const [filter, setFilter] = useState('')
  const [stored, setResult] = useState({})
  const query = new URLSearchParams({ ...params, ...dates, ...(envelope === 'aaData' ? { iDisplayStart: page * 25, iDisplayLength: 25 } : {}) }).toString()
  const path = `${endpoint}?${query}`
  const requestKey = `${path}:${attempt}`
  const result = stored.key === requestKey ? stored : { loading: true }
  useEffect(() => {
    let active = true
    readPublic(path).then(data => {
      const rows = readRows(data, envelope)
      const total = envelope === 'aaData' ? Number(data.iTotalDisplayRecords) : rows.length
      if (!Number.isFinite(total) || total < 0) throw new Error('The server returned an invalid record count.')
      if (active) setResult({ key: requestKey, rows, total, loading: false })
    }).catch(error => { if (active) setResult({ key: requestKey, error: error.message, loading: false }) })
    return () => { active = false }
  }, [path, envelope, requestKey])
  const rows = (result.rows || []).filter(row => columns.some(column => String(row[column.field] ?? '').toLowerCase().includes(filter.toLowerCase())))
  return <PublicPageLayout title={title} actions={actions}>
    <section className="bg-white rounded-lg border p-4 sm:p-6 space-y-4" aria-busy={result.loading}>
      {dateSearch && <form className="flex flex-wrap items-end gap-3" onSubmit={event => {
        event.preventDefault()
        const values = Object.fromEntries(new FormData(event.currentTarget))
        if (values.docIssueDateFrom && values.docIssueDateTo && values.docIssueDateFrom > values.docIssueDateTo) {
          event.currentTarget.elements.docIssueDateTo.setCustomValidity('End date must be on or after start date.')
          event.currentTarget.reportValidity()
          return
        }
        setPage(0); setDates(values)
      }}>
        <label>Issue date from<input className="block border rounded p-2" type="date" name="docIssueDateFrom" /></label>
        <label>Issue date to<input className="block border rounded p-2" type="date" name="docIssueDateTo" onChange={event => event.target.setCustomValidity('')} /></label>
        <button className="btn btn-primary" disabled={result.loading}>Search</button>
        <button type="reset" className="btn" onClick={() => { setDates({}); setPage(0); setFilter('') }}>Reset</button>
      </form>}
      <label className="block">{envelope === 'aaData' ? 'Filter this page' : 'Filter records'}
        <input type="search" className="block border rounded p-2 w-full" value={filter} onChange={event => setFilter(event.target.value)} />
      </label>
      {result.loading ? <p role="status">Loading records…</p> : result.error ? <div role="alert">
        <p>{result.error}</p><button type="button" className="btn btn-primary" onClick={() => setAttempt(value => value + 1)}>Retry</button>
      </div> : <>
        <p role="status">{result.total} records returned by the server{envelope === 'aaData' ? ` · Page ${page + 1}` : ''}.</p>
        {!rows.length ? <p>No records match the selected filters.</p> : <div className="overflow-x-auto">
          <table className="w-full text-sm text-left"><thead><tr>{columns.map(column => <th className="p-3 border-b" key={column.field} scope="col">{column.label}</th>)}</tr></thead>
            <tbody>{rows.map((row, index) => <tr key={index}>{columns.map(column => <td className="p-3 border-b" key={column.field}>{column.render ? column.render(row) : String(row[column.field] ?? '—')}</td>)}</tr>)}</tbody>
          </table>
        </div>}
        {envelope === 'aaData' && <nav aria-label="Record pages" className="flex gap-3">
          <button type="button" className="btn" disabled={page === 0} onClick={() => setPage(value => value - 1)}>Previous</button>
          <button type="button" className="btn" disabled={(page + 1) * 25 >= result.total} onClick={() => setPage(value => value + 1)}>Next</button>
        </nav>}
      </>}
    </section>
  </PublicPageLayout>
}

export function ServiceLink({ to, children }) {
  return <Link className="inline-block rounded bg-blue-700 text-white px-4 py-2" to={to}>{children}</Link>
}
