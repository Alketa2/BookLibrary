import React from 'react'

export default function Events(){
  const events = [
    { id:1, title:'Author Talk: Clean Code in 2025', date:'2025-10-01', place:'Online' },
    { id:2, title:'Workshop: Design Patterns for Juniors', date:'2025-10-15', place:'UBT Campus' },
    { id:3, title:'Book Signing: The Pragmatic Programmer', date:'2025-11-05', place:'City Library' },
  ]
  return (
    <div className="container-wide py-10">
      <h1 className="text-3xl font-extrabold">Events</h1>
      <ul className="mt-6 space-y-4">
        {events.map(e => (
          <li key={e.id} className="p-4 bg-white rounded-2xl shadow flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <div className="font-semibold">{e.title}</div>
              <div className="text-sm text-gray-500">{e.place}</div>
            </div>
            <div className="text-sm mt-2 sm:mt-0">{new Date(e.date).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}