-- Esegui questo script nell'SQL Editor di Supabase:
-- https://supabase.com/dashboard/project/_/sql/new

CREATE TABLE public.routine_items (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  icon       TEXT        NOT NULL DEFAULT '✅',
  photo_url  TEXT,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.routine_items DISABLE ROW LEVEL SECURITY;

-- Passi di esempio
INSERT INTO public.routine_items (name, icon, sort_order) VALUES
  ('Sveglia',          '⏰', 0),
  ('Bagno / Doccia',   '🚿', 1),
  ('Vestirsi',         '👕', 2),
  ('Colazione',        '🥣', 3),
  ('Lavarsi i denti',  '🦷', 4),
  ('Mettere le scarpe','👟', 5),
  ('Prendere lo zaino','🎒', 6);
