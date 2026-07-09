'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useAudio } from '@/hooks/useAudio'
import { EMOTION_MESSAGES, type EmotionItem } from '@/types'
import s from './EmotionsView.module.css'

interface Props {
  items: EmotionItem[]
  onBack: () => void
}

export default function EmotionsView({ items, onBack }: Props) {
  const [selected, setSelected] = useState<EmotionItem | null>(null)
  const { check } = useAudio()

  const handleSelect = useCallback((item: EmotionItem) => {
    check()
    setSelected(item)
  }, [check])

  return (
    <>
      <button className={s.back} onClick={onBack}>← Indietro</button>

      <div className={s.banner}>
        <span className={s.bannerEmoji}>💗</span>
        <div>
          <div className={s.bannerTitle}>Come ti senti?</div>
          <div className={s.bannerSub}>Tocca l&apos;emozione che senti ora</div>
        </div>
      </div>

      <div className={s.grid}>
        {items.map(item => (
          <button key={item.id} className={s.card} onClick={() => handleSelect(item)}>
            <div className={s.cardMedia}>
              {item.photo_url ? (
                <Image src={item.photo_url} alt={item.name} width={64} height={64} style={{ objectFit: 'cover', borderRadius: 14 }} />
              ) : (
                <span className={s.cardEmoji}>{item.icon}</span>
              )}
            </div>
            <span className={s.cardName}>{item.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className={s.overlay} onClick={() => setSelected(null)}>
          <div className={s.respCard} onClick={e => e.stopPropagation()}>
            <div className={s.respMedia}>
              {selected.photo_url ? (
                <Image src={selected.photo_url} alt={selected.name} width={88} height={88} style={{ objectFit: 'cover', borderRadius: 18 }} />
              ) : (
                <span className={s.respEmoji}>{selected.icon}</span>
              )}
            </div>
            <div className={s.respTitle}>{selected.name}</div>
            <div className={s.respMsg}>{EMOTION_MESSAGES[selected.key] ?? 'Grazie per avermelo detto 💗'}</div>
            <button className={s.respBtn} onClick={() => setSelected(null)}>Va bene!</button>
          </div>
        </div>
      )}
    </>
  )
}