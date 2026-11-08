<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { MAIN_QUESTS } from '../data/quests';
  import { audio } from '../engine/AudioEngine';
  import PixelPortrait from './PixelPortrait.svelte';

  const player = $derived(gameStore.player);
  const stats = $derived(gameStore.calculatedStats);
  const curMain = $derived(MAIN_QUESTS[player.quests.currentMainIndex] || MAIN_QUESTS[0]);
  const mainProg = $derived(player.quests.mainProgress[curMain.id] || 0);
  let bgmOn = $state(audio.bgmEnabled);

  function toggleHeaderBgm() {
    bgmOn = audio.toggleBGM();
  }

  function autoTravelToQuest() {
    gameStore.showToast(`🧭 正在前往【${curMain.zone}】任務目標...`, 'info');
    gameStore.navigateToZone(curMain.zone);
  }
</script>

<header class="game-header">
  <div class="header-inner">
    <div class="header-avatar-group">
      <div class="avatar-frame">
        <PixelPortrait spriteId={player.cosmetics.avatar} scale={2} label={player.name} />
      </div>
      <div class="avatar-info">
        <div class="player-name-row">
          <span class="player-name">{player.name}</span>
          <span class="player-title">【{player.cosmetics.title}】</span>
          <span class="player-lvl">Lv.{player.level}</span>
        </div>
        <div class="exp-bar-box">
          <div class="exp-bar-fill" style="width: {Math.min(100, (player.exp / player.maxExp) * 100)}%;"></div>
          <span class="exp-text">{player.exp} / {player.maxExp} EXP</span>
        </div>
      </div>
    </div>

    <div class="header-currencies">
      <div class="currency-pill"><span class="icon">⚡</span> <span class="val">{stats.power.toLocaleString()}</span> <span class="lbl">戰力</span></div>
      <div class="currency-pill"><span class="icon">💰</span> <span class="val">{player.gold.toLocaleString()}</span> <span class="lbl">兩</span></div>
      <div class="currency-pill"><span class="icon">🪨</span> <span class="val">{player.iron.toLocaleString()}</span> <span class="lbl">玉鋼</span></div>
      <div class="currency-pill"><span class="icon">🔮</span> <span class="val">{player.souls.toLocaleString()}</span> <span class="lbl">魂玉</span></div>
      <button class="btn {bgmOn ? 'btn-gold' : 'btn-outline'} btn-sm" onclick={toggleHeaderBgm} title="開關和風背景音樂">
        {bgmOn ? '🎵 BGM' : '🔇 靜音'}
      </button>
    </div>
  </div>

  {#if curMain}
    <div class="quest-tracker-banner">
      <div class="quest-tracker-left">
        <span class="quest-tag">📜 主線</span>
        <span class="quest-name">{curMain.title}</span>
        <span class="quest-prog">({mainProg} / {curMain.targetKills})</span>
        <span class="quest-dialogue-short">"{curMain.dialogue}"</span>
      </div>
      <div class="quest-tracker-right">
        <button class="btn btn-gold btn-sm" onclick={autoTravelToQuest}>⚡ 一鍵自動前往</button>
      </div>
    </div>
  {/if}
</header>

<style>
  .game-header {
    background: rgba(15, 17, 23, 0.95);
    border-bottom: 2px solid #334155;
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(8px);
  }

  .header-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 10px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .header-avatar-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar-frame {
    width: 52px;
    height: 56px;
    border-radius: 10px;
    background: #1e293b;
    border: 2px solid var(--gold-accent, #f59e0b);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
    overflow: hidden;
  }

  .player-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .player-name {
    font-size: 1.1rem;
    font-weight: 900;
    color: #fff;
  }

  .player-title {
    font-size: 0.85rem;
    color: #f59e0b;
    font-weight: 700;
  }

  .player-lvl {
    background: #2563eb;
    color: #fff;
    font-size: 0.78rem;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 10px;
  }

  .exp-bar-box {
    margin-top: 4px;
    width: 200px;
    height: 8px;
    background: #1e293b;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .exp-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
    transition: width 0.3s;
  }

  .exp-text {
    position: absolute;
    top: -16px;
    right: 0;
    font-size: 0.72rem;
    color: #94a3b8;
  }

  .header-currencies {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .currency-pill {
    background: #1e293b;
    border: 1px solid #334155;
    padding: 4px 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.88rem;
  }

  .currency-pill .val {
    font-weight: 900;
    color: #fff;
  }

  .currency-pill .lbl {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  .quest-tracker-banner {
    background: linear-gradient(90deg, rgba(245, 158, 11, 0.12), rgba(15, 17, 23, 0.95));
    border-top: 1px solid rgba(245, 158, 11, 0.3);
    padding: 6px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    font-size: 0.88rem;
  }

  .quest-tracker-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .quest-tag {
    background: #f59e0b;
    color: #000;
    font-weight: 900;
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .quest-name {
    font-weight: 800;
    color: #fff;
  }

  .quest-prog {
    color: #38bdf8;
    font-weight: 700;
  }

  .quest-dialogue-short {
    color: #94a3b8;
    font-style: italic;
  }

  @media (max-width: 768px) {
    .header-inner {
      flex-direction: column;
      align-items: stretch;
    }
    .header-currencies {
      justify-content: space-between;
    }
    .currency-pill {
      flex: 1;
      justify-content: center;
    }
    .quest-tracker-banner {
      flex-direction: column;
      align-items: stretch;
    }
    .quest-tracker-right .btn {
      width: 100%;
    }
  }
</style>
