// Entry point for EggTimer app

// --- Falling Eggs Background ---
const eggCanvas = document.getElementById('falling-eggs-bg');
if (eggCanvas) {
  const ctx = eggCanvas.getContext('2d');
  let eggs = [];
  const eggCount = 18;
  function randomEgg() {
    return {
      x: Math.random() * window.innerWidth,
      y: -40 - Math.random() * 200,
      r: 18 + Math.random() * 10,
      speed: 1.2 + Math.random() * 1.8,
      tilt: Math.random() * Math.PI * 2,
      tiltSpeed: 0.01 + Math.random() * 0.02
    };
  }
  function drawEgg(egg) {
    ctx.save();
    ctx.translate(egg.x, egg.y);
    ctx.rotate(egg.tilt);
    ctx.scale(1, 1.25);
    ctx.beginPath();
    ctx.ellipse(0, 0, egg.r, egg.r * 1.2, 0, 0, 2 * Math.PI);
    ctx.fillStyle = '#fffbe6';
    ctx.shadowColor = '#ffe388';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }
  function animateEggs() {
    ctx.clearRect(0, 0, eggCanvas.width, eggCanvas.height);
    for (let egg of eggs) {
      drawEgg(egg);
      egg.y += egg.speed;
      egg.tilt += egg.tiltSpeed;
      if (egg.y - egg.r * 1.2 > window.innerHeight) {
        Object.assign(egg, randomEgg());
        egg.y = -egg.r * 1.2;
      }
    }
    requestAnimationFrame(animateEggs);
  }
  function resizeEggCanvas() {
    eggCanvas.width = window.innerWidth;
    eggCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeEggCanvas);
  resizeEggCanvas();
  eggs = Array.from({length: eggCount}, randomEgg);
  animateEggs();
}
// See TASK-project-structure.md, TASK-basic-timer-logic.md, TASK-timer-ui.md
import EggTimer from './timer.js';
const app = document.getElementById('app');

// --- UI Elements ---
const timerDisplay = document.createElement('div');
timerDisplay.id = 'timer-display';
timerDisplay.textContent = '00:00';

const controls = document.createElement('div');
controls.id = 'timer-controls';
controls.style.display = 'flex';
controls.style.justifyContent = 'center';
controls.style.gap = '16px';
controls.style.marginBottom = '24px';

function makeButton(label, color) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.style.background = color || '#eee';
  btn.style.color = '#222';
  btn.style.border = 'none';
  btn.style.borderRadius = '6px';
  btn.style.padding = '12px 28px';
  btn.style.fontSize = '1.1rem';
  btn.style.fontWeight = 'bold';
  btn.style.cursor = 'pointer';
  btn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
  btn.onmouseover = () => btn.style.background = '#d1eaff';
  btn.onmouseout = () => btn.style.background = color || '#eee';
  return btn;
}



// --- Minimal Timer Logic & Progress Bar ---
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Progress bar elements
const progressBarWrap = document.createElement('div');
progressBarWrap.id = 'progress-bar-wrap';
progressBarWrap.style.width = '100%';
progressBarWrap.style.height = '50px';
progressBarWrap.style.background = '#fff7b2';
progressBarWrap.style.borderRadius = '10px';
progressBarWrap.style.margin = '18px 0 10px 0';
progressBarWrap.style.overflow = 'hidden';

const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
progressBar.style.height = '100%';
progressBar.style.width = '0%';
progressBar.style.background = 'linear-gradient(90deg, #ffe388 0%, #b6e388 100%)';
progressBar.style.transition = 'width 0.3s cubic-bezier(.4,2,.6,1)';
progressBarWrap.appendChild(progressBar);

let timerDuration = 180;
const timer = new EggTimer(
  (remaining) => {
    timerDisplay.textContent = formatTime(remaining);
    // Update progress bar
    let percent = timerDuration === 0 ? 0 : ((timerDuration - remaining) / timerDuration) * 100;
    progressBar.style.width = `${percent}%`;
  },
  () => {
    timerDisplay.textContent = 'Done!';
    progressBar.style.width = '100%';
  }
);

// Set initial time (e.g., 3 minutes)
timer.setTime(timerDuration);


// --- Preset Buttons Row ---
const presetCard = document.createElement('div');
presetCard.id = 'preset-card';
presetCard.style.display = 'flex';
presetCard.style.justifyContent = 'center';
presetCard.style.alignItems = 'center';
presetCard.style.width = '100%';
presetCard.style.margin = '0 0 10px 0';
presetCard.style.boxSizing = 'border-box';

