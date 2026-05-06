import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { clearSearch, setQuery } from '../../features/search/searchSlice'
import { clearFiltered } from '../../features/products/productsSlice'
import { useProductSearch } from '../../hooks/useProductSearch'

const SUGGESTIONS = [
  { label: 'affordable watches', icon: '⌚' },
  { label: 'premium jewellery', icon: '💎' },
  { label: "casual men's wear", icon: '👕' },
  { label: 'electronics under $100', icon: '📱' },
  { label: 'cozy winter jackets', icon: '🧥' },
  { label: 'gifts under $50', icon: '🎁' },
]

export default function EmptyState() {
  const dispatch = useAppDispatch()
  const query = useAppSelector(state => state.search.query)
  const { handleSearch } = useProductSearch()

  const handleClear = () => {
    dispatch(clearSearch())
    dispatch(clearFiltered())
  }

  const handleSuggestion = label => {
    dispatch(clearFiltered())
    dispatch(setQuery(label))
    handleSearch(label)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 0 32px',
      textAlign: 'center',
    }}>
      <svg
        width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke="#D3D1C7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ marginBottom: '16px' }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8.5" y1="8.5" x2="13.5" y2="13.5" />
        <line x1="13.5" y1="8.5" x2="8.5" y2="13.5" />
      </svg>

      <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#2C2C2A', margin: '0 0 6px' }}>
        No matches found
      </h3>

      <p style={{ fontSize: '13px', color: '#888780', margin: '0 0 20px', maxWidth: '280px', lineHeight: 1.5 }}>
        No products matched &ldquo;<span style={{ fontStyle: 'italic' }}>{query}</span>&rdquo;. Try one of these instead:
      </p>

      <button
        type="button"
        onClick={handleClear}
        style={{
          background: 'white',
          border: '0.5px solid rgba(0,0,0,0.1)',
          borderRadius: '10px',
          padding: '8px 18px',
          fontSize: '13px',
          color: '#444441',
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: '28px',
        }}
      >
        Clear and try again
      </button>

      {/* Suggestion chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px',
        maxWidth: '480px',
      }}>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s.label}
            type="button"
            onClick={() => handleSuggestion(s.label)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#EEEDFE',
              border: '0.5px solid rgba(127,119,221,0.2)',
              borderRadius: '22px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#534AB7',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s',
              animation: 'fade-up 0.3s ease both',
              animationDelay: `${i * 0.05}s`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#CECBF6'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#EEEDFE'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
