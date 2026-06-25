'use client'
import { useMemo } from 'react'
import Image from 'next/image'
import { DAY_NAMES, DAY_COLORS, type AgendaItem } from '@/types'
import s from './AgendaView.module.css'

interface Props {
  items: AgendaItem[]
  dayIndex: number
  dateLabel: string
  onBack: () => void
}

function timeToMinutes(t: string): number {
  const [h, m] = t.slice(0, 5).split(':').map(Number)
  return h * 60 + m
}

function formatTime(t: string): string {
  return t.slice(0, 5)
}

export default function AgendaView({ items, dayIndex, dateLabel, onBack }: Props) {
  const todayItems = useMemo(
    () => items.filter(i => i.day_of_week === dayIndex).sort((a, b) => timeToMinutes(a.time_start) - timeToMinutes(b.time_start)),
    [items, dayIndex]
  )

  const { currentIdx } = useMemo(() => {
    const now = new Date()
    const nowMin = now.getHours() * 60 + now.getMinutes()
    let cur = -1
    todayItems.forEach((item, i) => {
      if (timeToMinutes(item.time_start) <= nowMin) cur = i
    })
    return { currentIdx: cur }
  }, [todayItems])

  if (dayIndex === -1) {
    return (
      <>
        <button className={s.back} onClick={onBack}>← Indietro</button>
        <div className={s.weekend}>
          <div className={s.weekendEmoji}>🏠</div>
          <div className={s.weekendTitle}>Oggi niente scuola!</div>
          <div className={s.weekendSub}>Buon riposo 😊</div>
        </div>
      </>
    )
  }

  if (todayItems.length === 0) {
    return (
      <>
        <button className={s.back} onClick={onBack}>← Indietro</button>
        <div className={s.banner} style={{ background: DAY_COLORS[dayIndex] }}>
          <div className={s.dayName}>{DAY_NAMES[dayIndex]}</div>
          <div className={s.dayDate}>{dateLabel}</div>
        </div>
        <div className={s.empty}>
          <div className={s.emptyEmoji}>📅</div>
          <div className={s.emptyText}>Nessuna attività per oggi</div>
        </div>
      </>
    )
  }

  return (
    <>
      <button className={s.back} onClick={onBack}>← Indietro</button>

      <div className={s.banner} style={{ background: DAY_COLORS[dayIndex] }}>
        <div className={s.dayName}>{DAY_NAMES[dayIndex]}</div>
        <div className={s.dayDate}>{dateLabel}</div>
      </div>

      <div className={s.timeline}>
        {todayItems.map((item, index) => {
          const isCurrent = index === currentIdx
          const isNext    = index === currentIdx + 1
          const isPast    = index < currentIdx

          return (
            <div
              key={item.id}
              className={`${s.row} ${isCurrent ? s.current : ''} ${isPast ? s.past : ''}`}
            >
              <div className={s.timeCol}>
                <span className={s.time}>{formatTime(item.time_start)}</span>
                {index < todayItems.length - 1 && <div className={s.line} />}
              </div>

              <div className={s.card}>
                <div className={s.cardMedia}>
                  {item.photo_url ? (
                    <Image src={item.photo_url} alt={item.name} width={52} height={52} style={{ objectFit: 'cover', borderRadius: 10 }} />
                  ) : (
                    <span className={s.cardEmoji}>{item.icon}</span>
                  )}
                </div>
                <span className={s.cardName}>{item.name}</span>
                {isCurrent && <span className={s.badgeNow}>Adesso!</span>}
                {isNext    && <span className={s.badgeNext}>Dopo</span>}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}