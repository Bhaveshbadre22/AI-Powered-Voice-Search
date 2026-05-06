import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchProducts } from '../../features/products/productsSlice'

export default function ErrorState() {
  const dispatch = useAppDispatch()
  const error = useAppSelector(state => state.products.error)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 0',
      textAlign: 'center',
    }}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#F09595"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginBottom: '16px' }}
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>

      <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#2C2C2A', margin: '0 0 6px' }}>
        Something went wrong
      </h3>

      <p style={{ fontSize: '13px', color: '#888780', margin: '0 0 20px', maxWidth: '280px' }}>
        {error}
      </p>

      <button
        type="button"
        onClick={() => dispatch(fetchProducts())}
        style={{
          background: 'white',
          border: '0.5px solid rgba(0,0,0,0.1)',
          borderRadius: '10px',
          padding: '8px 18px',
          fontSize: '13px',
          color: '#444441',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Retry
      </button>
    </div>
  )
}
