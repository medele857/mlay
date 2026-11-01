// Пиксели вылетают из правого нижнего угла при скролле вниз (только главная страница)
(()=>{
  if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const cv=document.createElement('canvas');
  cv.style.cssText='position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0';
  cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
  const ctx=cv.getContext('2d');let W,H;
  function size(){const d=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;ctx.setTransform(d,0,0,d,0,0)}
  size();addEventListener('resize',size);
  const COL=['#b8f25b','#ff6b5e','#5bc8ff','#ffc83d','#ff7ac8'];
  let P=[],run=false,lastY=scrollY;
  function spawn(n){
    for(let i=0;i<n&&P.length<260;i++){
      const a=Math.PI+Math.random()*Math.PI/2,v=7+Math.random()*13;
      P.push({x:W,y:H,vx:Math.cos(a)*v,vy:Math.sin(a)*v,s:8*(1+Math.floor(Math.random()*3)),
        c:COL[Math.floor(Math.random()*COL.length)],life:0,max:55+Math.random()*60});
    }
  }
  function frame(){
    ctx.clearRect(0,0,W,H);
    P=P.filter(p=>p.life<p.max);
    for(const p of P){
      p.life++;p.x+=p.vx;p.y+=p.vy;p.vx*=.955;p.vy=p.vy*.955+.12;
      const k=p.life/p.max;
      ctx.globalAlpha=k<.7?.85:.85*(1-(k-.7)/.3);
      ctx.fillStyle=p.c;
      ctx.fillRect(Math.round(p.x/p.s)*p.s,Math.round(p.y/p.s)*p.s,p.s,p.s); // привязка к сетке = пиксельный вид
    }
    ctx.globalAlpha=1;
    if(P.length)requestAnimationFrame(frame);else run=false;
  }
  addEventListener('scroll',()=>{
    const dy=scrollY-lastY;lastY=scrollY;
    if(dy<=0)return;
    spawn(Math.min(7,1+Math.floor(dy/15)));
    if(!run){run=true;requestAnimationFrame(frame)}
  },{passive:true});
})();
