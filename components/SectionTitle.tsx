'use client'
import { useT } from '@/lib/i18n'
import type { BuddySpot } from '@/lib/buddies'
import { hush } from '@/hooks/useSpeech'
import Buddy from './Buddy'
import s from './Daily.module.css'

/** Intestazione comune delle nuove sezioni: indietro, titolo e l'amico che accompagna */
export default function SectionTitle({ emoji, title, sub, onBack, spot }: { emoji: string; title: string; sub: string; onBack: () => void; spot?: BuddySpot }) {
  const { t } = useT()
  return (
    <>
      <button className={s.back} onClick={() => { hush(); onBack() }}>{t.common.back}</button>
      <div className={s.title}>
        <span className={s.titleEm}>{emoji}</span>
        <div><div className={s.titleText}>{title}</div><div className={s.titleSub}>{sub}</div></div>
      </div>
      {spot && <Buddy spot={spot} />}
    </>
  )
}
