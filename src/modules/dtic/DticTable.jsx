import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import IndustrialView from '../industrial-unit/IndustrialView'
import { readPath } from '../industrial-unit/viewHelpers'
import { escapeRow } from '../id/applicant/reference/LandReferenceTable'
import { dticRequest, dticLink } from './dticService'
import { rowRules } from './generated/rows'
import tables from './generated/tables.json'

export function dticCells(name, row, index, rules = rowRules, tableConfig = tables) {
  const result = {}
  const cell = selector => {
    const match = typeof selector === 'string' ? selector.match(/eq\((\d+)\)/) : null
    const column = match ? Number(match[1]) : 0
    const api = {
      html: text => {
        result[column] = String(text ?? '')
        return api
      },
      append: text => {
        result[column] = (result[column] || '') + String(text ?? '')
        return api
      },
      find: () => ({
        append: text => {
          const current = result[column] || ''
          const closeDiv = current.lastIndexOf('</div>')
          if (closeDiv !== -1) {
            result[column] = current.slice(0, closeDiv) + String(text ?? '') + current.slice(closeDiv)
          } else {
            result[column] = current + String(text ?? '')
          }
          return api
        },
        html: text => {
          result[column] = String(text ?? '')
          return api
        },
        find: () => api
      }),
      text: text => {
        if (text !== undefined) {
          result[column] = String(text ?? '')
          return api
        }
        return result[column] || ''
      },
      attr: () => api,
      prop: () => api,
      addClass: () => api,
      removeClass: () => api,
      css: () => api,
      empty: () => {
        result[column] = ''
        return api
      }
    }
    return api
  }
  if (rules[name]) rules[name](cell, null, escapeRow(row), index)
  if (!(0 in result) && tableConfig[name]?.columns?.[0] === null) result[0] = String(index + 1)
  return result
}

