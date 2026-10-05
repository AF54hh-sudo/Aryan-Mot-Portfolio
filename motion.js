/* One clock, one animation frame, time-based springs for every moving surface. */
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const fine=matchMedia('(pointer: fine)');
  const pointer={x:innerWidth*.5,y:innerHeight*.5,at:-Infinity,inside:false,type:'mouse'};
  const subscribers=new Set();let paused=reduced.matches,last=0,clock=0,frame=0,smoothedFrame=16.67;
  const api={pointer,fine,get paused(){return paused},subscribe(fn){subscribers.add(fn);wake();return()=>subscribers.delete(fn)},wake};
  function tick(now){frame=0;if(document.hidden){last=0;return}const dt=last?Math.min(64,now-last):16.67;last=now;smoothedFrame+=(dt-smoothedFrame)*.04;document.documentElement.dataset.frameMs=smoothedFrame.toFixed(2);if(!paused)clock+=dt;
    subscribers.forEach(fn=>{try{fn(clock,paused?0:dt,paused)}catch(e){console.error('Motion surface failed',e)}});
    if(!paused)frame=requestAnimationFrame(tick);
  }
  function wake(){if(!frame&&!document.hidden)frame=requestAnimationFrame(tick)}
  addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.at=performance.now();pointer.inside=true;pointer.type=e.pointerType;wake()},{passive:true});
  addEventListener('pointerdown',e=>{pointer.x=e.clientX;pointer.y=e.clientY;pointer.at=performance.now();pointer.inside=true;pointer.type=e.pointerType;wake()},{passive:true});
  document.addEventListener('pointerout',e=>{if(!e.relatedTarget){pointer.inside=false;wake()}},{passive:true});
  document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0}else wake()});
  function apply(){document.body.classList.toggle('motion-off',paused);const b=document.querySelector('.motion-toggle');b.textContent=paused?'Enable motion':'Pause motion';b.setAttribute('aria-pressed',String(paused));last=0;wake()}
  document.querySelector('.motion-toggle').addEventListener('click',()=>{paused=!paused;apply()});reduced.addEventListener('change',()=>{paused=reduced.matches;apply()});window.PortfolioMotion=api;apply();
})();
