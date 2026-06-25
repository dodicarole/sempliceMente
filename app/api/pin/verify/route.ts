import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'
import { getSession, getFamilyId } from '@/lib/session'

export async function POST(req: NextRequest) {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId

  const { pin } = await req.json()
  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'PIN non valido' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'pin_hash')
    .eq('family_id', familyId)
    .single()

  let valid = false

  if (!data) {
    valid = pin === '1234'
    if (valid) {
      const hash = await bcrypt.hash(pin, 10)
      await supabase.from('app_settings').insert({ key: 'pin_hash', family_id: familyId, value: hash })
    }
  } else {
    valid = await bcrypt.compare(pin, data.value)
  }

  if (!valid) return NextResponse.json({ error: 'PIN errato' }, { status: 401 })

  const session = await getSession()
  session.isParent = true
  await session.save()

  return NextResponse.json({ ok: true })
}