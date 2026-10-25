'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { pickCelebration, type Celebration } from '@/lib/fun'
import { useSpeech, hush, wait } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import Tedo from './Tedo'
import s from './Compare.module.css'
import p from './NumbersSettingsPanel.module.css'

/* ── Impostazioni: fino a che numero, e quando mostrare la linea dei numeri ── */
export interface CompareSettings { max: number; line: 'help' | 'always' | 'never' }
const DEFAULTS: CompareSettings = { max: 10, line: 'help' }
const KEY = 'confronto_impostazioni'
function loadSettings(): CompareSettings { try { const r = localStorage.getItem(KEY); if (r) return { ...DEFAULTS, ...JSON.parse(r) } } catch (_) {} return DEFAULTS }
function saveSettings(v: CompareSettings) { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (_) {} }

type Rel = '<' | '>' | '='
type Tab = 'q' | 't' | 's'
const ROUNDS = 10
const FRUITS = ['🍎', '🍐', '🍓', '🍊', '⭐', '🎈', '🐟', '🌸']
const rnd = (n: number) => Math.floor(Math.random() * n)
const rel = (a: number, b: number): Rel => (a < b ? '<' : a > b ? '>' : '=')
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

/** Due numeri: circa una volta su cinque uguali; con i numeri grandi spesso vicini, così bisogna guardare bene */
function pair(max: number): [number, number] {
  if (Math.random() < 0.2) { const x = rnd(max + 1); return [x, x] }
  const a = rnd(max + 1)
  let b: number
  if (max > 20 && Math.random() < 0.6) { const d = 1 + rnd(Math.max(2, Math.round(max / 10))); b = Math.min(max, Math.max(0, a + (Math.random() < 0.5 ? -d : d))) }
  else b = rnd(max + 1)
  if (a === b) b = a === max ? a - 1 : a + 1
  return [a, b]
}

/** Tedo: la bocca si apre verso il numero più grande; per "uguali" sorride a bocca chiusa */
function TedoFace({ dir, size = 84 }: { dir: Rel | '?'; size?: number }) {
  const mouth = dir === '<' || dir === '>'
    ? <><path d="M58 50 L96 30 L96 70 Z" fill="#B84A62" /><path d="M58 50 L96 30 M58 50 L96 70" stroke="#1F2147" strokeWidth="4" strokeLinecap="round" /></>
    : dir === '='
      ? <path d="M30 58 Q50 72 70 58" stroke="#1F2147" strokeWidth="5" fill="none" strokeLinecap="round" />
      : <path d="M38 60 Q50 66 62 60" stroke="#1F2147" strokeWidth="5" fill="none" strokeLinecap="round" />
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <g transform={dir === '>' ? 'scale(-1,1) translate(-100,0)' : undefined}>
        <ellipse cx="46" cy="56" rx="40" ry="34" fill="#5CC27A" />
        <circle cx="30" cy="26" r="15" fill="#5CC27A" /><circle cx="58" cy="26" r="15" fill="#5CC27A" />
        <circle cx="30" cy="26" r="10" fill="#fff" /><circle cx="58" cy="26" r="10" fill="#fff" />
        <circle cx="32" cy="28" r="5" fill="#1F2147" /><circle cx="60" cy="28" r="5" fill="#1F2147" />
        <circle cx="18" cy="60" r="6" fill="#F59AA0" opacity=".6" />
        {mouth}
      </g>
    </svg>
  )
}

/** La linea dei numeri: i due numeri segnati; quello più a destra è il più grande */
function NumberLine({ a, b, max }: { a: number; b: number; max: number }) {
  const { t } = useT()
  const lo0 = Math.min(a, b), hi0 = Math.max(a, b)
  let step: number, lo: number, hi: number
  if (max <= 20) { lo = 0; hi = max; step = 1 }
  else {
    const span = Math.max(10, hi0 - lo0)
    step = span <= 20 ? 1 : span <= 100 ? 10 : 100
    lo = Math.max(0, Math.floor(lo0 / step) * step - step); hi = Math.min(max, Math.ceil(hi0 / step) * step + step)
    if ((hi - lo) / step > 22) { step *= 5; lo = Math.floor(lo / step) * step; hi = Math.ceil(hi / step) * step }
  }
  const W = 340, x0 = 14, x1 = W - 14, X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0)
  const n = Math.round((hi - lo) / step), every = n > 12 ? Math.ceil(n / 10) : 1
  const mark = (v: number, col: string) => {
    const x = X(v)
    return (
      <g key={`${v}-${col}`}>
        <circle cx={x} cy="62" r="8" fill={col} />
        <rect x={x - 24} y="6" width="48" height="30" rx="10" fill={col} />
        <text x={x} y="27" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff" fontFamily="system-ui,sans-serif">{v}</text>
        <line x1={x} y1="36" x2={x} y2="54" stroke={col} strokeWidth="3" />
      </g>
    )
  }
  return (
    <div className={s.nl}>
      <svg viewBox={`0 0 ${W} 104`} role="img" aria-label={`${lo} – ${hi}`}>
        <line x1={x0} y1="62" x2={x1 + 8} y2="62" stroke="var(--text)" strokeWidth="3" />
        <path d={`M${x1 + 8} 56 L${x1 + 18} 62 L${x1 + 8} 68 Z`} fill="var(--text)" />
        {Array.from({ length: n + 1 }, (_, i) => {
          const v = lo + i * step, x = X(v)
          return (
            <g key={i}>
              <line x1={x} y1="55" x2={x} y2="69" stroke="var(--text-soft)" strokeWidth="2" />
              {i % every === 0 && <text x={x} y="88" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--text-soft)" fontFamily="system-ui,sans-serif">{v}</text>}
            </g>
          )
        })}
        {a === b ? mark(a, 'var(--done)') : <>{mark(a, 'var(--a)')}{mark(b, 'var(--b)')}</>}
      </svg>
      <p>{a === b ? t.compare.lineSame : t.compare.lineMore(Math.max(a, b))}</p>
    </div>
  )
}

