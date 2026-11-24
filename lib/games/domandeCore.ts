// @ts-nocheck
/*
 * ❓ Cosa mi chiede la domanda? Le parole-domanda (chi, cosa, dove, quando, quanti, perché, come) con colore e simbolo fissi:
 * Scopri, Che tipo di risposta?, Trova il pezzo, Tante domande, Fai tu la domanda, e l'esempio dell'aiuto nell'app.
 * Le impostazioni sono per figlio (domande_impostazioni); 'everywhere' accende l'aiuto colorato anche in Leggo e capisco.
 */
export interface DomandeOptions { mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void; accent?: string }
export const DOMANDE_CSS = ".smd{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#5468D8;--radius:22px;\n  box-sizing:border-box}\n\n.smd *{box-sizing:border-box}\n.smd{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smd button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation}\n.smd button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smd [hidden]{display:none!important}\n.smd .app{max-width:560px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smd .title{background:var(--card);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smd .title .l{display:flex;align-items:center;gap:12px}\n.smd .title .em{font-size:36px}\n.smd .title h1{margin:0;font-size:21px;font-weight:900}\n.smd .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smd .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.smd .tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.smd .tab{min-height:56px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:800;line-height:1.2;padding:0 4px}\n.smd .tab[aria-current=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smd .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.smd .ask{margin:0;font-size:23px;font-weight:900;line-height:1.35}\n.smd .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smd .dots{display:flex;gap:6px}\n.smd .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.smd .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.smd .dots .ok{background:var(--done)}\n.smd .dots .ko{background:#FFA94D}\n.smd /* la parola-domanda,.smd sempre con il suo colore e il suo simbolo */\n.qw{display:inline-flex;align-items:center;gap:4px;padding:0 10px;border-radius:12px;color:#fff;background:var(--c);font-weight:900;border:none;font-size:inherit;line-height:1.5}\n.smd .qw .qe{display:inline-flex;align-items:center;justify-content:center;width:1.35em;height:1.35em;border-radius:50%;background:#fff;font-size:.8em}\n.smd .qcards{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%}\n.smd .qcard{border-radius:20px;border:3px solid var(--c);background:var(--card);padding:12px;display:flex;flex-direction:column;align-items:center;gap:6px;color:var(--text)}\n.smd .qcard .w{font-size:26px;font-weight:900;color:var(--c)}\n.smd .qcard .e{font-size:40px}\n.smd .qcard .t{font-size:14px;font-weight:800;color:var(--soft)}\n.smd .qcard .ex{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}\n.smd .qcard .ex span{font-size:13px;font-weight:800;background:var(--ground);border-radius:999px;padding:4px 8px}\n.smd .types{display:flex;flex-direction:column;gap:10px;width:100%}\n.smd .type{display:flex;align-items:center;gap:14px;min-height:70px;border-radius:18px;border:3px solid var(--line);background:var(--card);padding:8px 16px;font-size:19px;font-weight:900;text-align:left;box-shadow:0 5px 0 var(--line)}\n.smd .type .e{font-size:36px}\n.smd .type.right{border-color:var(--c);background:color-mix(in srgb, var(--c) 14%, var(--card));box-shadow:0 5px 0 var(--c)}\n.smd /* la frase a pezzi */\n.sent{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;width:100%}\n.smd .chunk{min-height:58px;padding:0 14px;border-radius:16px;border:3px solid var(--line);background:var(--card);font-size:21px;font-weight:800;box-shadow:0 4px 0 var(--line)}\n.smd .chunk.got{border-color:var(--c);background:color-mix(in srgb, var(--c) 16%, var(--card));box-shadow:0 4px 0 var(--c)}\n.smd .chunk .tag{display:block;font-size:12px;font-weight:900;color:var(--c)}\n.smd .wrong{animation:wiggle .4s}\n.smd .hint{width:100%;border-radius:14px;padding:10px 12px;font-size:16px;font-weight:800;line-height:1.45;background:#FFF6D6;color:#5A4300}\n.smd .answer{font-size:24px;font-weight:900;padding:10px 16px;border-radius:16px;background:var(--ground)}\n.smd .scene{width:100%;border-radius:20px;background:linear-gradient(180deg,#E3F0FC,#FFF6E6);padding:18px 10px;font-size:64px;line-height:1.15;letter-spacing:4px}\n.smd .frase{font-size:24px;font-weight:800;line-height:1.4}\n.smd .frase.hide{filter:blur(9px);user-select:none}\n.smd .opts{display:flex;flex-direction:column;gap:10px;width:100%}\n.smd .opt{min-height:62px;border-radius:16px;border:3px solid var(--line);background:var(--card);font-size:21px;font-weight:800;box-shadow:0 4px 0 var(--line)}\n.smd .opt.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 4px 0 #2F8A5A}\n.smd .pick{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;width:100%}\n.smd .pk{min-height:46px;padding:0 12px;border-radius:999px;border:3px solid var(--c);background:var(--card);color:var(--c);font-size:15px;font-weight:900}\n.smd .pk[aria-pressed=\"true\"]{background:var(--c);color:#fff}\n.smd .conf{font-size:14px;font-weight:700;color:var(--soft);line-height:1.5}\n.smd .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.smd .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smd .star{font-size:64px;animation:pop .5s ease-out}\n.smd /* l'esempio nell'app (Leggo e capisco) */\n.lc{width:100%;text-align:left;display:flex;flex-direction:column;gap:12px}\n.smd .lc .txt{font-size:21px;font-weight:700;line-height:1.55;background:var(--ground);border-radius:14px;padding:12px 14px}\n.smd .lc .q{font-size:21px;font-weight:900;display:flex;align-items:center;gap:8px;flex-wrap:wrap}\n.smd .lc .opt{min-height:56px;border-radius:14px;border:3px solid var(--line);background:var(--card);font-size:18px;font-weight:800;text-align:left;padding:0 14px}\n.smd .lc .opt.right{background:var(--done);border-color:var(--done);color:#fff}\n.smd .tip{position:relative;background:var(--c);color:#fff;border-radius:14px;padding:10px 14px;font-size:16px;font-weight:900;animation:pop .3s ease-out}\n.smd .badge{font-size:12px;font-weight:900;color:#fff;background:#F08C00;border-radius:999px;padding:3px 8px;align-self:flex-start}\n.smd .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.smd .set{display:flex;flex-direction:column;gap:8px}\n.smd .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.smd .chips{display:flex;gap:8px;flex-wrap:wrap}\n.smd .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.smd .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.smd *{animation:none!important}}"
export function mountDomande(root: HTMLElement, opts: DomandeOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left;font-size:20px\">Impostazioni (area genitore)</div>\n    <div class=\"set\"><span>❓ Le parole-domanda da usare (si comincia con due, poi si aggiungono)</span><div class=\"chips\" data-k=\"qwset\"></div></div>\n    <div class=\"set\"><span>💡 L'aiuto sotto la domanda («📍 Cerca un posto»)</span><div class=\"chips\" data-key=\"help\"></div></div>\n    <div class=\"set\"><span>🖼️ «Guarda, leggi, rispondi»: il livello</span><div class=\"chips\" data-key=\"lv\"></div></div>\n    <div class=\"set\"><span>🔀 Mescolare le domande (quando il bambino è pronto)</span><div class=\"chips\" data-key=\"mix\"></div></div>\n    <div class=\"set\"><span>🔢 Quanti esercizi per giro</span><div class=\"chips\" data-key=\"n\"></div></div>\n    <div class=\"set\"><span>🏅 I risultati, domanda per domanda</span><div class=\"conf\" data-k=\"res\"></div></div>\n    <div class=\"set\"><span>🔎 Le confusioni più frequenti</span><div class=\"conf\" data-k=\"conf\"></div></div>\n    <div class=\"set\"><span>🌐 In tutta l'app: la parola-domanda colorata, con l'aiuto toccandola</span><div class=\"chips\" data-key=\"everywhere\"></div></div>\n    \n  </section>\n  <nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <section class=\"card\" data-k=\"stage\"></section>"
const __win = opts.onWin

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
/* le frasi a pezzi: ogni pezzo risponde a una domanda (null = nessuna) */
const SENTS=[
 {p:[['Ieri','quando'],['Luca','chi'],['ha mangiato una mela','cosa'],['in giardino','dove']],q:{chi:'Chi ha mangiato una mela?',cosa:'Che cosa ha fatto Luca?',dove:'Dove ha mangiato la mela Luca?',quando:'Quando Luca ha mangiato la mela?'}},
 {p:[['Stamattina','quando'],['la maestra','chi'],['ha letto una storia','cosa'],['in classe','dove']],q:{chi:'Chi ha letto una storia?',cosa:'Che cosa ha fatto la maestra?',dove:'Dove ha letto la storia la maestra?',quando:'Quando la maestra ha letto la storia?'}},
 {p:[['Sabato','quando'],['Elio','chi'],['è andato al mare','cosa'],['perché faceva caldo','perche']],q:{chi:'Chi è andato al mare?',cosa:'Che cosa ha fatto Elio sabato?',quando:'Quando Elio è andato al mare?',perche:'Perché Elio è andato al mare?'}},
 {p:[['Amina','chi'],['va a scuola','cosa'],['in bici','come'],['ogni mattina','quando']],q:{chi:'Chi va a scuola in bici?',cosa:'Che cosa fa Amina ogni mattina?',come:'Come va a scuola Amina?',quando:'Quando Amina va a scuola in bici?'}},
 {p:[['Il gatto','chi'],['dorme','cosa'],['sul divano','dove'],['perché è stanco','perche']],q:{chi:'Chi dorme sul divano?',cosa:'Che cosa fa il gatto?',dove:'Dove dorme il gatto?',perche:'Perché il gatto dorme?'}},
 {p:[['Stasera','quando'],['la mamma','chi'],['cucina','cosa'],['due pizze','quanti']],q:{chi:'Chi cucina le pizze?',cosa:'Che cosa fa la mamma stasera?',quando:'Quando la mamma cucina le pizze?',quanti:'Quante pizze cucina la mamma?'}},
 {p:[['Nel bosco','dove'],['vivono',null],['cinque scoiattoli','quanti']],q:{dove:'Dove vivono gli scoiattoli?',quanti:'Quanti scoiattoli vivono nel bosco?'}},
];
const EX=[
 {k:'chi',pic:'👧🍝',p:[['Lucia','chi'],['mangia',null],['la pasta','cosa'],['in cucina','dove']],q:'Chi mangia la pasta?',same:['Marco','la nonna']},
 {k:'chi',pic:'🐶💤',p:[['Il cane','chi'],['dorme',null],['nella cuccia','dove']],q:'Chi dorme nella cuccia?',same:['il gatto','il coniglio']},
 {k:'chi',pic:'👩‍🏫✍️',p:[['La maestra','chi'],['scrive',null],['alla lavagna','dove']],q:'Chi scrive alla lavagna?',same:['il bambino','il papà']},
 {k:'chi',pic:'👨🚗',p:[['Il papà','chi'],['guida',null],['la macchina','cosa']],q:'Chi guida la macchina?',same:['la maestra','il nonno']},
 {k:'chi',pic:'👵🌷',p:[['La nonna','chi'],['innaffia',null],['i fiori','cosa'],['in giardino','dove']],q:'Chi innaffia i fiori?',same:['Lucia','il papà']},
 {k:'cosa',pic:'👦🥛',p:[['Marco','chi'],['beve',null],['il latte','cosa'],['a colazione','quando']],q:'Che cosa beve Marco?',same:['il succo','l’acqua']},
 {k:'cosa',pic:'👧📖',p:[['Amina','chi'],['legge',null],['un libro','cosa'],['sul divano','dove']],q:'Che cosa legge Amina?',same:['un giornale','una lettera']},
 {k:'cosa',pic:'🐱🐟',p:[['Il gatto','chi'],['mangia',null],['il pesce','cosa']],q:'Che cosa mangia il gatto?',same:['il formaggio','la carota']},
 {k:'cosa',pic:'👦⚽',p:[['Elio','chi'],['gioca a palla','cosa'],['al parco','dove']],q:'Che cosa fa Elio al parco?',same:['legge','dorme']},
 {k:'cosa',pic:'👧🖍️🏠',p:[['Zoe','chi'],['disegna',null],['una casa','cosa']],q:'Che cosa disegna Zoe?',same:['un albero','un gatto']},
 {k:'dove',pic:'🧒🎒🏫',p:[['Il bambino','chi'],['va',null],['a scuola','dove'],['la mattina','quando']],q:'Dove va il bambino?',same:['al mare','in piscina']},
 {k:'dove',pic:'🐟🌊',p:[['Il pesce','chi'],['nuota',null],['nel mare','dove']],q:'Dove nuota il pesce?',same:['nel cielo','nel bosco']},
 {k:'dove',pic:'👩🍳',p:[['La mamma','chi'],['cucina',null],['in cucina','dove'],['la sera','quando']],q:'Dove cucina la mamma?',same:['in bagno','in giardino']},
 {k:'dove',pic:'🐱🛋️',p:[['Il gatto','chi'],['dorme',null],['sul divano','dove']],q:'Dove dorme il gatto?',same:['sul tetto','nel letto']},
 {k:'dove',pic:'🐦🌳',p:[['Gli uccellini','chi'],['cantano',null],['sull’albero','dove']],q:'Dove cantano gli uccellini?',same:['sul tetto','nel prato']},
 {k:'quando',pic:'🌙🛏️',p:[['La sera','quando'],['Luca','chi'],['va a letto','cosa']],q:'Quando va a letto Luca?',same:['la mattina','a pranzo']},
 {k:'quando',pic:'🎄⭐',p:[['A Natale','quando'],['facciamo',null],['l’albero','cosa']],q:'Quando facciamo l’albero?',same:['a Pasqua','d’estate']},
 {k:'quando',pic:'🌅🥐',p:[['Di mattina','quando'],['Zoe','chi'],['fa colazione','cosa']],q:'Quando Zoe fa colazione?',same:['di sera','di notte']},
 {k:'quando',pic:'☀️🏖️',p:[['D’estate','quando'],['andiamo',null],['al mare','dove']],q:'Quando andiamo al mare?',same:['d’inverno','a Natale']},
 {k:'quando',pic:'🌧️☔',p:[['Ieri','quando'],['è piovuto',null],['in città','dove']],q:'Quando è piovuto?',same:['oggi','domani']},
 {k:'quanti',pic:'🐰🐰🐰',p:[['Nel prato','dove'],['ci sono',null],['tre','quanti'],['conigli',null]],q:'Quanti conigli ci sono nel prato?',same:['due','cinque']},
 {k:'quanti',pic:'👧🎈🎈',p:[['Lila','chi'],['ha',null],['due','quanti'],['palloncini',null]],q:'Quanti palloncini ha Lila?',same:['tre','uno']},
 {k:'quanti',pic:'🍎🍎🍎🍎🍎',p:[['Sul tavolo','dove'],['ci sono',null],['cinque','quanti'],['mele',null]],q:'Quante mele ci sono sul tavolo?',same:['quattro','sei']},
 {k:'quanti',pic:'🕷️',p:[['Il ragno','chi'],['ha',null],['otto','quanti'],['zampe',null]],q:'Quante zampe ha il ragno?',same:['sei','quattro']},
 {k:'perche',pic:'👦☂️🌧️',p:[['Nico','chi'],['prende',null],['l’ombrello','cosa'],['perché piove','perche']],q:'Perché Nico prende l’ombrello?',same:['perché c’è il sole','perché ha fame']},
 {k:'perche',pic:'👧😢🩹',p:[['Zoe','chi'],['piange',null],['perché è caduta','perche']],q:'Perché Zoe piange?',same:['perché è felice','perché ha sonno']},
 {k:'perche',pic:'🐶💧',p:[['Il cane','chi'],['beve',null],['perché ha sete','perche']],q:'Perché il cane beve?',same:['perché ha freddo','perché gioca']},
 {k:'perche',pic:'💡🌙',p:[['La mamma','chi'],['accende la luce','cosa'],['perché è buio','perche']],q:'Perché la mamma accende la luce?',same:['perché è giorno','perché piove']},
 {k:'come',pic:'👦🚲🏫',p:[['Elio','chi'],['va a scuola','cosa'],['in bici','come']],q:'Come va a scuola Elio?',same:['a piedi','in macchina']},
 {k:'come',pic:'🐌',p:[['La lumaca','chi'],['cammina',null],['piano piano','come']],q:'Come cammina la lumaca?',same:['velocissima','saltando']},
 {k:'come',pic:'👧👋',p:[['Amina','chi'],['saluta',null],['con la mano','come']],q:'Come saluta Amina?',same:['con un bacio','con un inchino']},
 {k:'come',pic:'👨🍞',p:[['Il papà','chi'],['taglia il pane','cosa'],['con il coltello','come']],q:'Come taglia il pane il papà?',same:['con le forbici','con le mani']},
];
/* se nella frase mancano altri pezzi, le risposte "di un altro tipo" si prendono da qui */
const POOL={chi:['la mamma','il gatto'],cosa:['una mela','il libro'],dove:['a scuola','al parco'],quando:['ieri','la sera'],quanti:['tre','cinque'],perche:['perché piove','perché ha sonno'],come:['in bici','piano piano']};
const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
let S=Object.assign({on:['chi','dove'],help:'errore',everywhere:true,lv:1,n:6,mix:false},store('domande_impostazioni',{}));
const OPT={help:[['sempre','Sempre'],['errore','Dopo un errore'],['mai','Mai']],everywhere:[[true,'Sì'],[false,'No']],lv:[[1,'1 · Pezzi della frase'],[2,'2 · Stesso tipo'],[3,'3 · Frase nascosta']],n:[[6,'6'],[8,'8'],[10,'10']],mix:[[false,'No, una domanda alla volta'],[true,'Sì, si possono mescolare']]};
const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function speak(t){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='it-IT'; u.rate=.88; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('it')); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1400+t.length*90); setTimeout(()=>speechSynthesis.speak(u),70); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
const act=()=>ORDER.filter(k=>S.on.includes(k));
/* la domanda con la parola-domanda colorata (Chi, Che cosa, Dove, Quando, Quanti/Quante, Perché, Come) */
const RE=/^(Chi|Che cosa|Cosa|Dove|Quando|Quanti|Quante|Perché|Come)\b/;
function qHTML(q,k){ const m=q.match(RE); if(!m) return q; const d=QW[k]; return '<span class="qw" style="--c:'+d.c+'"><span class="qe">'+d.e+'</span>'+m[1]+'</span>'+q.slice(m[1].length); }
function helpEl(k,force){ const d=QW[k]; const h=el('div','hint',d.e+' <b>'+d.w+'</b> → '+d.look+'.'); h.hidden=!(force||S.help==='sempre'); return h; }
/* le domande possibili con le parole attive */
function pickQ(){ const opts=[]; SENTS.forEach(s=>Object.keys(s.q).forEach(k=>{ if(S.on.includes(k)) opts.push({s,k}); })); return opts.length?opts[rnd(opts.length)]:null; }

