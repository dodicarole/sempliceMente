/**
 * Fumetti già pronti per le Storie: vignette disegnate con i personaggi dell'app,
 * con racconto (didascalia) e nuvolette (parla / pensa) in italiano e in francese.
 */
/* eslint-disable */
export type CharId = 'zoe' | 'lila' | 'nico' | 'amina' | 'meky' | 'mamma' | 'tedo'
type Txt = { it: string; fr: string }
export interface Bubble { who: CharId; kind: 'say' | 'think'; text: Txt; x: number; y: number; tail: 'tl' | 'tr'; big?: boolean; small?: boolean }
export interface Panel { svg: string; cap: Txt; bubbles: Bubble[] }
export interface Comic { id: string; icon: string; title: Txt; panels: Panel[] }
/** Nome, colore e tono di voce di ogni personaggio */
export const CHARS: Record<CharId, { name: string; color: string; pitch: number }> = {
  zoe: { name: 'Zoe', color: '#F08C00', pitch: 1.25 }, lila: { name: 'Lila', color: '#C2255C', pitch: 1.35 },
  nico: { name: 'Nico', color: '#0C8599', pitch: 1.1 }, amina: { name: 'Amina', color: '#2F9E44', pitch: 1.2 },
  meky: { name: 'Meky', color: '#5F88CC', pitch: 1.3 }, mamma: { name: 'Mamma', color: '#7048E8', pitch: 0.95 }, tedo: { name: 'Tedo', color: '#2F9E44', pitch: 1.45 },
}

