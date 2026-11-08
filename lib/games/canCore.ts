// @ts-nocheck
/*
 * 🇬🇧 English time · Can or can't? (Look and listen, la filastrocca I can / you can…, Free time,
 * Remember!, Can or can't?, Who?, Build, I can… yet!, Questions).
 * Lo stesso codice del prototipo già provato, dentro un contenitore con la classe "smc".
 * La voce segue l'accento e la velocità scelti nelle impostazioni di English time.
 */
export interface CanOptions { settings?: { it?: boolean; rate?: number; accent?: string }; onWin?: () => void }
export const CAN_CSS = ".smc{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#6870A0;--line:#D6DBF2;--done:#48B97A;--done-bg:#E6F6EE;--blue:#1C3F94;--radius:22px;\n  --pro:#1C7ED6;--can:#2F9E44;--cant:#E03131;--act:#F08C00;\n  box-sizing:border-box}\n\n.smc *{box-sizing:border-box}\n.smc{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smc button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation}\n.smc button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smc [hidden]{display:none!important}\n.smc .app{max-width:540px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smc .title{background:var(--card);border-radius:var(--radius);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smc .title .l{display:flex;align-items:center;gap:12px}\n.smc .title .em{font-size:36px}\n.smc .title h1{margin:0;font-size:22px;font-weight:900}\n.smc .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smc .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.smc .buddy{display:flex;align-items:center;gap:10px;background:none;border:none;padding:0;text-align:left}\n.smc .buddy .av{width:50px;height:50px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:24px;border:3px solid #7048E8;background:#fff}\n.smc .buddy .bb{background:var(--card);border-radius:16px;padding:10px 14px;font-size:15px;font-weight:700;line-height:1.35}\n.smc .buddy .bb b{display:block;font-size:13px;font-weight:900;color:#7048E8}\n.smc .tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}\n.smc .tab{min-height:54px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:13px;font-weight:800;padding:0 4px;line-height:1.2}\n.smc .tab[aria-current=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smc .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.smc .ask{margin:0;font-size:21px;font-weight:900;line-height:1.3}\n.smc .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smc .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.smc .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smc .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.smc .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;width:100%}\n.smc .dots{display:flex;gap:6px}\n.smc .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.smc .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.smc .dots .ok{background:var(--done)}\n.smc .wrong{animation:wiggle .4s}\n.smc .star{font-size:64px;animation:pop .5s ease-out}\n.smc /* la frase inglese con i colori: pronome blu,.smc can verde,.smc can't rosso,.smc azione arancione */\n.en{font-size:30px;font-weight:900;line-height:1.3}\n.smc .en .p{color:var(--pro)}\n.smc .en .c{color:var(--can)}\n.smc .en .n{color:var(--cant)}\n.smc .en .a{color:var(--act)}\n.smc .it{font-size:16px;font-weight:700;color:var(--soft);font-style:italic}\n.smc .pic{width:100%;border-radius:22px;background:linear-gradient(180deg,#E3F0FC,#FFF6E6);padding:16px;display:flex;align-items:center;justify-content:center;gap:12px;font-size:64px;line-height:1;position:relative;min-height:140px}\n.smc .mark{position:absolute;right:12px;top:12px;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;color:#fff;font-weight:900}\n.smc .mark.yes{background:var(--can)}\n.smc .mark.no{background:var(--cant)}\n.smc /* Look and listen: la carta che si gira */\n.flipwrap{perspective:1000px;width:100%;max-width:340px;height:300px}\n.smc .flip{position:relative;width:100%;height:100%;transition:transform .6s;transform-style:preserve-3d;border:none;background:none;padding:0}\n.smc .flip.on{transform:rotateY(180deg)}\n.smc .face{position:absolute;inset:0;backface-visibility:hidden;border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px;border:4px solid}\n.smc .face.A{background:#E6F6EA;border-color:var(--can)}\n.smc .face.B{background:#FDECEC;border-color:var(--cant);transform:rotateY(180deg)}\n.smc .face .big{font-size:70px;line-height:1}\n.smc /* can / can't */\n.yn{display:flex;gap:12px;width:100%}\n.smc .yn button{flex:1;min-height:96px;border-radius:22px;border:none;font-size:26px;font-weight:900;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}\n.smc .yn .y{background:var(--can);box-shadow:0 6px 0 #1E6B33}\n.smc .yn .x{background:var(--cant);box-shadow:0 6px 0 #A61E1E}\n.smc .yn small{font-size:14px;font-weight:800;opacity:.9}\n.smc /* Who? */\n.who{width:100%;border-radius:22px;background:linear-gradient(180deg,#E3F0FC,#FFF6E6);padding:14px;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap}\n.smc .speaker{display:flex;flex-direction:column;align-items:center;font-size:44px;line-height:1}\n.smc .speaker small{font-size:12px;font-weight:900;color:#1F2147;margin-top:4px}\n.smc .arrow{font-size:36px;color:#1F2147}\n.smc .target{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 12px;border-radius:18px;border:3px dashed #1C7ED6;background:rgba(255,255,255,.6)}\n.smc .target .f{font-size:44px;line-height:1}\n.smc .target small{font-size:12px;font-weight:900;color:#1F2147}\n.smc .pros{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%}\n.smc .pro{min-height:62px;border-radius:16px;border:3px solid var(--line);background:var(--ground);font-size:24px;font-weight:900;color:var(--pro);box-shadow:0 4px 0 var(--line)}\n.smc .pro.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 4px 0 #2F8A5A}\n.smc /* Build */\n.slots{display:flex;gap:8px;justify-content:center;min-height:64px;flex-wrap:wrap;width:100%;border:3px dashed var(--line);border-radius:18px;padding:8px}\n.smc .tile{min-height:52px;padding:0 16px;border-radius:14px;border:none;font-size:22px;font-weight:900;color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.2)}\n.smc .tile.p{background:var(--pro)}\n.smc .tile.c{background:var(--can)}\n.smc .tile.n{background:var(--cant)}\n.smc .tile.a{background:var(--act)}\n.smc .tile.x{background:#868E96}\n.smc .tiles{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}\n.smc .tip{width:100%;background:#FFF6D6;color:#5A4300;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:800;line-height:1.45;text-align:left}\n.smc /* I can… yet */\n.acts{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;width:100%}\n.smc .actb{min-height:74px;border-radius:18px;border:3px solid var(--line);background:var(--ground);display:flex;align-items:center;gap:10px;padding:8px 12px;text-align:left;font-size:17px;font-weight:900}\n.smc .actb .e{font-size:32px}\n.smc .actb.can{border-color:var(--can);background:#E6F6EA;color:#1E6B33}\n.smc .actb.yet{border-color:#E8A400;background:#FFF6D6;color:#5A4300}\n.smc .actb small{display:block;font-size:12px;font-weight:800;opacity:.85}\n.smc .legend{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;font-size:14px;font-weight:800;color:var(--soft)}\n.smc .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.smc .set{display:flex;flex-direction:column;gap:8px}\n.smc .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.smc .chips{display:flex;gap:8px;flex-wrap:wrap}\n.smc .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.smc .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n.smc /* 🎶 La filastrocca: I can,.smc you can,.smc he can… */\n.mode3{display:flex;gap:6px;width:100%}\n.smc .mode3 button{flex:1;min-height:50px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:17px;font-weight:900}\n.smc .mode3 button[aria-pressed=\"true\"]{color:#fff;border-color:transparent}\n.smc .mode3 .mc[aria-pressed=\"true\"]{background:var(--can)}\n.smc .mode3 .mn[aria-pressed=\"true\"]{background:var(--cant)}\n.smc .mode3 .mq[aria-pressed=\"true\"]{background:var(--blue)}\n.smc .chant{width:100%;display:flex;flex-direction:column;gap:6px}\n.smc .line{display:flex;align-items:center;gap:12px;border-radius:16px;border:3px solid transparent;background:var(--ground);padding:6px 12px;text-align:left;width:100%}\n.smc .line .f{font-size:26px;width:86px;text-align:center;flex:none;line-height:1;white-space:nowrap;letter-spacing:-5px}\n.smc .line .en{font-size:26px;flex:1;white-space:nowrap}\n.smc .line .itp{font-size:13px;font-weight:800;color:var(--soft);font-style:italic;flex:none;max-width:76px;text-align:right;line-height:1.2}\n.smc .line.on{border-color:#FFC93C;background:#FFF6D6}\n.smc .line.on .itp{color:#5A4300}\n.smc .repeat{font-size:18px;font-weight:900;color:#5A4300;background:#FFF6D6;border-radius:14px;padding:8px 14px;min-height:42px}\n.smc .rule2{width:100%;background:#E6F6EA;color:#1E6B33;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:800;line-height:1.45;text-align:left}\n.smc /* ⚽ Free time: le attività del tempo libero */\n.ftgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;width:100%}\n.smc .ft{min-height:96px;border-radius:18px;border:3px solid var(--line);background:var(--ground);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 6px;text-align:center}\n.smc .ft .e{font-size:36px;line-height:1}\n.smc .ft .s{font-size:16px;font-weight:900;line-height:1.25}\n.smc .ft .s .p{color:var(--pro)}\n.smc .ft .s .c{color:var(--can)}\n.smc .ft .s .n{color:var(--cant)}\n.smc .ft .s .a{color:var(--act)}\n.smc .ft small{font-size:12px;font-weight:800;color:var(--soft);font-style:italic}\n.smc .ft.on{border-color:#FFC93C;background:#FFF6D6}\n.smc .ft.no{border-color:var(--cant)}\n.smc .mode2{display:flex;gap:6px;width:100%}\n.smc .mode2 button{flex:1;min-height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:900}\n.smc .mode2 button[aria-pressed=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smc /* 🧠 Remember: il memory immagine ↔ frase,.smc e \"Say it!\" con il microfono */\n.mem{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%}\n.smc .mem.four{grid-template-columns:repeat(4,1fr)}\n.smc .mcard{aspect-ratio:3/4;perspective:600px;border:none;background:none;padding:0}\n.smc .mcard .in{position:relative;width:100%;height:100%;transition:transform .4s;transform-style:preserve-3d}\n.smc .mcard.open .in{transform:rotateY(180deg)}\n.smc .mcard .bk,.smc .mcard .fr{position:absolute;inset:0;backface-visibility:hidden;border-radius:14px;display:flex;align-items:center;justify-content:center;padding:6px}\n.smc .mcard .bk{background:var(--blue);color:#fff;font-size:28px;font-weight:900}\n.smc .mcard .fr{background:var(--card);border:3px solid var(--line);transform:rotateY(180deg);font-size:40px;line-height:1}\n.smc .mcard .fr.tx{font-size:15px;font-weight:900;line-height:1.2;color:var(--act)}\n.smc .mcard .fr.tx b{color:var(--pro)}\n.smc .mcard .fr.tx i{color:var(--can);font-style:normal}\n.smc .mcard.done .fr{border-color:var(--done);background:var(--done-bg)}\n.smc .mic{width:120px;height:120px;border-radius:50%;border:none;background:var(--cant);color:#fff;font-size:52px;box-shadow:0 6px 0 #A61E1E}\n.smc .mic.on{animation:pulse 1s ease-in-out infinite}\n@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}\n.smc .heard{font-size:18px;font-weight:800;color:var(--soft);min-height:26px}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.smc *{animation:none!important;transition:none!important}}"
export function mountCan(root: HTMLElement, opts: CanOptions = {}): () => void {
  root.innerHTML = "<nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <section class=\"card\" data-k=\"stage\"></section>"

let S=Object.assign({it:true,rate:.8,accent:'en-GB'},opts.settings||{});
const OPT={it:[[true,'Sì'],[false,'No']],rate:[[.7,'Lenta'],[.85,'Normale']]};
const ROUNDS=6;
/* ── Le azioni, gli animali e i pronomi ── */
const ACT={swim:['🏊','swim','nuotare'],fly:['🕊️','fly','volare'],run:['🏃','run','correre'],jump:['🦘','jump','saltare'],climb:['🧗','climb','arrampicarsi'],sing:['🎤','sing','cantare'],read:['📖','read','leggere'],ride:['🚲','ride a bike','andare in bici'],draw:['🎨','draw','disegnare'],dance:['💃','dance','ballare']};
const ANIMALS=[
  ['🐟','A fish','un pesce',{can:['swim'],cant:['fly','run','climb','read']}],
  ['🐦','A bird','un uccellino',{can:['fly','sing'],cant:['ride','read','swim']}],
  ['🐶','A dog','un cane',{can:['run','swim','jump'],cant:['fly','read','climb']}],
  ['🐒','A monkey','una scimmia',{can:['climb','jump','run'],cant:['fly','read']}],
  ['🐸','A frog','una rana',{can:['jump','swim'],cant:['fly','ride','sing']}],
  ['🐧','A penguin','un pinguino',{can:['swim','run'],cant:['fly','climb']}],
  ['🐌','A snail','una lumaca',{can:['climb'],cant:['run','jump','fly']}],
];
// i pronomi: chi parla è sempre Meky; la freccia indica di chi si parla
const PRON={I:['🧒','Meky','io'],you:['🫵','tu! (chi guarda)','tu'],he:['👦','Nico','lui'],she:['👧','Lila','lei'],we:['🧒👦👧','Meky e gli amici','noi'],they:['👧🏾👧🏽','Zoe e Amina','loro']};
const PRO_IT={I:'io',you:'tu',he:'lui',she:'lei',we:'noi',they:'loro'};
const SAFE=['sing','dance','draw','read','run','jump','swim','ride'];   // azioni per le frasi con le persone: cose che tutti possono imparare

const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
/* la voce: inglese britannico (en-GB) per l'inglese, italiano per la traduzione */
const keep=[]; let alive=0;
function voiceFor(lang){ const vs=speechSynthesis.getVoices(); const A=S.accent||'en-GB'; return lang==='en'?(vs.find(v=>v.lang.replace('_','-')===A&&/natural|enhanced|premium|google|siri/i.test(v.name))||vs.find(v=>v.lang.replace('_','-')===A)):vs.find(v=>v.lang.startsWith('it')); }
function speak(t,lang='en'){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang=lang==='en'?(S.accent||'en-GB'):'it-IT'; u.rate=lang==='en'?S.rate:.9; const v=voiceFor(lang); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1400+t.length*110); setTimeout(()=>speechSynthesis.speak(u),80); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
/* una frase colorata: pronome/soggetto blu, can verde, can't rosso, azione arancione */
const sentence=(subj,can,act)=>'<span class="p">'+subj+'</span> <span class="'+(can?'c':'n')+'">'+(can?'can':'can\'t')+'</span> <span class="a">'+ACT[act][1]+'</span>.';
const plain=(subj,can,act)=>subj+' '+(can?'can':'can\'t')+' '+ACT[act][1]+'.';
const itSent=(subjIt,can,act,plural)=>{ const v={swim:['sa nuotare','sanno nuotare'],fly:['sa volare','sanno volare'],run:['sa correre','sanno correre'],jump:['sa saltare','sanno saltare'],climb:['sa arrampicarsi','sanno arrampicarsi'],sing:['sa cantare','sanno cantare'],read:['sa leggere','sanno leggere'],ride:['sa andare in bici','sanno andare in bici'],draw:['sa disegnare','sanno disegnare'],dance:['sa ballare','sanno ballare']}[act][plural?1:0];
  return subjIt.charAt(0).toUpperCase()+subjIt.slice(1)+' '+(can?'':'non ')+v+'.'; };
function end(st,again,text){ opts.onWin&&opts.onWin(); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask','Well done!'),el('p','sub',text)); const b=el('button','btn main','🔄 Again'); b.onclick=again; st.appendChild(b); speak('Well done!'); }

/* ── 👀 Look and listen: la carta verde (can) si gira e mostra quella rossa (can't) ── */
function look(){
  hush(); const st=$('stage'); st.innerHTML=''; let i=0;
  const wrap=el('div','flipwrap'), nav=el('div','row'), pv=el('button','btn','← Prima'), nx=el('button','btn blue','Dopo →');
  nav.append(pv,nx); st.append(el('p','sub','Tocca la carta per girarla: davanti cosa sa fare, dietro cosa non sa fare.'),wrap,nav);
  const draw=()=>{ const [e,en,it,f]=ANIMALS[i], a=f.can[0], b=f.cant[0];
    wrap.innerHTML='';
    const fl=el('button','flip','<div class="face A"><span class="big">'+e+' '+ACT[a][0]+'</span><div class="en">'+sentence(en,true,a)+'</div>'+(S.it?'<div class="it">'+itSent(it,true,a)+'</div>':'')+'<span class="sub">✅ can</span></div>'+
      '<div class="face B"><span class="big">'+e+' '+ACT[b][0]+'</span><div class="en">'+sentence(en,false,b)+'</div>'+(S.it?'<div class="it">'+itSent(it,false,b)+'</div>':'')+'<span class="sub">❌ can\'t</span></div>');
    fl.onclick=()=>{ const on=!fl.classList.contains('on'); fl.classList.toggle('on',on); speak(on?plain(en,false,b):plain(en,true,a)); };
    wrap.appendChild(fl); speak(plain(en,true,a)); };
  pv.onclick=()=>{ i=(i-1+ANIMALS.length)%ANIMALS.length; draw(); }; nx.onclick=()=>{ i=(i+1)%ANIMALS.length; draw(); };
  draw();
}

/* ── ✅❌ Can or can't? Un animale e un'azione: sa farlo o no? ── */
function canOrNot(){
  hush(); const my=alive; const st=$('stage'); let qi=0;
  const qs=Array.from({length:ROUNDS},()=>{ const an=ANIMALS[rnd(ANIMALS.length)], can=Math.random()<.5, list=can?an[3].can:an[3].cant; return {an,can,act:list[rnd(list.length)]}; });
  const next=()=>{ if(my!==alive) return;
    if(qi>=ROUNDS) return end(st,canOrNot,'Sai già quando si dice can e quando can\'t!');
    const {an,can,act}=qs[qi]; st.innerHTML=''; let done=false;
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const pic=el('div','pic',an[0]+' '+ACT[act][0]), q='Can '+an[1].toLowerCase()+' '+ACT[act][1]+'?';
    const res=el('div',''); res.style.minHeight='70px';
    const yn=el('div','yn','<button class="y">✅ can<small>sa farlo</small></button><button class="x">❌ can\'t<small>non sa farlo</small></button>');
    const pick=async(ans,btn)=>{ if(done) return;
      if(ans===can){ done=true; pic.insertAdjacentHTML('beforeend','<span class="mark '+(can?'yes':'no')+'">'+(can?'✓':'✕')+'</span>');
        res.innerHTML='<div class="en">'+sentence(an[1],can,act)+'</div>'+(S.it?'<div class="it">'+itSent(an[2],can,act)+'</div>':'');
        await speak(plain(an[1],can,act)); await wait(700); qi++; next(); }
      else { wiggle(btn); speak('Hmm… think again!'); } };
    yn.children[0].onclick=e=>pick(true,e.currentTarget); yn.children[1].onclick=e=>pick(false,e.currentTarget);
    st.append(dots,el('p','ask',q),pic,yn,res); speak(q);
  };
  next();
}

/* ── 👆 Who? Meky parla e indica: io, tu, lui, lei, noi, loro ── */
function who(){
  hush(); const my=alive; const st=$('stage'); let qi=0;
  const order=shuffle(Object.keys(PRON)); const qs=Array.from({length:ROUNDS},(_,i)=>({p:order[i%6],can:Math.random()<.65,act:SAFE[rnd(SAFE.length)]}));
  const next=()=>{ if(my!==alive) return;
    if(qi>=ROUNDS) return end(st,who,'Conosci tutti i pronomi: I, you, he, she, we, they!');
    const {p,can,act}=qs[qi]; st.innerHTML=''; let done=false;
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const [f,name]=PRON[p];
    const scene=el('div','who','<div class="speaker">🧒💬<small>Meky parla</small></div><div class="arrow">➜</div><div class="target"><span class="f">'+f+' '+ACT[act][0]+'</span><small>'+name+'</small></div>');
    const opts=shuffle([p,...shuffle(Object.keys(PRON).filter(x=>x!==p)).slice(0,2)]);
    const pros=el('div','pros'), res=el('div',''); res.style.minHeight='70px';
    opts.forEach(o=>{ const b=el('button','pro',o); b.onclick=async()=>{ if(done) return;
      if(o===p){ done=true; b.classList.add('right'); const subj=p==='I'?'I':p.charAt(0).toUpperCase()+p.slice(1);
        res.innerHTML='<div class="en">'+sentence(subj,can,act)+'</div>'+(S.it?'<div class="it">'+itSent(PRO_IT[p],can,act,p==='we'||p==='they').replace(/^Io sa/,'Io so').replace(/^Tu sa/,'Tu sai').replace(/^Io non sa/,'Io non so').replace(/^Tu non sa/,'Tu non sai').replace(/^Noi (non )?sanno/,(m,n)=>'Noi '+(n||'')+'sappiamo')+'</div>':'');
        await speak(plain(subj,can,act)); await wait(800); qi++; next(); }
      else { wiggle(b); speak(o); } }; pros.appendChild(b); });
    st.append(dots,el('p','ask','Who? Chi è?'),el('p','sub','Meky parla e la freccia indica qualcuno. Scegli la parola giusta.'),scene,pros,res);
    speak('Who?');
  };
  next();
}

/* ── 🧩 Build the sentence: tessere colorate da mettere in ordine; "cans" è il tranello ── */
function build(){
  hush(); const my=alive; const st=$('stage'); let qi=0;
  const qs=Array.from({length:ROUNDS},()=>({p:Object.keys(PRON)[rnd(6)],can:Math.random()<.6,act:SAFE[rnd(SAFE.length)]}));
  const next=()=>{ if(my!==alive) return;
    if(qi>=ROUNDS) return end(st,build,'Sai costruire le frasi in inglese!');
    const {p,can,act}=qs[qi]; st.innerHTML='';
    const subj=p==='I'?'I':p.charAt(0).toUpperCase()+p.slice(1), right=[subj,can?'can':'can\'t',ACT[act][1]];
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const pic=el('div','pic',PRON[p][0]+' '+ACT[act][0]+'<span class="mark '+(can?'yes':'no')+'">'+(can?'✓':'✕')+'</span>');
    const hint=el('div','it',S.it?itSent(PRO_IT[p],can,act,p==='we'||p==='they').replace(/^Io sa/,'Io so').replace(/^Tu sa/,'Tu sai').replace(/^Io non sa/,'Io non so').replace(/^Tu non sa/,'Tu non sai').replace(/^Noi (non )?sanno/,(m,n)=>'Noi '+(n||'')+'sappiamo'):'');
    const slots=el('div','slots'), tiles=el('div','tiles'), tip=el('div','tip'); tip.hidden=true;
    // con he/she c'è anche il tranello "cans": can non cambia mai!
    const pool=[[right[0],'p'],[right[1],can?'c':'n'],[right[2],'a']]; if(can&&(p==='he'||p==='she')) pool.push(['cans','x']); else pool.push([can?'can\'t':'can',can?'n':'c']);
    let k=0;
    shuffle(pool).forEach(([w,c])=>{ const b=el('button','tile '+c,w); b.onclick=async()=>{
      if(w===right[k]){ slots.appendChild(el('span','tile '+c,w)); b.remove(); speak(w); k++;
        if(k===3){ await wait(400); await speak(right.join(' ')+'.'); await wait(700); qi++; next(); } }
      else { wiggle(b); if(w==='cans'){ tip.innerHTML='💡 Attenzione: <b>can</b> non cambia mai! Si dice <b>'+subj+' can</b>, senza la “s”.'; tip.hidden=false; speak('Can never changes!'); }
        else if(k===0){ tip.innerHTML='💡 Si comincia da <b>chi</b>: '+subj+'.'; tip.hidden=false; } else if(k===1){ tip.innerHTML='💡 Guarda il segno: '+(can?'✓ verde = <b>can</b>':'✕ rosso = <b>can\'t</b>')+'.'; tip.hidden=false; } } };
      tiles.appendChild(b); });
    st.append(dots,el('p','ask','Build the sentence!'),pic,hint,slots,tiles,tip);
    speak('Build the sentence!');
  };
  next();
}

/* ── 🌱 I can… I can't… yet! Il bambino sceglie cosa sa fare e cosa sta imparando ── */
let ME={};
function yet(){
  hush(); const st=$('stage'); st.innerHTML='';
  st.append(el('p','ask','I can… I can\'t… yet!'),el('p','sub','Tocca una volta le cose che sai fare (✅), due volte quelle che stai imparando (🌱).'));
  const g=el('div','acts');
  const draw=()=>{ g.innerHTML='';
    Object.entries(ACT).filter(([k])=>k!=='fly').forEach(([k,[e,en,it]])=>{ const s=ME[k]||''   // "volare" no: le persone non volano!, b=el('button','actb '+s,'<span class="e">'+e+'</span><span>'+(s==='can'?'I can '+en:s==='yet'?'I can\'t '+en+'… yet!':en)+'<small>'+(s==='can'?'so '+it:s==='yet'?'non so '+it+'… non ancora!':it)+'</small></span>');
      b.onclick=()=>{ ME[k]=s===''?'can':s==='can'?'yet':''; draw(); const n=ME[k]; if(n==='can') speak('I can '+en+'!'); else if(n==='yet') speak('I can\'t '+en+'… yet!'); };
      g.appendChild(b); }); };
  draw();
  const all=el('button','btn blue','🔊 Listen to me');
  all.onclick=()=>{ const can=Object.keys(ME).filter(k=>ME[k]==='can').map(k=>ACT[k][1]), yt=Object.keys(ME).filter(k=>ME[k]==='yet').map(k=>ACT[k][1]);
    speak((can.length?'I can '+can.join(', ')+'. ':'')+(yt.length?'I can\'t '+yt.join(', ')+'… yet!':'')||'Tap the pictures!'); };
  st.append(el('div','legend','<span>✅ = I can</span><span>🌱 = I can\'t… yet</span>'),g,all);
}

/* ── ❓ Questions: "Can a penguin fly?" – "No, it can't!" ── */
function questions(){
  hush(); const my=alive; const st=$('stage'); let qi=0;
  const qs=Array.from({length:ROUNDS},()=>{ const an=ANIMALS[rnd(ANIMALS.length)], can=Math.random()<.5, list=can?an[3].can:an[3].cant; return {an,can,act:list[rnd(list.length)]}; });
  const next=()=>{ if(my!==alive) return;
    if(qi>=ROUNDS) return end(st,questions,'Sai rispondere alle domande in inglese!');
    const {an,can,act}=qs[qi]; st.innerHTML=''; let done=false;
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const q='Can '+an[1].toLowerCase()+' '+ACT[act][1]+'?';
    const yn=el('div','yn','<button class="y">Yes, it can!</button><button class="x">No, it can\'t!</button>');
    const pick=async(ans,btn)=>{ if(done) return;
      if(ans===can){ done=true; btn.style.outline='5px solid #FFC93C'; await speak(can?'Yes, it can!':'No, it can\'t!'); await wait(600); qi++; next(); }
      else { wiggle(btn); speak('Hmm… are you sure?'); } };
    yn.children[0].onclick=e=>pick(true,e.currentTarget); yn.children[1].onclick=e=>pick(false,e.currentTarget);
    st.append(dots,el('div','en','<span class="c">Can</span> <span class="p">'+an[1].toLowerCase()+'</span> <span class="a">'+ACT[act][1]+'</span>?'),el('div','pic',an[0]+' '+ACT[act][0]),S.it?el('div','it','Sa '+ACT[act][2]+' '+an[2]+'?'):el('span',''),yn);
    speak(q);
  };
  next();
}

/* ── 🎶 La filastrocca: tutte le persone, una dopo l'altra (can, can't o la domanda) ── */
const CHANT=[['🧒','I','io'],['🫵','You','tu'],['👦','He','lui'],['👧','She','lei'],['🐶','It','animale o cosa'],['🧒👦👧','We','noi'],['🫵🫵','You','voi'],['👧🏾👧🏽','They','loro']];
function chant(){
  hush(); const my=alive; const st=$('stage'); st.innerHTML='';
  let mode='c', running=0;
  const modes=el('div','mode3'); const bc=el('button','mc','✅ can'), bn=el('button','mn','❌ can\'t'), bq=el('button','mq','❓ Can I…?');
  modes.append(bc,bn,bq);
  const rule=el('div','rule2',''), list=el('div','chant'), say=el('div','repeat',''); say.hidden=true;
  const play=el('button','btn blue','▶️ Ascolta'), rep=el('button','btn','🔁 Ripeti con me');
  const ctr=el('div','row'); ctr.append(play,rep);
  // la riga in inglese, con i colori di sempre; nella domanda il verbo va davanti
  const lineText=(subj)=>mode==='c'?subj+' can':mode==='n'?subj+' can\'t':'Can '+(subj==='I'?'I':subj.toLowerCase())+'?';
  const lineHTML=(subj)=>mode==='c'?'<span class="p">'+subj+'</span> <span class="c">can</span>':mode==='n'?'<span class="p">'+subj+'</span> <span class="n">can\'t</span>':'<span class="c">Can</span> <span class="p">'+(subj==='I'?'I':subj.toLowerCase())+'</span>?';
  const draw=()=>{
    [bc,bn,bq].forEach(b=>b.setAttribute('aria-pressed',String(b===({c:bc,n:bn,q:bq})[mode])));
    rule.innerHTML=mode==='q'?'💡 Per fare la domanda, <b>can</b> va <b>davanti</b>: <i>She can</i> → <i>Can she?</i>':'💡 <b>'+(mode==='c'?'can':'can\'t')+'</b> è sempre uguale, per tutte le persone: niente “s” con he, she e it!';
    list.innerHTML='';
    CHANT.forEach(([f,subj,it],i)=>{ const b=el('button','line','<span class="f">'+f+'</span><span class="en">'+lineHTML(subj)+'</span>'+(S.it?'<span class="itp">'+it+'</span>':''));
      b.onclick=()=>{ running++; light(i); speak(lineText(subj)); }; list.appendChild(b); });
  };
  const light=i=>list.querySelectorAll('.line').forEach((x,k)=>x.classList.toggle('on',k===i));
  // tutta la filastrocca, a ritmo; con "Ripeti con me" dopo ogni riga c'è una pausa per ripetere
  const run=async(repeat)=>{ const r=++running; say.hidden=!repeat;
    for(let i=0;i<CHANT.length;i++){ if(r!==running||my!==alive) return;
      light(i); say.textContent='👂 Ascolta…'; await speak(lineText(CHANT[i][1]));
      if(repeat){ if(r!==running) return; say.textContent='🗣️ Tocca a te: '+lineText(CHANT[i][1]); await wait(2200); } else await wait(250); }
    if(r===running){ light(-1); say.hidden=true; } };
  play.onclick=()=>run(false); rep.onclick=()=>run(true);
  bc.onclick=()=>{ running++; mode='c'; draw(); }; bn.onclick=()=>{ running++; mode='n'; draw(); }; bq.onclick=()=>{ running++; mode='q'; draw(); };
  st.append(el('p','ask','I can, you can… 🎶'),el('p','sub','Ascolta la filastrocca, oppure ripetila riga per riga. Tocca una riga per sentirla.'),modes,rule,list,say,ctr);
  draw();
}

/* ── ⚽ Free time: frasi con le attività del tempo libero (I can play football…) ── */
const FREE=[
  ['⚽','play football','giocare a calcio','sport'],['🏀','play basketball','giocare a basket','sport'],['🎾','play tennis','giocare a tennis','sport'],['♟️','play chess','giocare a scacchi','sport'],
  ['🎹','play the piano','suonare il pianoforte','strumento'],['🎸','play the guitar','suonare la chitarra','strumento'],['🥁','play the drums','suonare la batteria','strumento'],
  ['🏊','swim','nuotare',''],['🚲','ride a bike','andare in bici',''],['🛹','skateboard','andare sullo skateboard',''],['🛼','roller-skate','pattinare con i pattini a rotelle',''],['⛸️','ice-skate','pattinare sul ghiaccio',''],['🎿','ski','sciare',''],['🤸','do gymnastics','fare ginnastica artistica',''],['🪢','skip','saltare la corda',''],['🌳','climb trees','arrampicarsi sugli alberi',''],
  ['🎨','draw','disegnare',''],['🖌️','paint','dipingere',''],['💃','dance','ballare',''],['🎤','sing','cantare',''],['📖','read','leggere',''],['🔤','spell','fare lo spelling (dire le lettere)',''],['🗣️','speak languages','parlare le lingue',''],
  ['🍳','cook','cucinare',''],['🍰','bake a cake','preparare una torta',''],['🪁','fly a kite','far volare un aquilone',''],['🎮','play video games','giocare ai videogiochi',''],['📷','take photos','fare le foto',''],
];
function freeTime(){
  hush(); const my=alive; const st=$('stage'); st.innerHTML=''; let mode='learn', neg=false;
  const modes=el('div','mode2'), bl=el('button','','📚 Learn'), bq=el('button','','🎧 Listen and choose'); modes.append(bl,bq);
  const body=el('div',''); body.style.cssText='display:flex;flex-direction:column;gap:12px;width:100%;align-items:center';
  st.append(el('p','ask','⚽ Free time: I can…'),modes,body);
  const sentHTML=(f,n)=>'<span class="p">I</span> <span class="'+(n?'n':'c')+'">'+(n?'can\'t':'can')+'</span> <span class="a">'+f[1]+'</span>';
  const sentTxt=(f,n)=>'I '+(n?'can\'t':'can')+' '+f[1]+'.';
  const itTxt=(f,n)=>(n?'Non so ':'So ')+f[2]+'.';
  // 📚 Learn: tutte le frasi; un tocco le legge, il bottone le gira in can't
  function learn(){
    body.innerHTML='';
    const tip=el('div','rule2','💡 Con gli <b>sport</b> si dice <b>play</b> e basta: <i>play football</i>. Con gli <b>strumenti</b> ci vuole <b>the</b>: <i>play <b>the</b> piano</i>.');
    const sw=el('div','mode2'), s1=el('button','','✅ I can'), s2=el('button','','❌ I can\'t'); sw.append(s1,s2);
    const grid=el('div','ftgrid');
    const draw=()=>{ s1.setAttribute('aria-pressed',String(!neg)); s2.setAttribute('aria-pressed',String(neg)); grid.innerHTML='';
      FREE.forEach(f=>{ const b=el('button','ft'+(neg?' no':''),'<span class="e">'+f[0]+'</span><span class="s">'+sentHTML(f,neg)+'</span>'+(S.it?'<small>'+itTxt(f,neg)+'</small>':''));
        b.onclick=()=>{ grid.querySelectorAll('.ft').forEach(x=>x.classList.remove('on')); b.classList.add('on'); speak(sentTxt(f,neg)); }; grid.appendChild(b); }); };
    s1.onclick=()=>{ neg=false; draw(); }; s2.onclick=()=>{ neg=true; draw(); };
    const all=el('button','btn blue','▶️ Listen to all');
    all.onclick=async()=>{ const r=++alive; const cards=[...grid.querySelectorAll('.ft')];
      for(let i=0;i<FREE.length;i++){ if(r!==alive) return; cards.forEach((x,k)=>x.classList.toggle('on',k===i)); cards[i].scrollIntoView({block:'nearest',behavior:'smooth'}); await speak(sentTxt(FREE[i],neg)); await wait(300); }
      cards.forEach(x=>x.classList.remove('on')); };
    body.append(tip,sw,grid,all); draw();
  }
  // 🎧 Listen and choose: si sente la frase, si sceglie l'immagine
  function quiz(){
    const r=++alive; let qi=0; const qs=shuffle(FREE).slice(0,ROUNDS).map(f=>({f,n:Math.random()<.3}));
    const next=()=>{ if(r!==alive) return; body.innerHTML='';
      if(qi>=ROUNDS){ end(body,quiz,'Conosci le attività del tempo libero in inglese!'); return; }
      const {f,n}=qs[qi]; let done=false;
      const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
      const hear=el('button','btn blue','🔊 Listen again'); hear.onclick=()=>speak(sentTxt(f,n));
      const res=el('div',''); res.style.minHeight='60px';
      const grid=el('div','ftgrid'); grid.style.gridTemplateColumns='repeat(3,1fr)';
      shuffle([f,...shuffle(FREE.filter(x=>x!==f)).slice(0,2)]).forEach(o=>{ const b=el('button','ft','<span class="e" style="font-size:44px">'+o[0]+'</span>');
        b.onclick=async()=>{ if(done) return;
          if(o===f){ done=true; b.classList.add('on'); res.innerHTML='<div class="en" style="font-size:24px">'+sentHTML(f,n)+'.</div>'+(S.it?'<div class="it">'+itTxt(f,n)+'</div>':''); await speak(sentTxt(f,n)); await wait(700); qi++; next(); }
          else { wiggle(b); speak('That\'s "'+o[1]+'". Listen again!'); } };
        grid.appendChild(b); });
      body.append(dots,el('p','sub','Ascolta la frase e tocca l\'immagine giusta.'),hear,grid,res);
      speak(sentTxt(f,n));
    };
    next();
  }
  const setMode=m=>{ mode=m; bl.setAttribute('aria-pressed',String(m==='learn')); bq.setAttribute('aria-pressed',String(m==='quiz')); alive++; (m==='learn'?learn:quiz)(); };
  bl.onclick=()=>setMode('learn'); bq.onclick=()=>setMode('quiz');
  setMode('learn');
}

/* ── 🧠 Remember! Due giochi per ricordare le frasi del tempo libero ── */
function remember(){
  hush(); const st=$('stage'); st.innerHTML='';
  const modes=el('div','mode2'), b1=el('button','','🃏 Memory'), b2=el('button','','🎤 Say it!'); modes.append(b1,b2);
  const body=el('div',''); body.style.cssText='display:flex;flex-direction:column;gap:12px;width:100%;align-items:center';
  st.append(el('p','ask','🧠 Remember!'),modes,body);
  const setMode=m=>{ b1.setAttribute('aria-pressed',String(m===1)); b2.setAttribute('aria-pressed',String(m===2)); alive++; (m===1?memory:sayIt)(); };
  b1.onclick=()=>setMode(1); b2.onclick=()=>setMode(2);

  /* 🃏 Memory: si cercano le coppie immagine ↔ frase; quando si trova una coppia, la voce legge la frase */
  function memory(){
    const r=alive; body.innerHTML='';
    const pairs=shuffle(FREE).slice(0,6), cards=shuffle(pairs.flatMap(f=>[{f,pic:true},{f,pic:false}]));
    let open=[], found=0, busy=false, moves=0;
    const grid=el('div','mem four'), info=el('div','sub','Trova le coppie: un\'immagine e la sua frase.');
    cards.forEach(c=>{ const b=el('button','mcard','<div class="in"><div class="bk">?</div><div class="fr'+(c.pic?'':' tx')+'">'+(c.pic?c.f[0]:'<span><b>I</b> <i>can</i> '+c.f[1]+'</span>')+'</div></div>');
      c.el=b; b.onclick=async()=>{ if(busy||r!==alive||b.classList.contains('open')) return;
        b.classList.add('open'); open.push(c); if(!c.pic) speak('I can '+c.f[1]);
        if(open.length<2) return; busy=true; moves++; const [x,y]=open; open=[];
        if(x.f===y.f&&x.pic!==y.pic){ await wait(350); x.el.classList.add('done'); y.el.classList.add('done'); found++; await speak('I can '+x.f[1]+'!');
          if(found===pairs.length){ end(body,memory,'Hai trovato tutte le coppie in '+moves+' mosse!'); } }
        else { await wait(1100); x.el.classList.remove('open'); y.el.classList.remove('open'); }
        busy=false; };
      grid.appendChild(b); });
    body.append(info,grid);
  }

  /* 🎤 Say it! Si vede un'immagine e si dice la frase; il telefono ascolta (inglese britannico) */
  function sayIt(){
    const r=alive; body.innerHTML='';
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const list=shuffle(FREE).slice(0,ROUNDS); let qi=0;
    const next=()=>{ if(r!==alive) return; body.innerHTML='';
      if(qi>=list.length){ end(body,sayIt,'Hai detto '+list.length+' frasi in inglese!'); return; }
      const f=list[qi]; let done=false;
      const dots=el('div','dots'); list.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
      const pic=el('div','pic',f[0]), hint=el('div','it',''), heard=el('div','heard','');
      const help=el('button','btn','💡 Aiutami'), skip=el('button','btn','Avanti →');
      const ok=async()=>{ if(done) return; done=true; pic.insertAdjacentHTML('beforeend','<span class="mark yes">✓</span>'); hint.innerHTML='<div class="en" style="font-size:24px"><span class="p">I</span> <span class="c">can</span> <span class="a">'+f[1]+'</span>!</div>'; await speak('Brilliant! I can '+f[1]+'!'); await wait(600); qi++; next(); };
      // l'aiuto arriva un po' alla volta: prima la traduzione, poi l'inizio della frase, poi tutta
      let level=0; help.onclick=()=>{ level++; hint.innerHTML=level===1?'So '+f[2]+'…':level===2?'<b>I can '+f[1].split(' ')[0]+' …</b>':'<b>I can '+f[1]+'</b>'; if(level>=2) speak(level===2?'I can '+f[1].split(' ')[0]+'…':'I can '+f[1]); };
      body.append(dots,el('p','ask','Say it! Che cosa sai fare?'),pic,hint);
      if(SR){
        const mic=el('button','mic','🎤'); mic.setAttribute('aria-label','Parla');
        mic.onclick=()=>{ if(done) return; try{ const rec=new SR(); rec.lang='en-GB'; rec.interimResults=false; rec.maxAlternatives=3;
          rec.onresult=e=>{ const alts=[...e.results[0]].map(a=>a.transcript.toLowerCase()); heard.textContent='👂 “'+alts[0]+'”';
            // basta che ci siano "can" e le parole dell'attività (senza preoccuparsi di "the" o della pronuncia perfetta)
            const keys=f[1].toLowerCase().replace(/-/g,' ').split(' ').filter(w=>!['a','the'].includes(w));
            if(alts.some(a=>a.includes('can')&&keys.every(k=>a.replace(/-/g,' ').includes(k)))) ok(); else { speak('Almost! Try again.'); } };
          rec.onend=()=>mic.classList.remove('on'); rec.start(); mic.classList.add('on'); heard.textContent='👂 Ti ascolto…'; }catch(e){ heard.textContent='Il microfono non è disponibile.'; } };
        body.append(mic,heard);
      } else {
        // senza microfono: il bambino la dice a voce alta e controlla da solo
        const said=el('button','btn main','✅ L\'ho detta!'); said.onclick=async()=>{ hint.innerHTML='<b>I can '+f[1]+'</b>'; await speak('I can '+f[1]+'. Did you say it?'); ok(); };
        body.append(el('p','sub','Dilla a voce alta, poi tocca il bottone verde.'),said);
      }
      const rr=el('div','row'); rr.append(help,skip); body.appendChild(rr);
      skip.onclick=()=>{ qi++; next(); };
      speak('What can you do?');
    };
    next();
  }
  setMode(1);
}

/* ── Schede e impostazioni ── */
const TABS=[['👀 Look and listen',look],['🎶 I can, you can…',chant],['⚽ Free time',freeTime],['🧠 Remember!',remember],['✅❌ Can or can\'t?',canOrNot],['👆 Who?',who],['🧩 Build',build],['🌱 I can… yet!',yet],['❓ Questions',questions]];
let tab=0;
function render(){ const t=$('tabs'); t.innerHTML=''; TABS.forEach(([l],i)=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(i===tab)); b.onclick=()=>{ tab=i; render(); }; t.appendChild(b); }); TABS[tab][1](); }
if('speechSynthesis' in window) speechSynthesis.onvoiceschanged=()=>{};
render();

  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
