// ==========================================================
// 《無雙劍心：武士之刃》命運分歧繪卷與故事線資料庫 (多國語言完整版)
// Samurai Blade: Idle RPG - Storyline & Destiny Branches Database (Multilingual)
// ==========================================================

window.SPEAKER_I18N = {
  "你": { "zh-TW": "你", "en": "You", "ja": "貴方" },
  "浪人": { "zh-TW": "浪人", "en": "Ronin", "ja": "浪人" },
  "行腳僧": { "zh-TW": "行腳僧", "en": "Wandering Monk", "ja": "巡礼僧" },
  "破戒僧・豪圓": { "zh-TW": "破戒僧・豪圓", "en": "Corrupt Monk Goen", "ja": "破戒僧・豪円" },
  "伏見社守": { "zh-TW": "伏見社守", "en": "Shrine Keeper", "ja": "伏見の社守" },
  "白衣蒙面女刺客": { "zh-TW": "白衣蒙面女刺客", "en": "Veiled Assassin", "ja": "白衣の女刺客" },
  "甲賀上忍・夜叉丸": { "zh-TW": "甲賀上忍・夜叉丸", "en": "Koga Jonin Yashamaru", "ja": "甲賀上忍・夜叉丸" },
  "土方歲三": { "zh-TW": "土方歲三", "en": "Toshizo Hijikata", "ja": "土方歳三" },
  "坂本龍馬": { "zh-TW": "坂本龍馬", "en": "Ryoma Sakamoto", "ja": "坂本龍馬" },
  "神秘盲劍客": { "zh-TW": "神秘盲劍客", "en": "Blind Bladethinker", "ja": "謎の盲目剣客" },
  "千子村正之靈": { "zh-TW": "千子村正之靈", "en": "Spirit of Muramasa", "ja": "千子村正の霊" },
  "示現流狂徒・大石": { "zh-TW": "示現流狂徒・大石", "en": "Jigen Berserker Oishi", "ja": "示現流の狂徒・大石" },
  "雪將軍・長尾景連": { "zh-TW": "雪將軍・長尾景連", "en": "Snow General Nagao", "ja": "雪将軍・長尾景連" },
  "第六天魔王・信長殘影": { "zh-TW": "第六天魔王・信長殘影", "en": "Demon King Nobunaga Phantom", "ja": "第六天魔王・信長の残影" },
  "赤鬼修羅・井伊殘念": { "zh-TW": "赤鬼修羅・井伊殘念", "en": "Red Demon Ii Remnant", "ja": "赤鬼修羅・井伊の怨念" },
  "天下無雙・宮本武藏之魂": { "zh-TW": "天下無雙・宮本武藏之魂", "en": "Peerless Spirit of Musashi", "ja": "天下無双・宮本武蔵の魂" },
  "旁白": { "zh-TW": "旁白", "en": "Narrator", "ja": "語り部" }
};

