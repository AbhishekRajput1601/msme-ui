import { Navigate, useLocation } from 'react-router-dom'
import { publicPagePath } from './publicRoutes'

export default function LegacyPublicRedirect() {
  const { pathname, search, hash } = useLocation()
  return <Navigate to={`${publicPagePath(pathname) || '/'}${search}${hash}`} replace />
}
