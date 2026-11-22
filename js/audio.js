/**
 * Anatoma 3D — Procedural Biological Audio (Web Audio Stethoscope Heartbeat) & Bilingual TTS Narrator
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
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    setEnabled(on) {
      this.enabled = !!on;
      if (this.enabled) {
        const ctx = this.ensureContext();
        // Play an immediate heartbeat inside the user-gesture click to unlock audio & give instant feedback
        if (ctx) {
          const trigger = () => this.playHeartbeat();
          if (ctx.state === 'suspended') {
            ctx.resume().then(trigger).catch(() => {});
          } else {
            trigger();
          }
        }
      }
    }

    isEnabled() {
      return this.enabled;
    }

    // Realistic stethoscope "Lub-Dub" audible on laptops, phones, and headphones
    playHeartbeat() {
      if (!this.enabled) return;
      const ctx = this.ensureContext();
      if (!ctx || ctx.state !== 'running') return;

      const now = ctx.currentTime;
      // "Lub" (S1 — mitral & tricuspid valves closing): fuller, slightly longer
      this._heartThump(ctx, now, 165, 62, 0.14, 0.62);
      // "Dub" (S2 — aortic & pulmonary valves closing): slightly higher & crisper
      this._heartThump(ctx, now + 0.19, 195, 78, 0.11, 0.45);
    }

    _heartThump(ctx, startTime, startFreq, endFreq, duration, gainPeak) {
      // Warm low-pass filter so harmonics sound organic like a real stethoscope
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(340, startTime);
      filter.Q.setValueAtTime(1.4, startTime);

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, startTime);
      masterGain.gain.exponentialRampToValueAtTime(gainPeak, startTime + 0.018);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      // Layer 1: Warm triangle body (provides rich harmonics audible on laptop/phone speakers)
      const oscBody = ctx.createOscillator();
      oscBody.type = 'triangle';
      oscBody.frequency.setValueAtTime(startFreq, startTime);
      oscBody.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

      // Layer 2: Deep chest sub-thump
      const oscSub = ctx.createOscillator();
      oscSub.type = 'sine';
      oscSub.frequency.setValueAtTime(startFreq * 0.65, startTime);
      oscSub.frequency.exponentialRampToValueAtTime(Math.max(38, endFreq * 0.7), startTime + duration);

      oscBody.connect(filter);
      oscSub.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      oscBody.start(startTime);
      oscSub.start(startTime);
      oscBody.stop(startTime + duration + 0.03);
      oscSub.stop(startTime + duration + 0.03);
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
