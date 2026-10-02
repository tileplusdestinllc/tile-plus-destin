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
