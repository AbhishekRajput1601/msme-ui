/**
 * SecretaryBatchesPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Batches screen matching legacy AngularJS implementation (batches.html).
 * Supports:
 *  - Batch list view with covering letter download and open batch
 *  - Batch detail view with per-application DTIC comment, assistance types,
 *    proposed amounts, assistance-level remarks overlay, Secretary comment selection
 *    (Recommended / Incomplete), mandatory note on Incomplete, View/Print and Progress
 *    Details links, and Submit / Forward to LDM.
 */

import React, { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  fetchBatches,
  fetchBatchDetail,
  submitSecretaryBatch,
  downloadCoveringLetter,
} from './secretaryService'
import './secretary.css'

export default function SecretaryBatchesPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [batches, setBatches] = useState([])
  const [activeBatch, setActiveBatch] = useState(null)
  const [responseObject, setResponseObject] = useState({ successMessage: null, errorMessage: null })

  // Assistance remark overlay state
  const [assistRemarkOpen, setAssistRemarkOpen] = useState(false)
  const [assistRemarkTitle, setAssistRemarkTitle] = useState('')
  const [assistRemarkText, setAssistRemarkText] = useState('')

  const loadData = useCallback(() => {
    const controller = new AbortController()

    fetchBatches('', controller.signal)
      .then((data) => {
        setBatches(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setResponseObject({ errorMessage: err.message || 'Failed to load batches.', successMessage: null })
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Open a batch and load its applications
  const openBatch = async (b) => {
    setLoading(true)
    setResponseObject({ successMessage: null, errorMessage: null })
    try {
      const detail = await fetchBatchDetail(b.batchId)
      // Ensure application remarks are initialized
      if (detail && Array.isArray(detail.applications)) {
        detail.applications = detail.applications.map((app) => ({
          ...app,
          remark: app.remark || '',
          remarkText: app.remarkText || '',
        }))
      }
      setActiveBatch(detail || b)
    } catch (err) {
      setResponseObject({ errorMessage: err.message || 'Failed to load batch details.', successMessage: null })
    } finally {
      setLoading(false)
    }
  }

  const closeBatch = () => {
    setActiveBatch(null)
  }

  const handleDownloadCoveringLetter = async (b) => {
    try {
      await downloadCoveringLetter(b.batchId, b.batchCode)
    } catch {
      setResponseObject({
        errorMessage: 'Covering letter is not available for this batch.',
        successMessage: null,
      })
      setTimeout(() => setResponseObject({ successMessage: null, errorMessage: null }), 5000)
    }
  }

  // Assistance remarks check & formatting
  const hasAssistanceRemark = (asst) => {
    return Boolean(asst && asst.remark && String(asst.remark).trim() !== '')
  }

  const assistanceAmountText = (asst) => {
    if (!asst || asst.eligibleAmount == null) return '-'
    if (Number(asst.eligibleAmount) === 0 && hasAssistanceRemark(asst)) return '--'
    return asst.eligibleAmount
  }

  const showAssistanceRemark = (asst) => {
    setAssistRemarkTitle((asst && asst.assistanceType) || 'Comment')
    setAssistRemarkText((asst && asst.remark) || '')
    setAssistRemarkOpen(true)
  }

  const closeAssistanceRemark = () => {
    setAssistRemarkOpen(false)
  }

  // Update application comment in active batch
  const handleAppRemarkChange = (index, value) => {
    if (!activeBatch || !activeBatch.applications) return
    const updated = [...activeBatch.applications]
    updated[index] = { ...updated[index], remark: value }
    setActiveBatch({ ...activeBatch, applications: updated })
  }

  // Update application note in active batch
  const handleAppNoteChange = (index, value) => {
    if (!activeBatch || !activeBatch.applications) return
    const updated = [...activeBatch.applications]
    updated[index] = { ...updated[index], remarkText: value }
    setActiveBatch({ ...activeBatch, applications: updated })
  }

  // View progress details
  const viewProgress = (app) => {
    const id = app.applicationId || app.applicationNo
    if (id) {
      navigate(`/department/secretary/progress/${id}/Unit`)
    }
  }

  // Forward Batch to LDM
  const submitBatch = async () => {
    const apps = (activeBatch && activeBatch.applications) || []
    if (apps.length === 0) {
      alert('This batch has no applications.')
      return
    }

    const actions = []
    for (let i = 0; i < apps.length; i++) {
      const a = apps[i]
      if (!a.remark) {
        alert('Every application must have a remark before forwarding the batch.')
        return
      }
      if (a.remark === 'Incomplete' && (!a.remarkText || !a.remarkText.trim())) {
        alert(`Remark Note is mandatory when the remark is "Incomplete" (application ${a.applicationNo}).`)
        return
      }
      actions.push({
        applicationNo: a.applicationNo,
        remark: a.remark,
        remarkText: a.remarkText,
        sanctionedAmount: a.sanctionedAmount,
      })
    }

    setSubmitting(true)
    setResponseObject({ successMessage: null, errorMessage: null })

    try {
      const res = await submitSecretaryBatch(activeBatch.batchId, actions)
      setResponseObject({
        successMessage: res?.successMessage || 'Batch forwarded to LDM successfully.',
        errorMessage: res?.errorMessage || null,
      })
      if (!res?.errorMessage) {
        setActiveBatch(null)
        loadData()
      }
    } catch (err) {
      setResponseObject({
        errorMessage: err.message || 'Something went wrong while submitting batch.',
        successMessage: null,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div id="page-wrapper" className="secretary-batches">
      <div className="row" style={{ marginTop: '15px' }}>
        <div className="col-md-12">
          <div className="panel panel-info">
            <div className="panel-heading" style={{ fontWeight: 'bold' }}>
              Secretary Verification &nbsp;&raquo;&nbsp; Batch-wise Processing
            </div>
            <div className="panel-body">
              {responseObject.successMessage && (
                <div className="alert alert-success" role="alert">
                  {responseObject.successMessage}
                </div>
              )}
              {responseObject.errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {responseObject.errorMessage}
                </div>
              )}

              {/* ─── 1. Batch List View ─────────────────────────────────────── */}
              {!activeBatch && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Batch</th>
                        <th>Applications</th>
                        <th>Covering Letter</th>
                        <th>Received</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center" style={{ padding: '20px' }}>
                            <i className="fa fa-spinner fa-spin fa-2x" /> Loading batches...
                          </td>
                        </tr>
                      ) : batches.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center">
                            No batches pending at your stage.
                          </td>
                        </tr>
                      ) : (
                        batches.map((b) => (
                          <tr key={b.batchId}>
                            <td>
                              <b>{b.batchCode}</b>
                            </td>
                            <td>{b.totalApplications}</td>
                            <td>{b.coveringLetterNo || '-'}</td>
                            <td>
                              {b.secretaryReceivedDate ||
                                b.ldmReceivedDate ||
                                b.collectorReceivedDate ||
                                '-'}
                            </td>
                            <td>
                              <span className="label label-info">{b.batchStatus}</span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-primary btn-xs"
                                onClick={() => openBatch(b)}
                                style={{ marginRight: '6px' }}
                              >
                                <i className="fa fa-folder-open" /> Open Batch
                              </button>
                              <button
                                type="button"
                                className="btn btn-info btn-xs"
                                onClick={() => handleDownloadCoveringLetter(b)}
                              >
                                <i className="fa fa-download" /> Additional Document
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ─── 2. Batch Detail View ───────────────────────────────────── */}
              {activeBatch && (
                <div>
                  <h4 style={{ marginTop: 0, marginBottom: '15px' }}>
                    {activeBatch.batchCode} &mdash; {activeBatch.totalApplications} application
                    <button
                      type="button"
                      className="btn btn-default btn-xs pull-right"
                      onClick={closeBatch}
                    >
                      <i className="fa fa-arrow-left" /> Back to batch list
                    </button>
                  </h4>

                  <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th width="4%">#</th>
                          <th>Application No.</th>
                          <th>Unit / Institution</th>
                          <th>Application Date</th>
                          <th>DTIC Comment</th>
                          <th>Assistance Type</th>
                          <th>Proposed Eligible Amount(Rs.)</th>
                          <th width="16%">
                            Comment <span style={{ color: 'red' }}>*</span>
                          </th>
                          <th width="18%">Remark / Note</th>
                          <th width="16%">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {!activeBatch.applications || activeBatch.applications.length === 0 ? (
                          <tr>
                            <td colSpan="10" className="text-center">
                              No applications in this batch.
                            </td>
                          </tr>
                        ) : (
                          activeBatch.applications.map((a, index) => (
                            <tr key={a.applicationNo || index}>
                              <td>{index + 1}</td>
                              <td>
                                <b>{a.applicationNo}</b>
                              </td>
                              <td>{a.unitOrInstName || '-'}</td>
                              <td>{a.applicationDate || '-'}</td>
                              <td>{a.gmRemark || '-'}</td>
                              <td>
                                {a.assistanceList && a.assistanceList.length > 0 ? (
                                  a.assistanceList.map((asst, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        height: '26px',
                                        lineHeight: '18px',
                                        padding: '4px 2px',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        borderBottom: '1px solid #eee',
                                        boxSizing: 'border-box',
                                      }}
                                    >
                                      {hasAssistanceRemark(asst) ? (
                                        <a
                                          href="javascript:void(0)"
                                          style={{
                                            color: '#0277bd',
                                            fontWeight: 600,
                                            textDecoration: 'underline',
                                          }}
                                          title="Click to view comment"
                                          onClick={() => showAssistanceRemark(asst)}
                                        >
                                          {asst.assistanceType || '-'}
                                        </a>
                                      ) : (
                                        <span>{asst.assistanceType || '-'}</span>
                                      )}
                                    </div>
                                  ))
                                ) : (
                                  <span>{a.assistanceType || '-'}</span>
                                )}
                              </td>
                              <td>
                                {a.assistanceList && a.assistanceList.length > 0 ? (
                                  a.assistanceList.map((asst, i) => (
                                    <div
                                      key={i}
                                      style={{
                                        height: '26px',
                                        lineHeight: '18px',
                                        padding: '4px 2px',
                                        overflow: 'hidden',
                                        borderBottom: '1px solid #eee',
                                        boxSizing: 'border-box',
                                      }}
                                    >
                                      {assistanceAmountText(asst)}
                                    </div>
                                  ))
                                ) : (
                                  <span>{a.eligibleAmount != null ? a.eligibleAmount : '-'}</span>
                                )}
                              </td>
                              <td>
                                <select
                                  className="form-control input-sm"
                                  value={a.remark || ''}
                                  onChange={(e) => handleAppRemarkChange(index, e.target.value)}
                                >
                                  <option value="">-- select --</option>
                                  <option value="Recommended">Recommended</option>
                                  <option value="Incomplete">Incomplete</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="text"
                                  maxLength={1000}
                                  className="form-control input-sm"
                                  value={a.remarkText || ''}
                                  onChange={(e) => handleAppNoteChange(index, e.target.value)}
                                  placeholder="Optional note"
                                />
                              </td>
                              <td>
                                <div className="action-buttons">
                                  <Link
                                    className="blue"
                                    to={`/department/secretary/fa/viewfaapplicantdetailunitnew/${a.applicationNo}`}
                                    style={{ color: '#337ab7', textDecoration: 'underline' }}
                                  >
                                    View/Print
                                  </Link>
                                  {' | '}
                                  <button
                                    type="button"
                                    className="btn btn-link btn-xs blue"
                                    style={{ padding: 0, color: '#337ab7', textDecoration: 'underline' }}
                                    onClick={() => viewProgress({ applicationId: a.applicationNo })}
                                  >
                                    Progress Details
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center" style={{ marginTop: '20px' }}>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={submitBatch}
                      disabled={submitting}
                    >
                      {submitting ? <i className="fa fa-spinner fa-spin" /> : null} Forward Batch to LDM
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assistance Remark Overlay Popup */}
      {assistRemarkOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,.5)',
              zIndex: 20000,
            }}
            onClick={closeAssistanceRemark}
          />
          <div
            style={{
              position: 'fixed',
              top: '18%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '480px',
              maxWidth: '92%',
              background: '#fff',
              borderRadius: '6px',
              boxShadow: '0 6px 24px rgba(0,0,0,.35)',
              zIndex: 20001,
            }}
          >
            <div
              style={{
                background: '#0277bd',
                color: '#fff',
                padding: '12px 16px',
                borderRadius: '6px 6px 0 0',
                fontWeight: 700,
              }}
            >
              {assistRemarkTitle}
            </div>
            <div
              style={{
                padding: '16px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '50vh',
                overflow: 'auto',
              }}
            >
              {assistRemarkText}
            </div>
            <div
              style={{
                padding: '10px 16px',
                textAlign: 'right',
                borderTop: '1px solid #eee',
              }}
            >
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={closeAssistanceRemark}
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
