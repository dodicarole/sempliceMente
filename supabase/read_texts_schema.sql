-- ════════════════════════════════════════════════════════════════════
-- Leggo e capisco: i testi inseriti dal genitore (per esempio un testo
-- della scuola), divisi in pezzetti, con le domande e le parole nuove.
-- Esegui questo script nell'SQL Editor di Supabase.
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.read_texts (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id   UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  child_id    UUID        REFERENCES public.children(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  cover       TEXT        NOT NULL DEFAULT '📖',
  -- il contenuto: { words: [[parola, spiegazione]], parts: [{ text: [frasi], q: {...} | null }], seq: [momenti] }
  content     JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS read_texts_family_child ON public.read_texts (family_id, child_id);

-- Come le altre tabelle: si accede solo dal server dell'app
ALTER TABLE public.read_texts ENABLE ROW LEVEL SECURITY;

-- Controllo (facoltativo): deve restituire 0 righe e nessun errore
-- SELECT * FROM public.read_texts LIMIT 1;
