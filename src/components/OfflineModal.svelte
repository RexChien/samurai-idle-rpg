<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';

  const modal = $derived(gameStore.offlineModal);
</script>

{#if modal?.open}
  <div class="offline-overlay">
    <div class="offline-panel">
      <h2 class="offline-title">🌌 常世狹縫・離線修煉結算</h2>
      <div class="offline-desc">
        您已離線修煉了 <strong>{modal.hours} 小時</strong>！式神在常世中持續為您斬妖除魔，累積豐厚戰果：
      </div>

      <div class="offline-stats-grid">
        <div class="off-box">⚔️ 討伐妖怪: <strong>{modal.kills.toLocaleString()}</strong> 隻</div>
        <div class="off-box">📈 獲得修為: <strong>+{modal.exp.toLocaleString()}</strong> EXP</div>
        <div class="off-box">💰 獲得金幣: <strong>+{modal.gold.toLocaleString()}</strong> 兩</div>
        <div class="off-box">🪨 採集玉鋼: <strong>+{modal.iron}</strong> 塊</div>
      </div>

      {#if modal.gears && modal.gears.length > 0}
        <div class="bonus-gear-msg">
          🎁 額外尋獲史詩名刀：{modal.gears.map((n) => `【${n}】`).join('、')}
        </div>
      {/if}

      <button class="btn btn-gold btn-xl btn-block" onclick={() => (modal.open = false)}>
        收下修煉成果・繼續征戰
      </button>
    </div>
  </div>
{/if}

<style>
  .offline-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    backdrop-filter: blur(5px);
  }

  .offline-panel {
    background: #11141c;
    border: 2px solid #38bdf8;
    border-radius: 12px;
    max-width: 520px;
    width: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    box-shadow: 0 0 25px rgba(56, 189, 248, 0.25);
  }

  .offline-title {
    font-size: 1.3rem;
    font-weight: 900;
    color: #38bdf8;
  }

  .offline-desc {
    font-size: 0.92rem;
    color: #cbd5e1;
    line-height: 1.5;
  }

  .offline-stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .off-box {
    background: #0d1117;
    border: 1px solid #334155;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.88rem;
    color: #cbd5e1;
  }

  .off-box strong {
    color: #fde047;
  }

  .bonus-gear-msg {
    color: #f59e0b;
    font-weight: 700;
    font-size: 0.88rem;
  }
</style>
