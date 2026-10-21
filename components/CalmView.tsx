'use client'
import { useState, useEffect, useRef } from 'react'
import { useT } from '@/lib/i18n'
import { useSpeech, hush, wait, softTone } from '@/hooks/useSpeech'
import SectionTitle from './SectionTitle'
import s from './Daily.module.css'

type Mode = 'breathe' | 'count' | 'bubbles'

/** L'angolo della calma: respiro del fiore e della candelina, conta lenta, bolle */
export default function CalmView({ onBack }: { onBack: () => void }) {
  const { t } = useT()
  const [mode, setMode] = useState<Mode>('breathe')
  const [run, setRun] = useState(0)
  const go = (m: Mode) => { hush(); setMode(m); setRun(r => r + 1) }
  return (
    <>
      <SectionTitle emoji="🌬️" title={t.daily.calmTitle} sub={t.daily.calmSub} onBack={onBack} spot="calma" />
      <section className={`${s.card} ${s.calmCard}`}>
        <div className={s.calmChoices}>
          {([['breathe', '🌸', t.calm.breathe], ['count', '🔢', t.calm.count], ['bubbles', '🫧', t.calm.bubbles]] as [Mode, string, string][]).map(([m, e, l]) => (
            <button key={m} aria-current={m === mode} onClick={() => go(m)}><span className={s.calmE}>{e}</span>{l}</button>
          ))}
        </div>
        {mode === 'breathe' ? <Breathe key={run} /> : mode === 'count' ? <Count key={run} /> : <Bubbles key={run} />}
      </section>
    </>
  )
}

/* Respiro: la palla si gonfia in 4 secondi e si sgonfia in 6, per 5 volte (l'espirazione lunga calma) */
function Breathe() {
  const { t } = useT()
  const { speak } = useSpeech()
  const [i, setI] = useState(1)
  const [phase, setPhase] = useState<'in' | 'out' | 'end'>('in')
  useEffect(() => {
    let alive = true
    ;(async () => {
      for (let k = 1; k <= 5; k++) {
        if (!alive) return
        setI(k); setPhase('in'); speak(t.calm.smellVoice, { rate: 0.75 }); await wait(4000)
        if (!alive) return
        setPhase('out'); speak(t.calm.blowVoice, { rate: 0.7 }); await wait(6000)
      }
      if (alive) { setPhase('end'); speak(`${t.calm.wellDoneVoice} ${t.calm.better}`) }
    })()
    return () => { alive = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const big = phase === 'in'
  return (
    <>
      <div className={s.breath}>
        <div className={s.ball} style={{ transform: `scale(${big ? 1.75 : 1})`, transition: `transform ${big ? 4 : 6}s ease-in-out` }}>{phase === 'in' ? '🌸' : phase === 'out' ? '🕯️' : '💚'}</div>
      </div>
      <div className={s.phase}>{phase === 'in' ? t.calm.smell : phase === 'out' ? t.calm.blow : t.calm.wellDone}</div>
      <div className={s.sub}>{phase === 'end' ? t.calm.better : t.calm.breathN(i, 5)}</div>
    </>
  )
}

/* Contare lentamente fino a 10 */
function Count() {
  const { t } = useT()
  const { speak } = useSpeech()
  const [n, setN] = useState(0)
  useEffect(() => {
    let alive = true
    ;(async () => {
      for (let k = 1; k <= 10; k++) { if (!alive) return; setN(k); speak(String(k), { rate: 0.7 }); await wait(1600) }
      if (alive) { setN(11); speak(t.calm.wellDoneVoice) }
    })()
    return () => { alive = false }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div key={n} className={s.count}>{n > 0 && n <= 10 ? n : n > 10 ? '💚' : ''}</div>
      <div className={s.sub}>{n > 10 ? t.calm.countAgain : t.calm.countSub}</div>
    </>
  )
}

/* Bolle lente da far scoppiare: niente punteggi né tempo */
function Bubbles() {
  const { t } = useT()
  const pond = useRef<HTMLDivElement>(null)
  const [popped, setPopped] = useState(0)
  useEffect(() => {
    let alive = true
    let timer = 0
    const spawn = () => {
      const p = pond.current
      if (!alive || !p) return
      const size = 50 + Math.random() * 60
      const b = document.createElement('button')
      b.className = s.bubble
      b.setAttribute('aria-label', '🫧')
      b.style.width = b.style.height = `${size}px`
      b.style.left = `${Math.random() * Math.max(0, p.clientWidth - size)}px`
      b.style.animationDuration = `${7 + Math.random() * 5}s`
      b.onclick = ev => {
        const r = p.getBoundingClientRect()
        const fx = document.createElement('span')
        fx.className = s.popFx; fx.textContent = '✨'
        fx.style.left = `${ev.clientX - r.left - 12}px`; fx.style.top = `${ev.clientY - r.top - 12}px`
        p.appendChild(fx); setTimeout(() => fx.remove(), 500)
        b.remove(); setPopped(x => x + 1); softTone(700 + Math.random() * 300, 1200, 0.18, 0.05)
      }
      b.addEventListener('animationend', () => b.remove())
      p.appendChild(b)
      timer = window.setTimeout(spawn, 900 + Math.random() * 700)
    }
    spawn()
    return () => { alive = false; clearTimeout(timer) }
  }, [])
  return (
    <>
      <div ref={pond} className={s.pond} />
      <div className={s.sub}>{popped ? t.calm.popped(popped) : t.calm.bubblesSub}</div>
    </>
  )
}
