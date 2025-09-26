import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, addToCart, removeFromCart } = useCart() // u hoq checkout

  if (cart.length === 0) {
    return <p className="p-6 text-gray-500">Your cart is empty.</p>
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  return (
    <div className="container-wide py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <ul className="space-y-6">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between items-center border-b pb-4">
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-gray-500">{item.author}</p>
              <p className="text-red-600 font-bold">
                ${item.price.toFixed(2)} x {item.qty}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => addToCart(item)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">+</button>
              <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">–</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
        <button onClick={() => navigate('/checkout')} className="mt-4 px-6 py-3 bg-black text-white rounded-md">
          Checkout
        </button>
      </div>
    </div>
  )
}
