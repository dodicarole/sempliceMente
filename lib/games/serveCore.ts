// @ts-nocheck
/*
 * 🔧 A cosa serve? / À quoi ça sert ? Gli oggetti e il loro uso, in italiano e in francese (la lingua dell'app):
 * Scopri, Con che cosa?, A cosa serve?, Dove va?, L'intruso. 25 oggetti in 5 luoghi, più quelli del genitore.
 * Lo stesso codice del prototipo già provato, dentro un contenitore con la classe "sma".
 * Mazzo, oggetti del genitore e impostazioni sono per figlio (chiavi serve_* in lib/childStore.ts).
 */
export interface ServeOptions { lang?: 'it' | 'fr'; mode?: 'child' | 'parent'; allowSettings?: boolean; onWin?: () => void }
export const SERVE_CSS = ".sma{--ground:#EDF0FB;--card:#FFFFFF;--text:#1F2147;--soft:#545B88;--line:#D6DBF2;--done:#2A7A4F;--done-bg:#E6F6EE;--blue:#5468D8;--radius:22px;\n  box-sizing:border-box}\n\n.sma *{box-sizing:border-box}\n.sma{margin:0;background:var(--ground);color:var(--text);font-family:ui-rounded,\"SF Pro Rounded\",system-ui,-apple-system,\"Segoe UI\",sans-serif;-webkit-tap-highlight-color:transparent}\n.sma button,.sma input,.sma select{font-family:inherit;color:inherit}\n.sma button{cursor:pointer;touch-action:manipulation}\n.sma button:focus-visible{outline:4px solid #FFC93C;outline-offset:3px}\n.sma [hidden]{display:none!important}\n.sma .app{max-width:540px;margin:0 auto;padding:14px 16px 40px;display:flex;flex-direction:column;gap:14px}\n.sma .title{background:var(--card);border-radius:var(--radius);padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:8px}\n.sma .title .l{display:flex;align-items:center;gap:10px}\n.sma .title .em{font-size:34px}\n.sma .title h1{margin:0;font-size:21px;font-weight:900}\n.sma .title p{margin:2px 0 0;font-size:13px;font-weight:700;color:var(--soft)}\n.sma .tbtns{display:flex;gap:6px}\n.sma .sq{flex:none;min-width:46px;height:46px;border-radius:14px;border:2px solid var(--line);background:var(--ground);font-size:20px;padding:0 8px}\n.sma .buddy{display:flex;align-items:center;gap:10px;background:none;border:none;padding:0;text-align:left}\n.sma .buddy .av{width:50px;height:50px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-size:24px;border:3px solid #0B7285;background:#fff}\n.sma .buddy .bb{background:var(--card);border-radius:16px;padding:10px 14px;font-size:15px;font-weight:700;line-height:1.35}\n.sma .buddy .bb b{display:block;font-size:13px;font-weight:900;color:#0B7285}\n.sma .tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}\n.sma .tab{min-height:54px;border-radius:14px;border:2px solid var(--line);background:var(--card);font-size:14px;font-weight:800;padding:0 4px;line-height:1.2}\n.sma .tab[aria-current=\"true\"]{background:var(--blue);border-color:var(--blue);color:#fff}\n.sma .places{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px}\n.sma .pl{flex:none;min-height:44px;padding:0 12px;border-radius:999px;border:3px solid var(--c);background:var(--card);color:var(--c);font-size:14px;font-weight:900}\n.sma .pl[aria-pressed=\"true\"]{background:var(--c);color:#fff}\n.sma .card{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px;align-items:center;text-align:center}\n.sma .ask{margin:0;font-size:21px;font-weight:900;line-height:1.3}\n.sma .sub{margin:0;font-size:15px;font-weight:700;color:var(--soft);line-height:1.45}\n.sma .btn{min-height:54px;padding:0 18px;border-radius:16px;border:2px solid var(--line);background:var(--card);font-size:17px;font-weight:800}\n.sma .btn.main{background:var(--done);border-color:var(--done);color:#fff}\n.sma .btn.blue{background:var(--blue);border-color:var(--blue);color:#fff}\n.sma .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;width:100%}\n.sma .dots{display:flex;gap:6px}\n.sma .dots span{width:9px;height:9px;border-radius:50%;background:var(--line)}\n.sma .dots .on{background:var(--blue);width:20px;border-radius:5px}\n.sma .dots .ok{background:var(--done)}\n.sma .dots .ko{background:#FFA94D}\n.sma.big .tx,.sma.big .sent,.sma.big .name{text-transform:uppercase;letter-spacing:.03em}\n.sma /* l'oggetto e la sua azione */\n.scene{width:100%;border-radius:22px;background:linear-gradient(180deg,#E3F0FC,#FFF6E6);padding:44px 10px 16px;display:flex;align-items:center;justify-content:center;gap:12px;position:relative}\n.sma .scene .obj{font-size:84px;line-height:1;animation:pop .5s ease-out}\n.sma .scene .arr{font-size:36px;font-weight:900;color:var(--c)}\n.sma .scene .act{font-size:58px;line-height:1;background:#fff;border-radius:22px;padding:12px 14px;box-shadow:0 4px 0 rgba(31,33,71,.1)}\n.sma .badge{position:absolute;left:10px;top:10px;font-size:13px;font-weight:900;color:#fff;background:var(--c);border-radius:999px;padding:4px 10px}\n.sma .sent{font-size:25px;font-weight:900;line-height:1.35}\n.sma .sent .k{color:var(--c);text-decoration:underline;text-decoration-thickness:3px;text-underline-offset:5px}\n.sma .choices{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%}\n.sma .choices.two{grid-template-columns:repeat(2,1fr)}\n.sma .ch{min-height:120px;border-radius:20px;border:3px solid var(--line);background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px 4px;box-shadow:0 5px 0 var(--line)}\n.sma .ch .e{font-size:48px;line-height:1}\n.sma .ch .tx{font-size:15px;font-weight:900;line-height:1.2}\n.sma .ch.right{background:var(--done);border-color:var(--done);color:#fff;box-shadow:0 5px 0 #2F8A5A}\n.sma .wrong{animation:wiggle .4s}\n.sma .hint{width:100%;border-radius:14px;padding:10px 12px;font-size:15px;font-weight:800;line-height:1.45;background:#FFF6D6;color:#5A4300}\n.sma .rooms{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%}\n.sma .room{min-height:80px;border-radius:20px;border:4px solid var(--c);background:var(--card);color:var(--c);font-size:17px;font-weight:900;display:flex;align-items:center;justify-content:center;gap:8px}\n.sma .room .e{font-size:32px}\n.sma .room.right{background:var(--c);color:#fff}\n.sma .panel{background:var(--card);border-radius:var(--radius);padding:16px;display:flex;flex-direction:column;gap:14px}\n.sma .set{display:flex;flex-direction:column;gap:8px}\n.sma .set>span{font-size:15px;font-weight:700;color:var(--soft)}\n.sma .chips{display:flex;gap:8px;flex-wrap:wrap}\n.sma .chip{min-height:44px;padding:0 12px;border-radius:12px;border:2px solid var(--line);background:var(--ground);font-size:15px;font-weight:800}\n.sma .chip[aria-pressed=\"true\"]{background:var(--done);border-color:var(--done);color:#fff}\n.sma .in{width:100%;min-height:46px;border-radius:12px;border:2px solid var(--line);background:var(--ground);padding:0 12px;font-size:16px;font-weight:700}\n.sma .list{display:flex;flex-direction:column;gap:6px}\n.sma .list div{background:var(--ground);border-radius:12px;padding:8px 12px;font-size:15px;font-weight:800;display:flex;justify-content:space-between;gap:8px}\n.sma .list button{border:none;background:none;font-size:16px}\n.sma .star{font-size:64px;animation:pop .5s ease-out}\n@keyframes pop{0%{transform:scale(.6)}60%{transform:scale(1.1)}100%{transform:scale(1)}}\n@keyframes wiggle{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}\n@media (prefers-reduced-motion:reduce){.sma *{animation:none!important;transition:none!important}}"
export function mountServe(root: HTMLElement, opts: ServeOptions = {}): () => void {
  root.innerHTML = "<section class=\"panel\" data-k=\"panel\" hidden>\n    <div class=\"ask\" style=\"text-align:left\" data-k=\"pTitle\"></div>\n    <div class=\"set\"><span data-k=\"pChoices\"></span><div class=\"chips\" data-key=\"n\"></div></div>\n    <div class=\"set\"><span data-k=\"pCaps\"></span><div class=\"chips\" data-key=\"caps\"></div></div>\n    <div class=\"set\"><span data-k=\"pMine\"></span>\n      <div class=\"row\" style=\"flex-wrap:nowrap\"><input data-k=\"mE\" class=\"in\" style=\"max-width:70px;text-align:center\" placeholder=\"🧸\"><input data-k=\"mO\" class=\"in\"></div>\n      <div class=\"row\" style=\"flex-wrap:nowrap\"><input data-k=\"mA\" class=\"in\" style=\"max-width:70px;text-align:center\" placeholder=\"🤗\"><input data-k=\"mS\" class=\"in\"></div>\n      <div class=\"chips\" data-k=\"mPlace\"></div>\n      <button class=\"btn blue\" data-k=\"mAdd\"></button>\n      <div class=\"list\" data-k=\"mList\"></div>\n    </div>\n    \n  </section>\n  <nav class=\"tabs\" data-k=\"tabs\"></nav>\n  <div class=\"places\" data-k=\"places\"></div>\n  <section class=\"card\" data-k=\"stage\"></section>"
const store=(k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch(e){ return d; } };
const keepS=(k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} };

