<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';

  const tabs = [
    { id: 'battle', label: '🗺️ 探索＆指令戰', primary: true },
    { id: 'quests', label: '📜 劇情＆委託' },
    { id: 'gear', label: '🗡️ 名刀＆鍛冶' },
    { id: 'talents', label: '☯️ 五輪＆流派' },
    { id: 'pvp', label: '🏆 御前試合＆奈落' },
    { id: 'market', label: '🍵 樂市＆茶屋' },
    { id: 'achievements', label: '🎖️ 傳記＆奉行所' }
  ];
</script>

<nav class="nav-tabs-grid">
  {#each tabs as tab}
    <button
      class="tab-btn {gameStore.activeTab === tab.id ? 'active' : ''} {tab.primary ? 'tab-btn-primary' : ''}"
      onclick={() => (gameStore.activeTab = tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</nav>

<style>
  .nav-tabs-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    margin: 12px 0;
  }

  .tab-btn {
    background: #1e293b;
    border: 1px solid #334155;
    color: #94a3b8;
    padding: 10px 6px;
    border-radius: 8px;
    font-size: 0.88rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    white-space: nowrap;
  }

  .tab-btn:hover {
    background: #334155;
    color: #fff;
  }

  .tab-btn.active {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(30, 41, 59, 0.95));
    border: 2px solid #f59e0b;
    color: #fde047;
    box-shadow: 0 0 12px rgba(245, 158, 11, 0.35);
  }

  @media (max-width: 768px) {
    .nav-tabs-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }
    .tab-btn-primary {
      grid-column: span 2;
    }
    .tab-btn {
      font-size: 0.82rem;
      padding: 8px 4px;
    }
  }
</style>
