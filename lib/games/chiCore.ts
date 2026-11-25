// @ts-nocheck
/*
 * 👤 Solo «Chi?»: quattro livelli (chi fa l'azione o la cosa; tra due personaggi; una scena con un piccolo aiuto; domanda aperta),
 * blocchi da 4 prove, pausa, modellaggio con l'articolo, due risposte a caso di fila → scendere o commentare, criteri per passare.
 * La pagina del bambino ha solo scena, domanda e risposte; livelli, indicazioni e sedute sono nell'area Genitore (chi_stato, per figlio).
 */
export interface ChiOptions { mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void; accent?: string }
export const CHI_CSS = ".smchi{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#1C7ED6;--radius:22px;\n  box-sizing:border-box}\n\n.smchi *{box-sizing:border-box}\n.smchi{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smchi button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation}\n.smchi button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smchi [hidden]{display:none!important}\n.smchi .app{max-width:560px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:12px}\n.smchi .title{background:var(--card);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;gap:12px}\n.smchi .title .em{font-size:36px}\n.smchi .title h1{margin:0;font-size:21px;font-weight:900}\n.smchi .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smchi .status{background:var(--blue);color:#fff;border-radius:16px;padding:10px 14px;font-size:16px;font-weight:900}\n.smchi .memo{background:#FFF6D6;color:#5A4300;border-radius:16px;padding:10px 14px;font-size:14px;font-weight:700;line-height:1.5}\n.smchi .levels{display:flex;gap:6px;align-items:center}\n.smchi .levels span{font-size:14px;font-weight:800;color:var(--soft)}\n.smchi .lv{min-width:52px;min-height:48px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:20px;font-weight:900}\n.smchi .lv[aria-pressed=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smchi .lvinfo{background:var(--card);border-radius:16px;padding:10px 14px;font-size:14px;font-weight:700;line-height:1.5}\n.smchi .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:12px;align-items:center;text-align:center}\n.smchi .scene{width:100%;border-radius:18px;overflow:hidden}\n.smchi .scene svg{display:block;width:100%;height:auto}\n.smchi .two{display:grid;grid-template-columns:1fr 1fr;gap:6px}\n.smchi .two svg{border-radius:12px}\n.smchi .script{width:100%;text-align:left;border-radius:14px;padding:10px 12px;background:#E7F5FF;font-size:17px;font-weight:700;line-height:1.45}\n.smchi .pause{font-size:15px;font-weight:900;color:var(--blue);min-height:20px}\n.smchi .opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}\n.smchi .opt{min-height:64px;border-radius:16px;border:3px solid var(--line);background:var(--card);font-size:21px;font-weight:900;box-shadow:0 4px 0 var(--line)}\n.smchi .opt.right{background:var(--done);border-color:var(--done);color:#fff}\n.smchi .opt.wrong{border-color:#E03131;background:#FFF0F0}\n.smchi .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%}\n.smchi .mk{flex:1;min-height:50px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:14px;font-weight:900}\n.smchi .mk.ok{border-color:#2F9E44}\n.smchi .mk.aiuto{border-color:#F08C00}\n.smchi .mk.caso{border-color:#E03131}\n.smchi .model{width:100%;border-radius:14px;padding:10px 12px;background:var(--done-bg);font-size:17px;font-weight:800;line-height:1.45;text-align:left}\n.smchi .warn{width:100%;border-radius:14px;padding:10px 12px;background:#FFE3E3;font-size:15px;font-weight:700;line-height:1.5;text-align:left;display:flex;flex-direction:column;gap:8px}\n.smchi .good{width:100%;border-radius:14px;padding:10px 12px;background:var(--done-bg);font-size:15px;font-weight:800;line-height:1.5}\n.smchi .btn{min-height:52px;padding:0 16px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:16px;font-weight:800}\n.smchi .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smchi .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.smchi .btn.help{background:#FFF3BF;border-color:#F0C93C}\n.smchi .dots{display:flex;gap:6px}\n.smchi .dots span{width:12px;height:12px;border-radius:50%;background:var(--line)}\n.smchi .dots .on{background:var(--blue);width:24px;border-radius:6px}\n.smchi .dots .ok{background:#2F9E44}\n.smchi .dots .mid{background:#F08C00}\n.smchi .dots .ko{background:#E03131}\n.smchi .ask{margin:0;font-size:19px;font-weight:900}\n.smchi .sub{margin:0;font-size:13px;font-weight:700;color:var(--soft);line-height:1.45}\n.smchi .view{display:grid;grid-template-columns:1fr 1fr;gap:8px}\n.smchi .vb{min-height:50px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:15px;font-weight:900}\n.smchi .vb[aria-pressed=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smchi .q{font-size:26px;font-weight:900;line-height:1.3}\n.smchi .q .w{display:inline-flex;align-items:center;gap:5px;background:#1C7ED6;color:#fff;border-radius:12px;padding:0 10px}\n.smchi .q .wi{display:inline-flex;align-items:center;justify-content:center;width:1.25em;height:1.25em;border-radius:50%;background:#fff;font-size:.8em}\n.smchi .frase{width:100%;border-radius:14px;padding:10px 12px;background:var(--ground);font-size:22px;font-weight:800}\n.smchi .adult{width:100%;border-top:2px dashed var(--line);padding-top:10px;display:flex;flex-direction:column;gap:6px}\n.smchi .adult .sub{text-align:center}\n.smchi .hist{background:var(--card);border-radius:16px;padding:10px 14px;display:flex;flex-direction:column;gap:4px;font-size:13px;font-weight:700;color:var(--soft)}"
export function mountChi(root: HTMLElement, opts: ChiOptions = {}): () => void {
  root.innerHTML = "<section class=\"card\" data-k=\"stage\"></section>\n  <div data-k=\"parent\" hidden style=\"display:flex;flex-direction:column;gap:12px\">\n    <div class=\"status\" data-k=\"status\"></div>\n    <div class=\"memo\">📌 <b>Promemoria</b>: al massimo 3–4 prove per blocco. Se va a caso due volte di fila, scendi di un livello o fai un commento senza domanda. Modella sempre con l’articolo, senza correggere.</div>\n    <div class=\"levels\"><span>Livello:</span><span data-k=\"levels\" style=\"display:flex;gap:6px\"></span></div>\n    <div class=\"lvinfo\" data-k=\"lvinfo\"></div>\n    <div class=\"lvinfo\"><b>🗣️ Prima la frase?</b> «Zoe va al mercato.» e poi «Chi va al mercato?»<div class=\"row\" data-k=\"frase\" style=\"justify-content:flex-start;margin-top:6px\"></div><span class=\"sub\" data-k=\"fraseTip\"></span></div>\n    <div class=\"lvinfo\"><b>👧 Da solo, con due risposte?</b> Il bambino tocca la risposta da solo, a tutti i livelli: l’app segna giusto o sbagliato.<div class=\"row\" data-k=\"solo\" style=\"justify-content:flex-start;margin-top:6px\"></div></div>\n    <div class=\"hist\"><b style=\"color:var(--text)\">🗒️ Le sedute</b><div data-k=\"hist\" style=\"display:flex;flex-direction:column;gap:2px\"></div></div>\n  </div>"
const __win = opts.onWin



/** Nome, colore e tono di voce di ogni personaggio */
var CHARS = {
    zoe: { name: 'Zoe', color: '#F08C00', pitch: 1.25 }, lila: { name: 'Lila', color: '#C2255C', pitch: 1.35 },
    nico: { name: 'Nico', color: '#0C8599', pitch: 1.1 }, amina: { name: 'Amina', color: '#2F9E44', pitch: 1.2 },
    meky: { name: 'Meky', color: '#5F88CC', pitch: 1.3 }, mamma: { name: 'Mamma', color: '#7048E8', pitch: 0.95 }, tedo: { name: 'Tedo', color: '#2F9E44', pitch: 1.45 },
    elio: { name: 'Elio', color: '#1C7ED6', pitch: 1.15 }, maestra: { name: 'Maestra', color: '#0B7285', pitch: 1.0 },
};
const INK = '#2B2D52', CHEEK = '#F59AA0';
const SK = { light: '#F6D2B4', fair: '#F2C7A5', medium: '#D9A273', tan: '#B97D4E', dark: '#7A4A2A' };
const CAST = {
    zoe: { skin: 'dark', hair: '#1E120B', style: 'curly', shirt: '#F08C00', pants: '#4A5A7A' },
    lila: { skin: 'light', hair: '#E8B64C', style: 'long', shirt: '#F783AC', pants: '#C2255C', skirt: 1, freckles: 1 },
    nico: { skin: 'fair', hair: '#7A4E2D', style: 'short', shirt: '#0C8599', pants: '#2F4858', phones: 1 },
    amina: { skin: 'tan', hair: '#2B1B12', style: 'bun', shirt: '#2F9E44', pants: '#2B5A3A', glasses: 1 },
    meky: { skin: 'fair', hair: '#6B4226', style: 'short', shirt: '#7FA8E8', pants: '#5F88CC' },
    mamma: { skin: 'fair', hair: '#8B5A2B', style: 'long', shirt: '#9775FA', pants: '#5F3DC4', skirt: 1 },
    elio: { skin: 'medium', hair: '#3B2A1A', style: 'short', shirt: '#1C7ED6', pants: '#364FC7' },
    maestra: { skin: 'light', hair: '#6B4226', style: 'bun', shirt: '#12B886', pants: '#0B7285', skirt: 1, glasses: 1 }
};
const f = (n) => (+n).toFixed(1);
function head(o, cx, cy, r, mood) {
    let s = '';
    const c = SK[o.skin];
    if (o.style === 'long')
        s += '<path d="M' + f(cx - r - 6) + ' ' + f(cy + r * 1.4) + ' C' + f(cx - r - 12) + ' ' + f(cy - r * 1.6) + ' ' + f(cx + r + 12) + ' ' + f(cy - r * 1.6) + ' ' + f(cx + r + 6) + ' ' + f(cy + r * 1.4) + 'Z" fill="' + o.hair + '"/>';
    if (o.style === 'curly')
        for (let a = 0; a < 360; a += 30) {
            const ax = cx + Math.cos((a - 90) * Math.PI / 180) * r * .95, ay = cy - r * .15 + Math.sin((a - 90) * Math.PI / 180) * r * .9;
            if (ay < cy + r * .2)
                s += '<circle cx="' + f(ax) + '" cy="' + f(ay) + '" r="' + f(r * .38) + '" fill="' + o.hair + '"/>';
        }
    if (o.style === 'bun')
        s += '<circle cx="' + cx + '" cy="' + f(cy - r * 1.15) + '" r="' + f(r * .42) + '" fill="' + o.hair + '"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c + '"/>';
    const front = o.style === 'long' ? 'M' + f(cx - r) + ' ' + f(cy - 4) + ' C' + f(cx - r) + ' ' + f(cy - r * 1.35) + ' ' + f(cx + r) + ' ' + f(cy - r * 1.35) + ' ' + f(cx + r) + ' ' + f(cy - 4) + ' C' + f(cx + r * .3) + ' ' + f(cy - r * .7) + ' ' + f(cx - r * .5) + ' ' + f(cy - r * .6) + ' ' + f(cx - r) + ' ' + f(cy - 4) + 'Z'
        : o.style === 'curly' ? 'M' + f(cx - r) + ' ' + f(cy - r * .15) + ' C' + f(cx - r * .9) + ' ' + f(cy - r * 1.2) + ' ' + f(cx + r * .9) + ' ' + f(cy - r * 1.2) + ' ' + f(cx + r) + ' ' + f(cy - r * .15) + ' C' + f(cx + r * .4) + ' ' + f(cy - r * .55) + ' ' + f(cx - r * .4) + ' ' + f(cy - r * .55) + ' ' + f(cx - r) + ' ' + f(cy - r * .15) + 'Z'
            : 'M' + f(cx - r - 2) + ' ' + f(cy - 2) + ' C' + f(cx - r) + ' ' + f(cy - r * 1.45) + ' ' + f(cx + r) + ' ' + f(cy - r * 1.45) + ' ' + f(cx + r + 2) + ' ' + f(cy - 2) + ' C' + f(cx + r * .6) + ' ' + f(cy - r * .55) + ' ' + f(cx - r * .2) + ' ' + f(cy - r * .75) + ' ' + f(cx - r - 2) + ' ' + f(cy - 2) + 'Z';
    s += '<path d="' + front + '" fill="' + o.hair + '"/>';
    const e = r * .33;
    s += '<circle cx="' + f(cx - e) + '" cy="' + f(cy - 2) + '" r="' + f(r * .1) + '" fill="' + INK + '"/><circle cx="' + f(cx + e) + '" cy="' + f(cy - 2) + '" r="' + f(r * .1) + '" fill="' + INK + '"/>';
    if (o.glasses)
        s += '<g fill="none" stroke="' + INK + '" stroke-width="2.5"><circle cx="' + f(cx - e) + '" cy="' + f(cy - 2) + '" r="' + f(r * .24) + '"/><circle cx="' + f(cx + e) + '" cy="' + f(cy - 2) + '" r="' + f(r * .24) + '"/></g>';
    s += '<circle cx="' + f(cx - r * .55) + '" cy="' + f(cy + r * .3) + '" r="' + f(r * .15) + '" fill="' + CHEEK + '" opacity="' + (mood === 'angry' ? '.95' : '.55') + '"/><circle cx="' + f(cx + r * .55) + '" cy="' + f(cy + r * .3) + '" r="' + f(r * .15) + '" fill="' + CHEEK + '" opacity="' + (mood === 'angry' ? '.95' : '.55') + '"/>';
    if (o.freckles)
        [[-.5, .12], [-.38, .22], [.5, .12], [.38, .22]].forEach(d => { s += '<circle cx="' + f(cx + r * d[0]) + '" cy="' + f(cy + r * d[1]) + '" r="1.6" fill="#B5714A"/>'; });
    if (mood === 'angry')
        s += '<path d="M' + f(cx - e - r * .25) + ' ' + f(cy - r * .42) + ' L' + f(cx - e + r * .2) + ' ' + f(cy - r * .3) + ' M' + f(cx + e + r * .25) + ' ' + f(cy - r * .42) + ' L' + f(cx + e - r * .2) + ' ' + f(cy - r * .3) + '" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M' + f(cx - r * .3) + ' ' + f(cy + r * .48) + ' q' + f(r * .3) + ' -' + f(r * .22) + ' ' + f(r * .6) + ' 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    else if (mood === 'calm')
        s += '<path d="M' + f(cx - r * .28) + ' ' + f(cy + r * .34) + ' q' + f(r * .28) + ' ' + f(r * .2) + ' ' + f(r * .56) + ' 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    else if (mood === 'sad')
        s += '<path d="M' + f(cx - r * .28) + ' ' + f(cy + r * .5) + ' q' + f(r * .28) + ' -' + f(r * .22) + ' ' + f(r * .56) + ' 0" stroke="' + INK + '" stroke-width="3" fill="none" stroke-linecap="round"/>';
    else if (mood === 'oh')
        s += '<ellipse cx="' + cx + '" cy="' + f(cy + r * .42) + '" rx="' + f(r * .14) + '" ry="' + f(r * .19) + '" fill="' + INK + '"/>';
    else
        s += '<path d="M' + f(cx - r * .35) + ' ' + f(cy + r * .3) + ' q' + f(r * .35) + ' ' + f(r * .45) + ' ' + f(r * .7) + ' 0 z" fill="' + INK + '"/>';
    if (o.phones)
        s += '<path d="M' + f(cx - r - 4) + ' ' + cy + ' C' + f(cx - r - 4) + ' ' + f(cy - r * 1.55) + ' ' + f(cx + r + 4) + ' ' + f(cy - r * 1.55) + ' ' + f(cx + r + 4) + ' ' + cy + '" stroke="#5468D8" stroke-width="6" fill="none"/><rect x="' + f(cx - r - 11) + '" y="' + f(cy - r * .35) + '" width="14" height="' + f(r * .75) + '" rx="6" fill="#5468D8"/><rect x="' + f(cx + r - 3) + '" y="' + f(cy - r * .35) + '" width="14" height="' + f(r * .75) + '" rx="6" fill="#5468D8"/>';
    return s;
}
/* un bambino con i piedi in (x,y); pose: down, run, up, wave, fists, slide */
function kid(name, x, y, sc, { pose = 'down', mood = 'happy', hands = null } = {}) {
    const o = CAST[name], c = SK[o.skin], S = (v) => v * sc;
    let s = '';
    if (pose === 'slide') { // seduto, gambe in avanti, braccia in alto
        s += '<rect x="' + f(x - S(8)) + '" y="' + f(y - S(26)) + '" width="' + f(S(56)) + '" height="' + f(S(16)) + '" rx="' + f(S(8)) + '" fill="' + o.pants + '"/>';
        s += '<rect x="' + f(x - S(26)) + '" y="' + f(y - S(92)) + '" width="' + f(S(52)) + '" height="' + f(S(68)) + '" rx="' + f(S(18)) + '" fill="' + o.shirt + '"/>';
        (hands ? [[-22, -80, hands[0][0], hands[0][1]], [22, -80, hands[1][0], hands[1][1]]] : [[-22, -80, -44, -146], [22, -80, 44, -146]]).forEach(a => { s += '<line x1="' + f(x + S(a[0])) + '" y1="' + f(y + S(a[1])) + '" x2="' + f(x + S(a[2])) + '" y2="' + f(y + S(a[3])) + '" stroke="' + o.shirt + '" stroke-width="' + f(S(13)) + '" stroke-linecap="round"/><circle cx="' + f(x + S(a[2])) + '" cy="' + f(y + S(a[3])) + '" r="' + f(S(8)) + '" fill="' + c + '"/>'; });
        return s + head(o, x, y - S(120), S(30), mood);
    }
    if (o.skirt)
        s += '<rect x="' + f(x - S(15)) + '" y="' + f(y - S(40)) + '" width="' + f(S(10)) + '" height="' + f(S(38)) + '" rx="' + f(S(5)) + '" fill="' + c + '"/><rect x="' + f(x + S(5)) + '" y="' + f(y - S(40)) + '" width="' + f(S(10)) + '" height="' + f(S(38)) + '" rx="' + f(S(5)) + '" fill="' + c + '"/><path d="M' + f(x - S(30)) + ' ' + f(y - S(38)) + ' L' + f(x - S(22)) + ' ' + f(y - S(80)) + ' L' + f(x + S(22)) + ' ' + f(y - S(80)) + ' L' + f(x + S(30)) + ' ' + f(y - S(38)) + 'Z" fill="' + o.pants + '"/>';
    else if (pose === 'run')
        s += '<line x1="' + f(x - S(8)) + '" y1="' + f(y - S(56)) + '" x2="' + f(x - S(30)) + '" y2="' + f(y - S(4)) + '" stroke="' + o.pants + '" stroke-width="' + f(S(14)) + '" stroke-linecap="round"/><line x1="' + f(x + S(8)) + '" y1="' + f(y - S(56)) + '" x2="' + f(x + S(26)) + '" y2="' + f(y - S(10)) + '" stroke="' + o.pants + '" stroke-width="' + f(S(14)) + '" stroke-linecap="round"/>';
    else
        s += '<rect x="' + f(x - S(17)) + '" y="' + f(y - S(62)) + '" width="' + f(S(14)) + '" height="' + f(S(60)) + '" rx="' + f(S(7)) + '" fill="' + o.pants + '"/><rect x="' + f(x + S(3)) + '" y="' + f(y - S(62)) + '" width="' + f(S(14)) + '" height="' + f(S(60)) + '" rx="' + f(S(7)) + '" fill="' + o.pants + '"/>';
    s += '<rect x="' + f(x - S(26)) + '" y="' + f(y - S(122)) + '" width="' + f(S(52)) + '" height="' + f(S(68)) + '" rx="' + f(S(18)) + '" fill="' + o.shirt + '"/>';
    const P = hands || { down: [[-34, -62], [34, -62]], run: [[-40, -80], [36, -140]], up: [[-44, -178], [44, -178]], wave: [[-34, -62], [48, -170]], fists: [[-30, -96], [30, -96]] }[pose];
    [[-22, P[0]], [22, P[1]]].forEach(([sx, [ex, ey]]) => { s += '<line x1="' + f(x + S(sx)) + '" y1="' + f(y - S(110)) + '" x2="' + f(x + S(ex)) + '" y2="' + f(y + S(ey)) + '" stroke="' + o.shirt + '" stroke-width="' + f(S(13)) + '" stroke-linecap="round"/><circle cx="' + f(x + S(ex)) + '" cy="' + f(y + S(ey)) + '" r="' + f(S(8)) + '" fill="' + c + '"/>'; });
    return s + head(o, x, y - S(150), S(30), mood);
}
/* il parco: prato, cielo, albero e lo scivolo con la scala */
const sky = '<rect width="400" height="300" fill="#D0EBFF"/><rect y="236" width="400" height="64" fill="#8CE99A"/>';
const tree = (x) => '<rect x="' + (x - 8) + '" y="150" width="16" height="90" fill="#8B5A2B"/><circle cx="' + x + '" cy="132" r="40" fill="#40C057"/>';
const slide = (x) => '<rect x="' + x + '" y="100" width="10" height="140" fill="#E03131"/><rect x="' + (x + 44) + '" y="100" width="10" height="140" fill="#E03131"/>' + [0, 1, 2, 3, 4].map((k) => '<rect x="' + x + '" y="' + (116 + k * 24) + '" width="54" height="6" fill="#E03131"/>').join('') + '<rect x="' + (x - 4) + '" y="94" width="62" height="12" rx="4" fill="#FCC419"/><path d="M' + (x + 54) + ' 100 Q' + (x + 110) + ' 120 ' + (x + 150) + ' 236 L' + (x + 168) + ' 236 Q' + (x + 126) + ' 112 ' + (x + 54) + ' 88 Z" fill="#1C7ED6"/>';
/* ── Le vignette: disegno, racconto (didascalia) e nuvolette (parla / pensa) ── */
const P = [sky + tree(60) + slide(190) + kid('zoe', 110, 240, .85, { pose: 'run' }) + '<path d="M40 190 h22 M34 204 h22" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
    sky + slide(170) + kid('nico', 215, 246, .62) + kid('amina', 150, 246, .62) + kid('zoe', 70, 246, .62, { mood: 'calm' }),
    '<rect width="400" height="300" fill="#FFE3E3"/>' + [[40, 40], [340, 50], [50, 150], [350, 140]].map(([a, b]) => '<path d="M' + a + ' ' + b + ' l14 -14 M' + (a + 6) + ' ' + (b + 10) + ' l18 -6" stroke="#E03131" stroke-width="5" stroke-linecap="round"/>').join('') + kid('zoe', 200, 330, 1.5, { pose: 'fists', mood: 'angry' }),
    sky + tree(340) + kid('zoe', 110, 246, .72, { mood: 'calm' }) + kid('lila', 230, 246, .72, { pose: 'wave' }),
    sky + slide(210) + kid('zoe', 70, 246, .66) + kid('lila', 140, 246, .66) + ['1', '2', '3', '4', '5'].map((n, k) => '<text x="' + (250 + k * 28) + '" y="' + (110 + (k % 2) * 16) + '" font-size="30" font-weight="900" fill="' + ['#E03131', '#F08C00', '#2F9E44', '#1C7ED6', '#7048E8'][k] + '" font-family="system-ui">' + n + '</text>').join('') + kid('amina', 338, 232, .5, { pose: 'slide' }),
    sky + tree(46) + slide(110) + kid('zoe', 262, 234, .62, { pose: 'slide' }) + kid('lila', 340, 246, .66, { pose: 'up' })];
/* ── Per "Meky e la tazza rotta": il salotto, Tedo, la tazza, la nuvoletta, il sole ── */
const room = '<rect width="400" height="300" fill="#E7ECFB"/><rect y="196" width="400" height="104" fill="#D3DAF5"/><rect x="24" y="22" width="88" height="84" rx="6" fill="#B9C6F5"/><path d="M68 22 V106 M24 64 H112" stroke="#C9B49A" stroke-width="5"/><rect x="24" y="22" width="88" height="84" rx="6" fill="none" stroke="#C9B49A" stroke-width="6"/><rect x="284" y="84" width="104" height="7" rx="3" fill="#B08968"/>';
const table = '<rect x="196" y="150" width="104" height="8" rx="3" fill="#B08968"/><rect x="204" y="156" width="6" height="40" fill="#9C7656"/><rect x="286" y="156" width="6" height="40" fill="#9C7656"/>';
function cup(x, y, sc) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><path d="M-46 -96 H46 V-24 Q46 0 22 0 H-22 Q-46 0 -46 -24 Z" fill="#F783AC"/><path d="M46 -78 Q76 -78 76 -54 Q76 -30 46 -30" stroke="#F783AC" stroke-width="12" fill="none"/><path d="M0 -42 C-14 -54 -20 -66 -10 -72 C-4 -76 0 -70 0 -66 C0 -70 4 -76 10 -72 C20 -66 14 -54 0 -42 Z" fill="#FFFFFF" opacity=".85"/></g>'; }
function shards(x, y, sc) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><path d="M-80 0 L-50 -26 L-40 0 Z" fill="#F783AC"/><path d="M-20 0 L10 -34 L34 -6 L20 0 Z" fill="#F783AC"/><path d="M50 0 L64 -30 L90 -12 L84 0 Z" fill="#F783AC"/></g>'; }
function frog(x, y, size, happy) { const k = size / 200; return '<g transform="translate(' + (x - size / 2) + ' ' + (y - size) + ') scale(' + k + ')"><ellipse cx="62" cy="186" rx="26" ry="10" fill="#3E9C5B"/><ellipse cx="138" cy="186" rx="26" ry="10" fill="#3E9C5B"/><ellipse cx="100" cy="140" rx="58" ry="50" fill="#5CC27A"/><ellipse cx="100" cy="150" rx="36" ry="32" fill="#C9EFC4"/><ellipse cx="100" cy="84" rx="62" ry="44" fill="#5CC27A"/><circle cx="70" cy="50" r="24" fill="#5CC27A"/><circle cx="130" cy="50" r="24" fill="#5CC27A"/><circle cx="70" cy="50" r="17" fill="#fff"/><circle cx="130" cy="50" r="17" fill="#fff"/><circle cx="74" cy="53" r="8" fill="#1F2147"/><circle cx="126" cy="53" r="8" fill="#1F2147"/><circle cx="56" cy="96" r="9" fill="#F59AA0" opacity=".6"/><circle cx="144" cy="96" r="9" fill="#F59AA0" opacity=".6"/>' + (happy ? '<path d="M70 94 Q100 124 130 94 Z" fill="#1F2147"/>' : '<path d="M76 108 Q100 92 124 108" stroke="#1F2147" stroke-width="5" fill="none" stroke-linecap="round"/>') + '</g>'; }
function cloud(x, y, sc) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><path d="M-90 30 Q-120 30 -120 0 Q-120 -34 -84 -34 Q-74 -76 -26 -72 Q4 -104 46 -80 Q96 -86 100 -40 Q130 -32 124 0 Q118 30 88 30 Z" fill="#9AA2C4"/><path d="M-40 54 q-10 16 0 22 q10 -6 0 -22 z M30 64 q-10 16 0 22 q10 -6 0 -22 z" fill="#74C0FC"/></g>'; }
function sun(x, y) { let r = ''; for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    r += '<line x1="' + (x + Math.cos(a) * 26).toFixed(1) + '" y1="' + (y + Math.sin(a) * 26).toFixed(1) + '" x2="' + (x + Math.cos(a) * 38).toFixed(1) + '" y2="' + (y + Math.sin(a) * 38).toFixed(1) + '" stroke="#FCC419" stroke-width="5" stroke-linecap="round"/>';
} return r + '<circle cx="' + x + '" cy="' + y + '" r="20" fill="#FFD43B"/>'; }
const ball = (x, y) => '<circle cx="' + x + '" cy="' + y + '" r="13" fill="#E03131"/><path d="M' + (x - 13) + ' ' + y + ' h26" stroke="#fff" stroke-width="4"/>';
// i personaggi stanno in alto (piedi a y 210): sotto c'è il riquadro del racconto
const MK = [
    room + table + cup(248, 150, .42) + ball(214, 70) + '<path d="M182 88 q14 -22 30 -18 M174 102 q10 -10 22 -10" stroke="#9AA2C4" stroke-width="4" fill="none" stroke-linecap="round"/>' + kid('meky', 110, 210, .6, { pose: 'wave' }),
    room + table + shards(250, 206, .5) + ball(160, 200) + '<path d="M232 176 l-10 -12 M262 170 l0 -14 M288 176 l10 -12" stroke="#E64980" stroke-width="5" stroke-linecap="round"/>' + kid('meky', 100, 210, .6, { mood: 'oh' }),
    room + frog(336, 84, 46, true) + shards(250, 206, .5) + kid('meky', 100, 210, .6, { mood: 'oh' }) + kid('mamma', 300, 212, .74),
    room + frog(336, 84, 46, false) + shards(250, 206, .5) + kid('meky', 100, 210, .6, { mood: 'happy', pose: 'wave' }) + kid('mamma', 300, 212, .74, { mood: 'calm' }),
    room + frog(336, 84, 46, false) + cloud(190, 74, .36) + kid('meky', 190, 210, .6, { mood: 'sad' }),
    room + cloud(130, 74, .36) + kid('meky', 130, 210, .6, { mood: 'sad' }) + frog(300, 210, 70, true),
    room + cloud(250, 96, .3) + kid('mamma', 110, 212, .74, { mood: 'calm' }) + kid('meky', 250, 214, .56, { mood: 'oh' }) + frog(340, 210, 56, true),
    room + sun(340, 48) + kid('mamma', 120, 220, .68, { mood: 'happy' }) + kid('meky', 220, 210, .6, { mood: 'happy', pose: 'up' }) + frog(320, 210, 56, true),
];
/* ── Per le tre storie nuove: il tavolino con i pennarelli, il gioco dell'oca, la classe, i cuori ── */
const picnic = '<rect x="150" y="196" width="150" height="9" rx="3" fill="#B08968"/><rect x="160" y="203" width="7" height="38" fill="#9C7656"/><rect x="283" y="203" width="7" height="38" fill="#9C7656"/><rect x="190" y="188" width="44" height="9" rx="2" fill="#FFFFFF"/>';
function markers(x, y) { return '<rect x="' + x + '" y="' + (y - 12) + '" width="40" height="13" rx="3" fill="#5468D8"/>' + ['#E03131', '#F08C00', '#FCC419', '#2F9E44', '#1C7ED6', '#9775FA'].map((c, i) => '<rect x="' + (x + 3 + i * 6) + '" y="' + (y - 24) + '" width="5" height="15" rx="2" fill="' + c + '"/>').join(''); }
function hearts(x, y) { return [0, 1, 2].map(i => '<path transform="translate(' + (x + i * 34) + ' ' + (y - (i % 2) * 14) + ') scale(.55)" d="M0 -10 C-10 -26 -34 -16 -26 4 L0 30 L26 4 C34 -16 10 -26 0 -10 Z" fill="#F06595"/>').join(''); }
const home = '<rect width="400" height="300" fill="#FFF4E6"/><rect y="200" width="400" height="100" fill="#F3D9B1"/><rect x="290" y="30" width="80" height="70" rx="6" fill="#D0EBFF" stroke="#C9B49A" stroke-width="6"/>';
function goose(x, y, step) {
    const cells = ['#FFD43B', '#74C0FC', '#8CE99A', '#FFA8A8', '#B197FC', '#FFD43B', '#74C0FC', '#8CE99A'];
    let s = '<rect x="' + (x - 90) + '" y="' + y + '" width="180" height="9" rx="3" fill="#B08968"/><rect x="' + (x - 80) + '" y="' + (y + 7) + '" width="7" height="' + (240 - y) + '" fill="#9C7656"/><rect x="' + (x + 73) + '" y="' + (y + 7) + '" width="7" height="' + (240 - y) + '" fill="#9C7656"/>';
    s += '<path d="M' + (x - 80) + ' ' + y + ' L' + (x - 60) + ' ' + (y - 22) + ' H' + (x + 60) + ' L' + (x + 80) + ' ' + y + ' Z" fill="#FFFFFF" stroke="#C9B49A" stroke-width="2"/>';
    cells.forEach((c, i) => { s += '<rect x="' + (x - 62 + i * 15.5) + '" y="' + (y - 16) + '" width="13" height="11" rx="2" fill="' + c + '"/>'; });
    s += '<circle cx="' + (x - 56 + step * 15.5) + '" cy="' + (y - 20) + '" r="5" fill="#2F9E44" stroke="#2B2D52" stroke-width="1.5"/><circle cx="' + (x - 56 + Math.max(0, step - 3) * 15.5) + '" cy="' + (y - 24) + '" r="5" fill="#1C7ED6" stroke="#2B2D52" stroke-width="1.5"/>';
    return s + '<rect x="' + (x + 40) + '" y="' + (y - 40) + '" width="16" height="16" rx="3" fill="#FFFFFF" stroke="#2B2D52" stroke-width="2"/><circle cx="' + (x + 45) + '" cy="' + (y - 35) + '" r="1.8" fill="#2B2D52"/><circle cx="' + (x + 51) + '" cy="' + (y - 29) + '" r="1.8" fill="#2B2D52"/>';
}
const angry = '<rect width="400" height="300" fill="#FFE3E3"/>' + [[40, 40], [340, 50], [50, 150], [350, 140]].map(([a, b]) => '<path d="M' + a + ' ' + b + ' l14 -14 M' + (a + 6) + ' ' + (b + 10) + ' l18 -6" stroke="#E03131" stroke-width="5" stroke-linecap="round"/>').join('');
const classroom = '<rect width="400" height="300" fill="#EDF2FF"/><rect y="206" width="400" height="94" fill="#DBE4FF"/><rect x="40" y="30" width="200" height="96" rx="6" fill="#2F6B4F" stroke="#B08968" stroke-width="7"/><path d="M60 58 h70 M60 80 h110 M60 102 h50" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".8"/><rect x="296" y="40" width="70" height="56" rx="4" fill="#FFF3BF" stroke="#C9B49A" stroke-width="4"/>';
const desk = (x) => '<rect x="' + (x - 34) + '" y="214" width="68" height="8" rx="3" fill="#B08968"/><rect x="' + (x - 28) + '" y="220" width="5" height="22" fill="#9C7656"/><rect x="' + (x + 23) + '" y="220" width="5" height="22" fill="#9C7656"/>';
const book = (x, y) => '<path d="M' + (x - 22) + ' ' + y + ' L' + x + ' ' + (y + 5) + ' L' + (x + 22) + ' ' + y + ' L' + (x + 22) + ' ' + (y - 26) + ' L' + x + ' ' + (y - 21) + ' L' + (x - 22) + ' ' + (y - 26) + ' Z" fill="#FFFFFF" stroke="#E64980" stroke-width="3"/><path d="M' + x + ' ' + (y + 5) + ' V' + (y - 21) + '" stroke="#E64980" stroke-width="2"/>';
const blush = (x, y) => '<ellipse cx="' + (x - 15) + '" cy="' + y + '" rx="8" ry="5" fill="#FA5252" opacity=".55"/><ellipse cx="' + (x + 15) + '" cy="' + y + '" rx="8" ry="5" fill="#FA5252" opacity=".55"/>';
const LI = [
    sky + tree(50) + picnic + markers(244, 196) + kid('lila', 120, 240, .66),
    sky + tree(50) + picnic + markers(244, 196) + kid('lila', 120, 240, .66, { mood: 'oh' }) + kid('elio', 330, 240, .66, { pose: 'run' }),
    sky + tree(50) + picnic + markers(244, 196) + kid('lila', 120, 240, .66, { mood: 'sad' }) + kid('elio', 330, 240, .66, { pose: 'wave', mood: 'happy' }),
    sky + picnic + markers(244, 196) + kid('lila', 110, 240, .66, { mood: 'oh' }) + frog(225, 190, 58, true) + kid('elio', 340, 240, .66, { mood: 'calm' }),
    sky + tree(50) + picnic + markers(244, 196) + kid('lila', 120, 240, .66, { pose: 'wave', mood: 'calm' }) + kid('elio', 330, 240, .66, { mood: 'oh' }),
    sky + tree(50) + picnic + markers(216, 196) + kid('lila', 140, 240, .66, { mood: 'happy' }) + kid('elio', 300, 240, .66, { mood: 'happy' }) + hearts(185, 120),
];
const EL = [
    home + goose(200, 170, 3) + kid('elio', 90, 232, .62, { pose: 'up', mood: 'happy' }) + kid('amina', 310, 232, .62, { mood: 'calm' }),
    home + goose(200, 170, 7) + kid('elio', 90, 232, .62, { mood: 'oh' }) + kid('amina', 310, 232, .62, { pose: 'up', mood: 'happy' }),
    angry + kid('elio', 200, 330, 1.5, { pose: 'fists', mood: 'angry' }),
    home + goose(200, 170, 7) + kid('elio', 90, 232, .62, { mood: 'sad' }) + frog(200, 128, 52, true) + kid('amina', 310, 232, .62, { mood: 'calm' }),
    home + goose(200, 170, 7) + kid('elio', 90, 232, .62, { pose: 'wave', mood: 'calm' }) + kid('amina', 310, 232, .62, { mood: 'happy' }),
    home + goose(200, 170, 0) + kid('elio', 90, 232, .62, { mood: 'happy' }) + kid('amina', 310, 232, .62, { pose: 'wave', mood: 'happy' }) + hearts(170, 90),
];
const AM = [
    classroom + desk(310) + kid('maestra', 90, 236, .74, { mood: 'calm' }) + kid('amina', 230, 236, .66, { pose: 'fists', mood: 'calm' }) + book(230, 150) + kid('nico', 330, 236, .5),
    classroom + desk(310) + kid('amina', 200, 236, .7, { pose: 'fists', mood: 'oh' }) + book(200, 148) + kid('nico', 330, 236, .5, { mood: 'oh' }),
    '<rect width="400" height="300" fill="#FFF0F6"/>' + kid('amina', 200, 330, 1.45, { pose: 'fists', mood: 'sad' }) + blush(200, 138),
    classroom + desk(310) + kid('amina', 150, 236, .66, { pose: 'fists', mood: 'oh' }) + book(150, 150) + frog(300, 210, 62, true),
    classroom + desk(310) + kid('maestra', 90, 236, .74, { mood: 'happy' }) + kid('amina', 230, 236, .66, { pose: 'fists', mood: 'calm' }) + book(230, 150) + '<path d="M222 148 l10 6" stroke="#B97D4E" stroke-width="5" stroke-linecap="round"/>',
    classroom + desk(310) + kid('maestra', 90, 236, .74, { mood: 'happy' }) + kid('amina', 220, 236, .66, { pose: 'up', mood: 'happy' }) + kid('nico', 330, 236, .5, { pose: 'wave', mood: 'happy' }),
];
var COMICS = [{
        id: 'zoe-turno', icon: '🛝', title: { it: 'Zoe e il turno allo scivolo', fr: 'Zoe et son tour au toboggan' },
        panels: [
            { svg: P[0], cap: { it: 'Al parco, Zoe vede lo scivolo e corre a giocare.', fr: 'Au parc, Zoe voit le toboggan et court jouer.' }, bubbles: [] },
            { svg: P[1], cap: { it: "Davanti allo scivolo c'è la fila.", fr: 'Devant le toboggan, il y a la queue.' },
                bubbles: [{ who: 'zoe', kind: 'think', text: { it: 'Voglio andare SUBITO!', fr: 'Je veux y aller TOUT DE SUITE\u00a0!' }, x: 3, y: 5, tail: 'tl' }] },
            { svg: P[2], cap: { it: 'Zoe si sente arrabbiata. Aspettare è difficile!', fr: 'Zoe est en colère. Attendre, c’est difficile\u00a0!' }, bubbles: [] },
            { svg: P[3], cap: { it: 'Arriva la sua amica Lila.', fr: 'Son amie Lila arrive.' },
                bubbles: [{ who: 'lila', kind: 'say', text: { it: 'Contiamo insieme fino a 5?', fr: 'On compte ensemble jusqu’à 5\u00a0?' }, x: 42, y: 4, tail: 'tl' }] },
            { svg: P[4], cap: { it: 'Zoe e Lila contano. Intanto Amina scende.', fr: 'Zoe et Lila comptent. Pendant ce temps, Amina descend.' },
                bubbles: [{ who: 'zoe', kind: 'say', text: { it: 'Uno, due, tre, quattro, cinque!', fr: 'Un, deux, trois, quatre, cinq\u00a0!' }, x: 3, y: 4, tail: 'tl', small: true }] },
            { svg: P[5], cap: { it: 'Il turno arriva sempre!', fr: 'Le tour arrive toujours\u00a0!' },
                bubbles: [{ who: 'zoe', kind: 'say', text: { it: 'Wiii! È il mio turno!', fr: 'Youpi\u00a0! C’est mon tour\u00a0!' }, x: 4, y: 4, tail: 'tr', big: true }] },
        ],
    }, {
        id: 'meky-tazza', icon: '☕', title: { it: 'Meky e la tazza rotta', fr: 'Meky et la tasse cassée' },
        panels: [
            { svg: MK[0], cap: { it: 'Meky gioca a palla in salotto, anche se non si potrebbe.', fr: 'Meky joue au ballon dans le salon, même si ce n’est pas permis.' }, bubbles: [] },
            { svg: MK[1], cap: { it: 'Crac! La tazza preferita della mamma si rompe.', fr: 'Crac\u00a0! La tasse préférée de maman se casse.' }, bubbles: [] },
            { svg: MK[2], cap: { it: 'Arriva la mamma.', fr: 'Maman arrive.' },
                bubbles: [{ who: 'mamma', kind: 'say', text: { it: 'Cosa è successo?', fr: 'Qu’est-ce qui s’est passé\u00a0?' }, x: 36, y: 4, tail: 'tr' }] },
            { svg: MK[3], cap: { it: 'Meky dice una bugia.', fr: 'Meky dit un mensonge.' },
                bubbles: [{ who: 'meky', kind: 'say', text: { it: 'Non sono stato io! È stato Tedo!', fr: 'C’est pas moi\u00a0! C’est Tedo\u00a0!' }, x: 3, y: 4, tail: 'tl' }] },
            { svg: MK[4], cap: { it: 'Una nuvoletta grigia lo segue dappertutto.', fr: 'Un petit nuage gris le suit partout.' },
                bubbles: [{ who: 'meky', kind: 'think', text: { it: 'Mi sento pesante…', fr: 'Je me sens lourd…' }, x: 54, y: 4, tail: 'tl' }] },
            { svg: MK[5], cap: { it: 'Tedo gli dà coraggio.', fr: 'Tedo lui donne du courage.' },
                bubbles: [{ who: 'tedo', kind: 'say', text: { it: 'Dire la verità fa un po’ paura, ma è da coraggiosi!', fr: 'Dire la vérité fait un peu peur, mais c’est courageux\u00a0!' }, x: 40, y: 3, tail: 'tr', small: true }] },
            { svg: MK[6], cap: { it: 'Meky dice la verità.', fr: 'Meky dit la vérité.' },
                bubbles: [{ who: 'meky', kind: 'say', text: { it: 'Mamma, sono stato io. Avevo paura.', fr: 'Maman, c’est moi. J’avais peur.' }, x: 42, y: 2, tail: 'tl', small: true }] },
            { svg: MK[7], cap: { it: 'La verità è più leggera!', fr: 'La vérité, c’est plus léger\u00a0!' },
                bubbles: [{ who: 'mamma', kind: 'say', text: { it: 'Grazie per avermi detto la verità.', fr: 'Merci de m’avoir dit la vérité.' }, x: 3, y: 2, tail: 'tl', small: true }] },
        ],
    }, {
        id: 'lila-no', icon: '🖍️', title: { it: 'Lila impara a dire di no', fr: 'Lila apprend à dire non' },
        panels: [
            { svg: LI[0], cap: { it: 'Al parco, Lila disegna con i suoi pennarelli nuovi.', fr: 'Au parc, Lila dessine avec ses nouveaux feutres.' }, bubbles: [] },
            { svg: LI[1], cap: { it: 'Arriva Elio di corsa.', fr: 'Elio arrive en courant.' },
                bubbles: [{ who: 'elio', kind: 'say', text: { it: 'Dammi i tuoi pennarelli! Li voglio tutti!', fr: 'Donne-moi tes feutres\u00a0! Je les veux tous\u00a0!' }, x: 40, y: 4, tail: 'tr' }] },
            { svg: LI[2], cap: { it: 'Lila non sa cosa fare.', fr: 'Lila ne sait pas quoi faire.' },
                bubbles: [{ who: 'lila', kind: 'think', text: { it: 'Non voglio… ma se dico di no, si arrabbia?', fr: 'Je ne veux pas… mais si je dis non, il va se fâcher\u00a0?' }, x: 3, y: 4, tail: 'tl', small: true }] },
            { svg: LI[3], cap: { it: 'Tedo le dà un consiglio: un bel respiro, voce calma e una proposta.', fr: 'Tedo lui donne un conseil\u00a0: une grande respiration, une voix calme et une proposition.' },
                bubbles: [{ who: 'tedo', kind: 'say', text: { it: 'Puoi dire di no, con gentilezza!', fr: 'Tu peux dire non, avec gentillesse\u00a0!' }, x: 30, y: 3, tail: 'tl' }] },
            { svg: LI[4], cap: { it: 'Lila fa un bel respiro e parla con voce calma.', fr: 'Lila respire profondément et parle d’une voix calme.' },
                bubbles: [{ who: 'lila', kind: 'say', text: { it: 'No, grazie. Li sto usando io. Se vuoi, disegniamo insieme!', fr: 'Non, merci. Je les utilise. Si tu veux, on dessine ensemble\u00a0!' }, x: 3, y: 3, tail: 'tl', small: true }] },
            { svg: LI[5], cap: { it: 'Dire di no con gentilezza si può!', fr: 'On peut dire non avec gentillesse\u00a0!' },
                bubbles: [{ who: 'elio', kind: 'say', text: { it: 'Va bene! Io prendo il blu!', fr: 'D’accord\u00a0! Moi, je prends le bleu\u00a0!' }, x: 44, y: 3, tail: 'tr' }] },
        ],
    }, {
        id: 'elio-perde', icon: '🎲', title: { it: 'Elio perde al gioco', fr: 'Elio perd au jeu' },
        panels: [
            { svg: EL[0], cap: { it: 'Elio e Amina giocano al gioco dell’oca.', fr: 'Elio et Amina jouent au jeu de l’oie.' },
                bubbles: [{ who: 'elio', kind: 'say', text: { it: 'Vinco io, vinco io!', fr: 'Je vais gagner\u00a0!' }, x: 3, y: 4, tail: 'tl' }] },
            { svg: EL[1], cap: { it: 'Ma Amina arriva per prima.', fr: 'Mais Amina arrive la première.' },
                bubbles: [{ who: 'amina', kind: 'say', text: { it: 'Arrivata! Ho vinto!', fr: 'Arrivée\u00a0! J’ai gagné\u00a0!' }, x: 50, y: 4, tail: 'tr' }] },
            { svg: EL[2], cap: { it: 'Elio si arrabbia tanto. Perdere è difficile!', fr: 'Elio est très en colère. Perdre, c’est difficile\u00a0!' },
                bubbles: [{ who: 'elio', kind: 'think', text: { it: 'Non è giusto! Volevo vincere io!', fr: 'C’est pas juste\u00a0! Je voulais gagner\u00a0!' }, x: 3, y: 4, tail: 'tl' }] },
            { svg: EL[3], cap: { it: 'Tedo gli insegna un trucco.', fr: 'Tedo lui apprend une astuce.' },
                bubbles: [{ who: 'tedo', kind: 'say', text: { it: 'Quando perdi, respira e conta fino a 5.', fr: 'Quand tu perds, respire et compte jusqu’à 5.' }, x: 28, y: 2, tail: 'tl', small: true }] },
            { svg: EL[4], cap: { it: 'Elio respira, conta… e dice una cosa gentile.', fr: 'Elio respire, compte… et dit une chose gentille.' },
                bubbles: [{ who: 'elio', kind: 'say', text: { it: 'Brava Amina! Facciamo un’altra partita?', fr: 'Bravo Amina\u00a0! On refait une partie\u00a0?' }, x: 3, y: 4, tail: 'tl', small: true }] },
            { svg: EL[5], cap: { it: 'Vincere è bello, ma giocare insieme lo è di più!', fr: 'Gagner, c’est bien, mais jouer ensemble, c’est encore mieux\u00a0!' },
                bubbles: [{ who: 'amina', kind: 'say', text: { it: 'Sì! Si gioca per divertirsi!', fr: 'Oui\u00a0! On joue pour s’amuser\u00a0!' }, x: 46, y: 4, tail: 'tr' }] },
        ],
    }, {
        id: 'amina-legge', icon: '📖', title: { it: 'Amina sbaglia leggendo ad alta voce', fr: 'Amina se trompe en lisant à voix haute' },
        panels: [
            { svg: AM[0], cap: { it: 'A scuola, la maestra chiede ad Amina di leggere ad alta voce.', fr: 'À l’école, la maîtresse demande à Amina de lire à voix haute.' },
                bubbles: [{ who: 'maestra', kind: 'say', text: { it: 'Amina, leggi tu?', fr: 'Amina, tu lis\u00a0?' }, x: 3, y: 4, tail: 'tl' }] },
            { svg: AM[1], cap: { it: 'Amina legge, ma sbaglia una parola.', fr: 'Amina lit, mais elle se trompe de mot.' },
                bubbles: [{ who: 'amina', kind: 'say', text: { it: 'Il gatto… ehm… il gallo canta…', fr: 'Le chat… euh… le coq chante…' }, x: 3, y: 4, tail: 'tl', small: true }] },
            { svg: AM[2], cap: { it: 'Amina diventa rossa e vorrebbe smettere.', fr: 'Amina devient toute rouge et voudrait s’arrêter.' },
                bubbles: [{ who: 'amina', kind: 'think', text: { it: 'Che vergogna… tutti mi guardano!', fr: 'Quelle honte… tout le monde me regarde\u00a0!' }, x: 3, y: 4, tail: 'tl' }] },
            { svg: AM[3], cap: { it: 'Tedo le ricorda che tutti sbagliano.', fr: 'Tedo lui rappelle que tout le monde se trompe.' },
                bubbles: [{ who: 'tedo', kind: 'say', text: { it: 'Sbagliare è normale: si impara così!', fr: 'Se tromper, c’est normal\u00a0: c’est comme ça qu’on apprend\u00a0!' }, x: 40, y: 3, tail: 'tr', small: true }] },
            { svg: AM[4], cap: { it: 'La maestra la incoraggia, e Amina segue le parole con il dito.', fr: 'La maîtresse l’encourage, et Amina suit les mots avec son doigt.' },
                bubbles: [{ who: 'maestra', kind: 'say', text: { it: 'Riprova con calma, piano piano.', fr: 'Recommence calmement, doucement.' }, x: 3, y: 4, tail: 'tl', small: true }] },
            { svg: AM[5], cap: { it: 'Amina ci riprova… e ce la fa!', fr: 'Amina réessaie… et elle y arrive\u00a0!' },
                bubbles: [{ who: 'amina', kind: 'say', text: { it: 'Il gallo canta al mattino!', fr: 'Le coq chante le matin\u00a0!' }, x: 34, y: 3, tail: 'tl' },
                    { who: 'nico', kind: 'say', text: { it: 'Brava Amina!', fr: 'Bravo Amina\u00a0!' }, x: 62, y: 30, tail: 'tr', small: true }] },
        ],
    }];

