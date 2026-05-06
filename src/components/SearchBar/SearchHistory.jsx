import React from 'react'

export default function SearchHistory({ history, onSelect, onClear, show }) {
  if (!show || history.length === 0) return null

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
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px 6px',
        }}
      >
        <span style={{ fontSize: '12px', color: '#9ca3af' }}>Recent searches</span>
        <button
          type="button"
          onClick={onClear}
          style={{
            fontSize: '12px',
            color: '#7C3AED',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Clear
        </button>
      </div>

      {history.map((item, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(item)}
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
          {/* Clock icon */}
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
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span style={{ flex: 1 }}>{item}</span>
          {/* Fill arrow */}
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      ))}
    </div>
  )
}
