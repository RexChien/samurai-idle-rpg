/**
 * 《武士之刃：無雙斬》（Samurai Blade: Resurrected）核心遊戲引擎 (src/game.js)
 * 特色：
 * 1. 暗黑破壞神 3/4 風格：首頁 New Game 與創角儀式、主城營地 (Town Hub)、小站傳送陣世界地圖 (Waypoints)
 * 2. 漸進式任務解鎖自動劍心 (Tier 0 手動揮刀 -> 跑主線任務逐步解鎖 Tier 1~4 全自動神速劍心)
 * 3. 100小時八卷史詩主線任務、20大奇譚支線、幕府無限懸賞令、《戰國百鬼繪卷》劇情圖鑑
 * 4. 宮本武藏《五輪書》五輪架勢相剋與 12 式流派奧義自訂搭配（鑽研打法 Build）
 * 5. 天下第一武道大會 (PvP 天梯競技場 + 跨玩家切磋碼) 與 無間奈落千層深淵 (1~1000+ 層)
 * 6. 6 大品質掉寶與暗金光柱、金屬回響音效、暗黑 3 式成就橫幅與離線掛機結算
 */
(function() {
  'use strict';

  class SamuraiGame {
    constructor() {
      this.version = '3.0.0-chronicle-pvp';
      this.activeTab = 'battle';
      this.combatInterval = null;
      this.holdSlashInterval = null;
      this.currentEnemy = null;
      this.smartEquipTarget = null;
      this.achievementQueue = [];
      this.isShowingAchievement = false;
      this.creationDraft = {
        name: '宮本武藏',
        classId: 'kensei',
        avatar: 'samurai_general',
        bladeTrail: 'cherry'
      };

      // 初始化音效引擎
      this.audio = window.SamuraiAudioEngine ? new window.SamuraiAudioEngine() : null;

      // 初始化預設玩家數據
      this.player = this.initDefaultPlayer();

      // 載入本機存檔
      this.hasExistingSave = this.load();

      // 確保懸賞令與 PvP 對手存在
      this.ensureBountiesAndPvP();

      // 初始化拍賣與聊天系統
      if (window.MarketChatManager) {
        this.marketChat = new window.MarketChatManager(this);
      }

      // 初始化介面與事件
      this.initUI();
      this.setupControls();

      // 如果已有創角存檔，檢查離線收益並啟動戰鬥
      if (this.player.characterCreated) {
        this.hideTitleAndCreation();
        if ((this.player.automationTier || 0) >= 3) {
          this.processOfflineProgress();
        }
        this.startCombatLoop();
      } else {
        this.showTitleScreen();
      }

      // 定時自動存檔 (每 10 秒)
      this.autoSaveInterval = setInterval(() => {
        if (this.player.characterCreated) this.save();
      }, 10000);
      if (typeof this.autoSaveInterval.unref === 'function') this.autoSaveInterval.unref();
    }

    /**
     * 初始預設玩家資料
     * 新角色預設為 Tier 0 (凡骨拔刀・手動修煉)，須推進主線任務逐步解鎖自動劍心
     */
    initDefaultPlayer() {
      return {
        characterCreated: false,
        name: '無雙武士',
        avatar: 'samurai_general',
        title: '流浪武士',
        classId: 'kensei',
        level: 1,
        exp: 0,
        maxExp: 100,
        gold: 1500,
        iron: 30,
        souls: 5,
        talentPoints: 1, // 創角即贈送 1 點天賦可體驗
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
        // 漸進式自動機能 (0 = 凡骨拔刀手動, 1 = 基礎自動, 2 = 疾風自動+自動分解, 3 = 式神自動奧義+離線修煉, 4 = 無念無想極速)
        automationTier: 0,
        autoSlashEnabled: false,
        // 宮本武藏《五輪書》架勢與裝備奧義 (最多 3 招)
        stance: 'earth',
        equippedArts: ['art_tsubame', 'art_guren', 'art_fudo'],
        // 主線、支線、無限懸賞與劇情繪卷
        mainQuestIndex: 0,
        completedMainQuests: [],
        claimedSideQuests: {},
        unlockedChronicles: [],
        bounties: [],
        bountyCompletedCount: 0,
        // 天下第一武道大會 (PvP) 與 無間奈落千層深淵
        pvp: {
          rating: 1000,
          wins: 0,
          losses: 0,
          streak: 0,
          opponents: [],
          lastLog: []
        },
        abyss: {
          floor: 1,
          maxFloor: 0
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
        inTown: false, // 是否在京都主城安全區
        townBuffUntil: 0, // 主城巫女祈福 Buff 到期時間
        act: 1,
        maxUnlockedAct: 1,
        actProgress: 0,
        actBossUnlocked: false,
        cosmetics: {
          avatar: 'samurai_general',
          bladeTrail: 'cherry',
          haoriColor: 'black_gold',
          title: '流浪武士'
        },
        settings: {
          autoDecomposeCommon: false,
          autoDecomposeMagic: false,
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
          manualSlashes: 0,
          skillsCast: 0,
          gearLooted: 0,
          legendaryLooted: 0,
          ancientLooted: 0,
          marketSales: 0,
          marketPurchases: 0,
          upgradesSuccess: 0,
          highestPower: 0,
          townVisits: 0,
          pvpWins: 0,
          bountiesCompleted: 0
        },
        lastSaveTime: Date.now()
      };
    }

    ensureBountiesAndPvP() {
      if (!this.player.pvp) {
        this.player.pvp = { rating: 1000, wins: 0, losses: 0, streak: 0, opponents: [], lastLog: [] };
      }
      if (!this.player.abyss) {
        this.player.abyss = { floor: 1, maxFloor: 0 };
      }
      if (!Array.isArray(this.player.equippedArts) || this.player.equippedArts.length === 0) {
        this.player.equippedArts = ['art_tsubame', 'art_guren', 'art_fudo'];
      }
      if (!this.player.stance) {
        this.player.stance = 'earth';
      }
      if (!Array.isArray(this.player.bounties) || this.player.bounties.length === 0) {
        this.refreshBounties();
      }
      if (!Array.isArray(this.player.pvp.opponents) || this.player.pvp.opponents.length === 0) {
        this.refreshPvPOpponents(true);
      }
    }

    /**
     * ==================== 1. 首頁 New Game 與創角流程 ====================
     */
    showTitleScreen() {
      const titleScreen = document.getElementById('title-screen-overlay');
      const continueBtn = document.getElementById('btn-continue-game');
      if (titleScreen) titleScreen.style.display = 'flex';
      if (continueBtn) {
        continueBtn.style.display = this.hasExistingSave && this.player.characterCreated ? 'inline-flex' : 'none';
      }
    }

    hideTitleAndCreation() {
      const titleScreen = document.getElementById('title-screen-overlay');
      const creationScreen = document.getElementById('character-creation-overlay');
      if (titleScreen) titleScreen.style.display = 'none';
      if (creationScreen) creationScreen.style.display = 'none';
    }

    startNewGameFlow() {
      const titleScreen = document.getElementById('title-screen-overlay');
      const creationScreen = document.getElementById('character-creation-overlay');
      if (titleScreen) titleScreen.style.display = 'none';
      if (creationScreen) {
        creationScreen.style.display = 'flex';
        this.renderCreationPreview();
      }
      if (this.audio) this.audio.playEquipSound();
    }

    continueGameFlow() {
      this.hideTitleAndCreation();
      this.updateHeaderUI();
      this.updateBattleUI();
      this.startCombatLoop();
      if (this.audio) this.audio.playCoinSound();
    }

    selectCreationClass(classId) {
      if (!window.SAMURAI_CLASSES[classId]) return;
      this.creationDraft.classId = classId;
      this.renderCreationPreview();
      if (this.audio) this.audio.playSlashSound(false);
    }

    selectCreationAvatar(avatarKey) {
      this.creationDraft.avatar = avatarKey;
      this.renderCreationPreview();
      if (this.audio) this.audio.playEquipSound();
    }

    selectCreationTrail(trailKey) {
      this.creationDraft.bladeTrail = trailKey;
      this.renderCreationPreview();
    }

    renderCreationPreview() {
      document.querySelectorAll('.create-class-btn').forEach(btn => {
        if (btn.dataset.class === this.creationDraft.classId) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      document.querySelectorAll('.create-avatar-btn').forEach(btn => {
        if (btn.dataset.avatar === this.creationDraft.avatar) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      const cls = window.SAMURAI_CLASSES ? window.SAMURAI_CLASSES[this.creationDraft.classId] : null;
      const previewBox = document.getElementById('creation-class-desc-box');
      if (previewBox && cls) {
        previewBox.innerHTML = `
          <div style="font-size: 1.15rem; font-weight: 900; color: ${cls.themeColor}; margin-bottom: 4px;">
            ${cls.icon} ${cls.name} — ${cls.subtitle}
          </div>
          <div style="font-size: 0.92rem; color: var(--text-main); line-height: 1.45;">
            ${cls.desc}
          </div>
        `;
      }
    }

    /**
     * 完成角色創建，進入戰國暗黑世界
     * 初始為 Tier 0 手動揮刀，引導玩家完成首個任務【主線 M01：木刀百振・劍心初醒】開啟自動劍意
     */
    confirmCharacterCreation() {
      const nameInput = document.getElementById('creation-name-input');
      const chosenName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : '宮本武藏';

      this.player = this.initDefaultPlayer();
      this.player.characterCreated = true;
      this.player.name = chosenName;
      this.player.classId = this.creationDraft.classId || 'kensei';
      this.player.cosmetics.avatar = this.creationDraft.avatar || 'samurai_general';
      this.player.cosmetics.bladeTrail = this.creationDraft.bladeTrail || 'cherry';

      if (window.generateGear) {
        this.player.equipped.weapon = window.generateGear('weapon', 'magic', 1);
      }

      this.ensureBountiesAndPvP();
      this.hideTitleAndCreation();
      this.save();
      this.updateHeaderUI();
      this.switchTab('battle');
      this.startCombatLoop();

      if (window.MAIN_QUESTS && window.MAIN_QUESTS[0]) {
        const mq0 = window.MAIN_QUESTS[0];
        this.openStoryCutsceneModal(
          mq0.volume,
          mq0.title,
          `${mq0.npcIcon || '🌳'} ${mq0.npc}`,
          `${mq0.storyText}\n\n📖【${mq0.loreTitle}】\n${mq0.loreBody}\n\n💡【新手引導】：一開始請點擊畫面中央的「⚔️ 拔刀斬擊」（或按住連斬／按空白鍵）親手揮刀 10 次並斬殺 3 名敵人，完成首個主線任務即可領悟【第一重：劍心初醒】，開啟自動拔刀機能！`
        );
      }

      if (this.audio) this.audio.playAchievementFanfare();
      this.showToast(`🎉 角色【${chosenName}】創建完成！完成首個主線即可解鎖自動揮刀！`, 'success');
    }

    /**
     * ==================== 2. 主城營地 (Town Hub) 與小站傳送陣 (World Map) ====================
     */
    openWorldMap() {
      const modal = document.getElementById('world-map-modal');
      if (!modal) return;
      this.renderWorldMapModal();
      modal.style.display = 'flex';
      if (this.audio) this.audio.playEquipSound();
    }

    closeWorldMap() {
      const modal = document.getElementById('world-map-modal');
      if (modal) modal.style.display = 'none';
    }

    renderWorldMapModal() {
      const container = document.getElementById('world-map-nodes-container');
      if (!container || !window.CAMPAIGN_ACTS) return;

      const maxAct = Math.max(this.player.maxUnlockedAct || 1, this.player.act || 1);
      this.player.maxUnlockedAct = maxAct;

      const townActive = this.player.inTown;
      let html = `
        <div class="waypoint-card town-waypoint ${townActive ? 'current-location' : ''}" onclick="window.game.teleportToTown()">
          <div class="wp-icon">🏯</div>
          <div class="wp-info">
            <div class="wp-title">【主城安全區】京都・新選本陣</div>
            <div class="wp-sub">篝火祈福(+15%攻擊) | 刀匠強化 | 浪人拍賣行 | 幕府懸賞</div>
          </div>
          <div class="wp-action">
            ${townActive ? '<span class="wp-badge-here">📍 目前所在</span>' : '<button class="btn btn-gold btn-sm">🌀 回城傳送</button>'}
          </div>
        </div>
      `;

      html += window.CAMPAIGN_ACTS.map(actData => {
        const isUnlocked = actData.act <= maxAct || this.player.level >= actData.reqLevel;
        const isHere = !this.player.inTown && this.player.act === actData.act;

        return `
          <div class="waypoint-card ${isUnlocked ? 'unlocked' : 'locked'} ${isHere ? 'current-location' : ''}"
               onclick="${isUnlocked ? `window.game.travelToZone(${actData.act})` : ''}">
            <div class="wp-icon">${actData.mapIcon || '⛩️'}</div>
            <div class="wp-info">
              <div class="wp-title">${actData.name} <span class="wp-lvl">(推薦 Lv.${actData.reqLevel})</span></div>
              <div class="wp-sub">${actData.subtitle} — 首領：${actData.boss.name}</div>
            </div>
            <div class="wp-action">
              ${isHere
                ? '<span class="wp-badge-here">⚔️ 征戰中</span>'
                : (isUnlocked
                    ? `<button class="btn btn-gold btn-sm">⚡ 傳送前往</button>`
                    : `<span class="wp-badge-locked">🔒 需通關前章或 Lv.${actData.reqLevel}</span>`)}
            </div>
          </div>
        `;
      }).join('');

      container.innerHTML = html;
    }

    teleportToTown() {
      this.player.inTown = true;
      this.player.statsTracked.townVisits = (this.player.statsTracked.townVisits || 0) + 1;
      this.closeWorldMap();
      this.switchTab('battle');
      this.updateBattleUI();
      this.updateActiveQuestTracker();
      if (this.audio) this.audio.playAchievementFanfare();
      this.showToast(`🏯 已透過傳送陣返回【京都・新選本陣】安全區！`, 'info');
    }

    travelToZone(actNumber) {
      const actIdx = actNumber - 1;
      if (!window.CAMPAIGN_ACTS || !window.CAMPAIGN_ACTS[actIdx]) return;

      const actData = window.CAMPAIGN_ACTS[actIdx];
      const maxAct = Math.max(this.player.maxUnlockedAct || 1, this.player.act || 1);
      if (actNumber > maxAct && this.player.level < actData.reqLevel) {
        this.showToast(`尚未解鎖該區域！需要等級 Lv.${actData.reqLevel}`, 'warning');
        return;
      }

      this.player.inTown = false;
      this.player.act = actNumber;
      this.player.actProgress = 0;
      this.player.actBossUnlocked = false;

      this.closeWorldMap();
      this.switchTab('battle');
      this.spawnNextEnemy();
      if (this.audio) this.audio.playSlashSound(true);
      this.showToast(`⚡ 已傳送至【${actData.name}】展開討伐！`, 'success');
    }

    prayAtTownShrine() {
      this.player.townBuffUntil = Date.now() + 30 * 60 * 1000;
      if (this.audio) this.audio.playAchievementFanfare();
      this.showToast(`⛩️ 巫女祈福完成！獲得【出雲武運祝福】攻擊力提升 15% (持續 30 分鐘)！`, 'success');
      this.updateHeaderUI();
      this.updateBattleUI();
    }

    /**
     * ==================== 3. 綜合戰力計算 (含五輪書架勢加成) ====================
     */
    getCalculatedStats() {
      let baseAtk = 20 + (this.player.level - 1) * 6;
      let baseDef = 10 + (this.player.level - 1) * 4;
      let baseHP = 150 + (this.player.level - 1) * 35;
      let baseSpd = 10;
      let critRate = 5;
      let critDmg = 50;
      let lifeSteal = 0;
      let armorPen = 0;
      let dmgRed = 0;
      let thornsPct = 0;
      let evasion = 5;
      let artDmgBonus = 0;
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

      // 宮本武藏《五輪書》架勢加成
      if (window.FIVE_RINGS_STANCES && window.FIVE_RINGS_STANCES[this.player.stance]) {
        const sb = window.FIVE_RINGS_STANCES[this.player.stance].bonuses || {};
        if (sb.atkPct) baseAtk *= (1 + sb.atkPct / 100);
        if (sb.defPct) baseDef *= (1 + sb.defPct / 100);
        if (sb.hpPct) baseHP *= (1 + sb.hpPct / 100);
        if (sb.critRate) critRate += sb.critRate;
        if (sb.critDmg) critDmg += sb.critDmg;
        if (sb.atkSpd) baseSpd += sb.atkSpd;
        if (sb.lifeSteal) lifeSteal += sb.lifeSteal;
        if (sb.armorPen) armorPen += sb.armorPen;
        if (sb.dmgRed) dmgRed += sb.dmgRed;
        if (sb.thornsPct) thornsPct += sb.thornsPct;
        if (sb.evasion) evasion += sb.evasion;
        if (sb.artDmgBonus) artDmgBonus += sb.artDmgBonus;
      }

      // 主城神社祈福加成 (+15% 攻擊)
      const hasTownBuff = (this.player.townBuffUntil || 0) > Date.now();
      if (hasTownBuff) {
        baseAtk *= 1.15;
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
        thornsPct: thornsPct,
        evasion: Math.min(55, evasion),
        artDmgBonus: artDmgBonus,
        magicFind: magicFind,
        goldBonus: goldBonus,
        hasTownBuff: hasTownBuff,
        power: finalPower
      };
    }

    /**
     * ==================== 4. 漸進式自動討伐與親手拔刀系統 ====================
     */
    startCombatLoop() {
      if (this.combatInterval) clearInterval(this.combatInterval);
      if (!this.player.inTown) {
        if (!this.currentEnemy || this.currentEnemy.hp <= 0) {
          this.spawnNextEnemy();
        } else {
          this.updateBattleUI();
        }
      } else {
        this.updateBattleUI();
      }

      const tier = this.player.automationTier || 0;
      const tierMeta = (window.AUTOMATION_TIERS && window.AUTOMATION_TIERS[tier]) ? window.AUTOMATION_TIERS[tier] : null;
      const intervalMs = (tierMeta && tierMeta.intervalMs) ? tierMeta.intervalMs : 700;

      this.combatInterval = setInterval(() => {
        if (!this.player.inTown && (this.player.automationTier || 0) > 0 && this.player.autoSlashEnabled) {
          this.autoCombatTick(true);
        }
      }, intervalMs);
      if (typeof this.combatInterval.unref === 'function') this.combatInterval.unref();
    }

    /**
     * 切換自動揮刀開關 (須先透過主線任務 M01 解鎖 Tier 1)
     */
    toggleAutoSlash() {
      if ((this.player.automationTier || 0) <= 0) {
        this.showToast(`🔒 尚未領悟自動劍意！請先點擊「⚔️ 拔刀斬擊」完成首個主線任務【主線 M01：木刀百振・劍心初醒】即可開啟自動揮刀！`, 'warning');
        return;
      }
      this.player.autoSlashEnabled = !this.player.autoSlashEnabled;
      this.startCombatLoop();
      this.updateBattleUI();
      this.showToast(
        this.player.autoSlashEnabled ? `🤖 已啟動【自動揮刀】巡航模式！` : `✋ 已切換為【親手拔刀】模式！`,
        this.player.autoSlashEnabled ? 'success' : 'info'
      );
    }

    /**
     * 切換自動分解設定 (第二重：二天疾風 解鎖背景自動分解)
     */
    toggleAutoDecompose(quality, checked) {
      if (quality === 'common') this.player.settings.autoDecomposeCommon = Boolean(checked);
      else if (quality === 'magic') this.player.settings.autoDecomposeMagic = Boolean(checked);
      else if (quality === 'rare') this.player.settings.autoDecomposeRare = Boolean(checked);

      if (checked && (this.player.automationTier || 0) < 2) {
        this.showToast(`💡 已勾選過濾器！推進主線至【主線 M03：血夜斬首・鬼丸十藏】解鎖第二重自動劍意後，掉落將自動熔煉為玉鋼`, 'info');
      } else {
        this.showToast(`♻️ 自動分解設定已更新！`, 'info');
      }
      this.save();
    }

    trackStat(statName, delta = 1) {
      if (!this.player.statsTracked) this.player.statsTracked = {};
      this.player.statsTracked[statName] = (this.player.statsTracked[statName] || 0) + delta;
    }

    destroy() {
      if (this.combatInterval) clearInterval(this.combatInterval);
      if (this.holdSlashInterval) clearInterval(this.holdSlashInterval);
      if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
      if (this.marketChat && typeof this.marketChat.destroy === 'function') {
        this.marketChat.destroy();
      }
    }

    /**
     * 戰鬥每刀結算 (可由手動拔刀或自動劍心觸發)
     */
    autoCombatTick(isAuto = false) {
      if (this.player.inTown) return;
      if (!this.currentEnemy || this.currentEnemy.hp <= 0) {
        this.spawnNextEnemy();
        return;
      }

      const stats = this.getCalculatedStats();
      let isCrit = Math.random() * 100 < stats.critRate;
      let dmg = stats.atk * (0.88 + Math.random() * 0.24);
      let skillTriggered = null;

      // 若已達第三重自動劍意 (Tier >= 3)，自動揮刀時有機率觸發已裝備的武學奧義
      if (isAuto && (this.player.automationTier || 0) >= 3 && window.SAMURAI_ARTS) {
        for (const artId of (this.player.equippedArts || [])) {
          const art = window.SAMURAI_ARTS.find(a => a.id === artId);
          if (art && this.player.level >= (art.reqLevel || 1) && Math.random() * 100 < art.procChance) {
            skillTriggered = art;
            dmg *= (art.powerMult || 2.0) * (1 + (stats.artDmgBonus || 0) / 100);
            if (art.effectType === 'guaranteed_crit' || art.effectType === 'pierce') isCrit = true;
            this.player.statsTracked.skillsCast = (this.player.statsTracked.skillsCast || 0) + 1;
            break;
          }
        }
      }

      const enemyDef = Math.max(0, (this.currentEnemy.def || 0) - stats.armorPen);
      const reduction = enemyDef / (enemyDef + 100);
      dmg = Math.max(1, dmg * (1 - reduction));

      if (isCrit) {
        dmg *= (1 + stats.critDmg / 100);
      }

      dmg = Math.round(dmg);
      this.currentEnemy.hp -= dmg;

      if (this.audio) this.audio.playSlashSound(isCrit);
      if (skillTriggered) {
        this.showDamageText(`${skillTriggered.icon} ${skillTriggered.name} ${dmg}`, true, false);
      } else {
        this.showDamageText(dmg, isCrit, false);
      }

      if (stats.lifeSteal > 0 || (skillTriggered && skillTriggered.effectType === 'lifesteal')) {
        const lsPct = stats.lifeSteal + (skillTriggered && skillTriggered.effectType === 'lifesteal' ? 35 : 0);
        const heal = Math.round(dmg * (lsPct / 100));
        if (heal > 0) this.showDamageText(`+${heal} 汲血`, false, true);
      }

      this.updateEnemyHealthBar();

      if (this.currentEnemy.hp <= 0) {
        this.onEnemyDefeated();
      }
    }

    /**
     * 玩家親手拔刀斬擊（無障礙超大按鈕、點擊戰場、空白鍵皆可觸發）
     */
    manualSlash() {
      if (this.player.inTown) return;
      if (!this.currentEnemy || this.currentEnemy.hp <= 0) {
        this.spawnNextEnemy();
      }
      this.player.statsTracked.manualSlashes = (this.player.statsTracked.manualSlashes || 0) + 1;
      this.autoCombatTick(false);
      this.updateActiveQuestTracker();
    }

    startHoldSlash() {
      this.stopHoldSlash();
      this.holdSlashInterval = setInterval(() => {
        this.manualSlash();
      }, 260);
    }

    stopHoldSlash() {
      if (this.holdSlashInterval) {
        clearInterval(this.holdSlashInterval);
        this.holdSlashInterval = null;
      }
    }

    /**
     * 手動施放流派奧義絕技
     */
    castManualArt() {
      if (this.player.inTown) {
        this.showToast(`主城安全區內禁止動武！請先傳送至討伐戰場`, 'info');
        return;
      }
      if (!this.currentEnemy || this.currentEnemy.hp <= 0) {
        this.spawnNextEnemy();
        if (!this.currentEnemy) return;
      }

      const equippedIds = this.player.equippedArts || ['art_tsubame'];
      const unlockedArts = (window.SAMURAI_ARTS || []).filter(
        a => equippedIds.includes(a.id) && this.player.level >= (a.reqLevel || 1)
      );
      const chosenArt = unlockedArts.length > 0
        ? unlockedArts[Math.floor(Math.random() * unlockedArts.length)]
        : (window.SAMURAI_ARTS ? window.SAMURAI_ARTS[0] : { name: '秘劍・燕返', icon: '⚔️', powerMult: 2.3 });

      const stats = this.getCalculatedStats();
      const dmg = Math.round(stats.atk * (chosenArt.powerMult || 2.3) * (1 + stats.critDmg / 150));
      this.currentEnemy.hp -= dmg;
      this.player.statsTracked.skillsCast = (this.player.statsTracked.skillsCast || 0) + 1;
      this.player.statsTracked.manualSlashes = (this.player.statsTracked.manualSlashes || 0) + 1;

      if (this.audio) this.audio.playSlashSound(true);
      this.showDamageText(`🔥【${chosenArt.name}】${dmg}!`, true, false);
      this.updateEnemyHealthBar();

      if (this.currentEnemy.hp <= 0) {
        this.onEnemyDefeated();
      }
      this.updateActiveQuestTracker();
    }

    spawnNextEnemy() {
      if (this.player.inTown) {
        this.updateBattleUI();
        return;
      }
      const actIndex = Math.max(0, Math.min(6, (this.player.act || 1) - 1));
      const actData = window.CAMPAIGN_ACTS ? window.CAMPAIGN_ACTS[actIndex] : null;
      if (!actData) return;

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

    onEnemyDefeated() {
      const enemy = this.currentEnemy;
      const stats = this.getCalculatedStats();
      this.player.statsTracked.totalKills++;

      const goldEarned = Math.round((enemy.gold || 10) * (1 + stats.goldBonus / 100));
      const expEarned = enemy.exp || 15;

      this.player.gold += goldEarned;
      this.addExp(expEarned);

      this.rollGearDrop(enemy);

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

        if (this.player.act < 7) {
          this.player.act++;
          if (this.player.act > (this.player.maxUnlockedAct || 1)) {
            this.player.maxUnlockedAct = this.player.act;
          }
          this.showToast(`🗺️ 已解鎖世界地圖全新章節【${window.CAMPAIGN_ACTS[this.player.act - 1].name}】！`, 'success');
        }
      } else {
        this.player.actProgress++;
        if (this.player.actProgress >= actData.bossKillsRequired) {
          this.player.actBossUnlocked = true;
          this.showToast(`🔥 討伐進度已滿！首領即將現身！`, 'warning');
        }
      }

      this.checkAchievements();
      this.updateActiveQuestTracker();
      setTimeout(() => this.spawnNextEnemy(), 250);
      this.updateHeaderUI();
    }

    rollGearDrop(enemy) {
      if (!window.generateGear) return;
      const dropChance = enemy.isBoss ? 0.95 : 0.38;
      if (Math.random() > dropChance) return;

      const stats = this.getCalculatedStats();
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

      if (this.audio) this.audio.playDropSound(quality);

      if (quality === 'legendary' || quality === 'ancient') {
        this.triggerLootBeam(gear);
        if (this.marketChat) this.marketChat.broadcastLoot(this.player.name, gear);
      }

      if (this.shouldAutoDecompose(quality)) {
        const mats = window.decomposeGear(gear);
        this.player.iron += mats.iron;
        this.player.souls += mats.souls;
        this.player.gold += mats.gold;
        this.showToast(`♻️ 自動分解 [${gear.qualityName}]【${gear.name}】獲得玉鋼 x${mats.iron}`, 'info');
        return;
      }

      this.addGearToInventory(gear);
    }

    shouldAutoDecompose(quality) {
      if ((this.player.automationTier || 0) < 2) return false;
      if (quality === 'common' && this.player.settings.autoDecomposeCommon) return true;
      if (quality === 'magic' && this.player.settings.autoDecomposeMagic) return true;
      if (quality === 'rare' && this.player.settings.autoDecomposeRare) return true;
      return false;
    }

    addGearToInventory(gear) {
      if (this.player.inventory.length >= 50) {
        this.showToast(`⚠️ 行囊已滿 (50/50)，請分解多餘裝備！`, 'warning');
        return;
      }
      this.player.inventory.push(gear);
      this.renderGearUI();
      this.checkSmartEquip();
    }

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
              ⚡ 一鍵穿戴
            </button>
          </div>
        `;
      } else {
        this.smartEquipTarget = null;
        banner.style.display = 'none';
      }
    }

    equipSmartTarget() {
      if (!this.smartEquipTarget) return;
      this.equipGear(this.smartEquipTarget.uid);
      const banner = document.getElementById('smart-equip-banner');
      if (banner) banner.style.display = 'none';
      this.smartEquipTarget = null;
      this.checkSmartEquip();
    }

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
      this.updateActiveQuestTracker();
      this.checkAchievements();
    }

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
      this.updateActiveQuestTracker();
      this.checkAchievements();
    }

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
     * ==================== 5. 主線任務、支線奇譚、無限懸賞與百鬼繪卷系統 ====================
     */
    getQuestObjectiveValue(type) {
      const st = this.player.statsTracked || {};
      const stats = this.getCalculatedStats();
      switch (type) {
        case 'manualSlashes':
        case 'manual':
          return st.manualSlashes || 0;
        case 'totalKills':
        case 'kills':
          return st.totalKills || 0;
        case 'bossKills':
        case 'boss_kills':
          return st.bossKills || 0;
        case 'level':
          return this.player.level || 1;
        case 'highestPower':
        case 'power':
          return Math.max(stats.power || 0, st.highestPower || 0);
        case 'act_reached':
          return Math.max(this.player.maxUnlockedAct || 1, this.player.act || 1);
        case 'gearLooted':
        case 'gear_looted':
          return st.gearLooted || 0;
        case 'legendaryLooted':
        case 'legendary_looted':
          return st.legendaryLooted || 0;
        case 'ancientLooted':
        case 'ancient_looted':
          return st.ancientLooted || 0;
        case 'upgradesSuccess':
        case 'upgrades':
        case 'upgrade':
          return st.upgradesSuccess || 0;
        case 'townVisits':
        case 'town_visits':
          return st.townVisits || 0;
        case 'marketPurchases':
          return st.marketPurchases || 0;
        case 'marketSales':
        case 'market_sales':
          return st.marketSales || 0;
        case 'pvpWins':
        case 'pvp_wins':
        case 'pvp':
          return Math.max((this.player.pvp ? this.player.pvp.wins : 0), st.pvpWins || 0);
        case 'abyssFloor':
        case 'abyss_floor':
        case 'abyss':
          return Math.max((this.player.abyss ? this.player.abyss.maxFloor : 0), (this.player.abyss ? this.player.abyss.floor - 1 : 0));
        default:
          return st[type] || 0;
      }
    }

    getCurrentMainQuest() {
      if (!window.MAIN_QUESTS) return null;
      const idx = this.player.mainQuestIndex || 0;
      if (idx >= window.MAIN_QUESTS.length) return null;
      return window.MAIN_QUESTS[idx];
    }

    isMainQuestReady(mq) {
      if (!mq || !Array.isArray(mq.objectives)) return false;
      return mq.objectives.every(obj => this.getQuestObjectiveValue(obj.type) >= obj.target);
    }

    /**
     * 領取當前主線任務獎勵（並解鎖對應自動劍心境界與劇情繪卷）
     */
    claimMainQuest() {
      const mq = this.getCurrentMainQuest();
      if (!mq) {
        this.showToast(`🎉 您已通關全部八卷主線史詩！請繼續挑戰無間奈落千層深淵與武道天梯！`, 'success');
        return false;
      }

      if (!this.isMainQuestReady(mq)) {
        this.showToast(`主線任務目標尚未全部達成！`, 'warning');
        return false;
      }

      // 發放獎勵
      const rw = mq.reward || {};
      if (rw.gold) this.player.gold += rw.gold;
      if (rw.exp) this.addExp(rw.exp);
      if (rw.iron) this.player.iron += rw.iron;
      if (rw.souls) this.player.souls += rw.souls;
      if (rw.talentPoints) this.player.talentPoints += rw.talentPoints;
      if (rw.title) {
        this.player.cosmetics.title = rw.title;
      }
      if (rw.gearQuality && window.generateGear) {
        const rewardGear = window.generateGear(null, rw.gearQuality, this.player.level);
        this.addGearToInventory(rewardGear);
      }

      // 解鎖漸進式自動劍心境界！
      let unlockedTierObj = null;
      if (rw.unlockAutomationTier && rw.unlockAutomationTier > (this.player.automationTier || 0)) {
        this.player.automationTier = rw.unlockAutomationTier;
        this.player.autoSlashEnabled = true; // 解鎖後自動為玩家開啟自動巡航！
        if (rw.unlockAutomationTier >= 2) {
          this.player.settings.autoDecomposeCommon = true;
          this.player.settings.autoDecomposeMagic = true;
        }
        unlockedTierObj = window.AUTOMATION_TIERS ? window.AUTOMATION_TIERS[rw.unlockAutomationTier] : null;
        this.startCombatLoop();
      }

      // 記錄劇情繪卷
      if (!Array.isArray(this.player.unlockedChronicles)) this.player.unlockedChronicles = [];
      if (!this.player.unlockedChronicles.some(c => c.id === mq.id)) {
        this.player.unlockedChronicles.push({
          id: mq.id,
          chapter: mq.volume || '戰國百鬼繪卷',
          title: mq.loreTitle || mq.title,
          npc: `${mq.npcIcon || '⛩️'} ${mq.npc}`,
          text: `${mq.storyText}\n\n${mq.loreBody || ''}`
        });
      }

      if (!Array.isArray(this.player.completedMainQuests)) this.player.completedMainQuests = [];
      this.player.completedMainQuests.push(mq.id);
      this.player.mainQuestIndex = (this.player.mainQuestIndex || 0) + 1;

      if (this.audio) this.audio.playAchievementFanfare();

      const nextMq = this.getCurrentMainQuest();
      if (unlockedTierObj) {
        this.openStoryCutsceneModal(
          `⚙️ 自動劍意突破 — ${unlockedTierObj.name}`,
          `${mq.loreTitle || mq.title}`,
          `${mq.npcIcon || '🌳'} ${mq.npc}`,
          `${mq.loreBody || mq.storyText}\n\n🎉【重大機能解鎖】：恭喜領悟「${unlockedTierObj.name}」！\n${unlockedTierObj.desc}`
        );
      } else if (nextMq) {
        this.openStoryCutsceneModal(
          nextMq.volume,
          nextMq.title,
          `${nextMq.npcIcon || '⛩️'} ${nextMq.npc}`,
          `${nextMq.storyText}\n\n📖【${nextMq.loreTitle}】\n${nextMq.loreBody}`
        );
      }

      this.showToast(`📜 完成主線【${mq.title}】！`, 'success');
      this.updateHeaderUI();
      this.updateBattleUI();
      this.updateActiveQuestTracker();
      this.renderQuestsUI();
      this.save();
      return true;
    }

    /**
     * 領取支線奇譚獎勵
     */
    claimSideQuest(sqId) {
      if (!window.SIDE_QUESTS) return false;
      const sq = window.SIDE_QUESTS.find(q => q.id === sqId);
      if (!sq) return false;
      if (!this.player.claimedSideQuests) this.player.claimedSideQuests = {};
      if (this.player.claimedSideQuests[sqId]) return false;

      const curVal = this.getQuestObjectiveValue(sq.objType);
      if (curVal < sq.target) {
        this.showToast(`支線目標尚未達成 (${curVal} / ${sq.target})！`, 'warning');
        return false;
      }

      this.player.claimedSideQuests[sqId] = true;
      const rw = sq.reward || {};
      if (rw.gold) this.player.gold += rw.gold;
      if (rw.iron) this.player.iron += rw.iron;
      if (rw.souls) this.player.souls += rw.souls;
      if (rw.talentPoints) this.player.talentPoints += rw.talentPoints;
      if (rw.title) this.player.cosmetics.title = rw.title;
      if (rw.gearQuality && window.generateGear) {
        const g = window.generateGear(null, rw.gearQuality, this.player.level);
        this.addGearToInventory(g);
      }

      if (this.audio) this.audio.playCoinSound();
      this.showToast(`🌸 完成支線【${sq.title}】！領取豐厚犒賞！`, 'success');
      this.updateHeaderUI();
      this.renderQuestsUI();
      this.save();
      return true;
    }

    /**
     * 幕府無限討伐懸賞令生成與領取
     */
    refreshBounties() {
      if (!window.generateProceduralBounty) return;
      const baseLvl = (this.player.bountyCompletedCount || 0) + 1;
      const curAbyss = (this.player.abyss && this.player.abyss.maxFloor) || 0;
      this.player.bounties = [
        window.generateProceduralBounty(baseLvl, this.player.statsTracked, curAbyss),
        window.generateProceduralBounty(baseLvl + 1, this.player.statsTracked, curAbyss),
        window.generateProceduralBounty(baseLvl + 2, this.player.statsTracked, curAbyss)
      ];
      if (this.activeTab === 'quests') this.renderQuestsUI();
    }

    getBountyProgress(bounty) {
      if (!bounty) return { current: 0, target: 1, isReady: false };
      const curTotal = this.getQuestObjectiveValue(bounty.type);
      const progress = Math.max(0, Math.min(bounty.delta, curTotal - (bounty.baseline || 0)));
      return {
        current: progress,
        target: bounty.delta,
        isReady: progress >= bounty.delta
      };
    }

    claimBounty(bountyUid) {
      if (!Array.isArray(this.player.bounties)) return false;
      const idx = this.player.bounties.findIndex(b => b.uid === bountyUid);
      if (idx === -1) return false;
      const b = this.player.bounties[idx];
      const progInfo = this.getBountyProgress(b);
      if (!progInfo.isReady) {
        this.showToast(`懸賞令進度尚未完成 (${progInfo.current} / ${progInfo.target})！`, 'warning');
        return false;
      }

      if (b.reward.gold) this.player.gold += b.reward.gold;
      if (b.reward.iron) this.player.iron += b.reward.iron;
      if (b.reward.souls) this.player.souls += b.reward.souls;

      this.player.bountyCompletedCount = (this.player.bountyCompletedCount || 0) + 1;
      this.player.statsTracked.bountiesCompleted = (this.player.statsTracked.bountiesCompleted || 0) + 1;

      if (window.generateProceduralBounty) {
        const nextBountyLvl = (this.player.bountyCompletedCount || 0) + idx + 1;
        const curAbyss = (this.player.abyss && this.player.abyss.maxFloor) || 0;
        this.player.bounties[idx] = window.generateProceduralBounty(nextBountyLvl, this.player.statsTracked, curAbyss);
      }

      if (this.audio) this.audio.playCoinSound();
      this.showToast(`🎯 完成幕府懸賞【${b.title}】！已自動派發新懸賞令！`, 'success');
      this.updateHeaderUI();
      this.renderQuestsUI();
      this.save();
      return true;
    }

    /**
     * 更新戰鬥頁面上方的「當前主線任務追蹤橫幅」
     */
    updateActiveQuestTracker() {
      const trackerEl = document.getElementById('active-quest-tracker');
      if (!trackerEl) return;

      const mq = this.getCurrentMainQuest();
      if (!mq) {
        trackerEl.innerHTML = `
          <div class="quest-tracker-left">
            <span class="quest-tracker-badge">📜 主線全通關</span>
            <span class="quest-tracker-title">👑 八卷史詩主線全數通關！</span>
            <span class="quest-tracker-prog">前往【武道＆奈落】挑戰千層深淵與天梯大名</span>
          </div>
          <div class="quest-tracker-right">
            <button class="btn btn-gold btn-sm" onclick="window.game.switchTab('pvp')">🏆 前往奈落</button>
          </div>
        `;
        return;
      }

      const objTexts = (mq.objectives || []).map(obj => {
        const val = Math.min(obj.target, this.getQuestObjectiveValue(obj.type));
        return `${obj.label}: ${val}/${obj.target}`;
      });
      const isReady = this.isMainQuestReady(mq);

      trackerEl.innerHTML = `
        <div class="quest-tracker-left">
          <span class="quest-tracker-badge">📜 ${mq.volume}</span>
          <span class="quest-tracker-title">${mq.title}</span>
          <span class="quest-tracker-prog">🎯 ${objTexts.join(' ｜ ')}</span>
        </div>
        <div class="quest-tracker-right">
          ${isReady
            ? `<button class="btn btn-gold btn-sm pulse-claim-btn" onclick="window.game.claimMainQuest()">
                 🎁 領取獎勵${mq.reward.unlockAutomationTier ? ' (解鎖自動!)' : ''}
               </button>`
            : `<button class="btn btn-outline btn-sm" onclick="window.game.switchTab('quests')">
                 📜 任務詳情
               </button>`}
        </div>
      `;
    }

    /**
     * 渲染【📜 任務＆劇情】分頁
     */
    renderQuestsUI() {
      // 1. 渲染 4 階自動劍心進度卡片
      const autoGrid = document.getElementById('quest-automation-overview');
      if (autoGrid && window.AUTOMATION_TIERS) {
        const curTier = this.player.automationTier || 0;
        autoGrid.innerHTML = Object.values(window.AUTOMATION_TIERS).map(t => {
          const isUnlocked = curTier >= t.tier;
          const isCurrent = curTier === t.tier;
          return `
            <div class="auto-tier-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current-tier' : ''}">
              <div class="auto-tier-header">
                <div>
                  <div class="auto-tier-name">${t.name}</div>
                  <div class="auto-tier-req">${isUnlocked ? '✅ 已領悟' : t.badge}</div>
                </div>
              </div>
              <div class="auto-tier-desc">${t.desc}</div>
            </div>
          `;
        }).join('');
      }

      // 2. 渲染主線任務列表
      const mqContainer = document.getElementById('main-quests-container');
      const mqBadge = document.getElementById('main-quest-progress-badge');
      if (mqBadge && window.MAIN_QUESTS) {
        const idx = Math.min(window.MAIN_QUESTS.length, this.player.mainQuestIndex || 0);
        mqBadge.innerText = `${idx} / ${window.MAIN_QUESTS.length}`;
      }

      if (mqContainer && window.MAIN_QUESTS) {
        const curIdx = this.player.mainQuestIndex || 0;
        const slice = window.MAIN_QUESTS.slice(curIdx, curIdx + 4);
        if (slice.length === 0) {
          mqContainer.innerHTML = `
            <div class="quest-complete-banner">
              🎊 恭喜您已完成《戰國百鬼繪卷》全 30 章史詩主線任務！您的傳奇將永遠銘刻於武道之巔！
            </div>
          `;
        } else {
          mqContainer.innerHTML = `<div class="quests-list-grid">` + slice.map((mq, i) => {
            const isCurrent = i === 0;
            const isReady = isCurrent && this.isMainQuestReady(mq);
            const objsHtml = (mq.objectives || []).map(obj => {
              const curVal = Math.min(obj.target, this.getQuestObjectiveValue(obj.type));
              const pct = Math.min(100, Math.round((curVal / obj.target) * 100));
              return `
                <div style="margin-bottom: 6px;">
                  <div class="quest-obj-text">🎯 ${obj.label}：${curVal.toLocaleString()} / ${obj.target.toLocaleString()}</div>
                  <div class="quest-prog-bar-bg">
                    <div class="quest-prog-bar-fill" style="width: ${pct}%;"></div>
                  </div>
                </div>
              `;
            }).join('');

            return `
              <div class="quest-card ${isCurrent ? 'active-main-quest' : 'upcoming-quest'}">
                <div class="quest-card-top">
                  <div>
                    <span class="quest-chapter-tag">${mq.volume}</span>
                    <h4 class="quest-title">${mq.title}</h4>
                  </div>
                  <span class="quest-npc-badge">${mq.npcIcon || '⛩️'} ${mq.npc}</span>
                </div>
                <p class="quest-dialogue">${mq.storyText}</p>
                <div class="quest-objective-box">
                  ${objsHtml}
                </div>
                <div class="quest-footer">
                  <div class="quest-rewards-tags">
                    <span class="rw-tag rw-highlight">${mq.reward.rewardText || '豐厚犒賞'}</span>
                  </div>
                  <div class="quest-action">
                    ${isCurrent
                      ? (isReady
                          ? `<button class="btn btn-gold btn-sm" onclick="window.game.claimMainQuest()">🎁 完成並領取獎勵</button>`
                          : `<button class="btn btn-outline btn-sm" onclick="window.game.switchTab('battle')">⚔️ 前往執行</button>`)
                      : `<span class="badge-locked">⏳ 完成前置主線後解鎖</span>`}
                  </div>
                </div>
              </div>
            `;
          }).join('') + `</div>`;
        }
      }

      // 3. 渲染幕府無限討伐懸賞令
      const bountyContainer = document.getElementById('bounty-quests-container');
      if (bountyContainer && Array.isArray(this.player.bounties)) {
        bountyContainer.innerHTML = this.player.bounties.map(b => {
          const prog = this.getBountyProgress(b);
          return `
            <div class="quest-card bounty-card">
              <div class="quest-card-top">
                <h4 class="quest-title">${b.icon} ${b.title}</h4>
              </div>
              <div class="quest-obj-text" style="margin: 6px 0;">
                🎯 ${b.desc}：<strong>${prog.current} / ${prog.target}</strong>
              </div>
              <div class="quest-footer">
                <div class="quest-rewards-tags">
                  <span class="rw-tag">💰 +${b.reward.gold.toLocaleString()}</span>
                  <span class="rw-tag">🪨 玉鋼 +${b.reward.iron}</span>
                  <span class="rw-tag">🔮 魂玉 +${b.reward.souls}</span>
                </div>
                ${prog.isReady
                  ? `<button class="btn btn-gold btn-sm" onclick="window.game.claimBounty('${b.uid}')">🎁 領賞並派發新令</button>`
                  : `<span class="badge-locked">討伐進行中</span>`}
              </div>
            </div>
          `;
        }).join('');
      }

      // 4. 渲染支線奇譚
      const sqContainer = document.getElementById('side-quests-container');
      const sqBadge = document.getElementById('side-quest-progress-badge');
      const claimedMap = this.player.claimedSideQuests || {};
      if (sqBadge && window.SIDE_QUESTS) {
        const doneCount = Object.keys(claimedMap).filter(k => claimedMap[k]).length;
        sqBadge.innerText = `${doneCount} / ${window.SIDE_QUESTS.length}`;
      }
      if (sqContainer && window.SIDE_QUESTS) {
        sqContainer.innerHTML = window.SIDE_QUESTS.map(sq => {
          const isClaimed = Boolean(claimedMap[sq.id]);
          const curVal = Math.min(sq.target, this.getQuestObjectiveValue(sq.objType));
          const isReady = !isClaimed && curVal >= sq.target;
          return `
            <div class="quest-card side-quest-card ${isClaimed ? 'claimed-quest' : ''}">
              <div class="quest-card-top">
                <h4 class="quest-title">${sq.icon || '🌸'} ${sq.title}</h4>
                <span class="quest-npc-badge">🗣️ ${sq.npc}</span>
              </div>
              <p class="quest-dialogue">${sq.story || sq.desc}</p>
              <div class="quest-obj-text">🎯 ${sq.desc} (${curVal.toLocaleString()} / ${sq.target.toLocaleString()})</div>
              <div class="quest-footer">
                <div class="quest-rewards-tags">
                  <span class="rw-tag rw-highlight">🎁 ${sq.reward.text || '支線秘寶'}</span>
                </div>
                ${isClaimed
                  ? `<span class="badge-completed">✅ 已完成</span>`
                  : (isReady
                      ? `<button class="btn btn-gold btn-sm" onclick="window.game.claimSideQuest('${sq.id}')">🎁 領取獎勵</button>`
                      : `<span class="badge-locked">進行中</span>`)}
              </div>
            </div>
          `;
        }).join('');
      }

      // 5. 渲染《戰國百鬼繪卷》已解鎖劇情回顧
      const chronContainer = document.getElementById('story-chronicle-container');
      if (chronContainer) {
        const list = this.player.unlockedChronicles || [];
        if (list.length === 0) {
          chronContainer.innerHTML = `<div style="color: var(--text-muted); padding: 12px;">完成主線任務後，將自動收錄八卷戰國史詩篇章於此繪卷中。</div>`;
        } else {
          chronContainer.innerHTML = `<div class="chronicle-box">` + list.map(item => `
            <div class="chronicle-entry-card" onclick="window.game.openStoryCutsceneModal('${item.chapter}', '${item.title}', '${item.npc}', \`${(item.text || '').replace(/`/g, '')}\`)">
              <div class="chronicle-chapter">${item.chapter}</div>
              <div class="chronicle-title">📖 ${item.title}</div>
              <div class="chronicle-npc">講述者：${item.npc} (點擊重溫劇情)</div>
            </div>
          `).join('') + `</div>`;
        }
      }
    }

    openStoryCutsceneModal(chapter, title, npc, dialogueText) {
      const modal = document.getElementById('story-cutscene-modal');
      if (!modal) return;
      const titleEl = document.getElementById('story-modal-title');
      const bodyEl = document.getElementById('story-modal-body');

      if (titleEl) titleEl.innerText = `📜 ${chapter || '《戰國百鬼繪卷》'} — ${title || '史詩篇章'}`;
      if (bodyEl) {
        bodyEl.innerHTML = `
          <div style="font-weight: 800; color: var(--gold-accent); margin-bottom: 8px; font-size: 1.05rem;">
            ${npc || '⛩️ 出雲巫女・阿國'}
          </div>
          <div style="white-space: pre-line; line-height: 1.65; color: var(--text-main); font-size: 0.96rem;">
            ${dialogueText || ''}
          </div>
        `;
      }

      modal.style.display = 'flex';
    }

    closeStoryCutsceneModal() {
      const modal = document.getElementById('story-cutscene-modal');
      if (modal) modal.style.display = 'none';
      if (this.audio) this.audio.playCoinSound();
    }

    closeStoryModal() {
      this.closeStoryCutsceneModal();
    }

    /**
     * ==================== 6. 五輪書架勢、12式武道奧義與天賦系統 ====================
     */
    selectStance(stanceId) {
      if (!window.FIVE_RINGS_STANCES || !window.FIVE_RINGS_STANCES[stanceId]) return;
      this.player.stance = stanceId;
      const st = window.FIVE_RINGS_STANCES[stanceId];
      if (this.audio) this.audio.playEquipSound();
      this.showToast(`☯️ 已切換五輪架勢為【${st.icon} ${st.name}】！${st.counterDesc}`, 'success');
      this.renderTalentsUI();
      this.updateHeaderUI();
      this.updateBattleUI();
      if (this.activeTab === 'pvp') this.renderPvPAndAbyssUI();
      this.save();
    }

    toggleEquipArt(artId) {
      if (!window.SAMURAI_ARTS) return;
      const art = window.SAMURAI_ARTS.find(a => a.id === artId);
      if (!art) return;
      const reqLvl = art.reqLevel || 1;
      if (this.player.level < reqLvl) {
        this.showToast(`🔒 需要等級 Lv.${reqLvl} 方可領悟【${art.name}】！`, 'warning');
        return;
      }

      if (!Array.isArray(this.player.equippedArts)) this.player.equippedArts = [];
      const idx = this.player.equippedArts.indexOf(artId);
      if (idx !== -1) {
        if (this.player.equippedArts.length <= 1) {
          this.showToast(`至少需保留 1 招武學奧義！`, 'warning');
          return;
        }
        this.player.equippedArts.splice(idx, 1);
        this.showToast(`已卸下奧義【${art.name}】`, 'info');
      } else {
        if (this.player.equippedArts.length >= 3) {
          this.player.equippedArts.shift();
        }
        this.player.equippedArts.push(artId);
        this.showToast(`🔥 已配置武學奧義【${art.name}】！`, 'success');
      }

      if (this.audio) this.audio.playEquipSound();
      this.renderTalentsUI();
      if (this.activeTab === 'pvp') this.renderPvPAndAbyssUI();
      this.save();
    }

    addTalentPoint(talentId) {
      if (this.player.talentPoints <= 0) {
        this.showToast(`天賦點數不足！請先升級或完成支線奇譚獲得點數`, 'warning');
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

    switchClass(classId) {
      if (!window.SAMURAI_CLASSES[classId]) return;
      this.player.classId = classId;
      const cls = window.SAMURAI_CLASSES[classId];
      this.showToast(`已切換為【${cls.name}】流派！`, 'success');
      this.renderTalentsUI();
      this.updateHeaderUI();
    }

    /**
     * ==================== 7. 天下第一武道大會 (PvP) 與 無間奈落千層深淵 ====================
     */
    refreshPvPOpponents(silent = false) {
      if (!window.generatePvPOpponents) return;
      const stats = this.getCalculatedStats();
      this.player.pvp.opponents = window.generatePvPOpponents(
        stats.power,
        this.player.level,
        this.player.pvp.rating || 1000
      );
      if (!silent) {
        if (this.audio) this.audio.playEquipSound();
        this.showToast(`🔄 已重新搜尋 3 名武道天梯對手！可觀察其五輪架勢進行相剋配置！`, 'info');
        this.renderPvPAndAbyssUI();
      }
    }

    challengePvPOpponent(oppIdx) {
      if (!window.simulateSamuraiDuel || !this.player.pvp || !this.player.pvp.opponents[oppIdx]) return null;
      const opp = this.player.pvp.opponents[oppIdx];
      const stats = this.getCalculatedStats();

      const duelResult = window.simulateSamuraiDuel(
        {
          name: this.player.name,
          stance: this.player.stance || 'earth',
          equippedArts: this.player.equippedArts || ['art_tsubame'],
          stats
        },
        opp
      );

      const won = Boolean(duelResult.isWin);
      this.player.pvp.lastLog = duelResult.log || [];

      if (won) {
        this.player.pvp.wins = (this.player.pvp.wins || 0) + 1;
        this.player.pvp.streak = (this.player.pvp.streak || 0) + 1;
        this.player.statsTracked.pvpWins = (this.player.statsTracked.pvpWins || 0) + 1;

        const ratingGain = opp.ratingGain || 25;
        this.player.pvp.rating = (this.player.pvp.rating || 1000) + ratingGain;

        const goldPrize = opp.rewardGold || (600 + this.player.level * 120);
        const soulsPrize = opp.rewardSouls || (5 + Math.floor(this.player.level / 4));
        this.player.gold += goldPrize;
        this.player.souls += soulsPrize;

        if (this.audio) this.audio.playAchievementFanfare();
        this.showToast(`🏆 武道會戰勝【${opp.name}】！積分 +${ratingGain}，獲得金幣 +${goldPrize.toLocaleString()}、魂玉 +${soulsPrize}！`, 'success');
      } else {
        this.player.pvp.losses = (this.player.pvp.losses || 0) + 1;
        this.player.pvp.streak = 0;
        this.player.pvp.rating = Math.max(800, (this.player.pvp.rating || 1000) - 12);

        if (this.audio) this.audio.playSlashSound(false);
        this.showToast(`⚔️ 惜敗於【${opp.name}】！建議切換克制對手的五輪架勢再戰！`, 'warning');
      }

      this.refreshPvPOpponents(true);
      this.updateHeaderUI();
      this.updateActiveQuestTracker();
      this.renderPvPAndAbyssUI();
      this.save();
      return { ...duelResult, won };
    }

    /**
     * 匯出跨玩家 PvP 武道切磋碼（100% 零伺服器帳單的真人 Build 對戰分享機制）
     */
    exportPvPDuelCode() {
      const stats = this.getCalculatedStats();
      const payload = {
        name: this.player.name,
        title: this.player.cosmetics.title || '無雙劍豪',
        level: this.player.level,
        classId: this.player.classId,
        stance: this.player.stance || 'earth',
         arts: this.player.equippedArts || ['art_tsubame'],
        power: stats.power,
        stats: {
          atk: stats.atk,
          def: stats.def,
          maxHp: stats.maxHp,
          critRate: stats.critRate,
          critDmg: stats.critDmg,
          lifeSteal: stats.lifeSteal,
          thornsPct: stats.thornsPct,
          evasion: stats.evasion
        }
      };
      const code = 'DUEL_' + btoa(encodeURIComponent(JSON.stringify(payload)));
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(() => {
          this.showToast(`📋 您的【武道切磋碼】已複製！可貼給好友或聊天室進行跨玩家對決！`, 'success');
        }).catch(() => {
          prompt('請複製您的武道切磋碼分享給好友：', code);
        });
      }
      return code;
    }

    /**
     * 貼上其他玩家的武道切磋碼進行真人 Build 對決
     */
    importAndDuelPvPCode(rawCodeInput) {
      const raw = rawCodeInput || prompt('請貼上其他玩家的【武道切磋碼 (DUEL_...)】：');
      if (!raw) return null;
      try {
        const clean = raw.trim().replace(/^DUEL_/, '');
        const parsed = JSON.parse(decodeURIComponent(atob(clean)));
        if (!parsed || !parsed.stats) throw new Error('Invalid duel code');

        const myStats = this.getCalculatedStats();
        const duelResult = window.simulateSamuraiDuel(
          {
            name: this.player.name,
            stance: this.player.stance || 'earth',
            equippedArts: this.player.equippedArts || ['art_tsubame'],
            stats: myStats
          },
          {
            name: parsed.name || '神秘劍客',
            title: parsed.title || '跨服挑戰者',
            stance: parsed.stance || 'fire',
            arts: parsed.arts || parsed.equippedArts || ['art_tsubame'],
            stats: {
              ...parsed.stats,
              maxHp: parsed.stats.maxHp || parsed.stats.hp || 1000
            }
          }
        );

        const won = Boolean(duelResult.isWin);
        this.player.pvp.lastLog = duelResult.log || [];
        this.renderPvPAndAbyssUI();
        this.showToast(
          won
            ? `🎉 跨玩家切磋擊敗了【${parsed.name}】！您的流派配裝更勝一籌！`
            : `⚔️ 與【${parsed.name}】切磋惜敗！可查看下方對戰紀錄調整五輪架勢！`,
          won ? 'success' : 'warning'
        );
        return { ...duelResult, won };
      } catch (e) {
        this.showToast(`切磋碼格式無效！請確認以 DUEL_ 開頭`, 'error');
        return null;
      }
    }

    /**
     * 挑戰【無間奈落・千層深淵】(1 ~ 1000+ 層無限終局爬塔)
     */
    challengeAbyssFloor() {
      if (!window.getAbyssFloorData || !window.simulateSamuraiDuel) return null;
      if (!this.player.abyss) this.player.abyss = { floor: 1, maxFloor: 0 };

      const curFloor = this.player.abyss.floor || 1;
      const floorData = window.getAbyssFloorData(curFloor);
      const myStats = this.getCalculatedStats();

      // 找出魔將所使用的架勢（為推薦克制架勢所克制的對象）
      const recStanceObj = (window.FIVE_RINGS_STANCES && window.FIVE_RINGS_STANCES[floorData.recommendedStanceId]) || window.FIVE_RINGS_STANCES.earth;
      const bossStanceId = recStanceObj.counters || 'fire';

      const duelResult = window.simulateSamuraiDuel(
        {
          name: this.player.name,
          stance: this.player.stance || 'earth',
          equippedArts: this.player.equippedArts || ['art_tsubame'],
          stats: myStats
        },
        {
          name: floorData.name,
          title: `奈落第 ${curFloor} 層魔將`,
          stance: bossStanceId,
          arts: ['art_orochi', 'art_muramasa'],
          stats: floorData.stats
        }
      );

      const won = Boolean(duelResult.isWin);
      this.player.pvp.lastLog = duelResult.log || [];

      if (won) {
        const rw = floorData.rewards;
        this.player.gold += rw.gold;
        this.player.iron += rw.iron;
        this.player.souls += rw.souls;
        if (rw.exp) this.addExp(rw.exp);

        if (rw.guaranteedLegendary && window.generateGear) {
          const dropQ = curFloor >= 35 ? 'ancient' : 'legendary';
          const abyssGear = window.generateGear(null, dropQ, Math.max(this.player.level, curFloor));
          this.addGearToInventory(abyssGear);
          this.triggerLootBeam(abyssGear);
        }

        this.player.abyss.maxFloor = Math.max(this.player.abyss.maxFloor || 0, curFloor);
        this.player.abyss.floor = curFloor + 1;

        if (this.audio) this.audio.playAchievementFanfare();
        this.showToast(`🌌 成功突破【無間奈落 第 ${curFloor} 層】！獲得金幣 +${rw.gold.toLocaleString()}、魂玉 +${rw.souls}！`, 'success');
      } else {
        if (this.audio) this.audio.playSlashSound(false);
        this.showToast(`💀 奈落第 ${curFloor} 層挑戰失敗！建議切換為【${floorData.recommendedStanceName}】或強化神兵後再戰！`, 'warning');
      }

      this.updateHeaderUI();
      this.updateActiveQuestTracker();
      this.renderPvPAndAbyssUI();
      this.save();
      return { ...duelResult, won };
    }

    renderPvPAndAbyssUI() {
      if (!this.player.pvp) this.ensureBountiesAndPvP();
      const pvp = this.player.pvp;
      const rankTier = window.getPvPRankTier ? window.getPvPRankTier(pvp.rating || 1000) : { name: '新選組隊士', icon: '🥉', color: '#94a3b8' };
      const curStance = (window.FIVE_RINGS_STANCES && window.FIVE_RINGS_STANCES[this.player.stance]) || { name: '地之卷', shortName: '地之卷', icon: '🌍' };

      const pvpHeaderStatus = document.getElementById('pvp-header-status');
      if (pvpHeaderStatus) {
        pvpHeaderStatus.innerHTML = `
          <div class="pvp-stat-box">
            <div class="pvp-stat-label">段位稱號</div>
            <div class="pvp-stat-value" id="pvp-rank-badge" style="color: ${rankTier.color};">${rankTier.icon} ${rankTier.name}</div>
          </div>
          <div class="pvp-stat-box">
            <div class="pvp-stat-label">武道積分</div>
            <div class="pvp-stat-value" id="pvp-rating-val">${(pvp.rating || 1000).toLocaleString()} 分</div>
          </div>
          <div class="pvp-stat-box">
            <div class="pvp-stat-label">生涯戰績</div>
            <div class="pvp-stat-value" id="pvp-record-val">${pvp.wins || 0}勝 ${pvp.losses || 0}敗 (${pvp.streak || 0}連勝)</div>
          </div>
          <div class="pvp-stat-box" style="display: flex; flex-direction: column; justify-content: space-between; gap: 4px;">
            <div>
              <div class="pvp-stat-label">出戰五輪架勢</div>
              <div class="pvp-stat-value" id="pvp-current-stance-val">${curStance.icon} ${curStance.shortName || curStance.name}</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="window.game.refreshPvPOpponents()">🔄 刷新對手</button>
          </div>
        `;
      }

      // 渲染 3 位天梯對手卡片
      const oppGrid = document.getElementById('pvp-opponents-grid');
      if (oppGrid && Array.isArray(pvp.opponents)) {
        oppGrid.innerHTML = pvp.opponents.map((opp, idx) => {
          const oppStance = (window.FIVE_RINGS_STANCES && window.FIVE_RINGS_STANCES[opp.stance]) || { name: '火之卷', shortName: '火之卷', icon: '🔥' };
          const oppCls = (window.SAMURAI_CLASSES && window.SAMURAI_CLASSES[opp.classId]) || { name: '劍聖', icon: '⚔️' };
          const isCountering = curStance.counters === opp.stance;
          const isCountered = oppStance.counters === this.player.stance;

          return `
            <div class="pvp-opp-card ${isCountering ? 'stance-advantage' : ''}">
              <div class="pvp-opp-header">
                <span class="pvp-opp-avatar">${opp.avatar}</span>
                <div>
                  <div class="pvp-opp-name">${opp.name} <span class="pvp-opp-lvl">Lv.${opp.level}</span></div>
                  <div class="pvp-opp-title">【${opp.title}】${oppCls.icon}${oppCls.name}</div>
                </div>
              </div>
              <div class="pvp-opp-meta">
                <div style="color: var(--gold-accent); font-weight: 700;">${opp.buildTag || ''}</div>
                <div>⚡ 綜合戰力：<strong>${opp.power.toLocaleString()}</strong></div>
                <div>☯️ 對手架勢：<strong>${oppStance.icon} ${oppStance.name}</strong></div>
                <div class="stance-matchup-tag ${isCountering ? 'tag-win' : (isCountered ? 'tag-lose' : 'tag-even')}">
                  ${isCountering ? '✨ 您的架勢克制對手 (+30%傷害)' : (isCountered ? '⚠️ 被對手架勢克制 (建議切換架勢)' : '⚖️ 架勢平手')}
                </div>
              </div>
              <button class="btn btn-crimson btn-block" onclick="window.game.challengePvPOpponent(${idx})">
                ⚔️ 拔刀對決 (+${opp.ratingGain || 25}分)
              </button>
            </div>
          `;
        }).join('');
      }

      // 渲染對戰紀錄與跨玩家切磋碼按鈕
      const logBox = document.getElementById('pvp-battle-log-box');
      if (logBox) {
        const logs = pvp.lastLog || [];
        logBox.innerHTML = `
          <div class="pvp-code-toolbar">
            <button class="btn btn-outline btn-sm" onclick="window.game.exportPvPDuelCode()">📤 複製我的武道切磋碼</button>
            <button class="btn btn-gold btn-sm" onclick="window.game.importAndDuelPvPCode()">📥 輸入好友切磋碼對決</button>
          </div>
          <div class="pvp-log-lines">
            ${logs.length === 0
              ? '<div style="color: var(--text-muted);">點擊上方「⚔️ 拔刀對決」或輸入好友切磋碼，此處將顯示逐回合招式與五輪架勢交鋒實況！</div>'
              : logs.map(line => `<div class="pvp-log-item">${line}</div>`).join('')}
          </div>
        `;
      }

      // 渲染無間奈落千層深淵
      const abyssBadge = document.getElementById('abyss-floor-badge');
      const abyssContainer = document.getElementById('abyss-rift-container');
      const curFloor = (this.player.abyss && this.player.abyss.floor) || 1;
      if (abyssBadge) abyssBadge.innerText = `第 ${curFloor} 層 / 1000 層`;

      if (abyssContainer && window.getAbyssFloorData) {
        const fd = window.getAbyssFloorData(curFloor);
        abyssContainer.innerHTML = `
          <div class="abyss-boss-card">
            <div class="abyss-boss-info">
              <div class="abyss-floor-title">🌌 無間奈落・第 ${fd.floor} 層守門魔將</div>
              <h3 class="abyss-boss-name">${fd.avatar} ${fd.name}</h3>
              <div class="abyss-affixes">
                <span class="affix-pill">🔥 詞綴：${fd.affixName} — ${fd.affixDesc}</span>
              </div>
              <div class="abyss-recommend">
                💡 戰術建議：切換為【<strong>${fd.recommendedStanceName}</strong>】可觸發五輪相剋 (+30% 傷害、-20% 受傷)！
                <button class="btn btn-outline btn-sm" onclick="window.game.selectStance('${fd.recommendedStanceId}')">
                  ⚡ 一鍵切換為克制架勢
                </button>
              </div>
              <div class="abyss-rewards-preview">
                🎁 通關犒賞：💰 ${fd.rewards.gold.toLocaleString()} 兩 | 🪨 玉鋼 x${fd.rewards.iron} | 🔮 魂玉 x${fd.rewards.souls}
                ${fd.rewards.guaranteedLegendary ? ' | 🌟 <strong>必掉傳奇/太古神兵！</strong>' : ''}
              </div>
            </div>
            <div class="abyss-boss-action">
              <div class="abyss-power-req">推薦戰力：${fd.recommendedPower.toLocaleString()}</div>
              <button class="btn btn-gold btn-xl" onclick="window.game.challengeAbyssFloor()">
                🌌 闖入奈落第 ${fd.floor} 層
              </button>
            </div>
          </div>
        `;
      }
    }

    /**
     * ==================== 8. 暗黑3式成就、簽到與離線收益 ====================
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

    processOfflineProgress() {
      const now = Date.now();
      const last = this.player.lastSaveTime || now;
      const elapsedSeconds = Math.floor((now - last) / 1000);

      if (elapsedSeconds < 60) return;

      const calcSeconds = Math.min(43200, elapsedSeconds);
      const stats = this.getCalculatedStats();
      const killsPerMin = Math.max(10, Math.min(60, Math.round(stats.power / 80)));
      const totalOfflineKills = Math.round((calcSeconds / 60) * killsPerMin);

      const expGain = totalOfflineKills * 12;
      const goldGain = totalOfflineKills * 8;
      const ironGain = Math.round(totalOfflineKills * 0.4);

      this.player.gold += goldGain;
      this.player.iron += ironGain;
      this.addExp(expGain);
      this.player.statsTracked.totalKills += totalOfflineKills;

      const bonusGears = [];
      const bonusCount = Math.min(3, Math.max(1, Math.floor(calcSeconds / 3600)));
      if (window.generateGear) {
        for (let i = 0; i < bonusCount; i++) {
          const g = window.generateGear(null, 'epic', this.player.level);
          this.addGearToInventory(g);
          bonusGears.push(g.name);
        }
      }

      const modal = document.getElementById('offline-modal');
      const body = document.getElementById('offline-modal-body');
      if (modal && body) {
        const hrs = Math.floor(calcSeconds / 3600);
        const mins = Math.floor((calcSeconds % 3600) / 60);
        body.innerHTML = `
          <div style="font-size: 1.05rem; margin-bottom: 14px;">
            您已離線修煉了 <strong>${hrs} 小時 ${mins} 分鐘</strong>！<br>
            您的武士與式神在常世狹縫中自動斬妖除魔，累積了豐厚戰果：
          </div>
          <div class="offline-stat-grid">
            <div class="offline-stat-box">⚔️ 討伐妖怪: <strong>${totalOfflineKills.toLocaleString()}</strong> 隻</div>
            <div class="offline-stat-box">📈 獲得修為: <strong>+${expGain.toLocaleString()}</strong> EXP</div>
            <div class="offline-stat-box">💰 獲得金幣: <strong>+${goldGain.toLocaleString()}</strong> 兩</div>
            <div class="offline-stat-box">🪨 採集玉鋼: <strong>+${ironGain}</strong> 塊</div>
          </div>
          ${bonusGears.length > 0 ? `
            <div style="margin-top: 14px; color: var(--gold-accent);">
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

    triggerLootBeam(gear) {
      const beamEl = document.getElementById('loot-beam-overlay');
      if (!beamEl) return;
      beamEl.style.display = 'block';
      beamEl.style.borderColor = gear.beamColor || '#fb923c';
      setTimeout(() => {
        beamEl.style.display = 'none';
      }, 1500);
    }

    showDamageText(text, isCrit, isHeal) {
      const container = document.getElementById('battle-damage-layer');
      if (!container) return;

      const span = document.createElement('div');
      span.className = `floating-dmg ${isCrit ? 'dmg-crit' : ''} ${isHeal ? 'dmg-heal' : ''}`;
      span.innerText = isCrit && typeof text === 'number' ? `💥 ${text}!` : text;

      span.style.left = `${45 + (Math.random() * 20 - 10)}%`;
      span.style.top = `${40 + (Math.random() * 20 - 10)}%`;

      container.appendChild(span);
      setTimeout(() => {
        if (span.parentNode) span.parentNode.removeChild(span);
      }, 800);
    }

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

    switchTab(tabKey) {
      const tabs = ['battle', 'quests', 'gear', 'talents', 'pvp', 'market', 'achievements'];
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

      if (tabKey === 'battle') {
        this.updateBattleUI();
        this.updateActiveQuestTracker();
      } else if (tabKey === 'quests') {
        this.renderQuestsUI();
      } else if (tabKey === 'gear') {
        this.renderGearUI();
      } else if (tabKey === 'talents') {
        this.renderTalentsUI();
      } else if (tabKey === 'pvp') {
        this.renderPvPAndAbyssUI();
      } else if (tabKey === 'market' && this.marketChat) {
        this.marketChat.renderMarketUI();
        this.marketChat.renderChatUI();
      } else if (tabKey === 'achievements') {
        this.renderAchievementsUI();
        this.renderDailySignInUI();
      }
    }

    setCosmetic(type, value) {
      if (!this.player.cosmetics) this.player.cosmetics = {};
      this.player.cosmetics[type] = value;
      this.updateHeaderUI();
      this.renderGearUI();
      this.showToast(`外觀造型已套用！`, 'success');
    }

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
     * 渲染戰鬥畫面、主城切換與自動劍心狀態列
     */
    updateBattleUI() {
      const townPane = document.getElementById('town-hub-view');
      const combatPane = document.getElementById('combat-field-view');
      const actTitle = document.getElementById('current-act-title');
      const actProgressText = document.getElementById('act-progress-text');

      const tier = this.player.automationTier || 0;
      const tierMeta = (window.AUTOMATION_TIERS && window.AUTOMATION_TIERS[tier]) || { name: '凡骨拔刀（手動修煉）', badge: '🔒 尚未領悟自動劍意', intervalMs: 0 };
      const autoStatusBar = document.getElementById('automation-status-bar');
      if (autoStatusBar) {
        let btnText = `🔒 自動揮刀 (完成M01主線解鎖)`;
        let btnClass = 'btn btn-outline btn-sm';
        if (tier > 0) {
          if (this.player.autoSlashEnabled) {
            btnText = `🤖 自動揮刀：開啟中 (${(tierMeta.intervalMs / 1000).toFixed(2)}s/斬)`;
            btnClass = 'btn btn-gold btn-sm';
          } else {
            btnText = `✋ 自動揮刀：已暫停 (點擊啟動)`;
            btnClass = 'btn btn-outline btn-sm';
          }
        }
        autoStatusBar.innerHTML = `
          <div class="auto-tier-badge" id="auto-tier-label">⚙️ 自動境界：${tierMeta.name}</div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button id="btn-toggle-auto" class="${btnClass}" onclick="window.game.toggleAutoSlash()">${btnText}</button>
            <button class="btn btn-outline btn-sm" onclick="window.game.switchTab('quests')">📜 任務修煉</button>
          </div>
        `;
      }

      this.updateActiveQuestTracker();

      if (this.player.inTown) {
        if (townPane) townPane.style.display = 'flex';
        if (combatPane) combatPane.style.display = 'none';
        if (actTitle) actTitle.innerText = `🏯 京都・新選本陣（主城安全區）`;
        if (actProgressText) {
          const hasBuff = (this.player.townBuffUntil || 0) > Date.now();
          actProgressText.innerText = hasBuff ? `⛩️ 出雲武運祝福生效中 (+15% 攻擊)` : `🕯️ 篝火安全休息中`;
        }
        return;
      }

      if (townPane) townPane.style.display = 'none';
      if (combatPane) combatPane.style.display = 'flex';

      if (!this.currentEnemy) return;
      const nameEl = document.getElementById('enemy-name');
      const avatarEl = document.getElementById('enemy-avatar');

      const actIndex = Math.max(0, Math.min(6, (this.player.act || 1) - 1));
      const actData = window.CAMPAIGN_ACTS[actIndex];

      if (actTitle && actData) actTitle.innerText = `${actData.mapIcon || '⚔️'} ${actData.name} - ${actData.subtitle}`;
      if (actProgressText && actData) {
        actProgressText.innerText = this.player.actBossUnlocked
          ? `⚠️ 首領決戰中！`
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

      const chkCommon = document.getElementById('check-auto-white') || document.getElementById('chk-auto-common');
      const chkMagic = document.getElementById('check-auto-blue') || document.getElementById('chk-auto-magic');
      const chkRare = document.getElementById('chk-auto-rare');
      if (chkCommon) chkCommon.checked = Boolean(this.player.settings.autoDecomposeCommon);
      if (chkMagic) chkMagic.checked = Boolean(this.player.settings.autoDecomposeMagic);
      if (chkRare) chkRare.checked = Boolean(this.player.settings.autoDecomposeRare);

      const invContainer = document.getElementById('inventory-grid');
      const invCount = document.getElementById('inventory-count-badge');
      if (invCount) invCount.innerText = `${this.player.inventory.length} / 50`;

      if (invContainer) {
        if (this.player.inventory.length === 0) {
          invContainer.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 30px; grid-column: 1 / -1;">
              🎒 行囊空空如也。請至【征戰＆主城】揮刀討伐，掉落神兵將自動存放於此！
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

    renderTalentsUI() {
      // 1. 渲染宮本武藏《五輪書》五輪架勢
      const stanceContainer = document.getElementById('five-rings-stance-container');
      if (stanceContainer && window.FIVE_RINGS_STANCES) {
        stanceContainer.innerHTML = Object.values(window.FIVE_RINGS_STANCES).map(st => {
          const isSelected = this.player.stance === st.id;
          return `
            <button class="stance-card-btn ${isSelected ? 'active' : ''}" onclick="window.game.selectStance('${st.id}')">
              <div class="stance-top">
                <span class="stance-icon">${st.icon}</span>
                <span class="stance-name">${st.name}</span>
              </div>
              <div class="stance-counter">${st.counterDesc}</div>
              <div class="stance-desc">${st.desc}</div>
            </button>
          `;
        }).join('');
      }

      // 2. 渲染 12 式武學奧義 (裝備最多 3 招)
      const artsContainer = document.getElementById('samurai-arts-container');
      const equippedBadge = document.getElementById('equipped-arts-badge');
      const eqList = this.player.equippedArts || [];
      if (equippedBadge) equippedBadge.innerText = `已裝備：${eqList.length} / 3`;

      if (artsContainer && window.SAMURAI_ARTS) {
        artsContainer.innerHTML = `<div class="arts-grid">` + window.SAMURAI_ARTS.map(art => {
          const isEquipped = eqList.includes(art.id);
          const reqLvl = art.reqLevel || 1;
          const isUnlocked = this.player.level >= reqLvl;
          return `
            <div class="art-card ${isEquipped ? 'equipped-art' : ''} ${isUnlocked ? '' : 'locked-art'}"
                 onclick="window.game.toggleEquipArt('${art.id}')">
              <div class="art-card-header">
                <span class="art-icon">${art.icon}</span>
                <div>
                  <div class="art-name">${art.name}</div>
                  <div class="art-meta">【${art.style}】觸發率 ${art.procChance}% | 倍率 ${(art.powerMult * 100).toFixed(0)}%</div>
                </div>
              </div>
              <div class="art-desc">${art.desc}</div>
              <div class="art-status">
                ${isEquipped ? '<span class="art-tag-eq">✅ 已裝備出戰</span>' : (isUnlocked ? '<span class="art-tag-avail">點擊裝備</span>' : `<span class="art-tag-lock">🔒 Lv.${reqLvl} 解鎖</span>`)}
              </div>
            </div>
          `;
        }).join('') + `</div>`;
      }

      // 3. 渲染四大武士流派與天賦樹
      const classSelect = document.getElementById('class-select-container');
      const talentsList = document.getElementById('talents-tree-container');
      const pointsVal = document.getElementById('talent-points-available');

      if (pointsVal) pointsVal.innerText = this.player.talentPoints;

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

    save() {
      this.player.lastSaveTime = Date.now();
      try {
        localStorage.setItem('samurai_resurrected_save', JSON.stringify(this.player));
      } catch (e) {
        console.error('Local save error', e);
      }
    }

    load() {
      try {
        const saved = localStorage.getItem('samurai_resurrected_save');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.player = Object.assign(this.initDefaultPlayer(), parsed);
          return true;
        }
      } catch (e) {
        console.error('Load save error', e);
      }
      return false;
    }

    exportSave() {
      this.save();
      const code = btoa(encodeURIComponent(JSON.stringify(this.player)));
      navigator.clipboard.writeText(code).then(() => {
        this.showToast(`存檔代碼已複製到剪貼簿！`, 'success');
      }).catch(() => {
        prompt('請手動複製存檔代碼：', code);
      });
    }

    importSave() {
      const code = prompt('請貼上存檔代碼：');
      if (!code) return;
      try {
        const json = decodeURIComponent(atob(code.trim()));
        const parsed = JSON.parse(json);
        this.player = Object.assign(this.initDefaultPlayer(), parsed);
        this.player.characterCreated = true;
        this.save();
        this.showToast(`存檔匯入成功！`, 'success');
        location.reload();
      } catch (e) {
        this.showToast(`存檔代碼無效！`, 'error');
      }
    }

    initUI() {
      this.updateHeaderUI();
      this.switchTab('battle');
    }

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
          this.switchTab('quests');
        } else if (e.code === 'Digit3') {
          this.switchTab('gear');
        } else if (e.code === 'Digit4') {
          this.switchTab('talents');
        } else if (e.code === 'Digit5') {
          this.switchTab('pvp');
        } else if (e.code === 'Digit6') {
          this.switchTab('market');
        } else if (e.code === 'Digit7') {
          this.switchTab('achievements');
        } else if (e.code === 'KeyT') {
          this.teleportToTown();
        } else if (e.code === 'KeyM') {
          this.openWorldMap();
        }
      });
    }
  }

  window.SamuraiGame = SamuraiGame;
  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', () => {
      window.game = new SamuraiGame();
    });
  }

})();
