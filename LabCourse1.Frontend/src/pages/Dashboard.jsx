import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

export default function Dashboard(){
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [orders, setOrders] = useState([])

  // edit modals state
  const [editingUser, setEditingUser] = useState(null)
  const [editingBook, setEditingBook] = useState(null)

  function startEditUser(u){ setEditingUser({ ...u }) }
  function startEditBook(b){ setEditingBook({ ...b }) }

  async function saveUser(){
    if (!editingUser) return
    const payload = { fullName: editingUser.fullName, email: editingUser.email, role: editingUser.role }
    await api.put(`/admin/users/${editingUser.id}`, payload)
    setUsers(users.map(x => x.id === editingUser.id ? { ...editingUser } : x))
    setEditingUser(null)
  }
  async function deleteUser(id){
    if (!confirm('Delete this user?')) return
    await api.delete(`/admin/users/${id}`)
    setUsers(users.filter(x => x.id !== id))
  }

  async function saveBook(){
    if (!editingBook) return
    const payload = { title: editingBook.title, author: editingBook.author, price: editingBook.price, stock: editingBook.stock }
    await api.put(`/books/${editingBook.id}`, payload)
    setBooks(books.map(x => x.id === editingBook.id ? { ...editingBook } : x))
    setEditingBook(null)
  }
  async function deleteBook(id){
    if (!confirm('Delete this book?')) return
    await api.delete(`/books/${id}`)
    setBooks(books.filter(x => x.id !== id))
  }

  useEffect(()=>{
    api.get('/admin/stats').then(r=> setStats(r.data)).catch(()=>{})
    api.get('/admin/users').then(r=> setUsers(r.data)).catch(()=>{})
    api.get('/admin/books').then(r=> setBooks(r.data)).catch(()=>{})
    api.get('/admin/orders').then(r=> setOrders(r.data)).catch(()=>{})
  }, [])

  return (
    <div className="container-wide py-10 space-y-10">
      <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Stat label="Orders" value={stats?.orders}/>
        <Stat label="Books" value={stats?.books}/>
        <Stat label="Users" value={stats?.users}/>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-3">Users</h2>
        <div className="overflow-auto bg-white rounded-2xl shadow">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50">
              <th className="text-left p-3">Id</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-left p-3">Created</th><th className="text-right p-3">Actions</th>
            </tr></thead>
            <tbody>
              {users.map(u=> (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={()=> startEditUser(u)} className="px-3 py-1 rounded bg-blue-600 text-white">Edit</button>
                    <button onClick={()=> deleteUser(u.id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Books</h2>
        <div className="overflow-auto bg-white rounded-2xl shadow">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50">
              <th className="text-left p-3">Id</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Author</th>
              <th className="text-left p-3">ISBN</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Stock</th><th className="text-right p-3">Actions</th><th className="text-right p-3">Actions</th>
            </tr></thead>
            <tbody>
              {books.map(b=> (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.title}</td>
                  <td className="p-3">{b.author}</td>
                  <td className="p-3">{b.isbn}</td>
                  <td className="p-3">{b.price}</td>
                  <td className="p-3">{b.stock}</td>
                  <td className="p-3 text-right space-x-2">
                    <button onClick={()=> startEditBook(b)} className="px-3 py-1 rounded bg-blue-600 text-white">Edit</button>
                    <button onClick={()=> deleteBook(b.id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-3">Orders</h2>
        <div className="overflow-auto bg-white rounded-2xl shadow">
          <table className="min-w-full text-sm">
            <thead><tr className="bg-gray-50">
              <th className="text-left p-3">Id</th>
              <th className="text-left p-3">Created</th><th className="text-right p-3">Actions</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Items</th>
            </tr></thead>
            <tbody>
              {orders.map(o=> (
                <tr key={o.id} className="border-t align-top">
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3">{o.total?.toFixed ? o.total.toFixed(2) : o.total}</td>
                  <td className="p-3">{o.user?.fullName} ({o.user?.email})</td>
                  <td className="p-3">
                    {o.items?.map(it => (
                      <div key={it.id}>{it.quantity} × {it.book?.title} @ {it.unitPrice}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    
      {/* Edit User Modal */}
      <Modal open={!!editingUser} title="Edit User" onClose={()=> setEditingUser(null)}>
        {editingUser && (
          <form className="space-y-3" onSubmit={(e)=> { e.preventDefault(); saveUser(); }}>
            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Full name</div>
              <input className="w-full border rounded px-3 py-2" value={editingUser.fullName} onChange={e=> setEditingUser({...editingUser, fullName: e.target.value})} />
            </label>
            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <input className="w-full border rounded px-3 py-2" value={editingUser.email} onChange={e=> setEditingUser({...editingUser, email: e.target.value})} />
            </label>
            <label className="block">
              <div className="text-xs text-gray-500 mb-1">Role</div>
              <select className="w-full border rounded px-3 py-2" value={editingUser.role} onChange={e=> setEditingUser({...editingUser, role: e.target.value})}>
                <option>User</option>
                <option>Librarian</option>
                <option>Admin</option>
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="px-3 py-2 rounded border" onClick={()=> setEditingUser(null)}>Cancel</button>
              <button type="submit" className="px-3 py-2 rounded bg-black text-white">Save</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Edit Book Modal */}
      <Modal open={!!editingBook} title="Edit Book" onClose={()=> setEditingBook(null)}>
        {editingBook && (
          <form className="space-y-3" onSubmit={(e)=> { e.preventDefault(); saveBook(); }}>
            <div className="grid grid-cols-2 gap-3">
              <label className="block col-span-2">
                <div className="text-xs text-gray-500 mb-1">Title</div>
                <input className="w-full border rounded px-3 py-2" value={editingBook.title} onChange={e=> setEditingBook({...editingBook, title: e.target.value})} />
              </label>
              <label className="block col-span-2">
                <div className="text-xs text-gray-500 mb-1">Author</div>
                <input className="w-full border rounded px-3 py-2" value={editingBook.author} onChange={e=> setEditingBook({...editingBook, author: e.target.value})} />
              </label>
              <label className="block">
                <div className="text-xs text-gray-500 mb-1">Price</div>
                <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={editingBook.price} onChange={e=> setEditingBook({...editingBook, price: parseFloat(e.target.value)})} />
              </label>
              <label className="block">
                <div className="text-xs text-gray-500 mb-1">Stock</div>
                <input type="number" className="w-full border rounded px-3 py-2" value={editingBook.stock} onChange={e=> setEditingBook({...editingBook, stock: parseInt(e.target.value||'0')})} />
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="px-3 py-2 rounded border" onClick={()=> setEditingBook(null)}>Cancel</button>
              <button type="submit" className="px-3 py-2 rounded bg-black text-white">Save</button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  )
}

function Stat({label, value}){
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-extrabold mt-1">{value ?? '—'}</div>
    </div>
  )
}