import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const auth = useAuth() || {}
  const user = auth.user || null

  if (!user) return <Navigate to="/login" replace />

  
  // If this route requires admin and the user is not admin, redirect home
  const roleVal = (user?.role ?? user?.Role ?? '').toString()
  const isAdmin = roleVal === '1' || roleVal.toLowerCase() === 'admin'
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />

  return children
}
