'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { autoStar } from '@/lib/stars'
import { useSpeech, hush, wait, softTone } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import s from './PrevNext.module.css'
import p from './NumbersSettingsPanel.module.css'

/* ── Impostazioni: i numeri (fino a 1000), cosa chiedere, il passo, i numeri difficili, la linea ── */
type Dir = 'prev' | 'next'
type HelpWhen = 'always' | 'help' | 'never'      // sempre, solo dopo 2 errori, mai
export interface PNSettings { min: number; max: number; ask: Dir | 'both'; step: 1 | 10 | 100; hard: boolean; line: HelpWhen; blocks: HelpWhen }
const DEFAULTS: PNSettings = { min: 0, max: 100, ask: 'both', step: 1, hard: true, line: 'always', blocks: 'help' }
const KEY = 'precsucc_impostazioni'
function loadSettings(): PNSettings {
  try {
    const r = localStorage.getItem(KEY)
    if (r) {
      const v = JSON.parse(r)
      // la linea della decina è nuova: chi aveva le impostazioni di prima la trova accesa
      if (!v.v || v.v < 2) { v.line = 'always'; v.v = 2; localStorage.setItem(KEY, JSON.stringify(v)) }
      return { ...DEFAULTS, ...v }
    }
  } catch (_) {}
  return DEFAULTS
}
function saveSettings(v: PNSettings) { try { localStorage.setItem(KEY, JSON.stringify({ ...v, v: 2 })) } catch (_) {} }

const ROUNDS = 10
const rnd = (n: number) => Math.floor(Math.random() * n)
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]] } return b }
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

/** C'è un cambio di decina o centinaio? (39 → 40, 400 → 399) */
const isCarry = (n: number, dir: Dir, st: number) => { const d = Math.floor(n / st) % 10; return dir === 'next' ? d === 9 : d === 0 }
/** Un numero da chiedere: lontano dai bordi; con "numeri difficili" metà delle volte un cambio di decina */
function pickN(S: PNSettings, dir: Dir): number {
  const st = S.step, lo = S.min + st, hi = S.max - st
  if (hi < lo) return Math.max(0, Math.round((S.min + S.max) / 2))
  if (S.hard && Math.random() < 0.5) {
    const c: number[] = []
    for (let n = lo; n <= hi; n++) if (isCarry(n, dir, st)) c.push(n)
    if (c.length) return c[rnd(c.length)]
  }
  return lo + rnd(hi - lo + 1)
}
/** Le risposte sbagliate tipiche: senza riporto (39 → 30, 40 → 49), il numero stesso, un passo in più */
function distractors(n: number, right: number, dir: Dir, st: number): number[] {
  const out = new Set<number>()
  const noCarry = dir === 'next' ? n - (Math.floor(n / st) % 10) * st : n + 9 * st
  ;[noCarry, n, dir === 'next' ? right + st : right - st, right + 10 * st, right - 10 * st].forEach(x => { if (x !== right && x >= 0 && x <= 1000) out.add(x) })
  return shuffle([...out]).slice(0, 2)
}

/** Un numero con le cifre colorate come in Scomponi: centinaia verdi, decine rosse, unità blu */
function Num({ n }: { n: number }) {
  const str = String(n), cls = [s.u, s.da, s.h, s.h]
  return <span className={s.num}>{str.split('').map((d, i) => <span key={i} className={cls[str.length - 1 - i]}>{d}</span>)}</span>
}

