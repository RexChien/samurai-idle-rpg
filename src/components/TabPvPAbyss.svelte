<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { getPvPRankTier, getAbyssFloorData } from '../data/pvpAbyss';
  import { FIVE_RINGS_STANCES } from '../data/stancesArts';
  import { SAMURAI_CLASSES } from '../data/classes';
  import PixelPortrait from './PixelPortrait.svelte';

  const player = $derived(gameStore.player);
  const pvp = $derived(player.pvp);
  const rankTier = $derived(getPvPRankTier(pvp.rating));
  const curStance = $derived(FIVE_RINGS_STANCES[player.stance] || FIVE_RINGS_STANCES.earth);
  const curFloor = $derived(player.abyss?.floor || 1);
  const floorData = $derived(getAbyssFloorData(curFloor));

  let friendCodeInput = $state('');

  function handleImportDuel() {
    if (!friendCodeInput.trim()) {
      gameStore.showToast(`請先貼上好友的武道切磋碼！`, 'warning');
      return;
    }
    gameStore.importAndDuelCode(friendCodeInput.trim());
    friendCodeInput = '';
  }
</script>

<div class="tab-pvp-abyss">
  <!-- 1. 天下第一武道大會 (戰術天梯 PvP) -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">🏆 天下第一武道大會（戰術天梯 PvP）</h2>
      <button class="btn btn-outline btn-sm" onclick={() => gameStore.refreshPvPOpponents()}>
        🔄 刷新對手
      </button>
    </div>

    <!-- 段位狀態列 -->
    <div class="pvp-status-bar">
      <div class="pvp-stat-box">
        <div class="stat-lbl">段位稱號</div>
        <div class="stat-val" style="color: {rankTier.color};">{rankTier.icon} {rankTier.name}</div>
      </div>
      <div class="pvp-stat-box">
        <div class="stat-lbl">武道積分</div>
        <div class="stat-val">{pvp.rating.toLocaleString()} 分</div>
      </div>
      <div class="pvp-stat-box">
        <div class="stat-lbl">生涯戰績</div>
        <div class="stat-val">{pvp.wins}勝 {pvp.losses}敗 ({pvp.streak}連勝)</div>
      </div>
      <div class="pvp-stat-box">
        <div class="stat-lbl">出戰架勢</div>
        <div class="stat-val">{curStance.icon} {curStance.name}</div>
      </div>
    </div>

    <!-- 3 位天梯對手 -->
    <div class="opponents-grid">
      {#each pvp.opponents as opp, idx}
        {@const oppStance = FIVE_RINGS_STANCES[opp.stance] || FIVE_RINGS_STANCES.fire}
        {@const oppCls = SAMURAI_CLASSES[opp.classId] || SAMURAI_CLASSES.kensei}
        {@const isAdvantage = curStance.counters === opp.stance}
        {@const isDisadvantage = oppStance.counters === player.stance}
        <div class="opp-card {isAdvantage ? 'advantage' : ''}">
          <div class="opp-header">
            <PixelPortrait spriteId={opp.avatar} scale={2} label={opp.name} />
            <div>
              <div class="opp-name">{opp.name} <span class="opp-lvl">Lv.{opp.level}</span></div>
              <div class="opp-title">【{opp.title}】{oppCls.icon}{oppCls.name}</div>
            </div>
          </div>
          <div class="opp-meta">
            <div style="color: #f59e0b; font-weight: 700;">{opp.buildTag}</div>
            <div>⚡ 綜合戰力：<strong>{opp.power.toLocaleString()}</strong></div>
            <div>☯️ 對手架勢：<strong>{oppStance.icon} {oppStance.name}</strong></div>
            <div class="matchup-tag {isAdvantage ? 'tag-win' : isDisadvantage ? 'tag-lose' : 'tag-even'}">
              {isAdvantage ? '✨ 您的架勢克制對手 (+30%傷害)' : isDisadvantage ? '⚠️ 被對手架勢克制 (建議換架勢)' : '⚖️ 架勢平手'}
            </div>
          </div>
          <button class="btn btn-crimson btn-block" onclick={() => gameStore.challengePvP(idx)}>
            ⚔️ 拔刀對決 (+{opp.ratingGain}分)
          </button>
        </div>
      {/each}
    </div>

    <!-- 0-帳單跨玩家切磋碼 -->
    <div class="duel-code-box">
      <div class="code-actions-row">
        <button class="btn btn-outline btn-sm" onclick={() => gameStore.exportDuelCode()}>
          📤 複製我的武道切磋碼
        </button>
        <div class="import-code-group">
          <input
            type="text"
            placeholder="貼上好友的切磋碼 (DUEL_...)"
            bind:value={friendCodeInput}
            class="code-input"
          />
          <button class="btn btn-gold btn-sm" onclick={handleImportDuel}>
            📥 輸入切磋碼對決
          </button>
        </div>
      </div>

      <!-- 對戰戰況日誌 -->
      <div class="duel-logs-box">
        {#if pvp.lastLog && pvp.lastLog.length > 0}
          {#each pvp.lastLog as line}
            <div class="log-line">{line}</div>
          {/each}
        {:else}
          <div class="empty-log">點擊上方「⚔️ 拔刀對決」或輸入好友切磋碼，此處將顯示逐回合五輪相剋交鋒實況！</div>
        {/if}
      </div>
    </div>
  </section>

  <!-- 2. 無間奈落千層深淵 (1~1000層) -->
  <section class="section-card abyss-section">
    <div class="section-header">
      <h2 class="section-title">🌌 無間奈落・千層深淵（當前：第 {curFloor} 層 / 1000 層）</h2>
    </div>

    <div class="abyss-card">
      <div class="abyss-info">
        <div class="abyss-floor-title">🌌 無間奈落・第 {floorData.floor} 層守門魔將</div>
        <h3 class="abyss-boss-name">{floorData.avatar} {floorData.name}</h3>
        <div class="affix-tag">🔥 詞綴：{floorData.affixName} — {floorData.affixDesc}</div>
        <div class="abyss-recommend">
          💡 戰術建議：切換為【<strong>{floorData.recommendedStanceName}</strong>】可觸發相剋！
          <button class="btn btn-outline btn-sm" onclick={() => gameStore.selectStance(floorData.recommendedStanceId)}>
            ⚡ 一鍵切換為克制架勢
          </button>
        </div>
        <div class="abyss-rewards">
          🎁 通關犒賞：💰 {floorData.rewards.gold.toLocaleString()} 兩 | 🪨 玉鋼 x{floorData.rewards.iron} | 🔮 魂玉 x{floorData.rewards.souls}
          {#if floorData.rewards.guaranteedLegendary}
            <span style="color: #fb923c; font-weight: 700;"> | 🌟 必掉傳奇/太古神兵！</span>
          {/if}
        </div>
      </div>

      <div class="abyss-action">
        <div class="abyss-req-power">推薦戰力：{floorData.recommendedPower.toLocaleString()}</div>
        <button class="btn btn-gold btn-xl" onclick={() => gameStore.challengeAbyss()}>
          🌌 闖入奈落第 {floorData.floor} 層
        </button>
      </div>
    </div>
  </section>
</div>

<style>
  .tab-pvp-abyss {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .section-card {
    background: #161b22;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 900;
    color: #f59e0b;
  }

  .pvp-status-bar {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 14px;
  }

  .pvp-stat-box {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px;
  }

  .stat-lbl {
    font-size: 0.74rem;
    color: #94a3b8;
  }

  .stat-val {
    font-size: 1.05rem;
    font-weight: 900;
    color: #fff;
    margin-top: 2px;
  }

  .opponents-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 14px;
  }

  .opp-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 10px;
  }

  .opp-card.advantage {
    border-color: #4ade80;
    background: rgba(74, 222, 128, 0.06);
  }

  .opp-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .opp-name {
    font-weight: 800;
    font-size: 0.95rem;
    color: #fff;
  }

  .opp-lvl {
    font-size: 0.76rem;
    color: #f59e0b;
  }

  .opp-title {
    font-size: 0.76rem;
    color: #94a3b8;
  }

  .opp-meta {
    font-size: 0.82rem;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .matchup-tag {
    font-size: 0.74rem;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 700;
  }

  .tag-win {
    background: rgba(74, 222, 128, 0.18);
    color: #4ade80;
  }

  .tag-lose {
    background: rgba(239, 68, 68, 0.18);
    color: #f87171;
  }

  .tag-even {
    background: rgba(148, 163, 184, 0.15);
    color: #cbd5e1;
  }

  .duel-code-box {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
  }

  .code-actions-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }

  .import-code-group {
    display: flex;
    gap: 6px;
    flex: 1;
    max-width: 480px;
  }

  .code-input {
    flex: 1;
    background: #1e293b;
    border: 1px solid #475569;
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 0.82rem;
  }

  .duel-logs-box {
    max-height: 200px;
    overflow-y: auto;
    font-size: 0.82rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: rgba(0, 0, 0, 0.35);
    padding: 8px;
    border-radius: 6px;
  }

  .log-line {
    padding: 3px 6px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.03);
  }

  .empty-log {
    color: #94a3b8;
    text-align: center;
    padding: 12px;
  }

  .abyss-card {
    background: linear-gradient(135deg, rgba(49, 16, 47, 0.65), rgba(20, 22, 29, 0.95));
    border: 2px solid #c084fc;
    border-radius: 10px;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .abyss-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-width: 240px;
  }

  .abyss-floor-title {
    color: #e879f9;
    font-weight: 800;
    font-size: 0.85rem;
  }

  .abyss-boss-name {
    font-size: 1.25rem;
    font-weight: 900;
    color: #fff;
  }

  .affix-tag {
    color: #f3e8ff;
    font-size: 0.82rem;
  }

  .abyss-recommend {
    color: #fde047;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }

  .abyss-rewards {
    font-size: 0.82rem;
    color: #cbd5e1;
  }

  .abyss-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .abyss-req-power {
    font-size: 0.82rem;
    color: #f87171;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .pvp-status-bar {
      grid-template-columns: repeat(2, 1fr);
    }
    .opponents-grid {
      grid-template-columns: 1fr;
    }
    .abyss-card {
      flex-direction: column;
      align-items: stretch;
    }
    .abyss-action .btn {
      width: 100%;
    }
  }
</style>
