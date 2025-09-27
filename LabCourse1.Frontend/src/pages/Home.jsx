
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../contexts/CartContext'

export default function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)
  const { addToCart } = useCart()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        setError('')
        // pull all books and just show the first 12 as “picks”
        const { data } = await api.get('/books')
        const list = Array.isArray(data) ? data : (Array.isArray(data?.items) ? data.items : [])
        if (mounted) setBooks(list.slice(0, 12))
      } catch (e) {
        setError('S’arritëm t’i marrim librat. Provo përsëri.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const scrollLeft  = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left:  300, behavior: 'smooth' })

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section
        className="relative bg-cover bg-center h-[420px] flex items-center"
        style={{ backgroundImage: "url('/images/library-filled-with-books-vyy56lqa9wji657j.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container-wide text-white">
          <h1 className="text-5xl font-extrabold mb-3">Welcome to LibraSpace</h1>
          <p className="text-lg opacity-90">Your gateway to books that inspire.</p>
          <div className="mt-6">
            <Link to="/books" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg">Browse Books</Link>
          </div>
        </div>
      </section>

      {/* QUICK STATS (restored) */}
      <section className="bg-[#3b2a1a] py-12 text-white">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div><div className="text-4xl font-bold text-yellow-400">450</div><div>Customers in 2019</div></div>
          <div><div className="text-4xl font-bold text-yellow-400">27,000</div><div>Books delivered</div></div>
          <div><div className="text-4xl font-bold text-yellow-400">100+</div><div>Bestsellers</div></div>
          <div><div className="text-4xl font-bold text-yellow-400">20</div><div>Events held</div></div>
        </div>
      </section>

      {/* ABOUT (restored) */}
      <section className="bg-white py-16">
        <div className="container-wide grid md:grid-cols-2 gap-10 items-center">
          <img src="/images/books-stack-white-background_53876-30015.jpg" className="w-[380px] mx-auto rounded-lg shadow" />
          <div>
            <h2 className="text-2xl font-semibold mb-3">About LibraSpace</h2>
            <p className="text-gray-600">
              Every month we curate the best new reads. Build your own library, join events,
              and discover your next favorite author.
            </p>
          </div>
        </div>
      </section>

      {/* PICKS OF THE MONTH */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide text-center relative">
          <h2 className="text-3xl font-bold mb-2">Picks of the Month</h2>
          <p className="text-gray-600 mb-10">Freshly added titles from our catalog.</p>

          {error && <p className="text-red-600 mb-4">{error}</p>}
          {loading ? <p className="text-gray-500">Loading…</p> : (
            <div className="relative">
              <button onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-red-500 text-red-600 px-3 py-2 rounded-full shadow">◀</button>

              <div ref={scrollRef} className="flex gap-6 overflow-x-auto px-10 scroll-smooth">
                {books.map(b => (
                  <div key={b.id} className="min-w-[230px] bg-white rounded-lg shadow p-4 flex-shrink-0">
                    <Link to={`/books/${b.id}?type=home`}>
                      <div className="h-44 bg-gray-100 rounded flex items-center justify-center mb-4">
                        <span className="text-gray-400 text-sm">Book Cover</span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold">{b.title}</h3>
                        <p className="text-gray-500 text-sm">{b.author}</p>
                      </div>
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-bold text-red-600">${Number(b.price).toFixed(2)}</span>
                      <button
                        onClick={(e)=>{e.preventDefault(); addToCart(b)}}
                        className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-red-500 text-red-600 px-3 py-2 rounded-full shadow">▶</button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
