import type { Story } from '@/types'
import type { Lang } from '@/lib/i18n'

/**
 * Storie sociali già pronte, incluse nell'app, in italiano e in francese.
 * Sono visibili a tutti (modalità demo e genitori registrati) e non si possono
 * modificare o cancellare dall'area Genitore. Le immagini stanno in /public/storie.
 */

type Text = Record<Lang, string>
interface BuiltinPage { icon: string; image?: string; text: Text }
interface BuiltinStory { slug: string; title: Text; icon: string; pages: BuiltinPage[] }

const nb = '\u00a0' // spazio indivisibile prima di ! ? : in francese

const STORIES: BuiltinStory[] = [
  {
    slug: 'meky-senza-pannolino',
    title: { it: 'Meky dorme senza pannolino', fr: 'Meky dort sans couche' },
    icon: '🌙',
    pages: [
      { icon: '🌟', image: '/storie/meky/01-crescere.png', text: {
        it: 'Meky sta crescendo. Quando si cresce, si imparano tante cose nuove.',
        fr: 'Meky grandit. Quand on grandit, on apprend plein de choses nouvelles.' } },
      { icon: '🩲', image: '/storie/meky/02-mutandine.png', text: {
        it: 'Adesso Meky dorme senza pannolino. Di notte mette le mutandine e il pigiama, come i bambini grandi.',
        fr: 'Maintenant, Meky dort sans couche. La nuit, il met son slip et son pyjama, comme les grands.' } },
      { icon: '🚽', image: '/storie/meky/03-bagno.png', text: {
        it: 'Prima di andare a letto, Meky fa la pipì nel water. Così la pancia è leggera e si dorme tranquilli.',
        fr: 'Avant d’aller au lit, Meky fait pipi aux toilettes. Comme ça, le ventre est léger et on dort tranquille.' } },
      { icon: '🛏️', image: '/storie/meky/04-buonanotte.png', text: {
        it: 'Poi Meky va a letto. La mamma o il papà gli danno il bacio della buonanotte.',
        fr: 'Puis Meky va au lit. Maman ou papa lui fait un bisou pour lui dire bonne nuit.' } },
      { icon: '💡', image: '/storie/meky/05-lucina.png', text: {
        it: 'Se di notte Meky sente la pipì, si alza e va in bagno. La lucina accesa lo aiuta a trovare la strada. Meky può anche chiamare la mamma o il papà.',
        fr: 'Si la nuit Meky a envie de faire pipi, il se lève et va aux toilettes. La petite veilleuse l’aide à trouver le chemin. Meky peut aussi appeler maman ou papa.' } },
      { icon: '💧', image: '/storie/meky/06-lenzuola.png', text: {
        it: 'A volte può succedere di bagnare il letto. Va bene così: succede a tanti bambini mentre imparano. Il papà o la mamma cambiano le lenzuola e Meky torna a dormire.',
        fr: `Parfois, il peut arriver de mouiller le lit. Ce n’est pas grave${nb}: ça arrive à beaucoup d’enfants pendant qu’ils apprennent. Papa ou maman change les draps et Meky se rendort.` } },
      { icon: '☀️', image: '/storie/meky/07-mattino.png', text: {
        it: 'Al mattino, appena sveglio, Meky va subito a fare la pipì nel water.',
        fr: 'Le matin, dès qu’il se réveille, Meky va tout de suite faire pipi aux toilettes.' } },
      { icon: '🎉', image: '/storie/meky/08-felici.png', text: {
        it: 'Ogni notte Meky impara un po\' di più. La mamma e il papà sono felici. E anche Meky è felice di dormire senza pannolino!',
        fr: `Chaque nuit, Meky apprend un peu plus. Maman et papa sont contents. Et Meky aussi est content de dormir sans couche${nb}!` } },
    ],
  },
  {
    slug: 'meky-paura-del-buio',
    title: { it: 'Meky ha paura del buio', fr: 'Meky a peur du noir' },
    icon: '🌌',
    pages: [
      { icon: '🌙', image: '/storie/meky-buio/01-sera.png', text: {
        it: 'Quando arriva la sera, fuori diventa buio. Il buio arriva ogni notte, ed è una cosa normale.',
        fr: 'Quand le soir arrive, dehors il fait noir. Le noir arrive chaque nuit, et c’est normal.' } },
      { icon: '😟', image: '/storie/meky-buio/02-paura.png', text: {
        it: "A volte Meky ha un po' di paura del buio. Anche tanti altri bambini hanno paura del buio. Va bene sentirsi così.",
        fr: 'Parfois, Meky a un peu peur du noir. Beaucoup d’autres enfants ont peur du noir aussi. C’est normal de se sentir comme ça.' } },
      { icon: '🛏️', image: '/storie/meky-buio/03-cameretta.png', text: {
        it: "Al buio la cameretta di Meky è la stessa di sempre. L'armadio, i giochi e il letto restano al loro posto.",
        fr: 'Dans le noir, la chambre de Meky est la même que d’habitude. L’armoire, les jouets et le lit restent à leur place.' } },
      { icon: '💡', image: '/storie/meky-buio/04-lucina.png', text: {
        it: "Vicino al letto di Meky c'è una lucina. La sua luce morbida lo aiuta a sentirsi tranquillo.",
        fr: 'Près du lit de Meky, il y a une petite veilleuse. Sa lumière douce l’aide à se sentir tranquille.' } },
      { icon: '🧸', image: '/storie/meky-buio/05-orsetto.png', text: {
        it: "Meky dorme abbracciato al suo orsetto. L'orsetto gli fa compagnia tutta la notte.",
        fr: 'Meky dort en serrant son nounours. Le nounours lui tient compagnie toute la nuit.' } },
      { icon: '🌬️', image: '/storie/meky-buio/06-respiri.png', text: {
        it: 'Se Meky sente la paura, fa dei respiri lenti: annusa il fiore e soffia sulla candelina. Piano piano si calma.',
        fr: `Quand Meky a peur, il respire lentement${nb}: il sent la fleur et il souffle sur la bougie. Petit à petit, il se calme.` } },
      { icon: '🤗', image: '/storie/meky-buio/07-chiamare.png', text: {
        it: 'Se la paura non passa, Meky può chiamare la mamma o il papà. Loro sono vicini e arrivano subito.',
        fr: 'Si la peur ne part pas, Meky peut appeler maman ou papa. Ils sont tout près et ils arrivent vite.' } },
      { icon: '⭐', image: '/storie/meky-buio/08-mattino.png', text: {
        it: "Al mattino il buio se ne va e torna il sole. Meky è stato coraggioso! E ogni notte diventa un po' più facile.",
        fr: `Le matin, le noir s’en va et le soleil revient. Meky a été courageux${nb}! Et chaque nuit, c’est un peu plus facile.` } },
    ],
  },
]

/** Le storie già pronte nella lingua scelta */
export function builtinStories(lang: Lang): Story[] {
  return STORIES.map((story, i) => ({
    id: `builtin-${story.slug}`,
    title: story.title[lang],
    icon: story.icon,
    sort_order: 1000 + i, // dopo le storie del genitore
    pages: story.pages.map((page, j) => ({
      id: `builtin-${story.slug}-${j}`,
      story_id: `builtin-${story.slug}`,
      text: page.text[lang],
      icon: page.icon,
      photo_url: page.image ?? null,
      sort_order: j,
    })),
  }))
}
