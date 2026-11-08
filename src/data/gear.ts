import type { GearItem, GearQuality, GearSlot, LegendaryPower } from '../types/game';

export const GEAR_SLOTS: Record<GearSlot, { name: string; icon: string }> = {
  weapon: { name: '名刀主武', icon: '⚔️' },
  offhand: { name: '脇差／刀鞘', icon: '🗡️' },
  helm: { name: '戰國兜盔', icon: '🪖' },
  armor: { name: '胴丸甲冑', icon: '🥋' },
  boots: { name: '具足戰靴', icon: '👢' },
  accessory: { name: '退魔護符', icon: '📿' }
};

export const GEAR_QUALITIES: Record<GearQuality, {
  name: string;
  color: string;
  border: string;
  bgGlow: string;
  multiplier: number;
  beamColor?: string;
}> = {
  common: {
    name: '凡品・白',
    color: '#cbd5e1',
    border: '#475569',
    bgGlow: 'rgba(255,255,255,0.03)',
    multiplier: 1.0
  },
  magic: {
    name: '精良・藍',
    color: '#60a5fa',
    border: '#2563eb',
    bgGlow: 'rgba(37,99,235,0.12)',
    multiplier: 1.35
  },
  rare: {
    name: '稀世・黃',
    color: '#facc15',
    border: '#ca8a04',
    bgGlow: 'rgba(202,138,4,0.15)',
    multiplier: 1.75
  },
  epic: {
    name: '史詩・紫',
    color: '#c084fc',
    border: '#9333ea',
    bgGlow: 'rgba(147,51,234,0.18)',
    multiplier: 2.25,
    beamColor: '#c084fc'
  },
  legendary: {
    name: '傳奇・橙',
    color: '#fb923c',
    border: '#ea580c',
    bgGlow: 'rgba(234,88,12,0.22)',
    multiplier: 3.0,
    beamColor: '#fb923c'
  },
  ancient: {
    name: '太古神話・紅',
    color: '#f87171',
    border: '#dc2626',
    bgGlow: 'rgba(220,38,38,0.28)',
    multiplier: 4.0,
    beamColor: '#f87171'
  }
};

export const LEGENDARY_POWERS: LegendaryPower[] = [
  { id: 'muramasa_soul', name: '妖刀村正・嗜血', desc: '暴擊時吸收造成傷害 15% 轉化為自身生命', mult: 0.15 },
  { id: 'fudo_unyielding', name: '不動明王・金剛身', desc: '受到攻擊時，反彈 40% 防禦力數值的荊棘神聖真傷', mult: 0.4 },
  { id: 'kagutsuchi_wrath', name: '迦具土・劫火', desc: '每次揮刀附帶 25% 額外火炎真實傷害，無視目標防禦', mult: 0.25 },
  { id: 'hachiman_might', name: '八幡神・武運', desc: '全屬性面板提升 20%，且奧義觸發機率額外 +10%', mult: 0.2 },
  { id: 'susanoo_thunder', name: '須佐之男・破邪雷鳴', desc: '五輪架勢相剋優勢傷害從 +30% 額外飆升至 +60%', mult: 0.6 },
  { id: 'izanami_void', name: '黃泉伊邪那美・逆命', desc: '受到致命攻擊時鎖定 1 點生命不死，並立即回滿 50% HP (冷卻60秒)', mult: 0.5 }
];

const ITEM_NAMES: Record<GearSlot, string[]> = {
  weapon: ['長曾彌虎徹', '備前長船兼光', '妖刀村正', '三日月宗近', '童子切安綱', '鬼切丸', '雷切・道雪'],
  offhand: ['葵紋黑漆鞘', '備前脇差', '出雲注連繩刀銘', '神樂朱漆小柄', '天羽羽斬殘片'],
  helm: ['日月前立兜', '三日月黑鐵冑', '獅子咬面甲', '風神鹿角兜', '鬼面般若甲冑'],
  armor: ['黑絲威胴丸', '赤備朱漆大鎧', '南蠻鋼鐵板甲', '白練羽織戰袍', '毘沙門天法衣'],
  boots: ['八咫烏輕甲靴', '金箔蒔繪具足', '疾風踏雪草履', '黑漆鐵甲懸', '御前近衛長靴'],
  accessory: ['天照八咫鏡', '八坂瓊勾玉', '出雲退魔靈符', '將軍御賜金盃', '五輪兵法錦囊']
};

