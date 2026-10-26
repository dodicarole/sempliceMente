'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { pickCelebration, type Celebration } from '@/lib/fun'
import { DRAW, PAIRS, OPP_CATS, type OppPair, type OppCat } from '@/lib/oppositesData'
import { useSpeech, hush, wait } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import Tedo from './Tedo'
import s from './Opposites.module.css'
import p from './NumbersSettingsPanel.module.css'

/* ── Impostazioni: famiglie di contrari, parole scritte, coppie nel memory ── */
export interface OppSettings { cats: OppCat[]; words: boolean; mem: number }
const DEFAULTS: OppSettings = { cats: [...OPP_CATS], words: true, mem: 6 }
const KEY = 'contrari_impostazioni'
function loadSettings(): OppSettings { try { const r = localStorage.getItem(KEY); if (r) return { ...DEFAULTS, ...JSON.parse(r) } } catch (_) {} return DEFAULTS }
function saveSettings(v: OppSettings) { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (_) {} }

const ROUNDS = 8
const rnd = (n: number) => Math.floor(Math.random() * n)
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]] } return b }
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

/** Il disegno di una coppia, nello stato 0 o nel suo contrario 1 (i disegni sono nostri, non testo inserito dall'utente) */
function Pic({ pair, st, className = s.pic }: { pair: OppPair; st: 0 | 1; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: DRAW[pair.d](st) }} />
}

type Tab = 0 | 1 | 2 | 3

export default function OppositesView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const { t } = useT()
  const [tab, setTab] = useState<Tab>(0)
  const [run, setRun] = useState(0)
  const [st, setSt] = useState<OppSettings | null>(null)
  useEffect(() => { setSt(loadSettings()) }, [])
  const go = (x: Tab) => { hush(); setTab(x); setRun(r => r + 1) }
  return (
    <>
      <SectionTitle emoji="↔️" title={t.opposites.title} sub={t.opposites.homeSub} onBack={onBack} spot="contrari" />
      <nav className={s.tabs}>
        {t.opposites.tabs.map((label: string, k: number) => <button key={k} className={s.tab} aria-current={tab === k} onClick={() => go(k as Tab)}>{label}</button>)}
      </nav>
      {st && (
        <section className={s.card}>
          {tab === 0 ? <Discover key={run} st={st} /> : tab === 1 ? <Find key={run} st={st} onAgain={() => setRun(r => r + 1)} />
            : tab === 2 ? <Memory key={run} st={st} onAgain={() => setRun(r => r + 1)} /> : <Fill key={run} st={st} onAgain={() => setRun(r => r + 1)} />}
          {allowSettings && <OppositesSettingsPanel onChange={n => { setSt(n); setRun(r => r + 1) }} />}
        </section>
      )}
    </>
  )
}

function usePool(st: OppSettings) { return useMemo(() => PAIRS.filter(x => st.cats.includes(x.cat)), [st.cats]) }

function End({ celeb, text, onAgain }: { celeb: Celebration | null; text: string; onAgain: () => void }) {
  const { t } = useT()
  return <><Tedo gag={celeb?.gag ?? null} /><p className={s.winTitle}>{celeb?.phrase}</p><p className={s.sub}>{text}</p><button className={`${s.btn} ${s.main}`} onClick={onAgain}>{t.opposites.again}</button></>
}

/* 👀 Scopri: la carta si gira e il disegno diventa il suo contrario */
function Discover({ st }: { st: OppSettings }) {
  const { t, lang } = useT()
  const { speak } = useSpeech()
  const list = usePool(st)
  const [i, setI] = useState(0)
  const [on, setOn] = useState(false)
  const pr = list[i % list.length]
  const w = (k: 0 | 1) => pr[lang][k]
  useEffect(() => { setOn(false); speak(w(0)) }, [i]) // eslint-disable-line react-hooks/exhaustive-deps
  const flip = () => { const n = !on; setOn(n); speak(n ? t.opposites.opp(w(0), w(1)) : w(0)) }
  return (
    <>
      <div className={s.dots}>{list.map((_, k) => <span key={k} className={k === i ? s.on : ''} />)}</div>
      <div className={s.flipwrap}>
        <button className={`${s.flip}${on ? ` ${s.flipOn}` : ''}`} onClick={flip} aria-label={on ? w(1) : w(0)}>
          <div className={`${s.face} ${s.faceA}`}><Pic pair={pr} st={0} />{st.words && <span className={s.word}>{w(0)}</span>}</div>
          <div className={`${s.face} ${s.faceB}`}><Pic pair={pr} st={1} />{st.words && <span className={s.word}>{w(1)}</span>}</div>
        </button>
      </div>
      <p className={s.sub}>{t.opposites.turn}</p>
      <div className={s.row}>
        <button className={s.btn} onClick={() => setI((i - 1 + list.length) % list.length)}>{t.opposites.prev}</button>
        <button className={s.btn} onClick={() => setI((i + 1) % list.length)}>{t.opposites.next}</button>
      </div>
    </>
  )
}

