const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// Setup mock global browser environment
before(() => {
  global.window = global;
  global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  };
  global.document = {
    documentElement: { lang: 'zh-TW' },
    title: '',
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener: () => {}
  };

  eval(fs.readFileSync('data/i18n.js', 'utf8'));
  eval(fs.readFileSync('data/swords.js', 'utf8'));
  eval(fs.readFileSync('data/items.js', 'utf8'));
  eval(fs.readFileSync('data/enemies.js', 'utf8'));
  eval(fs.readFileSync('data/story.js', 'utf8'));
  eval(fs.readFileSync('data/prestige.js', 'utf8'));
});

describe('1. Swords Database (data/swords.js)', () => {
  it('should contain exactly 22 authentic Japanese swords', () => {
    assert.equal(Array.isArray(window.SWORDS_DATA), true);
    assert.equal(window.SWORDS_DATA.length, 22);
  });

  it('each sword must have all required attributes with valid values', () => {
    const ids = new Set();
    const validTiers = [1, 2, 3, 4, 5, 6];

    for (const s of window.SWORDS_DATA) {
      assert.ok(s.id, 'Sword must have an id');
      assert.ok(!ids.has(s.id), `Duplicate sword ID: ${s.id}`);
      ids.add(s.id);

      assert.ok(typeof s.name === 'string' && s.name.length > 0, `Invalid name for ${s.id}`);
      assert.ok(typeof s.romaji === 'string' && s.romaji.length > 0, `Invalid romaji for ${s.id}`);
      assert.ok(validTiers.includes(s.tier), `Invalid tier ${s.tier} for ${s.id}`);
      assert.ok(typeof s.tierName === 'string', `Invalid tierName for ${s.id}`);
      assert.ok(s.color && s.color.startsWith('#'), `Invalid color for ${s.id}`);
      assert.ok(typeof s.type === 'string', `Invalid type for ${s.id}`);

      assert.ok(typeof s.atk === 'number' && s.atk > 0, `ATK must be positive for ${s.id}`);
      assert.ok(typeof s.crit === 'number' && s.crit >= 0, `CRIT must be non-negative for ${s.id}`);
      assert.ok(typeof s.critDmg === 'number' && s.critDmg >= 100, `CRIT DMG must be >= 100 for ${s.id}`);
      assert.ok(typeof s.speed === 'number' && s.speed > 0, `Speed must be positive for ${s.id}`);

      assert.ok(typeof s.passive === 'string', `Missing passive for ${s.id}`);
      assert.ok(typeof s.passiveDesc === 'string', `Missing passiveDesc for ${s.id}`);
      assert.ok(typeof s.lore === 'string' && s.lore.length > 10, `Missing lore for ${s.id}`);
      assert.ok(typeof s.svg === 'string' && s.svg.includes('<svg'), `Missing SVG for ${s.id}`);
    }
  });

  it('contains the Tenka-Goken (Five Heavenly Swords)', () => {
    const fiveSwordsIds = ['sword_15', 'sword_16', 'sword_17', 'sword_18', 'sword_19'];
    for (const fid of fiveSwordsIds) {
      const found = window.SWORDS_DATA.find(s => s.id === fid);
      assert.ok(found, `Missing Five Swords blade: ${fid}`);
      assert.equal(found.tierName, '天下五劍');
    }
  });
});

describe('2. Items Database (data/items.js)', () => {
  it('should contain all required categories', () => {
    assert.ok(window.ITEMS_DATA.materials, 'Missing materials');
    assert.ok(window.ITEMS_DATA.armors, 'Missing armors');
    assert.ok(window.ITEMS_DATA.helmets, 'Missing helmets');
    assert.ok(window.ITEMS_DATA.accessories, 'Missing accessories');
    assert.ok(window.ITEMS_DATA.consumables, 'Missing consumables');
  });

  it('materials should include Tamahagane and whetstones', () => {
    const matIds = window.ITEMS_DATA.materials.map(m => m.id);
    assert.ok(matIds.includes('mat_tamahagane'), 'Missing Tamahagane');
    assert.ok(matIds.includes('mat_whetstone_rough'), 'Missing rough whetstone');
    assert.ok(matIds.includes('mat_whetstone_mid'), 'Missing mid whetstone');
    assert.ok(matIds.includes('mat_whetstone_fine'), 'Missing fine whetstone');
  });

  it('all items should have unique IDs across all categories', () => {
    const allIds = new Set();
    for (const cat in window.ITEMS_DATA) {
      for (const item of window.ITEMS_DATA[cat]) {
        assert.ok(!allIds.has(item.id), `Duplicate item ID: ${item.id}`);
        allIds.add(item.id);
        assert.ok(item.name && item.name.length > 0);
        assert.ok(typeof item.desc === 'string');
      }
    }
  });
});

