'use client'
import { useMemo } from 'react'
import { useT } from '@/lib/i18n'
import { homeSections, type SectionId } from '@/lib/homeSections'

/** le sezioni che si possono mettere in un piano, con icona, nome e colore (nella lingua dell'app) */
export function useSectionInfo() {
  const { t, lang } = useT()
  return useMemo(() => {
    const { daily, learn } = homeSections(t, 'n')
    const list = [...learn, ...daily].filter(x => !x.it || lang === 'it').filter(x => !['stelline', 'timer'].includes(x.id))
    const byId = (id: SectionId) => list.find(x => x.id === id)
    return { list, byId }
  }, [t, lang])
}
