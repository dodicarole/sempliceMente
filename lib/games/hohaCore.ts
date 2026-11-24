// @ts-nocheck
/*
 * ✊ Ho o o? Ha o a? La H che non si sente: la prova del cambio (avevo/aveva/avevano), la mano chiusa ✊ e aperta 🖐️,
 * i disegni (personaggi a figura intera per ha/ho/hanno, il punto di domanda per "o", la freccia per "a"),
 * 110 frasi scritte + quelle costruite, il mazzo senza ripetizioni, i ripassi e le frasi della scuola.
 * Lo stesso codice del prototipo già provato, dentro un contenitore con la classe "smh".
 * Mazzo, ripassi, frasi della scuola e impostazioni sono per figlio (chiavi hoha_* in lib/childStore.ts).
 */
export interface HohaOptions { mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void }
export const HOHA_CSS = ".smh{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#5468D8;--radius:22px;--h:#E8590C;--h-bg:#FFF0E6;--no:#1C7ED6;--no-bg:#E7F5FF;\n  box-sizing:border-box}\n\n.smh *{box-sizing:border-box}\n.smh{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smh button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation}\n.smh button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smh [hidden]{display:none!important}\n.smh .app{max-width:540px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smh .title{background:var(--card);border-radius:var(--radius);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smh .title .l{display:flex;align-items:center;gap:12px}\n.smh .title .em{font-size:36px}\n.smh .title h1{margin:0;font-size:22px;font-weight:900}\n.smh .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smh .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.smh .buddy{display:flex;align-items:center;gap:10px;background:none;border:none;padding:0;text-align:left}\n.smh .buddy .av{width:50px;height:50px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:24px;border:3px solid #F08C00;background:#fff}\n.smh .buddy .bb{background:var(--card);border-radius:16px;padding:10px 14px;font-size:15px;font-weight:700;line-height:1.35}\n.smh .buddy .bb b{display:block;font-size:13px;font-weight:900;color:#F08C00}\n.smh .levels{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}\n.smh .lv{min-height:56px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:15px;font-weight:900;line-height:1.15}\n.smh .lv[aria-current=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smh .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.smh .ask{margin:0;font-size:20px;font-weight:900;line-height:1.3}\n.smh .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smh .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.smh .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smh .btn.yellow{background:#FFC93C;border-color:#FFC93C;color:#3D2E00}\n.smh .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;width:100%}\n.smh .dots{display:flex;gap:6px}\n.smh .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.smh .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.smh .dots .ok{background:var(--done)}\n.smh .dots .ko{background:#FFA94D}\n.smh /* la frase */\n.sent{font-size:30px;font-weight:900;line-height:1.5;min-height:94px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0 .3em}\n.smh.big .sent{font-size:28px;text-transform:uppercase;letter-spacing:.04em}\n.smh .gap{display:inline-flex;min-width:2.6em;justify-content:center;border-bottom:5px solid var(--blue);color:var(--blue);padding:0 .1em}\n.smh .gap.h{color:var(--h);border-color:var(--h)}\n.smh .gap.no{color:var(--no);border-color:var(--no)}\n.smh .test{background:#FFF6D6;color:#3D2E00;border-radius:16px;padding:10px 14px;width:100%;display:flex;flex-direction:column;gap:6px}\n.smh .test .tx{font-size:22px;font-weight:900;line-height:1.4}\n.smh .test .sw{background:#FFE066;border-radius:8px;padding:0 6px}\n.smh .test .q{font-size:15px;font-weight:800}\n.smh /* le due risposte */\n.answers{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%}\n.smh .ans{min-height:120px;border-radius:22px;border:4px solid var(--line);background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;box-shadow:0 6px 0 var(--line)}\n.smh .ans .w{font-size:40px;font-weight:900;line-height:1}\n.smh .ans .w .hh{color:var(--h)}\n.smh .ans .hand{font-size:30px;line-height:1}\n.smh .ans small{font-size:13px;font-weight:800;color:var(--soft)}\n.smh .ans.isH{border-color:color-mix(in srgb,var(--h) 45%,var(--line))}\n.smh .ans.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 6px 0 #2F8A5A}\n.smh .ans.right .w .hh,.smh .ans.right small{color:#fff}\n.smh .wrong{animation:wiggle .4s}\n.smh .why{width:100%;border-radius:16px;padding:10px 14px;font-size:16px;font-weight:800;line-height:1.45;text-align:left}\n.smh .why.h{background:var(--h-bg)}\n.smh .why.no{background:var(--no-bg)}\n.smh /* la scheda del trucco */\n.rule{background:var(--card);border-radius:var(--radius);padding:14px 16px;display:flex;flex-direction:column;gap:10px}\n.smh .rule summary{font-size:17px;font-weight:900;cursor:pointer;list-style:none}\n.smh .rule summary::-webkit-details-marker{display:none}\n.smh .pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}\n.smh .pbox{border-radius:16px;padding:10px;display:flex;flex-direction:column;gap:4px;font-size:15px;font-weight:700;line-height:1.4}\n.smh .pbox b{font-size:24px}\n.smh .pbox.h{background:var(--h-bg)}\n.smh .pbox.h b{color:var(--h)}\n.smh .pbox.no{background:var(--no-bg)}\n.smh .pbox.no b{color:var(--no)}\n.smh .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.smh .set{display:flex;flex-direction:column;gap:8px}\n.smh .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.smh .chips{display:flex;gap:8px;flex-wrap:wrap}\n.smh .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.smh .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n.smh .in{width:100%;min-height:48px;border-radius:12px;border:2px solid var(--line);background:var(--ground);padding:0 12px;font-size:16px;font-weight:700;font-family:inherit;color:var(--text)}\n.smh .recap button{border:none;background:none;font-size:16px;float:right}\n.smh .scene{width:100%;min-height:170px;border-radius:22px;background:linear-gradient(180deg,#E3F0FC,#FFF6E6);display:flex;align-items:center;justify-content:center;gap:14px;padding:12px;position:relative}\n.smh .scene .who{font-size:78px;line-height:1;position:relative;display:inline-block}\n.smh .scene .who{margin-right:40px}\n.smh .scene .fig{width:100%;max-width:340px;height:auto;overflow:visible}\n.smh /* l'oggetto \"in mano\": sopra il pugno,.smh accanto alla persona */\n.scene .held{position:absolute;right:-52px;bottom:22px;font-size:46px;line-height:1;z-index:2;filter:drop-shadow(0 3px 0 rgba(0,0,0,.12))}\n.smh .scene .fist{position:absolute;right:-40px;bottom:-4px;font-size:30px;z-index:1}\n.smh .scene .bubble{position:absolute;right:-60px;top:-18px;background:#fff;border-radius:999px;padding:6px 10px;font-size:34px;line-height:1;box-shadow:0 3px 0 rgba(31,33,71,.12)}\n.smh .scene .bubble::after{content:'';position:absolute;left:6px;bottom:-8px;width:12px;height:12px;border-radius:50%;background:#fff}\n.smh .scene .item{font-size:62px;line-height:1;background:#fff;border-radius:20px;padding:10px 14px;box-shadow:0 4px 0 rgba(31,33,71,.1)}\n.smh .scene .q{font-size:54px;font-weight:900;color:var(--no)}\n.smh .scene .arrow{font-size:46px;color:var(--no);font-weight:900}\n.smh .scene .plain{font-size:64px;line-height:1.1;letter-spacing:6px}\n.smh .star{font-size:64px;animation:pop .5s ease-out}\n.smh .recap{width:100%;display:flex;flex-direction:column;gap:6px;text-align:left}\n.smh .recap div{background:var(--ground);border-radius:12px;padding:8px 12px;font-size:16px;font-weight:800}\n.smh .recap .k{color:var(--h)}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.smh *{animation:none!important;transition:none!important}}"
export function mountHoha(root: HTMLElement, opts: HohaOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left\">Impostazioni (area genitore)</div>\n    <div class=\"set\"><span>🖼️ Il disegno sopra la frase</span><div class=\"chips\" data-key=\"pics\"></div></div>\n    <div class=\"set\"><span>🔄 La prova del cambio</span><div class=\"chips\" data-key=\"test\"></div></div>\n    <div class=\"set\"><span>✍️ Come sono scritte le frasi</span><div class=\"chips\" data-key=\"caps\"></div></div>\n    <div class=\"set\"><span>🔢 Quante frasi per giro</span><div class=\"chips\" data-key=\"n\"></div></div>\n    <div class=\"set\"><span>✏️ Le frasi della scuola: scrivi una frase, poi tocca la parola da nascondere</span>\n      <input data-k=\"mineIn\" class=\"in\" placeholder=\"Per esempio: Marta ha un libro.\">\n      <input data-k=\"minePic\" class=\"in\" placeholder=\"Disegno (facoltativo): per esempio 👧+📕  oppure  📕?🍊\">\n      <div class=\"chips\" data-k=\"mineWords\"></div>\n      <div data-k=\"mineList\" class=\"recap\"></div>\n    </div>\n    \n  </section>\n  <details class=\"rule\" data-k=\"rule\">\n    <summary>📌 Il trucco (tocca per aprire)</summary>\n    <p class=\"sub\" style=\"margin:0\">Con l'<b>H</b> è il verbo <b>avere</b>: ✊ <i>ho qualcosa in mano!</i> Allora prova a cambiarla:</p>\n    <div class=\"pair\">\n      <div class=\"pbox h\"><b>✊ ho · ha · hanno</b>si può dire <b>avevo · aveva · avevano</b><span><i>Io <u>ho</u> fame → Io <u>avevo</u> fame</i> ✅</span></div>\n      <div class=\"pbox no\"><b>🖐️ o · a · anno</b>con <i>avevo</i> la frase suona strana<span><i>Vado <u>a</u> scuola → Vado <u>aveva</u> scuola</i> ❌</span></div>\n    </div>\n    <p class=\"sub\" style=\"margin:0\">💡 <b>o</b> vuol dire <b>oppure</b> · <b>anno</b> sono i 12 mesi</p>\n  </details>\n  <nav class=\"levels\" data-k=\"levels\"></nav>\n  <section class=\"card\" data-k=\"stage\"></section>"
const __win = opts.onWin
const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };

