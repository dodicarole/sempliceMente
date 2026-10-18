'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePraise } from '@/hooks/usePraise'
import { BurpingBag } from './Tedo'
import { loadFunSettings } from '@/lib/fun'
import ItemCard from './ItemCard'
import { useAudio } from '@/hooks/useAudio'
import { DAY_COLORS, type ScheduleItem } from '@/types'
import s from './ChildView.module.css'
import { useT } from '@/lib/i18n'

interface Props {
  items: ScheduleItem[]
  dayIndex: number
  dateLabel: string
  onBack: () => void
}

function todayKey() {
  return `zaino_${new Date().toISOString().split('T')[0]}`
}

export default function ChildView({ items, dayIndex, dateLabel, onBack }: Props) {
  const { t } = useT()
  const [checked, setChecked]       = useState<Set<string>>(new Set())
  const [showCelebr, setShowCelebr] = useState(false)
  const praise = usePraise(showCelebr)
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
      <>
        <button className={s.back} onClick={onBack}>{t.common.back}</button>
        <div className={s.weekend}>
          <div className={s.weekendEmoji}>🏠</div>
          <div className={s.weekendTitle}>{t.common.noSchool}</div>
          <div className={s.weekendSub}>{t.common.rest}</div>
        </div>
      </>
    )
  }

  const color = DAY_COLORS[dayIndex]

  return (
    <>
      <button className={s.back} onClick={onBack}>{t.common.back}</button>
      <div className={s.banner} style={{ background: color }}>
        <div className={s.dayName}>{t.days.names[dayIndex]}</div>
        <div className={s.dayDate}>{dateLabel}</div>
      </div>

      <div className={s.progressRow}>
        <div className={s.dots}>
          {items.map(item => (
            <div key={item.id} className={`${s.dot}${checked.has(item.id) ? ` ${s.on}` : ''}`} />
          ))}
        </div>
        <span className={s.progLabel}>{t.common.of(checked.size, items.length)}</span>
      </div>

      <div className={s.instruction}>{t.zaino.instruction}</div>

      <div className={s.grid}>
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            checked={checked.has(item.id)}
            onToggle={() => toggle(item.id)}
            illustrate
          />
        ))}
      </div>

      {showCelebr && (
        <div className={s.overlay} onClick={() => setShowCelebr(false)}>
          <div className={s.celebCard} onClick={e => e.stopPropagation()}>
            <BurpingBag fun={loadFunSettings().fun} />
            <div className={s.celebTitle}>{praise}</div>
            <div className={s.celebSub}>{t.zaino.ready}<br />{t.common.goodDay}</div>
            <button className={s.celebBtn} onClick={() => setShowCelebr(false)}>{t.common.great}</button>
          </div>
        </div>
      )}
    </>
  )
}