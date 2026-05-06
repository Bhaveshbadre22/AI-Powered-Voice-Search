import { useRef, useMemo, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setQuery, setIsListening } from '../../features/search/searchSlice'
import { useProductSearch } from '../../hooks/useProductSearch'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useSoundEffects } from '../../hooks/useSoundEffects'

const VOICE_EXAMPLES = [
  '"affordable watches for men"',
  '"premium women jewellery"',
  '"casual men\'s wear"',
  '"electronics under $100"',
  '"cozy winter jackets"',
  '"gifts under $50"',
  '"running shoes under $80"',
]

function pickThree(arr) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, 3)
}

const WAVE_DELAYS = ['0s', '0.1s', '0.05s', '0.15s', '0.08s']

export default function VoiceZone({ micToggleRef }) {
  const dispatch = useAppDispatch()
  const isListening = useAppSelector(state => state.search.isListening)
  const language = useAppSelector(state => state.search.language)
  const { handleSearch } = useProductSearch()
  const { playStart, playStop } = useSoundEffects(false)
  const lastTranscriptRef = useRef('')

  const examples = useMemo(() => pickThree(VOICE_EXAMPLES), [])

  const { start, stop, supported, transcript } = useSpeechRecognition({
    language,
    onTranscript: t => {
      lastTranscriptRef.current = t
      dispatch(setQuery(t))
    },
    onEnd: () => {
      dispatch(setIsListening(false))
      if (lastTranscriptRef.current.trim()) {
        handleSearch(lastTranscriptRef.current)
        lastTranscriptRef.current = ''
      }
    },
    onError: () => dispatch(setIsListening(false)),
  })

  const handleToggle = useCallback(() => {
    if (isListening) {
      stop()
      dispatch(setIsListening(false))
      playStop()
    } else {
      lastTranscriptRef.current = ''
      start()
      dispatch(setIsListening(true))
      playStart()
    }
  }, [isListening, start, stop, dispatch, playStart, playStop])

  if (micToggleRef) micToggleRef.current = handleToggle

  const handleChipClick = useCallback(text => {
    const clean = text.replace(/"/g, '')
    if (isListening) {
      stop()
      dispatch(setIsListening(false))
    }
    dispatch(setQuery(clean))
    handleSearch(clean)
  }, [isListening, stop, dispatch, handleSearch])

  if (!supported) return null

  return (
    <div style={{ textAlign: 'center', marginBottom: '8px' }}>

      {/* TAP TO SPEAK / LISTENING... label */}
      <p style={{
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isListening ? '#E8593C' : '#AFA9EC',
        marginBottom: '16px',
        marginTop: 0,
        transition: 'color 0.2s',
      }}>
        {isListening ? 'LISTENING...' : 'TAP TO SPEAK'}
      </p>

      {/* Outer ring */}
      <div style={{
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        border: '1px solid rgba(127,119,221,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        transition: 'all 0.3s',
        animation: isListening ? 'pulse-ring-shadow 1.5s ease-out infinite' : 'none',
      }}>
        {/* Inner rounded-square button */}
        <button
          type="button"
          onClick={handleToggle}
          style={{
            width: '110px',
            height: '110px',
            borderRadius: '50%',
            background: 'white',
            border: isListening
              ? '0.5px solid rgba(232,89,60,0.3)'
              : '0.5px solid rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            if (!isListening) {
              e.currentTarget.style.background = '#FAFAFA'
              e.currentTarget.style.borderColor = 'rgba(127,119,221,0.3)'
              e.currentTarget.style.transform = 'scale(1.03)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.borderColor = isListening
              ? 'rgba(232,89,60,0.3)'
              : 'rgba(0,0,0,0.08)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isListening ? '#E8593C' : '#1a1a2e'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'stroke 0.2s' }}
          >
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
      </div>

      {/* Waveform bars — only when listening */}
      {isListening && (
        <div style={{
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 0 12px',
        }}>
          {WAVE_DELAYS.map((delay, i) => (
            <div
              key={i}
              style={{
                width: '3px',
                borderRadius: '2px',
                background: '#7F77DD',
                height: '4px',
                animation: 'bar-bounce 0.6s ease-in-out infinite',
                animationDelay: delay,
              }}
            />
          ))}
        </div>
      )}

      {/* "Say something like..." / live transcript */}
      <p style={{
        fontSize: '15px',
        color: isListening
          ? (transcript ? '#1a1a2e' : '#AFA9EC')
          : '#888780',
        fontWeight: isListening && transcript ? 500 : 400,
        fontStyle: isListening && !transcript ? 'italic' : 'normal',
        textAlign: 'center',
        marginBottom: '14px',
        marginTop: 0,
        minHeight: '24px',
        transition: 'all 0.2s',
      }}>
        {isListening ? (transcript || 'Listening...') : 'Say something like...'}
      </p>

      {/* Ghost example chips */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'center',
        maxWidth: '520px',
        margin: '0 auto',
        opacity: isListening ? 0.4 : 1,
        transition: 'opacity 0.2s',
      }}>
        {examples.map(ex => (
          <button
            key={ex}
            type="button"
            onClick={() => handleChipClick(ex)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(127,119,221,0.08)',
              border: '1px solid rgba(127,119,221,0.2)',
              borderRadius: '24px',
              padding: '8px 18px',
              fontSize: '13px',
              color: '#7F77DD',
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(127,119,221,0.15)'
              e.currentTarget.style.borderColor = 'rgba(127,119,221,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(127,119,221,0.08)'
              e.currentTarget.style.borderColor = 'rgba(127,119,221,0.2)'
            }}
          >
            {ex}
          </button>
        ))}
      </div>

    </div>
  )
}
