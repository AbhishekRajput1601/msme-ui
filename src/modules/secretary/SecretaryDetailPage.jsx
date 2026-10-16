/**
 * SecretaryDetailPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Applicant Full Details screen matching legacy AngularJS implementation (detail.html).
 * Provides read-only aggregated view of all applicant data across 15 distinct sections:
 *  1. Basic & Personal Information
 *  2. Contact Details
 *  3. Present Address
 *  4. Permanent Address
 *  5. Enterprise / Firm Details
 *  6. Bank Details
 *  7. Scheme Details
 *  8. Unit / Business Details
 *  9. Employment Generated
 * 10. Financial / Capital Investment Details
 * 11. Land / Building Details
 * 12. Assistance-wise Eligible Amount
 * 13. Financial Assistance (DTIC)
 * 14. Uploaded Documents (with download support)
 * 15. Verification Remarks & History
 */

import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchApplicationDetail,
  fetchVerificationHistory,
  fetchDticEligible,
  fetchApplicantAssistances,
  downloadUploadedDoc,
  extractUploadedDocuments,
} from './secretaryService'
import './secretary.css'

export default function SecretaryDetailPage() {
  const { applicationNo } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailHistory, setDetailHistory] = useState([])
  const [dticInfo, setDticInfo] = useState({})
  const [assistanceList, setAssistanceList] = useState([])

  useEffect(() => {
    if (!applicationNo) return
    const controller = new AbortController()

    Promise.allSettled([
      fetchApplicationDetail(applicationNo, controller.signal),
      fetchVerificationHistory(applicationNo, controller.signal),
      fetchDticEligible(applicationNo, controller.signal),
      fetchApplicantAssistances(applicationNo, controller.signal),
    ])
      .then(([detailResult, historyResult, dticResult, asstResult]) => {
        if (!controller.signal.aborted) {
          if (detailResult.status === 'fulfilled' && detailResult.value) {
            setDetail(detailResult.value)
          } else if (detailResult.status === 'rejected') {
            setError(detailResult.reason?.message || 'Applicant details could not be loaded from backend.')
          }
          if (historyResult.status === 'fulfilled' && Array.isArray(historyResult.value)) {
            setDetailHistory(historyResult.value)
          }
          if (dticResult.status === 'fulfilled' && dticResult.value) {
            setDticInfo(dticResult.value)
          }
          if (asstResult.status === 'fulfilled' && Array.isArray(asstResult.value)) {
            setAssistanceList(asstResult.value)
          }
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [applicationNo])

  const documentList = useMemo(() => {
    return extractUploadedDocuments(detail)
  }, [detail])

  const viewProgress = () => {
    const id = detail?.applicationId || applicationNo
    if (id) {
      navigate(`/department/secretary/progress/${id}/Unit`)
    }
  }

  const handleDownloadDoc = async (doc) => {
    try {
      await downloadUploadedDoc(doc.id, detail?.applicationId || applicationNo, doc.label)
    } catch {
      alert('Document not available for download.')
    }
  }

  const applicantName =
    detail?.fullName ||
    (detail?.firstName
      ? `${detail.firstName} ${detail.middleName || ''} ${detail.lastName || ''}`.trim()
      : `${detail?.poaFirstName || ''} ${detail?.poaLastName || ''}`.trim()) ||
    detail?.indOrgName ||
    '-'

  return (
    <div id="page-wrapper" className="secretary-detail-container">
      <div className="row" style={{ marginTop: '15px' }}>
        <div className="col-md-12">
          <div className="panel panel-info">
            <div className="panel-heading" style={{ overflow: 'hidden', lineHeight: '28px' }}>
              <span style={{ fontWeight: 'bold' }}>
                Applicant Full Details &nbsp;&raquo;&nbsp; {detail?.applicationId || applicationNo}
              </span>
              <span className="pull-right">
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  onClick={viewProgress}
                  style={{ marginRight: '6px' }}
                >
                  <i className="fa fa-list" /> Progress Details
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-xs"
                  onClick={() => navigate(-1)}
                >
                  <i className="fa fa-arrow-left" /> Back
                </button>
              </span>
            </div>

            <div className="panel-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="text-center" style={{ padding: '30px' }}>
                  <i className="fa fa-spinner fa-spin fa-2x" /> Loading applicant details...
                </div>
              ) : (
                <>
                  {/* 1. Basic & Personal Information */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Basic &amp; Personal Information</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Application No.</th>
                        <td width="30%">{detail?.applicationId || applicationNo}</td>
                        <th width="20%">Applicant Name</th>
                        <td width="30%">{applicantName}</td>
                      </tr>
                      <tr>
                        <th>Father / POA Name</th>
                        <td>{detail?.poaFatherName || detail?.poaFirstName || '-'}</td>
                        <th>Gender</th>
                        <td>{detail?.gender || '-'}</td>
                      </tr>
                      <tr>
                        <th>Date of Birth</th>
                        <td>{detail?.dob || '-'}</td>
                        <th>Category</th>
                        <td>{detail?.categoryId || '-'}</td>
                      </tr>
                      <tr>
                        <th>Aadhaar No.</th>
                        <td>{detail?.aadhaarNumber || '-'}</td>
                        <th>PAN</th>
                        <td>{detail?.panNo || '-'}</td>
                      </tr>
                      <tr>
                        <th>TAN</th>
                        <td>{detail?.tanNo || '-'}</td>
                        <th>Submitted On</th>
                        <td>{detail?.submittedOn || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 2. Contact Details */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Contact Details</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Mobile</th>
                        <td width="30%">{detail?.mobileNumber || detail?.presentAddMobileNo || '-'}</td>
                        <th width="20%">Email</th>
                        <td width="30%">{detail?.emailId || '-'}</td>
                      </tr>
                      <tr>
                        <th>Alternate Mobile</th>
                        <td>{detail?.permanentAddMobileNo || '-'}</td>
                        <th>Telephone</th>
                        <td>{detail?.telephoneNumber || detail?.presentAddTelephoneNo || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 3. Present Address */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Present Address</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Address</th>
                        <td colSpan="3">
                          {`${detail?.address1 || ''} ${detail?.address2 || ''} ${detail?.address3 || ''}`.trim() || '-'}
                        </td>
                      </tr>
                      <tr>
                        <th>State</th>
                        <td>{detail?.state || '-'}</td>
                        <th>District</th>
                        <td>{detail?.district || '-'}</td>
                      </tr>
                      <tr>
                        <th>Tehsil</th>
                        <td>{detail?.tehsil || '-'}</td>
                        <th>Block</th>
                        <td>{detail?.block || '-'}</td>
                      </tr>
                      <tr>
                        <th>PIN Code</th>
                        <td colSpan="3">{detail?.pinCode || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 4. Permanent Address */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Permanent Address</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Address</th>
                        <td colSpan="3">
                          {`${detail?.permanentAddress1 || ''} ${detail?.permanentAddress2 || ''} ${detail?.permanentAddress3 || ''}`.trim() || '-'}
                        </td>
                      </tr>
                      <tr>
                        <th>State</th>
                        <td>{detail?.permanentState || '-'}</td>
                        <th>District</th>
                        <td>{detail?.permanentDistrict || '-'}</td>
                      </tr>
                      <tr>
                        <th>Tehsil</th>
                        <td>{detail?.permanentTehsil || '-'}</td>
                        <th>Block</th>
                        <td>{detail?.permanentBlock || '-'}</td>
                      </tr>
                      <tr>
                        <th>PIN Code</th>
                        <td colSpan="3">{detail?.permanentPinCode || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 5. Enterprise / Firm Details */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Enterprise / Firm Details</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Unit / Organisation Name</th>
                        <td width="30%">{detail?.indOrgName || detail?.firmEntityName2 || '-'}</td>
                        <th width="20%">Establishment Type</th>
                        <td width="30%">{detail?.establishmentType || '-'}</td>
                      </tr>
                      <tr>
                        <th>Constitution</th>
                        <td>{detail?.firmConstitution || '-'}</td>
                        <th>Firm Category</th>
                        <td>{detail?.firmCategory || '-'}</td>
                      </tr>
                      <tr>
                        <th>Status of Premises</th>
                        <td>{detail?.statusOfPremises || '-'}</td>
                        <th>Sector</th>
                        <td>{detail?.firmSector || detail?.firmSector2 || '-'}</td>
                      </tr>
                      <tr>
                        <th>Industry</th>
                        <td>{detail?.firmIndustry || detail?.firmIndustry2 || '-'}</td>
                        <th>Firm PAN</th>
                        <td>{detail?.firmPan2 || '-'}</td>
                      </tr>
                      <tr>
                        <th>CIN</th>
                        <td>{detail?.firmCin2 || detail?.cin || '-'}</td>
                        <th>Udyam Registration No.</th>
                        <td>{detail?.udyamRegNo || '-'}</td>
                      </tr>
                      <tr>
                        <th>Udyam Registration Date</th>
                        <td>{detail?.udyamRegDate || '-'}</td>
                        <th>GST No.</th>
                        <td>{detail?.gstNo || '-'}</td>
                      </tr>
                      <tr>
                        <th>Factory Act Licence</th>
                        <td>{detail?.factoryActLicNo || '-'}</td>
                        <th>Industrial Area</th>
                        <td>{detail?.industrialAreaName || '-'}</td>
                      </tr>
                      <tr>
                        <th>Website</th>
                        <td colSpan="3">{detail?.websiteUrl || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 6. Bank Details */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Bank Details</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Bank Name</th>
                        <td width="30%">{detail?.bankName || detail?.otherBankName || '-'}</td>
                        <th width="20%">Account Holder</th>
                        <td width="30%">{detail?.bankAccountName || '-'}</td>
                      </tr>
                      <tr>
                        <th>Account No.</th>
                        <td>{detail?.accountNumber || '-'}</td>
                        <th>IFSC</th>
                        <td>{detail?.ifsc || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 7. Scheme Details */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Scheme Details</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Scheme Year</th>
                        <td width="30%">{detail?.schemeYear || detail?.faIndustrialUnitBean?.schemeYear || '-'}</td>
                        <th width="20%">Unit Name</th>
                        <td width="30%">{detail?.unitName || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 8. Unit / Business Details (conditional) */}
                  {detail?.faIndustrialUnitBean && (
                    <>
                      <div className="form-group divheadertxt text-center" align="center">
                        <b>Unit / Business Details</b>
                      </div>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th width="20%">Unit Type</th>
                            <td width="30%">{detail.faIndustrialUnitBean.unitType || '-'}</td>
                            <th width="20%">Unit Start Date</th>
                            <td width="30%">{detail.faIndustrialUnitBean.unitStartDate || '-'}</td>
                          </tr>
                          <tr>
                            <th>Total Project Cost</th>
                            <td>{detail.faIndustrialUnitBean.totalProjectCost || '-'}</td>
                            <th>Electrical Load</th>
                            <td>{detail.faIndustrialUnitBean.unitElectCompLoad || '-'}</td>
                          </tr>
                          <tr>
                            <th>Expansion</th>
                            <td>{detail.faIndustrialUnitBean.expansion || '-'}</td>
                            <th>Diversification</th>
                            <td>{detail.faIndustrialUnitBean.diversification || '-'}</td>
                          </tr>
                          <tr>
                            <th>Technical Upgradation</th>
                            <td colSpan="3">{detail.faIndustrialUnitBean.technicalUp || '-'}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* 9. Employment Generated */}
                      <div className="form-group divheadertxt text-center" align="center">
                        <b>Employment Generated</b>
                      </div>
                      <table className="table table-bordered">
                        <tbody>
                          <tr>
                            <th width="20%">Total</th>
                            <td width="13%">{detail.faIndustrialUnitBean.unitTotalEmptGen || '-'}</td>
                            <th width="10%">MP</th>
                            <td width="13%">{detail.faIndustrialUnitBean.unitMpEmptGen || '-'}</td>
                            <th width="7%">SC</th>
                            <td width="10%">{detail.faIndustrialUnitBean.unitMpScEmptGen || '-'}</td>
                          </tr>
                          <tr>
                            <th>ST</th>
                            <td>{detail.faIndustrialUnitBean.unitMpStEmptGen || '-'}</td>
                            <th>OBC</th>
                            <td>{detail.faIndustrialUnitBean.unitMpObcEmptGen || '-'}</td>
                            <th />
                            <td />
                          </tr>
                        </tbody>
                      </table>
                    </>
                  )}

                  {/* 10. Financial / Capital Investment Details */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Financial / Capital Investment Details</b>
                  </div>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th width="8%">S.No.</th>
                        <th>Investment Head</th>
                        <th width="30%">Amount (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail?.faIndustrialUnitBean?.capitalInvestmentBeans &&
                      detail.faIndustrialUnitBean.capitalInvestmentBeans.length > 0 ? (
                        detail.faIndustrialUnitBean.capitalInvestmentBeans.map((ci, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{ci.investmentName || '-'}</td>
                            <td>{ci.amount != null ? ci.amount : '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No capital investment records.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* 11. Land / Building Details */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Land / Building Details</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Industrial Area</th>
                        <td width="30%">{detail?.industrialAreaName || '-'}</td>
                        <th width="20%">Plot No(s)</th>
                        <td width="30%">{detail?.plotNos || '-'}</td>
                      </tr>
                      <tr>
                        <th>Area (Sq. Mtr.)</th>
                        <td colSpan="3">{detail?.areaInSqm || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 12. Assistance-wise Eligible Amount */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Assistance-wise Eligible Amount</b>
                  </div>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th width="40%">Assistance Type</th>
                        <th width="30%">Eligible Amount (Rs.)</th>
                        <th width="30%">Sanctioned Amount (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assistanceList.length > 0 ? (
                        assistanceList.map((asst, index) => (
                          <tr key={index}>
                            <td>{asst.assistanceType || '-'}</td>
                            <td>{asst.eligibleAmount != null ? asst.eligibleAmount : '-'}</td>
                            <td>{asst.sanctionedAmount != null ? asst.sanctionedAmount : '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No assistance records found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* 13. Financial Assistance (DTIC) */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Financial Assistance (DTIC)</b>
                  </div>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th width="20%">Eligible Amount (Rs.)</th>
                        <td width="30%">{dticInfo.eligibleAmount || '-'}</td>
                        <th width="20%">GM DTIC Remark</th>
                        <td width="30%">{dticInfo.gmRemark || '-'}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 14. Uploaded Documents */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Uploaded Documents</b>
                  </div>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th width="8%">S.No.</th>
                        <th>Document</th>
                        <th width="20%">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentList.length > 0 ? (
                        documentList.map((doc, index) => (
                          <tr key={doc.id || index}>
                            <td>{index + 1}</td>
                            <td>{doc.label}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-info btn-xs"
                                onClick={() => handleDownloadDoc(doc)}
                              >
                                <i className="fa fa-download" /> Download
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3" className="text-center">
                            No documents uploaded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* 15. Verification Remarks & History */}
                  <div className="form-group divheadertxt text-center" align="center">
                    <b>Verification Remarks &amp; History</b>
                  </div>
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
                      {detailHistory.length > 0 ? (
                        detailHistory.map((h, index) => (
                          <tr key={index}>
                            <td>{h.roleName || '-'}</td>
                            <td>{h.actionStatus || '-'}</td>
                            <td>{h.remarks || '-'}</td>
                            <td>{h.verifiedBy || '-'}</td>
                            <td>{h.verifiedDate || '-'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No verification remarks yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Bottom Navigation */}
                  <div className="text-center" style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => navigate(-1)}
                      style={{ marginRight: '10px' }}
                    >
                      <i className="fa fa-arrow-left" /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={viewProgress}
                    >
                      <i className="fa fa-list" /> Progress Details
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
