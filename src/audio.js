/**
 * 《武士之刃：無雙斬》無障礙沉浸和風音效引擎 (src/audio.js)
 * 採用純 Web Audio API 實作，完全無外部音檔依賴，即點即響、支援離線與完全靜音切換
 */
(function() {
  'use strict';

  class SamuraiAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
      this.bgmPlaying = false;
      this.bgmTimer = null;

      // 讀取靜音偏好
      try {
        const savedMute = localStorage.getItem('samurai_audio_muted');
        if (savedMute !== null) {
          this.isMuted = JSON.parse(savedMute);
        }
      } catch (e) {
        this.isMuted = false;
      }
    }

    initContext() {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      try {
        localStorage.setItem('samurai_audio_muted', JSON.stringify(this.isMuted));
      } catch (e) {}

      if (this.isMuted && this.bgmPlaying) {
        this.stopBGM();
      }
      return this.isMuted;
    }

    /**
     * 暗黑破壞神經典「暗金光柱」金屬回響聲 (Diablo Legendary Ding!)
     */
    playDiabloDing() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 高頻主鐘聲
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(1046.5, now); // C6
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.1); // E6
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      // 低頻回響
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(523.25, now); // C5
      gain2.gain.setValueAtTime(0.2, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 1.2);
      osc2.start(now);
      osc2.stop(now + 0.9);
    }

    /**
     * 依裝備品質播放掉落音效
     */
    playDropSound(quality) {
      if (this.isMuted) return;
      if (quality === 'legendary' || quality === 'ancient') {
        this.playDiabloDing();
        return;
      }

      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let freq = 440;
      let dur = 0.2;
      if (quality === 'epic') {
        freq = 784; // G5
        dur = 0.5;
      } else if (quality === 'rare') {
        freq = 659; // E5
        dur = 0.35;
      } else if (quality === 'magic') {
        freq = 523; // C5
        dur = 0.25;
      } else {
        freq = 330; // E4
        dur = 0.15;
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.05);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + dur);
    }

    /**
     * 拔刀斬擊音效
     */
    playSlashSound(isCrit = false) {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // 噪音過濾模擬刀風破空
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isCrit ? 'sawtooth' : 'triangle';
      const startFreq = isCrit ? 1200 : 800;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.12);

      gain.gain.setValueAtTime(isCrit ? 0.3 : 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    }

    /**
     * 裝備更換入鞘聲
     */
    playEquipSound() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    }

    /**
     * 金幣清脆響聲
     */
    playCoinSound() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.5, now + 0.07); // E6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    }

    /**
     * 暗黑 3 經典成就解鎖號角慶祝樂 (Achievement Fanfare)
     */
    playAchievementFanfare() {
      if (this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      const notes = [
        { f: 523.25, t: 0, d: 0.12 },    // C5
        { f: 659.25, t: 0.12, d: 0.12 }, // E5
        { f: 783.99, t: 0.24, d: 0.15 }, // G5
        { f: 1046.5, t: 0.39, d: 0.45 }  // C6 (長音)
      ];

      const now = this.ctx.currentTime;
      notes.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0.25, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      });
    }

    /**
     * 和風沉浸背景音樂 (Synthetic Japanese Ambient Pentatonic Loop)
     */
    startBGM() {
      if (this.bgmPlaying || this.isMuted) return;
      this.initContext();
      if (!this.ctx) return;

      this.bgmPlaying = true;
      // 日本都節音階 (Insen scale): D, Eb, G, A, C
      const scale = [293.66, 311.13, 392.00, 440.00, 523.25, 587.33];

      const playNextMelody = () => {
        if (!this.bgmPlaying || this.isMuted) return;
        const now = this.ctx.currentTime;
        const freq = scale[Math.floor(Math.random() * scale.length)];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.9);

        // 每隔 2~3.5 秒隨機彈奏下一個音符
        const nextTime = 2000 + Math.random() * 1500;
        this.bgmTimer = setTimeout(playNextMelody, nextTime);
      };

      playNextMelody();
    }

    stopBGM() {
      this.bgmPlaying = false;
      if (this.bgmTimer) {
        clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
    }
  }

  window.SamuraiAudioEngine = SamuraiAudioEngine;

})();
