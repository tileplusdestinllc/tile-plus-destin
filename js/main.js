(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader=document.getElementById('loader');
  const nav=document.getElementById('nav');
  const menu=document.getElementById('mobileMenu');
  const toggle=document.getElementById('menuToggle');
  const close=document.getElementById('menuClose');
  document.getElementById('year').textContent=new Date().getFullYear();

  function openMenu(){menu.classList.add('open');document.body.classList.add('no-scroll')}
  function closeMenu(){menu.classList.remove('open');document.body.classList.remove('no-scroll')}
  toggle.addEventListener('click',openMenu); close.addEventListener('click',closeMenu);
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});

  const videos=[...document.querySelectorAll('video')];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
    const v=e.target;
    if(e.isIntersecting){v.play().catch(()=>{})}else if(!v.classList.contains('hero-video')){v.pause()}
  }),{threshold:.15});
  videos.forEach(v=>observer.observe(v));

  if(reduced){loader.remove();return}
  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    const intro=gsap.timeline({delay:.15});
    intro.to('.loader-logo',{opacity:1,scale:1,duration:.8,ease:'power3.out'})
      .to('.loader',{yPercent:-100,duration:1.05,ease:'power4.inOut'},'+=.15')
      .to('.hero-logo',{opacity:1,scale:1,duration:1,ease:'power3.out'},'-=.55')
      .from('.hero-copy > *',{opacity:0,y:35,stagger:.08,duration:.7,ease:'power3.out'},'-=.45');
    gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:55,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
    gsap.utils.toArray('.service-row').forEach((el,i)=>gsap.from(el,{x:-35,opacity:0,duration:.7,delay:i*.03,scrollTrigger:{trigger:el,start:'top 90%'}}));
    gsap.utils.toArray('.focus-project').forEach(el=>gsap.from(el.querySelector('.focus-info'),{x:40,opacity:0,duration:1,scrollTrigger:{trigger:el,start:'top 75%'}}));
    gsap.to('.detail-image img',{scale:1.08,ease:'none',scrollTrigger:{trigger:'.detail',start:'top bottom',end:'bottom top',scrub:true}});
    gsap.to('.giant-year',{xPercent:-7,ease:'none',scrollTrigger:{trigger:'.since',start:'top bottom',end:'bottom top',scrub:true}});
  }else{loader.remove()}


  // Project selector + horizontal editorial carousel.
  const carousel=document.getElementById('projectCarousel');
  const projectCards=[...document.querySelectorAll('.project-pair')];
  const filterButtons=[...document.querySelectorAll('.filter-btn')];
  const prev=document.querySelector('.carousel-prev');
  const next=document.querySelector('.carousel-next');

  function updateArrows(){
    if(!carousel||!prev||!next) return;
    prev.disabled=carousel.scrollLeft<=4;
    next.disabled=carousel.scrollLeft+carousel.clientWidth>=carousel.scrollWidth-4;
  }
  function scrollProjects(dir){
    if(!carousel) return;
    const card=carousel.querySelector('.project-pair:not([hidden])');
    const step=card ? card.getBoundingClientRect().width + 18 : carousel.clientWidth*.85;
    carousel.scrollBy({left:dir*step,behavior:'smooth'});
  }
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
    if(carousel) carousel.scrollTo({left:0,behavior:'smooth'});
    requestAnimationFrame(updateArrows);
  }));
  requestAnimationFrame(updateArrows);

  // Keep all project media loaded progressively without layout jumps.
  document.querySelectorAll('.project-pair img').forEach(img=>{
    img.addEventListener('load',()=>img.classList.add('is-ready'),{once:true});
  });

  // Lightweight magnetic buttons on pointer devices.
  if(window.matchMedia('(pointer:fine)').matches){
    const cursor=document.querySelector('.cursor');
    window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
    document.querySelectorAll('.magnetic').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('active'));
      el.addEventListener('mouseleave',()=>{cursor.classList.remove('active');el.style.transform=''})
      el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.12;const y=(e.clientY-r.top-r.height/2)*.12;el.style.transform=`translate(${x}px,${y}px)`});
    });
  }
})();