/* ── Le frasi: [prima, parola giusta, dopo]. Le parole con l'H si cambiano con avevo/aveva/avevano ── */
const BANK={
  ha:[['Luca','ha','un cane.'],['Vado','a','scuola.'],['La nonna','ha','fatto la torta.'],['Domani andiamo','a','Roma.'],['Sara','ha','gli occhi blu.'],['Do il libro','a','Marco.'],
      ['Il gatto','ha','fame.'],['Torno','a','casa alle sei.'],['Tedo','ha','quattro amici.'],['Giochiamo','a','palla.'],['La maestra','ha','detto bravo.'],['Penso','a','te.'],
      ['Amina','ha','paura dei tuoni.'],['Il papà','ha','preparato la cena.'],['Nico','ha','le cuffie blu.'],['Andiamo','a','vedere il mare.'],['Il cane','ha','sete.'],['Scrivo una lettera','a','Lila.'],
      ['La mamma','ha','un vestito nuovo.'],['Il bambino','ha','sonno.'],['Elio','ha','vinto la gara.'],['Vado','a','dormire presto.'],['Lila','ha','un fiore in mano.'],['Regalo un disegno','a','papà.'],
      ['Il nonno','ha','la barba bianca.'],['Domenica vado','a','trovare la zia.'],['Zoe','ha','perso il turno.'],['Il treno arriva','a','mezzogiorno.'],['Meky','ha','rotto la tazza.'],['Imparo','a','nuotare.'],
      ['La gallina','ha','fatto un uovo.'],['Mi siedo','a','tavola.'],['Chi','ha','preso la mia gomma?'],['Il film comincia','a','luglio.'],['Il riccio','ha','tante spine.'],['Cammino','a','piedi.'],
      ['Mio fratello','ha','sei anni.'],['Andiamo','a','giocare al parco.'],['La bici','ha','due ruote.'],['Telefono','a','nonna Rosa.']],
  ho:[['Io','ho','sete.'],['Vuoi il succo','o','l\'acqua?'],['','Ho','perso la matita.'],['Giochi a calcio','o','a basket?'],['Io','ho','finito i compiti.'],['Prendi la penna rossa','o','quella blu?'],
      ['Oggi','ho','la verifica.'],['Mangi la mela','o','la pera?'],['Non','ho','paura del buio.'],['Vuoi uno','o','due biscotti?'],['Io','ho','un fratello piccolo.'],['Vieni oggi','o','domani?'],
      ['','Ho','mal di pancia.'],['Preferisci il mare','o','la montagna?'],['Io','ho','un gatto nero.'],['Leggiamo','o','disegniamo?'],['Ieri','ho','visto un arcobaleno.'],['Ti piace di più il rosso','o','il giallo?'],
      ['Non','ho','capito la domanda.'],['Usciamo','o','restiamo a casa?'],['Io','ho','tanta fame.'],['Vuoi la pizza','o','la pasta?'],['','Ho','fatto un bel sogno.'],['È un gatto','o','un cane?'],
      ['Io','ho','due nonne.'],['Mettiamo il cappello','o','la sciarpa?'],['Oggi','ho','il compleanno!'],['Sei stanco','o','vuoi giocare?'],['Io','ho','il raffreddore.'],['Scegli la storia','o','il fumetto?'],
      ['','Ho','dimenticato lo zaino.'],['Vai in bici','o','a piedi?'],['Io','ho','un amico speciale.'],['Mangiamo adesso','o','dopo?'],['Non','ho','più sonno.'],['Vuoi la fragola','o','il cioccolato?'],
      ['Io','ho','imparato una poesia.'],['Ti siedi qui','o','là?'],['Stamattina','ho','fatto colazione.'],['È lunedì','o','martedì?']],
  hanno:[['I bambini','hanno','fame.'],['Quest\'','anno','vado in terza.'],['Le maestre','hanno','una sorpresa.'],['Il compleanno arriva una volta all\'','anno','.'],['I gatti','hanno','i baffi.'],
      ['L\'','anno','prossimo andrò al mare.'],['Elio e Nico','hanno','vinto.'],['Un','anno','ha dodici mesi.'],['I miei amici','hanno','un pallone nuovo.'],['Capodanno è il primo giorno dell\'','anno','.'],
      ['I nonni','hanno','un giardino grande.'],['L\'','anno','scorso ero in seconda.'],['Gli uccellini','hanno','fatto il nido.'],['Ogni','anno','andiamo dalla zia.'],['I pesci','hanno','le pinne.'],
      ['Quest\'','anno','ho una maestra nuova.'],['Lila e Zoe','hanno','paura dei ragni.'],['Il mio','anno','preferito è stato bellissimo.'],['Le giraffe','hanno','il collo lungo.'],['Tra un','anno','avrò nove anni.'],
      ['I miei genitori','hanno','lavorato tanto.'],['Le api','hanno','fatto il miele.'],['Buon','anno','a tutti!'],['I cani','hanno','abbaiato forte.'],['A fine','anno','facciamo la festa.'],
      ['Le stelle','hanno','brillato tutta la notte.'],['L\'','anno','nuovo comincia a gennaio.'],['I compagni','hanno','giocato con me.'],['Questo','anno','è volato via.'],['Le rane','hanno','saltato nello stagno.']],
};
/* il disegno sopra ogni frase: "A+B" = A tiene in mano B (✊ verbo avere) · "A~B" = A pensa o sente B ·
   "A>B" = A va verso B (o dà a B) · "A?B" = A oppure B · altrimenti una piccola scena */
