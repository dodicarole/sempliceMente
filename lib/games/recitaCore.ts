// @ts-nocheck
/*
 * 🎬 La mia parte nella recita, dentro "Imparo la poesia": copione a scene, Ascolta, Ripeti con me, Spariscono, Tocca a te!
 * (con il suggeritore), Il gesto e Il percorso. La parte è per figlio (recita_parte); il percorso è lo stesso che l'app mette
 * nel piano di lavoro (lib/recita.ts → lib/plans.ts).
 */
export interface RecitaOptions { mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void; demo?: boolean; tab?: number; onSaved?: () => void; stepFor?: (iso: string) => { label: string; tab: number } | null }
export const RECITA_CSS = ".smrc{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#5468D8;--mine:#7048E8;--mine-bg:#F3F0FF;--radius:22px;\n  box-sizing:border-box}\n\n.smrc *{box-sizing:border-box}\n.smrc{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smrc button,.smrc input,.smrc select{font-family:inherit;color:inherit}\n.smrc button{cursor:pointer;touch-action:manipulation}\n.smrc button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smrc [hidden]{display:none!important}\n.smrc .app{max-width:560px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smrc .title{background:var(--card);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smrc .title .l{display:flex;align-items:center;gap:12px}\n.smrc .title .em{font-size:36px}\n.smrc .title h1{margin:0;font-size:21px;font-weight:900}\n.smrc .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smrc .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.smrc .role{background:var(--mine);color:#fff;border-radius:18px;padding:12px 16px;font-size:18px;font-weight:900;display:flex;align-items:center;gap:10px}\n.smrc .role .e{font-size:34px}\n.smrc .tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.smrc .tab{min-height:54px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:800;line-height:1.2;padding:0 4px}\n.smrc .tab[aria-current=\"true\"]{background:var(--mine);border-color:var(--mine);color:#fff}\n.smrc .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.smrc .ask{margin:0;font-size:22px;font-weight:900;line-height:1.3}\n.smrc .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smrc /* il copione */\n.script{display:flex;flex-direction:column;gap:8px;width:100%;text-align:left}\n.smrc .ln{border-radius:14px;padding:10px 12px;background:var(--ground);font-size:17px;font-weight:700;line-height:1.45;border:3px solid transparent}\n.smrc .ln b{display:block;font-size:13px;font-weight:900;color:var(--soft)}\n.smrc .ln.mine{background:var(--mine-bg);border-color:var(--mine)}\n.smrc .ln.mine b{color:var(--mine)}\n.smrc .ln.now{box-shadow:0 0 0 4px #FFD43B}\n.smrc.big{font-size:26px;font-weight:900;line-height:1.45;padding:14px;border-radius:18px;background:var(--mine-bg);border:3px solid var(--mine);width:100%}\n.smrc.big .w{display:inline-block;margin:0 3px}\n.smrc.big .w.hide{color:transparent;background:#D0BFFF;border-radius:8px}\n.smrc .cue{width:100%;border-radius:16px;padding:12px;background:var(--ground);font-size:18px;font-weight:700;line-height:1.45;text-align:left}\n.smrc .cue b{display:block;font-size:13px;font-weight:900;color:var(--soft)}\n.smrc .pic{font-size:62px;line-height:1}\n.smrc .gesto{font-size:16px;font-weight:900;color:var(--mine);background:var(--mine-bg);border-radius:999px;padding:6px 14px}\n.smrc .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;width:100%}\n.smrc .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.smrc .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smrc .btn.mine{background:var(--mine);border-color:var(--mine);color:#fff}\n.smrc .btn.help{background:#FFF3BF;border-color:#F0C93C}\n.smrc .steps{display:flex;gap:6px;justify-content:center}\n.smrc .steps button{min-width:46px;min-height:46px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:900}\n.smrc .steps button[aria-pressed=\"true\"]{background:var(--mine);border-color:var(--mine);color:#fff}\n.smrc .dots{display:flex;gap:6px}\n.smrc .dots span{width:10px;height:10px;border-radius:50%;background:var(--line)}\n.smrc .dots .on{background:var(--mine);width:22px;border-radius:5px}\n.smrc .dots .ok{background:var(--done)}\n.smrc .dots .ko{background:#FFA94D}\n.smrc .plan{display:flex;flex-direction:column;gap:8px;width:100%;text-align:left}\n.smrc .day{border-radius:14px;padding:10px 12px;background:var(--ground);font-size:15px;font-weight:800;display:flex;gap:10px;align-items:center}\n.smrc .day.today{background:var(--mine-bg);border:3px solid var(--mine)}\n.smrc .day.past{opacity:.5}\n.smrc .day .n{min-width:64px;font-size:13px;color:var(--soft)}\n.smrc .star{font-size:60px;animation:pop .5s ease-out}\n.smrc .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:12px}\n.smrc .set{display:flex;flex-direction:column;gap:6px}\n.smrc .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.smrc .in{width:100%;min-height:44px;border-radius:12px;border:2px solid var(--line);background:var(--ground);padding:0 10px;font-size:15px;font-weight:700}\n.smrc .er{display:flex;flex-direction:column;gap:6px;border:2px solid var(--line);border-radius:14px;padding:8px}\n.smrc .er.mine{border-color:var(--mine);background:var(--mine-bg)}\n.smrc .er .r{display:flex;gap:6px;align-items:center}\n.smrc .er .e{max-width:56px;text-align:center}\n.smrc .chip{min-height:40px;padding:0 10px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:14px;font-weight:800;white-space:nowrap}\n.smrc .chip[aria-pressed=\"true\"]{background:var(--mine);border-color:var(--mine);color:#fff}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@media (prefers-reduced-motion:reduce){.smrc *{animation:none!important}}"
export function mountRecita(root: HTMLElement, opts: RecitaOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left;font-size:20px\">La parte (area genitore)</div>\n    <div class=\"set\"><span>🎭 Il personaggio del bambino</span><div class=\"row\" style=\"flex-wrap:nowrap\"><input data-k=\"pe\" class=\"in\" style=\"max-width:64px;text-align:center\"><input data-k=\"pn\" class=\"in\" placeholder=\"Per esempio: la Luna\"></div></div>\n    <div class=\"set\"><span>🎄 Il titolo della recita</span><input data-k=\"pt\" class=\"in\" placeholder=\"Per esempio: La nascita di Gesù\"></div>\n    <div class=\"set\"><span>📅 Il giorno della recita</span><input data-k=\"pd\" class=\"in\" type=\"date\"></div>\n    <div class=\"set\"><span>🎬 Le scene</span><div data-k=\"scl\" style=\"display:flex;flex-direction:column;gap:6px\"></div><button class=\"chip\" data-k=\"adds\">＋ Aggiungi una scena</button></div>\n    <div class=\"set\"><span>📜 Il copione: tutte le battute in ordine. Tocca «È mia» su quelle del bambino; per le sue puoi scegliere un'immagine e un gesto.</span><div data-k=\"ed\" style=\"display:flex;flex-direction:column;gap:8px\"></div><button class=\"chip\" data-k=\"add\">＋ Aggiungi una battuta</button></div>\n    <div class=\"set\"><span>📋 Metti la prova della recita nel piano di lavoro, ogni giorno fino alla recita</span><div class=\"row\" style=\"justify-content:flex-start\" data-k=\"plc\"></div></div>\n    <div class=\"set\"><span>⏱️ Quanti minuti al giorno</span><div class=\"row\" style=\"justify-content:flex-start\" data-k=\"plm\"></div></div>\n    <button class=\"chip\" data-k=\"demoP\">📥 Carica l’esempio «La nascita di Gesù»</button>\n    \n  </section>\n  <div class=\"role\" data-k=\"role\"></div>\n  <nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <section class=\"card\" data-k=\"stage\"></section>"

/* ── la parte d'esempio: la recita di Natale, «La nascita di Gesù», in cinque scene; il bambino è Giuseppe, nella scena 4 ── */
const DEMO={v:2,title:'La nascita di Gesù',name:'Giuseppe',e:'🧔',date:'2026-12-20',
 scenes:['L’annuncio dell’angelo','Il viaggio verso Betlemme','Non c’è posto','Nella capanna','I pastori e la stella'],
 lines:[
 {s:1,who:'Narratore',text:'Tanto tempo fa, in un piccolo paese chiamato Nazareth, viveva una ragazza di nome Maria.',mine:false},
 {s:1,who:'Angelo',text:'Non avere paura, Maria: avrai un bambino, e lo chiamerai Gesù.',mine:false},
 {s:1,who:'Maria',text:'Sono pronta: sia fatto come hai detto.',mine:false},
 {s:2,who:'Narratore',text:'Maria e il suo sposo partirono per Betlemme. Il viaggio era lungo e faceva freddo.',mine:false},
 {s:2,who:'Maria',text:'Sono tanto stanca… manca ancora molto?',mine:false},
 {s:3,who:'Narratore',text:'A Betlemme bussarono a tutte le porte, ma le locande erano piene.',mine:false},
 {s:3,who:'Locandiere',text:'Mi dispiace, non c’è più posto. Però dietro la casa c’è una stalla.',mine:false},
 {s:4,who:'Narratore',text:'Nella stalla c’erano un bue e un asinello, e tanta paglia.',mine:false},
 {s:4,who:'Giuseppe',text:'Maria, questa stalla è piccola, ma qui saremo al caldo.',mine:true,e:'🏠',g:'👉 Indica la stalla'},
 {s:4,who:'Maria',text:'Giuseppe, guarda: il bambino è nato!',mine:false},
 {s:4,who:'Giuseppe',text:'Che bello! Lo chiameremo Gesù, come ha detto l’angelo.',mine:true,e:'👶',g:'🤲 Apri le mani verso il bambino'},
 {s:4,who:'Pastore',text:'Possiamo entrare? Una stella ci ha portato fin qui.',mine:false},
 {s:4,who:'Giuseppe',text:'Venite, pastori, entrate pure: c’è posto per tutti!',mine:true,e:'⭐',g:'🙌 Allarga le braccia'},
 {s:5,who:'Narratore',text:'Quella notte la stella brillò su tutto il mondo.',mine:false},
 {s:5,who:'Tutti',text:'Buon Natale a tutti!',mine:false},
]};
const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };
const EMPTY={v:2,title:'',name:'',e:'🎭',date:'',scenes:['Scena 1'],lines:[]};
let P=store('recita_parte',null); if(!P||!P.scenes) P=JSON.parse(JSON.stringify(opts.demo?DEMO:EMPTY));
const save=()=>{ keepS('recita_parte',P); opts.onSaved&&opts.onSaved(); };
const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const keep=[]; let alive=0;
/* due voci: quella del bambino (più alta) e quella degli altri personaggi (più bassa) */
function speak(t,other){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='it-IT'; u.rate=.85; u.pitch=other?.8:1.3; const vs=speechSynthesis.getVoices().filter(v=>v.lang.startsWith('it')); if(vs.length) u.voice=vs[other&&vs.length>1?1:0];
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1500+t.length*85); setTimeout(()=>speechSynthesis.speak(u),60); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
const mine=()=>P.lines.map((l,i)=>({...l,i})).filter(l=>l.mine);
const cueOf=i=>{ const sc=P.lines[i].s; for(let k=i-1;k>=0&&P.lines[k].s===sc;k--) if(!P.lines[k].mine) return P.lines[k]; return null; };
const sceneName=n=>'Scena '+n+(P.scenes[n-1]?': '+P.scenes[n-1]:'');
const myScenes=()=>[...new Set(mine().map(l=>l.s))];
/* una battuta lunga si spezza in pezzetti (alle virgole, o a metà) */
function chunks(t){ const p=t.split(/(?<=[,;:!?.])\s+/).filter(Boolean); if(p.length>1) return p; const w=t.split(' '); return w.length>8?[w.slice(0,Math.ceil(w.length/2)).join(' '),w.slice(Math.ceil(w.length/2)).join(' ')]:[t]; }

