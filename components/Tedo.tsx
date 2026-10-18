'use client'
import { useEffect, useRef, useState } from 'react'
import { useT } from '@/lib/i18n'
import { funSound, type Gag } from '@/lib/fun'
import s from './Tedo.module.css'

interface Props {
  /** La gag da fare; null = tono divertente spento: compare la stella di sempre */
  gag: Gag | null
  size?: number
  /** Simbolo da mostrare quando il tono divertente è spento */
  fallback?: string
}

/** Tedo, la rana di SempliceMente, che festeggia con il bambino */
export default function Tedo({ gag, size = 150, fallback = '⭐' }: Props) {
  const { t } = useT()
  const [anim, setAnim]   = useState<string>('')
  const [hand, setHand]   = useState(false)
  const [boom, setBoom]   = useState(false)
  const [croak, setCroak] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (!gag) return
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
    later(() => {
      setAnim(gag)
      if (gag === 'dance') { funSound.ribbit(); later(funSound.ribbit, 900) }
      if (gag === 'flip' || gag === 'wheel') funSound.whee()
      if (gag === 'jump') { funSound.boing(); later(funSound.boing, 700) }
      if (gag === 'five') { funSound.ribbit(); setHand(true); later(() => setHand(false), 5000) }
    }, 300)
    const durations: Record<Gag, number> = { dance: 2400, flip: 1500, jump: 1800, wheel: 1800, five: 5300 }
    later(() => setAnim(''), durations[gag])
    const list = timers.current
    return () => { list.forEach(clearTimeout) }
  }, [gag])

  if (!gag) return <div className={s.star} aria-hidden="true">{fallback}</div>

  const highFive = () => {
    funSound.clap()
    setHand(false); setBoom(true); setAnim('')
    timers.current.push(window.setTimeout(() => setBoom(false), 800))
  }
  const tapFrog = () => {
    if (anim) return
    funSound.ribbit(); setCroak(true)
    timers.current.push(window.setTimeout(() => setCroak(false), 1200))
  }

  return (
    <div className={s.wrap} style={{ width: size * 1.6, height: size * 1.25 }}>
      {gag === 'jump' && anim === 'jump' && (
        <div className={s.confetti} aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.07}s` }} />)}
        </div>
      )}
      {croak && <div className={s.croak}>{t.tedo.croak}</div>}
      <button
        className={`${s.frog} ${anim ? s[anim] : s.idle}`}
        style={{ width: size, height: size }}
        onClick={tapFrog}
        aria-label={t.tedo.name}
      >
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <ellipse cx="62" cy="186" rx="26" ry="10" fill="#3E9C5B" />
          <ellipse cx="138" cy="186" rx="26" ry="10" fill="#3E9C5B" />
          <ellipse cx="100" cy="140" rx="58" ry="50" fill="#5CC27A" />
          <ellipse cx="100" cy="150" rx="36" ry="32" fill="#C9EFC4" />
          <g className={s.armL}><path d="M62 120 Q36 140 40 160" stroke="#5CC27A" strokeWidth="16" fill="none" strokeLinecap="round" /><circle cx="40" cy="162" r="10" fill="#3E9C5B" /></g>
          <g className={`${s.armR}${hand ? ` ${s.armUp}` : ''}`}><path d="M138 120 Q164 140 160 160" stroke="#5CC27A" strokeWidth="16" fill="none" strokeLinecap="round" /><circle cx="160" cy="162" r="10" fill="#3E9C5B" /></g>
          <ellipse cx="100" cy="84" rx="62" ry="44" fill="#5CC27A" />
          <g className={s.eyes}>
            <circle cx="70" cy="50" r="24" fill="#5CC27A" /><circle cx="130" cy="50" r="24" fill="#5CC27A" />
            <circle cx="70" cy="50" r="17" fill="#fff" /><circle cx="130" cy="50" r="17" fill="#fff" />
            <circle cx="74" cy="53" r="8" fill="#1F2147" /><circle cx="126" cy="53" r="8" fill="#1F2147" />
            <circle cx="77" cy="49" r="3" fill="#fff" /><circle cx="129" cy="49" r="3" fill="#fff" />
          </g>
          <circle cx="56" cy="96" r="9" fill="#F59AA0" opacity=".6" /><circle cx="144" cy="96" r="9" fill="#F59AA0" opacity=".6" />
          <path d="M70 94 Q100 120 130 94" stroke="#1F2147" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
      </button>
      {hand && <button className={s.hand} onClick={highFive} aria-label={t.tedo.five}>✋</button>}
      {boom && <div className={s.boom} aria-hidden="true">💥</div>}
    </div>
  )
}

/** Lo zaino che fa il ruttino quando è pieno (con il tono divertente) */
export function BurpingBag({ fun }: { fun: boolean }) {
  const { t } = useT()
  useEffect(() => { if (!fun) return; const id = window.setTimeout(funSound.burp, 300); return () => clearTimeout(id) }, [fun])
  if (!fun) return <div className={s.star} aria-hidden="true">🎉</div>
  return (
    <div className={s.bag} aria-hidden="true">
      <span className={s.bagEmoji}>🎒</span>
      <span className={s.burp}>{t.tedo.burp}</span>
    </div>
  )
}
