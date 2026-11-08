import type {
  BattleUnitEnemy,
  ConsumableItem,
  GearItem,
  GearSlot,
  MapPOI,
  PartyMemberStatus,
  PlayerData,
  PlayerStats,
  QuestItem
} from '../types/game';
import { generateGear, decomposeGear } from '../data/gear';
import { SAMURAI_CLASSES } from '../data/classes';
import { AUTOMATION_TIERS, FIVE_RINGS_STANCES, SAMURAI_ARTS } from '../data/stancesArts';
import { MAIN_QUESTS, SIDE_QUESTS, generateProceduralBounty } from '../data/quests';
import { generatePvPOpponents, getAbyssFloorData, simulateSamuraiDuel } from '../data/pvpAbyss';
import { ACHIEVEMENTS_DB, DAILY_SIGNIN_REWARDS } from '../data/achievements';
import { resolveZoneIdFromName, MAP_ZONES } from './WorldMapEngine';
import { audio } from './AudioEngine';

const SAVE_KEY = 'SAMURAI_TENMEI_RPG_SAVE_V2';

export interface JrpgSkillSpec {
  id: string;
  name: string;
  caster: 'leader' | 'kaede' | 'hayate';
  casterName: string;
  icon: string;
  spCost: number;
  target: 'single' | 'all' | 'heal_party';
  mult: number;
  desc: string;
}

export const JRPG_PARTY_SKILLS: JrpgSkillSpec[] = [
  {
    id: 'iaido',
    name: '居合・拔刀斬',
    caster: 'leader',
    casterName: '主角',
    icon: '🗡️',
    spCost: 15,
    target: 'single',
    mult: 2.1,
    desc: '【單體必暴擊】疾如雷電的拔刀一閃，對單一目標造成 210% 暴擊傷害。'
  },
  {
    id: 'tsubame',
    name: '秘劍・燕返',
    caster: 'leader',
    casterName: '主角',
    icon: '🌪️',
    spCost: 25,
    target: 'single',
    mult: 2.75,
    desc: '【單體二連斬】凌空翻轉雙重刀浪，對目標造成 275% 高額斬擊傷害。'
  },
  {
    id: 'kasha',
    name: '紅蓮・火車切',
    caster: 'leader',
    casterName: '主角',
    icon: '🔥',
    spCost: 32,
    target: 'all',
    mult: 1.85,
    desc: '【全體劍氣】揮出熾熱火輪劍波，橫掃敵方全體造成 185% 範圍傷害。'
  },
  {
    id: 'kagura_heal',
    name: '神樂・回天祈禱',
    caster: 'kaede',
    casterName: '神無月楓',
    icon: '🌸',
    spCost: 20,
    target: 'heal_party',
    mult: 0.55,
    desc: '【全隊治癒】巫女楓搖動神樂鈴祈福，立即回復全隊 55% 最大生命並振奮士氣。'
  },
  {
    id: 'raikiri',
    name: '忍法・鳴神破甲',
    caster: 'hayate',
    casterName: '影縫疾風',
    icon: '⚡',
    spCost: 24,
    target: 'all',
    mult: 1.65,
    desc: '【全體雷遁＋破防】疾風結印召喚落雷轟擊全體敵人，並削弱敵方防禦 2 回合。'
  },
  {
    id: 'musashi_dual',
    name: '二天一流・天地雙斬',
    caster: 'leader',
    casterName: '主角',
    icon: '☯️',
    spCost: 40,
    target: 'single',
    mult: 3.5,
    desc: '【單體極意】太刀與脇差交錯斬裂天地，對首領或強敵造成 350% 毀滅傷害。'
  }
];

export const JRPG_CONSUMABLES: Omit<ConsumableItem, 'count'>[] = [
  { id: 'dango', name: '花見三色糰子', icon: '🍡', desc: '全隊回復 60% 生命 (HP)', price: 30 },
  { id: 'matcha', name: '宇治極品抹茶', icon: '🍵', desc: '全隊回復 65% 氣力 (SP)', price: 40 },
  { id: 'sake', name: '般若湯・銘酒', icon: '🍶', desc: '主角怒氣槽 (POW) 直接滿載 100%', price: 80 },
  { id: 'elixir', name: '秘傳萬金丹', icon: '💊', desc: '全隊 HP 與 SP 100% 完全回復', price: 150 }
];

