/**
 * Il piano di lavoro di ogni bambino, giorno per giorno: tappe (sezione dell'app, cosa fare, minuti),
 * i minuti fatti davvero (contati dall'app), una nota e l'umore del pomeriggio.
 * Salvato per figlio nella chiave "piani" (e nel database: vedi lib/childStore.ts).
 */
import type { SectionId } from './homeSections'
import { getForChild, setForChild } from './childStore'
import { loadRecita, saveRecita, recitaStepFor } from './recita'

/** auto: 'recita' = tappa aggiunta dall'app (la prova della recita), che il genitore può togliere o cambiare */
export interface PlanStep { id: string; sec: SectionId; note: string; min: number; done: boolean; spent: number; auto?: 'recita' }
export interface DayPlan { steps: PlanStep[]; note: string; mood: string; starred?: boolean }
export interface Plans { settings: { onEnd: 'warn' | 'back' }; days: Record<string, DayPlan> }

const KEY = 'piani'
const EMPTY: Plans = { settings: { onEnd: 'warn' }, days: {} }
const KEEP_DAYS = 45                      // i giorni più vecchi si tolgono, così il piano resta leggero

export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const fromIso = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const monday = (d: Date) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); x.setHours(0, 0, 0, 0); return x }
export const todayIso = () => iso(new Date())
export const newId = () => Math.random().toString(36).slice(2, 9)

const parse = (raw: string | null): Plans => {
  try { if (raw) { const v = JSON.parse(raw); return { settings: { ...EMPTY.settings, ...(v.settings ?? {}) }, days: v.days ?? {} } } } catch (_) {}
  return { settings: { ...EMPTY.settings }, days: {} }
}
const prune = (p: Plans): Plans => {
  const limit = iso(addDays(new Date(), -KEEP_DAYS))
  const days: Record<string, DayPlan> = {}
  for (const [k, v] of Object.entries(p.days)) if (k >= limit && v.steps.length) days[k] = v
  return { ...p, days }
}
/** il figlio attivo */
export function loadPlans(): Plans { try { return withRecita(parse(localStorage.getItem(KEY))) } catch (_) { return parse(null) } }
/** la prova della recita: una tappa per ogni giorno da oggi fino alla recita (se il genitore lo vuole), tolte quelle non più valide */
function withRecita(p: Plans): Plans {
  const r = loadRecita(), today = todayIso()
  for (const [k, d] of Object.entries(p.days)) d.steps = d.steps.filter(s => s.auto !== 'recita' || s.done || (k >= today && r?.plan !== false && !!recitaStepFor(r, k)))
  if (!r || r.plan === false || !r.date || r.date < today) return p
  if (!r.start || r.start > today) { r.start = today; saveRecita(r) }
  for (let d = new Date(), i = 0; i < 40; i++, d = addDays(d, 1)) {
    const k = iso(d); if (k > r.date) break
    const st = recitaStepFor(r, k); if (!st || (r.skip ?? []).includes(k)) continue
    const day = p.days[k] ?? (p.days[k] = { steps: [], note: '', mood: '' })
    const has = day.steps.find(s => s.auto === 'recita')
    if (has) { if (!has.done) has.note = '🎬 La recita · ' + st.label } else day.steps.push({ id: 'recita-' + k, sec: 'poesia' as SectionId, note: '🎬 La recita · ' + st.label, min: r.min ?? 5, done: false, spent: 0, auto: 'recita' })
  }
  return p
}
/** il genitore toglie la tappa della recita da un giorno: quel giorno non torna più */
export function skipRecitaDay(dateIso: string) { const r = loadRecita(); if (!r) return; r.skip = [...new Set([...(r.skip ?? []), dateIso])]; saveRecita(r) }
export function savePlans(p: Plans) { try { localStorage.setItem(KEY, JSON.stringify(prune(p))) } catch (_) {} }
/** un altro figlio (per copiare il piano a più bambini) */
export const loadPlansFor = (childId: string) => parse(getForChild(childId, KEY))
export const savePlansFor = (childId: string, p: Plans) => setForChild(childId, KEY, JSON.stringify(prune(p)))

/** una copia delle tappe, con le spunte e i minuti azzerati */
export const freshSteps = (steps: PlanStep[]): PlanStep[] => steps.filter(s => !s.auto).map(s => ({ ...s, id: newId(), done: false, spent: 0 }))   // la tappa della recita no: la mette l'app

/**
 * L'app aggiunge il tempo passato in una sezione alla tappa di oggi di quella sezione.
 * Restituisce la tappa, se è appena stata completata, e la tappa successiva da fare.
 */
export function addSpent(sec: string, seconds: number): { step: PlanStep; justDone: boolean; next: PlanStep | null } | null {
  const p = loadPlans(), day = p.days[todayIso()]
  if (!day) return null
  const step = day.steps.find(s => s.sec === sec && !s.done)
  if (!step) return null
  step.spent = (step.spent ?? 0) + seconds
  const justDone = step.spent >= step.min * 60
  if (justDone) step.done = true
  savePlans(p)
  return { step, justDone, next: day.steps.find(s => !s.done) ?? null }
}
/** la tappa di oggi di questa sezione che è ancora da fare (per sapere se contare il tempo) */
export function openStepFor(sec: string): PlanStep | null {
  const day = loadPlans().days[todayIso()]
  return day?.steps.find(s => s.sec === sec && !s.done) ?? null
}
