-- ════════════════════════════════════════════════════════════════════
-- Recupero della password: i link "reimposta la password" mandati per email.
-- Nel database NON c'è il codice del link, ma solo la sua impronta (SHA-256):
-- anche chi leggesse la tabella non potrebbe usarlo.
-- Ogni link vale 1 ora e si usa una volta sola.
-- Esegui questo script nell'SQL Editor di Supabase.
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.password_resets (
  token_hash  TEXT        PRIMARY KEY,
  family_id   UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS password_resets_family ON public.password_resets (family_id);

-- Come le altre tabelle: si accede solo dal server dell'app
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;
