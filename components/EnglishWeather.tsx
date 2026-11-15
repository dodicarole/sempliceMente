'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { mountWeather, WEATHER_CSS } from '@/lib/games/weatherCore'
import { useScopedCss } from './GamesView'
import type { EnglishSettings } from '@/lib/englishSettings'

/** English time · 🌦️ What's the weather like? Voce, velocità e traduzione come nelle impostazioni di English time. */
export default function EnglishWeather({ settings }: { settings: EnglishSettings }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smw-css', WEATHER_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountWeather(box.current, { settings: { it: settings.translation, rate: settings.rate, accent: settings.accent }, onWin: () => autoStar() })
  }, [settings.translation, settings.rate, settings.accent])
  return <div ref={box} className="smw" style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }} />
}
