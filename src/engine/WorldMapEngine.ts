import type { MapPOI, MapYokai } from '../types/game';
import { drawChibiSprite } from './pixelSprites';
import { audio } from './AudioEngine';

export interface TownWanderingNPC {
  id: string;
  name: string;
  spriteId: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  facing: 'down' | 'up' | 'left' | 'right';
  walkFrame: number;
  bubbleText: string;
}

export interface SceneryProp {
  kind: 'sakura' | 'pine' | 'bamboo' | 'maple' | 'ginkgo' | 'dead_tree' | 'rock' | 'torii_deco' | 'lantern' | 'banner' | 'well' | 'parasol';
  x: number;
  y: number;
  scale: number;
  variant: number;
}

export interface WeatherParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  phase: number;
}

export interface SlashEffect {
  x: number;
  y: number;
  facing: 'down' | 'up' | 'left' | 'right';
  createdAt: number;
  isCrit: boolean;
  damageText?: string;
}

export interface WorldMapState {
  currentZoneId: string;
  playerX: number;
  playerY: number;
  playerAvatar: string;
  playerName: string;
  playerTitle: string;
  targetX: number | null;
  targetY: number | null;
  facing: 'down' | 'up' | 'left' | 'right';
  isWalking: boolean;
  walkFrame: number;
  pois: MapPOI[];
  townNpcs: TownWanderingNPC[];
  yokaiList: MapYokai[];
  scenery: SceneryProp[];
  particles: WeatherParticle[];
  slashEffects: SlashEffect[];
  activeCombatYokaiId: string | null;
  encounterCooldownUntil: number;
  cameraX: number;
  cameraY: number;
}

export interface MapZoneConfig {
  id: string;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  grassBase: string;
  grassLight: string;
  grassDark: string;
  roadBase: string;
  roadBorder: string;
  waterDeep: string;
  waterShallow: string;
  flowerColors: string[];
  particleColors: string[];
  treeKind: 'sakura' | 'bamboo' | 'maple' | 'pine' | 'ginkgo' | 'dead_tree';
  isSafeTown: boolean;
  riverX: number;
}

export const MAP_ZONES: MapZoneConfig[] = [
  {
    id: 'kyoto',
    name: '京都・洛中城下町',
    subtitle: '櫻吹雪與鴨川茶屋之都',
    width: 1440,
    height: 920,
    grassBase: '#4d9239',
    grassLight: '#63ab49',
    grassDark: '#3b782a',
    roadBase: '#d9bc8c',
    roadBorder: '#8c7a5b',
    waterDeep: '#1d78b5',
    waterShallow: '#42a5e8',
    flowerColors: ['#ff8fab', '#ffb3c6', '#fde047', '#ffffff'],
    particleColors: ['#ffb3c6', '#ff8fab', '#ffd6e0'],
    treeKind: 'sakura',
    isSafeTown: true,
    riverX: 850
  },
  {
    id: 'kurama',
    name: '鞍馬山・天狗靈峰',
    subtitle: '千年古杉與翠竹清流',
    width: 1440,
    height: 920,
    grassBase: '#2d7a46',
    grassLight: '#3e945a',
    grassDark: '#1f5c33',
    roadBase: '#94a3b8',
    roadBorder: '#475569',
    waterDeep: '#0e7490',
    waterShallow: '#22d3ee',
    flowerColors: ['#86efac', '#fef08a', '#38bdf8'],
    particleColors: ['#86efac', '#4ade80', '#bbf7d0'],
    treeKind: 'bamboo',
    isSafeTown: false,
    riverX: 740
  },
  {
    id: 'tokaido',
    name: '東海道・荒涼驛道',
    subtitle: '秋楓古道與碧海宿場',
    width: 1600,
    height: 920,
    grassBase: '#6b8e23',
    grassLight: '#84a938',
    grassDark: '#526e18',
    roadBase: '#d4a373',
    roadBorder: '#8a623e',
    waterDeep: '#1e6091',
    waterShallow: '#4ea8de',
    flowerColors: ['#f97316', '#ef4444', '#facc15'],
    particleColors: ['#ef4444', '#f97316', '#facc15'],
    treeKind: 'maple',
    isSafeTown: false,
    riverX: 820
  },
  {
    id: 'fuji',
    name: '富士山麓・赤富士戰場',
    subtitle: '夕照赤富士與金秋芒原',
    width: 1500,
    height: 920,
    grassBase: '#8c6d32',
    grassLight: '#a88440',
    grassDark: '#6e5322',
    roadBase: '#b88b64',
    roadBorder: '#6e4e32',
    waterDeep: '#991b1b',
    waterShallow: '#f97316',
    flowerColors: ['#fde047', '#fb923c', '#f87171'],
    particleColors: ['#fb923c', '#fde047', '#ef4444'],
    treeKind: 'pine',
    isSafeTown: false,
    riverX: 780
  },
  {
    id: 'nikko',
    name: '日光・輪王神域',
    subtitle: '金碧東照宮與千年銀杏',
    width: 1500,
    height: 920,
    grassBase: '#3f8259',
    grassLight: '#529e6f',
    grassDark: '#2c6341',
    roadBase: '#e2e8f0',
    roadBorder: '#94a3b8',
    waterDeep: '#0284c7',
    waterShallow: '#38bdf8',
    flowerColors: ['#fde047', '#facc15', '#ffffff'],
    particleColors: ['#fde047', '#fef08a', '#fbbf24'],
    treeKind: 'ginkgo',
    isSafeTown: false,
    riverX: 760
  },
  {
    id: 'yomi',
    name: '常世狹縫・無間冥土',
    subtitle: '彼岸花海與三途冥川',
    width: 1600,
    height: 920,
    grassBase: '#31234a',
    grassLight: '#433163',
    grassDark: '#211633',
    roadBase: '#6b5b7b',
    roadBorder: '#3f334d',
    waterDeep: '#4c1d95',
    waterShallow: '#a855f7',
    flowerColors: ['#ef4444', '#f43f5e', '#c084fc'],
    particleColors: ['#38bdf8', '#c084fc', '#f43f5e'],
    treeKind: 'dead_tree',
    isSafeTown: false,
    riverX: 800
  }
];

export function resolveZoneIdFromName(zoneName: string): string {
  for (const z of MAP_ZONES) {
    if (zoneName.includes(z.name.slice(0, 2)) || z.name === zoneName) {
      return z.id;
    }
  }
  return 'kyoto';
}