/* ── I luoghi, ognuno con il suo colore ── */
const PLACES=[
  {id:'scuola',e:'🎒',c:'#1C7ED6',it:'La scuola',fr:'L’école',in:{it:'a scuola',fr:'à l’école'}},
  {id:'cucina',e:'🍽️',c:'#E8590C',it:'La cucina',fr:'La cuisine',in:{it:'in cucina',fr:'dans la cuisine'}},
  {id:'bagno',e:'🛁',c:'#0B7285',it:'Il bagno',fr:'La salle de bain',in:{it:'in bagno',fr:'dans la salle de bain'}},
  {id:'casa',e:'🏠',c:'#7048E8',it:'La casa',fr:'La maison',in:{it:'in casa',fr:'à la maison'}},
  {id:'fuori',e:'🌦️',c:'#2F9E44',it:'Fuori',fr:'Dehors',in:{it:'fuori',fr:'dehors'}},
];
const P=id=>PLACES.find(p=>p.id===id);
/* ── Gli oggetti: emoji, luogo, l'azione (emoji), e per ogni lingua: nome, azione, frase con la parola chiave tra [ ], domanda "con che cosa?" ── */
const OBJ=[
 ['✏️','scuola','✍️',{o:'la matita',a:'scrivere',s:'La matita serve a [scrivere].',q:'Con che cosa scrivo?'},{o:'le crayon',a:'écrire',s:'Le crayon sert à [écrire].',q:'Avec quoi j’écris ?'}],
 ['✂️','scuola','📄',{o:'le forbici',a:'tagliare la carta',s:'Le forbici servono a [tagliare] la carta.',q:'Con che cosa taglio la carta?'},{o:'les ciseaux',a:'couper le papier',s:'Les ciseaux servent à [couper] le papier.',q:'Avec quoi je coupe le papier ?'}],
 ['📏','scuola','📐',{o:'il righello',a:'tracciare le linee',s:'Il righello serve a [tracciare] le linee dritte.',q:'Con che cosa traccio una linea dritta?'},{o:'la règle',a:'tracer des lignes',s:'La règle sert à [tracer] des lignes droites.',q:'Avec quoi je trace une ligne droite ?'}],
 ['📖','scuola','👀',{o:'il libro',a:'leggere',s:'Il libro serve a [leggere] le storie.',q:'Che cosa uso per leggere una storia?'},{o:'le livre',a:'lire',s:'Le livre sert à [lire] des histoires.',q:'Avec quoi je lis une histoire ?'}],
 ['🖌️','scuola','🎨',{o:'il pennello',a:'dipingere',s:'Il pennello serve a [dipingere].',q:'Con che cosa dipingo?'},{o:'le pinceau',a:'peindre',s:'Le pinceau sert à [peindre].',q:'Avec quoi je peins ?'}],
 ['🎒','scuola','📚',{o:'lo zaino',a:'portare i libri',s:'Lo zaino serve a [portare] i libri.',q:'Con che cosa porto i libri a scuola?'},{o:'le cartable',a:'porter les livres',s:'Le cartable sert à [porter] les livres.',q:'Avec quoi je porte mes livres ?'}],
 ['🥛','cucina','😋',{o:'il bicchiere',a:'bere',s:'Il bicchiere serve a [bere].',q:'Con che cosa bevo l’acqua?'},{o:'le verre',a:'boire',s:'Le verre sert à [boire].',q:'Avec quoi je bois de l’eau ?'}],
 ['🥄','cucina','🥣',{o:'il cucchiaio',a:'mangiare la minestra',s:'Il cucchiaio serve a [mangiare] la minestra.',q:'Con che cosa mangio la minestra?'},{o:'la cuillère',a:'manger la soupe',s:'La cuillère sert à [manger] la soupe.',q:'Avec quoi je mange la soupe ?'}],
 ['🍲','cucina','🔥',{o:'la pentola',a:'cuocere',s:'La pentola serve a [cuocere] la pasta.',q:'Con che cosa cuocio la pasta?'},{o:'la casserole',a:'faire cuire',s:'La casserole sert à [faire cuire] les pâtes.',q:'Avec quoi je fais cuire les pâtes ?'}],
 ['🍽️','cucina','🍝',{o:'il piatto',a:'metterci il cibo',s:'Il piatto serve a [metterci] il cibo.',q:'Dove metto la pasta per mangiarla?'},{o:'l’assiette',a:'mettre la nourriture',s:'L’assiette sert à [mettre] la nourriture.',q:'Où je mets les pâtes pour les manger ?'}],
 ['🪥','bagno','😁',{o:'lo spazzolino',a:'lavare i denti',s:'Lo spazzolino serve a [lavare] i denti.',q:'Con che cosa lavo i denti?'},{o:'la brosse à dents',a:'se brosser les dents',s:'La brosse à dents sert à se [brosser] les dents.',q:'Avec quoi je me brosse les dents ?'}],
 ['🧼','bagno','🙌',{o:'il sapone',a:'lavare le mani',s:'Il sapone serve a [lavare] le mani.',q:'Con che cosa lavo le mani?'},{o:'le savon',a:'se laver les mains',s:'Le savon sert à se [laver] les mains.',q:'Avec quoi je me lave les mains ?'}],
 ['🪮','bagno','💇',{o:'il pettine',a:'pettinarsi',s:'Il pettine serve a [pettinare] i capelli.',q:'Con che cosa mi pettino?'},{o:'le peigne',a:'se coiffer',s:'Le peigne sert à se [coiffer].',q:'Avec quoi je me coiffe ?'}],
 ['🪞','bagno','😊',{o:'lo specchio',a:'guardarsi',s:'Lo specchio serve a [guardarsi].',q:'Dove mi guardo per vedere la mia faccia?'},{o:'le miroir',a:'se regarder',s:'Le miroir sert à se [regarder].',q:'Où je me regarde pour voir mon visage ?'}],
 ['🛏️','casa','😴',{o:'il letto',a:'dormire',s:'Il letto serve a [dormire].',q:'Dove dormo la notte?'},{o:'le lit',a:'dormir',s:'Le lit sert à [dormir].',q:'Où je dors la nuit ?'}],
 ['🔑','casa','🚪',{o:'la chiave',a:'aprire la porta',s:'La chiave serve ad [aprire] la porta.',q:'Con che cosa apro la porta?'},{o:'la clé',a:'ouvrir la porte',s:'La clé sert à [ouvrir] la porte.',q:'Avec quoi j’ouvre la porte ?'}],
 ['💡','casa','🌟',{o:'la lampada',a:'fare luce',s:'La lampada serve a fare [luce].',q:'Che cosa accendo quando è buio?'},{o:'la lampe',a:'éclairer',s:'La lampe sert à [éclairer].',q:'Qu’est-ce que j’allume quand il fait noir ?'}],
 ['🧹','casa','✨',{o:'la scopa',a:'pulire il pavimento',s:'La scopa serve a [pulire] il pavimento.',q:'Con che cosa pulisco il pavimento?'},{o:'le balai',a:'balayer le sol',s:'Le balai sert à [balayer] le sol.',q:'Avec quoi je balaie le sol ?'}],
 ['📞','casa','🗣️',{o:'il telefono',a:'telefonare',s:'Il telefono serve a [telefonare].',q:'Con che cosa chiamo la nonna?'},{o:'le téléphone',a:'téléphoner',s:'Le téléphone sert à [téléphoner].',q:'Avec quoi j’appelle mamie ?'}],
 ['⏰','casa','🕒',{o:'l’orologio',a:'sapere l’ora',s:'L’orologio serve a sapere l’[ora].',q:'Che cosa guardo per sapere che ore sono?'},{o:'l’horloge',a:'savoir l’heure',s:'L’horloge sert à savoir l’[heure].',q:'Qu’est-ce que je regarde pour savoir l’heure ?'}],
 ['☂️','fuori','🌧️',{o:'l’ombrello',a:'ripararsi dalla pioggia',s:'L’ombrello serve a [ripararsi] dalla pioggia.',q:'Che cosa prendo quando piove?'},{o:'le parapluie',a:'se protéger de la pluie',s:'Le parapluie sert à se [protéger] de la pluie.',q:'Qu’est-ce que je prends quand il pleut ?'}],
 ['🧤','fuori','❄️',{o:'i guanti',a:'scaldare le mani',s:'I guanti servono a [scaldare] le mani.',q:'Che cosa metto quando ho freddo alle mani?'},{o:'les gants',a:'avoir chaud aux mains',s:'Les gants servent à avoir [chaud] aux mains.',q:'Qu’est-ce que je mets quand j’ai froid aux mains ?'}],
 ['🕶️','fuori','☀️',{o:'gli occhiali da sole',a:'proteggere gli occhi',s:'Gli occhiali da sole servono a [proteggere] gli occhi.',q:'Che cosa metto quando il sole è forte?'},{o:'les lunettes de soleil',a:'protéger les yeux',s:'Les lunettes de soleil servent à [protéger] les yeux.',q:'Qu’est-ce que je mets quand le soleil est fort ?'}],
 ['🧣','fuori','🥶',{o:'la sciarpa',a:'tenere caldo il collo',s:'La sciarpa serve a tenere [caldo] il collo.',q:'Che cosa metto intorno al collo quando fa freddo?'},{o:'l’écharpe',a:'garder le cou au chaud',s:'L’écharpe sert à garder le cou au [chaud].',q:'Qu’est-ce que je mets autour du cou quand il fait froid ?'}],
 ['🥾','fuori','💦',{o:'gli stivali',a:'camminare nelle pozzanghere',s:'Gli stivali servono a [camminare] nelle pozzanghere.',q:'Che cosa metto per saltare nelle pozzanghere?'},{o:'les bottes',a:'marcher dans les flaques',s:'Les bottes servent à [marcher] dans les flaques.',q:'Qu’est-ce que je mets pour sauter dans les flaques ?'}],
];
/* plurale? (le forbici, gli occhiali, les ciseaux…) */
const PL=o=>L==='it'?/^(i |gli |le )/i.test(o):/^les /i.test(o);
/* ── I testi dell'interfaccia, nelle due lingue ── */
const T={
 it:{h1:'A cosa serve?',hsub:'Gli oggetti e il loro uso',bud:'Ogni oggetto ha il suo lavoro: scopriamo a cosa serve!',tabs:['👀 Scopri','🔎 Con che cosa?','❓ A cosa serve?','🏠 Dove va?','🕵️ L’intruso'],all:'Tutti',prev:'← Prima',next:'Dopo →',
   tapHint:'Tocca l’oggetto per sentire la frase.',useQ:o=>(PL(o)?'A cosa servono ':'A cosa serve ')+o+'?',roomQ:o=>(PL(o)?'Dove vanno ':'Dove va ')+o+'?',oddQ:p=>'Quale non va '+p+'?',again:'🔄 Ancora',bravo:'Bravo!',done:(a,b)=>'Bravo! '+a+' su '+b+' al primo colpo.',
   tryAgain:'Quasi! Riprova.',hintUse:s=>'💡 '+s,hintOdd:(o,p)=>'💡 '+o+(PL(o)?' vanno ':' va ')+p+'.',pTitle:'Impostazioni (area genitore)',pChoices:'Quante risposte tra cui scegliere',pCaps:'Come sono scritte le parole',
   pMine:'✏️ Aggiungi un oggetto: emoji, nome, e a cosa serve',mO:'il pallone',mA:'giocare',mS:'Il pallone serve a giocare.',mAdd:'＋ Aggiungi',close:'Chiudi',min:'minuscolo',mai:'MAIUSCOLO'},
 fr:{h1:'À quoi ça sert ?',hsub:'Les objets et leur usage',bud:'Chaque objet a son travail : découvrons à quoi il sert !',tabs:['👀 Découvre','🔎 Avec quoi ?','❓ À quoi ça sert ?','🏠 Où va-t-il ?','🕵️ L’intrus'],all:'Tous',prev:'← Avant',next:'Après →',
   tapHint:'Touche l’objet pour écouter la phrase.',useQ:o=>(PL(o)?'À quoi servent ':'À quoi sert ')+o+' ?',roomQ:o=>(PL(o)?'Où vont ':'Où va ')+o+' ?',oddQ:p=>'Lequel ne va pas '+p+' ?',again:'🔄 Encore',bravo:'Bravo !',done:(a,b)=>'Bravo ! '+a+' sur '+b+' du premier coup.',
   tryAgain:'Presque ! Essaie encore.',hintUse:s=>'💡 '+s,hintOdd:(o,p)=>'💡 '+o+(PL(o)?' vont ':' va ')+p+'.',pTitle:'Réglages (espace parent)',pChoices:'Combien de réponses au choix',pCaps:'Comment les mots sont écrits',
   pMine:'✏️ Ajouter un objet : emoji, nom, et à quoi il sert',mO:'le ballon',mA:'jouer',mS:'Le ballon sert à jouer.',mAdd:'＋ Ajouter',close:'Fermer',min:'minuscules',mai:'MAJUSCULES'},
};
let L=opts.lang==='fr'?'fr':'it', S=Object.assign({n:3,caps:'min'},store('serve_impostazioni',{}));
const $=id=>root.querySelector('[data-k="'+id+'"]');
const el=(t,c,h)=>{const e=document.createElement(t); if(c) e.className=c; if(h!==undefined) e.innerHTML=h; return e;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
function wiggle(e){ e.classList.remove('wrong'); void e.offsetWidth; e.classList.add('wrong'); }
const keep=[]; let alive=0;
function speak(t){ return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); let d=false; const fin=()=>{ if(!d){d=true;res();} };
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t.replace(/[\[\]]/g,'')); u.lang=L==='fr'?'fr-FR':'it-IT'; u.rate=.85; const v=speechSynthesis.getVoices().find(v=>v.lang.startsWith(L)); if(v) u.voice=v;
    u.onend=fin; u.onerror=fin; keep.push(u); if(keep.length>20) keep.shift(); setTimeout(fin,1500+t.length*95); setTimeout(()=>speechSynthesis.speak(u),80); }catch(e){ fin(); } }); }
