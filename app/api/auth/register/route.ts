import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Email e password richieste (minimo 6 caratteri)' }, { status: 400 })
  }

  const supabase = getSupabase()

  const { data: existing } = await supabase
    .from('families')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Email già registrata' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const { data: family, error } = await supabase
    .from('families')
    .insert({ email: email.toLowerCase().trim(), password_hash: passwordHash })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const session = await getSession()
  session.familyId = family.id
  session.isParent = false
  await session.save()

  return NextResponse.json({ ok: true })
}