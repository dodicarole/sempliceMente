/** Frasi di incoraggiamento usate in tutta l'app al posto del solo "Bravo!" */
export const PRAISES = [
  'Bravo!',
  'Bravissimo!',
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

let last = ''

/** Sceglie una frase a caso, mai uguale a quella appena usata */
export function randomPraise(): string {
  let p = last
  while (p === last) p = PRAISES[Math.floor(Math.random() * PRAISES.length)]
  last = p
  return p
}
