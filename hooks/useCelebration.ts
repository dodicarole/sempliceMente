import { useMemo } from 'react'
import { useT } from '@/lib/i18n'
import { pickCelebration, type Celebration } from '@/lib/fun'

/** Una nuova festa (gag di Tedo + frase) ogni volta che `active` diventa vero */
export function useCelebration(active: boolean): Celebration | null {
  const { t } = useT()
  return useMemo(() => (active ? pickCelebration(t) : null), [active]) // eslint-disable-line react-hooks/exhaustive-deps
}
