/**
 * 《武士之刃：無雙斬》拍賣場與即時社群聊天系統 (src/market_chat.js)
 * 1. 裝備交易拍賣場 (多維度篩選、自由購買、玩家自售上架與自動撮合成交)
 * 2. 世界頻道即時聊天室 (支援自訂輸入、無障礙單鍵快速發言、全服掉落戰報廣播)
 */
(function() {
  'use strict';

  class MarketChatManager {
    constructor(game) {
      this.game = game;
      this.listings = [];
      this.chatMessages = [];
      this.myListings = [];
      this.filterSlot = 'all';
      this.filterQuality = 'all';

      this.initDefaultListings();
      this.initDefaultChat();
      this.startChatSimulation();
      this.startMarketSimulation();
    }

    /**
     * 初始化拍賣場預設掛單商品
     */
    initDefaultListings() {
      const qualities = ['rare', 'rare', 'epic', 'epic', 'legendary', 'legendary', 'ancient'];
      const slots = ['weapon', 'offhand', 'helm', 'armor', 'accessory', 'boots'];
      const sellers = ['真田信繁', '宮本武藏', '柳生十兵衛', '服部半藏', '阿市', '上杉謙信', '伊達政宗', '織田市集商'];

      this.listings = [];
      for (let i = 0; i < 12; i++) {
        const q = qualities[Math.floor(Math.random() * qualities.length)];
        const s = slots[Math.floor(Math.random() * slots.length)];
        const lvl = Math.max(1, Math.min(80, (this.game && this.game.player ? this.game.player.level : 10) + Math.floor(Math.random() * 8) - 2));
        const gear = window.generateGear(s, q, lvl);
        const seller = sellers[Math.floor(Math.random() * sellers.length)];
        const price = Math.round(gear.gearScore * 4.5 + Math.random() * 500);

        this.listings.push({
          id: 'listing_' + Date.now() + '_' + i,
          seller: seller,
          gear: gear,
          price: price,
          createdAt: Date.now()
        });
      }
    }

    /**
     * 初始聊天室歷史紀錄
     */
    initDefaultChat() {
      this.chatMessages = [
        { sender: '系統', text: '歡迎來到《武士之刃：無雙斬》！暗黑式打寶放置冒險已開啟。', time: '剛剛', isSystem: true },
        { sender: '宮本武藏', text: '二天一流的居合連斬手感極佳，推薦大家都試試劍聖！', time: '1分鐘前', isSystem: false },
        { sender: '真田幸村', text: '守護大名的重甲反傷配高血量，站著就把第四章骨龍彈死了，超休閒！', time: '2分鐘前', isSystem: false },
        { sender: '天狗旅人', text: '剛打到一把傳奇【和泉守兼定】，暗金光柱彈出來那一刻太爽了！', time: '3分鐘前', isSystem: false }
      ];
    }

    /**
     * 定時動態補充聊天訊息與全服戰報
     */
    startChatSimulation() {
      const dynamicTexts = [
        { sender: '柳生但馬守', text: '各位大俠好！有人有多餘的史詩大鎧可以賣我嗎？' },
        { sender: '出雲巫女', text: '陰陽劍士的式神靈壁太穩了，護盾幾乎常駐破不了！' },
        { sender: '鬼丸修羅', text: '掛機一小時回來背包跳出三件傳奇，一鍵換裝戰力狂飆3000！' },
        { sender: '浪人阿吉', text: '身障無障礙操作太貼心了，單手點擊就能爽快推進章節。' },
        { sender: '越後義士', text: '拍賣場剛被我淘到一件高暴擊遠古神裝，賺爛了！' },
        { sender: '甲斐赤備', text: '有卡關的朋友記得去道場點天賦，每升一級差很多。' }
      ];

      this.chatTimer = setInterval(() => {
        if (Math.random() < 0.4) {
          const item = dynamicTexts[Math.floor(Math.random() * dynamicTexts.length)];
          this.addChatMessage(item.sender, item.text, false);
        }
      }, 15000);
      if (typeof this.chatTimer.unref === 'function') this.chatTimer.unref();
    }

    /**
     * 拍賣場成交動態模擬（玩家上架的物品會被其他浪人購買）
     */
    startMarketSimulation() {
      this.marketTimer = setInterval(() => {
        // 如果玩家有上架中物品，50%機率被市場買家買走
        if (this.myListings.length > 0 && Math.random() < 0.5) {
          const soldIndex = Math.floor(Math.random() * this.myListings.length);
          const soldItem = this.myListings.splice(soldIndex, 1)[0];
          
          if (this.game && this.game.player) {
            this.game.player.gold += soldItem.price;
            this.game.trackStat && this.game.trackStat('marketSales', 1);
            this.game.showToast(`🎉 拍賣場捷報！您上架的【${soldItem.gear.name}】已成功售出，獲得 ${soldItem.price.toLocaleString()} 金幣！`, 'success');
            if (this.game.audio) this.game.audio.playCoinSound();
            this.renderMarketUI();
            this.game.updateHeaderUI();
          }
        }

        // 定時刷新拍賣場庫存（補充 1~2 件新裝備）
        if (this.listings.length < 15) {
          const qList = ['rare', 'epic', 'legendary'];
          const sList = ['weapon', 'offhand', 'helm', 'armor', 'accessory', 'boots'];
          const q = qList[Math.floor(Math.random() * qList.length)];
          const s = sList[Math.floor(Math.random() * sList.length)];
          const pLevel = this.game && this.game.player ? this.game.player.level : 15;
          const gear = window.generateGear(s, q, pLevel);
          this.listings.push({
            id: 'listing_' + Date.now(),
            seller: '遊歷武士',
            gear: gear,
            price: Math.round(gear.gearScore * 4.2 + Math.random() * 300),
            createdAt: Date.now()
          });
          this.renderMarketUI();
        }
      }, 20000);
      if (typeof this.marketTimer.unref === 'function') this.marketTimer.unref();
    }

    destroy() {
      if (this.chatTimer) clearInterval(this.chatTimer);
      if (this.marketTimer) clearInterval(this.marketTimer);
    }

    /**
     * 發送聊天訊息
     */
    addChatMessage(sender, text, isSystem = false) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      this.chatMessages.push({
        sender,
        text,
        time: timeStr,
        isSystem
      });

      if (this.chatMessages.length > 50) {
        this.chatMessages.shift();
      }

      this.renderChatUI();
    }

    /**
     * 全服廣播擊殺首領或爆出傳奇神裝
     */
    broadcastLoot(playerName, gear) {
      if (!gear) return;
      if (gear.quality === 'legendary' || gear.quality === 'ancient') {
        const text = `🔥 傳奇降臨！玩家【${playerName}】在戰鬥中爆出了 [${gear.qualityName}]【${gear.name}】(戰力 +${gear.gearScore})！`;
        this.addChatMessage('全服戰報', text, true);
      }
    }

    /**
     * 玩家購買拍賣場裝備
     */
    buyListing(listingId) {
      const idx = this.listings.findIndex(l => l.id === listingId);
      if (idx === -1) return;
      const listing = this.listings[idx];

      if (this.game.player.gold < listing.price) {
        this.game.showToast(`金幣不足！需要 ${listing.price.toLocaleString()} 金幣`, 'error');
        return;
      }

      this.game.player.gold -= listing.price;
      this.game.addGearToInventory(listing.gear);
      this.listings.splice(idx, 1);

      this.game.trackStat('marketPurchases', 1);
      this.game.showToast(`成功在拍賣場購得【${listing.gear.name}】！已收入行囊`, 'success');
      if (this.game.audio) this.game.audio.playEquipSound();

      this.renderMarketUI();
      this.game.updateHeaderUI();
      this.game.checkSmartEquip();
    }

    /**
     * 玩家上架販售裝備
     */
    listMyGear(gearUid, customPrice) {
      const inv = this.game.player.inventory;
      const idx = inv.findIndex(g => g.uid === gearUid);
      if (idx === -1) return;

      const gear = inv[idx];
      const price = customPrice || Math.max(100, Math.round(gear.gearScore * 4.0));

      // 從玩家背包移除
      inv.splice(idx, 1);

      const listing = {
        id: 'my_listing_' + Date.now(),
        seller: this.game.player.name || '在下武士',
        gear: gear,
        price: price,
        createdAt: Date.now()
      };

      this.myListings.push(listing);
      this.game.showToast(`已成功將【${gear.name}】上架至拍賣場，定價 ${price.toLocaleString()} 金幣！`, 'success');
      this.addChatMessage('市集快報', `玩家【${listing.seller}】將 [${gear.qualityName}]【${gear.name}】以 ${price.toLocaleString()} 金幣上架至拍賣場！`, true);

      this.renderMarketUI();
      this.game.renderGearUI();
    }

    /**
     * 渲染拍賣場 UI
     */
    renderMarketUI() {
      const container = document.getElementById('market-listings-container');
      if (!container) return;

      let filtered = this.listings.filter(item => {
        if (this.filterSlot !== 'all' && item.gear.slot !== this.filterSlot) return false;
        if (this.filterQuality !== 'all' && item.gear.quality !== this.filterQuality) return false;
        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 1.1rem;">
            🛒 目前條件下暫無上架商品，請調整篩選或稍候市集刷新！
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(item => {
        const g = item.gear;
        const q = window.GEAR_QUALITIES[g.quality] || window.GEAR_QUALITIES.common;
        const canAfford = this.game.player.gold >= item.price;

        return `
          <div class="market-item-card" style="border: 2px solid ${q.border}; background: ${q.bgGlow};">
            <div class="market-card-header">
              <span class="market-item-icon">${g.icon}</span>
              <div class="market-item-info">
                <div class="market-item-name" style="color: ${q.color};">${g.name}</div>
                <div class="market-item-meta">${g.slotName} | 等級 ${g.reqLevel} | 賣家: ${item.seller}</div>
              </div>
              <div class="market-item-score">⚡ 戰力 +${g.gearScore}</div>
            </div>

            <div class="market-card-lore">"${g.lore || ''}"</div>

            <div class="market-card-affixes">
              ${g.baseAtk ? `<span class="affix-tag">攻擊 +${g.baseAtk}</span>` : ''}
              ${g.baseDef ? `<span class="affix-tag">防禦 +${g.baseDef}</span>` : ''}
              ${g.baseHP ? `<span class="affix-tag">生命 +${g.baseHP}</span>` : ''}
              ${g.affixes ? g.affixes.map(a => `<span class="affix-tag">${a.text}</span>`).join('') : ''}
              ${g.legendaryPower ? `<div class="power-tag">🌟 ${g.legendaryPower.name}: ${g.legendaryPower.desc}</div>` : ''}
            </div>

            <div class="market-card-footer">
              <div class="market-price">💰 ${item.price.toLocaleString()} 金幣</div>
              <button class="btn btn-buy ${canAfford ? 'btn-gold' : 'btn-disabled'}" 
                      onclick="window.game.marketChat.buyListing('${item.id}')"
                      ${canAfford ? '' : 'disabled'}>
                ${canAfford ? '🛒 購買裝備' : '❌ 金幣不足'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      // 渲染玩家自己的拍賣欄位
      const myListingsContainer = document.getElementById('my-listings-container');
      if (myListingsContainer) {
        if (this.myListings.length === 0) {
          myListingsContainer.innerHTML = `
            <div style="color: var(--text-muted); font-size: 0.95rem; padding: 10px 0;">
              您目前未在拍賣場上架任何裝備。可至【裝備】背包點選多餘裝備進行上架！
            </div>
          `;
        } else {
          myListingsContainer.innerHTML = this.myListings.map(item => `
            <div class="my-listing-pill" style="border: 1px solid ${item.gear.border};">
              <span>${item.gear.icon} <strong>${item.gear.name}</strong></span>
              <span>💰 ${item.price.toLocaleString()} 金幣</span>
              <span class="badge-waiting">⏳ 買家洽談中</span>
            </div>
          `).join('');
        }
      }
    }

    /**
     * 渲染聊天室 UI
     */
    renderChatUI() {
      const container = document.getElementById('chat-messages-container');
      if (!container) return;

      container.innerHTML = this.chatMessages.map(msg => {
        if (msg.isSystem) {
          return `
            <div class="chat-row chat-system">
              <span class="chat-badge-system">📢 ${msg.sender}</span>
              <span class="chat-body-system">${msg.text}</span>
              <span class="chat-time">${msg.time}</span>
            </div>
          `;
        } else {
          return `
            <div class="chat-row">
              <span class="chat-sender">【${msg.sender}】:</span>
              <span class="chat-body">${msg.text}</span>
              <span class="chat-time">${msg.time}</span>
            </div>
          `;
        }
      }).join('');

      // 自動滾動到底部
      container.scrollTop = container.scrollHeight;
    }
  }

  window.MarketChatManager = MarketChatManager;

})();
