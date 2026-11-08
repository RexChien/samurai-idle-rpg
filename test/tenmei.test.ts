import { describe, it, expect } from 'vitest';
import { TENMEI_LORE } from '../src/data/tenmeiLore';
import { generateGear, decomposeGear, GEAR_SLOTS, GEAR_QUALITIES } from '../src/data/gear';
import { AUTOMATION_TIERS, FIVE_RINGS_STANCES, SAMURAI_ARTS } from '../src/data/stancesArts';
import { SAMURAI_CLASSES } from '../src/data/classes';
import { MAIN_QUESTS, SIDE_QUESTS, generateProceduralBounty } from '../src/data/quests';
import { getPvPRankTier, generatePvPOpponents, simulateSamuraiDuel, getAbyssFloorData } from '../src/data/pvpAbyss';
import { MAP_ZONES } from '../src/engine/WorldMapEngine';
import { SPRITE_SPECS, resolveSpriteId } from '../src/engine/pixelSprites';

describe('1. Tenmei 7 Historical Lore, Lighthearted Town Tone & IP Compliance', () => {
  it('strictly adheres to Tenmei 7 (1787 AD) historical setting', () => {
    expect(TENMEI_LORE.era).toContain('天明七年');
    expect(TENMEI_LORE.era).toContain('1787');
  });

  it('contains zero 3rd-party trademarked character names', () => {
    const raw = JSON.stringify(TENMEI_LORE) + JSON.stringify(MAIN_QUESTS) + JSON.stringify(SIDE_QUESTS);
    expect(raw).not.toContain('霸王丸');
    expect(raw).not.toContain('娜可露露');
    expect(raw).not.toContain('橘右京');
    expect(raw).not.toContain('天草四郎時貞');
    expect(raw).not.toContain('牙神幻十郎');
  });

  it('maintains a warm, non-grimdark tone in quests (free of gory/grimdark keywords)', () => {
    const questText = JSON.stringify(MAIN_QUESTS) + JSON.stringify(SIDE_QUESTS);
    expect(questText).not.toContain('行屍');
    expect(questText).not.toContain('血海');
    expect(questText).not.toContain('冤魂');
    expect(questText).not.toContain('自相殘殺');
    expect(questText).not.toContain('血淚');
  });
});

describe('2. 3-Head-Tall (16x24 Chibi) Pixel Art Sprites', () => {
  it('defines 16x24 3-head-tall pixel grids for all samurai, NPC, and yokai sprites', () => {
    const specs = Object.values(SPRITE_SPECS);
    expect(specs.length).toBeGreaterThanOrEqual(11);
    for (const spec of specs) {
      expect(spec.grid).toHaveLength(24);
      for (const row of spec.grid) {
        expect(row).toHaveLength(16);
      }
    }
  });

  it('resolves character and NPC names to valid 3-head-tall sprite IDs', () => {
    expect(resolveSpriteId('柳生嚴信')).toBe('npc_yagyu');
    expect(resolveSpriteId('神無月楓')).toBe('samurai_female');
    expect(resolveSpriteId('國友鐵齋')).toBe('npc_tessai');
    expect(resolveSpriteId('茶屋小町')).toBe('npc_town_girl');
    expect(resolveSpriteId('貪吃赤面鬼')).toBe('yokai_oni');
  });
});

describe('3. Diablo Gear Generation & Salvage', () => {
  it('defines 6 gear slots and 6 quality tiers', () => {
    expect(Object.keys(GEAR_SLOTS)).toHaveLength(6);
    expect(Object.keys(GEAR_QUALITIES)).toHaveLength(6);
  });

  it('generates gear with proper attributes, random affixes and score', () => {
    const g = generateGear('weapon', 'legendary', 10);
    expect(g.slot).toBe('weapon');
    expect(g.quality).toBe('legendary');
    expect(g.baseAtk).toBeGreaterThan(0);
    expect(g.gearScore).toBeGreaterThan(0);
    expect(g.affixes.length).toBeGreaterThanOrEqual(3);
    expect(g.legendaryPower).toBeDefined();
  });

  it('decomposes gear into iron, souls, and gold', () => {
    const g = generateGear('armor', 'epic', 5);
    const mats = decomposeGear(g);
    expect(mats.iron).toBe(20);
    expect(mats.souls).toBe(10);
    expect(mats.gold).toBe(600);
  });
});