/* ══ Le scene: il personaggio FA l'azione (mani, oggetti, movimento), non solo una testa con un oggetto vicino ══ */
Object.assign(CAST,{
  lucia:{skin:'light',hair:'#6B4226',style:'long',shirt:'#F06595',pants:'#7048E8',skirt:1},
  marco:{skin:'fair',hair:'#E8A400',style:'short',shirt:'#2F9E44',pants:'#364FC7'},
  luca:{skin:'medium',hair:'#3B2A1A',style:'short',shirt:'#F08C00',pants:'#364FC7'},
  papa:{skin:'fair',hair:'#5C3B1E',style:'short',shirt:'#1C7ED6',pants:'#343A40'},
  nonna:{skin:'light',hair:'#CED4DA',style:'bun',shirt:'#9C36B5',pants:'#5F3DC4',skirt:1,glasses:1},
  bimbo:{skin:'tan',hair:'#2B1B0E',style:'curly',shirt:'#E03131',pants:'#364FC7'},
});
const R=(x,y,w,h,c,rx)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||0)+'" fill="'+c+'"/>';
const C=(x,y,r,c)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'"/>';
const L=(x1,y1,x2,y2,c,w)=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+c+'" stroke-width="'+(w||4)+'" stroke-linecap="round"/>';
const T=(x,y,e,s)=>'<text x="'+x+'" y="'+y+'" font-size="'+s+'" text-anchor="middle" dominant-baseline="central">'+e+'</text>';
/* gli ambienti */
const kitchen=(night)=>R(0,0,400,300,night?'#3B4A7A':'#FFF4E6')+R(0,206,400,94,'#E9D8C4')+[0,1,2,3,4,5,6,7].map(i=>R(i*50,206,48,92,i%2?'#E0CDB6':'#E9D8C4')).join('')+R(300,34,74,62,night?'#1F2147':'#D0EBFF',6)+(night?C(340,58,10,'#FFE066'):C(352,56,12,'#FFD43B'))+'<rect x="300" y="34" width="74" height="62" rx="6" fill="none" stroke="#C9B49A" stroke-width="6"/>';
const tableK=(x,w)=>R(x,176,w,10,'#B08968',3)+R(x+8,184,8,56,'#9C7656')+R(x+w-16,184,8,56,'#9C7656');
const park=()=>R(0,0,400,300,'#D0EBFF')+R(0,226,400,74,'#8CE99A')+C(60,40,16,'#FFD43B');
const garden=()=>park()+R(0,226,400,74,'#69DB7C');
const rm=(dark)=>R(0,0,400,300,dark?'#2C3460':'#E7ECFB')+R(0,206,400,94,dark?'#232A4F':'#D3DAF5');
const zzz=(x,y)=>'<text x="'+x+'" y="'+y+'" font-size="22" font-weight="900" fill="#5468D8" font-family="system-ui">Z</text><text x="'+(x+16)+'" y="'+(y-16)+'" font-size="16" font-weight="900" fill="#5468D8" font-family="system-ui">z</text>';
const notes=(x,y)=>T(x,y,'🎵',22)+T(x+26,y-20,'🎶',20);
const drops=(x0,x1,y0,y1,n)=>{ let s=''; for(let i=0;i<n;i++){ const x=x0+(i*53)%(x1-x0), y=y0+(i*37)%(y1-y0); s+='<path d="M'+x+' '+y+' q-5 10 0 14 q5 -4 0 -14 Z" fill="#4DABF7"/>'; } return s; };
/* gli oggetti, messi nella mano */
const plate=(x,y,food)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="34" ry="9" fill="#fff" stroke="#C9B49A" stroke-width="2"/>'+food;
const pasta=(x,y)=>[[-14,-6],[-4,-10],[6,-7],[14,-4],[0,-4]].map(([a,b])=>'<path d="M'+(x+a-8)+' '+(y+b)+' q8 -8 16 0" stroke="#F2C94C" stroke-width="5" fill="none" stroke-linecap="round"/>').join('')+C(x-6,y-12,4,'#E03131')+C(x+8,y-11,3.5,'#E03131');
const fork=(x,y)=>L(x,y,x+10,y+26,'#868E96',4)+'<path d="M'+(x-4)+' '+(y-8)+' v8 M'+x+' '+(y-9)+' v9 M'+(x+4)+' '+(y-8)+' v8" stroke="#868E96" stroke-width="3" stroke-linecap="round"/>';
const glass=(x,y,c)=>'<path d="M'+(x-10)+' '+(y-26)+' L'+(x+10)+' '+(y-26)+' L'+(x+8)+' '+y+' L'+(x-8)+' '+y+' Z" fill="'+c+'" stroke="#ADB5BD" stroke-width="2"/>';
const bookOpen=(x,y)=>'<path d="M'+(x-26)+' '+(y-24)+' Q'+(x-12)+' '+(y-30)+' '+x+' '+(y-24)+' Q'+(x+12)+' '+(y-30)+' '+(x+26)+' '+(y-24)+' V'+y+' Q'+(x+12)+' '+(y-6)+' '+x+' '+y+' Q'+(x-12)+' '+(y-6)+' '+(x-26)+' '+y+' Z" fill="#fff" stroke="#E64980" stroke-width="3"/>'+L(x,y-24,x,y,'#E64980',2);
const sofa=(x,y,c)=>R(x,y-40,150,30,c,10)+R(x-12,y-30,24,44,c,10)+R(x+138,y-30,24,44,c,10)+R(x,y-12,150,26,c,6)+R(x+6,y+14,10,10,'#5C3B1E')+R(x+134,y+14,10,10,'#5C3B1E');
const kennel=(x,y)=>'<path d="M'+(x-60)+' '+y+' V'+(y-60)+' L'+x+' '+(y-100)+' L'+(x+60)+' '+(y-60)+' V'+y+' Z" fill="#C0743A"/><path d="M'+(x-68)+' '+(y-58)+' L'+x+' '+(y-106)+' L'+(x+68)+' '+(y-58)+'" stroke="#8B4513" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M'+(x-34)+' '+y+' V'+(y-40)+' Q'+x+' '+(y-70)+' '+(x+34)+' '+(y-40)+' V'+y+' Z" fill="#5C3B1E"/>';
const car=(x,y)=>'<path d="M'+(x-90)+' '+(y-20)+' Q'+(x-90)+' '+(y-48)+' '+(x-60)+' '+(y-50)+' L'+(x-40)+' '+(y-86)+' Q'+(x-34)+' '+(y-94)+' '+(x-20)+' '+(y-94)+' L'+(x+40)+' '+(y-94)+' Q'+(x+54)+' '+(y-94)+' '+(x+60)+' '+(y-84)+' L'+(x+76)+' '+(y-50)+' Q'+(x+100)+' '+(y-48)+' '+(x+100)+' '+(y-20)+' Z" fill="#E03131"/>'+'<path d="M'+(x-30)+' '+(y-52)+' L'+(x-16)+' '+(y-84)+' L'+(x+38)+' '+(y-84)+' L'+(x+62)+' '+(y-52)+' Z" fill="#D0EBFF" opacity=".55"/>'+C(x-50,y-14,18,'#343A40')+C(x-50,y-14,8,'#ADB5BD')+C(x+62,y-14,18,'#343A40')+C(x+62,y-14,8,'#ADB5BD');
const flowers=(x,y)=>[0,1,2].map(i=>L(x+i*26,y,x+i*26,y-30,'#2F9E44',4)+C(x+i*26,y-34,9,['#F06595','#FFD43B','#9775FA'][i])+C(x+i*26,y-34,4,'#fff')).join('');
const can=(x,y)=>R(x-16,y-14,32,26,'#4DABF7',6)+L(x+14,y-8,x+34,y-22,'#4DABF7',6)+'<path d="M'+(x-10)+' '+(y-14)+' Q'+x+' '+(y-30)+' '+(x+10)+' '+(y-14)+'" stroke="#1C7ED6" stroke-width="4" fill="none"/>';
const stove=(x)=>R(x,150,110,90,'#ADB5BD',6)+R(x+8,140,94,14,'#495057',4)+'<path d="M'+(x+28)+' 140 v-34 h54 v34 Z" fill="#868E96"/>'+'<path d="M'+(x+40)+' 100 q-6 -12 0 -22 M'+(x+56)+' 98 q-6 -12 0 -24 M'+(x+72)+' 100 q-6 -12 0 -22" stroke="#ADB5BD" stroke-width="3" fill="none"/>';
const school=(x)=>'<path d="M'+(x-80)+' 236 V120 L'+x+' 70 L'+(x+80)+' 120 V236 Z" fill="#FFA94D"/>'+R(x-22,180,44,56,'#8B4513',4)+R(x-62,140,30,26,'#D0EBFF',3)+R(x+32,140,30,26,'#D0EBFF',3)+C(x,108,13,'#fff')+L(x,108,x,100,'#1F2147',2)+L(x,108,x+7,108,'#1F2147',2);
const bed=(x,y)=>R(x,y-40,180,40,'#8B5A2B',6)+R(x-6,y-80,16,84,'#8B5A2B',4)+R(x+170,y-60,16,64,'#8B5A2B',4)+R(x+10,y-56,40,18,'#fff',8);
const xtree=(x)=>'<path d="M'+x+' 60 L'+(x+70)+' 226 L'+(x-70)+' 226 Z" fill="#2F9E44"/>'+R(x-10,226,20,14,'#8B4513')+T(x,58,'⭐',26)+C(x-20,140,7,'#E03131')+C(x+24,170,7,'#FFD43B')+C(x-30,200,7,'#4DABF7')+C(x+10,110,6,'#F06595');
const beach=()=>R(0,0,400,300,'#D0EBFF')+'<path d="M0 170 Q100 160 200 170 T400 168 V300 H0 Z" fill="#4DABF7"/>'+'<path d="M0 220 Q120 200 240 214 T400 206 V300 H0 Z" fill="#FFE8A3"/>'+C(330,50,20,'#FFD43B')+L(90,240,110,150,'#8B5A2B',5)+'<path d="M60 160 Q110 110 160 150 Z" fill="#F06595"/>';
const city=()=>R(0,0,400,300,'#ADB5BD')+[[20,110,60],[90,80,70],[170,120,60],[240,70,80],[330,100,60]].map(([x,y,w])=>R(x,y,w,236-y,'#868E96',3)+[0,1,2].map(i=>R(x+10,y+12+i*30,14,16,'#FFE066',2)+R(x+w-24,y+12+i*30,14,16,'#FFE066',2)).join('')).join('')+R(0,236,400,64,'#495057')+'<ellipse cx="120" cy="262" rx="40" ry="8" fill="#74C0FC"/><ellipse cx="300" cy="276" rx="34" ry="7" fill="#74C0FC"/>'+cloud(110,40,.5)+cloud(290,46,.45)+drops(30,380,90,220,14);
const balloons=(x,y)=>L(x,y,x-24,y-90,'#868E96',2)+L(x,y,x+20,y-96,'#868E96',2)+'<ellipse cx="'+(x-26)+'" cy="'+(y-112)+'" rx="20" ry="25" fill="#E03131"/><ellipse cx="'+(x+22)+'" cy="'+(y-118)+'" rx="20" ry="25" fill="#4DABF7"/>';
const apple=(x,y)=>C(x,y,15,'#E03131')+L(x,y-14,x+3,y-22,'#8B4513',3)+'<ellipse cx="'+(x+8)+'" cy="'+(y-20)+'" rx="7" ry="4" fill="#40C057"/>';
const spider=(x,y)=>{ let s=L(x,y-150,x,y-30,'#ADB5BD',2); [-1,1].forEach(d=>[0,1,2,3].forEach(i=>{ s+='<path d="M'+(x+d*16)+' '+(y-6+i*7)+' L'+(x+d*(52+i*4))+' '+(y-40+i*16)+' L'+(x+d*(78+i*2))+' '+(y+4+i*14)+'" stroke="#1F2147" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'; })); return s+'<ellipse cx="'+x+'" cy="'+(y+8)+'" rx="30" ry="24" fill="#1F2147"/>'+C(x,y-18,16,'#1F2147')+C(x-6,y-20,4,'#fff')+C(x+6,y-20,4,'#fff'); };
const umbrella=(x,y)=>L(x,y,x,y-70,'#5C3B1E',4)+'<path d="M'+(x-50)+' '+(y-66)+' Q'+x+' '+(y-130)+' '+(x+50)+' '+(y-66)+' Q'+(x+25)+' '+(y-78)+' '+x+' '+(y-66)+' Q'+(x-25)+' '+(y-78)+' '+(x-50)+' '+(y-66)+' Z" fill="#7048E8"/>';
const bowl=(x,y,c)=>'<path d="M'+(x-26)+' '+(y-14)+' H'+(x+26)+' L'+(x+20)+' '+y+' H'+(x-20)+' Z" fill="#E03131"/>'+'<ellipse cx="'+x+'" cy="'+(y-14)+'" rx="22" ry="5" fill="'+c+'"/>';
const lamp=(x,on)=>L(x,0,x,60,'#495057',3)+'<path d="M'+(x-30)+' 90 L'+(x-16)+' 60 H'+(x+16)+' L'+(x+30)+' 90 Z" fill="#FFD43B"/>'+(on?'<path d="M'+(x-30)+' 92 L'+(x-90)+' 226 H'+(x+90)+' L'+(x+30)+' 92 Z" fill="#FFF3BF" opacity=".55"/>':'');
const bike=(x,y)=>C(x-46,y-24,24,'none')+'<circle cx="'+(x-46)+'" cy="'+(y-24)+'" r="24" fill="none" stroke="#343A40" stroke-width="6"/><circle cx="'+(x+50)+'" cy="'+(y-24)+'" r="24" fill="none" stroke="#343A40" stroke-width="6"/>'+'<path d="M'+(x-46)+' '+(y-24)+' L'+(x-6)+' '+(y-64)+' L'+(x+34)+' '+(y-64)+' L'+(x+50)+' '+(y-24)+' M'+(x-6)+' '+(y-64)+' L'+(x+4)+' '+(y-24)+' L'+(x-46)+' '+(y-24)+' M'+(x+34)+' '+(y-64)+' L'+(x+40)+' '+(y-84)+'" stroke="#1C7ED6" stroke-width="6" fill="none" stroke-linejoin="round"/>';
const bread=(x,y)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="44" ry="18" fill="#D9A273"/>'+'<path d="M'+(x-20)+' '+(y-10)+' q6 -8 12 0 M'+(x-2)+' '+(y-12)+' q6 -8 12 0 M'+(x+16)+' '+(y-10)+' q6 -8 12 0" stroke="#B5714A" stroke-width="3" fill="none"/>';
const knife=(x,y)=>R(x-4,y-8,10,22,'#5C3B1E',3)+'<path d="M'+(x-2)+' '+(y+12)+' L'+(x+2)+' '+(y+50)+' L'+(x+8)+' '+(y+12)+' Z" fill="#CED4DA"/>';
const ground=(c)=>R(0,226,400,74,c);
/* a tavola: il tavolo copre le gambe; il piatto davanti al petto; la mano porta il cibo alla bocca */
const atTable=(who,food)=>{ const x=200, y=270, sc=1.15, hx=x+30*sc, hy=y-118*sc;
  // la tovaglia scende fino a terra: si vede che è seduto, e le gambe non spuntano sotto il tavolo
  return kitchen()+kid(who,x,y,sc,{hands:[[-40,-84],[30,-118]]})+R(70,186,260,12,'#B08968',4)+'<path d="M66 192 H334 L340 270 H60 Z" fill="#74C0FC"/>'+[0,1,2,3,4,5,6,7,8].map(i=>R(74+i*30,198,14,70,'#A5D8FF')).join('')+food(x,hx,hy); };
