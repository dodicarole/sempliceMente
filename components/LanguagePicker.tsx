'use client'
import { useT, LANGS } from '@/lib/i18n'
import s from './NumbersSettingsPanel.module.css'

/** Scelta della lingua: versione completa (area Genitore) o compatta (demo) */
export default function LanguagePicker({ compact = false }: { compact?: boolean }) {
  const { t, lang, setLang } = useT()

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 6 }} role="group" aria-label={t.parent.language}>
        {LANGS.map(l => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            aria-label={l.label}
            style={{
              border: '2px solid', borderColor: lang === l.code ? 'var(--blue)' : '#D6DBF2',
              background: lang === l.code ? 'var(--card)' : 'transparent', borderRadius: 999,
              padding: '4px 10px', fontSize: 18, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >{l.label.split(' ')[0]}</button>
        ))}
      </div>
    )
  }

  return (
    <div className={s.panel}>
      <div className={s.group}>
        <span className={s.label}>🌍 {t.parent.language}</span>
        <div className={s.chips}>
          {LANGS.map(l => (
            <button key={l.code} className={s.chip} aria-pressed={lang === l.code} onClick={() => setLang(l.code)}>{l.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
