/**
 * Il piano di lavoro di ogni bambino, giorno per giorno: tappe (sezione dell'app, cosa fare, minuti),
 * i minuti fatti davvero (contati dall'app), una nota e l'umore del pomeriggio.
 * Salvato per figlio nella chiave "piani" (e nel database: vedi lib/childStore.ts).
 */
import type { SectionId } from './homeSections'
import { getForChild, setForChild } from './childStore'

export interface PlanStep { id: string; sec: SectionId; note: string; min: number; done: boolean; spent: number }
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
export function loadPlans(): Plans { try { return parse(localStorage.getItem(KEY)) } catch (_) { return parse(null) } }
export function savePlans(p: Plans) { try { localStorage.setItem(KEY, JSON.stringify(prune(p))) } catch (_) {} }
/** un altro figlio (per copiare il piano a più bambini) */
export const loadPlansFor = (childId: string) => parse(getForChild(childId, KEY))
export const savePlansFor = (childId: string, p: Plans) => setForChild(childId, KEY, JSON.stringify(prune(p)))

/** una copia delle tappe, con le spunte e i minuti azzerati */
export const freshSteps = (steps: PlanStep[]): PlanStep[] => steps.map(s => ({ ...s, id: newId(), done: false, spent: 0 }))

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
