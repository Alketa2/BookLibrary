import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthCtx = createContext({})
export const useAuth = () => useContext(AuthCtx)

/**
 * AuthProvider
 * - Persists access token in localStorage: perchat_access
 * - Persists user object in localStorage: perchat_user
 * - Exposes { user, loading, login, register, logout }
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Bootstrap session from localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('perchat_access')
      const cached = localStorage.getItem('perchat_user')
      if (token && cached) {
        setUser(JSON.parse(cached))
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  async function login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password })
    const token = data?.token || data?.accessToken || data?.access_token
    const u = data?.user || data?.User || data
    if (!token || !u) throw new Error('Invalid login response')
    localStorage.setItem('perchat_access', token)
    localStorage.setItem('perchat_user', JSON.stringify(u))
    setUser(u)
    return true
  }

  async function register({ fullName, email, password }) {
    const { data } = await api.post('/auth/register', { fullName, email, password })
    // Some backends auto-login after register; support both
    const token = data?.token || data?.accessToken || data?.access_token
    const u = data?.user || data?.User || null
    if (token && u) {
      localStorage.setItem('perchat_access', token)
      localStorage.setItem('perchat_user', JSON.stringify(u))
      setUser(u)
    }
    return true
  }

  function logout() {
    localStorage.removeItem('perchat_access')
    localStorage.removeItem('perchat_user')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
