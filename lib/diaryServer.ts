import { getSupabase } from '@/lib/supabase'
import { getSession, getChildId } from '@/lib/session'

/**
 * Chi può scrivere nel diario di un figlio.
 * Il genitore sempre; il bambino solo se il genitore ha scelto "Anche il bambino"
 * (impostazione "diario_impostazioni" del figlio, salvata in children.settings.games).
 * Segnare un compito come fatto è permesso a tutti: è una cosa del bambino.
 */
export async function diaryAccess(): Promise<{ familyId: string; childId: string | null; canEdit: boolean } | Response> {
  const session = await getSession()
  if (!session.familyId) return new Response(JSON.stringify({ error: 'Non autenticato' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
  const familyId = session.familyId
  const childId = await getChildId(familyId)
  if (session.isParent) return { familyId, childId, canEdit: true }
  let canEdit = false
  if (childId) {
    const { data } = await getSupabase().from('children').select('settings').eq('id', childId).eq('family_id', familyId).maybeSingle()
    const raw = (data?.settings as { games?: Record<string, string | null> } | null)?.games?.diario_impostazioni
    try { canEdit = !!raw && JSON.parse(raw).who === 'child' } catch (_) { canEdit = false }
  }
  return { familyId, childId, canEdit }
}
export const DIARY_TYPES = ['compiti', 'verifica', 'portare', 'gita', 'vacanza']
export const forbidden = () => new Response(JSON.stringify({ error: 'Il diario lo compila il genitore' }), { status: 403, headers: { 'Content-Type': 'application/json' } })
