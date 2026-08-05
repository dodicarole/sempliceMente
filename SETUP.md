# Setup Supabase + Vercel

> Questa guida descrive il setup iniziale della **produzione**.
> Per lavorare in locale e usare l'ambiente di test, vedi [DEVELOPMENT.md](DEVELOPMENT.md).

## 1. Crea account Supabase
- Vai su https://supabase.com → "Start your project"
- Registrati (puoi usare GitHub)
- Clicca "New project", scegli un nome (es. semplicementebimbi)
- Scegli una password per il DB e la regione "West EU"
- Aspetta ~1 minuto

## 2. Crea le tabelle
- Menu sinistro → SQL Editor → New query
- Copia il contenuto di supabase/bootstrap.sql (crea l'intero schema in un colpo solo)
- Clicca Run ▶

  I singoli file supabase/*_schema.sql sono la storia delle modifiche già
  applicate alla produzione e vanno eseguiti in un ordine preciso: per un
  ambiente nuovo usa sempre bootstrap.sql.

## 3. Crea il bucket per le foto
- Menu sinistro → Storage → New bucket
- Nome: photos
- Spunta "Public bucket"
- Clicca Save

## 4. Copia le credenziali
- Menu sinistro → Settings → API
- Copia: Project URL  →  va in SUPABASE_URL
- Copia: service_role secret (clicca Reveal)  →  va in SUPABASE_SERVICE_KEY

## 5. Aggiungi le variabili su Vercel
- Vai su vercel.com → il tuo progetto → Settings → Environment Variables
- Aggiungi queste 4 variabili:

  SUPABASE_URL            = (l'URL copiato)
  SUPABASE_SERVICE_KEY    = (la service_role key)
  SUPABASE_STORAGE_BUCKET = photos
  SESSION_SECRET          = (genera con il comando qui sotto)

- Per generare SESSION_SECRET, esegui nel terminale:
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

## 6. Rideploya
  vercel --prod