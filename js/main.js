(function(){
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const loader=document.getElementById('loader');
 const nav=document.getElementById('nav');
 const menu=document.getElementById('mobileMenu');
 const toggle=document.getElementById('menuToggle');
 const close=document.getElementById('menuClose');
 const year=document.getElementById('year');
 if(year) year.textContent=new Date().getFullYear();
 function openMenu(){menu.classList.add('open');document.body.classList.add('no-scroll')}
 function closeMenu(){menu.classList.remove('open');document.body.classList.remove('no-scroll')}
 toggle&&toggle.addEventListener('click',openMenu);close&&close.addEventListener('click',closeMenu);
 menu&&menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});
 const videos=[...document.querySelectorAll('video')];
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{const v=e.target;if(e.isIntersecting)v.play().catch(()=>{});else if(!v.classList.contains('hero-video'))v.pause()}),{threshold:.12});
 videos.forEach(v=>observer.observe(v));
 const filters=[...document.querySelectorAll('.filter-btn')];
 const projects=[...document.querySelectorAll('.project-pair')];
 function filterProjects(filter){
   projects.forEach(p=>{const cats=(p.dataset.cats||'').split(',');p.classList.toggle('is-hidden',filter!=='all'&&!cats.includes(filter))});
   filters.forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
 }
 filters.forEach(b=>b.addEventListener('click',()=>filterProjects(b.dataset.filter)));
 document.querySelectorAll('[data-filter-target]').forEach(el=>el.addEventListener('click',()=>{const target=el.dataset.filterTarget; if(target)filterProjects(target)}));
 const form=document.getElementById('estimateForm');
 form&&form.addEventListener('submit',e=>{
   e.preventDefault();
   const d=new FormData(form);
   const subject='Tile Plus — Project Estimate Request';
   const body=[`Project: ${d.get('project')}`,`Name: ${d.get('name')}`,`Phone: ${d.get('phone')}`,`Email: ${d.get('email')}`,`ZIP: ${d.get('zip')||'Not provided'}`,``,`${d.get('message')||'No project details provided.'}`].join('\n');
   window.location.href='mailto:Tileplusdestin@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 });
 if(reduced){loader&&loader.remove();return}
 if(window.gsap){
   gsap.registerPlugin(ScrollTrigger);
   const intro=gsap.timeline({delay:.15});
   intro.to('.loader img',{opacity:1,scale:1,duration:.75,ease:'power3.out'})
    .to('.loader',{yPercent:-100,duration:1,ease:'power4.inOut'},'+=.15')
    .to('.hero-logo',{opacity:1,scale:1,duration:.9,ease:'power3.out'},'-=.55')
    .from('.hero-copy > *',{opacity:0,y:30,stagger:.08,duration:.65,ease:'power3.out'},'-=.4');
   gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:45,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 85%'}}));
   gsap.utils.toArray('.service-row').forEach((el,i)=>gsap.from(el,{x:-30,opacity:0,duration:.65,delay:i*.03,scrollTrigger:{trigger:el,start:'top 90%'}}));
   gsap.utils.toArray('.project-pair').forEach(el=>gsap.from(el,{y:35,opacity:0,duration:.8,scrollTrigger:{trigger:el,start:'top 88%'}}));
   gsap.to('.detail-image img',{scale:1.06,ease:'none',scrollTrigger:{trigger:'.detail',start:'top bottom',end:'bottom top',scrub:true}});
   gsap.utils.toArray('.confidence-grid article').forEach((el,i)=>gsap.from(el,{y:30,opacity:0,duration:.65,delay:i*.05,scrollTrigger:{trigger:'.confidence-grid',start:'top 82%'}}));
 }else loader&&loader.remove();
 if(window.matchMedia('(pointer:fine)').matches){
   const cursor=document.querySelector('.cursor');
   window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
   document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('active'));el.addEventListener('mouseleave',()=>{cursor.classList.remove('active');el.style.transform=''});el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.1,y=(e.clientY-r.top-r.height/2)*.1;el.style.transform=`translate(${x}px,${y}px)`})});
 }
})();
