'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountHoha, HOHA_CSS } from '@/lib/games/hohaCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/** ✊ Ho o o? Ha o a? — la H che non si sente. Nella demo le impostazioni sono sotto il gioco. */
export default function HohaView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smh-css', HOHA_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountHoha(box.current, { allowSettings, onWin: () => autoStar() })
  }, [allowSettings])
  return (
    <>
      <SectionTitle emoji="✊" title="Ho o o? Ha o a?" sub="La H che non si sente" onBack={() => { hush(); onBack() }} spot="hoha" />
      <div ref={box} className="smh" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
    </>
  )
}

/** Area Genitore: le impostazioni e le frasi della scuola, per il figlio scelto in alto */
export function HohaSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smh-css', HOHA_CSS)
  useEffect(() => { if (!box.current) return; return mountHoha(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="smh" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
