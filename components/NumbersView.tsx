'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAudio } from '@/hooks/useAudio'
import NumbersSettingsPanel from './NumbersSettingsPanel'
import { NUMBERS_DEFAULTS, loadNumbersSettings, type NumbersSettings as Settings } from '@/lib/numbersSettings'
import s from './NumbersView.module.css'

interface Props {
  onBack: () => void
  /** Mostra l'ingranaggio delle impostazioni dentro il gioco (solo modalità demo, dove non c'è l'area genitore) */
  allowSettings?: boolean
}


function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeGame(max: number, count: number, order: 'asc' | 'desc') {
  const n = Math.min(count, max)
  const all = shuffle(Array.from({ length: max }, (_, i) => i + 1))
  const target = all.slice(0, n).sort((a, b) => (order === 'desc' ? b - a : a - b))
  let pool = shuffle(target)
  while (pool.length > 1 && pool.every((v, i) => v === target[i])) pool = shuffle(target)
  return { target, pool }
}

export default function NumbersView({ onBack, allowSettings = false }: Props) {
  const [settings,  setSettings]  = useState<Settings>(NUMBERS_DEFAULTS)
  const [showPanel, setShowPanel] = useState(false)
  const [target,    setTarget]    = useState<number[]>([])
  const [pool,      setPool]      = useState<number[]>([])
  const [placed,    setPlaced]    = useState(0)
  const [hint,      setHint]      = useState<number | null>(null)
  const [popIndex,  setPopIndex]  = useState<number | null>(null)
  const [won,       setWon]       = useState(false)
  const missesRef = useRef(0)
  const trainRef  = useRef<HTMLDivElement>(null)
  const { check, celebration } = useAudio()

  const speak = useCallback((text: string, voice: boolean) => {
    if (!voice || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    try {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'it-IT'
      u.rate = 0.85
      window.speechSynthesis.speak(u)
    } catch (_) {}
  }, [])

  const newGame = useCallback((st: Settings) => {
    const g = makeGame(st.max, st.count, st.order)
    setTarget(g.target)
    setPool(g.pool)
    setPlaced(0)
    setHint(null)
    setPopIndex(null)
    setWon(false)
    missesRef.current = 0
  }, [])

  useEffect(() => {
    const loaded = loadNumbersSettings()
    setSettings(loaded)
    newGame(loaded)
  }, [newGame])

  const showHint = useCallback(() => {
    const next = target[placed]
    if (next !== undefined) setHint(next)
  }, [target, placed])

  const tryPlace = useCallback((v: number, el: HTMLElement) => {
    const next = target[placed]
    if (v === next) {
      const newPlaced = placed + 1
      setPlaced(newPlaced)
      setPool(p => p.filter(x => x !== v))
      setPopIndex(placed)
      setHint(null)
      missesRef.current = 0
      check()
      speak(String(v), settings.voice)
      if (newPlaced === target.length) {
        setTimeout(() => {
          setWon(true)
          celebration()
          speak('Bravo!', settings.voice)
        }, 500)
      }
    } else {
      el.classList.remove(s.wrong)
      void el.offsetWidth
      el.classList.add(s.wrong)
      missesRef.current += 1
      if (settings.autoHelp && missesRef.current >= 2) setHint(next)
    }
  }, [target, placed, settings, check, celebration, speak])

  const isOverTrain = (x: number, y: number) => {
    const r = trainRef.current?.getBoundingClientRect()
    if (!r) return false
    const pad = 30
    return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad
  }

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>, v: number) => {
    if (settings.mode !== 'drag') return
    e.preventDefault()
    const el = e.currentTarget
    try { el.setPointerCapture(e.pointerId) } catch (_) {}
    const ox = e.clientX
    const oy = e.clientY
    el.classList.add(s.dragging)

    const move = (ev: PointerEvent) => {
      el.style.transform = `translate(${ev.clientX - ox}px, ${ev.clientY - oy}px) scale(1.08)`
      trainRef.current?.classList.toggle(s.over, isOverTrain(ev.clientX, ev.clientY))
    }
    const end = (ev: PointerEvent) => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', end)
      el.removeEventListener('pointercancel', end)
      const dropped = ev.type === 'pointerup' && isOverTrain(ev.clientX, ev.clientY)
      el.classList.remove(s.dragging)
      el.style.transform = ''
      trainRef.current?.classList.remove(s.over)
      if (dropped) tryPlace(v, el)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', end)
    el.addEventListener('pointercancel', end)
  }

  const handleSettingsChange = (next: Settings) => {
    setSettings(next)
    newGame(next)
  }

  const desc = settings.order === 'desc'
  const word = desc ? 'decrescente' : 'crescente'
  const which = desc ? 'grande' : 'piccolo'
  const askText = settings.mode === 'drag'
    ? (placed === 0 ? `Trascina il numero più ${which} nel posto giallo` : `Trascina il più ${which} che resta`)
    : (placed === 0 ? `Tocca il numero più ${which}` : `Tocca il più ${which} che resta`)

  const done = new Set(target.slice(0, placed))
  const inPlay = new Set(target)

  return (
    <>
      <button className={s.back} onClick={onBack}>← Indietro</button>

      <div className={s.header}>
        <h2 className={s.title}>
          Metti in ordine{' '}
          <span className={s.keep}>
            <span className={s.cresc} aria-label={word}>
              {word.split('').map((ch, i) => <span key={i} aria-hidden="true">{ch}</span>)}
            </span>
            {desc ? (
              <svg className={`${s.arrow} ${s.arrowDesc}`} viewBox="0 0 48 24" aria-label="da destra a sinistra" role="img">
                <path d="M44 12 H8 M18 3 L6 12 L18 21" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className={s.arrow} viewBox="0 0 48 24" aria-label="da sinistra a destra" role="img">
                <path d="M4 12 H40 M30 3 L42 12 L30 21" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </h2>
        {allowSettings && (
          <button
            className={s.gear}
            onClick={() => setShowPanel(p => !p)}
            aria-label="Impostazioni"
            aria-expanded={showPanel}
          >⚙️</button>
        )}
      </div>

      {allowSettings && showPanel && <NumbersSettingsPanel onChange={handleSettingsChange} />}

      {settings.showLine && (
        <div className={`${s.line}${settings.max > 50 ? ` ${s.big}` : ''}`} aria-label="Linea dei numeri">
          {Array.from({ length: settings.max }, (_, i) => i + 1).map(n => {
            const cls = done.has(n) ? s.cellDone : n === hint ? s.cellHint : inPlay.has(n) ? s.cellPlay : ''
            return <div key={n} className={`${s.cell} ${cls}`}>{n}</div>
          })}
        </div>
      )}

      {won ? (
        <div className={s.win}>
          <div className={s.star} aria-hidden="true">⭐</div>
          <div className={s.winTitle}>Bravo!</div>
          <button className={`${s.btn} ${s.main}`} onClick={() => newGame(settings)}>Gioca ancora</button>
        </div>
      ) : (
        <>
          <p className={s.ask}>{askText}</p>

          <div ref={trainRef} className={s.train} aria-label="Numeri in fila">
            {target.map((v, i) => (
              <div
                key={i}
                className={`${s.slot}${i < placed ? ` ${s.filled}` : i === placed ? ` ${s.next}` : ''}${i === popIndex ? ` ${s.pop}` : ''}`}
              >
                {i < placed ? v : ''}
              </div>
            ))}
          </div>

          <div className={`${s.pool}${settings.mode === 'drag' ? ` ${s.drag}` : ''}`}>
            {pool.map(v => (
              <button
                key={v}
                className={`${s.num}${v === hint ? ` ${s.numHint}` : ''}`}
                aria-label={`Numero ${v}`}
                onClick={e => { if (settings.mode === 'tap') tryPlace(v, e.currentTarget) }}
                onPointerDown={e => onPointerDown(e, v)}
              >{v}</button>
            ))}
          </div>

          <div className={s.bar}>
            <button className={s.btn} onClick={showHint}>💡 Aiuto</button>
            <button className={s.btn} onClick={() => newGame(settings)}>🔄 Nuovi numeri</button>
          </div>
        </>
      )}
    </>
  )
}
