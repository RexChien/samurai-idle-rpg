// ==========================================================
// 《無雙劍心：武士之刃》多國語系在地化資料庫 (i18n Database)
// Supported Languages: 繁體中文 (zh-TW), English (en), 日本語 (ja)
// ==========================================================

window.I18N = {
  currentLang: "zh-TW",

  translations: {
    "zh-TW": {
      // 標題與品牌
      gameTitle: "🗡️ 無雙劍心",
      gameSubtitle: "武士之刃・放置RPG",
      docTitle: "《無雙劍心：武士之刃》- 日式名刀放置RPG",

      // 貨幣資源
      resGold: "🪙 金小判",
      resSteel: "💎 玉鋼",
      resKarma: "🌀 魂火",
      resGoldTip: "金小判（擊敵與熔煉獲得，用於鍛造與研磨）",
      resSteelTip: "踏鞴玉鋼（名刀核心鍛造與強化材料）",
      resKarmaTip: "輪迴魂火（劍心輪迴轉生獲得，用於點亮永久神龕天賦）",

      // 角色與面板
      charExpLabel: "劍理:",
      statAtk: "攻擊力",
      statDef: "防禦力",
      statCrit: "會心率",
      statCritDmg: "會心傷",
      statSpeed: "拔刀速度",
      statPen: "破甲穿透",
      statPerSec: "次/秒",
      equipTierDefault: "凡鐵",

      // 導航分頁
            tabAchievements: "🏆 榮譽成就",
      achTitle: "🏆 武士榮譽成就殿堂",
      achSub: "在漫長的劍道旅途中刻下屬於你的不朽功勳，領取金小判、玉鋼與輪迴魂火！",
      achProgressLabel: "成就達成進度:",
      achFilterAll: "全部",
      achFilterCombat: "⚔️ 討伐武勳",
      achFilterSwords: "🗡️ 名刀淬火",
      achFilterGrowth: "⛩️ 劍道境界",
      achFilterDestiny: "🌀 天命輪迴",
      achClaimBtn: "✨ 領取獎勵",
      achClaimAllBtn: "🎁 一鍵領取所有完成獎勵",
      achClaimed: "✅ 已領取",
      achInProgress: "進行中",
      achToastUnlocked: "🏆 成就達成！",
      achClaimAllSuccess: "🎉 成功領取了 {count} 項成就獎勵！獲得金小判 +{gold}、玉鋼 +{steel}、魂火 +{karma}！",
      achNoClaimable: "目前暫無已完成未領取的成就獎勵！",
      tabBattle: "⚔️ 討伐修煉",
      tabStory: "📜 命運繪卷",
      tabForge: "⚒️ 名刀鍛造",
      tabDojo: "⛩️ 流派奧義",
      tabPrestige: "🌀 劍心轉生",
      tabInventory: "🎒 行囊裝備",
      tabCodex: "📖 名刀鑑賞",
      tabCommunity: "🏮 浪人茶屋",
      tabSettings: "⚙️ 修行存檔",

      // 戰鬥介面
      tapBladeHint: "點擊名刀施展一閃斬擊（或開啟神速自律斬）",
      zoneSelectLabel: "討伐區域：",
      bossChallengeBtn: "👹 決戰區域首領",
      autoSlashLabel: "⚡ 神速自律斬",
      combatLogHeader: "⚔️ 斬擊戰況實錄",
      combatLogClear: "清除",

      // 鍛造介面
      forgeTitle: "⚒️ 踏鞴秘傳・名刀鍛造屋",
      forgeDesc: "使用純淨玉鋼與金小判，遵循古法折疊鍛打傳說名刀。",
      forgeSingleBtn: "🔥 單次鍛造（50 金小判 + 5 玉鋼）",
      forgeTenBtn: "✨ 十連必中鍛造（500 金小判 + 50 玉鋼）",
      forgeRatesTitle: "📜 淬火銘刻機率：",
      forgeRate1: "凡鐵 60%",
      forgeRate2: "業物 25%",
      forgeRate3: "良業物 10%",
      forgeRate4: "大業物 4%",
      forgeRate5: "天下五劍 / 妖刀 1%",
      sharpenSectionTitle: "🪨 砥石研磨（提升裝備中名刀刃度）",
      sharpenRough: "荒砥研磨 (+5 攻)",
      sharpenMid: "中砥研磨 (+15 攻)",
      sharpenFine: "仕上砥研磨 (+40 攻, +1% 會心)",
      ownedCount: "持有:",

      // 道場介面
      dojoTitle: "⛩️ 古流劍術・道場修業",
      dojoPoints: "剩餘天賦點數:",
      dojoResetBtn: "🔄 洗鍊天賦（消耗 100 金小判）",
      skillUpgradeBtn: "修練升級 (+1)",

      // 行囊介面
      invSwordsTab: "🗡️ 佩刀庫存",
      invMaterialsTab: "💎 鍛石素材",
      invItemsTab: "🍱 口糧藥物",
      btnEquip: "配備",
      btnEquipped: "已佩戴",
      btnSmelt: "熔煉回收",
      btnUse: "使用",

      // 圖鑑介面
      codexTitle: "📖 扶桑名刀銘鑑",
      codexProgress: "已收藏名刀：",
      codexLockedName: "？？？？（未解鎖）",
      codexLockedTip: "討伐戰國頭目或於鍛冶屋行淬火秘鍛，以解鎖此名刃銘鑑傳承。",
      codexBonus: "✨ 銘鑑之證：全武士體力 +30，攻擊力 +5",
      codexSmith: "刀工：",
      codexEra: "時代：",
      codexMaster: "傳承名將：",
      codexHamon: "刃文樣式：",

      // 浪人茶屋
      teahouseTitle: "🏮 浪人茶屋・意見交流處",
      teahouseNotice: "「一杯濁酒，幾句豪情。天涯浪人過客，皆可在此留墨交流，暢所欲言。」",
      teahouseFormTitle: "🖋️ 撰寫浪人墨寶",
      teahouseAuthorHolder: "尊姓大名（例：近藤勇、迷途旅人）",
      teahouseTypeAdvice: "💡 遊戲建議與新刀構想",
      teahouseTypeBug: "⚠️ 異常狀況反映",
      teahouseTypePraise: "🌸 心得體會與閒聊",
      teahouseContentHolder: "請在此揮毫寫下您的想法或建言...",
      teahouseSubmitBtn: "📮 寄送墨寶至茶屋",
      teahouseLoading: "茶屋墨寶加載中...",
      teahouseFilterAll: "全部",
      teahouseFilterAdvice: "💡 建議",
      teahouseFilterBug: "⚠️ 異常",
      teahouseFilterPraise: "🌸 閒聊",

      // 存檔與設定
      settingsTitle: "⚙️ 修行存檔與設定",
      settingsLangTitle: "🌐 語言切換 / Language / 言語",
      saveExportBtn: "📋 複製存檔代碼",
      saveImportBtn: "📥 讀取存檔代碼",
      saveResetBtn: "⚠️ 重置修行進度",
      saveAutoNotice: "本遊戲每 30 秒自動於瀏覽器本地進行存檔，無須擔心修行丟失。",
      audioBgm: "🎵 背景雅樂",
      audioSfx: "⚔️ 拔刀音效",

      // 故事繪卷介面
      storyBannerTitle: "📜 命運分歧繪卷",
      storyFactionChoiceTitle: "⚔️ 命運分歧抉擇（第三幕解鎖）",
      storyChoiceNotice: "「天下大勢，分道揚鑣。汝之佩刀，將為誰而揮斬？」",
      storyActsTimelineTitle: "🗺️ 七大幕行軍軌跡",
      storyEndingsTitle: "🏆 終局傳承圖錄（輪迴集齊）",
      storyEndingLocked: "【終局封印中】通關第七幕並完成宿命以解鎖",

      // 轉生神龕介面
      prestigeBannerTitle: "🌀 劍心輪迴・宿命轉生神龕",
      prestigeAltarTitle: "⛩️ 輪迴永久天賦神龕（Prestige Perks）",
      prestigeRebirthBtn: "🌀 斬斷因果・發動劍心輪迴",
      prestigeWarning: "⚠️ 轉生將重置等級與區域進度（可重新抉擇命運陣營），永久保留所有名刀、圖鑑、魂火與神龕天賦！",
      prestigeCurrentKarma: "當前持有魂火:",
      prestigeTotalRebirths: "輪迴轉生次數:",
      prestigeExpectedKarma: "本次轉生預計獲得魂火:",
      perkUpgradeBtn: "供奉魂火 (+1)",
      perkMaxLevel: "已臻至高境界",

      // 彈窗
      modalConfirm: "確認",
      modalClose: "閉合",
      modalReincarnate: "入道輪迴",
      offlineTitle: "💤 離線浪人修業報告",
      offlineDesc: "在你休憩之際，浪人憑藉劍心意志持續行俠斬寇：",
      forgeModalTitle: "✨ 淬火出爐！",

      // 系統提示
      msgWeaponNeeded: "請先配備名刀！",
      msgWhetstoneNeeded: "磨刀石不足！",
      msgForgeLackRes: "鍛造資源不足！需要 {steel} 玉鋼與 {gold} 金小判。",
      msgEquippedCantSmelt: "無法熔煉當前裝備中的佩刀！請先更換其他刀刃。",
      msgSkillPointsLack: "天賦點數不足！請通過歷練提升角色等級獲取點數。",
      msgResetSkillConfirm: "是否花費 100 金小判洗鍊重置所有流派天賦點？",
      msgGoldLack100: "金小判不足 100！",
      msgZoneLocked: "該戰役區域尚未解鎖！請先擊破前一區域的守關頭目。",
      msgSaveCopied: "✅ 存檔代碼已成功複製至剪貼簿！可妥善保管。",
      msgSaveLoaded: "✅ 存檔匯入成功！即將重新載入遊戲。",
      msgSaveInvalid: "❌ 存檔格式不正確或代碼無效！",
      msgResetGameWarning: "⚠️ 警告：確定要重置所有遊戲進度嗎？所有刀劍、劍理與玉鋼將重歸虛無！",
      msgResetGameFinal: "最後確認：真的要重新開始修行？",
      msgFactionChosen: "📜 【天命立誓】\n你已投身【{name}】！\n\n信念：{sub}\n專屬庇佑：{passive}",
      msgPrestigeLocked: "🌀 劍心尚未歷練圓滿！需要達到等級 15 或通過第 3 幕（京都三條）方可發動劍心輪迴。",
      msgPrestigeConfirm: "🌀 確定要進行劍心輪迴轉生嗎？\n\n・本次將獲得：{karma} 點輪迴魂火\n・等級與關卡將重置，可重新選擇陣營分歧\n・所有名刀、圖鑑與神龕天賦將完整保留！",
      msgPrestigeSuccess: "✨ 轉生成功！\n已獲得 {karma} 點輪迴魂火！\n您現在可以在【劍心轉生】分頁點選強大的永久天賦神龕！",
      msgPerkMax: "此輪迴天賦已修煉至至高大圓滿階級！",
      msgKarmaLack: "輪迴魂火不足！需要 {cost} 點魂火，當前持有 {owned} 點。",

      // 故事與音效 UI
      btnVowFaction: "立誓投身此道",
      storyStatusCompleted: "✅ 已突破",
      storyStatusCurrent: "⚔️ 討伐中",
      storyStatusLocked: "🔒 未開闢",
      endingLockedTitle: "【未勘破之歷史迷霧】",
      endingLockedTag: "達成第 7 幕特定陣營終局解鎖",
      endingLockedDesc: "需於本幕或轉生後選擇相應命運路線，並在江戶天守閣擊破天下無雙。",
      endingRewardKarma: "輪迴魂火",
      endingHeaderHistoryClue: "🏮 【{name}專屬歷史線索】",
      settingSoundOn: "🔊 音效：開啟",
      settingSoundOff: "🔇 音效：靜音",
      settingSoundShort: "音效",
      soundToggleTip: "音效開關"
    },

    "en": {
      // Title & Brand
      gameTitle: "🗡️ Peerless Kenshin",
      gameSubtitle: "Blade of the Samurai・Idle RPG",
      docTitle: "Peerless Kenshin: Blade of the Samurai - Idle RPG",

      // Resources
      resGold: "🪙 Koban",
      resSteel: "💎 Tamahagane",
      resKarma: "🌀 Karma Embers",
      resGoldTip: "Gold Koban (Obtained from defeats and smelting, used for smithing and sharpening)",
      resSteelTip: "Tamahagane (Traditional pure steel, core material for forging and enhancing blades)",
      resKarmaTip: "Karma Embers (Obtained through Reincarnation, used to unlock permanent altar perks)",

      // Character & Banner
      charExpLabel: "Mastery:",
      statAtk: "ATK",
      statDef: "DEF",
      statCrit: "CRIT",
      statCritDmg: "CRIT DMG",
      statSpeed: "Speed",
      statPen: "Armor Pen",
      statPerSec: "/s",
      equipTierDefault: "Common",

      // Navigation Tabs
            tabAchievements: "🏆 Achievements",
      achTitle: "🏆 Samurai Hall of Achievements",
      achSub: "Immortalize your martial deeds across your journey to claim Gold, Tamahagane, and Karma Embers!",
      achProgressLabel: "Achievements Unlocked:",
      achFilterAll: "All",
      achFilterCombat: "⚔️ Combat",
      achFilterSwords: "🗡️ Swordsmith",
      achFilterGrowth: "⛩️ Mastery",
      achFilterDestiny: "🌀 Destiny",
      achClaimBtn: "✨ Claim Reward",
      achClaimAllBtn: "🎁 Claim All Completed Rewards",
      achClaimed: "✅ Claimed",
      achInProgress: "In Progress",
      achToastUnlocked: "🏆 Achievement Unlocked!",
      achClaimAllSuccess: "🎉 Claimed {count} achievements! Gained +{gold} Gold, +{steel} Steel, +{karma} Karma!",
      achNoClaimable: "No unclaimed achievements right now!",
      tabBattle: "⚔️ Battle & Trials",
      tabStory: "📜 Destiny Chronicle",
      tabForge: "⚒️ Blade Smithing",
      tabDojo: "⛩️ Dojo Mastery",
      tabPrestige: "🌀 Reincarnation",
      tabInventory: "🎒 Inventory",
      tabCodex: "📖 Sword Codex",
      tabCommunity: "🏮 Ronin Teahouse",
      tabSettings: "⚙️ Settings & Save",

      // Battle Interface
      tapBladeHint: "Tap blade to strike (or enable Godspeed Auto-Slash)",
      zoneSelectLabel: "Campaign Zone:",
      bossChallengeBtn: "👹 Challenge Boss",
      autoSlashLabel: "⚡ Godspeed Auto-Slash",
      combatLogHeader: "⚔️ Battle Chronicle",
      combatLogClear: "Clear",

      // Forge Interface
      forgeTitle: "⚒️ Tatara Master Swordsmith",
      forgeDesc: "Using pure Tamahagane and Gold Koban, fold and forge legendary Japanese blades.",
      forgeSingleBtn: "🔥 Single Forge (50 Koban + 5 Steel)",
      forgeTenBtn: "✨ 10x Consecutive Forge (500 Koban + 50 Steel)",
      forgeRatesTitle: "📜 Quenching Inscription Rates:",
      forgeRate1: "Common Steel 60%",
      forgeRate2: "Sharp Blade (Wazamono) 25%",
      forgeRate3: "Fine Blade (Ryo-Wazamono) 10%",
      forgeRate4: "Great Blade (O-Wazamono) 4%",
      forgeRate5: "Five Heavenly Swords / Mythic 1%",
      sharpenSectionTitle: "🪨 Whetstone Sharpening (Enhance Equipped Katana)",
      sharpenRough: "Arato Sharpen (+5 ATK)",
      sharpenMid: "Nakato Sharpen (+15 ATK)",
      sharpenFine: "Shiageto Sharpen (+40 ATK, +1% CRIT)",
      ownedCount: "Owned:",

      // Dojo Interface
      dojoTitle: "⛩️ Ancient Kenjutsu・Dojo Training",
      dojoPoints: "Available Skill Points:",
      dojoResetBtn: "🔄 Reset Skills (Cost 100 Koban)",
      skillUpgradeBtn: "Train & Upgrade (+1)",

      // Inventory Interface
      invSwordsTab: "🗡️ Katana Arsenal",
      invMaterialsTab: "💎 Forging Materials",
      invItemsTab: "🍱 Rations & Sake",
      btnEquip: "Equip",
      btnEquipped: "Equipped",
      btnSmelt: "Smelt into Steel",
      btnUse: "Consume",

      // Codex Interface
      codexTitle: "📖 Legendary Katana Codex",
      codexProgress: "Swords Collected:",
      codexLockedName: "？？？？ (Locked)",
      codexLockedTip: "Defeat campaign warlords or forge at the smithy to unlock this blade's heritage.",
      codexBonus: "✨ Codex Attunement: All Samurai HP +30, ATK +5",
      codexSmith: "Swordsmith:",
      codexEra: "Era:",
      codexMaster: "Famous Wielder:",
      codexHamon: "Hamon Pattern:",

      // Teahouse Interface
      teahouseTitle: "🏮 Ronin Teahouse・Message Board",
      teahouseNotice: "A bowl of sake, heartfelt words. Drifters and warriors alike may leave their mark here.",
      teahouseFormTitle: "🖋️ Inscribe Your Message",
      teahouseAuthorHolder: "Your Name or Title (e.g., Kondo Isami, Wandering Swordsman)",
      teahouseTypeAdvice: "💡 Gameplay Feedback & Ideas",
      teahouseTypeBug: "⚠️ Bug Report",
      teahouseTypePraise: "🌸 Impressions & Chat",
      teahouseContentHolder: "Share your thoughts or recommendations here...",
      teahouseSubmitBtn: "📮 Post to Teahouse",
      teahouseLoading: "Loading teahouse messages...",
      teahouseFilterAll: "All",
      teahouseFilterAdvice: "💡 Feedback",
      teahouseFilterBug: "⚠️ Bugs",
      teahouseFilterPraise: "🌸 Chat",

      // Settings Interface
      settingsTitle: "⚙️ Game Save & Preferences",
      settingsLangTitle: "🌐 Language / 語言切換 / 言語",
      saveExportBtn: "📋 Export Save Code",
      saveImportBtn: "📥 Import Save Code",
      saveResetBtn: "⚠️ Wipe All Progress",
      saveAutoNotice: "Game automatically saves every 30 seconds to local storage. Your progress is secure.",
      audioBgm: "🎵 Traditional Gagaku BGM",
      audioSfx: "⚔️ Katana Slash SFX",

      // Story Interface
      storyBannerTitle: "📜 Destiny Chronicle & Factions",
      storyFactionChoiceTitle: "⚔️ Align with a Faction (Unlocks at Act 3)",
      storyChoiceNotice: "The realm stands at a crossroads. For what ideal shall your blade strike?",
      storyActsTimelineTitle: "🗺️ Seven Acts of the Bakumatsu",
      storyEndingsTitle: "🏆 Grand Endings Chronicle",
      storyEndingLocked: "【Locked】Clear Act 7 and complete your destiny to unlock",

      // Prestige Interface
      prestigeBannerTitle: "🌀 Sword Soul Reincarnation (Prestige)",
      prestigeAltarTitle: "⛩️ Reincarnation Altar Perks",
      prestigeRebirthBtn: "🌀 Sever Karma・Initiate Reincarnation",
      prestigeWarning: "⚠️ Reincarnation resets Level and Zone (allowing you to choose a new faction path), but permanently keeps all swords, codex, Karma, and Altar perks!",
      prestigeCurrentKarma: "Current Karma Embers:",
      prestigeTotalRebirths: "Rebirths Completed:",
      prestigeExpectedKarma: "Karma to be gained upon rebirth:",
      perkUpgradeBtn: "Offer Karma (+1)",
      perkMaxLevel: "Mastered to Pinnacle",

      // Modals
      modalConfirm: "Confirm",
      modalClose: "Close",
      modalReincarnate: "Reincarnate",
      offlineTitle: "💤 Offline Ronin Meditation",
      offlineDesc: "While you were away, your martial spirit continued to vanquish foes:",
      forgeModalTitle: "✨ Blade Quenched!",

      // Alerts & Confirms
      msgWeaponNeeded: "Please equip a katana first!",
      msgWhetstoneNeeded: "Insufficient whetstones!",
      msgForgeLackRes: "Insufficient resources! Requires {steel} Tamahagane and {gold} Koban.",
      msgEquippedCantSmelt: "Cannot smelt currently equipped weapon! Please equip another katana first.",
      msgSkillPointsLack: "Insufficient skill points! Level up through battle to gain points.",
      msgResetSkillConfirm: "Spend 100 Gold Koban to reset all dojo skill points?",
      msgGoldLack100: "Not enough Koban (100 required)!",
      msgZoneLocked: "This zone is not yet unlocked! Defeat the boss of the previous area first.",
      msgSaveCopied: "✅ Save code copied to clipboard! Keep it safe.",
      msgSaveLoaded: "✅ Save imported successfully! Reloading game...",
      msgSaveInvalid: "❌ Invalid save data or corrupt code!",
      msgResetGameWarning: "⚠️ WARNING: Are you sure you want to reset all game data? All blades and progress will be lost!",
      msgResetGameFinal: "Final Confirmation: Truly start your journey from zero?",
      msgFactionChosen: "📜 【Destiny Vow】\nYou have pledged allegiance to 【{name}】!\n\nIdeal: {sub}\nBlessing: {passive}",
      msgPrestigeLocked: "🌀 Your sword heart has not yet matured! Reach Level 15 or clear Act 3 (Kyoto Sanjo) to trigger Reincarnation.",
      msgPrestigeConfirm: "🌀 Are you sure you wish to reincarnate?\n\n・You will gain: {karma} Karma Embers\n・Level and zones reset, allowing a new story path\n・All swords, codex, and permanent perks are retained!",
      msgPrestigeSuccess: "✨ Reincarnation Complete!\nGained {karma} Karma Embers!\nYou can now empower permanent perks in the Reincarnation tab!",
      msgPerkMax: "This perk has reached its maximum level!",
      msgKarmaLack: "Insufficient Karma Embers! Requires {cost} Embers, currently holding {owned}.",

      // Story & Sound UI
      btnVowFaction: "Vow to this Path",
      storyStatusCompleted: "✅ Cleared",
      storyStatusCurrent: "⚔️ In Battle",
      storyStatusLocked: "🔒 Locked",
      endingLockedTitle: "【Veil of History Unbroken】",
      endingLockedTag: "Unlock by clearing Act 7 with this faction",
      endingLockedDesc: "Pledge to this path in Act 3 and defeat the Peerless Swordmaster at Edo Castle Keep.",
      endingRewardKarma: "Karma",
      endingHeaderHistoryClue: "🏮 【{name} Lore Clue】",
      settingSoundOn: "🔊 Sound: Enabled",
      settingSoundOff: "🔇 Sound: Muted",
      settingSoundShort: "Sound",
      soundToggleTip: "Toggle Sound"
    },

    "ja": {
      // タイトル＆ブランド
      gameTitle: "🗡️ 無双剣心",
      gameSubtitle: "侍の刃・放置RPG",
      docTitle: "『無双剣心：侍の刃』- 和風名刀放置RPG",

      // 通貨資源
      resGold: "🪙 金小判",
      resSteel: "💎 玉鋼",
      resKarma: "🌀 魂火",
      resGoldTip: "金小判（敵討伐や熔錬で入手、鍛造や研磨に使用）",
      resSteelTip: "たたら玉鋼（名刀鍛造と強化に必須の至高鋼材）",
      resKarmaTip: "輪廻魂火（剣心転生で獲得、永久神龕天賦の強化に使用）",

      // キャラクター＆ステータス
      charExpLabel: "剣理:",
      statAtk: "攻撃力",
      statDef: "防御力",
      statCrit: "会心率",
      statCritDmg: "会心ダメ",
      statSpeed: "抜刀速度",
      statPen: "破甲貫通",
      statPerSec: "回/秒",
      equipTierDefault: "凡鉄",

      // ナビゲーションタブ
            tabAchievements: "🏆 栄誉実績",
      achTitle: "🏆 侍の栄誉実績殿堂",
      achSub: "果てなき剣道の旅路にて不朽の武勲を刻み、小判・玉鋼・輪廻魂火を受け取れ！",
      achProgressLabel: "実績達成進捗:",
      achFilterAll: "全て",
      achFilterCombat: "⚔️ 討伐武勲",
      achFilterSwords: "🗡️ 名刀鍛冶",
      achFilterGrowth: "⛩️ 剣道境界",
      achFilterDestiny: "🌀 天命輪廻",
      achClaimBtn: "✨ 報酬受取",
      achClaimAllBtn: "🎁 達成報酬を一括受取",
      achClaimed: "✅ 受取済",
      achInProgress: "進行中",
      achToastUnlocked: "🏆 実績達成！",
      achClaimAllSuccess: "🎉 {count} 個の実績報酬を受け取りました！小判 +{gold}、玉鋼 +{steel}、魂火 +{karma} 獲得！",
      achNoClaimable: "現在受け取り可能な実績報酬はありません！",
      tabBattle: "⚔️ 討伐修練",
      tabStory: "📜 運命絵巻",
      tabForge: "⚒️ 名刀鍛冶",
      tabDojo: "⛩️ 流派奥義",
      tabPrestige: "🌀 剣心転生",
      tabInventory: "🎒 荷物・装備",
      tabCodex: "📖 名刀鑑賞",
      tabCommunity: "🏮 浪人茶屋",
      tabSettings: "⚙️ 修業記録",

      // 戦闘画面
      tapBladeHint: "名刀をタップして一閃（または神速自動斬りを起動）",
      zoneSelectLabel: "討伐地域：",
      bossChallengeBtn: "👹 エリアボス決戦",
      autoSlashLabel: "⚡ 神速自動斬り",
      combatLogHeader: "⚔️ 抜刀戦闘実録",
      combatLogClear: "消去",

      // 鍛冶屋画面
      forgeTitle: "⚒️ たたら秘伝・名刀鍛冶処",
      forgeDesc: "純粋なる玉鋼と金小判を用い、古式折り返し鍛錬で伝説の名刀を打ち出す。",
      forgeSingleBtn: "🔥 単発鍛造（50 金小判 + 5 玉鋼）",
      forgeTenBtn: "✨ 十連鍛造（500 金小判 + 50 玉鋼）",
      forgeRatesTitle: "📜 焼き入れ銘刻確率：",
      forgeRate1: "凡鉄 60%",
      forgeRate2: "業物 25%",
      forgeRate3: "良業物 10%",
      forgeRate4: "大業物 4%",
      forgeRate5: "天下五剣 / 神話妖刀 1%",
      sharpenSectionTitle: "🪨 砥石研磨（装備中名刀の刃付け強化）",
      sharpenRough: "荒砥研磨 (+5 攻撃)",
      sharpenMid: "中砥研磨 (+15 攻撃)",
      sharpenFine: "仕上砥研磨 (+40 攻撃, +1% 会心)",
      ownedCount: "所持:",

      // 道場画面
      dojoTitle: "⛩️ 古流剣術・道場修業",
      dojoPoints: "残り修業ポイント:",
      dojoResetBtn: "🔄 奥義リセット（100 小判消費）",
      skillUpgradeBtn: "修練強化 (+1)",

      // 荷物・装備画面
      invSwordsTab: "🗡️ 佩刀一覧",
      invMaterialsTab: "💎 鍛冶素材",
      invItemsTab: "🍱 兵糧・地酒",
      btnEquip: "装備",
      btnEquipped: "装備中",
      btnSmelt: "熔錬還元",
      btnUse: "使用",

      // 名刀図鑑画面
      codexTitle: "📖 扶桑名刀銘鑑",
      codexProgress: "収集済み名刀：",
      codexLockedName: "？？？？（未解禁）",
      codexLockedTip: "戦国武将を討伐するか、鍛冶屋で秘伝鍛造を行い名刃の銘を解き放て。",
      codexBonus: "✨ 銘鑑の加護：侍全員の最大HP+30、攻撃力+5",
      codexSmith: "刀工：",
      codexEra: "時代：",
      codexMaster: "伝承名将：",
      codexHamon: "刃文様式：",

      // 浪人茶屋
      teahouseTitle: "🏮 浪人茶屋・意見交流処",
      teahouseNotice: "「濁酒一杯、熱き想い。旅路の浪人よ、気兼ねなく墨痕を留め言葉を交わされよ。」",
      teahouseFormTitle: "🖋️ 茶屋の書き置き",
      teahouseAuthorHolder: "お名前・二つ名（例：近藤勇、放浪の剣客）",
      teahouseTypeAdvice: "💡 助言・名刀の着想",
      teahouseTypeBug: "⚠️ 不具合・異常報告",
      teahouseTypePraise: "🌸 感想・雑談",
      teahouseContentHolder: "ご意見やご感想をご自由にお書きください...",
      teahouseSubmitBtn: "📮 茶屋に筆跡を投函",
      teahouseLoading: "茶屋の書き置きを読み込み中...",
      teahouseFilterAll: "全て",
      teahouseFilterAdvice: "💡 助言",
      teahouseFilterBug: "⚠️ 不具合",
      teahouseFilterPraise: "🌸 雑談",

      // 設定・セーブ
      settingsTitle: "⚙️ 修業記録と設定",
      settingsLangTitle: "🌐 言語切替 / Language / 語言",
      saveExportBtn: "📋 セーブコード書き出し",
      saveImportBtn: "📥 セーブコード読み込み",
      saveResetBtn: "⚠️ 修業の完全リセット",
      saveAutoNotice: "本ゲームは30秒ごとにブラウザへ自動保存されます。安心して修業に励んでください。",
      audioBgm: "🎵 和風雅楽BGM",
      audioSfx: "⚔️ 抜刀・斬撃効果音",

      // 運命絵巻画面
      storyBannerTitle: "📜 運命分岐絵巻",
      storyFactionChoiceTitle: "⚔️ 運命の陣営選択（第三幕で解禁）",
      storyChoiceNotice: "「天下大勢、岐路に立つ。汝の刃は、誰が為に振るわれるか？」",
      storyActsTimelineTitle: "🗺️ 幕末七大幕の軌跡",
      storyEndingsTitle: "🏆 歴代終局伝承録（輪廻制覇）",
      storyEndingLocked: "【終局未開放】第七幕を踏破し宿命を全うして解禁せよ",

      // 転生画面
      prestigeBannerTitle: "🌀 剣心輪廻・宿命転生神龕",
      prestigeAltarTitle: "⛩️ 輪廻永久天賦神龕（Prestige Perks）",
      prestigeRebirthBtn: "🌀 因果を断つ・剣心輪廻発動",
      prestigeWarning: "⚠️ 転生を行うとレベルと進行地域は初期化されますが（別陣営を選び直せます）、全所持名刀・図鑑・魂火・神龕天賦は永続的に継承されます！",
      prestigeCurrentKarma: "現在所持魂火:",
      prestigeTotalRebirths: "輪廻転生回数:",
      prestigeExpectedKarma: "今回の転生で獲得できる魂火:",
      perkUpgradeBtn: "魂火を奉納 (+1)",
      perkMaxLevel: "極致の境地に到達",

      // ダイアログ・モーダル
      modalConfirm: "確認",
      modalClose: "閉じる",
      modalReincarnate: "輪廻の道へ",
      offlineTitle: "💤 瞑想・離線修練報告",
      offlineDesc: "あなたが休息の間も、宿命の剣心は敵勢を討ち払い続けました：",
      forgeModalTitle: "✨ 鍛え上がり！",

      // システム通知・確認
      msgWeaponNeeded: "まず名刀を装備してください！",
      msgWhetstoneNeeded: "砥石が不足しています！",
      msgForgeLackRes: "鍛造素材が不足しています！玉鋼 {steel} 個と金小判 {gold} 両が必要です。",
      msgEquippedCantSmelt: "現在装備中の佩刀は熔錬できません！別の刀を装備してください。",
      msgSkillPointsLack: "修業ポイントが不足しています！討伐でレベルを上げて獲得してください。",
      msgResetSkillConfirm: "金小判 100 両を消費して流派奥義をリセットしますか？",
      msgGoldLack100: "金小判が足りません（100 両必要）！",
      msgZoneLocked: "この戦役地域は未解禁です！前エリアの守護頭目を討伐してください。",
      msgSaveCopied: "✅ セーブコードをクリップボードに写し取りました！大切に保管してください。",
      msgSaveLoaded: "✅ セーブデータの読み込みに成功しました！再読み込みします。",
      msgSaveInvalid: "❌ セーブコードが無効か破損しています！",
      msgResetGameWarning: "⚠️ 警告：本当にすべての修業記録を破棄しますか？すべての名刀と剣理が虚無へと帰します！",
      msgResetGameFinal: "最終確認：本当に最初から修業をやり直しますか？",
      msgFactionChosen: "📜 【天命の誓い】\nあなたは【{name}】に身を投じました！\n\n信念：{sub}\n加護：{passive}",
      msgPrestigeLocked: "🌀 まだ剣心の修練が満ちていません！レベル 15 に達するか第3幕（京都三条）を踏破して輪廻を解禁してください。",
      msgPrestigeConfirm: "🌀 剣心輪廻・宿命転生を行いますか？\n\n・獲得魂火：{karma} 点\n・レベルと地域は初期化され、別の陣営を選択可能になります\n・すべての名刀、図鑑、神龕天賦は失われません！",
      msgPrestigeSuccess: "✨ 転生成就！\n魂火 {karma} 点を獲得しました！\n【剣心転生】画面で永久天賦神龕を強化できます！",
      msgPerkMax: "この神龕天賦はすでに極限まで鍛え上げられています！",
      msgKarmaLack: "魂火が不足しています！{cost} 点必要ですが、現在 {owned} 点です。",

      // 故事與音效 UI
      btnVowFaction: "この道に誓いを立てる",
      storyStatusCompleted: "✅ 突破済",
      storyStatusCurrent: "⚔️ 討伐中",
      storyStatusLocked: "🔒 未開放",
      endingLockedTitle: "【未だ見ぬ歴史の霧】",
      endingLockedTag: "第7幕特定陣営クリアで開放",
      endingLockedDesc: "この運命路線を選び、江戸天守にて天下無双を撃破せよ。",
      endingRewardKarma: "魂火",
      endingHeaderHistoryClue: "🏮 【{name}専用歴史の手がかり】",
      settingSoundOn: "🔊 効果音：有効",
      settingSoundOff: "🔇 効果音：消音",
      settingSoundShort: "効果音",
      soundToggleTip: "効果音の切替"
    }
  },

  // 陣営ローカライズ
  factions: {
    unaligned: {
      "zh-TW": { name: "無宿浪人", sub: "隨波逐流・孤劍問心", desc: "尚未立誓加入任何勢力，僅憑腰間一把竹光與對至高劍道的嚮往，在戰國與幕末的亂世夾縫中獨行。", passiveDesc: "無特殊陣營加成" },
      "en": { name: "Masterless Ronin", sub: "Wandering Drifter: The Solitary Blade", desc: "Unbound by lord or faction, traversing the turbulent era with a humble bamboo blade and an earnest martial heart.", passiveDesc: "No faction blessing active." },
      "ja": { name: "宿無き浪人", sub: "波に漂い・孤剣に問う", desc: "いかなる勢力にも仕えず、腰の一振りの竹光と至高の剣道への志のみを胸に乱世を歩む。", passiveDesc: "陣営固有の加護なし。" }
    },
    shogunate: {
      "zh-TW": { name: "佐幕・誠之忠道", sub: "天下泰平・守護德川與新選組之誓", desc: "尊崇德川幕府百年泰平之基業，立身於近藤勇與土方歲三的新選組麾下。以『誠』字大旗為信念，誓死捍衛京都與江戶之安寧。", passiveDesc: "【誠之忠魂】：最大體力 +35%、防禦力 +30%、首領傷害減免 15%" },
      "en": { name: "Shogunate Loyalist", sub: "Pax Tokugawa: Vow of the Shinsengumi", desc: "Honoring centuries of Tokugawa stability beneath the banner of 'Makoto' (Sincerity) alongside Kondo Isami and Hijikata Toshizo.", passiveDesc: "【Soul of Makoto】: Max HP +35%, DEF +30%, Boss DMG Reduction 15%" },
      "ja": { name: "佐幕・誠の忠道", sub: "天下泰平・徳川と新選組の誓い", desc: "徳川二百年の天下泰平を尊び、新選組の旗印『誠』の下に集う。命を賭して都の治安と武士の誇りを守り抜く。", passiveDesc: "【誠の忠魂】：最大HP+35%、防御力+30%、ボス被ダメージ15%軽減" }
    },
    ishin: {
      "zh-TW": { name: "尊皇・倒幕維新", sub: "天下一新・追隨坂本龍馬開創新時代", desc: "面對黑船來航的西方衝擊，決意打破舊幕府之陳腐枷鎖。與坂本龍馬、長州薩摩志士締結同盟，為迎接文明與自由的新日本拔刀！", passiveDesc: "【維新烈火】：攻擊力 +35%、拔刀速度 +20%、戰鬥金小判獲取 +35%" },
      "en": { name: "Imperial Restorationist", sub: "New Era: Revolution with Sakamoto Ryoma", desc: "Challenging outdated feudal chains in the wake of the Black Ships. Standing with Sakamoto Ryoma and Satsuma-Choshu patriots to forge a modern Japan.", passiveDesc: "【Restoration Blaze】: ATK +35%, Attack Speed +20%, Koban Drops +35%" },
      "ja": { name: "尊皇・倒幕維新", sub: "天下一新・坂本龍馬と共に創る新時代", desc: "黒船来航の激震を受け、腐朽した旧幕府の因習を打破する。坂本龍馬や倒幕志士と共に、新時代の黎明を切り拓く。", passiveDesc: "【維新の烈火】：攻撃力+35%、抜刀速度+20%、小判獲得量+35%" }
    },
    shura: {
      "zh-TW": { name: "修羅・妖刀劍鬼", sub: "萬物皆斬・墮入人劍合一之無間極致", desc: "厭倦了世俗凡人的政爭旗號，只信奉手中冰冷之刃。與千子村正、妖刀村雨共鳴，化身為踏破神魔、見敵必斬之無雙修羅。", passiveDesc: "【血染狂瀾】：會心傷害 +75%、破甲穿透 +40%、神速自律斬頻率 +30%" },
      "en": { name: "Shura Bloodfiend", sub: "Sever All: The Infinite Carnage of the Blade", desc: "Spurning political slogans for the unyielding edge of cold steel. Resonating with cursed Muramasa blades to become an unstoppable demon of war.", passiveDesc: "【Blood Tempest】: CRIT DMG +75%, Armor Pen +40%, Auto-Slash Speed +30%" },
      "ja": { name: "修羅・妖刀剣鬼", sub: "万物皆斬・人剣一体の無間へと堕つ", desc: "権力者の大義名分を断ち切り、ただ冷たい白刃の力のみを信じる。妖刀村正と共鳴し、敵ある処すべてを斬り伏せる修羅と化す。", passiveDesc: "【血染の狂瀾】：会心ダメージ+75%、破甲貫通+40%、自動斬撃速度+30%" }
    }
  },

  // 8 大轉生神龕天賦
  prestigePerks: {
    perk_atk: {
      "zh-TW": { name: "武神氣脈", desc: "喚醒先祖劍聖之殺伐神力，永久提升全域基礎攻擊力 +15%/級。" },
      "en": { name: "War God Veins", desc: "Awaken ancestral swordmaster blood, permanently granting +15% Base ATK per level." },
      "ja": { name: "武神気脈", desc: "先祖たる剣聖の力を呼び覚まし、基礎攻撃力を永久に +15%/Lv 強化する。" }
    },
    perk_hp: {
      "zh-TW": { name: "金剛體魄", desc: "如不壞金剛身，永久提升武士最大體力上限 +20%/級。" },
      "en": { name: "Adamantine Body", desc: "Temper an unbreakable physique, permanently granting +20% Max HP per level." },
      "ja": { name: "金剛体躯", desc: "金剛不壊の肉体を得て、最大HPを永久に +20%/Lv 増加させる。" }
    },
    perk_speed: {
      "zh-TW": { name: "神速極意", desc: "超越肉身極限的居合拔刀術，永久提升拔刀速度與神速自律斬擊頻率 +8%/級。" },
      "en": { name: "Godspeed Mastery", desc: "Transcend physical limits with lightning Iaido, granting +8% Attack Speed per level." },
      "ja": { name: "神速極意", desc: "限界を超える居合抜刀術。抜刀速度と神速自動斬りを永久に +8%/Lv 向上させる。" }
    },
    perk_crit: {
      "zh-TW": { name: "天眼心眼", desc: "心眼洞徹萬物破綻，永久提升會心率 +2%/級、會心傷害 +15%/級。" },
      "en": { name: "Mind's Eye", desc: "Perceive all defensive flaws, granting +2% CRIT Rate and +15% CRIT DMG per level." },
      "ja": { name: "天眼心眼", desc: "万物の隙を見抜く心眼。会心率を +2%/Lv、会心ダメージを +15%/Lv 永久強化する。" }
    },
    perk_forge: {
      "zh-TW": { name: "踏鞴神佑", desc: "承蒙金屋子神金匠之眷顧，永久降低名刀鍛造與淬火研磨消耗 8%/級。" },
      "en": { name: "Tatara Blessing", desc: "Favored by Kanayago-kami, reduces smithing and sharpening resource costs by 8% per level." },
      "ja": { name: "たたら神佑", desc: "金屋子神の加護を受け、刀剣の鍛造・研磨消費コストを永久に 8%/Lv 軽減する。" }
    },
    perk_wealth: {
      "zh-TW": { name: "戰場掠奪", desc: "斬殺敵將之餘搜羅繳獲，討伐獲得金小判與玉鋼收益永久 +20%/級。" },
      "en": { name: "Battlefield Spoils", desc: "Scavenge battlefield trophies, permanently increasing Gold and Steel yields by +20% per level." },
      "ja": { name: "戦場強奪", desc: "敵将を討ち取り戦利品を回収。獲得小判と玉鋼を永久に +20%/Lv 増加させる。" }
    },
    perk_wisdom: {
      "zh-TW": { name: "宿命通透", desc: "劍心宿命通達無礙，每次輪迴轉生之初始等級 +2 級（最高以 31 級起步）。" },
      "en": { name: "Destiny Insight", desc: "Past sword lives awaken instantly, starting each reincarnation +2 levels higher (up to Lv.31)." },
      "ja": { name: "宿命通透", desc: "剣心の悟りにより、転生直後の初期レベルを +2 Lv 永続的に引き上げる（最大Lv31開始）。" }
    },
    perk_boss_slayer: {
      "zh-TW": { name: "修羅斬鬼", desc: "針對首領頭目與強大武將造成之所有傷害永久額外提升 +25%/級。" },
      "en": { name: "Demon God Slayer", desc: "Channel wrath against warlords and bosses, dealing +25% extra damage per level." },
      "ja": { name: "修羅斬鬼", desc: "ボスおよび強敵武将に対する全ダメージを永久に +25%/Lv 増加させる。" }
    }
  },

  // 流派奧義
  dojoSkills: {
    shinkage: {
      "zh-TW": { name: "新陰流・無刀取り", desc: "柳生新陰流極意。以心眼奪白刃，每一級提升 2% 會心率與 5% 會心傷害。" },
      "en": { name: "Shinkage-ryu: Mutodori", desc: "The supreme art of Yagyu kenjutsu. Seize the blade barehanded; +2% CRIT Rate and +5% CRIT DMG per level." },
      "ja": { name: "新陰流・無刀取り", desc: "柳生新陰流の極意。白刃を心眼で制し、Lvごとに会心率+2%、会心ダメージ+5%。" }
    },
    jigen: {
      "zh-TW": { name: "示現流・一之太刀", desc: "薩摩示現流神髓。首斬必殺，每一級提升 5% 基礎攻擊力與 3% 破甲穿透。" },
      "en": { name: "Jigen-ryu: First Strike", desc: "The devastating Satsuma strike. Strike first, strike true; +5% Base ATK and +3% Armor Pen per level." },
      "ja": { name: "示現流・一の太刀", desc: "薩摩示現流の神髄。初太刀必殺、Lvごとに基礎攻撃力+5%、破甲貫通+3%。" }
    },
    rishin: {
      "zh-TW": { name: "天然理心流・荒神體", desc: "新選組實戰劍理。強健身軀不屈不撓，每一級提升 8% 最大體力與 5 點基礎防禦。" },
      "en": { name: "Tennen Rishin-ryu: Fierce Body", desc: "The combat swordplay of the Shinsengumi. Indomitable constitution; +8% Max HP and +5 DEF per level." },
      "ja": { name: "天然理心流・荒神体", desc: "新選組の実戦剣理。不屈の剛体、Lvごとに最大HP+8%、防御力+5。" }
    }
  },

  // 戰役區域與敵人
  zones: {
    1: {
      "zh-TW": { name: "尾張・荒野竹林", sub: "初出茅廬・落魄浪人之歷練", boss: "破戒僧・豪圓", bossTitle: "【第一幕 守門狂僧】" },
      "en": { name: "Owari: Bamboo Wilderness", sub: "Beginner: Trial of the Fallen Ronin", boss: "Fallen Monk Gouen", bossTitle: "【Act I Gatekeeper Monk】" },
      "ja": { name: "尾張・荒野の竹林", sub: "初心・落魄浪人の修業", boss: "破戒僧・豪円", bossTitle: "【第一幕 守門の狂僧】" }
    },
    2: {
      "zh-TW": { name: "伏見・千本鳥居", sub: "紅門幽影・伊賀忍者之刺殺", boss: "甲賀上忍・夜叉丸", bossTitle: "【第二幕 幻影忍魁】" },
      "en": { name: "Fushimi: Thousand Torii Gates", sub: "Crimson Shadows: Iga Ninja Ambush", boss: "Koga Jonin Yashamaru", bossTitle: "【Act II Phantom Shinobi】" },
      "ja": { name: "伏見・千本鳥居", sub: "紅門の幽影・伊賀忍者の刺殺", boss: "甲賀上忍・夜叉丸", bossTitle: "【第二幕 幻影の忍魁】" }
    },
    3: {
      "zh-TW": { name: "京都・三條夜街", sub: "風雲幕末・尊攘志士與壬生狼", boss: "新選組一番隊組長・沖田總司", bossTitle: "【第三幕 天才劍士】" },
      "en": { name: "Kyoto: Sanjo Night District", sub: "Bakumatsu Tempest: Shishi & Mibu Wolves", boss: "Okita Soji (1st Unit Captain)", bossTitle: "【Act III Prodigy Swordsman】" },
      "ja": { name: "京都・三条の夜街", sub: "風雲幕末・尊攘志士と壬生狼", boss: "新選組一番隊組長・沖田総司", bossTitle: "【第三幕 天才剣士】" }
    },
    4: {
      "zh-TW": { name: "池田屋・血染旅籠", sub: "死線拔刀・壬生狼之肅清夜襲", boss: "新選組副長・土方歲三", bossTitle: "【第四幕 鬼之副長】" },
      "en": { name: "Ikedaya: Bloodstained Inn", sub: "Blades Drawn: The Shinsengumi Night Raid", boss: "Hijikata Toshizo (Vice-Commander)", bossTitle: "【Act IV Demon Vice-Commander】" },
      "ja": { name: "池田屋・血染の旅籠", sub: "死線抜刀・壬生狼の夜襲", boss: "新選組副長・土方歳三", bossTitle: "【第四幕 鬼の副長】" }
    },
    5: {
      "zh-TW": { name: "長篠・古戰場魔境", sub: "怨念鐵砲・戰國亡靈武士合戰", boss: "第六天魔王之影・織田信長", bossTitle: "【第五幕 戰國霸王】" },
      "en": { name: "Nagashino: Haunted Battlefield", sub: "Matchlock Specters: Phantom Samurai Host", boss: "Oda Nobunaga (Demon King Phantom)", bossTitle: "【Act V Sengoku Overlord】" },
      "ja": { name: "長篠・古戦場魔境", sub: "怨念の鉄砲・戦国亡霊武士合戦", boss: "第六天魔王の影・織田信長", bossTitle: "【第五幕 戦国の覇王】" }
    },
    6: {
      "zh-TW": { name: "會津・鶴之城決死線", sub: "義烈殉國・白虎隊與會津之魂", boss: "鬼之兵部・會津名將", bossTitle: "【第六幕 孤忠武將】" },
      "en": { name: "Aizu: Tsuruga Castle Final Stand", sub: "Martial Loyalty: Spirit of the Byakkotai", boss: "Demon General Hyobu", bossTitle: "【Act VI Stalwart Commander】" },
      "ja": { name: "会津・鶴ヶ城決死線", sub: "義烈殉国・白虎隊と会津の魂", boss: "鬼の兵部・会津名将", bossTitle: "【第六幕 孤忠の武将】" }
    },
    7: {
      "zh-TW": { name: "箱館・五稜郭星形要塞", sub: "武士道之終幕・最後之武士史詩決戰", boss: "新選組局長・近藤勇（英靈昇華）", bossTitle: "【終幕 誠字武魂】" },
      "en": { name: "Hakodate: Goryokaku Star Fortress", sub: "Curtain Fall: The Last Samurai Epic Showdown", boss: "Kondo Isami (Ascended Hero)", bossTitle: "【Finale Soul of Makoto】" },
      "ja": { name: "箱館・五稜郭星形要塞", sub: "武士道の終幕・最後の武士の決戦", boss: "新選組局長・近藤勇（英霊昇華）", bossTitle: "【終幕 誠の武魂】" }
    }
  },

  // 4 大結局
  endings: {
    ending_shogunate: {
      "zh-TW": { title: "佐幕之誓・孤忠鎮魂", epilogue: "函館北嶺落雪無聲，旗幟上的『誠』字在硝煙中凜然不倒。你與新選組志士戰至最後一刻，雖未能挽救幕府之傾頹，卻以一身傲骨向世人證明何謂真正的武士魂。你的忠烈之名，化作極北星辰，永遠鎮守扶桑之雪嶺。" },
      "en": { title: "Oath of the Shogunate: Solitary Requiem", epilogue: "Silent snow blankets Hakodate. Amidst gunpowder smoke, the banner of 'Makoto' stands unbowed. Standing beside the Shinsengumi to the end, you could not halt history's tide, yet your unyielding spirit proved what a true samurai is. Your name becomes a northern star, watching over the snowy peaks for eternity." },
      "ja": { title: "佐幕の誓い・孤忠鎮魂", epilogue: "函館の北嶺に雪が静かに舞い、硝煙の中、旗印の『誠』は凛として倒れず。新選組の志士と共に最後の瞬間まで戦い抜いた。幕府の落日は止められずとも、その一身の気骨は真の武士の魂を世に知らしめた。その忠義の名は、極北の星となり永久に雪嶺を見守り続ける。" }
    },
    ending_ishin: {
      "zh-TW": { title: "維新之黎明・解佩歸隱", epilogue: "黑船退去，晨曦照亮了江戶改稱為東京的繁華街巷。新時代的蒸汽汽笛宣告著文明開化，而你選擇在無人知曉的清晨，將伴隨一生的佩刀懸於高閣。武士的刀刃結束了殺戮，而這片土地迎來了真正的曙光。" },
      "en": { title: "Dawn of Restoration: Retired Blade", epilogue: "The Black Ships depart as sunrise illuminates the streets of Edo, now rechristened Tokyo. Steam whistles herald the dawn of enlightenment. At daybreak, unseen by the crowd, you place your trusted katana atop a high shelf. The era of the blade gives way to peace, and the land awakens into bright dawn." },
      "ja": { title: "維新の黎明・帯刀解除", epilogue: "黒船は去り、東京と改められた街に新時代の夜明けが訪れる。蒸気機関の汽笛が開化を告げる中、あなたは誰も知らぬ早朝、生涯の佩刀を高閣に収めた。武士の刃は戦いを終え、この日ノ本に真の曙光が満ち溢れた。" }
    },
    ending_shura: {
      "zh-TW": { title: "修羅狂嵐・百鬼夜行", epilogue: "刀鋒飲盡了人間最後一滴血，天地之間唯餘緋紅月色。你早已不再是凡間之軀，而是與妖刀融為一體的斬煞鬼神。無論幕府或維新，在你的無雙霸道面前皆化為塵埃。扶桑百年間，留下了『逢鬼拔刀、神佛皆斬』的永恆狂瀾。" },
      "en": { title: "Shura Tempest: Night Parade of Hundred Demons", epilogue: "Your blade drinks the last drops of human strife; beneath a blood-red moon, you stand alone. Transcending mortality, man and demon blade become one. Shogunate and Empire alike crumble before your peerless dominion. For centuries, folklore speaks of the immortal Shura who severed gods, demons, and destiny alike." },
      "ja": { title: "修羅の狂嵐・百鬼夜行", epilogue: "刃は此の世の血を飲み尽くし、天と地の間には紅き月のみが浮かぶ。もはや人の身を超越したあなたは、妖刀と一体化した斬殺の鬼神と化した。幕府も維新も、その無双の覇道の前には灰燼に帰す。「逢う魔を斬り、神仏をも断つ」——その永劫の狂嵐が語り継がれる。" }
    },
    ending_hermit: window.I18N && window.I18N.endings && window.I18N.endings.ending_wanderer ? window.I18N.endings.ending_wanderer : undefined,
    ending_wanderer: {
      "zh-TW": { title: "清茶洗刃・隱退之鶴", epilogue: "看透了陣營紛爭與天下大勢，你在七幕激鬥後悄然收刀入鞘。在京都郊外落櫻繽紛的茶舍中，你煮上一壺甘泉清茶，倚窗坐看世事變遷。不求功名，不問青史，唯願杯中茶香常在，心如止水。" },
      "en": { title: "Tea & Sheathed Steel: The Crane's Retirement", epilogue: "Having seen through the conflicts of men and the turns of fate, you gently sheath your sword after Seven Acts of battle. In a quiet teahouse amidst falling cherry blossoms outside Kyoto, you brew sweet spring tea and watch the changing world. Desiring neither fame nor legacy, your mind rests calm as still water." },
      "ja": { title: "清茶洗刃・隠遁の鶴", epilogue: "陣営の争いと天下の大勢を見届け、七幕の激戦の末に静かに刀を納めた。京都の郊外、桜舞い散る茶屋にて清らかな湧き水で茶を点て、移ろう世を窓辺から見つめる。功名を求めず、青史に名を残さずとも、心は水鏡の如く澄み渡る。" }
    }
  },

  // 武士稱號
  ranks: {
    1: { "zh-TW": "無宿浪士", "en": "Masterless Ronin", "ja": "宿無き浪士" },
    10: { "zh-TW": "足輕組頭", "en": "Ashigaru Leader", "ja": "足軽組頭" },
    25: { "zh-TW": "直參旗本", "en": "Hatamoto Bannerman", "ja": "直参旗本" },
    45: { "zh-TW": "精銳劍士", "en": "Elite Swordsman", "ja": "精鋭剣士" },
    65: { "zh-TW": "當世劍豪", "en": "Master Kengo", "ja": "当世剣豪" },
    85: { "zh-TW": "一代劍聖", "en": "Legendary Kensei", "ja": "一代剣聖" },
    105: { "zh-TW": "天下無雙・修羅", "en": "Peerless Shura", "ja": "天下無双・修羅" }
  }
};

