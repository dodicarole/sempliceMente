'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { useChildren } from '@/lib/children'
import { loadPlans, savePlans, loadPlansFor, savePlansFor, freshSteps, iso, fromIso, addDays, monday, newId, type Plans, type PlanStep, type DayPlan } from '@/lib/plans'
import type { SectionId } from '@/lib/homeSections'
import { useSectionInfo } from './PlanParts'
import s from './Plan.module.css'

/**
 * Area Genitore: il piano di lavoro del figlio scelto in alto, giorno per giorno.
 * Tappe (sezione, cosa fare, minuti), copia dal giorno prima, copia agli altri bambini,
 * e "com'è andata" con i minuti fatti davvero, l'umore e una nota.
 */
export default function PlanEditor() {
  const { t } = useT()
  const T = t.plan
  const kids = useChildren()
  const { list: secList, byId } = useSectionInfo()
  const [P, setP] = useState<Plans>({ settings: { onEnd: 'warn' }, days: {} })
  const weekday = (d: Date) => { const x = new Date(d); while (x.getDay() === 0 || x.getDay() === 6) x.setDate(x.getDate() + 1); return x }
  const [week, setWeek] = useState(() => monday(weekday(new Date())))
  const [day, setDay] = useState(() => iso(weekday(new Date())))
  const [editing, setEditing] = useState<PlanStep | 'new' | null>(null)
  const [copying, setCopying] = useState(false)
  const [msg, setMsg] = useState('')
  useEffect(() => { setP(loadPlans()) }, [kids.active?.id])
  const commit = (n: Plans) => { setP({ ...n }); savePlans(n) }
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2400) }
  const plan: DayPlan | undefined = P.days[day]
  const ensure = (): DayPlan => (P.days[day] = P.days[day] ?? { steps: [], note: '', mood: '' })
  const label = (d: Date) => `${T.daysLong[d.getDay()]} ${d.getDate()} ${T.months[d.getMonth()]}`
  const name = kids.active?.name ?? ''
  const total = plan ? plan.steps.reduce((a, x) => a + x.min, 0) : 0

  const copyPrev = () => {
    const prev = Object.keys(P.days).filter(d => d < day && P.days[d].steps.length).sort().pop()
    if (!prev) { flash(T.noPrev); return }
    if (plan?.steps.length && !confirm(T.replace)) return
    ensure().steps = freshSteps(P.days[prev].steps); commit(P); flash(T.copiedFrom(label(fromIso(prev))))
  }
  const move = (i: number, d: number) => { const st = plan!.steps, j = i + d; if (j < 0 || j >= st.length) return; [st[i], st[j]] = [st[j], st[i]]; commit(P) }

  return (
    <>
      <div className={s.sub}>{T.parentHint}</div>
      {/* la settimana */}
      <div className={s.card}>
        <div className={s.week}>
          <button className={s.nav} aria-label="‹" onClick={() => { const w = addDays(week, -7); setWeek(w); setDay(iso(w)) }}>‹</button>
          {[0, 1, 2, 3, 4].map(i => {
            const d = addDays(week, i), ds = iso(d), p = P.days[ds], n = p?.steps.length ?? 0, done = p?.steps.filter(x => x.done).length ?? 0
            return (
              <button key={ds} className={`${s.day}${ds === iso(new Date()) ? ` ${s.today}` : ''}`} aria-pressed={ds === day} onClick={() => setDay(ds)}>
                {T.days[d.getDay()]}<b>{d.getDate()}</b><small>{n ? `${done === n ? '✅ ' : ''}${T.steps(n)}` : '—'}</small>
              </button>
            )
          })}
          <button className={s.nav} aria-label="›" onClick={() => { const w = addDays(week, 7); setWeek(w); setDay(iso(w)) }}>›</button>
        </div>
      </div>
      {/* il piano del giorno */}
      <div className={s.card}>
        <div className={s.h2}>{kids.active?.name ? `${name} · ` : ''}{label(fromIso(day))}</div>
        {total > 0 && <div className={s.sub}>{T.total(total)}{total > 30 ? T.tooLong : ''}</div>}
        <div className={s.steps}>
          {!plan?.steps.length && <div className={s.empty}>{T.empty}</div>}
          {plan?.steps.map((x, i) => { const info = byId(x.sec)
            return (
              <div key={x.id} className={s.step} style={{ ['--c' as string]: info?.c ?? '#6B7FE3' }}>
                <span className={s.stepE}>{info?.e}</span>
                <span className={s.stepTx}><b>{info?.title ?? x.sec}</b><span>{x.note}</span></span>
                <span className={s.min}>{x.done ? '✅ ' : ''}{x.spent ? T.minutes(Math.floor(x.spent / 60), x.min) : `${x.min}′`}</span>
                <div className={s.mini}>
                  <button aria-label="↑" onClick={() => move(i, -1)}>↑</button>
                  <button aria-label="↓" onClick={() => move(i, 1)}>↓</button>
                  <button aria-label="✏️" onClick={() => setEditing(x)}>✏️</button>
                  <button aria-label="✕" onClick={() => { plan.steps.splice(i, 1); commit(P) }}>✕</button>
                </div>
              </div>
            ) })}
        </div>
        <button className={`${s.btn} ${s.blue}`} onClick={() => setEditing('new')}>{T.add}</button>
        <div className={s.row}>
          <button className={s.btn} onClick={copyPrev}>{T.copyPrev}</button>
          {kids.children.length > 1 && <button className={s.btn} disabled={!plan?.steps.length} onClick={() => setCopying(true)}>{T.copyOthers}</button>}
        </div>
        {msg && <div className={s.msg}>{msg}</div>}
      </div>
      {/* com'è andata */}
      {!!plan?.steps.length && (
        <div className={s.card}>
          <div className={s.h2}>{T.howWent}</div>
          <div className={s.sub}>{T.doneOf(plan.steps.filter(x => x.done).length, plan.steps.length)}</div>
          <div className={s.moods}>{['😊', '😐', '😣'].map(f => <button key={f} aria-pressed={plan.mood === f} onClick={() => { plan.mood = plan.mood === f ? '' : f; commit(P) }}>{f}</button>)}</div>
          <textarea className={s.text} placeholder={T.notePh} defaultValue={plan.note} key={`${day}-note`} onBlur={e => { plan.note = e.target.value; commit(P) }} />
        </div>
      )}
      {/* l'impostazione: cosa succede quando il tempo di una tappa finisce */}
      <div className={s.card}>
        <div className={s.lab}>{T.onEnd}</div>
        <div className={s.chips}>
          {(['warn', 'back'] as const).map(v => <button key={v} className={s.chip} aria-pressed={P.settings.onEnd === v} onClick={() => { P.settings.onEnd = v; commit(P) }}>{v === 'warn' ? T.onWarn : T.onBack}</button>)}
        </div>
      </div>
      {editing && <StepSheet step={editing === 'new' ? null : editing} secList={secList} onClose={() => setEditing(null)}
        onSave={v => { if (editing === 'new') ensure().steps.push({ id: newId(), done: false, spent: 0, ...v }); else Object.assign(editing, v); commit(P); setEditing(null) }} />}
      {copying && plan && <CopySheet day={day} dayLabel={label(fromIso(day))} name={name} steps={plan.steps} onClose={() => setCopying(false)} onDone={n => { setCopying(false); flash(T.copied(n)) }} />}
    </>
  )
}

