// @ts-nocheck
/*
 * 👩‍⚕️ Il femminile (dottore → dottoressa): sei famiglie con il loro colore, i personaggi disegnati,
 * Scopri, Trasforma! (anche al contrario), Memory con le piccole immagini, Il o la? / Un o un'?,
 * il mazzo senza ripetizioni, i ripassi e le parole della scuola.
 * Lo stesso codice del prototipo già provato, dentro un contenitore con la classe "smf".
 * Mazzo, ripassi, parole della scuola e impostazioni sono per figlio (chiavi fem_* in lib/childStore.ts).
 */
export interface FemOptions { mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void }
export const FEM_CSS = ".smf{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#5468D8;--radius:22px;\n  --f1:#2F9E44;--f2:#7048E8;--f3:#E8590C;--f4:#1C7ED6;--f5:#0B7285;--f6:#C2255C;\n  box-sizing:border-box}\n\n.smf *{box-sizing:border-box}\n.smf{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.smf button,.smf input{font-family:inherit;color:inherit}\n.smf button{cursor:pointer;touch-action:manipulation}\n.smf button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.smf [hidden]{display:none!important}\n.smf .app{max-width:540px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.smf .title{background:var(--card);border-radius:var(--radius);padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:10px}\n.smf .title .l{display:flex;align-items:center;gap:12px}\n.smf .title .em{font-size:36px}\n.smf .title h1{margin:0;font-size:22px;font-weight:900}\n.smf .title p{margin:2px 0 0;font-size:14px;font-weight:700;color:var(--soft)}\n.smf .gear{flex:none;width:48px;height:48px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:21px}\n.smf .buddy{display:flex;align-items:center;gap:10px;background:none;border:none;padding:0;text-align:left}\n.smf .buddy .av{width:50px;height:50px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:24px;border:3px solid #C2255C;background:#fff}\n.smf .buddy .bb{background:var(--card);border-radius:16px;padding:10px 14px;font-size:15px;font-weight:700;line-height:1.35}\n.smf .buddy .bb b{display:block;font-size:13px;font-weight:900;color:#C2255C}\n.smf .tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}\n.smf .tab{min-height:54px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:800;padding:0 4px;line-height:1.2}\n.smf .tab[aria-current=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smf .fams{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}\n.smf .fam{flex:none;min-height:44px;padding:0 12px;border-radius:999px;border:3px solid var(--c);background:var(--card);color:var(--c);font-size:14px;font-weight:900}\n.smf .fam[aria-pressed=\"true\"]{background:var(--c);color:#fff}\n.smf .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.smf .ask{margin:0;font-size:20px;font-weight:900;line-height:1.3}\n.smf .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.smf .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.smf .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.smf .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.smf .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;width:100%}\n.smf .dots{display:flex;gap:6px}\n.smf .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.smf .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.smf .dots .ok{background:var(--done)}\n.smf .dots .ko{background:#FFA94D}\n.smf .rule{width:100%;border-radius:16px;padding:10px 14px;font-size:17px;font-weight:900;color:#fff;background:var(--c);line-height:1.35}\n.smf .rule small{display:block;font-size:13px;font-weight:700;opacity:.9}\n.smf /* la coppia: lui e lei */\n.pair{display:grid;grid-template-columns:1fr auto 1fr;gap:6px;align-items:end;width:100%}\n.smf .pair .arrow{font-size:30px;font-weight:900;color:var(--c);padding-bottom:58px}\n.smf .person{display:flex;flex-direction:column;align-items:center;gap:4px;border-radius:20px;background:linear-gradient(180deg,#E3F0FC,#FFF6E6);padding:6px 4px 10px;border:none}\n.smf .person svg{width:100%;max-width:170px;height:auto;overflow:visible}\n.smf .word{font-size:24px;font-weight:900;line-height:1.2}\n.smf .word .art{color:var(--soft);font-weight:800}\n.smf .word .end{color:var(--c);text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:4px}\n.smf.big .word,.smf.big .opt,.smf.big .mword{text-transform:uppercase;letter-spacing:.03em}\n.smf .opts{display:grid;grid-template-columns:1fr;gap:10px;width:100%}\n.smf .opt{min-height:62px;border-radius:18px;border:3px solid var(--line);background:var(--card);font-size:24px;font-weight:900;box-shadow:0 5px 0 var(--line)}\n.smf .opt.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 5px 0 #2F8A5A}\n.smf .wrong{animation:wiggle .4s}\n.smf .hint{width:100%;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:800;line-height:1.45;text-align:left;background:#FFF6D6;color:#5A4300}\n.smf .dir{display:flex;gap:6px}\n.smf .dir button{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:900}\n.smf .dir button[aria-pressed=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.smf .ilLa{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%}\n.smf .ilLa button{min-height:90px;border-radius:22px;border:4px solid var(--line);background:var(--card);font-size:40px;font-weight:900;box-shadow:0 6px 0 var(--line)}\n.smf .ilLa button.right{background:var(--done);border-color:var(--done);color:#fff}\n.smf .mem{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%}\n.smf .mcard{aspect-ratio:3/4;perspective:600px;border:none;background:none;padding:0}\n.smf .mcard .in{position:relative;width:100%;height:100%;transition:transform .4s;transform-style:preserve-3d}\n.smf .mcard.open .in{transform:rotateY(180deg)}\n.smf .mcard .bk,.smf .mcard .fr{position:absolute;inset:0;backface-visibility:hidden;border-radius:14px;display:flex;align-items:center;justify-content:center;padding:4px}\n.smf .mcard .bk{background:var(--blue);color:#fff;font-size:28px;font-weight:900}\n.smf .mcard .fr{background:var(--card);border:4px solid var(--c);transform:rotateY(180deg);flex-direction:column;gap:2px;justify-content:space-between}\n.smf /* la piccola immagine sopra la parola */\n.mpic{width:100%;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}\n.smf .mpic svg{width:auto;height:100%;max-height:100%;overflow:visible}\n.smf .mword{font-size:16px;font-weight:900;line-height:1.15}\n.smf .mcard.done .fr{background:var(--done-bg)}\n.smf .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.smf .set{display:flex;flex-direction:column;gap:8px}\n.smf .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.smf .chips{display:flex;gap:8px;flex-wrap:wrap}\n.smf .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.smf .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n.smf .in{width:100%;min-height:48px;border-radius:12px;border:2px solid var(--line);background:var(--ground);padding:0 12px;font-size:16px;font-weight:700}\n.smf .list{display:flex;flex-direction:column;gap:6px}\n.smf .list div{background:var(--ground);border-radius:12px;padding:8px 12px;font-size:16px;font-weight:800;display:flex;justify-content:space-between}\n.smf .list button{border:none;background:none;font-size:16px}\n.smf .star{font-size:64px;animation:pop .5s ease-out}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.smf *{animation:none!important;transition:none!important}}"
export function mountFem(root: HTMLElement, opts: FemOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left\">Impostazioni (area genitore)</div>\n    <div class=\"set\"><span>✍️ Come sono scritte le parole</span><div class=\"chips\" data-key=\"caps\"></div></div>\n    <div class=\"set\"><span>🔢 Quante parole per giro</span><div class=\"chips\" data-key=\"n\"></div></div>\n    <div class=\"set\"><span>✏️ Le parole della scuola (il maschile e il femminile)</span>\n      <div class=\"row\" style=\"flex-wrap:nowrap\"><input data-k=\"mM\" class=\"in\" placeholder=\"il pittore\"><input data-k=\"mF\" class=\"in\" placeholder=\"la pittrice\"></div>\n      <button class=\"btn blue\" data-k=\"mAdd\">＋ Aggiungi</button>\n      <div class=\"list\" data-k=\"mList\"></div>\n    </div>\n    \n  </section>\n  <nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <div class=\"fams\" data-k=\"fams\"></div>\n  <section class=\"card\" data-k=\"stage\"></section>"
const __win = opts.onWin
const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };

