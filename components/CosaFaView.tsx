'use client'
import { useMemo, useState } from 'react'
import { autoStar } from '@/lib/stars'
import { hush } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'

type Exercise = { scene: string; actor: string; action: string; distractor: string; sentence: string }
const EXERCISES: Exercise[] = [
  { scene: '🏃‍♂️🌳☀️', actor: 'Il bambino', action: 'corre', distractor: 'dorme', sentence: 'Il bambino corre nel parco.' },
  { scene: '🐶⚽🌿', actor: 'Il cane', action: 'gioca', distractor: 'nuota', sentence: 'Il cane gioca con la palla.' },
  { scene: '👧📖🛋️', actor: 'La bambina', action: 'legge', distractor: 'cucina', sentence: 'La bambina legge un libro.' },
  { scene: '👩‍🍳🍲🥕', actor: 'La mamma', action: 'cucina', distractor: 'disegna', sentence: 'La mamma cucina la cena.' },
  { scene: '🐱💤🧺', actor: 'Il gatto', action: 'dorme', distractor: 'salta', sentence: 'Il gatto dorme nella cesta.' },
  { scene: '👨‍🌾🌷💧', actor: 'Il papà', action: 'innaffia', distractor: 'legge', sentence: 'Il papà innaffia i fiori.' },
  { scene: '👦⚽🥅', actor: 'Il bambino', action: 'calcia', distractor: 'mangia', sentence: 'Il bambino calcia il pallone.' },
  { scene: '🐦🌳🎵', actor: 'L’uccellino', action: 'canta', distractor: 'corre', sentence: 'L’uccellino canta sull’albero.' },
  { scene: '👩‍🏫📚✏️', actor: 'La maestra', action: 'scrive', distractor: 'nuota', sentence: 'La maestra scrive alla lavagna.' },
  { scene: '🐰🥕🌱', actor: 'Il coniglio', action: 'mangia', distractor: 'vola', sentence: 'Il coniglio mangia una carota.' },
  { scene: '👧🎨🖌️', actor: 'La bambina', action: 'disegna', distractor: 'dorme', sentence: 'La bambina disegna un fiore.' },
  { scene: '🐟🌊🫧', actor: 'Il pesce', action: 'nuota', distractor: 'cammina', sentence: 'Il pesce nuota nell’acqua.' },
]
const LEVELS = [
  { title: 'Livello 1 · Scegli l’azione', hint: 'Guarda la scena e scegli che cosa sta facendo il personaggio.' },
  { title: 'Livello 2 · Attenzione all’azione', hint: 'Le scene cambiano: osserva bene e scegli l’azione giusta.' },
  { title: 'Livello 3 · Un piccolo aiuto', hint: 'Se serve, ascolta la frase e usa il suggerimento iniziale.' },
  { title: 'Livello 4 · Rispondi da solo', hint: 'Guarda la scena e prova a dire da solo che cosa fa.' },
]
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

