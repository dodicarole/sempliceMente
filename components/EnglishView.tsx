'use client'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { pickCelebration } from '@/lib/fun'
import { TOPICS, PHRASES, EN_PRAISE, enOf, type EnItem, type TopicId, type Accent } from '@/lib/englishData'
import { ENGLISH_DEFAULTS, loadEnglishSettings, type EnglishSettings } from '@/lib/englishSettings'
import EnglishSettingsPanel from './EnglishSettingsPanel'
import Tedo from './Tedo'
import type { Gag } from '@/lib/fun'
import s from './EnglishView.module.css'

interface Props {
  onBack: () => void
  /** Ingranaggio delle impostazioni dentro il gioco (solo demo, dove non c'è l'area Genitore) */
  allowSettings?: boolean
}

type Tab = 'learn' | 'find' | 'phrase'
const ROUNDS = 8
const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }
const clean = (text: string) => text.replace('…', '')

/* ── Voce: inglese (britannico o americano) per le parole, lingua del bambino per le istruzioni ── */
const keep: SpeechSynthesisUtterance[] = []
function hush() { try { window.speechSynthesis.cancel() } catch (_) {} }
type Speak = (text: string, opts?: { lang?: string; rate?: number; interrupt?: boolean }) => Promise<void>

function useVoice(accent: Accent, rate: number): Speak {
  return useCallback((text, opts = {}) => new Promise<void>(resolve => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve()
    let done = false
    const fin = () => { if (!done) { done = true; resolve() } }
    try {
      const synth = window.speechSynthesis
      const lang = opts.lang ?? accent
      const u = new SpeechSynthesisUtterance(text)
      u.lang = lang
      u.rate = opts.rate ?? rate
      const voices = synth.getVoices()
      const v = voices.find(v => v.lang.replace('_', '-') === lang) ?? voices.find(v => v.lang.toLowerCase().startsWith(lang.slice(0, 2)))
      if (v) u.voice = v
      u.onend = fin; u.onerror = fin
      keep.push(u); if (keep.length > 20) keep.shift()
      setTimeout(fin, 2500 + text.length * 150)
      // dopo cancel() alcuni browser ignorano la frase successiva se arriva subito: aspettiamo un attimo
      if (opts.interrupt) { synth.cancel(); setTimeout(() => synth.speak(u), 80) } else synth.speak(u)
    } catch (_) { fin() }
  }), [accent, rate])
}

/** L'immagine della parola: emoji, cerchio colorato o numero con i pallini in file da 5 */
function Visual({ x, small = false }: { x: EnItem; small?: boolean }) {
  if (x.e) return <span className={small ? s.picSmall : s.pic}>{x.e}</span>
  if (x.c) return <span className={small ? s.swatchSmall : s.swatch} style={{ background: x.c }} />
  return (
    <span className={s.num}>
      <span className={small ? s.digitSmall : s.digit}>{x.n}</span>
      <span className={small ? s.countSmall : s.count}>{Array.from({ length: x.n ?? 0 }, (_, i) => <i key={i} />)}</span>
    </span>
  )
}

/* ── 1. Scopri ── */
function Learn({ items, settings, speak }: { items: EnItem[]; settings: EnglishSettings; speak: Speak }) {
  const { t, lang } = useT()
  const [i, setI] = useState(0)
  const [busy, setBusy] = useState(false)
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  const x = items[i]
  const word = enOf(x, settings.accent)

  useEffect(() => { speak(word, { interrupt: true }) }, [i, word]) // eslint-disable-line react-hooks/exhaustive-deps

  // "Ripeti con me": la parola lenta, una pausa per ripeterla, poi di nuovo. Nessun voto.
  const repeat = async () => {
    setBusy(true); hush()
    await Promise.all([speak(word, { rate: 0.6 }), wait(600)]); if (!alive.current) return
    await Promise.all([speak(t.english.yourTurn, { lang: t.locale, rate: 0.9 }), wait(400)]); if (!alive.current) return
    await wait(1800); if (!alive.current) return
    await Promise.all([speak(word, { rate: 0.6 }), wait(600)])
    if (alive.current) setBusy(false)
  }

  return (
    <>
      <p className={s.sub}>{t.english.learnSub}</p>
      <div className={s.dots}>{items.map((_, k) => <span key={k} className={k === i ? s.on : ''} />)}</div>
      <button key={i} className={s.flash} onClick={() => speak(word, { interrupt: true })} aria-label={word}>
        <Visual x={x} />
        {settings.written && <span className={s.eng}>{word}</span>}
        {settings.translation && <span className={s.tr}>{x.tr[lang]}</span>}
      </button>
      <div className={s.row}>
        <button className={`${s.btn} ${s.big}`} onClick={() => speak(word, { interrupt: true })}>{t.english.listen}</button>
        <button className={s.btn} onClick={repeat} disabled={busy}>{t.english.repeat}</button>
      </div>
      <div className={s.nav}>
        <button className={s.btn} onClick={() => setI(i - 1)} disabled={i === 0}>{t.english.prev}</button>
        <button className={s.btn} onClick={() => setI((i + 1) % items.length)}>{i === items.length - 1 ? t.english.restart : t.english.next}</button>
      </div>
    </>
  )
}

