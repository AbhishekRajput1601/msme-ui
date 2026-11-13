import { useLayoutEffect, useRef } from 'react'
import Spinner from '../loaders/Spinner'
import './table-viewport.css'
import { columnWidths } from './tableGeometry'

/** Keep pagination inside the existing table, without replacing its layout. */
export default function TableViewport({ loading = false, resetKey, children }) {
  const content = useRef(null)
  const measurements = useRef({ key: resetKey, height: 0, table: null })

  useLayoutEffect(() => {
    const element = content.current
    const table = element?.querySelector('table')
    const saved = measurements.current
    if (saved.key !== resetKey) {
      saved.key = resetKey
      saved.height = 0
      element.style.minHeight = ''
    }
    if (!table) return
    // Measure real records once. Subsequent pages retain the same column widths,
    // including reports with grouped (colspan) headings.
    const hasRecords = [...(table.tBodies[0]?.rows || [])].some(row => row.cells.length > 1)
    if (!loading && hasRecords && saved.table !== table) {
      const widths = columnWidths([...(table.tHead?.rows || [])].map(row => [...row.cells].map(cell => ({
        width: cell.getBoundingClientRect().width, colSpan: cell.colSpan, rowSpan: cell.rowSpan,
      }))))
      if (widths.length && !table.querySelector(':scope > colgroup')) {
        const group = document.createElement('colgroup')
        widths.forEach(width => {
          const col = document.createElement('col')
          col.style.width = `${width}%`
          group.appendChild(col)
        })
        table.insertBefore(group, table.tHead)
        table.style.setProperty('table-layout', 'fixed', 'important')
        saved.table = table
      }
    }
    if (!loading) {
      saved.height = Math.max(saved.height, element.getBoundingClientRect().height)
      element.style.minHeight = `${saved.height}px`
    }
  })

  return <div className="portal-table-viewport" aria-busy={!!loading}>
    <div ref={content} className="portal-table-content" inert={loading ? true : undefined}>
      {children}
    </div>
    {loading && <div className="portal-table-loader"><Spinner inline /></div>}
  </div>
}