const INK='#2B2D52', CHEEK='#F59AA0';
const SK: Record<string, string> = {light:'#F6D2B4',fair:'#F2C7A5',medium:'#D9A273',tan:'#B97D4E',dark:'#7A4A2A'};
const CAST: Record<string, any> = {
  zoe:{skin:'dark',hair:'#1E120B',style:'curly',shirt:'#F08C00',pants:'#4A5A7A'},
  lila:{skin:'light',hair:'#E8B64C',style:'long',shirt:'#F783AC',pants:'#C2255C',skirt:1,freckles:1},
  nico:{skin:'fair',hair:'#7A4E2D',style:'short',shirt:'#0C8599',pants:'#2F4858',phones:1},
  amina:{skin:'tan',hair:'#2B1B12',style:'bun',shirt:'#2F9E44',pants:'#2B5A3A',glasses:1},
  meky:{skin:'fair',hair:'#6B4226',style:'short',shirt:'#7FA8E8',pants:'#5F88CC'},
  mamma:{skin:'fair',hair:'#8B5A2B',style:'long',shirt:'#9775FA',pants:'#5F3DC4',skirt:1}
};
const f = (n: number) => (+n).toFixed(1);
function head(o: any, cx: number, cy: number, r: number, mood: string){
  let s=''; const c=SK[o.skin];
  if(o.style==='long') s+='<path d="M'+f(cx-r-6)+' '+f(cy+r*1.4)+' C'+f(cx-r-12)+' '+f(cy-r*1.6)+' '+f(cx+r+12)+' '+f(cy-r*1.6)+' '+f(cx+r+6)+' '+f(cy+r*1.4)+'Z" fill="'+o.hair+'"/>';
  if(o.style==='curly') for(let a=0;a<360;a+=30){ const ax=cx+Math.cos((a-90)*Math.PI/180)*r*.95, ay=cy-r*.15+Math.sin((a-90)*Math.PI/180)*r*.9; if(ay<cy+r*.2) s+='<circle cx="'+f(ax)+'" cy="'+f(ay)+'" r="'+f(r*.38)+'" fill="'+o.hair+'"/>'; }
  if(o.style==='bun') s+='<circle cx="'+cx+'" cy="'+f(cy-r*1.15)+'" r="'+f(r*.42)+'" fill="'+o.hair+'"/>';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+c+'"/>';
  const front=o.style==='long'?'M'+f(cx-r)+' '+f(cy-4)+' C'+f(cx-r)+' '+f(cy-r*1.35)+' '+f(cx+r)+' '+f(cy-r*1.35)+' '+f(cx+r)+' '+f(cy-4)+' C'+f(cx+r*.3)+' '+f(cy-r*.7)+' '+f(cx-r*.5)+' '+f(cy-r*.6)+' '+f(cx-r)+' '+f(cy-4)+'Z'
    :o.style==='curly'?'M'+f(cx-r)+' '+f(cy-r*.15)+' C'+f(cx-r*.9)+' '+f(cy-r*1.2)+' '+f(cx+r*.9)+' '+f(cy-r*1.2)+' '+f(cx+r)+' '+f(cy-r*.15)+' C'+f(cx+r*.4)+' '+f(cy-r*.55)+' '+f(cx-r*.4)+' '+f(cy-r*.55)+' '+f(cx-r)+' '+f(cy-r*.15)+'Z'
    :'M'+f(cx-r-2)+' '+f(cy-2)+' C'+f(cx-r)+' '+f(cy-r*1.45)+' '+f(cx+r)+' '+f(cy-r*1.45)+' '+f(cx+r+2)+' '+f(cy-2)+' C'+f(cx+r*.6)+' '+f(cy-r*.55)+' '+f(cx-r*.2)+' '+f(cy-r*.75)+' '+f(cx-r-2)+' '+f(cy-2)+'Z';
  s+='<path d="'+front+'" fill="'+o.hair+'"/>';
  const e=r*.33;
  s+='<circle cx="'+f(cx-e)+'" cy="'+f(cy-2)+'" r="'+f(r*.1)+'" fill="'+INK+'"/><circle cx="'+f(cx+e)+'" cy="'+f(cy-2)+'" r="'+f(r*.1)+'" fill="'+INK+'"/>';
  if(o.glasses) s+='<g fill="none" stroke="'+INK+'" stroke-width="2.5"><circle cx="'+f(cx-e)+'" cy="'+f(cy-2)+'" r="'+f(r*.24)+'"/><circle cx="'+f(cx+e)+'" cy="'+f(cy-2)+'" r="'+f(r*.24)+'"/></g>';
  s+='<circle cx="'+f(cx-r*.55)+'" cy="'+f(cy+r*.3)+'" r="'+f(r*.15)+'" fill="'+CHEEK+'" opacity="'+(mood==='angry'?'.95':'.55')+'"/><circle cx="'+f(cx+r*.55)+'" cy="'+f(cy+r*.3)+'" r="'+f(r*.15)+'" fill="'+CHEEK+'" opacity="'+(mood==='angry'?'.95':'.55')+'"/>';
  if(o.freckles) ([[-.5,.12],[-.38,.22],[.5,.12],[.38,.22]] as number[][]).forEach(d=>{ s+='<circle cx="'+f(cx+r*d[0])+'" cy="'+f(cy+r*d[1])+'" r="1.6" fill="#B5714A"/>'; });
  if(mood==='angry') s+='<path d="M'+f(cx-e-r*.25)+' '+f(cy-r*.42)+' L'+f(cx-e+r*.2)+' '+f(cy-r*.3)+' M'+f(cx+e+r*.25)+' '+f(cy-r*.42)+' L'+f(cx+e-r*.2)+' '+f(cy-r*.3)+'" stroke="'+INK+'" stroke-width="3" stroke-linecap="round"/><path d="M'+f(cx-r*.3)+' '+f(cy+r*.48)+' q'+f(r*.3)+' -'+f(r*.22)+' '+f(r*.6)+' 0" stroke="'+INK+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  else if(mood==='calm') s+='<path d="M'+f(cx-r*.28)+' '+f(cy+r*.34)+' q'+f(r*.28)+' '+f(r*.2)+' '+f(r*.56)+' 0" stroke="'+INK+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  else if(mood==='sad') s+='<path d="M'+f(cx-r*.28)+' '+f(cy+r*.5)+' q'+f(r*.28)+' -'+f(r*.22)+' '+f(r*.56)+' 0" stroke="'+INK+'" stroke-width="3" fill="none" stroke-linecap="round"/>';
  else if(mood==='oh') s+='<ellipse cx="'+cx+'" cy="'+f(cy+r*.42)+'" rx="'+f(r*.14)+'" ry="'+f(r*.19)+'" fill="'+INK+'"/>';
  else s+='<path d="M'+f(cx-r*.35)+' '+f(cy+r*.3)+' q'+f(r*.35)+' '+f(r*.45)+' '+f(r*.7)+' 0 z" fill="'+INK+'"/>';
  if(o.phones) s+='<path d="M'+f(cx-r-4)+' '+cy+' C'+f(cx-r-4)+' '+f(cy-r*1.55)+' '+f(cx+r+4)+' '+f(cy-r*1.55)+' '+f(cx+r+4)+' '+cy+'" stroke="#6B7FE3" stroke-width="6" fill="none"/><rect x="'+f(cx-r-11)+'" y="'+f(cy-r*.35)+'" width="14" height="'+f(r*.75)+'" rx="6" fill="#6B7FE3"/><rect x="'+f(cx+r-3)+'" y="'+f(cy-r*.35)+'" width="14" height="'+f(r*.75)+'" rx="6" fill="#6B7FE3"/>';
  return s;
}
/* un bambino con i piedi in (x,y); pose: down, run, up, wave, fists, slide */
function kid(name: string, x: number, y: number, sc: number, { pose = 'down', mood = 'happy' }: { pose?: string; mood?: string } = {}){
  const o=CAST[name], c=SK[o.skin], S=(v: number)=>v*sc; let s='';
  if(pose==='slide'){ // seduto, gambe in avanti, braccia in alto
    s+='<rect x="'+f(x-S(8))+'" y="'+f(y-S(26))+'" width="'+f(S(56))+'" height="'+f(S(16))+'" rx="'+f(S(8))+'" fill="'+o.pants+'"/>';
    s+='<rect x="'+f(x-S(26))+'" y="'+f(y-S(92))+'" width="'+f(S(52))+'" height="'+f(S(68))+'" rx="'+f(S(18))+'" fill="'+o.shirt+'"/>';
    ([[-22,-80,-44,-146],[22,-80,44,-146]] as number[][]).forEach(a=>{ s+='<line x1="'+f(x+S(a[0]))+'" y1="'+f(y+S(a[1]))+'" x2="'+f(x+S(a[2]))+'" y2="'+f(y+S(a[3]))+'" stroke="'+o.shirt+'" stroke-width="'+f(S(13))+'" stroke-linecap="round"/><circle cx="'+f(x+S(a[2]))+'" cy="'+f(y+S(a[3]))+'" r="'+f(S(8))+'" fill="'+c+'"/>'; });
    return s+head(o,x,y-S(120),S(30),mood);
  }
  if(o.skirt) s+='<rect x="'+f(x-S(15))+'" y="'+f(y-S(40))+'" width="'+f(S(10))+'" height="'+f(S(38))+'" rx="'+f(S(5))+'" fill="'+c+'"/><rect x="'+f(x+S(5))+'" y="'+f(y-S(40))+'" width="'+f(S(10))+'" height="'+f(S(38))+'" rx="'+f(S(5))+'" fill="'+c+'"/><path d="M'+f(x-S(30))+' '+f(y-S(38))+' L'+f(x-S(22))+' '+f(y-S(80))+' L'+f(x+S(22))+' '+f(y-S(80))+' L'+f(x+S(30))+' '+f(y-S(38))+'Z" fill="'+o.pants+'"/>';
  else if(pose==='run') s+='<line x1="'+f(x-S(8))+'" y1="'+f(y-S(56))+'" x2="'+f(x-S(30))+'" y2="'+f(y-S(4))+'" stroke="'+o.pants+'" stroke-width="'+f(S(14))+'" stroke-linecap="round"/><line x1="'+f(x+S(8))+'" y1="'+f(y-S(56))+'" x2="'+f(x+S(26))+'" y2="'+f(y-S(10))+'" stroke="'+o.pants+'" stroke-width="'+f(S(14))+'" stroke-linecap="round"/>';
  else s+='<rect x="'+f(x-S(17))+'" y="'+f(y-S(62))+'" width="'+f(S(14))+'" height="'+f(S(60))+'" rx="'+f(S(7))+'" fill="'+o.pants+'"/><rect x="'+f(x+S(3))+'" y="'+f(y-S(62))+'" width="'+f(S(14))+'" height="'+f(S(60))+'" rx="'+f(S(7))+'" fill="'+o.pants+'"/>';
  s+='<rect x="'+f(x-S(26))+'" y="'+f(y-S(122))+'" width="'+f(S(52))+'" height="'+f(S(68))+'" rx="'+f(S(18))+'" fill="'+o.shirt+'"/>';
  const P=({down:[[-34,-62],[34,-62]],run:[[-40,-80],[36,-140]],up:[[-44,-178],[44,-178]],wave:[[-34,-62],[48,-170]],fists:[[-30,-96],[30,-96]]} as Record<string, number[][]>)[pose];
  ([[-22,P[0]],[22,P[1]]] as [number, number[]][]).forEach(([sx,[ex,ey]])=>{ s+='<line x1="'+f(x+S(sx))+'" y1="'+f(y-S(110))+'" x2="'+f(x+S(ex))+'" y2="'+f(y+S(ey))+'" stroke="'+o.shirt+'" stroke-width="'+f(S(13))+'" stroke-linecap="round"/><circle cx="'+f(x+S(ex))+'" cy="'+f(y+S(ey))+'" r="'+f(S(8))+'" fill="'+c+'"/>'; });
  return s+head(o,x,y-S(150),S(30),mood);
}
/* il parco: prato, cielo, albero e lo scivolo con la scala */
const sky='<rect width="400" height="300" fill="#D0EBFF"/><rect y="236" width="400" height="64" fill="#8CE99A"/>';
const tree=(x: number)=>'<rect x="'+(x-8)+'" y="150" width="16" height="90" fill="#8B5A2B"/><circle cx="'+x+'" cy="132" r="40" fill="#40C057"/>';
const slide=(x: number)=>'<rect x="'+x+'" y="100" width="10" height="140" fill="#E03131"/><rect x="'+(x+44)+'" y="100" width="10" height="140" fill="#E03131"/>'+[0,1,2,3,4].map((k: number)=>'<rect x="'+x+'" y="'+(116+k*24)+'" width="54" height="6" fill="#E03131"/>').join('')+'<rect x="'+(x-4)+'" y="94" width="62" height="12" rx="4" fill="#FCC419"/><path d="M'+(x+54)+' 100 Q'+(x+110)+' 120 '+(x+150)+' 236 L'+(x+168)+' 236 Q'+(x+126)+' 112 '+(x+54)+' 88 Z" fill="#1C7ED6"/>';

