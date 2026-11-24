// @ts-nocheck
/*
 * ✍️ Spell it! (English time): la voce dice una parola inglese e il bambino la scrive, con tre aiuti (lettere in ordine,
 * caselle con trabocchetti, tastiera dell'app senza correttore), lo spelling a voce e il metodo Look, cover, write, check.
 * Liste pronte (weather, colours, numbers, animals) e liste del genitore. Mazzo, ripassi e impostazioni per figlio (spell_*).
 */
export interface SpellOptions { mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void; accent?: string }
export const SPELL_CSS = ".sms{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#5468D8;--uk:#C2255C;--radius:22px;\n  box-sizing:border-box}\n\n.sms *{box-sizing:border-box}\n.sms{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.sms button,.sms input{font-family:inherit;color:inherit}\n.sms button{cursor:pointer;touch-action:manipulation}\n.sms button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.sms [hidden]{display:none!important}\n.sms .app{max-width:560px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.sms .title{background:var(--card);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.sms .title .l{display:flex;align-items:center;gap:12px}\n.sms .title .em{font-size:36px}\n.sms .title h1{margin:0;font-size:22px;font-weight:900}\n.sms .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.sms .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.sms .tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px}\n.sms .tab{min-height:56px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:15px;font-weight:800;line-height:1.2;padding:0 6px}\n.sms .tab[aria-current=\"true\"]{background:var(--uk);border-color:var(--uk);color:#fff}\n.sms .lists{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}\n.sms .ls{flex:none;min-height:44px;padding:0 12px;border-radius:999px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:900}\n.sms .ls[aria-pressed=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.sms .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.sms .ask{margin:0;font-size:21px;font-weight:900;line-height:1.3}\n.sms .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.sms .dots{display:flex;gap:6px}\n.sms .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.sms .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.sms .dots .ok{background:var(--done)}\n.sms .dots .ko{background:#FFA94D}\n.sms .pic{font-size:84px;line-height:1}\n.sms .tr{font-size:16px;font-weight:800;color:var(--soft)}\n.sms .listen{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}\n.sms .lb{min-height:62px;padding:0 18px;border-radius:18px;border:none;background:var(--uk);color:#fff;font-size:20px;font-weight:900;box-shadow:0 5px 0 #8F1A44}\n.sms .lb.alt{background:var(--card);color:var(--text);border:2px solid var(--line);box-shadow:0 5px 0 var(--line);font-size:17px}\n.sms /* le caselle della parola */\n.slots{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;min-height:66px}\n.sms .slot{width:48px;height:60px;border-radius:12px;border:3px solid var(--line);background:var(--ground);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;font-variant-ligatures:none}\n.sms .slot.cur{border-color:var(--blue);box-shadow:0 0 0 3px color-mix(in srgb, var(--blue) 25%, transparent)}\n.sms .slot.ok{border-color:var(--done);background:var(--done-bg);color:var(--done)}\n.sms .slot.bad{border-color:#E03131;background:#FFF0F0;color:#C92A2A}\n.sms .slot.given{color:var(--soft)}\n.sms.upper .slot,.sms.upper .tile,.sms.upper .key,.sms.upper .big{text-transform:uppercase}\n.sms .tiles{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}\n.sms .tile{width:58px;height:62px;border-radius:14px;border:3px solid var(--line);background:var(--card);font-size:30px;font-weight:900;box-shadow:0 5px 0 var(--line)}\n.sms .tile.used{opacity:.25}\n.sms .tile.sugg{border-color:#F0C93C;box-shadow:0 5px 0 #F0C93C;background:#FFF3BF}\n.sms .kb{display:flex;flex-direction:column;gap:6px;width:100%}\n.sms .kr{display:flex;gap:4px;justify-content:center}\n.sms .key{flex:1;max-width:44px;height:52px;border-radius:10px;border:2px solid var(--line);background:var(--card);font-size:22px;font-weight:900;padding:0;box-shadow:0 3px 0 var(--line)}\n.sms .key.wide{max-width:90px;font-size:16px}\n.sms .key.sugg{background:#FFF3BF;border-color:#F0C93C}\n.sms.big{font-size:56px;font-weight:900;letter-spacing:3px;color:var(--text)}\n.sms .cover{width:100%;min-height:90px;border-radius:18px;background:repeating-linear-gradient(90deg,var(--uk) 0 22px,color-mix(in srgb, var(--uk) 75%, #fff) 22px 44px);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:900}\n.sms .cmp{display:flex;flex-direction:column;gap:6px;align-items:center}\n.sms .cmp .row{display:flex;gap:4px}\n.sms .cmp .lab{font-size:13px;font-weight:900;color:var(--soft)}\n.sms .wrong{animation:wiggle .4s}\n.sms .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.sms .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.sms .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.sms .row2{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}\n.sms .hint{width:100%;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:800;line-height:1.45;background:#FFF6D6;color:#5A4300}\n.sms .star{font-size:64px;animation:pop .5s ease-out}\n.sms /* area genitore */\n.panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.sms .set{display:flex;flex-direction:column;gap:8px}\n.sms .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.sms .chips{display:flex;gap:8px;flex-wrap:wrap}\n.sms .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.sms .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n.sms .in{width:100%;min-height:46px;border-radius:12px;border:2px solid var(--line);background:var(--ground);padding:0 10px;font-size:16px;font-weight:700}\n.sms .wl{display:flex;flex-direction:column;gap:6px}\n.sms .wr{display:flex;gap:6px;align-items:center}\n.sms .wr .e{max-width:60px;text-align:center}\n.sms .x{min-width:40px;min-height:44px;border-radius:10px;border:2px solid var(--line);background:var(--card)}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.sms *{animation:none!important}}"
export function mountSpell(root: HTMLElement, opts: SpellOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left\">Impostazioni (area genitore)</div>\n    <div class=\"set\"><span>🧩 L'aiuto per scrivere</span><div class=\"chips\" data-key=\"level\"></div></div>\n    <div class=\"set\"><span>🔢 Quante parole per giro</span><div class=\"chips\" data-key=\"n\"></div></div>\n    <div class=\"set\"><span>🖼️ L'immagine</span><div class=\"chips\" data-key=\"pic\"></div></div>\n    <div class=\"set\"><span>🇮🇹 La traduzione in italiano</span><div class=\"chips\" data-key=\"tr\"></div></div>\n    <div class=\"set\"><span>🔠 Le lettere</span><div class=\"chips\" data-key=\"caps\"></div></div>\n    <div class=\"set\"><span>🐢 La voce</span><div class=\"chips\" data-key=\"rate\"></div></div>\n    <div class=\"set\"><span>📝 Le liste di parole (le tue si possono modificare)</span>\n      <div class=\"chips\" data-k=\"pl\"></div>\n      <div data-k=\"ed\"></div>\n    </div>\n    \n  </section>\n  <nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <div class=\"lists\" data-k=\"lists\"></div>\n  <section class=\"card\" data-k=\"stage\"></section>"
const __win = opts.onWin
const EN=opts.accent==='us'?'en-US':'en-GB';

/* ── le liste pronte (dalle sezioni di English time) ── */
const READY=[
 {id:'weather',name:'🌦️ Weather',words:[['sunny','☀️','soleggiato'],['windy','🌬️','ventoso'],['rainy','🌧️','piovoso'],['cloudy','☁️','nuvoloso'],['snowy','❄️','nevoso'],['foggy','🌫️','nebbioso'],['hot','🥵','caldo'],['cold','🥶','freddo']]},
 {id:'colours',name:'🎨 Colours',words:[['red','🟥','rosso'],['blue','🟦','blu'],['green','🟩','verde'],['yellow','🟨','giallo'],['pink','🩷','rosa'],['black','⬛','nero'],['white','⬜','bianco'],['orange','🟧','arancione']]},
 {id:'numbers',name:'🔢 Numbers',words:[['one','1️⃣','uno'],['two','2️⃣','due'],['three','3️⃣','tre'],['four','4️⃣','quattro'],['five','5️⃣','cinque'],['six','6️⃣','sei'],['seven','7️⃣','sette'],['eight','8️⃣','otto'],['nine','9️⃣','nove'],['ten','🔟','dieci']]},
 {id:'animals',name:'🐾 Animals',words:[['cat','🐱','gatto'],['dog','🐶','cane'],['fish','🐟','pesce'],['bird','🐦','uccello'],['horse','🐴','cavallo'],['cow','🐮','mucca'],['duck','🦆','anatra'],['frog','🐸','rana']]},
];
const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
let S=Object.assign({level:1,n:5,pic:true,tr:true,caps:'low',rate:'slow'},store('spell_impostazioni',{}));
const OPT={level:[[1,'1 · Le lettere in ordine'],[2,'2 · Le caselle'],[3,'3 · Scrivo da solo']],n:[[5,'5'],[8,'8'],[10,'10']],pic:[[true,'Sì'],[false,'No']],tr:[[true,'Sì'],[false,'No']],caps:[['low','minuscole'],['up','MAIUSCOLE']],rate:[['slow','Lenta'],['normal','Normale']]};
let MINE=store('spell_liste',[{id:'mie1',name:'⭐ Le mie parole',words:[['school','🏫','scuola'],['book','📖','libro'],['pencil','✏️','matita']]}]);
const lists=()=>[...READY,...MINE];
let listId=store('spell_lista','weather'), mode='listen';

const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
/* la voce: inglese per le parole, italiano per le istruzioni */
function speak(t,lang=EN,rate){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang=lang; u.rate=rate||(lang.startsWith('en')?(S.rate==='slow'?.75:.95):.9);
    const vs=speechSynthesis.getVoices(), v=vs.find(v=>v.lang===lang)||vs.find(v=>v.lang.startsWith(lang.slice(0,2))); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1500+t.length*110); setTimeout(()=>speechSynthesis.speak(u),70); }catch(e){ fin(); } }); }
