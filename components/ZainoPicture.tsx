'use client'

/**
 * Immagine proposta per un materiale dello zaino quando non c'è una foto.
 * - "quaderno di matematica" → quaderno blu
 * - "quaderno di italiano"   → quaderno rosso
 * - altri quaderni           → quaderno trasparente
 * - tutto il resto           → l'icona scelta in base al nome
 */

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

interface Props {
  name: string
  icon?: string
  size?: number
}

export default function ZainoPicture({ name, icon, size = 80 }: Props) {
  const color = notebookColorFor(name)
  if (color) return <Notebook color={color} size={size} />
  return <>{icon || '🎒'}</>
}