/* ── Le vignette: disegno, racconto (didascalia) e nuvolette (parla / pensa) ── */

const P = [sky+tree(60)+slide(190)+kid('zoe',110,240,.85,{pose:'run'})+'<path d="M40 190 h22 M34 204 h22" stroke="#fff" stroke-width="4" stroke-linecap="round"/>',
  sky+slide(170)+kid('nico',215,246,.62)+kid('amina',150,246,.62)+kid('zoe',70,246,.62,{mood:'calm'}),
  '<rect width="400" height="300" fill="#FFE3E3"/>'+([[40,40],[340,50],[50,150],[350,140]] as number[][]).map(([a,b])=>'<path d="M'+a+' '+b+' l14 -14 M'+(a+6)+' '+(b+10)+' l18 -6" stroke="#E03131" stroke-width="5" stroke-linecap="round"/>').join('')+kid('zoe',200,330,1.5,{pose:'fists',mood:'angry'}),
  sky+tree(340)+kid('zoe',110,246,.72,{mood:'calm'})+kid('lila',230,246,.72,{pose:'wave'}),
  sky+slide(210)+kid('zoe',70,246,.66)+kid('lila',140,246,.66)+['1','2','3','4','5'].map((n: string,k: number)=>'<text x="'+(250+k*28)+'" y="'+(110+(k%2)*16)+'" font-size="30" font-weight="900" fill="'+['#E03131','#F08C00','#2F9E44','#1C7ED6','#7048E8'][k]+'" font-family="system-ui">'+n+'</text>').join('')+kid('amina',338,232,.5,{pose:'slide'}),
  sky+tree(46)+slide(110)+kid('zoe',262,234,.62,{pose:'slide'})+kid('lila',340,246,.66,{pose:'up'})]

