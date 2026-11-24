// @ts-nocheck
/*
 * 🏆 Il più grande, il più piccolo: tra 3–5 numeri si trova il più grande o il più piccolo, oppure si mettono in fila.
 * Aiuti: le cifre con i colori del confronto (centinaia verdi, decine rosse, unità blu; migliaia viola, decine di
 * migliaia arancioni), le torri, "conta le cifre" a gruppi, il torneo a coppie con la cifra da guardare evidenziata.
 * Lo stesso codice del prototipo già provato, dentro un contenitore con la classe "smq".
 * Le impostazioni sono per figlio (chiave piu_impostazioni in lib/childStore.ts).
 */
export interface PiuOptions { mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void }
export const PIU_CSS = ".smq{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#5468D8;--radius:22px;\n  --dk:#F08C00;--k:#7048E8;--h:#2F9E44;--da:#E03131;--u:#1C7ED6;\n  box-sizing:border-box}\n\n.smq *{box-sizing:border-box}\n.smq{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smq button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation}\n.smq button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smq [hidden]{display:none!important}\n.smq .app{max-width:560px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smq .title{background:var(--card);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smq .title .l{display:flex;align-items:center;gap:12px}\n.smq .title .em{font-size:36px}\n.smq .title h1{margin:0;font-size:21px;font-weight:900}\n.smq .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smq .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.smq .tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.smq .tab{min-height:56px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:15px;font-weight:800;line-height:1.2;padding:0 4px}\n.smq .tab[aria-current=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smq .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.smq .ask{margin:0;font-size:24px;font-weight:900;line-height:1.3;display:flex;align-items:center;gap:10px;justify-content:center}\n.smq .ask .an{font-size:44px}\n.smq .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smq .dots{display:flex;gap:6px}\n.smq .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.smq .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.smq .dots .ok{background:var(--done)}\n.smq .dots .ko{background:#FFA94D}\n.smq /* le carte dei numeri */\n.nums{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;width:100%}\n.smq .group{display:flex;flex-direction:column;gap:6px;align-items:center;border:3px dashed var(--line);border-radius:18px;padding:8px}\n.smq .group .gl{font-size:13px;font-weight:900;color:var(--soft)}\n.smq .group .gn{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}\n.smq .num{position:relative;min-width:96px;border-radius:18px;border:3px solid var(--line);background:var(--card);padding:10px 12px 8px;display:flex;flex-direction:column;align-items:center;gap:6px;box-shadow:0 5px 0 var(--line);transition:opacity .3s,transform .3s}\n.smq .num .dg{display:flex;gap:2px;font-size:44px;font-weight:900;line-height:1;font-variant-numeric:tabular-nums}\n.smq .num .dg span{display:flex;flex-direction:column;align-items:center}\n.smq .num .dg small{font-size:11px;font-weight:900;opacity:.8;margin-top:2px}\n.smq .plain .dg span{color:var(--text)!important}\n.smq .plain .dg small{display:none}\n.smq .num.out{opacity:.25;transform:scale(.9)}\n.smq .num.duel{border-color:var(--blue);box-shadow:0 5px 0 var(--blue)}\n.smq .num.win{border-color:var(--done);background:var(--done-bg);box-shadow:0 5px 0 var(--done)}\n.smq .num .crown{position:absolute;top:-30px;font-size:34px;animation:pop .5s ease-out}\n.smq .num .hl{background:#FFF3BF;border-radius:8px}\n.smq .wrong{animation:wiggle .4s}\n.smq /* le torri */\n.tower{width:46px;display:flex;flex-direction:column-reverse;border-radius:6px;overflow:hidden;background:var(--ground)}\n.smq .tower i{display:block;width:100%}\n.smq .hint{width:100%;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:800;line-height:1.45;text-align:left;background:#FFF6D6;color:#5A4300}\n.smq .tools{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}\n.smq .tool{min-height:46px;padding:0 14px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.smq .tool[aria-pressed=\"true\"]{background:#FFF3BF;border-color:#F0C93C}\n.smq .slots{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;min-height:70px;align-items:center}\n.smq .slot{min-width:70px;height:62px;border-radius:14px;border:3px dashed var(--line);display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900}\n.smq .slot.full{border-style:solid;border-color:var(--done);background:var(--done-bg)}\n.smq .arrow{font-size:22px;font-weight:900;color:var(--soft)}\n.smq .strip{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;padding:10px;border-radius:16px;background:var(--ground)}\n.smq .strip .sl{width:100%;font-size:13px;font-weight:800;color:var(--soft)}\n.smq .strip button{min-width:64px;min-height:48px;padding:0 10px;border-radius:12px;border:2px solid var(--line);background:var(--card);font-size:24px;font-weight:900;font-variant-numeric:tabular-nums;transition:opacity .3s}\n.smq .strip button.x{text-decoration:line-through;text-decoration-thickness:4px;text-decoration-color:#E03131;opacity:.45}\n.smq .strip button.champ{border-color:var(--done);background:var(--done-bg)}\n.smq .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.smq .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smq .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.smq .set{display:flex;flex-direction:column;gap:8px}\n.smq .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.smq .chips{display:flex;gap:8px;flex-wrap:wrap}\n.smq .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.smq .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n.smq .legend{display:flex;gap:12px;justify-content:center;font-size:13px;font-weight:800;color:var(--soft)}\n.smq .legend b{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:-2px;margin-right:4px}\n.smq .star{font-size:64px;animation:pop .5s ease-out}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.smq *{animation:none!important;transition:none!important}}"
export function mountPiu(root: HTMLElement, opts: PiuOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"justify-content:flex-start;font-size:20px\">Impostazioni (area genitore)</div>\n    <div class=\"set\"><span>🔢 Quanti numeri</span><div class=\"chips\" data-key=\"n\"></div></div>\n    <div class=\"set\"><span>📏 Fino a quanto</span><div class=\"chips\" data-key=\"max\"></div></div>\n    <div class=\"set\"><span>📐 Tutti i numeri con lo stesso numero di cifre (più facile)</span><div class=\"chips\" data-key=\"same\"></div></div>\n    <div class=\"set\"><span>🎨 Le cifre colorate (centinaia, decine, unità)</span><div class=\"chips\" data-key=\"colors\"></div></div>\n    <div class=\"set\"><span>🏆 Il torneo, a coppie</span><div class=\"chips\" data-key=\"duel\"></div></div>\n    <div class=\"set\"><span>🧱 Le torri</span><div class=\"chips\" data-key=\"towers\"></div></div>\n    <div class=\"set\"><span>🪤 Numeri trabocchetto (48 e 84, 209 e 290)</span><div class=\"chips\" data-key=\"tricks\"></div></div>\n    \n  </section>\n  <nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <section class=\"card\" data-k=\"stage\"></section>"
const __win = opts.onWin

const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
let S=Object.assign({n:4,max:100,same:false,colors:true,duel:'aiuto',towers:true,tricks:false},store('piu_impostazioni',{}));
const OPT={n:[[3,'3'],[4,'4'],[5,'5']],max:[[10,'fino a 10'],[20,'fino a 20'],[100,'fino a 100'],[1000,'fino a 1.000'],[10000,'fino a 10.000'],[100000,'fino a 100.000']],same:[[false,'No'],[true,'Sì']],colors:[[true,'Sì'],[false,'No']],
  duel:[['aiuto','Come aiuto'],['sempre','Sempre'],['no','No']],towers:[[true,'Sì'],[false,'No']],tricks:[[false,'No'],[true,'Sì']]};
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

/* ── i numeri di un giro: tutti diversi; con i trabocchetti, una coppia con le stesse cifre scambiate ── */
function pickSet(){
  const out=new Set(); let lo, hi=S.max;
  if(S.same){ const L=S.max===20?2:Math.max(1,String(S.max).length-1); lo=L===1?1:Math.pow(10,L-1); hi=S.max===20?20:Math.pow(10,L)-1; }
  else lo=S.max<=20?1:(S.max===100?5:(S.max===1000?20:Math.round(S.max/500)));
  if(S.tricks&&hi>=20){ for(let k=0;k<40&&out.size===0;k++){ const a=lo+rnd(hi-lo+1), d=String(a).split(''); if(d.length<2) continue;
      const e=[...d]; [e[e.length-1],e[e.length-2]]=[e[e.length-2],e[e.length-1]]; if(d.length>=3&&rnd(2)){ [e[1],e[2]]=[d[2],d[1]]; e[e.length-1]=d[d.length-1]; }
      const bb=+e.join(''); if(bb!==a&&String(bb).length===d.length&&bb>=lo&&bb<=hi){ out.add(a); out.add(bb); } } }
  while(out.size<S.n){ out.add(lo+rnd(hi-lo+1)); }
  return shuffle([...out]);
}
/* le cifre colorate: centinaia, decine, unità */
const PL=[['u','u','var(--u)'],['da','da','var(--da)'],['h','h','var(--h)'],['k','k','var(--k)'],['dak','dak','var(--dk)'],['hk','hk','var(--dk)']];
function digitsHTML(n,hl){ const s=String(n), L=s.length; return '<div class="dg" style="font-size:'+(L<=3?44:L===4?36:30)+'px">'+s.split('').map((c,i)=>{ const p=PL[L-1-i]; return '<span style="color:'+p[2]+'" class="'+(hl===i?'hl':'')+'">'+c+'<small>'+p[1]+'</small></span>'; }).join('')+'</div>'; }
function towerHTML(n,top){ const H=110, k=H/top, parts=[]; let p=1, r=n; for(let i=0;i<6&&r>0;i++){ parts.push([(r%10)*p, PL[i][2]]); r=Math.floor(r/10); p*=10; }
  return '<div class="tower" style="height:'+H+'px">'+parts.map(([v,c])=>'<i style="height:'+(v*k).toFixed(1)+'px;background:'+c+'"></i>').join('')+'</div>'; }
/* il primo punto in cui due numeri sono diversi: prima le cifre, poi da sinistra */
function why(a,b,big){ const A=String(a),B=String(b), w=(big?a>b:a<b)?a:b;
  if(A.length!==B.length) return {txt:'💡 Conta le cifre: '+(A.length>B.length?a:b)+' ne ha '+Math.max(A.length,B.length)+', '+(A.length>B.length?b:a)+' solo '+Math.min(A.length,B.length)+'. Più cifre vuol dire più grande!',pos:-1,w};
  let i=0; while(A[i]===B[i]) i++; const names=['centinaia di migliaia','decine di migliaia','migliaia','centinaia','decine','unità'].slice(6-A.length), name=names[i];
  const start=i===0?'Hanno tutti e due '+A.length+' cifre: guarda prima le '+name:'Le '+names.slice(0,i).join(' e le ')+' sono uguali: allora guarda le '+name;
  return {txt:'💡 '+start+'. '+A[i]+' e '+B[i]+': vince '+(+A[i]>+B[i]?a:b)+', perché '+Math.max(+A[i],+B[i])+' è più di '+Math.min(+A[i],+B[i])+'.',pos:i,w}; }

/* la fila in alto: tutti i numeri del giro; quelli scartati vengono barrati (anche a mano, toccandoli) */
function makeStrip(set){ const box=el('div','strip','<span class="sl">I numeri da mettere in ordine: quelli già messi si barrano</span>'), items={};
  set.forEach(n=>{ const b=el('button','',String(n)); b.onclick=()=>{ speak(String(n)); }; items[n]=b; box.appendChild(b); });
  return { box, cross(n){ if(items[n]) items[n].classList.add('x'); }, champ(n){ Object.values(items).forEach(b=>b.classList.remove('champ')); if(items[n]) items[n].classList.add('champ'); } }; }
let mode='big';
const TABS=[['big','🐘 Il più grande'],['small','🐭 Il più piccolo'],['order','📏 Mettili in fila']];
function tabs(){ const t=$('tabs'); t.innerHTML=''; TABS.forEach(([k,l])=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(mode===k)); b.onclick=()=>{ mode=k; tabs(); start(); }; t.appendChild(b); }); }
function legend(){ const L=S.same?(S.max===20?2:Math.max(1,String(S.max).length-1)):String(S.max).length, it=[['dak','decine di migliaia','--dk',5],['k','migliaia','--k',4],['h','centinaia','--h',3],['da','decine','--da',2],['u','unità','--u',1]];
  return S.colors?'<div class="legend" style="flex-wrap:wrap">'+it.filter(x=>x[3]<=L).map(x=>'<span><b style="background:var('+x[2]+')"></b>'+x[0]+' '+x[1]+'</span>').join('')+'</div>':''; }

