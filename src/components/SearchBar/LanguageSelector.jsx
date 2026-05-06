import React, { useState, useRef, useEffect } from 'react'

const LANGUAGES = [
  { code: 'en-US', label: 'English',  flag: '🇺🇸', short: 'Eng' },
  { code: 'hi-IN', label: 'Hindi',    flag: '🇮🇳', short: 'Hin' },
  { code: 'es-ES', label: 'Español',  flag: '🇪🇸', short: 'Esp' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷', short: 'Fra' },
  { code: 'de-DE', label: 'Deutsch',  flag: '🇩🇪', short: 'Deu' },
  { code: 'ja-JP', label: '日本語',   flag: '🇯🇵', short: 'Jpn' },
]

export default function LanguageSelector({ language, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selected = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  useEffect(() => {
    const handleDown = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const handleKey = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleDown)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleDown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title={`Voice language: ${selected.label}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          height: '56px',
          padding: '0 14px',
          background: 'transparent',
          border: 'none',
          borderRadius: 0,
          fontSize: '13px',
          color: '#444441',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: '17px', lineHeight: 1 }} aria-hidden="true">
          {selected.flag}
        </span>
        <span style={{ fontSize: '13px', color: '#444441' }}>
          {selected.short}
        </span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: 0,
          background: 'white',
          border: '0.5px solid rgba(0,0,0,0.1)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          zIndex: 60,
          overflow: 'hidden',
          minWidth: '152px',
          animation: 'fade-up 0.12s ease both',
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => { onChange(lang.code); setOpen(false) }}
              style={{
                width: '100%',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 14px',
                fontSize: '13px',
                cursor: 'pointer',
                background: lang.code === language ? '#EEEDFE' : 'transparent',
                color: lang.code === language ? '#534AB7' : '#374151',
                border: 'none',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => {
                if (lang.code !== language) e.currentTarget.style.background = '#F9F8FC'
              }}
              onMouseLeave={e => {
                if (lang.code !== language) e.currentTarget.style.background = 'transparent'
              }}
            >
              <span aria-hidden="true" style={{ fontSize: '15px' }}>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
