'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { COVERS, splitParts, splitSentences, type ReadContent, type ReadQuestion, type ReadTextRow } from '@/lib/readTexts'
import type { QType } from '@/lib/readStories'
import s from './ReadUnderstand.module.css'

const QT: QType[] = ['chi', 'cosa', 'quanti', 'dove', 'quando', 'perche']
const QCOLOR: Record<string, string> = { chi: '#1C7ED6', cosa: '#7048E8', quanti: '#F08C00', dove: '#2F9E44', quando: '#0B7285', perche: '#E64980' }
const input: React.CSSProperties = { width: '100%', minHeight: 48, borderRadius: 14, border: '2px solid #D6DBF2', background: 'var(--ground)', color: 'var(--text)', padding: '8px 12px', fontSize: 16, fontWeight: 700, fontFamily: 'inherit' }
const chip = (on: boolean, c = 'var(--done)'): React.CSSProperties => ({ minHeight: 42, padding: '0 12px', borderRadius: 12, border: `2px solid ${on ? c : '#D6DBF2'}`, background: on ? c : 'var(--ground)', color: on ? '#fff' : 'var(--text)', fontSize: 15, fontWeight: 800, fontFamily: 'inherit', cursor: 'pointer' })

type Draft = { id?: string; title: string; cover: string; raw: string; content: ReadContent }
const EMPTY: Draft = { title: '', cover: '📖', raw: '', content: { words: [], parts: [], seq: [] } }

/**
 * Area Genitore: i testi della scuola per "Leggo e capisco".
 * Il genitore incolla il testo, l'app lo divide in pezzetti, e lui aggiunge le domande
 * (tipo, domanda, risposta giusta e sbagliate, la frase dove c'è la risposta), le parole nuove e i momenti.
 */