const pastaFork=(x,hx,hy)=>plate(x,186,pasta(x,184))+L(hx,hy+4,x+10,112,'#868E96',5)+'<path d="M'+(x+5)+' 104 v10 M'+(x+10)+' 103 v11 M'+(x+15)+' 104 v10" stroke="#868E96" stroke-width="3.5" stroke-linecap="round"/>'+'<path d="M'+(x+6)+' 116 q-4 12 1 22 M'+(x+11)+' 116 q4 14 -1 24 M'+(x+15)+' 116 q3 10 0 18" stroke="#F2C94C" stroke-width="4" fill="none" stroke-linecap="round"/>';
const milkGlass=(x,hx,hy)=>plate(x,186,'')+glass(hx-6,hy+14,'#F8F9FA')+'<path d="M'+(hx-14)+' '+(hy-6)+' h16" stroke="#E9ECEF" stroke-width="5"/>';
const croissant=(x,hx,hy)=>plate(x,186,'<path d="M'+(x-18)+' 182 q18 -16 36 0 q-18 8 -36 0 Z" fill="#E8A400"/>')+'<path d="M'+(hx-16)+' '+(hy+2)+' q12 -14 24 0 q-12 8 -24 0 Z" fill="#E8A400"/>'+R(x+70,170,26,16,'#fff',3);
/* le 32 scene, una per esercizio */
const SCENES2={
 'lucia-pasta':()=>atTable('lucia',pastaFork),
 'cane-cuccia':()=>garden()+kennel(200,236)+T(200,214,'🐕',44)+zzz(232,140),
 'maestra-lavagna':()=>classroom+kid('maestra',280,240,.86,{hands:[[-34,-62],[-70,-176]]})+L(180,92,214,86,'#fff',4),
 'papa-macchina':()=>park()+kid('papa',176,226,.8,{hands:[[22,-106],[44,-110]]})+car(190,242)+'<circle cx="214" cy="146" r="14" fill="none" stroke="#343A40" stroke-width="5"/>',
 'nonna-fiori':()=>garden()+flowers(250,236)+kid('nonna',150,246,.8,{hands:[[-30,-80],[46,-116]]})+'<g transform="rotate(30 196 158)">'+can(196,158)+'</g>'+drops(232,262,170,210,5),
 'marco-latte':()=>atTable('marco',milkGlass),
 'amina-libro':()=>rm()+sofa(120,214,'#748FFC')+kid('amina',196,214,.78,{pose:'slide',hands:[[-24,-62],[24,-62]]})+bookOpen(196,176),
 'gatto-pesce':()=>kitchen()+T(160,196,'🐈',64)+plate(240,232,T(240,222,'🐟',38))+'<path d="M196 190 q10 -6 20 0" stroke="#F08C00" stroke-width="3" fill="none"/>',
 'elio-palla':()=>park()+tree(330)+kid('elio',170,246,.8,{pose:'run'})+ball(214,236)+'<path d="M238 230 h18 M240 240 h14" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
 'zoe-casa':()=>rm()+tableK(110,180)+kid('zoe',160,246,.78,{hands:[[-26,-66],[38,-84]]})+R(196,166,70,12,'#fff',2)+'<path d="M212 176 v-8 l10 -7 l10 7 v8 Z" fill="none" stroke="#E03131" stroke-width="2"/>'+L(190,182,198,166,'#F08C00',4),
 'bimbo-scuola':()=>park()+school(300)+kid('bimbo',140,246,.78,{pose:'run'})+R(108,140,22,30,'#7048E8',6)+'<path d="M180 190 h30 l-8 -8 M210 190 l-8 8" stroke="#1F2147" stroke-width="4" fill="none" stroke-linecap="round"/>',
 'pesce-mare':()=>R(0,0,400,300,'#74C0FC')+'<path d="M0 60 Q50 50 100 60 T200 60 T300 60 T400 60" stroke="#fff" stroke-width="4" fill="none"/>'+R(0,250,400,50,'#FFE8A3')+T(200,160,'🐟',70)+C(250,120,6,'#fff')+C(262,100,4,'#fff')+C(244,92,3,'#fff')+'<path d="M120 170 q-10 -6 -20 0 M120 150 q-10 -6 -20 0" stroke="#fff" stroke-width="3" fill="none"/>',
 'mamma-cucina':()=>kitchen(true)+stove(210)+kid('mamma',160,246,.82,{hands:[[-30,-80],[60,-118]]})+L(214,112,248,96,'#8B5A2B',4),
 'gatto-divano':()=>rm()+sofa(120,220,'#F783AC')+T(196,176,'🐈',54)+zzz(238,130),
 'uccellini-albero':()=>R(0,0,400,300,'#D0EBFF')+R(0,250,400,50,'#8CE99A')+R(70,120,22,130,'#8B5A2B')+'<path d="M90 150 L300 120" stroke="#8B5A2B" stroke-width="12" stroke-linecap="round"/>'+C(80,100,60,'#40C057')+T(190,116,'🐦',40)+T(260,106,'🐦',36)+notes(214,70),
 'luca-letto':()=>rm(true)+R(300,30,74,62,'#1F2147',6)+C(340,58,10,'#FFE066')+bed(90,240)+'<path d="M140 204 Q200 190 260 204 L262 230 H138 Z" fill="#4DABF7"/>'+head(CAST.luca,126,186,22,'calm')+zzz(160,150),
 'natale-albero':()=>rm()+xtree(160)+kid('lila',290,246,.78,{hands:[[-30,-80],[-74,-150]]})+C(232,128,8,'#F08C00'),
 'zoe-colazione':()=>atTable('zoe',croissant),
 'estate-mare':()=>beach()+kid('lila',230,262,.66,{hands:[[-34,-62],[40,-70]]})+kid('marco',300,262,.62,{pose:'up'})+R(250,208,18,20,'#F06595',4),
 'ieri-pioggia':()=>city(),
 'tre-conigli':()=>park()+T(110,220,'🐇',52)+T(200,226,'🐇',52)+T(290,218,'🐇',52),
 'lila-palloncini':()=>park()+kid('lila',200,246,.8,{hands:[[-34,-62],[30,-150]]})+balloons(224,126),
 'cinque-mele':()=>rm()+tableK(70,260)+[110,150,190,230,270].map((x,i)=>apple(x,160-(i%2)*4)).join(''),
 'ragno':()=>R(0,0,400,300,'#F1F3F5')+'<path d="M0 0 L120 120 M400 0 L280 120" stroke="#DEE2E6" stroke-width="2"/>'+spider(200,180),
 'nico-ombrello':()=>park()+cloud(200,40,.5)+drops(20,380,90,220,12)+kid('nico',200,246,.8,{hands:[[-30,-80],[16,-118]]})+umbrella(212,150),
 'zoe-caduta':()=>park()+kid('zoe',190,246,.8,{pose:'slide',mood:'sad',hands:[[-30,-70],[30,-70]]})+'<path d="M172 128 q-4 10 0 14 q4 -4 0 -14 Z M208 128 q-4 10 0 14 q4 -4 0 -14 Z" fill="#4DABF7"/>'+R(222,222,16,10,'#FFC9C9',3),
 'cane-acqua':()=>park()+sun(340,50)+T(170,206,'🐕',60)+bowl(240,240,'#4DABF7')+'<path d="M208 214 q8 10 16 4" stroke="#F06595" stroke-width="5" fill="none" stroke-linecap="round"/>',
 'mamma-luce':()=>rm(true)+lamp(260,true)+R(126,120,16,26,'#fff',3)+kid('mamma',170,246,.82,{hands:[[-30,-80],[-36,-134]]}),
 'elio-bici':()=>park()+school(330)+bike(170,250)+kid('elio',164,206,.62,{pose:'slide',hands:[[30,-118],[44,-124]]}),
 'lumaca':()=>park()+'<path d="M40 236 Q160 228 230 236" stroke="#CED4DA" stroke-width="6" fill="none" stroke-dasharray="4 8"/>'+T(270,216,'🐌',60)+T(120,200,'🐢',0),
 'amina-saluta':()=>park()+tree(80)+kid('amina',220,246,.84,{pose:'wave'})+'<path d="M272 72 q10 -6 14 6 M280 98 q12 -2 12 10" stroke="#1F2147" stroke-width="3" fill="none" stroke-linecap="round"/>',
 'papa-pane':()=>kitchen()+tableK(90,220)+kid('papa',170,246,.84,{hands:[[-14,-86],[40,-96]]})+bread(230,166)+knife(206,140),
};

