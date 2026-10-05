/* Section-aware ambient presentation. Character artwork is never transformed. */
(() => {
  const chapters=[...document.querySelectorAll('.chapter-nav a')];
  const colors={home:'78,114,229',work:'35,135,127',about:'66,119,162',experience:'104,91,170',contact:'43,139,132'};
  const observer=new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;const id=e.target.id;document.documentElement.style.setProperty('--section-glow',colors[id]);chapters.forEach(a=>{if(a.hash==='#'+id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}},{rootMargin:'-20% 0px -55% 0px',threshold:0});
  document.querySelectorAll('main>section[id]').forEach(s=>observer.observe(s));
})();