/** La linea dei numeri intorno a n, con Tedo (facoltativo) e i numeri segnati */
function NumberLine({ n, step, marks, frogAt, caption }: { n: number; step: number; marks: [number, string][]; frogAt?: number; caption?: React.ReactNode }) {
  const lo = Math.max(0, n - 5 * step), hi = lo + 10 * step
  const W = 340, x0 = 16, x1 = W - 16, X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0)
  return (
    <div className={s.nl}>
      <svg viewBox={`0 0 ${W} 112`} role="img" aria-label={`${lo} – ${hi}`}>
        <line x1={x0} y1="70" x2={x1 + 8} y2="70" stroke="var(--text)" strokeWidth="3" />
        <path d={`M${x1 + 8} 64 L${x1 + 18} 70 L${x1 + 8} 76 Z`} fill="var(--text)" />
        {Array.from({ length: 11 }, (_, i) => {
          const v = lo + i * step, x = X(v)
          return <g key={i}><line x1={x} y1="63" x2={x} y2="77" stroke="var(--text-soft)" strokeWidth="2" /><text x={x} y="98" textAnchor="middle" fontSize={hi > 999 ? 10 : 12} fontWeight="800" fill="var(--text-soft)" fontFamily="system-ui,sans-serif">{v}</text></g>
        })}
        {marks.map(([v, col]) => <circle key={`${v}${col}`} cx={X(v)} cy="70" r="8" fill={col} />)}
        {frogAt !== undefined && (
          <g className={s.frog} style={{ transform: `translate(${X(frogAt)}px,0)` }}>
            <g transform="translate(-22 14) scale(.44)">
              <ellipse cx="50" cy="60" rx="40" ry="30" fill="#5CC27A" /><circle cx="32" cy="30" r="14" fill="#5CC27A" /><circle cx="68" cy="30" r="14" fill="#5CC27A" />
              <circle cx="32" cy="30" r="9" fill="#fff" /><circle cx="68" cy="30" r="9" fill="#fff" /><circle cx="33" cy="31" r="4.5" fill="#1F2147" /><circle cx="67" cy="31" r="4.5" fill="#1F2147" />
              <path d="M36 62 Q50 74 64 62" stroke="#1F2147" strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>
          </g>
        )}
      </svg>
      {caption && <p>{caption}</p>}
    </div>
  )
}

/**
 * La linea della decina, sopra il trenino: contiene sempre sia il numero sia la risposta.
 * 485 → da 480 a 490; precedente di 490 → da 480 a 490 (489 sta nella decina prima).
 * Con il passo di 10 mostra il centinaio, con il passo di 100 il migliaio.
 */
function DecadeLine({ n, r, step, revealed }: { n: number; r: number; step: number; revealed: boolean }) {
  const span = step * 10, lo = Math.floor(Math.min(n, r) / span) * span, hi = lo + span
  const W = 340, x0 = 18, x1 = W - 18, X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0)
  const xn = X(n), xr = X(r), mid = (xn + xr) / 2, col = revealed ? 'var(--done)' : '#E0A800'
  return (
    <div className={s.nl}>
      <svg viewBox={`0 0 ${W} 118`} role="img" aria-label={`${lo} – ${hi}`}>
        <line x1={x0} y1="76" x2={x1} y2="76" stroke="var(--text)" strokeWidth="3" />
        {Array.from({ length: 11 }, (_, i) => {
          const v = lo + i * step, x = X(v), end = i === 0 || i === 10
          return (
            <g key={i}>
              <line x1={x} y1={end ? 64 : 69} x2={x} y2={end ? 88 : 83} stroke={end ? 'var(--da)' : 'var(--text-soft)'} strokeWidth={end ? 4 : 2} />
              <text x={x} y="106" textAnchor="middle" fontSize={end ? 13 : v > 999 ? 9 : 10.5} fontWeight={end ? 900 : 700} fill={end ? 'var(--da)' : 'var(--text-soft)'} fontFamily="system-ui,sans-serif">{v}</text>
            </g>
          )
        })}
        <path className={s.hop} d={`M${xn} 66 Q${mid} 30 ${xr} 66`} fill="none" stroke="var(--text-soft)" strokeWidth="3" />
        <circle cx={xn} cy="76" r="9" fill="var(--train)" />
        <rect x={xn - 24} y="4" width="48" height="26" rx="8" fill="var(--train)" />
        <text x={xn} y="22" textAnchor="middle" fontSize="15" fontWeight="900" fill="#fff" fontFamily="system-ui,sans-serif">{n}</text>
        <circle cx={xr} cy="76" r="9" fill={col} />
        <rect x={xr - 24} y="36" width="48" height="24" rx="8" fill={col} />
        <text x={xr} y="53" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff" fontFamily="system-ui,sans-serif">{revealed ? r : '?'}</text>
      </svg>
    </div>
  )
}

