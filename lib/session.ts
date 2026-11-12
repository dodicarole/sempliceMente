import { getIronSession } from 'iron-session'
import { cookies, headers } from 'next/headers'
import { getSupabase } from './supabase'

interface SessionData {
  familyId?: string
  isParent?: boolean
}

const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'zaino_parent',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    sameSite: 'lax' as const,
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), SESSION_OPTIONS)
}

const unauth = (msg: string) => new Response(JSON.stringify({ error: msg }), { status: 401, headers: { 'Content-Type': 'application/json' } })
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * La famiglia che HA FATTO L'ACCESSO (la propria). Si usa per quello che riguarda l'account:
 * il PIN, l'elenco dei propri figli, creare o eliminare un figlio, gli inviti.
 */
export async function getOwnFamilyId(): Promise<string | Response> {
  const session = await getSession()
  return session.familyId ? session.familyId : unauth('Non autenticato')
}
export async function getOwnParentFamilyId(): Promise<string | Response> {
  const session = await getSession()
  return session.familyId && session.isParent ? session.familyId : unauth('Non autorizzato')
}

/**
 * La famiglia a cui appartiene un bambino, se chi ha fatto l'accesso può seguirlo:
 * perché è suo figlio, oppure perché gli è stato condiviso (tabella child_shares). Altrimenti null.
 */
export async function familyOfChild(childId: string, own: string): Promise<{ familyId: string; shared: boolean } | null> {
  if (!UUID.test(childId)) return null
  const supabase = getSupabase()
  const { data: child } = await supabase.from('children').select('family_id').eq('id', childId).maybeSingle()
  if (!child) return null
  if (child.family_id === own) return { familyId: own, shared: false }
  const { data: share, error } = await supabase.from('child_shares').select('child_id').eq('child_id', childId).eq('family_id', own).maybeSingle()
  return share && !error ? { familyId: child.family_id as string, shared: true } : null
}

/**
 * La famiglia dei DATI su cui lavorare: di solito la propria; ma se il bambino scelto sul dispositivo
 * (intestazione x-child-id) è un bambino condiviso da un'altra famiglia, è quella famiglia.
 * Così zaino, routine, agenda, diario, testi… del bambino condiviso sono gli stessi per tutti gli adulti che lo seguono.
 * Un bambino non condiviso con chi ha fatto l'accesso non cambia niente: si resta sulla propria famiglia.
 */
async function dataFamily(own: string): Promise<string> {
  const wanted = (await headers()).get('x-child-id')
  if (!wanted) return own
  const f = await familyOfChild(wanted, own)
  return f?.shared ? f.familyId : own
}
export async function getFamilyId(): Promise<string | Response> {
  const own = await getOwnFamilyId()
  return own instanceof Response ? own : dataFamily(own)
}
export async function getParentFamilyId(): Promise<string | Response> {
  const own = await getOwnParentFamilyId()
  return own instanceof Response ? own : dataFamily(own)
}

export async function requireParent(): Promise<Response | null> {
  const session = await getSession()
  if (!session.familyId || !session.isParent) {
    return new Response(JSON.stringify({ error: 'Non autorizzato' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return null
}

/**
 * Il figlio su cui lavorare: lo sceglie il dispositivo (intestazione x-child-id).
 * Si accetta solo un figlio della famiglia; altrimenti, o se manca, il primo figlio.
 * Restituisce null solo se la tabella dei figli non c'è ancora (vecchio database).
 */
export async function getChildId(familyId: string): Promise<string | null> {
  const wanted = (await headers()).get('x-child-id')
  const { data, error } = await getSupabase()
    .from('children').select('id').eq('family_id', familyId)
    .order('sort_order').order('created_at')
  if (error || !data?.length) return null
  return data.find(c => c.id === wanted)?.id ?? data[0].id
}
