'use client'
import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react'
import { useT } from '@/lib/i18n'
import type { Dict } from '@/lib/i18n/it'
import { SPLIT_DEFAULTS, loadSplitSettings, type SplitSettings } from '@/lib/splitSettings'
import { pickCelebration, type Celebration } from '@/lib/fun'
import SplitSettingsPanel from './SplitSettingsPanel'
import Tedo from './Tedo'
import s from './SplitView.module.css'
import Buddy from './Buddy'

interface Props {
  onBack: () => void
  /** Ingranaggio delle impostazioni dentro il gioco (solo demo, dove non c'è l'area Genitore) */
  allowSettings?: boolean
}

type Key = 'h' | 'd' | 'u'
const KEYS: Key[] = ['h', 'd', 'u']
const MUL: Record<Key, number> = { h: 100, d: 10, u: 1 }
const ZEROS: Record<Key, number> = { h: 2, d: 1, u: 0 }
const QUESTIONS = 5

interface Part { k: Key; digit: number; value: number }

const digitsOf = (n: number): Record<Key, number> => ({ h: Math.floor(n / 100) % 10, d: Math.floor(n / 10) % 10, u: n % 10 })
const partsOf = (n: number): Part[] => KEYS.map(k => ({ k, digit: digitsOf(n)[k], value: digitsOf(n)[k] * MUL[k] })).filter(p => p.digit > 0)
const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

/* ── Voce: le frasi si mettono in fila e il gioco aspetta che siano finite ── */
const keep: SpeechSynthesisUtterance[] = [] // evita che il browser perda gli avvisi di fine frase
function hush() { try { window.speechSynthesis.cancel() } catch (_) {} }

function useVoice(enabled: boolean, t: Dict) {
  const speak = useCallback((text: string, interrupt = false) => new Promise<void>(resolve => {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve()
    let done = false
    const fin = () => { if (!done) { done = true; resolve() } }
    try {
      const synth = window.speechSynthesis
      const u = new SpeechSynthesisUtterance(text)
      u.lang = t.locale
      u.rate = 0.85
      const v = synth.getVoices().find(v => v.lang.toLowerCase().startsWith(t.speechLang))
      if (v) u.voice = v
      u.onend = fin; u.onerror = fin
      keep.push(u); if (keep.length > 20) keep.shift()
      setTimeout(fin, 2000 + text.length * 120) // sicurezza se il browser non avvisa
      // dopo cancel() alcuni browser ignorano la frase successiva se arriva subito: aspettiamo un attimo
      if (interrupt) { synth.cancel(); setTimeout(() => synth.speak(u), 80) } else synth.speak(u)
    } catch (_) { fin() }
  }), [enabled, t])
  /** Parla e aspetta almeno `ms` millisecondi (anche con la voce spenta) */
  const say = useCallback((text: string, ms = 700) => Promise.all([speak(text), wait(ms)]).then(() => {}), [speak])
  return { speak, say }
}

