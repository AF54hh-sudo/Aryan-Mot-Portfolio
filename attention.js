/* Shared attention timing. New sections begin focused on their own task. */
(() => {
  const clamp = (x,lo,hi) => Math.max(lo,Math.min(hi,x));
  const api = {
    target(now,lastMoved,entered) { return lastMoved >= entered && now-lastMoved < 2400 ? 1 : 0; },
    spring(position,velocity,target,dt) {
      const omega=target?6:4.8,t=clamp(dt,0,80)/1000;
      const offset=position-target,j=velocity+omega*offset,e=Math.exp(-omega*t);
      return {position:clamp(target+(offset+j*t)*e,0,1),velocity:(velocity-omega*j*t)*e};
    },
    damped(position,velocity,target,dt,omega=8) {
      const t=clamp(dt,0,80)/1000,offset=position-target,j=velocity+omega*offset,e=Math.exp(-omega*t);
      return {position:target+(offset+j*t)*e,velocity:(velocity-omega*j*t)*e};
    },
    step(current,target,dt,seconds) {return current+(target-current)*(1-Math.exp(-clamp(dt,0,100)/1000/seconds));},
    clamp
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else window.CharacterAttention=api;
})();
