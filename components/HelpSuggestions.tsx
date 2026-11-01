'use client'
import { useState, useEffect } from 'react'
import { useT } from '@/lib/i18n'
import { useChildren } from '@/lib/children'
import { proposals, acceptProposal, snoozeProposal, type Proposal } from '@/lib/helpCoach'
import s from './HelpSuggestions.module.css'

/**
 * In cima all'area Genitore: le proposte per il figlio scelto, per esempio
 * "🎉 Carmen è pronta! … Vuoi togliere le torri?" con "Sì" e "Non ancora".
 */
export default function HelpSuggestions({ onChange }: { onChange?: () => void }) {
  const { t } = useT()
  const { active } = useChildren()
  const [list, setList] = useState<Proposal[]>([])
  const [msg, setMsg] = useState('')
  useEffect(() => { setList(proposals()) }, [active?.id])
  if (!list.length) return msg ? <div className={s.toast}>{msg}</div> : null
  const name = active?.name || '…', g = active?.gender ?? 'n'
  const refresh = () => { setList(proposals()); setMsg(t.coach.done); onChange?.() }
  return (
    <>
      {list.map(p => {
        const game = t.coach.games[p.game]
        return (
          <div key={p.game} className={`${s.card}${p.kind === 'back' ? ` ${s.back}` : ''}`} role="status">
            <div className={s.title}>{p.kind === 'ready' ? t.coach.ready(name, g) : t.coach.backTitle(t.coach.back[p.step.what])}</div>
            <div className={s.text}>
              {p.kind === 'ready' ? t.coach.readyText(game, p.wrong, p.fast, p.days, t.coach.what[p.step.what]) : t.coach.backText(name, game, p.errors)}
            </div>
            <div className={s.row}>
              <button className={`${s.btn} ${s.yes}`} onClick={() => { acceptProposal(p); refresh() }}>{p.kind === 'ready' ? t.coach.yes : t.coach.backYes}</button>
              <button className={s.btn} onClick={() => { snoozeProposal(p); setList(proposals()) }}>{p.kind === 'ready' ? t.coach.later : t.coach.backNo}</button>
            </div>
          </div>
        )
      })}
    </>
  )
}
