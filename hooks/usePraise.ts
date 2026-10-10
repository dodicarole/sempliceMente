import { useMemo } from 'react'
import { randomPraise } from '@/lib/praise'

/** Restituisce una nuova frase di incoraggiamento ogni volta che `active` diventa vero */
export function usePraise(active: boolean): string {
  return useMemo(() => (active ? randomPraise() : ''), [active])
}
