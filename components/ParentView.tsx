'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { DAY_SHORTS, DAY_COLORS, FALLBACK_ICONS, ROUTINE_ICONS, AGENDA_ICONS, pickRoutineIcon, type ScheduleItem, type RoutineItem, type AgendaItem } from '@/types'
import s from './ParentView.module.css'

type Section = 'zaino' | 'routine' | 'agenda'

interface Props {
  schedule: ScheduleItem[][]
  routineItems: RoutineItem[]
  agendaItems: AgendaItem[]
  onLock: () => void
  onChangePinRequest: () => void
  onRefresh: () => void
  onRoutineRefresh: () => void
  onAgendaRefresh: () => void
}

export default function ParentView({ schedule, routineItems, agendaItems, onLock, onChangePinRequest, onRefresh, onRoutineRefresh, onAgendaRefresh }: Props) {
  const [section, setSection]           = useState<Section>('zaino')
  const [day, setDay]                   = useState(0)
  const [showForm, setShowForm]         = useState(false)
  const [newName, setNewName]           = useState('')
  const [newTime, setNewTime]           = useState('08:00')
  const [newPhoto, setNewPhoto]         = useState<string | null>(null)
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null)
  const [saving, setSaving]             = useState(false)
  const newPhotoInputRef = useRef<HTMLInputElement>(null)

  const zainoItems  = schedule[day] ?? []
  const agendaDay   = agendaItems.filter(i => i.day_of_week === day).sort((a, b) => a.time_start.localeCompare(b.time_start))

  const handleSectionChange = (sec: Section) => {
    setSection(sec)
    setShowForm(false)
    setNewName('')
    setNewPhoto(null)
    setNewPhotoFile(null)
  }

  const handleThumbClick = (itemId: string, table: 'schedule_items' | 'routine_items' | 'agenda_items') => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const form = new FormData()
      form.append('file', file)
      form.append('itemId', itemId)
      form.append('table', table)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (res.ok) {
        if (table === 'routine_items') onRoutineRefresh()
        else if (table === 'agenda_items') onAgendaRefresh()
        else onRefresh()
      }
    }
    input.click()
  }

  const handleDeleteZaino   = async (id: string) => { if (!confirm('Rimuovere?')) return; await fetch(`/api/materials/${id}`, { method: 'DELETE' }); onRefresh() }
  const handleDeleteRoutine = async (id: string) => { if (!confirm('Rimuovere?')) return; await fetch(`/api/routine/${id}`,   { method: 'DELETE' }); onRoutineRefresh() }
  const handleDeleteAgenda  = async (id: string) => { if (!confirm('Rimuovere?')) return; await fetch(`/api/agenda/${id}`,    { method: 'DELETE' }); onAgendaRefresh() }

  const handleMoveRoutine = async (index: number, dir: -1 | 1) => {
    const a = routineItems[index]
    const b = routineItems[index + dir]
    if (!a || !b) return
    await Promise.all([
      fetch(`/api/routine/${a.id}`,    { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: b.sort_order }) }),
      fetch(`/api/routine/${b.id}`,    { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: a.sort_order }) }),
    ])
    onRoutineRefresh()
  }

  const handleMoveZaino = async (index: number, dir: -1 | 1) => {
    const a = zainoItems[index]
    const b = zainoItems[index + dir]
    if (!a || !b) return
    await Promise.all([
      fetch(`/api/materials/${a.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: b.sort_order }) }),
      fetch(`/api/materials/${b.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sort_order: a.sort_order }) }),
    ])
    onRefresh()
  }

  const handleNewPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setNewPhotoFile(file)
    const reader = new FileReader()
    reader.onload = ev => setNewPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleSaveZaino = async () => {
    if (!newName.trim()) return
    setSaving(true)
    const icon = FALLBACK_ICONS[zainoItems.length % FALLBACK_ICONS.length]
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day_of_week: day, name: newName.trim(), icon, sort_order: zainoItems.length }),
    })
    if (res.ok && newPhotoFile) {
      const { item } = await res.json()
      const form = new FormData()
      form.append('file', newPhotoFile)
      form.append('itemId', item.id)
      await fetch('/api/upload', { method: 'POST', body: form })
    }
    resetForm(); onRefresh()
  }

  const handleSaveRoutine = async () => {
    if (!newName.trim()) return
    setSaving(true)
    const icon = pickRoutineIcon(newName.trim(), routineItems.length)
    const res = await fetch('/api/routine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), icon, sort_order: routineItems.length }),
    })
    if (res.ok && newPhotoFile) {
      const { item } = await res.json()
      const form = new FormData()
      form.append('file', newPhotoFile)
      form.append('itemId', item.id)
      form.append('table', 'routine_items')
      await fetch('/api/upload', { method: 'POST', body: form })
    }
    resetForm(); onRoutineRefresh()
  }

  const handleSaveAgenda = async () => {
    if (!newName.trim() || !newTime) return
    setSaving(true)
    const icon = AGENDA_ICONS[agendaDay.length % AGENDA_ICONS.length]
    const res = await fetch('/api/agenda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day_of_week: day, time_start: newTime, name: newName.trim(), icon, sort_order: agendaDay.length }),
    })
    if (res.ok && newPhotoFile) {
      const { item } = await res.json()
      const form = new FormData()
      form.append('file', newPhotoFile)
      form.append('itemId', item.id)
      form.append('table', 'agenda_items')
      await fetch('/api/upload', { method: 'POST', body: form })
    }
    resetForm(); onAgendaRefresh()
  }

  const resetForm = () => { setNewName(''); setNewTime('08:00'); setNewPhoto(null); setNewPhotoFile(null); setShowForm(false); setSaving(false) }

  return (
    <>
      <div className={s.header}>
        <div className={s.title}>Configura l&apos;app</div>
        <button className={s.lockBtn} onClick={onLock} title="Blocca area genitore">🔒</button>
      </div>

      <div className={s.sectionToggle}>
        {(['zaino', 'routine', 'agenda'] as Section[]).map(sec => (
          <button
            key={sec}
            className={`${s.sectionBtn}${section === sec ? ` ${s.sectionActive}` : ''}`}
            onClick={() => handleSectionChange(sec)}
          >
            {sec === 'zaino' ? '🎒' : sec === 'routine' ? '🌅' : '📅'}
          </button>
        ))}
      </div>

      {/* ── ZAINO ── */}
      {section === 'zaino' && (
        <>
          <div className={s.tabs}>
            {DAY_SHORTS.map((name, i) => (
              <button key={i} className={`${s.tab}${i === day ? ` ${s.active}` : ''}`}
                style={i === day ? { background: DAY_COLORS[i] } : {}}
                onClick={() => { setDay(i); setShowForm(false) }}>
                {name}
              </button>
            ))}
          </div>
          <div className={s.list}>
            {zainoItems.map((item, index) => (
              <div key={item.id} className={s.item}>
                <button className={s.thumb} onClick={() => handleThumbClick(item.id, 'schedule_items')}>
                  {item.photo_url ? <Image src={item.photo_url} alt={item.name} width={52} height={52} style={{ objectFit: 'cover' }} /> : item.icon}
                  <span className={s.thumbCam}>📷</span>
                </button>
                <span className={s.name}>{item.name}</span>
                <div className={s.reorderBtns}>
                  <button className={s.reorderBtn} onClick={() => handleMoveZaino(index, -1)} disabled={index === 0} aria-label="Sposta su">▲</button>
                  <button className={s.reorderBtn} onClick={() => handleMoveZaino(index, 1)} disabled={index === zainoItems.length - 1} aria-label="Sposta giù">▼</button>
                </div>
                <button className={s.delBtn} onClick={() => handleDeleteZaino(item.id)}>×</button>
              </div>
            ))}
          </div>
          {showForm && (
            <div className={s.addFormCard}>
              <div className={s.addFormRow}>
                <label className={s.photoLabel} htmlFor="new-photo-zaino">
                  {newPhoto ? <Image src={newPhoto} alt="anteprima" width={52} height={52} style={{ objectFit: 'cover' }} /> : <>📷<span className={s.photoHint}>Foto</span></>}
                </label>
                <input id="new-photo-zaino" ref={newPhotoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewPhoto} />
                <input className={s.nameInput} type="text" placeholder="Es. Quaderno di Scienze" value={newName}
                  onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveZaino()} autoFocus />
              </div>
              <div className={s.formActions}>
                <button className={s.cancelBtn} onClick={resetForm}>Annulla</button>
                <button className={s.saveBtn} onClick={handleSaveZaino} disabled={saving}>{saving ? '...' : 'Salva'}</button>
              </div>
            </div>
          )}
          {!showForm && <button className={s.addBtn} onClick={() => setShowForm(true)}>＋ Aggiungi materiale</button>}
        </>
      )}

      {/* ── ROUTINE ── */}
      {section === 'routine' && (
        <>
          <div className={s.list}>
            {routineItems.map((item, index) => (
              <div key={item.id} className={s.item}>
                <span className={s.routineStep}>{index + 1}</span>
                <button className={s.thumb} onClick={() => handleThumbClick(item.id, 'routine_items')}>
                  {item.photo_url ? <Image src={item.photo_url} alt={item.name} width={52} height={52} style={{ objectFit: 'cover' }} /> : item.icon}
                  <span className={s.thumbCam}>📷</span>
                </button>
                <span className={s.name}>{item.name}</span>
                <div className={s.reorderBtns}>
                  <button className={s.reorderBtn} onClick={() => handleMoveRoutine(index, -1)} disabled={index === 0} aria-label="Sposta su">▲</button>
                  <button className={s.reorderBtn} onClick={() => handleMoveRoutine(index, 1)} disabled={index === routineItems.length - 1} aria-label="Sposta giù">▼</button>
                </div>
                <button className={s.delBtn} onClick={() => handleDeleteRoutine(item.id)}>×</button>
              </div>
            ))}
          </div>
          {showForm && (
            <div className={s.addFormCard}>
              <div className={s.addFormRow}>
                <label className={s.photoLabel} htmlFor="new-photo-routine">
                  {newPhoto ? <Image src={newPhoto} alt="anteprima" width={52} height={52} style={{ objectFit: 'cover' }} /> : <>📷<span className={s.photoHint}>Foto</span></>}
                </label>
                <input id="new-photo-routine" ref={newPhotoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewPhoto} />
                <input className={s.nameInput} type="text" placeholder="Es. Lavarsi i denti" value={newName}
                  onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveRoutine()} autoFocus />
              </div>
              <div className={s.formActions}>
                <button className={s.cancelBtn} onClick={resetForm}>Annulla</button>
                <button className={s.saveBtn} onClick={handleSaveRoutine} disabled={saving}>{saving ? '...' : 'Salva'}</button>
              </div>
            </div>
          )}
          {!showForm && <button className={s.addBtn} onClick={() => setShowForm(true)}>＋ Aggiungi passo</button>}
        </>
      )}

      {/* ── AGENDA ── */}
      {section === 'agenda' && (
        <>
          <div className={s.tabs}>
            {DAY_SHORTS.map((name, i) => (
              <button key={i} className={`${s.tab}${i === day ? ` ${s.active}` : ''}`}
                style={i === day ? { background: DAY_COLORS[i] } : {}}
                onClick={() => { setDay(i); setShowForm(false) }}>
                {name}
              </button>
            ))}
          </div>
          <div className={s.list}>
            {agendaDay.map(item => (
              <div key={item.id} className={s.item}>
                <span className={s.agendaTime}>{item.time_start.slice(0, 5)}</span>
                <button className={s.thumb} onClick={() => handleThumbClick(item.id, 'agenda_items')}>
                  {item.photo_url ? <Image src={item.photo_url} alt={item.name} width={52} height={52} style={{ objectFit: 'cover' }} /> : item.icon}
                  <span className={s.thumbCam}>📷</span>
                </button>
                <span className={s.name}>{item.name}</span>
                <button className={s.delBtn} onClick={() => handleDeleteAgenda(item.id)}>×</button>
              </div>
            ))}
          </div>
          {showForm && (
            <div className={s.addFormCard}>
              <div className={s.addFormRow}>
                <label className={s.photoLabel} htmlFor="new-photo-agenda">
                  {newPhoto ? <Image src={newPhoto} alt="anteprima" width={52} height={52} style={{ objectFit: 'cover' }} /> : <>📷<span className={s.photoHint}>Foto</span></>}
                </label>
                <input id="new-photo-agenda" ref={newPhotoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewPhoto} />
                <div className={s.agendaInputs}>
                  <input className={s.timeInput} type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
                  <input className={s.nameInput} type="text" placeholder="Es. Italiano" value={newName}
                    onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSaveAgenda()} autoFocus />
                </div>
              </div>
              <div className={s.formActions}>
                <button className={s.cancelBtn} onClick={resetForm}>Annulla</button>
                <button className={s.saveBtn} onClick={handleSaveAgenda} disabled={saving}>{saving ? '...' : 'Salva'}</button>
              </div>
            </div>
          )}
          {!showForm && <button className={s.addBtn} onClick={() => setShowForm(true)}>＋ Aggiungi attività</button>}
        </>
      )}

      <button className={s.changePinBtn} onClick={onChangePinRequest}>🔑 Cambia PIN</button>
    </>
  )
}