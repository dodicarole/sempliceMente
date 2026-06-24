import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getSupabase } from '@/lib/supabase'
import { requireParent } from '@/lib/session'

export async function POST(req: NextRequest) {
  const denied = await requireParent()
  if (denied) return denied

  const { pin } = await req.json()
  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'PIN non valido' }, { status: 400 })
  }

  const supabase = getSupabase()
  const hash = await bcrypt.hash(pin, 10)

  await supabase
    .from('app_settings')
    .upsert({ key: 'pin_hash', value: hash }, { onConflict: 'key' })

  return NextResponse.json({ ok: true })
}