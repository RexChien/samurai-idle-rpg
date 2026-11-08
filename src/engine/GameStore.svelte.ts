import type { GearItem, GearSlot, PlayerData, PlayerStats, QuestItem } from '../types/game';
import { generateGear, decomposeGear } from '../data/gear';
import { SAMURAI_CLASSES } from '../data/classes';
import { AUTOMATION_TIERS, FIVE_RINGS_STANCES, SAMURAI_ARTS } from '../data/stancesArts';
import { MAIN_QUESTS, SIDE_QUESTS, generateProceduralBounty } from '../data/quests';
import { generatePvPOpponents, getAbyssFloorData, simulateSamuraiDuel } from '../data/pvpAbyss';
import { ACHIEVEMENTS_DB, DAILY_SIGNIN_REWARDS } from '../data/achievements';
import { resolveZoneIdFromName } from './WorldMapEngine';
import { audio } from './AudioEngine';

const SAVE_KEY = 'SAMURAI_TENMEI_RPG_SAVE_V2';

function initDefaultPlayer(): PlayerData {
  return {
    characterCreated: false,
    name: '宮本武藏',
    classId: 'kensei',
    level: 1,
    exp: 0,
    maxExp: 100,
    gold: 500,
    iron: 30,
    souls: 5,
    talentPoints: 1,
    talents: {},
    stance: 'earth',
    equippedArts: ['art_iaido'],
    automationTier: 0,
    autoSlashEnabled: false,
    inTown: false,
    townBuffUntil: 0,
    currentMapZone: 'kyoto',
    mapX: 350,
    mapY: 450,
    targetMapX: null,
    targetMapY: null,
    cosmetics: {
      avatar: 'samurai_general',
      bladeTrail: 'cherry',
      title: '天明浪人'
    },
    equipped: {
      weapon: null,
      offhand: null,
      helm: null,
      armor: null,
      boots: null,
      accessory: null
    },
    inventory: [],
    settings: {
      autoDecomposeCommon: false,
      autoDecomposeMagic: false,
      autoDecomposeRare: false,
      soundEnabled: true
    },
    quests: {
      currentMainIndex: 0,
      mainProgress: {},
      completedMain: [],
      sideProgress: {},
      completedSide: [],
      bounties: []
    },
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
      highestFloor: 1
    },
    achievements: {},
    dailySignIn: {
      claimedDays: 0,
      lastClaimDate: null
    },
    statsTracked: {
      totalKills: 0,
      bossKills: 0,
      gearLooted: 0,
      legendaryLooted: 0,
      ancientLooted: 0,
      upgradesSuccess: 0,
      marketPurchases: 0,
      marketSales: 0
    },
    lastSaveTime: Date.now()
  };
}

class GameStoreClass {
  public player: PlayerData = $state(initDefaultPlayer());
  public activeTab: string = $state('battle');
  public currentEnemy: {
    id?: string;
    name: string;
    avatar: string;
    hp: number;
    maxHp: number;
    atk: number;
    def: number;
    isBoss: boolean;
  } = $state({
    name: '貪吃赤面鬼',
    avatar: 'yokai_oni',
    hp: 120,
    maxHp: 120,
    atk: 14,
    def: 6,
    isBoss: false
  });

  public navRequest: { zoneId: string; timestamp: number } | null = $state(null);
  public mapEnemyDefeatedTick: number = $state(0);
  public openedChests: Record<string, boolean> = $state({});
  public artBurstCooldownUntil: number = $state(0);

  public toast: { text: string; type: 'info' | 'success' | 'warning' | 'danger' } | null = $state(null);
  public storyModal: { open: boolean; title: string; chapter: string; npc: string; dialogue: string; lore: string } | null = $state(null);
  public achievementBanner: { open: boolean; name: string; desc: string; icon: string; points: number } | null = $state(null);
  public offlineModal: { open: boolean; hours: number; kills: number; exp: number; gold: number; iron: number; gears: string[] } | null = $state(null);

  private toastTimer: number | null = null;
  private lastAutoSlashTime = 0;

  constructor() {
    this.load();
    this.ensureBountiesAndPvP();
    this.setupAutoSlashLoop();
  }

