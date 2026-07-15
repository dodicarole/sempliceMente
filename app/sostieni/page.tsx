'use client'
import { useState } from 'react'
import Link from 'next/link'
import s from './page.module.css'

const WHATSAPP_TEXT = encodeURIComponent(
  'Ho trovato questa app gratuita per bambini 🌟\n' +
  'Si chiama SempliceMente Bimbi e aiuta i bambini a essere più autonomi con lo zaino, la routine mattutina e l\'agenda del giorno.\n' +
  'Dai un\'occhiata: https://semplicementebimbi.it'
)

const FEATURES = [
  {
    emoji: '🎒',
    color: '#6B7FE3',
    title: 'Zaino Pronto',
    desc: 'Una lista visiva per ogni giorno della settimana. Il bambino sa esattamente cosa mettere nello zaino, senza dimenticare nulla e senza ansia.',
  },
  {
    emoji: '🌅',
    color: '#FF8C42',
    title: 'Routine Mattutina',
    desc: 'Ogni passo della mattina — doccia, colazione, denti — diventa una sequenza chiara con foto e icone. La giornata inizia con sicurezza.',
  },
  {
    emoji: '📅',
    color: '#3EAB7A',
    title: 'Agenda di Oggi',
    desc: 'Una timeline visiva delle attività della giornata. Il bambino vede cosa c\'è adesso, cosa viene dopo e cosa è già passato.',
  },
  {
    emoji: '⏱️',
    color: '#00ACC1',
    title: 'Timer Visivo',
    desc: 'Un conto alla rovescia animato per sapere quanto tempo rimane ad ogni attività.',
  },
  {
    emoji: '😊',
    color: '#E0559E',
    title: 'Tabella delle Emozioni',
    desc: 'Schede visive per aiutare il bambino a riconoscere e comunicare come si sente.',
  },
  {
    emoji: '📖',
    color: '#9167D8',
    title: 'Storie Sociali',
    desc: 'Piccole storie illustrate, pagina per pagina, per preparare il bambino a situazioni nuove o difficili — dal dentista al primo giorno di scuola.',
  },
  {
    emoji: '🎁',
    color: '#D4902A',
    title: 'Pronta da subito',
    desc: 'Appena crei l\'account, ogni sezione è già piena di contenuti di esempio: zaino, routine, agenda e storie. Poi li modifichi o li cancelli come preferisci.',
  },
]

const FUTURE = [
  { emoji: '🏆', title: 'Sistema di Premi', desc: 'Stelle e badge per celebrare i progressi e motivare ogni piccola conquista.' },
  { emoji: '🖨️', title: 'Stampa della Routine', desc: 'Stampa la routine del tuo bambino per appenderla in cameretta o portarla sempre con te.' },
]

