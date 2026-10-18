import type { Dict } from '@/lib/i18n/it'
import type { Accent } from '@/lib/englishData'

export interface EnglishSettings { accent: Accent; rate: number; written: boolean; translation: boolean; choices: number; autoHelp: boolean }
export const ENGLISH_DEFAULTS: EnglishSettings = { accent: 'en-GB', rate: 0.7, written: true, translation: true, choices: 3, autoHelp: true }
const KEY = 'english_impostazioni'

export function loadEnglishSettings(): EnglishSettings {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...ENGLISH_DEFAULTS, ...JSON.parse(raw) } } catch (_) {}
  return ENGLISH_DEFAULTS
}
export function saveEnglishSettings(s: EnglishSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {}
}

export function englishOptions(t: Dict): { key: keyof EnglishSettings; label: string; values: [EnglishSettings[keyof EnglishSettings], string][] }[] {
  const e = t.english, yes = t.reading.yes, no = t.reading.no
  return [
    { key: 'accent',      label: e.setAccent,      values: [['en-GB', e.british], ['en-US', e.american]] },
    { key: 'rate',        label: e.setRate,        values: [[0.7, e.slow], [0.9, e.normal]] },
    { key: 'written',     label: e.setWritten,     values: [[true, yes], [false, no]] },
    { key: 'translation', label: e.setTranslation, values: [[true, yes], [false, no]] },
    { key: 'choices',     label: e.setChoices,     values: [[2, '2'], [3, '3']] },
    { key: 'autoHelp',    label: t.split.setAutoHelp, values: [[true, yes], [false, no]] },
  ]
}
