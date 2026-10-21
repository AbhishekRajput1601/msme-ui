/**
 * SecretaryVerificationPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Verification screen matching legacy AngularJS implementation (verification.html).
 * Supports search, batch checkbox selection, inline remark entry, remarks popup modal,
 * remark history popup modal, full applicant detail view, progress history navigation,
 * Verify submission, and Query submission.
 */

import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchApplications,
  verifyApplications,
  queryApplications,
  fetchVerificationHistory,
} from './secretaryService'
import { toast } from '../../utils/toast'
import './secretary.css'

export default function SecretaryVerificationPage() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [applications, setApplications] = useState([])
  const [responseObject, setResponseObject] = useState({ successMessage: null, errorMessage: null })

  // Remarks popup modal state
  const [remarksModalApp, setRemarksModalApp] = useState(null)
  const [modalRemarkText, setModalRemarkText] = useState('')

  // Remarks history modal state
  const [historyModalAppNo, setHistoryModalAppNo] = useState(null)
  const [historyList, setHistoryList] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const isProcessed = (app) => {
    // Current status must be 20 (Meeting Agenda Generated) to be editable/selectable
    return app.currentStatusId != null && Number(app.currentStatusId) !== 20
  }

  const loadData = useCallback((search = '') => {
    const controller = new AbortController()

    fetchApplications(search, controller.signal)
      .then((data) => {
        const list = (Array.isArray(data) ? data : []).map((app) => ({
          ...app,
          selected: false,
          remark: app.remark || '',
        }))
        setApplications(list)
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          const msg = err.message || 'Failed to load applications.'
          setResponseObject({ errorMessage: msg, successMessage: null })
          toast.error(msg)
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
    loadData('')
  }, [loadData])

  const handleSearch = (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    loadData(searchText.trim())
  }

  const handleSelectAll = (checked) => {
    setApplications((prev) =>
      prev.map((app) => (isProcessed(app) ? app : { ...app, selected: checked })),
    )
  }

  const handleToggleSelect = (index) => {
    setApplications((prev) =>
      prev.map((app, i) => (i === index ? { ...app, selected: !app.selected } : app)),
    )
  }

  const handleRemarkChange = (index, value) => {
    setApplications((prev) =>
      prev.map((app, i) => (i === index ? { ...app, remark: value } : app)),
    )
  }

  const getSelected = () => {
    return applications
      .filter((a) => a.selected && !isProcessed(a))
      .map((a) => ({
        applicationNo: a.applicationId,
        remark: a.remark || '',
      }))
  }

  // Open Remarks popup
  const openRemarks = (app) => {
    setRemarksModalApp(app)
    setModalRemarkText(app.remark || '')
  }

  const saveRemarks = () => {
    if (!remarksModalApp) return
    setApplications((prev) =>
      prev.map((a) =>
        a.applicationId === remarksModalApp.applicationId
          ? { ...a, remark: modalRemarkText }
          : a,
      ),
    )
    setRemarksModalApp(null)
  }

  // Open History popup
  const openHistory = async (app) => {
    const appNo = app.applicationId
    setHistoryModalAppNo(appNo)
    setHistoryLoading(true)
    setHistoryList([])

    try {
      const data = await fetchVerificationHistory(appNo)
      setHistoryList(Array.isArray(data) ? data : [])
    } catch {
      setHistoryList([])
    } finally {
      setHistoryLoading(false)
    }
  }

  // View full detail page
  const viewDetail = (app) => {
    navigate(`/department/secretary/detail/${app.applicationId}`)
  }

  // View progress details
  const viewProgress = (app) => {
    const id = app.applicationId || app.applicationNo
    if (id) {
      navigate(`/department/secretary/progress/${id}/Unit`)
    }
  }

  // Submit: Verify (status -> 21)
  const submitVerify = async () => {
    const selected = getSelected()
    if (selected.length === 0) {
      toast.warning('Please select at least one application.')
      return
    }
    if (!window.confirm(`Verify ${selected.length} selected application(s)?`)) {
      return
    }

    setSubmitting(true)
    setResponseObject({ successMessage: null, errorMessage: null })

    try {
      const res = await verifyApplications(selected)
      if (res && res.errorMessage) {
        toast.error(res.errorMessage)
        setResponseObject({ errorMessage: res.errorMessage, successMessage: null })
      } else {
        const msg = res?.successMessage || 'Applications verified successfully.'
        toast.success(msg)
        setResponseObject({
          successMessage: msg,
          errorMessage: null,
        })
        loadData(searchText.trim())
      }
    } catch (err) {
      const msg = err.message || 'Something went wrong. Please try again.'
      toast.error(msg)
      setResponseObject({ errorMessage: msg, successMessage: null })
    } finally {
      setSubmitting(false)
    }
  }

  // Submit: Query (status -> 5, back to DTIC)
  const submitQuery = async () => {
    const selected = getSelected()
    if (selected.length === 0) {
      toast.warning('Please select at least one application.')
      return
    }
    if (!window.confirm(`Raise query on ${selected.length} selected application(s)? They will be sent back to DTIC.`)) {
      return
    }

    setSubmitting(true)
    setResponseObject({ successMessage: null, errorMessage: null })

    try {
      const res = await queryApplications(selected)
      if (res && res.errorMessage) {
        toast.error(res.errorMessage)
        setResponseObject({ errorMessage: res.errorMessage, successMessage: null })
      } else {
        const msg = res?.successMessage || 'Query raised. Applications sent back to DTIC.'
        toast.success(msg)
        setResponseObject({
          successMessage: msg,
          errorMessage: null,
        })
        loadData(searchText.trim())
      }
    } catch (err) {
      const msg = err.message || 'Something went wrong. Please try again.'
      toast.error(msg)
      setResponseObject({ errorMessage: msg, successMessage: null })
    } finally {
      setSubmitting(false)
    }
  }

  const allEligibleSelected =
    applications.length > 0 &&
    applications.every((a) => isProcessed(a) || a.selected)

  return (
    <div id="page-wrapper" className="secretary-verification">
      <div className="row" style={{ marginTop: '15px' }}>
        <div className="col-md-12">
          <div className="panel panel-info">
            <div className="panel-heading" style={{ fontWeight: 'bold' }}>
              Secretary Verification &nbsp;&raquo;&nbsp; Status: Meeting Agenda Generated (mapped district)
            </div>
            <div className="panel-body">
              {/* Search filter row */}
              <div className="row" style={{ marginBottom: '15px' }}>
                <div className="col-md-6">
                  <form onSubmit={handleSearch} className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by application no / unit name"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="submit" disabled={loading}>
                        <i className="fa fa-search fa-fw" /> Search
                      </button>
                    </span>
                  </form>
                </div>
              </div>

              {/* Applications table */}
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th width="4%" style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          title="Select / Deselect all"
                          checked={allEligibleSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          disabled={applications.length === 0}
                        />
                      </th>
                      <th width="5%">S.No.</th>
                      <th>Application No.</th>
                      <th>Unit / Institution</th>
                      <th>Application Date</th>
                      <th>Status</th>
                      <th width="24%">Remark</th>
                      <th width="14%" style={{ textAlign: 'center' }}>
                        Progress / Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center" style={{ padding: '20px' }}>
                          <i className="fa fa-spinner fa-spin fa-2x fa-fw" /> Loading applications...
                        </td>
                      </tr>
                    ) : applications.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center">
                          No applications pending verification.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app, index) => {
                        const processed = isProcessed(app)
                        return (
                          <tr key={app.applicationId || index}>
                            <td align="center">
                              <input
                                type="checkbox"
                                checked={!!app.selected}
                                disabled={processed}
                                onChange={() => handleToggleSelect(index)}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>
                              <b>{app.applicationId}</b>
                            </td>
                            <td>{app.unitOrInstName || '-'}</td>
                            <td>{app.applicationDate || '-'}</td>
                            <td>
                              <span className="label label-info">{app.status || 'Meeting Agenda Generated'}</span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  className="form-control input-sm"
                                  maxLength={2000}
                                  value={app.remark || ''}
                                  onChange={(e) => handleRemarkChange(index, e.target.value)}
                                  placeholder="Enter remark"
                                  style={{ display: 'inline-block', width: '80%', marginRight: '6px' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-default btn-sm"
                                  onClick={() => openRemarks(app)}
                                  title="Open remarks popup"
                                >
                                  <i className="fa fa-edit" />
                                </button>
                              </div>
                            </td>
                            <td align="center">
                              <button
                                type="button"
                                className="btn btn-primary btn-xs"
                                onClick={() => viewDetail(app)}
                                title="View full applicant details"
                                style={{ marginBottom: '4px' }}
                              >
                                <i className="fa fa-eye" /> View
                              </button>
                              <br />
                              <button
                                type="button"
                                className="btn btn-link btn-xs"
                                style={{ padding: 0, textDecoration: 'underline' }}
                                onClick={() => viewProgress(app)}
                              >
                                Progress Details
                              </button>
                              <br />
                              <button
                                type="button"
                                className="btn btn-link btn-xs"
                                style={{ padding: 0, textDecoration: 'underline' }}
                                onClick={() => openHistory(app)}
                              >
                                Remarks
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action buttons */}
              {applications.length > 0 && (
                <div className="text-center" style={{ marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={submitVerify}
                    disabled={submitting}
                    style={{ marginRight: '10px' }}
                  >
                    {submitting ? <i className="fa fa-spinner fa-spin" /> : null} Submit (Verify)
                  </button>
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={submitQuery}
                    disabled={submitting}
                  >
                    {submitting ? <i className="fa fa-spinner fa-spin" /> : null} Query Raised
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Remarks Popup Modal */}
      {remarksModalApp && (
        <>
          <div className="secretary-modal-backdrop" onClick={() => setRemarksModalApp(null)} />
          <div className="secretary-modal-dialog" role="dialog" aria-modal="true">
            <div className="modal-header" style={{ padding: '15px', borderBottom: '1px solid #e5e5e5' }}>
              <button
                type="button"
                className="close pull-right"
                onClick={() => setRemarksModalApp(null)}
                style={{ fontSize: '21px', fontWeight: 'bold', border: 0, background: 'none' }}
              >
                &times;
              </button>
              <h4 className="modal-title" style={{ margin: 0 }}>
                Remarks - {remarksModalApp.applicationId}
              </h4>
            </div>
            <div className="modal-body" style={{ padding: '15px' }}>
              <select
                className="form-control"
                style={{ marginBottom: '10px' }}
                onChange={(e) => {
                  if (e.target.value) {
                    setModalRemarkText(e.target.value)
                  }
                }}
                defaultValue=""
              >
                <option value="">-- Preset (optional) --</option>
                <option value="Verified">Verified</option>
                <option value="Document Missing">Document Missing</option>
                <option value="Need Clarification">Need Clarification</option>
              </select>
              <textarea
                className="form-control"
                rows={4}
                maxLength={2000}
                value={modalRemarkText}
                onChange={(e) => setModalRemarkText(e.target.value)}
                placeholder="Enter remark"
              />
            </div>
            <div className="modal-footer" style={{ padding: '15px', textAlign: 'right', borderTop: '1px solid #e5e5e5' }}>
              <button type="button" className="btn btn-success" onClick={saveRemarks} style={{ marginRight: '5px' }}>
                Save
              </button>
              <button type="button" className="btn btn-default" onClick={() => setRemarksModalApp(null)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Remark History Modal */}
      {historyModalAppNo && (
        <>
          <div className="secretary-modal-backdrop" onClick={() => setHistoryModalAppNo(null)} />
          <div className="secretary-modal-dialog modal-lg" role="dialog" aria-modal="true">
            <div className="modal-header" style={{ padding: '15px', borderBottom: '1px solid #e5e5e5' }}>
              <button
                type="button"
                className="close pull-right"
                onClick={() => setHistoryModalAppNo(null)}
                style={{ fontSize: '21px', fontWeight: 'bold', border: 0, background: 'none' }}
              >
                &times;
              </button>
              <h4 className="modal-title" style={{ margin: 0 }}>
                Remark History - {historyModalAppNo}
              </h4>
            </div>
            <div className="modal-body" style={{ padding: '15px', maxHeight: '400px', overflowY: 'auto' }}>
              {historyLoading ? (
                <div className="text-center" style={{ padding: '20px' }}>
                  <i className="fa fa-spinner fa-spin fa-2x" /> Loading history...
                </div>
              ) : (
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Action</th>
                      <th>Remark</th>
                      <th>By</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No history yet.
                        </td>
                      </tr>
                    ) : (
                      historyList.map((h, i) => (
                        <tr key={i}>
                          <td>{h.roleName || '-'}</td>
                          <td>{h.actionStatus || '-'}</td>
                          <td>{h.remarks || '-'}</td>
                          <td>{h.verifiedBy || '-'}</td>
                          <td>{h.verifiedDate || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer" style={{ padding: '15px', textAlign: 'right', borderTop: '1px solid #e5e5e5' }}>
              <button type="button" className="btn btn-default" onClick={() => setHistoryModalAppNo(null)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
