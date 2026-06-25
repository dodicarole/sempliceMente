'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AuthScreen from '@/components/AuthScreen'
import ChildView from '@/components/ChildView'
import RoutineView from '@/components/RoutineView'
import AgendaView from '@/components/AgendaView'
import TimerView from '@/components/TimerView'
import ParentView from '@/components/ParentView'
import PinScreen from '@/components/PinScreen'
import { type ScheduleItem, type RoutineItem, type AgendaItem } from '@/types'
import s from './page.module.css'

type AuthState    = 'loading' | 'unauthenticated' | 'authenticated'
type View         = 'child' | 'parent'
type ChildSection = 'home' | 'zaino' | 'routine' | 'agenda' | 'timer'
type ParentState  = 'locked' | 'unlocked' | 'changing-pin-1' | 'changing-pin-2'

// ── Demo data ────────────────────────────────────────────────────────────────
const DEMO_SCHEDULE: ScheduleItem[] = [
  { id: 'd1', name: 'Italiano',    icon: '📚', photo_url: null, sort_order: 0, day_of_week: 0 },
  { id: 'd2', name: 'Matematica',  icon: '📓', photo_url: null, sort_order: 1, day_of_week: 0 },
  { id: 'd3', name: 'Arte',        icon: '🎨', photo_url: null, sort_order: 2, day_of_week: 0 },
  { id: 'd4', name: 'Borraccia',   icon: '💧', photo_url: null, sort_order: 3, day_of_week: 0 },
  { id: 'd5', name: 'Merenda',     icon: '🥪', photo_url: null, sort_order: 4, day_of_week: 0 },
  { id: 'd6', name: 'Scienze',     icon: '🔬', photo_url: null, sort_order: 0, day_of_week: 1 },
  { id: 'd7', name: 'Geometria',   icon: '📏', photo_url: null, sort_order: 1, day_of_week: 1 },
  { id: 'd8', name: 'Musica',      icon: '🎵', photo_url: null, sort_order: 2, day_of_week: 1 },
  { id: 'd9', name: 'Borraccia',   icon: '💧', photo_url: null, sort_order: 3, day_of_week: 1 },
  { id: 'da', name: 'Italiano',    icon: '📚', photo_url: null, sort_order: 0, day_of_week: 2 },
  { id: 'db', name: 'Storia',      icon: '📝', photo_url: null, sort_order: 1, day_of_week: 2 },
  { id: 'dc', name: 'Ginnastica',  icon: '⚽', photo_url: null, sort_order: 2, day_of_week: 2 },
  { id: 'dd', name: 'Borraccia',   icon: '💧', photo_url: null, sort_order: 3, day_of_week: 2 },
  { id: 'de', name: 'Matematica',  icon: '📓', photo_url: null, sort_order: 0, day_of_week: 3 },
  { id: 'df', name: 'Inglese',     icon: '🌍', photo_url: null, sort_order: 1, day_of_week: 3 },
  { id: 'dg', name: 'Pennelli',    icon: '🖍️', photo_url: null, sort_order: 2, day_of_week: 3 },
  { id: 'dh', name: 'Italiano',    icon: '📚', photo_url: null, sort_order: 0, day_of_week: 4 },
  { id: 'di', name: 'Scienze',     icon: '🔬', photo_url: null, sort_order: 1, day_of_week: 4 },
  { id: 'dj', name: 'Borraccia',   icon: '💧', photo_url: null, sort_order: 2, day_of_week: 4 },
]

const DEMO_ROUTINE: RoutineItem[] = [
  { id: 'r1', name: 'Svegliati',          icon: '⏰', photo_url: null, sort_order: 0 },
  { id: 'r2', name: 'Fai la doccia',      icon: '🚿', photo_url: null, sort_order: 1 },
  { id: 'r3', name: 'Vestiti',            icon: '👕', photo_url: null, sort_order: 2 },
  { id: 'r4', name: 'Fai colazione',      icon: '🥣', photo_url: null, sort_order: 3 },
  { id: 'r5', name: 'Lavati i denti',     icon: '🦷', photo_url: null, sort_order: 4 },
  { id: 'r6', name: 'Prendi lo zaino',    icon: '🎒', photo_url: null, sort_order: 5 },
]

