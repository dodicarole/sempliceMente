'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useT } from '@/lib/i18n'
import { useChildren, AVATARS, type Child } from '@/lib/children'
import type { ChildGender } from '@/lib/praise'
import { homeSections, type SectionId } from '@/lib/homeSections'
import s from './NumbersSettingsPanel.module.css'
import c from './ChildPicker.module.css'

const input: React.CSSProperties = { minHeight: 50, padding: '0 14px', borderRadius: 'var(--radius-sm)', border: '2px solid #D6DBF2', background: 'var(--ground)', color: 'var(--text)', fontSize: 17, fontWeight: 700, fontFamily: 'inherit', width: '100%' }

/** In cima all'area Genitore: per quale figlio stai modificando zaino, routine, agenda ed emozioni */
export function ChildTabs() {
  const { t } = useT()
  const { children, active, choose } = useChildren()
  if (children.length < 2) return null
  return (
    <div className={s.panel}>
      <span className={s.label}>{t.children.editing}</span>
      <div className={s.chips}>
        {children.map(k => (
          <button key={k.id} className={s.chip} aria-pressed={k.id === active?.id} onClick={() => choose(k.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Image src={`/amici/${k.avatar}.png`} alt="" width={28} height={28} style={{ borderRadius: '50%' }} />{k.name || t.children.noName}
          </button>
        ))}
      </div>
    </div>
  )
}

function ChildForm({ start, onSave, onCancel, onRemove }: { start: Pick<Child, 'name' | 'gender' | 'avatar' | 'hidden'>; onSave: (v: Pick<Child, 'name' | 'gender' | 'avatar' | 'hidden'>) => void; onCancel?: () => void; onRemove?: () => void }) {
  const { t } = useT()
  const [v, setV] = useState(start)
  const G: [ChildGender, string][] = [['m', t.child.boy], ['f', t.child.girl], ['n', t.child.unspecified]]
  return (
    <div className={s.panel}>
      <div className={s.group}>
        <span className={s.label}>{t.child.nameLabel}</span>
        <input style={input} value={v.name} maxLength={40} placeholder={t.child.namePlaceholder} onChange={e => setV({ ...v, name: e.target.value })} />
      </div>
      <div className={s.group}>
        <span className={s.label}>{t.children.genderLabel}</span>
        <div className={s.chips}>{G.map(([g, l]) => <button key={g} className={s.chip} aria-pressed={v.gender === g} onClick={() => setV({ ...v, gender: g })}>{l}</button>)}</div>
      </div>
      <div className={s.group}>
        <span className={s.label}>{t.children.avatar}</span>
        <div className={s.chips}>
          {AVATARS.map(a => (
            <button key={a} className={s.chip} aria-pressed={v.avatar === a} aria-label={a} onClick={() => setV({ ...v, avatar: a })} style={{ padding: 4, minHeight: 56 }}>
              <Image src={`/amici/${a}.png`} alt="" width={46} height={46} className={c.avatar} style={{ borderWidth: 2 }} />
            </button>
          ))}
        </div>
      </div>
      <SectionsPicker hidden={v.hidden} gender={v.gender} onChange={hidden => setV({ ...v, hidden })} />
      <div className={s.chips}>
        <button className={s.chip} aria-pressed={true} disabled={!v.name.trim()} onClick={() => onSave({ ...v, name: v.name.trim() })}>{t.common.save}</button>
        {onCancel && <button className={s.chip} onClick={onCancel}>{t.common.cancel}</button>}
        {onRemove && <button className={s.chip} onClick={onRemove} style={{ color: '#C92A2A' }}>{t.children.remove}</button>}
      </div>
    </div>
  )
}

/** Area Genitore: i figli della famiglia (nome, bambino o bambina, il suo amico) */
export default function ChildrenPanel() {
  const { t } = useT()
  const { children, update, add, remove } = useChildren()
  const [open, setOpen] = useState<string | null>(null)   // id del figlio aperto, o 'new'
  const [msg, setMsg] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className={s.label}>{t.children.hint}</div>
      {children.map(k => (
        open === k.id
          ? <ChildForm key={k.id} start={k} onCancel={() => setOpen(null)}
              onSave={async v => { await update(k.id, v); setOpen(null) }}
              onRemove={children.length > 1 ? async () => { if (!confirm(t.children.confirmRemove(k.name || t.children.noName))) return; const e = await remove(k.id); setMsg(e ?? ''); setOpen(null) } : undefined} />
          : <button key={k.id} className={c.switch} style={{ alignSelf: 'stretch', padding: '6px 16px 6px 6px' }} onClick={() => setOpen(k.id)}>
              <Image src={`/amici/${k.avatar}.png`} alt="" width={44} height={44} className={c.avatar} style={{ borderWidth: 2 }} />
              <span style={{ flex: 1, textAlign: 'left' }}>{k.name || t.children.noName}</span><span>✏️</span>
            </button>
      ))}
      {open === 'new'
        ? <ChildForm start={{ name: '', gender: 'n', avatar: 'tedo', hidden: [] }} onCancel={() => setOpen(null)} onSave={async v => { const e = await add(v); setMsg(e ?? ''); setOpen(null) }} />
        : <button className={s.chip} onClick={() => setOpen('new')}>{t.children.add}</button>}
      {msg && <div className={s.label} style={{ color: '#C92A2A' }}>{msg}</div>}
    </div>
  )
}

/** Le sezioni che vede questo figlio: acceso = visibile nella sua home, spento = nascosto */
function SectionsPicker({ hidden, gender, onChange }: { hidden: SectionId[]; gender: ChildGender; onChange: (h: SectionId[]) => void }) {
  const { t, lang } = useT()
  const { daily, learn } = homeSections(t, gender)
  const toggle = (id: SectionId) => onChange(hidden.includes(id) ? hidden.filter(x => x !== id) : [...hidden, id])
  const group = (title: string, list: typeof daily) => (
    <>
      <span className={s.label} style={{ fontSize: 13 }}>{title}</span>
      <div className={s.chips}>
        {list.filter(x => !x.it || lang === 'it').map(x => (
          <button key={x.id} className={s.chip} aria-pressed={!hidden.includes(x.id)} onClick={() => toggle(x.id)}
            style={hidden.includes(x.id) ? { opacity: 0.55, textDecoration: 'line-through' } : undefined}>
            {x.e} {x.title}
          </button>
        ))}
      </div>
    </>
  )
  return (
    <div className={s.group}>
      <span className={s.label}>{t.children.sections}</span>
      <span className={s.label} style={{ fontWeight: 600, fontSize: 13 }}>{t.children.sectionsHint}</span>
      {group(t.daily.groupDaily, daily)}
      {group(t.daily.groupLearn, learn)}
      {hidden.length > 0 && <div className={s.chips}><button className={s.chip} onClick={() => onChange([])}>{t.children.showAll}</button></div>}
    </div>
  )
}