// ==========================================================
// 輔助函式庫 (Helper API)
// ==========================================================

window.getLang = function() {
  if (window.I18N && window.I18N.currentLang) {
    return window.I18N.currentLang;
  }
  return localStorage.getItem("samurai_lang") || "zh-TW";
};

window.t = function(key, params) {
  const lang = window.getLang();
  const dict = (window.I18N.translations[lang] || window.I18N.translations["zh-TW"]);
  let val = dict[key] !== undefined ? dict[key] : (window.I18N.translations["zh-TW"][key] || key);
  if (params && typeof val === "string") {
    Object.keys(params).forEach(p => {
      val = val.replace(new RegExp(`\{${p}\}`, "g"), params[p]);
    });
  }
  return val;
};

window.getRankTitle = function(level, lang) {
  lang = lang || window.getLang();
  const ranks = window.I18N.ranks;
  let threshold = 1;
  if (level >= 105) threshold = 105;
  else if (level >= 85) threshold = 85;
  else if (level >= 65) threshold = 65;
  else if (level >= 45) threshold = 45;
  else if (level >= 25) threshold = 25;
  else if (level >= 10) threshold = 10;
  return (ranks[threshold] && ranks[threshold][lang]) || ranks[threshold]["zh-TW"] || "無宿浪士";
};

