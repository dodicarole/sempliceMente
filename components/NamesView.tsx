'use client'
import { useState, useEffect, useCallback, useMemo, useRef, type ReactNode } from 'react'
import { useT } from '@/lib/i18n'
import { pickCelebration, type Celebration } from '@/lib/fun'
import { WORDS, CLASSES, MODES, withArticle, genderIcon, type Word, type ModeId, type ClassId } from '@/lib/namesData'
import { NAMES_DEFAULTS, loadNamesSettings, type NamesSettings } from '@/lib/namesSettings'
import NamesSettingsPanel from './NamesSettingsPanel'
import Tedo from './Tedo'
import s from './NamesView.module.css'

interface Props {
  onBack: () => void
  /** Ingranaggio delle impostazioni dentro il gioco (solo demo, dove non c'è l'area Genitore) */
  allowSettings?: boolean
}

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms))
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}
function wiggle(el: HTMLElement) { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }

/* Voce in italiano: le frasi si mettono in fila e non si interrompono a vicenda */
const keep: SpeechSynthesisUtterance[] = []
function hush() { try { window.speechSynthesis.cancel() } catch (_) {} }
function useVoice(enabled: boolean) {
  const speak = useCallback((text: string, interrupt = false) => new Promise<void>(resolve => {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return resolve()
    let done = false
    const fin = () => { if (!done) { done = true; resolve() } }
    try {
      const synth = window.speechSynthesis
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'it-IT'; u.rate = 0.85
      const v = synth.getVoices().find(v => v.lang.toLowerCase().startsWith('it'))
      if (v) u.voice = v
      u.onend = fin; u.onerror = fin
      keep.push(u); if (keep.length > 20) keep.shift()
      setTimeout(fin, 2000 + text.length * 120)
      // dopo cancel() alcuni browser ignorano la frase successiva se arriva subito: aspettiamo un attimo
      if (interrupt) { synth.cancel(); setTimeout(() => synth.speak(u), 80) } else synth.speak(u)
    } catch (_) { fin() }
  }), [enabled])
  const say = useCallback((text: string, ms = 600) => Promise.all([speak(text), wait(ms)]).then(() => {}), [speak])
  return { speak, say }
}

/** Le parole della partita: in "comune o proprio" metà sono nomi propri */
function pickWords(mode: ModeId, count: number): Word[] {
  if (mode === 'tipo') {
    const pr = shuffle(WORDS.filter(x => x.pr)), co = shuffle(WORDS.filter(x => !x.pr))
    const half = Math.min(Math.ceil(count / 2), pr.length)
    return shuffle([...pr.slice(0, half), ...co.slice(0, count - half)])
  }
  if (mode === 'numero') return shuffle(WORDS.filter(x => !x.pr)).slice(0, count) // i nomi propri sono tutti singolari
  return shuffle(WORDS).slice(0, count)
}

/** Il suggerimento: insegna un trucco, non dà la risposta */
function hintFor(id: ClassId, x: Word): ReactNode {
  switch (id) {
    case 'categoria':
      return <>Chiediti: <b>è una persona?</b> Parla e va a scuola. <b>È un animale?</b> Ha zampe, ali o pinne. Se non è né l&apos;una né l&apos;altra, <b>è una cosa</b>.</>
    case 'tipo':
      return <>Guarda la <b>prima lettera</b>. I nomi propri sono i nomi &quot;personali&quot; di qualcuno, come Luca o Fido, e cominciano sempre con la <b>lettera MAIUSCOLA</b>.</>
    case 'genere':
      return x.pr
        ? <>Pensa a chi è: <b>{x.w}</b> è {x.g === 'm' ? <>un maschio → <b>maschile</b></> : <>una femmina → <b>femminile</b></>}.</>
        : <>Prova a dire la parola con <b>{genderIcon(x, 'm').toLowerCase()}</b> o con <b>{genderIcon(x, 'f').toLowerCase()}</b> davanti. Quale suona bene? «{withArticle(x)}» → <b>{x.g === 'm' ? 'maschile' : 'femminile'}</b>.</>
    case 'numero':
      return <>Quanti sono? Se è <b>uno solo</b> è singolare, se sono <b>tanti</b> è plurale. Guarda le immagini: {x.n === 's' ? <>ce n&apos;è una sola → <b>singolare</b>.</> : <>sono tante → <b>plurale</b>.</>}</>
  }
}
const hintText: Record<ClassId, (x: Word) => string> = {
  categoria: () => "Chiediti: è una persona? È un animale? Se non è né l'una né l'altra, è una cosa.",
  tipo: () => 'Guarda la prima lettera. I nomi propri cominciano con la lettera maiuscola.',
  genere: x => (x.pr ? `${x.w} è ${x.g === 'm' ? 'maschile' : 'femminile'}.` : `Prova a dire la parola con l'articolo davanti. ${withArticle(x)}.`),
  numero: x => (x.n === 's' ? 'Ce n\'è uno solo: singolare.' : 'Sono tanti: plurale.'),
}

