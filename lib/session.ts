import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

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