const presetButtons = document.createElement('div');
presetButtons.id = 'preset-buttons';
presetButtons.style.display = 'flex';
presetButtons.style.flexWrap = 'wrap';
presetButtons.style.justifyContent = 'center';
presetButtons.style.alignItems = 'center';
presetButtons.style.gap = '18px';
presetButtons.style.width = '100%';
presetButtons.style.maxWidth = '100%';
presetButtons.style.padding = '0 8px';
presetButtons.style.boxSizing = 'border-box';

const presets = [
  { label: 'Soft (4:30)', time: 270, color: 'linear-gradient(135deg, #b6e388 60%, #eaffd0 100%)', border: '#7fc97f' },
  { label: 'Medium (6:00)', time: 360, color: 'linear-gradient(135deg, #ffe388 60%, #fffbe6 100%)', border: '#ffd700' },
  { label: 'Hard (9:00)', time: 540, color: 'linear-gradient(135deg, #ffd6a5 60%, #fffbe6 100%)', border: '#ffb347' },
  { label: 'Jammy (7:00)', time: 420, color: 'linear-gradient(135deg, #ffb7b2 60%, #ffeaea 100%)', border: '#ff6f91' },
];

presets.forEach(preset => {
  const btn = document.createElement('button');
  btn.textContent = preset.label;
  btn.style.background = preset.color;
  btn.style.border = `2.5px solid ${preset.border}`;
  btn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
  btn.style.borderRadius = '16px';
  btn.style.fontSize = '1.08rem';
  btn.style.fontWeight = 'bold';
  btn.style.padding = '13px 22px';
  btn.style.transition = 'background 0.18s, box-shadow 0.18s, transform 0.12s';
  btn.style.cursor = 'pointer';
  btn.style.outline = 'none';
  btn.style.letterSpacing = '0.01em';
  btn.onmouseover = () => {
    btn.style.background = 'linear-gradient(135deg, #fff7b2 60%, #fffbe6 100%)';
    btn.style.boxShadow = '0 4px 18px rgba(255,200,0,0.18)';
    btn.style.transform = 'translateY(-2px) scale(1.04)';
  };
  btn.onmouseout = () => {
    btn.style.background = preset.color;
    btn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
    btn.style.transform = 'none';
  };
  btn.onclick = () => {
    timerDuration = preset.time;
    timer.setTime(preset.time);
    timerDisplay.textContent = formatTime(preset.time);
    progressBar.style.width = '0%';
    minInput.value = Math.floor(preset.time / 60);
    secInput.value = preset.time % 60;
  };
  presetButtons.appendChild(btn);
});

presetCard.appendChild(presetButtons);
const customTimeForm = document.createElement('form');
customTimeForm.id = 'custom-time-input';
customTimeForm.style.display = 'flex';
customTimeForm.style.justifyContent = 'center';
customTimeForm.style.alignItems = 'center';
customTimeForm.style.gap = '8px';
customTimeForm.style.marginBottom = '18px';
customTimeForm.style.background = 'rgba(255,255,255,0.7)';
customTimeForm.style.borderRadius = '12px';
customTimeForm.style.padding = '8px 12px';
customTimeForm.style.boxShadow = '0 1px 6px rgba(180,180,180,0.08)';

const minInput = document.createElement('input');
minInput.type = 'number';
minInput.min = '0';
minInput.max = '99';
minInput.value = '3';
minInput.placeholder = 'min';
minInput.style.width = '48px';
minInput.style.borderRadius = '8px';
minInput.style.border = '1.5px solid #b6d8ff';
minInput.style.background = '#f7faff';
minInput.style.fontSize = '1.1rem';
minInput.style.textAlign = 'center';
minInput.style.padding = '6px 4px';
minInput.style.marginRight = '2px';

const minLabel = document.createElement('span');
minLabel.textContent = 'min';
minLabel.style.marginRight = '8px';
minLabel.style.fontSize = '1.05rem';
minLabel.style.color = '#888';

const secInput = document.createElement('input');
secInput.type = 'number';
secInput.min = '0';
secInput.max = '59';
secInput.value = '0';
secInput.placeholder = 'sec';
secInput.style.width = '48px';
secInput.style.borderRadius = '8px';
secInput.style.border = '1.5px solid #b6d8ff';
secInput.style.background = '#f7faff';
secInput.style.fontSize = '1.1rem';
secInput.style.textAlign = 'center';
secInput.style.padding = '6px 4px';
secInput.style.marginRight = '2px';

const secLabel = document.createElement('span');
secLabel.textContent = 'sec';
secLabel.style.marginRight = '8px';
secLabel.style.fontSize = '1.05rem';
secLabel.style.color = '#888';