/* ── 🎧 Ascolta la storia: tutta la scena, con le battute del bambino evidenziate ── */
let lsc=null;
function listen(){ hush(); const my=alive, st=$('stage'); st.innerHTML=''; if(lsc===null) lsc=myScenes()[0]||0;
  st.append(el('p','ask','🎧 Ascolta la storia'),el('p','sub','Le tue battute sono quelle viola. Scegli una scena, oppure tutta la recita.'));
  const bar=el('div','steps'); bar.style.flexWrap='wrap'; [[0,'Tutta'],...P.scenes.map((_,k)=>[k+1,(myScenes().includes(k+1)?'⭐ ':'')+(k+1)])].forEach(([v,l])=>{ const b=el('button','',l); b.style.padding='0 10px'; b.setAttribute('aria-pressed',String(lsc===v)); b.onclick=()=>{ lsc=v; listen(); }; bar.appendChild(b); }); st.appendChild(bar);
  const list=P.lines.filter(l=>!lsc||l.s===lsc), sc=el('div','script'); let cur=0;
  const items=list.map(l=>{ if(l.s!==cur){ cur=l.s; sc.appendChild(el('div','sub','<b>🎬 '+esc(sceneName(cur))+'</b>')); } const d=el('div','ln'+(l.mine?' mine':''),'<b>'+esc(l.mine?(P.e+' '+l.who+' (tu!)'):l.who)+'</b>'+esc(l.text)); sc.appendChild(d); return d; }); st.appendChild(sc);
  const play=el('button','btn mine',lsc?'▶️ Ascolta la scena '+lsc:'▶️ Ascolta tutta la recita'); st.appendChild(play);
  play.onclick=async()=>{ play.disabled=true; for(let i=0;i<list.length;i++){ if(my!==alive) return; items.forEach(x=>x.classList.remove('now')); items[i].classList.add('now'); items[i].scrollIntoView({block:'nearest',behavior:'smooth'}); await speak(list[i].text,!list[i].mine); await wait(350); } items.forEach(x=>x.classList.remove('now')); play.disabled=false; }; }

