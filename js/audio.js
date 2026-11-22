/**
 * Anatoma 3D — Procedural Biological Audio (Web Audio Heartbeat) & Bilingual TTS Narrator
 */
(function (global) {
  'use strict';

  class AnatomaAudio {
    constructor() {
      this.enabled = false;
      this.ctx = null;
      this.speaking = false;
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = global.AudioContext || global.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    setEnabled(on) {
      this.enabled = !!on;
      if (this.enabled) {
        this.ensureContext();
      }
    }

    isEnabled() {
      return this.enabled;
    }

    // Realistic soft low-frequency "Lub-Dub" cardiac thump
    playHeartbeat() {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      this._thump(ctx, now, 62, 0.14, 0.22);       // "Lub" (AV valves closing)
      this._thump(ctx, now + 0.19, 48, 0.11, 0.16); // "Dub" (semilunar valves closing)
    }

    _thump(ctx, startTime, freq, duration, gainPeak) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(24, startTime + duration);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(gainPeak, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);
    }

    // Built-in browser Text-to-Speech narration (EN & HE)
    speak(text, lang, onEnd) {
      if (!('speechSynthesis' in global)) return;
      this.stopSpeech();
      if (!text) return;

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang === 'he' ? 'he-IL' : 'en-US';
      utter.rate = 0.98;
      this.speaking = true;

      utter.onend = () => {
        this.speaking = false;
        if (onEnd) onEnd();
      };
      utter.onerror = () => {
        this.speaking = false;
        if (onEnd) onEnd();
      };

      global.speechSynthesis.speak(utter);
    }

    stopSpeech() {
      if ('speechSynthesis' in global) {
        global.speechSynthesis.cancel();
      }
      this.speaking = false;
    }
  }

  global.AnatomaAudio = AnatomaAudio;
})(window);
