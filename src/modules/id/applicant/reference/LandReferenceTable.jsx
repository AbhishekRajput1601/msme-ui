import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import http from '../../../../api/httpClient'
import { jsonData } from '../../../../api/responseData'
import IndustrialView from '../../../industrial-unit/IndustrialView'
import translations from '../../../industrial-unit/generated/translations.json'
import { readPath } from '../../../industrial-unit/viewHelpers'
import configs from './generated/tables.json'
import { rowRules } from './generated/rows'
import { landReferenceLink, landDownloadLink } from './landReferenceLinks'

// Data is escaped before entering the original concatenation rules. The output
// is parsed as inert markup and rendered through an allowlist, never innerHTML.
export function escapeRow(value) {
  if (typeof value === 'string') return value.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c])
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,item]) => [key,escapeRow(item)]))
  return value
}
export function referenceCells(name, row, index) {
  const cells = {}
  const cell = selector => {
    const column = Number(selector.match(/eq\((\d+)\)/)?.[1])
    return { html: value => { cells[column] = String(value ?? '') }, append: value => { cells[column] = (cells[column] || '') + String(value ?? '') } }
  }
  rowRules[name](cell, null, escapeRow(row), index)
  cells[0] = String(index + 1)
  return cells
}
function CellMarkup({ html, locale }) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const render = (node, key) => {
    if (node.nodeType === 3) return node.textContent
    if (node.nodeType !== 1 || !['A','B','STRONG','SPAN','DIV','BR','P','I'].includes(node.tagName)) return null
    const tag = node.tagName.toLowerCase()
    const textKey = node.getAttribute('th:text')?.match(/^#\{(.+)\}$/)?.[1]
    const children = textKey && translations[locale]?.[textKey] || [...node.childNodes].map(render)
    const props = { className: node.className || undefined, title: node.getAttribute('title') || undefined }
    if (node.style.color) props.style = { color: node.style.color }
    if (tag === 'a') {
      const raw = node.getAttribute('href') || ''
      if (raw.startsWith('#')) return <Link key={key} {...props} to={landReferenceLink(raw)}>{children}</Link>
      const href = raw.startsWith('javascript:') ? landDownloadLink(raw) : /^(https?:\/\/|\/(?!\/))/.test(raw) ? raw : undefined
      return <a key={key} {...props} href={href} target={node.getAttribute('target') || undefined} rel="noopener noreferrer">{children}</a>
    }
    return React.createElement(tag, { ...props, key }, tag === 'br' ? undefined : children)
  }
  return [...doc.body.childNodes].map(render)
}

