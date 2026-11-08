<script lang="ts">
  import { gameStore } from './engine/GameStore.svelte';
  import HeaderHUD from './components/HeaderHUD.svelte';
  import NavigationTabs from './components/NavigationTabs.svelte';
  import TabWorldBattle from './components/TabWorldBattle.svelte';
  import TabQuests from './components/TabQuests.svelte';
  import TabGear from './components/TabGear.svelte';
  import TabTalents from './components/TabTalents.svelte';
  import TabPvPAbyss from './components/TabPvPAbyss.svelte';
  import TabMarketChat from './components/TabMarketChat.svelte';
  import TabAchievements from './components/TabAchievements.svelte';
  import TitleScreenModal from './components/TitleScreenModal.svelte';
  import StoryModal from './components/StoryModal.svelte';
  import OfflineModal from './components/OfflineModal.svelte';
  import DiabloAchievementBanner from './components/DiabloAchievementBanner.svelte';
  import Toast from './components/Toast.svelte';
</script>

<div class="game-app-container">
  <HeaderHUD />

  <main class="game-main-content">
    <NavigationTabs />

    {#if gameStore.activeTab === 'battle'}
      <TabWorldBattle />
    {:else if gameStore.activeTab === 'quests'}
      <TabQuests />
    {:else if gameStore.activeTab === 'gear'}
      <TabGear />
    {:else if gameStore.activeTab === 'talents'}
      <TabTalents />
    {:else if gameStore.activeTab === 'pvp'}
      <TabPvPAbyss />
    {:else if gameStore.activeTab === 'market'}
      <TabMarketChat />
    {:else if gameStore.activeTab === 'achievements'}
      <TabAchievements />
    {/if}
  </main>

  <!-- 全域彈窗與特效層 -->
  <TitleScreenModal />
  <StoryModal />
  <OfflineModal />
  <DiabloAchievementBanner />
  <Toast />
</div>

<style>
  :global(:root) {
    --gold-accent: #f59e0b;
    --border-color: #334155;
    --bg-dark: #0f1117;
    --text-main: #f1f5f9;
  }

  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  :global(body) {
    background: #090a0f;
    color: var(--text-main);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans TC", sans-serif;
    overflow-x: hidden;
    min-height: 100vh;
  }

  :global(.btn) {
    border: none;
    border-radius: 6px;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.15s;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :global(.btn-sm) {
    padding: 6px 12px;
    font-size: 0.82rem;
  }

  :global(.btn-xl) {
    padding: 12px 20px;
    font-size: 1.05rem;
  }

  :global(.btn-block) {
    width: 100%;
  }

  :global(.btn-gold) {
    background: linear-gradient(135deg, #d97706, #f59e0b);
    color: #000;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
  }

  :global(.btn-gold:hover) {
    background: linear-gradient(135deg, #b45309, #d97706);
    color: #fff;
  }

  :global(.btn-outline) {
    background: transparent;
    border: 1px solid #475569;
    color: #cbd5e1;
  }

  :global(.btn-outline:hover) {
    background: #1e293b;
    border-color: #94a3b8;
    color: #fff;
  }

  :global(.btn-crimson) {
    background: linear-gradient(135deg, #b91c1c, #dc2626);
    color: #fff;
  }

  :global(.btn-danger) {
    background: #7f1d1d;
    color: #fca5a5;
    border: 1px solid #991b1b;
  }

  .game-app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .game-main-content {
    max-width: 1400px;
    width: 100%;
    margin: 0 auto;
    padding: 0 16px 40px;
    flex: 1;
  }

  @media (max-width: 768px) {
    .game-main-content {
      padding: 0 10px 40px;
    }
  }
</style>
