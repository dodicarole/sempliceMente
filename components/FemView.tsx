'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountFem, FEM_CSS } from '@/lib/games/femCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/** 👩‍⚕️ Il femminile — dottore → dottoressa. Nella demo le impostazioni sono sotto il gioco. */
export default function FemView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smf-css', FEM_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountFem(box.current, { allowSettings, onWin: () => autoStar() })
  }, [allowSettings])
  return (
    <>
      <SectionTitle emoji="👩‍⚕️" title="Il femminile" sub="Dottore → dottoressa" onBack={() => { hush(); onBack() }} spot="femminile" />
      <div ref={box} className="smf" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
    </>
  )
}

/** Area Genitore: le impostazioni e le parole della scuola, per il figlio scelto in alto */
export function FemSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smf-css', FEM_CSS)
  useEffect(() => { if (!box.current) return; return mountFem(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="smf" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
