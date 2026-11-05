/**
 * I testi di "Leggo e capisco" scritti dal genitore: dividere il testo in pezzetti,
 * controllare il contenuto prima di salvarlo e trasformarlo nel formato delle storie.
 */
import type { RStory, QType } from './readStories'

export interface ReadQuestion { t: QType; text: string; right: string; wrong: string[]; ans: number }
export interface ReadContent { words: [string, string][]; parts: { text: string[]; q: ReadQuestion | null }[]; seq: string[] }
export interface ReadTextRow { id: string; title: string; cover: string; content: ReadContent; child_id: string | null }
export const COVERS = ['📖', '📚', '🐶', '🐱', '🌳', '🚀', '🏰', '🐟', '🌍', '🍎', '⭐', '🦁']
const QTYPES: QType[] = ['chi', 'cosa', 'quanti', 'dove', 'quando', 'perche']

/** Le frasi di un testo: si va a capo dopo . ! ? … (anche con le virgolette) */
export function splitSentences(text: string): string[] {
  return text.replace(/\s+/g, ' ').trim().split(/(?<=[.!?…][»”"’)]?)\s+(?=\S)/).map(s => s.trim()).filter(Boolean)
}
/** Il testo in pezzetti: si rispettano i capoversi, e ogni pezzetto ha al massimo `max` frasi */
export function splitParts(text: string, max = 3): string[][] {
  const out: string[][] = []
  text.split(/\n\s*\n|\n/).map(p => p.trim()).filter(Boolean).forEach(par => {
    const ss = splitSentences(par)
    for (let i = 0; i < ss.length; i += max) out.push(ss.slice(i, i + max))
  })
  return out
}

/** Prima di salvare: solo quello che serve, con lunghezze ragionevoli */
export function cleanReadContent(raw: unknown): ReadContent {
  const c = (raw ?? {}) as Partial<ReadContent>
  const str = (x: unknown, n: number) => String(x ?? '').trim().slice(0, n)
  const parts = (Array.isArray(c.parts) ? c.parts : []).slice(0, 30).map(p => {
    const text = (Array.isArray(p?.text) ? p.text : []).map(x => str(x, 400)).filter(Boolean).slice(0, 8)
    const q = p?.q && str(p.q.text, 200) && str(p.q.right, 120) ? {
      t: (QTYPES.includes(p.q.t) ? p.q.t : 'cosa') as QType, text: str(p.q.text, 200), right: str(p.q.right, 120),
      wrong: (Array.isArray(p.q.wrong) ? p.q.wrong : []).map(x => str(x, 120)).filter(Boolean).slice(0, 2),
      ans: Math.max(0, Math.min(text.length - 1, Number(p.q.ans) || 0)),
    } : null
    return { text, q: q && q.wrong.length ? q : null }
  }).filter(p => p.text.length)
  const words = (Array.isArray(c.words) ? c.words : []).map(w => [str(w?.[0], 40), str(w?.[1], 200)] as [string, string]).filter(w => w[0]).slice(0, 8)
  const seq = (Array.isArray(c.seq) ? c.seq : []).map(x => str(x, 120)).filter(Boolean).slice(0, 4)
  return { words, parts, seq }
}

/** Un testo del genitore nel formato delle storie già pronte (senza immagini: le scene usano la copertina) */
export function toStory(r: ReadTextRow): RStory {
  const c = cleanReadContent(r.content)
  return {
    id: r.id, cover: r.cover || '📖', title: r.title, guess: '',
    words: c.words.map(([w, d]) => ['📌', w, d]),
    parts: c.parts.map(p => ({
      scene: '', text: p.text,
      q: p.q ? { t: p.q.t, text: p.q.text, ans: p.q.ans, opts: [{ e: '', text: p.q.right, ok: true }, ...p.q.wrong.map(w => ({ e: '', text: w }))] } : null,
    })),
    seq: c.seq.length >= 2 ? c.seq.map((s, i) => [String(i + 1), s] as [string, string]) : [],
  }
}
