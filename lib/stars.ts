/** Le mie stelline: si raccolgono stelle per ottenere un premio scelto dal genitore */
export const REWARDS = [
  { id: 'parco', e: '🌳' }, { id: 'gelato', e: '🍦' }, { id: 'storia', e: '📖' },
  { id: 'gioco', e: '🎮' }, { id: 'disegno', e: '🎨' }, { id: 'film', e: '🎬' },
] as const
export type RewardId = typeof REWARDS[number]['id']

export interface StarsState { target: number; reward: RewardId; have: number; auto: boolean }
export const STARS_DEFAULTS: StarsState = { target: 5, reward: 'parco', have: 0, auto: true }
const KEY = 'stelline'

export function loadStars(): StarsState {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...STARS_DEFAULTS, ...JSON.parse(raw) } } catch (_) {}
  return STARS_DEFAULTS
}
export function saveStars(s: StarsState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {}
}
/** Aggiunge una stellina (senza superare il traguardo) */
export function addStar(): StarsState {
  const s = loadStars()
  const next = { ...s, have: Math.min(s.target, s.have + 1) }
  saveStars(next)
  return next
}
/** Stellina automatica quando il bambino completa la routine, lo zaino o un gioco (se il genitore l'ha attivata) */
export function autoStar() {
  try { if (loadStars().auto) addStar() } catch (_) {}
}
