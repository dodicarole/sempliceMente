import { getSupabase } from './supabase'
import { DEFAULT_SCHEDULE, DEFAULT_ROUTINE, DEFAULT_AGENDA, DEFAULT_STORIES } from './defaults'

// Popola le sezioni vuote di una famiglia con i contenuti di default, una sola
// volta per famiglia (flag in app_settings): così il genitore parte con dati
// pronti ma può cancellarli o modificarli senza che riappaiano.
export async function seedDefaultsIfNeeded(familyId: string): Promise<void> {
  const supabase = getSupabase()

  const { data: flag } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', 'defaults_seeded')
    .eq('family_id', familyId)
    .maybeSingle()
  if (flag) return

  const [schedule, routine, agenda, stories] = await Promise.all([
    supabase.from('schedule_items').select('id').eq('family_id', familyId).limit(1),
    supabase.from('routine_items').select('id').eq('family_id', familyId).limit(1),
    supabase.from('agenda_items').select('id').eq('family_id', familyId).limit(1),
    supabase.from('stories').select('id').eq('family_id', familyId).limit(1),
  ])

  const errors: string[] = []

  const inserts: PromiseLike<void>[] = []
  if (schedule.data?.length === 0) {
    inserts.push(
      supabase.from('schedule_items')
        .insert(DEFAULT_SCHEDULE.map(item => ({ ...item, family_id: familyId })))
        .then(({ error }) => { if (error) errors.push(error.message) })
    )
  }
  if (routine.data?.length === 0) {
    inserts.push(
      supabase.from('routine_items')
        .insert(DEFAULT_ROUTINE.map(item => ({ ...item, family_id: familyId })))
        .then(({ error }) => { if (error) errors.push(error.message) })
    )
  }
  if (agenda.data?.length === 0) {
    inserts.push(
      supabase.from('agenda_items')
        .insert(DEFAULT_AGENDA.map(item => ({ ...item, family_id: familyId })))
        .then(({ error }) => { if (error) errors.push(error.message) })
    )
  }
  await Promise.all(inserts)

  if (stories.data?.length === 0) {
    for (const story of DEFAULT_STORIES) {
      const { data: created, error } = await supabase
        .from('stories')
        .insert({ title: story.title, icon: story.icon, sort_order: story.sort_order, family_id: familyId })
        .select('id')
        .single()
      if (error || !created) {
        errors.push(error?.message ?? 'insert story fallito')
        continue
      }
      const { error: pagesError } = await supabase
        .from('story_pages')
        .insert(story.pages.map(page => ({ ...page, story_id: created.id, family_id: familyId })))
      if (pagesError) errors.push(pagesError.message)
    }
  }

  // Con errori il flag non viene scritto: si riprova al prossimo login
  if (errors.length > 0) {
    console.error('seedDefaultsIfNeeded:', errors.join('; '))
    return
  }

  await supabase
    .from('app_settings')
    .insert({ key: 'defaults_seeded', family_id: familyId, value: new Date().toISOString() })
}