window.getFactionText = function(factionId, lang) {
  lang = lang || window.getLang();
  const f = window.I18N.factions[factionId] || window.I18N.factions.unaligned;
  return (f && f[lang]) ? f[lang] : (f ? f["zh-TW"] : {});
};

window.getPerkText = function(perkId, lang) {
  lang = lang || window.getLang();
  const p = window.I18N.prestigePerks[perkId];
  return (p && p[lang]) ? p[lang] : (p ? p["zh-TW"] : {});
};

window.getDojoText = function(skillKey, lang) {
  lang = lang || window.getLang();
  const s = window.I18N.dojoSkills[skillKey];
  return (s && s[lang]) ? s[lang] : (s ? s["zh-TW"] : {});
};

window.getZoneText = function(zoneId, lang) {
  lang = lang || window.getLang();
  const z = window.I18N.zones[zoneId];
  return (z && z[lang]) ? z[lang] : (z ? z["zh-TW"] : {});
};

window.getEndingText = function(endingId, lang) {
  lang = lang || window.getLang();
  const e = window.I18N.endings[endingId];
  return (e && e[lang]) ? e[lang] : (e ? e["zh-TW"] : {});
};

// 切換語系主控制
window.setLanguage = function(lang) {
  if (!["zh-TW", "en", "ja"].includes(lang)) {
    lang = "zh-TW";
  }
  window.I18N.currentLang = lang;
  try {
    localStorage.setItem("samurai_lang", lang);
  } catch (e) {}

  document.documentElement.lang = lang;

  // 更新所有切換按鈕的選中狀態
  document.querySelectorAll(".lang-btn, .lang-btn-setting").forEach(btn => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // 更新帶有 data-i18n 的靜態文字
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = window.t(key);
  });

  // 更新帶有 data-i18n-html 的靜態內容
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    const key = el.getAttribute("data-i18n-html");
    el.innerHTML = window.t(key);
  });

  // 更新 title 屬性
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    el.setAttribute("title", window.t(key));
  });

  // 更新 placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", window.t(key));
  });

  // 更新 document title
  document.title = window.t("docTitle");

  // 同步更新音效按鈕狀態與文字
  if (typeof window.updateSoundUI === "function") {
    window.updateSoundUI();
  }

  // 若遊戲已實例化，刷新所有動態介面
  if (window.game) {
    if (window.game.updateCharacterUI) window.game.updateCharacterUI();
    if (window.game.updateBattleUI) window.game.updateBattleUI();
    if (window.game.updateInventoryUI) window.game.updateInventoryUI();
    if (window.game.updateForgeUI) window.game.updateForgeUI();
    if (window.game.updateDojoUI) window.game.updateDojoUI();
    if (window.game.updateCodexUI) window.game.updateCodexUI();
    if (window.game.updateStoryUI) window.game.updateStoryUI();
    if (window.game.updatePrestigeUI) window.game.updatePrestigeUI();
  }
};