/* ── le parole-domanda: ognuna con il suo colore, il suo simbolo e il tipo di risposta che chiede ── */
const QW={
 chi:{w:'Chi?',e:'👤',c:'#1C7ED6',t:'una persona o un animale',look:'Cerca una persona o un animale',ex:[['👧','Lila'],['🐶','il cane'],['👩‍🏫','la maestra']]},
 cosa:{w:'Cosa?',e:'❓',c:'#7048E8',t:'una cosa, o quello che succede',look:'Cerca una cosa, o quello che succede',ex:[['🍎','una mela'],['⚽','gioca a palla'],['📖','legge un libro']]},
 dove:{w:'Dove?',e:'📍',c:'#2F9E44',t:'un posto',look:'Cerca un posto',ex:[['🏫','a scuola'],['🛏️','nel letto'],['🌳','al parco']]},
 quando:{w:'Quando?',e:'🕒',c:'#E8590C',t:'un momento',look:'Cerca un momento',ex:[['🌙','la sera'],['📅','ieri'],['🎄','a Natale']]},
 quanti:{w:'Quanti?',e:'🔢',c:'#0B7285',t:'un numero',look:'Cerca un numero',ex:[['3️⃣','tre'],['✌️','due'],['🔟','dieci']]},
 perche:{w:'Perché?',e:'💡',c:'#C2255C',t:'un motivo: «perché…»',look:'Cerca il motivo: «perché…»',ex:[['🌧️','perché piove'],['😴','perché ha sonno'],['🎁','perché è festa']]},
 come:{w:'Come?',e:'🔧',c:'#A3671C',t:'il modo',look:'Cerca il modo',ex:[['🐢','piano piano'],['🚲','in bici'],['😊','con un sorriso']]},
};
const ORDER=['chi','dove','cosa','quando','quanti','perche','come'];