const PICS={ha:["F|boy|beside|🐶", "🧒>🏫", "F|granny|hold|🎂", "👨‍👩‍👧>🏛️", "F|girl|wave||eyes", "📕>👦", "A|🐱|hungry", "🧒>🏠", "🐸+👫", "👫>⚽", "F|teacherW|thumb|👍", "🧒~💭", "F|girl2|scared|⛈️", "F|man|hold|🍝", "F|boy2|wave||phones", "👫>🌊", "A|🐶|thirsty", "✉️>👧", "F|woman|proud||dress", "F|boy|sleepy", "F|boy|cheer|🏆", "🧒>🛏️", "F|girl|hold|🌸", "🖼️>👨", "F|grandpa|wave||beard", "🧒>👩‍🦰", "F|girl3|sad", "🚆>🕛", "F|boy3|oops|☕", "🧒>🏊", "🐔+🥚", "🧒>🍽️", "F|girl|think|✏️", "🎬>📅", "🦔 🌵", "🚶>👣", "F|boy|hold|🎂", "👫>🛝", "🚲 2️⃣", "📞>👵"],ho:["F|boy|thirsty", "🧃?💧", "F|girl|lost|✏️", "⚽?🏀", "F|boy|cheer|📒", "🖍️?🖊️", "F|girl|worried|📝", "🍎?🍐", "F|boy|proud|🌙", "🍪?🍪🍪", "F|girl|beside|👶", "☀️?🌙", "F|boy|tummy", "🏖️?🏔️", "F|girl|beside|🐈‍⬛", "📖?🎨", "F|boy|point|🌈", "🟥?🟨", "F|girl|confused", "🌳?🏠", "F|boy|hungry", "🍕?🍝", "F|girl|dream|🦄", "🐱?🐶", "F|boy3|beside|👵👵", "🧢?🧣", "F|girl|cheer|🎂", "😴?⚽", "F|boy|sick", "📖?🗯️", "F|girl|forgot|🎒", "🚲?🚶", "K|boy,girl2|friends", "🍽️?⏰", "F|boy|cheer|☀️", "🍓?🍫", "F|girl|hold|📜", "👇?👉", "F|boy|hold|🥐", "📅?📅"],hanno:["K|boy,girl|hungry", "📅>3️⃣", "K|teacherW,teacherW2|hold|🎁", "🎂 📅", "🐱🐱 〰️", "📅>🏖️", "K|boy,boy2|cheer|🏆", "📅 1️⃣2️⃣", "K|boy,girl|hold|⚽", "🎆 📅", "K|grandpa,granny|beside|🌳", "📅 2️⃣", "🐦🐦+🪺", "📅>👩‍🦰", "🐟🐠 🌊", "📅 👩‍🏫", "K|girl,girl3|scared|🕷️", "📅 ⭐", "🦒🦒", "📅 9️⃣", "K|man,woman|sleepy", "🐝🐝+🍯", "🎉 📅", "🐶🐶~🔊", "📅>🎉", "⭐⭐~🌙", "📅>❄️", "K|boy,girl|friends", "📅~💨", "🐸🐸>💦"]};
for(const k of ['ha','ho','hanno']) BANK[k].forEach((f,i)=>{ f[3]=PICS[k][i]; });
/* ── le frasi che si costruiscono da sole: nomi, cose, luoghi, scelte ── */
const NAMES=[['Luca','👦','boy'],['Sara','👧','girl'],['Elio','👦','boy'],['Lila','👧','girl'],['Nico','👦🏻','boy2'],['Zoe','👧🏾','girl3'],['Amina','👧🏽','girl2'],['Meky','🧒','boy3'],['La nonna','👵','granny'],['Il papà','👨','man'],['La mamma','👩','woman'],['Il maestro','👨‍🏫','teacherM']];
const THINGS=[['uno zaino rosso','🎒'],['un cappello giallo','👒'],['una bici nuova','🚲'],['un libro di storie','📕'],['un gattino','🐱'],['una sciarpa a righe','🧣'],['un aquilone','🪁'],['una torta al cioccolato','🎂'],['due pesci rossi','🐟🐟'],['una matita verde','✏️'],['un pallone','⚽'],['una collana di perle','📿'],['un\'arancia','🍊'],['un ombrello','☂️']];
const PLACES=[['scuola','🏫'],['casa','🏠'],['Milano','🏙️'],['dormire','🛏️'],['giocare','🛝'],['nuotare','🏊'],['pranzo dalla nonna','👵'],['fare la spesa','🛒'],['vedere il mare','🌊'],['letto presto','🛏️']];
const GAMES=[['nascondino','🙈'],['palla','⚽'],['carte','🃏'],['memory','🧠'],['calcio','⚽'],['scacchi','♟️']];
const CHOICES=[[['la mela','🍎'],['la pera','🍐']],[['il latte','🥛'],['il succo','🧃']],[['il gelato','🍦'],['la torta','🍰']],[['il cane','🐶'],['il gatto','🐱']],[['la bici','🚲'],['il monopattino','🛴']],[['il rosso','🟥'],['il blu','🟦']],[['le carote','🥕'],['i piselli','🫛']],[['la pizza','🍕'],['il panino','🥪']],[['il mare','🏖️'],['la piscina','🏊']],[['il libro','📕'],['le arance','🍊🍊']]];
const PLURAL=[['I bambini','👧👦','boy,girl'],['Le mie amiche','👧👧🏽','girl,girl2'],['I nonni','👴👵','grandpa,granny'],['Gli zii','👨👩','man,woman'],['Elio e Lila','👦👧','boy,girl'],['Nico e Zoe','👦🏻👧🏾','boy2,girl3'],['I compagni','👫👫','boy3,girl']];
const pickR=a=>a[Math.floor(Math.random()*a.length)];
const BESIDE=['🚲','🐱','🐶','🐟🐟','🪁'];   // queste cose stanno accanto, non in mano
function generate(level){
  const T={
    ha:[()=>{ const n=pickR(NAMES), t=pickR(THINGS); return [n[0],'ha',t[0]+'.','F|'+n[2]+'|'+(BESIDE.includes(t[1])?'beside':'hold')+'|'+t[1]]; },()=>{ const n=pickR(NAMES), l=pickR(PLACES); return [n[0]+' va','a',l[0]+'.',n[1]+'>'+l[1]]; },()=>{ const n=pickR(NAMES), g=pickR(GAMES); return [n[0]+' gioca','a',g[0]+'.',n[1]+'>'+g[1]]; }],
    ho:[()=>{ const t=pickR(THINGS); return ['Io','ho',t[0]+'.','F|'+pickR(['boy','girl','boy3','girl2'])+'|'+(BESIDE.includes(t[1])?'beside':'hold')+'|'+t[1]]; },()=>{ const [x,y]=pickR(CHOICES); return ['Vuoi '+x[0],'o',y[0]+'?',x[1]+'?'+y[1]]; },()=>{ const [x,y]=pickR(CHOICES); return ['Preferisci '+x[0],'o',y[0]+'?',x[1]+'?'+y[1]]; }],
    hanno:[()=>{ const n=pickR(PLURAL), t=pickR(THINGS); return [n[0],'hanno',t[0]+'.','K|'+n[2]+'|'+(BESIDE.includes(t[1])?'beside':'hold')+'|'+t[1]]; }],
  };
  const lv=level==='tutto'?pickR(['ha','ho','hanno']):level;
  return pickR(T[lv])();
}

