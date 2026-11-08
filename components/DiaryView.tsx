'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useT } from '@/lib/i18n'
import { autoStar } from '@/lib/stars'
import { useSpeech } from '@/hooks/useSpeech'
import {
  DIARY_TYPES, BASE_SUBJECTS, CUSTOM_COLORS, CUSTOM_ICONS, typeOf, loadDiarySettings, saveDiarySettings, loadTimetable, saveTimetable,
  loadDemoEntries, saveDemoEntries, iso, fromIso, addDays, monday, todayDate, nextSchoolDay, entriesOn, shrinkPhoto,
  type DiaryEntry, type DiaryType, type DiarySettings, type Subject, type Timetable,
} from '@/lib/diary'
import SectionTitle from './SectionTitle'
import s from './Diary.module.css'

/**
 * Il mio diario di scuola: "Domani", la settimana con compiti, verifiche e cose da portare,
 * l'orario e il mese. Nella parte del bambino si può scrivere solo se il genitore lo ha permesso;
 * nell'area Genitore (parent) si può sempre. Segnare un compito come fatto è sempre permesso.
 */
export default function DiaryView({ onBack, parent = false, demo = false }: { onBack?: () => void; parent?: boolean; demo?: boolean }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const T = t.diary
  const [tab, setTab] = useState(0)
  const [settings, setSettings] = useState<DiarySettings>({ who: 'parent', custom: [] })
  const [tt, setTt] = useState<Timetable>({ 1: [], 2: [], 3: [], 4: [], 5: [] })
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [serverCanEdit, setServerCanEdit] = useState<boolean | null>(null)
  const [adding, setAdding] = useState<string | null>(null)      // il giorno a cui si aggiunge una voce
  const [open, setOpen] = useState<DiaryEntry | null>(null)
  const [msg, setMsg] = useState('')
  const today = todayDate()
  // lo stato delle viste resta qui, così non si perde quando la pagina si aggiorna
  const [week, setWeek] = useState(() => monday(todayDate()))
  const [edit, setEdit] = useState(false)
  const [picking, setPicking] = useState<number | null>(null)
  const [m, setM] = useState(() => { const d = todayDate(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [sel, setSel] = useState(() => iso(todayDate()))
  const canEdit = parent || demo || (serverCanEdit ?? settings.who === 'child')

  /* le materie: quelle di serie (con il nome nella lingua dell'app) e quelle aggiunte dal genitore */
  const subjects = useMemo<Subject[]>(() => [
    ...BASE_SUBJECTS.map(x => ({ ...x, name: T.subjects[x.key]?.[0] ?? x.key, short: T.subjects[x.key]?.[1] ?? x.key })),
    ...settings.custom.map(x => ({ ...x, short: x.short ?? (x.name ?? '').slice(0, 6) })),
  ], [settings.custom, T])
  const subj = useCallback((k: string) => subjects.find(x => x.key === k), [subjects])

  /* le voci: dal database (o, nella demo, da questo telefono) */
  const reload = useCallback(async () => {
    if (demo) { setEntries(loadDemoEntries()); return }
    const from = iso(addDays(today, -60)), to = iso(addDays(today, 120))
    try {
      const r = await fetch(`/api/diary?from=${from}&to=${to}`)
      if (r.ok) { const j = await r.json(); setEntries(j.items ?? []); setServerCanEdit(!!j.canEdit) }
    } catch (_) {}
  }, [demo]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setSettings(loadDiarySettings()); setTt(loadTimetable()); reload() }, [reload])
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 2200) }

  /* salvare, cambiare e togliere le voci */
  async function addEntry(e: Omit<DiaryEntry, 'id' | 'done' | 'photo_url'>, photo: { blob: Blob; url: string } | null) {
    if (demo) {
      const list = [...loadDemoEntries(), { ...e, id: String(Date.now()), done: false, photo_url: photo?.url ?? null }]
      saveDemoEntries(list); setEntries(list); flash(T.saved); speak(T.saved); return
    }
    const r = await fetch('/api/diary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(e) })
    if (!r.ok) { flash((await r.json().catch(() => ({}))).error ?? '!'); return }
    const { item } = await r.json()
    if (photo && item?.id && !(await uploadPhoto(item.id, photo, true))) return
    flash(T.saved); speak(T.saved); reload()
  }
  /** carica la foto di una voce; se non riesce lo dice, con il motivo */
  async function uploadPhoto(id: string, photo: { blob: Blob; url: string }, afterSave = false): Promise<boolean> {
    const f = new FormData(); f.append('file', new File([photo.blob], 'foto.jpg', { type: 'image/jpeg' })); f.append('itemId', id); f.append('table', 'school_diary')
    const up = await fetch('/api/upload', { method: 'POST', body: f }).catch(() => null)
    if (!up || !up.ok) { const err = up ? (await up.json().catch(() => ({}))).error : ''; flash(`${afterSave ? T.photoFailed : T.photoFailedOnly}${err ? ` (${err})` : ''}`); reload(); return false }
    if (!afterSave) { flash(T.saved); reload() }
    return true
  }
  async function setDone(e: DiaryEntry, done: boolean) {
    if (done) { autoStar(); speak(T.bravo) }
    if (demo) { const list = loadDemoEntries().map(x => (x.id === e.id ? { ...x, done } : x)); saveDemoEntries(list); setEntries(list); return }
    setEntries(list => list.map(x => (x.id === e.id ? { ...x, done } : x)))
    await fetch(`/api/diary/${e.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done }) }).catch(() => {})
  }
  async function removeEntry(e: DiaryEntry) {
    if (demo) { const list = loadDemoEntries().filter(x => x.id !== e.id); saveDemoEntries(list); setEntries(list); return }
    setEntries(list => list.filter(x => x.id !== e.id))
    await fetch(`/api/diary/${e.id}`, { method: 'DELETE' }).catch(() => {})
  }
  const changeTt = (n: Timetable) => { setTt(n); saveTimetable(n) }
  const changeSettings = (n: DiarySettings) => { setSettings(n); saveDiarySettings(n) }

  const dayLabel = (d: Date) => `${T.days[d.getDay()]} ${d.getDate()}`
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1)

  return (
    <>
      {!parent && <SectionTitle emoji="📚" title={T.title} sub={T.homeSub} onBack={onBack ?? (() => {})} spot="diario" />}
      {parent && <DiarySettingsPanel settings={settings} onChange={changeSettings} />}
      <nav className={s.tabs}>{T.tabs.map((l: string, i: number) => <button key={i} className={s.tab} aria-current={tab === i} onClick={() => setTab(i)}>{l}</button>)}</nav>
      {!canEdit && <div className={s.sub} style={{ textAlign: 'center' }}>🔒 {T.readOnly}</div>}
      {msg && <div className={s.msg}>{msg}</div>}
      {tab === 0 && (
        <>
          <Tomorrow />
          <Week />
        </>
      )}
      {tab === 1 && <TimetableCard />}
      {tab === 2 && <Month />}
      {adding && <AddSheet day={adding} onClose={() => setAdding(null)} tt={tt} subjects={subjects} onSave={addEntry} />}
      {open && <EntrySheet e={open} onClose={() => setOpen(null)} />}
    </>
  )

  /* ── ⭐ Domani: materie dall'orario, verifiche e cose da portare dal diario ── */
  function Tomorrow() {
    const d = nextSchoolDay(today, entries), ds = iso(d), es = entriesOn(entries, ds)
    const names = [...new Set(tt[d.getDay()] ?? [])].map(k => subj(k)?.name).filter(Boolean) as string[]
    const tests = es.filter(e => e.type === 'verifica'), bring = es.filter(e => e.type === 'portare'), trips = es.filter(e => e.type === 'gita')
    const when = iso(addDays(today, 1)) === ds ? T.tomorrow : T.nextDay
    const voice = T.voice(when, T.days[d.getDay()], names, tests.map(e => subj(e.subject)?.name ?? ''), bring.map(e => e.note || subj(e.subject)?.name || ''))
    const empty = !names.length && !tests.length && !bring.length && !trips.length
    return (
      <div className={`${s.card} ${s.tomorrow}`}>
        <div className={s.h2}><span>⭐ {when} ({dayLabel(d)})</span><button className={s.say} onClick={() => speak(voice)} aria-label="🔊">🔊</button></div>
        {names.length > 0 && <div className={s.tline}>📚 {T.youHave}: <b>{names.join(', ')}</b></div>}
        {tests.map(e => <div key={e.id} className={s.tline}>✏️ <b>{T.testOf(subj(e.subject)?.name ?? '')}</b>{e.note ? `: ${e.note}` : ''}</div>)}
        {bring.length > 0 && <div className={s.tline}>🎒 {T.bring}: <b>{bring.map(e => e.note || subj(e.subject)?.name).join(', ')}</b></div>}
        {trips.map(e => <div key={e.id} className={s.tline}>🚌 <b>{e.note || T.types.gita}</b></div>)}
        {empty && <div className={s.tline}>{T.onlyLessons}</div>}
      </div>
    )
  }

  /* ── 📝 La settimana, giorno per giorno ── */
  function Week() {
    const end = addDays(week, 4)
    return (
      <div className={s.card}>
        <div className={s.weeknav}>
          <button className={s.navb} onClick={() => setWeek(addDays(week, -7))} aria-label="‹">‹</button>
          <span>{week.getDate()} – {end.getDate()} {T.months[end.getMonth()]}</span>
          <button className={s.navb} onClick={() => setWeek(addDays(week, 7))} aria-label="›">›</button>
        </div>
        {[0, 1, 2, 3, 4].map(i => {
          const d = addDays(week, i), ds = iso(d), es = entriesOn(entries, ds), isToday = ds === iso(today)
          return (
            <div key={ds} className={`${s.day}${isToday ? ` ${s.isToday}` : ''}`}>
              <div className={s.dayhead}>{cap(dayLabel(d))}{isToday ? <span className={s.tag}>{T.today}</span> : <span>{T.hours((tt[d.getDay()] ?? []).length)}</span>}</div>
              <div className={s.entries}>
                {es.some(e => e.type === 'vacanza') && <div className={s.free}>🏖️ {T.types.vacanza}</div>}
                {es.filter(e => e.type !== 'vacanza').map(e => <Row key={e.id} e={e} />)}
                {!es.length && <div className={s.free}>{T.nothing}</div>}
              </div>
              {canEdit && <button className={s.add} onClick={() => setAdding(ds)}>{T.add}</button>}
            </div>
          )
        })}
      </div>
    )
  }
  function Row({ e }: { e: DiaryEntry }) {
    const ty = typeOf(e.type), sj = subj(e.subject)
    return (
      <button className={`${s.entry}${e.type === 'verifica' ? ` ${s.test}` : ''}${e.done ? ` ${s.isDone}` : ''}`} style={{ ['--c' as string]: sj?.c ?? ty.c }}
        onClick={() => { setOpen(e); speak(`${T.types[e.type]}${sj ? `, ${sj.name}` : ''}${e.note ? `: ${e.note}` : ''}`) }}>
        <span className={s.entryIc}>{ty.e}</span>
        {e.photo_url && <img className={s.entryImg} src={e.photo_url} alt="" />}
        <span className={s.entryTx}>{sj ? `${sj.e} ${sj.name}` : T.types[e.type]}{e.note && <small>{e.note}</small>}</span>
        {e.type === 'compiti' && <span className={s.entryOk}>{e.done ? '✅' : '⬜'}</span>}
      </button>
    )
  }

  /* ── Una voce aperta: la voce la legge; i compiti si segnano come fatti ── */
  function EntrySheet({ e, onClose }: { e: DiaryEntry; onClose: () => void }) {
    const ty = typeOf(e.type), sj = subj(e.subject)
    return (
      <div className={s.sheet} onClick={ev => { if (ev.target === ev.currentTarget) onClose() }} role="dialog" aria-modal="true">
        <div className={s.panel}>
          <div className={s.h2}>{ty.e} {T.types[e.type]}{sj ? ` · ${sj.name}` : ''}</div>
          <div className={s.sub}>{cap(dayLabel(fromIso(e.day)))}</div>
          {e.note && <div className={s.tline}>{e.note}</div>}
          {e.photo_url && <img className={s.photo} src={e.photo_url} alt="" />}
          <div className={s.row}>
            {e.type === 'compiti' && <button className={`${s.btn} ${s.main}`} onClick={() => { setDone(e, !e.done); onClose() }}>{e.done ? T.undone : T.doneBtn}</button>}
            {canEdit && <button className={s.btn} onClick={() => { removeEntry(e); onClose() }}>{T.remove}</button>}
            {/* una foto anche dopo: per esempio se la prima volta non si era salvata */}
            {canEdit && !demo && !e.photo_url && (
              <label className={s.btn}>{T.photoAdd}
                <input type="file" accept="image/*" hidden onChange={async ev => { const f = ev.target.files?.[0]; if (!f) return; const ph = await shrinkPhoto(f).catch(() => null); if (ph) { onClose(); await uploadPhoto(e.id, ph) } }} />
              </label>
            )}
            <button className={s.btn} onClick={onClose}>{T.close}</button>
          </div>
        </div>
      </div>
    )
  }

  /* ── 🗓️ L'orario: una colonna per giorno; si modifica solo se si può scrivere nel diario ── */
  function TimetableCard() {
    const tw = today.getDay(), isEmpty = [1, 2, 3, 4, 5].every(w => !(tt[w] ?? []).length)
    const move = (w: number, i: number, dir: number) => { const a = [...(tt[w] ?? [])], j = i + dir; if (j < 0 || j >= a.length) return; [a[i], a[j]] = [a[j], a[i]]; changeTt({ ...tt, [w]: a }) }
    return (
      <>
        <div className={s.card}>
          <div className={`${s.row} ${s.between}`}>
            <div className={s.h2}>{T.myTimetable}</div>
            {canEdit && <button className={`${s.btn}${edit ? ` ${s.main}` : ''}`} onClick={() => setEdit(!edit)}>{edit ? T.editDone : T.edit}</button>}
          </div>
          <div className={s.sub}>{edit ? T.ttHintEdit : isEmpty ? T.emptyTimetable : T.ttHint}</div>
          <div className={s.tt}>
            {[1, 2, 3, 4, 5].map(w => (
              <div key={w} className={s.ttcol} style={tw === w ? { borderColor: 'var(--blue)' } : undefined}>
                <button onClick={() => speak(`${T.days[w]}: ${(tt[w] ?? []).map(k => subj(k)?.name).join(', ') || T.noSubjects}`)}>{T.daysShort[w]}</button>
                {(tt[w] ?? []).map((k, i) => { const x = subj(k); if (!x) return null
                  return (
                    <div key={`${k}-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <button className={s.ttit} style={{ background: x.c }} aria-label={x.name} onClick={() => speak(x.name ?? '')}><span>{x.e}</span>{x.short}</button>
                      {edit && <div className={s.ttedit}><button onClick={() => move(w, i, -1)} aria-label="↑">↑</button><button onClick={() => move(w, i, 1)} aria-label="↓">↓</button><button onClick={() => changeTt({ ...tt, [w]: (tt[w] ?? []).filter((_, j) => j !== i) })} aria-label="✕">✕</button></div>}
                    </div>
                  ) })}
                {edit && <button className={s.ttadd} onClick={() => setPicking(w)} aria-label="＋">＋</button>}
              </div>
            ))}
          </div>
        </div>
        {tw >= 1 && tw <= 5 && (tt[tw] ?? []).length > 0 && (
          <div className={s.card}>
            <div className={s.h2}>{T.todayIs(T.days[tw])}</div>
            <div className={s.row}>{(tt[tw] ?? []).map((k, i) => { const x = subj(k); return x ? <span key={i} className={s.subj} style={{ background: x.c }}>{x.e} {x.name}</span> : null })}</div>
          </div>
        )}
        {picking && (
          <div className={s.sheet} onClick={ev => { if (ev.target === ev.currentTarget) setPicking(null) }} role="dialog" aria-modal="true">
            <div className={s.panel}>
              <div className={s.h2}>{T.pickSubject(T.days[picking])}</div>
              <div className={s.subjs}>
                {subjects.map(x => <button key={x.key} className={s.subj} style={{ background: x.c, opacity: 1 }} onClick={() => { changeTt({ ...tt, [picking]: [...(tt[picking] ?? []), x.key] }); speak(x.name ?? ''); setPicking(null) }}>{x.e} {x.name}</button>)}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  /* ── 📅 Il mese: pallini colorati sui giorni; toccando un giorno si vede cosa c'è ── */
  function Month() {
    const start = monday(m), cells: Date[] = []
    for (let i = 0; i < 42; i++) { const d = addDays(start, i); if (i >= 35 && d.getMonth() !== m.getMonth()) break; cells.push(d) }
    const sd = fromIso(sel), es = entriesOn(entries, sel)
    return (
      <>
        <div className={s.card}>
          <div className={s.weeknav}>
            <button className={s.navb} onClick={() => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1))} aria-label="‹">‹</button>
            <span>{cap(T.months[m.getMonth()])} {m.getFullYear()}</span>
            <button className={s.navb} onClick={() => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1))} aria-label="›">›</button>
          </div>
          <div className={s.month}>
            {T.daysLetter.map((x: string, i: number) => <div key={i} className={s.wd}>{x}</div>)}
            {cells.map(d => { const ds = iso(d), de = entriesOn(entries, ds)
              return (
                <button key={ds} onClick={() => setSel(ds)}
                  className={`${s.mday}${d.getMonth() !== m.getMonth() ? ` ${s.out}` : ''}${ds === iso(today) ? ` ${s.mToday}` : ''}${ds === sel ? ` ${s.sel}` : ''}${de.some(e => e.type === 'vacanza') ? ` ${s.holiday}` : ''}`}>
                  <span>{d.getDate()}</span>
                  <span className={s.mdots}>{[...new Set(de.map(e => e.type))].filter(x => x !== 'vacanza').map(x => <i key={x} style={{ background: typeOf(x).c }} />)}</span>
                </button>
              ) })}
          </div>
          <div className={s.legend}>
            {DIARY_TYPES.filter(x => x.id !== 'vacanza').map(x => <span key={x.id}><i style={{ background: x.c }} />{T.types[x.id]}</span>)}
            <span><i style={{ background: '#E6F6EE', border: '1px solid #2F9E44' }} />{T.legendHoliday}</span>
          </div>
        </div>
        <div className={s.card}>
          <div className={s.h2}>{cap(T.days[sd.getDay()])} {sd.getDate()} {T.months[sd.getMonth()]}</div>
          <div className={s.entries}>{es.map(e => <Row key={e.id} e={e} />)}{!es.length && <div className={s.free}>{T.nothing}</div>}</div>
          {canEdit && <button className={s.add} onClick={() => setAdding(sel)}>{T.add}</button>}
        </div>
      </>
    )
  }
}

