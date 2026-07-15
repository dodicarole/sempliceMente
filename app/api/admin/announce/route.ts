import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getSupabase } from '@/lib/supabase'

export const maxDuration = 60

// Invia un'email di annuncio a tutte le famiglie registrate.
// Protetto da ANNOUNCE_SECRET (header Authorization: Bearer <secret>).
// Body: { subject, html, dryRun? } — con dryRun risponde solo col numero di destinatari.
export async function POST(req: NextRequest) {
  const secret = process.env.ANNOUNCE_SECRET
  const auth = req.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { subject, html, dryRun } = await req.json()
  if (!subject || !html) {
    return NextResponse.json({ error: 'subject e html richiesti' }, { status: 400 })
  }

  const supabase = getSupabase()
  const { data: families, error } = await supabase.from('families').select('email')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const emails = [...new Set(families.map(f => f.email))]
  if (dryRun) return NextResponse.json({ recipients: emails.length, emails })

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY non configurata' }, { status: 500 })
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const from = process.env.EMAIL_FROM ?? 'SempliceMente Bimbi <news@semplicementebimbi.it>'

  // batch.send accetta max 100 email per chiamata
  const failed: string[] = []
  let sent = 0
  for (let i = 0; i < emails.length; i += 100) {
    const chunk = emails.slice(i, i + 100)
    const { error: sendError } = await resend.batch.send(
      chunk.map(to => ({ from, to, subject, html }))
    )
    if (sendError) failed.push(`batch ${i / 100 + 1}: ${sendError.message}`)
    else sent += chunk.length
  }

  return NextResponse.json({ recipients: emails.length, sent, failed })
}