let tab=0, qi=0, score=0, ko=[]; const N=6;
const TABS=[['🔎 Scopri',discover],['🎯 Che tipo di risposta?',types],['🧩 Trova il pezzo',piece],['🔁 Tante domande',many],['🙋 Fai tu la domanda',make],['🌐 Nell\'app',inapp]];
function tabsBar(){ const t=$('tabs'); t.innerHTML=''; TABS.forEach(([l],i)=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(i===tab)); b.onclick=()=>{ tab=i; start(); }; t.appendChild(b); }); }
function start(){ hush(); tabsBar(); qi=0; score=0; ko=[]; TABS[tab][1](); }
function dotsEl(){ const d=el('div','dots'); for(let k=0;k<N;k++) d.appendChild(el('span',k<qi?(ko.includes(k)?'ko':'ok'):k===qi?'on':'')); return d; }
function finish(again){ __win&&__win(); const st=$('stage'); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask',score===N?'Perfetto!':'Bravo! '+score+' su '+N+' al primo colpo.')); const b=el('button','btn main','🔄 Ancora'); b.onclick=()=>{ qi=0; score=0; ko=[]; again(); }; st.appendChild(b); speak('Bravo!'); }

/* ── 🔎 Scopri: una carta per ogni parola-domanda ── */
function discover(){ const st=$('stage'); st.innerHTML=''; st.append(el('p','ask','Ogni domanda cerca una cosa diversa'),el('p','sub','Tocca una carta per ascoltarla.'));
  const g=el('div','qcards'); act().forEach(k=>{ const d=QW[k]; const c=el('button','qcard','<span class="e">'+d.e+'</span><span class="w">'+d.w+'</span><span class="t">cerca '+d.t+'</span><span class="ex">'+d.ex.map(x=>'<span>'+x[0]+' '+x[1]+'</span>').join('')+'</span>'); c.style.setProperty('--c',d.c);
    c.onclick=()=>speak(d.w+' '+d.look+'. Per esempio: '+d.ex.map(x=>x[1]).join(', ')+'.'); g.appendChild(c); }); st.appendChild(g); }

/* ── 🎯 Che tipo di risposta? Si sente la domanda; non serve sapere la risposta, solo cosa cerca ── */
function types(){ hush(); if(qi>=N) return finish(types); const Q=pickQ(); if(!Q) return; const st=$('stage'); st.innerHTML=''; let tries=0, done=false;
  const q=Q.s.q[Q.k], hint=helpEl(Q.k), box=el('div','types');
  const others=shuffle(act().filter(k=>k!==Q.k)).slice(0,Math.min(2,act().length-1));
  shuffle([Q.k,...others]).forEach(k=>{ const d=QW[k]; const b=el('button','type','<span class="e">'+d.e+'</span>'+d.t); b.style.setProperty('--c',d.c);
    b.onclick=async()=>{ if(done) return; if(k===Q.k){ done=true; b.classList.add('right'); if(!tries) score++; await speak(d.w+' cerca '+d.t+'!'); await wait(400); qi++; types(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); if(S.help!=='mai'){ hint.hidden=false; } speak('Ascolta bene la prima parola: '+QW[Q.k].w); } };
    box.appendChild(b); });
  st.append(dotsEl(),el('p','sub','🔊 Ascolta la domanda: che cosa cerca?'),el('p','ask',qHTML(q,Q.k)),hint,box); speak(q); }

/* ── 🧩 Trova il pezzo: la frase a pezzi, si tocca il pezzo che risponde ── */
function sentenceEl(s,onTap,got){ const box=el('div','sent'); s.p.forEach(([t,k],i)=>{ const b=el('button','chunk'+(got&&got.includes(k)?' got':''),(got&&got.includes(k)&&k?'<span class="tag">'+QW[k].e+' '+QW[k].w+'</span>':'')+t); if(k) b.style.setProperty('--c',QW[k].c); b.onclick=()=>onTap(k,b,t); box.appendChild(b); }); return box; }
function piece(){ hush(); if(qi>=N) return finish(piece); const Q=pickQ(); if(!Q) return; const st=$('stage'); st.innerHTML=''; let tries=0, done=false;
  const q=Q.s.q[Q.k], hint=helpEl(Q.k);
  const sent=sentenceEl(Q.s,async(k,b,t)=>{ if(done) return; speak(t);
    if(k===Q.k){ done=true; b.classList.add('got'); b.insertAdjacentHTML('afterbegin','<span class="tag">'+QW[k].e+' '+QW[k].w+'</span>'); if(!tries) score++; await wait(500); await speak(QW[k].w+' '+t+'!'); await wait(400); qi++; piece(); }
    else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); if(S.help!=='mai') hint.hidden=false; } });
  st.append(dotsEl(),el('p','sub','📖 '+Q.s.p.map(x=>x[0]).join(' ')+'.'),el('p','ask',qHTML(q,Q.k)),hint,sent,el('p','sub','Tocca il pezzo della frase che risponde.')); speak(Q.s.p.map(x=>x[0]).join(' ')+'. '+q); }

