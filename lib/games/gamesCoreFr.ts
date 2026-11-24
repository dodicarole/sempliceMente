// @ts-nocheck
/*
 * 🎲 I giochi (Dove salta Tedo?, Trova le differenze, Cosa manca nello zaino?, Tedo mangione,
 * La rima di Lila, La parola spezzata, L'intruso, Il mercatino di Elio, Quanti sono?, Come si sente?, Ferma o vai?).
 * È lo stesso codice dei prototipi già provati: lavora direttamente sugli elementi della pagina,
 * dentro un contenitore con la classe "smg" (anche lo stile vale solo lì dentro).
 * GamesView.tsx lo monta e lo smonta.
 */
interface GamesOptions { settings?: Record<string, unknown>; allowSettings?: boolean; onWin?: () => void; onSettings?: (s: Record<string, unknown>) => void }
export function mountGamesFr(root: HTMLElement, opts: GamesOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left\">Réglages</div>\n    <div class=\"set\"><span>⏱️ Le rythme des jeux de mémoire (tous sauf Tedo le gourmand)</span><div class=\"chips\" data-key=\"pace\"></div></div>\n    <div class=\"set\"><span>🐸 Où saute Tedo : combien de sauts au début</span><div class=\"chips\" data-key=\"jumps\"></div></div>\n    <div class=\"set\"><span>🎒 Le cartable : combien d’objets au début</span><div class=\"chips\" data-key=\"objs\"></div></div>\n    <div class=\"set\"><span>🎯 Combien : combien de points au début</span><div class=\"chips\" data-key=\"dots\"></div></div>\n    <div class=\"set\"><span>🔍 Les différences : combien</span><div class=\"chips\" data-key=\"diffs\"></div></div>\n    <div class=\"set\"><span>🐸 Où saute Tedo : combien de nénuphars</span><div class=\"chips\" data-key=\"pads\"></div></div>\n    <div class=\"set\"><span>🧩 Le mot coupé : syllabes écrites</span><div class=\"chips\" data-key=\"written\"></div></div>\n    <div class=\"set\"><span>😊 Comment se sent-il : combien d’émotions</span><div class=\"chips\" data-key=\"faces\"></div></div>\n    <div class=\"set\"><span>🐸 Tedo le gourmand : ce qu’il peut manger</span><div class=\"chips\" data-key=\"eat\"></div></div>\n    <div class=\"set\"><span>🐸 Tedo le gourmand : vitesse de la route</span><div class=\"chips\" data-key=\"speed\"></div></div>\n  </section>\n  <section data-k=\"view\" style=\"display:flex;flex-direction:column;gap:14px\"></section>"
const __win = opts.onWin

let S=Object.assign({pads:6,written:true,faces:3,eat:'frutta',speed:'lento',pace:'lento',jumps:2,objs:3,dots:5,diffs:3},opts.settings||{});
// il ritmo dei giochi di memoria e attenzione (tutti tranne Tedo mangione): "lento" dà quasi il doppio del tempo
const K=()=>S.pace==='normale'?1:1.8;
const OPT={pads:[[6,'6'],[9,'9']],written:[[true,'Oui'],[false,'No']],faces:[[2,'2'],[3,'3']],eat:[['frutta','Les fruits'],['grandi','Les nombres plus grands que 5'],['pari','Les nombres pairs']],speed:[['lento','Lente'],['normale','Normale']],pace:[['lento','Lent'],['normale','Normale']],jumps:[[2,'2 sauts'],[3,'3 sauts'],[4,'4 sauts']],objs:[[3,'3 objets'],[4,'4 objets'],[5,'5 objets']],dots:[[3,'jusqu’à 3'],[5,'jusqu’à 5'],[7,'jusqu’à 7']],diffs:[[2,'2'],[3,'3'],[4,'4']]};
const ROUNDS=6;
const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function speak(t,{rate=.88,interrupt=true}={}){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ if(interrupt) speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='fr-FR'; u.rate=rate; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('fr')); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1200+t.length*100); setTimeout(()=>speechSynthesis.speak(u),interrupt?80:0); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
/* una nota per ogni ninfea: aiuta a ricordare la sequenza anche con l'orecchio */
let AC=null;
function tone(i){ try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); const f=[262,294,330,349,392,440,494,523,587][i%9], t=AC.currentTime, o=AC.createOscillator(), g=AC.createGain();
  o.type='triangle'; o.frequency.value=f; g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(.15,t+.02); g.gain.exponentialRampToValueAtTime(.0001,t+.35); o.connect(g).connect(AC.destination); o.start(t); o.stop(t+.4); }catch(e){} }
