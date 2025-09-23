import React, { useRef } from 'react'
import BookCard from '../components/BookCard'

// 30 librat e kategorive (të ndarë në 5 seksione x6)
const categories = {
  Romance: [
    { id: 1, title: "Pride and Prejudice", author: "Jane Austen", price: 12.99 },
    { id: 2, title: "Me Before You", author: "Jojo Moyes", price: 13.99 },
    { id: 3, title: "Twilight", author: "Stephenie Meyer", price: 15.99 },
    { id: 4, title: "The Notebook", author: "Nicholas Sparks", price: 14.50 },
    { id: 5, title: "Outlander", author: "Diana Gabaldon", price: 16.99 },
    { id: 6, title: "To All the Boys", author: "Jenny Han", price: 11.99 },
  ],
  Fantasy: [
    { id: 7, title: "Harry Potter", author: "J.K. Rowling", price: 19.99 },
    { id: 8, title: "The Hobbit", author: "J.R.R. Tolkien", price: 17.99 },
    { id: 9, title: "Eragon", author: "Christopher Paolini", price: 18.50 },
    { id: 10, title: "Percy Jackson", author: "Rick Riordan", price: 14.75 },
    { id: 11, title: "Mistborn", author: "Brandon Sanderson", price: 22.00 },
    { id: 12, title: "The Witcher", author: "Andrzej Sapkowski", price: 21.50 },
  ],
  Mystery: [
    { id: 13, title: "Gone Girl", author: "Gillian Flynn", price: 15.50 },
    { id: 14, title: "Dragon Tattoo", author: "Stieg Larsson", price: 16.99 },
    { id: 15, title: "Big Little Lies", author: "Liane Moriarty", price: 14.99 },
    { id: 16, title: "Sherlock Holmes", author: "Arthur Conan Doyle", price: 12.50 },
    { id: 17, title: "Silent Patient", author: "Alex Michaelides", price: 13.25 },
    { id: 18, title: "In the Woods", author: "Tana French", price: 18.00 },
  ],
  "Non-Fiction": [
    { id: 19, title: "Sapiens", author: "Yuval Noah Harari", price: 19.99 },
    { id: 20, title: "Educated", author: "Tara Westover", price: 17.50 },
    { id: 21, title: "Atomic Habits", author: "James Clear", price: 20.00 },
    { id: 22, title: "Becoming", author: "Michelle Obama", price: 21.99 },
    { id: 23, title: "Outliers", author: "Malcolm Gladwell", price: 15.50 },
    { id: 24, title: "The Body", author: "Bill Bryson", price: 18.75 },
  ],
  Thriller: [
    { id: 25, title: "The Da Vinci Code", author: "Dan Brown", price: 14.50 },
    { id: 26, title: "The Outsider", author: "Stephen King", price: 22.00 },
    { id: 27, title: "The Girl on the Train", author: "Paula Hawkins", price: 13.99 },
    { id: 28, title: "The Couple Next Door", author: "Shari Lapena", price: 15.75 },
    { id: 29, title: "Behind Closed Doors", author: "B.A. Paris", price: 12.99 },
    { id: 30, title: "The Reversal", author: "Michael Connelly", price: 17.50 },
  ],
}

export default function Books() {
  // refs për slider për çdo kategori
  const refs = Object.keys(categories).reduce((acc, key) => {
    acc[key] = useRef(null)
    return acc
  }, {})

  const scroll = (key, dir) => {
    const el = refs[key].current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero / Banner */}
      <section
        className="relative h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/images/library-filled-with-books-vyy56lqa9wji657j.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative text-white text-4xl md:text-5xl font-bold">Book Category</h1>
      </section>

      {/* Kategoritë me slider + divider lines */}
      {Object.entries(categories).map(([genre, list], idx) => (
        <section key={genre} className="container-wide py-12">
          {idx !== 0 && <hr className="border-gray-300 mb-10" />}

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">{genre}</h2>
            <p className="text-gray-600">Explore our {genre.toLowerCase()} collection</p>
          </div>

          <div className="relative">
            <button
              aria-label="Scroll left"
              onClick={() => scroll(genre, 'left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 z-10"
            >
              ◀
            </button>

            <div ref={refs[genre]} className="flex gap-6 overflow-x-auto scrollbar-hide px-10">
              {list.map(b => (
                <BookCard key={b.id} book={b} source="category" />
              ))}
            </div>

            <button
              aria-label="Scroll right"
              onClick={() => scroll(genre, 'right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 z-10"
            >
              ▶
            </button>
          </div>
        </section>
      ))}
    </div>
  )
}