  public get calculatedStats(): PlayerStats {
    const cls = SAMURAI_CLASSES[this.player.classId] || SAMURAI_CLASSES.kensei;
    let atk = cls.baseStats.atk + (this.player.level - 1) * 4;
    let def = cls.baseStats.def + (this.player.level - 1) * 3;
    let maxHp = cls.baseStats.hp + (this.player.level - 1) * 20;
    let critRate = cls.baseStats.critRate;
    let critDmg = cls.baseStats.critDmg;
    let evasion = cls.baseStats.evasion;
    let lifesteal = 0;
    let thorns = 0;

    // 1. 流派天賦樹加成
    for (const tree of cls.trees) {
      for (const node of tree.talents) {
        const rank = this.player.talents[node.id] || 0;
        if (rank > 0) {
          const val = rank * node.valuePerRank;
          if (node.statKey === 'atk') atk += val;
          else if (node.statKey === 'def') def += val;
          else if (node.statKey === 'hp') maxHp += val;
          else if (node.statKey === 'critRate') critRate += val;
          else if (node.statKey === 'critDmg') critDmg += val;
          else if (node.statKey === 'evasion') evasion += val;
          else if (node.statKey === 'thorns') thorns += val;
        }
      }
    }

    // 2. 暗黑六階裝備屬性與隨機詞綴
    const slots: GearSlot[] = ['weapon', 'offhand', 'helm', 'armor', 'boots', 'accessory'];
    for (const slot of slots) {
      const g = this.player.equipped[slot];
      if (g) {
        atk += g.baseAtk || 0;
        def += g.baseDef || 0;
        maxHp += g.baseHP || 0;
        if (g.affixes) {
          for (const a of g.affixes) {
            if (a.stat === 'critRate') critRate += a.value;
            if (a.stat === 'critDmg') critDmg += a.value;
            if (a.stat === 'evasion') evasion += a.value;
            if (a.stat === 'lifesteal') lifesteal += a.value;
            if (a.stat === 'thorns') thorns += a.value;
          }
        }
      }
    }

    // 3. 宮本武藏《五輪書》架勢加成
    const curStance = FIVE_RINGS_STANCES[this.player.stance] || FIVE_RINGS_STANCES.earth;
    if (curStance.buffs.atkPct) atk = Math.round(atk * (1 + curStance.buffs.atkPct / 100));
    if (curStance.buffs.defPct) def = Math.round(def * (1 + curStance.buffs.defPct / 100));
    if (curStance.buffs.critRate) critRate += curStance.buffs.critRate;
    if (curStance.buffs.critDmg) critDmg += curStance.buffs.critDmg;
    if (curStance.buffs.evasion) evasion += curStance.buffs.evasion;
    if (curStance.buffs.lifesteal) lifesteal += curStance.buffs.lifesteal;
    if (curStance.buffs.thorns) thorns += curStance.buffs.thorns;

    // 4. 神社【出雲武運】祝福 (+15% 全屬性)
    if (this.player.townBuffUntil > Date.now()) {
      atk = Math.round(atk * 1.15);
      def = Math.round(def * 1.15);
      maxHp = Math.round(maxHp * 1.15);
    }

    const power = Math.round(atk * 1.8 + def * 1.4 + maxHp * 0.4 + (critRate * critDmg * 0.08));
    return { hp: maxHp, maxHp, atk, def, critRate, critDmg, evasion, lifesteal, thorns, power };
  }

  public manualSlash() {
    this.executeSlash(false, 1.0);
  }

  public castArtBurst() {
    if (!this.player.characterCreated) return;
    const now = Date.now();
    if (now < this.artBurstCooldownUntil) {
      const remain = ((this.artBurstCooldownUntil - now) / 1000).toFixed(1);
      this.showToast(`⚡ 奧義集氣中，還需 ${remain} 秒！`, 'info');
      return;
    }
    this.artBurstCooldownUntil = now + 3500;
    const artId = this.player.equippedArts[0] || 'art_iaido';
    const art = SAMURAI_ARTS.find(a => a.id === artId) || SAMURAI_ARTS[0];
    this.executeSlash(false, art.powerMult * 1.6);
    this.showToast(`⚡ 施展秘傳奧義【${art.name}】！造成毀天滅地一擊！`, 'success');
  }

  public navigateToZone(zoneNameOrId: string) {
    const zoneId = resolveZoneIdFromName(zoneNameOrId);
    this.player.currentMapZone = zoneId;
    this.activeTab = 'battle';
    this.navRequest = { zoneId, timestamp: Date.now() };
  }