const EX=[
 {sc:'lucia-pasta',k:'chi',pic:'👧🍝',p:[['Lucia','chi'],['mangia',null],['la pasta','cosa'],['in cucina','dove']],q:'Chi mangia la pasta?',same:['Marco','la nonna']},
 {sc:'cane-cuccia',k:'chi',pic:'🐶💤',p:[['Il cane','chi'],['dorme',null],['nella cuccia','dove']],q:'Chi dorme nella cuccia?',same:['il gatto','il coniglio']},
 {sc:'maestra-lavagna',k:'chi',pic:'👩‍🏫✍️',p:[['La maestra','chi'],['scrive',null],['alla lavagna','dove']],q:'Chi scrive alla lavagna?',same:['il bambino','il papà']},
 {sc:'papa-macchina',k:'chi',pic:'👨🚗',p:[['Il papà','chi'],['guida',null],['la macchina','cosa']],q:'Chi guida la macchina?',same:['la maestra','il nonno']},
 {sc:'nonna-fiori',k:'chi',pic:'👵🌷',p:[['La nonna','chi'],['innaffia',null],['i fiori','cosa'],['in giardino','dove']],q:'Chi innaffia i fiori?',same:['Lucia','il papà']},
 {sc:'marco-latte',k:'cosa',pic:'👦🥛',p:[['Marco','chi'],['beve',null],['il latte','cosa'],['a colazione','quando']],q:'Che cosa beve Marco?',same:['il succo','l’acqua']},
 {sc:'amina-libro',k:'cosa',pic:'👧📖',p:[['Amina','chi'],['legge',null],['un libro','cosa'],['sul divano','dove']],q:'Che cosa legge Amina?',same:['un giornale','una lettera']},
 {sc:'gatto-pesce',k:'cosa',pic:'🐱🐟',p:[['Il gatto','chi'],['mangia',null],['il pesce','cosa']],q:'Che cosa mangia il gatto?',same:['il formaggio','la carota']},
 {sc:'elio-palla',k:'cosa',pic:'👦⚽',p:[['Elio','chi'],['gioca a palla','cosa'],['al parco','dove']],q:'Che cosa fa Elio al parco?',same:['legge','dorme']},
 {sc:'zoe-casa',k:'cosa',pic:'👧🖍️🏠',p:[['Zoe','chi'],['disegna',null],['una casa','cosa']],q:'Che cosa disegna Zoe?',same:['un albero','un gatto']},
 {sc:'bimbo-scuola',k:'dove',pic:'🧒🎒🏫',p:[['Il bambino','chi'],['va',null],['a scuola','dove'],['la mattina','quando']],q:'Dove va il bambino?',same:['al mare','in piscina']},
 {sc:'pesce-mare',k:'dove',pic:'🐟🌊',p:[['Il pesce','chi'],['nuota',null],['nel mare','dove']],q:'Dove nuota il pesce?',same:['nel cielo','nel bosco']},
 {sc:'mamma-cucina',k:'dove',pic:'👩🍳',p:[['La mamma','chi'],['cucina',null],['in cucina','dove'],['la sera','quando']],q:'Dove cucina la mamma?',same:['in bagno','in giardino']},
 {sc:'gatto-divano',k:'dove',pic:'🐱🛋️',p:[['Il gatto','chi'],['dorme',null],['sul divano','dove']],q:'Dove dorme il gatto?',same:['sul tetto','nel letto']},
 {sc:'uccellini-albero',k:'dove',pic:'🐦🌳',p:[['Gli uccellini','chi'],['cantano',null],['sull’albero','dove']],q:'Dove cantano gli uccellini?',same:['sul tetto','nel prato']},
 {sc:'luca-letto',k:'quando',pic:'🌙🛏️',p:[['La sera','quando'],['Luca','chi'],['va a letto','cosa']],q:'Quando va a letto Luca?',same:['la mattina','a pranzo']},
 {sc:'natale-albero',k:'quando',pic:'🎄⭐',p:[['A Natale','quando'],['facciamo',null],['l’albero','cosa']],q:'Quando facciamo l’albero?',same:['a Pasqua','d’estate']},
 {sc:'zoe-colazione',k:'quando',pic:'🌅🥐',p:[['Di mattina','quando'],['Zoe','chi'],['fa colazione','cosa']],q:'Quando Zoe fa colazione?',same:['di sera','di notte']},
 {sc:'estate-mare',k:'quando',pic:'☀️🏖️',p:[['D’estate','quando'],['andiamo',null],['al mare','dove']],q:'Quando andiamo al mare?',same:['d’inverno','a Natale']},
 {sc:'ieri-pioggia',k:'quando',pic:'🌧️☔',p:[['Ieri','quando'],['è piovuto',null],['in città','dove']],q:'Quando è piovuto?',same:['oggi','domani']},
 {sc:'tre-conigli',k:'quanti',pic:'🐰🐰🐰',p:[['Nel prato','dove'],['ci sono',null],['tre','quanti'],['conigli',null]],q:'Quanti conigli ci sono nel prato?',same:['due','cinque']},
 {sc:'lila-palloncini',k:'quanti',pic:'👧🎈🎈',p:[['Lila','chi'],['ha',null],['due','quanti'],['palloncini',null]],q:'Quanti palloncini ha Lila?',same:['tre','uno']},
 {sc:'cinque-mele',k:'quanti',pic:'🍎🍎🍎🍎🍎',p:[['Sul tavolo','dove'],['ci sono',null],['cinque','quanti'],['mele',null]],q:'Quante mele ci sono sul tavolo?',same:['quattro','sei']},
 {sc:'ragno',k:'quanti',pic:'🕷️',p:[['Il ragno','chi'],['ha',null],['otto','quanti'],['zampe',null]],q:'Quante zampe ha il ragno?',same:['sei','quattro']},
 {sc:'nico-ombrello',k:'perche',pic:'👦☂️🌧️',p:[['Nico','chi'],['prende',null],['l’ombrello','cosa'],['perché piove','perche']],q:'Perché Nico prende l’ombrello?',same:['perché c’è il sole','perché ha fame']},
 {sc:'zoe-caduta',k:'perche',pic:'👧😢🩹',p:[['Zoe','chi'],['piange',null],['perché è caduta','perche']],q:'Perché Zoe piange?',same:['perché è felice','perché ha sonno']},
 {sc:'cane-acqua',k:'perche',pic:'🐶💧',p:[['Il cane','chi'],['beve',null],['perché ha sete','perche']],q:'Perché il cane beve?',same:['perché ha freddo','perché gioca']},
 {sc:'mamma-luce',k:'perche',pic:'',p:[['La mamma','chi'],['accende la luce','cosa'],['perché è buio','perche']],q:'Perché la mamma accende la luce?',same:['perché è giorno','perché piove']},
 {sc:'elio-bici',k:'come',pic:'👦🚲🏫',p:[['Elio','chi'],['va a scuola','cosa'],['in bici','come']],q:'Come va a scuola Elio?',same:['a piedi','in macchina']},
 {sc:'lumaca',k:'come',pic:'🐌',p:[['La lumaca','chi'],['cammina',null],['piano piano','come']],q:'Come cammina la lumaca?',same:['velocissima','saltando']},
 {sc:'amina-saluta',k:'come',pic:'👧👋',p:[['Amina','chi'],['saluta',null],['con la mano','come']],q:'Come saluta Amina?',same:['con un bacio','con un inchino']},
 {sc:'papa-pane',k:'come',pic:'👨🍞',p:[['Il papà','chi'],['taglia il pane','cosa'],['con il coltello','come']],q:'Come taglia il pane il papà?',same:['con le forbici','con le mani']},
];
/* ══ Altre 66 scene: stesso stile (personaggi interi che fanno l'azione, oggetti nella mano) ══ */
CAST.nonno={skin:'fair',hair:'#DEE2E6',style:'short',shirt:'#5C7CFA',pants:'#495057',glasses:1};
/* un personaggio con un oggetto nella mano destra (o sinistra): l'oggetto sta dove sta la mano */
const fig=(who,x,y,sc,o)=>kid(who,x,y,sc,o||{});
const inHand=(x,y,sc,hand,e,size,dx,dy)=>T(x+hand[0]*sc+(dx||0),y+hand[1]*sc+(dy||0),e,size);
const pool=()=>R(0,0,400,300,'#E7F5FF')+R(0,150,400,150,'#4DABF7')+'<path d="M0 150 Q50 140 100 150 T200 150 T300 150 T400 150" stroke="#fff" stroke-width="4" fill="none"/>'+R(0,140,400,10,'#CED4DA');
const snow=()=>R(0,0,400,300,'#DDE7F5')+R(0,226,400,74,'#FFFFFF')+[[40,40],[120,80],[220,30],[320,70],[360,140],[70,150],[260,120]].map(([a,b])=>T(a,b,'❄️',16)).join('');
const bath=()=>R(0,0,400,300,'#E3FAFC')+[0,1,2,3,4,5,6,7].map(i=>[0,1,2,3].map(j=>R(i*50,j*50,48,48,'#C5F6FA',2)).join('')).join('')+R(0,206,400,94,'#99E9F2');
const shelves=()=>R(0,0,400,300,'#FFF4E6')+[40,100,160].map(y=>R(20,y,360,8,'#8B5A2B')+[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>R(28+i*29,y-34,20,34,['#E03131','#1C7ED6','#2F9E44','#F08C00','#7048E8'][i%5],2)).join('')).join('')+R(0,206,400,94,'#E9D8C4');
const autumn=()=>R(0,0,400,300,'#FFF3BF')+R(0,226,400,74,'#E8A400')+R(300,130,18,100,'#8B5A2B')+C(310,110,46,'#F08C00')+[[60,250],[140,262],[220,246],[90,280],[260,276]].map(([a,b])=>T(a,b,'🍂',20)).join('');
const night=()=>R(0,0,400,300,'#1F2147')+R(0,240,400,60,'#2B3A67')+C(330,60,24,'#FFE066')+C(340,52,22,'#1F2147');
const desk2=(x)=>R(x,180,170,10,'#B08968',3)+R(x+10,188,8,54,'#9C7656')+R(x+152,188,8,54,'#9C7656');
const tv=(x,y)=>R(x,y,110,72,'#343A40',6)+R(x+8,y+8,94,56,'#74C0FC',3)+T(x+55,y+36,'🐻',30)+R(x+50,y+72,10,14,'#343A40');
const bridge=()=>R(0,0,400,300,'#D0EBFF')+R(0,230,400,70,'#4DABF7')+'<path d="M0 150 H400" stroke="#8B5A2B" stroke-width="12"/>'+[60,160,260,360].map(x=>'<path d="M'+(x-40)+' 156 Q'+x+' 210 '+(x+40)+' 156" stroke="#8B5A2B" stroke-width="8" fill="none"/>').join('');
const clothes=()=>L(30,70,370,70,'#868E96',3)+'<path d="M90 70 h40 l8 14 h-8 v40 h-40 v-40 h-8 Z" fill="#F06595"/><path d="M250 70 h34 v50 h-34 Z" fill="#4DABF7"/>';
const window_=(x,y)=>R(x,y,70,60,'#D0EBFF',4)+'<rect x="'+x+'" y="'+y+'" width="70" height="60" rx="4" fill="none" stroke="#C9B49A" stroke-width="5"/>'+L(x+35,y,x+35,y+60,'#C9B49A',4);
const door=(x)=>R(x,90,80,146,'#8B5A2B',4)+C(x+64,166,5,'#FFD43B');
const fan=(x,y)=>L(x,y,x,y+80,'#495057',5)+C(x,y,32,'#E9ECEF')+'<path d="M'+x+' '+y+' l-26 -14 a30 30 0 0 1 20 -14 Z M'+x+' '+y+' l26 14 a30 30 0 0 1 -20 14 Z" fill="#74C0FC"/>'+'<path d="M'+(x-50)+' '+(y+10)+' q-10 6 -20 0 M'+(x-50)+' '+(y+24)+' q-10 6 -20 0" stroke="#74C0FC" stroke-width="3" fill="none"/>';
const cakeC=(x,y,n)=>R(x-46,y-36,92,36,'#F783AC',6)+R(x-46,y-40,92,10,'#FFF0F6',4)+Array.from({length:n},(_,i)=>{ const cx=x-36+i*(72/(n-1||1)); return R(cx-2,y-58,5,18,'#4DABF7')+'<path d="M'+(cx+0.5)+' '+(y-70)+' q-5 6 0 10 q5 -4 0 -10 Z" fill="#FFA94D"/>'; }).join('');
const light3=(x,y)=>R(x-22,y-110,44,110,'#343A40',8)+C(x,y-90,14,'#E03131')+C(x,y-56,14,'#FFD43B')+C(x,y-22,14,'#2F9E44')+R(x-4,y,8,60,'#495057');
/* un cane disegnato di lato, con le quattro zampe ben visibili */
const dogDrawn=(x,y,s)=>{ const c='#C0743A', d='#8B4513', P=(a,b)=>(x+a*s).toFixed(1)+' '+(y+b*s).toFixed(1);
  return [-44,-22,22,44].map(a=>'<rect x="'+(x+(a-6)*s)+'" y="'+(y-46*s)+'" width="'+(12*s)+'" height="'+(46*s)+'" rx="'+(5*s)+'" fill="'+(Math.abs(a)===22?d:c)+'"/>').join('')+
    '<ellipse cx="'+x+'" cy="'+(y-56*s)+'" rx="'+(62*s)+'" ry="'+(24*s)+'" fill="'+c+'"/>'+'<path d="M'+P(-58,-60)+' Q'+P(-84,-86)+' '+P(-76,-98)+'" stroke="'+c+'" stroke-width="'+(9*s)+'" fill="none" stroke-linecap="round"/>'+
    '<circle cx="'+(x+62*s)+'" cy="'+(y-84*s)+'" r="'+(24*s)+'" fill="'+c+'"/>'+'<ellipse cx="'+(x+52*s)+'" cy="'+(y-90*s)+'" rx="'+(9*s)+'" ry="'+(18*s)+'" fill="'+d+'"/>'+'<ellipse cx="'+(x+84*s)+'" cy="'+(y-80*s)+'" rx="'+(12*s)+'" ry="'+(9*s)+'" fill="#E9B98A"/>'+
    '<circle cx="'+(x+94*s)+'" cy="'+(y-82*s)+'" r="'+(4*s)+'" fill="#1F2147"/>'+'<circle cx="'+(x+70*s)+'" cy="'+(y-90*s)+'" r="'+(3.5*s)+'" fill="#1F2147"/>'; };
