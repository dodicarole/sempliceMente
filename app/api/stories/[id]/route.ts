import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getParentFamilyId } from '@/lib/session'

function storagePathFromUrl(photoUrl: string): string | null {
  const parts = photoUrl.split('/object/public/')
  if (!parts[1]) return null
  return parts[1].replace(`${process.env.SUPABASE_STORAGE_BUCKET}/`, '')
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const { id } = await params
  const supabase = getSupabase()

  const { data: pages } = await supabase
    .from('story_pages')
    .select('photo_url')
    .eq('story_id', id)
    .eq('family_id', familyId)

  const paths = (pages ?? [])
    .map(p => p.photo_url ? storagePathFromUrl(p.photo_url) : null)
    .filter((p): p is string => !!p)
  if (paths.length > 0) {
    await supabase.storage.from(process.env.SUPABASE_STORAGE_BUCKET!).remove(paths)
  }

  const { error } = await supabase.from('stories').delete().eq('id', id).eq('family_id', familyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const { id } = await params
  const body = await req.json()
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('stories')
    .update(body)
    .eq('id', id)
    .eq('family_id', familyId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}