import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'
import { getSession } from '@/lib/session'
import { rateLimit, getIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const { ok, retryAfterSec } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000)
  if (!ok) {
    return NextResponse.json(
      { error: `Troppi tentativi. Riprova tra ${Math.ceil(retryAfterSec / 60)} minuti.` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    )
  }

  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email e password richieste' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data: family } = await supabase
    .from('families')
    .select('id, password_hash')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (!family) {
    return NextResponse.json({ error: 'Email o password errati' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, family.password_hash)
  if (!valid) {
    return NextResponse.json({ error: 'Email o password errati' }, { status: 401 })
  }

  const session = await getSession()
  session.familyId = family.id
  session.isParent = false
  await session.save()

  return NextResponse.json({ ok: true })
}