/* ── ＋ Aggiungere: che cosa → materia (prima quelle dell'orario di quel giorno) → una parola, la voce o una foto ── */
function AddSheet({ day, onClose, tt, subjects, onSave }: { day: string; onClose: () => void; tt: Timetable; subjects: Subject[]; onSave: (e: Omit<DiaryEntry, 'id' | 'done' | 'photo_url'>, photo: { blob: Blob; url: string } | null) => void }) {
  const { t } = useT()
  const { speak } = useSpeech()
  const T = t.diary
  const subj = (k: string) => subjects.find(x => x.key === k)
  const d = fromIso(day)
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1)
  const dayLabel = (x: Date) => `${T.days[x.getDay()]} ${x.getDate()}`
  const [type, setType] = useState<DiaryType>('compiti')
  const [sj, setSj] = useState('')
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState<{ blob: Blob; url: string } | null>(null)
  const [listening, setListening] = useState(false)
  const needSubject = type === 'compiti' || type === 'verifica'
  const todays = [...new Set(tt[d.getDay()] ?? [])], rest = subjects.map(x => x.key).filter(k => !todays.includes(k))
  const SR = typeof window !== 'undefined' ? ((window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: new () => SpeechRec }).webkitSpeechRecognition) : undefined
  const dictate = () => {
    if (!SR) return
    try { const r = new SR(); r.lang = t.locale; r.onresult = ev => { setNote(n => (n ? `${n} ` : '') + ev.results[0][0].transcript); setListening(false) }; r.onend = () => setListening(false); r.start(); setListening(true) } catch (_) { setListening(false) }
  }
  return (
    <div className={s.sheet} onClick={ev => { if (ev.target === ev.currentTarget) onClose() }} role="dialog" aria-modal="true">
      <div className={s.panel}>
        <div className={s.h2}>＋ {cap(dayLabel(d))}</div>
        <div className={s.lab}>{T.what}</div>
        <div className={s.types}>
          {DIARY_TYPES.map(x => <button key={x.id} className={s.type} aria-pressed={type === x.id} onClick={() => { setType(x.id); speak(T.types[x.id]) }}><span>{x.e}</span>{T.types[x.id]}</button>)}
        </div>
        {type !== 'gita' && type !== 'vacanza' && (
          <>
            <div className={s.lab}>{T.whichSubject}{todays.length ? T.firstOf(T.days[d.getDay()]) : ''}</div>
            <div className={s.subjs}>
              {[...todays, ...rest].map(k => { const x = subj(k); if (!x) return null
                return <button key={k} className={s.subj} style={{ background: x.c }} aria-pressed={sj === k} onClick={() => { setSj(k); speak(x.name ?? '') }}>{x.e} {x.name}</button> })}
            </div>
          </>
        )}
        <div className={s.lab}>{type === 'portare' ? T.noteBring : type === 'vacanza' ? T.noteHoliday : T.noteOther}</div>
        <textarea className={s.text} value={note} placeholder={T.placeholders[type]} maxLength={300} onChange={ev => setNote(ev.target.value)} />
        <div className={s.row}>
          {SR && <button className={s.btn} onClick={dictate}>{listening ? T.listening : T.dictate}</button>}
          <label className={s.btn}>{T.photo}
            <input type="file" accept="image/*" hidden onChange={async ev => { const f = ev.target.files?.[0]; if (f) setPhoto(await shrinkPhoto(f).catch(() => null)) }} />
          </label>
        </div>
        {photo && <img className={s.photo} src={photo.url} alt="" />}
        <div className={s.row}>
          <button className={`${s.btn} ${s.main}`} disabled={needSubject && !sj} onClick={() => { onSave({ day, type, subject: type === 'gita' || type === 'vacanza' ? '' : sj, note: note.trim() }, photo); onClose() }}>{T.save}</button>
          <button className={s.btn} onClick={onClose}>{t.common.cancel}</button>
        </div>
      </div>
    </div>
  )
}