const S2={
 // 👤 chi
 'gatto-latte':()=>kitchen()+T(170,200,'🐈',64)+'<ellipse cx="236" cy="232" rx="28" ry="8" fill="#fff" stroke="#ADB5BD" stroke-width="2"/>'+'<path d="M200 198 q12 8 22 26" stroke="#F06595" stroke-width="4" fill="none" stroke-linecap="round"/>',
 'nonno-giornale':()=>rm()+sofa(120,220,'#A9E34B')+fig('nonno',196,220,.85,{pose:'slide',hands:[[-26,-66],[26,-66]]})+R(150,128,92,62,'#F8F9FA',3)+[0,1,2,3].map(i=>L(160,140+i*12,232,140+i*12,'#ADB5BD',3)).join(''),
 'nico-chitarra':()=>park()+tree(320)+fig('nico',190,246,.9,{hands:[[-30,-96],[22,-80]]})+'<g transform="rotate(-35 190 160)">'+'<ellipse cx="190" cy="176" rx="26" ry="30" fill="#E8A400"/>'+C(190,172,8,'#5C3B1E')+R(186,96,8,64,'#8B5A2B')+'</g>'+notes(250,90),
 'mamma-panni':()=>garden()+clothes()+fig('mamma',200,246,.9,{pose:'up'})+'<path d="M160 72 h40 v34 h-40 Z" fill="#FFD43B"/>',
 'elio-denti':()=>bath()+fig('elio',200,250,.95,{hands:[[-30,-80],[12,-134]]})+L(210,124,236,112,'#4DABF7',6)+R(228,104,14,8,'#fff',2)+C(186,128,4,'#fff')+C(178,120,3,'#fff'),
 'papa-pizza':()=>kitchen()+fig('papa',200,250,.9,{hands:[[-36,-84],[36,-84]]})+R(90,190,220,10,'#B08968',3)+'<ellipse cx="200" cy="186" rx="52" ry="12" fill="#F2C94C"/>'+'<ellipse cx="200" cy="184" rx="44" ry="9" fill="#E03131"/>'+C(186,182,4,'#fff')+C(212,184,4,'#fff')+'<path d="M180 44 q20 -20 40 0 v16 h-40 Z" fill="#fff"/>',
 'gallina-uovo':()=>garden()+R(120,186,160,50,'#E8A400',8)+T(200,166,'🐔',70)+T(256,220,'🥚',30),
 'amina-fiore':()=>garden()+fig('amina',170,246,.9,{hands:[[-30,-80],[40,-56]]})+R(232,226,40,8,'#8B5A2B',3)+'<path d="M252 226 v-22" stroke="#2F9E44" stroke-width="4"/>'+'<ellipse cx="244" cy="206" rx="8" ry="4" fill="#40C057"/><ellipse cx="260" cy="206" rx="8" ry="4" fill="#40C057"/>'+L(214,190,228,218,'#868E96',5),
 'scoiattolo-ghianda':()=>park()+R(260,100,24,140,'#8B5A2B')+C(270,80,60,'#40C057')+T(190,210,'🐿️',70)+T(226,196,'🌰',24),
 // ❓ cosa
 'lila-gelato':()=>park()+fig('lila',200,246,.95,{hands:[[-34,-62],[14,-134]]})+'<path d="M212 136 l-8 26 h16 Z" fill="#E8A400"/>'+C(212,128,12,'#F783AC'),
 'papa-macchina-lava':()=>park()+car(250,248)+fig('papa',110,246,.85,{hands:[[-30,-80],[44,-100]]})+R(140,150,22,14,'#FFD43B',4)+C(170,140,6,'#E7F5FF')+C(180,128,5,'#E7F5FF')+C(160,126,4,'#E7F5FF'),
 'nico-castello':()=>beach()+fig('nico',140,262,.8,{hands:[[-30,-70],[44,-60]]})+'<path d="M200 262 v-34 h12 v8 h10 v-8 h12 v8 h10 v-8 h12 v34 Z" fill="#E8C66A"/>'+'<path d="M236 228 v-14 l12 6 l-12 6" fill="#E03131"/>',
 'nonna-torta':()=>kitchen()+fig('nonna',150,250,.9,{hands:[[-30,-80],[50,-90]]})+R(110,196,220,10,'#B08968',3)+cakeC(250,196,3),
 'cane-palla':()=>park()+T(190,212,'🐕',70)+ball(150,196),
 'marco-tv':()=>rm()+tv(260,70)+sofa(60,220,'#748FFC')+fig('marco',136,220,.8,{pose:'slide',hands:[[-26,-80],[26,-80]]}),
 'zoe-tamburo':()=>park()+fig('zoe',180,246,.9,{hands:[[-30,-80],[40,-104]]})+R(150,176,70,40,'#E03131',6)+'<ellipse cx="185" cy="176" rx="35" ry="8" fill="#F8F9FA"/>'+L(214,154,200,170,'#8B5A2B',4)+notes(250,100),
 'maestra-finestra':()=>classroom+window_(300,110)+fig('maestra',250,246,.86,{hands:[[-34,-62],[60,-140]]}),
 'elio-foglie':()=>autumn()+fig('elio',170,246,.9,{hands:[[-30,-96],[30,-96]]})+T(170,150,'🍂',30)+T(186,160,'🍁',24),
 // 📍 dove
 'bimbo-piscina':()=>pool()+head(CAST.bimbo,200,150,26,'happy')+'<path d="M150 168 q20 -24 40 -6 M250 168 q-20 -24 -40 -6" stroke="#B97D4E" stroke-width="10" fill="none" stroke-linecap="round"/>'+C(170,190,5,'#fff')+C(232,196,4,'#fff'),
 'mucca-prato':()=>garden()+T(200,200,'🐄',90)+T(260,240,'🌼',22)+T(120,244,'🌼',22),
 'libro-tavolo':()=>rm()+R(90,170,220,12,'#B08968',3)+R(100,180,10,60,'#9C7656')+R(290,180,10,60,'#9C7656')+T(200,150,'📕',56),
 'lila-letto':()=>rm(true)+R(300,30,74,62,'#1F2147',6)+C(340,58,10,'#FFE066')+bed(90,240)+'<path d="M140 204 Q200 190 260 204 L262 230 H138 Z" fill="#F783AC"/>'+head(CAST.lila,126,186,22,'calm')+zzz(160,150),
 'treno-ponte':()=>bridge()+T(220,124,'🚂',60)+T(160,124,'🚃',52),
 'amina-cortile':()=>R(0,0,400,300,'#D0EBFF')+R(0,200,400,100,'#CED4DA')+[0,1,2,3].map(i=>'<rect x="'+(250-i*0)+'" y="'+(272-i*20)+'" width="40" height="18" fill="none" stroke="#fff" stroke-width="3"/>').join('')+school(90)+fig('amina',260,250,.8,{pose:'up'}),
 'scimmia-albero':()=>R(0,0,400,300,'#D3F9D8')+R(180,110,26,190,'#8B5A2B')+C(192,90,70,'#40C057')+T(150,150,'🐒',60),
 'bimbi-biblioteca':()=>shelves()+R(90,200,220,10,'#B08968',3)+fig('marco',150,250,.75,{hands:[[-26,-90],[26,-90]]})+bookOpen(150,190)+fig('amina',250,250,.75,{hands:[[-26,-90],[26,-90]]})+bookOpen(250,190),
 'nave-mare':()=>R(0,0,400,300,'#D0EBFF')+'<path d="M0 180 Q50 170 100 180 T200 180 T300 180 T400 180 V300 H0 Z" fill="#1C7ED6"/>'+T(200,160,'🚢',90),
 // 🕒 quando
 'notte-stelle':()=>night()+[[60,60],[120,110],[200,50],[260,120],[90,170],[180,150],[300,180]].map(([a,b])=>T(a,b,'⭐',22)).join(''),
 'inverno-neve':()=>snow()+C(200,210,30,'#fff')+C(200,160,22,'#fff')+'<circle cx="200" cy="210" r="30" fill="none" stroke="#CED4DA" stroke-width="2"/><circle cx="200" cy="160" r="22" fill="none" stroke="#CED4DA" stroke-width="2"/>'+C(193,156,3,'#1F2147')+C(207,156,3,'#1F2147')+'<path d="M200 162 l14 4 l-14 3 Z" fill="#F08C00"/>'+R(186,132,28,10,'#1F2147'),
 'pranzo-minestra':()=>atTable('luca',(x,hx,hy)=>plate(x,186,'<ellipse cx="'+x+'" cy="'+182+'" rx="26" ry="6" fill="#F08C00"/>')+'<ellipse cx="'+(hx-4)+'" cy="'+(hy+2)+'" rx="9" ry="5" fill="#868E96"/>'+L(hx,hy+4,hx+14,hy+30,'#868E96',4)),
 'primavera-fiori':()=>garden()+flowers(110,236)+flowers(230,236)+T(160,120,'🦋',30)+T(280,150,'🦋',26)+T(80,90,'🌸',26),
 'domenica-parco':()=>park()+tree(320)+fig('papa',120,246,.8,{hands:[[-34,-62],[40,-70]]})+fig('lila',180,246,.62,{hands:[[-40,-80],[34,-62]]})+fig('mamma',240,246,.8,{hands:[[-40,-70],[34,-62]]}),
 'nico-compiti':()=>rm()+desk2(110)+fig('nico',190,250,.85,{hands:[[-30,-80],[34,-82]]})+R(170,168,70,14,'#fff',2)+L(212,170,226,150,'#F08C00',4),
 'pasqua-uova':()=>garden()+fig('zoe',170,246,.85,{hands:[[-30,-80],[44,-90]]})+'<path d="M196 160 h44 l-6 26 h-32 Z" fill="#C0743A"/>'+T(206,156,'🥚',18)+T(226,156,'🥚',18)+T(280,234,'🥚',24)+T(110,238,'🥚',22),
 'mattina-gallo':()=>R(0,0,400,300,'#FFE8CC')+R(0,226,400,74,'#8CE99A')+'<path d="M260 226 a50 50 0 0 1 100 0 Z" fill="#FFD43B"/>'+T(160,200,'🐓',80)+notes(210,110),
 'tramonto-sole':()=>R(0,0,400,300,'#FFA94D')+'<path d="M140 190 a60 60 0 0 1 120 0 Z" fill="#E03131"/>'+'<path d="M0 190 Q100 180 200 190 T400 188 V300 H0 Z" fill="#7048E8"/>'+L(200,120,200,150,'#fff',3)+'<path d="M192 142 l8 10 l8 -10" stroke="#fff" stroke-width="3" fill="none"/>',
 // 🔢 quanti
 'quattro-uccellini':()=>R(0,0,400,300,'#D0EBFF')+'<path d="M20 160 L380 150" stroke="#8B5A2B" stroke-width="12" stroke-linecap="round"/>'+[90,160,230,300].map(x=>T(x,130,'🐦',40)).join(''),
 'sei-pastelli':()=>rm()+R(60,190,280,10,'#B08968',3)+['#E03131','#F08C00','#FFD43B','#2F9E44','#1C7ED6','#7048E8'].map((c,i)=>'<path d="M'+(110+i*32)+' 186 v-60 l6 -12 l6 12 v60 Z" fill="'+c+'"/>').join(''),
 'due-nuvole':()=>R(0,0,400,300,'#D0EBFF')+R(0,240,400,60,'#8CE99A')+'<g transform="translate(120 100) scale(.5)"><path d="M-90 30 Q-120 30 -120 0 Q-120 -34 -84 -34 Q-74 -76 -26 -72 Q4 -104 46 -80 Q96 -86 100 -40 Q130 -32 124 0 Q118 30 88 30 Z" fill="#fff"/></g><g transform="translate(290 130) scale(.45)"><path d="M-90 30 Q-120 30 -120 0 Q-120 -34 -84 -34 Q-74 -76 -26 -72 Q4 -104 46 -80 Q96 -86 100 -40 Q130 -32 124 0 Q118 30 88 30 Z" fill="#fff"/></g>',
 'sette-candeline':()=>rm()+R(80,236,240,10,'#B08968',3)+cakeC(200,236,7),
 'tre-fiori-vaso':()=>rm()+'<path d="M170 240 h60 l-8 -56 h-44 Z" fill="#4DABF7"/>'+[170,200,230].map((x,i)=>L(200,190,x,110,'#2F9E44',4)+C(x,104,13,['#F06595','#FFD43B','#9775FA'][i])+C(x,104,5,'#fff')).join(''),
 'cane-zampe':()=>garden()+dogDrawn(190,236,1.3),
 'cinque-pesci':()=>R(60,60,280,190,'#74C0FC',12)+'<rect x="60" y="60" width="280" height="190" rx="12" fill="none" stroke="#ADB5BD" stroke-width="8"/>'+[[110,110],[200,100],[290,120],[150,190],[250,200]].map(([a,b])=>T(a,b,'🐠',36)).join('')+'<path d="M200 250 q-10 -20 0 -40" stroke="#2F9E44" stroke-width="5" fill="none"/>',
 'sei-funghi':()=>garden()+[[70,238],[130,250],[190,236],[250,252],[310,240],[350,256]].map(([a,b])=>T(a,b,'🍄',38)).join(''),
 'tre-libri':()=>rm()+R(110,236,180,10,'#B08968',3)+R(150,212,100,24,'#E03131',3)+R(156,188,92,24,'#1C7ED6',3)+R(146,164,108,24,'#2F9E44',3),
 'semaforo':()=>city().replace(/<path d="M[^"]*q-5 10 0 14 q5 -4 0 -14 Z" fill="#4DABF7"\/>/g,'')+light3(200,180),
 // 💡 perché
 'marco-cappotto':()=>snow()+fig('marco',200,246,.95,{hands:[[-30,-96],[30,-96]]})+'<path d="M172 128 h56 l6 80 h-68 Z" fill="#C0743A" opacity=".95"/>'+R(196,130,8,76,'#8B5A2B')+R(170,110,60,12,'#E03131',6),
 'lila-vinto':()=>park()+fig('lila',200,246,.95,{pose:'up'})+T(242,58,'🏆',40)+T(130,80,'🎉',30),
 'nonna-occhiali':()=>rm()+sofa(120,220,'#E599F7')+fig('nonna',196,220,.85,{pose:'slide',hands:[[-26,-66],[26,-66]]})+bookOpen(196,176),
 'papa-ventilatore':()=>rm()+C(340,50,22,'#FFD43B')+fan(260,110)+fig('papa',130,246,.9,{hands:[[-30,-80],[50,-100]]})+'<path d="M108 100 q-4 10 0 14 q4 -4 0 -14 Z" fill="#4DABF7"/>',
 'elio-sonno':()=>rm(true)+bed(170,240)+fig('elio',110,246,.85,{hands:[[-30,-80],[16,-134]]})+zzz(140,80),
 'nico-fame':()=>atTable('nico',pastaFork),
 'fiore-appassito':()=>garden()+'<path d="M180 240 h40 l-6 -40 h-28 Z" fill="#C0743A"/>'+'<path d="M200 200 q0 -50 30 -60" stroke="#8D9440" stroke-width="5" fill="none"/>'+C(236,148,14,'#ADB5BD')+C(236,148,5,'#868E96')+'<path d="M206 170 q-14 4 -20 16" stroke="#8D9440" stroke-width="4" fill="none"/>',
 'zoe-compleanno':()=>rm()+R(80,236,240,10,'#B08968',3)+cakeC(260,236,5)+fig('zoe',150,246,.9,{pose:'up'})+'<path d="M134 82 l16 -34 l16 34 Z" fill="#F06595"/>'+T(80,80,'🎈',30)+T(330,90,'🎉',30),
 'gatto-scappa':()=>garden()+T(110,214,'🐕',60)+T(280,214,'🐈',56)+'<path d="M210 200 h30 M206 216 h40 M210 232 h30" stroke="#868E96" stroke-width="4" stroke-linecap="round"/>',
 'luca-crema':()=>beach()+fig('luca',200,262,.85,{hands:[[-26,-110],[30,-96]]})+R(222,168,14,26,'#FFD43B',4)+C(204,152,4,'#fff')+C(196,160,3,'#fff'),
 // 🔧 come
 'coniglio-veloce':()=>garden()+T(240,206,'🐇',70)+'<path d="M80 190 h70 M90 210 h80 M80 230 h70" stroke="#868E96" stroke-width="5" stroke-linecap="round"/>',
 'zoe-matita':()=>rm()+desk2(110)+fig('zoe',190,250,.85,{hands:[[-30,-80],[34,-82]]})+R(170,168,70,14,'#fff',2)+'<path d="M226 150 l-12 20 l3 3 l12 -20 Z" fill="#FFD43B"/>',
 'nonna-bastone':()=>park()+fig('nonna',200,246,.9,{hands:[[-34,-62],[42,-80]]})+L(238,176,248,246,'#8B5A2B',6)+'<path d="M238 176 q-2 -12 10 -12" stroke="#8B5A2B" stroke-width="6" fill="none"/>',
 'papa-treno':()=>R(0,0,400,300,'#D0EBFF')+R(0,240,400,60,'#ADB5BD')+L(0,244,400,244,'#495057',4)+R(40,110,320,110,'#2F9E44',14)+R(70,130,70,50,'#D0EBFF',6)+R(170,130,70,50,'#D0EBFF',6)+R(270,130,60,50,'#D0EBFF',6)+head(CAST.papa,205,156,18,'happy')+C(100,226,16,'#343A40')+C(300,226,16,'#343A40'),
 'lila-voce-bassa':()=>rm()+fig('lila',200,250,1,{hands:[[-34,-62],[4,-142]]})+L(204,110,204,136,'#F2C7A5',6)+'<text x="240" y="90" font-size="26" font-weight="900" fill="#868E96" font-family="system-ui">shh…</text>',
 'pesce-pinne':()=>R(0,0,400,300,'#74C0FC')+T(200,150,'🐟',120)+'<path d="M120 140 q-14 -10 -26 0 M120 160 q-14 10 -26 0" stroke="#fff" stroke-width="4" fill="none"/>',
 'marco-cucchiaio':()=>atTable('marco',(x,hx,hy)=>plate(x,186,'<ellipse cx="'+x+'" cy="182" rx="26" ry="6" fill="#F08C00"/>')+'<ellipse cx="'+(hx-4)+'" cy="'+(hy+2)+'" rx="9" ry="5" fill="#868E96"/>'+L(hx,hy+4,hx+14,hy+30,'#868E96',4)),
 'amina-pastelli':()=>rm()+desk2(110)+fig('amina',190,250,.85,{hands:[[-30,-80],[34,-82]]})+R(170,168,70,14,'#fff',2)+'<path d="M178 176 q16 -10 32 0" stroke="#E03131" stroke-width="3" fill="none"/>'+'<path d="M226 150 l-12 20 l3 3 l12 -20 Z" fill="#2F9E44"/>'+markers(250,180),
 'aereo-alto':()=>R(0,0,400,300,'#A5D8FF')+R(0,270,400,30,'#8CE99A')+T(220,60,'✈️',56)+'<path d="M80 80 q40 -20 90 -16" stroke="#fff" stroke-width="5" fill="none" stroke-dasharray="8 10"/>'+'<path d="M330 260 v-180 m-10 12 l10 -12 l10 12" stroke="#495057" stroke-width="3" fill="none"/>',
 'nico-chiave':()=>rm()+door(220)+fig('nico',170,246,.9,{hands:[[-34,-62],[60,-96]]})+T(228,160,'🔑',26),
};
Object.assign(SCENES2,S2);

