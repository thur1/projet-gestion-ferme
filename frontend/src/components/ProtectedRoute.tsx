import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { hasAccessToken } from '../lib/api-client'

export function ProtectedRoute() {
  const location = useLocation()
  const isAuthed = hasAccessToken()

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
