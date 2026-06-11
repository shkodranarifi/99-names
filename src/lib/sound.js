// Tiny WebAudio synth — no audio assets needed.
let ctx;

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, at, dur, type = "sine", peak = 0.12) {
  const c = audio();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

export function playCorrect() {
  try {
    const now = audio().currentTime;
    tone(523.25, now, 0.15);
    tone(659.25, now + 0.07, 0.15);
    tone(783.99, now + 0.14, 0.22);
  } catch { /* audio unavailable — stay silent */ }
}

export function playWrong() {
  try {
    const now = audio().currentTime;
    tone(196, now, 0.2, "square", 0.06);
    tone(147, now + 0.15, 0.3, "square", 0.06);
  } catch { /* audio unavailable */ }
}

export function playFanfare() {
  try {
    const now = audio().currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, now + i * 0.12, 0.3));
    tone(1318.51, now + 0.5, 0.55);
  } catch { /* audio unavailable */ }
}

// Vibration: Android only; iOS silently ignores it.
export function buzz(ms) {
  try {
    navigator.vibrate?.(ms);
  } catch { /* not supported */ }
}
