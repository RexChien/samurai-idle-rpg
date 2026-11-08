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
  guildTag?: string;
  level?: number;
  isOnlinePlayer?: boolean;
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
  trailHistory: { x: number; y: number; facing: 'down' | 'up' | 'left' | 'right' }[];
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
    grassBase: '#2d5a34',
    grassLight: '#3f7646',
    grassDark: '#1d3f23',
    roadBase: '#b89f78',
    roadBorder: '#64533b',
    waterDeep: '#0f4c75',
    waterShallow: '#3282b8',
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
    grassBase: '#1d4d38',
    grassLight: '#296b4d',
    grassDark: '#123526',
    roadBase: '#7c8b99',
    roadBorder: '#3b4654',
    waterDeep: '#0c4a6e',
    waterShallow: '#0284c7',
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
    grassBase: '#4c5c28',
    grassLight: '#657a37',
    grassDark: '#36421b',
    roadBase: '#b88b61',
    roadBorder: '#6c4d30',
    waterDeep: '#164e63',
    waterShallow: '#0891b2',
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
    grassBase: '#694e26',
    grassLight: '#876532',
    grassDark: '#4a3519',
    roadBase: '#9c7350',
    roadBorder: '#573d26',
    waterDeep: '#7f1d1d',
    waterShallow: '#dc2626',
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
    grassBase: '#285943',
    grassLight: '#38785b',
    grassDark: '#1b3d2e',
    roadBase: '#cbd5e1',
    roadBorder: '#64748b',
    waterDeep: '#0369a1',
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
    grassBase: '#241838',
    grassLight: '#352352',
    grassDark: '#160d24',
    roadBase: '#574866',
    roadBorder: '#2e2438',
    waterDeep: '#3b0764',
    waterShallow: '#7e22ce',
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
      trailHistory: Array.from({ length: 28 }, (_, idx) => ({
        x: initialX - (idx + 1) * 2.2,
        y: initialY + (idx % 2) * 1.5,
        facing: 'down' as const
      })),
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
        { id: 'shrine_kyoto', name: '出雲分社・祈福大社', type: 'shrine', x: 240, y: 240, icon: '⛩️', desc: '「神前之鈴清脆作響……誠心參拜大社神木，即可獲得【出雲武運】（全隊全屬性 +15% 並完整記錄冒險卷軸）！」' },
        { id: 'npc_yagyu', name: '柳生劍術道場・嚴信', type: 'npc', x: 430, y: 280, icon: 'npc_yagyu', desc: '「夫兵法之道，在心不在器。練完木刀別忘了去茶屋吃串熱騰騰的三色糰子，張弛有度方為天下無雙！」' },
        { id: 'npc_kaede', name: '破邪巫女・神無月楓', type: 'npc', x: 290, y: 270, icon: 'samurai_female', desc: '「櫻吹雪飄落的洛中城下町最熱鬧了！各地武士團的劍豪都在廣場集結，願神明護佑我們的每一場遠征。」' },
        { id: 'npc_komachi', name: '花見糰子茶屋・小町', type: 'npc', x: 560, y: 520, icon: 'npc_town_girl', desc: '「歡迎光臨花見茶屋！剛烤好的甜醬油糰子跟宇治抹茶香氣四溢，各位武士大人要歇腳恢復氣力嗎？」' },
        { id: 'forge_kunitomo', name: '國友鐵齋・鍛冶工坊', type: 'town', x: 680, y: 280, icon: 'npc_tessai', desc: '「哈哈哈！天外隕鐵與百鍊玉鋼都在爐裡燒得通紅啦！快把名刀交給老夫千錘百鍊！」' },
        { id: 'npc_hayate', name: '鴨川大橋巡守・疾風', type: 'npc', x: 790, y: 490, icon: 'npc_hayate', desc: '「跨過這座朱紅太鼓橋往東就是試刀林，已經有不少【大型多人武士團】的劍士正在東岸討伐鬼眾呢！」' },
        { id: 'chest_kyoto', name: '町民感謝金蒔繪禮匣', type: 'chest', x: 1180, y: 640, icon: '🎁', desc: '洛中街坊為感謝巡守武士而準備的漆金禮匣！' }
      ];
    } else {
      this.state.pois = [
        { id: 'shrine_' + zoneId, name: `${zone.name.split('・')[0]}・祈福大社`, type: 'shrine', x: 250, y: 240, icon: '⛩️', desc: '點著暖光燈籠的靈山大社，參拜可獲【出雲武運】戰力加成並記錄冒險進度！' },
        { id: 'npc_guide_' + zoneId, name: '行腳茶屋・小町', type: 'npc', x: 520, y: 520, icon: 'npc_town_girl', desc: '「遠征辛苦了！在野點傘下喝口熱抹茶、補充行囊道具，再與各路武士一同討伐妖魔吧！」' },
        { id: 'forge_' + zoneId, name: '行軍鍛冶爐・鐵齋', type: 'town', x: 640, y: 280, icon: 'npc_tessai', desc: '「在戰場打到稀有玉鋼胚子？直接交給老夫的野戰熔爐現場鍛造強化！」' },
        { id: 'chest_' + zoneId, name: '古道金蒔繪秘寶箱', type: 'chest', x: 1160, y: 620, icon: '🎁', desc: '藏在古樹下的金蒔繪寶箱，能開出稀世武具！' }
      ];
    }

    // 生成《大型多人武士道列傳》漫遊的線上武士團玩家與町民 (點擊可開大型 TV GAME 對話框切磋／共鬥)
    this.state.townNpcs = [
      {
        id: 'online_musashi_clan',
        name: '緋村拔刀齋',
        guildTag: '【二天一流盟】',
        level: 28,
        spriteId: 'samurai_oni',
        x: 470,
        y: 430,
        originX: 470,
        originY: 430,
        vx: 0.52,
        vy: 0.12,
        facing: 'right',
        walkFrame: 0,
        bubbleText: '🔥 徵求劍豪組隊挑戰常世鬼大將！',
        isOnlinePlayer: true
      },
      {
        id: 'online_shinsengumi',
        name: '沖田總司',
        guildTag: '【新選組一番隊】',
        level: 32,
        spriteId: 'samurai_general',
        x: 640,
        y: 455,
        originX: 640,
        originY: 455,
        vx: -0.48,
        vy: 0.14,
        facing: 'left',
        walkFrame: 1,
        bubbleText: '⚔️ 三段突刺修練中，有人要切磋嗎？',
        isOnlinePlayer: true
      },
      {
        id: 'online_takeda_lord',
        name: '真田幸村',
        guildTag: '【風林火山武士團】',
        level: 35,
        spriteId: 'samurai_lord',
        x: 910,
        y: 440,
        originX: 910,
        originY: 440,
        vx: 0.42,
        vy: -0.15,
        facing: 'right',
        walkFrame: 2,
        bubbleText: '🛡️ 橋東妖氣濃厚，小隊注意架勢相剋！',
        isOnlinePlayer: true
      },
      {
        id: 'online_izumo_miko',
        name: '出雲阿國',
        guildTag: '【出雲神樂眾】',
        level: 26,
        spriteId: 'samurai_female',
        x: 360,
        y: 465,
        originX: 360,
        originY: 465,
        vx: 0.36,
        vy: -0.1,
        facing: 'right',
        walkFrame: 0,
        bubbleText: '🌸 參拜出雲大社有全屬性加持喔～',
        isOnlinePlayer: true
      }
    ];

    this.generateZoneScenery(zone);
    this.buildOffscreenGround(zone);
    this.initParticles(zone);

    // 生成漫遊的妖魔陣列
    this.state.yokaiList = [];
    const monsterConfigs = [
      { name: '貪吃赤面鬼', sprite: 'yokai_oni' },
      { name: '鞍馬小天狗', sprite: 'yokai_tengu' },
      { name: '提燈白狐妖', sprite: 'yokai_kitsune' },
      { name: '羅剎赤鬼眾', sprite: 'yokai_oni' },
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

    for (let lx = 180; lx <= zone.width - 180; lx += 160) {
      if (Math.abs(lx - zone.riverX) < 75) continue;
      props.push({ kind: 'lantern', x: lx, y: 392, scale: 1, variant: 0 });
      props.push({ kind: 'lantern', x: lx, y: 512, scale: 1, variant: 1 });
    }

    const rockCoords = [[190, 370], [710, 590], [960, 370], [1220, 370], [1080, 520]];
    rockCoords.forEach(([rx, ry], idx) => {
      props.push({ kind: 'rock', x: rx, y: ry, scale: 1, variant: idx % 2 });
    });

    this.state.scenery = props;
  }

  private initParticles(zone: MapZoneConfig) {
    this.state.particles = [];
    for (let i = 0; i < 45; i++) {
      this.state.particles.push({
        x: Math.random() * zone.width,
        y: Math.random() * zone.height,
        vx: zone.id === 'fuji' || zone.id === 'yomi' ? (Math.random() - 0.5) * 18 : -18 - Math.random() * 22,
        vy: zone.id === 'fuji' || zone.id === 'yomi' ? -15 - Math.random() * 20 : 16 + Math.random() * 20,
        size: 3.5 + Math.random() * 3.5,
        color: zone.particleColors[i % zone.particleColors.length],
        alpha: 0.65 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  /**
   * 預先繪製 SFC《Final Fantasy VI》＋《武士道列傳》高彩度厚塗質感地貌底圖（非點陣方格）
   */
  private buildOffscreenGround(zone: MapZoneConfig) {
    if (typeof document === 'undefined') return;
    const off = document.createElement('canvas');
    off.width = zone.width;
    off.height = zone.height;
    const g = off.getContext('2d');
    if (!g) return;
    g.imageSmoothingEnabled = true;

    // 1. FF6 風格深邃地表漸層與柔光草甸紋理
    const groundGrad = g.createLinearGradient(0, 76, 0, zone.height);
    groundGrad.addColorStop(0, zone.grassDark);
    groundGrad.addColorStop(0.45, zone.grassBase);
    groundGrad.addColorStop(1, zone.grassDark);
    g.fillStyle = groundGrad;
    g.fillRect(0, 0, zone.width, zone.height);

    // 自然柔和的草地明暗光斑與花叢 (無方塊鋸齒)
    for (let r = 2; r < 28; r++) {
      for (let c = 0; c < 46; c++) {
        const hash = ((c * 73856093) ^ (r * 19349663)) >>> 0;
        const cx = c * 36 + (hash % 18);
        const cy = r * 32 + ((hash >> 3) % 16);

        const patchGrad = g.createRadialGradient(cx, cy, 2, cx, cy, 28 + (hash % 16));
        patchGrad.addColorStop(0, (c + r) % 2 === 0 ? zone.grassLight : zone.grassDark);
        patchGrad.addColorStop(1, 'transparent');
        g.fillStyle = patchGrad;
        g.beginPath();
        g.arc(cx, cy, 32, 0, Math.PI * 2);
        g.fill();

        // 細膩的弧形草葉與落花瓣
        if (hash % 3 === 0) {
          g.strokeStyle = zone.grassLight;
          g.lineWidth = 1.6;
          g.beginPath();
          g.moveTo(cx, cy + 4);
          g.quadraticCurveTo(cx - 4, cy - 3, cx - 6, cy - 6);
          g.moveTo(cx, cy + 4);
          g.quadraticCurveTo(cx + 3, cy - 4, cx + 6, cy - 7);
          g.stroke();
        }

        if (hash % 5 === 0) {
          const flColor = zone.flowerColors[hash % zone.flowerColors.length];
          g.fillStyle = flColor;
          for (let a = 0; a < 5; a++) {
            const ang = (a * Math.PI * 2) / 5;
            g.beginPath();
            g.arc(cx + Math.cos(ang) * 3.2, cy + Math.sin(ang) * 3.2, 2.0, 0, Math.PI * 2);
            g.fill();
          }
          g.fillStyle = '#fef08a';
          g.beginPath();
          g.arc(cx, cy, 1.5, 0, Math.PI * 2);
          g.fill();
        }
      }
    }

    // 2. 遠景 FF6 浮世繪山巒天際線
    this.drawHorizonVista(g, zone);

    // 3. 繪製立體石疊廣場與東海道石板街道網
    this.drawCobblestoneRect(g, 380, 290, 340, 260, zone.roadBase, zone.roadBorder);
    this.drawCobblestoneRect(g, 40, 405, zone.width - 80, 90, zone.roadBase, zone.roadBorder);
    this.drawSteppingStones(g, 240, 405, 240, 230);
    this.drawSteppingStones(g, 430, 320, 430, 270);
    this.drawSteppingStones(g, 660, 320, 660, 270);
    this.drawSteppingStones(g, 1160, 495, 1160, 630);

    // 4. 繪製流暢曲折的溪流與鵝卵石護岸
    const rx = zone.riverX;
    for (let y = 76; y < zone.height; y += 8) {
      const waveOffset = Math.sin(y * 0.015) * 18;
      const curRx = rx + waveOffset;

      const waterGrad = g.createLinearGradient(curRx - 42, y, curRx + 42, y);
      waterGrad.addColorStop(0, '#475569');
      waterGrad.addColorStop(0.14, zone.waterShallow);
      waterGrad.addColorStop(0.5, zone.waterDeep);
      waterGrad.addColorStop(0.86, zone.waterShallow);
      waterGrad.addColorStop(1, '#475569');
      g.fillStyle = waterGrad;
      g.fillRect(curRx - 42, y, 84, 9);

      // 河岸圓潤岩石
      if (y % 24 === 0) {
        g.fillStyle = '#64748b';
        g.beginPath();
        g.ellipse(curRx - 42, y + 4, 7, 5, 0, 0, Math.PI * 2);
        g.ellipse(curRx + 42, y + 4, 7, 5, 0, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = '#94a3b8';
        g.beginPath();
        g.ellipse(curRx - 43, y + 2, 4, 2.5, 0, 0, Math.PI * 2);
        g.ellipse(curRx + 41, y + 2, 4, 2.5, 0, 0, Math.PI * 2);
        g.fill();
      }
    }

    // 5. 繪製橫跨河川的《武士道列傳》朱紅拱形太鼓橋
    this.drawTaikoBridge(g, rx + Math.sin(450 * 0.015) * 18, 400, 132, 100);

    this.groundCanvas = off;
  }

  private drawHorizonVista(g: CanvasRenderingContext2D, zone: MapZoneConfig) {
    const h = 80;
    const skyGrad = g.createLinearGradient(0, 0, 0, h);
    if (zone.id === 'fuji') {
      skyGrad.addColorStop(0, '#2a0808');
      skyGrad.addColorStop(0.5, '#7f1d1d');
      skyGrad.addColorStop(1, '#ea580c');
    } else if (zone.id === 'yomi') {
      skyGrad.addColorStop(0, '#090314');
      skyGrad.addColorStop(0.5, '#2e1065');
      skyGrad.addColorStop(1, '#6b21a8');
    } else {
      skyGrad.addColorStop(0, '#091128');
      skyGrad.addColorStop(0.55, '#1e3a8a');
      skyGrad.addColorStop(1, '#38bdf8');
    }
    g.fillStyle = skyGrad;
    g.fillRect(0, 0, zone.width, h);

    // 柔光圓月／夕陽
    const sunX = zone.width * 0.25;
    const sunGrad = g.createRadialGradient(sunX, 28, 4, sunX, 28, 38);
    sunGrad.addColorStop(0, '#fef08a');
    sunGrad.addColorStop(0.4, 'rgba(251, 191, 36, 0.45)');
    sunGrad.addColorStop(1, 'transparent');
    g.fillStyle = sunGrad;
    g.beginPath();
    g.arc(sunX, 28, 38, 0, Math.PI * 2);
    g.fill();

    // 遠景連綿山脈剪影
    g.fillStyle = zone.id === 'fuji' ? '#450a0a' : '#0f172a';
    g.beginPath();
    g.moveTo(0, h);
    for (let x = 0; x <= zone.width; x += 20) {
      const m = Math.sin(x * 0.005) * 20 + Math.cos(x * 0.012) * 12;
      g.lineTo(x, 48 - m);
    }
    g.lineTo(zone.width, h);
    g.closePath();
    g.fill();

    // 壯麗富士山流線型山體與白雪冠頂
    const fx = zone.width * 0.52;
    const fujiGrad = g.createLinearGradient(fx, 12, fx, h);
    fujiGrad.addColorStop(0, '#ffffff');
    fujiGrad.addColorStop(0.32, '#e2e8f0');
    fujiGrad.addColorStop(0.38, zone.id === 'fuji' ? '#dc2626' : '#2563eb');
    fujiGrad.addColorStop(1, zone.id === 'fuji' ? '#450a0a' : '#0f172a');
    g.fillStyle = fujiGrad;
    g.beginPath();
    g.moveTo(fx - 18, 14);
    g.lineTo(fx + 18, 14);
    g.quadraticCurveTo(fx + 55, 52, fx + 150, h);
    g.lineTo(fx - 150, h);
    g.quadraticCurveTo(fx - 55, 52, fx - 18, 14);
    g.closePath();
    g.fill();

    // 城郭石垣邊界
    const wallGrad = g.createLinearGradient(0, h - 8, 0, h);
    wallGrad.addColorStop(0, '#475569');
    wallGrad.addColorStop(1, '#1e293b');
    g.fillStyle = wallGrad;
    g.fillRect(0, h - 8, zone.width, 8);
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
    g.save();
    g.fillStyle = borderColor;
    g.beginPath();
    g.roundRect(x - 5, y - 5, w + 10, h + 10, 10);
    g.fill();

    const rdGrad = g.createLinearGradient(x, y, x, y + h);
    rdGrad.addColorStop(0, baseColor);
    rdGrad.addColorStop(0.5, '#d6c3a5');
    rdGrad.addColorStop(1, baseColor);
    g.fillStyle = rdGrad;
    g.beginPath();
    g.roundRect(x, y, w, h, 8);
    g.fill();

    // 圓潤石板紋理
    const brickW = 28;
    const brickH = 18;
    for (let by = y + 4; by < y + h - 8; by += brickH) {
      const rowOffset = ((Math.floor(by / brickH)) % 2) * 14;
      for (let bx = x + 4 + rowOffset; bx < x + w - 24; bx += brickW) {
        const hash = ((bx * 31) ^ (by * 17)) & 7;
        g.fillStyle = hash % 2 === 0 ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)';
        g.strokeStyle = 'rgba(68, 51, 34, 0.25)';
        g.lineWidth = 1;
        g.beginPath();
        g.roundRect(bx, by, brickW - 3, brickH - 3, 4);
        g.fill();
        g.stroke();
      }
    }
    g.restore();
  }

  private drawSteppingStones(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    const steps = Math.max(4, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 24));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const sx = x1 + (x2 - x1) * t;
      const sy = y1 + (y2 - y1) * t;
      g.fillStyle = '#475569';
      g.beginPath();
      g.ellipse(sx, sy + 2, 13, 8, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#cbd5e1';
      g.beginPath();
      g.ellipse(sx, sy, 11, 6.5, 0, 0, Math.PI * 2);
      g.fill();
    }
  }

  private drawTaikoBridge(g: CanvasRenderingContext2D, centerX: number, topY: number, width: number, height: number) {
    const left = centerX - width / 2;
    g.save();
    // 橋身弧形陰影
    g.fillStyle = 'rgba(0, 0, 0, 0.35)';
    g.beginPath();
    g.roundRect(left - 4, topY + 6, width + 8, height, 8);
    g.fill();

    // 檜木拱橋橋面漸層
    const woodGrad = g.createLinearGradient(left, topY, left + width, topY);
    woodGrad.addColorStop(0, '#78350f');
    woodGrad.addColorStop(0.5, '#b45309');
    woodGrad.addColorStop(1, '#78350f');
    g.fillStyle = woodGrad;
    g.beginPath();
    g.roundRect(left, topY, width, height, 6);
    g.fill();

    // 木板接縫
    g.strokeStyle = 'rgba(69, 26, 3, 0.45)';
    g.lineWidth = 1.5;
    for (let bx = left + 10; bx < left + width - 6; bx += 10) {
      g.beginPath();
      g.moveTo(bx, topY + 8);
      g.lineTo(bx, topY + height - 8);
      g.stroke();
    }

    // 朱紅漆塗欄杆與黃金擬寶珠
    const railGrad = g.createLinearGradient(left, topY, left, topY + 12);
    railGrad.addColorStop(0, '#ef4444');
    railGrad.addColorStop(1, '#991b1b');
    g.fillStyle = railGrad;
    g.beginPath();
    g.roundRect(left - 4, topY - 2, width + 8, 12, 4);
    g.roundRect(left - 4, topY + height - 10, width + 8, 12, 4);
    g.fill();

    const posts = [left + 2, left + width * 0.33, left + width * 0.66, left + width - 8];
    for (const px of posts) {
      g.fillStyle = '#b91c1c';
      g.fillRect(px, topY - 8, 8, 16);
      g.fillRect(px, topY + height - 14, 8, 16);
      g.fillStyle = '#fbbf24';
      g.beginPath();
      g.arc(px + 4, topY - 9, 4.5, 0, Math.PI * 2);
      g.arc(px + 4, topY + height - 15, 4.5, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
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
        if (dist <= 52) {
          if (this.onInteractPOICallback) this.onInteractPOICallback(poi);
          this.state.targetX = poi.x;
          this.state.targetY = poi.y + 24;
          return;
        }
      }

      // 點擊《大型多人武士道列傳》線上武士玩家可開啟大型 TV GAME 對話框互動／切磋／共鬥
      for (const wn of this.state.townNpcs) {
        const dist = Math.hypot(worldX - wn.x, worldY - (wn.y - 16));
        if (dist <= 48 && this.onInteractPOICallback) {
          this.onInteractPOICallback({
            id: wn.id,
            name: `${wn.guildTag || ''}Lv.${wn.level || 25} ${wn.name}`,
            type: 'npc',
            x: wn.x,
            y: wn.y,
            icon: wn.spriteId,
            desc: `「${wn.bubbleText} 閣下也是修習《五輪書》的劍豪嗎？要與在下一同結伴助陣，或是拔刀切磋武藝？」`
          });
          this.state.targetX = wn.x;
          this.state.targetY = wn.y + 20;
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
    const moveSpeed = 235;
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
      const head = this.state.trailHistory[0];
      if (!head || Math.hypot(this.state.playerX - head.x, this.state.playerY - head.y) >= 4) {
        this.state.trailHistory.unshift({
          x: this.state.playerX,
          y: this.state.playerY,
          facing: this.state.facing
        });
        if (this.state.trailHistory.length > 32) {
          this.state.trailHistory.pop();
        }
      }
    } else {
      this.state.walkFrame = 0;
    }

    for (const npc of this.state.townNpcs) {
      npc.x += npc.vx;
      npc.y += npc.vy;
      npc.walkFrame = (npc.walkFrame + dt * 4) % 4;
      npc.facing = npc.vx >= 0 ? 'right' : 'left';
      if (Math.hypot(npc.x - npc.originX, npc.y - npc.originY) > 75) {
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

    for (const pt of this.state.particles) {
      pt.x += pt.vx * dt + Math.sin(now * 0.002 + pt.phase) * 0.35;
      pt.y += pt.vy * dt;
      if (pt.x < 0) pt.x = curZone.width;
      if (pt.x > curZone.width) pt.x = 0;
      if (pt.y < 80) pt.y = curZone.height;
      if (pt.y > curZone.height) pt.y = 85;
    }

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
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, w, h);

    // 1. 繪製高解析度厚塗地貌底圖
    if (this.groundCanvas) {
      ctx.drawImage(this.groundCanvas, camX, camY, w, h, 0, 0, w, h);
    } else {
      ctx.fillStyle = curZone.grassBase;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. 動態河水波光與悠游錦鯉
    this.renderAnimatedRiverDetails(ctx, curZone, camX, camY, w, h, now);

    // 3. 繪製地標和風建築群 (流線飛簷瓦頂)
    for (const poi of this.state.pois) {
      const px = poi.x - camX;
      const py = poi.y - camY;
      if (px < -160 || px > w + 160 || py < -160 || py > h + 160) continue;
      this.renderPOIArchitecture(ctx, poi, px, py, now);
    }

    // 4. 繪製場景樹木、竹林、楓樹與石燈籠
    for (const prop of this.state.scenery) {
      const sx = prop.x - camX;
      const sy = prop.y - camY;
      if (sx < -100 || sx > w + 100 || sy < -100 || sy > h + 100) continue;
      this.renderSceneryProp(ctx, prop, sx, sy, now);
    }

    // 5. 繪製目標尋路指示光圈
    if (this.state.targetX !== null && this.state.targetY !== null) {
      const tx = this.state.targetX - camX;
      const ty = this.state.targetY - camY;
      const pulse = 13 + Math.sin(now * 0.008) * 3;
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

    // 6. 繪製 POI 的流暢角色與名稱牌
    for (const poi of this.state.pois) {
      const px = poi.x - camX;
      const py = poi.y - camY;
      if (px < -100 || px > w + 100 || py < -100 || py > h + 100) continue;

      ctx.beginPath();
      ctx.ellipse(px, py + 3, 22, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = poi.type === 'shrine'
        ? 'rgba(239, 68, 68, 0.35)'
        : poi.type === 'chest'
        ? 'rgba(250, 204, 21, 0.4)'
        : 'rgba(56, 189, 248, 0.32)';
      ctx.fill();

      if (poi.type === 'npc' || poi.type === 'town') {
        drawChibiSprite(ctx, poi.icon, px, py + 4, 2.15, 'down', 0);
      }

      ctx.font = 'bold 12px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      const textW = ctx.measureText(poi.name).width + 16;
      ctx.fillStyle = 'rgba(10, 20, 52, 0.92)';
      ctx.beginPath();
      ctx.roundRect(px - textW / 2, py + 8, textW, 20, 5);
      ctx.fill();
      ctx.strokeStyle = poi.type === 'chest' ? '#facc15' : '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = poi.type === 'chest' ? '#fde047' : '#ffffff';
      ctx.fillText(poi.name, px, py + 22);
    }

    // 7. 繪製《大型多人武士道列傳》漫遊的線上武士玩家與即時聊天氣泡
    for (const wn of this.state.townNpcs) {
      const nx = wn.x - camX;
      const ny = wn.y - camY;
      if (nx < -90 || nx > w + 90 || ny < -90 || ny > h + 90) continue;

      // 線上武士光環
      ctx.beginPath();
      ctx.ellipse(nx, ny + 3, 18, 6.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
      ctx.fill();

      drawChibiSprite(ctx, wn.spriteId, nx, ny + 2, 2.1, wn.facing, wn.walkFrame);

      // 線上武士團名牌
      const titleStr = `${wn.guildTag || ''}Lv.${wn.level || 25} ${wn.name}`;
      ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      const tw = ctx.measureText(titleStr).width + 12;
      ctx.fillStyle = 'rgba(8, 22, 56, 0.9)';
      ctx.beginPath();
      ctx.roundRect(nx - tw / 2, ny + 7, tw, 17, 4);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#7dd3fc';
      ctx.fillText(titleStr, nx, ny + 19);

      // 頭頂即時對話氣泡
      ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
      const bw = ctx.measureText(wn.bubbleText).width + 14;
      ctx.fillStyle = 'rgba(15, 28, 68, 0.92)';
      ctx.beginPath();
      ctx.roundRect(nx - bw / 2, ny - 68, bw, 19, 6);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.fillText(wn.bubbleText, nx, ny - 55);
    }

    // 8. 繪製漫遊妖魔
    for (const yk of this.state.yokaiList) {
      const yx = yk.x - camX;
      const yy = yk.y - camY;
      if (yx < -80 || yx > w + 80 || yy < -80 || yy > h + 80) continue;

      const scale = yk.isBoss ? 2.6 : 2.15;
      const spriteH = 26 * scale;

      ctx.beginPath();
      ctx.ellipse(yx, yy + 3, 20, 7.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.state.activeCombatYokaiId === yk.id ? 'rgba(239, 68, 68, 0.65)' : 'rgba(0,0,0,0.45)';
      ctx.fill();

      const ykFacing = yk.vx < 0 ? 'left' : 'right';
      drawChibiSprite(ctx, yk.avatar, yx, yy + 2, scale, ykFacing, (now / 220) % 2);

      const barW = 54;
      const barH = 6;
      const hpPct = Math.max(0, Math.min(1, yk.hp / yk.maxHp));
      const barY = yy - spriteH - 8;
      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(yx - barW / 2 - 1, barY - 1, barW + 2, barH + 2);
      ctx.fillStyle = yk.isBoss ? '#ef4444' : '#f59e0b';
      ctx.fillRect(yx - barW / 2, barY, barW * hpPct, barH);

      ctx.font = 'bold 12px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#090d16';
      ctx.fillText(`Lv.${yk.level} ${yk.name}`, yx + 1, barY - 4);
      ctx.fillStyle = yk.isBoss ? '#fca5a5' : '#fef08a';
      ctx.fillText(`Lv.${yk.level} ${yk.name}`, yx, barY - 5);
    }

    // 9. 繪製《新武士道列傳》三人同行小隊：夥伴【影縫疾風】、【神無月楓】排隊跟隨主角行走
    const hayatePos = this.state.trailHistory[Math.min(20, this.state.trailHistory.length - 1)];
    const kaedePos = this.state.trailHistory[Math.min(10, this.state.trailHistory.length - 1)];

    if (hayatePos) {
      const hx = hayatePos.x - camX;
      const hy = hayatePos.y - camY;
      ctx.beginPath();
      ctx.ellipse(hx, hy + 3, 16, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.32)';
      ctx.fill();
      drawChibiSprite(ctx, 'npc_hayate', hx, hy + 3, 2.15, hayatePos.facing, this.state.isWalking ? (this.state.walkFrame + 2) % 4 : 0);
    }

    if (kaedePos) {
      const kx = kaedePos.x - camX;
      const ky = kaedePos.y - camY;
      ctx.beginPath();
      ctx.ellipse(kx, ky + 3, 16, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(244, 63, 94, 0.32)';
      ctx.fill();
      drawChibiSprite(ctx, 'samurai_female', kx, ky + 3, 2.15, kaedePos.facing, this.state.isWalking ? (this.state.walkFrame + 1) % 4 : 0);
    }

    // 繪製領隊主角 (Player Leader)
    const px = this.state.playerX - camX;
    const py = this.state.playerY - camY;

    ctx.beginPath();
    ctx.ellipse(px, py + 3, 22, 8.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
    ctx.fill();

    drawChibiSprite(
      ctx,
      this.state.playerAvatar,
      px,
      py + 3,
      2.25,
      this.state.facing,
      this.state.isWalking ? this.state.walkFrame : 0
    );

    ctx.font = 'bold 12px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    const label = `【${this.state.playerTitle}】${this.state.playerName}`;
    const lw = ctx.measureText(label).width + 16;
    ctx.fillStyle = 'rgba(10, 22, 58, 0.94)';
    ctx.beginPath();
    ctx.roundRect(px - lw / 2, py - 70, lw, 20, 5);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.fillText(label, px, py - 56);

    // 10. 繪製拔刀斬擊三日月刀光特效
    this.renderSlashEffects(ctx, camX, camY, now);

    // 11. 繪製前景飄落櫻花瓣／竹葉／楓葉粒子
    for (const pt of this.state.particles) {
      const sx = pt.x - camX;
      const sy = pt.y - camY;
      if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.ellipse(sx, sy, pt.size, pt.size * 0.65, pt.phase, 0, Math.PI * 2);
      ctx.fill();
    }

    // 12. SFC《FF6》招牌深邃暗角光影 (Atmospheric Vignette)
    const vig = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.35, w * 0.5, h * 0.5, Math.max(w, h) * 0.72);
    vig.addColorStop(0, 'transparent');
    vig.addColorStop(1, 'rgba(3, 7, 18, 0.42)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, w, h);

    // 13. 繪製左上角 FF6 皇家藍名牌與右上角雷達小地圖
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
      if (y > 395 && y < 505) continue;
      const waveOffset = Math.sin(y * 0.015) * 18;
      const sx = rx + waveOffset - camX;
      const sy = y - camY;
      if (sx < -50 || sx > w + 50 || sy < -20 || sy > h + 20) continue;

      const shimmerX = Math.sin(now * 0.004 + y) * 10;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx - 14 + shimmerX, sy);
      ctx.quadraticCurveTo(sx - 4 + shimmerX, sy - 2, sx + 4 + shimmerX, sy);
      ctx.stroke();

      if (y % 108 === 0 && zone.id !== 'yomi' && zone.id !== 'fuji') {
        const koiX = sx + Math.sin(now * 0.002 + y) * 14;
        const koiY = sy + 8 + Math.cos(now * 0.002 + y) * 4;
        ctx.fillStyle = (y / 108) % 2 === 0 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(koiX, koiY, 4.5, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * 繪製流線型飛簷瓦頂與高立體感和風建築
   */
  private renderPOIArchitecture(ctx: CanvasRenderingContext2D, poi: MapPOI, px: number, py: number, now: number) {
    ctx.save();
    if (poi.type === 'shrine') {
      const topY = py - 78;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px - 35, py - 8, 12, 8);
      ctx.fillRect(px + 23, py - 8, 12, 8);

      const pillarGrad = ctx.createLinearGradient(px - 32, topY, px - 22, topY);
      pillarGrad.addColorStop(0, '#991b1b');
      pillarGrad.addColorStop(0.5, '#ef4444');
      pillarGrad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(px - 32, topY + 12, 9, 58);
      ctx.fillRect(px + 23, topY + 12, 9, 58);

      // 流線飛簷上樑 (Curved Kasagi Roof Beam)
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.moveTo(px - 54, topY - 3);
      ctx.quadraticCurveTo(px, topY + 5, px + 54, topY - 3);
      ctx.lineTo(px + 48, topY + 6);
      ctx.quadraticCurveTo(px, topY + 11, px - 48, topY + 6);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(px - 44, topY + 6, 88, 6);
      ctx.fillRect(px - 38, topY + 21, 76, 6);

      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px - 7, topY + 10, 14, 13);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(px - 4, topY + 12, 8, 9);
    } else if (poi.id.includes('komachi') || poi.id.includes('guide')) {
      const bx = px - 54;
      const by = py - 74;
      // 飛簷瓦頂
      const roofGrad = ctx.createLinearGradient(bx, by, bx, by + 24);
      roofGrad.addColorStop(0, '#0f172a');
      roofGrad.addColorStop(1, '#334155');
      ctx.fillStyle = roofGrad;
      ctx.beginPath();
      ctx.moveTo(bx + 12, by);
      ctx.lineTo(bx + 96, by);
      ctx.quadraticCurveTo(bx + 108, by + 16, bx + 116, by + 22);
      ctx.lineTo(bx - 8, by + 22);
      ctx.quadraticCurveTo(bx, by + 16, bx + 12, by);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.fillRect(bx + 4, by + 22, 100, 38);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(bx + 10, by + 26, 88, 30);

      // 紅色茶屋暖簾
      ctx.fillStyle = '#be123c';
      for (const nx of [bx + 14, bx + 42, bx + 70]) {
        ctx.beginPath();
        ctx.roundRect(nx, by + 24, 24, 21, 3);
        ctx.fill();
      }
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('茶', bx + 26, by + 39);
      ctx.fillText('糰', bx + 54, by + 39);
      ctx.fillText('子', bx + 82, by + 39);

      // 圓弧紅野點傘
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 51, py - 52, 3, 40);
      const umbGrad = ctx.createRadialGradient(px + 52, py - 58, 2, px + 52, py - 52, 24);
      umbGrad.addColorStop(0, '#f87171');
      umbGrad.addColorStop(1, '#b91c1c');
      ctx.fillStyle = umbGrad;
      ctx.beginPath();
      ctx.arc(px + 52, py - 48, 22, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    } else if (poi.id.includes('yagyu')) {
      const bx = px - 58;
      const by = py - 80;
      const roofGrad = ctx.createLinearGradient(bx, by, bx, by + 26);
      roofGrad.addColorStop(0, '#090d16');
      roofGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = roofGrad;
      ctx.beginPath();
      ctx.moveTo(bx + 14, by);
      ctx.lineTo(bx + 106, by);
      ctx.quadraticCurveTo(bx + 118, by + 18, bx + 126, by + 25);
      ctx.lineTo(bx - 6, by + 25);
      ctx.quadraticCurveTo(bx + 2, by + 18, bx + 14, by);
      ctx.closePath();
      ctx.fill();

      // 黃金鯱鉾
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(bx + 14, by - 3, 4, 0, Math.PI * 2);
      ctx.arc(bx + 106, by - 3, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(bx + 8, by + 25, 104, 38);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(bx + 40, by + 30, 40, 33);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('柳生新陰流道場', px, by + 18);
    } else if (poi.type === 'town') {
      const bx = px - 50;
      const by = py - 74;
      ctx.fillStyle = '#18181b';
      ctx.beginPath();
      ctx.roundRect(bx - 4, by, 108, 22, 5);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.fillRect(bx + 2, by + 22, 96, 36);
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(bx + 10, by + 26, 36, 30);
      const fireFlicker = Math.sin(now * 0.015) > 0 ? '#f97316' : '#facc15';
      ctx.fillStyle = fireFlicker;
      ctx.beginPath();
      ctx.arc(bx + 28, by + 46, 11, Math.PI, Math.PI * 2);
      ctx.fill();
    } else if (poi.type === 'chest') {
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(px - 17, py - 24, 34, 22, 4);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px - 4, py - 16, 8, 8);
    }
    ctx.restore();
  }

  private renderSceneryProp(ctx: CanvasRenderingContext2D, prop: SceneryProp, sx: number, sy: number, now: number) {
    ctx.save();
    if (prop.kind === 'lantern') {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(sx - 6, sy - 4, 12, 4);
      ctx.fillRect(sx - 4, sy - 22, 8, 18);
      ctx.beginPath();
      ctx.moveTo(sx - 10, sy - 22);
      ctx.lineTo(sx, sy - 30);
      ctx.lineTo(sx + 10, sy - 22);
      ctx.closePath();
      ctx.fill();

      const glow = 20 + Math.sin(now * 0.006 + prop.x) * 4;
      const lg = ctx.createRadialGradient(sx, sy - 18, 2, sx, sy - 18, glow);
      lg.addColorStop(0, 'rgba(253, 224, 71, 0.85)');
      lg.addColorStop(0.4, 'rgba(251, 191, 36, 0.28)');
      lg.addColorStop(1, 'transparent');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.arc(sx, sy - 18, glow, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    if (prop.kind === 'rock') {
      const rg = ctx.createRadialGradient(sx - 4, sy - 12, 2, sx, sy - 8, 18);
      rg.addColorStop(0, '#94a3b8');
      rg.addColorStop(0.6, '#64748b');
      rg.addColorStop(1, '#334155');
      ctx.fillStyle = rg;
      ctx.beginPath();
      ctx.ellipse(sx, sy - 7, 16, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    if (prop.kind === 'bamboo') {
      for (const offset of [-10, 0, 10]) {
        const bx = sx + offset;
        const bg = ctx.createLinearGradient(bx - 3, sy - 64, bx + 3, sy - 64);
        bg.addColorStop(0, '#14532d');
        bg.addColorStop(0.5, '#4ade80');
        bg.addColorStop(1, '#15803d');
        ctx.fillStyle = bg;
        ctx.fillRect(bx - 3, sy - 64, 6, 64);
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(bx, sy - 68, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    // 樹幹陰影與流暢樹幹
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2, 24, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    const trunkGrad = ctx.createLinearGradient(sx - 7, sy - 40, sx + 7, sy);
    trunkGrad.addColorStop(0, '#78350f');
    trunkGrad.addColorStop(1, '#3b1502');
    ctx.fillStyle = trunkGrad;
    ctx.beginPath();
    ctx.moveTo(sx - 8, sy);
    ctx.quadraticCurveTo(sx - 5, sy - 20, sx - 6, sy - 42);
    ctx.lineTo(sx + 6, sy - 42);
    ctx.quadraticCurveTo(sx + 5, sy - 20, sx + 8, sy);
    ctx.closePath();
    ctx.fill();

    if (prop.kind === 'dead_tree') {
      ctx.fillStyle = '#a855f7';
      ctx.beginPath();
      ctx.arc(sx - 16, sy - 48, 7, 0, Math.PI * 2);
      ctx.arc(sx + 16, sy - 52, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    const canopyColors = prop.kind === 'sakura'
      ? ['#be185d', '#f472b6', '#fce7f3']
      : prop.kind === 'maple'
      ? ['#7f1d1d', '#dc2626', '#fb923c']
      : prop.kind === 'ginkgo'
      ? ['#b45309', '#f59e0b', '#fef08a']
      : ['#064e3b', '#15803d', '#4ade80'];

    // 圓潤多層次厚塗樹冠 (Painterly Spherical Canopy Clusters)
    const clusters = [
      { dx: -18, dy: -52, r: 20 },
      { dx: 18, dy: -52, r: 20 },
      { dx: 0, dy: -66, r: 24 },
      { dx: -10, dy: -58, r: 18 },
      { dx: 10, dy: -58, r: 18 }
    ];

    for (const c of clusters) {
      const cg = ctx.createRadialGradient(
        sx + c.dx - c.r * 0.25,
        sy + c.dy - c.r * 0.25,
        c.r * 0.1,
        sx + c.dx,
        sy + c.dy,
        c.r
      );
      cg.addColorStop(0, canopyColors[2]);
      cg.addColorStop(0.55, canopyColors[1]);
      cg.addColorStop(1, canopyColors[0]);
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(sx + c.dx, sy + c.dy, c.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
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
        ctx.font = 'bold 16px "Noto Sans TC", sans-serif';
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
    // 1. 左上角 SFC FF6 皇家漸層藍地名視窗
    const bannerGrad = ctx.createLinearGradient(12, 12, 12, 60);
    bannerGrad.addColorStop(0, 'rgba(18, 42, 114, 0.94)');
    bannerGrad.addColorStop(1, 'rgba(6, 15, 46, 0.96)');
    ctx.fillStyle = bannerGrad;
    ctx.beginPath();
    ctx.roundRect(12, 12, 260, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, 254, 42);

    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 14px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🏮 ${zone.name}`, 24, 33);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '11px "Noto Sans TC", sans-serif';
    ctx.fillText(`${zone.subtitle}（線上武士：${this.state.townNpcs.length + 1} 人）`, 24, 51);

    // 2. 右上角全彩雷達小地圖
    const mw = 136;
    const mh = 86;
    const mx = w - mw - 14;
    const my = 12;

    ctx.fillStyle = 'rgba(8, 18, 48, 0.92)';
    ctx.beginPath();
    ctx.roundRect(mx - 3, my - 3, mw + 6, mh + 6, 6);
    ctx.fill();
    ctx.fillStyle = zone.grassDark;
    ctx.fillRect(mx, my, mw, mh);

    const scaleX = mw / zone.width;
    const scaleY = mh / zone.height;
    ctx.fillStyle = zone.roadBase;
    ctx.fillRect(mx + 4, my + Math.round(405 * scaleY), mw - 8, Math.max(4, Math.round(90 * scaleY)));
    ctx.fillStyle = zone.waterShallow;
    ctx.fillRect(mx + Math.round(zone.riverX * scaleX) - 2, my, 5, mh);

    for (const p of this.state.pois) {
      ctx.fillStyle = p.type === 'shrine' ? '#ef4444' : p.type === 'chest' ? '#facc15' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(mx + p.x * scaleX, my + p.y * scaleY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const wn of this.state.townNpcs) {
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(mx + wn.x * scaleX, my + wn.y * scaleY, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const yk of this.state.yokaiList) {
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(mx + yk.x * scaleX, my + yk.y * scaleY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(mx + this.state.playerX * scaleX, my + this.state.playerY * scaleY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(mx - 2, my - 2, mw + 4, mh + 4);
  }
}