const DEMO_AGENDA: AgendaItem[] = [
  { id: 'a1', name: 'Italiano',           icon: '🏫', photo_url: null, sort_order: 0, day_of_week: 0, time_start: '08:00:00' },
  { id: 'a2', name: 'Matematica',         icon: '📚', photo_url: null, sort_order: 1, day_of_week: 0, time_start: '09:00:00' },
  { id: 'a3', name: 'Intervallo',         icon: '⚽', photo_url: null, sort_order: 2, day_of_week: 0, time_start: '10:30:00' },
  { id: 'a4', name: 'Arte',               icon: '🎨', photo_url: null, sort_order: 3, day_of_week: 0, time_start: '11:00:00' },
  { id: 'a5', name: 'Pranzo',             icon: '🍽️', photo_url: null, sort_order: 4, day_of_week: 0, time_start: '12:30:00' },
  { id: 'a6', name: 'Musica',             icon: '🎵', photo_url: null, sort_order: 5, day_of_week: 0, time_start: '14:00:00' },
  { id: 'a7', name: 'Torna a casa',       icon: '🏠', photo_url: null, sort_order: 6, day_of_week: 0, time_start: '16:00:00' },
  // altri giorni
  { id: 'a8', name: 'Scienze',            icon: '🔬', photo_url: null, sort_order: 0, day_of_week: 1, time_start: '08:00:00' },
  { id: 'a9', name: 'Inglese',            icon: '🌍', photo_url: null, sort_order: 1, day_of_week: 1, time_start: '09:00:00' },
  { id: 'aa', name: 'Ginnastica',         icon: '⚽', photo_url: null, sort_order: 2, day_of_week: 1, time_start: '11:00:00' },
  { id: 'ab', name: 'Pranzo',             icon: '🍽️', photo_url: null, sort_order: 3, day_of_week: 1, time_start: '12:30:00' },
  { id: 'ac', name: 'Italiano',           icon: '🏫', photo_url: null, sort_order: 0, day_of_week: 2, time_start: '08:00:00' },
  { id: 'ad', name: 'Storia',             icon: '📝', photo_url: null, sort_order: 1, day_of_week: 2, time_start: '10:00:00' },
  { id: 'ae', name: 'Pranzo',             icon: '🍽️', photo_url: null, sort_order: 2, day_of_week: 2, time_start: '12:30:00' },
  { id: 'af', name: 'Matematica',         icon: '📓', photo_url: null, sort_order: 0, day_of_week: 3, time_start: '08:00:00' },
  { id: 'ag', name: 'Arte',               icon: '🎨', photo_url: null, sort_order: 1, day_of_week: 3, time_start: '10:00:00' },
  { id: 'ah', name: 'Pranzo',             icon: '🍽️', photo_url: null, sort_order: 2, day_of_week: 3, time_start: '12:30:00' },
  { id: 'ai', name: 'Italiano',           icon: '🏫', photo_url: null, sort_order: 0, day_of_week: 4, time_start: '08:00:00' },
  { id: 'aj', name: 'Scienze',            icon: '🔬', photo_url: null, sort_order: 1, day_of_week: 4, time_start: '10:00:00' },
  { id: 'ak', name: 'Pranzo',             icon: '🍽️', photo_url: null, sort_order: 2, day_of_week: 4, time_start: '12:30:00' },
]

function buildDemoSchedule(): ScheduleItem[][] {
  const byDay: ScheduleItem[][] = Array(5).fill(null).map(() => [])
  DEMO_SCHEDULE.forEach(item => { byDay[item.day_of_week].push(item) })
  return byDay
}
// ─────────────────────────────────────────────────────────────────────────────

function getDayInfo(): { dayIndex: number; dateLabel: string } {
  const d = new Date()
  const dow = d.getDay()
  const dayIndex = dow === 0 || dow === 6 ? -1 : dow - 1
  const dateLabel = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
  return { dayIndex, dateLabel }
}

