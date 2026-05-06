import React from 'react'

const CHIPS = [
  // {
  //   label: 'affordable watches',
  //   icon: (
  //     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <circle cx="12" cy="12" r="7" />
  //       <polyline points="12 9 12 12 13.5 13.5" />
  //       <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83" />
  //     </svg>
  //   ),
  // },
  // {
  //   label: 'premium jewellery',
  //   icon: (
  //     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M6 3h12l4 6-10 13L2 9z" />
  //       <path d="M11 3L8 9l4 13 4-13-3-6" />
  //       <path d="M2 9h20" />
  //     </svg>
  //   ),
  // },
  // {
  //   label: "casual men's wear",
  //   icon: (
  //     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
  //     </svg>
  //   ),
  // },
  // {
  //   label: 'electronics under $100',
  //   icon: (
  //     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
  //       <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
  //       <line x1="12" y1="18" x2="12.01" y2="18" />
  //     </svg>
  //   ),
  // },
]

export default function SuggestedChips({ onChipClick }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '10px',
    }}>
      {CHIPS.map((chip, i) => (
        <button
          key={chip.label}
          type="button"
          onClick={() => onChipClick(chip.label)}
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
            transition: 'all 0.15s',
            animation: 'fade-up 0.3s ease both',
            animationDelay: `${i * 0.05}s`,
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#CECBF6'
            e.currentTarget.style.borderColor = 'rgba(127,119,221,0.4)'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#EEEDFE'
            e.currentTarget.style.borderColor = 'rgba(127,119,221,0.2)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {chip.icon}
          <span>{chip.label}</span>
        </button>
      ))}
    </div>
  )
}
