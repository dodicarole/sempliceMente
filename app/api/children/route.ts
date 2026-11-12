import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getOwnFamilyId, getOwnParentFamilyId } from '@/lib/session'
import { DEFAULT_SCHEDULE, DEFAULT_ROUTINE, DEFAULT_AGENDA } from '@/lib/defaults'
import { hiddenOf } from '@/lib/homeSections'

const AVATARS = ['tedo', 'meky', 'zoe', 'lila', 'nico', 'amina', 'elio', 'nour']
const GENDERS = ['m', 'f', 'n']

/** I figli della famiglia, per la schermata "Chi usa l'app?" e per l'area Genitore */
export async function GET() {
  const familyId = await getOwnFamilyId()
  if (familyId instanceof Response) return familyId
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('children').select('id, name, gender, avatar, sort_order, settings')
    .eq('family_id', familyId).order('sort_order').order('created_at')
  if (error) return NextResponse.json({ error: error.message, children: [] }, { status: 500 })
  // i bambini che un altro adulto ha condiviso con questo account (in fondo all'elenco)
  let shared: typeof data = []
  const { data: links } = await supabase.from('child_shares').select('child_id').eq('family_id', familyId)
  if (links?.length) {
    const { data: kids } = await supabase.from('children').select('id, name, gender, avatar, sort_order, settings')
      .in('id', links.map(l => l.child_id)).order('created_at')
    shared = (kids ?? []).map((k, i) => ({ ...k, sort_order: 1000 + i, shared: true }))
  }
  return NextResponse.json({ children: [...data, ...shared] })
}

/** Un nuovo figlio (solo il genitore): parte con zaino, routine e agenda di esempio, come il primo */
export async function POST(req: NextRequest) {
  const familyId = await getOwnParentFamilyId()
  if (familyId instanceof Response) return familyId
  const body = await req.json().catch(() => ({}))
  const name = String(body.name ?? '').trim().slice(0, 40)
  const gender = GENDERS.includes(body.gender) ? body.gender : 'n'
  const avatar = AVATARS.includes(body.avatar) ? body.avatar : 'tedo'
  const settings = { hidden: hiddenOf({ hidden: body.hidden }) }
  if (!name) return NextResponse.json({ error: 'Nome richiesto' }, { status: 400 })

  const supabase = getSupabase()
  const { count } = await supabase.from('children').select('id', { count: 'exact', head: true }).eq('family_id', familyId)
  if ((count ?? 0) >= 8) return NextResponse.json({ error: 'Al massimo 8 figli' }, { status: 400 })

  const { data: child, error } = await supabase
    .from('children').insert({ family_id: familyId, name, gender, avatar, settings, sort_order: count ?? 0 })
    .select('id, name, gender, avatar, sort_order, settings').single()
  if (error || !child) return NextResponse.json({ error: error?.message ?? 'Errore' }, { status: 500 })

  const own = { family_id: familyId, child_id: child.id }
  await Promise.all([
    supabase.from('schedule_items').insert(DEFAULT_SCHEDULE.map(item => ({ ...item, ...own }))),
    supabase.from('routine_items').insert(DEFAULT_ROUTINE.map(item => ({ ...item, ...own }))),
    supabase.from('agenda_items').insert(DEFAULT_AGENDA.map(item => ({ ...item, ...own }))),
  ])
  return NextResponse.json({ child }, { status: 201 })
}