  public openMapChest(chestId: string, chestName: string) {
    if (this.openedChests[chestId]) {
      const bonusGold = 150 + this.player.level * 40;
      this.player.gold += bonusGold;
      audio.playCoin();
      this.showToast(`🎁 再次探索【${chestName}】，尋獲町民留下的零用金 +${bonusGold} 兩！`, 'info');
      return;
    }
    this.openedChests[chestId] = true;
    const qualities: ('rare' | 'epic' | 'legendary')[] = ['rare', 'epic', 'legendary'];
    const q = qualities[Math.min(2, Math.floor(Math.random() * 2 + (this.player.level >= 10 ? 1 : 0)))];
    const g = generateGear(null, q, this.player.level);
    this.addGearToInventory(g);
    audio.playLootChime();
    this.showToast(`🎁 開啟【${chestName}】！尋獲暗黑神兵【${g.name}】！`, 'success');
    this.save();
  }

  public executeSlash(isAuto = false, burstMultiplier = 1.0) {
    if (!this.player.characterCreated) return;
    const stats = this.calculatedStats;

    let artMult = burstMultiplier;
    if (burstMultiplier === 1.0 && this.player.equippedArts && this.player.equippedArts.length > 0) {
      const artId = this.player.equippedArts[Math.floor(Math.random() * this.player.equippedArts.length)];
      const art = SAMURAI_ARTS.find(a => a.id === artId);
      if (art && Math.random() * 100 < art.procChance) {
        artMult = art.powerMult;
      }
    }

    const isCrit = burstMultiplier > 1.0 || Math.random() * 100 < stats.critRate;
    const baseDamage = stats.atk * (isCrit ? (stats.critDmg / 100) : 1);
    const totalDamage = Math.max(1, Math.round(baseDamage * artMult * (0.9 + Math.random() * 0.2)));

    this.currentEnemy.hp -= totalDamage;
    audio.playSlash(isCrit);

    if (this.currentEnemy.hp <= 0) {
      this.onEnemyDefeated();
    }
  }

  private onEnemyDefeated() {
    this.player.statsTracked.totalKills++;
    if (this.currentEnemy.isBoss) this.player.statsTracked.bossKills++;
    if (this.currentEnemy.id) {
      this.mapEnemyDefeatedTick++;
    }

    const expGain = Math.round(20 + this.player.level * 8);
    const goldGain = Math.round(15 + this.player.level * 6);
    this.addExp(expGain);
    this.player.gold += goldGain;
    this.player.iron += Math.random() < 0.4 ? 1 : 0;

    // 隨機掉落暗黑裝備
    if (Math.random() < 0.6) {
      const g = generateGear(null, undefined, this.player.level);
      this.addGearToInventory(g);
    }

    this.advanceQuests();
    this.checkAchievements();
    this.respawnEnemy();
  }

  private advanceQuests() {
    const curMain = MAIN_QUESTS[this.player.quests.currentMainIndex];
    if (curMain) {
      const curProg = (this.player.quests.mainProgress[curMain.id] || 0) + 1;
      this.player.quests.mainProgress[curMain.id] = curProg;

      if (curProg >= curMain.targetKills) {
        this.completeMainQuest(curMain);
      }
    }

    // 推進未完成的輕鬆支線任務
    for (const sq of SIDE_QUESTS) {
      if (this.player.quests.completedSide.includes(sq.id)) continue;
      const curSqProg = (this.player.quests.sideProgress[sq.id] || 0) + 1;
      this.player.quests.sideProgress[sq.id] = curSqProg;
      break; // 依序推進當前支線
    }

    // 街坊委託懸賞任務
    for (const b of this.player.quests.bounties) {
      b.progress++;
      if (b.progress >= b.quest.targetKills) {
        this.claimBounty(b.id);
        break;
      }
    }
  }

  public claimSideQuest(sqId: string) {
    const sq = SIDE_QUESTS.find(q => q.id === sqId);
    if (!sq || this.player.quests.completedSide.includes(sqId)) return;
    const prog = this.player.quests.sideProgress[sqId] || 0;
    if (prog < sq.targetKills) {
      this.showToast(`支線進度尚未達成 (${prog}/${sq.targetKills})`, 'warning');
      return;
    }

    this.player.quests.completedSide.push(sqId);
    if (sq.rewards.exp) this.addExp(sq.rewards.exp);
    if (sq.rewards.gold) this.player.gold += sq.rewards.gold;
    if (sq.rewards.iron) this.player.iron += sq.rewards.iron;
    if (sq.rewards.souls) this.player.souls += sq.rewards.souls;
    if (sq.rewards.title) this.player.cosmetics.title = sq.rewards.title;
    if (sq.rewards.gearQuality) {
      const g = generateGear(null, sq.rewards.gearQuality, this.player.level);
      this.addGearToInventory(g);
    }

    audio.playAchievementFanfare();
    this.showToast(`🍡 完成城鎮支線【${sq.title}】！獲得豐厚謝禮！`, 'success');
    this.openStoryModal(sq.title, '城下町人情支線', sq.npc, sq.dialogue, sq.lore);
    this.save();
  }