/* ══ I personaggi, disegnati: corpo intero, viso che cambia con lo stato, braccia che cambiano con la posa ══ */
const WHO={
  boy:{skin:'#F5C9A0',hair:'#6B4226',style:'short',shirt:'#4C6EF5',legs:'#343A40'},
  boy2:{skin:'#F1C27D',hair:'#212529',style:'short',shirt:'#12B886',legs:'#495057'},
  boy3:{skin:'#C68642',hair:'#2B1B0E',style:'curly',shirt:'#FAB005',legs:'#1C3F94'},
  girl:{skin:'#F5C9A0',hair:'#D9A13B',style:'pony',shirt:'#E64980',legs:'#845EF7',skirt:true},
  girl2:{skin:'#8D5524',hair:'#1B1B1B',style:'puffs',shirt:'#7048E8',legs:'#343A40'},
  girl3:{skin:'#A0673C',hair:'#2B1B0E',style:'braids',shirt:'#FD7E14',legs:'#1C7ED6',skirt:true},
  man:{skin:'#E8B98F',hair:'#3B2A1A',style:'short',shirt:'#1C7ED6',legs:'#343A40',tall:true},
  woman:{skin:'#F1C27D',hair:'#5A3825',style:'long',shirt:'#C2255C',legs:'#495057',tall:true},
  granny:{skin:'#F2C9A6',hair:'#CED4DA',style:'bun',shirt:'#9C36B5',legs:'#5F3DC4',skirt:true,glasses:true},
  grandpa:{skin:'#EBC09A',hair:'#DEE2E6',style:'bald',shirt:'#5C7CFA',legs:'#495057',glasses:true},
  teacherW:{skin:'#F1C27D',hair:'#7F4F24',style:'bob',shirt:'#0CA678',legs:'#343A40',tall:true,glasses:true},
  teacherW2:{skin:'#F5C9A0',hair:'#C0392B',style:'bob',shirt:'#F59F00',legs:'#495057',tall:true},
  teacherM:{skin:'#C68642',hair:'#212529',style:'short',shirt:'#0B7285',legs:'#343A40',tall:true,glasses:true},
};
const EMO=(x,y,e,size)=>'<text x="'+x+'" y="'+y+'" font-size="'+size+'" text-anchor="middle" dominant-baseline="central">'+e+'</text>';
/* un personaggio, con i piedi in basso al centro di (0,0); restituisce il disegno e dove sono le mani */
function figure(who,pose,extra){
  const c=WHO[who]||WHO.boy, ink='#2B2D42';
  const s=[]; const hy=-150;                         // il centro della testa
  // le gambe e il corpo
  s.push('<rect x="-17" y="-62" width="13" height="58" rx="6" fill="'+c.legs+'"/><rect x="4" y="-62" width="13" height="58" rx="6" fill="'+c.legs+'"/>');
  s.push('<ellipse cx="-11" cy="-4" rx="11" ry="6" fill="'+ink+'"/><ellipse cx="11" cy="-4" rx="11" ry="6" fill="'+ink+'"/>');
  if(c.skirt||extra==='dress') s.push('<path d="M-26 -112 Q0 -122 26 -112 L36 -52 Q0 -44 -36 -52 Z" fill="'+(extra==='dress'?'#F783AC':c.shirt)+'"/>');
  else s.push('<rect x="-28" y="-116" width="56" height="62" rx="16" fill="'+c.shirt+'"/>');
  if(extra==='dress') s.push('<path d="M-30 -70 Q0 -62 30 -70" stroke="#fff" stroke-width="4" fill="none" stroke-dasharray="3 7" stroke-linecap="round"/>');
  // le braccia: da (±24,-106) alla mano
  const H={hold:[[-34,-62],[44,-92]],beside:[[-34,-62],[44,-70]],belly:[[-10,-78],[10,-78]],cheer:[[-46,-168],[46,-168]],thumb:[[-34,-62],[46,-130]],
    scared:[[-26,-140],[26,-140]],oops:[[-14,-176],[36,-64]],think:[[-34,-62],[4,-122]],point:[[-34,-62],[48,-178]],wave:[[-34,-62],[46,-150]],proud:[[-30,-80],[30,-80]],down:[[-34,-62],[34,-62]]};
  const hand=H[pose]||H.down, elbow=(sx,hx,hy2)=>[(sx+hx)/2+(pose==='proud'?(hx<0?-22:22):0),(-106+hy2)/2+(pose==='proud'?6:0)];
  [[-24,hand[0]],[24,hand[1]]].forEach(([sx,[hx,hy2]])=>{ const [ex,ey]=elbow(sx,hx,hy2);
    s.push('<path d="M'+sx+' -106 Q'+ex+' '+ey+' '+hx+' '+hy2+'" stroke="'+c.shirt+'" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="'+hx+'" cy="'+hy2+'" r="8" fill="'+c.skin+'"/>'); });
  // la testa
  s.push('<circle cx="-30" cy="'+hy+'" r="7" fill="'+c.skin+'"/><circle cx="30" cy="'+hy+'" r="7" fill="'+c.skin+'"/><circle cx="0" cy="'+hy+'" r="31" fill="'+c.skin+'"/>');
  // i capelli
  const hr=c.hair;
  if(c.style==='short') s.push('<path d="M-31 '+(hy-4)+' Q-30 '+(hy-36)+' 0 '+(hy-36)+' Q30 '+(hy-36)+' 31 '+(hy-4)+' Q20 '+(hy-22)+' 0 '+(hy-20)+' Q-20 '+(hy-22)+' -31 '+(hy-4)+' Z" fill="'+hr+'"/>');
  if(c.style==='curly') s.push([[-22,-24],[-8,-31],[8,-31],[22,-24],[-28,-10],[28,-10]].map(([x,y])=>'<circle cx="'+x+'" cy="'+(hy+y)+'" r="11" fill="'+hr+'"/>').join(''));
  if(c.style==='pony') s.push('<path d="M-32 '+hy+' Q-34 '+(hy-38)+' 0 '+(hy-37)+' Q34 '+(hy-38)+' 32 '+hy+' Q18 '+(hy-20)+' -4 '+(hy-22)+' Q-22 '+(hy-18)+' -32 '+hy+' Z" fill="'+hr+'"/><path d="M28 '+(hy-26)+' Q58 '+(hy-14)+' 44 '+(hy+26)+' Q40 '+(hy-2)+' 26 '+(hy-12)+' Z" fill="'+hr+'"/><circle cx="30" cy="'+(hy-22)+'" r="5" fill="#F783AC"/>');
  if(c.style==='long') s.push('<path d="M-33 '+(hy+34)+' Q-40 '+(hy-40)+' 0 '+(hy-37)+' Q40 '+(hy-40)+' 33 '+(hy+34)+' L24 '+(hy+34)+' Q26 '+(hy-14)+' 0 '+(hy-22)+' Q-26 '+(hy-14)+' -24 '+(hy+34)+' Z" fill="'+hr+'"/>');
  if(c.style==='puffs') s.push('<circle cx="-28" cy="'+(hy-26)+'" r="14" fill="'+hr+'"/><circle cx="28" cy="'+(hy-26)+'" r="14" fill="'+hr+'"/><path d="M-30 '+(hy-6)+' Q-28 '+(hy-34)+' 0 '+(hy-34)+' Q28 '+(hy-34)+' 30 '+(hy-6)+' Q0 '+(hy-22)+' -30 '+(hy-6)+' Z" fill="'+hr+'"/>');
  if(c.style==='braids') s.push('<path d="M-31 '+(hy-2)+' Q-30 '+(hy-36)+' 0 '+(hy-36)+' Q30 '+(hy-36)+' 31 '+(hy-2)+' Q0 '+(hy-24)+' -31 '+(hy-2)+' Z" fill="'+hr+'"/><path d="M-33 '+hy+' q-6 16 0 30 q-6 10 0 22" stroke="'+hr+'" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M33 '+hy+' q6 16 0 30 q6 10 0 22" stroke="'+hr+'" stroke-width="9" fill="none" stroke-linecap="round"/>');
  if(c.style==='bun') s.push('<circle cx="0" cy="'+(hy-38)+'" r="13" fill="'+hr+'"/><path d="M-32 '+hy+' Q-32 '+(hy-34)+' 0 '+(hy-34)+' Q32 '+(hy-34)+' 32 '+hy+' Q20 '+(hy-18)+' 0 '+(hy-20)+' Q-20 '+(hy-18)+' -32 '+hy+' Z" fill="'+hr+'"/>');
  if(c.style==='bald') s.push('<path d="M-31 '+(hy+4)+' Q-34 '+(hy-18)+' -22 '+(hy-22)+' L-20 '+(hy-6)+' Z M31 '+(hy+4)+' Q34 '+(hy-18)+' 22 '+(hy-22)+' L20 '+(hy-6)+' Z" fill="'+hr+'"/>');
  if(c.style==='bob') s.push('<path d="M-34 '+(hy+16)+' Q-38 '+(hy-38)+' 0 '+(hy-37)+' Q38 '+(hy-38)+' 34 '+(hy+16)+' L26 '+(hy+16)+' Q28 '+(hy-14)+' 0 '+(hy-22)+' Q-28 '+(hy-14)+' -26 '+(hy+16)+' Z" fill="'+hr+'"/>');
  if(extra==='beard') s.push('<path d="M-24 '+(hy+6)+' Q-22 '+(hy+42)+' 0 '+(hy+44)+' Q22 '+(hy+42)+' 24 '+(hy+6)+' Q14 '+(hy+20)+' 0 '+(hy+18)+' Q-14 '+(hy+20)+' -24 '+(hy+6)+' Z" fill="#F1F3F5" stroke="#CED4DA" stroke-width="2"/>');
  if(extra==='phones') s.push('<path d="M-32 '+(hy-2)+' Q-32 '+(hy-44)+' 0 '+(hy-44)+' Q32 '+(hy-44)+' 32 '+(hy-2)+'" stroke="#1C7ED6" stroke-width="6" fill="none"/><rect x="-40" y="'+(hy-12)+'" width="14" height="22" rx="6" fill="#1C7ED6"/><rect x="26" y="'+(hy-12)+'" width="14" height="22" rx="6" fill="#1C7ED6"/>');
  // il viso: gli occhi, le sopracciglia e la bocca dicono come si sente
  const F=pose; const eye=(x,blue)=>'<circle cx="'+x+'" cy="'+(hy-2)+'" r="'+(blue?5:3.6)+'" fill="'+(blue?'#228BE6':ink)+'"/>'+(blue?'<circle cx="'+x+'" cy="'+(hy-2)+'" r="2.2" fill="'+ink+'"/>':'');
  const closed=x=>'<path d="M'+(x-6)+' '+(hy-1)+' Q'+x+' '+(hy+4)+' '+(x+6)+' '+(hy-1)+'" stroke="'+ink+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  const brows=(a)=>'<path d="M-17 '+(hy-15+a)+' L-6 '+(hy-12-a)+' M6 '+(hy-12-a)+' L17 '+(hy-15+a)+'" stroke="'+ink+'" stroke-width="3" stroke-linecap="round"/>';
  if(['sleepy','dream'].includes(F)) s.push(closed(-11)+closed(11));
  else if(F==='scared') s.push('<circle cx="-11" cy="'+(hy-2)+'" r="7" fill="#fff" stroke="'+ink+'" stroke-width="2"/><circle cx="11" cy="'+(hy-2)+'" r="7" fill="#fff" stroke="'+ink+'" stroke-width="2"/><circle cx="-11" cy="'+(hy-1)+'" r="3" fill="'+ink+'"/><circle cx="11" cy="'+(hy-1)+'" r="3" fill="'+ink+'"/>');
  else s.push(eye(-11,extra==='eyes')+eye(11,extra==='eyes'));
  if(['hungry','thirsty','worried','tummy','sick','lost','oops','forgot'].includes(F)) s.push(brows(-4));
  if(F==='confused') s.push('<path d="M-17 '+(hy-15)+' L-6 '+(hy-17)+' M6 '+(hy-20)+' L17 '+(hy-14)+'" stroke="'+ink+'" stroke-width="3" stroke-linecap="round"/>');
  const mouth={
    smile:'<path d="M-11 '+(hy+11)+' Q0 '+(hy+21)+' 11 '+(hy+11)+'" stroke="'+ink+'" stroke-width="3" fill="none" stroke-linecap="round"/>',
    big:'<path d="M-13 '+(hy+9)+' Q0 '+(hy+26)+' 13 '+(hy+9)+' Z" fill="#C92A2A"/>',
    wavy:'<path d="M-11 '+(hy+15)+' q4 -5 7 0 t7 0 t7 0" stroke="'+ink+'" stroke-width="3" fill="none" stroke-linecap="round"/>',
    o:'<ellipse cx="0" cy="'+(hy+15)+'" rx="5" ry="7" fill="#C92A2A"/>',
    yawn:'<ellipse cx="0" cy="'+(hy+15)+'" rx="7" ry="9" fill="#C92A2A"/>',
    tongue:'<path d="M-9 '+(hy+12)+' Q0 '+(hy+16)+' 9 '+(hy+12)+'" stroke="'+ink+'" stroke-width="3" fill="none"/><path d="M-4 '+(hy+14)+' Q0 '+(hy+26)+' 5 '+(hy+14)+' Z" fill="#F06595"/>',
    sad:'<path d="M-10 '+(hy+18)+' Q0 '+(hy+9)+' 10 '+(hy+18)+'" stroke="'+ink+'" stroke-width="3" fill="none" stroke-linecap="round"/>',
    side:'<path d="M-6 '+(hy+16)+' L10 '+(hy+12)+'" stroke="'+ink+'" stroke-width="3" stroke-linecap="round"/>',
  };
  const M={hungry:'o',thirsty:'tongue',scared:'o',sleepy:'yawn',dream:'smile',sad:'sad',worried:'wavy',tummy:'sad',sick:'sad',confused:'side',lost:'sad',oops:'o',forgot:'o',cheer:'big',proud:'big',think:'side'}[F]||'smile';
  s.push(mouth[M]);
  if(['sick','tummy'].includes(F)) s.push('<circle cx="-18" cy="'+(hy+8)+'" r="6" fill="#B2F2BB" opacity=".9"/><circle cx="18" cy="'+(hy+8)+'" r="6" fill="#B2F2BB" opacity=".9"/>');
  else s.push('<circle cx="-19" cy="'+(hy+8)+'" r="5" fill="#FF8787" opacity=".45"/><circle cx="19" cy="'+(hy+8)+'" r="5" fill="#FF8787" opacity=".45"/>');
  if(F==='sad') s.push('<path d="M-12 '+(hy+4)+' q-3 7 0 10 q3 -3 0 -10 Z" fill="#74C0FC"/>');
  if(c.glasses) s.push('<circle cx="-11" cy="'+(hy-2)+'" r="9" fill="none" stroke="'+ink+'" stroke-width="2.5"/><circle cx="11" cy="'+(hy-2)+'" r="9" fill="none" stroke="'+ink+'" stroke-width="2.5"/><path d="M-2 '+(hy-2)+' h4" stroke="'+ink+'" stroke-width="2.5"/>');
  return {svg:s.join(''), hand:hand[1], head:[0,hy], tall:!!c.tall};
}
/* gli stati: la posa delle braccia, e quello che compare intorno (fumetto, gocce, tremolio, Zzz…) */
const STATE={hungry:'belly',thirsty:'down',scared:'scared',sleepy:'down',dream:'down',sad:'down',worried:'hold',tummy:'belly',sick:'down',confused:'think',lost:'think',oops:'oops',forgot:'oops',cheer:'cheer',proud:'proud',think:'think',friends:'down'};
function around(state,item,x,head,hand){
  const [hx,hy]=[x+head[0],head[1]], o=[];
  const bubble=(e)=>'<g><circle cx="'+(hx+52)+'" cy="'+(hy-36)+'" r="26" fill="#fff" stroke="#D6DBF2" stroke-width="3"/><circle cx="'+(hx+30)+'" cy="'+(hy-10)+'" r="6" fill="#fff" stroke="#D6DBF2" stroke-width="2"/><circle cx="'+(hx+22)+'" cy="'+(hy+2)+'" r="3.5" fill="#fff" stroke="#D6DBF2" stroke-width="2"/>'+EMO(hx+52,hy-35,e,30)+'</g>';
  if(state==='hungry'){ o.push(bubble('🍽️')); o.push('<path d="M'+(x-40)+' -86 q-8 -4 -4 -12 M'+(x+40)+' -86 q8 -4 4 -12" stroke="#E8590C" stroke-width="3" fill="none" stroke-linecap="round"/><text x="'+(x+48)+'" y="-70" font-size="14" font-weight="900" fill="#E8590C">grr</text>'); }
  if(state==='thirsty'){ o.push(bubble('💧')); o.push('<path d="M'+(hx-34)+' '+(hy-24)+' q-6 10 0 14 q6 -4 0 -14 Z" fill="#74C0FC"/><path d="M'+(hx+36)+' '+(hy-6)+' q-5 8 0 11 q5 -3 0 -11 Z" fill="#74C0FC"/>'); }
  if(state==='scared'){ o.push('<path d="M'+(x-48)+' -150 l-8 6 8 6 -8 6 M'+(x+48)+' -150 l8 6 -8 6 8 6" stroke="#868E96" stroke-width="3" fill="none" stroke-linecap="round"/>'); if(item) o.push(EMO(x+92,-150,item,46)); }
  if(state==='sleepy'){ o.push('<text x="'+(hx+34)+'" y="'+(hy-30)+'" font-size="22" font-weight="900" fill="#5C7CFA">Z</text><text x="'+(hx+50)+'" y="'+(hy-48)+'" font-size="16" font-weight="900" fill="#5C7CFA">z</text>'); }
  if(state==='dream') o.push(bubble(item||'💭'));
  if(state==='confused') o.push(bubble('❓'));
  if(state==='lost') o.push(bubble(item||'❓')+'<text x="'+(hx+74)+'" y="'+(hy-58)+'" font-size="20" font-weight="900" fill="#E03131">?</text>');
  if(state==='think') o.push(bubble(item||'❓'));
  if(state==='tummy') o.push('<path d="M'+(x-10)+' -92 q10 -8 20 0 q-10 8 -20 0" stroke="#40C057" stroke-width="3" fill="none"/>');
  if(state==='sick') o.push(EMO(hx+44,hy+20,'🤧',28)+'<circle cx="'+(hx+40)+'" cy="'+(hy-40)+'" r="3" fill="#ADB5BD"/>');
  if(state==='oops'&&item) o.push(EMO(x+76,-18,item,36)+'<path d="M'+(x+62)+' -38 l8 -10 M'+(x+80)+' -44 v-12 M'+(x+94)+' -38 l8 -10" stroke="#E8590C" stroke-width="3" stroke-linecap="round"/>');
  if(state==='forgot'&&item) o.push(bubble(item)+'<text x="'+(hx-46)+'" y="'+(hy-30)+'" font-size="26" font-weight="900" fill="#E03131">!</text>');
  if(state==='proud'&&item) o.push(EMO(x+80,-120,item,40));
  return o.join('');
}
function personScene(kind,whoList,pose,item,extra){
  const people=whoList.split(','), n=people.length, W=320, base=206;
  const xs=n===1?[item&&['beside','hold','cheer','thumb','point','proud','scared','oops'].includes(pose)?120:160]:[96,212];
  let out='<svg viewBox="0 -10 '+W+' 228" class="fig" aria-hidden="true"><ellipse cx="160" cy="'+(base+2)+'" rx="150" ry="10" fill="#C7E9C0" opacity=".7"/>';
  people.forEach((w,i)=>{ const st=STATE[pose]?pose:null, p=st?STATE[pose]:pose, f=figure(w,p,extra), sc=(f.tall?1.14:1.04)*(n>1?0.88:1);
    out+='<g transform="translate('+xs[i]+' '+base+') scale('+sc+')">'+f.svg+'</g>';
    const hx=xs[i]+f.hand[0]*sc, hy=base+f.hand[1]*sc;
    if(item&&(p==='hold'||p==='cheer'&&i===0||p==='thumb'||p==='point')){ const yy=p==='cheer'?hy-22:p==='point'?hy-34:hy-18; if(i===0||pose==='hold') out+=EMO(hx+(p==='point'?34:6),yy,item,p==='point'?40:34); }
    if(st&&(i===n-1||['hungry','scared','sleepy','friends'].includes(pose))) out+='<g transform="translate(0 '+base+') scale(1)">'+around(st,(i===n-1?item:''),xs[i],[0,-150*sc],f.hand)+'</g>';
  });
  if(item&&pose==='beside') out+=EMO(n===1?228:300,base-24,item,n===1?58:44);
  if(pose==='friends') out+='<path d="M'+(xs[0]+30)+' 134 Q154 150 '+(xs[1]-30)+' 134" stroke="#F06595" stroke-width="5" fill="none" stroke-linecap="round"/>'+EMO(154,108,'💛',22);
  return out+'</svg>';
}
function animalScene(animal,state){
  const sym={hungry:['🥣',bubbleE('🍖')],thirsty:['🥣',bubbleE('💧')]}[state]||['',''];
  return '<svg viewBox="0 0 320 200" class="fig" aria-hidden="true"><ellipse cx="160" cy="190" rx="150" ry="10" fill="#C7E9C0" opacity=".7"/>'+EMO(130,124,animal,110)+(sym[0]?EMO(232,170,sym[0],40):'')+sym[1]+'</svg>';
}
function bubbleE(e){ return '<g><circle cx="230" cy="58" r="30" fill="#fff" stroke="#D6DBF2" stroke-width="3"/><circle cx="196" cy="88" r="7" fill="#fff" stroke="#D6DBF2" stroke-width="2"/>'+EMO(230,59,e,34)+'</g>'; }

