'use client'
import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { useT } from '@/lib/i18n'
import { pickCelebration, type Celebration } from '@/lib/fun'
import { PAIRS, BANK, LETTERS, ROUNDS, DOUBLES_DEFAULTS, loadDoublesSettings, saveDoublesSettings, type DWord, type FillWord, type DoublesSettings } from '@/lib/doublesData'
import { useSpeech, hush, wait } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import Tedo from './Tedo'
import s from './Doubles.module.css'
import p from './NumbersSettingsPanel.module.css'

type Tab = 'learn' | 'pairs' | 'fill'
const rnd = (n: number) => Math.floor(Math.random() * n)
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = rnd(i + 1); [b[i], b[j]] = [b[j], b[i]] } return b }
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

/* La parola con le doppie colorate */
function Word({ w, color }: { w: string; color: boolean }) {
  return <span className={s.w}>{w.toUpperCase().split('').map((ch, i) => {
    const dbl = color && (w[i] === w[i + 1] || w[i] === w[i - 1])
    return dbl ? <span key={i} className={s.d}>{ch}</span> : <span key={i}>{ch}</span>
  })}</span>
}
/* Le sillabe, con la doppia colorata a cavallo del taglio: PAL | LA */
function Syl({ x, color }: { x: DWord; color: boolean }) {
  return <div className={s.syl}>{x.s.map((sy, i) => {
    const prev = x.s[i - 1], next = x.s[i + 1], up = sy.toUpperCase()
    const endD = color && next && sy.slice(-1) === next[0], startD = color && prev && sy[0] === prev.slice(-1)
    let body: ReactNode = up
    if (endD && startD) body = <><b>{up[0]}</b>{up.slice(1, -1)}<b>{up.slice(-1)}</b></>
    else if (endD) body = <>{up.slice(0, -1)}<b>{up.slice(-1)}</b></>
    else if (startD) body = <><b>{up[0]}</b>{up.slice(1)}</>
    return <span key={i} style={{ display: 'contents' }}>{i > 0 && <i>|</i>}<span>{body}</span></span>
  })}</div>
}
function Pic({ e }: { e: string }) {
  return e.startsWith('/') ? <Image src={e} alt="" width={64} height={64} className={s.picImg} /> : <span className={s.picE}>{e}</span>
}

export default function DoublesView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const [tab, setTab] = useState<Tab>('learn')
  const [run, setRun] = useState(0)
  const [st, setSt] = useState<DoublesSettings | null>(null)
  useEffect(() => { setSt(loadDoublesSettings()) }, [])
  const go = (t: Tab) => { hush(); setTab(t); setRun(r => r + 1) }
  return (
    <>
      <SectionTitle emoji="✏️" title="Le doppie" sub="Ascolta bene: la doppia si sente più forte" onBack={onBack} spot="doppie" />
      <nav className={s.tabs}>
        <button className={s.tab} aria-current={tab === 'learn'} onClick={() => go('learn')}>👀 Scopri</button>
        <button className={s.tab} aria-current={tab === 'pairs'} onClick={() => go('pairs')}>👂 Ascolta e scegli</button>
        <button className={s.tab} aria-current={tab === 'fill'} onClick={() => go('fill')}>✏️ Completa</button>
      </nav>
      {st && (
        <section className={s.card}>
          {tab === 'learn' ? <Learn st={st} /> : tab === 'pairs' ? <Pairs key={run} st={st} onAgain={() => go('pairs')} /> : <Fill key={run} st={st} />}
          {allowSettings && <DoublesSettingsPanel onChange={n => { setSt(n); setRun(r => r + 1) }} />}
        </section>
      )}
    </>
  )
}

/** Ascolto lento a sillabe: nella doppia la voce si ferma sulla consonante (pal... la) */
function useSlow() {
  const { say } = useSpeech()
  return async (x: DWord) => { hush(); for (const sy of x.s) await say(sy, 250); await wait(300); await say(x.w, 300) }
}

/* 👀 Scopri: le coppie una accanto all'altra */
function Learn({ st }: { st: DoublesSettings }) {
  const slow = useSlow()
  return (
    <>
      <p className={s.ask}>La doppia cambia la parola!</p>
      <p className={s.sub}>Tocca una parola per sentirla a sillabe. Ascolta la differenza.</p>
      <div className={s.list}>
        {PAIRS.map((pair, i) => (
          <div key={i} className={s.lrow}>
            {pair.map(x => <button key={x.w} onClick={() => slow(x)}>{st.pics && <Pic e={x.e} />}<Word w={x.w} color={st.color} /><Syl x={x} color={st.color} /></button>)}
          </div>
        ))}
      </div>
    </>
  )
}

