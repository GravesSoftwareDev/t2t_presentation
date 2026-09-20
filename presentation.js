/* =====================================================================
   The presentation engine: turns OUTLINE (from slides.js) into a flat
   list of slides, then renders whichever one is current and handles
   moving between them.
   ===================================================================== */

/* ================= build the slide list from the outline ================= */

// Every part gets an automatic "LEVEL" title card (unless it opts out with
// card:false), then its moments are added as slides in order. A moment
// only needs its own "type" when it uses a special layout; otherwise it
// falls back to the normal kicker/title/bullets layout.
function buildSlides(outline){
  const slides = [];
  outline.forEach(function(part){
    if(part.card !== false){
      slides.push({
        part: part.part,
        type: 'section',
        level: 'LEVEL ' + part.part,
        name: part.name,
        tag: part.tag,
        duration: part.duration
      });
    }
    part.moments.forEach(function(moment){
      const slide = Object.assign({ part: part.part }, moment);
      if(!slide.type) slide.type = 'content';
      slides.push(slide);
    });
  });
  return slides;
}

const SLIDES = buildSlides(OUTLINE);

/* ================= state ================= */

const state = {
  current: 0,
  maxVisited: 0,
  shownAch: new Set(),
};

/* ================= DOM refs ================= */

const stage = document.getElementById('stage');
const hudLevel = document.getElementById('hud-level');
const hudPart = document.getElementById('hud-partname');
const xpWrap = document.getElementById('xp-wrap');
const xpBar = document.getElementById('xp-bar');
const hudCounter = document.getElementById('hud-counter');
const achToast = document.getElementById('achievement-toast');
const achText = document.getElementById('ach-text');
const flash = document.getElementById('levelup-flash');
const flashText = document.getElementById('levelup-text');
const charSheet = document.getElementById('char-sheet');
const statRows = document.getElementById('stat-rows');
const questMap = document.getElementById('quest-map');
const mapGroups = document.getElementById('map-groups');
const mapClose = document.getElementById('map-close');
const btnMap = document.getElementById('btn-map');
const btnSheet = document.getElementById('btn-sheet');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

/* ================= small render helpers ================= */

function bulletsHTML(bullets){
  return '<ul class="quest-list">' + bullets.map(b=>'<li><span class="bullet" aria-hidden="true">&#9656;</span><span>'+b+'</span></li>').join('') + '</ul>';
}
function checklistHTML(items){
  return '<ul class="quest-list checklist">' + items.map(it=>{
    const cls = it.status === 'done' ? 'done' : 'active';
    const mark = it.status === 'done' ? '✓' : '▸';
    const statusWord = it.status === 'done' ? 'Done: ' : 'In progress: ';
    return '<li class="'+cls+'"><span class="box" aria-hidden="true">'+mark+'</span><span><span class="sr-only">'+statusWord+'</span>'+it.text+'</span></li>';
  }).join('') + '</ul>';
}

function computeStats(uptoIndex){
  const totals = {};
  STATS.forEach(s=>totals[s.key]=0);
  for(let i=0;i<=uptoIndex;i++){
    const sl = SLIDES[i];
    if(sl.boosts){
      sl.boosts.forEach(b=>{ totals[b.key] = Math.min((totals[b.key]||0)+b.amount, 5); });
    }
  }
  return totals;
}

function renderStatSheet(){
  const totals = computeStats(state.maxVisited);
  statRows.innerHTML = STATS.map(s=>{
    const val = totals[s.key]||0;
    let pips='';
    for(let i=0;i<s.max;i++){ pips += '<span class="'+(i<val?'on':'')+'"></span>'; }
    return '<div class="stat-row"><div class="stat-label"><span><span aria-hidden="true">'+s.icon+'</span> '+s.label+'</span><span>'+val+'/'+s.max+'</span></div>'+
      '<div class="stat-pips" role="img" aria-label="'+s.label+': '+val+' of '+s.max+'">'+pips+'</div></div>';
  }).join('');
}

/* ================= slide templates ================= */
// Each case renders exactly one <h1>, so screen reader users get a
// heading to navigate to on every slide. Where the visual design doesn't
// have an obvious title on screen (the big-statement and NPC dialogue
// slides), a visually hidden h1 (.sr-only) still carries that structure.

