-- ============================================================================
-- SempliceMente Bimbi — creazione completa del database da zero
-- ============================================================================
--
-- USO: copia TUTTO questo file e incollalo nel SQL Editor di Supabase
--      (Dashboard → SQL Editor → New query → Run ▶)
--
-- Serve per creare un ambiente nuovo (dev, staging) senza dover eseguire in
-- sequenza i 6 file schema separati, che hanno un ordine obbligatorio.
--
-- NOTA: non inserisce dati di esempio. Ogni famiglia riceve i propri contenuti
--       di default alla registrazione, tramite lib/seedDefaults.ts.
--
-- NOTA SICUREZZA: RLS è disabilitato su tutte le tabelle perché l'app accede
--       al DB solo lato server con la service key (lib/supabase.ts). Non
--       esporre mai SUPABASE_SERVICE_KEY al browser.
--
-- Dopo aver eseguito questo script, crea anche il bucket storage:
--       Dashboard → Storage → New bucket → nome "photos" → Public bucket ✓
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Famiglie (account genitore)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.families (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ----------------------------------------------------------------------------
-- 2. Materiali scolastici (cosa mettere nello zaino, per giorno)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schedule_items (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id    UUID        REFERENCES public.families(id) ON DELETE CASCADE,
  day_of_week  SMALLINT    NOT NULL CHECK (day_of_week BETWEEN 0 AND 4),
  name         TEXT        NOT NULL,
  icon         TEXT        NOT NULL DEFAULT '📚',
  photo_url    TEXT,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ----------------------------------------------------------------------------
-- 3. Routine del mattino
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routine_items (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id  UUID        REFERENCES public.families(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  icon       TEXT        NOT NULL DEFAULT '✅',
  photo_url  TEXT,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ----------------------------------------------------------------------------
-- 4. Impostazioni app (PIN hash, flag defaults_seeded, ecc.)
--    Chiave composta: una riga per (chiave, famiglia)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_settings (
  key        TEXT        NOT NULL,
  family_id  UUID        REFERENCES public.families(id) ON DELETE CASCADE,
  value      TEXT        NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (key, family_id)
);


-- ----------------------------------------------------------------------------
-- 5. Agenda settimanale (attività con orario)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.agenda_items (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id    UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  day_of_week  SMALLINT    NOT NULL CHECK (day_of_week BETWEEN 0 AND 4),
  time_start   TIME        NOT NULL,
  name         TEXT        NOT NULL,
  icon         TEXT        NOT NULL DEFAULT '📅',
  photo_url    TEXT,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ----------------------------------------------------------------------------
-- 6. Tabella delle emozioni
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.emotion_items (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id  UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  key        TEXT        NOT NULL,
  name       TEXT        NOT NULL,
  icon       TEXT        NOT NULL,
  photo_url  TEXT,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (family_id, key)
);


-- ----------------------------------------------------------------------------
-- 7. Storie sociali (storia → pagine)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stories (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id  UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  icon       TEXT        NOT NULL DEFAULT '📖',
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_pages (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id  UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  story_id   UUID        NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  text       TEXT        NOT NULL,
  icon       TEXT        NOT NULL DEFAULT '',
  photo_url  TEXT,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ----------------------------------------------------------------------------
-- 8. Disabilita RLS su tutte le tabelle
--    (l'accesso avviene solo lato server con la service key)
-- ----------------------------------------------------------------------------
ALTER TABLE public.families       DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_items  DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_items   DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_items  DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories        DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_pages    DISABLE ROW LEVEL SECURITY;
