import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getParentFamilyId } from '@/lib/session'
import type { StoryPage } from '@/types'

export async function GET() {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const [storiesRes, pagesRes] = await Promise.all([
    supabase.from('stories').select('*').eq('family_id', familyId).order('sort_order'),
    supabase.from('story_pages').select('*').eq('family_id', familyId).order('sort_order'),
  ])

  if (storiesRes.error) return NextResponse.json({ error: storiesRes.error.message }, { status: 500 })
  if (pagesRes.error)   return NextResponse.json({ error: pagesRes.error.message },   { status: 500 })

  const stories = storiesRes.data.map(story => ({
    ...story,
    pages: (pagesRes.data as StoryPage[]).filter(p => p.story_id === story.id),
  }))

  return NextResponse.json({ stories })
}

export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const { title, icon, sort_order } = await req.json()
  if (!title) return NextResponse.json({ error: 'Titolo richiesto' }, { status: 400 })

  const { data, error } = await supabase
    .from('stories')
    .insert({ title, icon: icon || '📖', sort_order: sort_order ?? 0, family_id: familyId })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ story: data }, { status: 201 })
}