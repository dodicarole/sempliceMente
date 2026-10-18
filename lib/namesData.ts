/**
 * "Classifica i nomi": parole e regole della grammatica italiana.
 * L'attività è pensata per l'italiano, quindi testi e parole sono qui e non nei dizionari.
 */

export type Cat = 'persona' | 'animale' | 'cosa'
export interface Word { w: string; e: string; c: Cat; g: 'm' | 'f'; n: 's' | 'p'; pr?: boolean }

export const WORDS: Word[] = [
  // persone
  { w: 'mamma', e: '👩', c: 'persona', g: 'f', n: 's' }, { w: 'papà', e: '👨', c: 'persona', g: 'm', n: 's' },
  { w: 'maestra', e: '👩‍🏫', c: 'persona', g: 'f', n: 's' }, { w: 'dottore', e: '🧑‍⚕️', c: 'persona', g: 'm', n: 's' },
  { w: 'bambini', e: '🧒', c: 'persona', g: 'm', n: 'p' }, { w: 'nonne', e: '👵', c: 'persona', g: 'f', n: 'p' },
  { w: 'amici', e: '🧑', c: 'persona', g: 'm', n: 'p' }, { w: 'sorelle', e: '👧', c: 'persona', g: 'f', n: 'p' },
  { w: 'Luca', e: '👦', c: 'persona', g: 'm', n: 's', pr: true }, { w: 'Giulia', e: '👧', c: 'persona', g: 'f', n: 's', pr: true },
  { w: 'Marco', e: '🧑', c: 'persona', g: 'm', n: 's', pr: true }, { w: 'Sara', e: '👩', c: 'persona', g: 'f', n: 's', pr: true },
  // animali
  { w: 'gatto', e: '🐱', c: 'animale', g: 'm', n: 's' }, { w: 'cane', e: '🐶', c: 'animale', g: 'm', n: 's' },
  { w: 'mucca', e: '🐄', c: 'animale', g: 'f', n: 's' }, { w: 'tartaruga', e: '🐢', c: 'animale', g: 'f', n: 's' },
  { w: 'pesci', e: '🐟', c: 'animale', g: 'm', n: 'p' }, { w: 'farfalle', e: '🦋', c: 'animale', g: 'f', n: 'p' },
  { w: 'galline', e: '🐔', c: 'animale', g: 'f', n: 'p' }, { w: 'leoni', e: '🦁', c: 'animale', g: 'm', n: 'p' },
  { w: 'Fido', e: '🐕', c: 'animale', g: 'm', n: 's', pr: true }, { w: 'Micia', e: '🐈', c: 'animale', g: 'f', n: 's', pr: true },
  // cose
  { w: 'casa', e: '🏠', c: 'cosa', g: 'f', n: 's' }, { w: 'mela', e: '🍎', c: 'cosa', g: 'f', n: 's' },
  { w: 'zaino', e: '🎒', c: 'cosa', g: 'm', n: 's' }, { w: 'sedia', e: '🪑', c: 'cosa', g: 'f', n: 's' },
  { w: 'libri', e: '📚', c: 'cosa', g: 'm', n: 'p' }, { w: 'palloni', e: '⚽', c: 'cosa', g: 'm', n: 'p' },
  { w: 'scarpe', e: '👟', c: 'cosa', g: 'f', n: 'p' }, { w: 'matite', e: '✏️', c: 'cosa', g: 'f', n: 'p' },
  { w: 'treno', e: '🚂', c: 'cosa', g: 'm', n: 's' }, { w: 'fiori', e: '🌼', c: 'cosa', g: 'm', n: 'p' },
]

const VOWEL = /^[aeiouàèéìòùh]/i
const SPECIAL = /^(z|s[^aeiou]|gn|ps|x|y)/i

