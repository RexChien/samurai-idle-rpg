<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';

  const banner = $derived(gameStore.achievementBanner);
</script>

{#if banner?.open}
  <div class="diablo-achievement-banner">
    <div class="banner-crest">
      <span class="crest-icon">{banner.icon}</span>
    </div>
    <div class="banner-body">
      <div class="banner-header">🏆 成就達成！</div>
      <div class="banner-title">{banner.name}</div>
      <div class="banner-desc">{banner.desc}</div>
    </div>
    <div class="banner-points">+{banner.points}</div>
  </div>
{/if}

<style>
  .diablo-achievement-banner {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, rgba(30, 20, 15, 0.95), rgba(15, 10, 8, 0.98));
    border: 2px solid #f59e0b;
    border-radius: 10px;
    padding: 10px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 0 25px rgba(245, 158, 11, 0.5);
    z-index: 1000;
    animation: bannerPop 0.4s ease-out;
  }

  @keyframes bannerPop {
    from {
      opacity: 0;
      transform: translate(-50%, 20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0) scale(1);
    }
  }

  .banner-crest {
    font-size: 2.2rem;
  }

  .banner-header {
    font-size: 0.76rem;
    color: #f59e0b;
    font-weight: 800;
    letter-spacing: 1px;
  }

  .banner-title {
    font-size: 1.1rem;
    font-weight: 900;
    color: #fff;
  }

  .banner-desc {
    font-size: 0.8rem;
    color: #cbd5e1;
  }

  .banner-points {
    font-size: 1.2rem;
    font-weight: 900;
    color: #fde047;
  }
</style>