const it=t=>speak(t,'it-IT');
const spellAloud=w=>speak(w.split('').join(', '),EN,.7);
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }

/* il mazzo (senza ripetizioni) e i ripassi delle parole sbagliate, per lista */
function draw(list){ const ids=list.words.map(w=>w[0]), decks=store('spell_mazzo',{}); let d=decks[list.id]||{order:[],pos:0}; const out=[];
  const rev=store('spell_ripasso',[]).filter(r=>r.l===list.id&&ids.includes(r.w)).slice(0,2).map(r=>r.w);
  while(out.length<Math.min(S.n,ids.length)-rev.length){ if(d.pos>=d.order.length||!d.order.every(i=>ids.includes(i))) d={order:shuffle(ids),pos:0}; const id=d.order[d.pos++]; if(!out.includes(id)&&!rev.includes(id)) out.push(id); }
  decks[list.id]=d; keepS('spell_mazzo',decks); return [...rev,...out].map(id=>list.words.find(w=>w[0]===id)); }
function missed(l,w){ const r=store('spell_ripasso',[]); if(!r.some(x=>x.l===l&&x.w===w)) r.push({l,w}); keepS('spell_ripasso',r.slice(-30)); }
function solved(l,w){ keepS('spell_ripasso',store('spell_ripasso',[]).filter(x=>!(x.l===l&&x.w===w))); }

