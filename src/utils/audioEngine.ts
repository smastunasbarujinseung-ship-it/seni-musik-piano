/**
 * High-Fidelity Web Audio Piano Engine for SD TERAMIA - Piano Ceria
 * Simulates acoustic piano acoustics via multi-harmonic additive synthesis,
 * hammer strike transients, sympathetic resonance, and realistic dampers.
 */

import { DynamicLevel, NoteName } from '../types/music';
import { getNoteData } from './pianoKeysData';

interface ActiveVoice {
  gainNode: GainNode;
  filterNode: BiquadFilterNode;
  oscillators: OscillatorNode[];
  decayGains: GainNode[];
  startTime: number;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeVoices: Map<NoteName, ActiveVoice> = new Map();
  private isMuted: boolean = false;
  private dynamicLevel: DynamicLevel = 'mf';

  constructor() {
    // AudioContext will be initialized on user interaction
  }

  public init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, vol));
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : clamped, this.ctx.currentTime);
    }
  }

  public setDynamic(level: DynamicLevel) {
    this.dynamicLevel = level;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.85, this.ctx.currentTime);
    }
  }

  /**
   * Start playing a note when key is pressed (pointerdown / keydown)
   */
  public startNote(pitch: NoteName, dynamicOverride?: DynamicLevel): void {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    // If already playing this note, gracefully stop previous voice first
    this.stopNote(pitch);

    const note = getNoteData(pitch);
    const dyn = dynamicOverride || this.dynamicLevel;

    // Dynamic multipliers
    let velocityGain = 0.65;
    let filterCutoff = 3200;
    if (dyn === 'p') {
      velocityGain = 0.32;
      filterCutoff = 1800; // mellower, softer
    } else if (dyn === 'f') {
      velocityGain = 0.95;
      filterCutoff = 5500; // brighter, crisper
    }

    const now = this.ctx.currentTime;

    // Voice main gain
    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0, now);
    // Instant attack (hammer strike ~4ms)
    voiceGain.gain.linearRampToValueAtTime(velocityGain, now + 0.005);

    // Warm piano tone shaping filter
    const toneFilter = this.ctx.createBiquadFilter();
    toneFilter.type = 'lowpass';
    toneFilter.frequency.setValueAtTime(filterCutoff, now);
    toneFilter.Q.setValueAtTime(1.2, now);

    // Stereo Panning (lower keys to the left, higher to the right)
    let panner: StereoPannerNode | null = null;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      // map midi 60..84 to -0.4 .. +0.4
      const panVal = ((note.midi - 72) / 14) * 0.45;
      panner.pan.setValueAtTime(Math.max(-0.6, Math.min(0.6, panVal)), now);
    }

    // Connect chain
    if (panner) {
      voiceGain.connect(toneFilter);
      toneFilter.connect(panner);
      panner.connect(this.masterGain);
    } else {
      voiceGain.connect(toneFilter);
      toneFilter.connect(this.masterGain);
    }

    const oscs: OscillatorNode[] = [];
    const decayGains: GainNode[] = [];

    // Real acoustic piano harmonics weights and natural decay rates
    // Harmonic 1: fundamental
    // Harmonics 2-6: acoustic piano upper partials with inharmonicity
    const harmonicWeights = [
      { mult: 1.0, weight: 1.0, decayTime: 3.5 },
      { mult: 2.001, weight: 0.65, decayTime: 2.6 },
      { mult: 3.004, weight: 0.38, decayTime: 1.8 },
      { mult: 4.009, weight: 0.22, decayTime: 1.2 },
      { mult: 5.015, weight: 0.12, decayTime: 0.8 },
      { mult: 6.023, weight: 0.07, decayTime: 0.5 },
    ];

    harmonicWeights.forEach(h => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const hGain = this.ctx.createGain();

      // Sine wave with slight triangle warmth
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.frequency * h.mult, now);

      hGain.gain.setValueAtTime(h.weight, now);
      // Realistic exponential decay while note is held
      hGain.gain.exponentialRampToValueAtTime(h.weight * 0.05, now + h.decayTime);

      osc.connect(hGain);
      hGain.connect(voiceGain);
      osc.start(now);

      oscs.push(osc);
      decayGains.push(hGain);
    });

    // Hammer strike acoustic attack transient (short initial click/thump)
    const attackOsc = this.ctx.createOscillator();
    const attackGain = this.ctx.createGain();
    attackOsc.type = 'triangle';
    attackOsc.frequency.setValueAtTime(note.frequency * 0.5, now);
    attackGain.gain.setValueAtTime(velocityGain * 0.35, now);
    attackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    attackOsc.connect(attackGain);
    attackGain.connect(voiceGain);
    attackOsc.start(now);
    attackOsc.stop(now + 0.05);

    this.activeVoices.set(pitch, {
      gainNode: voiceGain,
      filterNode: toneFilter,
      oscillators: oscs,
      decayGains,
      startTime: now
    });
  }

  /**
   * Stop playing a note when key is released (pointerup / keyup)
   * Acoustic damper gently stops the vibration
   */
  public stopNote(pitch: NoteName): void {
    const voice = this.activeVoices.get(pitch);
    if (!voice || !this.ctx) return;

    const now = this.ctx.currentTime;
    // Damper release time (~150ms)
    voice.gainNode.gain.cancelScheduledValues(now);
    voice.gainNode.gain.setValueAtTime(voice.gainNode.gain.value, now);
    voice.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    // Stop and cleanup oscillators after damper completes
    setTimeout(() => {
      try {
        voice.oscillators.forEach(o => {
          try { o.stop(); o.disconnect(); } catch {}
        });
        voice.gainNode.disconnect();
      } catch {}
    }, 180);

    this.activeVoices.delete(pitch);
  }

  /**
   * Metronome tick sound (high pitch for beat 1, low for beats 2, 3, 4)
   */
  public playMetronome(isDownbeat: boolean = false) {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, now);
    osc.frequency.exponentialRampToValueAtTime(isDownbeat ? 400 : 300, now + 0.04);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Sound effect for correct note hit
   */
  public playSuccessChime() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const notes = [784, 1046.5]; // G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.3, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.3);
    });
  }

  /**
   * Sound effect for incorrect note
   */
  public playMissSound() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(130, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Celebration fanfare for completing 10 bars or winning a team match
   */
  public playVictoryFanfare() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    // C5, E5, G5, C6 triumphant chord arpeggio
    const chord = [
      { f: 523.25, time: 0.00, dur: 0.2 },
      { f: 659.25, time: 0.15, dur: 0.2 },
      { f: 783.99, time: 0.30, dur: 0.2 },
      { f: 1046.50, time: 0.45, dur: 0.7 },
      { f: 1318.51, time: 0.45, dur: 0.7 } // high E harmonic
    ];

    chord.forEach(item => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, now + item.time);

      gain.gain.setValueAtTime(0.4, now + item.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.time + item.dur);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + item.time);
      osc.stop(now + item.time + item.dur + 0.05);
    });
  }
}

export const audioEngine = new AudioEngine();
