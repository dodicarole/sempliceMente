'use client'
import { useState, useEffect } from 'react'
import { NUMBERS_DEFAULTS, NUMBERS_OPTIONS, loadNumbersSettings, saveNumbersSettings, type NumbersSettings } from '@/lib/numbersSettings'
import s from './NumbersSettingsPanel.module.css'

interface Props {
  onChange?: (settings: NumbersSettings) => void
}

export default function NumbersSettingsPanel({ onChange }: Props) {
  const [settings, setSettings] = useState<NumbersSettings>(NUMBERS_DEFAULTS)
  const [saved, setSaved]       = useState(false)

  useEffect(() => { setSettings(loadNumbersSettings()) }, [])

  const update = (key: keyof NumbersSettings, val: NumbersSettings[keyof NumbersSettings]) => {
    const next = { ...settings, [key]: val }
    setSettings(next)
    saveNumbersSettings(next)
    setSaved(true)
    onChange?.(next)
  }

  return (
    <div className={s.panel}>
      {NUMBERS_OPTIONS.map(opt => (
        <div key={opt.key} className={s.group}>
          <span className={s.label}>{opt.label}</span>
          <div className={s.chips}>
            {opt.values.map(([val, label]) => (
              <button
                key={String(val)}
                className={s.chip}
                aria-pressed={settings[opt.key] === val}
                onClick={() => update(opt.key, val)}
              >{label}</button>
            ))}
          </div>
        </div>
      ))}
      {saved && <div className={s.saved}>✓ Salvato. Vale per questo dispositivo.</div>}
    </div>
  )
}
