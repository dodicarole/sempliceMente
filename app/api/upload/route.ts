import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireParent } from '@/lib/session'

export async function POST(req: NextRequest) {
  const denied = await requireParent()
  if (denied) return denied

  const form = await req.formData()
  const file   = form.get('file')   as File | null
  const itemId = form.get('itemId') as string | null
  const table  = (form.get('table') as string | null) ?? 'schedule_items'

  if (!file || !itemId) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
  }

  const ext      = file.name.split('.').pop() ?? 'jpg'
  const folder   = table === 'routine_items' ? 'routine/' : table === 'agenda_items' ? 'agenda/' : ''
  const filename = `${folder}${itemId}.${ext}`
  const bucket   = process.env.SUPABASE_STORAGE_BUCKET!

  const { error: uploadError } = await getSupabase().storage
    .from(bucket)
    .upload(filename, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = getSupabase().storage.from(bucket).getPublicUrl(filename)

  const supabase = getSupabase()
  const { error: updateError } = await supabase
    .from(table)
    .update({ photo_url: publicUrl })
    .eq('id', itemId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ photo_url: publicUrl })
}