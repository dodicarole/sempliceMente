// @ts-nocheck
/*
 * 🎲 I giochi (Dove salta Tedo?, Trova le differenze, Cosa manca nello zaino?, Tedo mangione,
 * La rima di Lila, La parola spezzata, L'intruso, Il mercatino di Elio, Quanti sono?, Come si sente?, Ferma o vai?).
 * È lo stesso codice dei prototipi già provati: lavora direttamente sugli elementi della pagina,
 * dentro un contenitore con la classe "smg" (anche lo stile vale solo lì dentro).
 * GamesView.tsx lo monta e lo smonta.
 */
export interface GamesOptions { settings?: Record<string, unknown>; allowSettings?: boolean; onWin?: () => void; onSettings?: (s: Record<string, unknown>) => void }
export const GAMES_CSS = ".smg{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#6870A0;--line:#D6DBF2;--done:#48B97A;--done-bg:#E6F6EE;--blue:#6B7FE3;--radius:22px;--pond:#BFE3F5;--pad:#5CC27A;--pad-d:#3E9C5B;\n  box-sizing:border-box}\n\n.smg *{box-sizing:border-box}\n.smg{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smg button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation}\n.smg button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smg [hidden]{display:none!important}\n.smg .app{max-width:540px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smg .title{background:var(--card);border-radius:var(--radius);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smg .title .l{display:flex;align-items:center;gap:12px}\n.smg .title .em{font-size:36px}\n.smg .title h1{margin:0;font-size:22px;font-weight:900}\n.smg .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smg .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.smg .back{background:none;border:none;font-size:15px;font-weight:800;color:var(--soft);padding:4px 0;align-self:flex-start}\n.smg .game{display:flex;align-items:center;gap:14px;background:var(--card);border-radius:var(--radius);padding:16px;border:none;text-align:left;width:100%;border-left:8px solid var(--c)}\n.smg .game .e{font-size:40px;flex:none}\n.smg .game b{display:block;font-size:19px;font-weight:900}\n.smg .game span{font-size:14px;font-weight:700;color:var(--soft);line-height:1.4}\n.smg .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.smg .ask{margin:0;font-size:21px;font-weight:900;line-height:1.3}\n.smg .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smg .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.smg .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smg .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.smg .dots{display:flex;gap:6px}\n.smg .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.smg .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.smg .dots .ok{background:var(--done)}\n.smg .level{font-size:14px;font-weight:900;color:var(--soft);background:var(--ground);border-radius:999px;padding:4px 12px}\n.smg .wrong{animation:wiggle .4s}\n.smg .star{font-size:64px;animation:pop .5s ease-out}\n.smg /* 🐸 lo stagno */\n.pond{position:relative;width:100%;max-width:360px;aspect-ratio:1;border-radius:30px;background:var(--pond);display:grid;gap:8px;padding:14px}\n.smg .pad{border:none;border-radius:50%;background:radial-gradient(circle at 40% 35%,#7BD592,var(--pad) 60%,var(--pad-d));position:relative;transition:transform .15s,box-shadow .15s}\n.smg .pad::after{content:'';position:absolute;right:14%;top:42%;width:22%;height:12%;background:var(--pond);transform:rotate(-30deg);border-radius:4px}\n.smg .pad.lit{box-shadow:0 0 0 6px #FFC93C;transform:scale(1.06)}\n.smg .pad.ok{box-shadow:0 0 0 6px var(--done)}\n.smg .pad.no{box-shadow:0 0 0 6px #E03131}\n.smg .frog{position:absolute;width:70px;height:70px;left:0;top:0;transition:transform .32s cubic-bezier(.3,1.4,.5,1);pointer-events:none;z-index:2}\n.smg .say{font-size:18px;font-weight:900;min-height:26px}\n.smg /* 🧩 la parola spezzata */\n.syls{display:flex;gap:10px;justify-content:center;min-height:62px;flex-wrap:wrap}\n.smg .syl{min-width:64px;padding:8px 14px;border-radius:16px;background:var(--blue);color:#fff;font-size:30px;font-weight:900;animation:pop .35s ease-out}\n.smg .pics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%}\n.smg .pic{aspect-ratio:1;border-radius:20px;border:3px solid var(--line);background:var(--ground);font-size:54px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 5px 0 var(--line)}\n.smg .pic small{font-size:15px;font-weight:900;margin-top:4px}\n.smg .pic.right{border-color:var(--done);background:var(--done-bg);box-shadow:0 5px 0 var(--done)}\n.smg /* 😊 come si sente */\n.scene{width:100%;border-radius:20px;background:linear-gradient(180deg,#E3F0FC,#FFF6E6);padding:16px;display:flex;flex-direction:column;gap:10px;align-items:center}\n.smg .scene .e{font-size:56px;line-height:1}\n.smg .scene p{margin:0;font-size:19px;font-weight:800;line-height:1.45;color:#1F2147}\n.smg .faces{display:flex;flex-direction:column;gap:8px;width:100%}\n.smg .face{display:flex;align-items:center;gap:14px;min-height:64px;border-radius:18px;border:3px solid var(--line);background:var(--ground);padding:8px 16px;font-size:19px;font-weight:900;text-align:left;box-shadow:0 4px 0 var(--line)}\n.smg .face .e{font-size:36px}\n.smg .face.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 4px 0 #2F8A5A}\n.smg .tip{width:100%;background:#FFF6D6;color:#5A4300;border-radius:16px;padding:12px 14px;font-size:16px;font-weight:800;line-height:1.45;text-align:left}\n.smg .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.smg .set{display:flex;flex-direction:column;gap:8px}\n.smg .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.smg .chips{display:flex;gap:8px;flex-wrap:wrap}\n.smg .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.smg .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n.smg /* 🐸 Tedo mangione: la strada a tre corsie */\n.road{position:relative;width:100%;max-width:360px;height:440px;border-radius:24px;overflow:hidden;background:#8CE99A;display:grid;grid-template-columns:repeat(3,1fr)}\n.smg .lane{border:none;background:linear-gradient(90deg,transparent 0 4%,#ADB5BD 4% 96%,transparent 96%);position:relative;padding:0}\n.smg .lane::after{content:'';position:absolute;left:50%;top:0;bottom:0;width:6px;margin-left:-3px;background:repeating-linear-gradient(#fff 0 26px,transparent 26px 52px);opacity:.7;animation:dash 1s linear infinite}\n@keyframes dash{to{background-position:0 52px}}\n.smg .food{position:absolute;left:0;top:0;width:60px;height:60px;margin-left:-30px;font-size:46px;line-height:60px;text-align:center;pointer-events:none}\n.smg .food.num{font-size:34px;font-weight:900;background:#fff;border-radius:50%;border:4px solid var(--blue);color:#1F2147;width:58px;height:58px;line-height:50px;margin-left:-29px}\n.smg .tedo{position:absolute;left:0;bottom:22px;width:80px;height:80px;margin-left:-40px;transform-origin:50% 100%;transition:left .18s ease-out;pointer-events:none}\n.smg .bubble2{position:absolute;left:50%;top:12px;transform:translateX(-50%);background:#fff;border-radius:999px;padding:6px 14px;font-size:20px;font-weight:900;color:#1F2147;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap}\n.smg .rule{font-size:18px;font-weight:900;background:#FFF6D6;color:#5A4300;border-radius:14px;padding:8px 14px}\n.smg .grow{width:100%;height:16px;border-radius:999px;background:var(--line);overflow:hidden}\n.smg .grow i{display:block;height:100%;background:var(--done);border-radius:999px;transition:width .3s}\n.smg .arrows{display:flex;gap:10px;width:100%}\n.smg .arrows button{flex:1;min-height:70px;border-radius:20px;border:none;background:var(--blue);color:#fff;font-size:34px;font-weight:900;box-shadow:0 5px 0 #4C5FC0}\n.smg /* gruppi nell'elenco */\n.group{font-size:14px;font-weight:900;letter-spacing:.6px;text-transform:uppercase;color:var(--soft);margin:6px 4px -4px}\n.smg /* 🔍 differenze */\n.twin{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}\n.smg .board{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;background:linear-gradient(180deg,#E3F0FC,#FFF6E6);border-radius:18px;padding:8px;border:3px solid var(--line)}\n.smg .cell{aspect-ratio:1;border:none;background:none;font-size:30px;border-radius:12px;position:relative;padding:0}\n.smg .cell.found{box-shadow:0 0 0 4px var(--done);background:rgba(72,185,122,.15)}\n.smg .cell.miss{animation:wiggle .4s}\n.smg /* 🎒 zaino e 🛒 mercatino */\n.items{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;width:100%;min-height:100px}\n.smg .item{width:84px;height:96px;border-radius:18px;background:var(--ground);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:40px;border:3px solid var(--line)}\n.smg .item small{font-size:13px;font-weight:900}\n.smg .curtain{width:100%;min-height:100px;border-radius:18px;background:repeating-linear-gradient(90deg,#7048E8 0 22px,#845EF7 22px 44px);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:900}\n.smg .price{font-size:13px;font-weight:900;background:#FFC93C;color:#3D2E00;border-radius:999px;padding:1px 8px}\n.smg .coins{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}\n.smg .coin{width:76px;height:76px;border-radius:50%;border:4px solid #B8860B;background:radial-gradient(circle at 35% 30%,#FFE58A,#F5C542);font-size:22px;font-weight:900;color:#5A4300}\n.smg .coin.note{width:110px;border-radius:14px;border-color:#2F9E44;background:#C3F0CF;color:#1E6B44}\n.smg .paid{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;min-height:52px;width:100%;border:3px dashed var(--line);border-radius:16px;padding:6px}\n.smg .paid span{background:#FFE58A;border-radius:999px;padding:6px 12px;font-weight:900;color:#5A4300}\n.smg .total{font-size:26px;font-weight:900}\n.smg /* 🎯 a colpo d'occhio */\n.flash{width:220px;height:220px;border-radius:24px;background:var(--ground);display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:16px;border:3px solid var(--line)}\n.smg .flash.ten{width:300px;height:132px;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(2,1fr)}\n.smg .flash i{border-radius:50%;background:transparent;aspect-ratio:1;align-self:center;justify-self:center;width:80%}\n.smg .flash i.on{background:var(--blue)}\n.smg .nums{display:flex;gap:10px;justify-content:center}\n.smg .num{width:84px;height:84px;border-radius:20px;border:3px solid var(--line);background:var(--card);font-size:38px;font-weight:900;box-shadow:0 5px 0 var(--line)}\n.smg .num.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 5px 0 #2F8A5A}\n.smg /* 🚦 ferma o vai */\n.light{width:180px;height:180px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:84px;border:8px solid var(--line);background:var(--ground);transition:background .2s,border-color .2s}\n.smg .light.go{background:#48B97A;border-color:#2F8A5A}\n.smg .light.stop{background:#E03131;border-color:#A61E1E}\n.smg .press{width:100%;min-height:96px;border-radius:24px;border:none;background:var(--blue);color:#fff;font-size:26px;font-weight:900;box-shadow:0 6px 0 #4C5FC0}\n.smg .press:active{transform:translateY(4px);box-shadow:0 2px 0 #4C5FC0}\n.smg .score{display:flex;gap:16px;justify-content:center;font-size:17px;font-weight:900}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.smg *{animation:none!important;transition:none!important}}"
export function mountGames(root: HTMLElement, opts: GamesOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left\">Impostazioni</div>\n    <div class=\"set\"><span>🐸 Dove salta Tedo: quante ninfee</span><div class=\"chips\" data-key=\"pads\"></div></div>\n    <div class=\"set\"><span>🧩 La parola spezzata: sillabe scritte</span><div class=\"chips\" data-key=\"written\"></div></div>\n    <div class=\"set\"><span>😊 Come si sente: quante emozioni</span><div class=\"chips\" data-key=\"faces\"></div></div>\n    <div class=\"set\"><span>🐸 Tedo mangione: cosa può mangiare</span><div class=\"chips\" data-key=\"eat\"></div></div>\n    <div class=\"set\"><span>🐸 Tedo mangione: velocità della strada</span><div class=\"chips\" data-key=\"speed\"></div></div>\n  </section>\n  <section data-k=\"view\" style=\"display:flex;flex-direction:column;gap:14px\"></section>"

let S=Object.assign({pads:6,written:true,faces:3,eat:'frutta',speed:'lento'},opts.settings||{});
const OPT={pads:[[6,'6'],[9,'9']],written:[[true,'Sì'],[false,'No']],faces:[[2,'2'],[3,'3']],eat:[['frutta','La frutta'],['grandi','I numeri più grandi di 5'],['pari','I numeri pari']],speed:[['lento','Lenta'],['normale','Normale']]};
const ROUNDS=6;
const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function speak(t,{rate=.88,interrupt=true}={}){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ if(interrupt) speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='it-IT'; u.rate=rate; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('it')); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1200+t.length*100); setTimeout(()=>speechSynthesis.speak(u),interrupt?80:0); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
/* una nota per ogni ninfea: aiuta a ricordare la sequenza anche con l'orecchio */
let AC=null;
function tone(i){ try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const f=[262,294,330,349,392,440,494,523,587][i%9], t=AC.currentTime, o=AC.createOscillator(), g=AC.createGain();
  o.type='triangle'; o.frequency.value=f; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.15,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.35); o.connect(g).connect(AC.destination); o.start(t); o.stop(t+.4); }catch(e){} }
