/**
 * 《新武士道列傳 RPG》SFC FF6 / PS1 武士道烈伝 質感角色立繪與戰場角色渲染引擎
 * - 提供「大型 TV GAME 對話框專用半身特寫立繪 (Bust Portrait)」與「全彩場地／橫向戰場全身角色渲染」
 */

export interface ChibiSpriteSpec {
  id: string;
  name: string;
  palette: Record<string, string>;
  grid: string[];
  hdStyle: {
    hairColor: string;
    hairHighlight: string;
    hairStyle: 'topknot' | 'wild_white' | 'kabuto' | 'miko_long' | 'elder_bun' | 'bandana' | 'ninja_hood' | 'odango' | 'oni_horns' | 'tengu_wings' | 'kitsune_ears';
    skinColor: string;
    skinShadow: string;
    eyeColor: string;
    coatPrimary: string;
    coatSecondary: string;
    trimGold: string;
    hakamaColor: string;
    weaponType: 'katana' | 'dual_katana' | 'nodachi' | 'sacred_bow' | 'wood_sword' | 'hammer' | 'kunai' | 'dango_tray' | 'kanabo' | 'tengu_fan' | 'foxfire';
    auraColor: string;
    bgCrestColor: string;
  };
}

const DUMMY_GRID = Array.from({ length: 24 }, () => '................');

