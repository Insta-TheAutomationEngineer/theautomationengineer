/* TheAutomationEngineer — "The Cut" | scrubber + comet thread + deterrents */

"use strict";
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     CODE-VIEW + COPY DETERRENTS  (added at your request)
     ------------------------------------------------------------
     HONEST NOTE: these raise the bar for casual snooping only. They
     CANNOT stop anyone from viewing the source — the browser builds
     the page FROM this code, so Chrome's DevTools (including the menu
     option), "View Source", or simply turning JavaScript off bypass
     everything here, and copy-blocking is undone by reading the source.
     The DevTools hint is non-destructive + dismissible so a false
     positive never blanks the page. Delete this block to undo it all.
     ============================================================ */
  (function deterrents(){
    // disable copy / cut / text-selection / drag (requested)
    ['copy','cut','selectstart','dragstart'].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault()));
    // right-click -> "View Source" / "Inspect"
    document.addEventListener('contextmenu', e=>e.preventDefault());
    // inspect / view-source / save-page keyboard shortcuts
    document.addEventListener('keydown', e=>{
      const k=(e.key||'').toLowerCase();
      if(e.key==='F12'){e.preventDefault();return;}
      if(e.ctrlKey && e.shiftKey && (k==='i'||k==='j'||k==='c')){e.preventDefault();return;}
      if(e.ctrlKey && (k==='u'||k==='s')){e.preventDefault();return;}
    });
    // friendly console notice
    try{
      console.log('%cTheAutomationEngineer','color:#38e1d6;font:700 26px Space Grotesk,system-ui,sans-serif');
      console.log('%cClient-side code is always visible in a browser — there are no secrets here. Curious how it works? Say hi on Instagram @TheAutomationEngineer.','color:#9aa3b2;font:500 13px JetBrains Mono,monospace');
    }catch(_){}
    // non-destructive DevTools-open hint: dismissible + auto-hides, so a false positive
    // (docked panel, zoom) never bricks the page the way the old detector could.
    const warn=document.getElementById('devtools-warning');
    if(warn){
      const dismiss=warn.querySelector('[data-dismiss]');
      let open=false, killed=false;
      if(dismiss)dismiss.addEventListener('click',()=>{warn.classList.remove('show');killed=true;});
      setInterval(()=>{
        if(killed)return;
        const d=(window.outerWidth-window.innerWidth>170)||(window.outerHeight-window.innerHeight>170);
        if(d&&!open){open=true;warn.classList.add('show');}
        else if(!d&&open){open=false;warn.classList.remove('show');}
      },1200);
    }
  })();

  /* ---------- mobile menu ---------- */
  const menuBtn=document.getElementById('menuBtn'), tabs=document.getElementById('tabs');
  if(menuBtn&&tabs){
    const setMenu=(open)=>{
      menuBtn.classList.toggle('open',open);
      tabs.classList.toggle('show',open);
      menuBtn.setAttribute('aria-expanded',open?'true':'false');
    };
    menuBtn.addEventListener('click',(e)=>{e.stopPropagation();setMenu(!tabs.classList.contains('show'));});
    tabs.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
    document.addEventListener('click',(e)=>{ if(tabs.classList.contains('show') && !tabs.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') setMenu(false); });
  }

  /* ---------- topbar shadow ---------- */
  const topbar=document.getElementById('topbar');
  const onTop=()=>topbar.classList.toggle('scrolled',window.scrollY>16);
  window.addEventListener('scroll',onTop,{passive:true});onTop();

  /* ---------- reveal ---------- */
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  /* ---------- counters ---------- */
  const cio=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){const el=e.target,t=+el.dataset.target;const dur=1500,s=performance.now();const tick=(n)=>{const p=Math.min((n-s)/dur,1);el.textContent=Math.round((1-Math.pow(1-p,4))*t);if(p<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);cio.unobserve(el);}});},{threshold:.6});
  document.querySelectorAll('.cnt[data-target]').forEach(el=>cio.observe(el));

  /* ---------- smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',function(e){const id=this.getAttribute('href');if(id.length<2)return;const t=document.querySelector(id);if(!t)return;e.preventDefault();const y=t.getBoundingClientRect().top+window.pageYOffset-64;window.scrollTo({top:y,behavior:reduce?'auto':'smooth'});});});

  /* ---------- active tab + live timecode ---------- */
  const secs=[...document.querySelectorAll('section[id]')];
  const tabA=[...document.querySelectorAll('.tabs a')];
  const liveTC=document.getElementById('liveTC');
  const f2=(n)=>String(n).padStart(2,'0');
  const onScrollUI=()=>{
    const y=window.pageYOffset;
    // live timecode from scroll progress
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const p=max>0?y/max:0;
    const totalFrames=Math.round(p*(151*24)); // ~2:31:00 @24fps
    const ff=totalFrames%24, ss=Math.floor(totalFrames/24)%60, mm=Math.floor(totalFrames/24/60)%60, hh=Math.floor(totalFrames/24/3600);
    liveTC.textContent=`${f2(hh)}:${f2(mm)}:${f2(ss)}:${f2(ff)}`;
    // active tab
    let cur=secs[0];
    for(const s of secs){if(y>=s.offsetTop-140)cur=s;}
    tabA.forEach(a=>a.classList.toggle('on',a.dataset.sec===cur.id));
  };
  window.addEventListener('scroll',onScrollUI,{passive:true});onScrollUI();

  /* ============================================================
     FRAME-BY-FRAME RETENTION SCRUBBER (hero signature)
     ============================================================ */
  (function scrubber(){
    const N=11;
    const strip=document.getElementById('filmstrip');
    if(!strip)return;
    // retention values per frame (well-edited video: dips then holds high)
    const R=[100,99,95,86,91,95,97,96,98,94,96]; // % retained, swipe-away dip at idx 3
    const swipeIdx=3;
    for(let i=0;i<N;i++){const d=document.createElement('div');d.className='frame';d.dataset.f=f2(i+1);d.innerHTML='<i></i>';strip.appendChild(d);}
    const frames=[...strip.children];

    const W=330,H=124,pad=6;
    const xAt=(i)=> pad + (W-2*pad)*(i/(N-1));
    const yAt=(v)=> pad + (H-2*pad)*(1-(v-80)/20); // map 80..100 -> bottom..top
    let dPath='', dArea='M'+xAt(0)+','+(H-pad);
    for(let i=0;i<N;i++){const x=xAt(i),y=yAt(R[i]);dPath+=(i?'L':'M')+x+','+y;dArea+='L'+x+','+y;}
    dArea+='L'+xAt(N-1)+','+(H-pad)+'Z';
    document.getElementById('retainLine').setAttribute('d',dPath);
    document.getElementById('retainArea').setAttribute('d',dArea);
    // swipe marker
    const sm=document.getElementById('swipeMark'), sd=document.getElementById('swipeDot');
    sm.setAttribute('x1',xAt(swipeIdx));sm.setAttribute('x2',xAt(swipeIdx));sm.setAttribute('y1',yAt(R[swipeIdx]));sm.setAttribute('y2',H-pad);
    sd.setAttribute('cx',xAt(swipeIdx));sd.setAttribute('cy',yAt(R[swipeIdx]));
    document.getElementById('swipeLbl').style.left=(xAt(swipeIdx)/W*100)+'%';
    document.getElementById('swipeLbl').style.bottom='6px';

    const ph=document.getElementById('playhead'), rFrame=document.getElementById('rFrame'),
          rTC=document.getElementById('rTC'), rRet=document.getElementById('rRet');
    const wrap=document.getElementById('curveWrap');

    function setFrac(fr){
      fr=Math.max(0,Math.min(1,fr));
      const idx=Math.round(fr*(N-1));
      ph.style.left=(fr*100)+'%';
      frames.forEach((f,i)=>f.classList.toggle('act',i===idx));
      rFrame.textContent=f2(idx+1);
      const secF=idx; // pretend each frame ~1s for the readout
      rTC.textContent='00:'+f2(secF);
      rRet.textContent=R[idx]+'%';
      rRet.style.color = R[idx]<90 ? 'var(--rec)' : 'var(--data)';
    }
    setFrac(0);

    let dragging=false;
    const fracFromX=(clientX)=>{const r=wrap.getBoundingClientRect();return (clientX-r.left)/r.width;};
    const startDrag=(x)=>{dragging=true;auto=false;setFrac(fracFromX(x));};
    const moveDrag=(x)=>{if(dragging)setFrac(fracFromX(x));};
    const endDrag=()=>{dragging=false;};
    strip.addEventListener('pointerdown',e=>{strip.setPointerCapture(e.pointerId);startDrag(e.clientX);});
    strip.addEventListener('pointermove',e=>moveDrag(e.clientX));
    strip.addEventListener('pointerup',endDrag);
    strip.addEventListener('pointercancel',endDrag);
    wrap.addEventListener('pointerdown',e=>{auto=false;setFrac(fracFromX(e.clientX));});
    wrap.addEventListener('pointermove',e=>{if(e.buttons===1)setFrac(fracFromX(e.clientX));});

    // gentle autoplay until user interacts (skip when reduced motion)
    let auto=!reduce, t0=performance.now();
    function loop(now){
      if(auto){const p=((now-t0)/4200)%1;setFrac(p);}
      requestAnimationFrame(loop);
    }
    if(!reduce)requestAnimationFrame(loop);
    strip.addEventListener('pointerenter',()=>{auto=false;document.getElementById('stripHint').textContent='scrubbing — release to hold';});
  })();

  /* ============================================================
     THE SELF-DRAWING COMET THREAD
     ============================================================ */
  (function thread(){
    const svg=document.getElementById('thread');
    const track=document.getElementById('threadTrack');
    const bloom=document.getElementById('threadBloom');
    const draw=document.getElementById('threadDraw');
    const dotsG=document.getElementById('threadDots');
    const comet=document.getElementById('comet');
    const core=document.getElementById('cometCore');
    const grad=document.getElementById('threadGrad');
    if(!svg||!draw)return;

    let L=0, samples=[], checkpoints=[], built=false, ys=[], pml=[];
    const REVEAL=0.62; // draw the thread down to ~62% of the viewport height

    function docSize(){
      return {
        w: Math.max(document.documentElement.scrollWidth, window.innerWidth),
        h: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
      };
    }
    function centerOf(el){
      const r=el.getBoundingClientRect();
      return { x:r.left+window.scrollX+r.width/2, y:r.top+window.scrollY+r.height/2 };
    }
    // Catmull-Rom -> cubic bezier through points
    function spline(pts){
      if(pts.length<2)return '';
      let d='M '+pts[0].x.toFixed(1)+' '+pts[0].y.toFixed(1);
      for(let i=0;i<pts.length-1;i++){
        const p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2;
        const c1x=p1.x+(p2.x-p0.x)/6, c1y=p1.y+(p2.y-p0.y)/6;
        const c2x=p2.x-(p3.x-p1.x)/6, c2y=p2.y-(p3.y-p1.y)/6;
        d+=' C '+c1x.toFixed(1)+' '+c1y.toFixed(1)+', '+c2x.toFixed(1)+' '+c2y.toFixed(1)+', '+p2.x.toFixed(1)+' '+p2.y.toFixed(1);
      }
      return d;
    }

    function build(){
      const size=docSize();
      svg.setAttribute('width',size.w);
      svg.setAttribute('height',size.h);
      svg.setAttribute('viewBox','0 0 '+size.w+' '+size.h);
      svg.style.height=size.h+'px';
      grad.setAttribute('y2',size.h);

      const wps=[...document.querySelectorAll('.wp')];
      // Anchors are authored top-to-bottom; the ONLY intentional upward run is the
      // climbing retention curve in the chart. Keeping DOM order (no Y-sort) preserves it.
      let pts=wps.map(el=>{const c=centerOf(el);return {x:c.x,y:c.y,cp:el.hasAttribute('data-cp')};});
      if(pts.length<2){built=false;return;}

      const d=spline(pts);
      track.setAttribute('d',d);
      bloom.setAttribute('d',d);
      draw.setAttribute('d',d);

      L=draw.getTotalLength();
      // dash setup
      [bloom,draw].forEach(p=>{p.style.strokeDasharray=L;p.style.strokeDashoffset=L;});

      // sample for checkpoint length lookup
      const S=Math.max(400,Math.min(1400,Math.round(L/3)));
      samples=[];
      for(let i=0;i<=S;i++){const l=L*i/S;const pt=draw.getPointAtLength(l);samples.push({l,x:pt.x,y:pt.y});}

      // Map vertical position -> revealed length (monotonic). The draw + dot lighting
      // then track where you are on the PAGE rather than the raw path-length fraction.
      // THIS IS THE FIX: the chart's climb and big diagonals inflate path length, which
      // previously pushed later sections' thresholds toward the end, so they only lit
      // once you reached the very bottom.
      const byY=samples.slice().sort((a,b)=>a.y-b.y);
      ys=byY.map(s=>s.y);
      pml=new Array(byY.length);
      let mx=0;
      for(let i=0;i<byY.length;i++){ if(byY[i].l>mx)mx=byY[i].l; pml[i]=mx; }

      // build checkpoint dots at cp waypoints
      dotsG.innerHTML='';
      checkpoints=[];
      pts.filter(p=>p.cp).forEach(p=>{
        // nearest sample length
        let best=0,bd=Infinity;
        for(const s of samples){const dx=s.x-p.x,dy=s.y-p.y,dd=dx*dx+dy*dy;if(dd<bd){bd=dd;best=s.l;}}
        const c=document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('class','cp');c.setAttribute('cx',p.x);c.setAttribute('cy',p.y);c.setAttribute('r','5.5');
        dotsG.appendChild(c);
        checkpoints.push({el:c,len:best,lit:false});
      });

      built=true;
      update();
    }

    // largest sampled length whose point sits at/above a given document-Y (binary search)
    function lenAtY(yT){
      let lo=0,hi=ys.length-1,ans=-1;
      while(lo<=hi){const m=(lo+hi)>>1; if(ys[m]<=yT){ans=m;lo=m+1;} else hi=m-1;}
      return ans>=0?pml[ans]:0;
    }

    function update(){
      if(!built)return;
      const vh=window.innerHeight;
      const maxScroll=document.documentElement.scrollHeight-vh;
      const sy=window.pageYOffset;
      let drawn;
      if(reduce){ drawn=L; }
      else{
        drawn=lenAtY(sy+vh*REVEAL);        // reveal everything above the ~62% reading line
        if(maxScroll-sy<2) drawn=L;        // guarantee the final CTA dot fills at the very bottom
      }
      drawn=Math.max(0,Math.min(L,drawn));
      const off=L-drawn;
      bloom.style.strokeDashoffset=off;
      draw.style.strokeDashoffset=off;

      if(!reduce){
        const pt=draw.getPointAtLength(drawn);
        comet.setAttribute('cx',pt.x);comet.setAttribute('cy',pt.y);
        core.setAttribute('cx',pt.x);core.setAttribute('cy',pt.y);
        const vis=(drawn>2 && drawn<L-2)?1:0;
        comet.style.opacity=vis; core.style.opacity=vis;
      }else{
        comet.style.opacity=0; core.style.opacity=0;
      }
      for(const cp of checkpoints){
        if(!cp.lit && drawn>=cp.len-2){cp.lit=true;cp.el.classList.add('lit');}
      }
    }

    // build after layout settles (fonts, reveals)
    let raf=0;
    const onScroll=()=>{if(raf)return;raf=requestAnimationFrame(()=>{raf=0;update();});};
    window.addEventListener('scroll',onScroll,{passive:true});

    let rt=0, lastW=window.innerWidth;
    const rebuild=()=>{clearTimeout(rt);rt=setTimeout(build,180);};
    window.addEventListener('resize',()=>{
      const w=window.innerWidth;
      if(w!==lastW){ lastW=w; rebuild(); }  // real resize / rotation -> rebuild path
      else{ update(); }                     // height-only (mobile URL bar hide/show) -> cheap
    });
    window.addEventListener('orientationchange',()=>setTimeout(rebuild,250));
    if(window.ResizeObserver){const ro=new ResizeObserver(rebuild);ro.observe(document.body);}

    const kick=()=>build();
    if(document.fonts&&document.fonts.ready){document.fonts.ready.then(()=>setTimeout(kick,60));}
    window.addEventListener('load',()=>setTimeout(kick,120));
    setTimeout(kick,400);
    setTimeout(kick,1200);
  })();

  /* ============================================================
     EMAIL — assembled from parts (anti-scrape). NOT obfuscation
     of source; just keeps naive spam bots from harvesting it.
     ============================================================ */
  (function email(){
    const parts=['er.achalsingh','sisodiya','@','gmail','.com'];
    const addr=parts.join('');
    const v=document.getElementById('emailV');
    const cx=document.getElementById('cxEmail');
    const cta=document.getElementById('ctaEmail');
    const fe=document.getElementById('footerEmail');
    if(v)v.textContent=addr;
    [cx,cta,fe].forEach(a=>{if(a)a.setAttribute('href','mailto:'+addr);});
  })();

  /* ---------- minimal, honest anti-clickjacking (legit; no UX harm) ---------- */
  if(window.top!==window.self){try{window.top.location=window.self.location;}catch(e){}}

})();
