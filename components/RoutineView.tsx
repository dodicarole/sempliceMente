'use client'
import { useState, useEffect, useCallback } from 'react'
import ItemCard from './ItemCard'
import { useAudio } from '@/hooks/useAudio'
import type { RoutineItem } from '@/types'
import s from './RoutineView.module.css'

interface Props {
  items: RoutineItem[]
  onBack: () => void
}

function todayKey() {
  return `routine_${new Date().toISOString().split('T')[0]}`
}

export default function RoutineView({ items, onBack }: Props) {
  const [checked, setChecked]       = useState<Set<string>>(new Set())
  const [showCelebr, setShowCelebr] = useState(false)
  const { check, uncheck, celebration } = useAudio()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(todayKey())
      if (raw) setChecked(new Set(JSON.parse(raw)))
    } catch (_) {}
  }, [])

  const toggle = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        uncheck()
      } else {
        next.add(id)
        check()
        if (next.size === items.length && items.length > 0) {
          setTimeout(() => {
            celebration()
            setShowCelebr(true)
          }, 550)
        }
      }
      try { localStorage.setItem(todayKey(), JSON.stringify(Array.from(next))) } catch (_) {}
      return next
    })
  }, [items.length, check, uncheck, celebration])

  return (
    <>
      <button className={s.back} onClick={onBack}>← Indietro</button>

      <div className={s.banner}>
        <div className={s.sunEmoji}>🌅</div>
        <div className={s.title}>Routine Mattutina</div>
      </div>

      <div className={s.progressRow}>
        <div className={s.dots}>
          {items.map(item => (
            <div key={item.id} className={`${s.dot}${checked.has(item.id) ? ` ${s.on}` : ''}`} />
          ))}
        </div>
        <span className={s.progLabel}>{checked.size} di {items.length}</span>
      </div>

      <div className={s.instruction}>Fai una cosa alla volta!</div>

      <div className={s.grid}>
        {items.map((item, index) => (
          <div key={item.id} className={s.itemWrap}>
            <span className={`${s.stepNum} ${checked.has(item.id) ? s.stepDone : ''}`}>
              {index + 1}
            </span>
            <ItemCard
              item={item}
              checked={checked.has(item.id)}
              onToggle={() => toggle(item.id)}
              doneLabel="Fatto!"
            />
          </div>
        ))}
      </div>

      {showCelebr && (
        <div className={s.overlay} onClick={() => setShowCelebr(false)}>
          <div className={s.celebCard} onClick={e => e.stopPropagation()}>
            <div className={s.celebEmoji}>🌟</div>
            <div className={s.celebTitle}>Bravissimo!</div>
            <div className={s.celebSub}>Routine completata.<br />Buona giornata!</div>
            <button className={s.celebBtn} onClick={() => setShowCelebr(false)}>Ottimo!</button>
          </div>
        </div>
      )}
    </>
  )
}