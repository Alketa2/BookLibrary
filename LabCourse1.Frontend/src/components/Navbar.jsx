import React from 'react'
import { NavLink } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

export default function Navbar() {
  const { cart } = useCart()

  // Numëron të gjitha produktet sipas qty
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="shadow bg-white">
      <div className="container-wide flex justify-between items-center py-4">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-red-600">
          LibraSpace
        </NavLink>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            className={({isActive}) => 
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            } 
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/books" 
            className={({isActive}) => 
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }
          >
            Books
          </NavLink>
          <NavLink 
            to="/events" 
            className={({isActive}) => 
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }
          >
            Events
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({isActive}) => 
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/about" 
            className={({isActive}) => 
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }
          >
            About Us
          </NavLink>
          <NavLink 
            to="/blog" 
            className={({isActive}) => 
              isActive ? 'text-primary font-semibold' : 'text-gray-600 hover:text-primary'
            }
          >
            Blog
          </NavLink>
        </nav>

        {/* Right side - Cart & Auth */}
        <div className="flex items-center gap-4">
          <NavLink to="/cart" className="relative">
            <span className="px-4 py-2 border rounded hover:bg-gray-50">Cart</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {totalItems}
              </span>
            )}
          </NavLink>
          <NavLink 
            to="/login" 
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Sign in
          </NavLink>
          <NavLink 
            to="/register" 
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Create account
          </NavLink>
        </div>
      </div>
    </header>
  )
}
