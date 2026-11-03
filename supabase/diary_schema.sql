-- ════════════════════════════════════════════════════════════════════
-- Il mio diario di scuola: compiti, verifiche, cose da portare, gite e
-- giorni senza scuola, per ogni figlio.
-- (L'orario della settimana e le impostazioni del diario sono salvati
--  nelle impostazioni del figlio: non serve una tabella.)
-- Esegui questo script nell'SQL Editor di Supabase.
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.school_diary (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id   UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  child_id    UUID        REFERENCES public.children(id) ON DELETE CASCADE,
  day         DATE        NOT NULL,
  type        TEXT        NOT NULL CHECK (type IN ('compiti', 'verifica', 'portare', 'gita', 'vacanza')),
  subject     TEXT        NOT NULL DEFAULT '',
  note        TEXT        NOT NULL DEFAULT '',
  photo_url   TEXT,
  done        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS school_diary_child_day ON public.school_diary (family_id, child_id, day);

-- Come le altre tabelle: si accede solo dal server dell'app
ALTER TABLE public.school_diary ENABLE ROW LEVEL SECURITY;

-- Controllo (facoltativo): deve restituire 0 righe e nessun errore
-- SELECT * FROM public.school_diary LIMIT 1;
