    -- Esegui questo script nell'SQL Editor di Supabase:
    -- https://supabase.com/dashboard/project/_/sql/new

    -- Tabella materiali scolastici
    CREATE TABLE public.schedule_items (
      id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
      day_of_week  SMALLINT    NOT NULL CHECK (day_of_week BETWEEN 0 AND 4),
      name         TEXT        NOT NULL,
      icon         TEXT        NOT NULL DEFAULT '📚',
      photo_url    TEXT,
      sort_order   INTEGER     NOT NULL DEFAULT 0,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    );

    -- Impostazioni app (PIN hash, ecc.)
    CREATE TABLE public.app_settings (
      key        TEXT        PRIMARY KEY,
      value      TEXT        NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    -- Disabilita RLS (le operazioni avvengono via service key lato server)
    ALTER TABLE public.schedule_items DISABLE ROW LEVEL SECURITY;
    ALTER TABLE public.app_settings   DISABLE ROW LEVEL SECURITY;

    -- Dati di esempio per iniziare
    INSERT INTO public.schedule_items (day_of_week, name, icon, sort_order) VALUES
      (0, 'Matematica', '📐', 0),
      (0, 'Italiano',   '📖', 1),
      (0, 'Astuccio',   '✏️', 2),
      (0, 'Borraccia',  '💧', 3),
      (1, 'Scienze',    '🔬', 0),
      (1, 'Storia',     '🏛️', 1),
      (1, 'Inglese',    '🌍', 2),
      (2, 'Arte',       '🎨', 0),
      (2, 'Musica',     '🎵', 1),
      (2, 'Ginnastica', '⚽', 2),
      (3, 'Matematica', '📐', 0),
      (3, 'Italiano',   '📖', 1),
      (3, 'Tecnologia', '💻', 2),
      (4, 'Italiano',   '📖', 0),
      (4, 'Inglese',    '🌍', 1),
      (4, 'Borraccia',  '💧', 2);