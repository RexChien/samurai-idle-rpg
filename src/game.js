// 《無雙劍心：武士之刃》遊戲核心邏輯引擎 (Samurai Blade Game Engine)

class SamuraiGame {
  constructor() {
    this.SAVE_KEY = "SAMURAI_BLADE_RPG_SAVE_V1";
    this.activeTab = "battle"; // battle, forge, dojo, inventory, codex, settings
    this.audioEnabled = true;

    // 戰鬥狀態暫存
    this.combatTimer = null;
    this.autoSaveTimer = null;
    this.inBossFight = false;
    this.bossTimeRemaining = 30;
    this.bossMaxTime = 30;
    this.comboCount = 0;
    this.lastHitTime = 0;
    this.zoneKillProgress = 0; // 0 to 10
    this.activeBuffs = {
      speed: 0,
      atk: 0,
      gold: 0
    };

    // 無障礙與自動斬擊模式（預設開啟，免除重複點擊負擔）
    this.autoSlashEnabled = true;
    this.activeAchFilter = "all";

    this.initDefaultState();
  }

  // 初始化預設存檔
  initDefaultState() {
    this.player = {
      name: "無名浪人",
      level: 1,
      exp: 0,
      gold: 100,
      steel: 30,
      meteorite: 0,
      skillPoints: 0,

      // 流派天賦 (Dojo Skills)
      skills: {
        shinkage: 0,  // 新陰流: +2% 暴擊率 / 級, +5% 暴擊傷害
        jigen: 0,     // 示現流: +5% 基礎攻擊力 / 級, +3% 破甲
        rishin: 0     // 天然理心流: +8% 最大體力 / 級, +2% 傷害減免
      },

      // 裝備位
      equipped: {
        weapon: null,
        head: null,
        body: null,
        acc: null
      },

      // 擁有名刀庫存
      swordsInventory: [],
      // 擁有防具庫存
      armorsInventory: [],
      // 道具庫存
      items: {
        mat_whetstone_rough: 3,
        mat_whetstone_mid: 1,
        mat_whetstone_fine: 0,
        item_onigiri: 5,
        item_hyourougan: 2,
        item_sake_onigoroshi: 1,
        item_matcha: 1
      },

      // 名刀圖鑑已解鎖 ID
      codex: ["sword_01"],

      // 統計數據
      stats: {
        totalKills: 0,
        bossKills: 0,
        swordsForged: 0,
        totalSharpens: 0,
        highestZone: 1,
        currentZone: 1
      },

      // 榮譽成就系統
      achievements: {
        claimed: [],
        highestCombo: 0
      },

      // 命運分歧故事線 (Branching Storyline)
      story: {
        currentAct: 1,
        faction: "unaligned", // unaligned, shogunate, ishin, shura
        completedActs: [],
        unlockedEndings: [],
        history: []
      },

      // 劍心輪迴與轉生神龕 (Prestige & Permanent Upgrades)
      prestige: {
        reincarnationCount: 0,
        karma: 0, // 輪迴魂火
        totalKarmaEarned: 0,
        perks: {
          perk_atk: 0,
          perk_hp: 0,
          perk_speed: 0,
          perk_crit: 0,
          perk_forge: 0,
          perk_wealth: 0,
          perk_wisdom: 0,
          perk_boss_slayer: 0
        }
      },

      lastTimestamp: Date.now()
    };

    // 初始配發新手木刀與草帽
    const starterSword = this.createSwordInstance("sword_01");
    this.player.swordsInventory.push(starterSword);
    this.player.equipped.weapon = starterSword;

    const starterHelm = window.ITEMS_DATA.helmets[0];
    const starterArmor = window.ITEMS_DATA.armors[0];
    this.player.equipped.head = starterHelm;
    this.player.equipped.body = starterArmor;

    this.currentEnemy = null;
    this.playerCurrentHp = 100;
  }

  // 創建名刀實例（包含強化等級與隨機詞條）
  createSwordInstance(swordId, refine = 0) {
    const base = window.SWORDS_DATA.find(s => s.id === swordId);
    if (!base) return null;
    return {
      instanceId: "sw_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
      id: base.id,
      name: base.name,
      romaji: base.romaji,
      tier: base.tier,
      tierName: base.tierName,
      color: base.color,
      type: base.type,
      smith: base.smith,
      era: base.era || "日本古作",
      master: base.master || "無名武士",
      hamon: base.hamon || "直刃",
      svg: base.svg || "",
      baseAtk: base.atk,
      refine: refine,
      crit: base.crit,
      critDmg: base.critDmg,
      speed: base.speed,
      passive: base.passive,
      passiveDesc: base.passiveDesc,
      lore: base.lore
    };
  }

  // 計算玩家武士位階稱號
  getRankTitle(level) {
    if (window.getRankTitle) {
      return window.getRankTitle(level, window.getLang ? window.getLang() : "zh-TW");
    }
    if (level < 10) return "無宿浪士";
    if (level < 25) return "足輕組頭";
    if (level < 45) return "直參旗本";
    if (level < 65) return "精銳劍士";
    if (level < 85) return "當世劍豪";
    if (level < 105) return "一代劍聖";
    return "天下無雙・修羅";
  }

  // 計算升級所需經驗值
  getRequiredExp(level) {
    return Math.floor(60 * Math.pow(1.22, level - 1) + (level - 1) * 35);
  }

  // 計算角色全屬性（裝備 + 流派 + 增益）
  getCalculatedStats() {
    let baseHp = 150 + (this.player.level - 1) * 35;
    let baseAtk = 20 + (this.player.level - 1) * 8;
    let baseDef = 5 + (this.player.level - 1) * 3;
    let crit = 5;
    let critDmg = 140; // %
    let speed = 1.0; // 攻速倍率
    let armorPen = 0; // 破甲 %
    let lifesteal = 0; // 吸血 %

    // 武器屬性
    const weapon = this.player.equipped.weapon;
    if (weapon) {
      const sharpenAtk = weapon.refine * 15;
      baseAtk += (weapon.baseAtk + sharpenAtk);
      crit += weapon.crit;
      critDmg += (weapon.critDmg - 100);
      speed *= weapon.speed;

      // 武器專屬被動加成
      if (weapon.id === "sword_04") baseAtk = Math.floor(baseAtk * 1.1); // 和泉守兼定 +10%
      if (weapon.id === "sword_05") speed *= 1.1; // 加州清光
      if (weapon.id === "sword_07") speed *= 1.15; // 堀川國廣
      if (weapon.id === "sword_08") armorPen += 25; // 同田貫正國破甲
      if (weapon.id === "sword_12") lifesteal += 15; // 千子村正吸血
      if (weapon.id === "sword_20") lifesteal += 25; // 妙法村正吸血
      if (weapon.id === "sword_21") armorPen += 100; // 十拳劍全穿透
    }

    // 防具屬性
    const head = this.player.equipped.head;
    if (head) {
      baseHp += (head.hp || 0);
      baseDef += (head.def || 0);
      crit += (head.crit || 0);
    }
    const body = this.player.equipped.body;
    if (body) {
      baseHp += (body.hp || 0);
      baseDef += (body.def || 0);
    }
    const acc = this.player.equipped.acc;
    if (acc) {
      baseHp += (acc.hp || 0);
      baseAtk += (acc.atk || 0);
      critDmg += (acc.critDmg || 0);
    }

    // 流派天賦加成
    // 新陰流
    crit += this.player.skills.shinkage * 2;
    critDmg += this.player.skills.shinkage * 5;
    // 示現流
    baseAtk = Math.floor(baseAtk * (1 + this.player.skills.jigen * 0.05));
    armorPen += this.player.skills.jigen * 3;
    // 天然理心流
    baseHp = Math.floor(baseHp * (1 + this.player.skills.rishin * 0.08));
    baseDef += this.player.skills.rishin * 5;

    // 料理/藥物 Buff
    if (this.activeBuffs.atk > 0) baseAtk = Math.floor(baseAtk * 1.5);
    if (this.activeBuffs.speed > 0) speed *= 1.35;

    // 圖鑑收集羈絆加成
    const codexCount = this.player.codex.length;
    baseAtk += codexCount * 5;
    baseHp += codexCount * 30;

    // 命運陣營專屬被動庇佑 (Story Faction Blessings)
    if (this.player.story && this.player.story.faction) {
      const f = this.player.story.faction;
      if (f === "shogunate") {
        baseHp = Math.floor(baseHp * 1.35);
        baseDef = Math.floor(baseDef * 1.30);
      } else if (f === "ishin") {
        baseAtk = Math.floor(baseAtk * 1.35);
        speed *= 1.20;
      } else if (f === "shura") {
        critDmg += 75;
        armorPen += 40;
      }
    }

    // 輪迴天賦神龕永久加成 (Prestige Altar Perks)
    if (this.player.prestige && this.player.prestige.perks) {
      const perks = this.player.prestige.perks;
      if (perks.perk_atk > 0) baseAtk = Math.floor(baseAtk * (1 + perks.perk_atk * 0.15));
      if (perks.perk_hp > 0) baseHp = Math.floor(baseHp * (1 + perks.perk_hp * 0.20));
      if (perks.perk_speed > 0) speed *= (1 + perks.perk_speed * 0.08);
      if (perks.perk_crit > 0) {
        crit += perks.perk_crit * 2;
        critDmg += perks.perk_crit * 15;
      }
      if (perks.perk_boss_slayer > 0) armorPen += perks.perk_boss_slayer * 4;
    }

    return {
      maxHp: baseHp,
      atk: baseAtk,
      def: baseDef,
      crit: Math.min(85, crit),
      critDmg: critDmg,
      speed: Math.max(0.6, Math.min(2.5, speed)),
      armorPen: Math.min(90, armorPen),
      lifesteal: lifesteal
    };
  }

  // 生成下一位敵人
  spawnEnemy(forceBoss = false) {
    const zone = window.ZONES_DATA.find(z => z.id === this.player.stats.currentZone) || window.ZONES_DATA[0];

    if (forceBoss || (this.inBossFight)) {
      this.inBossFight = true;
      this.bossTimeRemaining = this.bossMaxTime;
      const b = zone.boss;
      this.currentEnemy = {
        name: b.name,
        title: b.title,
        maxHp: b.hp,
        hp: b.hp,
        atk: b.atk,
        def: b.def,
        exp: b.exp,
        gold: b.gold,
        steel: b.steel,
        isBoss: true,
        dropSword: b.dropSword,
        dropItem: b.dropItem
      };
      if (window.samuraiAudio) window.samuraiAudio.playBossBoom();
      this.addCombatLog(`<span style="color:#ef4444;font-weight:bold;">【強敵來襲】${b.title} ${b.name} 現身！限時 ${this.bossMaxTime} 秒！</span>`);
    } else {
      this.inBossFight = false;
      const tpl = zone.enemies[Math.floor(Math.random() * zone.enemies.length)];
      // 隨機浮動 10%
      const variance = 0.9 + Math.random() * 0.2;
      const hp = Math.floor(tpl.hp * variance);
      this.currentEnemy = {
        name: tpl.name,
        title: tpl.title,
        maxHp: hp,
        hp: hp,
        atk: Math.floor(tpl.atk * variance),
        def: tpl.def,
        exp: tpl.exp,
        gold: tpl.gold,
        steel: tpl.steel,
        isBoss: false
      };
    }

    this.updateBattleUI();
  }

