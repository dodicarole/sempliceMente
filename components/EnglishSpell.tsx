'use client'
import { useEffect, useRef } from 'react'
import { autoStar } from '@/lib/stars'
import { mountSpell, SPELL_CSS } from '@/lib/games/spellCore'
import { useScopedCss } from './GamesView'
import type { EnglishSettings } from '@/lib/englishSettings'

/** English time · ✍️ Spell it! La voce usa l'accento scelto nelle impostazioni di English time. */
export default function EnglishSpell({ settings }: { settings: EnglishSettings }) {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('sms-css', SPELL_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountSpell(box.current, { accent: settings.accent, onWin: () => autoStar() })
  }, [settings.accent])
  return <div ref={box} className="sms" style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }} />
}

/** Area Genitore → 🇬🇧: le impostazioni e le liste di parole di Spell it!, per il figlio scelto in alto */
export function SpellSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('sms-css', SPELL_CSS)
  useEffect(() => { if (!box.current) return; return mountSpell(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="sms" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
