const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Setup mock browser window, document, and localStorage environment
class MockLocalStorage {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] !== undefined ? this.store[key] : null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}

class MockElement {
  constructor(id = '', tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.classList = {
      _set: new Set(),
      add(...tokens) { tokens.forEach(t => this._set.add(t)); },
      remove(...tokens) { tokens.forEach(t => this._set.delete(t)); },
      contains(t) { return this._set.has(t); }
    };
    this.style = {};
    this.innerHTML = '';
    this.innerText = '';
    this.dataset = {};
    this.children = [];
    this.parentNode = null;
  }
  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }
  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) this.children.splice(idx, 1);
    child.parentNode = null;
    return child;
  }
  addEventListener() {}
}

const mockDoc = {
  elements: new Map(),
  getElementById(id) {
    if (!this.elements.has(id)) {
      this.elements.set(id, new MockElement(id));
    }
    return this.elements.get(id);
  },
  createElement(tag) {
    return new MockElement('', tag);
  },
  querySelectorAll(sel) {
    return [];
  },
  querySelector(sel) {
    return new MockElement();
  },
  addEventListener() {}
};

global.window = global;
global.window.addEventListener = () => {};
global.document = mockDoc;
global.localStorage = new MockLocalStorage();
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };

function loadScript(relPath) {
  const filePath = path.join(__dirname, '..', relPath);
  const code = fs.readFileSync(filePath, 'utf8');
  eval(code);
}

// Load scripts
loadScript('data/gear.js');
loadScript('data/classes.js');
loadScript('data/campaign.js');
loadScript('data/rewards.js');
loadScript('src/audio.js');
loadScript('src/market_chat.js');
loadScript('src/game.js');

test('5. Audio Engine (src/audio.js)', async (t) => {
  const audio = new window.SamuraiAudioEngine();
  assert.equal(audio.isMuted, false);

  const muted = audio.toggleMute();
  assert.equal(muted, true);
  assert.equal(audio.isMuted, true);

  audio.toggleMute();
  assert.equal(audio.isMuted, false);

  // Calling sound methods should not throw even in Node headless
  audio.playDiabloDing();
  audio.playDropSound('legendary');
  audio.playSlashSound(true);
  audio.playEquipSound();
  audio.playCoinSound();
  audio.playAchievementFanfare();
});

test('6. Market & Chat Manager (src/market_chat.js)', async (t) => {
  const game = new window.SamuraiGame();
  const market = game.marketChat;

  await t.test('initializes default market listings and chat history', () => {
    assert.ok(market.listings.length > 0);
    assert.ok(market.chatMessages.length > 0);
  });

  await t.test('allows adding chat message and broadcasting legendary drops', () => {
    market.addChatMessage('劍聖玩家', '大家好！', false);
    const lastMsg = market.chatMessages[market.chatMessages.length - 1];
    assert.equal(lastMsg.text, '大家好！');

    const fakeGear = window.generateGear('weapon', 'legendary', 10);
    market.broadcastLoot('宮本武藏', fakeGear);
    const broadcastMsg = market.chatMessages[market.chatMessages.length - 1];
    assert.ok(broadcastMsg.text.includes('傳奇降臨'));
    assert.equal(broadcastMsg.isSystem, true);
  });

  await t.test('allows player to list and buy items on marketplace', () => {
    const gear = window.generateGear('armor', 'rare', 5);
    game.addGearToInventory(gear);
    const initialInvCount = game.player.inventory.length;

    market.listMyGear(gear.uid, 5000);
    assert.equal(game.player.inventory.length, initialInvCount - 1);
    assert.equal(market.myListings.length, 1);
    assert.equal(market.myListings[0].price, 5000);

    // Buy an item from market
    game.player.gold = 50000;
    const targetListing = market.listings[0];
    const listingId = targetListing.id;
    const price = targetListing.price;
    const initialGold = game.player.gold;

    market.buyListing(listingId);
    assert.equal(game.player.gold, initialGold - price);
  });

  game.destroy();
});