// la coppia di ogni parola, e la parola del cambio
const PAIR={ha:['ha','a'],a:['ha','a'],ho:['ho','o'],o:['ho','o'],hanno:['hanno','anno'],anno:['hanno','anno']};
const SWAP={ha:'aveva',a:'aveva',ho:'avevo',o:'avevo',hanno:'avevano',anno:'avevano'};
const hasH=w=>/^h/i.test(w);
const LEVELS=[['ha','ha · a'],['ho','ho · o'],['hanno','hanno · anno'],['tutto','Tutto insieme']];
let S=Object.assign({test:'sempre',caps:'min',n:8,pics:true},store('hoha_impostazioni',{}));
const OPT={pics:[[true,'Sì'],[false,'No']],test:[['sempre','Sempre visibile'],['errore','Dopo un errore'],['no','No']],caps:[['min','minuscolo'],['MAI','MAIUSCOLO']],n:[[6,'6'],[8,'8'],[10,'10']]};

const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function speak(t){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='it-IT'; u.rate=.85; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('it')); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1500+t.length*95); setTimeout(()=>speechSynthesis.speak(u),80); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
/* la frase intera (per la voce: ho e o si pronunciano uguali, quindi la voce non suggerisce niente) */
const join=(a,w,b)=>(a?(a.endsWith('\'')?a:a+' '):'')+w+(b==='.'?'.':' '+b);
const cap=w=>w.charAt(0).toUpperCase()+w.slice(1);
/* la parola scritta, con la H colorata */

