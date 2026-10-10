export type TablesPhase = 'scopri' | 'salta' | 'ricorda'

export interface TablesSettings {
  visible: number[]
  upTo: number
  phases: TablesPhase[]
  look: 'objects' | 'dots'
  order: 'seq' | 'mix'
  mixCount: number
  choices: number
  visual: boolean
  voice: boolean
  autoHelp: boolean
}

/** Fasi completate per ogni tabellina, più "mix" per il ripasso misto */
export type TablesProgress = { [table: string]: TablesPhase[] | boolean }

export const ALL_TABLES = Array.from({ length: 13 }, (_, i) => i)

export const TABLES_DEFAULTS: TablesSettings = {
  visible: [...ALL_TABLES],
  upTo: 5,
  phases: ['scopri', 'salta', 'ricorda'],
  look: 'objects',
  order: 'seq',
  mixCount: 10,
  choices: 2,
  visual: true,
  voice: true,
  autoHelp: true,
}

type OptionValue = TablesSettings[keyof TablesSettings] | number | string

export const TABLES_OPTIONS: { key: keyof TablesSettings; label: string; multi?: boolean; values: [OptionValue, string][] }[] = [
  { key: 'visible',  label: 'Tabelline visibili', multi: true, values: ALL_TABLES.map(n => [n, String(n)]) },
  { key: 'upTo',     label: 'Fino a',                         values: [[5, '× 5'], [10, '× 10'], [12, '× 12']] },
  { key: 'phases',   label: 'Fasi attive', multi: true,       values: [['scopri', '👀 Scopri'], ['salta', '🐸 Salta'], ['ricorda', '🧠 Ricorda']] },
  { key: 'look',     label: '"Scopri" con',                   values: [['objects', 'Oggetti'], ['dots', 'Pallini']] },
  { key: 'order',    label: 'Domande in "Ricorda"',           values: [['seq', 'In ordine'], ['mix', 'Mescolate']] },
  { key: 'mixCount', label: 'Domande in "Tutte mischiate"',   values: [[10, '10'], [20, '20']] },
  { key: 'choices',  label: 'Risposte tra cui scegliere',     values: [[2, '2'], [3, '3']] },
  { key: 'visual',   label: 'Aiuto visivo in "Ricorda"',      values: [[true, 'Sì'], [false, 'No']] },
  { key: 'voice',    label: 'Voce',                           values: [[true, 'Sì'], [false, 'No']] },
  { key: 'autoHelp', label: 'Aiuto dopo 2 errori',            values: [[true, 'Sì'], [false, 'No']] },
]

const SETTINGS_KEY = 'tabelline_impostazioni'
const PROGRESS_KEY = 'tabelline_progressi'

export function loadTablesSettings(): TablesSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const s = { ...TABLES_DEFAULTS, ...JSON.parse(raw) } as TablesSettings
      if (!Array.isArray(s.visible) || !s.visible.length) s.visible = [...TABLES_DEFAULTS.visible]
      if (!Array.isArray(s.phases) || !s.phases.length) s.phases = [...TABLES_DEFAULTS.phases]
      return s
    }
  } catch (_) {}
  return { ...TABLES_DEFAULTS, visible: [...TABLES_DEFAULTS.visible], phases: [...TABLES_DEFAULTS.phases] }
}

export function saveTablesSettings(settings: TablesSettings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)) } catch (_) {}
}

export function loadTablesProgress(): TablesProgress {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') || {} } catch (_) { return {} }
}

export function saveTablesProgress(progress: TablesProgress) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)) } catch (_) {}
}

/** Fasi disponibili per una tabellina: per lo 0 non c'è "Salta" (la rana non si muoverebbe) */
export function phasesFor(table: number, phases: TablesPhase[]): TablesPhase[] {
  const list = phases.filter(p => !(table === 0 && p === 'salta'))
  return list.length ? list : ['scopri']
}
