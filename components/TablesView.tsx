'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import TablesSettingsPanel from './TablesSettingsPanel'
import {
  TABLES_DEFAULTS, loadTablesSettings, loadTablesProgress, saveTablesProgress, phasesFor,
  type TablesSettings, type TablesProgress, type TablesPhase,
} from '@/lib/tablesSettings'
import { randomPraise } from '@/lib/praise'
import s from './TablesView.module.css'

interface Props {
  onBack: () => void
  /** Mostra l'ingranaggio delle impostazioni dentro il gioco (solo modalità demo, dove non c'è l'area genitore) */
  allowSettings?: boolean
}

/* ── Configurazione delle tabelline ───────────────────────────── */

type Many<T> = T | T[]
interface TableConfig { icon: string; unit: Many<string>; ask: Many<string>; words: Many<string> }

const TABLES: Record<number, TableConfig> = {
  0:  { icon: '🍽️', unit: '',   ask: 'Quanti biscotti ci sono nei piatti?', words: 'biscotti' },
  1:  { icon: '🧒', unit: '🎈', ask: 'Quanti palloncini ci sono?', words: 'palloncini' },
  2:  { icon: '',   unit: ['🧦', '🧤', '👟'], ask: ['Quante calze ci sono?', 'Quanti guanti ci sono?', 'Quante scarpe ci sono?'], words: ['calze', 'guanti', 'scarpe'] },
  3:  { icon: '☘️', unit: '🍃', ask: 'Quante foglie ci sono?', words: 'foglie' },
  4:  { icon: '🚗', unit: '🛞', ask: 'Quante ruote ci sono?', words: 'ruote' },
  5:  { icon: '✋', unit: '',   ask: 'Quante dita ci sono?', words: 'dita' },
  6:  { icon: '🐞', unit: '',   ask: 'Quante zampe ci sono?', words: 'zampe' },
  7:  { icon: '📅', unit: '',   ask: 'Quanti giorni ci sono?', words: 'giorni' },
  8:  { icon: '🐙', unit: '',   ask: 'Quanti tentacoli ci sono?', words: 'tentacoli' },
  9:  { icon: '',   unit: '',   ask: 'Quanti pallini ci sono?', words: 'pallini' },
  10: { icon: '🙌', unit: '',   ask: 'Quante dita ci sono?', words: 'dita' },
  11: { icon: '⚽', unit: '',   ask: 'Quanti giocatori ci sono?', words: 'giocatori' },
  12: { icon: '🥚', unit: '',   ask: 'Quante uova ci sono?', words: 'uova' },
}

const PHASES: { id: TablesPhase; label: string; em: string }[] = [
  { id: 'scopri',  label: 'Scopri',  em: '👀' },
  { id: 'salta',   label: 'Salta',   em: '🐸' },
  { id: 'ricorda', label: 'Ricorda', em: '🧠' },
]

/* ── Utilità ──────────────────────────────────────────────────── */

type Say = (text: string) => Promise<void>

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
const pick = <T,>(v: Many<T>, k: number): T => (Array.isArray(v) ? v[(k - 1) % v.length] : v)
const factText = (t: number, k: number) => `${t} per ${k} fa ${t * k}`

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Legge il testo ad alta voce; la promessa si risolve quando la frase è finita */
function speakText(text: string, enabled: boolean): Promise<void> {
  return new Promise(resolve => {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve()
    let finished = false
    const fin = () => { if (!finished) { finished = true; resolve() } }
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'it-IT'
      u.rate = 0.85
      u.onend = fin
      u.onerror = fin
      setTimeout(fin, 1500 + text.length * 120) // sicurezza se il browser non avvisa
      window.speechSynthesis.speak(u)
    } catch (_) { fin() }
  })
}

function wiggle(el: HTMLElement) {
  el.classList.remove(s.wrong)
  void el.offsetWidth
  el.classList.add(s.wrong)
}