const FROG='<svg viewBox="0 0 100 100" width="70" height="70"><ellipse cx="50" cy="62" rx="36" ry="28" fill="#4FB36C" stroke="#2F7D47" stroke-width="3"/><circle cx="34" cy="34" r="13" fill="#4FB36C" stroke="#2F7D47" stroke-width="3"/><circle cx="66" cy="34" r="13" fill="#4FB36C" stroke="#2F7D47" stroke-width="3"/><circle cx="34" cy="34" r="8" fill="#fff"/><circle cx="66" cy="34" r="8" fill="#fff"/><circle cx="35" cy="35" r="4" fill="#1F2147"/><circle cx="65" cy="35" r="4" fill="#1F2147"/><path d="M36 66 Q50 78 64 66" stroke="#1F2147" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="24" cy="60" r="5" fill="#F59AA0" opacity=".6"/><circle cx="76" cy="60" r="5" fill="#F59AA0" opacity=".6"/></svg>';

function end(st,again,text){ opts.onWin&&opts.onWin(); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask','Fantastico!'),el('p','sub',text)); const b=el('button','btn main','🔄 Ancora'); b.onclick=again; const h=el('button','btn','🎲 Altri giochi'); h.onclick=home; st.append(b,h); speak('Fantastico!'); }

/* ── 🎲 L'elenco dei giochi ── */
const GAMES=[
  ['🧠 Attenzione e memoria'],
  ['memo','🐸','Dove salta Tedo?','Guarda dove salta Tedo, poi rifai i suoi salti.','#2F9E44'],
  ['diff','🔍','Trova le differenze','Due disegni quasi uguali: trova le 3 cose diverse.','#1C7ED6'],
  ['zaino','🎒','Cosa manca nello zaino?','Guarda gli oggetti, uno sparisce: quale?','#F08C00'],
  ['mangia','🐸','Tedo mangione','Tedo va per la strada e mangia solo le cose giuste: più mangia, più diventa grande!','#5CC27A'],
  ['📖 Linguaggio e lettura'],
  ['rima','🎵','La rima di Lila','Quale parola fa rima? Gatto… piatto!','#C2255C'],
  ['sill','🧩','La parola spezzata','Ascolta i pezzetti di una parola e trova l\'immagine.','#7048E8'],
  ['intruso','🕵️','L\'intruso','Tre cose stanno insieme, una no: trovala!','#0B7285'],
  ['🔢 Numeri'],
  ['merc','🛒','Il mercatino di Elio','Elio compra due cose: paga con le monete giuste.','#E8A400'],
  ['colpo','🎯','Quanti sono? A colpo d\'occhio','I pallini compaiono un attimo: quanti erano?','#5F3DC4'],
  ['💛 Emozioni e regole'],
  ['emo','😊','Come si sente?','Leggi cosa succede agli amici e scegli l\'emozione giusta.','#E64980'],
  ['stop','🚦','Ferma o vai?','Tocca solo con il verde: con il rosso si aspetta.','#E03131'],
];
function home(){ hush(); const v=$('view'); v.innerHTML='';
  GAMES.forEach(g=>{ if(g.length===1){ v.appendChild(el('div','group',g[0])); return; }
    const [id,e,t,s,c]=g; const b=el('button','game','<span class="e">'+e+'</span><span><b>'+t+'</b><span>'+s+'</span></span>'); b.style.setProperty('--c',c); b.onclick=()=>({memo,sill,emo,diff,zaino,rima,intruso,merc,colpo,stop,mangia})[id](); v.appendChild(b); }); }
function frame(title){ const v=$('view'); v.innerHTML=''; const b=el('button','back','← I giochi'); b.onclick=home; const c=el('div','card'); v.append(b,c); return c; }

/* ── 🐸 Dove salta Tedo? La sequenza cresce di uno quando è giusta, cala dopo due errori ── */
function memo(){
  hush(); const my=alive; const card=frame(); let len=2, round=0, misses=0;
  const cols=S.pads===9?3:3, rows=S.pads===9?3:2;
  const next=async()=>{
    if(my!==alive) return;
    if(round>=ROUNDS) return end(card,memo,'Hai ricordato tutti i salti di Tedo! Sei arrivato a '+len+' salti.');
    card.innerHTML='';
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<round?'ok':i===round?'on':''));
    const lvl=el('div','level',len+' salti');
    const say=el('div','say','Guarda bene…');
    const pond=el('div','pond'); pond.style.gridTemplateColumns='repeat('+cols+',1fr)'; pond.style.gridTemplateRows='repeat('+rows+',1fr)';
    if(rows===2) pond.style.aspectRatio='3/2';
    const pads=[]; for(let i=0;i<S.pads;i++){ const p=el('button','pad'); p.setAttribute('aria-label','ninfea '+(i+1)); pond.appendChild(p); pads.push(p); }
    const frog=el('div','frog',FROG); pond.appendChild(frog);
    card.append(dots,lvl,say,pond);
    const place=i=>{ const pr=pond.getBoundingClientRect(), r=pads[i].getBoundingClientRect(); frog.style.transform='translate('+(r.left-pr.left+r.width/2-35)+'px,'+(r.top-pr.top+r.height/2-45)+'px)'; };
    // la sequenza: mai due volte di fila la stessa ninfea
    const seq=[]; for(let i=0;i<len;i++){ let k; do{ k=rnd(S.pads); }while(k===seq[seq.length-1]); seq.push(k); }
    await wait(300); frog.style.transition='none'; place(seq[0]); frog.style.opacity='0'; await wait(50); frog.style.transition=''; frog.style.opacity='1';
    speak('Guarda dove salta Tedo!'); await wait(900);
    for(const k of seq){ if(my!==alive) return; place(k); pads[k].classList.add('lit'); tone(k); await wait(600); pads[k].classList.remove('lit'); await wait(200); }
    frog.style.opacity='0';
    say.textContent='Tocca a te! Tocca le ninfee nello stesso ordine.'; speak('Tocca a te!');
    let pos=0, locked=false;
    pads.forEach((p,i)=>p.onclick=async()=>{ if(locked) return; tone(i);
      if(i===seq[pos]){ p.classList.add('ok'); setTimeout(()=>p.classList.remove('ok'),300); pos++;
        if(pos===seq.length){ locked=true; say.textContent='Bravo! 🎉'; speak('Bravo!'); misses=0; round++; len=Math.min(7,len+1); await wait(1100); next(); } }
      else { locked=true; p.classList.add('no'); wiggle(p); pads[seq[pos]].classList.add('lit'); say.textContent='Quasi! La ninfea giusta era quella gialla.'; speak('Quasi! Riproviamo.');
        misses++; if(misses>=2){ len=Math.max(2,len-1); misses=0; } await wait(1600); next(); } });
  };
  next();
}

