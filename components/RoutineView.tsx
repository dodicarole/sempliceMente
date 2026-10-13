'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePraise } from '@/hooks/usePraise'
import ItemCard from './ItemCard'
import { useAudio } from '@/hooks/useAudio'
import type { RoutineItem } from '@/types'
import s from './RoutineView.module.css'
import { useT } from '@/lib/i18n'

interface Props {
  items: RoutineItem[]
  onBack: () => void
}

function todayKey() {
  return `routine_${new Date().toISOString().split('T')[0]}`
}

export default function RoutineView({ items, onBack }: Props) {
  const { t } = useT()
  const [checked, setChecked]       = useState<Set<string>>(new Set())
  const [showCelebr, setShowCelebr] = useState(false)
  const praise = usePraise(showCelebr)
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
      <button className={s.back} onClick={onBack}>{t.common.back}</button>

      <div className={s.banner}>
        <div className={s.sunEmoji}>🌅</div>
        <div className={s.title}>{t.routine.title}</div>
      </div>

      <div className={s.progressRow}>
        <div className={s.dots}>
          {items.map(item => (
            <div key={item.id} className={`${s.dot}${checked.has(item.id) ? ` ${s.on}` : ''}`} />
          ))}
        </div>
        <span className={s.progLabel}>{t.common.of(checked.size, items.length)}</span>
      </div>

      <div className={s.instruction}>{t.routine.instruction}</div>

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
              doneLabel={t.routine.done}
            />
          </div>
        ))}
      </div>

      {showCelebr && (
        <div className={s.overlay} onClick={() => setShowCelebr(false)}>
          <div className={s.celebCard} onClick={e => e.stopPropagation()}>
            <div className={s.celebEmoji}>🌟</div>
            <div className={s.celebTitle}>{praise}</div>
            <div className={s.celebSub}>{t.routine.completed}<br />{t.common.goodDay}</div>
            <button className={s.celebBtn} onClick={() => setShowCelebr(false)}>{t.common.great}</button>
          </div>
        </div>
      )}
    </>
  )
}