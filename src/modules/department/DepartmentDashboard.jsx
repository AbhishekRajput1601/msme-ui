import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import BackendDashboard from '../common/BackendDashboard'
import DticDashboard from '../dtic/DticDashboard'

export default function DepartmentDashboard() {
  const { roles } = useAuth()
  if (roles.includes('ROLE_SECRETARY') || roles.includes('SECRETARY')) {
    return <Navigate to="/department/secretary/dashboard" replace />
  }
  if (roles.includes('ROLE_DTIC') || roles.includes('DTIC')) return <DticDashboard />
  return <BackendDashboard title="Department Dashboard" />
}
