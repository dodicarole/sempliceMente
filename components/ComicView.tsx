'use client'
import { useState, useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { CHARS, type Comic } from '@/lib/comics'
import { autoStar } from '@/lib/stars'
import { useSpeech, hush, wait } from '@/hooks/useSpeech'
import s from './Comic.module.css'

/**
 * Una storia a fumetto. Il testo segue le impostazioni di lettura del figlio
 * (maiuscolo, carattere, grandezza) perché la sezione è dentro "reading-area".
 */
export default function ComicView({ comic, onBack }: { comic: Comic; onBack: () => void }) {
  const { t, lang } = useT()
  const { speak } = useSpeech()
  const [mode, setMode] = useState<'one' | 'all'>('one')
  const [cur, setCur] = useState(0)
  const [reading, setReading] = useState<number | null>(null)
  const [part, setPart] = useState<number | null>(null)       // quale riquadro della vignetta si sta leggendo
  const run = useRef(0), starred = useRef(false)
  useEffect(() => () => { run.current++; hush() }, [])

  /** Legge una vignetta: prima il racconto, poi le nuvolette; ogni personaggio con il suo tono */
  const readPanel = async (i: number): Promise<boolean> => {
    const my = ++run.current; hush()
    setReading(i)
    const p = comic.panels[i]
    const parts: { text: string; pitch: number }[] = [{ text: p.cap[lang], pitch: 1 }, ...p.bubbles.map(b => ({
      text: b.kind === 'think' ? `${t.comics.thinks(CHARS[b.who].name)}: ${b.text[lang]}` : b.text[lang], pitch: CHARS[b.who].pitch,
    }))]
    for (let k = 0; k < parts.length; k++) {
      if (my !== run.current) return false
      setPart(k)
      await speak(parts[k].text, { interrupt: false, pitch: parts[k].pitch }); await wait(250)
    }
    if (my !== run.current) return false
    setPart(null)
    if (i === comic.panels.length - 1 && !starred.current) { starred.current = true; autoStar() }   // fumetto finito: una stellina
    return true
  }
  const readAll = async () => {
    for (let i = 0; i < comic.panels.length; i++) {
      document.getElementById(`vignetta-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      await wait(400)
      if (!(await readPanel(i))) return
      await wait(300)
    }
  }
  const go = (i: number) => { setCur(i); setTimeout(() => readPanel(i), 50) }
  useEffect(() => { readPanel(0) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const panel = (i: number) => {
    const p = comic.panels[i]
    return (
      <button key={i} id={`vignetta-${i}`} className={`${s.panel}${reading === i ? ` ${s.reading}` : ''}`} onClick={() => readPanel(i)}>
        <div dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 400 300" aria-hidden="true">${p.svg}</svg>` }} />
        <div className={`${s.cap}${reading === i && part === 0 ? ` ${s.on}` : ''}`}>{p.cap[lang]}</div>
        {p.bubbles.map((b, k) => (
          <div key={k} className={`${s.bub} ${b.kind === 'think' ? s.think : ''} ${s[b.tail]}${b.big ? ` ${s.big}` : ''}${b.small ? ` ${s.small}` : ''}${reading === i && part === k + 1 ? ` ${s.on}` : ''}`}
            style={{ left: `${b.x}%`, top: `${b.y}%` }}>
            <span className={s.who} style={{ color: CHARS[b.who].color }}>{b.kind === 'think' ? t.comics.thinks(CHARS[b.who].name) : CHARS[b.who].name}</span>
            {b.text[lang]}
          </div>
        ))}
        <span className={s.num}>{i + 1}/{comic.panels.length}</span>
      </button>
    )
  }

  return (
    <>
      <button className={s.back} onClick={() => { run.current++; hush(); onBack() }}>{t.common.back}</button>
      <div className={s.title}><span className={s.titleEm}>{comic.icon}</span><div><div className={s.titleText}>{comic.title[lang]}</div><div className={s.titleSub}>{t.comics.panels(comic.panels.length)}</div></div></div>
      <div className={s.mode}>
        <button aria-pressed={mode === 'one'} onClick={() => { run.current++; hush(); setMode('one'); setReading(null) }}>{t.comics.one}</button>
        <button aria-pressed={mode === 'all'} onClick={() => { run.current++; hush(); setMode('all'); setReading(null) }}>{t.comics.all}</button>
      </div>
      <div className={s.legend}><span><i /> {t.comics.say}</span><span><i className={s.th} /> {t.comics.think}</span><span><i className={s.cp} /> {t.comics.tale}</span></div>
      <section className={s.page}>{mode === 'one' ? panel(cur) : comic.panels.map((_, i) => panel(i))}</section>
      {mode === 'one' ? (
        <div className={s.nav}>
          <button className={s.btn} disabled={cur === 0} onClick={() => go(cur - 1)} aria-label="←">←</button>
          <span className={s.counter}>{cur + 1} / {comic.panels.length}</span>
          <button className={`${s.btn} ${s.main}`} onClick={() => go(cur < comic.panels.length - 1 ? cur + 1 : 0)}>{cur < comic.panels.length - 1 ? t.comics.next : t.comics.restart}</button>
        </div>
      ) : (
        <div className={s.nav}><button className={`${s.btn} ${s.main}`} onClick={readAll}>{t.comics.readAll}</button></div>
      )}
      <div className={s.note}>{t.comics.note}</div>
    </>
  )
}