export default function CosaFaView({ onBack }: { onBack: () => void }) {
  const [level, setLevel] = useState(1)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [finished, setFinished] = useState(false)
  const [help, setHelp] = useState(false)
  const order = useMemo(() => shuffle(EXERCISES), [level, finished])
  const current = order[index % order.length]
  const choices = useMemo(() => shuffle([current.action, current.distractor]), [current])

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'it-IT'
    window.speechSynthesis.speak(utterance)
  }
  const next = (correct: boolean) => {
    setScore(value => value + (correct ? 1 : 0))
    setFeedback(correct ? 'Bravissimo! Hai trovato l’azione.' : 'Ascolta la frase e riprova con calma.')
    if (correct) speak(current.sentence)
    window.setTimeout(() => {
      setFeedback('')
      setHelp(false)
      if (index >= 3) {
        setFinished(true)
        if (score + (correct ? 1 : 0) >= 3) autoStar()
      } else setIndex(value => value + 1)
    }, 900)
  }
  const restart = () => { setIndex(0); setScore(0); setFeedback(''); setFinished(false); setHelp(false) }
  const changeLevel = (value: number) => { setLevel(value); restart() }

  return (
    <>
      <SectionTitle emoji="🎬" title="Solo «Cosa fa?»" sub="Osserva la scena e trova l’azione" onBack={() => { hush(); onBack() }} spot="chi" />
      <div style={{ background: '#EDF0FB', borderRadius: 22, padding: 16, color: '#1F2147', display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <strong style={{ background: '#1C7ED6', color: 'white', borderRadius: 14, padding: '9px 13px' }}>Prova {Math.min(index + 1, 4)} di 4</strong>
          <div style={{ display: 'flex', gap: 5 }}>{[0,1,2,3].map(n => <span key={n} style={{ width: 13, height: 13, borderRadius: 20, background: n < index ? '#2F9E44' : n === index && !finished ? '#1C7ED6' : '#D6DBF2' }} />)}</div>
        </div>
        <div style={{ background: 'white', borderRadius: 18, padding: '24px 12px', textAlign: 'center', fontSize: 76, lineHeight: 1.5 }} role="img" aria-label={current.sentence}>{current.scene}</div>
        <div style={{ background: 'white', borderRadius: 16, padding: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#545B88', fontWeight: 800, marginBottom: 5 }}>LIVELLO {level}</div>
          <div style={{ fontSize: 24, fontWeight: 900 }}>❓ Cosa fa?</div>
          {level >= 2 && <div style={{ fontSize: 16, marginTop: 5 }}>{current.actor}</div>}
        </div>
        {!finished ? (
          <>
            {level < 4 ? <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {choices.map(choice => <button key={choice} disabled={!!feedback} onClick={() => next(choice === current.action)} style={{ minHeight: 62, borderRadius: 15, border: '3px solid #D6DBF2', background: 'white', fontSize: 21, fontWeight: 900, color: '#1F2147' }}>{choice}</button>)}
            </div> : <button onClick={() => next(true)} disabled={!!feedback} style={{ minHeight: 58, borderRadius: 15, border: 0, background: '#2A7A4F', color: 'white', fontSize: 18, fontWeight: 900 }}>Ho risposto: avanti</button>}
            {level === 3 && <button onClick={() => { setHelp(true); speak(current.sentence) }} style={{ minHeight: 48, borderRadius: 14, border: '2px solid #F0C93C', background: '#FFF3BF', fontWeight: 800 }}>💡 Ascolta la frase</button>}
            {help && <div style={{ background: '#E7F5FF', borderRadius: 14, padding: 12, fontWeight: 800 }}>La frase inizia con: «{current.sentence.split(' ')[0]}…»</div>}
            <button onClick={() => speak('Cosa fa?')} style={{ minHeight: 48, borderRadius: 14, border: '2px solid #D6DBF2', background: 'white', fontWeight: 800 }}>🔊 Ascolta la domanda</button>
            {feedback && <div aria-live="polite" style={{ background: '#E6F6EE', borderRadius: 14, padding: 12, textAlign: 'center', fontWeight: 900 }}>{feedback}</div>}
          </>
        ) : (
          <div style={{ background: 'white', borderRadius: 16, padding: 18, textAlign: 'center' }}>
            <div style={{ fontSize: 25, fontWeight: 900 }}>Blocco completato! ⭐</div>
            <p style={{ fontSize: 18 }}>Risposte corrette: {score} su 4</p>
            <button onClick={restart} style={{ minHeight: 50, padding: '0 20px', border: 0, borderRadius: 14, background: '#2A7A4F', color: 'white', fontWeight: 900, fontSize: 16 }}>🔄 Un altro blocco</button>
          </div>
        )}
        <div style={{ background: 'white', borderRadius: 15, padding: 12 }}>
          <div style={{ fontWeight: 900, marginBottom: 7 }}>{LEVELS[level - 1].title}</div>
          <div style={{ fontSize: 14, color: '#545B88', lineHeight: 1.5 }}>{LEVELS[level - 1].hint}</div>
          <div style={{ display: 'flex', gap: 7, marginTop: 10, flexWrap: 'wrap' }}>{[1,2,3,4].map(n => <button key={n} onClick={() => changeLevel(n)} aria-pressed={level === n} style={{ minWidth: 44, minHeight: 42, borderRadius: 12, border: '2px solid #D6DBF2', background: level === n ? '#1C7ED6' : 'white', color: level === n ? 'white' : '#1F2147', fontWeight: 900 }}>{n}</button>)}</div>
        </div>
      </div>
    </>
  )
}
