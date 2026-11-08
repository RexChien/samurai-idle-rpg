<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { SAMURAI_CLASSES } from '../data/classes';
  import { TENMEI_LORE } from '../data/tenmeiLore';
  import PixelPortrait from './PixelPortrait.svelte';

  const player = $derived(gameStore.player);
  let isCreating = $state(false);
  let nameInput = $state('宮本武藏');
  let selectedClassId = $state('kensei');
  let selectedAvatar = $state('samurai_general');

  const avatars = [
    { id: 'samurai_general', label: '劍豪羽織' },
    { id: 'samurai_oni', label: '般若武者' },
    { id: 'samurai_lord', label: '旗本大將' },
    { id: 'samurai_female', label: '破邪巫女' }
  ];

  function startCreation() {
    isCreating = true;
  }

  function confirmCreation() {
    gameStore.startNewGame(nameInput.trim(), selectedClassId, selectedAvatar);
  }
</script>

{#if !player.characterCreated}
  <div class="title-overlay">
    <div class="title-panel">
      {#if !isCreating}
        <div class="title-content">
          <div class="era-tag">【{TENMEI_LORE.era}・王道和風指令制 JRPG】</div>
          <h1 class="game-main-title">新武士道列傳 RPG</h1>
          <div class="game-subtitle">二天一流・三人小隊與五輪百鬼譚 (Shin Bushido Retsuden RPG)</div>

          <div class="title-pixel-showcase">
            <PixelPortrait spriteId="samurai_general" scale={3} />
            <PixelPortrait spriteId="samurai_female" scale={3} />
            <PixelPortrait spriteId="npc_hayate" scale={3} />
            <PixelPortrait spriteId="npc_yagyu" scale={3} />
          </div>

          <div class="lore-summary">
            {TENMEI_LORE.background}
          </div>

          <div class="title-actions">
            <button class="btn btn-gold btn-xl btn-block" onclick={startCreation}>
              ⚔️ 結成三人小隊・新遊戲創角
            </button>
          </div>
        </div>
      {:else}
        <div class="creation-content">
          <h2 class="creation-title">🗡️ 銘刻真名・挑選3頭身像素武士造型</h2>

          <div class="form-group">
            <label for="char-name-input" class="form-label">武士尊姓大名：</label>
            <input id="char-name-input" type="text" bind:value={nameInput} class="form-input" placeholder="輸入名號" />
          </div>

          <div class="form-group">
            <div class="form-label">3頭身像素外觀：</div>
            <div class="avatar-choices">
              {#each avatars as av}
                <button
                  type="button"
                  class="avatar-choice-btn {selectedAvatar === av.id ? 'active' : ''}"
                  onclick={() => (selectedAvatar = av.id)}
                >
                  <PixelPortrait spriteId={av.id} scale={2} label={av.label} />
                  <div class="choice-label">{av.label}</div>
                </button>
              {/each}
            </div>
          </div>

          <div class="form-group">
            <div class="form-label">初入世流派：</div>
            <div class="class-choices">
              {#each Object.values(SAMURAI_CLASSES) as c}
                <button
                  type="button"
                  class="class-choice-btn {selectedClassId === c.id ? 'active' : ''}"
                  onclick={() => (selectedClassId = c.id)}
                >
                  <span class="c-icon">{c.icon}</span>
                  <div class="c-name">{c.name}</div>
                  <div class="c-sub">{c.subtitle}</div>
                </button>
              {/each}
            </div>
          </div>

          <div class="class-desc-box">
            {SAMURAI_CLASSES[selectedClassId]?.desc}
          </div>

          <div class="creation-actions">
            <button class="btn btn-outline" onclick={() => (isCreating = false)}>返回</button>
            <button class="btn btn-gold btn-xl flex-1" onclick={confirmCreation}>
              踏入天明城下町・開始冒險
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .title-overlay {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at center, rgba(30, 24, 34, 0.95), rgba(8, 10, 15, 0.98));
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    overflow-y: auto;
  }

  .title-panel {
    background: #11141c;
    border: 2px solid #f59e0b;
    border-radius: 12px;
    max-width: 680px;
    width: 100%;
    padding: 20px;
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.25);
  }

  .title-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .era-tag {
    font-size: 0.88rem;
    color: #f59e0b;
    font-weight: 700;
  }

  .game-main-title {
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
  }

  .game-subtitle {
    font-size: 1.05rem;
    color: #38bdf8;
    font-weight: 800;
  }

  .title-pixel-showcase {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 18px;
    padding: 8px 0;
  }

  .lore-summary {
    font-size: 0.9rem;
    color: #cbd5e1;
    line-height: 1.6;
    background: rgba(0, 0, 0, 0.4);
    padding: 12px;
    border-radius: 8px;
    margin: 4px 0;
  }

  .creation-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .creation-title {
    font-size: 1.2rem;
    font-weight: 900;
    color: #f59e0b;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #94a3b8;
  }

  .form-input {
    background: #0d1117;
    border: 1px solid #334155;
    padding: 8px 12px;
    border-radius: 6px;
    color: #fff;
    font-size: 0.95rem;
  }

  .avatar-choices,
  .class-choices {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .avatar-choice-btn,
  .class-choice-btn {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 8px;
    color: #fff;
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .avatar-choice-btn.active,
  .class-choice-btn.active {
    border: 2px solid #f59e0b;
    background: rgba(245, 158, 11, 0.15);
  }

  .c-icon {
    font-size: 1.5rem;
  }

  .choice-label,
  .c-name {
    font-size: 0.82rem;
    font-weight: 800;
  }

  .c-sub {
    font-size: 0.72rem;
    color: #94a3b8;
  }

  .class-desc-box {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid #334155;
    padding: 10px;
    border-radius: 6px;
    font-size: 0.82rem;
    color: #cbd5e1;
    line-height: 1.45;
  }

  .creation-actions {
    display: flex;
    gap: 10px;
  }

  .flex-1 {
    flex: 1;
  }

  @media (max-width: 768px) {
    .avatar-choices,
    .class-choices {
      grid-template-columns: repeat(2, 1fr);
    }
    .game-main-title {
      font-size: 1.6rem;
    }
  }
</style>
