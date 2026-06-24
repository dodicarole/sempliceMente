'use client'
import { useState, useEffect, useCallback } from 'react'
import ChildView from '@/components/ChildView'
import ParentView from '@/components/ParentView'
import PinScreen from '@/components/PinScreen'
import { type ScheduleItem } from '@/types'
import s from './page.module.css'

type View = 'child' | 'parent'
type ParentState = 'locked' | 'unlocked' | 'changing-pin-1' | 'changing-pin-2'

function getDayInfo(): { dayIndex: number; dateLabel: string } {
  const d = new Date()
  const dow = d.getDay()                     // 0=dom … 6=sab
  const dayIndex = dow === 0 || dow === 6 ? -1 : dow - 1
  const dateLabel = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
  return { dayIndex, dateLabel }
}

export default function Home() {
  const [view,        setView]        = useState<View>('child')
  const [parentState, setParentState] = useState<ParentState>('locked')
  const [schedule,    setSchedule]    = useState<ScheduleItem[][]>(Array(5).fill([]))
  const [loading,     setLoading]     = useState(true)
  const [newPinTemp,  setNewPinTemp]  = useState('')

  const { dayIndex, dateLabel } = getDayInfo()

  const fetchSchedule = useCallback(async () => {
    const res = await fetch('/api/materials')
    if (!res.ok) return
    const { items }: { items: ScheduleItem[] } = await res.json()
    const byDay: ScheduleItem[][] = Array(5).fill(null).map(() => [])
    items.forEach(item => { byDay[item.day_of_week].push(item) })
    setSchedule(byDay)
    setLoading(false)
  }, [])

  useEffect(() => { fetchSchedule() }, [fetchSchedule])

  // ── Switch to parent (always locks first) ──
  const handleViewChange = (v: View) => {
    if (v === 'parent') setParentState('locked')
    setView(v)
  }

  // ── PIN handlers ──
  const handleUnlockSubmit = useCallback(async (pin: string): Promise<boolean> => {
    const res = await fetch('/api/pin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (res.ok) { setParentState('unlocked'); return true }
    return false
  }, [])

  const handleChange1Submit = useCallback(async (pin: string): Promise<boolean> => {
    setNewPinTemp(pin)
    setParentState('changing-pin-2')
    return true
  }, [])

  const handleChange2Submit = useCallback(async (pin: string): Promise<boolean> => {
    if (pin !== newPinTemp) return false
    const res = await fetch('/api/pin/change', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    if (res.ok) { setParentState('unlocked'); setNewPinTemp(''); return true }
    return false
  }, [newPinTemp])

  const items = dayIndex >= 0 ? (schedule[dayIndex] ?? []) : []

  return (
    <div className={s.page}>
      <div className={s.app}>

        {/* ── Toggle ── */}
        <div className={s.toggle} role="tablist">
          {(['child', 'parent'] as View[]).map((v, i) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={`${s.toggleBtn}${view === v ? ` ${s.active}` : ''}`}
              onClick={() => handleViewChange(v)}
            >
              {i === 0 ? '🎒 Bambino' : '⚙️ Genitore'}
            </button>
          ))}
        </div>

        {/* ── Child view ── */}
        {view === 'child' && (
          <div className={s.view}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-soft)' }}>Caricamento…</div>
            ) : (
              <ChildView items={items} dayIndex={dayIndex} dateLabel={dateLabel} />
            )}
          </div>
        )}

        {/* ── Parent view ── */}
        {view === 'parent' && (
          <div className={s.view}>
            {parentState === 'locked' && (
              <PinScreen
                subtitle="Inserisci il PIN"
                showHint
                onSubmit={handleUnlockSubmit}
              />
            )}
            {parentState === 'unlocked' && (
              <ParentView
                schedule={schedule}
                onLock={() => setParentState('locked')}
                onChangePinRequest={() => setParentState('changing-pin-1')}
                onRefresh={fetchSchedule}
              />
            )}
            {parentState === 'changing-pin-1' && (
              <PinScreen
                subtitle="Inserisci il nuovo PIN"
                onSubmit={handleChange1Submit}
              />
            )}
            {parentState === 'changing-pin-2' && (
              <PinScreen
                subtitle="Ripeti il nuovo PIN"
                onSubmit={handleChange2Submit}
              />
            )}
          </div>
        )}

      </div>
    </div>
  )
}