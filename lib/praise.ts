/** Frasi di incoraggiamento usate in tutta l'app al posto del solo "Bravo!" */

export type ChildGender = 'm' | 'f' | 'n'   // bambino, bambina, non specificato

type PraiseLang = 'it' | 'fr'
const nb = '\u00a0' // spazio indivisibile prima di ! in francese

const LISTS: Record<PraiseLang, { neutral: string[]; m: string[]; f: string[] }> = {
  it: {
    neutral: ['Fantastico!', 'Sei forte!', 'Super!', 'Grande!', 'Evviva!', 'Perfetto!', 'Ottimo lavoro!', "Ce l'hai fatta!", 'Che bravura!'],
    m: ['Bravo!', 'Bravissimo!', 'Sei un campione!'],
    f: ['Brava!', 'Bravissima!', 'Sei una campionessa!'],
  },
  fr: {
    neutral: [`Bravo${nb}!`, `Génial${nb}!`, `Super${nb}!`, `Youpi${nb}!`, `Parfait${nb}!`, `Excellent${nb}!`, `Bien joué${nb}!`, `Tu as réussi${nb}!`, `Quel talent${nb}!`],
    m: [`Tu es fort${nb}!`, `Tu es un champion${nb}!`],
    f: [`Tu es forte${nb}!`, `Tu es une championne${nb}!`],
  },
}

/** Lingua scelta nell'app (vedi lib/i18n) */
function currentLang(): PraiseLang {
  try { const l = localStorage.getItem('lingua'); if (l === 'fr' || l === 'it') return l } catch (_) {}
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('fr')) return 'fr'
  return 'it'
}

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
export function praisesFor(gender: ChildGender, lang: PraiseLang = currentLang()): string[] {
  const l = LISTS[lang]
  if (gender === 'm') return [...l.neutral, ...l.m]
  if (gender === 'f') return [...l.neutral, ...l.f]
  return l.neutral
}

let last = ''

/**
 * Sceglie una frase a caso, adatta al bambino o alla bambina, mai uguale a quella appena usata.
 * Se c'è il nome, più o meno una volta su due lo aggiunge: "Bravo, Christopher!"
 */
/**
 * Aggiunge il nome del bambino prima del primo punto esclamativo:
 * "Tedo balla per te! 💃" → "Tedo balla per te, Christopher! 💃", "Well done!" → "Well done, Christopher!".
 * Se il nome non c'è, la frase resta com'è. `lang` decide lo spazio prima di "!" (in francese sì).
 */
export function withChildName(phrase: string, lang: PraiseLang | 'en' = currentLang()): string {
  const name = loadChildName()
  if (!name || !phrase.includes('!')) return phrase
  return phrase.replace(/\s?!/, `, ${name}${lang === 'fr' ? nb : ''}!`)
}

export function randomPraise(): string {
  const lang = currentLang()
  const list = praisesFor(loadChildGender(), lang)
  let p = last
  while (p === last) p = list[Math.floor(Math.random() * list.length)]
  last = p
  const name = loadChildName()
  if (name && Math.random() < 0.5) return `${p.replace(/\s?!$/, '')}, ${name}${lang === 'fr' ? nb : ''}!`
  return p
}
