
(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- language ---------- */
function splitWords(el){
  const walk=n=>{[...n.childNodes].forEach(c=>{
    if(c.nodeType===3){const parts=c.textContent.split(/(\s+)/);const f=document.createDocumentFragment();parts.forEach(p=>{if(!p)return;if(/^\s+$/.test(p))f.appendChild(document.createTextNode(p));else{const s=document.createElement('span');s.className='sw';s.textContent=p;f.appendChild(s)}});c.replaceWith(f)}
    else if(c.nodeType===1)walk(c)})};
  walk(el);return $$('.sw',el);
}
let stmtWords=[];
function setLang(l){
  document.documentElement.lang=l;
  $$('[data-pa]').forEach(el=>{if(el.dataset.en===undefined)el.dataset.en=el.innerHTML;el.innerHTML=l==='pa'?el.dataset.pa:el.dataset.en});
  $$('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===l));
  stmtWords=splitWords($('#stmt'));
  if(window.ScrollTrigger){buildStmt();ScrollTrigger.refresh()}
}
$$('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
stmtWords=splitWords($('#stmt'));

/* ---------- faq ---------- */
$$('.qa button').forEach(b=>b.addEventListener('click',()=>{const q=b.parentElement,o=!q.classList.contains('open');q.classList.toggle('open',o);b.setAttribute('aria-expanded',o)}));

/* ---------- button fill origin ---------- */
$$('.btn').forEach(b=>b.addEventListener('pointerenter',e=>{const r=b.getBoundingClientRect();b.style.setProperty('--x',(e.clientX-r.left)+'px');b.style.setProperty('--y',(e.clientY-r.top)+'px')}));

/* ---------- drag scroll for clippings ---------- */
const clips=$('#clips');let dn=false,sx=0,sl=0;
clips.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;dn=true;sx=e.clientX;sl=clips.scrollLeft;clips.style.scrollSnapType='none'});
addEventListener('pointerup',()=>{if(dn){dn=false;clips.style.scrollSnapType=''}});
clips.addEventListener('pointermove',e=>{if(dn)clips.scrollLeft=sl-(e.clientX-sx)});

/* ---------- doctors floating image ---------- */
const fl=$('#dfloat'),fimgs=$$('img',fl);
if(matchMedia('(hover:hover) and (min-width:861px)').matches){
  let tx=0,ty=0,x=0,y=0;
  $('#dlist').addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});
  $$('.drow').forEach(r=>{r.addEventListener('pointerenter',e=>{fimgs.forEach((im,i)=>im.classList.toggle('on',i==r.dataset.img));fl.classList.add('on');if(!x){x=tx=e.clientX;y=ty=e.clientY}});r.addEventListener('pointerleave',()=>fl.classList.remove('on'))});
  (function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;fl.style.left=x+'px';fl.style.top=y+'px';requestAnimationFrame(loop)})();
}

/* ---------- header ---------- */
const hdr=$('#hdr');let ly=0;
addEventListener('scroll',()=>{const y=scrollY;hdr.classList.toggle('solid',y>20);hdr.classList.toggle('hide',y>ly&&y>400);ly=y},{passive:true});

/* ---------- count without gsap ---------- */
function countUp(el){const end=el.dataset.since?new Date().getFullYear()-(+el.dataset.since):+el.dataset.count;const t0=performance.now();const d=1600;(function f(t){const p=Math.min(1,(t-t0)/d);el.textContent=Math.round(end*(1-Math.pow(1-p,4)));if(p<1)requestAnimationFrame(f)})(t0)}

if(!window.gsap||!window.ScrollTrigger||RM){window.buildStmt=()=>{};return}
gsap.registerPlugin(ScrollTrigger);

/* smooth scroll */
let lenis=null;
if(window.Lenis){lenis=new Lenis({lerp:.09});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-20,duration:1.4})}}));}

