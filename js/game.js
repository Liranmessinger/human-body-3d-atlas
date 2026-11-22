/**
 * Anatoma 3D — Interactive Game & Mastery Engine (Bilingual EN / HE)
 * Modes: 'explore' | 'locate' | 'doctor' | 'quiz'
 */
(function (global) {
  'use strict';

  function shuffledIndices(len) {
    const arr = Array.from({ length: len }, (_, i) => i);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  class AnatomaGame {
    constructor(callbacks) {
      this.cb = callbacks;
      this.mode = 'explore';
      this.score = 0;
      this.streak = 0;
      this.bestStreak = 0;
      this.discovered = new Set();

      this.loadProgress();

      this.locateQueue = [];
      this.locateIndex = 0;
      this.locateHintShown = false;
      this.locateAnswered = false;

      this.doctorQueue = [];
      this.doctorIndex = 0;
      this.doctorStage = 'find'; // 'find' | 'followup' | 'done'

      this.quizQueue = [];
      this.quizIndex = 0;
      this.quizAnswered = false;

      this.feedback = null;
    }

    loadProgress() {
      try {
        const raw = localStorage.getItem('anatoma_progress');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (typeof data.score === 'number') this.score = data.score;
        if (typeof data.bestStreak === 'number') this.bestStreak = data.bestStreak;
        if (Array.isArray(data.discovered)) {
          data.discovered.forEach((id) => this.discovered.add(id));
        }
      } catch (e) { /* ignore */ }
    }

    saveProgress() {
      try {
        localStorage.setItem(
          'anatoma_progress',
          JSON.stringify({
            score: this.score,
            bestStreak: this.bestStreak,
            discovered: Array.from(this.discovered)
          })
        );
      } catch (e) { /* ignore */ }
    }

    resetProgress() {
      this.score = 0;
      this.streak = 0;
      this.bestStreak = 0;
      this.discovered.clear();
      try { localStorage.removeItem('anatoma_progress'); } catch (e) {}
      if (this.cb.onUIUpdate) this.cb.onUIUpdate();
    }

    markDiscovered(organId) {
      if (!organId) return;
      const isNew = !this.discovered.has(organId);
      this.discovered.add(organId);
      if (isNew && this.mode === 'explore') {
        this.score += 15;
      }
      if (isNew) this.saveProgress();
    }

    getDiscoveryProgress() {
      const total = Object.keys(global.ANATOMA_DATA.ORGANS).length;
      return { count: this.discovered.size, total };
    }

    setMode(mode) {
      this.mode = mode;
      this.feedback = null;

      if (mode === 'locate') {
        this.locateQueue = shuffledIndices(global.ANATOMA_DATA.LOCATE_CHALLENGES.length);
        this.locateIndex = 0;
        this.locateHintShown = false;
        this.locateAnswered = false;
      } else if (mode === 'doctor') {
        this.doctorQueue = shuffledIndices(global.ANATOMA_DATA.DOCTOR_SCENARIOS.length);
        this.doctorIndex = 0;
        this.doctorStage = 'find';
        const cur = this.getCurrentDoctor();
        if (cur && this.cb.onPresetChange) {
          this.cb.onPresetChange(cur.patientPreset);
        }
      } else if (mode === 'quiz') {
        this.quizQueue = shuffledIndices(global.ANATOMA_DATA.QUIZ_QUESTIONS.length);
        this.quizIndex = 0;
        this.quizAnswered = false;
      }

      if (this.cb.onUIUpdate) this.cb.onUIUpdate();
    }

    getCurrentLocate() {
      const origIdx = this.locateQueue[this.locateIndex % this.locateQueue.length];
      return global.AnatomaI18n.getLocateChallenge(origIdx);
    }

    getCurrentDoctor() {
      const origIdx = this.doctorQueue[this.doctorIndex % this.doctorQueue.length];
      return global.AnatomaI18n.getDoctorScenario(origIdx);
    }

    getCurrentQuiz() {
      const origIdx = this.quizQueue[this.quizIndex % this.quizQueue.length];
      return global.AnatomaI18n.getQuizQuestion(origIdx);
    }

    requestHint() {
      const I18n = global.AnatomaI18n;
      if (this.mode === 'locate') {
        this.locateHintShown = true;
        const ch = this.getCurrentLocate();
        const org = I18n.getOrgan(ch.organId);
        if (org && this.cb.onHighlightSystem) {
          this.cb.onHighlightSystem(org.system);
        }
      } else if (this.mode === 'doctor' && this.doctorStage === 'find') {
        const sc = this.getCurrentDoctor();
        const org = I18n.getOrgan(sc.targetOrgan);
        const sys = I18n.getSystem(org.system);
        this.feedback = {
          type: 'info',
          title: I18n.t('fbDoctorHintTitle'),
          text: I18n.t('fbDoctorHintText', { system: sys.name, location: org.location })
        };
        if (this.cb.onHighlightSystem) this.cb.onHighlightSystem(org.system);
      }
      if (this.cb.onUIUpdate) this.cb.onUIUpdate();
    }

    handleOrganClick(organId) {
      const I18n = global.AnatomaI18n;
      this.markDiscovered(organId);
      const clickedOrg = I18n.getOrgan(organId);
      if (!clickedOrg) return;

      if (this.mode === 'locate') {
        if (this.locateAnswered) return;
        const ch = this.getCurrentLocate();
        if (organId === ch.organId) {
          this.locateAnswered = true;
          this.streak += 1;
          this.bestStreak = Math.max(this.bestStreak, this.streak);
          const pts = (this.locateHintShown ? 60 : 100) + Math.min(this.streak - 1, 5) * 20;
          this.score += pts;
          this.saveProgress();
          this.feedback = {
            type: 'success',
            title: I18n.t('fbLocateCorrect', { organ: clickedOrg.name, pts }),
            text: clickedOrg.summary
          };
          if (this.cb.onFocusOrgan) this.cb.onFocusOrgan(organId);
        } else {
          this.streak = 0;
          const sys = I18n.getSystem(clickedOrg.system);
          this.feedback = {
            type: 'error',
            title: I18n.t('fbLocateWrongTitle', { organ: clickedOrg.name }),
            text: I18n.t('fbLocateWrongText', { organ: clickedOrg.name, system: sys.name })
          };
        }
        if (this.cb.onUIUpdate) this.cb.onUIUpdate();
      } else if (this.mode === 'doctor' && this.doctorStage === 'find') {
        const sc = this.getCurrentDoctor();
        if (organId === sc.targetOrgan) {
          this.doctorStage = 'followup';
          this.score += 80;
          this.feedback = {
            type: 'success',
            title: I18n.t('fbDoctorFoundTitle', { organ: clickedOrg.name }),
            text: I18n.t('fbDoctorFoundText')
          };
          if (this.cb.onFocusOrgan) this.cb.onFocusOrgan(organId);
        } else {
          this.streak = 0;
          this.feedback = {
            type: 'error',
            title: I18n.t('fbDoctorWrongTitle', { organ: clickedOrg.name }),
            text: I18n.t('fbDoctorWrongText')
          };
        }
        if (this.cb.onUIUpdate) this.cb.onUIUpdate();
      }
    }

    answerDoctorFollowUp(optionIdx) {
      const I18n = global.AnatomaI18n;
      if (this.mode !== 'doctor' || this.doctorStage !== 'followup') return;
      const sc = this.getCurrentDoctor();
      const fu = sc.followUp;
      this.doctorStage = 'done';
      if (optionIdx === fu.correctIndex) {
        this.streak += 1;
        this.bestStreak = Math.max(this.bestStreak, this.streak);
        const pts = 120 + Math.min(this.streak - 1, 5) * 25;
        this.score += pts;
        this.saveProgress();
        this.feedback = {
          type: 'success',
          title: I18n.t('fbStabilized', { pts }),
          text: fu.explanation
        };
        if (this.cb.onPresetChange) this.cb.onPresetChange('normal');
      } else {
        this.streak = 0;
        this.feedback = {
          type: 'error',
          title: I18n.t('fbCorrectAnswer', { ans: fu.options[fu.correctIndex] }),
          text: fu.explanation
        };
      }
      if (this.cb.onUIUpdate) this.cb.onUIUpdate();
    }

    answerQuiz(optionIdx) {
      const I18n = global.AnatomaI18n;
      if (this.mode !== 'quiz' || this.quizAnswered) return;
      const item = this.getCurrentQuiz();
      this.quizAnswered = true;
      if (optionIdx === item.answer) {
        this.streak += 1;
        this.bestStreak = Math.max(this.bestStreak, this.streak);
        const pts = 100 + Math.min(this.streak - 1, 5) * 20;
        this.score += pts;
        this.saveProgress();
        this.feedback = {
          type: 'success',
          title: I18n.t('fbQuizCorrect', { pts }),
          text: item.explain
        };
      } else {
        this.streak = 0;
        this.feedback = {
          type: 'error',
          title: I18n.t('fbQuizWrong', { ans: item.options[item.answer] }),
          text: item.explain
        };
      }
      if (this.cb.onUIUpdate) this.cb.onUIUpdate();
    }

    nextChallenge() {
      this.feedback = null;
      if (this.mode === 'locate') {
        this.locateIndex += 1;
        this.locateHintShown = false;
        this.locateAnswered = false;
      } else if (this.mode === 'doctor') {
        this.doctorIndex += 1;
        this.doctorStage = 'find';
        const cur = this.getCurrentDoctor();
        if (cur && this.cb.onPresetChange) this.cb.onPresetChange(cur.patientPreset);
      } else if (this.mode === 'quiz') {
        this.quizIndex += 1;
        this.quizAnswered = false;
      }
      if (this.cb.onUIUpdate) this.cb.onUIUpdate();
    }
  }

  global.AnatomaGame = AnatomaGame;
})(window);
