// @ts-nocheck
/*
 * 🌦️ English time · What's the weather like? (Look and listen, The weather song, Today, Listen and choose,
 * What do I need?, Remember!). Lo stesso codice del prototipo già provato, dentro un contenitore con la classe "smw".
 * La voce segue l'accento e la velocità di English time; la settimana del tempo è salvata per ogni bambino.
 */
export interface WeatherOptions { settings?: { it?: boolean; rate?: number; accent?: string }; onWin?: () => void }
export const WEATHER_CSS = ".smw{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#6870A0;--line:#D6DBF2;--done:#48B97A;--done-bg:#E6F6EE;--blue:#1C3F94;--radius:22px;--w:#1C7ED6;--a:#F08C00;\n  box-sizing:border-box}\n\n.smw *{box-sizing:border-box}\n.smw{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smw button{font-family:inherit;color:inherit;cursor:pointer;touch-action:manipulation}\n.smw button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smw [hidden]{display:none!important}\n.smw .app{max-width:540px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smw .title{background:var(--card);border-radius:var(--radius);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smw .title .l{display:flex;align-items:center;gap:12px}\n.smw .title .em{font-size:36px}\n.smw .title h1{margin:0;font-size:21px;font-weight:900}\n.smw .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smw .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.smw .buddy{display:flex;align-items:center;gap:10px;background:none;border:none;padding:0;text-align:left}\n.smw .buddy .av{width:50px;height:50px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:24px;border:3px solid #7048E8;background:#fff}\n.smw .buddy .bb{background:var(--card);border-radius:16px;padding:10px 14px;font-size:15px;font-weight:700;line-height:1.35}\n.smw .buddy .bb b{display:block;font-size:13px;font-weight:900;color:#7048E8}\n.smw .tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.smw .tab{min-height:54px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:800;padding:0 4px;line-height:1.2}\n.smw .tab[aria-current=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smw .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.smw .ask{margin:0;font-size:21px;font-weight:900;line-height:1.3}\n.smw .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smw .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.smw .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smw .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.smw .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;width:100%}\n.smw .dots{display:flex;gap:6px}\n.smw .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.smw .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.smw .dots .ok{background:var(--done)}\n.smw .wrong{animation:wiggle .4s}\n.smw .star{font-size:64px;animation:pop .5s ease-out}\n.smw .en{font-size:30px;font-weight:900;line-height:1.3}\n.smw .en .k{color:var(--w)}\n.smw .en .y{color:var(--a)}\n.smw .it{font-size:16px;font-weight:700;color:var(--soft);font-style:italic}\n.smw .tip{width:100%;background:#E6F6EA;color:#1E6B33;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:800;line-height:1.45;text-align:left}\n.smw /* le scene del tempo,.smw disegnate e animate */\n.scene{width:100%;max-width:340px;aspect-ratio:4/3;border-radius:22px;overflow:hidden;position:relative}\n.smw .scene svg{width:100%;height:100%;display:block}\n.smw .mini{width:100%;aspect-ratio:4/3;border-radius:14px;overflow:hidden}\n.smw .mini svg{width:100%;height:100%;display:block}\n.smw .drop{animation:fall .9s linear infinite}\n.smw .flake{animation:snow 3.2s linear infinite}\n.smw .sway{transform-origin:50% 100%;animation:sway 1.4s ease-in-out infinite alternate}\n.smw .gust{animation:gust 1.8s linear infinite}\n.smw .drift{animation:drift 7s ease-in-out infinite alternate}\n.smw .spin{transform-box:fill-box;transform-origin:center;animation:spin 18s linear infinite}\n.smw .fogband{animation:fog 6s ease-in-out infinite alternate}\n.smw .wave{animation:heat 1.6s ease-in-out infinite alternate}\n@keyframes fall{from{transform:translateY(-30px)}to{transform:translateY(140px)}}\n@keyframes snow{from{transform:translate(0,-30px)}50%{transform:translate(8px,60px)}to{transform:translate(-4px,150px)}}\n@keyframes sway{from{transform:rotate(-4deg)}to{transform:rotate(9deg)}}\n@keyframes gust{from{transform:translateX(-60px);opacity:0}30%{opacity:1}to{transform:translateX(140px);opacity:0}}\n@keyframes drift{from{transform:translateX(-10px)}to{transform:translateX(14px)}}\n@keyframes spin{to{transform:rotate(360deg)}}\n@keyframes fog{from{transform:translateX(-14px)}to{transform:translateX(14px)}}\n@keyframes heat{from{transform:translateY(0);opacity:.4}to{transform:translateY(-6px);opacity:.9}}\n.smw /* carta che si gira e griglie */\n.flip{width:100%;max-width:340px;border-radius:22px;border:4px solid var(--line);background:var(--ground);padding:12px;display:flex;flex-direction:column;align-items:center;gap:10px}\n.smw .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%}\n.smw .pick{border-radius:16px;border:3px solid var(--line);background:var(--ground);padding:6px;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:14px;font-weight:900}\n.smw .pick.right,.smw .pick[aria-pressed=\"true\"]{border-color:var(--done);background:var(--done-bg)}\n.smw /* filastrocca */\n.chant{width:100%;display:flex;flex-direction:column;gap:6px}\n.smw .line{display:flex;align-items:center;gap:12px;border-radius:16px;border:3px solid transparent;background:var(--ground);padding:8px 12px;text-align:left;width:100%}\n.smw .line .f{font-size:28px;width:44px;text-align:center;flex:none}\n.smw .line .tx{font-size:22px;font-weight:900;flex:1}\n.smw .line.on{border-color:#FFC93C;background:#FFF6D6;color:#3D2E00}\n.smw .repeat{font-size:17px;font-weight:900;color:#5A4300;background:#FFF6D6;border-radius:14px;padding:8px 14px}\n.smw /* vestire Meky */\n.meky{display:flex;align-items:flex-end;justify-content:center;gap:6px;min-height:110px;width:100%;border-radius:20px;background:var(--ground);padding:10px;flex-wrap:wrap}\n.smw .meky .me{font-size:70px;line-height:1}\n.smw .meky .on{font-size:40px;animation:pop .4s ease-out}\n.smw .clothes{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%}\n.smw .cl{min-height:92px;border-radius:16px;border:3px solid var(--line);background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:14px;font-weight:900;box-shadow:0 4px 0 var(--line)}\n.smw .cl .e{font-size:36px}\n.smw .cl small{font-size:11px;font-weight:800;color:var(--soft);font-style:italic}\n.smw .cl.picked{border-color:var(--done);background:var(--done-bg);box-shadow:0 4px 0 var(--done);opacity:.55}\n.smw /* oggi e la settimana */\n.week{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:100%}\n.smw .wd{border-radius:14px;border:2px solid var(--line);background:var(--ground);padding:6px 2px;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:13px;font-weight:900;min-height:96px}\n.smw .wd .e{font-size:30px;min-height:34px}\n.smw .wd small{font-size:11px;font-weight:800;color:var(--soft)}\n.smw .wd.today{border-color:#FFC93C;background:#FFF6D6;color:#3D2E00}\n.smw .temps{display:flex;gap:8px;width:100%}\n.smw .temps button{flex:1;min-height:56px;border-radius:14px;border:3px solid var(--line);background:var(--ground);font-size:16px;font-weight:900}\n.smw .temps button[aria-pressed=\"true\"]{border-color:var(--blue);background:color-mix(in srgb,var(--blue) 14%,var(--card))}\n.smw /* memory e microfono */\n.mem{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;width:100%}\n.smw .mcard{aspect-ratio:3/4;perspective:600px;border:none;background:none;padding:0}\n.smw .mcard .in{position:relative;width:100%;height:100%;transition:transform .4s;transform-style:preserve-3d}\n.smw .mcard.open .in{transform:rotateY(180deg)}\n.smw .mcard .bk,.smw .mcard .fr{position:absolute;inset:0;backface-visibility:hidden;border-radius:14px;display:flex;align-items:center;justify-content:center;padding:4px;overflow:hidden}\n.smw .mcard .bk{background:var(--blue);color:#fff;font-size:28px;font-weight:900}\n.smw .mcard .fr{background:var(--card);border:3px solid var(--line);transform:rotateY(180deg);font-size:15px;font-weight:900;line-height:1.2}\n.smw .mcard .fr svg{width:100%;height:100%}\n.smw .mcard.done .fr{border-color:var(--done)}\n.smw .mic{width:120px;height:120px;border-radius:50%;border:none;background:#E03131;color:#fff;font-size:50px;box-shadow:0 6px 0 #A61E1E}\n.smw .mic.on{animation:pulse 1s ease-in-out infinite}\n.smw .heard{font-size:17px;font-weight:800;color:var(--soft);min-height:24px}\n.smw .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.smw .set{display:flex;flex-direction:column;gap:8px}\n.smw .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.smw .chips{display:flex;gap:8px;flex-wrap:wrap}\n.smw .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.smw .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.smw *{animation:none!important;transition:none!important}}"
export function mountWeather(root: HTMLElement, opts: WeatherOptions = {}): () => void {
  root.innerHTML = "<nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <section class=\"card\" data-k=\"stage\"></section>"

let S=Object.assign({it:true,rate:.8,accent:'en-GB'},opts.settings||{});
const OPT={it:[[true,'Sì'],[false,'No']],rate:[[.7,'Lenta'],[.85,'Normale']]};
const ROUNDS=6;
/* ── Il tempo: parola inglese, la parola da cui nasce (+y), italiano, emoji ── */
const W={
  sunny:['sunny','sun','c\'è il sole','☀️'], cloudy:['cloudy','cloud','è nuvoloso','☁️'], rainy:['rainy','rain','piove','🌧️'],
  windy:['windy','wind','c\'è vento','🌬️'], snowy:['snowy','snow','nevica','❄️'], foggy:['foggy','fog','c\'è nebbia','🌫️'],
  stormy:['stormy','storm','c\'è il temporale','⛈️'], hot:['hot','','fa caldo','🥵'], cold:['cold','','fa freddo','🥶'],
};
const KEYS=Object.keys(W);
/* ── Cosa serve con ogni tempo ── */
const CLOTHES={umbrella:['☂️','umbrella','ombrello'],wellies:['🥾','wellies','stivali di gomma'],raincoat:['🧥','raincoat','impermeabile'],sunglasses:['🕶️','sunglasses','occhiali da sole'],sunhat:['👒','sun hat','cappello da sole'],shorts:['🩳','shorts','pantaloncini'],
  scarf:['🧣','scarf','sciarpa'],gloves:['🧤','gloves','guanti'],coat:['🧥','coat','cappotto'],tshirt:['👕','T-shirt','maglietta'],jumper:['🧶','jumper','maglione']};
const NEED={sunny:['sunglasses','sunhat'],hot:['shorts','tshirt','sunglasses'],rainy:['umbrella','wellies'],stormy:['raincoat','wellies'],cold:['scarf','gloves','coat'],snowy:['coat','gloves','scarf'],windy:['jumper','coat'],cloudy:['jumper'],foggy:['jumper','coat']};

/* ── Le scene, in SVG: cielo, prato, e il tempo che si muove ── */
function sceneSVG(k){
  const sky={sunny:'#9FD8FF',hot:'#FFD8A8',cloudy:'#C9D3E3',rainy:'#9AA7BC',stormy:'#6C7489',windy:'#B9DCF2',snowy:'#DCE6F2',foggy:'#D7DCE3',cold:'#CFE6F7'}[k];
  const grass={snowy:'#F1F5FB',cold:'#BFDCC7',hot:'#C5D97A'}[k]||'#8CCB7E';
  let s='<svg viewBox="0 0 160 120" role="img" aria-label="'+W[k][0]+'"><rect width="160" height="120" fill="'+sky+'"/><path d="M0 92 Q40 84 80 90 T160 88 V120 H0 Z" fill="'+grass+'"/>';
  const cloud=(x,y,c,cls)=>'<g class="'+(cls||'drift')+'"><path d="M'+x+' '+y+' q0 -14 16 -14 q4 -12 20 -9 q12 -6 20 6 q14 0 14 12 q0 9 -10 9 H'+(x+6)+' q-6 0 -6 -4 Z" fill="'+c+'"/></g>';
  const tree=(x,cls)=>'<g transform="translate('+x+' 90)"><g class="'+(cls||'')+'"><rect x="-3" y="-30" width="6" height="30" rx="2" fill="#8D6E63"/><circle cy="-38" r="16" fill="#3F9B54"/><circle cx="-10" cy="-30" r="10" fill="#4FB36C"/><circle cx="11" cy="-31" r="10" fill="#4FB36C"/></g></g>';
  if(k==='sunny'||k==='hot'){ s+='<g transform="translate(118 30)"><g class="spin">'+Array.from({length:10},(_,i)=>'<rect x="-2" y="-30" width="4" height="10" rx="2" fill="#FFB703" transform="rotate('+i*36+')"/>').join('')+'</g><circle r="16" fill="#FFD43B"/></g>'+tree(40);
    if(k==='hot') s+='<g fill="none" stroke="#F76707" stroke-width="2.5" stroke-linecap="round"><path class="wave" d="M60 80 q4 -6 0 -12 t0 -12"/><path class="wave" style="animation-delay:.4s" d="M80 82 q4 -6 0 -12 t0 -12"/><path class="wave" style="animation-delay:.8s" d="M100 80 q4 -6 0 -12 t0 -12"/></g><g transform="translate(140 74)"><rect x="-4" y="-26" width="8" height="30" rx="4" fill="#fff" stroke="#999"/><rect x="-2" y="-22" width="4" height="24" rx="2" fill="#E03131"/><circle cy="6" r="6" fill="#E03131"/></g>'; }
  if(k==='cloudy') s+=cloud(20,40,'#fff')+cloud(80,30,'#F1F3F7')+cloud(50,58,'#E3E7EE')+tree(130);
  if(k==='rainy'||k==='stormy'){ const c=k==='stormy'?'#5B6273':'#7E8AA0'; s+=cloud(20,36,c)+cloud(78,30,c)+'<g stroke="#4C8DFF" stroke-width="2.5" stroke-linecap="round">'+Array.from({length:12},(_,i)=>'<line class="drop" style="animation-delay:-'+(i*0.13).toFixed(2)+'s" x1="'+(24+i*10)+'" y1="44" x2="'+(21+i*10)+'" y2="52"/>').join('')+'</g>'+tree(130);
    if(k==='stormy') s+='<path d="M92 44 L84 62 H92 L86 80 L104 56 H95 L100 44 Z" fill="#FFD43B" stroke="#F59F00" stroke-width="1.5"/>'; }
  if(k==='windy') s+=tree(40,'sway')+tree(120,'sway')+'<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round">'+[30,50,64].map((y,i)=>'<path class="gust" style="animation-delay:-'+(i*0.5)+'s" d="M0 '+y+' q20 -8 40 0 q10 6 18 -2"/>').join('')+'</g><g class="gust" style="animation-delay:.9s"><path d="M10 70 q6 -8 12 0 q-6 8 -12 0 Z" fill="#7BC67E"/></g>';
  if(k==='snowy'||k==='cold'){ if(k==='snowy') s+=cloud(30,34,'#F1F3F7')+cloud(90,28,'#fff')+'<g fill="#fff">'+Array.from({length:14},(_,i)=>'<circle class="flake" style="animation-delay:-'+(i*0.23).toFixed(2)+'s" cx="'+(14+i*10)+'" cy="40" r="2.6"/>').join('')+'</g><g transform="translate(118 90)"><circle cy="-10" r="10" fill="#fff"/><circle cy="-26" r="7" fill="#fff"/><path d="M0 -26 l7 2 -7 1 Z" fill="#F76707"/><circle cx="-2" cy="-28" r="1" fill="#333"/></g>';
    else s+=tree(40)+'<g transform="translate(120 78)"><rect x="-4" y="-34" width="8" height="40" rx="4" fill="#fff" stroke="#999"/><rect x="-2" y="-8" width="4" height="12" rx="2" fill="#1C7ED6"/><circle cy="8" r="6" fill="#1C7ED6"/></g><g fill="#fff" opacity=".9"><circle class="drift" cx="80" cy="40" r="6"/><circle cx="74" cy="34" r="3"/></g>'; }
  if(k==='foggy') s+=tree(40)+tree(120)+'<g fill="#fff">'+[40,58,76].map((y,i)=>'<rect class="fogband" style="animation-delay:-'+(i*0.8)+'s" x="-20" y="'+y+'" width="200" height="12" rx="6" opacity=".75"/>').join('')+'</g>';
  return s+'</svg>';
}
const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function voiceFor(lang){ const vs=speechSynthesis.getVoices(); const A=S.accent||'en-GB'; return lang==='en'?(vs.find(v=>v.lang.replace('_','-')===A&&/natural|enhanced|premium|google|siri/i.test(v.name))||vs.find(v=>v.lang.replace('_','-')===A)):vs.find(v=>v.lang.startsWith('it')); }
function speak(t,lang='en'){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang=lang==='en'?(S.accent||'en-GB'):'it-IT'; u.rate=lang==='en'?S.rate:.9; const v=voiceFor(lang); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1400+t.length*110); setTimeout(()=>speechSynthesis.speak(u),80); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
/* la frase colorata: "It's" blu, la parola del tempo arancione, con la "y" evidenziata */
const word=k=>{ const w=W[k][0], b=W[k][1]; return b&&w.endsWith('y')?'<span class="y">'+w.slice(0,-1)+'<u>y</u></span>':'<span class="y">'+w+'</span>'; };
const itsHTML=k=>'<span class="k">It\'s</span> '+word(k)+'!';
const itsTxt=k=>'It\'s '+W[k][0]+'!';
function end(st,again,text){ opts.onWin&&opts.onWin(); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask','Well done!'),el('p','sub',text)); const b=el('button','btn main','🔄 Again'); b.onclick=again; st.appendChild(b); speak('Well done!'); }

/* ── 👀 Look and listen: una scena per ogni tempo; la parola da cui nasce si "allunga" con la y ── */
function look(){
  hush(); const st=$('stage'); st.innerHTML=''; let i=0;
  const box=el('div','flip'), nav=el('div','row'), pv=el('button','btn','← Prima'), nx=el('button','btn blue','Dopo →'); nav.append(pv,nx);
  st.append(el('p','ask','What\'s the weather like?'),box,nav);
  const draw=()=>{ const k=KEYS[i], [w,b,it]=W[k]; box.innerHTML='';
    const sc=el('div','scene',sceneSVG(k)); sc.onclick=()=>speak(itsTxt(k));
    box.append(sc,el('div','en',itsHTML(k)));
    if(S.it) box.appendChild(el('div','it',it.charAt(0).toUpperCase()+it.slice(1)));
    if(b){ const t=el('div','tip','💡 <b>'+b+'</b> + <b>y</b> = <b>'+w+'</b>'); t.style.textAlign='center'; t.onclick=()=>speak(b+'… '+w); box.appendChild(t); }
    speak(b?b+'… '+w+'. '+itsTxt(k):itsTxt(k)); };
  pv.onclick=()=>{ i=(i-1+KEYS.length)%KEYS.length; draw(); }; nx.onclick=()=>{ i=(i+1)%KEYS.length; draw(); };
  draw();
}

/* ── 🎶 La filastrocca: "What's the weather like today?" ── */
const CHANT=[['❓','What\'s the weather like today?'],['☀️','Is it sunny? Is it grey?'],['🌧️','Is it rainy? Is it windy?'],['❄️','Is it snowy? Is it foggy?'],['🪟','Let\'s look outside and see…'],['🌈','It\'s a lovely day for me!']];
function chant(){
  hush(); const my=alive; const st=$('stage'); st.innerHTML='';
  const list=el('div','chant'), say=el('div','repeat',''); say.hidden=true;
  const items=CHANT.map(([f,tx])=>{ const b=el('button','line','<span class="f">'+f+'</span><span class="tx">'+tx+'</span>'); b.onclick=()=>{ alive++; items.forEach(x=>x.classList.remove('on')); b.classList.add('on'); speak(tx); }; list.appendChild(b); return b; });
  const play=el('button','btn blue','▶️ Ascolta'), rep=el('button','btn','🔁 Ripeti con me'); const r=el('div','row'); r.append(play,rep);
  const run=async repeat=>{ const me=++alive; say.hidden=!repeat;
    for(let i=0;i<CHANT.length;i++){ if(me!==alive) return; items.forEach((x,k)=>x.classList.toggle('on',k===i)); say.textContent='👂 Listen…'; await speak(CHANT[i][1]);
      if(repeat){ if(me!==alive) return; say.textContent='🗣️ Tocca a te: '+CHANT[i][1]; await wait(2400); } else await wait(200); }
    if(me===alive){ items.forEach(x=>x.classList.remove('on')); say.hidden=true; } };
  play.onclick=()=>run(false); rep.onclick=()=>run(true);
  st.append(el('p','ask','The weather song 🎶'),el('p','sub','Ascolta la filastrocca, o ripetila riga per riga. Tocca una riga per sentirla.'),list,say,r);
}

/* ── 🌤️ Today: il bambino guarda fuori e sceglie il tempo di oggi; si segna nella settimana ── */
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday'];
function loadWeek(){ try{ return JSON.parse(localStorage.getItem('inglese_tempo')||'{}'); }catch(e){ return {}; } }
function saveWeek(v){ try{ localStorage.setItem('inglese_tempo',JSON.stringify(v)); }catch(e){} }
function monday(){ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-((d.getDay()+6)%7)); return d; }
const isoD=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
function today(){
  hush(); const st=$('stage'); st.innerHTML='';
  const wk=loadWeek(), mon=monday(), now=new Date(); now.setHours(0,0,0,0); const tIso=isoD(now), dow=(now.getDay()+6)%7;
  const cur=wk[tIso]||{w:'',t:''};
  const g=el('div','grid3');
  ['sunny','cloudy','rainy','windy','snowy','foggy','stormy'].forEach(k=>{ const b=el('button','pick','<div class="mini">'+sceneSVG(k)+'</div>'+W[k][0]); b.setAttribute('aria-pressed',String(cur.w===k)); b.onclick=()=>{ cur.w=k; wk[tIso]=cur; saveWeek(wk); speak('Today it\'s '+W[k][0]+'!'); today(); }; g.appendChild(b); });
  const temps=el('div','temps'); [['hot','🥵 hot'],['warm','🙂 warm'],['cold','🥶 cold']].forEach(([k,l])=>{ const b=el('button','',l); b.setAttribute('aria-pressed',String(cur.t===k)); b.onclick=()=>{ cur.t=k; wk[tIso]=cur; saveWeek(wk); speak('It\'s '+k+'!'); today(); }; temps.appendChild(b); });
  st.append(el('p','ask','🪟 Look outside! What\'s the weather like today?'),g,el('p','sub','Fa caldo o freddo?'),temps);
  if(cur.w){ const need=[...new Set([...(NEED[cur.w]||[]),...(cur.t==='hot'?NEED.hot:cur.t==='cold'?NEED.cold:[])])].slice(0,3);
    const sent='Today it\'s '+W[cur.w][0]+(cur.t?' and '+cur.t:'')+'! I need '+need.map((c,i)=>(i&&i===need.length-1?'and ':'')+'my '+CLOTHES[c][1]).join(', ').replace(', and',' and')+'.';
    const box=el('div','tip',''); box.style.background='#FFF6D6'; box.style.color='#3D2E00';
    box.innerHTML='🧒 <b>'+sent+'</b><br>'+need.map(c=>CLOTHES[c][0]).join(' ')+(S.it?'<br><i>'+'Oggi '+W[cur.w][2]+(cur.t==='hot'?' e fa caldo':cur.t==='cold'?' e fa freddo':'')+'.</i>':'');
    const hb=el('button','btn blue','🔊 Meky dice'); hb.onclick=()=>speak(sent); st.append(box,hb); }
  // la settimana
  const wkBox=el('div','week');
  DAYS.forEach((d,i)=>{ const dd=new Date(mon); dd.setDate(mon.getDate()+i); const v=wk[isoD(dd)]; const c=el('div','wd'+(i===dow?' today':''),d.slice(0,3)+'<span class="e">'+(v&&v.w?W[v.w][3]:'')+'</span><small>'+(v&&v.w?W[v.w][0]:'')+'</small>'); wkBox.appendChild(c); });
  st.append(el('p','ask','📅 This week'),wkBox);
  const cnt={}; DAYS.forEach((d,i)=>{ const dd=new Date(mon); dd.setDate(mon.getDate()+i); const v=wk[isoD(dd)]; if(v&&v.w) cnt[v.w]=(cnt[v.w]||0)+1; });
  const nums=['','one','two','three','four','five'], parts=Object.entries(cnt).map(([k,n])=>nums[n]+' '+W[k][0]+' day'+(n>1?'s':''));
  if(parts.length){ const sum='This week: '+parts.join(' and ')+'!'; const b=el('button','btn','🔊 '+sum); b.onclick=()=>speak(sum); st.appendChild(b); }
}

/* ── 🎧 Listen and choose: si sente la frase, si tocca la scena ── */
function listen(){
  hush(); const my=alive; const st=$('stage'); let qi=0; const qs=shuffle(KEYS).slice(0,ROUNDS);
  const next=()=>{ if(my!==alive) return;
    if(qi>=qs.length) return end(st,listen,'Sai riconoscere il tempo in inglese!');
    const k=qs[qi]; st.innerHTML=''; let done=false;
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const hear=el('button','btn blue','🔊 Listen again'); hear.onclick=()=>speak(itsTxt(k));
    const g=el('div','grid3'), res=el('div',''); res.style.minHeight='50px';
    shuffle([k,...shuffle(KEYS.filter(x=>x!==k)).slice(0,2)]).forEach(o=>{ const b=el('button','pick','<div class="mini">'+sceneSVG(o)+'</div>');
      b.onclick=async()=>{ if(done) return;
        if(o===k){ done=true; b.classList.add('right'); res.innerHTML='<div class="en">'+itsHTML(k)+'</div>'+(S.it?'<div class="it">'+W[k][2]+'</div>':''); await speak(itsTxt(k)); await wait(600); qi++; next(); }
        else { wiggle(b); speak('That\'s '+W[o][0]+'. Listen again!'); } };
      g.appendChild(b); });
    st.append(dots,el('p','ask','What\'s the weather like?'),hear,g,res); speak(itsTxt(k));
  };
  next();
}

/* ── 🧥 What do I need? Si veste Meky con le cose giuste per quel tempo ── */
function dress(){
  hush(); const my=alive; const st=$('stage'); let qi=0; const qs=shuffle(['sunny','rainy','cold','snowy','hot','stormy']);
  const next=()=>{ if(my!==alive) return;
    if(qi>=qs.length) return end(st,dress,'Meky è vestito giusto per ogni tempo!');
    const k=qs[qi], need=NEED[k]; st.innerHTML=''; const got=new Set();
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const sc=el('div','scene',sceneSVG(k)); sc.style.maxWidth='240px';
    const meky=el('div','meky','<span class="me">🧒</span>');
    const others=shuffle(Object.keys(CLOTHES).filter(c=>!need.includes(c)&&!(need.includes('coat')&&c==='raincoat')&&!(need.includes('raincoat')&&c==='coat'))).slice(0,6-need.length);
    const g=el('div','clothes');
    shuffle([...need,...others]).forEach(c=>{ const [e,en,it]=CLOTHES[c]; const b=el('button','cl','<span class="e">'+e+'</span>'+en+(S.it?'<small>'+it+'</small>':''));
      b.onclick=async()=>{ if(got.has(c)) return;
        if(need.includes(c)){ got.add(c); b.classList.add('picked'); meky.appendChild(el('span','on',e)); speak('My '+en+'!');
          if(got.size===need.length){ const sent=itsTxt(k).replace('!','')+': I need my '+need.map(x=>CLOTHES[x][1]).join(' and my ')+'!'; await wait(700); await speak(sent); await wait(500); qi++; next(); } }
        else { wiggle(b); speak('Not today!'); } };
      g.appendChild(b); });
    st.append(dots,el('div','en',itsHTML(k)),sc,el('p','ask','What do I need?'),meky,g); speak(itsTxt(k)+' What do I need?');
  };
  next();
}

/* ── 🧠 Remember: memory scena ↔ frase, e "Say it!" con il microfono ── */
function remember(){
  hush(); const st=$('stage'); st.innerHTML='';
  const m=el('div','row'), a=el('button','btn blue','🃏 Memory'), b=el('button','btn','🎤 Say it!'); m.append(a,b);
  const body=el('div',''); body.style.cssText='display:flex;flex-direction:column;gap:12px;width:100%;align-items:center';
  st.append(el('p','ask','🧠 Remember!'),m,body);
  a.onclick=()=>{ a.className='btn blue'; b.className='btn'; memory(); }; b.onclick=()=>{ b.className='btn blue'; a.className='btn'; sayIt(); };
  function memory(){ const r=++alive; body.innerHTML='';
    const ks=shuffle(KEYS).slice(0,6), cards=shuffle(ks.flatMap(k=>[{k,pic:true},{k,pic:false}])); let open=[], found=0, busy=false;
    const g=el('div','mem');
    cards.forEach(c=>{ const bt=el('button','mcard','<div class="in"><div class="bk">?</div><div class="fr">'+(c.pic?sceneSVG(c.k):'It\'s '+W[c.k][0])+'</div></div>'); c.el=bt;
      bt.onclick=async()=>{ if(busy||r!==alive||bt.classList.contains('open')) return; bt.classList.add('open'); open.push(c); if(!c.pic) speak(itsTxt(c.k));
        if(open.length<2) return; busy=true; const [x,y]=open; open=[];
        if(x.k===y.k&&x.pic!==y.pic){ await wait(300); x.el.classList.add('done'); y.el.classList.add('done'); found++; await speak(itsTxt(x.k)); if(found===ks.length) end(body,memory,'Hai trovato tutte le coppie!'); }
        else { await wait(1000); x.el.classList.remove('open'); y.el.classList.remove('open'); }
        busy=false; }; g.appendChild(bt); });
    body.append(el('p','sub','Trova le coppie: una scena e la sua frase.'),g); }
  function sayIt(){ const r=++alive; body.innerHTML=''; const SR=window.SpeechRecognition||window.webkitSpeechRecognition; const list=shuffle(KEYS).slice(0,ROUNDS); let qi=0;
    const next=()=>{ if(r!==alive) return; body.innerHTML='';
      if(qi>=list.length){ end(body,sayIt,'Hai detto '+list.length+' frasi sul tempo!'); return; }
      const k=list[qi]; let done=false; const heard=el('div','heard',''), hint=el('div','it','');
      const ok=async()=>{ if(done) return; done=true; hint.innerHTML='<div class="en">'+itsHTML(k)+'</div>'; await speak('Brilliant! '+itsTxt(k)); await wait(500); qi++; next(); };
      const help=el('button','btn','💡 Aiutami'); let lv=0; help.onclick=()=>{ lv++; if(lv===1) hint.textContent=W[k][2].charAt(0).toUpperCase()+W[k][2].slice(1)+'…'; else { hint.innerHTML='<b>'+itsTxt(k)+'</b>'; speak(itsTxt(k)); } };
      body.append(el('p','ask','Say it! What\'s the weather like?'),el('div','scene',sceneSVG(k)),hint);
      if(SR){ const mic=el('button','mic','🎤'); mic.setAttribute('aria-label','Parla');
        mic.onclick=()=>{ if(done) return; try{ const rec=new SR(); rec.lang=S.accent||'en-GB'; rec.maxAlternatives=3;
          rec.onresult=e=>{ const alts=[...e.results[0]].map(x=>x.transcript.toLowerCase()); heard.textContent='👂 “'+alts[0]+'”'; if(alts.some(x=>x.includes(W[k][0]))) ok(); else speak('Almost! Try again.'); };
          rec.onend=()=>mic.classList.remove('on'); rec.start(); mic.classList.add('on'); heard.textContent='👂 …'; }catch(e){ heard.textContent='Il microfono non è disponibile.'; } };
        body.append(mic,heard); }
      else { const s2=el('button','btn main','✅ L\'ho detta!'); s2.onclick=async()=>{ hint.innerHTML='<b>'+itsTxt(k)+'</b>'; await speak(itsTxt(k)); ok(); }; body.append(el('p','sub','Dilla a voce alta, poi tocca il bottone verde.'),s2); }
      const rr=el('div','row'); const sk=el('button','btn','Avanti →'); sk.onclick=()=>{ qi++; next(); }; rr.append(help,sk); body.appendChild(rr); speak('What\'s the weather like?');
    };
    next(); }
  memory();
}

const TABS=[['👀 Look and listen',look],['🎶 The weather song',chant],['🌤️ Today',today],['🎧 Listen and choose',listen],['🧥 What do I need?',dress],['🧠 Remember!',remember]];
let tab=0;
function render(){ const t=$('tabs'); t.innerHTML=''; TABS.forEach(([l],i)=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(i===tab)); b.onclick=()=>{ tab=i; render(); }; t.appendChild(b); }); TABS[tab][1](); }
render();

  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
