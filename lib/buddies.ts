/**
 * Gli amici di Meky: ogni sezione dell'app ha un amico che la accompagna.
 * Ognuno ha un talento e una sua particolarità, raccontata senza etichette.
 */
export type BuddyId = 'meky' | 'zoe' | 'lila' | 'nico' | 'amina' | 'elio' | 'nour'
export type BuddySpot = 'zaino' | 'routine' | 'agenda' | 'timer' | 'emozioni' | 'storie' | 'numeri' | 'tabelline' | 'scomponi' | 'nomi' | 'english'
  | 'primapoi' | 'calma' | 'stelline' | 'orologio' | 'soldi' | 'sillabe'

export const BUDDIES: Record<BuddyId, { name: string; color: string; img: string }> = {
  meky:  { name: 'Meky',  color: '#5F88CC', img: '/amici/meky.png' },   // costruisce torri altissime
  zoe:   { name: 'Zoe',   color: '#F08C00', img: '/amici/zoe.png' },    // corre velocissima, ha bisogno di muoversi
  lila:  { name: 'Lila',  color: '#C2255C', img: '/amici/lila.png' },   // disegna benissimo, parla poco, usa le immagini
  nico:  { name: 'Nico',  color: '#0C8599', img: '/amici/nico.png' },   // ama i treni, porta le cuffie, vuole sapere cosa succede dopo
  amina: { name: 'Amina', color: '#2F9E44', img: '/amici/amina.png' },  // ricorda tutte le storie, legge con più tempo
  elio:  { name: 'Elio',  color: '#E8A400', img: '/amici/elio.png' },   // campione dei calcoli, sedia a rotelle
  nour:  { name: 'Nour',  color: '#7048E8', img: '/amici/nour.png' },   // parla due lingue
}

export const BUDDY_FOR: Record<BuddySpot, BuddyId> = {
  zaino: 'nico', agenda: 'nico',
  routine: 'zoe', timer: 'zoe',
  emozioni: 'lila',
  storie: 'amina', nomi: 'amina',
  numeri: 'elio', tabelline: 'elio', scomponi: 'elio',
  english: 'nour',
  primapoi: 'zoe', calma: 'nico', stelline: 'elio', orologio: 'nico', soldi: 'elio', sillabe: 'amina',
}
