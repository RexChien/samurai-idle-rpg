<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { FIVE_RINGS_STANCES, SAMURAI_ARTS } from '../data/stancesArts';
  import { SAMURAI_CLASSES } from '../data/classes';

  const player = $derived(gameStore.player);
  const curClass = $derived(SAMURAI_CLASSES[player.classId] || SAMURAI_CLASSES.kensei);
  const eqArts = $derived(player.equippedArts || []);

  function switchClass(classId: string) {
    player.classId = classId;
    gameStore.showToast(`已轉職為【${SAMURAI_CLASSES[classId]?.name}】！`, 'success');
    gameStore.save();
  }

  function addTalentRank(talentId: string) {
    if (player.talentPoints <= 0) {
      gameStore.showToast(`天賦點數不足！升級武士可獲得天賦點`, 'warning');
      return;
    }
    player.talentPoints--;
    player.talents[talentId] = (player.talents[talentId] || 0) + 1;
    gameStore.showToast(`天賦強化成功！`, 'success');
    gameStore.save();
  }

  function resetTalents() {
    let refund = 0;
    for (const k of Object.keys(player.talents)) {
      refund += player.talents[k];
      player.talents[k] = 0;
    }
    player.talentPoints += refund;
    gameStore.showToast(`已免費重置所有天賦，退還 ${refund} 點天賦點！`, 'info');
    gameStore.save();
  }
</script>

