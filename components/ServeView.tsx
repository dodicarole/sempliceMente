'use client'
import { useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountServe, SERVE_CSS } from '@/lib/games/serveCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/** 🔧 A cosa serve? / À quoi ça sert ? — nella lingua dell'app. Nella demo le impostazioni sono sotto il gioco. */
export default function ServeView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const { t, lang } = useT()
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('sma-css', SERVE_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountServe(box.current, { lang: lang === 'fr' ? 'fr' : 'it', allowSettings, onWin: () => autoStar() })
  }, [allowSettings, lang])
  return (
    <>
      <SectionTitle emoji="🔧" title={t.serve.title} sub={t.serve.homeSub} onBack={() => { hush(); onBack() }} spot="serve" />
      <div ref={box} className="sma" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
    </>
  )
}

/** Area Genitore: le impostazioni e gli oggetti aggiunti, per il figlio scelto in alto */
export function ServeSettingsPanel() {
  const { lang } = useT()
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('sma-css', SERVE_CSS)
  useEffect(() => { if (!box.current) return; return mountServe(box.current, { lang: lang === 'fr' ? 'fr' : 'it', mode: 'parent' }) }, [lang])
  return <div ref={box} className="sma" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
