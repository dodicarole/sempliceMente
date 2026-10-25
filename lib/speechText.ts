/**
 * Preparare un testo scritto da un genitore per la voce del telefono.
 * Le storie scritte a mano spesso hanno parole in STAMPATO MAIUSCOLO (che la voce legge
 * lettera per lettera, come una sigla), emoji (che la voce descrive: "faccina sorridente"),
 * a capo senza punto, punti senza spazio ("ciao.Oggi") o "!!!" ripetuti.
 * Qui si sistema il testo da far leggere, senza toccare quello che si vede sullo schermo.
 * `map[i]` dice a quale carattere del testo originale corrisponde il carattere i del testo letto:
 * serve per illuminare la parola giusta mentre la voce legge.
 */
export function prepareForSpeech(text: string, lang: 'it' | 'fr' = 'it'): { spoken: string; map: number[] } {
  // 1) le parole tutte in maiuscolo (almeno 2 lettere) diventano minuscole: stessa lunghezza, posizioni uguali
  let src = text.replace(/\p{L}{2,}/gu, w => (w === w.toUpperCase() && w !== w.toLowerCase() ? w.toLowerCase() : w))
  // se quasi tutto il testo era maiuscolo, anche le singole lettere (A, E, Ì…) tornano minuscole
  const letters = text.match(/\p{L}/gu) ?? []
  const upper = letters.filter(c => c === c.toUpperCase() && c !== c.toLowerCase()).length
  if (letters.length > 8 && upper / letters.length > 0.7) src = src.toLowerCase()

  const out: string[] = []
  const map: number[] = []
  const push = (s: string, orig: number) => { for (let k = 0; k < s.length; k++) { out.push(s[k]); map.push(orig) } }
  const lastChar = () => { for (let k = out.length - 1; k >= 0; k--) if (out[k] !== ' ') return out[k]; return '' }
  const isEmoji = /[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}\u{20E3}]/u
  const isLetter = /[\p{L}\p{N}]/u

  let i = 0
  while (i < src.length) {
    const cp = src.codePointAt(i)!
    const ch = String.fromCodePoint(cp)
    const next = src.codePointAt(i + ch.length)
    const nextCh = next !== undefined ? String.fromCodePoint(next) : ''
    if (isEmoji.test(ch)) push(' ', i)                                    // le emoji non si leggono
    else if (ch === '\n' || ch === '\r') {                                 // a capo = fine della frase
      if (lastChar() && !/[.!?;:,…]/.test(lastChar())) push('.', i)
      push(' ', i)
    }
    else if (/[*#_~|/\\<>{}[\]^=+]/.test(ch)) push(' ', i)                  // simboli che la voce leggerebbe a nome
    else if (ch === '&') push(lang === 'fr' ? ' et ' : ' e ', i)
    else if (/[!?]/.test(ch) && lastChar() === ch) { /* "!!!" → "!" */ }
    else {
      push(ch, i)
      // "ciao.Oggi" → "ciao. Oggi" (ma non i numeri: 3.5, 10,30)
      if (/[.,!?;:]/.test(ch) && nextCh && isLetter.test(nextCh) && !(/[.,]/.test(ch) && /\d/.test(nextCh) && /\d/.test(src[i - 1] ?? ''))) push(' ', i)
    }
    i += ch.length
  }
  return { spoken: out.join(''), map }
}

/**
 * La voce migliore del telefono per la lingua dell'app.
 * Quella di serie a volte è la più robotica: si preferiscono le voci "naturali" o "di qualità".
 */
export function bestVoice(voices: SpeechSynthesisVoice[], locale: string): SpeechSynthesisVoice | undefined {
  const short = locale.slice(0, 2).toLowerCase()
  const mine = voices.filter(v => v.lang.replace('_', '-').toLowerCase().startsWith(short))
  if (!mine.length) return undefined
  const score = (v: SpeechSynthesisVoice) => {
    const n = v.name.toLowerCase()
    let s = 0
    if (v.lang.replace('_', '-').toLowerCase() === locale.toLowerCase()) s += 4      // it-IT invece di it-CH
    if (/natural|neural|premium|enhanced|migliorat|améliorée|online/.test(n)) s += 6
    if (/google/.test(n)) s += 3
    if (/siri/.test(n)) s += 3
    if (/compact|eloquence|espeak/.test(n)) s -= 4                                  // le voci più robotiche
    if (v.default) s += 1
    return s
  }
  return mine.sort((a, b) => score(b) - score(a))[0]
}