export default function ReadTextsEditor() {
  const { t } = useT()
  const E = t.readUnd.ed
  const [list, setList] = useState<ReadTextRow[]>([])
  const [draft, setDraftState] = useState<Draft | null>(null)
  const draftRef = useRef<Draft | null>(null)
  // ogni cambio parte dall'ultima versione (non da quella del momento in cui la pagina è stata disegnata)
  const setDraft = useCallback((d: Draft | null | ((prev: Draft | null) => Draft | null)) => {
    const next = typeof d === 'function' ? d(draftRef.current) : d
    draftRef.current = next; setDraftState(next)
  }, [])
  const msgRef = useRef<HTMLDivElement>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const reload = useCallback(async () => {
    try { const r = await fetch('/api/read-texts'); if (r.ok) setList((await r.json()).items ?? []) } catch (_) {}
  }, [])
  useEffect(() => { reload() }, [reload])

  const content = draft?.content
  const setContent = (c: ReadContent) => setDraft(d => (d ? { ...d, content: c } : d))
  const setPart = (i: number, p: ReadContent['parts'][number]) => setDraft(d => (d ? { ...d, content: { ...d.content, parts: d.content.parts.map((x, j) => (j === i ? p : x)) } } : d))
  const fail = (m: string) => { setMsg(m); setTimeout(() => msgRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50) }

  const save = async () => {
    // prima si chiude il campo in cui si sta scrivendo, così anche l'ultima modifica entra nel salvataggio
    ;(document.activeElement as HTMLElement | null)?.blur?.()
    await new Promise(r => setTimeout(r, 30))
    const d = draftRef.current
    if (!d) return
    const content = d.content
    if (!d.title.trim() || !content.parts.length) { fail(E.needs); return }
    const bad = content.parts.findIndex(p => p.q && (!p.q.text.trim() || !p.q.right.trim() || !p.q.wrong.some(w => w.trim())))
    if (bad >= 0) { const q = content.parts[bad].q!; fail(!q.text.trim() ? E.noQuestion(bad + 1) : !q.right.trim() ? E.noRight(bad + 1) : E.noWrong(bad + 1)); return }
    setBusy(true)
    const body = JSON.stringify({ title: d.title, cover: d.cover, content })
    const r = await fetch(d.id ? `/api/read-texts/${d.id}` : '/api/read-texts', { method: d.id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body }).catch(() => null)
    setBusy(false)
    if (!r) { fail(E.offline); return }
    if (r.status === 401) { fail(E.sessionOver); return }
    if (!r.ok) { fail((await r.json().catch(() => ({})))?.error ?? '!'); return }
    setDraft(null); setMsg(E.saved); reload()
  }
  const remove = async (x: ReadTextRow) => {
    if (!confirm(E.confirmRemove(x.title))) return
    await fetch(`/api/read-texts/${x.id}`, { method: 'DELETE' }).catch(() => {})
    reload()
  }

  if (!draft) return (
    <div className={s.card}>
      <div className={s.h2}>{E.title}</div>
      <div className={s.sub}>{E.hint}</div>
      {msg && <div className={s.sub} style={{ color: 'var(--done)' }}>{msg}</div>}
      {list.length === 0 && <div className={s.sub}>{E.empty}</div>}
      {list.map(x => (
        <div key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--ground)', borderRadius: 16, padding: '8px 12px' }}>
          <span style={{ fontSize: 28 }}>{x.cover}</span>
          <span style={{ flex: 1, fontSize: 16, fontWeight: 800 }}>{x.title}</span>
          <button style={chip(false)} onClick={() => setDraft({ id: x.id, title: x.title, cover: x.cover, raw: '', content: x.content })} aria-label={E.edit}>{E.edit}</button>
          <button style={chip(false)} onClick={() => remove(x)} aria-label={E.remove}>{E.remove}</button>
        </div>
      ))}
      <button className={`${s.btn} ${s.main}`} onClick={() => { setMsg(''); setDraft({ ...EMPTY, content: { words: [], parts: [], seq: [] } }) }}>{E.add}</button>
    </div>
  )

  return (
    <div className={s.card}>
      {/* titolo e icona */}
      <label className={s.sub}>{E.nameLab}</label>
      <input style={input} value={draft.title} maxLength={80} placeholder={E.namePh} onChange={e => setDraft({ ...draft, title: e.target.value })} />
      <label className={s.sub}>{E.coverLab}</label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{COVERS.map(c => <button key={c} style={{ ...chip(draft.cover === c), fontSize: 22, width: 46, padding: 0 }} onClick={() => setDraft({ ...draft, cover: c })}>{c}</button>)}</div>

      {/* il testo: si incolla e si divide in pezzetti */}
      <label className={s.sub}>{E.textLab}</label>
      <textarea style={{ ...input, minHeight: 130, resize: 'vertical', lineHeight: 1.5 }} value={draft.raw} placeholder={E.textPh} onChange={e => setDraft({ ...draft, raw: e.target.value })} />
      <button className={`${s.btn} ${s.blue}`} disabled={!draft.raw.trim()} onClick={() => { if (!content) return; const had = content.parts.some(p => p.q); if (had && !confirm(E.resplitAsk)) return; setContent({ ...content, parts: splitParts(draft.raw).map((text, i) => ({ text, q: content.parts[i]?.q ? { ...content.parts[i].q!, ans: Math.min(content.parts[i].q!.ans, Math.max(0, text.length - 1)) } : null })) }) }}>{E.split}</button>

      {/* i pezzetti, ognuno con la sua domanda */}
      {content && content.parts.length > 0 && <div className={s.h2} style={{ fontSize: 18 }}>{E.partsLab}</div>}
      {content?.parts.map((p, i) => (
        <div key={i} style={{ border: '2px solid #D6DBF2', borderRadius: 18, padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <b>{E.partN(i + 1)}</b>
            <button style={chip(false)} onClick={() => setContent({ ...content, parts: content.parts.filter((_, j) => j !== i) })} aria-label={E.remove}>{E.remove}</button>
          </div>
          <textarea key={p.text.join(' ')} style={{ ...input, minHeight: 80, resize: 'vertical', lineHeight: 1.5 }} defaultValue={p.text.join(' ')} placeholder={E.partPh}
            onBlur={e => { const text = splitSentences(e.target.value); setPart(i, { text, q: p.q ? { ...p.q, ans: Math.min(p.q.ans, Math.max(0, text.length - 1)) } : null }) }} />
          {!p.q ? (
            <button style={chip(false)} onClick={() => setPart(i, { ...p, q: { t: 'chi', text: '', right: '', wrong: ['', ''], ans: 0 } })}>{E.addQ}</button>
          ) : (
            <QuestionEditor q={p.q} sentences={p.text} onChange={q => setPart(i, { ...p, q })} onRemove={() => setPart(i, { ...p, q: null })} />
          )}
        </div>
      ))}

      {/* parole nuove e momenti della storia (facoltativi) */}
      {content && content.parts.length > 0 && (
        <>
          <label className={s.sub}>{E.wordsLab}</label>
          {content.words.map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: 6 }}>
              <input style={{ ...input, flex: '0 0 34%' }} value={w[0]} placeholder={E.wordPh} maxLength={40} onChange={e => setContent({ ...content, words: content.words.map((x, j) => (j === i ? [e.target.value, x[1]] : x)) })} />
              <input style={input} value={w[1]} placeholder={E.defPh} maxLength={200} onChange={e => setContent({ ...content, words: content.words.map((x, j) => (j === i ? [x[0], e.target.value] : x)) })} />
              <button style={chip(false)} onClick={() => setContent({ ...content, words: content.words.filter((_, j) => j !== i) })} aria-label="✕">✕</button>
            </div>
          ))}
          {content.words.length < 8 && <button style={chip(false)} onClick={() => setContent({ ...content, words: [...content.words, ['', '']] })}>{E.addWord}</button>}
          <label className={s.sub}>{E.seqLab}</label>
          {[0, 1, 2, 3].map(i => (
            <input key={i} style={input} value={content.seq[i] ?? ''} placeholder={E.seqPh(i + 1)} maxLength={120}
              onChange={e => { const seq = [...content.seq]; seq[i] = e.target.value; setContent({ ...content, seq: seq.map(x => x ?? '') }) }} />
          ))}
        </>
      )}
      {msg && <div ref={msgRef} className={s.sub} style={{ color: '#C92A2A', background: '#FFF0F0', borderRadius: 12, padding: '10px 12px', fontWeight: 800 }}>⚠️ {msg}</div>}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className={`${s.btn} ${s.main}`} disabled={busy} onClick={save}>{E.save}</button>
        <button className={s.btn} onClick={() => { setDraft(null); setMsg('') }}>{E.cancel}</button>
      </div>
    </div>
  )
}

