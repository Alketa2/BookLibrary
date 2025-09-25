import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const auth = useAuth() || {}
  const user = auth.user || null

  if (!user) return <Navigate to="/login" replace />

  return children
}