/* ── 🔁 Tante domande: una frase sola, e una domanda dopo l'altra ── */
function many(){ hush(); const pool=SENTS.filter(s=>Object.keys(s.q).filter(k=>S.on.includes(k)).length>=2); const s=pool.length?pool[rnd(pool.length)]:SENTS[0];
  const ks=shuffle(Object.keys(s.q).filter(k=>S.on.includes(k))), got=[]; let i=0;
  const step=()=>{ const st=$('stage'); st.innerHTML=''; if(i>=ks.length){ st.append(el('p','sub','Ogni domanda ha trovato il suo pezzo:'),sentenceEl(s,()=>{},got),el('div','star','⭐'),el('p','ask','Domande diverse cercano pezzi diversi!')); const b=el('button','btn main','🔄 Un\'altra frase'); b.onclick=many; st.appendChild(b); speak('Bravo! Domande diverse cercano pezzi diversi.'); return; }
    const k=ks[i], q=s.q[k], hint=helpEl(k); let done=false;
    const sent=sentenceEl(s,async(kk,b,t)=>{ if(done) return; speak(t); if(kk===k){ done=true; got.push(k); await speak(QW[k].w+' '+t+'!'); await wait(300); i++; step(); } else { wiggle(b); if(S.help!=='mai') hint.hidden=false; } },got);
    st.append(el('p','sub','Domanda '+(i+1)+' di '+ks.length),el('p','ask',qHTML(q,k)),hint,sent); speak(q); };
  step(); }

