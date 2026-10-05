/* Intact working poses. Interaction reveals activity cards only. */
(() => {
  const names={laptop:'Show laptop activity',models:'Show AI model activity',peek:'Show data analysis activity',notebook:'Show notebook activity',phone:'Show location activity'};
  document.querySelectorAll('[data-scene]').forEach((scene,index)=>{
    const art=scene.querySelector('.scene-art'),popup=scene.querySelector('.action-popup');
    if(!art||!popup)return;
    let hovering=false,pinned=false,focused=false,dismissed=false;
    popup.id='activity-card-'+index;
    art.setAttribute('role','button');art.tabIndex=0;art.setAttribute('aria-label',names[scene.dataset.scene]);art.setAttribute('aria-controls',popup.id);
    const update=()=>{const open=!dismissed&&(hovering||pinned||focused);scene.classList.toggle('activity-open',open);art.setAttribute('aria-expanded',String(open));popup.setAttribute('aria-hidden',String(!open));};
    art.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hovering=true;dismissed=false;update()}});
    art.addEventListener('pointerleave',()=>{hovering=false;dismissed=false;update()});
    art.addEventListener('focus',()=>{focused=art.matches(':focus-visible');dismissed=false;update()});
    art.addEventListener('blur',()=>{focused=false;pinned=false;update()});
    art.addEventListener('click',()=>{pinned=!pinned;dismissed=!pinned&&!hovering&&!focused;update()});
    art.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pinned=!pinned;dismissed=!pinned;update()}if(e.key==='Escape'){pinned=false;focused=false;dismissed=true;update()}});
    update();
  });
})();