export const SPRITE_SPECS: Record<string, ChibiSpriteSpec> = {
  samurai_general: {
    id: 'samurai_general',
    name: '二天劍豪',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#172033',
      hairHighlight: '#475569',
      hairStyle: 'topknot',
      skinColor: '#fde4c3',
      skinShadow: '#e2b48a',
      eyeColor: '#3b82f6',
      coatPrimary: '#1e3a8a',
      coatSecondary: '#2563eb',
      trimGold: '#fbbf24',
      hakamaColor: '#0f172a',
      weaponType: 'dual_katana',
      auraColor: 'rgba(59, 130, 246, 0.45)',
      bgCrestColor: '#1d4ed8'
    }
  },
  samurai_oni: {
    id: 'samurai_oni',
    name: '修羅狂戰',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#e2e8f0',
      hairHighlight: '#ffffff',
      hairStyle: 'wild_white',
      skinColor: '#f8d5b8',
      skinShadow: '#d6a27c',
      eyeColor: '#ef4444',
      coatPrimary: '#7f1d1d',
      coatSecondary: '#dc2626',
      trimGold: '#f59e0b',
      hakamaColor: '#18181b',
      weaponType: 'nodachi',
      auraColor: 'rgba(239, 68, 68, 0.45)',
      bgCrestColor: '#b91c1c'
    }
  },
  samurai_lord: {
    id: 'samurai_lord',
    name: '旗本大將',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#18181b',
      hairHighlight: '#52525b',
      hairStyle: 'kabuto',
      skinColor: '#fde4c3',
      skinShadow: '#dfa97e',
      eyeColor: '#f59e0b',
      coatPrimary: '#064e3b',
      coatSecondary: '#059669',
      trimGold: '#fbbf24',
      hakamaColor: '#022c22',
      weaponType: 'katana',
      auraColor: 'rgba(16, 185, 129, 0.45)',
      bgCrestColor: '#047857'
    }
  },
  samurai_female: {
    id: 'samurai_female',
    name: '破邪巫女・神無月楓',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#1e1b4b',
      hairHighlight: '#4338ca',
      hairStyle: 'miko_long',
      skinColor: '#fff0e5',
      skinShadow: '#ecc5b0',
      eyeColor: '#e11d48',
      coatPrimary: '#f8fafc',
      coatSecondary: '#e11d48',
      trimGold: '#fbbf24',
      hakamaColor: '#be123c',
      weaponType: 'sacred_bow',
      auraColor: 'rgba(244, 63, 94, 0.45)',
      bgCrestColor: '#be123c'
    }
  },
  npc_yagyu: {
    id: 'npc_yagyu',
    name: '劍聖・柳生嚴信',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#cbd5e1',
      hairHighlight: '#ffffff',
      hairStyle: 'elder_bun',
      skinColor: '#f3d2b5',
      skinShadow: '#cfa27e',
      eyeColor: '#6366f1',
      coatPrimary: '#1e1b4b',
      coatSecondary: '#4338ca',
      trimGold: '#fbbf24',
      hakamaColor: '#0f172a',
      weaponType: 'wood_sword',
      auraColor: 'rgba(99, 102, 241, 0.4)',
      bgCrestColor: '#3730a3'
    }
  },
  npc_tessai: {
    id: 'npc_tessai',
    name: '刀匠・國友鐵齋',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#27272a',
      hairHighlight: '#52525b',
      hairStyle: 'bandana',
      skinColor: '#e5b594',
      skinShadow: '#bd8764',
      eyeColor: '#f97316',
      coatPrimary: '#7c2d12',
      coatSecondary: '#ea580c',
      trimGold: '#facc15',
      hakamaColor: '#18181b',
      weaponType: 'hammer',
      auraColor: 'rgba(249, 115, 22, 0.4)',
      bgCrestColor: '#9a3412'
    }
  },
  npc_hayate: {
    id: 'npc_hayate',
    name: '疾風忍・影縫疾風',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#0f172a',
      hairHighlight: '#334155',
      hairStyle: 'ninja_hood',
      skinColor: '#fde4c3',
      skinShadow: '#dcab82',
      eyeColor: '#38bdf8',
      coatPrimary: '#0f172a',
      coatSecondary: '#0284c7',
      trimGold: '#38bdf8',
      hakamaColor: '#090d16',
      weaponType: 'kunai',
      auraColor: 'rgba(56, 189, 248, 0.45)',
      bgCrestColor: '#0369a1'
    }
  },
  npc_town_girl: {
    id: 'npc_town_girl',
    name: '茶屋看板娘・小町',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#3b2114',
      hairHighlight: '#78350f',
      hairStyle: 'odango',
      skinColor: '#fff1e6',
      skinShadow: '#ebc4ae',
      eyeColor: '#db2777',
      coatPrimary: '#ec4899',
      coatSecondary: '#fbcfe8',
      trimGold: '#fde047',
      hakamaColor: '#9d174d',
      weaponType: 'dango_tray',
      auraColor: 'rgba(244, 114, 182, 0.4)',
      bgCrestColor: '#be185d'
    }
  },
  yokai_oni: {
    id: 'yokai_oni',
    name: '赤面鬼武者',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#fef08a',
      hairHighlight: '#ffffff',
      hairStyle: 'oni_horns',
      skinColor: '#ef4444',
      skinShadow: '#b91c1c',
      eyeColor: '#fde047',
      coatPrimary: '#7f1d1d',
      coatSecondary: '#facc15',
      trimGold: '#fbbf24',
      hakamaColor: '#18181b',
      weaponType: 'kanabo',
      auraColor: 'rgba(239, 68, 68, 0.5)',
      bgCrestColor: '#991b1b'
    }
  },
  yokai_tengu: {
    id: 'yokai_tengu',
    name: '鞍馬大天狗',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#f1f5f9',
      hairHighlight: '#ffffff',
      hairStyle: 'tengu_wings',
      skinColor: '#f87171',
      skinShadow: '#dc2626',
      eyeColor: '#fde047',
      coatPrimary: '#c2410c',
      coatSecondary: '#f8fafc',
      trimGold: '#22c55e',
      hakamaColor: '#1e293b',
      weaponType: 'tengu_fan',
      auraColor: 'rgba(34, 197, 94, 0.48)',
      bgCrestColor: '#15803d'
    }
  },
  yokai_kitsune: {
    id: 'yokai_kitsune',
    name: '九尾靈狐',
    palette: {},
    grid: DUMMY_GRID,
    hdStyle: {
      hairColor: '#f8fafc',
      hairHighlight: '#ffffff',
      hairStyle: 'kitsune_ears',
      skinColor: '#fff1e6',
      skinShadow: '#ebd0c0',
      eyeColor: '#38bdf8',
      coatPrimary: '#ffffff',
      coatSecondary: '#ef4444',
      trimGold: '#fbbf24',
      hakamaColor: '#dc2626',
      weaponType: 'foxfire',
      auraColor: 'rgba(56, 189, 248, 0.5)',
      bgCrestColor: '#0284c7'
    }
  }
};

