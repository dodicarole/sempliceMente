'use client'
import { useState, useCallback } from 'react'
import { useAudio } from '@/hooks/useAudio'
import s from './PinScreen.module.css'

interface Props {
  title?: string
  subtitle: string
  showHint?: boolean
  /** Chiamata quando 4 cifre sono inserite. Restituisce true = OK, false = errore */
  onSubmit: (pin: string) => Promise<boolean>
}

export default function PinScreen({ title = 'Area Genitore', subtitle, showHint = false, onSubmit }: Props) {
  const [buffer,   setBuffer]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const [shaking,  setShaking]  = useState(false)
  const [hasError, setHasError] = useState(false)
  const { pinTick, pinError: playError } = useAudio()

  const triggerError = useCallback(() => {
    playError()
    setHasError(true)
    setShaking(true)
    setTimeout(() => {
      setShaking(false)
      setHasError(false)
      setBuffer('')
      setLoading(false)
    }, 500)
  }, [playError])

  const handlePress = useCallback(async (digit: string) => {
    if (buffer.length >= 4 || loading) return
    pinTick()
    const next = buffer + digit
    setBuffer(next)
    if (next.length < 4) return

    setLoading(true)
    const ok = await onSubmit(next)
    if (!ok) triggerError()
    // Se ok, il parent gestisce il cambio di vista; non resettare qui
  }, [buffer, loading, pinTick, onSubmit, triggerError])

  const handleDelete = useCallback(() => {
    if (loading) return
    setBuffer(b => b.slice(0, -1))
  }, [loading])

  return (
    <div className={s.screen}>
      <div className={s.lockIcon}>🔐</div>
      <div className={s.title}>{title}</div>
      <div className={s.subtitle}>{subtitle}</div>

      <div className={`${s.dots} ${shaking ? s.shaking : ''}`} aria-live="polite">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className={`${s.dot}${i < buffer.length ? (hasError ? ` ${s.error}` : ` ${s.filled}`) : ''}`}
          />
        ))}
      </div>

      <div className={s.numpad} role="group" aria-label="Tastierino numerico">
        {['1','2','3','4','5','6','7','8','9'].map(n => (
          <button key={n} className={s.key} onClick={() => handlePress(n)} disabled={loading}>{n}</button>
        ))}
        <div className={`${s.key} ${s.keyBlank}`} aria-hidden="true" />
        <button className={s.key} onClick={() => handlePress('0')} disabled={loading}>0</button>
        <button className={`${s.key} ${s.keyDel}`} onClick={handleDelete} disabled={loading} aria-label="Cancella">⌫</button>
      </div>

      {showHint && <div className={s.hint}>PIN di default: 1234</div>}
    </div>
  )
}