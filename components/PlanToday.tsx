'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { useChildren } from '@/lib/children'
import { autoStar } from '@/lib/stars'
import { loadPlans, savePlans, todayIso, type DayPlan } from '@/lib/plans'
import type { SectionId } from '@/lib/homeSections'
import { useSectionInfo } from './PlanParts'
import s from './Plan.module.css'

/** In cima alla home del bambino: il suo piano di oggi, con le tappe in fila. Toccando una tappa si apre la sezione. */
export default function PlanToday({ onOpen }: { onOpen: (sec: SectionId) => void }) {
  const { t } = useT()
  const T = t.plan
  const kids = useChildren()
  const { byId } = useSectionInfo()
  const [day, setDay] = useState<DayPlan | null>(null)
  useEffect(() => {
    const p = loadPlans(), d = p.days[todayIso()] ?? null
    // tutte le tappe fatte: la stellina, una volta sola
    if (d && d.steps.length && d.steps.every(x => x.done) && !d.starred) { d.starred = true; savePlans(p); autoStar() }
    setDay(d)
  }, [kids.active?.id, kids.version])
  if (!day || !day.steps.length) return null
  const done = day.steps.filter(x => x.done).length, next = day.steps.findIndex(x => !x.done)
  return (
    <div className={s.kidCard}>
      <div className={s.h2}>{T.todayTitle}</div>
      <div className={s.prog}><i style={{ width: `${(done / day.steps.length) * 100}%` }} /></div>
      {day.steps.map((x, i) => { const info = byId(x.sec)
        return (
          <button key={x.id} className={`${s.kstep}${x.done ? ` ${s.isDone}` : i === next ? ` ${s.now}` : ''}`} onClick={() => onOpen(x.sec)}>
            <span className={s.kstepE}>{info?.e}</span>
            <span className={s.kstepTx}><b>{i + 1}. {info?.title ?? x.sec}</b><span>{x.note ? `${x.note} · ` : ''}{x.spent && !x.done ? T.minutes(Math.floor(x.spent / 60), x.min) : `${x.min} min`}</span></span>
            {x.done ? <span>✅</span> : i === next ? <span className={s.go}>{T.go}</span> : null}
          </button>
        ) })}
      {done === day.steps.length && <div className={s.allDone}>⭐ {T.allDone}</div>}
    </div>
  )
}
