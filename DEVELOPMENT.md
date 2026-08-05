# Sviluppo, test e pubblicazione

Guida ai tre ambienti del progetto: come lavorare in locale, come far provare
le novità prima di pubblicarle, e come mandare in produzione.

---

## I tre ambienti

| Ambiente       | Dove gira                                   | Database Supabase | Quando lo usi                             |
| -------------- | ------------------------------------------- | ----------------- | ----------------------------------------- |
| **Locale**     | `npm run dev` → http://localhost:3000       | progetto **dev**  | mentre scrivi e provi il codice           |
| **Preview**    | URL Vercel generato a ogni push su un branch| progetto **dev**  | per far provare le novità prima di pubblicare |
| **Produzione** | https://semplicementebimbi.it               | progetto **prod** | solo dopo il test                         |

### ⚠️ Perché servono due database separati

L'app accede a Supabase con la **service key** e con **RLS disabilitato** su
tutte le tabelle (vedi `lib/supabase.ts` e `supabase/bootstrap.sql`). Non c'è
nessuna protezione a livello di database: qualsiasi ambiente collegato al DB di
produzione può leggere, modificare e cancellare i dati reali delle famiglie.

Per questo locale e preview devono puntare a un progetto Supabase separato.
Il piano gratuito di Supabase consente 2 progetti attivi, quindi dev + prod
rientrano senza costi.

---

## Setup iniziale (una volta sola)

### 1. Crea il progetto Supabase di sviluppo

1. Vai su https://supabase.com/dashboard → **New project**
2. Nome: `semplicementebimbi-dev`, regione **West EU**, scegli una password DB
3. Attendi ~1 minuto che il progetto sia pronto

### 2. Crea le tabelle

1. Menu sinistro → **SQL Editor** → **New query**
2. Copia tutto il contenuto di [`supabase/bootstrap.sql`](supabase/bootstrap.sql)
3. **Run ▶**

> `bootstrap.sql` crea l'intero schema in un colpo solo. I 6 file
> `supabase/*_schema.sql` sono la storia delle modifiche applicate alla
> produzione e vanno eseguiti in un ordine preciso: per un ambiente nuovo usa
> sempre `bootstrap.sql`.

### 3. Crea il bucket per le foto

Menu sinistro → **Storage** → **New bucket** → nome `photos` → spunta
**Public bucket** → Save.

### 4. Configura l'ambiente locale

```bash
cp .env.example .env.local
```

Poi apri `.env.local` e compila:

- `SUPABASE_URL` e `SUPABASE_SERVICE_KEY` → li trovi in **Settings → API** del
  progetto **dev** (non quello di produzione!)
- `SUPABASE_STORAGE_BUCKET` → `photos`
- `SESSION_SECRET` → genera con:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `RESEND_API_KEY` → **lascialo vuoto**, così in locale non parte nessuna email vera

### 5. Avvia

```bash
npm install
npm run dev
```

Apri http://localhost:3000 e registra una famiglia di prova. I contenuti di
default (materiali, routine, agenda, storie) vengono creati automaticamente alla
prima registrazione da `lib/seedDefaults.ts`.

### 6. Configura le variabili Preview su Vercel

Vercel → progetto → **Settings** → **Environment Variables**. Per ogni variabile
puoi scegliere a quali ambienti si applica: assicurati che
**Production e Preview abbiano valori diversi**.

| Variabile                 | Production            | Preview                   |
| ------------------------- | --------------------- | ------------------------- |
| `SUPABASE_URL`            | progetto prod         | progetto **dev**          |
| `SUPABASE_SERVICE_KEY`    | service key prod      | service key **dev**       |
| `SUPABASE_STORAGE_BUCKET` | `photos`              | `photos`                  |
| `SESSION_SECRET`          | valore prod           | valore **diverso**        |
| `RESEND_API_KEY`          | key Resend            | **vuoto** (niente email)  |
| `EMAIL_FROM`              | mittente reale        | (vuoto)                   |
| `ANNOUNCE_SECRET`         | valore prod           | (vuoto)                   |

Se una variabile è già impostata "for all environments", modificala e togli la
spunta a Preview, poi creane una seconda solo per Preview.

### 7. Tieni sveglio anche il progetto dev