function hush(){ alive++; try{speechSynthesis.cancel()}catch(e){} }
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
/* tutti gli oggetti nella lingua scelta (compresi quelli del genitore) */
function items(){
  const base=OBJ.map(([e,pl,act,it,fr],i)=>({id:'o'+i,e,pl,act,...(L==='it'?it:fr)}));
  const mine=store('serve_mie',[]).filter(x=>x.lang===L).map((x,i)=>({id:'m'+i,e:x.e,pl:x.pl,act:x.act||'✨',o:x.o,a:x.a,s:x.s.includes('[')?x.s:x.s.replace(new RegExp('('+x.a.split(' ')[0]+')'),'[$1]'),q:'',mine:true}));
  return [...base,...mine];
}
let place='';
const pool=()=>items().filter(x=>!place||x.pl===place);
const sentHTML=(s,c)=>s.replace(/\[(.+?)\]/,'<span class="k">$1</span>');
function placeBar(show){ const b=$('places'); b.innerHTML=''; b.hidden=!show; if(!show) return;
  [['',T[L].all,'var(--blue)','✨'],...PLACES.map(p=>[p.id,p[L],p.c,p.e])].forEach(([id,n,c,e])=>{ const x=el('button','pl',e+' '+n); x.style.setProperty('--c',c); x.setAttribute('aria-pressed',String(place===id)); x.onclick=()=>{ place=id; render(); }; b.appendChild(x); }); }
