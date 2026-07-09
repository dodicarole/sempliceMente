-- Esegui questo script nell'SQL Editor di Supabase

CREATE TABLE public.emotion_items (
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

ALTER TABLE public.emotion_items DISABLE ROW LEVEL SECURITY;