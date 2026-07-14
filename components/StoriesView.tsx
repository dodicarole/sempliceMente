'use client'
import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useAudio } from '@/hooks/useAudio'
import { type Story } from '@/types'
import s from './StoriesView.module.css'

interface Props {
  stories: Story[]
  onBack: () => void
}

export default function StoriesView({ stories, onBack }: Props) {
  const [story, setStory]           = useState<Story | null>(null)
  const [pageIndex, setPageIndex]   = useState(0)
  const [showCelebr, setShowCelebr] = useState(false)
  const { check, celebration } = useAudio()

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
        <p className={s.pageText}>{page.text}</p>
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
            <div className={s.celebTitle}>Bravo!</div>
            <div className={s.celebSub}>Hai letto tutta la storia.</div>
            <button className={s.celebBtn} onClick={closeStory}>Fine!</button>
          </div>
        </div>
      )}
    </>
  )
}