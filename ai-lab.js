/* Illustrative AI studies; one shared clock, visibility gating and bounded canvas work. */
(() => {
 const motion=window.PortfolioMotion;if(!motion)return;
 const colors=['#8861dc','#35a9d1','#22ae93','#d978b2'];
 const assets={};[['hood-rig','webp']].forEach(([n,ext])=>{const im=new Image();im.src=`lab-assets/${n}.${ext}`;im.onload=()=>{surfaces.forEach(s=>s.last=-100);motion.wake()};assets[n]=im});
 const rigParts=[[37,92,476,445],[564,71,405,551],[139,683,227,463],[652,684,229,462],[120,1241,306,172]];
 const ease=v=>{v=Math.max(0,Math.min(1,v));return v*v*v*(v*(v*6-15)+10)};
 function track(s,key,target,dt){const a=s.actor||(s.actor={});if(a[key]===undefined){a[key]=target;a[key+'V']=0}const steps=Math.max(1,Math.ceil(dt/.012)),d=dt/steps;for(let i=0;i<steps;i++){const acc=110*(target-a[key])-21*a[key+'V'];a[key+'V']+=acc*d;a[key]+=a[key+'V']*d}return a[key]}
 function mascot(s,x,ground,scale,t,mode='work'){
 const c=s.ctx,im=assets['hood-rig'];if(!im?.complete||!im.naturalWidth)return;
 const dt=s.dt||0,phase=(t/1000+({stream:0,train:3,analyze:6,network:1,orb:4}[s.kind]||0))%16;
 // The mascot keeps the original fixed-arm silhouette. Only its gaze and head ease toward nearby attention.
 const inspect=ease((phase-3)/1.2)*(1-ease((phase-7.7)/1.3));
 const peek=ease((phase-.6)/1.7)*(1-ease((phase-12.6)/1.8));
 const rect=s.rect||{left:0,top:0},p=motion.pointer;
 const pointerDistance=Math.hypot(p.x-(rect.left+x),p.y-(rect.top+ground-72*scale));
 const recent=p.inside&&performance.now()-p.at<2400&&pointerDistance<(mode==='peek'?145:175);
 const dx=recent?Math.max(-1,Math.min(1,(p.x-rect.left-x)/240)):Math.sin(t*.0004)*.25;
 const dy=recent?Math.max(-1,Math.min(1,(p.y-rect.top-(ground-115*scale))/220)):0;
 const attention=recent?1:inspect;
 const lookX=track(s,'lookX',mode==='board'?0:dx*attention,dt),lookY=track(s,'lookY',mode==='board'?0:dy*attention,dt);
 const nod=mode==='observe'?Math.sin(t*.0024)*.55*(1-attention):0;
 const tilt=track(s,'tilt',mode==='board'?0:(mode==='observe'?-2*(1-attention):0)+lookX*5+inspect*1.5+nod,dt);
 if(mode==='peek')ground+=40*(1-peek);
 const blinkPhase=(t/1000+({stream:0,train:1.6,analyze:3.1,network:.7,orb:2}[s.kind]||0))%4.8;
 const blink=1-.93*Math.sin(Math.PI*Math.max(0,Math.min(1,(blinkPhase-4.55)/.20)));
 const draw=(i,x,y,w,h)=>c.drawImage(im,...rigParts[i],x,y,w,h);
 c.save();c.translate(x,ground);c.scale(scale,scale);
 if(mode!=='peek'){const groundShade=c.createRadialGradient(0,0,2,0,0,43);groundShade.addColorStop(0,'#263b574a');groundShade.addColorStop(.5,'#263b5723');groundShade.addColorStop(1,'#263b5700');c.save();c.scale(1,.16);c.fillStyle=groundShade;c.beginPath();c.arc(0,0,43,0,Math.PI*2);c.fill();c.restore()}
 // Draw the intact original body once: no detached hands, arm rotation or added gesture layers.
 draw(1,-30,-82,60,82);
 c.save();c.translate(lookX*1.8,-74+lookY*1.2);c.rotate(tilt*Math.PI/180);c.scale(1-Math.abs(lookX)*.022,1);draw(0,-42,-78,84,78);
 c.save();c.translate(lookX*4,-28+lookY*2);c.scale(1,blink);draw(4,-21,-12,42,24);c.restore();c.restore();c.restore();
 s.el.dataset.mascotState=recent?'watching':inspect>.5?'curious':mode==='observe'?'observing':mode==='perch'?'perched':'peeking';
 }
 const surfaces=[...document.querySelectorAll('.ai-study')].map(el=>({el,canvas:el.querySelector('canvas'),ctx:el.querySelector('canvas').getContext('2d'),kind:el.dataset.study,w:0,h:0,visible:false,last:-100,dt:0,rect:el.getBoundingClientRect()}));
 const resize=new ResizeObserver(entries=>{for(const entry of entries){const s=surfaces.find(v=>v.el===entry.target);if(!s)continue;s.w=entry.contentRect.width;s.h=entry.contentRect.height;const d=Math.min(devicePixelRatio||1,2);s.canvas.width=Math.round(s.w*d);s.canvas.height=Math.round(s.h*d);s.ctx.setTransform(d,0,0,d,0,0);s.last=-100;s.rect=s.el.getBoundingClientRect();}motion.wake()});
 const view=new IntersectionObserver(entries=>{entries.forEach(e=>{const s=surfaces.find(v=>v.el===e.target);s.visible=e.isIntersecting;s.last=-100;s.rect=s.el.getBoundingClientRect()});motion.wake()},{rootMargin:'80px'});
 surfaces.forEach(s=>{resize.observe(s.el);view.observe(s.el)});addEventListener('scroll',()=>{surfaces.forEach(s=>{if(s.visible)s.rect=s.el.getBoundingClientRect()})},{passive:true});
 function line(c,pts,color,width=1){c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.stroke()}
 function dot(c,x,y,r,color){c.fillStyle=color;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
 function text(c,str,x,y,size=11,color='#52627b'){c.fillStyle=color;c.font=`${size}px "Space Grotesk",sans-serif`;c.fillText(str,x,y)}
 function image(c,n,x,y,w,h){const im=assets[n];if(im?.complete&&im.naturalWidth){const scale=Math.max(w/im.width,h/im.height),sw=w/scale,sh=h/scale;c.drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,x,y,w,h)}}
function stream(s,t){const {ctx:c,w,h}=s;const y=h*.58, left=26,right=w-122, labels=['DATA','MODEL','INSIGHT'];for(let i=0;i<3;i++){const x=left+(right-left)*i/2;if(i<2){let grad=c.createLinearGradient(x,0,x+(right-left)/2,0);grad.addColorStop(0,colors[i]);grad.addColorStop(1,colors[i+1]);for(let j=0;j<5;j++){c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+w*.15,y-20+j*10,x+w*.2,y+20-j*10,x+(right-left)/2,y);c.strokeStyle=grad;c.globalAlpha=.22;c.lineWidth=1;c.stroke()}c.globalAlpha=1;for(let j=0;j<3;j++){const p=(t*.00017+j/3+i*.3)%1;dot(c,x+p*(right-left)/2,y+Math.sin(p*Math.PI*2)*5,2.4,colors[i])}}dot(c,x,y,8,'#fff');dot(c,x,y,4,colors[i]);text(c,labels[i],Math.min(w-58,Math.max(12,x-20)),h-12,10)}mascot(s,w-52,h-8,.78,t,'observe')}
 function train(s,t){const {ctx:c,w,h}=s;const p=((t+4000)%16000)/16000;const chart={x:22,y:67,w:w*.58,h:h-111};for(let j=0;j<4;j++)line(c,[[chart.x,chart.y+j*chart.h/3],[chart.x+chart.w,chart.y+j*chart.h/3]],'#dfe5f2');
 c.globalAlpha=Math.min(1,p*24,(1-p)*24);for(let k=0;k<2;k++){const pts=[];for(let j=0;j<=100;j++){const f=j/100;if(f>p)break;const loss=.8*Math.exp(-f*4)+.08+k*.08+Math.sin(f*35+k)*.028;pts.push([chart.x+f*chart.w,chart.y+(1-loss)*chart.h])}if(pts.length){line(c,pts,colors[k],2.2);dot(c,...pts.at(-1),3,colors[k])}}
 c.globalAlpha=1;mascot(s,w-53,h-21,.96,t,'observe');
 text(c,'LOSS',22,55,10);text(c,`EPOCH ${String(1+Math.floor(p*120)).padStart(3,'0')} / 120`,22,h-40,10);text(c,'train',22,h-22,10);line(c,[[57,h-26],[73,h-26]],colors[0],2);text(c,'validation',86,h-22,10);line(c,[[144,h-26],[160,h-26]],colors[1],2);
 }
 function analyze(s,t){
 const {ctx:c,w,h}=s,panel={x:20,y:70,w:w*.57,h:h-103};
 c.fillStyle='#ffffffcc';c.strokeStyle='#cfdced';c.lineWidth=1;c.beginPath();c.roundRect(panel.x,panel.y,panel.w,panel.h,12);c.fill();c.stroke();
 for(let i=1;i<4;i++)line(c,[[panel.x+12,panel.y+i*panel.h/4],[panel.x+panel.w-12,panel.y+i*panel.h/4]],'#dfe8f355',1);
 const pts=[];for(let i=0;i<=32;i++){const f=i/32,y=.68-.34*Math.sin(f*5.4+t*.0005)*.22-.34*f;pts.push([panel.x+12+f*(panel.w-24),panel.y+12+y*(panel.h-24)])}line(c,pts,'#6b75d8',2.2);for(let i=4;i<32;i+=7)dot(c,...pts[i],3,colors[(i/7|0)%4]);
 text(c,'LIVE ANALYSIS',panel.x+13,panel.y+18,9,'#596982');text(c,'SQL  ·  PYTHON  ·  INSIGHT',panel.x+13,panel.y+35,9,'#8694a8');
 // The mascot quietly perches behind a stack of analysis cards; its original arms remain fixed.
 mascot(s,w-68,h-34,.92,t,'perch');
 c.fillStyle='#eaf0fb';c.strokeStyle='#bfcee5';c.beginPath();c.roundRect(w-130,h-57,112,40,10);c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.roundRect(w-122,h-63,96,16,7);c.fill();c.stroke();
 text(c,'MODEL REVIEW',w-112,h-52,8,'#687892');
 }
 function network(s,t){const {ctx:c,w,h}=s;const cx=w*.34,cy=h*.52,scale=Math.min(w*.27,(h-50)*.65),angle=t*.00012;const points=[];for(let layer=0;layer<4;layer++){const plane=[];for(let j=0;j<4;j++)for(let i=0;i<4;i++){let x=(i-1.5)*.46,z=(j-1.5)*.46;const rx=x*Math.cos(angle)-z*Math.sin(angle),rz=x*Math.sin(angle)+z*Math.cos(angle);plane.push([cx+rx*scale,cy+rz*scale*.3+(layer-1.5)*33]);}points.push(plane)}
 points.forEach((plane,l)=>{const edges=[[plane[0],plane[3]],[plane[3],plane[15]],[plane[15],plane[12]],[plane[12],plane[0]]];c.fillStyle=['#cbbaf226','#a8e2f326','#b4efdc26','#dfc3ef26'][l];c.beginPath();[0,3,15,12].forEach((i,k)=>k?c.lineTo(...plane[i]):c.moveTo(...plane[i]));c.closePath();c.fill();edges.forEach(e=>line(c,e,colors[l]+'80',1));plane.forEach((p,i)=>{if(l<3){const end=points[l+1][(i*5)%16];line(c,[p,end],colors[l]+'24',.7);const f=(t*.0003+i*.09)%1;dot(c,p[0]+(end[0]-p[0])*f,p[1]+(end[1]-p[1])*f,1.5,colors[l])}dot(c,...p,1.8,colors[l])})});c.fillStyle='#d5eef3dc';c.strokeStyle='#6ebfc9';c.lineWidth=1;c.beginPath();c.roundRect(w-147,h-78,67,35,5);c.fill();c.stroke();for(let i=0;i<3;i++){line(c,[[w-138,h-68+i*8],[w-95,h-68+i*8]],'#74aab966',1);dot(c,w-136+(Math.sin(t*.002+i)+1)*18,h-68+i*8,2,colors[i])}mascot(s,w-53,h-20,1.03,t,'observe');}
 function orb(s,t){const {ctx:c,w,h}=s;const cx=w*.23,cy=h*.6,R=32;for(let a=0;a<26;a++)for(let b=0;b<15;b++){const theta=a/26*Math.PI*2+t*.00025,phi=b/14*Math.PI;let r=R*(1+.12*Math.sin(theta*3+t*.001+phi*4));const z=Math.sin(theta)*Math.sin(phi),x=Math.cos(theta)*Math.sin(phi)*r,y=Math.cos(phi)*r;c.globalAlpha=.35+(z+1)*.3;dot(c,cx+x,cy+y,1,colors[(b%3)])}c.globalAlpha=1;for(let j=0;j<35;j++){let x=w*.45+j*(w*.25/35),amp=5+17*(.5+.5*Math.sin(j*.4+t*.003));line(c,[[x,cy-amp],[x,cy+amp]],colors[j%3]+'aa',2)}mascot(s,w-42,h-8,.63,t,'observe'); }
 function hologram(s,t){
 const {ctx:c,w,h}=s,mode=s.el.dataset.mode||'ds',topic=s.el.dataset.topic||'Machine Learning';
 if(s.boardMode!==mode){s.previousMode=s.boardMode||mode;s.boardMode=mode;s.boardChanged=t}
 const mix=ease((t-s.boardChanged)/650);
 c.save();c.scale(w/480,h/360);
 c.fillStyle='rgba(189,234,251,.09)';c.strokeStyle='#48a6c780';c.lineWidth=1;
 c.beginPath();c.roundRect(8,12,346,318,14);c.fill();c.stroke();
 c.save();c.beginPath();c.roundRect(16,20,330,300,9);c.clip();
 function layer(kind,opacity){if(opacity<=0)return;c.save();c.globalAlpha=opacity;
 text(c,{da:'DATA ANALYTICS',ds:'DATA SCIENCE',ai:'AI ENGINEERING',de:'DATA ENGINEERING',be:'BACKEND & DEPLOYMENT'}[kind],27,43,13,'#2b7493');
 c.fillStyle='#655899';c.font='13px "Space Grotesk",sans-serif';c.fillText(topic,27,65,300);
 const formulas={da:['SUM(sales) / COUNT(stores)','date   category   revenue','μ = Σx / n','GROUP BY region'],ds:['L(θ) = Σ(y − ŷ)² / n','features + labels → learning','train → validate → predict','θ ← θ − η∇L'],ai:['Attention(Q,K,V)','retrieve → reason → verify','tokens → vectors → context','agent → tool → observation'],de:['source → transform → warehouse','schema checks + deduplication','batch jobs + event streams','partition → validate → load'],be:['request → validate → response','API contract + error handling','build → test → deploy','logs + health checks']}[kind];
 for(let i=0;i<4;i++){const y=88+((i*18-t*.006)%72+72)%72;const fade=Math.min(1,(y-88)/12,(160-y)/12);c.globalAlpha=opacity*Math.max(0,fade)*.8;text(c,formulas[i],27,y,12,'#367b98')}
 c.globalAlpha=opacity;
 if(kind==='da'){
 for(let i=0;i<6;i++){const height=20+(1+Math.sin(t*.001+i*.8))*24;c.fillStyle=colors[i%4]+'aa';c.fillRect(29+i*28,242-height,17,height)}
 line(c,[[25,169],[25,243],[202,243]],'#729eae88');
 for(let i=0;i<4;i++){text(c,['date','text','integer','float'][i],220,181+i*19,12,'#4b6785');dot(c,207,177+i*19,3,colors[i])}
 const pts=[];for(let i=0;i<70;i++)pts.push([28+i*4,282+Math.sin(i*.1-t*.001)*13]);line(c,pts,'#567fcd',1.8);
 }else if(kind==='ds'){
 for(let i=0;i<28;i++){const x=29+(i*31)%126,y=238-((i*31)%126)*.42+Math.sin(i*7)*17;dot(c,x,y,2.8,colors[i%3]+'aa')}
 line(c,[[25,248],[154,182]],'#35a9d180',1.5);
 const curve=[];for(let i=0;i<75;i++){const f=i/74;curve.push([178+f*138,175+59*(1-Math.exp(-f*3))+Math.sin(f*15+t*.001)*2])}line(c,curve,'#8763d7',2);
 text(c,'FEATURES & FIT',28,266,11);text(c,'TRAINING LOSS',178,266,11);
 for(let i=0;i<8;i++){c.fillStyle='#52a7c633';c.fillRect(29+i*36,287,27,9);c.fillStyle=colors[i%3];c.fillRect(29+i*36,287,27*(.5+.5*Math.sin(t*.001-i*.4)),9)}
 }else if(kind==='de'){
 const names=['SOURCE','VALIDATE','WAREHOUSE'];
 for(let i=0;i<3;i++){const x=26+i*105;c.strokeStyle=colors[i]+'aa';c.fillStyle=colors[i]+'09';c.beginPath();c.roundRect(x,174,88,65,7);c.fill();c.stroke();text(c,names[i],x+5,191,10,colors[i]);for(let row=0;row<3;row++){const y=204+row*10;line(c,[[x+8,y],[x+78,y]],colors[i]+'44',2);dot(c,x+10+((t*.018+row*19)%62),y,2,colors[i])}if(i<2){line(c,[[x+88,207],[x+105,207]],'#70a8b677',1.5);dot(c,x+88+(t*.015%17),207,2.5,colors[i])}}
 text(c,'INGEST',28,264,11);text(c,'CHECK',134,264,11);text(c,'LOAD',239,264,11);
 for(let j=0;j<3;j++){const y=281+j*12;text(c,['schema matched','duplicates removed','partition ready'][j],28,y,10,'#4b7485');line(c,[[188,y-4],[316,y-4]],'#69baae33',3);line(c,[[188,y-4],[188+128*(.5+.5*Math.sin(t*.001-j)),y-4]],colors[j],3)}
 }else if(kind==='be'){
 const boxes=[{x:27,y:175,w:83,name:'CLIENT'},{x:141,y:175,w:80,name:'API'},{x:250,y:175,w:73,name:'DB'}];
 boxes.forEach((b,i)=>{c.strokeStyle=colors[i];c.beginPath();c.roundRect(b.x,b.y,b.w,37,6);c.stroke();text(c,b.name,b.x+12,b.y+23,12);if(i<2){const a=b.x+b.w,z=boxes[i+1].x;line(c,[[a,193],[z,193]],'#798ab488',1.5);dot(c,a+(z-a)*((t*.0007+i*.3)%1),193,3,colors[i])}});
 const stages=['BUILD','TEST','DEPLOY'];stages.forEach((label,i)=>{const x=28+i*103;dot(c,x+4,237,3,colors[i]);text(c,label,x+13,241,11);line(c,[[x,251],[x+86,251]],colors[i]+'33',4);line(c,[[x,251],[x+86*(.5+.5*Math.sin(t*.001-i)) ,251]],colors[i],4)});
 text(c,'ILLUSTRATIVE REQUEST LOG',28,274,10,'#64879b');
 for(let i=0;i<2;i++){const offset=Math.floor(t/2000)%3;text(c,['GET /health     200 OK','POST /predict   validated','GET /results    200 OK'][(i+offset)%3],28,290+i*17,11,'#407689')}
 }else{
 const labels=['CONTEXT','LLM','AGENT','TOOLS'];for(let i=0;i<4;i++){const x=25+i*77;c.strokeStyle=colors[i]+'99';c.beginPath();c.roundRect(x,173,65,35,6);c.stroke();text(c,labels[i],x+6,194,11);if(i<3){line(c,[[x+65,190],[x+77,190]],'#6c8fa388');dot(c,x+65+(t*.02%12),190,2,colors[i])}}
 for(let l=0;l<4;l++)for(let r=0;r<3;r++){const x=40+l*86,y=237+r*24;if(l<3)for(let j=0;j<3;j++){const ex=x+86,ey=237+j*24;line(c,[[x,y],[ex,ey]],'#6b8fd333',.8);const p=(t*.00015+r*.2+j*.17)%1;dot(c,x+86*p,y+(ey-y)*p,1.8,colors[l])}dot(c,x,y,3,colors[(l+r)%4])}
 }
 c.restore()}
 layer(s.previousMode,1-mix);layer(mode,mix);
 c.restore();c.restore();
 // Render the opaque, front-facing mascot outside the transparent board.
 c.globalAlpha=1;mascot(s,w*.86,h-15,Math.min(1.48,w/320),t,'board');
 }
 const renderers={stream,train,analyze,network,orb,hologram};motion.subscribe((time,dt,paused)=>{for(const s of surfaces){if(!s.visible||!s.w||(!paused&&time-s.last<16))continue;if(paused&&s.last===time)continue;s.last=time;s.dt=paused?0:Math.min(dt,40)/1000;s.ctx.clearRect(0,0,s.w,s.h);renderers[s.kind](s,time)}});
})();