export default function CompareView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const { t } = useT()
  const [tab, setTab] = useState<Tab>('q')
  const [run, setRun] = useState(0)
  const [st, setSt] = useState<CompareSettings | null>(null)
  useEffect(() => { setSt(loadSettings()) }, [])
  const go = (x: Tab) => { hush(); setTab(x); setRun(r => r + 1) }
  return (
    <>
      <SectionTitle emoji="🐸" title={t.compare.title} sub={t.compare.sub} onBack={onBack} spot="confronta" />
      <nav className={s.tabs}>
        {(['q', 't', 's'] as Tab[]).map(x => (
          <button key={x} className={s.tab} aria-current={tab === x} onClick={() => go(x)}>{x === 'q' ? t.compare.tabQ : x === 't' ? t.compare.tabT : t.compare.tabS}</button>
        ))}
      </nav>
      {st && (
        <section className={s.card}>
          <Game key={`${tab}-${run}`} tab={tab} st={st} onAgain={() => setRun(r => r + 1)} />
          {allowSettings && <CompareSettingsPanel onChange={n => { setSt(n); setRun(r => r + 1) }} />}
        </section>
      )}
    </>
  )
}

function Game({ tab, st, onAgain }: { tab: Tab; st: CompareSettings; onAgain: () => void }) {
  const { t } = useT()
  const { speak, say } = useSpeech()
  const max = tab === 'q' ? Math.min(st.max, 10) : st.max     // con gli oggetti, al massimo 10
  const rounds = useMemo(() => Array.from({ length: ROUNDS }, () => pair(max)), [max])
  const fruit = useMemo(() => FRUITS[rnd(FRUITS.length)], [])
  const [qi, setQi] = useState(0)
  const [done, setDone] = useState(false)
  const [hint, setHint] = useState(false)
  const [line, setLine] = useState(st.line === 'always')
  const [counted, setCounted] = useState<[number[], number[]]>([[], []])
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const misses = useRef(0), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const q = rounds[qi]
  useEffect(() => { if (q) speak(tab === 'q' ? t.compare.askQ : t.compare.and(q[0], q[1])) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps

  if (celeb || !q) return (
    <>
      <Tedo gag={celeb?.gag ?? null} />
      <p className={s.winTitle}>{celeb?.phrase}</p>
      <p className={s.sub}>{t.compare.done}</p>
      <button className={`${s.btn} ${s.main}`} onClick={onAgain}>{t.compare.again}</button>
    </>
  )

  const [a, b] = q, r = rel(a, b)
  const win = async () => {
    setDone(true); setHint(false)
    await say(`${a} ${t.compare.rel[r]} ${b}`, 1200); await wait(400)
    if (!alive.current) return
    misses.current = 0; setDone(false); setLine(st.line === 'always'); setCounted([[], []])
    if (qi + 1 < ROUNDS) setQi(qi + 1); else { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }
  }
  const fail = (el: HTMLElement) => {
    wiggle(el); misses.current += 1
    if (misses.current >= 2) {
      setHint(true)
      if (st.line !== 'never') { setLine(true); speak(a === b ? t.compare.lineVoiceSame : t.compare.lineVoiceMore(Math.max(a, b))) }
    }
  }
  const tapObj = (side: 0 | 1, i: number) => {
    if (counted[side].includes(i)) return
    const next: [number[], number[]] = [[...counted[0]], [...counted[1]]]; next[side].push(i); setCounted(next); speak(String(next[side].length))
  }
  const objs = (n: number, side: 0 | 1) => (
    <div className={s.objs}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className={`${s.obj}${counted[side].includes(i) ? ` ${s.counted}` : ''}`} onClick={e => { e.stopPropagation(); tapObj(side, i) }}>{fruit}</span>
      ))}
    </div>
  )
  const pallini = (n: number) => (n <= 20 ? <div className={s.pal}>{Array.from({ length: n }, (_, i) => <i key={i} />)}</div> : null)
  const sideCls = (which: 'A' | 'B') => {
    const big = (which === 'A' && r === '>') || (which === 'B' && r === '<')
    return `${s.side} ${s[which]}${done && big ? ` ${s.eat}` : ''}${hint && tab === 'q' && big ? ` ${s.sideHint}` : ''}`
  }
  const A = tab === 'q'
    ? <button className={sideCls('A')} onClick={e => { if (!done) { if (r === '>') win(); else fail(e.currentTarget) } }}>{objs(a, 0)}</button>
    : <div className={sideCls('A')}><span className={s.n}>{a}</span>{tab === 't' && pallini(a)}</div>
  const B = tab === 'q'
    ? <button className={sideCls('B')} onClick={e => { if (!done) { if (r === '<') win(); else fail(e.currentTarget) } }}>{objs(b, 1)}</button>
    : <div className={sideCls('B')}><span className={s.n}>{b}</span>{tab === 't' && pallini(b)}</div>

  const opts: [Rel, React.ReactNode, string][] = tab === 't'
    ? [['>', <TedoFace key="l" dir=">" size={56} />, t.compare.eatLeft], ['=', <TedoFace key="e" dir="=" size={56} />, t.compare.same], ['<', <TedoFace key="r" dir="<" size={56} />, t.compare.eatRight]]
    : [['<', '<', t.compare.less], ['=', '=', t.compare.equal], ['>', '>', t.compare.more]]

  return (
    <>
      <div className={s.dots}>{rounds.map((_, i) => <span key={i} className={i < qi ? s.ok : i === qi ? s.on : ''} />)}</div>
      <p className={s.ask}>{tab === 'q' ? t.compare.askQ : tab === 't' ? t.compare.askT : t.compare.askS}</p>
      {tab === 'q' && <p className={s.sub}>{t.compare.subQ}</p>}
      <div className={s.duel}>
        {A}
        <div className={s.mid}><TedoFace dir={done ? r : '?'} /><div className={s.sign}>{done ? r : ''}</div></div>
        {B}
      </div>
      {tab === 'q'
        ? <button className={`${s.eqbtn}${hint && r === '=' ? ` ${s.sideHint}` : ''}`} onClick={e => { if (!done) { if (r === '=') win(); else fail(e.currentTarget) } }}>{t.compare.equalBtn}</button>
        : (
          <div className={s.choices}>
            {opts.map(([v, icon, w]) => (
              <button key={v} className={`${s.ch}${done && v === r ? ` ${s.chRight}` : hint && v === r ? ` ${s.chHint}` : ''}`} onClick={e => { if (!done) { if (v === r) win(); else fail(e.currentTarget) } }}>
                <span className={s.chS}>{icon}</span><span className={s.chW}>{w}</span>
              </button>
            ))}
          </div>
        )}
      <div className={s.sentence}>{done && <><span className={s.cA}>{a}</span> {t.compare.rel[r]} <span className={s.cB}>{b}</span></>}</div>
      {line && <NumberLine a={a} b={b} max={max} />}
    </>
  )
}