  private completeMainQuest(quest: QuestItem) {
    if (!this.player.quests.completedMain.includes(quest.id)) {
      this.player.quests.completedMain.push(quest.id);
    }

    if (quest.unlocksAutomationTier && quest.unlocksAutomationTier > this.player.automationTier) {
      this.player.automationTier = quest.unlocksAutomationTier;
      const tierMeta = AUTOMATION_TIERS[this.player.automationTier];
      this.showToast(`🎉 成功突破！解鎖【${tierMeta.name}】！${tierMeta.badge}`, 'success');
      this.player.autoSlashEnabled = true;
    }

    if (quest.rewards.exp) this.addExp(quest.rewards.exp);
    if (quest.rewards.gold) this.player.gold += quest.rewards.gold;
    if (quest.rewards.iron) this.player.iron += quest.rewards.iron;
    if (quest.rewards.souls) this.player.souls += quest.rewards.souls;
    if (quest.rewards.title) this.player.cosmetics.title = quest.rewards.title;
    if (quest.rewards.gearQuality) {
      const g = generateGear(null, quest.rewards.gearQuality, this.player.level);
      this.addGearToInventory(g);
    }

    this.showToast(`📜 完成主線【${quest.title}】！`, 'success');
    this.openStoryModal(quest.title, quest.chapter || '天明物語', quest.npc, quest.dialogue, quest.lore);

    if (this.player.quests.currentMainIndex < MAIN_QUESTS.length - 1) {
      this.player.quests.currentMainIndex++;
    }
    this.save();
  }

  public claimBounty(bountyId: string) {
    const idx = this.player.quests.bounties.findIndex(b => b.id === bountyId);
    if (idx === -1) return;
    const b = this.player.quests.bounties[idx];

    if (b.quest.rewards.exp) this.addExp(b.quest.rewards.exp);
    if (b.quest.rewards.gold) this.player.gold += b.quest.rewards.gold;
    if (b.quest.rewards.iron) this.player.iron += b.quest.rewards.iron;
    if (b.quest.rewards.souls) this.player.souls += b.quest.rewards.souls;

    this.showToast(`💰 領取街坊委託謝禮！金幣 +${b.quest.rewards.gold}`, 'success');
    audio.playCoin();

    this.player.quests.bounties[idx] = {
      id: 'bounty_' + Date.now(),
      quest: generateProceduralBounty(this.player.level),
      progress: 0
    };
    this.save();
  }

  private respawnEnemy() {
    const lvl = this.player.level;
    const isBoss = Math.random() < 0.15;
    const enemyPool = [
      { name: '貪吃赤面鬼', sprite: 'yokai_oni' },
      { name: '鞍馬小天狗', sprite: 'yokai_tengu' },
      { name: '提燈白狐妖', sprite: 'yokai_kitsune' },
      { name: '偷酒赤面鬼', sprite: 'yokai_oni' },
      { name: '惡作劇天狗', sprite: 'yokai_tengu' }
    ];
    const picked = enemyPool[Math.floor(Math.random() * enemyPool.length)];
    const name = picked.name + (isBoss ? '【首領】' : '');
    const hp = Math.round((100 + lvl * 40) * (isBoss ? 3.2 : 1));

    this.currentEnemy = {
      name,
      avatar: picked.sprite,
      hp,
      maxHp: hp,
      atk: Math.round(15 + lvl * 5),
      def: Math.round(8 + lvl * 3),
      isBoss
    };
  }

  public addExp(amount: number) {
    this.player.exp += amount;
    while (this.player.exp >= this.player.maxExp) {
      this.player.exp -= this.player.maxExp;
      this.player.level++;
      this.player.talentPoints += 1;
      this.player.maxExp = Math.round(this.player.maxExp * 1.25);
      this.showToast(`🌟 突破升級！達到 Lv.${this.player.level}！獲得 1 點天賦！`, 'success');
      audio.playAchievementFanfare();
    }
  }

