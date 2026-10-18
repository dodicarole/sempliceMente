'use client'
import { useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { FUN_DEFAULTS, loadFunSettings, saveFunSettings, type FunSettings } from '@/lib/fun'
import s from './NumbersSettingsPanel.module.css'

export default function FunSettingsPanel() {
  const { t } = useT()
  const [settings, setSettings] = useState<FunSettings>(FUN_DEFAULTS)
  const [saved, setSaved]       = useState(false)
  useEffect(() => { setSettings(loadFunSettings()) }, [])

  const update = (key: keyof FunSettings, val: boolean) => {
    const next = { ...settings, [key]: val }
    setSettings(next); saveFunSettings(next); setSaved(true)
  }
  const row = (key: keyof FunSettings, label: string) => (
    <div className={s.group}>
      <span className={s.label}>{label}</span>
      <div className={s.chips}>
        {([[true, t.reading.yes], [false, t.reading.no]] as [boolean, string][]).map(([v, l]) => (
          <button key={String(v)} className={s.chip} aria-pressed={settings[key] === v} onClick={() => update(key, v)}>{l}</button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={s.panel}>
      {row('fun', t.tedo.settingFun)}
      {row('sound', t.tedo.settingSound)}
      <span className={s.label}>{t.tedo.settingNote}</span>
      {saved && <div className={s.saved}>{t.common.saved}</div>}
    </div>
  )
}
