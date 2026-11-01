// Фон главной: экран из 4 частей, превью карт плавно меняются каждые 5 секунд
import {BG} from './bg-config.js';
if(BG.length>=5){
  const wall=document.createElement('div');
  wall.className='bgwall';wall.setAttribute('aria-hidden','true');
  wall.innerHTML=[0,1,2,3].map(()=>'<div class="bgc"><img alt=""><img alt=""></div>').join('');
  document.body.prepend(wall);
  const shown=new Set();
  const pick=()=>{const p=BG.filter(u=>!shown.has(u));return p[Math.floor(Math.random()*p.length)]};
  function swap(cell){
    const url=pick();if(!url)return;
    const im=new Image();
    im.onload=()=>{
      const [a,b]=cell.querySelectorAll('img'),cur=cell._i?b:a,next=cell._i?a:b;
      shown.delete(cell._url);shown.add(url);cell._url=url;
      next.src=url;next.classList.add('on');cur.classList.remove('on');cell._i^=1;
    };
    im.src=url;
  }
  wall.querySelectorAll('.bgc').forEach((c,i)=>{
    c._i=0; // части меняются по очереди, со сдвигом 1,25 с, каждая раз в 5 с
    setTimeout(()=>{swap(c);setInterval(()=>swap(c),5000)},i*1250);
  });
}
