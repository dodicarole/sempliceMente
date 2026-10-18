'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { SPLIT_DEFAULTS, splitOptions, loadSplitSettings, saveSplitSettings, type SplitSettings } from '@/lib/splitSettings'
import s from './NumbersSettingsPanel.module.css'

export default function SplitSettingsPanel({ onChange }: { onChange?: (s: SplitSettings) => void }) {
  const { t } = useT()
  const [settings, setSettings] = useState<SplitSettings>(SPLIT_DEFAULTS)
  const [saved, setSaved]       = useState(false)
  useEffect(() => { setSettings(loadSplitSettings()) }, [])

  const update = (key: keyof SplitSettings, val: SplitSettings[keyof SplitSettings]) => {
    const next = { ...settings, [key]: val }
    setSettings(next); saveSplitSettings(next); setSaved(true); onChange?.(next)
  }

  return (
    <div className={s.panel}>
      {splitOptions(t).map(opt => (
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
