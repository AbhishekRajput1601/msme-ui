/**
 * AppRoutes.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Central React Router configuration for MPIndustry / MPMSME UI.
 *
 * Architecture:
 *  • Public routes wrapped in PublicLayout
 *  • Protected applicant routes guarded by ProtectedRoute and wrapped in ApplicantLayout
 *  • Protected admin routes guarded by ProtectedRoute and wrapped in AdminLayout
 *  • Protected department routes guarded by ProtectedRoute and wrapped in DepartmentLayout
 *  • Legacy compatibility routes mapped to LegacyHashRedirect for seamless transition
 *  • 404 / wildcard error catchers
 */

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import PublicLayout from '../layouts/PublicLayout'
import ApplicantLayout from '../layouts/ApplicantLayout'
import AdminLayout from '../layouts/AdminLayout'
import DepartmentLayout from '../layouts/DepartmentLayout'

// Guards & Redirects
import ProtectedRoute from './ProtectedRoute'
import LegacyHashRedirect from './LegacyHashRedirect'

// Public & Auth Views
import HomePage from '../modules/public/HomePage'
import ScreenReaderPage from '../modules/public/ScreenReaderPage'
import PublicContentPage from '../modules/public/PublicContentPage'
import LegacyPublicRedirect from '../modules/public/LegacyPublicRedirect'
import LoginPage from '../modules/auth/LoginPage'
import SignUpPage from '../modules/auth/SignUpPage'
import ForgotPasswordPage from '../modules/auth/ForgotPasswordPage'
import ForgotUsernamePage from '../modules/auth/ForgotUsernamePage'
import UnauthorizedPage from '../modules/common/UnauthorizedPage'
import NotFoundPage from '../modules/common/NotFoundPage'

// Protected Dashboards
import ApplicantDashboard from '../modules/applicant/ApplicantDashboard'
import AdminDashboard from '../modules/admin/AdminDashboard'
import DepartmentDashboard from '../modules/department/DepartmentDashboard'

// Pilot Module: Industrial Land Allotment (ID)
import LandApplicationsPage from '../modules/id/applicant/LandApplicationsPage'
import LandAllotmentPage from '../modules/id/applicant/LandAllotmentPage'
import ApplicationDetailPage from '../modules/id/applicant/ApplicationDetailPage'
import LandApplicationEditPage from '../modules/id/applicant/LandApplicationEditPage'
import LandDocumentsPage from '../modules/id/applicant/LandDocumentsPage'
import LandInstructionsPage from '../modules/id/applicant/LandInstructionsPage'
import LandHistoryPage from '../modules/id/applicant/LandHistoryPage'
import LandPaymentPage from '../modules/id/applicant/LandPaymentPage'
import LandQueryPage from '../modules/id/applicant/LandQueryPage'
import LandAnnualPaymentPage from '../modules/id/applicant/LandAnnualPaymentPage'
import LandAnnualReviewPage from '../modules/id/applicant/LandAnnualReviewPage'
import LandReceiptPage from '../modules/id/applicant/LandReceiptPage'
import LandNoticesPage from '../modules/id/applicant/LandNoticesPage'
import LandSigningPage from '../modules/id/applicant/LandSigningPage'

// Profile & Account Management
import UserProfilePage from '../modules/profile/UserProfilePage'
import IndustrialProfilePage from '../modules/profile/IndustrialProfilePage'
import IndustrialUnitPage from '../modules/industrial-unit/IndustrialUnitPage'
import ChangePasswordPage from '../modules/profile/ChangePasswordPage'

// List of all department officer roles supported
const DEPARTMENT_ROLES = [
  'ROLE_DTIC',
  'ROLE_DTFC',
  'ROLE_BANK',
  'ROLE_ZONAL',
  'ROLE_SECTION',
  'ROLE_LEGAL',
  'ROLE_LEGAL_OIC',
  'ROLE_BUDGET_PLANNING',
  'ROLE_CM_CS',
  'ROLE_CM_CS_HO',
  'ROLE_EMPLOYEE',
  'ROLE_MSEFC',
  'ROLE_TEXTILE',
  'ROLE_COORDINATION',
  'ROLE_COORDINATION_OFFICER',
  'ROLE_COORDINATION_DD',
  'ROLE_COORDINATION_JD',
  'ROLE_IC_OFFICE',
  'ROLE_ACCOUNT',
  'ROLE_AUDIT',
  'ROLE_AUDIT_OFFICER',
  'ROLE_ID',
  'ROLE_MBFC',
  'ROLE_MSME',
  'ROLE_MSME_AWARD_COMMITEE_MEMBER',
  'ROLE_ZONAL_OPERATOR',
  'ROLE_STARTUP_CENTER',
  'ROLE_FA',
  'ROLE_COLLECTOR',
  'ROLE_LDM',
  'ROLE_SECRETARY',
]

