import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="bg-neutral-900 text-neutral-200">
      <div className="container-wide py-8 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="bg-primary text-white font-extrabold px-3 py-2 rounded inline-block">PERCHA·T</div>
          <p className="mt-4 text-sm text-neutral-400">Your indie online bookstore. Discover staff picks, events, and more.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Explore</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/new-releases" className="hover:underline">New Releases</Link></li>
            <li><Link to="/bestsellers" className="hover:underline">Bestsellers</Link></li>
            <li><Link to="/used-books" className="hover:underline">Used Books</Link></li>
            <li><Link to="/events" className="hover:underline">Events</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Help</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/shipping" className="hover:underline">Shipping</Link></li>
            <li><Link to="/returns" className="hover:underline">Returns</Link></li>
            <li><Link to="/support" className="hover:underline">Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Newsletter</h4>
          <p className="text-sm text-neutral-400">Get our picks of the month.</p>
          <div className="mt-2 flex">
            <input placeholder="you@example.com" className="flex-1 px-3 py-2 rounded-l bg-neutral-800 text-neutral-100 outline-none"/>
            <button className="px-4 py-2 bg-primary rounded-r">Join</button>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-500 py-4 border-t border-neutral-800">© 2025 LibraSpace. All rights reserved.</div>
    </footer>
  )
}