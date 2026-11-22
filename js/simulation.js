/**
 * Anatoma 3D — Live Physiology Simulation & Real-Time ECG Waveform Engine
 */
(function (global) {
  'use strict';

  class PhysiologySimulation {
    constructor(bodyRig, ecgCanvas) {
      this.body = bodyRig;
      this.ecgCanvas = ecgCanvas;
      this.ecgCtx = ecgCanvas ? ecgCanvas.getContext('2d') : null;

      const presets = global.ANATOMA_DATA.SIM_PRESETS;
      this.presetId = 'normal';
      this.target = { ...presets.normal };
      this.current = { ...presets.normal };

      this.heartPhase = 0; // 0..1 per beat
      this.prevHeartPhase = 0;
      this.breathPhase = 0; // 0..2*PI per breath
      this.elapsed = 0;
      this.showFlows = true;
      this.onHeartbeat = null;
      this.pathologyMods = {};

      // ECG scrolling buffer
      this.ecgBuffer = new Array(160).fill(0);
      this.ecgSampleAccum = 0;
      this.ecgStyle = {
        grid: 'rgba(56, 189, 248, 0.08)',
        line: '#34d399',
        glow: '#10b981',
        dot: '#a7f3d0'
      };
    }

    setTheme(themeId) {
      if (themeId === 'light') {
        this.ecgStyle = {
          grid: 'rgba(15, 23, 42, 0.08)',
          line: '#059669',
          glow: 'rgba(5, 150, 105, 0.35)',
          dot: '#047857'
        };
      } else if (themeId === 'warm') {
        this.ecgStyle = {
          grid: 'rgba(120, 53, 15, 0.09)',
          line: '#d97706',
          glow: 'rgba(217, 119, 6, 0.35)',
          dot: '#b45309'
        };
      } else if (themeId === 'emerald') {
        this.ecgStyle = {
          grid: 'rgba(52, 211, 153, 0.1)',
          line: '#34d399',
          glow: '#10b981',
          dot: '#a7f3d0'
        };
      } else {
        this.ecgStyle = {
          grid: 'rgba(56, 189, 248, 0.08)',
          line: '#34d399',
          glow: '#10b981',
          dot: '#a7f3d0'
        };
      }
    }

    setPreset(presetId) {
      const preset = global.ANATOMA_DATA.SIM_PRESETS[presetId];
      if (!preset) return;
      this.presetId = presetId;
      this.target = { ...preset, ...this.pathologyMods };
    }

    setPathologyMods(mods) {
      this.pathologyMods = mods || {};
      const preset = global.ANATOMA_DATA.SIM_PRESETS[this.presetId];
      if (preset) {
        this.target = { ...preset, ...this.pathologyMods };
      }
    }

    setShowFlows(visible) {
      this.showFlows = visible;
      if (this.body && this.body.flowGroup) {
        this.body.flowGroup.visible = visible;
      }
    }

    // Realistic P-QRS-T ECG wave value for normalized phase [0..1)
    sampleECG(p) {
      // P wave (atrial depolarization)
      const pWave = 0.14 * Math.exp(-Math.pow((p - 0.16) / 0.032, 2));
      // Q dip
      const qWave = -0.14 * Math.exp(-Math.pow((p - 0.27) / 0.012, 2));
      // R spike (ventricular contraction)
      const rWave = 0.95 * Math.exp(-Math.pow((p - 0.30) / 0.013, 2));
      // S dip
      const sWave = -0.25 * Math.exp(-Math.pow((p - 0.335) / 0.015, 2));
      // T wave (ventricular repolarization)
      const tWave = 0.28 * Math.exp(-Math.pow((p - 0.54) / 0.055, 2));
      return pWave + qWave + rWave + sWave + tWave;
    }

    update(dt) {
      const clampedDt = Math.min(dt, 0.05);
      this.elapsed += clampedDt;

      // Smoothly interpolate physiological vitals
      const lerpFactor = Math.min(1, clampedDt * 2.2);
      ['bpm', 'respRate', 'spo2', 'bpSys', 'bpDia', 'brainHz', 'digestion'].forEach((k) => {
        this.current[k] += (this.target[k] - this.current[k]) * lerpFactor;
      });

      // Advance heart & breathing phases (supports bpm === 0 flatline for Cardiac Arrest!)
      const isArrest = this.target.bpm === 0 && this.current.bpm < 8;
      const beatsPerSec = isArrest ? 0 : this.current.bpm / 60;
      this.prevHeartPhase = this.heartPhase;
      this.heartPhase = (this.heartPhase + clampedDt * beatsPerSec) % 1;

      if (!isArrest && this.onHeartbeat && this.prevHeartPhase < 0.28 && this.heartPhase >= 0.28) {
        this.onHeartbeat();
      }

      const breathsPerSec = this.current.respRate < 2 ? 0 : this.current.respRate / 60;
      this.breathPhase = (this.breathPhase + clampedDt * breathsPerSec * Math.PI * 2) % (Math.PI * 2);

      // 1. Animate 3D HEART (systolic lub + smaller dub; still on cardiac arrest)
      const heartOrg = this.body.organs.heart;
      if (heartOrg) {
        if (isArrest) {
          heartOrg.group.scale.set(1, 1, 1);
        } else {
          const lub = Math.exp(-Math.pow((this.heartPhase - 0.30) / 0.055, 2));
          const dub = 0.45 * Math.exp(-Math.pow((this.heartPhase - 0.48) / 0.06, 2));
          const pulse = 1.0 + (lub + dub) * 0.11;
          heartOrg.group.scale.set(pulse, pulse * 0.985 + 0.015, pulse);
        }
      }

      // 2. Animate 3D LUNGS & DIAPHRAGM (synchronized inhalation/exhalation)
      const breathWave = 0.5 - 0.5 * Math.cos(this.breathPhase); // 0 = exhaled, 1 = inhaled
      const breathDepth = 0.045 + (this.current.respRate / 40) * 0.055;
      const lungsOrg = this.body.organs.lungs;
      if (lungsOrg) {
        const sX = 1.0 + breathWave * breathDepth * 1.25;
        const sY = 1.0 + breathWave * breathDepth * 0.85;
        const sZ = 1.0 + breathWave * breathDepth * 1.15;
        lungsOrg.group.scale.set(sX, sY, sZ);
      }
      const diaphOrg = this.body.organs.diaphragm;
      if (diaphOrg) {
        // Diaphragm flattens downward on inhale
        const domeScaleY = 1.0 - breathWave * 0.34;
        diaphOrg.group.scale.set(1.0 + breathWave * 0.04, domeScaleY, 1.0 + breathWave * 0.04);
      }

      // 3. Animate DIGESTIVE subtle peristalsis
      const stomOrg = this.body.organs.stomach;
      if (stomOrg) {
        const churn = Math.sin(this.elapsed * 2.4 * this.current.digestion) * 0.025 * this.current.digestion;
        stomOrg.group.scale.set(1 + churn, 1 - churn * 0.6, 1 + churn);
      }
      const siOrg = this.body.organs.small_intestine;
      if (siOrg) {
        const wave = Math.sin(this.elapsed * 3.1 * this.current.digestion) * 0.018 * this.current.digestion;
        siOrg.group.scale.set(1 + wave, 1, 1 - wave);
      }

      // 4. Animate BLOOD & NERVE FLOW PARTICLES
      if (this.showFlows) {
        const bloodSpeedMult = this.current.bpm / 72;
        const circVisible = this.body.systemGroups.circulatory.visible;
        for (let i = 0; i < this.body.bloodParticles.length; i++) {
          const p = this.body.bloodParticles[i];
          p.mesh.visible = circVisible;
          if (!circVisible) continue;
          p.t = (p.t + clampedDt * p.speed * bloodSpeedMult) % 1;
          p.curve.getPointAt(p.t, p.mesh.position);
        }

        const nerveSpeedMult = this.current.brainHz;
        const nervVisible = this.body.systemGroups.nervous.visible;
        for (let i = 0; i < this.body.nerveParticles.length; i++) {
          const p = this.body.nerveParticles[i];
          p.mesh.visible = nervVisible;
          if (!nervVisible) continue;
          p.t = (p.t + clampedDt * p.speed * nerveSpeedMult) % 1;
          p.curve.getPointAt(p.t, p.mesh.position);
        }
      }

      // 5. Update & Draw ECG Canvas
      this.ecgSampleAccum += clampedDt;
      const sampleStep = 1 / 55;
      while (this.ecgSampleAccum >= sampleStep) {
        this.ecgSampleAccum -= sampleStep;
        this.ecgBuffer.shift();
        this.ecgBuffer.push(isArrest ? 0 : this.sampleECG(this.heartPhase));
      }
      this.drawECG();
    }

    drawECG() {
      const ctx = this.ecgCtx;
      if (!ctx) return;
      const w = this.ecgCanvas.width;
      const h = this.ecgCanvas.height;

      ctx.clearRect(0, 0, w, h);

      // Subtle medical grid
      ctx.strokeStyle = this.ecgStyle.grid;
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 14) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Waveform line
      const midY = h * 0.66;
      const amp = h * 0.52;
      ctx.beginPath();
      for (let i = 0; i < this.ecgBuffer.length; i++) {
        const x = (i / (this.ecgBuffer.length - 1)) * w;
        const y = midY - this.ecgBuffer[i] * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = this.ecgStyle.line;
      ctx.lineWidth = 2;
      ctx.shadowColor = this.ecgStyle.glow;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Leading glowing dot
      const lastVal = this.ecgBuffer[this.ecgBuffer.length - 1];
      ctx.beginPath();
      ctx.arc(w - 2, midY - lastVal * amp, 3, 0, Math.PI * 2);
      ctx.fillStyle = this.ecgStyle.dot;
      ctx.fill();
    }

    getVitals() {
      const I18n = global.AnatomaI18n;
      const brainKey =
        this.current.brainHz > 1.4
          ? 'brainPeak'
          : this.current.brainHz > 1.0
            ? 'brainActive'
            : this.current.brainHz > 0.55
              ? 'brainBalanced'
              : 'brainCalm';
      return {
        bpm: Math.round(this.current.bpm),
        respRate: Math.round(this.current.respRate),
        spo2: Math.round(this.current.spo2),
        bp: `${Math.round(this.current.bpSys)}/${Math.round(this.current.bpDia)}`,
        brainActivity: I18n ? I18n.t(brainKey) : brainKey
      };
    }
  }

  global.PhysiologySimulation = PhysiologySimulation;
})(window);
