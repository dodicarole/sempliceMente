/**
 * Le sezioni della home del bambino, in un posto solo:
 * le usa la home per mostrarle e l'area Genitore per scegliere quali vede ogni figlio.
 */
import type { Dict } from '@/lib/i18n/it'
import type { ChildGender } from '@/lib/praise'

export const SECTION_IDS = [
  'zaino', 'routine', 'agenda', 'primapoi', 'emotions', 'calma', 'timer', 'stelline', 'storie',
  'numeri', 'confronta', 'tabelline', 'scomponi', 'orologio', 'soldi', 'contrari', 'sillabe', 'doppie', 'nomi', 'english',
] as const
export type SectionId = typeof SECTION_IDS[number]

export interface HomeCard { id: SectionId; e: string; c: string; title: string; sub: string; it?: boolean }

export function homeSections(t: Dict, gender: ChildGender): { daily: HomeCard[]; learn: HomeCard[] } {
  return {
    daily: [
      { id: 'zaino', e: '🎒', c: '#6B7FE3', title: t.home.zainoTitle, sub: t.home.zainoSub },
      { id: 'routine', e: '🌅', c: '#FF8C42', title: t.home.routineTitle, sub: t.home.routineSub(gender) },
      { id: 'agenda', e: '📅', c: '#3EAB7A', title: t.home.agendaTitle, sub: t.home.agendaSub },
      { id: 'primapoi', e: '🔄', c: '#F08C00', title: t.daily.firstThenTitle, sub: t.daily.firstThenSub },
      { id: 'emotions', e: '💬', c: '#C2255C', title: t.daily.wordsTitle, sub: t.daily.wordsSub },
      { id: 'calma', e: '🌬️', c: '#2F9E44', title: t.daily.calmTitle, sub: t.daily.calmSub },
      { id: 'timer', e: '⏱️', c: '#0EA5B7', title: t.home.timerTitle, sub: t.home.timerSub },
      { id: 'stelline', e: '⭐', c: '#E8A400', title: t.daily.starsTitle, sub: t.daily.starsSub },
      { id: 'storie', e: '📖', c: '#8E6CE0', title: t.home.storiesTitle, sub: t.home.storiesSub },
    ],
    learn: [
      { id: 'numeri', e: '🔢', c: '#F59F00', title: t.home.numbersTitle, sub: t.home.numbersSub },
      { id: 'confronta', e: '🐸', c: '#2F9E44', title: t.compare.title, sub: t.compare.homeSub },
      { id: 'tabelline', e: '✖️', c: '#7048E8', title: t.home.tablesTitle, sub: t.home.tablesSub },
      { id: 'scomponi', e: '🧱', c: '#2F9E44', title: t.split.title, sub: t.split.homeSub },
      { id: 'orologio', e: '🕐', c: '#1C7ED6', title: t.daily.clockTitle, sub: t.daily.clockSub },
      { id: 'soldi', e: '💶', c: '#2F9E44', title: t.daily.moneyTitle, sub: t.daily.moneySub },
      { id: 'contrari', e: '↔️', c: '#C2255C', title: t.opposites.title, sub: t.opposites.homeSub },
      { id: 'sillabe', e: '🔤', c: '#E03131', title: 'Le sillabe', sub: 'Unisci le sillabe per leggere', it: true },
      { id: 'doppie', e: '✏️', c: '#F08C00', title: 'Le doppie', sub: 'Una lettera o due?', it: true },
      { id: 'nomi', e: '📝', c: '#7048E8', title: 'Classifica i nomi', sub: 'Persona, animale o cosa?', it: true },
      { id: 'english', e: '🇬🇧', c: '#1C3F94', title: t.english.title, sub: t.english.homeSub },
    ],
  }
}

/** Le sezioni nascoste di un figlio (salvate nelle sue impostazioni) */
export function hiddenOf(settings: unknown): SectionId[] {
  const h = (settings as { hidden?: unknown } | null)?.hidden
  return Array.isArray(h) ? (h.filter(x => (SECTION_IDS as readonly string[]).includes(x)) as SectionId[]) : []
}
