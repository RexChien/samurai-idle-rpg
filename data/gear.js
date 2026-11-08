/**
 * 《武士之刃：無雙斬》暗黑破壞神式打寶裝備數據庫 (data/gear.js)
 * 包含 6 大裝備槽位、6 大品質階級、隨機詞綴、背景故事(Lore)與戰力計算
 */
(function() {
  'use strict';

  // 6 大裝備槽位
  const GEAR_SLOTS = {
    weapon: { id: 'weapon', name: '主手刀', icon: '🗡️' },
    offhand: { id: 'offhand', name: '副手脇差', icon: '🔪' },
    helm: { id: 'helm', name: '兜鍪面具', icon: '👺' },
    armor: { id: 'armor', name: '大鎧戰袍', icon: '🥋' },
    accessory: { id: 'accessory', name: '神社御守', icon: '📿' },
    boots: { id: 'boots', name: '草履具足', icon: '🥾' }
  };

  // 6 大品質階級 (暗黑破壞神風格)
  const GEAR_QUALITIES = {
    common: {
      id: 'common',
      name: '普通',
      color: '#ffffff',
      border: '#a3a3a3',
      bgGlow: 'rgba(255,255,255,0.05)',
      statMultiplier: 1.0,
      affixCount: 0,
      sound: 'dropCommon',
      hasBeam: false
    },
    magic: {
      id: 'magic',
      name: '魔法',
      color: '#60a5fa',
      border: '#3b82f6',
      bgGlow: 'rgba(59,130,246,0.15)',
      statMultiplier: 1.3,
      affixCount: 1,
      sound: 'dropMagic',
      hasBeam: false
    },
    rare: {
      id: 'rare',
      name: '稀有',
      color: '#facc15',
      border: '#eab308',
      bgGlow: 'rgba(234,179,8,0.2)',
      statMultiplier: 1.7,
      affixCount: 2,
      sound: 'dropRare',
      hasBeam: false
    },
    epic: {
      id: 'epic',
      name: '史詩',
      color: '#c084fc',
      border: '#a855f7',
      bgGlow: 'rgba(168,85,247,0.25)',
      statMultiplier: 2.3,
      affixCount: 3,
      sound: 'dropEpic',
      hasBeam: true,
      beamColor: '#c084fc'
    },
    legendary: {
      id: 'legendary',
      name: '傳奇',
      color: '#fb923c',
      border: '#f97316',
      bgGlow: 'rgba(249,115,22,0.35)',
      statMultiplier: 3.2,
      affixCount: 4,
      sound: 'dropLegendary',
      hasBeam: true,
      beamColor: '#fb923c'
    },
    ancient: {
      id: 'ancient',
      name: '遠古暗金',
      color: '#f43f5e',
      border: '#e11d48',
      bgGlow: 'rgba(225,29,72,0.45)',
      statMultiplier: 4.5,
      affixCount: 5,
      sound: 'dropAncient',
      hasBeam: true,
      beamColor: '#e11d48'
    }
  };

  // 基礎裝備範本庫 (50+ 基礎範本)
  const BASE_GEAR_TEMPLATES = {
    weapon: [
      { id: 'katana_bamboo', name: '竹光初試刃', baseAtk: 12, reqLevel: 1, lore: '初入江湖浪人的竹心練刀，雖無利刃卻有正氣。' },
      { id: 'katana_uchi', name: '備前長船打刀', baseAtk: 28, reqLevel: 5, lore: '長船派工匠以高溫炭火千錘百鍊，刀身泛著淡青冷光。' },
      { id: 'katana_dotanuki', name: '同田貫正國', baseAtk: 55, reqLevel: 12, lore: '以斬斷兜鍪著稱的豪快實戰名刀，刀背厚重無比。' },
      { id: 'katana_kanesada', name: '和泉守兼定', baseAtk: 95, reqLevel: 20, lore: '新選組副長愛用佩刀，刃文如連綿山嶽，殺氣逼人。' },
      { id: 'katana_masamune', name: '名物・觀世正宗', baseAtk: 160, reqLevel: 32, lore: '相州名工五郎入道正宗親鑄，刃口若有流泉，祥瑞護體。' },
      { id: 'katana_muramasa', name: '妖刀・村正千子', baseAtk: 240, reqLevel: 45, lore: '傳說飲血無數的妖刃，揮刀時隱隱可聞怨靈哀嚎。' },
      { id: 'katana_juzumaru', name: '數珠丸恆次', baseAtk: 360, reqLevel: 60, lore: '天下五劍之一，刀鞘纏繞破邪佛珠，誅滅幽冥惡鬼。' },
      { id: 'katana_kusanagi', name: '天叢雲劍・草薙', baseAtk: 520, reqLevel: 80, lore: '自八岐大蛇尾部取出的神話神劍，掌控天地風雲雷霆。' }
    ],
    offhand: [
      { id: 'wakizashi_wood', name: '修行短木刀', baseAtk: 5, baseDef: 3, reqLevel: 1, lore: '隨身佩帶的輔助練習短刃。' },
      { id: 'wakizashi_koto', name: '古刀脇差', baseAtk: 14, baseDef: 8, reqLevel: 8, lore: '室町時代遺留的雙手流脇差，攻防兼備。' },
      { id: 'wakizashi_shura', name: '修羅雙絕刺', baseAtk: 32, baseDef: 15, reqLevel: 22, lore: '二天一流劍客的殺手鐧，專攻敵人甲胄破綻。' },
      { id: 'offhand_mirror', name: '八咫陰陽護鏡', baseAtk: 45, baseDef: 40, reqLevel: 40, lore: '倒映天地萬象的靈鏡，能折射妖怪的妖法詛咒。' },
      { id: 'offhand_dragon_tanto', name: '龍神切短刀', baseAtk: 90, baseDef: 60, reqLevel: 65, lore: '刀鐔雕刻盤龍紋樣，刺擊時附帶龍嘯破空聲。' },
      { id: 'offhand_divine_fan', name: '信玄軍配團扇', baseAtk: 130, baseDef: 95, reqLevel: 80, lore: '「風林火山」兵法加持的指揮軍配，號令百鬼臣服。' }
    ],
    helm: [
      { id: 'helm_straw', name: '行者斗笠', baseDef: 6, baseHP: 25, reqLevel: 1, lore: '遮蔽風雨的竹編斗笠，隱匿行蹤。' },
      { id: 'helm_iron_hachigane', name: '玄鐵額當', baseDef: 16, baseHP: 70, reqLevel: 7, lore: '鍛鐵護額，保護眉心要害不被箭矢所傷。' },
      { id: 'helm_kabuto_crescent', name: '三日月兜鍪', baseDef: 38, baseHP: 180, reqLevel: 20, lore: '前立為純金半月，象徵伊達武將的無畏豪氣。' },
      { id: 'helm_oni_mask', name: '赤夜夜叉惡面', baseDef: 75, baseHP: 360, reqLevel: 38, lore: '猙獰的赤鬼面具，敵見之無不膽寒心顫。' },
      { id: 'helm_dragon_kabuto', name: '越後白頭金盔', baseDef: 130, baseHP: 650, reqLevel: 58, lore: '毘沙門天庇佑的神聖兜鍪，驅散一切邪魅煞氣。' },
      { id: 'helm_conqueror_crown', name: '天下第六天兜', baseDef: 210, baseHP: 1100, reqLevel: 80, lore: '魔王信長橫掃亂世的象徵，萬將見之俯首叩拜。' }
    ],
    armor: [
      { id: 'armor_haori_cloth', name: '素色浪人羽織', baseDef: 10, baseHP: 40, reqLevel: 1, lore: '飄逸的粗布外袍，行動敏捷不受束縛。' },
      { id: 'armor_dousoku', name: '黑漆足輕胴丸', baseDef: 25, baseHP: 120, reqLevel: 6, lore: '戰國步卒標準護身甲，兼具輕巧與基礎防護。' },
      { id: 'armor_sanada_red', name: '真田六文錢大鎧', baseDef: 60, baseHP: 300, reqLevel: 22, lore: '如烈火般燃燒的赤色戰甲，昭示死生置之度外的武士魂。' },
      { id: 'armor_nanban', name: '南蠻西洋重鋼甲', baseDef: 110, baseHP: 600, reqLevel: 42, lore: '遠洋傳入的精鋼板甲，刀槍難入、火銃難傷。' },
      { id: 'armor_takeda_tiger', name: '甲斐黑虎皮札甲', baseDef: 180, baseHP: 1000, reqLevel: 62, lore: '以巨型黑虎皮結合重甲鍛成，散發霸烈王者威壓。' },
      { id: 'armor_immortal_shura', name: '不動明王降魔鎧', baseDef: 290, baseHP: 1650, reqLevel: 80, lore: '金剛怒目、諸邪避退，賦予穿著者不死不滅的神威。' }
    ],
    accessory: [
      { id: 'acc_prayer_beads', name: '黑檀念珠', baseAtk: 6, baseHP: 20, reqLevel: 1, lore: '高僧開光的念珠，撫平心緒、提升專注。' },
      { id: 'acc_shrine_amulet', name: '春日大社必勝御守', baseAtk: 15, baseHP: 60, reqLevel: 9, lore: '神社巫女祈福的護身符，帶來武運昌隆。' },
      { id: 'acc_magatama_green', name: '翡翠八尺瓊勾玉', baseAtk: 35, baseHP: 150, reqLevel: 25, lore: '古老神聖的翡翠玉飾，源源不斷注入生機靈力。' },
      { id: 'acc_bell_purify', name: '破魔風鈴佩飾', baseAtk: 70, baseHP: 320, reqLevel: 45, lore: '微風輕拂時響起清幽梵音，洗滌一切妖術負面效果。' },
      { id: 'acc_phoenix_feather', name: '朱雀涅槃神羽', baseAtk: 120, baseHP: 580, reqLevel: 66, lore: '傳說神鳥落下的熾熱翎羽，賦予超凡的致命一擊力量。' },
      { id: 'acc_ouroboros_ring', name: '常世無限輪迴戒', baseAtk: 195, baseHP: 950, reqLevel: 80, lore: '刻劃著生死循環的神祕指環，掌控時空因果命運。' }
    ],
    boots: [
      { id: 'boots_straw', name: '行腳草履', baseDef: 4, baseSpd: 2, reqLevel: 1, lore: '耐穿的麻草編鞋，步履輕快。' },
      { id: 'boots_tabi_black', name: '暗夜隱行黑足袋', baseDef: 12, baseSpd: 5, reqLevel: 8, lore: '特製軟底足袋，踏雪無痕、飛簷走壁。' },
      { id: 'boots_iron_shin', name: '重鋼鑲鐵脛當', baseDef: 30, baseSpd: 8, reqLevel: 24, lore: '保護小腿與迎面骨的厚實脛甲，穩如磐石。' },
      { id: 'boots_wind_walker', name: '天狗疾風踏', baseDef: 55, baseSpd: 14, reqLevel: 44, lore: '灌注大天狗風之力的高木屐，身形飄忽如風。' },
      { id: 'boots_thunder_stride', name: '雷神逐電具足', baseDef: 95, baseSpd: 22, reqLevel: 65, lore: '踏步如雷霆轟鳴，瞬息之間已閃現在百步之外。' },
      { id: 'boots_dragon_greaves', name: '神龍踏雲金具足', baseDef: 150, baseSpd: 32, reqLevel: 80, lore: '乘雲御風、登峰造極，腳下生出金色祥雲。' }
    ]
  };

  // 隨機詞綴庫 (Affixes)
  const AFFIX_POOL = [
    { id: 'atk_pct', name: '狂暴', stat: 'atkPct', format: '+{val}% 攻擊力', min: 4, max: 25 },
    { id: 'crit_rate', name: '致命', stat: 'critRate', format: '+{val}% 暴擊率', min: 3, max: 15 },
    { id: 'crit_dmg', name: '毀滅', stat: 'critDmg', format: '+{val}% 暴擊傷害', min: 10, max: 60 },
    { id: 'atk_spd', name: '疾風', stat: 'atkSpd', format: '+{val}% 攻擊速度', min: 4, max: 20 },
    { id: 'life_steal', name: '吸血', stat: 'lifeSteal', format: '+{val}% 攻擊吸血', min: 2, max: 12 },
    { id: 'def_pct', name: '金剛', stat: 'defPct', format: '+{val}% 防禦力', min: 5, max: 30 },
    { id: 'hp_pct', name: '不朽', stat: 'hpPct', format: '+{val}% 最大生命', min: 6, max: 35 },
    { id: 'armor_pen', name: '破甲', stat: 'armorPen', format: '+{val} 穿透無視防禦', min: 10, max: 80 },
    { id: 'dmg_red', name: '守護', stat: 'dmgRed', format: '+{val}% 受傷減免', min: 2, max: 10 },
    { id: 'gold_bonus', name: '招財', stat: 'goldBonus', format: '+{val}% 金幣掉落', min: 10, max: 50 },
    { id: 'magic_find', name: '尋寶', stat: 'magicFind', format: '+{val}% 稀有掉寶率', min: 5, max: 35 }
  ];

  // 傳奇專屬特效詞綴 (Unique Legendary Powers)
  const LEGENDARY_POWERS = [
    { id: 'power_omni_slash', name: '無想天眼', desc: '暴擊時有 30% 機率追加一次 150% 傷害的無雙居合斬！' },
    { id: 'power_blood_frenzy', name: '阿修羅之怒', desc: '生命低於 40% 時，吸血率增加 20%，攻速增加 35%！' },
    { id: 'power_divine_shield', name: '八咫神佑', desc: '進入戰鬥時立即獲得相當於 30% 最大生命值的神聖護盾！' },
    { id: 'power_thunder_strike', name: '建御雷之怒', desc: '每進行 4 次普通攻擊，天降神雷對敵人造成 250% 範圍雷電傷害！' },
    { id: 'power_iron_thorns', name: '大和不屈魂', desc: '反彈受到的 35% 傷害，並每秒自動恢復 3% 已損失生命！' },
    { id: 'power_greed_god', name: '惠比壽之賜', desc: '擊敗首領時額外掉落 1 件高品質裝備，金幣獲取提升 100%！' }
  ];

  /**
   * 隨機生成一件暗黑風格裝備
   * @param {string} targetSlot (可選: weapon, offhand, helm, armor, accessory, boots)
   * @param {string} targetQuality (可選: common, magic, rare, epic, legendary, ancient)
   * @param {number} playerLevel 玩家等級
   */
  function generateGear(targetSlot, targetQuality, playerLevel = 1) {
    const slotKeys = Object.keys(GEAR_SLOTS);
    const slot = targetSlot || slotKeys[Math.floor(Math.random() * slotKeys.length)];

    // 依權重決定品質
    let qualityKey = targetQuality;
    if (!qualityKey) {
      const roll = Math.random() * 100;
      if (roll < 45) qualityKey = 'common';
      else if (roll < 75) qualityKey = 'magic';
      else if (roll < 90) qualityKey = 'rare';
      else if (roll < 97) qualityKey = 'epic';
      else if (roll < 99.5) qualityKey = 'legendary';
      else qualityKey = 'ancient';
    }

    const quality = GEAR_QUALITIES[qualityKey] || GEAR_QUALITIES.common;
    const templates = BASE_GEAR_TEMPLATES[slot] || BASE_GEAR_TEMPLATES.weapon;

    // 依玩家等級過濾可用範本
    let availableTemplates = templates.filter(t => t.reqLevel <= playerLevel);
    if (availableTemplates.length === 0) availableTemplates = [templates[0]];
    const baseTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

    // 基礎數值浮動計算
    const lvlScale = 1 + (playerLevel - 1) * 0.12;
    const qScale = quality.statMultiplier;
    const variance = 0.9 + Math.random() * 0.2; // 0.9 ~ 1.1

    const baseAtk = baseTemplate.baseAtk ? Math.round(baseTemplate.baseAtk * lvlScale * qScale * variance) : 0;
    const baseDef = baseTemplate.baseDef ? Math.round(baseTemplate.baseDef * lvlScale * qScale * variance) : 0;
    const baseHP = baseTemplate.baseHP ? Math.round(baseTemplate.baseHP * lvlScale * qScale * variance) : 0;
    const baseSpd = baseTemplate.baseSpd ? Math.round(baseTemplate.baseSpd * lvlScale * qScale * variance) : 0;

    // 隨機詞綴抽取
    const affixes = [];
    const usedAffixKeys = new Set();
    const count = quality.affixCount;

    for (let i = 0; i < count; i++) {
      const candidates = AFFIX_POOL.filter(a => !usedAffixKeys.has(a.id));
      if (candidates.length === 0) break;
      const affixProto = candidates[Math.floor(Math.random() * candidates.length)];
      usedAffixKeys.add(affixProto.id);

      // 數值依品質加成
      const valRatio = (affixProto.min + (affixProto.max - affixProto.min) * Math.random()) * (1 + (qScale - 1) * 0.25);
      const roundedVal = Math.round(valRatio);
      affixes.push({
        id: affixProto.id,
        stat: affixProto.stat,
        name: affixProto.name,
        val: roundedVal,
        text: affixProto.format.replace('{val}', roundedVal)
      });
    }

    // 傳奇以上賦予專屬傳奇特效
    let legendaryPower = null;
    if (qualityKey === 'legendary' || qualityKey === 'ancient') {
      const powerProto = LEGENDARY_POWERS[Math.floor(Math.random() * LEGENDARY_POWERS.length)];
      legendaryPower = { ...powerProto };
    }

    // 生成唯一 ID
    const gearUid = 'gear_' + Date.now() + '_' + Math.floor(Math.random() * 100000);

    const gearItem = {
      uid: gearUid,
      templateId: baseTemplate.id,
      name: baseTemplate.name,
      slot: slot,
      slotName: GEAR_SLOTS[slot].name,
      icon: GEAR_SLOTS[slot].icon,
      quality: qualityKey,
      qualityName: quality.name,
      color: quality.color,
      border: quality.border,
      bgGlow: quality.bgGlow,
      hasBeam: quality.hasBeam,
      beamColor: quality.beamColor,
      itemLevel: playerLevel,
      reqLevel: baseTemplate.reqLevel,
      baseAtk,
      baseDef,
      baseHP,
      baseSpd,
      affixes,
      legendaryPower,
      lore: baseTemplate.lore,
      upgradeLevel: 0,
      gearScore: 0,
      sellPrice: Math.round(50 * lvlScale * qScale)
    };

    gearItem.gearScore = calculateGearScore(gearItem);
    return gearItem;
  }

  /**
   * 計算裝備戰力評分 (Gear Score)
   */
  function calculateGearScore(gear) {
    if (!gear) return 0;
    let score = 0;
    // 基礎數值加權
    score += (gear.baseAtk || 0) * 3.5;
    score += (gear.baseDef || 0) * 2.8;
    score += (gear.baseHP || 0) * 0.6;
    score += (gear.baseSpd || 0) * 4.0;

    // 強化等級加權 (+1 級加成 8%)
    score *= (1 + (gear.upgradeLevel || 0) * 0.08);

    // 詞綴加權
    if (gear.affixes && Array.isArray(gear.affixes)) {
      gear.affixes.forEach(aff => {
        if (aff.stat === 'atkPct' || aff.stat === 'critDmg') score += aff.val * 4;
        else if (aff.stat === 'critRate' || aff.stat === 'atkSpd' || aff.stat === 'lifeSteal') score += aff.val * 6;
        else if (aff.stat === 'defPct' || aff.stat === 'hpPct') score += aff.val * 3;
        else score += aff.val * 2;
      });
    }

    // 傳奇特效固定加成戰力
    if (gear.legendaryPower) {
      score += 250;
    }

    return Math.round(score);
  }

  /**
   * 分解裝備獲得材料
   * @param {Object} gear
   * @returns {Object} { iron: number, souls: number, gold: number }
   */
  function decomposeGear(gear) {
    if (!gear) return { iron: 0, souls: 0, gold: 0 };
    const qKey = gear.quality || 'common';
    let iron = 1;
    let souls = 0;
    let gold = Math.round(gear.sellPrice * 0.6);

    switch (qKey) {
      case 'common':
        iron = 2;
        break;
      case 'magic':
        iron = 5;
        souls = 1;
        break;
      case 'rare':
        iron = 12;
        souls = 4;
        break;
      case 'epic':
        iron = 30;
        souls = 15;
        break;
      case 'legendary':
        iron = 80;
        souls = 50;
        break;
      case 'ancient':
        iron = 200;
        souls = 150;
        break;
    }

    return { iron, souls, gold };
  }

  // 導出全局變量
  window.GEAR_SLOTS = GEAR_SLOTS;
  window.GEAR_QUALITIES = GEAR_QUALITIES;
  window.BASE_GEAR_TEMPLATES = BASE_GEAR_TEMPLATES;
  window.generateGear = generateGear;
  window.calculateGearScore = calculateGearScore;
  window.decomposeGear = decomposeGear;

})();
