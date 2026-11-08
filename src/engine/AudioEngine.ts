/**
 * 天明武士・五輪百鬼譚 — Web Audio API 和風配樂 (BGM) 與音效合成引擎
 * 支援四首完整傳統和風曲目（三味線／古箏、尺八吹管、太鼓打擊、低音伴奏），零外部音檔依賴
 */

export type BgmTrackId = 'kyoto' | 'bushido' | 'battle' | 'shrine';

export interface BgmTrackInfo {
  id: BgmTrackId;
  name: string;
  subtitle: string;
  bpm: number;
}

export const BGM_TRACKS: BgmTrackInfo[] = [
  { id: 'kyoto', name: '🌸 洛中花見・都之春', subtitle: '京都城下町・三味線與尺八輕快小調', bpm: 112 },
  { id: 'bushido', name: '⚔️ 武士道列傳・疾風街道', subtitle: '東海道／赤富士・熱血原野行進曲', bpm: 132 },
  { id: 'shrine', name: '⛩️ 鞍馬靈峰・神域幽玄', subtitle: '鞍馬山／日光神域・古箏與尺八幽玄之音', bpm: 88 },
  { id: 'battle', name: '🔥 五輪拔刀・百鬼夜行', subtitle: '常世冥土／首領決戰・津輕三味線與大太鼓', bpm: 150 }
];

interface SequenceStep {
  lead?: number;       // 尺八 / 主旋律頻率 (Hz)
  leadDur?: number;    // 持續拍數
  pluck?: number[];    // 三味線 / 古箏撥弦音高 (Hz)
  bass?: number;       // 低音三味線 / 銅鑼根音 (Hz)
  taiko?: 'don' | 'ka' | 'both' | 'bell'; // 太鼓 (咚/咔) 或 神樂鈴
}

// 音高頻率對照 (Hz) — 日本陽音階 (Yo: D E G A B) 與 都節陰音階 (In-sen: D Eb G A Bb)
const N = {
  D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, Bb3: 233.08, B3: 246.94, C4: 261.63,
  D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88, C5: 523.25,
  D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, Bb5: 932.33, B5: 987.77
};

