import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard(){
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [orders, setOrders] = useState([])

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
              <th className="text-left p-3">Created</th>
            </tr></thead>
            <tbody>
              {users.map(u=> (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.id}</td>
                  <td className="p-3">{u.fullName}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{new Date(u.createdAt).toLocaleString()}</td>
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
              <th className="text-left p-3">Stock</th>
            </tr></thead>
            <tbody>
              {books.map(b=> (
                <tr key={b.id} className="border-t">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.title}</td>
                  <td className="p-3">{b.author}</td>
                  <td className="p-3">{b.isbn}</td>
                  <td className="p-3">{b.price?.toFixeded ? b.price.toFixeded(2) : b.price}</td>
                  <td className="p-3">{b.stock}</td>
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
              <th className="text-left p-3">Created</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">User</th>
              <th className="text-left p-3">Items</th>
            </tr></thead>
            <tbody>
              {orders.map(o=> (
                <tr key={o.id} className="border-t align-top">
                  <td className="p-3">{o.id}</td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-3">{o.total?.toFixeded ? o.total.toFixeded(2) : o.total}</td>
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