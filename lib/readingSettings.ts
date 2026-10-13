/**
 * Impostazioni di lettura dell'area bambino: dimensione del testo, carattere,
 * stampato maiuscolo, spazi e lettura automatica delle storie.
 * Si applicano tramite attributi sull'elemento <html> (vedi globals.css).
 */

export interface ReadingSettings {
  size: 'normal' | 'large' | 'xlarge'
  font: 'standard' | 'leggibile'
  uppercase: boolean
  spacing: 'normal' | 'wide'
  autoRead: boolean
}

export const READING_DEFAULTS: ReadingSettings = {
  size: 'normal', font: 'standard', uppercase: false, spacing: 'normal', autoRead: false,
}

type ReadingTexts = import('@/lib/i18n/it').Dict['reading']

/** Opzioni con le etichette nella lingua scelta */
export function readingOptions(r: ReadingTexts): { key: keyof ReadingSettings; label: string; values: [ReadingSettings[keyof ReadingSettings], string][] }[] {
  return [
    { key: 'size',      label: r.size,     values: [['normal', r.sizeNormal], ['large', r.sizeLarge], ['xlarge', r.sizeXLarge]] },
    { key: 'font',      label: r.font,     values: [['standard', r.fontStandard], ['leggibile', r.fontReadable]] },
    { key: 'uppercase', label: r.writing,  values: [[false, r.writingNormal], [true, r.writingUpper]] },
    { key: 'spacing',   label: r.spacing,  values: [['normal', r.spacingNormal], ['wide', r.spacingWide]] },
    { key: 'autoRead',  label: r.autoRead, values: [[false, r.no], [true, r.yes]] },
  ]
}

const KEY = 'lettura_impostazioni'

export function loadReadingSettings(): ReadingSettings {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...READING_DEFAULTS, ...JSON.parse(raw) }
  } catch (_) {}
  return READING_DEFAULTS
}

/** Applica le impostazioni alla pagina */
export function applyReadingSettings(settings: ReadingSettings) {
  if (typeof document === 'undefined') return
  const d = document.documentElement.dataset
  d.letturaDimensione = settings.size
  d.letturaFont       = settings.font
  d.letturaMaiuscolo  = String(settings.uppercase)
  d.letturaSpazi      = settings.spacing
}

export function saveReadingSettings(settings: ReadingSettings) {
  try { localStorage.setItem(KEY, JSON.stringify(settings)) } catch (_) {}
  applyReadingSettings(settings)
}