/* ── 🧩 La parola spezzata: si sentono le sillabe, si trova la parola ── */
const WORDS=[
  [['ca','ne'],'🐶','cane',[['🏠','casa'],['🐴','cavallo']]],
  [['me','la'],'🍎','mela',[['🍈','melone'],['✋','mano']]],
  [['so','le'],'☀️','sole',[['🛋️','sofà'],['🧂','sale']]],
  [['pe','sce'],'🐟','pesce',[['🍐','pera'],['🍞','pane']]],
  [['lu','na'],'🌙','luna',[['🐌','lumaca'],['🧶','lana']]],
  [['ba','le','na'],'🐋','balena',[['🍌','banana'],['🚤','barca']]],
  [['fo','ca'],'🦭','foca',[['🔥','fuoco'],['🌸','fiore']]],
  [['po','mo','do','ro'],'🍅','pomodoro',[['🍎','pomo'],['🚪','porta']]],
];
function sill(){
  hush(); const my=alive; const card=frame(); const list=shuffle(WORDS).slice(0,ROUNDS); let qi=0;
  const next=async()=>{
    if(my!==alive) return;
    if(qi>=list.length) return end(card,sill,'Hai rimesso insieme '+list.length+' parole!');
    const [syl,e,word,dist]=list[qi]; card.innerHTML=''; let misses=0, done=false;
    const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const syls=el('div','syls');
    const again=el('button','btn blue','🔊 Riascolta i pezzetti');
    const pics=el('div','pics');
    card.append(dots,el('p','ask','Che parola è?'),syls,again,pics);
    const play=async()=>{ syls.innerHTML=''; for(const s of syl){ if(my!==alive||done) return; if(S.written) syls.appendChild(el('span','syl',s)); await speak(s,{rate:.7,interrupt:false}); await wait(350); } };
    again.onclick=()=>play();
    shuffle([[e,word,true],...dist.map(([de,dw])=>[de,dw,false])]).forEach(([pe,pw,ok])=>{ const b=el('button','pic',pe+'<small hidden>'+pw+'</small>'); b.setAttribute('aria-label',pw);
      b.onclick=async()=>{ if(done) return;
        if(ok){ done=true; b.classList.add('right'); b.querySelector('small').hidden=false; syls.innerHTML='<span class="syl" style="background:var(--done)">'+word+'</span>'; await speak(syl.join('… ')+'… '+word+'!'); await wait(700); qi++; next(); }
        else { wiggle(b); misses++; b.querySelector('small').hidden=false; speak(pw+'. No, riascolta.'); if(misses>=2) play(); } };
      pics.appendChild(b); });
    await wait(400); play();
  };
  next();
}