/* ── 🔁 Ripeti con me: una battuta alla volta, a pezzetti ── */
let ri=0;
function repeat(){ hush(); const st=$('stage'); st.innerHTML=''; const L=mine(); if(!L.length) return st.appendChild(el('p','sub','Non ci sono ancora battute del bambino.')); ri=ri%L.length; const l=L[ri], parts=chunks(l.text); let pi=0;
  const dots=el('div','dots'); L.forEach((_,k)=>dots.appendChild(el('span',k===ri?'on':k<ri?'ok':'')));
  const big=el('div','big'); const draw=()=>{ big.innerHTML=parts.map((p,k)=>'<span style="'+(k===pi?'':'opacity:.35')+'">'+esc(p)+'</span>').join(' '); }; draw();
  const r=el('div','row'), again=el('button','btn','🔊 Ancora'), next=el('button','btn mine','Avanti →');
  again.onclick=()=>speak(parts[pi]); next.onclick=()=>{ if(pi<parts.length-1){ pi++; draw(); speak(parts[pi]); } else { ri++; repeat(); } };
  r.append(again,next); st.append(dots,el('p','ask','🔁 Ripeti con me'),l.e?el('div','pic',l.e):el('span'),big,el('p','sub','Ascolta il pezzetto colorato, poi ripetilo ad alta voce.'),r); speak(parts[pi]); }

