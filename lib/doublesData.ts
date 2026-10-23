/**
 * Le doppie: parole per imparare quando una consonante è singola o doppia.
 * Attività per l'italiano. Un'immagine che inizia con "/" è un file in /public, le altre sono emoji.
 */
export interface DWord { w: string; s: string[]; e: string }
export interface FillWord extends DWord { l: string; dbl: boolean; at: number }

/** Coppie in cui la doppia cambia il significato */
export const PAIRS: [DWord, DWord][] = [
  [{w:'pala',s:['pa','la'],e:'/doppie/pala.png'},{w:'palla',s:['pal','la'],e:'⚽'}],
  [{w:'sete',s:['se','te'],e:'🥤'},{w:'sette',s:['set','te'],e:'7️⃣'}],
  [{w:'note',s:['no','te'],e:'🎵'},{w:'notte',s:['not','te'],e:'🌙'}],
  [{w:'capello',s:['ca','pel','lo'],e:'💇'},{w:'cappello',s:['cap','pel','lo'],e:'🎩'}],
  [{w:'polo',s:['po','lo'],e:'🧊'},{w:'pollo',s:['pol','lo'],e:'🍗'}],
  [{w:'copia',s:['co','pia'],e:'📄'},{w:'coppia',s:['cop','pia'],e:'👫'}],
  [{w:'camino',s:['ca','mi','no'],e:'🔥'},{w:'cammino',s:['cam','mi','no'],e:'🚶'}],
  [{w:'dita',s:['di','ta'],e:'✋'},{w:'ditta',s:['dit','ta'],e:'🏭'}],
  [{w:'rosa',s:['ro','sa'],e:'🌹'},{w:'rossa',s:['ros','sa'],e:'🔴'}],
  [{w:'casa',s:['ca','sa'],e:'🏠'},{w:'cassa',s:['cas','sa'],e:'📦'}],
];

