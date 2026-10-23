import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getParentFamilyId, getChildId } from '@/lib/session'

export async function GET() {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const childId = await getChildId(familyId)
  let query = supabase
    .from('routine_items')
    .select('*')
    .eq('family_id', familyId)
  if (childId) query = query.eq('child_id', childId)
  const { data, error } = await query
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const childId = await getChildId(familyId)
  const { name, icon, sort_order } = await req.json()
  if (!name) return NextResponse.json({ error: 'Nome richiesto' }, { status: 400 })

  const { data, error } = await supabase
    .from('routine_items')
    .insert({ name, icon: icon ?? '✅', sort_order: sort_order ?? 0, family_id: familyId, ...(childId ? { child_id: childId } : {}) })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}