function initDefaultPlayer(): PlayerData {
  return {
    characterCreated: false,
    name: '宮本武藏',
    classId: 'kensei',
    level: 1,
    exp: 0,
    maxExp: 100,
    gold: 600,
    iron: 35,
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
    mapX: 480,
    mapY: 445,
    targetMapX: null,
    targetMapY: null,
    consumables: {
      dango: 5,
      matcha: 4,
      sake: 2,
      elixir: 1
    },
    cosmetics: {
      avatar: 'samurai_general',
      bladeTrail: 'cherry',
      title: '天明劍客'
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

  // 傳統 JRPG 三人同行小隊狀態 (主角 + 神無月楓 + 影縫疾風)
  public party: PartyMemberStatus[] = $state([
    { id: 'leader', name: '宮本武藏', roleTitle: '二天劍豪', avatar: 'samurai_general', hp: 260, maxHp: 260, sp: 100, maxSp: 100, pow: 35 },
    { id: 'kaede', name: '神無月 楓', roleTitle: '破邪巫女', avatar: 'samurai_female', hp: 210, maxHp: 210, sp: 120, maxSp: 120, pow: 20 },
    { id: 'hayate', name: '影縫 疾風', roleTitle: '伊賀疾風忍', avatar: 'npc_hayate', hp: 220, maxHp: 220, sp: 100, maxSp: 100, pow: 25 }
  ]);

  // 《新武士道列傳》回合指令制戰鬥狀態
  public jrpgBattle: {
    inBattle: boolean;
    round: number;
    enemies: BattleUnitEnemy[];
    selectedTargetIdx: number;
    skillBanner: string | null;
    actingUnitId: string | null;
    logs: string[];
  } = $state({
    inBattle: false,
    round: 1,
    enemies: [],
    selectedTargetIdx: 0,
    skillBanner: null,
    actingUnitId: null,
    logs: ['🏮 漫步於天明日本各地，靠近巡邏妖魔或點擊「拔刀接敵」即可展開《新武士道列傳》指令戰鬥！']
  });

  // 城鎮 NPC 傳統 JRPG 對話框狀態
  public npcModal: {
    open: boolean;
    poiId: string;
    name: string;
    avatar: string;
    dialogue: string;
    poiType: string;
  } | null = $state(null);

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
    hp: 140,
    maxHp: 140,
    atk: 14,
    def: 6,
    isBoss: false
  });

  public navRequest: { zoneId: string; timestamp: number } | null = $state(null);
  public mapEnemyDefeatedTick: number = $state(0);
  public openedChests: Record<string, boolean> = $state({});
  public artBurstCooldownUntil: number = $state(0);
  public lastSlashEvent: { tick: number; damage: number; isCrit: boolean } = $state({ tick: 0, damage: 0, isCrit: false });

  public toast: { text: string; type: 'info' | 'success' | 'warning' | 'danger' } | null = $state(null);
  public storyModal: { open: boolean; title: string; chapter: string; npc: string; dialogue: string; lore: string } | null = $state(null);
  public achievementBanner: { open: boolean; name: string; desc: string; icon: string; points: number } | null = $state(null);
  public offlineModal: { open: boolean; hours: number; kills: number; exp: number; gold: number; iron: number; gears: string[] } | null = $state(null);

  private toastTimer: number | null = null;

  constructor() {
    this.load();
    this.ensureBountiesAndPvP();
    this.syncPartyStats();
    this.spawnEncounterGroup(false);
  }

  public get calculatedStats(): PlayerStats {
    const cls = SAMURAI_CLASSES[this.player.classId] || SAMURAI_CLASSES.kensei;
    let atk = cls.baseStats.atk + (this.player.level - 1) * 5;
    let def = cls.baseStats.def + (this.player.level - 1) * 3;
    let maxHp = cls.baseStats.hp + (this.player.level - 1) * 28;
    let critRate = cls.baseStats.critRate;
    let critDmg = cls.baseStats.critDmg;
    let evasion = cls.baseStats.evasion;
    let lifesteal = 0;
    let thorns = 0;

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

    const curStance = FIVE_RINGS_STANCES[this.player.stance] || FIVE_RINGS_STANCES.earth;
    if (curStance.buffs.atkPct) atk = Math.round(atk * (1 + curStance.buffs.atkPct / 100));
    if (curStance.buffs.defPct) def = Math.round(def * (1 + curStance.buffs.defPct / 100));
    if (curStance.buffs.critRate) critRate += curStance.buffs.critRate;
    if (curStance.buffs.critDmg) critDmg += curStance.buffs.critDmg;
    if (curStance.buffs.evasion) evasion += curStance.buffs.evasion;
    if (curStance.buffs.lifesteal) lifesteal += curStance.buffs.lifesteal;
    if (curStance.buffs.thorns) thorns += curStance.buffs.thorns;

    if (this.player.townBuffUntil > Date.now()) {
      atk = Math.round(atk * 1.15);
      def = Math.round(def * 1.15);
      maxHp = Math.round(maxHp * 1.15);
    }

    const power = Math.round(atk * 1.8 + def * 1.4 + maxHp * 0.4 + (critRate * critDmg * 0.08));
    return { hp: maxHp, maxHp, atk, def, critRate, critDmg, evasion, lifesteal, thorns, power };
  }

  public syncPartyStats(fullHeal = false) {
    const st = this.calculatedStats;
    const leader = this.party[0];
    const kaede = this.party[1];
    const hayate = this.party[2];

    if (leader) {
      leader.name = this.player.name || '宮本武藏';
      leader.avatar = this.player.cosmetics.avatar || 'samurai_general';
      leader.maxHp = st.maxHp;
      leader.maxSp = 100 + (this.player.level - 1) * 5;
      if (fullHeal || leader.hp > leader.maxHp || leader.hp <= 0) leader.hp = leader.maxHp;
      if (fullHeal) leader.sp = leader.maxSp;
    }
    if (kaede) {
      kaede.maxHp = Math.round(st.maxHp * 0.85);
      kaede.maxSp = 120 + (this.player.level - 1) * 6;
      if (fullHeal || kaede.hp > kaede.maxHp || kaede.hp <= 0) kaede.hp = kaede.maxHp;
      if (fullHeal) kaede.sp = kaede.maxSp;
    }
    if (hayate) {
      hayate.maxHp = Math.round(st.maxHp * 0.9);
      hayate.maxSp = 100 + (this.player.level - 1) * 5;
      if (fullHeal || hayate.hp > hayate.maxHp || hayate.hp <= 0) hayate.hp = hayate.maxHp;
      if (fullHeal) hayate.sp = hayate.maxSp;
    }
  }

  public getConsumableList(): ConsumableItem[] {
    if (!this.player.consumables) {
      this.player.consumables = { dango: 5, matcha: 4, sake: 2, elixir: 1 };
    }
    return JRPG_CONSUMABLES.map(item => ({
      ...item,
      count: this.player.consumables?.[item.id] || 0
    }));
  }

  public buyConsumable(itemId: 'dango' | 'matcha' | 'sake' | 'elixir') {
    const spec = JRPG_CONSUMABLES.find(i => i.id === itemId);
    if (!spec) return;
    if (this.player.gold < spec.price) {
      this.showToast(`兩銀不足！購買【${spec.name}】需要 ${spec.price} 兩`, 'warning');
      return;
    }
    if (!this.player.consumables) this.player.consumables = {};
    this.player.gold -= spec.price;
    this.player.consumables[itemId] = (this.player.consumables[itemId] || 0) + 1;
    audio.playCoin();
    this.showToast(`🍡 已購入【${spec.name}】x1（目前持有：${this.player.consumables[itemId]}）`, 'success');
    this.save();
  }

  public restAtTownInn() {
    const cost = 20;
    if (this.player.gold >= cost) {
      this.player.gold -= cost;
    }
    this.syncPartyStats(true);
    if (!this.player.consumables) this.player.consumables = {};
    this.player.consumables.dango = (this.player.consumables.dango || 0) + 1;
    audio.playLootChime();
    this.showToast(`🍵 在花見茶屋宿屋休憩完畢！全隊 HP / SP 完全回復，小町還贈送了 1 串花見糰子！`, 'success');
    this.save();
  }

  public openNpcDialogue(poi: MapPOI) {
    this.npcModal = {
      open: true,
      poiId: poi.id,
      name: poi.name,
      avatar: poi.icon,
      dialogue: poi.desc,
      poiType: poi.type
    };
  }

  public closeNpcDialogue() {
    this.npcModal = null;
  }

  /**
   * 觸發《新武士道列傳》回合制遭遇戰（生成 1～3 名敵方編隊）
   */
  public startJrpgEncounter(mapYokai?: { id?: string; name: string; avatar: string; level?: number; hp: number; maxHp: number; atk: number; def: number; stance?: 'earth' | 'water' | 'fire' | 'wind' | 'void'; isBoss?: boolean }) {
    this.syncPartyStats(false);
    this.jrpgBattle.inBattle = true;
    this.jrpgBattle.round = 1;
    this.jrpgBattle.selectedTargetIdx = 0;

    if (mapYokai) {
      this.currentEnemy = {
        id: mapYokai.id,
        name: mapYokai.name,
        avatar: mapYokai.avatar,
        hp: mapYokai.hp,
        maxHp: mapYokai.maxHp,
        atk: mapYokai.atk,
        def: mapYokai.def,
        isBoss: !!mapYokai.isBoss
      };
    }

    this.spawnEncounterGroup(!!mapYokai?.isBoss, mapYokai?.name, mapYokai?.avatar, mapYokai?.id);
    this.jrpgBattle.logs = [
      `⚔️ 【遭遇戰】${this.jrpgBattle.enemies.map(e => e.name).join('、')} 攔住了小隊去路！請下達武士道戰術指令！`
    ];
  }

  public spawnEncounterGroup(isBossEncounter = false, leadName?: string, leadAvatar?: string, mapId?: string) {
    const zoneIdx = Math.max(0, MAP_ZONES.findIndex(z => z.id === this.player.currentMapZone));
    const baseLvl = Math.max(1, this.player.level + zoneIdx * 2);
    const stances: ('earth' | 'water' | 'fire' | 'wind' | 'void')[] = ['earth', 'water', 'fire', 'wind', 'void'];

    const pool = [
      { name: '貪吃赤面鬼', avatar: 'yokai_oni' },
      { name: '鞍馬小天狗', avatar: 'yokai_tengu' },
      { name: '提燈白狐妖', avatar: 'yokai_kitsune' },
      { name: '偷酒赤面鬼', avatar: 'yokai_oni' },
      { name: '疾風鴉天狗', avatar: 'yokai_tengu' }
    ];

    if (isBossEncounter) {
      const bossHp = Math.round((240 + baseLvl * 75) * 2.2);
      this.jrpgBattle.enemies = [
        {
          id: mapId || 'boss_main',
          name: leadName ? `👑 ${leadName}` : `👑 常世鬼大將・羅剎`,
          avatar: leadAvatar || 'yokai_tengu',
          level: baseLvl + 2,
          hp: bossHp,
          maxHp: bossHp,
          atk: Math.round(20 + baseLvl * 6.5),
          def: Math.round(10 + baseLvl * 3.5),
          stance: stances[zoneIdx % stances.length],
          isBoss: true
        },
        {
          id: 'boss_guard_1',
          name: '親衛・赤面鬼眾',
          avatar: 'yokai_oni',
          level: baseLvl,
          hp: Math.round(130 + baseLvl * 42),
          maxHp: Math.round(130 + baseLvl * 42),
          atk: Math.round(14 + baseLvl * 4.5),
          def: Math.round(7 + baseLvl * 2.5),
          stance: 'fire'
        }
      ];
    } else {
      const count = 2 + (Math.random() < 0.45 ? 1 : 0);
      const list: BattleUnitEnemy[] = [];
      for (let i = 0; i < count; i++) {
        const pick = i === 0 && leadName
          ? { name: leadName, avatar: leadAvatar || 'yokai_oni' }
          : pool[(zoneIdx + i + Math.floor(Math.random() * pool.length)) % pool.length];
        const hp = Math.round(120 + baseLvl * 42 + i * 15);
        list.push({
          id: i === 0 && mapId ? mapId : `enemy_${Date.now()}_${i}`,
          name: pick.name,
          avatar: pick.avatar,
          level: baseLvl + (i === count - 1 ? 1 : 0),
          hp,
          maxHp: hp,
          atk: Math.round(14 + baseLvl * 4.5),
          def: Math.round(6 + baseLvl * 2.5),
          stance: stances[(zoneIdx + i) % stances.length]
        });
      }
      this.jrpgBattle.enemies = list;
    }

    this.jrpgBattle.selectedTargetIdx = 0;
    const first = this.jrpgBattle.enemies[0];
    if (first) {
      this.currentEnemy = {
        id: first.id,
        name: first.name,
        avatar: first.avatar,
        hp: first.hp,
        maxHp: first.maxHp,
        atk: first.atk,
        def: first.def,
        isBoss: !!first.isBoss
      };
    }
  }

  private flashSkillBanner(text: string, actorId = 'leader') {
    this.jrpgBattle.skillBanner = text;
    this.jrpgBattle.actingUnitId = actorId;
    setTimeout(() => {
      if (this.jrpgBattle.skillBanner === text) {
        this.jrpgBattle.skillBanner = null;
        this.jrpgBattle.actingUnitId = null;
      }
    }, 900);
  }

  private getActiveTarget(): BattleUnitEnemy | null {
    const alive = this.jrpgBattle.enemies.filter(e => e.hp > 0);
    if (alive.length === 0) return null;
    const picked = this.jrpgBattle.enemies[this.jrpgBattle.selectedTargetIdx];
    if (picked && picked.hp > 0) return picked;
    const firstAliveIdx = this.jrpgBattle.enemies.findIndex(e => e.hp > 0);
    this.jrpgBattle.selectedTargetIdx = Math.max(0, firstAliveIdx);
    return this.jrpgBattle.enemies[this.jrpgBattle.selectedTargetIdx] || null;
  }

  /**
   * 指令 1：【⚔️ 拔刀連斬 (Attack)】— 主角與兩名夥伴協同普攻，回復氣力 SP 與怒氣 POW
   */
  public cmdAttack() {
    if (!this.player.characterCreated) return;
    if (this.jrpgBattle.enemies.filter(e => e.hp > 0).length === 0) {
      this.spawnEncounterGroup(false);
    }

    const stats = this.calculatedStats;
    const target = this.getActiveTarget();
    if (!target) return;

    this.flashSkillBanner(`⚔️ 【拔刀連攜斬】`, 'leader');

    // 1. 主角斬擊
    const curStance = FIVE_RINGS_STANCES[this.player.stance] || FIVE_RINGS_STANCES.earth;
    const isCounter = curStance.counters === target.stance;
    const isCrit = Math.random() * 100 < stats.critRate;
    const mult = (isCounter ? 1.35 : 1.0) * (isCrit ? stats.critDmg / 100 : 1.0);
    const dmg1 = Math.max(1, Math.round(stats.atk * mult * (0.95 + Math.random() * 0.15)));
    target.hp = Math.max(0, target.hp - dmg1);

    this.party[0].sp = Math.min(this.party[0].maxSp, this.party[0].sp + 14);
    this.party[0].pow = Math.min(100, this.party[0].pow + 22);

    const logLines: string[] = [
      `🗡️ 【${this.party[0].name}】揮刀斬向 ${target.name}，造成 ${dmg1.toLocaleString()} 點${isCrit ? '暴擊' : ''}傷害！${isCounter ? '（☯️五輪相剋破防！）' : ''}`
    ];

    // 2. 巫女・神無月楓 破魔靈矢協同追擊
    const nextTarget1 = this.getActiveTarget();
    if (nextTarget1 && this.party[1].hp > 0) {
      const kaedeDmg = Math.max(1, Math.round(stats.atk * 0.65 * (0.9 + Math.random() * 0.2)));
      nextTarget1.hp = Math.max(0, nextTarget1.hp - kaedeDmg);
      this.party[1].sp = Math.min(this.party[1].maxSp, this.party[1].sp + 12);
      logLines.push(`🏹 【神無月楓】射出「破魔靈矢」追擊 ${nextTarget1.name}，造成 ${kaedeDmg.toLocaleString()} 點傷害！`);
    }

    // 3. 忍者・影縫疾風 迅雷苦無協同追擊
    const nextTarget2 = this.getActiveTarget();
    if (nextTarget2 && this.party[2].hp > 0) {
      const hayateDmg = Math.max(1, Math.round(stats.atk * 0.72 * (0.9 + Math.random() * 0.2)));
      nextTarget2.hp = Math.max(0, nextTarget2.hp - hayateDmg);
      this.party[2].sp = Math.min(this.party[2].maxSp, this.party[2].sp + 12);
      logLines.push(`🥷 【影縫疾風】瞬身施展「影縫二連苦無」命中 ${nextTarget2.name}，造成 ${hayateDmg.toLocaleString()} 點傷害！`);
    }

    this.lastSlashEvent = { tick: this.lastSlashEvent.tick + 1, damage: dmg1, isCrit };
    audio.playSlash(isCrit);

    this.finishPlayerTurnAndEnemyPhase(logLines, false);
  }

  /**
   * 指令 2：【📜 劍技・秘術 (Skills)】— 消耗 SP 施展二天一流劍技、巫女神樂祈禱或伊賀忍法
   */
  public cmdSkill(skillId: string) {
    if (!this.player.characterCreated) return;
    const skill = JRPG_PARTY_SKILLS.find(s => s.id === skillId) || JRPG_PARTY_SKILLS[0];
    const caster = this.party.find(p => p.id === skill.caster) || this.party[0];

    if (caster.sp < skill.spCost) {
      this.showToast(`氣力 (SP) 不足！【${skill.name}】需 ${skill.spCost} SP（可使用抹茶或普攻回氣）`, 'warning');
      return;
    }

    caster.sp -= skill.spCost;
    this.party[0].pow = Math.min(100, this.party[0].pow + 25);
    this.flashSkillBanner(`${skill.icon} 【${caster.name}】施展《${skill.name}》！`, caster.id);

    const stats = this.calculatedStats;
    const logLines: string[] = [];

    if (skill.target === 'heal_party') {
      for (const m of this.party) {
        const healAmt = Math.round(m.maxHp * skill.mult);
        m.hp = Math.min(m.maxHp, m.hp + healAmt);
      }
      audio.playLootChime();
      logLines.push(`🌸 【${caster.name}】搖動神樂鈴吟唱《${skill.name}》！全隊回復 55% 生命值！`);
    } else if (skill.target === 'all') {
      let totalHit = 0;
      for (const en of this.jrpgBattle.enemies) {
        if (en.hp <= 0) continue;
        const dmg = Math.max(1, Math.round(stats.atk * skill.mult * (0.95 + Math.random() * 0.15)));
        en.hp = Math.max(0, en.hp - dmg);
        if (skill.id === 'raikiri') en.defBrokenTurns = 2;
        totalHit += dmg;
      }
      this.lastSlashEvent = { tick: this.lastSlashEvent.tick + 1, damage: totalHit, isCrit: true };
      audio.playSlash(true);
      logLines.push(`${skill.icon} 【${caster.name}】奧義《${skill.name}》橫掃敵陣全體，合計造成 ${totalHit.toLocaleString()} 點傷害！`);
    } else {
      const target = this.getActiveTarget();
      if (!target) return;
      const isCrit = skill.id === 'iaido' || Math.random() * 100 < stats.critRate + 25;
      const dmg = Math.max(1, Math.round(stats.atk * skill.mult * (isCrit ? stats.critDmg / 100 : 1.1)));
      target.hp = Math.max(0, target.hp - dmg);
      this.lastSlashEvent = { tick: this.lastSlashEvent.tick + 1, damage: dmg, isCrit };
      audio.playSlash(true);
      logLines.push(`${skill.icon} 【${caster.name}】施展秘傳《${skill.name}》斬擊 ${target.name}，造成 ${dmg.toLocaleString()} 點致命傷害！`);
    }

    this.finishPlayerTurnAndEnemyPhase(logLines, false);
  }

  /**
   * 指令 3：【💥 超奧義・天覇封神斬 (POW 100% Bushido Overdrive)】
   */
  public cmdBushidoOverdrive() {
    if (!this.player.characterCreated) return;
    const leader = this.party[0];
    if (leader.pow < 100) {
      this.showToast(`🔥 怒氣槽 (POW) 尚未滿載（目前 ${leader.pow}% / 100%）！`, 'warning');
      return;
    }

    leader.pow = 0;
    this.flashSkillBanner(`🔥 武士道極意《二天一流・天覇封神斬》！！`, 'leader');

    const stats = this.calculatedStats;
    let totalDmg = 0;
    for (const en of this.jrpgBattle.enemies) {
      if (en.hp <= 0) continue;
      const dmg = Math.max(1, Math.round(stats.atk * 4.5 * (stats.critDmg / 100)));
      en.hp = Math.max(0, en.hp - dmg);
      totalDmg += dmg;
    }

    // 超奧義同時鼓舞全隊回復 30% HP
    for (const m of this.party) {
      m.hp = Math.min(m.maxHp, m.hp + Math.round(m.maxHp * 0.3));
    }

    this.lastSlashEvent = { tick: this.lastSlashEvent.tick + 1, damage: totalDmg, isCrit: true };
    audio.playAchievementFanfare();

    const logLines = [
      `🔥 【${leader.name}】怒氣爆發！拔出雙刀施展武士道列傳超必殺《天覇封神斬》！對全體敵人造成 ${totalDmg.toLocaleString()} 點毀滅性神聖傷害！`
    ];
    this.finishPlayerTurnAndEnemyPhase(logLines, false);
  }

  /**
   * 指令 4：【🛡️ 納刀見切・心眼 (Defend)】— 本回合減傷 65%，全隊回復 SP 與怒氣 POW
   */
  public cmdDefend() {
    this.flashSkillBanner(`🛡️ 【納刀見切・明鏡止水】`, 'leader');
    for (const m of this.party) {
      m.sp = Math.min(m.maxSp, m.sp + Math.round(m.maxSp * 0.35));
      m.pow = Math.min(100, m.pow + 30);
    }
    audio.playCoin();
    const logLines = [
      `🛡️ 小隊全員擺出「納刀見切」守勢！氣力 SP 大幅回復 +35%，怒氣 POW +30%，並準備看破敵方攻勢！`
    ];
    this.finishPlayerTurnAndEnemyPhase(logLines, true);
  }

  /**
   * 指令 5：【🍡 行囊道具 (Items)】
   */
  public cmdUseItem(itemId: 'dango' | 'matcha' | 'sake' | 'elixir') {
    if (!this.player.consumables || (this.player.consumables[itemId] || 0) <= 0) {
      this.showToast(`行囊中的道具已用盡！可前往城下町茶屋購買補充`, 'warning');
      return;
    }

    this.player.consumables[itemId]--;
    const spec = JRPG_CONSUMABLES.find(i => i.id === itemId)!;
    this.flashSkillBanner(`${spec.icon} 使用【${spec.name}】！`, 'leader');
    audio.playLootChime();

    if (itemId === 'dango') {
      for (const m of this.party) m.hp = Math.min(m.maxHp, m.hp + Math.round(m.maxHp * 0.6));
    } else if (itemId === 'matcha') {
      for (const m of this.party) m.sp = Math.min(m.maxSp, m.sp + Math.round(m.maxSp * 0.65));
    } else if (itemId === 'sake') {
      this.party[0].pow = 100;
    } else if (itemId === 'elixir') {
      for (const m of this.party) {
        m.hp = m.maxHp;
        m.sp = m.maxSp;
      }
    }

    const logLines = [`${spec.icon} 小隊使用了【${spec.name}】！${spec.desc}！`];
    this.finishPlayerTurnAndEnemyPhase(logLines, false);
  }

  /**
   * 指令 6：【⚡ 全員總攻・AI 戰術委任】— 智慧判斷施放補血、超奧義或範圍劍技
   */
  public cmdAllOutAttack() {
    const leader = this.party[0];
    const kaede = this.party[1];
    if (leader.pow >= 100) {
      this.cmdBushidoOverdrive();
      return;
    }
    if (this.party.some(m => m.hp < m.maxHp * 0.45) && kaede.sp >= 20) {
      this.cmdSkill('kagura_heal');
      return;
    }
    const aliveCount = this.jrpgBattle.enemies.filter(e => e.hp > 0).length;
    if (aliveCount >= 2 && leader.sp >= 32) {
      this.cmdSkill('kasha');
      return;
    }
    if (leader.sp >= 15) {
      this.cmdSkill('iaido');
      return;
    }
    this.cmdAttack();
  }

  /**
   * 結算玩家回合並執行敵方回合反擊
   */
  private finishPlayerTurnAndEnemyPhase(playerLogs: string[], isDefending: boolean) {
    const aliveEnemies = this.jrpgBattle.enemies.filter(e => e.hp > 0);
    const firstAlive = aliveEnemies[0] || this.jrpgBattle.enemies[0];
    if (firstAlive) {
      this.currentEnemy.hp = firstAlive.hp;
      this.currentEnemy.maxHp = firstAlive.maxHp;
      this.currentEnemy.name = firstAlive.name;
      this.currentEnemy.avatar = firstAlive.avatar;
    }

    // 若敵方全滅，觸發 JRPG 戰鬥勝利結算！
    if (aliveEnemies.length === 0) {
      const defeatedCount = Math.max(1, this.jrpgBattle.enemies.length);
      playerLogs.push(`🎉 【戰鬥勝利】成功討伐敵陣（共 ${defeatedCount} 名妖魔）！`);
      this.jrpgBattle.logs = [...playerLogs, ...this.jrpgBattle.logs].slice(0, 12);
      this.onEnemyGroupDefeated(defeatedCount);
      return;
    }

    // 敵方存活單位進行反擊
    const stats = this.calculatedStats;
    for (const en of aliveEnemies) {
      const targetMember = this.party[Math.floor(Math.random() * this.party.length)];
      const rawEnemyDmg = Math.max(4, en.atk - Math.round(stats.def * 0.45));
      const finalDmg = Math.max(1, Math.round(rawEnemyDmg * (isDefending ? 0.35 : 0.85)));
      targetMember.hp = Math.max(1, targetMember.hp - finalDmg);
      targetMember.pow = Math.min(100, targetMember.pow + 10);
      playerLogs.push(`👹 ${en.name} 發動反擊，對【${targetMember.name}】造成 ${finalDmg} 點傷害！${isDefending ? '（見切減傷！）' : ''}`);
    }

    this.jrpgBattle.round++;
    this.jrpgBattle.logs = [...playerLogs, ...this.jrpgBattle.logs].slice(0, 12);
    this.save();
  }

  private onEnemyGroupDefeated(count: number) {
    for (let i = 0; i < count; i++) {
      this.player.statsTracked.totalKills++;
      this.advanceQuests();
    }
    if (this.jrpgBattle.enemies.some(e => e.isBoss)) {
      this.player.statsTracked.bossKills++;
    }
    this.mapEnemyDefeatedTick++;

    const expGain = Math.round((28 + this.player.level * 10) * count);
    const goldGain = Math.round((22 + this.player.level * 8) * count);
    this.addExp(expGain);
    this.player.gold += goldGain;
    this.player.iron += count;

    if (Math.random() < 0.75) {
      const g = generateGear(null, undefined, this.player.level);
      this.addGearToInventory(g);
    }

    this.checkAchievements();
    // 自動補充下一波可挑戰敵軍編隊
    setTimeout(() => {
      this.spawnEncounterGroup(false);
    }, 450);
    this.save();
  }

  // 向下相容舊介面呼叫
  public manualSlash() {
    this.cmdAttack();
  }

  public castArtBurst() {
    if (this.party[0].pow >= 100) {
      this.cmdBushidoOverdrive();
    } else {
      this.cmdSkill('tsubame');
    }
  }

  public executeSlash(_isAuto = false, _burstMultiplier = 1.0) {
    this.cmdAttack();
  }

  public toggleAutoSlash() {
    this.cmdAllOutAttack();
  }

  public navigateToZone(zoneNameOrId: string) {
    const zoneId = resolveZoneIdFromName(zoneNameOrId);
    this.player.currentMapZone = zoneId;
    this.activeTab = 'battle';
    this.navRequest = { zoneId, timestamp: Date.now() };
    this.spawnEncounterGroup(false);
  }

  public openMapChest(chestId: string, chestName: string) {
    if (this.openedChests[chestId]) {
      const bonusGold = 180 + this.player.level * 45;
      this.player.gold += bonusGold;
      audio.playCoin();
      this.showToast(`🎁 再次探索【${chestName}】，尋獲町民奉納的軍資金 +${bonusGold} 兩！`, 'info');
      return;
    }
    this.openedChests[chestId] = true;
    const qualities: ('rare' | 'epic' | 'legendary')[] = ['rare', 'epic', 'legendary'];
    const q = qualities[Math.min(2, Math.floor(Math.random() * 2 + (this.player.level >= 10 ? 1 : 0)))];
    const g = generateGear(null, q, this.player.level);
    this.addGearToInventory(g);
    audio.playLootChime();
    this.showToast(`🎁 開啟【${chestName}】！尋獲傳奇名物【${g.name}】！`, 'success');
    this.save();
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

    for (const sq of SIDE_QUESTS) {
      if (this.player.quests.completedSide.includes(sq.id)) continue;
      const curSqProg = (this.player.quests.sideProgress[sq.id] || 0) + 1;
      this.player.quests.sideProgress[sq.id] = curSqProg;
      break;
    }

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
      this.showToast(`🎉 劍境突破！領悟【${tierMeta.name}】！`, 'success');
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

    this.showToast(`📜 完成主線章節【${quest.title}】！`, 'success');
    this.openStoryModal(quest.title, quest.chapter || '新武士道列傳', quest.npc, quest.dialogue, quest.lore);

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

    this.showToast(`💰 領取街坊奉行所懸賞謝禮！金幣 +${b.quest.rewards.gold}`, 'success');
    audio.playCoin();

    this.player.quests.bounties[idx] = {
      id: 'bounty_' + Date.now(),
      quest: generateProceduralBounty(this.player.level),
      progress: 0
    };
    this.save();
  }

  public addExp(amount: number) {
    this.player.exp += amount;
    while (this.player.exp >= this.player.maxExp) {
      this.player.exp -= this.player.maxExp;
      this.player.level++;
      this.player.talentPoints += 1;
      this.player.maxExp = Math.round(this.player.maxExp * 1.25);
      this.syncPartyStats(true);
      this.showToast(`🌟 小隊突破升級！達到 Lv.${this.player.level}！全隊 HP/SP 完全回復並獲 1 點天賦！`, 'success');
      audio.playAchievementFanfare();
    }
  }

  public addGearToInventory(gear: GearItem) {
    if (!gear) return;
    this.player.statsTracked.gearLooted++;
    if (gear.quality === 'legendary') this.player.statsTracked.legendaryLooted++;
    if (gear.quality === 'ancient') this.player.statsTracked.ancientLooted++;

    if (this.player.inventory.length >= 50) {
      const mats = decomposeGear(gear);
      this.player.iron += mats.iron;
      return;
    }

    this.player.inventory.push(gear);
    if (['legendary', 'ancient'].includes(gear.quality)) {
      audio.playLootChime();
      this.showToast(`🌟 獲得稀世名刀武具【${gear.name}】！`, 'success');
    }
  }

  public equipGear(uid: string) {
    const idx = this.player.inventory.findIndex(g => g.uid === uid);
    if (idx === -1) return;
    const gear = this.player.inventory.splice(idx, 1)[0];
    const prev = this.player.equipped[gear.slot];

    this.player.equipped[gear.slot] = gear;
    if (prev) this.player.inventory.push(prev);

    this.syncPartyStats(false);
    this.showToast(`已裝備【${gear.name}】！`, 'info');
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
    this.syncPartyStats(false);
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
    this.syncPartyStats(false);
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
      this.showToast(`⚡ 一鍵穿戴了 ${changed} 件更高戰力名器！`, 'success');
    } else {
      this.showToast(`目前已穿戴最佳武具，無須更換`, 'info');
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
      this.showToast(`🏆 御前試合獲勝！武道段位積分 +${opp.ratingGain}！`, 'success');
      audio.playAchievementFanfare();
    } else {
      this.player.pvp.losses++;
      this.player.pvp.streak = 0;
      this.player.pvp.rating = Math.max(1000, this.player.pvp.rating - 12);
      this.showToast(`🍵 御前試合惜敗！積分 -12`, 'warning');
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
      this.showToast(`🌌 成功突破千層奈落第 ${curFloor} 層！獲得魂玉 +${floorData.rewards.souls}！`, 'success');
      audio.playAchievementFanfare();
    } else {
      this.showToast(`🍵 奈落第 ${curFloor} 層挑戰惜敗！建議切換為【${floorData.recommendedStanceName}】再戰！`, 'warning');
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
      this.showToast(`今日奉行所配給已領取，明日再來！`, 'info');
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
    this.showToast(`🎉 成功領取第 ${nextDay} 天奉行所軍資：${rw.desc}`, 'success');
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
    if (!this.player.consumables) {
      this.player.consumables = { dango: 5, matcha: 4, sake: 2, elixir: 1 };
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
    this.syncPartyStats(true);
    this.spawnEncounterGroup(false);
    this.save();
    this.showToast(`⚔️ 歡迎來到《新武士道列傳 RPG》！與夥伴神無月楓、影縫疾風一同踏上天明冒險！`, 'success');

    const m01 = MAIN_QUESTS[0];
    if (m01) {
      this.openStoryModal(m01.title, m01.chapter || '新武士道列傳・序章', m01.npc, m01.dialogue, m01.lore);
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
      }
    } catch {
      // Ignored
    }
  }
}

export const gameStore = new GameStoreClass();
