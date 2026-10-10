'use client'
import { useState, useEffect } from 'react'
import { loadChildGender, saveChildGender, type ChildGender } from '@/lib/praise'
import s from './NumbersSettingsPanel.module.css'

const OPTIONS: [ChildGender, string][] = [
  ['m', '👦 Bambino'],
  ['f', '👧 Bambina'],
  ['n', 'Non specificare'],
]

export default function ChildGenderPicker() {
  const [gender, setGender] = useState<ChildGender>('n')
  const [saved, setSaved]   = useState(false)

  useEffect(() => { setGender(loadChildGender()) }, [])

  const choose = (g: ChildGender) => {
    setGender(g)
    saveChildGender(g)
    setSaved(true)
  }

  return (
    <div className={s.panel}>
      <div className={s.group}>
        <span className={s.label}>Chi usa l&apos;app?</span>
        <div className={s.chips}>
          {OPTIONS.map(([g, label]) => (
            <button key={g} className={s.chip} aria-pressed={gender === g} onClick={() => choose(g)}>{label}</button>
          ))}
        </div>
        <span className={s.label}>Serve per le frasi di incoraggiamento: &quot;Bravo&quot; o &quot;Brava&quot;. Con &quot;Non specificare&quot; l&apos;app usa solo frasi valide per tutti, come &quot;Fantastico!&quot; o &quot;Sei forte!&quot;.</span>
      </div>
      {saved && <div className={s.saved}>✓ Salvato. Vale per questo dispositivo.</div>}
    </div>
  )
}