/* ── 😊 Come si sente? Una scena con un amico, si sceglie l'emozione (accordata con il personaggio) ── */
const EMO={felice:['😊','felice','felice'],triste:['😢','triste','triste'],arrabbiato:['😠','arrabbiato','arrabbiata'],paura:['😨','spaventato','spaventata'],sorpreso:['😲','sorpreso','sorpresa'],calmo:['😌','calmo','calma']};
const SCENES=[
  {who:'Zoe',f:1,e:'🛝⏳',text:'Zoe vuole andare sullo scivolo, ma la fila è lunghissima e deve aspettare tanto.',ans:'arrabbiato',why:'Aspettare è difficile.',help:'Contare piano fino a 5, come le ha insegnato Lila.'},
  {who:'Nico',f:0,e:'🔊🎉',text:'Nico è a una festa: la musica è fortissima e c\'è tanta gente che grida.',ans:'paura',why:'I rumori forti lo agitano.',help:'Mettere le cuffie, o chiedere di andare in un posto più tranquillo.'},
  {who:'Lila',f:1,e:'🎁🖼️',text:'La sua amica regala a Lila un bellissimo disegno, fatto apposta per lei.',ans:'felice',why:'Ha ricevuto un regalo pensato per lei.',help:'Dire grazie e dare un abbraccio, se le va.'},
  {who:'Elio',f:0,e:'🚗❓',text:'Elio cerca dappertutto la sua macchinina preferita, ma non la trova più.',ans:'triste',why:'Ha perso una cosa a cui tiene.',help:'Chiedere aiuto per cercarla insieme.'},
  {who:'Amina',f:1,e:'🚪🎈',text:'Amina apre la porta e trova tutti i suoi amici che gridano: «Sorpresa!»',ans:'sorpreso',why:'Non se lo aspettava proprio.',help:'Prendere un bel respiro e godersi la festa.'},
  {who:'Meky',f:0,e:'🌬️🧸',text:'Meky ha appena fatto tre respiri lenti nell\'angolo della calma, abbracciando il suo peluche.',ans:'calmo',why:'Respirare piano lo ha aiutato.',help:'Ricordarsi di questo trucco la prossima volta.'},
];
function emo(){
  hush(); const my=alive; const card=frame(); const list=shuffle(SCENES); let qi=0;
  const next=async()=>{
    if(my!==alive) return;
    if(qi>=list.length) return end(card,emo,'Hai capito come si sentono tutti gli amici!');
    const sc=list[qi]; card.innerHTML=''; let done=false;
    const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const scene=el('div','scene','<span class="e">'+sc.e+'</span><p>'+sc.text+'</p>');
    const q='Come si sente '+sc.who+'?';
    const faces=el('div','faces'), tip=el('div','tip'); tip.hidden=true;
    const others=shuffle(Object.keys(EMO).filter(k=>k!==sc.ans)).slice(0,S.faces-1);
    shuffle([sc.ans,...others]).forEach(k=>{ const [e,m,f]=EMO[k], w=sc.f?f:m; const b=el('button','face','<span class="e">'+e+'</span>'+w);
      b.onclick=async()=>{ if(done) return;
        if(k===sc.ans){ done=true; b.classList.add('right');
          tip.innerHTML='💡 '+sc.who+' è '+w+'. '+sc.why+'<br><b>Cosa può aiutare?</b> '+sc.help; tip.hidden=false;
          await speak(sc.who+' è '+w+'. '+sc.why+' Cosa può aiutare? '+sc.help);
          const nb=el('button','btn main','Avanti →'); nb.onclick=()=>{ qi++; next(); }; card.appendChild(nb); }
        else { wiggle(b); speak('Guarda bene cosa succede a '+sc.who+'. Riprova.'); } };
      faces.appendChild(b); });
    card.append(dots,scene,el('p','ask',q),faces,tip);
    speak(sc.text+' '+q);
  };
  next();
}

