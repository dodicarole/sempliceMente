import { useMemo, useEffect } from 'react'
import { autoStar } from '@/lib/stars'
import { randomPraise } from '@/lib/praise'

/** Restituisce una nuova frase di incoraggiamento ogni volta che `active` diventa vero */
export function usePraise(active: boolean): string {
  useEffect(() => { if (active) autoStar() }, [active])
  return useMemo(() => (active ? randomPraise() : ''), [active])
}