describe('3. Campaign Zones & Enemies (data/enemies.js)', () => {
  it('should have 7 full acts / zones', () => {
    assert.equal(Array.isArray(window.ZONES_DATA), true);
    assert.equal(window.ZONES_DATA.length, 7);
  });

  it('zones should have ascending required levels and valid enemies', () => {
    let lastLevel = 0;
    for (const z of window.ZONES_DATA) {
      assert.ok(z.requiredLevel >= lastLevel, `Required level must ascend for zone ${z.id}`);
      lastLevel = z.requiredLevel;

      assert.ok(z.name && z.name.length > 0);
      assert.ok(Array.isArray(z.enemies) && z.enemies.length >= 3, `Zone ${z.id} must have at least 3 regular enemies`);
      for (const e of z.enemies) {
        assert.ok(e.hp > 0, `Enemy HP must be positive in zone ${z.id}`);
        assert.ok(e.atk > 0, `Enemy ATK must be positive in zone ${z.id}`);
        assert.ok(e.exp > 0, `Enemy EXP must be positive in zone ${z.id}`);
      }

      assert.ok(z.boss, `Zone ${z.id} must have a boss`);
      assert.ok(z.boss.hp > z.enemies[0].hp, `Boss HP must be higher than common enemy in zone ${z.id}`);
      assert.ok(z.boss.atk > z.enemies[0].atk, `Boss ATK must be higher than common enemy in zone ${z.id}`);
    }
  });
});

describe('4. Story & Factions (data/story.js)', () => {
  it('should define all 4 destiny factions', () => {
    const factions = window.STORY_DATA.factions;
    assert.ok(factions.unaligned, 'Missing unaligned');
    assert.ok(factions.shogunate, 'Missing shogunate');
    assert.ok(factions.ishin, 'Missing ishin');
    assert.ok(factions.shura, 'Missing shura');

    assert.ok(factions.shogunate.bonus.maxHpMul > 0);
    assert.ok(factions.ishin.bonus.atkMul > 0);
    assert.ok(factions.shura.bonus.critDmgMul > 0);
  });

  it('should define 7 storyline chapters matching the 7 zones', () => {
    assert.equal(window.STORY_DATA.chapters.length, 7);
    for (let i = 0; i < 7; i++) {
      const ch = window.STORY_DATA.chapters[i];
      assert.equal(ch.act, i + 1);
      assert.equal(ch.zoneId, i + 1);
      assert.ok(ch.title && ch.title.length > 0);
      assert.ok(ch.introDialogue && ch.introDialogue.length > 0);
    }
  });

  it('Act 3 must be a branching decision point', () => {
    const act3 = window.STORY_DATA.chapters[2];
    assert.equal(act3.isBranchPoint, true);
    assert.ok(Array.isArray(act3.choices) && act3.choices.length === 3);
  });

  it('should define 4 grand endings', () => {
    const endings = window.STORY_DATA.endings;
    assert.ok(endings.ending_shogunate, 'Missing shogunate ending');
    assert.ok(endings.ending_ishin, 'Missing ishin ending');
    assert.ok(endings.ending_shura, 'Missing shura ending');
    assert.ok(endings.ending_hermit || endings.ending_wanderer, 'Missing hermit/wanderer ending');
  });
});