// 頁面初始化載入預設語系
document.addEventListener("DOMContentLoaded", function() {
  const savedLang = localStorage.getItem("samurai_lang") || "zh-TW";
  window.setLanguage(savedLang);
});


window.I18N.swords = {
  "sword_01": {
    "ja": {
      "name": "無銘竹光",
      "tier": "凡鉄",
      "type": "打刀",
      "smith": "町野鍛冶",
      "era": "江戸初期",
      "master": "宿無き浪士",
      "hamon": "竹節木目（木竹無刃）",
      "passive": "心流神速（無手負担）",
      "passiveDesc": "人剣一体の境地。神速自動斬りを伴い、頻繁なタップ操作から手首を解放する。",
      "lore": "堅い古竹を削って黒漆を塗った稽古刀。浪人たちが真剣を質に入れ、武士の体面を保つため腰に佩びた。"
    },
    "en": {
      "name": "Mumei Takemitsu",
      "tier": "Common Steel",
      "type": "Katana",
      "smith": "Town Blacksmith",
      "era": "Early Edo Period",
      "master": "Masterless Ronin",
      "hamon": "Bamboo Grain (Blunt)",
      "passive": "Godspeed Flow (Zero Strain)",
      "passiveDesc": "Unity of blade and soul. Automated high-frequency slashes relieve wrist strain.",
      "lore": "A practice katana carved from aged bamboo and lacquered black. Impoverished ronin pawned their steel swords and wore takemitsu to preserve samurai honor."
    }
  },
  "sword_02": {
    "ja": {
      "name": "鍛鉄白木刀",
      "tier": "凡鉄",
      "type": "太刀",
      "smith": "鍛冶職人",
      "era": "戦国末期",
      "master": "道場剣術修行者",
      "hamon": "直刃（素鋼平淬）",
      "passive": "素振修業（蓄力斬）",
      "passiveDesc": "毎朝千度の素振りを重ね、抜刀数に応じて基礎攻撃力が徐々に上昇する。",
      "lore": "白樫木に鍛鉄を挟み込んだ稽古刀。柄も鞘も白木の素朴な造りで、道場武士の心身の鍛錬に用いられた。"
    },
    "en": {
      "name": "Shiraki-tou",
      "tier": "Common Steel",
      "type": "Tachi",
      "smith": "Swordsmith Apprentice",
      "era": "Late Sengoku Period",
      "master": "Dojo Trainee",
      "hamon": "Straight Line (Suguha)",
      "passive": "Suburi Training (Charged Slash)",
      "passiveDesc": "Thousands of morning practice swings gradually empower your basic attacks with each strike.",
      "lore": "A training blade crafted from white oak wrapped around resilient forged iron. Unadorned, it serves to hone martial spirit and stamina."
    }
  },
  "sword_03": {
    "ja": {
      "name": "備前長船兼光",
      "tier": "凡鉄",
      "type": "打刀",
      "smith": "備前鍛冶兼光",
      "era": "南北朝時代",
      "master": "地方足軽組頭",
      "hamon": "互の目乱れ",
      "passive": "備前刃風（微風裂甲）",
      "passiveDesc": "攻撃時に対象の防御力を 5% 無視する。",
      "lore": "備前長船派の名工後裔が鍛えた実戦刀。刀身は肉厚で粘り強く、南北朝の動乱で多くの武士に信頼された。"
    },
    "en": {
      "name": "Bizen Osafune Kanemitsu",
      "tier": "Common Steel",
      "type": "Katana",
      "smith": "Bizen Kanemitsu School",
      "era": "Nanboku-cho Period",
      "master": "Ashigaru Squad Leader",
      "hamon": "Gunome Midare",
      "passive": "Bizen Wind (Minor Armor Piercing)",
      "passiveDesc": "Attacks ignore 5% of target defense.",
      "lore": "A practical combat katana forged by successors of the renowned Bizen Osafune school. Durable and hefty, built for battlefield survival."
    }
  },
  "sword_04": {
    "ja": {
      "name": "和泉守兼定",
      "tier": "業物",
      "type": "打刀",
      "smith": "十一代和泉守兼定",
      "era": "幕末・文久年間",
      "master": "新選組副長・土方歳三",
      "hamon": "乱れ刃（沸匂深し）",
      "passive": "局中法度（鉄の規律）",
      "passiveDesc": "新選組副長の威厳。HPが 50% 未満の時、会心率 +12%、攻撃力 +25%。",
      "lore": "新選組副長・土方歳三の愛刀。刀身二尺八寸の大業物。鳥羽伏見から箱館五稜郭まで、忠義を貫いた土方と共に最後まで駆け抜けた。"
    },
    "en": {
      "name": "Izuminokami Kanesada",
      "tier": "Wazamono",
      "type": "Katana",
      "smith": "11th Gen Kanesada",
      "era": "Late Edo (Bunkyu)",
      "master": "Hijikata Toshizo (Vice-Commander)",
      "hamon": "Turbulent Midare-ba",
      "passive": "Kyokuchu Hatto (Iron Discipline)",
      "passiveDesc": "When HP is below 50%, grants +12% CRIT Rate and +25% ATK.",
      "lore": "Beloved blade of Shinsengumi Vice-Commander Hijikata Toshizo. Spanning two shaku eight sun, it accompanied Hijikata from Kyoto to Hakodate."
    }
  },
  "sword_05": {
    "ja": {
      "name": "加州清光",
      "tier": "業物",
      "type": "打刀",
      "smith": "加賀藩主抱工・清光",
      "era": "江戸時代・万治年間",
      "master": "新選組一番隊組長・沖田総司",
      "hamon": "直刃調小乱れ",
      "passive": "三段突き（無明剣）",
      "passiveDesc": "沖田総司の神技。会心発生時に 35% の確率で即座に追加追撃が発生する。",
      "lore": "新選組天才剣士・沖田総司が池田屋事件で佩用した名刀。貧民街『乞食清光』の異名を持つ刀工が精魂込めて打った研ぎ澄まされた業物。"
    },
    "en": {
      "name": "Kashuu Kiyomitsu",
      "tier": "Wazamono",
      "type": "Katana",
      "smith": "Kaga Kiyomitsu",
      "era": "Edo Period (Manji)",
      "master": "Okita Soji (1st Unit Captain)",
      "hamon": "Fine Suguha Midare",
      "passive": "Sandan-zuki (Triple Thrust)",
      "passiveDesc": "Critical hits have a 35% chance to trigger an immediate additional strike.",
      "lore": "Wielded by prodigy swordsman Okita Soji during the famous Ikedaya incident. Crafted with astonishing sharpness and elegance."
    }
  },
  "sword_06": {
    "ja": {
      "name": "陸奥守吉行",
      "tier": "業物",
      "type": "打刀",
      "smith": "土佐鍛冶・森下吉行",
      "era": "元禄年間",
      "master": "維新回天志士・坂本龍馬",
      "hamon": "互の目丁子（華美なる刃境）",
      "passive": "回天維新（新時代の風）",
      "passiveDesc": "敵討伐時の獲得金小判が永久に +25%、会心ダメージ +15%。",
      "lore": "坂本龍馬が兄・権平より贈られた土佐の郷士刀。近江屋事件で落命するその瞬間まで龍馬の腰に佩かれ、新時代を切り開いた。"
    },
    "en": {
      "name": "Mutsunokami Yoshiyuki",
      "tier": "Wazamono",
      "type": "Katana",
      "smith": "Tosa Yoshiyuki",
      "era": "Genroku Period",
      "master": "Sakamoto Ryoma (Visionary Patriot)",
      "hamon": "Gunome Choji",
      "passive": "Kaiten Ishin (Wind of Renewal)",
      "passiveDesc": "Koban earned from defeating foes is increased by +25%, CRIT DMG +15%.",
      "lore": "Presented to Sakamoto Ryoma by his elder brother. A trusty Tosa sword that stood by Ryoma's side until his martyrdom at the Omiya inn."
    }
  },
  "sword_07": {
    "ja": {
      "name": "堀川国広",
      "tier": "業物",
      "type": "脇差",
      "smith": "山城国新刀名工・国広",
      "era": "安土桃山時代・慶長年間",
      "master": "新選組副長・土方歳三",
      "hamon": "互の目乱れに足入る",
      "passive": "二刀連繋（影身抜刀）",
      "passiveDesc": "抜刀速度 +20%、敵の攻撃を 8% の確率で受け流して反撃する。",
      "lore": "土方歳三の佩用した刃長一尺九寸五分の脇差。新刀屈指の名工・国広の手によるもので、狭隘な室内乱戦や奇襲で威力を発揮した。"
    },
    "en": {
      "name": "Horikawa Kunihiro",
      "tier": "Wazamono",
      "type": "Wakizashi",
      "smith": "Yamashiro Kunihiro",
      "era": "Azuchi-Momoyama (Keicho)",
      "master": "Hijikata Toshizo (Vice-Commander)",
      "hamon": "Gunome Midare with Ashi",
      "passive": "Shadow Link (Dual Deflection)",
      "passiveDesc": "Attack Speed +20%; 8% chance to parry and counter enemy strikes.",
      "lore": "Companion wakizashi of Hijikata Toshizo. Forged by master Kunihiro, it excelled in close-quarters indoor skirmishes."
    }
  },
  "sword_08": {
    "ja": {
      "name": "菊一文字則宗",
      "tier": "良業物",
      "type": "太刀",
      "smith": "備前福岡一文字派祖・則宗",
      "era": "鎌倉時代初期・建久年間",
      "master": "後鳥羽上皇御番鍛冶・沖田総司伝承",
      "hamon": "一文字直刃調小乱れ・菊御紋",
      "passive": "菊紋御影（気迫威圧）",
      "passiveDesc": "攻撃力 +30%、ボスに対するダメージ +15%。",
      "lore": "後鳥羽上皇の御番鍛冶を務めた福岡一文字則宗の作。茎に十六弁の菊花御紋が刻まれた至高の太刀。沖田総司の佩刀伝承でも名高い。"
    },
    "en": {
      "name": "Kiku-ichimonji Norimune",
      "tier": "Ryo-Wazamono",
      "type": "Tachi",
      "smith": "Fukuoka Ichimonji Founder Norimune",
      "era": "Early Kamakura (Kenkyu)",
      "master": "Okita Soji (Legendary Lore)",
      "hamon": "Ichimonji with Imperial Chrysanthemum",
      "passive": "Imperial Chrysanthemum Majesty",
      "passiveDesc": "ATK +30%, damage against Bosses +15%.",
      "lore": "Forged by Norimune, head of the Fukuoka Ichimonji school and bladesmith to Emperor Go-Toba. Inscribed with the sixteen-petal imperial crest."
    }
  },
  "sword_09": {
    "ja": {
      "name": "天下名槍・蜻蛉切",
      "tier": "良業物",
      "type": "槍",
      "smith": "三河文殊派・藤原正真",
      "era": "室町時代後期",
      "master": "徳川四天王・本多忠勝",
      "hamon": "笹穂槍・両刃樋入り",
      "passive": "蜻蛉両断（飛蝗破甲）",
      "passiveDesc": "破甲貫通 +35%、攻撃時に対象の防御力を激減させる。",
      "lore": "天下三名槍の一。槍の穂先に止まった蜻蛉が自重だけで真っ二つに裂けたという伝説から名付けられた。本多忠勝が生涯無傷を誇った得物。"
    },
    "en": {
      "name": "Tonbokiri",
      "tier": "Ryo-Wazamono",
      "type": "Spear",
      "smith": "Mikawa Fujiwara Masazane",
      "era": "Late Muromachi Period",
      "master": "Honda Tadakatsu (Four Guardians)",
      "hamon": "Double-Edged Saho Spear",
      "passive": "Dragonfly Sever (Armor Sundering)",
      "passiveDesc": "Armor Penetration +35%, tearing through enemy defenses on hit.",
      "lore": "One of the Three Great Spears of Japan. Named because a dragonfly landed on its upright tip and was sliced clean in two by its own weight."
    }
  },
  "sword_10": {
    "ja": {
      "name": "備前長船長光",
      "tier": "良業物",
      "type": "太刀",
      "smith": "備前長船派二代・長光",
      "era": "鎌倉時代中期",
      "master": "鎌倉幕府有力御家人",
      "hamon": "丁子乱れ・匂深く沸えづく",
      "passive": "千重刃浪（華麗なる連撃）",
      "passiveDesc": "会心率 +10%、攻撃速度 +15%、通常攻撃の振りが極めて鋭利になる。",
      "lore": "備前長船派の名匠光忠の嫡男・長光による華麗なる名刀。絢爛たる丁子乱れ刃文は刀剣美術の最高峰と謳われる。"
    },
    "en": {
      "name": "Bizen Osafune Nagamitsu",
      "tier": "Ryo-Wazamono",
      "type": "Tachi",
      "smith": "Nagamitsu (Son of Mitsutada)",
      "era": "Mid Kamakura Period",
      "master": "Kamakura Gokenin",
      "hamon": "Choji Midare with Deep Nioi",
      "passive": "Surging Waves (Flawless Flurry)",
      "passiveDesc": "CRIT Rate +10%, Attack Speed +15%. Slashes move with graceful velocity.",
      "lore": "A splendid masterpiece by Nagamitsu of Bizen Osafune. Renowned throughout Japanese history for its sublime, blossoming clove hamon."
    }
  },
  "sword_11": {
    "ja": {
      "name": "千子村正",
      "tier": "大業物",
      "type": "打刀",
      "smith": "伊勢桑名鍛冶・初代千子村正",
      "era": "室町時代・文亀年間",
      "master": "徳川怨敵・妖刀伝説",
      "hamon": "村正刃（表裏揃う皆焼・乱れ刃）",
      "passive": "妖刀怨嗟（血気吸収）",
      "passiveDesc": "攻撃時、与えたダメージの 8% 分HPを瞬時に回復し、攻撃力 +40%。",
      "lore": "徳川家に仇をなすとして忌み嫌われた伝説の妖刀。驚異的な切れ味を誇り、血を渇望する魔性が宿ると恐れられた。"
    },
    "en": {
      "name": "Sengo Muramasa",
      "tier": "O-Wazamono",
      "type": "Katana",
      "smith": "Sengo Muramasa I (Kuwana)",
      "era": "Muromachi (Bunki)",
      "master": "Cursed Blade Lore (Tokugawa Bane)",
      "hamon": "Symmetrical Muramasa Hamon",
      "passive": "Demonic Thirst (Life Leech)",
      "passiveDesc": "Restores 8% of damage dealt as HP on hit, ATK +40%.",
      "lore": "The legendary cursed blade said to bring doom to the Tokugawa clan. Renowned for its terrifying sharpness and supernatural bloodlust."
    }
  },
  "sword_12": {
    "ja": {
      "name": "圧切長谷部",
      "tier": "大業物",
      "type": "打刀",
      "smith": "山城鍛冶・長谷部国重",
      "era": "南北朝時代",
      "master": "織田信長・黒田如水",
      "hamon": "皆焼（ひたつら・火炎乱れ）",
      "passive": "無情一刀（重圧破砕）",
      "passiveDesc": "通常攻撃に 150 基礎固定ダメージが追加され、敵を怯ませる。",
      "lore": "織田信長が無礼を働いた茶坊主を膳棚ごと一刀両断に圧し切ったことから名付けられた。後に黒田官兵衛如水に下賜された名刀。"
    },
    "en": {
      "name": "Heshikiri Hasebe",
      "tier": "O-Wazamono",
      "type": "Katana",
      "smith": "Hasebe Kunishige",
      "era": "Nanboku-cho Period",
      "master": "Oda Nobunaga / Kuroda Josui",
      "hamon": "Hitatsura (All-Over Tempering)",
      "passive": "Ruthless Cleave (Crushing Force)",
      "passiveDesc": "Adds +150 bonus true physical damage to every strike.",
      "lore": "Named after Oda Nobunaga pressed the blade down against a tea cupboard to execute a traitor hiding inside without even drawing back to swing."
    }
  },
  "sword_13": {
    "ja": {
      "name": "鬼切安綱",
      "tier": "大業物",
      "type": "太刀",
      "smith": "伯耆国鍛冶・大原安綱",
      "era": "平安時代中期",
      "master": "源頼光・渡辺綱",
      "hamon": "小乱れに小足入る・古雅なる地肌",
      "passive": "羅生門斬鬼（悪鬼退散）",
      "passiveDesc": "妖怪・首領に対するダメージ +50%、会心ダメージ +30%。",
      "lore": "渡辺綱が京都一条戻橋で茨木童子の腕を切り落としたと伝わる宝刀。源氏重代の守護刀として崇められた。"
    },
    "en": {
      "name": "Onikiri Yasutsuna",
      "tier": "O-Wazamono",
      "type": "Tachi",
      "smith": "Ohara Yasutsuna (Hoki)",
      "era": "Mid Heian Period",
      "master": "Minamoto no Yorimitsu / Watanabe no Tsuna",
      "hamon": "Ko-midare with Ancient Hada",
      "passive": "Rashomon Demon Sever",
      "passiveDesc": "+50% extra damage against Bosses and Fiends, CRIT DMG +30%.",
      "lore": "Fabled heirloom of the Minamoto clan. Watanabe no Tsuna severed the arm of the demon Ibaraki-doji at Ichijo Modoribashi with this sacred blade."
    }
  },
  "sword_14": {
    "ja": {
      "name": "燭台切光忠",
      "tier": "大業物",
      "type": "太刀",
      "smith": "備前長船派祖・光忠",
      "era": "鎌倉時代中期",
      "master": "織田信長・伊達政宗",
      "hamon": "大丁子乱れ・華麗なる刃境",
      "passive": "独眼竜の覇気（弱点看破）",
      "passiveDesc": "会心率 +18%、攻撃力 +35%、破甲貫通 +20%。",
      "lore": "伊達政宗が家臣を斬った際、背後の銅の燭台まで共に両断したという逸話を持つ。長船光忠の最高傑作。"
    },
    "en": {
      "name": "Shokudaikiri Mitsutada",
      "tier": "O-Wazamono",
      "type": "Tachi",
      "smith": "Osafune Mitsutada Founder",
      "era": "Mid Kamakura Period",
      "master": "Oda Nobunaga / Date Masamune",
      "hamon": "Grand Choji Midare",
      "passive": "One-Eyed Dragon Ambition",
      "passiveDesc": "CRIT Rate +18%, ATK +35%, Armor Pen +20%.",
      "lore": "When Date Masamune struck down a rogue retainer, the stroke was so keen that it sliced through the heavy copper candlestick standing behind him."
    }
  },
  "sword_15": {
    "ja": {
      "name": "天下五剣・童子切安綱",
      "tier": "天下五剣",
      "type": "太刀",
      "smith": "伯耆国名工・大原安綱",
      "era": "平安時代中期・大同年間",
      "master": "源頼光・足利将軍家",
      "hamon": "小乱れ丁子・古伯耆の精華",
      "passive": "天下無双・神威（鬼神断頭）",
      "passiveDesc": "攻撃力 +60%、通常攻撃時に 15% の確率で対象の現HP 10% を追加で削り取る。",
      "lore": "天下五剣の筆頭にして『日本刀の東西の横綱』。源頼光が大江山の酒呑童子の首級を切り落とした伝説の霊刀。"
    },
    "en": {
      "name": "Dojikiri Yasutsuna",
      "tier": "Five Heavenly Swords",
      "type": "Tachi",
      "smith": "Ohara Yasutsuna",
      "era": "Mid Heian Period",
      "master": "Minamoto no Yorimitsu",
      "hamon": "Ko-choji Midare",
      "passive": "Yokozuna of Blades (Demon Beheading)",
      "passiveDesc": "ATK +60%; 15% chance on hit to cleave an additional 10% of target current HP.",
      "lore": "The foremost of the Tenka-Goken (Five Heavenly Swords). Minamoto no Yorimitsu used it to sever the head of the colossal arch-demon Shuten-doji."
    }
  },
  "sword_16": {
    "ja": {
      "name": "天下五剣・三日月宗近",
      "tier": "天下五剣",
      "type": "太刀",
      "smith": "山城国三条鍛冶・三条宗近",
      "era": "平安時代・永延年間",
      "master": "足利義輝・徳川将軍家",
      "hamon": "三日月形の打のけが連なる二重刃",
      "passive": "幽玄なる三日月（優雅なる回避）",
      "passiveDesc": "回避率 +20%、回避成功時に攻撃力が 5 秒間 +50% 爆発上昇する。",
      "lore": "天下五剣の中で最も美しく雅やかと称される至宝。刃縁に数多くの三日月形の打のけが浮かび上がる。"
    },
    "en": {
      "name": "Mikazuki Munechika",
      "tier": "Five Heavenly Swords",
      "type": "Tachi",
      "smith": "Sanjo Munechika (Yamashiro)",
      "era": "Heian Period (Eien)",
      "master": "Ashikaga Yoshiteru / Tokugawa Shogunate",
      "hamon": "Crescent Moon Uchinoke",
      "passive": "Crescent Moon Grace (Ethereal Dodge)",
      "passiveDesc": "Dodge Rate +20%; dodging boosts ATK by +50% for 5 seconds.",
      "lore": "Celebrated as the most exquisite and elegant among the Five Heavenly Swords. Countless crescent-moon patterns shimmer along its edge."
    }
  },
  "sword_17": {
    "ja": {
      "name": "天下五剣・大典太光世",
      "tier": "天下五剣",
      "type": "太刀",
      "smith": "筑後国三池派祖・三池典太光世",
      "era": "平安時代末期",
      "master": "足利将軍家・前田利家",
      "hamon": "広直刃・風格深き古作",
      "passive": "霊鳥破魔（邪気遮断）",
      "passiveDesc": "全被ダメージ 25% 軽減、最大HP +40%。",
      "lore": "前田家の宝刀。枕元に置くだけで姫君の難病を治し、鳥が止まらぬほど凄まじい霊威を放ったとされる天下五剣の一。"
    },
    "en": {
      "name": "Oodenta Mitsuyo",
      "tier": "Five Heavenly Swords",
      "type": "Tachi",
      "smith": "Miike Denta Mitsuyo (Chikugo)",
      "era": "Late Heian Period",
      "master": "Ashikaga Clan / Maeda Toshiie",
      "hamon": "Broad Suguha with Ancient Dignity",
      "passive": "Spiritual Warding (Demon Purge)",
      "passiveDesc": "Reduces all incoming damage by 25%, Max HP +40%.",
      "lore": "Heirloom of the Maeda clan. Legend says its presence cured a princess's incurable illness, and birds dared not perch on any roof beneath which it rested."
    }
  },
  "sword_18": {
    "ja": {
      "name": "天下五剣・数珠丸恒次",
      "tier": "天下五剣",
      "type": "太刀",
      "smith": "備中青江派・恒次",
      "era": "鎌倉時代初頭",
      "master": "日蓮聖人・身延山久遠寺",
      "hamon": "乱れ刃に数珠状の沸匂",
      "passive": "破邪顕正（明鏡止水）",
      "passiveDesc": "全状態異常無効、毎秒最大HPの 3% を自律回復する。",
      "lore": "日蓮聖人が甲州身延山で佩刀し、柄に数珠を巻き破邪顕正の祈りを込めたとされる天下五剣の一振。"
    },
    "en": {
      "name": "Juzumaru Tsunetsugu",
      "tier": "Five Heavenly Swords",
      "type": "Tachi",
      "smith": "Aoe Tsunetsugu (Bitchu)",
      "era": "Early Kamakura Period",
      "master": "Nichiren Shonin (Kuon-ji)",
      "hamon": "Rosary-Bead Nioi",
      "passive": "Holy Rosary Ward (Serene Mind)",
      "passiveDesc": "Immunity to all debuffs, naturally regenerates 3% Max HP per second.",
      "lore": "Worn by monk Nichiren with Buddhist prayer rosaries wound around its hilt, invoking divine protection against wickedness and corruption."
    }
  },
  "sword_19": {
    "ja": {
      "name": "天下五剣・鬼丸国綱",
      "tier": "天下五剣",
      "type": "太刀",
      "smith": "山城粟田口派・粟田口国綱",
      "era": "鎌倉時代中期",
      "master": "北条時政・織田信長",
      "hamon": "小沸出来の小乱れ・華麗なる地肌",
      "passive": "夢幻切断（悪夢両断）",
      "passiveDesc": "攻撃力 +50%、会心ダメージ +60%、攻撃時に 20% の確率で敵防御力を全破壊する。",
      "lore": "北条時政を苦しめた小鬼の悪夢を、鞘から自然と抜け落ちて両断した伝説から名付けられた皇室御物・天下五剣の一。"
    },
    "en": {
      "name": "Onimaru Kunitsuna",
      "tier": "Five Heavenly Swords",
      "type": "Tachi",
      "smith": "Awataguchi Kunitsuna (Kyoto)",
      "era": "Mid Kamakura Period",
      "master": "Hojo Tokimasa / Imperial Household",
      "hamon": "Ko-midare with Awataguchi Grain",
      "passive": "Nightmare Cleaver (Demon Cleave)",
      "passiveDesc": "ATK +50%, CRIT DMG +60%; 20% chance to completely shred enemy DEF to 0.",
      "lore": "Imperial heirloom of the Five Swords. When regent Hojo Tokimasa was tormented by a nightmare demon, this blade leaped from its stand and severed the beast."
    }
  },
  "sword_20": {
    "ja": {
      "name": "妖刀村雨丸",
      "tier": "神話妖刀",
      "type": "打刀",
      "smith": "南総伝説鍛冶",
      "era": "神話伝承・室町期",
      "master": "里見八犬士・犬塚信乃",
      "hamon": "露を含み水を湧かす神秘の刃",
      "passive": "抜刀出水（水気殺陣）",
      "passiveDesc": "攻撃速度 +35%、攻撃ごとに敵に継続水属性流血ダメージを付与する。",
      "lore": "抜けば刃から清らかな水滴が滴り、人を斬れば血を洗い流すという伝説の霊剣妖刀。『南総里見八犬伝』の至宝。"
    },
    "en": {
      "name": "Youtou Murasame",
      "tier": "Mythic Blade",
      "type": "Katana",
      "smith": "Legendary Nanso Smith",
      "era": "Mythic Lore",
      "master": "Inuzuka Shino (Satomi Eight Dogs)",
      "hamon": "Dew-Bearing Torrent Hamon",
      "passive": "Torrential Awakening (Cleansing Surge)",
      "passiveDesc": "Attack Speed +35%; every strike inflicts continuous elemental bleed.",
      "lore": "Legendary sword from the Nanso Satomi Hakkenden. Whenever drawn, dew wells up on the blade, washing away the blood of any foe it cuts."
    }
  },
  "sword_21": {
    "ja": {
      "name": "神代三神器・天叢雲剣",
      "tier": "神話妖刀",
      "type": "神剣",
      "smith": "神代・素戔嗚尊",
      "era": "上古神話時代",
      "master": "日本武尊（草薙剣）",
      "hamon": "神代八重雲・天照の神光",
      "passive": "草薙神威（天地皆断）",
      "passiveDesc": "全属性 +50%、通常攻撃が全域神聖衝撃波へと昇華する。",
      "lore": "素戔嗚尊が八岐大蛇の尾から取り出した皇位継承の至宝・三種の神器の一柱。後に日本武尊が野火を薙ぎ払い『草薙剣』と改称した。"
    },
    "en": {
      "name": "Ame no Murakumo no Tsurugi",
      "tier": "Mythic Blade",
      "type": "Divine Sword",
      "smith": "Susanoo-no-Mikoto",
      "era": "Age of the Gods",
      "master": "Yamato Takeru (Kusanagi)",
      "hamon": "Divine Eightfold Cloud",
      "passive": "Kusanagi Sovereignty (Heavenly Wave)",
      "passiveDesc": "All stats +50%; normal slashes emit devastating divine shockwaves.",
      "lore": "One of the Three Sacred Imperial Regalia of Japan, drawn by god Susanoo from the tail of the Yamata no Orochi. Later wielded by hero Yamato Takeru."
    }
  },
  "sword_22": {
    "ja": {
      "name": "雷神切断・名刀雷切",
      "tier": "神話妖刀",
      "type": "打刀",
      "smith": "備後三原派・正家",
      "era": "南北朝時代・戦国期",
      "master": "豊後大名・立花道雪",
      "hamon": "雷光乱れ・蒼白の電撃",
      "passive": "迅雷一閃（百雷咆哮）",
      "passiveDesc": "会心率 +25%、会心ダメージ +100%、攻撃時に連鎖稲妻が迸る。",
      "lore": "立花道雪が木陰で雨宿り中、落ちてきた雷神（雷霆）を千鳥の刀で斬り裂いて生き延びた逸話から『雷切』と号された神速の佩刀。"
    },
    "en": {
      "name": "Raikiri",
      "tier": "Mythic Blade",
      "type": "Katana",
      "smith": "Bingo Mihara Masaie",
      "era": "Nanboku-cho / Sengoku",
      "master": "Tachibana Dosetsu",
      "hamon": "Lightning Flash Midare",
      "passive": "Thunderclap Flash (Chain Lightning)",
      "passiveDesc": "CRIT Rate +25%, CRIT DMG +100%; strikes unleash chain lightning.",
      "lore": "Originally named Chidori. Renowned samurai Tachibana Dosetsu was sheltering beneath a tree when lightning struck; he drew his sword and cleaved the lightning god."
    }
  }
};
window.I18N.items = {
  "mat_tamahagane": {
    "ja": {
      "name": "玉鋼",
      "desc": "日本の伝統的たたら製鉄によって製錬された至高の純粋高炭素鋼。日本刀鍛造の命脈。"
    },
    "en": {
      "name": "Tamahagane",
      "desc": "Traditional high-carbon steel produced via ancient Tatara smelting. The lifeblood of all Japanese katana forging."
    }
  },
  "mat_whetstone_rough": {
    "ja": {
      "name": "荒砥石",
      "desc": "目の粗い研磨石。刃こぼれを修正し、名刀の基礎鋭利度を高める（攻撃力+5）。"
    },
    "en": {
      "name": "Coarse Whetstone (Arato)",
      "desc": "Coarse abrasive sharpening stone used to reshape chipped edges and boost base sharpness (+5 ATK)."
    }
  },
  "mat_whetstone_mid": {
    "ja": {
      "name": "中砥石",
      "desc": "滑らかな研磨石。荒砥の研ぎ目を消し、均一な刃筋を整える（攻撃力+15）。"
    },
    "en": {
      "name": "Medium Whetstone (Nakato)",
      "desc": "Finer stone that smooths out coarse grinding marks, creating a sharp cutting bevel (+15 ATK)."
    }
  },
  "mat_whetstone_fine": {
    "ja": {
      "name": "仕上砥石",
      "desc": "京都天然合砥。鏡面のごとき美刃と青光りする地肌を研ぎ出す（攻撃力+40、会心率+1%）。"
    },
    "en": {
      "name": "Finishing Whetstone (Shiageto)",
      "desc": "Natural Kyoto polishing stone yielding a mirror-like sheen and terrifying cutting edge (+40 ATK, +1% CRIT)."
    }
  },
  "mat_meteorite": {
    "ja": {
      "name": "天外隕鉄",
      "desc": "夜空より落ちた星辰の残鉄。大業物や神話刀剣の鍛造に不可欠な至宝。"
    },
    "en": {
      "name": "Meteoric Iron",
      "desc": "Fallen star iron imbued with celestial magnetic resonance. Essential for forging O-Wazamono and mythic blades."
    }
  },
  "item_onigiri": {
    "ja": {
      "name": "梅干しおにぎり",
      "desc": "疲れた肉体を潤す武士の携帯食。体力を瞬時に全快する。"
    },
    "en": {
      "name": "Pickled Plum Onigiri",
      "desc": "A traditional samurai field ration. Instantly restores HP to full."
    }
  },
  "item_hyourougan": {
    "ja": {
      "name": "伊賀兵糧丸",
      "desc": "伊賀忍者の秘伝携帯食。服用後 60 秒間、攻撃力が 1.5 倍に上昇する。"
    },
    "en": {
      "name": "Iga Hyourougan",
      "desc": "Secret stamina pill of the Iga ninja. Multiplies ATK by 1.5x for 60 seconds."
    }
  },
  "item_sake_onigoroshi": {
    "ja": {
      "name": "銘酒「鬼殺し」",
      "desc": "豪快なる辛口地酒。気迫を昂らせ、60 秒間抜刀速度が 1.35 倍に加速する。"
    },
    "en": {
      "name": "Demon Slayer Sake",
      "desc": "Potent traditional dry sake. Ignites warrior spirit, increasing attack speed by 1.35x for 60 seconds."
    }
  },
  "item_matcha": {
    "ja": {
      "name": "宇治濃抹茶",
      "desc": "京都宇治の最上級点前。研ぎ澄まされた集中力により 60 秒間会心率が +20% 上昇する。"
    },
    "en": {
      "name": "Uji Thick Matcha",
      "desc": "Finest ceremonial green tea from Kyoto. Sharpens focus, boosting CRIT Rate by +20% for 60 seconds."
    }
  }
};
window.I18N.chapters = {
  "1": {
    "ja": {
      "title": "第一幕・尾張の風と落魄の初心",
      "summary": "織田信長発祥の地・尾張の荒野。竹林に巣食う野盗を討ち払い、無名浪人が天下一の剣士への一歩を踏み出す。"
    },
    "en": {
      "title": "Act I: Owari Wind & Humble Beginnings",
      "summary": "The wild bamboo groves of Owari where Oda Nobunaga once rose. Armed with a simple takemitsu, a nameless ronin takes the first step toward martial glory."
    }
  },
  "2": {
    "ja": {
      "title": "第二幕・伏見千門と幽影の密使",
      "summary": "幾重にも連なる朱色の鳥居。伊賀・甲賀の忍者が暗躍する中、浪人は天下の命運を握る密使と巡り合う。"
    },
    "en": {
      "title": "Act II: Thousand Gates & Phantom Emissary",
      "summary": "Crimson torii gates stretching into the mist. Amidst shadow-weaving ninjas, the ronin encounters a secret messenger bearing Kyoto's destiny."
    }
  },
  "3": {
    "ja": {
      "title": "第三幕・京都三条と運命分岐の夜",
      "summary": "幕末の古都・京都三条。佐幕か、尊皇維新か、それとも己の剣呑み信じる修羅か。己の佩刀の往く末を決断せよ！"
    },
    "en": {
      "title": "Act III: Kyoto Sanjo & Night of Destiny Crossroads",
      "summary": "Kyoto's Sanjo district under the moon. Shogunate loyalists, imperial patriots, and bloodthirsty shura collide. For what truth shall your katana strike?"
    }
  },
  "4": {
    "ja": {
      "title": "第四幕・池田屋激闘と血染めの夜",
      "summary": "池田屋の暗殺計画を巡り、新選組と志士が抜刀激突。狭隘なる旅籠で命を削る死線の一太刀が交錯する。"
    },
    "en": {
      "title": "Act IV: Ikedaya Clash & Bloodstained Night",
      "summary": "Shinsengumi storm the Ikedaya inn. In narrow stairwells and sliding-door chambers, blades clash in the defining raid of the Bakumatsu."
    }
  },
  "5": {
    "ja": {
      "title": "第五幕・長篠怨霊と第六天魔王",
      "summary": "千丁の鉄砲が唸りを上げた古戦場・長篠。怨念を纏い現れた織田信長の亡霊を白刃一閃で断ち切れ！"
    },
    "en": {
      "title": "Act V: Nagashino Specters & The Demon King",
      "summary": "The ancient battlefield of Nagashino where matchlock volleys roared. Vanquish the resurrected phantom of Oda Nobunaga with cold steel!"
    }
  },
  "6": {
    "ja": {
      "title": "第六幕・会津鶴ヶ城と白虎の魂",
      "summary": "新政府軍の砲火に包まれる会津鶴ヶ城。義のために散った白虎隊の誇りと武士の魂が雪嶺にこだまする。"
    },
    "en": {
      "title": "Act VI: Aizu Tsuruga Castle & Spirit of Byakko",
      "summary": "Tsuruga Castle bombarded under fierce artillery. The heroic resolve of the Byakkotai echoes across snowy northern ramparts."
    }
  },
  "7": {
    "ja": {
      "title": "第七幕・五稜郭終焉と武士道の頂",
      "summary": "極北の星形要塞・箱館五稜郭。旧幕府軍最後の拠点にて、時代のうねりを越えた真の武士の最終決戦が幕を開ける！"
    },
    "en": {
      "title": "Act VII: Goryokaku Finale & The Summit of Bushido",
      "summary": "Hakodate's star-shaped Goryokaku fortress. At the final bastion of the samurai era, engage in the ultimate battle that crowns your legend!"
    }
  }
};