const setBtn = makeButton('Set', '#b6e388');
setBtn.type = 'submit';
setBtn.style.padding = '8px 18px';
setBtn.style.fontSize = '1rem';
setBtn.style.borderRadius = '8px';

customTimeForm.appendChild(minInput);
customTimeForm.appendChild(minLabel);
customTimeForm.appendChild(secInput);
customTimeForm.appendChild(secLabel);
customTimeForm.appendChild(setBtn);

customTimeForm.onsubmit = (e) => {
  e.preventDefault();
  let mins = parseInt(minInput.value, 10) || 0;
  let secs = parseInt(secInput.value, 10) || 0;
  let total = mins * 60 + secs;
  if (total > 0) {
    timerDuration = total;
    timer.setTime(total);
    timerDisplay.textContent = formatTime(total);
    progressBar.style.width = '0%';
  }
};

// --- Controls ---
const startBtn = makeButton('Start', '#b6e388');
const pauseBtn = makeButton('Pause', '#ffe388');
const resetBtn = makeButton('Reset', '#ffd6a5');

startBtn.onclick = () => timer.start();
pauseBtn.onclick = () => timer.pause();
resetBtn.onclick = () => timer.reset();

controls.appendChild(startBtn);
controls.appendChild(pauseBtn);
controls.appendChild(resetBtn);


// --- Beep Sound ---
const beep = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
beep.volume = 1.0;

function playBeepPattern() {
  // 4 quick beeps (150ms beep, 100ms gap), 500ms pause, repeat 2 more times
  const beepCount = 4;
  const beepDuration = 100;
  const smallGap = 15;
  const bigGap = 500;
  let pattern = [];
  for (let set = 0; set < 3; set++) {
    for (let i = 0; i < beepCount; i++) {
      pattern.push('beep');
      if (i < beepCount - 1) pattern.push('smallGap');
    }
    if (set < 2) pattern.push('bigGap');
  }

  let idx = 0;
  function next() {
    if (idx >= pattern.length) return;
    const action = pattern[idx++];
    if (action === 'beep') {
      beep.currentTime = 0;
      beep.play();
      setTimeout(next, beepDuration);
    } else if (action === 'smallGap') {
      setTimeout(next, smallGap);
    } else if (action === 'bigGap') {
      setTimeout(next, bigGap);
    }
  }
  next();
}

// Patch timer finish callback to play beep pattern
timer.onFinish = () => {
  timerDisplay.textContent = 'Done!';
  playBeepPattern();
};

// --- App Layout ---
const card = document.createElement('div');
card.id = 'timer-card';
card.style.maxWidth = '400px';
card.style.width = '100%';
card.style.boxSizing = 'border-box';
card.style.display = 'flex';
card.style.flexDirection = 'column';
card.style.alignItems = 'center';

card.appendChild(presetCard);
card.appendChild(customTimeForm);
card.appendChild(timerDisplay);
card.appendChild(progressBarWrap);
card.appendChild(controls);


// --- Test Sound Button ---
const testSoundBtn = document.createElement('button');
testSoundBtn.textContent = 'Test Sound';
testSoundBtn.style.width = '100%';
testSoundBtn.style.maxWidth = '400px';
testSoundBtn.style.margin = '18px 0 0 0';
testSoundBtn.style.padding = '16px 0';
testSoundBtn.style.background = 'linear-gradient(90deg, #ffe388 0%, #b6e388 100%)';
testSoundBtn.style.color = '#222';
testSoundBtn.style.fontSize = '1.18rem';
testSoundBtn.style.fontWeight = 'bold';
testSoundBtn.style.border = 'none';
testSoundBtn.style.borderRadius = '14px';
testSoundBtn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
testSoundBtn.style.cursor = 'pointer';
testSoundBtn.style.letterSpacing = '0.01em';
testSoundBtn.onmouseover = () => {
  testSoundBtn.style.background = 'linear-gradient(90deg, #fff7b2 0%, #ffe388 100%)';
  testSoundBtn.style.boxShadow = '0 4px 18px rgba(255,200,0,0.18)';
  testSoundBtn.style.transform = 'translateY(-2px) scale(1.03)';
};
testSoundBtn.onmouseout = () => {
  testSoundBtn.style.background = 'linear-gradient(90deg, #ffe388 0%, #b6e388 100%)';
  testSoundBtn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
  testSoundBtn.style.transform = 'none';
};
testSoundBtn.onclick = playBeepPattern;

app.innerHTML = '';
app.style.display = 'flex';
app.style.flexDirection = 'column';
app.style.alignItems = 'center';
app.appendChild(card);
app.appendChild(testSoundBtn);