function makeChoices(t: number, k: number, n: number): number[] {
  const right = t * k
  const main  = shuffle([right - t, right + t, right + 2 * t, right - 2 * t])
  const extra = [right + 1, right - 1, k + 1, 1, 2]
  const out: number[] = []
  ;[...main, ...extra].forEach(v => { if (v >= 0 && v !== right && !out.includes(v)) out.push(v) })
  return shuffle([right, ...out.slice(0, n - 1)])
}

/** Hook che dice se il componente è ancora montato (per i timer) */
function useAlive() {
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  return alive
}

/* ── Un gruppo da T (oggetti o pallini) ───────────────────────── */

function GroupContent({ t, k, look }: { t: number; k: number; look: TablesSettings['look'] }) {
  const cfg = TABLES[t]
  const dots = look === 'dots' || !cfg.unit
  return (
    <>
      {look !== 'dots' && cfg.icon && <span className={s.icon}>{cfg.icon}</span>}
      {t === 0 ? (
        <span className={s.empty}>vuoto</span>
      ) : (
        <span className={`${s.units}${dots ? ` ${s.dots}` : ''}`}>
          {Array.from({ length: t }, (_, i) =>
            dots ? <span key={i} className={s.dot} /> : <span key={i} className={s.mini}>{pick(cfg.unit, k)}</span>
          )}
        </span>
      )}
    </>
  )
}

/* ── Fase 1: Scopri ───────────────────────────────────────────── */

