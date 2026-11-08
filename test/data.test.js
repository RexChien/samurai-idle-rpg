const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Setup mock browser window environment
global.window = global;

function loadScript(relPath) {
  const filePath = path.join(__dirname, '..', relPath);
  const code = fs.readFileSync(filePath, 'utf8');
  eval(code);
}

// Load new data scripts
loadScript('data/gear.js');
loadScript('data/classes.js');
loadScript('data/campaign.js');
loadScript('data/rewards.js');
loadScript('data/quests_pvp.js');

test('1. Diablo-Style Gear Database (data/gear.js)', async (t) => {
  await t.test('defines 6 core equipment slots', () => {
    assert.ok(window.GEAR_SLOTS);
    const slots = Object.keys(window.GEAR_SLOTS);
    assert.deepEqual(slots, ['weapon', 'offhand', 'helm', 'armor', 'accessory', 'boots']);
    assert.equal(window.GEAR_SLOTS.weapon.name, '主手刀');
  });

  await t.test('defines 6 distinct quality tiers with multipliers', () => {
    assert.ok(window.GEAR_QUALITIES);
    const qualities = ['common', 'magic', 'rare', 'epic', 'legendary', 'ancient'];
    qualities.forEach(q => {
      assert.ok(window.GEAR_QUALITIES[q], `Quality ${q} must exist`);
      assert.ok(window.GEAR_QUALITIES[q].statMultiplier >= 1.0);
    });
    assert.equal(window.GEAR_QUALITIES.legendary.hasBeam, true);
    assert.equal(window.GEAR_QUALITIES.ancient.hasBeam, true);
  });

  await t.test('generates valid gear with attributes, random affixes, and lore', () => {
    const gear = window.generateGear('weapon', 'legendary', 10);
    assert.ok(gear);
    assert.equal(gear.slot, 'weapon');
    assert.equal(gear.quality, 'legendary');
    assert.ok(gear.baseAtk > 0);
    assert.ok(gear.affixes.length >= 3);
    assert.ok(gear.legendaryPower);
    assert.ok(gear.lore.length > 5);
    assert.ok(gear.gearScore > 0);
  });

  await t.test('calculates gear score accurately and scales with upgrade level', () => {
    const gear = window.generateGear('armor', 'rare', 5);
    const initialScore = gear.gearScore;
    gear.upgradeLevel = 5;
    const upgradedScore = window.calculateGearScore(gear);
    assert.ok(upgradedScore > initialScore);
  });

  await t.test('decomposes gear into iron, souls, and gold based on quality', () => {
    const commonGear = window.generateGear('weapon', 'common', 1);
    const ancientGear = window.generateGear('weapon', 'ancient', 50);

    const commonMats = window.decomposeGear(commonGear);
    const ancientMats = window.decomposeGear(ancientGear);

    assert.ok(commonMats.iron >= 1);
    assert.equal(commonMats.souls, 0);

    assert.ok(ancientMats.iron > 100);
    assert.ok(ancientMats.souls > 50);
  });
});

test('2. Samurai Classes & Talents (data/classes.js)', async (t) => {
  await t.test('defines 4 authentic samurai classes', () => {
    assert.ok(window.SAMURAI_CLASSES);
    const classKeys = Object.keys(window.SAMURAI_CLASSES);
    assert.deepEqual(classKeys, ['kensei', 'onimusha', 'onmyoji', 'daimyo']);
  });

  await t.test('each class has 3 linear talent trees with up to rank 10', () => {
    Object.values(window.SAMURAI_CLASSES).forEach(cls => {
      assert.equal(cls.talents.length, 3);
      cls.talents.forEach(tal => {
        assert.equal(tal.maxRank, 10);
        assert.equal(typeof tal.getBonus, 'function');
      });
    });
  });

  await t.test('calculates class and talent bonuses accurately', () => {
    const bonuses = window.calculateClassBonuses('kensei', {
      kensei_crit: 5,
      kensei_dual: 3
    });
    // Kensei passive: critRate 10, atkSpd 15
    // kensei_crit rank 5: +10% critRate, +25% critDmg
    // kensei_dual rank 3: +9% atkSpd
    assert.equal(bonuses.critRate, 20); // 10 + 10
    assert.equal(bonuses.critDmg, 25);
    assert.equal(bonuses.atkSpd, 24); // 15 + 9
  });
});