/* ── 🙋 Fai tu la domanda: c'è la risposta, si sceglie la parola-domanda ── */
function make(){ hush(); if(qi>=N) return finish(make); const Q=pickQ(); if(!Q) return; const st=$('stage'); st.innerHTML=''; let tries=0, done=false;
  const ans=Q.s.p.find(x=>x[1]===Q.k)[0], box=el('div','qcards');
  shuffle([Q.k,...shuffle(act().filter(k=>k!==Q.k)).slice(0,Math.min(3,act().length-1))]).forEach(k=>{ const d=QW[k]; const b=el('button','qcard','<span class="e">'+d.e+'</span><span class="w">'+d.w+'</span>'); b.style.setProperty('--c',d.c);
    b.onclick=async()=>{ if(done) return; if(k===Q.k){ done=true; b.style.background=d.c; b.querySelector('.w').style.color='#fff'; if(!tries) score++; await speak(Q.s.q[Q.k]+' '+ans+'!'); await wait(400); qi++; make(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); speak(ans+'. È '+QW[Q.k].t+'?'); } };
    box.appendChild(b); });
  st.append(dotsEl(),el('p','sub','📖 '+Q.s.p.map(x=>x[0]===ans?'<b>'+x[0]+'</b>':x[0]).join(' ')+'.'),el('p','sub','La risposta è:'),el('div','answer',ans),el('p','ask','Quale domanda la cerca?'),box); speak('La risposta è: '+ans+'. Quale domanda la cerca?'); }

