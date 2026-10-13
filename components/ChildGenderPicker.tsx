'use client'
import { useState, useEffect } from 'react'
import { loadChildGender, saveChildGender, loadChildName, saveChildName, type ChildGender } from '@/lib/praise'
import { useT } from '@/lib/i18n'
import s from './NumbersSettingsPanel.module.css'


const inputStyle: React.CSSProperties = {
  minHeight: 50,
  padding: '0 14px',
  borderRadius: 'var(--radius-sm)',
  border: '2px solid #D6DBF2',
  background: 'var(--ground)',
  color: 'var(--text)',
  fontSize: 17,
  fontWeight: 700,
  fontFamily: 'inherit',
  width: '100%',
}

export default function ChildGenderPicker() {
  const { t } = useT()
  const OPTIONS: [ChildGender, string][] = [['m', t.child.boy], ['f', t.child.girl], ['n', t.child.unspecified]]
  const [gender, setGender] = useState<ChildGender>('n')
  const [name, setName]     = useState('')
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    setGender(loadChildGender())
    setName(loadChildName())
  }, [])

  const choose = (g: ChildGender) => {
    setGender(g)
    saveChildGender(g)
    setSaved(true)
  }

  const changeName = (value: string) => {
    setName(value)
    saveChildName(value)
    setSaved(true)
  }

  return (
    <div className={s.panel}>
      <div className={s.group}>
        <label className={s.label} htmlFor="child-name">{t.child.nameLabel}</label>
        <input
          id="child-name"
          style={inputStyle}
          value={name}
          maxLength={20}
          placeholder={t.child.namePlaceholder}
          autoComplete="off"
          onChange={e => changeName(e.target.value)}
        />
      </div>
      <div className={s.group}>
        <span className={s.label}>{t.child.who}</span>
        <div className={s.chips}>
          {OPTIONS.map(([g, label]) => (
            <button key={g} className={s.chip} aria-pressed={gender === g} onClick={() => choose(g)}>{label}</button>
          ))}
        </div>
        <span className={s.label}>{t.child.note}</span>
      </div>
      {saved && <div className={s.saved}>{t.common.saved}</div>}
    </div>
  )
}
