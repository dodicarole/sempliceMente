'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { useChildren } from '@/lib/children'
import { loadSchool, saveSchool, keyOf, type ZainoSchool } from '@/lib/zainoSchool'
import type { ScheduleItem } from '@/types'
import s from './NumbersSettingsPanel.module.css'

const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ground)', borderRadius: 14, padding: '8px 10px' }
const small = (on: boolean): React.CSSProperties => ({ minHeight: 40, padding: '0 10px', borderRadius: 12, border: `2px solid ${on ? '#F08C00' : '#D6DBF2'}`, background: on ? '#F08C00' : 'var(--card)', color: on ? '#fff' : 'var(--text)', fontSize: 13, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer', whiteSpace: 'nowrap' })

/**
 * Area Genitore → 🎒: le cose lasciate a scuola. Si abilita (di serie spento), si sceglie chi può segnarle,
 * si vede cosa è a scuola adesso, e si segnano le cose che restano sempre in classe.
 */
export default function ZainoSchoolPanel({ schedule }: { schedule: ScheduleItem[][] }) {
  const { t } = useT()
  const Z = t.zaino
  const kids = useChildren()
  const [v, setV] = useState<ZainoSchool>({ on: false, who: 'kid', at: {}, always: [] })
  const [open, setOpen] = useState(false)
  useEffect(() => { setV(loadSchool()) }, [kids.active?.id])
  const set = (n: ZainoSchool) => { setV(n); saveSchool(n) }
  // tutte le cose dello zaino della settimana, una volta sola per nome
  const things = Array.from(new Map(schedule.flat().map(i => [keyOf(i.name), i])).values())
  const nameOf = (k: string) => things.find(i => keyOf(i.name) === k)?.name ?? k
  const dayOf = (iso: string) => t.days.names[(new Date(iso).getDay() + 6) % 7]?.toLowerCase() ?? ''
  const at = Object.keys(v.at)
  return (
    <div className={s.panel}>
      <div className={s.group}>
        <span className={s.label} style={{ fontWeight: 900, color: 'var(--text)', fontSize: 16 }}>{Z.parentTitle}{at.length > 0 && ` · ${at.length}`}</span>
        <span className={s.label} style={{ fontSize: 13 }}>{Z.parentHint}</span>
        <span className={s.label}>{Z.parentOn}</span>
        <div className={s.chips}>
          {[true, false].map(o => <button key={String(o)} className={s.chip} aria-pressed={v.on === o} onClick={() => set({ ...v, on: o })}>{o ? Z.yes : Z.no}</button>)}
        </div>
        {v.on && <>
          <span className={s.label}>{Z.parentWho}</span>
          <div className={s.chips}>
            {(['kid', 'parent'] as const).map(o => <button key={o} className={s.chip} aria-pressed={v.who === o} onClick={() => set({ ...v, who: o })}>{o === 'kid' ? Z.whoKid : Z.whoParent}</button>)}
          </div>
          {/* cosa è a scuola adesso; il genitore può anche segnare qualcosa da qui */}
          <span className={s.label} style={{ fontWeight: 900, color: 'var(--text)' }}>{Z.nowAt}</span>
          {!at.length && <span className={s.label}>{Z.nothingAt}</span>}
          {at.map(k => (
            <div key={k} style={row}>
              <span style={{ flex: 1, fontWeight: 800 }}>{nameOf(k)}<span style={{ display: 'block', fontSize: 12, color: 'var(--text-soft)' }}>{Z.since(dayOf(v.at[k]))}</span></span>
              <button style={{ ...small(false), background: 'var(--done)', borderColor: 'var(--done)', color: '#fff' }} onClick={() => { const a = { ...v.at }; delete a[k]; set({ ...v, at: a }) }}>{Z.backHome}</button>
            </div>
          ))}
          {/* l'elenco di tutte le cose: "a scuola" adesso, oppure "resta sempre in classe" */}
          <button className={s.chip} onClick={() => setOpen(o => !o)}>{open ? '▲' : '▼'} {Z.alwaysTitle}</button>
          {open && <>
            <span className={s.label} style={{ fontSize: 13 }}>{Z.alwaysHint}</span>
            {things.map(i => { const k = keyOf(i.name), inClass = v.always.includes(k)
              return (
                <div key={k} style={row}>
                  <span style={{ fontSize: 22 }}>{i.icon}</span>
                  <span style={{ flex: 1, fontWeight: 800 }}>{i.name}</span>
                  {!inClass && !v.at[k] && <button style={small(false)} onClick={() => set({ ...v, at: { ...v.at, [k]: new Date().toISOString() } })}>{Z.markAt}</button>}
                  <button style={small(inClass)} aria-pressed={inClass} onClick={() => set({ ...v, always: inClass ? v.always.filter(x => x !== k) : [...v.always, k] })}>{inClass ? Z.inClassBtn : Z.inBagBtn}</button>
                </div>
              ) })}
          </>}
        </>}
      </div>
    </div>
  )
}
