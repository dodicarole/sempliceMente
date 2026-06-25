-- Esegui questo script nell'SQL Editor di Supabase

CREATE TABLE public.agenda_items (
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

ALTER TABLE public.agenda_items DISABLE ROW LEVEL SECURITY;