export default function SosteniPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'SempliceMente Bimbi', url: 'https://semplicementebimbi.it' })
      } else {
        await navigator.clipboard.writeText('https://semplicementebimbi.it')
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // ignorato
    }
  }

  return (
    <main className={s.page}>

      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroEmoji}>🌟</div>
        <h1 className={s.heroTitle}>SempliceMente Bimbi</h1>
        <p className={s.heroSub}>
          Un&apos;app gratuita per aiutare i bambini<br />
          a essere più autonomi ogni giorno
        </p>
        <Link href="/" className={s.heroBtn}>Prova l&apos;app →</Link>
      </section>

      {/* Storia */}
      <section className={s.section}>
        <p className={s.sectionEye}>Il progetto</p>
        <h2 className={s.sectionTitle}>Perché esiste questa app</h2>
        <div className={s.storyCard}>
          <p>
            Alcuni bambini hanno spesso difficoltà con i cambiamenti, le sequenze e le
            attività quotidiane — non perché non vogliano fare le cose, ma perché il mondo
            attorno a loro non sempre comunica in modo che riescano a capire facilmente.
          </p>
          <p>
            SempliceMente Bimbi nasce per rendere prevedibile e visiva la giornata di ogni
            bambino. Con immagini, icone e una struttura chiara, ogni routine diventa
            qualcosa che il bambino può seguire da solo — un piccolo passo verso
            l&apos;autonomia, ogni giorno.
          </p>
          <p>
            È un progetto indipendente, costruito con amore, completamente gratuito e
            senza pubblicità. Ogni funzionalità è pensata insieme a chi vive questa realtà
            tutti i giorni.
          </p>
        </div>
      </section>

      {/* Funzionalità attuali */}
      <section className={s.section}>
        <p className={s.sectionEye}>Già disponibile</p>
        <h2 className={s.sectionTitle}>Cosa puoi fare adesso</h2>
        <div className={s.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={s.featureCard} style={{ '--accent': f.color } as React.CSSProperties}>
              <span className={s.featureEmoji}>{f.emoji}</span>
              <h3 className={s.featureName}>{f.title}</h3>
              <p className={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Idee future */}
      <section className={s.section}>
        <p className={s.sectionEye}>In costruzione</p>
        <h2 className={s.sectionTitle}>Cosa voglio realizzare</h2>
        <div className={s.futureGrid}>
          {FUTURE.map(f => (
            <div key={f.title} className={s.futureCard}>
              <span className={s.futureEmoji}>{f.emoji}</span>
              <div>
                <h3 className={s.futureName}>{f.title}</h3>
                <p className={s.futureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Come installare */}
      <section className={s.section}>
        <p className={s.sectionEye}>Nessun App Store</p>
        <h2 className={s.sectionTitle}>Come installare l&apos;app</h2>
        <p className={s.supportIntro}>
          Si installa direttamente dal browser in pochi secondi, gratis.
        </p>
        <div className={s.installGrid}>
          <div className={s.installCard}>
            <span className={s.installIcon}>🍎</span>
            <h3 className={s.installName}>iPhone</h3>
            <ol className={s.installSteps}>
              <li>Apri <strong>semplicementebimbi.it</strong> in Safari</li>
              <li>Tocca il pulsante <strong>Condividi</strong> (quadrato con freccia)</li>
              <li>Tocca <strong>&quot;Aggiungi a schermata Home&quot;</strong></li>
              <li>Tocca <strong>Aggiungi</strong></li>
            </ol>
          </div>
          <div className={s.installCard}>
            <span className={s.installIcon}>🤖</span>
            <h3 className={s.installName}>Android</h3>
            <ol className={s.installSteps}>
              <li>Apri <strong>semplicementebimbi.it</strong> in Chrome</li>
              <li>Tocca il banner <strong>&quot;Installa app&quot;</strong> in basso</li>
              <li>Oppure tocca i tre puntini → <strong>&quot;Aggiungi a schermata Home&quot;</strong></li>
            </ol>
          </div>
        </div>
      </section>

      {/* Come aiutare */}
      <section className={s.section}>
        <p className={s.sectionEye}>Sostieni il progetto</p>
        <h2 className={s.sectionTitle}>Come puoi aiutare</h2>
        <p className={s.supportIntro}>
          Non servono soldi. Il modo più prezioso per aiutare è <strong>far conoscere
          l&apos;app ad altri genitori</strong>. Ogni famiglia che la scopre è un bambino
          in più che può beneficiarne.
        </p>

        <div className={s.supportCards}>

          <div className={s.supportCard}>
            <span className={s.supportIcon}>📲</span>
            <h3 className={s.supportName}>Condividi con altri genitori</h3>
            <p className={s.supportDesc}>Un messaggio su WhatsApp può fare la differenza per una famiglia.</p>
            <div className={s.supportBtns}>
              <a
                className={`${s.supportBtn} ${s.whatsappBtn}`}
                href={`https://wa.me/?text=${WHATSAPP_TEXT}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <button className={s.supportBtn} onClick={handleCopy}>
                {copied ? '✓ Copiato!' : 'Copia link'}
              </button>
            </div>
          </div>

          <div className={s.supportCard}>
            <span className={s.supportIcon}>✉️</span>
            <h3 className={s.supportName}>Scrivi un messaggio</h3>
            <p className={s.supportDesc}>Hai un&apos;idea, un feedback o vuoi raccontarmi la tua esperienza? Scrivimi.</p>
            <a
              className={s.supportBtn}
              href="mailto:info@semplicementebimbi.it"
            >
              Manda un&apos;email
            </a>
          </div>

          <div className={`${s.supportCard} ${s.donateCard}`}>
            <span className={s.supportIcon}>☕</span>
            <h3 className={s.supportName}>Offri un caffè</h3>
            <p className={s.supportDesc}>Se vuoi contribuire allo sviluppo, presto sarà possibile fare una piccola donazione.</p>
            <span className={s.comingSoon}>Prossimamente</span>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <Link href="/" className={s.footerLink}>← Torna all&apos;app</Link>
        <span className={s.footerText}>Fatto con ❤️ per i bambini e le loro famiglie</span>
      </footer>

    </main>
  )
}