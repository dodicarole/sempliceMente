    -- Esegui questo script nell'SQL Editor di Supabase
    -- ATTENZIONE: rimuove i dati di esempio esistenti

    -- 1. Tabella famiglie (account genitore)
    CREATE TABLE public.families (
      id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
      email         TEXT        NOT NULL UNIQUE,
      password_hash TEXT        NOT NULL,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE public.families DISABLE ROW LEVEL SECURITY;

    -- 2. Aggiunge family_id a schedule_items e routine_items
    ALTER TABLE public.schedule_items ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE CASCADE;
    ALTER TABLE public.routine_items  ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE CASCADE;

    -- 3. Ristruttura app_settings per supportare più famiglie
    ALTER TABLE public.app_settings DROP CONSTRAINT IF EXISTS app_settings_pkey;
    DELETE FROM public.app_settings;
    ALTER TABLE public.app_settings ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE CASCADE;
    ALTER TABLE public.app_settings ADD PRIMARY KEY (key, family_id);

    -- 4. Rimuovi dati di esempio orfani (senza family_id)
    DELETE FROM public.schedule_items WHERE family_id IS NULL;
    DELETE FROM public.routine_items  WHERE family_id IS NULL;