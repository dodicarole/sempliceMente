'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { usePraise } from '@/hooks/usePraise'
import Image from 'next/image'
import { useAudio } from '@/hooks/useAudio'
import { type Story } from '@/types'
import { loadReadingSettings } from '@/lib/readingSettings'
import s from './StoriesView.module.css'

interface Props {
  stories: Story[]
  onBack: () => void
}

export default function StoriesView({ stories, onBack }: Props) {
  const [story, setStory]           = useState<Story | null>(null)
  const [pageIndex, setPageIndex]   = useState(0)
  const [showCelebr, setShowCelebr] = useState(false)
  const praise = usePraise(showCelebr)
  const { check, celebration } = useAudio()

  // ── Lettura ad alta voce (sintesi vocale del browser) ─────────────────────
  const [canSpeak, setCanSpeak] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [wordAt,   setWordAt]   = useState(-1)     // posizione (carattere) della parola letta in questo momento
  const [autoRead, setAutoRead] = useState(false)

  useEffect(() => {
    setCanSpeak(typeof window !== 'undefined' && 'speechSynthesis' in window)
    setAutoRead(loadReadingSettings().autoRead)
  }, [])

  // Riferimento alla frase in lettura: alcuni browser smettono di mandare gli eventi
  // se l'oggetto viene eliminato dalla memoria, quindi lo teniamo da parte
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null)
  const timers = useRef<number[]>([])
  const clearTimers = () => { timers.current.forEach(t => window.clearTimeout(t)); timers.current = [] }
  const stopped = useRef(false)   // true se la lettura è stata interrotta (non va usata per regolare la velocità)

  // Velocità della voce di questo dispositivo, imparata misurando le letture precedenti
  const SPEED_KEY = 'voce_velocita'
  const loadSpeed = () => {
    try { const v = parseFloat(localStorage.getItem(SPEED_KEY) || ''); if (v > 0.3 && v < 2.5) return v } catch (_) {}
    return 0.7
  }
  const saveSpeed = (v: number) => { try { localStorage.setItem(SPEED_KEY, String(v)) } catch (_) {} }

  const stopSpeaking = useCallback(() => {
    stopped.current = true
    if (typeof window !== 'undefined') clearTimers()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
    setWordAt(-1)
  }, [])

  const startSpeaking = useCallback((text: string) => {
    if (!canSpeak || !text.trim()) return
    const synth = window.speechSynthesis
    synth.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = 'it-IT'
    utt.rate = 0.9
    const voice = synth.getVoices().find(v => v.lang.toLowerCase().startsWith('it'))
    if (voice) utt.voice = voice
    clearTimers()
    stopped.current = false
    let gotWord = false   // il browser ci dice da solo quale parola sta leggendo?
    let started = false
    let startedAt = 0
    let estimated = 0     // durata stimata (prima della regolazione)

    // 1) Se il browser lo supporta, illumina la parola esatta che la voce sta leggendo
    utt.onboundary = e => {
      if (e.name !== 'word') return
      if (!gotWord) { gotWord = true; clearTimers() }
      setWordAt(e.charIndex)
    }

    // 2) Altrimenti (succede con molte voci di Android) stima il tempo di ogni parola
    const startEstimate = () => {
      if (started) return
      started = true
      startedAt = Date.now()
      const rate  = utt.rate || 1
      const speed = loadSpeed()   // < 1 = voce più veloce della stima di base
      const re = /\S+/g
      let m: RegExpExecArray | null
      let t = 0
      while ((m = re.exec(text))) {
        const start = m.index
        const word  = m[0]
        timers.current.push(window.setTimeout(() => { if (!gotWord) setWordAt(start) }, t * speed))
        const letters = word.replace(/[^\p{L}\p{N}]/gu, '').length
        t += (120 + letters * 60) / rate
        if (/[.!?]$/.test(word)) t += 380
        else if (/[,;:]$/.test(word)) t += 220
      }
      estimated = t
    }
    utt.onstart = startEstimate
    timers.current.push(window.setTimeout(startEstimate, 700)) // se "onstart" non arriva

    const finish = () => { clearTimers(); setSpeaking(false); setWordAt(-1) }
    utt.onend = () => {
      // Lettura arrivata in fondo senza aiuto dal browser: confrontiamo la durata vera
      // con la stima e regoliamo la velocità per le prossime volte
      if (!gotWord && started && !stopped.current && estimated > 0) {
        const real = Date.now() - startedAt
        const ratio = real / estimated
        if (ratio > 0.3 && ratio < 2.5) saveSpeed(loadSpeed() * 0.2 + ratio * 0.95 * 0.8) // un filo in anticipo sulla voce
      }
      finish()
    }
    utt.onerror = finish
    uttRef.current = utt
    setSpeaking(true)
    synth.speak(utt)
  }, [canSpeak])

  const speak = useCallback((text: string) => {
    if (speaking) { stopSpeaking(); return }
    startSpeaking(text)
  }, [speaking, stopSpeaking, startSpeaking])

  // Interrompe la voce quando si cambia pagina, si chiude la storia o si esce
  useEffect(() => { stopSpeaking() }, [story, pageIndex, stopSpeaking])

  // Lettura automatica di ogni pagina, se attivata nell'area Genitore
  useEffect(() => {
    if (!autoRead || !story || showCelebr) return
    const text = story.pages[pageIndex]?.text ?? ''
    const t = setTimeout(() => startSpeaking(text), 500)
    return () => clearTimeout(t)
  }, [autoRead, story, pageIndex, showCelebr, startSpeaking])
  useEffect(() => () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  const openStory = useCallback((st: Story) => {
    check()
    setStory(st)
    setPageIndex(0)
  }, [check])

  const closeStory = useCallback(() => {
    setStory(null)
    setPageIndex(0)
    setShowCelebr(false)
  }, [])

  const goNext = useCallback(() => {
    if (!story) return
    if (pageIndex < story.pages.length - 1) {
      check()
      setPageIndex(i => i + 1)
    } else {
      celebration()
      setShowCelebr(true)
    }
  }, [story, pageIndex, check, celebration])

  const goPrev = useCallback(() => {
    if (pageIndex > 0) {
      check()
      setPageIndex(i => i - 1)
    }
  }, [pageIndex, check])

  // ── Lista storie ──────────────────────────────────────────────────────────
  if (!story) {
    return (
      <>
        <button className={s.back} onClick={onBack}>← Indietro</button>

        <div className={s.banner}>
          <span className={s.bannerEmoji}>📖</span>
          <div>
            <div className={s.bannerTitle}>Le mie storie</div>
            <div className={s.bannerSub}>Scegli una storia da leggere</div>
          </div>
        </div>

        {stories.length === 0 ? (
          <div className={s.empty}>
            <span className={s.emptyEmoji}>📚</span>
            <div className={s.emptyText}>Non ci sono ancora storie.<br />Chiedi a mamma o papà di crearne una!</div>
          </div>
        ) : (
          <div className={s.list}>
            {stories.filter(st => st.pages.length > 0).map(st => (
              <button key={st.id} className={s.storyCard} onClick={() => openStory(st)}>
                <span className={s.storyIcon}>{st.icon}</span>
                <span className={s.storyInfo}>
                  <span className={s.storyTitle}>{st.title}</span>
                  <span className={s.storyPages}>{st.pages.length} {st.pages.length === 1 ? 'pagina' : 'pagine'}</span>
                </span>
                <span className={s.storyArrow}>›</span>
              </button>
            ))}
          </div>
        )}
      </>
    )
  }

  // ── Lettura ───────────────────────────────────────────────────────────────
  const page   = story.pages[pageIndex]
  const isLast = pageIndex === story.pages.length - 1

  return (
    <>
      <button className={s.back} onClick={closeStory}>← Le storie</button>

      <div className={s.readerHeader}>
        <span className={s.readerIcon}>{story.icon}</span>
        <span className={s.readerTitle}>{story.title}</span>
      </div>

      <div className={s.dots}>
        {story.pages.map((p, i) => (
          <div key={p.id} className={`${s.dot}${i === pageIndex ? ` ${s.dotOn}` : ''}${i < pageIndex ? ` ${s.dotDone}` : ''}`} />
        ))}
      </div>

      <div key={page.id} className={s.pageCard}>
        <div className={s.pageMedia}>
          {page.photo_url ? (
            <Image src={page.photo_url} alt="" width={280} height={200} className={s.pagePhoto} />
          ) : (
            <span className={s.pageEmoji}>{page.icon || story.icon}</span>
          )}
        </div>
        <p className={s.pageText}>
          {(() => {
            // Divide il testo in parole, ricordando dove inizia ognuna
            let pos = 0
            return page.text.split(/(\s+)/).map((part, i) => {
              const start = pos
              pos += part.length
              if (!part.trim()) return part
              const on = speaking && wordAt >= start && wordAt < start + part.length
              return <span key={i} className={on ? s.wordOn : undefined}>{part}</span>
            })
          })()}
        </p>
        {canSpeak && page.text.trim() && (
          <button
            className={`${s.speakBtn}${speaking ? ` ${s.speakOn}` : ''}`}
            onClick={() => speak(page.text)}
            aria-label={speaking ? 'Ferma la lettura' : 'Leggi ad alta voce'}
          >
            {speaking ? '⏹ Ferma' : '🔊 Ascolta'}
          </button>
        )}
      </div>

      <div className={s.navRow}>
        <button className={s.navBtn} onClick={goPrev} disabled={pageIndex === 0}>←</button>
        <span className={s.navLabel}>{pageIndex + 1} di {story.pages.length}</span>
        <button className={`${s.navBtn} ${s.navNext}`} onClick={goNext}>
          {isLast ? '✓' : '→'}
        </button>
      </div>

      {showCelebr && (
        <div className={s.overlay} onClick={closeStory}>
          <div className={s.celebCard} onClick={e => e.stopPropagation()}>
            <div className={s.celebEmoji}>🌟</div>
            <div className={s.celebTitle}>{praise}</div>
            <div className={s.celebSub}>Hai letto tutta la storia.</div>
            <button className={s.celebBtn} onClick={closeStory}>Fine!</button>
          </div>
        </div>
      )}
    </>
  )
}
