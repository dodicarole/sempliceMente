import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { diaryAccess, DIARY_TYPES, forbidden } from '@/lib/diaryServer'

/** Le voci del diario del figlio, da una data a un'altra (?from=2026-11-01&to=2026-11-30) */
export async function GET(req: NextRequest) {
  const a = await diaryAccess()
  if (a instanceof Response) return a
  const from = req.nextUrl.searchParams.get('from'), to = req.nextUrl.searchParams.get('to')
  let q = getSupabase().from('school_diary').select('*').eq('family_id', a.familyId)
  if (a.childId) q = q.eq('child_id', a.childId)
  if (from) q = q.gte('day', from)
  if (to) q = q.lte('day', to)
  const { data, error } = await q.order('day').order('created_at')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data, canEdit: a.canEdit })
}

/** Una voce nuova */
export async function POST(req: NextRequest) {
  const a = await diaryAccess()
  if (a instanceof Response) return a
  if (!a.canEdit) return forbidden()
  const { day, type, subject, note } = await req.json()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(day)) || !DIARY_TYPES.includes(type)) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 })
  const { data, error } = await getSupabase().from('school_diary').insert({
    family_id: a.familyId, ...(a.childId ? { child_id: a.childId } : {}),
    day, type, subject: String(subject ?? '').slice(0, 40), note: String(note ?? '').slice(0, 300),
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}