/* ── 🫥 Le parole che spariscono: a ogni passo se ne nascondono di più, poi restano solo le prime lettere, poi niente ── */
let vi=0, vstep=0;
function vanish(){ hush(); const st=$('stage'); st.innerHTML=''; const L=mine(); if(!L.length) return; vi=vi%L.length; const l=L[vi], words=l.text.split(' ');
  const order=words.map((_,k)=>k).sort((a,b)=>((a*7+3)%words.length)-((b*7+3)%words.length));   // sempre lo stesso ordine per la stessa battuta
  const STEPS=['Tutta','Un po’','Metà','Quasi tutte','Prime lettere','Niente'];
  const show=()=>{ const n=Math.round(words.length*[0,.25,.5,.75,1,1][vstep]); const hid=new Set(order.slice(0,n));
    big.innerHTML=words.map((w,k)=>vstep===4?'<span class="w">'+esc(w[0])+'<span style="color:transparent">'+esc(w.slice(1))+'</span></span>':'<span class="w'+(hid.has(k)?' hide':'')+'">'+esc(w)+'</span>').join(' ');
    steps.querySelectorAll('button').forEach((b,k)=>b.setAttribute('aria-pressed',String(k===vstep))); };
  const steps=el('div','steps'); STEPS.forEach((s,k)=>{ const b=el('button','',String(k+1)); b.title=s; b.onclick=()=>{ vstep=k; show(); }; steps.appendChild(b); });
  const big=el('div','big'); const r=el('div','row'), hear=el('button','btn help','🔊 Ascolta per controllare'), more=el('button','btn mine','Nascondi di più →'), nx=el('button','btn','Battuta dopo');
  hear.onclick=()=>speak(l.text); more.onclick=()=>{ if(vstep<5){ vstep++; show(); } }; nx.onclick=()=>{ vi++; vstep=0; vanish(); };
  r.append(hear,more,nx); st.append(el('p','ask','🫥 Dilla anche se le parole spariscono'),l.e?el('div','pic',l.e):el('span'),big,steps,el('p','sub','Dì la battuta ad alta voce, poi controlla ascoltandola.'),r); show(); }

