'use client'
import { useState } from 'react'
import { useSpeech } from '@/hooks/useSpeech'

/* Le parole-domanda con il loro colore e simbolo: gli stessi di "Cosa mi chiede la domanda?" e "Guarda, leggi, rispondi" */
const QW: Record<string, { e: string; c: string; w: string; look: string }> = {
  chi: { e: '👤', c: '#1C7ED6', w: 'Chi?', look: 'Cerca una persona o un animale' },
  cosa: { e: '❓', c: '#7048E8', w: 'Cosa?', look: 'Cerca una cosa, o quello che succede' },
  dove: { e: '📍', c: '#2F9E44', w: 'Dove?', look: 'Cerca un posto' },
  quando: { e: '🕒', c: '#E8590C', w: 'Quando?', look: 'Cerca un momento' },
  quanti: { e: '🔢', c: '#0B7285', w: 'Quanti?', look: 'Cerca un numero' },
  perche: { e: '💡', c: '#C2255C', w: 'Perché?', look: 'Cerca il motivo: «perché…»' },
  come: { e: '🔧', c: '#A3671C', w: 'Come?', look: 'Cerca il modo' },
}
const RE = /^(Chi|Che cosa|Cosa|Dove|Quando|Quanti|Quante|Perché|Come)\b/
/** L'aiuto colorato in tutta l'app: si accende in "Cosa mi chiede la domanda?" (impostazione «In tutta l'app»), per ogni figlio */
function everywhere(): boolean {
  try { const v = JSON.parse(localStorage.getItem('domande_impostazioni') || '{}'); return v.everywhere !== false } catch (_) { return true }
}

/** Il testo di una domanda: la parola-domanda diventa un'etichetta colorata; toccandola, compare (e si sente) l'aiuto */
export default function QText({ text, t }: { text: string; t?: string }) {
  const { speak } = useSpeech()
  const [open, setOpen] = useState(false)
  const m = text.match(RE), d = t ? QW[t] : undefined
  if (!m || !d || !everywhere()) return <>{text}</>
  return (
    <>
      <button type="button" onClick={() => { setOpen(o => !o); if (!open) speak(`${d.w} ${d.look}`) }} aria-label={`${d.w} ${d.look}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0 10px', borderRadius: 12, border: 'none', background: d.c, color: '#fff', font: 'inherit', fontWeight: 900, cursor: 'pointer', lineHeight: 1.5 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1.35em', height: '1.35em', borderRadius: '50%', background: '#fff', fontSize: '.8em' }}>{d.e}</span>{m[1]}
      </button>
      {text.slice(m[1].length)}
      {open && <span style={{ display: 'block', marginTop: 8, background: d.c, color: '#fff', borderRadius: 12, padding: '8px 12px', fontSize: 16, fontWeight: 900 }}>{d.e} {d.w} {d.look}!</span>}
    </>
  )
}