/* ── Per "Meky e la tazza rotta": il salotto, Tedo, la tazza, la nuvoletta, il sole ── */
const room='<rect width="400" height="300" fill="#E7ECFB"/><rect y="196" width="400" height="104" fill="#D3DAF5"/><rect x="24" y="22" width="88" height="84" rx="6" fill="#B9C6F5"/><path d="M68 22 V106 M24 64 H112" stroke="#C9B49A" stroke-width="5"/><rect x="24" y="22" width="88" height="84" rx="6" fill="none" stroke="#C9B49A" stroke-width="6"/><rect x="284" y="84" width="104" height="7" rx="3" fill="#B08968"/>';
const table='<rect x="196" y="150" width="104" height="8" rx="3" fill="#B08968"/><rect x="204" y="156" width="6" height="40" fill="#9C7656"/><rect x="286" y="156" width="6" height="40" fill="#9C7656"/>';
function cup(x: number, y: number, sc: number){ return '<g transform="translate('+x+' '+y+') scale('+sc+')"><path d="M-46 -96 H46 V-24 Q46 0 22 0 H-22 Q-46 0 -46 -24 Z" fill="#F783AC"/><path d="M46 -78 Q76 -78 76 -54 Q76 -30 46 -30" stroke="#F783AC" stroke-width="12" fill="none"/><path d="M0 -42 C-14 -54 -20 -66 -10 -72 C-4 -76 0 -70 0 -66 C0 -70 4 -76 10 -72 C20 -66 14 -54 0 -42 Z" fill="#FFFFFF" opacity=".85"/></g>'; }
function shards(x: number, y: number, sc: number){ return '<g transform="translate('+x+' '+y+') scale('+sc+')"><path d="M-80 0 L-50 -26 L-40 0 Z" fill="#F783AC"/><path d="M-20 0 L10 -34 L34 -6 L20 0 Z" fill="#F783AC"/><path d="M50 0 L64 -30 L90 -12 L84 0 Z" fill="#F783AC"/></g>'; }
function frog(x: number, y: number, size: number, happy: boolean){ const k=size/200; return '<g transform="translate('+(x-size/2)+' '+(y-size)+') scale('+k+')"><ellipse cx="62" cy="186" rx="26" ry="10" fill="#3E9C5B"/><ellipse cx="138" cy="186" rx="26" ry="10" fill="#3E9C5B"/><ellipse cx="100" cy="140" rx="58" ry="50" fill="#5CC27A"/><ellipse cx="100" cy="150" rx="36" ry="32" fill="#C9EFC4"/><ellipse cx="100" cy="84" rx="62" ry="44" fill="#5CC27A"/><circle cx="70" cy="50" r="24" fill="#5CC27A"/><circle cx="130" cy="50" r="24" fill="#5CC27A"/><circle cx="70" cy="50" r="17" fill="#fff"/><circle cx="130" cy="50" r="17" fill="#fff"/><circle cx="74" cy="53" r="8" fill="#1F2147"/><circle cx="126" cy="53" r="8" fill="#1F2147"/><circle cx="56" cy="96" r="9" fill="#F59AA0" opacity=".6"/><circle cx="144" cy="96" r="9" fill="#F59AA0" opacity=".6"/>'+(happy?'<path d="M70 94 Q100 124 130 94 Z" fill="#1F2147"/>':'<path d="M76 108 Q100 92 124 108" stroke="#1F2147" stroke-width="5" fill="none" stroke-linecap="round"/>')+'</g>'; }
function cloud(x: number, y: number, sc: number){ return '<g transform="translate('+x+' '+y+') scale('+sc+')"><path d="M-90 30 Q-120 30 -120 0 Q-120 -34 -84 -34 Q-74 -76 -26 -72 Q4 -104 46 -80 Q96 -86 100 -40 Q130 -32 124 0 Q118 30 88 30 Z" fill="#9AA2C4"/><path d="M-40 54 q-10 16 0 22 q10 -6 0 -22 z M30 64 q-10 16 0 22 q10 -6 0 -22 z" fill="#74C0FC"/></g>'; }
function sun(x: number, y: number){ let r=''; for(let i=0;i<8;i++){ const a=i*Math.PI/4; r+='<line x1="'+(x+Math.cos(a)*26).toFixed(1)+'" y1="'+(y+Math.sin(a)*26).toFixed(1)+'" x2="'+(x+Math.cos(a)*38).toFixed(1)+'" y2="'+(y+Math.sin(a)*38).toFixed(1)+'" stroke="#FCC419" stroke-width="5" stroke-linecap="round"/>'; } return r+'<circle cx="'+x+'" cy="'+y+'" r="20" fill="#FFD43B"/>'; }
const ball=(x: number, y: number)=>'<circle cx="'+x+'" cy="'+y+'" r="13" fill="#E03131"/><path d="M'+(x-13)+' '+y+' h26" stroke="#fff" stroke-width="4"/>';
// i personaggi stanno in alto (piedi a y 210): sotto c'è il riquadro del racconto
const MK = [
  room+table+cup(248,150,.42)+ball(214,70)+'<path d="M182 88 q14 -22 30 -18 M174 102 q10 -10 22 -10" stroke="#9AA2C4" stroke-width="4" fill="none" stroke-linecap="round"/>'+kid('meky',110,210,.6,{pose:'wave'}),
  room+table+shards(250,206,.5)+ball(160,200)+'<path d="M232 176 l-10 -12 M262 170 l0 -14 M288 176 l10 -12" stroke="#E64980" stroke-width="5" stroke-linecap="round"/>'+kid('meky',100,210,.6,{mood:'oh'}),
  room+frog(336,84,46,true)+shards(250,206,.5)+kid('meky',100,210,.6,{mood:'oh'})+kid('mamma',300,212,.74),
  room+frog(336,84,46,false)+shards(250,206,.5)+kid('meky',100,210,.6,{mood:'happy',pose:'wave'})+kid('mamma',300,212,.74,{mood:'calm'}),
  room+frog(336,84,46,false)+cloud(190,74,.36)+kid('meky',190,210,.6,{mood:'sad'}),
  room+cloud(130,74,.36)+kid('meky',130,210,.6,{mood:'sad'})+frog(300,210,70,true),
  room+cloud(250,96,.3)+kid('mamma',110,212,.74,{mood:'calm'})+kid('meky',250,214,.56,{mood:'oh'})+frog(340,210,56,true),
  room+sun(340,48)+kid('mamma',120,220,.68,{mood:'happy'})+kid('meky',220,210,.6,{mood:'happy',pose:'up'})+frog(320,210,56,true),
]