/* ── 🔍 Trova le differenze: due disegni da 9 caselle, 3 cose cambiate nel secondo ── */
const DIFF_SCENES=[
  ['🌳','☀️','☁️','🏠','🐶','🌸','🚗','⚽','🐦'],
  ['🍎','🧃','🥪','🍌','🧁','🥛','🍪','🍐','🍓'],
  ['🐟','🐠','🐙','🦀','🐚','🌊','⛵','🐬','🪸'],
  ['📚','✏️','📏','🎒','🖍️','✂️','📒','🧮','🕐'],
];
const SWAP={'🌳':'🌲','☀️':'🌙','☁️':'🌈','🏠':'🏰','🐶':'🐱','🌸':'🌻','🚗':'🚌','⚽':'🏀','🐦':'🦋','🍎':'🍏','🧃':'🥤','🥪':'🍕','🍌':'🥕','🧁':'🍩','🥛':'☕','🍪':'🍫','🍐':'🍋','🍓':'🍒','🐟':'🐡','🐠':'🦈','🐙':'🦑','🦀':'🦞','🐚':'⭐','🌊':'🏝️','⛵':'🚤','🐬':'🐳','🪸':'🌿','📚':'📕','✏️':'🖊️','📏':'📐','🎒':'👜','🖍️':'🖌️','✂️':'📎','📒':'📓','🧮':'💻','🕐':'⏰'};
function diff(){
  hush(); const my=alive; const card=frame(); const list=shuffle(DIFF_SCENES); let qi=0;
  const next=()=>{
    if(my!==alive) return;
    if(qi>=list.length) return end(card,diff,'Hai trovato tutte le differenze!');
    const a=list[qi], change=shuffle([0,1,2,3,4,5,6,7,8]).slice(0,3), b=a.map((x,i)=>change.includes(i)?SWAP[x]:x);
    card.innerHTML=''; let found=0;
    const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const left=el('div','board'), right=el('div','board'), cnt=el('div','level','Trovate: 0 di 3');
    const mk=(arr,box)=>arr.forEach((x,i)=>{ const c=el('button','cell',x); c.dataset.i=i; box.appendChild(c); });
    mk(a,left); mk(b,right);
    const twin=el('div','twin'); twin.append(left,right);
    card.append(dots,el('p','ask','Trova le 3 differenze!'),el('p','sub','Tocca le cose diverse, in un disegno o nell\'altro.'),twin,cnt);
    twin.querySelectorAll('.cell').forEach(c=>c.onclick=()=>{ const i=+c.dataset.i;
      if(change.includes(i)){ if(c.classList.contains('found')) return;
        twin.querySelectorAll('.cell[data-i="'+i+'"]').forEach(x=>x.classList.add('found')); found++; cnt.textContent='Trovate: '+found+' di 3'; speak(found<3?'Trovata!':'Bravo, tutte e tre!');
        if(found===3) setTimeout(()=>{ qi++; next(); },1200); }
      else { c.classList.remove('miss'); void c.offsetWidth; c.classList.add('miss'); } });
    speak('Trova le tre differenze!');
  };
  next();
}

