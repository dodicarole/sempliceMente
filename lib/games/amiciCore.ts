// @ts-nocheck
/*
 * 🤝 Gli amici del 10 (e del 100 e del 1000): sei livelli, Scopri (cornice, dita, arcobaleno), Trova l'amico (con gli errori
 * tipici), Il salto di Tedo, Memory, Completa e I trucchi (togli gli zeri; unità amiche del 10 e decine amiche del 9; salti).
 * Lo stesso codice del prototipo già provato, dentro un contenitore con la classe "sma10". Impostazioni per figlio (amici_impostazioni).
 */
export interface AmiciOptions { mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void; accent?: string }
export const AMICI_CSS = ".sma10{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#5468D8;--radius:22px;\n  --h:#2F9E44;--da:#E03131;--u:#1C7ED6;\n  box-sizing:border-box}\n\n.sma10 *{box-sizing:border-box}\n.sma10{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.sma10 button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation}\n.sma10 button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.sma10 [hidden]{display:none!important}\n.sma10 .app{max-width:560px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.sma10 .title{background:var(--card);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.sma10 .title .l{display:flex;align-items:center;gap:12px}\n.sma10 .title .em{font-size:36px}\n.sma10 .title h1{margin:0;font-size:21px;font-weight:900}\n.sma10 .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.sma10 .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.sma10 .levels{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}\n.sma10 .lv{flex:none;min-height:44px;padding:0 12px;border-radius:999px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:900}\n.sma10 .lv[aria-pressed=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.sma10 .tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.sma10 .tab{min-height:54px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:800;line-height:1.2;padding:0 4px}\n.sma10 .tab[aria-current=\"true\"]{background:#E8590C;border-color:#E8590C;color:#fff}\n.sma10 .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.sma10 .ask{margin:0;font-size:23px;font-weight:900;line-height:1.3}\n.sma10 .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.sma10 .dots{display:flex;gap:6px}\n.sma10 .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.sma10 .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.sma10 .dots .ok{background:var(--done)}\n.sma10 .dots .ko{background:#FFA94D}\n.sma10 /* i numeri con i colori dei posti: centinaia verdi,.sma10 decine rosse,.sma10 unità blu */\n.num{font-size:54px;font-weight:900;font-variant-numeric:tabular-nums;line-height:1}\n.sma10 .num .h{color:var(--h)}\n.sma10 .num .da{color:var(--da)}\n.sma10 .num .u{color:var(--u)}\n.sma10 .eq{display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap;font-size:44px;font-weight:900}\n.sma10 .gap{min-width:90px;height:64px;border-radius:14px;border:3px dashed var(--blue);display:inline-flex;align-items:center;justify-content:center;color:var(--blue)}\n.sma10 .gap.ok{border-style:solid;border-color:var(--done);background:var(--done-bg);color:var(--done)}\n.sma10 /* la cornice del 10 e la griglia */\n.frame{display:grid;grid-template-columns:repeat(5,52px);gap:6px;padding:8px;border-radius:14px;background:var(--ground)}\n.sma10 .cell{width:52px;height:52px;border-radius:12px;border:3px solid var(--line);background:var(--card)}\n.sma10 .cell.on{background:var(--u);border-color:var(--u)}\n.sma10 .cell.friend{background:#FFE066;border-color:#F0C93C}\n.sma10 .grid{display:grid;gap:2px;padding:6px;border-radius:12px;background:var(--ground)}\n.sma10 .grid i{display:block;aspect-ratio:1;border-radius:3px;background:var(--card);border:1px solid var(--line)}\n.sma10 .grid i.on{background:var(--c);border-color:var(--c)}\n.sma10 .grid i.friend{background:#FFE066;border-color:#F0C93C}\n.sma10 /* l'arcobaleno */\n.rain{width:100%;max-width:440px}\n.sma10 .rain text{font-weight:900;font-size:22px}\n.sma10 /* le dita */\n.hands{display:flex;gap:18px;justify-content:center}\n.sma10 .hand{display:flex;gap:4px;align-items:flex-end;padding:8px 10px 0;border-radius:16px 16px 26px 26px;background:var(--ground)}\n.sma10 .fi{width:16px;border-radius:8px 8px 4px 4px;background:#F2C7A5;border:2px solid #D9A273}\n.sma10 .fi.down{height:20px;background:#FFE066;border-color:#F0C93C}\n.sma10 /* le risposte */\n.opts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%}\n.sma10 .opts.two{grid-template-columns:repeat(2,1fr)}\n.sma10 .opt{min-height:72px;border-radius:18px;border:3px solid var(--line);background:var(--card);font-size:34px;font-weight:900;box-shadow:0 5px 0 var(--line);font-variant-numeric:tabular-nums}\n.sma10 .opt.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 5px 0 #2F8A5A}\n.sma10 .wrong{animation:wiggle .4s}\n.sma10 .hint{width:100%;border-radius:14px;padding:10px 12px;font-size:16px;font-weight:800;line-height:1.5;text-align:left;background:#FFF6D6;color:#5A4300}\n.sma10 .hint .num{font-size:24px}\n.sma10 /* la linea dei numeri */\n.line{width:100%}\n.sma10 .pad{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;width:100%;max-width:380px}\n.sma10 .key{min-height:56px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:26px;font-weight:900;box-shadow:0 3px 0 var(--line)}\n.sma10 .key.ok{background:var(--done);border-color:var(--done);color:#fff}\n.sma10 .mem{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:100%}\n.sma10 .mc{aspect-ratio:3/4;perspective:600px;border:none;background:none;padding:0}\n.sma10 .mc .in{position:relative;width:100%;height:100%;transition:transform .4s;transform-style:preserve-3d}\n.sma10 .mc.open .in{transform:rotateY(180deg)}\n.sma10 .mc .bk,.sma10 .mc .fr{position:absolute;inset:0;backface-visibility:hidden;border-radius:14px;display:flex;align-items:center;justify-content:center}\n.sma10 .mc .bk{background:#E8590C;color:#fff;font-size:26px;font-weight:900}\n.sma10 .mc .fr{background:var(--card);border:3px solid var(--line);transform:rotateY(180deg);font-size:26px;font-weight:900}\n.sma10 .mc .fr .num{font-size:26px}\n.sma10 .mc.done .fr{background:var(--done-bg);border-color:var(--done)}\n.sma10 /* i trucchi */\n.trick{width:100%;border-radius:18px;border:3px solid var(--c);padding:14px;text-align:left;display:flex;flex-direction:column;gap:8px}\n.sma10 .trick b.t{font-size:18px;color:var(--c)}\n.sma10 .trick p{margin:0;font-size:16px;font-weight:700;line-height:1.5}\n.sma10 .steps{display:flex;flex-direction:column;gap:6px;width:100%}\n.sma10 .stp{display:flex;align-items:center;gap:10px;justify-content:center;font-size:22px;font-weight:900;background:var(--ground);border-radius:12px;padding:8px}\n.sma10 .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.sma10 .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.sma10 .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.sma10 .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}\n.sma10 .star{font-size:64px;animation:pop .5s ease-out}\n.sma10 .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.sma10 .set{display:flex;flex-direction:column;gap:8px}\n.sma10 .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.sma10 .chips{display:flex;gap:8px;flex-wrap:wrap}\n.sma10 .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.sma10 .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.sma10 *{animation:none!important;transition:none!important}}"
export function mountAmici(root: HTMLElement, opts: AmiciOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left;font-size:20px\">Impostazioni (area genitore)</div>\n    <div class=\"set\"><span>🪜 I livelli che il bambino può usare (si sbloccano man mano)</span><div class=\"chips\" data-k=\"lvset\"></div></div>\n    <div class=\"set\"><span>🧩 L'aiuto da vedere (cornice, griglia o blocchi)</span><div class=\"chips\" data-key=\"pic\"></div></div>\n    <div class=\"set\"><span>🔢 Quante risposte tra cui scegliere</span><div class=\"chips\" data-key=\"n\"></div></div>\n    <div class=\"set\"><span>🎯 Quanti esercizi per giro</span><div class=\"chips\" data-key=\"len\"></div></div>\n    \n  </section>\n  <div class=\"levels\" data-k=\"levels\"></div>\n  <nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <section class=\"card\" data-k=\"stage\"></section>"
const __win = opts.onWin

/* ── i sei livelli ── */
const LV=[
 {id:1,name:'1 · Amici del 10',T:10,pick:()=>rnd(11),txt:'Gli amici del 10'},
 {id:2,name:'2 · 100 con le decine',T:100,pick:()=>(1+rnd(9))*10,txt:'Gli amici del 100, con le decine'},
 {id:3,name:'3 · 100 con tutti',T:100,pick:()=>{ let a; do{ a=1+rnd(99); }while(a%10===0&&rnd(3)); return a; },txt:'Gli amici del 100, con tutti i numeri'},
 {id:4,name:'4 · 1000 con le centinaia',T:1000,pick:()=>(1+rnd(9))*100,txt:'Gli amici del 1000, con le centinaia'},
 {id:5,name:'5 · 1000 con le decine',T:1000,pick:()=>{ let a; do{ a=(1+rnd(99))*10; }while(a%100===0); return a; },txt:'Gli amici del 1000, con le decine'},
 {id:6,name:'6 · 1000 con tutti',T:1000,pick:()=>{ let a; do{ a=101+rnd(898); }while(a%10===0); return a; },txt:'Gli amici del 1000, con tutti i numeri'},
];
const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
let S=Object.assign({open:[1,2],lv:1,pic:true,n:3,len:6},store('amici_impostazioni',{}));
const OPT={pic:[[true,'Sì'],[false,'No']],n:[[2,'2'],[3,'3']],len:[[6,'6'],[8,'8'],[10,'10']]};
const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function speak(t){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='it-IT'; u.rate=.88; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('it')); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1400+t.length*90); setTimeout(()=>speechSynthesis.speak(u),60); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
const L=()=>LV.find(l=>l.id===S.lv);
/* un numero con i colori dei posti */
function numHTML(n,cls){ const s=String(n), k=s.length, P=['u','da','h','k']; return '<span class="num '+(cls||'')+'">'+s.split('').map((c,i)=>'<span class="'+(P[k-1-i]==='k'?'h':P[k-1-i])+'">'+c+'</span>').join('')+'</span>'; }
/* le risposte sbagliate: gli errori tipici, vicini a quella giusta */
function wrongs(a,T){ const f=T-a, out=new Set();
  const add=x=>{ if(x>=0&&x<=T&&x!==f) out.add(x); };
  if(T===10){ add(f+1); add(f-1); add(f+2); add(a); }
  else { const s=String(a).padStart(String(T).length-1,'0');
    // l'errore più tipico: tutte le cifre come amiche del 10 (37 → 73), invece di decine e centinaia amiche del 9
    add(+s.split('').map(c=>(10-(+c))%10).join(''));
    add(f+10); add(f-10); add(f+1); add(f-1); if(T===1000){ add(f+100); add(f-100); } }
  return shuffle([...out]).slice(0,S.n-1); }
