/**
 * 📅 Le scadenze: una poesia, un testo di Leggo e capisco o una lista di English time da sapere entro un giorno.
 * L'app mette da sola una tappa al giorno nel piano di lavoro (lib/plans.ts), con un percorso diverso per ogni sezione,
 * rispettando i giorni scelti e un tetto di minuti al giorno (contando anche la prova della recita).
 * Salvate per figlio nella chiave "scadenze" (e nel database: vedi lib/childStore.ts).
 */
export type DlSec = 'poesia' | 'capisco' | 'english'
export interface Deadline { id: string; sec: DlSec; item: string; title: string; parts?: number; date: string; min: number; days: number[]; skip: string[]
  created?: string; result?: { face: string; voto?: string } }
export interface DlStore { cap: number; list: Deadline[] }
export interface DlStep { d: Deadline; lab: string; tab: number }
const KEY = 'scadenze'
export function loadDeadlines(): DlStore {
  try { const v = JSON.parse(localStorage.getItem(KEY) || 'null'); if (v && Array.isArray(v.list)) return { cap: v.cap ?? 25, list: v.list } } catch (_) {}
  return { cap: 25, list: [] }
}
export function saveDeadlines(s: DlStore) { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {} }

export const DL_SEC: Record<DlSec, { e: string; c: string; name: string; kind: string }> = {
  poesia: { e: '🎭', c: '#7048E8', name: 'Imparo la poesia', kind: 'interrogazione' },
  capisco: { e: '🔎', c: '#0B7285', name: 'Leggo e capisco', kind: 'verifica' },
  english: { e: '🇬🇧', c: '#C2255C', name: 'English time', kind: 'verifica di inglese' },
}
/** i passi del percorso di ogni sezione (tab: dove aprire la sezione, per chi la usa) */
export function dlSteps(d: Deadline): { lab: string; tab: number }[] {
  if (d.sec === 'poesia') return [{ lab: '🎧 Ascolta tutta la poesia', tab: 0 }, ...Array.from({ length: Math.max(1, d.parts ?? 1) }, (_, k) => ({ lab: `📜 Strofa ${k + 1}`, tab: k + 1 })), { lab: '🧠 Tutta a memoria', tab: 99 }, { lab: '⚡ Ripasso veloce', tab: 99 }]
  if (d.sec === 'capisco') return [{ lab: '📖 Leggi e le parole nuove', tab: 0 }, { lab: '🧩 I pezzetti con le domande', tab: 0 }, { lab: '🔢 I momenti in ordine', tab: 0 }, { lab: '🧠 Il quiz', tab: 1 }, { lab: '⚡ Solo il quiz', tab: 1 }]
  return [{ lab: '📚 Impara le parole', tab: 0 }, { lab: '🎧 Listen & write', tab: 0 }, { lab: '👀 Look, cover, write, check', tab: 1 }, { lab: '🔁 Le parole sbagliate', tab: 0 }]
}
export const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const plus = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }

/**
 * Il calcolo: le scadenze più vicine scelgono prima i giorni; prima quelli che restano sotto il tetto, poi (se non bastano)
 * i meno pieni; un passo al giorno, allungati se i giorni sono tanti, uniti se sono pochi. extra = minuti già occupati (la recita).
 */
