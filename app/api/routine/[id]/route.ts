import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireParent } from '@/lib/session'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireParent()
  if (denied) return denied

  const { id } = await params
  const supabase = getSupabase()

  const { data: item } = await supabase
    .from('routine_items')
    .select('photo_url')
    .eq('id', id)
    .single()

  if (item?.photo_url) {
    const parts = item.photo_url.split('/object/public/')
    if (parts[1]) {
      const filePath = parts[1].replace(`${process.env.SUPABASE_STORAGE_BUCKET}/`, '')
      await supabase.storage.from(process.env.SUPABASE_STORAGE_BUCKET!).remove([filePath])
    }
  }

  const { error } = await supabase.from('routine_items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireParent()
  if (denied) return denied

  const { id } = await params
  const body = await req.json()
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('routine_items')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}