import type { Dict } from '@/lib/i18n/it'

export interface SplitSettings {
  level: '2' | '3' | 'mix'
  zeros: boolean
  blocks: boolean
  zeroTags: boolean
  houses: boolean
  voice: boolean
  autoHelp: boolean
}

export const SPLIT_DEFAULTS: SplitSettings = {
  level: 'mix', zeros: false, blocks: true, zeroTags: true, houses: true, voice: true, autoHelp: true,
}

const KEY = 'scomposizione_impostazioni'

export function loadSplitSettings(): SplitSettings {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...SPLIT_DEFAULTS, ...JSON.parse(raw) } } catch (_) {}
  return SPLIT_DEFAULTS
}
export function saveSplitSettings(s: SplitSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (_) {}
}

/** Opzioni con le etichette nella lingua scelta */
export function splitOptions(t: Dict): { key: keyof SplitSettings; label: string; values: [SplitSettings[keyof SplitSettings], string][] }[] {
  const s = t.split, yes = t.reading.yes, no = t.reading.no
  return [
    { key: 'level',    label: s.setLevel,    values: [['2', s.level2], ['3', s.level3], ['mix', s.levelMix]] },
    { key: 'zeros',    label: s.setZeros,    values: [[false, no], [true, yes]] },
    { key: 'blocks',   label: s.setBlocks,   values: [[true, yes], [false, no]] },
    { key: 'zeroTags', label: s.setZeroTags, values: [[true, yes], [false, no]] },
    { key: 'houses',   label: s.setHouses,   values: [[true, yes], [false, no]] },
    { key: 'voice',    label: s.setVoice,    values: [[true, yes], [false, no]] },
    { key: 'autoHelp', label: s.setAutoHelp, values: [[true, yes], [false, no]] },
  ]
}
