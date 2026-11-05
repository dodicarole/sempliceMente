/**
 * Leggo e capisco: storie brevi con gli amici di Meky, divise in pezzetti.
 * Ogni pezzetto ha una scena, tre frasi e una domanda (chi, cosa, quanti, dove, quando, perché);
 * "ans" è la frase del testo che contiene la risposta: dopo un errore si illumina.
 */
export type QType = 'chi' | 'cosa' | 'quanti' | 'dove' | 'quando' | 'perche'
export interface RSOption { e: string; text: string; ok?: boolean }
/** q è null quando il genitore non ha messo una domanda; scene è vuota nei testi del genitore */
export interface RSPart { scene: string; text: string[]; q: { t: QType; text: string; ans: number; opts: RSOption[] } | null }
export interface RStory { id: string; cover: string; title: string; guess: string; words: [string, string, string][]; parts: RSPart[]; seq: [string, string][] }

const IT: RStory[] = [
  {
    id: 'torta', cover: '🎂', title: 'Elio e la torta per la nonna', guess: 'Secondo te, per chi è la torta?',
    words: [['🥣', 'impastare', 'Mescolare con le mani o con il cucchiaio, per fare un impasto.'], ['🔥', 'forno', 'Il posto caldo della cucina dove si cuociono le torte.'], ['🧁', 'ingredienti', 'Le cose che servono per cucinare: farina, uova, zucchero…']],
    parts: [
      { scene: '👵🎉📅', text: ['Oggi è il compleanno della nonna.', 'Elio vuole preparare una torta con il papà.', 'In cucina prendono gli ingredienti: la farina, le uova e lo zucchero.'],
        q: { t: 'chi', text: 'Chi prepara la torta con Elio?', ans: 1, opts: [{ e: '👨', text: 'Il papà', ok: true }, { e: '👩', text: 'La mamma' }, { e: '👧', text: 'Lila' }] } },
      { scene: '🥚🥚🥚🥣', text: ['Elio conta le uova: una, due, tre.', 'Poi le mette nella ciotola e comincia a impastare.', 'Il papà accende il forno.'],
        q: { t: 'quanti', text: 'Quante uova usa Elio?', ans: 0, opts: [{ e: '3️⃣', text: 'Tre', ok: true }, { e: '2️⃣', text: 'Due' }, { e: '5️⃣', text: 'Cinque' }] } },
      { scene: '🔥🎂⏳', text: ['La torta cuoce per mezz’ora.', 'In cucina c’è un profumo buonissimo!', 'Elio aspetta vicino al forno e guarda la torta che cresce.'],
        q: { t: 'dove', text: 'Dove aspetta Elio?', ans: 2, opts: [{ e: '🔥', text: 'Vicino al forno', ok: true }, { e: '🌳', text: 'In giardino' }, { e: '🏫', text: 'A scuola' }] } },
      { scene: '👵🎂🤗', text: ['Quando arriva la nonna, Elio le porta la torta.', 'La nonna sorride e lo abbraccia forte.', 'Dice che è la torta più buona del mondo!'],
        q: { t: 'perche', text: 'Perché la nonna è felice?', ans: 0, opts: [{ e: '🎂', text: 'Elio le ha preparato una torta', ok: true }, { e: '🏆', text: 'Ha vinto una gara' }, { e: '☀️', text: 'Fuori c’è il sole' }] } },
    ],
    seq: [['🧁🥚', 'Prendono gli ingredienti'], ['🥣', 'Elio impasta'], ['🔥🎂', 'La torta cuoce'], ['👵🤗', 'La nonna è felice']],
  },
  {
    id: 'treno', cover: '🚆', title: 'Nico va al mare in treno', guess: 'Secondo te, dove va Nico?',
    words: [['🚉', 'stazione', 'Il posto dove si aspetta il treno.'], ['🎧', 'cuffie', 'Si mettono sulle orecchie: fanno sentire meno i rumori.'], ['⏰', 'in ritardo', 'Quando qualcosa arriva più tardi del previsto.']],
    parts: [
      { scene: '👦👩🚉', text: ['Nico e la mamma vanno in stazione.', 'Oggi prendono il treno per andare al mare.', 'Nico porta il suo zaino con il secchiello.'],
        q: { t: 'dove', text: 'Dove vanno Nico e la mamma con il treno?', ans: 1, opts: [{ e: '🏖️', text: 'Al mare', ok: true }, { e: '🏔️', text: 'In montagna' }, { e: '🏫', text: 'A scuola' }] } },
      { scene: '🔊📢😣', text: ['In stazione c’è tanta gente e tanto rumore.', 'Nico si sente un po’ agitato.', 'Allora mette le sue cuffie blu.'],
        q: { t: 'cosa', text: 'Cosa mette Nico quando c’è rumore?', ans: 2, opts: [{ e: '🎧', text: 'Le cuffie', ok: true }, { e: '🧢', text: 'Il cappello' }, { e: '🧤', text: 'I guanti' }] } },
      { scene: '⏰🚆🙂', text: ['Il treno è in ritardo di dieci minuti.', 'Nico conta i treni che passano sugli altri binari.', 'Finalmente arriva il loro treno!'],
        q: { t: 'perche', text: 'Perché Nico deve aspettare?', ans: 0, opts: [{ e: '⏰', text: 'Il treno è in ritardo', ok: true }, { e: '🌧️', text: 'Piove forte' }, { e: '😴', text: 'La mamma dorme' }] } },
      { scene: '🏖️🌊😄', text: ['Dopo un’ora di viaggio, vedono il mare dal finestrino.', 'Nico toglie le cuffie e sorride.', 'Che bello: si sente il rumore delle onde!'],
        q: { t: 'quando', text: 'Quando vedono il mare?', ans: 0, opts: [{ e: '🕐', text: 'Dopo un’ora di viaggio', ok: true }, { e: '🌙', text: 'Di notte' }, { e: '🍽️', text: 'A pranzo' }] } },
    ],
    seq: [['🚉', 'Vanno in stazione'], ['🎧', 'Nico mette le cuffie'], ['🚆', 'Arriva il treno'], ['🏖️', 'Vedono il mare']],
  },
]

