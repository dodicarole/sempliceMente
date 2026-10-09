'use client'
import Image from 'next/image'
import type { BaseItem } from '@/types'
import ZainoPicture from './ZainoPicture'
import s from './ItemCard.module.css'

interface Props {
  item: BaseItem
  checked: boolean
  onToggle: () => void
  doneLabel?: string
  /** Se non c'è la foto, mostra un'immagine proposta in base al nome (zaino) */
  illustrate?: boolean
}

export default function ItemCard({ item, checked, onToggle, doneLabel = 'Dentro!', illustrate = false }: Props) {
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
            ) : illustrate ? (
              <ZainoPicture name={item.name} icon={item.icon} size={80} />
            ) : (
              item.icon
            )}
          </div>
          <div className={s.label}>{item.name}</div>
        </div>
        <div className={`${s.face} ${s.back}`}>
          <div className={s.doneIcon}>✅</div>
          <div className={s.doneLabel}>{doneLabel}</div>
        </div>
      </div>
    </div>
  )
}