/* Extracted from legacy/index.html. Reference only — port into hooks. */

  /* ===== collage: horizontal tall cells, duplicated for seamless loop ===== */
  const imgs=['assets/hero1.webp','assets/hero2.webp','assets/hero3.webp','assets/hero4.webp','assets/hero5.webp','assets/hero6.webp','assets/hero7.webp'];
  const track=document.getElementById('track');
  [...imgs,...imgs].forEach(id=>{
    const c=document.createElement('div');c.className='cell';
    const im=document.createElement('img');im.src=id;im.alt='';
    c.appendChild(im);track.appendChild(c);
  });

  /* ===== intro cover lift ===== */
  const cover=document.getElementById('cover');
  const hero=document.getElementById('hero');
  function begin(){cover.classList.add('handoff');setTimeout(()=>{cover.classList.add('lift');hero.classList.add('reveal');},520);}
  window.addEventListener('load',()=>setTimeout(begin,3800));
  setTimeout(()=>{if(!hero.classList.contains('reveal'))begin();},5600);

  /* ===== supplied logo: restrained 70% width -> shrink -> clean handoff ===== */
  const word=document.getElementById('word');
  const head=document.getElementById('head');
  let START=window.innerWidth*.7; const DIST=520;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function computeStart(){
    START=window.innerWidth*(window.innerWidth<=860 ? 1 : .7)-(window.innerWidth<=860 ? 44 : 0);
    onScrollWord();
  }
  function onScrollWord(){
    const p=clamp(window.scrollY/DIST,0,1);
    const eased=1-Math.pow(1-p,3);
    const end=head.querySelector('.logo').getBoundingClientRect().width;
    word.style.width=(START+(end-START)*eased)+'px';
    head.classList.toggle('show',window.scrollY>DIST*0.92);
    word.classList.toggle('hide',p>=0.98);
  }
  addEventListener('scroll',onScrollWord,{passive:true});
  addEventListener('resize',computeStart);
  computeStart();
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(computeStart);}
  window.addEventListener('load',computeStart);
  setTimeout(computeStart,700); setTimeout(computeStart,2400);

  /* ===== scroll reveals ===== */
  const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){
    // gentle stagger for siblings revealed in the same pass
    const idx=[...e.target.parentElement.querySelectorAll('.rise:not(.in)')].indexOf(e.target);
    setTimeout(()=>e.target.classList.add('in'),Math.max(0,idx)*110);
    io.unobserve(e.target);
  }})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.rise').forEach(el=>io.observe(el));

  /* ===== LUXURY MOTION STUDY: directional service choreography ===== */
  const luxuryMotionReduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const serviceChapters=[...document.querySelectorAll('.svc-row')];
  if(luxuryMotionReduced){
    serviceChapters.forEach(row=>row.classList.add('luxury-in'));
  }else{
    const serviceIO=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('luxury-in');serviceIO.unobserve(entry.target);}
    }),{threshold:.22,rootMargin:'0px 0px -8% 0px'});
    serviceChapters.forEach(row=>serviceIO.observe(row));
  }

  /* ===== family portrait: restrained scroll drift ===== */
  const familyPortrait=document.querySelector('.family-editorial-portrait');
  if(familyPortrait&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    let familyFrame=false;
    const updateFamilyPortrait=()=>{
      const rect=familyPortrait.getBoundingClientRect();
      const progress=clamp((innerHeight-rect.top)/(innerHeight+rect.height),0,1);
      familyPortrait.style.setProperty('--family-shift',((progress-.5)*28)+'px');
      familyFrame=false;
    };
    const queueFamilyPortrait=()=>{
      if(!familyFrame){requestAnimationFrame(updateFamilyPortrait);familyFrame=true;}
    };
    addEventListener('scroll',queueFamilyPortrait,{passive:true});
    addEventListener('resize',queueFamilyPortrait,{passive:true});
    updateFamilyPortrait();
  }

  /* ===== masked, staggered word reveal ===== */
  document.querySelectorAll('[data-word-reveal]').forEach(statement=>{
    let wordIndex=0;
    const wrapWords=node=>{
      [...node.childNodes].forEach(child=>{
        if(child.nodeType===Node.TEXT_NODE){
          const fragment=document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part=>{
            if(!part)return;
            if(/^\s+$/.test(part)){fragment.appendChild(document.createTextNode(part));return;}
            const mask=document.createElement('span');
            const word=document.createElement('span');
            mask.className='reveal-word';
            mask.style.setProperty('--word-index',wordIndex++);
            word.textContent=part;
            mask.appendChild(word);
            fragment.appendChild(mask);
          });
          child.replaceWith(fragment);
        }else if(child.nodeType===Node.ELEMENT_NODE){wrapWords(child);}
      });
    };
    wrapWords(statement);
    const wordIO=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('words-in');wordIO.unobserve(entry.target);}
    }),{threshold:.3,rootMargin:'0px 0px -8% 0px'});
    wordIO.observe(statement);
  });

  /* ===== newsletter placeholder until the mailing platform is connected ===== */
  document.getElementById('newsletterForm').addEventListener('submit',event=>event.preventDefault());

  /* ===== work wipe: hover on desktop, one centered row on touch ===== */
  const touchRows=[...document.querySelectorAll('.svc-row')];
  const touchLayout=matchMedia('(hover:none), (pointer:coarse)');
  if(touchLayout.matches && !matchMedia('(prefers-reduced-motion:reduce)').matches){
    let activeRow=null;
    let wipeQueued=false;
    const updateTouchWipe=()=>{
      const screenCenter=innerHeight/2;
      const visible=touchRows.map(row=>{
        const rect=row.getBoundingClientRect();
        return {row,rect,distance:Math.abs(rect.top+rect.height/2-screenCenter)};
      }).filter(item=>item.rect.bottom>0&&item.rect.top<innerHeight)
        .sort((a,b)=>a.distance-b.distance);
      const nearest=visible[0];
      const current=visible.find(item=>item.row===activeRow);
      let next=activeRow;

      if(!nearest||nearest.distance>innerHeight*.42){
        next=null;
      }else if(!current||current.distance>innerHeight*.38||nearest.distance+42<current.distance){
        next=nearest.row;
      }

      if(next!==activeRow){
        touchRows.forEach(row=>row.classList.toggle('wiped',row===next));
        activeRow=next;
      }
      wipeQueued=false;
    };
    const queueTouchWipe=()=>{
      if(!wipeQueued){requestAnimationFrame(updateTouchWipe);wipeQueued=true;}
    };
    addEventListener('scroll',queueTouchWipe,{passive:true});
    addEventListener('resize',queueTouchWipe,{passive:true});
    updateTouchWipe();
  }

  /* ===== featured: horizontal atelier filmstrip ===== */
  const motionAllowed=!matchMedia('(prefers-reduced-motion:reduce)').matches;
  const filmstripScroll=document.getElementById('filmstripScroll');
  const filmstripTrack=document.getElementById('filmstripTrack');
  const filmCards=[...document.querySelectorAll('.film-card')];
  if(motionAllowed&&'IntersectionObserver' in window){
    const filmIO=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){filmstripScroll.classList.add('entered');setTimeout(()=>filmstripScroll.classList.add('settled'),1500);filmIO.unobserve(entry.target);}
    }),{threshold:.08});
    filmIO.observe(filmstripScroll);
    setTimeout(()=>filmstripScroll.classList.add('entered','settled'),2200);
  }else{
    filmstripScroll.classList.add('entered','settled');
  }
  let filmTargetX=0,filmCurrentX=0,filmTargetProgress=0,filmCurrentProgress=0,filmRunning=false,filmInitialized=false;
  function measureFilmstrip(){
    if(!motionAllowed)return;
    const rect=filmstripScroll.getBoundingClientRect();
    const travel=Math.max(1,filmstripScroll.offsetHeight-innerHeight);
    const progress=clamp(-rect.top/travel,0,1);
    const maxShift=Math.max(0,filmstripTrack.scrollWidth-innerWidth);
    filmTargetX=-progress*maxShift;filmTargetProgress=progress;
    if(!filmInitialized){filmCurrentX=filmTargetX;filmCurrentProgress=progress;filmInitialized=true;}
    if(!filmRunning){filmRunning=true;requestAnimationFrame(renderFilmstrip);}
  }
  function renderFilmstrip(){
    filmCurrentX+=(filmTargetX-filmCurrentX)*.095;
    filmCurrentProgress+=(filmTargetProgress-filmCurrentProgress)*.095;
    filmstripTrack.style.transform=`translate3d(${filmCurrentX}px,0,0)`;
    let active=0,strongest=-1;
    filmCards.forEach((card,index)=>{
      const center=card.offsetLeft+card.offsetWidth/2+filmCurrentX;
      const focus=clamp(1-Math.abs(center-innerWidth/2)/(card.offsetWidth*.8),0,1);
      const eased=focus*focus*(3-2*focus);
      card.style.transform=`translateZ(0) scale(${.91+eased*.09})`;
      card.style.opacity=String(.42+eased*.58);
      card.querySelector('.film-image').style.transform=`scale(${1.06-eased*.06})`;
      if(focus>strongest){strongest=focus;active=index;}
    });
    filmCards.forEach((card,index)=>card.classList.toggle('active',index===active));
    if(Math.abs(filmTargetX-filmCurrentX)>.15||Math.abs(filmTargetProgress-filmCurrentProgress)>.0002){requestAnimationFrame(renderFilmstrip);}else{
      filmCurrentX=filmTargetX;filmCurrentProgress=filmTargetProgress;filmRunning=false;
    }
  }
  addEventListener('scroll',measureFilmstrip,{passive:true});
  addEventListener('resize',()=>{filmInitialized=false;measureFilmstrip();},{passive:true});
  measureFilmstrip();

  /* ===== subtle parallax ===== */
  const px=[...document.querySelectorAll('[data-parallax]')];
  let ticking=false;
  function parallax(){
    const vh=innerHeight;
    px.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.bottom<0||r.top>vh)return;
      const speed=parseFloat(el.dataset.parallax);
      const center=r.top+r.height/2;
      el.style.transform=`translateY(${(center-vh/2)*-speed}px)`;
    });
    ticking=false;
  }
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(parallax);ticking=true;}},{passive:true});
  parallax();

