
import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

const empty = {
  title: '', author: '', isbn: '', price: '', stock: '', publishedOn: ''
}

export default function AdminBooks() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = async () => {
    setLoading(true); setMsg('')
    try {
      const { data } = await api.get('/books')
      setList(Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : []))
    } catch (e) {
      setMsg('S’arritëm t’i marrim librat.')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  if (!user || user.role !== 'Admin') {
    return <div className="p-10 text-gray-600">Duhet të jesh <b>Admin</b> për të menaxhuar librat.</div>
  }

  const save = async (e) => {
    e.preventDefault()
    const payload = {
      title: form.title?.trim(),
      author: form.author?.trim(),
      isbn: form.isbn?.trim(),
      price: Number(form.price ?? 0),
      stock: Number(form.stock ?? 0),
      // backend expects an ISO date; allow empty
      publishedOn: form.publishedOn ? new Date(form.publishedOn).toISOString() : null
    }
    try {
      if (editingId) {
        await api.put(`/books/${editingId}`, payload)
        setMsg('U përditësua me sukses.')
      } else {
        await api.post('/books', payload)
        setMsg('U shtua libri me sukses.')
      }
      setForm(empty); setEditingId(null)
      load()
    } catch (e) {
      setMsg('Gabim gjatë ruajtjes.')
    }
  }

  const edit = (b) => {
    setEditingId(b.id)
    setForm({
      title: b.title ?? '',
      author: b.author ?? '',
      isbn: b.isbn ?? '',
      price: b.price ?? '',
      stock: b.stock ?? '',
      publishedOn: b.publishedOn ? b.publishedOn.substring(0,10) : ''
    })
  }

  const del = async (id) => {
    if (!confirm('Delete this book?')) return
    try { await api.delete(`/books/${id}`); load() } catch {}
  }

  return (
    <div className="container-wide py-10 space-y-12">
      <h1 className="text-3xl font-bold">Manage Books</h1>

      {/* form */}
      <form onSubmit={save} className="bg-white rounded-lg shadow p-6 grid md:grid-cols-3 gap-4">
        <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
               placeholder="Title" className="border rounded px-3 py-2" required />
        <input value={form.author} onChange={e=>setForm({...form,author:e.target.value})}
               placeholder="Author" className="border rounded px-3 py-2" required />
        <input value={form.isbn} onChange={e=>setForm({...form,isbn:e.target.value})}
               placeholder="ISBN" className="border rounded px-3 py-2" />
        <input value={form.price} onChange={e=>setForm({...form,price:e.target.value})}
               placeholder="Price" type="number" step="0.01" className="border rounded px-3 py-2" />
        <input value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}
               placeholder="Stock" type="number" className="border rounded px-3 py-2" />
        <input value={form.publishedOn} onChange={e=>setForm({...form,publishedOn:e.target.value})}
               placeholder="Published (YYYY-MM-DD)" type="date" className="border rounded px-3 py-2" />
        <div className="md:col-span-3 flex gap-3">
          <button className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            {editingId ? 'Update' : 'Add Book'}
          </button>
          {editingId &&
            <button type="button" onClick={()=>{setEditingId(null); setForm(empty)}}
              className="px-4 py-2 border rounded">Cancel</button>}
          {msg && <span className="self-center text-sm text-gray-600">{msg}</span>}
        </div>
      </form>

      {/* table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? <p className="p-6 text-gray-500">Loading…</p> : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">ISBN</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((b,i)=>(
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-3">{i+1}</td>
                  <td className="px-4 py-3 font-medium">{b.title}</td>
                  <td className="px-4 py-3">{b.author}</td>
                  <td className="px-4 py-3">{b.isbn}</td>
                  <td className="px-4 py-3">${Number(b.price).toFixed(2)}</td>
                  <td className="px-4 py-3">{b.stock}</td>
                  <td className="px-4 py-3">{b.publishedOn ? new Date(b.publishedOn).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={()=>edit(b)} className="px-3 py-1 border rounded">Edit</button>
                    <button onClick={()=>del(b.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {!list.length && !loading && (
                <tr><td className="px-4 py-6 text-gray-500" colSpan="8">No books yet.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
