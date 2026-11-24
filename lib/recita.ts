/**
 * 🎬 La mia parte nella recita (dentro "Imparo la poesia"): la parte del bambino, salvata per figlio nella chiave
 * "recita_parte" (e nel database: vedi lib/childStore.ts). Qui anche il percorso giorno per giorno fino alla recita,
 * che l'app mette da sola nel piano di lavoro (lib/plans.ts) se il genitore lo vuole.
 */
export interface RecitaLine { s: number; who: string; text: string; mine: boolean; e?: string; g?: string }
export interface Recita { v: number; title: string; name: string; e: string; date: string; scenes: string[]; lines: RecitaLine[]
  plan?: boolean; min?: number; skip?: string[]; start?: string }
const KEY = 'recita_parte'
export function loadRecita(): Recita | null {
  try { const r = localStorage.getItem(KEY); if (!r) return null; const v = JSON.parse(r); return v && Array.isArray(v.lines) ? v : null } catch (_) { return null }
}
export function saveRecita(r: Recita) { try { localStorage.setItem(KEY, JSON.stringify(r)) } catch (_) {} }
const day = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
const diff = (a: string, b: string) => Math.round((day(b).getTime() - day(a).getTime()) / 864e5)
/** i cinque passi del percorso, con la scheda della recita che apre ciascuno */
export const RECITA_STEPS: [string, number][] = [['🎧 Ascolta la tua scena', 0], ['🔁 Ripeti con me', 1], ['🫥 Le parole che spariscono', 2], ['🎭 Tocca a te!', 3], ['🙋 Gesti e prova generale', 4]]
/** il passo di un giorno (null se quel giorno non c'è prova: dopo la recita, senza data o senza battute) */
export function recitaStepFor(r: Recita | null, dateIso: string): { label: string; tab: number } | null {
  if (!r || !r.date || !r.lines.some(l => l.mine)) return null
  const start = r.start && r.start <= r.date ? r.start : dateIso
  if (dateIso < start || dateIso > r.date) return null
  if (dateIso === r.date) return { label: '🎭 Oggi è la recita: un ripasso veloce', tab: 3 }
  const N = Math.max(1, diff(start, r.date)), k = diff(start, dateIso)
  const [label, tab] = RECITA_STEPS[Math.min(RECITA_STEPS.length - 1, Math.floor((k * RECITA_STEPS.length) / N))]
  return { label, tab }
}
