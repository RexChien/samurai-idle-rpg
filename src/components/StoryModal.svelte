<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import PixelPortrait from './PixelPortrait.svelte';

  const modal = $derived(gameStore.storyModal);
</script>

{#if modal?.open}
  <div class="story-overlay">
    <div class="scroll-wrapper">
      <div class="scroll-rod-top"></div>
      <div class="scroll-paper">
        <div class="scroll-chapter-tag">{modal.chapter}</div>
        <h2 class="scroll-title">{modal.title}</h2>

        <div class="scroll-npc-row">
          <div class="npc-pixel-box">
            <PixelPortrait spriteId={modal.npc} scale={2} label={modal.npc} />
          </div>
          <span class="scroll-npc-tag">引導名士：{modal.npc}</span>
        </div>

        <div class="scroll-dialogue">"{modal.dialogue}"</div>
        <div class="scroll-lore-body">{modal.lore}</div>

        <button class="btn btn-gold btn-xl btn-block" onclick={() => gameStore.closeStoryModal()}>
          謹遵教誨・拔刀出發！
        </button>
      </div>
      <div class="scroll-rod-bottom"></div>
    </div>
  </div>
{/if}

<style>
  .story-overlay {
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

  .scroll-wrapper {
    max-width: 620px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .scroll-rod-top,
  .scroll-rod-bottom {
    width: 104%;
    height: 18px;
    background: linear-gradient(90deg, #78350f, #d97706, #78350f);
    border-radius: 9px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.6);
  }

  .scroll-paper {
    width: 100%;
    background: #fbf7ee;
    color: #1c1917;
    border-left: 6px solid #b45309;
    border-right: 6px solid #b45309;
    padding: 22px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .scroll-chapter-tag {
    font-size: 0.85rem;
    color: #b45309;
    font-weight: 700;
  }

  .scroll-title {
    font-size: 1.45rem;
    font-weight: 900;
    color: #78350f;
  }

  .scroll-npc-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .npc-pixel-box {
    background: #27272a;
    border: 2px solid #b45309;
    border-radius: 8px;
    padding: 4px 6px;
    display: inline-flex;
  }

  .scroll-npc-tag {
    background: #e7e5e4;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 800;
  }

  .scroll-dialogue {
    font-size: 1.02rem;
    font-style: italic;
    color: #44403c;
    border-left: 3px solid #b45309;
    padding-left: 10px;
    line-height: 1.5;
  }

  .scroll-lore-body {
    font-size: 0.9rem;
    color: #57534e;
    line-height: 1.6;
    margin: 4px 0;
  }
</style>