/** Parole per "Completa": parola, sillabe, immagine e lettera su cui si gioca */
const RAW: [string, string, string, string][] = [
  // Z / ZZ
  ['pizza','piz-za','🍕','z'],['tazza','taz-za','☕','z'],['piazza','piaz-za','⛲','z'],['ragazzo','ra-gaz-zo','🧑','z'],['ragazza','ra-gaz-za','👧','z'],
  ['pezzo','pez-zo','🧩','z'],['mazzo','maz-zo','💐','z'],['puzza','puz-za','🦨','z'],['cozza','coz-za','🦪','z'],
  ['stazione','sta-zio-ne','🚉','z'],['colazione','co-la-zio-ne','🥐','z'],['lezione','le-zio-ne','📚','z'],['polizia','po-li-zi-a','👮','z'],
  ['benzina','ben-zi-na','⛽','z'],['zanzara','zan-za-ra','🦟','z'],['azione','a-zio-ne','🎬','z'],
  // T / TT
  ['gatto','gat-to','🐱','t'],['latte','lat-te','🥛','t'],['letto','let-to','🛏️','t'],['sette','set-te','7️⃣','t'],['notte','not-te','🌙','t'],['tetto','tet-to','🏠','t'],
  ['patata','pa-ta-ta','🥔','t'],['moto','mo-to','🏍️','t'],['dito','di-to','☝️','t'],['carota','ca-ro-ta','🥕','t'],['matita','ma-ti-ta','✏️','t'],['vestito','ve-sti-to','👗','t'],
  // L / LL
  ['palla','pal-la','⚽','l'],['cavallo','ca-val-lo','🐴','l'],['ombrello','om-brel-lo','☂️','l'],['gallina','gal-li-na','🐔','l'],['farfalla','far-fal-la','🦋','l'],['stella','stel-la','⭐','l'],['pollo','pol-lo','🍗','l'],
  ['mela','me-la','🍎','l'],['sole','so-le','☀️','l'],['vela','ve-la','⛵','l'],['scuola','scuo-la','🏫','l'],['gelato','ge-la-to','🍦','l'],
  // P / PP
  ['mappa','map-pa','🗺️','p'],['pappa','pap-pa','🥣','p'],['zuppa','zup-pa','🍲','p'],['coppa','cop-pa','🏆','p'],['cappello','cap-pel-lo','🎩','p'],['ippopotamo','ip-po-po-ta-mo','🦛','p'],
  ['topo','to-po','🐭','p'],['lupo','lu-po','🐺','p'],['ape','a-pe','🐝','p'],['sapone','sa-po-ne','🧼','p'],
  // C / CC
  ['zucca','zuc-ca','🎃','c'],['mucca','muc-ca','🐄','c'],['bocca','boc-ca','👄','c'],['tacco','tac-co','👠','c'],['occhio','oc-chio','👁️','c'],['orecchio','o-rec-chio','👂','c'],
  ['foca','fo-ca','🦭','c'],['formica','for-mi-ca','🐜','c'],['luce','lu-ce','💡','c'],
  // M / MM
  ['mamma','mam-ma','👩','m'],['fiamma','fiam-ma','🔥','m'],['uomo','uo-mo','👨','m'],['fumo','fu-mo','💨','m'],['pomodoro','po-mo-do-ro','🍅','m'],
  // N / NN
  ['nonno','non-no','👴','n'],['nonna','non-na','👵','n'],['penna','pen-na','🖊️','n'],['gonna','gon-na','👗','n'],['antenna','an-ten-na','📡','n'],
  ['luna','lu-na','🌙','n'],['cane','ca-ne','🐶','n'],['rana','ra-na','🐸','n'],['pane','pa-ne','🍞','n'],['lana','la-na','🧶','n'],['cena','ce-na','🍝','n'],['banana','ba-na-na','🍌','n'],
  // R / RR
  ['burro','bur-ro','🧈','r'],['torre','tor-re','🏰','r'],['chitarra','chi-tar-ra','🎸','r'],['terra','ter-ra','🌍','r'],
  ['mare','ma-re','🌊','r'],['pera','pe-ra','🍐','r'],['fiore','fio-re','🌸','r'],['cuore','cuo-re','❤️','r'],['sirena','si-re-na','🧜','r'],
  // S / SS
  ['rosso','ros-so','🔴','s'],['sasso','sas-so','🪨','s'],['osso','os-so','🦴','s'],['cassa','cas-sa','📦','s'],
  ['rosa','ro-sa','🌹','s'],['casa','ca-sa','🏠','s'],['naso','na-so','👃','s'],['vaso','va-so','🏺','s'],['riso','ri-so','🍚','s'],
  // B / BB
  ['babbo','bab-bo','🎅','b'],['nebbia','neb-bia','🌫️','b'],['sabbia','sab-bia','🏖️','b'],['cubo','cu-bo','🧊','b'],
  // G / GG
  ['pioggia','piog-gia','🌧️','g'],['spiaggia','spiag-gia','🏖️','g'],['fragola','fra-go-la','🍓','g'],['lago','la-go','🏞️','g'],['ago','a-go','🪡','g'],
  // F / FF
  ['giraffa','gi-raf-fa','🦒','f'],['baffi','baf-fi','🥸','f'],['gufo','gu-fo','🦉','f'],['delfino','del-fi-no','🐬','f'],
  // D / DD
  ['freddo','fred-do','🥶','d'],['dado','da-do','🎲','d'],['nido','ni-do','🪺','d'],
]

export const BANK: FillWord[] = RAW.map(([w, syl, e, l]) => {
  const dbl = w.includes(l + l)
  const at = dbl ? w.indexOf(l + l) : w.indexOf(l, 1) // la lettera su cui si gioca (mai la prima della parola)
  return { w, s: syl.split('-'), e, l, dbl, at }
})
export const LETTERS = ['tutte', ...Array.from(new Set(BANK.map(x => x.l))).sort()]
export const ROUNDS = 10

export interface DoublesSettings { color: boolean; syll: boolean; pics: boolean }
export const DOUBLES_DEFAULTS: DoublesSettings = { color: true, syll: true, pics: true }
const KEY = 'doppie_impostazioni'
export function loadDoublesSettings(): DoublesSettings {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...DOUBLES_DEFAULTS, ...JSON.parse(raw) } } catch (_) {}
  return DOUBLES_DEFAULTS
}
export function saveDoublesSettings(s: DoublesSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {}
}
