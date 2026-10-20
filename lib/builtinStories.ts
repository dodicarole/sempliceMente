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
  {
    slug: 'siamo-diversi',
    title: { it: 'Il mondo è bello perché siamo diversi', fr: 'Le monde est beau parce que nous sommes différents' },
    icon: '🌈',
    pages: [
      { icon: '🌍', image: '/storie/siamo-diversi/01-mondo.png', text: {
        it: 'Nel mondo ci sono tantissimi bambini. Nessuno è uguale a un altro, ed è proprio questo che rende ognuno speciale.',
        fr: 'Dans le monde, il y a plein d’enfants. Personne n’est pareil qu’un autre, et c’est justement ce qui rend chacun unique.' } },
      { icon: '😊', image: '/storie/siamo-diversi/02-aspetto.png', text: {
        it: "Ognuno ha il suo aspetto: capelli ricci o lisci, lentiggini, occhiali, pelle chiara o scura. Ogni viso è bello così com'è.",
        fr: `Chacun a son apparence${nb}: cheveux frisés ou raides, taches de rousseur, lunettes, peau claire ou foncée. Chaque visage est beau comme il est.` } },
      { icon: '🎨', image: '/storie/siamo-diversi/03-talenti.png', text: {
        it: "Ognuno sa fare cose diverse. C'è chi corre veloce, chi disegna benissimo e chi, come Meky, costruisce torri altissime.",
        fr: 'Chacun sait faire des choses différentes. Certains courent vite, d’autres dessinent très bien, et Meky construit des tours très hautes.' } },
      { icon: '🐢', image: '/storie/siamo-diversi/04-tempi.png', text: {
        it: "Ognuno ha i suoi tempi. C'è chi impara in fretta e chi ha bisogno di più tempo. Va bene così: l'importante è provarci.",
        fr: `Chacun a son rythme. Certains apprennent vite, d’autres ont besoin de plus de temps. C’est bien comme ça${nb}: l’important, c’est d’essayer.` } },
      { icon: '🎧', image: '/storie/siamo-diversi/05-sentire.png', text: {
        it: 'Ognuno sente il mondo a modo suo. A qualcuno i rumori forti danno fastidio, e allora mette le cuffie. Qualcuno parla tanto, qualcuno parla poco o usa le immagini.',
        fr: 'Chacun ressent le monde à sa façon. Certains n’aiment pas les bruits forts, alors ils mettent un casque. Certains parlent beaucoup, d’autres parlent peu ou utilisent des images.' } },
      { icon: '⚽', image: '/storie/siamo-diversi/06-insieme.png', text: {
        it: 'Qualcuno corre, qualcuno cammina, qualcuno si muove con la sedia a rotelle. E tutti insieme si può giocare.',
        fr: 'Certains courent, certains marchent, certains se déplacent en fauteuil roulant. Et tous ensemble, on peut jouer.' } },
      { icon: '💛', image: '/storie/siamo-diversi/07-specchio.png', text: {
        it: "Anche Meky è speciale, proprio così com'è. Non deve diventare come gli altri per essere bravo e per essere voluto bene.",
        fr: 'Meky aussi est unique, juste comme il est. Il n’a pas besoin de devenir comme les autres pour être génial et pour être aimé.' } },
      { icon: '🤝', image: '/storie/siamo-diversi/08-aiutarsi.png', text: {
        it: 'Quando siamo diversi, possiamo imparare gli uni dagli altri e darci una mano.',
        fr: 'Quand on est différents, on peut apprendre les uns des autres et s’entraider.' } },
      { icon: '🌈', image: '/storie/siamo-diversi/09-arcobaleno.png', text: {
        it: 'Il mondo è bello perché siamo tutti diversi. E tu vai benissimo così come sei!',
        fr: `Le monde est beau parce que nous sommes tous différents. Et toi, tu es très bien comme tu es${nb}!` } },
      { icon: '❓', image: '/storie/siamo-diversi/10-e-tu.png', text: {
        it: 'E tu? Che cosa ti rende speciale? Raccontalo a chi sta leggendo con te.',
        fr: `Et toi${nb}? Qu’est-ce qui te rend unique${nb}? Raconte-le à la personne qui lit avec toi.` } },
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
