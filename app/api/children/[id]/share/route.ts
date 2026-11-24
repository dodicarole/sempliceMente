import { NextRequest, NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import { getSupabase } from '@/lib/supabase'
import { getOwnParentFamilyId } from '@/lib/session'
import { rateLimit, getIp } from '@/lib/rateLimit'

/**
 * Condividere un proprio figlio con un altro adulto (un altro account), senza dare la password.
 *  GET    → chi lo segue già, e il codice di invito ancora valido (se c'è)
 *  POST   → un codice nuovo: 8 lettere e numeri, vale 48 ore e si usa una volta sola (sostituisce il precedente)
 *  DELETE → ?invite=1 annulla il codice; ?family=<id> toglie l'accesso a quell'adulto
 * Solo la famiglia a cui appartiene il bambino, con il PIN del genitore. Le tabelle: supabase/child_shares_schema.sql
 */
type Ctx = { params: Promise<{ id: string }> }
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'          // niente 0/O e 1/I/L, che si confondono
const newCode = () => Array.from({ length: 8 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
const HOURS = 48

/** il bambino deve essere della propria famiglia (chi lo segue soltanto non può condividerlo) */
async function own(ctx: Ctx): Promise<{ familyId: string; childId: string } | Response> {
  const familyId = await getOwnParentFamilyId()
  if (familyId instanceof Response) return familyId
  const { id } = await ctx.params
  const { data, error } = await getSupabase().from('children').select('id').eq('id', id).eq('family_id', familyId).maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Puoi condividere solo i bambini della tua famiglia' }, { status: 403 })
  return { familyId, childId: id }
}

export async function GET(_req: NextRequest, ctx: Ctx) {
  const o = await own(ctx); if (o instanceof Response) return o
  const supabase = getSupabase()
  const { data: shares, error } = await supabase.from('child_shares').select('family_id, created_at').eq('child_id', o.childId)
  if (error) { console.error('Condivisione: tabella child_shares non pronta', error.message); return NextResponse.json({ error: 'La condivisione non è ancora attiva' }, { status: 500 }) }
  const ids = (shares ?? []).map(s => s.family_id)
  const { data: fams } = ids.length ? await supabase.from('families').select('id, email').in('id', ids) : { data: [] as { id: string; email: string }[] }
  const people = (shares ?? []).map(s => ({ familyId: s.family_id, email: fams?.find(f => f.id === s.family_id)?.email ?? '—', since: s.created_at }))
  const { data: inv, error: e2 } = await supabase.from('child_invites').select('code, expires_at').eq('child_id', o.childId).gt('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false }).limit(1).maybeSingle()
  if (e2) { console.error('Condivisione: tabella child_invites non pronta', e2.message); return NextResponse.json({ error: 'La condivisione non è ancora attiva' }, { status: 500 }) }
  return NextResponse.json({ people, invite: inv ?? null })
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const o = await own(ctx); if (o instanceof Response) return o
  const { ok } = rateLimit(`share:${getIp(req)}:${o.familyId}`, 10, 60 * 60 * 1000)
  if (!ok) return NextResponse.json({ error: 'Troppi codici in poco tempo: riprova più tardi' }, { status: 429 })
  const supabase = getSupabase()
  await supabase.from('child_invites').delete().eq('child_id', o.childId)            // un solo codice valido alla volta
  const expires_at = new Date(Date.now() + HOURS * 3600 * 1000).toISOString()
  for (let i = 0; i < 4; i++) {                                                        // se il codice esiste già (molto raro), se ne fa un altro
    const code = newCode()
    const { error } = await supabase.from('child_invites').insert({ code, child_id: o.childId, family_id: o.familyId, expires_at })
    if (!error) return NextResponse.json({ invite: { code, expires_at } })
    if (error.code !== '23505') { console.error('Condivisione: codice non creato', error.message); return NextResponse.json({ error: 'La condivisione non è ancora attiva' }, { status: 500 }) }
  }
  return NextResponse.json({ error: 'Riprova' }, { status: 500 })
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const o = await own(ctx); if (o instanceof Response) return o
  const supabase = getSupabase(), q = req.nextUrl.searchParams
  if (q.get('invite')) await supabase.from('child_invites').delete().eq('child_id', o.childId)
  const fam = q.get('family')
  if (fam) await supabase.from('child_shares').delete().eq('child_id', o.childId).eq('family_id', fam)
  return NextResponse.json({ ok: true })
}
