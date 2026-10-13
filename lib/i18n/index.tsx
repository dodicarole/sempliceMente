'use client'
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { it, type Dict } from './it'
import { fr } from './fr'

export type Lang = 'it' | 'fr'
export const LANGS: { code: Lang; label: string }[] = [
  { code: 'it', label: '🇮🇹 Italiano' },
  { code: 'fr', label: '🇫🇷 Français' },
]

const DICTS: Record<Lang, Dict> = { it, fr }
const KEY = 'lingua'

/** Lingua salvata, oppure quella del telefono la prima volta */
function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'it' || saved === 'fr') return saved
  } catch (_) {}
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')) return 'fr'
  return 'it'
}

interface Ctx { lang: Lang; t: Dict; setLang: (l: Lang) => void }
const I18nContext = createContext<Ctx>({ lang: 'it', t: it, setLang: () => {} })

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('it')

  useEffect(() => { setLangState(detectLang()) }, [])
  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch (_) {}
  }, [])

  return <I18nContext.Provider value={{ lang, t: DICTS[lang], setLang }}>{children}</I18nContext.Provider>
}

/** Testi nella lingua scelta: const { t } = useT(); t.common.back */
export function useT() {
  return useContext(I18nContext)
}

/** Traduce un messaggio d'errore arrivato dal server (scritto in italiano) */
export function translateServerError(t: Dict, message: string): string {
  return t.serverErrors[message] ?? message
}
