/**
 * 《武士之刃：無雙斬》成就系統與每日簽到 (data/rewards.js)
 * 1. 暗黑 3 式螢幕中下方金邊成就橫幅
 * 2. 35+ 豐富成就
 * 3. 7 日每日簽到獎勵系統
 */
(function() {
  'use strict';

  // 7 日簽到配置
  const DAILY_SIGNIN_REWARDS = [
    { day: 1, name: '初入江湖禮包', icon: '💰', gold: 5000, iron: 25, souls: 5, desc: '金幣 x5,000、玉鋼 x25、強化魂玉 x5' },
    { day: 2, name: '名工鍛造禮包', icon: '🗡️', gold: 10000, iron: 40, souls: 10, gearQuality: 'rare', desc: '金幣 x10,000、稀有神兵寶箱 x1' },
    { day: 3, name: '戰國甲冑禮包', icon: '🥋', gold: 15000, iron: 60, souls: 15, gearQuality: 'epic', desc: '金幣 x15,000、史詩戰甲寶箱 x1' },
    { day: 4, name: '修羅玄鐵禮包', icon: '💎', gold: 25000, iron: 100, souls: 25, desc: '金幣 x25,000、玉鋼 x100、魂玉 x25' },
    { day: 5, name: '道場修驗禮包', icon: '📜', gold: 35000, iron: 150, souls: 40, desc: '金幣 x35,000、玉鋼 x150、魂玉 x40' },
    { day: 6, name: '傳奇神工寶箱', icon: '🏆', gold: 50000, iron: 200, souls: 60, gearQuality: 'legendary', desc: '金幣 x50,000、傳奇名品寶箱 x1' },
    { day: 7, name: '遠古暗金大賞', icon: '👑', gold: 100000, iron: 500, souls: 150, gearQuality: 'ancient', title: '天下無雙', desc: '金幣 x100,000、遠古暗金神兵 x1、限定稱號【天下無雙】' }
  ];

  // 35+ 豐富成就庫 (Diablo 3 樣式)
  const ACHIEVEMENTS_DB = [
    // 戰鬥與討伐類
    { id: 'kill_10', category: 'combat', name: '初試鋒芒', icon: '🗡️', desc: '累計討伐 10 隻妖怪', target: 10, points: 10, reward: { gold: 1000, iron: 10 } },
    { id: 'kill_50', category: 'combat', name: '百妖莫近', icon: '⚔️', desc: '累計討伐 50 隻妖怪', target: 50, points: 15, reward: { gold: 3000, iron: 25 } },
    { id: 'kill_200', category: 'combat', name: '斬妖除魔', icon: '👺', desc: '累計討伐 200 隻妖怪', target: 200, points: 25, reward: { gold: 10000, iron: 60 } },
    { id: 'kill_500', category: 'combat', name: '千人斬劍客', icon: '🩸', desc: '累計討伐 500 隻妖怪', target: 500, points: 50, reward: { gold: 30000, souls: 20 } },
    { id: 'kill_1000', category: 'combat', name: '萬鬼夜行破除者', icon: '💀', desc: '累計討伐 1,000 隻妖怪', target: 1000, points: 100, reward: { gold: 80000, souls: 60 } },

    // 首領討伐類
    { id: 'boss_1', category: 'boss', name: '平定櫻落村', icon: '🌸', desc: '擊敗第一章首領「鬼丸十藏」', target: 1, points: 20, reward: { gold: 5000, gearQuality: 'rare' } },
    { id: 'boss_2', category: 'boss', name: '破除幽冥幻境', icon: '🎋', desc: '擊敗第二章首領「青面夜叉」', target: 1, points: 30, reward: { gold: 12000, gearQuality: 'rare' } },
    { id: 'boss_3', category: 'boss', name: '高野山天狗伏誅', icon: '🦅', desc: '擊敗第三章首領「大天狗真幻」', target: 1, points: 40, reward: { gold: 25000, gearQuality: 'epic' } },
    { id: 'boss_4', category: 'boss', name: '長篠之魂安息', icon: '💀', desc: '擊敗第四章首領「骸骨大名」', target: 1, points: 50, reward: { gold: 45000, gearQuality: 'epic' } },
    { id: 'boss_5', category: 'boss', name: '破除本能寺妖火', icon: '🏯', desc: '擊敗第五章首領「幻惑大名明智」', target: 1, points: 70, reward: { gold: 80000, gearQuality: 'legendary' } },
    { id: 'boss_6', category: 'boss', name: '誅滅八岐真身', icon: '🐉', desc: '擊敗第六章首領「八岐大蛇真身」', target: 1, points: 90, reward: { gold: 150000, gearQuality: 'legendary' } },
    { id: 'boss_7', category: 'boss', name: '天下第一人', icon: '👑', desc: '擊敗第七章終極首領「織田信長」', target: 1, points: 150, reward: { gold: 300000, gearQuality: 'ancient', title: '神域霸主' } },

    // 打寶與裝備類
    { id: 'loot_magic', category: 'loot', name: '靈光初現', icon: '🔷', desc: '獲得第一件魔法 (藍色) 品質裝備', target: 1, points: 10, reward: { gold: 2000 } },
    { id: 'loot_rare', category: 'loot', name: '名工名匠', icon: '🟨', desc: '獲得第一件稀有 (黃色) 品質裝備', target: 1, points: 20, reward: { gold: 5000 } },
    { id: 'loot_epic', category: 'loot', name: '史詩降世', icon: '🟪', desc: '獲得第一件史詩 (紫色) 品質裝備', target: 1, points: 35, reward: { gold: 15000, iron: 50 } },
    { id: 'loot_legendary', category: 'loot', name: '金光沖天！', icon: '🟧', desc: '獲得第一件傳奇 (橘金) 品質裝備，觸發暗金光柱！', target: 1, points: 60, reward: { gold: 40000, souls: 30 } },
    { id: 'loot_ancient', category: 'loot', name: '太古神話現世', icon: '🟥', desc: '獲得第一件遠古暗金 (紅色) 品質神裝！', target: 1, points: 100, reward: { gold: 100000, souls: 80, title: '天選之人' } },
    { id: 'loot_full_epic', category: 'loot', name: '武士全副武裝', icon: '🥋', desc: '全身 6 個槽位全部穿戴史詩或更高品質裝備', target: 6, points: 50, reward: { gold: 50000, souls: 40 } },

    // 強化與鍛造類
    { id: 'upgrade_1', category: 'forge', name: '小試鐵鎚', icon: '🔨', desc: '成功強化任一件裝備至 +1', target: 1, points: 10, reward: { iron: 20 } },
    { id: 'upgrade_5', category: 'forge', name: '百鍊成鋼', icon: '⚒️', desc: '成功強化任一件裝備至 +5', target: 5, points: 25, reward: { iron: 50, souls: 10 } },
    { id: 'upgrade_10', category: 'forge', name: '神工造化', icon: '✨', desc: '成功強化任一件裝備至 +10', target: 10, points: 60, reward: { iron: 150, souls: 40 } },
    { id: 'decompose_10', category: 'forge', name: '去蕪存菁', icon: '♻️', desc: '累計分解 10 件不需要的裝備', target: 10, points: 10, reward: { gold: 3000 } },
    { id: 'decompose_50', category: 'forge', name: '玄鐵大師', icon: '🪨', desc: '累計分解 50 件裝備', target: 50, points: 30, reward: { iron: 80 } },

    // 戰力與角色成長
    { id: 'level_10', category: 'growth', name: '步入武林', icon: '📈', desc: '角色等級達到 10 級', target: 10, points: 15, reward: { gold: 5000 } },
    { id: 'level_30', category: 'growth', name: '名揚一方', icon: '📜', desc: '角色等級達到 30 級', target: 30, points: 30, reward: { gold: 20000 } },
    { id: 'level_50', category: 'growth', name: '一派宗師', icon: '🏮', desc: '角色等級達到 50 級', target: 50, points: 50, reward: { gold: 60000, souls: 30 } },
    { id: 'level_80', category: 'growth', name: '登峰造極', icon: '⛰️', desc: '角色等級達到 80 級', target: 80, points: 100, reward: { gold: 150000, souls: 100, title: '天下無雙' } },
    { id: 'power_1000', category: 'growth', name: '千夫莫敵', icon: '💪', desc: '綜合戰力突破 1,000 點', target: 1000, points: 20, reward: { gold: 8000 } },
    { id: 'power_5000', category: 'growth', name: '萬夫莫當', icon: '🔥', desc: '綜合戰力突破 5,000 點', target: 5000, points: 40, reward: { gold: 35000 } },
    { id: 'power_20000', category: 'growth', name: '神魔之境', icon: '⚡', desc: '綜合戰力突破 20,000 點', target: 20000, points: 80, reward: { gold: 100000, souls: 50 } },

    // 天賦與拍賣場
    { id: 'talent_10', category: 'system', name: '明悟劍理', icon: '🌳', desc: '累計投入 10 點天賦點數', target: 10, points: 15, reward: { gold: 5000 } },
    { id: 'talent_30', category: 'system', name: '大道初成', icon: '🌟', desc: '累計投入 30 點天賦點數', target: 30, points: 35, reward: { gold: 25000 } },
    { id: 'market_buy_1', category: 'system', name: '市集尋寶', icon: '⚖️', desc: '在拍賣場購買第一件裝備', target: 1, points: 15, reward: { gold: 5000 } },
    { id: 'market_sell_1', category: 'system', name: '豪商崛起', icon: '🪙', desc: '在拍賣場成功上架販售第一件裝備', target: 1, points: 15, reward: { gold: 5000 } },
    { id: 'gold_100k', category: 'wealth', name: '富甲一方', icon: '💴', desc: '持有金幣突破 100,000 兩', target: 100000, points: 30, reward: { souls: 20 } },
    { id: 'gold_1m', category: 'wealth', name: '大和巨賈', icon: '🏦', desc: '持有金幣突破 1,000,000 兩', target: 1000000, points: 80, reward: { souls: 100, title: '黃金武士' } }
  ];

  window.DAILY_SIGNIN_REWARDS = DAILY_SIGNIN_REWARDS;
  window.ACHIEVEMENTS_DB = ACHIEVEMENTS_DB;

})();
