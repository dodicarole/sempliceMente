'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useT } from '@/lib/i18n'
import { autoStar } from '@/lib/stars'
import { pickCelebration, type Celebration } from '@/lib/fun'
import { useSpeech, hush, wait } from '@/hooks/useSpeech'
import { READ_STORIES, READ_DEFAULTS, loadReadSettings, saveReadSettings, type RStory, type ReadSettings } from '@/lib/readStories'
import SectionTitle from './SectionTitle'
import Tedo from './Tedo'
import s from './ReadUnderstand.module.css'
import p from './NumbersSettingsPanel.module.css'

const QCOLOR: Record<string, [string, string]> = { chi: ['👤', '#1C7ED6'], cosa: ['❓', '#7048E8'], quanti: ['🔢', '#F08C00'], dove: ['📍', '#2F9E44'], quando: ['🕐', '#0B7285'], perche: ['💭', '#E64980'] }
const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }

/**
 * Leggo e capisco: storie brevi a pezzetti. Prima si anticipa, poi le parole nuove,
 * poi un pezzetto alla volta con una domanda; dopo un errore la frase con la risposta si illumina.
 * Alla fine si rimettono in ordine le immagini e si racconta la storia con "prima, poi, dopo, alla fine".
 */
export default function ReadUnderstandView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const { t, lang } = useT()
  const T = t.readUnd
  const stories = READ_STORIES[lang === 'fr' ? 'fr' : 'it']
  const [st, setSt] = useState<ReadSettings>(READ_DEFAULTS)
  const [story, setStory] = useState<RStory | null>(null)
  useEffect(() => { setSt(loadReadSettings()) }, [])
  useEffect(() => () => hush(), [])
  return (
    <>
      <SectionTitle emoji="🔎" title={T.title} sub={T.homeSub} onBack={() => { hush(); story ? setStory(null) : onBack() }} spot="capisco" />
      {story ? <Story key={story.id} story={story} st={st} onEnd={() => setStory(null)} /> : (
        <>
          {stories.map(x => (
            <button key={x.id} className={s.story} onClick={() => setStory(x)}>
              <span className={s.cover}>{x.cover}</span>
              <span><span className={s.storyTitle}>{x.title}</span><span className={s.storyInfo}>{T.parts(x.parts.length)}</span></span>
            </button>
          ))}
          {allowSettings && <ReadUnderstandSettingsPanel onChange={setSt} />}
        </>
      )}
    </>
  )
}

