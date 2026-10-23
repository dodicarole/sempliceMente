import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getChildId } from '@/lib/session'
import { DEFAULT_EMOTIONS } from '@/types'

export async function GET() {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const childId = await getChildId(familyId)
  let query = supabase
    .from('emotion_items')
    .select('*')
    .eq('family_id', familyId)
  if (childId) query = query.eq('child_id', childId)
  const { data, error } = await query.order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (data.length > 0) return NextResponse.json({ items: data })

  const { data: seeded, error: seedError } = await supabase
    .from('emotion_items')
    .insert(DEFAULT_EMOTIONS.map((e, i) => ({ ...e, sort_order: i, family_id: familyId, ...(childId ? { child_id: childId } : {}) })))
    .select()
    .order('sort_order')

  if (seedError) return NextResponse.json({ error: seedError.message }, { status: 500 })
  return NextResponse.json({ items: seeded })
}