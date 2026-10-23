import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getParentFamilyId } from '@/lib/session'
import { hiddenOf } from '@/lib/homeSections'

const AVATARS = ['tedo', 'meky', 'zoe', 'lila', 'nico', 'amina', 'elio', 'nour']
const GENDERS = ['m', 'f', 'n']

/** Nome, genere e amico di un figlio. Anche il bambino può scegliere il suo amico. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const patch: Record<string, unknown> = {}
  if (typeof body.name === 'string') patch.name = body.name.trim().slice(0, 40)
  if (GENDERS.includes(body.gender)) patch.gender = body.gender
  if (AVATARS.includes(body.avatar)) patch.avatar = body.avatar
  const supabase = getSupabase()
  // le sezioni visibili le sceglie solo il genitore (area Genitore sbloccata)
  if (Array.isArray(body.hidden)) {
    const parent = await getParentFamilyId()
    if (parent instanceof Response) return parent
    const { data: cur } = await supabase.from('children').select('settings').eq('id', id).eq('family_id', familyId).single()
    patch.settings = { ...((cur?.settings as object) ?? {}), hidden: hiddenOf({ hidden: body.hidden }) }
  }
  if (!Object.keys(patch).length) return NextResponse.json({ error: 'Niente da cambiare' }, { status: 400 })

  const { data, error } = await supabase
    .from('children').update(patch).eq('id', id).eq('family_id', familyId)
    .select('id, name, gender, avatar, sort_order, settings').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ child: data })
}

/** Elimina un figlio e i suoi dati (solo il genitore); deve restarne almeno uno */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId
  const { id } = await params
  const supabase = getSupabase()
  const { count } = await supabase.from('children').select('id', { count: 'exact', head: true }).eq('family_id', familyId)
  if ((count ?? 0) <= 1) return NextResponse.json({ error: 'Deve restare almeno un figlio' }, { status: 400 })
  const { error } = await supabase.from('children').delete().eq('id', id).eq('family_id', familyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