window.getSwordText = function(sword, lang) {
  if (!sword) return {};
  lang = lang || window.getLang();
  if (lang === "zh-TW") {
    return {
      name: sword.name,
      tierName: sword.tierName,
      type: sword.type,
      smith: sword.smith,
      era: sword.era,
      master: sword.master,
      hamon: sword.hamon,
      passive: sword.passive,
      passiveDesc: sword.passiveDesc,
      lore: sword.lore
    };
  }
  const entry = window.I18N.swords[sword.id] && window.I18N.swords[sword.id][lang];
  if (entry) {
    return {
      name: entry.name || sword.name,
      tierName: entry.tier || sword.tierName,
      type: entry.type || sword.type,
      smith: entry.smith || sword.smith,
      era: entry.era || sword.era,
      master: entry.master || sword.master,
      hamon: entry.hamon || sword.hamon,
      passive: entry.passive || sword.passive,
      passiveDesc: entry.passiveDesc || sword.passiveDesc,
      lore: entry.lore || sword.lore
    };
  }
  return {
    name: lang === 'en' && sword.romaji ? sword.romaji : sword.name,
    tierName: sword.tierName,
    type: sword.type,
    smith: sword.smith,
    era: sword.era,
    master: sword.master,
    hamon: sword.hamon,
    passive: sword.passive,
    passiveDesc: sword.passiveDesc,
    lore: sword.lore
  };
};