/* altri 66 esercizi: ora sono 14 per ogni parola-domanda */
EX.push(
 {sc:'gatto-latte',k:'chi',p:[['Il gatto','chi'],['beve',null],['il latte','cosa']],q:'Chi beve il latte?',same:['il cane','il topo']},
 {sc:'nonno-giornale',k:'chi',p:[['Il nonno','chi'],['legge',null],['il giornale','cosa'],['sul divano','dove']],q:'Chi legge il giornale?',same:['la nonna','il papà']},
 {sc:'nico-chitarra',k:'chi',p:[['Nico','chi'],['suona',null],['la chitarra','cosa'],['al parco','dove']],q:'Chi suona la chitarra?',same:['Elio','Zoe']},
 {sc:'mamma-panni',k:'chi',p:[['La mamma','chi'],['stende',null],['i panni','cosa'],['in giardino','dove']],q:'Chi stende i panni?',same:['il papà','la nonna']},
 {sc:'elio-denti',k:'chi',p:[['Elio','chi'],['si lava',null],['i denti','cosa'],['in bagno','dove']],q:'Chi si lava i denti?',same:['Marco','Luca']},
 {sc:'papa-pizza',k:'chi',p:[['Il papà','chi'],['prepara',null],['la pizza','cosa'],['in cucina','dove']],q:'Chi prepara la pizza?',same:['la mamma','la maestra']},
 {sc:'gallina-uovo',k:'chi',p:[['La gallina','chi'],['fa',null],['l’uovo','cosa'],['nel pollaio','dove']],q:'Chi fa l’uovo?',same:['il gallo','il gatto']},
 {sc:'amina-fiore',k:'chi',p:[['Amina','chi'],['pianta',null],['un fiore','cosa'],['in giardino','dove']],q:'Chi pianta un fiore?',same:['Lila','la nonna']},
 {sc:'scoiattolo-ghianda',k:'chi',p:[['Lo scoiattolo','chi'],['mangia',null],['una ghianda','cosa']],q:'Chi mangia la ghianda?',same:['il topo','il coniglio']},
 {sc:'lila-gelato',k:'cosa',p:[['Lila','chi'],['mangia',null],['un gelato','cosa'],['al parco','dove']],q:'Che cosa mangia Lila?',same:['una mela','una pizza']},
 {sc:'papa-macchina-lava',k:'cosa',p:[['Il papà','chi'],['lava',null],['la macchina','cosa'],['la domenica','quando']],q:'Che cosa lava il papà?',same:['il cane','la bici']},
 {sc:'nico-castello',k:'cosa',p:[['Nico','chi'],['costruisce',null],['un castello di sabbia','cosa'],['al mare','dove']],q:'Che cosa costruisce Nico?',same:['una casa','una torre']},
 {sc:'nonna-torta',k:'cosa',p:[['La nonna','chi'],['prepara',null],['una torta','cosa'],['in cucina','dove']],q:'Che cosa prepara la nonna?',same:['la pizza','il pane']},
 {sc:'cane-palla',k:'cosa',p:[['Il cane','chi'],['porta',null],['la palla','cosa'],['al parco','dove']],q:'Che cosa porta il cane?',same:['un osso','una scarpa']},
 {sc:'marco-tv',k:'cosa',p:[['Marco','chi'],['guarda',null],['la televisione','cosa'],['la sera','quando']],q:'Che cosa guarda Marco?',same:['il cielo','un libro']},
 {sc:'zoe-tamburo',k:'cosa',p:[['Zoe','chi'],['suona',null],['il tamburo','cosa'],['al parco','dove']],q:'Che cosa suona Zoe?',same:['la chitarra','il flauto']},
 {sc:'maestra-finestra',k:'cosa',p:[['La maestra','chi'],['apre',null],['la finestra','cosa'],['in classe','dove']],q:'Che cosa apre la maestra?',same:['la porta','il libro']},
 {sc:'elio-foglie',k:'cosa',p:[['In autunno','quando'],['Elio','chi'],['raccoglie',null],['le foglie','cosa']],q:'Che cosa raccoglie Elio?',same:['i fiori','le pietre']},
 {sc:'bimbo-piscina',k:'dove',p:[['Il bambino','chi'],['nuota',null],['in piscina','dove']],q:'Dove nuota il bambino?',same:['nel lago','al mare']},
 {sc:'mucca-prato',k:'dove',p:[['La mucca','chi'],['mangia',null],['l’erba','cosa'],['nel prato','dove']],q:'Dove mangia la mucca?',same:['nella stalla','nel bosco']},
 {sc:'libro-tavolo',k:'dove',p:[['Il libro','cosa'],['è',null],['sul tavolo','dove']],q:'Dove si trova il libro?',same:['sotto il letto','nello zaino']},
 {sc:'lila-letto',k:'dove',p:[['Di notte','quando'],['Lila','chi'],['dorme',null],['nel suo letto','dove']],q:'Dove dorme Lila?',same:['sul divano','sul prato']},
 {sc:'treno-ponte',k:'dove',p:[['Il treno','chi'],['passa',null],['sul ponte','dove']],q:'Dove passa il treno?',same:['nel tunnel','sulla strada']},
 {sc:'amina-cortile',k:'dove',p:[['Amina','chi'],['gioca',null],['in cortile','dove'],['dopo pranzo','quando']],q:'Dove gioca Amina?',same:['in camera','in classe']},
 {sc:'scimmia-albero',k:'dove',p:[['La scimmia','chi'],['salta',null],['sull’albero','dove']],q:'Dove salta la scimmia?',same:['sul tetto','sul letto']},
 {sc:'bimbi-biblioteca',k:'dove',p:[['Marco e Amina','chi'],['leggono',null],['in biblioteca','dove']],q:'Dove leggono Marco e Amina?',same:['in cucina','al parco']},
 {sc:'nave-mare',k:'dove',p:[['La nave','chi'],['naviga',null],['sul mare','dove']],q:'Dove naviga la nave?',same:['sul fiume','sul lago']},
 {sc:'notte-stelle',k:'quando',p:[['Di notte','quando'],['brillano',null],['le stelle','chi']],q:'Quando brillano le stelle?',same:['di giorno','a pranzo']},
 {sc:'inverno-neve',k:'quando',p:[['D’inverno','quando'],['facciamo',null],['il pupazzo di neve','cosa']],q:'Quando facciamo il pupazzo di neve?',same:['d’estate','in primavera']},
 {sc:'pranzo-minestra',k:'quando',p:[['A pranzo','quando'],['Luca','chi'],['mangia',null],['la minestra','cosa']],q:'Quando Luca mangia la minestra?',same:['a colazione','a merenda']},
 {sc:'primavera-fiori',k:'quando',p:[['In primavera','quando'],['sbocciano',null],['i fiori','chi']],q:'Quando sbocciano i fiori?',same:['d’inverno','in autunno']},
 {sc:'domenica-parco',k:'quando',p:[['Domenica','quando'],['andiamo',null],['al parco','dove']],q:'Quando andiamo al parco?',same:['lunedì','martedì']},
 {sc:'nico-compiti',k:'quando',p:[['Dopo la scuola','quando'],['Nico','chi'],['fa i compiti','cosa']],q:'Quando Nico fa i compiti?',same:['prima di dormire','a colazione']},
 {sc:'pasqua-uova',k:'quando',p:[['A Pasqua','quando'],['Zoe','chi'],['cerca le uova','cosa'],['in giardino','dove']],q:'Quando Zoe cerca le uova?',same:['a Natale','a Carnevale']},
 {sc:'mattina-gallo',k:'quando',p:[['La mattina','quando'],['il gallo','chi'],['canta',null]],q:'Quando canta il gallo?',same:['la notte','la sera']},
 {sc:'tramonto-sole',k:'quando',p:[['Al tramonto','quando'],['il sole','chi'],['va giù',null]],q:'Quando va giù il sole?',same:['a mezzogiorno','la mattina']},
 {sc:'quattro-uccellini',k:'quanti',p:[['Sul ramo','dove'],['ci sono',null],['quattro','quanti'],['uccellini',null]],q:'Quanti uccellini ci sono sul ramo?',same:['tre','cinque']},
 {sc:'sei-pastelli',k:'quanti',p:[['Sul tavolo','dove'],['ci sono',null],['sei','quanti'],['pastelli',null]],q:'Quanti pastelli ci sono sul tavolo?',same:['quattro','otto']},
 {sc:'due-nuvole',k:'quanti',p:[['Nel cielo','dove'],['ci sono',null],['due','quanti'],['nuvole',null]],q:'Quante nuvole ci sono nel cielo?',same:['tre','una']},
 {sc:'sette-candeline',k:'quanti',p:[['La torta','chi'],['ha',null],['sette','quanti'],['candeline',null]],q:'Quante candeline ha la torta?',same:['sei','otto']},
 {sc:'tre-fiori-vaso',k:'quanti',p:[['Nel vaso','dove'],['ci sono',null],['tre','quanti'],['fiori',null]],q:'Quanti fiori ci sono nel vaso?',same:['due','quattro']},
 {sc:'cane-zampe',k:'quanti',p:[['Il cane','chi'],['ha',null],['quattro','quanti'],['zampe',null]],q:'Quante zampe ha il cane?',same:['due','sei']},
 {sc:'cinque-pesci',k:'quanti',p:[['Nell’acquario','dove'],['nuotano',null],['cinque','quanti'],['pesci',null]],q:'Quanti pesci nuotano nell’acquario?',same:['tre','sei']},
 {sc:'sei-funghi',k:'quanti',p:[['Nel prato','dove'],['ci sono',null],['sei','quanti'],['funghi',null]],q:'Quanti funghi ci sono nel prato?',same:['cinque','sette']},
 {sc:'tre-libri',k:'quanti',p:[['Sul tavolo','dove'],['ci sono',null],['tre','quanti'],['libri',null]],q:'Quanti libri ci sono sul tavolo?',same:['due','quattro']},
 {sc:'semaforo',k:'quanti',p:[['Il semaforo','chi'],['ha',null],['tre','quanti'],['luci',null]],q:'Quante luci ha il semaforo?',same:['due','quattro']},
 {sc:'marco-cappotto',k:'perche',p:[['Marco','chi'],['mette',null],['il cappotto','cosa'],['perché fa freddo','perche']],q:'Perché Marco mette il cappotto?',same:['perché fa caldo','perché ha fame']},
 {sc:'lila-vinto',k:'perche',p:[['Lila','chi'],['salta di gioia','cosa'],['perché ha vinto','perche']],q:'Perché Lila salta di gioia?',same:['perché è triste','perché piove']},
 {sc:'nonna-occhiali',k:'perche',p:[['La nonna','chi'],['mette gli occhiali','cosa'],['perché vuole leggere','perche']],q:'Perché la nonna mette gli occhiali?',same:['perché ha sonno','perché fa freddo']},
 {sc:'papa-ventilatore',k:'perche',p:[['Il papà','chi'],['accende il ventilatore','cosa'],['perché fa caldo','perche']],q:'Perché il papà accende il ventilatore?',same:['perché fa freddo','perché è buio']},
 {sc:'elio-sonno',k:'perche',p:[['Elio','chi'],['va a letto','cosa'],['perché ha sonno','perche']],q:'Perché Elio va a letto?',same:['perché ha fame','perché ha sete']},
 {sc:'nico-fame',k:'perche',p:[['Nico','chi'],['mangia la pasta','cosa'],['perché ha fame','perche']],q:'Perché Nico mangia la pasta?',same:['perché ha sonno','perché è stanco']},
 {sc:'fiore-appassito',k:'perche',p:[['Il fiore','chi'],['è appassito',null],['perché non ha acqua','perche']],q:'Perché il fiore è appassito?',same:['perché è nuovo','perché è rosso']},
 {sc:'zoe-compleanno',k:'perche',p:[['Zoe','chi'],['è felice',null],['perché è il suo compleanno','perche']],q:'Perché Zoe è felice?',same:['perché piove','perché è caduta']},
 {sc:'gatto-scappa',k:'perche',p:[['Il gatto','chi'],['scappa',null],['perché arriva il cane','perche']],q:'Perché il gatto scappa?',same:['perché ha fame','perché dorme']},
 {sc:'luca-crema',k:'perche',p:[['Luca','chi'],['mette la crema','cosa'],['perché c’è il sole','perche']],q:'Perché Luca mette la crema?',same:['perché piove','perché nevica']},
 {sc:'coniglio-veloce',k:'come',p:[['Il coniglio','chi'],['corre',null],['veloce','come'],['nel prato','dove']],q:'Come corre il coniglio?',same:['piano piano','camminando']},
 {sc:'zoe-matita',k:'come',p:[['Zoe','chi'],['scrive',null],['con la matita','come']],q:'Come scrive Zoe?',same:['con il pennello','con il gesso']},
 {sc:'nonna-bastone',k:'come',p:[['La nonna','chi'],['cammina',null],['con il bastone','come'],['al parco','dove']],q:'Come cammina la nonna?',same:['con la bici','di corsa']},
 {sc:'papa-treno',k:'come',p:[['Il papà','chi'],['va al lavoro','cosa'],['in treno','come']],q:'Come va al lavoro il papà?',same:['in bici','a piedi']},
 {sc:'lila-voce-bassa',k:'come',p:[['Lila','chi'],['parla',null],['a voce bassa','come']],q:'Come parla Lila?',same:['a voce alta','urlando']},
 {sc:'pesce-pinne',k:'come',p:[['Il pesce','chi'],['nuota',null],['con le pinne','come']],q:'Come nuota il pesce?',same:['con le zampe','con le ali']},
 {sc:'marco-cucchiaio',k:'come',p:[['Marco','chi'],['mangia la minestra','cosa'],['con il cucchiaio','come']],q:'Come mangia la minestra Marco?',same:['con le mani','con la forchetta']},
 {sc:'amina-pastelli',k:'come',p:[['Amina','chi'],['colora',null],['con i pastelli','come']],q:'Come colora Amina?',same:['con la penna','con il gesso']},
 {sc:'aereo-alto',k:'come',p:[['L’aereo','chi'],['vola',null],['alto','come'],['nel cielo','dove']],q:'Come vola l’aereo?',same:['basso basso','piano piano']},
 {sc:'nico-chiave',k:'come',p:[['Nico','chi'],['apre la porta','cosa'],['con la chiave','come']],q:'Come apre la porta Nico?',same:['con il piede','con il martello']},
);

