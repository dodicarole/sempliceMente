'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { pickCelebration, type Celebration } from '@/lib/fun'
import { useSpeech, hush, wait } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import Tedo from './Tedo'
import s from './Daily.module.css'

interface Piece { v: number; coin: boolean; cls: string }
const PIECES: Piece[] = [
  { v: 1, coin: true, cls: 'c1' }, { v: 2, coin: true, cls: 'c2' }, { v: 5, coin: false, cls: 'n5' }, { v: 10, coin: false, cls: 'n10' },
  { v: 20, coin: false, cls: 'n20' }, { v: 50, coin: false, cls: 'n50' }, { v: 100, coin: false, cls: 'n100' },
]
const SHOP_E = ['🍎', '🧃', '📒', '🧸', '⚽', '🎨', '🚂', '📚']
const ROUNDS = 5
const rnd = (n: number) => Math.floor(Math.random() * n)
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]] } return b }
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

function Money({ p, onClick, extra = '' }: { p: Piece; onClick?: () => void; extra?: string }) {
  return <button className={`${p.coin ? s.coin : s.note} ${s[p.cls]} ${extra}`} onClick={onClick} aria-label={`${p.v} €`}>{p.coin ? `${p.v}€` : `${p.v} €`}</button>
}

export default function MoneyView({ onBack }: { onBack: () => void }) {
  const { t } = useT()
  const [tab, setTab] = useState<'count' | 'pay'>('count')
  const [lvl, setLvl] = useState(10)
  const [run, setRun] = useState(0)
  const reset = (fn: () => void) => { hush(); fn(); setRun(r => r + 1) }
  const avail = PIECES.filter(p => p.v <= lvl)
  return (
    <>
      <SectionTitle emoji="💶" title={t.daily.moneyTitle} sub={t.daily.moneySub} onBack={onBack} spot="soldi" />
      <section className={s.card}>
        <div className={s.tabs}>
          <button className={s.tab} aria-current={tab === 'count'} onClick={() => reset(() => setTab('count'))}>{t.money.tabCount}</button>
          <button className={s.tab} aria-current={tab === 'pay'} onClick={() => reset(() => setTab('pay'))}>{t.money.tabPay}</button>
        </div>
        <div className={s.chips}>
          {[10, 20, 100].map(k => <button key={k} className={s.chip} aria-pressed={k === lvl} onClick={() => reset(() => setLvl(k))}>{t.money.levels[k]}</button>)}
        </div>
        {tab === 'count' ? <Count key={`c${run}`} avail={avail} max={lvl} onAgain={() => reset(() => {})} /> : <Pay key={`p${run}`} avail={avail} max={lvl} onAgain={() => reset(() => {})} />}
      </section>
    </>
  )
}

function End({ celeb, onAgain }: { celeb: Celebration | null; onAgain: () => void }) {
  const { t } = useT()
  return <><Tedo gag={celeb?.gag ?? null} /><p className={s.winTitle}>{celeb?.phrase}</p><button className={`${s.btn} ${s.main}`} onClick={onAgain}>{t.clock.again}</button></>
}