test('3. Campaign Acts, Town Hub & World Map Waypoints (data/campaign.js)', async (t) => {
  await t.test('defines Town Hub with 4 NPCs (shrine healer, blacksmith, merchant, master)', () => {
    assert.ok(window.TOWN_HUB);
    assert.equal(window.TOWN_HUB.id, 'town_kyoto');
    assert.equal(window.TOWN_HUB.npcs.length, 4);
  });

  await t.test('defines 7 campaign acts with waypoint icons, coordinates, yokai, and bosses', () => {
    assert.ok(window.CAMPAIGN_ACTS);
    assert.equal(window.CAMPAIGN_ACTS.length, 7);

    window.CAMPAIGN_ACTS.forEach((act, idx) => {
      assert.equal(act.act, idx + 1);
      assert.ok(act.name.length > 0);
      assert.ok(act.mapIcon);
      assert.ok(act.mapPos && typeof act.mapPos.x === 'number');
      assert.ok(act.enemies.length >= 3);
      assert.ok(act.boss);
      assert.equal(act.boss.isBoss, true);
      assert.ok(act.boss.dialogue.length > 0);
    });
  });

  await t.test('enemy and boss stats scale properly across acts', () => {
    const act1Boss = window.CAMPAIGN_ACTS[0].boss;
    const act7Boss = window.CAMPAIGN_ACTS[6].boss;
    assert.ok(act7Boss.hp > act1Boss.hp * 100);
    assert.ok(act7Boss.atk > act1Boss.atk * 50);
  });
});

test('4. Rewards, Achievements & Daily Sign-in (data/rewards.js)', async (t) => {
  await t.test('defines 35+ Diablo 3 style achievements', () => {
    assert.ok(window.ACHIEVEMENTS_DB);
    assert.ok(window.ACHIEVEMENTS_DB.length >= 35);
    window.ACHIEVEMENTS_DB.forEach(ach => {
      assert.ok(ach.id);
      assert.ok(ach.name);
      assert.ok(ach.desc);
      assert.ok(ach.points > 0);
    });
  });

  await t.test('defines 7-day daily sign-in rewards with legendary and ancient gifts', () => {
    assert.ok(window.DAILY_SIGNIN_REWARDS);
    assert.equal(window.DAILY_SIGNIN_REWARDS.length, 7);
    assert.equal(window.DAILY_SIGNIN_REWARDS[5].gearQuality, 'legendary'); // Day 6
    assert.equal(window.DAILY_SIGNIN_REWARDS[6].gearQuality, 'ancient');   // Day 7
    assert.equal(window.DAILY_SIGNIN_REWARDS[6].title, '天下無雙');
  });
});

test('5. Progressive Automation, 100h Story Quests, Five Rings Stances & PvP/Abyss (data/quests_pvp.js)', async (t) => {
  await t.test('defines 5 automation tiers (Tier 0 manual to Tier 4 godspeed)', () => {
    assert.ok(window.AUTOMATION_TIERS);
    assert.equal(window.AUTOMATION_TIERS[0].intervalMs, 0);
    assert.equal(window.AUTOMATION_TIERS[1].intervalMs, 1200);
    assert.equal(window.AUTOMATION_TIERS[2].intervalMs, 650);
    assert.equal(window.AUTOMATION_TIERS[3].intervalMs, 500);
    assert.equal(window.AUTOMATION_TIERS[4].intervalMs, 350);
  });

  await t.test('defines 30 Main Story Quests across 8 volumes and 20 Side Quests', () => {
    assert.ok(window.MAIN_QUESTS);
    assert.equal(window.MAIN_QUESTS.length, 30);
    assert.equal(window.MAIN_QUESTS[0].reward.unlockAutomationTier, 1);
    assert.equal(window.MAIN_QUESTS[2].reward.unlockAutomationTier, 2);
    assert.equal(window.MAIN_QUESTS[4].reward.unlockAutomationTier, 3);
    assert.equal(window.MAIN_QUESTS[8].reward.unlockAutomationTier, 4);

    assert.ok(window.SIDE_QUESTS);
    assert.equal(window.SIDE_QUESTS.length, 20);
  });

  await t.test('defines Miyamoto Musashi Five Rings Stances with tactical counter cycle and 12 Samurai Arts', () => {
    assert.ok(window.FIVE_RINGS_STANCES);
    const keys = Object.keys(window.FIVE_RINGS_STANCES);
    assert.deepEqual(keys, ['earth', 'water', 'fire', 'wind', 'void']);
    assert.equal(window.FIVE_RINGS_STANCES.earth.counters, 'fire');
    assert.equal(window.FIVE_RINGS_STANCES.water.counters, 'earth');

    assert.ok(window.SAMURAI_ARTS);
    assert.equal(window.SAMURAI_ARTS.length, 12);
  });

  await t.test('simulates tactical PvP duel and generates 1000-floor Abyssal Rift bosses', () => {
    const p1 = { name: '宮本武藏', stance: 'water', equippedArts: ['art_tsubame'], stats: { atk: 500, def: 200, maxHp: 3000, critRate: 30, critDmg: 100 } };
    const p2 = { name: '佐佐木小次郎', stance: 'earth', arts: ['art_guren'], stats: { atk: 400, def: 180, maxHp: 2500, critRate: 20, critDmg: 80 } };
    const res = window.simulateSamuraiDuel(p1, p2);
    assert.equal(typeof res.isWin, 'boolean');
    assert.ok(res.log.length >= 2);

    const floor100 = window.getAbyssFloorData(100);
    assert.equal(floor100.floor, 100);
    assert.ok(floor100.stats.maxHp > 10000);
    assert.ok(floor100.recommendedStanceId);
  });
});

