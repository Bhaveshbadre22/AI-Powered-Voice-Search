import { useEffect, useRef, useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from './app/hooks'
import { fetchProducts } from './features/products/productsSlice'
import { useProductSearch } from './hooks/useProductSearch'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import SearchBar from './components/SearchBar/SearchBar'
import VoiceZone from './components/SearchBar/VoiceZone'
import ProductGrid from './components/ProductGrid/ProductGrid'

const CYCLING_WORDS = ['Style Match', 'Daily Wear', 'Dream Item', 'Tech Deal', 'Gift Pick']

function useTypewriter(words, typingSpeed = 90, deletingSpeed = 55, pauseMs = 1400) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    const word = words[wordIndex]
    let timeout
    if (phase === 'typing') {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), typingSpeed)
      } else {
        timeout = setTimeout(() => setPhase('deleting'), pauseMs)
      }
    } else if (phase === 'deleting') {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deletingSpeed)
      } else {
        setWordIndex(i => (i + 1) % words.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, phase, wordIndex, words, typingSpeed, deletingSpeed, pauseMs])

  return displayed
}

export default function App() {
  const dispatch = useAppDispatch()
  const query = useAppSelector(state => state.search.query)
  const { handleSearch, handleClear } = useProductSearch()

  const searchInputRef = useRef(null)
  const micToggleRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const onSubmit = useCallback(() => {
    if (query.trim()) handleSearch(query)
  }, [query, handleSearch])

  const onToggleMic = useCallback(() => {
    micToggleRef.current?.()
  }, [])

  useKeyboardShortcuts({
    searchInputRef,
    onToggleMic,
    onClearSearch: handleClear,
    onSubmit,
  })

  const claudeStatus = useAppSelector(state => state.search.claudeStatus)

  useEffect(() => {
    if (claudeStatus === 'done') {
      gridRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [claudeStatus])

  const typedWord = useTypewriter(CYCLING_WORDS)

  return (
    <div style={{ minHeight: '100vh', background: '#F0EFF8' }}>

      {/* ── Hero + search — centered column ── */}
      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '56px 16px 0' }}>

        {/* ── Hero ── */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>

          {/* Eyebrow pill */}
          <div style={{ marginBottom: '18px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              background: '#E8E7F6',
              border: '0.5px solid rgba(127,119,221,0.25)',
              borderRadius: '20px',
              padding: '5px 14px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#534AB7',
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#7F77DD',
                flexShrink: 0,
                animation: 'pulse-dot 1.5s ease-in-out infinite',
              }} />
              AI-POWERED VOICE SEARCH
            </span>
          </div>

          {/* h1 */}
          <h1 style={{
            fontSize: 'clamp(28px, 6vw, 42px)',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
            marginBottom: '12px',
            marginTop: 0,
            color: '#0f0f0f',
          }}>
            Find Your Perfect
            <br />
            <span className="gradient-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
              {typedWord}
              <span style={{
                display: 'inline-block',
                width: '3px',
                height: '0.85em',
                background: '#E8593C',
                borderRadius: '2px',
                marginLeft: '1px',
                verticalAlign: 'middle',
                animation: 'blink-cursor 0.8s step-end infinite',
              }} />
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: '15px', color: '#888780', margin: 0 }}>
            Speak or type — finds the best matches instantly
          </p>
        </header>

        {/* ── ZONE 1: Voice primary ── */}
        <VoiceZone micToggleRef={micToggleRef} />

        {/* ── Divider ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '28px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(127,119,221,0.15)' }} />
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#AFA9EC',
            whiteSpace: 'nowrap',
          }}>
            OR TYPE YOUR SEARCH
          </span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(127,119,221,0.15)' }} />
        </div>

        {/* ── ZONE 2: Search bar ── */}
        <div style={{ marginBottom: '8px' }}>
          <SearchBar inputRef={searchInputRef} />
        </div>

      </div>

      {/* ── Product grid — full-width breakout ── */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 40px' }} ref={gridRef}>
        <ProductGrid />
      </div>


    </div>
  )
}
