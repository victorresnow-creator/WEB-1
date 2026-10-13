(function(){
'use strict';
const slides=[{"name":"Juan","city":"Quito","qty":3,"quote":"La calidad está súper, recomendado."},{"name":"María","city":"Guayaquil","qty":2,"quote":"Las prendas combinan muy bien y tienen un estilo increíble."},{"name":"Andrés","city":"Cuenca","qty":1,"quote":"Me gustó el corte del pantalón. Lo volvería a elegir."}];
const root=document.querySelector('[data-reviews-widget]');
if(!root)return;
const field=s=>root.querySelector(s);
const quote=field('[data-review-quote]');
const name=field('[data-review-name]');
const meta=field('[data-review-meta]');
const avatar=field('[data-review-avatar]');
const counter=field('[data-review-counter]');
const panel=field('.review-slide-shell');
const dots=[...root.querySelectorAll('[data-review-dot]')];
let index=0,timer=null,transition=null,visible=true;
const motion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function setSlide(next,animate){
  const n=(next+slides.length)%slides.length;
  if(n===index && !animate)return;
  clearTimeout(transition);
  const apply=()=>{
    index=n;
    const s=slides[n];
    quote.textContent=s.quote;
    name.textContent=s.name;
    meta.textContent=s.city+' · '+s.qty+' '+(s.qty===1?'prenda':'prendas');
    avatar.textContent=s.name.slice(0,1);
    counter.textContent=String(n+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
    dots.forEach((dot,i)=>{dot.classList.toggle('active',i===n);if(i===n)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current')});
    panel.classList.remove('is-changing');
  };
  if(animate&&!motion){panel.classList.add('is-changing');transition=setTimeout(apply,220)}else apply();
}
function stop(){if(timer){clearInterval(timer);timer=null}}
function start(){stop();if(motion||!visible||document.hidden)return;timer=setInterval(()=>setSlide(index+1,true),3000)}
function select(next){setSlide(next,true);start()}
root.querySelector('[data-review-prev]').addEventListener('click',()=>select(index-1));
root.querySelector('[data-review-next]').addEventListener('click',()=>select(index+1));
dots.forEach((dot,i)=>dot.addEventListener('click',()=>select(i)));
root.addEventListener('mouseenter',stop);
root.addEventListener('mouseleave',start);
root.addEventListener('focusin',stop);
root.addEventListener('focusout',e=>{if(!root.contains(e.relatedTarget))start()});
document.addEventListener('visibilitychange',()=>{document.hidden?stop():start()});
if('IntersectionObserver' in window){new IntersectionObserver((entries)=>{visible=entries[0].isIntersecting;visible?start():stop()},{threshold:0.15}).observe(root)}
else start();
})();
