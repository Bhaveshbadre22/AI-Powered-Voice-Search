import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    isListening: false,
    claudeStatus: 'idle',
    history: [],
    language: localStorage.getItem('voiceSearch_lang') || 'en-US',
  },
  reducers: {
    setQuery(state, action) {
      state.query = action.payload
    },
    setIsListening(state, action) {
      state.isListening = action.payload
    },
    setClaudeStatus(state, action) {
      state.claudeStatus = action.payload
    },
    clearSearch(state) {
      state.query = ''
      state.claudeStatus = 'idle'
      state.isListening = false
    },
    saveToHistory(state, action) {
      const q = action.payload
      state.history = [q, ...state.history.filter(h => h !== q)].slice(0, 5)
    },
    clearHistory(state) {
      state.history = []
    },
    setLanguage(state, action) {
      state.language = action.payload
      localStorage.setItem('voiceSearch_lang', action.payload)
    },
  },
})

export const {
  setQuery,
  setIsListening,
  setClaudeStatus,
  clearSearch,
  saveToHistory,
  clearHistory,
  setLanguage,
} = searchSlice.actions
export default searchSlice.reducer
