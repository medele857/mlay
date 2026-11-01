// Добавить номинацию = добавить строку в NOMS. Сетка сама дополняется заглушками до кратного 3 (минимум 9).
const NOMS=[
 {id:'best',t:'Лучшая карта',d:'Главная номинация премии. Текст-заглушка.',c:'#b8f25b'},
 {id:'scary',t:'Самая страшная карта',d:'Текст-заглушка описания номинации.',c:'#ff6b5e'},
 {id:'story',t:'Лучшая сюжетная карта',d:'Текст-заглушка описания номинации.',c:'#5bc8ff'},
 {id:'sound',t:'Карта с лучшими звуками',d:'Текст-заглушка описания номинации.',c:'#ffc83d'},
 {id:'mode',t:'Лучший режим',d:'Текст-заглушка описания номинации.',c:'#ff7ac8'}
];
const ENTRIES={}; // {nominationId:[{name,author}]} — потом из Firebase
const END=new Date('2026-12-01T00:00:00');
const $=s=>document.querySelector(s);
const page=document.body.dataset.page;
const links=[['index.html','Главная','home'],['nominations.html','Номинации','nominations'],['apply.html','Подать заявку','apply'],['rules.html','Правила','rules']];
const cur=page==='nomination'?'nominations':page;
document.body.insertAdjacentHTML('afterbegin',`<header><a class="logo" href="index.html">Mlay 2026</a><nav>${links.map(l=>`<a href="${l[0]}"${l[2]===cur?' class="on"':''}>${l[1]}</a>`).join('')}</nav></header>`);
document.body.insertAdjacentHTML('beforeend',`<footer>Mlay 2026 · Премия лучших майнкрафт карт · Текст-заглушка для футера</footer><div id="timer"><i></i>Текст-заглушка этапа: <b id="tl">—</b></div>`);
function tick(){const d=END-new Date();$('#tl').textContent=d>0?`${Math.floor(d/864e5)} д ${Math.floor(d%864e5/36e5)} ч`:'завершён'}
tick();setInterval(tick,6e4);
const count=id=>(ENTRIES[id]||[]).length;
if(page==='nominations'){
  const slots=Math.max(9,Math.ceil(NOMS.length/3)*3);
  $('#noms').innerHTML=NOMS.map(n=>`<a class="nom" style="--c:${n.c}" href="nomination.html?id=${n.id}"><span class="go">→</span><h3>${n.t}</h3><small>${count(n.id)} участников</small></a>`).join('')
   +Array.from({length:slots-NOMS.length},()=>`<div class="nom soon"><h3>Скоро новая номинация</h3><small>Текст-заглушка</small></div>`).join('');
}
if(page==='nomination'){
  const n=NOMS.find(x=>x.id===new URLSearchParams(location.search).get('id'))||NOMS[0];
  document.title=n.t+' — Mlay 2026';
  $('#nhead').style.setProperty('--c',n.c);$('#grid').style.setProperty('--c',n.c);
  $('#nhead').innerHTML=`<h2>${n.t}</h2><p>${n.d}</p>`;
  const list=ENTRIES[n.id]||[];
  $('#grid').innerHTML=list.length?list.map(e=>`<div class="card"><div class="img"></div><div class="t"><b>${e.name}</b><span>${e.author}</span></div></div>`).join('')
   :Array.from({length:3},(_,i)=>`<div class="card"><div class="img"></div><div class="t"><b>Карта-заглушка ${i+1}</b><span>Автор-заглушка</span></div></div>`).join('');
}
if(page==='apply'){
  $('#formNoms').insertAdjacentHTML('beforeend',NOMS.map(n=>`<label><input type="checkbox">${n.t}</label>`).join(''));
  $('#form').addEventListener('submit',e=>{e.preventDefault();alert('Заглушка: отправку заявок подключим позже (Firebase).')});
}
