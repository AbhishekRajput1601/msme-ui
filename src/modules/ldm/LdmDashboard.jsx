/**
 * LdmDashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Lead District Manager (LDM) Dashboard matching the Secretary role architecture,
 * DTIC theme, visual hierarchy, and CSS.
 * Provides district-level oversight of Financial Assistance applications,
 * verification queues, Collector batch forwarding, and proposal analytics.
 */

import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchApplications, fetchBatches } from './ldmService'
import Spinner from '../../components/loaders/Spinner'
import toast from '../../utils/toast'
import '../secretary/secretary-dashboard.css'
import './ldm-dashboard.css'

const format = (value) => (value === null || value === undefined ? '0' : Number(value).toLocaleString('en-IN'))

function DashboardIcon({ kind = 'document' }) {
  const paths = {
    document: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M14 2v6h6M8 13h8M8 17h5',
    refresh: 'M20 7v5h-5M4 17v-5h5M6 7a7 7 0 0 1 11-2l3 3M4 16l3 3a7 7 0 0 0 11-2',
    arrow: 'M5 12h14M13 6l6 6-6 6',
    building: 'M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4',
    check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    folder: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    shield: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    money: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }
  return (
    <svg className="sec-dash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[kind] || paths.document} />
    </svg>
  )
}

export default function LdmDashboard() {
  const [attempt, setAttempt] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [updated, setUpdated] = useState(null)
  const [applications, setApplications] = useState([])
  const [batches, setBatches] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(false)

    Promise.allSettled([
      fetchApplications('', controller.signal),
      fetchBatches('', controller.signal),
    ])
      .then(([appsRes, batchesRes]) => {
        if (!controller.signal.aborted) {
          const appsList = appsRes.status === 'fulfilled' && Array.isArray(appsRes.value) ? appsRes.value : []
          const batchList = batchesRes.status === 'fulfilled' && Array.isArray(batchesRes.value) ? batchesRes.value : []
          setApplications(appsList)
          setBatches(batchList)
          setUpdated(new Date())
          if (appsRes.status === 'rejected' || batchesRes.status === 'rejected') {
            setError(true)
          }
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(true)
          toast.error(err.message || 'Failed to load dashboard data.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [attempt])

  // Calculated Metrics
  // Status 21 is Secretary Verified, which is the queue pending LDM verification
  const pendingApps = useMemo(
    () => applications.filter((a) => a.currentStatusId == null || Number(a.currentStatusId) === 21),
    [applications],
  )
  const pendingCount = pendingApps.length || applications.length
  const batchesCount = batches.length

  const valueDisplay = (number) => (loading ? <Spinner size="xs" inline /> : error ? 'Unavailable' : format(number))

  return (
    <div className="ldm-dashboard secretary-dashboard ldm-page">
      {/* ─── Top Heading Section ────────────────────────────────────────── */}
      <header className="sec-dash-heading">
        <div>
          <p className="sec-dash-eyebrow">LEAD DISTRICT MANAGER (LDM) • DISTRICT LEVEL APPROVAL COMMITTEE</p>
          <h1>Lead District Manager dashboard</h1>
          <p>Review applications in your mapped districts and submit batch recommendations to the Collector.</p>
        </div>
        <button
          type="button"
          className="sec-dash-refresh"
          disabled={loading}
          onClick={() => setAttempt((n) => n + 1)}
          title="Refresh live portal metrics"
        >
          {loading ? 'Refreshing…' : '↻ Refresh counts'}
        </button>
      </header>

      {/* ─── Status Strip ──────────────────────────────────────────────── */}
      <div className="sec-dash-status" role="status">
        <span className={`sec-dash-dot${error ? ' is-error' : ''}`} />
        {loading ? (
          <Spinner size="xs" inline />
        ) : error ? (
          'Some counts could not be verified from the server. Refresh to try again.'
        ) : (
          'Workload loaded from Department of MSME records.'
        )}
        {updated && !loading && (
          <time dateTime={updated.toISOString()}>
            Fetched at {updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </time>
        )}
      </div>

      {/* ─── Overview Hero & Stat Cards (DTIC Theme) ───────────────────── */}
      <section className="sec-dash-overview" aria-label="Lead District Manager Overview">
        {/* Total Overview Hero Card */}
        <div className="sec-dash-total">
          <span className="sec-dash-overview-icon">
            <DashboardIcon kind="shield" />
          </span>
          <p className="sec-dash-eyebrow">DISTRICT LEVEL OVERVIEW</p>
          <h2>Your review desk</h2>
          <p>Review Secretary-verified applications, record your recommendation, and move batches to the Collector.</p>
        </div>

        {/* Stat 1: Pending Verification */}
        <div className="sec-dash-stat">
          <span>Pending Verification</span>
          <strong className="huge">{valueDisplay(pendingCount)}</strong>
          <small>Secretary-verified applications awaiting your review</small>
          <Link to="/department/ldm/verification" aria-label="Go to Verification">
            Go to Verification <DashboardIcon kind="arrow" />
          </Link>
        </div>

        {/* Stat 2: Active Batches for Collector */}
        <div className="sec-dash-stat sec-dash-amber">
          <span>Batches Pending LDM Review</span>
          <strong>{valueDisplay(batchesCount)}</strong>
          <small>Record Agree / Disagree before submission to the Collector</small>
          <Link to="/department/ldm/batches">
            Review Batches <DashboardIcon kind="arrow" />
          </Link>
        </div>

      </section>

      {/* ─── Recent Applications Awaiting Review ──────────────────────── */}
      <section className="sec-dash-recent" aria-labelledby="ldm-recent-title">
        <div className="sec-dash-recent-header">
          <div>
            <p className="sec-dash-eyebrow" style={{ margin: 0 }}>ACTIVE WORKLOAD</p>
            <h2 id="ldm-recent-title">Recent Applications for Verification</h2>
          </div>
          <Link to="/department/ldm/verification">
            View All Applications <DashboardIcon kind="arrow" />
          </Link>
        </div>

        <div className="sec-dash-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Application No</th>
                <th scope="col">Unit / Enterprise Name</th>
                <th scope="col">District ID</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.slice(0, 5).map((app, index) => {
                  const appNo = app.applicationId || app.applicationNo || app.id || '-'
                  const unitName = app.unitOrInstName || app.enterpriseName || app.firmName || app.applicantName || 'Industrial Unit'
                  return (
                    <tr key={appNo !== '-' ? appNo : index}>
                      <th scope="row">
                        <Link
                          to={`/department/ldm/detail/${appNo}`}
                          style={{ color: '#337ab7', fontWeight: 600, textDecoration: 'none' }}
                        >
                          {appNo}
                        </Link>
                      </th>
                      <td>{unitName}</td>
                      <td>{app.districtId ?? '—'}</td>
                      <td>
                        <span className="sec-dash-badge-status pending">
                          {app.status || 'Secretary Verified'}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/department/ldm/detail/${appNo}`}
                          className="sec-dash-action-btn"
                          style={{ color: '#ffffff', textDecoration: 'none' }}
                        >
                          <span style={{ color: '#ffffff' }}>Inspect</span> <DashboardIcon kind="arrow" />
                        </Link>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '28px', color: '#6c757d' }}>
                    {loading ? <Spinner size="sm" /> : error ? 'Unable to load the workload. Refresh to try again.' : 'You are all caught up. No applications are awaiting verification.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