  public addGearToInventory(gear: GearItem) {
    if (!gear) return;
    this.player.statsTracked.gearLooted++;
    if (gear.quality === 'legendary') this.player.statsTracked.legendaryLooted++;
    if (gear.quality === 'ancient') this.player.statsTracked.ancientLooted++;

    if (this.player.automationTier >= 2) {
      if (gear.quality === 'common' && this.player.settings.autoDecomposeCommon) {
        const mats = decomposeGear(gear);
        this.player.iron += mats.iron;
        this.player.gold += mats.gold;
        return;
      }
      if (gear.quality === 'magic' && this.player.settings.autoDecomposeMagic) {
        const mats = decomposeGear(gear);
        this.player.iron += mats.iron;
        this.player.souls += mats.souls;
        this.player.gold += mats.gold;
        return;
      }
    }

    if (this.player.inventory.length >= 50) {
      this.showToast(`行囊已滿！神兵【${gear.name}】已自動化為玉鋼分解`, 'warning');
      const mats = decomposeGear(gear);
      this.player.iron += mats.iron;
      return;
    }

    this.player.inventory.push(gear);
    if (['legendary', 'ancient'].includes(gear.quality)) {
      audio.playLootChime();
      this.showToast(`🌟 獲得稀世神兵【${gear.name}】！`, 'success');
    }
  }

  public equipGear(uid: string) {
    const idx = this.player.inventory.findIndex(g => g.uid === uid);
    if (idx === -1) return;
    const gear = this.player.inventory.splice(idx, 1)[0];
    const prev = this.player.equipped[gear.slot];

    this.player.equipped[gear.slot] = gear;
    if (prev) this.player.inventory.push(prev);

    this.showToast(`已穿戴【${gear.name}】！`, 'info');
    audio.playCoin();
    this.save();
  }

  public unequipGear(slot: GearSlot) {
    const gear = this.player.equipped[slot];
    if (!gear) return;
    if (this.player.inventory.length >= 50) {
      this.showToast(`行囊已滿，無法卸下裝備！`, 'warning');
      return;
    }
    this.player.equipped[slot] = null;
    this.player.inventory.push(gear);
    this.showToast(`已卸下【${gear.name}】！`, 'info');
    this.save();
  }

  public upgradeGear(uid: string) {
    let target: GearItem | null = null;
    for (const slot of Object.keys(this.player.equipped) as GearSlot[]) {
      if (this.player.equipped[slot]?.uid === uid) target = this.player.equipped[slot];
    }
    if (!target) {
      target = this.player.inventory.find(g => g.uid === uid) || null;
    }
    if (!target) return;

    const ironReq = Math.round((target.upgradeLevel + 1) * 8);
    const goldReq = Math.round((target.upgradeLevel + 1) * 150);

    if (this.player.iron < ironReq || this.player.gold < goldReq) {
      this.showToast(`玉鋼或金幣不足！需玉鋼 x${ironReq}、金幣 ${goldReq} 兩`, 'warning');
      return;
    }

    this.player.iron -= ironReq;
    this.player.gold -= goldReq;
    target.upgradeLevel += 1;
    if (target.baseAtk) target.baseAtk = Math.round(target.baseAtk * 1.15);
    if (target.baseDef) target.baseDef = Math.round(target.baseDef * 1.15);
    if (target.baseHP) target.baseHP = Math.round(target.baseHP * 1.15);
    target.gearScore = Math.round(target.gearScore * 1.12);

    this.player.statsTracked.upgradesSuccess++;
    this.showToast(`🔨 成功鍛造強化！【${target.name} +${target.upgradeLevel}】戰力提升！`, 'success');
    audio.playCoin();
    this.checkAchievements();
    this.save();
  }

  public decomposeSingleGear(uid: string) {
    const idx = this.player.inventory.findIndex(g => g.uid === uid);
    if (idx === -1) return;
    const gear = this.player.inventory.splice(idx, 1)[0];
    const mats = decomposeGear(gear);
    this.player.iron += mats.iron;
    this.player.souls += mats.souls;
    this.player.gold += mats.gold;
    this.showToast(`已分解【${gear.name}】，獲得玉鋼 x${mats.iron}、魂玉 x${mats.souls}`, 'info');
    audio.playCoin();
    this.save();
  }

  public smartEquipBetterGear() {
    let changed = 0;
    const slots: GearSlot[] = ['weapon', 'offhand', 'helm', 'armor', 'boots', 'accessory'];
    for (const slot of slots) {
      const cur = this.player.equipped[slot];
      const candidates = this.player.inventory.filter(g => g.slot === slot);
      if (candidates.length === 0) continue;
      candidates.sort((a, b) => b.gearScore - a.gearScore);
      const best = candidates[0];

      if (!cur || best.gearScore > cur.gearScore) {
        this.equipGear(best.uid);
        changed++;
      }
    }
    if (changed > 0) {
      this.showToast(`⚡ 一鍵智慧穿戴了 ${changed} 件更高戰力神兵！`, 'success');
    } else {
      this.showToast(`目前已穿戴最佳神兵，無須更換`, 'info');
    }
  }

