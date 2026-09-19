const btnSound = document.getElementById('btn-sound');
const btnFx = document.getElementById('btn-fx');
const btnFull = document.getElementById('btn-full');

// True when animation should be skipped: either the OS-level "reduce
// motion" setting is on, or the presenter switched off effects manually
// with the FX button (adds body.fx-off).
function prefersReducedMotion(){
  return document.body.classList.contains('fx-off') ||
    (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

/* ---------- sound ---------- */

let soundOn = false;
let audioCtx = null;

function playBeep(freq, dur){
  if(!soundOn) return;
  try{
    if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (dur||0.08));
    osc.stop(audioCtx.currentTime + (dur||0.08) + 0.02);
  }catch(e){}
}

btnSound.addEventListener('click', function(){
  soundOn = !soundOn;
  this.setAttribute('aria-pressed', String(soundOn));
  this.textContent = soundOn ? '🔊 SFX' : '🔇 SFX';
  if(soundOn) playBeep(880,0.08);
});

/* ---------- effects / motion toggle ---------- */

btnFx.addEventListener('click', function(){
  const isOff = document.body.classList.toggle('fx-off');
  // aria-pressed reflects "effects are on" (like the sound button does for
  // sound), not the fx-off class itself, so the highlighted/pressed look
  // means "on" rather than "off".
  this.setAttribute('aria-pressed', String(!isOff));
});

/* ---------- fullscreen ---------- */

function toggleFullscreen(){
  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen().catch(()=>{});
  } else {
    document.exitFullscreen().catch(()=>{});
  }
}
btnFull.addEventListener('click', toggleFullscreen);
// Fullscreen can also be exited with the browser's own handling of Escape,
// bypassing our button, so keep the button's state in sync either way.
document.addEventListener('fullscreenchange', function(){
  btnFull.setAttribute('aria-pressed', String(!!document.fullscreenElement));
});

/* ---------- touch swipe ---------- */

let touchStartX = null;
const stageOuter = document.getElementById('stage-outer');
stageOuter.addEventListener('touchstart', function(e){
  touchStartX = e.changedTouches[0].clientX;
}, {passive:true});
stageOuter.addEventListener('touchend', function(e){
  if(touchStartX===null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if(Math.abs(dx) > 60){ dx < 0 ? next() : prev(); }
  touchStartX = null;
}, {passive:true});

/* ---------- remembering your place ---------- */
// Lets the presenter reload mid-rehearsal without losing their spot.
// Wrapped in try/catch because some browsers block localStorage in
// private/incognito windows.

function saveState(){
  try{
    localStorage.setItem('lvlup_t2t_state', JSON.stringify({
      current: state.current, maxVisited: state.maxVisited
    }));
  }catch(e){}
}
function loadState(){
  try{
    const raw = localStorage.getItem('lvlup_t2t_state');
    if(raw){
      const parsed = JSON.parse(raw);
      if(typeof parsed.current === 'number') state.current = Math.min(parsed.current, SLIDES.length-1);
      if(typeof parsed.maxVisited === 'number') state.maxVisited = Math.min(parsed.maxVisited, SLIDES.length-1);
    }
  }catch(e){}
}
