(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader=document.getElementById('loader');
  const nav=document.getElementById('nav');
  const menu=document.getElementById('mobileMenu');
  const toggle=document.getElementById('menuToggle');
  const close=document.getElementById('menuClose');
  const lightbox=document.getElementById('lightbox');
  const lbImg=document.getElementById('lightboxImage');
  const lbCaption=document.getElementById('lightboxCaption');
  const triggers=[...document.querySelectorAll('.lightbox-trigger')];
  let current=-1;

  document.getElementById('year').textContent=new Date().getFullYear();
  function openMenu(){menu.classList.add('open');document.body.classList.add('no-scroll')}
  function closeMenu(){menu.classList.remove('open');document.body.classList.remove('no-scroll')}
  toggle.addEventListener('click',openMenu); close.addEventListener('click',closeMenu);
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});

  function showLightbox(index){
    current=(index+triggers.length)%triggers.length;
    const el=triggers[current];
    lbImg.src=el.dataset.full;
    lbImg.alt=el.querySelector('img')?.alt || '';
    lbCaption.textContent=el.dataset.caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.classList.add('no-scroll');
  }
  function hideLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('no-scroll');lbImg.src=''}
  triggers.forEach((el,i)=>el.addEventListener('click',()=>showLightbox(i)));
  document.getElementById('lightboxClose').addEventListener('click',hideLightbox);
  document.getElementById('lightboxPrev').addEventListener('click',()=>showLightbox(current-1));
  document.getElementById('lightboxNext').addEventListener('click',()=>showLightbox(current+1));
  lightbox.addEventListener('click',e=>{if(e.target===lightbox)hideLightbox()});
  document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')hideLightbox();if(e.key==='ArrowLeft')showLightbox(current-1);if(e.key==='ArrowRight')showLightbox(current+1)});

  const videos=[...document.querySelectorAll('video')];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
    const v=e.target;
    if(e.isIntersecting){v.play().catch(()=>{})}else if(!v.classList.contains('hero-video')){v.pause()}
  }),{threshold:.12});
  videos.forEach(v=>observer.observe(v));

  if(reduced){loader.remove();return}

  if(window.gsap){
    gsap.registerPlugin(ScrollTrigger);
    const intro=gsap.timeline({delay:.15});
    intro.to('.loader-logo',{opacity:1,scale:1,duration:.8,ease:'power3.out'})
      .to('.loader',{yPercent:-100,duration:1.05,ease:'power4.inOut'},'+=.15')
      .to('.hero-logo',{opacity:1,scale:1,duration:1,ease:'power3.out'},'-=.55')
      .from('.hero-copy > *',{opacity:0,y:35,stagger:.08,duration:.7,ease:'power3.out'},'-=.35');

    gsap.utils.toArray('.reveal-image').forEach(el=>gsap.from(el,{y:45,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%'}}));
    gsap.utils.toArray('.project-block').forEach((el,i)=>gsap.from(el.querySelectorAll('.project-heading,.project-image'),{y:35,opacity:0,stagger:.08,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 82%'}}));
    gsap.utils.toArray('.service-row').forEach((el,i)=>gsap.from(el,{x:-35,opacity:0,duration:.7,delay:i*.03,scrollTrigger:{trigger:el,start:'top 90%'}}));
    gsap.utils.toArray('.process-steps article').forEach((el,i)=>gsap.from(el,{x:30,opacity:0,duration:.7,delay:i*.02,scrollTrigger:{trigger:el,start:'top 88%'}}));
    gsap.to('.giant-year',{xPercent:-7,ease:'none',scrollTrigger:{trigger:'.since',start:'top bottom',end:'bottom top',scrub:true}});
  }else{loader.remove()}

  if(window.matchMedia('(pointer:fine)').matches){
    const cursor=document.querySelector('.cursor');
    window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
    document.querySelectorAll('.magnetic').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('active'));
      el.addEventListener('mouseleave',()=>{cursor.classList.remove('active');el.style.transform=''})
      el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.12;const y=(e.clientY-r.top-r.height/2)*.12;el.style.transform=`translate(${x}px,${y}px)`});
    });
    document.querySelectorAll('.project-image,.statement-image,.detail-image,.film-detail').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('active'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('active'));
    });
  }
})();