window.getItemText = function(item, lang) {
  if (!item) return {};
  lang = lang || window.getLang();
  if (lang === "zh-TW") return { name: item.name, desc: item.desc };
  const entry = window.I18N.items[item.id] && window.I18N.items[item.id][lang];
  if (entry) return { name: entry.name, desc: entry.desc };
  return { name: item.name, desc: item.desc };
};

window.getActText = function(actNum, lang) {
  lang = lang || window.getLang();
  if (window.getStoryChapterText) {
    const ch = window.getStoryChapterText(actNum, lang);
    if (ch && ch.title) return { title: ch.title, summary: ch.summary };
  }
  const entry = window.I18N.chapters[actNum] && window.I18N.chapters[actNum][lang];
  if (entry) return { title: entry.title, summary: entry.summary };
  const ch = (window.STORY_DATA && window.STORY_DATA.chapters) ? window.STORY_DATA.chapters.find(c => c.act === actNum) : null;
  return ch ? { title: ch.title, summary: ch.summary } : { title: `Act ${actNum}`, summary: "" };
};


window.getAchievementText = function(ach, lang) {
  if (!ach) return {};
  lang = lang || window.getLang();
  if (ach.translations && ach.translations[lang]) {
    return ach.translations[lang];
  }
  return ach.translations ? ach.translations["zh-TW"] : { name: ach.name, desc: ach.desc };
};