  public selectStance(stanceId: 'earth' | 'water' | 'fire' | 'wind' | 'void') {
    this.player.stance = stanceId;
    const st = FIVE_RINGS_STANCES[stanceId];
    this.showToast(`☯️ 已切換為宮本武藏【${st.name}】！${st.counterDesc}`, 'info');
    audio.playSlash();
    this.save();
  }

  public toggleEquipArt(artId: string) {
    if (!this.player.equippedArts) this.player.equippedArts = [];
    const idx = this.player.equippedArts.indexOf(artId);
    if (idx !== -1) {
      this.player.equippedArts.splice(idx, 1);
      this.showToast(`已卸下奧義`, 'info');
    } else {
      if (this.player.equippedArts.length >= 3) {
        this.showToast(`最多同時裝備 3 招武學奧義！請先卸下一招`, 'warning');
        return;
      }
      this.player.equippedArts.push(artId);
      const art = SAMURAI_ARTS.find(a => a.id === artId);
      this.showToast(`已裝備武學奧義【${art?.name}】！`, 'success');
      audio.playSlash(true);
    }
    this.save();
  }

  public toggleAutoSlash() {
    if (this.player.automationTier <= 0) {
      this.showToast(`尚未領悟自動劍意！請先完成主線任務【M01：木刀百振】`, 'warning');
      return;
    }
    this.player.autoSlashEnabled = !this.player.autoSlashEnabled;
    this.showToast(this.player.autoSlashEnabled ? '🤖 自動揮刀已開啟' : '✋ 自動揮刀已暫停', 'info');
    this.save();
  }

  private setupAutoSlashLoop() {
    // 動態讀取當前 AUTOMATION_TIERS[tier].intervalMs (1200ms -> 650ms -> 500ms -> 350ms)
    setInterval(() => {
      if (!this.player.characterCreated || !this.player.autoSlashEnabled || this.player.automationTier <= 0) {
        return;
      }
      const tierCfg = AUTOMATION_TIERS[this.player.automationTier] || AUTOMATION_TIERS[1];
      const interval = tierCfg.intervalMs || 1000;
      const now = Date.now();
      if (now - this.lastAutoSlashTime >= interval) {
        this.lastAutoSlashTime = now;
        this.executeSlash(true);
      }
    }, 50);
  }

  public challengePvP(oppIndex: number) {
    const opp = this.player.pvp.opponents[oppIndex];
    if (!opp) return;

    const res = simulateSamuraiDuel(
      {
        name: this.player.name,
        stats: this.calculatedStats,
        stance: this.player.stance,
        equippedArts: this.player.equippedArts
      },
      {
        name: opp.name,
        power: opp.power,
        stance: opp.stance
      }
    );

    this.player.pvp.lastLog = res.logs;
    if (res.won) {
      this.player.pvp.wins++;
      this.player.pvp.streak++;
      this.player.pvp.rating += opp.ratingGain;
      this.player.gold += opp.power * 2;
      this.showToast(`🏆 武道對決獲勝！積分 +${opp.ratingGain}！`, 'success');
      audio.playAchievementFanfare();
    } else {
      this.player.pvp.losses++;
      this.player.pvp.streak = 0;
      this.player.pvp.rating = Math.max(1000, this.player.pvp.rating - 12);
      this.showToast(`🍵 武道切磋惜敗！積分 -12`, 'warning');
    }

    this.refreshPvPOpponents();
    this.checkAchievements();
    this.save();
  }

  public refreshPvPOpponents() {
    this.player.pvp.opponents = generatePvPOpponents(this.player.pvp.rating, this.calculatedStats.power);
    this.save();
  }

  public challengeAbyss() {
    const curFloor = this.player.abyss.floor || 1;
    const floorData = getAbyssFloorData(curFloor);

    const res = simulateSamuraiDuel(
      {
        name: this.player.name,
        stats: this.calculatedStats,
        stance: this.player.stance,
        equippedArts: this.player.equippedArts
      },
      {
        name: floorData.name,
        power: floorData.recommendedPower,
        stance: floorData.recommendedStanceId
      }
    );

    this.player.pvp.lastLog = res.logs;
    if (res.won) {
      this.player.abyss.floor++;
      this.player.abyss.highestFloor = Math.max(this.player.abyss.highestFloor, this.player.abyss.floor);
      this.player.gold += floorData.rewards.gold;
      this.player.iron += floorData.rewards.iron;
      this.player.souls += floorData.rewards.souls;

      if (floorData.rewards.guaranteedLegendary) {
        const freeGear = generateGear(null, 'legendary', this.player.level);
        this.addGearToInventory(freeGear);
      }
      this.showToast(`🌌 成功突破千層秘境第 ${curFloor} 層！獲得魂玉 +${floorData.rewards.souls}！`, 'success');
      audio.playAchievementFanfare();
    } else {
      this.showToast(`🍵 秘境第 ${curFloor} 層挑戰惜敗！建議切換為【${floorData.recommendedStanceName}】再戰！`, 'warning');
    }
    this.save();
  }

