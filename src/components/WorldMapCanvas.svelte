<script lang="ts">
  import { onMount } from 'svelte';
  import { WorldMapEngine, MAP_ZONES } from '../engine/WorldMapEngine';
  import { audio, BGM_TRACKS, type BgmTrackId } from '../engine/AudioEngine';
  import { gameStore } from '../engine/GameStore.svelte';
  import type { MapPOI, MapYokai } from '../types/game';

  let canvasEl: HTMLCanvasElement;
  let engine: WorldMapEngine | null = null;
  let containerEl: HTMLDivElement;

  let bgmPlaying = $state(audio.bgmEnabled);
  let currentTrack = $state<BgmTrackId>(audio.currentTrackId);

  function handleEncounter(yokai: MapYokai) {
    gameStore.currentEnemy = {
      id: yokai.id,
      name: yokai.name,
      avatar: yokai.avatar,
      hp: yokai.hp,
      maxHp: yokai.maxHp,
      atk: yokai.atk,
      def: yokai.def,
      isBoss: !!yokai.isBoss
    };
    gameStore.executeSlash(false);
  }

  function handleInteractPOI(poi: MapPOI) {
    if (poi.type === 'shrine') {
      gameStore.player.townBuffUntil = Date.now() + 300000;
      gameStore.showToast(`⛩️ 參拜【${poi.name}】！獲得出雲武運祝福 (+15% 全屬性戰力，持續5分鐘)！`, 'success');
    } else if (poi.type === 'chest') {
      gameStore.openMapChest(poi.id, poi.name);
    } else if (poi.type === 'town') {
      gameStore.showToast(`🔨 進入【${poi.name}】！可打造與強化暗黑神兵`, 'info');
      gameStore.activeTab = 'gear';
    } else if (poi.type === 'npc') {
      gameStore.showToast(`💬 【${poi.name}】：${poi.desc}`, 'info');
    }
  }

  function switchZone(zoneId: string) {
    if (!engine) return;
    engine.initZone(zoneId);
    currentTrack = audio.currentTrackId;
    gameStore.player.currentMapZone = zoneId;
    gameStore.showToast(`📍 抵達【${MAP_ZONES.find(z => z.id === zoneId)?.name}】！`, 'info');
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
        const nw = containerEl.clientWidth || 860;
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
      <span class="zones-label">🗺️ 武士道全彩大地圖：</span>
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
    <div class="map-overlay-tips">
      🏮 《武士道列傳》全彩像素世界：點擊地面或按 WASD 漫步櫻花城下町與朱紅太鼓橋 ｜ 點擊茶屋／道場／大社互動 ｜ 靠近妖怪拔刀斬擊
    </div>
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
    margin-bottom: 10px;
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
    height: 440px;
    background: #1a2e1a;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    image-rendering: pixelated;
  }

  .map-overlay-tips {
    position: absolute;
    bottom: 8px;
    left: 12px;
    right: 12px;
    background: rgba(15, 23, 42, 0.86);
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