/* 👂 Ascolta e scegli: la voce dice una parola della coppia */
function Pairs({ st, onAgain }: { st: DoublesSettings; onAgain: () => void }) {
  const { t } = useT()
  const { speak, say } = useSpeech()
  const slow = useSlow()
  const rounds = useMemo(() => shuffle(PAIRS).slice(0, ROUNDS).map(pr => ({ pair: shuffle(pr), target: pr[rnd(2)] })), [])
  const [qi, setQi] = useState(0)
  const [hint, setHint] = useState(false)
  const [done, setDone] = useState(false)
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const misses = useRef(0), alive = useRef(true)
  useEffect(() => () => { alive.current = false }, [])
  const r = rounds[qi]
  useEffect(() => { if (r) speak(r.target.w, { rate: 0.75 }) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps
  if (celeb || !r) return <><Tedo gag={celeb?.gag ?? null} /><p className={s.winTitle}>{celeb?.phrase}</p><button className={`${s.btn} ${s.main}`} onClick={onAgain}>🔄 Altre {ROUNDS} coppie</button></>

  const pick = async (x: DWord, el: HTMLElement) => {
    if (done) return
    if (x === r.target) {
      setDone(true); setHint(false)
      await say(`${x.w}!`, 500); await say(`${r.pair[0].w} ... ${r.pair[1].w}`, 1200); await wait(600)
      if (!alive.current) return
      misses.current = 0; setDone(false)
      if (qi + 1 < rounds.length) setQi(qi + 1); else { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }
    } else { wiggle(el); misses.current += 1; if (misses.current >= 2) { setHint(true); slow(r.target) } }
  }
  return (
    <>
      <div className={s.dots}>{rounds.map((_, i) => <span key={i} className={i < qi ? s.ok : i === qi ? s.on : ''} />)}</div>
      <p className={s.ask}>Quale parola senti?</p>
      <button className={s.ear} aria-label="Ascolta di nuovo" onClick={() => speak(r.target.w, { rate: 0.75 })}>👂</button>
      <button className={`${s.btn} ${s.slow}`} onClick={() => slow(r.target)}>🐢 Ascolta a sillabe</button>
      <div className={s.pair}>
        {r.pair.map(x => (
          <button key={x.w} className={`${s.pcard}${done && x === r.target ? ` ${s.pRight}` : hint && x === r.target ? ` ${s.pHint}` : ''}`} onClick={e => pick(x, e.currentTarget)}>
            {st.pics && <Pic e={x.e} />}<Word w={x.w} color={st.color} />
          </button>
        ))}
      </div>
      {done && <div className={s.compare}>{r.pair.map(x => <div key={x.w}><Word w={x.w} color={st.color} /><Syl x={x} color={st.color} /></div>)}</div>}
    </>
  )
}

/* ✏️ Completa: una lettera o due? 10 parole a giro, metà con la doppia e metà senza */
function Fill({ st }: { st: DoublesSettings }) {
  const { t } = useT()
  const { speak, say } = useSpeech()
  const slow = useSlow()
  const [letter, setLetter] = useState('tutte')
  const [run, setRun] = useState(0)
  const rounds = useMemo(() => {
    const pool = BANK.filter(x => letter === 'tutte' || x.l === letter)
    const d = shuffle(pool.filter(x => x.dbl)), sg = shuffle(pool.filter(x => !x.dbl))
    const half = Math.ceil(ROUNDS / 2)
    let out = [...d.slice(0, half), ...sg.slice(0, ROUNDS - Math.min(half, d.length))]
    if (out.length < ROUNDS) out = out.concat(shuffle(pool).filter(x => !out.includes(x))).slice(0, ROUNDS)
    return shuffle(out).slice(0, ROUNDS)
  }, [letter, run])
  const [qi, setQi] = useState(0)
  const [hint, setHint] = useState(false)
  const [done, setDone] = useState(false)
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  const misses = useRef(0), alive = useRef(true)
  const lettersRef = useRef<HTMLDivElement>(null)
  useEffect(() => () => { alive.current = false }, [])
  const x: FillWord | undefined = rounds[qi]
  useEffect(() => { if (x) speak(x.w, { rate: 0.75 }) }, [qi, rounds]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { // la lettera scelta resta visibile nella fila che scorre
    const box = lettersRef.current, sel = box?.querySelector('[aria-pressed="true"]') as HTMLElement | null
    if (box && sel) box.scrollLeft = Math.max(0, sel.offsetLeft - box.clientWidth / 2 + sel.clientWidth / 2)
  }, [letter])
  const restart = (L = letter) => { hush(); setLetter(L); setRun(r => r + 1); setQi(0); setHint(false); setDone(false); setCeleb(null); misses.current = 0 }

  const letters = (
    <div ref={lettersRef} className={s.letters}>
      <span className={s.sub}>Allenati con:</span>
      {LETTERS.map(L => <button key={L} className={s.chip} aria-pressed={L === letter} onClick={() => restart(L)}>{L === 'tutte' ? 'Tutte' : `${L.toUpperCase()} / ${(L + L).toUpperCase()}`}</button>)}
    </div>
  )
  if (celeb || !x) return <>{letters}<Tedo gag={celeb?.gag ?? null} /><p className={s.winTitle}>{celeb?.phrase}</p><p className={s.sub}>Hai completato {ROUNDS} parole!</p><button className={`${s.btn} ${s.main}`} onClick={() => restart()}>🔄 Altre {ROUNDS} parole</button></>

  const right = x.dbl ? x.l + x.l : x.l
  const before = x.w.slice(0, x.at).toUpperCase(), after = x.w.slice(x.at + right.length).toUpperCase()
  const L = x.l.toUpperCase()
  const zRule = x.l === 'z' && !x.dbl && /zi[aoe]|zion/.test(x.w) // -ZIONE, -ZIA, -ZIO: sempre una Z sola
  const cut = x.s.findIndex((sy, i) => x.s[i + 1] && sy.slice(-1) === x.s[i + 1][0])

  const answer = async (o: string, el: HTMLElement) => {
    if (done) return
    if (o === right) {
      setDone(true); setHint(false)
      await say(x.w, 400); if (st.syll) await slow(x); await wait(500)
      if (!alive.current) return
      misses.current = 0; setDone(false)
      if (qi + 1 < rounds.length) setQi(qi + 1); else { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }
    } else { wiggle(el); misses.current += 1; if (misses.current >= 2) { setHint(true); slow(x) } }
  }
  return (
    <>
      {letters}
      <div className={s.dots}>{rounds.map((_, i) => <span key={i} className={i < qi ? s.ok : i === qi ? s.on : ''} />)}</div>
      {st.pics && <Pic e={x.e} />}
      <p className={s.ask}>Una lettera o due?</p>
      <div className={s.gapword}>{before}<span className={`${s.gap}${done ? ` ${s.gapFilled}` : ''}`}>{done ? right.toUpperCase() : '?'}</span>{after}</div>
      <div className={s.opts}>
        {[x.l, x.l + x.l].map(o => <button key={o} className={`${s.opt}${done && o === right ? ` ${s.optRight}` : hint && o === right ? ` ${s.optHint}` : ''}`} onClick={e => answer(o, e.currentTarget)}>{o.toUpperCase()}</button>)}
      </div>
      <button className={`${s.btn} ${s.slow}`} onClick={() => slow(x)}>🐢 Ascolta a sillabe</button>
      {(hint || (done && st.syll)) && (
        <div className={s.tip}>
          {st.syll && <Syl x={x} color={st.color} />}
          {hint && (x.dbl
            ? <span>Ascolta: la <b className={s.d}>{L}</b> si sente <b>due volte</b>, alla fine di <b>{x.s[cut]?.toUpperCase()}</b> e all&apos;inizio della sillaba dopo. Allora è doppia!</span>
            : zRule
              ? <span>Trucco: davanti a <b>-ZIONE</b>, <b>-ZIA</b> e <b>-ZIO</b> la <b className={s.d}>Z</b> è sempre <b>una sola</b>!</span>
              : <span>Ascolta: la <b className={s.d}>{L}</b> si sente <b>una volta sola</b>, all&apos;inizio della sillaba. Allora è singola!</span>)}
        </div>
      )}
    </>
  )
}

/** Impostazioni (area Genitore; nella demo dentro la sezione): i tre aiuti da ritirare un po' alla volta */
export function DoublesSettingsPanel({ onChange }: { onChange?: (s: DoublesSettings) => void }) {
  const { t } = useT()
  const [st, setSt] = useState<DoublesSettings>(DOUBLES_DEFAULTS)
  const [saved, setSaved] = useState(false)
  useEffect(() => { setSt(loadDoublesSettings()) }, [])
  const rows: [keyof DoublesSettings, string][] = [['color', 'Colora le doppie'], ['syll', "Mostra le sillabe nell'aiuto"], ['pics', 'Immagini']]
  return (
    <div className={p.panel} style={{ width: '100%', textAlign: 'left' }}>
      {rows.map(([k, label]) => (
        <div key={k} className={p.group}>
          <span className={p.label}>{label}</span>
          <div className={p.chips}>
            {([[true, t.reading.yes], [false, t.reading.no]] as [boolean, string][]).map(([v, l]) => (
              <button key={l} className={p.chip} aria-pressed={st[k] === v} onClick={() => { const n = { ...st, [k]: v }; setSt(n); saveDoublesSettings(n); setSaved(true); onChange?.(n) }}>{l}</button>
            ))}
          </div>
        </div>
      ))}
      {saved && <div className={p.saved}>{t.common.saved}</div>}
    </div>
  )
}
