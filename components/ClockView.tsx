'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { timeWords, digital } from '@/lib/timeWords'
import { pickCelebration, type Celebration } from '@/lib/fun'
import { useSpeech, hush, wait } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import Tedo from './Tedo'
import s from './Daily.module.css'

const LEVELS: Record<string, number[]> = { intere: [0], mezze: [0, 30], quarti: [0, 15, 30, 45], cinque: Array.from({ length: 12 }, (_, i) => i * 5) }
const QUESTIONS = 6
const rnd = (n: number) => Math.floor(Math.random() * n)
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]] } return b }
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

/** L'orologio: lancetta corta blu per le ore, lunga arancione per i minuti, minuti scritti attorno */
function Clock({ h, m }: { h: number; m: number }) {
  const cx = 150, cy = 150
  const pt = (deg: number, r: number) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)]
  const [hx, hy] = pt(((h % 12) + m / 60) * 30, 62)
  const [mx, my] = pt(m * 6, 108)
  return (
    <svg className={s.clock} viewBox="-14 -14 328 328" role="img" aria-label={digital(h, m)}>
      <circle cx="150" cy="150" r="142" fill="#FFFFFF" stroke="#1F2147" strokeWidth="8" />
      {Array.from({ length: 60 }, (_, i) => { const [x1, y1] = pt(i * 6, i % 5 === 0 ? 122 : 128), [x2, y2] = pt(i * 6, 134)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 5 === 0 ? '#1F2147' : '#B8C0E6'} strokeWidth={i % 5 === 0 ? 4 : 2} /> })}
      {Array.from({ length: 12 }, (_, i) => { const [x, y] = pt((i + 1) * 30, 100)
        return <text key={i} x={x} y={y + 11} textAnchor="middle" fontSize="30" fontWeight="900" fill="#1F2147" fontFamily="system-ui,sans-serif">{i + 1}</text> })}
      {Array.from({ length: 12 }, (_, i) => { const [x, y] = pt(i * 30, 152)
        return <text key={i} x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill="#F08C00" fontFamily="system-ui,sans-serif">{String(i * 5).padStart(2, '0')}</text> })}
      <line x1="150" y1="150" x2={hx} y2={hy} stroke="#1C7ED6" strokeWidth="12" strokeLinecap="round" />
      <line x1="150" y1="150" x2={mx} y2={my} stroke="#F08C00" strokeWidth="7" strokeLinecap="round" />
      <circle cx="150" cy="150" r="9" fill="#1F2147" />
    </svg>
  )
}

export default function ClockView({ onBack }: { onBack: () => void }) {
  const { t, lang } = useT()
  const [tab, setTab] = useState<'learn' | 'quiz'>('learn')
  const [level, setLevel] = useState('intere')
  const [run, setRun] = useState(0)
  const reset = (fn: () => void) => { hush(); fn(); setRun(r => r + 1) }
  return (
    <>
      <SectionTitle emoji="🕐" title={t.daily.clockTitle} sub={t.daily.clockSub} onBack={onBack} spot="orologio" />
      <section className={s.card}>
        <div className={s.tabs}>
          <button className={s.tab} aria-current={tab === 'learn'} onClick={() => reset(() => setTab('learn'))}>{t.clock.tabLearn}</button>
          <button className={s.tab} aria-current={tab === 'quiz'} onClick={() => reset(() => setTab('quiz'))}>{t.clock.tabQuiz}</button>
        </div>
        <div className={s.chips}>
          {Object.keys(LEVELS).map(k => <button key={k} className={s.chip} aria-pressed={k === level} onClick={() => reset(() => setLevel(k))}>{t.clock.levels[k]}</button>)}
        </div>
        {tab === 'learn' ? <Learn key={`l${run}`} mins={LEVELS[level]} lang={lang} /> : <Quiz key={`q${run}`} mins={LEVELS[level]} lang={lang} onAgain={() => reset(() => {})} />}
      </section>
    </>
  )
}