/* 🔍 Trova il contrario: il contrario giusto, la stessa cosa uguale (il tranello) e un altro disegno */
function Find({ st, onAgain }: { st: OppSettings; onAgain: () => void }) {
  const { t, lang } = useT()
  const { speak, say } = useSpeech()
  const list = usePool(st)
  const rounds = useMemo(() => shuffle(list).slice(0, ROUNDS).map(pr => {
    const other = shuffle(list.filter(x => x !== pr))[0] ?? pr
    return { pr, opts: shuffle([{ pr, s: 1 as const, ok: true }, { pr, s: 0 as const, ok: false }, { pr: other, s: rnd(2) as 0 | 1, ok: false }]) }
  }), [list])
  const [qi, setQi] = useState(0)
  const [done, setDone] = useState(false)
  const [hint, setHint] = useState(false)
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const misses = useRef(0), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const r = rounds[qi]
  useEffect(() => { if (r) speak(`${r.pr[lang][0]}. ${t.opposites.findAsk}`) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  if (celeb || !r) return <End celeb={celeb} text={t.opposites.done(rounds.length)} onAgain={onAgain} />
  const w = (k: 0 | 1) => r.pr[lang][k]
  const pick = async (ok: boolean, el: HTMLElement) => {
    if (done) return
    if (ok) {
      setDone(true); setHint(false); await say(t.opposites.opp(w(0), w(1)), 1100)
      if (!alive.current) return
      misses.current = 0; setDone(false)
      if (qi + 1 < rounds.length) setQi(qi + 1); else { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }
    } else { wiggle(el); misses.current += 1; if (misses.current >= 2) { setHint(true); speak(t.opposites.opp(w(0), w(1))) } }
  }
  return (
    <>
      <div className={s.dots}>{rounds.map((_, k) => <span key={k} className={k < qi ? s.ok : k === qi ? s.on : ''} />)}</div>
      <p className={s.ask}>{t.opposites.findAsk}</p>
      <div><Pic pair={r.pr} st={0} className={`${s.pic} ${s.big}`} />{st.words && <div className={s.word} style={{ color: 'var(--a)' }}>{w(0)}</div>}</div>
      <div className={s.opts}>
        {r.opts.map((o, k) => (
          <button key={k} className={`${s.opt}${done && o.ok ? ` ${s.optRight}` : hint && o.ok ? ` ${s.optHint}` : ''}`} onClick={e => pick(o.ok, e.currentTarget)}>
            <Pic pair={o.pr} st={o.s} /><span className={s.optW}>{done && o.ok && st.words ? w(1) : ''}</span>
          </button>
        ))}
      </div>
    </>
  )
}

/* 🃏 Il memory: si girano due carte; se sono contrari restano aperte */
function Memory({ st, onAgain }: { st: OppSettings; onAgain: () => void }) {
  const { t, lang } = useT()
  const { speak, say } = useSpeech()
  const list = usePool(st)
  const cards = useMemo(() => {
    const pairs = shuffle(list).slice(0, Math.min(st.mem, list.length))
    return shuffle(pairs.flatMap(pr => [{ pr, s: 0 as const }, { pr, s: 1 as const }]))
  }, [list, st.mem])
  const [open, setOpen] = useState<number[]>([])
  const [done, setDone] = useState<number[]>([])
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const busy = useRef(false), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  if (celeb) return <End celeb={celeb} text={t.opposites.done(cards.length / 2)} onAgain={onAgain} />
  const tap = async (k: number) => {
    if (busy.current || open.includes(k) || done.includes(k)) return
    const c = cards[k]; speak(c.pr[lang][c.s])
    const now = [...open, k]; setOpen(now)
    if (now.length < 2) return
    busy.current = true
    const [x, y] = now.map(n => cards[n])
    if (x.pr === y.pr && x.s !== y.s) {
      await wait(400); const nd = [...done, ...now]; setDone(nd); setOpen([])
      await say(t.opposites.memMatch(x.pr[lang][0], x.pr[lang][1]), 900)
      if (alive.current && nd.length === cards.length) { const cc = pickCelebration(t); setCeleb(cc); speak(cc.phrase) }
    } else { await wait(1100); if (alive.current) setOpen([]) }
    busy.current = false
  }
  return (
    <>
      <p className={s.ask}>{t.opposites.memAsk}</p>
      <div className={s.mem}>
        {cards.map((c, k) => {
          const isOpen = open.includes(k) || done.includes(k)
          return (
            <button key={k} className={`${s.mc}${isOpen ? ` ${s.mcOpen}` : ''}${done.includes(k) ? ` ${s.mcDone}` : ''}`} onClick={() => tap(k)} aria-label={isOpen ? c.pr[lang][c.s] : '?'}>
              <div className={s.mcIn}>
                <div className={s.mcBack}>?</div>
                <div className={s.mcFront}><Pic pair={c.pr} st={c.s} />{st.words && <span className={s.mcW}>{c.pr[lang][c.s]}</span>}</div>
              </div>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* 💬 Completa la frase: i due disegni, la frase con il buco, tre parole */
function Fill({ st, onAgain }: { st: OppSettings; onAgain: () => void }) {
  const { t, lang } = useT()
  const { speak, say } = useSpeech()
  const list = usePool(st)
  const rounds = useMemo(() => shuffle(list).slice(0, ROUNDS).map(pr => {
    const other = shuffle(list.filter(x => x !== pr))[0] ?? pr
    return { pr, words: shuffle([[pr[lang][1], true], [pr[lang][0], false], [other[lang][1], false]] as [string, boolean][]) }
  }), [list, lang])
  const [qi, setQi] = useState(0)
  const [done, setDone] = useState(false)
  const [hint, setHint] = useState(false)
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const misses = useRef(0), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const r = rounds[qi]
  const sentence = r ? (lang === 'fr' ? r.pr.sfr : r.pr.sit) : ''
  useEffect(() => { if (r) speak(sentence.replace('…', ', ')) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  if (celeb || !r) return <End celeb={celeb} text={t.opposites.done(rounds.length)} onAgain={onAgain} />
  const answer = r.pr[lang][1]
  const pick = async (ok: boolean, el: HTMLElement) => {
    if (done) return
    if (ok) {
      setDone(true); setHint(false); await say(sentence.replace('…', answer), 1200)
      if (!alive.current) return
      misses.current = 0; setDone(false)
      if (qi + 1 < rounds.length) setQi(qi + 1); else { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }
    } else { wiggle(el); misses.current += 1; if (misses.current >= 2) { setHint(true); speak(t.opposites.opp(r.pr[lang][0], answer)) } }
  }
  const [before, after] = sentence.split('…')
  return (
    <>
      <div className={s.dots}>{rounds.map((_, k) => <span key={k} className={k < qi ? s.ok : k === qi ? s.on : ''} />)}</div>
      <p className={s.ask}>{t.opposites.fillAsk}</p>
      <div className={s.pair2}><div className={s.pA}><Pic pair={r.pr} st={0} /></div><div className={s.pB}><Pic pair={r.pr} st={1} /></div></div>
      <div className={s.sentence}>{before}<span className={s.gap}>{done ? answer : '?'}</span>{after}</div>
      <div className={s.row}>
        {r.words.map(([w, ok], k) => (
          <button key={k} className={`${s.wbtn}${done && ok ? ` ${s.wRight}` : hint && ok ? ` ${s.wHint}` : ''}`} onClick={e => pick(ok, e.currentTarget)}>{w}</button>
        ))}
      </div>
    </>
  )
}

/** Impostazioni (area Genitore; nella demo dentro la sezione) */
export function OppositesSettingsPanel({ onChange }: { onChange?: (v: OppSettings) => void }) {
  const { t } = useT()
  const [st, setSt] = useState<OppSettings>(DEFAULTS)
  const [saved, setSaved] = useState(false)
  useEffect(() => { setSt(loadSettings()) }, [])
  const set = (n: OppSettings) => { setSt(n); saveSettings(n); setSaved(true); onChange?.(n) }
  const toggleCat = (c: OppCat) => {
    const has = st.cats.includes(c)
    if (has && st.cats.length === 1) return            // almeno una famiglia resta accesa
    set({ ...st, cats: has ? st.cats.filter(x => x !== c) : [...st.cats, c] })
  }
  return (
    <div className={p.panel} style={{ width: '100%', textAlign: 'left' }}>
      <div className={p.group}>
        <span className={p.label}>{t.opposites.setCats}</span>
        <div className={p.chips}>{OPP_CATS.map(c => <button key={c} className={p.chip} aria-pressed={st.cats.includes(c)} onClick={() => toggleCat(c)}>{t.opposites.cats[c]}</button>)}</div>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.opposites.setWords}</span>
        <div className={p.chips}>{([[true, t.reading.yes], [false, t.reading.no]] as [boolean, string][]).map(([v, l]) => <button key={l} className={p.chip} aria-pressed={st.words === v} onClick={() => set({ ...st, words: v })}>{l}</button>)}</div>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.opposites.setMem}</span>
        <div className={p.chips}>{[4, 6, 8].map(n => <button key={n} className={p.chip} aria-pressed={st.mem === n} onClick={() => set({ ...st, mem: n })}>{n}</button>)}</div>
      </div>
      {saved && <div className={p.saved}>{t.common.saved}</div>}
    </div>
  )
}
