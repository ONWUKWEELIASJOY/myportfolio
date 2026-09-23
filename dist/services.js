// Native horizontal scrolling keeps every card available to touch and keyboard users.
document.querySelectorAll('[data-carousel]').forEach(section => {
  const track=section.querySelector('.svc-track');
  const cards=[...track.children];
  const dots=[...section.querySelectorAll('[data-slide]')];
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const position=i=>(track.scrollWidth-track.clientWidth)*i/(cards.length-1);
  const go=i=>track.scrollTo({left:position(Math.max(0,Math.min(i,cards.length-1))),behavior:reduced.matches?'instant':'smooth'});
  const current=()=>cards.reduce((best,card,i)=>Math.abs(position(i)-track.scrollLeft)<Math.abs(position(best)-track.scrollLeft)?i:best,0);
  const update=()=>dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current())));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>go(i)));
  track.addEventListener('scroll',update,{passive:true});
  track.addEventListener('keydown',event=>{
    if(event.target!==track)return;
    if(['ArrowRight','ArrowLeft','Home','End'].includes(event.key)){
      event.preventDefault();go(event.key==='Home'?0:event.key==='End'?cards.length-1:current()+(event.key==='ArrowRight'?1:-1));
    }
  });
  let drag=null,suppressClick=false;
  track.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0)return;
    drag={x:event.clientX,left:track.scrollLeft,id:event.pointerId};suppressClick=false;
  });
  track.addEventListener('pointermove',event=>{
    if(!drag)return;
    const delta=event.clientX-drag.x;
    if(Math.abs(delta)>5){suppressClick=true;track.classList.add('is-dragging');track.setPointerCapture(drag.id);track.scrollLeft=drag.left-delta;}
  });
  const end=()=>{drag=null;track.classList.remove('is-dragging');};
  track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end);
  track.addEventListener('lostpointercapture',end);
  window.addEventListener('pointerup',end);
  track.addEventListener('dragstart',event=>event.preventDefault());
  track.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();suppressClick=false;}},true);
  new ResizeObserver(update).observe(track);update();
});
