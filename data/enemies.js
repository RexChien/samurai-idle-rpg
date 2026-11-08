// 戰役地圖與敵人資料庫 (Campaign Maps & Enemies Database)

window.ZONES_DATA = [
  {
    id: 1,
    name: "尾張・荒野竹林",
    subtitle: "初出茅廬・落魄浪人之歷練",
    bgColor: "linear-gradient(180deg, #182218 0%, #0d140e 100%)",
    themeColor: "#4ade80",
    requiredLevel: 1,
    enemies: [
      { name: "持棒野盜", title: "雜寇", avatar: "🪵", hp: 75, atk: 12, def: 1, exp: 20, gold: 18, steel: 1 },
      { name: "竹林野伏", title: "強盜", avatar: "🦹", hp: 140, atk: 20, def: 3, exp: 35, gold: 30, steel: 2 },
      { name: "落魄足輕", title: "逃兵", avatar: "💂", hp: 220, atk: 30, def: 5, exp: 55, gold: 48, steel: 3 }
    ],
    boss: {
      name: "破戒僧・豪圓",
      title: "【第一幕 守門狂僧】",
      avatar: "📿",
      hp: 750,
      atk: 55,
      def: 12,
      exp: 300,
      gold: 250,
      steel: 15,
      dropSword: "sword_04", // 和泉守兼定
      dropItem: "mat_whetstone_mid"
    }
  },
  {
    id: 2,
    name: "伏見・千本鳥居",
    subtitle: "紅門幽影・伊賀忍者之刺殺",
    bgColor: "linear-gradient(180deg, #2b110e 0%, #160706 100%)",
    themeColor: "#f87171",
    requiredLevel: 10,
    enemies: [
      { name: "下忍・影縫", title: "刺客", avatar: "🥷", hp: 750, atk: 68, def: 18, exp: 90, gold: 80, steel: 5 },
      { name: "伏見狐火靈", title: "妖狐", avatar: "🦊", hp: 1100, atk: 95, def: 25, exp: 140, gold: 120, steel: 8 },
      { name: "手裏劍突擊者", title: "精銳", avatar: "🪃", hp: 1500, atk: 125, def: 35, exp: 200, gold: 180, steel: 12 }
    ],
    boss: {
      name: "甲賀上忍・夜叉丸",
      title: "【第二幕 幻影忍魁】",
      avatar: "🦅",
      hp: 5500,
      atk: 210,
      def: 60,
      exp: 1000,
      gold: 800,
      steel: 35,
      dropSword: "sword_05", // 加州清光
      dropItem: "helm_02"
    }
  },
  {
    id: 3,
    name: "京都・三條夜街",
    subtitle: "風雲幕末・尊攘志士與壬生狼",
    bgColor: "linear-gradient(180deg, #1e1b2e 0%, #0d0c17 100%)",
    themeColor: "#818cf8",
    requiredLevel: 25,
    enemies: [
      { name: "倒幕尊王派志士", title: "激進武士", avatar: "📜", hp: 2600, atk: 190, def: 55, exp: 320, gold: 280, steel: 18 },
      { name: "柳生門叛徒劍客", title: "新陰流", avatar: "🥋", hp: 3800, atk: 260, def: 80, exp: 480, gold: 420, steel: 25 },
      { name: "破戒新選組員", title: "脫藩狼", avatar: "🐺", hp: 5200, atk: 340, def: 110, exp: 700, gold: 600, steel: 35 }
    ],
    boss: {
      name: "示現流狂徒・大石",
      title: "【第三幕 斬人太刀】",
      avatar: "⚡",
      hp: 18000,
      atk: 520,
      def: 180,
      exp: 3000,
      gold: 2400,
      steel: 90,
      dropSword: "sword_08", // 同田貫正國
      dropItem: "armor_03"
    }
  },
  {
    id: 4,
    name: "越後・雪嶺古關",
    subtitle: "白雪染血・軍神上杉之鐵騎",
    bgColor: "linear-gradient(180deg, #14222e 0%, #080f17 100%)",
    themeColor: "#38bdf8",
    requiredLevel: 45,
    enemies: [
      { name: "越後雪嶺野狼", title: "魔獸", avatar: "🐺", hp: 8500, atk: 450, def: 150, exp: 1100, gold: 950, steel: 50 },
      { name: "毘沙門堂僧兵", title: "破戒兵", avatar: "🔱", hp: 12000, atk: 600, def: 220, exp: 1600, gold: 1400, steel: 70 },
      { name: "上杉家旗本鐵騎", title: "騎馬武士", avatar: "🐎", hp: 16500, atk: 780, def: 300, exp: 2300, gold: 2000, steel: 100 }
    ],
    boss: {
      name: "雪將軍・長尾景連",
      title: "【第四幕 霜雪刀聖】",
      avatar: "🐲",
      hp: 55000,
      atk: 1200,
      def: 450,
      exp: 9000,
      gold: 7500,
      steel: 260,
      dropSword: "sword_11", // 菊一文字則宗
      dropItem: "mat_whetstone_fine"
    }
  },
  {
    id: 5,
    name: "本能寺・紅蓮業火",
    subtitle: "天魔降臨・織田信長之烈焰",
    bgColor: "linear-gradient(180deg, #360f0f 0%, #170404 100%)",
    themeColor: "#f97316",
    requiredLevel: 65,
    enemies: [
      { name: "焦黑魔化足輕", title: "業火怨偶", avatar: "🧟", hp: 25000, atk: 1100, def: 420, exp: 3500, gold: 3000, steel: 150 },
      { name: "紅蓮鐵砲眾", title: "南蠻火槍", avatar: "💥", hp: 36000, atk: 1550, def: 550, exp: 5000, gold: 4400, steel: 220 },
      { name: "侍衛・焦黑蘭丸", title: "忠魂", avatar: "🥀", hp: 50000, atk: 2100, def: 720, exp: 7500, gold: 6500, steel: 320 }
    ],
    boss: {
      name: "第六天魔王・信長殘影",
      title: "【第五幕 人間五十年】",
      avatar: "👑",
      hp: 170000,
      atk: 3200,
      def: 1100,
      exp: 30000,
      gold: 25000,
      steel: 800,
      dropSword: "sword_12", // 千子村正
      dropItem: "helm_05"
    }
  },
  {
    id: 6,
    name: "關原・修羅血河",
    subtitle: "天下大亂・十萬甲冑無盡悲鳴",
    bgColor: "linear-gradient(180deg, #240a2b 0%, #0c0210 100%)",
    themeColor: "#c084fc",
    requiredLevel: 85,
    enemies: [
      { name: "戰死赤備猛將", title: "修羅亡魂", avatar: "🔴", hp: 80000, atk: 3100, def: 1100, exp: 12000, gold: 10000, steel: 500 },
      { name: "影武者怨靈", title: "幻魔", avatar: "👻", hp: 115000, atk: 4200, def: 1500, exp: 18000, gold: 15000, steel: 750 },
      { name: "百戰無雙侍魂", title: "古代英靈", avatar: "💀", hp: 160000, atk: 5600, def: 2000, exp: 27000, gold: 23000, steel: 1100 }
    ],
    boss: {
      name: "赤鬼修羅・井伊殘念",
      title: "【第六幕 戰場鬼神】",
      avatar: "👹",
      hp: 550000,
      atk: 8800,
      def: 3000,
      exp: 100000,
      gold: 85000,
      steel: 3500,
      dropSword: "sword_15", // 童子切安綱
      dropItem: "armor_05"
    }
  },
  {
    id: 7,
    name: "江戶城・天守極頂",
    subtitle: "終焉之巔・劍聖宮本武藏之考驗",
    bgColor: "linear-gradient(180deg, #1e1a12 0%, #0a0805 100%)",
    themeColor: "#eab308",
    requiredLevel: 105,
    enemies: [
      { name: "將軍禁衛直參旗本", title: "御前劍術", avatar: "⛩️", hp: 300000, atk: 8500, def: 3200, exp: 45000, gold: 40000, steel: 1800 },
      { name: "御庭番頭目", title: "暗黑忍首", avatar: "👁️", hp: 440000, atk: 11500, def: 4200, exp: 68000, gold: 60000, steel: 2600 },
      { name: "新陰流宗家之影", title: "活人劍", avatar: "☯️", hp: 600000, atk: 15000, def: 5500, exp: 95000, gold: 85000, steel: 3800 }
    ],
    boss: {
      name: "天下無雙・宮本武藏之魂",
      title: "【最終章 二天一流極意】",
      avatar: "⚔️",
      hp: 2000000,
      atk: 25000,
      def: 8000,
      exp: 400000,
      gold: 350000,
      steel: 12000,
      dropSword: "sword_16", // 三日月宗近
      dropItem: "acc_04"
    }
  }
];
