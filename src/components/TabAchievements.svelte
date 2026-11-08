<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { ACHIEVEMENTS_DB, DAILY_SIGNIN_REWARDS } from '../data/achievements';

  const player = $derived(gameStore.player);
  const claimedDays = $derived(player.dailySignIn?.claimedDays || 0);
  const todayStr = new Date().toISOString().slice(0, 10);
  const alreadyClaimedToday = $derived(player.dailySignIn?.lastClaimDate === todayStr);
</script>

<div class="tab-achievements">
  <!-- 1. 每日七日修煉登入禮 -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">📅 天明武士七日登入修行（已累計簽到：{claimedDays} 天）</h2>
      <button
        class="btn {alreadyClaimedToday ? 'btn-outline' : 'btn-gold'} btn-sm"
        disabled={alreadyClaimedToday}
        onclick={() => gameStore.claimDailySignIn()}
      >
        {alreadyClaimedToday ? '✅ 今日已簽到' : '🎁 領取今日修行禮'}
      </button>
    </div>

    <div class="signin-grid">
      {#each DAILY_SIGNIN_REWARDS as rw}
        {@const isClaimed = claimedDays >= rw.day}
        {@const isToday = !alreadyClaimedToday && (claimedDays % 7) + 1 === rw.day}
        <div class="signin-day-card {isClaimed ? 'claimed' : ''} {isToday ? 'current' : ''}">
          <div class="day-num">第 {rw.day} 天</div>
          <div class="day-icon">{rw.gearQuality ? '📿' : rw.title ? '🎖️' : '💰'}</div>
          <div class="day-desc">{rw.desc}</div>
          <div class="day-status">
            {#if isClaimed}
              <span class="status-done">已領取</span>
            {:else if isToday}
              <span class="status-now">今日可領</span>
            {:else}
              <span class="status-lock">待解鎖</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 2. 暗黑破壞神式成就系統 -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">🏆 戰國武者武道成就（成就點數解鎖專屬限定稱號）</h2>
      <button class="btn btn-outline btn-sm" onclick={() => gameStore.claimAllAchievements()}>
        ✨ 一鍵領取全部獎勵
      </button>
    </div>

    <div class="achievements-list">
      {#each ACHIEVEMENTS_DB as ach}
        {@const achState = player.achievements[ach.id]}
        {@const isUnlocked = achState?.unlocked}
        {@const isClaimed = achState?.claimed}
        <div class="ach-card {isUnlocked ? 'unlocked' : ''}">
          <span class="ach-icon">{ach.icon}</span>
          <div class="ach-body">
            <div class="ach-name-row">
              <span class="ach-name">{ach.name}</span>
              <span class="ach-pts">+{ach.points} 點</span>
            </div>
            <div class="ach-desc">{ach.desc}</div>
          </div>
          <div class="ach-action">
            {#if isClaimed}
              <button class="btn btn-outline btn-sm" disabled>已領取</button>
            {:else if isUnlocked}
              <button class="btn btn-gold btn-sm" onclick={() => gameStore.claimAchievement(ach.id)}>
                領取獎勵
              </button>
            {:else}
              <span class="ach-locked-tag">🔒 未達成</span>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .tab-achievements {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .section-card {
    background: #161b22;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 16px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 900;
    color: #f59e0b;
  }

  .signin-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 8px;
  }

  .signin-day-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;
  }

  .signin-day-card.claimed {
    opacity: 0.55;
    border-color: #475569;
  }

  .signin-day-card.current {
    border: 2px solid #f59e0b;
    background: rgba(245, 158, 11, 0.12);
  }

  .day-num {
    font-size: 0.74rem;
    color: #f59e0b;
    font-weight: 700;
  }

  .day-icon {
    font-size: 1.8rem;
  }

  .day-desc {
    font-size: 0.7rem;
    color: #cbd5e1;
    line-height: 1.25;
  }

  .day-status {
    font-size: 0.7rem;
    font-weight: 700;
    margin-top: 2px;
  }

  .status-done {
    color: #4ade80;
  }

  .status-now {
    color: #fde047;
  }

  .status-lock {
    color: #64748b;
  }

  .achievements-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ach-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0.65;
  }

  .ach-card.unlocked {
    opacity: 1;
    border-color: #64748b;
  }

  .ach-icon {
    font-size: 1.8rem;
  }

  .ach-body {
    flex: 1;
  }

  .ach-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ach-name {
    font-weight: 800;
    color: #fff;
    font-size: 0.95rem;
  }

  .ach-pts {
    font-size: 0.76rem;
    color: #f59e0b;
    font-weight: 700;
  }

  .ach-desc {
    font-size: 0.78rem;
    color: #94a3b8;
    margin-top: 2px;
  }

  .ach-locked-tag {
    font-size: 0.76rem;
    color: #64748b;
  }

  @media (max-width: 768px) {
    .signin-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