/* ══ Le parole, a famiglie. [maschile, femminile, chi lui, chi lei, cosa ha in mano] ══ */
const FAM=[
 {id:1,name:'-o → -a',col:'var(--f1)',hint:'Le parole che finiscono in -o prendono la -a.',
  w:[['il maestro','la maestra','teacherM','teacherW','📚'],['il cuoco','la cuoca','man','woman','🍳'],['il postino','la postina','man','woman','✉️'],['il bambino','la bambina','boy','girl',''],
     ['il nonno','la nonna','grandpa','granny',''],['il ballerino','la ballerina','boy2','girl3','🩰'],['il fornaio','la fornaia','man','woman','🥖'],['il contadino','la contadina','man','woman','🥕'],
     ['il cugino','la cugina','boy3','girl2',''],['il gatto','la gatta','A🐱','A🐱🎀','']]},
 {id:2,name:'-e → -essa',col:'var(--f2)',hint:'Alcune parole in -e prendono -essa.',
  w:[['il dottore','la dottoressa','man','woman','🩺'],['il professore','la professoressa','teacherM','teacherW','📐'],['lo studente','la studentessa','boy','girl','🎒'],
     ['il principe','la principessa','boy2','girl','👑'],['il campione','la campionessa','boy','girl3','🏆'],['il leone','la leonessa','A🦁','A🦁🎀','']]},
 {id:3,name:'-tore → -trice',col:'var(--f3)',hint:'Le parole in -tore diventano -trice.',
  w:[['l\'attore','l\'attrice','man','woman','🎭'],['il pittore','la pittrice','man','woman','🎨'],['lo scrittore','la scrittrice','teacherM','teacherW','✍️'],['il direttore','la direttrice','man','woman','📋'],
     ['l\'imperatore','l\'imperatrice','grandpa','granny','👑'],['il nuotatore','la nuotatrice','boy','girl','🏊'],['l\'allenatore','l\'allenatrice','man','woman','⚽']]},
 {id:4,name:'-iere → -iera',col:'var(--f4)',hint:'Le parole in -iere diventano -iera.',
  w:[['l\'infermiere','l\'infermiera','man','woman','💉'],['il cameriere','la cameriera','boy2','girl','🍽️'],['il parrucchiere','la parrucchiera','man','woman','✂️'],['il giardiniere','la giardiniera','grandpa','granny','🌷'],
     ['il pasticciere','la pasticciera','man','woman','🧁'],['il cassiere','la cassiera','teacherM','teacherW','🛒']]},
 {id:5,name:'cambia solo il/la',col:'var(--f5)',hint:'Queste parole non cambiano: cambia solo l\'articolo, il o la.',
  w:[['il cantante','la cantante','man','woman','🎤'],['il dentista','la dentista','man','woman','🦷'],['l\'insegnante','l\'insegnante','teacherM','teacherW','📚'],['il farmacista','la farmacista','man','woman','💊'],
     ['l\'artista','l\'artista','boy3','girl2','🎨'],['il giornalista','la giornalista','man','woman','📰'],['l\'autista','l\'autista','man','woman','🚌'],['il pilota','la pilota','man','woman','✈️']]},
 {id:6,name:'parole speciali',col:'var(--f6)',hint:'Queste sono diverse: si imparano una a una.',
  w:[['l\'uomo','la donna','man','woman',''],['il papà','la mamma','man','woman',''],['il fratello','la sorella','boy','girl',''],['il re','la regina','grandpa','granny','👑'],
     ['il marito','la moglie','man','woman','💍'],['il gallo','la gallina','A🐓','A🐔',''],['il toro','la mucca','A🐂','A🐄',''],['il padre','la madre','man','woman','']]},
];
const ALL=FAM.flatMap(f=>f.w.map(w=>({m:w[0],f:w[1],wm:w[2],wf:w[3],item:w[4],fam:f})));
let S=Object.assign({caps:'min',n:8},store('fem_impostazioni',{}));
const OPT={caps:[['min','minuscolo'],['MAI','MAIUSCOLO']],n:[[6,'6'],[8,'8'],[10,'10']]};

