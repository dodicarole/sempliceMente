'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AuthScreen from '@/components/AuthScreen'
import ChildView from '@/components/ChildView'
import RoutineView from '@/components/RoutineView'
import AgendaView from '@/components/AgendaView'
import TimerView from '@/components/TimerView'
import StoriesView from '@/components/StoriesView'
import NumbersView from '@/components/NumbersView'
import TablesView from '@/components/TablesView'
import SplitView from '@/components/SplitView'
import NamesView from '@/components/NamesView'
import EnglishView from '@/components/EnglishView'
import FirstThenView from '@/components/FirstThenView'
import WordsView from '@/components/WordsView'
import CalmView from '@/components/CalmView'
import StarsView from '@/components/StarsView'
import ClockView from '@/components/ClockView'
import MoneyView from '@/components/MoneyView'
import SyllablesView from '@/components/SyllablesView'
import DoublesView from '@/components/DoublesView'
import CompareView from '@/components/CompareView'
import { builtinStories } from '@/lib/builtinStories'
import { useT } from '@/lib/i18n'
import LanguagePicker from '@/components/LanguagePicker'
import ChildPicker, { ChildSwitch } from '@/components/ChildPicker'
import { useChildren } from '@/lib/children'
import { homeSections, type HomeCard } from '@/lib/homeSections'
import { loadChildGender, type ChildGender } from '@/lib/praise'
import ParentView from '@/components/ParentView'
import PinScreen from '@/components/PinScreen'
import { type ScheduleItem, type RoutineItem, type AgendaItem, type EmotionItem, type Story, DEFAULT_EMOTIONS } from '@/types'
import { DEFAULT_SCHEDULE, DEFAULT_ROUTINE, DEFAULT_AGENDA, DEFAULT_STORIES } from '@/lib/defaults'
import s from './page.module.css'

type AuthState    = 'loading' | 'unauthenticated' | 'authenticated'
type View         = 'child' | 'parent'
type ChildSection = 'home' | 'zaino' | 'routine' | 'agenda' | 'timer' | 'emotions' | 'storie' | 'numeri' | 'tabelline' | 'scomponi' | 'nomi' | 'english' | 'primapoi' | 'calma' | 'stelline' | 'orologio' | 'soldi' | 'sillabe' | 'doppie' | 'confronta'
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

function getDayInfo(locale: string): { dayIndex: number; dateLabel: string } {
  const d = new Date()
  const dow = d.getDay()
  const dayIndex = dow === 0 || dow === 6 ? -1 : dow - 1
  const dateLabel = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  return { dayIndex, dateLabel }
}

