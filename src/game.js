/**
 * 《武士之刃：無雙斬》（Samurai Blade: Resurrected）核心遊戲引擎 (src/game.js)
 * 特色：
 * 1. 暗黑破壞神式 6 大品質掉寶與暗金光柱
 * 2. 身障友善全自動討伐、一鍵智慧換裝浮動按鈕、自動分解過濾器
 * 3. 5 大直覺核心分頁、四大武士流派與天賦樹
 * 4. 暗黑 3 式中下方金邊成就橫幅與歡慶號角
 * 5. 離線掛機收益結算、Google 一鍵登入與純前端 100% 零帳單保證
 */
(function() {
  'use strict';

  class SamuraiGame {
    constructor() {
      this.version = '2.0.0-resurrected';
      this.activeTab = 'battle';
      this.combatInterval = null;
      this.currentEnemy = null;
      this.smartEquipTarget = null;
      this.achievementQueue = [];
      this.isShowingAchievement = false;

      // 初始化音效引擎
      this.audio = window.SamuraiAudioEngine ? new window.SamuraiAudioEngine() : null;

      // 初始化玩家數據
      this.player = this.initDefaultPlayer();

      // 載入本機存檔
      this.load();

      // 初始化拍賣與聊天系統
      if (window.MarketChatManager) {
        this.marketChat = new window.MarketChatManager(this);
      }

      // 初始化介面與事件
      this.initUI();
      this.setupControls();

      // 檢查離線收益
      this.processOfflineProgress();

      // 啟動全自動討伐戰鬥迴圈
      this.startCombatLoop();

      // 定時自動存檔 (每 10 秒)
      this.autoSaveInterval = setInterval(() => this.save(), 10000);
      if (typeof this.autoSaveInterval.unref === 'function') this.autoSaveInterval.unref();
    }

    /**
     * 初始預設玩家資料
     */
    initDefaultPlayer() {
      return {
        name: '無雙武士',
        avatar: 'samurai_commander', // 正統日本武士頭像
        title: '流浪武士',
        classId: 'kensei', // 劍聖
        level: 1,
        exp: 0,
        maxExp: 100,
        gold: 1500,
        iron: 30, // 玉鋼
        souls: 5,  // 魂玉
        talentPoints: 0,
        talents: {
          kensei_crit: 0,
          kensei_dual: 0,
          kensei_iaido: 0,
          oni_blood: 0,
          oni_rend: 0,
          oni_frenzy: 0,
          onmyo_barrier: 0,
          onmyo_fire: 0,
          onmyo_thunder: 0,
          daimyo_iron: 0,
          daimyo_thorns: 0,
          daimyo_recovery: 0
        },
        equipped: {
          weapon: window.generateGear ? window.generateGear('weapon', 'common', 1) : null,
          offhand: window.generateGear ? window.generateGear('offhand', 'common', 1) : null,
          helm: null,
          armor: window.generateGear ? window.generateGear('armor', 'common', 1) : null,
          accessory: null,
          boots: null
        },
        inventory: [],
        act: 1,
        actProgress: 0,
        actBossUnlocked: false,
        cosmetics: {
          avatar: 'samurai_general',
          bladeTrail: 'cherry',
          haoriColor: 'black_gold',
          title: '流浪武士'
        },
        settings: {
          autoDecomposeCommon: true,
          autoDecomposeMagic: true,
          autoDecomposeRare: false,
          soundEnabled: true
        },
        dailySignIn: {
          lastClaimDate: '',
          claimedDays: 0
        },
        achievements: {},
        statsTracked: {
          totalKills: 0,
          bossKills: 0,
          gearLooted: 0,
          legendaryLooted: 0,
          ancientLooted: 0,
          marketSales: 0,
          marketPurchases: 0,
          upgradesSuccess: 0,
          highestPower: 0
        },
        googleProfile: null,
        lastSaveTime: Date.now()
      };
    }

    /**
     * 計算玩家綜合戰力與各項戰鬥屬性
     */
    getCalculatedStats() {
      // 基礎數值
      let baseAtk = 20 + (this.player.level - 1) * 6;
      let baseDef = 10 + (this.player.level - 1) * 4;
      let baseHP = 150 + (this.player.level - 1) * 35;
      let baseSpd = 10;
      let critRate = 5;
      let critDmg = 50; // 基礎 150% 暴擊傷害
      let lifeSteal = 0;
      let armorPen = 0;
      let dmgRed = 0;
      let magicFind = 0;
      let goldBonus = 0;

      // 裝備數值疊加
      for (const slotKey of Object.keys(this.player.equipped)) {
        const gear = this.player.equipped[slotKey];
        if (gear) {
          const upMul = 1 + (gear.upgradeLevel || 0) * 0.08;
          baseAtk += (gear.baseAtk || 0) * upMul;
          baseDef += (gear.baseDef || 0) * upMul;
          baseHP += (gear.baseHP || 0) * upMul;
          baseSpd += (gear.baseSpd || 0) * upMul;

          // 詞綴計算
          if (gear.affixes && Array.isArray(gear.affixes)) {
            gear.affixes.forEach(aff => {
              if (aff.stat === 'atkPct') baseAtk *= (1 + aff.val / 100);
              else if (aff.stat === 'defPct') baseDef *= (1 + aff.val / 100);
              else if (aff.stat === 'hpPct') baseHP *= (1 + aff.val / 100);
              else if (aff.stat === 'critRate') critRate += aff.val;
              else if (aff.stat === 'critDmg') critDmg += aff.val;
              else if (aff.stat === 'atkSpd') baseSpd += aff.val;
              else if (aff.stat === 'lifeSteal') lifeSteal += aff.val;
              else if (aff.stat === 'armorPen') armorPen += aff.val;
              else if (aff.stat === 'dmgRed') dmgRed += aff.val;
              else if (aff.stat === 'magicFind') magicFind += aff.val;
              else if (aff.stat === 'goldBonus') goldBonus += aff.val;
            });
          }
        }
      }

      // 職業與天賦加成
      if (window.calculateClassBonuses) {
        const classBonuses = window.calculateClassBonuses(this.player.classId, this.player.talents);
        baseAtk *= (1 + (classBonuses.atkPct || 0) / 100);
        baseDef *= (1 + (classBonuses.defPct || 0) / 100);
        baseHP *= (1 + (classBonuses.hpPct || 0) / 100);
        critRate += (classBonuses.critRate || 0);
        critDmg += (classBonuses.critDmg || 0);
        baseSpd += (classBonuses.atkSpd || 0);
        lifeSteal += (classBonuses.lifeSteal || 0);
        armorPen += (classBonuses.armorPen || 0);
        dmgRed += (classBonuses.dmgRed || 0);
        magicFind += (classBonuses.magicFind || 0);
        goldBonus += (classBonuses.goldBonus || 0);
      }

      const finalAtk = Math.round(baseAtk);
      const finalDef = Math.round(baseDef);
      const finalMaxHP = Math.round(baseHP);
      const finalPower = Math.round(finalAtk * 3.5 + finalDef * 2.8 + finalMaxHP * 0.6 + baseSpd * 5);

      if (finalPower > this.player.statsTracked.highestPower) {
        this.player.statsTracked.highestPower = finalPower;
      }

      return {
        atk: finalAtk,
        def: finalDef,
        hp: finalMaxHP,
        maxHp: finalMaxHP,
        spd: baseSpd,
        critRate: Math.min(85, critRate),
        critDmg: critDmg,
        lifeSteal: Math.min(50, lifeSteal),
        armorPen: armorPen,
        dmgRed: Math.min(65, dmgRed),
        magicFind: magicFind,
        goldBonus: goldBonus,
        power: finalPower
      };
    }

    /**
     * 啟動全自動討伐戰鬥迴圈 (身障友善：完全自動運作)
     */
    startCombatLoop() {
      if (this.combatInterval) clearInterval(this.combatInterval);
      this.spawnNextEnemy();

      this.combatInterval = setInterval(() => {
        this.autoCombatTick();
      }, 700);
      if (typeof this.combatInterval.unref === 'function') this.combatInterval.unref();
    }

    trackStat(statName, delta = 1) {
      if (!this.player.statsTracked) this.player.statsTracked = {};
      this.player.statsTracked[statName] = (this.player.statsTracked[statName] || 0) + delta;
    }

    destroy() {
      if (this.combatInterval) clearInterval(this.combatInterval);
      if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
      if (this.marketChat && typeof this.marketChat.destroy === 'function') {
        this.marketChat.destroy();
      }
    }

    /**
     * 自動戰鬥每拍推進
     */
    autoCombatTick() {
      if (!this.currentEnemy || this.currentEnemy.hp <= 0) {
        this.spawnNextEnemy();
        return;
      }

      const stats = this.getCalculatedStats();
      const isCrit = Math.random() * 100 < stats.critRate;
      let dmg = stats.atk * (0.85 + Math.random() * 0.3);

      // 破甲與防禦減免
      const enemyDef = Math.max(0, (this.currentEnemy.def || 0) - stats.armorPen);
      const reduction = enemyDef / (enemyDef + 100);
      dmg = Math.max(1, dmg * (1 - reduction));

      if (isCrit) {
        dmg *= (1 + stats.critDmg / 100);
      }

      dmg = Math.round(dmg);
      this.currentEnemy.hp -= dmg;

      // 播放揮刀音效
      if (this.audio) this.audio.playSlashSound(isCrit);

      // 顯示傷害浮動字體
      this.showDamageText(dmg, isCrit, false);

      // 吸血回饋 (如果有吸血)
      if (stats.lifeSteal > 0) {
        const heal = Math.round(dmg * (stats.lifeSteal / 100));
        if (heal > 0) this.showDamageText(`+${heal} 汲血`, false, true);
      }

      // 更新戰鬥血條
      this.updateEnemyHealthBar();

      // 怪物擊敗判定
      if (this.currentEnemy.hp <= 0) {
        this.onEnemyDefeated();
      }
    }

    /**
     * 手動點擊揮刀（身障輔助：支援點擊畫面任意戰鬥區域額外補刀，絕不強制）
     */
    manualSlash() {
      if (!this.currentEnemy) return;
      this.autoCombatTick();
    }

    /**
     * 生成下一隻怪物或首領
     */
    spawnNextEnemy() {
      const actIndex = Math.max(0, Math.min(6, (this.player.act || 1) - 1));
      const actData = window.CAMPAIGN_ACTS ? window.CAMPAIGN_ACTS[actIndex] : null;
      if (!actData) return;

      // 判斷是否討伐章節首領
      if (this.player.actBossUnlocked) {
        this.currentEnemy = {
          ...actData.boss,
          maxHp: actData.boss.hp,
          hp: actData.boss.hp,
          isBoss: true
        };
        this.showToast(`⚠️ 章節首領【${actData.boss.name}】降臨！`, 'warning');
      } else {
        const enemyProto = actData.enemies[Math.floor(Math.random() * actData.enemies.length)];
        this.currentEnemy = {
          ...enemyProto,
          maxHp: enemyProto.hp,
          hp: enemyProto.hp,
          isBoss: false
        };
      }

      this.updateBattleUI();
    }

    /**
     * 擊敗怪物處理：經驗、金幣、暗黑裝備掉落與光柱
     */
    onEnemyDefeated() {
      const enemy = this.currentEnemy;
      const stats = this.getCalculatedStats();
      this.player.statsTracked.totalKills++;

      // 獲得金幣與經驗
      const goldEarned = Math.round((enemy.gold || 10) * (1 + stats.goldBonus / 100));
      const expEarned = enemy.exp || 15;

      this.player.gold += goldEarned;
      this.addExp(expEarned);

      // 掉落裝備判定
      this.rollGearDrop(enemy);

      // 章節推進判定
      const actIndex = Math.max(0, Math.min(6, (this.player.act || 1) - 1));
      const actData = window.CAMPAIGN_ACTS[actIndex];

      if (enemy.isBoss) {
        this.player.statsTracked.bossKills++;
        this.player.actBossUnlocked = false;
        this.player.actProgress = 0;

        this.showToast(`🎉 恭喜平定【${actData.name}】首領！`, 'success');
        if (this.marketChat) {
          this.marketChat.addChatMessage('全服公告', `🎊 恭喜玩家【${this.player.name}】斬殺了【${enemy.name}】，武威震懾天下！`, true);
        }

        // 開啟下一章
        if (this.player.act < 7) {
          this.player.act++;
          this.showToast(`🗺️ 已解鎖全新章節【${window.CAMPAIGN_ACTS[this.player.act - 1].name}】！`, 'success');
        }
      } else {
        this.player.actProgress++;
        if (this.player.actProgress >= actData.bossKillsRequired) {
          this.player.actBossUnlocked = true;
          this.showToast(`🔥 討伐進度已滿！首領即將現身！`, 'warning');
        }
      }

      // 檢查成就
      this.checkAchievements();

      // 生成下一隻
      setTimeout(() => this.spawnNextEnemy(), 300);
      this.updateHeaderUI();
    }

    /**
     * 暗黑式隨機掉寶與光柱特效
     */
    rollGearDrop(enemy) {
      if (!window.generateGear) return;
      const dropChance = enemy.isBoss ? 0.95 : 0.35;
      if (Math.random() > dropChance) return;

      const stats = this.getCalculatedStats();
      // 依尋寶值 (Magic Find) 提升高品質機率
      const mfBonus = stats.magicFind || 0;
      const roll = Math.random() * 100;

      let quality = 'common';
      if (enemy.isBoss) {
        if (roll < 20 + mfBonus * 0.1) quality = 'ancient';
        else if (roll < 55 + mfBonus * 0.2) quality = 'legendary';
        else quality = 'epic';
      } else {
        if (roll < 1 + mfBonus * 0.05) quality = 'ancient';
        else if (roll < 4 + mfBonus * 0.1) quality = 'legendary';
        else if (roll < 15 + mfBonus * 0.15) quality = 'epic';
        else if (roll < 40 + mfBonus * 0.2) quality = 'rare';
        else if (roll < 75) quality = 'magic';
        else quality = 'common';
      }

      const gear = window.generateGear(null, quality, this.player.level);
      this.player.statsTracked.gearLooted++;
      if (quality === 'legendary') this.player.statsTracked.legendaryLooted++;
      if (quality === 'ancient') this.player.statsTracked.ancientLooted++;

      // 播放暗黑經典掉落音效（傳奇與遠古觸發經典 Ding!）
      if (this.audio) this.audio.playDropSound(quality);

      // 傳奇與遠古觸發全服聊天室廣播與暗金光柱
      if (quality === 'legendary' || quality === 'ancient') {
        this.triggerLootBeam(gear);
        if (this.marketChat) this.marketChat.broadcastLoot(this.player.name, gear);
      }

      // 自動分解過濾器判定 (身障無障礙優化：保持行囊清潔)
      if (this.shouldAutoDecompose(quality)) {
        const mats = window.decomposeGear(gear);
        this.player.iron += mats.iron;
        this.player.souls += mats.souls;
        this.player.gold += mats.gold;
        this.showToast(`♻️ 自動分解 [${gear.qualityName}]【${gear.name}】獲得玉鋼 x${mats.iron}`, 'info');
        return;
      }

      // 存入背包
      this.addGearToInventory(gear);
    }

    /**
     * 檢查是否自動分解
     */
    shouldAutoDecompose(quality) {
      if (quality === 'common' && this.player.settings.autoDecomposeCommon) return true;
      if (quality === 'magic' && this.player.settings.autoDecomposeMagic) return true;
      if (quality === 'rare' && this.player.settings.autoDecomposeRare) return true;
      return false;
    }

    /**
     * 存入背包並觸發「一鍵智慧換裝」偵測
     */
    addGearToInventory(gear) {
      if (this.player.inventory.length >= 50) {
        this.showToast(`⚠️ 行囊已滿 (50/50)，請分解多餘裝備！`, 'warning');
        return;
      }
      this.player.inventory.push(gear);
      this.renderGearUI();

      // 智慧換裝比對
      this.checkSmartEquip();
    }

    /**
     * 一鍵智慧換裝比對邏輯 (Smart Equip floating banner)
     */
    checkSmartEquip() {
      let bestUpgrade = null;
      let maxScoreDiff = 0;

      for (const gear of this.player.inventory) {
        const curGear = this.player.equipped[gear.slot];
        const curScore = curGear ? curGear.gearScore : 0;
        const diff = gear.gearScore - curScore;

        if (diff > 0 && diff > maxScoreDiff) {
          maxScoreDiff = diff;
          bestUpgrade = gear;
        }
      }

      const banner = document.getElementById('smart-equip-banner');
      if (!banner) return;

      if (bestUpgrade) {
        this.smartEquipTarget = bestUpgrade;
        const q = window.GEAR_QUALITIES[bestUpgrade.quality] || window.GEAR_QUALITIES.common;
        banner.style.display = 'flex';
        banner.innerHTML = `
          <div class="smart-equip-content">
            <span class="smart-equip-icon">${bestUpgrade.icon}</span>
            <div class="smart-equip-text">
              <div class="smart-equip-title">⬆️ 發現更高戰力裝備！</div>
              <div class="smart-equip-name" style="color: ${q.color};">${bestUpgrade.name} (${bestUpgrade.slotName})</div>
            </div>
            <div class="smart-equip-diff">戰力 +${maxScoreDiff}</div>
            <button class="btn btn-smart-equip btn-gold" onclick="window.game.equipSmartTarget()">
              ⚡ 一鍵穿戴 (空白鍵)
            </button>
          </div>
        `;
      } else {
        this.smartEquipTarget = null;
        banner.style.display = 'none';
      }
    }

    /**
     * 執行一鍵換裝
     */
    equipSmartTarget() {
      if (!this.smartEquipTarget) return;
      this.equipGear(this.smartEquipTarget.uid);
      const banner = document.getElementById('smart-equip-banner');
      if (banner) banner.style.display = 'none';
      this.smartEquipTarget = null;
      this.checkSmartEquip();
    }

    /**
     * 裝備特定裝備
     */
    equipGear(gearUid) {
      const idx = this.player.inventory.findIndex(g => g.uid === gearUid);
      if (idx === -1) return;

      const newGear = this.player.inventory[idx];
      const slot = newGear.slot;
      const oldGear = this.player.equipped[slot];

      this.player.inventory.splice(idx, 1);
      if (oldGear) {
        this.player.inventory.push(oldGear);
      }
      this.player.equipped[slot] = newGear;

      if (this.audio) this.audio.playEquipSound();
      this.showToast(`已穿戴【${newGear.name}】！`, 'success');

      this.renderGearUI();
      this.updateHeaderUI();
      this.checkAchievements();
    }

    /**
     * 卸下裝備
     */
    unequipGear(slot) {
      const oldGear = this.player.equipped[slot];
      if (!oldGear) return;
      if (this.player.inventory.length >= 50) {
        this.showToast(`行囊空間不足，無法卸下裝備！`, 'warning');
        return;
      }
      this.player.equipped[slot] = null;
      this.player.inventory.push(oldGear);
      if (this.audio) this.audio.playEquipSound();
      this.renderGearUI();
      this.updateHeaderUI();
    }

    /**
     * 一鍵分解背包內所有普通與魔法裝備
     */
    decomposeAllJunk() {
      const toDecompose = this.player.inventory.filter(g => g.quality === 'common' || g.quality === 'magic');
      if (toDecompose.length === 0) {
        this.showToast(`行囊內無可分解的普通或魔法裝備！`, 'info');
        return;
      }

      let totalIron = 0;
      let totalSouls = 0;
      let totalGold = 0;

      toDecompose.forEach(g => {
        const mats = window.decomposeGear(g);
        totalIron += mats.iron;
        totalSouls += mats.souls;
        totalGold += mats.gold;
      });

      this.player.inventory = this.player.inventory.filter(g => g.quality !== 'common' && g.quality !== 'magic');
      this.player.iron += totalIron;
      this.player.souls += totalSouls;
      this.player.gold += totalGold;

      this.showToast(`♻️ 成功分解 ${toDecompose.length} 件裝備！獲得玉鋼 x${totalIron}、魂玉 x${totalSouls}、金幣 x${totalGold.toLocaleString()}`, 'success');
      this.renderGearUI();
      this.updateHeaderUI();
    }

    /**
     * 強化裝備
     */
    upgradeGear(gearUid) {
      let gear = null;
      for (const slotKey of Object.keys(this.player.equipped)) {
        if (this.player.equipped[slotKey] && this.player.equipped[slotKey].uid === gearUid) {
          gear = this.player.equipped[slotKey];
          break;
        }
      }
      if (!gear) {
        gear = this.player.inventory.find(g => g.uid === gearUid);
      }
      if (!gear) return;

      const curLvl = gear.upgradeLevel || 0;
      const ironReq = (curLvl + 1) * 8;
      const goldReq = (curLvl + 1) * 500;

      if (this.player.iron < ironReq || this.player.gold < goldReq) {
        this.showToast(`強化材料不足！需要玉鋼 x${ironReq}、金幣 ${goldReq.toLocaleString()}`, 'error');
        return;
      }

      this.player.iron -= ironReq;
      this.player.gold -= goldReq;
      gear.upgradeLevel = curLvl + 1;
      gear.gearScore = window.calculateGearScore(gear);
      this.player.statsTracked.upgradesSuccess++;

      if (this.audio) this.audio.playCoinSound();
      this.showToast(`✨ 鍛造成功！【${gear.name}】已強化至 +${gear.upgradeLevel}！`, 'success');

      this.renderGearUI();
      this.updateHeaderUI();
      this.checkAchievements();
    }

    /**
     * 升級與天賦獲得
     */
    addExp(amount) {
      this.player.exp += amount;
      while (this.player.exp >= this.player.maxExp) {
        this.player.exp -= this.player.maxExp;
        this.player.level++;
        this.player.maxExp = Math.round(this.player.maxExp * 1.25);
        this.player.talentPoints++;

        this.showToast(`🎊 境界突破！等級提升至 ${this.player.level} 級！獲得 1 點天賦點數`, 'success');
        if (this.audio) this.audio.playAchievementFanfare();
      }
    }

    /**
     * 升級指定天賦
     */
    addTalentPoint(talentId) {
      if (this.player.talentPoints <= 0) {
        this.showToast(`天賦點數不足！請先升級獲得點數`, 'warning');
        return;
      }

      const curRank = this.player.talents[talentId] || 0;
      if (curRank >= 10) {
        this.showToast(`該天賦已達最高等級 (10/10)！`, 'warning');
        return;
      }

      this.player.talents[talentId] = curRank + 1;
      this.player.talentPoints--;

      if (this.audio) this.audio.playCoinSound();
      this.renderTalentsUI();
      this.updateHeaderUI();
      this.checkAchievements();
    }

    /**
     * 免費重置天賦 (身障與零壓力體驗：100% 免費無上限隨時洗點)
     */
    resetTalents() {
      let refunded = 0;
      for (const tKey of Object.keys(this.player.talents)) {
        refunded += this.player.talents[tKey] || 0;
        this.player.talents[tKey] = 0;
      }
      this.player.talentPoints += refunded;

      this.showToast(`已重置所有天賦，返還 ${refunded} 點天賦點數！`, 'info');
      this.renderTalentsUI();
      this.updateHeaderUI();
    }

    /**
     * 切換職業流派
     */
    switchClass(classId) {
      if (!window.SAMURAI_CLASSES[classId]) return;
      this.player.classId = classId;
      const cls = window.SAMURAI_CLASSES[classId];
      this.showToast(`已切換為【${cls.name}】流派！`, 'success');
      this.renderTalentsUI();
      this.updateHeaderUI();
    }

    /**
     * 暗黑 3 式中下方金邊成就橫幅觸發 (Diablo 3 Banner)
     */
    triggerAchievementBanner(ach) {
      this.achievementQueue.push(ach);
      if (!this.isShowingAchievement) {
        this.displayNextAchievementBanner();
      }
    }

    displayNextAchievementBanner() {
      if (this.achievementQueue.length === 0) {
        this.isShowingAchievement = false;
        return;
      }

      this.isShowingAchievement = true;
      const ach = this.achievementQueue.shift();
      const banner = document.getElementById('diablo-achievement-banner');
      if (!banner) return;

      banner.innerHTML = `
        <div class="diablo-banner-crest">
          <span class="crest-icon">${ach.icon}</span>
        </div>
        <div class="diablo-banner-body">
          <div class="diablo-banner-header">🏆 成就達成！</div>
          <div class="diablo-banner-title">${ach.name}</div>
          <div class="diablo-banner-desc">${ach.desc}</div>
        </div>
        <div class="diablo-banner-points">+${ach.points}</div>
      `;

      banner.classList.add('banner-visible');
      if (this.audio) this.audio.playAchievementFanfare();

      setTimeout(() => {
        banner.classList.remove('banner-visible');
        setTimeout(() => this.displayNextAchievementBanner(), 500);
      }, 4000);
    }

    /**
     * 檢查成就解鎖
     */
    checkAchievements() {
      if (!window.ACHIEVEMENTS_DB) return;
      const stats = this.getCalculatedStats();

      window.ACHIEVEMENTS_DB.forEach(ach => {
        if (this.player.achievements[ach.id] && this.player.achievements[ach.id].unlocked) {
          return;
        }

        let isMet = false;
        if (ach.id.startsWith('kill_')) isMet = this.player.statsTracked.totalKills >= ach.target;
        else if (ach.id.startsWith('boss_')) isMet = this.player.statsTracked.bossKills >= ach.target;
        else if (ach.id === 'loot_magic') isMet = this.player.statsTracked.gearLooted >= 1;
        else if (ach.id === 'loot_rare') isMet = this.player.inventory.some(g => g.quality === 'rare') || Object.values(this.player.equipped).some(g => g && g.quality === 'rare');
        else if (ach.id === 'loot_epic') isMet = this.player.inventory.some(g => g.quality === 'epic') || Object.values(this.player.equipped).some(g => g && g.quality === 'epic');
        else if (ach.id === 'loot_legendary') isMet = this.player.statsTracked.legendaryLooted >= 1;
        else if (ach.id === 'loot_ancient') isMet = this.player.statsTracked.ancientLooted >= 1;
        else if (ach.id === 'loot_full_epic') {
          const eqList = Object.values(this.player.equipped).filter(Boolean);
          isMet = eqList.length === 6 && eqList.every(g => ['epic', 'legendary', 'ancient'].includes(g.quality));
        }
        else if (ach.id === 'upgrade_1') isMet = this.player.statsTracked.upgradesSuccess >= 1;
        else if (ach.id === 'upgrade_5') isMet = Object.values(this.player.equipped).some(g => g && g.upgradeLevel >= 5);
        else if (ach.id === 'upgrade_10') isMet = Object.values(this.player.equipped).some(g => g && g.upgradeLevel >= 10);
        else if (ach.id.startsWith('level_')) isMet = this.player.level >= ach.target;
        else if (ach.id.startsWith('power_')) isMet = stats.power >= ach.target;
        else if (ach.id.startsWith('gold_')) isMet = this.player.gold >= ach.target;
        else if (ach.id === 'market_buy_1') isMet = this.player.statsTracked.marketPurchases >= 1;
        else if (ach.id === 'market_sell_1') isMet = this.player.statsTracked.marketSales >= 1;

        if (isMet) {
          this.player.achievements[ach.id] = { unlocked: true, claimed: false, date: new Date().toLocaleDateString() };
          this.triggerAchievementBanner(ach);
          this.renderAchievementsUI();
        }
      });
    }

    /**
     * 領取成就獎勵
     */
    claimAchievement(achId) {
      const ach = window.ACHIEVEMENTS_DB.find(a => a.id === achId);
      if (!ach || !this.player.achievements[achId] || this.player.achievements[achId].claimed) return;

      this.player.achievements[achId].claimed = true;
      if (ach.reward) {
        if (ach.reward.gold) this.player.gold += ach.reward.gold;
        if (ach.reward.iron) this.player.iron += ach.reward.iron;
        if (ach.reward.souls) this.player.souls += ach.reward.souls;
        if (ach.reward.title) {
          this.player.cosmetics.title = ach.reward.title;
          this.showToast(`🎖️ 獲得專屬限定稱號【${ach.reward.title}】！`, 'success');
        }
        if (ach.reward.gearQuality && window.generateGear) {
          const freeGear = window.generateGear(null, ach.reward.gearQuality, this.player.level);
          this.addGearToInventory(freeGear);
          this.showToast(`🎁 領取成就獎勵【${freeGear.name}】！`, 'success');
        }
      }

      if (this.audio) this.audio.playCoinSound();
      this.renderAchievementsUI();
      this.updateHeaderUI();
    }

    /**
     * 一鍵領取所有已達成成就
     */
    claimAllAchievements() {
      let claimedCount = 0;
      window.ACHIEVEMENTS_DB.forEach(ach => {
        if (this.player.achievements[ach.id] && this.player.achievements[ach.id].unlocked && !this.player.achievements[ach.id].claimed) {
          this.claimAchievement(ach.id);
          claimedCount++;
        }
      });
      if (claimedCount > 0) {
        this.showToast(`已一鍵領取 ${claimedCount} 項成就獎勵！`, 'success');
      } else {
        this.showToast(`目前沒有可領取的成就獎勵`, 'info');
      }
    }

    /**
     * 每日登入簽到領取 (7日循環)
     */
    claimDailyReward() {
      const today = new Date().toISOString().slice(0, 10);
      if (this.player.dailySignIn.lastClaimDate === today) {
        this.showToast(`今日簽到獎勵已領取，明日再來！`, 'info');
        return;
      }

      let nextDay = (this.player.dailySignIn.claimedDays % 7) + 1;
      const reward = window.DAILY_SIGNIN_REWARDS.find(r => r.day === nextDay);
      if (!reward) return;

      this.player.dailySignIn.claimedDays++;
      this.player.dailySignIn.lastClaimDate = today;

      if (reward.gold) this.player.gold += reward.gold;
      if (reward.iron) this.player.iron += reward.iron;
      if (reward.souls) this.player.souls += reward.souls;
      if (reward.title) this.player.cosmetics.title = reward.title;
      if (reward.gearQuality && window.generateGear) {
        const freeGear = window.generateGear(null, reward.gearQuality, this.player.level);
        this.addGearToInventory(freeGear);
      }

      if (this.audio) this.audio.playAchievementFanfare();
      this.showToast(`🎉 成功簽到第 ${nextDay} 天！獲得：${reward.desc}`, 'success');

      this.renderDailySignInUI();
      this.updateHeaderUI();
    }

    /**
     * 離線收益結算 (身障與休閒放置體驗：上線即領)
     */
    processOfflineProgress() {
      const now = Date.now();
      const last = this.player.lastSaveTime || now;
      const elapsedSeconds = Math.floor((now - last) / 1000);

      // 超過 60 秒才算離線收益，最多計算 12 小時 (43,200 秒)
      if (elapsedSeconds < 60) return;

      const calcSeconds = Math.min(43200, elapsedSeconds);
      const stats = this.getCalculatedStats();
      const killsPerMin = Math.max(10, Math.min(60, Math.round(stats.power / 80)));
      const totalOfflineKills = Math.round((calcSeconds / 60) * killsPerMin);

      const expGain = totalOfflineKills * 12;
      const goldGain = totalOfflineKills * 8;
      const ironGain = Math.round(totalOfflineKills * 0.4);

      // 累計
      this.player.gold += goldGain;
      this.player.iron += ironGain;
      this.addExp(expGain);
      this.player.statsTracked.totalKills += totalOfflineKills;

      // 隨機贈送 1~3 件高品質裝備
      const bonusGears = [];
      const bonusCount = Math.min(3, Math.max(1, Math.floor(calcSeconds / 3600)));
      if (window.generateGear) {
        for (let i = 0; i < bonusCount; i++) {
          const g = window.generateGear(null, 'epic', this.player.level);
          this.addGearToInventory(g);
          bonusGears.push(g.name);
        }
      }

      // 彈出離線結算彈窗
      const modal = document.getElementById('offline-modal');
      const body = document.getElementById('offline-modal-body');
      if (modal && body) {
        const hrs = Math.floor(calcSeconds / 3600);
        const mins = Math.floor((calcSeconds % 3600) / 60);
        body.innerHTML = `
          <div style="font-size: 1.1rem; margin-bottom: 15px;">
            您已離線修煉了 <strong>${hrs} 小時 ${mins} 分鐘</strong>！<br>
            您的武士在常世狹縫中自動斬妖除魔，累積了豐厚戰果：
          </div>
          <div class="offline-stat-grid">
            <div class="offline-stat-box">⚔️ 討伐妖怪: <strong>${totalOfflineKills.toLocaleString()}</strong> 隻</div>
            <div class="offline-stat-box">📈 獲得修為: <strong>+${expGain.toLocaleString()}</strong> EXP</div>
            <div class="offline-stat-box">💰 獲得金幣: <strong>+${goldGain.toLocaleString()}</strong> 兩</div>
            <div class="offline-stat-box">🪨 採集玉鋼: <strong>+${ironGain}</strong> 塊</div>
          </div>
          ${bonusGears.length > 0 ? `
            <div style="margin-top: 15px; color: var(--gold-accent);">
              🎁 額外尋得史詩神兵：${bonusGears.map(n => `【${n}】`).join('、')}
            </div>
          ` : ''}
        `;
        modal.style.display = 'flex';
      }
    }

    closeOfflineModal() {
      const modal = document.getElementById('offline-modal');
      if (modal) modal.style.display = 'none';
      if (this.audio) this.audio.playCoinSound();
    }

    /**
     * 暗金光柱特效
     */
    triggerLootBeam(gear) {
      const beamEl = document.getElementById('loot-beam-overlay');
      if (!beamEl) return;
      beamEl.style.display = 'block';
      beamEl.style.borderColor = gear.beamColor || '#fb923c';
      setTimeout(() => {
        beamEl.style.display = 'none';
      }, 1500);
    }

    /**
     * 傷害跳字特效
     */
    showDamageText(text, isCrit, isHeal) {
      const container = document.getElementById('battle-damage-layer');
      if (!container) return;

      const span = document.createElement('div');
      span.className = `floating-dmg ${isCrit ? 'dmg-crit' : ''} ${isHeal ? 'dmg-heal' : ''}`;
      span.innerText = isCrit ? `💥 ${text}!` : text;

      // 隨機水平偏移
      span.style.left = `${45 + (Math.random() * 20 - 10)}%`;
      span.style.top = `${40 + (Math.random() * 20 - 10)}%`;

      container.appendChild(span);
      setTimeout(() => {
        if (span.parentNode) span.parentNode.removeChild(span);
      }, 800);
    }

    /**
     * 提示浮動訊息 (Toast)
     */
    showToast(msg, type = 'info') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `game-toast toast-${type}`;
      toast.innerText = msg;
      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 400);
      }, 3000);
    }

    /**
     * 切換五大核心分頁
     */
    switchTab(tabKey) {
      const tabs = ['battle', 'gear', 'talents', 'market', 'achievements'];
      if (!tabs.includes(tabKey)) return;

      this.activeTab = tabKey;
      tabs.forEach(t => {
        const pane = document.getElementById(`tab-${t}`);
        const btn = document.querySelector(`.tab-btn[data-tab="${t}"]`);
        if (pane) pane.style.display = (t === tabKey) ? 'block' : 'none';
        if (btn) {
          if (t === tabKey) btn.classList.add('active');
          else btn.classList.remove('active');
        }
      });

      // 各頁專屬刷新
      if (tabKey === 'gear') this.renderGearUI();
      else if (tabKey === 'talents') this.renderTalentsUI();
      else if (tabKey === 'market' && this.marketChat) {
        this.marketChat.renderMarketUI();
        this.marketChat.renderChatUI();
      }
      else if (tabKey === 'achievements') {
        this.renderAchievementsUI();
        this.renderDailySignInUI();
      }
    }

    /**
     * 客製外觀更新
     */
    setCosmetic(type, value) {
      if (!this.player.cosmetics) this.player.cosmetics = {};
      this.player.cosmetics[type] = value;
      this.updateHeaderUI();
      this.renderGearUI();
      this.showToast(`外觀造型已套用！`, 'success');
    }

    /**
     * 渲染頂部與總體數值
     */
    updateHeaderUI() {
      const stats = this.getCalculatedStats();
      const levelEl = document.getElementById('player-level-val');
      const powerEl = document.getElementById('player-power-val');
      const goldEl = document.getElementById('player-gold-val');
      const ironEl = document.getElementById('player-iron-val');
      const soulsEl = document.getElementById('player-souls-val');
      const nameEl = document.getElementById('player-name-val');
      const titleEl = document.getElementById('player-title-val');
      const avatarEl = document.getElementById('player-avatar-icon');

      if (levelEl) levelEl.innerText = this.player.level;
      if (powerEl) powerEl.innerText = stats.power.toLocaleString();
      if (goldEl) goldEl.innerText = this.player.gold.toLocaleString();
      if (ironEl) ironEl.innerText = this.player.iron.toLocaleString();
      if (soulsEl) soulsEl.innerText = this.player.souls.toLocaleString();
      if (nameEl) nameEl.innerText = this.player.name;
      if (titleEl) titleEl.innerText = `【${this.player.cosmetics.title || '流浪武士'}】`;

      // 替換武士真實頭像
      if (avatarEl) {
        const avatars = {
          samurai_general: '⚔️',
          samurai_oni: '👺',
          samurai_lord: '🏯',
          samurai_female: '🌸',
          samurai_daimyo: '👑'
        };
        avatarEl.innerText = avatars[this.player.cosmetics.avatar] || '⚔️';
      }

      // EXP 進度條
      const expBar = document.getElementById('player-exp-bar');
      const expText = document.getElementById('player-exp-text');
      if (expBar) {
        const pct = Math.min(100, Math.round((this.player.exp / this.player.maxExp) * 100));
        expBar.style.width = `${pct}%`;
      }
      if (expText) {
        expText.innerText = `${this.player.exp} / ${this.player.maxExp}`;
      }
    }

    /**
     * 渲染戰鬥畫面
     */
    updateBattleUI() {
      if (!this.currentEnemy) return;
      const nameEl = document.getElementById('enemy-name');
      const avatarEl = document.getElementById('enemy-avatar');
      const hpText = document.getElementById('enemy-hp-text');
      const hpBar = document.getElementById('enemy-hp-bar');
      const actTitle = document.getElementById('current-act-title');
      const actProgressText = document.getElementById('act-progress-text');

      const actIndex = Math.max(0, Math.min(6, (this.player.act || 1) - 1));
      const actData = window.CAMPAIGN_ACTS[actIndex];

      if (actTitle && actData) actTitle.innerText = `${actData.name} - ${actData.subtitle}`;
      if (actProgressText && actData) {
        actProgressText.innerText = this.player.actBossUnlocked
          ? `⚠️ 首領戰鬥中！`
          : `討伐進度: ${this.player.actProgress} / ${actData.bossKillsRequired}`;
      }

      if (nameEl) nameEl.innerText = `${this.currentEnemy.isBoss ? '👑 [首領] ' : ''}${this.currentEnemy.name}`;
      if (avatarEl) avatarEl.innerText = this.currentEnemy.avatar || '👹';
      this.updateEnemyHealthBar();
    }

    updateEnemyHealthBar() {
      if (!this.currentEnemy) return;
      const hpText = document.getElementById('enemy-hp-text');
      const hpBar = document.getElementById('enemy-hp-bar');
      const curHp = Math.max(0, this.currentEnemy.hp);
      const maxHp = this.currentEnemy.maxHp;

      if (hpText) hpText.innerText = `${curHp.toLocaleString()} / ${maxHp.toLocaleString()}`;
      if (hpBar) {
        const pct = Math.max(0, Math.min(100, (curHp / maxHp) * 100));
        hpBar.style.width = `${pct}%`;
      }
    }

    /**
     * 渲染裝備分頁 (6 格紙娃娃 + 背包 + 詞綴故事 + 客製造型)
     */
    renderGearUI() {
      const container = document.getElementById('equipped-slots-grid');
      if (container) {
        const slots = ['weapon', 'offhand', 'helm', 'armor', 'accessory', 'boots'];
        container.innerHTML = slots.map(slotKey => {
          const gear = this.player.equipped[slotKey];
          const slotMeta = window.GEAR_SLOTS[slotKey];
          if (!gear) {
            return `
              <div class="gear-slot empty-slot">
                <div class="slot-placeholder-icon">${slotMeta.icon}</div>
                <div class="slot-name">${slotMeta.name}</div>
                <div class="slot-status">未裝備</div>
              </div>
            `;
          }

          const q = window.GEAR_QUALITIES[gear.quality] || window.GEAR_QUALITIES.common;
          return `
            <div class="gear-slot equipped" style="border: 2px solid ${q.border}; background: ${q.bgGlow};">
              <div class="gear-slot-header">
                <span class="gear-icon">${gear.icon}</span>
                <div class="gear-meta">
                  <div class="gear-name" style="color: ${q.color};">${gear.name} ${gear.upgradeLevel ? `+${gear.upgradeLevel}` : ''}</div>
                  <div class="gear-sub">${gear.slotName} | 戰力 +${gear.gearScore}</div>
                </div>
              </div>
              <div class="gear-slot-actions">
                <button class="btn btn-sm btn-gold" onclick="window.game.upgradeGear('${gear.uid}')">🔨 強化</button>
                <button class="btn btn-sm btn-outline" onclick="window.game.unequipGear('${slotKey}')">卸下</button>
              </div>
            </div>
          `;
        }).join('');
      }

      // 渲染背包裝備列表
      const invContainer = document.getElementById('inventory-grid');
      const invCount = document.getElementById('inventory-count-badge');
      if (invCount) invCount.innerText = `${this.player.inventory.length} / 50`;

      if (invContainer) {
        if (this.player.inventory.length === 0) {
          invContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px; grid-column: 1 / -1;">
              🎒 行囊空空如也。請至【自動討伐】推進戰役，掉落神兵將自動存放於此！
            </div>
          `;
        } else {
          invContainer.innerHTML = this.player.inventory.map(gear => {
            const q = window.GEAR_QUALITIES[gear.quality] || window.GEAR_QUALITIES.common;
            return `
              <div class="inv-card" style="border: 2px solid ${q.border}; background: ${q.bgGlow};">
                <div class="inv-card-header">
                  <span class="inv-icon">${gear.icon}</span>
                  <div class="inv-info">
                    <div class="inv-name" style="color: ${q.color};">${gear.name}</div>
                    <div class="inv-sub">${gear.slotName} | 戰力 +${gear.gearScore}</div>
                  </div>
                </div>
                <div class="inv-lore">"${gear.lore || ''}"</div>
                <div class="inv-affixes">
                  ${gear.baseAtk ? `<span class="affix-tag">攻擊 +${gear.baseAtk}</span>` : ''}
                  ${gear.baseDef ? `<span class="affix-tag">防禦 +${gear.baseDef}</span>` : ''}
                  ${gear.baseHP ? `<span class="affix-tag">生命 +${gear.baseHP}</span>` : ''}
                  ${gear.affixes ? gear.affixes.map(a => `<span class="affix-tag">${a.text}</span>`).join('') : ''}
                  ${gear.legendaryPower ? `<div class="power-tag">🌟 ${gear.legendaryPower.name}: ${gear.legendaryPower.desc}</div>` : ''}
                </div>
                <div class="inv-actions">
                  <button class="btn btn-sm btn-gold" onclick="window.game.equipGear('${gear.uid}')">穿戴</button>
                  <button class="btn btn-sm btn-outline" onclick="window.game.marketChat.listMyGear('${gear.uid}')">上架拍賣</button>
                  <button class="btn btn-sm btn-danger" onclick="window.game.decomposeSingleGear('${gear.uid}')">分解</button>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }

    /**
     * 分解單件裝備
     */
    decomposeSingleGear(gearUid) {
      const idx = this.player.inventory.findIndex(g => g.uid === gearUid);
      if (idx === -1) return;
      const gear = this.player.inventory[idx];
      const mats = window.decomposeGear(gear);

      this.player.inventory.splice(idx, 1);
      this.player.iron += mats.iron;
      this.player.souls += mats.souls;
      this.player.gold += mats.gold;

      this.showToast(`已分解【${gear.name}】，獲得玉鋼 x${mats.iron}、魂玉 x${mats.souls}`, 'info');
      this.renderGearUI();
      this.updateHeaderUI();
      this.checkSmartEquip();
    }

    /**
     * 渲染天賦分頁
     */
    renderTalentsUI() {
      const classSelect = document.getElementById('class-select-container');
      const talentsList = document.getElementById('talents-tree-container');
      const pointsVal = document.getElementById('talent-points-available');

      if (pointsVal) pointsVal.innerText = this.player.talentPoints;

      // 四大流派選擇鈕
      if (classSelect && window.SAMURAI_CLASSES) {
        classSelect.innerHTML = Object.keys(window.SAMURAI_CLASSES).map(cKey => {
          const cls = window.SAMURAI_CLASSES[cKey];
          const isSelected = this.player.classId === cKey;
          return `
            <button class="class-card-btn ${isSelected ? 'active' : ''}" onclick="window.game.switchClass('${cKey}')">
              <span class="class-icon">${cls.icon}</span>
              <div class="class-name">${cls.name}</div>
              <div class="class-subtitle">${cls.subtitle}</div>
            </button>
          `;
        }).join('');
      }

      // 當前流派天賦樹渲染
      const curCls = window.SAMURAI_CLASSES[this.player.classId];
      if (talentsList && curCls) {
        talentsList.innerHTML = `
          <div class="current-class-hero" style="border-left: 4px solid ${curCls.themeColor};">
            <h3>${curCls.icon} ${curCls.name} - ${curCls.subtitle}</h3>
            <p>${curCls.desc}</p>
          </div>
          <div class="talents-grid">
            ${curCls.talents.map(tal => {
              const curRank = this.player.talents[tal.id] || 0;
              const canLevel = this.player.talentPoints > 0 && curRank < tal.maxRank;
              return `
                <div class="talent-card">
                  <div class="talent-header">
                    <span class="talent-icon">${tal.icon}</span>
                    <div class="talent-title">
                      <div class="talent-name">${tal.name}</div>
                      <div class="talent-rank">等級: ${curRank} / ${tal.maxRank}</div>
                    </div>
                  </div>
                  <div class="talent-desc">${tal.desc}</div>
                  <div class="talent-footer">
                    <button class="btn ${canLevel ? 'btn-gold' : 'btn-disabled'}" 
                            onclick="window.game.addTalentPoint('${tal.id}')"
                            ${canLevel ? '' : 'disabled'}>
                      ➕ 投入天賦點
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }
    }

    /**
     * 渲染成就分頁
     */
    renderAchievementsUI() {
      const container = document.getElementById('achievements-list-container');
      if (!container || !window.ACHIEVEMENTS_DB) return;

      container.innerHTML = window.ACHIEVEMENTS_DB.map(ach => {
        const status = this.player.achievements[ach.id] || { unlocked: false, claimed: false };
        let btnHtml = '';

        if (!status.unlocked) {
          btnHtml = `<span class="badge-locked">🔒 未達成</span>`;
        } else if (!status.claimed) {
          btnHtml = `<button class="btn btn-gold btn-sm" onclick="window.game.claimAchievement('${ach.id}')">🎁 領取獎勵</button>`;
        } else {
          btnHtml = `<span class="badge-completed">✅ 已領取</span>`;
        }

        return `
          <div class="achievement-card ${status.unlocked ? 'unlocked' : ''}">
            <div class="ach-crest"><span class="ach-icon">${ach.icon}</span></div>
            <div class="ach-details">
              <div class="ach-name">${ach.name} <span class="ach-pts">(+${ach.points} 點)</span></div>
              <div class="ach-desc">${ach.desc}</div>
            </div>
            <div class="ach-action">${btnHtml}</div>
          </div>
        `;
      }).join('');
    }

    /**
     * 渲染每日簽到
     */
    renderDailySignInUI() {
      const container = document.getElementById('daily-signin-grid');
      if (!container || !window.DAILY_SIGNIN_REWARDS) return;

      const today = new Date().toISOString().slice(0, 10);
      const isClaimedToday = this.player.dailySignIn.lastClaimDate === today;
      const claimedCount = this.player.dailySignIn.claimedDays;

      container.innerHTML = window.DAILY_SIGNIN_REWARDS.map(r => {
        const dayIdx = r.day;
        const isPast = dayIdx <= (claimedCount % 7) && isClaimedToday;
        const isCurrent = !isClaimedToday && dayIdx === ((claimedCount % 7) + 1);

        return `
          <div class="daily-reward-card ${isCurrent ? 'active-today' : ''} ${isPast ? 'claimed' : ''}">
            <div class="daily-day-label">第 ${r.day} 天</div>
            <div class="daily-icon">${r.icon}</div>
            <div class="daily-name">${r.name}</div>
            <div class="daily-desc">${r.desc}</div>
            ${isCurrent ? `
              <button class="btn btn-gold btn-sm" onclick="window.game.claimDailyReward()">✨ 立即簽到</button>
            ` : (isPast ? `<span class="daily-checked">✔️ 已領取</span>` : `<span class="daily-wait">⏳ 敬請期待</span>`)}
          </div>
        `;
      }).join('');
    }

    /**
     * 綁定 Google 登入 (Google Identity Services)
     */
    handleGoogleLogin(credentialResponse) {
      if (!credentialResponse || !credentialResponse.credential) return;
      try {
        // 解碼 JWT Payload
        const base64Url = credentialResponse.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        const profile = JSON.parse(jsonPayload);

        this.player.googleProfile = {
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
          sub: profile.sub
        };
        this.player.name = profile.name || this.player.name;

        this.showToast(`🎉 成功以 Google 帳號【${profile.name}】登入！角色已安全綁定`, 'success');
        this.updateHeaderUI();
        this.save();
      } catch (e) {
        console.error('Google decode failed', e);
      }
    }

    /**
     * 儲存進度 (LocalStorage + 更新存檔時間)
     */
    save() {
      this.player.lastSaveTime = Date.now();
      try {
        localStorage.setItem('samurai_resurrected_save', JSON.stringify(this.player));
      } catch (e) {
        console.error('Local save error', e);
      }
    }

    /**
     * 讀取進度
     */
    load() {
      try {
        const saved = localStorage.getItem('samurai_resurrected_save');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.player = Object.assign(this.initDefaultPlayer(), parsed);
        }
      } catch (e) {
        console.error('Load save error', e);
      }
    }

    /**
     * 導出存檔代碼 (Base64)
     */
    exportSave() {
      this.save();
      const code = btoa(encodeURIComponent(JSON.stringify(this.player)));
      navigator.clipboard.writeText(code).then(() => {
        this.showToast(`存檔代碼已複製到剪貼簿！`, 'success');
      }).catch(() => {
        prompt('請手動複製存檔代碼：', code);
      });
    }

    /**
     * 匯入存檔代碼
     */
    importSave() {
      const code = prompt('請貼上存檔代碼：');
      if (!code) return;
      try {
        const json = decodeURIComponent(atob(code.trim()));
        const parsed = JSON.parse(json);
        this.player = Object.assign(this.initDefaultPlayer(), parsed);
        this.save();
        this.showToast(`存檔匯入成功！`, 'success');
        location.reload();
      } catch (e) {
        this.showToast(`存檔代碼無效！`, 'error');
      }
    }

    /**
     * 介面事件初始化
     */
    initUI() {
      this.updateHeaderUI();
      this.switchTab('battle');
    }

    /**
     * 身障無障礙操作控制設定 (全鍵盤單鍵支援 + 空白鍵換裝/揮刀)
     */
    setupControls() {
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        if (e.code === 'Space') {
          e.preventDefault();
          if (this.smartEquipTarget) {
            this.equipSmartTarget();
          } else {
            this.manualSlash();
          }
        } else if (e.code === 'Digit1') {
          this.switchTab('battle');
        } else if (e.code === 'Digit2') {
          this.switchTab('gear');
        } else if (e.code === 'Digit3') {
          this.switchTab('talents');
        } else if (e.code === 'Digit4') {
          this.switchTab('market');
        } else if (e.code === 'Digit5') {
          this.switchTab('achievements');
        } else if (e.code === 'KeyM') {
          if (this.audio) {
            const muted = this.audio.toggleMute();
            this.showToast(muted ? '🔇 聲音已完全靜音' : '🔊 音效已開啟', 'info');
          }
        }
      });
    }
  }

  // 啟動入口
  window.SamuraiGame = SamuraiGame;
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', () => {
      window.game = new SamuraiGame();
    });
  }

})();