/* ── 🎒 Cosa manca nello zaino? Si guardano gli oggetti, uno sparisce ── */
const OBJ=[['📒','quaderno'],['✏️','matita'],['📏','righello'],['🍎','mela'],['🧃','succo'],['🖍️','pastelli'],['✂️','forbici'],['📚','libro'],['🧢','cappello'],['🔑','chiavi'],['🧮','abaco'],['🥪','panino']];
function zaino(){
  hush(); const my=alive; const card=frame(); let qi=0, n=3;
  const next=async()=>{
    if(my!==alive) return;
    if(qi>=ROUNDS) return end(card,zaino,'Che memoria! Sei arrivato a ricordare '+n+' oggetti.');
    card.innerHTML='';
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<qi?'ok':i===qi?'on':''));
    const pick=shuffle(OBJ).slice(0,n), gone=pick[rnd(n)];
    const ask=el('p','ask','Guarda bene cosa c\'è nello zaino…'), box=el('div','items');
    pick.forEach(([e,w])=>box.appendChild(el('div','item',e+'<small>'+w+'</small>')));
    card.append(dots,el('div','level',n+' oggetti'),ask,box);
    speak('Guarda bene cosa c\'è nello zaino.'); await wait(2500+n*600); if(my!==alive) return;
    box.replaceWith(el('div','curtain','🎒 Chiudo lo zaino…')); await wait(1300); if(my!==alive) return;
    const cur=card.querySelector('.curtain'); const left=el('div','items');
    shuffle(pick.filter(x=>x!==gone)).forEach(([e,w])=>left.appendChild(el('div','item',e+'<small>'+w+'</small>'))); cur.replaceWith(left);
    ask.textContent='Che cosa manca?'; speak('Che cosa manca?');
    const others=shuffle(OBJ.filter(x=>!pick.includes(x))).slice(0,2), row=el('div','items');
    let done=false;
    shuffle([gone,...others]).forEach(o=>{ const b=el('button','item',o[0]+'<small>'+o[1]+'</small>');
      b.onclick=async()=>{ if(done) return;
        if(o===gone){ done=true; b.style.borderColor='var(--done)'; b.style.background='var(--done-bg)'; await speak('Giusto! Mancava '+o[1]+'.'); qi++; n=Math.min(6,n+1); next(); }
        else { wiggle(b); speak('No, '+o[1]+' non c\'era. Riprova.'); } };
      row.appendChild(b); });
    card.append(el('p','sub','Tocca l\'oggetto che è sparito:'),row);
  };
  next();
}

/* ── 🎵 La rima di Lila: quale parola finisce con lo stesso suono? ── */
const RIME=[
  ['gatto','🐱',['piatto','🍽️'],[['sole','☀️'],['cane','🐶']]],
  ['cuore','❤️',['fiore','🌸'],[['mano','✋'],['palla','⚽']]],
  ['pane','🍞',['cane','🐶'],[['libro','📖'],['sole','☀️']]],
  ['luna','🌙',['duna','🏜️'],[['gelato','🍦'],['tavolo','🪑']]],
  ['stella','⭐',['padella','🍳'],[['pane','🍞'],['fuoco','🔥']]],
  ['nave','🚢',['chiave','🔑'],[['luna','🌙'],['pesce','🐟']]],
  ['letto','🛏️',['tetto','🏠'],[['fiore','🌸'],['sole','☀️']]],
  ['rana','🐸',['banana','🍌'],[['topo','🐭'],['libro','📖']]],
];
const RIME_OK=RIME;
function rima(){
  hush(); const my=alive; const card=frame(); const list=shuffle(RIME_OK).slice(0,ROUNDS); let qi=0;
  const next=()=>{
    if(my!==alive) return;
    if(qi>=list.length) return end(card,rima,'Hai trovato tutte le rime con Lila!');
    const [w,e,[rw,re],dist]=list[qi]; card.innerHTML=''; let done=false;
    const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const head=el('div','item',e+'<small>'+w+'</small>'); head.style.width='120px'; head.style.height='120px'; head.style.fontSize='56px';
    const pics=el('div','pics');
    const hear=el('button','btn blue','🔊 Ascolta'); hear.onclick=()=>speak(w+' fa rima con…');
    shuffle([[re,rw,true],...dist.map(([dw,de])=>[de,dw,false])]).forEach(([pe,pw,ok])=>{ const b=el('button','pic',pe+'<small>'+pw+'</small>');
      b.onclick=async()=>{ if(done) return; speak(pw);
        if(ok){ done=true; b.classList.add('right'); await wait(500); await speak(w+', '+pw+'! Finiscono con lo stesso suono.'); qi++; next(); }
        else { wiggle(b); setTimeout(()=>speak('Ascolta la fine: '+w+'… '+pw+'. Non suonano uguali.'),600); } };
      pics.appendChild(b); });
    card.append(dots,el('p','ask','Cosa fa rima con…'),head,hear,pics);
    speak(w+' fa rima con…');
  };
  next();
}

/* ── 🕵️ L'intruso: tre cose della stessa famiglia e una no ── */
const CATS={frutta:['🍎','🍌','🍐','🍓','🍇','🍊'],animali:['🐶','🐱','🐰','🐻','🦁','🐮'],veicoli:['🚗','🚌','🚂','✈️','🚲','🚤'],vestiti:['👕','👖','🧦','🧢','👟','🧥'],scuola:['✏️','📏','📒','🖍️','✂️','📚'],musica:['🎸','🥁','🎺','🎹','🎻','🪗']};
const CAT_NAME={frutta:'frutti',animali:'animali',veicoli:'mezzi per viaggiare',vestiti:'vestiti',scuola:'cose per la scuola',musica:'strumenti musicali'};
function intruso(){
  hush(); const my=alive; const card=frame(); let qi=0;
  const next=()=>{
    if(my!==alive) return;
    if(qi>=ROUNDS) return end(card,intruso,'Sei un detective bravissimo!');
    const keys=Object.keys(CATS), cat=keys[rnd(keys.length)], other=shuffle(keys.filter(k=>k!==cat))[0];
    const three=shuffle(CATS[cat]).slice(0,3), odd=CATS[other][rnd(6)];
    card.innerHTML=''; let done=false;
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<qi?'ok':i===qi?'on':''));
    const g=el('div','pics'); g.style.gridTemplateColumns='repeat(2,1fr)';
    shuffle([...three,odd]).forEach(x=>{ const b=el('button','pic',x);
      b.onclick=async()=>{ if(done) return;
        if(x===odd){ done=true; b.classList.add('right'); await speak('Giusto! Gli altri sono tutti '+CAT_NAME[cat]+'.'); qi++; next(); }
        else { wiggle(b); speak('Questo sta con gli altri. Cerca quello diverso.'); } };
      g.appendChild(b); });
    card.append(dots,el('p','ask','Chi è l\'intruso?'),el('p','sub','Tre cose stanno insieme. Una no!'),g);
    speak('Chi è l\'intruso?');
  };
  next();
}

