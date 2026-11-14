(()=>{
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let LANG='en';

/* years since 1980 */
$$('[data-since]').forEach(el=>el.textContent=new Date().getFullYear()-(+el.dataset.since));

/* ---------- hours: hospital open 24 hours, every day ---------- */
const DAYS=[['Mon','ਸੋਮ'],['Tue','ਮੰਗਲ'],['Wed','ਬੁੱਧ'],['Thu','ਵੀਰ'],['Fri','ਸ਼ੁੱਕਰ'],['Sat','ਸ਼ਨੀ'],['Sun','ਐਤ']];
const H={0:[[0,24]],1:[[0,24]],2:[[0,24]],3:[[0,24]],4:[[0,24]],5:[[0,24]],6:[[0,24]]};
const A=0,B=24;
function renderHours(){
  const ul=$('#hours');ul.innerHTML='';
  const now=new Date();const today=(now.getDay()+6)%7;const hr=now.getHours()+now.getMinutes()/60;
  DAYS.forEach((d,i)=>{
    const s=H[i]||[];const li=document.createElement('li');li.className='hr'+(i===today?' today':'');
    const segs=s.map(p=>`<span class="s" style="left:${(p[0]-A)/(B-A)*100}%;width:${(p[1]-p[0])/(B-A)*100}%"></span>`).join('');
    const nowLine=i===today?`<span class="now" style="left:${(hr-A)/(B-A)*100}%"></span>`:'';
    const txt=LANG==='pa'?'24 ਘੰਟੇ ਖੁੱਲ੍ਹਾ':'Open 24 hours';
    li.innerHTML=`<span class="d">${d[LANG==='pa'?1:0]}</span><span class="t">${segs}${nowLine}</span><span class="h">${txt}</span>`;
    ul.appendChild(li);
  });
  $('#vStatus').classList.add('open');
  $('#vStatusTx').textContent=LANG==='pa'?'ਹੁਣ ਖੁੱਲ੍ਹਾ ਹੈ · 24 ਘੰਟੇ':'Open now · 24 hours';
}
renderHours();

/* ---------- language ---------- */
function setLang(l){LANG=l;document.documentElement.lang=l;
  $$('[data-pa]').forEach(el=>{if(el.dataset.en===undefined)el.dataset.en=el.innerHTML;el.innerHTML=l==='pa'?el.dataset.pa:el.dataset.en});
  $$('.lang button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===l));renderHours();if(window.ScrollTrigger)ScrollTrigger.refresh()}
$$('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));

/* ---------- buttons ---------- */
$$('.btn').forEach(b=>b.addEventListener('pointerenter',e=>{const r=b.getBoundingClientRect();b.style.setProperty('--x',(e.clientX-r.left)+'px');b.style.setProperty('--y',(e.clientY-r.top)+'px')}));

/* ---------- hero panels ---------- */
const wrapP=$('#hxp'),panels=$$('.hp',wrapP);let cur=0,timer;const D=6000;
function openP(i){cur=i;panels.forEach((p,k)=>{p.classList.toggle('on',k===i);p.setAttribute('aria-selected',k===i);const b=$('.bar i',p);b.style.animation='none';b.offsetHeight;b.style.animation=''})}
function play(){clearInterval(timer);if(RM)return;timer=setInterval(()=>{if(!wrapP.classList.contains('paused'))openP((cur+1)%panels.length)},D)}
panels.forEach((p,i)=>{
  p.addEventListener('click',e=>{if(!p.classList.contains('on')){e.preventDefault();openP(i);play()}});
  p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openP(i);play()}if(e.key==='ArrowRight'){panels[(i+1)%3].focus();openP((i+1)%3)}if(e.key==='ArrowLeft'){panels[(i+2)%3].focus();openP((i+2)%3)}});
  if(matchMedia('(hover:hover)').matches)p.addEventListener('mouseenter',()=>{openP(i);});
});
wrapP.addEventListener('mouseenter',()=>wrapP.classList.add('paused'));wrapP.addEventListener('mouseleave',()=>{wrapP.classList.remove('paused');play()});
play();

/* header hide */
const hdr=$('#hdr');let ly=0;addEventListener('scroll',()=>{const y=scrollY;hdr.classList.toggle('hide',y>ly&&y>400);ly=y},{passive:true});

if(!window.gsap||!window.ScrollTrigger||RM)return;
gsap.registerPlugin(ScrollTrigger);
if(window.Lenis){const lenis=new Lenis({lerp:.09});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=$(a.getAttribute('href'));if(t){e.preventDefault();lenis.scrollTo(t,{offset:-10,duration:1.4})}}))}