/* ── 2. Ascolta e trova ── */
function Find({ items, settings, speak, onFinish }: { items: EnItem[]; settings: EnglishSettings; speak: Speak; onFinish: () => void }) {
  const { t } = useT()
  const rounds = useMemo(() => shuffle(items).slice(0, ROUNDS), [items])
  const [qi, setQi]     = useState(0)
  const [hint, setHint] = useState(false)
  const [done, setDone] = useState(false)
  const misses = useRef(0)
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])

  const x = rounds[qi]
  const word = enOf(x, settings.accent)
  const options = useMemo(() => shuffle([x, ...shuffle(items.filter(y => y !== x)).slice(0, settings.choices - 1)]), [x, items, settings.choices])

  useEffect(() => { speak(word, { interrupt: true }) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps

  const pick = async (o: EnItem, el: HTMLElement) => {
    if (done) return
    if (o === x) {
      setDone(true); setHint(false)
      await Promise.all([speak(`Yes! ${word}!`), wait(900)]); await wait(400)
      if (!alive.current) return
      if (qi + 1 < rounds.length) { setQi(qi + 1); setDone(false); misses.current = 0 } else onFinish()
    } else {
      wiggle(el)
      misses.current += 1
      if (settings.autoHelp && misses.current >= 2) { setHint(true); speak(word, { rate: 0.6, interrupt: true }) }
    }
  }

  return (
    <>
      <div className={s.dots}>{rounds.map((_, k) => <span key={k} className={k < qi ? s.ok : k === qi ? s.on : ''} />)}</div>
      <p className={s.ask}>{t.english.findAsk}</p>
      <button className={s.ear} onClick={() => speak(word, { interrupt: true })} aria-label={t.english.listenAgain}>👂</button>
      <div className={`${s.grid} ${options.length === 3 ? s.n3 : s.n2}`}>
        {options.map(o => (
          <button
            key={enOf(o, settings.accent)}
            className={`${s.opt}${done && o === x ? ` ${s.right}` : ''}${hint && o === x ? ` ${s.optHint}` : ''}`}
            onClick={e => pick(o, e.currentTarget)}
          >
            <Visual x={o} small />
            <span className={s.lbl}>{done && o === x && settings.written ? word : ''}</span>
          </button>
        ))}
      </div>
    </>
  )
}

/* ── 3. Frase del giorno ── */
function Phrase({ settings, speak }: { settings: EnglishSettings; speak: Speak }) {
  const { t, lang } = useT()
  const dayIndex = useMemo(() => Math.floor(Date.now() / 86400000) % PHRASES.length, [])
  const [i, setI] = useState(dayIndex)
  const [busy, setBusy] = useState(false)
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false } }, [])
  const x = PHRASES[i]
  const text = enOf(x, settings.accent)

  useEffect(() => { speak(clean(text), { interrupt: true }) }, [i]) // eslint-disable-line react-hooks/exhaustive-deps

  const repeat = async () => {
    setBusy(true); hush()
    await Promise.all([speak(clean(text), { rate: 0.6 }), wait(600)]); if (!alive.current) return
    await Promise.all([speak(t.english.yourTurn, { lang: t.locale, rate: 0.9 }), wait(400)]); if (!alive.current) return
    await wait(2400); if (!alive.current) return
    await Promise.all([speak(clean(text), { rate: 0.6 }), wait(600)])
    if (alive.current) setBusy(false)
  }

  return (
    <>
      <button key={i} className={s.flash} onClick={() => speak(clean(text), { interrupt: true })} aria-label={text}>
        <span className={s.today}>{i === dayIndex ? t.english.today : t.english.another}</span>
        <span className={s.pic}>{x.e}</span>
        <span className={s.phrase}>{text}</span>
        {settings.translation && <span className={s.tr}>{x.tr[lang]}</span>}
      </button>
      <div className={s.row}>
        <button className={`${s.btn} ${s.big}`} onClick={() => speak(clean(text), { interrupt: true })}>{t.english.listen}</button>
        <button className={s.btn} onClick={repeat} disabled={busy}>{t.english.repeat}</button>
      </div>
      <div className={s.nav}>
        <button className={s.btn} onClick={() => setI((i - 1 + PHRASES.length) % PHRASES.length)}>{t.english.prev}</button>
        <button className={s.btn} onClick={() => setI((i + 1) % PHRASES.length)}>{t.english.next}</button>
      </div>
    </>
  )
}

