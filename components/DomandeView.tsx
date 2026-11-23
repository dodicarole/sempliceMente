'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountDomande, DOMANDE_CSS } from '@/lib/games/domandeCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/** ❓ Cosa mi chiede la domanda? — chi, cosa, dove, quando… Nella demo le impostazioni sono sotto le attività. */
export default function DomandeView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smd-css', DOMANDE_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountDomande(box.current, { allowSettings, onWin: () => autoStar() })
  }, [allowSettings])
  return (
    <>
      <SectionTitle emoji="❓" title="Cosa mi chiede la domanda?" sub="Chi, cosa, dove, quando…" onBack={() => { hush(); onBack() }} spot="domande" />
      <div ref={box} className="smd" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
    </>
  )
}

/** Area Genitore: le parole-domanda, l'aiuto, e l'aiuto colorato in tutta l'app */
export function DomandeSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smd-css', DOMANDE_CSS)
  useEffect(() => { if (!box.current) return; return mountDomande(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="smd" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