/* il riconoscimento della voce del browser (per dettare) */
interface SpeechRec { lang: string; start: () => void; onresult: (e: { results: { 0: { transcript: string } }[] }) => void; onend: () => void }

/** Area Genitore: chi compila il diario e le materie in più */
function DiarySettingsPanel({ settings, onChange }: { settings: DiarySettings; onChange: (v: DiarySettings) => void }) {
  const { t } = useT()
  const T = t.diary
  const [name, setName] = useState('')
  const [icon, setIcon] = useState(CUSTOM_ICONS[0])
  const [color, setColor] = useState(CUSTOM_COLORS[0])
  const add = () => {
    const n = name.trim(); if (!n) return
    onChange({ ...settings, custom: [...settings.custom, { key: `x${Date.now()}`, name: n, short: n.slice(0, 6), e: icon, c: color }] }); setName('')
  }
  return (
    <div className={s.card}>
      <div className={s.sub}>{T.parentHint}</div>
      <div className={s.lab}>{T.setWho}</div>
      <div className={s.row}>
        {(['parent', 'child'] as const).map(w => <button key={w} className={`${s.btn}${settings.who === w ? ` ${s.main}` : ''}`} onClick={() => onChange({ ...settings, who: w })}>{w === 'parent' ? T.whoParent : T.whoChild}</button>)}
      </div>
      <div className={s.sub} style={{ fontSize: 13 }}>{T.whoHint}</div>
      <div className={s.lab}>{T.mySubjects}</div>
      {settings.custom.length > 0 && (
        <div className={s.row}>{settings.custom.map(x => (
          <span key={x.key} className={s.subj} style={{ background: x.c }}>{x.e} {x.name}
            <button onClick={() => onChange({ ...settings, custom: settings.custom.filter(y => y.key !== x.key) })} style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 900, cursor: 'pointer' }} aria-label="✕">✕</button>
          </span>))}
        </div>
      )}
      <div className={s.row}><input className={s.input} value={name} maxLength={24} placeholder={T.subjectName} onChange={e => setName(e.target.value)} /></div>
      <div className={s.row}>{CUSTOM_ICONS.map(i => <button key={i} className={s.pick} aria-pressed={icon === i} onClick={() => setIcon(i)}>{i}</button>)}</div>
      <div className={s.row}>
        {CUSTOM_COLORS.map(c => <button key={c} className={s.pick} aria-pressed={color === c} style={{ background: c }} onClick={() => setColor(c)} aria-label={c} />)}
        <button className={`${s.btn} ${s.main}`} disabled={!name.trim()} onClick={add}>{T.addSubject}</button>
      </div>
    </div>
  )
}
