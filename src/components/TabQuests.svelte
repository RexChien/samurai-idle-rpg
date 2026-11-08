<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { AUTOMATION_TIERS } from '../data/stancesArts';
  import { MAIN_QUESTS, SIDE_QUESTS } from '../data/quests';
  import PixelPortrait from './PixelPortrait.svelte';

  const player = $derived(gameStore.player);
  const curMainIdx = $derived(player.quests.currentMainIndex);
  const curMain = $derived(MAIN_QUESTS[curMainIdx]);
  const mainProg = $derived(player.quests.mainProgress[curMain?.id] || 0);

  // 顯示前 4 個尚未完成的支線任務（以及已完成的數量）
  const activeSideQuests = $derived(
    SIDE_QUESTS.filter(sq => !player.quests.completedSide.includes(sq.id)).slice(0, 4)
  );

  function autoTravel(zoneName: string) {
    gameStore.showToast(`🧭 正在前往【${zoneName}】...`, 'info');
    gameStore.navigateToZone(zoneName);
  }
</script>

<div class="tab-quests">
  <!-- 1. 4階自動劍心總覽 -->
  <section class="section-card">
    <h2 class="section-title">⚙️ 劍意境界：任務解鎖漸進式自動體系</h2>
    <div class="automation-tiers-grid">
      {#each Object.values(AUTOMATION_TIERS) as tier}
        <div class="auto-tier-card {player.automationTier >= tier.tier ? 'unlocked' : ''} {player.automationTier === tier.tier ? 'current-tier' : ''}">
          <div class="auto-tier-header">
            <span class="auto-tier-icon">{tier.tier === 0 ? '🔒' : tier.tier === 1 ? '⚡' : tier.tier === 2 ? '🌪️' : tier.tier === 3 ? '🦊' : '✨'}</span>
            <div>
              <div class="auto-tier-name">{tier.name}</div>
              <div class="auto-tier-req">{tier.unlockReq}</div>
            </div>
          </div>
          <div class="auto-tier-desc">{tier.desc}</div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 2. 當前進行中的天明主線任務 -->
  {#if curMain}
    <section class="section-card active-quest-highlight">
      <div class="quest-card-top">
        <div>
          <span class="quest-chapter-tag">{curMain.chapter}</span>
          <h3 class="quest-title">{curMain.title}</h3>
        </div>
        <div class="quest-npc-badge">
          <PixelPortrait spriteId={curMain.npc} scale={1.5} label={curMain.npc} />
          <span>{curMain.npc}</span>
        </div>
      </div>

      <div class="quest-dialogue">"{curMain.dialogue}"</div>
      <div class="quest-lore">📜 城鎮風物：{curMain.lore}</div>

      <div class="quest-objective-box">
        <div class="quest-obj-text">🎯 切磋討伐進度：{mainProg} / {curMain.targetKills} 隻（所在區域：{curMain.zone}）</div>
        <div class="quest-prog-bar-bg">
          <div class="quest-prog-bar-fill" style="width: {Math.min(100, (mainProg / curMain.targetKills) * 100)}%;"></div>
        </div>
      </div>

      <div class="quest-footer">
        <div class="quest-rewards-tags">
          <span class="rw-tag">💰 金幣 +{curMain.rewards.gold}</span>
          <span class="rw-tag">📈 經驗 +{curMain.rewards.exp}</span>
          {#if curMain.rewards.iron}<span class="rw-tag">🪨 玉鋼 +{curMain.rewards.iron}</span>{/if}
          {#if curMain.rewards.souls}<span class="rw-tag">🔮 魂玉 +{curMain.rewards.souls}</span>{/if}
          {#if curMain.rewards.title}<span class="rw-tag rw-highlight">🎖️ 稱號【{curMain.rewards.title}】</span>{/if}
        </div>
        <button class="btn btn-gold btn-sm" onclick={() => autoTravel(curMain.zone)}>
          ⚡ 一鍵前往任務地點
        </button>
      </div>
    </section>
  {/if}

  <!-- 3. 城下町人情支線任務 (共 20 篇輕鬆日常) -->
  <section class="section-card">
    <h2 class="section-title">
      🍡 城下町人情支線物語（已完成 {player.quests.completedSide.length} / {SIDE_QUESTS.length} 篇）
    </h2>
    <div class="side-quests-grid">
      {#each activeSideQuests as sq}
        {@const sqProg = player.quests.sideProgress[sq.id] || 0}
        {@const isReady = sqProg >= sq.targetKills}
        <div class="side-quest-card {isReady ? 'sq-ready' : ''}">
          <div class="sq-top">
            <PixelPortrait spriteId={sq.npc} scale={2} label={sq.npc} />
            <div>
              <div class="sq-title">{sq.title}</div>
              <div class="sq-npc">委託町民：{sq.npcAvatar} {sq.npc} ｜ 📍 {sq.zone}</div>
            </div>
          </div>
          <div class="sq-dialogue">"{sq.dialogue}"</div>
          <div class="sq-bottom">
            <span class="sq-prog">進度：{Math.min(sq.targetKills, sqProg)} / {sq.targetKills}</span>
            {#if isReady}
              <button class="btn btn-gold btn-sm" onclick={() => gameStore.claimSideQuest(sq.id)}>
                🎁 領取謝禮
              </button>
            {:else}
              <button class="btn btn-outline btn-sm" onclick={() => autoTravel(sq.zone)}>
                🧭 前往協助
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 4. 街坊即時互助委託令 -->
  <section class="section-card">
    <h2 class="section-title">📜 茶屋布告欄・街坊互助委託（完成自動領賞刷新）</h2>
    <div class="bounties-grid">
      {#each player.quests.bounties as b}
        <div class="bounty-card">
          <div class="bounty-title">{b.quest.title}</div>
          <div class="bounty-dialogue">"{b.quest.dialogue}"</div>
          <div class="bounty-prog">進度：{b.progress} / {b.quest.targetKills}</div>
          <div class="bounty-rewards">💰 {b.quest.rewards.gold} 兩 | 🪨 {b.quest.rewards.iron} 鋼</div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 5. 天明武士繪卷・回憶錄 -->
  <section class="section-card">
    <h2 class="section-title">📖 《天明武士繪卷》已解鎖章節回憶錄</h2>
    <div class="chronicle-grid">
      {#each MAIN_QUESTS.slice(0, Math.max(1, curMainIdx + 1)) as q}
        <button
          type="button"
          class="chronicle-card"
          onclick={() => gameStore.openStoryModal(q.title, q.chapter || '天明風雲', q.npc, q.dialogue, q.lore)}
        >
          <div class="chronicle-chapter">{q.chapter}</div>
          <div class="chronicle-title">{q.title}</div>
          <div class="chronicle-npc">引導名士：{q.npcAvatar} {q.npc}</div>
        </button>
      {/each}
    </div>
  </section>
</div>

<style>
  .tab-quests {
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

  .section-title {
    font-size: 1rem;
    font-weight: 900;
    color: #f59e0b;
    margin-bottom: 12px;
  }

  .automation-tiers-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }

  .auto-tier-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px;
    opacity: 0.6;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .auto-tier-card.unlocked {
    opacity: 1;
    border-color: #64748b;
  }

  .auto-tier-card.current-tier {
    opacity: 1;
    border: 2px solid #f59e0b;
    background: rgba(245, 158, 11, 0.1);
  }

  .auto-tier-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .auto-tier-icon {
    font-size: 1.6rem;
  }

  .auto-tier-name {
    font-weight: 800;
    font-size: 0.88rem;
    color: #fff;
  }

  .auto-tier-req {
    font-size: 0.72rem;
    color: #f59e0b;
  }

  .auto-tier-desc {
    font-size: 0.76rem;
    color: #94a3b8;
    line-height: 1.35;
  }

  .active-quest-highlight {
    border: 2px solid #f59e0b;
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(22, 27, 34, 0.98));
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .quest-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    flex-wrap: wrap;
  }

  .quest-chapter-tag {
    font-size: 0.78rem;
    color: #f59e0b;
    font-weight: 700;
  }

  .quest-title {
    font-size: 1.15rem;
    font-weight: 900;
    color: #fff;
    margin-top: 2px;
  }

  .quest-npc-badge {
    background: #1e293b;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.82rem;
    color: #cbd5e1;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .quest-dialogue {
    font-size: 0.92rem;
    color: #cbd5e1;
    font-style: italic;
  }

  .quest-lore {
    font-size: 0.82rem;
    color: #94a3b8;
  }

  .quest-objective-box {
    background: rgba(0, 0, 0, 0.35);
    padding: 10px;
    border-radius: 6px;
  }

  .quest-obj-text {
    font-size: 0.88rem;
    color: #38bdf8;
    font-weight: 700;
    margin-bottom: 6px;
  }

  .quest-prog-bar-bg {
    height: 8px;
    background: #1e293b;
    border-radius: 4px;
    overflow: hidden;
  }

  .quest-prog-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #f59e0b, #fde047);
    transition: width 0.3s;
  }

  .quest-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .quest-rewards-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .rw-tag {
    background: rgba(255, 255, 255, 0.08);
    font-size: 0.76rem;
    padding: 2px 7px;
    border-radius: 4px;
    color: #e2e8f0;
  }

  .rw-highlight {
    background: rgba(245, 158, 11, 0.25);
    color: #fde047;
    font-weight: 700;
  }

  .side-quests-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .side-quest-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }

  .side-quest-card.sq-ready {
    border-color: #4ade80;
    background: rgba(74, 222, 128, 0.06);
  }

  .sq-top {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sq-title {
    font-weight: 800;
    font-size: 0.92rem;
    color: #fff;
  }

  .sq-npc {
    font-size: 0.75rem;
    color: #f59e0b;
  }

  .sq-dialogue {
    font-size: 0.8rem;
    color: #cbd5e1;
    font-style: italic;
  }

  .sq-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sq-prog {
    font-size: 0.8rem;
    font-weight: 700;
    color: #38bdf8;
  }

  .bounties-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .bounty-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .bounty-title {
    font-weight: 800;
    font-size: 0.88rem;
    color: #fff;
  }

  .bounty-dialogue {
    font-size: 0.78rem;
    color: #94a3b8;
    font-style: italic;
  }

  .bounty-prog {
    color: #38bdf8;
    font-size: 0.82rem;
    font-weight: 700;
  }

  .bounty-rewards {
    font-size: 0.76rem;
    color: #f59e0b;
  }

  .chronicle-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .chronicle-card {
    background: #0d1117;
    border: 1px solid #475569;
    border-radius: 6px;
    padding: 10px;
    cursor: pointer;
    transition: background 0.2s;
    text-align: left;
  }

  .chronicle-card:hover {
    background: rgba(245, 158, 11, 0.12);
  }

  .chronicle-chapter {
    font-size: 0.72rem;
    color: #f59e0b;
  }

  .chronicle-title {
    font-weight: 800;
    color: #fff;
    margin: 3px 0;
  }

  .chronicle-npc {
    font-size: 0.76rem;
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    .automation-tiers-grid,
    .side-quests-grid,
    .bounties-grid,
    .chronicle-grid {
      grid-template-columns: 1fr;
    }
    .quest-footer {
      flex-direction: column;
      align-items: stretch;
    }
    .quest-footer .btn {
      width: 100%;
    }
  }
</style>