export class WorldMapEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private groundCanvas: HTMLCanvasElement | null = null;
  public state: WorldMapState;
  private animId: number = 0;
  private lastTime: number = 0;
  private onEncounterCallback?: (yokai: MapYokai) => void;
  private onInteractPOICallback?: (poi: MapPOI) => void;
  private keysDown: Record<string, boolean> = {};

  constructor(
    canvas: HTMLCanvasElement,
    initialX = 480,
    initialY = 450,
    onEncounter?: (yokai: MapYokai) => void,
    onInteractPOI?: (poi: MapPOI) => void
  ) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
    this.onEncounterCallback = onEncounter;
    this.onInteractPOICallback = onInteractPOI;

    this.state = {
      currentZoneId: 'kyoto',
      playerX: initialX,
      playerY: initialY,
      playerAvatar: 'samurai_general',
      playerName: '宮本武藏',
      playerTitle: '天明浪人',
      targetX: null,
      targetY: null,
      facing: 'down',
      isWalking: false,
      walkFrame: 0,
      pois: [],
      townNpcs: [],
      yokaiList: [],
      scenery: [],
      particles: [],
      slashEffects: [],
      activeCombatYokaiId: null,
      encounterCooldownUntil: 0,
      cameraX: initialX - canvas.width / 2,
      cameraY: initialY - canvas.height / 2
    };

    this.initZone(this.state.currentZoneId);
    this.setupInputs();
  }

  public syncPlayerVisuals(avatar: string, name: string, title: string) {
    this.state.playerAvatar = avatar || 'samurai_general';
    this.state.playerName = name || '宮本武藏';
    this.state.playerTitle = title || '天明浪人';
  }

  public triggerSlashVisual(isCrit = false, damageText?: string) {
    this.state.slashEffects.push({
      x: this.state.playerX,
      y: this.state.playerY,
      facing: this.state.facing,
      createdAt: performance.now(),
      isCrit,
      damageText
    });
  }

  public initZone(zoneId: string) {
    this.state.currentZoneId = zoneId;
    this.state.activeCombatYokaiId = null;
    const zone = MAP_ZONES.find(z => z.id === zoneId) || MAP_ZONES[0];

    // 同步切換該區域的傳統和風 BGM
    audio.setZoneBGM(zoneId);

    this.state.townNpcs = [];
    this.state.scenery = [];

    if (zoneId === 'kyoto') {
      this.state.pois = [
        { id: 'shrine_kyoto', name: '出雲分社・祈福大社', type: 'shrine', x: 240, y: 240, icon: '⛩️', desc: '參拜神木可獲得【出雲武運】祝福（全屬性戰力 +15%，持續 5 分鐘）！' },
        { id: 'npc_yagyu', name: '柳生劍術道場・嚴信', type: 'npc', x: 430, y: 280, icon: 'npc_yagyu', desc: '「練完木刀別忘了去茶屋吃串熱騰騰的三色糰子，張弛有度才是劍聖之道！」' },
        { id: 'npc_kaede', name: '神女・神無月楓', type: 'npc', x: 290, y: 270, icon: 'samurai_female', desc: '「櫻花盛開的洛中城下町最熱鬧了，願神明護佑您的每一戰。」' },
        { id: 'npc_komachi', name: '花見糰子茶屋・小町', type: 'npc', x: 560, y: 520, icon: 'npc_town_girl', desc: '「歡迎光臨！剛烤好的醬油糰子跟宇治抹茶，武士大人要來一份嗎？」' },
        { id: 'forge_kunitomo', name: '國友鐵齋・鍛冶工坊', type: 'town', x: 680, y: 280, icon: 'npc_tessai', desc: '「哈哈哈！天外隕鐵與百鍊玉鋼都在爐裡燒紅啦，快來打造傳奇神兵！」' },
        { id: 'npc_hayate', name: '鴨川大橋巡守・疾風', type: 'npc', x: 790, y: 490, icon: 'npc_hayate', desc: '「跨過這座朱紅太鼓橋往東就是試刀林，町裡的孩子們都很崇拜您呢！」' },
        { id: 'chest_kyoto', name: '町民感謝金蒔繪禮匣', type: 'chest', x: 1180, y: 640, icon: '🎁', desc: '洛中街坊為感謝巡守武士而準備的漆金禮匣！' }
      ];

      this.state.townNpcs = [
        {
          id: 'wander_1',
          name: '賞櫻町娘・阿綾',
          spriteId: 'npc_town_girl',
          x: 470,
          y: 430,
          originX: 470,
          originY: 430,
          vx: 0.45,
          vy: 0.1,
          facing: 'right',
          walkFrame: 0,
          bubbleText: '🌸 櫻花跟糰子都好美～'
        },
        {
          id: 'wander_2',
          name: '道場門生・新八',
          spriteId: 'samurai_general',
          x: 640,
          y: 455,
          originX: 640,
          originY: 455,
          vx: -0.4,
          vy: 0.12,
          facing: 'left',
          walkFrame: 1,
          bubbleText: '⚔️ 今日木刀百振達成！'
        }
      ];
    } else {
      this.state.pois = [
        { id: 'shrine_' + zoneId, name: `${zone.name.split('・')[0]}・祈福大社`, type: 'shrine', x: 250, y: 240, icon: '⛩️', desc: '點著暖光燈籠的靈山大社，參拜可獲【出雲武運】戰力加成！' },
        { id: 'npc_guide_' + zoneId, name: '行腳茶屋・小町', type: 'npc', x: 520, y: 520, icon: 'npc_town_girl', desc: '「走累了嗎？在野點傘下喝口熱抹茶，再繼續跟妖怪們切磋吧！」' },
        { id: 'forge_' + zoneId, name: '行軍鍛冶爐・鐵齋', type: 'town', x: 640, y: 280, icon: 'npc_tessai', desc: '「在野外打到好胚子？直接交給老夫現場鍛造強化！」' },
        { id: 'chest_' + zoneId, name: '古道金蒔繪秘寶箱', type: 'chest', x: 1160, y: 620, icon: '🎁', desc: '藏在古樹下的金蒔繪寶箱，能開出稀世武具！' }
      ];
    }

    // 生成武士道列傳風格的豐富景觀物件（櫻花樹、竹林、楓樹、岩石、鳥居、石燈籠、陣幕）
    this.generateZoneScenery(zone);

    // 預先渲染全彩高細節 16-bit 地圖底圖 Canvas
    this.buildOffscreenGround(zone);

    // 初始化天氣飄落粒子（櫻花瓣、竹葉、楓葉、金粉、火粉）
    this.initParticles(zone);

    // 生成漫遊的 3頭身像素妖怪
    this.state.yokaiList = [];
    const monsterConfigs = [
      { name: '貪吃赤面鬼', sprite: 'yokai_oni' },
      { name: '鞍馬小天狗', sprite: 'yokai_tengu' },
      { name: '提燈白狐妖', sprite: 'yokai_kitsune' },
      { name: '偷酒赤面鬼', sprite: 'yokai_oni' },
      { name: '常世鬼大將', sprite: 'yokai_tengu' }
    ];
    const stances: ('earth' | 'water' | 'fire' | 'wind' | 'void')[] = ['earth', 'water', 'fire', 'wind', 'void'];
    const count = 5;

    for (let i = 0; i < count; i++) {
      const ox = zoneId === 'kyoto'
        ? 980 + (i % 3) * 140
        : 920 + (i % 3) * 150;
      const oy = 250 + Math.floor(i / 2) * 190 + (i % 2) * 70;
      const st = stances[i % stances.length];
      const lvl = Math.max(1, (MAP_ZONES.findIndex(z => z.id === zoneId) + 1) * 5 - 3 + i);
      const cfg = monsterConfigs[i % monsterConfigs.length];

      this.state.yokaiList.push({
        id: `yokai_${zoneId}_${i}`,
        name: cfg.name,
        avatar: cfg.sprite,
        level: lvl,
        hp: lvl * 140 + 160,
        maxHp: lvl * 140 + 160,
        atk: lvl * 12 + 16,
        def: lvl * 6 + 8,
        x: ox,
        y: oy,
        patrolOriginX: ox,
        patrolOriginY: oy,
        patrolRadius: 75,
        vx: (i % 2 === 0 ? 0.55 : -0.55),
        vy: (i % 3 === 0 ? 0.35 : -0.35),
        stance: st,
        isBoss: i === count - 1
      });
    }
  }

  private generateZoneScenery(zone: MapZoneConfig) {
    const props: SceneryProp[] = [];
    const treePositions = [
      [120, 160], [180, 290], [140, 580], [220, 720], [340, 150],
      [350, 660], [490, 160], [640, 680], [740, 170], [940, 150],
      [1120, 165], [1280, 190], [1340, 340], [1320, 590], [1250, 760],
      [1040, 750], [920, 690], [160, 820], [520, 780]
    ];

    treePositions.forEach(([tx, ty], idx) => {
      props.push({
        kind: zone.treeKind,
        x: tx,
        y: ty,
        scale: idx % 3 === 0 ? 1.25 : 1.0,
        variant: idx % 3
      });
    });

    // 街道兩側石燈籠與朱紅提燈
    for (let lx = 180; lx <= zone.width - 180; lx += 160) {
      if (Math.abs(lx - zone.riverX) < 75) continue;
      props.push({ kind: 'lantern', x: lx, y: 392, scale: 1, variant: 0 });
      props.push({ kind: 'lantern', x: lx, y: 512, scale: 1, variant: 1 });
    }

    // 奇岩與裝飾景物
    const rockCoords = [[190, 370], [710, 590], [960, 370], [1220, 370], [1080, 520]];
    rockCoords.forEach(([rx, ry], idx) => {
      props.push({ kind: 'rock', x: rx, y: ry, scale: 1, variant: idx % 2 });
    });

    this.state.scenery = props;
  }

  private initParticles(zone: MapZoneConfig) {
    this.state.particles = [];
    for (let i = 0; i < 42; i++) {
      this.state.particles.push({
        x: Math.random() * zone.width,
        y: Math.random() * zone.height,
        vx: zone.id === 'fuji' || zone.id === 'yomi' ? (Math.random() - 0.5) * 18 : -18 - Math.random() * 22,
        vy: zone.id === 'fuji' || zone.id === 'yomi' ? -15 - Math.random() * 20 : 16 + Math.random() * 20,
        size: 3 + Math.floor(Math.random() * 4),
        color: zone.particleColors[i % zone.particleColors.length],
        alpha: 0.55 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  /**
   * 預先繪製《武士道列傳》風格的全彩高細節像素地貌底圖
   */
  private buildOffscreenGround(zone: MapZoneConfig) {
    if (typeof document === 'undefined') return;
    const off = document.createElement('canvas');
    off.width = zone.width;
    off.height = zone.height;
    const g = off.getContext('2d');
    if (!g) return;
    g.imageSmoothingEnabled = false;

    const tileSize = 32;
    const cols = Math.ceil(zone.width / tileSize);
    const rows = Math.ceil(zone.height / tileSize);

    // 1. 全彩草地／地貌像素拼接磚 (Multi-tone 16-bit Grass & Wildflowers)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const tx = c * tileSize;
        const ty = r * tileSize;
        const hash = ((c * 73856093) ^ (r * 19349663)) >>> 0;

        g.fillStyle = (c + r) % 2 === 0 ? zone.grassBase : zone.grassDark;
        g.fillRect(tx, ty, tileSize, tileSize);

        // 草叢亮部像素紋理
        g.fillStyle = zone.grassLight;
        g.fillRect(tx + (hash % 18), ty + ((hash >> 3) % 18), 6, 4);
        g.fillRect(tx + ((hash >> 5) % 22), ty + ((hash >> 7) % 22), 4, 6);

        // 像素小草簇 (Grass blades)
        g.fillStyle = zone.grassLight;
        const gx = tx + 6 + (hash % 16);
        const gy = ty + 8 + ((hash >> 4) % 16);
        g.fillRect(gx, gy, 2, 6);
        g.fillRect(gx - 2, gy + 2, 2, 4);
        g.fillRect(gx + 2, gy + 1, 2, 5);

        // 點綴盛開的像素野花與落櫻
        if (hash % 5 === 0) {
          const flColor = zone.flowerColors[hash % zone.flowerColors.length];
          const fx = tx + 8 + ((hash >> 2) % 16);
          const fy = ty + 8 + ((hash >> 6) % 16);
          g.fillStyle = flColor;
          g.fillRect(fx, fy - 2, 2, 6);
          g.fillRect(fx - 2, fy, 6, 2);
          g.fillStyle = '#fef08a';
          g.fillRect(fx, fy, 2, 2);
        }
      }
    }

    // 2. 遠景浮世繪山巒天際線 (Top Horizon Vista — 富士山 / 鞍馬群峰 / 京都北山)
    this.drawHorizonVista(g, zone);

    // 3. 繪製石疊廣場與縱橫街道網 (Cobblestone Plaza & Edo Highways)
    // 中央城下町石疊大廣場
    this.drawCobblestoneRect(g, 380, 290, 340, 260, zone.roadBase, zone.roadBorder);
    // 東西向東海道主幹道 (Y = 405..495)
    this.drawCobblestoneRect(g, 40, 405, zone.width - 80, 90, zone.roadBase, zone.roadBorder);
    // 通往神社、道場、鍛冶屋、寶箱的飛石參道 (Stepping Stone Paths)
    this.drawSteppingStones(g, 240, 405, 240, 230);
    this.drawSteppingStones(g, 430, 320, 430, 270);
    this.drawSteppingStones(g, 660, 320, 660, 270);
    this.drawSteppingStones(g, 1160, 495, 1160, 630);

    // 4. 繪製貫穿南北的溪流與護岸石垣 (River & Stone Embankments)
    const rx = zone.riverX;
    for (let y = 76; y < zone.height; y += 16) {
      const waveOffset = Math.round(Math.sin(y * 0.015) * 18);
      const curRx = rx + waveOffset;
      // 兩側護岸石垣
      g.fillStyle = '#64748b';
      g.fillRect(curRx - 48, y, 12, 16);
      g.fillRect(curRx + 36, y, 12, 16);
      g.fillStyle = '#94a3b8';
      g.fillRect(curRx - 46, y + 2, 8, 6);
      g.fillRect(curRx + 38, y + 2, 8, 6);

      // 淺灘與深水河道
      g.fillStyle = zone.waterShallow;
      g.fillRect(curRx - 36, y, 72, 16);
      g.fillStyle = zone.waterDeep;
      g.fillRect(curRx - 24, y, 48, 16);
    }

    // 5. 繪製橫跨河川的《武士道列傳》朱紅太鼓木橋 (Vermilion Arched Taiko Bridge)
    this.drawTaikoBridge(g, rx + Math.round(Math.sin(450 * 0.015) * 18), 400, 128, 100);

    this.groundCanvas = off;
  }

  private drawHorizonVista(g: CanvasRenderingContext2D, zone: MapZoneConfig) {
    const h = 76;
    // 天空漸層色帶
    const skyColors = zone.id === 'fuji'
      ? ['#450a0a', '#991b1b', '#ea580c', '#fdba74']
      : zone.id === 'yomi'
      ? ['#0f051d', '#2e1065', '#581c87', '#7e22ce']
      : zone.id === 'kyoto'
      ? ['#1e3a8a', '#2563eb', '#60a5fa', '#bae6fd']
      : ['#0f172a', '#1e293b', '#334155', '#64748b'];

    skyColors.forEach((col, idx) => {
      g.fillStyle = col;
      g.fillRect(0, idx * (h / 4), zone.width, h / 4);
    });

    // 遠山剪影與赤富士／白雪富士
    for (let x = 0; x < zone.width; x += 4) {
      const m1 = Math.sin(x * 0.006) * 22 + Math.cos(x * 0.013) * 12;
      const my = Math.max(12, Math.round(46 - m1));
      g.fillStyle = zone.id === 'fuji' ? '#7f1d1d' : '#1e293b';
      g.fillRect(x, my, 4, h - my);
    }

    // 中央富士山峰 (Fuji Silhouette)
    const fx = Math.round(zone.width * 0.52);
    for (let dy = 0; dy < 58; dy++) {
      const halfW = Math.round(14 + Math.pow(dy, 1.32) * 0.85);
      g.fillStyle = dy < 18 ? '#f8fafc' : zone.id === 'fuji' ? '#dc2626' : '#3b82f6';
      g.fillRect(fx - halfW, 18 + dy, halfW * 2, 1);
    }

    // 地平線石垣圍欄
    g.fillStyle = '#334155';
    g.fillRect(0, h - 6, zone.width, 6);
  }

  private drawCobblestoneRect(
    g: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    baseColor: string,
    borderColor: string
  ) {
    // 外框石緣
    g.fillStyle = borderColor;
    g.fillRect(x - 4, y - 4, w + 8, h + 8);
    g.fillStyle = baseColor;
    g.fillRect(x, y, w, h);

    // 石板磚縫與明暗色塊
    const brickW = 24;
    const brickH = 16;
    for (let by = y; by < y + h; by += brickH) {
      const rowOffset = ((by / brickH) % 2) * 12;
      for (let bx = x; bx < x + w; bx += brickW) {
        const hash = ((bx * 31) ^ (by * 17)) & 7;
        g.fillStyle = hash === 0 ? 'rgba(255,255,255,0.16)' : hash === 1 ? 'rgba(0,0,0,0.10)' : 'transparent';
        if (g.fillStyle !== 'transparent') {
          g.fillRect(bx + 2, by + 2, Math.min(brickW - 3, x + w - bx - 2), Math.min(brickH - 3, y + h - by - 2));
        }
        g.fillStyle = 'rgba(71, 53, 33, 0.25)';
        g.fillRect(bx, by, Math.min(brickW, x + w - bx), 1);
        const vx = bx + rowOffset;
        if (vx < x + w) {
          g.fillRect(vx, by, 1, Math.min(brickH, y + h - by));
        }
      }
    }
  }

  private drawSteppingStones(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    const steps = Math.max(4, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 24));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const sx = Math.round(x1 + (x2 - x1) * t);
      const sy = Math.round(y1 + (y2 - y1) * t);
      g.fillStyle = '#64748b';
      g.fillRect(sx - 12, sy - 7, 24, 14);
      g.fillStyle = '#cbd5e1';
      g.fillRect(sx - 10, sy - 5, 20, 10);
    }
  }

  private drawTaikoBridge(g: CanvasRenderingContext2D, centerX: number, topY: number, width: number, height: number) {
    const left = centerX - Math.round(width / 2);
    // 橋面木板
    g.fillStyle = '#78350f';
    g.fillRect(left, topY, width, height);
    for (let bx = left; bx < left + width; bx += 12) {
      g.fillStyle = (bx / 12) % 2 === 0 ? '#92400e' : '#b45309';
      g.fillRect(bx + 1, topY + 8, 10, height - 16);
    }
    // 上下朱紅欄杆 (Vermilion Railings)
    g.fillStyle = '#dc2626';
    g.fillRect(left - 4, topY, width + 8, 10);
    g.fillRect(left - 4, topY + height - 10, width + 8, 10);
    // 黃金擬寶珠柱頭 (Gold Giboshi Finials)
    const posts = [left, left + Math.round(width * 0.33), left + Math.round(width * 0.66), left + width - 6];
    for (const px of posts) {
      g.fillStyle = '#991b1b';
      g.fillRect(px, topY - 6, 8, 16);
      g.fillRect(px, topY + height - 14, 8, 16);
      g.fillStyle = '#fbbf24';
      g.fillRect(px + 1, topY - 9, 6, 4);
      g.fillRect(px + 1, topY + height - 17, 6, 4);
    }
  }

  public navigateToQuestTarget() {
    if (this.state.yokaiList.length > 0) {
      const targetYokai = this.state.yokaiList[0];
      this.state.targetX = targetYokai.x;
      this.state.targetY = targetYokai.y;
    } else if (this.state.pois.length > 0) {
      this.state.targetX = this.state.pois[0].x;
      this.state.targetY = this.state.pois[0].y + 24;
    }
  }

  public onActiveYokaiDefeated() {
    if (!this.state.activeCombatYokaiId) return;
    const idx = this.state.yokaiList.findIndex(y => y.id === this.state.activeCombatYokaiId);
    if (idx !== -1) {
      const yk = this.state.yokaiList[idx];
      yk.hp = yk.maxHp;
      yk.x = yk.patrolOriginX + (Math.random() * 60 - 30);
      yk.y = yk.patrolOriginY + (Math.random() * 60 - 30);
    }
    this.state.activeCombatYokaiId = null;
    this.state.encounterCooldownUntil = performance.now() + 900;
  }

  private setupInputs() {
    const handlePointerDown = (clientX: number, clientY: number) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const screenX = (clientX - rect.left) * scaleX;
      const screenY = (clientY - rect.top) * scaleY;

      const worldX = screenX + this.state.cameraX;
      const worldY = screenY + this.state.cameraY;

      for (const poi of this.state.pois) {
        const dist = Math.hypot(worldX - poi.x, worldY - (poi.y - 16));
        if (dist <= 48) {
          if (this.onInteractPOICallback) this.onInteractPOICallback(poi);
          this.state.targetX = poi.x;
          this.state.targetY = poi.y + 24;
          return;
        }
      }

      for (const yk of this.state.yokaiList) {
        const dist = Math.hypot(worldX - yk.x, worldY - (yk.y - 16));
        if (dist <= 48) {
          this.state.targetX = yk.x;
          this.state.targetY = yk.y;
          return;
        }
      }

      this.state.targetX = worldX;
      this.state.targetY = worldY;
    };

    this.canvas.addEventListener('mousedown', (e) => handlePointerDown(e.clientX, e.clientY));
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      this.keysDown[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        this.state.targetX = null;
        this.state.targetY = null;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown[e.key.toLowerCase()] = false;
    });
  }

  public setDestination(x: number, y: number) {
    this.state.targetX = x;
    this.state.targetY = y;
  }

  public start() {
    this.lastTime = performance.now();
    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - this.lastTime) / 1000);
      this.lastTime = time;
      this.update(dt, time);
      this.render(time);
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private update(dt: number, now: number) {
    const moveSpeed = 230;
    let vx = 0;
    let vy = 0;

    if (this.keysDown['w'] || this.keysDown['arrowup']) vy -= 1;
    if (this.keysDown['s'] || this.keysDown['arrowdown']) vy += 1;
    if (this.keysDown['a'] || this.keysDown['arrowleft']) vx -= 1;
    if (this.keysDown['d'] || this.keysDown['arrowright']) vx += 1;

    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);
      vx = (vx / len) * moveSpeed;
      vy = (vy / len) * moveSpeed;
      this.state.isWalking = true;
      if (Math.abs(vx) > Math.abs(vy)) {
        this.state.facing = vx > 0 ? 'right' : 'left';
      } else {
        this.state.facing = vy > 0 ? 'down' : 'up';
      }
      this.state.playerX += vx * dt;
      this.state.playerY += vy * dt;
    } else if (this.state.targetX !== null && this.state.targetY !== null) {
      const dx = this.state.targetX - this.state.playerX;
      const dy = this.state.targetY - this.state.playerY;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        vx = (dx / dist) * moveSpeed;
        vy = (dy / dist) * moveSpeed;
        this.state.isWalking = true;
        if (Math.abs(dx) > Math.abs(dy)) {
          this.state.facing = dx > 0 ? 'right' : 'left';
        } else {
          this.state.facing = dy > 0 ? 'down' : 'up';
        }
        this.state.playerX += vx * dt;
        this.state.playerY += vy * dt;
      } else {
        this.state.targetX = null;
        this.state.targetY = null;
        this.state.isWalking = false;
      }
    } else {
      this.state.isWalking = false;
    }

    const curZone = MAP_ZONES.find(z => z.id === this.state.currentZoneId) || MAP_ZONES[0];
    this.state.playerX = Math.max(36, Math.min(curZone.width - 36, this.state.playerX));
    this.state.playerY = Math.max(92, Math.min(curZone.height - 30, this.state.playerY));

    if (this.state.isWalking) {
      this.state.walkFrame = (this.state.walkFrame + dt * 7.5) % 4;
    } else {
      this.state.walkFrame = 0;
    }

    for (const npc of this.state.townNpcs) {
      npc.x += npc.vx;
      npc.y += npc.vy;
      npc.walkFrame = (npc.walkFrame + dt * 4) % 4;
      npc.facing = npc.vx >= 0 ? 'right' : 'left';
      if (Math.hypot(npc.x - npc.originX, npc.y - npc.originY) > 70) {
        npc.vx *= -1;
        npc.vy *= -1;
      }
    }

    for (const yk of this.state.yokaiList) {
      if (this.state.activeCombatYokaiId !== yk.id) {
        yk.x += yk.vx;
        yk.y += yk.vy;
        const pDist = Math.hypot(yk.x - yk.patrolOriginX, yk.y - yk.patrolOriginY);
        if (pDist > yk.patrolRadius) {
          yk.vx *= -1;
          yk.vy *= -1;
        }
      }

      const playerDist = Math.hypot(this.state.playerX - yk.x, this.state.playerY - yk.y);
      if (
        playerDist < 48 &&
        this.onEncounterCallback &&
        this.state.activeCombatYokaiId !== yk.id &&
        now >= this.state.encounterCooldownUntil
      ) {
        this.state.activeCombatYokaiId = yk.id;
        this.state.targetX = null;
        this.state.targetY = null;
        this.triggerSlashVisual(false);
        this.onEncounterCallback(yk);
      } else if (playerDist > 75 && this.state.activeCombatYokaiId === yk.id) {
        this.state.activeCombatYokaiId = null;
      }
    }

    // 更新天氣落葉／櫻吹雪粒子
    for (const pt of this.state.particles) {
      pt.x += pt.vx * dt + Math.sin(now * 0.002 + pt.phase) * 0.35;
      pt.y += pt.vy * dt;
      if (pt.x < 0) pt.x = curZone.width;
      if (pt.x > curZone.width) pt.x = 0;
      if (pt.y < 80) pt.y = curZone.height;
      if (pt.y > curZone.height) pt.y = 85;
    }

    // 清理過期刀光特效
    this.state.slashEffects = this.state.slashEffects.filter(s => now - s.createdAt < 360);

    const targetCamX = this.state.playerX - this.canvas.width / 2;
    const targetCamY = this.state.playerY - this.canvas.height / 2;
    this.state.cameraX += (targetCamX - this.state.cameraX) * 0.14;
    this.state.cameraY += (targetCamY - this.state.cameraY) * 0.14;

    this.state.cameraX = Math.max(0, Math.min(Math.max(0, curZone.width - this.canvas.width), this.state.cameraX));
    this.state.cameraY = Math.max(0, Math.min(Math.max(0, curZone.height - this.canvas.height), this.state.cameraY));
  }

  private render(now = performance.now()) {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const curZone = MAP_ZONES.find(z => z.id === this.state.currentZoneId) || MAP_ZONES[0];
    const camX = Math.round(this.state.cameraX);
    const camY = Math.round(this.state.cameraY);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);

    // 1. 繪製全彩預渲染地貌底圖 (Grass, Flowers, Roads, River, Taiko Bridge, Horizon)
    if (this.groundCanvas) {
      ctx.drawImage(this.groundCanvas, camX, camY, w, h, 0, 0, w, h);
    } else {
      ctx.fillStyle = curZone.grassBase;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. 動態河水波光與悠游錦鯉 (Animated Water Ripples & Swimming Koi)
    this.renderAnimatedRiverDetails(ctx, curZone, camX, camY, w, h, now);

    // 3. 繪製地標和風建築群 (鳥居大社、柳生道場、糰子茶屋、國友鍛冶屋、秘寶箱)
    for (const poi of this.state.pois) {
      const px = poi.x - camX;
      const py = poi.y - camY;
      if (px < -160 || px > w + 160 || py < -160 || py > h + 160) continue;
      this.renderPOIArchitecture(ctx, poi, px, py, now);
    }

    // 4. 繪製場景樹木、竹林、楓樹與石燈籠 (依 Y 軸深度排序)
    for (const prop of this.state.scenery) {
      const sx = prop.x - camX;
      const sy = prop.y - camY;
      if (sx < -100 || sx > w + 100 || sy < -100 || sy > h + 100) continue;
      this.renderSceneryProp(ctx, prop, sx, sy, now);
    }

    // 5. 若在京都，標示鴨川橋東側「東郊試刀林」木製路標
    if (curZone.id === 'kyoto') {
      const signX = 915 - camX;
      const signY = 385 - camY;
      ctx.fillStyle = '#451a03';
      ctx.fillRect(signX - 3, signY - 12, 6, 26);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(signX - 72, signY - 26, 144, 20);
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.strokeRect(signX - 72, signY - 26, 144, 20);
      ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#78350f';
      ctx.textAlign = 'center';
      ctx.fillText('⬅ 洛中町區 ｜ 鴨川試刀林 ➡', signX, signY - 12);
    }

    // 6. 繪製目標尋路指示光圈
    if (this.state.targetX !== null && this.state.targetY !== null) {
      const tx = this.state.targetX - camX;
      const ty = this.state.targetY - camY;
      const pulse = 12 + Math.sin(now * 0.008) * 3;
      ctx.beginPath();
      ctx.arc(tx, ty, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    }

    // 7. 繪製 POI 的 3頭身像素 NPC 與名稱牌
    for (const poi of this.state.pois) {
      const px = poi.x - camX;
      const py = poi.y - camY;
      if (px < -100 || px > w + 100 || py < -100 || py > h + 100) continue;

      // 腳下互動光環
      ctx.beginPath();
      ctx.ellipse(px, py + 3, 22, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = poi.type === 'shrine'
        ? 'rgba(239, 68, 68, 0.35)'
        : poi.type === 'chest'
        ? 'rgba(250, 204, 21, 0.4)'
        : 'rgba(56, 189, 248, 0.32)';
      ctx.fill();

      if (poi.type === 'npc' || poi.type === 'town') {
        drawChibiSprite(ctx, poi.icon, px, py + 4, 2, 'down', 0);
      }

      // 精緻日式木牌名稱標籤
      ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      const textW = ctx.measureText(poi.name).width + 14;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(px - textW / 2, py + 9, textW, 18);
      ctx.strokeStyle = poi.type === 'chest' ? '#facc15' : '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(px - textW / 2, py + 9, textW, 18);
      ctx.fillStyle = poi.type === 'chest' ? '#fde047' : '#ffffff';
      ctx.fillText(poi.name, px, py + 21);
    }

    // 8. 繪製城鎮散步 3頭身町民與對話氣泡
    for (const wn of this.state.townNpcs) {
      const nx = wn.x - camX;
      const ny = wn.y - camY;
      if (nx < -80 || nx > w + 80 || ny < -80 || ny > h + 80) continue;

      ctx.beginPath();
      ctx.ellipse(nx, ny + 2, 14, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fill();

      drawChibiSprite(ctx, wn.spriteId, nx, ny + 2, 2, wn.facing, wn.walkFrame);

      ctx.font = 'bold 10px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      const bw = ctx.measureText(wn.bubbleText).width + 12;
      ctx.fillStyle = 'rgba(255, 251, 235, 0.94)';
      ctx.fillRect(nx - bw / 2, ny - 64, bw, 16);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.strokeRect(nx - bw / 2, ny - 64, bw, 16);
      ctx.fillStyle = '#78350f';
      ctx.fillText(wn.bubbleText, nx, ny - 53);
    }

    // 9. 繪製 3頭身像素漫遊妖怪
    for (const yk of this.state.yokaiList) {
      const yx = yk.x - camX;
      const yy = yk.y - camY;
      if (yx < -80 || yx > w + 80 || yy < -80 || yy > h + 80) continue;

      const scale = yk.isBoss ? 2.5 : 2;
      const spriteH = 24 * scale;

      ctx.beginPath();
      ctx.ellipse(yx, yy + 3, 18, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.state.activeCombatYokaiId === yk.id ? 'rgba(239, 68, 68, 0.65)' : 'rgba(0,0,0,0.45)';
      ctx.fill();

      const ykFacing = yk.vx < 0 ? 'left' : 'right';
      drawChibiSprite(ctx, yk.avatar, yx, yy + 2, scale, ykFacing, (now / 220) % 2);

      // 妖怪血條
      const barW = 50;
      const barH = 6;
      const hpPct = Math.max(0, Math.min(1, yk.hp / yk.maxHp));
      const barY = yy - spriteH - 8;
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(yx - barW / 2 - 1, barY - 1, barW + 2, barH + 2);
      ctx.fillStyle = yk.isBoss ? '#ef4444' : '#f59e0b';
      ctx.fillRect(yx - barW / 2, barY, barW * hpPct, barH);

      ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#090d16';
      ctx.fillText(`Lv.${yk.level} ${yk.name}`, yx + 1, barY - 4);
      ctx.fillStyle = yk.isBoss ? '#fca5a5' : '#fef08a';
      ctx.fillText(`Lv.${yk.level} ${yk.name}`, yx, barY - 5);
    }

    // 10. 繪製主角 3頭身像素武士 (Player Character)
    const px = this.state.playerX - camX;
    const py = this.state.playerY - camY;

    ctx.beginPath();
    ctx.ellipse(px, py + 3, 20, 8, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.42)';
    ctx.fill();

    drawChibiSprite(
      ctx,
      this.state.playerAvatar,
      px,
      py + 3,
      2,
      this.state.facing,
      this.state.isWalking ? this.state.walkFrame : 0
    );

    // 玩家頭頂名牌
    ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    const label = `【${this.state.playerTitle}】${this.state.playerName}`;
    const lw = ctx.measureText(label).width + 14;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(px - lw / 2, py - 66, lw, 18);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px - lw / 2, py - 66, lw, 18);
    ctx.fillStyle = '#fde047';
    ctx.fillText(label, px, py - 53);

    // 11. 繪製拔刀斬擊三日月刀光特效 (Katana Crescent Slash VFX)
    this.renderSlashEffects(ctx, camX, camY, now);

    // 12. 繪製前景飄落櫻花瓣／竹葉／楓葉粒子
    for (const pt of this.state.particles) {
      const sx = pt.x - camX;
      const sy = pt.y - camY;
      if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;
      ctx.fillStyle = pt.color;
      ctx.fillRect(Math.round(sx), Math.round(sy), pt.size, pt.size - 1);
    }

    // 13. 繪製左上角《武士道列傳》和風地名卷軸與右上角即時雷達小地圖 (Minimap)
    this.renderHudOverlays(ctx, curZone, w, h);

    ctx.restore();
  }

  private renderAnimatedRiverDetails(
    ctx: CanvasRenderingContext2D,
    zone: MapZoneConfig,
    camX: number,
    camY: number,
    w: number,
    h: number,
    now: number
  ) {
    const rx = zone.riverX;
    for (let y = 90; y < zone.height; y += 36) {
      if (y > 395 && y < 505) continue; // 太鼓橋下方不畫水紋
      const waveOffset = Math.round(Math.sin(y * 0.015) * 18);
      const sx = rx + waveOffset - camX;
      const sy = y - camY;
      if (sx < -50 || sx > w + 50 || sy < -20 || sy > h + 20) continue;

      const shimmerX = Math.round(Math.sin(now * 0.004 + y) * 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(sx - 12 + shimmerX, sy, 16, 2);
      ctx.fillRect(sx + 4 - shimmerX, sy + 14, 12, 2);

      // 錦鯉游動 (Swimming Koi Fish in Kyoto / Nikko / Kurama)
      if (y % 108 === 0 && zone.id !== 'yomi' && zone.id !== 'fuji') {
        const koiX = sx + Math.round(Math.sin(now * 0.002 + y) * 14);
        const koiY = sy + 8 + Math.round(Math.cos(now * 0.002 + y) * 4);
        ctx.fillStyle = (y / 108) % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.fillRect(koiX, koiY, 6, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(koiX + 6, koiY + 1, 3, 2);
      }
    }
  }

  /**
   * 繪製武士道列傳風格的全彩像素建築（大鳥居、茶屋、道場、鍛冶屋、金蒔繪寶箱）
   */
  private renderPOIArchitecture(ctx: CanvasRenderingContext2D, poi: MapPOI, px: number, py: number, now: number) {
    if (poi.type === 'shrine') {
      // 朱紅大鳥居與注連繩 (Grand Vermilion Torii Gate)
      const topY = py - 74;
      // 雙柱陰影與基底
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(px - 34, py - 8, 12, 8);
      ctx.fillRect(px + 22, py - 8, 12, 8);
      // 朱紅雙柱
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px - 32, topY + 12, 8, 56);
      ctx.fillRect(px + 24, topY + 12, 8, 56);
      // 笠木與島木 (雙層弧形上樑)
      ctx.fillStyle = '#18181b';
      ctx.fillRect(px - 48, topY, 96, 5);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(px - 44, topY + 5, 88, 7);
      // 貫 (下橫樑) 與黃金神額
      ctx.fillRect(px - 38, topY + 20, 76, 6);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px - 7, topY + 10, 14, 12);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(px - 4, topY + 12, 8, 8);
      // 白色紙垂 (Shide zigzags)
      ctx.fillStyle = '#ffffff';
      for (const sx of [px - 20, px - 8, px + 8, px + 20]) {
        ctx.fillRect(sx, topY + 26, 4, 6);
        ctx.fillRect(sx - 2, topY + 30, 4, 5);
      }
    } else if (poi.id.includes('komachi') || poi.id.includes('guide')) {
      // 花見糰子茶屋建築與紅野點傘 (Edo Tea House & Red Parasol)
      const bx = px - 52;
      const by = py - 72;
      // 瓦頂 (Kawara Tiled Roof)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx - 6, by, 108, 22);
      ctx.fillStyle = '#334155';
      for (let rx = bx - 4; rx < bx + 100; rx += 10) {
        ctx.fillRect(rx, by + 3, 8, 16);
      }
      // 木造屋身與白漆喰牆
      ctx.fillStyle = '#78350f';
      ctx.fillRect(bx, by + 22, 96, 36);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(bx + 6, by + 26, 84, 28);
      // 紅色茶屋暖簾 (Noren Curtain)
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(bx + 12, by + 24, 22, 20);
      ctx.fillRect(bx + 37, by + 24, 22, 20);
      ctx.fillRect(bx + 62, by + 24, 22, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('茶', bx + 23, by + 38);
      ctx.fillText('糰', bx + 48, by + 38);
      ctx.fillText('子', bx + 73, by + 38);
      // 戶外紅布床几與野點傘
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px + 34, py - 58, 36, 10);
      ctx.fillStyle = '#f87171';
      ctx.fillRect(px + 40, py - 64, 24, 6);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 51, py - 48, 3, 36);
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(px + 36, py - 20, 32, 8);
    } else if (poi.id.includes('yagyu')) {
      // 柳生劍術道場 (Samurai Dojo)
      const bx = px - 56;
      const by = py - 78;
      // 雙層青瓦屋頂與黃金鯱鉾
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(bx + 4, by - 6, 6, 8);
      ctx.fillRect(bx + 102, by - 6, 6, 8);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(bx - 4, by, 120, 24);
      ctx.fillStyle = '#334155';
      for (let rx = bx; rx < bx + 112; rx += 12) {
        ctx.fillRect(rx, by + 4, 9, 18);
      }
      // 白壁與道場木門
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(bx + 4, by + 24, 104, 38);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(bx + 4, by + 24, 104, 5);
      ctx.fillRect(bx + 36, by + 29, 40, 33);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('柳生道場', px, by + 20);
    } else if (poi.type === 'town') {
      // 國友鐵齋鍛冶工坊與赤紅熔爐 (Blacksmith Forge & Glowing Furnace)
      const bx = px - 50;
      const by = py - 74;
      ctx.fillStyle = '#27272a';
      ctx.fillRect(bx - 4, by, 104, 22);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(bx + 2, by + 22, 92, 36);
      // 紅磚高溫鍛造爐
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(bx + 10, by + 26, 34, 30);
      const fireFlicker = Math.sin(now * 0.015) > 0 ? '#f97316' : '#facc15';
      ctx.fillStyle = fireFlicker;
      ctx.fillRect(bx + 16, by + 36, 22, 16);
      // 鐵砧 (Anvil)
      ctx.fillStyle = '#64748b';
      ctx.fillRect(px + 24, py - 22, 20, 10);
      ctx.fillRect(px + 28, py - 12, 12, 6);
    } else if (poi.type === 'chest') {
      // 金蒔繪秘寶箱 (Gold Lacquer Treasure Chest)
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px - 16, py - 24, 32, 22);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px - 14, py - 22, 28, 18);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px - 16, py - 24, 32, 4);
      ctx.fillRect(px - 16, py - 14, 32, 3);
      ctx.fillRect(px - 4, py - 17, 8, 8);
    }
  }

  /**
   * 繪製全彩櫻花樹、竹林、紅楓、青松、銀杏、石燈籠與奇岩
   */
  private renderSceneryProp(ctx: CanvasRenderingContext2D, prop: SceneryProp, sx: number, sy: number, now: number) {
    if (prop.kind === 'lantern') {
      // 石燈籠與暖光暈
      ctx.fillStyle = '#64748b';
      ctx.fillRect(sx - 6, sy - 4, 12, 4);
      ctx.fillRect(sx - 4, sy - 22, 8, 18);
      ctx.fillRect(sx - 8, sy - 28, 16, 6);
      const glow = 16 + Math.sin(now * 0.006 + prop.x) * 3;
      ctx.beginPath();
      ctx.arc(sx, sy - 18, glow, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.22)';
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.fillRect(sx - 3, sy - 21, 6, 6);
      return;
    }

    if (prop.kind === 'rock') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(sx - 14, sy - 12, 28, 14);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(sx - 10, sy - 18, 20, 14);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(sx - 6, sy - 16, 10, 6);
      return;
    }

    if (prop.kind === 'bamboo') {
      // 鞍馬山翠竹林 (Multi-stalk Emerald Bamboo)
      for (const offset of [-10, 0, 10]) {
        const bx = sx + offset;
        ctx.fillStyle = '#15803d';
        ctx.fillRect(bx - 3, sy - 64, 6, 64);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(bx - 1, sy - 64, 2, 64);
        // 竹節
        ctx.fillStyle = '#14532d';
        for (let by = sy - 14; by > sy - 60; by -= 14) {
          ctx.fillRect(bx - 4, by, 8, 2);
        }
        // 竹葉簇
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(bx - 14, sy - 68, 28, 10);
        ctx.fillStyle = '#86efac';
        ctx.fillRect(bx - 10, sy - 74, 20, 8);
      }
      return;
    }

    // 樹幹陰影與木紋樹幹 (Sakura / Maple / Pine / Ginkgo / Dead Tree)
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2, 24, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.fill();

    ctx.fillStyle = '#451a03';
    ctx.fillRect(sx - 7, sy - 38, 14, 40);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(sx - 4, sy - 38, 6, 38);

    if (prop.kind === 'dead_tree') {
      // 常世彼岸枯木與紫晶靈花
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx - 22, sy - 46, 18, 6);
      ctx.fillRect(sx + 6, sy - 52, 18, 6);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(sx - 24, sy - 52, 10, 8);
      ctx.fillRect(sx + 16, sy - 58, 10, 8);
      return;
    }

    // 豐滿三層樹冠配色 (Sakura Pink / Maple Crimson / Ginkgo Gold / Pine Emerald)
    const canopyColors = prop.kind === 'sakura'
      ? ['#db2777', '#f472b6', '#fbcfe8']
      : prop.kind === 'maple'
      ? ['#991b1b', '#dc2626', '#f97316']
      : prop.kind === 'ginkgo'
      ? ['#b45309', '#f59e0b', '#fde047']
      : ['#14532d', '#15803d', '#22c55e'];

    // 底層深色樹冠
    ctx.fillStyle = canopyColors[0];
    ctx.fillRect(sx - 32, sy - 62, 64, 28);
    ctx.fillRect(sx - 26, sy - 74, 52, 16);
    // 中層主色樹冠
    ctx.fillStyle = canopyColors[1];
    ctx.fillRect(sx - 28, sy - 66, 56, 24);
    ctx.fillRect(sx - 20, sy - 80, 40, 18);
    // 頂層高光花簇／葉簇
    ctx.fillStyle = canopyColors[2];
    ctx.fillRect(sx - 20, sy - 70, 18, 10);
    ctx.fillRect(sx + 4, sy - 64, 18, 10);
    ctx.fillRect(sx - 10, sy - 82, 20, 8);
  }

  private renderSlashEffects(ctx: CanvasRenderingContext2D, camX: number, camY: number, now: number) {
    for (const sl of this.state.slashEffects) {
      const age = (now - sl.createdAt) / 360;
      if (age < 0 || age > 1) continue;

      const sx = sl.x - camX;
      const sy = sl.y - camY - 18;
      const dirX = sl.facing === 'left' ? -1 : sl.facing === 'right' ? 1 : 0;
      const dirY = sl.facing === 'up' ? -1 : sl.facing === 'down' ? 1 : 0;

      ctx.save();
      ctx.translate(sx + dirX * 26, sy + dirY * 22);
      ctx.globalAlpha = 1 - age;

      // 三日月刀光弧線
      ctx.beginPath();
      ctx.arc(0, 0, 26 + age * 16, -Math.PI * 0.65, Math.PI * 0.65);
      ctx.strokeStyle = sl.isCrit ? '#fde047' : '#38bdf8';
      ctx.lineWidth = sl.isCrit ? 7 : 5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, 24 + age * 16, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (sl.damageText) {
        ctx.font = 'bold 15px "Noto Sans TC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#090d16';
        ctx.fillText(sl.damageText, 1, -24 - age * 24 + 1);
        ctx.fillStyle = sl.isCrit ? '#fde047' : '#ffffff';
        ctx.fillText(sl.damageText, 0, -24 - age * 24);
      }

      ctx.restore();
    }
  }

  private renderHudOverlays(ctx: CanvasRenderingContext2D, zone: MapZoneConfig, w: number, _h: number) {
    // 1. 左上角《武士道列傳》和風木匾卷軸 (Zone Name Banner)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
    ctx.fillRect(12, 12, 236, 44);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, 236, 44);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 13px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🏮 ${zone.name}`, 22, 31);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px "Noto Sans TC", sans-serif';
    ctx.fillText(zone.subtitle, 24, 48);

    // 2. 右上角全彩雷達小地圖 (Mini-map)
    const mw = 128;
    const mh = 82;
    const mx = w - mw - 12;
    const my = 12;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.fillRect(mx - 2, my - 2, mw + 4, mh + 4);
    ctx.fillStyle = zone.grassDark;
    ctx.fillRect(mx, my, mw, mh);

    // 小地圖道路與河川
    const scaleX = mw / zone.width;
    const scaleY = mh / zone.height;
    ctx.fillStyle = zone.roadBase;
    ctx.fillRect(mx + 4, my + Math.round(405 * scaleY), mw - 8, Math.max(4, Math.round(90 * scaleY)));
    ctx.fillStyle = zone.waterShallow;
    ctx.fillRect(mx + Math.round(zone.riverX * scaleX) - 2, my, 5, mh);

    // 小地圖 POI 點 (藍點)
    for (const p of this.state.pois) {
      ctx.fillStyle = p.type === 'shrine' ? '#ef4444' : p.type === 'chest' ? '#facc15' : '#38bdf8';
      ctx.fillRect(mx + Math.round(p.x * scaleX) - 2, my + Math.round(p.y * scaleY) - 2, 4, 4);
    }

    // 小地圖妖怪點 (紅點)
    for (const yk of this.state.yokaiList) {
      ctx.fillStyle = '#f87171';
      ctx.fillRect(mx + Math.round(yk.x * scaleX) - 2, my + Math.round(yk.y * scaleY) - 2, 4, 4);
    }

    // 小地圖玩家位置 (閃爍金白點)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(mx + Math.round(this.state.playerX * scaleX) - 3, my + Math.round(this.state.playerY * scaleY) - 3, 6, 6);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(mx - 2, my - 2, mw + 4, mh + 4);
  }
}
