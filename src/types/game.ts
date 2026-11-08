/**
 * 新武士道列傳 RPG (Shin Bushido Retsuden RPG) — 核心 TypeScript 型別定義
 */

export type GearSlot = 'weapon' | 'offhand' | 'helm' | 'armor' | 'boots' | 'accessory';
export type GearQuality = 'common' | 'magic' | 'rare' | 'epic' | 'legendary' | 'ancient';

export interface GearAffix {
  stat: string;
  value: number;
  text: string;
}

export interface LegendaryPower {
  id: string;
  name: string;
  desc: string;
  mult?: number;
}

export interface GearItem {
  uid: string;
  name: string;
  slot: GearSlot;
  slotName: string;
  quality: GearQuality;
  icon: string;
  level: number;
  baseAtk?: number;
  baseDef?: number;
  baseHP?: number;
  gearScore: number;
  upgradeLevel: number;
  affixes: GearAffix[];
  legendaryPower?: LegendaryPower;
  lore: string;
  beamColor?: string;
  price?: number;
}

export interface FiveRingsStance {
  id: 'earth' | 'water' | 'fire' | 'wind' | 'void';
  name: string;
  shortName: string;
  icon: string;
  counters: 'earth' | 'water' | 'fire' | 'wind' | 'void';
  counterDesc: string;
  desc: string;
  buffs: {
    atkPct?: number;
    defPct?: number;
    critRate?: number;
    critDmg?: number;
    evasion?: number;
    lifesteal?: number;
    thorns?: number;
    artProcBonus?: number;
  };
}

export interface SamuraiArt {
  id: string;
  name: string;
  style: string;
  icon: string;
  procChance: number;
  powerMult: number;
  desc: string;
  reqLevel: number;
  spCost?: number;
  targetType?: 'single' | 'all' | 'heal_party';
  casterName?: string;
  burnTrueDmg?: number;
  healPct?: number;
  bleedTurns?: number;
  defBuff?: number;
  critGuaranteed?: boolean;
}

export interface AutomationTier {
  tier: number;
  name: string;
  unlockReq: string;
  intervalMs: number;
  badge: string;
  desc: string;
}

export interface QuestReward {
  exp?: number;
  gold?: number;
  iron?: number;
  souls?: number;
  title?: string;
  gearQuality?: GearQuality;
}

export interface QuestItem {
  id: string;
  type: 'main' | 'side' | 'bounty';
  chapter?: string;
  title: string;
  npc: string;
  npcAvatar: string;
  dialogue: string;
  lore: string;
  targetKills: number;
  zone: string;
  recommendedPower: number;
  rewards: QuestReward;
  unlocksAutomationTier?: number;
}

export interface MapPOI {
  id: string;
  name: string;
  type: 'town' | 'shrine' | 'chest' | 'boss_rift' | 'npc';
  x: number;
  y: number;
  icon: string;
  desc: string;
  unlocked?: boolean;
}

export interface MapYokai {
  id: string;
  name: string;
  avatar: string;
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  x: number;
  y: number;
  patrolOriginX: number;
  patrolOriginY: number;
  patrolRadius: number;
  vx: number;
  vy: number;
  stance: 'earth' | 'water' | 'fire' | 'wind' | 'void';
  isBoss?: boolean;
}

export interface BattleUnitEnemy {
  id: string;
  name: string;
  avatar: string;
  level: number;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  stance: 'earth' | 'water' | 'fire' | 'wind' | 'void';
  isBoss?: boolean;
  defBrokenTurns?: number;
}

export interface PartyMemberStatus {
  id: 'leader' | 'kaede' | 'hayate';
  name: string;
  roleTitle: string;
  avatar: string;
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  pow: number; // 怒氣槽 0 ~ 100
}

export interface ConsumableItem {
  id: 'dango' | 'matcha' | 'sake' | 'elixir';
  name: string;
  icon: string;
  desc: string;
  price: number;
  count: number;
}

export interface PvPOpponent {
  id: string;
  name: string;
  avatar: string;
  title: string;
  level: number;
  power: number;
  stance: 'earth' | 'water' | 'fire' | 'wind' | 'void';
  classId: string;
  buildTag: string;
  ratingGain: number;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  evasion: number;
  lifesteal: number;
  thorns: number;
  power: number;
}

export interface PlayerData {
  characterCreated: boolean;
  name: string;
  classId: string;
  level: number;
  exp: number;
  maxExp: number;
  gold: number;
  iron: number;
  souls: number;
  talentPoints: number;
  talents: Record<string, number>;
  stance: 'earth' | 'water' | 'fire' | 'wind' | 'void';
  equippedArts: string[];
  automationTier: number;
  autoSlashEnabled: boolean;
  inTown: boolean;
  townBuffUntil: number;
  currentMapZone: string;
  mapX: number;
  mapY: number;
  targetMapX: number | null;
  targetMapY: number | null;
  consumables?: Record<string, number>;
  cosmetics: {
    avatar: string;
    bladeTrail: string;
    title: string;
  };
  equipped: Record<GearSlot, GearItem | null>;
  inventory: GearItem[];
  settings: {
    autoDecomposeCommon: boolean;
    autoDecomposeMagic: boolean;
    autoDecomposeRare: boolean;
    soundEnabled: boolean;
  };
  quests: {
    currentMainIndex: number;
    mainProgress: Record<string, number>;
    completedMain: string[];
    sideProgress: Record<string, number>;
    completedSide: string[];
    bounties: { id: string; quest: QuestItem; progress: number }[];
  };
  pvp: {
    rating: number;
    wins: number;
    losses: number;
    streak: number;
    opponents: PvPOpponent[];
    lastLog: string[];
  };
  abyss: {
    floor: number;
    highestFloor: number;
  };
  achievements: Record<string, { unlocked: boolean; claimed: boolean; date?: string }>;
  dailySignIn: {
    claimedDays: number;
    lastClaimDate: string | null;
  };
  statsTracked: {
    totalKills: number;
    bossKills: number;
    gearLooted: number;
    legendaryLooted: number;
    ancientLooted: number;
    upgradesSuccess: number;
    marketPurchases: number;
    marketSales: number;
  };
  lastSaveTime: number;
}
