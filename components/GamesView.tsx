'use client'
import { useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountGames, GAMES_CSS } from '@/lib/games/gamesCore'
import SectionTitle from './SectionTitle'

/** Le impostazioni dei giochi, per figlio (vedi lib/childStore.ts) */
export const GAMES_KEY = 'giochi_impostazioni'
export const GAMES_DEFAULTS = { pads: 6, written: true, faces: 3, eat: 'frutta', speed: 'lento' }
export function loadGamesSettings(): typeof GAMES_DEFAULTS {
  try { const r = localStorage.getItem(GAMES_KEY); if (r) return { ...GAMES_DEFAULTS, ...JSON.parse(r) } } catch (_) {}
  return GAMES_DEFAULTS
}
export function saveGamesSettings(v: Record<string, unknown>) { try { localStorage.setItem(GAMES_KEY, JSON.stringify(v)) } catch (_) {} }

/** Lo stile dei giochi, una volta sola nella pagina (vale solo dentro i contenitori .smg / .smc) */
export function useScopedCss(id: string, css: string) {
  useEffect(() => {
    if (document.getElementById(id)) return
    const st = document.createElement('style'); st.id = id; st.textContent = css; document.head.appendChild(st)
  }, [id, css])
}

/**
 * 🎲 Giochi: undici piccoli giochi per memoria, attenzione, lettura, numeri ed emozioni.
 * Ogni partita finita dà una stellina. Nella demo le impostazioni sono sotto l'elenco.
 */
export default function GamesView({ onBack, allowSettings = false }: { onBack: () => void; allowSettings?: boolean }) {
  const { t } = useT()
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smg-css', GAMES_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountGames(box.current, { settings: loadGamesSettings(), allowSettings, onWin: () => autoStar(), onSettings: saveGamesSettings })
  }, [allowSettings])
  return (
    <>
      <SectionTitle emoji="🎲" title={t.games.title} sub={t.games.homeSub} onBack={() => { hush(); onBack() }} spot="giochi" />
      <div ref={box} className="smg" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
    </>
  )
}

/** Area Genitore: le impostazioni dei giochi */
export function GamesSettingsPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smg-css', GAMES_CSS)
  useEffect(() => {
    if (!box.current) return
    // il pannello del gioco, da solo: si nasconde l'elenco dei giochi
    const stop = mountGames(box.current, { settings: loadGamesSettings(), allowSettings: true, onSettings: saveGamesSettings })
    const view = box.current.querySelector('[data-k="view"]') as HTMLElement | null
    if (view) view.style.display = 'none'
    return stop
  }, [])
  return <div ref={box} className="smg" />
}
