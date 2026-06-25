import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getParentFamilyId } from '@/lib/session'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const { id } = await params

  const { data: item } = await supabase
    .from('schedule_items')
    .select('photo_url')
    .eq('id', id)
    .eq('family_id', familyId)
    .single()

  if (item?.photo_url) {
    const path = item.photo_url.split('/').pop()
    if (path) {
      await supabase.storage.from(process.env.SUPABASE_STORAGE_BUCKET!).remove([path])
    }
  }

  const { error } = await supabase.from('schedule_items').delete().eq('id', id).eq('family_id', familyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const supabase = getSupabase()
  const { id } = await params
  const body = await req.json()

  const { data, error } = await supabase
    .from('schedule_items')
    .update(body)
    .eq('id', id)
    .eq('family_id', familyId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}