  public exportDuelCode(): string {
    const payload = {
      name: this.player.name,
      level: this.player.level,
      power: this.calculatedStats.power,
      stance: this.player.stance,
      classId: this.player.classId,
      equippedArts: this.player.equippedArts
    };
    const code = 'DUEL_' + btoa(encodeURIComponent(JSON.stringify(payload)));
    navigator.clipboard?.writeText(code);
    this.showToast(`📋 已複製您的武道切磋碼！快分享給好友對決吧！`, 'success');
    return code;
  }

  public importAndDuelCode(code: string) {
    if (!code || !code.startsWith('DUEL_')) {
      this.showToast(`無效的武道切磋碼！`, 'warning');
      return;
    }
    try {
      const json = decodeURIComponent(atob(code.replace('DUEL_', '')));
      const opp = JSON.parse(json);
      const res = simulateSamuraiDuel(
        {
          name: this.player.name,
          stats: this.calculatedStats,
          stance: this.player.stance,
          equippedArts: this.player.equippedArts
        },
        {
          name: opp.name,
          power: opp.power || 1000,
          stance: opp.stance || 'fire'
        }
      );
      this.player.pvp.lastLog = res.logs;
      this.showToast(res.won ? `🎉 跨玩家切磋獲勝！` : `🍵 跨玩家切磋惜敗！`, res.won ? 'success' : 'warning');
      this.activeTab = 'pvp';
    } catch {
      this.showToast(`切磋碼格式損毀或無效`, 'danger');
    }
  }

  public checkAchievements() {
    const stats = this.calculatedStats;
    for (const ach of ACHIEVEMENTS_DB) {
      if (this.player.achievements[ach.id]?.unlocked) continue;
      let ok = false;
      if (ach.id.startsWith('kill_')) ok = this.player.statsTracked.totalKills >= ach.target;
      else if (ach.id.startsWith('boss_')) ok = this.player.statsTracked.bossKills >= ach.target;
      else if (ach.id.startsWith('level_')) ok = this.player.level >= ach.target;
      else if (ach.id.startsWith('power_')) ok = stats.power >= ach.target;
      else if (ach.id === 'loot_legendary') ok = this.player.statsTracked.legendaryLooted >= 1;
      else if (ach.id === 'loot_ancient') ok = this.player.statsTracked.ancientLooted >= 1;
      else if (ach.id === 'upgrade_5') ok = Object.values(this.player.equipped).some(g => (g?.upgradeLevel || 0) >= 5);
      else if (ach.id === 'upgrade_10') ok = Object.values(this.player.equipped).some(g => (g?.upgradeLevel || 0) >= 10);

      if (ok) {
        this.player.achievements[ach.id] = { unlocked: true, claimed: false, date: new Date().toLocaleDateString() };
        this.achievementBanner = { open: true, name: ach.name, desc: ach.desc, icon: ach.icon, points: ach.points };
        audio.playAchievementFanfare();
        setTimeout(() => {
          if (this.achievementBanner) this.achievementBanner.open = false;
        }, 4000);
      }
    }
  }

  public claimAchievement(achId: string) {
    const ach = ACHIEVEMENTS_DB.find(a => a.id === achId);
    if (!ach || !this.player.achievements[achId]?.unlocked || this.player.achievements[achId]?.claimed) return;

    this.player.achievements[achId].claimed = true;
    if (ach.reward?.gold) this.player.gold += ach.reward.gold;
    if (ach.reward?.iron) this.player.iron += ach.reward.iron;
    if (ach.reward?.souls) this.player.souls += ach.reward.souls;
    if (ach.reward?.title) this.player.cosmetics.title = ach.reward.title;
    if (ach.reward?.gearQuality) {
      const g = generateGear(null, ach.reward.gearQuality, this.player.level);
      this.addGearToInventory(g);
    }
    audio.playCoin();
    this.showToast(`已領取成就獎勵【${ach.name}】！`, 'success');
    this.save();
  }