/* ══ I personaggi, disegnati: corpo intero, viso che cambia con lo stato, braccia che cambiano con la posa ══ */
const WHO={
  boy:{skin:'#F5C9A0',hair:'#6B4226',style:'short',shirt:'#4C6EF5',legs:'#343A40'},
  boy2:{skin:'#F1C27D',hair:'#212529',style:'short',shirt:'#12B886',legs:'#495057'},
  boy3:{skin:'#C68642',hair:'#2B1B0E',style:'curly',shirt:'#FAB005',legs:'#1C3F94'},
  girl:{skin:'#F5C9A0',hair:'#D9A13B',style:'pony',shirt:'#E64980',legs:'#845EF7',skirt:true},
  girl2:{skin:'#8D5524',hair:'#1B1B1B',style:'puffs',shirt:'#7048E8',legs:'#343A40'},
  girl3:{skin:'#A0673C',hair:'#2B1B0E',style:'braids',shirt:'#FD7E14',legs:'#1C7ED6',skirt:true},
  man:{skin:'#E8B98F',hair:'#3B2A1A',style:'short',shirt:'#1C7ED6',legs:'#343A40',tall:true},
  woman:{skin:'#F1C27D',hair:'#5A3825',style:'long',shirt:'#C2255C',legs:'#495057',tall:true},
  granny:{skin:'#F2C9A6',hair:'#CED4DA',style:'bun',shirt:'#9C36B5',legs:'#5F3DC4',skirt:true,glasses:true},
  grandpa:{skin:'#EBC09A',hair:'#DEE2E6',style:'bald',shirt:'#5C7CFA',legs:'#495057',glasses:true},
  teacherW:{skin:'#F1C27D',hair:'#7F4F24',style:'bob',shirt:'#0CA678',legs:'#343A40',tall:true,glasses:true},
  teacherW2:{skin:'#F5C9A0',hair:'#C0392B',style:'bob',shirt:'#F59F00',legs:'#495057',tall:true},
  teacherM:{skin:'#C68642',hair:'#212529',style:'short',shirt:'#0B7285',legs:'#343A40',tall:true,glasses:true},
};
const EMO=(x,y,e,size)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" text-anchor="middle" dominant-baseline="central">'+e+'</text>';
/* un personaggio, con i piedi in basso al centro di (0,0); restituisce il disegno e dove sono le mani */
function figure(who,pose,extra){
  const c=WHO[who]||WHO.boy, ink='#2B2D42';
  const s=[]; const hy=-150;                         // il centro della testa
  // le gambe e il corpo
  s.push('<rect x="-17" y="-62" width="13" height="58" rx="6" fill="'+c.legs+'"/><rect x="4" y="-62" width="13" height="58" rx="6" fill="'+c.legs+'"/>');
  s.push('<ellipse cx="-11" cy="-4" rx="11" ry="6" fill="'+ink+'"/><ellipse cx="11" cy="-4" rx="11" ry="6" fill="'+ink+'"/>');
  if(c.skirt||extra==='dress') s.push('<path d="M-26 -112 Q0 -122 26 -112 L36 -52 Q0 -44 -36 -52 Z" fill="'+(extra==='dress'?'#F783AC':c.shirt)+'"/>');
  else s.push('<rect x="-28" y="-116" width="56" height="62" rx="16" fill="'+c.shirt+'"/>');
  if(extra==='dress') s.push('<path d="M-30 -70 Q0 -62 30 -70" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="3 7" stroke-linecap="round"/>');
  // le braccia: da (±24,-106) alla mano
  const H={hold:[[-34,-62],[44,-92]],beside:[[-34,-62],[44,-70]],belly:[[-10,-78],[10,-78]],cheer:[[-46,-168],[46,-168]],thumb:[[-34,-62],[46,-130]],
    scared:[[-26,-140],[26,-140]],oops:[[-14,-176],[36,-64]],think:[[-34,-62],[4,-122]],point:[[-34,-62],[48,-178]],wave:[[-34,-62],[46,-150]],proud:[[-30,-80],[30,-80]],down:[[-34,-62],[34,-62]]};
  const hand=H[pose]||H.down, elbow=(sx,hx,hy2)=>[(sx+hx)/2+(pose==='proud'?(hx<0?-22:22):0),(-106+hy2)/2+(pose==='proud'?6:0)];
  [[-24,hand[0]],[24,hand[1]]].forEach(([sx,[hx,hy2]])=>{ const [ex,ey]=elbow(sx,hx,hy2);
    s.push('<path d="M'+sx+' -106 Q'+ex+' '+ey+' '+hx+' '+hy2+'" stroke="'+c.shirt+'" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="'+hx+'" cy="'+hy2+'" r="8" fill="'+c.skin+'"/>'); });
  // la testa
  s.push('<circle cx="-30" cy="'+hy+'" r="7" fill="'+c.skin+'"/><circle cx="30" cy="'+hy+'" r="7" fill="'+c.skin+'"/><circle cx="0" cy="'+hy+'" r="31" fill="'+c.skin+'"/>');
  // i capelli
  const hr=c.hair;
  if(c.style==='short') s.push('<path d="M-31 '+(hy-4)+' Q-30 '+(hy-36)+' 0 '+(hy-36)+' Q30 '+(hy-36)+' 31 '+(hy-4)+' Q20 '+(hy-22)+' 0 '+(hy-20)+' Q-20 '+(hy-22)+' -31 '+(hy-4)+' Z" fill="'+hr+'"/>');
  if(c.style==='curly') s.push([[-22,-24],[-8,-31],[8,-31],[22,-24],[-28,-10],[28,-10]].map(([x,y])=>'<circle cx="'+x+'" cy="'+(hy+y)+'" r="11" fill="'+hr+'"/>').join(''));
  if(c.style==='pony') s.push('<path d="M-32 '+hy+' Q-34 '+(hy-38)+' 0 '+(hy-37)+' Q34 '+(hy-38)+' 32 '+hy+' Q18 '+(hy-20)+' -4 '+(hy-22)+' Q-22 '+(hy-18)+' -32 '+hy+' Z" fill="'+hr+'"/><path d="M28 '+(hy-26)+' Q58 '+(hy-14)+' 44 '+(hy+26)+' Q40 '+(hy-2)+' 26 '+(hy-12)+' Z" fill="'+hr+'"/><circle cx="30" cy="'+(hy-22)+'" r="5" fill="#F783AC"/>');
  if(c.style==='long') s.push('<path d="M-33 '+(hy+34)+' Q-40 '+(hy-40)+' 0 '+(hy-37)+' Q40 '+(hy-40)+' 33 '+(hy+34)+' L24 '+(hy+34)+' Q26 '+(hy-14)+' 0 '+(hy-22)+' Q-26 '+(hy-14)+' -24 '+(hy+34)+' Z" fill="'+hr+'"/>');
  if(c.style==='puffs') s.push('<circle cx="-28" cy="'+(hy-26)+'" r="14" fill="'+hr+'"/><circle cx="28" cy="'+(hy-26)+'" r="14" fill="'+hr+'"/><path d="M-30 '+(hy-6)+' Q-28 '+(hy-34)+' 0 '+(hy-34)+' Q28 '+(hy-34)+' 30 '+(hy-6)+' Q0 '+(hy-22)+' -30 '+(hy-6)+' Z" fill="'+hr+'"/>');
  if(c.style==='braids') s.push('<path d="M-31 '+(hy-2)+' Q-30 '+(hy-36)+' 0 '+(hy-36)+' Q30 '+(hy-36)+' 31 '+(hy-2)+' Q0 '+(hy-24)+' -31 '+(hy-2)+' Z" fill="'+hr+'"/><path d="M-33 '+hy+' q-6 16 0 30 q-6 10 0 22" stroke="'+hr+'" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M33 '+hy+' q6 16 0 30 q6 10 0 22" stroke="'+hr+'" stroke-width="9" fill="none" stroke-linecap="round"/>');
  if(c.style==='bun') s.push('<circle cx="0" cy="'+(hy-38)+'" r="13" fill="'+hr+'"/><path d="M-32 '+hy+' Q-32 '+(hy-34)+' 0 '+(hy-34)+' Q32 '+(hy-34)+' 32 '+hy+' Q20 '+(hy-18)+' 0 '+(hy-20)+' Q-20 '+(hy-18)+' -32 '+hy+' Z" fill="'+hr+'"/>');
  if(c.style==='bald') s.push('<path d="M-31 '+(hy+4)+' Q-34 '+(hy-18)+' -22 '+(hy-22)+' L-20 '+(hy-6)+' Z M31 '+(hy+4)+' Q34 '+(hy-18)+' 22 '+(hy-22)+' L20 '+(hy-6)+' Z" fill="'+hr+'"/>');
  if(c.style==='bob') s.push('<path d="M-34 '+(hy+16)+' Q-38 '+(hy-38)+' 0 '+(hy-37)+' Q38 '+(hy-38)+' 34 '+(hy+16)+' L26 '+(hy+16)+' Q28 '+(hy-14)+' 0 '+(hy-22)+' Q-28 '+(hy-14)+' -26 '+(hy+16)+' Z" fill="'+hr+'"/>');
  if(extra==='beard') s.push('<path d="M-24 '+(hy+6)+' Q-22 '+(hy+42)+' 0 '+(hy+44)+' Q22 '+(hy+42)+' 24 '+(hy+6)+' Q14 '+(hy+20)+' 0 '+(hy+18)+' Q-14 '+(hy+20)+' -24 '+(hy+6)+' Z" fill="#F1F3F5" stroke="#CED4DA" stroke-width="2"/>');
  if(extra==='phones') s.push('<path d="M-32 '+(hy-2)+' Q-32 '+(hy-44)+' 0 '+(hy-44)+' Q32 '+(hy-44)+' 32 '+(hy-2)+'" stroke="#1C7ED6" stroke-width="6" fill="none"/><rect x="-40" y="'+(hy-12)+'" width="14" height="22" rx="6" fill="#1C7ED6"/><rect x="26" y="'+(hy-12)+'" width="14" height="22" rx="6" fill="#1C7ED6"/>');
  // il viso: gli occhi, le sopracciglia e la bocca dicono come si sente
  const F=pose; const eye=(x,blue)=>'<circle cx="'+x+'" cy="'+(hy-2)+'" r="'+(blue?5:3.6)+'" fill="'+(blue?'#228BE6':ink)+'"/>'+(blue?'<circle cx="'+x+'" cy="'+(hy-2)+'" r="2.2" fill="'+ink+'"/>':'');
  const closed=x=>'<path d="M'+(x-6)+' '+(hy-1)+' Q'+x+' '+(hy+4)+' '+(x+6)+' '+(hy-1)+'" stroke="'+ink+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  const brows=(a)=>'<path d="M-17 '+(hy-15+a)+' L-6 '+(hy-12-a)+' M6 '+(hy-12-a)+' L17 '+(hy-15+a)+'" stroke="'+ink+'" stroke-width="3" stroke-linecap="round"/>';
  if(['sleepy','dream'].includes(F)) s.push(closed(-11)+closed(11));
  else if(F==='scared') s.push('<circle cx="-11" cy="'+(hy-2)+'" r="7" fill="#fff" stroke="'+ink+'" stroke-width="2"/><circle cx="11" cy="'+(hy-2)+'" r="7" fill="#fff" stroke="'+ink+'" stroke-width="2"/><circle cx="-11" cy="'+(hy-1)+'" r="3" fill="'+ink+'"/><circle cx="11" cy="'+(hy-1)+'" r="3" fill="'+ink+'"/>');
  else s.push(eye(-11,extra==='eyes')+eye(11,extra==='eyes'));
  if(['hungry','thirsty','worried','tummy','sick','lost','oops','forgot'].includes(F)) s.push(brows(-4));
  if(F==='confused') s.push('<path d="M-17 '+(hy-15)+' L-6 '+(hy-17)+' M6 '+(hy-20)+' L17 '+(hy-14)+'" stroke="'+ink+'" stroke-width="3" stroke-linecap="round"/>');
  const mouth={
    smile:'<path d="M-11 '+(hy+11)+' Q0 '+(hy+21)+' 11 '+(hy+11)+'" stroke="'+ink+'" stroke-width="3" fill="none" stroke-linecap="round"/>',
    big:'<path d="M-13 '+(hy+9)+' Q0 '+(hy+26)+' 13 '+(hy+9)+' Z" fill="#C92A2A"/>',
    wavy:'<path d="M-11 '+(hy+15)+' q4 -5 7 0 t7 0 t7 0" stroke="'+ink+'" stroke-width="3" fill="none" stroke-linecap="round"/>',
    o:'<ellipse cx="0" cy="'+(hy+15)+'" rx="5" ry="7" fill="#C92A2A"/>',
    yawn:'<ellipse cx="0" cy="'+(hy+15)+'" rx="7" ry="9" fill="#C92A2A"/>',
    tongue:'<path d="M-9 '+(hy+12)+' Q0 '+(hy+16)+' 9 '+(hy+12)+'" stroke="'+ink+'" stroke-width="3" fill="none"/><path d="M-4 '+(hy+14)+' Q0 '+(hy+26)+' 5 '+(hy+14)+' Z" fill="#F06595"/>',
    sad:'<path d="M-10 '+(hy+18)+' Q0 '+(hy+9)+' 10 '+(hy+18)+'" stroke="'+ink+'" stroke-width="3" fill="none" stroke-linecap="round"/>',
    side:'<path d="M-6 '+(hy+16)+' L10 '+(hy+12)+'" stroke="'+ink+'" stroke-width="3" stroke-linecap="round"/>',
  };
  const M={hungry:'o',thirsty:'tongue',scared:'o',sleepy:'yawn',dream:'smile',sad:'sad',worried:'wavy',tummy:'sad',sick:'sad',confused:'side',lost:'sad',oops:'o',forgot:'o',cheer:'big',proud:'big',think:'side'}[F]||'smile';
  s.push(mouth[M]);
  if(['sick','tummy'].includes(F)) s.push('<circle cx="-18" cy="'+(hy+8)+'" r="6" fill="#B2F2BB" opacity=".9"/><circle cx="18" cy="'+(hy+8)+'" r="6" fill="#B2F2BB" opacity=".9"/>');
  else s.push('<circle cx="-19" cy="'+(hy+8)+'" r="5" fill="#FF8787" opacity=".45"/><circle cx="19" cy="'+(hy+8)+'" r="5" fill="#FF8787" opacity=".45"/>');
  if(F==='sad') s.push('<path d="M-12 '+(hy+4)+' q-3 7 0 10 q3 -3 0 -10 Z" fill="#74C0FC"/>');
  if(c.glasses) s.push('<circle cx="-11" cy="'+(hy-2)+'" r="9" fill="none" stroke="'+ink+'" stroke-width="2.5"/><circle cx="11" cy="'+(hy-2)+'" r="9" fill="none" stroke="'+ink+'" stroke-width="2.5"/><path d="M-2 '+(hy-2)+' h4" stroke="'+ink+'" stroke-width="2.5"/>');
  return {svg:s.join(''), hand:hand[1], head:[0,hy], tall:!!c.tall};
}
/* gli stati: la posa delle braccia, e quello che compare intorno (fumetto, gocce, tremolio, Zzz…) */
const STATE={hungry:'belly',thirsty:'down',scared:'scared',sleepy:'down',dream:'down',sad:'down',worried:'hold',tummy:'belly',sick:'down',confused:'think',lost:'think',oops:'oops',forgot:'oops',cheer:'cheer',proud:'proud',think:'think',friends:'down'};
function around(state,item,x,head,hand){
  const [hx,hy]=[x+head[0],head[1]], o=[];
  const bubble=(e)=>'<g><circle cx="'+(hx+52)+'" cy="'+(hy-36)+'" r="26" fill="#fff" stroke="#D6DBF2" stroke-width="3"/><circle cx="'+(hx+30)+'" cy="'+(hy-10)+'" r="6" fill="#fff" stroke="#D6DBF2" stroke-width="2"/><circle cx="'+(hx+22)+'" cy="'+(hy+2)+'" r="3.5" fill="#fff" stroke="#D6DBF2" stroke-width="2"/>'+EMO(hx+52,hy-35,e,30)+'</g>';
  if(state==='hungry'){ o.push(bubble('🍽️')); o.push('<path d="M'+(x-40)+' -86 q-8 -4 -4 -12 M'+(x+40)+' -86 q8 -4 4 -12" stroke="#E8590C" stroke-width="3" fill="none" stroke-linecap="round"/><text x="'+(x+48)+'" y="-70" font-size="14" font-weight="900" fill="#E8590C">grr</text>'); }
  if(state==='thirsty'){ o.push(bubble('💧')); o.push('<path d="M'+(hx-34)+' '+(hy-24)+' q-6 10 0 14 q6 -4 0 -14 Z" fill="#74C0FC"/><path d="M'+(hx+36)+' '+(hy-6)+' q-5 8 0 11 q5 -3 0 -11 Z" fill="#74C0FC"/>'); }
  if(state==='scared'){ o.push('<path d="M'+(x-48)+' -150 l-8 6 8 6 -8 6 M'+(x+48)+' -150 l8 6 -8 6 8 6" stroke="#868E96" stroke-width="3" fill="none" stroke-linecap="round"/>'); if(item) o.push(EMO(x+92,-150,item,46)); }
  if(state==='sleepy'){ o.push('<text x="'+(hx+34)+'" y="'+(hy-30)+'" font-size="22" font-weight="900" fill="#5C7CFA">Z</text><text x="'+(hx+50)+'" y="'+(hy-48)+'" font-size="16" font-weight="900" fill="#5C7CFA">z</text>'); }
  if(state==='dream') o.push(bubble(item||'💭'));
  if(state==='confused') o.push(bubble('❓'));
  if(state==='lost') o.push(bubble(item||'❓')+'<text x="'+(hx+74)+'" y="'+(hy-58)+'" font-size="20" font-weight="900" fill="#E03131">?</text>');
  if(state==='think') o.push(bubble(item||'❓'));
  if(state==='tummy') o.push('<path d="M'+(x-10)+' -92 q10 -8 20 0 q-10 8 -20 0" stroke="#40C057" stroke-width="3" fill="none"/>');
  if(state==='sick') o.push(EMO(hx+44,hy+20,'🤧',28)+'<circle cx="'+(hx+40)+'" cy="'+(hy-40)+'" r="3" fill="#ADB5BD"/>');
  if(state==='oops'&&item) o.push(EMO(x+76,-18,item,36)+'<path d="M'+(x+62)+' -38 l8 -10 M'+(x+80)+' -44 v-12 M'+(x+94)+' -38 l8 -10" stroke="#E8590C" stroke-width="3" stroke-linecap="round"/>');
  if(state==='forgot'&&item) o.push(bubble(item)+'<text x="'+(hx-46)+'" y="'+(hy-30)+'" font-size="26" font-weight="900" fill="#E03131">!</text>');
  if(state==='proud'&&item) o.push(EMO(x+80,-120,item,40));
  return o.join('');
}
function personScene(kind,whoList,pose,item,extra){
  const people=whoList.split(','), n=people.length, W=320, base=206;
  const xs=n===1?[item&&['beside','hold','cheer','thumb','point','proud','scared','oops'].includes(pose)?120:160]:[96,212];
  let out='<svg viewBox="0 -10 '+W+' 228" class="fig" aria-hidden="true"><ellipse cx="160" cy="'+(base+2)+'" rx="150" ry="10" fill="#C7E9C0" opacity=".7"/>';
  people.forEach((w,i)=>{ const st=STATE[pose]?pose:null, p=st?STATE[pose]:pose, f=figure(w,p,extra), sc=(f.tall?1.14:1.04)*(n>1?0.88:1);
    out+='<g transform="translate('+xs[i]+' '+base+') scale('+sc+')">'+f.svg+'</g>';
    const hx=xs[i]+f.hand[0]*sc, hy=base+f.hand[1]*sc;
    if(item&&(p==='hold'||p==='cheer'&&i===0||p==='thumb'||p==='point')){ const yy=p==='cheer'?hy-22:p==='point'?hy-34:hy-18; if(i===0||pose==='hold') out+=EMO(hx+(p==='point'?34:6),yy,item,p==='point'?40:34); }
    if(st&&(i===n-1||['hungry','scared','sleepy','friends'].includes(pose))) out+='<g transform="translate(0 '+base+') scale(1)">'+around(st,(i===n-1?item:''),xs[i],[0,-150*sc],f.hand)+'</g>';
  });
  if(item&&pose==='beside') out+=EMO(n===1?228:300,base-24,item,n===1?58:44);
  if(pose==='friends') out+='<path d="M'+(xs[0]+30)+' 134 Q154 150 '+(xs[1]-30)+' 134" stroke="#F06595" stroke-width="5" fill="none" stroke-linecap="round"/>'+EMO(154,108,'💛',22);
  return out+'</svg>';
}
function animalScene(animal,state){
  const sym={hungry:['🥣',bubbleE('🍖')],thirsty:['🥣',bubbleE('💧')]}[state]||['',''];
  return '<svg viewBox="0 0 320 200" class="fig" aria-hidden="true"><ellipse cx="160" cy="190" rx="150" ry="10" fill="#C7E9C0" opacity=".7"/>'+EMO(130,124,animal,110)+(sym[0]?EMO(232,170,sym[0],40):'')+sym[1]+'</svg>';
}
function bubbleE(e){ return '<g><circle cx="230" cy="58" r="30" fill="#fff" stroke="#D6DBF2" stroke-width="3"/><circle cx="196" cy="88" r="7" fill="#fff" stroke="#D6DBF2" stroke-width="2"/>'+EMO(230,59,e,34)+'</g>'; }