/* ── le schede ── */
function tabsBar(){ const t=$('tabs'); t.innerHTML=''; [['listen','🎧 Listen & write'],['look','👀 Look, cover, write, check']].forEach(([k,l])=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(mode===k)); b.onclick=()=>{ mode=k; render(); }; t.appendChild(b); }); }
function listBar(){ const b=$('lists'); b.innerHTML=''; lists().forEach(l=>{ const x=el('button','ls',l.name); x.setAttribute('aria-pressed',String(listId===l.id)); x.onclick=()=>{ listId=l.id; keepS('spell_lista',listId); render(); }; b.appendChild(x); }); }
function render(){ root.classList.toggle('upper',S.caps==='up'); tabsBar(); listBar(); start(); }
let qi=0, score=0, ko=[], round=[];
function start(){ hush(); const list=lists().find(l=>l.id===listId)||lists()[0]; listId=list.id; round=draw(list); qi=0; score=0; ko=[]; mode==='listen'?listenQ(list):lookQ(list); }
function finish(list){ __win&&__win(); const st=$('stage'); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask',score===round.length?'Perfect! 🎉':'Well done! '+score+' su '+round.length+' al primo colpo.'));
  const b=el('button','btn main','🔄 Ancora'); b.onclick=start; st.appendChild(b); speak(score===round.length?'Perfect!':'Well done!'); }
