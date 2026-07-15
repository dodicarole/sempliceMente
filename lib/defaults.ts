// Contenuti di default: usati sia dalla modalità demo sia per popolare
// l'account di una nuova famiglia (vedi lib/seedDefaults.ts).

export interface DefaultItem {
  name: string
  icon: string
  sort_order: number
}

export const DEFAULT_SCHEDULE: (DefaultItem & { day_of_week: number })[] = [
  { name: 'Italiano',    icon: '📚', sort_order: 0, day_of_week: 0 },
  { name: 'Matematica',  icon: '📓', sort_order: 1, day_of_week: 0 },
  { name: 'Arte',        icon: '🎨', sort_order: 2, day_of_week: 0 },
  { name: 'Borraccia',   icon: '💧', sort_order: 3, day_of_week: 0 },
  { name: 'Merenda',     icon: '🥪', sort_order: 4, day_of_week: 0 },
  { name: 'Scienze',     icon: '🔬', sort_order: 0, day_of_week: 1 },
  { name: 'Geometria',   icon: '📏', sort_order: 1, day_of_week: 1 },
  { name: 'Musica',      icon: '🎵', sort_order: 2, day_of_week: 1 },
  { name: 'Borraccia',   icon: '💧', sort_order: 3, day_of_week: 1 },
  { name: 'Italiano',    icon: '📚', sort_order: 0, day_of_week: 2 },
  { name: 'Storia',      icon: '📝', sort_order: 1, day_of_week: 2 },
  { name: 'Ginnastica',  icon: '⚽', sort_order: 2, day_of_week: 2 },
  { name: 'Borraccia',   icon: '💧', sort_order: 3, day_of_week: 2 },
  { name: 'Matematica',  icon: '📓', sort_order: 0, day_of_week: 3 },
  { name: 'Inglese',     icon: '🌍', sort_order: 1, day_of_week: 3 },
  { name: 'Pennelli',    icon: '🖍️', sort_order: 2, day_of_week: 3 },
  { name: 'Italiano',    icon: '📚', sort_order: 0, day_of_week: 4 },
  { name: 'Scienze',     icon: '🔬', sort_order: 1, day_of_week: 4 },
  { name: 'Borraccia',   icon: '💧', sort_order: 2, day_of_week: 4 },
]

export const DEFAULT_ROUTINE: DefaultItem[] = [
  { name: 'Svegliati',       icon: '⏰', sort_order: 0 },
  { name: 'Fai la doccia',   icon: '🚿', sort_order: 1 },
  { name: 'Vestiti',         icon: '👕', sort_order: 2 },
  { name: 'Fai colazione',   icon: '🥣', sort_order: 3 },
  { name: 'Lavati i denti',  icon: '🦷', sort_order: 4 },
  { name: 'Prendi lo zaino', icon: '🎒', sort_order: 5 },
]

export const DEFAULT_AGENDA: (DefaultItem & { day_of_week: number; time_start: string })[] = [
  { name: 'Italiano',     icon: '🏫', sort_order: 0, day_of_week: 0, time_start: '08:00:00' },
  { name: 'Matematica',   icon: '📚', sort_order: 1, day_of_week: 0, time_start: '09:00:00' },
  { name: 'Intervallo',   icon: '⚽', sort_order: 2, day_of_week: 0, time_start: '10:30:00' },
  { name: 'Arte',         icon: '🎨', sort_order: 3, day_of_week: 0, time_start: '11:00:00' },
  { name: 'Pranzo',       icon: '🍽️', sort_order: 4, day_of_week: 0, time_start: '12:30:00' },
  { name: 'Musica',       icon: '🎵', sort_order: 5, day_of_week: 0, time_start: '14:00:00' },
  { name: 'Torna a casa', icon: '🏠', sort_order: 6, day_of_week: 0, time_start: '16:00:00' },
  { name: 'Scienze',      icon: '🔬', sort_order: 0, day_of_week: 1, time_start: '08:00:00' },
  { name: 'Inglese',      icon: '🌍', sort_order: 1, day_of_week: 1, time_start: '09:00:00' },
  { name: 'Ginnastica',   icon: '⚽', sort_order: 2, day_of_week: 1, time_start: '11:00:00' },
  { name: 'Pranzo',       icon: '🍽️', sort_order: 3, day_of_week: 1, time_start: '12:30:00' },
  { name: 'Italiano',     icon: '🏫', sort_order: 0, day_of_week: 2, time_start: '08:00:00' },
  { name: 'Storia',       icon: '📝', sort_order: 1, day_of_week: 2, time_start: '10:00:00' },
  { name: 'Pranzo',       icon: '🍽️', sort_order: 2, day_of_week: 2, time_start: '12:30:00' },
  { name: 'Matematica',   icon: '📓', sort_order: 0, day_of_week: 3, time_start: '08:00:00' },
  { name: 'Arte',         icon: '🎨', sort_order: 1, day_of_week: 3, time_start: '10:00:00' },
  { name: 'Pranzo',       icon: '🍽️', sort_order: 2, day_of_week: 3, time_start: '12:30:00' },
  { name: 'Italiano',     icon: '🏫', sort_order: 0, day_of_week: 4, time_start: '08:00:00' },
  { name: 'Scienze',      icon: '🔬', sort_order: 1, day_of_week: 4, time_start: '10:00:00' },
  { name: 'Pranzo',       icon: '🍽️', sort_order: 2, day_of_week: 4, time_start: '12:30:00' },
]

export interface DefaultStory {
  title: string
  icon: string
  sort_order: number
  pages: { text: string; icon: string; sort_order: number }[]
}

export const DEFAULT_STORIES: DefaultStory[] = [
  {
    title: 'Andiamo dal dentista', icon: '🦷', sort_order: 0,
    pages: [
      { text: 'Oggi vado dal dentista con la mamma.',                             icon: '🚗', sort_order: 0 },
      { text: 'In sala d\'attesa aspetto il mio turno. Posso guardare un libro.', icon: '⏳', sort_order: 1 },
      { text: 'Il dentista è gentile. Mi siedo sulla poltrona grande.',           icon: '🪑', sort_order: 2 },
      { text: 'Apro la bocca e il dentista guarda i miei denti. Non fa male.',    icon: '🦷', sort_order: 3 },
      { text: 'Ho finito! Sono stato bravissimo. Torniamo a casa.',               icon: '🌟', sort_order: 4 },
    ],
  },
  {
    title: 'Un giorno di pioggia', icon: '🌧️', sort_order: 1,
    pages: [
      { text: 'Oggi piove. Non posso andare al parco.',                        icon: '🌧️', sort_order: 0 },
      { text: 'Va bene: posso giocare in casa. I programmi a volte cambiano.', icon: '🏠', sort_order: 1 },
      { text: 'Quando torna il sole, andrò di nuovo al parco.',                icon: '🌈', sort_order: 2 },
    ],
  },
]