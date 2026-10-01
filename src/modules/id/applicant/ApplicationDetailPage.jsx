/**
 * ApplicationDetailPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Exact replica of the AngularJS viewApplicationDetail.html government form layout.
 *
 * Structure:
 *  • Official Government Form Header with Emblem, Department Title & Brown Sub-banner
 *  • Bordered Form Tables with #eee section headers:
 *      1. DTIC's & Application EOI
 *      2. Organisational / Industrial Details (React Hook Form + Zod)
 *      3. Land Parcel Specifications & Financial Schedule
 *      4. Uploaded Digital Documents Dossier
 *      5. Cyber Treasury MP Payment Verification
 *      6. DTIC Scrutiny Progress Lifecycle
 *  • Action links to download official letters (LOI, Allotment, Lease, Possession, eSign)
 */

import React, { useState, useEffect, useCallback } from 'react'
import { displayNumber } from '../../../api/responseData'
import { useParams, Link } from 'react-router-dom'
import {
  fetchApplicationDetail,
  fetchDocumentsList,
  getDownloadLOILetterUrl,
  getDownloadLeaseLetterUrl,
  getDownloadAllotmentLetterUrl,
  getDownloadPossessionLetterUrl,
  getDownloadEsignedDocumentUrl,
} from './services/idApplicantService'
import ApplicationStatusBadge from './components/ApplicationStatusBadge'
import LandApplicationForm from './components/LandApplicationForm'
import DocumentUploadSection from './components/DocumentUploadSection'

