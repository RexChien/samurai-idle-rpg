<script lang="ts">
  import { gameStore, JRPG_PARTY_SKILLS } from '../engine/GameStore.svelte';
  import { FIVE_RINGS_STANCES } from '../data/stancesArts';
  import WorldMapCanvas from './WorldMapCanvas.svelte';
  import PixelPortrait from './PixelPortrait.svelte';

  const player = $derived(gameStore.player);
  const party = $derived(gameStore.party);
  const battle = $derived(gameStore.jrpgBattle);
  const curStance = $derived(FIVE_RINGS_STANCES[player.stance] || FIVE_RINGS_STANCES.earth);
  const consumables = $derived(gameStore.getConsumableList());

  let activeSubMenu = $state<'log' | 'skills' | 'items' | 'stances'>('log');

  function handleAttack() {
    activeSubMenu = 'log';
    gameStore.cmdAttack();
  }

  function handleCastSkill(skillId: string) {
    activeSubMenu = 'log';
    gameStore.cmdSkill(skillId);
  }

  function handleOverdrive() {
    activeSubMenu = 'log';
    gameStore.cmdBushidoOverdrive();
  }

  function handleDefend() {
    activeSubMenu = 'log';
    gameStore.cmdDefend();
  }

  function handleUseItem(itemId: 'dango' | 'matcha' | 'sake' | 'elixir') {
    activeSubMenu = 'log';
    gameStore.cmdUseItem(itemId);
  }

  function handleAllOut() {
    activeSubMenu = 'log';
    gameStore.cmdAllOutAttack();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === 'Space' && !e.repeat && gameStore.activeTab === 'battle') {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      handleAllOut();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="tab-world-battle">
  <!-- 上半部：《新武士道列傳》全彩 2D 開放世界地圖（含三人小隊跟隨與 JRPG 城鎮對話框） -->
  <WorldMapCanvas />

  <!-- 下半部：《新武士道列傳》傳統 JRPG 橫向回合指令制戰場 -->
  <div class="jrpg-battle-container">
    <!-- 戰場頂部狀態與首領遭遇列 -->
    <div class="jrpg-stage-header">
      <div class="stage-title-group">
        <span class="round-pill">⚔️ 第 {battle.round} 回合</span>
        <span class="stance-pill" title={curStance.counterDesc}>
          {curStance.icon} 當前架勢：{curStance.name}
        </span>
      </div>
      <div class="stage-quick-actions">
        <button class="btn btn-outline btn-sm" onclick={() => (activeSubMenu = activeSubMenu === 'stances' ? 'log' : 'stances')}>
          ☯️ 切換五輪架勢
        </button>
        <button class="btn btn-outline btn-sm" onclick={() => gameStore.restAtTownInn()}>
          🍵 茶屋宿屋全回復 (20兩)
        </button>
        <button class="btn btn-crimson btn-sm" onclick={() => gameStore.spawnEncounterGroup(true)}>
          👑 挑戰區域首領
        </button>
      </div>
    </div>

    <!-- 橫向視覺戰鬥舞台：左側敵軍陣列 vs 右側我方三人小隊 -->
    <div class="jrpg-battle-stage">
      {#if battle.skillBanner}
        <div class="jrpg-skill-cutin">
          {battle.skillBanner}
        </div>
      {/if}

      <!-- 左側：敵方妖魔陣列 (可點擊切換鎖定目標) -->
      <div class="enemy-formation">
        {#each battle.enemies as en, idx}
          {@const isSelected = battle.selectedTargetIdx === idx && en.hp > 0}
          {@const stInfo = FIVE_RINGS_STANCES[en.stance] || FIVE_RINGS_STANCES.fire}
          <button
            type="button"
            class="enemy-unit-card {isSelected ? 'selected-target' : ''} {en.hp <= 0 ? 'defeated' : ''} {en.isBoss ? 'boss-unit' : ''}"
            onclick={() => { if (en.hp > 0) gameStore.jrpgBattle.selectedTargetIdx = idx; }}
          >
            {#if isSelected}
              <div class="target-cursor">🎯 鎖定目標</div>
            {/if}
            <div class="enemy-sprite-box">
              <PixelPortrait spriteId={en.avatar} scale={en.isBoss ? 3 : 2} label={en.name} />
            </div>
            <div class="enemy-unit-info">
              <div class="enemy-unit-name">
                <span class="st-mini">{stInfo.icon}</span>
                Lv.{en.level} {en.name}
              </div>
              <div class="unit-hp-bar">
                <div class="unit-hp-fill" style="width: {Math.max(0, Math.min(100, (en.hp / en.maxHp) * 100))}%;"></div>
              </div>
              <div class="unit-hp-nums">
                {en.hp > 0 ? `${en.hp.toLocaleString()} / ${en.maxHp.toLocaleString()} HP` : '💀 已擊破'}
              </div>
            </div>
          </button>
        {/each}
      </div>

      <div class="vs-divider">⚔️</div>

      <!-- 右側：我方《新武士道列傳》三人同行小隊 -->
      <div class="party-formation">
        {#each party as member}
          {@const isActing = battle.actingUnitId === member.id}
          <div class="party-unit-card {isActing ? 'acting-lunge' : ''}">
            <div class="party-sprite-box">
              <PixelPortrait spriteId={member.avatar} scale={2} label={member.name} />
            </div>
            <div class="party-bars">
              <div class="party-name-line">
                <span class="p-name">{member.name}</span>
                <span class="p-role">【{member.roleTitle}】</span>
              </div>
              <!-- HP 生命條 -->
              <div class="bar-row">
                <span class="bar-lbl hp-lbl">HP</span>
                <div class="bar-track">
                  <div class="bar-fill hp-fill" style="width: {Math.min(100, (member.hp / member.maxHp) * 100)}%;"></div>
                </div>
                <span class="bar-val">{member.hp}/{member.maxHp}</span>
              </div>
              <!-- SP 氣力條 -->
              <div class="bar-row">
                <span class="bar-lbl sp-lbl">SP</span>
                <div class="bar-track">
                  <div class="bar-fill sp-fill" style="width: {Math.min(100, (member.sp / member.maxSp) * 100)}%;"></div>
                </div>
                <span class="bar-val">{member.sp}/{member.maxSp}</span>
              </div>
              <!-- 主角專屬：武士道列傳招牌【怒氣槽 POW】 -->
              {#if member.id === 'leader'}
                <div class="bar-row">
                  <span class="bar-lbl pow-lbl">怒</span>
                  <div class="bar-track pow-track">
                    <div class="bar-fill pow-fill {member.pow >= 100 ? 'pow-max' : ''}" style="width: {Math.min(100, member.pow)}%;"></div>
                  </div>
                  <span class="bar-val pow-val">{member.pow}%</span>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- 底部：傳統 90 年代 JRPG 皇家藍底金框指令面板 + 戰況卷軸 -->
    <div class="jrpg-command-deck">
      <!-- 左側：六大武士道戰鬥指令 -->
      <div class="jrpg-commands-box">
        <div class="cmd-header">🕹️ 武士道戰鬥指令</div>
        <div class="cmd-grid">
          <button class="cmd-btn cmd-attack" onclick={handleAttack}>
            ⚔️ 拔刀連斬 <span class="cmd-sub">普攻協同 (+SP/怒氣)</span>
          </button>

          <button
            class="cmd-btn {activeSubMenu === 'skills' ? 'cmd-selected' : ''}"
            onclick={() => (activeSubMenu = activeSubMenu === 'skills' ? 'log' : 'skills')}
          >
            📜 劍技・秘術 <span class="cmd-sub">二天劍技 / 巫女祈禱 / 忍法</span>
          </button>

          <button
            class="cmd-btn cmd-overdrive {(party[0]?.pow || 0) >= 100 ? 'pow-ready' : 'pow-charging'}"
            onclick={handleOverdrive}
          >
            🔥 天覇絕刀 <span class="cmd-sub">怒氣超奧義 ({party[0]?.pow || 0}%/100%)</span>
          </button>

          <button class="cmd-btn" onclick={handleDefend}>
            🛡️ 納刀見切 <span class="cmd-sub">減傷 65% 並大回 SP</span>
          </button>

          <button
            class="cmd-btn {activeSubMenu === 'items' ? 'cmd-selected' : ''}"
            onclick={() => (activeSubMenu = activeSubMenu === 'items' ? 'log' : 'items')}
          >
            🍡 行囊道具 <span class="cmd-sub">糰子 / 抹茶 / 般若湯</span>
          </button>

          <button class="cmd-btn cmd-allout" onclick={handleAllOut}>
            ⚡ 全員總攻 <span class="cmd-sub">智慧委任作戰 (空白鍵)</span>
          </button>
        </div>
      </div>

      <!-- 右側：子選單（劍技／道具／五輪架勢）或 JRPG 回合戰況實況卷軸 -->
      <div class="jrpg-subpanel">
        {#if activeSubMenu === 'skills'}
          <div class="subpanel-header">
            <span>📜 選擇要施展的【劍技・巫女祈禱・伊賀忍法】</span>
            <button class="btn btn-outline btn-sm" onclick={() => (activeSubMenu = 'log')}>返回戰況</button>
          </div>
          <div class="skills-grid">
            {#each JRPG_PARTY_SKILLS as sk}
              <button class="skill-choice-card" onclick={() => handleCastSkill(sk.id)}>
                <div class="sk-top">
                  <span class="sk-title">{sk.icon} {sk.name}</span>
                  <span class="sk-cost">{sk.spCost} SP</span>
                </div>
                <div class="sk-caster">施展者：【{sk.casterName}】</div>
                <div class="sk-desc">{sk.desc}</div>
              </button>
            {/each}
          </div>
        {:else if activeSubMenu === 'items'}
          <div class="subpanel-header">
            <span>🍡 選擇要使用的【江戶行囊道具】</span>
            <button class="btn btn-outline btn-sm" onclick={() => (activeSubMenu = 'log')}>返回戰況</button>
          </div>
          <div class="items-grid">
            {#each consumables as item}
              <div class="item-choice-card">
                <div class="item-info">
                  <div class="item-name">{item.icon} {item.name} <span class="item-cnt">x{item.count}</span></div>
                  <div class="item-desc">{item.desc}</div>
                </div>
                <div class="item-btns">
                  <button class="btn btn-gold btn-sm" disabled={item.count <= 0} onclick={() => handleUseItem(item.id)}>
                    使用
                  </button>
                  <button class="btn btn-outline btn-sm" onclick={() => gameStore.buyConsumable(item.id)}>
                    購買 ({item.price}兩)
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {:else if activeSubMenu === 'stances'}
          <div class="subpanel-header">
            <span>☯️ 切換宮本武藏《五輪書》架勢（相剋傷害 +35%）</span>
            <button class="btn btn-outline btn-sm" onclick={() => (activeSubMenu = 'log')}>返回戰況</button>
          </div>
          <div class="stances-grid">
            {#each Object.values(FIVE_RINGS_STANCES) as st}
              <button
                class="skill-choice-card {player.stance === st.id ? 'active-stance' : ''}"
                onclick={() => { gameStore.selectStance(st.id); activeSubMenu = 'log'; }}
              >
                <div class="sk-top">
                  <span class="sk-title">{st.icon} {st.name}</span>
                  <span class="sk-cost">{st.counterDesc}</span>
                </div>
                <div class="sk-desc">{st.desc}</div>
              </button>
            {/each}
          </div>
        {:else}
          <div class="subpanel-header">
            <span>📜 《新武士道列傳》回合戰況卷軸</span>
            <span class="log-hint">💡 點擊左側敵人可指定集火目標，或按空白鍵執行「全員總攻」</span>
          </div>
          <div class="battle-log-list">
            {#each battle.logs as line, idx}
              <div class="log-entry {idx === 0 ? 'latest-log' : ''}">
                {line}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .tab-world-battle {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* 傳統 90 年代 JRPG 皇家深藍金框戰鬥容器 */
  .jrpg-battle-container {
    background: linear-gradient(180deg, #0d1527, #090d18);
    border: 2px solid #d97706;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.65);
  }

  .jrpg-stage-header {
    background: rgba(15, 23, 42, 0.95);
    border-bottom: 1px solid #334155;
    padding: 8px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .stage-title-group {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .round-pill {
    background: #b45309;
    color: #fff;
    font-weight: 900;
    font-size: 0.82rem;
    padding: 3px 10px;
    border-radius: 6px;
  }

  .stance-pill {
    color: #fde047;
    font-weight: 800;
    font-size: 0.88rem;
  }

  .stage-quick-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .jrpg-battle-stage {
    position: relative;
    padding: 16px;
    background:
      radial-gradient(circle at 25% 40%, rgba(220, 38, 38, 0.14), transparent 55%),
      radial-gradient(circle at 75% 40%, rgba(56, 189, 248, 0.14), transparent 55%),
      linear-gradient(180deg, #131c31 0%, #1c2536 65%, #172026 100%);
    display: grid;
    grid-template-columns: 1.15fr auto 1.15fr;
    align-items: center;
    gap: 14px;
    border-bottom: 2px solid #b45309;
  }

  .jrpg-skill-cutin {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, rgba(185, 28, 28, 0.95), rgba(217, 119, 6, 0.95));
    border: 2px solid #fef08a;
    color: #fff;
    font-weight: 900;
    font-size: 1.05rem;
    padding: 6px 24px;
    border-radius: 999px;
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.7);
    z-index: 15;
    white-space: nowrap;
  }

  .enemy-formation {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .enemy-unit-card {
    background: rgba(15, 23, 42, 0.85);
    border: 1px solid #475569;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    cursor: pointer;
    text-align: left;
    position: relative;
    transition: all 0.15s;
  }

  .enemy-unit-card.selected-target {
    border: 2px solid #ef4444;
    background: rgba(127, 29, 29, 0.35);
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.35);
  }

  .enemy-unit-card.boss-unit {
    border-color: #f59e0b;
  }

  .enemy-unit-card.defeated {
    opacity: 0.4;
    filter: grayscale(0.9);
  }

  .target-cursor {
    position: absolute;
    top: 4px;
    right: 8px;
    font-size: 0.7rem;
    font-weight: 900;
    color: #fca5a5;
  }

  .enemy-sprite-box,
  .party-sprite-box {
    width: 48px;
    height: 54px;
    background: #090d16;
    border: 1px solid #475569;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .enemy-unit-info {
    flex: 1;
  }

  .enemy-unit-name {
    font-size: 0.9rem;
    font-weight: 800;
    color: #fef08a;
    margin-bottom: 4px;
  }

  .unit-hp-bar {
    height: 9px;
    background: #1e293b;
    border-radius: 5px;
    overflow: hidden;
  }

  .unit-hp-fill {
    height: 100%;
    background: linear-gradient(90deg, #dc2626, #f87171);
    transition: width 0.2s;
  }

  .unit-hp-nums {
    font-size: 0.72rem;
    color: #cbd5e1;
    margin-top: 2px;
  }

  .vs-divider {
    font-size: 1.6rem;
    opacity: 0.65;
  }

  .party-formation {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .party-unit-card {
    background: rgba(15, 32, 75, 0.75);
    border: 1px solid #3b82f6;
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: transform 0.2s;
  }

  .party-unit-card.acting-lunge {
    transform: translateX(-16px);
    border-color: #fde047;
    box-shadow: 0 0 14px rgba(250, 204, 21, 0.5);
  }

  .party-bars {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .party-name-line {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .p-name {
    font-size: 0.9rem;
    font-weight: 900;
    color: #fff;
  }

  .p-role {
    font-size: 0.75rem;
    color: #93c5fd;
    font-weight: 700;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .bar-lbl {
    font-size: 0.7rem;
    font-weight: 900;
    width: 22px;
  }

  .hp-lbl { color: #4ade80; }
  .sp-lbl { color: #38bdf8; }
  .pow-lbl { color: #fbbf24; }

  .bar-track {
    flex: 1;
    height: 7px;
    background: #0f172a;
    border-radius: 4px;
    overflow: hidden;
  }

  .bar-fill {
    height: 100%;
    transition: width 0.2s;
  }

  .hp-fill { background: linear-gradient(90deg, #16a34a, #4ade80); }
  .sp-fill { background: linear-gradient(90deg, #0284c7, #38bdf8); }
  .pow-fill { background: linear-gradient(90deg, #d97706, #fde047); }
  .pow-fill.pow-max { background: linear-gradient(90deg, #dc2626, #fde047); }

  .bar-val {
    font-size: 0.7rem;
    color: #cbd5e1;
    min-width: 58px;
    text-align: right;
  }

  .pow-val {
    color: #fde047;
    font-weight: 800;
  }

  /* 底部皇家藍底金框指令台 */
  .jrpg-command-deck {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 12px;
    padding: 14px;
    background: linear-gradient(180deg, #0c1938, #071026);
  }

  .jrpg-commands-box {
    background: rgba(15, 32, 75, 0.9);
    border: 2px solid #fbbf24;
    border-radius: 10px;
    padding: 10px;
  }

  .cmd-header {
    font-size: 0.85rem;
    font-weight: 900;
    color: #fde047;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid rgba(251, 191, 36, 0.35);
  }

  .cmd-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .cmd-btn {
    background: linear-gradient(180deg, #1e3a8a, #172554);
    border: 1.5px solid #60a5fa;
    border-radius: 8px;
    padding: 9px 10px;
    color: #fff;
    font-size: 0.92rem;
    font-weight: 900;
    cursor: pointer;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 2px;
    transition: all 0.15s;
  }

  .cmd-btn:hover {
    border-color: #fde047;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(250, 204, 21, 0.25);
  }

  .cmd-btn.cmd-attack {
    background: linear-gradient(135deg, #991b1b, #dc2626);
    border-color: #fca5a5;
  }

  .cmd-btn.cmd-overdrive.pow-ready {
    background: linear-gradient(135deg, #b45309, #ef4444);
    border-color: #fef08a;
    box-shadow: 0 0 15px rgba(250, 204, 21, 0.6);
  }

  .cmd-btn.cmd-overdrive.pow-charging {
    opacity: 0.72;
  }

  .cmd-btn.cmd-allout {
    background: linear-gradient(135deg, #065f46, #059669);
    border-color: #6ee7b7;
  }

  .cmd-sub {
    font-size: 0.7rem;
    font-weight: 600;
    color: #cbd5e1;
  }

  .jrpg-subpanel {
    background: rgba(10, 20, 48, 0.92);
    border: 2px solid #fbbf24;
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .subpanel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 900;
    color: #fde047;
    padding-bottom: 6px;
    border-bottom: 1px solid rgba(251, 191, 36, 0.3);
  }

  .log-hint {
    font-size: 0.74rem;
    font-weight: 600;
    color: #93c5fd;
  }

  .skills-grid,
  .items-grid,
  .stances-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    max-height: 210px;
    overflow-y: auto;
  }

  .skill-choice-card,
  .item-choice-card {
    background: #111c38;
    border: 1px solid #3b82f6;
    border-radius: 8px;
    padding: 8px 10px;
    color: #fff;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .skill-choice-card:hover {
    border-color: #fde047;
    background: #1e3a8a;
  }

  .sk-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sk-title,
  .item-name {
    font-size: 0.86rem;
    font-weight: 900;
    color: #fde047;
  }

  .sk-cost {
    font-size: 0.75rem;
    font-weight: 800;
    color: #38bdf8;
  }

  .sk-caster {
    font-size: 0.72rem;
    color: #93c5fd;
  }

  .sk-desc,
  .item-desc {
    font-size: 0.74rem;
    color: #cbd5e1;
    line-height: 1.35;
  }

  .item-choice-card {
    cursor: default;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .item-btns {
    display: flex;
    gap: 6px;
  }

  .battle-log-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-height: 195px;
    overflow-y: auto;
  }

  .log-entry {
    font-size: 0.82rem;
    color: #cbd5e1;
    padding: 4px 8px;
    border-radius: 4px;
    background: rgba(15, 23, 42, 0.55);
    line-height: 1.4;
  }

  .log-entry.latest-log {
    color: #fef08a;
    font-weight: 700;
    border-left: 3px solid #f59e0b;
    background: rgba(245, 158, 11, 0.14);
  }

  @media (max-width: 900px) {
    .jrpg-battle-stage {
      grid-template-columns: 1fr;
    }
    .vs-divider {
      display: none;
    }
    .jrpg-command-deck {
      grid-template-columns: 1fr;
    }
    .skills-grid,
    .items-grid,
    .stances-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