function Game({ mode, settings, speak, say, onFinish }: {
  mode: ModeId; settings: NamesSettings
  speak: (text: string, interrupt?: boolean) => Promise<void>
  say: (text: string, ms?: number) => Promise<void>
  onFinish: () => void
}) {
  const steps = MODES.find(m => m.id === mode)!.steps
  const multi = steps.length > 1
  const list = useMemo(() => pickWords(mode, settings.count), [mode, settings.count])
  const [qi, setQi]         = useState(0)
  const [si, setSi]         = useState(0)
  const [hint, setHint]     = useState(false)
  const [locked, setLocked] = useState(false)
  const [fly, setFly]       = useState(false)
  const [tags, setTags]     = useState<{ text: string; color: string }[]>([])
  const [doneAll, setDone]  = useState(false)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const misses = useRef(0)
  const alive = useRef(true)
  useEffect(() => { alive.current = true; return () => { alive.current = false; hush() } }, [])

  const x = list[qi]
  const id = steps[si]
  const C = CLASSES[id]
  const right = C.boxes.find(b => b.v === C.key(x))!

  useEffect(() => { speak(x.w, true) }, [qi]) // eslint-disable-line react-hooks/exhaustive-deps

  const next = () => {
    if (!alive.current) return
    if (qi + 1 < list.length) { setQi(qi + 1); setSi(0); setTags([]); setDone(false); setFly(false); setLocked(false); setHint(false); misses.current = 0 }
    else onFinish()
  }

  const answer = (v: string, color: string, label: string, el: HTMLElement) => {
    if (locked) return
    if (v === C.key(x)) {
      setLocked(true); setHint(false)
      const tag = C.tag(x)
      if (multi) setTags(tg => [...tg, { text: tag, color }])
      else { setCounts(c => ({ ...c, [v]: (c[v] ?? 0) + 1 })); setFly(true) }
      say(`${x.w}: ${multi ? tag : label.toLowerCase()}`, 700).then(() => {
        if (!alive.current) return
        if (si + 1 < steps.length) { setSi(si + 1); setLocked(false); misses.current = 0; return }
        if (multi) {
          // l'analisi completa viene letta per intero
          setDone(true)
          say(`${x.w}: ${steps.map(k => CLASSES[k].tag(x)).join(', ')}`, 1400).then(() => wait(500)).then(next)
        } else next()
      })
    } else {
      wiggle(el)
      misses.current += 1
      if (settings.autoHelp && misses.current >= 2) showHint()
    }
  }

  const showHint = () => { setHint(true); speak(hintText[id](x), true) }
  const firstLetter = hint && id === 'tipo'

  return (
    <>
      <div className={s.progress}>{list.map((_, i) => <span key={i} className={i < qi ? s.pOk : i === qi ? s.pOn : ''} />)}</div>
      {multi && <div className={s.step}>Passo {Math.min(si + 1, steps.length)} di {steps.length}</div>}
      <p className={s.ask}>{doneAll ? "Ecco l'analisi!" : C.q}</p>

      <button
        key={qi}
        className={`${s.word}${fly ? ` ${s.fly}` : ''}${settings.colorHint && !doneAll ? ` ${s.colored}` : ''}`}
        style={settings.colorHint && !doneAll ? { borderColor: `var(--${right.color})` } : undefined}
        onClick={() => speak(x.w, true)}
        aria-label={x.w}
      >
        {settings.pics && <span className={s.pic}>{x.n === 'p' ? x.e.repeat(3) : x.e}</span>}
        <span className={s.w}>{firstLetter ? <><span className={s.first}>{x.w[0]}</span>{x.w.slice(1)}</> : x.w}</span>
      </button>

      {multi && (
        <div className={s.analysis}>
          {tags.map((tg, i) => <span key={i} className={s.tag} style={{ color: `var(--${tg.color})`, background: `var(--${tg.color}-bg)` }}>{tg.text}</span>)}
        </div>
      )}

      {!doneAll && (
        <div className={`${s.boxes} ${C.boxes.length === 3 ? s.n3 : s.n2}`}>
          {C.boxes.map(b => (
            <button
              key={b.v}
              className={`${s.box}${hint && b.v === right.v ? ` ${s.hint}` : ''}`}
              style={{ color: `var(--${b.color})`, background: `var(--${b.color}-bg)` }}
              onClick={e => answer(b.v, b.color, b.t, e.currentTarget)}
            >
              <span className={s.ic}>{b.ic(x)}</span>
              <span>{b.t}</span>
              {b.sm && <span className={s.sm}>{b.sm}</span>}
              {!multi && <span className={s.cnt}>{counts[b.v] ? `✓ ${counts[b.v]}` : ''}</span>}
            </button>
          ))}
        </div>
      )}

      {hint && !doneAll && <div className={s.tip}>💡 {hintFor(id, x)}</div>}
      {!doneAll && !hint && <button className={s.btn} onClick={showHint}>💡 Aiuto</button>}
    </>
  )
}

