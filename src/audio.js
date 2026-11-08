// 純 Web Audio API 拔刀與戰鬥音效合成引擎 (Procedural Samurai Sound Engine)
// 無需任何外部音檔下載，零 404，極速響應，純物理頻率合成！

class SamuraiAudio {
  constructor() {
    this.ctx = null;
    let saved = null;
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        saved = window.localStorage.getItem("SAMURAI_AUDIO_ENABLED");
      }
    } catch (e) {}
    this.enabled = saved !== null ? saved === "true" : true;
    this.initAudioContext();
    this.setupMobileUnlock();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio not supported or disabled:", e);
    }
  }

  setupMobileUnlock() {
    if (typeof window === "undefined" || typeof window.addEventListener !== "function") return;
    const unlock = () => {
      this.ensureContext();
      if (this.ctx && this.ctx.state === 'running') {
        window.removeEventListener('touchstart', unlock);
        window.removeEventListener('touchend', unlock);
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('click', unlock);
      }
    };
    window.addEventListener('touchstart', unlock, { passive: true });
    window.addEventListener('touchend', unlock, { passive: true });
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('click', unlock, { passive: true });
  }

  ensureContext() {
    if (!this.ctx) {
      this.initAudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle(enable) {
    if (typeof enable === "boolean") {
      this.enabled = enable;
    } else {
      this.enabled = !this.enabled;
    }
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem("SAMURAI_AUDIO_ENABLED", this.enabled ? "true" : "false");
      }
    } catch (e) {}
    if (this.enabled) this.ensureContext();
    return this.enabled;
  }

  // 1. 普通拔刀與斬擊聲 (Katana Slash & Whoosh)
  playSlash() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    // 白噪音斬風聲 (Whoosh)
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // 帶通濾波器模擬刀鋒割破空氣
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.exponentialRampToValueAtTime(600, t + 0.1);
    filter.Q.value = 3.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    whiteNoise.start(t);

    // 金屬刀刃微顫聲 (Subtle metallic tone)
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880 + Math.random() * 200, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.08);

    oscGain.gain.setValueAtTime(0.15, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // 2. 會心一擊 / 奧義重斬聲 (Critical Strike / Ougi Sunder)
  playCrit() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    // 重金屬破甲聲
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(1400, t);
    osc1.frequency.exponentialRampToValueAtTime(120, t + 0.22);

    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(2100, t);
    osc2.frequency.exponentialRampToValueAtTime(180, t + 0.25);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.28);
    osc2.stop(t + 0.28);

    // 低音衝擊震動 (Bass boom)
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(160, t);
    sub.frequency.exponentialRampToValueAtTime(30, t + 0.3);

    subGain.gain.setValueAtTime(0.6, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.3);
  }

  // 3. 兵刃交擊格擋聲 (Sword Clash / Parry)
  playClash() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(3200, t);
    osc.frequency.exponentialRampToValueAtTime(2800, t + 0.15);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  // 4. 鍛刀鐵砧敲打聲 (Blacksmith Anvil Hammering)
  playHammer() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    // 清脆的鐵砧高音 (Anvil ping)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1850 + Math.random() * 150, t);

    gain.gain.setValueAtTime(0.45, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.35);

    // 鈍擊金屬基底 (Thud)
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = "triangle";
    thud.frequency.setValueAtTime(220, t);
    thud.frequency.exponentialRampToValueAtTime(60, t + 0.12);

    thudGain.gain.setValueAtTime(0.5, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thud.start(t);
    thud.stop(t + 0.12);
  }

  // 5. 磨刀石研磨聲 (Whetstone Sharpening)
  playSharpen() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 3500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    src.start(t);
  }

  // 6. 突破境界 / 升級和風銅鐘 (Level Up Chime)
  playLevelUp() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (和風清音)
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.3, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.6);
    });
  }

  // 7. 首領遭遇戰戰鼓 (Boss Taiko Boom)
  playBossBoom() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.5);

    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  // 8. 暗黑破壞神風格榮譽成就史詩號角與金鐘 (Diablo 3 Epic Achievement Fanfare)
  playAchievementFanfare() {
    if (!this.enabled || !this.ctx) return;
    this.ensureContext();
    const t = this.ctx.currentTime;

    // A. 沉穩重磅破魔太鼓低音震盪 (Deep Resonant Gong & Impact Boom)
    const gong = this.ctx.createOscillator();
    const gongGain = this.ctx.createGain();
    gong.type = "sine";
    gong.frequency.setValueAtTime(130, t);
    gong.frequency.exponentialRampToValueAtTime(36, t + 0.9);

    gongGain.gain.setValueAtTime(0.7, t);
    gongGain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    gong.connect(gongGain);
    gongGain.connect(this.ctx.destination);
    gong.start(t);
    gong.stop(t + 0.9);

    // 金屬銅鐘底蘊 (Bronze Bell Resonance)
    const bellBase = this.ctx.createOscillator();
    const bellBaseGain = this.ctx.createGain();
    bellBase.type = "triangle";
    bellBase.frequency.setValueAtTime(260, t);
    bellBase.frequency.exponentialRampToValueAtTime(130, t + 1.2);

    bellBaseGain.gain.setValueAtTime(0.4, t);
    bellBaseGain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

    bellBase.connect(bellBaseGain);
    bellBaseGain.connect(this.ctx.destination);
    bellBase.start(t);
    bellBase.stop(t + 1.2);

    // B. 暗黑風格凱旋銅管號角和弦 (Majestic Brass Fanfare Progression)
    // 4 個前進音程步進：F3/C4 -> G3/D4 -> C4/G4 -> 終曲 F4/C5/A5 輝煌長音
    const chords = [
      { delay: 0.00, notes: [174.61, 261.63], dur: 0.22, vol: 0.25 },
      { delay: 0.14, notes: [196.00, 293.66], dur: 0.22, vol: 0.28 },
      { delay: 0.28, notes: [261.63, 392.00], dur: 0.26, vol: 0.32 },
      { delay: 0.44, notes: [349.23, 440.00, 523.25, 698.46], dur: 1.8, vol: 0.45 }
    ];

    chords.forEach(c => {
      const noteTime = t + c.delay;
      c.notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900, noteTime);
        filter.frequency.exponentialRampToValueAtTime(3200, noteTime + 0.08);
        filter.frequency.exponentialRampToValueAtTime(1200, noteTime + c.dur);
        filter.Q.value = 2.5;

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(c.vol / c.notes.length, noteTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + c.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + c.dur);
      });
    });

    // C. 燦爛金色星塵金鈴音 (Celestial Golden Bell Chimes)
    const chimes = [1046.5, 1318.5, 1567.98, 2093.0, 2637.0, 3135.96]; // C6, E6, G6, C7, E7, G7
    chimes.forEach((freq, idx) => {
      const chimeTime = t + 0.52 + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, chimeTime);

      gain.gain.setValueAtTime(0.18, chimeTime);
      gain.gain.exponentialRampToValueAtTime(0.001, chimeTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(chimeTime);
      osc.stop(chimeTime + 0.8);
    });
  }
}

if (typeof window !== "undefined") {
  window.samuraiAudio = new SamuraiAudio();
}
if (typeof global !== "undefined") {
  global.SamuraiAudio = SamuraiAudio;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = SamuraiAudio;
}
