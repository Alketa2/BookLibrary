import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Books from './pages/Books'
import BookDetails from './pages/BookDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import Events from './pages/Events'
import NewReleases from './pages/NewReleases'
import Bestsellers from './pages/Bestsellers'
import UsedBooks from './pages/UsedBooks'
import Shipping from './pages/Shipping'
import Returns from './pages/Returns'
import Support from './pages/Support'
import AboutUs from './pages/AboutUs'
import Blog from './pages/Blog'


export default function App(){
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/books" element={<Books/>} />
        <Route path="/books/:id" element={<BookDetails/>} />
        <Route path="/events" element={<Events/>} />
        <Route path="/new-releases" element={<NewReleases/>} />
        <Route path="/bestsellers" element={<Bestsellers/>} />
        <Route path="/used-books" element={<UsedBooks/>} />
        <Route path="/shipping" element={<Shipping/>} />
        <Route path="/returns" element={<Returns/>} />
        <Route path="/support" element={<Support/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="*" element={<NotFound/>} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/blog" element={<Blog />} />

      </Routes>
      <Footer/>
    </>
  )
}