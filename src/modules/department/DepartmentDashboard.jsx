import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import BackendDashboard from '../common/BackendDashboard'

export default function DepartmentDashboard() {
  const { roles } = useAuth()
  if (roles.includes('ROLE_SECRETARY') || roles.includes('SECRETARY')) {
    return <Navigate to="/department/secretary/dashboard" replace />
  }
  return <BackendDashboard title="Department Dashboard" />
}
