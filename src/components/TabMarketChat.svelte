<script lang="ts">
  import { gameStore } from '../engine/GameStore.svelte';
  import { generateGear, GEAR_QUALITIES } from '../data/gear';
  import type { GearItem } from '../types/game';
  import PixelPortrait from './PixelPortrait.svelte';

  const player = $derived(gameStore.player);

  let marketListings: GearItem[] = $state([
    generateGear('weapon', 'epic', 10),
    generateGear('offhand', 'legendary', 15),
    generateGear('armor', 'rare', 8),
    generateGear('boots', 'epic', 12)
  ]);

  let chatMessages: { user: string; avatar: string; title: string; text: string; time: string; isBroadcast?: boolean }[] = $state([
    { user: '茶屋小町', avatar: 'npc_town_girl', title: '糰子看板娘', text: '剛出爐的三色花見糰子配宇治新茶，巡守歸來的武士大人快來歇歇腳喔！🍡', time: '剛才' },
    { user: '柳生嚴信', avatar: 'npc_yagyu', title: '新陰流宗師', text: '哈哈哈，外頭雖有小妖胡鬧，但喝碗熱茶再拔刀，心境自能如止水般明澈！', time: '1分鐘前' },
    { user: '神無月楓', avatar: 'samurai_female', title: '出雲神子', text: '今晚清水寺與洛中街道點起了祈福紅燈籠，歡迎大家一起來賞燈祈願～🌸', time: '2分鐘前' },
    { user: '天下無雙・十兵衛', avatar: 'samurai_oni', title: '鬼切劍豪', text: '賀！剛剛在千層試煉秘境第 25 層開出太古神兵名刀！', time: '4分鐘前', isBroadcast: true }
  ]);

  let userMsgInput = $state('');

  function buyGear(item: GearItem, idx: number) {
    const cost = Math.round(item.gearScore * 12);
    if (player.gold < cost) {
      gameStore.showToast(`金幣不足！需 ${cost.toLocaleString()} 兩`, 'warning');
      return;
    }
    player.gold -= cost;
    gameStore.addGearToInventory(item);
    marketListings.splice(idx, 1);
    gameStore.showToast(`成功在行商處購得【${item.name}】！`, 'success');
  }

  function sendChatMessage() {
    if (!userMsgInput.trim()) return;
    chatMessages.unshift({
      user: player.name,
      avatar: player.cosmetics.avatar,
      title: player.cosmetics.title,
      text: userMsgInput.trim(),
      time: '剛才'
    });
    userMsgInput = '';
    gameStore.showToast(`傳聞留言已發送至洛中茶館！`, 'success');
  }
</script>

<div class="tab-market-chat">
  <!-- 1. 戰國行商拍賣所 -->
  <section class="section-card">
    <div class="section-header">
      <h2 class="section-title">🏪 戰國行商・神兵拍賣所</h2>
      <span class="gold-balance">💰 您的盤纏：<strong>{player.gold.toLocaleString()}</strong> 兩</span>
    </div>

    <div class="market-grid">
      {#each marketListings as item, idx}
        {@const qMeta = GEAR_QUALITIES[item.quality] || GEAR_QUALITIES.common}
        {@const price = Math.round(item.gearScore * 12)}
        <div class="market-card" style="border-color: {qMeta.border}; background: {qMeta.bgGlow};">
          <div class="market-card-top">
            <span class="market-icon">{item.icon}</span>
            <div>
              <div class="market-name" style="color: {qMeta.color};">{item.name}</div>
              <div class="market-sub">{item.slotName} | 戰力 +{item.gearScore}</div>
            </div>
          </div>
          <div class="market-price">標價：💰 <strong>{price.toLocaleString()}</strong> 兩</div>
          <button class="btn btn-gold btn-sm btn-block" onclick={() => buyGear(item, idx)}>
            購買神兵
          </button>
        </div>
      {/each}
    </div>
  </section>

  <!-- 2. 洛中茶館・天下傳聞 -->
  <section class="section-card">
    <h2 class="section-title">🍵 洛中茶館・天下武士傳聞留言</h2>

    <div class="chat-input-bar">
      <input
        type="text"
        placeholder="在此留下武林密聞或心得..."
        bind:value={userMsgInput}
        class="chat-input"
        onkeydown={(e) => e.key === 'Enter' && sendChatMessage()}
      />
      <button class="btn btn-gold btn-sm" onclick={sendChatMessage}>發送留言</button>
    </div>

    <div class="chat-logs-box">
      {#each chatMessages as msg}
        <div class="chat-item {msg.isBroadcast ? 'broadcast' : ''}">
          <PixelPortrait spriteId={msg.avatar} scale={1.5} label={msg.user} />
          <div class="chat-body">
            <div class="chat-meta">
              <span class="chat-user">{msg.user}</span>
              <span class="chat-title">【{msg.title}】</span>
              <span class="chat-time">{msg.time}</span>
            </div>
            <div class="chat-text">{msg.text}</div>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .tab-market-chat {
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

  .gold-balance {
    font-size: 0.88rem;
    color: #cbd5e1;
  }

  .market-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .market-card {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }

  .market-card-top {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .market-icon {
    font-size: 1.8rem;
  }

  .market-name {
    font-weight: 800;
    font-size: 0.92rem;
  }

  .market-sub {
    font-size: 0.76rem;
    color: #94a3b8;
  }

  .market-price {
    font-size: 0.88rem;
    color: #fde047;
  }

  .chat-input-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .chat-input {
    flex: 1;
    background: #0d1117;
    border: 1px solid #334155;
    padding: 8px 12px;
    border-radius: 6px;
    color: #fff;
    font-size: 0.88rem;
  }

  .chat-logs-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 280px;
    overflow-y: auto;
  }

  .chat-item {
    background: #0d1117;
    border: 1px solid #334155;
    border-radius: 6px;
    padding: 8px 12px;
    display: flex;
    gap: 10px;
  }

  .chat-item.broadcast {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.08);
  }

  .chat-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
  }

  .chat-user {
    font-weight: 800;
    color: #fff;
  }

  .chat-title {
    color: #f59e0b;
  }

  .chat-time {
    color: #64748b;
  }

  .chat-text {
    font-size: 0.85rem;
    color: #cbd5e1;
    margin-top: 2px;
  }

  @media (max-width: 768px) {
    .market-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
