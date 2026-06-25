'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAudio } from '@/hooks/useAudio'
import s from './TimerView.module.css'

interface Props {
  onBack: () => void
}

const PRESETS = [
  { label: '5 min',  seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
]

const RADIUS = 108
const CIRC = 2 * Math.PI * RADIUS

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

type Phase = 'idle' | 'running' | 'paused' | 'done'

export default function TimerView({ onBack }: Props) {
  const [total, setTotal] = useState(300)
  const [left,  setLeft]  = useState(300)
  const [phase, setPhase] = useState<Phase>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { celebration } = useAudio()

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const start = useCallback(() => {
    if (left <= 0) return
    setPhase('running')
    intervalRef.current = setInterval(() => {
      setLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setPhase('done')
          celebration()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [left, celebration])

  const pause = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setPhase('paused')
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setLeft(total)
    setPhase('idle')
  }, [total])

  const selectPreset = useCallback((seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setTotal(seconds)
    setLeft(seconds)
    setPhase('idle')
  }, [])

  const progress = total > 0 ? left / total : 0
  const offset   = CIRC * (1 - progress)

  let ringColor = '#00ACC1'
  if (progress <= 0.15)  ringColor = '#E05260'
  else if (progress <= 0.4) ringColor = '#FFB347'

  return (
    <>
      <button className={s.back} onClick={onBack}>← Indietro</button>

      <div className={s.banner}>
        <span className={s.bannerEmoji}>⏱️</span>
        <div>
          <div className={s.bannerTitle}>Timer</div>
          <div className={s.bannerSub}>Quanto tempo hai?</div>
        </div>
      </div>

      <div className={s.presets}>
        {PRESETS.map(p => (
          <button
            key={p.seconds}
            className={`${s.preset}${total === p.seconds && phase === 'idle' ? ` ${s.presetActive}` : ''}`}
            onClick={() => selectPreset(p.seconds)}
            disabled={phase === 'running'}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={s.circleWrap}>
        <svg className={s.svg} viewBox="0 0 260 260" aria-hidden="true">
          <circle cx="130" cy="130" r={RADIUS} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="18" />
          <circle
            cx="130" cy="130" r={RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={`${CIRC} ${CIRC}`}
            strokeDashoffset={offset}
            transform="rotate(-90 130 130)"
            style={{ transition: phase === 'running' ? 'stroke-dashoffset 0.95s linear, stroke 0.6s' : 'stroke 0.6s' }}
          />
        </svg>
        <div className={s.timeDisplay}>
          <span className={s.timeLabel} style={{ color: ringColor }}>{formatTime(left)}</span>
          {phase === 'done' && <span className={s.doneEmoji}>🎉</span>}
        </div>
      </div>

      <div className={s.controls}>
        {phase === 'done' ? (
          <div className={s.doneMsg}>Tempo scaduto!</div>
        ) : phase === 'running' ? (
          <button className={s.btnPause} onClick={pause}>⏸ Pausa</button>
        ) : (
          <button
            className={s.btnStart}
            style={{ '--clr': ringColor } as React.CSSProperties}
            onClick={start}
            disabled={left === 0}
          >
            {phase === 'paused' ? '▶ Riprendi' : '▶ Inizia'}
          </button>
        )}
        {phase !== 'idle' && (
          <button className={s.btnReset} onClick={reset}>↺ Ricomincia</button>
        )}
      </div>
    </>
  )
}