/* il disegno di una frase, dalla sua descrizione breve */
function sceneHTML(pic){
  if(!pic) return '';
  if(/^[FK]\|/.test(pic)){ const [k,who,pose,item,extra]=pic.split('|'); return '<div class="scene">'+personScene(k,who,pose,item,extra)+'</div>'; }
  if(/^A\|/.test(pic)){ const [,an,st]=pic.split('|'); return '<div class="scene">'+animalScene(an,st)+'</div>'; }
  const m=pic.match(/^(.+?)([+~>?])(.+)$/u);
  if(!m) return '<div class="scene"><span class="plain">'+pic+'</span></div>';
  const [_,A,op,B]=m;
  if(op==='+') return '<div class="scene"><span class="who">'+A+'<span class="held">'+B+'</span><span class="fist">✊</span></span></div>';
  if(op==='~') return '<div class="scene"><span class="who">'+A+'<span class="bubble">'+B+'</span></span></div>';
  if(op==='>') return '<div class="scene"><span class="item">'+A+'</span><span class="arrow">➜</span><span class="item">'+B+'</span></div>';
  return '<div class="scene"><span class="item">'+A+'</span><span class="q">?</span><span class="item">'+B+'</span></div>';
}
const showWord=w=>hasH(w)?'<span class="hh">'+w[0]+'</span>'+w.slice(1):w;

