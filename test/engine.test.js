const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

function createMockElement(id = '') {
  const el = {
    id,
    textContent: '',
    innerHTML: '',
    value: '1',
    disabled: false,
    options: [{ value: '1', textContent: 'Zone 1' }],
    children: [],
    style: { width: '0%', display: 'block', opacity: '1', cursor: 'pointer', background: '', borderColor: '', color: '' },
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); },
      remove(c) { this._classes.delete(c); },
      contains(c) { return this._classes.has(c); },
      toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
    },
    setAttribute(k, v) { this[k] = v; },
    getAttribute(k) { return this[k] || null; },
    appendChild(child) {
      this.children.push(child);
      child.parentNode = this;
      return child;
    },
    removeChild(child) {
      const idx = this.children.indexOf(child);
      if (idx >= 0) this.children.splice(idx, 1);
      return child;
    },
    remove() {
      if (this.parentNode && this.parentNode.removeChild) {
        this.parentNode.removeChild(this);
      }
    },
    get firstChild() {
      return this.children[0] || null;
    },
    addEventListener() {},
    removeEventListener() {},
    querySelectorAll() { return []; }
  };
  return el;
}

let activeGames = [];

function setupMockEnvironment(clearStorage = true) {
  const elements = new Map();

  global.window = global;
  global.window.__TESTING__ = true;

  if (clearStorage || !global.localStorage) {
    global.localStorage = {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    };
  }

  global.document = {
    readyState: 'complete',
    documentElement: { lang: 'zh-TW' },
    title: '',
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, createMockElement(id));
      }
      return elements.get(id);
    },
    createElement(tag) {
      return createMockElement(tag);
    },
    querySelectorAll(selector) {
      return [];
    },
    addEventListener() {},
    body: createMockElement('body')
  };

  global.alert = () => {};
  global.confirm = () => true;

  global.window.samuraiAudio = {
    playSlash: () => {},
    playCrit: () => {},
    playClash: () => {},
    playSharpen: () => {},
    playHammer: () => {},
    playLevelUp: () => {},
    playBossBoom: () => {},
    playAchievementFanfare: () => {},
    ensureContext: () => {},
    toggle: () => {},
    enabled: true
  };

  // Load all game data and scripts
  eval(fs.readFileSync('data/i18n.js', 'utf8'));
  eval(fs.readFileSync('data/swords.js', 'utf8'));
  eval(fs.readFileSync('data/items.js', 'utf8'));
  eval(fs.readFileSync('data/enemies.js', 'utf8'));
  eval(fs.readFileSync('data/story.js', 'utf8'));
  eval(fs.readFileSync('data/prestige.js', 'utf8'));
  eval(fs.readFileSync('data/achievements.js', 'utf8'));
  eval(fs.readFileSync('data/dimensions.js', 'utf8'));
  eval(fs.readFileSync('src/game.js', 'utf8'));
}

