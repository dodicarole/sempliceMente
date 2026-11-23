/**
 * Impostazioni e progressi di OGNI figlio, non del telefono.
 *
 * Tutti i giochi salvano le loro impostazioni con localStorage (per esempio "tabelline_impostazioni").
 * Qui intercettiamo quelle chiavi: ogni figlio ha la sua copia ("tabelline_impostazioni@<id del figlio>"),
 * e le impostazioni vengono salvate anche nel database (children.settings.games), così valgono su ogni
 * telefono della famiglia. Passando da un figlio all'altro, ogni gioco ritrova le impostazioni di quel figlio.
 */

/** Impostazioni e progressi salvati per figlio e sincronizzati con il database */
export const SYNCED_KEYS = [
  'numeri_impostazioni', 'tabelline_impostazioni', 'tabelline_progressi', 'scomposizione_impostazioni',
  'nomi_impostazioni', 'english_impostazioni', 'doppie_impostazioni', 'contrari_impostazioni',
  'confronto_impostazioni', 'precsucc_impostazioni', 'lettura_impostazioni', 'tono_divertente',
  'voce_velocita', 'stelline', 'prima_poi', 'aiuti_progressi', 'diario_orario', 'diario_impostazioni', 'capisco_impostazioni', 'giochi_impostazioni', 'poesie', 'piani', 'inglese_tempo', 'hoha_mazzo', 'hoha_ripasso', 'hoha_mie', 'hoha_impostazioni', 'fem_mazzo', 'fem_ripasso', 'fem_mie', 'fem_impostazioni', 'serve_mazzo', 'serve_mie', 'serve_impostazioni', 'zaino_scuola', 'piu_impostazioni', 'glr_impostazioni', 'glr_risultati', 'glr_confusioni', 'spell_impostazioni', 'spell_liste', 'spell_mazzo', 'spell_ripasso', 'spell_lista', 'domande_impostazioni', 'amici_impostazioni',
]
/** Le spunte del giorno (zaino e routine): per figlio, ma solo su questo telefono */
const DAILY = /^(zaino|routine)_\d{4}-\d{2}-\d{2}$/
const ACTIVE = 'figlio_attivo'
const isSynced = (k: string) => SYNCED_KEYS.includes(k)
const perChild = (k: string) => isSynced(k) || DAILY.test(k)

type Orig = { get: Storage['getItem']; set: Storage['setItem']; remove: Storage['removeItem'] }
let orig: Orig | null = null

const rawGet = (k: string) => { try { return orig ? orig.get.call(localStorage, k) : localStorage.getItem(k) } catch (_) { return null } }
const rawSet = (k: string, v: string | null) => {
  try { if (!orig) return; if (v === null) orig.remove.call(localStorage, k); else orig.set.call(localStorage, k, v) } catch (_) {}
}
const activeChild = () => rawGet(ACTIVE)

/* invio al database: un attimo dopo l'ultima modifica, una chiave alla volta.
   Se non c'è internet, la modifica resta "da mandare" (sync_pending) e parte appena torna la connessione:
   così niente di quello che il bambino fa offline va perso, e il server non lo sovrascrive. */
const PENDING = 'sync_pending'
const timers = new Map<string, ReturnType<typeof setTimeout>>()
const pending = (): Record<string, true> => { try { return JSON.parse(rawGet(PENDING) ?? '{}') } catch (_) { return {} } }
const setPending = (p: Record<string, true>) => rawSet(PENDING, Object.keys(p).length ? JSON.stringify(p) : null)
function upload(childId: string, key: string, value: string | null) {
  const id = `${childId}|${key}`
  setPending({ ...pending(), [id]: true })
  clearTimeout(timers.get(id))
  timers.set(id, setTimeout(() => {
    timers.delete(id)
    send(childId, key, value)
  }, 600))
}
function send(childId: string, key: string, value: string | null) {
  const id = `${childId}|${key}`
  fetch(`/api/children/${childId}/games`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }),
  }).then(r => {
    // arrivato (o rifiutato per sempre, per esempio un figlio che non c'è più): non è più da mandare
    if (r.ok || r.status === 404 || r.status === 400) { const p = pending(); delete p[id]; setPending(p) }
  }).catch(() => {})
}
/** Rimanda tutto quello che era rimasto da mandare (all'avvio e quando torna internet) */
export function flushPending() {
  if (typeof window === 'undefined' || (typeof navigator !== 'undefined' && navigator.onLine === false)) return
  for (const id of Object.keys(pending())) {
    const [childId, key] = id.split('|')
    if (childId && key && !timers.has(id)) send(childId, key, rawGet(`${key}@${childId}`))
  }
}

/** Da chiamare una volta, nel browser: da qui in poi le chiavi dei giochi sono "per figlio" */
export function installChildStorage() {
  if (typeof window === 'undefined' || orig) return
  window.addEventListener('online', () => flushPending())
  const P = Storage.prototype
  orig = { get: P.getItem, set: P.setItem, remove: P.removeItem }
  const o = orig
  P.getItem = function (this: Storage, k: string) {
    if (this === window.localStorage && perChild(k)) { const id = activeChild(); if (id) return o.get.call(this, `${k}@${id}`) }
    return o.get.call(this, k)
  }
  P.setItem = function (this: Storage, k: string, v: string) {
    if (this === window.localStorage && perChild(k)) {
      const id = activeChild()
      if (id) { o.set.call(this, `${k}@${id}`, v); if (isSynced(k)) upload(id, k, String(v)); return }
    }
    return o.set.call(this, k, v)
  }
  P.removeItem = function (this: Storage, k: string) {
    if (this === window.localStorage && perChild(k)) {
      const id = activeChild()
      if (id) { o.remove.call(this, `${k}@${id}`); if (isSynced(k)) upload(id, k, null); return }
    }
    return o.remove.call(this, k)
  }
}

/**
 * Quando arrivano i figli dal database: le loro impostazioni diventano quelle del telefono.
 * Il primo figlio eredita, una volta sola, le impostazioni che c'erano prima su questo telefono.
 */
export function seedFromServer(children: { id: string; sort_order?: number; settings?: unknown }[]) {
  if (typeof window === 'undefined') return
  const first = [...children].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]?.id
  for (const c of children) {
    const games = ((c.settings as { games?: Record<string, string | null> } | null)?.games) ?? {}
    for (const k of SYNCED_KEYS) {
      if (pending()[`${c.id}|${k}`]) continue          // modificata qui senza internet: vince quella del telefono
      if (k in games) { rawSet(`${k}@${c.id}`, games[k] ?? null); continue }
      // non c'è ancora nel database: per il primo figlio si usa (e si salva) quella di prima su questo telefono
      if (c.id === first && rawGet(`${k}@${c.id}`) === null) {
        const old = rawGet(k)
        if (old !== null) { rawSet(`${k}@${c.id}`, old); upload(c.id, k, old) }
      } else {
        const mine = rawGet(`${k}@${c.id}`)
        if (mine !== null) upload(c.id, k, mine)       // salvata solo qui: la mandiamo al database
      }
    }
  }
}

/**
 * Leggere e scrivere un'impostazione di un ALTRO figlio (non quello attivo), per esempio
 * per copiare un piano di lavoro a più bambini insieme. Si salva anche nel database.
 */
export function getForChild(childId: string, key: string): string | null { return rawGet(`${key}@${childId}`) }
export function setForChild(childId: string, key: string, value: string) {
  rawSet(`${key}@${childId}`, value)
  if (isSynced(key)) upload(childId, key, value)
}
