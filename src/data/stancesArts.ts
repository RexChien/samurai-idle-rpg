import type { AutomationTier, FiveRingsStance, SamuraiArt } from '../types/game';

export const AUTOMATION_TIERS: Record<number, AutomationTier> = {
  0: {
    tier: 0,
    name: '凡骨拔刀（手動修煉）',
    unlockReq: '初始境界',
    intervalMs: 0,
    badge: '🔒 尚未領悟自動劍意',
    desc: '初入天明亂世，心浮氣躁。需親手點擊或按住戰場揮刀斬魔，於實戰中淬鍊劍心。'
  },
  1: {
    tier: 1,
    name: '第一重：劍心初醒',
    unlockReq: '完成主線【M01：木刀百振・劍心初醒】',
    intervalMs: 1200,
    badge: '⚡ 自動揮刀 (1.20秒/斬)',
    desc: '劍意隨呼吸自然流轉。獲得基礎自動揮刀能力，可隨時自由切換手動／自動。'
  },
  2: {
    tier: 2,
    name: '第二重：二天疾風',
    unlockReq: '完成主線【M03：清水舞台・百鬼初現】',
    intervalMs: 650,
    badge: '🌪️ 疾風連斬 (0.65秒/斬) ＋ 自動分解白藍裝',
    desc: '雙刀流疾風破空，大幅加快揮刀頻率，並開啟行囊「白裝／藍裝自動熔煉分解」爐。'
  },
  3: {
    tier: 3,
    name: '第三重：式神護法',
    unlockReq: '完成主線【M05：五輪初悟・式神契約】',
    intervalMs: 500,
    badge: '🦊 式神同契 (0.50秒/斬) ＋ 奧義自動施放 ＋ 離線常世修煉',
    desc: '出雲式神隨侍左右。戰鬥中自動施放已裝備的武學奧義，並開啟「常世離線放置收益」。'
  },
  4: {
    tier: 4,
    name: '第四重：無念無想',
    unlockReq: '完成主線【M09：信長魔影・自動極意】',
    intervalMs: 350,
    badge: '✨ 神速拔刀 (0.35秒/斬) ＋ 自動連續挑戰首領 (Boss Rush)',
    desc: '人刀合一，超凡入聖。達到神速拔刀極限，並自動推進章節首領決戰。'
  }
};

export const FIVE_RINGS_STANCES: Record<string, FiveRingsStance> = {
  earth: {
    id: 'earth',
    name: '地之卷・不動金剛',
    shortName: '地之卷',
    icon: '🌍',
    counters: 'fire',
    counterDesc: '克制【火之卷】(厚土鎮烈火)',
    desc: '如大岳沉穩，根基磐固。防禦力 +35%，反彈受傷 25% 荊棘傷害。',
    buffs: { defPct: 35, thorns: 25 }
  },
  water: {
    id: 'water',
    name: '水之卷・明鏡流水',
    shortName: '水之卷',
    icon: '🌊',
    counters: 'earth',
    counterDesc: '克制【地之卷】(滴水穿硬石)',
    desc: '因形而順，無隙不入。攻擊附帶 12% 吸血，並獲得 +20% 閃避反擊。',
    buffs: { lifesteal: 12, evasion: 20 }
  },
  fire: {
    id: 'fire',
    name: '火之卷・猛火侵略',
    shortName: '火之卷',
    icon: '🔥',
    counters: 'wind',
    counterDesc: '克制【風之卷】(烈焰乘風威)',
    desc: '動靜如雷，勢不可遏。攻擊力 +30%，暴擊傷害 +45%。',
    buffs: { atkPct: 30, critDmg: 45 }
  },
  wind: {
    id: 'wind',
    name: '風之卷・疾風知勁',
    shortName: '風之卷',
    icon: '🌪️',
    counters: 'void',
    counterDesc: '克制【空之卷】(勁風破幽虛)',
    desc: '知己知彼，動態飄忽。暴擊機率 +20%，閃避率 +18%。',
    buffs: { critRate: 20, evasion: 18 }
  },
  void: {
    id: 'void',
    name: '空之卷・無念無想',
    shortName: '空之卷',
    icon: '🌌',
    counters: 'water',
    counterDesc: '克制【水之卷】(太虛納百川)',
    desc: '空空如也，亦納萬象。全屬性 +15%，武學奧義觸發率額外 +15%。',
    buffs: { atkPct: 15, defPct: 15, artProcBonus: 15 }
  }
};

