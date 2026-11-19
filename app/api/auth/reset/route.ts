import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import { rateLimit, getIp } from '@/lib/rateLimit'

const sha = (s: string) => createHash('sha256').update(s).digest('hex')

/** La nuova password, con il link ricevuto per email (valido 1 ora, una volta sola). Poi si entra direttamente. */
export async function POST(req: NextRequest) {
  const { ok } = rateLimit(`reset:${getIp(req)}`, 10, 15 * 60 * 1000)
  if (!ok) return NextResponse.json({ error: 'Troppi tentativi. Riprova più tardi.' }, { status: 429 })

  const body = await req.json().catch(() => ({}))
  const token = String(body.token ?? ''), password = String(body.password ?? '')
  if (password.length < 6) return NextResponse.json({ error: 'Password di almeno 6 caratteri' }, { status: 400 })
  if (!/^[A-Za-z0-9_-]{30,80}$/.test(token)) return NextResponse.json({ error: 'Link non valido o scaduto' }, { status: 400 })

  const supabase = getSupabase()
  const { data: row } = await supabase.from('password_resets').select('family_id, expires_at').eq('token_hash', sha(token)).maybeSingle()
  if (!row || new Date(row.expires_at).getTime() < Date.now()) return NextResponse.json({ error: 'Link non valido o scaduto' }, { status: 400 })

  // il link si usa una volta sola: si cancella subito, insieme agli altri della stessa famiglia
  await supabase.from('password_resets').delete().eq('family_id', row.family_id)
  const { error } = await supabase.from('families').update({ password_hash: await bcrypt.hash(password, 10) }).eq('id', row.family_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const session = await getSession()
  session.familyId = row.family_id
  session.isParent = false
  await session.save()
  return NextResponse.json({ ok: true })
}
