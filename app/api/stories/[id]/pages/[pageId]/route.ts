import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getParentFamilyId } from '@/lib/session'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; pageId: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const { id, pageId } = await params
  const supabase = getSupabase()

  const { data: page } = await supabase
    .from('story_pages')
    .select('photo_url')
    .eq('id', pageId)
    .eq('story_id', id)
    .eq('family_id', familyId)
    .single()

  if (page?.photo_url) {
    const parts = page.photo_url.split('/object/public/')
    if (parts[1]) {
      const filePath = parts[1].replace(`${process.env.SUPABASE_STORAGE_BUCKET}/`, '')
      await supabase.storage.from(process.env.SUPABASE_STORAGE_BUCKET!).remove([filePath])
    }
  }

  const { error } = await supabase
    .from('story_pages')
    .delete()
    .eq('id', pageId)
    .eq('story_id', id)
    .eq('family_id', familyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; pageId: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const { id, pageId } = await params
  const body = await req.json()
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('story_pages')
    .update(body)
    .eq('id', pageId)
    .eq('story_id', id)
    .eq('family_id', familyId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}