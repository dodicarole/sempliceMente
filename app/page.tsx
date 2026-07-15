'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AuthScreen from '@/components/AuthScreen'
import ChildView from '@/components/ChildView'
import RoutineView from '@/components/RoutineView'
import AgendaView from '@/components/AgendaView'
import TimerView from '@/components/TimerView'
import EmotionsView from '@/components/EmotionsView'
import StoriesView from '@/components/StoriesView'
import ParentView from '@/components/ParentView'
import PinScreen from '@/components/PinScreen'
import { type ScheduleItem, type RoutineItem, type AgendaItem, type EmotionItem, type Story, DEFAULT_EMOTIONS } from '@/types'
import { DEFAULT_SCHEDULE, DEFAULT_ROUTINE, DEFAULT_AGENDA, DEFAULT_STORIES } from '@/lib/defaults'
import s from './page.module.css'

type AuthState    = 'loading' | 'unauthenticated' | 'authenticated'
type View         = 'child' | 'parent'
type ChildSection = 'home' | 'zaino' | 'routine' | 'agenda' | 'timer' | 'emotions' | 'storie'
type ParentState  = 'locked' | 'unlocked' | 'changing-pin-1' | 'changing-pin-2'

// ── Demo data (stessi contenuti di default di un nuovo account) ─────────────
const DEMO_SCHEDULE: ScheduleItem[] = DEFAULT_SCHEDULE.map((item, i) => ({ id: `d${i}`, photo_url: null, ...item }))

const DEMO_ROUTINE: RoutineItem[] = DEFAULT_ROUTINE.map((item, i) => ({ id: `r${i}`, photo_url: null, ...item }))

const DEMO_AGENDA: AgendaItem[] = DEFAULT_AGENDA.map((item, i) => ({ id: `a${i}`, photo_url: null, ...item }))

const DEMO_STORIES: Story[] = DEFAULT_STORIES.map((story, i) => ({
  id: `s${i}`,
  title: story.title,
  icon: story.icon,
  sort_order: story.sort_order,
  pages: story.pages.map((page, j) => ({ id: `sp${i}-${j}`, story_id: `s${i}`, photo_url: null, ...page })),
}))

const DEMO_EMOTIONS: EmotionItem[] = DEFAULT_EMOTIONS.map((e, i) => ({ id: `e${i}`, ...e, photo_url: null, sort_order: i }))

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
  const [emotionItems, setEmotionItems] = useState<EmotionItem[]>([])
  const [stories,      setStories]      = useState<Story[]>([])
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

  const fetchEmotions = useCallback(async () => {
    const res = await fetch('/api/emotions')
    if (!res.ok) return
    const { items }: { items: EmotionItem[] } = await res.json()
    setEmotionItems(items)
  }, [])

  const fetchStories = useCallback(async () => {
    const res = await fetch('/api/stories')
    if (!res.ok) return
    const { stories }: { stories: Story[] } = await res.json()
    setStories(stories)
  }, [])

  useEffect(() => {
    if (authState === 'authenticated') {
      Promise.all([fetchSchedule(), fetchRoutine(), fetchAgenda(), fetchEmotions(), fetchStories()]).then(() => setDataLoading(false))
    }
  }, [authState, fetchSchedule, fetchRoutine, fetchAgenda, fetchEmotions, fetchStories])

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
                <button className={s.featureCard} style={{ '--accent': '#E0559E' } as React.CSSProperties} onClick={() => setChildSection('emotions')}>
                  <span className={s.featureEmoji}>💗</span>
                  <span className={s.featureTitle}>Come ti senti?</span>
                  <span className={s.featureSub}>Le tue emozioni</span>
                </button>
                <button className={s.featureCard} style={{ '--accent': '#9167D8' } as React.CSSProperties} onClick={() => setChildSection('storie')}>
                  <span className={s.featureEmoji}>📖</span>
                  <span className={s.featureTitle}>Storie Sociali</span>
                  <span className={s.featureSub}>Leggiamo insieme</span>
                </button>
              </div>
            ) : childSection === 'zaino' ? (
              <ChildView items={demoZaino} dayIndex={demoDayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            ) : childSection === 'routine' ? (
              <RoutineView items={DEMO_ROUTINE} onBack={() => setChildSection('home')} />
            ) : childSection === 'timer' ? (
              <TimerView onBack={() => setChildSection('home')} />
            ) : childSection === 'emotions' ? (
              <EmotionsView items={DEMO_EMOTIONS} onBack={() => setChildSection('home')} />
            ) : childSection === 'storie' ? (
              <StoriesView stories={DEMO_STORIES} onBack={() => setChildSection('home')} />
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
                <button className={s.featureCard} style={{ '--accent': '#E0559E' } as React.CSSProperties} onClick={() => setChildSection('emotions')}>
                  <span className={s.featureEmoji}>💗</span>
                  <span className={s.featureTitle}>Come ti senti?</span>
                  <span className={s.featureSub}>Le tue emozioni</span>
                </button>
                <button className={s.featureCard} style={{ '--accent': '#9167D8' } as React.CSSProperties} onClick={() => setChildSection('storie')}>
                  <span className={s.featureEmoji}>📖</span>
                  <span className={s.featureTitle}>Storie Sociali</span>
                  <span className={s.featureSub}>Leggiamo insieme</span>
                </button>
              </div>
            ) : childSection === 'zaino' ? (
              <ChildView items={zainoItems} dayIndex={dayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            ) : childSection === 'routine' ? (
              <RoutineView items={routineItems} onBack={() => setChildSection('home')} />
            ) : childSection === 'timer' ? (
              <TimerView onBack={() => setChildSection('home')} />
            ) : childSection === 'emotions' ? (
              <EmotionsView items={emotionItems} onBack={() => setChildSection('home')} />
            ) : childSection === 'storie' ? (
              <StoriesView stories={stories} onBack={() => setChildSection('home')} />
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
                emotionItems={emotionItems}
                stories={stories}
                onLock={() => setParentState('locked')}
                onChangePinRequest={() => setParentState('changing-pin-1')}
                onRefresh={fetchSchedule}
                onRoutineRefresh={fetchRoutine}
                onAgendaRefresh={fetchAgenda}
                onEmotionsRefresh={fetchEmotions}
                onStoriesRefresh={fetchStories}
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