'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { FIRST, THEN, loadFirstThen, saveFirstThen, type FirstThenState } from '@/lib/firstThen'
import { useSpeech, softTone } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import s from './Daily.module.css'

/** Prima… poi…: il bambino vede le due carte; le immagini le sceglie il genitore */
export default function FirstThenView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const [st, setSt] = useState<FirstThenState | null>(null)
  const [done, setDone] = useState(false)
  useEffect(() => { setSt(loadFirstThen()) }, [])

  const f = st ? FIRST.find(x => x.id === st.first)! : null
  const th = st ? THEN.find(x => x.id === st.then)! : null
  const fName = f ? t.firstThen.firstItems[f.id] : ''
  const tName = th ? t.firstThen.thenItems[th.id] : ''
  const sentence = t.firstThen.sentence(fName, tName)

  useEffect(() => { if (st) speak(sentence) }, [st?.first, st?.then, sentence]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (done) { setDone(false); speak(sentence); return }
    setDone(true); softTone(520, 880, 0.25); speak(t.firstThen.nowThen(tName))
  }

  return (
    <>
      <SectionTitle emoji="🔄" title={t.daily.firstThenTitle} sub={t.daily.firstThenSub} onBack={onBack} spot="primapoi" />
      {st && f && th && (
        <section className={s.card}>
          <div className={s.board}>
            <div className={`${s.slot} ${s.first}${done ? ` ${s.slotOk}` : ''}`}>
              <span className={s.slotLab}>{t.firstThen.first}</span><span className={s.slotPic}>{f.e}</span><span className={s.slotName}>{fName}</span>
            </div>
            <div className={s.arrow}>➜</div>
            <div className={`${s.slot} ${s.then}${done ? ` ${s.glow}` : ''}`}>
              <span className={s.slotLab}>{t.firstThen.then}</span><span className={s.slotPic}>{th.e}</span><span className={s.slotName}>{tName}</span>
            </div>
          </div>
          <div className={s.row}>
            <button className={`${s.btn} ${s.soft}`} onClick={() => speak(sentence)}>{t.firstThen.listen}</button>
            <button className={`${s.btn} ${s.main}`} onClick={toggle}>{done ? t.firstThen.again : t.firstThen.done}</button>
          </div>
          {allowSettings && <FirstThenPanel onChange={n => { setSt(n); setDone(false) }} embedded />}
        </section>
      )}
    </>
  )
}

/** Scelta delle due immagini (area Genitore; nella demo dentro la sezione) */
export function FirstThenPanel({ onChange, embedded = false }: { onChange?: (s: FirstThenState) => void; embedded?: boolean }) {
  const { t } = useT()
  const [st, setSt] = useState<FirstThenState | null>(null)
  useEffect(() => { setSt(loadFirstThen()) }, [])
  if (!st) return null
  const set = (n: FirstThenState) => { setSt(n); saveFirstThen(n); onChange?.(n) }
  return (
    <div className={embedded ? s.panel : s.card}>
      <div className={s.sub}>{t.firstThen.first}</div>
      <div className={s.pick}>
        {FIRST.map(x => (
          <button key={x.id} aria-pressed={st.first === x.id} onClick={() => set({ ...st, first: x.id })}>
            <span className={s.pickE}>{x.e}</span>{t.firstThen.firstItems[x.id]}
          </button>
        ))}
      </div>
      <div className={s.sub}>{t.firstThen.then}</div>
      <div className={s.pick}>
        {THEN.map(x => (
          <button key={x.id} aria-pressed={st.then === x.id} onClick={() => set({ ...st, then: x.id })}>
            <span className={s.pickE}>{x.e}</span>{t.firstThen.thenItems[x.id]}
          </button>
        ))}
      </div>
    </div>
  )
}
