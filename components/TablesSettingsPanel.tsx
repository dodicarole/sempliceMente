'use client'
import { useState, useEffect } from 'react'
import { TABLES_DEFAULTS, TABLES_OPTIONS, loadTablesSettings, saveTablesSettings, type TablesSettings } from '@/lib/tablesSettings'
import s from './NumbersSettingsPanel.module.css'

interface Props {
  onChange?: (settings: TablesSettings) => void
}

export default function TablesSettingsPanel({ onChange }: Props) {
  const [settings, setSettings] = useState<TablesSettings>(TABLES_DEFAULTS)
  const [saved, setSaved]       = useState(false)

  useEffect(() => { setSettings(loadTablesSettings()) }, [])

  const toggle = (key: keyof TablesSettings, val: unknown, multi?: boolean) => {
    let next: TablesSettings
    if (multi) {
      const current = settings[key] as unknown[]
      const has = current.includes(val)
      if (has && current.length === 1) return // almeno una scelta
      const order = TABLES_OPTIONS.find(o => o.key === key)!.values.map(v => v[0])
      next = { ...settings, [key]: has ? current.filter(x => x !== val) : order.filter(x => x === val || current.includes(x)) }
    } else {
      next = { ...settings, [key]: val }
    }
    setSettings(next)
    saveTablesSettings(next)
    setSaved(true)
    onChange?.(next)
  }

  return (
    <div className={s.panel}>
      {TABLES_OPTIONS.map(opt => (
        <div key={opt.key} className={s.group}>
          <span className={s.label}>{opt.label}</span>
          <div className={s.chips}>
            {opt.values.map(([val, label]) => {
              const on = opt.multi ? (settings[opt.key] as unknown[]).includes(val) : settings[opt.key] === val
              return (
                <button key={String(val)} className={s.chip} aria-pressed={on} onClick={() => toggle(opt.key, val, opt.multi)}>
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div className={s.label}>Ordine consigliato per introdurle: 1, 0, 2, 10, 5, 11, poi 3, 4, poi 6, 7, 8, 9 e infine 12.</div>
      {saved && <div className={s.saved}>✓ Salvato. Vale per questo dispositivo.</div>}
    </div>
  )
}
