'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountAmici, AMICI_CSS } from '@/lib/games/amiciCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/** 🤝 Gli amici del 10 (e del 100 e del 1000). Nella demo le impostazioni sono sotto le attività. */
export default function AmiciView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('sma10-css', AMICI_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountAmici(box.current, { allowSettings, onWin: () => autoStar() })
  }, [allowSettings])
  return (
    <>
      <SectionTitle emoji="🤝" title="Gli amici del 10" sub="…e poi del 100 e del 1000" onBack={() => { hush(); onBack() }} spot="amici" />
      <div ref={box} className="sma10" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
    </>
  )
}

/** Area Genitore: i livelli aperti e gli aiuti, per il figlio scelto in alto */
export function AmiciSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('sma10-css', AMICI_CSS)
  useEffect(() => { if (!box.current) return; return mountAmici(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="sma10" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