describe('Game Engine & Mechanics (src/game.js)', () => {
  let game;

  beforeEach(() => {
    setupMockEnvironment(true);
    game = new SamuraiGame();
    activeGames.push(game);
  });

  afterEach(() => {
    while (activeGames.length > 0) {
      const g = activeGames.pop();
      if (g && g.destroy) g.destroy();
    }
  });

  it('initializes default player state correctly', () => {
    assert.equal(game.player.level, 1);
    assert.equal(game.player.gold, 100);
    assert.equal(game.player.steel, 30);
    assert.ok(game.player.equipped.weapon, 'Must start with an equipped weapon');
    assert.equal(game.player.equipped.weapon.id, 'sword_01');
    assert.equal(game.player.story.faction, 'unaligned');
    assert.equal(game.player.story.currentAct, 1);
    assert.equal(game.player.prestige.reincarnationCount, 0);
    assert.equal(game.player.prestige.karma, 0);
  });

  it('calculates player combat stats correctly with weapon and perks', () => {
    const baseStats = game.getCalculatedStats();
    assert.ok(baseStats.atk >= 25, `Base ATK should be >= 25, got ${baseStats.atk}`);
    assert.ok(baseStats.maxHp >= 300, `Base HP should be >= 300, got ${baseStats.maxHp}`);
    assert.ok(baseStats.speed > 0, `Speed should be positive, got ${baseStats.speed}`);

    // Invest into Shinkage dojo skill (+2% crit, +5% crit dmg)
    game.player.skills.shinkage = 2;
    const boostedStats = game.getCalculatedStats();
    assert.equal(boostedStats.crit, baseStats.crit + 4);
    assert.equal(boostedStats.critDmg, baseStats.critDmg + 10);
  });

  it('applies faction passive bonuses to stats', () => {
    const unalignedStats = game.getCalculatedStats();

    // Shogunate faction (+35% HP, +30% DEF)
    game.player.story.faction = 'shogunate';
    const shogunateStats = game.getCalculatedStats();
    assert.ok(shogunateStats.maxHp > unalignedStats.maxHp, 'Shogunate should grant bonus HP');
    assert.ok(shogunateStats.def > unalignedStats.def, 'Shogunate should grant bonus DEF');

    // Ishin faction (+35% ATK, +20% Speed)
    game.player.story.faction = 'ishin';
    const ishinStats = game.getCalculatedStats();
    assert.ok(ishinStats.atk > unalignedStats.atk, 'Ishin should grant bonus ATK');
    assert.ok(ishinStats.speed > unalignedStats.speed, 'Ishin should grant bonus Speed');

    // Shura faction (+75% CRIT DMG, +40% Armor Pen)
    game.player.story.faction = 'shura';
    const shuraStats = game.getCalculatedStats();
    assert.ok(shuraStats.critDmg > unalignedStats.critDmg, 'Shura should grant bonus CRIT DMG');
    assert.ok(shuraStats.armorPen >= unalignedStats.armorPen + 40, 'Shura should grant bonus Armor Pen');
  });

  it('simulates combat attack and enemy defeat', () => {
    game.spawnEnemy();
    const enemy = game.currentEnemy;
    assert.ok(enemy, 'Enemy should be spawned');
    const initialEnemyHp = enemy.hp;

    // Player attacks
    game.attack(true);
    assert.ok(enemy.hp < initialEnemyHp, 'Enemy HP should decrease after attack');

    // Defeat enemy
    enemy.hp = 0;
    const prevGold = game.player.gold;
    const prevExp = game.player.exp;
    game.handleEnemyDefeated();

    assert.ok(game.player.gold > prevGold, 'Player should gain gold upon defeating enemy');
    assert.ok(game.player.exp > prevExp, 'Player should gain EXP upon defeating enemy');
    assert.equal(game.zoneKillProgress, 1, 'Zone kill progress should increment');
  });

  it('whetstone sharpening enhances weapon attack power and level', () => {
    const weapon = game.player.equipped.weapon;
    const initialRefine = weapon.refine || 0;
    game.player.items.mat_whetstone_rough = 1;

    game.sharpenWeapon('mat_whetstone_rough');
    assert.equal(weapon.refine, initialRefine + 1);
    assert.equal(game.player.items.mat_whetstone_rough, 0);
  });

  it('story act completion advances acts and records milestones', () => {
    game.completeAct(1);
    assert.ok(game.player.story.completedActs.includes(1), 'Act 1 should be completed');
    assert.equal(game.player.story.currentAct, 2, 'Current act should advance to 2');
  });

  it('prestige reincarnation resets level and zone while preserving karma and swords', () => {
    game.player.level = 20;
    game.player.stats.highestZone = 4;
    game.player.stats.bossKills = 5;
    game.player.gold = 5000;
    game.player.story.faction = 'shura';

    const swordsBefore = game.player.swordsInventory.length;
    const karmaEarned = window.PRESTIGE_DATA.calculateKarmaEarned(game.player);
    assert.ok(karmaEarned > 0);

    // Perform Reincarnation
    game.reincarnate();

    assert.equal(game.player.level, 1, 'Level should reset to 1 (with 0 wisdom perk)');
    assert.equal(game.player.stats.currentZone, 1, 'Zone should reset to 1');
    assert.equal(game.player.story.faction, 'unaligned', 'Faction should reset to unaligned');
    assert.equal(game.player.prestige.reincarnationCount, 1, 'Reincarnation count should increment');
    assert.equal(game.player.prestige.karma, karmaEarned, 'Karma should be awarded');
    assert.equal(game.player.swordsInventory.length, swordsBefore, 'Swords should be preserved');
  });

  it('prestige perks can be purchased and leveled up', () => {
    game.player.prestige.karma = 500;
    const cost = window.PRESTIGE_DATA.getPerkCost('perk_atk', 0);

    game.upgradePrestigePerk('perk_atk');
    assert.equal(game.player.prestige.perks.perk_atk, 1);
    assert.equal(game.player.prestige.karma, 500 - cost);
  });

  it('save and load preserves full game state', () => {
    game.player.level = 15;
    game.player.gold = 12345;
    game.player.steel = 678;
    game.player.story.faction = 'shogunate';

    game.save();
    const savedStr = global.localStorage.getItem(game.SAVE_KEY);
    assert.ok(savedStr, 'Save string must exist in localStorage');

    // Create a new game instance without wiping storage and verify load
    const newGame = new SamuraiGame();
    activeGames.push(newGame);
    newGame.load();
    assert.equal(newGame.player.level, 15);
    assert.equal(newGame.player.gold, 12345);
    assert.equal(newGame.player.steel, 678);
    assert.equal(newGame.player.story.faction, 'shogunate');
  });

  it('export and import save data via Base64 code round-trip', () => {
    game.player.level = 42;
    game.player.gold = 99999;
    const exportedCode = btoa(encodeURIComponent(JSON.stringify(game.player)));
    assert.ok(exportedCode.length > 50);

    const decoded = JSON.parse(decodeURIComponent(atob(exportedCode)));
    assert.equal(decoded.level, 42);
    assert.equal(decoded.gold, 99999);
  });

  it('switches languages smoothly without crashing', () => {
    window.setLanguage('en');
    assert.equal(window.getLang(), 'en');

    window.setLanguage('ja');
    assert.equal(window.getLang(), 'ja');

    window.setLanguage('zh-TW');
    assert.equal(window.getLang(), 'zh-TW');
  });

  it('tracks achievement progress accurately across game activities', () => {
    const achKill1 = window.ACHIEVEMENTS_DATA.find(a => a.id === 'ach_kill_1');
    const achBoss1 = window.ACHIEVEMENTS_DATA.find(a => a.id === 'ach_boss_1');
    const achLevel10 = window.ACHIEVEMENTS_DATA.find(a => a.id === 'ach_level_10');

    // Initially 0 kills, 0 boss kills, level 1
    assert.equal(game.getAchievementProgress(achKill1).isCompleted, false);
    assert.equal(game.getAchievementProgress(achBoss1).isCompleted, false);
    assert.equal(game.getAchievementProgress(achLevel10).isCompleted, false);

    // After 1 kill
    game.player.stats.totalKills = 1;
    const progKill1 = game.getAchievementProgress(achKill1);
    assert.equal(progKill1.current, 1);
    assert.equal(progKill1.isCompleted, true);
    assert.equal(progKill1.isClaimed, false);

    // After reaching level 10
    game.player.level = 10;
    const progLevel10 = game.getAchievementProgress(achLevel10);
    assert.equal(progLevel10.current, 10);
    assert.equal(progLevel10.isCompleted, true);
  });

  it('allows claiming completed achievements and grants rewards correctly', () => {
    const achKill1 = window.ACHIEVEMENTS_DATA.find(a => a.id === 'ach_kill_1');
    game.player.stats.totalKills = 1;

    const initialGold = game.player.gold;
    const initialSteel = game.player.steel;

    game.claimAchievement('ach_kill_1');

    assert.ok(game.player.achievements.claimed.includes('ach_kill_1'));
    assert.equal(game.player.gold, initialGold + achKill1.reward.gold);
    assert.equal(game.player.steel, initialSteel + achKill1.reward.steel);

    // Claiming again should have no effect
    const goldAfterFirst = game.player.gold;
    game.claimAchievement('ach_kill_1');
    assert.equal(game.player.gold, goldAfterFirst);
  });

  it('claimAllAchievements collects all completed unclaimed achievements', () => {
    game.player.stats.totalKills = 50; // satisfies ach_kill_1 and ach_kill_50
    game.player.stats.bossKills = 1;   // satisfies ach_boss_1
    game.player.level = 10;           // satisfies ach_level_10

    const initialGold = game.player.gold;
    const initialSteel = game.player.steel;

    game.claimAllAchievements();

    assert.ok(game.player.achievements.claimed.includes('ach_kill_1'));
    assert.ok(game.player.achievements.claimed.includes('ach_kill_50'));
    assert.ok(game.player.achievements.claimed.includes('ach_boss_1'));
    assert.ok(game.player.achievements.claimed.includes('ach_level_10'));
    assert.ok(game.player.gold > initialGold);
    assert.ok(game.player.steel > initialSteel);
  });

  it('filterAchievements switches category filter without throwing errors', () => {
    game.filterAchievements('combat');
    assert.equal(game.activeAchFilter, 'combat');

    game.filterAchievements('swords');
    assert.equal(game.activeAchFilter, 'swords');

    game.filterAchievements('all');
    assert.equal(game.activeAchFilter, 'all');
  });

  it('triggers Diablo 3 style center achievement banner and sound fanfare when unlocking achievements', () => {
    let fanfarePlayed = false;
    global.window.samuraiAudio.playAchievementFanfare = () => { fanfarePlayed = true; };

    const ach = window.ACHIEVEMENTS_DATA[0];
    game.showAchievementToast(ach);

    assert.equal(fanfarePlayed, true, 'playAchievementFanfare should be called');
    const container = document.getElementById('achievement-toast-container');
    assert.ok(container.children.length > 0, 'Container should hold the banner');
    const banner = container.children[0];
    assert.equal(banner.className, 'd3-achievement-banner');
    assert.ok(banner.innerHTML.includes('d3-ach-flare'), 'Banner should include radial flare');
    assert.ok(banner.innerHTML.includes('d3-ach-sheen'), 'Banner should include light sheen streak');
    assert.ok(banner.innerHTML.includes('d3-ach-crest-wrap'), 'Banner should include crest medallion');
  });

  it('starts in tactile manual mode (autoSlashEnabled = false) and manual strike grants extra gold & Sword Qi', () => {
    assert.equal(game.autoSlashEnabled, false, 'Should start in manual slash mode');
    game.spawnEnemy();
    const initialGold = game.player.gold;
    const initialQi = game.player.dimensions.swordQi;

    // Execute manual strike
    game.attack(true);

    assert.ok(game.player.gold > initialGold, 'Manual strike should award gold');
    assert.ok(game.player.dimensions.swordQi > initialQi, 'Manual strike should produce Sword Qi');
    assert.equal(game.comboCount, 1, 'Combo count should increment');

    // Toggle auto slash
    game.toggleAutoSlash();
    assert.equal(game.autoSlashEnabled, true);
    game.toggleAutoSlash();
    assert.equal(game.autoSlashEnabled, false);
  });

  it('cascading sword dimensions produce lower tiers and sword qi (Antimatter Dimensions style)', () => {
    game.player.gold = 50000;
    // Buy Tier 1
    const bought1 = game.buyDimensionTier(1);
    assert.equal(bought1, true);
    assert.equal(game.player.dimensions.tiers[1].amount, 1);
    assert.equal(game.player.dimensions.tiers[1].bought, 1);

    // Buy Tier 2
    const bought2 = game.buyDimensionTier(2);
    assert.equal(bought2, true);
    assert.equal(game.player.dimensions.tiers[2].amount, 1);

    const initialTier1 = game.player.dimensions.tiers[1].amount;
    const initialQi = game.player.dimensions.swordQi;

    // Simulate tick (1 second)
    game.tickDimensions(1.0);

    // Tier 2 should have produced Tier 1
    assert.ok(game.player.dimensions.tiers[1].amount > initialTier1, 'Tier 2 should produce Tier 1');
    // Tier 1 should have produced Sword Qi
    assert.ok(game.player.dimensions.swordQi > initialQi, 'Tier 1 should produce Sword Qi');
  });

  it('every 10 dimension purchases doubles the tier multiplier (x2 multiplier)', () => {
    game.player.gold = 100000000;
    assert.equal(game.getDimensionTierMultiplier(1), 1);

    for (let i = 0; i < 10; i++) {
      game.buyDimensionTier(1);
    }
    assert.equal(game.player.dimensions.tiers[1].bought, 10);
    assert.equal(game.getDimensionTierMultiplier(1), 2);

    for (let i = 0; i < 10; i++) {
      game.buyDimensionTier(1);
    }
    assert.equal(game.player.dimensions.tiers[1].bought, 20);
    assert.equal(game.getDimensionTierMultiplier(1), 4);
  });

  it('tickspeed upgrade accelerates dimension production and Max All buys available tiers', () => {
    game.player.gold = 1000000;
    const initialEffective = game.getEffectiveTickspeed();
    game.buyTickspeed();
    assert.equal(game.player.dimensions.tickspeedBought, 1);
    assert.ok(game.getEffectiveTickspeed() > initialEffective);

    // Max All
    game.maxAllDimensions();
    assert.ok(game.player.dimensions.tickspeedBought > 1);
    assert.ok(game.player.dimensions.tiers[1].bought > 0);
  });

  it('dimension shift unlocks next tier and resets lower dimensions', () => {
    game.player.dimensions.tiers[4].amount = 25;
    assert.equal(game.canDimensionShift(), true);

    const initialShifts = game.player.dimensions.shifts;
    const initialMaxTier = game.getDimensionMaxUnlocked();
    game.dimensionShift();

    assert.equal(game.player.dimensions.shifts, initialShifts + 1);
    assert.equal(game.getDimensionMaxUnlocked(), initialMaxTier + 1);
    assert.equal(game.player.dimensions.tiers[1].amount, 0, 'Lower dimensions should reset after shift');
  });
});


