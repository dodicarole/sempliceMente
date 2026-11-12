-- ════════════════════════════════════════════════════════════════════
-- Condividere un bambino con un altro adulto (un altro account),
-- senza dare la propria password.
--  - child_invites: i codici di invito, validi 48 ore e usabili una volta
--  - child_shares : chi (quale account) può vedere e seguire quale bambino
-- Esegui questo script nell'SQL Editor di Supabase.
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.child_invites (
  code        TEXT        PRIMARY KEY,
  child_id    UUID        NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  family_id   UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,   -- chi invita (il proprietario)
  expires_at  TIMESTAMPTZ NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.child_shares (
  child_id    UUID        NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  family_id   UUID        NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,   -- chi riceve l'accesso
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (child_id, family_id)
);

CREATE INDEX IF NOT EXISTS child_shares_family ON public.child_shares (family_id);

-- Come le altre tabelle: si accede solo dal server dell'app
ALTER TABLE public.child_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_shares  ENABLE ROW LEVEL SECURITY;

-- Controllo (facoltativo): devono restituire 0 righe e nessun errore
-- SELECT * FROM public.child_shares LIMIT 1;
-- SELECT * FROM public.child_invites LIMIT 1;