const dotsEl=()=>{ const d=el('div','dots'); round.forEach((_,i)=>d.appendChild(el('span',i<qi?(ko.includes(i)?'ko':'ok'):i===qi?'on':''))); return d; };
const shown=c=>S.caps==='up'?c.toUpperCase():c;

/* ── 🎧 Listen & write: la voce dice la parola, il bambino la scrive lettera per lettera ── */
function listenQ(list){
  hush(); const my=alive; if(qi>=round.length) return finish(list);
  const [w,e,tr]=round[qi], st=$('stage'); st.innerHTML=''; let pos=0, errs=0, miss=false;
  const slots=el('div','slots'); const cells=w.split('').map(()=>{ const s=el('div','slot'); slots.appendChild(s); return s; });
  const hint=el('div','hint',''); hint.hidden=true;
  if(S.level===2){ cells[0].textContent=shown(w[0]); cells[0].classList.add('ok','given'); pos=1; }
  const mark=()=>cells.forEach((c,i)=>c.classList.toggle('cur',i===pos));
  const listen=el('div','listen'); const b1=el('button','lb','🔊 Listen'), b2=el('button','lb alt','🐢 Piano'), b3=el('button','lb alt','🔤 Spell it');
  b1.onclick=()=>speak(w); b2.onclick=()=>speak(w,EN,.55); b3.onclick=()=>spellAloud(w); listen.append(b1,b2,b3);
  st.append(dotsEl(),el('p','ask','Ascolta e scrivi la parola'));
  if(S.pic) st.appendChild(el('div','pic',e)); if(S.tr) st.appendChild(el('div','tr','🇮🇹 '+tr));
  st.append(listen,slots,hint);
  // una lettera: giusta → nella casella; sbagliata → trema; dopo due errori sulla stessa lettera, l'aiuto
  let keysEl={};
  const press=(ch,btn)=>{ if(pos>=w.length) return;
    if(ch===w[pos]){ cells[pos].textContent=shown(ch); cells[pos].classList.add('ok'); errs=0; pos++; mark(); Object.values(keysEl).forEach(k=>k.classList&&k.classList.remove('sugg'));
      if(btn&&S.level<3) btn.classList.add('used'); if(btn&&S.level<3) btn.disabled=true;
      if(pos>=w.length) done(); }
    else { if(btn) wiggle(btn); cells[pos].classList.add('bad'); setTimeout(()=>cells[pos]&&cells[pos].classList.remove('bad'),400); errs++; if(!miss){ miss=true; if(!ko.includes(qi)) ko.push(qi); missed(list.id,w); }
      if(errs>=2){ hint.hidden=false; hint.textContent='💡 La lettera giusta è “'+shown(w[pos])+'”.'; const k=keysEl[w[pos]+'_'+pos]||keysEl[w[pos]]; if(k) k.classList.add('sugg'); speak(w[pos],EN,.7); } } };
  async function done(){ slots.querySelectorAll('.slot').forEach(c=>c.classList.add('ok')); if(!miss){ score++; solved(list.id,w); } hint.hidden=true;
    await speak(w); await spellAloud(w); await wait(500); qi++; listenQ(list); }
  if(S.level<3){ // le lettere da toccare: quelle della parola (e, al livello 2, qualche trabocchetto)
    const letters=w.split('').slice(S.level===2?1:0), extra=S.level===2?shuffle('aeioustrnl'.split('').filter(c=>!w.includes(c))).slice(0,2):[];
    const tiles=el('div','tiles'); shuffle([...letters.map((c,i)=>({c,i})),...extra.map(c=>({c,i:-1}))]).forEach(t=>{ const b=el('button','tile',shown(t.c));
      b.onclick=()=>{ if(b.disabled) return; if(t.c!==w[pos]){ press(t.c,b); return; } press(t.c,b); }; tiles.appendChild(b);
      if(!keysEl[t.c]) keysEl[t.c]=b; }); st.appendChild(tiles); }
  else st.appendChild(keyboard((c,b)=>press(c,b),keysEl));
  mark(); speak(w);
}
/* la tastiera grande dell'app: niente correttore automatico */
function keyboard(onKey,keysEl,back){ const kb=el('div','kb'); ['qwertyuiop','asdfghjkl','zxcvbnm'].forEach((r,ri)=>{ const row=el('div','kr');
    r.split('').forEach(c=>{ const b=el('button','key',shown(c)); b.onclick=()=>onKey(c,b); keysEl[c]=b; row.appendChild(b); });
    if(ri===2&&back){ const bk=el('button','key wide','⌫'); bk.setAttribute('aria-label','cancella'); bk.onclick=back; row.appendChild(bk); }
    kb.appendChild(row); }); return kb; }

