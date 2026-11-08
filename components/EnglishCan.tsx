'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { mountCan, CAN_CSS } from '@/lib/games/canCore'
import { useScopedCss } from './GamesView'
import type { EnglishSettings } from '@/lib/englishSettings'

/**
 * English time · 🇬🇧 Can or can't? La voce segue l'accento e la velocità di English time;
 * la traduzione italiana compare se è accesa nelle impostazioni di English time.
 */
export default function EnglishCan({ settings }: { settings: EnglishSettings }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smc-css', CAN_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountCan(box.current, { settings: { it: settings.translation, rate: settings.rate, accent: settings.accent }, onWin: () => autoStar() })
  }, [settings.translation, settings.rate, settings.accent])
  return <div ref={box} className="smc" style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }} />
}