const FROG='<svg viewBox="0 0 100 100" width="70" height="70"><ellipse cx="50" cy="62" rx="36" ry="28" fill="#4FB36C" stroke="#2F7D47" stroke-width="3"/><circle cx="34" cy="34" r="13" fill="#4FB36C" stroke="#2F7D47" stroke-width="3"/><circle cx="66" cy="34" r="13" fill="#4FB36C" stroke="#2F7D47" stroke-width="3"/><circle cx="34" cy="34" r="8" fill="#fff"/><circle cx="66" cy="34" r="8" fill="#fff"/><circle cx="35" cy="35" r="4" fill="#1F2147"/><circle cx="65" cy="35" r="4" fill="#1F2147"/><path d="M36 66 Q50 78 64 66" stroke="#1F2147" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="24" cy="60" r="5" fill="#F59AA0" opacity=".6"/><circle cx="76" cy="60" r="5" fill="#F59AA0" opacity=".6"/></svg>';

function end(st,again,text){ __win&&__win(); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask','Fantastique !'),el('p','sub',text)); const b=el('button','btn main','🔄 Encore'); b.onclick=again; const h=el('button','btn','🎲 Autres jeux'); h.onclick=home; st.append(b,h); speak('Fantastique !'); }

/* ── 🎲 L'elenco dei giochi ── */
const GAMES=[
  ['🧠 Attention et mémoire'],
  ['memo','🐸','Où saute Tedo ?','Regarde où saute Tedo, puis refais ses sauts.','#2F9E44'],
  ['diff','🔍','Trouve les différences','Deux dessins presque pareils : trouve les différences.','#1C7ED6'],
  ['zaino','🎒','Qu’est-ce qui manque dans le cartable ?','Regarde les objets, un disparaît : lequel ?','#F08C00'],
  ['mangia','🐸','Tedo le gourmand','Tedo avance sur la route et mange seulement les bonnes choses : plus il mange, plus il grandit !','#5CC27A'],
  ['📖 Langage et lecture'],
  ['rima','🎵','La rime de Lila','Quel mot rime ? Chat… rat !','#C2255C'],
  ['sill','🧩','Le mot coupé','Écoute les morceaux d’un mot et trouve l’image.','#7048E8'],
  ['intruso','🕵️','L’intrus','Trois choses vont ensemble, une non : trouve-la !','#0B7285'],
  ['🔢 Nombres'],
  ['merc','🛒','Le petit marché d’Elio','Elio achète deux choses : paie avec les bonnes pièces.','#E8A400'],
  ['colpo','🎯','Combien ? En un coup d’œil','Les points apparaissent un instant : combien y en avait-il ?','#5F3DC4'],
  ['💛 Émotions et règles'],
  ['emo','😊','Comment se sent-il ?','Lis ce qui arrive aux amis et choisis la bonne émotion.','#E64980'],
  ['stop','🚦','Stop ou go ?','Touche seulement au vert : au rouge, on attend.','#E03131'],
];
function home(){ hush(); const v=$('view'); v.innerHTML='';
  GAMES.forEach(g=>{ if(g.length===1){ v.appendChild(el('div','group',g[0])); return; }
    const [id,e,t,s,c]=g; const b=el('button','game','<span class="e">'+e+'</span><span><b>'+t+'</b><span>'+s+'</span></span>'); b.style.setProperty('--c',c); b.onclick=()=>({memo,sill,emo,diff,zaino,rima,intruso,merc,colpo,stop,mangia})[id](); v.appendChild(b); }); }
function frame(title){ const v=$('view'); v.innerHTML=''; const b=el('button','back','← Les jeux'); b.onclick=home; const c=el('div','card'); v.append(b,c); return c; }

/* ── 🐸 Dove salta Tedo? La sequenza cresce di uno quando è giusta, cala dopo due errori ── */
function memo(){
  hush(); const my=alive; const card=frame(); let len=S.jumps, round=0, misses=0;
  const cols=S.pads===9?3:3, rows=S.pads===9?3:2;
  const next=async()=>{
    if(my!==alive) return;
    if(round>=ROUNDS) return end(card,memo,'Tu t’es souvenu de tous les sauts de Tedo ! Tu es arrivé à '+len+' sauts.');
    card.innerHTML='';
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<round?'ok':i===round?'on':''));
    const lvl=el('div','level',len+' sauts');
    const say=el('div','say','Regarde bien…');
    const pond=el('div','pond'); pond.style.gridTemplateColumns='repeat('+cols+',1fr)'; pond.style.gridTemplateRows='repeat('+rows+',1fr)';
    if(rows===2) pond.style.aspectRatio='3/2';
    const pads=[]; for(let i=0;i<S.pads;i++){ const p=el('button','pad'); p.setAttribute('aria-label','nénuphar '+(i+1)); pond.appendChild(p); pads.push(p); }
    const frog=el('div','frog',FROG); pond.appendChild(frog);
    card.append(dots,lvl,say,pond);
    const place=i=>{ const pr=pond.getBoundingClientRect(), r=pads[i].getBoundingClientRect(); frog.style.transform='translate('+(r.left-pr.left+r.width/2-35)+'px,'+(r.top-pr.top+r.height/2-45)+'px)'; };
    // la sequenza: mai due volte di fila la stessa ninfea
    const seq=[]; for(let i=0;i<len;i++){ let k; do{ k=rnd(S.pads); }while(k===seq[seq.length-1]); seq.push(k); }
    await wait(300); frog.style.transition='none'; place(seq[0]); frog.style.opacity='0'; await wait(50); frog.style.transition=''; frog.style.opacity='1';
    speak('Regarde où saute Tedo !'); await wait(900*K());
    for(const k of seq){ if(my!==alive) return; place(k); pads[k].classList.add('lit'); tone(k); await wait(600*K()); pads[k].classList.remove('lit'); await wait(250*K()); }
    frog.style.opacity='0';
    say.textContent='À toi ! Touche les nénuphars dans le même ordre.'; speak('À toi !');
    let pos=0, locked=false;
    pads.forEach((p,i)=>p.onclick=async()=>{ if(locked) return; tone(i);
      if(i===seq[pos]){ p.classList.add('ok'); setTimeout(()=>p.classList.remove('ok'),300); pos++;
        if(pos===seq.length){ locked=true; say.textContent='Bravo ! 🎉'; speak('Bravo !'); misses=0; round++; len=Math.min(7,len+1); await wait(1100); next(); } }
      else { locked=true; p.classList.add('no'); wiggle(p); pads[seq[pos]].classList.add('lit'); say.textContent='Presque ! Le bon nénuphar était le jaune.'; speak('Presque ! On réessaie.');
        misses++; if(misses>=2){ len=Math.max(S.jumps,len-1); misses=0; } await wait(1600); next(); } });
  };
  next();
}

