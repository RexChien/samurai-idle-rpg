<script lang="ts">
  import { onMount } from 'svelte';
  import { WorldMapEngine, MAP_ZONES } from '../engine/WorldMapEngine';
  import { audio, BGM_TRACKS, type BgmTrackId } from '../engine/AudioEngine';
  import { gameStore } from '../engine/GameStore.svelte';
  import PixelPortrait from './PixelPortrait.svelte';
  import type { MapPOI, MapYokai } from '../types/game';

  let canvasEl: HTMLCanvasElement;
  let engine: WorldMapEngine | null = null;
  let containerEl: HTMLDivElement;

  let bgmPlaying = $state(audio.bgmEnabled);
  let currentTrack = $state<BgmTrackId>(audio.currentTrackId);
  const npcModal = $derived(gameStore.npcModal);

  function handleEncounter(yokai: MapYokai) {
    gameStore.startJrpgEncounter(yokai);
  }

  function handleInteractPOI(poi: MapPOI) {
    if (poi.type === 'chest') {
      gameStore.openMapChest(poi.id, poi.name);
      return;
    }
    gameStore.openNpcDialogue(poi);
  }

  function switchZone(zoneId: string) {
    if (!engine) return;
    engine.initZone(zoneId);
    currentTrack = audio.currentTrackId;
    gameStore.player.currentMapZone = zoneId;
    gameStore.spawnEncounterGroup(false);
    gameStore.showToast(`📍 小隊抵達【${MAP_ZONES.find(z => z.id === zoneId)?.name}】！`, 'info');
  }

  function toggleBgm() {
    bgmPlaying = audio.toggleBGM();
    currentTrack = audio.currentTrackId;
  }

  function changeTrack(trackId: BgmTrackId) {
    audio.selectTrack(trackId, false);
    bgmPlaying = true;
    audio.bgmEnabled = true;
    currentTrack = trackId;
  }

  function handleShrinePray() {
    gameStore.player.townBuffUntil = Date.now() + 300000;
    gameStore.syncPartyStats(true);
    gameStore.save();
    audio.playAchievementFanfare();
    gameStore.showToast(`⛩️ 虔誠參拜大社！全隊 HP/SP 全滿回復，並獲得【出雲武運】全屬性 +15% 祝福與進度存檔！`, 'success');
    gameStore.closeNpcDialogue();
  }

  function handleInnRest() {
    gameStore.restAtTownInn();
    gameStore.closeNpcDialogue();
  }

  function handleGoForge() {
    gameStore.closeNpcDialogue();
    gameStore.activeTab = 'gear';
  }

  function handleDojoSpar() {
    const sparName = npcModal?.name || '柳生新陰流・高徒';
    const sparAvatar = npcModal?.avatar || 'samurai_general';
    gameStore.closeNpcDialogue();
    gameStore.startJrpgEncounter({
      name: sparName,
      avatar: sparAvatar,
      hp: 260 + gameStore.player.level * 55,
      maxHp: 260 + gameStore.player.level * 55,
      atk: 18 + gameStore.player.level * 5,
      def: 11 + gameStore.player.level * 3,
      stance: 'wind',
      isBoss: false
    });
  }

  function handleOnlineCoop() {
    const allyName = npcModal?.name || '線上劍豪';
    gameStore.player.townBuffUntil = Date.now() + 300000;
    gameStore.syncPartyStats(true);
    if (gameStore.party[0]) {
      gameStore.party[0].pow = Math.min(100, gameStore.party[0].pow + 50);
    }
    audio.playLevelUpFanfare();
    gameStore.showToast(`🤝 與${allyName}結為共鬥盟友！全隊 HP/SP 全滿、戰力 +15%，且怒氣槽 +50%！`, 'success');
    gameStore.closeNpcDialogue();
  }

  function triggerQuickTownDialogue() {
    if (!engine || engine.state.pois.length === 0) return;
    const npcPoi = engine.state.pois.find(p => p.id.includes('yagyu') || p.type === 'npc') || engine.state.pois[0];
    gameStore.openNpcDialogue(npcPoi);
  }

  // 同步玩家外觀、姓名、稱號
  $effect(() => {
    const av = gameStore.player.cosmetics.avatar;
    const nm = gameStore.player.name;
    const tt = gameStore.player.cosmetics.title;
    if (engine) {
      engine.syncPlayerVisuals(av, nm, tt);
    }
  });

  // 同步地圖明雷妖怪HP與擊殺重置
  $effect(() => {
    const tick = gameStore.mapEnemyDefeatedTick;
    if (tick > 0 && engine) {
      engine.onActiveYokaiDefeated();
    }
  });

  // 同步揮刀三日月刀光與傷害跳字至地圖畫布
  $effect(() => {
    const ev = gameStore.lastSlashEvent;
    if (ev.tick > 0 && engine) {
      engine.triggerSlashVisual(ev.isCrit, `${ev.isCrit ? '💥暴擊 ' : '-'}${ev.damage.toLocaleString()}`);
    }
  });

  // 同步一鍵自動前往導航請求
  $effect(() => {
    const req = gameStore.navRequest;
    if (req && engine) {
      if (engine.state.currentZoneId !== req.zoneId) {
        engine.initZone(req.zoneId);
        currentTrack = audio.currentTrackId;
      }
      engine.navigateToQuestTarget();
    }
  });

  onMount(() => {
    if (!canvasEl || !containerEl) return;
    const w = containerEl.clientWidth || 1080;
    const h = 440;
    canvasEl.width = w;
    canvasEl.height = h;

    engine = new WorldMapEngine(canvasEl, 480, 445, handleEncounter, handleInteractPOI);
    engine.syncPlayerVisuals(
      gameStore.player.cosmetics.avatar,
      gameStore.player.name,
      gameStore.player.cosmetics.title
    );
    if (gameStore.player.currentMapZone && gameStore.player.currentMapZone !== 'kyoto') {
      engine.initZone(gameStore.player.currentMapZone);
    }
    currentTrack = audio.currentTrackId;
    engine.start();

    const handleResize = () => {
      if (containerEl && engine) {
        const nw = containerEl.clientWidth || 1080;
        engine.resize(nw, 440);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (engine) engine.stop();
    };
  });
</script>

<div class="world-map-wrapper" bind:this={containerEl}>
  <div class="map-top-bar">
    <div class="map-zones-bar">
      <span class="zones-label">🗺️ 《新武士道列傳》大型多人世界地圖：</span>
      <div class="zones-list">
        {#each MAP_ZONES as zone}
          <button
            class="btn btn-sm {gameStore.player.currentMapZone === zone.id ? 'btn-gold' : 'btn-outline'}"
            onclick={() => switchZone(zone.id)}
          >
            {zone.name}
          </button>
        {/each}
      </div>
      <button class="btn btn-sm btn-crimson" onclick={triggerQuickTownDialogue}>
        💬 開啟 TV GAME 城鎮對話框
      </button>
    </div>

    <div class="bgm-control-bar">
      <button
        class="btn btn-sm {bgmPlaying ? 'btn-gold' : 'btn-outline'}"
        onclick={toggleBgm}
        title="切換和風背景音樂 (三味線/尺八/太鼓)"
      >
        {bgmPlaying ? '🎵 和風BGM：演奏中' : '🔇 和風BGM：已靜音'}
      </button>
      <div class="bgm-tracks">
        {#each BGM_TRACKS as t}
          <button
            class="btn-track {currentTrack === t.id && bgmPlaying ? 'active' : ''}"
            onclick={() => changeTrack(t.id)}
            title={t.subtitle}
          >
            {t.name}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="canvas-container">
    <canvas bind:this={canvasEl}></canvas>

    <!-- SFC FF6 / TV GAME 巨型皇家藍金屬浮雕對話視窗 -->
    {#if npcModal && npcModal.open}
      <div class="tvgame-giant-dialogue-window">
        <div class="ff6-corner tl"></div>
        <div class="ff6-corner tr"></div>
        <div class="ff6-corner bl"></div>
        <div class="ff6-corner br"></div>

        <div class="tvgame-portrait-frame">
          <PixelPortrait spriteId={npcModal.avatar} scale={5} mode="bust" label={npcModal.name} />
        </div>

        <div class="tvgame-dialogue-main">
          <div class="tvgame-speaker-header">
            <span class="speaker-badge">【{npcModal.name}】</span>
            <span class="tvgame-window-tag">SFC TV-GAME DIALOGUE</span>
          </div>

          <p class="tvgame-dialogue-text">
            {npcModal.dialogue}
            <span class="ff6-blinking-cursor">▼</span>
          </p>

          <div class="tvgame-choice-list">
            {#if npcModal.poiType === 'shrine'}
              <button class="ff6-choice-btn primary" onclick={handleShrinePray}>
                <span class="ff6-hand">☞</span> ⛩️ 虔誠參拜大社（全隊 HP/SP 全滿回復 ＋【出雲武運】全屬性 +15% ＋ 存檔）
              </button>
            {:else if npcModal.poiId.includes('komachi') || npcModal.poiId.includes('guide')}
              <button class="ff6-choice-btn primary" onclick={handleInnRest}>
                <span class="ff6-hand">☞</span> 🍵 宿屋休息吃糰子（20兩：全隊 HP/SP 全滿回復）
              </button>
              <button class="ff6-choice-btn" onclick={() => gameStore.buyConsumable('dango')}>
                <span class="ff6-hand">☞</span> 🍡 購買花見三色糰子（30兩）
              </button>
              <button class="ff6-choice-btn" onclick={() => gameStore.buyConsumable('matcha')}>
                <span class="ff6-hand">☞</span> 🍵 購買宇治特濃抹茶（40兩）
              </button>
              <button class="ff6-choice-btn" onclick={() => gameStore.buyConsumable('sake')}>
                <span class="ff6-hand">☞</span> 🍶 購買鬼殺般若湯（80兩）
              </button>
            {:else if npcModal.poiType === 'town'}
              <button class="ff6-choice-btn primary" onclick={handleGoForge}>
                <span class="ff6-hand">☞</span> 🔨 進入國友鍛冶工坊（鍛造名刀與強化武具）
              </button>
            {:else if npcModal.poiId.startsWith('online_')}
              <button class="ff6-choice-btn primary" onclick={handleOnlineCoop}>
                <span class="ff6-hand">☞</span> 🤝 邀請結伴共鬥（全隊 HP/SP 全滿、戰力 +15%、怒氣 POW +50%）
              </button>
              <button class="ff6-choice-btn" onclick={handleDojoSpar}>
                <span class="ff6-hand">☞</span> ⚔️ 與該名線上劍豪進行武士道切磋對決
              </button>
            {:else}
              <button class="ff6-choice-btn primary" onclick={handleDojoSpar}>
                <span class="ff6-hand">☞</span> ⚔️ 與道場高徒進行指令比武切磋
              </button>
              <button class="ff6-choice-btn" onclick={() => { gameStore.closeNpcDialogue(); gameStore.activeTab = 'talents'; }}>
                <span class="ff6-hand">☞</span> ☯️ 研習《五輪書》劍道奧義
              </button>
            {/if}
            <button class="ff6-choice-btn cancel" onclick={() => gameStore.closeNpcDialogue()}>
              <span class="ff6-hand">☞</span> 收刀告辭（關閉對話視窗）
            </button>
          </div>
        </div>
      </div>
    {:else}
      <div class="map-overlay-tips">
        🏮 《大型多人武士道列傳》世界地圖：點擊地面或 WASD 移動 ｜ 點擊【線上武士玩家／茶屋／道場／大社】開啟巨型 TV GAME 對話框 ｜ 接觸妖魔進入 FF6 橫向戰鬥
      </div>
    {/if}
  </div>
</div>

<style>
  .world-map-wrapper {
    background: #060b19;
    border: 3px solid #cbd5e1;
    box-shadow: inset 0 0 0 2px #d97706, 0 10px 32px rgba(0, 0, 0, 0.75);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
  }

  .map-top-bar {
    background: linear-gradient(180deg, #10235c 0%, #071238 100%);
    border-bottom: 3px solid #cbd5e1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 14px;
  }

  .map-zones-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .zones-label {
    font-size: 0.92rem;
    font-weight: 900;
    color: #fde047;
    text-shadow: 1px 1px 0 #000;
    white-space: nowrap;
  }

  .zones-list {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    flex: 1;
  }

  .bgm-control-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding-top: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
  }

  .bgm-tracks {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .btn-track {
    background: rgba(8, 18, 48, 0.85);
    border: 1px solid #64748b;
    color: #e2e8f0;
    font-size: 0.78rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-track:hover {
    border-color: #fde047;
    color: #fff;
  }

  .btn-track.active {
    background: linear-gradient(180deg, #b45309, #78350f);
    border-color: #fde047;
    color: #fef08a;
    box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
  }

  .canvas-container {
    position: relative;
    width: 100%;
    height: 440px;
    background: #09131c;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }

  /* SFC《Final Fantasy VI》風格 TV GAME 巨型皇家藍金屬浮雕對話視窗 */
  .tvgame-giant-dialogue-window {
    position: absolute;
    bottom: 12px;
    left: 16px;
    right: 16px;
    min-height: 205px;
    background: linear-gradient(180deg, #14328c 0%, #091954 55%, #040a26 100%);
    border: 4px solid #e2e8f0;
    box-shadow:
      inset 0 0 0 3px #1d4ed8,
      inset 0 0 0 5px #fbbf24,
      0 14px 44px rgba(0, 0, 0, 0.92);
    border-radius: 12px;
    padding: 18px 24px;
    display: flex;
    align-items: center;
    gap: 24px;
    z-index: 30;
  }

  .ff6-corner {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fbbf24;
    border: 2px solid #ffffff;
    border-radius: 2px;
    z-index: 2;
  }
  .ff6-corner.tl { top: 4px; left: 4px; }
  .ff6-corner.tr { top: 4px; right: 4px; }
  .ff6-corner.bl { bottom: 4px; left: 4px; }
  .ff6-corner.br { bottom: 4px; right: 4px; }

  .tvgame-portrait-frame {
    width: 146px;
    height: 146px;
    background: radial-gradient(circle, #1e3a8a 0%, #050814 100%);
    border: 3px solid #fbbf24;
    box-shadow: inset 0 0 0 2px #e2e8f0, 0 6px 18px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
  }

  .tvgame-dialogue-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .tvgame-speaker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgba(251, 191, 36, 0.45);
    padding-bottom: 4px;
  }

  .speaker-badge {
    font-size: 1.35rem;
    font-weight: 900;
    color: #fde047;
    text-shadow: 2px 2px 0 #000000;
    letter-spacing: 0.5px;
  }

  .tvgame-window-tag {
    font-size: 0.75rem;
    font-weight: 900;
    color: #93c5fd;
    letter-spacing: 1.5px;
  }

  .tvgame-dialogue-text {
    font-size: 1.28rem;
    font-weight: 800;
    color: #ffffff;
    text-shadow: 2px 2px 0 #000000;
    line-height: 1.6;
    margin: 2px 0;
  }

  .ff6-blinking-cursor {
    display: inline-block;
    margin-left: 8px;
    color: #fde047;
    animation: ff6Blink 0.75s infinite alternate;
  }

  @keyframes ff6Blink {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0.2; transform: translateY(4px); }
  }

  .tvgame-choice-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;
  }

  .ff6-choice-btn {
    background: linear-gradient(180deg, rgba(30, 58, 138, 0.92), rgba(15, 23, 42, 0.96));
    border: 2px solid #cbd5e1;
    border-radius: 8px;
    padding: 8px 16px;
    color: #f8fafc;
    font-size: 1.02rem;
    font-weight: 900;
    text-shadow: 1px 1px 0 #000;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.14s;
  }

  .ff6-choice-btn.primary {
    border-color: #fde047;
    background: linear-gradient(180deg, #1d4ed8, #0f172a);
    color: #fef08a;
  }

  .ff6-choice-btn:hover {
    border-color: #fde047;
    background: linear-gradient(180deg, #2563eb, #1e3a8a);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 14px rgba(250, 204, 21, 0.4);
  }

  .ff6-hand {
    color: #fde047;
    font-size: 1.15rem;
    transition: transform 0.15s;
  }

  .ff6-choice-btn:hover .ff6-hand {
    transform: translateX(4px);
  }

  .map-overlay-tips {
    position: absolute;
    bottom: 8px;
    left: 14px;
    right: 14px;
    background: linear-gradient(180deg, rgba(16, 38, 102, 0.92), rgba(7, 16, 48, 0.95));
    border: 2px solid #cbd5e1;
    box-shadow: inset 0 0 0 1px #fbbf24;
    color: #fef3c7;
    font-size: 0.85rem;
    font-weight: 800;
    text-shadow: 1px 1px 0 #000;
    padding: 6px 14px;
    border-radius: 8px;
    pointer-events: none;
    text-align: center;
  }
</style>