export default function Home() {
  const { t, lang } = useT()
  const kids = useChildren()
  const [authState,    setAuthState]    = useState<AuthState>('loading')
  const [showAuth,     setShowAuth]     = useState(false)
  const [view,         setView]         = useState<View>('child')
  const [childSection, setChildSection] = useState<ChildSection>('home')
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [gender, setGender] = useState<ChildGender>('n')
  useEffect(() => { setGender(loadChildGender()) }, [childSection, kids.version])

  /** La home: le schede del bambino, divise in "Ogni giorno" e "Per imparare" */
  const renderHome = () => {
    type Card = HomeCard
    const { daily: allDaily, learn: allLearn } = homeSections(t, gender)
    // le sezioni che il genitore ha nascosto a questo figlio non compaiono
    const hidden = authState === 'authenticated' ? (kids.active?.hidden ?? []) : []
    const daily = allDaily.filter(x => !hidden.includes(x.id))
    const learn = allLearn.filter(x => !hidden.includes(x.id))
    const card = (x: Card) => (x.it && lang !== 'it') ? null : (
      <button key={x.id} className={s.featureCard} style={{ '--accent': x.c } as React.CSSProperties} onClick={() => setChildSection(x.id)}>
        <span className={s.featureEmoji}>{x.e}</span>
        <span className={s.featureTitle}>{x.title}</span>
        <span className={s.featureSub}>{x.sub}</span>
      </button>
    )
    return (
      <div className={s.homeGrid}>
        {daily.length > 0 && <h2 className={s.homeGroup}>{t.daily.groupDaily}</h2>}
        {daily.map(card)}
        {learn.some(x => !x.it || lang === 'it') && <h2 className={s.homeGroup}>{t.daily.groupLearn}</h2>}
        {learn.map(card)}
        {!daily.length && !learn.some(x => !x.it || lang === 'it') && <p className={s.homeGroup} style={{ textTransform: 'none' }}>{t.children.allHidden}</p>}
      </div>
    )
  }
  const [parentState,  setParentState]  = useState<ParentState>('locked')
  const [schedule,     setSchedule]     = useState<ScheduleItem[][]>(Array(5).fill([]))
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([])
  const [agendaItems,  setAgendaItems]  = useState<AgendaItem[]>([])
  const [emotionItems, setEmotionItems] = useState<EmotionItem[]>([])
  const [stories,      setStories]      = useState<Story[]>([])
  const [dataLoading,  setDataLoading]  = useState(true)
  const [newPinTemp,   setNewPinTemp]   = useState('')

  const { dayIndex, dateLabel } = getDayInfo(t.locale)
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
    items.forEach(item => { byDay[item.day_of_week]?.push(item) })
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
    // kids.version: quando cambia il figlio attivo si ricaricano i suoi contenuti
  }, [authState, kids.version, fetchSchedule, fetchRoutine, fetchAgenda, fetchEmotions, fetchStories])

  const handleAuth = () => {
    kids.reload()
    setAuthState('authenticated')
    setShowAuth(false)
    setChildSection('home')
  }

  const handleLogout = async () => {
    setConfirmLogout(false)
    await fetch('/api/auth/logout', { method: 'POST' })
    await kids.reload()
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
        {t.common.loading}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div className={s.demoBadge}>{t.demo.badge}</div>
            <LanguagePicker compact />
          </div>

          <div className={`${s.view} reading-area`}>
            {childSection === 'home' ? (
              renderHome()
            ) : childSection === 'zaino' ? (
              <ChildView items={demoZaino} dayIndex={demoDayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            ) : childSection === 'routine' ? (
              <RoutineView items={DEMO_ROUTINE} onBack={() => setChildSection('home')} />
            ) : childSection === 'timer' ? (
              <TimerView onBack={() => setChildSection('home')} />
            ) : childSection === 'emotions' ? (
              <WordsView emotions={DEMO_EMOTIONS} onBack={() => setChildSection('home')} onCalm={() => setChildSection('calma')} />
            ) : childSection === 'storie' ? (
              <StoriesView stories={[...DEMO_STORIES, ...builtinStories(lang)]} onBack={() => setChildSection('home')} />
            ) : childSection === 'numeri' ? (
              <NumbersView allowSettings onBack={() => setChildSection('home')} />
            ) : childSection === 'tabelline' ? (
              <TablesView allowSettings onBack={() => setChildSection('home')} />
            ) : childSection === 'scomponi' ? (
              <SplitView allowSettings onBack={() => setChildSection('home')} />
            ) : childSection === 'nomi' ? (
              <NamesView allowSettings onBack={() => setChildSection('home')} />
            ) : childSection === 'english' ? (
              <EnglishView allowSettings onBack={() => setChildSection('home')} />
            ) : childSection === 'primapoi' ? (
              <FirstThenView allowSettings onBack={() => setChildSection('home')} />
            ) : childSection === 'calma' ? (
              <CalmView onBack={() => setChildSection('home')} />
            ) : childSection === 'stelline' ? (
              <StarsView allowSettings onBack={() => setChildSection('home')} />
            ) : childSection === 'orologio' ? (
              <ClockView onBack={() => setChildSection('home')} />
            ) : childSection === 'soldi' ? (
              <MoneyView onBack={() => setChildSection('home')} />
            ) : childSection === 'sillabe' ? (
              <SyllablesView onBack={() => setChildSection('home')} />
            ) : childSection === 'doppie' ? (
              <DoublesView allowSettings onBack={() => setChildSection('home')} />
            ) : childSection === 'confronta' ? (
              <CompareView allowSettings onBack={() => setChildSection('home')} />
            ) : (
              <AgendaView items={DEMO_AGENDA} dayIndex={demoDayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            )}
          </div>

          <div className={s.demoBanner}>
            <div className={s.demoBannerText}>
              <span className={s.demoBannerTitle}>{t.demo.bannerTitle}</span>
              <span className={s.demoBannerSub}>{t.demo.bannerSub}</span>
            </div>
            <button className={s.demoBannerBtn} onClick={() => setShowAuth(true)}>
              {t.demo.login}
            </button>
          </div>

          <Link href="/sostieni" className={s.aboutLink}>{t.demo.about}</Link>

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
              {i === 0 ? t.app.child : t.app.parent}
            </button>
          ))}
          <button className={s.logoutBtn} onClick={() => setConfirmLogout(true)} title={t.app.logout} aria-label={t.app.logout}>🚪</button>
        </div>

        {confirmLogout && (
          <div className={s.confirmOverlay} onClick={() => setConfirmLogout(false)}>
            <div
              className={s.confirmCard}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="logout-title"
              onClick={e => e.stopPropagation()}
            >
              <div className={s.confirmIcon} aria-hidden="true">🚪</div>
              <div id="logout-title" className={s.confirmTitle}>{t.app.logoutTitle}</div>
              <div className={s.confirmText}>{t.app.logoutText}</div>
              <div className={s.confirmActions}>
                <button className={s.confirmStay} onClick={() => setConfirmLogout(false)} autoFocus>{t.app.stay}</button>
                <button className={s.confirmLeave} onClick={handleLogout}>{t.app.leave}</button>
              </div>
            </div>
          </div>
        )}

        {view === 'child' && (
          <div className={`${s.view} reading-area`}>
            {dataLoading ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-soft)' }}>{t.common.loading}</div>
            ) : kids.needsChoice ? (
              <ChildPicker />
            ) : childSection === 'home' ? (
              <><ChildSwitch />{renderHome()}</>
            ) : childSection === 'zaino' ? (
              <ChildView items={zainoItems} dayIndex={dayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            ) : childSection === 'routine' ? (
              <RoutineView items={routineItems} onBack={() => setChildSection('home')} />
            ) : childSection === 'timer' ? (
              <TimerView onBack={() => setChildSection('home')} />
            ) : childSection === 'emotions' ? (
              <WordsView emotions={emotionItems} onBack={() => setChildSection('home')} onCalm={() => setChildSection('calma')} />
            ) : childSection === 'storie' ? (
              <StoriesView stories={[...stories, ...builtinStories(lang)]} onBack={() => setChildSection('home')} />
            ) : childSection === 'numeri' ? (
              <NumbersView onBack={() => setChildSection('home')} />
            ) : childSection === 'tabelline' ? (
              <TablesView onBack={() => setChildSection('home')} />
            ) : childSection === 'scomponi' ? (
              <SplitView onBack={() => setChildSection('home')} />
            ) : childSection === 'nomi' ? (
              <NamesView onBack={() => setChildSection('home')} />
            ) : childSection === 'english' ? (
              <EnglishView onBack={() => setChildSection('home')} />
            ) : childSection === 'primapoi' ? (
              <FirstThenView onBack={() => setChildSection('home')} />
            ) : childSection === 'calma' ? (
              <CalmView onBack={() => setChildSection('home')} />
            ) : childSection === 'stelline' ? (
              <StarsView onBack={() => setChildSection('home')} />
            ) : childSection === 'orologio' ? (
              <ClockView onBack={() => setChildSection('home')} />
            ) : childSection === 'soldi' ? (
              <MoneyView onBack={() => setChildSection('home')} />
            ) : childSection === 'sillabe' ? (
              <SyllablesView onBack={() => setChildSection('home')} />
            ) : childSection === 'doppie' ? (
              <DoublesView onBack={() => setChildSection('home')} />
            ) : childSection === 'confronta' ? (
              <CompareView onBack={() => setChildSection('home')} />
            ) : (
              <AgendaView items={agendaItems} dayIndex={dayIndex} dateLabel={dateLabel} onBack={() => setChildSection('home')} />
            )}
          </div>
        )}

        {view === 'child' && childSection === 'home' && (
          <Link href="/sostieni" className={s.aboutLink}>{t.demo.about}</Link>
        )}

        {view === 'parent' && (
          <div className={s.view}>
            {parentState === 'locked' && (
              <PinScreen title={t.pin.title} subtitle={t.pin.enter} showHint onSubmit={handleUnlockSubmit} />
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
              <PinScreen title={t.pin.title} subtitle={t.pin.enterNew} onSubmit={handleChange1Submit} />
            )}
            {parentState === 'changing-pin-2' && (
              <PinScreen title={t.pin.title} subtitle={t.pin.repeatNew} onSubmit={handleChange2Submit} />
            )}
          </div>
        )}

      </div>
    </div>
  )
}