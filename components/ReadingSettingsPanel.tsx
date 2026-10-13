'use client'
import { useState, useEffect } from 'react'
import { READING_DEFAULTS, readingOptions, loadReadingSettings, saveReadingSettings, type ReadingSettings } from '@/lib/readingSettings'
import { useT } from '@/lib/i18n'
import s from './NumbersSettingsPanel.module.css'

export default function ReadingSettingsPanel() {
  const { t } = useT()
  const [settings, setSettings] = useState<ReadingSettings>(READING_DEFAULTS)
  const [saved, setSaved]       = useState(false)

  useEffect(() => { setSettings(loadReadingSettings()) }, [])

  const update = (key: keyof ReadingSettings, val: ReadingSettings[keyof ReadingSettings]) => {
    const next = { ...settings, [key]: val }
    setSettings(next)
    saveReadingSettings(next)
    setSaved(true)
  }


  return (
    <div className={s.panel}>
      {readingOptions(t.reading).map(opt => (
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
        <span className={s.label}>{t.reading.preview}</span>
        <div className="reading-area" style={{ background: 'var(--ground)', borderRadius: 14, padding: '14px 16px', fontSize: 20, fontWeight: 700 }}>
          {t.reading.previewText}
        </div>
      </div>
      <span className={s.label}>{t.reading.note}</span>
      {saved && <div className={s.saved}>{t.common.saved}</div>}
    </div>
  )
}
