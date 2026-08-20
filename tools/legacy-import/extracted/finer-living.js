/* Extracted from legacy/finer-living.html. Reference only — port into hooks. */


  /* ===== HERO DRIFT + QUIET EXIT ===== */
  const hero=document.querySelector('.hero');
  const heroMedia=document.querySelector('.hero-media');
  let motionFrame=false;
  const updateMotion=()=>{
    const heroProgress=Math.max(0,Math.min(1,scrollY/hero.offsetHeight));
    heroMedia.style.setProperty('--hero-shift',(heroProgress*34)+'px');
    heroMedia.style.setProperty('--hero-dim',(heroProgress*.12).toFixed(3));
    document.querySelectorAll('[data-drift]').forEach(figure=>{
      const rect=figure.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));
      figure.style.setProperty('--image-drift',((progress-.5)*Number(figure.dataset.drift))+'px');
    });
    motionFrame=false;
  };
  const queueMotion=()=>{if(!motionFrame){requestAnimationFrame(updateMotion);motionFrame=true}};
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
    addEventListener('scroll',queueMotion,{passive:true});addEventListener('resize',queueMotion);updateMotion();
  }

  /* ===== GENTLE EDITORIAL REVEALS ===== */
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const siblings=[...entry.target.parentElement.querySelectorAll('.rise:not(.in)')];
    const index=Math.max(0,siblings.indexOf(entry.target));
    setTimeout(()=>entry.target.classList.add('in'),Math.min(index,4)*90);
    revealObserver.unobserve(entry.target);
  }),{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rise').forEach(element=>revealObserver.observe(element));

  /* ===== SHORT MASKED STATEMENT REVEAL ===== */
  document.querySelectorAll('[data-word-reveal]').forEach(statement=>{
    let index=0;
    const wrapWords=node=>[...node.childNodes].forEach(child=>{
      if(child.nodeType===Node.TEXT_NODE){
        const fragment=document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part=>{
          if(!part)return;
          if(/^\s+$/.test(part)){fragment.appendChild(document.createTextNode(part));return}
          const mask=document.createElement('span');const word=document.createElement('span');
          mask.className='word-mask';mask.style.setProperty('--i',index++);word.textContent=part;
          mask.appendChild(word);fragment.appendChild(mask);
        });
        child.replaceWith(fragment);
      }else if(child.nodeType===Node.ELEMENT_NODE){wrapWords(child)}
    });
    wrapWords(statement);
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('words-in');observer.unobserve(entry.target)}
    }),{threshold:.35});
    observer.observe(statement);
  });

  /* ===== PROCESS LINE + SELECTED PROJECT TITLE ===== */
  const steps=document.querySelector('.steps');
  const processObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('line-in');processObserver.unobserve(entry.target)}
  }),{threshold:.22});
  processObserver.observe(steps);
  const titleMask=document.querySelector('.title-mask');
  const titleObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('in');titleObserver.unobserve(entry.target)}
  }),{threshold:.45});
  titleObserver.observe(titleMask);

  /* ===== COLLECTION STILLS TO MAKING-PROCESS FILMS ===== */
  const productFigures=[...document.querySelectorAll('.story-figure')];
  const motionAllowed=!matchMedia('(prefers-reduced-motion:reduce)').matches;
  const playFigure=figure=>{
    if(!motionAllowed)return;
    const video=figure.querySelector('video');
    figure.classList.add('video-active');
    video.play().catch(()=>figure.classList.remove('video-active'));
  };
  const stopFigure=figure=>{
    const video=figure.querySelector('video');
    figure.classList.remove('video-active');video.pause();video.currentTime=0;
  };
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    productFigures.forEach(figure=>{
      figure.addEventListener('mouseenter',()=>playFigure(figure));figure.addEventListener('mouseleave',()=>stopFigure(figure));
      figure.addEventListener('focus',()=>playFigure(figure));figure.addEventListener('blur',()=>stopFigure(figure));
    });
  }else if(motionAllowed){
    productFigures.forEach(figure=>figure.addEventListener('click',()=>{
      const active=figure.classList.contains('video-active');productFigures.forEach(stopFigure);if(!active)playFigure(figure);
    }));
  }
  if(motionAllowed){
    const visibilityObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)stopFigure(entry.target);
    }),{threshold:.08});
    productFigures.forEach(figure=>visibilityObserver.observe(figure));
  }

  /* ===== RESTRAINED SELECTED-PROJECT IMAGE DRIFT ===== */
  const projectBg=document.getElementById('projectBg');
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
    let queued=false;
    const updateProject=()=>{
      const rect=projectBg.parentElement.getBoundingClientRect();
      const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight+rect.height)));
      projectBg.style.transform=`translate3d(${(progress-.5)*7}px,${(progress-.5)*22}px,0) scale(1.022)`;
      queued=false;
    };
    const queueProject=()=>{if(!queued){requestAnimationFrame(updateProject);queued=true}};
    addEventListener('scroll',queueProject,{passive:true});addEventListener('resize',queueProject);updateProject();
  }

