/**
 * Il mio diario di scuola: materie, tipi di voci, date e impostazioni.
 * L'orario ("diario_orario") e le impostazioni ("diario_impostazioni") sono salvati per figlio
 * (localStorage per figlio + database, vedi lib/childStore.ts); le voci del diario nella tabella school_diary.
 */
export type DiaryType = 'compiti' | 'verifica' | 'portare' | 'gita' | 'vacanza'
export const DIARY_TYPES: { id: DiaryType; e: string; c: string }[] = [
  { id: 'compiti', e: '📝', c: '#1C7ED6' }, { id: 'verifica', e: '✏️', c: '#E03131' }, { id: 'portare', e: '🎒', c: '#F08C00' },
  { id: 'gita', e: '🚌', c: '#7048E8' }, { id: 'vacanza', e: '🏖️', c: '#2F9E44' },
]
export const typeOf = (id: string) => DIARY_TYPES.find(x => x.id === id) ?? DIARY_TYPES[0]

export interface Subject { key: string; e: string; c: string; name?: string; short?: string }
/** Le materie di serie: il nome arriva dalla lingua dell'app (t.diary.subjects) */
export const BASE_SUBJECTS: Subject[] = [
  { key: 'lingua', e: '📖', c: '#E03131' }, { key: 'mat', e: '➗', c: '#1C7ED6' }, { key: 'ing', e: '🇬🇧', c: '#7048E8' },
  { key: 'sto', e: '🏛️', c: '#9C6B30' }, { key: 'geo', e: '🌍', c: '#2F9E44' }, { key: 'sci', e: '🔬', c: '#0CA678' },
  { key: 'art', e: '🎨', c: '#F08C00' }, { key: 'mus', e: '🎵', c: '#E64980' }, { key: 'gin', e: '⚽', c: '#E8A400' },
  { key: 'tec', e: '💻', c: '#495057' },
]
/** Colori e icone tra cui il genitore sceglie per una materia nuova */
export const CUSTOM_COLORS = ['#C2255C', '#5F3DC4', '#0B7285', '#5C940D', '#D9480F', '#364FC7']
export const CUSTOM_ICONS = ['🇫🇷', '🇪🇸', '🇩🇪', '🙏', '🧩', '🧮', '🗣️', '🌱', '🎭', '🏊']

export interface DiarySettings { who: 'parent' | 'child'; custom: Subject[] }
export type Timetable = Record<number, string[]>            // 1 lunedì … 5 venerdì → chiavi delle materie, in ordine
export interface DiaryEntry { id: string; day: string; type: DiaryType; subject: string; note: string; photo_url: string | null; done: boolean }

const read = <T,>(k: string, d: T): T => { try { const r = localStorage.getItem(k); if (r) return { ...d, ...JSON.parse(r) } } catch (_) {} return d }
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch (_) {} }
export const loadDiarySettings = () => read<DiarySettings>('diario_impostazioni', { who: 'parent', custom: [] })
export const saveDiarySettings = (v: DiarySettings) => write('diario_impostazioni', v)
export const loadTimetable = () => read<Timetable>('diario_orario', { 1: [], 2: [], 3: [], 4: [], 5: [] })
export const saveTimetable = (v: Timetable) => write('diario_orario', v)
/** Nella demo (senza account) le voci restano su questo telefono */
export const loadDemoEntries = (): DiaryEntry[] => { try { return JSON.parse(localStorage.getItem('diario_demo_voci') || '[]') } catch (_) { return [] } }
export const saveDemoEntries = (v: DiaryEntry[]) => write('diario_demo_voci', v)

/* ── Date ── */
export const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const fromIso = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d) }
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const monday = (d: Date) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); x.setHours(0, 0, 0, 0); return x }
export const todayDate = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d }
/** Il prossimo giorno di scuola: salta sabato, domenica e i giorni segnati "niente scuola" */
export function nextSchoolDay(from: Date, entries: DiaryEntry[]): Date {
  let d = addDays(from, 1)
  for (let i = 0; i < 21; i++) {
    const w = d.getDay(), ds = iso(d)
    if (w >= 1 && w <= 5 && !entries.some(e => e.day === ds && e.type === 'vacanza')) return d
    d = addDays(d, 1)
  }
  return addDays(from, 1)
}
/** Le voci di un giorno, prima le verifiche */
export const entriesOn = (entries: DiaryEntry[], ds: string) =>
  entries.filter(e => e.day === ds).sort((a, b) => (a.type === 'verifica' ? -1 : 0) - (b.type === 'verifica' ? -1 : 0))

/** Le foto vengono rimpicciolite prima di salvarle, così il diario resta leggero */
export function shrinkPhoto(file: File): Promise<{ blob: Blob; url: string }> {
  return new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => {
      const im = new Image()
      im.onload = () => {
        const k = Math.min(1, 1024 / Math.max(im.width, im.height)), c = document.createElement('canvas')
        c.width = im.width * k; c.height = im.height * k; c.getContext('2d')!.drawImage(im, 0, 0, c.width, c.height)
        const url = c.toDataURL('image/jpeg', 0.75)
        c.toBlob(b => (b ? res({ blob: b, url }) : rej(new Error('foto'))), 'image/jpeg', 0.75)
      }
      im.onerror = rej; im.src = String(r.result)
    }
    r.onerror = rej; r.readAsDataURL(file)
  })
}
