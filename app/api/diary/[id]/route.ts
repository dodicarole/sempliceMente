import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { diaryAccess, forbidden } from '@/lib/diaryServer'

/** Segnare un compito come fatto (tutti) o cambiare una voce (chi può compilare il diario) */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const a = await diaryAccess()
  if (a instanceof Response) return a
  const { id } = await params
  const body = await req.json()
  const changes: Record<string, unknown> = {}
  if (typeof body.done === 'boolean') changes.done = body.done
  if (a.canEdit) {
    if (typeof body.note === 'string') changes.note = body.note.slice(0, 300)
    if (typeof body.subject === 'string') changes.subject = body.subject.slice(0, 40)
  } else if (Object.keys(body).some(k => k !== 'done')) return forbidden()
  const { data, error } = await getSupabase().from('school_diary').update(changes).eq('id', id).eq('family_id', a.familyId).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

/** Togliere una voce (e la sua foto) */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const a = await diaryAccess()
  if (a instanceof Response) return a
  if (!a.canEdit) return forbidden()
  const { id } = await params
  const supabase = getSupabase()
  const { data: item } = await supabase.from('school_diary').select('photo_url').eq('id', id).eq('family_id', a.familyId).maybeSingle()
  if (item?.photo_url) {
    const parts = item.photo_url.split('/object/public/')
    if (parts[1]) await supabase.storage.from(process.env.SUPABASE_STORAGE_BUCKET!).remove([parts[1].replace(`${process.env.SUPABASE_STORAGE_BUCKET}/`, '')])
  }
  const { error } = await supabase.from('school_diary').delete().eq('id', id).eq('family_id', a.familyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