function slideBodyHTML(sl){
  switch(sl.type){
    case 'title':
      return (
        '<div class="type-title">'+
        '<h1 class="title-glow">'+sl.title+'</h1>'+
        '<p class="title-sub">'+sl.subtitle+'</p>'+
        '<p class="title-meta">'+sl.meta+'</p>'+
        '<p class="press-start blink" aria-hidden="true">&#9654; PRESS START (or click below) &#9654;</p>'+
        '<p class="byline">'+sl.byline+'</p>'+
        // Only visible in fullscreen (see styles.css): that's when the deck is
        // being projected and the audience can scan along on their phones.
        '<div class="follow-along">'+
          '<p class="follow-text">FOLLOW ALONG AT<br><b>getinvolved-t2t.gravessoftware.dev</b></p>'+
          '<div class="qr-wrap">'+
            '<div id="follow-qr" class="linkedin-qr" role="img" aria-label="QR code that opens the presentation on your phone"></div>'+
          '</div>'+
        '</div>'+
        '</div>'
      );
    case 'section':
      return (
        '<div class="type-section">'+
        '<p class="section-lv">'+sl.level+'</p>'+
        '<h1 class="section-name">'+sl.name+'</h1>'+
        '<p class="section-tag">“'+sl.tag+'”</p>'+
        '<p class="section-duration">'+sl.duration+'</p>'+
        sectionTrack(sl.part)+
        '</div>'
      );
    case 'hook':
      return (
        '<p class="kicker">'+sl.kicker+'</p>'+
        '<h1 class="slide-title">'+sl.title+'</h1>'+
        '<div class="panel"><p class="slide-body">'+sl.body+'</p>'+
        '<div class="hook-choices">'+
          '<button class="hook-btn" data-resp="'+encodeURIComponent(sl.responseA)+'">'+sl.choiceA+'</button>'+
          '<button class="hook-btn" data-resp="'+encodeURIComponent(sl.responseB)+'">'+sl.choiceB+'</button>'+
        '</div>'+
        '<p class="hook-response" id="hook-response" role="status" hidden></p>'+
        '</div>'
      );
    case 'statement':
      return (
        '<div class="type-statement">'+
        '<h1 class="sr-only">'+sl.title+'</h1>'+
        '<p class="kicker">'+sl.kicker+'</p>'+
        '<p class="statement-text">'+sl.statement+'</p>'+
        (sl.note ? '<p class="statement-note">'+sl.note+'</p>' : '')+
        '</div>'
      );
    case 'content':
      return (
        '<p class="kicker">'+sl.kicker+'</p>'+
        '<h1 class="slide-title">'+sl.title+'</h1>'+
        '<div class="panel">'+
        (sl.bullets ? bulletsHTML(sl.bullets) : checklistHTML(sl.checklist))+
        '</div>'
      );
    case 'victory':
      return (
        '<p class="kicker">'+sl.kicker+'</p>'+
        '<p class="victory-trophy" aria-hidden="true">🏆</p>'+
        '<h1 class="slide-title" style="text-align:center">'+sl.title+'</h1>'+
        '<p class="victory-sub">'+sl.sub+'</p>'+
        '<div class="panel item-card">'+
          '<div class="item-icon" aria-hidden="true">🪨</div>'+
          '<div><p class="item-title">'+sl.itemTitle+'</p><p class="item-desc">'+sl.itemDesc+'</p></div>'+
        '</div>'
      );
    case 'roster':
      return (
        '<p class="kicker">'+sl.kicker+'</p>'+
        '<h1 class="slide-title">'+sl.title+'</h1>'+
        '<div class="panel">'+
        '<p class="slide-body" style="font-size:1.25rem;margin-bottom:1rem;">'+sl.intro+'</p>'+
        '<ul class="roster" style="list-style:none;padding:0;">'+sl.roster.map(r=>(
          '<li class="roster-card"><div class="roster-icon" aria-hidden="true">'+r.icon+'</div><p class="roster-role">'+r.role+'</p><p class="roster-name">'+r.name+'</p></li>'
        )).join('')+'</ul>'+
        '<p class="statement-note" style="margin-top:1.2rem;">'+sl.footer+'</p>'+
        '</div>'
      );
    case 'dialogue':
      return (
        '<p class="kicker">NPC ENCOUNTER</p>'+
        '<div class="panel dialogue-box">'+
        '<div class="dialogue-portrait" aria-hidden="true">'+sl.portrait+'</div>'+
        '<div style="flex:1;">'+
          '<h1 class="dialogue-name">'+sl.name+'</h1>'+
          '<p class="dialogue-role">'+sl.role+'</p>'+
          '<p class="dialogue-text">'+sl.text+'</p>'+
          '<p class="dialogue-next blink" aria-hidden="true">▼</p>'+
        '</div>'+
        '</div>'+
        '<p class="statement-note" style="margin-top:1rem;">'+sl.footnote+'</p>'
      );
    case 'cta':
      return (
        '<p class="kicker">'+sl.kicker+'</p>'+
        '<h1 class="slide-title">'+sl.title+'</h1>'+
        '<div class="panel"><p class="slide-body">'+sl.body+'</p>'+
        // Plain text chips, not links: there's no real URL yet. See the
        // .cta-btn comment in styles.css.
        '<div class="cta-row">'+sl.ctas.map(c=>'<div class="cta-btn">'+c+'</div>').join('')+'</div>'+
        '</div>'
      );
    case 'final':
      return (
        '<div class="type-section">'+
        '<p class="section-lv">'+sl.kicker+'</p>'+
        '<h1 class="section-name" style="font-size:clamp(1.2rem,4.4vw,2rem);">'+sl.title+'</h1>'+
        '<p class="section-tag">'+sl.recap+'</p>'+
        '<p class="section-duration" style="margin-top:1.5rem;">THE END. QUESTIONS?</p>'+
        // The QR code is hidden on small screens (see styles.css): scanning
        // a code on the same phone you're viewing it on doesn't work, so
        // mobile visitors just get the tappable link instead. The QR
        // itself is drawn into #linkedin-qr by renderQR() (qr.js),
        // called from render() right after this markup is inserted.
        '<div class="linkedin-card">'+
          '<div class="qr-wrap">'+
            '<div id="linkedin-qr" class="linkedin-qr" role="img" aria-label="QR code that opens Shanna Graves’ LinkedIn profile"></div>'+
            '<p class="qr-caption">SCAN TO CONNECT</p>'+
          '</div>'+
          '<a class="linkedin-link" href="'+sl.linkedin+'" target="_blank" rel="noopener noreferrer">🔗 CONNECT ON LINKEDIN</a>'+
        '</div>'+
        '<p class="statement-note" style="margin-top:1rem;">press R to replay</p>'+
        '</div>'
      );
    default:
      return '';
  }
}

