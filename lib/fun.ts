/**
 * Tono divertente: Tedo la rana, le sue gag di festa e i suoni buffi.
 * Le impostazioni si scelgono nell'area Genitore e restano sul dispositivo.
 */
import type { Dict } from '@/lib/i18n/it'
import { randomPraise, withChildName } from '@/lib/praise'

export interface FunSettings { fun: boolean; sound: boolean }
export const FUN_DEFAULTS: FunSettings = { fun: true, sound: true }
const KEY = 'tono_divertente'

export function loadFunSettings(): FunSettings {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...FUN_DEFAULTS, ...JSON.parse(raw) } } catch (_) {}
  return FUN_DEFAULTS
}
export function saveFunSettings(s: FunSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {}
}

export type Gag = 'dance' | 'flip' | 'jump' | 'wheel' | 'five'
const GAGS: Gag[] = ['dance', 'flip', 'jump', 'wheel', 'five']

export interface Celebration { gag: Gag | null; phrase: string }

/**
 * Sceglie come festeggiare: con il tono divertente una gag di Tedo a caso e,
 * una volta su due, la sua frase; altrimenti una frase di incoraggiamento classica.
 */
export function pickCelebration(t: Dict): Celebration {
  const { fun } = loadFunSettings()
  if (!fun) return { gag: null, phrase: randomPraise() }
  const gag = GAGS[Math.floor(Math.random() * GAGS.length)]
  // anche nelle frasi di Tedo, una volta su due compare il nome del bambino
  const gagPhrase = Math.random() < 0.5 ? withChildName(t.tedo[gag]) : t.tedo[gag]
  const phrase = gag === 'five' || Math.random() < 0.5 ? gagPhrase : randomPraise()
  return { gag, phrase }
}

/* ── Suoni morbidi creati al momento (nessun file audio) ── */
let ctx: AudioContext | null = null
function audio(): AudioContext | null {
  if (typeof window === 'undefined' || !loadFunSettings().sound) return null
  try {
    const W = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext?: typeof AudioContext }
    ctx = ctx || new (W.AudioContext || W.webkitAudioContext!)()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch (_) { return null }
}
function tone(type: OscillatorType, f1: number, f2: number, dur: number, vol = 0.12, delay = 0) {
  const a = audio(); if (!a) return
  const t = a.currentTime + delay, o = a.createOscillator(), g = a.createGain()
  o.type = type
  o.frequency.setValueAtTime(f1, t)
  o.frequency.exponentialRampToValueAtTime(f2, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(a.destination)
  o.start(t); o.stop(t + dur + 0.05)
}
export const funSound = {
  ribbit() { tone('square', 180, 120, 0.12, 0.06); tone('square', 190, 110, 0.14, 0.06, 0.16) },
  boing()  { tone('sine', 220, 660, 0.25, 0.12) },
  whee()   { tone('triangle', 300, 900, 0.45, 0.1) },
  clap()   { tone('triangle', 900, 500, 0.08, 0.1); tone('triangle', 1000, 600, 0.08, 0.08, 0.1) },
  burp()   { tone('sawtooth', 140, 60, 0.45, 0.08); tone('sine', 90, 50, 0.45, 0.08) },
}
