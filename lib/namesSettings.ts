export interface NamesSettings { pics: boolean; colorHint: boolean; count: number; voice: boolean; autoHelp: boolean }
export const NAMES_DEFAULTS: NamesSettings = { pics: true, colorHint: true, count: 8, voice: true, autoHelp: true }
const KEY = 'nomi_impostazioni'

export function loadNamesSettings(): NamesSettings {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...NAMES_DEFAULTS, ...JSON.parse(raw) } } catch (_) {}
  return NAMES_DEFAULTS
}
export function saveNamesSettings(s: NamesSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {}
}

export const NAMES_OPTIONS: { key: keyof NamesSettings; label: string; values: [NamesSettings[keyof NamesSettings], string][] }[] = [
  { key: 'pics',      label: 'Immagini accanto alla parola',                         values: [[true, 'Sì'], [false, 'No']] },
  { key: 'colorHint', label: 'Bordo della parola colorato come la risposta giusta',  values: [[true, 'Sì'], [false, 'No']] },
  { key: 'count',     label: 'Parole per partita',                                   values: [[6, '6'], [8, '8'], [12, '12']] },
  { key: 'voice',     label: 'Voce',                                                 values: [[true, 'Sì'], [false, 'No']] },
  { key: 'autoHelp',  label: 'Aiuto dopo 2 errori',                                  values: [[true, 'Sì'], [false, 'No']] },
]