/* Scopri: le lancette si spostano con Avanti/Indietro e la voce legge l'ora */
function Learn({ mins, lang }: { mins: number[]; lang: 'it' | 'fr' }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const step = mins.length > 1 ? mins[1] - mins[0] : 60
  const [time, setTime] = useState(3 * 60)
  const h = Math.floor(time / 60), m = time % 60
  const words = timeWords(h, m, lang)
  useEffect(() => { speak(words) }, [words]) // eslint-disable-line react-hooks/exhaustive-deps
  const move = (d: number) => setTime(x => (x + d * step + 720) % 720)
  return (
    <>
      <Clock h={h} m={m} />
      <div className={s.legend}><span className={s.cHour}>{t.clock.legendHour}</span><span className={s.cMin}>{t.clock.legendMin}</span></div>
      <div className={s.timeword}>{words}</div>
      <div className={s.digital}>{digital(h, m)}</div>
      <div className={s.row}>
        <button className={s.btn} onClick={() => move(-1)}>{t.clock.back}</button>
        <button className={`${s.btn} ${s.main}`} onClick={() => move(1)}>{t.clock.forward}</button>
      </div>
    </>
  )
}

/* Che ore sono?: tre risposte; l'aiuto guida prima la lancetta corta, poi quella lunga */
function Quiz({ mins, lang, onAgain }: { mins: number[]; lang: 'it' | 'fr'; onAgain: () => void }) {
  const { t } = useT()
  const { speak, say } = useSpeech()
  const qs = useMemo(() => Array.from({ length: QUESTIONS }, () => ({ h: 1 + rnd(12), m: mins[rnd(mins.length)] })), [mins])
  const [qi, setQi] = useState(0)
  const [hint, setHint] = useState(false)
  const [done, setDone] = useState(false)
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const misses = useRef(0)
  const alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const q = qs[qi]
  const right = q ? digital(q.h, q.m) : ''
  const opts = useMemo(() => {
    if (!q) return []
    const o = new Set([right])
    while (o.size < 3) { const hh = ((q.h - 1 + [-1, 1, 2, -2, 0][rnd(5)]) + 12) % 12 + 1; o.add(digital(hh, mins[rnd(mins.length)])) }
    return shuffle([...o])
  }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (q) speak(t.clock.ask) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps

  if (celeb || !q) return (
    <>
      <Tedo gag={celeb?.gag ?? null} />
      <p className={s.winTitle}>{celeb?.phrase}</p>
      <button className={`${s.btn} ${s.main}`} onClick={onAgain}>{t.clock.again}</button>
    </>
  )
  const hh = q.h % 12 === 0 ? 12 : q.h % 12
  const hintText = t.clock.hint(hh, q.m === 0, String(q.m).padStart(2, '0'))
  const answer = async (o: string, el: HTMLElement) => {
    if (done) return
    if (o === right) {
      setDone(true); setHint(false)
      await say(timeWords(q.h, q.m, lang), 900); await wait(300)
      if (!alive.current) return
      misses.current = 0; setDone(false)
      if (qi + 1 < QUESTIONS) setQi(qi + 1)
      else { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }
    } else { wiggle(el); misses.current += 1; if (misses.current >= 2) { setHint(true); speak(hintText) } }
  }
  return (
    <>
      <div className={s.dots}>{qs.map((_, i) => <span key={i} className={i < qi ? s.ok : i === qi ? s.on : ''} />)}</div>
      <p className={s.ask}>{t.clock.ask}</p>
      <Clock h={q.h} m={q.m} />
      <div className={s.choices}>
        {opts.map(o => <button key={o} className={`${s.choice}${done && o === right ? ` ${s.right}` : hint && o === right ? ` ${s.hint}` : ''}`} onClick={e => answer(o, e.currentTarget)}>{o}</button>)}
      </div>
      {hint && <div className={s.tip}>{hintText}</div>}
      {!hint && <button className={s.btn} onClick={() => { setHint(true); speak(hintText) }}>{t.clock.help}</button>}
    </>
  )
}