/* ── Componente principale ── */
export default function EnglishView({ onBack, allowSettings = false }: Props) {
  const { t } = useT()
  const [settings, setSettings]   = useState<EnglishSettings>(ENGLISH_DEFAULTS)
  const [ready, setReady]         = useState(false)
  const [topic, setTopic]         = useState<TopicId>('animals')
  const [tab, setTab]             = useState<Tab>('learn')
  const [run, setRun]             = useState(0)
  const [celeb, setCeleb]         = useState<{ gag: Gag | null; phrase: string } | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const speak = useVoice(settings.accent, settings.rate)

  useEffect(() => { setSettings(loadEnglishSettings()); setReady(true) }, [])
  useEffect(() => () => hush(), [])

  const items = TOPICS.find(tp => tp.id === topic)!.items
  const restart = () => { hush(); setCeleb(null); setRun(r => r + 1) }

  // Tedo festeggia, ma le frasi sono in inglese
  const finish = () => {
    const phrase = EN_PRAISE[Math.floor(Math.random() * EN_PRAISE.length)]
    setCeleb({ gag: pickCelebration(t).gag, phrase })
    speak(phrase, { interrupt: true })
  }

  return (
    <>
      <button className={s.back} onClick={() => { hush(); onBack() }}>{t.common.back}</button>
      <div className={s.header}>
        <div>
          <h2 className={s.title}>{t.english.title} {settings.accent === 'en-US' ? '🇺🇸' : '🇬🇧'}</h2>
          <p className={s.headerSub}>{t.english.homeSub}</p>
        </div>
        {allowSettings && <button className={s.gear} onClick={() => setShowPanel(p => !p)} aria-label="⚙️" aria-expanded={showPanel}>⚙️</button>}
      </div>
      {allowSettings && showPanel && <EnglishSettingsPanel onChange={next => { setSettings(next); restart() }} />}

      {tab !== 'phrase' && (
        <nav className={s.topics}>
          {TOPICS.map(tp => (
            <button key={tp.id} className={s.pill} aria-current={tp.id === topic} onClick={() => { setTopic(tp.id); restart() }}>
              {tp.icon} {t.english.topics[tp.id]} · {settings.accent === 'en-US' ? tp.en.us : tp.en.gb}
            </button>
          ))}
        </nav>
      )}
      <nav className={s.tabs}>
        {(['learn', 'find', 'phrase'] as Tab[]).map(k => (
          <button key={k} className={s.tab} aria-current={tab === k} onClick={() => { setTab(k); restart() }}>
            {k === 'learn' ? t.english.tabLearn : k === 'find' ? t.english.tabFind : t.english.tabPhrase}
          </button>
        ))}
      </nav>

      <section className={s.card} aria-live="polite">
        {!ready ? null : celeb ? (
          <>
            <Tedo gag={celeb.gag} />
            <p className={s.eng}>{celeb.phrase}</p>
            <p className={s.sub}>{t.english.found(ROUNDS)}</p>
            <button className={`${s.btn} ${s.main}`} onClick={restart}>{t.english.again}</button>
          </>
        ) : tab === 'learn' ? (
          <Learn key={`${topic}-${run}`} items={items} settings={settings} speak={speak} />
        ) : tab === 'find' ? (
          <Find key={`${topic}-${run}`} items={items} settings={settings} speak={speak} onFinish={finish} />
        ) : (
          <Phrase key={run} settings={settings} speak={speak} />
        )}
      </section>
    </>
  )
}
