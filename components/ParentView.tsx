'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { DAY_SHORTS, DAY_COLORS, FALLBACK_ICONS, ROUTINE_ICONS, type ScheduleItem, type RoutineItem } from '@/types'
import s from './ParentView.module.css'

type Section = 'zaino' | 'routine'

interface Props {
  schedule: ScheduleItem[][]
  routineItems: RoutineItem[]
  onLock: () => void
  onChangePinRequest: () => void
  onRefresh: () => void
  onRoutineRefresh: () => void
}

export default function ParentView({ schedule, routineItems, onLock, onChangePinRequest, onRefresh, onRoutineRefresh }: Props) {
  const [section, setSection]         = useState<Section>('zaino')
  const [day, setDay]                 = useState(0)
  const [showForm, setShowForm]       = useState(false)
  const [newName, setNewName]         = useState('')
  const [newPhoto, setNewPhoto]       = useState<string | null>(null)
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null)
  const [saving, setSaving]           = useState(false)
  const newPhotoInputRef = useRef<HTMLInputElement>(null)

  const zainoItems = schedule[day] ?? []

  const handleSectionChange = (sec: Section) => {
    setSection(sec)
    setShowForm(false)
    setNewName('')
    setNewPhoto(null)
    setNewPhotoFile(null)
  }

  // ── Upload foto per item esistente ──
  const handleThumbClick = (itemId: string, table: 'schedule_items' | 'routine_items') => {
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
      if (res.ok) table === 'routine_items' ? onRoutineRefresh() : onRefresh()
    }
    input.click()
  }

  // ── Elimina item zaino ──
  const handleDeleteZaino = async (id: string) => {
    if (!confirm('Rimuovere questo materiale?')) return
    await fetch(`/api/materials/${id}`, { method: 'DELETE' })
    onRefresh()
  }

  // ── Elimina item routine ──
  const handleDeleteRoutine = async (id: string) => {
    if (!confirm('Rimuovere questo passo?')) return
    await fetch(`/api/routine/${id}`, { method: 'DELETE' })
    onRoutineRefresh()
  }

  // ── Nuova foto nel form ──
  const handleNewPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setNewPhotoFile(file)
    const reader = new FileReader()
    reader.onload = ev => setNewPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // ── Salva nuovo item zaino ──
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
    resetForm()
    onRefresh()
  }

  // ── Salva nuovo passo routine ──
  const handleSaveRoutine = async () => {
    if (!newName.trim()) return
    setSaving(true)
    const icon = ROUTINE_ICONS[routineItems.length % ROUTINE_ICONS.length]
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
    resetForm()
    onRoutineRefresh()
  }

  const resetForm = () => {
    setNewName('')
    setNewPhoto(null)
    setNewPhotoFile(null)
    setShowForm(false)
    setSaving(false)
  }

  return (
    <>
      <div className={s.header}>
        <div className={s.title}>Configura l&apos;app</div>
        <button className={s.lockBtn} onClick={onLock} title="Blocca area genitore">🔒</button>
      </div>

      {/* Section toggle */}
      <div className={s.sectionToggle}>
        <button
          className={`${s.sectionBtn}${section === 'zaino' ? ` ${s.sectionActive}` : ''}`}
          onClick={() => handleSectionChange('zaino')}
        >
          🎒 Zaino
        </button>
        <button
          className={`${s.sectionBtn}${section === 'routine' ? ` ${s.sectionActive}` : ''}`}
          onClick={() => handleSectionChange('routine')}
        >
          🌅 Routine
        </button>
      </div>

      {/* ── ZAINO SECTION ── */}
      {section === 'zaino' && (
        <>
          <div className={s.tabs}>
            {DAY_SHORTS.map((name, i) => (
              <button
                key={i}
                className={`${s.tab}${i === day ? ` ${s.active}` : ''}`}
                style={i === day ? { background: DAY_COLORS[i] } : {}}
                onClick={() => { setDay(i); setShowForm(false) }}
              >
                {name}
              </button>
            ))}
          </div>

          <div className={s.list}>
            {zainoItems.map(item => (
              <div key={item.id} className={s.item}>
                <button
                  className={s.thumb}
                  onClick={() => handleThumbClick(item.id, 'schedule_items')}
                  aria-label={`${item.photo_url ? 'Cambia' : 'Aggiungi'} foto di ${item.name}`}
                >
                  {item.photo_url ? (
                    <Image src={item.photo_url} alt={item.name} width={52} height={52} style={{ objectFit: 'cover' }} />
                  ) : (
                    item.icon
                  )}
                  <span className={s.thumbCam}>📷</span>
                </button>
                <span className={s.name}>{item.name}</span>
                <button className={s.delBtn} onClick={() => handleDeleteZaino(item.id)} aria-label={`Rimuovi ${item.name}`}>×</button>
              </div>
            ))}
          </div>

          {showForm && (
            <div className={s.addFormCard}>
              <div className={s.addFormRow}>
                <label className={s.photoLabel} htmlFor="new-photo-zaino">
                  {newPhoto ? (
                    <Image src={newPhoto} alt="anteprima" width={52} height={52} style={{ objectFit: 'cover' }} />
                  ) : (
                    <>📷<span className={s.photoHint}>Foto</span></>
                  )}
                </label>
                <input id="new-photo-zaino" ref={newPhotoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewPhoto} />
                <input
                  className={s.nameInput}
                  type="text"
                  placeholder="Es. Quaderno di Scienze"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveZaino()}
                  autoFocus
                />
              </div>
              <div className={s.formActions}>
                <button className={s.cancelBtn} onClick={resetForm}>Annulla</button>
                <button className={s.saveBtn} onClick={handleSaveZaino} disabled={saving}>
                  {saving ? '...' : 'Salva'}
                </button>
              </div>
            </div>
          )}

          {!showForm && (
            <button className={s.addBtn} onClick={() => setShowForm(true)}>＋ Aggiungi materiale</button>
          )}
        </>
      )}

      {/* ── ROUTINE SECTION ── */}
      {section === 'routine' && (
        <>
          <div className={s.list}>
            {routineItems.map((item, index) => (
              <div key={item.id} className={s.item}>
                <span className={s.routineStep}>{index + 1}</span>
                <button
                  className={s.thumb}
                  onClick={() => handleThumbClick(item.id, 'routine_items')}
                  aria-label={`${item.photo_url ? 'Cambia' : 'Aggiungi'} foto di ${item.name}`}
                >
                  {item.photo_url ? (
                    <Image src={item.photo_url} alt={item.name} width={52} height={52} style={{ objectFit: 'cover' }} />
                  ) : (
                    item.icon
                  )}
                  <span className={s.thumbCam}>📷</span>
                </button>
                <span className={s.name}>{item.name}</span>
                <button className={s.delBtn} onClick={() => handleDeleteRoutine(item.id)} aria-label={`Rimuovi ${item.name}`}>×</button>
              </div>
            ))}
          </div>

          {showForm && (
            <div className={s.addFormCard}>
              <div className={s.addFormRow}>
                <label className={s.photoLabel} htmlFor="new-photo-routine">
                  {newPhoto ? (
                    <Image src={newPhoto} alt="anteprima" width={52} height={52} style={{ objectFit: 'cover' }} />
                  ) : (
                    <>📷<span className={s.photoHint}>Foto</span></>
                  )}
                </label>
                <input id="new-photo-routine" ref={newPhotoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewPhoto} />
                <input
                  className={s.nameInput}
                  type="text"
                  placeholder="Es. Lavarsi i denti"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveRoutine()}
                  autoFocus
                />
              </div>
              <div className={s.formActions}>
                <button className={s.cancelBtn} onClick={resetForm}>Annulla</button>
                <button className={s.saveBtn} onClick={handleSaveRoutine} disabled={saving}>
                  {saving ? '...' : 'Salva'}
                </button>
              </div>
            </div>
          )}

          {!showForm && (
            <button className={s.addBtn} onClick={() => setShowForm(true)}>＋ Aggiungi passo</button>
          )}
        </>
      )}

      <button className={s.changePinBtn} onClick={onChangePinRequest}>🔑 Cambia PIN</button>
    </>
  )
}