/* ── 🖼️ Guarda, leggi, rispondi: disegno, frase, domanda, e le risposte ── */
let exRound=[], ei=0, escore=0, eko=[], aq=null;
function answer(){ hush(); if(!aq||(aq==='mix'&&!S.mix)||(aq!=='mix'&&!S.on.includes(aq))) aq=act()[0];
  const pool=shuffle(EX.filter(x=>aq==='mix'?S.on.includes(x.k):x.k===aq)); exRound=pool.slice(0,S.n); ei=0; escore=0; eko=[]; answerQ(); }
function pickBar(){ const bar=el('div','pick'); [...act(),...(S.mix?['mix']:[])].forEach(k=>{ const d=k==='mix'?{e:'🔀',w:'Mescolate',c:'#5468D8'}:QW[k]; const b=el('button','pk',d.e+' '+d.w); b.style.setProperty('--c',d.c); b.setAttribute('aria-pressed',String(aq===k)); b.onclick=()=>{ aq=k; answer(); }; bar.appendChild(b); }); return bar; }
function answerQ(){ hush(); const st=$('stage'); st.innerHTML=''; if(ei===0) st.appendChild(pickBar());
  if(!exRound.length){ st.appendChild(el('p','sub','Non ci sono esercizi per le parole-domanda scelte.')); return; }
  if(ei>=exRound.length){ const R=store('domande_risultati',{}); R[aq]={ok:escore,of:exRound.length,best:Math.max(escore/exRound.length,(R[aq]||{}).best||0)}; keepS('domande_risultati',R);
    st.append(el('div','star','⭐'),el('p','ask',escore===exRound.length?'Perfetto!':'Bravo! '+escore+' su '+exRound.length+' al primo colpo.')); const b=el('button','btn main','🔄 Ancora'); b.onclick=answer; st.appendChild(b); speak('Bravo!'); return; }
  const x=exRound[ei], right=x.p.find(c=>c[1]===x.k)[0], sentence=x.p.map(c=>c[0]).join(' ')+'.'; let tries=0, done=false;
  const dots=el('div','dots'); exRound.forEach((_,i)=>dots.appendChild(el('span',i<ei?(eko.includes(i)?'ko':'ok'):i===ei?'on':'')));
  // le risposte: livello 1 = gli altri pezzi della frase (di un altro tipo); livello 2 e 3 = risposte dello stesso tipo
  let opts;
  if(S.lv===1){ const other=x.p.filter(c=>c[1]&&c[1]!==x.k).map(c=>({t:c[0],k:c[1]}));
    const extra=shuffle(Object.keys(POOL).filter(k=>k!==x.k&&!other.some(o=>o.k===k))).map(k=>({t:POOL[k][rnd(2)],k}));
    opts=[{t:right,k:x.k},...[...other,...extra].slice(0,2)]; }
  else opts=[{t:right,k:x.k},...x.same.map(t=>({t,k:x.k}))];
  const frase=el('p','frase',sentence), hint=helpEl(x.k), box=el('div','opts');
  shuffle(opts).forEach(o=>{ const b=el('button','opt',o.t);
    b.onclick=async()=>{ if(done) return; speak(o.t);
      if(o.t===right){ done=true; b.classList.add('right'); frase.classList.remove('hide'); if(!tries) escore++; await wait(400); await speak(x.q.replace('?','')+'? '+right+'!'); await wait(500); ei++; answerQ(); }
      else { tries++; if(!eko.includes(ei)) eko.push(ei); wiggle(b);
        if(o.k!==x.k){ // ha scelto la risposta a un'altra domanda: è proprio la confusione da allenare
          const c=store('domande_confusioni',{}); const key=x.k+'>'+o.k; c[key]=(c[key]||0)+1; keepS('domande_confusioni',c);
          hint.hidden=false; hint.innerHTML='«'+o.t+'» risponde a '+QW[o.k].e+' <b>'+QW[o.k].w+'</b> ('+QW[o.k].t+'). Ma '+QW[x.k].e+' <b>'+QW[x.k].w+'</b> '+QW[x.k].look.toLowerCase()+'!';
          speak(o.t+' è '+QW[o.k].t+'. Ma '+QW[x.k].w+' '+QW[x.k].look.toLowerCase()); }
        else { hint.hidden=false; hint.innerHTML='📖 Rileggi la frase: <b>'+sentence+'</b>'; frase.classList.remove('hide'); speak('Rileggi la frase. '+sentence); } } };
    box.appendChild(b); });
  st.append(dots,el('div','scene',x.pic),frase);
  if(S.lv===3){ const h=el('button','btn','🙈 Ho letto: nascondi la frase'); h.onclick=()=>{ frase.classList.add('hide'); h.remove(); qa(); }; st.appendChild(h); speak(sentence); }
  else qa();
  function qa(){ st.append(el('p','ask',qHTML(x.q,x.k)),hint,box); speak((S.lv===3?'':sentence+' ')+x.q); }
}

