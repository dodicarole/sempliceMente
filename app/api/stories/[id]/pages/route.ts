import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getParentFamilyId } from '@/lib/session'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const { id } = await params
  const supabase = getSupabase()
  const { text, icon, sort_order } = await req.json()
  if (!text) return NextResponse.json({ error: 'Testo richiesto' }, { status: 400 })

  const { data: story } = await supabase
    .from('stories')
    .select('id')
    .eq('id', id)
    .eq('family_id', familyId)
    .single()
  if (!story) return NextResponse.json({ error: 'Storia non trovata' }, { status: 404 })

  const { data, error } = await supabase
    .from('story_pages')
    .insert({ story_id: id, text, icon: icon ?? '', sort_order: sort_order ?? 0, family_id: familyId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}