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

export async function getFamilyId(): Promise<string | Response> {
  const session = await getSession()
  if (!session.familyId) {
    return new Response(JSON.stringify({ error: 'Non autenticato' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return session.familyId
}

export async function getParentFamilyId(): Promise<string | Response> {
  const session = await getSession()
  if (!session.familyId || !session.isParent) {
    return new Response(JSON.stringify({ error: 'Non autorizzato' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return session.familyId
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
