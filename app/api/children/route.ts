import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getParentFamilyId } from '@/lib/session'
import { DEFAULT_SCHEDULE, DEFAULT_ROUTINE, DEFAULT_AGENDA } from '@/lib/defaults'

const AVATARS = ['tedo', 'meky', 'zoe', 'lila', 'nico', 'amina', 'elio', 'nour']
const GENDERS = ['m', 'f', 'n']

/** I figli della famiglia, per la schermata "Chi usa l'app?" e per l'area Genitore */
export async function GET() {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId
  const { data, error } = await getSupabase()
    .from('children').select('id, name, gender, avatar, sort_order')
    .eq('family_id', familyId).order('sort_order').order('created_at')
  if (error) return NextResponse.json({ error: error.message, children: [] }, { status: 500 })
  return NextResponse.json({ children: data })
}

/** Un nuovo figlio (solo il genitore): parte con zaino, routine e agenda di esempio, come il primo */
export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId
  const body = await req.json().catch(() => ({}))
  const name = String(body.name ?? '').trim().slice(0, 40)
  const gender = GENDERS.includes(body.gender) ? body.gender : 'n'
  const avatar = AVATARS.includes(body.avatar) ? body.avatar : 'tedo'
  if (!name) return NextResponse.json({ error: 'Nome richiesto' }, { status: 400 })

  const supabase = getSupabase()
  const { count } = await supabase.from('children').select('id', { count: 'exact', head: true }).eq('family_id', familyId)
  if ((count ?? 0) >= 8) return NextResponse.json({ error: 'Al massimo 8 figli' }, { status: 400 })

  const { data: child, error } = await supabase
    .from('children').insert({ family_id: familyId, name, gender, avatar, sort_order: count ?? 0 })
    .select('id, name, gender, avatar, sort_order').single()
  if (error || !child) return NextResponse.json({ error: error?.message ?? 'Errore' }, { status: 500 })

  const own = { family_id: familyId, child_id: child.id }
  await Promise.all([
    supabase.from('schedule_items').insert(DEFAULT_SCHEDULE.map(item => ({ ...item, ...own }))),
    supabase.from('routine_items').insert(DEFAULT_ROUTINE.map(item => ({ ...item, ...own }))),
    supabase.from('agenda_items').insert(DEFAULT_AGENDA.map(item => ({ ...item, ...own }))),
  ])
  return NextResponse.json({ child }, { status: 201 })
}
