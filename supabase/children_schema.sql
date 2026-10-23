-- ============================================================================
-- SempliceMente · Passo 1: più figli per famiglia + protezione per riga
-- Da eseguire UNA volta nell'SQL Editor di Supabase.
-- Lo script si può rieseguire senza danni e NON cancella nessun dato.
-- L'app attuale continua a funzionare: i nuovi dati vanno in automatico
-- al primo figlio finché non arriva il passo 2.
-- ============================================================================
BEGIN;

-- 1. Protezione per riga (RLS) su tutte le tabelle -------------------------
-- L'app legge e scrive solo dal server con la chiave di servizio, che non è
-- toccata dalla protezione. Senza regole, chiunque usi la chiave pubblica
-- (anon) non vede nulla: è una difesa in più.
ALTER TABLE public.families       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agenda_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_pages    ENABLE ROW LEVEL SECURITY;

-- 2. I profili dei figli ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.children (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id   UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL DEFAULT '',
  gender      TEXT        NOT NULL DEFAULT 'n' CHECK (gender IN ('m', 'f', 'n')),
  avatar      TEXT        NOT NULL DEFAULT 'tedo',      -- l'amico scelto: tedo, meky, zoe, lila, nico, amina, elio, nour
  sort_order  INT         NOT NULL DEFAULT 0,
  settings    JSONB       NOT NULL DEFAULT '{}'::jsonb, -- impostazioni di lettura, giochi, stelline…
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS children_family_idx ON public.children (family_id, sort_order);

-- 3. A quale figlio appartiene ogni dato -----------------------------------
-- Per ogni figlio: zaino, routine, agenda, emozioni.
ALTER TABLE public.schedule_items ADD COLUMN IF NOT EXISTS child_id UUID REFERENCES public.children(id) ON DELETE CASCADE;
ALTER TABLE public.routine_items  ADD COLUMN IF NOT EXISTS child_id UUID REFERENCES public.children(id) ON DELETE CASCADE;
ALTER TABLE public.agenda_items   ADD COLUMN IF NOT EXISTS child_id UUID REFERENCES public.children(id) ON DELETE CASCADE;
ALTER TABLE public.emotion_items  ADD COLUMN IF NOT EXISTS child_id UUID REFERENCES public.children(id) ON DELETE CASCADE;
-- Storie: vuoto = per tutti i figli; pieno = solo per quel figlio.
ALTER TABLE public.stories        ADD COLUMN IF NOT EXISTS child_id UUID REFERENCES public.children(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS schedule_items_child_idx ON public.schedule_items (child_id);
CREATE INDEX IF NOT EXISTS routine_items_child_idx  ON public.routine_items  (child_id);
CREATE INDEX IF NOT EXISTS agenda_items_child_idx   ON public.agenda_items   (child_id);
CREATE INDEX IF NOT EXISTS emotion_items_child_idx  ON public.emotion_items  (child_id);
CREATE INDEX IF NOT EXISTS stories_child_idx        ON public.stories        (child_id);

-- 4. Un primo figlio per ogni famiglia che esiste già ----------------------
-- Il nome e il genere oggi sono salvati sul telefono: li riprenderà l'app
-- al passo 2, per ora il profilo nasce senza nome.
INSERT INTO public.children (family_id)
SELECT f.id FROM public.families f
WHERE NOT EXISTS (SELECT 1 FROM public.children c WHERE c.family_id = f.id);

-- 5. Tutti i dati esistenti vanno al primo figlio della famiglia ------------
CREATE OR REPLACE FUNCTION public.first_child_of(fam UUID) RETURNS UUID
LANGUAGE sql STABLE SET search_path = public AS $$
  SELECT id FROM public.children WHERE family_id = fam ORDER BY sort_order, created_at LIMIT 1
$$;

UPDATE public.schedule_items SET child_id = public.first_child_of(family_id) WHERE child_id IS NULL AND family_id IS NOT NULL;
UPDATE public.routine_items  SET child_id = public.first_child_of(family_id) WHERE child_id IS NULL AND family_id IS NOT NULL;
UPDATE public.agenda_items   SET child_id = public.first_child_of(family_id) WHERE child_id IS NULL AND family_id IS NOT NULL;
UPDATE public.emotion_items  SET child_id = public.first_child_of(family_id) WHERE child_id IS NULL AND family_id IS NOT NULL;

-- 6. Le emozioni sono uniche per figlio, non più per famiglia ---------------
ALTER TABLE public.emotion_items DROP CONSTRAINT IF EXISTS emotion_items_family_id_key_key;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'emotion_items_child_key_unique') THEN
    ALTER TABLE public.emotion_items ADD CONSTRAINT emotion_items_child_key_unique UNIQUE (child_id, key);
  END IF;
END $$;

-- 7. Ogni nuova famiglia nasce con il suo primo figlio -----------------------
CREATE OR REPLACE FUNCTION public.create_first_child() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.children (family_id) VALUES (NEW.id);
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS families_first_child ON public.families;
CREATE TRIGGER families_first_child AFTER INSERT ON public.families
  FOR EACH ROW EXECUTE FUNCTION public.create_first_child();

-- 8. Un dato salvato senza figlio va al primo figlio --------------------------
-- Così l'app di oggi, che non conosce ancora i figli, continua a funzionare.
CREATE OR REPLACE FUNCTION public.default_child() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.child_id IS NULL AND NEW.family_id IS NOT NULL THEN
    NEW.child_id := public.first_child_of(NEW.family_id);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS schedule_items_default_child ON public.schedule_items;
CREATE TRIGGER schedule_items_default_child BEFORE INSERT ON public.schedule_items FOR EACH ROW EXECUTE FUNCTION public.default_child();
DROP TRIGGER IF EXISTS routine_items_default_child ON public.routine_items;
CREATE TRIGGER routine_items_default_child  BEFORE INSERT ON public.routine_items  FOR EACH ROW EXECUTE FUNCTION public.default_child();
DROP TRIGGER IF EXISTS agenda_items_default_child ON public.agenda_items;
CREATE TRIGGER agenda_items_default_child   BEFORE INSERT ON public.agenda_items   FOR EACH ROW EXECUTE FUNCTION public.default_child();
DROP TRIGGER IF EXISTS emotion_items_default_child ON public.emotion_items;
CREATE TRIGGER emotion_items_default_child  BEFORE INSERT ON public.emotion_items  FOR EACH ROW EXECUTE FUNCTION public.default_child();

COMMIT;

-- ============================================================================
-- CONTROLLO (da eseguire dopo, a parte): ogni riga deve dire 0 nella colonna
-- "senza_figlio" e ogni famiglia deve avere almeno 1 figlio.
-- ============================================================================
-- SELECT 'zaino' AS tabella, COUNT(*) FILTER (WHERE child_id IS NULL) AS senza_figlio, COUNT(*) AS totale FROM public.schedule_items
-- UNION ALL SELECT 'routine', COUNT(*) FILTER (WHERE child_id IS NULL), COUNT(*) FROM public.routine_items
-- UNION ALL SELECT 'agenda',  COUNT(*) FILTER (WHERE child_id IS NULL), COUNT(*) FROM public.agenda_items
-- UNION ALL SELECT 'emozioni',COUNT(*) FILTER (WHERE child_id IS NULL), COUNT(*) FROM public.emotion_items;
-- SELECT COUNT(*) AS famiglie_senza_figli FROM public.families f WHERE NOT EXISTS (SELECT 1 FROM public.children c WHERE c.family_id = f.id);
