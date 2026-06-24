'use client'
import { useState, useEffect, useCallback } from 'react'
import ItemCard from './ItemCard'
import { useAudio } from '@/hooks/useAudio'
import { DAY_NAMES, DAY_COLORS, type ScheduleItem } from '@/types'
import s from './ChildView.module.css'

interface Props {
  items: ScheduleItem[]
  dayIndex: number   // 0=Lun … 4=Ven, -1=weekend
  dateLabel: string  // es. "24 giugno 2026"
}

function todayKey() {
  return `zaino_${new Date().toISOString().split('T')[0]}`
}

export default function ChildView({ items, dayIndex, dateLabel }: Props) {
  const [checked, setChecked]       = useState<Set<string>>(new Set())
  const [showCelebr, setShowCelebr] = useState(false)
  const { check, uncheck, celebration } = useAudio()

  // Carica dallo storage al mount
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

  if (dayIndex === -1) {
    return (
      <div className={s.weekend}>
        <div className={s.weekendEmoji}>🏠</div>
        <div className={s.weekendTitle}>Oggi niente scuola!</div>
        <div className={s.weekendSub}>Buon riposo 😊</div>
      </div>
    )
  }

  const color = DAY_COLORS[dayIndex]

  return (
    <>
      <div className={s.banner} style={{ background: color }}>
        <div className={s.dayName}>{DAY_NAMES[dayIndex]}</div>
        <div className={s.dayDate}>{dateLabel}</div>
      </div>

      <div className={s.progressRow}>
        <div className={s.dots}>
          {items.map(item => (
            <div key={item.id} className={`${s.dot}${checked.has(item.id) ? ` ${s.on}` : ''}`} />
          ))}
        </div>
        <span className={s.progLabel}>{checked.size} di {items.length}</span>
      </div>

      <div className={s.instruction}>Metti nello zaino!</div>

      <div className={s.grid}>
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            checked={checked.has(item.id)}
            onToggle={() => toggle(item.id)}
          />
        ))}
      </div>

      {showCelebr && (
        <div className={s.overlay} onClick={() => setShowCelebr(false)}>
          <div className={s.celebCard} onClick={e => e.stopPropagation()}>
            <div className={s.celebEmoji}>🎉</div>
            <div className={s.celebTitle}>Bravo!</div>
            <div className={s.celebSub}>Lo zaino è pronto.<br />Buona giornata!</div>
            <button className={s.celebBtn} onClick={() => setShowCelebr(false)}>Ottimo!</button>
          </div>
        </div>
      )}
    </>
  )
}