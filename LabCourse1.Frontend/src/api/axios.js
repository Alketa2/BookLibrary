// src/api/axios.js
import axios from "axios"

function computeBaseUrl() {
  const raw = import.meta.env.VITE_API_URL
  if (!raw) return "/api"
  const trimmed = String(raw).replace(/\/+$/, "")
  return /\/api\/?$/.test(trimmed) ? trimmed : trimmed + "/api"
}

const api = axios.create({
  baseURL: computeBaseUrl(),
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("perchat_access")
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

function extractMessage(err) {
  const r = err?.response
  if (r?.data) {
    if (typeof r.data === "string") return r.data
    if (r.data?.message) return r.data.message
    const first = Array.isArray(r.data?.errors)
      ? r.data.errors
      : (r.data?.errors && Object.values(r.data.errors)[0])
    if (Array.isArray(first) && first.length) return first[0]
  }
  return err?.message || "Unexpected error"
}

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject({ 
    message: extractMessage(err),
    status: err?.response?.status ?? 0,
    data: err?.response?.data
  })
)

export default api