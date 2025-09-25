import React, { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  const addToCart = (book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id)
      if (existing) {
        return prev.map(item =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { ...book, qty: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