function Scopri({ t, settings, say, onLight, onDone }: {
  t: number; settings: TablesSettings; say: Say; onLight: (k: number) => void; onDone: () => void
}) {
  const alive = useAlive()
  const [k, setK]                 = useState(1)
  const [objects, setObjects]     = useState<Record<string, number>>({})
  const [groups, setGroups]       = useState<Record<number, number>>({})
  const [result, setResult]       = useState(false)
  const cfg        = TABLES[t]
  const dots       = settings.look === 'dots' || !cfg.unit
  const eachObject = t > 0 && t <= 3 && !dots   // piccoli: un oggetto alla volta
  const byGroup    = t > 0 && !eachObject       // grandi: un gruppo alla volta
  const total      = t * k
  const words      = dots ? 'pallini' : pick(cfg.words, k)

  const finish = () => {
    if (!alive.current) return
    setResult(true)
    onLight(k)
    say(`${t === 0 ? 'Zero' : total}. ${factText(t, k)}`)
  }

  const tapObject = (key: string) => {
    if (objects[key] || result) return
    const n = Object.keys(objects).length + 1
    setObjects(o => ({ ...o, [key]: n }))
    say(String(n))
    if (n === total) setTimeout(finish, 500)
  }

  const tapGroup = (g: number) => {
    if (groups[g] !== undefined || result) return
    const count = Object.keys(groups).length + 1
    setGroups(o => ({ ...o, [g]: count * t }))
    say(String(count * t))
    if (count === k) setTimeout(finish, 600)
  }

  const next = () => {
    if (k < settings.upTo) {
      setK(k + 1); setObjects({}); setGroups({}); setResult(false)
    } else onDone()
  }

  return (
    <>
      <p className={s.ask}>{dots && t > 0 ? 'Quanti pallini ci sono?' : pick(cfg.ask, k)}</p>
      <p className={s.sub}>
        {t === 0 ? `${k} ${k === 1 ? 'piatto vuoto' : 'piatti vuoti'}: guarda bene!`
          : eachObject ? `Tocca le ${words} una alla volta e conta`
          : `In ogni gruppo ce ne sono ${t}. Tocca un gruppo alla volta.`}
      </p>

      <div className={s.groups}>
        {Array.from({ length: k }, (_, g) => {
          if (byGroup) {
            return (
              <button key={g} className={`${s.group}${groups[g] !== undefined ? ` ${s.counted}` : ''}`} onClick={() => tapGroup(g)} aria-label={`Gruppo da ${t}`}>
                <GroupContent t={t} k={k} look={settings.look} />
                <span className={s.total}>{groups[g] ?? ''}</span>
              </button>
            )
          }
          return (
            <div key={g} className={s.group}>
              {settings.look !== 'dots' && cfg.icon && <span className={s.icon}>{cfg.icon}</span>}
              {t === 0 ? <span className={s.empty}>vuoto</span> : (
                <span className={s.units}>
                  {Array.from({ length: t }, (_, i) => {
                    const key = `${g}-${i}`
                    return (
                      <button key={key} className={`${s.obj}${objects[key] ? ` ${s.objCounted}` : ''}`} onClick={() => tapObject(key)} aria-label={words}>
                        {pick(cfg.unit, k)}
                        {objects[key] && <span className={s.badge}>{objects[key]}</span>}
                      </button>
                    )
                  })}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {t === 0 && !result && <button className={`${s.btn} ${s.main}`} onClick={finish}>Ci sono… 0!</button>}

      {result && (
        <>
          <p className={s.sum}>{Array(k).fill(t).join(' + ')} = {total}</p>
          <p className={s.fact}>{t} × {k} = <b>{total}</b></p>
          <button className={`${s.btn} ${s.main}`} onClick={next}>{k < settings.upTo ? 'Avanti ➜' : 'Fine ⭐'}</button>
        </>
      )}
    </>
  )
}

/* ── Fase 2: Salta ────────────────────────────────────────────── */

function Salta({ t, settings, say, onLight, onDone }: {
  t: number; settings: TablesSettings; say: Say; onLight: (k: number) => void; onDone: () => void
}) {
  const alive = useAlive()
  const max      = t * settings.upTo
  const windowed = max > 30 // numeri grandi: si vede solo il pezzo di percorso vicino alla rana
  const [pos, setPos]       = useState(0)
  const [hinted, setHinted] = useState(false)
  const [hop, setHop]       = useState(0)
  const [fact, setFact]     = useState('')
  const misses = useRef(0)

  const from = windowed ? pos : 0
  const to   = windowed ? Math.min(max, pos + t + (t < 5 ? 4 : 2)) : max

  const tap = (n: number, el: HTMLElement) => {
    if (pos >= max) return
    if (n === pos + t) {
      setPos(n); setHinted(false); setHop(h => h + 1); misses.current = 0
      const k = n / t
      onLight(k)
      setFact(`${t} × ${k} = ${n}`)
      const spoken = say(String(n))
      if (n >= max) Promise.all([spoken, wait(1100)]).then(() => { if (alive.current) onDone() })
    } else if (n > pos) {
      wiggle(el)
      misses.current += 1
      if (settings.autoHelp && misses.current >= 2) setHinted(true)
    }
  }

  return (
    <>
      <p className={s.ask}>Dove salta la rana?</p>
      <p className={s.sub}>Fa salti di {t}. Tocca il numero dove atterra.</p>
      <div className={s.track}>
        {Array.from({ length: to - from + 1 }, (_, i) => from + i).map(n => {
          const landed = n <= pos && n % t === 0
          const cls = landed ? s.landed : hinted && n === pos + t ? s.stoneHint : ''
          return (
            <button key={n} className={`${s.stone} ${cls}`} onClick={e => tap(n, e.currentTarget)} aria-label={`Numero ${n}`}>
              {n === pos && <span key={hop} className={`${s.frog}${hop ? ` ${s.hop}` : ''}`}>🐸</span>}
              {n}
            </button>
          )
        })}
      </div>
      <p className={s.sum}>{fact || '\u00a0'}</p>
      {pos < max && <button className={s.btn} onClick={() => setHinted(true)}>💡 Aiuto</button>}
    </>
  )
}

/* ── Fase 3: Ricorda (usata anche da "Tutte mischiate") ────────── */

function Quiz({ questions, showProgress, settings, say, onLight, onDone }: {
  questions: [number, number][]; showProgress?: boolean; settings: TablesSettings; say: Say
  onLight?: (k: number) => void; onDone: () => void
}) {
  const alive = useAlive()
  const [qi, setQi]             = useState(0)
  const [hinted, setHinted]     = useState(false)
  const [answered, setAnswered] = useState(false)
  const misses = useRef(0)
  const [t, k] = questions[qi]
  const right  = t * k
  const choices = useMemo(() => makeChoices(t, k, settings.choices), [t, k, settings.choices, qi])

  useEffect(() => { say(`${t} per ${k}`) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (v: number, el: HTMLElement) => {
    if (answered) return
    if (v === right) {
      setAnswered(true)
      onLight?.(k)
      Promise.all([say(factText(t, k)), wait(1300)]).then(() => wait(400)).then(() => {
        if (!alive.current) return
        if (qi + 1 < questions.length) {
          setQi(qi + 1); setHinted(false); setAnswered(false); misses.current = 0
        } else onDone()
      })
    } else {
      wiggle(el)
      misses.current += 1
      if (settings.autoHelp && misses.current >= 2) setHinted(true)
    }
  }

  return (
    <>
      {showProgress && <p className={s.progress}>Domanda {qi + 1} di {questions.length}</p>}
      <p className={s.question}>{t} × {k} = <span className={s.q}>{answered ? right : '?'}</span></p>
      <div className={s.choices}>
        {choices.map(v => (
          <button
            key={v}
            className={`${s.choice}${answered && v === right ? ` ${s.right}` : hinted && v === right ? ` ${s.choiceHint}` : ''}`}
            onClick={e => answer(v, e.currentTarget)}
          >{v}</button>
        ))}
      </div>
      {hinted && settings.visual && (
        <div className={s.aid}>
          <p className={s.sub}>{k} {k === 1 ? 'gruppo' : 'gruppi'} da {t}: contali!</p>
          <div className={s.groups}>
            {Array.from({ length: k }, (_, g) => (
              <div key={g} className={`${s.group} ${s.small}`}><GroupContent t={t} k={k} look={settings.look} /></div>
            ))}
          </div>
        </div>
      )}
      {!answered && <button className={s.btn} onClick={() => setHinted(true)}>💡 Aiuto</button>}
    </>
  )
}

/* ── Una tabellina con le sue fasi ────────────────────────────── */

function TablePlay({ t, settings, progress, say, onPhaseDone, onHome }: {
  t: number; settings: TablesSettings; progress: TablesProgress; say: Say
  onPhaseDone: (t: number, phase: TablesPhase) => void; onHome: () => void
}) {
  const list = phasesFor(t, settings.phases)
  const [phase, setPhase] = useState<TablesPhase>(list[0])
  const [found, setFound] = useState<Set<number>>(new Set())
  const [won, setWon]     = useState(false)
  const [run, setRun]     = useState(0)
  const [praise, setPraise] = useState('')
  const done = (progress[t] as TablesPhase[] | undefined) ?? []

  const light = useCallback((k: number) => setFound(prev => new Set(prev).add(k)), [])
  const goTo  = (p: TablesPhase) => { setPhase(p); setWon(false); setRun(r => r + 1) }
  const finish = () => { const p = randomPraise(); setPraise(p); onPhaseDone(t, phase); setWon(true); say(p) }
  const next = list[list.indexOf(phase) + 1]
  const nextInfo = PHASES.find(p => p.id === next)

  const questions = useMemo<[number, number][]>(() => {
    const base = Array.from({ length: settings.upTo }, (_, i) => i + 1)
    return (settings.order === 'mix' ? shuffle(base) : base).map(k => [t, k])
  }, [t, settings.upTo, settings.order, run]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <section className={s.stagecard}>
        {list.length > 1 && (
          <nav className={s.phases} aria-label="Fasi">
            {PHASES.filter(p => list.includes(p.id)).map(p => (
              <button
                key={p.id}
                className={`${s.phase}${done.includes(p.id) ? ` ${s.phaseDone}` : ''}`}
                aria-current={p.id === phase ? 'step' : undefined}
                aria-label={p.label}
                onClick={() => goTo(p.id)}
              >
                <span className={s.phaseEm}>{p.em}</span>
                {p.id === phase && <span>{p.label}</span>}
              </button>
            ))}
          </nav>
        )}
        <div className={s.stage} aria-live="polite">
          {won ? (
            <>
              <div className={s.star} aria-hidden="true">⭐</div>
              <p className={s.winTitle}>{praise}</p>
              <div className={s.row}>
                {nextInfo
                  ? <button className={`${s.btn} ${s.main}`} onClick={() => goTo(nextInfo.id)}>{nextInfo.em} Ora: {nextInfo.label}</button>
                  : <button className={`${s.btn} ${s.main}`} onClick={onHome}>🏠 Tabelline</button>}
                <button className={s.btn} onClick={() => goTo(phase)}>🔄 Ripeti</button>
              </div>
            </>
          ) : phase === 'scopri' ? (
            <Scopri key={`scopri-${run}`} t={t} settings={settings} say={say} onLight={light} onDone={finish} />
          ) : phase === 'salta' ? (
            <Salta key={`salta-${run}`} t={t} settings={settings} say={say} onLight={light} onDone={finish} />
          ) : (
            <Quiz key={`ricorda-${run}`} questions={questions} settings={settings} say={say} onLight={light} onDone={finish} />
          )}
        </div>
      </section>

      <section className={s.table} aria-label={`La tabellina del ${t}`}>
        <h3 className={s.tableTitle}>La tabellina del {t}</h3>
        <div className={s.facts}>
          {Array.from({ length: settings.upTo }, (_, i) => i + 1).map(k => (
            <div key={k} className={`${s.f}${found.has(k) ? ` ${s.fLit}` : ''}`}>
              <span>{t} × {k} =</span>
              <span className={s.r}>{found.has(k) ? t * k : '?'}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

/* ── Tutte mischiate ──────────────────────────────────────────── */

function Mixed({ settings, say, onDone, onHome }: {
  settings: TablesSettings; say: Say; onDone: () => void; onHome: () => void
}) {
  const [run, setRun] = useState(0)
  const [won, setWon] = useState(false)
  const [praise, setPraise] = useState('')

  const questions = useMemo<[number, number][]>(() => {
    const pairs: [number, number][] = []
    settings.visible.forEach(a => { for (let b = 1; b <= settings.upTo; b++) pairs.push([a, b]) })
    let list = shuffle(pairs)
    while (list.length < settings.mixCount) list = list.concat(shuffle(pairs))
    return list.slice(0, settings.mixCount)
  }, [settings.visible, settings.upTo, settings.mixCount, run])

  const finish = () => { const p = randomPraise(); setPraise(p); onDone(); setWon(true); say(p) }

  return (
    <section className={s.stagecard}>
      <div className={s.stage} aria-live="polite">
        {won ? (
          <>
            <div className={s.star} aria-hidden="true">🏆</div>
            <p className={s.winTitle}>{praise}</p>
            <div className={s.row}>
              <button className={`${s.btn} ${s.main}`} onClick={() => { setWon(false); setRun(r => r + 1) }}>🎲 Ancora</button>
              <button className={s.btn} onClick={onHome}>🏠 Tabelline</button>
            </div>
          </>
        ) : (
          <Quiz key={`mix-${run}`} questions={questions} showProgress settings={settings} say={say} onDone={finish} />
        )}
      </div>
    </section>
  )
}

/* ── Componente principale ────────────────────────────────────── */

type Screen = { kind: 'home' } | { kind: 'table'; t: number } | { kind: 'mixed' }

export default function TablesView({ onBack, allowSettings = false }: Props) {
  const [settings, setSettings]   = useState<TablesSettings>(TABLES_DEFAULTS)
  const [progress, setProgress]   = useState<TablesProgress>({})
  const [screen, setScreen]       = useState<Screen>({ kind: 'home' })
  const [showPanel, setShowPanel] = useState(false)
  const voice = useRef(true)

  useEffect(() => {
    const loaded = loadTablesSettings()
    setSettings(loaded)
    voice.current = loaded.voice
    setProgress(loadTablesProgress())
  }, [])

  const say = useCallback<Say>(text => speakText(text, voice.current), [])

  const updateProgress = (update: (p: TablesProgress) => TablesProgress) => {
    setProgress(prev => {
      const next = update(prev)
      saveTablesProgress(next)
      return next
    })
  }

  const markPhase = (t: number, phase: TablesPhase) =>
    updateProgress(p => {
      const done = (p[t] as TablesPhase[] | undefined) ?? []
      return done.includes(phase) ? p : { ...p, [t]: [...done, phase] }
    })

  const handleSettingsChange = (next: TablesSettings) => {
    setSettings(next)
    voice.current = next.voice
    setScreen({ kind: 'home' })
  }

  const goHome = () => setScreen({ kind: 'home' })
  const visible = [...settings.visible].sort((a, b) => a - b)

  return (
    <>
      <button className={s.back} onClick={screen.kind === 'home' ? onBack : goHome}>
        {screen.kind === 'home' ? '← Indietro' : '← Tutte le tabelline'}
      </button>

      <div className={s.header}>
        <h2 className={s.title}>
          {screen.kind === 'table' ? <>Tabellina del <span className={s.n}>{screen.t}</span></>
            : screen.kind === 'mixed' ? <>Tutte <span className={s.n}>mischiate</span></>
            : 'Le tabelline'}
        </h2>
        {allowSettings && (
          <button className={s.gear} onClick={() => setShowPanel(p => !p)} aria-label="Impostazioni" aria-expanded={showPanel}>⚙️</button>
        )}
      </div>

      {allowSettings && showPanel && <TablesSettingsPanel onChange={handleSettingsChange} />}

      {screen.kind === 'home' && (
        <>
          <p className={s.hello}>Scegli una tabellina</p>
          <div className={s.tiles}>
            {visible.map(n => {
              const avail = phasesFor(n, settings.phases)
              const done  = ((progress[n] as TablesPhase[] | undefined) ?? []).filter(p => avail.includes(p)).length
              return (
                <button
                  key={n}
                  className={`${s.tile}${done === avail.length ? ` ${s.complete}` : ''}`}
                  onClick={() => setScreen({ kind: 'table', t: n })}
                  aria-label={`Tabellina del ${n}, ${done} fasi su ${avail.length}`}
                >
                  <span className={s.big}>{n}</span>
                  <span className={s.stars} aria-hidden="true">{'⭐'.repeat(done)}{'☆'.repeat(avail.length - done)}</span>
                </button>
              )
            })}
            {visible.length > 1 && (
              <button className={`${s.tile} ${s.mix}${progress.mix ? ` ${s.complete}` : ''}`} onClick={() => setScreen({ kind: 'mixed' })}>
                <span className={s.big}>🎲</span>
                <span>Tutte mischiate{progress.mix ? ' ⭐' : ''}</span>
              </button>
            )}
          </div>
        </>
      )}

      {screen.kind === 'table' && (
        <TablePlay key={screen.t} t={screen.t} settings={settings} progress={progress} say={say} onPhaseDone={markPhase} onHome={goHome} />
      )}

      {screen.kind === 'mixed' && (
        <Mixed settings={settings} say={say} onDone={() => updateProgress(p => ({ ...p, mix: true }))} onHome={goHome} />
      )}
    </>
  )
}
