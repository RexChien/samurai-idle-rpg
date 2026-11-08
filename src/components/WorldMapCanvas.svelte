<script lang="ts">
  import { onMount } from 'svelte';
  import { WorldMapEngine, MAP_ZONES } from '../engine/WorldMapEngine';
  import { gameStore } from '../engine/GameStore.svelte';
  import type { MapPOI, MapYokai } from '../types/game';

  let canvasEl: HTMLCanvasElement;
  let engine: WorldMapEngine | null = null;
  let containerEl: HTMLDivElement;

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
    gameStore.player.currentMapZone = zoneId;
    gameStore.showToast(`📍 抵達【${MAP_ZONES.find(z => z.id === zoneId)?.name}】！`, 'info');
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

  // 同步一鍵自動前往導航請求
  $effect(() => {
    const req = gameStore.navRequest;
    if (req && engine) {
      if (engine.state.currentZoneId !== req.zoneId) {
        engine.initZone(req.zoneId);
      }
      engine.navigateToQuestTarget();
    }
  });

  onMount(() => {
    if (!canvasEl || !containerEl) return;
    const w = containerEl.clientWidth || 800;
    const h = 400;
    canvasEl.width = w;
    canvasEl.height = h;

    engine = new WorldMapEngine(canvasEl, 350, 440, handleEncounter, handleInteractPOI);
    engine.syncPlayerVisuals(
      gameStore.player.cosmetics.avatar,
      gameStore.player.name,
      gameStore.player.cosmetics.title
    );
    if (gameStore.player.currentMapZone && gameStore.player.currentMapZone !== 'kyoto') {
      engine.initZone(gameStore.player.currentMapZone);
    }
    engine.start();

    const handleResize = () => {
      if (containerEl && engine) {
        const nw = containerEl.clientWidth || 800;
        engine.resize(nw, 400);
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
  <div class="map-zones-bar">
    <span class="zones-label">🗺️ 天明日本地圖：</span>
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

  <div class="canvas-container">
    <canvas bind:this={canvasEl}></canvas>
    <div class="map-overlay-tips">
      💡 3頭身像素地圖：點擊地面直線移動 ｜ 點擊町民NPC對話吃糰子 ｜ 靠近妖怪即刻拔刀
    </div>
  </div>
</div>

<style>
  .world-map-wrapper {
    background: #0d1117;
    border: 2px solid #334155;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    margin-bottom: 10px;
  }

  .map-zones-bar {
    background: #161b22;
    padding: 8px 12px;
    border-bottom: 1px solid #334155;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .zones-label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #f59e0b;
    white-space: nowrap;
  }

  .zones-list {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .canvas-container {
    position: relative;
    width: 100%;
    height: 400px;
    background: #111;
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
    background: rgba(0, 0, 0, 0.78);
    color: #cbd5e1;
    font-size: 0.76rem;
    padding: 4px 10px;
    border-radius: 6px;
    pointer-events: none;
    text-align: center;
  }
</style>