function sectionTrack(currentPart){
  let html = '<div class="section-track" aria-hidden="true">'; // decorative; the HUD progress bar is the accessible version
  for(let p=1;p<=4;p++){
    let cls = '';
    if(p < currentPart) cls='filled';
    if(p === currentPart) cls='filled current';
    html += '<span class="'+cls+'"></span>';
  }
  html += '</div>';
  return html;
}

/* ================= render ================= */

let lastPart = null;

function render(){
  const idx = state.current;
  const sl = SLIDES[idx];

  document.body.dataset.part = sl.part;
  hudLevel.textContent = 'LV ' + sl.part;
  hudPart.textContent = PART_NAMES[sl.part];
  hudCounter.textContent = (idx+1) + ' / ' + SLIDES.length;
  xpBar.style.width = (((idx+1)/SLIDES.length)*100) + '%';
  xpWrap.setAttribute('aria-valuemax', SLIDES.length);
  xpWrap.setAttribute('aria-valuenow', idx+1);
  xpWrap.setAttribute('aria-valuetext', 'Slide '+(idx+1)+' of '+SLIDES.length);

  stage.innerHTML = slideBodyHTML(sl);
  stage.scrollTop = 0;

  if(sl.type === 'title' && sl.followUrl){
    renderQR('follow-qr', sl.followUrl);
  }
  if(sl.type === 'final'){
    renderQR('linkedin-qr', sl.linkedin);
  }

  btnPrev.disabled = idx===0;
  btnNext.disabled = idx===SLIDES.length-1;

  // hook interactivity
  if(sl.type==='hook'){
    stage.querySelectorAll('.hook-btn').forEach(btn=>{
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        const resp = decodeURIComponent(this.dataset.resp);
        const box = document.getElementById('hook-response');
        box.textContent = resp;
        box.hidden = false;
        playBeep(720);
      });
    });
  }

  // Level-up flash when arriving at a section card from a different part.
  // Skipped under reduced motion; the big "LEVEL X" card text already
  // communicates the transition without the animated flash.
  if(sl.type==='section' && lastPart!==null && lastPart!==sl.part){
    if(!prefersReducedMotion()){
      flashText.textContent = sl.level + ' UNLOCKED!';
      flash.classList.remove('play');
      void flash.offsetWidth; // restart the CSS animation
      flash.classList.add('play');
    }
    playBeep(880, 0.15);
    setTimeout(()=>playBeep(1175,0.18), 150);
  }
  lastPart = sl.part;

  // achievement toast
  if(sl.achievement && !state.shownAch.has(idx)){
    state.shownAch.add(idx);
    showAchievement(sl.achievement);
  }

  if(idx > state.maxVisited) state.maxVisited = idx;
  renderStatSheet();
  updateMapHighlight();
  saveState();
}

function showAchievement(text){
  achText.textContent = text;
  achToast.classList.add('show');
  playBeep(1046, 0.12);
  clearTimeout(showAchievement._t);
  showAchievement._t = setTimeout(()=>achToast.classList.remove('show'), 3200);
}

/* ================= navigation ================= */