/* hero waterfall intro */
gsap.from('#hl .w',{yPercent:115,rotate:6,opacity:0,duration:1.25,ease:'expo.out',stagger:.07,delay:.15});
gsap.from('.hero-eb',{y:20,opacity:0,duration:1,ease:'expo.out'});
gsap.from('.hfade',{y:40,opacity:0,duration:1.1,ease:'expo.out',stagger:.08,delay:.55});
gsap.fromTo('#heroMedia',{clipPath:'inset(0% 8% 0% 8% round 32px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:'#heroMedia',start:'top 88%',end:'top 10%',scrub:true}});
gsap.fromTo('#heroMedia img',{scale:1.22},{scale:1,ease:'none',scrollTrigger:{trigger:'#heroMedia',start:'top bottom',end:'bottom top',scrub:true}});

/* statement word highlight */
let stmtTw=null;
window.buildStmt=function(){if(stmtTw){stmtTw.scrollTrigger&&stmtTw.scrollTrigger.kill();stmtTw.kill()}
  stmtTw=gsap.fromTo(stmtWords,{opacity:.14},{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:'#stmt',start:'top 82%',end:'bottom 45%',scrub:true}})};
buildStmt();

const mm=gsap.matchMedia();

/* department stacking */
mm.add('(min-width:861px)',()=>{
  const cards=$$('.dcard');
  cards.forEach((c,i)=>{
    gsap.fromTo($('.dc-media img',c),{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:c,start:'top bottom',end:'bottom top',scrub:true}});
    if(i<cards.length-1){gsap.to(c,{scale:.9-(cards.length-2-i)*.02,filter:'brightness(.8)',ease:'none',scrollTrigger:{trigger:cards[i+1],start:'top bottom',end:'top 30%',scrub:true}})}
  });
});
mm.add('(max-width:860px)',()=>{$$('.dcard').forEach(c=>gsap.from(c,{y:60,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:c,start:'top 88%'}}))});

/* bento assemble on scroll */
mm.add('(min-width:900px)',()=>{
  const off=[[-120,80,-6],[140,60,5],[-80,140,4],[0,160,-3],[160,120,6],[-140,160,-5],[60,180,3]];
  $$('#bento .bx').forEach((b,i)=>{const [x,y,r]=off[i%off.length];
    gsap.fromTo(b,{x,y,rotate:r,scale:.86,opacity:0},{x:0,y:0,rotate:0,scale:1,opacity:1,ease:'power2.out',scrollTrigger:{trigger:'#bento',start:'top 95%',end:'top 30%',scrub:1}})});
});
mm.add('(max-width:899px)',()=>{$$('#bento .bx').forEach(b=>gsap.from(b,{y:50,opacity:0,duration:.9,ease:'expo.out',scrollTrigger:{trigger:b,start:'top 92%'}}))});
$$('[data-count]').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 85%',once:true,onEnter:()=>countUp(el)}));

/* robotic horizontal scroll */
mm.add('(min-width:1024px)',()=>{
  const track=$('#rbTrack');const dist=()=>track.scrollWidth-innerWidth;
  const tw=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.rb',start:'top top',end:()=>'+='+dist(),pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:s=>gsap.set('#rbProg',{scaleX:s.progress})}});
  $$('.rb .draw').forEach(p=>{const L=p.getTotalLength?p.getTotalLength():400;gsap.fromTo(p,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:p.closest('.rb-p'),containerAnimation:tw,start:'left 85%',end:'left 35%',scrub:true}})});
  $$('.rb .pt').forEach(p=>gsap.from(p,{scale:0,transformOrigin:'50% 50%',ease:'back.out(3)',scrollTrigger:{trigger:p.closest('.rb-p'),containerAnimation:tw,start:'left 55%',end:'left 35%',scrub:true}}));
  gsap.fromTo('.g1',{scaleY:.55},{scaleY:1,ease:'none',scrollTrigger:{trigger:$('.g1').closest('.rb-p'),containerAnimation:tw,start:'left 70%',end:'left 25%',scrub:true}});
  gsap.fromTo('.g2',{scaleY:1.3},{scaleY:1,ease:'none',scrollTrigger:{trigger:$('.g2').closest('.rb-p'),containerAnimation:tw,start:'left 70%',end:'left 25%',scrub:true}});
});
mm.add('(max-width:1023px)',()=>{
  $$('.rb .draw').forEach(p=>{const L=p.getTotalLength?p.getTotalLength():400;gsap.fromTo(p,{strokeDasharray:L,strokeDashoffset:L},{strokeDashoffset:0,duration:1.6,ease:'power2.out',scrollTrigger:{trigger:p,start:'top 85%'}})});
  $$('.rb-p').forEach(p=>gsap.from(p,{y:50,opacity:0,duration:.9,ease:'expo.out',scrollTrigger:{trigger:p,start:'top 90%'}}));
});

