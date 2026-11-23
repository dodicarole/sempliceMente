'use client'
import { useState, useEffect, useCallback } from 'react'
import { usePraise } from '@/hooks/usePraise'
import { BurpingBag } from './Tedo'
import { loadFunSettings } from '@/lib/fun'
import ItemCard from './ItemCard'
import { useAudio } from '@/hooks/useAudio'
import { DAY_COLORS, type ScheduleItem } from '@/types'
import s from './ChildView.module.css'
import { useT } from '@/lib/i18n'
import Buddy from './Buddy'
import { loadSchool, saveSchool, keyOf, type ZainoSchool } from '@/lib/zainoSchool'
import { useChildren } from '@/lib/children'

interface Props {
  items: ScheduleItem[]
  dayIndex: number
  dateLabel: string
  onBack: () => void
  /** tutta la settimana (0 lunedì … 4 venerdì): serve per preparare lo zaino il giorno prima */
  week?: ScheduleItem[][]
  /** nella demo le voci del diario restano sul telefono */
  demo?: boolean
}

const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
/** le spunte sono di quel giorno: preparato la sera, lo zaino resta pronto la mattina dopo */
const zainoKey = (d: Date) => `zaino_${isoDay(d)}`
/** il prossimo giorno di scuola dopo oggi (il venerdì e nel fine settimana: lunedì) */
function nextSchoolDay(from: Date) { const d = new Date(from); do { d.setDate(d.getDate() + 1) } while (d.getDay() === 0 || d.getDay() === 6); return d }
/** dal pomeriggio si prepara lo zaino per il giorno dopo */
const EVENING_HOUR = 14
/** le cose da mangiare e da bere non si lasciano a scuola: niente bottone 🏫 */
const FOOD = /merenda|spuntino|acqua|borraccia|frutta|panino|succo|goûter|gouter|eau|gourde|fruit|collation/i

