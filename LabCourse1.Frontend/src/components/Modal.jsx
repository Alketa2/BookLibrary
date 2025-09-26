import React from 'react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="text-sm">{children}</div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 rounded bg-black text-white" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  )
}
