import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'


const homePicks = [
  { id: 'h1', title: 'Sisters in the Wind', author: 'Angeline Boulley', price: 19.99 },
  { id: 'h2', title: 'Hot Wax', author: 'M. L. Rio', price: 16.99 },
  { id: 'h3', title: 'Orlanda', author: 'Jacqueline Harpman', price: 14.99 },
  { id: 'h4', title: 'All the Way to the River', author: 'Elizabeth Gilbert', price: 22.50 },
  { id: 'h5', title: 'Frog', author: 'Mo Yan', price: 18.00 },
  { id: 'h6', title: 'The Hush', author: 'John Hart', price: 20.00 },
  { id: 'h7', title: 'The Outsider', author: 'Stephen King', price: 25.00 },
  { id: 'h8', title: 'Sick Game', author: 'Mary Kast', price: 15.00 },
]


const categoryBooks = [
  // Romance
  { id: 1, title: 'Pride and Prejudice', author: 'Jane Austen', price: 12.99, genre: 'Romance' },
  { id: 2, title: 'Me Before You', author: 'Jojo Moyes', price: 13.99, genre: 'Romance' },
  { id: 3, title: 'Twilight', author: 'Stephenie Meyer', price: 15.99, genre: 'Romance' },
  { id: 4, title: 'The Notebook', author: 'Nicholas Sparks', price: 14.50, genre: 'Romance' },
  { id: 5, title: 'Outlander', author: 'Diana Gabaldon', price: 16.99, genre: 'Romance' },
  { id: 6, title: 'To All the Boys', author: 'Jenny Han', price: 11.99, genre: 'Romance' },

  // Fantasy
  { id: 7, title: 'Harry Potter', author: 'J.K. Rowling', price: 19.99, genre: 'Fantasy' },
  { id: 8, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 17.99, genre: 'Fantasy' },
  { id: 9, title: 'Eragon', author: 'Christopher Paolini', price: 18.50, genre: 'Fantasy' },
  { id: 10, title: 'Percy Jackson', author: 'Rick Riordan', price: 14.75, genre: 'Fantasy' },
  { id: 11, title: 'Mistborn', author: 'Brandon Sanderson', price: 22.00, genre: 'Fantasy' },
  { id: 12, title: 'The Witcher', author: 'Andrzej Sapkowski', price: 21.50, genre: 'Fantasy' },

  // Mystery
  { id: 13, title: 'Gone Girl', author: 'Gillian Flynn', price: 15.50, genre: 'Mystery' },
  { id: 14, title: 'Dragon Tattoo', author: 'Stieg Larsson', price: 16.99, genre: 'Mystery' },
  { id: 15, title: 'Big Little Lies', author: 'Liane Moriarty', price: 14.99, genre: 'Mystery' },
  { id: 16, title: 'Sherlock Holmes', author: 'Arthur Conan Doyle', price: 12.50, genre: 'Mystery' },
  { id: 17, title: 'Silent Patient', author: 'Alex Michaelides', price: 13.25, genre: 'Mystery' },
  { id: 18, title: 'In the Woods', author: 'Tana French', price: 18.00, genre: 'Mystery' },

  // Non-Fiction
  { id: 19, title: 'Sapiens', author: 'Yuval Noah Harari', price: 19.99, genre: 'Non-Fiction' },
  { id: 20, title: 'Educated', author: 'Tara Westover', price: 17.50, genre: 'Non-Fiction' },
  { id: 21, title: 'Atomic Habits', author: 'James Clear', price: 20.00, genre: 'Non-Fiction' },
  { id: 22, title: 'Becoming', author: 'Michelle Obama', price: 21.99, genre: 'Non-Fiction' },
  { id: 23, title: 'Outliers', author: 'Malcolm Gladwell', price: 15.50, genre: 'Non-Fiction' },
  { id: 24, title: 'The Body', author: 'Bill Bryson', price: 18.75, genre: 'Non-Fiction' },

  // Thriller
  { id: 25, title: 'The Da Vinci Code', author: 'Dan Brown', price: 14.50, genre: 'Thriller' },
  { id: 26, title: 'The Outsider', author: 'Stephen King', price: 22.00, genre: 'Thriller' },
  { id: 27, title: 'The Girl on the Train', author: 'Paula Hawkins', price: 13.99, genre: 'Thriller' },
  { id: 28, title: 'The Couple Next Door', author: 'Shari Lapena', price: 15.75, genre: 'Thriller' },
  { id: 29, title: 'Behind Closed Doors', author: 'B.A. Paris', price: 12.99, genre: 'Thriller' },
  { id: 30, title: 'The Reversal', author: 'Michael Connelly', price: 17.50, genre: 'Thriller' },
]

export default function BookDetails() {
  const { id } = useParams()
  const location = useLocation()
  const { addToCart } = useCart()


  const typeParam = new URLSearchParams(location.search).get('type')

  const type = typeParam || (/^h/i.test(String(id)) ? 'home' : 'category')

  const dataset = type === 'home' ? homePicks : categoryBooks
  const book = dataset.find(b => String(b.id) === String(id))

  if (!book) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center">
        <h1 className="text-2xl font-semibold mb-3">Book not found</h1>
        <p className="text-gray-600">
          We couldn’t locate this book in the <span className="font-medium">{type}</span> list.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div className="w-full h-96 bg-gray-100 rounded shadow flex items-center justify-center">
          <span className="text-gray-400">Book Cover</span>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="mt-2 text-lg text-gray-700">by {book.author}</p>
          <p className="mt-1 text-sm text-gray-500 capitalize">{type === 'home' ? 'Featured pick' : book.genre}</p>

          <p className="mt-6 text-2xl font-semibold text-red-600">${Number(book.price).toFixed(2)}</p>

          <button
            onClick={() => addToCart(book)}
            className="mt-6 w-full py-3 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