function Story({ story, st, onEnd }: { story: RStory; st: ReadSettings; onEnd: () => void }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const T = t.readUnd
  const steps = useMemo(() => ['prima', ...(st.words ? ['parole'] : []), ...story.parts.map((_, i) => `pz${i}`), 'ordine', 'racconto'], [story, st.words])
  const [si, setSi] = useState(0)
  const step = steps[si]
  const next = () => { hush(); setSi(i => i + 1) }
  useEffect(() => {
    if (step === 'prima') speak(`${story.title}. ${story.guess}`)
    if (step === 'ordine') speak(T.orderTitle)
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div className={s.dots}>{steps.map((_, i) => <span key={i} className={i < si ? s.ok : i === si ? s.on : ''} />)}</div>
      <div className={s.card}>
        {step === 'prima' && (
          <>
            <div className={s.scene}>{story.cover}❓</div>
            <div className={s.h2}>{story.title}</div>
            <div className={s.sub}>{story.guess} {T.guessMore}</div>
            <button className={`${s.btn} ${s.main}`} onClick={next}>{T.discover}</button>
          </>
        )}
        {step === 'parole' && (
          <>
            <div className={s.h2}>{T.newWords}</div>
            <div className={s.sub}>{T.newWordsSub}</div>
            <div className={s.words}>{story.words.map(([e, w, d]) => (
              <button key={w} className={s.word} onClick={() => speak(`${w}. ${d}`)}><span className={s.wordE}>{e}</span><span><span className={s.wordB}>{w}</span><span className={s.wordD}>{d}</span></span></button>
            ))}</div>
            <button className={`${s.btn} ${s.main}`} onClick={next}>{T.understood}</button>
          </>
        )}
        {step.startsWith('pz') && <Part key={step} story={story} index={+step.slice(2)} st={st} onNext={next} />}
        {step === 'ordine' && <Order story={story} onDone={next} />}
        {step === 'racconto' && <Retell story={story} onEnd={onEnd} />}
      </div>
    </>
  )
}

/* Un pezzetto: la scena, il testo (frasi da toccare, parole nuove sottolineate), la domanda */
function Part({ story, index, st, onNext }: { story: RStory; index: number; st: ReadSettings; onNext: () => void }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const T = t.readUnd
  const part = story.parts[index], q = part.q
  const isWhy = q.t === 'perche'
  const ask = !isWhy || st.why
  const [reading, setReading] = useState<number | null>(null)
  const [answer, setAnswer] = useState(false)
  const [done, setDone] = useState(false)
  const run = useRef(0)
  const opts = useMemo(() => { const ok = q.opts.find(o => o.ok)!; return shuffle([ok, ...shuffle(q.opts.filter(o => !o.ok)).slice(0, st.choices - 1)]) }, [q, st.choices])
  const words = story.words.map(w => w[1].toLowerCase())

  // la voce legge le frasi una dopo l'altra, illuminando quella che legge
  const read = async () => {
    const my = ++run.current; hush(); setAnswer(false)
    for (let i = 0; i < part.text.length; i++) {
      if (my !== run.current) break
      setReading(i); await speak(part.text[i], { interrupt: false }); await wait(150)
    }
    if (my === run.current) { setReading(null); if (ask && !done) speak(q.text, { interrupt: false }) }
  }
  useEffect(() => { if (st.auto) { const h = setTimeout(read, 300); return () => clearTimeout(h) } else if (ask) speak(q.text) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { run.current++ }, [])

  // una frase con le parole nuove sottolineate
  const sentence = (txt: string) => {
    const out: React.ReactNode[] = []
    txt.split(/(\s+)/).forEach((tok, k) => {
      const clean = tok.toLowerCase().replace(/[.,!?;:’']/g, '')
      out.push(words.includes(clean) ? <b key={k} className={s.w} onClick={e => { e.stopPropagation(); const w = story.words.find(x => x[1].toLowerCase() === clean); if (w) speak(`${w[1]}. ${w[2]}`) }}>{tok}</b> : tok)
    })
    return out
  }
  const choose = async (ok: boolean, el: HTMLElement) => {
    if (done) return
    run.current++; setReading(null)
    if (ok) { setDone(true); setAnswer(true); await speak(`${T.right} ${part.text[q.ans]}`) }
    else { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong); setAnswer(true); speak(isWhy ? T.hintWhyV : T.hintTextV) }
  }
  return (
    <>
      <div className={s.scene}>{part.scene}</div>
      <div className={s.text}>
        {part.text.map((x, i) => (
          <span key={i}><span className={`${s.s}${reading === i ? ` ${s.reading}` : ''}${answer && i === q.ans ? ` ${s.answer}` : ''}`} onClick={() => speak(x)}>{sentence(x)}</span>{' '}</span>
        ))}
      </div>
      <button className={`${s.btn} ${s.blue}`} onClick={read}>{T.listen}</button>
      {ask ? (
        <div className={s.q}>
          <span className={s.qtag} style={{ background: QCOLOR[q.t][1] }}>{QCOLOR[q.t][0]} {T.qt[q.t]}</span>
          <div className={s.qtext}>{q.text}</div>
          <div className={s.opts}>
            {opts.map(o => (
              <button key={o.text} className={`${s.opt}${done && o.ok ? ` ${s.right}` : ''}`} onClick={e => choose(!!o.ok, e.currentTarget)}><span className={s.optE}>{o.e}</span>{o.text}</button>
            ))}
          </div>
          {answer && !done && <div className={s.hint}>{isWhy ? T.hintWhy : T.hintText}</div>}
        </div>
      ) : null}
      {(done || !ask) && <button className={`${s.btn} ${s.main}`} onClick={onNext}>{T.next}</button>}
    </>
  )
}

/* Rimettere in ordine le immagini della storia: si toccano nell'ordine giusto */
function Order({ story, onDone }: { story: RStory; onDone: () => void }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const T = t.readUnd
  const cards = useMemo(() => shuffle(story.seq.map((x, i) => ({ e: x[0], l: x[1], i }))), [story])
  const [k, setK] = useState(0)
  const tap = (c: { e: string; l: string; i: number }, el: HTMLElement) => {
    if (c.i < k) return
    if (c.i === k) { speak(c.l); setK(k + 1) } else { el.classList.remove(s.wrong); void el.offsetWidth; el.classList.add(s.wrong) }
  }
  return (
    <>
      <div className={s.h2}>{T.orderTitle}</div>
      <div className={s.sub}>{T.orderSub}</div>
      <div className={s.order}>
        {cards.map(c => (
          <button key={c.i} className={`${s.oimg}${c.i < k ? ` ${s.used}` : ''}`} aria-label={c.l} onClick={e => tap(c, e.currentTarget)}>
            {c.e}{c.i < k && <span className={s.n}>{c.i + 1}</span>}
          </button>
        ))}
      </div>
      {k === story.seq.length && <button className={`${s.btn} ${s.main}`} onClick={onDone}>{T.orderDone}</button>}
    </>
  )
}

/* Raccontare la storia con le parole guida; la festa di Tedo e una stellina */
function Retell({ story, onEnd }: { story: RStory; onEnd: () => void }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const T = t.readUnd
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  useEffect(() => { autoStar(); const c = pickCelebration(t); setCeleb(c); speak(c.phrase) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <Tedo gag={celeb?.gag ?? null} />
      <div className={s.h2}>{T.retellTitle}</div>
      <div className={s.sub}>{T.retellSub}</div>
      <div className={s.retell}>{story.seq.map(([e, l], i) => (
        <div key={i} className={s.rt}><span className={s.rtE}>{e}</span><span><span className={s.rtB}>{T.lead[i]}…</span><span className={s.rtT}>{l}</span></span></div>
      ))}</div>
      <button className={`${s.btn} ${s.blue}`} onClick={() => speak(story.seq.map(([, l], i) => `${T.lead[i]}, ${l}`).join('. ') + '.')}>{T.retellListen}</button>
      <button className={`${s.btn} ${s.main}`} onClick={onEnd}>{T.another}</button>
    </>
  )
}

/** Impostazioni (area Genitore; nella demo nell'elenco delle storie) */
export function ReadUnderstandSettingsPanel({ onChange }: { onChange?: (v: ReadSettings) => void }) {
  const { t } = useT()
  const T = t.readUnd
  const [st, setSt] = useState<ReadSettings>(READ_DEFAULTS)
  const [saved, setSaved] = useState(false)
  useEffect(() => { setSt(loadReadSettings()) }, [])
  const set = (n: ReadSettings) => { setSt(n); saveReadSettings(n); setSaved(true); onChange?.(n) }
  const yn = (k: 'words' | 'why' | 'auto', label: string) => (
    <div className={p.group}>
      <span className={p.label}>{label}</span>
      <div className={p.chips}>{([[true, t.reading.yes], [false, t.reading.no]] as [boolean, string][]).map(([v, l]) => <button key={l} className={p.chip} aria-pressed={st[k] === v} onClick={() => set({ ...st, [k]: v })}>{l}</button>)}</div>
    </div>
  )
  return (
    <div className={p.panel} style={{ width: '100%', textAlign: 'left' }}>
      {yn('words', T.setWords)}
      <div className={p.group}>
        <span className={p.label}>{T.setChoices}</span>
        <div className={p.chips}>{([2, 3] as const).map(n => <button key={n} className={p.chip} aria-pressed={st.choices === n} onClick={() => set({ ...st, choices: n })}>{n}</button>)}</div>
      </div>
      {yn('why', T.setWhy)}
      {yn('auto', T.setAuto)}
      {saved && <div className={p.saved}>{t.common.saved}</div>}
    </div>
  )
}
