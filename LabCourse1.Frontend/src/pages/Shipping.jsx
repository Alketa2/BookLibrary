import React from 'react'

export default function Shipping(){
  return (
    <div className="container-wide py-10 prose max-w-none">
      <h1>Shipping</h1>
      <p>We ship within 1–3 business days. Standard delivery typically arrives in 3–7 days domestically.</p>
      <ul>
        <li>Standard: 3–7 business days</li>
        <li>Express: 1–3 business days</li>
        <li>International: 7–21 business days</li>
      </ul>
      <p>Tracking info will be emailed after dispatch.</p>
    </div>
  )
}