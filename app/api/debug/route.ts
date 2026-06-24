import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    SUPABASE_URL: process.env.SUPABASE_URL ? '✅ presente' : '❌ mancante',
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? '✅ presente' : '❌ mancante',
    SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET ? '✅ presente' : '❌ mancante',
    SESSION_SECRET: process.env.SESSION_SECRET ? '✅ presente' : '❌ mancante',
  })
}
