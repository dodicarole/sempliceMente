// @ts-nocheck
/*
 * 🎭 Imparo la poesia: Ascolto, Ripeti con me, Scompare!, Completa, La recito, Ripassi.
 * Lo stesso codice del prototipo già provato, dentro un contenitore con la classe "smp".
 * Le poesie di ogni figlio sono nella chiave "poesie" (per figlio e nel database, vedi lib/childStore.ts).
 * Le registrazioni restano solo sul telefono, finché la pagina è aperta.
 */
export interface PoemOptions { mode?: 'child' | 'parent'; demo?: boolean; onWin?: () => void; onSaved?: () => void; emptyTitle?: string; emptyText?: string }
export const POEM_CSS = ".smp{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#6870A0;--line:#D6DBF2;--done:#48B97A;--done-bg:#E6F6EE;--blue:#6B7FE3;--radius:22px;--hl:#FFE066;--rhyme:#E64980;\n  box-sizing:border-box}\n\n.smp *{box-sizing:border-box}\n.smp{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smp button,.smp textarea,.smp input{font-family:inherit;color:inherit}\n.smp button{cursor:pointer;touch-action:manipulation}\n.smp button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smp [hidden]{display:none!important}\n.smp .app{max-width:540px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smp .title{background:var(--card);border-radius:var(--radius);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smp .title .l{display:flex;align-items:center;gap:12px}\n.smp .title .em{font-size:36px}\n.smp .title h1{margin:0;font-size:22px;font-weight:900}\n.smp .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smp .gear{flex:none;min-width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:14px;font-weight:900;padding:0 10px}\n.smp .buddy{display:flex;align-items:center;gap:10px;background:none;border:none;padding:0;text-align:left}\n.smp .buddy .av{width:50px;height:50px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:24px;border:3px solid #E64980;background:#fff}\n.smp .buddy .bb{background:var(--card);border-radius:16px;padding:10px 14px;font-size:15px;font-weight:700;line-height:1.35}\n.smp .buddy .bb b{display:block;font-size:13px;font-weight:900;color:#E64980}\n.smp .tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.smp .tab{min-height:54px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:800;padding:0 4px;line-height:1.2}\n.smp .tab[aria-current=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smp .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.smp .h2{margin:0;font-size:20px;font-weight:900;line-height:1.25}\n.smp .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smp .btn{min-height:52px;padding:0 16px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:16px;font-weight:800}\n.smp .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smp .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.smp .btn.red{background:#E03131;border-color:#E03131;color:#fff}\n.smp .btn:disabled{opacity:.45}\n.smp .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}\n.smp .chips{display:flex;gap:6px;flex-wrap:wrap}\n.smp .chip{min-height:42px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:14px;font-weight:800}\n.smp .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n.smp /* la poesia */\n.poem{display:flex;flex-direction:column;gap:14px}\n.smp .stanza{display:flex;flex-direction:column;gap:4px}\n.smp .verse{display:flex;align-items:center;gap:10px;border-radius:14px;padding:6px 10px;border:3px solid transparent;background:none;text-align:left;width:100%}\n.smp .verse .pic{font-size:26px;width:36px;flex:none;text-align:center}\n.smp .verse .txt{font-size:22px;font-weight:800;line-height:1.45}\n.smp .verse.on{background:var(--hl);border-color:#E0A800;color:#1F2147}\n.smp .rh{color:var(--rhyme);text-decoration:underline wavy 2px;text-underline-offset:6px}\n.smp .verse.on .rh{color:#A61E4D}\n.smp /* il testo che scompare */\n.w{display:inline-block;border-radius:6px;padding:0 2px}\n.smp .w.hide{background:var(--line);color:transparent;min-width:2.2em;cursor:pointer}\n.smp .w.hide.peek{background:#FFE066;color:#1F2147}\n.smp .w.first{color:var(--soft)}\n.smp .level{display:flex;align-items:center;gap:8px;justify-content:space-between}\n.smp .level .bar{flex:1;display:flex;gap:4px}\n.smp .level .bar i{flex:1;height:10px;border-radius:5px;background:var(--line)}\n.smp .level .bar i.on{background:var(--blue)}\n.smp /* completa */\n.gap{display:inline-block;min-width:3em;border-bottom:4px solid var(--blue);color:var(--blue)}\n.smp .opts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.smp .opt{min-height:60px;border-radius:16px;border:3px solid var(--line);background:var(--ground);font-size:18px;font-weight:900;box-shadow:0 4px 0 var(--line)}\n.smp .opt.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 4px 0 #2F8A5A}\n.smp .wrong{animation:wiggle .4s}\n.smp .dots{display:flex;gap:6px;justify-content:center}\n.smp .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.smp .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.smp .dots .ok{background:var(--done)}\n.smp /* registrare */\n.mic{width:120px;height:120px;border-radius:50%;border:none;background:#E03131;color:#fff;font-size:50px;box-shadow:0 6px 0 #A61E1E;align-self:center}\n.smp .mic.on{animation:pulse 1s ease-in-out infinite}\n.smp .say{align-self:center;font-size:16px;font-weight:900;background:#FFF6D6;color:#5A4300;border-radius:14px;padding:8px 14px;min-height:40px;text-align:center}\n.smp .recs{display:flex;flex-direction:column;gap:6px}\n.smp .rec{display:flex;align-items:center;gap:10px;background:var(--ground);border-radius:14px;padding:8px 12px;font-size:15px;font-weight:800}\n.smp .rec audio{flex:1;height:36px}\n.smp /* ripassi */\n.plan{display:flex;flex-direction:column;gap:8px}\n.smp .step{display:flex;align-items:center;gap:12px;border-radius:16px;padding:10px 14px;background:var(--ground);font-size:16px;font-weight:800}\n.smp .step .e{font-size:26px}\n.smp .step.ok{background:var(--done-bg)}\n.smp .step.now{border:3px solid #FFC93C;background:#FFF6D6;color:#5A4300}\n.smp /* genitore */\n.ta{width:100%;min-height:200px;border-radius:14px;border:2px solid var(--line);background:var(--ground);padding:10px 12px;font-size:17px;font-weight:700;line-height:1.5;resize:vertical}\n.smp .in{width:100%;min-height:46px;border-radius:12px;border:2px solid var(--line);background:var(--ground);padding:0 12px;font-size:16px;font-weight:700}\n.smp .star{font-size:60px;text-align:center;animation:pop .5s ease-out}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.smp *{animation:none!important;transition:none!important}}"
export function mountPoem(root: HTMLElement, opts: PoemOptions = {}): () => void {
  root.innerHTML = "<div class=\"row\" data-k=\"poems\"></div>\n  <nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <div class=\"row\" data-k=\"pick\"></div>\n  <section class=\"card\" data-k=\"stage\"></section>"

/* ── La poesia di esempio (scritta apposta). Il genitore può incollare quella della scuola ── */
const SAMPLE={title:'Gocce sul vetro',
 text:'Piove piano sul giardino,\ngocce danzano sul vetro,\nil gattino sul cuscino\nguarda il cielo grigio e tetro.\n\nPoi arriva un raggio d\'oro,\ntorna il sole, che allegria!\nGli uccellini cantano in coro\ne la pioggia vola via.',
 pics:['🌧️','💧','🐱','☁️','🌤️','☀️','🐦','🌈'],
 words:[['tetro','scuro e un po\' triste'],['raggio','una striscia di luce del sole']]};
let S={rate:.85};
/* l'elenco delle poesie di questo figlio; nella demo, se è vuoto, c'è la poesia di esempio */
function loadList(){ try{ const r=localStorage.getItem('poesie'); if(r){ const v=JSON.parse(r); if(Array.isArray(v.list)) return v.list; } }catch(e){} return []; }
let LIST=loadList(); if(!LIST.length&&opts.demo) LIST=[Object.assign({id:'esempio'},JSON.parse(JSON.stringify(SAMPLE)))];
let P=LIST[0]||null;
function save(){ if(P){ const i=LIST.findIndex(x=>x.id===P.id); if(i>=0) LIST[i]=P; } try{ localStorage.setItem('poesie',JSON.stringify({list:LIST})); }catch(e){} }
/* versi e strofe: un a capo = un verso, una riga vuota = una nuova strofa */
function stanzas(){ return P.text.split(/\n\s*\n/).map(s=>s.split('\n').map(x=>x.trim()).filter(Boolean)).filter(s=>s.length); }
function verses(){ return stanzas().flat(); }
const clean=w=>w.toLowerCase().replace(/[^\p{L}']/gu,'');
const lastWord=v=>{ const ws=v.split(/\s+/); return ws[ws.length-1]; };

const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function speak(t,{interrupt=true}={}){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ if(interrupt) speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='it-IT'; u.rate=S.rate; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('it')); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1500+t.length*95); setTimeout(()=>speechSynthesis.speak(u),interrupt?80:0); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }

/* quale parte si sta imparando: una strofa o tutta la poesia */
let part='all';
function partVerses(){ const st=stanzas(); if(part==='all') return st.map((s,i)=>({s:i,lines:s})); return [{s:+part,lines:st[+part]}]; }
function pickBar(){ const p=$('pick'); p.innerHTML=''; const st=stanzas();
  if(st.length<2||tab===0||tab===5){ return; }
  p.appendChild(el('span','sub','Imparo:'));
  const c=el('div','chips'); st.forEach((_,i)=>{ const b=el('button','chip','Strofa '+(i+1)); b.setAttribute('aria-pressed',String(part===String(i))); b.onclick=()=>{ part=String(i); render(); }; c.appendChild(b); });
  const all=el('button','chip','Tutta'); all.setAttribute('aria-pressed',String(part==='all')); all.onclick=()=>{ part='all'; render(); }; c.appendChild(all); p.appendChild(c); }

/* un verso con la parola in rima evidenziata (l'ultima) e l'immagine */
function verseHTML(v,i){ const ws=v.split(' '), last=ws.pop(); return '<span class="pic">'+(P.pics&&P.pics[i]||'')+'</span><span class="txt">'+ws.join(' ')+' <span class="rh">'+last+'</span></span>'; }
let globalIndex=v=>verses().indexOf(v);

/* ── 1. 👂 Ascolto: la voce legge, il verso si illumina; le parole difficili sotto ── */
function listen(){
  hush(); const my=alive, st=$('stage'); st.innerHTML='';
  const poem=el('div','poem'); const items=[];
  stanzas().forEach(s=>{ const box=el('div','stanza'); s.forEach(v=>{ const b=el('button','verse',verseHTML(v,globalIndex(v))); b.onclick=()=>{ items.forEach(x=>x.classList.remove('on')); b.classList.add('on'); speak(v); }; box.appendChild(b); items.push(b); }); poem.appendChild(box); });
  const play=el('button','btn blue','▶️ Ascolta tutta la poesia');
  play.onclick=async()=>{ const r=++alive; const vs=verses(); await speak(P.title,{}); for(let i=0;i<vs.length;i++){ if(r!==alive) return; items.forEach((x,k)=>x.classList.toggle('on',k===i)); await speak(vs[i],{interrupt:false}); await wait(vs[i+1]&&stanzas().some(s=>s[s.length-1]===vs[i])?700:250); } items.forEach(x=>x.classList.remove('on')); };
  st.append(el('div','h2','🎭 '+P.title),el('p','sub','Ascolta la poesia e guarda le immagini. Le parole <span class="rh">rosa</span> fanno rima. Tocca un verso per sentirlo da solo.'),poem,play);
  if(P.words&&P.words.length){ const wb=el('div','card'); wb.style.background='var(--ground)'; wb.appendChild(el('div','h2','📌 Le parole difficili'));
    P.words.forEach(([w,d])=>{ const b=el('button','btn','<b style="color:#7048E8">'+w+'</b>: '+d); b.style.textAlign='left'; b.onclick=()=>speak(w+': '+d); wb.appendChild(b); }); st.appendChild(wb); }
}

/* ── 2. 🔁 Ripeti con me: la voce dice un verso, poi c'è il tempo per ripeterlo; poi due versi insieme ── */
function repeat(){
  hush(); const st=$('stage'); st.innerHTML='';
  const parts=partVerses(); const lines=parts.flatMap(p=>p.lines);
  const poem=el('div','poem'), box=el('div','stanza'); const items=lines.map(v=>{ const b=el('button','verse',verseHTML(v,globalIndex(v))); b.onclick=()=>speak(v); box.appendChild(b); return b; }); poem.appendChild(box);
  const say=el('div','say','Pronto? Tocca ▶️ e ripeti dopo la voce.');
  const mode=el('div','chips'); let pairs=false;
  const m1=el('button','chip','Un verso alla volta'), m2=el('button','chip','Due versi insieme'); const sm=()=>{ m1.setAttribute('aria-pressed',String(!pairs)); m2.setAttribute('aria-pressed',String(pairs)); }; m1.onclick=()=>{ pairs=false; sm(); }; m2.onclick=()=>{ pairs=true; sm(); }; sm(); mode.append(m1,m2);
  const go=el('button','btn blue','▶️ Cominciamo');
  go.onclick=async()=>{ const r=++alive; const step=pairs?2:1;
    for(let i=0;i<lines.length;i+=step){ if(r!==alive) return; const grp=lines.slice(i,i+step);
      items.forEach((x,k)=>x.classList.toggle('on',k>=i&&k<i+step)); say.textContent='👂 Ascolta…';
      for(const v of grp) await speak(v,{interrupt:false});
      if(r!==alive) return; say.textContent='🗣️ Tocca a te: ripeti!'; await wait(1800+grp.join(' ').length*90); }
    items.forEach(x=>x.classList.remove('on')); say.textContent='⭐ Bravo! Ora prova con “Scompare!”'; speak('Bravo!'); };
  st.append(el('div','h2','🔁 Ripeti con me'),el('p','sub','La voce dice un verso, poi si ferma: tu lo ripeti a voce alta.'),mode,poem,say,go);
}

/* ── 3. 🫥 Scompare! Le parole spariscono a poco a poco: prima alcune, poi metà, poi restano le iniziali, poi niente ── */
let LV=0;
const LEVELS=['Tutta la poesia','Mancano alcune parole','Manca metà delle parole','Restano le iniziali','Solo le immagini'];
function fade(){
  hush(); const st=$('stage'); st.innerHTML='';
  const parts=partVerses(); const lines=parts.flatMap(p=>p.lines);
  const lvl=el('div','level'); const less=el('button','btn','➖'), more=el('button','btn blue','➕'); less.setAttribute('aria-label','più facile'); more.setAttribute('aria-label','più difficile');
  const bar=el('div','bar'); LEVELS.forEach((_,i)=>bar.appendChild(el('i',i<=LV?'on':''))); lvl.append(less,bar,more);
  less.onclick=()=>{ LV=Math.max(0,LV-1); fade(); }; more.onclick=()=>{ LV=Math.min(4,LV+1); fade(); speak(LEVELS[LV]); };
  const poem=el('div','poem'), box=el('div','stanza');
  // le parole nascoste sono sempre le stesse a ogni livello (cresce solo il numero): così si impara davvero
  lines.forEach((v,li)=>{ const ws=v.split(' ');
    const html=ws.map((w,wi)=>{ const seed=(li*7+wi*13)%10, last=wi===ws.length-1;
      let hide= LV===1? (seed<3&&!last) : LV===2? (seed<5||last) : LV>=3;
      if(!hide) return '<span class="w">'+w+'</span>';
      if(LV===3) return '<span class="w first" data-w="'+w.replace(/"/g,'&quot;')+'">'+w[0]+'_ _</span>';
      return '<span class="w hide" data-w="'+w.replace(/"/g,'&quot;')+'">'+w+'</span>'; }).join(' ');
    const b=el('div','verse','<span class="pic">'+(P.pics&&P.pics[globalIndex(v)]||'')+'</span><span class="txt">'+html+'</span>'); box.appendChild(b); });
  poem.appendChild(box);
  // toccando una parola nascosta la si "sbircia" un attimo
  poem.querySelectorAll('[data-w]').forEach(x=>x.onclick=()=>{ const old=x.textContent; x.classList.add('peek'); x.textContent=x.dataset.w; speak(x.dataset.w); setTimeout(()=>{ x.classList.remove('peek'); x.textContent=old; },1500); });
  const hear=el('button','btn','🔊 Riascolta');
  hear.onclick=async()=>{ const r=++alive; for(const v of lines){ if(r!==alive) return; await speak(v,{interrupt:false}); } };
  st.append(el('div','h2','🫥 Scompare!'),el('p','sub','Dilla a voce alta anche se mancano le parole. Toccane una per sbirciarla. Quando va bene, tocca ➕.'),lvl,el('div','sub','<b>'+LEVELS[LV]+'</b>'),poem,hear);
}

/* ── 4. 🧩 Completa: manca una parola (soprattutto quelle in rima): quale? ── */
function complete(){
  hush(); const my=alive, st=$('stage'); const lines=partVerses().flatMap(p=>p.lines); const all=[...new Set(verses().join(' ').split(/\s+/).map(clean).filter(w=>w.length>2))];
  const qs=shuffle(lines).slice(0,Math.min(6,lines.length)).map(v=>{ const ws=v.split(' '); const idx=Math.random()<.65?ws.length-1:rnd(ws.length); return {v,ws,idx}; });
  let qi=0;
  const next=()=>{ if(my!==alive) return; st.innerHTML='';
    if(qi>=qs.length){ opts.onWin&&opts.onWin(); st.append(el('div','star','⭐'),el('div','h2','Bravissimo!'),el('p','sub','Hai completato tutti i versi.')); const b=el('button','btn main','🔄 Ancora'); b.onclick=complete; st.appendChild(b); speak('Bravissimo!'); return; }
    const {v,ws,idx}=qs[qi]; const right=clean(ws[idx]); let done=false;
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const line=el('div','verse','<span class="pic">'+(P.pics&&P.pics[globalIndex(v)]||'')+'</span><span class="txt">'+ws.map((w,i)=>i===idx?'<span class="gap">?</span>'+(/[,.!?;:]$/.test(w)?w.slice(-1):''):w).join(' ')+'</span>');
    const opts=el('div','opts'); const wrongs=shuffle(all.filter(w=>w!==right)).slice(0,2);
    shuffle([right,...wrongs]).forEach(o=>{ const b=el('button','opt',o); b.onclick=async()=>{ if(done) return;
      if(o===right){ done=true; b.classList.add('right'); line.querySelector('.gap').textContent=ws[idx].replace(/[,.!?;:]$/,''); await speak(v); await wait(500); qi++; next(); }
      else { wiggle(b); speak(o+'? Ascolta il verso.'); } }; opts.appendChild(b); });
    const hint=el('button','btn','💡 Il verso prima');
    hint.onclick=()=>{ const all=verses(), g=all.indexOf(v); speak(g>0?all[g-1]:'È il primo verso!'); };
    st.append(dots,el('div','h2','🧩 Quale parola manca?'),line,opts,hint);
    speak(ws.slice(0,idx).join(' ')+'…');
  };
  next();
}

/* ── 5. 🎤 La recito: si registra, si riascolta; il suggeritore aiuta con il verso dopo ── */
let RECS=[];
function recite(){
  hush(); const st=$('stage'); st.innerHTML='';
  const lines=partVerses().flatMap(p=>p.lines); let k=0;
  const say=el('div','say','Tocca il microfono e recita la poesia!');
  const mic=el('button','mic','🎤'); mic.setAttribute('aria-label','Registra');
  const prompt=el('button','btn','🤫 Suggeritore'); const cue=el('div','sub',''); cue.style.textAlign='center';
  prompt.onclick=()=>{ if(k>=lines.length) k=0; const v=lines[k++]; const ws=v.split(' '); cue.innerHTML='<b>'+ws.slice(0,2).join(' ')+'…</b>'; speak(ws.slice(0,2).join(' ')); };
  const recs=el('div','recs');
  const drawRecs=()=>{ recs.innerHTML=''; RECS.slice().reverse().forEach((r,i)=>{ const d=el('div','rec','<span>🎙️ '+r.when+'</span>'); const a=document.createElement('audio'); a.controls=true; a.src=r.url; d.appendChild(a); recs.appendChild(d); }); };
  let rec=null, chunks=[];
  mic.onclick=async()=>{
    if(rec&&rec.state==='recording'){ rec.stop(); return; }
    if(!navigator.mediaDevices||!window.MediaRecorder){ say.textContent='Il microfono non è disponibile: recitala a voce alta a qualcuno!'; return; }
    try{ const stream=await navigator.mediaDevices.getUserMedia({audio:true}); chunks=[]; rec=new MediaRecorder(stream);
      rec.ondataavailable=e=>chunks.push(e.data);
      rec.onstop=()=>{ stream.getTracks().forEach(t=>t.stop()); mic.classList.remove('on'); mic.textContent='🎤'; const url=URL.createObjectURL(new Blob(chunks,{type:rec.mimeType||'audio/webm'}));
        RECS.push({url,when:new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}); drawRecs(); say.textContent='⭐ Bravo! Ascoltati qui sotto.'; speak('Bravo! Ascoltati.'); };
      rec.start(); mic.classList.add('on'); mic.textContent='⏹️'; say.textContent='🔴 Sto registrando… tocca ⏹️ quando hai finito.'; k=0; cue.textContent='';
    }catch(e){ say.textContent='Il microfono non è disponibile: recitala a voce alta a qualcuno!'; } };
  st.append(el('div','h2','🎤 La recito'),el('p','sub','Recitala senza guardare. Se ti blocchi, il suggeritore ti dice l\'inizio del verso.'),mic,say,prompt,cue,recs);
  drawRecs();
}

/* ── 6. 📅 Ripassi: oggi, domani, tra 3 giorni, tra una settimana (il ripasso a distanza aiuta la memoria) ── */
function plan(){
  hush(); const st=$('stage'); st.innerHTML='';
  if(!P.start){ P.start=new Date().toISOString().slice(0,10); P.done=[]; save(); }
  const day=d=>{ const x=new Date(P.start); x.setDate(x.getDate()+d); return x; };
  const today=new Date().toISOString().slice(0,10);
  const STEPS=[[0,'Oggi: la scopro','🌱'],[1,'Domani: ripasso','🔁'],[3,'Tra 3 giorni: ripasso','🔁'],[7,'Tra una settimana: la recito','🎭']];
  const box=el('div','plan');
  STEPS.forEach(([d,l,e])=>{ const ds=day(d).toISOString().slice(0,10), ok=(P.done||[]).includes(ds), now=ds===today&&!ok;
    box.appendChild(el('div','step'+(ok?' ok':now?' now':''),'<span class="e">'+(ok?'✅':e)+'</span><span>'+l+'<br><small style="font-weight:700;opacity:.8">'+day(d).toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})+'</small></span>')); });
  const done=el('button','btn main','✅ Oggi ho ripassato');
  done.onclick=()=>{ const first=!(P.done||[]).includes(today); P.done=[...new Set([...(P.done||[]),today])]; save(); speak('Bravo! Hai ripassato oggi.'); if(first&&opts.onWin) opts.onWin(); plan(); };
  st.append(el('div','h2','📅 I miei ripassi'),el('p','sub','Ripassare tante volte un po\' alla volta, e dormirci sopra, fa ricordare molto di più. Il momento migliore: la sera prima di dormire e la mattina.'),box,done);
}

/* ── ✏️ Genitore: le poesie di questo figlio; si incolla quella della scuola ── */
function parent(){
  hush(); $('pick').innerHTML=''; $('tabs').innerHTML=''; chooser(); const st=$('stage'); st.innerHTML='';
  const addNew=el('button','btn blue','＋ Nuova poesia');
  addNew.onclick=()=>{ P={id:'p'+Date.now(),title:'',text:'',pics:[],words:[]}; LIST.push(P); parent(); };
  if(!P){ st.append(el('div','h2','✏️ Le poesie'),el('p','sub','Ancora nessuna poesia: tocca “Nuova poesia” e incolla quella della scuola.'),addNew); return; }
  const ti=el('input','in'); ti.value=P.title; ti.placeholder='Titolo';
  const ta=el('textarea','ta'); ta.value=P.text; ta.placeholder='Un verso per riga. Una riga vuota tra una strofa e l\'altra.';
  const pi=el('input','in'); pi.value=(P.pics||[]).join(' '); pi.placeholder='Un\'emoji per ogni verso (facoltativo), separate da spazi';
  const wd=el('textarea','ta'); wd.style.minHeight='80px'; wd.value=(P.words||[]).map(w=>w.join(': ')).join('\n'); wd.placeholder='Parole difficili (facoltative), una per riga: parola: spiegazione';
  const msg=el('div','sub','');
  const ok=el('button','btn main','💾 Salva la poesia'), del=el('button','btn','🗑️ Togli questa poesia');
  ok.onclick=()=>{ if(!ta.value.trim()){ msg.textContent='Incolla il testo della poesia.'; return; }
    Object.assign(P,{title:ti.value.trim()||'La mia poesia',text:ta.value.trim(),pics:pi.value.trim().split(/\s+/).filter(Boolean),words:wd.value.split('\n').map(l=>l.split(':')).filter(x=>x[0]&&x[1]).map(([a,...b])=>[a.trim(),b.join(':').trim()])});
    if(!LIST.includes(P)) LIST.push(P); save(); msg.textContent='✅ Poesia salvata!'; chooser(); opts.onSaved&&opts.onSaved(); };
  del.onclick=()=>{ if(!confirm('Togliere “'+(P.title||'questa poesia')+'”?')) return; LIST=LIST.filter(x=>x!==P); P=LIST[0]||null; save(); parent(); opts.onSaved&&opts.onSaved(); };
  st.append(el('div','h2','✏️ La poesia della scuola'),el('p','sub','Incolla la poesia: <b>un verso per riga</b>, e una <b>riga vuota</b> tra le strofe. Per imparare un pezzo alla volta, puoi lasciare una riga vuota anche a metà di una strofa lunga.'),ti,ta,pi,wd,msg,ok,addNew,del);
}

const TABS=[['👂 Ascolto',listen],['🔁 Ripeti con me',repeat],['🫥 Scompare!',fade],['🧩 Completa',complete],['🎤 La recito',recite],['📅 Ripassi',plan]];
let tab=0, inParent=false;
function chooser(){ const c=$('poems'); c.innerHTML=''; if(LIST.length<2) return;
  LIST.forEach(x=>{ const b=el('button','chip','🎭 '+x.title); b.setAttribute('aria-pressed',String(P&&x.id===P.id)); b.onclick=()=>{ P=x; part='all'; LV=0; RECS=[]; tab=0; opts.mode==='parent'?parent():render(); }; c.appendChild(b); }); }
function render(){ inParent=false; chooser(); const t=$('tabs'); t.innerHTML='';
  if(!P){ $('pick').innerHTML=''; $('stage').innerHTML='<div class="h2">🎭 '+(opts.emptyTitle||'Ancora nessuna poesia')+'</div><p class="sub">'+(opts.emptyText||'Il genitore può inserire la poesia della scuola nell\'area Genitore.')+'</p>'; return; }
  TABS.forEach(([l],i)=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(i===tab)); b.onclick=()=>{ tab=i; render(); }; t.appendChild(b); });
  pickBar(); TABS[tab][1](); }
if(opts.mode==='parent') parent(); else render();

  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
