/**
 * SecretaryProgressPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Progress Details page matching legacy AngularJS implementation (faHistory.html).
 * Replicates the exact request details table and complete progress history table,
 * secured under Secretary role endpoints without calling unauthorized applicant URLs.
 */

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchApplicationDetail,
  fetchProgressHistory,
} from './secretaryService'
import toast from '../../utils/toast'
import './secretary.css'

export default function SecretaryProgressPage() {
  const { applicationNo, establishmentType = 'Unit' } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [applicantInfo, setApplicantInfo] = useState({})
  const [historyList, setHistoryList] = useState([])

  const handleViewAction = (bean) => {
    const status = bean?.status || ''
    if (status === 'Disbursement Letter Released') {
      navigate(`/department/secretary/fa/viewfaDisbursementUnit/${applicationNo}/${establishmentType || 'Unit'}`)
    } else if (status === 'DLAC Sanction Order Uploaded' || status === 'Sanction Order Uploaded') {
      navigate(`/department/secretary/fa/viewfaacceptanceamountdetailunit/${applicationNo}/${establishmentType || 'Unit'}`)
    } else {
      navigate(`/department/secretary/detail/${applicationNo}`)
    }
  }

  useEffect(() => {
    if (!applicationNo) return
    const controller = new AbortController()

    Promise.allSettled([
      fetchApplicationDetail(applicationNo, controller.signal),
      fetchProgressHistory(applicationNo, controller.signal),
    ])
      .then(([detailRes, historyRes]) => {
        if (!controller.signal.aborted) {
          if (detailRes.status === 'fulfilled' && detailRes.value) {
            const d = detailRes.value
            setApplicantInfo({
              applicationId: d.applicationId || applicationNo,
              fullName:
                d.fullName ||
                (d.firstName
                  ? `${d.firstName} ${d.middleName || ''} ${d.lastName || ''}`.trim()
                  : `${d.poaFirstName || ''} ${d.poaLastName || ''}`.trim()) ||
                d.indOrgName ||
                '-',
              unitOrInstName: d.indOrgName || d.unitName || d.firmEntityName2 || '-',
              districtName: d.district || d.permanentDistrict || '-',
            })
          } else {
            setApplicantInfo({
              applicationId: applicationNo,
              fullName: '-',
              unitOrInstName: '-',
              districtName: '-',
            })
          }

          if (historyRes.status === 'fulfilled' && Array.isArray(historyRes.value)) {
            setHistoryList(historyRes.value)
          } else {
            setHistoryList([])
          }
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          toast.error(err.message || 'Failed to load progress details.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [applicationNo])

  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/department/secretary/verification')
    }
  }

  return (
    <div id="page-wrapper" className="secretary-progress-page" style={{ padding: '15px' }}>
      <div className="panel panel-info">
        <div className="panel-heading" style={{ overflow: 'hidden', lineHeight: '28px' }}>
          <span>
            Financial Assistance &nbsp;&raquo;&nbsp;{' '}
            <a
              href="#fa/newapplicantform"
              onClick={(e) => {
                e.preventDefault()
                navigate('/department/secretary/verification')
              }}
              style={{ textDecoration: 'none', color: '#31708f' }}
            >
              Industrial Unit
            </a>{' '}
            &nbsp;&raquo;&nbsp;{' '}
            <b>View Progress Details ({applicationNo})</b>
          </span>
          <span className="pull-right">
            <button
              type="button"
              className="btn btn-default btn-xs"
              onClick={handleBack}
            >
              <i className="fa fa-arrow-left" /> Back
            </button>
          </span>
        </div>

        <div className="panel-body">
          {/* Print instruction bar */}
          <div className="row" style={{ marginBottom: '15px' }}>
            <div className="col-md-6 text-left">
              <div style={{ fontWeight: 'bold', color: '#c00', fontSize: '13px' }}>
                Please click on Print Button for Printing of this Form.
              </div>
            </div>
            <div className="col-md-6 text-right">
              <button
                type="button"
                className="btn btn-default btn-sm"
                onClick={handlePrint}
                title="Print Filled Form"
              >
                <i className="fa fa-print fa-fw" /> Print
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center" style={{ padding: '30px' }}>
              <i className="fa fa-spinner fa-spin fa-2x" /> Loading progress details...
            </div>
          ) : (
            <div
              id="printable-progress"
              style={{
                border: '2px solid #333',
                padding: '15px',
                marginBottom: '15px',
                background: '#fff',
              }}
            >
              {/* Header Box */}
              <div
                style={{
                  border: '1px solid #333',
                  padding: '10px',
                  textAlign: 'center',
                  marginBottom: '15px',
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  Govt. of Madhya Pradesh,
                </div>
                <div style={{ fontSize: '15px' }}>
                  Department of Micro, Small &amp; Medium Enterprises
                </div>
                <div style={{ color: '#8b0000', fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
                  Financial Assistance : Progress Details
                </div>
              </div>

              {/* Request Details Table */}
              <table
                className="table table-bordered"
                style={{ marginBottom: '20px', fontSize: '13px' }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        backgroundColor: '#eee',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                    >
                      Request Details
                    </td>
                  </tr>
                  <tr>
                    <td width="25%">
                      <label style={{ margin: 0 }}>Application No.</label>
                    </td>
                    <td width="25%">{applicantInfo.applicationId || applicationNo}</td>
                    <td width="25%">
                      <label style={{ margin: 0 }}>Authorised Person Name</label>
                    </td>
                    <td width="25%">{applicantInfo.fullName || '-'}</td>
                  </tr>
                  <tr>
                    <td>
                      <label style={{ margin: 0 }}>Enterprise Name</label>
                    </td>
                    <td>{applicantInfo.unitOrInstName || '-'}</td>
                    <td>
                      <label style={{ margin: 0 }}>District</label>
                    </td>
                    <td>{applicantInfo.districtName || '-'}</td>
                  </tr>
                </tbody>
              </table>

              {/* Progress Details Table */}
              <div className="table-responsive">
                <table
                  className="table table-bordered table-striped"
                  style={{ fontSize: '13px', marginBottom: 0 }}
                >
                  <thead>
                    <tr>
                      <th
                        colSpan="8"
                        style={{
                          backgroundColor: '#eee',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        Progress Details
                      </th>
                    </tr>
                    <tr>
                      <th width="5%" style={{ textAlign: 'center' }}>S. No.</th>
                      <th width="14%">Status</th>
                      <th width="14%">Assigner</th>
                      <th>Remarks</th>
                      <th width="14%">Assignee</th>
                      <th width="14%">Created Date</th>
                      <th width="14%">Decision Date</th>
                      <th width="8%" style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyList.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center" style={{ padding: '15px' }}>
                          No progress history found.
                        </td>
                      </tr>
                    ) : (
                      historyList.map((bean, idx) => {
                        const hideAction =
                          bean.status === 'Commitee Approved' ||
                          bean.status === 'Query Replied' ||
                          bean.status === 'Queried'

                        return (
                          <tr key={idx}>
                            <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                            <td>
                              <span className="label label-info">{bean.status || '-'}</span>
                            </td>
                            <td>{bean.assigner || '-'}</td>
                            <td>{bean.comments || '-'}</td>
                            <td>{bean.assignee || '-'}</td>
                            <td>{bean.createdDate || '-'}</td>
                            <td>{bean.decisionDate || '-'}</td>
                            <td style={{ textAlign: 'center' }}>
                              {!hideAction && (
                                <button
                                  type="button"
                                  className="btn btn-primary btn-xs"
                                  onClick={() => handleViewAction(bean)}
                                  title="View"
                                >
                                  View
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="text-center" style={{ marginTop: '15px' }}>
            <button
              type="button"
              className="btn btn-default"
              onClick={handleBack}
            >
              <i className="fa fa-arrow-left" /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
