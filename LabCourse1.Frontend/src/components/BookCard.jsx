import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function BookCard({ book, source = 'category' }) {
  const { addToCart } = useCart()
  const detailsHref = `/books/${book.id}?type=${source}`

  return (
    <div className="min-w-[220px] max-w-[220px] bg-white rounded-lg shadow-md p-4 flex-shrink-0">
      <Link to={detailsHref}>
        <div className="h-40 flex items-center justify-center bg-gray-100 rounded mb-4">
          <span className="text-gray-400 text-sm">Book Cover</span>
        </div>
        <h3 className="font-semibold text-md hover:text-red-600 transition">{book.title}</h3>
      </Link>

      <p className="text-sm text-gray-500">{book.author}</p>
      <p className="mt-2 font-bold text-red-600">${Number(book.price).toFixed(2)}</p>

      <button
        onClick={(e) => { e.preventDefault(); addToCart(book) }}
        className="mt-3 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
      >
        Add to Cart
      </button>
    </div>
  )
}
