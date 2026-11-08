<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { AUTOMATION_TIERS, FIVE_RINGS_STANCES } from '../data/stancesArts';
  import WorldMapCanvas from './WorldMapCanvas.svelte';
  import PixelPortrait from './PixelPortrait.svelte';

  const player = $derived(gameStore.player);
  const curTier = $derived(AUTOMATION_TIERS[player.automationTier] || AUTOMATION_TIERS[0]);
  const enemy = $derived(gameStore.currentEnemy);
  const curStance = $derived(FIVE_RINGS_STANCES[player.stance] || FIVE_RINGS_STANCES.earth);

  let isPressing = false;
  let continuousTimer: number | null = null;

  function startHoldSlash() {
    isPressing = true;
    gameStore.manualSlash();
    continuousTimer = window.setInterval(() => {
      if (isPressing) gameStore.manualSlash();
    }, 200);
  }

  function stopHoldSlash() {
    isPressing = false;
    if (continuousTimer) clearInterval(continuousTimer);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === 'Space' && !e.repeat && gameStore.activeTab === 'battle') {
      e.preventDefault();
      gameStore.manualSlash();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="tab-world-battle">
  <!-- 2D Canvas 3頭身像素開放世界地圖 -->
  <WorldMapCanvas />

  <!-- 戰鬥與 3頭身像素對手狀態列 -->
  <div class="combat-status-card">
    <div class="enemy-header">
      <div class="enemy-pixel-frame">
        <PixelPortrait spriteId={enemy.avatar || enemy.name} scale={2} label={enemy.name} />
      </div>
      <div class="enemy-details">
        <div class="enemy-name">
          {enemy.isBoss ? '👑 [常世首領] ' : ''}{enemy.name}
        </div>
        <div class="enemy-hp-bar-bg">
          <div class="enemy-hp-bar-fill" style="width: {Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100))}%;"></div>
        </div>
        <div class="enemy-hp-text">{Math.max(0, enemy.hp).toLocaleString()} / {enemy.maxHp.toLocaleString()} HP</div>
      </div>
      <div class="stance-badge">
        <span class="stance-icon">{curStance.icon}</span>
        <span class="stance-title">{curStance.name}</span>
      </div>
    </div>
  </div>

  <!-- 無障礙友善：超大顆手動拔刀斬擊按鈕與奧義施放 -->
  <div class="combat-primary-panel">
    <div class="combat-btns-row">
      <button
        class="btn btn-slash-giant"
        onmousedown={startHoldSlash}
        onmouseup={stopHoldSlash}
        ontouchstart={startHoldSlash}
        ontouchend={stopHoldSlash}
      >
        ⚔️ 親手拔刀揮斬！(點擊 / 按住連斬 / 空白鍵)
      </button>

      <button class="btn btn-skill-cast" onclick={() => gameStore.castArtBurst()}>
        ⚡ 奧義爆發
      </button>
    </div>

    <!-- 4階自動境界狀態列 -->
    <div class="automation-status-bar">
      <div class="auto-tier-info">
        <span class="tier-badge">⚙️ 自動境界：{curTier.name}</span>
        <span class="tier-desc">{curTier.badge}</span>
      </div>
      <div class="auto-actions">
        <button
          class="btn {player.autoSlashEnabled ? 'btn-gold' : 'btn-outline'} btn-sm"
          onclick={() => gameStore.toggleAutoSlash()}
        >
          {player.automationTier <= 0
            ? '🔒 自動揮刀 (完成M01解鎖)'
            : player.autoSlashEnabled
            ? `🤖 自動揮刀：開啟中 (${(curTier.intervalMs / 1000).toFixed(2)}s/斬)`
            : '✋ 自動揮刀：已暫停 (點擊啟動)'}
        </button>
        <button class="btn btn-outline btn-sm" onclick={() => (gameStore.activeTab = 'quests')}>
          📜 任務修煉
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .tab-world-battle {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .combat-status-card {
    background: #161b22;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px 16px;
  }

  .enemy-header {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .enemy-pixel-frame {
    width: 48px;
    height: 54px;
    background: #0d1117;
    border: 1px solid #475569;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .enemy-details {
    flex: 1;
    min-width: 180px;
  }

  .enemy-name {
    font-size: 1.05rem;
    font-weight: 900;
    color: #fff;
    margin-bottom: 4px;
  }

  .enemy-hp-bar-bg {
    height: 12px;
    background: #1e293b;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #334155;
  }

  .enemy-hp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ef4444, #f87171);
    transition: width 0.15s;
  }

  .enemy-hp-text {
    font-size: 0.78rem;
    color: #94a3b8;
    margin-top: 3px;
    text-align: right;
  }

  .stance-badge {
    background: #1e293b;
    border: 1px solid #475569;
    padding: 6px 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stance-icon {
    font-size: 1.4rem;
  }

  .stance-title {
    font-size: 0.88rem;
    font-weight: 800;
    color: #f59e0b;
  }

  .combat-primary-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .combat-btns-row {
    display: grid;
    grid-template-columns: 2.5fr 1fr;
    gap: 10px;
  }

  .btn-slash-giant {
    background: linear-gradient(135deg, #b91c1c, #dc2626);
    border: 2px solid #fca5a5;
    color: #fff;
    font-size: 1.1rem;
    font-weight: 900;
    padding: 14px 16px;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.45);
    user-select: none;
    text-align: center;
  }

  .btn-slash-giant:active {
    transform: scale(0.97);
  }

  .btn-skill-cast {
    background: linear-gradient(135deg, #1d4ed8, #3b82f6);
    border: 2px solid #93c5fd;
    color: #fff;
    font-size: 1rem;
    font-weight: 800;
    padding: 14px 10px;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
    user-select: none;
  }

  .automation-status-bar {
    background: #161b22;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .auto-tier-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .tier-badge {
    font-weight: 900;
    font-size: 0.95rem;
    color: #f59e0b;
  }

  .tier-desc {
    font-size: 0.78rem;
    color: #94a3b8;
  }

  .auto-actions {
    display: flex;
    gap: 8px;
  }

  @media (max-width: 768px) {
    .combat-btns-row {
      grid-template-columns: 1fr;
    }
    .btn-slash-giant {
      font-size: 0.98rem;
      padding: 12px 10px;
    }
    .automation-status-bar {
      flex-direction: column;
      align-items: stretch;
      text-align: center;
    }
    .auto-actions {
      flex-direction: column;
    }
    .auto-actions .btn {
      width: 100%;
    }
  }
</style>