export function generateGear(slot?: GearSlot | null, forceQuality?: GearQuality, level = 1): GearItem {
  const slots: GearSlot[] = ['weapon', 'offhand', 'helm', 'armor', 'boots', 'accessory'];
  const targetSlot = slot || slots[Math.floor(Math.random() * slots.length)];

  let q: GearQuality = forceQuality || 'common';
  if (!forceQuality) {
    const roll = Math.random() * 100;
    if (roll < 45) q = 'common';
    else if (roll < 72) q = 'magic';
    else if (roll < 88) q = 'rare';
    else if (roll < 96) q = 'epic';
    else if (roll < 99.3) q = 'legendary';
    else q = 'ancient';
  }

  const qMeta = GEAR_QUALITIES[q];
  const mult = qMeta.multiplier * (1 + (level - 1) * 0.12);
  const namePool = ITEM_NAMES[targetSlot];
  const rawName = namePool[Math.floor(Math.random() * namePool.length)];
  const name = `${rawName}`;

  let baseAtk: number | undefined;
  let baseDef: number | undefined;
  let baseHP: number | undefined;

  if (targetSlot === 'weapon') baseAtk = Math.round((20 + level * 6) * mult);
  else if (targetSlot === 'offhand') {
    baseAtk = Math.round((10 + level * 3) * mult);
    baseDef = Math.round((8 + level * 2) * mult);
  } else if (targetSlot === 'helm') {
    baseDef = Math.round((12 + level * 3) * mult);
    baseHP = Math.round((40 + level * 10) * mult);
  } else if (targetSlot === 'armor') {
    baseDef = Math.round((20 + level * 5) * mult);
    baseHP = Math.round((80 + level * 20) * mult);
  } else if (targetSlot === 'boots') {
    baseDef = Math.round((10 + level * 2) * mult);
    baseAtk = Math.round((6 + level * 2) * mult);
  } else {
    baseHP = Math.round((60 + level * 15) * mult);
    baseAtk = Math.round((12 + level * 3) * mult);
  }

  const affixes: { stat: string; value: number; text: string }[] = [];
  const affixCount = q === 'common' ? 0 : q === 'magic' ? 1 : q === 'rare' ? 2 : q === 'epic' ? 3 : 4;
  const affixTypes = [
    { stat: 'critRate', name: '暴擊機率', min: 2, max: 6, unit: '%' },
    { stat: 'critDmg', name: '暴擊傷害', min: 10, max: 25, unit: '%' },
    { stat: 'evasion', name: '閃避率', min: 2, max: 5, unit: '%' },
    { stat: 'lifesteal', name: '汲血效果', min: 1.5, max: 4, unit: '%' },
    { stat: 'thorns', name: '反彈荊棘', min: 8, max: 30, unit: '' }
  ];

  for (let i = 0; i < affixCount; i++) {
    const aType = affixTypes[Math.floor(Math.random() * affixTypes.length)];
    const val = Number((aType.min + Math.random() * (aType.max - aType.min)).toFixed(1));
    affixes.push({
      stat: aType.stat,
      value: val,
      text: `${aType.name} +${val}${aType.unit}`
    });
  }

  let legendaryPower: LegendaryPower | undefined;
  if (q === 'legendary' || q === 'ancient') {
    legendaryPower = LEGENDARY_POWERS[Math.floor(Math.random() * LEGENDARY_POWERS.length)];
  }

  const gearScore = Math.round(((baseAtk || 0) * 1.5 + (baseDef || 0) * 1.2 + (baseHP || 0) * 0.4) * (1 + affixes.length * 0.15));

  return {
    uid: 'gear_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    name,
    slot: targetSlot,
    slotName: GEAR_SLOTS[targetSlot].name,
    quality: q,
    icon: GEAR_SLOTS[targetSlot].icon,
    level,
    baseAtk,
    baseDef,
    baseHP,
    gearScore,
    upgradeLevel: 0,
    affixes,
    legendaryPower,
    lore: `天明年間匠人以高溫百鍊玉鋼精鑄而成，刃上隱隱流淌著破邪之氣。`,
    beamColor: qMeta.beamColor
  };
}

export function decomposeGear(gear: GearItem): { iron: number; souls: number; gold: number } {
  const map: Record<GearQuality, { iron: number; souls: number; gold: number }> = {
    common: { iron: 1, souls: 0, gold: 30 },
    magic: { iron: 3, souls: 1, gold: 80 },
    rare: { iron: 8, souls: 3, gold: 200 },
    epic: { iron: 20, souls: 10, gold: 600 },
    legendary: { iron: 60, souls: 35, gold: 2000 },
    ancient: { iron: 180, souls: 120, gold: 8000 }
  };
  return map[gear.quality] || map.common;
}