/* la finestra per una tappa: sezione, cosa fare, quanti minuti */
function StepSheet({ step, secList, onClose, onSave }: { step: PlanStep | null; secList: ReturnType<typeof useSectionInfo>['list']; onClose: () => void; onSave: (v: { sec: SectionId; note: string; min: number }) => void }) {
  const { t } = useT()
  const T = t.plan
  const [sec, setSec] = useState<SectionId | ''>(step?.sec ?? '')
  const [note, setNote] = useState(step?.note ?? '')
  const [min, setMin] = useState(step?.min ?? 10)
  return (
    <div className={s.sheet} onClick={e => { if (e.target === e.currentTarget) onClose() }} role="dialog" aria-modal="true">
      <div className={s.panel}>
        <div className={s.h2}>{step ? T.editStep : T.newStep}</div>
        <div className={s.lab}>{T.whichSec}</div>
        <div className={s.secs}>{secList.map(x => <button key={x.id} className={s.sec} aria-pressed={sec === x.id} onClick={() => setSec(x.id)}><span>{x.e}</span>{x.title}</button>)}</div>
        <div className={s.lab}>{T.whatToDo}</div>
        <input className={s.input} value={note} maxLength={80} placeholder={T.whatPh} onChange={e => setNote(e.target.value)} />
        <div className={s.lab}>{T.howLong}</div>
        <div className={s.chips}>{[5, 10, 15, 20].map(m => <button key={m} className={s.chip} aria-pressed={min === m} onClick={() => setMin(m)}>{m} min</button>)}</div>
        <div className={s.row}>
          <button className={`${s.btn} ${s.main}`} disabled={!sec} onClick={() => sec && onSave({ sec, note: note.trim(), min })}>{step ? T.save : T.addBtn}</button>
          <button className={s.btn} onClick={onClose}>{T.cancel}</button>
        </div>
      </div>
    </div>
  )
}

/* copiare il piano di questo giorno agli altri bambini scelti */
function CopySheet({ day, dayLabel, name, steps, onClose, onDone }: { day: string; dayLabel: string; name: string; steps: PlanStep[]; onClose: () => void; onDone: (n: number) => void }) {
  const { t } = useT()
  const T = t.plan
  const kids = useChildren()
  const [sel, setSel] = useState<string[]>([])
  const others = kids.children.filter(c => c.id !== kids.active?.id)
  return (
    <div className={s.sheet} onClick={e => { if (e.target === e.currentTarget) onClose() }} role="dialog" aria-modal="true">
      <div className={s.panel}>
        <div className={s.h2}>{T.copyTitle}</div>
        <div className={s.sub}>{T.copyHint(name, dayLabel)}</div>
        <div className={s.chips}>
          {others.map(c => { const has = !!loadPlansFor(c.id).days[day]?.steps.length
            return <button key={c.id} className={s.chip} aria-pressed={sel.includes(c.id)} onClick={() => setSel(v => (v.includes(c.id) ? v.filter(x => x !== c.id) : [...v, c.id]))}>{c.name}{has ? T.hasPlan : ''}</button> })}
        </div>
        <div className={s.row}>
          <button className={`${s.btn} ${s.main}`} disabled={!sel.length} onClick={() => {
            sel.forEach(id => { const p = loadPlansFor(id); p.days[day] = { steps: freshSteps(steps), note: '', mood: '' }; savePlansFor(id, p) })
            onDone(sel.length)
          }}>{T.copyBtn}</button>
          <button className={s.btn} onClick={onClose}>{T.cancel}</button>
        </div>
      </div>
    </div>
  )
}
