import { useState, useRef, useCallback, useEffect } from 'react'

export function useSpeechRecognition({
  onTranscript,
  onEnd,
  onError,
  language = 'en-US',
} = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  // Keep callbacks and language in a ref so handlers always see latest values
  const callbacksRef = useRef({ onTranscript, onEnd, onError })
  const languageRef = useRef(language)
  useEffect(() => {
    callbacksRef.current = { onTranscript, onEnd, onError }
  })
  useEffect(() => {
    languageRef.current = language
  }, [language])

  const supported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const start = useCallback(() => {
    if (!supported) return

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = languageRef.current  // use current language on every start

    recognition.onresult = event => {
      let final = ''
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += t
        } else {
          interim += t
        }
      }
      const current = final || interim
      setTranscript(current)
      callbacksRef.current.onTranscript?.(current)
    }

    recognition.onend = () => {
      setIsListening(false)
      callbacksRef.current.onEnd?.()
    }

    recognition.onerror = event => {
      setIsListening(false)
      callbacksRef.current.onError?.(event.error)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [supported])

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  return { isListening, transcript, start, stop, supported }
}