export default function AppRoutes() {
  return (
    <Routes>
      {/* ─── 1. Public Routes ────────────────────────────────────────────── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/guidelines" element={<HomePage />} />
        <Route path="/website/screen-reader" element={<ScreenReaderPage />} />
        <Route path="/website/:page" element={<PublicContentPage />} />
        <Route path="/mpmsme/website/:page" element={<LegacyPublicRedirect />} />
        <Route path="/website/home" element={<Navigate to="/" replace />} />
        <Route path="/website/login" element={<Navigate to="/login" replace />} />
        <Route path="/mpmsme/website/screen-reader" element={<Navigate to="/website/screen-reader" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/website/viewsignup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/website/viewforgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/forgot-username" element={<ForgotUsernamePage />} />
        <Route path="/website/viewforgotusername" element={<ForgotUsernamePage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Route>

      {/* Profile & Password Root Aliases */}
      <Route path="/profile" element={<Navigate to="/applicant/profile" replace />} />
      <Route path="/industry-profile" element={<Navigate to="/applicant/industry-profile" replace />} />
      <Route path="/updateindustryprofileapplicant" element={<Navigate to="/applicant/industry-profile" replace />} />
      <Route path="/change-password" element={<Navigate to="/applicant/change-password" replace />} />
      <Route path="/first-password-change" element={<Navigate to="/applicant/first-password-change" replace />} />

      {/* ─── 2. Protected Citizen / Applicant Routes ────────────────────── */}
      <Route
        path="/applicant"
        element={
          <ProtectedRoute allowedRoles={['ROLE_APPLICANT']}>
            <ApplicantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/applicant/dashboard" replace />} />
        <Route path="dashboard" element={<ApplicantDashboard />} />
        {/* Pilot Module: Industrial Land Allotment (ID) */}
        <Route path="land-allotment" element={<LandApplicationsPage />} />
        <Route path="land-allotment/new" element={<LandAllotmentPage />} />
        <Route path="land-allotment/explore" element={<LandAllotmentPage />} />
        <Route path="land-allotment/detail/:id" element={<ApplicationDetailPage />} />
        <Route path="land-allotment/instructions/:parcelToken" element={<LandInstructionsPage />} />
        <Route path="land-allotment/instructions-undeveloped/:parcelToken" element={<LandInstructionsPage undeveloped />} />
        <Route path="land-allotment/apply/:parcelToken" element={<LandApplicationEditPage />} />
        <Route path="land-allotment/edit/:applicantId/:parcelToken" element={<LandApplicationEditPage />} />
        <Route path="land-allotment/documents/:applicantId/:parcelToken" element={<LandDocumentsPage />} />
        <Route path="land-allotment/history/:applicantId" element={<LandHistoryPage />} />
        <Route path="land-allotment/payment/:applicantId/:parcelToken" element={<LandPaymentPage />} />
        <Route path="land-allotment/query/:applicantId/:parcelToken" element={<LandQueryPage />} />
        <Route path="land-allotment/correct/:applicantId/:parcelToken" element={<LandApplicationEditPage correction />} />
        <Route path="land-allotment/correct-documents/:applicantId/:parcelToken" element={<LandDocumentsPage correction />} />
        <Route path="land-allotment/annual" element={<LandAnnualPaymentPage />} />
        <Route path="land-allotment/annual/:applicantId/:landId" element={<LandAnnualPaymentPage mode="form" />} />
        <Route path="land-allotment/annual-history/:applicantId" element={<LandAnnualPaymentPage mode="history" />} />
        <Route path="land-allotment/annual-detail/:paymentId" element={<LandAnnualPaymentPage mode="detail" />} />
        <Route path="land-allotment/annual-review/:paymentId" element={<LandAnnualReviewPage />} />
        <Route path="land-allotment/payment-retry/:applicantId/:parcelToken" element={<LandPaymentPage retry />} />
        <Route path="land-allotment/payment-status/:applicantId/:parcelToken" element={<LandReceiptPage application />} />
        <Route path="land-allotment/receipt/:crn" element={<LandReceiptPage />} />
        <Route path="land-allotment/loc-receipt/:locChallanId/:crn" element={<LandReceiptPage />} />
        <Route path="land-allotment/payment-enquiry" element={<LandReceiptPage statusLookup />} />
        <Route path="land-allotment/notices" element={<LandNoticesPage />} />
        <Route path="land-allotment/notices/:mode/:id" element={<LandNoticesPage />} />
        <Route path="land-allotment/notices/:mode/:id/:decisionId" element={<LandNoticesPage />} />
        <Route path="land-allotment/appeal-review/:appealId" element={<LandAnnualReviewPage appeal />} />
        <Route path="land-allotment/sign/:applicantId/:parcelToken" element={<LandSigningPage />} />
        <Route path="financial-assistance" element={<IndustrialUnitPage />} />
        <Route path="financial-assistance/*" element={<IndustrialUnitPage />} />
        <Route path="fa" element={<IndustrialUnitPage />} />
        <Route path="fa/*" element={<IndustrialUnitPage />} />
        <Route path="online-nocs" element={<ApplicantDashboard />} />
        <Route path="msme-award" element={<ApplicantDashboard />} />
        <Route path="bank-details" element={<IndustrialProfilePage />} />
        <Route path="status" element={<LandApplicationsPage />} />
        <Route path="grievances" element={<ApplicantDashboard />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="industry-profile" element={<IndustrialProfilePage />} />
        <Route path="updateindustryprofileapplicant" element={<IndustrialProfilePage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />
        <Route path="first-password-change" element={<ChangePasswordPage mode="first" />} />
      </Route>

      {/* ─── 3. Protected Administrator Routes ─────────────────────────── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminDashboard />} />
        <Route path="masters" element={<AdminDashboard />} />
        <Route path="audit-logs" element={<AdminDashboard />} />
        <Route path="reports" element={<AdminDashboard />} />
        <Route path="settings" element={<AdminDashboard />} />
        <Route path="fa/*" element={<IndustrialUnitPage />} />
      </Route>

      {/* ─── 4. Protected Department Officer Routes ─────────────────────── */}
      <Route
        path="/department"
        element={
          <ProtectedRoute allowedRoles={DEPARTMENT_ROLES}>
            <DepartmentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/department/dashboard" replace />} />
        <Route path="dashboard" element={<DepartmentDashboard />} />
        <Route path="land-scrutiny" element={<DepartmentDashboard />} />
        <Route path="inspections" element={<DepartmentDashboard />} />
        <Route path="fa-approvals" element={<DepartmentDashboard />} />
        <Route path="applications" element={<DepartmentDashboard />} />
        <Route path="mis-reports" element={<DepartmentDashboard />} />
        <Route path=":roleSubpath/dashboard" element={<DepartmentDashboard />} />
        <Route path=":roleSubpath/fa/*" element={<IndustrialUnitPage />} />
        <Route path="fa/*" element={<IndustrialUnitPage />} />
      </Route>

      {/* ─── 5. Legacy AngularJS Hash-Route Compatibility Fallbacks ──────── */}
      {/* Catches URLs emitted by Spring Security redirect handlers */}
      <Route path="/applicant/home" element={<LegacyHashRedirect />} />
      <Route path="/applicant/home2" element={<LegacyHashRedirect />} />
      <Route path="/adminSection/home" element={<LegacyHashRedirect />} />
      <Route path="/adminSection/home2" element={<LegacyHashRedirect />} />
      <Route path="/dtic/home" element={<LegacyHashRedirect />} />
      <Route path="/dtic/home2" element={<LegacyHashRedirect />} />
      <Route path="/dtfc/home" element={<LegacyHashRedirect />} />
      <Route path="/dtfc/home2" element={<LegacyHashRedirect />} />
      <Route path="/bank/home" element={<LegacyHashRedirect />} />
      <Route path="/bank/home2" element={<LegacyHashRedirect />} />
      <Route path="/zonal/home" element={<LegacyHashRedirect />} />
      <Route path="/zonal/home2" element={<LegacyHashRedirect />} />
      <Route path="/section/home" element={<LegacyHashRedirect />} />
      <Route path="/section/home2" element={<LegacyHashRedirect />} />
      <Route path="/legalSection/home" element={<LegacyHashRedirect />} />
      <Route path="/legalSection/home2" element={<LegacyHashRedirect />} />
      <Route path="/legalOIC/home" element={<LegacyHashRedirect />} />
      <Route path="/legalOIC/home2" element={<LegacyHashRedirect />} />
      <Route path="/budgetPlanning/home" element={<LegacyHashRedirect />} />
      <Route path="/budgetPlanning/home2" element={<LegacyHashRedirect />} />
      <Route path="/cmcs/cmcshome" element={<LegacyHashRedirect />} />
      <Route path="/cmcs/cmcshome2" element={<LegacyHashRedirect />} />
      <Route path="/cmcsHo/cmcshome2" element={<LegacyHashRedirect />} />
      <Route path="/employee/home" element={<LegacyHashRedirect />} />
      <Route path="/employee/home2" element={<LegacyHashRedirect />} />
      <Route path="/msefc/home" element={<LegacyHashRedirect />} />
      <Route path="/msefc/home2" element={<LegacyHashRedirect />} />
      <Route path="/textile/home" element={<LegacyHashRedirect />} />
      <Route path="/textile/home2" element={<LegacyHashRedirect />} />
      <Route path="/coordinationSection/home" element={<LegacyHashRedirect />} />
      <Route path="/coordinationSection/home2" element={<LegacyHashRedirect />} />
      <Route path="/icOffice/home" element={<LegacyHashRedirect />} />
      <Route path="/icOffice/home2" element={<LegacyHashRedirect />} />
      <Route path="/coordinationOfficer/home" element={<LegacyHashRedirect />} />
      <Route path="/coordinationOfficer/home2" element={<LegacyHashRedirect />} />
      <Route path="/coordinationDD/home" element={<LegacyHashRedirect />} />
      <Route path="/coordinationDD/home2" element={<LegacyHashRedirect />} />
      <Route path="/coordinationJD/home" element={<LegacyHashRedirect />} />
      <Route path="/coordinationJD/home2" element={<LegacyHashRedirect />} />
      <Route path="/auditOfficer/home" element={<LegacyHashRedirect />} />
      <Route path="/auditOfficer/home2" element={<LegacyHashRedirect />} />
      <Route path="/account/home" element={<LegacyHashRedirect />} />
      <Route path="/account/home2" element={<LegacyHashRedirect />} />
      <Route path="/auditSection/home" element={<LegacyHashRedirect />} />
      <Route path="/auditSection/home2" element={<LegacyHashRedirect />} />
      <Route path="/idSection/home" element={<LegacyHashRedirect />} />
      <Route path="/idSection/home2" element={<LegacyHashRedirect />} />
      <Route path="/mbfc/home" element={<LegacyHashRedirect />} />
      <Route path="/mbfc/home2" element={<LegacyHashRedirect />} />
      <Route path="/msme/home" element={<LegacyHashRedirect />} />
      <Route path="/grievanceApplicant/home" element={<LegacyHashRedirect />} />
      <Route path="/grievanceApplicant/home2" element={<LegacyHashRedirect />} />
      <Route path="/committeMember/home" element={<LegacyHashRedirect />} />
      <Route path="/committeMember/home2" element={<LegacyHashRedirect />} />
      <Route path="/zonaloperator/home" element={<LegacyHashRedirect />} />
      <Route path="/startupCenter/home" element={<LegacyHashRedirect />} />
      <Route path="/fa/home" element={<LegacyHashRedirect />} />
      <Route path="/fa/home2" element={<LegacyHashRedirect />} />
      <Route path="/collector/home" element={<LegacyHashRedirect />} />
      <Route path="/ldm/home" element={<LegacyHashRedirect />} />
      <Route path="/secretary/home" element={<LegacyHashRedirect />} />

      {/* ─── 6. Catch-All 404 Route ─────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