/* hero intro: words fall in, panels rise like a curtain one after another */
gsap.from('#hxh .w',{yPercent:115,rotate:5,opacity:0,duration:1.2,ease:'expo.out',stagger:.06,delay:.1});
gsap.from('.hfade',{y:36,opacity:0,duration:1.1,ease:'expo.out',stagger:.08,delay:.45});
gsap.fromTo('.hp',{clipPath:'inset(100% 0% 0% 0% round 28px)'},{clipPath:'inset(0% 0% 0% 0% round 28px)',duration:1.4,ease:'expo.inOut',stagger:.14,delay:.2,clearProps:'clipPath'});
gsap.to('.hp img',{yPercent:6,ease:'none',scrollTrigger:{trigger:'.hx',start:'top top',end:'bottom top',scrub:true}});
ScrollTrigger.create({trigger:'.facts',start:'top 95%',once:true,onEnter:()=>{const el=$('[data-since]');const end=+el.textContent;const o={v:0};gsap.to(o,{v:end,duration:1.6,ease:'power3.out',onUpdate:()=>el.textContent=Math.round(o.v)})}});

const mm=gsap.matchMedia();

/* treatments: pinned horizontal slide */
mm.add('(min-width:1024px)',()=>{
  const track=$('#trTrack');const dist=()=>track.scrollWidth-innerWidth+parseFloat(getComputedStyle(track).paddingLeft);
  const tw=gsap.to(track,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'.tr',start:'top top',end:()=>'+='+dist()*1.1,pin:true,scrub:1,invalidateOnRefresh:true,onUpdate:s=>gsap.set('#trProg',{scaleX:s.progress})}});
  $$('.tc').forEach((c,i)=>{
    if(i>0)gsap.fromTo(c,{rotate:3,scale:.9,opacity:.35},{rotate:0,scale:1,opacity:1,ease:'none',scrollTrigger:{trigger:c,containerAnimation:tw,start:'left 100%',end:'left 45%',scrub:true}});
    gsap.fromTo($('.tc-m img',c),{xPercent:-6},{xPercent:6,ease:'none',scrollTrigger:{trigger:c,containerAnimation:tw,start:'left right',end:'right left',scrub:true}});
    gsap.fromTo($$('.chips a',c),{y:24,opacity:0},{y:0,opacity:1,stagger:.05,ease:'none',scrollTrigger:{trigger:c,containerAnimation:tw,start:'left 80%',end:'left 40%',scrub:true}});
  });
});
mm.add('(max-width:1023px)',()=>{$$('.tc').forEach(c=>gsap.from(c,{y:70,scale:.95,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:c,start:'top 88%'}}))});

/* inside: full-screen theatre photo shrinks into the grid, other rooms slide in */
mm.add('(min-width:1024px)',()=>{
  const c=$('#inC');
  const geo=()=>{const prev=c.style.transform;c.style.transform='none';const r=c.getBoundingClientRect();c.style.transform=prev;const stage=$('#inStage').getBoundingClientRect();const vw=innerWidth,vh=innerHeight;
    const s=Math.max(vw/r.width,vh/r.height);const cx=r.left+r.width/2,cy=(r.top-stage.top)+r.height/2;return {s,dx:vw/2-cx,dy:vh/2-cy}};
  const tl=gsap.timeline({scrollTrigger:{trigger:'#inside',start:'top top',end:'+=130%',pin:'#inStage',scrub:1,invalidateOnRefresh:true}});
  tl.fromTo(c,{scale:()=>geo().s,x:()=>geo().dx,y:()=>geo().dy,borderRadius:0},{scale:1,x:0,y:0,borderRadius:26,ease:'power2.inOut',duration:1})
    .fromTo('#inHead',{opacity:0,y:40},{opacity:1,y:0,duration:.5},.45)
    .fromTo('.it.l1,.it.l2',{xPercent:-40,opacity:0},{xPercent:0,opacity:1,stagger:.08,duration:.55,ease:'power2.out'},.4)
    .fromTo('.it.r1,.it.r2',{xPercent:40,opacity:0},{xPercent:0,opacity:1,stagger:.08,duration:.55,ease:'power2.out'},.4)
    .fromTo('.in-note',{opacity:0},{opacity:1,duration:.3},.8)
    .to({},{duration:.25});
});
mm.add('(max-width:1023px)',()=>{$$('.it').forEach(f=>gsap.from(f,{y:50,scale:.94,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:f,start:'top 90%'}}))});

/* visit: bars pour in day by day */
ScrollTrigger.create({trigger:'#hours',start:'top 80%',once:true,onEnter:()=>{
  gsap.from('#hours .hr',{x:-30,opacity:0,stagger:.07,duration:.7,ease:'expo.out'});
  gsap.from('#hours .s',{scaleX:0,stagger:.06,duration:1,ease:'expo.out',delay:.2});
}});
gsap.from('.vs h2',{y:60,opacity:0,duration:1.1,ease:'expo.out',scrollTrigger:{trigger:'.vs',start:'top 75%'}});

addEventListener('load',()=>ScrollTrigger.refresh());
})();