/* le risposte di una domanda come elenco { testo, giusta? }: la prima giusta resta "right", le altre giuste "more", le sbagliate "wrong" */
type Answer = { text: string; ok: boolean }
function answersOf(q: ReadQuestion): Answer[] {
  const def: Answer[] = [{ text: q.right, ok: true }, ...(q.more ?? []).map(t => ({ text: t, ok: true })), ...q.wrong.map(t => ({ text: t, ok: false }))]
  // se c'è l'ordine scritto, le risposte restano al loro posto anche quando si cambia ✅ / ❌
  if (!q.order || q.order.length !== def.length) return def
  const oks = [q.right, ...(q.more ?? [])], wr = [...q.wrong], out: Answer[] = []
  for (const t of q.order) {
    const i = oks.indexOf(t); if (i >= 0) { out.push({ text: t, ok: true }); oks.splice(i, 1); continue }
    const j = wr.indexOf(t); if (j >= 0) { out.push({ text: t, ok: false }); wr.splice(j, 1); continue }
    return def
  }
  return out
}
function fromAnswers(q: ReadQuestion, list: Answer[]): ReadQuestion {
  const oks = list.filter(a => a.ok).map(a => a.text), wr = list.filter(a => !a.ok).map(a => a.text)
  // la prima risposta giusta non vuota è quella principale (le righe vuote non contano)
  oks.sort((a, b) => Number(!a.trim()) - Number(!b.trim()))
  // l'ordine sullo schermo resta quello scritto: si salva anche la posizione di ogni risposta
  return { ...q, right: oks[0] ?? '', more: oks.slice(1), wrong: wr, order: list.map(a => a.text) }
}

/* La domanda di un pezzetto: tipo, testo, risposte e la frase con la risposta */
function QuestionEditor({ q, sentences, onChange, onRemove }: { q: ReadQuestion; sentences: string[]; onChange: (q: ReadQuestion) => void; onRemove: () => void }) {
  const { t } = useT()
  const E = t.readUnd.ed
  return (
    <div style={{ background: 'var(--ground)', borderRadius: 14, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className={s.sub}>{E.qTypeLab}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{QT.map(x => <button key={x} style={chip(q.t === x, QCOLOR[x])} onClick={() => onChange({ ...q, t: x })}>{t.readUnd.qt[x]}</button>)}</div>
      <input style={input} value={q.text} placeholder={E.qTextPh} aria-label={E.qText} maxLength={200} onChange={e => onChange({ ...q, text: e.target.value })} />
      <span className={s.sub}>{E.answersLab}</span>
      {answersOf(q).map((x, i, all) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input style={{ ...input, flex: 1 }} value={x.text} placeholder={E.answerPh} maxLength={120}
            onChange={e => onChange(fromAnswers(q, all.map((y, k) => (k === i ? { ...y, text: e.target.value } : y))))} />
          {/* un tocco cambia: giusta ↔ sbagliata */}
          <button style={{ ...chip(false), background: x.ok ? 'var(--done)' : '#FFE3E3', color: x.ok ? '#fff' : '#C92A2A', borderColor: x.ok ? 'var(--done)' : '#FFC9C9', whiteSpace: 'nowrap' }}
            aria-label={x.ok ? E.isRight : E.isWrong} onClick={() => onChange(fromAnswers(q, all.map((y, k) => (k === i ? { ...y, ok: !y.ok } : y))))}>{x.ok ? E.isRight : E.isWrong}</button>
          {all.length > 2 && <button style={chip(false)} aria-label="✕" onClick={() => onChange(fromAnswers(q, all.filter((_, k) => k !== i)))}>✕</button>}
        </div>
      ))}
      {answersOf(q).length < 10 && <button style={chip(false)} onClick={() => onChange(fromAnswers(q, [...answersOf(q), { text: '', ok: false }]))}>{E.addAnswer}</button>}
      <span className={s.sub} style={{ fontSize: 13 }}>{E.answersHint}</span>
      <span className={s.sub}>{E.ansLab}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sentences.map((x, i) => (
          <button key={i} onClick={() => onChange({ ...q, ans: i })}
            style={{ textAlign: 'left', borderRadius: 12, border: `2px solid ${q.ans === i ? '#E0A800' : '#D6DBF2'}`, background: q.ans === i ? '#FFE066' : 'var(--card)', color: q.ans === i ? '#1F2147' : 'var(--text)', padding: '8px 10px', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}>{x}</button>
        ))}
      </div>
      <button style={chip(false)} onClick={onRemove}>{E.removeQ}</button>
    </div>
  )
}