/* ── 🧩 La parola spezzata: si sentono le sillabe, si trova la parola ── */
const WORDS=[
  [['la','pin'],'🐰','lapin',[['🦁','lion'],['🥛','lait']]],
  [['so','leil'],'☀️','soleil',[['🛋️','sofa'],['🧂','sel']]],
  [['poi','sson'],'🐟','poisson',[['🍐','poire'],['🚪','porte']]],
  [['to','mate'],'🍅','tomate',[['🐢','tortue'],['🥧','tarte']]],
  [['ba','leine'],'🐋','baleine',[['🍌','banane'],['🚤','bateau']]],
  [['pa','pi','llon'],'🦋','papillon',[['🍞','pain'],['🐼','panda']]],
  [['ca','na','pé'],'🛋️','canapé',[['🦆','canard'],['🥕','carotte']]],
  [['é','lé','phant'],'🐘','éléphant',[['⭐','étoile'],['🏫','école']]],
];
function sill(){
  hush(); const my=alive; const card=frame(); const list=shuffle(WORDS).slice(0,ROUNDS); let qi=0;
  const next=async()=>{
    if(my!==alive) return;
    if(qi>=list.length) return end(card,sill,'Tu as reconstruit '+list.length+' mots !');
    const [syl,e,word,dist]=list[qi]; card.innerHTML=''; let misses=0, done=false;
    const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const syls=el('div','syls');
    const again=el('button','btn blue','🔊 Réécoute les morceaux');
    const pics=el('div','pics');
    card.append(dots,el('p','ask','Quel est ce mot ?'),syls,again,pics);
    const play=async()=>{ syls.innerHTML=''; for(const s of syl){ if(my!==alive||done) return; if(S.written) syls.appendChild(el('span','syl',s)); await speak(s,{rate:.7,interrupt:false}); await wait(350*K()); } };
    again.onclick=()=>play();
    shuffle([[e,word,true],...dist.map(([de,dw])=>[de,dw,false])]).forEach(([pe,pw,ok])=>{ const b=el('button','pic',pe+'<small hidden>'+pw+'</small>'); b.setAttribute('aria-label',pw);
      b.onclick=async()=>{ if(done) return;
        if(ok){ done=true; b.classList.add('right'); b.querySelector('small').hidden=false; syls.innerHTML='<span class="syl" style="background:var(--done)">'+word+'</span>'; await speak(syl.join('… ')+'… '+word+'!'); await wait(700); qi++; next(); }
        else { wiggle(b); misses++; b.querySelector('small').hidden=false; speak(pw+'. Non, réécoute.'); if(misses>=2) play(); } };
      pics.appendChild(b); });
    await wait(400); play();
  };
  next();
}