/* ── 🎭 Tocca a te! L'app dice la battuta prima (con l'altra voce), il bambino dice la sua ── */
let ti=0, tres=[];
function turn(){ hush(); const my=alive, st=$('stage'); st.innerHTML=''; const L=mine(); if(!L.length) return;
  if(ti>=L.length){ const ok=tres.filter(x=>x==='ok').length; st.append(el('div','star','⭐'),el('p','ask',ok===L.length?'Bravissima! Hai detto tutte le battute da sola!':'Brava! '+ok+' su '+L.length+' da sola.'),el('p','sub','Domani ripassiamo quelle con il suggeritore.')); const b=el('button','btn main','🔄 Da capo'); b.onclick=()=>{ ti=0; tres=[]; turn(); }; st.appendChild(b); speak('Brava! Applausi!'); return; }
  const l=L[ti], cue=cueOf(l.i); let helps=0;
  const dots=el('div','dots'); L.forEach((_,k)=>dots.appendChild(el('span',k<ti?(tres[k]==='ok'?'ok':'ko'):k===ti?'on':'')));
  const cueBox=el('div','cue',(cue?'<b>'+esc(sceneName(l.s))+' · '+esc(cue.who)+' dice:</b>'+esc(cue.text):'<b>'+esc(sceneName(l.s))+'</b>La scena comincia con te!'));
  const you=el('div','big'); you.innerHTML='<span style="color:var(--soft)">🎤 Tocca a te!</span>'; const gest=l.g?el('div','gesto',l.g):el('span');
  const r=el('div','row'), okB=el('button','btn main','✅ L’ho detta!'), help=el('button','btn help','💡 Aiutami');
  okB.onclick=async()=>{ tres[ti]=helps?'help':'ok'; you.innerHTML=esc(l.text); await speak(l.text); await wait(300); if(my!==alive) return; ti++; turn(); };
  help.onclick=()=>{ helps++; const w=l.text.split(' '); if(helps===1){ you.innerHTML=esc(w.slice(0,3).join(' '))+' …'; speak(w.slice(0,3).join(' ')); } else { you.innerHTML=esc(l.text); speak(l.text); } };
  r.append(okB,help); st.append(dots,el('p','sub','Ascolta: quando senti questa battuta, tocca a te.'),cueBox,l.e?el('div','pic',l.e):el('span'),gest,you,r);
  (async()=>{ if(cue){ await speak(cue.text,true); } else { await speak(sceneName(l.s)); } if(my===alive) speak('Tocca a te!'); })(); }

