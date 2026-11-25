'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountChi, CHI_CSS } from '@/lib/games/chiCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/** 👤 Solo «Chi?» — nella demo, sotto gli esercizi c'è anche la parte per il genitore */
export default function ChiView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smchi-css', CHI_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountChi(box.current, { allowSettings, onWin: () => autoStar() })
  }, [allowSettings])
  return (
    <>
      <SectionTitle emoji="👤" title="Solo «Chi?»" sub="Chi fa l’azione? Una persona o un animale" onBack={() => { hush(); onBack() }} spot="chi" />
      <div ref={box} className="smchi" style={{ display: 'flex', flexDirection: 'column', gap: 12 }} />
    </>
  )
}

/** Area Genitore: lo stato, i livelli con le indicazioni, gli aiuti e le sedute, per il figlio scelto in alto */
export function ChiSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smchi-css', CHI_CSS)
  useEffect(() => { if (!box.current) return; return mountChi(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="smchi" style={{ display: 'flex', flexDirection: 'column', gap: 12 }} />
}
