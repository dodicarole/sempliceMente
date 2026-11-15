/**
 * Le foto dell'app sono in uno spazio PRIVATO di Supabase: nessuno le può vedere con un indirizzo fisso.
 * Nel database resta l'indirizzo "pubblico" (serve per sapere dov'è il file e per cancellarlo);
 * quando il server manda gli elementi all'app, lo sostituisce con un link FIRMATO, valido per poche ore.
 * Il server manda solo elementi della famiglia (o del bambino condiviso), quindi solo quelle foto ricevono un link.
 */
import { getSupabase } from './supabase'

const MARK = '/storage/v1/object/public/'
const HOURS = 6                                   // poi il link scade; riaprendo l'app se ne ricevono di nuovi

/** dall'indirizzo salvato: in quale spazio e in quale percorso si trova il file */
export function storagePath(url: string): { bucket: string; path: string } | null {
  const i = url.indexOf(MARK)
  if (i < 0) return null
  const rest = url.slice(i + MARK.length).split('?')[0], slash = rest.indexOf('/')
  if (slash < 0) return null
  return { bucket: rest.slice(0, slash), path: decodeURIComponent(rest.slice(slash + 1)) }
}

type Row = Record<string, unknown>
/** sostituisce, in tutti gli elementi, l'indirizzo della foto con un link firmato (le altre immagini restano com'erano) */
export async function signPhotos<T>(rows: T[], field = 'photo_url'): Promise<T[]> {
  const list = (rows ?? []) as unknown as Row[]
  const byBucket = new Map<string, Set<string>>()
  for (const r of list) {
    const u = r?.[field]
    if (typeof u !== 'string') continue
    const p = storagePath(u); if (!p) continue
    if (!byBucket.has(p.bucket)) byBucket.set(p.bucket, new Set())
    byBucket.get(p.bucket)!.add(p.path)
  }
  if (!byBucket.size) return rows
  const signed = new Map<string, string>()        // "bucket/percorso" → link firmato
  const supabase = getSupabase()
  for (const [bucket, set] of byBucket) {
    const paths = [...set]
    const { data } = await supabase.storage.from(bucket).createSignedUrls(paths, HOURS * 3600)
    data?.forEach((d, i) => { if (d.signedUrl) signed.set(`${bucket}/${paths[i]}`, d.signedUrl) })
  }
  return list.map(r => {
    const u = r?.[field]; if (typeof u !== 'string') return r
    const p = storagePath(u); const s = p && signed.get(`${p.bucket}/${p.path}`)
    return s ? { ...r, [field]: s } : r
  }) as unknown as T[]
}
export async function signPhoto<T>(row: T, field = 'photo_url'): Promise<T> {
  if (!row) return row
  return (await signPhotos([row], field))[0]
}