/* Conta: si toccano i soldi uno alla volta e la voce somma; poi si sceglie il totale */
function Count({ avail, max, onAgain }: { avail: Piece[]; max: number; onAgain: () => void }) {
  const { t } = useT()
  const { speak, say } = useSpeech()
  const [qi, setQi] = useState(0)
  const [counted, setCounted] = useState<Set<number>>(new Set())
  const [hint, setHint] = useState(false)
  const [done, setDone] = useState(false)
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const misses = useRef(0), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const set = useMemo(() => {
    const out: Piece[] = []; let sum = 0, tries = 0; const want = 2 + rnd(3)
    while (out.length < want && tries++ < 60) { const p = avail[rnd(avail.length)]; if (sum + p.v <= max) { out.push(p); sum += p.v } }
    return out.sort((a, b) => b.v - a.v) // dalle più grandi alle più piccole: si conta meglio
  }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  const sum = set.reduce((a, p) => a + p.v, 0)
  const running = set.reduce((a, p, i) => (counted.has(i) ? a + p.v : a), 0)
  const opts = useMemo(() => { const o = new Set([sum]); while (o.size < 3) { const d = [-5, -2, -1, 1, 2, 5, 10][rnd(7)]; if (sum + d > 0) o.add(sum + d) } return shuffle([...o]) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { speak(t.money.countAsk) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  if (celeb) return <End celeb={celeb} onAgain={onAgain} />

  const tap = (i: number) => { if (counted.has(i)) return; const n = new Set(counted); n.add(i); setCounted(n); speak(String(running + set[i].v)) }
  const answer = async (o: number, el: HTMLElement) => {
    if (done) return
    if (o === sum) {
      setDone(true); setHint(false); await say(t.money.isTotal(sum), 900); await wait(300)
      if (!alive.current) return
      misses.current = 0; setDone(false); setCounted(new Set())
      if (qi + 1 < ROUNDS) setQi(qi + 1); else { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }
    } else { wiggle(el); misses.current += 1; if (misses.current >= 2) { setHint(true); speak(t.money.countHelp) } }
  }
  return (
    <>
      <div className={s.dots}>{Array.from({ length: ROUNDS }, (_, i) => <span key={i} className={i < qi ? s.ok : i === qi ? s.on : ''} />)}</div>
      <p className={s.ask}>{t.money.countAsk}</p>
      <p className={s.sub}>{t.money.countSub}</p>
      <div className={s.money}>{set.map((p, i) => <Money key={i} p={p} onClick={() => tap(i)} extra={counted.has(i) ? s.counted : ''} />)}</div>
      <div className={s.total}>{running ? `${running} €` : ''}</div>
      <div className={s.choices}>
        {opts.map(o => <button key={o} className={`${s.choice}${done && o === sum ? ` ${s.right}` : hint && o === sum ? ` ${s.hint}` : ''}`} onClick={e => answer(o, e.currentTarget)}>{o} €</button>)}
      </div>
    </>
  )
}

/* Paga: c'è un oggetto con il prezzo e si mettono i soldi giusti nel vassoio */
function Pay({ avail, max, onAgain }: { avail: Piece[]; max: number; onAgain: () => void }) {
  const { t } = useT()
  const { speak, say } = useSpeech()
  const [round, setRound] = useState(0)
  const [tray, setTray] = useState<Piece[]>([])
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const doneRef = useRef(false), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const item = useMemo(() => {
    const k = rnd(SHOP_E.length)
    const price = Math.max(1, Math.min(max, max === 10 ? 1 + rnd(9) : max === 20 ? 3 + rnd(17) : 5 + rnd(95)))
    return { e: SHOP_E[k], name: t.money.shop[k], price }
  }, [round]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { doneRef.current = false; speak(`${item.name}: ${t.money.euros(item.price)}`) }, [round]) // eslint-disable-line react-hooks/exhaustive-deps
  if (celeb) return <End celeb={celeb} onAgain={onAgain} />

  const total = tray.reduce((a, p) => a + p.v, 0)
  const after = async (next: Piece[]) => {
    const tot = next.reduce((a, p) => a + p.v, 0)
    if (tot === item.price && !doneRef.current) {
      doneRef.current = true
      await say(t.money.bought(item.name), 1200); await wait(300)
      if (!alive.current) return
      setTray([])
      if (round + 1 < ROUNDS) setRound(round + 1); else { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }
    } else if (tot > item.price) speak(t.money.overVoice)
    else if (tot > 0) speak(String(tot))
  }
  const add = (p: Piece) => { if (doneRef.current) return; const n = [...tray, p]; setTray(n); after(n) }
  const remove = (i: number) => { if (doneRef.current) return; const n = tray.filter((_, k) => k !== i); setTray(n); after(n) }
  const status = total === 0 ? t.money.put : total < item.price ? t.money.partial(total, item.price - total) : total === item.price ? t.money.exact(item.price) : t.money.over(total, total - item.price)
  return (
    <>
      <div className={s.dots}>{Array.from({ length: ROUNDS }, (_, i) => <span key={i} className={i < round ? s.ok : i === round ? s.on : ''} />)}</div>
      <p className={s.ask}>{t.money.payAsk}</p>
      <div className={s.shopitem}><span className={s.shopE}>{item.e}</span><div><div className={s.sub}>{item.name}</div><div className={s.price}>{item.price} €</div></div></div>
      <div className={s.tray}>{tray.map((p, i) => <Money key={i} p={p} onClick={() => remove(i)} />)}</div>
      <div className={`${s.paid}${total > item.price ? ` ${s.paidOver}` : total === item.price ? ` ${s.paidOk}` : ''}`}>{status}</div>
      <p className={s.sub}>{t.money.wallet}</p>
      <div className={s.money}>{[...avail].reverse().map(p => <Money key={p.v} p={p} onClick={() => add(p)} />)}</div>
    </>
  )
}