/* ── 👀 Look, cover, write, check ── */
function lookQ(list){
  hush(); const my=alive; if(qi>=round.length) return finish(list);
  const [w,e,tr]=round[qi], st=$('stage'); let typed='', first=true;
  const look=()=>{ st.innerHTML=''; st.append(dotsEl(),el('p','ask','👀 Look: guarda bene la parola'));
    if(S.pic) st.appendChild(el('div','pic',e)); st.appendChild(el('div','big',shown(w))); if(S.tr) st.appendChild(el('div','tr','🇮🇹 '+tr));
    const r=el('div','row2'), h=el('button','lb alt','🔊 Listen'), sp=el('button','lb alt','🔤 Spell it'), c=el('button','btn blue','🙈 Cover: copri la parola');
    h.onclick=()=>speak(w); sp.onclick=()=>spellAloud(w); c.onclick=write; r.append(h,sp); st.append(r,c); speak(w).then(()=>spellAloud(w)); };
  const write=()=>{ st.innerHTML=''; typed=''; st.append(dotsEl(),el('p','ask','✍️ Write: ora scrivila a memoria'),el('div','cover','🙈 La parola è coperta'));
    const slots=el('div','slots'); const drawT=()=>{ slots.innerHTML=''; for(let i=0;i<Math.max(w.length,typed.length);i++){ const s=el('div','slot'+(i===typed.length?' cur':''),typed[i]?shown(typed[i]):''); slots.appendChild(s); } }; drawT();
    const kb=keyboard(c=>{ if(typed.length<w.length+3){ typed+=c; drawT(); } },{},()=>{ typed=typed.slice(0,-1); drawT(); });
    const ck=el('button','btn main','✅ Check: controlla'); ck.onclick=check; st.append(slots,kb,ck); it('Scrivila a memoria'); };
  const check=async()=>{ st.innerHTML=''; const ok=typed===w; st.append(dotsEl(),el('p','ask',ok?'✅ Check: giusto!':'🔍 Check: confronta le due parole'));
    const cmp=el('div','cmp'); const row=(txt,ref,lab)=>{ const r=el('div','row'); for(let i=0;i<Math.max(txt.length,ref.length);i++){ const c=txt[i]||''; r.appendChild(el('div','slot '+(lab==='giusta'?'ok':(c&&c===ref[i]?'ok':'bad')),c?shown(c):'')); } const box=el('div'); box.append(el('div','lab',lab==='giusta'?'La parola giusta':'La tua parola'),r); return box; };
    cmp.append(row(typed,w,'tua'),row(w,w,'giusta')); st.appendChild(cmp);
    if(ok){ if(first){ score++; solved(list.id,w); } await speak(w); await spellAloud(w); const n=el('button','btn main','Avanti →'); n.onclick=()=>{ qi++; lookQ(list); }; st.appendChild(n); }
    else { if(first){ first=false; if(!ko.includes(qi)) ko.push(qi); missed(list.id,w); } st.appendChild(el('p','sub','Le lettere rosse sono quelle da sistemare. Guardala di nuovo e riprova!'));
      const a=el('button','btn blue','👀 Guarda di nuovo'); a.onclick=look; st.appendChild(a); it('Quasi! Guarda di nuovo la parola.'); } };
  look();
}

