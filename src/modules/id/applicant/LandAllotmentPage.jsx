/**
 * LandAllotmentPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Vacant Industrial Land Parcels Explorer matching AngularJS vacantLandList.html.
 *
 * Structure:
 *  • panel panel-info with panel-heading: Infrastructure Development >> Vacant Land Allotment
 *  • table table-striped table-bordered table-hover
 *  • Action links to inspect plot details and proceed to application
 */

import React, { useState, useEffect, useCallback } from 'react'
import { canApplyToParcel } from './landApplicationModel'
import { Link } from 'react-router-dom'
import { displayNumber } from '../../../api/responseData'
import { fetchAllLandAllotmentList } from './services/idApplicantService'
import Modal from '../../../components/modals/Modal'
import Button from '../../../components/ui/Button'

export default function LandAllotmentPage() {
  const [parcels, setParcels] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Table parameters
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')

  // Modal inspection of plot
  const [selectedParcel, setSelectedParcel] = useState(null)

  const loadParcels = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchAllLandAllotmentList({
        page,
        pageSize,
        searchQuery,
      })
      setParcels(response.data || [])
      setTotalCount(response.totalCount || 0)
    } catch (err) {
      setError(err?.message || 'Failed to load land parcels')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, searchQuery])

  useEffect(() => {
    loadParcels()
  }, [loadParcels])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="space-y-4">
      {/* ─── Exact AngularJS Panel Header (panel panel-info) ─────────────── */}
      <div className="panel panel-info">
        <div className="panel-heading flex items-center justify-between">
          <div>
            <span>Infrastructure Development</span> &gt;&gt; <span>Vacant Land Allotment</span>
          </div>
          <Link
            to="/applicant/land-allotment"
            className="text-xs bg-[#337ab7] hover:bg-[#286090] text-white px-3 py-1.5 rounded font-normal transition-colors"
          >
            <i className="fa fa-list mr-1"></i> My Applications
          </Link>
        </div>

        <div className="panel-body">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 text-xs text-[#333]">
            <div className="flex items-center gap-2">
              <label htmlFor="allotmentPageSizeSelect" className="font-normal">Show</label>
              <select
                id="allotmentPageSizeSelect"
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
              <label htmlFor="allotmentSearchParamInput" className="font-normal">Search Area / District:</label>
              <input
                id="allotmentSearchParamInput"
                type="text"
                placeholder="Plot / Industrial Area..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="border border-[#ccc] rounded px-2.5 py-1 text-xs w-48 sm:w-64 focus:outline-none focus:border-[#337ab7]"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr>
                  <th style={{ width: '40px', textAlign: 'center' }}>S.No.</th>
                  <th>Plot Number</th>
                  <th>Industrial Area</th>
                  <th>District</th>
                  <th style={{ textAlign: 'right' }}>Plot Area (Sq. Mtr.)</th>
                  <th style={{ textAlign: 'right' }}>Estimated Cost (₹)</th>
                  <th style={{ textAlign: 'right' }}>Premium (₹)</th>
                  <th style={{ textAlign: 'right' }}>Lease Rent (₹/yr)</th>
                  <th>Land Category</th>
                  <th style={{ textAlign: 'center', width: '140px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-500">
                      <i className="fa fa-spinner fa-spin mr-2"></i> Loading vacant industrial parcels...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-red-600">
                      <div>Failed to load parcels: {error}</div>
                      <button
                        type="button"
                        onClick={loadParcels}
                        className="mt-2 text-xs text-[#337ab7] underline"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : parcels.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-gray-400">
                      No vacant land parcels currently available matching criteria.
                    </td>
                  </tr>
                ) : (
                  parcels.map((parcel, idx) => (
                    <tr key={parcel.vacantLandId || idx}>
                      <td style={{ textAlign: 'center' }}>{(page - 1) * pageSize + idx + 1}</td>
                      <td className="font-bold text-[#337ab7] font-mono">{parcel.plotNumber}</td>
                      <td className="font-semibold text-gray-800">{parcel.industrialAreaName}</td>
                      <td>{parcel.districtName}</td>
                      <td style={{ textAlign: 'right' }} className="font-mono">
                        {displayNumber(parcel.totalPlotArea)}
                      </td>
                      <td style={{ textAlign: 'right' }} className="font-mono text-gray-900 font-semibold">
                        ₹{displayNumber(parcel.totalAmount)}
                      </td>
                      <td style={{ textAlign: 'right' }} className="font-mono text-xs">
                        ₹{displayNumber(parcel.premiumCharges)}
                      </td>
                      <td style={{ textAlign: 'right' }} className="font-mono text-xs">
                        ₹{displayNumber(parcel.leaseRent)}
                      </td>
                      <td>
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 border border-blue-200">
                          {parcel.category || '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }} className="action-buttons">
                        <button
                          type="button"
                          onClick={() => setSelectedParcel(parcel)}
                          className="text-[#337ab7] hover:underline font-semibold"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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

      {/* Parcel Detail Modal */}
      {selectedParcel && (
        <Modal
          isOpen={Boolean(selectedParcel)}
          onClose={() => setSelectedParcel(null)}
          title={`Industrial Parcel: ${selectedParcel.plotNumber}`}
          description={`${selectedParcel.industrialAreaName}, ${selectedParcel.districtName}`}
          footer={
            <div className="flex justify-end gap-2">
              {canApplyToParcel(selectedParcel) && <Link className="btn btn-primary" to={`/applicant/land-allotment/${/undeveloped land/i.test(selectedParcel.industrialAreaName || '') ? 'instructions-undeveloped' : 'instructions'}/${encodeURIComponent(selectedParcel.vcId)}`}>Apply for this plot</Link>}
              <Button variant="secondary" onClick={() => setSelectedParcel(null)}>
                Close
              </Button>
<span role="status">Application submission is currently unavailable.</span>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-gray-50 border border-gray-200 p-2.5 rounded">
              <span className="text-gray-500 block font-semibold">Total Plot Area</span>
              <span className="font-bold text-gray-900 text-sm mt-0.5 block">{selectedParcel.totalPlotArea} Sq. Mtr.</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-2.5 rounded">
              <span className="text-gray-500 block font-semibold">Total Estimated Cost</span>
              <span className="font-bold text-indigo-700 text-sm mt-0.5 block">
                ₹{displayNumber(selectedParcel.totalAmount)}
              </span>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-2.5 rounded">
              <span className="text-gray-500 block font-semibold">Premium Charges (25%)</span>
              <span className="font-semibold text-gray-800 text-xs mt-0.5 block">
                ₹{displayNumber(selectedParcel.premiumCharges)}
              </span>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-2.5 rounded">
              <span className="text-gray-500 block font-semibold">Annual Lease Rent</span>
              <span className="font-semibold text-gray-800 text-xs mt-0.5 block">
                ₹{displayNumber(selectedParcel.leaseRent)} / year
              </span>
            </div>
            <div className="col-span-2 bg-[#d9edf7] border border-[#bce8f1] p-3 rounded text-[#31708f]">
              <strong className="block mb-1">Industrial Infrastructure:</strong>
              {selectedParcel.infrastructureDetails || 'No infrastructure details supplied.'}
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
