// Sound effects using Web Audio API
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playTone(frequency, duration, type = 'sine') {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

function playSweep(startFreq, endFreq, duration, type = 'sine') {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(startFreq, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function playCoinSound() {
  // Cash register "ching" sound - metallic ping
  setTimeout(() => {
    const ctx = getAudioContext();

    // Main ding tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = 1046; // C6
    osc1.type = 'sine';
    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.3);

    // Harmonic overtone for richness
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = 1568; // G6
    osc2.type = 'sine';
    gain2.gain.setValueAtTime(0.2, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.25);
  }, 0);
}

export function playSurpriseBlockSound() {
  // Punchy "bam" thud with a rising shimmer
  setTimeout(() => {
    const ctx = getAudioContext();

    // Low thud punch
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(120, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);
    gain1.gain.setValueAtTime(0.5, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.1);

    // Rising sparkle shimmer
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(400, ctx.currentTime + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);
    gain2.gain.setValueAtTime(0.0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc2.start(ctx.currentTime + 0.05);
    osc2.stop(ctx.currentTime + 0.25);
  }, 0);
}

export function playPipeSound() {
  // Descending pitch
  setTimeout(() => playSweep(600, 200, 0.3, 'sine'), 0);
}

export function playWinSound() {
  setTimeout(() => {
    const ctx = getAudioContext();

    // Quick ascending run
    const run = [523, 659, 784, 1047]; // C5, E5, G5, C6
    run.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    });

    // Big triumphant chord after the run
    const chord = [523, 659, 784, 1047]; // C major chord
    const chordStart = ctx.currentTime + 0.32;
    chord.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, chordStart);
      gain.gain.setValueAtTime(0.18, chordStart + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, chordStart + 0.9);
      osc.start(chordStart);
      osc.stop(chordStart + 0.9);
    });

    // Shimmer on top
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(2093, chordStart); // C7
    shimmer.frequency.exponentialRampToValueAtTime(1760, chordStart + 0.9); // A6
    shimmerGain.gain.setValueAtTime(0.12, chordStart);
    shimmerGain.gain.exponentialRampToValueAtTime(0.01, chordStart + 0.9);
    shimmer.start(chordStart);
    shimmer.stop(chordStart + 0.9);
  }, 0);
}

export function playDeathSound() {
  // Descending "dun dun duuun" dramatic fall
  setTimeout(() => {
    const ctx = getAudioContext();
    const notes = [494, 466, 440, 415, 392, 370, 349, 294]; // descending chromatic
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }, 0);
}

export function playMushroomSound() {
  // Warm rising "power up" sound
  setTimeout(() => {
    const ctx = getAudioContext();
    const notes = [330, 392, 494, 659]; // E4, G4, B4, E5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }, 0);
}

export function playStarSound() {
  // Magical sparkling arpeggio
  setTimeout(() => {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047, 784, 1047, 1319]; // C5 up to E6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.start(t);
      osc.stop(t + 0.15);
    });
  }, 0);
}

export function playEnemyDefeatSound() {
  // Reuse the old surprise block sound - two quick tones
  setTimeout(() => {
    playTone(523, 0.1, 'square'); // C5
    setTimeout(() => playTone(659, 0.1, 'square'), 100); // E5
  }, 0);
}
