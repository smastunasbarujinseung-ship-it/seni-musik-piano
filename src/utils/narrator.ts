/**
 * Indonesian Text-to-Speech (TTS) Narrator for Piano Ceria SD TERAMIA
 * Uses Web Speech API with id-ID locale priority
 */

class Narrator {
  private synth: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.9;
  private rate: number = 1.0;
  private isSpeaking: boolean = false;
  private listeners: Set<(speaking: boolean, text: string) => void> = new Set();
  private currentUtteranceText: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Find Indonesian voice
    const idVoice = voices.find(v => v.lang.toLowerCase().startsWith('id') || v.lang.toLowerCase().includes('indonesia'));
    if (idVoice) {
      this.voice = idVoice;
    } else {
      // Fallback: search by name or first available
      const altVoice = voices.find(v => v.name.toLowerCase().includes('indonesia') || v.lang.includes('ID'));
      this.voice = altVoice || voices[0] || null;
    }
  }

  public subscribe(listener: (speaking: boolean, text: string) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean, text: string) {
    this.isSpeaking = speaking;
    this.currentUtteranceText = speaking ? text : '';
    this.listeners.forEach(cb => cb(speaking, text));
  }

  public setEnabled(val: boolean) {
    this.isEnabled = val;
    if (!val) {
      this.stop();
    }
  }

  public getEnabled() {
    return this.isEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setRate(rate: number) {
    this.rate = Math.max(0.7, Math.min(1.4, rate));
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.isEnabled || !this.synth) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending speech
    } catch {}

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = 'id-ID';
    utterance.rate = this.rate;
    utterance.volume = this.volume;
    utterance.pitch = 1.05; // Slightly cheerful pitch for children

    utterance.onstart = () => {
      this.notify(true, text);
    };

    utterance.onend = () => {
      this.notify(false, '');
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.notify(false, '');
      if (onEnd) onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('TTS speak error:', e);
      if (onEnd) onEnd();
    }
  }

  public repeat() {
    if (this.currentUtteranceText) {
      this.speak(this.currentUtteranceText);
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {}
    }
    this.notify(false, '');
  }

  public getCurrentText() {
    return this.currentUtteranceText;
  }
}

export const narrator = new Narrator();
