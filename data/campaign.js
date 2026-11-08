/**
 * 《武士之刃：無雙斬》世界地圖、主城據點與 7 大戰役章節 (data/campaign.js)
 * 結合暗黑破壞神 3/4「小站傳送陣 (Waypoints)」與「主城營地 (Town Hub)」概念
 */
(function() {
  'use strict';

  // 主城營地：京都御本陣 (Town Hub - Safe Zone)
  const TOWN_HUB = {
    id: 'town_kyoto',
    name: '京都・新選本陣（主城安全區）',
    subtitle: '篝火休憩・鍛造整備・百鬼不侵',
    icon: '🏯',
    desc: '戰國群雄匯聚的庇護主城。在此處不會受到任何妖物襲擊，篝火能瞬間恢復全部生機，並可找名匠強化神兵、於浪人茶館交易閒聊。',
    npcs: [
      { id: 'npc_healer', name: '出雲大社巫女・阿國', role: '篝火祈福（免費恢復＆獲得武運祝福 +15% 攻擊）', icon: '⛩️', action: 'bless' },
      { id: 'npc_blacksmith', name: '備前名刀匠・正宗', role: '神兵強化與玄鐵拆解', icon: '🔨', action: 'openGear' },
      { id: 'npc_merchant', name: '堺港豪商・呂宋助左衛門', role: '裝備拍賣行與珍品交流', icon: '⚖️', action: 'openMarket' },
      { id: 'npc_master', name: '劍聖宗師・上泉信綱', role: '流派傳承與天賦修煉', icon: '🌳', action: 'openTalents' }
    ]
  };

  // 7 大世界地圖戰役章節 (Waypoints)
  const CAMPAIGN_ACTS = [
    {
      act: 1,
      id: 'zone_act1',
      name: '第一章：櫻落之村',
      subtitle: '亂世孤影・村落初戰',
      mapIcon: '🌸',
      mapPos: { x: 18, y: 75 },
      reqLevel: 1,
      bgGradient: 'linear-gradient(135deg, #1c1917, #292524, #1c1917)',
      storyIntro: '櫻花隨冷風凋零，原本寧靜的山村遭到山賊與赤目妖物的侵擾。新晉武士拔出佩刀，踏上了終結亂世的修羅之路。',
      bossKillsRequired: 10,
      enemies: [
        { id: 'bandit_scout', name: '流竄山賊斥候', avatar: '🥷', hp: 50, atk: 8, def: 2, exp: 12, gold: 15 },
        { id: 'feral_boar', name: '狂暴山林野彘', avatar: '🐗', hp: 75, atk: 12, def: 4, exp: 16, gold: 20 },
        { id: 'red_eye_wolf', name: '赤目噬骨妖狼', avatar: '🐺', hp: 110, atk: 18, def: 5, exp: 22, gold: 28 }
      ],
      boss: {
        id: 'boss_act1',
        name: '黑風寨巨漢・鬼丸十藏',
        avatar: '👹',
        isBoss: true,
        hp: 450,
        atk: 32,
        def: 12,
        exp: 150,
        gold: 200,
        dialogue: '「乳臭未乾的流浪武士，也敢擋本大爺的財路？納命來！」'
      }
    },
    {
      act: 2,
      id: 'zone_act2',
      name: '第二章：幽冥竹林',
      subtitle: '月夜迷蹤・百鬼夜行',
      mapIcon: '🎋',
      mapPos: { x: 32, y: 58 },
      reqLevel: 10,
      bgGradient: 'linear-gradient(135deg, #064e3b, #022c22, #0f172a)',
      storyIntro: '穿過密不透風的青幽竹林，青綠色的磷火在空中搖曳。沉睡千年的古怪妖物在月光下悄然甦醒。',
      bossKillsRequired: 15,
      enemies: [
        { id: 'umbrella_ghost', name: '單腳唐傘小僧', avatar: '🏮', hp: 180, atk: 28, def: 10, exp: 35, gold: 45 },
        { id: 'kappa_warrior', name: '淵潭河童武卒', avatar: '🐢', hp: 260, atk: 38, def: 16, exp: 48, gold: 60 },
        { id: 'shadow_ronin', name: '幽冥無主浪人', avatar: '⚔️', hp: 360, atk: 52, def: 22, exp: 65, gold: 85 }
      ],
      boss: {
        id: 'boss_act2',
        name: '竹林妖術師・青面夜叉',
        avatar: '👺',
        isBoss: true,
        hp: 1400,
        atk: 85,
        def: 35,
        exp: 420,
        gold: 550,
        dialogue: '「迷失在常世狹縫的生靈啊，就成為這片竹林的肥料吧！」'
      }
    },
    {
      act: 3,
      id: 'zone_act3',
      name: '第三章：荒廢古剎',
      subtitle: '梵音斷絕・天狗作祟',
      mapIcon: '⛩️',
      mapPos: { x: 46, y: 42 },
      reqLevel: 22,
      bgGradient: 'linear-gradient(135deg, #312e81, #1e1b4b, #111827)',
      storyIntro: '山頂的高野古剎已被魔氣侵蝕，佛像斑駁流下血淚，空中盤旋著長嘯的大天狗與破戒凶僧。',
      bossKillsRequired: 20,
      enemies: [
        { id: 'renegade_monk', name: '血戒狂暴凶僧', avatar: '📿', hp: 550, atk: 75, def: 32, exp: 95, gold: 120 },
        { id: 'crow_tengu', name: '漆黑羽翼烏天狗', avatar: '🦅', hp: 720, atk: 98, def: 42, exp: 130, gold: 165 },
        { id: 'vengeful_spirit', name: '古剎怨靈武者', avatar: '👻', hp: 950, atk: 125, def: 55, exp: 175, gold: 220 }
      ],
      boss: {
        id: 'boss_act3',
        name: '鞍馬山天狗大將・真幻',
        avatar: '🪭',
        isBoss: true,
        hp: 3800,
        atk: 210,
        def: 75,
        exp: 980,
        gold: 1250,
        dialogue: '「你的劍法雖快，但能快得過天狗的風暴神速嗎？」'
      }
    },
    {
      act: 4,
      id: 'zone_act4',
      name: '第四章：赤染古戰場',
      subtitle: '折戟沉沙・修羅血海',
      mapIcon: '⚔️',
      mapPos: { x: 60, y: 65 },
      reqLevel: 36,
      bgGradient: 'linear-gradient(135deg, #7f1d1d, #450a0a, #18181b)',
      storyIntro: '昔日長篠之戰的古戰場，無數將士的骸骨破土而出。燃燒的戰旗在血霧中獵獵作響。',
      bossKillsRequired: 25,
      enemies: [
        { id: 'skeleton_spear', name: '六文錢骷髏步卒', avatar: '💀', hp: 1350, atk: 160, def: 70, exp: 240, gold: 310 },
        { id: 'armored_oni', name: '黑鐵甲冑巨鬼', avatar: '🛡️', hp: 2100, atk: 210, def: 110, exp: 330, gold: 420 },
        { id: 'cursed_cavalry', name: '無頭幽魂騎馬將', avatar: '🐎', hp: 2850, atk: 280, def: 135, exp: 450, gold: 580 }
      ],
      boss: {
        id: 'boss_act4',
        name: '古戰場不滅軍神・骸骨大名',
        avatar: '👑',
        isBoss: true,
        hp: 9200,
        atk: 460,
        def: 180,
        exp: 2200,
        gold: 2900,
        dialogue: '「吾乃戰國不敗之鬼神！縱使化作白骨，亦當斬盡天下生靈！」'
      }
    },
    {
      act: 5,
      id: 'zone_act5',
      name: '第五章：妖異天守閣',
      subtitle: '幻霧遮天・城郭鬼影',
      mapIcon: '🏯',
      mapPos: { x: 72, y: 45 },
      reqLevel: 50,
      bgGradient: 'linear-gradient(135deg, #581c87, #3b0764, #0f172a)',
      storyIntro: '曾象徵權力巔峰的安土天守閣，如今籠罩在九尾妖狐的紫色瘴氣之中，暗殺影刃在樑柱間潛行。',
      bossKillsRequired: 30,
      enemies: [
        { id: 'shadow_ninja_chief', name: '伊賀影忍上忍', avatar: '👤', hp: 3800, atk: 390, def: 175, exp: 620, gold: 800 },
        { id: 'fox_illusionist', name: '白面九尾妖狐', avatar: '🦊', hp: 4900, atk: 480, def: 210, exp: 820, gold: 1050 },
        { id: 'corrupt_samurai', name: '噬魂魔化宿將', avatar: '🗡️', hp: 6500, atk: 590, def: 260, exp: 1100, gold: 1400 }
      ],
      boss: {
        id: 'boss_act5',
        name: '妖魔城主・幻惑大名明智',
        avatar: '🔮',
        isBoss: true,
        hp: 22000,
        atk: 920,
        def: 380,
        exp: 5100,
        gold: 6800,
        dialogue: '「敵在本能寺！這天下終將落入真正掌控黑暗之人手中！」'
      }
    },
    {
      act: 6,
      id: 'zone_act6',
      name: '第六章：黃泉幽冥殿',
      subtitle: '業火焚身・深淵彼岸',
      mapIcon: '🌋',
      mapPos: { x: 84, y: 28 },
      reqLevel: 65,
      bgGradient: 'linear-gradient(135deg, #4c0519, #881337, #18181b)',
      storyIntro: '踏過三途川，黃泉之國的業火將天空染成焦黑。青鬼與赤鬼手持碎顱狼牙棒守衛著深淵大門。',
      bossKillsRequired: 35,
      enemies: [
        { id: 'blue_oni_guard', name: '地獄青鬼守門將', avatar: '👹', hp: 9500, atk: 820, def: 380, exp: 1600, gold: 2100 },
        { id: 'hell_fire_hound', name: '業火焦熱冥犬', avatar: '🐕‍🦺', hp: 12500, atk: 1050, def: 460, exp: 2100, gold: 2800 },
        { id: 'shura_executioner', name: '阿修羅刑戮惡魔', avatar: '⚔️', hp: 16800, atk: 1350, def: 580, exp: 2800, gold: 3800 }
      ],
      boss: {
        id: 'boss_act6',
        name: '太古禍津神・八岐大蛇真身',
        avatar: '🐉',
        isBoss: true,
        hp: 55000,
        atk: 1850,
        def: 720,
        exp: 12000,
        gold: 16000,
        dialogue: '「渺小的凡人！八個首級吐出的毀滅烈焰，將把你的靈魂燃為灰燼！」'
      }
    },
    {
      act: 7,
      id: 'zone_act7',
      name: '第七章：永恆神武巔',
      subtitle: '天下布武・六天魔王',
      mapIcon: '👑',
      mapPos: { x: 92, y: 14 },
      reqLevel: 80,
      bgGradient: 'linear-gradient(135deg, #1e1b4b, #3b0764, #450a0a)',
      storyIntro: '天界與人間的交界處，富士山之巔。天下第一魔王手持天魔神劍傲視群雄，唯有真正的天下無雙方能問鼎乾坤。',
      bossKillsRequired: 50,
      enemies: [
        { id: 'divine_vanguard', name: '魔界鐵砲黑甲隊', avatar: '💂', hp: 24000, atk: 1800, def: 850, exp: 4200, gold: 5500 },
        { id: 'kensei_puppet', name: '傳奇劍聖魔傀儡', avatar: '🤺', hp: 32000, atk: 2400, def: 1100, exp: 5800, gold: 7600 },
        { id: 'chaos_dragon', name: '混沌滅世暗黑龍', avatar: '🐲', hp: 45000, atk: 3200, def: 1450, exp: 8000, gold: 10500 }
      ],
      boss: {
        id: 'boss_act7',
        name: '第六天魔王・織田信長',
        avatar: '🦹',
        isBoss: true,
        hp: 150000,
        atk: 4800,
        def: 2100,
        exp: 35000,
        gold: 50000,
        dialogue: '「人生五十年，如夢又似幻！就讓這天下見證你我誰才是真正的神佛！」'
      }
    }
  ];

  window.TOWN_HUB = TOWN_HUB;
  window.CAMPAIGN_ACTS = CAMPAIGN_ACTS;

})();
