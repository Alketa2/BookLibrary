import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { Toaster } from 'react-hot-toast'
import './assets/main.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
        <App />
        <Toaster position="top-right" />
              </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </BrowserRouter>
)
