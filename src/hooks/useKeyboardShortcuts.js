import { useEffect } from 'react'

export function useKeyboardShortcuts({
  searchInputRef,
  onToggleMic,
  onClearSearch,
  onSubmit,
}) {
  useEffect(() => {
    const handleKeyDown = e => {
      const isMeta = e.metaKey || e.ctrlKey
      const active = document.activeElement
      const isInputActive =
        active?.tagName === 'INPUT' ||
        active?.tagName === 'TEXTAREA' ||
        active?.isContentEditable

      // ⌘K / Ctrl+K → focus search input, select all
      if (isMeta && e.key === 'k') {
        e.preventDefault()
        searchInputRef?.current?.focus()
        searchInputRef?.current?.select()
        return
      }

      // Escape → blur input or stop mic
      if (e.key === 'Escape') {
        if (isInputActive) active.blur()
        onClearSearch?.()
        return
      }

      // Space → toggle mic (only when no interactive element focused)
      if (e.key === ' ' && !isInputActive) {
        e.preventDefault()
        onToggleMic?.()
        return
      }

      // ⌘Enter / Ctrl+Enter → submit search
      if (isMeta && e.key === 'Enter') {
        e.preventDefault()
        onSubmit?.()
        return
      }

      // ⌘Backspace / Ctrl+Backspace → clear search
      if (isMeta && e.key === 'Backspace') {
        e.preventDefault()
        onClearSearch?.()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchInputRef, onToggleMic, onClearSearch, onSubmit])
}
