/** L'ora in parole, in italiano e in francese, come si dice ai bambini */
import type { Lang } from '@/lib/i18n'

function numIt(n: number): string {
  const u = ['', 'uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove']
  const t = ['dieci', 'undici', 'dodici', 'tredici', 'quattordici', 'quindici', 'sedici', 'diciassette', 'diciotto', 'diciannove']
  const d = ['', '', 'venti', 'trenta', 'quaranta', 'cinquanta']
  if (n < 10) return u[n]
  if (n < 20) return t[n - 10]
  const dd = d[Math.floor(n / 10)], uu = n % 10
  if (!uu) return dd
  return (uu === 1 || uu === 8 ? dd.slice(0, -1) : dd) + (uu === 3 ? 'tré' : u[uu])
}
function numFr(n: number): string {
  const u = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf']
  const d = ['', '', 'vingt', 'trente', 'quarante', 'cinquante']
  if (n < 20) return u[n]
  const dd = d[Math.floor(n / 10)], uu = n % 10
  if (!uu) return dd
  return uu === 1 ? `${dd} et un` : `${dd}-${u[uu]}`
}
const ORE = ['dodici', 'una', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci', 'undici', 'dodici']

export const digital = (h: number, m: number) => `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')}`

export function timeWords(h: number, m: number, lang: Lang): string {
  const hh = h % 12 === 0 ? 12 : h % 12
  if (lang === 'fr') {
    const heures = (x: number) => (x === 1 ? 'une heure' : `${numFr(x)} heures`)
    if (m === 0) return `Il est ${heures(hh)} pile`
    if (m === 15) return `Il est ${heures(hh)} et quart`
    if (m === 30) return `Il est ${heures(hh)} et demie`
    if (m === 45) return `Il est ${heures(hh % 12 + 1)} moins le quart`
    return `Il est ${heures(hh)} ${numFr(m)}`
  }
  const base = hh === 1 ? "È l'una" : `Sono le ${ORE[hh]}`
  if (m === 0) return base + (hh === 1 ? '' : ' in punto')
  if (m === 15) return `${base} e un quarto`
  if (m === 30) return `${base} e mezza`
  if (m === 45) return `${base} e tre quarti`
  return `${base} e ${numIt(m)}`
}
