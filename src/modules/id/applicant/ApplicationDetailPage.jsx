import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from '../../../hooks/useTranslation'
import IndustrialView from '../../industrial-unit/IndustrialView'
import {
  fetchApplicationDetail, fetchDocumentsList, fetchIndustrialProfileDocumentsList,
  getDownloadDocumentUrl, getDownloadLOILetterUrl, getDownloadLeaseLetterUrl,
  getDownloadAllotmentLetterUrl, getDownloadPossessionLetterUrl, getDownloadEsignedDocumentUrl,
} from './services/idApplicantService'
import nodes from './reference/generated/application-detail/view.json'
import { expressions } from './reference/generated/application-detail/expressions'
import './application-detail.css'

export default function ApplicationDetailPage() {
  const { id } = useParams()
  return <ApplicationDetailContent key={id} id={id} />
}

function ApplicationDetailContent({ id }) {
  const { locale } = useTranslation()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    Promise.all([fetchApplicationDetail(id), fetchDocumentsList(id), fetchIndustrialProfileDocumentsList(id)])
      .then(([application, documents, profileDocuments]) => {
        if (active) setData({ application, documents, profileDocuments })
      })
      .catch(error => { if (active) setError(error.message || 'Failed to load application details.') })
    return () => { active = false }
  }, [id])
  const state = useMemo(() => data && ({
    expressionBundle: expressions,
    initialized: new Set(),
    locale,
    notify() {},
    applicationData: data.application,
    applicantDocumentsList: data.documents,
    industrialProfileDocumentsList: data.profileDocuments,
    profileImage: data.application.profileImageString,
    documentPath: value => '/mpmsme/applicant/' + value,
    downloadDocument: type => window.open(getDownloadDocumentUrl(type, data.application.applicantId), '_blank', 'noopener,noreferrer'),
    calTotalEmployment: (items, precision) => (items || []).reduce((sum, item) => sum + Number(item.empNumber || 0), 0).toFixed(precision ? 2 : 0),
    prepareElement(attrs, node) {
      if (node.tag === 'a' && attrs.href?.includes('/downloadDocumentById/')) {
        attrs.target = '_blank'
        attrs.rel = 'noopener noreferrer'
        delete attrs.onClick
      }
      if (node.tag === 'img' && attrs.id === 'avatar') attrs.alt = 'Applicant photograph'
    },
  }), [data, locale])
  if (error) return <div className="alert alert-danger" role="alert">{error} <Link to="/applicant/land-allotment">Back to Applications List</Link></div>
  if (!data) return <p role="status">Loading application form details...</p>
  const { application } = data
  const statusLower = (application.status || '').toLowerCase()
  return <div className="land-application-detail">
    <div className="land-application-toolbar">
      <nav aria-label="Breadcrumb">
        <Link to="/applicant/dashboard">Home</Link><span aria-hidden="true"> &gt;&gt; </span>
        <Link to="/applicant/land-allotment">Applications List</Link><span aria-hidden="true"> &gt;&gt; </span>
        <strong aria-current="page">{application.applicationId}</strong>
      </nav>
      <div className="land-application-actions">
        <Link className="btn btn-default" to="/applicant/land-allotment">Back to List</Link>
        <button className="btn btn-primary" type="button" onClick={() => window.print()}><i className="fa fa-print" aria-hidden="true" /> Print Form</button>
      </div>
    </div>
    <div className="panel panel-info">
      <div className="panel-heading">Infrastructure Development &gt;&gt; Application List &gt;&gt; Application Form</div>
      <div className="panel-body">
        {/* Action Letters Strip */}
        <div className="land-application-downloads">
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
        <div className="land-application-scroll" role="region" aria-label="Application form" tabIndex={0}>
          <IndustrialView nodes={nodes} state={state} />
        </div>
      </div>
    </div>
  </div>
}