function sceneHTML(x){ const p=P(x.pl); return '<div class="scene" style="--c:'+p.c+'"><span class="badge">'+p.e+' '+p[L]+'</span><span class="obj">'+x.e+'</span><span class="arr">→</span><span class="act">'+x.act+'</span></div>'; }
/* il mazzo senza ripetizioni, per ogni attività e luogo */
function draw(key,n,list){ const ids=list.map(x=>x.id), decks=store('serve_mazzo',{}); let d=decks[key]||{order:[],pos:0}; const out=[];
  while(out.length<Math.min(n,list.length)){ if(d.pos>=d.order.length||!d.order.every(i=>ids.includes(i))) d={order:shuffle(ids),pos:0}; const id=d.order[d.pos++]; if(!out.includes(id)) out.push(id); }
  decks[key]=d; keepS('serve_mazzo',decks); return out.map(id=>list.find(x=>x.id===id)); }
function finish(st,again,score,n){ opts.onWin&&opts.onWin(); st.innerHTML=''; st.append(el('div','star','⭐'),el('p','ask',score===n?T[L].bravo:T[L].done(score,n))); const b=el('button','btn main',T[L].again); b.onclick=again; st.appendChild(b); speak(T[L].bravo); }
const dotsEl=(n,i,ko)=>{ const d=el('div','dots'); for(let k=0;k<n;k++) d.appendChild(el('span',k<i?(ko.includes(k)?'ko':'ok'):k===i?'on':'')); return d; };

