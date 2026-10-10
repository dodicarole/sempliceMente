'use client'
import { useState, useEffect } from 'react'
import { loadChildGender, saveChildGender, loadChildName, saveChildName, type ChildGender } from '@/lib/praise'
import s from './NumbersSettingsPanel.module.css'

const OPTIONS: [ChildGender, string][] = [
  ['m', '👦 Bambino'],
  ['f', '👧 Bambina'],
  ['n', 'Non specificare'],
]

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
        <label className={s.label} htmlFor="child-name">Nome del bambino o della bambina</label>
        <input
          id="child-name"
          style={inputStyle}
          value={name}
          maxLength={20}
          placeholder="Per esempio: Christopher"
          autoComplete="off"
          onChange={e => changeName(e.target.value)}
        />
      </div>
      <div className={s.group}>
        <span className={s.label}>Chi usa l&apos;app?</span>
        <div className={s.chips}>
          {OPTIONS.map(([g, label]) => (
            <button key={g} className={s.chip} aria-pressed={gender === g} onClick={() => choose(g)}>{label}</button>
          ))}
        </div>
        <span className={s.label}>Servono per le frasi di incoraggiamento, come &quot;Bravo, Christopher!&quot; o &quot;Brava!&quot;. Con &quot;Non specificare&quot; l&apos;app usa solo frasi valide per tutti. Il nome resta solo su questo dispositivo.</span>
      </div>
      {saved && <div className={s.saved}>✓ Salvato. Vale per questo dispositivo.</div>}
    </div>
  )
}
