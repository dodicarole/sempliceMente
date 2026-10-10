import type { Story } from '@/types'

/**
 * Storie sociali già pronte, incluse nell'app.
 * Sono visibili a tutti (modalità demo e genitori registrati) e non si possono
 * modificare o cancellare dall'area Genitore. Le immagini stanno in /public/storie.
 */

interface BuiltinPage { text: string; icon: string; image?: string }
interface BuiltinStory { slug: string; title: string; icon: string; pages: BuiltinPage[] }

const STORIES: BuiltinStory[] = [
  {
    slug: 'meky-senza-pannolino',
    title: 'Meky dorme senza pannolino',
    icon: '🌙',
    pages: [
      { icon: '🌟', image: '/storie/meky/01-crescere.png',   text: 'Meky sta crescendo. Quando si cresce, si imparano tante cose nuove.' },
      { icon: '🩲', image: '/storie/meky/02-mutandine.png',  text: 'Adesso Meky dorme senza pannolino. Di notte mette le mutandine e il pigiama, come i bambini grandi.' },
      { icon: '🚽', image: '/storie/meky/03-bagno.png',      text: 'Prima di andare a letto, Meky fa la pipì nel water. Così la pancia è leggera e si dorme tranquilli.' },
      { icon: '🛏️', image: '/storie/meky/04-buonanotte.png', text: 'Poi Meky va a letto. La mamma o il papà gli danno il bacio della buonanotte.' },
      { icon: '💡', image: '/storie/meky/05-lucina.png',     text: 'Se di notte Meky sente la pipì, si alza e va in bagno. La lucina accesa lo aiuta a trovare la strada. Meky può anche chiamare la mamma o il papà.' },
      { icon: '💧', image: '/storie/meky/06-lenzuola.png',   text: 'A volte può succedere di bagnare il letto. Va bene così: succede a tanti bambini mentre imparano. Il papà o la mamma cambiano le lenzuola e Meky torna a dormire.' },
      { icon: '☀️', image: '/storie/meky/07-mattino.png',    text: 'Al mattino, appena sveglio, Meky va subito a fare la pipì nel water.' },
      { icon: '🎉', image: '/storie/meky/08-felici.png',     text: 'Ogni notte Meky impara un po\' di più. La mamma e il papà sono felici. E anche Meky è felice di dormire senza pannolino!' },
    ],
  },
]

export const BUILTIN_STORIES: Story[] = STORIES.map((story, i) => ({
  id: `builtin-${story.slug}`,
  title: story.title,
  icon: story.icon,
  sort_order: 1000 + i, // dopo le storie del genitore
  pages: story.pages.map((page, j) => ({
    id: `builtin-${story.slug}-${j}`,
    story_id: `builtin-${story.slug}`,
    text: page.text,
    icon: page.icon,
    photo_url: page.image ?? null,
    sort_order: j,
  })),
}))
