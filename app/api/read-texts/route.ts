import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId, getParentFamilyId, getChildId } from '@/lib/session'
import { cleanReadContent } from '@/lib/readTexts'

/** I testi del figlio scelto (e quelli per tutti i figli) */
export async function GET() {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId
  const childId = await getChildId(familyId)
  let q = getSupabase().from('read_texts').select('*').eq('family_id', familyId)
  if (childId) q = q.or(`child_id.is.null,child_id.eq.${childId}`)
  const { data, error } = await q.order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

/** Un testo nuovo, per il figlio scelto (solo il genitore) */
export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId
  const childId = await getChildId(familyId)
  const body = await req.json().catch(() => ({}))
  const title = String(body.title ?? '').trim().slice(0, 80)
  const content = cleanReadContent(body.content)
  if (!title || !content.parts.length) return NextResponse.json({ error: 'Servono un titolo e almeno un pezzetto' }, { status: 400 })
  const { data, error } = await getSupabase().from('read_texts').insert({
    family_id: familyId, ...(childId ? { child_id: childId } : {}), title, cover: String(body.cover ?? '📖').slice(0, 8), content,
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}