export function scheduleDeadlines(st: DlStore, extra: Record<string, number> = {}) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const load: Record<string, number> = { ...extra }, plan: Record<string, DlStep[]> = {}, notes: Record<string, string[]> = {}
  ;[...st.list].sort((a, b) => a.date.localeCompare(b.date)).forEach(d => {
    const steps = dlSteps(d), avail: string[] = []
    for (let x = new Date(today), i = 0; isoOf(x) < d.date && i < 60; x = plus(x, 1), i++) { const k = isoOf(x); if (d.days.includes(x.getDay()) && !d.skip.includes(k)) avail.push(k) }
    const msgs: string[] = []
    if (!avail.length) { notes[d.id] = ['Non ci sono giorni liberi prima della scadenza.']; return }
    const fit = avail.filter(k => (load[k] ?? 0) + d.min <= st.cap), need = Math.min(steps.length, avail.length)
    let days = [...fit]
    if (days.length < need) {
      const more = avail.filter(k => !fit.includes(k)).sort((a, b) => (load[a] ?? 0) - (load[b] ?? 0)).slice(0, need - days.length)
      days = [...days, ...more].sort()
      if (more.length) msgs.push(`In ${more.length} ${more.length === 1 ? 'giorno' : 'giorni'} si supera il tetto di ${st.cap} minuti: puoi alzarlo, o cominciare prima.`)
    }
    if (days.length < steps.length) { const n = steps.length - days.length; msgs.push(`Pochi giorni: in ${n} ${n === 1 ? 'giorno ci sono' : 'giorni ci sono'} due passi insieme. Vuoi aumentare i minuti, o aggiungere un giorno?`) }
    days.forEach((k, i) => {
      let lab: string, tab: number
      if (days.length >= steps.length) { const s = i === days.length - 1 ? steps[steps.length - 1] : steps[Math.min(steps.length - 1, Math.floor((i * steps.length) / days.length))]; lab = s.lab; tab = s.tab }
      else { const a = Math.floor((i * steps.length) / days.length), b = Math.floor(((i + 1) * steps.length) / days.length); lab = steps.slice(a, b).map(s => s.lab).join(' + '); tab = steps[a].tab }
      ;(plan[k] = plan[k] ?? []).push({ d, lab, tab }); load[k] = (load[k] ?? 0) + d.min
    })
    notes[d.id] = msgs
  })
  return { plan, load, notes }
}
/** il genitore toglie la tappa di una scadenza da un giorno: il lavoro si ridistribuisce sugli altri */
export function skipDeadlineDay(id: string, day: string) {
  const st = loadDeadlines(), d = st.list.find(x => x.id === id); if (!d) return
  d.skip = [...new Set([...d.skip, day])]; saveDeadlines(st)
}
/** dove aprire la sezione quando il bambino tocca la tappa (lo legge la sezione, e lo cancella) */
export interface OpenHint { sec: DlSec; item: string; tab: number }
export function takeOpenHint(sec: DlSec): OpenHint | null {
  try { const v = JSON.parse(sessionStorage.getItem('apri') || 'null'); if (v && v.sec === sec) { sessionStorage.removeItem('apri'); return v } } catch (_) {}
  return null
}
export function peekOpenHint(sec: DlSec): boolean { try { const v = JSON.parse(sessionStorage.getItem('apri') || 'null'); return !!v && v.sec === sec } catch (_) { return false } }

/* ── 📊 Come sta andando: dai giorni previsti, dalle tappe fatte e dai minuti contati nel piano di lavoro ── */
export type DayState = 'ok' | 'no' | 'oggi' | 'poi' | 'prova'
export interface Progress { planned: number; done: number; behind: number; spentMin: number; doneMin: number; ratio: number | null
  strip: { date: string; state: DayState; min: number }[]; missedWeekdays: Record<number, number>; light: 'g' | 'y' | 'r' }
type PlanDays = Record<string, { steps: { auto?: string; dl?: string; done: boolean; spent: number }[] }>
export function deadlineProgress(d: Deadline, days: PlanDays, todayIso: string): Progress {
  const strip: Progress['strip'] = [], missed: Record<number, number> = {}
  let planned = 0, done = 0, spent = 0, doneSpent = 0
  const start = d.created && d.created < d.date ? d.created : todayIso
  for (let x = new Date(start + 'T00:00:00'), i = 0; i < 60; x.setDate(x.getDate() + 1), i++) {
    const k = isoOf(x); if (k > d.date) break
    if (k === d.date) { strip.push({ date: k, state: 'prova', min: 0 }); break }
    if (!d.days.includes(x.getDay()) || d.skip.includes(k)) continue
    const st = days[k]?.steps.find(s => s.auto === 'scadenza' && s.dl === d.id), sec = st?.spent ?? 0
    spent += sec
    if (st?.done) { done++; doneSpent += sec }
    if (k < todayIso) { planned++; if (!st?.done) missed[x.getDay()] = (missed[x.getDay()] ?? 0) + 1 }
    strip.push({ date: k, state: st?.done ? 'ok' : k < todayIso ? 'no' : k === todayIso ? 'oggi' : 'poi', min: Math.round(sec / 60) })
  }
  const pastDone = strip.filter(s => s.state === 'ok' && s.date < todayIso).length
  const behind = Math.max(0, planned - pastDone), ratio = done >= 1 ? doneSpent / 60 / (done * d.min) : null
  const light = behind >= 2 ? 'r' : behind === 1 || (ratio !== null && done >= 2 && ratio > 1.5) ? 'y' : 'g'
  return { planned, done, behind, spentMin: Math.round(spent / 60), doneMin: done * d.min, ratio, strip, missedWeekdays: missed, light }
}
