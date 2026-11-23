/**
 * Zaino · le cose lasciate a scuola. Il bambino (o il genitore), mentre fa lo zaino, tocca 🏫 su una cosa
 * che non trova perché è rimasta a scuola: resta "a scuola" finché non torna a casa.
 * Le cose si riconoscono dal nome, così "Quaderno di matematica" è la stessa cosa il lunedì e il mercoledì.
 * Salvato per figlio nella chiave "zaino_scuola" (e nel database: vedi lib/childStore.ts).
 */
export interface ZainoSchool {
  on: boolean                       // il genitore lo abilita (di serie spento)
  who: 'kid' | 'parent'             // chi può segnarlo
  at: Record<string, string>        // cosa → da quando è a scuola (data ISO)
  always: string[]                  // cose che restano sempre in classe (non vanno nello zaino)
}
const KEY = 'zaino_scuola'
const EMPTY: ZainoSchool = { on: false, who: 'kid', at: {}, always: [] }
export const keyOf = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ')
export function loadSchool(): ZainoSchool {
  try { const r = localStorage.getItem(KEY); if (r) return { ...EMPTY, ...JSON.parse(r) } } catch (_) {}
  return { ...EMPTY, at: {}, always: [] }
}
export function saveSchool(v: ZainoSchool) { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (_) {} }
