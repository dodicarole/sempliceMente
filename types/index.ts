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

// Parole (italiano e francese) → immagine dello zaino. Si confronta senza accenti e senza maiuscole,
// e le parole più precise vengono prima ("crayons de couleur" prima di "crayon").
const ZAINO_KEYWORDS: [string[], string][] = [
  [['scarpe', 'scarpa', 'scarpette', 'chaussure', 'basket', 'tennis'], '👟'],
  [['stivali', 'bottes'], '👢'],
  [['ciabatte', 'pantofole', 'chausson'], '🩴'],
  [['calze', 'calzini', 'chaussette'], '🧦'],
  [['tuta', 'jogging', 'survetement'], '🎽'],
  [['maglietta', 'maglia', 't shirt', 'tee shirt'], '👕'],
  [['felpa', 'maglione', 'pull', 'sweat', 'giacca', 'giubbotto', 'giubbino', 'cappotto', 'giaccone', 'k way', 'manteau', 'veste', 'blouson'], '🧥'],
  [['pantaloncini', 'pantaloni', 'pantalon', 'short'], '👖'],
  [['grembiule', 'grembiulino', 'tablier', 'blouse'], '🥼'],
  [['occhialini', 'lunettes de piscine'], '🥽'],
  [['costume', 'maillot'], '🩱'],
  [['asciugamano', 'accappatoio', 'serviette'], '🛁'],
  [['cappello', 'cappellino', 'berretto', 'cuffia', 'casquette', 'bonnet', 'chapeau'], '🧢'],
  [['sciarpa', 'echarpe'], '🧣'],
  [['guanti', 'gants'], '🧤'],
  [['ombrello', 'parapluie'], '☂️'],
  [['flauto', 'flute'], '🪈'],
  [['occhiali', 'lunettes'], '👓'],
  [['chiavi', 'chiave', 'cles', 'clef'], '🔑'],
  [['telefono', 'cellulare', 'tablet', 'telephone', 'portable', 'tablette'], '📱'],
  [['fazzolett', 'mouchoir'], '🤧'],
  [['spazzolino', 'dentifricio', 'brosse a dent', 'dentifrice'], '🪥'],
  [['sapone', 'gel', 'disinfettante', 'savon'], '🧴'],
  [['mascherina', 'masque'], '😷'],
  [['astucc', 'trousse'], '✏️'],
  [['gomma', 'gomme'], '✏️'],
  [['temperino', 'temperamatite', 'taille crayon'], '✏️'],
  [['colla', 'colle'], '🧴'],
  [['pastell', 'colori', 'pennarell', 'crayons de couleur', 'crayon de couleur', 'feutre', 'cere'], '🖍️'],
  [['matit', 'crayon'], '✏️'],
  [['penna', 'biro', 'stylo'], '🖊️'],
  [['pennell', 'pinceau', 'tempere', 'acquerell', 'peinture'], '🖌️'],
  [['righell', 'riga', 'regle'], '📏'],
  [['squadra', 'compasso', 'goniometro', 'equerre', 'compas', 'rapporteur'], '📐'],
  [['forbic', 'ciseaux'], '✂️'],
  [['calcolatrice', 'calculatrice'], '🧮'],
  [['dizionario', 'dictionnaire'], '📕'],
  [['cartellina', 'cartelletta', 'raccoglitore', 'classificatore', 'classeur', 'pochette', 'chemise'], '📁'],
  [['quadern', 'cahier', 'diario', 'blocco', 'album'], '📓'],
  [['agenda'], '📆'],
  [['libr', 'testo', 'lettura', 'livre', 'manuel'], '📚'],
  [['merenda', 'panino', 'snack', 'gouter', 'biscott', 'cracker', 'tramezzino'], '🥪'],
  [['frutt', 'mela', 'banana', 'pomme', 'banane'], '🍎'],
  [['succo', 'jus'], '🧃'],
  [['acqua', 'borraccia', 'bottiglia', 'gourde', 'bouteille'], '💧'],
  [['pallone', 'palla', 'ballon'], '⚽'],
  [['zaino', 'borsa', 'cartella', 'sacca', 'cartable', 'sac'], '🎒'],
  [['soldi', 'monete', 'portafoglio', 'argent', 'porte monnaie'], '💶'],
  [['biglietto', 'abbonamento', 'tessera', 'ticket'], '🎫'],
]

/** Il nome senza accenti, maiuscole, apostrofi e trattini, per riconoscerlo meglio */
export function normalizeName(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/['’\-]/g, ' ')
}

export function pickZainoIcon(name: string): string {
  const n = normalizeName(name)
  for (const [keywords, icon] of ZAINO_KEYWORDS) {
    if (keywords.some(k => n.includes(k))) return icon
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