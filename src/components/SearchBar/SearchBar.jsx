import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  setQuery,
  clearHistory,
  setLanguage,
} from '../../features/search/searchSlice'
import { useProductSearch } from '../../hooks/useProductSearch'
import { useSoundEffects } from '../../hooks/useSoundEffects'
import Loader from '../ui/Loader'
import SuggestedChips from './SuggestedChips'
import TypingIndicator from './TypingIndicator'
import SearchHistory from './SearchHistory'
import SearchSuggestions from './SearchSuggestions'
import LanguageSelector from './LanguageSelector'

const PLACEHOLDERS = [
  'Try "affordable watches for men"...',
  'Try "cozy winter jackets under $60"...',
  'Try "premium women jewellery"...',
  'Try "casual everyday backpacks"...',
  'Try "electronics under $100"...',
  'Try "gifts under $50"...',
]

export default function SearchBar({ inputRef }) {
  const dispatch = useAppDispatch()
  const query = useAppSelector(state => state.search.query)
  const claudeStatus = useAppSelector(state => state.search.claudeStatus)
  const isListening = useAppSelector(state => state.search.isListening)
  const history = useAppSelector(state => state.search.history)
  const language = useAppSelector(state => state.search.language)
  const filtered = useAppSelector(state => state.products.filtered)
  const allProducts = useAppSelector(state => state.products.all)
  const { handleSearch, handleClear, isSearching } = useProductSearch()

  const [isMuted] = useState(false)
  const { playSuccess, playError } = useSoundEffects(isMuted)

  const prevStatusRef = useRef(claudeStatus)
  useEffect(() => {
    if (prevStatusRef.current === 'loading') {
      if (claudeStatus === 'done' && filtered.length > 0) playSuccess()
      if (claudeStatus === 'error') playError()
    }
    prevStatusRef.current = claudeStatus
  }, [claudeStatus, filtered.length, playSuccess, playError])

  // ── Placeholder rotation ───────────────────────────────────────────────
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [placeholderOpacity, setPlaceholderOpacity] = useState(1)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (query || isFocused || isListening) return
    const id = setInterval(() => {
      setPlaceholderOpacity(0)
      const t = setTimeout(() => {
        setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length)
        setPlaceholderOpacity(1)
      }, 300)
      return () => clearTimeout(t)
    }, 3000)
    return () => clearInterval(id)
  }, [query, isFocused, isListening])

  // ── Typing indicator ───────────────────────────────────────────────────
  const [isTyping, setIsTyping] = useState(false)
  const typingTimerRef = useRef(null)

  // ── Dropdown ───────────────────────────────────────────────────────────
  const [showDropdown, setShowDropdown] = useState(false)
  const inputWrapperRef = useRef(null)

  useEffect(() => {
    const handleDown = e => {
      if (inputWrapperRef.current && !inputWrapperRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  }, [])

  // ── Desktop detect ─────────────────────────────────────────────────────
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 640)
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      handleSearch(query)
      setShowDropdown(false)
    }
  }, [query, handleSearch])

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Enter') handleSubmit()
      if (e.key === 'Escape') {
        setShowDropdown(false)
        inputRef?.current?.blur()
      }
    },
    [handleSubmit, inputRef],
  )

  const handleChange = useCallback(
    e => {
      dispatch(setQuery(e.target.value))
      setIsTyping(true)
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = setTimeout(() => setIsTyping(false), 800)
    },
    [dispatch],
  )

  const handleFocus = () => {
    setIsFocused(true)
    setPlaceholderOpacity(1)
    setShowDropdown(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setTimeout(() => setShowDropdown(false), 150)
  }

  const handleHistorySelect = useCallback(item => {
    dispatch(setQuery(item))
    setShowDropdown(false)
    handleSearch(item)
  }, [dispatch, handleSearch])

  const handleSuggestionSelect = useCallback(s => {
    dispatch(setQuery(s))
    setShowDropdown(false)
    handleSearch(s)
  }, [dispatch, handleSearch])

  const handleChipClick = useCallback(label => {
    dispatch(setQuery(label))
    handleSearch(label)
  }, [dispatch, handleSearch])

  const handleLanguageChange = useCallback(code => dispatch(setLanguage(code)), [dispatch])

  const showSuggestions = showDropdown && query.length >= 2
  const showHistory = showDropdown && query.length === 0
  const showChips = !query && claudeStatus !== 'loading' && claudeStatus !== 'done'
  const searchBtnEnabled = !!(query.trim() && !isSearching)

  return (
    <div style={{ width: '100%' }}>

      {/* ── Search bar: input | lang | search ── */}
      <div
        ref={inputWrapperRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: '52px',
          background: 'white',
          borderRadius: '14px',
          border: '0.5px solid rgba(0,0,0,0.08)',
          overflow: 'visible',
          marginBottom: '12px',
          position: 'relative',
        }}
      >
        {/* Search icon */}
        <span style={{
          paddingLeft: '14px',
          flexShrink: 0,
          color: '#C8C6BC',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>

        {/* Input + animated placeholder */}
        <div style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden' }}>
          {!query && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '10px',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                opacity: placeholderOpacity,
                transition: 'opacity 0.3s ease',
                fontSize: '14px',
                color: '#C8C6BC',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                userSelect: 'none',
                zIndex: 1,
              }}
            >
              {PLACEHOLDERS[placeholderIdx]}
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              paddingLeft: '10px',
              paddingRight: query ? '32px' : '0',
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              color: '#1a1a2e',
              outline: 'none',
              fontFamily: 'inherit',
              zIndex: 2,
            }}
          />
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                zIndex: 3,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '22px', background: 'rgba(0,0,0,0.08)', flexShrink: 0 }} />

        {/* Language selector */}
        <LanguageSelector language={language} onChange={handleLanguageChange} />

        {/* Divider */}
        <div style={{ width: '1px', height: '22px', background: 'rgba(0,0,0,0.08)', flexShrink: 0 }} />

        {/* Search button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!searchBtnEnabled}
          onMouseEnter={e => { if (searchBtnEnabled) e.currentTarget.style.background = '#F5F4FE' }}
          onMouseLeave={e => { e.currentTarget.style.background = searchBtnEnabled ? '#7F77DD' : '#f7f7f7' }}
          style={{
            height: '100%',
            padding: '0 26px',
            background: searchBtnEnabled ? '#7F77DD' : '#f7f7f7',
            border: 'none',
            borderLeft: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: '0 14px 14px 0',
            fontSize: '15px',
            fontWeight: 700,
            color: searchBtnEnabled ? '#ffffff' : '#C8C6BC',
            cursor: searchBtnEnabled ? 'pointer' : 'default',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.15s, color 0.15s',
            fontFamily: 'inherit',
          }}
        >
          {isSearching && (
            <svg style={{ width: '15px', height: '15px', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Search
        </button>

        {/* Dropdowns */}
        {showSuggestions ? (
          <SearchSuggestions
            query={query}
            products={allProducts}
            onSelect={handleSuggestionSelect}
            show={showSuggestions}
          />
        ) : (
          <SearchHistory
            history={history}
            onSelect={handleHistorySelect}
            onClear={() => dispatch(clearHistory())}
            show={showHistory}
          />
        )}
      </div>

      {/* Progress bar */}
      {claudeStatus === 'loading' && <Loader />}

      {/* Typing indicator */}
      <TypingIndicator isTyping={isTyping} query={query} />

      {/* Suggested chips */}
      {showChips && (
        <div style={{ marginTop: '12px', marginBottom: '4px' }}>
          <SuggestedChips onChipClick={handleChipClick} />
        </div>
      )}

      {/* Keyboard shortcuts — desktop only, after first search */}
      {isDesktop && (claudeStatus === 'done' || claudeStatus === 'loading' || claudeStatus === 'error') && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '8px',
          marginBottom: '24px',
          fontSize: '11px',
          color: '#B4B2A9',
        }}>
          {[
            { key: '⌘K', label: 'focus' },
            { key: 'Space', label: 'mic' },
            { key: '⌘↵', label: 'search' },
            { key: 'Esc', label: 'clear' },
          ].map(({ key, label }) => (
            <span key={key} style={{ display: 'flex', alignItems: 'center' }}>
              <kbd style={{
                background: 'white',
                border: '0.5px solid rgba(0,0,0,0.12)',
                borderRadius: '5px',
                padding: '2px 7px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#5F5E5A',
                marginRight: '4px',
              }}>
                {key}
              </kbd>
              {label}
            </span>
          ))}
        </div>
      )}

    </div>
  )
}
