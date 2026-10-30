/**
 * Fumetti già pronti per le Storie: vignette disegnate con i personaggi dell'app,
 * con racconto (didascalia) e nuvolette (parla / pensa) in italiano e in francese.
 */
/* eslint-disable */
export type CharId = 'zoe' | 'lila' | 'nico' | 'amina'
type Txt = { it: string; fr: string }
export interface Bubble { who: CharId; kind: 'say' | 'think'; text: Txt; x: number; y: number; tail: 'tl' | 'tr'; big?: boolean; small?: boolean }
export interface Panel { svg: string; cap: Txt; bubbles: Bubble[] }
export interface Comic { id: string; icon: string; title: Txt; panels: Panel[] }
/** Nome, colore e tono di voce di ogni personaggio */
export const CHARS: Record<CharId, { name: string; color: string; pitch: number }> = {
  zoe: { name: 'Zoe', color: '#F08C00', pitch: 1.25 }, lila: { name: 'Lila', color: '#C2255C', pitch: 1.35 },
  nico: { name: 'Nico', color: '#0C8599', pitch: 1.1 }, amina: { name: 'Amina', color: '#2F9E44', pitch: 1.2 },
}

const INK='#2B2D52', CHEEK='#F59AA0';
const SK: Record<string, string> = {light:'#F6D2B4',fair:'#F2C7A5',medium:'#D9A273',tan:'#B97D4E',dark:'#7A4A2A'};
const CAST: Record<string, any> = {
  zoe:{skin:'dark',hair:'#1E120B',style:'curly',shirt:'#F08C00',pants:'#4A5A7A'},
  lila:{skin:'light',hair:'#E8B64C',style:'long',shirt:'#F783AC',pants:'#C2255C',skirt:1,freckles:1},
  nico:{skin:'fair',hair:'#7A4E2D',style:'short',shirt:'#0C8599',pants:'#2F4858',phones:1},
  amina:{skin:'tan',hair:'#2B1B12',style:'bun',shirt:'#2F9E44',pants:'#2B5A3A',glasses:1}
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
}]
