import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getParentFamilyId } from '@/lib/session'
import { cleanReadContent } from '@/lib/readTexts'

/** Cambiare un testo (solo il genitore) */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const changes: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (typeof body.title === 'string' && body.title.trim()) changes.title = body.title.trim().slice(0, 80)
  if (typeof body.cover === 'string') changes.cover = body.cover.slice(0, 8)
  if (body.content) { const c = cleanReadContent(body.content); if (!c.parts.length) return NextResponse.json({ error: 'Serve almeno un pezzetto' }, { status: 400 }); changes.content = c }
  const { data, error } = await getSupabase().from('read_texts').update(changes).eq('id', id).eq('family_id', familyId).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data })
}

/** Togliere un testo (solo il genitore) */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId
  const { id } = await params
  const { error } = await getSupabase().from('read_texts').delete().eq('id', id).eq('family_id', familyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