/* ── 😊 Come si sente? Una scena con un amico, si sceglie l'emozione (accordata con il personaggio) ── */
const EMO={felice:['😊','content','contente'],triste:['😢','triste','triste'],arrabbiato:['😠','en colère','en colère'],paura:['😨','effrayé','effrayée'],sorpreso:['😲','surpris','surprise'],calmo:['😌','calme','calme']};
const SCENES=[
  {who:'Zoe',f:1,e:'🛝⏳',text:'Zoe veut aller sur le toboggan, mais la file est très longue et elle doit attendre longtemps.',ans:'arrabbiato',why:'Attendre, c’est difficile.',help:'Compter doucement jusqu’à 5, comme Lila le lui a appris.'},
  {who:'Nico',f:0,e:'🔊🎉',text:'Nico est à une fête : la musique est très forte et beaucoup de gens crient.',ans:'paura',why:'Les bruits forts l’inquiètent.',help:'Mettre son casque, ou demander à aller dans un endroit plus calme.'},
  {who:'Lila',f:1,e:'🎁🖼️',text:'Son amie offre à Lila un très beau dessin, fait exprès pour elle.',ans:'felice',why:'Elle a reçu un cadeau pensé pour elle.',help:'Dire merci et faire un câlin, si elle en a envie.'},
  {who:'Elio',f:0,e:'🚗❓',text:'Elio cherche partout sa petite voiture préférée, mais il ne la trouve plus.',ans:'triste',why:'Il a perdu quelque chose qui compte pour lui.',help:'Demander de l’aide pour la chercher ensemble.'},
  {who:'Amina',f:1,e:'🚪🎈',text:'Amina ouvre la porte et trouve tous ses amis qui crient : « Surprise ! »',ans:'sorpreso',why:'Elle ne s’y attendait pas du tout.',help:'Respirer un bon coup et profiter de la fête.'},
  {who:'Meky',f:0,e:'🌬️🧸',text:'Meky vient de faire trois respirations lentes dans le coin calme, en serrant sa peluche.',ans:'calmo',why:'Respirer doucement l’a aidé.',help:'Se souvenir de cette astuce la prochaine fois.'},
];
function emo(){
  hush(); const my=alive; const card=frame(); const list=shuffle(SCENES); let qi=0;
  const next=async()=>{
    if(my!==alive) return;
    if(qi>=list.length) return end(card,emo,'Tu as compris comment se sentent tous les amis !');
    const sc=list[qi]; card.innerHTML=''; let done=false;
    const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const scene=el('div','scene','<span class="e">'+sc.e+'</span><p>'+sc.text+'</p>');
    const q='Comment se sent '+sc.who+' ?';
    const faces=el('div','faces'), tip=el('div','tip'); tip.hidden=true;
    const others=shuffle(Object.keys(EMO).filter(k=>k!==sc.ans)).slice(0,S.faces-1);
    shuffle([sc.ans,...others]).forEach(k=>{ const [e,m,f]=EMO[k], w=sc.f?f:m; const b=el('button','face','<span class="e">'+e+'</span>'+w);
      b.onclick=async()=>{ if(done) return;
        if(k===sc.ans){ done=true; b.classList.add('right');
          tip.innerHTML='💡 '+sc.who+' est '+w+'. '+sc.why+'<br><b>Qu’est-ce qui peut aider ?</b> '+sc.help; tip.hidden=false;
          await speak(sc.who+' est '+w+'. '+sc.why+' Qu’est-ce qui peut aider ? '+sc.help);
          const nb=el('button','btn main','Suivant →'); nb.onclick=()=>{ qi++; next(); }; card.appendChild(nb); }
        else { wiggle(b); speak('Regarde bien ce qui arrive à '+sc.who+'. Réessaie.'); } };
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
    if(qi>=list.length) return end(card,diff,'Tu as trouvé toutes les différences !');
    const a=list[qi], change=shuffle([0,1,2,3,4,5,6,7,8]).slice(0,S.diffs), b=a.map((x,i)=>change.includes(i)?SWAP[x]:x);
    card.innerHTML=''; let found=0;
    const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const left=el('div','board'), right=el('div','board'), cnt=el('div','level','Trouvées : 0 sur '+S.diffs);
    const mk=(arr,box)=>arr.forEach((x,i)=>{ const c=el('button','cell',x); c.dataset.i=i; box.appendChild(c); });
    mk(a,left); mk(b,right);
    const twin=el('div','twin'); twin.append(left,right);
    card.append(dots,el('p','ask','Trouve les '+S.diffs+' différences !'),el('p','sub','Touche les choses différentes, dans un dessin ou dans l’autre.'),twin,cnt);
    twin.querySelectorAll('.cell').forEach(c=>c.onclick=()=>{ const i=+c.dataset.i;
      if(change.includes(i)){ if(c.classList.contains('found')) return;
        twin.querySelectorAll('.cell[data-i="'+i+'"]').forEach(x=>x.classList.add('found')); found++; cnt.textContent='Trouvées : '+found+' sur '+S.diffs; speak(found<S.diffs?'Trouvée !':'Bravo, tu les as toutes trouvées !');
        if(found===S.diffs) setTimeout(()=>{ qi++; next(); },1200); }
      else { c.classList.remove('miss'); void c.offsetWidth; c.classList.add('miss'); } });
    speak('Trouve les '+['','','deux','trois','quatre'][S.diffs]+' différences !');
  };
  next();
}

/* ── 🎒 Cosa manca nello zaino? Si guardano gli oggetti, uno sparisce ── */
const OBJ=[['📒','le cahier'],['✏️','le crayon'],['📏','la règle'],['🍎','la pomme'],['🧃','le jus'],['🖍️','les crayons de couleur'],['✂️','les ciseaux'],['📚','le livre'],['🧢','la casquette'],['🔑','les clés'],['🧮','le boulier'],['🥪','le sandwich']];
function zaino(){
  hush(); const my=alive; const card=frame(); let qi=0, n=S.objs;
  const next=async()=>{
    if(my!==alive) return;
    if(qi>=ROUNDS) return end(card,zaino,'Quelle mémoire ! Tu te souviens de '+n+' objets.');
    card.innerHTML='';
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<qi?'ok':i===qi?'on':''));
    const pick=shuffle(OBJ).slice(0,n), gone=pick[rnd(n)];
    const ask=el('p','ask','Regarde bien ce qu’il y a dans le cartable…'), box=el('div','items');
    pick.forEach(([e,w])=>box.appendChild(el('div','item',e+'<small>'+w+'</small>')));
    card.append(dots,el('div','level',n+' objets'),ask,box);
    speak('Regarde bien ce qu’il y a dans le cartable.'); await wait((2500+n*600)*K()); if(my!==alive) return;
    box.replaceWith(el('div','curtain','🎒 Je ferme le cartable…')); await wait(1300*K()); if(my!==alive) return;
    const cur=card.querySelector('.curtain'); const left=el('div','items');
    shuffle(pick.filter(x=>x!==gone)).forEach(([e,w])=>left.appendChild(el('div','item',e+'<small>'+w+'</small>'))); cur.replaceWith(left);
    ask.textContent='Qu’est-ce qui manque ?'; speak('Qu’est-ce qui manque ?');
    const others=shuffle(OBJ.filter(x=>!pick.includes(x))).slice(0,2), row=el('div','items');
    let done=false;
    shuffle([gone,...others]).forEach(o=>{ const b=el('button','item',o[0]+'<small>'+o[1]+'</small>');
      b.onclick=async()=>{ if(done) return;
        if(o===gone){ done=true; b.style.borderColor='var(--done)'; b.style.background='var(--done-bg)'; await speak('Bravo ! Il manquait '+o[1]+'.'); qi++; n=Math.min(6,n+1); next(); }
        else { wiggle(b); speak('Non, '+o[1]+' n’était pas là. Réessaie.'); } };
      row.appendChild(b); });
    card.append(el('p','sub','Touche l’objet qui a disparu :'),row);
  };
  next();
}

