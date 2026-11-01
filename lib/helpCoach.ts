/**
 * Gli aiuti che si spengono al momento giusto.
 *
 * Ogni gioco con aiuti registra le risposte del figlio (giusta al primo colpo? data subito, senza aiuto?).
 * Quando, con gli aiuti di adesso, le ultime 20 risposte sono quasi tutte giuste, spesso date subito
 * e in almeno 2 giorni diversi, l'area Genitore propone di togliere un aiuto (uno alla volta, nell'ordine).
 * Se dopo il cambio gli errori aumentano molto, propone di rimetterlo. L'app non cambia mai niente da sola.
 *
 * Tutto è salvato per figlio ("aiuti_progressi", sincronizzato con il database: vedi lib/childStore.ts).
 */
export type CoachGame = 'confronta' | 'precsucc'
type Val = string | number | boolean
/** Un passo: l'impostazione `key` passa da `from` a `to` (togliere o alleggerire un aiuto) */
export interface CoachStep { key: string; from: Val; to: Val; what: string }
interface GameDef { storage: string; defaults: Record<string, Val>; steps: CoachStep[] }

/** Gli aiuti di ogni gioco, nell'ordine in cui si tolgono (prima i più "pesanti") */
export const COACH_GAMES: Record<CoachGame, GameDef> = {
  confronta: {
    storage: 'confronto_impostazioni', defaults: { towers: false, digits: false },
    steps: [
      { key: 'towers', from: true, to: false, what: 'towersOff' },
      { key: 'digits', from: true, to: false, what: 'digitsOff' },
    ],
  },
  precsucc: {
    storage: 'precsucc_impostazioni', defaults: { blocks: 'help', line: 'always' },
    steps: [
      { key: 'blocks', from: 'always', to: 'help', what: 'blocksHelp' },
      { key: 'blocks', from: 'help', to: 'never', what: 'blocksOff' },
      { key: 'line', from: 'always', to: 'help', what: 'lineHelp' },
      { key: 'line', from: 'help', to: 'never', what: 'lineOff' },
    ],
  },
}
export const WINDOW = 20, NEED_OK = 18, NEED_FAST = 10, NEED_DAYS = 2, BACK_LAST = 10, BACK_ERRORS = 4, SNOOZE = 10

interface Answer { ok: boolean; fast: boolean; day: string; cfg: string }
interface GameLog { answers: Answer[]; snoozeUntil?: number; count?: number; last?: { step: CoachStep; at: number } }
type Log = Partial<Record<CoachGame, GameLog>>
const KEY = 'aiuti_progressi'

const read = (k: string) => { try { return JSON.parse(localStorage.getItem(k) || 'null') } catch (_) { return null } }
const load = (): Log => read(KEY) ?? {}
const save = (l: Log) => { try { localStorage.setItem(KEY, JSON.stringify(l)) } catch (_) {} }
const today = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}` }

/** Le impostazioni degli aiuti del gioco, come sono adesso per questo figlio */
function helps(game: CoachGame): Record<string, Val> {
  const g = COACH_GAMES[game]
  return { ...g.defaults, ...(read(g.storage) ?? {}) }
}
/** Una "firma" degli aiuti di adesso: contano solo le risposte date con questi aiuti */
function signature(game: CoachGame): string {
  const h = helps(game)
  return COACH_GAMES[game].steps.map(s => s.key).filter((k, i, a) => a.indexOf(k) === i).map(k => `${k}=${h[k]}`).join('|')
}

/** Da chiamare a ogni risposta giusta del bambino */
export function recordAnswer(game: CoachGame, ok: boolean, fast: boolean) {
  const l = load()
  const g: GameLog = l[game] ?? { answers: [] }
  g.answers = [...g.answers, { ok, fast: ok && fast, day: today(), cfg: signature(game) }].slice(-40)
  g.count = (g.count ?? 0) + 1
  l[game] = g; save(l)
}

export interface Proposal {
  game: CoachGame; kind: 'ready' | 'back'; step: CoachStep
  wrong: number; fast: number; days: number; errors: number
}
/** Le proposte da mostrare al genitore, una per gioco al massimo */
export function proposals(): Proposal[] {
  const l = load(), out: Proposal[] = []
  for (const game of Object.keys(COACH_GAMES) as CoachGame[]) {
    const g = l[game]; if (!g) continue
    const count = g.count ?? g.answers.length
    if (count < (g.snoozeUntil ?? 0)) continue
    const now = g.answers.filter(a => a.cfg === signature(game))
    // dopo un cambio: se gli errori aumentano molto, proporre di tornare indietro
    if (g.last) {
      const last = now.slice(-BACK_LAST), errors = last.filter(a => !a.ok).length
      const h = helps(game)
      if (last.length >= BACK_LAST && errors >= BACK_ERRORS && h[g.last.step.key] === g.last.step.to) {
        out.push({ game, kind: 'back', step: g.last.step, wrong: 0, fast: 0, days: 0, errors }); continue
      }
    }
    // il prossimo aiuto da togliere
    const h = helps(game)
    const step = COACH_GAMES[game].steps.find(s => h[s.key] === s.from)
    if (!step) continue
    const w = now.slice(-WINDOW), ok = w.filter(a => a.ok).length, fast = w.filter(a => a.fast).length, days = new Set(w.map(a => a.day)).size
    if (w.length >= WINDOW && ok >= NEED_OK && fast >= NEED_FAST && days >= NEED_DAYS)
      out.push({ game, kind: 'ready', step, wrong: WINDOW - ok, fast, days, errors: 0 })
  }
  return out
}

/** Il genitore dice sì: si cambia l'impostazione del gioco (per questo figlio) */
export function acceptProposal(p: Proposal) {
  const g = COACH_GAMES[p.game]
  const cur = read(g.storage) ?? {}
  const val = p.kind === 'ready' ? p.step.to : p.step.from
  try { localStorage.setItem(g.storage, JSON.stringify({ ...cur, [p.step.key]: val })) } catch (_) {}
  const l = load(), gl: GameLog = l[p.game] ?? { answers: [] }
  gl.last = p.kind === 'ready' ? { step: p.step, at: gl.count ?? 0 } : undefined
  l[p.game] = gl; save(l)
}
/** Il genitore dice "non ancora": se ne riparla dopo altre 10 risposte */
export function snoozeProposal(p: Proposal) {
  const l = load(), gl: GameLog = l[p.game] ?? { answers: [] }
  gl.snoozeUntil = (gl.count ?? gl.answers.length) + SNOOZE
  if (p.kind === 'back') gl.last = undefined
  l[p.game] = gl; save(l)
}
