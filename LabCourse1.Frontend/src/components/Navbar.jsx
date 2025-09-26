import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const { cart } = useCart()
  const { user, logout } = useAuth() || {}

  // Prefer username/fullName; DO NOT fall back to email to avoid showing it when logged
  const displayName = (
    user?.username ||
    user?.userName ||
    user?.fullName ||
    user?.FullName ||
    user?.name ||
    ''
  )

  const roleVal = (user?.role ?? user?.Role ?? '').toString()
  const isAdmin = roleVal === '1' || (typeof roleVal==='string' && roleVal.toLowerCase() === 'admin')

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Left: Logo */}
        <NavLink to="/" className="text-2xl font-bold text-red-700">LibraSpace</NavLink>

        {/* Center: Main nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="hover:underline">Home</NavLink>
          <NavLink to="/books" className="hover:underline">Books</NavLink>
          <NavLink to="/events" className="hover:underline">Events</NavLink>
          <NavLink to="/about" className="hover:underline">About Us</NavLink>
          <NavLink to="/blog" className="hover:underline">Blog</NavLink>
          {isAdmin && <NavLink to="/dashboard" className="hover:underline">Dashboard</NavLink>}
        </nav>

        {/* Right: Auth + Cart */}
        <div className="flex items-center gap-4">
          <NavLink to="/cart" className="relative font-medium">
            Cart{totalItems > 0 ? ` (${totalItems})` : ''}
          </NavLink>

          {/* If NOT authenticated: show Sign in / Create account */}
          {!user && (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="px-3 py-1 rounded border">Sign in</NavLink>
              <NavLink to="/register" className="px-3 py-1 rounded bg-red-600 text-white">Create account</NavLink>
            </div>
          )}

          {/* If authenticated: show Hello, <username> + Logout */}
          {user && (
            <div className="flex items-center gap-3">
              {displayName && (
                <span className="text-sm text-gray-700">
                  Hello, <strong>{displayName}</strong>
                </span>
              )}
              <button onClick={logout} className="px-3 py-1 rounded border">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