/* ── 🌐 L'aiuto in tutta l'app: un esempio in Leggo e capisco ── */
function inapp(){ const st=$('stage'); st.innerHTML=''; const k='dove', d=QW[k], q='Dove vivono gli scoiattoli?';
  st.append(el('span','badge','Esempio: così apparirebbe in “Leggo e capisco”'));
  const lc=el('div','lc'); lc.appendChild(el('div','txt','Nel bosco vivono cinque scoiattoli. Di giorno raccolgono le ghiande.'));
  const qrow=el('div','q'); const w=el('button','qw','<span class="qe">'+d.e+'</span>Dove'); w.style.setProperty('--c',d.c); w.setAttribute('aria-label','aiuto: dove'); const tip=el('div','tip',d.e+' <b>Dove?</b> '+d.look+'!'); tip.style.setProperty('--c',d.c); tip.hidden=true;
  w.onclick=()=>{ tip.hidden=!tip.hidden; if(!tip.hidden) speak('Dove? '+d.look); };
  qrow.append(S.everywhere?w:document.createTextNode('Dove'),document.createTextNode(' vivono gli scoiattoli?')); lc.appendChild(qrow); lc.appendChild(tip);
  [['nel bosco',true],['di giorno',false],['cinque',false]].forEach(([t,ok])=>{ const o=el('button','opt',t); o.onclick=()=>{ if(ok){ o.classList.add('right'); speak('Giusto! Nel bosco: è un posto.'); } else { wiggle(o); speak(t+' non è un posto.'); if(S.everywhere) tip.hidden=false; } }; lc.appendChild(o); });
  st.appendChild(lc); st.appendChild(el('p','sub',S.everywhere?'Tocca la parola colorata «📍 Dove» per l\'aiuto. Con l\'impostazione «In tutta l\'app» spenta, la domanda torna normale.':'L\'impostazione «In tutta l\'app» è spenta: la domanda è normale.')); }