/* ── impostazioni e liste del genitore ── */
function chips(){ root.querySelectorAll('[data-k="panel"] .chips[data-key]').forEach(box=>{ const k=box.dataset.key; box.innerHTML='';
  OPT[k].forEach(([v,l])=>{ const c=el('button','chip',l); c.setAttribute('aria-pressed',String(S[k]===v)); c.onclick=()=>{ S[k]=v; keepS('spell_impostazioni',S); chips(); if(opts.mode!=='parent') render(); }; box.appendChild(c); }); }); }
let edId=null;
function editor(){ const pl=$('pl'); pl.innerHTML=''; MINE.forEach(l=>{ const c=el('button','chip',l.name); c.setAttribute('aria-pressed',String(edId===l.id)); c.onclick=()=>{ edId=edId===l.id?null:l.id; editor(); }; pl.appendChild(c); });
  const add=el('button','chip','＋ Nuova lista'); add.onclick=()=>{ const id='mie'+Date.now(); MINE.push({id,name:'⭐ Nuova lista',words:[['','','']]}); edId=id; saveMine(); editor(); }; pl.appendChild(add);
  const ed=$('ed'); ed.innerHTML=''; const l=MINE.find(x=>x.id===edId); if(!l) return;
  const nm=el('input','in'); nm.value=l.name; nm.placeholder='Nome della lista'; nm.oninput=()=>{ l.name=nm.value; saveMine(); };
  const wl=el('div','wl'); const drawW=()=>{ wl.innerHTML=''; l.words.forEach((w,i)=>{ const r=el('div','wr');
      const e=el('input','in e'); e.value=w[1]; e.placeholder='🙂'; e.oninput=()=>{ w[1]=e.value; saveMine(); };
      const a=el('input','in'); a.value=w[0]; a.placeholder='parola inglese'; a.autocapitalize='off'; a.spellcheck=false; a.oninput=()=>{ w[0]=a.value.toLowerCase().replace(/[^a-z]/g,''); saveMine(); };
      const b=el('input','in'); b.value=w[2]; b.placeholder='traduzione'; b.oninput=()=>{ w[2]=b.value; saveMine(); };
      const x=el('button','x','✕'); x.setAttribute('aria-label','togli'); x.onclick=()=>{ l.words.splice(i,1); saveMine(); drawW(); }; r.append(e,a,b,x); wl.appendChild(r); });
    const ad=el('button','chip','＋ Aggiungi una parola'); ad.onclick=()=>{ l.words.push(['','','']); saveMine(); drawW(); }; wl.appendChild(ad); };
  drawW(); const del=el('button','chip','🗑️ Elimina la lista'); del.onclick=()=>{ MINE=MINE.filter(x=>x.id!==l.id); edId=null; saveMine(); editor(); };
  ed.append(nm,wl,del); ed.style.cssText='display:flex;flex-direction:column;gap:8px;margin-top:8px'; }
function saveMine(){ keepS('spell_liste',MINE); }
function cleanMine(){ MINE=MINE.map(l=>({...l,words:l.words.filter(w=>w[0])})).filter(l=>l.words.length); saveMine(); }
if(opts.mode==='parent'){ $('panel').hidden=false; $('tabs').hidden=true; $('lists').hidden=true; $('stage').hidden=true; chips(); editor(); }
else { if(opts.allowSettings){ $('panel').hidden=false; chips(); editor(); } cleanMine(); render(); }
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
