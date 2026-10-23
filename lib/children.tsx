'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadChildName, loadChildGender, saveChildName, saveChildGender, type ChildGender } from '@/lib/praise'
import { hiddenOf, type SectionId } from '@/lib/homeSections'

/**
 * Più figli per famiglia.
 * Il figlio attivo è scelto su ogni dispositivo e viene mandato al server con ogni
 * richiesta a /api (intestazione x-child-id): così zaino, routine, agenda ed emozioni
 * arrivano già quelli giusti, senza cambiare tutte le chiamate dell'app.
 */
export interface Child { id: string; name: string; gender: ChildGender; avatar: string; sort_order: number; hidden: SectionId[] }
type RawChild = Omit<Child, 'hidden'> & { settings?: unknown }
const toChild = (c: RawChild): Child => ({ id: c.id, name: c.name, gender: c.gender, avatar: c.avatar, sort_order: c.sort_order, hidden: hiddenOf(c.settings) })
export const AVATARS = ['tedo', 'meky', 'zoe', 'lila', 'nico', 'amina', 'elio', 'nour'] as const

const ACTIVE = 'figlio_attivo'        // il figlio scelto su questo dispositivo
const FIXED = 'figlio_fisso'          // "questo dispositivo è sempre di…"
const CHOSEN = 'figlio_scelto'        // scelto in questa apertura dell'app (sessionStorage)
const get = (k: string, session = false) => { try { return (session ? sessionStorage : localStorage).getItem(k) } catch (_) { return null } }
const put = (k: string, v: string | null, session = false) => {
  try { const st = session ? sessionStorage : localStorage; if (v === null) st.removeItem(k); else st.setItem(k, v) } catch (_) {}
}

// Aggiunge il figlio attivo a ogni richiesta verso /api di questa app
if (typeof window !== 'undefined' && !(window as unknown as { __childFetch?: boolean }).__childFetch) {
  (window as unknown as { __childFetch?: boolean }).__childFetch = true
  const original = window.fetch.bind(window)
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const id = get(ACTIVE)
    if (id && (url.startsWith('/api/') || url.startsWith(`${window.location.origin}/api/`))) {
      const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined))
      headers.set('x-child-id', id)
      init = { ...init, headers }
    }
    return original(input, init)
  }
}

interface Ctx {
  children: Child[]
  active: Child | null
  /** cambia ogni volta che cambia il figlio attivo: chi carica i dati lo usa per ricaricarli */
  version: number
  needsChoice: boolean
  fixed: boolean
  choose: (id: string, remember?: boolean) => void
  askAgain: () => void
  reload: () => Promise<void>
  add: (c: { name: string; gender: ChildGender; avatar: string; hidden?: SectionId[] }) => Promise<string | null>
  update: (id: string, patch: Partial<Pick<Child, 'name' | 'gender' | 'avatar' | 'hidden'>>) => Promise<void>
  remove: (id: string) => Promise<string | null>
}
const ChildrenContext = createContext<Ctx | null>(null)

export function ChildrenProvider({ children: kids }: { children: ReactNode }) {
  const [list, setList] = useState<Child[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [version, setVersion] = useState(0)
  const [chosen, setChosen] = useState(false)
  const [fixedId, setFixedId] = useState<string | null>(null)

  // il nome e il genere del figlio attivo restano anche dove li leggono le frasi di incoraggiamento
  const bridge = (c: Child | undefined) => { if (c) { saveChildName(c.name); saveChildGender(c.gender) } }

  const reload = useCallback(async () => {
    let data: Child[] = []
    try {
      const res = await fetch('/api/children')
      if (res.ok) data = ((await res.json()).children ?? []).map(toChild)
    } catch (_) {}
    // il primo figlio nasce senza nome: prende quello che il genitore aveva scritto su questo telefono
    if (data.length && !data[0].name && loadChildName()) {
      const res = await fetch(`/api/children/${data[0].id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: loadChildName(), gender: loadChildGender() }) })
      if (res.ok) data[0] = toChild((await res.json()).child)
    }
    setList(data)
    const fixed = get(FIXED), saved = get(ACTIVE)
    const pick = data.find(c => c.id === fixed) ?? data.find(c => c.id === saved) ?? data[0]
    setFixedId(data.some(c => c.id === fixed) ? fixed : null)
    setChosen(get(CHOSEN, true) === '1')
    if (pick) { put(ACTIVE, pick.id); bridge(pick) } else put(ACTIVE, null)
    setActiveId(pick?.id ?? null)
    setVersion(v => v + 1)
  }, [])

  useEffect(() => { reload() }, [reload])

  const choose = useCallback((id: string, remember = false) => {
    put(ACTIVE, id); put(CHOSEN, '1', true); setChosen(true)
    if (remember) { put(FIXED, id); setFixedId(id) }
    setActiveId(id); bridge(list.find(c => c.id === id)); setVersion(v => v + 1)
  }, [list])
  const askAgain = useCallback(() => { put(FIXED, null); setFixedId(null); put(CHOSEN, null, true); setChosen(false) }, [])

  const add: Ctx['add'] = async c => {
    const res = await fetch('/api/children', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) })
    if (!res.ok) return (await res.json().catch(() => ({}))).error ?? 'Errore'
    await reload(); return null
  }
  const update: Ctx['update'] = async (id, patch) => {
    const res = await fetch(`/api/children/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch) })
    if (!res.ok) return
    const child = toChild((await res.json()).child)
    setList(l => l.map(x => (x.id === id ? child : x)))
    if (id === activeId) bridge(child)
  }
  const remove: Ctx['remove'] = async id => {
    const res = await fetch(`/api/children/${id}`, { method: 'DELETE' })
    if (!res.ok) return (await res.json().catch(() => ({}))).error ?? 'Errore'
    if (get(FIXED) === id) put(FIXED, null)
    if (get(ACTIVE) === id) put(ACTIVE, null)
    await reload(); return null
  }

  const value = useMemo<Ctx>(() => ({
    children: list,
    active: list.find(c => c.id === activeId) ?? null,
    version,
    needsChoice: list.length > 1 && !fixedId && !chosen,
    fixed: !!fixedId,
    choose, askAgain, reload, add, update, remove,
  }), [list, activeId, version, fixedId, chosen, choose, askAgain, reload]) // eslint-disable-line react-hooks/exhaustive-deps

  return <ChildrenContext.Provider value={value}>{kids}</ChildrenContext.Provider>
}

export function useChildren(): Ctx {
  const ctx = useContext(ChildrenContext)
  if (!ctx) throw new Error('useChildren va usato dentro ChildrenProvider')
  return ctx
}