/* waterfall gallery: endless columns, speed follows scroll */
const cols=$$('.wf-track').map((t,i)=>{const down=i%2===1;return gsap.fromTo(t,{yPercent:down?-50:0},{yPercent:down?0:-50,duration:46+i*8,ease:'none',repeat:-1})});
let boost={v:1};
ScrollTrigger.create({trigger:'.wf',start:'top bottom',end:'bottom top',onUpdate:s=>{const v=Math.min(Math.abs(s.getVelocity())/300,6);gsap.to(boost,{v:1+v,duration:.2,overwrite:true,onUpdate:()=>cols.forEach(c=>c.timeScale(boost.v)),onComplete:()=>gsap.to(boost,{v:1,duration:1.4,ease:'power2.out',onUpdate:()=>cols.forEach(c=>c.timeScale(boost.v))})})},onToggle:s=>cols.forEach(c=>s.isActive?c.play():c.pause())});
gsap.from('.fac div',{y:30,opacity:0,stagger:.06,duration:.8,ease:'expo.out',scrollTrigger:{trigger:'.fac',start:'top 85%'}});

/* journey cascade */
gsap.from('#jrSteps .st',{y:-90,opacity:0,duration:1.3,ease:'bounce.out',stagger:.22,scrollTrigger:{trigger:'#jrSteps',start:'top 78%'}});
gsap.from('.jr-stream',{clipPath:'inset(0 100% 0 0)',duration:2,ease:'power2.inOut',scrollTrigger:{trigger:'#jrSteps',start:'top 78%'}});

/* doctors rows */
gsap.from('.drow',{y:50,opacity:0,stagger:.1,duration:1,ease:'expo.out',scrollTrigger:{trigger:'#dlist',start:'top 85%'}});

/* timeline */
gsap.to('#tlFill',{scaleY:1,ease:'none',scrollTrigger:{trigger:'#tl',start:'top 70%',end:'bottom 60%',scrub:true}});
$$('.ti').forEach(t=>ScrollTrigger.create({trigger:t,start:'top 68%',onEnter:()=>t.classList.add('on'),onLeaveBack:()=>t.classList.remove('on')}));
mm.add('(min-width:1024px)',()=>{gsap.fromTo('.story figure img',{scale:1.2},{scale:1,ease:'none',scrollTrigger:{trigger:'.story',start:'top bottom',end:'bottom top',scrub:true}})});

/* marquee direction follows scroll */
const mq=$('#mq');const mqT=gsap.to(mq,{xPercent:-50,duration:38,ease:'none',repeat:-1});
ScrollTrigger.create({trigger:'.press',start:'top bottom',end:'bottom top',onUpdate:s=>gsap.to(mqT,{timeScale:s.direction*(1+Math.min(Math.abs(s.getVelocity())/500,4)),duration:.3,overwrite:true})});
gsap.from('.clip',{y:80,opacity:0,stagger:.08,duration:1,ease:'expo.out',scrollTrigger:{trigger:'#clips',start:'top 90%'}});

/* section headings rise */
$$('.h2').forEach(h=>{if(h.closest('.hero')||h.closest('.rb-intro'))return;gsap.from(h,{y:60,opacity:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 88%'}})});
gsap.from('.cta h2',{yPercent:30,opacity:0,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.cta',start:'top 75%'}});
gsap.to('.cta .pat',{rotate:90,ease:'none',scrollTrigger:{trigger:'.cta',start:'top bottom',end:'bottom bottom',scrub:true}});

/* magnetic */
if(matchMedia('(hover:hover)').matches){$$('.mag').forEach(b=>{const xT=gsap.quickTo(b,'x',{duration:.5,ease:'power3'}),yT=gsap.quickTo(b,'y',{duration:.5,ease:'power3'});b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();xT((e.clientX-r.left-r.width/2)*.3);yT((e.clientY-r.top-r.height/2)*.3)});b.addEventListener('pointerleave',()=>{xT(0);yT(0)})})}

addEventListener('load',()=>ScrollTrigger.refresh());
})();
