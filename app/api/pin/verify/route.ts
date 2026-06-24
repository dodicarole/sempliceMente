import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'
import { getSession } from '@/lib/session'

export async function POST(req: NextRequest) {
  const { pin } = await req.json()
  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'PIN non valido' }, { status: 400 })
  }

  const supabase = getSupabase()
  // Legge l'hash dal DB; se non esiste accetta il default 1234 e lo salva
  const { data } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'pin_hash')
    .single()

  let valid = false

  if (!data) {
    // Prima volta: PIN di default è 1234
    valid = pin === '1234'
    if (valid) {
      const hash = await bcrypt.hash(pin, 10)
      await getSupabase().from('app_settings').insert({ key: 'pin_hash', value: hash })
    }
  } else {
    valid = await bcrypt.compare(pin, data.value)
  }

  if (!valid) {
    return NextResponse.json({ error: 'PIN errato' }, { status: 401 })
  }

  const session = await getSession()
  session.isParent = true
  await session.save()

  return NextResponse.json({ ok: true })
}