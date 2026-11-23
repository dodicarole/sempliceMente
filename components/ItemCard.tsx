'use client'
import Image from 'next/image'
import type { BaseItem } from '@/types'
import ZainoPicture from './ZainoPicture'
import { useT } from '@/lib/i18n'
import s from './ItemCard.module.css'

interface Props {
  item: BaseItem
  checked: boolean
  onToggle: () => void
  doneLabel?: string
  /** Se non c'è la foto, mostra un'immagine proposta in base al nome (zaino) */
  illustrate?: boolean
  /** zaino: è rimasto a scuola (il testo dice da quando); toccando la scheda torna a casa */
  atSchool?: string
  /** zaino: il piccolo bottone 🏫 nell'angolo, per dire che è rimasto a scuola */
  onSchool?: () => void
}

export default function ItemCard({ item, checked, onToggle, doneLabel, illustrate = false, atSchool, onSchool }: Props) {
  const { t } = useT()
  const label = doneLabel ?? t.zaino.inside
  return (
    <div
      className={`${s.wrap} ${checked ? s.done : ''}${atSchool ? ` ${s.school}` : ''}`}
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
          {atSchool && <div className={s.schoolTag}>{atSchool}</div>}
          {onSchool && !checked && !atSchool && (
            <button className={s.schoolBtn} aria-label={t.zaino.atSchoolBtn} title={t.zaino.atSchoolBtn}
              onClick={e => { e.stopPropagation(); onSchool() }} onKeyDown={e => e.stopPropagation()}>🏫</button>
          )}
        </div>
        <div className={`${s.face} ${s.back}`}>
          <div className={s.doneIcon}>✅</div>
          <div className={s.doneLabel}>{label}</div>
        </div>
      </div>
    </div>
  )
}