describe('4. Musashi Five Rings Stances & 12 Samurai Arts', () => {
  it('defines 5 stances forming a complete tactical counter loop', () => {
    expect(FIVE_RINGS_STANCES.earth.counters).toBe('fire');
    expect(FIVE_RINGS_STANCES.fire.counters).toBe('wind');
    expect(FIVE_RINGS_STANCES.wind.counters).toBe('void');
    expect(FIVE_RINGS_STANCES.void.counters).toBe('water');
    expect(FIVE_RINGS_STANCES.water.counters).toBe('earth');
  });

  it('defines 12 distinct samurai arts with proc chances and level requirements', () => {
    expect(SAMURAI_ARTS).toHaveLength(12);
    expect(SAMURAI_ARTS[0].name).toBe('居合・拔刀斬');
    expect(SAMURAI_ARTS[11].reqLevel).toBe(50);
  });
});

describe('5. Progressive Automation Realms, 30 Main Quests & 20 Side Quests', () => {
  it('starts at Tier 0 (manual slash) and unlocks Tier 1 via M01', () => {
    expect(AUTOMATION_TIERS[0].name).toContain('手動');
    expect(AUTOMATION_TIERS[0].intervalMs).toBe(0);
    expect(AUTOMATION_TIERS[1].intervalMs).toBe(1200);
    expect(AUTOMATION_TIERS[4].intervalMs).toBe(350);

    const m01 = MAIN_QUESTS.find(q => q.id === 'mq_01');
    expect(m01?.unlocksAutomationTier).toBe(1);
  });

  it('defines 30 handcrafted Main Quests and 20 lighthearted Side Quests', () => {
    expect(MAIN_QUESTS).toHaveLength(30);
    expect(MAIN_QUESTS[0].title).toBe('木刀百振・劍心初醒');
    expect(MAIN_QUESTS[29].title).toBe('萬劫不磨・武道登峰');
    expect(SIDE_QUESTS).toHaveLength(20);
  });

  it('generates infinite procedural bounties scaling with level', () => {
    const bounty = generateProceduralBounty(15);
    expect(bounty.type).toBe('bounty');
    expect(bounty.targetKills).toBeGreaterThan(0);
    expect(bounty.rewards.gold).toBeGreaterThan(1000);
  });
});

describe('6. Tactical PvP Arena & 1000-Floor Abyssal Rift', () => {
  it('simulates tactical PvP duel applying Five Rings counters', () => {
    const p1 = {
      name: '武士A',
      stats: { hp: 500, maxHp: 500, atk: 100, def: 50, critRate: 15, critDmg: 150, evasion: 5, lifesteal: 0, thorns: 0, power: 1000 },
      stance: 'earth' as const,
      equippedArts: ['art_iaido']
    };
    const p2 = {
      name: '武士B',
      power: 800,
      stance: 'fire' as const
    };
    const duel = simulateSamuraiDuel(p1, p2);
    expect(duel.logs.length).toBeGreaterThan(0);
    expect(duel.logs.some(l => l.includes('五輪相剋優勢'))).toBe(true);
  });

  it('generates Abyssal Rift boss up to 1000 floors with counter stance', () => {
    const floor100 = getAbyssFloorData(100);
    expect(floor100.floor).toBe(100);
    expect(floor100.affixName).toBeDefined();
    expect(floor100.recommendedStanceId).toBeDefined();
    expect(floor100.recommendedPower).toBeGreaterThan(1000);
    expect(floor100.rewards.guaranteedLegendary).toBe(true);
  });
});

describe('7. 2D World Map Engine Zones', () => {
  it('defines 6 authentic Japanese map zones from Kyoto to Yomi Rift', () => {
    expect(MAP_ZONES).toHaveLength(6);
    expect(MAP_ZONES[0].name).toContain('京都');
    expect(MAP_ZONES[5].name).toContain('常世狹縫');
  });
});