export function resolveSpriteId(key: string): string {
  if (!key) return 'samurai_general';
  if (SPRITE_SPECS[key]) return key;
  if (key.includes('楓') || key.includes('巫女') || key === '🌸') return 'samurai_female';
  if (key.includes('嚴信') || key.includes('柳生') || key.includes('宗旦') || key === '⚔️' || key === '♟️') return 'npc_yagyu';
  if (key.includes('鐵齋') || key.includes('小鐵') || key === '🔨') return 'npc_tessai';
  if (key.includes('疾風') || key.includes('彌七') || key.includes('服部') || key === '🥷' || key === '🏃') return 'npc_hayate';
  if (key.includes('小町') || key.includes('阿春') || key.includes('糰子') || key === '🍡' || key === '🍵' || key === '🐱') return 'npc_town_girl';
  if (key.includes('天狗') || key === '👺') return 'yokai_tengu';
  if (key.includes('狐') || key.includes('提燈') || key.includes('靈') || key === '🦊' || key === '🔥' || key === '🦇') return 'yokai_kitsune';
  if (key.includes('鬼') || key.includes('大王') || key.includes('蛟') || key.includes('羅剎') || key === '👹' || key === '👑' || key === '💀') return 'yokai_oni';
  return 'samurai_general';
}

/**
 * 繪製 TV GAME 大型對話框與狀態欄專用的「高精細半身特寫立繪 (Bust Portrait)」
 * 呈現 SFC FF6 / PS1 武士道列傳風格的立體陰影、衣領肩甲、細膩眼神與家紋背景
 */