const LEVEL_OF=w=>({ha:'ha',a:'ha',ho:'ho',o:'ho',hanno:'hanno',anno:'hanno'})[w.toLowerCase()];
/* tutte le frasi scritte di un livello, ognuna con il suo codice: quelle dell'app (w) e quelle del genitore (c) */
function written(level){
  const mine=store('hoha_mie',[]).map((f,i)=>({id:'c'+i,f:[f.a,f.w,f.b,f.pic||'']})).filter(x=>level==='tutto'||LEVEL_OF(x.f[1])===level);
  const lv=level==='tutto'?['ha','ho','hanno']:[level];
  return [...lv.flatMap(l=>BANK[l].map((f,i)=>({id:l+i,f}))),...mine];
}
/* il mazzo: le frasi si mescolano e si usano tutte una volta prima di ripeterle */
function draw(level,n){
  const all=written(level), byId=Object.fromEntries(all.map(x=>[x.id,x]));
  const decks=store('hoha_mazzo',{}); let d=decks[level]||{order:[],pos:0};
  const out=[];
  while(out.length<n){
    if(d.pos>=d.order.length||!d.order.every(id=>byId[id])){ d={order:shuffle(all.map(x=>x.id)),pos:0}; }
    const x=byId[d.order[d.pos++]]; if(x&&!out.some(o=>o.id===x.id)) out.push(x);
    if(all.length<=out.length) break;
  }
  decks[level]=d; keepS('hoha_mazzo',decks); return out;
}
/* le frasi sbagliate tornano dopo due giri */
function dueReviews(level){
  const r=store('hoha_ripasso',[]); r.forEach(x=>x.wait--); keepS('hoha_ripasso',r);
  return r.filter(x=>x.wait<=0&&(level==='tutto'||LEVEL_OF(x.f[1])===level)).slice(0,2);
}
function addReview(f){ const r=store('hoha_ripasso',[]); if(!r.some(x=>x.f.join('|')===f.join('|'))) r.push({f,wait:2}); keepS('hoha_ripasso',r.slice(-20)); }
function doneReview(f){ keepS('hoha_ripasso',store('hoha_ripasso',[]).filter(x=>x.f.join('|')!==f.join('|'))); }