/* ── 🎵 La rima di Lila: quale parola finisce con lo stesso suono? ── */
const RIME=[
  ['chat','🐱',['rat','🐀'],[['soleil','☀️'],['chien','🐶']]],
  ['cœur','❤️',['fleur','🌸'],[['main','✋'],['balle','⚽']]],
  ['pain','🍞',['main','✋'],[['livre','📖'],['soleil','☀️']]],
  ['lune','🌙',['dune','🏜️'],[['glace','🍦'],['table','🪑']]],
  ['étoile','⭐',['voile','⛵'],[['pain','🍞'],['feu','🔥']]],
  ['bateau','🚢',['gâteau','🎂'],[['lune','🌙'],['poisson','🐟']]],
  ['lit','🛏️',['souris','🐭'],[['fleur','🌸'],['soleil','☀️']]],
  ['grenouille','🐸',['citrouille','🎃'],[['chat','🐱'],['livre','📖']]],
];
const RIME_OK=RIME;
function rima(){
  hush(); const my=alive; const card=frame(); const list=shuffle(RIME_OK).slice(0,ROUNDS); let qi=0;
  const next=()=>{
    if(my!==alive) return;
    if(qi>=list.length) return end(card,rima,'Tu as trouvé toutes les rimes avec Lila !');
    const [w,e,[rw,re],dist]=list[qi]; card.innerHTML=''; let done=false;
    const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const head=el('div','item',e+'<small>'+w+'</small>'); head.style.width='120px'; head.style.height='120px'; head.style.fontSize='56px';
    const pics=el('div','pics');
    const hear=el('button','btn blue','🔊 Écouter'); hear.onclick=()=>speak(w+' rime avec…');
    shuffle([[re,rw,true],...dist.map(([dw,de])=>[de,dw,false])]).forEach(([pe,pw,ok])=>{ const b=el('button','pic',pe+'<small>'+pw+'</small>');
      b.onclick=async()=>{ if(done) return; speak(pw);
        if(ok){ done=true; b.classList.add('right'); await wait(500); await speak(w+', '+pw+' ! Ils finissent par le même son.'); qi++; next(); }
        else { wiggle(b); setTimeout(()=>speak('Écoute la fin : '+w+'… '+pw+'. Ce n’est pas le même son.'),600); } };
      pics.appendChild(b); });
    card.append(dots,el('p','ask','Qu’est-ce qui rime avec…'),head,hear,pics);
    speak(w+' rime avec…');
  };
  next();
}

