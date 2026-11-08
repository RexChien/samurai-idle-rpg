/**
 * 《武士之刃：無雙斬》100小時史詩任務編年史、《五輪書》武學配招、天下第一武道大會 (PvP) 與無間奈落深淵 (data/quests_pvp.js)
 * 核心設計：
 * 1. 循序漸進解鎖自動機制：初始為手動揮刀，透過完成主線/支線任務逐步解鎖 4 階段自動劍意與離線修煉
 * 2. 100小時劇情分量：30 大主線史詩章節任務 + 20 大奇譚支線任務 + 無限刷新的幕府討伐懸賞令 + 《戰國百鬼繪卷》故事回顧
 * 3. 鑽研打法深度：《五輪書》地、水、火、風、空五大相剋架勢 + 12 大武學奧義自由配招 (3 槽位)
 * 4. 份量無限終局：天下第一武道大會 (PvP 天梯/流派克制/戰報分析/跨玩家挑戰碼) + 無間奈落 1000 層隨機詞綴深淵
 */
(function() {
  'use strict';

  // =========================================================================
  // 1. 自動機制四階段境界 (Progressive Automation Tiers Unlocked by Quests)
  // =========================================================================
  const AUTOMATION_TIERS = {
    0: {
      tier: 0,
      name: '凡骨拔刀（手動修煉）',
      badge: '🔒 尚未領悟自動劍意',
      intervalMs: 0,
      desc: '初入亂世的武士需親手拔刀揮斬（點擊畫面、按鈕或空白鍵，亦支援按住蓄力連斬）。完成【主線 M01：木刀百振・劍心初醒】即可領悟第一重自動劍意！',
      features: ['手動拔刀揮斬', '按住按鈕蓄力連斬']
    },
    1: {
      tier: 1,
      name: '第一重：劍心初醒（基礎自動拔刀）',
      badge: '⚡ 基礎自動 (1.2秒/斬)',
      intervalMs: 1200,
      desc: '領悟呼吸吐納與基礎劍意，開啟自動揮刀（每 1.2 秒自動斬擊一次），並可隨時手動補刀加速！',
      features: ['自動拔刀揮斬 (1.2秒/斬)', '隨時手動點擊疊加傷害']
    },
    2: {
      tier: 2,
      name: '第二重：二天疾風（流暢連斬＆自動拆解）',
      badge: '🌪️ 疾風自動 (0.65秒/斬)',
      intervalMs: 650,
      desc: '討伐黑風寨首領後劍意大進！自動揮刀加速至 0.65 秒/斬，並解鎖行囊「自動拆解白/藍裝熔爐」。',
      features: ['疾風自動連斬 (0.65秒/斬)', '行囊自動分解熔爐']
    },
    3: {
      tier: 3,
      name: '第三重：式神護法（自動奧義＆常世離線修煉）',
      badge: '☯️ 式神自動奧義＆離線掛機',
      intervalMs: 500,
      desc: '締結出雲式神契約！自動揮刀提升至 0.5 秒/斬，戰鬥中自動施放配戴的 3 大武學奧義，並正式啟動「常世離線自動修煉」！',
      features: ['高速自動連斬 (0.5秒/斬)', '戰鬥自動施放武學奧義', '常世離線自動修煉收益']
    },
    4: {
      tier: 4,
      name: '第四重：無念無想（極速神劍＆首領連戰）',
      badge: '🔥 極意神速 (0.35秒/斬)',
      intervalMs: 350,
      desc: '習得鞍馬山天狗秘傳，進入「無念無想」至高劍境！每 0.35 秒極速斬擊、自動施放奧義，並支援首領無限自動連戰！',
      features: ['極速無雙自動斬 (0.35秒/斬)', '奧義冷卻加速 25%', '首領自動循環連戰']
    }
  };

  // =========================================================================
  // 2. 《五輪書》五大戰術架勢系統 (Five Rings Tactical Stances & Counter Loop)
  // 相剋循環：地 克 火 ➔ 火 克 風 ➔ 風 克 空 ➔ 空 克 水 ➔ 水 克 地
  // =========================================================================
  const FIVE_RINGS_STANCES = {
    earth: {
      id: 'earth',
      name: '地之卷・不動磐石',
      shortName: '地之卷',
      icon: '🌍',
      color: '#eab308',
      counters: 'fire',
      counteredBy: 'water',
      counterDesc: '【克制：🔥 火之卷】｜【被克：💧 水之卷】',
      desc: '立身如泰山磐石，防禦力 +40%、受傷減免 +15%、荊棘反傷 +30%。面對強攻猛火流派可穩如泰山並反震重創敵手。',
      bonuses: { defPct: 40, dmgRed: 15, thornsPct: 30 }
    },
    water: {
      id: 'water',
      name: '水之卷・流水化勁',
      shortName: '水之卷',
      icon: '💧',
      color: '#38bdf8',
      counters: 'earth',
      counteredBy: 'void',
      counterDesc: '【克制：🌍 地之卷】｜【被克：🌌 空之卷】',
      desc: '劍意如流水無形，生命吸血 +12%、閃避率 +18%、忽視敵方 30% 反傷與護甲。最擅長瓦解重甲鐵壁流派。',
      bonuses: { lifeSteal: 12, evasion: 18, armorPen: 35 }
    },
    fire: {
      id: 'fire',
      name: '火之卷・烈火強襲',
      shortName: '火之卷',
      icon: '🔥',
      color: '#ef4444',
      counters: 'wind',
      counteredBy: 'earth',
      counterDesc: '【克制：🌪️ 風之卷】｜【被克：🌍 地之卷】',
      desc: '侵略如烈火燎原，攻擊力 +40%、暴擊傷害 +35%、破甲 +25%。以壓倒性的單發重擊粉碎高速連擊流派。',
      bonuses: { atkPct: 40, critDmg: 35, armorPen: 25 }
    },
    wind: {
      id: 'wind',
      name: '風之卷・疾風迅雷',
      shortName: '風之卷',
      icon: '🌪️',
      color: '#4ade80',
      counters: 'void',
      counteredBy: 'fire',
      counterDesc: '【克制：🌌 空之卷】｜【被克：🔥 火之卷】',
      desc: '身法如狂風驟雨，攻擊速度 +45%、連擊率 +28%、暴擊率 +12%。能在奧義流派蓄力前以密集刀網將其壓制。',
      bonuses: { atkSpd: 45, doubleStrike: 28, critRate: 12 }
    },
    void: {
      id: 'void',
      name: '空之卷・無念天道',
      shortName: '空之卷',
      icon: '🌌',
      color: '#c084fc',
      counters: 'water',
      counteredBy: 'wind',
      counterDesc: '【克制：💧 水之卷】｜【被克：🌪️ 風之卷】',
      desc: '洞察萬象虛空，武學奧義傷害 +45%、暴擊率 +15%、全屬性 +12%，並封鎖敵方 40% 吸血續航效果。',
      bonuses: { artDmgBonus: 45, critRate: 15, atkPct: 12, defPct: 12, hpPct: 12 }
    }
  };

  // =========================================================================
  // 3. 十二大武學奧義配招庫 (12 Customizable Samurai Arts - Equip up to 3)
  // =========================================================================
  const SAMURAI_ARTS = [
    {
      id: 'art_tsubame',
      name: '秘劍・燕返',
      icon: '⚔️',
      style: '連擊破甲',
      reqLevel: 1,
      procChance: 28,
      powerMult: 2.3,
      effectType: 'pierce',
      desc: '佐佐木小次郎成名絕技。揮出超越音速的三連閃擊，造成 230% 傷害並無視目標 40% 防禦。'
    },
    {
      id: 'art_guren',
      name: '紅蓮・業火斬',
      icon: '🔥',
      style: '真傷灼燒',
      reqLevel: 1,
      procChance: 25,
      powerMult: 2.0,
      effectType: 'burn',
      desc: '刀鋒纏繞紅蓮業火，造成 200% 傷害，並額外燃燒目標相當於自身攻擊力 65% 的真實傷害。'
    },
    {
      id: 'art_fudo',
      name: '不動・金剛返',
      icon: '🛡️',
      style: '護盾反震',
      reqLevel: 1,
      procChance: 25,
      powerMult: 1.8,
      effectType: 'shield_thorns',
      desc: '凝聚黑鋼罡氣護體，造成 180% 加上自身防禦力 250% 的震盪反擊，並恢復 12% 生命與護盾。'
    },
    {
      id: 'art_shura',
      name: '修羅・血獄斬',
      icon: '🩸',
      style: '狂戰汲血',
      reqLevel: 5,
      procChance: 26,
      powerMult: 2.5,
      effectType: 'lifesteal',
      desc: '喚醒體內修羅鬼血，斬出 250% 狂暴血刃，並將本次傷害的 40% 直接轉化為自身生命值。'
    },
    {
      id: 'art_raikiri',
      name: '雷切・千鳥一閃',
      icon: '⚡',
      style: '必中暴擊',
      reqLevel: 8,
      procChance: 24,
      powerMult: 2.4,
      effectType: 'guaranteed_crit',
      desc: '立花道雪斬雷秘劍。引動九天雷霆，必定觸發致命暴擊並造成 240% 雷電傷害，麻痺對手降低其攻速。'
    },
    {
      id: 'art_sakura',
      name: '櫻吹雪・千本刃',
      icon: '🌸',
      style: '裂傷連段',
      reqLevel: 12,
      procChance: 30,
      powerMult: 2.1,
      effectType: 'bleed',
      desc: '劍氣化作漫天緋紅櫻瓣，造成 210% 傷害並撕裂敵方傷口，使敵人防禦永久削減 20%。'
    },
    {
      id: 'art_onmyo_seal',
      name: '陰陽・五芒封魔陣',
      icon: '☯️',
      style: '破魔真傷',
      reqLevel: 16,
      procChance: 24,
      powerMult: 2.35,
      effectType: 'true_dmg',
      desc: '安倍晴明秘傳咒印。展開五芒星結界鎮壓妖氣，造成 235% 無視護甲的陰陽真實傷害。'
    },
    {
      id: 'art_mirror',
      name: '柳生・鏡花水月',
      icon: '🌙',
      style: '化勁反擊',
      reqLevel: 20,
      procChance: 25,
      powerMult: 2.75,
      effectType: 'counter_crit',
      desc: '柳生新陰流最高奧義。看破敵人破綻於毫釐之間，閃避攻擊並回敬 275% 致命拔刀斬。'
    },
    {
      id: 'art_orochi',
      name: '荒神・八岐噬魂',
      icon: '🐍',
      style: '劇毒禁療',
      reqLevel: 28,
      procChance: 22,
      powerMult: 2.8,
      effectType: 'poison',
      desc: '召喚太古八岐大蛇幻影噬咬對手，造成 280% 暗黑毒傷，並封鎖敵方回血與吸血能力。'
    },
    {
      id: 'art_muramasa',
      name: '妖刀・村正斷魂',
      icon: '🗡️',
      style: '殘血斬殺',
      reqLevel: 35,
      procChance: 22,
      powerMult: 2.6,
      effectType: 'execute',
      desc: '解開妖刀村正的嗜血封印，基礎造成 260% 傷害；若敵方生命低於 45%，傷害額外暴增 80%！'
    },
    {
      id: 'art_amaterasu',
      name: '天照・八咫神鏡',
      icon: '☀️',
      style: '神聖甦生',
      reqLevel: 45,
      procChance: 22,
      powerMult: 2.4,
      effectType: 'holy_heal',
      desc: '引動高天原天照神光，造成 240% 神聖制裁傷害，同時立即恢復自身 22% 最大生命值。'
    },
    {
      id: 'art_musou',
      name: '無雙・天魔滅卻',
      icon: '👑',
      style: '毀天滅地',
      reqLevel: 60,
      procChance: 20,
      powerMult: 3.6,
      effectType: 'apocalypse',
      desc: '天下無雙至高奧義。凝聚天地五輪與天魔霸氣，轟出 360% 毀滅性斬擊，貫穿一切障壁！'
    }
  ];

  // =========================================================================
  // 4. 100小時主線史詩任務編年史 (30 Main Story Quests across 8 Volumes)
  // =========================================================================
  const MAIN_QUESTS = [
    // --- 第一卷：櫻落血夜與劍心初醒 ---
    {
      id: 'mq_01',
      volume: '第一卷：劍心初醒',
      title: '【主線 M01】木刀百振・劍心初醒',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '在戰場中親手拔刀揮斬 10 次，並討伐 3 隻櫻落之村的流竄山賊，證明你的武道初心。',
      storyText: '「年輕的武士啊，切莫依賴外物。真正的劍道始於你親手揮出的每一刀！先在櫻落村外親手揮刀十次、斬殺三名山賊，老夫便傳授你『呼吸吐納・自動拔刀』之術！」',
      loreTitle: '第一章・第一節：凋零櫻花與生鏽佩刀',
      loreBody: '應仁之亂後百餘年，戰國狼煙四起。常世的裂隙在各地蔓延，原本淳樸的山野村民與陣亡將士受到妖氣侵蝕，化為嗜血的赤目鬼卒。一名背負家傳舊刀的武士踏入櫻落之村，在劍聖上泉信綱的指引下，揮出了改變亂世命運的第一刀。',
      objectives: [
        { type: 'manualSlashes', label: '手動揮刀斬擊', target: 10 },
        { type: 'totalKills', label: '討伐任意敵人', target: 3 }
      ],
      reward: {
        gold: 500,
        iron: 15,
        exp: 60,
        unlockAutomationTier: 1,
        rewardText: '🔓 解鎖【第一重自動機制：基礎自動拔刀 (1.2秒/斬)】＋ 500 金幣'
      }
    },
    {
      id: 'mq_02',
      volume: '第一卷：劍心初醒',
      title: '【主線 M02】荒村除妖・赤目之影',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '協助巫女阿國肅清櫻落之村周邊的妖狼與野彘，累計討伐 12 隻敵人並提升等級至 Lv.2。',
      storyText: '「武士大人，村口古井滲出了黑色的常世瘴氣，山林裡的野獸雙眼盡赤。請助我討伐十二隻妖物，阻止黑風寨的陰謀！」',
      loreTitle: '第一章・第二節：古井下的常世黑氣',
      loreBody: '巫女阿國發現櫻落之村的異變並非尋常山賊劫掠。黑風寨巨漢鬼丸十藏在山寨深處供奉了一枚散發紫黑邪光的「禍津勾玉」，將山林野獸轉化為不知疼痛的妖魔。',
      objectives: [
        { type: 'totalKills', label: '累計討伐妖物', target: 12 },
        { type: 'level', label: '武士等級達到 Lv.2', target: 2 }
      ],
      reward: {
        gold: 1000,
        iron: 25,
        talentPoints: 1,
        gearQuality: 'rare',
        rewardText: '🎁 稀有(黃)神兵 x1 ＋ 天賦點 x1 ＋ 1,000 金幣'
      }
    },
    {
      id: 'mq_03',
      volume: '第一卷：劍心初醒',
      title: '【主線 M03】血夜斬首・鬼丸十藏',
      npc: '備前名刀匠・正宗',
      npcIcon: '🔨',
      desc: '推進第一章討伐進度並擊敗首領【黑風寨巨漢・鬼丸十藏】(累計擊敗首領 1 次)。',
      storyText: '「鬼丸十藏手中的狼牙棒曾震碎無數凡鐵！將他斬於馬下，奪回禍津勾玉，老夫便為你開啟『自動熔爐』，並助你領悟二天疾風連斬！」',
      loreTitle: '第一章・第三節：黑風寨的血色破曉',
      loreBody: '狂風暴雨之夜，武士孤身攻入黑風寨。鬼丸十藏咆哮著揮舞千斤鐵棒，卻被武士領悟的「二天疾風」劍意一刀斷首。碎裂的勾玉指向了更深處的幽冥竹林。',
      objectives: [
        { type: 'bossKills', label: '擊敗章節首領', target: 1 }
      ],
      reward: {
        gold: 2500,
        iron: 50,
        souls: 10,
        unlockAutomationTier: 2,
        rewardText: '🔓 解鎖【第二重自動機制：疾風連斬 (0.65秒/斬) ＆ 自動拆解熔爐】'
      }
    },

    // --- 第二卷：幽冥竹林與式神契約 ---
    {
      id: 'mq_04',
      volume: '第二卷：幽冥百鬼',
      title: '【主線 M04】京都本陣・名匠與篝火',
      npc: '備前名刀匠・正宗',
      npcIcon: '🔨',
      desc: '返回【京都・新選本陣】進行祈福或參訪主城 1 次，並強化任意裝備 2 次。',
      storyText: '「欲入幽冥竹林，必先利其器！回京都本陣讓阿國巫女為你祈福，再來老夫的鍛造鋪強化兩次佩刀吧！」',
      loreTitle: '第二章・第一節：新選本陣的不滅篝火',
      loreBody: '京都御本陣匯聚了各地倖存的豪傑、刀匠與陰陽師。正宗以千錘百鍊的玉鋼為武士重鑄刀鋒，而本陣中央的神木篝火則庇護著每一位遠征歸來的劍客。',
      objectives: [
        { type: 'townVisits', label: '造訪京都主城', target: 1 },
        { type: 'upgradesSuccess', label: '強化裝備成功', target: 2 }
      ],
      reward: {
        gold: 3500,
        iron: 60,
        talentPoints: 1,
        rewardText: '🎁 天賦點 x1 ＋ 玉鋼 x60 ＋ 3,500 金幣'
      }
    },
    {
      id: 'mq_05',
      volume: '第二卷：幽冥百鬼',
      title: '【主線 M05】竹林迷蹤・式神護法契約',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '累計討伐 35 隻妖物，並達到等級 Lv.6，與出雲式神締結護法契約。',
      storyText: '「幽冥竹林的瘴氣會侵蝕心神。請收下這張『出雲式神靈符』，完成試煉後，式神將為你自動施展武學奧義，並在你歇息離線時替你持續斬妖修煉！」',
      loreTitle: '第二章・第二節：青竹磷火與白狐式神',
      loreBody: '在濃霧瀰漫的竹林深處，武士以劍血激活了阿國贈予的式神靈符。白狐式神化作流光融入刀鍔，從此武士即使閉目養神，刀意與式神亦能自主運轉奧義、晝夜不息地斬滅常世群妖。',
      objectives: [
        { type: 'totalKills', label: '累計討伐妖物', target: 35 },
        { type: 'level', label: '武士等級達到 Lv.6', target: 6 }
      ],
      reward: {
        gold: 5000,
        souls: 20,
        unlockAutomationTier: 3,
        rewardText: '🔓 解鎖【第三重自動機制：自動施放奧義 ＆ 常世離線自動修煉】'
      }
    },
    {
      id: 'mq_06',
      volume: '第二卷：幽冥百鬼',
      title: '【主線 M06】月下夜叉・破除百鬼幻陣',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '累計擊敗首領 2 次（斬殺竹林妖術師・青面夜叉），並使綜合戰力達到 900。',
      storyText: '「青面夜叉擅長以水霧幻術惑敵。運用你的《五輪書》架勢與武學奧義，一舉斬破他的百鬼夜行陣！」',
      loreTitle: '第二章・第三節：斬碎竹林的月下狂歌',
      loreBody: '青面夜叉召喚出數百具唐傘小僧與無主浪人，企圖將武士困死於幻陣。武士心如止水，看破夜叉真身所在，一記紅蓮業火斬將整片妖異竹林化為灰燼。',
      objectives: [
        { type: 'bossKills', label: '累計擊敗章節首領', target: 2 },
        { type: 'highestPower', label: '綜合戰力達到 900', target: 900 }
      ],
      reward: {
        gold: 8000,
        iron: 100,
        gearQuality: 'epic',
        talentPoints: 2,
        rewardText: '🎁 史詩(紫)神兵 x1 ＋ 天賦點 x2 ＋ 8,000 金幣'
      }
    },

    // --- 第三卷：高野古剎與天狗秘傳 ---
    {
      id: 'mq_07',
      volume: '第三卷：高野天狗',
      title: '【主線 M07】五輪參悟・武道大會初陣',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '前往【武道＆奈落】分頁參加天下第一武道大會，贏得 1 場比武對決，並累計討伐 70 隻妖物。',
      storyText: '「閉門造車終究難成大器！天下群雄皆在武道大會切磋《五輪書》架勢相剋之道。去贏下你的第一場武道對決吧！」',
      loreTitle: '第三章・第一節：五輪相剋與天下群雄',
      loreBody: '地、水、火、風、空——宮本武藏與上泉信綱所推演的五輪兵法，在京都武道大會中大放異彩。唯有洞悉對手流派虛實、靈活變換架勢與奧義者，方能以弱勝強。',
      objectives: [
        { type: 'pvpWins', label: '武道大會 (PvP) 獲勝', target: 1 },
        { type: 'totalKills', label: '累計討伐妖物', target: 70 }
      ],
      reward: {
        gold: 12000,
        souls: 35,
        talentPoints: 2,
        rewardText: '🎁 天賦點 x2 ＋ 魂玉 x35 ＋ 12,000 金幣'
      }
    },
    {
      id: 'mq_08',
      volume: '第三卷：高野天狗',
      title: '【主線 M08】古剎血淚・初探無間奈落',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '挑戰【無間奈落深淵】並通關第 3 層，同時累計強化裝備成功 5 次。',
      storyText: '「高野山古剎底下的封印鬆動了，通往『無間奈落』的深淵裂隙已經開啟。請深入奈落第三層探明妖氣根源！」',
      loreTitle: '第三章・第二節：流下血淚的古剎金佛',
      loreBody: '高野山千年古剎被鞍馬山天狗一族佔據，地底更連接著深達千層的「無間奈落」。每一層奈落都盤踞著擁有詭異暗黑詞綴的深淵魔物。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 3 },
        { type: 'upgradesSuccess', label: '累計強化裝備成功', target: 5 }
      ],
      reward: {
        gold: 18000,
        iron: 180,
        gearQuality: 'epic',
        rewardText: '🎁 史詩(紫)神兵 x1 ＋ 玉鋼 x180 ＋ 18,000 金幣'
      }
    },
    {
      id: 'mq_09',
      volume: '第三卷：高野天狗',
      title: '【主線 M09】天狗秘傳・無念無想極意',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '累計擊敗首領 3 次（討伐鞍馬山天狗大將・真幻），並累計討伐 130 隻妖物。',
      storyText: '「鞍馬山大天狗真幻掌握著神速劍境『無念無想』。擊敗他，你的自動劍意將突破凡人極限，達到 0.35 秒一斬的至高神速！」',
      loreTitle: '第三章・第三節：鞍馬山巔的風暴決戰',
      loreBody: '狂風呼嘯的古剎屋脊之上，大天狗真幻扇動黑羽掀起刀刃風暴。武士閉上雙眼，捨棄一切雜念，在電光石火間斬斷天狗羽翼，徹底領悟了第四重至高自動劍境——「無念無想」。',
      objectives: [
        { type: 'bossKills', label: '累計擊敗章節首領', target: 3 },
        { type: 'totalKills', label: '累計討伐妖物', target: 130 }
      ],
      reward: {
        gold: 30000,
        souls: 60,
        unlockAutomationTier: 4,
        gearQuality: 'legendary',
        rewardText: '🔓 解鎖【第四重自動機制：無念無想極速神劍 (0.35秒/斬)】＋ 傳奇(橘)神兵 x1'
      }
    },

    // --- 第四卷：長篠古戰場與修羅血海 ---
    {
      id: 'mq_10',
      volume: '第四卷：長篠修羅',
      title: '【主線 M10】六文錢的誓言・折戟古戰場',
      npc: '堺港豪商・呂宋助左衛門',
      npcIcon: '⚖️',
      desc: '累計討伐 220 隻妖物，並在【武道大會 (PvP)】累計獲勝 3 場。',
      storyText: '「長篠古戰場遍地皆是名將遺落的神兵與怨靈！在武道大會磨練你的五輪戰術，再踏入古戰場收服那些不甘沉眠的亡魂吧！」',
      loreTitle: '第四章・第一節：赤染原野的六文錢戰旗',
      loreBody: '赤紅的夕陽映照著折斷的長槍與鐵砲殘骸。昔日戰死沙場的武田赤備隊與真田死士化作骷髏鬼卒，依然在無盡的幻境中衝鋒陷陣。',
      objectives: [
        { type: 'totalKills', label: '累計討伐妖物', target: 220 },
        { type: 'pvpWins', label: '武道大會累計獲勝', target: 3 }
      ],
      reward: {
        gold: 45000,
        iron: 300,
        talentPoints: 2,
        rewardText: '🎁 天賦點 x2 ＋ 玉鋼 x300 ＋ 45,000 金幣'
      }
    },
    {
      id: 'mq_11',
      volume: '第四卷：長篠修羅',
      title: '【主線 M11】黑鐵重甲・奈落十重試煉',
      npc: '備前名刀匠・正宗',
      npcIcon: '🔨',
      desc: '突破【無間奈落深淵】第 8 層，並將裝備累計強化成功 10 次。',
      storyText: '「古戰場的骸骨大名身披妖氣黑鐵鎧，尋常刀劍難傷分毫。透過奈落深淵的玄鐵淬煉佩刀，方能一刀破甲！」',
      loreTitle: '第四章・第二節：千錘百鍊的破甲神鋒',
      loreBody: '正宗將深淵奈落採集而來的幽冥魂玉融入備前長船刀身，鍛造出能切開黑鐵重甲的無雙利刃。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 8 },
        { type: 'upgradesSuccess', label: '累計強化裝備成功', target: 10 }
      ],
      reward: {
        gold: 65000,
        souls: 100,
        gearQuality: 'legendary',
        rewardText: '🎁 傳奇(橘)神兵 x1 ＋ 魂玉 x100 ＋ 65,000 金幣'
      }
    },
    {
      id: 'mq_12',
      volume: '第四卷：長篠修羅',
      title: '【主線 M12】不滅軍神・斬落骸骨大名',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '累計擊敗章節首領 4 次，並使角色等級達到 Lv.20。',
      storyText: '「昔日被尊為軍神的骸骨大名已被常世怨念吞噬。以你的無雙劍道賜予他真正的武士安息吧！」',
      loreTitle: '第四章・第三節：軍神之魂的最終解脫',
      loreBody: '當最後一記居合斬劈開骸骨大名的黃金兜盔，漫天血霧瞬間消散。軍神殘魂向武士深深一揖，化作金色流光消散於天際，並留下了安土天守閣的密道圖。',
      objectives: [
        { type: 'bossKills', label: '累計擊敗章節首領', target: 4 },
        { type: 'level', label: '武士等級達到 Lv.20', target: 20 }
      ],
      reward: {
        gold: 100000,
        iron: 500,
        talentPoints: 3,
        title: '古戰場破軍星',
        rewardText: '🎖️ 稱號【古戰場破軍星】＋ 天賦點 x3 ＋ 100,000 金幣'
      }
    },

    // --- 第五卷：安土天守與九尾妖狐 ---
    {
      id: 'mq_13',
      volume: '第五卷：安土妖狐',
      title: '【主線 M13】幻霧天守・伊賀影忍之陣',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '累計討伐 400 隻妖物，並在【武道大會 (PvP)】累計獲勝 8 場。',
      storyText: '「安土天守閣已被九尾妖狐玉藻前的分身與明智光秀的影忍部隊封鎖。請以實戰磨練出看破幻影的眼力！」',
      loreTitle: '第五章・第一節：紫霧籠罩的安土巨城',
      loreBody: '宏偉的七重天守閣在紫黑色的妖霧中宛如巨獸。伊賀影忍與九尾狐妖設下重重殺陣，企圖阻擋任何接近天守頂層的劍客。',
      objectives: [
        { type: 'totalKills', label: '累計討伐妖物', target: 400 },
        { type: 'pvpWins', label: '武道大會累計獲勝', target: 8 }
      ],
      reward: {
        gold: 150000,
        souls: 160,
        gearQuality: 'legendary',
        rewardText: '🎁 傳奇(橘)神兵 x1 ＋ 魂玉 x160 ＋ 150,000 金幣'
      }
    },
    {
      id: 'mq_14',
      volume: '第五卷：安土妖狐',
      title: '【主線 M14】深淵二十重・九尾狐火試煉',
      npc: '備前名刀匠・正宗',
      npcIcon: '🔨',
      desc: '突破【無間奈落深淵】第 15 層，並累計拾取或打造 1 件傳奇品質以上神兵。',
      storyText: '「唯有經歷過奈落十五層業火洗禮的傳奇名刀，才能斬斷妖狐的九條幻尾！」',
      loreTitle: '第五章・第二節：白面金毛的千年妖影',
      loreBody: '九尾妖狐以人心慾望為食，操縱著安土城中的墮落宿將。武士踏著傳奇名刀的橘紅光柱拾級而上，劍鋒所向，狐火盡滅。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 15 },
        { type: 'legendaryLooted', label: '累計獲得傳奇神兵', target: 1 }
      ],
      reward: {
        gold: 220000,
        iron: 800,
        talentPoints: 3,
        rewardText: '🎁 天賦點 x3 ＋ 玉鋼 x800 ＋ 220,000 金幣'
      }
    },
    {
      id: 'mq_15',
      volume: '第五卷：安土妖狐',
      title: '【主線 M15】本能寺之變・討伐幻惑明智',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '累計擊敗章節首領 6 次，並使角色等級達到 Lv.35。',
      storyText: '「明智光秀為求推翻魔王信長，竟引黃泉邪力入體！斬破他的陰陽幻陣，揭開本能寺背後的真正黑手！」',
      loreTitle: '第五章・第三節：敵在本能寺的真相',
      loreBody: '天守閣頂層烈焰沖天，幻惑大名明智在倒下前吐露真相：本能寺之變並非為了奪權，而是因為織田信長已在富士山巔打開了黃泉幽冥殿的大門，化作了真正的第六天魔王！',
      objectives: [
        { type: 'bossKills', label: '累計擊敗章節首領', target: 6 },
        { type: 'level', label: '武士等級達到 Lv.35', target: 35 }
      ],
      reward: {
        gold: 350000,
        souls: 300,
        gearQuality: 'ancient',
        title: '天守閣斬妖人',
        rewardText: '🔥 太古(紅)神兵 x1 ＋ 稱號【天守閣斬妖人】＋ 350,000 金幣'
      }
    },

    // --- 第六卷：黃泉幽冥殿與八岐大蛇 ---
    {
      id: 'mq_16',
      volume: '第六卷：黃泉八岐',
      title: '【主線 M16】三途川渡・冥府守門將',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '累計討伐 700 隻妖物，並突破【無間奈落深淵】第 25 層。',
      storyText: '「踏過彼岸花盛開的三途川，便是生者禁地『黃泉幽冥殿』。請先在無間奈落第二十五層錘鍊足以抵禦冥府業火的霸氣！」',
      loreTitle: '第六章・第一節：彼岸花海與三途冥河',
      loreBody: '血紅色的彼岸花在三途川兩岸無邊無際地蔓延。地獄青鬼與阿修羅刑戮惡魔鎮守著黃泉大門，卻擋不住武士手中閃耀紅光的太古神刀。',
      objectives: [
        { type: 'totalKills', label: '累計討伐妖物', target: 700 },
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 25 }
      ],
      reward: {
        gold: 500000,
        iron: 1500,
        talentPoints: 3,
        rewardText: '🎁 天賦點 x3 ＋ 玉鋼 x1,500 ＋ 500,000 金幣'
      }
    },
    {
      id: 'mq_17',
      volume: '第六卷：黃泉八岐',
      title: '【主線 M17】藩國劍豪・武道十五勝',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '在【武道大會 (PvP)】累計獲勝 15 場，並強化裝備成功累計 18 次。',
      storyText: '「八岐大蛇擁有八顆首級、各自精通不同五輪屬性。唯有在武道大會擊敗十五位各流派高手，你才能看穿八岐的弱點！」',
      loreTitle: '第六章・第二節：萬流歸宗的五輪極意',
      loreBody: '歷經與天下各藩國劍豪的交鋒，武士已能隨心所欲地在戰鬥中切換地、水、火、風、空五輪架勢，三招自選奧義宛如行雲流水、天衣無縫。',
      objectives: [
        { type: 'pvpWins', label: '武道大會累計獲勝', target: 15 },
        { type: 'upgradesSuccess', label: '累計強化裝備成功', target: 18 }
      ],
      reward: {
        gold: 750000,
        souls: 500,
        gearQuality: 'ancient',
        rewardText: '🔥 太古(紅)神兵 x1 ＋ 魂玉 x500 ＋ 750,000 金幣'
      }
    },
    {
      id: 'mq_18',
      volume: '第六卷：黃泉八岐',
      title: '【主線 M18】太古禍津・斬斷八岐大蛇',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '累計擊敗章節首領 10 次，並使角色等級達到 Lv.50。',
      storyText: '「須佐之男命昔日斬殺八岐大蛇並取出天叢雲劍。今日，請重現神話偉業，斬落太古禍津神八岐大蛇真身！」',
      loreTitle: '第六章・第三節：天叢雲劍的再度甦醒',
      loreBody: '黃泉深淵地動山搖，八岐大蛇的八顆巨首吐出毒霧與黑雷。武士踏空而起，使出無雙奧義連斬八首，大蛇尾端竟浮現出太古神劍「天叢雲」的璀璨神輝！',
      objectives: [
        { type: 'bossKills', label: '累計擊敗章節首領', target: 10 },
        { type: 'level', label: '武士等級達到 Lv.50', target: 50 }
      ],
      reward: {
        gold: 1200000,
        iron: 3000,
        talentPoints: 5,
        title: '斬蛇須佐之男',
        rewardText: '🎖️ 稱號【斬蛇須佐之男】＋ 天賦點 x5 ＋ 1,200,000 金幣'
      }
    },

    // --- 第七卷：永恆神武巔與第六天魔王 ---
    {
      id: 'mq_19',
      volume: '第七卷：天下布武',
      title: '【主線 M19】富士神巔・突破奈落四十重',
      npc: '備前名刀匠・正宗',
      npcIcon: '🔨',
      desc: '突破【無間奈落深淵】第 40 層，並累計討伐 1,200 隻妖物。',
      storyText: '「富士山巔的永恆神武殿由傳奇劍聖魔傀儡與混沌暗黑龍鎮守。突破奈落四十層，將你的神兵鍛至極致吧！」',
      loreTitle: '第七章・第一節：雲端之上的天魔城塞',
      loreBody: '富士山巔風雪交加，時空裂隙在火山口上方凝聚成一座倒懸的暗黑天魔城。織田信長端坐於王座之上，等待著能與他一決高下的宿命劍客。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 40 },
        { type: 'totalKills', label: '累計討伐妖物', target: 1200 }
      ],
      reward: {
        gold: 2000000,
        souls: 1000,
        gearQuality: 'ancient',
        rewardText: '🔥 太古(紅)神兵 x1 ＋ 魂玉 x1,000 ＋ 2,000,000 金幣'
      }
    },
    {
      id: 'mq_20',
      volume: '第七卷：天下布武',
      title: '【主線 M20】天下布武・決戰第六天魔王',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '累計擊敗章節首領 15 次（擊敗第六天魔王・織田信長），並達到等級 Lv.65。',
      storyText: '「『人生五十年，如夢又似幻！』去吧，用你千錘百鍊的五輪劍道，與第六天魔王織田信長展開載入史冊的終極決戰！」',
      loreTitle: '第七章・第二節：魔王殞落與新時代的曙光',
      loreBody: '天魔神劍與武士的佩刀在富士山頂交擊出萬丈雷光。歷經百回合生死交鋒，信長放聲大笑：「痛快！這天下與常世的未來，便交予你手中之劍了！」然而，信長身後的無間常世深淵才正要揭開真正的太古秘辛……',
      objectives: [
        { type: 'bossKills', label: '累計擊敗章節首領', target: 15 },
        { type: 'level', label: '武士等級達到 Lv.65', target: 65 }
      ],
      reward: {
        gold: 3500000,
        iron: 6000,
        souls: 2000,
        talentPoints: 5,
        gearQuality: 'ancient',
        title: '天下布武・劍神',
        rewardText: '👑 稱號【天下布武・劍神】＋ 太古(紅)神兵 x1 ＋ 天賦點 x5'
      }
    },

    // --- 第八卷（終焉百時長卷）：常世無間與百時神話 (M21 ~ M30) ---
    {
      id: 'mq_21',
      volume: '終焉卷：百時神話',
      title: '【主線 M21】常世之門・深淵六十重行者',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '突破【無間奈落深淵】第 60 層，並在武道大會累計獲勝 25 場。',
      storyText: '「信長雖敗，但連接根之堅洲國的『無間奈落』卻湧出了太古神代的魔神。武士大人，真正的百時征途現在才剛開始！」',
      loreTitle: '終焉卷・第一節：根之堅洲國的太古魔神',
      loreBody: '常世深淵共有千層，每深入十層便會遭遇古神代遺留的荒魂法則。唯有不斷鑽研配裝、洗鍊太古神兵與五輪奧義者，方能踏足深淵底層。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 60 },
        { type: 'pvpWins', label: '武道大會累計獲勝', target: 25 }
      ],
      reward: {
        gold: 5000000,
        souls: 3000,
        talentPoints: 5,
        rewardText: '🎁 天賦點 x5 ＋ 魂玉 x3,000 ＋ 5,000,000 金幣'
      }
    },
    {
      id: 'mq_22',
      volume: '終焉卷：百時神話',
      title: '【主線 M22】千鬼伏誅・修羅二千五百斬',
      npc: '備前名刀匠・正宗',
      npcIcon: '🔨',
      desc: '累計討伐 2,500 隻妖物，並使角色等級達到 Lv.85。',
      storyText: '「刀飲千鬼之血而不卷刃，方為真正的不朽神物！」',
      loreTitle: '終焉卷・第二節：萬鬼辟易的無雙刀魂',
      loreBody: '武士之名已傳遍日本六十六國，就連京都夜行的百鬼聞其刀鳴亦紛紛退避三舍。',
      objectives: [
        { type: 'totalKills', label: '累計討伐妖物', target: 2500 },
        { type: 'level', label: '武士等級達到 Lv.85', target: 85 }
      ],
      reward: {
        gold: 8000000,
        iron: 10000,
        gearQuality: 'ancient',
        rewardText: '🔥 太古(紅)神兵 x1 ＋ 玉鋼 x10,000 ＋ 8,000,000 金幣'
      }
    },
    {
      id: 'mq_23',
      volume: '終焉卷：百時神話',
      title: '【主線 M23】奈落百層・鎮魂古神試煉',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '突破【無間奈落深淵】第 100 層，並累計獲得 3 件太古（紅光）神兵。',
      storyText: '「奈落第一百層鎮守著太古火神迦具土的荒魂。穿上你的紅光太古神裝，斬破百層大關！」',
      loreTitle: '終焉卷・第三節：奈落百層的紅蓮荒魂',
      loreBody: '踏破奈落百層之際，整座京都的天空降下了金色的櫻花雨，武士的肉身已臻至半神之境。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 100 },
        { type: 'ancientLooted', label: '累計獲得太古(紅)神兵', target: 3 }
      ],
      reward: {
        gold: 12000000,
        souls: 6000,
        talentPoints: 5,
        title: '奈落百層斬神者',
        rewardText: '🎖️ 稱號【奈落百層斬神者】＋ 天賦點 x5 ＋ 12,000,000 金幣'
      }
    },
    {
      id: 'mq_24',
      volume: '終焉卷：百時神話',
      title: '【主線 M24】武道宗師・天下比武五十勝',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '在【武道大會 (PvP)】累計獲勝 50 場，並強化裝備成功累計 35 次。',
      storyText: '「與天下豪傑交手五十勝，你的五輪兵法已足以開宗立派！」',
      loreTitle: '終焉卷・第四節：開宗立派的一代劍聖',
      loreBody: '無數年輕武士慕名來到京都新選本陣求教，武士將畢生所悟的五輪相剋與奧義連段編纂成冊，流傳後世。',
      objectives: [
        { type: 'pvpWins', label: '武道大會累計獲勝', target: 50 },
        { type: 'upgradesSuccess', label: '累計強化裝備成功', target: 35 }
      ],
      reward: {
        gold: 18000000,
        iron: 20000,
        gearQuality: 'ancient',
        rewardText: '🔥 太古(紅)神兵 x1 ＋ 玉鋼 x20,000 ＋ 18,000,000 金幣'
      }
    },
    {
      id: 'mq_25',
      volume: '終焉卷：百時神話',
      title: '【主線 M25】萬鬼灰飛・奈落二百重',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '突破【無間奈落深淵】第 200 層，並累計討伐 6,000 隻妖物。',
      storyText: '「奈落二百層之下，時間與空間皆已扭曲。唯有堅定不移的武道意志能照亮無間黑暗！」',
      loreTitle: '終焉卷・第五節：跨越時空的常世旅人',
      loreBody: '在奈落二百層的深淵盡頭，武士斬滅了吞噬時空的混沌古龍，刀鋒所綻放的光芒照亮了整個冥界。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 200 },
        { type: 'totalKills', label: '累計討伐妖物', target: 6000 }
      ],
      reward: {
        gold: 30000000,
        souls: 12000,
        talentPoints: 8,
        rewardText: '🎁 天賦點 x8 ＋ 魂玉 x12,000 ＋ 30,000,000 金幣'
      }
    },
    {
      id: 'mq_26',
      volume: '終焉卷：百時神話',
      title: '【主線 M26】天下五劍・神匠百鍊極意',
      npc: '備前名刀匠・正宗',
      npcIcon: '🔨',
      desc: '強化裝備成功累計 60 次，並使角色等級達到 Lv.130。',
      storyText: '「童子切安綱、鬼丸國綱、三日月宗近、大典太光世、數珠丸恆次——天下五劍的真髓，今日盡聚於你一身！」',
      loreTitle: '終焉卷・第六節：天下五劍的共鳴',
      loreBody: '當正宗完成第六十次神鍛，京都夜空浮現出五柄太古神劍的虛影，向武士致以崇高的敬意。',
      objectives: [
        { type: 'upgradesSuccess', label: '累計強化裝備成功', target: 60 },
        { type: 'level', label: '武士等級達到 Lv.130', target: 130 }
      ],
      reward: {
        gold: 50000000,
        iron: 40000,
        gearQuality: 'ancient',
        title: '天下五劍傳人',
        rewardText: '🎖️ 稱號【天下五劍傳人】＋ 太古(紅)神兵 x1 ＋ 50,000,000 金幣'
      }
    },
    {
      id: 'mq_27',
      volume: '終焉卷：百時神話',
      title: '【主線 M27】無敗武神・比武大會百勝傳奇',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '在【武道大會 (PvP)】累計獲勝 100 場，並突破【無間奈落深淵】第 350 層。',
      storyText: '「百戰百勝而不驕，深入奈落三百五十層而不懼，你已超越老夫畢生所見的一切武者！」',
      loreTitle: '終焉卷・第七節：百戰不殆的武神之姿',
      loreBody: '武道大會的石碑上永遠鐫刻下武士百勝的尊號，後世習武之人無不仰望其背影。',
      objectives: [
        { type: 'pvpWins', label: '武道大會累計獲勝', target: 100 },
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 350 }
      ],
      reward: {
        gold: 80000000,
        souls: 25000,
        talentPoints: 10,
        rewardText: '🎁 天賦點 x10 ＋ 魂玉 x25,000 ＋ 80,000,000 金幣'
      }
    },
    {
      id: 'mq_28',
      volume: '終焉卷：百時神話',
      title: '【主線 M28】萬妖靖平・奈落五百重深淵',
      npc: '出雲巫女・阿國',
      npcIcon: '⛩️',
      desc: '突破【無間奈落深淵】第 500 層，並累計討伐 15,000 隻妖物。',
      storyText: '「五百重奈落已被您的刀光淨化，高天原的眾神亦為您的神威而動容！」',
      loreTitle: '終焉卷・第八節：高天原的神明讚歌',
      loreBody: '斬滅一萬五千妖魔、踏破五百層深淵，常世的黑霧退回地底最深處，人間重現久違的萬里晴空。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 500 },
        { type: 'totalKills', label: '累計討伐妖物', target: 15000 }
      ],
      reward: {
        gold: 150000000,
        iron: 80000,
        gearQuality: 'ancient',
        title: '高天原護國武神',
        rewardText: '🎖️ 稱號【高天原護國武神】＋ 太古(紅)神兵 x1 ＋ 1.5 億金幣'
      }
    },
    {
      id: 'mq_29',
      volume: '終焉卷：百時神話',
      title: '【主線 M29】深淵七百五十重・超越神佛',
      npc: '備前名刀匠・正宗',
      npcIcon: '🔨',
      desc: '突破【無間奈落深淵】第 750 層，並使角色等級達到 Lv.220。',
      storyText: '「神佛亦無法涉足的奈落七百五十層，唯有你一人一刀獨步前行！」',
      loreTitle: '終焉卷・第九節：獨步千古的孤高劍境',
      loreBody: '在法則崩壞的深淵底層，每一刀皆是開天闢地。武士的存在本身已化作鎮壓常世的不朽法則。',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 750 },
        { type: 'level', label: '武士等級達到 Lv.220', target: 220 }
      ],
      reward: {
        gold: 300000000,
        souls: 60000,
        talentPoints: 15,
        rewardText: '🎁 天賦點 x15 ＋ 魂玉 x60,000 ＋ 3 億金幣'
      }
    },
    {
      id: 'mq_30',
      volume: '終焉卷：百時神話',
      title: '【主線 M30】百時傳奇・太古無雙千層神皇',
      npc: '劍聖宗師・上泉信綱',
      npcIcon: '🌳',
      desc: '突破【無間奈落深淵】第 1,000 層、累計討伐 30,000 隻妖物，成就百時神話巔峰！',
      storyText: '「千層奈落盡歸塵土，三萬妖魔伏首稱臣！你的名字將與天地同壽，成為永遠的『太古無雙神皇』！」',
      loreTitle: '終焉卷・最終節：永恆不滅的武士神話',
      loreBody: '當第一千層奈落的核心被一刀兩斷，整個戰國常世與人間徹底迎來永恆的太平。然而武道永無止境——在天下第一武道大會與無盡深淵中，屬於你的傳奇仍將無限延續！',
      objectives: [
        { type: 'abyssFloor', label: '突破無間奈落層數', target: 1000 },
        { type: 'totalKills', label: '累計討伐妖物', target: 30000 }
      ],
      reward: {
        gold: 1000000000,
        iron: 200000,
        souls: 150000,
        talentPoints: 20,
        gearQuality: 'ancient',
        title: '太古無雙神皇',
        rewardText: '👑 終極稱號【太古無雙神皇】＋ 太古(紅)神兵 x1 ＋ 10 億金幣'
      }
    }
  ];

  // =========================================================================
  // 5. 二十大奇譚支線任務 (20 Handcrafted Side Quests)
  // =========================================================================
  const SIDE_QUESTS = [
    {
      id: 'sq_01',
      title: '【支線 S01】刀匠學徒的玄鐵收集',
      npc: '備前名刀匠・正宗',
      icon: '🔨',
      desc: '分解或討伐收集玉鋼，強化任意裝備成功 1 次，學習鍛造基礎。',
      story: '正宗需要確認你是否懂得保養與強化名刀。嘗試在裝備介面強化一次武器吧！',
      objType: 'upgradesSuccess',
      target: 1,
      reward: { gold: 800, iron: 20, souls: 5, text: '800 金幣 ＋ 玉鋼 x20' }
    },
    {
      id: 'sq_02',
      title: '【支線 S02】苦練拔刀・手動三十斬',
      npc: '劍聖宗師・上泉信綱',
      icon: '⚔️',
      desc: '在戰場中累計親手點擊或按空白鍵揮刀 30 次，鍛鍊手眼合一。',
      story: '即便領悟了自動劍意，親手揮出的拔刀斬依然蘊含最強的爆發力！',
      objType: 'manualSlashes',
      target: 30,
      reward: { gold: 1500, talentPoints: 1, text: '天賦點 x1 ＋ 1,500 金幣' }
    },
    {
      id: 'sq_03',
      title: '【支線 S03】出雲巫女的退魔祈願',
      npc: '出雲巫女・阿國',
      icon: '⛩️',
      desc: '返回京都主城找阿國祈福並累計造訪主城 2 次。',
      story: '阿國在京都本陣準備了神聖的出雲清酒與篝火，能使你的攻擊力大幅提升 15%。',
      objType: 'townVisits',
      target: 2,
      reward: { gold: 2000, souls: 12, text: '魂玉 x12 ＋ 2,000 金幣' }
    },
    {
      id: 'sq_04',
      title: '【支線 S04】堺港商人的第一筆買賣',
      npc: '堺港豪商・呂宋助左衛門',
      icon: '⚖️',
      desc: '在【市集＆聊天】拍賣場購買或上架成交 1 件裝備。',
      story: '堺港自由市集匯聚了全日本的奇珍異寶，懂得互通有無也是大名必修之課！',
      objType: 'marketActivity',
      target: 1,
      reward: { gold: 4000, iron: 40, text: '4,000 金幣 ＋ 玉鋼 x40' }
    },
    {
      id: 'sq_05',
      title: '【支線 S05】百鬼獵人・五十斬試煉',
      npc: '劍聖宗師・上泉信綱',
      icon: '👹',
      desc: '累計討伐 50 隻各章節妖物。',
      story: '山野間的妖物愈發猖獗，斬殺五十隻妖魔以震懾宵小！',
      objType: 'totalKills',
      target: 50,
      reward: { gold: 5000, gearQuality: 'rare', text: '稀有(黃)神兵 x1 ＋ 5,000 金幣' }
    },
    {
      id: 'sq_06',
      title: '【支線 S06】武道初試・比武場三連捷',
      npc: '劍聖宗師・上泉信綱',
      icon: '🎌',
      desc: '在【天下第一武道大會 (PvP)】贏得 3 場勝利。',
      story: '觀察對手的《五輪書》架勢，選擇克制對方的架勢出戰，輕鬆拿下三場勝利！',
      objType: 'pvpWins',
      target: 3,
      reward: { gold: 8000, talentPoints: 1, souls: 20, text: '天賦點 x1 ＋ 8,000 金幣' }
    },
    {
      id: 'sq_07',
      title: '【支線 S07】深淵探秘・奈落五重天',
      npc: '出雲巫女・阿國',
      icon: '🌋',
      desc: '突破【無間奈落深淵】第 5 層。',
      story: '無間奈落深淵的魔物雖強，但掉落的魂玉與傳奇神兵遠超尋常戰場！',
      objType: 'abyssFloor',
      target: 5,
      reward: { gold: 12000, gearQuality: 'epic', text: '史詩(紫)神兵 x1 ＋ 12,000 金幣' }
    },
    {
      id: 'sq_08',
      title: '【支線 S08】名刀百鍊・強化八回',
      npc: '備前名刀匠・正宗',
      icon: '🔨',
      desc: '累計強化裝備成功 8 次。',
      story: '每一次鍛打都能讓玉鋼中的雜質排出，使刀身綻放寒芒！',
      objType: 'upgradesSuccess',
      target: 8,
      reward: { gold: 15000, iron: 120, text: '玉鋼 x120 ＋ 15,000 金幣' }
    },
    {
      id: 'sq_09',
      title: '【支線 S09】手動百斬・人刀合一',
      npc: '劍聖宗師・上泉信綱',
      icon: '🗡️',
      desc: '累計手動點擊或按空白鍵揮刀 100 次。',
      story: '即使擁有自動劍意，在首領決戰中親手連斬百刀，方能體會真正的人刀合一！',
      objType: 'manualSlashes',
      target: 100,
      reward: { gold: 25000, talentPoints: 2, text: '天賦點 x2 ＋ 25,000 金幣' }
    },
    {
      id: 'sq_10',
      title: '【支線 S10】惡鬼剋星・首領五連斬',
      npc: '出雲巫女・阿國',
      icon: '👑',
      desc: '累計擊敗各章節首領 5 次。',
      story: '各大章節的首領皆攜帶著高階神兵，反覆討伐首領是收集傳奇橘裝的最佳途徑！',
      objType: 'bossKills',
      target: 5,
      reward: { gold: 35000, gearQuality: 'legendary', text: '傳奇(橘)神兵 x1 ＋ 35,000 金幣' }
    },
    {
      id: 'sq_11',
      title: '【支線 S11】一刀流師範・比武十勝',
      npc: '劍聖宗師・上泉信綱',
      icon: '🥇',
      desc: '在【天下第一武道大會 (PvP)】累計獲勝 10 場。',
      story: '善用『燕返』、『紅蓮業火斬』與『柳生鏡花水月』的組合，在比武場打出十勝威名！',
      objType: 'pvpWins',
      target: 10,
      reward: { gold: 50000, souls: 100, talentPoints: 2, text: '天賦點 x2 ＋ 魂玉 x100' }
    },
    {
      id: 'sq_12',
      title: '【支線 S12】奈落十二重・暗黑魔障',
      npc: '出雲巫女・阿國',
      icon: '🔮',
      desc: '突破【無間奈落深淵】第 12 層。',
      story: '第十二層深淵盤踞著具備荊棘反甲的魔將，建議切換【水之卷】架勢應戰！',
      objType: 'abyssFloor',
      target: 12,
      reward: { gold: 75000, gearQuality: 'legendary', text: '傳奇(橘)神兵 x1 ＋ 75,000 金幣' }
    },
    {
      id: 'sq_13',
      title: '【支線 S13】橘光沖天・傳奇蒐藏家',
      npc: '堺港豪商・呂宋助左衛門',
      icon: '💎',
      desc: '累計獲得 3 件傳奇（橘色）品質神兵。',
      story: '當暗金光柱沖天而起、清脆的金屬回響迴盪耳畔，便是武士最熱血沸騰的時刻！',
      objType: 'legendaryLooted',
      target: 3,
      reward: { gold: 120000, iron: 400, souls: 150, text: '120,000 金幣 ＋ 玉鋼 x400' }
    },
    {
      id: 'sq_14',
      title: '【支線 S14】修羅五百斬・血染征袍',
      npc: '劍聖宗師・上泉信綱',
      icon: '🩸',
      desc: '累計討伐 500 隻妖物。',
      story: '五百妖魔伏誅，你的羽織已被常世妖血染成象徵無敵的深紅！',
      objType: 'totalKills',
      target: 500,
      reward: { gold: 180000, talentPoints: 2, text: '天賦點 x2 ＋ 180,000 金幣' }
    },
    {
      id: 'sq_15',
      title: '【支線 S15】神匠入魂・強化二十五回',
      npc: '備前名刀匠・正宗',
      icon: '🔥',
      desc: '累計強化裝備成功 25 次。',
      story: '全身六大槽位神兵皆經正宗親手鍛打，戰力倍增！',
      objType: 'upgradesSuccess',
      target: 25,
      reward: { gold: 260000, gearQuality: 'ancient', text: '太古(紅)神兵 x1 ＋ 260,000 金幣' }
    },
    {
      id: 'sq_16',
      title: '【支線 S16】鎮國劍豪・比武三十勝',
      npc: '劍聖宗師・上泉信綱',
      icon: '🎌',
      desc: '在【天下第一武道大會 (PvP)】累計獲勝 30 場。',
      story: '各藩大名紛紛派出首席劍豪向你挑戰，以三十勝戰績登頂鎮國劍豪之位！',
      objType: 'pvpWins',
      target: 30,
      reward: { gold: 450000, talentPoints: 3, souls: 400, text: '天賦點 x3 ＋ 450,000 金幣' }
    },
    {
      id: 'sq_17',
      title: '【支線 S17】奈落三十五重・紅蓮業火',
      npc: '出雲巫女・阿國',
      icon: '🌋',
      desc: '突破【無間奈落深淵】第 35 層。',
      story: '深入奈落三十五層，斬滅盤踞於此的深淵紅蓮魔龍！',
      objType: 'abyssFloor',
      target: 35,
      reward: { gold: 700000, gearQuality: 'ancient', text: '太古(紅)神兵 x1 ＋ 700,000 金幣' }
    },
    {
      id: 'sq_18',
      title: '【支線 S18】太古神威・紅光神兵五件',
      npc: '備前名刀匠・正宗',
      icon: '🌟',
      desc: '累計獲得 5 件太古（紅光）品質神兵。',
      story: '太古神兵蘊含神代荒魂之力，集齊五件足以撼動天地！',
      objType: 'ancientLooted',
      target: 5,
      reward: { gold: 1500000, iron: 2500, talentPoints: 3, text: '天賦點 x3 ＋ 150 萬金幣' }
    },
    {
      id: 'sq_19',
      title: '【支線 S19】奈落八十重・常世深淵主宰',
      npc: '出雲巫女・阿國',
      icon: '👑',
      desc: '突破【無間奈落深淵】第 80 層。',
      story: '踏入奈落八十層，連深淵魔神都將在你的五輪劍意下顫抖！',
      objType: 'abyssFloor',
      target: 80,
      reward: { gold: 4000000, gearQuality: 'ancient', talentPoints: 4, text: '太古(紅)神兵 x1 ＋ 天賦點 x4' }
    },
    {
      id: 'sq_20',
      title: '【支線 S20】天下無雙・比武大會七十勝',
      npc: '劍聖宗師・上泉信綱',
      icon: '🏆',
      desc: '在【天下第一武道大會 (PvP)】累計獲勝 70 場。',
      story: '七十場生死對決的淬煉，使你成為名副其實的天下第一武道家！',
      objType: 'pvpWins',
      target: 70,
      reward: { gold: 10000000, souls: 5000, talentPoints: 5, text: '天賦點 x5 ＋ 1,000 萬金幣' }
    }
  ];

  // =========================================================================
  // 6. 幕府無限討伐懸賞令生成器 (Infinite Procedural Sengoku Bounties)
  // =========================================================================
  const BOUNTY_TEMPLATES = [
    { type: 'kills', titlePrefix: '【幕府懸賞】肅清常世群妖', descTpl: '於戰場中額外討伐 {N} 隻妖物', baseStep: 15, icon: '👹' },
    { type: 'manual', titlePrefix: '【劍道修行】親手拔刀連斬', descTpl: '在戰場中親手點擊或按空白鍵揮刀 {N} 次', baseStep: 15, icon: '⚔️' },
    { type: 'pvp', titlePrefix: '【御前比武】擊敗各流派劍豪', descTpl: '在天下第一武道大會獲勝 {N} 場', baseStep: 2, icon: '🎌' },
    { type: 'abyss', titlePrefix: '【深淵討伐】推進無間奈落', descTpl: '突破無間奈落深淵至第 {N} 層', baseStep: 2, icon: '🌋' },
    { type: 'upgrade', titlePrefix: '【軍備整備】百鍊神兵強化', descTpl: '強化任意裝備成功 {N} 次', baseStep: 2, icon: '🔨' }
  ];

  function generateProceduralBounty(bountyLevel = 1, playerStatsTracked = {}, currentAbyssFloor = 1) {
    const tpl = BOUNTY_TEMPLATES[(bountyLevel - 1) % BOUNTY_TEMPLATES.length];
    let baseline = 0;
    let delta = tpl.baseStep * Math.max(1, Math.floor(Math.sqrt(bountyLevel)));

    if (tpl.type === 'kills') {
      baseline = playerStatsTracked.totalKills || 0;
      delta = 12 + bountyLevel * 8;
    } else if (tpl.type === 'manual') {
      baseline = playerStatsTracked.manualSlashes || 0;
      delta = 15 + bountyLevel * 5;
    } else if (tpl.type === 'pvp') {
      baseline = playerStatsTracked.pvpWins || 0;
      delta = Math.max(1, Math.min(5, 1 + Math.floor(bountyLevel / 3)));
    } else if (tpl.type === 'abyss') {
      baseline = currentAbyssFloor || 0;
      delta = Math.max(1, Math.min(5, 1 + Math.floor(bountyLevel / 4)));
    } else if (tpl.type === 'upgrade') {
      baseline = playerStatsTracked.upgradesSuccess || 0;
      delta = Math.max(1, Math.min(5, 1 + Math.floor(bountyLevel / 3)));
    }

    const targetVal = baseline + delta;
    const goldReward = Math.round(1200 * Math.pow(1.35, Math.min(40, bountyLevel)));
    const ironReward = Math.round(20 * Math.pow(1.25, Math.min(35, bountyLevel)));
    const soulsReward = Math.round(8 * Math.pow(1.25, Math.min(35, bountyLevel)));

    return {
      uid: 'bounty_' + bountyLevel + '_' + Date.now(),
      bountyLevel,
      type: tpl.type,
      icon: tpl.icon,
      title: `${tpl.titlePrefix} (第 ${bountyLevel} 期)`,
      desc: tpl.descTpl.replace('{N}', delta),
      baseline,
      delta,
      targetVal,
      reward: {
        gold: goldReward,
        iron: ironReward,
        souls: soulsReward
      }
    };
  }

  // =========================================================================
  // 7. 天下第一武道大會 (PvP Arena Rivals, Tiers & Tactical Duel Simulator)
  // =========================================================================
  const PVP_RANK_TIERS = [
    { minRating: 0, name: '新選組隊士', icon: '🥉', color: '#94a3b8', bonusPct: 0 },
    { minRating: 1150, name: '一刀流師範', icon: '🥈', color: '#38bdf8', bonusPct: 5 },
    { minRating: 1350, name: '藩國無雙劍豪', icon: '🥇', color: '#facc15', bonusPct: 12 },
    { minRating: 1600, name: '鎮國守護大名', icon: '💎', color: '#a855f7', bonusPct: 20 },
    { minRating: 1900, name: '劍聖・幕府總師範', icon: '👑', color: '#f97316', bonusPct: 30 },
    { minRating: 2300, name: '天下無雙・武神', icon: '🔥', color: '#e11d48', bonusPct: 45 }
  ];

  const PVP_RIVAL_PRESETS = [
    { name: '沖田總司', title: '新選組一番隊組長', avatar: '⚔️', classId: 'kensei', stance: 'wind', buildTag: '【疾風三連刺・極速連擊流】', arts: ['art_tsubame', 'art_raikiri', 'art_sakura'] },
    { name: '本多忠勝', title: '德川四天王・蜻蛉切', avatar: '🏯', classId: 'daimyo', stance: 'earth', buildTag: '【不傷黑甲・霸王荊棘反傷流】', arts: ['art_fudo', 'art_amaterasu', 'art_guren'] },
    { name: '真田幸村', title: '日本第一兵・赤備六文錢', avatar: '👹', classId: 'onimusha', stance: 'fire', buildTag: '【紅蓮破甲・修羅狂戰爆發流】', arts: ['art_guren', 'art_shura', 'art_muramasa'] },
    { name: '安倍晴明・轉生', title: '陰陽寮大陰陽師', avatar: '☯️', classId: 'onmyoji', stance: 'void', buildTag: '【五芒封魔・虛空破魔真傷流】', arts: ['art_onmyo_seal', 'art_orochi', 'art_amaterasu'] },
    { name: '柳生十兵衛', title: '獨眼劍豪・新陰流宗家', avatar: '🌙', classId: 'kensei', stance: 'water', buildTag: '【鏡花水月・化勁吸血反擊流】', arts: ['art_mirror', 'art_tsubame', 'art_shura'] },
    { name: '佐佐木小次郎', title: '巖流島・物干し竿', avatar: '🗡️', classId: 'kensei', stance: 'wind', buildTag: '【秘劍燕返・必中暴擊秒殺流】', arts: ['art_tsubame', 'art_raikiri', 'art_musou'] },
    { name: '立花誾千代', title: '西國雷神之女', avatar: '🌸', classId: 'onmyoji', stance: 'fire', buildTag: '【雷切千鳥・元素麻痺強襲流】', arts: ['art_raikiri', 'art_guren', 'art_onmyo_seal'] },
    { name: '伊達政宗', title: '奧州獨眼龍・黑漆五枚胴', avatar: '🐉', classId: 'onimusha', stance: 'void', buildTag: '【荒神八岐・妖刀殘血斬殺流】', arts: ['art_orochi', 'art_muramasa', 'art_musou'] },
    { name: '上杉謙信', title: '越後軍神・毘沙門天化身', avatar: '👑', classId: 'daimyo', stance: 'water', buildTag: '【軍神化勁・不屈神聖續航流】', arts: ['art_amaterasu', 'art_fudo', 'art_mirror'] }
  ];

  function getPvPRankTier(rating = 1000) {
    let current = PVP_RANK_TIERS[0];
    for (const t of PVP_RANK_TIERS) {
      if (rating >= t.minRating) current = t;
    }
    return current;
  }

  /**
   * 根據玩家當前戰力與積分生成 3 位不同流派與《五輪書》架勢的對手
   */
  function generatePvPOpponents(playerPower = 500, playerLevel = 1, playerRating = 1000) {
    const scales = [0.88, 1.05, 1.25]; // 穩健對手、勢均力敵、越級強敵（考驗架勢克制！）
    const shuffled = [...PVP_RIVAL_PRESETS].sort(() => Math.random() - 0.5);

    return scales.map((scale, idx) => {
      const preset = shuffled[idx % shuffled.length];
      const variance = 0.95 + Math.random() * 0.1;
      const targetPower = Math.max(250, Math.round(playerPower * scale * variance));
      const lvl = Math.max(1, Math.round(playerLevel * scale));

      const atk = Math.max(15, Math.round(targetPower * 0.12));
      const def = Math.max(8, Math.round(targetPower * 0.08));
      const maxHp = Math.max(120, Math.round(targetPower * 0.65));

      return {
        id: 'rival_' + idx + '_' + Date.now(),
        name: preset.name,
        title: preset.title,
        avatar: preset.avatar,
        classId: preset.classId,
        stance: preset.stance,
        buildTag: preset.buildTag,
        arts: preset.arts,
        level: lvl,
        power: targetPower,
        rating: Math.round(playerRating + (idx - 0.8) * 65),
        stats: {
          atk,
          def,
          maxHp,
          critRate: preset.classId === 'kensei' ? 28 : 15,
          critDmg: 65,
          lifeSteal: preset.classId === 'onimusha' ? 16 : (preset.stance === 'water' ? 12 : 4),
          thornsPct: preset.classId === 'daimyo' || preset.stance === 'earth' ? 25 : 0,
          evasion: preset.stance === 'water' || preset.arts.includes('art_mirror') ? 18 : 5
        },
        rewardGold: Math.round((800 + playerLevel * 350) * scale),
        rewardSouls: Math.max(3, Math.round((4 + Math.floor(playerLevel / 3)) * scale)),
        ratingGain: idx === 0 ? 18 : (idx === 1 ? 28 : 42)
      };
    });
  }

  /**
   * 演算五輪架勢相剋與武學奧義的即時回合制 PvP 對決
   */
  function simulateSamuraiDuel(playerInfo, rivalInfo) {
    const pStance = FIVE_RINGS_STANCES[playerInfo.stance] || FIVE_RINGS_STANCES.earth;
    const rStance = FIVE_RINGS_STANCES[rivalInfo.stance] || FIVE_RINGS_STANCES.fire;

    const playerCountersRival = pStance.counters === rStance.id;
    const rivalCountersPlayer = rStance.counters === pStance.id;

    let pHp = playerInfo.stats.maxHp;
    let rHp = rivalInfo.stats.maxHp;
    const pMaxHp = pHp;
    const rMaxHp = rHp;

    const log = [];
    log.push(`🎌 【天下第一武道對決】${playerInfo.name} (${pStance.icon}${pStance.shortName}) VS ${rivalInfo.name} (${rStance.icon}${rStance.shortName})`);

    if (playerCountersRival) {
      log.push(`✨ 【五輪相剋大優勢】您的【${pStance.name}】完美克制對手的【${rStance.name}】！傷害提升 30%，受傷減免 20%！`);
    } else if (rivalCountersPlayer) {
      log.push(`⚠️ 【五輪相剋劣勢】對手的【${rStance.name}】克制您的【${pStance.name}】！建議切換架勢以破除其攻勢！`);
    } else {
      log.push(`⚖️ 【五輪均勢交鋒】雙方架勢正面交鋒，考驗武學奧義與神兵鍛造火候！`);
    }

    const pArts = (playerInfo.equippedArts || []).map(id => SAMURAI_ARTS.find(a => a.id === id)).filter(Boolean);
    const rArts = (rivalInfo.arts || []).map(id => SAMURAI_ARTS.find(a => a.id === id)).filter(Boolean);

    let round = 1;
    const maxRounds = 12;

    while (pHp > 0 && rHp > 0 && round <= maxRounds) {
      // --- 玩家出手 ---
      let pDmg = playerInfo.stats.atk * (0.92 + Math.random() * 0.16);
      if (playerCountersRival) pDmg *= 1.30;
      if (rivalCountersPlayer) pDmg *= 0.82;

      // 檢查玩家是否觸發配戴的武學奧義
      let triggeredArt = null;
      if (pArts.length > 0) {
        const candidate = pArts[(round - 1) % pArts.length];
        if (Math.random() * 100 < (candidate.procChance + 25)) {
          triggeredArt = candidate;
          pDmg *= candidate.powerMult * (1 + (playerInfo.stats.artDmgBonus || 0) / 100);
        }
      }

      // 計算破甲與防禦
      let effectiveRivalDef = Math.max(0, rivalInfo.stats.def - (playerInfo.stats.armorPen || 0));
      if (triggeredArt && (triggeredArt.effectType === 'pierce' || triggeredArt.effectType === 'true_dmg')) {
        effectiveRivalDef *= 0.35;
      }
      const rRed = effectiveRivalDef / (effectiveRivalDef + 120);
      pDmg = Math.max(5, pDmg * (1 - rRed));

      const pCrit = (triggeredArt && triggeredArt.effectType === 'guaranteed_crit') || (Math.random() * 100 < playerInfo.stats.critRate);
      if (pCrit) {
        pDmg *= (1 + (playerInfo.stats.critDmg || 50) / 100);
      }
      if (triggeredArt && triggeredArt.effectType === 'execute' && rHp < rMaxHp * 0.45) {
        pDmg *= 1.8;
      }

      pDmg = Math.round(pDmg);
      rHp = Math.max(0, rHp - pDmg);

      let pActionText = triggeredArt
        ? `🔥 第 ${round} 合：您施展奧義【${triggeredArt.icon}${triggeredArt.name}】${pCrit ? '(致命暴擊!)' : ''}，重創 ${rivalInfo.name} ${pDmg.toLocaleString()} 點傷害！`
        : `⚔️ 第 ${round} 合：您拔刀揮斬${pCrit ? '(暴擊!)' : ''}，對 ${rivalInfo.name} 造成 ${pDmg.toLocaleString()} 點傷害！`;

      // 吸血與恢復
      if (playerInfo.stats.lifeSteal > 0 || (triggeredArt && (triggeredArt.effectType === 'lifesteal' || triggeredArt.effectType === 'holy_heal'))) {
        const healRate = (triggeredArt && triggeredArt.effectType === 'lifesteal') ? 0.35 : ((playerInfo.stats.lifeSteal || 0) / 100);
        const healAmt = Math.round(pDmg * healRate);
        if (healAmt > 0) {
          pHp = Math.min(pMaxHp, pHp + healAmt);
          pActionText += ` (汲血 +${healAmt})`;
        }
      }
      log.push(pActionText);

      if (rHp <= 0) break;

      // --- 對手出手 ---
      // 檢查玩家閃避
      if (Math.random() * 100 < (playerInfo.stats.evasion || 5)) {
        const counterDmg = Math.round(playerInfo.stats.atk * 1.35);
        rHp = Math.max(0, rHp - counterDmg);
        log.push(`🌙 第 ${round} 合：您以身法閃避了 ${rivalInfo.name} 的斬擊，並反手居合回敬 ${counterDmg.toLocaleString()} 點傷害！`);
        if (rHp <= 0) break;
        round++;
        continue;
      }

      let rDmg = rivalInfo.stats.atk * (0.9 + Math.random() * 0.2);
      if (rivalCountersPlayer) rDmg *= 1.25;
      if (playerCountersRival) rDmg *= 0.80;

      let rArt = null;
      if (rArts.length > 0 && Math.random() < 0.42) {
        rArt = rArts[(round - 1) % rArts.length];
        rDmg *= (rArt.powerMult * 0.82);
      }

      const pDefRed = playerInfo.stats.def / (playerInfo.stats.def + 120);
      rDmg = Math.max(5, rDmg * (1 - pDefRed) * (1 - (playerInfo.stats.dmgRed || 0) / 100));
      rDmg = Math.round(rDmg);
      pHp = Math.max(0, pHp - rDmg);

      log.push(rArt
        ? `⚡ 第 ${round} 合：${rivalInfo.name} 施展【${rArt.icon}${rArt.name}】，對您造成 ${rDmg.toLocaleString()} 點傷害！(剩餘氣血: ${pHp.toLocaleString()})`
        : `🗡️ 第 ${round} 合：${rivalInfo.name} 揮刀斬擊，對您造成 ${rDmg.toLocaleString()} 點傷害！(剩餘氣血: ${pHp.toLocaleString()})`
      );

      // 玩家荊棘反傷
      if (playerInfo.stats.thornsPct > 0 && pHp > 0) {
        const thornsDmg = Math.max(1, Math.round(rDmg * (playerInfo.stats.thornsPct / 100)));
        rHp = Math.max(0, rHp - thornsDmg);
        log.push(`💥 【金剛荊棘反震】將 ${thornsDmg.toLocaleString()} 點真傷反噬給 ${rivalInfo.name}！`);
      }

      round++;
    }

    const isWin = rHp <= 0 || (pHp / pMaxHp >= rHp / rMaxHp);
    log.push(isWin
      ? `🏆 【勝負揭曉】您以精湛的五輪劍道擊敗了【${rivalInfo.name}】，武威震動京都！`
      : `💔 【惜敗收刀】${rivalInfo.name} 技高一籌。建議調整《五輪書》克制架勢或強化神兵後再戰！`
    );

    return {
      isWin,
      rounds: Math.min(round, maxRounds),
      playerRemainingHp: pHp,
      rivalRemainingHp: rHp,
      playerCountersRival,
      rivalCountersPlayer,
      log
    };
  }

  // =========================================================================
  // 8. 無間奈落深淵 1000 層生成器 (Endless Abyssal Rift 1,000+ Floors)
  // =========================================================================
  const ABYSS_AFFIXES = [
    { name: '【荊棘黑甲】', desc: '反彈正面的猛烈強攻', stanceWeakness: 'water', icon: '🛡️' },
    { name: '【紅蓮狂暴】', desc: '攻勢猛烈如烈火燎原', stanceWeakness: 'earth', icon: '🔥' },
    { name: '【疾風殘影】', desc: '超高攻速與連綿刀網', stanceWeakness: 'fire', icon: '🌪️' },
    { name: '【虛空結界】', desc: '蓄力施展毀滅妖術奧義', stanceWeakness: 'wind', icon: '🌌' },
    { name: '【幽冥噬血】', desc: '持續吸取生靈氣血恢復', stanceWeakness: 'void', icon: '🩸' }
  ];

  const ABYSS_BOSS_NAMES = [
    '奈落獄卒・牛頭鬼', '奈落獄卒・馬頭鬼', '深淵魔將・飛緣魔', '常世大妖・酒吞童子',
    '千年前鬼・大嶽丸', '穢土魔將・蘆屋道滿', '黃泉腐龍・ヤマタ', '深淵劍鬼・無名修羅',
    '天魔化身・黑翼大天狗', '混沌古神・伊邪那美之影'
  ];

  function getAbyssFloorData(floor = 1) {
    const affix = ABYSS_AFFIXES[(floor - 1) % ABYSS_AFFIXES.length];
    const bossName = ABYSS_BOSS_NAMES[(floor - 1) % ABYSS_BOSS_NAMES.length];
    const isMilestone = floor % 5 === 0;

    // 數值平滑且具挑戰性地隨層數成長 (1 ~ 1000+ 層)
    const scale = Math.pow(1.16, Math.min(80, floor - 1)) * (1 + Math.max(0, floor - 80) * 0.25);
    const recommendedPower = Math.round(380 * scale);
    const maxHp = Math.round(520 * scale * (isMilestone ? 1.35 : 1));
    const atk = Math.round(35 * scale * (isMilestone ? 1.2 : 1));
    const def = Math.round(16 * scale);

    // 找出哪一個架勢克制此深淵魔物
    const weakStanceObj = FIVE_RINGS_STANCES[affix.stanceWeakness] || FIVE_RINGS_STANCES.earth;

    return {
      floor,
      isMilestone,
      name: `第 ${floor} 層：${affix.name}${bossName}`,
      avatar: isMilestone ? '🐲' : '👹',
      affixName: affix.name,
      affixDesc: affix.desc,
      recommendedStanceId: weakStanceObj.id,
      recommendedStanceName: `${weakStanceObj.icon} ${weakStanceObj.name}`,
      recommendedPower,
      stats: {
        atk,
        def,
        maxHp,
        critRate: 15,
        critDmg: 55,
        lifeSteal: affix.stanceWeakness === 'void' ? 15 : 0,
        thornsPct: affix.stanceWeakness === 'water' ? 20 : 0,
        evasion: 5
      },
      rewards: {
        gold: Math.round(1000 * Math.pow(1.14, Math.min(70, floor))),
        iron: Math.round(25 * Math.pow(1.12, Math.min(60, floor))),
        souls: Math.round(10 * Math.pow(1.12, Math.min(60, floor))),
        exp: Math.round(180 * Math.pow(1.14, Math.min(65, floor))),
        guaranteedLegendary: isMilestone
      }
    };
  }

  // 導出至全域 window
  window.AUTOMATION_TIERS = AUTOMATION_TIERS;
  window.FIVE_RINGS_STANCES = FIVE_RINGS_STANCES;
  window.SAMURAI_ARTS = SAMURAI_ARTS;
  window.MAIN_QUESTS = MAIN_QUESTS;
  window.SIDE_QUESTS = SIDE_QUESTS;
  window.PVP_RANK_TIERS = PVP_RANK_TIERS;
  window.getPvPRankTier = getPvPRankTier;
  window.generateProceduralBounty = generateProceduralBounty;
  window.generatePvPOpponents = generatePvPOpponents;
  window.simulateSamuraiDuel = simulateSamuraiDuel;
  window.getAbyssFloorData = getAbyssFloorData;

})();