export default function ApplicationDetailPage() {
  const { id } = useParams()

  const [application, setApplication] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [detailRes, docsRes] = await Promise.all([
        fetchApplicationDetail(id),
        fetchDocumentsList(id),
      ])
      setApplication(detailRes)
      setDocuments(docsRes || [])
    } catch (err) {
      setError(err?.message || 'Failed to load application details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">
        <i className="fa fa-spinner fa-spin fa-2x"></i>
        <p className="mt-2 text-sm">Loading application form details...</p>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="panel panel-info">
        <div className="panel-heading">Error Loading Application</div>
        <div className="panel-body text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Application not found'}</p>
          <Link
            to="/applicant/land-allotment"
            className="text-xs bg-[#337ab7] text-white px-4 py-2 rounded"
          >
            ← Back to Applications List
          </Link>
        </div>
      </div>
    )
  }

  const vacantLand = application.vacantLandBean || {}
  const statusLower = (application.status || '').toLowerCase()

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* ─── Breadcrumb Bar ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200">
        <div className="text-[#337ab7]">
          <Link to="/applicant/dashboard" className="hover:underline">Home</Link>
          <span className="mx-1.5 text-gray-400">&gt;&gt;</span>
          <Link to="/applicant/land-allotment" className="hover:underline">Applications List</Link>
          <span className="mx-1.5 text-gray-400">&gt;&gt;</span>
          <span className="text-gray-700 font-bold">{application.applicationId ?? '\u2014'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/applicant/land-allotment"
            className="border border-[#ccc] bg-white hover:bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs"
          >
            ← Back to List
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="border border-[#337ab7] bg-[#337ab7] hover:bg-[#286090] text-white px-3 py-1 rounded text-xs"
          >
            <i className="fa fa-print mr-1"></i> Print Form
          </button>
        </div>
      </div>


      {/* ─── Official Government Form Header matching viewApplicationDetail.html ── */}
      <div className="bg-white border border-gray-300 p-6 rounded shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-200">
          <div className="mplogo">
            <img src="/legacy/image/indus_logo.png" alt="MP Government Logo" className="max-h-20" />
          </div>

          <div className="flex-1 text-center">
            <div className="text-lg font-bold text-gray-900 leading-tight">
              Government of Madhya Pradesh,
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Department of Micro, Small & Medium Enterprises
            </div>
            <div className="text-sm font-bold text-[#8a3b14] mt-1">
              Infrastructure Development: Expression of Interest Application Form
            </div>
          </div>

          <div className="text-right">
            <ApplicationStatusBadge status={application.status} />
            <div className="text-[11px] text-gray-500 mt-1">
              Submitted: {application.submittedOn ?? '\u2014'}
            </div>
          </div>
        </div>

        {/* Action Letters Strip */}
        <div className="mt-3 pt-3 flex flex-wrap items-center justify-end gap-2 text-xs border-t border-dashed border-gray-200">
          {statusLower.includes('loi') && (
            <a
              href={getDownloadLOILetterUrl(application.applicantId)}
              target="_blank"
              rel="noreferrer"
              className="text-[#337ab7] hover:underline font-bold"
            >
              [ Download LOI Letter ]
            </a>
          )}
          {statusLower.includes('allot') && (
            <a
              href={getDownloadAllotmentLetterUrl(application.applicantId)}
              target="_blank"
              rel="noreferrer"
              className="text-[#337ab7] hover:underline font-bold"
            >
              [ Download Allotment Letter ]
            </a>
          )}
          {statusLower.includes('lease') && (
            <a
              href={getDownloadLeaseLetterUrl(application.applicantId)}
              target="_blank"
              rel="noreferrer"
              className="text-[#337ab7] hover:underline font-bold"
            >
              [ Download Lease Deed ]
            </a>
          )}
          {statusLower.includes('possession') && (
            <a
              href={getDownloadPossessionLetterUrl(application.applicantId)}
              target="_blank"
              rel="noreferrer"
              className="text-[#337ab7] hover:underline font-bold"
            >
              [ Download Possession Letter ]
            </a>
          )}
          {application.signedApplicationFormUploadDocId && (
            <a
              href={getDownloadEsignedDocumentUrl(application.signedApplicationFormUploadDocId)}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:underline font-bold"
            >
              [ Download eSigned Form ]
            </a>
          )}
        </div>

        {/* ─── 1. DTIC's & Application EOI Table ─────────────────────────── */}
        <div className="mt-6">
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <td colSpan={4} className="bg-[#eee] text-center font-bold text-xs uppercase text-gray-700 py-1.5">
                  DTIC's & Application EOI
                </td>
              </tr>
              <tr>
                <td className="w-1/4 font-semibold text-gray-700 bg-gray-50/60">Application Number:</td>
                <td className="w-1/4 font-bold text-[#337ab7] font-mono">{application.applicationId}</td>
                <td className="w-1/4 font-semibold text-gray-700 bg-gray-50/60">Application Date:</td>
                <td className="w-1/4">{application.submittedOn ?? '\u2014'}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 bg-gray-50/60">District Name:</td>
                <td>{vacantLand.districtName ?? '\u2014'}</td>
                <td className="font-semibold text-gray-700 bg-gray-50/60">DTIC Centre:</td>
                <td>DTIC {vacantLand.districtName ?? '\u2014'}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 bg-gray-50/60">Industrial Area:</td>
                <td className="font-semibold text-gray-800">{vacantLand.industrialAreaName}</td>
                <td className="font-semibold text-gray-700 bg-gray-50/60">Plot Number:</td>
                <td className="font-bold text-indigo-700 font-mono">{vacantLand.plotNumber}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─── 2. Organisational / Industrial Details (Form) ──────────────── */}
        <div className="mt-6">
          <div className="bg-[#eee] text-center font-bold text-xs uppercase text-gray-700 py-1.5 border border-[#ddd] border-b-0">
            Organisational / Industrial Details
          </div>
          <div className="border border-[#ddd] p-4 bg-white">
            <LandApplicationForm
              initialData={application}
              readOnly
            />
          </div>
        </div>

        {/* ─── 3. Land Parcel Specifications & Financial Schedule ────────── */}
        <div className="mt-6">
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <td colSpan={4} className="bg-[#eee] text-center font-bold text-xs uppercase text-gray-700 py-1.5">
                  Land Parcel Specifications & Financial Breakdown
                </td>
              </tr>
              <tr>
                <td className="w-1/4 font-semibold text-gray-700 bg-gray-50/60">Total Plot Area:</td>
                <td className="w-1/4 font-mono font-bold text-gray-900">{vacantLand.totalPlotArea ?? '\u2014'}</td>
                <td className="w-1/4 font-semibold text-gray-700 bg-gray-50/60">Land Category:</td>
                <td className="w-1/4">{vacantLand.industrialAreaName ?? '\u2014'}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 bg-gray-50/60">Plot Premium:</td>
                <td className="font-mono text-gray-900 font-semibold">
                  ₹{displayNumber(vacantLand.premiumCharges)}
                </td>
                <td className="font-semibold text-gray-700 bg-gray-50/60">Annual Lease Rent:</td>
                <td className="font-mono text-gray-900">
                  ₹{displayNumber(vacantLand.leaseRent)} / year
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 bg-gray-50/60">Development Charges:</td>
                <td className="font-mono text-gray-900">
                  ₹{displayNumber(vacantLand.developmentCharges)}
                </td>
                <td className="font-semibold text-gray-700 bg-gray-50/60">Estimated Total Cost:</td>
                <td className="font-mono text-indigo-700 font-bold text-sm">
                  ₹{displayNumber(vacantLand.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─── 4. Document Dossier ────────────────────────────────────────── */}
        <div className="mt-6">
          <div className="bg-[#eee] text-center font-bold text-xs uppercase text-gray-700 py-1.5 border border-[#ddd] border-b-0">
            Uploaded Digital Documents Dossier
          </div>
          <div className="border border-[#ddd] p-4 bg-white">
            <DocumentUploadSection
              applicantId={application.applicantId}
              documents={documents}
              isReadOnly
            />
          </div>
        </div>

        {/* ─── 5. Cyber Treasury MP Payment Verification ──────────────────── */}
        <div className="mt-6">
          <table className="table table-bordered mb-4">
            <tbody>
              <tr>
                <td colSpan={4} className="bg-[#eee] text-center font-bold text-xs uppercase text-gray-700 py-1.5">
                  Cyber Treasury MP Payment Verification
                </td>
              </tr>
              <tr>
                <td className="w-1/4 font-semibold text-gray-700 bg-gray-50/60">Challan / CRN No.:</td>
                <td className="w-1/4 font-mono font-bold text-gray-900">{application.paymentChallanNo ?? '\u2014'}</td>
                <td className="w-1/4 font-semibold text-gray-700 bg-gray-50/60">Payment Status:</td>
                <td className="w-1/4 font-bold text-emerald-700">
                  <i className="fa fa-check-circle mr-1"></i>{application.paymentStatus ?? '\u2014'}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 bg-gray-50/60">Amount Deposited:</td>
                <td className="font-mono font-bold text-emerald-800">
                  ₹{displayNumber(application.amountPaid)}
                </td>
                <td className="font-semibold text-gray-700 bg-gray-50/60">Transaction Date:</td>
                <td>{application.paymentDate ?? '\u2014'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ─── 6. DTIC Scrutiny Progress Lifecycle ───────────────────────── */}
        <div className="mt-6">
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <td colSpan={4} className="bg-[#eee] text-center font-bold text-xs uppercase text-gray-700 py-1.5">
                  Application Scrutiny & Approval Progress
                </td>
              </tr>
              <tr>
                <td className="w-1/4 font-semibold text-gray-700 bg-gray-50/60">Current Stage:</td>
                <td className="w-1/4 font-bold text-indigo-700">{application.status}</td>
                <td className="w-1/4 font-semibold text-gray-700 bg-gray-50/60">Target Decision Date:</td>
                <td className="w-1/4">{application.decisionDate ?? '\u2014'}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-700 bg-gray-50/60">DTIC Officer Remarks:</td>
                <td colSpan={3} className="text-gray-800">
                  {application.dticComments ?? application.comments ?? '\u2014'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
