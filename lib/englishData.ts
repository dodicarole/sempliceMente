/** English time: parole e frasi in inglese, con la traduzione in italiano e in francese */
import type { Lang } from '@/lib/i18n'

export type Accent = 'en-GB' | 'en-US'
export interface EnItem {
  en: string | { gb: string; us: string }   // alcune parole cambiano tra inglese britannico e americano
  tr: Record<Lang, string>
  e?: string   // immagine (emoji)
  c?: string   // colore
  n?: number   // numero
}
export type TopicId = 'animals' | 'colours' | 'classroom' | 'numbers'

export const enOf = (x: EnItem, accent: Accent) => (typeof x.en === 'string' ? x.en : accent === 'en-US' ? x.en.us : x.en.gb)

export const TOPICS: { id: TopicId; icon: string; en: { gb: string; us: string }; items: EnItem[] }[] = [
  { id: 'animals', icon: '🐾', en: { gb: 'Animals', us: 'Animals' }, items: [
    { en: 'cat', tr: { it: 'gatto', fr: 'chat' }, e: '🐱' }, { en: 'dog', tr: { it: 'cane', fr: 'chien' }, e: '🐶' },
    { en: 'bird', tr: { it: 'uccello', fr: 'oiseau' }, e: '🐦' }, { en: 'fish', tr: { it: 'pesce', fr: 'poisson' }, e: '🐟' },
    { en: 'horse', tr: { it: 'cavallo', fr: 'cheval' }, e: '🐴' }, { en: 'cow', tr: { it: 'mucca', fr: 'vache' }, e: '🐄' },
    { en: 'rabbit', tr: { it: 'coniglio', fr: 'lapin' }, e: '🐰' }, { en: 'duck', tr: { it: 'anatra', fr: 'canard' }, e: '🦆' },
    { en: 'pig', tr: { it: 'maiale', fr: 'cochon' }, e: '🐷' }, { en: 'sheep', tr: { it: 'pecora', fr: 'mouton' }, e: '🐑' },
  ] },
  { id: 'colours', icon: '🎨', en: { gb: 'Colours', us: 'Colors' }, items: [
    { en: 'red', tr: { it: 'rosso', fr: 'rouge' }, c: '#E03131' }, { en: 'blue', tr: { it: 'blu', fr: 'bleu' }, c: '#1C7ED6' },
    { en: 'green', tr: { it: 'verde', fr: 'vert' }, c: '#2F9E44' }, { en: 'yellow', tr: { it: 'giallo', fr: 'jaune' }, c: '#FCC419' },
    { en: 'orange', tr: { it: 'arancione', fr: 'orange' }, c: '#FD7E14' }, { en: 'pink', tr: { it: 'rosa', fr: 'rose' }, c: '#F783AC' },
    { en: 'purple', tr: { it: 'viola', fr: 'violet' }, c: '#7048E8' }, { en: 'brown', tr: { it: 'marrone', fr: 'marron' }, c: '#8B5A2B' },
    { en: 'black', tr: { it: 'nero', fr: 'noir' }, c: '#212529' }, { en: 'white', tr: { it: 'bianco', fr: 'blanc' }, c: '#FFFFFF' },
  ] },
  { id: 'classroom', icon: '🎒', en: { gb: 'Classroom', us: 'Classroom' }, items: [
    { en: 'pencil', tr: { it: 'matita', fr: 'crayon' }, e: '✏️' }, { en: 'pen', tr: { it: 'penna', fr: 'stylo' }, e: '🖊️' },
    { en: 'book', tr: { it: 'libro', fr: 'livre' }, e: '📖' }, { en: 'notebook', tr: { it: 'quaderno', fr: 'cahier' }, e: '📓' },
    { en: 'ruler', tr: { it: 'righello', fr: 'règle' }, e: '📏' }, { en: 'scissors', tr: { it: 'forbici', fr: 'ciseaux' }, e: '✂️' },
    { en: 'crayon', tr: { it: 'pastello', fr: 'crayon de cire' }, e: '🖍️' },
    { en: { gb: 'school bag', us: 'backpack' }, tr: { it: 'zaino', fr: 'cartable' }, e: '🎒' },
    { en: 'chair', tr: { it: 'sedia', fr: 'chaise' }, e: '🪑' }, { en: 'paintbrush', tr: { it: 'pennello', fr: 'pinceau' }, e: '🖌️' },
  ] },
  { id: 'numbers', icon: '🔢', en: { gb: 'Numbers', us: 'Numbers' }, items: [
    { en: 'one', tr: { it: 'uno', fr: 'un' }, n: 1 }, { en: 'two', tr: { it: 'due', fr: 'deux' }, n: 2 },
    { en: 'three', tr: { it: 'tre', fr: 'trois' }, n: 3 }, { en: 'four', tr: { it: 'quattro', fr: 'quatre' }, n: 4 },
    { en: 'five', tr: { it: 'cinque', fr: 'cinq' }, n: 5 }, { en: 'six', tr: { it: 'sei', fr: 'six' }, n: 6 },
    { en: 'seven', tr: { it: 'sette', fr: 'sept' }, n: 7 }, { en: 'eight', tr: { it: 'otto', fr: 'huit' }, n: 8 },
    { en: 'nine', tr: { it: 'nove', fr: 'neuf' }, n: 9 }, { en: 'ten', tr: { it: 'dieci', fr: 'dix' }, n: 10 },
  ] },
]

const nb = '\u00a0'
export const PHRASES: EnItem[] = [
  { en: 'Hello!', tr: { it: 'Ciao!', fr: `Bonjour${nb}!` }, e: '👋' },
  { en: 'Good morning!', tr: { it: 'Buongiorno!', fr: `Bonjour${nb}! (le matin)` }, e: '🌞' },
  { en: 'Good night!', tr: { it: 'Buonanotte!', fr: `Bonne nuit${nb}!` }, e: '🌙' },
  { en: 'Thank you!', tr: { it: 'Grazie!', fr: `Merci${nb}!` }, e: '🙏' },
  { en: 'Please', tr: { it: 'Per favore', fr: 'S’il te plaît' }, e: '🙂' },
  { en: 'Goodbye!', tr: { it: 'Arrivederci!', fr: `Au revoir${nb}!` }, e: '👋' },
  { en: 'How are you?', tr: { it: 'Come stai?', fr: `Comment ça va${nb}?` }, e: '🤔' },
  { en: "I'm fine, thank you!", tr: { it: 'Sto bene, grazie!', fr: `Ça va bien, merci${nb}!` }, e: '👍' },
  { en: "I'm happy!", tr: { it: 'Sono felice!', fr: `Je suis content${nb}!` }, e: '😄' },
  { en: 'My name is…', tr: { it: 'Mi chiamo…', fr: 'Je m’appelle…' }, e: '📛' },
  { en: 'I love you!', tr: { it: 'Ti voglio bene!', fr: `Je t’aime${nb}!` }, e: '❤️' },
  { en: "Let's play!", tr: { it: 'Giochiamo!', fr: `On joue${nb}!` }, e: '🎲' },
]

/** Le frasi di incoraggiamento di Tedo in inglese */
export const EN_PRAISE = ['Well done!', 'Great job!', 'You did it!', 'Super!', 'Fantastic!', 'Good job!']
