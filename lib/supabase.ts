import { createClient } from '@supabase/supabase-js'

// Lazy: il client viene creato solo alla prima chiamata, non durante la build
export function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )
}