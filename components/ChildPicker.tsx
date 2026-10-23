'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useT } from '@/lib/i18n'
import { useChildren, type Child } from '@/lib/children'
import s from './ChildPicker.module.css'

export function Avatar({ child, size = 96 }: { child: Pick<Child, 'avatar'>; size?: number }) {
  return <Image src={`/amici/${child.avatar}.png`} alt="" width={size} height={size} className={s.avatar} />
}

/** "Chi usa l'app?": un grande cartello per ogni figlio */
export default function ChildPicker() {
  const { t } = useT()
  const { children, choose } = useChildren()
  const [remember, setRemember] = useState(false)
  return (
    <div className={s.screen}>
      <h1 className={s.title}>{t.children.whoTitle}</h1>
      <div className={s.grid}>
        {children.map(c => (
          <button key={c.id} className={s.card} onClick={() => choose(c.id, remember)}>
            <Avatar child={c} size={110} />
            <span className={s.name}>{c.name || t.children.noName}</span>
          </button>
        ))}
      </div>
      <label className={s.remember}>
        <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
        {t.children.remember}
      </label>
    </div>
  )
}

/** Il figlio attivo in alto nella home: toccandolo si torna a "Chi usa l'app?" */
export function ChildSwitch() {
  const { t } = useT()
  const { children, active, askAgain } = useChildren()
  if (children.length < 2 || !active) return null
  return (
    <button className={s.switch} onClick={askAgain} aria-label={t.children.switch}>
      <Avatar child={active} size={40} />
      <span>{active.name || t.children.noName}</span>
      <span className={s.switchIcon}>⇄</span>
    </button>
  )
}