<div class="tab-talents">
  <!-- 1. 宮本武藏《五輪書》五輪架勢 -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">☯️ 宮本武藏《五輪書》五輪架勢（相剋加成：+30% 傷害 / -20% 受傷）</h2>
      <span class="stance-hint">地克火 ➔ 火克風 ➔ 風克空 ➔ 空克水 ➔ 水克地</span>
    </div>

    <div class="stances-grid">
      {#each Object.values(FIVE_RINGS_STANCES) as st}
        {@const isSelected = player.stance === st.id}
        <button
          class="stance-card-btn {isSelected ? 'active' : ''}"
          onclick={() => gameStore.selectStance(st.id)}
        >
          <div class="stance-top">
            <span class="stance-icon">{st.icon}</span>
            <span class="stance-name">{st.name}</span>
          </div>
          <div class="stance-counter">{st.counterDesc}</div>
          <div class="stance-desc">{st.desc}</div>
        </button>
      {/each}
    </div>
  </section>

  <!-- 2. 12 式武學奧義自由配裝 -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">⚡ 12 式武學奧義自由配裝（當前已裝備：{eqArts.length} / 3）</h2>
      <span class="stance-hint">點擊自由替換出戰奧義</span>
    </div>

    <div class="arts-grid">
      {#each SAMURAI_ARTS as art}
        {@const isEq = eqArts.includes(art.id)}
        {@const isUnlocked = player.level >= art.reqLevel}
        <button
          type="button"
          class="art-card {isEq ? 'equipped' : ''} {isUnlocked ? '' : 'locked'}"
          onclick={() => isUnlocked && gameStore.toggleEquipArt(art.id)}
        >
          <div class="art-header">
            <span class="art-icon">{art.icon}</span>
            <div>
              <div class="art-name">{art.name}</div>
              <div class="art-meta">【{art.style}】觸發率 {art.procChance}% | 倍率 {(art.powerMult * 100).toFixed(0)}%</div>
            </div>
          </div>
          <div class="art-desc">{art.desc}</div>
          <div class="art-status">
            {#if isEq}
              <span class="tag-eq">✅ 已裝備出戰</span>
            {:else if isUnlocked}
              <span class="tag-avail">點擊裝備</span>
            {:else}
              <span class="tag-lock">🔒 Lv.{art.reqLevel} 解鎖</span>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </section>

  <!-- 3. 四大武士流派與天賦樹 -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">🏯 四大流派天賦樹（可用天賦點：{player.talentPoints}）</h2>
      <button class="btn btn-outline btn-sm" onclick={resetTalents}>🔄 免費重置天賦</button>
    </div>

    <div class="classes-grid">
      {#each Object.values(SAMURAI_CLASSES) as c}
        <button
          class="class-btn {player.classId === c.id ? 'active' : ''}"
          onclick={() => switchClass(c.id)}
        >
          <span class="class-icon">{c.icon}</span>
          <div class="class-name">{c.name}</div>
          <div class="class-sub">{c.subtitle}</div>
        </button>
      {/each}
    </div>

    <!-- 天賦節點列表 -->
    <div class="talents-tree-list">
      {#each curClass.trees as tree}
        <div class="tree-box">
          <div class="tree-name">{tree.name}</div>
          <div class="nodes-grid">
            {#each tree.talents as t}
              {@const rank = player.talents[t.id] || 0}
              <div class="talent-node-card">
                <div class="node-header">
                  <div class="node-name">{t.name}</div>
                  <div class="node-rank">{rank} / {t.maxRank}</div>
                </div>
                <div class="node-desc">{t.desc}（目前加成：+{rank * t.valuePerRank}{t.unit}）</div>
                <button
                  class="btn btn-sm btn-gold btn-block"
                  disabled={rank >= t.maxRank || player.talentPoints <= 0}
                  onclick={() => addTalentRank(t.id)}
                >
                  {rank >= t.maxRank ? '已滿級' : '點亮修煉'}
                </button>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .tab-talents {
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
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 900;
    color: #f59e0b;
  }

  .stance-hint {
    font-size: 0.78rem;
    color: #38bdf8;
    font-weight: 700;
  }

  .stances-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }

  .stance-card-btn {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px 10px;
    color: #fff;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 5px;
    transition: all 0.2s;
  }

  .stance-card-btn.active {
    border: 2px solid #f59e0b;
    background: rgba(245, 158, 11, 0.15);
  }

  .stance-top {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stance-icon {
    font-size: 1.5rem;
  }

  .stance-name {
    font-weight: 900;
    font-size: 0.95rem;
  }

  .stance-counter {
    font-size: 0.75rem;
    color: #38bdf8;
  }

  .stance-desc {
    font-size: 0.76rem;
    color: #94a3b8;
    line-height: 1.35;
  }

  .arts-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .art-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
    transition: all 0.2s;
  }

  .art-card.equipped {
    border: 2px solid #38bdf8;
    background: rgba(56, 189, 248, 0.12);
  }

  .art-card.locked {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .art-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .art-icon {
    font-size: 1.8rem;
  }

  .art-name {
    font-weight: 800;
    font-size: 0.95rem;
    color: #fff;
  }

  .art-meta {
    font-size: 0.74rem;
    color: #f59e0b;
  }

  .art-desc {
    font-size: 0.78rem;
    color: #94a3b8;
    line-height: 1.35;
  }

  .tag-eq {
    color: #38bdf8;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .tag-avail {
    color: #cbd5e1;
    font-size: 0.78rem;
  }

  .tag-lock {
    color: #f87171;
    font-size: 0.78rem;
  }

  .classes-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin-bottom: 14px;
  }

  .class-btn {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px;
    cursor: pointer;
    color: #fff;
    text-align: center;
  }

  .class-btn.active {
    border: 2px solid #f59e0b;
    background: rgba(245, 158, 11, 0.15);
  }

  .class-icon {
    font-size: 1.6rem;
  }

  .class-name {
    font-weight: 800;
    font-size: 0.92rem;
    margin: 4px 0 2px;
  }

  .class-sub {
    font-size: 0.72rem;
    color: #94a3b8;
  }

  .nodes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .talent-node-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }

  .node-header {
    display: flex;
    justify-content: space-between;
  }

  .node-name {
    font-weight: 800;
    font-size: 0.9rem;
    color: #fff;
  }

  .node-rank {
    font-size: 0.78rem;
    color: #f59e0b;
    font-weight: 700;
  }

  .node-desc {
    font-size: 0.76rem;
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    .stances-grid,
    .arts-grid,
    .classes-grid,
    .nodes-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