/* ── La tabella h – da – u: le unità sono sempre nell'ultima colonna a destra ── */
function PlaceTable({ n, settings, focus, showEmptyAll = false }: { n: number; settings: SplitSettings; focus?: Key; showEmptyAll?: boolean }) {
  const { t } = useT()
  const v = digitsOf(n)
  const len = n === 0 ? 0 : String(n).length
  return (
    <div className={s.table}>
      {KEYS.map((k, i) => {
        const exists = !showEmptyAll && i >= 3 - len // le cifre si mettono partendo da destra
        const place = t.split.places[k]
        const cls = [s.col, exists ? s[k] : s.empty, focus === k ? s.focus : '', focus && focus !== k ? s.dim : ''].join(' ')
        return (
          <div key={k} className={cls}>
            <span className={`${s.lab} ${s[`c_${k}`]}`}>{place.lab}</span>
            {settings.zeroTags && <span className={`${s.zeroTag} ${exists ? s[`c_${k}`] : ''}`}>{t.split.zeroTags[k]}</span>}
            <span className={`${s.dig} ${s[`c_${k}`]}`}>{exists ? v[k] : ''}</span>
            <span className={s.name}>{exists ? `${v[k]} ${v[k] === 1 ? place.one : place.many}` : '—'}</span>
            {settings.blocks && (
              <span className={s.blocks}>
                {exists && Array.from({ length: v[k] }, (_, j) => <span key={j} className={s[`blk_${k}`]} />)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ColoredNumber({ n }: { n: number }) {
  const str = String(n)
  const keys = KEYS.slice(3 - str.length)
  return <span className={s.number}>{str.split('').map((ch, i) => <span key={i} className={s[`c_${keys[i]}`]}>{ch}</span>)}</span>
}

/* ── Casette: la cifra va nella sua casa e gli zeri cadono nelle case vuote a destra ── */
function Houses({ part, say, onDone, interrupt = false }: { part: Part; say: (text: string, ms?: number) => Promise<void>; onDone?: () => void; interrupt?: boolean }) {
  const { t } = useT()
  const idx = KEYS.indexOf(part.k)
  const [zeros, setZeros]   = useState(0)
  const [count, setCount]   = useState('')
  const [result, setResult] = useState(false)
  const place = t.split.places[part.k]

  useEffect(() => {
    let alive = true
    if (interrupt) hush() // ferma solo un'animazione precedente (es. quella dell'aiuto), non il numero appena letto
    ;(async () => {
      await say(`${part.digit} ${part.digit === 1 ? place.one : place.many}`, 800); if (!alive) return
      if (ZEROS[part.k] === 0) { setCount(t.split.noHouse); await say(t.split.noZeros, 800); if (!alive) return }
      for (let z = 1; z <= ZEROS[part.k]; z++) {
        await wait(200); if (!alive) return
        setZeros(z); setCount(z === 1 ? `${t.split.oneZero}…` : `${t.split.twoZeros}…`)
        await say(z === 1 ? t.split.oneZero : t.split.twoZeros, 800); if (!alive) return
      }
      setResult(true)
      await say(String(part.value), 900); if (!alive) return
      await wait(300)
      if (alive) onDone?.()
    })()
    return () => { alive = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={s.houses}>
      <div className={s.row3}>{KEYS.map(k => <span key={k} className={`${s.houseLab} ${s[`c_${k}`]}`}>{t.split.places[k].lab}</span>)}</div>
      <div className={s.row3}>
        {KEYS.map((k, i) => (
          <div key={k} className={`${s.house} ${i >= idx ? s[`hb_${k}`] : s.houseOff}`}>
            {i === idx && <span className={s[`c_${k}`]}>{part.digit}</span>}
            {i > idx && i - idx <= zeros && <span className={s.zero}>0</span>}
          </div>
        ))}
      </div>
      <div className={s.count}>{count}</div>
      <div className={s.result}>{result && <>= <b className={s[`c_${part.k}`]}>{part.value}</b></>}</div>
    </div>
  )
}

/* ── 1. Costruisci ── */
function Build({ settings, speak }: { settings: SplitSettings; speak: (text: string, interrupt?: boolean) => Promise<void> }) {
  const { t } = useT()
  const [v, setV] = useState<Record<Key, number>>({ h: 0, d: 0, u: 0 })
  const n = v.h * 100 + v.d * 10 + v.u
  const parts = partsOf(n)

  const change = (k: Key, delta: number) => {
    const next = v[k] + delta
    if (next < 0) return
    if (next > 9) { speak(t.split.max9, true); return }
    const nv = { ...v, [k]: next }
    setV(nv)
    const nn = nv.h * 100 + nv.d * 10 + nv.u
    if (delta > 0 && nn > 0) speak(String(nn), true)
  }

  return (
    <>
      <p className={s.ask}>{t.split.buildAsk}</p>
      <p className={s.sub}>{t.split.buildSub}</p>
      {n > 0 ? <ColoredNumber n={n} /> : <span className={`${s.number} ${s.numberEmpty}`}>0</span>}
      <PlaceTable n={n} settings={settings} showEmptyAll={n === 0} />
      <div className={s.steppers}>
        {KEYS.map(k => (
          <div key={k} className={`${s.stepper} ${s[`c_${k}`]}`}>
            <button onClick={() => change(k, -1)} aria-label={`${t.split.remove} ${t.split.places[k].one}`}>−</button>
            <button onClick={() => change(k, 1)} aria-label={`${t.split.add} ${t.split.places[k].one}`}>+</button>
          </div>
        ))}
      </div>
      <div className={s.decomp}>
        {n > 0 && parts.length > 1 && (
          <>
            <span className={s.eqSoft}>{n} = </span>
            {parts.map((p, i) => <span key={p.k}>{i > 0 && <span className={s.eqSoft}> + </span>}<span className={s[`c_${p.k}`]}>{p.value}</span></span>)}
          </>
        )}
      </div>
      <p className={s.note}>{t.split.buildNote}</p>
    </>
  )
}

/* ── 2. Scomponi ── */
function pickNumbers(st: SplitSettings): number[] {
  const out: number[] = []
  let guard = 0
  while (out.length < QUESTIONS && guard++ < 2000) {
    const three = st.level === '3' || (st.level === 'mix' && Math.random() < 0.5)
    const n = three ? 100 + Math.floor(Math.random() * 900) : 10 + Math.floor(Math.random() * 90)
    const hasZero = String(n).includes('0')
    if (!st.zeros && hasZero) continue                       // niente zeri se non richiesti
    if (st.zeros && !hasZero && Math.random() < 0.5) continue // con gli zeri, circa metà dei numeri ne ha uno
    if (!out.includes(n)) out.push(n)
  }
  // con "Misti" si parte dai numeri a 3 cifre e poi si passa a quelli a 2: il confronto aiuta
  return st.level === 'mix' ? out.sort((a, b) => String(b).length - String(a).length) : out
}

function Split({ settings, speak, say, onFinish }: {
  settings: SplitSettings
  speak: (text: string, interrupt?: boolean) => Promise<void>
  say: (text: string, ms?: number) => Promise<void>
  onFinish: () => void
}) {
  const { t } = useT()
  const list = useMemo(() => pickNumbers(settings), [settings.level, settings.zeros]) // eslint-disable-line react-hooks/exhaustive-deps
  const [qi, setQi]           = useState(0)
  const [pi, setPi]           = useState(0)
  const [hint, setHint]       = useState(false)
  const [rhyme, setRhyme]     = useState(false)
  const [anim, setAnim]       = useState<'answer' | 'hint' | null>(null)
  const [animKey, setAnimKey] = useState(0)
  const [cut, setCut]         = useState(false)
  const [ending, setEnding]   = useState(false)
  const misses = useRef(0)
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false; hush() } }, [])

  const n = list[qi]
  const parts = useMemo(() => partsOf(n), [n])
  const part = parts[pi]
  const choices = useMemo(() => (part ? shuffle([part.digit, part.digit * 10, part.digit * 100]) : []), [part])

  useEffect(() => { speak(String(n), true) }, [n]) // eslint-disable-line react-hooks/exhaustive-deps

  const nextPart = () => {
    setAnim(null); setHint(false); setRhyme(false); misses.current = 0
    if (pi + 1 < parts.length) { setPi(pi + 1); return }
    // numero finito: la voce legge la scomposizione intera, poi si va avanti
    setPi(parts.length); setEnding(true)
    const sentence = `${n} ${t.split.equals} ${parts.map(p => p.value).join(` ${t.split.plus} `)}`
    say(sentence, 1500).then(() => wait(600)).then(() => {
      if (!alive.current) return
      setEnding(false)
      if (qi + 1 < list.length) { setQi(qi + 1); setPi(0) } else onFinish()
    })
  }

  const answer = (v: number, el: HTMLElement) => {
    if (!part || anim === 'answer' || ending) return
    if (v === part.value) {
      setHint(false); setRhyme(false)
      if (settings.houses) { setCut(anim === 'hint'); setAnim('answer'); setAnimKey(k => k + 1) }
      else {
        const place = t.split.places[part.k]
        say(`${part.digit} ${part.digit === 1 ? place.one : place.many}, ${part.value}`, 700).then(() => { if (alive.current) nextPart() })
      }
    } else {
      wiggle(el)
      misses.current += 1
      if (settings.autoHelp && misses.current >= 2) showHint()
    }
  }

  const showHint = () => {
    if (!part) return
    setRhyme(false); setHint(true)
    if (settings.houses) { setCut(anim !== null); setAnim('hint'); setAnimKey(k => k + 1) }
  }

  const showRhyme = () => {
    if (!part) return
    setHint(false); setAnim(null); setRhyme(true)
    speak(t.split.rhymes[part.k], true)
  }

  const place = part ? t.split.places[part.k] : null
  const c = part ? s[`c_${part.k}`] : ''

  return (
    <>
      <div className={s.progress}>{list.map((_, i) => <span key={i} className={i < qi ? s.pOk : i === qi ? s.pOn : ''} />)}</div>
      <ColoredNumber n={n} />
      {settings.table && <PlaceTable n={n} settings={settings} focus={part?.k} />}

      <div className={s.equation}>
        <span>{n} =</span>
        {parts.map((p, i) => (
          <span key={p.k} className={s.eqItem}>
            {i > 0 && <span>+</span>}
            <span className={[s.slot, s[`sb_${p.k}`], i < pi ? `${s.filled} ${s[`sf_${p.k}`]}` : '', i === pi && !ending ? s.cur : ''].join(' ')}>
              {i < pi ? p.value : ''}
            </span>
          </span>
        ))}
      </div>

      {anim && part && (
        <Houses key={animKey} part={part} say={say} interrupt={cut} onDone={anim === 'answer' ? nextPart : undefined} />
      )}

      {hint && part && place && (
        <div className={s.tip}>
          {t.split.the} <b className={c}>{part.digit}</b> {t.split.isIn} <b className={c}>{place.many}</b>. {t.split.right} {t.split.where[part.k]}:{' '}
          {part.k === 'u' ? t.split.noZeros : t.split[part.k === 'h' ? 'twoZeros' : 'oneZero']} → <b className={c}>{part.value}</b>
        </div>
      )}
      {rhyme && part && <div className={`${s.tip} ${c}`}>🎵 {t.split.rhymes[part.k]}</div>}

      {part && anim !== 'answer' && !ending && (
        <>
          <div className={s.choices}>
            {choices.map(v => (
              <button
                key={v}
                className={`${s.choice} ${c}${hint && v === part.value ? ` ${s.choiceHint}` : ''}`}
                onClick={e => answer(v, e.currentTarget)}
              >{v}</button>
            ))}
          </div>
          <div className={s.row}>
            <button className={s.btn} onClick={showHint}>{t.split.help}</button>
            <button className={s.btn} onClick={showRhyme}>{t.split.rhyme}</button>
          </div>
        </>
      )}
    </>
  )
}

/* ── Componente principale ── */
export default function SplitView({ onBack, allowSettings = false }: Props) {
  const { t } = useT()
  const [settings, setSettings]   = useState<SplitSettings>(SPLIT_DEFAULTS)
  const [tab, setTab]             = useState<'build' | 'split'>('split')
  const [run, setRun]             = useState(0)
  const [celeb, setCeleb]         = useState<Celebration | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [ready, setReady]         = useState(false)  // il gioco parte solo con le impostazioni salvate già caricate
  const { speak, say } = useVoice(settings.voice, t)

  useEffect(() => { setSettings(loadSplitSettings()); setReady(true) }, [])
  useEffect(() => () => hush(), [])

  const goTab = (next: 'build' | 'split') => { hush(); setCeleb(null); setTab(next); setRun(r => r + 1) }
  const finish = () => { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }

  let body: ReactNode
  if (!ready) {
    body = null
  } else if (celeb) {
    body = (
      <>
        <Tedo gag={celeb.gag} />
        <p className={s.winTitle}>{celeb.phrase}</p>
        <p className={s.sub}>{t.split.finished}</p>
        <button className={`${s.btn} ${s.main}`} onClick={() => { setCeleb(null); setRun(r => r + 1) }}>{t.split.again}</button>
      </>
    )
  } else if (tab === 'build') {
    body = <Build key={run} settings={settings} speak={speak} />
  } else {
    body = <Split key={run} settings={settings} speak={speak} say={say} onFinish={finish} />
  }

  return (
    <>
      <button className={s.back} onClick={() => { hush(); onBack() }}>{t.common.back}</button>
      <div className={s.header}>
        <h2 className={s.title}>{t.split.title}</h2>
        {allowSettings && <button className={s.gear} onClick={() => setShowPanel(p => !p)} aria-label="⚙️" aria-expanded={showPanel}>⚙️</button>}
      </div>
      <Buddy spot="scomponi" />
      {allowSettings && showPanel && <SplitSettingsPanel onChange={next => { setSettings(next); setCeleb(null); setRun(r => r + 1) }} />}
      <nav className={s.tabs}>
        <button className={s.tab} aria-current={tab === 'build'} onClick={() => goTab('build')}>{t.split.tabBuild}</button>
        <button className={s.tab} aria-current={tab === 'split'} onClick={() => goTab('split')}>{t.split.tabSplit}</button>
      </nav>
      <section className={s.card} aria-live="polite">{body}</section>
    </>
  )
}