window.STORY_DATA = {
  // 三大命運分歧派系
  factions: {
    unaligned: {
      id: "unaligned",
      name: "無宿浪人",
      sub: "隨波逐流・孤劍問心",
      color: "#9ca3af",
      icon: "🌾",
      desc: "尚未立誓加入任何勢力，僅憑腰間一把竹光與對至高劍道的嚮往，在戰國與幕末的亂世夾縫中獨行。",
      passiveDesc: "無特殊陣營加成"
    },
    shogunate: {
      id: "shogunate",
      name: "佐幕・誠之忠道",
      sub: "天下泰平・守護德川與新選組之誓",
      color: "#38bdf8",
      icon: "誠",
      desc: "尊崇德川幕府百年泰平之基業，立身於近藤勇與土方歲三的新選組麾下。以『誠』字大旗為信念，誓死捍衛京都與江戶之安寧。",
      passiveDesc: "【誠之忠魂】：最大體力 +35%、防禦力 +30%、首領傷害減免 15%",
      bonus: { maxHpMul: 0.35, defMul: 0.30, bossDmgReduction: 0.15 }
    },
    ishin: {
      id: "ishin",
      name: "尊皇・倒幕維新",
      sub: "天下一新・追隨坂本龍馬開創新時代",
      color: "#f59e0b",
      icon: "旭",
      desc: "面對黑船來航的西方衝擊，決意打破舊幕府之陳腐枷鎖。與坂本龍馬、長州薩摩志士締結同盟，為迎接文明與自由的新日本拔刀！",
      passiveDesc: "【維新烈火】：攻擊力 +35%、拔刀速度 +20%、戰鬥金小判獲取 +35%",
      bonus: { atkMul: 0.35, speedMul: 0.20, goldMul: 0.35 }
    },
    shura: {
      id: "shura",
      name: "修羅・妖刀劍鬼",
      sub: "萬物皆斬・墮入人劍合一之無間極致",
      color: "#ef4444",
      icon: "鬼",
      desc: "厭倦了世俗凡人的政爭旗號，只信奉手中冰冷之刃。與千子村正、妖刀村雨共鳴，化身為踏破神魔、見敵必斬之無雙修羅。",
      passiveDesc: "【血染狂瀾】：會心傷害 +75%、破甲穿透 +40%、神速自律斬頻率 +30%",
      bonus: { critDmgMul: 0.75, armorPenAdd: 40, autoSlashSpeedMul: 0.30 }
    }
  },

  // 七大幕故事章節與分歧點
  chapters: [
    {
      act: 1,
      zoneId: 1,
      title: "第一幕・尾張之風與落魄初心",
      summary: "昔日織田信長發跡之尾張荒野，殘破竹林中盤踞著無數盜寇。手持粗糙竹光的浪人，在此踏出了揚名天下之第一步。",
      introDialogue: [
        { speaker: "行腳僧", text: "阿彌陀佛...這片竹林已被狂僧與野賊佔據，施主手持一柄竹光，當真要隻身涉險？" },
        { speaker: "你", text: "（輕撫刀柄）刀雖無銘，但心有鋒刃。不斬開眼前的雜草，又如何看得見天下的曙光。" }
      ],
      milestone: 5,
      milestoneDialogue: [
        { speaker: "你", text: "刀風漸起，竹葉翻飛。深處傳來沉重鐵錫杖之聲，守門狂僧就在前方！" }
      ],
      bossDialogue: [
        { speaker: "破戒僧・豪圓", text: "哪來的野浪人，敢擾佛爺清修？留下首級與盤纏！" },
        { speaker: "你", text: "破戒之徒，不配立於天地之間。拔刀！" }
      ],
      clearDialogue: [
        { speaker: "旁白", text: "豪圓轟然倒地，其珍藏之名刀散落於泥塵之中。浪人拾起刀刃，望向遠方夕陽下的伏見千本鳥居..." }
      ],
      translations: {
        "zh-TW": {
          title: "第一幕・尾張之風與落魄初心",
          summary: "昔日織田信長發跡之尾張荒野，殘破竹林中盤踞著無數盜寇。手持粗糙竹光的浪人，在此踏出了揚名天下之第一步。",
          introDialogue: [
            { speaker: "行腳僧", text: "阿彌陀佛...這片竹林已被狂僧與野賊佔據，施主手持一柄竹光，當真要隻身涉險？" },
            { speaker: "你", text: "（輕撫刀柄）刀雖無銘，但心有鋒刃。不斬開眼前的雜草，又如何看得見天下的曙光。" }
          ],
          milestoneDialogue: [
            { speaker: "你", text: "刀風漸起，竹葉翻飛。深處傳來沉重鐵錫杖之聲，守門狂僧就在前方！" }
          ],
          bossDialogue: [
            { speaker: "破戒僧・豪圓", text: "哪來的野浪人，敢擾佛爺清修？留下首級與盤纏！" },
            { speaker: "你", text: "破戒之徒，不配立於天地之間。拔刀！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "豪圓轟然倒地，其珍藏之名刀散落於泥塵之中。浪人拾起刀刃，望向遠方夕陽下的伏見千本鳥居..." }
          ]
        },
        "en": {
          title: "Act I: Winds of Owari & Humble Beginnings",
          summary: "In the untamed bamboo wilderness of Owari where Oda Nobunaga once rose, brigands roam free. A nameless ronin bearing a bamboo training blade takes the first step toward martial glory.",
          introDialogue: [
            { speaker: "行腳僧", text: "Namu Amida Butsu... Bandits and renegade monks hold these bamboo groves. Traveler, do you truly dare tread here armed only with that wooden blade?" },
            { speaker: "你", text: "(Gently resting hand on hilt) The blade bears no name, yet my spirit is forged in steel. If I cut not through these weeds, how shall I ever behold the dawn?" }
          ],
          milestoneDialogue: [
            { speaker: "你", text: "The wind rises and bamboo leaves scatter. The heavy clang of an iron khakkhara echoes ahead—the guardian monk awaits!" },
          ],
          bossDialogue: [
            { speaker: "破戒僧・豪圓", text: "What stray dog dares disturb my quiet? Leave your coin and your head in the dirt!" },
            { speaker: "你", text: "One who breaks sacred vows has no place beneath the heavens. Draw your weapon!" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "Goen crashes to the ground, his hoarded blade tumbling into the mud. Sheathing the steel, the ronin turns gaze toward the crimson torii of Fushimi beneath the setting sun..." }
          ]
        },
        "ja": {
          title: "第一幕・尾張の風と零落の初心",
          summary: "織田信長が旗揚げせし尾張の荒野。竹林に巣食う賊徒の中、一振りの竹光を帯びし浪人が、天下に名を馳せる第一歩を踏み出す。",
          introDialogue: [
            { speaker: "行腳僧", text: "南無阿弥陀仏...この竹林は狂僧と野盗の巣窟。施主よ、その竹光一本で真に踏み入る気でおいでか？" },
            { speaker: "你", text: "（柄に手を添え）銘なき刀なれど、胸中には刃あり。眼前の雑草を斬り払わずして、天下の暁光は見えぬ。" }
          ],
          milestoneDialogue: [
            { speaker: "你", text: "風が起こり、竹葉が舞う。奥から響く重き錫杖の音...門番の狂僧は目前か！" }
          ],
          bossDialogue: [
            { speaker: "破戒僧・豪圓", text: "どこの野良浪人が、我が勤行を邪魔するか！命と路銀を置いていけ！" },
            { speaker: "你", text: "戒を破りし者に、天地に立つ資格なし。いざ尋常に勝負！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "豪円は崩れ落ち、秘蔵の刀が泥に散る。刀を拾い上げし浪人は、夕陽に染まる伏見千本鳥居を見据える..." }
          ]
        }
      }
    },
    {
      act: 2,
      zoneId: 2,
      title: "第二幕・伏見千門與幽影密使",
      summary: "朱紅鳥居綿延數里，幽暗夜色下，伊賀與甲賀的忍者悄然穿行。浪人在此遭遇了來自京都的神秘密使。",
      introDialogue: [
        { speaker: "伏見社守", text: "紅門之後，已有數十位武士無聲殞命...夜叉丸的幻影刺殺術，無人能破。" },
        { speaker: "你", text: "忍者的影子雖快，但快不過拔刀時的電光。" }
      ],
      milestone: 5,
      milestoneDialogue: [
        { speaker: "白衣蒙面女刺客", text: "閣下劍術非凡，若能通過夜叉丸這關，請務必往京都三條一晤...天下命運，繫於君手。" }
      ],
      bossDialogue: [
        { speaker: "甲賀上忍・夜叉丸", text: "見過我影分身之人，皆已化為伏見之土！" },
        { speaker: "你", text: "心如止水，分身不過是擾人之霧。斬！" }
      ],
      clearDialogue: [
        { speaker: "旁白", text: "夜叉丸煙消雲散，留下通往京都的密函。古都的風雲已至沸點，命運的三叉路即將展現於眼前..." }
      ],
      translations: {
        "zh-TW": {
          title: "第二幕・伏見千門與幽影密使",
          summary: "朱紅鳥居綿延數里，幽暗夜色下，伊賀與甲賀的忍者悄然穿行。浪人在此遭遇了來自京都的神秘密使。",
          introDialogue: [
            { speaker: "伏見社守", text: "紅門之後，已有數十位武士無聲殞命...夜叉丸的幻影刺殺術，無人能破。" },
            { speaker: "你", text: "忍者的影子雖快，但快不過拔刀時的電光。" }
          ],
          milestoneDialogue: [
            { speaker: "白衣蒙面女刺客", text: "閣下劍術非凡，若能通過夜叉丸這關，請務必往京都三條一晤...天下命運，繫於君手。" }
          ],
          bossDialogue: [
            { speaker: "甲賀上忍・夜叉丸", text: "見過我影分身之人，皆已化為伏見之土！" },
            { speaker: "你", text: "心如止水，分身不過是擾人之霧。斬！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "夜叉丸煙消雲散，留下通往京都的密函。古都的風雲已至沸點，命運的三叉路即將展現於眼前..." }
          ]
        },
        "en": {
          title: "Act II: Thousand Gates of Fushimi & Phantom Shadows",
          summary: "Endless crimson torii wind into the misty night, where Iga and Koga shinobi prowl the shadows. Here, the ronin encounters a secret emissary bound for Kyoto.",
          introDialogue: [
            { speaker: "伏見社守", text: "Beyond those vermilion gates, dozens of samurai have met silent deaths... Yashamaru's phantom strike has never been bested." },
            { speaker: "你", text: "The shadow of a ninja may be swift, yet no shadow outruns the flash of my unsheathed blade." }
          ],
          milestoneDialogue: [
            { speaker: "白衣蒙面女刺客", text: "Your swordsmanship is extraordinary. If you survive Yashamaru, seek us at Kyoto's Sanjo... the fate of Japan rests in your hands." }
          ],
          bossDialogue: [
            { speaker: "甲賀上忍・夜叉丸", text: "All who witness my shadow clones become fertilizer for Fushimi's soil!" },
            { speaker: "你", text: "A serene mind sees through illusions. Your shadows are but fleeting mist. Die!" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "Yashamaru dissipates into black smoke, leaving a secret missive to the capital. Kyoto's tempest reaches boiling point, and the three paths of destiny open..." }
          ]
        },
        "ja": {
          title: "第二幕・伏見千門と幽影の密使",
          summary: "朱色の鳥居が連なる幽玄の夜。伊賀・甲賀の忍びが暗躍する稲荷山にて、浪人は天下の命運を握る密使と相まみえる。",
          introDialogue: [
            { speaker: "伏見社守", text: "朱門の先にて、数多の侍が音もなく露と消え申した...夜叉丸の幻影殺法を破れる者などおらぬ。" },
            { speaker: "你", text: "忍びの影が疾かろうと、我が抜刀の電光には及ばぬ。" }
          ],
          milestoneDialogue: [
            { speaker: "白衣蒙面女刺客", text: "見事な太刀筋...夜叉丸を討ち破らば、どうか京都三条へお越しあれ。天下の命運、貴殿の双肩にあり。" }
          ],
          bossDialogue: [
            { speaker: "甲賀上忍・夜叉丸", text: "我が影分身を見た者、すべて伏見の土くれと化すのみ！" },
            { speaker: "你", text: "明鏡止水。幻惑の霧など、一刀両断に斬り捨てるまで！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "夜叉丸は煙の如く消え、京への密書が残された。古都の風雲急を告げ、運命の分水嶺が眼前に迫る..." }
          ]
        }
      }
    },
    {
      act: 3,
      zoneId: 3,
      title: "第三幕・京都三條與命運分歧之夜",
      isBranchPoint: true,
      summary: "京都三條街頭，刀光霍霍。尊王壤夷的狂熱、新選組的嚴苛肅殺、以及暗流湧動的修羅妖氣在此劇烈碰撞！",
      choicePrompt: "⚡ 【天命決斷】三條之夜已至，你腰間之名刀，將為誰而揮斬？",
      choices: [
        {
          id: "shogunate",
          name: "🔷 投身【佐幕・誠之忠道】",
          desc: "加入新選組與德川陣營，以天然理心流之誠信，誓死維護天下秩序與京都泰平！",
          faction: "shogunate",
          dialogue: [
            { speaker: "土方歲三", text: "好志氣！從今日起，你便是壬生之狼的一員！披上誠字羽織，隨我掃蕩京都逆賊！" },
            { speaker: "你", text: "誓以手中之刃，守護天下萬民得享太平！" }
          ],
          translations: {
            "zh-TW": {
              name: "🔷 投身【佐幕・誠之忠道】",
              desc: "加入新選組與德川陣營，以天然理心流之誠信，誓死維護天下秩序與京都泰平！"
            },
            "en": {
              name: "🔷 Pledged to [Shogunate: Way of Sincerity]",
              desc: "Join the Shinsengumi and Tokugawa clan. Uphold the 'Makoto' oath to protect peace and law!"
            },
            "ja": {
              name: "🔷【佐幕・誠の忠道】に投ず",
              desc: "新選組と徳川幕府に身を捧げ、天然理心流の誠心を以て、天下の秩序と京都の泰平を守り抜け！"
            }
          }
        },
        {
          id: "ishin",
          name: "🔶 投身【尊皇・倒幕維新】",
          desc: "攜手坂本龍馬與維新志士，打破幕府鎖國因襲，為了迎來萬民平等之新時代奮戰！",
          faction: "ishin",
          dialogue: [
            { speaker: "坂本龍馬", text: "哈哈！我就知道你是個有眼光的好漢！與我一同航向世界的大海，開拓新日本吧！" },
            { speaker: "你", text: "舊木不破，新芽不生。這場時代的黎明，我必親手斬開！" }
          ],
          translations: {
            "zh-TW": {
              name: "🔶 投身【尊皇・倒幕維新】",
              desc: "攜手坂本龍馬與維新志士，打破幕府鎖國因襲，為了迎來萬民平等之新時代奮戰！"
            },
            "en": {
              name: "🔶 Pledged to [Imperial Restoration: New Dawn]",
              desc: "Join Ryoma Sakamoto and patriots to shatter feudal shackles and welcome an era of liberty!"
            },
            "ja": {
              name: "🔶【尊皇・討幕維新】に投ず",
              desc: "坂本龍馬や志士たちと手を携え、鎖国の因習を打破し、万民平等の新時代を切り開け！"
            }
          }
        },
        {
          id: "shura",
          name: "🔴 覺醒【修羅・妖刀劍鬼】",
          desc: "斬斷一切陣營羈絆！人活於世，唯求刀之極致。不尊朝廷、不事將軍，化身唯我獨尊之劍鬼！",
          faction: "shura",
          dialogue: [
            { speaker: "千子村正之靈", text: "嘻嘻嘻...撕碎這些偽善的旗號吧！用百萬武士之鮮血，餵飽你我之饑渴！" },
            { speaker: "你", text: "神擋殺神，佛擋殺佛。這世間，只需我一人一刀即可！" }
          ],
          translations: {
            "zh-TW": {
              name: "🔴 覺醒【修羅・妖刀劍鬼】",
              desc: "斬斷一切陣營羈絆！人活於世，唯求刀之極致。不尊朝廷、不事將軍，化身唯我獨尊之劍鬼！"
            },
            "en": {
              name: "🔴 Awakened as [Shura: Blood-Cursed Asura]",
              desc: "Sever all allegiance! Seek only the summit of the blade. Worship no lord, become the unrivaled Asura!"
            },
            "ja": {
              name: "🔴【修羅・妖刀の剣鬼】へ覚醒",
              desc: "一切の陣営の絆を断つ！求むるは剣の極みのみ。朝廷にも将軍にも仕えず、唯我独尊の剣鬼とならん！"
            }
          }
        }
      ],
      introDialogue: [
        { speaker: "土方歲三", text: "（新選組副長）京都的秩序，由局中法度維繫！違背法度者，切腹不赦！" },
        { speaker: "坂本龍馬", text: "（海援隊隊長）土方兄，時代已經變了！拘泥於小小的江戶，日本將被列強吞噬！" },
        { speaker: "神秘盲劍客", text: "天下、幕府、維新...不過是強者欺凌弱者的藉口。唯有絕頂之殺道，才是永恆真理！" }
      ],
      bossDialogue: [
        { speaker: "示現流狂徒・大石", text: "吵死了！不管你們是什麼流派，嚐嚐我示現流的一之太刀吧！" },
        { speaker: "你", text: "今日在此，為我的信念祭刀！" }
      ],
      clearDialogue: [
        { speaker: "旁白", text: "大石太刀折斷，三條夜雨漸歇。你的名號如同疾雷般傳遍天下，而北方的越後雪原已掀起狂暴風雪..." }
      ],
      translations: {
        "zh-TW": {
          title: "第三幕・京都三條與命運分歧之夜",
          summary: "京都三條街頭，刀光霍霍。尊王壤夷的狂熱、新選組的嚴苛肅殺、以及暗流湧動的修羅妖氣在此劇烈碰撞！",
          choicePrompt: "⚡ 【天命決斷】三條之夜已至，你腰間之名刀，將為誰而揮斬？",
          introDialogue: [
            { speaker: "土方歲三", text: "（新選組副長）京都的秩序，由局中法度維繫！違背法度者，切腹不赦！" },
            { speaker: "坂本龍馬", text: "（海援隊隊長）土方兄，時代已經變了！拘泥於小小的江戶，日本將被列強吞噬！" },
            { speaker: "神秘盲劍客", text: "天下、幕府、維新...不過是強者欺凌弱者的藉口。唯有絕頂之殺道，才是永恆真理！" }
          ],
          bossDialogue: [
            { speaker: "示現流狂徒・大石", text: "吵死了！不管你們是什麼流派，嚐嚐我示現流的一之太刀吧！" },
            { speaker: "你", text: "今日在此，為我的信念祭刀！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "大石太刀折斷，三條夜雨漸歇。你的名號如同疾雷般傳遍天下，而北方的越後雪原已掀起狂暴風雪..." }
          ]
        },
        "en": {
          title: "Act III: Sanjo Bridge & The Night of Destiny",
          summary: "Blades flash along Kyoto's Sanjo streets. Shogunate steel, revolutionary fire, and dark asura bloodthirst collide in the moonlight!",
          choicePrompt: "⚡ [Destiny Decreed] The Sanjo night falls. For whom shall your sacred katana strike?",
          introDialogue: [
            { speaker: "土方歲三", text: "(Vice-Commander) The peace of Kyoto is kept by our Iron Code! Disobey, and seppuku is your only mercy!" },
            { speaker: "坂本龍馬", text: "(Kaientai Captain) Hijikata-san, the world has shifted! Clinging to old Edo will leave our land devoured by western empires!" },
            { speaker: "神秘盲劍客", text: "Shogunate, Empire, Revolution... mere pretenses for wolves. Only the ultimate path of slaughter is absolute truth!" }
          ],
          bossDialogue: [
            { speaker: "示現流狂徒・大石", text: "Silence! Whatever your petty banner, taste the lethal first-strike of my Jigen-ryu!" },
            { speaker: "你", text: "Tonight on this bridge, my steel seals my eternal conviction! Die!" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "Oishi's nodachi shatters in two as the rain over Sanjo clears. Your renown reverberates across the land like thunder, while white fury brews in the snowy peaks of Echigo..." }
          ]
        },
        "ja": {
          title: "第三幕・京都三条と運命分岐の夜",
          summary: "月下の京都三条大橋。新選組の誠心、維新志士の熱気、そして血を啜る修羅の妖気が激突する！",
          choicePrompt: "⚡【天命決断】三条の夜更け。其方の腰の刀は、誰がために振るわれるや？",
          introDialogue: [
            { speaker: "土方歲三", text: "（新選組副長）京の治安は局中法度によって保たれる！背く者に待つは切腹のみ！" },
            { speaker: "坂本龍馬", text: "（海援隊隊長）土方さん、時代は動いとるぜよ！小さな江戸に囚われちょったら、日本は異国に呑み込まれる！" },
            { speaker: "神秘盲劍客", text: "幕府、維新、大義...すべては強者の言い訳に過ぎぬ。白刃がもたらす殺道こそが、永遠の真理よ！" }
          ],
          bossDialogue: [
            { speaker: "示現流狂徒・大石", text: "やかましい！何流であろうと、示現流の一の太刀を喰らってみよ！チェストォォ！" },
            { speaker: "你", text: "今宵この橋の上、我が選んだ信念の刃の露と消えよ！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "大石の太刀は砕け散り、三条の夜雨は止んだ。其方の武名は疾雷の如く天下を駆け巡り、北の越後雪原に狂暴なる吹雪が巻き起こる..." }
          ]
        }
      }
    },
    {
      act: 4,
      zoneId: 4,
      title: "第四幕・越後雪嶺與軍神傳承",
      summary: "毘沙門天的軍旗在嚴寒中獵獵作響。在終年不化的霜雪古關上，長尾景連率領雪嶺鐵騎嚴陣以待。",
      introDialogue: [
        { speaker: "旁白", text: "毘沙門天的軍旗在嚴寒中獵獵作響，雪嶺古關前殺氣凜然。" }
      ],
      branchFlavor: {
        shogunate: "德川幕府密令：收編越後殘餘勢力，切勿讓雪嶺鐵騎倒向西國志士。",
        ishin: "龍馬密函：越後之地民風剛毅，若能擊退守將，必能為倒幕大軍打開北方糧道。",
        shura: "村正低語：軍神上杉之血脈...其冰冷刺骨的鬥氣，正是淬鍊妖刀的絕佳食糧。"
      },
      bossDialogue: [
        { speaker: "雪將軍・長尾景連", text: "吾乃軍神後裔！在毘沙門天的神威面前，任何企圖踏過雪關者，唯有凍斃一途！" },
        { speaker: "你", text: "雪再寒，也凍不住我沸騰的劍意！" }
      ],
      clearDialogue: [
        { speaker: "旁白", text: "霜雪刀聖長尾長嘆一聲，將祖傳寶刀相贈。穿過雪原，南方的本能寺突然騰起沖天烈焰..." }
      ],
      translations: {
        "zh-TW": {
          title: "第四幕・越後雪嶺與軍神傳承",
          summary: "毘沙門天的軍旗在嚴寒中獵獵作響。在終年不化的霜雪古關上，長尾景連率領雪嶺鐵騎嚴陣以待。",
          branchFlavor: {
            shogunate: "德川幕府密令：收編越後殘餘勢力，切勿讓雪嶺鐵騎倒向西國志士。",
            ishin: "龍馬密函：越後之地民風剛毅，若能擊退守將，必能為倒幕大軍打開北方糧道。",
            shura: "村正低語：軍神上杉之血脈...其冰冷刺骨的鬥氣，正是淬鍊妖刀的絕佳食糧。"
          },
          bossDialogue: [
            { speaker: "雪將軍・長尾景連", text: "吾乃軍神後裔！在毘沙門天的神威面前，任何企圖踏過雪關者，唯有凍斃一途！" },
            { speaker: "你", text: "雪再寒，也凍不住我沸騰的劍意！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "霜雪刀聖長尾長嘆一聲，將祖傳寶刀相贈。穿過雪原，南方的本能寺突然騰起沖天烈焰..." }
          ]
        },
        "en": {
          title: "Act IV: Echigo Snows & Legacy of the War God",
          summary: "The banners of Bishamonten flutter in bitter blizzards. Atop the frozen pass, General Nagao Kagetsura awaits with iron-clad snow riders.",
          branchFlavor: {
            shogunate: "Tokugawa Secret Order: Secure Echigo's riders; allow none to aid western rebels.",
            ishin: "Ryoma's Letter: Echigo's folk are steadfast. Break through to open northern supply lines.",
            shura: "Muramasa's Whispers: The bloodline of Kenshin... their frozen battle-aura shall feed our hunger."
          },
          bossDialogue: [
            { speaker: "雪將軍・長尾景連", text: "I am kin to the God of War! Before the might of Bishamonten, all who trespass shall freeze in agony!" },
            { speaker: "你", text: "Though snow cuts like ice, it cannot chill my burning blade! Face me!" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "The frostbound general sighs, offering his heirloom blade in tribute. Past the snowy wastes, towering flames erupt from distant Honnoji..." }
          ]
        },
        "ja": {
          title: "第四幕・越後雪嶺と軍神の伝承",
          summary: "毘沙門天の軍旗が白銀の吹雪に翻る。凍てつく春日山の関所にて、長尾景連率いる雪州鉄騎が白刃を研ぎ澄ます。",
          branchFlavor: {
            shogunate: "幕府密令：越後の諸将を糾合し、雪州の精鋭が西国志士に組するを防げ。",
            ishin: "龍馬の密書：越後の民は剛毅。守将を退ければ、倒幕軍の北国補給路が拓かれん。",
            shura: "村正の囁き：軍神上杉の血統...その骨まで凍る闘気こそ、我が妖刀の至高の糧ぞ。"
          },
          bossDialogue: [
            { speaker: "雪將軍・長尾景連", text: "我は軍神の末裔！毘沙門天の威光の前には、関を越えんとする者に凍死あるのみ！" },
            { speaker: "你", text: "雪がどれほど冷たかろうと、我が滾る剣気を凍らせることは叶わぬ！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "霜雪の将は嘆息し、家伝の名刀を託す。雪原を抜けた南方、古刹・本能寺より突如として業火が天を焦がす..." }
          ]
        }
      }
    },
    {
      act: 5,
      zoneId: 5,
      title: "第五幕・本能寺與天魔狂瀾",
      summary: "昔日織田信長殞命之地，業火歷經數百年依舊不滅。第六天魔王的怨念具象化為無盡火海，阻絕了通往天下的道路！",
      introDialogue: [
        { speaker: "旁白", text: "本能寺火海沖天，第六天魔王的怨念在業火中凝聚成形。" }
      ],
      branchFlavor: {
        shogunate: "信長的野望正是天下動亂之根源！為了德川家的萬世安寧，必須將這股烈焰徹底斬滅！",
        ishin: "信長當年的天下布武雖未竟全功，但其開拓創新之志永存。越過這片業火，新時代就在前方！",
        shura: "第六天魔王的怨念？太美妙了...吞噬了你，我的修羅之刃便能直達神境！"
      },
      bossDialogue: [
        { speaker: "第六天魔王・信長殘影", text: "人間五十年，下天如夢幻...宵小武士，亦敢向天魔拔刀乎？！" },
        { speaker: "你", text: "夢幻已逝，執念當消。信長，收下我這一記奧義！" }
      ],
      clearDialogue: [
        { speaker: "旁白", text: "業火如星雨般消散，信長發出豪邁大笑融入虛空。關原古戰場的十萬亡魂，已在血河中感召著你的到來..." }
      ],
      translations: {
        "zh-TW": {
          title: "第五幕・本能寺與天魔狂瀾",
          summary: "昔日織田信長殞命之地，業火歷經數百年依舊不滅。第六天魔王的怨念具象化為無盡火海，阻絕了通往天下的道路！",
          branchFlavor: {
            shogunate: "信長的野望正是天下動亂之根源！為了德川家的萬世安寧，必須將這股烈焰徹底斬滅！",
            ishin: "信長當年的天下布武雖未竟全功，但其開拓創新之志永存。越過這片業火，新時代就在前方！",
            shura: "第六天魔王的怨念？太美妙了...吞噬了你，我的修羅之刃便能直達神境！"
          },
          bossDialogue: [
            { speaker: "第六天魔王・信長殘影", text: "人間五十年，下天如夢幻...宵小武士，亦敢向天魔拔刀乎？！" },
            { speaker: "你", text: "夢幻已逝，執念當消。信長，收下我這一記奧義！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "業火如星雨般消散，信長發出豪邁大笑融入虛空。關原古戰場的十萬亡魂，已在血河中感召著你的到來..." }
          ]
        },
        "en": {
          title: "Act V: Honnoji Ablaze & The Demon King",
          summary: "The embers where Oda Nobunaga perished still smolder with demonic fury. Manifested from centuries of vengeance, the Demon King blocks the path to the realm.",
          branchFlavor: {
            shogunate: "Nobunaga's unchecked ambition sparked centuries of war. For Tokugawa's eternal peace, this demonic fire must be snuffed out!",
            ishin: "Though Nobunaga fell, his visionary courage lives on. Leap through this inferno—the dawn of modern Japan awaits on the other side!",
            shura: "The vengeance of the Sixth Demon King? Magnificent! Devouring your soul will elevate my Asura blade into godhood!"
          },
          bossDialogue: [
            { speaker: "第六天魔王・信長殘影", text: "A life of fifty years is but an illusion under heaven... How dare a mere mortal draw steel against the Demon King?!" },
            { speaker: "你", text: "The illusion has shattered; let your obsession sleep. Nobunaga, take this secret strike!" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "Flames scatter like stardust as Nobunaga roars with laughter and dissolves into the void. At the bloody plains of Sekigahara, ten thousand fallen souls beckon..." }
          ]
        },
        "ja": {
          title: "第五幕・本能寺と天魔の狂瀾",
          summary: "織田信長が業火に散りし本能寺。数百年の怨嗟が焔となって渦巻き、天下への道を阻む！",
          branchFlavor: {
            shogunate: "信長の野望こそ天下動乱の火種。徳川の泰平のため、この不浄の火焔を断ち滅ぼさねばならぬ！",
            ishin: "信長の天下布武は中途にして倒れたが、その先取の志は不滅。この業火を越え、新時代の夜明けへ進め！",
            shura: "第六天魔王の怨嗟か...至高の美味よ。貴様の魂を喰らいて、我が修羅の剣は神域へと至る！"
          },
          bossDialogue: [
            { speaker: "第六天魔王・信長殘影", text: "人間五十年、下天の内をくらぶれば夢幻の如くなり...名もなき侍が、天魔たる余に刃を向けるかッ！" },
            { speaker: "你", text: "夢幻は既に潰えた。執着を捨てて眠るがよい、信長！我が奥義を受けよ！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "業火は星屑の如く散り、信長は豪快に笑いながら虚空へと消えた。関ヶ原の古戦場にて、十万の亡霊が血の河より其方を呼んでいる..." }
          ]
        }
      }
    },
    {
      act: 6,
      zoneId: 6,
      title: "第六幕・關原血河與十萬悲鳴",
      summary: "慶長五年的修羅戰場，東軍與西軍的甲冑與怨靈互相糾纏。赤鬼井伊的殘念揮舞著染血大槍，誓要將踏入者盡數腰斬。",
      introDialogue: [
        { speaker: "旁白", text: "關原古戰場血河翻湧，十萬亡魂的悲鳴在寒夜中迴響。" }
      ],
      branchFlavor: {
        shogunate: "關原是德川開創泰平之聖地，容不得妖魔怨靈玷污先烈的英魂！",
        ishin: "關原之戰奠定了兩百餘年的舊制度，今日便由我來為這場戰國悲劇徹底畫上句號！",
        shura: "十萬亡魂之怨氣？盡情嚎哭吧！你們的悲鳴，不過是修羅狂舞時最動聽的管弦樂！"
      },
      bossDialogue: [
        { speaker: "赤鬼修羅・井伊殘念", text: "井伊赤備，死戰不退！天下大亂，殺！殺！殺！" },
        { speaker: "你", text: "赤鬼，你的執念該在此安息了！斬！" }
      ],
      clearDialogue: [
        { speaker: "旁白", text: "關原血河化為清泉，英靈們默默向你致意。江戶城的天守閣已在眼前，終焉之考驗即將來臨..." }
      ],
      translations: {
        "zh-TW": {
          title: "第六幕・關原血河與十萬悲鳴",
          summary: "慶長五年的修羅戰場，東軍與西軍的甲冑與怨靈互相糾纏。赤鬼井伊的殘念揮舞著染血大槍，誓要將踏入者盡數腰斬。",
          branchFlavor: {
            shogunate: "關原是德川開創泰平之聖地，容不得妖魔怨靈玷污先烈的英魂！",
            ishin: "關原之戰奠定了兩百餘年的舊制度，今日便由我來為這場戰國悲劇徹底畫上句號！",
            shura: "十萬亡魂之怨氣？盡情嚎哭吧！你們的悲鳴，不過是修羅狂舞時最動聽的管弦樂！"
          },
          bossDialogue: [
            { speaker: "赤鬼修羅・井伊殘念", text: "井伊赤備，死戰不退！天下大亂，殺！殺！殺！" },
            { speaker: "你", text: "赤鬼，你的執念該在此安息了！斬！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "關原血河化為清泉，英靈們默默向你致意。江戶城的天守閣已在眼前，終焉之考驗即將來臨..." }
          ]
        },
        "en": {
          title: "Act VI: Blood River of Sekigahara & Ten Thousand Cries",
          summary: "The catastrophic killing fields of 1600. Armor-clad specters of East and West clash perpetually in rivers of crimson as the Red Devil Ii sweeps his bloody spear.",
          branchFlavor: {
            shogunate: "Sekigahara is where the Tokugawa established sacred peace. No demon shall tarnish our ancestors' honor!",
            ishin: "Sekigahara forged two centuries of feudal stagnation. Tonight, my blade puts an end to this Sengoku tragedy forever!",
            shura: "Ten thousand screaming ghosts? Weep louder! Your cries are but sweet strings accompanying my dance of slaughter!"
          },
          bossDialogue: [
            { speaker: "赤鬼修羅・井伊殘念", text: "The Red Brigade never surrenders! Let the world drown in blood—kill, kill, kill!" },
            { speaker: "你", text: "Red Devil, your wrath ends tonight! Cleave into eternity!" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "The bloody rivers run clear as heroic spirits bow in silent reverence. The towering keep of Edo Castle rises ahead—the final reckoning is at hand..." }
          ]
        },
        "ja": {
          title: "第六幕・関ヶ原の血河と十万の慟哭",
          summary: "慶長五年の決戦場。東西両軍の鎧武者と怨霊が交錯する血の河にて、赤鬼・井伊の怨念が朱槍を振るう。",
          branchFlavor: {
            shogunate: "関ヶ原は徳川が泰平を開きし聖地。英霊の眠りを汚す怨霊ども、一匹たりとも生かしてはおかぬ！",
            ishin: "関ヶ原こそ旧体制の起点。この戦国の悲劇に、今宵こそ我が剣で終止符を打つ！",
            shura: "十万の亡霊の怨嗟か？もっと泣き叫べ！貴様らの悲鳴こそ、修羅の舞を彩る最高の奏楽ぞ！"
          },
          bossDialogue: [
            { speaker: "赤鬼修羅・井伊殘念", text: "井伊の赤備え、一歩も退かぬ！天下大乱、殺せ！殺し尽くせ！" },
            { speaker: "你", text: "赤鬼よ、其方の執念もここまでだ。安らかに眠れ！一刀両断！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "血の河は清き泉へと還り、英霊たちは静かに一礼を捧げた。江戸城の天守閣は目前、終焉の試練が訪れんとする..." }
          ]
        }
      }
    },
    {
      act: 7,
      zoneId: 7,
      title: "第七幕・江戶天守與天下終焉",
      summary: "江戶城最高極頂，傳說中的劍聖宮本武藏之魂在此鎮守。擊敗他，你的命運之路將迎來真正的歷史大結局！",
      introDialogue: [
        { speaker: "旁白", text: "江戶天守最高極頂，傳奇劍聖的英靈在此守候著最後的武士。" }
      ],
      branchFlavor: {
        shogunate: "在將軍御座之前，證明你的忠信之道足以繼承天下泰平之大業！",
        ishin: "在天守之巔宣告舊幕之終結，親手點亮明治維新的萬里曙光！",
        shura: "擊碎最後的劍聖，以人劍合一的修羅狂骨，登基為古往今來唯一的無雙劍神！"
      },
      bossDialogue: [
        { speaker: "天下無雙・宮本武藏之魂", text: "兵法者，無之至境也。浪人，展現你旅途所得之劍理吧！" },
        { speaker: "你", text: "這就是我的道！二天一流，請指教！" }
      ],
      clearDialogue: [
        { speaker: "旁白", text: "雙刀垂下，劍聖露出了讚許的微笑。歷史的帷幕由此落下，你的傳說寫入了日本歷史之長河..." }
      ],
      translations: {
        "zh-TW": {
          title: "第七幕・江戶天守與天下終焉",
          summary: "江戶城最高極頂，傳說中的劍聖宮本武藏之魂在此鎮守。擊敗他，你的命運之路將迎來真正的歷史大結局！",
          branchFlavor: {
            shogunate: "在將軍御座之前，證明你的忠信之道足以繼承天下泰平之大業！",
            ishin: "在天守之巔宣告舊幕之終結，親手點亮明治維新的萬里曙光！",
            shura: "擊碎最後的劍聖，以人劍合一的修羅狂骨，登基為古往今來唯一的無雙劍神！"
          },
          bossDialogue: [
            { speaker: "天下無雙・宮本武藏之魂", text: "兵法者，無之至境也。浪人，展現你旅途所得之劍理吧！" },
            { speaker: "你", text: "這就是我的道！二天一流，請指教！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "雙刀垂下，劍聖露出了讚許的微笑。歷史的帷幕由此落下，你的傳說寫入了日本歷史之長河..." }
          ]
        },
        "en": {
          title: "Act VII: Edo Castle Keep & The End of All",
          summary: "Atop the soaring roof of Edo Castle, the legendary spirit of Miyamoto Musashi stands guard. Triumph here to crown your historical destiny.",
          branchFlavor: {
            shogunate: "Before the Shogun's throne, prove that your Way of Sincerity is worthy of carrying the realm's peace!",
            ishin: "Atop the highest keep, declare the end of the old Shogunate and usher in the brilliant dawn of the Meiji Restoration!",
            shura: "Shatter the final Sword Saint. With blade and bone merged as one, ascend as the solitary God of Blades across all time!"
          },
          bossDialogue: [
            { speaker: "天下無雙・宮本武藏之魂", text: "The zenith of the sword is the Realm of Emptiness. Wandering ronin, show me the truth forged upon your long journey!" },
            { speaker: "你", text: "This is my way! Niten Ichi-ryu, witness my resolve!" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "Lowering his twin blades, the Sword Saint offers an approving smile. The great curtain of history falls, inscribing your name upon the river of eternity..." }
          ]
        },
        "ja": {
          title: "第七幕・江戸天守と天下の終焉",
          summary: "江戸城天守の最高峰。伝説の剣聖・宮本武蔵の魂が静かに待ち受ける。これに勝利せば、真の歴史結末が刻まれん！",
          branchFlavor: {
            shogunate: "将軍の御座の前、其方の誠の忠道が天下泰平の大業を継ぐに足ることを証明してみせよ！",
            ishin: "天守の頂にて旧幕府の終焉を告げ、明治維新の輝かしき黎明をその手で拓け！",
            shura: "最後の剣聖を粉砕せよ。人剣一体の修羅骨を以て、古今無双の剣神として君臨すべし！"
          },
          bossDialogue: [
            { speaker: "天下無雙・宮本武藏之魂", text: "兵法とは『空』の至境なり。浪人よ、其方が旅路にて掴みし剣理を見せてみよ！" },
            { speaker: "你", text: "これぞ我が信じる剣の道！二天一流、いざ尋常に勝負！" }
          ],
          clearDialogue: [
            { speaker: "旁白", text: "二刀を下ろし、剣聖は満足げに微笑んだ。歴史の幕は静かに下り、其方の伝説は日本史の大河へと刻まれた..." }
          ]
        }
      }
    }
  ],

  // 四大最終結局 (Endings)
  endings: {
    ending_shogunate: {
      id: "ending_shogunate",
      title: "【史詩結局・最後武士之誓】",
      faction: "shogunate",
      color: "#38bdf8",
      icon: "🏯",
      tagline: "以誠立世，名留青史的幕府大劍豪",
      epilogue: `在江戶天守之巔擊敗劍聖後，你選擇堅守最後的忠道。
你手持【和泉守兼定】，並肩於近藤勇與土方歲三身旁，成為新選組不可動搖的磐石。
縱使時代的巨輪終將向前，你以一生之劍技，護衛了江戶城百萬百姓無血開城，
天下之人皆尊稱你為『幕末最後之義劍』，你的名字與『誠』字旗幟一同永垂不朽。`,
      rewardTitle: "【幕臣・最後之大義】",
      karmaReward: 200,
      translations: {
        "zh-TW": {
          title: "【史詩結局・最後武士之誓】",
          tagline: "以誠立世，名留青史的幕府大劍豪",
          epilogue: `在江戶天守之巔擊敗劍聖後，你選擇堅守最後的忠道。
你手持【和泉守兼定】，並肩於近藤勇與土方歲三身旁，成為新選組不可動搖的磐石。
縱使時代的巨輪終將向前，你以一生之劍技，護衛了江戶城百萬百姓無血開城，
天下之人皆尊稱你為『幕末最後之義劍』，你的名字與『誠』字旗幟一同永垂不朽。`,
          rewardTitle: "【幕臣・最後之大義】"
        },
        "en": {
          title: "[Epic Ending: The Last Samurai's Vow]",
          tagline: "Living with Sincerity: The immortal swordsman of the Shogunate",
          epilogue: `After besting the Sword Saint upon Edo's keep, you chose the path of ultimate loyalty.
With Izumi-no-Kami Kanesada in hand, standing alongside Kondo Isami and Hijikata Toshizo, you became the unyielding pillar of the Shinsengumi.
Though the gears of time turn ever onward, your peerless steel ensured the peaceful, bloodless surrender of Edo Castle, sparing a million souls.
The people revere you as 'The Last Righteous Blade of the Bakumatsu,' your legend enshrined beneath the banner of Sincerity forever.`,
          rewardTitle: "[Shogunate: The Last Righteous Blade]"
        },
        "ja": {
          title: "【史詩結末・最後の一刀の誓い】",
          tagline: "誠を胸に生き、歴史に名を刻みし幕府の大剣豪",
          epilogue: `江戸城天守の頂にて剣聖を破りし後、其方は最後まで忠義の道を貫くことを選んだ。
【和泉守兼定】を手に、近藤勇・土方歳三と肩を並べ、新選組の揺るぎなき不動の礎となる。
時代の激流が如何に押し寄せようとも、其方の一生の剣技は江戸城百万の民を救う無血開城を成し遂げた。
世の人々は其方を『幕末最後の義剣』と崇め、その武名は『誠』の旗印と共に永遠に語り継がれる。`,
          rewardTitle: "【幕臣・最後の大義】"
        }
      }
    },
    ending_ishin: {
      id: "ending_ishin",
      title: "【史詩結局・新時代之黎明】",
      faction: "ishin",
      color: "#f59e0b",
      icon: "🌅",
      tagline: "破除舊體制，斬開近代日本曙光之先驅",
      epilogue: `在天守閣頂，你長嘯一聲，將手中染血的名刀收入白木刀鞘。
你與坂本龍馬、西鄉隆盛促成了薩長同盟與大政奉還，
舊幕府的閉關鎖國煙消雲散，蒸汽火車與西洋帆船航向橫濱港。
你沒有接受新政府的高官厚祿，而是背負著行囊，踏上走向世界的大海。
世人稱你為『斬斷黑夜的黎明先驅』，新時代的春風為你吹拂。`,
      rewardTitle: "【維新・天下一新之刃】",
      karmaReward: 200,
      translations: {
        "zh-TW": {
          title: "【史詩結局・新時代之黎明】",
          tagline: "破除舊體制，斬開近代日本曙光之先驅",
          epilogue: `在天守閣頂，你長嘯一聲，將手中染血的名刀收入白木刀鞘。
你與坂本龍馬、西鄉隆盛促成了薩長同盟與大政奉還，
舊幕府的閉關鎖國煙消雲散，蒸汽火車與西洋帆船航向橫濱港。
你沒有接受新政府的高官厚祿，而是背負著行囊，踏上走向世界的大海。
世人稱你為『斬斷黑夜的黎明先驅』，新時代的春風為你吹拂。`,
          rewardTitle: "【維新・天下一新之刃】"
        },
        "en": {
          title: "[Epic Ending: Dawn of the New Age]",
          tagline: "Shattering the old world: Pioneer who forged the dawn of modern Japan",
          epilogue: `Atop the soaring keep, you breathed deeply and returned your battle-tested blade into its wooden scabbard.
Alongside Sakamoto Ryoma and Saigo Takamori, you brought about the Satsuma-Choshu Alliance and the Restoration of Imperial Rule.
The old feudal isolation evaporated; steam locomotives roared and ironclads sailed into Yokohama Harbor.
Refusing ministerial titles and riches from the new government, you hoisted a traveler's pack and boarded a vessel into the boundless sea.
The world remembers you as 'The Pioneer Who Cleaved the Dark,' as spring breezes of the new era carry your tale forward.`,
          rewardTitle: "[Restoration: Blade of the New World]"
        },
        "ja": {
          title: "【史詩結末・新時代の夜明け】",
          tagline: "旧体制を打破し、近代の曙光を切り拓きし先駆者",
          epilogue: `天守の頂にて長嘯一番、血に染まりし名刀を白木の鞘へと納める。
其方は坂本龍馬、西郷隆盛と共に薩長同盟と大政奉還を成し遂げた。
旧幕府の鎖国政策は露と消え、蒸気機関車と黒船が横浜港へと押し寄せる。
新政府の高官厚禄を固辞し、一竿の荷を背負いて大海原へと旅立つ。
世人は其方を『夜を切り裂きし黎明の先駆者』と呼び、新時代の春風がその背を押し続ける。`,
          rewardTitle: "【維新・天下一新の刃】"
        }
      }
    },
    ending_shura: {
      id: "ending_shura",
      title: "【極致結局・無間修羅劍神】",
      faction: "shura",
      color: "#ef4444",
      icon: "🩸",
      tagline: "超越神魔，無敵於天下之妖刀之鬼",
      epilogue: `你擊碎了宮本武藏的二天一流，千子村正的妖氣貫穿天地。
不服從任何將軍，不守護任何國家，
你將萬物視為可斬之草芥，人即是刀，刀即是人。
傳說在暴風雨之夜，若有武士於江戶城頂拔刀，
依然能看見一道猩紅的雷光劃破夜空——那是墮入修羅道的你，依然在追尋無盡的斬擊。`,
      rewardTitle: "【無雙・人刃一體修羅鬼】",
      karmaReward: 250,
      translations: {
        "zh-TW": {
          title: "【極致結局・無間修羅劍神】",
          tagline: "超越神魔，無敵於天下之妖刀之鬼",
          epilogue: `你擊碎了宮本武藏的二天一流，千子村正的妖氣貫穿天地。
不服從任何將軍，不守護任何國家，
你將萬物視為可斬之草芥，人即是刀，刀即是人。
傳說在暴風雨之夜，若有武士於江戶城頂拔刀，
依然能看見一道猩紅的雷光劃破夜空——那是墮入修羅道的你，依然在追尋無盡的斬擊。`,
          rewardTitle: "【無雙・人刃一體修羅鬼】"
        },
        "en": {
          title: "[Ultimate Ending: Infinite Asura Blade God]",
          tagline: "Surpassing gods and demons: The invincible demon of bloodstained blades",
          epilogue: `You shattered the twin swords of Miyamoto Musashi; the demonic aura of Senji Muramasa pierced the heavens.
Bowing to no Shogun, serving no emperor,
you regard all creation as fleeting weeds waiting to be severed. The man is the blade; the blade is the man.
Legend whispers that on stormy nights atop Edo Castle, a streak of crimson lightning still rends the black clouds—it is you, fallen into the Asura realm, hunting for the eternal strike.`,
          rewardTitle: "[Peerless: Asura Incarnate]"
        },
        "ja": {
          title: "【極限結末・無間修羅の剣神】",
          tagline: "神魔をも超越し、天下無敵となりし妖刀の鬼",
          epilogue: `宮本武蔵の二天一流を打ち砕き、千子村正の妖気が天を貫く。
いかなる将軍にも従わず、いかなる国家も守らず。
森羅万象をただ斬るべき草芥と見做し、人は刃となり、刃は人となった。
嵐の夜、江戸城の天守にて抜刀せし侍は、天空を引き裂く真紅の稲妻を目撃するという――修羅道へと堕ちし其方が、今なお果てなき斬撃を追い求めているのだ。`,
          rewardTitle: "【無双・人刃一体の修羅鬼】"
        }
      }
    },
    ending_hermit: {
      id: "ending_hermit",
      title: "【隱藏結局・浪人茶屋之閒鶴】",
      faction: "unaligned",
      color: "#10b981",
      icon: "🍵",
      tagline: "看破世間爭端，笑傲風月的天涯逸客",
      epilogue: `在歷經天下名刀之爭與血海廝殺後，你領悟了柳生宗嚴『活人劍』的最高真諦：
不斬之斬，心如止水。
你脫下甲冑，於京都一隅開了一間浪人茶屋，掛起紅燈籠與寄書板。
每當有初出茅廬的年輕武士路過，你便為他沏上一壺煎茶，淡然講述當年的天下五劍傳說。
萬象皆空，唯有茶香悠長。`,
      rewardTitle: "【名宿・茶境無刀之宗】",
      karmaReward: 150,
      translations: {
        "zh-TW": {
          title: "【隱藏結局・浪人茶屋之閒鶴】",
          tagline: "看破世間爭端，笑傲風月的天涯逸客",
          epilogue: `在歷經天下名刀之爭與血海廝殺後，你領悟了柳生宗嚴『活人劍』的最高真諦：
不斬之斬，心如止水。
你脫下甲冑，於京都一隅開了一間浪人茶屋，掛起紅燈籠與寄書板。
每當有初出茅廬的年輕武士路過，你便為他沏上一壺煎茶，淡然講述當年的天下五劍傳說。
萬象皆空，唯有茶香悠長。`,
          rewardTitle: "【名宿・茶境無刀之宗】"
        },
        "en": {
          title: "[Hidden Ending: White Crane of the Ronin Teahouse]",
          tagline: "Transcending worldly strife: The wandering hermit enjoying tea and wind",
          epilogue: `After decades of blade-forging contests and rivers of blood, you grasped the supreme truth of the 'Life-Giving Sword':
The highest strike is the blade that need never cut; mind as quiet as still water.
Setting aside steel and armor, you opened a quiet teahouse in a cobblestone lane of Kyoto, hanging a crimson lantern.
Whenever aspiring young swordsmen stop by, you pour hot sencha and gently recount the legends of the Tenka-Goken.
All mortal glories fade; only the quiet fragrance of tea lingers.`,
          rewardTitle: "[Master: Sage of the No-Blade Teahouse]"
        },
        "ja": {
          title: "【隠し結末・浪人茶屋の閑鶴】",
          tagline: "世俗の争いを看破し、風月を愛でる天涯の隠者",
          epilogue: `天下の名刀を巡る争乱と血みどろの修羅場を越え、其方は柳生宗厳『活人剣』の真髄を悟った。
斬らぬことこそ至高の剣、心は明鏡止水の如し。
具足を脱ぎ捨て、京の路地裏に一軒の浪人茶屋を開き、赤提灯と目安箱を掲げる。
若き侍が通りかかるたび、熱き煎茶を点て、かつて天下五剣を巡りて戦いし物語を静かに語り聞かせる。
万象は皆空なり、ただ茶の香りぞ悠久に薫る。`,
          rewardTitle: "【名宿・茶境無刀の宗匠】"
        }
      }
    }
  }
};

// 取得多國語系章節情報 (Get Localized Chapter)
window.getStoryChapterText = function(actNum, lang) {
  lang = lang || (window.getLang ? window.getLang() : "zh-TW");
  const chapter = window.STORY_DATA.chapters.find(c => c.act === actNum) || window.STORY_DATA.chapters[0];
  if (!chapter) return { title: "", summary: "", introDialogue: [] };
  if (chapter.translations && chapter.translations[lang]) {
    return Object.assign({}, chapter, chapter.translations[lang]);
  }
  return chapter;
};

// 取得多國語系結局情報 (Get Localized Ending)
window.getStoryEndingText = function(endingId, lang) {
  lang = lang || (window.getLang ? window.getLang() : "zh-TW");
  const ed = window.STORY_DATA.endings[endingId];
  if (!ed) return null;
  if (ed.translations && ed.translations[lang]) {
    return Object.assign({}, ed, ed.translations[lang]);
  }
  return ed;
};

// 對話說話者在地化 (Get Localized Speaker Name)
window.getSpeakerText = function(speaker, lang) {
  lang = lang || (window.getLang ? window.getLang() : "zh-TW");
  if (window.SPEAKER_I18N && window.SPEAKER_I18N[speaker] && window.SPEAKER_I18N[speaker][lang]) {
    return window.SPEAKER_I18N[speaker][lang];
  }
  return speaker;
};