const TRACK_SEQUENCES: Record<BgmTrackId, SequenceStep[]> = {
  // 1. 洛中花見・都之春 (溫暖明亮的城下町市井旋律 - 32 steps)
  kyoto: [
    { lead: N.D5, leadDur: 2, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'don' },
    { pluck: [N.E4] },
    { lead: N.E5, leadDur: 2, pluck: [N.G4], taiko: 'ka' },
    { pluck: [N.A4] },
    { lead: N.D5, leadDur: 2, pluck: [N.B4, N.D5], bass: N.G3, taiko: 'don' },
    { pluck: [N.A4] },
    { lead: N.B4, leadDur: 2, pluck: [N.G4], taiko: 'ka' },
    { lead: N.A4, leadDur: 1, pluck: [N.E4] },

    { lead: N.G4, leadDur: 2, pluck: [N.G4, N.D5], bass: N.E3, taiko: 'don' },
    { pluck: [N.A4] },
    { lead: N.A4, leadDur: 2, pluck: [N.B4], taiko: 'ka' },
    { pluck: [N.G4] },
    { lead: N.B4, leadDur: 3, pluck: [N.E4, N.B4], bass: N.A3, taiko: 'don' },
    { pluck: [N.G4] },
    { pluck: [N.A4], taiko: 'ka' },
    { pluck: [N.B4], taiko: 'ka' },

    { lead: N.D5, leadDur: 2, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'don' },
    { pluck: [N.G4] },
    { lead: N.E5, leadDur: 2, pluck: [N.A4], taiko: 'ka' },
    { lead: N.G5, leadDur: 1, pluck: [N.B4] },
    { lead: N.E5, leadDur: 2, pluck: [N.G4, N.D5], bass: N.G3, taiko: 'don' },
    { pluck: [N.B4] },
    { lead: N.D5, leadDur: 2, pluck: [N.A4], taiko: 'ka' },
    { pluck: [N.G4] },

    { lead: N.B4, leadDur: 2, pluck: [N.E4, N.B4], bass: N.A3, taiko: 'don' },
    { lead: N.A4, leadDur: 1, pluck: [N.G4] },
    { lead: N.G4, leadDur: 2, pluck: [N.E4], taiko: 'ka' },
    { lead: N.E4, leadDur: 1, pluck: [N.D4] },
    { lead: N.D4, leadDur: 4, pluck: [N.D4, N.A4, N.D5], bass: N.D3, taiko: 'both' },
    { pluck: [N.A4] },
    { pluck: [N.G4], taiko: 'ka' },
    { pluck: [N.E4], taiko: 'bell' }
  ],

  // 2. 武士道列傳・疾風街道 (熱血武士原野冒險進行曲 - 32 steps)
  bushido: [
    { lead: N.A4, leadDur: 2, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'don' },
    { pluck: [N.D4], taiko: 'ka' },
    { lead: N.C5, leadDur: 2, pluck: [N.F4, N.C5], bass: N.D3, taiko: 'don' },
    { pluck: [N.G4] },
    { lead: N.D5, leadDur: 3, pluck: [N.G4, N.D5], bass: N.G3, taiko: 'both' },
    { pluck: [N.A4] },
    { pluck: [N.C5], taiko: 'ka' },
    { lead: N.C5, leadDur: 1, pluck: [N.D5], taiko: 'ka' },

    { lead: N.D5, leadDur: 2, pluck: [N.D4, N.A4], bass: N.F3, taiko: 'don' },
    { lead: N.F5, leadDur: 2, pluck: [N.F4], taiko: 'ka' },
    { lead: N.E5, leadDur: 2, pluck: [N.A4, N.E5], bass: N.A3, taiko: 'don' },
    { pluck: [N.C5] },
    { lead: N.D5, leadDur: 3, pluck: [N.D4, N.A4, N.D5], bass: N.D3, taiko: 'both' },
    { pluck: [N.A4] },
    { pluck: [N.G4], taiko: 'ka' },
    { pluck: [N.F4], taiko: 'don' },

    { lead: N.G5, leadDur: 2, pluck: [N.G4, N.D5], bass: N.G3, taiko: 'don' },
    { pluck: [N.B4] },
    { lead: N.F5, leadDur: 2, pluck: [N.F4, N.C5], bass: N.F3, taiko: 'ka' },
    { pluck: [N.A4] },
    { lead: N.D5, leadDur: 2, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'don' },
    { lead: N.C5, leadDur: 2, pluck: [N.G4], taiko: 'ka' },
    { lead: N.A4, leadDur: 2, pluck: [N.F4, N.A4], bass: N.C4, taiko: 'don' },
    { pluck: [N.G4], taiko: 'ka' },

    { lead: N.C5, leadDur: 2, pluck: [N.F4, N.C5], bass: N.Bb3, taiko: 'don' },
    { lead: N.D5, leadDur: 2, pluck: [N.G4, N.D5], taiko: 'ka' },
    { lead: N.A4, leadDur: 2, pluck: [N.A4, N.E5], bass: N.A3, taiko: 'don' },
    { lead: N.C5, leadDur: 1, pluck: [N.C5], taiko: 'ka' },
    { lead: N.D5, leadDur: 4, pluck: [N.D4, N.A4, N.D5], bass: N.D3, taiko: 'both' },
    { pluck: [N.A4] },
    { pluck: [N.D5], taiko: 'don' },
    { pluck: [N.A4], taiko: 'ka' }
  ],

  // 3. 鞍馬靈峰・神域幽玄 (空靈神聖的都節音階與古箏琶音 - 32 steps)
  shrine: [
    { lead: N.A4, leadDur: 4, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'bell' },
    { pluck: [N.Eb4] },
    { pluck: [N.G4] },
    { pluck: [N.A4] },
    { lead: N.Bb4, leadDur: 2, pluck: [N.Bb4], bass: N.G3 },
    { pluck: [N.A4] },
    { lead: N.A4, leadDur: 2, pluck: [N.G4], taiko: 'ka' },
    { pluck: [N.Eb4] },

    { lead: N.G4, leadDur: 3, pluck: [N.D4, N.G4], bass: N.Eb3, taiko: 'don' },
    { pluck: [N.A4] },
    { pluck: [N.Bb4] },
    { lead: N.Eb4, leadDur: 2, pluck: [N.Eb4] },
    { lead: N.D4, leadDur: 4, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'bell' },
    { pluck: [N.G4] },
    { pluck: [N.Eb4] },
    { pluck: [N.D4] },

    { lead: N.D5, leadDur: 3, pluck: [N.G4, N.D5], bass: N.G3, taiko: 'bell' },
    { pluck: [N.A4] },
    { pluck: [N.Bb4] },
    { lead: N.Eb5, leadDur: 2, pluck: [N.Eb5] },
    { lead: N.D5, leadDur: 2, pluck: [N.A4, N.D5], bass: N.A3, taiko: 'don' },
    { pluck: [N.Bb4] },
    { lead: N.A4, leadDur: 2, pluck: [N.G4], taiko: 'ka' },
    { pluck: [N.Eb4] },

    { lead: N.G4, leadDur: 2, pluck: [N.Eb4, N.G4], bass: N.Eb3 },
    { lead: N.A4, leadDur: 2, pluck: [N.A4] },
    { lead: N.Eb4, leadDur: 2, pluck: [N.Eb4], bass: N.A3, taiko: 'ka' },
    { pluck: [N.D4] },
    { lead: N.D4, leadDur: 4, pluck: [N.D4, N.A4, N.D5], bass: N.D3, taiko: 'bell' },
    { pluck: [N.A4] },
    { pluck: [N.Eb4] },
    { pluck: [N.D4] }
  ],

  // 4. 五輪拔刀・百鬼夜行 (疾速津輕三味線與大太鼓戰歌 - 32 steps)
  battle: [
    { lead: N.D5, leadDur: 1, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'both' },
    { pluck: [N.Eb4], taiko: 'ka' },
    { lead: N.Eb5, leadDur: 1, pluck: [N.G4], bass: N.D3, taiko: 'don' },
    { pluck: [N.A4], taiko: 'ka' },
    { lead: N.G5, leadDur: 2, pluck: [N.Bb4, N.D5], bass: N.G3, taiko: 'both' },
    { pluck: [N.A4], taiko: 'ka' },
    { lead: N.D5, leadDur: 2, pluck: [N.G4], bass: N.Eb3, taiko: 'don' },
    { pluck: [N.Eb4], taiko: 'ka' },

    { lead: N.Eb5, leadDur: 2, pluck: [N.Eb4, N.Bb4], bass: N.Eb3, taiko: 'both' },
    { pluck: [N.G4], taiko: 'ka' },
    { lead: N.D5, leadDur: 2, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'don' },
    { pluck: [N.G4], taiko: 'ka' },
    { lead: N.A4, leadDur: 2, pluck: [N.A3, N.E4], bass: N.A3, taiko: 'both' },
    { pluck: [N.Bb4], taiko: 'ka' },
    { lead: N.Bb4, leadDur: 1, pluck: [N.A4], taiko: 'don' },
    { lead: N.A4, leadDur: 1, pluck: [N.G4], taiko: 'ka' },

    { lead: N.D5, leadDur: 2, pluck: [N.D4, N.A4], bass: N.D3, taiko: 'both' },
    { pluck: [N.D5], taiko: 'ka' },
    { lead: N.G5, leadDur: 2, pluck: [N.G4, N.D5], bass: N.G3, taiko: 'don' },
    { pluck: [N.Eb5], taiko: 'ka' },
    { lead: N.A5, leadDur: 2, pluck: [N.A4, N.E5], bass: N.A3, taiko: 'both' },
    { pluck: [N.G5], taiko: 'ka' },
    { lead: N.G5, leadDur: 2, pluck: [N.Eb5], bass: N.Bb3, taiko: 'don' },
    { lead: N.Eb5, leadDur: 1, pluck: [N.D5], taiko: 'ka' },

    { lead: N.D5, leadDur: 2, pluck: [N.Bb4, N.D5], bass: N.G3, taiko: 'both' },
    { lead: N.Bb4, leadDur: 1, pluck: [N.A4], taiko: 'ka' },
    { lead: N.A4, leadDur: 2, pluck: [N.G4, N.Bb4], bass: N.A3, taiko: 'don' },
    { lead: N.G4, leadDur: 1, pluck: [N.Eb4], taiko: 'ka' },
    { lead: N.D4, leadDur: 4, pluck: [N.D4, N.A4, N.D5], bass: N.D3, taiko: 'both' },
    { pluck: [N.Eb4], taiko: 'don' },
    { pluck: [N.G4], taiko: 'don' },
    { pluck: [N.A4], taiko: 'both' }
  ]
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  public enabled = true;
  public bgmEnabled = true;
  public bgmVolume = 0.45;
  public currentTrackId: BgmTrackId = 'kyoto';
  public autoSwitchByZone = true;

  private bgmTimer: number | null = null;
  private stepIndex = 0;
  private isPlayingBgm = false;
  private gestureAttached = false;

  constructor() {
    this.attachUnlockGesture();
  }

  private attachUnlockGesture() {
    if (typeof window === 'undefined' || this.gestureAttached) return;
    this.gestureAttached = true;

    const unlock = () => {
      this.initCtx();
      if (this.bgmEnabled && !this.isPlayingBgm) {
        this.startBGM();
      }
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
  }

  private initCtx() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setZoneBGM(zoneId: string) {
    if (!this.autoSwitchByZone) return;
    let target: BgmTrackId = 'kyoto';
    if (zoneId === 'kyoto') target = 'kyoto';
    else if (zoneId === 'kurama' || zoneId === 'nikko') target = 'shrine';
    else if (zoneId === 'tokaido' || zoneId === 'fuji') target = 'bushido';
    else if (zoneId === 'yomi') target = 'battle';

    if (this.currentTrackId !== target) {
      this.selectTrack(target, true);
    } else if (this.bgmEnabled && !this.isPlayingBgm) {
      this.startBGM();
    }
  }

  public selectTrack(trackId: BgmTrackId, keepAutoMode = false) {
    if (!keepAutoMode) {
      this.autoSwitchByZone = false;
    }
    this.currentTrackId = trackId;
    this.stepIndex = 0;
    if (this.bgmEnabled) {
      this.restartBGM();
    }
  }

  public toggleBGM(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    if (this.bgmEnabled) {
      this.initCtx();
      this.startBGM();
    } else {
      this.stopBGM();
    }
    return this.bgmEnabled;
  }

  public setVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
  }

  public startBGM() {
    if (typeof window === 'undefined' || !this.bgmEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopBGM();
    this.isPlayingBgm = true;

    const track = BGM_TRACKS.find(t => t.id === this.currentTrackId) || BGM_TRACKS[0];
    // 每拍 16 分音符或 8 分音符間隔 (ms)
    const stepMs = Math.round((60 / track.bpm / 2) * 1000);

    this.bgmTimer = window.setInterval(() => {
      if (!this.bgmEnabled || !this.enabled) return;
      this.playSequenceStep();
    }, stepMs);
  }

  public stopBGM() {
    if (this.bgmTimer !== null && typeof window !== 'undefined') {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isPlayingBgm = false;
  }

  public restartBGM() {
    this.stopBGM();
    this.startBGM();
  }

  private playSequenceStep() {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const seq = TRACK_SEQUENCES[this.currentTrackId] || TRACK_SEQUENCES.kyoto;
    const step = seq[this.stepIndex % seq.length];
    this.stepIndex = (this.stepIndex + 1) % seq.length;

    const track = BGM_TRACKS.find(t => t.id === this.currentTrackId) || BGM_TRACKS[0];
    const stepSec = 60 / track.bpm / 2;
    const now = this.ctx.currentTime;
    const vol = this.bgmVolume * 0.35;
    if (vol <= 0.001) return;

    // 1. 尺八吹管主旋律 (Shakuhachi Flute with subtle vibrato)
    if (step.lead) {
      const dur = (step.leadDur || 1) * stepSec * 0.95;
      this.synthShakuhachi(step.lead, now, dur, vol * 0.85);
    }

    // 2. 三味線 / 古箏撥弦 (Shamisen / Koto Pluck)
    if (step.pluck && step.pluck.length > 0) {
      step.pluck.forEach((freq, idx) => {
        this.synthShamisenPluck(freq, now + idx * 0.018, stepSec * 1.35, vol * 0.65);
      });
    }

    // 3. 低音伴奏 (Bass Drone / Plucked Bass)
    if (step.bass) {
      this.synthBass(step.bass, now, stepSec * 1.9, vol * 0.7);
    }

    // 4. 太鼓與神樂鈴打擊樂 (Taiko Don / Ka / Bell)
    if (step.taiko) {
      this.synthTaiko(step.taiko, now, vol * 0.8);
    }
  }

  private synthShakuhachi(freq: number, startTime: number, duration: number, maxGain: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 0.992, startTime);
    // 尺八特有的吹氣微滑音 (Portamento)
    osc.frequency.exponentialRampToValueAtTime(freq, startTime + Math.min(0.06, duration * 0.3));

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(freq * 2, startTime);

    // 尺八搖音 (Vibrato)
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(5.2, startTime);
    lfoGain.gain.setValueAtTime(freq * 0.009, startTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(maxGain, startTime + Math.min(0.05, duration * 0.25));
    gain.gain.setValueAtTime(maxGain * 0.85, startTime + duration * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(maxGain * 0.22, startTime);
    subGain.gain.exponentialRampToValueAtTime(0.0005, startTime + duration);

    osc.connect(gain);
    subOsc.connect(subGain);
    gain.connect(this.ctx.destination);
    subGain.connect(this.ctx.destination);

    osc.start(startTime);
    subOsc.start(startTime);
    lfo.start(startTime);
    osc.stop(startTime + duration);
    subOsc.stop(startTime + duration);
    lfo.stop(startTime + duration);
  }

  private synthShamisenPluck(freq: number, startTime: number, duration: number, maxGain: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    // 模擬三味線撥子清脆高頻衰減
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 4.5, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, startTime + duration * 0.85);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0008, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private synthBass(freq: number, startTime: number, duration: number, maxGain: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(maxGain, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private synthTaiko(type: 'don' | 'ka' | 'both' | 'bell', startTime: number, maxGain: number) {
    if (!this.ctx) return;

    if (type === 'don' || type === 'both') {
      // 大太鼓「咚」(低沉共鳴鼓聲)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(135, startTime);
      osc.frequency.exponentialRampToValueAtTime(48, startTime + 0.22);

      gain.gain.setValueAtTime(maxGain * 1.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.24);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.24);
    }

    if (type === 'ka' || type === 'both') {
      // 締太鼓鼓邊／拍子木「咔」(清脆木擊聲)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(820, startTime);
      osc.frequency.exponentialRampToValueAtTime(290, startTime + 0.045);

      gain.gain.setValueAtTime(maxGain * 0.45, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.05);
    }

    if (type === 'bell') {
      // 神樂鈴／梵鐘泛音
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1567.98, startTime); // G6

      gain.gain.setValueAtTime(maxGain * 0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.45);
    }
  }

  public playSlash(isCrit = false) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isCrit ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(isCrit ? 580 : 420, t);
      osc.frequency.exponentialRampToValueAtTime(75, t + (isCrit ? 0.22 : 0.14));

      gain.gain.setValueAtTime(isCrit ? 0.38 : 0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.008, t + (isCrit ? 0.22 : 0.14));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + (isCrit ? 0.22 : 0.14));
    } catch {
      // Muted
    }
  }

  public playCoin() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987, t);
      osc.frequency.setValueAtTime(1318, t + 0.08);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.008, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } catch {
      // Muted
    }
  }

  public playLootChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime + i * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.16, t);
        gain.gain.exponentialRampToValueAtTime(0.008, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      });
    } catch {
      // Muted
    }
  }

  public playAchievementFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const t = this.ctx.currentTime + i * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.008, t + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      });
    } catch {
      // Muted
    }
  }
}

export const audio = new AudioEngine();
