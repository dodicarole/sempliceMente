'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { ENGLISH_DEFAULTS, englishOptions, loadEnglishSettings, saveEnglishSettings, type EnglishSettings } from '@/lib/englishSettings'
import s from './NumbersSettingsPanel.module.css'

export default function EnglishSettingsPanel({ onChange }: { onChange?: (s: EnglishSettings) => void }) {
  const { t } = useT()
  const [settings, setSettings] = useState<EnglishSettings>(ENGLISH_DEFAULTS)
  const [saved, setSaved]       = useState(false)
  useEffect(() => { setSettings(loadEnglishSettings()) }, [])

  const update = (key: keyof EnglishSettings, val: EnglishSettings[keyof EnglishSettings]) => {
    const next = { ...settings, [key]: val }
    setSettings(next); saveEnglishSettings(next); setSaved(true); onChange?.(next)
  }

  return (
    <div className={s.panel}>
      {englishOptions(t).map(opt => (
        <div key={opt.key} className={s.group}>
          <span className={s.label}>{opt.label}</span>
          <div className={s.chips}>
            {opt.values.map(([val, label]) => (
              <button key={String(val)} className={s.chip} aria-pressed={settings[opt.key] === val} onClick={() => update(opt.key, val)}>{label}</button>
            ))}
          </div>
        </div>
      ))}
      {saved && <div className={s.saved}>{t.common.saved}</div>}
    </div>
  )
}
