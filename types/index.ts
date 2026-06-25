export interface BaseItem {
  id: string
  name: string
  icon: string
  photo_url: string | null
  sort_order: number
}

export interface ScheduleItem extends BaseItem {
  day_of_week: number   // 0 = Lunedì … 4 = Venerdì
}

export interface RoutineItem extends BaseItem {}

export const DAY_NAMES  = ['LUNEDÌ', 'MARTEDÌ', 'MERCOLEDÌ', 'GIOVEDÌ', 'VENERDÌ']
export const DAY_SHORTS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven']
export const DAY_COLORS = ['#6B7FE3', '#E07090', '#3EAB7A', '#D4902A', '#9167D8']
export interface AgendaItem extends BaseItem {
  day_of_week: number
  time_start: string   // "HH:MM"
}

export const FALLBACK_ICONS  = ['📚','📓','📏','🎨','🔬','📝','🥪','💧','✂️','🖍️']
export const ROUTINE_ICONS   = ['⏰','🚿','👕','🥣','🦷','👟','🎒','🧴','💊','🌟']
export const AGENDA_ICONS    = ['🏫','📚','🎨','⚽','🎵','🍽️','😴','🛁','📺','🎮']

const ROUTINE_KEYWORDS: [string[], string][] = [
  [['sveglia','svegliati','alzati','aufwachen'],            '⏰'],
  [['doccia','bagno','lavarsi','lava'],                     '🚿'],
  [['vestiti','vestirsi','abiti','abbigliamento','camicia','maglietta','pantaloni'], '👕'],
  [['colazione','mangiare','cibo','latte','cereali','pane','pranzo'], '🥣'],
  [['denti','dentista','spazzolino','bocca'],               '🦷'],
  [['scarpe','calze','calzini','stivali'],                  '👟'],
  [['zaino','borsa','cartella'],                            '🎒'],
  [['crema','lozione','deodorante','profumo','sole'],       '🧴'],
  [['medicina','pillola','farmaco','sciroppo'],             '💊'],
  [['capelli','pettinarsi','pettine','spazzola'],           '💇'],
  [['mani','igiene'],                                       '🙌'],
  [['toilette','bagno','pipi','bisogno'],                   '🚽'],
  [['occhiali'],                                            '👓'],
  [['gioco','giocare','tablet','computer'],                 '🎮'],
  [['libro','leggere','lettura'],                           '📖'],
  [['musica','cuffie'],                                     '🎵'],
]

export function pickRoutineIcon(name: string, fallbackIndex: number): string {
  const lower = name.toLowerCase()
  for (const [keywords, icon] of ROUTINE_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return icon
  }
  return ROUTINE_ICONS[fallbackIndex % ROUTINE_ICONS.length]
}