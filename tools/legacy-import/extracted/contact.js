/* Extracted from legacy/contact.html. Reference only — port into hooks. */

const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');observer.unobserve(e.target)}}),{threshold:.15});document.querySelectorAll('.rise').forEach(el=>observer.observe(el));
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let frame=false;const image=document.querySelector('.image-wrap');const update=()=>{const r=image.getBoundingClientRect(),p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));image.style.setProperty('--image-y',((p-.5)*28)+'px');frame=false};addEventListener('scroll',()=>{if(!frame){requestAnimationFrame(update);frame=true}},{passive:true});update()}
document.getElementById('contactForm').addEventListener('submit',e=>{e.preventDefault();e.currentTarget.classList.add('submitted');document.getElementById('formStatus').textContent='Thank you. Your enquiry is ready to be connected to the final delivery address.'});