export const SAMURAI_ARTS: SamuraiArt[] = [
  {
    id: 'art_iaido',
    name: '居合・拔刀斬',
    style: '一擊必殺',
    icon: '⚡',
    procChance: 35,
    powerMult: 2.2,
    desc: '刀刃出鞘瞬間撕裂長空，必定命中並附帶 100% 暴擊！',
    reqLevel: 1,
    critGuaranteed: true
  },
  {
    id: 'art_tsubame',
    name: '燕返・二連閃',
    style: '連斬破甲',
    icon: '🕊️',
    procChance: 40,
    powerMult: 1.6,
    desc: '佐佐木秘傳無雙劍法，瞬息連續揮出兩道凌厲風刃！',
    reqLevel: 3
  },
  {
    id: 'art_kagutsuchi',
    name: '紅蓮・迦具土',
    style: '真傷灼燒',
    icon: '🔥',
    procChance: 30,
    powerMult: 1.8,
    desc: '引燃火神之怒，使目標陷入灼燒狀態，造成 35% 攻擊力的無視防禦真實傷害！',
    reqLevel: 6,
    burnTrueDmg: 35
  },
  {
    id: 'art_niten_ryu',
    name: '二天一流・雙龍破',
    style: '五輪極意',
    icon: '🐉',
    procChance: 25,
    powerMult: 2.8,
    desc: '左右長短雙刀齊出，如雙龍交錯絞殺，對首領造成毀滅打擊！',
    reqLevel: 10
  },
  {
    id: 'art_fudo_kabe',
    name: '不動明王・金剛壁',
    style: '鐵壁反傷',
    icon: '🛡️',
    procChance: 30,
    powerMult: 1.2,
    desc: '喚起金剛護體，暫時大幅提升防禦力，並將受到傷害的 50% 彈回給敵人！',
    reqLevel: 15,
    defBuff: 50
  },
  {
    id: 'art_blood_cherry',
    name: '血櫻・狂骨吸魂',
    style: '嗜血續航',
    icon: '🌸',
    procChance: 35,
    powerMult: 1.7,
    desc: '櫻落如血，斬擊同時將造成的 30% 傷害轉化為自身生命！',
    reqLevel: 20,
    healPct: 30
  },
  {
    id: 'art_zanshin_counter',
    name: '殘心・見切反擊',
    style: '閃避破綻',
    icon: '👁️',
    procChance: 28,
    powerMult: 2.4,
    desc: '看穿對手刀路破綻，完美化解攻勢並予以 2.4 倍致命反擊！',
    reqLevel: 25
  },
  {
    id: 'art_shigure_bleed',
    name: '時雨・千刃流血',
    style: '折磨失血',
    icon: '🩸',
    procChance: 33,
    powerMult: 1.5,
    desc: '細密如秋雨的連續刺擊，使目標傷口崩裂，持續 3 回合受失血傷害！',
    reqLevel: 30,
    bleedTurns: 3
  },
  {
    id: 'art_amaterasu_mirror',
    name: '天照・八咫鏡佑',
    style: '神聖護佑',
    icon: '🪞',
    procChance: 22,
    powerMult: 2.0,
    desc: '出雲神光護佑，立即驅散一切負面狀態，並在 3 秒內免受致死打擊！',
    reqLevel: 35
  },
  {
    id: 'art_asura_wrath',
    name: '阿修羅・羅剎六臂',
    style: '狂暴怒意',
    icon: '👺',
    procChance: 20,
    powerMult: 3.2,
    desc: '引動修羅怒火，六道刀光瞬間齊斬，爆發毀天滅地的巨額狂暴傷害！',
    reqLevel: 40
  },
  {
    id: 'art_moon_illusion',
    name: '朧月・幻影殘影',
    style: '殘影迷惑',
    icon: '🌙',
    procChance: 26,
    powerMult: 2.1,
    desc: '身形如月下霧氣飄渺，大幅提高閃避率，使下一次揮刀必定暴擊！',
    reqLevel: 45,
    critGuaranteed: true
  },
  {
    id: 'art_tenmei_divine',
    name: '天明・破邪滅度',
    style: '終極鎮魔',
    icon: '✨',
    procChance: 18,
    powerMult: 4.2,
    desc: '匯聚天明七年萬千黎民的不滅意志，凝聚破邪金光，給予常世妖魔終極審判！',
    reqLevel: 50
  }
];