function goTo(i){
  i = Math.max(0, Math.min(SLIDES.length-1, i));
  state.current = i;
  render();
}
function next(){ if(state.current < SLIDES.length-1){ playBeep(660,0.06); goTo(state.current+1); } }
function prev(){ if(state.current > 0){ playBeep(440,0.06); goTo(state.current-1); } }

btnNext.addEventListener('click', next);
btnPrev.addEventListener('click', prev);

stageOuter.addEventListener('click', function(e){
  if(e.target.closest('button, a')) return; // don't double-advance when a real control was clicked
  next();
});

/* ================= quest map ================= */

// Focus returns here when the quest map closes, so keyboard/screen-reader
// users land back where they were instead of at the top of the page.
let mapPreviousFocus = null;

function buildMap(){
  const groups = {};
  SLIDES.forEach((sl,i)=>{
    const key = sl.part;
    if(!groups[key]) groups[key]=[];
    let label = (sl.title||sl.name||sl.kicker||('Slide '+(i+1))).replace(/<[^>]+>/g,'');
    if(label.length>28) label = label.slice(0,27)+'…';
    groups[key].push({i,label});
  });
  mapGroups.innerHTML = Object.keys(groups).sort((a,b)=>a-b).map(part=>{
    const nodes = groups[part].map(n=>(
      '<button class="map-node" data-i="'+n.i+'">'+(n.i+1)+'. '+n.label+'</button>'
    )).join('');
    return '<div class="map-group"><h3>LV '+part+': '+PART_NAMES[part]+'</h3><div class="map-nodes">'+nodes+'</div></div>';
  }).join('');
  mapGroups.querySelectorAll('.map-node').forEach(btn=>{
    btn.addEventListener('click', function(){
      goTo(parseInt(this.dataset.i,10));
      toggleMap(false);
    });
  });
}
function updateMapHighlight(){
  mapGroups.querySelectorAll('.map-node').forEach(btn=>{
    const isCurrent = parseInt(btn.dataset.i,10)===state.current;
    btn.classList.toggle('current', isCurrent);
    if(isCurrent){ btn.setAttribute('aria-current','true'); } else { btn.removeAttribute('aria-current'); }
  });
}
function getFocusableInMap(){
  return Array.from(questMap.querySelectorAll('button'));
}
function toggleMap(force){
  const show = force !== undefined ? force : questMap.hidden;
  questMap.hidden = !show;
  btnMap.setAttribute('aria-expanded', String(show));
  if(show){
    mapPreviousFocus = document.activeElement;
    updateMapHighlight();
    mapClose.focus();
  } else if(mapPreviousFocus){
    mapPreviousFocus.focus();
    mapPreviousFocus = null;
  }
}
btnMap.addEventListener('click', ()=>toggleMap());
mapClose.addEventListener('click', ()=>toggleMap(false));

// Simple focus trap: while the quest map is open, Tab/Shift+Tab cycles
// between its own buttons instead of escaping into the page behind it.
questMap.addEventListener('keydown', function(e){
  if(e.key !== 'Tab') return;
  const focusable = getFocusableInMap();
  if(focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length-1];
  if(e.shiftKey && document.activeElement === first){
    e.preventDefault(); last.focus();
  } else if(!e.shiftKey && document.activeElement === last){
    e.preventDefault(); first.focus();
  }
});

/* ================= character sheet ================= */

function toggleSheet(force){
  const collapsed = charSheet.classList.contains('collapsed');
  const show = force !== undefined ? force : collapsed;
  charSheet.classList.toggle('collapsed', !show);
  btnSheet.setAttribute('aria-expanded', String(show));
}
btnSheet.addEventListener('click', ()=>toggleSheet());

/* ================= keyboard ================= */

document.addEventListener('keydown', function(e){
  const tag = (e.target && e.target.tagName) || '';
  if(tag==='INPUT' || tag==='TEXTAREA') return;

  switch(e.key){
    case 'ArrowRight': case ' ': case 'PageDown':
      e.preventDefault(); next(); break;
    case 'ArrowLeft': case 'PageUp':
      e.preventDefault(); prev(); break;
    case 'Home':
      e.preventDefault(); goTo(0); break;
    case 'End':
      e.preventDefault(); goTo(SLIDES.length-1); break;
    case 'm': case 'M':
      toggleMap(); break;
    case 'c': case 'C':
      toggleSheet(); break;
    case 'f': case 'F':
      toggleFullscreen(); break;
    case 's': case 'S':
      btnSound.click(); break;
    case 'v': case 'V':
      btnFx.click(); break;
    case 'r': case 'R':
      state.maxVisited = 0; state.shownAch.clear(); lastPart=null; goTo(0); break;
    case 'Escape':
      if(!questMap.hidden) toggleMap(false); break;
  }
});

/* ================= init ================= */

loadState();
buildMap();
initStarfield();
render();
