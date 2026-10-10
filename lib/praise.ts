/** Frasi di incoraggiamento usate in tutta l'app al posto del solo "Bravo!" */

export type ChildGender = 'm' | 'f' | 'n'   // bambino, bambina, non specificato

const NEUTRAL = [
  'Fantastico!',
  'Sei forte!',
  'Super!',
  'Grande!',
  'Evviva!',
  'Perfetto!',
  'Ottimo lavoro!',
  "Ce l'hai fatta!",
  'Che bravura!',
]
const MALE   = ['Bravo!', 'Bravissimo!', 'Sei un campione!']
const FEMALE = ['Brava!', 'Bravissima!', 'Sei una campionessa!']

const GENDER_KEY = 'bambino_genere'
const NAME_KEY   = 'bambino_nome'

export function loadChildGender(): ChildGender {
  try {
    const g = localStorage.getItem(GENDER_KEY)
    if (g === 'm' || g === 'f' || g === 'n') return g
  } catch (_) {}
  return 'n'
}

export function saveChildGender(gender: ChildGender) {
  try { localStorage.setItem(GENDER_KEY, gender) } catch (_) {}
}

export function loadChildName(): string {
  try { return (localStorage.getItem(NAME_KEY) || '').trim() } catch (_) { return '' }
}

export function saveChildName(name: string) {
  try {
    const clean = name.trim().slice(0, 20)
    if (clean) localStorage.setItem(NAME_KEY, clean)
    else localStorage.removeItem(NAME_KEY)
  } catch (_) {}
}

/** Tutte le frasi adatte: con "non specificato" solo quelle neutre */
export function praisesFor(gender: ChildGender): string[] {
  if (gender === 'm') return [...NEUTRAL, ...MALE]
  if (gender === 'f') return [...NEUTRAL, ...FEMALE]
  return NEUTRAL
}

let last = ''

/**
 * Sceglie una frase a caso, adatta al bambino o alla bambina, mai uguale a quella appena usata.
 * Se c'è il nome, più o meno una volta su due lo aggiunge: "Bravo, Christopher!"
 */
export function randomPraise(): string {
  const list = praisesFor(loadChildGender())
  let p = last
  while (p === last) p = list[Math.floor(Math.random() * list.length)]
  last = p
  const name = loadChildName()
  if (name && Math.random() < 0.5) return `${p.replace(/!$/, '')}, ${name}!`
  return p
}
