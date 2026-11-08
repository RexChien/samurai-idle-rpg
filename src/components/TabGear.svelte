<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { GEAR_SLOTS, GEAR_QUALITIES } from '../data/gear';
  import type { GearSlot } from '../types/game';

  const player = $derived(gameStore.player);
  const slots: GearSlot[] = ['weapon', 'offhand', 'helm', 'armor', 'boots', 'accessory'];
</script>

<div class="tab-gear">
  <!-- 1. 六大已裝備神兵卡槽 -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">🥋 當前穿戴之名器武具</h2>
      <button class="btn btn-gold btn-sm" onclick={() => gameStore.smartEquipBetterGear()}>
        ⚡ 一鍵智慧穿戴
      </button>
    </div>

    <div class="equipped-slots-grid">
      {#each slots as s}
        {@const gear = player.equipped[s]}
        {@const slotMeta = GEAR_SLOTS[s]}
        {#if gear}
          {@const qMeta = GEAR_QUALITIES[gear.quality] || GEAR_QUALITIES.common}
          <div class="gear-slot-card" style="border-color: {qMeta.border}; background: {qMeta.bgGlow};">
            <div class="gear-slot-header">
              <span class="gear-icon">{gear.icon}</span>
              <div class="gear-meta">
                <div class="gear-name" style="color: {qMeta.color};">
                  {gear.name} {gear.upgradeLevel ? `+${gear.upgradeLevel}` : ''}
                </div>
                <div class="gear-sub">{gear.slotName} | 戰力 +{gear.gearScore}</div>
              </div>
            </div>
            <div class="gear-slot-actions">
              <button class="btn btn-sm btn-gold" onclick={() => gameStore.upgradeGear(gear.uid)}>🔨 強化</button>
              <button class="btn btn-sm btn-outline" onclick={() => gameStore.unequipGear(s)}>卸下</button>
            </div>
          </div>
        {:else}
          <div class="gear-slot-card empty-slot">
            <span class="slot-placeholder-icon">{slotMeta.icon}</span>
            <div class="slot-name">{slotMeta.name}</div>
            <div class="slot-status">未裝備</div>
          </div>
        {/if}
      {/each}
    </div>
  </section>

  <!-- 2. 行囊熔煉設定 -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">🎒 行囊神兵庫 ({player.inventory.length} / 50)</h2>
      <div class="decompose-options">
        <label><input type="checkbox" bind:checked={player.settings.autoDecomposeCommon} /> 自動分解白裝</label>
        <label><input type="checkbox" bind:checked={player.settings.autoDecomposeMagic} /> 自動分解藍裝</label>
      </div>
    </div>

    <!-- 行囊列表 -->
    {#if player.inventory.length === 0}
      <div class="empty-inventory-msg">
        🎒 行囊空空如也。請至【征戰＆大地圖】討伐妖魔或開啟寶箱，掉落神兵將存於此！
      </div>
    {:else}
      <div class="inventory-grid">
        {#each player.inventory as item}
          {@const qMeta = GEAR_QUALITIES[item.quality] || GEAR_QUALITIES.common}
          <div class="inv-card" style="border-color: {qMeta.border}; background: {qMeta.bgGlow};">
            <div class="inv-card-header">
              <span class="inv-icon">{item.icon}</span>
              <div>
                <div class="inv-name" style="color: {qMeta.color};">{item.name}</div>
                <div class="inv-sub">{item.slotName} | 戰力 +{item.gearScore}</div>
              </div>
            </div>

            <div class="inv-affixes">
              {#if item.baseAtk}<span class="affix-tag">攻擊 +{item.baseAtk}</span>{/if}
              {#if item.baseDef}<span class="affix-tag">防禦 +{item.baseDef}</span>{/if}
              {#if item.baseHP}<span class="affix-tag">生命 +{item.baseHP}</span>{/if}
              {#each item.affixes as a}
                <span class="affix-tag">{a.text}</span>
              {/each}
              {#if item.legendaryPower}
                <div class="power-tag">🌟 {item.legendaryPower.name}: {item.legendaryPower.desc}</div>
              {/if}
            </div>

            <div class="inv-actions">
              <button class="btn btn-sm btn-gold" onclick={() => gameStore.equipGear(item.uid)}>穿戴</button>
              <button class="btn btn-sm btn-danger" onclick={() => gameStore.decomposeSingleGear(item.uid)}>分解</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>

<style>
  .tab-gear {
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
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 1rem;
    font-weight: 900;
    color: #f59e0b;
  }

  .equipped-slots-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .gear-slot-card {
    background: #0d1117;
    border: 2px solid #334155;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }

  .empty-slot {
    align-items: center;
    justify-content: center;
    min-height: 90px;
    opacity: 0.6;
    border-style: dashed;
  }

  .slot-placeholder-icon {
    font-size: 1.8rem;
  }

  .slot-name {
    font-weight: 800;
    color: #fff;
    font-size: 0.88rem;
  }

  .slot-status {
    font-size: 0.76rem;
    color: #94a3b8;
  }

  .gear-slot-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .gear-icon {
    font-size: 1.8rem;
  }

  .gear-name {
    font-weight: 800;
    font-size: 0.92rem;
  }

  .gear-sub {
    font-size: 0.76rem;
    color: #94a3b8;
  }

  .gear-slot-actions {
    display: flex;
    gap: 6px;
  }

  .decompose-options {
    display: flex;
    gap: 12px;
    font-size: 0.82rem;
    color: #cbd5e1;
  }

  .empty-inventory-msg {
    text-align: center;
    color: #94a3b8;
    padding: 30px;
    font-size: 0.95rem;
  }

  .inventory-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .inv-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }

  .inv-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .inv-icon {
    font-size: 1.6rem;
  }

  .inv-name {
    font-weight: 800;
    font-size: 0.9rem;
  }

  .inv-sub {
    font-size: 0.74rem;
    color: #94a3b8;
  }

  .inv-affixes {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .affix-tag {
    background: rgba(255, 255, 255, 0.06);
    font-size: 0.74rem;
    padding: 2px 6px;
    border-radius: 4px;
    color: #cbd5e1;
  }

  .power-tag {
    font-size: 0.78rem;
    color: #fb923c;
    font-weight: 700;
    margin-top: 4px;
  }

  .inv-actions {
    display: flex;
    gap: 6px;
    margin-top: 6px;
  }

  @media (max-width: 768px) {
    .equipped-slots-grid,
    .inventory-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
