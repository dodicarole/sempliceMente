'use client'
import { useEffect, useRef, useState } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import { mountPoem, POEM_CSS } from '@/lib/games/poemCore'
import { mountRecita, RECITA_CSS } from '@/lib/games/recitaCore'
import { loadRecita, recitaStepFor } from '@/lib/recita'
import { loadPlans, todayIso } from '@/lib/plans'
import { useScopedCss } from './GamesView'
import SectionTitle from './SectionTitle'

/**
 * 🎭 Imparo la poesia. Il bambino impara le poesie che il genitore ha inserito (area Genitore → 🎭);
 * nella demo c'è una poesia di esempio, e si può provare anche l'inserimento.
 */
/** il passo della recita di oggi, se nel piano c'è la sua tappa ancora da fare: la sezione si apre lì */
function recitaToday(): number | null {
  const step = loadPlans().days[todayIso()]?.steps.find(x => x.auto === 'recita' && !x.done)
  return step ? recitaStepFor(loadRecita(), todayIso())?.tab ?? null : null
}

export default function PoemView({ onBack, demo = false }: { onBack: () => void; demo?: boolean }) {
  const box = useRef<HTMLDivElement>(null)
  const rbox = useRef<HTMLDivElement>(null)
  const edit = useRef<HTMLDivElement>(null)
  const [version, setVersion] = useState(0)        // nella demo: dopo aver salvato una poesia, la sezione si ricarica
  const [startTab] = useState<number | null>(() => (demo ? null : recitaToday()))
  const [mode, setMode] = useState<'poesia' | 'recita'>(startTab !== null ? 'recita' : 'poesia')
  useScopedCss('smp-css', POEM_CSS)
  useScopedCss('smrc-css', RECITA_CSS)
  useEffect(() => {
    if (mode !== 'poesia' || !box.current) return
    return mountPoem(box.current, { demo, onWin: () => autoStar() })
  }, [demo, version, mode])
  // 🎬 la recita: la parte del bambino (nella demo, l'esempio di Natale, da provare anche come genitore)
  useEffect(() => {
    if (mode !== 'recita' || !rbox.current) return
    return mountRecita(rbox.current, { demo, allowSettings: demo, tab: startTab ?? undefined, stepFor: d => recitaStepFor(loadRecita(), d) })
  }, [demo, mode, startTab])
  // nella demo si può provare anche la parte del genitore, qui sotto
  useEffect(() => {
    if (!demo || mode !== 'poesia' || !edit.current) return
    return mountPoem(edit.current, { mode: 'parent', demo: true, onSaved: () => setVersion(v => v + 1) })
  }, [demo, mode])
  return (
    <>
      <SectionTitle emoji="🎭" title="Imparo la poesia" sub="Un verso alla volta, finché la sai a memoria" onBack={() => { hush(); onBack() }} spot="poesia" />
      {/* due modalità: le poesie, e la parte nella recita */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {(['poesia', 'recita'] as const).map(m => (
          <button key={m} onClick={() => { hush(); setMode(m) }} aria-pressed={mode === m}
            style={{ minHeight: 56, borderRadius: 16, border: `2px solid ${mode === m ? '#7048E8' : '#D6DBF2'}`, background: mode === m ? '#7048E8' : 'var(--card)', color: mode === m ? '#fff' : 'var(--text)', fontSize: 16, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }}>
            {m === 'poesia' ? '🎭 Le poesie' : '🎬 La recita'}
          </button>
        ))}
      </div>
      {mode === 'poesia' && <div ref={box} className="smp" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />}
      {mode === 'recita' && <div ref={rbox} className="smrc" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />}
      {demo && mode === 'poesia' && <div ref={edit} className="smp" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />}
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

/** Area Genitore → 🎭: la parte nella recita del figlio scelto in alto, e la prova nel piano di lavoro */
export function RecitaEditorPanel() {
  const box = useRef<HTMLDivElement>(null)
  useScopedCss('smrc-css', RECITA_CSS)
  useEffect(() => { if (!box.current) return; return mountRecita(box.current, { mode: 'parent', stepFor: d => recitaStepFor(loadRecita(), d) }) }, [])
  return <div ref={box} className="smrc" style={{ display: 'flex', flexDirection: 'column', gap: 14 }} />
}