export const COMICS: Comic[] = [{
  id: 'zoe-turno', icon: '🛝', title: { it: 'Zoe e il turno allo scivolo', fr: 'Zoe et son tour au toboggan' },
  panels: [
    { svg: P[0], cap: { it: 'Al parco, Zoe vede lo scivolo e corre a giocare.', fr: 'Au parc, Zoe voit le toboggan et court jouer.' }, bubbles: [] },
    { svg: P[1], cap: { it: "Davanti allo scivolo c'è la fila.", fr: 'Devant le toboggan, il y a la queue.' },
      bubbles: [{ who: 'zoe', kind: 'think', text: { it: 'Voglio andare SUBITO!', fr: 'Je veux y aller TOUT DE SUITE\u00a0!' }, x: 3, y: 5, tail: 'tl' }] },
    { svg: P[2], cap: { it: 'Zoe si sente arrabbiata. Aspettare è difficile!', fr: 'Zoe est en colère. Attendre, c’est difficile\u00a0!' }, bubbles: [] },
    { svg: P[3], cap: { it: 'Arriva la sua amica Lila.', fr: 'Son amie Lila arrive.' },
      bubbles: [{ who: 'lila', kind: 'say', text: { it: 'Contiamo insieme fino a 5?', fr: 'On compte ensemble jusqu’à 5\u00a0?' }, x: 42, y: 4, tail: 'tl' }] },
    { svg: P[4], cap: { it: 'Zoe e Lila contano. Intanto Amina scende.', fr: 'Zoe et Lila comptent. Pendant ce temps, Amina descend.' },
      bubbles: [{ who: 'zoe', kind: 'say', text: { it: 'Uno, due, tre, quattro, cinque!', fr: 'Un, deux, trois, quatre, cinq\u00a0!' }, x: 3, y: 4, tail: 'tl', small: true }] },
    { svg: P[5], cap: { it: 'Il turno arriva sempre!', fr: 'Le tour arrive toujours\u00a0!' },
      bubbles: [{ who: 'zoe', kind: 'say', text: { it: 'Wiii! È il mio turno!', fr: 'Youpi\u00a0! C’est mon tour\u00a0!' }, x: 4, y: 4, tail: 'tr', big: true }] },
  ],
}, {
  id: 'meky-tazza', icon: '☕', title: { it: 'Meky e la tazza rotta', fr: 'Meky et la tasse cassée' },
  panels: [
    { svg: MK[0], cap: { it: 'Meky gioca a palla in salotto, anche se non si potrebbe.', fr: 'Meky joue au ballon dans le salon, même si ce n’est pas permis.' }, bubbles: [] },
    { svg: MK[1], cap: { it: 'Crac! La tazza preferita della mamma si rompe.', fr: 'Crac\u00a0! La tasse préférée de maman se casse.' }, bubbles: [] },
    { svg: MK[2], cap: { it: 'Arriva la mamma.', fr: 'Maman arrive.' },
      bubbles: [{ who: 'mamma', kind: 'say', text: { it: 'Cosa è successo?', fr: 'Qu’est-ce qui s’est passé\u00a0?' }, x: 36, y: 4, tail: 'tr' }] },
    { svg: MK[3], cap: { it: 'Meky dice una bugia.', fr: 'Meky dit un mensonge.' },
      bubbles: [{ who: 'meky', kind: 'say', text: { it: 'Non sono stato io! È stato Tedo!', fr: 'C’est pas moi\u00a0! C’est Tedo\u00a0!' }, x: 3, y: 4, tail: 'tl' }] },
    { svg: MK[4], cap: { it: 'Una nuvoletta grigia lo segue dappertutto.', fr: 'Un petit nuage gris le suit partout.' },
      bubbles: [{ who: 'meky', kind: 'think', text: { it: 'Mi sento pesante…', fr: 'Je me sens lourd…' }, x: 54, y: 4, tail: 'tl' }] },
    { svg: MK[5], cap: { it: 'Tedo gli dà coraggio.', fr: 'Tedo lui donne du courage.' },
      bubbles: [{ who: 'tedo', kind: 'say', text: { it: 'Dire la verità fa un po’ paura, ma è da coraggiosi!', fr: 'Dire la vérité fait un peu peur, mais c’est courageux\u00a0!' }, x: 40, y: 3, tail: 'tr', small: true }] },
    { svg: MK[6], cap: { it: 'Meky dice la verità.', fr: 'Meky dit la vérité.' },
      bubbles: [{ who: 'meky', kind: 'say', text: { it: 'Mamma, sono stato io. Avevo paura.', fr: 'Maman, c’est moi. J’avais peur.' }, x: 42, y: 2, tail: 'tl', small: true }] },
    { svg: MK[7], cap: { it: 'La verità è più leggera!', fr: 'La vérité, c’est plus léger\u00a0!' },
      bubbles: [{ who: 'mamma', kind: 'say', text: { it: 'Grazie per avermi detto la verità.', fr: 'Merci de m’avoir dit la vérité.' }, x: 3, y: 2, tail: 'tl', small: true }] },
  ],
}]

