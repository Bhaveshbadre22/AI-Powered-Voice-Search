import { useRef, useCallback } from 'react'

export function useSoundEffects(isMuted = false) {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  const ensureRunning = useCallback(async ctx => {
    if (ctx.state === 'suspended') await ctx.resume()
  }, [])

  const playStart = useCallback(async () => {
    if (isMuted || typeof window === 'undefined') return
    try {
      const ctx = getCtx()
      await ensureRunning(ctx)
      const now = ctx.currentTime

      const playNote = (freq1, freq2, start, dur) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq1, start)
        osc.frequency.linearRampToValueAtTime(freq2, start + dur)
        gain.gain.setValueAtTime(0, start)
        gain.gain.linearRampToValueAtTime(0.3, start + 0.01)
        gain.gain.linearRampToValueAtTime(0, start + dur)
        osc.start(start)
        osc.stop(start + dur + 0.01)
      }

      playNote(440, 880, now, 0.08)
      playNote(880, 880, now + 0.08, 0.06)
    } catch (_) { /* silent fail */ }
  }, [isMuted, getCtx, ensureRunning])

  const playStop = useCallback(async () => {
    if (isMuted || typeof window === 'undefined') return
    try {
      const ctx = getCtx()
      await ensureRunning(ctx)
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(660, now)
      osc.frequency.linearRampToValueAtTime(330, now + 0.12)
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.linearRampToValueAtTime(0, now + 0.12)
      osc.start(now)
      osc.stop(now + 0.13)
    } catch (_) { /* silent fail */ }
  }, [isMuted, getCtx, ensureRunning])

  const playSuccess = useCallback(async () => {
    if (isMuted || typeof window === 'undefined') return
    try {
      const ctx = getCtx()
      await ensureRunning(ctx)
      const now = ctx.currentTime
      const notes = [523, 659, 784]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        const t = now + i * 0.06
        osc.frequency.setValueAtTime(freq, t)
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.2, t + 0.01)
        gain.gain.linearRampToValueAtTime(0, t + 0.06)
        osc.start(t)
        osc.stop(t + 0.07)
      })
    } catch (_) { /* silent fail */ }
  }, [isMuted, getCtx, ensureRunning])

  const playError = useCallback(async () => {
    if (isMuted || typeof window === 'undefined') return
    try {
      const ctx = getCtx()
      await ensureRunning(ctx)
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(220, now)
      gain.gain.setValueAtTime(0.2, now)
      gain.gain.linearRampToValueAtTime(0, now + 0.15)
      osc.start(now)
      osc.stop(now + 0.16)
    } catch (_) { /* silent fail */ }
  }, [isMuted, getCtx, ensureRunning])

  return { playStart, playStop, playSuccess, playError }
}
