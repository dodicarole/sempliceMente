/** Prima… poi…: le immagini tra cui il genitore sceglie */
export const FIRST = [
  { id: 'compiti', e: '📚' }, { id: 'denti', e: '🪥' }, { id: 'vestirsi', e: '👕' }, { id: 'ordine', e: '🧸' },
  { id: 'mangiare', e: '🍽️' }, { id: 'bagno', e: '🛁' }, { id: 'zaino', e: '🎒' }, { id: 'nanna', e: '😴' },
] as const
export const THEN = [
  { id: 'tablet', e: '📱' }, { id: 'giocare', e: '🎲' }, { id: 'parco', e: '🌳' }, { id: 'cartoni', e: '📺' },
  { id: 'merenda', e: '🍪' }, { id: 'coccole', e: '🤗' }, { id: 'storia', e: '📖' }, { id: 'bici', e: '🚲' },
] as const
export type FirstId = typeof FIRST[number]['id']
export type ThenId = typeof THEN[number]['id']

export interface FirstThenState { first: FirstId; then: ThenId }
const KEY = 'prima_poi'
export function loadFirstThen(): FirstThenState {
  try { const raw = localStorage.getItem(KEY); if (raw) return { first: 'compiti', then: 'tablet', ...JSON.parse(raw) } } catch (_) {}
  return { first: 'compiti', then: 'tablet' }
}
export function saveFirstThen(s: FirstThenState) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {}
}
