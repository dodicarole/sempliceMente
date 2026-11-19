'use client'
import { useState } from 'react'
import s from './AuthScreen.module.css'
import { useT, translateServerError } from '@/lib/i18n'
import LanguagePicker from './LanguagePicker'

interface Props {
  onAuth: () => void
  onBack?: () => void
  /** il codice del link ricevuto per email: si apre direttamente "scegli una nuova password" */
  resetToken?: string
}

type Mode = 'login' | 'register' | 'forgot' | 'sent' | 'reset'

export default function AuthScreen({ onAuth, onBack, resetToken }: Props) {
  const { t, lang } = useT()
  const [mode,     setMode]     = useState<Mode>(resetToken ? 'reset' : 'login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  // "ho dimenticato la password": il server risponde sempre allo stesso modo
  const sendLink = async () => {
    setError('')
    if (!email.trim()) { setError(t.auth.missing); return }
    setLoading(true)
    const res = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), lang }) }).catch(() => null)
    setLoading(false)
    if (res && res.status === 429) { const d = await res.json().catch(() => ({})); setError(translateServerError(t, d.error ?? '')); return }
    setMode('sent')
  }
  // la nuova password, con il link dell'email; poi si entra
  const saveNew = async () => {
    setError('')
    if (password.length < 6) { setError(t.auth.tooShort); return }
    if (password !== confirm) { setError(t.auth.mismatch); return }
    setLoading(true)
    const res = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: resetToken, password }) })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok) { setError(data.error ? translateServerError(t, data.error) : t.auth.error); return }
    try { window.history.replaceState(null, '', window.location.pathname) } catch (_) {}
    onAuth()
  }

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

      {(mode === 'forgot' || mode === 'sent' || mode === 'reset') ? (
      <div className={s.card}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{mode === 'reset' ? t.auth.resetTitle : mode === 'sent' ? t.auth.sentTitle : t.auth.forgotTitle}</h2>
        {mode === 'forgot' && <>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-soft)', lineHeight: 1.45 }}>{t.auth.forgotHint}</p>
          <div className={s.fields}>
            <input className={s.input} type="email" placeholder={t.auth.email} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendLink()} autoComplete="email" />
          </div>
        </>}
        {mode === 'sent' && <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text-soft)', lineHeight: 1.5 }}>{t.auth.sent}</p>}
        {mode === 'reset' && (
          <div className={s.fields}>
            <input className={s.input} type="password" placeholder={t.auth.newPassword} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
            <input className={s.input} type="password" placeholder={t.auth.repeatPassword} value={confirm} onChange={e => setConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveNew()} autoComplete="new-password" />
          </div>
        )}
        {error && <div className={s.error}>{error}</div>}
        {mode === 'forgot' && <button className={s.submitBtn} onClick={sendLink} disabled={loading}>{loading ? '...' : t.auth.sendLink}</button>}
        {mode === 'reset' && <button className={s.submitBtn} onClick={saveNew} disabled={loading}>{loading ? '...' : t.auth.saveNew}</button>}
        <button onClick={() => { try { window.history.replaceState(null, '', window.location.pathname) } catch (_) {} switchMode('login') }} style={{ background: 'none', border: 'none', color: 'var(--blue, #6B7FE3)', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 6 }}>{t.auth.backToLogin}</button>
      </div>
      ) : (
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
        {mode === 'login' && (
          <button onClick={() => switchMode('forgot')} style={{ background: 'none', border: 'none', color: 'var(--blue, #6B7FE3)', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', padding: 6 }}>{t.auth.forgotLink}</button>
        )}
      </div>
      )}
    </div>
  )
}