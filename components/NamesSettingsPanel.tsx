'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { NAMES_DEFAULTS, NAMES_OPTIONS, loadNamesSettings, saveNamesSettings, type NamesSettings } from '@/lib/namesSettings'
import s from './NumbersSettingsPanel.module.css'

export default function NamesSettingsPanel({ onChange }: { onChange?: (s: NamesSettings) => void }) {
  const { t } = useT()
  const [settings, setSettings] = useState<NamesSettings>(NAMES_DEFAULTS)
  const [saved, setSaved]       = useState(false)
  useEffect(() => { setSettings(loadNamesSettings()) }, [])

  const update = (key: keyof NamesSettings, val: NamesSettings[keyof NamesSettings]) => {
    const next = { ...settings, [key]: val }
    setSettings(next); saveNamesSettings(next); setSaved(true); onChange?.(next)
  }

  return (
    <div className={s.panel}>
      {NAMES_OPTIONS.map(opt => (
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
