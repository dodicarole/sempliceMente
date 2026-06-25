import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'
import { getParentFamilyId } from '@/lib/session'

export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const { pin } = await req.json()
  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'PIN non valido' }, { status: 400 })
  }

  const supabase = getSupabase()
  const hash = await bcrypt.hash(pin, 10)

  await supabase
    .from('app_settings')
    .upsert(
      { key: 'pin_hash', family_id: familyId, value: hash },
      { onConflict: 'key,family_id' }
    )

  return NextResponse.json({ ok: true })
}