import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ok, oops } from '../utils/notify'
import '../assets/auth.css';

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [busy, setBusy] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      await register(form)
      ok('Account created! Welcome 👋')
      nav('/') // or /login if your backend doesn’t auto-auth
    } catch (e) {
      oops(e.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h1>Create account</h1>
        <form onSubmit={onSubmit}>
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={onChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={onChange} required minLength={6} />
          </label>
          <button type="submit" disabled={busy}>{busy ? 'Creating…' : 'Register'}</button>
        </form>

        <p className="auth-bottom-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