export default function NamesView({ onBack, allowSettings = false }: Props) {
  const { t } = useT()
  const [settings, setSettings]   = useState<NamesSettings>(NAMES_DEFAULTS)
  const [mode, setMode]           = useState<ModeId>('categoria')
  const [run, setRun]             = useState(0)
  const [celeb, setCeleb]         = useState<Celebration | null>(null)
  const [showPanel, setShowPanel] = useState(false)
  const [ready, setReady]         = useState(false)  // il gioco parte solo con le impostazioni salvate già caricate
  const { speak, say } = useVoice(settings.voice)

  useEffect(() => { setSettings(loadNamesSettings()); setReady(true) }, [])
  useEffect(() => () => hush(), [])

  const goMode = (m: ModeId) => { hush(); setCeleb(null); setMode(m); setRun(r => r + 1) }
  const finish = () => { const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }

  return (
    <>
      <button className={s.back} onClick={() => { hush(); onBack() }}>{t.common.back}</button>
      <div className={s.header}>
        <h2 className={s.title}>Classifica i nomi</h2>
        {allowSettings && <button className={s.gear} onClick={() => setShowPanel(p => !p)} aria-label="Impostazioni" aria-expanded={showPanel}>⚙️</button>}
      </div>
      {allowSettings && showPanel && <NamesSettingsPanel onChange={next => { setSettings(next); setCeleb(null); setRun(r => r + 1) }} />}
      <nav className={s.modes}>
        {MODES.map(m => (
          <button key={m.id} className={s.mode} aria-current={m.id === mode} onClick={() => goMode(m.id)}>{m.label}</button>
        ))}
      </nav>
      <section className={s.card} aria-live="polite">
        {!ready ? null : celeb ? (
          <>
            <Tedo gag={celeb.gag} />
            <p className={s.winTitle}>{celeb.phrase}</p>
            <button className={`${s.btn} ${s.main}`} onClick={() => { setCeleb(null); setRun(r => r + 1) }}>🔄 Ancora</button>
          </>
        ) : (
          <Game key={`${mode}-${run}`} mode={mode} settings={settings} speak={speak} say={say} onFinish={finish} />
        )}
      </section>
    </>
  )
}
