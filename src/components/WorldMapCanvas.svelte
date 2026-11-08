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
    gameStore.closeNpcDialogue();
    gameStore.startJrpgEncounter({
      name: '柳生新陰流・高徒',
      avatar: 'samurai_general',
      hp: 220 + gameStore.player.level * 50,
      maxHp: 220 + gameStore.player.level * 50,
      atk: 16 + gameStore.player.level * 5,
      def: 10 + gameStore.player.level * 3,
      stance: 'wind',
      isBoss: false
    });
  }

  // 同步玩家 3頭身像素外觀、姓名、稱號
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
    const w = containerEl.clientWidth || 860;
    const h = 410;
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
        const nw = containerEl.clientWidth || 860;
        engine.resize(nw, 410);
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
      <span class="zones-label">🗺️ 《新武士道列傳》全彩世界地圖：</span>
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

    <!-- 傳統 JRPG 皇家藍底金框 NPC 對話視窗 -->
    {#if npcModal && npcModal.open}
      <div class="jrpg-dialogue-box">
        <div class="jrpg-dialogue-portrait">
          <PixelPortrait spriteId={npcModal.avatar} scale={3} label={npcModal.name} />
        </div>
        <div class="jrpg-dialogue-body">
          <div class="jrpg-speaker-name">【{npcModal.name}】</div>
          <p class="jrpg-dialogue-text">{npcModal.dialogue}</p>
          <div class="jrpg-dialogue-actions">
            {#if npcModal.poiType === 'shrine'}
              <button class="btn btn-gold btn-sm" onclick={handleShrinePray}>⛩️ 虔誠參拜（全隊全回復＋出雲武運＋存檔）</button>
            {:else if npcModal.poiId.includes('komachi') || npcModal.poiId.includes('guide')}
              <button class="btn btn-gold btn-sm" onclick={handleInnRest}>🍵 宿屋休息吃糰子 (20兩：全隊 HP/SP 全滿)</button>
              <button class="btn btn-outline btn-sm" onclick={() => gameStore.buyConsumable('dango')}>🍡 買花見糰子 (30兩)</button>
              <button class="btn btn-outline btn-sm" onclick={() => gameStore.buyConsumable('matcha')}>🍵 買宇治抹茶 (40兩)</button>
              <button class="btn btn-outline btn-sm" onclick={() => gameStore.buyConsumable('sake')}>🍶 買般若湯 (80兩)</button>
            {:else if npcModal.poiType === 'town'}
              <button class="btn btn-gold btn-sm" onclick={handleGoForge}>🔨 進入國友鍛冶屋（打造與強化名刀）</button>
            {:else if npcModal.poiId.includes('yagyu')}
              <button class="btn btn-gold btn-sm" onclick={handleDojoSpar}>⚔️ 與道場門生進行指令切磋</button>
              <button class="btn btn-outline btn-sm" onclick={() => { gameStore.closeNpcDialogue(); gameStore.activeTab = 'talents'; }}>☯️ 研習五輪劍法</button>
            {/if}
            <button class="btn btn-outline btn-sm" onclick={() => gameStore.closeNpcDialogue()}>收刀告辭</button>
          </div>
        </div>
      </div>
    {:else}
      <div class="map-overlay-tips">
        🏮 三人小隊同行（主角・神無月楓・影縫疾風）：點擊地面或按 WASD 探索全彩地圖 ｜ 點擊茶屋宿屋／道場／大社對話 ｜ 接觸妖魔展開回合指令戰
      </div>
    {/if}
  </div>
</div>

<style>
  .world-map-wrapper {
    background: #0d1117;
    border: 2px solid #d97706;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.55);
  }

  .map-top-bar {
    background: linear-gradient(180deg, #1e2430, #141821);
    border-bottom: 2px solid #b45309;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px 12px;
  }

  .map-zones-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .zones-label {
    font-size: 0.85rem;
    font-weight: 800;
    color: #fbbf24;
    white-space: nowrap;
  }

  .zones-list {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .bgm-control-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding-top: 4px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .bgm-tracks {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .btn-track {
    background: rgba(15, 23, 42, 0.75);
    border: 1px solid #475569;
    color: #cbd5e1;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 3px 9px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-track:hover {
    border-color: #fbbf24;
    color: #fff;
  }

  .btn-track.active {
    background: rgba(245, 158, 11, 0.22);
    border-color: #fbbf24;
    color: #fde047;
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.35);
  }

  .canvas-container {
    position: relative;
    width: 100%;
    height: 410px;
    background: #1a2e1a;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    image-rendering: pixelated;
  }

  /* 傳統 90 年代 JRPG 皇家深藍金框對話視窗 */
  .jrpg-dialogue-box {
    position: absolute;
    bottom: 10px;
    left: 14px;
    right: 14px;
    background: linear-gradient(180deg, rgba(15, 32, 75, 0.96), rgba(8, 18, 46, 0.98));
    border: 3px solid #fbbf24;
    box-shadow: inset 0 0 0 2px #1e3a8a, 0 8px 28px rgba(0, 0, 0, 0.85);
    border-radius: 10px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    z-index: 20;
  }

  .jrpg-dialogue-portrait {
    width: 68px;
    height: 80px;
    background: #090d16;
    border: 2px solid #f59e0b;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .jrpg-dialogue-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .jrpg-speaker-name {
    font-size: 0.98rem;
    font-weight: 900;
    color: #fde047;
    text-shadow: 1px 1px 0 #000;
  }

  .jrpg-dialogue-text {
    font-size: 0.9rem;
    color: #f8fafc;
    line-height: 1.5;
  }

  .jrpg-dialogue-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 4px;
  }

  .map-overlay-tips {
    position: absolute;
    bottom: 8px;
    left: 12px;
    right: 12px;
    background: rgba(15, 23, 42, 0.88);
    border: 1px solid rgba(245, 158, 11, 0.45);
    color: #fef3c7;
    font-size: 0.76rem;
    font-weight: 600;
    padding: 5px 12px;
    border-radius: 6px;
    pointer-events: none;
    text-align: center;
  }
</style>
