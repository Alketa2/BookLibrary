// src/pages/BookDetails.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../contexts/CartContext'

export default function BookDetails() {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCart()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const { data } = await api.get(`/books/${id}`)
        if (mounted) setBook(data)
      } catch (e) {
        setError('Nuk e gjetëm librin.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="p-10 text-gray-500">Loading…</div>
  if (error)   return <div className="p-10 text-red-600">{error}</div>
  if (!book)   return <div className="p-10">Book not found.</div>

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="bg-gray-100 h-[420px] rounded flex items-center justify-center">
          <span className="text-gray-400">Book Cover</span>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="mt-2 text-gray-700">by {book.author}</p>

          <dl className="mt-6 space-y-2 text-sm text-gray-600">
            <div><dt className="inline font-semibold">ISBN: </dt><dd className="inline">{book.isbn}</dd></div>
            <div><dt className="inline font-semibold">Published: </dt><dd className="inline">
              {book.publishedOn ? new Date(book.publishedOn).toLocaleDateString() : '—'}
            </dd></div>
            <div><dt className="inline font-semibold">Stock: </dt><dd className="inline">{book.stock}</dd></div>
          </dl>

          <div className="mt-6 flex items-center gap-4">
            <div className="text-2xl font-bold text-red-600">${Number(book.price).toFixed(2)}</div>
            <button
              onClick={() => addToCart(book)}
              className="px-5 py-3 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
