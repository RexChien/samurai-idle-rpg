import type { MapPOI, MapYokai } from '../types/game';
import { drawChibiSprite } from './pixelSprites';

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
  activeCombatYokaiId: string | null;
  encounterCooldownUntil: number;
  cameraX: number;
  cameraY: number;
}

export const MAP_ZONES = [
  { id: 'kyoto', name: '京都・洛中城下町', width: 1400, height: 900, bgTheme: '#1e2430', groundColor: '#36322b', pathColor: '#594e3f', isSafeTown: true },
  { id: 'kurama', name: '鞍馬山・天狗靈峰', width: 1400, height: 900, bgTheme: '#0f1f1a', groundColor: '#1d3329', pathColor: '#364d3f', isSafeTown: false },
  { id: 'tokaido', name: '東海道・荒涼驛道', width: 1600, height: 900, bgTheme: '#1f1b17', groundColor: '#362f27', pathColor: '#4d4235', isSafeTown: false },
  { id: 'fuji', name: '富士山麓・赤富士戰場', width: 1500, height: 900, bgTheme: '#261214', groundColor: '#3b1c1e', pathColor: '#54282a', isSafeTown: false },
  { id: 'nikko', name: '日光・輪王神域', width: 1500, height: 900, bgTheme: '#1a1824', groundColor: '#282436', pathColor: '#3d384f', isSafeTown: false },
  { id: 'yomi', name: '常世狹縫・無間冥土', width: 1600, height: 900, bgTheme: '#170b1f', groundColor: '#281433', pathColor: '#422054', isSafeTown: false }
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
  public state: WorldMapState;
  private animId: number = 0;
  private lastTime: number = 0;
  private onEncounterCallback?: (yokai: MapYokai) => void;
  private onInteractPOICallback?: (poi: MapPOI) => void;
  private keysDown: Record<string, boolean> = {};

  constructor(
    canvas: HTMLCanvasElement,
    initialX = 350,
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

  public initZone(zoneId: string) {
    this.state.currentZoneId = zoneId;
    this.state.activeCombatYokaiId = null;
    const zone = MAP_ZONES.find(z => z.id === zoneId) || MAP_ZONES[0];

    this.state.townNpcs = [];

    if (zoneId === 'kyoto') {
      // 京都城下町：熱鬧溫馨的市井地標與像素 NPC
      this.state.pois = [
        { id: 'shrine_kyoto', name: '出雲分社・祈福鳥居', type: 'shrine', x: 240, y: 230, icon: '⛩️', desc: '參拜神木可獲得【出雲武運】祝福（全屬性戰力 +15%，持續 5 分鐘）！' },
        { id: 'npc_yagyu', name: '師尊・柳生嚴信', type: 'npc', x: 430, y: 310, icon: 'npc_yagyu', desc: '「練完木刀別忘了去茶屋吃串熱騰騰的三色糰子，張弛有度才是劍聖之道！」' },
        { id: 'npc_kaede', name: '神女・神無月楓', type: 'npc', x: 630, y: 290, icon: 'samurai_female', desc: '「今晚洛中點起了祈福紅燈籠，看到大家臉上的笑容，心裡就暖洋洋的呢。」' },
        { id: 'npc_komachi', name: '花見糰子茶屋・小町', type: 'npc', x: 540, y: 510, icon: 'npc_town_girl', desc: '「歡迎光臨！剛烤好的醬油糰子跟宇治抹茶，武士大人要來一份嗎？」' },
        { id: 'forge_kunitomo', name: '國友鐵齋・鍛造工坊', type: 'town', x: 820, y: 340, icon: 'npc_tessai', desc: '「哈哈哈！天外隕鐵與百鍊玉鋼都在爐裡燒紅啦，快來打造傳奇神兵！」' },
        { id: 'npc_hayate', name: '巡守・影縫疾風', type: 'npc', x: 960, y: 490, icon: 'npc_hayate', desc: '「城裡孩子們託我折的彩色紙風車已經分完囉，要切磋暗器或前往道場練習場請往東走。」' },
        { id: 'chest_kyoto', name: '町民感謝禮匣', type: 'chest', x: 1120, y: 620, icon: '🎁', desc: '洛中街坊為感謝巡守武士而準備的漆金禮匣！' }
      ];

      // 城下町悠閒散步的 3頭身像素町民
      this.state.townNpcs = [
        {
          id: 'wander_1',
          name: '賞花町娘・阿綾',
          spriteId: 'npc_town_girl',
          x: 480,
          y: 440,
          originX: 480,
          originY: 440,
          vx: 0.45,
          vy: 0.1,
          facing: 'right',
          walkFrame: 0,
          bubbleText: '🍡 糰子真香～'
        },
        {
          id: 'wander_2',
          name: '道場門生・新八',
          spriteId: 'samurai_general',
          x: 720,
          y: 460,
          originX: 720,
          originY: 460,
          vx: -0.4,
          vy: 0.15,
          facing: 'left',
          walkFrame: 1,
          bubbleText: '⚔️ 今日木刀百振達成！'
        }
      ];
    } else {
      this.state.pois = [
        { id: 'shrine_' + zoneId, name: '路旁祈福鳥居', type: 'shrine', x: 250, y: 230, icon: '⛩️', desc: '點著暖光燈籠的旅途鳥居，參拜可獲【出雲武運】戰力加成！' },
        { id: 'npc_guide_' + zoneId, name: '行腳茶商・小町', type: 'npc', x: 420, y: 480, icon: 'npc_town_girl', desc: '「走累了嗎？喝口熱茶再繼續跟妖怪們切磋吧！」' },
        { id: 'chest_' + zoneId, name: '古道秘寶箱', type: 'chest', x: 1050, y: 600, icon: '🎁', desc: '藏在古樹下的金蒔繪寶箱，能開出稀世武具！' }
      ];
    }

    // 生成漫遊的 3頭身像素妖怪（京都放在東側道場試刀林，讓城中心保持安全輕鬆）
    this.state.yokaiList = [];
    const monsterConfigs = [
      { name: '貪吃赤面鬼', sprite: 'yokai_oni' },
      { name: '鞍馬小天狗', sprite: 'yokai_tengu' },
      { name: '提燈白狐妖', sprite: 'yokai_kitsune' },
      { name: '偷酒赤面鬼', sprite: 'yokai_oni' },
      { name: '赤面鬼大王', sprite: 'yokai_oni' }
    ];
    const stances: ('earth' | 'water' | 'fire' | 'wind' | 'void')[] = ['earth', 'water', 'fire', 'wind', 'void'];
    const count = 5;

    for (let i = 0; i < count; i++) {
      const ox = zoneId === 'kyoto'
        ? 1020 + (i % 3) * 110
        : 360 + ((i * 210) % (zone.width - 650));
      const oy = zoneId === 'kyoto'
        ? 240 + Math.floor(i / 2) * 140
        : 240 + ((i * 150) % (zone.height - 420));
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
      // 重置妖怪於巡邏原點並補滿生命，給予短暫冷卻避免瞬間無限重疊觸發
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

      // 檢查是否點擊到 POI
      for (const poi of this.state.pois) {
        const dist = Math.hypot(worldX - poi.x, worldY - (poi.y - 16));
        if (dist <= 40) {
          if (this.onInteractPOICallback) this.onInteractPOICallback(poi);
          this.state.targetX = poi.x;
          this.state.targetY = poi.y + 22;
          return;
        }
      }

      // 檢查是否點擊到妖怪
      for (const yk of this.state.yokaiList) {
        const dist = Math.hypot(worldX - yk.x, worldY - (yk.y - 16));
        if (dist <= 40) {
          this.state.targetX = yk.x;
          this.state.targetY = yk.y;
          return;
        }
      }

      // 點擊地面直線行走
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
      this.render();
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
    const moveSpeed = 220;
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
    this.state.playerX = Math.max(30, Math.min(curZone.width - 30, this.state.playerX));
    this.state.playerY = Math.max(40, Math.min(curZone.height - 30, this.state.playerY));

    if (this.state.isWalking) {
      this.state.walkFrame = (this.state.walkFrame + dt * 7) % 4;
    } else {
      this.state.walkFrame = 0;
    }

    // 更新城鎮散步 NPC
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

    // 妖怪巡邏與單次觸發遇敵偵測
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
        this.onEncounterCallback(yk);
      } else if (playerDist > 75 && this.state.activeCombatYokaiId === yk.id) {
        this.state.activeCombatYokaiId = null;
      }
    }

    const targetCamX = this.state.playerX - this.canvas.width / 2;
    const targetCamY = this.state.playerY - this.canvas.height / 2;
    this.state.cameraX += (targetCamX - this.state.cameraX) * 0.12;
    this.state.cameraY += (targetCamY - this.state.cameraY) * 0.12;

    this.state.cameraX = Math.max(0, Math.min(Math.max(0, curZone.width - this.canvas.width), this.state.cameraX));
    this.state.cameraY = Math.max(0, Math.min(Math.max(0, curZone.height - this.canvas.height), this.state.cameraY));
  }

  private render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const curZone = MAP_ZONES.find(z => z.id === this.state.currentZoneId) || MAP_ZONES[0];
    const camX = Math.round(this.state.cameraX);
    const camY = Math.round(this.state.cameraY);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, w, h);

    // 1. 繪製地貌底色與像素地磚網格
    ctx.fillStyle = curZone.groundColor;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 48;
    const startX = -(camX % gridSize);
    const startY = -(camY % gridSize);

    for (let x = startX; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = startY; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 2. 繪製街道石疊路與城鎮暖紅提燈
    ctx.fillStyle = curZone.pathColor;
    const pathRelX = 120 - camX;
    const pathRelY = 400 - camY;
    ctx.fillRect(pathRelX, pathRelY, curZone.width - 240, 96);

    // 街道兩側像素風暖紅提燈
    for (let lx = 200; lx < curZone.width - 200; lx += 220) {
      const sx = lx - camX;
      const sy = 385 - camY;
      if (sx < -40 || sx > w + 40) continue;
      // 燈柱
      ctx.fillStyle = '#451a03';
      ctx.fillRect(sx - 2, sy - 24, 4, 28);
      // 暖光暈
      ctx.beginPath();
      ctx.arc(sx, sy - 20, 18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.16)';
      ctx.fill();
      // 紅提燈像素本體
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(sx - 6, sy - 26, 12, 14);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(sx - 4, sy - 22, 8, 6);
    }

    // 若在京都，標示右側「道場試刀林」分界牌
    if (curZone.id === 'kyoto') {
      const signX = 950 - camX;
      const signY = 365 - camY;
      ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.fillRect(signX - 65, signY - 18, 130, 22);
      ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';
      ctx.fillText('⬅ 洛中町區 ｜ 東郊試刀林 ➡', signX, signY - 4);
    }

    // 3. 繪製目標尋路指示圈
    if (this.state.targetX !== null && this.state.targetY !== null) {
      const tx = this.state.targetX - camX;
      const ty = this.state.targetY - camY;
      ctx.beginPath();
      ctx.arc(tx, ty, 14, 0, Math.PI * 2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fde047';
      ctx.fill();
    }

    // 4. 繪製地標 POI 與 3頭身像素 NPC
    for (const poi of this.state.pois) {
      const px = poi.x - camX;
      const py = poi.y - camY;
      if (px < -80 || px > w + 80 || py < -80 || py > h + 80) continue;

      // 腳下光環
      ctx.beginPath();
      ctx.ellipse(px, py + 2, 22, 9, 0, 0, Math.PI * 2);
      ctx.fillStyle = poi.type === 'shrine'
        ? 'rgba(239, 68, 68, 0.28)'
        : poi.type === 'chest'
        ? 'rgba(245, 158, 11, 0.32)'
        : 'rgba(56, 189, 248, 0.25)';
      ctx.fill();

      if (poi.type === 'npc' || poi.type === 'town') {
        // 以 3頭身像素風繪製 NPC
        drawChibiSprite(ctx, poi.icon, px, py + 4, 2, 'down', 0);
      } else {
        // 鳥居與秘寶箱
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(poi.icon, px, py - 14);
      }

      // 名稱標籤背景與文字
      ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      const textW = ctx.measureText(poi.name).width + 10;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
      ctx.fillRect(px - textW / 2, py + 8, textW, 16);
      ctx.fillStyle = poi.type === 'chest' ? '#fde047' : '#f8fafc';
      ctx.fillText(poi.name, px, py + 19);
    }

    // 5. 繪製城鎮散步 3頭身町民與輕鬆對話氣泡
    for (const wn of this.state.townNpcs) {
      const nx = wn.x - camX;
      const ny = wn.y - camY;
      if (nx < -80 || nx > w + 80 || ny < -80 || ny > h + 80) continue;

      ctx.beginPath();
      ctx.ellipse(nx, ny + 2, 14, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fill();

      drawChibiSprite(ctx, wn.spriteId, nx, ny + 2, 2, wn.facing, wn.walkFrame);

      // 頭頂輕鬆對話小氣泡
      ctx.font = '10px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      const bw = ctx.measureText(wn.bubbleText).width + 10;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fillRect(nx - bw / 2, ny - 64, bw, 15);
      ctx.fillStyle = '#1e293b';
      ctx.fillText(wn.bubbleText, nx, ny - 53);
    }

    // 6. 繪製 3頭身像素漫遊妖怪
    for (const yk of this.state.yokaiList) {
      const yx = yk.x - camX;
      const yy = yk.y - camY;
      if (yx < -80 || yx > w + 80 || yy < -80 || yy > h + 80) continue;

      const scale = yk.isBoss ? 2.5 : 2;
      const spriteH = 24 * scale;

      // 妖怪陰影
      ctx.beginPath();
      ctx.ellipse(yx, yy + 3, 16, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.state.activeCombatYokaiId === yk.id ? 'rgba(239, 68, 68, 0.55)' : 'rgba(0,0,0,0.45)';
      ctx.fill();

      // 3頭身像素妖怪本體
      const ykFacing = yk.vx < 0 ? 'left' : 'right';
      drawChibiSprite(ctx, yk.avatar, yx, yy + 2, scale, ykFacing, (performance.now() / 220) % 2);

      // 妖怪血條
      const barW = 46;
      const barH = 5;
      const hpPct = Math.max(0, Math.min(1, yk.hp / yk.maxHp));
      const barY = yy - spriteH - 6;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(yx - barW / 2, barY, barW, barH);
      ctx.fillStyle = yk.isBoss ? '#ef4444' : '#f59e0b';
      ctx.fillRect(yx - barW / 2, barY, barW * hpPct, barH);

      // 妖怪名稱
      ctx.font = 'bold 10px "Noto Sans TC", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = yk.isBoss ? '#fca5a5' : '#e2e8f0';
      ctx.fillText(`Lv.${yk.level} ${yk.name}`, yx, barY - 4);
    }

    // 7. 繪製主角 3頭身像素武士 (Player Character)
    const px = this.state.playerX - camX;
    const py = this.state.playerY - camY;

    // 腳下金色劍氣光圈與陰影
    ctx.beginPath();
    ctx.ellipse(px, py + 3, 18, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.fill();

    // 3頭身像素主角本體 (16x24 * scale 2 = 32x48 px)
    drawChibiSprite(
      ctx,
      this.state.playerAvatar,
      px,
      py + 3,
      2,
      this.state.facing,
      this.state.isWalking ? this.state.walkFrame : 0
    );

    // 玩家稱號與姓名標籤
    ctx.font = 'bold 11px "Noto Sans TC", sans-serif';
    ctx.textAlign = 'center';
    const label = `【${this.state.playerTitle}】${this.state.playerName}`;
    const lw = ctx.measureText(label).width + 10;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(px - lw / 2, py - 64, lw, 16);
    ctx.fillStyle = '#fde047';
    ctx.fillText(label, px, py - 53);

    ctx.restore();
  }
}
