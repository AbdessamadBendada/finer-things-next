/* Extracted from legacy/about.html. Reference only — port into hooks. */


  /* ===== GENTLE EDITORIAL REVEALS ===== */
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const siblings=[...entry.target.parentElement.querySelectorAll('.rise:not(.in)')];const index=Math.max(0,siblings.indexOf(entry.target));setTimeout(()=>entry.target.classList.add('in'),Math.min(index,4)*90);revealObserver.unobserve(entry.target)}),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rise').forEach(element=>revealObserver.observe(element));

  /* ===== MASKED STORY STATEMENT ===== */
  document.querySelectorAll('[data-word-reveal]').forEach(statement=>{let index=0;const wrapWords=node=>[...node.childNodes].forEach(child=>{if(child.nodeType===Node.TEXT_NODE){const fragment=document.createDocumentFragment();child.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){fragment.appendChild(document.createTextNode(part));return}const mask=document.createElement('span'),word=document.createElement('span');mask.className='word-mask';mask.style.setProperty('--i',index++);word.textContent=part;mask.appendChild(word);fragment.appendChild(mask)});child.replaceWith(fragment)}else if(child.nodeType===Node.ELEMENT_NODE)wrapWords(child)});wrapWords(statement);const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('words-in');observer.unobserve(entry.target)}}),{threshold:.35});observer.observe(statement)});

  /* ===== RESTRAINED PORTRAIT + IMAGE DRIFT ===== */
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches){let frame=false;const update=()=>{const portrait=document.querySelector('.hero-portrait'),p=Math.max(0,Math.min(1,scrollY/innerHeight));portrait.style.setProperty('--portrait-shift',(p*28)+'px');document.querySelectorAll('[data-drift]').forEach(figure=>{const rect=figure.getBoundingClientRect(),progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height))),shift=((progress-.5)*Number(figure.dataset.drift))+'px';figure.style.setProperty(figure.classList.contains('experience-image')?'--experience-shift':'--image-shift',shift)});frame=false};const queue=()=>{if(!frame){requestAnimationFrame(update);frame=true}};addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);update()}

