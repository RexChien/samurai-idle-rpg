import type { PlayerStats, PvPOpponent } from '../types/game';
import { FIVE_RINGS_STANCES, SAMURAI_ARTS } from './stancesArts';

export interface PvPRankTier {
  id: string;
  name: string;
  icon: string;
  minRating: number;
  color: string;
}

export const PVP_RANK_TIERS: PvPRankTier[] = [
  { id: 'rank_1', name: '新選組隊士', icon: '🥉', minRating: 0, color: '#94a3b8' },
  { id: 'rank_2', name: '旗本番頭', icon: '🥈', minRating: 1100, color: '#38bdf8' },
  { id: 'rank_3', name: '諸侯拔刀衛', icon: '🥇', minRating: 1300, color: '#4ade80' },
  { id: 'rank_4', name: '鬼切劍豪', icon: '💎', minRating: 1600, color: '#a855f7' },
  { id: 'rank_5', name: '無雙大劍豪', icon: '⚔️', minRating: 2000, color: '#f59e0b' },
  { id: 'rank_6', name: '八幡神武宗', icon: '👑', minRating: 2500, color: '#fb923c' },
  { id: 'rank_7', name: '常世鎮魂使', icon: '👺', minRating: 3200, color: '#ef4444' },
  { id: 'rank_8', name: '天下無雙・劍神', icon: '🌟', minRating: 4000, color: '#f43f5e' }
];

export function getPvPRankTier(rating: number): PvPRankTier {
  for (let i = PVP_RANK_TIERS.length - 1; i >= 0; i--) {
    if (rating >= PVP_RANK_TIERS[i].minRating) return PVP_RANK_TIERS[i];
  }
  return PVP_RANK_TIERS[0];
}

export function generatePvPOpponents(playerRating: number, playerPower: number): PvPOpponent[] {
  const titles = ['無雙浪人', '新陰流傳人', '甲賀隱密', '出雲神劍', '柳生同門', '雷切劍豪', '赤備突擊番'];
  const avatars = ['⚔️', '👺', '🏯', '🌸', '👑', '🥷', '👹'];
  const classes = ['kensei', 'shadowblade', 'guardian', 'spellblade'];
  const stances: ('earth' | 'water' | 'fire' | 'wind' | 'void')[] = ['earth', 'water', 'fire', 'wind', 'void'];
  const buildTags = ['暴擊秒殺流', '反傷鐵壁流', '吸血續航流', '真傷灼燒流', '閃避見切流'];

  const results: PvPOpponent[] = [];
  const deltas = [-30, 0, 45];

  for (let i = 0; i < 3; i++) {
    const delta = deltas[i];
    const oppRating = Math.max(1000, playerRating + delta + Math.floor(Math.random() * 20 - 10));
    const powerMult = 0.85 + (i * 0.15) + (Math.random() * 0.1 - 0.05);
    const oppPower = Math.max(100, Math.round(playerPower * powerMult));
    const oppStance = stances[Math.floor(Math.random() * stances.length)];
    const oppClass = classes[Math.floor(Math.random() * classes.length)];

    results.push({
      id: 'opp_' + i + '_' + Date.now(),
      name: titles[Math.floor(Math.random() * titles.length)] + '・' + ['一刀', '小次郎', '疾風', '半兵衛', '宗嚴', '十兵衛'][Math.floor(Math.random() * 6)],
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      title: titles[Math.floor(Math.random() * titles.length)],
      level: Math.max(1, Math.round(oppRating / 50)),
      power: oppPower,
      stance: oppStance,
      classId: oppClass,
      buildTag: buildTags[Math.floor(Math.random() * buildTags.length)],
      ratingGain: 20 + i * 5
    });
  }
  return results;
}