let level='ha';
function play(){
  hush(); const my=alive; const st=$('stage');
  // un giro: prima i ripassi, poi (circa) tre frasi su quattro dal mazzo e una costruita
  const rev=dueReviews(level).map(x=>({f:x.f,rev:true}));
  const gen=Math.max(1,Math.round((S.n-rev.length)/4));
  const fromDeck=draw(level,S.n-rev.length-gen).map(x=>({f:x.f}));
  const made=Array.from({length:gen},()=>({f:generate(level)}));
  const qs=[...rev,...shuffle([...fromDeck,...made])].slice(0,S.n).map(x=>Object.assign(x.f.slice(),{rev:!!x.rev})); let qi=0, score=0; const missed=[];
  const next=()=>{ if(my!==alive) return;
    if(qi>=qs.length) return finish(st,score,qs.length,missed);
    const [a,right,b]=qs[qi], first=!a, [wH,wNo]=PAIR[right.toLowerCase()], swap=SWAP[right.toLowerCase()];
    const W=x=>first?cap(x):x;                    // all'inizio della frase, la maiuscola
    let done=false, tries=0;
    st.innerHTML='';
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?(missed.some(m=>m.i===i)?'ko':'ok'):i===qi?'on':'')));
    const sent=el('div','sent',(a?'<span>'+a+'</span>':'')+'<span class="gap">?</span>'+(b==='.'?'':'<span>'+b+'</span>'));
    const hear=el('button','btn','🔊 Ascolta la frase'); hear.onclick=()=>speak(join(a,W(right),b));
    const test=el('div','test',''); test.hidden=true;
    const tryBtn=el('button','btn yellow','🔄 Prova il cambio');
    // la prova: la frase con "avevo/aveva/avevano" al posto dello spazio; il bambino sente se suona bene
    const doTest=async()=>{ test.hidden=false;
      test.innerHTML='<div class="q">Proviamo con “'+W(swap)+'”:</div><div class="tx">'+(a?a+(a.endsWith('\'')?'':' '):'')+'<span class="sw">'+W(swap)+'</span>'+(b==='.'?'.':' '+b)+'</div><div class="q">Suona bene? ✊ Allora ci vuole l\'H. Suona strana? 🖐️ Niente H.</div>';
      await speak('Proviamo il cambio. '+join(a,W(swap),b)+'. Suona bene?'); };
    tryBtn.onclick=doTest;
    const ans=el('div','answers');
    shuffle([wH,wNo]).forEach(w=>{ const isH=hasH(w);
      const bt=el('button','ans'+(isH?' isH':''),'<span class="hand">'+(isH?'✊':'🖐️')+'</span><span class="w">'+showWord(W(w))+'</span><small>'+(isH?'con l\'H: '+swap:(w==='o'?'oppure':w==='anno'?'i 12 mesi':'senza H'))+'</small>');
      bt.onclick=async()=>{ if(done) return;
        if(w===right.toLowerCase()){ done=true; bt.classList.add('right'); if(!tries) score++; if(!tries&&qs[qi].rev) doneReview([a,right,b,qs[qi][3]||'']); if(tries) addReview([a,right,b,qs[qi][3]||'']);
          const g=sent.querySelector('.gap'); g.textContent=W(right); g.classList.add(isH?'h':'no');
          const why=el('div','why '+(isH?'h':'no'),isH?'✊ <b>'+W(right)+'</b> è il verbo avere: si può dire <i>'+join(a,W(swap),b)+'</i>':'🖐️ <b>'+W(right)+'</b>: con <i>'+swap+'</i> la frase suona strana, quindi niente H'+(w==='o'?' (<b>o</b> = oppure)':w==='anno'?' (<b>anno</b> = i 12 mesi)':'')+'.');
          st.insertBefore(why,ans);
          await speak(join(a,W(right),b)); await wait(900); qi++; next(); }
        else { tries++; wiggle(bt); if(!missed.some(m=>m.i===qi)) missed.push({i:qi,s:join(a,W(right),b),w:W(right)});
          speak('Quasi! Prova il cambio.'); if(S.test!=='no'){ tryBtn.hidden=false; await wait(900); doTest(); } } };
      ans.appendChild(bt); });
    tryBtn.hidden=S.test!=='sempre';
    st.append(dots,el('p','ask',qs[qi].rev?'🔁 Ripassiamo: quale parola va nello spazio?':'Quale parola va nello spazio?'));
    if(S.pics&&qs[qi][3]) st.appendChild(el('div','',sceneHTML(qs[qi][3])).firstChild);
    st.append(sent,hear,tryBtn,test,ans);
    speak(join(a,W(right),b));
  };
  next();
}
function finish(st,score,n,missed){
  __win&&__win(); st.innerHTML='';
  st.append(el('div','star',score===n?'🌟':'⭐'),el('p','ask',score===n?'Perfetto! Tutte giuste al primo colpo!':'Bravo! '+score+' su '+n+' al primo colpo.'));
  if(missed.length){ st.appendChild(el('p','sub','Le frasi da ripassare:')); const r=el('div','recap'); missed.forEach(m=>r.appendChild(el('div','',m.s.replace(new RegExp('(^|\\s|\')'+m.w+'(?=\\s|\\.|\\?|$)'),'$1<span class="k">'+m.w+'</span>')))); st.appendChild(r); }
  const b=el('button','btn main','🔄 Un altro giro'); b.onclick=play; st.appendChild(b);
  speak(score===n?'Perfetto!':'Bravo!');
}
function levels(){ const l=$('levels'); l.innerHTML=''; LEVELS.forEach(([k,lab])=>{ const b=el('button','lv',lab); b.setAttribute('aria-current',String(level===k)); b.onclick=()=>{ level=k; levels(); play(); }; l.appendChild(b); }); }
function chips(){ root.querySelectorAll('[data-k="panel"] .chips[data-key]').forEach(box=>{ const k=box.dataset.key; box.innerHTML='';
  OPT[k].forEach(([v,lab])=>{ const c=el('button','chip',lab); c.setAttribute('aria-pressed',String(S[k]===v)); c.onclick=()=>{ S[k]=v; keepS('hoha_impostazioni',S); chips(); root.classList.toggle('big',S.caps==='MAI'); }; box.appendChild(c); }); }); }
/* le frasi del genitore: si scrive la frase, si tocca ha/a/ho/o/hanno/anno da nascondere, e si aggiunge al mazzo */
function mine(){
  const inp=$('mineIn'), box=$('mineWords'), list=$('mineList');
  const drawWords=()=>{ box.innerHTML=''; const ws=inp.value.trim().split(/\s+/).filter(Boolean);
    ws.forEach((w,i)=>{ const core=w.replace(/[.,!?;:]+$/,''), ok=!!LEVEL_OF(core.replace(/^.*'/,''));
      const c=el('button','chip',w); c.disabled=!ok; c.style.opacity=ok?1:.4;
      c.onclick=()=>{ const pre=core.includes('\'')?core.slice(0,core.indexOf('\'')+1):'', word=core.slice(pre.length), punct=w.slice(core.length);
        const a_=[...ws.slice(0,i),pre].filter(Boolean).join(' ').replace(/ ([^ ]*')$/,' $1'), b_=(punct+' '+ws.slice(i+1).join(' ')).trim();
        const L=store('hoha_mie',[]); L.push({a:a_.replace(/\s+'/,"'"),w:word,b:b_||'.',pic:$('minePic').value.trim()}); $('minePic').value=''; keepS('hoha_mie',L); inp.value=''; drawWords(); drawList(); };
      box.appendChild(c); });
    if(ws.length) box.appendChild(el('span','sub','← tocca la parola da nascondere')); };
  const drawList=()=>{ list.innerHTML=''; store('hoha_mie',[]).forEach((f,i)=>{ const d=el('div','',join(f.a,f.w,f.b).replace(f.w,'<span class="k">'+f.w+'</span>')); const x=el('button','','✕'); x.setAttribute('aria-label','togli'); x.onclick=()=>{ const L=store('hoha_mie',[]); L.splice(i,1); keepS('hoha_mie',L); drawList(); }; d.prepend(x); list.appendChild(d); }); };
  inp.oninput=drawWords; drawWords(); drawList();
}
root.classList.toggle('big',S.caps==='MAI');
if(opts.mode==='parent'){ $('panel').hidden=false; $('levels').hidden=true; $('stage').hidden=true; $('rule').hidden=true; chips(); mine(); }
else { if(opts.allowSettings){ $('panel').hidden=false; chips(); mine(); } levels(); play(); }
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
