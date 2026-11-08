import type { GearQuality } from '../types/game';

export interface AchievementItem {
  id: string;
  name: string;
  desc: string;
  icon: string;
  points: number;
  category: 'kill' | 'boss' | 'loot' | 'upgrade' | 'power' | 'gold' | 'special';
  target: number;
  reward?: {
    gold?: number;
    iron?: number;
    souls?: number;
    title?: string;
    gearQuality?: GearQuality;
  };
}

export const ACHIEVEMENTS_DB: AchievementItem[] = [
  { id: 'kill_10', name: '出露鋒芒', desc: '累計討伐 10 隻常世妖魔', icon: '🗡️', points: 10, category: 'kill', target: 10, reward: { gold: 200, iron: 10 } },
  { id: 'kill_50', name: '百鍊刀芒', desc: '累計討伐 50 隻常世妖魔', icon: '⚔️', points: 15, category: 'kill', target: 50, reward: { gold: 500, iron: 30 } },
  { id: 'kill_200', name: '千人斬初窺', desc: '累計討伐 200 隻常世妖魔', icon: '👹', points: 25, category: 'kill', target: 200, reward: { gold: 2000, iron: 100, title: '百斬浪人' } },
  { id: 'kill_1000', name: '修羅化身', desc: '累計討伐 1,000 隻常世妖魔', icon: '👺', points: 50, category: 'kill', target: 1000, reward: { gold: 10000, souls: 50, title: '千人斬修羅' } },
  { id: 'boss_1', name: '破魔初啼', desc: '首次討伐強大首領魔將', icon: '👑', points: 20, category: 'boss', target: 1, reward: { gold: 1000, iron: 50, gearQuality: 'rare' } },
  { id: 'boss_10', name: '群魔震懾', desc: '討伐 10 尊首領魔將', icon: '💀', points: 35, category: 'boss', target: 10, reward: { gold: 5000, souls: 20, gearQuality: 'epic' } },
  { id: 'loot_legendary', name: '天降神兵', desc: '首次尋獲傳奇（橙色）品質武具', icon: '🌟', points: 40, category: 'loot', target: 1, reward: { gold: 3000, souls: 15, title: '神兵宿主' } },
  { id: 'loot_ancient', name: '太古神話', desc: '尋獲至高無上的太古神話（紅色）武具', icon: '🔥', points: 80, category: 'loot', target: 1, reward: { gold: 20000, souls: 100, title: '太古傳承者' } },
  { id: 'upgrade_5', name: '大師鍛造', desc: '將任一件裝備鍛造強化至 +5', icon: '🔨', points: 25, category: 'upgrade', target: 5, reward: { gold: 1500, iron: 80 } },
  { id: 'upgrade_10', name: '鬼斧神工', desc: '將任一件裝備鍛造強化至 +10', icon: '⚡', points: 50, category: 'upgrade', target: 10, reward: { gold: 8000, souls: 40, title: '神匠之友' } },
  { id: 'level_20', name: '名動洛中', desc: '武士等級達到 Lv.20', icon: '📜', points: 30, category: 'special', target: 20, reward: { gold: 3000, iron: 120 } },
  { id: 'level_50', name: '劍道宗師', desc: '武士等級達到 Lv.50', icon: '🏯', points: 60, category: 'special', target: 50, reward: { gold: 15000, souls: 80, title: '一代宗師' } },
  { id: 'power_5000', name: '氣貫長虹', desc: '綜合戰力突破 5,000 點', icon: '💪', points: 35, category: 'power', target: 5000, reward: { gold: 4000, iron: 150 } },
  { id: 'power_50000', name: '傲視群雄', desc: '綜合戰力突破 50,000 點', icon: '🦅', points: 70, category: 'power', target: 50000, reward: { gold: 25000, souls: 150, title: '天下威懾' } }
];

export const DAILY_SIGNIN_REWARDS = [
  { day: 1, desc: '💰 金幣 500 兩 ＋ 🪨 玉鋼 20 塊', gold: 500, iron: 20 },
  { day: 2, desc: '💰 金幣 1,000 兩 ＋ 📿 精良裝備寶匣', gold: 1000, gearQuality: 'magic' as GearQuality },
  { day: 3, desc: '💰 金幣 2,000 兩 ＋ 🔮 魂玉 15 個', gold: 2000, souls: 15 },
  { day: 4, desc: '🪨 玉鋼 100 塊 ＋ 📿 稀世名器寶匣', iron: 100, gearQuality: 'rare' as GearQuality },
  { day: 5, desc: '💰 金幣 5,000 兩 ＋ 🔮 魂玉 30 個', gold: 5000, souls: 30 },
  { day: 6, desc: '🎖️ 專屬稱號【天明孤傲者】 ＋ 史詩神兵', title: '天明孤傲者', gearQuality: 'epic' as GearQuality },
  { day: 7, desc: '🌟 傳奇太古神兵寶匣 ＋ 💰 金幣 10,000 兩 ＋ 🔮 魂玉 100 個', gold: 10000, souls: 100, gearQuality: 'legendary' as GearQuality }
];