/* ── impostazioni ── */
function results(){ const R=store('domande_risultati',{}); $('res').innerHTML=[...ORDER,'mix'].filter(k=>R[k]).map(k=>{ const d=k==='mix'?{e:'🔀',w:'Mescolate'}:QW[k], r=R[k]; return d.e+' <b>'+d.w+'</b> ultimo giro: '+r.ok+' su '+r.of+(r.best===1?' ✅ (tutto giusto almeno una volta)':''); }).join('<br>')||'Ancora nessun giro fatto.'; }
function confusions(){ results(); const c=store('domande_confusioni',{}), list=Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,4);
  $('conf').innerHTML=list.length?list.map(([k,n])=>{ const [a,b]=k.split('>'); return QW[a].e+' <b>'+QW[a].w+'</b> scambiato con '+QW[b].e+' <b>'+QW[b].w+'</b>: '+n+(n===1?' volta':' volte'); }).join('<br>'):'Ancora nessuna: si vedranno qui le domande che il bambino confonde.'; }
function chips(){ confusions(); const qs=$('qwset'); qs.innerHTML=''; ORDER.forEach(k=>{ const d=QW[k]; const c=el('button','chip',d.e+' '+d.w); c.setAttribute('aria-pressed',String(S.on.includes(k)));
    c.onclick=()=>{ S.on=S.on.includes(k)?(S.on.length>2?S.on.filter(x=>x!==k):S.on):[...S.on,k]; keepS('domande_impostazioni',S); chips(); }; qs.appendChild(c); });
  root.querySelectorAll('[data-k="panel"] .chips[data-key]').forEach(box=>{ const k=box.dataset.key; box.innerHTML='';
    OPT[k].forEach(([v,l])=>{ const c=el('button','chip',l); c.setAttribute('aria-pressed',String(S[k]===v)); c.onclick=()=>{ S[k]=v; keepS('domande_impostazioni',S); chips(); if(opts.mode!=='parent') start(); }; box.appendChild(c); }); }); }
if(opts.mode==='parent'){ $('panel').hidden=false; $('tabs').hidden=true; $('stage').hidden=true; chips(); }
else { if(opts.allowSettings){ $('panel').hidden=false; chips(); } start(); }
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
