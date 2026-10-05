(function(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = document.getElementById('loader');
  const nav = document.getElementById('nav');
  const menu = document.getElementById('mobileMenu');
  const toggle = document.getElementById('menuToggle');
  const close = document.getElementById('menuClose');
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  const openMenu = () => { menu?.classList.add('open'); document.body.classList.add('no-scroll'); };
  const closeMenu = () => { menu?.classList.remove('open'); document.body.classList.remove('no-scroll'); };
  toggle?.addEventListener('click', openMenu);
  close?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  const sections = [...document.querySelectorAll('main > section[data-theme]')];
  const setNav = () => {
    const y = window.scrollY || 0;
    nav?.classList.toggle('scrolled', y > 40);
    if(window.matchMedia('(max-width: 767px)').matches){
      document.body.classList.toggle('mobile-brand-hidden', y > window.innerHeight * .72);
    }
  };
  window.addEventListener('scroll', setNav, {passive:true});
  setNav();

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const target=document.querySelector(link.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    });
  });

  const videos=[...document.querySelectorAll('video')];
  const videoObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    const v=entry.target;
    if(entry.isIntersecting) v.play().catch(()=>{});
    else if(!v.classList.contains('hero-video')) v.pause();
  }),{threshold:.12});
  videos.forEach(v=>videoObserver.observe(v));

  const initAnimations=()=>{
    if(!window.gsap){loader?.remove();return;}
    gsap.registerPlugin(ScrollTrigger);
    const intro=gsap.timeline({delay:.1});
    intro.to('.loader-logo',{opacity:1,scale:1,duration:.7,ease:'power3.out'})
      .to('.loader',{yPercent:-100,duration:1.0,ease:'power4.inOut'},'+=.18')
      .to('.hero-logo',{opacity:1,scale:1,duration:.8,ease:'power3.out'},'-=.5')
      .from('.hero-copy > *',{opacity:0,y:28,stagger:.07,duration:.65,ease:'power3.out'},'-=.35');

    gsap.utils.toArray('.service-row').forEach((el,i)=>gsap.from(el,{opacity:0,y:25,duration:.7,delay:i*.03,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
    gsap.utils.toArray('.project-pair').forEach(el=>gsap.from(el,{opacity:0,y:35,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    gsap.utils.toArray('.detail-image,.motion-video,.showcase-media').forEach(el=>gsap.from(el,{clipPath:'inset(0 0 0 8%)',opacity:.6,duration:1.1,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 82%',once:true}}));
    gsap.utils.toArray('.process-steps article,.confidence-grid article').forEach((el,i)=>gsap.from(el,{opacity:0,x:22,duration:.7,delay:i*.04,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
    const materialImg=document.querySelector('.material-image img');
    if(materialImg) gsap.to(materialImg,{scale:1,ease:'none',scrollTrigger:{trigger:'.material-film',start:'top bottom',end:'bottom top',scrub:true}});
    const heroVideo=document.querySelector('.hero-video');
    if(heroVideo) gsap.to(heroVideo,{scale:1,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    ScrollTrigger.refresh();
  };

  if(reduced){loader?.remove();}
  else if(window.gsap){initAnimations();}
  else{loader?.remove();}

  // Project filters and horizontal carousel.
  const carousel=document.getElementById('projectCarousel');
  const projectCards=[...document.querySelectorAll('.project-pair')];
  const filterButtons=[...document.querySelectorAll('.filter-btn')];
  const prev=document.querySelector('.carousel-prev');
  const next=document.querySelector('.carousel-next');
  const updateArrows=()=>{
    if(!carousel||!prev||!next) return;
    const max=carousel.scrollWidth-carousel.clientWidth;
    prev.disabled=carousel.scrollLeft<=4;
    next.disabled=carousel.scrollLeft>=max-4;
  };
  const scrollProjects=(dir)=>{
    if(!carousel) return;
    const card=carousel.querySelector('.project-pair:not([hidden])');
    const gap=parseFloat(getComputedStyle(carousel).columnGap||getComputedStyle(carousel).gap||'12')||12;
    const step=card?card.getBoundingClientRect().width+gap:carousel.clientWidth*.88;
    carousel.scrollBy({left:dir*step,behavior:reduced?'auto':'smooth'});
  };
  prev?.addEventListener('click',()=>scrollProjects(-1));
  next?.addEventListener('click',()=>scrollProjects(1));
  carousel?.addEventListener('scroll',updateArrows,{passive:true});
  window.addEventListener('resize',updateArrows,{passive:true});
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.filter;
    filterButtons.forEach(b=>b.classList.toggle('active',b===btn));
    projectCards.forEach(card=>{
      const cats=(card.dataset.cats||'').split(',');
      card.hidden=filter!=='all' && !cats.includes(filter);
    });
    carousel?.scrollTo({left:0,behavior:reduced?'auto':'smooth'});
    requestAnimationFrame(updateArrows);
  }));
  requestAnimationFrame(updateArrows);

  if(window.matchMedia('(pointer:fine)').matches && !reduced){
    const cursor=document.querySelector('.cursor');
    window.addEventListener('mousemove',e=>{if(cursor){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';}});
    document.querySelectorAll('.magnetic').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor?.classList.add('active'));
      el.addEventListener('mouseleave',()=>{cursor?.classList.remove('active');el.style.transform='';});
      el.addEventListener('mousemove',e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left-r.width/2)*.08;
        const y=(e.clientY-r.top-r.height/2)*.08;
        el.style.transform=`translate(${x}px,${y}px)`;
      });
    });
  }
})();
