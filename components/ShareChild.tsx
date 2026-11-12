'use client'
import { useState, useEffect, useCallback } from 'react'
import { useT } from '@/lib/i18n'
import { useChildren, type Child } from '@/lib/children'
import s from './NumbersSettingsPanel.module.css'

const input: React.CSSProperties = { minHeight: 50, padding: '0 14px', borderRadius: 'var(--radius-sm)', border: '2px solid #D6DBF2', background: 'var(--ground)', color: 'var(--text)', fontSize: 18, fontWeight: 800, fontFamily: 'inherit', width: '100%', letterSpacing: 2, textTransform: 'uppercase' }
const codeBox: React.CSSProperties = { fontSize: 34, fontWeight: 900, letterSpacing: 6, textAlign: 'center', padding: '12px 8px', borderRadius: 16, background: '#FFF6D6', color: '#3D2E00', border: '3px dashed #FFC93C', fontVariantNumeric: 'tabular-nums' }
const fmt = (iso: string, lang: string) => new Date(iso).toLocaleString(lang === 'fr' ? 'fr-FR' : 'it-IT', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
const pretty = (c: string) => `${c.slice(0, 4)} ${c.slice(4)}`

/**
 * Dentro la ✏️ di un proprio figlio: condividerlo con un altro adulto con un codice di invito
 * (48 ore, una volta sola), vedere chi lo segue già e togliere l'accesso.
 */
export function ShareChild({ child }: { child: Child }) {
  const { t, lang } = useT()
  const S = t.children.share
  const [people, setPeople] = useState<{ familyId: string; email: string; since: string }[]>([])
  const [invite, setInvite] = useState<{ code: string; expires_at: string } | null>(null)
  const [err, setErr] = useState('')
  const [copied, setCopied] = useState(false)
  const load = useCallback(async () => {
    const r = await fetch(`/api/children/${child.id}/share`).catch(() => null)
    if (!r) return
    const j = await r.json().catch(() => ({}))
    if (!r.ok) { setErr(r.status === 500 ? S.notReady : j.error ?? ''); return }
    setErr(''); setPeople(j.people ?? []); setInvite(j.invite ?? null)
  }, [child.id, S.notReady])
  useEffect(() => { load() }, [load])
  const create = async () => {
    const r = await fetch(`/api/children/${child.id}/share`, { method: 'POST' }).catch(() => null)
    const j = await r?.json().catch(() => ({}))
    if (!r || !r.ok) { setErr(r?.status === 500 ? S.notReady : j?.error ?? '!'); return }
    setInvite(j.invite); setCopied(false)
  }
  const del = async (q: string) => { await fetch(`/api/children/${child.id}/share?${q}`, { method: 'DELETE' }).catch(() => {}); load() }
  const text = invite ? S.shareText(child.name, pretty(invite.code)) : ''
  return (
    <div className={s.group}>
      <span className={s.label} style={{ fontWeight: 900, color: 'var(--text)', fontSize: 16 }}>{S.title}</span>
      <span className={s.label} style={{ fontSize: 13 }}>{S.hint}</span>
      {err && <span className={s.label} style={{ color: '#C92A2A', fontSize: 13 }}>{err}</span>}
      {people.length > 0 && (
        <>
          <span className={s.label}>{S.people}</span>
          {people.map(p => (
            <div key={p.familyId} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--ground)', borderRadius: 14, padding: '8px 12px' }}>
              <span style={{ flex: 1, fontWeight: 800 }}>👤 {p.email} <span style={{ fontWeight: 700, color: 'var(--text-soft)', fontSize: 13 }}>· {S.since(new Date(p.since).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'it-IT'))}</span></span>
              <button className={s.chip} onClick={() => { if (confirm(S.removeAsk(p.email))) del(`family=${p.familyId}`) }}>{S.removeAccess}</button>
            </div>
          ))}
        </>
      )}
      {invite ? (
        <>
          <div style={codeBox} aria-label={invite.code}>{pretty(invite.code)}</div>
          <span className={s.label} style={{ fontSize: 13 }}>{S.codeHint(fmt(invite.expires_at, lang))}</span>
          <div className={s.chips}>
            <button className={s.chip} onClick={async () => { try { await navigator.clipboard.writeText(text); setCopied(true) } catch (_) {} }}>{copied ? S.copied : S.copy}</button>
            {typeof navigator !== 'undefined' && 'share' in navigator && <button className={s.chip} onClick={() => navigator.share({ text }).catch(() => {})}>{S.send}</button>}
            <button className={s.chip} onClick={create}>{S.newCode}</button>
            <button className={s.chip} onClick={() => del('invite=1')}>{S.cancelCode}</button>
          </div>
        </>
      ) : !err && <div className={s.chips}><button className={s.chip} aria-pressed={true} onClick={create}>{S.create}</button></div>}
    </div>
  )
}

/** In fondo alla scheda 👨‍👧: seguire il bambino di un'altra famiglia con il suo codice */
export function JoinChild() {
  const { t } = useT()
  const J = t.children.join
  const { join } = useChildren()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  return (
    <div className={s.panel}>
      <div className={s.group}>
        <span className={s.label} style={{ fontWeight: 900, color: 'var(--text)', fontSize: 16 }}>{J.title}</span>
        <span className={s.label} style={{ fontSize: 13 }}>{J.hint}</span>
        <input style={input} value={code} maxLength={9} placeholder={J.placeholder} autoCapitalize="characters" autoComplete="off" onChange={e => setCode(e.target.value)} />
        <div className={s.chips}>
          <button className={s.chip} aria-pressed={true} disabled={busy || code.replace(/\s/g, '').length < 8} onClick={async () => {
            setBusy(true); const r = await join(code); setBusy(false)
            if ('error' in r) { setMsg({ ok: false, text: r.error }); return }
            setCode(''); setMsg({ ok: true, text: J.done(r.name) })
            setTimeout(() => setMsg(null), 5000)
          }}>{J.btn}</button>
        </div>
        {msg && <span className={s.label} style={{ color: msg.ok ? 'var(--done)' : '#C92A2A' }}>{msg.ok ? '✅ ' : ''}{msg.text}</span>}
      </div>
    </div>
  )
}
