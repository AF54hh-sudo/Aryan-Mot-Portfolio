(() => {
  const M=window.PortfolioMotion,A=window.CharacterAttention;
  const canvas=document.querySelector('#network-background'),ctx=canvas.getContext('2d'),ring=document.querySelector('.cursor-ring'),progress=document.querySelector('.scroll-progress');
  const cursor={x:M.pointer.x,y:M.pointer.y};let width=0,height=0,dpr=1,points=[],dirty=true,hover=null,lastBackground=-Infinity;
  function resize(){width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);points=[];const gap=125;for(let y=-gap;y<height+gap;y+=gap)for(let x=-gap;x<width+gap;x+=gap)points.push({x:x+Math.sin(y*.038+x*.014)*30,y:y+Math.cos(x*.021)*28,phase:x*.009+y*.007});dirty=true;M.wake()}
  addEventListener('resize',resize,{passive:true});addEventListener('scroll',()=>{dirty=true;M.wake()},{passive:true});resize();
  document.addEventListener('pointerover',e=>{hover=e.target.closest('a,button');ring.classList.toggle('link-hover',!!hover);ring.querySelector('span').textContent=''});
  const magnetic=[...document.querySelectorAll('[data-magnetic]')].map(el=>({el,x:0,y:0}));
  const spots=[];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const s=spots.find(s=>s.el===e.target);if(s)s.visible=e.isIntersecting}),{rootMargin:'60px'});
  function registerSpotlight(el){
    if(spots.some(s=>s.el===el))return;
    spots.push({el,x:0,y:0,visible:false});
    observer.observe(el);
    M.wake();
  }
  M.registerSpotlight=registerSpotlight;
  document.querySelectorAll('[data-spotlight]').forEach(registerSpotlight);
  M.subscribe((time,dt,paused)=>{
    cursor.x=A.step(cursor.x,M.pointer.x,dt,.085);cursor.y=A.step(cursor.y,M.pointer.y,dt,.085);
    ring.style.transform=`translate3d(${cursor.x}px,${cursor.y}px,0) translate(-50%,-50%)`;ring.style.opacity=M.pointer.inside&&M.fine.matches&&!paused?'1':'0';
    const total=document.documentElement.scrollHeight-height;progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;
    magnetic.forEach(s=>{const r=s.el.getBoundingClientRect(),near=!paused&&M.fine.matches&&M.pointer.inside&&M.pointer.x>r.left-15&&M.pointer.x<r.right+15&&M.pointer.y>r.top-15&&M.pointer.y<r.bottom+15;const x=near?(M.pointer.x-r.left-r.width/2)*.08:0,y=near?(M.pointer.y-r.top-r.height/2)*.14:0;s.x=A.step(s.x,x,dt,.14);s.y=A.step(s.y,y,dt,.14);s.el.style.transform=`translate3d(${s.x}px,${s.y}px,0)`});
    spots.forEach(s=>{if(!s.visible)return;const r=s.el.getBoundingClientRect(),inside=!paused&&M.pointer.inside&&M.pointer.x>=r.left&&M.pointer.x<=r.right&&M.pointer.y>=r.top&&M.pointer.y<=r.bottom;s.x=A.step(s.x,M.pointer.x-r.left,dt,.09);s.y=A.step(s.y,M.pointer.y-r.top,dt,.09);s.el.style.setProperty('--light-x',s.x+'px');s.el.style.setProperty('--light-y',s.y+'px');s.el.style.setProperty('--light-opacity',inside?'1':'0')});
    if(paused&&!dirty)return;if(!paused&&!dirty&&time-lastBackground<30)return;lastBackground=time;dirty=false;ctx.clearRect(0,0,width,height);
    const px=paused?-1000:cursor.x,py=paused?-1000:cursor.y,active=M.pointer.inside&&!paused;
    const palette=['125,91,224','44,156,211','35,172,147','228,119,154','225,159,61'];
    if(active){const glow=ctx.createRadialGradient(px,py,0,px,py,300);glow.addColorStop(0,'rgba(161,126,237,.09)');glow.addColorStop(.55,'rgba(86,201,206,.04)');glow.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height)}
    const positioned=points.map((p,i)=>{const distance=Math.hypot(p.x-px,p.y-py),weight=active?Math.max(0,1-distance/330):0;return{x:p.x+Math.sin(time*.00018+p.phase)*7+(px-p.x)*weight*.055,y:p.y+Math.cos(time*.00015+p.phase)*7+(py-p.y)*weight*.055,weight,color:palette[i%palette.length]}});
    for(let i=0;i<positioned.length;i++){
      const a=positioned[i];
      for(let j=i+1;j<positioned.length;j++){
        const b=positioned[j],dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist>165)continue;
        const energy=Math.max(a.weight,b.weight),alpha=(.15+energy*.85)*(1-dist/230);
        const gradient=ctx.createLinearGradient(a.x,a.y,b.x,b.y);gradient.addColorStop(0,`rgba(${a.color},${alpha})`);gradient.addColorStop(1,`rgba(${b.color},${alpha})`);ctx.strokeStyle=gradient;ctx.lineWidth=.85+energy*1.8;
        const cx=(a.x+b.x)/2+Math.sin(time*.0003+i)*12*energy,cy=(a.y+b.y)/2+Math.cos(time*.0003+j)*12*energy;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo(cx,cy,b.x,b.y);ctx.stroke();
        if(energy>.06&&!paused){const t=(time*.0003+(i*7+j)*.131)%1,u=1-t,x=u*u*a.x+2*u*t*cx+t*t*b.x,y=u*u*a.y+2*u*t*cy+t*t*b.y;ctx.fillStyle=`rgba(${b.color},${energy*.8})`;ctx.beginPath();ctx.arc(x,y,1.4+energy,0,Math.PI*2);ctx.fill()}
      }
      ctx.fillStyle=`rgba(${a.color},${.24+a.weight*.6})`;ctx.beginPath();ctx.arc(a.x,a.y,1.4+a.weight*2,0,Math.PI*2);ctx.fill();
      if(a.weight>.3){ctx.strokeStyle=`rgba(${a.color},${a.weight*.16})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(a.x,a.y,5+a.weight*4,0,Math.PI*2);ctx.stroke()}
    }
  });
})();