/** Articolo che andrebbe davanti alla parola se fosse di quel genere, nello stesso numero (le bambine, lo zaino) */
export function articleFor(w: string, g: 'm' | 'f', n: 's' | 'p'): string {
  const vowel = VOWEL.test(w), special = SPECIAL.test(w)
  if (g === 'm') return n === 's' ? (vowel ? "l'" : special ? 'lo' : 'il') : (vowel || special ? 'gli' : 'i')
  return n === 's' ? (vowel ? "l'" : 'la') : 'le'
}
export const article = (x: Word) => (x.pr ? '' : articleFor(x.w, x.g, x.n))
/** Con l'articolo davanti: «lo zaino», «l'amica» */
export const withArticle = (x: Word) => { const a = article(x); return a ? `${a}${a.endsWith("'") ? '' : ' '}${x.w}` : x.w }

/** Icona delle caselle maschile/femminile: cambia con la parola */
export function genderIcon(x: Word, g: 'm' | 'f'): string {
  if (x.pr) return g === 'm' ? 'LUI' : 'LEI'                                // Luca → lui, Giulia → lei
  if (x.n === 's' && VOWEL.test(x.w)) return g === 'm' ? 'UN' : "UN'"       // l' vale per entrambi: si prova con un / un'
  return articleFor(x.w, g, x.n).toUpperCase()
}

export type ClassId = 'tipo' | 'categoria' | 'genere' | 'numero'
export interface Box { v: string; t: string; ic: (x: Word) => string; sm?: string; color: string }
export interface ClassDef { q: string; key: (x: Word) => string; boxes: Box[]; tag: (x: Word) => string }

export const CLASSES: Record<ClassId, ClassDef> = {
  categoria: {
    q: 'È una persona, un animale o una cosa?', key: x => x.c, tag: x => `di ${x.c}`,
    boxes: [
      { v: 'persona', t: 'Persona', ic: () => '🧑', color: 'persona' },
      { v: 'animale', t: 'Animale', ic: () => '🐾', color: 'animale' },
      { v: 'cosa',    t: 'Cosa',    ic: () => '📦', color: 'cosa' },
    ],
  },
  tipo: {
    q: 'È un nome comune o un nome proprio?', key: x => (x.pr ? 'proprio' : 'comune'), tag: x => `nome ${x.pr ? 'proprio' : 'comune'}`,
    boxes: [
      { v: 'comune',  t: 'Comune',  ic: () => 'a', sm: 'lettera piccola',   color: 'comune' },
      { v: 'proprio', t: 'Proprio', ic: () => 'A', sm: 'lettera MAIUSCOLA', color: 'proprio' },
    ],
  },
  genere: {
    q: 'È maschile o femminile?', key: x => x.g, tag: x => (x.g === 'm' ? 'maschile' : 'femminile'),
    boxes: [
      { v: 'm', t: 'Maschile',  ic: x => genderIcon(x, 'm'), sm: 'il · lo · i · gli', color: 'masc' },
      { v: 'f', t: 'Femminile', ic: x => genderIcon(x, 'f'), sm: 'la · le',           color: 'femm' },
    ],
  },
  numero: {
    q: 'È singolare o plurale?', key: x => x.n, tag: x => (x.n === 's' ? 'singolare' : 'plurale'),
    boxes: [
      { v: 's', t: 'Singolare', ic: () => '☝️', sm: 'uno solo', color: 'sing' },
      { v: 'p', t: 'Plurale',   ic: () => '🖐️', sm: 'tanti',    color: 'plur' },
    ],
  },
}

export type ModeId = ClassId | 'tutto'
export const MODES: { id: ModeId; label: string; steps: ClassId[] }[] = [
  { id: 'categoria', label: '🧑🐾📦 Persona, animale, cosa', steps: ['categoria'] },
  { id: 'tipo',      label: '🔤 Comune o proprio',           steps: ['tipo'] },
  { id: 'genere',    label: '🏷️ Maschile o femminile',      steps: ['genere'] },
  { id: 'numero',    label: '☝️🖐️ Singolare o plurale',      steps: ['numero'] },
  { id: 'tutto',     label: '🔍 Analisi completa',           steps: ['tipo', 'categoria', 'genere', 'numero'] },
]