export function simulateSamuraiDuel(
  player: { name: string; stats: PlayerStats; stance: 'earth' | 'water' | 'fire' | 'wind' | 'void'; equippedArts: string[] },
  opponent: { name: string; power: number; stance: 'earth' | 'water' | 'fire' | 'wind' | 'void' }
): { won: boolean; logs: string[] } {
  const logs: string[] = [];
  const pStance = FIVE_RINGS_STANCES[player.stance] || FIVE_RINGS_STANCES.earth;
  const oStance = FIVE_RINGS_STANCES[opponent.stance] || FIVE_RINGS_STANCES.fire;

  logs.push(`🥋 【武道對決展開】${player.name} (${pStance.icon} ${pStance.name}) VS ${opponent.name} (${oStance.icon} ${oStance.name})！`);

  let pDmgMult = 1.0;
  let oDmgMult = 1.0;

  if (pStance.counters === opponent.stance) {
    pDmgMult = 1.3;
    oDmgMult = 0.8;
    logs.push(`✨ 五輪相剋優勢！${player.name} 的【${pStance.name}】精準克制對手【${oStance.name}】(+30%傷害 / -20%受傷)！`);
  } else if (oStance.counters === player.stance) {
    pDmgMult = 0.8;
    oDmgMult = 1.3;
    logs.push(`⚠️ 五輪相剋劣勢！對手的【${oStance.name}】克制了 ${player.name} 的【${pStance.name}】！`);
  } else {
    logs.push(`⚖️ 雙方五輪架勢勢均力敵，全憑手中刃與胸中氣！`);
  }

  let playerHp = player.stats.hp;
  let oppHp = opponent.power * 2.8;

  const maxRounds = 6;
  for (let round = 1; round <= maxRounds; round++) {
    // 玩家回合
    let pArt = '';
    let pArtMult = 1.0;
    if (player.equippedArts && player.equippedArts.length > 0) {
      const artId = player.equippedArts[Math.floor(Math.random() * player.equippedArts.length)];
      const art = SAMURAI_ARTS.find(a => a.id === artId);
      if (art && Math.random() * 100 < art.procChance) {
        pArt = art.name;
        pArtMult = art.powerMult;
      }
    }

    const isCrit = Math.random() * 100 < player.stats.critRate;
    const baseAtk = player.stats.atk * (isCrit ? (player.stats.critDmg / 100) : 1);
    const pDmg = Math.round(baseAtk * pArtMult * pDmgMult * (0.9 + Math.random() * 0.2));
    oppHp -= pDmg;

    logs.push(`第${round}合：${player.name} ${pArt ? `爆發奧義【${pArt}】` : '揮刀斬擊'}${isCrit ? '💥 (暴擊!)' : ''}，造成 ${pDmg.toLocaleString()} 傷害！(對手殘餘HP: ${Math.max(0, Math.round(oppHp)).toLocaleString()})`);

    if (oppHp <= 0) break;

    // 對手回合
    const oDmg = Math.round((opponent.power * 0.16) * oDmgMult * (0.9 + Math.random() * 0.2));
    playerHp -= oDmg;
    logs.push(`第${round}合：${opponent.name} 反手拔刀回斬，造成 ${oDmg.toLocaleString()} 傷害！(您殘餘HP: ${Math.max(0, Math.round(playerHp)).toLocaleString()})`);

    if (playerHp <= 0) break;
  }

  const won = oppHp <= 0 || playerHp > oppHp;
  if (won) {
    logs.push(`🏆 決鬥結束！${player.name} 劍技超群，贏得武道切磋勝利！`);
  } else {
    logs.push(`🍵 決鬥惜敗！${player.name} 拱手行禮退場。建議調整《五輪書》架勢針對克制後再戰！`);
  }

  return { won, logs };
}

export function getAbyssFloorData(floor: number) {
  const affixes = [
    { name: '剛毅金身', desc: '護甲防禦力大幅提升 40%', counterStance: 'fire' },
    { name: '紅蓮烈火', desc: '攻擊附帶烈焰暴擊，傷害 +35%', counterStance: 'water' },
    { name: '虛空迅影', desc: '身法飄渺，獲得 25% 額外閃避', counterStance: 'wind' },
    { name: '靈氣歸元', desc: '每次攻擊吸收 20% 傷害轉化生命', counterStance: 'void' },
    { name: '金剛棘甲', desc: '反彈受到傷害的 30% 荊棘刺傷', counterStance: 'earth' }
  ];

  const bossAvatars = ['👹', '👺', '🐲', '🦊', '⚡', '🔥', '👑'];
  const bossNames = ['常世秘境・赤面鬼大將', '鞍馬之巔・大天狗宗師', '出雲神話・八岐古蛟', '伏見千鳥・九尾白狐仙', '無間試煉・古武劍豪英靈'];

  const affix = affixes[(floor - 1) % affixes.length];
  const avatar = bossAvatars[(floor - 1) % bossAvatars.length];
  const name = bossNames[(floor - 1) % bossNames.length] + ` (第${floor}層)`;

  const recommendedPower = Math.round(150 * Math.pow(1.045, floor - 1) + (floor * 60));
  const baseHp = recommendedPower * 3.5;
  const baseAtk = Math.round(recommendedPower * 0.18);

  const rewards = {
    gold: Math.round(100 * Math.pow(1.03, floor) + floor * 50),
    iron: Math.min(2000, 10 + floor * 3),
    souls: Math.min(1000, 2 + Math.floor(floor * 0.8)),
    guaranteedLegendary: floor % 5 === 0
  };

  return {
    floor,
    name,
    avatar,
    affixName: affix.name,
    affixDesc: affix.desc,
    recommendedStanceId: affix.counterStance as 'earth' | 'water' | 'fire' | 'wind' | 'void',
    recommendedStanceName: FIVE_RINGS_STANCES[affix.counterStance]?.name || '五輪架勢',
    recommendedPower,
    hp: baseHp,
    atk: baseAtk,
    rewards
  };
}
