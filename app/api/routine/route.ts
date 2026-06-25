import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireParent } from '@/lib/session'

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('routine_items')
    .select('*')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

export async function POST(req: NextRequest) {
  const denied = await requireParent()
  if (denied) return denied

  const supabase = getSupabase()
  const { name, icon, sort_order } = await req.json()
  if (!name) return NextResponse.json({ error: 'Nome richiesto' }, { status: 400 })

  const { data, error } = await supabase
    .from('routine_items')
    .insert({ name, icon: icon ?? '✅', sort_order: sort_order ?? 0 })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}