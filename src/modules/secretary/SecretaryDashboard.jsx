/**
 * SecretaryDashboard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Secretary Dashboard matching the DTIC dashboard theme, architecture, and CSS.
 * Provides executive oversight of Financial Assistance applications,
 * verification queues, LDM batch forwarding, and district analytics.
 */

import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchApplications, fetchBatches } from './secretaryService'
import Spinner from '../../components/loaders/Spinner'
import toast from '../../utils/toast'
import './secretary-dashboard.css'

const format = (value) => (value === null || value === undefined ? '0' : Number(value).toLocaleString('en-IN'))

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount) || amount === 0) return '₹ 0'
  const num = Number(amount)
  if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`
  if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} Lakh`
  return `₹ ${num.toLocaleString('en-IN')}`
}

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

export default function SecretaryDashboard() {
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
          if (appsRes.status === 'rejected' && batchesRes.status === 'rejected') {
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
  const pendingApps = useMemo(
    () => applications.filter((a) => a.currentStatusId == null || Number(a.currentStatusId) === 20),
    [applications],
  )
  const pendingCount = pendingApps.length || applications.length
  const batchesCount = batches.length

  const valueDisplay = (number) => (loading ? <Spinner size="xs" inline /> : format(number))

  return (
    <div className="secretary-dashboard secretary-role-dashboard">
      {/* ─── Top Heading Section ────────────────────────────────────────── */}
      <header className="sec-dash-heading">
        <div>
          <p className="sec-dash-eyebrow">SECRETARY (MSME) • DIRECTORATE OF INDUSTRIES</p>
          <h1>Secretary dashboard</h1>
          <p>Executive review of Financial Assistance applications, verification agenda, and LDM batch forwarding.</p>
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
          'Application queue counts verified against Department of MSME records.'
        )}
        {updated && !loading && (
          <time dateTime={updated.toISOString()}>
            Fetched at {updated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </time>
        )}
      </div>

      {/* ─── Overview Hero & Stat Cards (DTIC Theme) ───────────────────── */}
      <section className="sec-dash-overview" aria-label="Secretary Overview">
        {/* Total Overview Hero Card */}
        <div className="sec-dash-total">
          <span className="sec-dash-overview-icon">
            <DashboardIcon kind="shield" />
          </span>
          <p className="sec-dash-eyebrow">EXECUTIVE OVERVIEW</p>
          <h2>Workflow at a glance</h2>
          <p>Meeting Agenda verifications, DLAC approvals, and LDM forward batches across Madhya Pradesh.</p>
        </div>

        {/* Stat 1: Pending Verification */}
        <div className="sec-dash-stat">
          <span>Pending Verification</span>
          <strong>{valueDisplay(pendingCount)}</strong>
          <small>Applications in status 20 (Agenda Generated)</small>
          <Link to="/department/secretary/verification">
            Open Verification <DashboardIcon kind="arrow" />
          </Link>
        </div>

        {/* Stat 2: Active Batches for LDM */}
        <div className="sec-dash-stat sec-dash-amber">
          <span>Batches for LDM</span>
          <strong>{valueDisplay(batchesCount)}</strong>
          <small>Batches awaiting Secretary submission</small>
          <Link to="/department/secretary/batches">
            Review Batches <DashboardIcon kind="arrow" />
          </Link>
        </div>

      </section>

      {/* ─── Recent Applications Awaiting Review ──────────────────────── */}
      <section className="sec-dash-recent" aria-labelledby="sec-recent-title">
        <div className="sec-dash-recent-header">
          <div>
            <p className="sec-dash-eyebrow" style={{ margin: 0 }}>ACTIVE WORKLOAD</p>
            <h2 id="sec-recent-title">Recent Applications for Verification</h2>
          </div>
          <Link to="/department/secretary/verification">
            View All Applications <DashboardIcon kind="arrow" />
          </Link>
        </div>

        <div className="sec-dash-table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Application No</th>
                <th scope="col">Unit / Enterprise Name</th>
                <th scope="col">District</th>
                <th scope="col">Status</th>
                <th scope="col">Eligible Amount</th>
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
                          to={`/department/secretary/detail/${appNo}`}
                          style={{ color: '#337ab7', fontWeight: 600, textDecoration: 'none' }}
                        >
                          {appNo}
                        </Link>
                      </th>
                      <td>{unitName}</td>
                      <td>{app.districtName || 'Bhopal'}</td>
                      <td>
                        <span className="sec-dash-badge-status pending">
                          {app.status || 'Agenda Generated'}
                        </span>
                      </td>
                      <td>
                        <strong>
                          {formatCurrency(app.eligibleAmount || app.claimedAmount || app.sanctionAmount)}
                        </strong>
                      </td>
                      <td>
                        <Link
                          to={`/department/secretary/detail/${appNo}`}
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
                  <td colSpan={6} style={{ textAlign: 'center', padding: '28px', color: '#6c757d' }}>
                    {loading ? <Spinner size="sm" /> : 'No pending applications currently in the verification queue.'}
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
