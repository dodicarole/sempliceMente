import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getParentFamilyId } from '@/lib/session'

export async function GET() {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('agenda_items')
    .select('*')
    .eq('family_id', familyId)
    .order('day_of_week')
    .order('time_start')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const { day_of_week, time_start, name, icon, sort_order } = await req.json()
  if (!name || time_start === undefined) {
    return NextResponse.json({ error: 'Nome e orario richiesti' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('agenda_items')
    .insert({ day_of_week, time_start, name, icon: icon ?? '📅', sort_order: sort_order ?? 0, family_id: familyId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}