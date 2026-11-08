<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';

  const toast = $derived(gameStore.toast);
</script>

{#if toast}
  <div class="toast-wrapper">
    <div class="toast-box toast-{toast.type}">
      {toast.text}
    </div>
  </div>
{/if}

<style>
  .toast-wrapper {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    pointer-events: none;
    animation: toastSlide 0.3s ease-out;
  }

  @keyframes toastSlide {
    from {
      opacity: 0;
      transform: translate(-50%, -15px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }

  .toast-box {
    background: #11141c;
    border: 1px solid #475569;
    color: #fff;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 0.92rem;
    font-weight: 700;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  }

  .toast-success {
    border-color: #4ade80;
    color: #86efac;
  }

  .toast-warning {
    border-color: #f59e0b;
    color: #fde047;
  }

  .toast-danger {
    border-color: #ef4444;
    color: #fca5a5;
  }

  .toast-info {
    border-color: #38bdf8;
    color: #bae6fd;
  }
</style>