/** Impostazioni (area Genitore; nella demo dentro la sezione) */
export function CompareSettingsPanel({ onChange }: { onChange?: (v: CompareSettings) => void }) {
  const { t } = useT()
  const [st, setSt] = useState<CompareSettings>(DEFAULTS)
  const [saved, setSaved] = useState(false)
  useEffect(() => { setSt(loadSettings()) }, [])
  const set = (n: CompareSettings) => { setSt(n); saveSettings(n); setSaved(true); onChange?.(n) }
  return (
    <div className={p.panel} style={{ width: '100%', textAlign: 'left' }}>
      <div className={p.group}>
        <span className={p.label}>{t.compare.setMax}</span>
        <div className={p.chips}>{[10, 20, 100, 1000].map(m => <button key={m} className={p.chip} aria-pressed={st.max === m} onClick={() => set({ ...st, max: m })}>{m}</button>)}</div>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.compare.setLine}</span>
        <div className={p.chips}>
          {([['help', t.compare.lineHelp], ['always', t.compare.lineAlways], ['never', t.compare.lineNever]] as [CompareSettings['line'], string][]).map(([v, l]) => (
            <button key={v} className={p.chip} aria-pressed={st.line === v} onClick={() => set({ ...st, line: v })}>{l}</button>
          ))}
        </div>
      </div>
      {saved && <div className={p.saved}>{t.common.saved}</div>}
    </div>
  )
}
