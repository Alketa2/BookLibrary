// src/api/axios.js
import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("perchat_access")
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  return cfg
})

function extractMessage(err) {
  const r = err?.response
  const d = r?.data
  // Common ASP.NET cases:
  if (typeof d === "string") return d
  if (d?.message) return d.message
  if (d?.error) return d.error
  if (d?.title) return d.title
  if (d?.errors) {
    // ModelState { field: [ "msg1", "msg2" ] }
    const first = Object.values(d.errors)?.[0]
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