export default function LandReferenceTable({ name, node, state }) {
  const config = configs[name]
  const [start, setStart] = useState(0), [length, setLength] = useState(10), [search, setSearch] = useState('')
  const [sort, setSort] = useState(null)
  const [result, setResult] = useState({ loading: true, data: [] })
  useEffect(() => {
    const abort = new AbortController()
    setResult(previous => ({ ...previous, loading: true, error: '' }))
    const params = { sEcho: 1, iDisplayStart: start, iDisplayLength: length, sSearch: search, iColumns: config.columns.length, iSortingCols: sort ? 1 : 0, iSortCol_0: sort?.column ?? 0, sSortDir_0: sort?.direction || 'asc' }
    config.columns.forEach((key,i) => { params['mDataProp_'+i] = key ?? ''; params['bSortable_'+i] = config.sortable[i]; params['bSearchable_'+i] = true })
    if (name.startsWith('vacant')) params.industrialArea = name.endsWith('UN') ? 'Undeveloped Land' : 'Industrial Area'
    http.get('/applicant/' + config.endpoint, { params, signal: abort.signal }).then(response => {
      const data = jsonData(response.data)
      if (!Array.isArray(data.aaData)) throw new Error('The server returned an invalid application list.')
      if (!abort.signal.aborted) setResult({ data: data.aaData, count: Number(data.iTotalDisplayRecords || 0), total: Number(data.iTotalRecords || 0) })
    }).catch(error => { if (!abort.signal.aborted) setResult({ data: [], error: error.message }) })
    return () => abort.abort()
  }, [name, config, start, length, search, sort])
  const headers = node.children.find(child => child.tag === 'thead')?.children.find(child => child.tag === 'tr')?.children || []
  const count = result.count || 0, page = Math.floor(start / length), pages = Math.ceil(count / length)
  return <div className="land-datatable">
    {result.error && <div className="alert alert-danger" role="alert">{result.error}</div>}
    <div className="land-table-controls">
      <div className="land-control-group">
        <label>
          Show{' '}
          <select
            value={length}
            onChange={e => {
              setLength(Number(e.target.value))
              setStart(0)
            }}
          >
            {[10, 25, 50, 100].map(n => (
              <option key={n}>{n}</option>
            ))}
          </select>{' '}
          entries
        </label>
      </div>
      <div className="land-control-group">
        <label>
          <span className="search-label">Search: </span>
          <input
            type="search"
            placeholder={config.placeholder || 'Search...'}
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setStart(0)
            }}
          />
        </label>
      </div>
    </div>
    {result.loading && <div className="land-table-loading" role="status"><span className="loading-spinner"></span> Processing...</div>}
    <div className="land-table-scroll-container">
      <table id="dynamic-table" className="table table-striped table-bordered table-hover land-styled-table" aria-busy={!!result.loading}>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                aria-sort={sort?.column === i ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                className={config.sortable[i] ? 'is-sortable' : ''}
              >
                {config.sortable[i] ? (
                  <button
                    type="button"
                    className={`land-sort ${sort?.column === i ? 'active' : ''}`}
                    onClick={() =>
                      setSort({
                        column: i,
                        direction: sort?.column === i && sort.direction === 'asc' ? 'desc' : 'asc',
                      })
                    }
                  >
                    <span className="land-sort-text"><IndustrialView nodes={header.children} state={state} /></span>
                    <span className="land-sort-indicator">
                      {sort?.column === i ? (sort.direction === 'asc' ? ' ▲' : ' ▼') : ' ⇅'}
                    </span>
                  </button>
                ) : (
                  <IndustrialView nodes={header.children} state={state} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.data.map((row, index) => {
            const cells = referenceCells(name, row, start + index)
            return (
              <tr key={row.applicantId || row.vacantLandId || index}>
                {config.columns.map((column, i) => (
                  <td key={i}>
                    {i in cells ? (
                      <CellMarkup html={cells[i]} locale={state.locale} />
                    ) : column?.endsWith('plotNumber') ? (
                      String(readPath(row, column) || '-')
                        .match(/.{1,27}/g)
                        ?.map((part, n) => (
                          <React.Fragment key={n}>
                            {n > 0 && <br />}
                            {part}
                          </React.Fragment>
                        ))
                    ) : (
                      String(readPath(row, column) ?? '')
                    )}
                  </td>
                ))}
              </tr>
            )
          })}
          {!result.data.length && (
            <tr>
              <td colSpan={headers.length} className="text-center no-records-cell">
                {search ? 'No matching records found' : 'No data available in table'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="land-table-controls land-table-footer">
      <div className="land-table-info">
        Showing {count ? start + 1 : 0} to {Math.min(start + length, count)} of {count} entries
        {result.total > count && ` (filtered from ${result.total} total entries)`}
      </div>
      <div className="pagination">
        <button disabled={!start || result.loading} onClick={() => setStart(0)} title="First page">« First</button>
        <button disabled={!start || result.loading} onClick={() => setStart(start - length)} title="Previous page">‹ Prev</button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => Math.max(0, Math.min(page - 2, pages - 5)) + i).map(n => (
          <button
            key={n}
            aria-current={n === page ? 'page' : undefined}
            disabled={result.loading}
            onClick={() => setStart(n * length)}
          >
            {n + 1}
          </button>
        ))}
        <button disabled={start + length >= count || result.loading} onClick={() => setStart(start + length)} title="Next page">Next ›</button>
        <button disabled={start + length >= count || result.loading} onClick={() => setStart((pages - 1) * length)} title="Last page">Last »</button>
      </div>
    </div>
  </div>
}
