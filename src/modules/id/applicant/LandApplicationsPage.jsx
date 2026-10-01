/**
 * LandApplicationsPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Replicates the exact AngularJS applicationList.html layout, styling, and action flows.
 *
 * Structure:
 *  • panel panel-info with panel-heading: Infrastructure Development >> Applications List
 *  • table table-striped table-bordered table-hover matching the legacy DataTables view
 *  • Exact columns: S.No, Application ID, Application Date, Industrial Area,
 *    Plot Number, Inspection Date, Payment Details, Status, Comments, Actions
 *  • Action links separated by pipes: View | Progress Details | Download LOI | ...
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchApplicationList,
  getDownloadLOILetterUrl,
  getDownloadLeaseLetterUrl,
  getDownloadAllotmentLetterUrl,
  getDownloadPossessionLetterUrl,
  getDownloadEsignedDocumentUrl,
} from './services/idApplicantService'
import ApplicationStatusBadge from './components/ApplicationStatusBadge'

export default function LandApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Table parameters matching legacy DataTables
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchApplicationList({
        page,
        pageSize,
        searchQuery,
      })
      setApplications(response.data || [])
      setTotalCount(response.totalCount || 0)
    } catch (err) {
      setError(err?.message || 'Failed to fetch application list')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, searchQuery])

  useEffect(() => {
    loadData()
  }, [loadData])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="space-y-4">
      {/* ─── Exact AngularJS Panel Header (panel panel-info) ─────────────── */}
      <div className="panel panel-info">
        <div className="panel-heading flex items-center justify-between">
          <div>
            <span>Infrastructure Development</span> &gt;&gt; <span>Applications List</span>
          </div>
          <Link
            to="/applicant/land-allotment/new"
            className="text-xs bg-[#337ab7] hover:bg-[#286090] text-white px-3 py-1.5 rounded font-normal transition-colors"
          >
            <i className="fa fa-plus-circle mr-1"></i> Apply for Land
          </Link>
        </div>

        <div className="panel-body">
          <p><Link to="/applicant/land-allotment/annual">Annual payments and history</Link>{' | '}<Link to="/applicant/land-allotment/notices">Notices and appeals</Link>{' | '}<Link to="/applicant/land-allotment/payment-enquiry">Check treasury status</Link></p>
          {/* Search & Page Length Controls (Bootstrap DataTables Style) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 text-xs text-[#333]">
            <div className="flex items-center gap-2">
              <label htmlFor="pageSizeSelect" className="font-normal">Show</label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setPage(1)
                }}
                className="border border-[#ccc] rounded px-2 py-1 bg-white text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="searchParamInput" className="font-normal">Search:</label>
              <input
                id="searchParamInput"
                type="text"
                placeholder="Application ID / Area..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="border border-[#ccc] rounded px-2.5 py-1 text-xs w-48 sm:w-64 focus:outline-none focus:border-[#337ab7]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fa fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {/* Table Container matching #dynamic-table in applicationList.html */}
          <div className="overflow-x-auto">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>S.No.</th>
                  <th>Application ID</th>
                  <th>Application Date</th>
                  <th>Industrial Area</th>
                  <th>Plot Number</th>
                  <th>Inspection Date</th>
                  <th>Payment Details</th>
                  <th>Application Status</th>
                  <th>DTIC Comments</th>
                  <th style={{ minWidth: '220px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-500">
                      <i className="fa fa-spinner fa-spin mr-2"></i> Loading applications data...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-red-600">
                      <div>Failed to load applications: {error}</div>
                      <button
                        type="button"
                        onClick={loadData}
                        className="mt-2 text-xs text-[#337ab7] underline"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-400">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  applications.map((row, idx) => {
                    const statusText = (row.status || '').toLowerCase()
                    const vacantLand = row.vacantLandBean || {}

                    return (
                      <tr key={row.applicantId || idx}>
                        {/* 1. S.No. */}
                        <td style={{ textAlign: 'center' }}>{(page - 1) * pageSize + idx + 1}</td>

                        {/* 2. Application ID */}
                        <td>
                          <Link
                            to={`/applicant/land-allotment/detail/${row.applicantId}`}
                            className="text-[#337ab7] font-bold hover:underline"
                          >
                            {row.applicationId || `APP-${row.applicantId}`}
                          </Link>
                          {row.isApplicationFormEsigned && (
                            <div className="text-[10px] text-emerald-700 font-semibold">
                              <i className="fa fa-check-circle mr-1"></i>eSigned
                            </div>
                          )}
                        </td>

                        {/* 3. Application Date */}
                        <td>{row.submittedOn || '-'}</td>

                        {/* 4. Industrial Area */}
                        <td>{vacantLand.industrialAreaName || '-'}</td>

                        {/* 5. Plot Number */}
                        <td className="font-semibold text-gray-800">{vacantLand.plotNumber || '-'}</td>

                        {/* 6. Inspection Date */}
                        <td>{row.decisionDate || '-'}</td>

                        {/* 7. Payment Details */}
                        <td>
                          {row.paymentStatus ? (
                            <span
                              className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                row.paymentStatus === 'PAID'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {row.paymentStatus}
                            </span>
                          ) : (
                            '-'
                          )}
                          {row.paymentChallanNo && (
                            <div className="text-[10px] text-gray-500 font-mono">
                              {row.paymentChallanNo}
                            </div>
                          )}
                        </td>

                        {/* 8. Application Status */}
                        <td>
                          <ApplicationStatusBadge status={row.status} />
                        </td>

                        {/* 9. DTIC Comments */}
                        <td className="text-xs text-gray-600 max-w-[200px] truncate" title={row.dticComments || row.comments}>
                          {row.dticComments || row.comments || '-'}
                        </td>

                        {/* 10. Actions matching Angular's action-buttons template */}
                        <td className="action-buttons">
                          {Number(row.statusId) === 1 && row.vacantLandIDEncrypt && <><Link to={`/applicant/land-allotment/edit/${row.applicantId}/${encodeURIComponent(row.vacantLandIDEncrypt)}`}>Continue draft</Link>{' | '}</>}
                          {Number(row.statusId) === 5 && row.vacantLandIDEncrypt && <><Link to={`/applicant/land-allotment/query/${row.applicantId}/${encodeURIComponent(row.vacantLandIDEncrypt)}`}>Reply to query</Link>{' | '}</>}
                          {Number(row.statusId) >= 2 && row.ctPaymentBean && (row.signedApplicationFormUploadDocId ? <><a href={getDownloadEsignedDocumentUrl(row.signedApplicationFormUploadDocId)} target="_blank" rel="noreferrer">Download signed application</a>{' | '}</> : row.vacantLandIDEncrypt && <><Link to={`/applicant/land-allotment/sign/${row.applicantId}/${encodeURIComponent(row.vacantLandIDEncrypt)}`}>Sign application</Link>{' | '}</>)}
                          <Link to={`/applicant/land-allotment/detail/${row.applicantId}`}>
                            View
                          </Link>
                          {' | '}
                          <Link to={`/applicant/land-allotment/history/${row.applicantId}`}>
                            Progress Details
                          </Link>

                          {statusText.includes('loi') && (
                            <>
                              {' | '}
                              <a
                                href={getDownloadLOILetterUrl(row.applicantId)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Download LOI
                              </a>
                            </>
                          )}

                          {statusText.includes('allot') && (
                            <>
                              {' | '}
                              <a
                                href={getDownloadAllotmentLetterUrl(row.applicantId)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Download Allotment
                              </a>
                            </>
                          )}

                          {statusText.includes('lease') && (
                            <>
                              {' | '}
                              <a
                                href={getDownloadLeaseLetterUrl(row.applicantId)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Download Lease
                              </a>
                            </>
                          )}

                          {statusText.includes('possession') && (
                            <>
                              {' | '}
                              <a
                                href={getDownloadPossessionLetterUrl(row.applicantId)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Possession Letter
                              </a>
                            </>
                          )}

                          {row.signedApplicationFormUploadDocId && (
                            <>
                              {' | '}
                              <a
                                href={getDownloadEsignedDocumentUrl(row.signedApplicationFormUploadDocId)}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Signed Form
                              </a>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer matching Bootstrap DataTables info & paging */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#eee] text-xs text-gray-600">
            <div>
              Showing {totalCount === 0 ? 0 : (page - 1) * pageSize + 1} to{' '}
              {Math.min(page * pageSize, totalCount)} of {totalCount} entries
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 border border-[#ccc] rounded bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 font-bold text-[#337ab7]">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 border border-[#ccc] rounded bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