const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function speak(t){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang='it-IT'; u.rate=.85; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith('it')); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1500+t.length*95); setTimeout(()=>speechSynthesis.speak(u),80); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }

/* l'articolo e la parola */
const split=w=>{ const m=w.match(/^(il |lo |la |l')(.+)$/); return m?[m[1],m[2]]:['',w]; };
/* la parte che cambia, colorata: per maschile e femminile si confrontano le due parole */
function wordHTML(w,other,fam){
  const [art,word]=split(w), [,ow]=split(other);
  let i=0; while(i<word.length&&i<ow.length&&word[i]===ow[i]) i++;
  if(fam.id===5||word===ow) return '<span class="art end">'+art+'</span>'+word;        // cambia solo l'articolo
  if(fam.id===6||i<2) return '<span class="art">'+art+'</span><span class="end">'+word+'</span>';
  return '<span class="art">'+art+'</span>'+word.slice(0,i)+'<span class="end">'+word.slice(i)+'</span>';
}
/* il disegno di una persona (o di un animale) con la cosa in mano */
function personSVG(who,item){
  if(who.startsWith('A')){ const e=who.slice(1), bow=e.includes('🎀'), an=e.replace('🎀','');
    return '<svg viewBox="0 0 170 200" role="img"><ellipse cx="85" cy="190" rx="70" ry="8" fill="#C7E9C0" opacity=".7"/>'+EMO(85,122,an,104)+(bow?EMO(118,70,'🎀',34):'')+'</svg>'; }
  const f=figure(who,item?'hold':'down',''), sc=f.tall?1.06:0.98, base=206, x=item?72:85;
  let s='<svg viewBox="0 -10 170 228" role="img"><ellipse cx="85" cy="'+(base+2)+'" rx="72" ry="8" fill="#C7E9C0" opacity=".7"/><g transform="translate('+x+' '+base+') scale('+sc+')">'+f.svg+'</g>';
  if(item){ const hx=x+f.hand[0]*sc, hy=base+f.hand[1]*sc; s+=EMO(hx+6,hy-18,item,34); }
  return s+'</svg>';
}
/* le parole del genitore: la famiglia si riconosce dalla fine */
function famOf(m,f){ const [,a]=split(m),[,b]=split(f);
  if(a===b) return FAM[4]; if(/tore$/.test(a)&&/trice$/.test(b)) return FAM[2]; if(/iere$/.test(a)&&/iera$/.test(b)) return FAM[3];
  if(/e$/.test(a)&&/essa$/.test(b)) return FAM[1]; if(/o$/.test(a)&&/a$/.test(b)&&a.slice(0,-1)===b.slice(0,-1)) return FAM[0]; return FAM[5]; }
function words(){ return [...ALL,...store('fem_mie',[]).map(x=>{ const fam=famOf(x.m,x.f); return {m:x.m,f:x.f,wm:'man',wf:'woman',item:'',fam,mine:true}; })]; }
let famSel=0;                  // 0 = tutte le famiglie
const pool=()=>words().filter(x=>!famSel||x.fam.id===famSel);
function famBar(){ const b=$('fams'); b.innerHTML='';
  [[0,'Tutte','var(--blue)'],...FAM.map(f=>[f.id,f.name,f.col])].forEach(([id,n,c])=>{ const x=el('button','fam',n); x.style.setProperty('--c',c); x.setAttribute('aria-pressed',String(famSel===id)); x.onclick=()=>{ famSel=id; render(); }; b.appendChild(x); }); }
/* gli errori tipici, per le scelte sbagliate */
function wrongs(x){ const m=split(x.m)[1], [fa,fw]=split(x.f);
  const cand=[m.replace(/[oe]$/,'a'), /e$/.test(m)?m.slice(0,-1)+'essa':'', m.replace(/tore$/,'trice'), m.replace(/iere$/,'iera'), m, m.replace(/o$/,'essa'), m.replace(/a$/,'essa'), m.replace(/ista$/,'isto'), m.replace(/nte$/,'nta')].filter(w=>w&&!/essaessa|oessa/.test(w));
  return shuffle([...new Set(cand)].filter(w=>w!==fw&&w.length>2)).slice(0,2).map(w=>fa+w); }
function wrongsM(x){ const f=split(x.f)[1], [ma,mw]=split(x.m);
  const cand=[f.replace(/essa$/,'o'), f.replace(/a$/,'o'), f.replace(/trice$/,'tore'), f.replace(/a$/,'e'), f.replace(/essa$/,'e'), f.replace(/iera$/,'iero'), f];
  return shuffle([...new Set(cand)].filter(w=>w!==mw&&w.length>2)).slice(0,2).map(w=>ma+w); }

/* ── 👀 Scopri: le coppie, una alla volta ── */
let di=0;
function discover(){
  hush(); const st=$('stage'); st.innerHTML=''; const list=pool(); if(!list.length) return; di=di%list.length;
  const x=list[di], c=x.fam.col;
  const rule=el('div','rule',x.fam.name+'<small>'+x.fam.hint+'</small>'); rule.style.setProperty('--c',c);
  const pair=el('div','pair'); pair.style.setProperty('--c',c);
  const pm=el('button','person',personSVG(x.wm,x.item)+'<div class="word">'+wordHTML(x.m,x.f,x.fam)+'</div>'), pf=el('button','person',personSVG(x.wf,x.item)+'<div class="word">'+wordHTML(x.f,x.m,x.fam)+'</div>');
  pm.onclick=()=>speak(x.m); pf.onclick=()=>speak(x.f);
  pair.append(pm,el('div','arrow','→'),pf);
  const nav=el('div','row'), pv=el('button','btn','← Prima'), nx=el('button','btn blue','Dopo →');
  pv.onclick=()=>{ di=(di-1+list.length)%list.length; discover(); }; nx.onclick=()=>{ di=(di+1)%list.length; discover(); }; nav.append(pv,nx);
  st.append(rule,pair,el('p','sub','Tocca un personaggio per sentire la parola.'),nav);
  speak(x.m+', '+x.f);
}

/* ── 🔄 Trasforma! Dal maschile al femminile (o al contrario), con il mazzo senza ripetizioni e i ripassi ── */
let dirF=true;
function draw(n){
  const list=pool(), key=String(famSel), decks=store('fem_mazzo',{}); let d=decks[key]||{order:[],pos:0}; const ids=list.map(x=>x.m+'|'+x.f), out=[];
  while(out.length<Math.min(n,list.length)){ if(d.pos>=d.order.length||!d.order.every(i=>ids.includes(i))) d={order:shuffle(ids),pos:0}; const id=d.order[d.pos++]; if(!out.includes(id)) out.push(id); }
  decks[key]=d; keepS('fem_mazzo',decks);
  const rev=store('fem_ripasso',[]).filter(r=>ids.includes(r)&&!out.includes(r)).slice(0,2);
  return [...rev,...out].slice(0,n).map(id=>list.find(x=>x.m+'|'+x.f===id));
}
function transform(){
  hush(); const my=alive; const st=$('stage'); const qs=draw(S.n); let qi=0, score=0; const missed=[];
  const next=()=>{ if(my!==alive) return; st.innerHTML='';
    if(qi>=qs.length){ __win&&__win(); st.append(el('div','star','⭐'),el('p','ask',score===qs.length?'Perfetto!':'Bravo! '+score+' su '+qs.length+' al primo colpo.'));
      if(missed.length){ st.appendChild(el('p','sub','Da ripassare: '+missed.map(x=>x.m+' → '+x.f).join(' · '))); }
      const b=el('button','btn main','🔄 Un altro giro'); b.onclick=transform; st.appendChild(b); speak('Bravo!'); return; }
    const x=qs[qi], c=x.fam.col, from=dirF?x.m:x.f, to=dirF?x.f:x.m; let tries=0, done=false;
    const dir=el('div','dir'); [[true,'♂ → ♀ al femminile'],[false,'♀ → ♂ al maschile']].forEach(([v,l])=>{ const b=el('button','',l); b.setAttribute('aria-pressed',String(dirF===v)); b.onclick=()=>{ dirF=v; transform(); }; dir.appendChild(b); });
    const dots=el('div','dots'); qs.forEach((_,i)=>dots.appendChild(el('span',i<qi?(missed.includes(qs[i])?'ko':'ok'):i===qi?'on':'')));
    const p=el('div','person',personSVG(dirF?x.wm:x.wf,x.item)+'<div class="word">'+wordHTML(from,to,x.fam)+'</div>'); p.style.cssText='max-width:220px;--c:'+c;
    const hint=el('div','hint',''); hint.hidden=true;
    const opts=el('div','opts'); opts.style.setProperty('--c',c);
    shuffle([to,...(dirF?wrongs(x):wrongsM(x))]).forEach(o=>{ const b=el('button','opt',o);
      b.onclick=async()=>{ if(done) return;
        if(o===to){ done=true; b.classList.add('right'); if(!tries) score++; keepS('fem_ripasso',store('fem_ripasso',[]).filter(r=>r!==x.m+'|'+x.f));
          const r=el('div','rule',x.fam.name+'<small>'+x.m+' → '+x.f+'</small>'); r.style.setProperty('--c',c); st.insertBefore(r,opts);
          await speak(from+', '+to); await wait(700); qi++; next(); }
        else { tries++; wiggle(b); if(!missed.includes(x)){ missed.push(x); const R=store('fem_ripasso',[]); if(!R.includes(x.m+'|'+x.f)) R.push(x.m+'|'+x.f); keepS('fem_ripasso',R.slice(-20)); }
          hint.hidden=false; hint.innerHTML='💡 '+x.fam.hint+(x.fam.id===6?' Prova con: <b>'+to+'</b>.':''); speak('Quasi! Guarda la fine della parola.'); } };
      opts.appendChild(b); });
    st.append(dir,dots,el('p','ask',dirF?'Come si dice al femminile?':'Come si dice al maschile?'),p,hint,opts);
    speak(from+'. '+(dirF?'Al femminile?':'Al maschile?'));
  };
  next();
}

/* ── 🃏 Memory: il maschile e il femminile, con il colore della famiglia ── */
function memory(){
  hush(); const st=$('stage'); st.innerHTML=''; const r=alive;
  const ps=shuffle(pool()).slice(0,6), cards=shuffle(ps.flatMap(x=>[{x,w:x.m},{x,w:x.f}])); let open=[], found=0, busy=false;
  const g=el('div','mem');
  cards.forEach(c=>{ const male=c.w===c.x.m;
    const b=el('button','mcard','<div class="in"><div class="bk">?</div><div class="fr"><div class="mpic">'+personSVG(male?c.x.wm:c.x.wf,c.x.item)+'</div><span class="mword">'+c.w+'</span></div></div>'); b.style.setProperty('--c',c.x.fam.col); c.el=b;
    b.onclick=async()=>{ if(busy||r!==alive||b.classList.contains('open')) return; b.classList.add('open'); open.push(c); speak(c.w);
      if(open.length<2) return; busy=true; const [a,d]=open; open=[];
      if(a.x===d.x&&a.w!==d.w){ await wait(300); a.el.classList.add('done'); d.el.classList.add('done'); found++; await speak(a.x.m+', '+a.x.f);
        if(found===ps.length){ st.innerHTML=''; __win&&__win(); st.append(el('div','star','⭐'),el('p','ask','Hai trovato tutte le coppie!')); const bb=el('button','btn main','🔄 Ancora'); bb.onclick=memory; st.appendChild(bb); } }
      else { await wait(1000); a.el.classList.remove('open'); d.el.classList.remove('open'); }
      busy=false; };
    g.appendChild(b); });
  st.append(el('p','ask','Trova le coppie: lui e lei'),el('p','sub','Il colore del bordo è quello della famiglia.'),g);
}

/* ── 🏷️ Il o la? Per le parole che non cambiano, guardando il disegno ── */
function article(){
  hush(); const my=alive; const st=$('stage'); const list=shuffle(words().filter(x=>x.fam.id===5)); const qs=list.flatMap(x=>[[x,true],[x,false]]); const Q=shuffle(qs).slice(0,S.n); let qi=0;
  const next=()=>{ if(my!==alive) return; st.innerHTML='';
    if(qi>=Q.length){ __win&&__win(); st.append(el('div','star','⭐'),el('p','ask','Bravo! Il o la, li sai tutti!')); const b=el('button','btn main','🔄 Ancora'); b.onclick=article; st.appendChild(b); speak('Bravo!'); return; }
    const [x,male]=Q[qi], w=male?x.m:x.f, [art,word]=split(w), elided=art==='l\''; let done=false;
    const dots=el('div','dots'); Q.forEach((_,i)=>dots.appendChild(el('span',i<qi?'ok':i===qi?'on':'')));
    const p=el('div','person',personSVG(male?x.wm:x.wf,x.item)+'<div class="word">___ '+word+'</div>'); p.style.maxWidth='220px';
    const g=el('div','ilLa'); const right=elided?(male?'un':'un\''):(male?'il':'la');
    (elided?['un','un\'']:['il','la']).forEach(a=>{ const b=el('button','',a); b.onclick=async()=>{ if(done) return;
      if(a===right){ done=true; b.classList.add('right'); await speak((elided?a+(a==='un'?' ':''):a+' ')+word); await wait(500); qi++; next(); }
      else { wiggle(b); speak('Guarda il disegno: è '+(male?'un uomo':'una donna')+'?'); } }; g.appendChild(b); });
    st.append(dots,el('p','ask',elided?'Un o un\'? Guarda il disegno!':'Il o la? Guarda il disegno!'),p,g,el('p','sub',elided?'Davanti alla vocale: <b>un</b> per lui, <b>un\'</b> per lei.':'La parola non cambia: cambia solo l\'articolo.'));
    speak(elided?'Un o un\'?':'Il o la?');
  };
  next();
}

/* ── schede e impostazioni ── */
const TABS=[['👀 Scopri',discover],['🔄 Trasforma!',transform],['🃏 Memory',memory],['🏷️ Il o la?',article]];
let tab=0;
function render(){ const t=$('tabs'); t.innerHTML=''; TABS.forEach(([l],i)=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(i===tab)); b.onclick=()=>{ tab=i; render(); }; t.appendChild(b); });
  $('fams').hidden=tab===3; famBar(); TABS[tab][1](); }
function chips(){ root.querySelectorAll('[data-k="panel"] .chips[data-key]').forEach(box=>{ const k=box.dataset.key; box.innerHTML='';
  OPT[k].forEach(([v,l])=>{ const c=el('button','chip',l); c.setAttribute('aria-pressed',String(S[k]===v)); c.onclick=()=>{ S[k]=v; keepS('fem_impostazioni',S); chips(); root.classList.toggle('big',S.caps==='MAI'); }; box.appendChild(c); }); }); }
function mine(){ const L=$('mList'); L.innerHTML=''; store('fem_mie',[]).forEach((x,i)=>{ const d=el('div','','<span>'+x.m+' → '+x.f+' <small style="color:var(--soft)">('+famOf(x.m,x.f).name+')</small></span>'); const b=el('button','','✕'); b.setAttribute('aria-label','togli'); b.onclick=()=>{ const a=store('fem_mie',[]); a.splice(i,1); keepS('fem_mie',a); mine(); }; d.appendChild(b); L.appendChild(d); }); }
$('mAdd').onclick=()=>{ const m=$('mM').value.trim().toLowerCase(), f=$('mF').value.trim().toLowerCase(); if(!m||!f) return; const a=store('fem_mie',[]); a.push({m,f}); keepS('fem_mie',a); $('mM').value=''; $('mF').value=''; mine(); };
root.classList.toggle('big',S.caps==='MAI');
if(opts.mode==='parent'){ $('panel').hidden=false; $('tabs').hidden=true; $('fams').hidden=true; $('stage').hidden=true; chips(); mine(); }
else { if(opts.allowSettings){ $('panel').hidden=false; chips(); mine(); } render(); }
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