  // 玩家普通揮刀／點擊斬擊
  attack(isManual = false) {
    if (!this.currentEnemy || this.currentEnemy.hp <= 0) return;

    const stats = this.getCalculatedStats();

    // 判斷暴擊
    const isCrit = Math.random() * 100 < stats.crit;
    let damage = stats.atk;

    // 防禦減免與破甲計算
    const effectiveDef = Math.max(0, this.currentEnemy.def * (1 - stats.armorPen / 100));
    damage = Math.max(1, damage - effectiveDef * 0.5);

    if (isCrit) {
      damage = Math.floor(damage * (stats.critDmg / 100));
    } else {
      // 輕微傷害浮動 ±10%
      damage = Math.floor(damage * (0.92 + Math.random() * 0.16));
    }

    // 扣除敵人體力
    this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - damage);

    // 吸血效果
    if (stats.lifesteal > 0) {
      const heal = Math.floor(damage * (stats.lifesteal / 100));
      this.playerCurrentHp = Math.min(stats.maxHp, this.playerCurrentHp + heal);
    }

    // 連擊計數
    const now = Date.now();
    if (now - this.lastHitTime < 2500) {
      this.comboCount++;
    } else {
      this.comboCount = 1;
    }
    this.lastHitTime = now;
    if (this.player.achievements) {
      if (this.comboCount > (this.player.achievements.highestCombo || 0)) {
        this.player.achievements.highestCombo = this.comboCount;
        this.checkAchievements();
      }
    }

    // 音效
    if (window.samuraiAudio) {
      if (isCrit) {
        window.samuraiAudio.playCrit();
      } else {
        window.samuraiAudio.playSlash();
      }
    }

    // 觸發視覺特效（刀光粒子與飄字）
    if (window.renderSlashEffect) {
      window.renderSlashEffect(isCrit);
    }
    this.showDamagePopup(damage, isCrit);

    // 戰鬥記錄
    const weaponName = this.player.equipped.weapon ? this.player.equipped.weapon.name : "拳腳";
    if (isCrit) {
      this.addCombatLog(`💥 刀芒如電！出刀【${weaponName}】會心一閃，重創「${this.currentEnemy.name}」造成 <b style="color:#ef4444">${damage}</b> 點巨額破甲傷害！`);
    } else if (isManual) {
      this.addCombatLog(`⚡ 玩家疾風拔刀！【${weaponName}】斬中「${this.currentEnemy.name}」造成 ${damage} 點傷害！`);
    }

    // 檢查敵人是否被擊破
    if (this.currentEnemy.hp <= 0) {
      this.handleEnemyDefeated();
    }

