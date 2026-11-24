'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { useAudio } from '@/hooks/useAudio'
import { useChildren } from '@/lib/children'
import { mountGlr, GLR_CSS } from '@/lib/games/glrCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/** 🖼️ Guarda, leggi, rispondi — una domanda alla volta. Nella demo le impostazioni sono sotto gli esercizi. */
export default function GlrView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const { celebration } = useAudio()
  const kids = useChildren()
  const name = kids.active?.name
  useScopedCss('smr-css', GLR_CSS)
  useEffect(() => {
    if (!box.current) return
    // alla fine del giro: la stellina e la musichetta della festa
    // alla fine del giro la festa dice anche il nome del bambino (nella demo, senza nome)
    return mountGlr(box.current, { allowSettings, name, onWin: () => { autoStar(); celebration() } })
  }, [allowSettings, name]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <SectionTitle emoji="🖼️" title="Guarda, leggi, rispondi" sub="Chi? Cosa? Dove? Una domanda alla volta" onBack={() => { hush(); onBack() }} spot="glr" />
      <div ref={box} className="smr" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
    </>
  )
}

/** Area Genitore: le impostazioni, i risultati e le confusioni, per il figlio scelto in alto */
export function GlrSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smr-css', GLR_CSS)
  useEffect(() => { if (!box.current) return; return mountGlr(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="smr" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
