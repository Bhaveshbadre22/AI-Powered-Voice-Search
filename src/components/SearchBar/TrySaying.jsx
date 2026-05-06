import React, { useState, useEffect } from 'react'

const ALL_SUGGESTIONS = [
  'affordable watches for men',
  'premium women jewellery',
  "casual men's wear",
  'electronics under $100',
  'cozy winter jackets',
  'gifts under $50',
  'running shoes under $80',
  'stylish backpacks',
  'skincare products',
  'budget-friendly laptops',
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TrySaying({ isListening, onSuggestionClick }) {
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (isListening) {
      setSuggestions(shuffle(ALL_SUGGESTIONS).slice(0, 3))
    }
  }, [isListening])

  if (!isListening) return null

  return (
    <div
      style={{
        background: 'rgba(232, 89, 60, 0.04)',
        border: '0.5px solid rgba(232, 89, 60, 0.15)',
        borderRadius: '12px',
        padding: '10px 14px',
        marginTop: '8px',
        animation: 'fade-up 0.2s ease both',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#E8593C',
            display: 'inline-block',
            flexShrink: 0,
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
        <span style={{ fontSize: '12px', color: '#E8593C', fontWeight: 500 }}>Try saying</span>
      </div>

      {/* Suggestions */}
      {suggestions.map((s, i) => (
        <div
          key={i}
          role="button"
          tabIndex={0}
          onClick={() => onSuggestionClick(s)}
          onKeyDown={e => e.key === 'Enter' && onSuggestionClick(s)}
          style={{
            fontSize: '12px',
            color: '#993C1D',
            lineHeight: 1.8,
            cursor: 'pointer',
            outline: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#E8593C'
            e.currentTarget.style.textDecoration = 'underline'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#993C1D'
            e.currentTarget.style.textDecoration = 'none'
          }}
        >
          • {s}
        </div>
      ))}
    </div>
  )
}
