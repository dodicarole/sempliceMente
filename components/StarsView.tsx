'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { REWARDS, loadStars, saveStars, addStar, type StarsState } from '@/lib/stars'
import { pickCelebrationNoStar as pickCelebration, type Celebration } from '@/lib/fun'
import { useSpeech, softTone } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import Tedo from './Tedo'
import s from './Daily.module.css'
import p from './NumbersSettingsPanel.module.css'

/** Le mie stelline: il bambino vede le stelle raccolte e il premio */
export default function StarsView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const [st, setSt] = useState<StarsState | null>(null)
  const [celeb, setCeleb] = useState<Celebration | null>(null)
  useEffect(() => { setSt(loadStars()) }, [])

  useEffect(() => {
    if (!st) return
    const r = t.stars.rewards[st.reward]
    if (st.have >= st.target) { const c = pickCelebration(t); setCeleb(c); speak(t.stars.won(r)) }
    else speak(t.stars.left(st.target - st.have))
  }, [st?.have, st?.target]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!st) return null
  const rw = REWARDS.find(r => r.id === st.reward)!
  const full = st.have >= st.target
  const restart = () => { const n = { ...st, have: 0 }; saveStars(n); setSt(n); setCeleb(null) }

  return (
    <>
      <SectionTitle emoji="⭐" title={t.daily.starsTitle} sub={t.daily.starsSub} onBack={onBack} spot="stelline" />
      <section className={s.card}>
        <div className={s.reward}><span className={s.rewardE}>{rw.e}</span><div><div className={s.sub}>{t.stars.prize}</div><b>{t.stars.rewards[rw.id]}</b></div></div>
        {full ? (
          <>
            <Tedo gag={celeb?.gag ?? null} fallback="🎉" />
            <p className={s.winTitle}>{t.stars.won(t.stars.rewards[rw.id])}</p>
            <button className={`${s.btn} ${s.main}`} onClick={restart}>{t.stars.restart}</button>
          </>
        ) : (
          <>
            <div className={s.stars} style={{ gridTemplateColumns: `repeat(${Math.min(st.target, 5)}, 1fr)` }}>
              {Array.from({ length: st.target }, (_, i) => <div key={i} className={`${s.st}${i < st.have ? ` ${s.stOn}` : ''}`}>{i < st.have ? '⭐' : '☆'}</div>)}
            </div>
            <p className={s.sub}>{t.stars.left(st.target - st.have)}</p>
          </>
        )}
        {allowSettings && <div className={s.panel}><StarsPanel onChange={setSt} /></div>}
      </section>
    </>
  )
}

/** Area Genitore: dare una stellina, scegliere premio, traguardo e stelline automatiche */
export function StarsPanel({ onChange }: { onChange?: (s: StarsState) => void }) {
  const { t } = useT()
  const [st, setSt] = useState<StarsState | null>(null)
  useEffect(() => { setSt(loadStars()) }, [])
  if (!st) return null
  const set = (n: StarsState) => { setSt(n); saveStars(n); onChange?.(n) }
  return (
    <div className={p.panel}>
      <div className={p.group}>
        <span className={p.label}>{t.stars.have(st.have, st.target)}</span>
        <button className={`${s.btn} ${s.main}`} disabled={st.have >= st.target} onClick={() => { const n = addStar(); setSt(n); onChange?.(n); softTone(660, 990, 0.2) }}>{t.stars.give}</button>
        <button className={s.btn} onClick={() => set({ ...st, have: 0 })}>{t.stars.reset}</button>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.stars.setTarget}</span>
        <div className={p.chips}>
          {[3, 5, 7, 10].map(n => <button key={n} className={p.chip} aria-pressed={st.target === n} onClick={() => set({ ...st, target: n, have: Math.min(st.have, n) })}>{t.stars.targetLabel(n)}</button>)}
        </div>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.stars.setReward}</span>
        <div className={p.chips}>
          {REWARDS.map(r => <button key={r.id} className={p.chip} aria-pressed={st.reward === r.id} onClick={() => set({ ...st, reward: r.id })}>{r.e} {t.stars.rewards[r.id]}</button>)}
        </div>
      </div>
      <div className={p.group}>
        <span className={p.label}>{t.stars.setAuto}</span>
        <div className={p.chips}>
          {([[true, t.reading.yes], [false, t.reading.no]] as [boolean, string][]).map(([v, l]) => <button key={l} className={p.chip} aria-pressed={st.auto === v} onClick={() => set({ ...st, auto: v })}>{l}</button>)}
        </div>
      </div>
    </div>
  )
}