    this.updateBattleUI();
  }

  // 敵人反擊玩家
  enemyAttack() {
    if (!this.currentEnemy || this.currentEnemy.hp <= 0) return;

    const stats = this.getCalculatedStats();
    let enemyDmg = this.currentEnemy.atk;

    // 玩家防禦減傷公式
    const defReduction = stats.def / (stats.def + 300);
    enemyDmg = Math.max(1, Math.floor(enemyDmg * (1 - defReduction)));

    this.playerCurrentHp = Math.max(0, this.playerCurrentHp - enemyDmg);

    if (Math.random() < 0.2 && window.samuraiAudio) {
      window.samuraiAudio.playClash();
    }

    if (this.playerCurrentHp <= 0) {
      this.handlePlayerDefeated();
    }

    this.updateBattleUI();
  }

  // 擊破敵人結算
  handleEnemyDefeated() {
    const e = this.currentEnemy;
    this.player.stats.totalKills++;

    // 收益加成
    let goldGain = e.gold;
    let expGain = e.exp;
    let steelGain = e.steel;

    if (this.activeBuffs.gold > 0) goldGain *= 2;
    if (this.player.equipped.weapon && this.player.equipped.weapon.id === "sword_06") {
      goldGain = Math.floor(goldGain * 1.15); // 陸奧守吉行加成
    }

    // 尊皇維新陣營金小判加成 35%
    if (this.player.story && this.player.story.faction === "ishin") {
      goldGain = Math.floor(goldGain * 1.35);
    }

    // 輪迴天賦神龕：大黑天招財加成
    if (this.player.prestige && this.player.prestige.perks && this.player.prestige.perks.perk_wealth > 0) {
      const wealthBonus = 1 + this.player.prestige.perks.perk_wealth * 0.25;
      goldGain = Math.floor(goldGain * wealthBonus);
      steelGain = Math.floor(steelGain * wealthBonus);
    }

    this.player.gold += goldGain;
    this.player.steel += steelGain;
    this.gainExp(expGain);

    this.addCombatLog(`⚔️ 成功斬殺「${e.title} ${e.name}」！獲得 <b>${goldGain} 金小判</b>、<b>${steelGain} 玉鋼</b>、<b>${expGain} 經驗</b>！`);

    // 首領擊破
    if (e.isBoss) {
      const currentDefeatedZone = this.player.stats.currentZone;
      this.player.stats.bossKills++;
      this.inBossFight = false;
      this.zoneKillProgress = 0;

      // 首領掉落專屬名刀
      if (e.dropSword) {
        this.acquireSword(e.dropSword, "首領戰利品");
      }
      if (e.dropItem) {
        this.acquireItem(e.dropItem, 1);
      }

      // 如果當前關卡是最高關卡，解鎖下一關
      if (this.player.stats.currentZone === this.player.stats.highestZone && this.player.stats.highestZone < 7) {
        this.player.stats.highestZone++;
        this.player.stats.currentZone++;
        this.addCombatLog(`<span style="color:#f59e0b;font-weight:bold;">🏆 突破當前疆界！已解鎖新戰役關卡：第 ${this.player.stats.currentZone} 幕！</span>`);
      }

      if (window.samuraiAudio) window.samuraiAudio.playLevelUp();

      // 推進歷史章節與大結局判定
      this.completeAct(currentDefeatedZone);
    } else {
      // 普通怪進度增加
      if (this.zoneKillProgress < 10) {
        this.zoneKillProgress++;
        if (this.zoneKillProgress === 5) {
          this.advanceStoryMilestone(this.player.stats.currentZone);
        }
      }

      // 一般怪物掉落判定 (15% 磨刀石或飯糰)
      const dropRoll = Math.random();
      if (dropRoll < 0.08) {
        this.acquireItem("mat_whetstone_rough", 1);
        this.addCombatLog(`🎁 搜獲戰利品：獲得【荒砥石】x1`);
      } else if (dropRoll < 0.16) {
        this.acquireItem("item_onigiri", 1);
        this.addCombatLog(`🍙 拾得乾糧：獲得【梅干飯糰】x1`);
      } else if (dropRoll < 0.19) {
        this.acquireItem("mat_whetstone_mid", 1);
        this.addCombatLog(`🎁 搜獲戰利品：獲得【中砥石】x1`);
      }
    }

    // 成就檢測
    this.checkAchievements();

    // 自動生成下一位敵人
    setTimeout(() => {
      this.spawnEnemy();
    }, 600);
  }

  // 玩家戰敗處理
  handlePlayerDefeated() {
    this.addCombatLog(`<span style="color:#ef4444;font-weight:bold;">⚠️ 氣力耗盡！你暫時退回道場調養生息，體力已完全恢復。</span>`);
    const stats = this.getCalculatedStats();
    this.playerCurrentHp = stats.maxHp;
    this.inBossFight = false;
    this.comboCount = 0;
    setTimeout(() => {
      this.spawnEnemy();
    }, 1200);
  }

  // 獲得經驗與升級
  gainExp(amount) {
    this.player.exp += amount;
    let req = this.getRequiredExp(this.player.level);
    while (this.player.exp >= req) {
      this.player.exp -= req;
      this.player.level++;
      this.player.skillPoints += 2;
      const stats = this.getCalculatedStats();
      this.playerCurrentHp = stats.maxHp; // 升級回滿血

      this.addCombatLog(`<span style="color:#eab308;font-size:1.1em;font-weight:bold;">⛩️ 頓悟突破！境界提升至等級 ${this.player.level}（${this.getRankTitle(this.player.level)}）！獲得 2 點天賦點！</span>`);
      if (window.samuraiAudio) window.samuraiAudio.playLevelUp();
      req = this.getRequiredExp(this.player.level);
    }
    this.checkAchievements();
    this.updateCharacterUI();
  }

  // 獲得新名刀
  acquireSword(swordId, source = "鍛造獲得") {
    const instance = this.createSwordInstance(swordId);
    if (!instance) return;

    this.player.swordsInventory.push(instance);
    this.checkAchievements();

    // 加入圖鑑
    if (!this.player.codex.includes(swordId)) {
      this.player.codex.push(swordId);
      this.addCombatLog(`<span style="color:#38bdf8;font-weight:bold;">📖 【名刀鑑賞錄】收錄新名刀：【${instance.tierName}】${instance.name}！全屬性永久提昇！</span>`);
    }

    this.addCombatLog(`<span style="color:${instance.color};font-weight:bold;">🗡️ ${source}：獲得名刀【${instance.tierName}】${instance.name}（${instance.type}・${instance.smith}）！</span>`);
    return instance;
  }

  // 獲得道具
  acquireItem(itemId, qty = 1) {
    if (!this.player.items[itemId]) {
      this.player.items[itemId] = 0;
    }
    this.player.items[itemId] += qty;
    this.updateInventoryUI();
  }

  // 使用消耗品
  useItem(itemId) {
    if (!this.player.items[itemId] || this.player.items[itemId] <= 0) return;

    const consumable = window.ITEMS_DATA.consumables.find(c => c.id === itemId);
    if (!consumable) return;

    this.player.items[itemId]--;
    const stats = this.getCalculatedStats();

    if (consumable.type === "heal") {
      const healAmount = Math.floor(stats.maxHp * (consumable.healPercent / 100));
      this.playerCurrentHp = Math.min(stats.maxHp, this.playerCurrentHp + healAmount);
      this.addCombatLog(`🍙 食用了【${consumable.name}】，瞬間回復了 ${healAmount} 點體力！`);
    } else if (consumable.type === "buff_speed") {
      this.activeBuffs.speed = consumable.duration;
      this.addCombatLog(`💊 服下了【${consumable.name}】，出刀神速提升 35%（持續 ${consumable.duration} 秒）！`);
    } else if (consumable.type === "buff_berserk") {
      this.activeBuffs.atk = consumable.duration;
      this.addCombatLog(`🍶 豪飲【${consumable.name}】，狂暴殺氣提升 50% 攻擊力（持續 ${consumable.duration} 秒）！`);
    } else if (consumable.type === "buff_gold") {
      this.activeBuffs.gold = consumable.duration;
      this.addCombatLog(`🍵 品味【${consumable.name}】，擊敵收穫金小判翻倍（持續 ${consumable.duration} 秒）！`);
    }

    if (window.samuraiAudio) window.samuraiAudio.playSharpen();
    this.updateInventoryUI();
    this.updateBattleUI();
  }

  // 磨刀石研磨強化
  sharpenWeapon(whetstoneId) {
    const weapon = this.player.equipped.weapon;
    if (!weapon) {
      alert("請先配備名刀！");
      return;
    }
    if (!this.player.items[whetstoneId] || this.player.items[whetstoneId] <= 0) {
      alert("磨刀石不足！");
      return;
    }

    this.player.items[whetstoneId]--;
    weapon.refine = (weapon.refine || 0) + 1;
    this.player.stats.totalSharpens = (this.player.stats.totalSharpens || 0) + 1;
    this.player.gold += 0; // 磨刀微量花費或免費
    this.checkAchievements();

    if (window.samuraiAudio) window.samuraiAudio.playSharpen();
    this.addCombatLog(`✨ 使用砥石細心研磨！佩刀【${weapon.name}】磨礪至 +${weapon.refine}！鋒利度大幅提昇！`);

    this.updateForgeUI();
    this.updateCharacterUI();
    this.updateInventoryUI();
  }

  // 鍛造新名刀 (Blacksmith Gacha)
  forgeSword(type = "standard") {
    let costSteel = (type === "master") ? 80 : 25;
    let costGold = (type === "master") ? 500 : 100;

    if (this.player.steel < costSteel || this.player.gold < costGold) {
      alert(`鍛造資源不足！需要 ${costSteel} 玉鋼與 ${costGold} 金小判。`);
      return;
    }

    this.player.steel -= costSteel;
    this.player.gold -= costGold;
    this.player.stats.swordsForged++;

    if (window.samuraiAudio) window.samuraiAudio.playHammer();

    // 抽卡機率計算
    const roll = Math.random() * 100;
    let targetTier = 1;

    if (type === "master") {
      // 名匠大鍛：保底良業物(3)，高機率大業物(4)，有機會最上大業物(5)甚至神具(6)
      if (roll < 3) targetTier = 6;      // 3% 妖刀・神具
      else if (roll < 20) targetTier = 5; // 17% 最上大業物 (天下五劍)
      else if (roll < 55) targetTier = 4; // 35% 大業物
      else targetTier = 3;               // 45% 良業物
    } else {
      // 標準踏鞴鍛造
      if (roll < 2) targetTier = 5;      // 2% 最上大業物
      else if (roll < 12) targetTier = 4; // 10% 大業物
      else if (roll < 35) targetTier = 3; // 23% 良業物
      else if (roll < 70) targetTier = 2; // 35% 業物
      else targetTier = 1;               // 30% 凡鐵
    }

    const candidateSwords = window.SWORDS_DATA.filter(s => s.tier === targetTier);
    const chosen = candidateSwords[Math.floor(Math.random() * candidateSwords.length)];

    const sword = this.acquireSword(chosen.id, (type === "master" ? "🔥【名匠淬火秘鍛】" : "⚒️【傳統踏鞴鍛打】"));
    this.checkAchievements();

    // 彈出鍛造獲得提示動畫
    this.showForgeResultModal(sword);
    this.updateForgeUI();
    this.updateCharacterUI();
  }

  // 熔煉分解多餘刀刃換取玉鋼
  smeltSword(instanceId) {
    const idx = this.player.swordsInventory.findIndex(s => s.instanceId === instanceId);
    if (idx === -1) return;

    const sword = this.player.swordsInventory[idx];
    if (this.player.equipped.weapon && this.player.equipped.weapon.instanceId === instanceId) {
      alert("無法熔煉當前裝備中的佩刀！請先更換其他刀刃。");
      return;
    }

    // 依品階返還玉鋼與金小判
    const steelRefund = sword.tier * 15 + (sword.refine || 0) * 8;
    const goldRefund = sword.tier * 40;

    this.player.swordsInventory.splice(idx, 1);
    this.player.steel += steelRefund;
    this.player.gold += goldRefund;

    if (window.samuraiAudio) window.samuraiAudio.playHammer();
    this.addCombatLog(`🔥 投入熔爐！將【${sword.tierName}】${sword.name} 分解回融，獲得 ${steelRefund} 玉鋼、${goldRefund} 金小判！`);

    this.updateForgeUI();
    this.updateInventoryUI();
  }

  // 裝備刀劍
  equipSword(instanceId) {
    const sword = this.player.swordsInventory.find(s => s.instanceId === instanceId);
    if (!sword) return;
    this.player.equipped.weapon = sword;
    if (window.samuraiAudio) window.samuraiAudio.playSharpen();
    this.addCombatLog(`🗡️ 帶刀一新！拔出日本名刃【${sword.name}】，殺氣大盛！`);
    this.updateCharacterUI();
    this.updateInventoryUI();
    this.updateBattleUI();
  }

  // 流派升級加點
  investSkill(skillName) {
    if (this.player.skillPoints <= 0) {
      alert("天賦點數不足！請通過歷練提升角色等級獲取點數。");
      return;
    }
    this.player.skillPoints--;
    this.player.skills[skillName] = (this.player.skills[skillName] || 0) + 1;
    this.checkAchievements();
    if (window.samuraiAudio) window.samuraiAudio.playLevelUp();
    this.updateDojoUI();
    this.updateCharacterUI();
  }

  // 重置流派天賦
  resetSkills() {
    const totalSpent = this.player.skills.shinkage + this.player.skills.jigen + this.player.skills.rishin;
    if (totalSpent === 0) return;
    if (confirm("是否花費 100 金小判洗鍊重置所有流派天賦點？")) {
      if (this.player.gold < 100) {
        alert("金小判不足 100！");
        return;
      }
      this.player.gold -= 100;
      this.player.skillPoints += totalSpent;
      this.player.skills.shinkage = 0;
      this.player.skills.jigen = 0;
      this.player.skills.rishin = 0;
      this.updateDojoUI();
      this.updateCharacterUI();
    }
  }

  // 切換戰役關卡
  changeZone(zoneId) {
    if (zoneId > this.player.stats.highestZone) {
      alert("該戰役區域尚未解鎖！請先擊破前一區域的守關頭目。");
      return;
    }
    this.player.stats.currentZone = zoneId;
    this.inBossFight = false;
    this.zoneKillProgress = 0;
    this.spawnEnemy();
    this.updateBattleUI();
  }

  // 手動挑戰首領
  challengeBoss() {
    if (this.inBossFight) return;
    this.spawnEnemy(true);
  }

  // 切換神速自律斬擊（無障礙放置模式）
  toggleAutoSlash() {
    this.autoSlashEnabled = !this.autoSlashEnabled;
    const btn = document.getElementById("btn-toggle-autoslash");
    if (btn) {
      if (this.autoSlashEnabled) {
        btn.classList.add("active");
        btn.innerHTML = "⚡ 神速自律斬：開啟中";
        btn.title = "已開啟全自動高速出刀，完全無需點擊滑鼠！";
      } else {
        btn.classList.remove("active");
        btn.innerHTML = "💤 神速自律斬：已暫停";
        btn.title = "點擊可開啟自動高速出刀";
      }
    }
    if (window.samuraiAudio) window.samuraiAudio.playSharpen();
  }

  // 戰鬥計時器 Tick
  startCombatLoop() {
    if (this.combatTimer) clearInterval(this.combatTimer);

    let tickAccumulator = 0;
    let autoSlashAccumulator = 0;

    this.combatTimer = setInterval(() => {
      tickAccumulator += 0.2; // 每 200ms 一次 tick
      autoSlashAccumulator += 0.2;

      // 倒數增益效果時間
      if (this.activeBuffs.speed > 0) this.activeBuffs.speed = Math.max(0, this.activeBuffs.speed - 0.2);
      if (this.activeBuffs.atk > 0) this.activeBuffs.atk = Math.max(0, this.activeBuffs.atk - 0.2);
      if (this.activeBuffs.gold > 0) this.activeBuffs.gold = Math.max(0, this.activeBuffs.gold - 0.2);

      // BOSS 狂暴倒數
      if (this.inBossFight) {
        this.bossTimeRemaining = Math.max(0, this.bossTimeRemaining - 0.2);
        if (this.bossTimeRemaining <= 0) {
          this.addCombatLog(`<span style="color:#ef4444;font-weight:bold;">⏳ 首領狂暴！時限已過，挑戰失敗！</span>`);
          this.inBossFight = false;
          this.spawnEnemy();
        }
      }

      // 自動出刀攻擊頻率計算
      const stats = this.getCalculatedStats();
      const attackInterval = 1.0 / stats.speed; // 秒

      // 1. 一般基礎自動攻擊
      if (tickAccumulator >= attackInterval) {
        tickAccumulator = 0;
        this.attack(false); // 自動揮刀

        // 敵人反擊頻率（普通怪每 2.5 秒反擊一次，BOSS 每 1.8 秒）
        if (Math.random() < (this.inBossFight ? 0.35 : 0.22)) {
          this.enemyAttack();
        }
      }

      // 2. 神速自律極意：無障礙自律斬擊（完全免去手指重複點擊負擔）
      if (this.autoSlashEnabled && this.currentEnemy && this.currentEnemy.hp > 0) {
        if (autoSlashAccumulator >= 0.25) {
          autoSlashAccumulator = 0;
          this.attack(true); // 高頻拔刀斬擊
        }
      }

      // 自動自然體力回調
      if (this.playerCurrentHp < stats.maxHp) {
        this.playerCurrentHp = Math.min(stats.maxHp, this.playerCurrentHp + Math.max(1, Math.floor(stats.maxHp * 0.005)));
        this.updateBattleUI();
      }
    }, 200);
  }

  // 離線收益結算 (Offline Progression)
  checkOfflineGains() {
    const now = Date.now();
    const last = this.player.lastTimestamp || now;
    const diffSec = Math.floor((now - last) / 1000);

    // 如果離線超過 30 秒
    if (diffSec >= 30) {
      // 最長結算 12 小時 (43200 秒)
      const effectiveSec = Math.min(43200, diffSec);
      const zone = window.ZONES_DATA.find(z => z.id === this.player.stats.currentZone) || window.ZONES_DATA[0];
      const stats = this.getCalculatedStats();

      // 平均擊敵耗時（秒）
      const avgKillTime = Math.max(2.5, 6.0 / stats.speed);
      const estimatedKills = Math.floor(effectiveSec / avgKillTime);

      const tpl = zone.enemies[0];
      const expGain = Math.floor(estimatedKills * tpl.exp * 0.65);
      const goldGain = Math.floor(estimatedKills * tpl.gold * 0.65);
      const steelGain = Math.floor(estimatedKills * tpl.steel * 0.5);

      this.player.gold += goldGain;
      this.player.steel += steelGain;
      this.player.stats.totalKills += estimatedKills;
      this.gainExp(expGain);

      // 彈出離線結算卷軸
      this.showOfflineModal(effectiveSec, estimatedKills, goldGain, steelGain, expGain);
    }

    this.player.lastTimestamp = now;
  }

  // 戰鬥記錄追加
  addCombatLog(msg) {
    const box = document.getElementById("combat-log-container");
    if (!box) return;
    const timeStr = new Date().toTimeString().split(" ")[0];
    const line = document.createElement("div");
    line.className = "log-line";
    line.innerHTML = `<span class="log-time">[${timeStr}]</span> ${msg}`;
    box.appendChild(line);

    // 最多保留 40 條日誌
    while (box.children.length > 40) {
      box.removeChild(box.firstChild);
    }
    box.scrollTop = box.scrollHeight;
  }

  // 飄字傷害浮動動畫
  showDamagePopup(dmg, isCrit) {
    const arena = document.getElementById("battle-stage-arena");
    if (!arena) return;

    const popup = document.createElement("div");
    popup.className = `dmg-popup ${isCrit ? "crit-hit" : "normal-hit"}`;
    popup.textContent = (isCrit ? "會心！ " : "") + `-${dmg}`;

    // 隨機在敵人身辺位置
    const randomX = 45 + (Math.random() * 20 - 10);
    const randomY = 40 + (Math.random() * 15 - 7);
    popup.style.left = `${randomX}%`;
    popup.style.top = `${randomY}%`;

    arena.appendChild(popup);
    setTimeout(() => {
      popup.remove();
    }, 900);
  }

  // 彈出鍛造獲得名刀 Modal
  showForgeResultModal(sword) {
    const modal = document.getElementById("forge-result-modal");
    if (!modal) return;
    document.getElementById("modal-sword-name").textContent = sword.name;
    document.getElementById("modal-sword-name").style.color = sword.color;
    document.getElementById("modal-sword-tier").textContent = `【${sword.tierName}】${sword.type}（${sword.era || "日本名刀"}）`;
    document.getElementById("modal-sword-tier").style.color = sword.color;
    const modalVisual = document.getElementById("modal-sword-visual");
    if (modalVisual) modalVisual.innerHTML = sword.svg || "";
    document.getElementById("modal-sword-smith").textContent = `刀工：${sword.smith} | 刃文：${sword.hamon || "直刃"}`;
    document.getElementById("modal-sword-atk").textContent = `基礎攻擊：+${sword.baseAtk}`;
    document.getElementById("modal-sword-crit").textContent = `會心率：+${sword.crit}%`;
    document.getElementById("modal-sword-passive").textContent = sword.passive;
    document.getElementById("modal-sword-lore").textContent = sword.lore;

    modal.classList.add("active");
  }

  // 離線歷練收益 Modal
  showOfflineModal(sec, kills, gold, steel, exp) {
    const modal = document.getElementById("offline-modal");
    if (!modal) return;
    const mins = Math.floor(sec / 60);
    const hours = (mins / 60).toFixed(1);
    document.getElementById("offline-time").textContent = `${mins} 分鐘 (${hours} 小時)`;
    document.getElementById("offline-kills").textContent = kills;
    document.getElementById("offline-gold").textContent = gold;
    document.getElementById("offline-steel").textContent = steel;
    document.getElementById("offline-exp").textContent = exp;

    modal.classList.add("active");
  }

  // 存檔與讀檔
  save() {
    this.player.lastTimestamp = Date.now();
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(this.player));
      return true;
    } catch (e) {
      console.error("Save failed:", e);
      return false;
    }
  }

  load() {
    try {
      const data = localStorage.getItem(this.SAVE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.player = Object.assign(this.player, parsed);
        if (this.player.swordsInventory && window.SWORDS_DATA) {
          this.player.swordsInventory.forEach(s => {
            const base = window.SWORDS_DATA.find(b => b.id === s.id);
            if (base) {
              s.svg = base.svg || "";
              s.era = base.era || "日本古作";
              s.master = base.master || "無名武士";
              s.hamon = base.hamon || "直刃";
              s.lore = base.lore;
              s.passive = base.passive;
              s.passiveDesc = base.passiveDesc;
            }
          });
        }
        if (this.player.equipped && this.player.equipped.weapon && window.SWORDS_DATA) {
          const base = window.SWORDS_DATA.find(b => b.id === this.player.equipped.weapon.id);
          if (base) {
            this.player.equipped.weapon.svg = base.svg || "";
            this.player.equipped.weapon.era = base.era || "日本古作";
            this.player.equipped.weapon.master = base.master || "無名武士";
            this.player.equipped.weapon.hamon = base.hamon || "直刃";
            this.player.equipped.weapon.lore = base.lore;
          }
        }

        // 兼容舊存檔自動補充故事與轉生結構
        if (!this.player.story) {
          this.player.story = {
            currentAct: this.player.stats.currentZone || 1,
            faction: "unaligned",
            completedActs: [],
            unlockedEndings: [],
            history: []
          };
        }
        if (!this.player.achievements) {
          this.player.achievements = { claimed: [], highestCombo: 0 };
        }
        if (!this.player.stats.totalSharpens) {
          this.player.stats.totalSharpens = 0;
        }
        if (!this.player.prestige) {
          this.player.prestige = {
            reincarnationCount: 0,
            karma: 0,
            totalKarmaEarned: 0,
            perks: {
              perk_atk: 0,
              perk_hp: 0,
              perk_speed: 0,
              perk_crit: 0,
              perk_forge: 0,
              perk_wealth: 0,
              perk_wisdom: 0,
              perk_boss_slayer: 0
            }
          };
        }
        return true;
      }
    } catch (e) {
      console.error("Load failed:", e);
    }
    return false;
  }

  exportSave() {
    this.save();
    const jsonStr = btoa(encodeURIComponent(JSON.stringify(this.player)));
    navigator.clipboard.writeText(jsonStr).then(() => {
      alert("✅ 存檔代碼已成功複製至剪貼簿！可妥善保管。");
    }).catch(() => {
      prompt("請手動複製存檔代碼：", jsonStr);
    });
  }

  importSave() {
    const input = prompt("請貼上存檔代碼：");
    if (!input) return;
    try {
      const jsonStr = decodeURIComponent(atob(input.trim()));
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.level) {
        this.player = parsed;
        this.save();
        alert("✅ 存檔匯入成功！即將重新載入遊戲。");
        window.location.reload();
      } else {
        alert("❌ 存檔格式不正確！");
      }
    } catch (e) {
      alert("❌ 存檔代碼無效，解析失敗！");
    }
  }

  resetGame() {
    if (confirm("⚠️ 警告：確定要重置所有遊戲進度嗎？所有刀劍、劍理與玉鋼將重歸虛無！")) {
      if (confirm("最後確認：真的要重新開始修行？")) {
        localStorage.removeItem(this.SAVE_KEY);
        window.location.reload();
      }
    }
  }

  // 切換分頁 UI
  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    document.querySelectorAll(".tab-pane").forEach(pane => {
      pane.classList.toggle("active", pane.id === `tab-${tabName}`);
    });

    if (tabName === "story") this.updateStoryUI();
    if (tabName === "prestige") this.updatePrestigeUI();
    if (tabName === "achievements") this.updateAchievementsUI();
    if (tabName === "forge") this.updateForgeUI();
    if (tabName === "dojo") this.updateDojoUI();
    if (tabName === "inventory") this.updateInventoryUI();
    if (tabName === "codex") this.updateCodexUI();

    window.dispatchEvent(new Event('resize'));
  }

  // UI 渲染更新整合
  updateCharacterUI() {
    const lang = window.getLang ? window.getLang() : "zh-TW";
    const stats = this.getCalculatedStats();

    // 預設浪人名稱在地化
    let displayName = this.player.name;
    if (!displayName || displayName === "無名浪人" || displayName === "Nameless Ronin" || displayName === "無名の浪人") {
      displayName = lang === "ja" ? "無名の浪人" : (lang === "en" ? "Nameless Ronin" : "無名浪人");
    }
    document.getElementById("player-name").textContent = displayName;
    document.getElementById("player-title").textContent = this.getRankTitle(this.player.level);
    document.getElementById("player-level").textContent = `Lv.${this.player.level}`;

    const reqExp = this.getRequiredExp(this.player.level);
    const expPercent = Math.min(100, Math.floor((this.player.exp / reqExp) * 100));
    document.getElementById("player-exp-bar").style.width = `${expPercent}%`;
    document.getElementById("player-exp-text").textContent = `${this.player.exp} / ${reqExp} (${expPercent}%)`;

    // 資源（金幣、玉鋼、輪迴魂火）
    document.getElementById("res-gold").textContent = this.player.gold.toLocaleString();
    document.getElementById("res-steel").textContent = this.player.steel.toLocaleString();
    const karmaEl = document.getElementById("res-karma");
    if (karmaEl) {
      karmaEl.textContent = (this.player.prestige ? this.player.prestige.karma : 0).toLocaleString();
    }

    // 命運陣營標籤
    const factionBadge = document.getElementById("player-faction-badge");
    if (factionBadge && window.STORY_DATA && this.player.story) {
      const fid = this.player.story.faction || "unaligned";
      const f = window.STORY_DATA.factions[fid] || window.STORY_DATA.factions.unaligned;
      const fText = window.getFactionText ? window.getFactionText(fid, lang) : f;
      factionBadge.textContent = `${f.icon} ${fText.name || f.name}`;
      factionBadge.style.background = f.color + "22";
      factionBadge.style.borderColor = f.color;
      factionBadge.style.color = f.color;
    }

    // 戰鬥屬性面板
    document.getElementById("stat-atk").textContent = stats.atk.toLocaleString();
    document.getElementById("stat-def").textContent = stats.def.toLocaleString();
    document.getElementById("stat-crit").textContent = `${stats.crit}%`;
    document.getElementById("stat-critdmg").textContent = `${stats.critDmg}%`;
    const speedUnit = window.t ? window.t("statPerSec") : "次/秒";
    document.getElementById("stat-speed").textContent = `${stats.speed.toFixed(2)} ${speedUnit}`;
    document.getElementById("stat-pen").textContent = `${stats.armorPen}%`;

    // 武器展示
    const weapon = this.player.equipped.weapon;
    const weaponEl = document.getElementById("equip-weapon-display");
    if (weapon) {
      const wText = window.getSwordText ? window.getSwordText(weapon, lang) : weapon;
      weaponEl.innerHTML = `
        <div class="equip-card" style="border-color:${weapon.color}">
          <span class="equip-tier" style="background:${weapon.color}">${wText.tierName}</span>
          <div class="equip-name" style="color:${weapon.color}">
            ${wText.name} ${weapon.refine > 0 ? `+${weapon.refine}` : ""}
          </div>
          <div class="equip-sword-visual">
            ${weapon.svg || ""}
          </div>
          <div class="equip-sub">${wText.type}・${wText.smith}（${wText.era || "日本古作"}）</div>
          <div class="equip-stat">攻 +${weapon.baseAtk + (weapon.refine * 15)} | 會心 +${weapon.crit}%</div>
          <div class="equip-passive">${wText.passive}</div>
        </div>
      `;
    }
  }

  updateBattleUI() {
    const stats = this.getCalculatedStats();

    // 玩家體力條
    const hpPercent = Math.max(0, Math.min(100, Math.floor((this.playerCurrentHp / stats.maxHp) * 100)));
    const playerBar = document.getElementById("player-hp-bar");
    if (playerBar) {
      playerBar.style.width = `${hpPercent}%`;
      document.getElementById("player-hp-text").textContent = `${this.playerCurrentHp} / ${stats.maxHp}`;
    }

    // 敵人體力條與資訊
    if (this.currentEnemy) {
      const e = this.currentEnemy;
      document.getElementById("enemy-name").textContent = e.name;
      const enemyHpPercent = Math.max(0, Math.min(100, Math.floor((e.hp / e.maxHp) * 100)));
      const enemyBar = document.getElementById("enemy-hp-fill") || document.getElementById("enemy-hp-bar");
      if (enemyBar) {
        enemyBar.style.width = `${enemyHpPercent}%`;
      }
      const enemyHpText = document.getElementById("enemy-hp-text");
      if (enemyHpText) {
        enemyHpText.textContent = `${e.hp} / ${e.maxHp}`;
      }

      // 首領倒數時鐘
      const bossClock = document.getElementById("boss-timer-box");
      if (this.inBossFight) {
        bossClock.style.display = "block";
        document.getElementById("boss-timer-num").textContent = Math.ceil(this.bossTimeRemaining);
        document.getElementById("boss-timer-fill").style.width = `${(this.bossTimeRemaining / this.bossMaxTime) * 100}%`;
      } else {
        bossClock.style.display = "none";
      }

      // 首領按鈕狀態
      const challengeBtn = document.getElementById("btn-challenge-boss");
      if (challengeBtn) {
        challengeBtn.disabled = this.inBossFight;
        if (this.inBossFight) {
          challengeBtn.textContent = "⚔️ 首領決戰激鬥中...";
        } else if (this.zoneKillProgress >= 10) {
          challengeBtn.textContent = "⚡ 首領挑戰已解鎖！點擊拔刀！";
          challengeBtn.classList.add("pulse-glow");
        } else {
          challengeBtn.textContent = `討伐小怪召喚首領 (${this.zoneKillProgress}/10)`;
          challengeBtn.classList.remove("pulse-glow");
        }
      }
    }

    // 當前戰役地圖名稱
    const lang = window.getLang ? window.getLang() : "zh-TW";
    const zone = window.ZONES_DATA.find(z => z.id === this.player.stats.currentZone) || window.ZONES_DATA[0];
    const zText = window.getZoneText ? window.getZoneText(zone.id, lang) : zone;
    const actPrefix = lang === 'en' ? `Act ${zone.id}: ` : `第 ${zone.id} 幕・`;
    document.getElementById("current-zone-name").textContent = `${actPrefix}${zText.name || zone.name}`;
    document.getElementById("current-zone-sub").textContent = zText.sub || zone.subtitle;

    const zoneSelect = document.getElementById("zone-select");
    if (zoneSelect && zoneSelect.options) {
      Array.from(zoneSelect.options).forEach(opt => {
        const zid = parseInt(opt.value);
        const zt = window.getZoneText ? window.getZoneText(zid, lang) : null;
        if (zt && zt.name) {
          opt.textContent = `${lang === 'en' ? `Act ${zid}: ` : `第 ${zid} 幕・`}${zt.name}`;
        }
      });
    }

    // 連擊計數
    const comboEl = document.getElementById("combo-counter");
    if (comboEl) {
      if (this.comboCount > 1) {
        comboEl.style.display = "block";
        comboEl.textContent = `${this.comboCount} 連斬！`;
      } else {
        comboEl.style.display = "none";
      }
    }
  }

  updateForgeUI() {
    const fSteel = document.getElementById("forge-steel");
    if (fSteel) fSteel.textContent = this.player.steel.toLocaleString();
    const fGold = document.getElementById("forge-gold");
    if (fGold) fGold.textContent = this.player.gold.toLocaleString();

    // 磨刀石庫存
    document.getElementById("count-whetstone-rough").textContent = this.player.items.mat_whetstone_rough || 0;
    document.getElementById("count-whetstone-mid").textContent = this.player.items.mat_whetstone_mid || 0;
    document.getElementById("count-whetstone-fine").textContent = this.player.items.mat_whetstone_fine || 0;

    // 當前武器磨刀預覽
    const weapon = this.player.equipped.weapon;
    const sharpenBox = document.getElementById("sharpen-weapon-target");
    if (weapon) {
      sharpenBox.innerHTML = `
        <div style="color:${weapon.color};font-weight:bold;font-size:1.15em;">
          【${weapon.tierName}】${weapon.name} ${weapon.refine > 0 ? `+${weapon.refine}` : ""}
        </div>
        <div style="font-size:0.9em;color:#a8a29e;margin-top:4px;">
          當前攻擊力：+${weapon.baseAtk + weapon.refine * 15}
          <span style="color:#4ade80;">➡️ 研磨後：+${weapon.baseAtk + (weapon.refine + 1) * 15} (+15)</span>
        </div>
      `;
    }

    // 熔煉列表渲染（可分解之名刀）
    const smeltList = document.getElementById("smelt-swords-list");
    if (smeltList) {
      const redundantSwords = this.player.swordsInventory.filter(s =>
        !this.player.equipped.weapon || s.instanceId !== this.player.equipped.weapon.instanceId
      );

      if (redundantSwords.length === 0) {
        smeltList.innerHTML = `<div class="empty-hint">暫無可熔煉之多餘名刀</div>`;
      } else {
        smeltList.innerHTML = redundantSwords.map(s => `
          <div class="smelt-card">
            <div>
              <span style="color:${s.color};font-weight:bold;">【${s.tierName}】${s.name} ${s.refine > 0 ? `+${s.refine}` : ""}</span>
              <span style="font-size:0.85em;color:#78716c;margin-left:8px;">${s.type}</span>
            </div>
            <button class="btn-smelt" onclick="window.game.smeltSword('${s.instanceId}')">
              熔煉 (+${s.tier * 15} 玉鋼)
            </button>
          </div>
        `).join("");
      }
    }
  }

  updateDojoUI() {
    document.getElementById("dojo-skill-points").textContent = this.player.skillPoints;
    document.getElementById("skill-shinkage-level").textContent = `Lv.${this.player.skills.shinkage}`;
    document.getElementById("skill-jigen-level").textContent = `Lv.${this.player.skills.jigen}`;
    document.getElementById("skill-rishin-level").textContent = `Lv.${this.player.skills.rishin}`;
  }

  updateInventoryUI() {
    const lang = window.getLang ? window.getLang() : "zh-TW";
    // 渲染背包內名刀列表
    const swordsGrid = document.getElementById("inventory-swords-grid");
    if (swordsGrid) {
      swordsGrid.innerHTML = this.player.swordsInventory.map(s => {
        const isEquipped = this.player.equipped.weapon && this.player.equipped.weapon.instanceId === s.instanceId;
        const sText = window.getSwordText ? window.getSwordText(s, lang) : s;
        return `
          <div class="inv-item-card ${isEquipped ? 'equipped' : ''}" style="border-left: 4px solid ${s.color}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="inv-item-name" style="color:${s.color}">
                ${sText.name} ${s.refine > 0 ? `+${s.refine}` : ""}
              </span>
              <span class="inv-item-tier" style="background:${s.color}">${sText.tierName}</span>
            </div>
            <div class="inv-sword-visual">
              ${s.svg || ""}
            </div>
            <div class="inv-item-details">
              <span>攻 +${s.baseAtk + s.refine * 15}</span>
              <span>會心 +${s.crit}%</span>
              <span>速 x${s.speed.toFixed(2)}</span>
            </div>
            <div class="inv-item-meta" style="font-size:0.8rem;color:#a8a29e;margin:4px 0;">
              <span>${sText.type}・${sText.smith}</span> | <span>${sText.era || "日本古作"}</span>
            </div>
            <div class="inv-item-passive">${sText.passive}</div>
            <div class="inv-item-actions">
              ${isEquipped ?
                `<button class="btn-equip active" disabled>${window.t ? window.t("btnEquipped") : "已裝著"}</button>` :
                `<button class="btn-equip" onclick="window.game.equipSword('${s.instanceId}')">${window.t ? window.t("btnEquip") : "帶刀（裝備）"}</button>`
              }
            </div>
          </div>
        `;
      }).join("");
    }

    // 渲染消耗品
    const consumablesBox = document.getElementById("inventory-consumables-grid");
    if (consumablesBox) {
      consumablesBox.innerHTML = window.ITEMS_DATA.consumables.map(c => {
        const count = this.player.items[c.id] || 0;
        const cText = window.getItemText ? window.getItemText(c, lang) : c;
        return `
          <div class="consumable-card">
            <div class="con-icon">${c.icon}</div>
            <div class="con-info">
              <div class="con-name">${cText.name} <span class="con-qty">x${count}</span></div>
              <div class="con-desc">${cText.desc}</div>
            </div>
            <button class="btn-use" ${count <= 0 ? "disabled" : ""} onclick="window.game.useItem('${c.id}')">
              ${window.t ? window.t("btnUse") : "使用"}
            </button>
          </div>
        `;
      }).join("");
    }
  }

  updateCodexUI() {
    const list = document.getElementById("codex-swords-list");
    if (!list) return;

    const lang = window.getLang ? window.getLang() : "zh-TW";
    const totalSwords = window.SWORDS_DATA.length;
    const unlockedCount = this.player.codex.length;
    document.getElementById("codex-progress").textContent = `${unlockedCount} / ${totalSwords} (${Math.floor((unlockedCount / totalSwords) * 100)}%)`;

    list.innerHTML = window.SWORDS_DATA.map(s => {
      const isUnlocked = this.player.codex.includes(s.id);
      const sText = window.getSwordText ? window.getSwordText(s, lang) : s;
      const lockedName = window.t ? window.t("codexLockedName") : "？？？？（未解鎖）";
      const lockedTip = window.t ? window.t("codexLockedTip") : "討伐戰國頭目或於鍛冶屋行淬火秘鍛，以解鎖此名刃銘鑑傳承。";
      const smithLabel = window.t ? window.t("codexSmith") : "刀工：";
      const eraLabel = window.t ? window.t("codexEra") : "時代：";
      const masterLabel = window.t ? window.t("codexMaster") : "傳承名將：";
      const hamonLabel = window.t ? window.t("codexHamon") : "刃文樣式：";
      const bonusText = window.t ? window.t("codexBonus") : "✨ 銘鑑之證：全武士體力 +30，攻擊力 +5";

      return `
        <div class="codex-item-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="codex-header">
            <span class="codex-name" style="color: ${isUnlocked ? s.color : '#78716c'}">
              ${isUnlocked ? sText.name : lockedName}
            </span>
            <span class="codex-tier" style="border-color:${isUnlocked ? s.color : '#444'}; color:${isUnlocked ? s.color : '#777'}">
              ${sText.tierName}
            </span>
          </div>
          ${isUnlocked && s.svg ? `<div class="codex-sword-visual">${s.svg}</div>` : ""}
          <div class="codex-meta">
            <span>${isUnlocked ? s.romaji : "---"}</span>
            <span>${smithLabel}${isUnlocked ? sText.smith : "？？？"}</span>
            <span>${eraLabel}${isUnlocked ? (sText.era || "古傳") : "？？？"}</span>
          </div>
          ${isUnlocked && s.master ? `<div class="codex-extra-info"><b>${masterLabel}</b>${sText.master}</div>` : ""}
          ${isUnlocked && s.hamon ? `<div class="codex-extra-info"><b>${hamonLabel}</b>${sText.hamon}</div>` : ""}
          <div class="codex-lore">
            ${isUnlocked ? sText.lore : lockedTip}
          </div>
          ${isUnlocked ? `<div class="codex-bonus">${bonusText}</div>` : ""}
        </div>
      `;
    }).join("");
  }

  // 設置無障礙操作：支援長按連斬、按住空白鍵、Z鍵或Enter，大幅減輕手指負擔
  setupAccessibilityControls() {
    let isHolding = false;
    let holdInterval = null;
    let lastPointerAttack = 0;

    const startHolding = (e) => {
      if (isHolding) return;
      isHolding = true;
      lastPointerAttack = Date.now();
      this.attack(true);
      if (holdInterval) clearInterval(holdInterval);
      holdInterval = setInterval(() => {
        if (isHolding) {
          this.attack(true);
        }
      }, 180);
    };

    const stopHolding = () => {
      isHolding = false;
      if (holdInterval) {
        clearInterval(holdInterval);
        holdInterval = null;
      }
    };

    const arena = document.getElementById("battle-stage-arena");
    if (arena) {
      // Modern unified pointer events for Mobile Touch, S-Pen, and Mouse
      arena.addEventListener("pointerdown", startHolding);
      window.addEventListener("pointerup", stopHolding);
      window.addEventListener("pointercancel", stopHolding);
      arena.addEventListener("pointerleave", stopHolding);

      // Filter out duplicate synthetic click event right after pointerdown on mobile
      arena.addEventListener("click", (e) => {
        if (Date.now() - lastPointerAttack < 350) {
          return;
        }
        this.attack(true);
      });
    }

    // 鍵盤無障礙支援：按住空白鍵、Z 或 Enter
    window.addEventListener("keydown", (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;
      if (e.code === "Space" || e.key === " " || e.code === "KeyZ" || e.code === "Enter") {
        e.preventDefault();
        startHolding();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "Space" || e.key === " " || e.code === "KeyZ" || e.code === "Enter") {
        stopHolding();
      }
    });
  }

  // 初始化啟動
  start() {
    this.load();
    this.checkOfflineGains();
    this.spawnEnemy();
    this.startCombatLoop();
    this.setupAccessibilityControls();

    // 每 10 秒自動存檔
    this.autoSaveTimer = setInterval(() => {
      this.save();
    }, 10000);

    // 行動裝置切換分頁與鎖定螢幕喚醒支援 (Visibility Lifecycle for vivo, Sharp, Pixel, Samsung, Sony)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.save();
      } else {
        this.checkOfflineGains();
        this.updateCharacterUI();
        this.updateBattleUI();
        if (window.samuraiAudio) {
          window.samuraiAudio.ensureContext();
        }
        window.dispatchEvent(new Event("resize"));
      }
    });

    // 初始 UI 渲染
    this.updateCharacterUI();
    this.updateBattleUI();
    this.updateInventoryUI();
    this.updateForgeUI();
    this.updateDojoUI();
    this.updateCodexUI();
    this.updateStoryUI();
    this.updatePrestigeUI();
    this.updateAchievementsUI();
  }

  // ==========================================================
  // 命運繪卷與分歧故事線引擎 (Story & Branching Choices)
  // ==========================================================

  // 選擇命運陣營
  chooseFaction(factionId) {
    if (!window.STORY_DATA || !window.STORY_DATA.factions[factionId]) return;
    const f = window.STORY_DATA.factions[factionId];
    this.player.story.faction = factionId;
    this.checkAchievements();
    this.player.story.history.push({
      timestamp: Date.now(),
      act: 3,
      event: `選擇投身【${f.name}】`
    });

    if (window.samuraiAudio) window.samuraiAudio.playLevelUp();
    this.addCombatLog(`<span style="color:${f.color};font-weight:bold;">⚔️ 【天命抉擇】你立下誓言，正式投身【${f.name}】！獲得專屬陣營庇佑：${f.passiveDesc}！</span>`);

    alert(`📜 【天命立誓】\n你已投身【${f.name}】！\n\n信念：${f.sub}\n專屬庇佑：${f.passiveDesc}`);
    this.updateCharacterUI();
    this.updateStoryUI();
    this.updateBattleUI();
    this.save();
  }

  // 推進故事對白里程碑
  advanceStoryMilestone(zoneId) {
    if (!window.STORY_DATA) return;
    const chapter = window.STORY_DATA.chapters.find(c => c.act === zoneId);
    if (chapter && chapter.milestoneDialogue && chapter.milestoneDialogue.length > 0) {
      const line = chapter.milestoneDialogue[0];
      this.addCombatLog(`<span style="color:#38bdf8;">📜 【劇情推進】${line.speaker}：「${line.text}」</span>`);
      this.updateStoryUI();
    }
  }

  // 擊破當幕首領，完成章節推進
  completeAct(actNum) {
    if (!this.player.story) return;
    if (!this.player.story.completedActs.includes(actNum)) {
      this.player.story.completedActs.push(actNum);
    this.checkAchievements();
      this.addCombatLog(`<span style="color:#fbbf24;font-weight:bold;">📜 【命運繪卷】突破第 ${actNum} 幕歷史篇章！</span>`);
    }

    if (actNum === 7) {
      // 最終第 7 幕擊破：迎向歷史大結局！
      this.triggerEnding();
    } else {
      if (this.player.story.currentAct <= actNum) {
        this.player.story.currentAct = actNum + 1;
      }
    }
    this.updateStoryUI();
    this.save();
  }

  // 觸發歷史大結局
  triggerEnding() {
    let endingId = "ending_hermit";
    if (this.player.story.faction === "shogunate") endingId = "ending_shogunate";
    else if (this.player.story.faction === "ishin") endingId = "ending_ishin";
    else if (this.player.story.faction === "shura") endingId = "ending_shura";

    const ending = window.STORY_DATA.endings[endingId];
    if (!ending) return;

    if (!this.player.story.unlockedEndings.includes(endingId)) {
      this.player.story.unlockedEndings.push(endingId);
      this.player.prestige.karma += ending.karmaReward;
      this.player.prestige.totalKarmaEarned += ending.karmaReward;
    }

    if (window.samuraiAudio) window.samuraiAudio.playLevelUp();
    this.addCombatLog(`<span style="color:${ending.color};font-size:1.15em;font-weight:bold;">🏆 【歷史大結局達成】${ending.title}！獲得 ${ending.karmaReward} 輪迴魂火獎勵！</span>`);

    this.showEndingModal(ending);
    this.updateCharacterUI();
    this.updateStoryUI();
    this.updatePrestigeUI();
    this.save();
  }

  // 顯示結局 Modal
  showEndingModal(ending) {
    const modal = document.getElementById("ending-modal");
    if (!modal) return;
    document.getElementById("ending-modal-icon").textContent = ending.icon;
    document.getElementById("ending-modal-title").textContent = ending.title;
    document.getElementById("ending-modal-title").style.color = ending.color;
    document.getElementById("ending-modal-tagline").textContent = ending.tagline;
    document.getElementById("ending-modal-epilogue").textContent = ending.epilogue;
    document.getElementById("ending-modal-reward").textContent = `${ending.rewardTitle}（+${ending.karmaReward} 輪迴魂火）`;
    modal.classList.add("active");
  }

  // 故事線 UI 渲染
  updateStoryUI() {
    if (!window.STORY_DATA || !this.player.story) return;

    // 1. 當前陣營英雄旗幟
    const lang = window.getLang ? window.getLang() : "zh-TW";
    const factionId = this.player.story.faction || "unaligned";
    const f = window.STORY_DATA.factions[factionId] || window.STORY_DATA.factions.unaligned;
    const fText = window.getFactionText ? window.getFactionText(factionId, lang) : f;
    const bannerEl = document.getElementById("story-faction-banner");
    if (bannerEl) {
      bannerEl.innerHTML = `
        <div class="faction-badge-big" style="border-color:${f.color};color:${f.color};box-shadow:0 0 15px ${f.color}44;">
          ${f.icon}
        </div>
        <div class="faction-banner-info">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <h3 style="color:${f.color};font-size:1.35rem;margin:0;">${fText.name || f.name}</h3>
            <span style="font-size:0.75rem;padding:2px 8px;border-radius:4px;background:${f.color}22;border:1px solid ${f.color};color:${f.color};">${fText.sub || f.sub}</span>
          </div>
          <p style="font-size:0.85rem;color:#cbd5e1;margin:4px 0;">${fText.desc || f.desc}</p>
          <div class="faction-passive-pill" style="border-left:3px solid ${f.color};background:rgba(0,0,0,0.4);padding:4px 8px;border-radius:4px;font-size:0.82rem;color:#fbbf24;">
            ✨ <b>${lang === 'en' ? 'Faction Blessing' : (lang === 'ja' ? '陣営加護' : '陣營天賦庇佑')}</b>：${fText.passiveDesc || f.passiveDesc}
          </div>
        </div>
      `;
    }

    // 2. 當前章節情報
    const currentActNum = Math.min(7, Math.max(1, this.player.stats.currentZone || 1));
    const chapter = window.STORY_DATA.chapters.find(c => c.act === currentActNum) || window.STORY_DATA.chapters[0];

    const tagEl = document.getElementById("story-act-tag");
    if (tagEl) tagEl.textContent = `第 ${chapter.act} 幕（${this.inBossFight ? "決戰頭目中" : `進度: ${this.zoneKillProgress}/10`}）`;
    const titleEl = document.getElementById("story-act-title");
    if (titleEl) titleEl.textContent = chapter.title;
    const summaryEl = document.getElementById("story-act-summary");
    if (summaryEl) {
      let flavor = chapter.summary;
      if (chapter.branchFlavor && chapter.branchFlavor[factionId]) {
        flavor += `<br><span style="color:${f.color};font-size:0.88rem;display:inline-block;margin-top:6px;">🏮 <b>【${f.name}專屬歷史線索】</b>：${chapter.branchFlavor[factionId]}</span>`;
      }
      summaryEl.innerHTML = flavor;
    }

    // 3. 歷練劇幕對白 Stream
    const dialogueStream = document.getElementById("story-dialogue-stream");
    if (dialogueStream) {
      let dialogues = [...chapter.introDialogue];
      if (this.zoneKillProgress >= 5 && chapter.milestoneDialogue) {
        dialogues = dialogues.concat(chapter.milestoneDialogue);
      }
      if (this.inBossFight && chapter.bossDialogue) {
        dialogues = dialogues.concat(chapter.bossDialogue);
      }
      if (this.player.story.completedActs.includes(chapter.act) && chapter.clearDialogue) {
        dialogues = dialogues.concat(chapter.clearDialogue);
      }

      dialogueStream.innerHTML = dialogues.map(d => {
        const isPlayer = d.speaker === "你" || d.speaker === "浪人";
        return `
          <div class="dialogue-line ${isPlayer ? 'player' : 'npc'}">
            <span class="dialogue-speaker">${d.speaker}:</span>
            <span class="dialogue-text">${d.text}</span>
          </div>
        `;
      }).join("");
    }

    // 4. 分歧天命決斷區域 (在第 3 幕，且陣營仍為 unaligned 時出現)
    const choiceSection = document.getElementById("story-choice-section");
    const choicesGrid = document.getElementById("story-choices-grid");
    if (choiceSection && choicesGrid) {
      if (currentActNum >= 3 && this.player.story.faction === "unaligned") {
        choiceSection.style.display = "block";
        const chapter3 = window.STORY_DATA.chapters[2];
        choicesGrid.innerHTML = chapter3.choices.map(c => `
          <div class="story-choice-card faction-${c.faction}">
            <h4 style="margin-bottom:6px;color:${window.STORY_DATA.factions[c.faction].color};">${c.name}</h4>
            <p style="font-size:0.83rem;color:#cbd5e1;line-height:1.5;margin-bottom:12px;">${c.desc}</p>
            <button class="btn-choose-faction btn-${c.faction}" onclick="window.game.chooseFaction('${c.faction}')">
              立誓投身此道
            </button>
          </div>
        `).join("");
      } else {
        choiceSection.style.display = "none";
      }
    }

    // 5. 七大幕天命全記錄時間軸 (Timeline)
    const timelineEl = document.getElementById("story-acts-timeline");
    if (timelineEl) {
      timelineEl.innerHTML = window.STORY_DATA.chapters.map(c => {
        const isCompleted = this.player.story.completedActs.includes(c.act);
        const isCurrent = this.player.stats.currentZone === c.act;
        let statusTag = isCompleted ? "✅ 已突破" : (isCurrent ? "⚔️ 討伐中" : "🔒 未開闢");
        let statusClass = isCompleted ? "completed" : (isCurrent ? "current" : "locked");
        return `
          <div class="timeline-act-cell ${statusClass}">
            <div class="act-cell-top">
              <span class="act-badge">第 ${c.act} 幕</span>
              <span class="act-status">${statusTag}</span>
            </div>
            <div class="act-name">${c.title}</div>
          </div>
        `;
      }).join("");
    }

    // 6. 四大歷史終章大結局錄
    const endingsGrid = document.getElementById("story-endings-grid");
    if (endingsGrid) {
      endingsGrid.innerHTML = Object.values(window.STORY_DATA.endings).map(ed => {
        const isUnlocked = this.player.story.unlockedEndings.includes(ed.id);
        return `
          <div class="ending-archive-card ${isUnlocked ? 'unlocked' : 'locked'}" style="${isUnlocked ? `border-color:${ed.color}` : ''}">
            <div class="ending-archive-header">
              <span style="font-size:1.8rem;">${isUnlocked ? ed.icon : '🔒'}</span>
              <div>
                <h4 style="color:${isUnlocked ? ed.color : '#6b7280'};font-size:1rem;margin:0;">${isUnlocked ? ed.title : '【未勘破之歷史迷霧】'}</h4>
                <span style="font-size:0.75rem;color:#9ca3af;">${isUnlocked ? ed.tagline : '達成第 7 幕特定陣營終局解鎖'}</span>
              </div>
            </div>
            ${isUnlocked ? `
              <div class="ending-archive-body">${ed.epilogue}</div>
              <div class="ending-reward-badge" style="color:${ed.color};border:1px solid ${ed.color}44;">
                🏆 永久頭銜：${ed.rewardTitle} | 魂火 +${ed.karmaReward}
              </div>
            ` : `
              <div style="font-size:0.8rem;color:#6b7280;margin-top:8px;">需於本幕或轉生後選擇相應命運路線，並在江戶天守閣擊破天下無雙。</div>
            `}
          </div>
        `;
      }).join("");
    }
  }

  // ==========================================================
  // 劍心輪迴與轉生神龕引擎 (Prestige & Reincarnation System)
  // ==========================================================

  // 發動劍心輪迴轉生
  reincarnate() {
    if (this.player.level < window.PRESTIGE_DATA.unlockLevel && (this.player.stats.highestZone || 1) < window.PRESTIGE_DATA.unlockZone) {
      alert(`🌀 劍心尚未歷練圓滿！需要達到等級 ${window.PRESTIGE_DATA.unlockLevel} 或通過第 ${window.PRESTIGE_DATA.unlockZone} 幕（京都三條）方可發動劍心輪迴。`);
      return;
    }

    const karmaEarned = window.PRESTIGE_DATA.calculateKarmaEarned(this.player);
    const confirmMsg = `🌀 【劍心輪迴・宿命轉生】\n\n` +
      `本次輪迴將獲得：🔥 ${karmaEarned} 點【輪迴魂火】！\n\n` +
      `✅ 永久保留：\n` +
      `• 所有已解鎖名刀與研磨強化等級\n` +
      `• 名刀鑑賞圖鑑全收集與屬性\n` +
      `• 輪迴天賦神龕永久強化項目\n` +
      `• 已解鎖之歷史終章大結局繪卷\n\n` +
      `🔄 重置內容：\n` +
      `• 角色等級重置為初始（受輪迴宿慧天賦加成）\n` +
      `• 當前關卡與金小判重置\n` +
      `• 故事線陣營重置（可重新選擇其他分歧劇情與收集全結局！）\n\n` +
      `是否立即啟動劍心輪迴？`;

    if (!confirm(confirmMsg)) return;

    // 發放魂火
    this.player.prestige.karma += karmaEarned;
    this.player.prestige.totalKarmaEarned += karmaEarned;
    this.player.prestige.reincarnationCount++;
    this.checkAchievements();

    // 計算初始起步等級（受 perk_wisdom 影響）
    const wisdomLevel = (this.player.prestige.perks && this.player.prestige.perks.perk_wisdom) || 0;
    const startLevel = 1 + wisdomLevel * 2;
    const wealthLevel = (this.player.prestige.perks && this.player.prestige.perks.perk_wealth) || 0;
    const startGold = 100 + wealthLevel * 50;
    const startSteel = 30 + wealthLevel * 15;

    // 執行重置
    this.player.level = startLevel;
    this.player.exp = 0;
    this.player.gold = startGold;
    this.player.steel = startSteel;
    this.player.skillPoints = (startLevel - 1) * 2;
    this.player.skills = { shinkage: 0, jigen: 0, rishin: 0 };
    this.player.stats.currentZone = 1;
    this.zoneKillProgress = 0;
    this.inBossFight = false;

    // 重置故事線以便體驗其他分歧
    this.player.story.currentAct = 1;
    this.player.story.faction = "unaligned";

    const stats = this.getCalculatedStats();
    this.playerCurrentHp = stats.maxHp;

    if (window.samuraiAudio) window.samuraiAudio.playLevelUp();
    this.addCombatLog(`<span style="color:#f59e0b;font-size:1.15em;font-weight:bold;">🌀 【劍心輪迴完成】轉生重生！獲得 ${karmaEarned} 輪迴魂火！天賦點數與屬性已大幅強化！</span>`);

    this.spawnEnemy();
    this.updateCharacterUI();
    this.updateBattleUI();
    this.updateDojoUI();
    this.updateForgeUI();
    this.updateInventoryUI();
    this.updateStoryUI();
    this.updatePrestigeUI();
    this.save();

    alert(`✨ 轉生成功！\n已獲得 ${karmaEarned} 點輪迴魂火！\n您現在可以在【劍心轉生】分頁點選強大的永久天賦神龕！`);
  }

  // 升級輪迴天賦神龕
  upgradePrestigePerk(perkId) {
    const perk = window.PRESTIGE_DATA.perks.find(p => p.id === perkId);
    if (!perk) return;

    const currentLevel = this.player.prestige.perks[perkId] || 0;
    if (currentLevel >= perk.maxLevel) {
      alert("此輪迴天賦已修煉至至高大圓滿階級！");
      return;
    }

    const cost = window.PRESTIGE_DATA.getPerkCost(perkId, currentLevel);
    if (this.player.prestige.karma < cost) {
      alert(`輪迴魂火不足！需要 ${cost} 點魂火，當前持有 ${this.player.prestige.karma} 點。`);
      return;
    }

    this.player.prestige.karma -= cost;
    this.player.prestige.perks[perkId] = currentLevel + 1;
    this.checkAchievements();

    if (window.samuraiAudio) window.samuraiAudio.playHammer();
    this.addCombatLog(`🔥 點亮輪迴神龕【${perk.name}】至 Lv.${this.player.prestige.perks[perkId]}！獲得永久神力加護！`);

    this.updateCharacterUI();
    this.updateBattleUI();
    this.updatePrestigeUI();
    this.save();
  }

  // 輪迴天賦 UI 渲染
  updatePrestigeUI() {
    if (!window.PRESTIGE_DATA || !this.player.prestige) return;

    const karma = this.player.prestige.karma || 0;
    const count = this.player.prestige.reincarnationCount || 0;
    const gainPreview = window.PRESTIGE_DATA.calculateKarmaEarned(this.player);

    const countEl = document.getElementById("prestige-count");
    if (countEl) countEl.textContent = count;
    const karmaEl = document.getElementById("prestige-karma");
    if (karmaEl) karmaEl.textContent = karma.toLocaleString();
    const previewEl = document.getElementById("prestige-gain-preview");
    if (previewEl) previewEl.textContent = `+${gainPreview.toLocaleString()}`;

    // 判斷轉生按鈕可用性
    const btnReincarnate = document.getElementById("btn-do-reincarnate");
    if (btnReincarnate) {
      const canReincarnate = (this.player.level >= window.PRESTIGE_DATA.unlockLevel || (this.player.stats.highestZone || 1) >= window.PRESTIGE_DATA.unlockZone);
      if (canReincarnate) {
        btnReincarnate.disabled = false;
        btnReincarnate.style.opacity = "1";
        btnReincarnate.style.cursor = "pointer";
        const rebText = window.t ? window.t("prestigeRebirthBtn") : "🌀 斬斷因果・發動劍心輪迴";
        btnReincarnate.innerHTML = `${rebText} (+${gainPreview})`;
      } else {
        btnReincarnate.disabled = true;
        btnReincarnate.style.opacity = "0.5";
        btnReincarnate.style.cursor = "not-allowed";
        btnReincarnate.innerHTML = `🔒 Lv.${window.PRESTIGE_DATA.unlockLevel} / Act ${window.PRESTIGE_DATA.unlockZone}`;
      }
    }

    // 8 大輪迴天賦神龕渲染
    const perksGrid = document.getElementById("prestige-perks-grid");
    if (perksGrid) {
      perksGrid.innerHTML = window.PRESTIGE_DATA.perks.map(p => {
        const curLvl = this.player.prestige.perks[p.id] || 0;
        const isMax = curLvl >= p.maxLevel;
        const cost = window.PRESTIGE_DATA.getPerkCost(p.id, curLvl);
        const canAfford = karma >= cost && !isMax;

        let bonusText = "";
        if (p.id === "perk_atk") bonusText = `基礎攻擊力 +${curLvl * 15}%`;
        else if (p.id === "perk_hp") bonusText = `最大體力上限 +${curLvl * 20}%`;
        else if (p.id === "perk_speed") bonusText = `拔刀與自律斬頻率 +${curLvl * 8}%`;
        else if (p.id === "perk_crit") bonusText = `會心率 +${curLvl * 2}% | 會心傷 +${curLvl * 15}%`;
        else if (p.id === "perk_forge") bonusText = `高品質名刀機率 +${curLvl * 4}%`;
        else if (p.id === "perk_wealth") bonusText = `金小判與玉鋼獲取 +${curLvl * 25}%`;
        else if (p.id === "perk_wisdom") bonusText = `轉生初始等級保留 Lv.${1 + curLvl * 2}`;
        else if (p.id === "perk_boss_slayer") bonusText = `首領增傷 +${curLvl * 20}% | 破甲 +${curLvl * 4}%`;

        return `
          <div class="prestige-perk-card ${isMax ? 'maxed' : ''}">
            <div class="perk-card-header">
              <span class="perk-icon">${p.icon}</span>
              <div class="perk-title-box">
                <div class="perk-name">${p.name}</div>
                <div class="perk-level ${isMax ? 'max' : ''}">Lv.${curLvl} / ${p.maxLevel}</div>
              </div>
            </div>
            <div class="perk-desc">${p.desc}</div>
            <div class="perk-current-bonus">當前加護：<b>${curLvl > 0 ? bonusText : '尚未領悟'}</b></div>
            <button class="btn-upgrade-perk ${canAfford ? 'can-afford' : ''}" 
                    ${(!canAfford || isMax) ? 'disabled' : ''} 
                    onclick="window.game.upgradePrestigePerk('${p.id}')">
              ${isMax ? '✨ 至高圓滿' : `🔥 領悟強化 (${cost} 魂火)`}
            </button>
          </div>
        `;
      }).join("");
    }
  }


  // ==========================================================
  // 榮譽成就系統方法 (Achievements System API)
  // ==========================================================

  getAchievementProgress(ach) {
    if (!ach) return { current: 0, target: 1, isCompleted: false, isClaimed: false };
    const p = this.player;
    let current = 0;

    switch (ach.id) {
      case "ach_kill_1":
      case "ach_kill_50":
      case "ach_kill_200":
      case "ach_kill_1000":
      case "ach_kill_5000":
        current = (p.stats && p.stats.totalKills) || 0;
        break;
      case "ach_boss_1":
      case "ach_boss_10":
      case "ach_boss_50":
        current = (p.stats && p.stats.bossKills) || 0;
        break;
      case "ach_combo_50":
        current = Math.max((p.achievements && p.achievements.highestCombo) || 0, this.comboCount || 0);
        break;
      case "ach_forge_1":
      case "ach_forge_10":
      case "ach_forge_50":
        current = (p.stats && p.stats.swordsForged) || 0;
        break;
      case "ach_sharpen_5":
      case "ach_sharpen_20":
        current = (p.stats && p.stats.totalSharpens) || 0;
        break;
      case "ach_tier_wazamono":
        current = (p.codex && window.SWORDS_DATA) ? (p.codex.some(id => {
          const s = window.SWORDS_DATA.find(x => x.id === id);
          return s && s.tier >= 2;
        }) ? 1 : 0) : 0;
        break;
      case "ach_tier_owazamono":
        current = (p.codex && window.SWORDS_DATA) ? (p.codex.some(id => {
          const s = window.SWORDS_DATA.find(x => x.id === id);
          return s && s.tier >= 4;
        }) ? 1 : 0) : 0;
        break;
      case "ach_tier_five_swords":
        current = (p.codex && window.SWORDS_DATA) ? (p.codex.some(id => {
          const s = window.SWORDS_DATA.find(x => x.id === id);
          return s && (s.tierName === "天下五劍" || (s.tierName && s.tierName.includes("五劍")) || s.tier === 5);
        }) ? 1 : 0) : 0;
        break;
      case "ach_tier_mythic":
        current = (p.codex && window.SWORDS_DATA) ? (p.codex.some(id => {
          const s = window.SWORDS_DATA.find(x => x.id === id);
          return s && (s.tierName === "神話妖刀" || (s.tierName && s.tierName.includes("妖刀")) || s.tier >= 6);
        }) ? 1 : 0) : 0;
        break;
      case "ach_level_10":
      case "ach_level_30":
      case "ach_level_60":
      case "ach_level_100":
        current = p.level || 1;
        break;
      case "ach_dojo_5":
      case "ach_dojo_15":
        current = Math.max((p.skills && p.skills.shinkage) || 0, (p.skills && p.skills.jigen) || 0, (p.skills && p.skills.rishin) || 0);
        break;
      case "ach_faction_vow":
        current = (p.story && p.story.faction && p.story.faction !== "unaligned") ? 1 : 0;
        break;
      case "ach_clear_act7":
        current = (p.story && p.story.completedActs && p.story.completedActs.includes(7)) ? 7 : ((p.stats && p.stats.highestZone >= 7 && p.stats.bossKills > 0) ? 7 : 0);
        break;
      case "ach_all_endings":
        current = (p.story && p.story.unlockedEndings) ? p.story.unlockedEndings.length : 0;
        break;
      case "ach_prestige_1":
      case "ach_prestige_3":
        current = (p.prestige ? p.prestige.reincarnationCount : 0);
        break;
      case "ach_karma_500":
        current = (p.prestige ? Math.max(p.prestige.totalKarmaEarned || 0, p.prestige.karma || 0) : 0);
        break;
      case "ach_perk_max":
        current = (p.prestige && p.prestige.perks && window.PRESTIGE_DATA ? (Object.keys(p.prestige.perks).some(k => {
          const perk = window.PRESTIGE_DATA.perks.find(x => x.id === k);
          return perk && p.prestige.perks[k] >= perk.maxLevel;
        }) ? 1 : 0) : 0);
        break;
      default:
        current = 0;
    }

    const isClaimed = !!(p.achievements && p.achievements.claimed && p.achievements.claimed.includes(ach.id));
    const isCompleted = isClaimed || current >= ach.target;
    return {
      current: Math.min(ach.target, current),
      target: ach.target,
      isCompleted,
      isClaimed
    };
  }

  checkAchievements(suppressToast = false) {
    if (!window.ACHIEVEMENTS_DATA || !this.player || !this.player.achievements) return;
    for (const ach of window.ACHIEVEMENTS_DATA) {
      if (!this.player.achievements.claimed.includes(ach.id)) {
        const prog = this.getAchievementProgress(ach);
        if (prog.isCompleted) {
          if (!this._notifiedAchs) this._notifiedAchs = new Set();
          if (!this._notifiedAchs.has(ach.id)) {
            this._notifiedAchs.add(ach.id);
            if (!suppressToast && typeof window !== "undefined" && !window.__TESTING__) {
              this.showAchievementToast(ach);
            }
          }
        }
      }
    }
  }

  claimAchievement(achId) {
    if (!window.ACHIEVEMENTS_DATA || !this.player || !this.player.achievements) return;
    const ach = window.ACHIEVEMENTS_DATA.find(a => a.id === achId);
    if (!ach) return;

    const prog = this.getAchievementProgress(ach);
    if (!prog.isCompleted || prog.isClaimed) return;

    if (!this.player.achievements.claimed.includes(achId)) {
      this.player.achievements.claimed.push(achId);
    }

    const goldReward = ach.reward.gold || 0;
    const steelReward = ach.reward.steel || 0;
    const karmaReward = ach.reward.karma || 0;

    this.player.gold += goldReward;
    this.player.steel += steelReward;
    if (this.player.prestige && karmaReward > 0) {
      this.player.prestige.karma += karmaReward;
      this.player.prestige.totalKarmaEarned = (this.player.prestige.totalKarmaEarned || 0) + karmaReward;
    }

    if (window.samuraiAudio) window.samuraiAudio.playLevelUp();

    const lang = window.getLang ? window.getLang() : "zh-TW";
    const achText = window.getAchievementText ? window.getAchievementText(ach, lang) : ach;
    const karmaStr = karmaReward > 0 ? `、🌀 +${karmaReward}` : "";
    this.addCombatLog(`<span style="color:#fbbf24;font-weight:bold;">🏆 【成就達成】領取【${achText.name}】！獲得 🪙 +${goldReward}、💎 +${steelReward}${karmaStr}！</span>`);

    this.updateCharacterUI();
    this.updateAchievementsUI();
    this.save();
  }

  claimAllAchievements() {
    if (!window.ACHIEVEMENTS_DATA || !this.player || !this.player.achievements) return;

    const claimable = window.ACHIEVEMENTS_DATA.filter(a => {
      const prog = this.getAchievementProgress(a);
      return prog.isCompleted && !prog.isClaimed;
    });

    if (claimable.length === 0) {
      alert(window.t ? window.t("achNoClaimable") : "目前暫無可領取的成就獎勵！");
      return;
    }

    let totalGold = 0;
    let totalSteel = 0;
    let totalKarma = 0;

    for (const ach of claimable) {
      if (!this.player.achievements.claimed.includes(ach.id)) {
        this.player.achievements.claimed.push(ach.id);
      }
      totalGold += (ach.reward.gold || 0);
      totalSteel += (ach.reward.steel || 0);
      totalKarma += (ach.reward.karma || 0);
    }

    this.player.gold += totalGold;
    this.player.steel += totalSteel;
    if (this.player.prestige && totalKarma > 0) {
      this.player.prestige.karma += totalKarma;
      this.player.prestige.totalKarmaEarned = (this.player.prestige.totalKarmaEarned || 0) + totalKarma;
    }

    if (window.samuraiAudio) window.samuraiAudio.playLevelUp();

    const lang = window.getLang ? window.getLang() : "zh-TW";
    const msg = window.t ? window.t("achClaimAllSuccess", { count: claimable.length, gold: totalGold, steel: totalSteel, karma: totalKarma }) : `領取了 ${claimable.length} 項成就！`;
    alert(msg);
    this.addCombatLog(`<span style="color:#fbbf24;font-weight:bold;">🎁 【成就總領】一口氣領取 ${claimable.length} 項成就！獲得 🪙 +${totalGold}、💎 +${totalSteel}、🌀 +${totalKarma}！</span>`);

    this.updateCharacterUI();
    this.updateAchievementsUI();
    this.save();
  }

  filterAchievements(category) {
    this.activeAchFilter = category;
    if (typeof document !== "undefined") {
      document.querySelectorAll(".ach-filter-btn").forEach(btn => {
        if (btn.getAttribute("data-filter") === category) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
    }
    this.updateAchievementsUI();
  }

  updateAchievementsUI() {
    if (!window.ACHIEVEMENTS_DATA || !this.player || !this.player.achievements) return;
    if (typeof document === "undefined") return;

    const lang = window.getLang ? window.getLang() : "zh-TW";
    const allAchs = window.ACHIEVEMENTS_DATA;
    let completedCount = 0;
    let claimableCount = 0;

    const catCounts = { all: allAchs.length, combat: 0, swords: 0, growth: 0, destiny: 0 };

    allAchs.forEach(a => {
      if (catCounts[a.category] !== undefined) catCounts[a.category]++;
      const prog = this.getAchievementProgress(a);
      if (prog.isCompleted) completedCount++;
      if (prog.isCompleted && !prog.isClaimed) claimableCount++;
    });

    const ratioEl = document.getElementById("ach-progress-ratio");
    if (ratioEl) ratioEl.textContent = `${completedCount} / ${allAchs.length}`;
    const barEl = document.getElementById("ach-total-bar");
    const percent = Math.floor((completedCount / allAchs.length) * 100);
    if (barEl) barEl.style.width = `${percent}%`;
    const percentText = document.getElementById("ach-percent-text");
    if (percentText) percentText.textContent = `${percent}%`;

    ["all", "combat", "swords", "growth", "destiny"].forEach(cat => {
      const el = document.getElementById(`ach-cnt-${cat}`);
      if (el) el.textContent = catCounts[cat];
    });

    const badgeEl = document.getElementById("ach-claimable-badge");
    const claimAllBtn = document.getElementById("btn-claim-all-ach");
    if (badgeEl && claimAllBtn) {
      if (claimableCount > 0) {
        badgeEl.textContent = claimableCount;
        badgeEl.style.display = "inline-block";
        claimAllBtn.disabled = false;
      } else {
        badgeEl.style.display = "none";
        claimAllBtn.disabled = true;
      }
    }

    const cardsGrid = document.getElementById("achievements-cards-grid");
    if (!cardsGrid) return;

    const filtered = (this.activeAchFilter === "all") ? allAchs : allAchs.filter(a => a.category === this.activeAchFilter);

    cardsGrid.innerHTML = filtered.map(ach => {
      const prog = this.getAchievementProgress(ach);
      const achText = window.getAchievementText ? window.getAchievementText(ach, lang) : ach;
      const percentVal = Math.min(100, Math.floor((prog.current / prog.target) * 100));

      let cardClass = "";
      let btnHtml = "";

      if (prog.isClaimed) {
        cardClass = "claimed";
        btnHtml = `<button class="btn-claim-ach claimed" disabled>${window.t ? window.t("achClaimed") : "✅ 已領取"}</button>`;
      } else if (prog.isCompleted) {
        cardClass = "completed";
        btnHtml = `<button class="btn-claim-ach claimable" onclick="window.game.claimAchievement('${ach.id}')">${window.t ? window.t("achClaimBtn") : "✨ 領取獎勵"}</button>`;
      } else {
        btnHtml = `<button class="btn-claim-ach locked" disabled>${window.t ? window.t("achInProgress") : "進行中"} (${prog.current}/${prog.target})</button>`;
      }

      const rewardParts = [];
      if (ach.reward.gold) rewardParts.push(`🪙 ${ach.reward.gold}`);
      if (ach.reward.steel) rewardParts.push(`💎 ${ach.reward.steel}`);
      if (ach.reward.karma) rewardParts.push(`🌀 ${ach.reward.karma}`);

      return `
        <div class="achievement-card ${cardClass}">
          <div class="ach-icon-box">${ach.icon}</div>
          <div class="ach-info-box">
            <div class="ach-header-row">
              <span class="ach-name">${achText.name}</span>
            </div>
            <div class="ach-desc">${achText.desc}</div>
            <div class="ach-progress-track">
              <div class="ach-progress-fill" style="width: ${percentVal}%;"></div>
            </div>
            <div class="ach-bottom-row">
              <div class="ach-reward-badge">${rewardParts.join(" ")}</div>
              <span class="ach-progress-num">${prog.current} / ${prog.target} (${percentVal}%)</span>
              ${btnHtml}
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  showAchievementToast(ach) {
    if (typeof document === "undefined") return;
    const container = document.getElementById("achievement-toast-container");
    if (!container) return;

    const lang = window.getLang ? window.getLang() : "zh-TW";
    const achText = window.getAchievementText ? window.getAchievementText(ach, lang) : ach;

    const toast = document.createElement("div");
    toast.className = "achievement-toast";
    toast.innerHTML = `
      <div class="toast-icon">${ach.icon}</div>
      <div class="toast-content">
        <span class="toast-title">${window.t ? window.t("achToastUnlocked") : "🏆 成就達成！"}</span>
        <span class="toast-name">${achText.name}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 3500);
  }


  // 清理計時器（用於重置或自動測試）
  destroy() {
    if (this.combatInterval) clearInterval(this.combatInterval);
    if (this.saveInterval) clearInterval(this.saveInterval);
    if (this.buffInterval) clearInterval(this.buffInterval);
    if (this.bossTimerInterval) clearInterval(this.bossTimerInterval);
  }
}

if (typeof window !== "undefined") window.SamuraiGame = SamuraiGame;
if (typeof global !== "undefined") global.SamuraiGame = SamuraiGame;

// 實例化全域 Game 物件並確保可靠啟動
if (typeof window !== "undefined" && !window.__TESTING__) {
  window.game = new SamuraiGame();
  function initSamuraiGame() {
    if (window.game && !window.game.isStarted) {
      window.game.isStarted = true;
      window.game.start();
    }
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initSamuraiGame);
    } else {
      initSamuraiGame();
    }
  }
}
