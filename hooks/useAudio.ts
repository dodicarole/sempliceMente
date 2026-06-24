'use client'
import { useCallback, useRef } from 'react'

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    return ctxRef.current
  }, [])

  const tone = useCallback((freqs: number[], duration = 0.24, gap = 0.11) => {
    try {
      const ctx = getCtx()
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.connect(g); g.connect(ctx.destination)
        const t = ctx.currentTime + i * gap
        osc.frequency.setValueAtTime(f, t)
        g.gain.setValueAtTime(0.26, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + duration)
        osc.start(t); osc.stop(t + duration)
      })
    } catch (_) {}
  }, [getCtx])

  const check       = useCallback(() => tone([600, 920]), [tone])
  const celebration = useCallback(() => tone([523, 659, 784, 1047], 0.38, 0.16), [tone])
  const pinTick     = useCallback(() => tone([700], 0.08, 0), [tone])
  const pinSuccess  = useCallback(() => tone([600, 800, 1000], 0.2, 0.1), [tone])

  const uncheck = useCallback(() => {
    try {
      const ctx = getCtx()
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.connect(g); g.connect(ctx.destination)
      osc.frequency.setValueAtTime(480, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.14)
      g.gain.setValueAtTime(0.18, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14)
      osc.start(); osc.stop(ctx.currentTime + 0.14)
    } catch (_) {}
  }, [getCtx])

  const pinError = useCallback(() => {
    try {
      const ctx = getCtx();
      ([280, 240] as number[]).forEach((f, i) => {
        const osc = ctx.createOscillator()
        const g = ctx.createGain()
        osc.connect(g); g.connect(ctx.destination)
        osc.type = 'square'
        const t = ctx.currentTime + i * 0.12
        osc.frequency.setValueAtTime(f, t)
        g.gain.setValueAtTime(0.15, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
        osc.start(t); osc.stop(t + 0.1)
      })
    } catch (_) {}
  }, [getCtx])

  return { check, uncheck, celebration, pinTick, pinError, pinSuccess }
}