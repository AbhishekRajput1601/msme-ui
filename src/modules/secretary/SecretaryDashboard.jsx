/**
 * SecretaryDashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Dashboard matching legacy AngularJS implementation (dashboard.html).
 * Shows pending verification count metric panel and quick link to verification.
 */

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchApplications } from './secretaryService'
import toast from '../../utils/toast'
import './secretary.css'

export default function SecretaryDashboard() {
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    fetchApplications('', controller.signal)
      .then((data) => {
        setApplications(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          toast.error(err.message || 'Failed to load applications.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  const pendingCount = applications.length

  return (
    <div id="page-wrapper" className="secretary-dashboard">
      <div className="row">
        <div className="col-md-12">
          <h1 className="page-header" style={{ marginTop: '15px' }}>
            Secretary Dashboard
          </h1>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <div className="row">
                <div className="col-xs-3">
                  <i className="fa fa-tasks fa-5x" aria-hidden="true" />
                </div>
                <div className="col-xs-9 text-right">
                  <div className="huge" style={{ fontSize: '40px', fontWeight: 'bold' }}>
                    {loading ? <i className="fa fa-spinner fa-spin" /> : pendingCount}
                  </div>
                  <div>Applications Pending Verification</div>
                </div>
              </div>
            </div>
            <Link to="/department/secretary/verification">
              <div className="panel-footer" style={{ color: '#337ab7' }}>
                <span className="pull-left">Go to Verification</span>
                <span className="pull-right">
                  <i className="fa fa-arrow-circle-right" aria-hidden="true" />
                </span>
                <div className="clearfix" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
