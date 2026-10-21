import { useMemo, useEffect } from 'react'
import { autoStar } from '@/lib/stars'
import { useT } from '@/lib/i18n'
import { pickCelebrationNoStar, type Celebration } from '@/lib/fun'

/** Una nuova festa (gag di Tedo + frase) ogni volta che `active` diventa vero */
export function useCelebration(active: boolean): Celebration | null {
  const { t } = useT()
  useEffect(() => { if (active) autoStar() }, [active])
  // la stellina la dà l'effetto qui sopra; pickCelebration la darebbe una seconda volta
  return useMemo(() => (active ? pickCelebrationNoStar(t) : null), [active]) // eslint-disable-line react-hooks/exhaustive-deps
}
