'use client'
import { useEffect, useMemo, useState } from 'react'
import { useChildren } from '@/lib/children'
import { loadDeadlines, saveDeadlines, scheduleDeadlines, deadlineProgress, DL_SEC, isoOf, type DlSec, type DlStore, type Deadline } from '@/lib/deadlines'
import { loadPlans, todayIso } from '@/lib/plans'
import s from './Plan.module.css'

/* gli oggetti che si possono mettere in scadenza: poesie (con le strofe), testi di scuola, liste di Spell it! */
type Item = { id: string; title: string; parts?: number }
const READY: Item[] = [{ id: 'weather', title: '🌦️ Weather' }, { id: 'colours', title: '🎨 Colours' }, { id: 'numbers', title: '🔢 Numbers' }, { id: 'animals', title: '🐾 Animals' }]
const DAYS = ['D', 'L', 'M', 'M', 'G', 'V', 'S']
const chip = (on: boolean, c = 'var(--done)'): React.CSSProperties => ({ minHeight: 40, padding: '0 12px', borderRadius: 12, border: `2px solid ${on ? c : '#D6DBF2'}`, background: on ? c : 'var(--ground)', color: on ? '#fff' : 'var(--text)', fontSize: 14, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' })
const input: React.CSSProperties = { width: '100%', minHeight: 46, borderRadius: 12, border: '2px solid #D6DBF2', background: 'var(--card)', color: 'var(--text)', padding: '0 10px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit' }
const warn: React.CSSProperties = { borderRadius: 12, padding: '8px 10px', background: '#FFF3BF', color: '#5A4300', fontSize: 14, fontWeight: 800, lineHeight: 1.45 }
const nice = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) }
const plus = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }

