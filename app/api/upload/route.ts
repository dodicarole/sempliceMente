import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getParentFamilyId } from '@/lib/session'

// Tabelle che possono avere una foto, con la cartella in cui salvarla.
// Qualsiasi altro valore di "table" viene rifiutato.
const ALLOWED_TABLES: Record<string, string> = {
  schedule_items: '',
  routine_items:  'routine/',
  agenda_items:   'agenda/',
  emotion_items:  'emotions/',
  story_pages:    'stories/',
}

// Solo immagini, con l'estensione ricavata dal tipo reale del file
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
}

// Vercel non accetta richieste più grandi di circa 4,5 MB
const MAX_SIZE = 4.5 * 1024 * 1024

export async function POST(req: NextRequest) {
  const familyId = await getParentFamilyId()
  if (familyId instanceof Response) return familyId

  const form   = await req.formData()
  const file   = form.get('file')   as File | null
  const itemId = form.get('itemId') as string | null
  const table  = (form.get('table') as string | null) ?? 'schedule_items'

  if (!file || !itemId) {
    return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
  }

  if (!Object.prototype.hasOwnProperty.call(ALLOWED_TABLES, table)) {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 })
  }

  // Alcuni telefoni non indicano il tipo: in quel caso lo ricaviamo dal nome
  const nameExt  = (file.name.split('.').pop() ?? '').toLowerCase()
  const fromName = Object.entries(ALLOWED_TYPES).find(([, e]) => e === nameExt || (nameExt === 'jpeg' && e === 'jpg'))
  const mimeType = ALLOWED_TYPES[file.type] ? file.type : (!file.type && fromName ? fromName[0] : '')
  const ext      = ALLOWED_TYPES[mimeType]
  if (!ext) {
    return NextResponse.json({ error: 'Formato non supportato: carica una foto' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'La foto è troppo grande (massimo 4 MB)' }, { status: 400 })
  }

  const supabase = getSupabase()

  // L'elemento deve esistere e appartenere alla famiglia che sta caricando
  const { data: item } = await supabase
    .from(table)
    .select('id')
    .eq('id', itemId)
    .eq('family_id', familyId)
    .maybeSingle()

  if (!item) {
    return NextResponse.json({ error: 'Elemento non trovato' }, { status: 404 })
  }

  const filename = `${ALLOWED_TABLES[table]}${itemId}.${ext}`
  const bucket   = process.env.SUPABASE_STORAGE_BUCKET!

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, file, { upsert: true, contentType: mimeType })

  if (uploadError) {
    console.error('Upload foto fallito:', uploadError)
    return NextResponse.json({ error: 'Caricamento non riuscito' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(filename)

  const { error: updateError } = await supabase
    .from(table)
    .update({ photo_url: publicUrl })
    .eq('id', itemId)
    .eq('family_id', familyId)

  if (updateError) {
    console.error('Salvataggio foto fallito:', updateError)
    return NextResponse.json({ error: 'Salvataggio non riuscito' }, { status: 500 })
  }

  return NextResponse.json({ photo_url: publicUrl })
}
