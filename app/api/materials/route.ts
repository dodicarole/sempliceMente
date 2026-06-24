import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireParent } from '@/lib/session'

// GET /api/materials — pubblica, usata dalla child view
export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('schedule_items')
    .select('*')
    .order('day_of_week')
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ items: data })
}

// POST /api/materials — solo genitore autenticato
export async function POST(req: NextRequest) {
  const denied = await requireParent()
  if (denied) return denied

  const supabase = getSupabase()
  const body = await req.json()
  const { day_of_week, name, icon, sort_order } = body

  const { data, error } = await supabase
    .from('schedule_items')
    .insert({ day_of_week, name, icon, sort_order })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ item: data }, { status: 201 })
}