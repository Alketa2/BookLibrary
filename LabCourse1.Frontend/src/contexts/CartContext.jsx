import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'cart'

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {}
  }, [cart])

  const addToCart = (book) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === book.id)
      if (existing) {
        return prev.map(item =>
          item.id === book.id ? { ...item, qty: item.qty + 1 } : item
        )
      }
      return [...prev, { id: book.id, title: book.title, author: book.author, price: book.price, qty: 1 }]
    })
  }

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const clearCart = () => setCart([])

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}