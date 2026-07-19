// ---------------------------------------------------------------------------
// SOUND ENGINE
// ---------------------------------------------------------------------------
// Everything here is synthesized with the Web Audio API — no .mp3/.ogg
// assets to ship or license. Timbres are modeled after real idle/mining-game
// audio conventions: short square/sine "coin" blips for taps and purchases,
// a low sawtooth buzz for errors, a bright ascending arpeggio for big
// rewards, and a quiet detuned-pad drone with a slow arpeggio on top for
// background music (think: low sci-fi hum + gentle mining-rig ambience).
//
// Usage:
//   import { soundEngine } from "./sound";
//   soundEngine.playSfx("light");       // maps 1:1 to haptic() styles
//   soundEngine.playNotify("success");  // maps 1:1 to hapticNotify() types
//   soundEngine.startMusic();  soundEngine.stopMusic();
//   soundEngine.setSfxEnabled(bool);  soundEngine.setMusicEnabled(bool);

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxEnabled = true;
    this.musicEnabled = true;
    this.musicPlaying = false;
    this._musicTimer = null;
    this._musicStep = 0;
  }

  // Lazily create the AudioContext on first real user gesture — browsers
  // block autoplay before that, so constructing it eagerly at module load
  // would just produce a suspended, silent context.
  _ensureCtx() {
    if (this.ctx) return this.ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.35;
    this.masterGain.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.05;
    this.musicGain.connect(this.masterGain);
    return this.ctx;
  }

  _resume() {
    const ctx = this._ensureCtx();
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  setSfxEnabled(v) { this.sfxEnabled = v; }
  setMusicEnabled(v) {
    this.musicEnabled = v;
    if (v) this.startMusic();
    else this.stopMusic();
  }

  // --- low-level tone helper ------------------------------------------------
  _tone(freq, { type = "sine", start = 0, duration = 0.12, gain = 0.5, glideTo = null, destination = null } = {}) {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    const t0 = ctx.currentTime + start;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + duration);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(destination || this.masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  // --- SFX: mirrors Telegram HapticFeedback.impactOccurred(style) ----------
  playSfx(style = "light") {
    if (!this.sfxEnabled) return;
    const ctx = this._resume();
    if (!ctx) return;
    if (style === "heavy") {
      this._tone(220, { type: "square", duration: 0.09, gain: 0.35, glideTo: 140 });
    } else if (style === "medium") {
      this._tone(520, { type: "square", duration: 0.07, gain: 0.28, glideTo: 380 });
    } else {
      // light — the default UI tap/click, used at almost every button press
      this._tone(880, { type: "sine", duration: 0.045, gain: 0.22, glideTo: 760 });
    }
  }

  // --- Notify: mirrors Telegram HapticFeedback.notificationOccurred(type) --
  playNotify(type = "success") {
    if (!this.sfxEnabled) return;
    const ctx = this._resume();
    if (!ctx) return;
    if (type === "error") {
      this._tone(180, { type: "sawtooth", duration: 0.16, gain: 0.3, glideTo: 110 });
      this._tone(140, { type: "sawtooth", duration: 0.16, gain: 0.22, start: 0.05, glideTo: 90 });
    } else if (type === "warning") {
      this._tone(440, { type: "triangle", duration: 0.1, gain: 0.25 });
      this._tone(440, { type: "triangle", duration: 0.1, gain: 0.25, start: 0.12 });
    } else {
      // success — bright little coin/cha-ching arpeggio
      this._tone(660, { type: "square", duration: 0.09, gain: 0.22 });
      this._tone(880, { type: "square", duration: 0.09, gain: 0.22, start: 0.06 });
      this._tone(1320, { type: "square", duration: 0.14, gain: 0.24, start: 0.12 });
    }
  }

  // Bigger fanfare for rare/high-value moments (level up, achievement
  // unlocked, legendary drop) — call explicitly where it matters, not on
  // every generic success toast.
  playFanfare() {
    if (!this.sfxEnabled) return;
    const ctx = this._resume();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) => {
      this._tone(f, { type: "triangle", duration: 0.18, gain: 0.26, start: i * 0.09 });
    });
  }

  // --- Background music: quiet detuned pad drone + slow mining-rig arp -----
  startMusic() {
    if (!this.musicEnabled || this.musicPlaying) return;
    const ctx = this._resume();
    if (!ctx) return;
    this.musicPlaying = true;

    // Sustained pad — two slightly detuned sawtooth oscillators through a
    // soft lowpass, giving a low sci-fi hum bed under the arpeggio.
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 500;
    padFilter.connect(this.musicGain);

    this._padOscs = [55, 55.6].map((f) => {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.6;
      osc.connect(g);
      g.connect(padFilter);
      osc.start();
      return osc;
    });

    // Slow arpeggio on top, scheduled step by step (A-minor-ish scale) —
    // gives the ambience some forward motion without being distracting.
    const scale = [220, 261.63, 293.66, 329.63, 392, 440];
    this._musicStep = 0;
    const stepMs = 700;
    const playStep = () => {
      if (!this.musicPlaying) return;
      const freq = scale[this._musicStep % scale.length];
      this._tone(freq, { type: "sine", duration: 0.9, gain: 0.12, destination: this.musicGain });
      this._musicStep += 1;
      this._musicTimer = setTimeout(playStep, stepMs);
    };
    playStep();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this._musicTimer) clearTimeout(this._musicTimer);
    this._musicTimer = null;
    if (this._padOscs) {
      const ctx = this.ctx;
      const now = ctx ? ctx.currentTime : 0;
      this._padOscs.forEach((osc) => {
        try { osc.stop(now + 0.3); } catch { /* already stopped */ }
      });
      this._padOscs = null;
    }
  }
}

export const soundEngine = new SoundEngine();
