// ==========================================================
// 《無雙劍心：武士之刃》劍心輪迴與轉生天賦神龕資料庫
// Samurai Blade: Idle RPG - Prestige & Reincarnation Database
// ==========================================================

window.PRESTIGE_DATA = {
  // 轉生門檻：通過第 3 幕（京都三條）或等級達 15
  unlockLevel: 15,
  unlockZone: 3,

  // 8 大輪迴永久神龕天賦 (Permanent Rebirth Perks)
  perks: [
    {
      id: "perk_atk",
      name: "武神氣脈",
      icon: "⚔️",
      maxLevel: 25,
      costBase: 15,
      costMult: 1.35,
      bonusPerLevel: 15, // +15% 基礎攻擊力
      desc: "喚醒先祖劍聖之殺伐神力，永久提升全域基礎攻擊力 +15%/級。"
    },
    {
      id: "perk_hp",
      name: "金剛體魄",
      icon: "🛡️",
      maxLevel: 25,
      costBase: 15,
      costMult: 1.35,
      bonusPerLevel: 20, // +20% 體力上限
      desc: "如不壞金剛身，永久提升武士最大體力上限 +20%/級。"
    },
    {
      id: "perk_speed",
      name: "神速極意",
      icon: "⚡",
      maxLevel: 15,
      costBase: 25,
      costMult: 1.45,
      bonusPerLevel: 8, // +8% 拔刀速度
      desc: "超越肉身極限的居合拔刀術，永久提升拔刀速度與神速自律斬擊頻率 +8%/級。"
    },
    {
      id: "perk_crit",
      name: "天眼心眼",
      icon: "👁️",
      maxLevel: 20,
      costBase: 25,
      costMult: 1.4,
      critPerLevel: 2, // +2% 暴擊率
      critDmgPerLevel: 15, // +15% 暴擊傷害
      desc: "心眼洞徹萬物破綻，永久提升會心率 +2%/級、會心傷害 +15%/級。"
    },
    {
      id: "perk_forge",
      name: "踏鞴神佑",
      icon: "🔥",
      maxLevel: 15,
      costBase: 35,
      costMult: 1.5,
      bonusPerLevel: 4, // 鍛造高品質機率提升
      desc: "備前長船與三條宗近神靈庇佑，鍛造獲得【良業物】、【大業物】與【天下五劍】之機率永久提升 +4%/級。"
    },
    {
      id: "perk_wealth",
      name: "大黑天招財",
      icon: "🪙",
      maxLevel: 25,
      costBase: 20,
      costMult: 1.35,
      bonusPerLevel: 25, // 金幣與玉鋼獲取量 +25%/級
      desc: "福德之神大黑天護佑，戰鬥與熔煉時獲得之金小判與玉鋼永久額外提升 +25%/級。"
    },
    {
      id: "perk_wisdom",
      name: "輪迴宿慧",
      icon: "🌀",
      maxLevel: 15,
      costBase: 40,
      costMult: 1.55,
      startLevelPerLevel: 2, // 轉生初始等級保留
      desc: "宿世修為化為本能，每次轉生重生後，初始起步等級直接保留 +2 級/級（最高重生即達 Lv.31）。"
    },
    {
      id: "perk_boss_slayer",
      name: "破軍斬魔",
      icon: "👹",
      maxLevel: 20,
      costBase: 30,
      costMult: 1.4,
      bossDmgPerLevel: 20, // 對 Boss 傷害 +20%
      penPerLevel: 4, // 破甲 +4%
      desc: "專斬天下妖魔與豪傑首領，對所有關卡首領傷害永久 +20%/級，破甲穿透 +4%/級。"
    }
  ],

  // 計算升級所需之魂火
  getPerkCost: function(perkId, currentLevel) {
    const perk = this.perks.find(p => p.id === perkId);
    if (!perk) return 999999;
    if (currentLevel >= perk.maxLevel) return Infinity;
    return Math.floor(perk.costBase * Math.pow(perk.costMult, currentLevel));
  },

  // 計算轉生獲得之輪迴魂火
  calculateKarmaEarned: function(player) {
    const levelKarma = Math.floor(player.level * 1.5);
    const zoneKarma = (player.stats.highestZone || 1) * 20;
    const bossKarma = (player.stats.bossKills || 0) * 3;
    const swordsKarma = (player.swordsInventory ? player.swordsInventory.length : 0) * 2;
    const endingsKarma = (player.story && player.story.unlockedEndings ? player.story.unlockedEndings.length : 0) * 100;
    let total = Math.max(15, levelKarma + zoneKarma + bossKarma + swordsKarma + endingsKarma);
    if (player.story && player.story.faction === 'ishin') {
      total = Math.floor(total * 1.25); // 尊皇倒幕維新：魂火收益提升 25%
    }
    return total;
  }
};