export default function ChildView({ items: todayItems, dayIndex, dateLabel, onBack, week, demo = false }: Props) {
  const { t } = useT()
  const now = new Date()
  const schoolToday = dayIndex >= 0
  const next = nextSchoolDay(now)
  // di mattina lo zaino di oggi; dal pomeriggio, e nel fine settimana, quello del prossimo giorno di scuola
  const [forNext, setForNext] = useState(() => !schoolToday || now.getHours() >= EVENING_HOUR)
  const target = forNext ? next : now
  const tIndex = forNext ? next.getDay() - 1 : dayIndex
  const nextName = isoDay(next) === isoDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)) ? t.zaino.tomorrowWord : t.days.names[next.getDay() - 1].toLowerCase()
  const [diaryItems, setDiaryItems] = useState<ScheduleItem[]>([])
  const [homework, setHomework] = useState<string[]>([])          // le materie dei compiti per quel giorno (dal diario)
  const kids = useChildren()
  const [sch, setSch] = useState<ZainoSchool>({ on: false, who: 'kid', at: {}, always: [] })
  useEffect(() => { setSch(loadSchool()) }, [kids.active?.id])
  const allItems = [...(forNext ? (week?.[tIndex] ?? []) : todayItems), ...diaryItems]
  // le cose che restano sempre in classe non vanno nello zaino
  const items = sch.on ? allItems.filter(i => !sch.always.includes(keyOf(i.name))) : allItems
  const inClass = sch.on ? allItems.filter(i => sch.always.includes(keyOf(i.name))) : []
  const isAt = (i: ScheduleItem) => sch.on && !!sch.at[keyOf(i.name)]
  // chi può toccare 🏫: il bambino, se il genitore lo permette (nell'area Genitore lo zaino si gestisce dalla scheda 🎒)
  const canMark = sch.on && sch.who === 'kid'
  const [checked, setChecked]       = useState<Set<string>>(new Set())
  const [showCelebr, setShowCelebr] = useState(false)
  const praise = usePraise(showCelebr)
  const { check, uncheck, celebration } = useAudio()

  // le spunte del giorno scelto (oggi o il prossimo giorno di scuola)
  useEffect(() => {
    try { const raw = localStorage.getItem(zainoKey(target)); setChecked(new Set(raw ? JSON.parse(raw) : [])) } catch (_) { setChecked(new Set()) }
  }, [forNext]) // eslint-disable-line react-hooks/exhaustive-deps
  // le cose "da portare" segnate nel diario di scuola per quel giorno
  useEffect(() => {
    const day = isoDay(target)
    const toItems = (list: { id: string; type: string; note: string; subject: string }[]) =>
      list.filter(e => e.type === 'portare').map((e, i) => ({ id: `diario-${e.id}`, name: e.note || e.subject, icon: '🎒', photo_url: null, sort_order: 900 + i, day_of_week: tIndex }))
    const hw = (list: { type: string; subject: string }[]) => list.filter(e => e.type === 'compiti' && e.subject).map(e => e.subject)
    if (demo) { try { setHomework(hw((JSON.parse(localStorage.getItem('diario_demo_voci') || '[]') as { day: string; type: string; subject: string }[]).filter(e => e.day === day))); setDiaryItems(toItems((JSON.parse(localStorage.getItem('diario_demo_voci') || '[]') as { id: string; day: string; type: string; note: string; subject: string }[]).filter(e => e.day === day))) } catch (_) { setDiaryItems([]) } return }
    fetch(`/api/diary?from=${day}&to=${day}`).then(r => (r.ok ? r.json() : { items: [] })).then(j => { setDiaryItems(toItems(j.items ?? [])); setHomework(hw(j.items ?? [])) }).catch(() => setDiaryItems([]))
  }, [forNext]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        uncheck()
      } else {
        next.add(id)
        check()
        if (next.size + items.filter(i => !next.has(i.id) && isAt(i)).length >= items.length && items.length > 0) {
          setTimeout(() => {
            celebration()
            setShowCelebr(true)
          }, 550)
        }
      }
      try { localStorage.setItem(zainoKey(target), JSON.stringify(Array.from(next))) } catch (_) {}
      return next
    })
  }, [items.length, check, uncheck, celebration, forNext, sch]) // eslint-disable-line react-hooks/exhaustive-deps

  // 🏫 rimasto a scuola (da oggi), e 🏠 tornato a casa
  const markSchool = (i: ScheduleItem) => { const v = { ...sch, at: { ...sch.at, [keyOf(i.name)]: new Date().toISOString() } }; setSch(v); saveSchool(v); uncheck()
    const left = items.filter(x => x.id !== i.id && !checked.has(x.id) && !isAt(x)).length
    if (!left && items.length) setTimeout(() => { celebration(); setShowCelebr(true) }, 550) }
  const backHome = (i: ScheduleItem) => { const at = { ...sch.at }; delete at[keyOf(i.name)]; const v = { ...sch, at }; setSch(v); saveSchool(v); check() }
  const sinceLabel = (i: ScheduleItem) => { const d = sch.at[keyOf(i.name)]; return d ? t.zaino.atSchoolSince(t.days.names[(new Date(d).getDay() + 6) % 7]?.toLowerCase() ?? '') : '' }

  if (tIndex < 0 || tIndex > 4) {
    return (
      <>
        <button className={s.back} onClick={onBack}>{t.common.back}</button>
        <div className={s.weekend}>
          <div className={s.weekendEmoji}>🏠</div>
          <div className={s.weekendTitle}>{t.common.noSchool}</div>
          <div className={s.weekendSub}>{t.common.rest}</div>
        </div>
      </>
    )
  }

  const color = DAY_COLORS[tIndex]
  const targetLabel = forNext ? target.toLocaleDateString(t.locale, { day: 'numeric', month: 'long', year: 'numeric' }) : dateLabel

  return (
    <>
      <button className={s.back} onClick={onBack}>{t.common.back}</button>
      {/* oggi o il prossimo giorno di scuola: il bambino può prepararlo la sera prima */}
      <div className={s.whenRow}>
        {schoolToday && <button className={s.whenBtn} aria-pressed={!forNext} onClick={() => setForNext(false)}>{t.zaino.today}</button>}
        <button className={s.whenBtn} aria-pressed={forNext} onClick={() => setForNext(true)}>{nextName === t.zaino.tomorrowWord ? t.zaino.tomorrow : nextName.charAt(0).toUpperCase() + nextName.slice(1)}</button>
      </div>
      <div className={s.banner} style={{ background: color }}>
        <div className={s.dayName}>{t.days.names[tIndex]}</div>
        <div className={s.dayDate}>{targetLabel}</div>
      </div>
      <Buddy spot="zaino" />

      <div className={s.progressRow}>
        <div className={s.dots}>
          {items.map(item => (
            <div key={item.id} className={`${s.dot}${checked.has(item.id) ? ` ${s.on}` : isAt(item) ? ` ${s.school}` : ''}`} />
          ))}
        </div>
        <span className={s.progLabel}>{t.common.of(checked.size, items.filter(i => !isAt(i) || checked.has(i.id)).length)}</span>
      </div>

      <div className={s.instruction}>{forNext ? t.zaino.prepFor(nextName) : t.zaino.instruction}</div>
      {sch.on && (() => {
        const at = Object.keys(sch.at)
        const names = at.map(k => allItems.find(i => keyOf(i.name) === k)?.name ?? k)
        const subjName = (k: string) => (t.diary.subjects[k]?.[0] ?? k).toLowerCase()
        const warn = homework.flatMap(sj => names.filter(n => n.toLowerCase().includes(subjName(sj))).map(n => ({ sj: subjName(sj), n })))
        const friday = now.getDay() === 5
        return <>
          {warn.map(w => <div key={w.n} className={s.schoolWarn}>⚠️ {t.zaino.needForHomework(w.sj, w.n)}</div>)}
          {friday && names.length > 0 && <div className={s.schoolNote}>🏠 {t.zaino.fridayBringHome(names.join(', '))}</div>}
        </>
      })()}

      <div className={s.grid}>
        {items.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            checked={checked.has(item.id)}
            onToggle={() => (isAt(item) ? (canMark ? backHome(item) : undefined) : toggle(item.id))}
            illustrate
            atSchool={isAt(item) ? sinceLabel(item) : undefined}
            onSchool={canMark && !FOOD.test(item.name) ? () => markSchool(item) : undefined}
          />
        ))}
      </div>
      {inClass.length > 0 && <div className={s.classroom}>🏫 {t.zaino.inClass}: {inClass.map(i => i.name).join(', ')}</div>}

      {showCelebr && (
        <div className={s.overlay} onClick={() => setShowCelebr(false)}>
          <div className={s.celebCard} onClick={e => e.stopPropagation()}>
            <BurpingBag fun={loadFunSettings().fun} />
            <div className={s.celebTitle}>{praise}</div>
            <div className={s.celebSub}>{forNext ? t.zaino.readyFor(nextName) : t.zaino.ready}{!forNext && <><br />{t.common.goodDay}</>}</div>
            <button className={s.celebBtn} onClick={() => setShowCelebr(false)}>{t.common.great}</button>
          </div>
        </div>
      )}
    </>
  )
}