/* ── 👀 Scopri ── */
let di=0;
function discover(){ hush(); const st=$('stage'); st.innerHTML=''; const list=pool(); if(!list.length) return; di=di%list.length; const x=list[di], p=P(x.pl);
  const sc=el('div','',sceneHTML(x)).firstChild; sc.onclick=()=>speak(x.s); sc.style.cursor='pointer';
  const s=el('div','sent',sentHTML(x.s)); s.style.setProperty('--c',p.c);
  const nav=el('div','row'), pv=el('button','btn',T[L].prev), nx=el('button','btn blue',T[L].next); pv.onclick=()=>{ di=(di-1+list.length)%list.length; discover(); }; nx.onclick=()=>{ di=(di+1)%list.length; discover(); }; nav.append(pv,nx);
  st.append(sc,s,el('p','sub',T[L].tapHint),nav); speak(x.s); }

/* ── 🔎 Con che cosa? La domanda, tre oggetti ── */
function withWhat(){ hush(); const my=alive, st=$('stage'); const list=pool().filter(x=>x.q); const qs=draw('with'+place+L,6,list); let qi=0,score=0; const ko=[];
  const next=()=>{ if(my!==alive) return; if(qi>=qs.length) return finish(st,withWhat,score,qs.length); st.innerHTML=''; const x=qs[qi]; let tries=0,done=false;
    const opts=shuffle([x,...shuffle(items().filter(y=>y.id!==x.id&&y.act!==x.act)).slice(0,S.n-1)]);
    const g=el('div','choices'+(S.n===2?' two':''));
    opts.forEach(o=>{ const b=el('button','ch','<span class="e">'+o.e+'</span><span class="tx">'+o.o+'</span>'); b.onclick=async()=>{ if(done) return;
      if(o.id===x.id){ done=true; b.classList.add('right'); if(!tries) score++; const s=el('div','sent',sentHTML(x.s)); s.style.setProperty('--c',P(x.pl).c); st.appendChild(s); await speak(cap(x.s)); await wait(700); qi++; next(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); speak(T[L].tryAgain); } }; g.appendChild(b); });
    st.append(dotsEl(qs.length,qi,ko),el('p','ask',x.q),g); speak(x.q); };
  next(); }

