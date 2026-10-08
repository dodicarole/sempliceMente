export type NumbersMode = 'tap' | 'drag'

export interface NumbersSettings {
  mode: NumbersMode
  max: number
  count: number
  showLine: boolean
  voice: boolean
  autoHelp: boolean
}

export const NUMBERS_DEFAULTS: NumbersSettings = {
  mode: 'tap', max: 30, count: 5, showLine: true, voice: true, autoHelp: true,
}

export const NUMBERS_OPTIONS: { key: keyof NumbersSettings; label: string; values: [NumbersSettings[keyof NumbersSettings], string][] }[] = [
  { key: 'mode',     label: 'Come si sposta il numero',  values: [['tap', 'Tocca'], ['drag', 'Trascina']] },
  { key: 'max',      label: 'Numeri fino a',             values: [[10, '10'], [20, '20'], [30, '30'], [50, '50'], [100, '100']] },
  { key: 'count',    label: 'Quanti numeri da ordinare', values: [[3, '3'], [5, '5'], [7, '7'], [10, '10']] },
  { key: 'showLine', label: 'Linea dei numeri',          values: [[true, 'Sì'], [false, 'No']] },
  { key: 'voice',    label: 'Voce che legge i numeri',   values: [[true, 'Sì'], [false, 'No']] },
  { key: 'autoHelp', label: 'Aiuto dopo 2 errori',       values: [[true, 'Sì'], [false, 'No']] },
]

const STORAGE_KEY = 'numeri_impostazioni'

export function loadNumbersSettings(): NumbersSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...NUMBERS_DEFAULTS, ...JSON.parse(raw) }
  } catch (_) {}
  return NUMBERS_DEFAULTS
}

export function saveNumbersSettings(settings: NumbersSettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)) } catch (_) {}
}