  public claimAllAchievements() {
    let count = 0;
    for (const ach of ACHIEVEMENTS_DB) {
      if (this.player.achievements[ach.id]?.unlocked && !this.player.achievements[ach.id]?.claimed) {
        this.claimAchievement(ach.id);
        count++;
      }
    }
    if (count === 0) this.showToast(`目前沒有可領取的成就`, 'info');
  }

  public claimDailySignIn() {
    const today = new Date().toISOString().slice(0, 10);
    if (this.player.dailySignIn.lastClaimDate === today) {
      this.showToast(`今日簽到獎勵已領取，明日再來！`, 'info');
      return;
    }
    const nextDay = (this.player.dailySignIn.claimedDays % 7) + 1;
    const rw = DAILY_SIGNIN_REWARDS.find(r => r.day === nextDay);
    if (!rw) return;

    this.player.dailySignIn.claimedDays++;
    this.player.dailySignIn.lastClaimDate = today;

    if (rw.gold) this.player.gold += rw.gold;
    if (rw.iron) this.player.iron += rw.iron;
    if (rw.souls) this.player.souls += rw.souls;
    if (rw.title) this.player.cosmetics.title = rw.title;
    if (rw.gearQuality) {
      const g = generateGear(null, rw.gearQuality, this.player.level);
      this.addGearToInventory(g);
    }
    audio.playAchievementFanfare();
    this.showToast(`🎉 成功簽到第 ${nextDay} 天！獲得：${rw.desc}`, 'success');
    this.save();
  }

  private ensureBountiesAndPvP() {
    if (!this.player.quests.bounties || this.player.quests.bounties.length < 3) {
      this.player.quests.bounties = [
        { id: 'bounty_1', quest: generateProceduralBounty(this.player.level), progress: 0 },
        { id: 'bounty_2', quest: generateProceduralBounty(this.player.level), progress: 0 },
        { id: 'bounty_3', quest: generateProceduralBounty(this.player.level), progress: 0 }
      ];
    }
    if (!this.player.pvp.opponents || this.player.pvp.opponents.length === 0) {
      this.refreshPvPOpponents();
    }
  }

  public startNewGame(name: string, classId: string, avatar: string) {
    this.player = initDefaultPlayer();
    this.player.characterCreated = true;
    this.player.name = name || '宮本武藏';
    this.player.classId = classId || 'kensei';
    this.player.cosmetics.avatar = avatar || 'samurai_general';
    this.player.equipped.weapon = generateGear('weapon', 'magic', 1);

    this.ensureBountiesAndPvP();
    this.save();
    this.showToast(`進入天明七年城下町！拔刀護鄉里！`, 'success');

    const m01 = MAIN_QUESTS[0];
    if (m01) {
      this.openStoryModal(m01.title, m01.chapter || '天明風雲', m01.npc, m01.dialogue, m01.lore);
    }
  }

  public showToast(text: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info') {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { text, type };
    this.toastTimer = window.setTimeout(() => {
      this.toast = null;
    }, 3200);
  }

  public openStoryModal(title: string, chapter: string, npc: string, dialogue: string, lore: string) {
    this.storyModal = { open: true, title, chapter, npc, dialogue, lore };
  }

  public closeStoryModal() {
    this.storyModal = null;
  }

  public save() {
    try {
      this.player.lastSaveTime = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.player));
    } catch {
      // Storage restricted
    }
  }

  public load() {
    try {
      const data = localStorage.getItem(SAVE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        Object.assign(this.player, parsed);
        this.processOfflineProgress();
      }
    } catch {
      // Ignored
    }
  }

  private processOfflineProgress() {
    const elapsed = Math.floor((Date.now() - (this.player.lastSaveTime || Date.now())) / 1000);
    if (elapsed < 60) return;
    const calcSec = Math.min(43200, elapsed);
    const kills = Math.round((calcSec / 60) * 12);
    const exp = kills * 10;
    const gold = kills * 6;
    const iron = Math.round(kills * 0.3);

    this.player.gold += gold;
    this.player.iron += iron;
    this.addExp(exp);
    this.player.statsTracked.totalKills += kills;

    const bonusGears: string[] = [];
    if (calcSec >= 3600) {
      const g = generateGear(null, 'epic', this.player.level);
      this.addGearToInventory(g);
      bonusGears.push(g.name);
    }

    this.offlineModal = {
      open: true,
      hours: Math.floor(calcSec / 3600),
      kills,
      exp,
      gold,
      iron,
      gears: bonusGears
    };
  }
}

export const gameStore = new GameStoreClass();
