import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import BookCard from '../components/BookCard'

export default function Home() {
  const [picks, setPicks] = useState([])
  const scrollRef = useRef(null)

  useEffect(() => {
    // nëse s’ka API, përdor fallback
    api.get('/books?featured=true')
      .then(r => {
        const d = r?.data
        const list = Array.isArray(d) ? d : (Array.isArray(d?.items) ? d.items : [])
        // Nëse vijnë nga API, sigurohu që id-të të mos përplasen me kategoritë
        const normalized = list.map((b, i) => ({
          id: b.id ? `h_${b.id}` : `h${i + 1}`,
          title: b.title,
          author: b.author,
          price: Number(b.price ?? 14.99)
        }))
        setPicks(normalized.length ? normalized : sampleHome)
      })
      .catch(() => setPicks(sampleHome))
  }, [])

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })

  return (
    <div>
      
      <section
        className="relative bg-cover bg-center h-[520px] flex items-center"
        style={{ backgroundImage: "url('/images/library-filled-with-books-vyy56lqa9wji657j.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative container-wide">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow mb-4">
            Best New Reads Every Month
          </h1>
        <p className="text-white/90 max-w-2xl text-lg">
            We deliver 5 books every month based on your personal preferences.
          </p>
          <Link
            to="/books"
            className="inline-block mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* === Stats Section (brown + gold) === */}
      <section className="bg-[#3b2a1a] text-white py-12">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-yellow-400">450</div>
            <div className="text-gray-200 mt-2">Customers in 2019</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-yellow-400">27,000</div>
            <div className="text-gray-200 mt-2">Books delivered</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-yellow-400">100+</div>
            <div className="text-gray-200 mt-2">Bestsellers</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-serif font-bold text-yellow-400">20</div>
            <div className="text-gray-200 mt-2">Events held</div>
          </div>
        </div>
      </section>

      {/* === About LibraSpace === */}
      <section className="bg-white py-16">
        <div className="container-wide grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <img
              src="/images/books-stack-white-background_53876-30015.jpg"
              alt="Book stack"
              className="w-[360px] rotate-3 drop-shadow-xl rounded-lg"
            />
          </div>
          <div>
            <p className="text-yellow-700 font-semibold mb-3">
              We make books great again. Just kidding, books were always great!
            </p>
            <p className="text-gray-600">
              Every month, we send our subscribers a box with the five best books.
              These are bestsellers and classics that deserve to be read and placed on
              your shelf. We select according to your preferences, plus you can attend
              events, join the club, or visit our store in New York.
            </p>
          </div>
        </div>
      </section>

      <section
        className="py-16 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/library-filled-with-books-vyy56lqa9wji657j.jpg')" }}
      >
        <div className="bg-white/85 py-12">
          <div className="container-wide">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold">Picks of the Month</h2>
              <p className="text-gray-600 mt-2">
                Handpicked titles from our staff. Explore the stories everyone is talking about.
              </p>
            </div>

            <div className="relative">
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow hover:bg-gray-100 rounded-full p-2 z-10"
                aria-label="Scroll left"
              >
                ◀
              </button>

              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-10"
              >
                {(Array.isArray(picks) ? picks : sampleHome).map(b => (
                  <BookCard key={b.id} book={b} source="home" />
                ))}
              </div>

              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 shadow hover:bg-gray-100 rounded-full p-2 z-10"
                aria-label="Scroll right"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ID për Home — id të veçanta që fillojnë me 'h'
const sampleHome = [
  { id: 'h1', title: 'Sisters in the Wind', author: 'Angeline Boulley', price: 19.99 },
  { id: 'h2', title: 'Hot Wax', author: 'M. L. Rio', price: 16.99 },
  { id: 'h3', title: 'Orlanda', author: 'Jacqueline Harpman', price: 14.99 },
  { id: 'h4', title: 'All the Way to the River', author: 'Elizabeth Gilbert', price: 22.50 },
  { id: 'h5', title: 'Frog', author: 'Mo Yan', price: 18.00 },
  { id: 'h6', title: 'The Hush', author: 'John Hart', price: 20.00 },
  { id: 'h7', title: 'The Outsider', author: 'Stephen King', price: 25.00 },
  { id: 'h8', title: 'Sick Game', author: 'Mary Kast', price: 15.00 },
]
