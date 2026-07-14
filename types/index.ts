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

export interface EmotionItem {
  id: string
  key: string
  name: string
  icon: string
  photo_url: string | null
  sort_order: number
}

export const DEFAULT_EMOTIONS: { key: string; name: string; icon: string }[] = [
  { key: 'felice',     name: 'Felice',     icon: '😄' },
  { key: 'triste',     name: 'Triste',     icon: '😢' },
  { key: 'arrabbiato', name: 'Arrabbiato', icon: '😠' },
  { key: 'spaventato', name: 'Spaventato', icon: '😨' },
  { key: 'stanco',     name: 'Stanco',     icon: '😴' },
  { key: 'annoiato',   name: 'Annoiato',   icon: '😐' },
]

export const EMOTION_MESSAGES: Record<string, string> = {
  felice:     'Che bello essere felici! 🌟',
  triste:     'Va bene sentirsi tristi. Un abbraccio aiuta 🤗',
  arrabbiato: 'Respira piano piano. Passerà 🌬️',
  spaventato: 'Sei al sicuro. Sono qui con te 💙',
  stanco:     'Un po\' di riposo ti farà bene 😴',
  annoiato:   'Possiamo trovare qualcosa da fare insieme 🎨',
}

export interface Story {
  id: string
  title: string
  icon: string
  sort_order: number
  pages: StoryPage[]
}

export interface StoryPage {
  id: string
  story_id: string
  text: string
  icon: string
  photo_url: string | null
  sort_order: number
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

export function pickRoutineIcon(name: string): string {
  const lower = name.toLowerCase()
  for (const [keywords, icon] of ROUTINE_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return icon
  }
  return ''
}

const ZAINO_KEYWORDS: [string[], string][] = [
  [['quaderno','diario','blocco'],          '📓'],
  [['libro','testo','lettura'],             '📚'],
  [['astuccio','matita','penna','biro'],    '🖊️'],
  [['righello','riga'],                     '📏'],
  [['forbici','forbice'],                   '✂️'],
  [['colla'],                               '🖍️'],
  [['colori','pennarelli','pastelli'],       '🎨'],
  [['compasso','goniometro'],               '📐'],
  [['merenda','panino','frutto','snack'],   '🥪'],
  [['acqua','borraccia'],                   '💧'],
  [['zaino','borsa','cartella'],            '🎒'],
  [['calcolatrice'],                        '🧮'],
  [['agenda','diario'],                     '📆'],
]

export function pickZainoIcon(name: string): string {
  const lower = name.toLowerCase()
  for (const [keywords, icon] of ZAINO_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return icon
  }
  return ''
}

const AGENDA_KEYWORDS: [string[], string][] = [
  [['italiano','scrittura','lettura'],         '📝'],
  [['matematica','matematiche','calcolo'],      '🔢'],
  [['scienze','laboratorio','esperimento'],     '🔬'],
  [['storia','geografia'],                      '🌍'],
  [['arte','disegno'],                          '🎨'],
  [['musica','canto','strumento'],              '🎵'],
  [['ginnastica','sport','palestra','motoria'], '⚽'],
  [['inglese','francese','tedesco','lingua'],   '🌐'],
  [['informatica','computer'],                  '💻'],
  [['ricreazione','pausa','intervallo'],        '😊'],
  [['mensa','pranzo','mangiare'],               '🍽️'],
  [['casa','scuola','uscita','rientro'],        '🏠'],
]

export function pickAgendaIcon(name: string): string {
  const lower = name.toLowerCase()
  for (const [keywords, icon] of AGENDA_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return icon
  }
  return ''
}

const STORY_KEYWORDS: [string[], string][] = [
  [['dentista','denti'],                                  '🦷'],
  [['dottore','medico','visita','ospedale','vaccino'],    '🩺'],
  [['scuola','maestra','classe','compagni'],              '🏫'],
  [['autobus','pullman','treno','viaggio','macchina'],    '🚌'],
  [['aereo','volare','aeroporto'],                        '✈️'],
  [['barbiere','parrucchiere','capelli','taglio'],        '💇'],
  [['piscina','nuotare','mare','spiaggia'],               '🏊'],
  [['festa','compleanno','regalo'],                       '🎉'],
  [['amico','amici','giocare','parco'],                   '🤝'],
  [['dormire','notte','letto','nanna'],                   '🌙'],
  [['supermercato','spesa','negozio'],                    '🛒'],
  [['ristorante','pizzeria','mangiare fuori'],            '🍕'],
  [['nonni','nonna','nonno','famiglia'],                  '👵'],
  [['rumore','rumori','forte','confusione'],              '🎧'],
  [['aspettare','attesa','fila','pazienza'],              '⏳'],
  [['arrabbiat','calma','respir'],                        '🌬️'],
]

export function pickStoryIcon(title: string): string {
  const lower = title.toLowerCase()
  for (const [keywords, icon] of STORY_KEYWORDS) {
    if (keywords.some(k => lower.includes(k))) return icon
  }
  return '📖'
}