/* ── 🕵️ L'intruso: tre cose della stessa famiglia e una no ── */
const CATS={frutta:['🍎','🍌','🍐','🍓','🍇','🍊'],animali:['🐶','🐱','🐰','🐻','🦁','🐮'],veicoli:['🚗','🚌','🚂','✈️','🚲','🚤'],vestiti:['👕','👖','🧦','🧢','👟','🧥'],scuola:['✏️','📏','📒','🖍️','✂️','📚'],musica:['🎸','🥁','🎺','🎹','🎻','🪗']};
const CAT_NAME={frutta:'des fruits',animali:'des animaux',veicoli:'des moyens de transport',vestiti:'des vêtements',scuola:'des affaires d’école',musica:'des instruments de musique'};
function intruso(){
  hush(); const my=alive; const card=frame(); let qi=0;
  const next=()=>{
    if(my!==alive) return;
    if(qi>=ROUNDS) return end(card,intruso,'Tu es un super détective !');
    const keys=Object.keys(CATS), cat=keys[rnd(keys.length)], other=shuffle(keys.filter(k=>k!==cat))[0];
    const three=shuffle(CATS[cat]).slice(0,3), odd=CATS[other][rnd(6)];
    card.innerHTML=''; let done=false;
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<qi?'ok':i===qi?'on':''));
    const g=el('div','pics'); g.style.gridTemplateColumns='repeat(2,1fr)';
    shuffle([...three,odd]).forEach(x=>{ const b=el('button','pic',x);
      b.onclick=async()=>{ if(done) return;
        if(x===odd){ done=true; b.classList.add('right'); await speak('Bravo ! Les autres sont tous '+CAT_NAME[cat]+'.'); qi++; next(); }
        else { wiggle(b); speak('Celui-ci va avec les autres. Cherche celui qui est différent.'); } };
      g.appendChild(b); });
    card.append(dots,el('p','ask','Qui est l’intrus ?'),el('p','sub','Trois choses vont ensemble. Une non !'),g);
    speak('Qui est l’intrus ?');
  };
  next();
}