/* ── ❓ A cosa serve? L'oggetto, tre azioni ── */
function whatFor(){ hush(); const my=alive, st=$('stage'); const qs=draw('for'+place+L,6,pool()); let qi=0,score=0; const ko=[];
  const next=()=>{ if(my!==alive) return; if(qi>=qs.length) return finish(st,whatFor,score,qs.length); st.innerHTML=''; const x=qs[qi]; let tries=0,done=false; const hint=el('div','hint',''); hint.hidden=true;
    const opts=shuffle([x,...shuffle(items().filter(y=>y.id!==x.id&&y.a!==x.a)).slice(0,S.n-1)]);
    const g=el('div','choices'+(S.n===2?' two':''));
    opts.forEach(o=>{ const b=el('button','ch','<span class="e">'+o.act+'</span><span class="tx">'+o.a+'</span>'); b.onclick=async()=>{ if(done) return;
      if(o.id===x.id){ done=true; b.classList.add('right'); if(!tries) score++; hint.hidden=true; const s=el('div','sent',sentHTML(x.s)); s.style.setProperty('--c',P(x.pl).c); st.appendChild(s); await speak(cap(x.s)); await wait(700); qi++; next(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); speak(T[L].tryAgain); } }; g.appendChild(b); });
    st.append(dotsEl(qs.length,qi,ko),el('p','ask',T[L].useQ(x.o)),el('div','',sceneHTML({...x,act:'❓'})).firstChild,g,hint); speak(T[L].useQ(x.o)); };
  next(); }

