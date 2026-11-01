import {ready,db,FS} from './fb.js';
export const DEFAULT=[
 {id:'best',t:'Лучшая карта',d:'Главная номинация премии. Текст-заглушка.',c:'#b8f25b'},
 {id:'scary',t:'Самая страшная карта',d:'Текст-заглушка описания номинации.',c:'#ff6b5e'},
 {id:'story',t:'Лучшая сюжетная карта',d:'Текст-заглушка описания номинации.',c:'#5bc8ff'},
 {id:'sound',t:'Карта с лучшими звуками',d:'Текст-заглушка описания номинации.',c:'#ffc83d'},
 {id:'mode',t:'Лучший режим',d:'Текст-заглушка описания номинации.',c:'#ff7ac8'}
];
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>/^https?:\/\//i.test(u)?esc(u):'#';
export async function getNoms(){
  if(!ready)return DEFAULT;
  try{const s=await FS.getDocs(FS.query(FS.collection(db,'nominations'),FS.orderBy('order')));
    const l=s.docs.map(d=>({id:d.id,...d.data()}));return l.length?l:DEFAULT}catch(e){return DEFAULT}
}
async function getEntries(){
  if(!ready)return[];
  try{return (await FS.getDocs(FS.collection(db,'entries'))).docs.map(d=>({id:d.id,...d.data()}))}catch(e){return[]}
}
const END=new Date('2026-12-01T00:00:00');
const $=s=>document.querySelector(s);
const page=document.body.dataset.page;

// масштаб сайта
let sc=100;try{sc=+localStorage.getItem('mlay-scale')||100}catch(e){}
function setScale(v){sc=Math.min(130,Math.max(80,v));document.documentElement.style.fontSize=sc+'%';
  const l=$('#sv');if(l)l.textContent=sc+'%';try{localStorage.setItem('mlay-scale',sc)}catch(e){}}
setScale(sc);

const links=[['index.html','Главная','home'],['nominations.html','Номинации','nominations'],['apply.html','Подать заявку','apply'],['rules.html','Правила','rules']];
const cur=page==='nomination'?'nominations':page;
document.body.insertAdjacentHTML('afterbegin',`<header><a class="logo" href="index.html">Mlay 2026</a><nav>${links.map(l=>`<a href="${l[0]}"${l[2]===cur?' class="on"':''}>${l[1]}</a>`).join('')}</nav>
<div class="scale" role="group" aria-label="Масштаб сайта"><button id="sm" aria-label="Уменьшить">−</button><button id="sv" title="Сбросить масштаб">100%</button><button id="sp" aria-label="Увеличить">+</button></div></header>`);
$('#sm').onclick=()=>setScale(sc-10);$('#sp').onclick=()=>setScale(sc+10);$('#sv').onclick=()=>setScale(100);setScale(sc);
document.body.insertAdjacentHTML('beforeend',`<footer>Mlay 2026 · Премия лучших майнкрафт карт · Текст-заглушка для футера · <a href="admin.html">Управление</a></footer><div id="timer"><i></i>Текст-заглушка этапа: <b id="tl">—</b></div>`);
function tick(){const d=END-new Date();$('#tl').textContent=d>0?`${Math.floor(d/864e5)} д ${Math.floor(d%864e5/36e5)} ч`:'завершён'}
tick();setInterval(tick,6e4);

if(page==='nominations'){
  const [noms,ent]=await Promise.all([getNoms(),getEntries()]);
  const slots=Math.max(9,Math.ceil(noms.length/3)*3);
  $('#noms').innerHTML=noms.map(n=>`<a class="nom" style="--c:${esc(n.c)}" href="nomination.html?id=${encodeURIComponent(n.id)}"><span class="go">→</span><h3>${esc(n.t)}</h3><small>${ent.filter(e=>(e.noms||[]).includes(n.id)).length} участников</small></a>`).join('')
   +Array.from({length:slots-noms.length},()=>`<div class="nom soon"><h3>Скоро новая номинация</h3><small>Текст-заглушка</small></div>`).join('');
}
if(page==='nomination'){
  const [noms,ent]=await Promise.all([getNoms(),getEntries()]);
  const n=noms.find(x=>x.id===new URLSearchParams(location.search).get('id'))||noms[0];
  document.title=n.t+' — Mlay 2026';
  $('#nhead').style.setProperty('--c',n.c);$('#grid').style.setProperty('--c',n.c);
  $('#nhead').innerHTML=`<h2>${esc(n.t)}</h2><p>${esc(n.d)}</p>`;
  const list=ent.filter(e=>(e.noms||[]).includes(n.id));
  $('#grid').innerHTML=list.length?list.map(e=>`<a class="card" href="${safeUrl(e.link)}" target="_blank" rel="noopener"><div class="img"></div><div class="t"><b>${esc(e.name)}</b><span>${esc(e.author)}</span></div></a>`).join('')
   :'<p class="text">Участников пока нет. Текст-заглушка.</p>';
}
if(page==='apply'){
  const noms=await getNoms();
  $('#formNoms').insertAdjacentHTML('beforeend',noms.map(n=>`<label><input type="checkbox" name="noms" value="${esc(n.id)}">${esc(n.t)}</label>`).join(''));
  const msg=t=>$('#msg').textContent=t;
  $('#form').addEventListener('submit',async e=>{
    e.preventDefault();const f=e.target,fd=new FormData(f),g=(k,m)=>String(fd.get(k)||'').trim().slice(0,m);
    if(!ready)return msg('Приём заявок ещё не подключён.');
    if(!fd.getAll('noms').length)return msg('Выбери хотя бы одну номинацию.');
    const b=f.querySelector('button');b.disabled=true;
    try{
      await FS.addDoc(FS.collection(db,'applications'),{name:g('name',200),author:g('author',200),version:g('version',50),link:g('link',500),date:g('date',20),
        noms:fd.getAll('noms'),media:g('media',2000),desc:g('desc',2000),contact:g('contact',200),status:'new',created:FS.serverTimestamp()});
      f.reset();msg('Заявка отправлена. Мы проверим её и свяжемся с тобой.');
    }catch(err){msg('Не удалось отправить заявку. Попробуй ещё раз.')}
    b.disabled=false;
  });
}
