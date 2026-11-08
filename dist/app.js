document.addEventListener('click',event=>{const menu=document.querySelector('.case-menu');if(menu&&!menu.contains(event.target))menu.open=false;if(event.target.closest('.case-links a'))menu.open=false;const captureLink=event.target.closest('a[href*="node-id=148-7470"]');if(captureLink){event.preventDefault();location.href='capturepro.html';}const moniepointLink=event.target.closest('a[href*="node-id=128-609"]');if(moniepointLink){event.preventDefault();location.href='moniepoint.html';}});
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('details[open]').forEach(el=>el.open=false);});
document.querySelectorAll('[data-motion="tools-track"]').forEach(button=>{button.addEventListener('click',()=>{const track=document.querySelector('.tools-track');const paused=track.classList.toggle('is-paused');button.textContent=paused?'Play':'Pause';button.setAttribute('aria-label',(paused?'Play':'Pause')+' tool animation');button.setAttribute('aria-pressed',String(paused));});});
if(document.querySelector('.hero-portrait img')){
  const portrait=document.querySelector('.hero-portrait img');
  const button=document.querySelector('[data-hero-motion]');
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let animationUrl=null,loading=null,paused=false;
  function loadAnimation(){
    if(loading||preference.matches)return loading;
    loading=Promise.all(portrait.dataset.animationParts.split(',').map(async path=>{const response=await fetch(path);if(!response.ok)throw Error('Portrait unavailable');return response.arrayBuffer();})).then(parts=>{
      animationUrl=URL.createObjectURL(new Blob(parts,{type:'image/webp'}));
      if(!paused&&!preference.matches)portrait.src=animationUrl;
    }).catch(()=>{loading=null;button.textContent='Play animation';button.setAttribute('aria-label','Play portrait animation');});
    return loading;
  }
  button.addEventListener('click',()=>{
    paused=!paused;
    portrait.src=paused?'assets/hero-still.png':animationUrl||'assets/hero-still.png';
    if(!paused)loadAnimation();
    button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',(paused?'Play':'Pause')+' portrait animation');button.textContent=paused?'Play animation':'Pause animation';
  });
  preference.addEventListener('change',()=>{if(preference.matches)portrait.src='assets/hero-still.png';else if(!paused){if(animationUrl)portrait.src=animationUrl;else loadAnimation();}});
  loadAnimation();
}
document.querySelectorAll('.faq-list details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)document.querySelectorAll('.faq-list details').forEach(other=>{if(other!==detail)other.open=false});}));
if(document.querySelector('.testimonial-window')){
  const carousel=document.querySelector('.testimonial-window');
  const track=carousel.querySelector('.testimonial-track');
  const control=carousel.querySelector('[data-motion="testimonial-track"]');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const speed=18;
  let paused=false, visible=false, lastTime=0, position=0, lastPageY=window.scrollY, drag=null;
  carousel.tabIndex=0;
  carousel.setAttribute('role','region');
  carousel.setAttribute('aria-label','Testimonials. Hover or click to pause; drag, swipe, or use arrow keys to browse. Scroll the page vertically to resume.');
  function setPaused(value){
    paused=value;
    position=carousel.scrollLeft;
    track.classList.toggle('is-paused',value);
    carousel.dataset.paused=String(value);
    control.textContent=value?'Play':'Pause';
    control.setAttribute('aria-label',(value?'Play':'Pause')+' testimonial animation');
    control.setAttribute('aria-pressed',String(value));
  }
  carousel.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')setPaused(true);});
  carousel.addEventListener('focusin',()=>setPaused(true));
  carousel.addEventListener('click',event=>{if(!event.target.closest('button'))setPaused(true);});
  carousel.addEventListener('pointerdown',event=>{
    if(event.target.closest('button'))return;
    setPaused(true);
    if(event.pointerType==='mouse'&&event.button===0){
      drag={id:event.pointerId,x:event.clientX,left:carousel.scrollLeft};
      carousel.setPointerCapture(event.pointerId);
      carousel.classList.add('is-dragging');
      event.preventDefault();
    }
  });
  carousel.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;
    carousel.scrollLeft=drag.left+drag.x-event.clientX;
  });
  function endDrag(event){
    if(!drag||event.pointerId!==drag.id)return;
    if(carousel.hasPointerCapture(event.pointerId))carousel.releasePointerCapture(event.pointerId);
    drag=null;
    carousel.classList.remove('is-dragging');
  }
  carousel.addEventListener('pointerup',endDrag);
  carousel.addEventListener('pointercancel',endDrag);
  carousel.addEventListener('lostpointercapture',()=>{drag=null;carousel.classList.remove('is-dragging');});
  carousel.addEventListener('wheel',event=>{
    if(event.shiftKey){setPaused(true);event.preventDefault();carousel.scrollLeft+=event.deltaY||event.deltaX;}
    else if(Math.abs(event.deltaX)>Math.abs(event.deltaY)){setPaused(true);}
  },{passive:false});
  carousel.addEventListener('keydown',event=>{
    if(event.target.closest('button'))return;
    if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
      event.preventDefault();setPaused(true);
      if(event.key==='Home')carousel.scrollLeft=0;
      else if(event.key==='End')carousel.scrollLeft=carousel.scrollWidth;
      else carousel.scrollLeft+=(event.key==='ArrowRight'?1:-1)*Math.min(400,carousel.clientWidth*.8);
    }
  });
  control.addEventListener('click',event=>{event.stopPropagation();setPaused(!paused);});
  window.addEventListener('scroll',()=>{
    const currentY=window.scrollY;
    if(Math.abs(currentY-lastPageY)>=4){lastPageY=currentY;if(paused&&!drag)setPaused(false);}
  },{passive:true});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;position=carousel.scrollLeft;},{threshold:.1}).observe(carousel);
  function tick(now){
    const elapsed=Math.min(now-lastTime,64);lastTime=now;
    if(visible&&!paused&&!reducedMotion.matches&&!document.hidden&&!drag){
      const reviews=track.children;
      const loopWidth=reviews.length>3?reviews[3].offsetLeft-reviews[0].offsetLeft:0;
      if(loopWidth>0){position+=speed*elapsed/1000;if(position>=loopWidth)position-=loopWidth;carousel.scrollLeft=position;}
    }
    requestAnimationFrame(tick);
  }
  setPaused(false);requestAnimationFrame(tick);
}
if(location.hostname==='127.0.0.1'||location.hostname==='localhost'){
  let lastContent='';
  setInterval(async()=>{if(document.hidden)return;try{const response=await fetch(location.pathname==='/'?'/index.html':location.pathname,{cache:'no-store'});if(!response.ok)return;const content=await response.text();if(lastContent&&content!==lastContent)location.reload();lastContent=content;}catch{}},2000);
}

/* Project cards rise in as they enter; images settle a beat later */
(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;const cards=document.querySelectorAll('.project-card');if(!cards.length)return;document.documentElement.classList.add('js-motion');const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');o.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});cards.forEach(c=>{if(c.getBoundingClientRect().top<innerHeight)c.classList.add('is-in');o.observe(c)})})();