/* ── 🏠 Dove va? Si mette l'oggetto nel posto giusto ── */
function room(){ hush(); const my=alive, st=$('stage'); const qs=draw('room'+L,8,items()); let qi=0,score=0; const ko=[];
  const next=()=>{ if(my!==alive) return; if(qi>=qs.length) return finish(st,room,score,qs.length); st.innerHTML=''; const x=qs[qi]; let tries=0,done=false;
    const g=el('div','rooms');
    PLACES.forEach(p=>{ const b=el('button','room','<span class="e">'+p.e+'</span>'+p[L]); b.style.setProperty('--c',p.c); b.onclick=async()=>{ if(done) return;
      if(p.id===x.pl){ done=true; b.classList.add('right'); if(!tries) score++; await speak(cap(x.o)+', '+p.in[L]+'!'); await wait(600); qi++; next(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); speak(T[L].tryAgain); } }; g.appendChild(b); });
    const big=el('div','scene','<span class="obj">'+x.e+'</span>'); big.style.setProperty('--c','var(--blue)');
    st.append(dotsEl(qs.length,qi,ko),el('p','ask',T[L].roomQ(x.o)),big,g); speak(T[L].roomQ(x.o)); };
  next(); }

/* ── 🕵️ L'intruso: tre oggetti dello stesso posto e uno di un altro ── */
function odd(){ hush(); const my=alive, st=$('stage'); let qi=0,score=0; const ko=[], N=6;
  const next=()=>{ if(my!==alive) return; if(qi>=N) return finish(st,odd,score,N); st.innerHTML=''; let tries=0,done=false;
    const pl=PLACES[rnd(PLACES.length)], same=shuffle(items().filter(y=>y.pl===pl.id)).slice(0,3), intr=shuffle(items().filter(y=>y.pl!==pl.id))[0];
    const g=el('div','choices'); g.style.gridTemplateColumns='repeat(2,1fr)'; const hint=el('div','hint',''); hint.hidden=true;
    shuffle([...same,intr]).forEach(o=>{ const b=el('button','ch','<span class="e">'+o.e+'</span><span class="tx">'+o.o+'</span>'); b.onclick=async()=>{ if(done) return;
      if(o===intr){ done=true; b.classList.add('right'); if(!tries) score++; hint.hidden=false; hint.textContent=T[L].hintOdd(cap(o.o),P(o.pl).in[L]); await speak(hint.textContent.replace('💡','')); await wait(800); qi++; next(); }
      else { tries++; if(!ko.includes(qi)) ko.push(qi); wiggle(b); speak(T[L].tryAgain); } }; g.appendChild(b); });
    const q=T[L].oddQ(pl.in[L]); st.append(dotsEl(N,qi,ko),el('p','ask',pl.e+' '+q),g,hint); speak(q); };
  next(); }