const FR: RStory[] = [
  {
    id: 'torta', cover: '🎂', title: 'Elio et le gâteau pour mamie', guess: 'À ton avis, pour qui est le gâteau ?',
    words: [['🥣', 'mélanger', 'Tourner avec une cuillère pour faire une pâte.'], ['🔥', 'four', 'L’endroit chaud de la cuisine où on fait cuire les gâteaux.'], ['🧁', 'ingrédients', 'Ce qu’il faut pour cuisiner : farine, œufs, sucre…']],
    parts: [
      { scene: '👵🎉📅', text: ['Aujourd’hui, c’est l’anniversaire de mamie.', 'Elio veut préparer un gâteau avec papa.', 'Dans la cuisine, ils prennent les ingrédients : la farine, les œufs et le sucre.'],
        q: { t: 'chi', text: 'Qui prépare le gâteau avec Elio ?', ans: 1, opts: [{ e: '👨', text: 'Papa', ok: true }, { e: '👩', text: 'Maman' }, { e: '👧', text: 'Lila' }] } },
      { scene: '🥚🥚🥚🥣', text: ['Elio compte les œufs : un, deux, trois.', 'Puis il les met dans le bol et commence à mélanger.', 'Papa allume le four.'],
        q: { t: 'quanti', text: 'Combien d’œufs Elio utilise-t-il ?', ans: 0, opts: [{ e: '3️⃣', text: 'Trois', ok: true }, { e: '2️⃣', text: 'Deux' }, { e: '5️⃣', text: 'Cinq' }] } },
      { scene: '🔥🎂⏳', text: ['Le gâteau cuit pendant une demi-heure.', 'Dans la cuisine, ça sent très bon !', 'Elio attend près du four et regarde le gâteau gonfler.'],
        q: { t: 'dove', text: 'Où attend Elio ?', ans: 2, opts: [{ e: '🔥', text: 'Près du four', ok: true }, { e: '🌳', text: 'Dans le jardin' }, { e: '🏫', text: 'À l’école' }] } },
      { scene: '👵🎂🤗', text: ['Quand mamie arrive, Elio lui apporte le gâteau.', 'Mamie sourit et le serre fort dans ses bras.', 'Elle dit que c’est le meilleur gâteau du monde !'],
        q: { t: 'perche', text: 'Pourquoi mamie est-elle contente ?', ans: 0, opts: [{ e: '🎂', text: 'Elio lui a préparé un gâteau', ok: true }, { e: '🏆', text: 'Elle a gagné une course' }, { e: '☀️', text: 'Il fait beau dehors' }] } },
    ],
    seq: [['🧁🥚', 'Ils prennent les ingrédients'], ['🥣', 'Elio mélange'], ['🔥🎂', 'Le gâteau cuit'], ['👵🤗', 'Mamie est contente']],
  },
  {
    id: 'treno', cover: '🚆', title: 'Nico va à la mer en train', guess: 'À ton avis, où va Nico ?',
    words: [['🚉', 'gare', 'L’endroit où on attend le train.'], ['🎧', 'casque', 'On le met sur les oreilles : on entend moins les bruits.'], ['⏰', 'en retard', 'Quand quelque chose arrive plus tard que prévu.']],
    parts: [
      { scene: '👦👩🚉', text: ['Nico et maman vont à la gare.', 'Aujourd’hui, ils prennent le train pour aller à la mer.', 'Nico emporte son sac à dos avec son seau.'],
        q: { t: 'dove', text: 'Où vont Nico et maman en train ?', ans: 1, opts: [{ e: '🏖️', text: 'À la mer', ok: true }, { e: '🏔️', text: 'À la montagne' }, { e: '🏫', text: 'À l’école' }] } },
      { scene: '🔊📢😣', text: ['À la gare, il y a beaucoup de monde et beaucoup de bruit.', 'Nico se sent un peu agité.', 'Alors il met son casque bleu.'],
        q: { t: 'cosa', text: 'Que met Nico quand il y a du bruit ?', ans: 2, opts: [{ e: '🎧', text: 'Son casque', ok: true }, { e: '🧢', text: 'Sa casquette' }, { e: '🧤', text: 'Ses gants' }] } },
      { scene: '⏰🚆🙂', text: ['Le train est en retard de dix minutes.', 'Nico compte les trains qui passent sur les autres voies.', 'Enfin, leur train arrive !'],
        q: { t: 'perche', text: 'Pourquoi Nico doit-il attendre ?', ans: 0, opts: [{ e: '⏰', text: 'Le train est en retard', ok: true }, { e: '🌧️', text: 'Il pleut fort' }, { e: '😴', text: 'Maman dort' }] } },
      { scene: '🏖️🌊😄', text: ['Après une heure de voyage, ils voient la mer par la fenêtre.', 'Nico enlève son casque et sourit.', 'Comme c’est beau : on entend le bruit des vagues !'],
        q: { t: 'quando', text: 'Quand voient-ils la mer ?', ans: 0, opts: [{ e: '🕐', text: 'Après une heure de voyage', ok: true }, { e: '🌙', text: 'La nuit' }, { e: '🍽️', text: 'Au déjeuner' }] } },
    ],
    seq: [['🚉', 'Ils vont à la gare'], ['🎧', 'Nico met son casque'], ['🚆', 'Le train arrive'], ['🏖️', 'Ils voient la mer']],
  },
]
export const READ_STORIES: Record<'it' | 'fr', RStory[]> = { it: IT, fr: FR }

/** Impostazioni per figlio (salvate anche nel database: vedi lib/childStore.ts) */
export interface ReadSettings { words: boolean; choices: 2 | 3; why: boolean; auto: boolean }
export const READ_DEFAULTS: ReadSettings = { words: true, choices: 3, why: true, auto: true }
const KEY = 'capisco_impostazioni'
export function loadReadSettings(): ReadSettings { try { const r = localStorage.getItem(KEY); if (r) return { ...READ_DEFAULTS, ...JSON.parse(r) } } catch (_) {} return READ_DEFAULTS }
export function saveReadSettings(v: ReadSettings) { try { localStorage.setItem(KEY, JSON.stringify(v)) } catch (_) {} }
