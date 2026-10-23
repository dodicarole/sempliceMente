import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getParentFamilyId, getChildId } from '@/lib/session'

export async function GET() {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const childId = await getChildId(familyId)
  let query = supabase
    .from('schedule_items')
    .select('*')
    .eq('family_id', familyId)
  if (childId) query = query.eq('child_id', childId)
  const { data, error } = await query
    .order('day_of_week')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const childId = await getChildId(familyId)
  const { day_of_week, name, icon, sort_order } = await req.json()

  const { data, error } = await supabase
    .from('schedule_items')
    .insert({ day_of_week, name, icon, sort_order, family_id: familyId, ...(childId ? { child_id: childId } : {}) })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}