/* ── 🐘 / 🐭: trovare il più grande o il più piccolo ── */
let qi=0, score=0, ko=[]; const N=6;
function start(){ hush(); qi=0; score=0; ko=[]; mode==='order'?orderQ():findQ(); }
function finish(){ __win&&__win(); const st=$('stage'); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask',score===N?'Perfetto!':'Bravo! '+score+' su '+N+' al primo colpo.'));
  const b=el('button','btn main','🔄 Un altro giro'); b.onclick=start; st.appendChild(b); speak('Bravo!'); }
function dotsEl(){ const d=el('div','dots'); for(let k=0;k<N;k++) d.appendChild(el('span',k<qi?(ko.includes(k)?'ko':'ok'):k===qi?'on':'')); return d; }
function findQ(){
  hush(); const my=alive; if(qi>=N) return finish();
  const big=mode==='big', set=pickSet(), right=big?Math.max(...set):Math.min(...set), top=Math.max(...set);
  const st=$('stage'); st.innerHTML=''; let tries=0, done=false, grouped=false, duel=S.duel==='sempre';
  const strip=null;   // la fila serve solo per mettere in ordine (📏)
  const ask=el('p','ask','<span class="an">'+(big?'🐘':'🐭')+'</span>'+(big?'Qual è il più grande?':'Qual è il più piccolo?'));
  const box=el('div','nums'), hint=el('div','hint',''); hint.hidden=true;
  const tools=el('div','tools');
  const tg=el('button','tool','🔢 Conta le cifre'), td=el('button','tool','🏆 Torneo a coppie');
  tg.onclick=()=>{ grouped=!grouped; draw(); }; td.onclick=()=>{ duel=!duel; if(duel) runDuel(); else draw(); };
  if(new Set(set.map(n=>String(n).length)).size>1) tools.appendChild(tg); if(S.duel!=='no') tools.appendChild(td);
  const cards={};
  function card(n){ const c=el('button','num'+(S.colors?'':' plain'),digitsHTML(n)+(S.towers?towerHTML(n,top):'')); c.dataset.n=n; c.setAttribute('aria-label',String(n)); cards[n]=c;
    c.onclick=async()=>{ if(done||duel) return; speak(String(n));
      if(n===right){ done=true; c.classList.add('win'); c.appendChild(el('span','crown','👑')); if(strip){ set.filter(m=>m!==n).forEach(m=>strip.cross(m)); strip.champ(n); } if(!tries) score++; await wait(300); await speak(n+'! È il '+(big?'più grande':'più piccolo')+'!'); await wait(400); qi++; findQ(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(c); strip&&strip.cross(n); const w=why(n,right,big); hint.hidden=false; hint.textContent=w.txt.replace('💡','💡 '+n+' e '+right+':').replace(':  ',': ');
        if(!grouped&&String(n).length!==String(right).length){ grouped=true; draw(); } } };
    return c; }
  function draw(){ box.innerHTML=''; tg.setAttribute('aria-pressed',String(grouped)); td.setAttribute('aria-pressed',String(duel));
    if(grouped){ const byLen={}; set.forEach(n=>{ (byLen[String(n).length]=byLen[String(n).length]||[]).push(n); });
      Object.keys(byLen).sort((a,b)=>big?b-a:a-b).forEach(L=>{ const g=el('div','group','<span class="gl">'+L+(L==='1'?' cifra':' cifre')+'</span>'), gn=el('div','gn'); byLen[L].forEach(n=>gn.appendChild(card(n))); g.appendChild(gn); box.appendChild(g); }); }
    else set.forEach(n=>box.appendChild(card(n))); }
  // il torneo: due alla volta; chi perde si spegne; la vincitrice sfida la prossima
  async function runDuel(){ draw(); let champ=set[0]; const order=set.slice(1);
    for(let i=0;i<order.length;i++){ if(my!==alive||!duel) return; const ch=order[i];
      Object.values(cards).forEach(c=>c.classList.remove('duel')); cards[champ].classList.add('duel'); cards[ch].classList.add('duel');
      hint.hidden=false; hint.textContent='🏆 Sfida: '+champ+' contro '+ch+'. Tocca '+(big?'il più grande':'il più piccolo')+'!';
      speak(champ+' contro '+ch);
      const winner=await new Promise(res=>{ [champ,ch].forEach(n=>{ cards[n].onclick=()=>{ const w=big?Math.max(champ,ch):Math.min(champ,ch);
        if(n===w){ res(n); } else { if(!ko.includes(qi)) ko.push(qi); tries++; wiggle(cards[n]); const y=why(champ,ch,big); hint.textContent=y.txt;
          if(y.pos>=0){ [champ,ch].forEach(m=>{ cards[m].querySelector('.dg').outerHTML=digitsHTML(m,y.pos); }); } } }; }); });
      const loser=winner===champ?ch:champ; cards[loser].classList.add('out'); cards[loser].classList.remove('duel'); strip&&strip.cross(loser); champ=winner; strip&&strip.champ(champ); await wait(500); }
    if(my!==alive) return; done=true; Object.values(cards).forEach(c=>c.classList.remove('duel')); cards[champ].classList.add('win'); cards[champ].appendChild(el('span','crown','👑'));
    if(!tries) score++; hint.textContent='👑 Ha vinto '+champ+': è il '+(big?'più grande':'più piccolo')+'!'; await speak(champ+'! È il '+(big?'più grande':'più piccolo')+'!'); await wait(600); qi++; findQ(); }
  st.append(dotsEl(),ask); if(strip) st.appendChild(strip.box); st.append(box,tools,hint,el('div','',legend()));
  draw(); speak(big?'Qual è il più grande?':'Qual è il più piccolo?');
  if(duel) runDuel();
}

/* ── 📏 Mettili in fila: dal più piccolo al più grande (o al contrario) ── */
function orderQ(){
  hush(); if(qi>=N) return finish();
  const up=qi%2===0, set=pickSet(), sorted=[...set].sort((a,b)=>up?a-b:b-a), top=Math.max(...set);
  const st=$('stage'); st.innerHTML=''; let pos=0, tries=0;
  const strip=null;
  const ask=el('p','ask',up?'Dal più piccolo 🐭 al più grande 🐘':'Dal più grande 🐘 al più piccolo 🐭');
  const slots=el('div','slots'); sorted.forEach((_,i)=>{ if(i) slots.appendChild(el('span','arrow',up?'&lt;':'&gt;')); slots.appendChild(el('div','slot','')); });
  const box=el('div','nums'), hint=el('div','hint',''); hint.hidden=true;
  set.forEach(n=>{ const c=el('button','num'+(S.colors?'':' plain'),digitsHTML(n)+(S.towers?towerHTML(n,top):''));
    c.onclick=async()=>{ if(c.classList.contains('out')) return; speak(String(n));
      if(n===sorted[pos]){ c.classList.add('out'); strip&&strip.cross(n); const sl=slots.querySelectorAll('.slot')[pos]; sl.textContent=n; sl.classList.add('full'); pos++; hint.hidden=true;
        if(pos===sorted.length){ if(!tries) score++; await wait(300); await speak(sorted.join(', ')); await wait(500); qi++; orderQ(); } }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(c); hint.hidden=false;
        const rest=sorted.slice(pos); hint.textContent='💡 Tra quelli che restano, cerca il '+(up?'più piccolo':'più grande')+'. '+why(n,sorted[pos],!up).txt.replace('💡 ',''); } };
    box.appendChild(c); });
  st.append(dotsEl(),ask,slots); if(strip) st.appendChild(strip.box); st.append(box,hint,el('div','',legend()));
  speak(up?'Mettili in fila, dal più piccolo al più grande':'Mettili in fila, dal più grande al più piccolo');
}

/* ── impostazioni ── */
function chips(){ root.querySelectorAll('[data-k="panel"] .chips[data-key]').forEach(box=>{ const k=box.dataset.key; box.innerHTML='';
  OPT[k].forEach(([v,l])=>{ const c=el('button','chip',l); c.setAttribute('aria-pressed',String(S[k]===v)); c.onclick=()=>{ S[k]=v; keepS('piu_impostazioni',S); chips(); if(opts.mode!=='parent') start(); }; box.appendChild(c); }); }); }
if(opts.mode==='parent'){ $('panel').hidden=false; $('tabs').hidden=true; $('stage').hidden=true; chips(); }
else { if(opts.allowSettings){ $('panel').hidden=false; chips(); } tabs(); start(); }
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
