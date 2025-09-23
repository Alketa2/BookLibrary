import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ok, oops } from '../utils/notify'
import '../assets/auth.css';

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [busy, setBusy] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await login(form)
      ok('Logged in successfully')
      nav('/') // go home or dashboard
    } catch (e) {
      oops(e.message || 'Invalid email or password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h1>Login</h1>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={onChange} required />
          </label>
          <button type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Login'}</button>
        </form>

        <p className="auth-bottom-text">
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