/* ── 🙋 Il gesto: ogni battuta con il suo movimento ── */
function gestures(){ hush(); const st=$('stage'); st.innerHTML=''; st.append(el('p','ask','🙋 Ogni battuta ha il suo gesto'),el('p','sub','Fai il gesto mentre dici la battuta: il corpo aiuta a ricordare.'));
  const sc=el('div','script'); mine().forEach(l=>{ const d=el('button','ln mine','<b>'+esc((l.e||'')+' '+(l.g||'Scegli un gesto nell’area genitore'))+'</b>'+esc(l.text)); d.style.textAlign='left'; d.onclick=()=>speak((l.g?l.g.replace(/^\S+\s/,'')+'. ':'')+l.text); sc.appendChild(d); }); st.appendChild(sc); }

/* ── 📅 Il percorso fino alla recita: pochi minuti al giorno ── */
function plan(){ hush(); const st=$('stage'); st.innerHTML=''; st.appendChild(el('p','ask','📅 Il percorso fino alla recita'));
  if(!P.date){ st.appendChild(el('p','sub','Il genitore può mettere la data della recita nelle impostazioni ⚙️: qui comparirà il percorso giorno per giorno.')); return; }
  const today=new Date(); today.setHours(0,0,0,0); const end=new Date(P.date+'T00:00:00'); const days=Math.round((end-today)/864e5);
  if(days<0){ st.appendChild(el('p','sub','La recita c’è già stata: com’è andata? 🎉')); return; }
  st.appendChild(el('p','sub',days===0?'La recita è oggi! In bocca al lupo! 🍀':'Mancano '+days+(days===1?' giorno':' giorni')+' alla recita.'));
  const pl=el('div','plan'), MIN=P.min||5;
  for(let k=0;k<=Math.min(days,40);k++){ const dd=new Date(today); dd.setDate(today.getDate()+k); const isoD=dd.getFullYear()+'-'+String(dd.getMonth()+1).padStart(2,'0')+'-'+String(dd.getDate()).padStart(2,'0');
    if(isoD===P.date) break; const s=opts.stepFor?opts.stepFor(isoD):null; if(!s) continue; const isToday=k===0;
    const d=el('div','day'+(isToday?' today':''),'<span class="n">'+dd.toLocaleDateString('it-IT',{weekday:'short',day:'numeric'})+'</span><span>'+s.label+' · '+MIN+' minuti</span>');
    if(isToday){ const go=el('button','chip','Comincia'); go.onclick=()=>{ tab=s.tab; render(); }; d.appendChild(go); } pl.appendChild(d); }
  pl.appendChild(el('div','day today','<span class="n">'+end.toLocaleDateString('it-IT',{weekday:'short',day:'numeric'})+'</span><span>🎭 La recita! Respira, sorridi e divertiti.</span>'));
  st.appendChild(pl); }

/* ── schede ── */
const TABS=[['🎧 Ascolta',listen],['🔁 Ripeti con me',repeat],['🫥 Spariscono',vanish],['🎭 Tocca a te!',turn],['🙋 Il gesto',gestures],['📅 Il percorso',plan]];
let tab=0;
function render(){ if(!mine().length&&opts.mode!=='parent'){ $('role').hidden=true; $('tabs').hidden=true; $('stage').innerHTML='<p class="ask">🎬 La recita</p><p class="sub">Qui il bambino imparerà la sua parte. Il genitore può inserirla nell’area Genitore → 🎭.</p>'; return; } $('role').hidden=false; $('tabs').hidden=false; const ms=myScenes(); $('role').innerHTML='<span class="e">'+esc(P.e||'🎭')+'</span><span>Io sono '+esc(P.name||'…')+(ms.length?'<br><small style="font-size:14px;opacity:.9">'+esc(P.title||'La recita')+' · '+(ms.length===1?'scena ':'scene ')+ms.join(', ')+'</small>':'')+'</span>'; const t=$('tabs'); t.innerHTML='';
  TABS.forEach(([l],i)=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(i===tab)); b.onclick=()=>{ tab=i; ti=0; tres=[]; render(); }; t.appendChild(b); }); TABS[tab][1](); }

