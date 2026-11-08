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

  let activeSubMenu = $state<'none' | 'skills' | 'items' | 'stances'>('none');

  function handleAttack() {
    activeSubMenu = 'none';
    gameStore.cmdAttack();
  }

  function handleCastSkill(skillId: string) {
    activeSubMenu = 'none';
    gameStore.cmdSkill(skillId);
  }

  function handleOverdrive() {
    activeSubMenu = 'none';
    gameStore.cmdBushidoOverdrive();
  }

  function handleDefend() {
    activeSubMenu = 'none';
    gameStore.cmdDefend();
  }

  function handleUseItem(itemId: 'dango' | 'matcha' | 'sake' | 'elixir') {
    activeSubMenu = 'none';
    gameStore.cmdUseItem(itemId);
  }

  function handleAllOut() {
    activeSubMenu = 'none';
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
  <!-- 上半部：《新武士道列傳》大型多人全彩開放世界地圖（含巨型 TV GAME 對話框） -->
  <WorldMapCanvas />

  <!-- 下半部：SFC《Final Fantasy VI》質感橫向戰場舞台 ＋ 皇家藍三欄金屬指令視窗 -->
  <div class="ff6-battle-console">
    <!-- 頂部戰場資訊列 -->
    <div class="ff6-top-strip">
      <div class="strip-left">
        <span class="ff6-badge">🕹️ SFC FF6 SIDE-VIEW BATTLE</span>
        <span class="round-tag">第 {battle.round} 回合</span>
        <span class="stance-tag" title={curStance.counterDesc}>
          {curStance.icon} 當前架勢：【{curStance.name}】（{curStance.counterDesc}）
        </span>
      </div>
      <div class="strip-actions">
        <button class="btn btn-outline btn-sm" onclick={() => gameStore.restAtTownInn()}>
          🍵 茶屋宿屋全回復 (20兩)
        </button>
        <button class="btn btn-crimson btn-sm" onclick={() => gameStore.spawnEncounterGroup(true)}>
          👑 召喚區域首領決戰
        </button>
      </div>
    </div>

    <!-- SFC《FF6》橫向全景戰場舞台：左側妖魔陣列 vs 右側我方三人小隊直接站立於戰場地面 -->
    <div class="ff6-scenic-battlefield">
      <!-- 遠景赤月、富士山與朱紅鳥居剪影 -->
      <div class="scenic-sky-layer">
        <div class="scenic-moon"></div>
        <div class="scenic-fuji"></div>
        <div class="scenic-torii">⛩️</div>
      </div>
      <!-- 透視戰場地面 -->
      <div class="scenic-ground-plane"></div>

      <!-- 頂部中央 FF6 經典藍框招式／戰況宣告視窗 -->
      <div class="ff6-top-announcement-window">
        {#if battle.skillBanner}
          <span class="skill-cast-text">✨ {battle.skillBanner}</span>
        {:else if battle.logs.length > 0}
          <span class="latest-battle-msg">{battle.logs[0]}</span>
        {:else}
          <span class="latest-battle-msg">⚔️ 拔刀對峙中！請選擇下方指令或按【空白鍵】發動全員總攻！</span>
        {/if}
      </div>

      <!-- 左側戰場：敵方百鬼妖魔陣列（站立於戰場地面上，點擊可鎖定目標） -->
      <div class="ff6-enemies-field">
        {#each battle.enemies as en, idx}
          {@const isSelected = battle.selectedTargetIdx === idx && en.hp > 0}
          {@const stInfo = FIVE_RINGS_STANCES[en.stance] || FIVE_RINGS_STANCES.fire}
          <button
            type="button"
            class="ff6-enemy-actor pos-{idx} {isSelected ? 'locked-target' : ''} {en.hp <= 0 ? 'actor-ko' : ''} {en.isBoss ? 'actor-boss' : ''}"
            onclick={() => { if (en.hp > 0) gameStore.jrpgBattle.selectedTargetIdx = idx; }}
          >
            {#if isSelected}
              <div class="ff6-target-hand">☞ 鎖定</div>
            {/if}
            <div class="actor-sprite-wrap">
              <PixelPortrait
                spriteId={en.avatar}
                scale={en.isBoss ? 3.2 : 2.5}
                mode="full"
                facing="right"
                label={en.name}
              />
              <div class="actor-ground-shadow"></div>
            </div>
            <div class="actor-foot-plate">
              <div class="actor-name-row">
                <span>{stInfo.icon} Lv.{en.level} {en.name}</span>
              </div>
              <div class="actor-hp-track">
                <div class="actor-hp-fill" style="width: {Math.max(0, Math.min(100, (en.hp / en.maxHp) * 100))}%;"></div>
              </div>
            </div>
          </button>
        {/each}
      </div>

      <!-- 右側戰場：我方《新武士道列傳》三人同行小隊（斜列站立於戰場右側） -->
      <div class="ff6-party-field">
        {#each party as member, pIdx}
          {@const isActing = battle.actingUnitId === member.id}
          <div class="ff6-party-actor party-pos-{pIdx} {isActing ? 'acting-step-forward' : ''}">
            <div class="actor-sprite-wrap">
              <PixelPortrait
                spriteId={member.avatar}
                scale={2.55}
                mode="full"
                facing="left"
                label={member.name}
              />
              <div class="actor-ground-shadow hero-shadow"></div>
            </div>
            <div class="hero-foot-tag">
              {member.name}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- 底部：SFC《Final Fantasy VI》經典三欄式皇家藍金屬浮雕視窗組 -->
    <div class="ff6-bottom-console-deck">
      <!-- 左視窗：敵軍目標清單與即時戰況卷軸 -->
      <div class="ff6-window ff6-target-log-window">
        <div class="ff6-window-title">🎯 敵陣鎖定與戰況紀錄</div>
        <div class="ff6-enemy-list">
          {#each battle.enemies as en, idx}
            {@const isSelected = battle.selectedTargetIdx === idx && en.hp > 0}
            {@const stInfo = FIVE_RINGS_STANCES[en.stance] || FIVE_RINGS_STANCES.fire}
            <button
              type="button"
              class="ff6-enemy-row {isSelected ? 'selected' : ''} {en.hp <= 0 ? 'dead' : ''}"
              onclick={() => { if (en.hp > 0) gameStore.jrpgBattle.selectedTargetIdx = idx; }}
            >
              <span class="ptr">{isSelected ? '☞' : '　'}</span>
              <span class="en-name">{stInfo.icon} {en.name}</span>
              <span class="en-hp">{en.hp > 0 ? `${en.hp.toLocaleString()} HP` : '擊破'}</span>
            </button>
          {/each}
        </div>
        <div class="ff6-mini-logs">
          {#each battle.logs.slice(0, 4) as line, i}
            <div class="ff6-log-line {i === 0 ? 'first' : ''}">{line}</div>
          {/each}
        </div>
      </div>

      <!-- 中視窗：SFC FF6 經典直列式戰鬥指令選單（含金手指游標 ☞） -->
      <div class="ff6-window ff6-command-menu-window">
        <div class="ff6-window-title">🕹️ 武士道指令</div>
        <div class="ff6-cmd-list">
          <button class="ff6-cmd-item" onclick={handleAttack}>
            <span class="cmd-ptr">☞</span>
            <span class="cmd-txt">⚔️ 拔刀連斬</span>
            <span class="cmd-tag">普攻</span>
          </button>

          <button
            class="ff6-cmd-item {activeSubMenu === 'skills' ? 'active' : ''}"
            onclick={() => (activeSubMenu = activeSubMenu === 'skills' ? 'none' : 'skills')}
          >
            <span class="cmd-ptr">☞</span>
            <span class="cmd-txt">📜 劍技・秘術</span>
            <span class="cmd-tag">奧義</span>
          </button>

          <button
            class="ff6-cmd-item overdrive {(party[0]?.pow || 0) >= 100 ? 'ready' : ''}"
            onclick={handleOverdrive}
          >
            <span class="cmd-ptr">☞</span>
            <span class="cmd-txt">🔥 天覇絕刀</span>
            <span class="cmd-tag">{party[0]?.pow || 0}%</span>
          </button>

          <button
            class="ff6-cmd-item {activeSubMenu === 'stances' ? 'active' : ''}"
            onclick={() => (activeSubMenu = activeSubMenu === 'stances' ? 'none' : 'stances')}
          >
            <span class="cmd-ptr">☞</span>
            <span class="cmd-txt">☯️ 五輪架勢</span>
            <span class="cmd-tag">相剋</span>
          </button>

          <button
            class="ff6-cmd-item {activeSubMenu === 'items' ? 'active' : ''}"
            onclick={() => (activeSubMenu = activeSubMenu === 'items' ? 'none' : 'items')}
          >
            <span class="cmd-ptr">☞</span>
            <span class="cmd-txt">🍡 行囊道具</span>
            <span class="cmd-tag">補給</span>
          </button>

          <button class="ff6-cmd-item" onclick={handleDefend}>
            <span class="cmd-ptr">☞</span>
            <span class="cmd-txt">🛡️ 納刀見切</span>
            <span class="cmd-tag">回氣</span>
          </button>

          <button class="ff6-cmd-item allout" onclick={handleAllOut}>
            <span class="cmd-ptr">☞</span>
            <span class="cmd-txt">⚡ 全員總攻</span>
            <span class="cmd-tag">空白鍵</span>
          </button>
        </div>
      </div>

      <!-- 右視窗：SFC FF6 三人小隊狀態表（或展開的劍技／道具／架勢子視窗） -->
      <div class="ff6-window ff6-party-status-window">
        {#if activeSubMenu === 'skills'}
          <div class="ff6-subwindow-header">
            <span>📜 選擇要施展的【二天劍技・巫女祈禱・伊賀忍法】</span>
            <button class="ff6-back-btn" onclick={() => (activeSubMenu = 'none')}>✕ 返回狀態欄</button>
          </div>
          <div class="ff6-sub-grid">
            {#each JRPG_PARTY_SKILLS as sk}
              <button class="ff6-sub-card" onclick={() => handleCastSkill(sk.id)}>
                <div class="sub-top">
                  <span class="sub-name"><span class="ptr">☞</span> {sk.icon} {sk.name}</span>
                  <span class="sub-cost">{sk.spCost} SP</span>
                </div>
                <div class="sub-caster">施展者：【{sk.casterName}】</div>
                <div class="sub-desc">{sk.desc}</div>
              </button>
            {/each}
          </div>
        {:else if activeSubMenu === 'items'}
          <div class="ff6-subwindow-header">
            <span>🍡 選擇要使用的【江戶行囊道具】</span>
            <button class="ff6-back-btn" onclick={() => (activeSubMenu = 'none')}>✕ 返回狀態欄</button>
          </div>
          <div class="ff6-sub-grid">
            {#each consumables as item}
              <div class="ff6-sub-card item-card">
                <div class="sub-top">
                  <span class="sub-name">{item.icon} {item.name} (持有 x{item.count})</span>
                </div>
                <div class="sub-desc">{item.desc}</div>
                <div class="item-actions">
                  <button class="btn btn-gold btn-sm" disabled={item.count <= 0} onclick={() => handleUseItem(item.id)}>
                    ☞ 使用道具
                  </button>
                  <button class="btn btn-outline btn-sm" onclick={() => gameStore.buyConsumable(item.id)}>
                    購買 ({item.price}兩)
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {:else if activeSubMenu === 'stances'}
          <div class="ff6-subwindow-header">
            <span>☯️ 切換《五輪書》劍道架勢（克制傷害 +35%）</span>
            <button class="ff6-back-btn" onclick={() => (activeSubMenu = 'none')}>✕ 返回狀態欄</button>
          </div>
          <div class="ff6-sub-grid">
            {#each Object.values(FIVE_RINGS_STANCES) as st}
              <button
                class="ff6-sub-card {player.stance === st.id ? 'active-stance' : ''}"
                onclick={() => { gameStore.selectStance(st.id); activeSubMenu = 'none'; }}
              >
                <div class="sub-top">
                  <span class="sub-name"><span class="ptr">☞</span> {st.icon} {st.name}</span>
                  <span class="sub-cost">{st.counterDesc}</span>
                </div>
                <div class="sub-desc">{st.desc}</div>
              </button>
            {/each}
          </div>
        {:else}
          <div class="ff6-window-title">
            <span>🛡️ 《新武士道列傳》同行三人小隊狀態</span>
            <span class="status-cols-lbl">HP 生命　/　SP 氣力　/　POW 怒氣</span>
          </div>
          <div class="ff6-party-table">
            {#each party as member}
              <div class="ff6-hero-row">
                <div class="hero-bust">
                  <PixelPortrait spriteId={member.avatar} scale={2} mode="bust" label={member.name} />
                </div>
                <div class="hero-identity">
                  <div class="hero-name">{member.name}</div>
                  <div class="hero-role">【{member.roleTitle}】</div>
                </div>
                <div class="hero-gauges">
                  <!-- HP -->
                  <div class="gauge-col">
                    <div class="gauge-top">
                      <span class="g-lbl hp">HP</span>
                      <span class="g-num">{member.hp}<span>/{member.maxHp}</span></span>
                    </div>
                    <div class="g-bar">
                      <div class="g-fill hp" style="width: {Math.min(100, (member.hp / member.maxHp) * 100)}%;"></div>
                    </div>
                  </div>
                  <!-- SP -->
                  <div class="gauge-col">
                    <div class="gauge-top">
                      <span class="g-lbl sp">SP</span>
                      <span class="g-num">{member.sp}<span>/{member.maxSp}</span></span>
                    </div>
                    <div class="g-bar">
                      <div class="g-fill sp" style="width: {Math.min(100, (member.sp / member.maxSp) * 100)}%;"></div>
                    </div>
                  </div>
                  <!-- POW -->
                  <div class="gauge-col pow-col">
                    <div class="gauge-top">
                      <span class="g-lbl pow">怒氣</span>
                      <span class="g-num pow-num">{member.id === 'leader' ? `${member.pow}%` : '協同'}</span>
                    </div>
                    <div class="g-bar">
                      <div
                        class="g-fill pow {member.pow >= 100 ? 'max' : ''}"
                        style="width: {member.id === 'leader' ? Math.min(100, member.pow) : 100}%;"
                      ></div>
                    </div>
                  </div>
                </div>
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
    gap: 14px;
  }

  /* SFC《Final Fantasy VI》戰鬥主機外框 */
  .ff6-battle-console {
    background: #040814;
    border: 3px solid #cbd5e1;
    box-shadow: inset 0 0 0 2px #d97706, 0 12px 36px rgba(0, 0, 0, 0.85);
    border-radius: 12px;
    overflow: hidden;
  }

  .ff6-top-strip {
    background: linear-gradient(180deg, #10235c 0%, #071133 100%);
    border-bottom: 2px solid #cbd5e1;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .strip-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ff6-badge {
    background: #1d4ed8;
    border: 1px solid #93c5fd;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 900;
    padding: 3px 9px;
    border-radius: 4px;
    letter-spacing: 0.8px;
  }

  .round-tag {
    background: #b45309;
    border: 1px solid #fde047;
    color: #fff;
    font-weight: 900;
    font-size: 0.88rem;
    padding: 3px 10px;
    border-radius: 6px;
  }

  .stance-tag {
    color: #fde047;
    font-weight: 900;
    font-size: 0.95rem;
    text-shadow: 1px 1px 0 #000;
  }

  .strip-actions {
    display: flex;
    gap: 8px;
  }

  /* SFC FF6 橫向全景戰場舞台 */
  .ff6-scenic-battlefield {
    position: relative;
    height: 295px;
    background: linear-gradient(180deg, #090d24 0%, #1b1947 38%, #3b1d4a 60%, #1e3329 61%, #12211a 100%);
    border-bottom: 3px solid #cbd5e1;
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 16px 48px 20px;
  }

  .scenic-sky-layer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    pointer-events: none;
  }

  .scenic-moon {
    position: absolute;
    top: 22px;
    left: 18%;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: radial-gradient(circle, #fef08a 0%, #f59e0b 55%, transparent 72%);
    opacity: 0.85;
  }

  .scenic-fuji {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 380px;
    height: 115px;
    background: linear-gradient(180deg, #f8fafc 0%, #cbd5e1 26%, #312e81 55%, #111827 100%);
    clip-path: polygon(44% 0%, 56% 0%, 100% 100%, 0% 100%);
    opacity: 0.75;
  }

  .scenic-torii {
    position: absolute;
    bottom: -4px;
    left: 34%;
    font-size: 3.2rem;
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.8));
    opacity: 0.85;
  }

  .scenic-ground-plane {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40%;
    background:
      radial-gradient(ellipse at 50% 20%, rgba(251, 191, 36, 0.14), transparent 70%),
      repeating-linear-gradient(
        180deg,
        rgba(30, 58, 42, 0.9) 0px,
        rgba(20, 40, 30, 0.95) 14px,
        rgba(12, 26, 20, 0.98) 28px
      );
    border-top: 2px solid rgba(251, 191, 36, 0.35);
    pointer-events: none;
  }

  /* 頂部中央 FF6 招式／訊息宣告視窗 */
  .ff6-top-announcement-window {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 520px;
    max-width: 82%;
    background: linear-gradient(180deg, #16389c 0%, #081648 100%);
    border: 3px solid #e2e8f0;
    box-shadow: inset 0 0 0 2px #fbbf24, 0 8px 24px rgba(0, 0, 0, 0.85);
    border-radius: 8px;
    padding: 8px 24px;
    text-align: center;
    z-index: 20;
  }

  .skill-cast-text {
    font-size: 1.25rem;
    font-weight: 900;
    color: #fde047;
    text-shadow: 2px 2px 0 #000;
  }

  .latest-battle-msg {
    font-size: 1.05rem;
    font-weight: 800;
    color: #ffffff;
    text-shadow: 1.5px 1.5px 0 #000;
  }

  /* 左側敵軍站位 */
  .ff6-enemies-field {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: flex-end;
    gap: 26px;
  }

  .ff6-enemy-actor {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    transition: transform 0.18s;
    padding: 0;
  }

  .ff6-enemy-actor.pos-0 { transform: translateY(-12px); }
  .ff6-enemy-actor.pos-1 { transform: translateY(6px); }
  .ff6-enemy-actor.pos-2 { transform: translateY(-20px); }

  .ff6-enemy-actor:hover {
    transform: scale(1.06) translateY(-6px);
  }

  .ff6-enemy-actor.actor-ko {
    opacity: 0.25;
    filter: grayscale(1);
  }

  .ff6-target-hand {
    background: rgba(220, 38, 38, 0.95);
    border: 2px solid #fde047;
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: 900;
    padding: 2px 10px;
    border-radius: 999px;
    margin-bottom: 4px;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.8);
    animation: bounceTarget 0.6s infinite alternate;
  }

  @keyframes bounceTarget {
    from { transform: translateY(0); }
    to { transform: translateY(-5px); }
  }

  .actor-sprite-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .actor-ground-shadow {
    width: 68px;
    height: 16px;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.7) 0%, transparent 75%);
    margin-top: -10px;
  }

  .hero-shadow {
    background: radial-gradient(ellipse, rgba(56, 189, 248, 0.45) 0%, rgba(0, 0, 0, 0.7) 60%, transparent 75%);
  }

  .actor-foot-plate {
    background: rgba(8, 18, 48, 0.92);
    border: 1.5px solid #cbd5e1;
    border-radius: 6px;
    padding: 4px 10px;
    min-width: 135px;
    margin-top: 2px;
  }

  .ff6-enemy-actor.locked-target .actor-foot-plate {
    border-color: #fde047;
    box-shadow: 0 0 12px rgba(250, 204, 21, 0.5);
  }

  .actor-name-row {
    font-size: 0.82rem;
    font-weight: 900;
    color: #fef08a;
    text-shadow: 1px 1px 0 #000;
    margin-bottom: 3px;
    text-align: center;
  }

  .actor-hp-track {
    height: 7px;
    background: #1e293b;
    border-radius: 4px;
    overflow: hidden;
  }

  .actor-hp-fill {
    height: 100%;
    background: linear-gradient(90deg, #dc2626, #f87171);
    transition: width 0.2s;
  }

  /* 右側我方三人小隊 FF6 斜列站位 */
  .ff6-party-field {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: flex-end;
    gap: 22px;
  }

  .ff6-party-actor {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s;
  }

  .ff6-party-actor.party-pos-0 { transform: translateY(4px); }
  .ff6-party-actor.party-pos-1 { transform: translateY(-16px); }
  .ff6-party-actor.party-pos-2 { transform: translateY(-34px); }

  .ff6-party-actor.acting-step-forward {
    transform: translateX(-42px) scale(1.08);
    filter: drop-shadow(0 0 14px rgba(250, 204, 21, 0.85));
  }

  .hero-foot-tag {
    background: linear-gradient(180deg, #16389c, #091852);
    border: 1.5px solid #fde047;
    color: #ffffff;
    font-size: 0.82rem;
    font-weight: 900;
    padding: 2px 10px;
    border-radius: 6px;
    text-shadow: 1px 1px 0 #000;
    margin-top: 2px;
  }

  /* 底部：SFC《FF6》經典三欄式皇家藍金屬浮雕視窗組 */
  .ff6-bottom-console-deck {
    display: grid;
    grid-template-columns: 1.05fr 0.85fr 1.6fr;
    gap: 8px;
    padding: 10px;
    background: #02050d;
  }

  .ff6-window {
    background: linear-gradient(180deg, #153596 0%, #091852 58%, #040a26 100%);
    border: 3px solid #e2e8f0;
    box-shadow:
      inset 0 0 0 2px #1d4ed8,
      inset 0 0 0 3.5px #fbbf24,
      0 6px 20px rgba(0, 0, 0, 0.8);
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ff6-window-title {
    font-size: 0.92rem;
    font-weight: 900;
    color: #fde047;
    text-shadow: 1.5px 1.5px 0 #000;
    padding-bottom: 6px;
    border-bottom: 1.5px solid rgba(251, 191, 36, 0.4);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-cols-lbl {
    font-size: 0.76rem;
    color: #93c5fd;
  }

  /* 左欄：敵軍名單與戰況 */
  .ff6-enemy-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ff6-enemy-row {
    background: rgba(6, 15, 42, 0.7);
    border: 1px solid rgba(148, 163, 184, 0.35);
    border-radius: 6px;
    padding: 6px 10px;
    color: #f8fafc;
    font-size: 0.95rem;
    font-weight: 800;
    text-shadow: 1px 1px 0 #000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }

  .ff6-enemy-row.selected {
    border-color: #fde047;
    background: rgba(30, 64, 175, 0.65);
    color: #fef08a;
  }

  .ff6-enemy-row.dead {
    opacity: 0.4;
    text-decoration: line-through;
  }

  .ptr {
    color: #fde047;
    font-weight: 900;
    margin-right: 4px;
  }

  .en-name {
    flex: 1;
    text-align: left;
  }

  .en-hp {
    color: #fca5a5;
    font-size: 0.85rem;
  }

  .ff6-mini-logs {
    margin-top: auto;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    padding-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .ff6-log-line {
    font-size: 0.8rem;
    color: #cbd5e1;
    text-shadow: 1px 1px 0 #000;
    line-height: 1.35;
  }

  .ff6-log-line.first {
    color: #fde047;
    font-weight: 800;
  }

  /* 中欄：FF6 經典直列指令選單 */
  .ff6-cmd-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .ff6-cmd-item {
    background: rgba(8, 20, 56, 0.75);
    border: 1.5px solid rgba(147, 197, 253, 0.4);
    border-radius: 6px;
    padding: 6px 10px;
    color: #ffffff;
    font-size: 1.02rem;
    font-weight: 900;
    text-shadow: 1.5px 1.5px 0 #000;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.12s;
  }

  .cmd-ptr {
    opacity: 0.25;
    color: #fde047;
    margin-right: 6px;
    transition: all 0.12s;
  }

  .ff6-cmd-item:hover,
  .ff6-cmd-item.active {
    background: linear-gradient(90deg, #1d4ed8, #1e3a8a);
    border-color: #fde047;
    color: #fef08a;
  }

  .ff6-cmd-item:hover .cmd-ptr,
  .ff6-cmd-item.active .cmd-ptr {
    opacity: 1;
    transform: translateX(3px);
  }

  .ff6-cmd-item.overdrive.ready {
    background: linear-gradient(90deg, #b91c1c, #d97706);
    border-color: #fef08a;
    box-shadow: 0 0 12px rgba(250, 204, 21, 0.55);
  }

  .ff6-cmd-item.allout {
    background: linear-gradient(90deg, #065f46, #047857);
    border-color: #6ee7b7;
  }

  .cmd-txt {
    flex: 1;
    text-align: left;
  }

  .cmd-tag {
    font-size: 0.75rem;
    color: #93c5fd;
    font-weight: 800;
  }

  /* 右欄：三人小隊狀態列 */
  .ff6-party-table {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .ff6-hero-row {
    background: rgba(6, 15, 42, 0.72);
    border: 1.5px solid rgba(147, 197, 253, 0.35);
    border-radius: 8px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .hero-bust {
    width: 56px;
    height: 56px;
    border: 2px solid #fbbf24;
    border-radius: 8px;
    overflow: hidden;
    flex-shrink: 0;
    background: #050814;
  }

  .hero-identity {
    width: 118px;
    flex-shrink: 0;
  }

  .hero-name {
    font-size: 1.05rem;
    font-weight: 900;
    color: #ffffff;
    text-shadow: 1.5px 1.5px 0 #000;
  }

  .hero-role {
    font-size: 0.78rem;
    font-weight: 800;
    color: #fde047;
  }

  .hero-gauges {
    flex: 1;
    display: grid;
    grid-template-columns: 1.1fr 1fr 0.85fr;
    gap: 10px;
  }

  .gauge-col {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .gauge-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-weight: 900;
    text-shadow: 1px 1px 0 #000;
  }

  .g-lbl {
    font-size: 0.78rem;
  }
  .g-lbl.hp { color: #4ade80; }
  .g-lbl.sp { color: #38bdf8; }
  .g-lbl.pow { color: #fbbf24; }

  .g-num {
    font-size: 0.92rem;
    color: #ffffff;
  }

  .g-num span {
    font-size: 0.74rem;
    color: #94a3b8;
  }

  .pow-num {
    color: #fde047;
  }

  .g-bar {
    height: 8px;
    background: #020617;
    border: 1px solid #475569;
    border-radius: 4px;
    overflow: hidden;
  }

  .g-fill {
    height: 100%;
    transition: width 0.2s;
  }
  .g-fill.hp { background: linear-gradient(90deg, #16a34a, #4ade80); }
  .g-fill.sp { background: linear-gradient(90deg, #0284c7, #38bdf8); }
  .g-fill.pow { background: linear-gradient(90deg, #d97706, #fde047); }
  .g-fill.pow.max { background: linear-gradient(90deg, #dc2626, #fde047); }

  /* 子視窗：劍技／道具／架勢 */
  .ff6-subwindow-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
    font-weight: 900;
    color: #fde047;
    text-shadow: 1px 1px 0 #000;
    padding-bottom: 6px;
    border-bottom: 1.5px solid rgba(251, 191, 36, 0.4);
  }

  .ff6-back-btn {
    background: #991b1b;
    border: 1.5px solid #fca5a5;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 900;
    padding: 3px 10px;
    border-radius: 6px;
    cursor: pointer;
  }

  .ff6-sub-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    max-height: 220px;
    overflow-y: auto;
  }

  .ff6-sub-card {
    background: rgba(6, 15, 42, 0.85);
    border: 1.5px solid #60a5fa;
    border-radius: 8px;
    padding: 8px 12px;
    color: #fff;
    text-align: left;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .ff6-sub-card:hover,
  .ff6-sub-card.active-stance {
    border-color: #fde047;
    background: rgba(30, 58, 138, 0.9);
  }

  .sub-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sub-name {
    font-size: 0.95rem;
    font-weight: 900;
    color: #fde047;
  }

  .sub-cost {
    font-size: 0.8rem;
    font-weight: 900;
    color: #38bdf8;
  }

  .sub-caster {
    font-size: 0.75rem;
    color: #93c5fd;
  }

  .sub-desc {
    font-size: 0.78rem;
    color: #e2e8f0;
    line-height: 1.35;
  }

  .item-card {
    cursor: default;
  }

  .item-actions {
    display: flex;
    gap: 6px;
    margin-top: 4px;
  }
</style>
