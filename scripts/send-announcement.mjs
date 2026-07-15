// Invia un annuncio a tutte le famiglie registrate tramite /api/admin/announce.
//
// Uso:
//   ANNOUNCE_SECRET=xxx node scripts/send-announcement.mjs emails/annuncio.html "Oggetto" [--dry-run]
//
// Con --dry-run mostra solo quanti destinatari riceverebbero l'email.
import { readFileSync } from 'node:fs'

const APP_URL = process.env.APP_URL ?? 'https://semplicementebimbi.it'
const secret = process.env.ANNOUNCE_SECRET

const [, , htmlPath, subject] = process.argv
const dryRun = process.argv.includes('--dry-run')

if (!secret) {
  console.error('Imposta ANNOUNCE_SECRET (lo stesso configurato su Vercel).')
  process.exit(1)
}
if (!htmlPath || !subject) {
  console.error('Uso: node scripts/send-announcement.mjs <file.html> "<oggetto>" [--dry-run]')
  process.exit(1)
}

const html = readFileSync(htmlPath, 'utf8')

const res = await fetch(`${APP_URL}/api/admin/announce`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ subject, html, dryRun }),
})

const body = await res.json()
if (!res.ok) {
  console.error(`Errore ${res.status}:`, body.error ?? body)
  process.exit(1)
}
console.log(dryRun ? 'Anteprima (nessuna email inviata):' : 'Invio completato:', body)