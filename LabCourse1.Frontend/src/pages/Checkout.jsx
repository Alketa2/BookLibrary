import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'
import Modal from '../components/Modal'

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'CashOnDelivery', // 'CashOnDelivery' | 'Card'
    shippingMethod: 'Standard',      // 'Standard' | 'Fast'
  })
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0),
    [cart]
  )
  const shippingCost = form.shippingMethod === 'Fast' ? 4.99 : 2.99
  const total = subtotal + shippingCost

  if (!user) return <div className="container-wide py-12">Please login to continue.</div>
  if (cart.length === 0) return <div className="container-wide py-12">Your cart is empty.</div>

  function validate() {
    if (!form.firstName.trim() || !form.lastName.trim()) return 'First and last name are required.'
    if (!form.phone.trim()) return 'Phone is required.'
    if (!form.address.trim() || !form.city.trim() || !form.postalCode.trim()) return 'Address, City and Postal code are required.'
    if (cart.length === 0) return 'Cart is empty.'
    if (cart.some(i => Number(i.qty) <= 0)) return 'Invalid quantity in cart.'
    return ''
  }

  async function submit(e) {
    e.preventDefault()
    setError('')

    const v = validate()
    if (v) return setError(v)

    try {
      setSubmitting(true)

      // Enums si numra për bindim të sigurt në ASP.NET:
      const paymentMethod = form.paymentMethod === 'Card' ? 1 : 0    // 0=CashOnDelivery, 1=Card
      const shippingMethod = form.shippingMethod === 'Fast' ? 1 : 0   // 0=Standard, 1=Fast

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
        paymentMethod,
        shippingMethod,
        items: cart
          .filter(i => Number(i.qty) > 0)
          .map(i => ({ bookId: Number(i.id), quantity: Number(i.qty) })),
      }

      const res = await api.post('/orders', payload, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })

      localStorage.setItem('cart', JSON.stringify([])); clearCart && clearCart()
      setOpen(true)
    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.response?.statusText ||
        err?.message ||
        'Checkout failed'
      console.log('orders error response:', err?.response?.data)
      setError(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-wide py-12 grid md:grid-cols-2 gap-8">
      <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl p-6 shadow">
        <h2 className="text-xl font-semibold">Checkout Details</h2>
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">First name</label>
            <input className="input" value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm">Last name</label>
            <input className="input" value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })} required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Phone</label>
            <input className="input" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm">Postal code</label>
            <input className="input" value={form.postalCode}
              onChange={e => setForm({ ...form, postalCode: e.target.value })} required />
          </div>
        </div>

        <div>
          <label className="text-sm">Address</label>
          <input className="input" value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })} required />
        </div>

        <div>
          <label className="text-sm">City</label>
          <input className="input" value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Payment method</label>
            <div className="flex gap-3 mt-1">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment"
                  checked={form.paymentMethod === 'CashOnDelivery'}
                  onChange={() => setForm({ ...form, paymentMethod: 'CashOnDelivery' })} />
                Cash on delivery
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment"
                  checked={form.paymentMethod === 'Card'}
                  onChange={() => setForm({ ...form, paymentMethod: 'Card' })} />
                Card
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm">Shipping</label>
            <div className="flex gap-3 mt-1">
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping"
                  checked={form.shippingMethod === 'Standard'}
                  onChange={() => setForm({ ...form, shippingMethod: 'Standard' })} />
                Standard (€2.99)
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping"
                  checked={form.shippingMethod === 'Fast'}
                  onChange={() => setForm({ ...form, shippingMethod: 'Fast' })} />
                Fast (€4.99)
              </label>
            </div>
          </div>
        </div>

        <button className="px-4 py-2 rounded bg-black text-white w-full disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Placing order…' : 'Place order'}
        </button>
      </form>

      <div className="bg-white rounded-2xl p-6 shadow space-y-3">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <ul className="divide-y">
          {cart.map(i => (
            <li key={i.id} className="py-2 flex justify-between">
              <span>{i.title} x {i.qty}</span>
              <span>€{(Number(i.price) * Number(i.qty)).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between pt-2">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>€{shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <Modal
        open={open}
        title="Pagesa u krye me sukses"
        onClose={() => { setOpen(false); navigate('/'); }}
      >
        <p>Porosia juaj u krijua me sukses.</p>
      </Modal>
    </div>
  )
}
