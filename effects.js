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