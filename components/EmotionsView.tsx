'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useAudio } from '@/hooks/useAudio'
import { type EmotionItem } from '@/types'
import s from './EmotionsView.module.css'
import { useT } from '@/lib/i18n'

interface Props {
  items: EmotionItem[]
  onBack: () => void
}

export default function EmotionsView({ items, onBack }: Props) {
  const { t } = useT()
  const [selected, setSelected] = useState<EmotionItem | null>(null)
  const { check } = useAudio()

  const handleSelect = useCallback((item: EmotionItem) => {
    check()
    setSelected(item)
  }, [check])

  return (
    <>
      <button className={s.back} onClick={onBack}>{t.common.back}</button>

      <div className={s.banner}>
        <span className={s.bannerEmoji}>💗</span>
        <div>
          <div className={s.bannerTitle}>{t.emotions.title}</div>
          <div className={s.bannerSub}>{t.emotions.sub}</div>
        </div>
      </div>

      <div className={s.grid}>
        {items.map(item => (
          <button key={item.id} className={s.card} onClick={() => handleSelect(item)}>
            <div className={s.cardMedia}>
              {item.photo_url ? (
                <Image src={item.photo_url} alt={t.emotions.names[item.key] ?? item.name} width={64} height={64} style={{ objectFit: 'cover', borderRadius: 14 }} />
              ) : (
                <span className={s.cardEmoji}>{item.icon}</span>
              )}
            </div>
            <span className={s.cardName}>{t.emotions.names[item.key] ?? item.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className={s.overlay} onClick={() => setSelected(null)}>
          <div className={s.respCard} onClick={e => e.stopPropagation()}>
            <div className={s.respMedia}>
              {selected.photo_url ? (
                <Image src={selected.photo_url} alt={t.emotions.names[selected.key] ?? selected.name} width={88} height={88} style={{ objectFit: 'cover', borderRadius: 18 }} />
              ) : (
                <span className={s.respEmoji}>{selected.icon}</span>
              )}
            </div>
            <div className={s.respTitle}>{t.emotions.names[selected.key] ?? selected.name}</div>
            <div className={s.respMsg}>{t.emotions.messages[selected.key] ?? t.emotions.thanks}</div>
            <button className={s.respBtn} onClick={() => setSelected(null)}>{t.emotions.ok}</button>
          </div>
        </div>
      )}
    </>
  )
}