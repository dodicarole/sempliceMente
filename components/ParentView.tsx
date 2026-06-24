'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { DAY_SHORTS, DAY_COLORS, FALLBACK_ICONS, type ScheduleItem } from '@/types'
import s from './ParentView.module.css'

interface Props {
  schedule: ScheduleItem[][]   // [dayIndex][itemIndex]
  onLock: () => void
  onChangePinRequest: () => void
  onRefresh: () => void
}

export default function ParentView({ schedule, onLock, onChangePinRequest, onRefresh }: Props) {
  const [day, setDay]             = useState(0)
  const [showForm, setShowForm]   = useState(false)
  const [newName, setNewName]     = useState('')
  const [newPhoto, setNewPhoto]   = useState<string | null>(null)
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null)
  const [saving, setSaving]       = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const newPhotoInputRef = useRef<HTMLInputElement>(null)

  const items = schedule[day] ?? []

  // ── Upload foto per item esistente ──
  const handleThumbClick = (itemId: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const form = new FormData()
      form.append('file', file)
      form.append('itemId', itemId)
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      if (res.ok) onRefresh()
    }
    input.click()
  }

  // ── Elimina item ──
  const handleDelete = async (id: string) => {
    if (!confirm('Rimuovere questo materiale?')) return
    await fetch(`/api/materials/${id}`, { method: 'DELETE' })
    onRefresh()
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

  // ── Salva nuovo item ──
  const handleSave = async () => {
    if (!newName.trim()) return
    setSaving(true)
    const icon = FALLBACK_ICONS[items.length % FALLBACK_ICONS.length]
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day_of_week: day, name: newName.trim(), icon, sort_order: items.length }),
    })
    if (res.ok && newPhotoFile) {
      const { item } = await res.json()
      const form = new FormData()
      form.append('file', newPhotoFile)
      form.append('itemId', item.id)
      await fetch('/api/upload', { method: 'POST', body: form })
    }
    setNewName('')
    setNewPhoto(null)
    setNewPhotoFile(null)
    setShowForm(false)
    setSaving(false)
    onRefresh()
  }

  const cancelForm = () => {
    setNewName('')
    setNewPhoto(null)
    setNewPhotoFile(null)
    setShowForm(false)
  }

  return (
    <>
      <div className={s.header}>
        <div className={s.title}>Configura l&apos;orario</div>
        <button className={s.lockBtn} onClick={onLock} title="Blocca area genitore">🔒</button>
      </div>

      {/* Day tabs */}
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

      {/* Items list */}
      <div className={s.list}>
        {items.map(item => (
          <div key={item.id} className={s.item}>
            <button
              className={s.thumb}
              onClick={() => handleThumbClick(item.id)}
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
            <button className={s.delBtn} onClick={() => handleDelete(item.id)} aria-label={`Rimuovi ${item.name}`}>×</button>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showForm && (
        <div className={s.addFormCard}>
          <div className={s.addFormRow}>
            <label className={s.photoLabel} htmlFor="new-photo">
              {newPhoto ? (
                <Image src={newPhoto} alt="anteprima" width={52} height={52} style={{ objectFit: 'cover' }} />
              ) : (
                <>📷<span className={s.photoHint}>Foto</span></>
              )}
            </label>
            <input id="new-photo" ref={newPhotoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleNewPhoto} />
            <input
              className={s.nameInput}
              type="text"
              placeholder="Es. Quaderno di Scienze"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          </div>
          <div className={s.formActions}>
            <button className={s.cancelBtn} onClick={cancelForm}>Annulla</button>
            <button className={s.saveBtn} onClick={handleSave} disabled={saving}>
              {saving ? '...' : 'Salva'}
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button className={s.addBtn} onClick={() => setShowForm(true)}>＋ Aggiungi materiale</button>
      )}

      <button className={s.changePinBtn} onClick={onChangePinRequest}>🔑 Cambia PIN</button>

      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} />
    </>
  )
}