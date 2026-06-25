import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getParentFamilyId } from '@/lib/session'

export async function GET() {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('schedule_items')
    .select('*')
    .eq('family_id', familyId)
    .order('day_of_week')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const { day_of_week, name, icon, sort_order } = await req.json()

  const { data, error } = await supabase
    .from('schedule_items')
    .insert({ day_of_week, name, icon, sort_order, family_id: familyId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}