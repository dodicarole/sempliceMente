'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useT } from '@/lib/i18n'
import { loadChildGender, type ChildGender } from '@/lib/praise'
import { useSpeech } from '@/hooks/useSpeech'
import type { EmotionItem } from '@/types'
import SectionTitle from './SectionTitle'
import s from './Daily.module.css'

type Cat = 'need' | 'want' | 'feel' | 'help'
const ICONS: Record<'need' | 'want' | 'help', string[]> = {
  need: ['🍽️', '💧', '🚽', '🤕', '🥶', '😴'],
  want: ['🎲', '📖', '🤗', '🌳', '🎵', '🏠'],
  help: ['🙋', '✋', '🔇', '⏳', '🔁', '🛑'],
}
const HARD = ['triste', 'arrabbiato', 'spaventato'] // per queste emozioni si propone l'angolo della calma

interface Shown { e: string; photo?: string | null; text: string; comfort?: string; calm?: boolean }

/** Le mie parole: il bambino tocca un'immagine e la voce parla per lui. Comprende le emozioni (ex "Come ti senti?") */
export default function WordsView({ emotions, onBack, onCalm }: { emotions: EmotionItem[]; onBack: () => void; onCalm: () => void }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const [cat, setCat] = useState<Cat>('need')
  const [shown, setShown] = useState<Shown | null>(null)
  const [gender, setGender] = useState<ChildGender>('n')
  useEffect(() => { setGender(loadChildGender()) }, [])

  const show = (x: Shown) => {
    setShown(x)
    speak(x.comfort ? `${x.text}. ${x.comfort.replace(/\s\S+$/u, '')}` : x.text)
  }

  const items: Shown[] = cat === 'feel'
    ? emotions.map(em => ({ e: em.icon, photo: em.photo_url, text: t.words.feel(em.key, gender), comfort: t.emotions.messages[em.key], calm: HARD.includes(em.key) }))
    : (t.words[cat] as string[]).map((text, i) => ({ e: ICONS[cat][i], text }))

  return (
    <>
      <SectionTitle emoji="💬" title={t.daily.wordsTitle} sub={t.daily.wordsSub} onBack={onBack} spot="emozioni" />
      <section className={s.card}>
        <div className={s.yesno}>
          <button className={s.yes} onClick={() => show({ e: '👍', text: t.words.yesWord })}>{t.words.yes}</button>
          <button className={s.no} onClick={() => show({ e: '👎', text: t.words.noWord })}>{t.words.no}</button>
        </div>
        <div className={s.cats}>
          {(['need', 'want', 'feel', 'help'] as Cat[]).map(c => (
            <button key={c} className={s.cat} aria-current={c === cat} onClick={() => setCat(c)}>{t.words.cats[c]}</button>
          ))}
        </div>
        <div className={s.words}>
          {items.map((x, i) => (
            <button key={`${cat}-${i}`} className={s.word} onClick={() => show(x)}>
              {x.photo ? <Image src={x.photo} alt="" width={52} height={52} className={s.wordImg} /> : <span className={s.wordE}>{x.e}</span>}
              <b>{x.text}</b>
            </button>
          ))}
        </div>
      </section>

      {shown && (
        <div className={s.overlay} onClick={e => { if (e.target === e.currentTarget) setShown(null) }}>
          <div className={s.overlayIn}>
            {shown.photo ? <Image src={shown.photo} alt="" width={150} height={150} className={s.bigImg} /> : <span className={s.bigE}>{shown.e}</span>}
            <span className={s.bigText}>{shown.text}</span>
            {shown.comfort && <span className={s.sub}>{shown.comfort}</span>}
            {shown.calm && <button className={s.btn} style={{ width: '100%' }} onClick={() => { setShown(null); onCalm() }}>{t.words.toCalm}</button>}
            <div className={s.row}>
              <button className={`${s.btn} ${s.soft}`} onClick={() => speak(shown.text)}>{t.words.again}</button>
              <button className={`${s.btn} ${s.main}`} onClick={() => setShown(null)}>{t.words.ok}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