test('7. Core Game Engine (src/game.js)', async (t) => {
  const game = new window.SamuraiGame();

  await t.test('initializes default player with 0-bill pure client architecture', () => {
    assert.equal(game.player.name, '無雙武士');
    assert.equal(game.player.level, 1);
    assert.equal(game.player.classId, 'kensei');
    assert.ok(game.player.gold > 0);
    assert.ok(game.player.equipped.weapon);
  });

  await t.test('calculates combat stats incorporating gear and class passives', () => {
    const stats = game.getCalculatedStats();
    assert.ok(stats.atk > 0);
    assert.ok(stats.def > 0);
    assert.ok(stats.hp > 0);
    assert.ok(stats.power > 0);
    assert.ok(stats.critRate >= 5);
  });

  await t.test('executes combat tick and damages enemy', () => {
    game.spawnNextEnemy();
    const initHp = game.currentEnemy.hp;
    game.autoCombatTick();
    assert.ok(game.currentEnemy.hp < initHp);
  });

  await t.test('smart equip detects better gear in inventory and equips it on command', () => {
    const superiorWeapon = window.generateGear('weapon', 'ancient', 30);
    game.addGearToInventory(superiorWeapon);
    game.checkSmartEquip();

    assert.ok(game.smartEquipTarget);
    assert.equal(game.smartEquipTarget.uid, superiorWeapon.uid);

    game.equipSmartTarget();
    assert.equal(game.player.equipped.weapon.uid, superiorWeapon.uid);
    assert.equal(game.smartEquipTarget, null);
  });

  await t.test('decomposes junk gear and upgrades equipment', () => {
    const junkGear = window.generateGear('boots', 'common', 1);
    game.addGearToInventory(junkGear);
    const initialIron = game.player.iron;

    game.decomposeSingleGear(junkGear.uid);
    assert.ok(game.player.iron > initialIron);

    // Upgrade weapon
    game.player.iron = 100;
    game.player.gold = 50000;
    const initialUpgradeLevel = game.player.equipped.weapon.upgradeLevel || 0;
    game.upgradeGear(game.player.equipped.weapon.uid);
    assert.equal(game.player.equipped.weapon.upgradeLevel, initialUpgradeLevel + 1);
  });

  await t.test('allows talent allocation and free reset with 0 cost', () => {
    game.player.talentPoints = 5;
    game.addTalentPoint('kensei_crit');
    assert.equal(game.player.talents.kensei_crit, 1);
    assert.equal(game.player.talentPoints, 4);

    // Free reset
    game.resetTalents();
    assert.equal(game.player.talents.kensei_crit, 0);
    assert.equal(game.player.talentPoints, 5);
  });

  await t.test('claims daily sign-in reward once per day', () => {
    game.player.dailySignIn.lastClaimDate = '';
    game.player.dailySignIn.claimedDays = 0;
    const initialGold = game.player.gold;

    game.claimDailyReward();
    assert.equal(game.player.dailySignIn.claimedDays, 1);
    assert.ok(game.player.gold > initialGold);

    // Trying again on same day should be blocked
    const goldAfterFirst = game.player.gold;
    game.claimDailyReward();
    assert.equal(game.player.gold, goldAfterFirst);
  });

  await t.test('unlocks Diablo 3 style achievements and claims rewards', () => {
    game.player.statsTracked.totalKills = 15;
    game.checkAchievements();

    assert.ok(game.player.achievements['kill_10']);
    assert.equal(game.player.achievements['kill_10'].unlocked, true);
    assert.equal(game.player.achievements['kill_10'].claimed, false);

    const goldBeforeClaim = game.player.gold;
    game.claimAchievement('kill_10');
    assert.equal(game.player.achievements['kill_10'].claimed, true);
    assert.ok(game.player.gold > goldBeforeClaim);
  });

  await t.test('calculates offline idle gains when user returns', () => {
    game.player.lastSaveTime = Date.now() - 3600 * 1000; // 1 hour offline
    const killsBefore = game.player.statsTracked.totalKills;
    const goldBefore = game.player.gold;

    game.processOfflineProgress();
    assert.ok(game.player.statsTracked.totalKills > killsBefore);
    assert.ok(game.player.gold > goldBefore);
  });

  await t.test('supports Google Identity profile binding', () => {
    // Mock JWT payload: {"name":"真田幸村","email":"sanada@sengoku.jp","sub":"12345"}
    const payload = Buffer.from(JSON.stringify({
      name: '真田幸村',
      email: 'sanada@sengoku.jp',
      sub: '12345'
    })).toString('base64');
    const fakeToken = `header.${payload}.signature`;

    game.handleGoogleLogin({ credential: fakeToken });
    assert.equal(game.player.name, '真田幸村');
    assert.equal(game.player.googleProfile.email, 'sanada@sengoku.jp');
  });

  await t.test('switches among all 5 core tabs cleanly', () => {
    const tabs = ['battle', 'gear', 'talents', 'market', 'achievements'];
    tabs.forEach(tName => {
      game.switchTab(tName);
      assert.equal(game.activeTab, tName);
    });
  });

  await t.test('saves and loads game state cleanly', () => {
    game.player.name = '宮本十兵衛';
    game.player.gold = 888888;
    game.save();

    const newGame = new window.SamuraiGame();
    assert.equal(newGame.player.name, '宮本十兵衛');
    assert.equal(newGame.player.gold, 888888);
    newGame.destroy();
  });

  game.destroy();
});
