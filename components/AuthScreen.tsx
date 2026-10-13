'use client'
import { useState } from 'react'
import s from './AuthScreen.module.css'
import { useT, translateServerError } from '@/lib/i18n'
import LanguagePicker from './LanguagePicker'

interface Props {
  onAuth: () => void
  onBack?: () => void
}

type Mode = 'login' | 'register'

export default function AuthScreen({ onAuth, onBack }: Props) {
  const { t } = useT()
  const [mode,     setMode]     = useState<Mode>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async () => {
    setError('')
    if (!email.trim() || !password) { setError(t.auth.missing); return }
    if (mode === 'register' && password !== confirm) { setError(t.auth.mismatch); return }
    if (mode === 'register' && password.length < 6)  { setError(t.auth.tooShort); return }

    setLoading(true)
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error ? translateServerError(t, data.error) : t.auth.error); return }
    onAuth()
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setError('')
    setPassword('')
    setConfirm('')
  }

  return (
    <div className={s.container}>
      {onBack && (
        <button className={s.backBtn} onClick={onBack}>{t.auth.backToDemo}</button>
      )}
      <div className={s.logo}>🌟</div>
      <h1 className={s.appName}>SempliceMente Bimbi</h1>
      <p className={s.tagline}>{t.auth.tagline}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}><LanguagePicker compact /></div>

      <div className={s.card}>
        <div className={s.tabs}>
          <button className={`${s.tab}${mode === 'login' ? ` ${s.active}` : ''}`} onClick={() => switchMode('login')}>
            {t.auth.loginTab}
          </button>
          <button className={`${s.tab}${mode === 'register' ? ` ${s.active}` : ''}`} onClick={() => switchMode('register')}>
            {t.auth.registerTab}
          </button>
        </div>

        <div className={s.fields}>
          <input
            className={s.input}
            type="email"
            placeholder={t.auth.email}
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className={s.input}
            type="password"
            placeholder={t.auth.password}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => mode === 'login' && e.key === 'Enter' && handleSubmit()}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {mode === 'register' && (
            <input
              className={s.input}
              type="password"
              placeholder={t.auth.repeatPassword}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoComplete="new-password"
            />
          )}
        </div>

        {error && <div className={s.error}>{error}</div>}

        <button className={s.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? '...' : mode === 'login' ? t.auth.login : t.auth.register}
        </button>
      </div>
    </div>
  )
}