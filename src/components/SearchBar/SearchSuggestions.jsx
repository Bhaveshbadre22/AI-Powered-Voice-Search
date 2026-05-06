import React, { useState, useEffect } from 'react'

function getSuggestions(query, products) {
  if (!query || query.length < 2) return []
  const lower = query.toLowerCase()
  const categories = [...new Set(products.map(p => p.category))]
  const allSuggestions = [
    ...categories.filter(c => c.toLowerCase().includes(lower)),
    ...products
      .filter(p => p.title.toLowerCase().includes(lower))
      .map(p => p.title)
      .slice(0, 3),
  ]
  return [...new Set(allSuggestions)].slice(0, 5)
}

function BoldMatch({ text, query }) {
  const lower = text.toLowerCase()
  const idx = lower.indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <strong style={{ fontWeight: 600 }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  )
}

export default function SearchSuggestions({ query, products, onSelect, show }) {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (!show || query.length < 2) {
      setSuggestions([])
      return
    }
    const timer = setTimeout(() => {
      setSuggestions(getSuggestions(query, products))
    }, 300)
    return () => clearTimeout(timer)
  }, [query, products, show])

  if (!show || suggestions.length === 0 || query.length < 2) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        background: 'white',
        border: '0.5px solid rgba(0,0,0,0.1)',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        zIndex: 50,
        overflow: 'hidden',
        animation: 'fade-up 0.15s ease both',
      }}
    >
      {suggestions.map((s, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(s)}
          style={{
            width: '100%',
            padding: '8px 14px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            textAlign: 'left',
            transition: 'background 0.1s',
            color: '#374151',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F9F8FC' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ flex: 1 }}>
            <BoldMatch text={s} query={query} />
          </span>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>↗</span>
        </button>
      ))}
    </div>
  )
}
