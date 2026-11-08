<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import PixelPortrait from './PixelPortrait.svelte';

  const modal = $derived(gameStore.storyModal);
</script>

{#if modal?.open}
  <div class="tvgame-story-overlay">
    <div class="tvgame-cutscene-box">
      <div class="ff6-corner tl"></div>
      <div class="ff6-corner tr"></div>
      <div class="ff6-corner bl"></div>
      <div class="ff6-corner br"></div>

      <!-- 頂部章節標題框 -->
      <div class="cutscene-title-banner">
        <span class="chapter-pill">📜 {modal.chapter}</span>
        <h2 class="chapter-title">{modal.title}</h2>
        <span class="console-tag">SFC FF6 / BUSHIDO TV-GAME EVENT</span>
      </div>

      <!-- 主體：左側巨幅半身特寫立繪 ＋ 右側大型 TV GAME 對話文字 -->
      <div class="cutscene-body">
        <div class="cutscene-portrait-box">
          <PixelPortrait spriteId={modal.npc} scale={5} mode="bust" label={modal.npc} />
          <div class="portrait-name-plate">【{modal.npc}】</div>
        </div>

        <div class="cutscene-text-area">
          <div class="cutscene-dialogue">
            「{modal.dialogue}」
            <span class="ff6-cursor-blink">▼</span>
          </div>
          <div class="cutscene-lore">
            {modal.lore}
          </div>
        </div>
      </div>

      <div class="cutscene-footer">
        <button class="tvgame-confirm-btn" onclick={() => gameStore.closeStoryModal()}>
          <span class="hand-ptr">☞</span> 謹遵教誨・拔刀推進劇情！（確認 / A鍵）
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .tvgame-story-overlay {
    position: fixed;
    inset: 0;
    background: rgba(2, 6, 20, 0.88);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    backdrop-filter: blur(6px);
  }

  .tvgame-cutscene-box {
    max-width: 920px;
    width: 100%;
    background: linear-gradient(180deg, #153494 0%, #091852 55%, #040a26 100%);
    border: 4px solid #e2e8f0;
    box-shadow:
      inset 0 0 0 3px #1d4ed8,
      inset 0 0 0 5px #fbbf24,
      0 20px 60px rgba(0, 0, 0, 0.95);
    border-radius: 14px;
    padding: 24px 28px;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .ff6-corner {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #fbbf24;
    border: 2px solid #ffffff;
    border-radius: 2px;
  }
  .ff6-corner.tl { top: 5px; left: 5px; }
  .ff6-corner.tr { top: 5px; right: 5px; }
  .ff6-corner.bl { bottom: 5px; left: 5px; }
  .ff6-corner.br { bottom: 5px; right: 5px; }

  .cutscene-title-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 2px solid rgba(251, 191, 36, 0.5);
  }

  .chapter-pill {
    background: linear-gradient(180deg, #d97706, #92400e);
    border: 2px solid #fde047;
    color: #ffffff;
    font-size: 0.95rem;
    font-weight: 900;
    padding: 4px 14px;
    border-radius: 6px;
    text-shadow: 1px 1px 0 #000;
  }

  .chapter-title {
    font-size: 1.65rem;
    font-weight: 900;
    color: #fde047;
    text-shadow: 2px 2px 0 #000;
    flex: 1;
  }

  .console-tag {
    font-size: 0.78rem;
    font-weight: 900;
    color: #93c5fd;
    letter-spacing: 1.5px;
  }

  .cutscene-body {
    display: flex;
    align-items: center;
    gap: 26px;
  }

  .cutscene-portrait-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: radial-gradient(circle, #1e3a8a 0%, #050814 100%);
    border: 3px solid #fbbf24;
    box-shadow: inset 0 0 0 2px #e2e8f0, 0 8px 24px rgba(0, 0, 0, 0.85);
    border-radius: 12px;
    padding: 10px;
    flex-shrink: 0;
  }

  .portrait-name-plate {
    font-size: 1.05rem;
    font-weight: 900;
    color: #fde047;
    text-shadow: 2px 2px 0 #000;
  }

  .cutscene-text-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .cutscene-dialogue {
    font-size: 1.42rem;
    font-weight: 900;
    color: #ffffff;
    text-shadow: 2px 2px 0 #000000;
    line-height: 1.65;
  }

  .ff6-cursor-blink {
    display: inline-block;
    margin-left: 8px;
    color: #fde047;
    animation: blink 0.75s infinite alternate;
  }

  @keyframes blink {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0.2; transform: translateY(4px); }
  }

  .cutscene-lore {
    background: rgba(4, 10, 34, 0.75);
    border-left: 4px solid #fbbf24;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 1.05rem;
    color: #dbeafe;
    line-height: 1.65;
    text-shadow: 1px 1px 0 #000;
  }

  .cutscene-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }

  .tvgame-confirm-btn {
    background: linear-gradient(180deg, #2563eb 0%, #1e3a8a 100%);
    border: 3px solid #fde047;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.7);
    color: #ffffff;
    font-size: 1.2rem;
    font-weight: 900;
    text-shadow: 2px 2px 0 #000;
    padding: 12px 28px;
    border-radius: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.15s;
  }

  .tvgame-confirm-btn:hover {
    background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(250, 204, 21, 0.45);
  }

  .hand-ptr {
    color: #fde047;
    font-size: 1.35rem;
  }
</style>
