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

export const READING_OPTIONS: { key: keyof ReadingSettings; label: string; values: [ReadingSettings[keyof ReadingSettings], string][] }[] = [
  { key: 'size',      label: 'Dimensione del testo',            values: [['normal', 'Normale'], ['large', 'Grande'], ['xlarge', 'Molto grande']] },
  { key: 'font',      label: 'Carattere',                       values: [['standard', 'Standard'], ['leggibile', 'Alta leggibilità']] },
  { key: 'uppercase', label: 'Scrittura',                       values: [[false, 'Normale'], [true, 'STAMPATO MAIUSCOLO']] },
  { key: 'spacing',   label: 'Spazio tra lettere e righe',      values: [['normal', 'Normale'], ['wide', 'Più ampio']] },
  { key: 'autoRead',  label: 'Leggi le storie ad alta voce da sole', values: [[false, 'No'], [true, 'Sì']] },
]

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
