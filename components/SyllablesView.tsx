'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { pickCelebration, type Celebration } from '@/lib/fun'
import { useSpeech, hush, wait } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import Tedo from './Tedo'
import s from './Daily.module.css'

/* Le sillabe: attività per l'italiano (le parole e le sillabe sono italiane) */
const WORDS: [string, string[]][] = [
  ['🍎', ['me', 'la']], ['🍞', ['pa', 'ne']], ['🏠', ['ca', 'sa']], ['🌙', ['lu', 'na']], ['🌹', ['ro', 'sa']], ['☀️', ['so', 'le']],
  ['🌊', ['ma', 're']], ['🍐', ['pe', 'ra']], ['⛵', ['na', 've']], ['🐭', ['to', 'po']], ['🦭', ['fo', 'ca']],
  ['🍌', ['ba', 'na', 'na']], ['🥔', ['pa', 'ta', 'ta']], ['🪑', ['ta', 'vo', 'lo']], ['🍅', ['po', 'mo', 'do', 'ro']],
]
const ROUNDS = 6
const rnd = (n: number) => Math.floor(Math.random() * n)
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]] } return b }
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

export default function SyllablesView({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'join' | 'build'>('join')
  const [upper, setUpper] = useState(true)
  const [run, setRun] = useState(0)
  const reset = (fn: () => void) => { hush(); fn(); setRun(r => r + 1) }
  const fmt = (x: string) => (upper ? x.toUpperCase() : x)
  return (
    <>
      <SectionTitle emoji="🔤" title="Le sillabe" sub="Ogni sillaba ha il suo colore" onBack={onBack} spot="sillabe" />
      <section className={s.card}>
        <div className={s.tabs}>
          <button className={s.tab} aria-current={tab === 'join'} onClick={() => reset(() => setTab('join'))}>🔗 Unisci</button>
          <button className={s.tab} aria-current={tab === 'build'} onClick={() => reset(() => setTab('build'))}>🧩 Componi</button>
        </div>
        <div className={s.chips}>
          <button className={s.chip} aria-pressed={upper} onClick={() => setUpper(true)}>STAMPATO MAIUSCOLO</button>
          <button className={s.chip} aria-pressed={!upper} onClick={() => setUpper(false)}>minuscolo</button>
        </div>
        {tab === 'join' ? <Join key={`j${run}`} fmt={fmt} /> : <Build key={`b${run}`} fmt={fmt} onAgain={() => reset(() => {})} />}
      </section>
    </>
  )
}

/* Unisci: si sentono le sillabe una alla volta, poi si uniscono nella parola */
function Join({ fmt }: { fmt: (x: string) => string }) {
  const { speak, say } = useSpeech()
  const list = useMemo(() => shuffle(WORDS), [])
  const [i, setI] = useState(0)
  const [heard, setHeard] = useState<Set<number>>(new Set())
  const [joined, setJoined] = useState(false)
  const [busy, setBusy] = useState(false)
  const [e, syls] = list[i % list.length]
  const join = async () => { setBusy(true); for (const x of syls) await say(x, 350); setJoined(true); await say(syls.join(''), 600); setBusy(false) }
  const next = () => { setI(i + 1); setHeard(new Set()); setJoined(false) }
  return (
    <>
      <p className={s.sub}>Tocca ogni sillaba per sentirla, poi uniscile</p>
      <div className={s.sylRow}>
        {syls.map((x, k) => <button key={k} className={`${s.syl} ${s[`s${k % 4}`]}`} onClick={() => { const n = new Set(heard); n.add(k); setHeard(n); speak(x, { rate: 0.7 }) }}>{fmt(x)}</button>)}
      </div>
      <button className={`${s.btn} ${s.main}`} disabled={heard.size < syls.length || busy} onClick={join}>🔗 Unisci le sillabe</button>
      {joined && <><div className={s.joined}>{syls.map((x, k) => <span key={k} className={s[`k${k % 4}`]}>{fmt(x)}</span>)}</div><div className={s.pic}>{e}</div></>}
      <button className={s.btn} onClick={next}>Altra parola ▶</button>
    </>
  )
}

/* Componi: c'è l'immagine e il bambino mette in ordine le sillabe mescolate */
function Build({ fmt, onAgain }: { fmt: (x: string) => string; onAgain: () => void }) {
  const { t } = useT()
  const { speak, say } = useSpeech()
  const list = useMemo(() => shuffle(WORDS).slice(0, ROUNDS), [])
  const [qi, setQi] = useState(0)
  const [pos, setPos] = useState(0)
  const [used, setUsed] = useState<Set<number>>(new Set())
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const misses = useRef(0), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const [e, syls] = list[qi] ?? list[0]
  const pool = useMemo(() => shuffle(syls.map((x, k) => ({ x, k }))), [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { speak(syls.join(''), { rate: 0.75 }) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  if (celeb) return <><Tedo gag={celeb.gag} /><p className={s.winTitle}>{celeb.phrase}</p><button className={`${s.btn} ${s.main}`} onClick={onAgain}>🔄 Ancora</button></>

  const tap = async (x: string, idx: number, el: HTMLElement) => {
    if (used.has(idx)) return
    if (x === syls[pos]) {   // con sillabe uguali (ba-na-na) va bene qualunque delle due
      const u = new Set(used); u.add(idx); setUsed(u); speak(x, { rate: 0.7 })
      const np = pos + 1; setPos(np)
      if (np === syls.length) {
        await wait(500); const c = pickCelebration(t); await say(syls.join(''), 700)
        if (!alive.current) return
        misses.current = 0; setUsed(new Set()); setPos(0)
        if (qi + 1 < list.length) setQi(qi + 1); else { setCeleb(c); speak(c.phrase) }
      }
    } else { wiggle(el); misses.current += 1; if (misses.current >= 2) speak(`Ascolta bene: ${syls.slice(0, pos + 1).join(' ... ')}`, { rate: 0.6 }) }
  }
  return (
    <>
      <div className={s.dots}>{list.map((_, i) => <span key={i} className={i < qi ? s.ok : i === qi ? s.on : ''} />)}</div>
      <div className={s.pic}>{e}</div>
      <p className={s.ask}>Metti le sillabe in ordine</p>
      <div className={s.sylRow}>{syls.map((x, k) => <div key={k} className={`${s.sslot}${k < pos ? ` ${s[`s${k % 4}`]}` : ''}`}>{k < pos ? fmt(x) : ''}</div>)}</div>
      <div className={s.sylRow}>{pool.map(({ x, k }) => <button key={k} className={`${s.syl} ${s[`s${k % 4}`]}${used.has(k) ? ` ${s.used}` : ''}`} onClick={ev => tap(x, k, ev.currentTarget)}>{fmt(x)}</button>)}</div>
      <button className={s.btn} onClick={() => speak(syls.join(''), { rate: 0.7 })}>🔊 Ascolta la parola</button>
    </>
  )
}