export default function Home() {
  const [authState,    setAuthState]    = useState<AuthState>('loading')
  const [showAuth,     setShowAuth]     = useState(false)
  const [view,         setView]         = useState<View>('child')
  const [childSection, setChildSection] = useState<ChildSection>('home')
  const [parentState,  setParentState]  = useState<ParentState>('locked')
  const [schedule,     setSchedule]     = useState<ScheduleItem[][]>(Array(5).fill([]))
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([])
  const [agendaItems,  setAgendaItems]  = useState<AgendaItem[]>([])
  const [dataLoading,  setDataLoading]  = useState(true)
  const [newPinTemp,   setNewPinTemp]   = useState('')

  const { dayIndex, dateLabel } = getDayInfo()
  const demoDayIndex = dayIndex >= 0 ? dayIndex : 0
  const demoSchedule = buildDemoSchedule()
  const demoZaino    = demoSchedule[demoDayIndex] ?? []

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(d => setAuthState(d?.authenticated ? 'authenticated' : 'unauthenticated'))
      .catch(() => setAuthState('unauthenticated'))
  }, [])

  const fetchSchedule = useCallback(async () => {
    const res = await fetch('/api/materials')
    if (!res.ok) return
    const { items }: { items: ScheduleItem[] } = await res.json()
    const byDay: ScheduleItem[][] = Array(5).fill(null).map(() => [])
    items.forEach(item => { byDay[item.day_of_week].push(item) })
    setSchedule(byDay)
  }, [])

  const fetchRoutine = useCallback(async () => {
    const res = await fetch('/api/routine')
    if (!res.ok) return
    const { items }: { items: RoutineItem[] } = await res.json()
    setRoutineItems(items)
  }, [])

  const fetchAgenda = useCallback(async () => {
    const res = await fetch('/api/agenda')
    if (!res.ok) return
    const { items }: { items: AgendaItem[] } = await res.json()
    setAgendaItems(items)
  }, [])

  useEffect(() => {
    if (authState === 'authenticated') {
      Promise.all([fetchSchedule(), fetchRoutine(), fetchAgenda()]).then(() => setDataLoading(false))
    }
  }, [authState, fetchSchedule, fetchRoutine, fetchAgenda])

  const handleAuth = () => {
    setAuthState('authenticated')
    setShowAuth(false)
    setChildSection('home')
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setAuthState('unauthenticated')
    setShowAuth(false)
    setView('child')
    setChildSection('home')
    setParentState('locked')
  }

  const handleViewChange = (v: View) => {
    if (v === 'parent') setParentState('locked')
    if (v === 'child') setChildSection('home')
    setView(v)
  }

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

  // ── Loading ──────────────────────────────────────────────────────────────
  if (authState === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-soft)' }}>
        Caricamento…
      </div>
    )
  }

  // ── Schermata login ──────────────────────────────────────────────────────
  if (authState === 'unauthenticated' && showAuth) {
    return (
      <div className={s.page}>
        <div className={s.app}>
          <AuthScreen onAuth={handleAuth} onBack={() => setShowAuth(false)} />
        </div>
      </div>
    )
  }

  // ── Demo (non autenticato) ────────────────────────────────────────────────
  if (authState === 'unauthenticated') {
    return (
      <div className={s.page}>
        <div className={s.app}>

          <div className={s.demoBadge}>Modalità demo</div>

          <div className={s.view}>
            {childSection === 'home' ? (
              <div className={s.homeGrid}>
                <button className={s.featureCard} style={{ '--accent': '#6B7FE3' } as React.CSSProperties} onClick={() => setChildSection('zaino')}>
                  <span className={s.featureEmoji}>🎒</span>
                  <span className={s.featureTitle}>Zaino Pronto</span>
                  <span className={s.featureSub}>Cosa metti oggi?</span>
                </button>
                <button className={s.featureCard} style={{ '--accent': '#FF8C42' } as React.CSSProperties} onClick={() => setChildSection('routine')}>
                  <span className={s.featureEmoji}>🌅</span>
                  <span className={s.featureTitle}>Routine Mattutina</span>
                  <span className={s.featureSub}>Sei pronto per la giornata?</span>
                </button>
                <button className={s.featureCard} style={{ '--accent': '#3EAB7A' } as React.CSSProperties} onClick={() => setChildSection('agenda')}>
                  <span className={s.featureEmoji}>📅</span>
                  <span className={s.featureTitle}>Agenda di Oggi</span>
                  <span className={s.featureSub}>Cosa succede oggi?</span>
                </button>
                <button className={s.featureCard} style={{ '--accent': '#00ACC1' } as React.CSSProperties} onClick={() => setChildSection('timer')}>
                  <span className={s.featureEmoji}>⏱️</span>
                  <span className={s.featureTitle}>Timer</span>
                  <span className={s.featureSub}>Quanto tempo hai?</span>
                </button>
              </div>
            ) : childSection === 'zaino' ? (
              <ChildView items={demoZaino} dayIndex={demoDayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            ) : childSection === 'routine' ? (
              <RoutineView items={DEMO_ROUTINE} onBack={() => setChildSection('home')} />
            ) : childSection === 'timer' ? (
              <TimerView onBack={() => setChildSection('home')} />
            ) : (
              <AgendaView items={DEMO_AGENDA} dayIndex={demoDayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            )}
          </div>

          <div className={s.demoBanner}>
            <div className={s.demoBannerText}>
              <span className={s.demoBannerTitle}>Crea la tua agenda</span>
              <span className={s.demoBannerSub}>Personalizza ogni sezione per il tuo bambino</span>
            </div>
            <button className={s.demoBannerBtn} onClick={() => setShowAuth(true)}>
              Accedi
            </button>
          </div>

          <Link href="/sostieni" className={s.aboutLink}>Scopri il progetto →</Link>

        </div>
      </div>
    )
  }

  // ── App autenticata ───────────────────────────────────────────────────────
  const zainoItems = dayIndex >= 0 ? (schedule[dayIndex] ?? []) : []

  return (
    <div className={s.page}>
      <div className={s.app}>

        <div className={s.toggle} role="tablist">
          {(['child', 'parent'] as View[]).map((v, i) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={`${s.toggleBtn}${view === v ? ` ${s.active}` : ''}`}
              onClick={() => handleViewChange(v)}
            >
              {i === 0 ? '👶 Bambino' : '⚙️ Genitore'}
            </button>
          ))}
          <button className={s.logoutBtn} onClick={handleLogout} title="Esci dall'account">🚪</button>
        </div>

        {view === 'child' && (
          <div className={s.view}>
            {dataLoading ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-soft)' }}>Caricamento…</div>
            ) : childSection === 'home' ? (
              <div className={s.homeGrid}>
                <button className={s.featureCard} style={{ '--accent': '#6B7FE3' } as React.CSSProperties} onClick={() => setChildSection('zaino')}>
                  <span className={s.featureEmoji}>🎒</span>
                  <span className={s.featureTitle}>Zaino Pronto</span>
                  <span className={s.featureSub}>Cosa metti oggi?</span>
                </button>
                <button className={s.featureCard} style={{ '--accent': '#FF8C42' } as React.CSSProperties} onClick={() => setChildSection('routine')}>
                  <span className={s.featureEmoji}>🌅</span>
                  <span className={s.featureTitle}>Routine Mattutina</span>
                  <span className={s.featureSub}>Sei pronto per la giornata?</span>
                </button>
                <button className={s.featureCard} style={{ '--accent': '#3EAB7A' } as React.CSSProperties} onClick={() => setChildSection('agenda')}>
                  <span className={s.featureEmoji}>📅</span>
                  <span className={s.featureTitle}>Agenda di Oggi</span>
                  <span className={s.featureSub}>Cosa succede oggi?</span>
                </button>
                <button className={s.featureCard} style={{ '--accent': '#00ACC1' } as React.CSSProperties} onClick={() => setChildSection('timer')}>
                  <span className={s.featureEmoji}>⏱️</span>
                  <span className={s.featureTitle}>Timer</span>
                  <span className={s.featureSub}>Quanto tempo hai?</span>
                </button>
              </div>
            ) : childSection === 'zaino' ? (
              <ChildView items={zainoItems} dayIndex={dayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            ) : childSection === 'routine' ? (
              <RoutineView items={routineItems} onBack={() => setChildSection('home')} />
            ) : childSection === 'timer' ? (
              <TimerView onBack={() => setChildSection('home')} />
            ) : (
              <AgendaView items={agendaItems} dayIndex={dayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            )}
          </div>
        )}

        {view === 'child' && childSection === 'home' && (
          <Link href="/sostieni" className={s.aboutLink}>Scopri il progetto →</Link>
        )}

        {view === 'parent' && (
          <div className={s.view}>
            {parentState === 'locked' && (
              <PinScreen subtitle="Inserisci il PIN" showHint onSubmit={handleUnlockSubmit} />
            )}
            {parentState === 'unlocked' && (
              <ParentView
                schedule={schedule}
                routineItems={routineItems}
                agendaItems={agendaItems}
                onLock={() => setParentState('locked')}
                onChangePinRequest={() => setParentState('changing-pin-1')}
                onRefresh={fetchSchedule}
                onRoutineRefresh={fetchRoutine}
                onAgendaRefresh={fetchAgenda}
              />
            )}
            {parentState === 'changing-pin-1' && (
              <PinScreen subtitle="Inserisci il nuovo PIN" onSubmit={handleChange1Submit} />
            )}
            {parentState === 'changing-pin-2' && (
              <PinScreen subtitle="Ripeti il nuovo PIN" onSubmit={handleChange2Submit} />
            )}
          </div>
        )}

      </div>
    </div>
  )
}