/* ── schede, lingua e impostazioni ── */
const TABS=[discover,withWhat,whatFor,room,odd];
let tab=0;
function texts(){ const t=T[L]; ['pTitle','pChoices','pCaps','pMine'].forEach(k=>$(k).textContent=t[k]); $('mO').placeholder=t.mO; $('mA').placeholder='🤗'; $('mS').placeholder=t.mS; $('mAdd').textContent=t.mAdd; }
function render(){ texts(); const tb=$('tabs'); tb.innerHTML=''; T[L].tabs.forEach((l,i)=>{ const b=el('button','tab',l); b.setAttribute('aria-current',String(i===tab)); b.onclick=()=>{ tab=i; render(); }; tb.appendChild(b); });
  placeBar(tab<3); TABS[tab](); }
function chips(){ const opt={n:[[2,'2'],[3,'3']],caps:[['min',T[L].min],['MAI',T[L].mai]]};
  root.querySelectorAll('[data-k="panel"] .chips[data-key]').forEach(box=>{ const k=box.dataset.key; box.innerHTML='';
    opt[k].forEach(([v,l])=>{ const c=el('button','chip',l); c.setAttribute('aria-pressed',String(S[k]===v)); c.onclick=()=>{ S[k]=v; keepS('serve_impostazioni',S); chips(); root.classList.toggle('big',S.caps==='MAI'); }; box.appendChild(c); }); }); }
let mPl='casa';
function mine(){ const pc=$('mPlace'); pc.innerHTML=''; PLACES.forEach(p=>{ const c=el('button','chip',p.e+' '+p[L]); c.setAttribute('aria-pressed',String(mPl===p.id)); c.onclick=()=>{ mPl=p.id; mine(); }; pc.appendChild(c); });
  const l=$('mList'); l.innerHTML=''; store('serve_mie',[]).forEach((x,i)=>{ if(x.lang!==L) return; const d=el('div','','<span>'+x.e+' '+x.s+'</span>'); const b=el('button','','✕'); b.setAttribute('aria-label','✕'); b.onclick=()=>{ const a=store('serve_mie',[]); a.splice(i,1); keepS('serve_mie',a); mine(); }; d.appendChild(b); l.appendChild(d); }); }
$('mAdd').onclick=()=>{ const e=$('mE').value.trim()||'⭐', o=$('mO').value.trim(), s=$('mS').value.trim(), act=$('mA').value.trim()||'✨'; if(!o||!s) return;
  const m=s.match(/(?:serve|servono|sert|servent)\s+(?:a|ad|à)\s+(.+?)\.?$/i); const a=m?m[1]:s;
  const L2=store('serve_mie',[]); L2.push({lang:L,e,o,a,s,act,pl:mPl}); keepS('serve_mie',L2); ['mE','mO','mS','mA'].forEach(k=>$(k).value=''); mine(); };
root.classList.toggle('big',S.caps==='MAI');
if(opts.mode==='parent'){ texts(); $('panel').hidden=false; $('tabs').hidden=true; $('places').hidden=true; $('stage').hidden=true; chips(); mine(); }
else { if(opts.allowSettings){ $('panel').hidden=false; chips(); mine(); } render(); }
  return () => { try { hush() } catch (_) {} root.innerHTML = '' }
}
