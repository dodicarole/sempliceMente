'use client'
import { useEffect, useRef, useState } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountPoem, POEM_CSS } from '@/lib/games/poemCore'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/**
 * 🎭 Imparo la poesia. Il bambino impara le poesie che il genitore ha inserito (area Genitore → 🎭);
 * nella demo c'è una poesia di esempio, e si può provare anche l'inserimento.
 */
export default function PoemView({ onBack, demo = false }: { onBack: () => void; demo?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const edit = useRef<HTMLDivElement>(null)
  const [version, setVersion] = useState(0)        // nella demo: dopo aver salvato una poesia, la sezione si ricarica
  useScopedCss('smp-css', POEM_CSS)
  useEffect(() => {
    if (!box.current) return
    return mountPoem(box.current, { demo, onWin: () => autoStar() })
  }, [demo, version])
  // nella demo si può provare anche la parte del genitore, qui sotto
  useEffect(() => {
    if (!demo || !edit.current) return
    return mountPoem(edit.current, { mode: 'parent', demo: true, onSaved: () => setVersion(v => v + 1) })
  }, [demo])
  return (
    <>
      <SectionTitle emoji="🎭" title="Imparo la poesia" sub="Un verso alla volta, finché la sai a memoria" onBack={() => { hush(); onBack() }} spot="poesia" />
      <div ref={box} className="smp" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
      {demo && <div ref={edit} className="smp" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />}
    </>
  )
}

/** Area Genitore: le poesie del figlio scelto in alto */
export function PoemEditorPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smp-css', POEM_CSS)
  useEffect(() => { if (!box.current) return; return mountPoem(box.current, { mode: 'parent' }) }, [])
  return <div ref={box} className="smp" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
