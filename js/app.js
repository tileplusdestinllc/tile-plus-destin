(function(){
  const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pre=document.querySelector('.preloader');
  window.addEventListener('load',()=>setTimeout(()=>pre&&pre.classList.add('is-done'),900));

  const cursor=document.querySelector('.cursor');
  if(cursor&&!reduced&&window.matchMedia('(pointer:fine)').matches){
    let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
    window.addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;cursor.style.opacity='1'});
    const tick=()=>{cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(tick)};tick();
    document.querySelectorAll('a,button,.project-card,.transform-frame').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('active'));el.addEventListener('mouseleave',()=>cursor.classList.remove('active'))});
  }

  const header=document.querySelector('[data-header]');
  const updateHeader=()=>{if(!header)return; const y=scrollY; const lightSections=[...document.querySelectorAll('.section-light,.section-stone')]; let light=false; for(const s of lightSections){const r=s.getBoundingClientRect();if(r.top<90&&r.bottom>90){light=true;break}} header.classList.toggle('is-light',light);header.classList.toggle('scrolled',y>80)};
  window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();

  const toggle=document.querySelector('.menu-toggle'),menu=document.getElementById('mobileMenu');
  if(toggle&&menu){toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-hidden',String(open));menu.classList.toggle('is-open',!open);document.body.classList.toggle('menu-open',!open)});menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');menu.setAttribute('aria-hidden','true');menu.classList.remove('is-open');document.body.classList.remove('menu-open')}));}

  if(window.gsap&&!reduced){
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.brand-lockup',{opacity:0,y:24,duration:1.2,delay:1.2,ease:'power3.out'});
    gsap.from('.hero-copy-wrap>*',{y:55,opacity:0,duration:1.05,stagger:.12,ease:'power3.out',delay:.2,scrollTrigger:{trigger:'.hero',start:'top 70%'}});
    gsap.from('.manifesto-inner>*',{y:60,opacity:0,duration:1,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'.manifesto',start:'top 65%'}});
    gsap.to('.manifesto-symbol',{rotation:18,xPercent:-10,scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});
    gsap.to('.hero-media video',{scale:1.16,scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1.2}});
    gsap.to('.value-media video',{scale:1.13,scrollTrigger:{trigger:'.surface-value',start:'top bottom',end:'bottom top',scrub:1.2}});
    gsap.to('.macro-image img',{scale:1,scrollTrigger:{trigger:'.macro',start:'top bottom',end:'bottom top',scrub:1.2}});
    gsap.to('.macro-line',{scaleX:1.1,scrollTrigger:{trigger:'.macro',start:'top 70%',end:'bottom 30%',scrub:1}});
    gsap.from('.process-list article',{y:45,opacity:0,duration:.8,stagger:.08,ease:'power3.out',scrollTrigger:{trigger:'.process-list',start:'top 78%'}});
    gsap.from('.why-points div',{x:40,opacity:0,duration:.8,stagger:.12,ease:'power3.out',scrollTrigger:{trigger:'.why',start:'top 70%'}});
    gsap.to('.credibility-number',{xPercent:-8,scrollTrigger:{trigger:'.credibility',start:'top bottom',end:'bottom top',scrub:1}});

    const track=document.querySelector('.service-track'); const stage=document.querySelector('.service-stage');
    if(track&&stage){
      const articles=[...track.querySelectorAll('article')]; const num=stage.querySelector('.service-number'); const title=stage.querySelector('h2'); const copy=stage.querySelector('p'); const img=stage.querySelector('img'); const dots=[...document.querySelectorAll('.service-dots i')];
      articles.forEach((a,i)=>{ScrollTrigger.create({trigger:a,start:'top center',end:'bottom center',onEnter:()=>change(i),onEnterBack:()=>change(i)})});
      function change(i){const a=articles[i]; if(!a)return; gsap.to([num,title,copy],{opacity:0,y:14,duration:.2,onComplete:()=>{num.textContent=String(i+1).padStart(2,'0');title.textContent=a.dataset.title;copy.textContent=a.dataset.copy;gsap.to([num,title,copy],{opacity:1,y:0,duration:.5,ease:'power3.out'})}});gsap.to(img,{opacity:0,duration:.18,onComplete:()=>{img.src=a.dataset.image;gsap.to(img,{opacity:1,duration:.55})}});dots.forEach((d,j)=>d.classList.toggle('active',j===i))}
    }

    document.querySelectorAll('.eyebrow').forEach(el=>gsap.from(el,{opacity:0,y:15,duration:.6,scrollTrigger:{trigger:el,start:'top 88%'}}));
  }

  const frame=document.querySelector('.transform-frame');
  if(frame){let dragging=false; const set=e=>{const r=frame.getBoundingClientRect();const x=Math.max(2,Math.min(e.clientX-r.left,r.width-2));const pct=x/r.width*100;frame.querySelector('.transform-before').style.width=pct+'%';frame.querySelector('.transform-handle').style.left=pct+'%'};frame.addEventListener('pointerdown',e=>{dragging=true;frame.setPointerCapture(e.pointerId);set(e)});frame.addEventListener('pointermove',e=>{if(dragging)set(e)});frame.addEventListener('pointerup',()=>dragging=false);frame.addEventListener('pointercancel',()=>dragging=false);}

  // Smooth anchor fallback; native behavior remains accessible.
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(!target)return;e.preventDefault();target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'})}));
})();
