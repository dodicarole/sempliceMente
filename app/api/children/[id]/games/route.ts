import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getFamilyId } from '@/lib/session'
import { SYNCED_KEYS } from '@/lib/childStore'

/**
 * Salva un'impostazione (o un progresso, come le stelline) di un figlio:
 * children.settings.games[key] = value. Le altre impostazioni restano com'erano.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const familyId = await getFamilyId()
  if (familyId instanceof Response) return familyId
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const key = String(body.key ?? '')
  if (!SYNCED_KEYS.includes(key)) return NextResponse.json({ error: 'Impostazione sconosciuta' }, { status: 400 })
  const value = body.value === null ? null : typeof body.value === 'string' ? body.value.slice(0, 20000) : undefined
  if (value === undefined) return NextResponse.json({ error: 'Valore non valido' }, { status: 400 })

  const supabase = getSupabase()
  const { data: cur, error: e1 } = await supabase.from('children').select('settings').eq('id', id).eq('family_id', familyId).single()
  if (e1 || !cur) return NextResponse.json({ error: 'Figlio non trovato' }, { status: 404 })
  const settings = (cur.settings as Record<string, unknown> | null) ?? {}
  const games = { ...((settings.games as Record<string, string | null>) ?? {}), [key]: value }
  const { error } = await supabase.from('children').update({ settings: { ...settings, games } }).eq('id', id).eq('family_id', familyId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