/* il trucco, passo per passo, per un numero */
function trickSteps(a,T){
  if(T===10) return [['Alza '+a+(a===1?' dito':' dita')+': quelle giù sono l’amico','🖐️'],[a+' e '+(10-a)+' fanno 10','🤝']];
  const zeros=T===100?1:2, s=String(a);
  if(a%(T/10)===0){ const small=a/(T/10); return [['Togli '+(zeros===1?'lo zero':'i due zeri')+': '+a+' diventa '+small,'✂️'],['L’amico del 10 di '+small+' è '+(10-small),'🤝'],['Rimetti '+(zeros===1?'lo zero':'gli zeri')+': '+(10-small)*(T/10),'➕']]; }
  if(T===1000&&a%10===0){ const small=a/10; return [['Togli lo zero: '+a+' diventa '+small,'✂️'],['L’amico del 100 di '+small+' è '+(100-small),'🤝'],['Rimetti lo zero: '+(1000-a),'➕']]; }
  const d=s.padStart(T===100?2:3,'0').split('').map(Number), out=d.map((c,i)=>i===d.length-1?10-c:9-c);
  const names=T===100?['decine','unità']:['centinaia','decine','unità'];
  return [...names.map((nm,i)=>[(i===d.length-1?'Le '+nm+': '+d[i]+' e '+out[i]+' fanno 10':'Le '+nm+': '+d[i]+' e '+out[i]+' fanno 9'),i===d.length-1?'🔟':'9️⃣']),['L’amico di '+a+' è '+(T-a)+'!','🤝']];
}
/* l'aiuto da vedere: la cornice del 10, la griglia del 100 (ogni casella vale 1 o 10), o i blocchi del 1000 */
function visual(a,T,showFriend){
  if(!S.pic) return el('div');
  if(T===10){ const f=el('div','frame'); for(let i=0;i<10;i++) f.appendChild(el('div','cell'+(i<a?' on':(showFriend?' friend':'')))); return f; }
  const unit=T===100?1:10, cells=100, filled=Math.floor(a/unit), g=el('div','grid'); g.style.gridTemplateColumns='repeat(10,1fr)'; g.style.width='min(100%,320px)';
  for(let i=0;i<cells;i++){ const c=el('i',i<filled?'on':(showFriend?'friend':'')); c.style.setProperty('--c',T===100?'var(--da)':'var(--h)'); g.appendChild(c); }
  const box=el('div'); box.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px;width:100%'; box.append(g,el('span','sub',T===100?'Ogni quadretto vale 1':'Ogni quadretto vale 10'+(a%10?' (le unità non si vedono)':''))); return box; }

/* ── le schede ── */
let tab=0, qi=0, score=0, ko=[];
const TABS=[['👀 Scopri',discover],['🎯 Trova l’amico',findQ],['🐸 Il salto di Tedo',jump],['🃏 Memory',memory],['🧩 Completa',complete],['💡 I trucchi',tricks]];
function levelsBar(){ const b=$('levels'); b.innerHTML=''; LV.filter(l=>S.open.includes(l.id)).forEach(l=>{ const x=el('button','lv',l.name); x.setAttribute('aria-pressed',String(S.lv===l.id)); x.onclick=()=>{ S.lv=l.id; keepS('amici_impostazioni',S); start(); }; b.appendChild(x); }); }
function tabsBar(){ const t=$('tabs'); t.innerHTML=''; TABS.forEach(([l],i)=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(i===tab)); b.onclick=()=>{ tab=i; start(); }; t.appendChild(b); }); }
function start(){ hush(); if(!S.open.includes(S.lv)) S.lv=S.open[0]; levelsBar(); tabsBar(); qi=0; score=0; ko=[]; TABS[tab][1](); }
const dotsEl=()=>{ const d=el('div','dots'); for(let k=0;k<S.len;k++) d.appendChild(el('span',k<qi?(ko.includes(k)?'ko':'ok'):k===qi?'on':'')); return d; };
function finish(again){ __win&&__win(); const st=$('stage'); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask',score===S.len?'Perfetto!':'Bravo! '+score+' su '+S.len+' al primo colpo.')); const b=el('button','btn main','🔄 Ancora'); b.onclick=()=>{ qi=0; score=0; ko=[]; again(); }; st.appendChild(b); speak('Bravo!'); }
/* un numero nuovo, diverso dagli ultimi */
let last=[]; function pickA(){ let a, k=0; do{ a=L().pick(); k++; }while(last.includes(a)&&k<20); last=[...last.slice(-4),a]; return a; }

/* ── 👀 Scopri ── */
function discover(){ hush(); const st=$('stage'); st.innerHTML=''; const T=L().T;
  if(T===10){
    st.append(el('p','ask','Tocca le caselle: quante ne mancano per fare 10?'));
    let a=7; const f=el('div','frame'), say=el('div','eq');
    const draw=()=>{ f.innerHTML=''; for(let i=0;i<10;i++){ const c=el('button','cell'+(i<a?' on':' friend')); c.onclick=()=>{ a=i+1===a?i:i+1; draw(); speak(a+' e '+(10-a)+' fanno 10'); }; f.appendChild(c); }
      say.innerHTML=numHTML(a)+'<span>+</span>'+'<span class="num" style="color:#E8A400">'+(10-a)+'</span><span>=</span>'+numHTML(10); };
    draw(); st.append(f,say);
    // le dita
    const hands=el('div','hands'); const drawH=()=>{ hands.innerHTML=''; [0,1].forEach(h=>{ const hd=el('div','hand'); for(let i=0;i<5;i++){ const k=h*5+i, up=k<a; const fi=el('div','fi'+(up?'':' down')); fi.style.height=up?[38,52,58,52,42][i]+'px':'20px'; hd.appendChild(fi); } hands.appendChild(hd); }); };
    drawH(); const ob=new MutationObserver(drawH); ob.observe(say,{childList:true}); st.append(el('p','sub','Con le dita: alzate le caselle blu, giù le gialle.'),hands);
    // l'arcobaleno degli amici
    st.append(el('p','ask','🌈 L’arcobaleno degli amici'),rainbow(),el('p','sub','Ogni arco unisce due amici. Il 5 è amico di sé stesso!'));
    speak('Tocca le caselle: quante ne mancano per fare dieci?');
  } else {
    const a=pickA(); st.append(el('p','ask',L().txt),el('div','eq',numHTML(a)+'<span>+</span><span class="num" style="color:#E8A400">'+(T-a)+'</span><span>=</span>'+numHTML(T)),visual(a,T,true));
    const steps=el('div','steps'); trickSteps(a,T).forEach(([t,e])=>steps.appendChild(el('div','stp',e+' '+t))); st.appendChild(steps);
    const b=el('button','btn blue','🔄 Un altro esempio'); b.onclick=discover; st.appendChild(b); speak(a+' e '+(T-a)+' fanno '+T);
  } }
function rainbow(){ const W=420, x=i=>20+i*38; let s='<svg class="rain" viewBox="0 0 '+W+' 150">';
  const cols=['#E03131','#F08C00','#FFD43B','#2F9E44','#1C7ED6','#7048E8'];
  for(let i=0;i<=5;i++){ const a=x(i), b=x(10-i), r=(b-a)/2; if(i<5) s+='<path d="M'+a+' 110 A'+r+' '+(r*.9)+' 0 0 1 '+b+' 110" fill="none" stroke="'+cols[i]+'" stroke-width="7" stroke-linecap="round"/>'; }
  s+='<circle cx="'+x(5)+'" cy="96" r="14" fill="none" stroke="#7048E8" stroke-width="6"/>';
  for(let i=0;i<=10;i++) s+='<text x="'+x(i)+'" y="138" text-anchor="middle" fill="currentColor">'+i+'</text>';
  return el('div','',s+'</svg>').firstChild; }

/* ── 🎯 Trova l'amico ── */
function findQ(){ hush(); const my=alive; if(qi>=S.len) return finish(findQ); const T=L().T, a=pickA(), f=T-a, st=$('stage'); st.innerHTML=''; let tries=0, done=false;
  const hint=el('div','hint',''); hint.hidden=true; const box=el('div','opts'+(S.n===2?' two':''));
  shuffle([f,...wrongs(a,T)]).forEach(o=>{ const b=el('button','opt',numHTML(o)); b.onclick=async()=>{ if(done) return; speak(String(o));
      if(o===f){ done=true; b.classList.add('right'); const g=st.querySelector('.gap'); if(g){ g.innerHTML=numHTML(f); g.classList.add('ok'); } if(!tries) score++; await speak(a+' e '+f+' fanno '+T+'!'); await wait(900); if(my!==alive) return; qi++; findQ(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); hint.hidden=false; hint.innerHTML='💡 '+trickSteps(a,T).map(x=>x[1]+' '+x[0]).slice(0,-1).join('<br>'); } };
    box.appendChild(b); });
  st.append(dotsEl(),el('p','ask','Chi è l’amico di '+a+' per fare '+T+'?'),el('div','eq',numHTML(a)+'<span>+</span><span class="gap">?</span><span>=</span>'+numHTML(T)),visual(a,T,false),box,hint);
  speak('Chi è l’amico di '+a+' per fare '+T+'?'); }

/* ── 🐸 Il salto di Tedo: sulla linea dei numeri, da a fino a T; il salto in due tempi aiuta ── */
function jump(){ hush(); const my=alive; if(qi>=S.len) return finish(jump); const T=L().T, a=pickA(), f=T-a, st=$('stage'); st.innerHTML=''; let tries=0, done=false;
  const W=420, X=v=>20+v/T*(W-40), mid=T===10?null:Math.ceil(a/(T/10))*(T/10);
  const svg=(show)=>{ let s='<svg class="line" viewBox="0 0 '+W+' 130"><line x1="20" y1="96" x2="'+(W-20)+'" y2="96" stroke="#ADB5BD" stroke-width="5" stroke-linecap="round"/>';
    for(let i=0;i<=10;i++){ const v=i*T/10; s+='<line x1="'+X(v)+'" y1="88" x2="'+X(v)+'" y2="104" stroke="#868E96" stroke-width="3"/><text x="'+X(v)+'" y="124" text-anchor="middle" font-size="13" font-weight="800" fill="#545B88">'+v+'</text>'; }
    s+='<text x="'+X(a)+'" y="74" text-anchor="middle" font-size="30">🐸</text>'+'<circle cx="'+X(a)+'" cy="96" r="7" fill="#2F9E44"/>'+'<circle cx="'+X(T)+'" cy="96" r="7" fill="#E8590C"/>';
    if(show&&mid&&mid!==a&&mid!==T) s+='<path d="M'+X(a)+' 92 Q'+((X(a)+X(mid))/2)+' 30 '+X(mid)+' 92" stroke="#1C7ED6" stroke-width="4" fill="none" stroke-dasharray="6 6"/><text x="'+((X(a)+X(mid))/2)+'" y="44" text-anchor="middle" font-size="15" font-weight="900" fill="#1C7ED6">+'+(mid-a)+'</text>'+
      '<path d="M'+X(mid)+' 92 Q'+((X(mid)+X(T))/2)+' 10 '+X(T)+' 92" stroke="#E8590C" stroke-width="4" fill="none" stroke-dasharray="6 6"/><text x="'+((X(mid)+X(T))/2)+'" y="24" text-anchor="middle" font-size="15" font-weight="900" fill="#E8590C">+'+(T-mid)+'</text>';
    else if(show) s+='<path d="M'+X(a)+' 92 Q'+((X(a)+X(T))/2)+' 20 '+X(T)+' 92" stroke="#E8590C" stroke-width="4" fill="none" stroke-dasharray="6 6"/>';
    return s+'</svg>'; };
  const line=el('div','',svg(false)); line.style.width='100%';
  const hint=el('div','hint',''); hint.hidden=true; const box=el('div','opts'+(S.n===2?' two':''));
  shuffle([f,...wrongs(a,T)]).forEach(o=>{ const b=el('button','opt',numHTML(o)); b.onclick=async()=>{ if(done) return;
      if(o===f){ done=true; b.classList.add('right'); line.innerHTML=svg(true); if(!tries) score++; await speak('Salto di '+f+'! '+a+' più '+f+' fa '+T); await wait(600); if(my!==alive) return; qi++; jump(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); line.innerHTML=svg(true); hint.hidden=false;
        hint.innerHTML=mid&&mid!==a?'💡 Salta in due tempi: da '+a+' a '+mid+' (+'+(mid-a)+'), poi da '+mid+' a '+T+' (+'+(T-mid)+'). Quanto fanno insieme?':'💡 Conta i quadretti che mancano fino a '+T+'.'; } };
    box.appendChild(b); });
  st.append(dotsEl(),el('p','ask','Tedo è sul '+a+'. Quanto è lungo il salto per arrivare a '+T+'?'),line,box,hint); speak('Tedo è sul '+a+'. Quanto è lungo il salto per arrivare a '+T+'?'); }

/* ── 🃏 Memory degli amici ── */
function memory(){ hush(); const st=$('stage'); st.innerHTML=''; const T=L().T, r=alive;
  const pairs=[]; while(pairs.length<4){ const a=pickA(); if(!pairs.some(p=>p[0]===a||p[1]===a||p[0]===T-a)) pairs.push([a,T-a]); }
  const cards=shuffle(pairs.flatMap((p,i)=>[{v:p[0],i},{v:p[1],i}])); let open=[], found=0, busy=false; const g=el('div','mem');
  cards.forEach(c=>{ const b=el('button','mc','<div class="in"><div class="bk">?</div><div class="fr">'+numHTML(c.v)+'</div></div>'); c.el=b;
    b.onclick=async()=>{ if(busy||r!==alive||b.classList.contains('open')) return; b.classList.add('open'); open.push(c); speak(String(c.v)); if(open.length<2) return; busy=true; const [x,y]=open; open=[];
      if(x.i===y.i&&x!==y){ await wait(300); x.el.classList.add('done'); y.el.classList.add('done'); found++; await speak(x.v+' e '+y.v+' fanno '+T+'!');
        if(found===4){ st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask','Hai trovato tutti gli amici!')); const bb=el('button','btn main','🔄 Ancora'); bb.onclick=memory; st.appendChild(bb); } }
      else { await wait(1000); x.el.classList.remove('open'); y.el.classList.remove('open'); } busy=false; };
    g.appendChild(b); });
  st.append(el('p','ask','Trova le coppie che fanno '+T),g); }

/* ── 🧩 Completa: si scrive l'amico con i tasti (anche al contrario) ── */
function complete(){ hush(); const my=alive; if(qi>=S.len) return finish(complete); const T=L().T, a=pickA(), f=T-a, first=qi%2===1, st=$('stage'); st.innerHTML=''; let typed='', tries=0, done=false;
  const gap=el('span','gap','?'), eq=el('div','eq'); const hint=el('div','hint',''); hint.hidden=true;
  if(first){ eq.append(gap); eq.insertAdjacentHTML('beforeend','<span>+</span>'+numHTML(a)+'<span>=</span>'+numHTML(T)); }
  else { eq.insertAdjacentHTML('beforeend',numHTML(a)+'<span>+</span>'); eq.append(gap); eq.insertAdjacentHTML('beforeend','<span>=</span>'+numHTML(T)); }
  const pad=el('div','pad'); const show=()=>{ gap.innerHTML=typed?numHTML(+typed):'?'; };
  [1,2,3,4,5,6,7,8,9,0].forEach(d=>{ const k=el('button','key',String(d)); k.onclick=()=>{ if(done||typed.length>=String(T).length) return; typed+=d; show(); }; pad.appendChild(k); });
  const del=el('button','key','⌫'), ok=el('button','key ok','✓'); del.onclick=()=>{ typed=typed.slice(0,-1); show(); };
  ok.onclick=async()=>{ if(done||!typed) return; if(+typed===f){ done=true; gap.classList.add('ok'); if(!tries) score++; await speak(a+' più '+f+' fa '+T+'!'); await wait(500); if(my!==alive) return; qi++; complete(); }
    else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(gap); typed=''; show(); hint.hidden=false; hint.innerHTML='💡 '+trickSteps(a,T).map(x=>x[1]+' '+x[0]).slice(0,-1).join('<br>'); } };
  const r2=el('div','row'); r2.append(del,ok); st.append(dotsEl(),el('p','ask','Scrivi il numero che manca'),eq,pad,r2,hint); speak(first?'Quale numero più '+a+' fa '+T+'?':a+' più quale numero fa '+T+'?'); }

/* ── 💡 I trucchi: uno per livello, con un esempio da provare ── */
const TR={
 1:[['🖐️ Le dita','Alza tante dita quanto è il numero: quelle che restano giù sono il suo amico. Le dita sono sempre 10!'],['🌈 L’arcobaleno','Metti i numeri da 0 a 10 in fila: ogni arco unisce due amici (1 e 9, 2 e 8…). Il 5 è amico di sé stesso.'],['🪞 Le coppie a specchio','3 + 7 e 7 + 3 sono la stessa coppia: le coppie da ricordare sono solo 6!']],
 2:[['✂️ Togli lo zero','Togli lo zero, usa gli amici del 10, poi rimetti lo zero: 30 → 3, l’amico è 7 → 70.']],
 3:[['🔟 + 9️⃣ Unità del 10, decine del 9','Le unità sono amiche del 10, le decine sono amiche del 9. 37: 7 e 3 fanno 10, 3 e 6 fanno 9 → 63.'],['🐸 Il salto in due tempi','Da 37 salta alla decina dopo (40, cioè +3), poi a 100 (+60): 3 + 60 = 63.'],['⚠️ Attenzione','Se il numero finisce con 0 (come 40), usa il trucco delle decine: togli lo zero.']],
 4:[['✂️ Togli i due zeri','300 → 3, l’amico del 10 è 7 → 700.']],
 5:[['✂️ Togli lo zero','350 → 35, l’amico del 100 di 35 è 65 → 650.']],
 6:[['🔟 + 9️⃣ + 9️⃣','Le unità sono amiche del 10, decine e centinaia sono amiche del 9. 372: 2 e 8 fanno 10, 7 e 2 fanno 9, 3 e 6 fanno 9 → 628.'],['🐸 Il salto in tre tempi','Da 372 alla decina dopo (380, +8), poi al centinaio dopo (400, +20), poi a 1000 (+600): 8 + 20 + 600 = 628.']],
};
function tricks(){ hush(); const st=$('stage'); st.innerHTML=''; const T=L().T; st.appendChild(el('p','ask','💡 I trucchi: '+L().txt.toLowerCase()));
  TR[S.lv].forEach(([t,p],i)=>{ const c=el('div','trick','<b class="t">'+t+'</b><p>'+p+'</p>'); c.style.setProperty('--c',['#E8590C','#1C7ED6','#7048E8'][i%3]); st.appendChild(c); });
  const a=pickA(); st.append(el('p','sub','Proviamo con un numero:'),el('div','eq',numHTML(a)));
  const steps=el('div','steps'); st.appendChild(steps); const b=el('button','btn blue','▶️ Fai vedere il trucco'); st.appendChild(b);
  b.onclick=async()=>{ b.disabled=true; steps.innerHTML=''; for(const [t,e] of trickSteps(a,T)){ steps.appendChild(el('div','stp',e+' '+t)); await speak(t); await wait(300); } b.disabled=false; b.textContent='🔄 Un altro numero'; b.onclick=tricks; };
  speak(TR[S.lv][0][0].replace(/[^\p{L}\s’']/gu,'')+'. '+TR[S.lv][0][1]); }

/* ── impostazioni ── */
function chips(){ const lv=$('lvset'); lv.innerHTML=''; LV.forEach(l=>{ const c=el('button','chip',l.name); c.setAttribute('aria-pressed',String(S.open.includes(l.id)));
    c.onclick=()=>{ S.open=S.open.includes(l.id)?(S.open.length>1?S.open.filter(x=>x!==l.id):S.open):[...S.open,l.id].sort((a,b)=>a-b); keepS('amici_impostazioni',S); chips(); if(opts.mode!=='parent') start(); }; lv.appendChild(c); });
  root.querySelectorAll('[data-k="panel"] .chips[data-key]').forEach(box=>{ const k=box.dataset.key; box.innerHTML='';
    OPT[k].forEach(([v,l])=>{ const c=el('button','chip',l); c.setAttribute('aria-pressed',String(S[k]===v)); c.onclick=()=>{ S[k]=v; keepS('amici_impostazioni',S); chips(); if(opts.mode!=='parent') start(); }; box.appendChild(c); }); }); }
if(opts.mode==='parent'){ $('panel').hidden=false; $('levels').hidden=true; $('tabs').hidden=true; $('stage').hidden=true; chips(); }
else { if(opts.allowSettings){ $('panel').hidden=false; chips(); } start(); }
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