/* ── l'area genitore: il copione ── */
function editor(){ $('pe').value=P.e||''; $('pn').value=P.name||''; $('pd').value=P.date||''; $('pt').value=P.title||'';
  const scl=$('scl'); scl.innerHTML=''; P.scenes.forEach((t,k)=>{ const r=el('div','row'); r.style.flexWrap='nowrap'; const n=el('span','chip',String(k+1)); const inp=el('input','in'); inp.value=t; inp.oninput=()=>{ P.scenes[k]=inp.value; save(); }; r.append(n,inp); scl.appendChild(r); });
  const ed=$('ed'); ed.innerHTML='';
  P.lines.forEach((l,i)=>{ const b=el('div','er'+(l.mine?' mine':'')); const r1=el('div','r');
    const who=el('input','in'); who.value=l.who; who.placeholder='Chi parla'; who.style.maxWidth='34%'; who.oninput=()=>{ l.who=who.value; save(); };
    const m=el('button','chip',l.mine?'⭐ È mia':'È mia?'); m.setAttribute('aria-pressed',String(!!l.mine)); m.onclick=()=>{ l.mine=!l.mine; if(l.mine&&!l.who) l.who=P.name; save(); editor(); };
    const x=el('button','chip','✕'); x.setAttribute('aria-label','togli'); x.onclick=()=>{ P.lines.splice(i,1); save(); editor(); };
    const sel=el('select','in'); sel.style.maxWidth='76px'; P.scenes.forEach((_,k)=>{ const o=el('option','','Sc. '+(k+1)); o.value=k+1; if(l.s===k+1) o.selected=true; sel.appendChild(o); }); sel.onchange=()=>{ l.s=+sel.value; save(); };
    r1.append(sel,who,m,x); const tx=el('input','in'); tx.value=l.text; tx.placeholder='La battuta'; tx.oninput=()=>{ l.text=tx.value; save(); }; b.append(r1,tx);
    if(l.mine){ const r2=el('div','r'); const e=el('input','in e'); e.value=l.e||''; e.placeholder='🙂'; e.oninput=()=>{ l.e=e.value; save(); }; const g=el('input','in'); g.value=l.g||''; g.placeholder='Il gesto (per esempio: 👋 Saluta con la mano)'; g.oninput=()=>{ l.g=g.value; save(); }; r2.append(e,g); b.appendChild(r2); }
    ed.appendChild(b); }); }
$('pe').oninput=()=>{ P.e=$('pe').value; save(); }; $('pn').oninput=()=>{ P.name=$('pn').value; save(); }; $('pd').oninput=()=>{ P.date=$('pd').value; P.start=''; P.skip=[]; save(); };
$('add').onclick=()=>{ P.lines.push({s:P.scenes.length||1,who:'',text:'',mine:false}); save(); editor(); };
$('adds').onclick=()=>{ P.scenes.push('Nuova scena'); save(); editor(); };
$('pt').oninput=()=>{ P.title=$('pt').value; save(); };
function planChips(){ const box=$('plc'); box.innerHTML='';
  [[true,'Sì'],[false,'No']].forEach(([v,l])=>{ const c=el('button','chip',l); c.setAttribute('aria-pressed',String((P.plan!==false)===v)); c.onclick=()=>{ P.plan=v; save(); planChips(); }; box.appendChild(c); });
  const mb=$('plm'); mb.innerHTML=''; [5,10,15].forEach(m=>{ const c=el('button','chip',m+' min'); c.setAttribute('aria-pressed',String((P.min||5)===m)); c.onclick=()=>{ P.min=m; save(); planChips(); }; mb.appendChild(c); }); }
$('demoP').onclick=()=>{ if(P.lines.length&&!confirm('Sostituire la parte con l’esempio «La nascita di Gesù»?')) return; const keepPlan={plan:P.plan,min:P.min}; P=Object.assign(JSON.parse(JSON.stringify(DEMO)),keepPlan); save(); editor(); planChips(); };
if(opts.mode==='parent'){ $('panel').hidden=false; $('role').hidden=true; $('tabs').hidden=true; $('stage').hidden=true; editor(); planChips(); }
else { if(typeof opts.tab==='number') tab=opts.tab; if(opts.allowSettings){ $('panel').hidden=false; editor(); planChips(); } render(); }
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
