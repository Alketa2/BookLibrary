import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/axios'

const AuthCtx = createContext({})
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const cached = localStorage.getItem('perchat_user')
      if (cached) setUser(JSON.parse(cached))
    } catch {}
    setLoading(false)
  }, [])

  async function login({ email, password }) {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const token = data?.token || data?.Token || data?.accessToken
      if (token) localStorage.setItem('perchat_access', token)

      let profile = data?.user || null
      if (!profile) {
        try {
          const me = await api.get('/auth/me')
          profile = me?.data || { email }
        } catch { profile = { email } }
      }
      setUser(profile)
      localStorage.setItem('perchat_user', JSON.stringify(profile))
      return profile
    } catch (e) {
      throw new Error(e.message || 'Login failed')
    }
  }

  async function register({ fullName, email, password }) {
    try {
      const { data } = await api.post('/auth/register', { fullName, email, password })
      const token = data?.token || data?.Token || data?.accessToken
      if (token) {
        localStorage.setItem('perchat_access', token)
        const profile = data?.user || { fullName, email }
        setUser(profile)
        localStorage.setItem('perchat_user', JSON.stringify(profile))
        return profile
      }
      // backend didn’t return token? try to login immediately
      await login({ email, password })
      return true
    } catch (e) {
      throw new Error(e.message || 'Registration failed')
    }
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
