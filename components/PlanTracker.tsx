'use client'
import { useState, useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { useSpeech } from '@/hooks/useSpeech'
import { addSpent, openStepFor, loadPlans, todayIso, type PlanStep } from '@/lib/plans'
import type { SectionId } from '@/lib/homeSections'
import { useSectionInfo } from './PlanParts'
import s from './Plan.module.css'

const IDLE = 120          // dopo 2 minuti senza toccare niente il conteggio si mette in pausa
const FLUSH = 10          // i secondi si salvano ogni 10

/**
 * Mentre il bambino è in una sezione che fa parte del suo piano di oggi, l'app conta il tempo vero:
 * solo con l'app aperta e in primo piano, e solo se il bambino la sta usando. In un angolo vede quanto manca;
 * alla fine Tedo lo avvisa e propone la tappa successiva (o lo riporta al piano, se il genitore ha scelto così).
 */
export default function PlanTracker({ sec, onGo }: { sec: SectionId; onGo: (sec: SectionId | 'home') => void }) {
  const { t } = useT()
  const T = t.plan
  const { speak } = useSpeech()
  const { byId } = useSectionInfo()
  const [step, setStep] = useState<PlanStep | null>(null)
  const [shown, setShown] = useState(0)                 // secondi fatti, per il cartellino
  const [paused, setPaused] = useState(false)
  const [end, setEnd] = useState<{ step: PlanStep; next: PlanStep | null } | null>(null)
  const pending = useRef(0), lastInput = useRef(Date.now())

  useEffect(() => {
    const st = openStepFor(sec); setStep(st); setShown(st?.spent ?? 0); setEnd(null); pending.current = 0
    if (!st) return
    const touch = () => { lastInput.current = Date.now() }
    const evs = ['pointerdown', 'keydown', 'touchstart', 'wheel'] as const
    evs.forEach(e => window.addEventListener(e, touch, { passive: true }))
    const flush = () => {
      if (!pending.current) return
      const r = addSpent(sec, pending.current); pending.current = 0
      if (r?.justDone) {
        setEnd({ step: r.step, next: r.next })
        const name = byId(r.step.sec)?.title ?? ''
        speak(`${T.endTitle(r.step.min, name)} ${r.next ? T.nextIs(byId(r.next.sec)?.title ?? '') : T.lastDone}`)
        if (loadPlans().settings.onEnd === 'back') setTimeout(() => onGo('home'), 5000)
      }
    }
    const tick = setInterval(() => {
      const active = document.visibilityState === 'visible' && (Date.now() - lastInput.current) / 1000 < IDLE
      setPaused(!active)
      if (!active) return
      pending.current++; setShown(v => v + 1)
      if (pending.current >= FLUSH) flush()
    }, 1000)
    const onHide = () => { if (document.visibilityState !== 'visible') flush() }
    document.addEventListener('visibilitychange', onHide)
    return () => { clearInterval(tick); evs.forEach(e => window.removeEventListener(e, touch)); document.removeEventListener('visibilitychange', onHide); flush() }
  }, [sec, todayIso()]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!step) return null
  const info = byId(step.sec), total = step.min * 60, k = Math.min(1, shown / total), C = 2 * Math.PI * 11
  return (
    <>
      {!end && (
        <div className={`${s.pill}${paused ? ` ${s.pillPaused}` : ''}`} aria-live="off">
          <svg viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="11" style={{ fill: 'none', stroke: '#D6DBF2', strokeWidth: 5 }} />
            <circle cx="15" cy="15" r="11" transform="rotate(-90 15 15)" style={{ fill: 'none', stroke: 'var(--done)', strokeWidth: 5, strokeLinecap: 'round', strokeDasharray: C, strokeDashoffset: C * (1 - k) }} /></svg>
          {T.pill(info?.e ?? '', Math.floor(shown / 60), step.min)}
        </div>
      )}
      {end && (
        <div className={s.endBox} role="dialog" aria-modal="true">
          <div className={s.endCard}>
            <div className={s.endFrog}>🐸</div>
            <div className={s.h2}>{T.endTitle(end.step.min, info?.title ?? '')}</div>
            <div className={s.sub}>{end.next ? T.nextIs(byId(end.next.sec)?.title ?? '') : T.lastDone}</div>
            {loadPlans().settings.onEnd === 'back' && <div className={s.sub}>{T.backSoon}</div>}
            <button className={`${s.btn} ${s.main}`} onClick={() => onGo(end.next ? end.next.sec : 'home')}>{end.next ? `${T.goNext}: ${byId(end.next.sec)?.e ?? ''}` : T.goNext}</button>
            {loadPlans().settings.onEnd !== 'back' && <button className={s.btn} onClick={() => setEnd(null)}>{T.stay}</button>}
          </div>
        </div>
      )}
    </>
  )
}