describe('5. Prestige Reincarnation (data/prestige.js)', () => {
  it('should define unlock thresholds and 8 perks', () => {
    assert.ok(window.PRESTIGE_DATA.unlockLevel >= 10);
    assert.ok(window.PRESTIGE_DATA.unlockZone >= 3);
    assert.equal(window.PRESTIGE_DATA.perks.length, 8);
  });

  it('calculates karma earned correctly based on player progress', () => {
    const mockPlayer = {
      level: 30,
      stats: { highestZone: 5, bossKills: 10 },
      story: { faction: 'unaligned' }
    };
    const karma = window.PRESTIGE_DATA.calculateKarmaEarned(mockPlayer);
    assert.ok(karma > 50, `Expected karma > 50, got ${karma}`);

    // Ishin faction bonus test
    mockPlayer.story.faction = 'ishin';
    const ishinKarma = window.PRESTIGE_DATA.calculateKarmaEarned(mockPlayer);
    assert.ok(ishinKarma > karma, 'Ishin faction should earn bonus karma');
  });

  it('calculates escalating perk costs correctly', () => {
    const costLvl0 = window.PRESTIGE_DATA.getPerkCost('perk_atk', 0);
    const costLvl1 = window.PRESTIGE_DATA.getPerkCost('perk_atk', 1);
    const costLvl5 = window.PRESTIGE_DATA.getPerkCost('perk_atk', 5);

    assert.ok(costLvl0 > 0);
    assert.ok(costLvl1 > costLvl0);
    assert.ok(costLvl5 > costLvl1);
  });
});

describe('6. Localization i18n (data/i18n.js)', () => {
  it('supports zh-TW, en, and ja with consistent key sets', () => {
    assert.ok(window.I18N.translations['zh-TW']);
    assert.ok(window.I18N.translations['en']);
    assert.ok(window.I18N.translations['ja']);

    const zhKeys = Object.keys(window.I18N.translations['zh-TW']);
    const enKeys = Object.keys(window.I18N.translations['en']);
    const jaKeys = Object.keys(window.I18N.translations['ja']);

    assert.ok(zhKeys.length > 40);
    assert.ok(enKeys.length > 40);
    assert.ok(jaKeys.length > 40);

    // Common critical keys
    const criticalKeys = ['gameTitle', 'resGold', 'tabBattle', 'tabStory', 'tabForge', 'tabPrestige'];
    for (const k of criticalKeys) {
      assert.ok(window.I18N.translations['zh-TW'][k], `Missing zh-TW key: ${k}`);
      assert.ok(window.I18N.translations['en'][k], `Missing en key: ${k}`);
      assert.ok(window.I18N.translations['ja'][k], `Missing ja key: ${k}`);
    }
  });

  it('translation helper window.t() formats parameters correctly', () => {
    window.setLanguage('zh-TW');
    const zhMsg = window.t('msgForgeLackRes', { steel: 5, gold: 100 });
    assert.ok(zhMsg.includes('5') && zhMsg.includes('100'));

    window.setLanguage('en');
    const enMsg = window.t('msgForgeLackRes', { steel: 5, gold: 100 });
    assert.ok(enMsg.includes('5') && enMsg.includes('100'));
    assert.ok(enMsg.includes('Tamahagane') || enMsg.includes('resources'));

    window.setLanguage('ja');
    const jaMsg = window.t('msgForgeLackRes', { steel: 5, gold: 100 });
    assert.ok(jaMsg.includes('5') && jaMsg.includes('100'));
  });

  it('localizes swords, items, zones, factions, and perks across all 3 languages', () => {
    const sword = window.SWORDS_DATA[0];
    const swordZh = window.getSwordText(sword, 'zh-TW');
    const swordEn = window.getSwordText(sword, 'en');
    const swordJa = window.getSwordText(sword, 'ja');

    assert.equal(swordZh.name, '無銘竹光');
    assert.equal(swordJa.name, '無銘竹光');
    assert.ok(swordEn.name.includes('Takemitsu'));

    const facZh = window.getFactionText('shogunate', 'zh-TW');
    const facEn = window.getFactionText('shogunate', 'en');
    const facJa = window.getFactionText('shogunate', 'ja');

    assert.ok(facZh.name.includes('佐幕'));
    assert.ok(facEn.name.includes('Shogunate'));
    assert.ok(facJa.name.includes('佐幕'));
  });
});
