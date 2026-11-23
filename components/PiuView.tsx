'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountPiu, PIU_CSS } from '@/lib/games/piuCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/** 🏆 Il più grande, il più piccolo — tra tanti numeri. Nella demo le impostazioni sono sotto il gioco. */
export default function PiuView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smq-css', PIU_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountPiu(box.current, { allowSettings, onWin: () => autoStar() })
  }, [allowSettings])
  return (
    <>
      <SectionTitle emoji="🏆" title="Il più grande, il più piccolo" sub="Tra tanti numeri, chi vince?" onBack={() => { hush(); onBack() }} spot="piugrande" />
      <div ref={box} className="smq" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
    </>
  )
}

/** Area Genitore: le impostazioni, per il figlio scelto in alto */
export function PiuSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smq-css', PIU_CSS)
  useEffect(() => { if (!box.current) return; return mountPiu(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="smq" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
