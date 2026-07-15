-- Esegui questo script nell'SQL Editor di Supabase

CREATE TABLE public.stories (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id  UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  icon       TEXT        NOT NULL DEFAULT '📖',
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.story_pages (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id  UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  story_id   UUID        NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  text       TEXT        NOT NULL,
  icon       TEXT        NOT NULL DEFAULT '',
  photo_url  TEXT,
  sort_order INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stories     DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_pages DISABLE ROW LEVEL SECURITY;