Supabase sospende i progetti gratuiti inattivi. Il workflow
`.github/workflows/main.yml` interroga entrambi i progetti ogni 12 ore, ma per
quello di sviluppo servono due secrets in più.

GitHub → repository → **Settings** → **Secrets and variables** → **Actions** →
**New repository secret**:

| Secret                     | Valore                                                          |
| -------------------------- | --------------------------------------------------------------- |
| `SUPABASE_DEV_PROJECT_REF` | il ref del progetto dev: la parte prima di `.supabase.co` nell'URL |
| `SUPABASE_DEV_ANON_KEY`    | Settings → API → **anon / public** key del progetto dev           |

> Qui va la chiave **anon**, non la service key: serve solo a fare una
> richiesta di lettura per segnalare attività.

Finché non li imposti, il workflow salta quel ping con un warning senza fallire.
Per verificare che funzioni: **Actions** → *Keep Supabase Awake* → **Run
workflow**.

---

## Il flusso di lavoro quotidiano

```
  branch di lavoro  →  push  →  URL di preview  →  test  →  merge su main  →  produzione
```

**1. Crea un branch** partendo da `main` aggiornato:

```bash
git checkout main
git pull
git checkout -b dev_nome-della-modifica
```

**2. Lavora e prova in locale** con `npm run dev`.

**3. Verifica che compili** prima di pubblicare — è lo stesso comando che gira
su Vercel, e intercetta gli errori TypeScript:

```bash
npm run build
```

**4. Pubblica il branch:**

```bash
git add -A
git commit -m "descrizione della modifica"
git push -u origin dev_nome-della-modifica
```

Vercel crea automaticamente un deploy di preview e mostra l'URL (tipo
`semplicemente-git-dev-nome-xxx.vercel.app`) nella dashboard e come commento
nella Pull Request. Quell'URL è il tuo ambiente di test: puoi aprirlo dal
telefono, installarlo come PWA, mandarlo a qualcuno da provare.

**5. Quando è tutto a posto, vai in produzione.** Apri una Pull Request su
GitHub verso `main` e fai il merge: il deploy in produzione parte da solo.

```bash
# in alternativa, da riga di comando:
git checkout main
git merge dev_nome-della-modifica
git push
```

---

## Modifiche al database

Quando una nuova funzionalità richiede tabelle o colonne nuove:

1. Scrivi lo SQL in un file nuovo in `supabase/` (es. `premi_schema.sql`)
2. **Eseguilo prima sul progetto dev**, e prova la funzionalità in locale
3. Aggiorna [`supabase/bootstrap.sql`](supabase/bootstrap.sql) con lo stato
   finale, così chi crea un ambiente nuovo ottiene lo schema completo
4. Solo al momento del merge su `main`, esegui lo stesso SQL sul progetto
   **prod**

> Attenzione all'ordine: il deploy in produzione e la modifica al DB non sono
> sincronizzati. Se il codice nuovo usa una colonna che ancora non esiste,
> l'app si rompe. Regola pratica: **prima lo SQL su prod, poi il merge**.

---

## Cose da sapere

**Il service worker della PWA.** È disattivato in locale (`next.config.ts`), ma
è attivo sulle preview e in produzione. Se dopo un deploy vedi ancora la
versione vecchia, è la cache: ricarica con `Ctrl+Shift+R`, oppure da DevTools →
Application → Service Workers → Unregister.

**Ogni preview ha il suo URL.** I cookie di sessione non sono condivisi tra
preview diverse e produzione: dovrai fare login separatamente su ognuna. È
voluto — evita di confondere i due ambienti.

**I progetti Supabase vanno in pausa.** Supabase sospende i progetti gratuiti
dopo ~7 giorni di inattività. Il workflow `.github/workflows/main.yml` li tiene
svegli entrambi ogni 12 ore, a patto che i secrets di dev siano configurati
(vedi il punto 7 del setup). Se un progetto si sospende comunque, lo riattivi
con un clic dalla dashboard.

**Dati di test.** Il progetto dev è il posto giusto per famiglie finte, foto di
prova e cancellazioni. Se si sporca troppo, puoi svuotarlo e rilanciare
`bootstrap.sql`.