export function drawBustPortrait(
  ctx: CanvasRenderingContext2D,
  spriteKey: string,
  w: number,
  h: number
) {
  const id = resolveSpriteId(spriteKey);
  const spec = SPRITE_SPECS[id] || SPRITE_SPECS.samurai_general;
  const st = spec.hdStyle;

  ctx.save();
  ctx.imageSmoothingEnabled = true;

  // 1. FF6 風格深邃漸層家紋背景
  const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.42, w * 0.08, w * 0.5, h * 0.5, w * 0.75);
  bgGrad.addColorStop(0, st.bgCrestColor);
  bgGrad.addColorStop(0.65, '#0f172a');
  bgGrad.addColorStop(1, '#050811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 背景淡金色和風圓環家紋
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.22)';
  ctx.lineWidth = Math.max(1.5, w * 0.02);
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, w * 0.36, 0, Math.PI * 2);
  ctx.stroke();

  const cx = w * 0.5;
  const cy = h * 0.46;
  const r = w * 0.25;

  // 2. 後方長髮／天狗羽翼／妖狐白耳
  if (st.hairStyle === 'miko_long' || st.hairStyle === 'wild_white' || st.hairStyle === 'tengu_wings') {
    ctx.fillStyle = st.hairColor;
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = w * 0.018;
    ctx.beginPath();
    ctx.moveTo(cx - r * 1.15, cy - r * 0.2);
    ctx.quadraticCurveTo(cx - r * 1.45, h * 0.85, cx - r * 0.9, h);
    ctx.lineTo(cx + r * 0.9, h);
    ctx.quadraticCurveTo(cx + r * 1.45, h * 0.85, cx + r * 1.15, cy - r * 0.2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 3. 肩部羽織與交領和服／具足大鎧 (Shoulders & Layered Kimono Collar)
  const coatGrad = ctx.createLinearGradient(0, h * 0.62, 0, h);
  coatGrad.addColorStop(0, st.coatSecondary);
  coatGrad.addColorStop(1, st.coatPrimary);
  ctx.fillStyle = coatGrad;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = w * 0.022;

  ctx.beginPath();
  ctx.moveTo(w * 0.1, h);
  ctx.quadraticCurveTo(w * 0.14, h * 0.68, cx - r * 0.55, h * 0.64);
  ctx.lineTo(cx + r * 0.55, h * 0.64);
  ctx.quadraticCurveTo(w * 0.86, h * 0.68, w * 0.9, h);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 內襯白襟與金色衣領滾邊
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.45, h * 0.64);
  ctx.lineTo(cx, h * 0.86);
  ctx.lineTo(cx + r * 0.45, h * 0.64);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = st.trimGold;
  ctx.lineWidth = w * 0.025;
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.5, h * 0.65);
  ctx.lineTo(cx, h * 0.92);
  ctx.lineTo(cx + r * 0.5, h * 0.65);
  ctx.stroke();

  // 頸部與陰影
  ctx.fillStyle = st.skinShadow;
  ctx.fillRect(cx - r * 0.26, cy + r * 0.65, r * 0.52, r * 0.45);

  // 4. 臉部立體輪廓 (Sculpted Anime/FF6 Face Contour)
  const faceGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  faceGrad.addColorStop(0, st.skinColor);
  faceGrad.addColorStop(0.75, st.skinColor);
  faceGrad.addColorStop(1, st.skinShadow);
  ctx.fillStyle = faceGrad;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = w * 0.02;

  ctx.beginPath();
  ctx.moveTo(cx - r * 0.92, cy - r * 0.2);
  ctx.quadraticCurveTo(cx - r * 0.88, cy + r * 0.65, cx, cy + r * 0.96);
  ctx.quadraticCurveTo(cx + r * 0.88, cy + r * 0.65, cx + r * 0.92, cy - r * 0.2);
  ctx.arc(cx, cy - r * 0.2, r * 0.92, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 5. 眼神與五官特寫 (Expressive FF6 / 武士道列傳 Eyes, Brows, Nose & Mouth)
  for (const dir of [-1, 1]) {
    const ex = cx + dir * r * 0.38;
    const ey = cy + r * 0.05;

    // 眼白與深邃上眼線
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(ex, ey, r * 0.21, r * 0.16, 0, 0, Math.PI * 2);
    ctx.fill();

    // 虹膜漸層
    ctx.fillStyle = st.eyeColor;
    ctx.beginPath();
    ctx.arc(ex, ey + r * 0.01, r * 0.13, 0, Math.PI * 2);
    ctx.fill();

    // 瞳孔
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(ex, ey + r * 0.02, r * 0.065, 0, Math.PI * 2);
    ctx.fill();

    // 雙重眼神高光
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ex - r * 0.05, ey - r * 0.05, r * 0.045, 0, Math.PI * 2);
    ctx.arc(ex + r * 0.04, ey + r * 0.04, r * 0.022, 0, Math.PI * 2);
    ctx.fill();

    // 上眼瞼粗黑線
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = w * 0.02;
    ctx.beginPath();
    ctx.arc(ex, ey + r * 0.03, r * 0.21, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // 凜然劍眉
    ctx.strokeStyle = st.hairColor;
    ctx.lineWidth = w * 0.022;
    ctx.beginPath();
    ctx.moveTo(ex - dir * r * 0.24, ey - r * 0.22);
    ctx.lineTo(ex + dir * r * 0.2, ey - r * 0.3);
    ctx.stroke();
  }

  // 鼻樑微影與自信唇線
  ctx.strokeStyle = st.skinShadow;
  ctx.lineWidth = w * 0.015;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r * 0.12);
  ctx.lineTo(cx - r * 0.05, cy + r * 0.34);
  ctx.lineTo(cx + r * 0.03, cy + r * 0.36);
  ctx.stroke();

  if (st.hairStyle === 'ninja_hood') {
    // 忍者深藍面罩與飄揚紅領巾
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.88, cy + r * 0.22);
    ctx.quadraticCurveTo(cx, cy + r * 0.1, cx + r * 0.88, cy + r * 0.22);
    ctx.quadraticCurveTo(cx + r * 0.78, cy + r * 0.82, cx, cy + r * 0.98);
    ctx.quadraticCurveTo(cx - r * 0.78, cy + r * 0.82, cx - r * 0.88, cy + r * 0.22);
    ctx.fill();
    ctx.stroke();
  } else if (st.hairStyle === 'elder_bun') {
    // 劍聖柳生嚴信銀白長鬚
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.38, cy + r * 0.52);
    ctx.quadraticCurveTo(cx, h * 0.95, cx + r * 0.38, cy + r * 0.52);
    ctx.fill();
  } else {
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = w * 0.016;
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.52, r * 0.16, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
  }

  // 6. 前額瀏海與頭飾／鍬形兜／鬼角／巫女髮飾
  ctx.fillStyle = st.hairColor;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = w * 0.018;
  ctx.beginPath();
  ctx.arc(cx, cy - r * 0.18, r * 1.0, Math.PI * 0.95, Math.PI * 2.05);
  ctx.lineTo(cx + r * 0.65, cy + r * 0.05);
  ctx.lineTo(cx + r * 0.35, cy - r * 0.25);
  ctx.lineTo(cx, cy + r * 0.02);
  ctx.lineTo(cx - r * 0.35, cy - r * 0.25);
  ctx.lineTo(cx - r * 0.65, cy + r * 0.05);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (st.hairStyle === 'kabuto') {
    // 黃金鍬形大兜前立
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = w * 0.035;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.65);
    ctx.quadraticCurveTo(cx - r * 1.2, cy - r * 1.2, cx - r * 0.85, cy - r * 1.65);
    ctx.moveTo(cx, cy - r * 0.65);
    ctx.quadraticCurveTo(cx + r * 1.2, cy - r * 1.2, cx + r * 0.85, cy - r * 1.65);
    ctx.stroke();
  } else if (st.hairStyle === 'oni_horns') {
    ctx.fillStyle = '#fef08a';
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + dir * r * 0.4, cy - r * 0.85);
      ctx.lineTo(cx + dir * r * 0.85, cy - r * 1.6);
      ctx.lineTo(cx + dir * r * 0.15, cy - r * 0.98);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (st.hairStyle === 'miko_long') {
    // 巫女緋紅蝶結
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.ellipse(cx - r * 0.8, cy - r * 0.7, r * 0.32, r * 0.18, -0.4, 0, Math.PI * 2);
    ctx.ellipse(cx + r * 0.8, cy - r * 0.7, r * 0.32, r * 0.18, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (st.hairStyle === 'bandana') {
    // 刀匠鐵齋火紅鉢卷頭巾
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(cx - r * 0.95, cy - r * 0.62, r * 1.9, r * 0.26);
  }

  ctx.restore();
}

/**
 * 繪製大地圖與橫向戰場上的全身流暢和風武士／巫女／百鬼角色
 */
export function drawChibiSprite(
  ctx: CanvasRenderingContext2D,
  spriteKey: string,
  centerX: number,
  bottomY: number,
  scale = 2,
  facing: 'down' | 'up' | 'left' | 'right' = 'down',
  walkFrame = 0
) {
  const id = resolveSpriteId(spriteKey);
  const spec = SPRITE_SPECS[id] || SPRITE_SPECS.samurai_general;
  const st = spec.hdStyle;

  ctx.save();
  ctx.imageSmoothingEnabled = true;

  const isStepping = walkFrame > 0.05;
  const swing = isStepping ? Math.sin(walkFrame * Math.PI) : 0;
  const bobY = isStepping ? -Math.abs(swing) * 1.8 * scale : Math.sin(performance.now() * 0.004) * 0.8;

  ctx.translate(centerX, bottomY + bobY);
  if (facing === 'left') {
    ctx.scale(-1, 1);
  }
  const s = scale * 0.95;

  // 1. 背後羽翼或九尾狐尾
  if (st.hairStyle === 'tengu_wings') {
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.2 * s;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, -14 * s);
      ctx.quadraticCurveTo(dir * 17 * s, -25 * s, dir * 14 * s, -6 * s);
      ctx.quadraticCurveTo(dir * 7 * s, -8 * s, 0, -11 * s);
      ctx.fill();
      ctx.stroke();
    }
  } else if (st.hairStyle === 'kitsune_ears') {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.1 * s;
    ctx.beginPath();
    ctx.moveTo(3 * s, -9 * s);
    ctx.quadraticCurveTo(16 * s, -18 * s, 12 * s, -5 * s);
    ctx.quadraticCurveTo(7 * s, -3 * s, 2 * s, -7 * s);
    ctx.fill();
    ctx.stroke();
  }

  // 2. 袴褲與白足袋
  const leftLegY = swing * 2 * s;
  const rightLegY = -swing * 2 * s;
  ctx.fillStyle = st.hakamaColor;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 1.2 * s;

  ctx.beginPath();
  ctx.roundRect(-5.5 * s, -8.5 * s + leftLegY * 0.4, 4.5 * s, 6.5 * s, 1.5 * s);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(-3.5 * s, -1.5 * s + leftLegY * 0.5, 2.4 * s, 1.3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = st.hakamaColor;
  ctx.beginPath();
  ctx.roundRect(1.0 * s, -8.5 * s + rightLegY * 0.4, 4.5 * s, 6.5 * s, 1.5 * s);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.ellipse(3.5 * s, -1.5 * s + rightLegY * 0.5, 2.4 * s, 1.3 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3. 羽織與鎧甲軀幹
  const bodyGrad = ctx.createLinearGradient(0, -18 * s, 0, -6 * s);
  bodyGrad.addColorStop(0, st.coatSecondary);
  bodyGrad.addColorStop(1, st.coatPrimary);
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 1.3 * s;

  ctx.beginPath();
  ctx.moveTo(-6.5 * s, -16.5 * s);
  ctx.quadraticCurveTo(0, -18 * s, 6.5 * s, -16.5 * s);
  ctx.lineTo(8 * s, -7.5 * s);
  ctx.quadraticCurveTo(0, -6.5 * s, -8 * s, -7.5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = st.trimGold;
  ctx.lineWidth = 1.4 * s;
  ctx.beginPath();
  ctx.moveTo(-3 * s, -16.5 * s);
  ctx.lineTo(0, -11 * s);
  ctx.lineTo(3 * s, -16.5 * s);
  ctx.stroke();

  ctx.fillStyle = st.trimGold;
  ctx.beginPath();
  ctx.roundRect(-6.8 * s, -11.2 * s, 13.6 * s, 2.4 * s, 1 * s);
  ctx.fill();

  // 4. 頭部與髮型兜鍪
  ctx.fillStyle = st.skinColor;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 1.3 * s;
  ctx.beginPath();
  ctx.arc(0, -21.5 * s, 6.8 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = st.hairColor;
  ctx.beginPath();
  ctx.arc(0, -22.6 * s, 7.1 * s, Math.PI * 0.95, Math.PI * 2.05);
  ctx.fill();
  ctx.stroke();

  if (st.hairStyle === 'topknot' || st.hairStyle === 'elder_bun') {
    ctx.beginPath();
    ctx.ellipse(0, -29.5 * s, 2.6 * s, 2.0 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (st.hairStyle === 'kabuto') {
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.0 * s;
    ctx.beginPath();
    ctx.moveTo(0, -26 * s);
    ctx.quadraticCurveTo(-8 * s, -31 * s, -6 * s, -34 * s);
    ctx.moveTo(0, -26 * s);
    ctx.quadraticCurveTo(8 * s, -31 * s, 6 * s, -34 * s);
    ctx.stroke();
  } else if (st.hairStyle === 'miko_long') {
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.ellipse(-5 * s, -27 * s, 2.8 * s, 1.5 * s, -0.4, 0, Math.PI * 2);
    ctx.ellipse(5 * s, -27 * s, 2.8 * s, 1.5 * s, 0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (st.hairStyle === 'oni_horns') {
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.1 * s;
    for (const dir of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(dir * 3 * s, -27 * s);
      ctx.lineTo(dir * 6 * s, -33 * s);
      ctx.lineTo(dir * 1.5 * s, -28 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (st.hairStyle === 'kitsune_ears') {
    for (const dir of [-1, 1]) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(dir * 2.5 * s, -27 * s);
      ctx.lineTo(dir * 6.5 * s, -34 * s);
      ctx.lineTo(dir * 6 * s, -25 * s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else if (st.hairStyle === 'odango') {
    ctx.fillStyle = st.hairColor;
    ctx.beginPath();
    ctx.arc(-5.5 * s, -27.5 * s, 2.5 * s, 0, Math.PI * 2);
    ctx.arc(5.5 * s, -27.5 * s, 2.5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  if (facing !== 'up') {
    for (const ex of [-2.5 * s, 2.5 * s]) {
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.ellipse(ex, -21.2 * s, 1.25 * s, 1.55 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = st.eyeColor;
      ctx.beginPath();
      ctx.arc(ex, -20.9 * s, 0.75 * s, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex - 0.35 * s, -21.6 * s, 0.45 * s, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 5. 武器繪製
  if (st.weaponType === 'katana' || st.weaponType === 'dual_katana' || st.weaponType === 'nodachi') {
    ctx.save();
    ctx.translate(6.5 * s, -12 * s);
    ctx.rotate(-0.35 + swing * 0.18);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-2 * s, -1.5 * s, 4 * s, 1.6 * s);
    const bladeGrad = ctx.createLinearGradient(0, 0, 0, -18 * s);
    bladeGrad.addColorStop(0, '#cbd5e1');
    bladeGrad.addColorStop(0.5, '#ffffff');
    bladeGrad.addColorStop(1, '#93c5fd');
    ctx.strokeStyle = bladeGrad;
    ctx.lineWidth = 1.8 * s;
    ctx.beginPath();
    ctx.moveTo(0, -1.5 * s);
    ctx.quadraticCurveTo(3.2 * s, -10 * s, 1.2 * s, -19 * s);
    ctx.stroke();
    ctx.restore();
  } else if (st.weaponType === 'sacred_bow') {
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 1.6 * s;
    ctx.beginPath();
    ctx.arc(7.5 * s, -13 * s, 8 * s, -Math.PI * 0.42, Math.PI * 0.42);
    ctx.stroke();
  } else if (st.weaponType === 'dango_tray') {
    const dColors = ['#86efac', '#ffffff', '#f472b6'];
    dColors.forEach((col, i) => {
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc((7.8 + i * 0.8) * s, (-11.5 - i * 2.4) * s, 1.5 * s, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (st.weaponType === 'foxfire') {
    const fy = -16 * s + Math.sin(performance.now() * 0.006) * 2 * s;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(10 * s, fy, 2.8 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

const dataUrlCache: Record<string, string> = {};

/**
 * 產生高解析度 TV GAME 半身特寫立繪 Data URL（供大型對話框與角色頭像框使用）
 */
export function getChibiDataUrl(spriteKey: string, scale = 3): string {
  const id = resolveSpriteId(spriteKey);
  const cacheKey = `bust_${id}_${scale}`;
  if (dataUrlCache[cacheKey]) return dataUrlCache[cacheKey];

  if (typeof document === 'undefined') {
    return '';
  }

  const size = 34 * scale;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawBustPortrait(ctx, id, size, size);
  const url = canvas.toDataURL('image/png');
  dataUrlCache[cacheKey] = url;
  return url;
}

/**
 * 產生 SFC FF6 橫向戰場專用的高解析度全身角色立繪 Data URL
 */
export function getFullBodyDataUrl(
  spriteKey: string,
  scale = 3,
  facing: 'down' | 'up' | 'left' | 'right' = 'left'
): string {
  const id = resolveSpriteId(spriteKey);
  const cacheKey = `full_${id}_${scale}_${facing}`;
  if (dataUrlCache[cacheKey]) return dataUrlCache[cacheKey];

  if (typeof document === 'undefined') {
    return '';
  }

  const w = Math.round(32 * scale);
  const h = Math.round(38 * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  drawChibiSprite(ctx, id, w * 0.5, h * 0.92, scale, facing, 0);
  const url = canvas.toDataURL('image/png');
  dataUrlCache[cacheKey] = url;
  return url;
}

