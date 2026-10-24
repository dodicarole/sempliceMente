'use client'

/**
 * Immagine proposta per un materiale dello zaino quando non c'è una foto.
 * - "quaderno di matematica" → quaderno blu
 * - "quaderno di italiano"   → quaderno rosso
 * - altri quaderni           → quaderno trasparente
 * - astuccio, gomma, colla, temperino → un disegno (non esiste un'emoji giusta)
 * - tutto il resto           → l'icona scelta in base al nome (anche per i materiali già salvati)
 */
import { pickZainoIcon } from '@/types'

type NotebookColor = 'blue' | 'red' | 'clear'

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function notebookColorFor(name: string): NotebookColor | null {
  const n = normalize(name)
  if (!n.includes('quadern')) return null
  if (n.includes('matemat')) return 'blue'
  if (n.includes('italian')) return 'red'
  return 'clear'
}

const COLORS: Record<NotebookColor, { cover: string; edge: string }> = {
  blue:  { cover: '#2F6FDB', edge: '#1E4FA8' },
  red:   { cover: '#E03131', edge: '#A61E1E' },
  clear: { cover: 'rgba(160, 185, 225, 0.22)', edge: '#8FA3C7' },
}

function Notebook({ color, size }: { color: NotebookColor; size: number }) {
  const { cover, edge } = COLORS[color]
  const clear = color === 'clear'
  return (
    <svg viewBox="0 0 64 80" width={size * 0.8} height={size} aria-hidden="true">
      {/* pagine */}
      <rect x="12" y="6" width="47" height="70" rx="4" fill="#FFFFFF" stroke="#C9D2E3" strokeWidth="1.5" />
      {clear && [20, 28, 36, 44, 52, 60, 68].map(y => (
        <line key={y} x1="18" x2="52" y1={y} y2={y} stroke="#B9CBE8" strokeWidth="1.5" />
      ))}
      {/* copertina */}
      <rect x="8" y="4" width="48" height="72" rx="5" fill={cover} stroke={edge} strokeWidth="2" />
      {clear ? (
        <path d="M15 8 H25 L15 32 Z" fill="#FFFFFF" opacity="0.55" />
      ) : (
        <>
          <rect x="20" y="14" width="28" height="16" rx="3" fill="#FFFFFF" />
          <line x1="24" x2="44" y1="20" y2="20" stroke={edge} strokeWidth="1.5" />
          <line x1="24" x2="40" y1="25" y2="25" stroke={edge} strokeWidth="1.5" />
        </>
      )}
      {/* spirale */}
      {[9, 17, 25, 33, 41, 49, 57, 65].map(y => (
        <rect key={y} x="3" y={y} width="10" height="4" rx="2" fill="#8E98B3" />
      ))}
    </svg>
  )
}

/* ── Disegni per gli oggetti senza un'emoji adatta ── */
type Drawn = 'astuccio' | 'gomma' | 'colla' | 'temperino'
export function drawnFor(name: string): Drawn | null {
  const n = normalize(name).replace(/['’\-]/g, ' ')
  if (n.includes('astucc') || n.includes('trousse')) return 'astuccio'
  if (n.includes('temperino') || n.includes('temperamatite') || n.includes('taille crayon')) return 'temperino'
  if (n.includes('gomma') || n.includes('gomme')) return 'gomma'
  if (n.includes('colla') || n.includes('colle')) return 'colla'
  return null
}

function PencilCase({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true">
      {/* matite che spuntano */}
      <g transform="rotate(-14 28 30)"><rect x="22" y="8" width="9" height="34" rx="2" fill="#FCC419" /><path d="M22 8 L26.5 0 L31 8 Z" fill="#F2C7A5" /><path d="M25 3 L26.5 0 L28 3 Z" fill="#1F2147" /></g>
      <g transform="rotate(8 46 28)"><rect x="40" y="10" width="9" height="32" rx="2" fill="#1C7ED6" /><path d="M40 10 L44.5 2 L49 10 Z" fill="#F2C7A5" /><path d="M43 5 L44.5 2 L46 5 Z" fill="#1C7ED6" /></g>
      <g transform="rotate(20 58 32)"><rect x="54" y="16" width="8" height="28" rx="2" fill="#E03131" /><path d="M54 16 L58 9 L62 16 Z" fill="#F2C7A5" /><path d="M56.6 11.5 L58 9 L59.4 11.5 Z" fill="#E03131" /></g>
      {/* astuccio con la cerniera */}
      <rect x="5" y="32" width="70" height="38" rx="16" fill="#7048E8" stroke="#4C2FB5" strokeWidth="2" />
      <line x1="14" y1="40" x2="66" y2="40" stroke="#4C2FB5" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 3" />
      <rect x="62" y="37" width="8" height="12" rx="3" fill="#FCC419" stroke="#B8860B" strokeWidth="1.5" />
      <rect x="12" y="50" width="20" height="10" rx="4" fill="#FFFFFF" opacity=".85" />
    </svg>
  )
}
function Eraser({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true">
      <g transform="rotate(-20 40 40)">
        <rect x="12" y="28" width="56" height="26" rx="6" fill="#F783AC" stroke="#C2255C" strokeWidth="2" />
        <rect x="34" y="27" width="34" height="28" rx="5" fill="#1C7ED6" stroke="#145DA0" strokeWidth="2" />
        <rect x="40" y="35" width="22" height="4" rx="2" fill="#FFFFFF" opacity=".8" /><rect x="40" y="43" width="14" height="4" rx="2" fill="#FFFFFF" opacity=".8" />
      </g>
    </svg>
  )
}
function GlueStick({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true">
      <rect x="27" y="6" width="26" height="18" rx="5" fill="#E03131" stroke="#A61E1E" strokeWidth="2" />
      <rect x="25" y="22" width="30" height="48" rx="6" fill="#FFFFFF" stroke="#8FA3C7" strokeWidth="2" />
      <rect x="29" y="34" width="22" height="20" rx="3" fill="#FCC419" />
      <text x="40" y="49" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1F2147" fontFamily="system-ui,sans-serif">GLUE</text>
      <rect x="31" y="70" width="18" height="6" rx="2" fill="#E03131" />
    </svg>
  )
}
function Sharpener({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 80 80" width={size} height={size} aria-hidden="true">
      <rect x="14" y="24" width="52" height="38" rx="8" fill="#2F9E44" stroke="#1E6B44" strokeWidth="2" />
      <rect x="20" y="30" width="40" height="10" rx="2" fill="#C9CED6" stroke="#8E98B3" strokeWidth="1.5" />
      <circle cx="40" cy="50" r="7" fill="#1F2147" />
      <g transform="rotate(-30 40 50)"><rect x="37" y="12" width="6" height="34" rx="1.5" fill="#FCC419" /><path d="M37 46 L40 54 L43 46 Z" fill="#F2C7A5" /></g>
    </svg>
  )
}
const DRAWN: Record<Drawn, (p: { size: number }) => React.JSX.Element> = { astuccio: PencilCase, gomma: Eraser, colla: GlueStick, temperino: Sharpener }

interface Props {
  name: string
  icon?: string
  size?: number
}

export default function ZainoPicture({ name, icon, size = 80 }: Props) {
  const color = notebookColorFor(name)
  if (color) return <Notebook color={color} size={size} />
  const drawn = drawnFor(name)
  if (drawn) { const D = DRAWN[drawn]; return <D size={size} /> }
  // l'icona salvata; se manca (materiali aggiunti prima) la si sceglie di nuovo dal nome
  return <>{icon || pickZainoIcon(name) || '🎒'}</>
}