function Cell({ markup, state, row, eligible }) {
  const doc = new DOMParser().parseFromString(markup, 'text/html')
  const render = (node, key) => {
    if (node.nodeType === 3) return node.textContent
    if (node.nodeType !== 1 || !['A', 'SPAN', 'DIV', 'BR', 'B', 'I', 'STRONG', 'INPUT', 'BUTTON', 'P', 'SMALL'].includes(node.tagName)) return null
    const tag = node.tagName.toLowerCase()
    const translation = node.getAttribute('th:text')?.match(/^#\{(.+)\}$/)?.[1]
    const children = state.translations[state.locale]?.[translation] || [...node.childNodes].map(render)
    const props = { key, className: node.className || undefined, title: node.getAttribute('title') || undefined }
    if (tag === 'input') {
      const id = row.applicationId || row.applicantId || row.requestId || ''
      return <input {...props} type="checkbox" aria-label={`Select ${id}`}
        disabled={node.classList.contains('elig-gated') ? !eligible : node.hasAttribute('disabled')}
        checked={Boolean(state.IdList?.includes(id))} onChange={e => state.selectApplication?.(id, e.target.checked)} />
    }
    if (tag === 'a') {
      const href = node.getAttribute('href') || ''
      if (href.startsWith('#')) return <Link {...props} to={dticLink(href)}>{children}</Link>
      if (node.classList.contains('accept-link')) return <button {...props} className="dtic-action-link" disabled={state.saving}
        onClick={() => state.acceptApplication(row.applicationId)}>{children}</button>
      const action = href.match(/^javascript:(\w+)\(['"]([^'"]+)['"]\)/)
      if (action) return <button {...props} className="dtic-action-link" onClick={() => state.downloadAction(action[1], action[2])}>{children}</button>
      if (/^(\/[^/]|https?:\/\/)/i.test(href)) return <a {...props} href={href} target={node.getAttribute('target') || undefined} rel="noopener noreferrer">{children}</a>
      return <span {...props}>{children}</span>
    }
    return React.createElement(tag, props, tag === 'br' ? undefined : children)
  }
  return [...doc.body.childNodes].map(render)
}

export default function DticTable({ name, node, state }) {
  const config = (state.tableBundle || tables)[name]
  const isMsme = name === 'dtic/msmeapplicationlist'
  const [start, setStart] = useState(0), [length, setLength] = useState(10), [search, setSearch] = useState('')
  const [result, setResult] = useState({ loading: true, rows: [], eligible: [] })
  useEffect(() => {
    const abort = new AbortController()
    setResult(previous => ({ ...previous, loading: true, error: '' }))
    const params = { sEcho: 1, iDisplayStart: start, iDisplayLength: length, sSearch: search, iColumns: config.columns.length, iSortingCols: 0 }
    Object.assign(params, state.tableParams?.() || {})
    config.columns.forEach((column, i) => Object.assign(params, { ['mDataProp_' + i]: column || '', ['bSortable_' + i]: false, ['bSearchable_' + i]: true }))
    dticRequest('get', config.endpoint, params, abort.signal).then(async data => {
      if (!Array.isArray(data.aaData)) throw new Error('The server returned an invalid application list.')
      const gated = data.aaData.filter(row => Number(row.currentStatusId) === 19).map(row => row.applicationId)
      const eligible = gated.length ? await dticRequest('get', 'eligibleCompleteIds', { applicationIds: gated.join(',') }, abort.signal).catch(() => []) : []
      if (!abort.signal.aborted) setResult({ rows: data.aaData, eligible, count: Number(data.iTotalDisplayRecords || 0), total: Number(data.iTotalRecords || 0) })
    }).catch(error => { if (!abort.signal.aborted) setResult({ rows: [], eligible: [], error: error.message }) })
    return () => abort.abort()
  }, [config, start, length, search, state.listVersion])
  const headers = node.children.find(n => n.tag === 'thead')?.children.find(n => n.tag === 'tr')?.children || []
  const count = result.count || 0
  const page = Math.floor(start / length), pages = Math.ceil(count / length)
  const fullNumbers = config.pagingType === 'full_numbers'
  const pageNumbers = Array.from({ length: Math.min(5, pages) }, (_, i) => Math.max(0, Math.min(page - 2, pages - 5)) + i)
  return <div className="dtic-datatable">
    {result.error && <div className="alert alert-danger" role="alert">{result.error}</div>}
    <div className="dtic-table-controls">
      <label>Show <select value={length} onChange={e => { setLength(+e.target.value); setStart(0) }}>{[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}</select> entries</label>
      <div className="dtic-table-actions">
        <label>Search: <input type="search" value={search} placeholder={isMsme ? 'Udyam Registration No. or EM1/EM2/SSI No.' : undefined} onChange={e => { setSearch(e.target.value); setStart(0) }} /></label>
        {isMsme && <Link className="btn btn-success dtic-add-msme" to={dticLink('#viewmsmeform')}>
          {state.translations[state.locale]?.['application.page.addNeMSME'] || 'Add New MSME'}
        </Link>}
      </div>
    </div>
    {result.loading && <p role="status">Processing...</p>}
    <div className="dtic-table-scroll"><table id="dynamic-table" className="table table-striped table-bordered table-hover" aria-busy={!!result.loading}>
      <thead><tr>{headers.map((n, i) => <th key={i}><IndustrialView nodes={n.children} state={state} /></th>)}</tr></thead>
      <tbody>{result.rows.map((row, index) => {
        const cells = dticCells(name, row, start + index, state.rowRules || rowRules, state.tableBundle || tables)
        return <tr key={row.applicationId || row.applicantId || row.requestId || index}>{config.columns.map((column, i) => <td key={i}>{i in cells ? <Cell markup={cells[i]} state={state} row={row} eligible={result.eligible?.includes(row.applicationId)} /> : String(readPath(row, column) ?? '')}</td>)}</tr>
      })}{!result.loading && !result.rows.length && <tr><td className="dataTables_empty" colSpan={headers.length || config?.columns?.length || 1} style={{ textAlign: 'center', verticalAlign: 'middle', padding: '24px 12px' }}>{search ? 'No matching records found' : 'No data available in table'}</td></tr>}</tbody>
    </table></div>
    <div className="dtic-table-controls dtic-table-footer">
      <div className="dataTables_info" role="status" aria-live="polite">Showing {count ? start + 1 : 0} to {Math.min(start + length, count)} of {count} entries{result.total > count ? ` (filtered from ${result.total} total entries)` : ''}</div>
      <div className="dataTables_paginate paging_bootstrap">
        <ul className="pagination">
          {fullNumbers && <li className={!start || result.loading ? 'disabled' : ''}><button type="button" disabled={!start || result.loading} onClick={() => setStart(0)}>First</button></li>}
          <li className={`paginate_button previous ${!start || result.loading ? 'disabled' : ''}`}>
            <button type="button" disabled={!start || result.loading} onClick={() => setStart(Math.max(0, start - length))} aria-label="Previous page">Previous</button>
          </li>
          {fullNumbers ? pageNumbers.map(number => <li key={number} className={`paginate_button ${page === number ? 'active' : ''}`}><button type="button" aria-current={page === number ? 'page' : undefined} disabled={result.loading} onClick={() => setStart(number * length)}>{number + 1}</button></li>) : count > 0 && <li className="paginate_button active">
            <span>{Math.floor(start / length) + 1}</span>
          </li>}
          <li className={`paginate_button next ${start + length >= count || result.loading ? 'disabled' : ''}`}>
            <button type="button" disabled={start + length >= count || result.loading} onClick={() => setStart(start + length)} aria-label="Next page">Next</button>
          </li>
          {fullNumbers && <li className={start + length >= count || result.loading ? 'disabled' : ''}><button type="button" disabled={start + length >= count || result.loading} onClick={() => setStart(Math.max(0, (pages - 1) * length))}>Last</button></li>}
        </ul>
      </div>
    </div>
  </div>
}
