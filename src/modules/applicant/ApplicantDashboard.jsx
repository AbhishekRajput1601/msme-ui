import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../../hooks/useTranslation'
import { fetchApplicationList } from '../id/applicant/services/idApplicantService'
import ApplicationStatusBadge from '../id/applicant/components/ApplicationStatusBadge'

export default function ApplicantDashboard() {
  const { t, locale } = useTranslation()
  const hindi = locale === 'hi'
  const [recentApplications, setRecentApplications] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    fetchApplicationList({ page: 1, pageSize: 5 })
      .then((res) => {
        if (mounted) {
          setRecentApplications(res.data || [])
          setTotalCount(res.totalCount || 0)
        }
      })
      .catch(err => { if (mounted) setError(err.message || 'Applications could not be loaded.') })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="legacy-dashboard p-4">
      <h1 className="page-header text-xl font-bold text-gray-800 border-b pb-2 mb-4">
        {t('nav.dashboard', 'Applicant Dashboard')}
      </h1>

      {/* Quick Action Tiles */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="panel panel-primary border border-blue-200 rounded p-4 bg-blue-50 shadow-sm">
            <h4 className="font-semibold text-blue-900 mb-1">
              {hindi ? 'भूमि आवंटन आवेदन' : 'Land Allotment Applications'}
            </h4>
            <p className="text-2xl font-bold text-blue-700 mb-3">{loading || error ? '—' : totalCount}</p>
            <Link
              to="/applicant/land-allotment"
              className="btn btn-sm btn-primary inline-block text-xs font-semibold px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {hindi ? 'सभी आवेदन देखें' : 'View All Applications'} &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="panel panel-success border border-green-200 rounded p-4 bg-green-50 shadow-sm">
            <h4 className="font-semibold text-green-900 mb-1">
              {hindi ? 'नई भूमि खोजें व आवेदन करें' : 'Explore Vacant Lands'}
            </h4>
            <p className="text-xs text-green-700 mb-4">
              {hindi
                ? 'उपलब्ध औद्योगिक भूखंडों की सूची देखें'
                : 'Browse available industrial plots across Madhya Pradesh'}
            </p>
            <Link
              to="/applicant/land-allotment/new"
              className="btn btn-sm btn-success inline-block text-xs font-semibold px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {hindi ? 'आवेदन शुरू करें' : 'Apply For Land'} &rarr;
            </Link>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="panel panel-warning border border-amber-200 rounded p-4 bg-amber-50 shadow-sm">
            <h4 className="font-semibold text-amber-900 mb-1">
              {hindi ? 'सहायता व दिशा-निर्देश' : 'Guidelines & Help'}
            </h4>
            <p className="text-xs text-amber-700 mb-4">
              {hindi
                ? 'नियम और आवंटन प्रक्रिया की जानकारी'
                : 'Learn about MSME allotment policy, rules and payment processes'}
            </p>
            <Link
              to="/guidelines"
              className="btn btn-sm btn-warning inline-block text-xs font-semibold px-3 py-1.5 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              {hindi ? 'मार्गदर्शिका पढ़ें' : 'View Guidelines'} &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="panel panel-default border rounded shadow-sm overflow-hidden bg-white">
        <div className="panel-heading bg-gray-100 px-4 py-3 border-b flex justify-between items-center">
          <span className="font-semibold text-gray-700 text-sm">
            {hindi ? 'हाल के आवेदन' : 'Recent Land Allotment Submissions'}
          </span>
          <Link
            to="/applicant/land-allotment"
            className="text-xs text-blue-600 hover:underline"
          >
            {hindi ? 'पूरा देखें' : 'View Full Table'}
          </Link>
        </div>
        <div className="panel-body p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-sm text-gray-500">
              Loading recent applications from database...
            </div>
          ) : error ? <div className="p-6" role="alert">{error}</div> : recentApplications.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              No recent applications found.
            </div>
          ) : (
            <table className="table table-bordered table-striped mb-0 text-sm w-full">
              <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                <tr>
                  <th className="p-2 border">App ID</th>
                  <th className="p-2 border">Industrial Area</th>
                  <th className="p-2 border">Plot No</th>
                  <th className="p-2 border">Submission Date</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.applicantId || app.applicationId}>
                    <td className="p-2 border font-mono text-xs">{app.applicationId || '—'}</td>
                    <td className="p-2 border">{app.industrialAreaName || '—'}</td>
                    <td className="p-2 border">{app.plotNumber || '—'}</td>
                    <td className="p-2 border">{app.submittedOn || '—'}</td>
                    <td className="p-2 border">
                      <ApplicationStatusBadge status={app.status} />
                    </td>
                    <td className="p-2 border text-center">
                      <Link
                        to={`/applicant/land-allotment/detail/${app.applicantId}`}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

