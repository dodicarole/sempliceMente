'use client'
import Image from 'next/image'
import type { ScheduleItem } from '@/types'
import s from './ItemCard.module.css'

interface Props {
  item: ScheduleItem
  checked: boolean
  onToggle: () => void
}

export default function ItemCard({ item, checked, onToggle }: Props) {
  return (
    <div
      className={`${s.wrap} ${checked ? s.done : ''}`}
      onClick={onToggle}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onToggle()}
      role="checkbox"
      aria-checked={checked}
      aria-label={item.name}
      tabIndex={0}
    >
      <div className={s.inner}>
        <div className={`${s.face} ${s.front}`}>
          <div className={s.img}>
            {item.photo_url ? (
              <Image
                src={item.photo_url}
                alt={item.name}
                width={80}
                height={80}
                style={{ objectFit: 'cover', borderRadius: 12 }}
              />
            ) : (
              item.icon
            )}
          </div>
          <div className={s.label}>{item.name}</div>
        </div>
        <div className={`${s.face} ${s.back}`}>
          <div className={s.doneIcon}>✅</div>
          <div className={s.doneLabel}>Dentro!</div>
        </div>
      </div>
    </div>
  )
}