/** 📅 Le scadenze del figlio scelto in alto: le tappe si aggiungono da sole al piano di lavoro */
export default function DeadlinesPanel({ onChange }: { onChange: () => void }) {
  const kids = useChildren()
  const [st, setSt] = useState<DlStore>({ cap: 25, list: [] })
  const [items, setItems] = useState<Record<DlSec, Item[]>>({ poesia: [], capisco: [], english: READY })
  const [form, setForm] = useState<null | { sec: DlSec; item: string; date: string; min: number; days: number[] }>(null)
  const [sel, setSel] = useState(todayIso())
  useEffect(() => {
    setSt(loadDeadlines())
    let poems: Item[] = [], mine: Item[] = []
    try { poems = (JSON.parse(localStorage.getItem('poesie') || '{}').list ?? []).map((p: { id: string; title: string; stanzas?: unknown[] }) => ({ id: p.id, title: p.title, parts: p.stanzas?.length ?? 1 })) } catch (_) {}
    try { mine = (JSON.parse(localStorage.getItem('spell_liste') || '[]') as { id: string; name: string }[]).map(l => ({ id: l.id, title: l.name })) } catch (_) {}
    setItems(v => ({ ...v, poesia: poems, english: [...READY, ...mine] }))
    fetch('/api/read-texts').then(r => (r.ok ? r.json() : { items: [] })).then(j => setItems(v => ({ ...v, capisco: (j.items ?? []).map((x: { id: string; title: string }) => ({ id: x.id, title: x.title })) }))).catch(() => {})
  }, [kids.active?.id])
  const save = (n: DlStore) => { saveDeadlines(n); setSt({ ...n }); onChange() }
  // i minuti della recita già nel piano contano per il tetto
  const extra = useMemo(() => { const e: Record<string, number> = {}; const p = loadPlans(); for (const [k, d] of Object.entries(p.days)) for (const x of d.steps) if (x.auto === 'recita') e[k] = (e[k] ?? 0) + x.min; return e }, [st])
  const { plan, load, notes } = useMemo(() => scheduleDeadlines(st, extra), [st, extra])
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const mon = plus(today, -((today.getDay() + 6) % 7)), exams = new Set(st.list.map(d => d.date))
  const add = () => {
    if (!form) return
    const it = items[form.sec].find(i => i.id === form.item); if (!it || !form.date) return
    save({ ...st, list: [...st.list, { id: Math.random().toString(36).slice(2, 9), sec: form.sec, item: it.id, title: it.title, parts: it.parts, date: form.date, min: form.min, days: form.days, skip: [], created: todayIso() }] })
    setForm(null)
  }
  const openForm = () => setForm({ sec: 'poesia', item: items.poesia[0]?.id ?? '', date: isoOf(plus(today, 7)), min: 10, days: [1, 2, 3, 4, 5] })
  return (
    <div className={s.card}>
      <div className={s.h2}>📅 Le scadenze</div>
      <div className={s.sub}>Una poesia, un testo o una lista di parole da sapere entro un giorno: l’app prepara una tappa al giorno nel piano.</div>
      {st.list.length === 0 && !form && <div className={s.sub}>Nessuna scadenza.</div>}
      {[...st.list].sort((a, b) => a.date.localeCompare(b.date)).map(d => { const S = DL_SEC[d.sec], left = Math.round((new Date(d.date + 'T00:00:00').getTime() - today.getTime()) / 864e5)
        const n = Object.values(plan).flat().filter(x => x.d.id === d.id).length
        return (
          <div key={d.id} style={{ border: `3px solid ${S.c}`, borderRadius: 16, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>{S.e}</span>
              <span style={{ flex: 1, fontWeight: 900, lineHeight: 1.3 }}><span style={{ display: 'block', fontSize: 12, color: S.c }}>{S.name} · {S.kind}</span>{d.title}</span>
              <button style={chip(false)} aria-label="✕" onClick={() => { if (confirm(`Togliere la scadenza «${d.title}» e le sue tappe?`)) save({ ...st, list: st.list.filter(x => x.id !== d.id) }) }}>✕</button>
            </div>
            <div className={s.sub}>📅 {nice(d.date)} · {left < 0 ? 'passata' : `fra ${left} ${left === 1 ? 'giorno' : 'giorni'}`} · {d.min} min al giorno · {n} {n === 1 ? 'tappa' : 'tappe'}</div>
            {(notes[d.id] ?? []).map((m, i) => <div key={i} style={warn}>⚠️ {m}</div>)}
            <HowItGoes d={d} past={left < 0} update={n => save({ ...st, list: st.list.map(x => (x.id === d.id ? n : x)) })} />
          </div>
        ) })}
      {!form && <button className={`${s.btn} ${s.blue}`} onClick={openForm}>＋ Nuova scadenza</button>}
      {form && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 16, padding: 12, background: 'var(--ground)' }}>
          <span className={s.sub}>Cosa deve sapere</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(Object.keys(DL_SEC) as DlSec[]).map(k => <button key={k} style={chip(form.sec === k)} onClick={() => setForm({ ...form, sec: k, item: items[k][0]?.id ?? '' })}>{DL_SEC[k].e} {DL_SEC[k].name}</button>)}
          </div>
          {items[form.sec].length ? (
            <select style={input} value={form.item} onChange={e => setForm({ ...form, item: e.target.value })}>
              {items[form.sec].map(i => <option key={i.id} value={i.id}>{i.title}{i.parts ? ` (${i.parts} strofe)` : ''}</option>)}
            </select>
          ) : <div style={warn}>{form.sec === 'poesia' ? 'Prima inserisci la poesia in 🎭.' : form.sec === 'capisco' ? 'Prima inserisci il testo in 🔎 (I testi di scuola).' : '—'}</div>}
          <span className={s.sub}>📅 Da sapere per il</span>
          <input style={input} type="date" value={form.date} min={isoOf(plus(today, 1))} onChange={e => setForm({ ...form, date: e.target.value })} />
          <span className={s.sub}>⏱️ Minuti al giorno</span>
          <div style={{ display: 'flex', gap: 6 }}>{[5, 10, 15].map(v => <button key={v} style={chip(form.min === v)} onClick={() => setForm({ ...form, min: v })}>{v} min</button>)}</div>
          <span className={s.sub}>🗓️ In quali giorni</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{[1, 2, 3, 4, 5, 6, 0].map(v => <button key={v} style={chip(form.days.includes(v))} onClick={() => setForm({ ...form, days: form.days.includes(v) ? form.days.filter(x => x !== v) : [...form.days, v] })}>{DAYS[v]}</button>)}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`${s.btn} ${s.blue}`} disabled={!items[form.sec].length || !form.days.length} onClick={add}>✅ Prepara le tappe</button>
            <button className={s.btn} onClick={() => setForm(null)}>Annulla</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <span className={s.sub}>⏱️ Al massimo, minuti al giorno in tutto:</span>
        {[15, 20, 25, 30].map(v => <button key={v} style={chip(st.cap === v)} onClick={() => save({ ...st, cap: v })}>{v}</button>)}
      </div>
      {st.list.length > 0 && (
        <>
          <div className={s.sub}>🗓️ Le prossime due settimane (in giallo i giorni troppo pieni, 📝 la verifica)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((h, i) => <div key={i} style={{ fontSize: 11, fontWeight: 900, textAlign: 'center', color: 'var(--text-soft)' }}>{h}</div>)}
            {Array.from({ length: 14 }, (_, i) => { const x = plus(mon, i), k = isoOf(x), list = plan[k] ?? [], m = load[k] ?? 0, past = k < todayIso()
              return (
                <button key={k} onClick={() => setSel(k)} style={{ minHeight: 66, borderRadius: 10, padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 2, fontFamily: 'inherit', cursor: 'pointer', opacity: past ? 0.4 : 1,
                  border: `2px ${exams.has(k) ? 'dashed #E03131' : k === todayIso() ? 'solid #5468D8' : 'solid #D6DBF2'}`, background: m > st.cap ? '#FFF3BF' : 'var(--card)', outline: k === sel ? '3px solid #FFC93C' : 'none', color: 'var(--text)' }}>
                  <span style={{ fontSize: 12, fontWeight: 900, textAlign: 'left' }}>{x.getDate()}</span>
                  <span style={{ fontSize: 13, lineHeight: 1 }}>{list.map(z => DL_SEC[z.d.sec].e).join('')}{exams.has(k) ? '📝' : ''}</span>
                  {m > 0 && <span style={{ fontSize: 10, fontWeight: 900, color: 'var(--text-soft)', marginTop: 'auto' }}>{m}′</span>}
                </button>
              ) })}
          </div>
          <div className={s.sub}><b>{nice(sel)}</b>{(load[sel] ?? 0) > 0 ? ` · ${load[sel]} min` : ''}</div>
          {st.list.filter(d => d.date === sel).map(d => <div key={d.id} style={warn}>📝 {DL_SEC[d.sec].kind}: {d.title}</div>)}
          {(plan[sel] ?? []).map(z => (
            <div key={z.d.id} style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 14, padding: '8px 10px', background: 'var(--ground)', borderLeft: `6px solid ${DL_SEC[z.d.sec].c}` }}>
              <span style={{ fontSize: 22 }}>{DL_SEC[z.d.sec].e}</span>
              <span style={{ flex: 1, fontWeight: 800, fontSize: 14 }}><span style={{ display: 'block', fontSize: 12, color: DL_SEC[z.d.sec].c }}>📅 {z.d.title}</span>{z.lab}</span>
              <span style={{ fontWeight: 900, color: 'var(--text-soft)' }}>{z.d.min}′</span>
              {sel >= todayIso() && <button style={chip(false)} aria-label="togli da questo giorno" onClick={() => save({ ...st, list: st.list.map(d => (d.id === z.d.id ? { ...d, skip: [...d.skip, sel] } : d)) })}>✕</button>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

/* ── 📊 Come sta andando: il semaforo, tre segnali, i giorni, e i suggerimenti con un tocco ── */
const LIGHT = { g: ['#2F9E44', 'In pari'], y: ['#F08C00', 'Un po’ indietro'], r: ['#E03131', 'Indietro'] } as const
const WD = ['la domenica', 'il lunedì', 'il martedì', 'il mercoledì', 'il giovedì', 'il venerdì', 'il sabato']
const sg: React.CSSProperties = { borderRadius: 12, background: 'var(--ground)', padding: '8px 6px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }
const act: React.CSSProperties = { minHeight: 40, padding: '0 12px', borderRadius: 12, border: '2px solid #F0C93C', background: '#fff', color: '#5A4300', fontSize: 14, fontWeight: 900, fontFamily: 'inherit', cursor: 'pointer' }
function HowItGoes({ d, past, update }: { d: Deadline; past: boolean; update: (d: Deadline) => void }) {
  const [open, setOpen] = useState(false)
  const P = useMemo(() => deadlineProgress(d, loadPlans().days, todayIso()), [d])
  // English time: le parole della lista ancora da ripassare (dai ripassi di Spell it!)
  const words = useMemo(() => { if (d.sec !== 'english') return null; try { return (JSON.parse(localStorage.getItem('spell_ripasso') || '[]') as { l: string; w: string }[]).filter(r => r.l === d.item).map(r => r.w) } catch (_) { return null } }, [d])
  if (past) {
    const faces = ['😊', '😐', '😟'], pct = P.planned ? Math.round((P.done / Math.max(P.planned, 1)) * 100) : 0
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, borderRadius: 14, padding: 10, background: '#EDF2FF' }}>
        <b>Com’è andata?</b>
        <div style={{ display: 'flex', gap: 8 }}>{faces.map(f => <button key={f} onClick={() => update({ ...d, result: { ...d.result, face: f } })} style={{ flex: 1, minHeight: 56, borderRadius: 14, fontSize: 30, cursor: 'pointer', border: `3px solid ${d.result?.face === f ? '#5468D8' : '#D6DBF2'}`, background: 'var(--card)' }}>{f}</button>)}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}><span style={{ fontSize: 13, fontWeight: 800 }}>Il voto, se vuoi:</span>
          {['5', '6', '7', '8', '9', '10'].map(v => <button key={v} onClick={() => update({ ...d, result: { face: d.result?.face ?? '😐', voto: v } })} style={chip(d.result?.voto === v, '#5468D8')}>{v}</button>)}</div>
        {d.result && (
          <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5 }}>🧠 <b>Cosa ha funzionato</b>: percorso fatto {P.done} su {P.done + P.strip.filter(x => x.state === 'no').length} tappe, {P.spentMin} minuti in tutto.{' '}
            {d.result.face === '😊' ? (pct >= 80 ? 'Questo modo di prepararsi funziona: tienilo per la prossima volta.' : 'È andata bene anche saltando qualche tappa: la prossima volta si può provare con meno minuti.')
              : d.result.face === '😟' ? 'La prossima volta conviene cominciare prima, con più giorni e passi più piccoli.' : 'Qualcosa da migliorare: guarda quali giorni sono saltati e quali passi hanno chiesto più tempo.'}</div>
        )}
      </div>
    )
  }
  const [col, lab] = LIGHT[P.light]
  const tips: { h: string; p: string; a?: { l: string; f: () => Deadline }[] }[] = []
  if (P.behind >= 1) {
    const a: { l: string; f: () => Deadline }[] = []
    if (!d.days.includes(6)) a.push({ l: 'Aggiungi il sabato', f: () => ({ ...d, days: [...d.days, 6] }) })
    if (d.min < 15) a.push({ l: `${d.min + 5} minuti al giorno`, f: () => ({ ...d, min: d.min + 5 }) })
    tips.push({ h: P.behind >= 2 ? '⏰ Il tempo rischia di non bastare' : '🟡 Una tappa indietro', p: `${P.behind === 1 ? 'Una tappa è saltata' : `${P.behind} tappe sono saltate`}: il lavoro è stato spostato sui giorni che restano. Si può aggiungere un giorno o qualche minuto.`, a })
  }
  for (const [wd, n] of Object.entries(P.missedWeekdays)) if (n >= 2 && d.days.length > 2)
    tips.push({ h: '📅 Sempre lo stesso giorno saltato', p: `${WD[+wd][0].toUpperCase() + WD[+wd].slice(1)} è saltato ${n} volte: forse è un pomeriggio troppo pieno.`, a: [{ l: `Togli ${WD[+wd]}`, f: () => ({ ...d, days: d.days.filter(x => x !== +wd) }) }] })
  if (P.ratio !== null && P.done >= 2 && P.ratio > 1.5) { const m = Math.min(20, Math.ceil((P.ratio * d.min) / 5) * 5)
    tips.push({ h: '🐢 Ci mette più del previsto', p: `In media il doppio del tempo: i passi sono troppo grandi, o difficili. Meglio prevedere più minuti, e usare più aiuti.`, a: [{ l: `Porta a ${m} minuti`, f: () => ({ ...d, min: m }) }] }) }
  if (P.ratio !== null && P.done >= 2 && P.ratio < 0.5) tips.push({ h: '⚡ Finisce molto prima', p: 'Forse è facile, o va di fretta: un giorno guardate insieme come lo fa.' })
  if (words && words.length >= 3) tips.push({ h: '🔁 Parole che tornano sbagliate', p: `Da ripassare: ${words.slice(0, 6).join(', ')}. Nei prossimi giorni conviene il livello con le lettere in ordine.` })
  if (!tips.length) tips.push({ h: P.done ? '🎉 Va tutto liscio' : '🚀 Si comincia', p: P.done ? 'Tappe fatte e nel tempo giusto: si può togliere un aiuto.' : 'Le tappe sono pronte nel piano: qui vedrai come va, giorno per giorno.' })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, borderRadius: 12, border: `2px solid ${col}`, background: 'var(--card)', color: 'var(--text)', fontFamily: 'inherit', fontWeight: 900, fontSize: 14, cursor: 'pointer', padding: '0 10px' }}>
        <span style={{ width: 18, height: 18, borderRadius: '50%', background: col }} />📊 Come sta andando: <span style={{ color: col }}>{lab}</span><span style={{ marginLeft: 'auto' }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: words ? '1fr 1fr 1fr' : '1fr 1fr', gap: 6 }}>
            <div style={sg}><b style={{ fontSize: 18, color: P.behind >= 2 ? '#E03131' : P.behind ? '#F08C00' : '#2F9E44' }}>{P.done} / {P.planned + (P.strip.some(x => x.state === 'oggi') ? 0 : 0)}</b><span style={{ fontSize: 11, fontWeight: 800 }}>tappe fatte / previste fino a ieri</span></div>
            <div style={sg}><b style={{ fontSize: 18, color: P.ratio !== null && (P.ratio > 1.5 || P.ratio < 0.5) ? '#E03131' : '#2F9E44' }}>{P.spentMin}′ / {P.doneMin}′</b><span style={{ fontSize: 11, fontWeight: 800 }}>minuti fatti / previsti</span></div>
            {words && <div style={sg}><b style={{ fontSize: 18, color: words.length >= 3 ? '#F08C00' : '#2F9E44' }}>{words.length}</b><span style={{ fontSize: 11, fontWeight: 800 }}>parole da ripassare</span></div>}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {P.strip.map(x => { const dd = new Date(x.date + 'T00:00:00')
              return <span key={x.date} style={{ minWidth: 38, borderRadius: 10, padding: '3px 2px', textAlign: 'center', fontSize: 11, fontWeight: 900, border: `2px ${x.state === 'prova' ? 'dashed #E03131' : x.state === 'ok' ? 'solid #2F9E44' : x.state === 'no' ? 'solid #E03131' : 'solid #D6DBF2'}`, background: x.state === 'no' ? '#FFF0F0' : 'var(--card)', opacity: x.state === 'poi' ? 0.6 : 1 }}>
                <span style={{ display: 'block', fontSize: 15 }}>{x.state === 'ok' ? '✅' : x.state === 'no' ? '✖️' : x.state === 'prova' ? '📝' : x.state === 'oggi' ? '👉' : '·'}</span>{DAYS[dd.getDay()]} {dd.getDate()}</span> })}
          </div>
          {tips.map((t, i) => (
            <div key={i} style={{ borderRadius: 12, padding: '8px 10px', background: '#FFF6D6', color: '#5A4300', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <b style={{ fontSize: 14 }}>{t.h}</b><span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.45 }}>{t.p}</span>
              {t.a && <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{t.a.map(a => <button key={a.l} style={act} onClick={() => update(a.f())}>{a.l}</button>)}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
