'use client'
import { useState, useEffect } from 'react'
import { READING_DEFAULTS, READING_OPTIONS, loadReadingSettings, saveReadingSettings, type ReadingSettings } from '@/lib/readingSettings'
import s from './NumbersSettingsPanel.module.css'

export default function ReadingSettingsPanel() {
  const [settings, setSettings] = useState<ReadingSettings>(READING_DEFAULTS)
  const [saved, setSaved]       = useState(false)

  useEffect(() => { setSettings(loadReadingSettings()) }, [])

  const update = (key: keyof ReadingSettings, val: ReadingSettings[keyof ReadingSettings]) => {
    const next = { ...settings, [key]: val }
    setSettings(next)
    saveReadingSettings(next)
    setSaved(true)
  }

  const preview = settings.uppercase ? 'C’ERA UNA VOLTA UN BAMBINO CHE AMAVA LEGGERE.' : 'C’era una volta un bambino che amava leggere.'

  return (
    <div className={s.panel}>
      {READING_OPTIONS.map(opt => (
        <div key={opt.key} className={s.group}>
          <span className={s.label}>{opt.label}</span>
          <div className={s.chips}>
            {opt.values.map(([val, label]) => (
              <button key={String(val)} className={s.chip} aria-pressed={settings[opt.key] === val} onClick={() => update(opt.key, val)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className={s.group}>
        <span className={s.label}>Anteprima</span>
        <div className="reading-area" style={{ background: 'var(--ground)', borderRadius: 14, padding: '14px 16px', fontSize: 20, fontWeight: 700 }}>
          {preview}
        </div>
      </div>
      <span className={s.label}>Valgono per tutta l&apos;area del bambino. Nelle storie, il bottone 🔊 Ascolta legge il testo e illumina le parole mentre la voce va avanti.</span>
      {saved && <div className={s.saved}>✓ Salvato. Vale per questo dispositivo.</div>}
    </div>
  )
}
