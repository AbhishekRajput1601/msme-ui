/**
 * DataTable.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable, accessible data table component for the MPIndustry portal.
 *
 * Supports:
 *  • Server-side & client-side pagination (page, pageSize, totalCount)
 *  • Column sorting (sortColumn, sortDirection: 'asc' | 'desc')
 *  • Search query box with live debounce or instant callback
 *  • Skeleton loading state
 *  • Meaningful empty state
 *  • Error state with retry action
 *  • Accessible table semantics (scope, aria-sort, aria-label)
 */

import React from 'react'
import Button from '../ui/Button'

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  error = null,
  emptyMessage = 'No records found',
  page = 1,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  totalCount = 0,
  onPageChange,
  onPageSizeChange,
  sortColumn = null,
  sortDirection = 'asc',
  onSort,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  onRetry,
  tableTitle,
  headerActions,
  className = '',
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const startRecord = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const endRecord = Math.min(totalCount, page * pageSize)

  const handleSortClick = (col) => {
    if (!col.sortable || !onSort) return
    const isCurrent = sortColumn === col.key
    let nextDirection = 'asc'
    if (isCurrent && sortDirection === 'asc') {
      nextDirection = 'desc'
    } else if (isCurrent && sortDirection === 'desc') {
      nextDirection = 'asc'
    }
    onSort(col.key, nextDirection)
  }

  return (
    <div className={`w-full rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden ${className}`}>
      {/* Table Toolbar (Search & Header Actions) */}
      {(onSearchChange || tableTitle || headerActions) && (
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 bg-gray-50/50">
          <div className="min-w-0">
            {tableTitle && (
              <h3 className="text-base font-bold text-gray-900 truncate">
                {tableTitle}
              </h3>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onSearchChange && (
              <div className="relative min-w-[240px] max-w-sm flex-1 sm:flex-initial">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  aria-label="Filter table data"
                  className="block w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-9 pr-8 text-xs text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search query"
                    className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {headerActions && <div className="flex items-center gap-2">{headerActions}</div>}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 text-center" role="alert">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-3">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-900 mb-1">Failed to load data</p>
          <p className="text-xs text-gray-500 mb-4">{error.message || String(error)}</p>
          {onRetry && (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      )}

      {/* Table view */}
      {!error && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600 border-collapse">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                {columns.map((col) => {
                  const isCurrent = sortColumn === col.key
                  const ariaSort = !col.sortable
                    ? undefined
                    : isCurrent
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : 'none'

                  return (
                    <th
                      key={col.key}
                      scope="col"
                      aria-sort={ariaSort}
                      style={{ width: col.width }}
                      onClick={() => handleSortClick(col)}
                      className={`px-4 py-3 select-none ${
                        col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''
                      } ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}`}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 ${
                          col.align === 'center'
                            ? 'justify-center'
                            : col.align === 'right'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <span>{col.title}</span>
                        {col.sortable && (
                          <span className="text-gray-400">
                            {isCurrent ? (
                              sortDirection === 'asc' ? (
                                <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )
                            ) : (
                              <svg className="h-3 w-3 opacity-40 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {/* Loading Skeletons */}
              {loading &&
                Array.from({ length: pageSize || 5 }).map((_, rIdx) => (
                  <tr key={`skeleton-${rIdx}`} className="animate-pulse bg-white">
                    {columns.map((col, cIdx) => (
                      <td key={`scol-${cIdx}`} className="px-4 py-3.5">
                        <div className="h-3.5 rounded bg-gray-200" style={{ width: `${60 + ((rIdx * 7 + cIdx * 13) % 35)}%` }} />
                      </td>
                    ))}
                  </tr>
                ))}

              {/* Empty state */}
              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="rounded-full bg-gray-100 p-3 text-gray-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-700">{emptyMessage}</p>
                      {searchQuery && (
                        <p className="text-xs text-gray-400">
                          Try adjusting your search criteria or resetting filters.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Data Rows */}
              {!loading &&
                data.map((row, rowIdx) => (
                  <tr
                    key={row.id || rowIdx}
                    className="hover:bg-indigo-50/30 transition-colors duration-100"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-gray-700 ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(row, rowIdx) : row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {!error && (
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 bg-gray-50/70 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>
              Showing <span className="font-semibold text-gray-800">{startRecord}</span> to{' '}
              <span className="font-semibold text-gray-800">{endRecord}</span> of{' '}
              <span className="font-semibold text-gray-800">{totalCount}</span> entries
            </span>

            {onPageSizeChange && (
              <div className="flex items-center gap-1.5">
                <span>Per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  aria-label="Rows per page"
                  className="rounded border border-gray-300 bg-white py-1 px-2 text-xs text-gray-700 focus:border-indigo-600 focus:outline-none"
                >
                  {pageSizeOptions.map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Page navigation */}
          {onPageChange && totalPages > 1 && (
            <nav aria-label="Pagination" className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onPageChange(1)}
                disabled={page <= 1 || loading}
                aria-label="First page"
                className="rounded p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1 || loading}
                aria-label="Previous page"
                className="rounded p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <span className="px-2 font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages || loading}
                aria-label="Next page"
                className="rounded p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                disabled={page >= totalPages || loading}
                aria-label="Last page"
                className="rounded p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          )}
        </div>
      )}
    </div>
  )
}
