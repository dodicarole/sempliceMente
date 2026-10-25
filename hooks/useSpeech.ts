import { useCallback, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { prepareForSpeech, bestVoice } from '@/lib/speechText'

/* Voce nella lingua dell'app: le frasi si mettono in fila e il gioco può aspettare che finiscano */
const keep: SpeechSynthesisUtterance[] = []
export function hush() { try { window.speechSynthesis.cancel() } catch (_) {} }
export const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export function useSpeech() {
  const { t } = useT()
  useEffect(() => () => hush(), [])
  const speak = useCallback((text: string, opts: { interrupt?: boolean; rate?: number } = {}) => new Promise<void>(resolve => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve()
    let done = false
    const fin = () => { if (!done) { done = true; resolve() } }
    try {
      const synth = window.speechSynthesis
      const u = new SpeechSynthesisUtterance(prepareForSpeech(text, t.speechLang === 'fr' ? 'fr' : 'it').spoken)
      u.lang = t.locale; u.rate = opts.rate ?? 0.88
      const v = bestVoice(synth.getVoices(), t.locale)
      if (v) u.voice = v
      u.onend = fin; u.onerror = fin
      keep.push(u); if (keep.length > 20) keep.shift()
      setTimeout(fin, 2000 + text.length * 120)
      // dopo cancel() alcuni browser ignorano la frase successiva se arriva subito
      if (opts.interrupt !== false) { synth.cancel(); setTimeout(() => synth.speak(u), 80) } else synth.speak(u)
    } catch (_) { fin() }
  }), [t])
  /** Parla senza interrompere e aspetta almeno `ms` millisecondi */
  const say = useCallback((text: string, ms = 600) => Promise.all([speak(text, { interrupt: false }), wait(ms)]).then(() => {}), [speak])
  return { speak, say }
}

/** Suoni morbidi creati al momento */
let ctx: AudioContext | null = null
export function softTone(f1: number, f2: number, dur: number, vol = 0.07) {
  try {
    const W = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
    ctx = ctx || new (W.AudioContext || W.webkitAudioContext!)()
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain()
    o.type = 'sine'; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur)
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05)
  } catch (_) {}
}
