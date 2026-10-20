'use client'
import Image from 'next/image'
import { useT } from '@/lib/i18n'
import { BUDDIES, BUDDY_FOR, type BuddySpot } from '@/lib/buddies'
import s from './Buddy.module.css'

/** L'amico che accompagna una sezione: toccandolo, legge ad alta voce la sua frase */
export default function Buddy({ spot }: { spot: BuddySpot }) {
  const { t } = useT()
  const b = BUDDIES[BUDDY_FOR[spot]]
  const line = t.buddies[spot]

  const speak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    try {
      const synth = window.speechSynthesis
      const u = new SpeechSynthesisUtterance(`${b.name}: ${line}`)
      u.lang = t.locale; u.rate = 0.9
      const v = synth.getVoices().find(v => v.lang.toLowerCase().startsWith(t.speechLang))
      if (v) u.voice = v
      synth.cancel(); setTimeout(() => synth.speak(u), 80)
    } catch (_) {}
  }

  return (
    <button className={s.buddy} onClick={speak} aria-label={`${b.name}: ${line}`}>
      <Image src={b.img} alt="" width={56} height={56} className={s.avatar} style={{ borderColor: b.color }} />
      <span className={s.bubble}>
        <b style={{ color: b.color }}>{b.name}</b>
        <span>{line}</span>
      </span>
    </button>
  )
}