/* ── 🛒 Il mercatino di Elio: due cose, il totale, e si paga con monete e banconote ── */
const GOODS=[['🍎','mela',1,'una'],['🍌','banana',1,'una'],['🧃','succo',2,'un'],['🥐','cornetto',2,'un'],['🍦','gelato',3,'un'],['📒','quaderno',3,'un'],['🧸','orsetto',5,'un'],['⚽','pallone',4,'un']];   // icona, nome, prezzo, articolo
function merc(){
  hush(); const my=alive; const card=frame(); let qi=0;
  const next=()=>{
    if(my!==alive) return;
    if(qi>=ROUNDS) return end(card,merc,'Elio ha fatto tutta la spesa: bravo cassiere!');
    const [a,b]=shuffle(GOODS).slice(0,2), tot=a[2]+b[2];
    card.innerHTML=''; let paid=[], step='sum';
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<qi?'ok':i===qi?'on':''));
    const items=el('div','items'); [a,b].forEach(([e,w,pr])=>items.appendChild(el('div','item',e+'<small>'+w+'</small><span class="price">'+pr+' €</span>')));
    const ask=el('p','ask','Elio compra '+a[3]+' '+a[1]+' e '+b[3]+' '+b[1]+'. Quanto paga?');
    const nums=el('div','nums');
    card.append(dots,items,ask,nums);
    // prima il totale, poi si paga
    shuffle([tot,tot+1,Math.max(2,tot-1)].filter((x,i,arr)=>arr.indexOf(x)===i)).forEach(n=>{ const bt=el('button','num',n+'€'); bt.style.fontSize='28px';
      bt.onclick=()=>{ if(step!=='sum') return;
        if(n===tot){ bt.classList.add('right'); step='pay'; speak(a[2]+' più '+b[2]+' fa '+tot+'. Adesso paga '+tot+' euro.'); setTimeout(pay,700); }
        else { wiggle(bt); speak('Prova a sommare: '+a[2]+' più '+b[2]+'.'); } };
      nums.appendChild(bt); });
    speak(ask.textContent);
    function pay(){
      nums.remove(); ask.textContent='Paga '+tot+' €: tocca le monete';
      const box=el('div','paid'), sum=el('div','total','0 €'), coins=el('div','coins');
      [[1,'coin'],[2,'coin'],[5,'coin note']].forEach(([v,c])=>{ const bt=el('button',c,v+' €'); bt.onclick=()=>{ paid.push(v); draw(); speak(v+' euro'); }; coins.appendChild(bt); });
      const undo=el('button','btn','↩️ Togli'); undo.onclick=()=>{ paid.pop(); draw(); };
      const go=el('button','btn main','Paga'); go.onclick=async()=>{ const s=paid.reduce((x,y)=>x+y,0);
        if(s===tot){ await speak('Perfetto! Hai pagato '+tot+' euro.'); qi++; next(); }
        else if(s<tot){ wiggle(box); speak('Mancano '+(tot-s)+' euro.'); }
        else { wiggle(box); speak('Troppi! Hai messo '+s+' euro, ne servono '+tot+'.'); } };
      const draw=()=>{ box.innerHTML=paid.map(v=>'<span>'+v+' €</span>').join(''); sum.textContent=paid.reduce((x,y)=>x+y,0)+' €'; };
      const r=el('div','row'); r.style.cssText='display:flex;gap:10px;justify-content:center'; r.append(undo,go);
      card.append(coins,box,sum,r);
    }
  };
  next();
}

/* ── 🎯 A colpo d'occhio: i pallini si vedono un attimo, poi si dice quanti erano ── */
const DICE={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
function colpo(){
  hush(); const my=alive; const card=frame(); let qi=0, max=5;
  const next=async()=>{
    if(my!==alive) return;
    if(qi>=ROUNDS) return end(card,colpo,'Che occhio! Riconosci le quantità a colpo d\'occhio.');
    const n=1+rnd(max); card.innerHTML=''; let done=false;
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<qi?'ok':i===qi?'on':''));
    // fino a 6 come sul dado; più di 6 nella "tabella del dieci" (due file da 5)
    const ten=n>6, f=el('div','flash'+(ten?' ten':''));
    const cells=ten?10:9, on=ten?[...Array(n).keys()]:DICE[n];
    for(let i=0;i<cells;i++) f.appendChild(el('i',on.includes(i)?'on':''));
    const ask=el('p','ask','Pronto? Guarda bene…');
    card.append(dots,ask,f);
    await wait(900); f.style.visibility='hidden'; await wait(100); f.style.visibility='visible';
    speak('Quanti sono?'); await wait(1400); if(my!==alive) return;
    f.querySelectorAll('i').forEach(i=>i.classList.remove('on'));
    ask.textContent='Quanti pallini c\'erano?';
    const nums=el('div','nums'), opts=shuffle([n,...shuffle([1,2,3,4,5,6,7,8,9,10].filter(x=>x!==n&&Math.abs(x-n)<=2)).slice(0,2)]);
    opts.forEach(x=>{ const b=el('button','num',x); b.onclick=async()=>{ if(done) return;
      if(x===n){ done=true; b.classList.add('right'); f.querySelectorAll('i').forEach((i,k)=>{ if(on.includes(k)) i.classList.add('on'); }); await speak('Giusto, '+n+'!'); await wait(700); qi++; max=Math.min(10,max+1); next(); }
      else { wiggle(b); f.querySelectorAll('i').forEach((i,k)=>{ if(on.includes(k)) i.classList.add('on'); }); speak('Guardali di nuovo.'); setTimeout(()=>f.querySelectorAll('i').forEach(i=>i.classList.remove('on')),1500); } };
      nums.appendChild(b); });
    card.appendChild(nums);
  };
  next();
}