/* ── 🛒 Il mercatino di Elio: due cose, il totale, e si paga con monete e banconote ── */
const GOODS=[['🍎','pomme',1,'une'],['🍌','banane',1,'une'],['🧃','jus',2,'un'],['🥐','croissant',2,'un'],['🍦','glace',3,'une'],['📒','cahier',3,'un'],['🧸','ourson',5,'un'],['⚽','ballon',4,'un']];   // icône, nom, prix, article
function merc(){
  hush(); const my=alive; const card=frame(); let qi=0;
  const next=()=>{
    if(my!==alive) return;
    if(qi>=ROUNDS) return end(card,merc,'Elio a fait toutes ses courses : bravo, le caissier !');
    const [a,b]=shuffle(GOODS).slice(0,2), tot=a[2]+b[2];
    card.innerHTML=''; let paid=[], step='sum';
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<qi?'ok':i===qi?'on':''));
    const items=el('div','items'); [a,b].forEach(([e,w,pr])=>items.appendChild(el('div','item',e+'<small>'+w+'</small><span class="price">'+pr+' €</span>')));
    const ask=el('p','ask','Elio achète '+a[3]+' '+a[1]+' et '+b[3]+' '+b[1]+'. Combien paie-t-il ?');
    const nums=el('div','nums');
    card.append(dots,items,ask,nums);
    // prima il totale, poi si paga
    shuffle([tot,tot+1,Math.max(2,tot-1)].filter((x,i,arr)=>arr.indexOf(x)===i)).forEach(n=>{ const bt=el('button','num',n+'€'); bt.style.fontSize='28px';
      bt.onclick=()=>{ if(step!=='sum') return;
        if(n===tot){ bt.classList.add('right'); step='pay'; speak(a[2]+' plus '+b[2]+', ça fait '+tot+'. Maintenant, paie '+tot+' euros.'); setTimeout(pay,700); }
        else { wiggle(bt); speak('Essaie d’additionner : '+a[2]+' plus '+b[2]+'.'); } };
      nums.appendChild(bt); });
    speak(ask.textContent);
    function pay(){
      nums.remove(); ask.textContent='Paie '+tot+' € : touche les pièces';
      const box=el('div','paid'), sum=el('div','total','0 €'), coins=el('div','coins');
      [[1,'coin'],[2,'coin'],[5,'coin note']].forEach(([v,c])=>{ const bt=el('button',c,v+' €'); bt.onclick=()=>{ paid.push(v); draw(); speak(v+' euros'); }; coins.appendChild(bt); });
      const undo=el('button','btn','↩️ Enlever'); undo.onclick=()=>{ paid.pop(); draw(); };
      const go=el('button','btn main','Payer'); go.onclick=async()=>{ const s=paid.reduce((x,y)=>x+y,0);
        if(s===tot){ await speak('Parfait ! Tu as payé '+tot+' euros.'); qi++; next(); }
        else if(s<tot){ wiggle(box); speak('Il manque '+(tot-s)+' euros.'); }
        else { wiggle(box); speak('Trop ! Tu as mis '+s+' euros, il en faut '+tot+'.'); } };
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
  hush(); const my=alive; const card=frame(); let qi=0, max=S.dots;
  const next=async()=>{
    if(my!==alive) return;
    if(qi>=ROUNDS) return end(card,colpo,'Quel œil ! Tu reconnais les quantités en un coup d’œil.');
    const n=1+rnd(max); card.innerHTML=''; let done=false;
    const dots=el('div','dots'); for(let i=0;i<ROUNDS;i++) dots.appendChild(el('span',i<qi?'ok':i===qi?'on':''));
    // fino a 6 come sul dado; più di 6 nella "tabella del dieci" (due file da 5)
    const ten=n>6, f=el('div','flash'+(ten?' ten':''));
    const cells=ten?10:9, on=ten?[...Array(n).keys()]:DICE[n];
    for(let i=0;i<cells;i++) f.appendChild(el('i',on.includes(i)?'on':''));
    const ask=el('p','ask','Prêt ? Regarde bien…');
    card.append(dots,ask,f);
    await wait(900*K()); f.style.visibility='hidden'; await wait(100); f.style.visibility='visible';
    speak('Combien ?'); await wait(1400*K()); if(my!==alive) return;
    f.querySelectorAll('i').forEach(i=>i.classList.remove('on'));
    ask.textContent='Combien de points y avait-il ?';
    const nums=el('div','nums'), opts=shuffle([n,...shuffle([1,2,3,4,5,6,7,8,9,10].filter(x=>x!==n&&Math.abs(x-n)<=2)).slice(0,2)]);
    opts.forEach(x=>{ const b=el('button','num',x); b.onclick=async()=>{ if(done) return;
      if(x===n){ done=true; b.classList.add('right'); f.querySelectorAll('i').forEach((i,k)=>{ if(on.includes(k)) i.classList.add('on'); }); await speak('Bravo, '+n+' !'); await wait(700); qi++; max=Math.min(10,max+1); next(); }
      else { wiggle(b); f.querySelectorAll('i').forEach((i,k)=>{ if(on.includes(k)) i.classList.add('on'); }); speak('Regarde-les encore.'); setTimeout(()=>f.querySelectorAll('i').forEach(i=>i.classList.remove('on')),1500); } };
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
  const light=el('div','light','🐸'), say=el('p','ask','Touche le bouton seulement quand il est vert !'), press=el('button','press','👆 Touche !'), score=el('div','score','');
  const draw=()=>{ score.innerHTML='<span>✅ '+hits+'</span><span>✋ Attendu : '+waited+'</span>'; };
  draw(); card.append(say,light,press,score);
  press.onclick=()=>{ if(tapped) return; tapped=true;
    if(state==='go'){ hits++; speak('Sì!'); light.textContent='😄'; }
    else if(state==='stop'){ oops++; speak('Attends le vert !'); light.textContent='😮'; wiggle(press); }
    draw(); };
  const step=async()=>{
    if(my!==alive) return;
    if(state==='stop'&&!tapped) waited++;
    i++; draw();
    if(i>=seq.length){ return end(card,stop,'Tu as touché '+hits+' fois au vert et tu as attendu au rouge '+waited+' fois sur 4 !'); }
    state='wait'; tapped=true; light.className='light'; light.textContent='🐸'; await wait(700*K()); if(my!==alive) return;
    state=seq[i]; tapped=false; light.className='light '+state; light.textContent=state==='go'?'🟢':'✋';
    if(state==='stop') speak('Rouge : attends !');
    await wait(1700*K()); step();
  };
  speak('Touche le bouton seulement quand il est vert. Au rouge, on attend !'); setTimeout(step,1500);
}

/* ── 🐸 Tedo mangione: le cose arrivano lungo la strada; Tedo cambia corsia e mangia solo quelle giuste.
      Ogni cosa giusta lo fa crescere un po'; dopo 10 è grandissimo. Le cose sbagliate: "Bleah!", senza punizioni. ── */
const EAT_RULES={
  frutta:{text:'Mange seulement les fruits !',good:['🍎','🍌','🍐','🍓','🍇','🍊','🍒','🍉'],bad:['👟','🧦','📏','🔑','🧸','⚽','✏️','🪨']},
  grandi:{text:'Mange seulement les nombres plus grands que 5 !',good:['6','7','8','9','10'],bad:['1','2','3','4','5'],num:true},
  pari:{text:'Mange seulement les nombres pairs !',good:['2','4','6','8','10'],bad:['1','3','5','7','9'],num:true},
};
function mangia(){
  hush(); const my=alive; const card=frame(); card.innerHTML='';
  const R=EAT_RULES[S.eat], GOAL=10, speed=S.speed==='lento'?70:105;   // pixel al secondo
  let lane=1, size=1, eaten=0, foods=[], last=0, spawnIn=600, running=true;
  const rule=el('div','rule','🐸 '+R.text), grow=el('div','grow','<i style="width:0%"></i>');
  const road=el('div','road'); const lanes=[0,1,2].map(i=>{ const b=el('button','lane'); b.setAttribute('aria-label','voie '+(i+1)); b.onclick=()=>move(i); road.appendChild(b); return b; });
  const tedo=el('div','tedo',FROG.replace('width="70" height="70"','width="80" height="80"')), bub=el('div','bubble2','');
  road.append(tedo,bub);
  const arrows=el('div','arrows'); const L=el('button','','⬅️'), Rt=el('button','','➡️'); L.setAttribute('aria-label','gauche'); Rt.setAttribute('aria-label','droite');
  L.onclick=()=>move(lane-1); Rt.onclick=()=>move(lane+1); arrows.append(L,Rt);
  card.append(rule,grow,road,arrows,el('p','sub','Touche une voie, ou utilise les flèches, pour déplacer Tedo.'));
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
          if(f.good){ eaten++; size=Math.min(2.1,1+eaten*0.11); say('Miam ! 😋'); tone(4+eaten%5); speak(['Miam !','C’est bon !','Miam miam !'][rnd(3)]); drawTedo();
            if(eaten>=GOAL){ running=false; setTimeout(()=>end(card,mangia,'Tedo a mangé '+GOAL+' bonnes choses et il est devenu tout grand !'),900); } }
          else { say('Beurk ! 🤢'); speak('Beurk ! Ça ne se mange pas.'); tedo.animate([{transform:'scale('+size+') rotate(-8deg)'},{transform:'scale('+size+') rotate(8deg)'},{transform:'scale('+size+')'}],{duration:400}); }
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
