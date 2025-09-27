import React from 'react'
import { Link } from 'react-router-dom'
export default function NotFound(){ return (<div className='container-wide py-20 text-center'><h1 className='text-5xl font-extrabold'>404</h1><p className='mt-2 text-gray-600'>This page could not be found.</p><Link to='/' className='mt-6 inline-block px-4 py-2 rounded bg-primary text-white'>Go home</Link></div>) }
