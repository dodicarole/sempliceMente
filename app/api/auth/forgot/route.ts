import { NextRequest, NextResponse } from 'next/server'
import { randomBytes, createHash } from 'crypto'
import { Resend } from 'resend'
import { getSupabase } from '@/lib/supabase'
import { rateLimit, getIp } from '@/lib/rateLimit'

const HOURS = 1
const sha = (s: string) => createHash('sha256').update(s).digest('hex')
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

const TXT = {
  it: { subject: 'Reimposta la tua password di SempliceMente', hello: 'Ciao!', body: 'Abbiamo ricevuto una richiesta per reimpostare la password del tuo account SempliceMente.', btn: 'Scegli una nuova password',
        valid: `Il link vale ${HOURS} ora e si può usare una volta sola.`, notYou: 'Se non sei stato tu a chiederlo, ignora questa email: la tua password resta quella di prima.' },
  fr: { subject: 'Réinitialisez votre mot de passe SempliceMente', hello: 'Bonjour !', body: 'Nous avons reçu une demande pour réinitialiser le mot de passe de votre compte SempliceMente.', btn: 'Choisir un nouveau mot de passe',
        valid: `Le lien est valable ${HOURS} heure et ne peut servir qu’une fois.`, notYou: 'Si vous n’êtes pas à l’origine de cette demande, ignorez cet e-mail : votre mot de passe ne change pas.' },
}

/**
 * "Ho dimenticato la password": se l'email è registrata, manda un link per sceglierne una nuova.
 * La risposta è SEMPRE la stessa, così nessuno può scoprire quali email sono registrate.
 */
export async function POST(req: NextRequest) {
  const ip = getIp(req)
  const { ok } = rateLimit(`forgot:${ip}`, 5, 60 * 60 * 1000)
  if (!ok) return NextResponse.json({ error: 'Troppi tentativi. Riprova più tardi.' }, { status: 429 })

  const body = await req.json().catch(() => ({}))
  const email = String(body.email ?? '').toLowerCase().trim()
  const lang: 'it' | 'fr' = body.lang === 'fr' ? 'fr' : 'it'
  const done = NextResponse.json({ ok: true })
  if (!email || email.length > 200) return done

  // anche per la stessa email, pochi invii: così nessuno può riempire la casella di qualcun altro
  if (!rateLimit(`forgot-mail:${email}`, 3, 60 * 60 * 1000).ok) return done

  const supabase = getSupabase()
  const { data: family } = await supabase.from('families').select('id').eq('email', email).maybeSingle()
  if (!family) return done

  if (!process.env.RESEND_API_KEY) { console.error('Recupero password: RESEND_API_KEY non configurata'); return done }

  // un link nuovo annulla quelli di prima
  const token = randomBytes(32).toString('base64url')
  await supabase.from('password_resets').delete().eq('family_id', family.id)
  const { error } = await supabase.from('password_resets').insert({ token_hash: sha(token), family_id: family.id, expires_at: new Date(Date.now() + HOURS * 3600 * 1000).toISOString() })
  if (error) { console.error('Recupero password: tabella password_resets mancante?', error.message); return done }

  // l'indirizzo dell'app: quello impostato, oppure quello da cui arriva la richiesta
  const base = (process.env.APP_URL ?? req.nextUrl.origin).replace(/\/$/, '')
  const link = `${base}/?reset=${token}`
  const T = TXT[lang]
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'SempliceMente Bimbi <news@semplicementebimbi.it>',
      to: email,
      subject: T.subject,
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;color:#1F2147">
        <p style="font-size:28px;margin:0">🌟</p>
        <h2 style="margin:8px 0">${esc(T.hello)}</h2>
        <p>${esc(T.body)}</p>
        <p style="margin:24px 0"><a href="${link}" style="background:#48B97A;color:#fff;padding:14px 22px;border-radius:12px;text-decoration:none;font-weight:bold">${esc(T.btn)}</a></p>
        <p style="color:#6870A0;font-size:14px">${esc(T.valid)}</p>
        <p style="color:#6870A0;font-size:14px">${esc(T.notYou)}</p>
      </div>`,
      text: `${T.hello}\n\n${T.body}\n\n${T.btn}: ${link}\n\n${T.valid}\n${T.notYou}`,
    })
  } catch (e) { console.error('Recupero password: invio non riuscito', e) }
  return done
}
