import React from 'react'

const getMessage = q => {
  const lower = q.toLowerCase()
  if (lower.includes('under') || lower.includes('cheap') || lower.includes('affordable') || lower.includes('$'))
    return 'Claude will filter by price...'
  if (lower.includes('women') || lower.includes('men') || lower.includes('girl') || lower.includes('boy'))
    return 'Claude will filter by gender...'
  if (['watch', 'jacket', 'shirt', 'shoe', 'jewel', 'bag', 'phone', 'laptop', 'camera'].some(w => lower.includes(w)))
    return 'Claude recognised a product type...'
  return 'Ready to search...'
}

export default function TypingIndicator({ isTyping, query }) {
  const show = isTyping && query.length >= 2

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 2px',
      minHeight: '24px',
      transition: 'opacity 0.2s ease',
      opacity: show ? 1 : 0,
      pointerEvents: 'none',
      marginBottom: '12px',
    }}>
      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        {[0, 0.15, 0.3].map((delay, i) => (
          <span
            key={i}
            style={{
              width: '5px',
              height: '5px',
              background: '#7F77DD',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'typing-dot 1s ease infinite',
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
      {show && (
        <span style={{ fontSize: '13px', color: '#7F77DD', fontWeight: 500 }}>
          {getMessage(query)}
        </span>
      )}
    </div>
  )
}
