import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getOwnParentFamilyId } from '@/lib/session'
import { rateLimit, getIp } from '@/lib/rateLimit'

/**
 * Seguire un bambino con un codice di invito ricevuto dalla sua famiglia.
 * Il codice vale 48 ore e si usa una volta sola; pochi tentativi, per non poterlo indovinare.
 */
export async function POST(req: NextRequest) {
  const familyId = await getOwnParentFamilyId()
  if (familyId instanceof Response) return familyId
  const { ok, retryAfterSec } = rateLimit(`join:${getIp(req)}:${familyId}`, 8, 15 * 60 * 1000)
  if (!ok) return NextResponse.json({ error: `Troppi tentativi. Riprova tra ${Math.ceil(retryAfterSec / 60)} minuti.` }, { status: 429 })

  const body = await req.json().catch(() => ({}))
  const code = String(body.code ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (code.length !== 8) return NextResponse.json({ error: 'Il codice ha 8 lettere e numeri' }, { status: 400 })

  const supabase = getSupabase()
  const { data: inv, error } = await supabase.from('child_invites').select('code, child_id, family_id, expires_at').eq('code', code).maybeSingle()
  if (error) return NextResponse.json({ error: 'La condivisione non è ancora attiva' }, { status: 500 })
  if (!inv || new Date(inv.expires_at).getTime() < Date.now()) return NextResponse.json({ error: 'Codice sbagliato o scaduto' }, { status: 404 })
  if (inv.family_id === familyId) return NextResponse.json({ error: 'Questo bambino è già tuo: il codice va dato a un altro adulto' }, { status: 400 })

  const { count } = await supabase.from('child_shares').select('child_id', { count: 'exact', head: true }).eq('family_id', familyId)
  if ((count ?? 0) >= 30) return NextResponse.json({ error: 'Segui già troppi bambini' }, { status: 400 })

  const { error: e2 } = await supabase.from('child_shares').upsert({ child_id: inv.child_id, family_id: familyId })
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 })
  await supabase.from('child_invites').delete().eq('code', code)          // il codice si usa una volta sola
  const { data: child } = await supabase.from('children').select('id, name, avatar').eq('id', inv.child_id).single()
  return NextResponse.json({ ok: true, child })
}