/* ── 🚦 Ferma o vai? Si tocca solo con il verde. Ritmo lento, senza fretta ── */
function stop(){
  hush(); const my=alive; const card=frame();
  const seq=shuffle(['go','go','go','go','go','go','stop','stop','stop','stop']);
  let hits=0, waited=0, oops=0, i=-1, state='wait', tapped=false;
  card.innerHTML='';
  const light=el('div','light','🐸'), say=el('p','ask','Tocca il bottone solo quando è verde!'), press=el('button','press','👆 Tocca!'), score=el('div','score','');
  const draw=()=>{ score.innerHTML='<span>✅ '+hits+'</span><span>✋ Aspettato: '+waited+'</span>'; };
  draw(); card.append(say,light,press,score);
  press.onclick=()=>{ if(tapped) return; tapped=true;
    if(state==='go'){ hits++; speak('Sì!'); light.textContent='😄'; }
    else if(state==='stop'){ oops++; speak('Aspetta il verde!'); light.textContent='😮'; wiggle(press); }
    draw(); };
  const step=async()=>{
    if(my!==alive) return;
    if(state==='stop'&&!tapped) waited++;
    i++; draw();
    if(i>=seq.length){ return end(card,stop,'Hai toccato '+hits+' volte con il verde e hai aspettato il rosso '+waited+' volte su 4!'); }
    state='wait'; tapped=true; light.className='light'; light.textContent='🐸'; await wait(700); if(my!==alive) return;
    state=seq[i]; tapped=false; light.className='light '+state; light.textContent=state==='go'?'🟢':'✋';
    if(state==='stop') speak('Rosso: aspetta!');
    await wait(1700); step();
  };
  speak('Tocca il bottone solo quando è verde. Con il rosso si aspetta!'); setTimeout(step,1500);
}

/* ── 🐸 Tedo mangione: le cose arrivano lungo la strada; Tedo cambia corsia e mangia solo quelle giuste.
      Ogni cosa giusta lo fa crescere un po'; dopo 10 è grandissimo. Le cose sbagliate: "Bleah!", senza punizioni. ── */
const EAT_RULES={
  frutta:{text:'Mangia solo la frutta!',good:['🍎','🍌','🍐','🍓','🍇','🍊','🍒','🍉'],bad:['👟','🧦','📏','🔑','🧸','⚽','✏️','🪨']},
  grandi:{text:'Mangia solo i numeri più grandi di 5!',good:['6','7','8','9','10'],bad:['1','2','3','4','5'],num:true},
  pari:{text:'Mangia solo i numeri pari!',good:['2','4','6','8','10'],bad:['1','3','5','7','9'],num:true},
};
function mangia(){
  hush(); const my=alive; const card=frame(); card.innerHTML='';
  const R=EAT_RULES[S.eat], GOAL=10, speed=S.speed==='lento'?70:105;   // pixel al secondo
  let lane=1, size=1, eaten=0, foods=[], last=0, spawnIn=600, running=true;
  const rule=el('div','rule','🐸 '+R.text), grow=el('div','grow','<i style="width:0%"></i>');
  const road=el('div','road'); const lanes=[0,1,2].map(i=>{ const b=el('button','lane'); b.setAttribute('aria-label','corsia '+(i+1)); b.onclick=()=>move(i); road.appendChild(b); return b; });
  const tedo=el('div','tedo',FROG.replace('width="70" height="70"','width="80" height="80"')), bub=el('div','bubble2','');
  road.append(tedo,bub);
  const arrows=el('div','arrows'); const L=el('button','','⬅️'), Rt=el('button','','➡️'); L.setAttribute('aria-label','sinistra'); Rt.setAttribute('aria-label','destra');
  L.onclick=()=>move(lane-1); Rt.onclick=()=>move(lane+1); arrows.append(L,Rt);
  card.append(rule,grow,road,arrows,el('p','sub','Tocca una corsia, o usa le frecce, per spostare Tedo.'));
  const laneX=i=>(i+0.5)*road.clientWidth/3;
  function move(i){ lane=Math.max(0,Math.min(2,i)); tedo.style.left=laneX(lane)+'px'; }
  function say(t){ bub.textContent=t; bub.style.opacity=1; clearTimeout(say.h); say.h=setTimeout(()=>bub.style.opacity=0,700); }
  function drawTedo(){ tedo.style.transform='scale('+size.toFixed(3)+')'; grow.firstChild.style.width=(eaten/GOAL*100)+'%'; }
  move(1); drawTedo();
  // una nuova cosa sulla strada: 6 su 10 giuste
  function spawn(){ const good=Math.random()<.6, list=good?R.good:R.bad, v=list[rnd(list.length)], ln=rnd(3);
    const f=el('div','food'+(R.num?' num':''),v); f.style.left=laneX(ln)+'px'; road.insertBefore(f,tedo);
    foods.push({el:f,lane:ln,y:-60,good}); }
  function frameLoop(t){
    if(my!==alive||!running) return;
    const dt=last?Math.min(.05,(t-last)/1000):0; last=t;
    spawnIn-=dt*1000; if(spawnIn<=0){ spawn(); spawnIn=S.speed==='lento'?2100:1600; }
    const H=road.clientHeight, mouth=H-22-80*size*0.55;
    foods=foods.filter(f=>{ f.y+=speed*dt; f.el.style.top=f.y+'px';
      if(f.y+40>=mouth&&f.y<H-20){
        if(f.lane===lane){ f.el.remove();
          if(f.good){ eaten++; size=Math.min(2.1,1+eaten*0.11); say('Gnam! 😋'); tone(4+eaten%5); speak(['Gnam!','Buono!','Gnam gnam!'][rnd(3)]); drawTedo();
            if(eaten>=GOAL){ running=false; setTimeout(()=>end(card,mangia,'Tedo ha mangiato '+GOAL+' cose giuste ed è diventato grandissimo!'),900); } }
          else { say('Bleah! 🤢'); speak('Bleah! Questo non si mangia.'); tedo.animate([{transform:'scale('+size+') rotate(-8deg)'},{transform:'scale('+size+') rotate(8deg)'},{transform:'scale('+size+')'}],{duration:400}); }
          return false; } }
      if(f.y>H){ f.el.remove(); return false; }
      return true; });
    requestAnimationFrame(frameLoop);
  }
  speak(R.text); setTimeout(()=>requestAnimationFrame(frameLoop),1200);
}

function chips(){ root.querySelectorAll('[data-k="panel"] .chips').forEach(box=>{ const k=box.dataset.key; box.innerHTML='';
  OPT[k].forEach(([v,l])=>{ const c=el('button','chip',l); c.setAttribute('aria-pressed',String(S[k]===v)); c.onclick=()=>{ S[k]=v; chips(); opts.onSettings&&opts.onSettings(Object.assign({},S)); }; box.appendChild(c); }); }); }
if(opts.allowSettings){ root.querySelector('[data-k="panel"]').hidden=false; chips(); }
home();

  // quando si esce dalla sezione: si ferma la voce e qualunque gioco in corso
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
