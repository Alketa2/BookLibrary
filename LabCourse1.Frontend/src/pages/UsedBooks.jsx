import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import BookCard from '../components/BookCard'

export default function UsedAndBargain(){ 
  const [books, setBooks] = useState([])
  useEffect(()=>{ 
    api.get('/books').then(r=> setBooks(Array.isArray(r.data)? r.data : (Array.isArray(r.data?.items)? r.data.items:[])))
      .catch(()=> setBooks(sample)) 
  },[])
  return (
    <div className="container-wide py-10">
      <h1 className="text-3xl font-extrabold">Used & Bargain</h1>
      <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map(b => <BookCard key={b.id} book={b} />)}
      </div>
    </div>
  )
}
const sample = Array.from({length:8}).map((_,i)=>({id:i+1,title:'Used & Bargain ' + (i+1), author:'Various', price:9.99}))