/* ══ 👤 Solo «Chi?»: quattro livelli, per l'adulto che fa le domande al bambino ══ */
const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
const keep=[]; let alive=0;
function speak(t){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='it-IT'; u.rate=.85; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('it')); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1400+t.length*90); setTimeout(()=>speechSynthesis.speak(u),60); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
const low=s=>s.charAt(0).toLowerCase()+s.slice(1);
/* le scene utili: il primo pezzo è chi fa l'azione; la domanda «Chi …?» si costruisce con il resto della frase */
const CHI=EX.filter(x=>x.p[0][1]==='chi'&&!/^(Il libro|Le stelle|I fiori|La torta|Il semaforo|Il ragno)/.test(x.p[0][0])&&!/^(ha|è|ci sono)$/.test(x.p[1][0])&&!/^(è |ha )/.test(x.p[1][0])).map(x=>{ /* solo azioni (niente «ha quattro zampe») */ const subj=x.p[0][0], rest=x.p.slice(1).map(c=>c[0]).join(' ');
  return {x,subj,rest,q:'Chi '+rest+'?',obj:(x.p.find(c=>c[1]==='cosa')||[])[0]||null,full:subj+' '+rest+'.'}; });
const isName=s=>/^[A-Z]/.test(s)&&!/^(Il|La|Lo|L’|I|Gli|Le) /.test(s);
const model=c=>(isName(c.subj)?'È '+c.subj:'È '+low(c.subj))+' · '+c.full;
const sceneSvg=x=>'<svg viewBox="0 0 400 300" aria-hidden="true">'+SCENES2[x.sc]()+'</svg>';

const LV={1:{t:'Livello 1 · Chi fa l’azione, o la cosa?',when:'Se indica o dice l’oggetto («pasta») o tira a indovinare sulla scena.',next:'Risponde giusto almeno 3 volte su 4, senza tirare a caso.'},
 2:{t:'Livello 2 · Tra due personaggi',when:'Ha capito che «Chi?» è una persona o un animale, ma deve scegliere tra due figure.',next:'Distingue i due personaggi senza guardare a caso o indicare d’impulso.'},
 3:{t:'Livello 3 · Una scena, con un piccolo aiuto',when:'Per rispondere su una figura sola, con meno carico di ascolto.',next:'Risponde mirato con un aiuto minimo, o completando la frase.'},
 4:{t:'Livello 4 · Domanda aperta',when:'Consolidamento su scene di tutti i giorni, senza scelte pronte.',next:'—'}};
let S=Object.assign({lv:1,status:{},hist:[],frase:false,solo:false},store('chi_stato',{}));
const save=()=>keepS('chi_stato',S);
let block=[], trial=null;

function statusLine(){ const st=S.status[S.lv]; return 'Domanda CHI: Livello '+S.lv+(st==='cons'?' → '+(S.lv+1)+' (in consolidamento)':st==='ok'?' (raggiunto)':' (in lavoro)'); }
function render(){ hush(); $('status').textContent=statusLine();
  const fr=$('frase'); fr.innerHTML=''; [[false,'No'],[true,'Sì, come aiuto']].forEach(([v,l])=>{ const b=el('button','lv',l); b.style.fontSize='15px'; b.style.padding='0 12px'; b.setAttribute('aria-pressed',String(S.frase===v)); b.onclick=()=>{ S.frase=v; save(); render(); }; fr.appendChild(b); });
  const so=$('solo'); so.innerHTML=''; [[false,'No, con l’adulto'],[true,'Sì, da solo']].forEach(([v,l])=>{ const b=el('button','lv',l); b.style.fontSize='15px'; b.style.padding='0 12px'; b.setAttribute('aria-pressed',String(S.solo===v)); b.onclick=()=>{ S.solo=v; save(); render(); }; so.appendChild(b); });
  $('fraseTip').textContent=S.frase?'La risposta è già nella frase: aiuta l’ascolto e la memoria, ma il bambino può ripetere senza capire la domanda. Toglila appena può.':'Di serie no: il bambino deve capire la domanda guardando la scena. La frase prima è un aiuto in più, da usare per poco tempo.';
  const lb=$('levels'); lb.innerHTML=''; [1,2,3,4].forEach(n=>{ const b=el('button','lv',String(n)); b.setAttribute('aria-pressed',String(S.lv===n)); b.onclick=()=>{ S.lv=n; save(); block=[]; render(); }; lb.appendChild(b); });
  $('lvinfo').innerHTML='<b>'+LV[S.lv].t+'</b><br>🕒 <i>Quando:</i> '+LV[S.lv].when+(S.lv<4?'<br>➡️ <i>Per passare:</i> '+LV[S.lv].next:'');
  if(opts.mode!=='parent') next(); }
/* ── una prova ── */
function next(){ hush(); const my=alive, st=$('stage'); st.innerHTML='';
  if(block.length>=4) return blockEnd();
  const dots=el('div','dots'); for(let i=0;i<4;i++) dots.appendChild(el('span',i<block.length?(block[i]==='ok'?'ok':block[i]==='aiuto'?'mid':'ko'):i===block.length?'on':''));
  st.appendChild(dots);
  const pool=S.lv===1?CHI.filter(z=>z.obj):CHI, c=pool[rnd(pool.length)]; let opts=null, script, sceneHTML;   // al livello 1 serve anche la cosa (l’oggetto)
  if(S.lv===1){ const obj=c.obj; script='«'+c.q.replace('?','')+'? '+(isName(c.subj)?c.subj:low(c.subj))+' o '+low(obj||'la casa')+'?»'; opts=shuffle([[c.subj,true],[obj||'la casa',false]]); sceneHTML=sceneSvg(c.x); trial={c}; }
  else if(S.lv===2){ let d; do{ d=CHI[rnd(CHI.length)]; }while(d===c||low(d.subj)===low(c.subj)||d.rest.split(' ')[0]===c.rest.split(' ')[0]);
    const pair=shuffle([c,d]); script='«'+c.q.replace('?','')+'? '+pair.map(z=>isName(z.subj)?z.subj:low(z.subj)).join(' o ')+'?»'; opts=pair.map(z=>[z.subj,z===c]);
    sceneHTML='<div class="two">'+pair.map(z=>'<div>'+sceneSvg(z.x)+'</div>').join('')+'</div>'; trial={c}; }
  else { script=(S.lv===3?'«Guarda… ':'«')+low(c.q)+'»'; if(S.lv===4) script='«'+c.q+'»'; sceneHTML=sceneSvg(c.x); trial={c};
    if(S.solo){ let d; do{ d=CHI[rnd(CHI.length)]; }while(low(d.subj)===low(c.subj)); opts=shuffle([[c.subj,true],[d.subj,false]]); } }
  st.appendChild(el('div','scene',sceneHTML));
  if(S.frase&&S.lv<4) st.appendChild(el('div','frase',esc(c.full)));
  st.appendChild(el('div','q','<span class="w"><span class="wi">👤</span>Chi</span>'+esc(script.replace(/[«»]/g,'').replace(/^Guarda… chi/,'').replace(/^Chi/,''))));
  const pause=el('div','pause'); st.appendChild(pause);
  const say=el('button','btn blue','🔊 Ascolta la domanda'); say.onclick=()=>ask();
  async function ask(){ if(S.frase&&S.lv<4){ await speak(c.full); await wait(500); if(my!==alive) return; } await speak(script.replace(/[«»]/g,'')); if(my!==alive) return; for(let s=5;s>0;s--){ pause.textContent='⏳ '+'● '.repeat(s); await wait(1000); if(my!==alive) return; } pause.textContent=''; }
  if(opts){ const box=el('div','opts'); opts.forEach(([t,ok])=>{ const b=el('button','opt',esc(t)); b.onclick=()=>mark(ok?'ok':'caso',b); box.appendChild(b); }); st.appendChild(box);
  }
  st.appendChild(say);
  const adult=el('div','adult'); adult.appendChild(el('span','sub','Per l’adulto')); if(S.solo) adult.hidden=true;
  if(S.lv===3){ const h=el('button','btn help','💡 Aiuto: l’iniziale'); h.onclick=()=>{ const w=(isName(c.subj)?c.subj:low(c.subj)); const part=w.slice(0,Math.max(4,Math.ceil(w.length/2))); h.textContent='«È '+part+'…»'; speak('È '+part); trial.help=true; }; adult.appendChild(h); }
  const r=el('div','row'); [['ok','✅ Giusta'],['aiuto','🤏 Con aiuto'],['caso','🎲 A caso / sbagliata']].forEach(([k,l])=>{ const b=el('button','mk '+k,l); b.onclick=()=>mark(k); r.appendChild(b); }); adult.appendChild(r); st.appendChild(adult);
  ask(); }
/* il modellaggio: sempre, con l'articolo, senza correggere */
async function mark(k,btn){ const my=alive; if(k==='ok'&&trial.help) k='aiuto'; block.push(k); if(btn) btn.classList.add(k==='ok'?'right':'wrong');
  const st=$('stage'); const m=el('div','model','💬 <b>Modellaggio</b>: «'+esc(model(trial.c).replace(' · ','» / «'))+'»'); st.appendChild(m);
  await speak(model(trial.c).replace(' · ','. ')); if(my!==alive) return;
  const last2=block.slice(-2); if(last2.length===2&&last2.every(x=>x==='caso')) return twoRandom();
  await wait(500); if(my!==alive) return; next(); }
/* due volte a caso di fila: si scende di livello, o si fa un commento senza domanda */
function twoRandom(){ const st=$('stage'); const w=el('div','warn','⚠️ <b>Due risposte a caso di fila.</b> Meglio fermarsi: scendi di un livello, oppure fai un commento senza domanda («Guarda, il cane dorme!»).');
  const r=el('div','row'); if(S.lv>1){ const d=el('button','btn','⬇️ Scendi al livello '+(S.lv-1)); d.onclick=()=>{ log('giù'); S.lv--; save(); block=[]; render(); }; r.appendChild(d); }
  const c=el('button','btn','💬 Commento senza domanda'); c.onclick=()=>{ const z=CHI[rnd(CHI.length)]; st.innerHTML=''; st.append(el('div','scene',sceneSvg(z.x)),el('div','model','💬 «Guarda! '+esc(z.full)+'»')); speak('Guarda! '+z.full); const g=el('button','btn main','Riprendiamo'); g.onclick=()=>{ block=[]; next(); }; st.appendChild(g); }; r.appendChild(c);
  w.appendChild(r); st.appendChild(w); }
/* fine del blocco (massimo 4 prove): il criterio per passare al livello dopo */
function blockEnd(){ __win&&__win(); const st=$('stage'), ok=block.filter(x=>x==='ok').length, caso=block.filter(x=>x==='caso').length, aiuto=block.filter(x=>x==='aiuto').length;
  log(ok+'/4'); st.appendChild(el('p','ask','Fine del blocco: '+ok+' giuste su 4'+(aiuto?', '+aiuto+' con aiuto':'')+(caso?', '+caso+' a caso':'')+'.'));
  const met=S.lv===1||S.lv===2?ok>=3&&caso===0:S.lv===3?ok+aiuto>=3&&caso===0:false;
  if(met&&S.lv<4){ const was=S.status[S.lv]; S.status[S.lv]=was==='cons'?'ok':'cons'; save(); $('status').textContent=statusLine();
    st.appendChild(el('div','good',was==='cons'?'🎉 Criterio raggiunto di nuovo: il livello '+S.lv+' è consolidato.':'🌱 Criterio raggiunto: «in consolidamento». Ripeti in un’altra seduta prima di passare.'));
    const b=el('button','btn main','➡️ Passa al livello '+(S.lv+1)); b.onclick=()=>{ log('su'); S.lv++; save(); block=[]; render(); }; st.appendChild(b); }
  else if(S.lv<4) st.appendChild(el('p','sub','Per passare: '+LV[S.lv].next));
  const a=el('button','btn','🔄 Un altro blocco'); a.onclick=()=>{ block=[]; next(); }; st.appendChild(a); }
function log(what){ S.hist=[...S.hist.slice(-19),{d:new Date().toLocaleDateString('it-IT',{day:'numeric',month:'short'}),lv:S.lv,what}]; save(); hist(); }
function hist(){ $('hist').innerHTML=S.hist.length?S.hist.slice().reverse().map(h=>'<span>'+h.d+' · L'+h.lv+' · '+(h.what==='su'?'⬆️ passato al livello dopo':h.what==='giù'?'⬇️ sceso di livello':'blocco '+h.what)+'</span>').join(''):'<span>Ancora nessun blocco.</span>'; }
if(opts.mode==='parent'){ $('stage').hidden=true; $('parent').hidden=false; }
else { $('parent').hidden=!opts.allowSettings; }
hist(); render();
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