/**
 * L'aiuto con i blocchi: il bambino fa con le mani il cambio di decina.
 * Successivo: aggiunge un cubetto (o una barretta con il passo di 10); se diventano dieci, li trasforma.
 * Precedente: toglie un cubetto; se non ce ne sono, prima rompe una barretta (o una piastra).
 * Le cifre seguono i blocchi, così alla fine il numero giusto si legge nella tabella.
 */
function BlocksHelp({ n, dir, step }: { n: number; dir: Dir; step: number }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const B = t.prevNext.blk
  const pos = step === 1 ? 0 : 1
  const [c, setC] = useState<number[]>([n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100)])
  const [acted, setActed] = useState(false)
  const [broke, setBroke] = useState(false)
  const [fresh, setFresh] = useState<{ p: number; k: number } | null>(null)
  // la prossima mossa da fare, con il suo messaggio
  let msg = B.done, btn = '', act: (() => void) | null = null
  if (dir === 'next') {
    if (!acted) { msg = B.addMsg(pos); btn = B.add(pos); act = () => { const x = [...c]; x[pos]++; setC(x); setActed(true); setFresh({ p: pos, k: 1 }) } }
    else for (const q of [pos, pos + 1]) if (c[q] >= 10) { msg = B.tradeMsg(q); btn = B.trade(q); act = () => { const x = [...c]; x[q] -= 10; x[q + 1]++; setC(x); setFresh({ p: q + 1, k: 1 }) }; break }
  } else if (!acted) {
    if (c[pos] > 0) { msg = broke ? B.broken(pos) : B.removeMsg(pos); btn = B.remove(pos); act = () => { const x = [...c]; x[pos]--; setC(x); setActed(true); setFresh(null) } }
    else if (c[pos + 1] > 0) { msg = B.breakMsg(pos); btn = B.breakBtn(pos); act = () => { const x = [...c]; x[pos + 1]--; x[pos] += 10; setC(x); setBroke(true); setFresh({ p: pos, k: 10 }) } }
    else { msg = pos === 0 ? B.breakPlateMsg : B.breakMsg(pos + 1); btn = B.breakBtn(pos + 1); act = () => { const x = [...c]; x[pos + 2]--; x[pos + 1] += 10; setC(x); setFresh({ p: pos + 1, k: 10 }) } }
  }
  useEffect(() => { speak(msg) }, [msg]) // eslint-disable-line react-hooks/exhaustive-deps
  const done = !act
  return (
    <div className={s.blk}>
      <div className={s.pv}>
        {[2, 1, 0].map(q => (
          <div key={q} className={`${s.col} ${[s.cu, s.cda, s.ch3][q]}${!done && (q === pos || c[q] >= 10) ? ` ${s.colFocus}` : ''}`}>
            <span className={s.colLab}>{B.cols[q]}</span>
            <div className={`${s.digit}${done ? ` ${s.digitOk}` : ''}`}>{c[q] > 9 ? '?' : c[q]}</div>
            <div className={`${s.blocks}${q === 0 ? ` ${s.blocksU}` : ''}`}>
              {Array.from({ length: c[q] }, (_, i) => (
                <span key={i} className={`${[s.cube, s.bar, s.plate][q]}${c[q] >= 10 ? ` ${s.glow}` : ''}${fresh && fresh.p === q && i >= c[q] - fresh.k ? ` ${s.fresh}` : ''}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={s.blkMsg}>{msg}</div>
      {act && <button className={`${s.btn} ${s.blkBtn}`} onClick={act}>{btn}</button>}
    </div>
  )
}

type Tab = 0 | 1 | 2
export default function PrevNextView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const { t } = useT()
  const [tab, setTab] = useState<Tab>(0)
  const [run, setRun] = useState(0)
  const [st, setSt] = useState<PNSettings | null>(null)
  useEffect(() => { setSt(loadSettings()) }, [])
  const go = (x: Tab) => { hush(); setTab(x); setRun(r => r + 1) }
  return (
    <>
      <SectionTitle emoji="🚂" title={t.prevNext.title} sub={t.prevNext.sub} onBack={onBack} spot="precsucc" />
      <nav className={s.tabs}>{t.prevNext.tabs.map((l: string, k: number) => <button key={k} className={s.tab} aria-current={tab === k} onClick={() => go(k as Tab)}>{l}</button>)}</nav>
      {st && (
        <section className={s.card}>
          {tab === 0 ? <LineTab key={run} S={st} /> : <TrainGame key={`${tab}-${run}`} S={st} pad={tab === 2} onAgain={() => setRun(r => r + 1)} />}
          {allowSettings && <PrevNextSettingsPanel onChange={n => { setSt(n); setRun(r => r + 1) }} />}
        </section>
      )}
    </>
  )
}

/* 🐸 Scopri sulla linea: Tedo salta di un passo avanti o indietro */
function LineTab({ S }: { S: PNSettings }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const [n, setN] = useState(() => pickN(S, 'next'))
  const [at, setAt] = useState(n)
  const [last, setLast] = useState<Dir | null>(null)
  useEffect(() => { speak(String(n)) }, [n]) // eslint-disable-line react-hooks/exhaustive-deps
  const move = (dir: Dir) => {
    const target = n + (dir === 'next' ? S.step : -S.step)
    if (target < 0 || target > 1000) return
    setAt(n); setLast(dir)
    setTimeout(() => setAt(target), 120)                // prima torna sul numero, poi salta: il salto si vede sempre
    speak(t.prevNext.sentence(dir, S.step, n, target))
  }
  const other = () => { const m = pickN(S, Math.random() < 0.5 ? 'next' : 'prev'); setN(m); setAt(m); setLast(null) }
  const target = last ? n + (last === 'next' ? S.step : -S.step) : null
  return (
    <>
      <p className={s.sub}>{t.prevNext.lineSub}</p>
      <div className={s.big}><Num n={at} /></div>
      <NumberLine n={n} step={S.step} marks={[[n, 'var(--train)']]} frogAt={at} />
      <div className={s.sentence}>{last && target !== null ? t.prevNext.sentence(last, S.step, n, target) : ''}</div>
      <div className={s.row}>
        <button className={s.btn} onClick={() => move('prev')}>{t.prevNext.back}</button>
        <button className={s.btn} onClick={() => move('next')}>{t.prevNext.fwd}</button>
      </div>
      <button className={`${s.btn} ${s.main}`} onClick={other}>{t.prevNext.another}</button>
    </>
  )
}

/* 🚂 Completa il trenino / ⌨️ Scrivilo tu */
function TrainGame({ S, pad, onAgain }: { S: PNSettings; pad: boolean; onAgain: () => void }) {
  const { t } = useT()
  const { speak, say } = useSpeech()
  const qs = useMemo(() => Array.from({ length: ROUNDS }, () => {
    const d: Dir = S.ask === 'both' ? (Math.random() < 0.5 ? 'prev' : 'next') : S.ask
    return { n: pickN(S, d), dirs: (S.ask === 'both' ? ['prev', 'next'] : [S.ask]) as Dir[] }
  }), [S])
  const [qi, setQi] = useState(0)
  const [di, setDi] = useState(0)
  const [filled, setFilled] = useState<Partial<Record<Dir, number>>>({})
  const [done, setDone] = useState(false)
  const [hint, setHint] = useState(false)
  const [typed, setTyped] = useState('')
  const [party, setParty] = useState(false)
  const misses = useRef(0), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const q = qs[qi]
  const dir = q?.dirs[di]
  const right = q && dir ? (dir === 'next' ? q.n + S.step : q.n - S.step) : 0
  const opts = useMemo(() => (q && dir ? shuffle([right, ...distractors(q.n, right, dir, S.step)]) : []), [qi, di]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (q && dir) speak(`${t.prevNext.ask(dir, S.step).replace('?', '')} ${q.n}?`) }, [qi, di]) // eslint-disable-line react-hooks/exhaustive-deps

  if (party || !q || !dir) return <Party onAgain={onAgain} />

  const win = async () => {
    setDone(true); setHint(false); setFilled(f => ({ ...f, [dir]: right }))
    await say(t.prevNext.sentence(dir, S.step, q.n, right), 1000); await wait(300)
    if (!alive.current) return
    misses.current = 0; setDone(false); setTyped('')
    if (di + 1 < q.dirs.length) setDi(di + 1)
    else if (qi + 1 < ROUNDS) { setQi(qi + 1); setDi(0); setFilled({}) }
    else { autoStar(); setParty(true) }
  }
  const tipText = t.prevNext.carry(dir, S.step, q.n, right, isCarry(q.n, dir, S.step))
  const fail = (el: HTMLElement) => { wiggle(el); misses.current += 1; if (misses.current >= 2) { setHint(true); speak(tipText) } }
  const wagon = (k: Dir, lab: string) => {
    const asked = q.dirs.includes(k), val = filled[k]
    const v = k === 'prev' ? q.n - S.step : q.n + S.step
    const cls = `${s.wagon}${val !== undefined ? ` ${s.wagonOk}` : asked ? ` ${s.hole}` : ''}${dir === k && !done ? ` ${s.focus}` : ''}`
    return <div className={cls}><span className={s.lab}>{lab}</span>{val !== undefined ? <Num n={val} /> : asked ? '?' : <Num n={v} />}</div>
  }
  const press = (k: string, el: HTMLElement) => {
    if (done) return
    if (k === '⌫') { setTyped(x => x.slice(0, -1)); return }
    if (k === 'OK') { if (!typed) return; if (+typed === right) win(); else { fail(el); setTyped('') } return }
    if (typed.length < 4) { const nx = typed + k; setTyped(nx); speak(nx) }
  }
  return (
    <>
      <div className={s.dots}>{qs.map((_, i) => <span key={i} className={i < qi ? s.ok : i === qi ? s.on : ''} />)}</div>
      <p className={s.ask}>{t.prevNext.ask(dir, S.step)}</p>
      {(S.line === 'always' || (hint && S.line !== 'never')) && <DecadeLine n={q.n} r={right} step={S.step} revealed={done} />}
      <div style={{ width: '100%' }}>
        <div className={s.train}>
          {wagon('prev', t.prevNext.prevW)}<span className={s.coupler} />
          <div className={`${s.wagon} ${s.mid}`}><span className={s.lab}>{t.prevNext.labNum}</span><Num n={q.n} /></div>
          <span className={s.coupler} />{wagon('next', t.prevNext.nextW)}
          <svg className={s.engine} viewBox="0 0 86 110" aria-hidden="true"><rect x="4" y="30" width="56" height="62" rx="10" fill="var(--train)" /><rect x="40" y="10" width="20" height="26" rx="4" fill="var(--train)" /><rect x="14" y="40" width="22" height="20" rx="4" fill="#E3F0FC" /><path d="M60 52 L82 66 V92 H60 Z" fill="var(--train)" /><circle cx="20" cy="96" r="12" fill="var(--text)" /><circle cx="52" cy="96" r="12" fill="var(--text)" /></svg>
        </div>
        <div className={s.rail} />
      </div>
      <div className={s.dir}>{t.prevNext.trainDir}</div>
      {(S.blocks === 'always' || (hint && S.blocks === 'help')) && S.step < 100 && Math.max(q.n, right) < 1000 && Math.min(q.n, right) >= 0 && (
        <BlocksHelp key={`${qi}-${di}`} n={q.n} dir={dir} step={S.step} />
      )}
      {!pad ? (
        <div className={s.choices}>
          {opts.map(o => <button key={o} className={`${s.ch}${done && o === right ? ` ${s.chRight}` : hint && o === right ? ` ${s.chHint}` : ''}`} onClick={e => { if (done) return; if (o === right) win(); else fail(e.currentTarget) }}><Num n={o} /></button>)}
        </div>
      ) : (
        <>
          <div className={s.typed}>{typed ? <Num n={+typed} /> : ''}</div>
          <div className={s.pad}>{['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].map(k => <button key={k} className={k === 'OK' ? s.ok : ''} onClick={e => press(k, e.currentTarget)}>{k}</button>)}</div>
        </>
      )}
      {hint && <div className={s.tip}>💡 {tipText}</div>}
    </>
  )
}

/* La festa: Tedo saluta dal trenino che passa, con il fumo e il fischio */
function Party({ onAgain }: { onAgain: () => void }) {
  const { t } = useT()
  const { speak } = useSpeech()
  useEffect(() => {
    softTone(523, 523, 0.35, 0.08); setTimeout(() => softTone(659, 659, 0.3, 0.08), 450)   // tu-tuu!
    speak(t.prevNext.toot)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const wagon = (x: number, c: string) => (
    <g transform={`translate(${x} 70)`}>
      <rect width="74" height="52" rx="10" fill={c} /><rect x="10" y="10" width="54" height="16" rx="5" fill="#FFFFFF" opacity=".55" />
      <circle className={s.wheel} cx="18" cy="58" r="12" fill="#1F2147" /><circle className={s.wheel} cx="56" cy="58" r="12" fill="#1F2147" />
      <circle cx="18" cy="58" r="4" fill="#C9CED6" /><circle cx="56" cy="58" r="4" fill="#C9CED6" /><rect x="-8" y="38" width="10" height="6" rx="3" fill="#1F2147" />
    </g>
  )
  return (
    <>
      <div className={s.party}>
        <div className={s.ties} /><div className={s.track} />
        <div className={s.ptrain}>
          {[0, 0.55, 1.1].map(d => <div key={d} className={s.puff} style={{ animationDelay: `${d}s` }} />)}
          <svg className={s.bob} viewBox="0 0 330 150" width="290" height="132" aria-hidden="true">
            {wagon(0, '#F08C00')}{wagon(86, '#7048E8')}{wagon(172, '#E03131')}
            <g transform="translate(186 30)">
              <g className={s.arm}><path d="M52 30 Q66 14 74 4" stroke="#5CC27A" strokeWidth="9" fill="none" strokeLinecap="round" /><circle cx="75" cy="3" r="6" fill="#3E9C5B" /></g>
              <ellipse cx="36" cy="34" rx="30" ry="22" fill="#5CC27A" /><circle cx="22" cy="14" r="11" fill="#5CC27A" /><circle cx="48" cy="14" r="11" fill="#5CC27A" />
              <circle cx="22" cy="14" r="7" fill="#fff" /><circle cx="48" cy="14" r="7" fill="#fff" /><circle cx="24" cy="15" r="3.5" fill="#1F2147" /><circle cx="50" cy="15" r="3.5" fill="#1F2147" />
              <path d="M24 38 Q36 50 48 38 Z" fill="#1F2147" /><circle cx="14" cy="34" r="4" fill="#F59AA0" opacity=".7" /><circle cx="58" cy="34" r="4" fill="#F59AA0" opacity=".7" />
            </g>
            <g transform="translate(246 40)">
              <rect x="0" y="30" width="62" height="52" rx="10" fill="var(--train)" /><rect x="6" y="0" width="34" height="40" rx="6" fill="var(--train)" /><rect x="12" y="8" width="22" height="18" rx="4" fill="#E3F0FC" />
              <rect x="44" y="10" width="12" height="22" rx="3" fill="#1F2147" /><path d="M62 52 L82 66 V82 H62 Z" fill="var(--train)" />
              <circle className={s.wheel} cx="18" cy="88" r="14" fill="#1F2147" /><circle className={s.wheel} cx="52" cy="88" r="14" fill="#1F2147" />
              <circle cx="18" cy="88" r="5" fill="#C9CED6" /><circle cx="52" cy="88" r="5" fill="#C9CED6" />
            </g>
          </svg>
        </div>
      </div>
      <p className={s.winTitle}>{t.prevNext.fantastic}</p>
      <p className={s.sub}>{t.prevNext.done}</p>
      <button className={`${s.btn} ${s.main}`} onClick={onAgain}>{t.prevNext.again}</button>
    </>
  )
}

/** Impostazioni (area Genitore; nella demo dentro la sezione) */
export function PrevNextSettingsPanel({ onChange }: { onChange?: (v: PNSettings) => void }) {
  const { t } = useT()
  const [st, setSt] = useState<PNSettings>(DEFAULTS)
  const [saved, setSaved] = useState(false)
  const [from, setFrom] = useState('0'), [to, setTo] = useState('100')
  useEffect(() => { const v = loadSettings(); setSt(v); setFrom(String(v.min)); setTo(String(v.max)) }, [])
  const set = (n: PNSettings) => { setSt(n); saveSettings(n); setSaved(true); setFrom(String(n.min)); setTo(String(n.max)); onChange?.(n) }
  // intervallo scritto a mano: tra 0 e 1000, con almeno due passi di spazio
  const custom = () => {
    const a = Math.max(0, Math.min(999, parseInt(from) || 0))
    let b = Math.max(1, Math.min(1000, parseInt(to) || 0))
    if (b - a < 2 * st.step) b = Math.min(1000, a + 2 * st.step)
    set({ ...st, min: a, max: b })
  }
  const input: React.CSSProperties = { width: 90, minHeight: 44, borderRadius: 12, border: '2px solid #D6DBF2', background: 'var(--ground)', color: 'var(--text)', fontSize: 17, fontWeight: 800, padding: '0 10px', fontFamily: 'inherit' }
  return (
    <div className={p.panel} style={{ width: '100%', textAlign: 'left' }}>
      <div className={p.group}>
        <span className={p.label}>{t.prevNext.setRange}</span>
        <div className={p.chips}>{[10, 20, 100, 1000].map(m => <button key={m} className={p.chip} aria-pressed={st.min === 0 && st.max === m} onClick={() => set({ ...st, min: 0, max: m })}>0–{m}</button>)}</div>
        <div className={p.chips} style={{ alignItems: 'center' }}>
          <span className={p.label}>{t.prevNext.setFrom}</span>
          <input style={input} type="number" inputMode="numeric" min={0} max={999} value={from} onChange={e => setFrom(e.target.value)} onBlur={custom} />
          <span className={p.label}>{t.prevNext.setTo}</span>
          <input style={input} type="number" inputMode="numeric" min={1} max={1000} value={to} onChange={e => setTo(e.target.value)} onBlur={custom} />
        </div>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.prevNext.setAsk}</span>
        <div className={p.chips}>{([['prev', t.prevNext.askPrev], ['next', t.prevNext.askNext], ['both', t.prevNext.askBoth]] as [PNSettings['ask'], string][]).map(([v, l]) => <button key={v} className={p.chip} aria-pressed={st.ask === v} onClick={() => set({ ...st, ask: v })}>{l}</button>)}</div>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.prevNext.setStep}</span>
        <div className={p.chips}>{([1, 10, 100] as const).map((v, i) => <button key={v} className={p.chip} aria-pressed={st.step === v} onClick={() => set({ ...st, step: v, max: Math.max(st.max, st.min + 2 * v) })}>{t.prevNext.steps[i]}</button>)}</div>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.prevNext.setHard}</span>
        <div className={p.chips}>{([[true, t.prevNext.hardOn], [false, t.prevNext.hardOff]] as [boolean, string][]).map(([v, l]) => <button key={l} className={p.chip} aria-pressed={st.hard === v} onClick={() => set({ ...st, hard: v })}>{l}</button>)}</div>
      </div>
      <div className={p.group}>
        <span className={p.label} style={{ fontWeight: 900, color: 'var(--text)' }}>{t.prevNext.helps}</span>
        <span className={p.label} style={{ fontSize: 13 }}>{t.prevNext.helpsHint}</span>
      </div>
      {([['line', t.prevNext.setDecade], ['blocks', t.prevNext.setBlocks]] as ['line' | 'blocks', string][]).map(([k, label]) => (
        <div key={k} className={p.group}>
          <span className={p.label}>{label}</span>
          <div className={p.chips}>{([['always', t.prevNext.lineAlways], ['help', t.prevNext.lineHelp], ['never', t.prevNext.helpNo]] as [HelpWhen, string][]).map(([v, l]) => (
            <button key={v} className={p.chip} aria-pressed={st[k] === v} onClick={() => set({ ...st, [k]: v })}>{l}</button>
          ))}</div>
        </div>
      ))}
      {saved && <div className={p.saved}>{t.common.saved}</div>}
    </div>
  )
}
